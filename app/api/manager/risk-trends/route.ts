import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Risk Trends API Endpoint
 * Provides risk trend analysis showcasing Rule 2: Risk Sets the Rhythm
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

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';

    // Generate risk trends data showcasing Rule 2
    const trends = generateRiskTrendsData(timeRange);

    return NextResponse.json({ trends });
  } catch (error) {
    console.error("Risk trends API error:", error);
    return NextResponse.json(
      { error: "Failed to load risk trends" },
      { status: 500 }
    );
  }
}

/**
 * Generate risk trends data that demonstrates Rule 2: Risk Sets the Rhythm
 */
function generateRiskTrendsData(timeRange: string) {
  const baseDate = new Date();
  const trends = [];
  
  // Generate trend data based on time range
  let periods = [];
  let baseRiskScore = 65;
  
  switch (timeRange) {
    case '24h':
      periods = Array.from({ length: 24 }, (_, i) => {
        const date = new Date(baseDate);
        date.setHours(date.getHours() - (23 - i));
        return {
          period: date.toLocaleTimeString("en-AU", { hour: '2-digit', minute: '2-digit' }),
          date: date.toISOString(),
          riskScore: baseRiskScore + Math.random() * 20 - 10,
          trend: i > 0 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
        };
      });
      break;
      
    case '7d':
      periods = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - (6 - i));
        return {
          period: date.toLocaleDateString("en-AU", { weekday: 'short', day: 'numeric' }),
          date: date.toISOString(),
          riskScore: baseRiskScore + Math.random() * 15 - 7.5,
          trend: i > 0 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
        };
      });
      break;
      
    case '30d':
      periods = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - (29 - i));
        return {
          period: date.toLocaleDateString("en-AU", { day: 'numeric', month: 'short' }),
          date: date.toISOString(),
          riskScore: baseRiskScore + Math.random() * 25 - 12.5,
          trend: i > 0 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
        };
      });
      break;
      
    case '90d':
      periods = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - (11 - i) * 7);
        return {
          period: `Week ${12 - i}`,
          date: date.toISOString(),
          riskScore: baseRiskScore + Math.random() * 30 - 15,
          trend: i > 0 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
        };
      });
      break;
  }
  
  // Calculate change percentages
  return periods.map((period, index) => {
    const change = index > 0 ? 
      Math.round(((period.riskScore - periods[index - 1].riskScore) / periods[index - 1].riskScore) * 100) : 0;
    
    return {
      ...period,
      change,
      riskLevel: getRiskLevel(period.riskScore),
      consequence: getConsequenceLevel(period.riskScore),
      likelihood: getLikelihoodLevel(period.riskScore)
    };
  });
}

/**
 * Determine risk level based on score
 */
function getRiskLevel(score: number): string {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

/**
 * Determine consequence level based on score
 */
function getConsequenceLevel(score: number): string {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

/**
 * Determine likelihood level based on score
 */
function getLikelihoodLevel(score: number): string {
  if (score >= 80) return 'VERY LIKELY';
  if (score >= 60) return 'LIKELY';
  if (score >= 40) return 'POSSIBLE';
  return 'UNLIKELY';
}
