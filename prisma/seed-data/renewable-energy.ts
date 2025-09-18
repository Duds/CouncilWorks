import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRenewableEnergyAssets(organisationId: string) {
  console.log('🌱 Seeding renewable energy assets...');

  try {
    // Wind Turbines
    const windTurbines = [
      {
        assetNumber: 'WT-001',
        name: 'Wind Turbine WT-001',
        description: '3.2MW Vestas V150 wind turbine - Primary energy generation',
        assetType: 'OTHER',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'Greenfield Wind Farm - North Sector',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Vestas',
        model: 'V150',
        serialNumber: 'V150-001-GF',
        installationDate: new Date('2022-03-15'),
        warrantyExpiry: new Date('2032-03-15'),
        expectedLifespan: 25,
        purchasePrice: 4500000.00,
        currentValue: 4200000.00,
        replacementCost: 4800000.00,
        depreciationRate: 3.5,
        lastInspection: new Date('2024-01-10'),
        nextInspection: new Date('2024-02-10'),
        inspectionFrequency: 30,
        maintenanceCost: 150000.00,
        tags: ['renewable', 'wind', 'energy', 'critical'],
        notes: 'Primary wind energy generation asset - requires regular maintenance'
      },
      {
        assetNumber: 'WT-002',
        name: 'Wind Turbine WT-002',
        description: '3.2MW Vestas V150 wind turbine - Secondary energy generation',
        assetType: 'OTHER',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'Greenfield Wind Farm - South Sector',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Vestas',
        model: 'V150',
        serialNumber: 'V150-002-GF',
        installationDate: new Date('2022-04-20'),
        warrantyExpiry: new Date('2032-04-20'),
        expectedLifespan: 25,
        purchasePrice: 4500000.00,
        currentValue: 4200000.00,
        replacementCost: 4800000.00,
        depreciationRate: 3.5,
        lastInspection: new Date('2024-01-15'),
        nextInspection: new Date('2024-02-15'),
        inspectionFrequency: 30,
        maintenanceCost: 150000.00,
        tags: ['renewable', 'wind', 'energy', 'critical'],
        notes: 'Secondary wind energy generation asset'
      },
      {
        assetNumber: 'WT-003',
        name: 'Wind Turbine WT-003',
        description: '3.2MW Vestas V150 wind turbine - Tertiary energy generation',
        assetType: 'OTHER',
        status: 'ACTIVE',
        condition: 'GOOD',
        priority: 'HIGH',
        address: 'Greenfield Wind Farm - East Sector',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Vestas',
        model: 'V150',
        serialNumber: 'V150-003-GF',
        installationDate: new Date('2022-05-10'),
        warrantyExpiry: new Date('2032-05-10'),
        expectedLifespan: 25,
        purchasePrice: 4500000.00,
        currentValue: 4100000.00,
        replacementCost: 4800000.00,
        depreciationRate: 3.5,
        lastInspection: new Date('2024-01-20'),
        nextInspection: new Date('2024-02-20'),
        inspectionFrequency: 30,
        maintenanceCost: 160000.00,
        tags: ['renewable', 'wind', 'energy', 'critical'],
        notes: 'Tertiary wind energy generation asset'
      }
    ];

    // Solar Arrays
    const solarArrays = [
      {
        assetNumber: 'SA-001',
        name: 'Solar Array SA-001',
        description: '500kW rooftop solar installation - Council Administration Building',
        assetType: 'BUILDING',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'MEDIUM',
        address: 'Council Administration Building - Rooftop',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'SunPower',
        model: 'SPR-X21-345',
        serialNumber: 'SPR-001-GF',
        installationDate: new Date('2021-09-15'),
        warrantyExpiry: new Date('2031-09-15'),
        expectedLifespan: 25,
        purchasePrice: 750000.00,
        currentValue: 680000.00,
        replacementCost: 800000.00,
        depreciationRate: 4.0,
        lastInspection: new Date('2024-01-05'),
        nextInspection: new Date('2024-04-05'),
        inspectionFrequency: 90,
        maintenanceCost: 25000.00,
        tags: ['renewable', 'solar', 'energy', 'rooftop'],
        notes: 'Rooftop solar installation for council operations'
      },
      {
        assetNumber: 'SA-002',
        name: 'Solar Array SA-002',
        description: '1MW ground-mounted solar farm - Community Energy Hub',
        assetType: 'OTHER',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'Community Energy Hub - Solar Farm',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'First Solar',
        model: 'Series 6',
        serialNumber: 'FS-002-GF',
        installationDate: new Date('2023-02-28'),
        warrantyExpiry: new Date('2033-02-28'),
        expectedLifespan: 25,
        purchasePrice: 1200000.00,
        currentValue: 1150000.00,
        replacementCost: 1300000.00,
        depreciationRate: 4.0,
        lastInspection: new Date('2024-01-12'),
        nextInspection: new Date('2024-04-12'),
        inspectionFrequency: 90,
        maintenanceCost: 45000.00,
        tags: ['renewable', 'solar', 'energy', 'community'],
        notes: 'Community solar farm for renewable energy generation'
      }
    ];

    // Battery Storage Systems
    const batterySystems = [
      {
        assetNumber: 'GS-001',
        name: 'Grid-Scale Battery GS-001',
        description: '2MWh Tesla Megapack - Grid stabilization and peak shaving',
        assetType: 'ELECTRICAL_INFRASTRUCTURE',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'CRITICAL',
        address: 'Greenfield Energy Storage Facility',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Tesla',
        model: 'Megapack',
        serialNumber: 'MP-001-GF',
        installationDate: new Date('2023-06-15'),
        warrantyExpiry: new Date('2033-06-15'),
        expectedLifespan: 15,
        purchasePrice: 2500000.00,
        currentValue: 2400000.00,
        replacementCost: 2600000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-08'),
        nextInspection: new Date('2024-02-08'),
        inspectionFrequency: 30,
        maintenanceCost: 180000.00,
        tags: ['renewable', 'battery', 'storage', 'critical', 'grid'],
        notes: 'Grid-scale battery for energy storage and grid stabilization'
      },
      {
        assetNumber: 'CB-001',
        name: 'Community Battery CB-001',
        description: '500kWh community battery - Local energy sharing',
        assetType: 'ELECTRICAL_INFRASTRUCTURE',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'Greenfield Community Center',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Tesla',
        model: 'Powerpack',
        serialNumber: 'PP-001-GF',
        installationDate: new Date('2023-08-20'),
        warrantyExpiry: new Date('2033-08-20'),
        expectedLifespan: 15,
        purchasePrice: 650000.00,
        currentValue: 620000.00,
        replacementCost: 700000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-18'),
        nextInspection: new Date('2024-02-18'),
        inspectionFrequency: 30,
        maintenanceCost: 45000.00,
        tags: ['renewable', 'battery', 'storage', 'community'],
        notes: 'Community battery for local energy sharing and storage'
      },
      {
        assetNumber: 'MB-001',
        name: 'Mobile Battery MB-001',
        description: '200kWh mobile battery - Emergency response and events',
        assetType: 'OTHER',
        status: 'ACTIVE',
        condition: 'GOOD',
        priority: 'MEDIUM',
        address: 'Emergency Services Depot',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Tesla',
        model: 'Powerpack Mobile',
        serialNumber: 'PPM-001-GF',
        installationDate: new Date('2023-10-10'),
        warrantyExpiry: new Date('2033-10-10'),
        expectedLifespan: 15,
        purchasePrice: 280000.00,
        currentValue: 265000.00,
        replacementCost: 300000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-25'),
        nextInspection: new Date('2024-02-25'),
        inspectionFrequency: 30,
        maintenanceCost: 20000.00,
        tags: ['renewable', 'battery', 'mobile', 'emergency'],
        notes: 'Mobile battery for emergency response and events'
      }
    ];

    // Create all renewable energy assets
    const allAssets = [...windTurbines, ...solarArrays, ...batterySystems];

    for (const assetData of allAssets) {
      const asset = await prisma.asset.create({
        data: {
          assetNumber: assetData.assetNumber,
          name: assetData.name,
          description: assetData.description,
          assetType: assetData.assetType,
          status: assetData.status,
          condition: assetData.condition,
          priority: assetData.priority,
          organisationId: organisationId,
          address: assetData.address,
          suburb: assetData.suburb,
          postcode: assetData.postcode,
          manufacturer: assetData.manufacturer,
          model: assetData.model,
          serialNumber: assetData.serialNumber,
          installationDate: assetData.installationDate,
          warrantyExpiry: assetData.warrantyExpiry,
          expectedLifespan: assetData.expectedLifespan,
          purchasePrice: assetData.purchasePrice,
          currentValue: assetData.currentValue,
          replacementCost: assetData.replacementCost,
          depreciationRate: assetData.depreciationRate,
          lastInspection: assetData.lastInspection,
          nextInspection: assetData.nextInspection,
          inspectionFrequency: assetData.inspectionFrequency,
          maintenanceCost: assetData.maintenanceCost,
          tags: assetData.tags,
          notes: assetData.notes
        }
      });

      console.log(`✅ Created renewable energy asset: ${asset.name}`);
    }

    console.log('🎉 Renewable energy assets seeding completed successfully!');
    return allAssets.length;

  } catch (error) {
    console.error('❌ Error seeding renewable energy assets:', error);
    throw error;
  }
}

export async function cleanupRenewableEnergyAssets(organisationId: string) {
  console.log('🧹 Cleaning up renewable energy assets...');
  
  try {
    await prisma.asset.deleteMany({
      where: {
        organisationId: organisationId,
        assetNumber: {
          in: ['WT-001', 'WT-002', 'WT-003', 'SA-001', 'SA-002', 'GS-001', 'CB-001', 'MB-001']
        }
      }
    });

    console.log('✅ Renewable energy assets cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up renewable energy assets:', error);
    throw error;
  }
}