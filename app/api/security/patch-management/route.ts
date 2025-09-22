import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, AuditAction } from "@/lib/audit";
import { 
  PatchManagementSystem,
  PatchStatus,
  PatchSeverity,
  DeploymentEnvironment,
  DeploymentStatus,
  type Patch,
  type PatchTest,
  type PatchDeployment,
  type PatchCompliance
} from "@/lib/security/patch-management";

// Initialize patch management system
const patchManager = new PatchManagementSystem();

/**
 * GET /api/security/patch-management
 * Get patch management overview and compliance status
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

    const compliance = patchManager.getPatchCompliance();
    const criticalPatches = patchManager.getCriticalPatches();
    const pendingPatches = patchManager.getPatchesByStatus(PatchStatus.DISCOVERED);
    const failedDeployments = patchManager.getFailedDeployments();

    return NextResponse.json({
      compliance,
      criticalPatches,
      pendingPatches,
      failedDeployments,
    });
  } catch (error) {
    console.error("Patch management API error:", error);
    return NextResponse.json(
      { error: "Failed to load patch management data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/patch-management/discover
 * Discover new patches
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

    // Discover new patches
    const discoveredPatches = await patchManager.discoverPatches();

    // Log audit event
    await logAuditEvent(
      AuditAction.PATCH_DISCOVERY,
      session.user.id,
      session.user.organisationId,
      {
        patchesDiscovered: discoveredPatches.length,
        criticalPatches: discoveredPatches.filter(p => p.severity === PatchSeverity.CRITICAL).length,
        highPatches: discoveredPatches.filter(p => p.severity === PatchSeverity.HIGH).length,
      }
    );

    return NextResponse.json({ 
      discoveredPatches,
      message: `Discovered ${discoveredPatches.length} new patches`
    });
  } catch (error) {
    console.error("Patch discovery API error:", error);
    return NextResponse.json(
      { error: "Failed to discover patches" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/patch-management/test/[id]
 * Test patch in isolated environment
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

    // Test patch
    const test = await patchManager.testPatch(id, testEnvironment);

    // Log audit event
    await logAuditEvent(
      AuditAction.PATCH_TESTING,
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
    console.error("Patch testing API error:", error);
    return NextResponse.json(
      { error: "Failed to test patch" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/patch-management/deploy/[id]
 * Deploy patch to environment
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
    const { environment } = body;

    if (!environment) {
      return NextResponse.json(
        { error: "Missing deployment environment" },
        { status: 400 }
      );
    }

    // Deploy patch
    const deployment = await patchManager.deployPatch(
      id,
      environment as DeploymentEnvironment,
      session.user.id
    );

    // Log audit event
    await logAuditEvent(
      AuditAction.PATCH_DEPLOYMENT,
      session.user.id,
      session.user.organisationId,
      {
        patchId: id,
        deploymentId: deployment.id,
        environment: environment,
        deploymentStatus: deployment.status,
        deployedBy: session.user.id,
      }
    );

    return NextResponse.json({ deployment });
  } catch (error) {
    console.error("Patch deployment API error:", error);
    return NextResponse.json(
      { error: "Failed to deploy patch" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/patch-management/rollback/[id]
 * Rollback patch deployment
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

    // Rollback patch
    const rollback = await patchManager.rollbackPatch(id, reason);

    if (!rollback) {
      return NextResponse.json(
        { error: "Deployment not found" },
        { status: 404 }
      );
    }

    // Log audit event
    await logAuditEvent(
      AuditAction.PATCH_ROLLBACK,
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
    console.error("Patch rollback API error:", error);
    return NextResponse.json(
      { error: "Failed to rollback patch" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/security/patch-management/compliance
 * Get detailed patch compliance report
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

    const compliance = patchManager.getPatchCompliance();
    const patchesByStatus = {
      discovered: patchManager.getPatchesByStatus(PatchStatus.DISCOVERED),
      testing: patchManager.getPatchesByStatus(PatchStatus.TESTING),
      approved: patchManager.getPatchesByStatus(PatchStatus.APPROVED),
      deployed: patchManager.getPatchesByStatus(PatchStatus.DEPLOYED),
      failed: patchManager.getPatchesByStatus(PatchStatus.FAILED),
      rolledBack: patchManager.getPatchesByStatus(PatchStatus.ROLLED_BACK),
    };

    return NextResponse.json({
      compliance,
      patchesByStatus,
    });
  } catch (error) {
    console.error("Patch compliance API error:", error);
    return NextResponse.json(
      { error: "Failed to load patch compliance data" },
      { status: 500 }
    );
  }
}
