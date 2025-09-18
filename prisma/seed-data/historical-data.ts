import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedHistoricalData(organisationId: string) {
  console.log('📊 Seeding historical operational data...');

  try {
    // Get assets for reference
    const assets = await prisma.asset.findMany({
      where: { organisationId: organisationId },
      select: { id: true, name: true, assetType: true }
    });

    if (assets.length === 0) {
      throw new Error('No assets found for historical data generation');
    }

    // Get users for assignment
    const users = await prisma.user.findMany({
      where: { organisationId: organisationId },
      select: { id: true, name: true, role: true }
    });

    if (users.length === 0) {
      throw new Error('No users found for historical data generation');
    }

    // Create Work Orders
    const workOrders = [];
    for (let i = 0; i < 15; i++) {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const assignedTo = users[Math.floor(Math.random() * users.length)];
      const assignedBy = users[Math.floor(Math.random() * users.length)];

      const workOrder = await prisma.workOrder.create({
        data: {
          assetId: asset.id,
          workOrderNumber: `WO-HIST-${String(i + 1).padStart(3, '0')}`,
          title: `Historical Work Order ${i + 1} - ${asset.name}`,
          description: `Historical maintenance work performed on ${asset.name}`,
          priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as any,
          status: 'COMPLETED',
          assignedTo: assignedTo.id,
          assignedBy: assignedBy.id,
          scheduledDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
          dueDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
          completedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          estimatedCost: Math.random() * 5000 + 500, // Random cost between $500-$5500
          actualCost: Math.random() * 5000 + 500,
          estimatedDuration: Math.floor(Math.random() * 480) + 60, // Random duration between 1-8 hours
          actualDuration: Math.floor(Math.random() * 480) + 60,
          workPerformed: `Completed maintenance work on ${asset.name}`,
          notes: `Historical work order completed successfully`
        }
      });

      workOrders.push(workOrder);
      console.log(`✅ Created work order: ${workOrder.title}`);
    }

    // Create Inspections
    const inspections = [];
    for (let i = 0; i < 20; i++) {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const inspector = users[Math.floor(Math.random() * users.length)];

      const inspection = await prisma.assetInspection.create({
        data: {
          assetId: asset.id,
          inspectionDate: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000), // Random date within last 120 days
          inspectorName: inspector.name,
          inspectorId: inspector.id,
          condition: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'][Math.floor(Math.random() * 4)] as any,
          conditionNotes: `Historical inspection of ${asset.name}`,
          issues: Math.random() > 0.7 ? ['Minor wear', 'Needs cleaning'] : [],
          recommendations: Math.random() > 0.5 ? 'Schedule routine maintenance' : null,
          nextInspectionDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within next 90 days
          priorityActions: Math.random() > 0.8 ? 'Monitor closely' : null
        }
      });

      inspections.push(inspection);
      console.log(`✅ Created inspection: ${inspection.inspectorName} - ${asset.name}`);
    }

    console.log('🎉 Historical operational data seeding completed successfully!');
    return {
      vendors: 0, // Not available in current schema
      contracts: 0, // Not available in current schema
      criticalControls: 0, // Not available in current schema
      assetControlMappings: 0, // Not available in current schema
      workOrders: workOrders.length,
      inspections: inspections.length
    };

  } catch (error) {
    console.error('❌ Error seeding historical operational data:', error);
    throw error;
  }
}

export async function cleanupHistoricalData(organisationId: string) {
  console.log('🧹 Cleaning up historical operational data...');
  
  try {
    // Delete in reverse order due to foreign key constraints
    await prisma.assetInspection.deleteMany({
      where: { 
        asset: {
          organisationId: organisationId
        }
      }
    });

    await prisma.workOrder.deleteMany({
      where: { 
        asset: {
          organisationId: organisationId
        }
      }
    });

    // Note: Critical controls and vendor/contract models don't exist in current schema
    // These will be added in PI3 when resilience features are implemented

    console.log('✅ Historical operational data cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up historical operational data:', error);
    throw error;
  }
}