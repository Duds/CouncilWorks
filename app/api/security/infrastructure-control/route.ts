import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, AuditAction } from "@/lib/audit";
import { 
  InfrastructureApplicationControlSystem,
  InfrastructureAppStatus,
  InfrastructureRiskLevel,
  ExecutionPolicyType,
  type InfrastructureApplication,
  type ApplicationExecutionPolicy,
  type ContainerSecurityPolicy
} from "@/lib/security/infrastructure-application-control";

// Initialize infrastructure application control system
const infrastructureControl = new InfrastructureApplicationControlSystem();

/**
 * GET /api/security/infrastructure-control
 * Get infrastructure application control overview
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

    const inventory = infrastructureControl.getInfrastructureInventory();
    const whitelistStatus = infrastructureControl.getWhitelistStatus();

    return NextResponse.json({
      inventory,
      whitelistStatus,
    });
  } catch (error) {
    console.error("Infrastructure control API error:", error);
    return NextResponse.json(
      { error: "Failed to load infrastructure control data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/infrastructure-control/discover
 * Discover infrastructure applications
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

    // Discover infrastructure applications
    const discoveredApplications = await infrastructureControl.discoverInfrastructureApplications();

    // Log audit event
    await logAuditEvent(
      AuditAction.INFRASTRUCTURE_DISCOVERY,
      session.user.id,
      session.user.organisationId,
      {
        applicationsDiscovered: discoveredApplications.length,
        containerImages: discoveredApplications.filter(app => app.type === 'CONTAINER_IMAGE').length,
        binaryExecutables: discoveredApplications.filter(app => app.type === 'BINARY_EXECUTABLE').length,
        highRiskApplications: discoveredApplications.filter(app => app.riskLevel === InfrastructureRiskLevel.HIGH || app.riskLevel === InfrastructureRiskLevel.CRITICAL).length,
      }
    );

    return NextResponse.json({ 
      discoveredApplications,
      message: `Discovered ${discoveredApplications.length} infrastructure applications`
    });
  } catch (error) {
    console.error("Infrastructure discovery API error:", error);
    return NextResponse.json(
      { error: "Failed to discover infrastructure applications" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/infrastructure-control/analyze/[id]
 * Analyze infrastructure application
 */
export async function POST_ANALYZE(
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

    // Analyze application
    const analyzedApplication = await infrastructureControl.analyzeApplication(id);

    if (!analyzedApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Log audit event
    await logAuditEvent(
      AuditAction.INFRASTRUCTURE_ANALYSIS,
      session.user.id,
      session.user.organisationId,
      {
        applicationId: id,
        applicationName: analyzedApplication.name,
        applicationType: analyzedApplication.type,
        riskLevel: analyzedApplication.riskLevel,
        permissionsCount: analyzedApplication.permissions.length,
      }
    );

    return NextResponse.json({ application: analyzedApplication });
  } catch (error) {
    console.error("Infrastructure analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze application" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/infrastructure-control/whitelist/[id]
 * Whitelist infrastructure application
 */
export async function POST_WHITELIST(
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

    // Whitelist application
    const success = await infrastructureControl.whitelistApplication(id, session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Log audit event
    await logAuditEvent(
      AuditAction.INFRASTRUCTURE_WHITELIST,
      session.user.id,
      session.user.organisationId,
      {
        applicationId: id,
        action: 'WHITELISTED',
        approvedBy: session.user.id,
      }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Application whitelisted successfully'
    });
  } catch (error) {
    console.error("Infrastructure whitelist API error:", error);
    return NextResponse.json(
      { error: "Failed to whitelist application" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/infrastructure-control/blacklist/[id]
 * Blacklist infrastructure application
 */
export async function POST_BLACKLIST(
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
        { error: "Missing blacklist reason" },
        { status: 400 }
      );
    }

    // Blacklist application
    const success = await infrastructureControl.blacklistApplication(id, reason);

    if (!success) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Log audit event
    await logAuditEvent(
      AuditAction.INFRASTRUCTURE_BLACKLIST,
      session.user.id,
      session.user.organisationId,
      {
        applicationId: id,
        action: 'BLACKLISTED',
        reason: reason,
        blacklistedBy: session.user.id,
      }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Application blacklisted successfully'
    });
  } catch (error) {
    console.error("Infrastructure blacklist API error:", error);
    return NextResponse.json(
      { error: "Failed to blacklist application" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/infrastructure-control/quarantine/[id]
 * Quarantine infrastructure application
 */
export async function POST_QUARANTINE(
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
        { error: "Missing quarantine reason" },
        { status: 400 }
      );
    }

    // Quarantine application
    const success = await infrastructureControl.quarantineApplication(id, reason);

    if (!success) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Log audit event
    await logAuditEvent(
      AuditAction.INFRASTRUCTURE_QUARANTINE,
      session.user.id,
      session.user.organisationId,
      {
        applicationId: id,
        action: 'QUARANTINED',
        reason: reason,
        quarantinedBy: session.user.id,
      }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Application quarantined successfully'
    });
  } catch (error) {
    console.error("Infrastructure quarantine API error:", error);
    return NextResponse.json(
      { error: "Failed to quarantine application" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/infrastructure-control/execution-policy
 * Create execution policy
 */
export async function POST_EXECUTION_POLICY(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, policyType, rules, conditions, actions } = body;

    if (!applicationId || !policyType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create execution policy
    const policy = await infrastructureControl.createExecutionPolicy(
      applicationId,
      policyType as ExecutionPolicyType,
      rules || [],
      conditions || [],
      actions || []
    );

    // Log audit event
    await logAuditEvent(
      AuditAction.INFRASTRUCTURE_POLICY_CREATED,
      session.user.id,
      session.user.organisationId,
      {
        policyId: policy.id,
        applicationId: applicationId,
        policyType: policyType,
        rulesCount: rules?.length || 0,
        conditionsCount: conditions?.length || 0,
        actionsCount: actions?.length || 0,
      }
    );

    return NextResponse.json({ policy });
  } catch (error) {
    console.error("Execution policy API error:", error);
    return NextResponse.json(
      { error: "Failed to create execution policy" },
      { status: 500 }
    );
  }
}
