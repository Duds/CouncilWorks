import { PrismaClient } from '@prisma/client';

export async function generateCriticalControls(prisma: PrismaClient, organisationId: string, assets: any[]) {
  console.log('🛡️ Creating critical controls...');

  const controls = [
    {
      name: 'Water Quality Monitoring',
      description: 'Continuous monitoring of water quality parameters',
      category: 'ENVIRONMENTAL',
      frequency: 'CONTINUOUS',
      criticality: 'CRITICAL',
      organisationId: organisationId,
    },
    {
      name: 'Structural Integrity Check',
      description: 'Regular structural integrity assessments',
      category: 'SAFETY',
      frequency: 'MONTHLY',
      criticality: 'HIGH',
      organisationId: organisationId,
    }
  ];

  const createdControls = [];

  for (const controlData of controls) {
    const control = await prisma.criticalControl.create({
      data: controlData,
    });
    createdControls.push(control);
  }

  console.log(`   ✅ Created ${createdControls.length} critical controls`);
  return createdControls;
}
