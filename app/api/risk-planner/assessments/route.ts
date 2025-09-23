import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Risk Assessment API Endpoint
 * Provides risk assessment data showcasing Rule 2: Risk Sets the Rhythm
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

    // Generate risk assessment data showcasing Rule 2
    const assessments = generateRiskAssessmentData(timeRange);

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error("Risk assessment API error:", error);
    return NextResponse.json(
      { error: "Failed to load risk assessments" },
      { status: 500 }
    );
  }
}

/**
 * Generate risk assessment data that demonstrates Rule 2: Risk Sets the Rhythm
 */
function generateRiskAssessmentData(timeRange: string) {
  return [
    {
      assetId: "asset-001",
      assetName: "Main Water Treatment Plant",
      assetType: "Water Infrastructure",
      riskScore: 95,
      consequence: 95,
      likelihood: 100,
      lastAssessment: "2025-01-20",
      nextAssessment: "2025-01-22",
      riskTrend: "up",
      criticalControls: ["Water quality monitoring", "Emergency backup systems", "Power redundancy"]
    },
    {
      assetId: "asset-002",
      assetName: "Emergency Services Communication Tower",
      assetType: "Communication Infrastructure",
      riskScore: 78,
      consequence: 90,
      likelihood: 87,
      lastAssessment: "2025-01-19",
      nextAssessment: "2025-01-25",
      riskTrend: "stable",
      criticalControls: ["Backup power", "Redundant communication paths", "Weather protection"]
    },
    {
      assetId: "asset-003",
      assetName: "Main Electrical Substation",
      assetType: "Electrical Infrastructure",
      riskScore: 65,
      consequence: 85,
      likelihood: 76,
      lastAssessment: "2025-01-18",
      nextAssessment: "2025-01-28",
      riskTrend: "down",
      criticalControls: ["Load monitoring", "Temperature sensors", "Emergency shutdown"]
    },
    {
      assetId: "asset-004",
      assetName: "Wastewater Treatment Facility",
      assetType: "Wastewater Infrastructure",
      riskScore: 72,
      consequence: 80,
      likelihood: 90,
      lastAssessment: "2025-01-17",
      nextAssessment: "2025-01-27",
      riskTrend: "up",
      criticalControls: ["Flow monitoring", "Chemical dosing", "Emergency overflow"]
    },
    {
      assetId: "asset-005",
      assetName: "Main Road Bridge - Highway 1",
      assetType: "Transportation Infrastructure",
      riskScore: 45,
      consequence: 70,
      likelihood: 64,
      lastAssessment: "2025-01-16",
      nextAssessment: "2025-02-15",
      riskTrend: "stable",
      criticalControls: ["Structural monitoring", "Load limits", "Weather protection"]
    },
    {
      assetId: "asset-006",
      assetName: "Fire Station Equipment",
      assetType: "Emergency Services",
      riskScore: 88,
      consequence: 95,
      likelihood: 93,
      lastAssessment: "2025-01-15",
      nextAssessment: "2025-01-25",
      riskTrend: "up",
      criticalControls: ["Equipment testing", "Response time monitoring", "Backup equipment"]
    },
    {
      assetId: "asset-007",
      assetName: "Community Health Centre Generator",
      assetType: "Health Infrastructure",
      riskScore: 58,
      consequence: 75,
      likelihood: 77,
      lastAssessment: "2025-01-14",
      nextAssessment: "2025-02-14",
      riskTrend: "down",
      criticalControls: ["Fuel monitoring", "Load testing", "Emergency protocols"]
    },
    {
      assetId: "asset-008",
      assetName: "Main Library HVAC System",
      assetType: "Community Infrastructure",
      riskScore: 32,
      consequence: 40,
      likelihood: 80,
      lastAssessment: "2025-01-13",
      nextAssessment: "2025-02-13",
      riskTrend: "stable",
      criticalControls: ["Temperature control", "Air quality monitoring", "Maintenance schedule"]
    },
    {
      assetId: "asset-009",
      assetName: "Sewer Pump Station Alpha",
      assetType: "Wastewater Infrastructure",
      riskScore: 82,
      consequence: 85,
      likelihood: 96,
      lastAssessment: "2025-01-12",
      nextAssessment: "2025-01-22",
      riskTrend: "up",
      criticalControls: ["Pump monitoring", "Flow sensors", "Emergency bypass"]
    },
    {
      assetId: "asset-010",
      assetName: "Traffic Control System",
      assetType: "Transportation Infrastructure",
      riskScore: 38,
      consequence: 50,
      likelihood: 76,
      lastAssessment: "2025-01-11",
      nextAssessment: "2025-02-11",
      riskTrend: "stable",
      criticalControls: ["System monitoring", "Backup power", "Manual override"]
    }
  ];
}
