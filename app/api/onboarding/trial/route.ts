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
    
    console.log("Trial setup request - Session:", session ? "exists" : "null");
    
    if (!session?.user?.id) {
      console.log("No session or user ID found for trial setup");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Trial setup request body:", body);
    
    const { trialType } = trialSchema.parse(body);

    // Get user with organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organisation: true },
    });

    if (!user?.organisationId) {
      console.log("User has no organisation for trial setup");
      return NextResponse.json({ error: "User must have an organisation" }, { status: 400 });
    }

    console.log("Setting up trial type:", trialType, "for organisation:", user.organisationId);

    // Handle different trial types
    switch (trialType) {
      case 'sample':
        console.log("Creating sample assets...");
        // Create sample assets for the organisation
        await createSampleAssets(user.organisationId);
        console.log("Sample assets created successfully");
        break;
      
      case 'import':
        console.log("Setting up import trial...");
        // Redirect to import page after trial setup
        // The import page will handle the actual data import process
        break;
      
      case 'blank':
      default:
        console.log("Setting up blank trial...");
        // No additional setup needed for blank account
        break;
    }

    console.log("Trial setup completed successfully for type:", trialType);

    return NextResponse.json({ 
      success: true, 
      message: `Trial setup completed with ${trialType} configuration`
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Trial setup validation error:", error.errors);
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
