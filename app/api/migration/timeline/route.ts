/**
 * Migration Timeline API Endpoint
 * 
 * GET /api/migration/timeline - Get migration timeline
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

    // Mock migration timeline data
    const timeline = [
      {
        id: 'phase-1',
        name: 'Data Migration',
        status: 'completed',
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        progress: 100
      },
      {
        id: 'phase-2', 
        name: 'System Integration',
        status: 'in-progress',
        startDate: '2024-01-16',
        endDate: '2024-02-01',
        progress: 75
      }
    ];

    return NextResponse.json({ timeline });
  } catch (error) {
    console.error('Error getting migration timeline:', error);
    return NextResponse.json(
      { error: 'Failed to get migration timeline' },
      { status: 500 }
    );
  }
}
