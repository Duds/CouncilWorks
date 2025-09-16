import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";
import { logAuditEvent, canManageUser } from "@/lib/audit";
import { AuditAction } from "@prisma/client";
import { canManageUsers } from "@/lib/rbac";
import bcrypt from "bcryptjs";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

const changePasswordSchema = z.object({
  password: z.string().min(8),
});

/**
 * GET /api/admin/users/[id] - Get user details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageUsers(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: id,
        organisationId: session.user.organisationId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id] - Update user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageUsers(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updateData = updateUserSchema.parse(body);

    // Get current user to check permissions
    const currentUser = await prisma.user.findFirst({
      where: {
        id: id,
        organisationId: session.user.organisationId,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user can manage this role
    if (updateData.role && !canManageUser(session.user.role, updateData.role)) {
      return NextResponse.json(
        { error: "Cannot assign this role" },
        { status: 403 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Log audit events
    const changes: Record<string, any> = {};
    if (updateData.name !== undefined) changes.name = updateData.name;
    if (updateData.email !== undefined) changes.email = updateData.email;
    if (updateData.role !== undefined) changes.role = updateData.role;
    if (updateData.isActive !== undefined) changes.isActive = updateData.isActive;

    await logAuditEvent(
      AuditAction.USER_UPDATED,
      session.user.id,
      session.user.organisationId!,
      {
        targetUserId: id,
        changes,
        previousValues: {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          isActive: currentUser.isActive,
        },
      }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id] - Delete user (soft delete by deactivating)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageUsers(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: id,
        organisationId: session.user.organisationId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Soft delete by deactivating
    await prisma.user.update({
      where: { id: id },
      data: { isActive: false },
    });

    // Log audit event
    await logAuditEvent(
      AuditAction.USER_DELETED,
      session.user.id,
      session.user.organisationId!,
      {
        targetUserId: id,
        targetUserEmail: user.email,
        targetUserName: user.name,
      }
    );

    return NextResponse.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
