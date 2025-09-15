import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const organisationSchema = z.object({
  name: z.string().min(2, "Organisation name must be at least 2 characters"),
  domain: z.string().min(2, "Domain must be at least 2 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, domain } = organisationSchema.parse(body);

    // Check if user already has an organisation
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organisation: true },
    });

    if (existingUser?.organisationId) {
      return NextResponse.json({ error: "User already has an organisation" }, { status: 400 });
    }

    // Check if organisation with this domain already exists
    const existingOrg = await prisma.organisation.findFirst({
      where: { 
        OR: [
          { name },
          { name: { contains: domain } }
        ]
      },
    });

    if (existingOrg) {
      return NextResponse.json({ 
        error: "An organisation with this name or domain already exists" 
      }, { status: 400 });
    }

    // Create organisation and update user
    const organisation = await prisma.organisation.create({
      data: {
        name,
        users: {
          connect: { id: session.user.id }
        }
      },
    });

    // Update user to be admin of this organisation
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        organisationId: organisation.id,
        role: 'ADMIN' // First user becomes admin
      },
    });

    return NextResponse.json({ 
      success: true, 
      organisation: {
        id: organisation.id,
        name: organisation.name,
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Organisation creation error:", error);
    return NextResponse.json(
      { error: "Failed to create organisation" },
      { status: 500 }
    );
  }
}
