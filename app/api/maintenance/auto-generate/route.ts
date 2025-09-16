import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isManagerOrHigher } from "@/lib/rbac";
import { AuditAction } from "@prisma/client";
import { logAuditEvent } from "@/lib/audit";

/**
 * POST /api/maintenance/auto-generate - Automatically generate work orders from RCM templates
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isManagerOrHigher(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { assetIds, templateIds, riskThreshold, timeHorizon } = body;

    // Get assets with their RCM templates and risk data
    const assets = await prisma.asset.findMany({
      where: {
        id: { in: assetIds || [] },
        organisationId: session.user.organisationId,
      },
      include: {
        rcmTemplates: {
          include: {
            template: {
              include: {
                maintenanceTasks: {
                  where: {
                    // Filter by time horizon if specified
                    ...(timeHorizon && {
                      frequency: getFrequencyFilter(timeHorizon),
                    }),
                  },
                },
              },
            },
          },
        },
        maintenance: {
          orderBy: { maintenanceDate: "desc" },
          take: 5,
        },
        inspections: {
          orderBy: { inspectionDate: "desc" },
          take: 1,
        },
      },
    });

    const generatedWorkOrders = [];
    const errors = [];

    for (const asset of assets) {
      try {
        // Calculate asset risk score
        const riskScore = calculateAssetRiskScore(asset);
        
        // Skip if risk threshold not met
        if (riskThreshold && riskScore < riskThreshold) {
          continue;
        }

        // Get maintenance tasks from templates
        const allTasks = asset.rcmTemplates.flatMap(rt => 
          rt.template.maintenanceTasks.map(task => ({
            ...task,
            templateName: rt.template.name,
            templateId: rt.template.id,
          }))
        );

        // Generate work orders for each task
        for (const task of allTasks) {
          const workOrder = await generateWorkOrderFromTask(asset, task, session.user);
          if (workOrder) {
            generatedWorkOrders.push(workOrder);
          }
        }
      } catch (error) {
        errors.push({
          assetId: asset.id,
          assetName: asset.name,
          error: error.message,
        });
      }
    }

    // Record audit log
    await logAuditEvent(
      AuditAction.ASSET_CREATED,
      session.user.id,
      session.user.organisationId,
      { message: `Auto-generated ${generatedWorkOrders.length} work orders from RCM templates` },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      request.headers.get("user-agent")
    );

    return NextResponse.json({
      success: true,
      generatedWorkOrders,
      errors,
      summary: {
        totalGenerated: generatedWorkOrders.length,
        totalErrors: errors.length,
        assetsProcessed: assets.length,
      },
    });

  } catch (error) {
    console.error("Error auto-generating work orders:", error);
    return NextResponse.json(
      { error: "Failed to auto-generate work orders" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to generate work order from maintenance task
 */
async function generateWorkOrderFromTask(asset: any, task: any, user: any) {
  try {
    // Calculate next due date based on frequency and last maintenance
    const nextDueDate = calculateNextDueDate(task, asset.maintenance);
    
    // Skip if task was recently completed
    if (isTaskRecentlyCompleted(task, asset.maintenance)) {
      return null;
    }

    // Generate work order number
    const workOrderNumber = `WO-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Determine priority based on risk and task type
    const priority = determineWorkOrderPriority(asset, task);

    // Create work order
    const workOrder = await prisma.workOrder.create({
      data: {
        assetId: asset.id,
        workOrderNumber,
        title: `${task.name} - ${asset.name}`,
        description: generateWorkOrderDescription(asset, task),
        priority,
        status: "OPEN",
        assignedTo: null, // Will be assigned later
        assignedBy: user.id,
        scheduledDate: nextDueDate,
        dueDate: nextDueDate,
        estimatedCost: task.estimatedCost || 0,
        estimatedDuration: task.duration || 60,
        // Store RCM template information
        notes: JSON.stringify({
          templateId: task.templateId,
          templateName: task.templateName,
          taskId: task.id,
          taskType: task.type,
          frequency: task.frequency,
          skillLevel: task.skillLevel,
          tools: task.tools,
          materials: task.materials,
          instructions: task.instructions,
          safetyRequirements: task.safetyRequirements,
        }),
      },
    });

    return {
      id: workOrder.id,
      workOrderNumber: workOrder.workOrderNumber,
      title: workOrder.title,
      assetName: asset.name,
      priority: workOrder.priority,
      dueDate: workOrder.dueDate,
      estimatedCost: workOrder.estimatedCost,
      templateName: task.templateName,
    };
  } catch (error) {
    console.error("Error generating work order:", error);
    return null;
  }
}

/**
 * Calculate next due date based on task frequency and maintenance history
 */
function calculateNextDueDate(task: any, maintenanceHistory: any[]): Date {
  const now = new Date();
  const frequency = task.frequency;
  
  // Find the last time this specific task was performed
  const lastMaintenance = maintenanceHistory.find(m => 
    m.description?.toLowerCase().includes(task.name.toLowerCase())
  );
  
  let nextDueDate = new Date(now);
  
  if (lastMaintenance) {
    nextDueDate = new Date(lastMaintenance.maintenanceDate);
  }
  
  // Add frequency interval
  switch (frequency) {
    case "DAILY":
      nextDueDate.setDate(nextDueDate.getDate() + 1);
      break;
    case "WEEKLY":
      nextDueDate.setDate(nextDueDate.getDate() + 7);
      break;
    case "MONTHLY":
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      break;
    case "QUARTERLY":
      nextDueDate.setMonth(nextDueDate.getMonth() + 3);
      break;
    case "SEMI_ANNUALLY":
      nextDueDate.setMonth(nextDueDate.getMonth() + 6);
      break;
    case "ANNUALLY":
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      break;
    case "BIENNIALLY":
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 2);
      break;
    case "AS_NEEDED":
      // For "as needed" tasks, schedule based on risk
      nextDueDate.setDate(nextDueDate.getDate() + 30);
      break;
    case "CONDITION_BASED":
      // For condition-based tasks, schedule based on asset condition
      nextDueDate.setDate(nextDueDate.getDate() + 14);
      break;
    default:
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  }
  
  return nextDueDate;
}

/**
 * Check if task was recently completed
 */
function isTaskRecentlyCompleted(task: any, maintenanceHistory: any[]): boolean {
  const recentThreshold = 7; // days
  const cutoffDate = new Date(Date.now() - recentThreshold * 24 * 60 * 60 * 1000);
  
  return maintenanceHistory.some(m => {
    const maintenanceDate = new Date(m.maintenanceDate);
    const description = m.description?.toLowerCase() || "";
    const taskName = task.name.toLowerCase();
    
    return maintenanceDate >= cutoffDate && description.includes(taskName);
  });
}

/**
 * Determine work order priority based on asset risk and task type
 */
function determineWorkOrderPriority(asset: any, task: any): string {
  // Base priority on task type
  let priority = "MEDIUM";
  
  if (task.type === "REPAIR" || task.type === "REPLACEMENT") {
    priority = "HIGH";
  } else if (task.type === "INSPECTION" && asset.condition === "CRITICAL") {
    priority = "HIGH";
  } else if (task.type === "INSPECTION" || task.type === "CLEANING") {
    priority = "LOW";
  }
  
  // Adjust based on asset condition
  if (asset.condition === "CRITICAL") {
    priority = "HIGH";
  } else if (asset.condition === "POOR") {
    priority = priority === "LOW" ? "MEDIUM" : priority;
  }
  
  return priority;
}

/**
 * Generate work order description
 */
function generateWorkOrderDescription(asset: any, task: any): string {
  let description = `${task.description || task.name}\n\n`;
  
  if (task.instructions) {
    description += `Instructions:\n${task.instructions}\n\n`;
  }
  
  if (task.tools) {
    description += `Required Tools: ${task.tools}\n`;
  }
  
  if (task.materials) {
    description += `Required Materials: ${task.materials}\n`;
  }
  
  if (task.skillLevel) {
    description += `Skill Level Required: ${task.skillLevel}\n`;
  }
  
  if (task.safetyRequirements) {
    description += `Safety Requirements: ${task.safetyRequirements}\n`;
  }
  
  description += `\nAsset: ${asset.name} (${asset.assetNumber})\n`;
  description += `Location: ${asset.address || "Not specified"}\n`;
  description += `Frequency: ${task.frequency}`;
  
  return description;
}

/**
 * Calculate asset risk score
 */
function calculateAssetRiskScore(asset: any): number {
  let riskScore = 0;
  
  // Condition risk
  switch (asset.condition) {
    case "EXCELLENT": riskScore += 1; break;
    case "GOOD": riskScore += 3; break;
    case "FAIR": riskScore += 6; break;
    case "POOR": riskScore += 9; break;
    case "CRITICAL": riskScore += 10; break;
    default: riskScore += 5;
  }
  
  // Age risk
  if (asset.installationDate && asset.expectedLifespan) {
    const ageInYears = (Date.now() - new Date(asset.installationDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const agePercentage = (ageInYears / asset.expectedLifespan) * 100;
    riskScore += Math.min(agePercentage / 10, 10);
  }
  
  // Maintenance history risk
  const recentMaintenance = asset.maintenance.filter(
    m => Date.now() - new Date(m.maintenanceDate).getTime() < 365 * 24 * 60 * 60 * 1000
  );
  if (recentMaintenance.length === 0) {
    riskScore += 3;
  }
  
  return Math.min(riskScore, 100);
}

/**
 * Get frequency filter for time horizon
 */
function getFrequencyFilter(timeHorizon: string): any {
  switch (timeHorizon) {
    case "IMMEDIATE":
      return { in: ["DAILY", "WEEKLY", "AS_NEEDED", "CONDITION_BASED"] };
    case "SHORT_TERM":
      return { in: ["WEEKLY", "MONTHLY", "AS_NEEDED", "CONDITION_BASED"] };
    case "MEDIUM_TERM":
      return { in: ["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY"] };
    case "LONG_TERM":
      return { in: ["ANNUALLY", "BIENNIALLY"] };
    default:
      return {};
  }
}
