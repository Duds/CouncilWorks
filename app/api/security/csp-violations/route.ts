import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * CSP Violations API Endpoint
 * 
 * Retrieves Content Security Policy violations for security monitoring
 * Implements Essential Eight compliance for security event analysis
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get CSP violations from audit logs
    const cspViolations = await prisma.auditLog.findMany({
      where: {
        action: 'SECURITY_VIOLATION',
        details: {
          contains: 'CSP_VIOLATION',
        },
        timestamp: {
          gte: new Date(Date.now() - hours * 60 * 60 * 1000),
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    // Parse violation details and format response
    const violations = cspViolations.map(violation => {
      const details = JSON.parse(violation.details || '{}');
      
      return {
        id: violation.id,
        violatedDirective: details.violatedDirective || 'Unknown',
        blockedUri: details.blockedUri || 'Unknown',
        sourceFile: details.sourceFile || 'Unknown',
        lineNumber: details.lineNumber || 0,
        columnNumber: details.columnNumber || 0,
        timestamp: violation.timestamp,
        severity: determineSeverity(details.violatedDirective, details.blockedUri),
        ipAddress: violation.ipAddress,
        userAgent: violation.userAgent,
      };
    });

    // Group violations by type for analysis
    const violationStats = violations.reduce((stats, violation) => {
      const key = violation.violatedDirective;
      if (!stats[key]) {
        stats[key] = {
          directive: key,
          count: 0,
          severity: violation.severity,
          lastOccurrence: violation.timestamp,
        };
      }
      stats[key].count++;
      if (violation.timestamp > stats[key].lastOccurrence) {
        stats[key].lastOccurrence = violation.timestamp;
      }
      return stats;
    }, {} as Record<string, any>);

    return NextResponse.json({
      violations,
      stats: Object.values(violationStats),
      total: violations.length,
      timeRange: `${hours} hours`,
    });
  } catch (error) {
    console.error("CSP violations API error:", error);
    return NextResponse.json(
      { error: "Failed to load CSP violations" },
      { status: 500 }
    );
  }
}

/**
 * Determine violation severity based on directive and blocked URI
 */
function determineSeverity(directive: string, blockedUri: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  // Critical: Script execution from untrusted sources
  if (directive === 'script-src' && blockedUri.includes('http')) {
    return 'CRITICAL';
  }
  
  // High: Object/embed sources, frame sources
  if (directive === 'object-src' || directive === 'frame-src') {
    return 'HIGH';
  }
  
  // Medium: Style sources, font sources
  if (directive === 'style-src' || directive === 'font-src') {
    return 'MEDIUM';
  }
  
  // Low: Image sources, media sources
  if (directive === 'img-src' || directive === 'media-src') {
    return 'LOW';
  }
  
  // Default to medium for unknown directives
  return 'MEDIUM';
}
