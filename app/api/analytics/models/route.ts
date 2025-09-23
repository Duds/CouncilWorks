/**
 * Analytics Models API Endpoint
 * 
 * GET /api/analytics/models - Get predictive models
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Mock data for now - replace with actual analytics engine
    const models = [
      {
        id: 'model-1',
        name: 'Asset Failure Prediction',
        type: 'predictive',
        status: 'active',
        accuracy: 0.85,
        lastTrained: new Date().toISOString(),
      },
      {
        id: 'model-2', 
        name: 'Maintenance Optimization',
        type: 'optimization',
        status: 'training',
        accuracy: 0.78,
        lastTrained: new Date().toISOString(),
      }
    ];

    let filteredModels = models;
    if (type) {
      filteredModels = models.filter(m => m.type === type);
    }
    if (status) {
      filteredModels = filteredModels.filter(m => m.status === status);
    }

    return NextResponse.json({ models: filteredModels });
  } catch (error) {
    console.error('Error getting models:', error);
    return NextResponse.json(
      { error: 'Failed to get models' },
      { status: 500 }
    );
  }
}
