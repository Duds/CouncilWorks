import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  maintenanceUpdates: z.boolean().optional(),
});

/**
 * GET /api/profile/notifications - Get current user's notification preferences
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notificationPreferences: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return default preferences if none set
    const defaultPreferences = {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      weeklyDigest: true,
      securityAlerts: true,
      maintenanceUpdates: false,
    };

    const preferences = user.notificationPreferences as any || defaultPreferences;

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/profile/notifications - Update current user's notification preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = notificationPreferencesSchema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { notificationPreferences: validatedData },
    });

    // Log notification preferences update
    await logAuditEvent(AuditAction.USER_UPDATED, session.user.id, undefined, {
      fields: ["notificationPreferences"],
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Notification preferences updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error("Error updating notification preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
