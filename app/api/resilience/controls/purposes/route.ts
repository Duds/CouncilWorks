import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/resilience/controls/purposes
 * Retrieve service purposes for Control Dashboard
 * Implements Aegrid Rule 1: Every Asset Has a Purpose
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organisation: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: 'User not associated with organisation' }, { status: 400 });
    }

    // Fetch service purposes with asset counts and risk levels
    const servicePurposes = await prisma.servicePurpose.findMany({
      where: {
        organisationId: user.organisationId,
        status: 'ACTIVE',
      },
      include: {
        assetMappings: {
          include: {
            asset: {
              select: {
                id: true,
                name: true,
                condition: true,
                priority: true,
              },
            },
          },
        },
        criticalControl: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' },
      ],
    });

    // Transform data for frontend
    const purposesWithMetrics = servicePurposes.map(purpose => {
      const assetCount = purpose.assetMappings.length;
      const criticalAssets = purpose.assetMappings.filter(
        mapping => mapping.asset.priority === 'CRITICAL'
      ).length;

      // Calculate risk level based on asset conditions and priorities
      const riskFactors = purpose.assetMappings.map(mapping => {
        const conditionRisk = {
          'CRITICAL': 4,
          'POOR': 3,
          'FAIR': 2,
          'GOOD': 1,
          'EXCELLENT': 0,
        }[mapping.asset.condition] || 0;

        const priorityRisk = {
          'CRITICAL': 4,
          'HIGH': 3,
          'MEDIUM': 2,
          'LOW': 1,
        }[mapping.asset.priority] || 0;

        return Math.max(conditionRisk, priorityRisk);
      });

      const avgRiskFactor = riskFactors.length > 0
        ? riskFactors.reduce((sum, risk) => sum + risk, 0) / riskFactors.length
        : 0;

      const riskLevel = avgRiskFactor >= 3 ? 'CRITICAL' :
                       avgRiskFactor >= 2 ? 'HIGH' :
                       avgRiskFactor >= 1 ? 'MEDIUM' : 'LOW';

      return {
        id: purpose.id,
        name: purpose.name,
        description: purpose.description,
        criticalControlId: purpose.criticalControlId,
        criticalControl: purpose.criticalControl,
        priority: purpose.priority,
        status: purpose.status,
        isCoreFunction: purpose.isCoreFunction,
        assetCount,
        criticalAssets,
        riskLevel,
        lastAssessment: purpose.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      purposes: purposesWithMetrics,
      totalPurposes: servicePurposes.length,
      totalAssets: purposesWithMetrics.reduce((sum, p) => sum + p.assetCount, 0),
    });

  } catch (error) {
    console.error('Error fetching service purposes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service purposes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resilience/controls/purposes
 * Create a new service purpose
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has manager or admin role
    if (!['ADMIN', 'MANAGER', 'EXEC'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, criticalControlId, priority, isCoreFunction } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get user's organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organisationId: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: 'User not associated with organisation' }, { status: 400 });
    }

    // Create service purpose
    const servicePurpose = await prisma.servicePurpose.create({
      data: {
        name,
        description,
        criticalControlId,
        priority: priority || 'MEDIUM',
        isCoreFunction: isCoreFunction || false,
        organisationId: user.organisationId,
      },
      include: {
        criticalControl: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      purpose: servicePurpose,
      message: 'Service purpose created successfully',
    });

  } catch (error) {
    console.error('Error creating service purpose:', error);
    return NextResponse.json(
      { error: 'Failed to create service purpose' },
      { status: 500 }
    );
  }
}
