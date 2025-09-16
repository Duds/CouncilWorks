import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

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
