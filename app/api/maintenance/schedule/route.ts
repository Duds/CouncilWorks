import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isManagerOrHigher } from "@/lib/rbac";

/**
 * GET /api/maintenance/schedule - Get maintenance schedule
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const assignedTo = searchParams.get("assignedTo");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    // Build where clause
    const where: any = {
      asset: {
        organisationId: session.user.organisationId,
      },
    };

    if (startDate && endDate) {
      where.scheduledDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    // Get scheduled maintenance
    const scheduledMaintenance = await prisma.maintenanceSchedule.findMany({
      where,
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            assetNumber: true,
            assetType: true,
            address: true,
          },
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledDate: "asc" },
    });

    // Get work orders for the same period
    const workOrders = await prisma.workOrder.findMany({
      where: {
        ...where,
        scheduledDate: where.scheduledDate,
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            assetNumber: true,
            assetType: true,
            address: true,
          },
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledDate: "asc" },
    });

    // Combine and format the data
    const schedule = [
      ...scheduledMaintenance.map(item => ({
        id: item.id,
        type: "SCHEDULED_MAINTENANCE",
        title: item.taskName,
        description: `Scheduled maintenance for ${item.asset.name}`,
        scheduledDate: item.scheduledDate,
        dueDate: item.dueDate,
        completedDate: item.completedDate,
        status: item.status,
        priority: item.priority,
        assignedTo: item.assignedToUser,
        asset: item.asset,
        taskType: item.taskType,
        frequency: item.frequency,
      })),
      ...workOrders.map(item => ({
        id: item.id,
        type: "WORK_ORDER",
        title: item.title,
        description: item.description,
        scheduledDate: item.scheduledDate,
        dueDate: item.dueDate,
        completedDate: item.completedDate,
        status: item.status,
        priority: item.priority,
        assignedTo: item.assignedToUser,
        asset: item.asset,
        estimatedCost: item.estimatedCost,
        estimatedDuration: item.estimatedDuration,
      })),
    ].sort((a, b) => new Date(a.scheduledDate || 0).getTime() - new Date(b.scheduledDate || 0).getTime());

    // Calculate statistics
    const stats = {
      total: schedule.length,
      completed: schedule.filter(item => item.status === "COMPLETED").length,
      pending: schedule.filter(item => item.status === "PENDING" || item.status === "OPEN").length,
      overdue: schedule.filter(item => 
        item.dueDate && new Date(item.dueDate) < new Date() && item.status !== "COMPLETED"
      ).length,
      critical: schedule.filter(item => item.priority === "HIGH").length,
    };

    return NextResponse.json({
      schedule,
      stats,
      filters: {
        startDate,
        endDate,
        assignedTo,
        status,
        priority,
      },
    });

  } catch (error) {
    console.error("Error fetching maintenance schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance schedule" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/maintenance/schedule - Create or update maintenance schedule
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isManagerOrHigher(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      assetId,
      templateId,
      taskName,
      taskType,
      frequency,
      scheduledDate,
      dueDate,
      assignedTo,
      priority = "MEDIUM",
      notes,
    } = body;

    // Validate required fields
    if (!assetId || !taskName || !scheduledDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify asset exists and user has access
    const asset = await prisma.asset.findFirst({
      where: {
        id: assetId,
        organisationId: session.user.organisationId,
      },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Create maintenance schedule entry
    const maintenanceSchedule = await prisma.maintenanceSchedule.create({
      data: {
        assetId,
        templateId,
        taskName,
        taskType: taskType || "INSPECTION",
        frequency: frequency || "MONTHLY",
        scheduledDate: new Date(scheduledDate),
        dueDate: new Date(dueDate || scheduledDate),
        assignedTo: assignedTo || null,
        status: "PENDING",
        priority,
        notes,
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            assetNumber: true,
            assetType: true,
          },
        },
        assignedToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(maintenanceSchedule, { status: 201 });

  } catch (error) {
    console.error("Error creating maintenance schedule:", error);
    return NextResponse.json(
      { error: "Failed to create maintenance schedule" },
      { status: 500 }
    );
  }
}
