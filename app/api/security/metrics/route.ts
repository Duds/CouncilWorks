import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Security Metrics API Endpoint
 * 
 * Provides comprehensive security metrics for Essential Eight compliance
 * Aggregates data from CSP violations, application inventory, and patch management
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get CSP violations from last 24 hours
    const cspViolations = await prisma.auditLog.count({
      where: {
        action: 'SECURITY_VIOLATION',
        details: {
          contains: 'CSP_VIOLATION',
        },
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    // Get application inventory metrics (simulated for now)
    const applicationsTotal = 15; // This would come from application inventory system
    const applicationsApproved = 12;
    const applicationsPending = 2;
    const applicationsQuarantined = 1;

    // Get patch management metrics (simulated for now)
    const patchesTotal = 8;
    const patchesApplied = 6;
    const patchesPending = 2;
    const patchesCritical = 1;

    // Get infrastructure application control metrics (simulated for now)
    const infrastructureApplications = 12;
    const infrastructureApproved = 10;
    const infrastructureQuarantined = 1;

    // Get OS patch management metrics (simulated for now)
    const osPatchesTotal = 15;
    const osPatchesApplied = 12;
    const osPatchesCritical = 2;

    // Get backup enhancement metrics (simulated for now)
    const backupJobsTotal = 5;
    const backupJobsActive = 4;
    const backupRunsSuccessful = 18;
    const backupRunsFailed = 1;

    // Calculate compliance score based on Essential Eight
    const complianceScore = calculateComplianceScore({
      cspViolations,
      applicationsTotal,
      applicationsApproved,
      patchesTotal,
      patchesApplied,
      patchesCritical,
      infrastructureApplications,
      infrastructureApproved,
      osPatchesTotal,
      osPatchesApplied,
      osPatchesCritical,
      backupJobsTotal,
      backupJobsActive,
      backupRunsSuccessful,
      backupRunsFailed,
    });

    const metrics = {
      cspViolations,
      applicationsTotal,
      applicationsApproved,
      applicationsPending,
      applicationsQuarantined,
      patchesTotal,
      patchesApplied,
      patchesPending,
      patchesCritical,
      infrastructureApplications,
      infrastructureApproved,
      infrastructureQuarantined,
      osPatchesTotal,
      osPatchesApplied,
      osPatchesCritical,
      backupJobsTotal,
      backupJobsActive,
      backupRunsSuccessful,
      backupRunsFailed,
      complianceScore,
    };

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Security metrics API error:", error);
    return NextResponse.json(
      { error: "Failed to load security metrics" },
      { status: 500 }
    );
  }
}

/**
 * Calculate Essential Eight compliance score
 */
function calculateComplianceScore(data: {
  cspViolations: number;
  applicationsTotal: number;
  applicationsApproved: number;
  patchesTotal: number;
  patchesApplied: number;
  patchesCritical: number;
  infrastructureApplications: number;
  infrastructureApproved: number;
  osPatchesTotal: number;
  osPatchesApplied: number;
  osPatchesCritical: number;
  backupJobsTotal: number;
  backupJobsActive: number;
  backupRunsSuccessful: number;
  backupRunsFailed: number;
}): number {
  const {
    cspViolations,
    applicationsTotal,
    applicationsApproved,
    patchesTotal,
    patchesApplied,
    patchesCritical,
    infrastructureApplications,
    infrastructureApproved,
    osPatchesTotal,
    osPatchesApplied,
    osPatchesCritical,
    backupJobsTotal,
    backupJobsActive,
    backupRunsSuccessful,
    backupRunsFailed,
  } = data;

  // Calculate individual compliance scores
  const cspScore = Math.max(0, 100 - (cspViolations * 10)); // Each violation reduces score by 10%
  const applicationScore = applicationsTotal > 0 ? (applicationsApproved / applicationsTotal) * 100 : 100;
  const patchScore = patchesTotal > 0 ? (patchesApplied / patchesTotal) * 100 : 100;
  const infrastructureScore = infrastructureApplications > 0 ? (infrastructureApproved / infrastructureApplications) * 100 : 100;
  const osPatchScore = osPatchesTotal > 0 ? (osPatchesApplied / osPatchesTotal) * 100 : 100;
  const backupScore = backupJobsTotal > 0 ? (backupJobsActive / backupJobsTotal) * 100 : 100;
  
  // Critical patches reduce score significantly
  const criticalPatchPenalty = (patchesCritical + osPatchesCritical) * 15;
  
  // Failed backups reduce score
  const backupFailurePenalty = backupRunsFailed * 5;
  
  // Calculate weighted average
  const overallScore = (
    cspScore * 0.15 + 
    applicationScore * 0.15 + 
    patchScore * 0.15 + 
    infrastructureScore * 0.15 + 
    osPatchScore * 0.15 + 
    backupScore * 0.15
  ) - criticalPatchPenalty - backupFailurePenalty;
  
  return Math.max(0, Math.min(100, Math.round(overallScore)));
}