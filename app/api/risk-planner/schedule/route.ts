import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Risk-Driven Schedule API Endpoint
 * Provides dynamic maintenance schedule based on risk assessment
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';
    const priority = searchParams.get('priority') || 'ALL';

    // Generate dynamic schedule data showcasing Rule 2
    const schedule = generateDynamicScheduleData(timeRange, priority);

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Risk-driven schedule API error:", error);
    return NextResponse.json(
      { error: "Failed to load risk-driven schedule" },
      { status: 500 }
    );
  }
}

/**
 * Generate dynamic schedule data that demonstrates Rule 2: Risk Sets the Rhythm
 */
function generateDynamicScheduleData(timeRange: string, priority: string) {
  const baseDate = new Date();
  const scheduleItems = [];

  // Generate schedule items based on risk scores and time range
  const riskBasedTasks = [
    {
      assetId: "asset-001",
      assetName: "Main Water Treatment Plant",
      taskType: "Critical System Inspection",
      priority: "critical",
      riskScore: 95,
      estimatedDuration: 120,
      estimatedCost: 2500,
      assignedTo: "Senior Water Technician",
      adaptationReason: "High risk score requires immediate attention"
    },
    {
      assetId: "asset-002",
      assetName: "Emergency Services Communication Tower",
      taskType: "Communication System Test",
      priority: "high",
      riskScore: 78,
      estimatedDuration: 90,
      estimatedCost: 1800,
      assignedTo: "Communication Specialist",
      adaptationReason: "Weather conditions affecting signal quality"
    },
    {
      assetId: "asset-003",
      assetName: "Main Electrical Substation",
      taskType: "Electrical Load Testing",
      priority: "high",
      riskScore: 65,
      estimatedDuration: 180,
      estimatedCost: 3200,
      assignedTo: "Electrical Engineer",
      adaptationReason: "Peak demand period approaching"
    },
    {
      assetId: "asset-004",
      assetName: "Wastewater Treatment Facility",
      taskType: "Process Optimization Review",
      priority: "medium",
      riskScore: 72,
      estimatedDuration: 150,
      estimatedCost: 2200,
      assignedTo: "Process Engineer",
      adaptationReason: "Seasonal flow variations detected"
    },
    {
      assetId: "asset-005",
      assetName: "Main Road Bridge - Highway 1",
      taskType: "Structural Assessment",
      priority: "medium",
      riskScore: 45,
      estimatedDuration: 240,
      estimatedCost: 4500,
      assignedTo: "Structural Engineer",
      adaptationReason: "Routine inspection cycle"
    },
    {
      assetId: "asset-006",
      assetName: "Fire Station Equipment",
      taskType: "Emergency Equipment Check",
      priority: "critical",
      riskScore: 88,
      estimatedDuration: 60,
      estimatedCost: 800,
      assignedTo: "Fire Equipment Specialist",
      adaptationReason: "Critical control failure risk"
    },
    {
      assetId: "asset-007",
      assetName: "Community Health Centre Generator",
      taskType: "Generator Load Test",
      priority: "medium",
      riskScore: 58,
      estimatedDuration: 90,
      estimatedCost: 1200,
      assignedTo: "Generator Technician",
      adaptationReason: "Scheduled maintenance cycle"
    },
    {
      assetId: "asset-008",
      assetName: "Main Library HVAC System",
      taskType: "HVAC Filter Replacement",
      priority: "low",
      riskScore: 32,
      estimatedDuration: 45,
      estimatedCost: 300,
      assignedTo: "HVAC Technician",
      adaptationReason: "Preventive maintenance schedule"
    },
    {
      assetId: "asset-009",
      assetName: "Sewer Pump Station Alpha",
      taskType: "Pump Performance Analysis",
      priority: "high",
      riskScore: 82,
      estimatedDuration: 120,
      estimatedCost: 1900,
      assignedTo: "Pump Specialist",
      adaptationReason: "High risk score triggers priority scheduling"
    },
    {
      assetId: "asset-010",
      assetName: "Traffic Control System",
      taskType: "System Software Update",
      priority: "low",
      riskScore: 38,
      estimatedDuration: 30,
      estimatedCost: 500,
      assignedTo: "IT Specialist",
      adaptationReason: "Scheduled software maintenance"
    }
  ];

  // Generate schedule items based on time range
  riskBasedTasks.forEach((task, index) => {
    const scheduledDate = new Date(baseDate);
    const dueDate = new Date(baseDate);
    
    // Risk-based scheduling: higher risk = sooner scheduling
    if (task.riskScore >= 80) {
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 2)); // 0-1 days
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 3) + 1); // 1-3 days
    } else if (task.riskScore >= 60) {
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 5) + 1); // 1-5 days
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7) + 3); // 3-9 days
    } else if (task.riskScore >= 40) {
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 14) + 5); // 5-18 days
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 21) + 10); // 10-30 days
    } else {
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) + 15); // 15-44 days
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) + 30); // 30-89 days
    }

    // Determine status based on dates
    let status = 'scheduled';
    if (scheduledDate < baseDate) {
      status = Math.random() > 0.3 ? 'completed' : 'overdue';
    } else if (scheduledDate.toDateString() === baseDate.toDateString()) {
      status = Math.random() > 0.5 ? 'in_progress' : 'scheduled';
    }

    scheduleItems.push({
      id: `schedule-${index + 1}`,
      ...task,
      scheduledDate: scheduledDate.toISOString(),
      dueDate: dueDate.toISOString(),
      status
    });
  });

  // Filter by priority if specified
  if (priority !== 'ALL') {
    return scheduleItems.filter(item => item.priority === priority);
  }

  return scheduleItems;
}
