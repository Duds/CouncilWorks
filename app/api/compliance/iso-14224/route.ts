/**
 * ISO 14224 API Endpoints
 * 
 * API endpoints for ISO 14224 compliance management
 * 
 * @fileoverview ISO 14224 compliance API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { iso14224Compliance } from '@/lib/iso-14224-compliance';

/**
 * Get ISO 14224 compliance data
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

    switch (type) {
      case 'classifications':
        const equipmentClassifications = await iso14224Compliance.getEquipmentClassifications(organisationId);
        return NextResponse.json(equipmentClassifications);

      case 'failure-modes':
        const failureModes = await iso14224Compliance.getFailureModeClassifications(organisationId);
        return NextResponse.json(failureModes);

      case 'maintenance-actions':
        const maintenanceActions = await iso14224Compliance.getMaintenanceActionClassifications(organisationId);
        return NextResponse.json(maintenanceActions);

      case 'report':
        const period = {
          startDate: new Date(searchParams.get('startDate') || Date.now() - 90 * 24 * 60 * 60 * 1000),
          endDate: new Date(searchParams.get('endDate') || Date.now()),
        };
        const report = await iso14224Compliance.generateComplianceReport(
          organisationId,
          period,
          session.user?.email || 'Unknown'
        );
        return NextResponse.json(report);

      case 'export':
        const exportFormat = searchParams.get('format') as 'JSON' | 'XML' | 'CSV' || 'JSON';
        const exportPeriod = {
          startDate: new Date(searchParams.get('startDate') || Date.now() - 90 * 24 * 60 * 60 * 1000),
          endDate: new Date(searchParams.get('endDate') || Date.now()),
        };
        const exportData = await iso14224Compliance.exportReliabilityData(
          organisationId,
          exportFormat,
          exportPeriod
        );
        return NextResponse.json({ data: exportData, format: exportFormat });

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('ISO 14224 API error:', error);
    return NextResponse.json(
      { error: 'Failed to get ISO 14224 compliance data' },
      { status: 500 }
    );
  }
}

/**
 * Record reliability data
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const reliabilityData = await iso14224Compliance.recordReliabilityData(data);

    return NextResponse.json(reliabilityData);
  } catch (error) {
    console.error('Reliability data recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record reliability data' },
      { status: 500 }
    );
  }
}
