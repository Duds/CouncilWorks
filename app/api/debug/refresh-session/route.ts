import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: "No session found" 
      }, { status: 401 });
    }

    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        organisation: true,
        vendor: true 
      },
    });

    if (!user) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 });
    }

    // Return the fresh data - the client can use this to update their session
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organisationId: user.organisationId,
        organisation: user.organisation,
        vendorId: user.vendorId,
        vendor: user.vendor,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
      },
      onboardingRequired: !user.organisationId,
      message: "Session data refreshed. Please refresh your browser or sign out and sign in again to update your session."
    });

  } catch (error) {
    console.error("Session refresh error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
