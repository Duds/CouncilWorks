import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/rbac";

/**
 * GET /api/assets/risk-analysis - Get risk analysis for all assets
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetType = searchParams.get("assetType");
    const riskLevel = searchParams.get("riskLevel");
    const sortBy = searchParams.get("sortBy") || "riskScore";
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where: any = {
      organisationId: session.user.organisationId,
    };

    if (assetType) {
      where.assetType = assetType;
    }

    // Get assets with their RCM templates and related data
    const assets = await prisma.asset.findMany({
      where,
      include: {
        rcmTemplates: {
          include: {
            template: {
              include: {
                failureModes: true,
              },
            },
          },
        },
        inspections: {
          orderBy: { inspectionDate: "desc" },
          take: 1,
        },
        maintenance: {
          orderBy: { maintenanceDate: "desc" },
          take: 3,
        },
      },
      take: limit,
    });

    // Calculate risk scores for each asset
    const assetsWithRisk = assets.map(asset => {
      const riskFactors = {
        condition: getConditionRiskScore(asset.condition),
        age: getAgeRiskScore(asset.installationDate, asset.expectedLifespan),
        maintenanceHistory: getMaintenanceRiskScore(asset.maintenance),
        inspectionHistory: getInspectionRiskScore(asset.inspections),
      };

      // Calculate failure mode risk
      const allFailureModes = asset.rcmTemplates.flatMap(rt => rt.template.failureModes);
      const failureModeRisk = allFailureModes.reduce((sum, fm) => {
        const baseRisk = fm.riskScore || (fm.probability || 5) * (fm.impact || 5);
        const adjustedRisk = baseRisk * (getSeverityMultiplier(fm.severity));
        return sum + adjustedRisk;
      }, 0);

      const overallRiskScore = Math.round(
        (Object.values(riskFactors).reduce((sum, score) => sum + score, 0) / 4) * 0.7 +
        (failureModeRisk / Math.max(allFailureModes.length, 1)) * 0.3
      );

      const riskLevel = getRiskLevel(overallRiskScore);

      return {
        id: asset.id,
        name: asset.name,
        assetNumber: asset.assetNumber,
        assetType: asset.assetType,
        condition: asset.condition,
        priority: asset.priority,
        location: asset.address,
        installationDate: asset.installationDate,
        expectedLifespan: asset.expectedLifespan,
        riskFactors,
        overallRiskScore,
        riskLevel,
        failureModeCount: allFailureModes.length,
        criticalFailureModes: allFailureModes.filter(fm => fm.severity === "CRITICAL").length,
        highFailureModes: allFailureModes.filter(fm => fm.severity === "HIGH").length,
        lastInspection: asset.inspections[0]?.inspectionDate,
        lastMaintenance: asset.maintenance[0]?.maintenanceDate,
        maintenanceFrequency: asset.maintenance.length,
      };
    });

    // Filter by risk level if specified
    let filteredAssets = assetsWithRisk;
    if (riskLevel) {
      filteredAssets = assetsWithRisk.filter(asset => asset.riskLevel === riskLevel);
    }

    // Sort by specified criteria
    filteredAssets.sort((a, b) => {
      switch (sortBy) {
        case "riskScore":
          return b.overallRiskScore - a.overallRiskScore;
        case "name":
          return a.name.localeCompare(b.name);
        case "assetType":
          return a.assetType.localeCompare(b.assetType);
        case "condition":
          return getConditionOrder(b.condition) - getConditionOrder(a.condition);
        case "lastInspection":
          return new Date(b.lastInspection || 0).getTime() - new Date(a.lastInspection || 0).getTime();
        default:
          return b.overallRiskScore - a.overallRiskScore;
      }
    });

    // Calculate risk statistics
    const riskStats = {
      total: filteredAssets.length,
      critical: filteredAssets.filter(a => a.riskLevel === "CRITICAL").length,
      high: filteredAssets.filter(a => a.riskLevel === "HIGH").length,
      medium: filteredAssets.filter(a => a.riskLevel === "MEDIUM").length,
      low: filteredAssets.filter(a => a.riskLevel === "LOW").length,
      veryLow: filteredAssets.filter(a => a.riskLevel === "VERY_LOW").length,
      averageRiskScore: Math.round(
        filteredAssets.reduce((sum, a) => sum + a.overallRiskScore, 0) / filteredAssets.length
      ),
    };

    return NextResponse.json({
      assets: filteredAssets,
      riskStats,
      filters: {
        assetType,
        riskLevel,
        sortBy,
        limit,
      },
    });

  } catch (error) {
    console.error("Error generating risk analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate risk analysis" },
      { status: 500 }
    );
  }
}

/**
 * Helper functions for risk calculations
 */
function getConditionRiskScore(condition: string): number {
  switch (condition) {
    case "EXCELLENT": return 1;
    case "GOOD": return 3;
    case "FAIR": return 6;
    case "POOR": return 9;
    case "CRITICAL": return 10;
    default: return 5;
  }
}

function getAgeRiskScore(installationDate: Date | null, expectedLifespan: number | null): number {
  if (!installationDate || !expectedLifespan) return 5;
  
  const ageInYears = (Date.now() - installationDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const agePercentage = (ageInYears / expectedLifespan) * 100;
  
  if (agePercentage < 25) return 2;
  if (agePercentage < 50) return 4;
  if (agePercentage < 75) return 6;
  if (agePercentage < 90) return 8;
  return 10;
}

function getMaintenanceRiskScore(maintenanceHistory: any[]): number {
  if (maintenanceHistory.length === 0) return 8;
  
  const recentMaintenance = maintenanceHistory.filter(
    m => Date.now() - new Date(m.maintenanceDate).getTime() < 365 * 24 * 60 * 60 * 1000
  );
  
  if (recentMaintenance.length === 0) return 8;
  if (recentMaintenance.length < 2) return 6;
  if (recentMaintenance.length < 4) return 4;
  return 2;
}

function getInspectionRiskScore(inspectionHistory: any[]): number {
  if (inspectionHistory.length === 0) return 7;
  
  const latestInspection = inspectionHistory[0];
  const daysSinceInspection = (Date.now() - new Date(latestInspection.inspectionDate).getTime()) / (24 * 60 * 60 * 1000);
  
  if (daysSinceInspection > 365) return 8;
  if (daysSinceInspection > 180) return 6;
  if (daysSinceInspection > 90) return 4;
  return 2;
}

function getSeverityMultiplier(severity: string): number {
  switch (severity) {
    case "CRITICAL": return 1.5;
    case "HIGH": return 1.2;
    case "MEDIUM": return 1.0;
    case "LOW": return 0.8;
    default: return 1.0;
  }
}

function getRiskLevel(riskScore: number): string {
  if (riskScore >= 80) return "CRITICAL";
  if (riskScore >= 60) return "HIGH";
  if (riskScore >= 40) return "MEDIUM";
  if (riskScore >= 20) return "LOW";
  return "VERY_LOW";
}

function getConditionOrder(condition: string): number {
  switch (condition) {
    case "CRITICAL": return 5;
    case "POOR": return 4;
    case "FAIR": return 3;
    case "GOOD": return 2;
    case "EXCELLENT": return 1;
    default: return 0;
  }
}
