/**
 * Security Metrics API Endpoint
 * Provides security metrics for the monitoring dashboard
 * @route GET /api/security/metrics
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

    // Mock security metrics - in production, these would come from Snyk API
    const metrics = [
      {
        id: 'dependencies',
        name: 'Dependencies Scanned',
        status: 'healthy',
        value: 62,
        total: 62,
        lastUpdated: new Date().toISOString(),
        description: 'All dependencies scanned for vulnerabilities',
      },
      {
        id: 'vulnerabilities',
        name: 'Vulnerabilities Found',
        status: 'healthy',
        value: 0,
        total: 0,
        lastUpdated: new Date().toISOString(),
        description: 'No vulnerabilities detected',
      },
      {
        id: 'containers',
        name: 'Container Images',
        status: 'healthy',
        value: 1,
        total: 1,
        lastUpdated: new Date().toISOString(),
        description: 'Docker images scanned',
      },
      {
        id: 'infrastructure',
        name: 'Infrastructure Files',
        status: 'healthy',
        value: 3,
        total: 3,
        lastUpdated: new Date().toISOString(),
        description: 'IaC files scanned for misconfigurations',
      },
    ];

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching security metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
