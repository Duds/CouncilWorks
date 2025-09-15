import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Role } from "@prisma/client";

const invitationSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(Role),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, role, message } = invitationSchema.parse(body);

    // Get user with organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organisation: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: "User must have an organisation" }, { status: 400 });
    }

    // Check if user has permission to invite (admin or manager)
    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      return NextResponse.json({ error: "Insufficient permissions to invite users" }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.organisationId === user.organisationId) {
        return NextResponse.json({ error: "User is already a member of your organisation" }, { status: 400 });
      } else {
        return NextResponse.json({ error: "User is already registered with another organisation" }, { status: 400 });
      }
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: { 
        email,
        organisationId: user.organisationId,
        status: 'PENDING'
      },
    });

    if (existingInvitation) {
      return NextResponse.json({ error: "Invitation already sent to this email" }, { status: 400 });
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        organisationId: user.organisationId,
        invitedBy: user.id,
        message: message || `You've been invited to join ${user.organisation?.name} on Aegrid`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // TODO: Send email invitation
    console.log(`Invitation created for ${email} to join ${user.organisation?.name}`);

    return NextResponse.json({ 
      success: true, 
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Invitation creation error:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organisation: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: "User must have an organisation" }, { status: 400 });
    }

    // Get pending invitations for this organisation
    const invitations = await prisma.invitation.findMany({
      where: { 
        organisationId: user.organisationId,
        status: 'PENDING'
      },
      include: {
        invitedByUser: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ 
      success: true, 
      invitations: invitations.map(inv => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        message: inv.message,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
        invitedBy: inv.invitedByUser,
      }))
    });

  } catch (error) {
    console.error("Invitation fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}
