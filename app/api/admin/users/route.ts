import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";
import { logAuditEvent, canManageUser } from "@/lib/audit";
import { AuditAction } from "@prisma/client";
import { canManageUsers } from "@/lib/rbac";
import { withRLSContext } from "@/lib/rls";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(Role).default(Role.CITIZEN),
  password: z.string().min(8),
});

/**
 * GET /api/admin/users - Get all users with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageUsers(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!session.user.organisationId) {
      return NextResponse.json({ error: "No organisation assigned" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") as Role | null;
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const result = await withRLSContext(
      session.user.organisationId,
      session.user.role,
      async () => {
        const [users, total] = await Promise.all([
          prisma.user.findMany({
            where,
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
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
          }),
          prisma.user.count({ where }),
        ]);

        return { users, total };
      }
    );

    return NextResponse.json({
      users: result.users,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users - Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canManageUsers(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!session.user.organisationId) {
      return NextResponse.json({ error: "No organisation assigned" }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, role, password } = createUserSchema.parse(body);

    // Check if user can manage the specified role
    if (!canManageUser(session.user.role, role)) {
      return NextResponse.json(
        { error: "Cannot create user with this role" },
        { status: 403 }
      );
    }

    const result = await withRLSContext(
      session.user.organisationId,
      session.user.role,
      async () => {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new Error("User with this email already exists");
        }

        const bcrypt = await import("bcryptjs");
        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
            role,
            organisationId: session.user.organisationId!,
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        });

        return user;
      }
    );

    // Log audit event
    await logAuditEvent(
      AuditAction.USER_CREATED,
      session.user.id,
      session.user.organisationId!,
      {
        targetUserId: result.id,
        targetUserEmail: result.email,
        role: result.role,
      }
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "User with this email already exists") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
