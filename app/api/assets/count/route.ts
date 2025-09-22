import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/assets/count
 * Returns the count of assets for the authenticated user's organization
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's organization ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organisationId: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json(
        { error: 'User not associated with an organization' },
        { status: 400 }
      );
    }

    // Count assets for the user's organization
    const assetCount = await prisma.asset.count({
      where: {
        organisationId: user.organisationId,
      },
    });

    return NextResponse.json({ count: assetCount });
  } catch (error) {
    console.error('Error fetching asset count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset count' },
      { status: 500 }
    );
  }
}
