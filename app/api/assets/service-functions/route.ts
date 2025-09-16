/**
 * Function-Based Organization API Endpoints
 * 
 * API endpoints for managing service functions and function-based asset organization
 * 
 * @fileoverview Function-based organization API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { functionBasedOrg } from '@/lib/function-based-org';

/**
 * Get service functions for an organisation
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');
    const category = searchParams.get('category');

    if (!organisationId) {
      return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 });
    }

    let serviceFunctions;
    if (category) {
      serviceFunctions = await functionBasedOrg.getAssetsByPurposeCategory(organisationId, category);
    } else {
      serviceFunctions = await functionBasedOrg.getServiceFunctions(organisationId);
    }

    return NextResponse.json(serviceFunctions);
  } catch (error) {
    console.error('Service functions error:', error);
    return NextResponse.json(
      { error: 'Failed to get service functions' },
      { status: 500 }
    );
  }
}

/**
 * Create a new service function
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, category, organisationId } = await request.json();

    if (!name || !organisationId) {
      return NextResponse.json({ error: 'Name and Organisation ID required' }, { status: 400 });
    }

    const functionId = await functionBasedOrg.createServiceFunction({
      name,
      description: description || '',
      category: category || 'General',
      organisationId,
    });

    return NextResponse.json({ functionId, message: 'Service function created successfully' });
  } catch (error) {
    console.error('Create service function error:', error);
    return NextResponse.json(
      { error: 'Failed to create service function' },
      { status: 500 }
    );
  }
}

/**
 * Assign asset to service function
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assetId, serviceFunctionName, organisationId } = await request.json();

    if (!assetId || !serviceFunctionName || !organisationId) {
      return NextResponse.json({ 
        error: 'Asset ID, Service Function Name, and Organisation ID required' 
      }, { status: 400 });
    }

    await functionBasedOrg.assignAssetToServiceFunction(
      assetId,
      serviceFunctionName,
      organisationId
    );

    return NextResponse.json({ message: 'Asset assigned to service function successfully' });
  } catch (error) {
    console.error('Assign asset error:', error);
    return NextResponse.json(
      { error: 'Failed to assign asset to service function' },
      { status: 500 }
    );
  }
}
