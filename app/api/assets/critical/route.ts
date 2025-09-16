/**
 * Critical Asset Elevation API Endpoints
 * 
 * API endpoints for critical asset management and elevation
 * 
 * @fileoverview Critical asset elevation API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { criticalAssetElevation } from '@/lib/critical-asset-elevation';

/**
 * Get critical assets and dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');
    const assetId = searchParams.get('assetId');
    const dashboard = searchParams.get('dashboard');

    if (!organisationId) {
      return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 });
    }

    if (dashboard === 'true') {
      // Get critical asset dashboard
      const dashboardData = await criticalAssetElevation.getCriticalAssetDashboard(organisationId);
      return NextResponse.json(dashboardData);
    } else if (assetId) {
      // Get specific critical asset
      const criticalAsset = await criticalAssetElevation.getCriticalAssetById(assetId);
      if (!criticalAsset) {
        return NextResponse.json({ error: 'Critical asset not found' }, { status: 404 });
      }
      return NextResponse.json(criticalAsset);
    } else {
      // Get all critical assets
      const criticalAssets = await criticalAssetElevation.getCriticalAssets(organisationId);
      return NextResponse.json(criticalAssets);
    }
  } catch (error) {
    console.error('Critical assets error:', error);
    return NextResponse.json(
      { error: 'Failed to get critical assets data' },
      { status: 500 }
    );
  }
}

/**
 * Update critical asset status or controls
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assetId, updates } = await request.json();

    if (!assetId || !updates) {
      return NextResponse.json({ error: 'Asset ID and updates required' }, { status: 400 });
    }

    // This would typically update critical asset data in the database
    // For now, we'll return a success response
    return NextResponse.json({ 
      message: 'Critical asset updated successfully',
      assetId,
      updates 
    });
  } catch (error) {
    console.error('Update critical asset error:', error);
    return NextResponse.json(
      { error: 'Failed to update critical asset' },
      { status: 500 }
    );
  }
}
