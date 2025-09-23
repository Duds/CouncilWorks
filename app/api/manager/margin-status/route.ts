import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Margin Status API Endpoint
 * Provides margin management data showcasing Rule 4: Operate with Margin
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has Manager or higher role
    if (!['ADMIN', 'MANAGER', 'EXEC'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get organisation ID from user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organisationId: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: "User not associated with organisation" }, { status: 400 });
    }

    // Get margin status from database
    const marginStatuses = await prisma.marginStatus.findMany({
      where: { organisationId: user.organisationId },
      orderBy: { lastUpdated: 'desc' },
    });

    // Calculate overall margin utilization
    const overallUtilization = marginStatuses.length > 0 
      ? marginStatuses.reduce((sum, status) => sum + status.utilizationRate, 0) / marginStatuses.length
      : 0;

    return NextResponse.json({ 
      marginStatuses,
      overallUtilization: Math.round(overallUtilization * 100) / 100,
    });
  } catch (error) {
    console.error("Margin status API error:", error);
    return NextResponse.json(
      { error: "Failed to load margin status" },
      { status: 500 }
    );
  }
}

/**
 * Generate margin status data that demonstrates Rule 4: Operate with Margin
 */
function generateMarginStatusData() {
  return {
    timeMargin: 85,
    capacityMargin: 92,
    materialMargin: 78,
    financialMargin: 88,
    totalAvailable: 86,
    utilizationRate: 14,
    marginTypes: [
      {
        type: "TIME",
        allocated: 85,
        utilized: 15,
        available: 70,
        description: "Buffer time for maintenance activities",
        examples: ["Emergency response windows", "Weather delays", "Unexpected repairs"]
      },
      {
        type: "CAPACITY", 
        allocated: 92,
        utilized: 8,
        available: 84,
        description: "Surge capacity for peak demand",
        examples: ["Emergency crews", "Backup equipment", "Overtime capacity"]
      },
      {
        type: "MATERIAL",
        allocated: 78,
        utilized: 22,
        available: 56,
        description: "Critical spare parts and materials",
        examples: ["Emergency parts", "Fuel reserves", "Safety equipment"]
      },
      {
        type: "FINANCIAL",
        allocated: 88,
        utilized: 12,
        available: 76,
        description: "Emergency funding reserves",
        examples: ["Emergency repairs", "Disaster response", "Unplanned expenses"]
      }
    ],
    antifragileMetrics: {
      stressEvents: 12,
      improvementRate: 8.5,
      adaptationScore: 76,
      learningEvents: 45,
      resilienceGain: 12
    },
    marginEvents: [
      {
        id: "me-001",
        type: "DEPLOYMENT",
        marginType: "CAPACITY",
        amount: 25,
        reason: "Emergency water main repair",
        timestamp: "2025-01-20T14:30:00Z",
        status: "ACTIVE"
      },
      {
        id: "me-002", 
        type: "ALLOCATION",
        marginType: "TIME",
        amount: 15,
        reason: "Weather delay compensation",
        timestamp: "2025-01-19T09:15:00Z",
        status: "COMPLETED"
      },
      {
        id: "me-003",
        type: "OPTIMIZATION",
        marginType: "MATERIAL",
        amount: 10,
        reason: "Inventory optimization",
        timestamp: "2025-01-18T16:45:00Z",
        status: "COMPLETED"
      }
    ]
  };
}
