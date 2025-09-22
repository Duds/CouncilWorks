import { NextRequest, NextResponse } from 'next/server';
import { generateSecurityHeaders } from '@/lib/security/csp-config';

/**
 * Security Headers Middleware
 * 
 * Implements Essential Eight compliance by adding comprehensive security headers
 * including Content Security Policy (CSP) for XSS protection
 */
export function securityHeadersMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get security headers configuration
  const securityHeaders = generateSecurityHeaders();
  
  // Add all security headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * CSP Report Handler
 * 
 * Handles Content Security Policy violation reports
 * Logs violations for security monitoring and analysis
 */
export async function handleCSPReport(request: NextRequest) {
  try {
    const report = await request.json();
    
    // Log CSP violation
    console.warn('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      report: report,
    });
    
    // In production, you would typically:
    // 1. Store the report in a security monitoring system
    // 2. Send alerts for critical violations
    // 3. Analyze patterns for security improvements
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json(
      { error: 'Failed to process CSP report' },
      { status: 400 }
    );
  }
}
