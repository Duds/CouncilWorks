import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const trialSchema = z.object({
  trialType: z.enum(['blank', 'sample', 'import']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trialType } = trialSchema.parse(body);

    // Get user with organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organisation: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: "User must have an organisation" }, { status: 400 });
    }

    // Handle different trial types
    switch (trialType) {
      case 'sample':
        // Create sample assets for the organisation
        await createSampleAssets(user.organisationId);
        break;
      
      case 'import':
        // For now, just mark as ready for import
        // In a real implementation, you'd set up import queues or similar
        break;
      
      case 'blank':
      default:
        // No additional setup needed for blank account
        break;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Trial setup completed with ${trialType} configuration`
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Trial setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup trial" },
      { status: 500 }
    );
  }
}

async function createSampleAssets(organisationId: string) {
  // Create sample assets for demonstration
  const sampleAssets = [
    {
      name: "Main Administration Building",
      type: "Building",
      location: "123 Main Street, Melbourne VIC 3000",
      status: "ACTIVE",
      condition: "GOOD",
      organisationId,
    },
    {
      name: "Community Centre",
      type: "Building", 
      location: "456 Community Ave, Melbourne VIC 3000",
      status: "ACTIVE",
      condition: "FAIR",
      organisationId,
    },
    {
      name: "Public Library",
      type: "Building",
      location: "789 Library Lane, Melbourne VIC 3000", 
      status: "ACTIVE",
      condition: "EXCELLENT",
      organisationId,
    },
    {
      name: "Playground Equipment Set A",
      type: "Equipment",
      location: "Central Park, Melbourne VIC 3000",
      status: "ACTIVE", 
      condition: "GOOD",
      organisationId,
    },
    {
      name: "Street Lighting System",
      type: "Infrastructure",
      location: "Main Street Corridor",
      status: "ACTIVE",
      condition: "FAIR", 
      organisationId,
    },
  ];

  await prisma.asset.createMany({
    data: sampleAssets,
  });
}
