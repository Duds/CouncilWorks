import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuditAction } from "@prisma/client";

/**
 * GET /api/profile/activity - Get current user's activity log
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const action = searchParams.get("action");

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (action) {
      where.action = action;
    }

    // Get audit logs
    const auditLogs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        action: true,
        details: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
      },
    });

    // Get session logs
    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        sessionToken: true,
        ipAddress: true,
        userAgent: true,
        deviceInfo: true,
        location: true,
        isActive: true,
        lastUsed: true,
        createdAt: true,
        expires: true,
      },
    });

    // Combine and format the data
    const activities = [
      ...auditLogs.map(log => ({
        id: log.id,
        type: "audit" as const,
        action: log.action,
        details: log.details,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        timestamp: log.createdAt,
        description: getActionDescription(log.action, log.details),
      })),
      ...sessions.map(session => ({
        id: session.id,
        type: "session" as const,
        action: "SESSION_LOGIN" as const,
        details: { deviceInfo: session.deviceInfo, location: session.location },
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        timestamp: session.createdAt,
        description: `Session ${session.isActive ? 'active' : 'expired'} from ${session.deviceInfo || 'Unknown device'}`,
        isActive: session.isActive,
        lastUsed: session.lastUsed,
        expires: session.expires,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      activities: activities.slice(0, limit),
      total: activities.length,
      hasMore: activities.length > limit,
    });
  } catch (error) {
    console.error("Error fetching activity log:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Helper function to get human-readable action descriptions
 */
function getActionDescription(action: AuditAction, details: any): string {
  const actionMap: Record<AuditAction, string> = {
    USER_LOGIN: "Signed in",
    USER_LOGOUT: "Signed out",
    USER_ROLE_CHANGE: "Role changed",
    USER_STATUS_CHANGE: "Account status changed",
    USER_PASSWORD_RESET: "Password reset",
    USER_CREATED: "Account created",
    USER_UPDATED: "Profile updated",
    USER_DELETED: "Account deleted",
    ORGANISATION_CREATED: "Organisation created",
    ORGANISATION_UPDATED: "Organisation updated",
    ORGANISATION_DELETED: "Organisation deleted",
    MFA_ENABLED: "MFA enabled",
    MFA_DISABLED: "MFA disabled",
    MFA_VERIFIED: "MFA verified",
    MFA_BACKUP_CODE_USED: "MFA backup code used",
    ASSET_CREATED: "Asset created",
    ASSET_UPDATED: "Asset updated",
    ASSET_DELETED: "Asset deleted",
    ASSET_IMPORTED: "Assets imported",
    ASSET_DOCUMENT_ATTACHED: "Document attached to asset",
    ASSET_DOCUMENT_REMOVED: "Document removed from asset",
  };

  let description = actionMap[action] || action;
  
  // Add specific details for certain actions
  if (action === AuditAction.USER_UPDATED && details?.fields) {
    description += ` (${details.fields.join(", ")})`;
  }
  
  if (action === AuditAction.USER_PASSWORD_RESET && details?.method) {
    description += ` via ${details.method}`;
  }

  return description;
}
