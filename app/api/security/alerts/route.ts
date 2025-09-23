/**
 * Security Alerts API Endpoint
 * Provides vulnerability alerts for the monitoring dashboard
 * @route GET /api/security/alerts
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin or manager role
    if (!['ADMIN', 'MANAGER', 'EXEC'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Mock vulnerability alerts - in production, these would come from Snyk API
    const alerts = [
      // Currently no vulnerabilities - this would be populated from Snyk API
    ];

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching security alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
