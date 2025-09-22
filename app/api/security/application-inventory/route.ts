import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, AuditAction } from "@/lib/audit";
import { 
  ApplicationInventoryManager, 
  ApplicationWhitelistManager,
  ApplicationCategory,
  ApplicationStatus,
  RiskLevel,
  type Application 
} from "@/lib/security/application-inventory";

// Initialize managers
const inventoryManager = new ApplicationInventoryManager();
const whitelistManager = new ApplicationWhitelistManager(inventoryManager);

/**
 * GET /api/security/application-inventory
 * Get application inventory summary
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

    const inventory = inventoryManager.getInventory();
    const whitelistStatus = whitelistManager.getWhitelistStatus();

    return NextResponse.json({
      inventory,
      whitelistStatus,
    });
  } catch (error) {
    console.error("Application inventory API error:", error);
    return NextResponse.json(
      { error: "Failed to load application inventory" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/application-inventory
 * Add new application to inventory
 */
export async function POST(request: NextRequest) {
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
    const { name, version, vendor, category, permissions } = body;

    // Validate required fields
    if (!name || !version || !vendor || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new application
    const application = await inventoryManager.addApplication({
      name,
      version,
      vendor,
      category: category as ApplicationCategory,
      status: ApplicationStatus.PENDING_APPROVAL,
      riskLevel: RiskLevel.LOW,
      vulnerabilities: [],
      dependencies: [],
      permissions: permissions || [],
    });

    // Log audit event
    await logAuditEvent(
      AuditAction.APPLICATION_ADDED,
      session.user.id,
      session.user.organisationId,
      {
        applicationId: application.id,
        applicationName: application.name,
        applicationVersion: application.version,
        applicationVendor: application.vendor,
        applicationCategory: application.category,
      }
    );

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Add application API error:", error);
    return NextResponse.json(
      { error: "Failed to add application" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/security/application-inventory/[id]
 * Update application status
 */
export async function PUT(
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
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await inventoryManager.updateApplicationStatus(
      id,
      status as ApplicationStatus,
      session.user.id
    );

    if (!updatedApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update whitelist if approved
    if (status === ApplicationStatus.APPROVED) {
      await whitelistManager.whitelistApplication(id, session.user.id);
    } else if (status === ApplicationStatus.REJECTED) {
      await whitelistManager.blacklistApplication(id, reason || 'Rejected by administrator');
    }

    // Log audit event
    await logAuditEvent(
      AuditAction.APPLICATION_STATUS_CHANGED,
      session.user.id,
      session.user.organisationId,
      {
        applicationId: id,
        applicationName: updatedApplication.name,
        oldStatus: 'PENDING_APPROVAL',
        newStatus: status,
        reason: reason,
      }
    );

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error("Update application API error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/security/application-inventory/scan/[id]
 * Scan application for vulnerabilities
 */
export async function GET_SCAN(
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

    // Perform vulnerability scan
    const vulnerabilities = await inventoryManager.scanApplicationVulnerabilities(id);

    // Log audit event
    await logAuditEvent(
      AuditAction.APPLICATION_SCANNED,
      session.user.id,
      session.user.organisationId,
      {
        applicationId: id,
        vulnerabilitiesFound: vulnerabilities.length,
        criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
        highVulnerabilities: vulnerabilities.filter(v => v.severity === 'HIGH').length,
      }
    );

    return NextResponse.json({ vulnerabilities });
  } catch (error) {
    console.error("Scan application API error:", error);
    return NextResponse.json(
      { error: "Failed to scan application" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/security/application-inventory/high-risk
 * Get high-risk applications
 */
export async function GET_HIGH_RISK(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const highRiskApplications = inventoryManager.getHighRiskApplications();
    const criticalVulnerabilityApplications = inventoryManager.getApplicationsWithCriticalVulnerabilities();

    return NextResponse.json({
      highRiskApplications,
      criticalVulnerabilityApplications,
    });
  } catch (error) {
    console.error("High-risk applications API error:", error);
    return NextResponse.json(
      { error: "Failed to load high-risk applications" },
      { status: 500 }
    );
  }
}
