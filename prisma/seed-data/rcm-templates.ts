import { PrismaClient } from '@prisma/client';

/**
 * Generate RCM Templates for asset types
 * Demonstrates Rule 2: Risk Sets Rhythm
 */
export async function generateRCMTemplates(prisma: PrismaClient, organisationId: string) {
  console.log('📋 Creating RCM templates...');

  const templates = [
    {
      name: 'Water Treatment Plant RCM',
      description: 'Reliability Centered Maintenance template for water treatment facilities',
      assetType: 'WATER_SUPPLY',
      failureModes: [
        { mode: 'Pump Failure', criticality: 'HIGH', frequency: 'MONTHLY' },
        { mode: 'Filter Clogging', criticality: 'MEDIUM', frequency: 'WEEKLY' },
        { mode: 'Chemical Dosing Failure', criticality: 'CRITICAL', frequency: 'DAILY' }
      ],
      maintenanceTasks: [
        { task: 'Pump Inspection', frequency: 'MONTHLY', type: 'PREVENTIVE' },
        { task: 'Filter Cleaning', frequency: 'WEEKLY', type: 'PREVENTIVE' },
        { task: 'Chemical Level Check', frequency: 'DAILY', type: 'PREVENTIVE' }
      ]
    },
    {
      name: 'Road Infrastructure RCM',
      description: 'RCM template for road and bridge maintenance',
      assetType: 'ROAD',
      failureModes: [
        { mode: 'Surface Deterioration', criticality: 'MEDIUM', frequency: 'QUARTERLY' },
        { mode: 'Structural Damage', criticality: 'HIGH', frequency: 'MONTHLY' },
        { mode: 'Drainage Blockage', criticality: 'MEDIUM', frequency: 'WEEKLY' }
      ],
      maintenanceTasks: [
        { task: 'Surface Inspection', frequency: 'MONTHLY', type: 'PREVENTIVE' },
        { task: 'Structural Assessment', frequency: 'QUARTERLY', type: 'PREVENTIVE' },
        { task: 'Drainage Cleaning', frequency: 'WEEKLY', type: 'PREVENTIVE' }
      ]
    }
  ];

  const createdTemplates = [];

  for (const templateData of templates) {
    const template = await prisma.rCMTemplate.create({
      data: {
        name: templateData.name,
        description: templateData.description,
        assetType: templateData.assetType,
        organisationId: organisationId,
        isActive: true,
        version: '1.0',
        createdBy: 'system',
        updatedBy: 'system',
      },
    });

    createdTemplates.push(template);
  }

  console.log(`   ✅ Created ${createdTemplates.length} RCM templates`);
  return createdTemplates;
}
