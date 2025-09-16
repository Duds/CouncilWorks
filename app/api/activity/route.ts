import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/activity - Get current user's activity log
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const action = searchParams.get("action");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (action) {
      where.action = action;
    }

    // Get activity logs
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          action: true,
          details: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Format logs for display
    const formattedLogs = logs.map((log) => ({
      id: log.id,
      action: log.action,
      description: getActionDescription(log.action, log.details),
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      timestamp: log.createdAt,
      details: log.details,
    }));

    return NextResponse.json({
      logs: formattedLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Get human-readable description for audit action
 */
function getActionDescription(action: string, details: any): string {
  const actionDescriptions: Record<string, string> = {
    USER_LOGIN: "Signed in to your account",
    USER_LOGOUT: "Signed out of your account",
    USER_ROLE_CHANGE: "User role was changed",
    USER_STATUS_CHANGE: "Account status was changed",
    USER_PASSWORD_RESET: "Password was reset",
    USER_CREATED: "Account was created",
    USER_UPDATED: "Profile was updated",
    USER_DELETED: "Account was deleted",
    MFA_ENABLED: "Multi-factor authentication was enabled",
    MFA_DISABLED: "Multi-factor authentication was disabled",
    MFA_VERIFIED: "Multi-factor authentication was verified",
    MFA_BACKUP_CODE_USED: "Backup code was used for authentication",
  };

  let description = actionDescriptions[action] || `Action: ${action}`;

  // Add context from details if available
  if (details && typeof details === "object") {
    if (details.provider) {
      description += ` via ${details.provider}`;
    }
    if (details.fields) {
      description += ` (${details.fields.join(", ")})`;
    }
  }

  return description;
}
