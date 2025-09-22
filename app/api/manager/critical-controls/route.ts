import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * Critical Controls API Endpoint
 * Provides critical control monitoring data for Manager dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has Manager or higher role
    if (!['ADMIN', 'MANAGER', 'EXEC'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get organisation ID from user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organisationId: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: "User not associated with organisation" }, { status: 400 });
    }

    // Get critical controls from database
    const criticalControls = await prisma.criticalControl.findMany({
      where: { organisationId: user.organisationId },
      include: {
        assetCriticalControls: {
          include: {
            asset: {
              select: {
                id: true,
                name: true,
                assetType: true,
                status: true,
                condition: true,
                priority: true,
              },
            },
          },
        },
      },
      orderBy: {
        riskScore: 'desc',
      },
    });

    // Generate control metrics
    const metrics = generateControlMetrics(criticalControls);

    return NextResponse.json({ 
      controls: criticalControls,
      metrics 
    });
  } catch (error) {
    console.error("Critical controls API error:", error);
    return NextResponse.json(
      { error: "Failed to load critical controls" },
      { status: 500 }
    );
  }
}

/**
 * Generate critical controls data that demonstrates Rule 1: Every Asset Has a Purpose
 */
function generateCriticalControlsData() {
  return [
    {
      id: "cc-001",
      name: "Main Water Treatment Plant",
      assetType: "Water Infrastructure",
      status: "critical",
      lastInspection: "2025-01-15",
      nextInspection: "2025-01-22",
      riskScore: 95,
      impactLevel: "critical",
      purpose: "Community water supply - 50,000 residents",
      consequence: "Complete water service disruption"
    },
    {
      id: "cc-002", 
      name: "Emergency Services Communication Tower",
      assetType: "Communication Infrastructure",
      status: "warning",
      lastInspection: "2025-01-10",
      nextInspection: "2025-01-25",
      riskScore: 78,
      impactLevel: "high",
      purpose: "Emergency services coordination",
      consequence: "Emergency response delays"
    },
    {
      id: "cc-003",
      name: "Main Electrical Substation",
      assetType: "Electrical Infrastructure", 
      status: "healthy",
      lastInspection: "2025-01-12",
      nextInspection: "2025-02-12",
      riskScore: 45,
      impactLevel: "high",
      purpose: "Power distribution to 15,000 properties",
      consequence: "Widespread power outages"
    },
    {
      id: "cc-004",
      name: "Wastewater Treatment Facility",
      assetType: "Wastewater Infrastructure",
      status: "warning",
      lastInspection: "2025-01-08",
      nextInspection: "2025-01-28",
      riskScore: 82,
      impactLevel: "high",
      purpose: "Community wastewater processing",
      consequence: "Environmental contamination risk"
    },
    {
      id: "cc-005",
      name: "Main Road Bridge - Highway 1",
      assetType: "Transportation Infrastructure",
      status: "healthy",
      lastInspection: "2025-01-05",
      nextInspection: "2025-02-05",
      riskScore: 35,
      impactLevel: "medium",
      purpose: "Primary transport corridor",
      consequence: "Major traffic disruption"
    },
    {
      id: "cc-006",
      name: "Fire Station Equipment",
      assetType: "Emergency Services",
      status: "critical",
      lastInspection: "2025-01-18",
      nextInspection: "2025-01-25",
      riskScore: 88,
      impactLevel: "critical",
      purpose: "Community fire protection",
      consequence: "Inability to respond to fires"
    },
    {
      id: "cc-007",
      name: "Community Health Centre Generator",
      assetType: "Health Infrastructure",
      status: "warning",
      lastInspection: "2025-01-14",
      nextInspection: "2025-01-30",
      riskScore: 72,
      impactLevel: "high",
      purpose: "Emergency power for health services",
      consequence: "Health service disruption"
    },
    {
      id: "cc-008",
      name: "Main Library HVAC System",
      assetType: "Community Infrastructure",
      status: "healthy",
      lastInspection: "2025-01-11",
      nextInspection: "2025-02-11",
      riskScore: 28,
      impactLevel: "low",
      purpose: "Community learning environment",
      consequence: "Service interruption"
    },
    {
      id: "cc-009",
      name: "Sewer Pump Station Alpha",
      assetType: "Wastewater Infrastructure",
      status: "critical",
      lastInspection: "2025-01-16",
      nextInspection: "2025-01-23",
      riskScore: 91,
      impactLevel: "high",
      purpose: "Wastewater flow management",
      consequence: "Sewage overflow risk"
    },
    {
      id: "cc-010",
      name: "Traffic Control System",
      assetType: "Transportation Infrastructure",
      status: "healthy",
      lastInspection: "2025-01-13",
      nextInspection: "2025-02-13",
      riskScore: 42,
      impactLevel: "medium",
      purpose: "Traffic flow management",
      consequence: "Traffic congestion"
    },
    {
      id: "cc-011",
      name: "Community Pool Filtration System",
      assetType: "Recreation Infrastructure",
      status: "warning",
      lastInspection: "2025-01-09",
      nextInspection: "2025-01-26",
      riskScore: 65,
      impactLevel: "medium",
      purpose: "Community recreation services",
      consequence: "Pool closure"
    },
    {
      id: "cc-012",
      name: "Maintenance Workshop Equipment",
      assetType: "Support Infrastructure",
      status: "healthy",
      lastInspection: "2025-01-07",
      nextInspection: "2025-02-07",
      riskScore: 38,
      impactLevel: "low",
      purpose: "Asset maintenance support",
      consequence: "Maintenance delays"
    }
  ];
}

/**
 * Generate control metrics for dashboard
 */
function generateControlMetrics(controls: any[]) {
  const totalControls = controls.length;
  const criticalAlerts = controls.filter(c => c.status === 'critical').length;
  const warningStatus = controls.filter(c => c.status === 'warning').length;
  const healthyStatus = controls.filter(c => c.status === 'healthy').length;
  const averageRiskScore = Math.round(controls.reduce((sum, c) => sum + c.riskScore, 0) / totalControls);
  
  // Calculate next inspection due (within 7 days)
  const nextInspectionDue = controls.filter(c => {
    const nextDate = new Date(c.nextInspection);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;

  return {
    totalControls,
    criticalAlerts,
    warningStatus,
    healthyStatus,
    averageRiskScore,
    nextInspectionDue
  };
}
