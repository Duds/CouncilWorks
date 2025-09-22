import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "No session found",
        session: null 
      }, { status: 401 });
    }

    // Get user with organisation from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        organisation: true,
        vendor: true 
      },
    });

    return NextResponse.json({
      session: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        organisationId: session.user.organisationId,
        organisation: session.user.organisation,
        mfaRequired: session.user.mfaRequired,
      },
      database: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role,
        organisationId: user?.organisationId,
        organisation: user?.organisation,
        vendorId: user?.vendorId,
        vendor: user?.vendor,
        isActive: user?.isActive,
        lastLoginAt: user?.lastLoginAt,
      },
      onboardingRequired: !user?.organisationId,
      debug: {
        sessionOrganisationId: session.user.organisationId,
        databaseOrganisationId: user?.organisationId,
        hasOrganisation: !!user?.organisationId,
        organisationName: user?.organisation?.name,
      }
    });

  } catch (error) {
    console.error("Debug session error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
