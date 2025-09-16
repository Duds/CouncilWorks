import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/profile/sessions - Get current user's active sessions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { lastUsed: "desc" },
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

    // Format sessions with additional info
    const formattedSessions = sessions.map(session => ({
      ...session,
      isCurrentSession: session.sessionToken === session.sessionToken, // This would need to be compared with current session token
      deviceName: getDeviceName(session.userAgent, session.deviceInfo),
      browserName: getBrowserName(session.userAgent),
      osName: getOSName(session.userAgent),
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/sessions/:sessionId - Revoke a specific session
 */
export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = params;

    // Delete the session
    await prisma.session.delete({
      where: {
        id: sessionId,
        userId: session.user.id, // Ensure user can only delete their own sessions
      },
    });

    return NextResponse.json({ success: true, message: "Session revoked successfully" });
  } catch (error) {
    console.error("Error revoking session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile/sessions - Revoke all sessions except current
 */
export async function DELETE_ALL(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current session token from headers or session
    const currentSessionToken = request.headers.get("x-session-token");

    // Delete all sessions except current
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        ...(currentSessionToken && { sessionToken: { not: currentSessionToken } }),
      },
    });

    return NextResponse.json({ success: true, message: "All other sessions revoked successfully" });
  } catch (error) {
    console.error("Error revoking all sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Helper function to extract device name from user agent
 */
function getDeviceName(userAgent: string | null, deviceInfo: string | null): string {
  if (deviceInfo) {
    return deviceInfo;
  }
  
  if (!userAgent) {
    return "Unknown Device";
  }

  // Simple device detection
  if (userAgent.includes("Mobile")) {
    return "Mobile Device";
  } else if (userAgent.includes("Tablet")) {
    return "Tablet";
  } else {
    return "Desktop";
  }
}

/**
 * Helper function to extract browser name from user agent
 */
function getBrowserName(userAgent: string | null): string {
  if (!userAgent) {
    return "Unknown Browser";
  }

  if (userAgent.includes("Chrome")) {
    return "Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Safari")) {
    return "Safari";
  } else if (userAgent.includes("Edge")) {
    return "Edge";
  } else {
    return "Unknown Browser";
  }
}

/**
 * Helper function to extract OS name from user agent
 */
function getOSName(userAgent: string | null): string {
  if (!userAgent) {
    return "Unknown OS";
  }

  if (userAgent.includes("Windows")) {
    return "Windows";
  } else if (userAgent.includes("Mac")) {
    return "macOS";
  } else if (userAgent.includes("Linux")) {
    return "Linux";
  } else if (userAgent.includes("Android")) {
    return "Android";
  } else if (userAgent.includes("iOS")) {
    return "iOS";
  } else {
    return "Unknown OS";
  }
}
