import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Signal Events API Endpoint
 * Provides real-time signal events showcasing Rule 3: Respond to the Real World
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    // Generate signal events data showcasing Rule 3
    const signals = generateSignalEventsData(timeRange);

    return NextResponse.json({ signals });
  } catch (error) {
    console.error("Signal events API error:", error);
    return NextResponse.json(
      { error: "Failed to load signal events" },
      { status: 500 }
    );
  }
}

/**
 * Generate signal events data that demonstrates Rule 3: Respond to the Real World
 */
function generateSignalEventsData(timeRange: string) {
  const baseDate = new Date();
  const signals = [];

  // Generate recent signal events
  const signalTypes = [
    {
      type: "weather",
      severity: "high",
      description: "Severe weather warning - high winds and heavy rain forecast",
      responseAction: "Reschedule outdoor maintenance activities",
      affectedAssets: ["asset-002", "asset-005", "asset-010"]
    },
    {
      type: "condition",
      severity: "critical",
      description: "Water treatment plant pH levels outside normal range",
      responseAction: "Immediate chemical adjustment and system check",
      affectedAssets: ["asset-001"]
    },
    {
      type: "performance",
      severity: "medium",
      description: "Electrical substation load approaching capacity limits",
      responseAction: "Load balancing and capacity planning review",
      affectedAssets: ["asset-003"]
    },
    {
      type: "external",
      severity: "high",
      description: "Emergency services reporting communication delays",
      responseAction: "Priority communication tower inspection",
      affectedAssets: ["asset-002"]
    },
    {
      type: "condition",
      severity: "medium",
      description: "Wastewater treatment facility flow rate 15% above normal",
      responseAction: "Process adjustment and flow monitoring",
      affectedAssets: ["asset-004", "asset-009"]
    },
    {
      type: "weather",
      severity: "low",
      description: "Temperature drop affecting HVAC system efficiency",
      responseAction: "HVAC system optimization and filter check",
      affectedAssets: ["asset-008"]
    },
    {
      type: "performance",
      severity: "critical",
      description: "Fire station equipment test failure detected",
      responseAction: "Immediate equipment replacement and backup activation",
      affectedAssets: ["asset-006"]
    },
    {
      type: "external",
      severity: "medium",
      description: "Community health centre reporting power fluctuations",
      responseAction: "Generator system inspection and power quality check",
      affectedAssets: ["asset-007"]
    },
    {
      type: "condition",
      severity: "low",
      description: "Traffic control system minor software glitch detected",
      responseAction: "Software update and system restart",
      affectedAssets: ["asset-010"]
    },
    {
      type: "performance",
      severity: "high",
      description: "Bridge structural monitoring shows minor stress increase",
      responseAction: "Enhanced monitoring and load restriction review",
      affectedAssets: ["asset-005"]
    }
  ];

  // Generate signal events with timestamps
  signalTypes.forEach((signal, index) => {
    const timestamp = new Date(baseDate);
    timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 48)); // Last 48 hours
    
    signals.push({
      id: `signal-${index + 1}`,
      ...signal,
      timestamp: timestamp.toISOString()
    });
  });

  // Sort by timestamp (most recent first)
  return signals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
