/**
 * Multiple Hierarchies API Endpoints
 * 
 * API endpoints for managing multiple asset hierarchies
 * 
 * @fileoverview Multiple hierarchies API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { multipleHierarchySupport } from '@/lib/multiple-hierarchies';

/**
 * Get hierarchy views for an organisation
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');
    const hierarchyType = searchParams.get('type');
    const assetId = searchParams.get('assetId');

    if (!organisationId) {
      return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 });
    }

    if (assetId) {
      // Get asset hierarchy context
      const context = await multipleHierarchySupport.getAssetHierarchyContext(assetId);
      return NextResponse.json(context);
    } else if (hierarchyType) {
      // Get specific hierarchy type
      let hierarchy;
      switch (hierarchyType) {
        case 'function':
          hierarchy = await multipleHierarchySupport.getFunctionHierarchy(organisationId);
          break;
        case 'geographic':
          hierarchy = await multipleHierarchySupport.getGeographicHierarchy(organisationId);
          break;
        case 'organisational':
          hierarchy = await multipleHierarchySupport.getOrganisationalHierarchy(organisationId);
          break;
        case 'funding':
          hierarchy = await multipleHierarchySupport.getFundingHierarchy(organisationId);
          break;
        default:
          return NextResponse.json({ error: 'Invalid hierarchy type' }, { status: 400 });
      }
      return NextResponse.json(hierarchy);
    } else {
      // Get all hierarchy views
      const hierarchies = await multipleHierarchySupport.getAllHierarchyViews(organisationId);
      return NextResponse.json(hierarchies);
    }
  } catch (error) {
    console.error('Hierarchy error:', error);
    return NextResponse.json(
      { error: 'Failed to get hierarchy data' },
      { status: 500 }
    );
  }
}
