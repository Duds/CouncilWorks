/**
 * Epic 8 API Endpoints - Graph-Based Asset Intelligence
 * 
 * This module provides API endpoints for the hybrid database architecture,
 * function-based organization, multiple hierarchies, and critical asset elevation.
 * 
 * @fileoverview API endpoints for Epic 8 features
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dataSyncService } from '@/lib/data-sync';
import { functionBasedOrg } from '@/lib/function-based-org';
import { multipleHierarchySupport } from '@/lib/multiple-hierarchies';
import { criticalAssetElevation } from '@/lib/critical-asset-elevation';

/**
 * Sync assets to graph database
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organisationId } = await request.json();
    
    if (!organisationId) {
      return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 });
    }

    const result = await dataSyncService.syncAssetsToGraph({
      batchSize: 100,
      dryRun: false,
      forceUpdate: false,
    });

    return NextResponse.json({
      success: result.success,
      recordsProcessed: result.recordsProcessed,
      errors: result.errors,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync assets to graph database' },
      { status: 500 }
    );
  }
}

/**
 * Get asset intelligence data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const organisationId = searchParams.get('organisationId');

    if (assetId) {
      // Get specific asset intelligence
      const intelligence = await dataSyncService.getAssetIntelligence(assetId);
      return NextResponse.json(intelligence);
    } else if (organisationId) {
      // Get organisation-level intelligence summary
      const summary = await getOrganisationIntelligenceSummary(organisationId);
      return NextResponse.json(summary);
    } else {
      return NextResponse.json({ error: 'Asset ID or Organisation ID required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Asset intelligence error:', error);
    return NextResponse.json(
      { error: 'Failed to get asset intelligence' },
      { status: 500 }
    );
  }
}

/**
 * Get organisation intelligence summary
 */
async function getOrganisationIntelligenceSummary(organisationId: string) {
  const [
    functionAnalytics,
    hierarchyViews,
    criticalDashboard,
  ] = await Promise.all([
    functionBasedOrg.getFunctionAnalytics(organisationId),
    multipleHierarchySupport.getAllHierarchyViews(organisationId),
    criticalAssetElevation.getCriticalAssetDashboard(organisationId),
  ]);

  return {
    functionAnalytics,
    hierarchyViews,
    criticalDashboard,
    lastUpdated: new Date(),
  };
}
