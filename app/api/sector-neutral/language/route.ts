/**
 * Sector Neutral Language API Endpoint
 * 
 * GET /api/sector-neutral/language - Get language mappings
 * POST /api/sector-neutral/language - Update language mappings
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

    // Mock language mappings
    const mappings = {
      'council': 'organisation',
      'ratepayer': 'customer',
      'depot': 'facility',
      'workshop': 'maintenance-centre'
    };

    return NextResponse.json({ mappings });
  } catch (error) {
    console.error('Error getting language mappings:', error);
    return NextResponse.json(
      { error: 'Failed to get language mappings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mappings } = await request.json();

    // Mock update language mappings
    return NextResponse.json({
      message: 'Language mappings updated successfully',
      mappings
    });
  } catch (error) {
    console.error('Error updating language mappings:', error);
    return NextResponse.json(
      { error: 'Failed to update language mappings' },
      { status: 500 }
    );
  }
}
