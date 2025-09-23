import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/resilience/controls/status
 * Retrieve critical control status for Control Dashboard
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

    // Fetch critical controls with asset mappings and compliance status
    const criticalControls = await prisma.criticalControl.findMany({
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
                lastInspection: true,
                nextInspection: true,
              },
            },
          },
        },
        complianceRecords: {
          where: {
            status: 'PENDING',
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 1,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform data for frontend
    const controlsWithStatus = criticalControls.map(control => {
      const assetCount = control.assetMappings.length;

      // Calculate control status based on asset conditions and compliance
      const criticalAssets = control.assetMappings.filter(
        mapping => mapping.asset.condition === 'CRITICAL' || mapping.asset.priority === 'CRITICAL'
      ).length;

      const overdueAssets = control.assetMappings.filter(
        mapping => mapping.asset.nextInspection && new Date(mapping.asset.nextInspection) < new Date()
      ).length;

      // Determine overall status
      let status: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

      if (criticalAssets > 0 || overdueAssets > assetCount * 0.3) {
        status = 'RED';
        riskLevel = 'CRITICAL';
      } else if (overdueAssets > 0 || criticalAssets > 0) {
        status = 'AMBER';
        riskLevel = 'HIGH';
      } else if (overdueAssets > assetCount * 0.1) {
        status = 'AMBER';
        riskLevel = 'MEDIUM';
      }

      // Get next due date from compliance records or asset inspections
      let nextDue: string | undefined;
      if (control.complianceRecords.length > 0) {
        nextDue = control.complianceRecords[0].dueDate?.toISOString();
      } else {
        const nextInspections = control.assetMappings
          .map(mapping => mapping.asset.nextInspection)
          .filter(Boolean)
          .sort();
        nextDue = nextInspections[0] || undefined;
      }

      // Get last inspection date
      const lastInspections = control.assetMappings
        .map(mapping => mapping.asset.lastInspection)
        .filter(Boolean)
        .sort()
        .reverse();
      const lastInspection = lastInspections[0] || undefined;

      return {
        id: control.id,
        name: control.name,
        type: control.type,
        status,
        riskLevel,
        assetCount,
        criticalAssets,
        overdueAssets,
        lastInspection,
        nextDue,
        windowHours: control.windowHours,
        frequencyDays: control.frequencyDays,
      };
    });

    // Calculate summary statistics
    const totalControls = controlsWithStatus.length;
    const greenControls = controlsWithStatus.filter(c => c.status === 'GREEN').length;
    const amberControls = controlsWithStatus.filter(c => c.status === 'AMBER').length;
    const redControls = controlsWithStatus.filter(c => c.status === 'RED').length;
    const totalAssets = controlsWithStatus.reduce((sum, c) => sum + c.assetCount, 0);

    return NextResponse.json({
      controls: controlsWithStatus,
      summary: {
        totalControls,
        greenControls,
        amberControls,
        redControls,
        totalAssets,
        overallStatus: redControls > 0 ? 'RED' : amberControls > 0 ? 'AMBER' : 'GREEN',
      },
    });

  } catch (error) {
    console.error('Error fetching critical control status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch critical control status' },
      { status: 500 }
    );
  }
}
