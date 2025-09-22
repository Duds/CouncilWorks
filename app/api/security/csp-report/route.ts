import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, AuditAction } from "@/lib/audit";

/**
 * CSP Report API Endpoint
 * 
 * Handles Content Security Policy violation reports
 * Implements Essential Eight compliance for security monitoring
 */
export async function POST(request: NextRequest) {
  try {
    const report = await request.json();
    
    // Validate report structure
    if (!report['csp-report']) {
      return NextResponse.json(
        { error: 'Invalid CSP report format' },
        { status: 400 }
      );
    }
    
    const cspReport = report['csp-report'];
    
    // Extract violation details
    const violationDetails = {
      documentUri: cspReport['document-uri'],
      referrer: cspReport['referrer'],
      violatedDirective: cspReport['violated-directive'],
      effectiveDirective: cspReport['effective-directive'],
      originalPolicy: cspReport['original-policy'],
      disposition: cspReport['disposition'],
      blockedUri: cspReport['blocked-uri'],
      lineNumber: cspReport['line-number'],
      columnNumber: cspReport['column-number'],
      sourceFile: cspReport['source-file'],
      statusCode: cspReport['status-code'],
      scriptSample: cspReport['script-sample'],
    };
    
    // Log CSP violation to database
    await prisma.auditLog.create({
      data: {
        action: AuditAction.SECURITY_VIOLATION,
        details: JSON.stringify({
          type: 'CSP_VIOLATION',
          ...violationDetails,
        }),
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
      },
    });
    
    // Log audit event for security monitoring
    await logAuditEvent(
      AuditAction.SECURITY_VIOLATION,
      undefined, // No specific user
      undefined, // No specific organisation
      {
        type: 'CSP_VIOLATION',
        severity: 'MEDIUM',
        ...violationDetails,
      },
      request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    );
    
    // Log to console for immediate monitoring
    console.warn('CSP Violation Detected:', {
      timestamp: new Date().toISOString(),
      violation: violationDetails,
      ip: request.ip || request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    });
    
    // In production, you would typically:
    // 1. Send alerts for critical violations
    // 2. Update security metrics
    // 3. Trigger automated responses for repeated violations
    
    return NextResponse.json({ 
      success: true,
      message: 'CSP violation logged successfully'
    });
    
  } catch (error) {
    console.error('Error processing CSP report:', error);
    
    // Log error for debugging
    await prisma.auditLog.create({
      data: {
        action: AuditAction.SYSTEM_ERROR,
        details: JSON.stringify({
          type: 'CSP_REPORT_ERROR',
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
      },
    });
    
    return NextResponse.json(
      { error: 'Failed to process CSP report' },
      { status: 500 }
    );
  }
}
