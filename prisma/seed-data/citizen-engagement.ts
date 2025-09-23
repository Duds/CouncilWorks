import { PrismaClient } from '@prisma/client';

export async function generateCitizenEngagement(prisma: PrismaClient, organisationId: string) {
  console.log('👥 Creating citizen engagement data...');

  const reports = [
    {
      reporterName: 'John Smith',
      reporterEmail: 'john.smith@email.com',
      reporterPhone: '0412345678',
      issueCategory: 'INFRASTRUCTURE',
      riskLevel: 'MEDIUM',
      description: 'Pothole on Main Street causing vehicle damage',
      location: 'Main Street, Greenfield',
      organisationId: organisationId,
      status: 'OPEN',
    },
    {
      reporterName: 'Sarah Johnson',
      reporterEmail: 'sarah.johnson@email.com',
      reporterPhone: '0423456789',
      issueCategory: 'ENVIRONMENTAL',
      riskLevel: 'LOW',
      description: 'Street light not working on Oak Avenue',
      location: 'Oak Avenue, Greenfield',
      organisationId: organisationId,
      status: 'IN_PROGRESS',
    }
  ];

  const createdReports = [];

  for (const reportData of reports) {
    const report = await prisma.citizenReport.create({
      data: reportData,
    });
    createdReports.push(report);
  }

  console.log(`   ✅ Created ${createdReports.length} citizen reports`);
  return createdReports;
}
