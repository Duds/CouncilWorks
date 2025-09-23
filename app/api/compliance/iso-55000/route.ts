/**
 * ISO 55000 API Endpoints
 * 
 * API endpoints for ISO 55000 compliance management
 * 
 * @fileoverview ISO 55000 compliance API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { iso55000Compliance } from '@/lib/iso-55000-compliance';

/**
 * Get ISO 55000 compliance data
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
      case 'policies':
        const policies = await iso55000Compliance.getAssetManagementPolicies(organisationId);
        return NextResponse.json(policies);

      case 'objectives':
        const objectives = await iso55000Compliance.getAssetManagementObjectives(organisationId);
        return NextResponse.json(objectives);

      case 'performance-indicators':
        const performanceIndicators = await iso55000Compliance.getPerformanceIndicators(organisationId);
        return NextResponse.json(performanceIndicators);

      case 'improvements':
        const improvements = await iso55000Compliance.getContinuousImprovements(organisationId);
        return NextResponse.json(improvements);

      case 'report':
        const period = {
          startDate: new Date(searchParams.get('startDate') || Date.now() - 90 * 24 * 60 * 60 * 1000),
          endDate: new Date(searchParams.get('endDate') || Date.now()),
        };
        const report = await iso55000Compliance.generateComplianceReport(
          organisationId,
          period,
          session.user?.email || 'Unknown'
        );
        return NextResponse.json(report);

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('ISO 55000 API error:', error);
    return NextResponse.json(
      { error: 'Failed to get ISO 55000 compliance data' },
      { status: 500 }
    );
  }
}

/**
 * Create asset management policy or objective
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json({ error: 'Type and data required' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'policy':
        result = await iso55000Compliance.createAssetManagementPolicy(data);
        break;

      case 'objective':
        result = await iso55000Compliance.createAssetManagementObjective(data);
        break;

      case 'improvement':
        result = await iso55000Compliance.createContinuousImprovement(data);
        break;

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('ISO 55000 creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create ISO 55000 data' },
      { status: 500 }
    );
  }
}
