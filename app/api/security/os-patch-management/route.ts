import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, AuditAction } from "@/lib/audit";
import { 
  OSPatchManagementSystem,
  OSPatchStatus,
  PatchSeverity,
  OSDeploymentEnvironment,
  OSDeploymentStatus,
  OSTestEnvironment,
  type OSPatch,
  type OSPatchTest,
  type OSPatchDeployment,
  type OSPatchCompliance
} from "@/lib/security/os-patch-management";

// Initialize OS patch management system
const osPatchManager = new OSPatchManagementSystem();

/**
 * GET /api/security/os-patch-management
 * Get OS patch management overview
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

    const compliance = osPatchManager.getOSPatchCompliance();
    const criticalPatches = osPatchManager.getCriticalOSPatches();
    const pendingPatches = osPatchManager.getOSPatchesByStatus(OSPatchStatus.DISCOVERED);
    const failedDeployments = osPatchManager.getFailedOSDeployments();

    return NextResponse.json({
      compliance,
      criticalPatches,
      pendingPatches,
      failedDeployments,
    });
  } catch (error) {
    console.error("OS patch management API error:", error);
    return NextResponse.json(
      { error: "Failed to load OS patch management data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/os-patch-management/discover
 * Discover OS patches
 */
export async function POST_DISCOVER(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Discover OS patches
    const discoveredPatches = await osPatchManager.discoverOSPatches();

    // Log audit event
    await logAuditEvent(
      AuditAction.OS_PATCH_DISCOVERY,
      session.user.id,
      session.user.organisationId,
      {
        patchesDiscovered: discoveredPatches.length,
        criticalPatches: discoveredPatches.filter(p => p.severity === PatchSeverity.CRITICAL).length,
        highPatches: discoveredPatches.filter(p => p.severity === PatchSeverity.HIGH).length,
        linuxPatches: discoveredPatches.filter(p => p.osType === 'LINUX').length,
        windowsPatches: discoveredPatches.filter(p => p.osType === 'WINDOWS').length,
        macOSPatches: discoveredPatches.filter(p => p.osType === 'MACOS').length,
      }
    );

    return NextResponse.json({ 
      discoveredPatches,
      message: `Discovered ${discoveredPatches.length} OS patches`
    });
  } catch (error) {
    console.error("OS patch discovery API error:", error);
    return NextResponse.json(
      { error: "Failed to discover OS patches" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/os-patch-management/test/[id]
 * Test OS patch
 */
export async function POST_TEST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { testEnvironment } = body;

    if (!testEnvironment) {
      return NextResponse.json(
        { error: "Missing test environment" },
        { status: 400 }
      );
    }

    // Test OS patch
    const test = await osPatchManager.testOSPatch(id, testEnvironment as OSTestEnvironment);

    // Log audit event
    await logAuditEvent(
      AuditAction.OS_PATCH_TESTING,
      session.user.id,
      session.user.organisationId,
      {
        patchId: id,
        testId: test.id,
        testEnvironment: testEnvironment,
        testStatus: test.status,
        testDuration: test.testDuration,
        failures: test.failures.length,
      }
    );

    return NextResponse.json({ test });
  } catch (error) {
    console.error("OS patch testing API error:", error);
    return NextResponse.json(
      { error: "Failed to test OS patch" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/os-patch-management/deploy/[id]
 * Deploy OS patch
 */
export async function POST_DEPLOY(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { environment, targetSystems } = body;

    if (!environment || !targetSystems) {
      return NextResponse.json(
        { error: "Missing deployment environment or target systems" },
        { status: 400 }
      );
    }

    // Deploy OS patch
    const deployment = await osPatchManager.deployOSPatch(
      id,
      environment as OSDeploymentEnvironment,
      targetSystems,
      session.user.id
    );

    // Log audit event
    await logAuditEvent(
      AuditAction.OS_PATCH_DEPLOYMENT,
      session.user.id,
      session.user.organisationId,
      {
        patchId: id,
        deploymentId: deployment.id,
        environment: environment,
        targetSystems: targetSystems,
        deploymentStatus: deployment.status,
        deployedBy: session.user.id,
      }
    );

    return NextResponse.json({ deployment });
  } catch (error) {
    console.error("OS patch deployment API error:", error);
    return NextResponse.json(
      { error: "Failed to deploy OS patch" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/os-patch-management/rollback/[id]
 * Rollback OS patch deployment
 */
export async function POST_ROLLBACK(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { error: "Missing rollback reason" },
        { status: 400 }
      );
    }

    // Rollback OS patch
    const rollback = await osPatchManager.rollbackOSPatch(id, reason);

    if (!rollback) {
      return NextResponse.json(
        { error: "Deployment not found" },
        { status: 404 }
      );
    }

    // Log audit event
    await logAuditEvent(
      AuditAction.OS_PATCH_ROLLBACK,
      session.user.id,
      session.user.organisationId,
      {
        deploymentId: id,
        patchId: rollback.patchId,
        rollbackReason: reason,
        rollbackStatus: rollback.status,
        rolledBackBy: session.user.id,
      }
    );

    return NextResponse.json({ rollback });
  } catch (error) {
    console.error("OS patch rollback API error:", error);
    return NextResponse.json(
      { error: "Failed to rollback OS patch" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/os-patch-management/scan-compliance/[id]
 * Scan system for patch compliance
 */
export async function POST_SCAN_COMPLIANCE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Scan system compliance
    const compliance = await osPatchManager.scanSystemCompliance(id);

    // Log audit event
    await logAuditEvent(
      AuditAction.OS_PATCH_COMPLIANCE_SCAN,
      session.user.id,
      session.user.organisationId,
      {
        systemId: id,
        compliancePercentage: compliance.compliancePercentage,
        criticalPatchesMissing: compliance.criticalPatchesMissing,
        highPatchesMissing: compliance.highPatchesMissing,
        mediumPatchesMissing: compliance.mediumPatchesMissing,
        lowPatchesMissing: compliance.lowPatchesMissing,
      }
    );

    return NextResponse.json({ compliance });
  } catch (error) {
    console.error("OS patch compliance scan API error:", error);
    return NextResponse.json(
      { error: "Failed to scan system compliance" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/security/os-patch-management/compliance
 * Get detailed OS patch compliance report
 */
export async function GET_COMPLIANCE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const compliance = osPatchManager.getOSPatchCompliance();
    const patchesByStatus = {
      discovered: osPatchManager.getOSPatchesByStatus(OSPatchStatus.DISCOVERED),
      testing: osPatchManager.getOSPatchesByStatus(OSPatchStatus.TESTING),
      approved: osPatchManager.getOSPatchesByStatus(OSPatchStatus.APPROVED),
      deployed: osPatchManager.getOSPatchesByStatus(OSPatchStatus.DEPLOYED),
      failed: osPatchManager.getOSPatchesByStatus(OSPatchStatus.FAILED),
      rolledBack: osPatchManager.getOSPatchesByStatus(OSPatchStatus.ROLLED_BACK),
    };

    return NextResponse.json({
      compliance,
      patchesByStatus,
    });
  } catch (error) {
    console.error("OS patch compliance API error:", error);
    return NextResponse.json(
      { error: "Failed to load OS patch compliance data" },
      { status: 500 }
    );
  }
}
