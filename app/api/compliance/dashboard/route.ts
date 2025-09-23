/**
 * Epic 9 API Endpoints - Industry Compliance & Standards
 * 
 * This module provides API endpoints for all ISO compliance features including
 * ISO 14224, ISO 55000, ISO 27001/27002, and ISO 31000 compliance management.
 * 
 * @fileoverview API endpoints for Epic 9 compliance features
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { iso14224Compliance } from '@/lib/iso-14224-compliance';
import { iso55000Compliance } from '@/lib/iso-55000-compliance';
import { iso27001Compliance } from '@/lib/iso-27001-compliance';
import { iso31000Compliance } from '@/lib/iso-31000-compliance';
import { complianceDashboardSystem } from '@/lib/compliance-dashboard';

/**
 * Get compliance dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');
    const type = searchParams.get('type');

    if (!organisationId) {
      return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 });
    }

    if (type === 'dashboard') {
      const dashboard = await complianceDashboardSystem.getComplianceDashboard(organisationId);
      return NextResponse.json(dashboard);
    } else if (type === 'alerts') {
      const alerts = await complianceDashboardSystem.getComplianceAlerts(organisationId);
      return NextResponse.json(alerts);
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Compliance dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to get compliance dashboard' },
      { status: 500 }
    );
  }
}

/**
 * Generate compliance report
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organisationId, standards, period, generatedBy } = await request.json();

    if (!organisationId || !standards || !period) {
      return NextResponse.json({ 
        error: 'Organisation ID, standards, and period required' 
      }, { status: 400 });
    }

    const report = await complianceDashboardSystem.generateComplianceReport(
      organisationId,
      standards,
      period,
      generatedBy || session.user?.email || 'Unknown'
    );

    return NextResponse.json(report);
  } catch (error) {
    console.error('Compliance report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate compliance report' },
      { status: 500 }
    );
  }
}

/**
 * Acknowledge compliance alert
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alertId, acknowledgedBy } = await request.json();

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    await complianceDashboardSystem.acknowledgeAlert(
      alertId,
      acknowledgedBy || session.user?.email || 'Unknown'
    );

    return NextResponse.json({ message: 'Alert acknowledged successfully' });
  } catch (error) {
    console.error('Alert acknowledgment error:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge alert' },
      { status: 500 }
    );
  }
}
