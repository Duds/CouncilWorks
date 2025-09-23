import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const organisation = await prisma.organisation.upsert({
    where: { name: 'Sample Council' },
    update: {},
    create: {
      id: 'sample-council-id',
      name: 'Sample Council',
      updatedAt: new Date()
    }
  });

  const passwordHash = await bcrypt.hash('ChangeMe_123!', 12);

  // Create users with different roles
  const users = [
    {
      email: 'admin@sample.council',
      name: 'Admin User',
      role: Role.ADMIN,
    },
    {
      email: 'manager@sample.council',
      name: 'Manager User',
      role: Role.MANAGER,
    },
    {
      email: 'supervisor@sample.council',
      name: 'Supervisor User',
      role: Role.SUPERVISOR,
    },
    {
      email: 'crew@sample.council',
      name: 'Crew Member',
      role: Role.CREW,
    },
    {
      email: 'exec@sample.council',
      name: 'Executive User',
      role: Role.EXEC,
    },
    {
      email: 'contractor@sample.council',
      name: 'Contractor User',
      role: Role.CONTRACTOR,
    },
    {
      email: 'partner@sample.council',
      name: 'Partner User',
      role: Role.PARTNER,
    },
    {
      email: 'citizen@sample.council',
      name: 'Citizen User',
      role: Role.CITIZEN,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        id: `user-${userData.email.split('@')[0]}`,
        passwordHash,
        organisationId: organisation.id,
        isActive: true,
        updatedAt: new Date(),
      }
    });
  }

  // Create Service Purposes for resilience features
  const servicePurposes = [
    {
      name: 'Safe Drinking Water Control',
      description: 'Ensures safe, reliable drinking water supply to the community',
      priority: 'CRITICAL' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Wastewater Management Control',
      description: 'Manages wastewater collection, treatment and disposal',
      priority: 'CRITICAL' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Road Safety Control',
      description: 'Maintains safe and functional road infrastructure',
      priority: 'HIGH' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Community Recreation Control',
      description: 'Provides recreational facilities and spaces for community wellbeing',
      priority: 'MEDIUM' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Emergency Services Control',
      description: 'Supports emergency response and public safety infrastructure',
      priority: 'CRITICAL' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Public Health Control',
      description: 'Maintains facilities essential for public health and wellbeing',
      priority: 'HIGH' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Environmental Management Control',
      description: 'Manages environmental protection and sustainability infrastructure',
      priority: 'HIGH' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Transportation Control',
      description: 'Provides efficient transportation infrastructure and services',
      priority: 'HIGH' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Community Services Control',
      description: 'Delivers essential community services and facilities',
      priority: 'MEDIUM' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
    {
      name: 'Infrastructure Support Control',
      description: 'Provides supporting infrastructure for all other services',
      priority: 'HIGH' as const,
      status: 'ACTIVE',
      isCoreFunction: true,
    },
  ];

  const createdServicePurposes = [];
  for (const purposeData of servicePurposes) {
    // Check if service purpose already exists
    let servicePurpose = await prisma.servicePurpose.findFirst({
      where: {
        organisationId: organisation.id,
        name: purposeData.name
      }
    });

    if (!servicePurpose) {
      servicePurpose = await prisma.servicePurpose.create({
        data: {
          ...purposeData,
          organisationId: organisation.id,
        }
      });
    }
    createdServicePurposes.push(servicePurpose);
  }

  // Create sample assets with purpose mappings
  const assets = [
    {
      assetNumber: 'A001',
      name: 'Main Water Treatment Plant',
      assetType: 'WATER_SUPPLY' as const,
      condition: 'GOOD' as const,
      priority: 'CRITICAL' as const,
      location: 'Industrial Zone, 123 Water St',
      purposeMapping: createdServicePurposes[0], // Safe Drinking Water Control
    },
    {
      assetNumber: 'A002',
      name: 'City Centre Intersection',
      assetType: 'TRAFFIC_LIGHT' as const,
      condition: 'FAIR' as const,
      priority: 'HIGH' as const,
      location: 'Main Street & Centre Road',
      purposeMapping: createdServicePurposes[1], // Road Safety Control
    },
    {
      assetNumber: 'A003',
      name: 'Community Swimming Pool',
      assetType: 'SPORTS_FACILITY' as const,
      condition: 'EXCELLENT' as const,
      priority: 'MEDIUM' as const,
      location: 'Recreation Centre, 456 Leisure Ave',
      purposeMapping: createdServicePurposes[2], // Community Recreation Control
    },
  ];

  const createdAssets = [];
  for (const assetData of assets) {
    const asset = await prisma.asset.upsert({
      where: { assetNumber: assetData.assetNumber },
      update: {},
      create: {
        id: `asset-${assetData.assetNumber}`,
        assetNumber: assetData.assetNumber,
        name: assetData.name,
        assetType: assetData.assetType,
        condition: assetData.condition,
        priority: assetData.priority,
        location: assetData.location,
        organisationId: organisation.id,
        status: 'ACTIVE',
        updatedAt: new Date(),
      }
    });

    // Create purpose mapping
    const existingMapping = await prisma.assetPurposeMapping.findFirst({
      where: {
        assetId: asset.id,
        servicePurposeId: assetData.purposeMapping.id
      }
    });

    if (!existingMapping) {
      await prisma.assetPurposeMapping.create({
        data: {
          assetId: asset.id,
          servicePurposeId: assetData.purposeMapping.id,
          contribution: Math.floor(Math.random() * 100) + 1, // Random contribution score 1-100
          criticality: assetData.priority,
        }
      });
    }

    createdAssets.push(asset);
  }

  // Create Risk Rhythm Profiles
  for (let i = 0; i < createdAssets.length; i++) {
    const asset = createdAssets[i];
    const purpose = createdServicePurposes[i];

    const existingProfile = await prisma.riskRhythmProfile.findFirst({
      where: {
        organisationId: organisation.id,
        assetId: asset.id
      }
    });

    if (!existingProfile) {
      await prisma.riskRhythmProfile.create({
        data: {
          organisationId: organisation.id,
          assetId: asset.id,
          servicePurposeId: purpose.id,
          consequenceScore: purpose.priority === 'CRITICAL' ? 10 : purpose.priority === 'HIGH' ? 8 : 5,
          likelihoodScore: asset.condition === 'EXCELLENT' ? 2 : asset.condition === 'GOOD' ? 3 : 5,
          riskScore: purpose.priority === 'CRITICAL' ? 50 : purpose.priority === 'HIGH' ? 40 : 25,
          seasonalAdjustment: 1.2,
          weatherAdjustment: 1.1,
          usageAdjustment: 1.0,
          maintenanceFrequency: purpose.priority === 'CRITICAL' ? 30 : 90,
          lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          nextMaintenance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          status: 'ACTIVE',
        }
      });
    }
  }

  // Create sample Resilience Signals
  const signals = [
    {
      signalType: 'ENVIRONMENTAL',
      source: 'Weather Station Alpha',
      severity: 'MEDIUM',
      description: 'Heavy rainfall detected in catchment area',
      assetId: createdAssets[0].id,
      servicePurposeId: createdServicePurposes[0].id,
      responseRequired: true,
      responseStatus: 'PENDING',
    },
    {
      signalType: 'OPERATIONAL',
      source: 'Traffic Management System',
      severity: 'HIGH',
      description: 'Traffic signal malfunction detected',
      assetId: createdAssets[1].id,
      servicePurposeId: createdServicePurposes[1].id,
      responseRequired: true,
      responseStatus: 'IN_PROGRESS',
    },
    {
      signalType: 'COMMUNITY',
      source: 'Citizen Report',
      severity: 'LOW',
      description: 'Pool temperature complaint',
      assetId: createdAssets[2].id,
      servicePurposeId: createdServicePurposes[2].id,
      responseRequired: false,
      responseStatus: 'PENDING',
    },
  ];

  for (const signalData of signals) {
    await prisma.resilienceSignal.create({
      data: {
        ...signalData,
        organisationId: organisation.id,
        signalData: { source: signalData.source, timestamp: new Date() },
        detectedBy: users.find(u => u.role === Role.MANAGER)?.email ?
          (await prisma.user.findUnique({ where: { email: users.find(u => u.role === Role.MANAGER)!.email } }))?.id : null,
        detectedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time in last 24 hours
      }
    });
  }

  // Create Margin Operations
  const marginOperations = [
    {
      operationType: 'EMERGENCY_RESPONSE',
      resourceType: 'WATER_TREATMENT',
      availableCapacity: 100,
      utilizedCapacity: 25,
      emergencyThreshold: 80,
      status: 'AVAILABLE',
    },
    {
      operationType: 'TRAFFIC_MANAGEMENT',
      resourceType: 'TRAFFIC_SIGNALS',
      availableCapacity: 50,
      utilizedCapacity: 12,
      emergencyThreshold: 40,
      status: 'AVAILABLE',
    },
    {
      operationType: 'RECREATION_SERVICES',
      resourceType: 'POOL_MAINTENANCE',
      availableCapacity: 30,
      utilizedCapacity: 5,
      emergencyThreshold: 25,
      status: 'AVAILABLE',
    },
  ];

  for (const operationData of marginOperations) {
    await prisma.marginOperation.create({
      data: {
        ...operationData,
        organisationId: organisation.id,
        lastDeployment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      }
    });
  }

  console.log('Seed data created successfully including resilience features');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
