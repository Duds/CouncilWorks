import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRealTimeData(organisationId: string) {
  console.log('⚡ Seeding real-time signals and metrics data...');

  try {
    // Get assets for signal generation
    const assets = await prisma.asset.findMany({
      where: { organisationId: organisationId },
      select: { id: true, name: true, assetType: true, address: true }
    });

    if (assets.length === 0) {
      throw new Error('No assets found for real-time data generation');
    }

    // Get users for assignment
    const users = await prisma.user.findMany({
      where: { organisationId: organisationId },
      select: { id: true, name: true, role: true }
    });

    if (users.length === 0) {
      throw new Error('No users found for real-time data generation');
    }

    // Create Active Work Orders (current/recent)
    const activeWorkOrders = [];
    for (let i = 0; i < 8; i++) {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const assignedTo = users[Math.floor(Math.random() * users.length)];
      const assignedBy = users[Math.floor(Math.random() * users.length)];

      const workOrder = await prisma.workOrder.create({
        data: {
          assetId: asset.id,
          workOrderNumber: `WO-ACTIVE-${String(i + 1).padStart(3, '0')}`,
          title: `Active Work Order ${i + 1} - ${asset.name}`,
          description: `Current maintenance work in progress for ${asset.name}`,
          priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as any,
          status: ['OPEN', 'IN_PROGRESS'][Math.floor(Math.random() * 2)],
          assignedTo: assignedTo.id,
          assignedBy: assignedBy.id,
          scheduledDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Next 7 days
          dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000), // Next 14 days
          estimatedCost: Math.random() * 3000 + 200, // Random cost between $200-$3200
          estimatedDuration: Math.floor(Math.random() * 240) + 30, // Random duration between 30min-4 hours
          workPerformed: null, // Not completed yet
          notes: `Active work order for ${asset.name}`
        }
      });

      activeWorkOrders.push(workOrder);
      console.log(`✅ Created active work order: ${workOrder.title}`);
    }

    // Create Scheduled Inspections (upcoming)
    const scheduledInspections = [];
    for (let i = 0; i < 12; i++) {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const inspector = users[Math.floor(Math.random() * users.length)];

      const inspection = await prisma.assetInspection.create({
        data: {
          assetId: asset.id,
          inspectionDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Next 30 days
          inspectorName: `INS-SCHEDULED-${inspector.name}`,
          inspectorId: inspector.id,
          condition: 'GOOD', // Default condition for scheduled inspections
          conditionNotes: `Scheduled inspection for ${asset.name}`,
          issues: [],
          recommendations: null,
          nextInspectionDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000), // Next 60 days
          priorityActions: null
        }
      });

      scheduledInspections.push(inspection);
      console.log(`✅ Created scheduled inspection: ${inspection.inspectorName} - ${asset.name}`);
    }

    console.log('🎉 Real-time signals and metrics data seeding completed successfully!');
    return {
      signals: 0, // Not available in current schema
      marginEntries: 0, // Not available in current schema
      resilienceMetrics: 0, // Not available in current schema
      activeWorkOrders: activeWorkOrders.length,
      scheduledInspections: scheduledInspections.length
    };

  } catch (error) {
    console.error('❌ Error seeding real-time signals and metrics data:', error);
    throw error;
  }
}

export async function cleanupRealTimeData(organisationId: string) {
  console.log('🧹 Cleaning up real-time signals and metrics data...');
  
  try {
    // Delete in reverse order due to foreign key constraints
    await prisma.assetInspection.deleteMany({
      where: { 
        asset: {
          organisationId: organisationId
        },
        inspectorName: { startsWith: 'INS-SCHEDULED-' }
      }
    });

    await prisma.workOrder.deleteMany({
      where: { 
        asset: {
          organisationId: organisationId
        },
        workOrderNumber: { startsWith: 'WO-ACTIVE-' }
      }
    });

    console.log('✅ Real-time signals and metrics data cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up real-time signals and metrics data:', error);
    throw error;
  }
}