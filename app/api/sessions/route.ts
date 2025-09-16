import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

/**
 * GET /api/sessions - Get current user's active sessions
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
        expires: {
          gt: new Date(),
        },
      },
      orderBy: { lastUsed: "desc" },
      select: {
        id: true,
        sessionToken: true,
        ipAddress: true,
        userAgent: true,
        deviceInfo: true,
        location: true,
        lastUsed: true,
        createdAt: true,
        expires: true,
      },
    });

    // Format sessions for display
    const formattedSessions = sessions.map((sess) => ({
      id: sess.id,
      ipAddress: sess.ipAddress,
      userAgent: sess.userAgent,
      deviceInfo: sess.deviceInfo,
      location: sess.location,
      lastUsed: sess.lastUsed,
      createdAt: sess.createdAt,
      expires: sess.expires,
      isCurrent: sess.sessionToken === session.sessionToken,
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/sessions/[id] - Revoke a specific session
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = params.id;

    // Check if session belongs to user
    const existingSession = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Deactivate the session
    await prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    // Log session revocation
    await logAuditEvent(AuditAction.USER_UPDATED, session.user.id, undefined, {
      action: "session_revoked",
      sessionId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Session revoked successfully" });
  } catch (error) {
    console.error("Error revoking session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
