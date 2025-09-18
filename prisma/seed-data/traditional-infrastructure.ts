import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedTraditionalInfrastructureAssets(organisationId: string) {
  console.log('🏗️ Seeding traditional infrastructure assets...');

  try {
    // Water Infrastructure Assets
    const waterAssets = [
      {
        assetNumber: 'WTP-001',
        name: 'Water Treatment Plant WTP-001',
        description: 'Primary water treatment facility - 50ML/day capacity',
        assetType: 'WATER_SUPPLY',
        status: 'ACTIVE',
        condition: 'GOOD',
        priority: 'CRITICAL',
        address: 'Greenfield Water Treatment Facility',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Veolia',
        model: 'AquaTech Pro',
        serialNumber: 'ATP-001-GF',
        installationDate: new Date('2015-03-15'),
        warrantyExpiry: new Date('2035-03-15'),
        expectedLifespan: 30,
        purchasePrice: 15000000.00,
        currentValue: 12000000.00,
        replacementCost: 18000000.00,
        depreciationRate: 3.0,
        lastInspection: new Date('2024-01-05'),
        nextInspection: new Date('2024-01-12'),
        inspectionFrequency: 7,
        maintenanceCost: 150000.00,
        tags: ['water', 'treatment', 'critical', 'infrastructure'],
        notes: 'Primary water treatment facility - critical infrastructure'
      },
      {
        assetNumber: 'WST-001',
        name: 'Water Storage Tank WST-001',
        description: '10ML elevated water storage tank - Main distribution',
        assetType: 'WATER_SUPPLY',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'Main Street Water Tower',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Caldwell Tanks',
        model: 'Elevated Steel',
        serialNumber: 'EST-001-GF',
        installationDate: new Date('2018-06-20'),
        warrantyExpiry: new Date('2038-06-20'),
        expectedLifespan: 50,
        purchasePrice: 2500000.00,
        currentValue: 2200000.00,
        replacementCost: 2800000.00,
        depreciationRate: 2.0,
        lastInspection: new Date('2024-01-10'),
        nextInspection: new Date('2024-02-10'),
        inspectionFrequency: 30,
        maintenanceCost: 30000.00,
        tags: ['water', 'storage', 'tower', 'distribution'],
        notes: 'Elevated water storage tank for main distribution'
      },
      {
        assetNumber: 'WWTP-001',
        name: 'Wastewater Treatment Plant WWTP-001',
        description: 'Secondary wastewater treatment - 40ML/day capacity',
        assetType: 'SEWER',
        status: 'ACTIVE',
        condition: 'GOOD',
        priority: 'CRITICAL',
        address: 'Greenfield Wastewater Treatment Facility',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Suez',
        model: 'BioTech Advanced',
        serialNumber: 'BTA-001-GF',
        installationDate: new Date('2016-09-10'),
        warrantyExpiry: new Date('2036-09-10'),
        expectedLifespan: 30,
        purchasePrice: 12000000.00,
        currentValue: 9500000.00,
        replacementCost: 14000000.00,
        depreciationRate: 3.0,
        lastInspection: new Date('2024-01-08'),
        nextInspection: new Date('2024-01-15'),
        inspectionFrequency: 7,
        maintenanceCost: 120000.00,
        tags: ['wastewater', 'treatment', 'critical', 'environmental'],
        notes: 'Secondary wastewater treatment facility'
      }
    ];

    // Transportation Assets
    const transportAssets = [
      {
        assetNumber: 'MSB-001',
        name: 'Main Street Bridge MSB-001',
        description: 'Concrete bridge over Greenfield Creek - 50m span',
        assetType: 'BRIDGE',
        status: 'ACTIVE',
        condition: 'GOOD',
        priority: 'HIGH',
        address: 'Main Street Bridge over Greenfield Creek',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Bridgestone Construction',
        model: 'Concrete Arch',
        serialNumber: 'CA-001-GF',
        installationDate: new Date('2010-05-15'),
        warrantyExpiry: new Date('2040-05-15'),
        expectedLifespan: 50,
        purchasePrice: 5000000.00,
        currentValue: 4200000.00,
        replacementCost: 6000000.00,
        depreciationRate: 2.0,
        lastInspection: new Date('2024-01-12'),
        nextInspection: new Date('2024-02-12'),
        inspectionFrequency: 30,
        maintenanceCost: 42000.00,
        tags: ['bridge', 'concrete', 'transportation', 'critical'],
        notes: 'Concrete bridge over Greenfield Creek - critical transportation link'
      },
      {
        assetNumber: 'IRS-001',
        name: 'Industrial Road Segment IRS-001',
        description: '4-lane arterial road - 2km section',
        assetType: 'ROAD',
        status: 'ACTIVE',
        condition: 'FAIR',
        priority: 'MEDIUM',
        address: 'Industrial Road - Wind Farm Access Section',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'RoadCorp',
        model: 'Heavy Duty Asphalt',
        serialNumber: 'HDA-001-GF',
        installationDate: new Date('2012-08-20'),
        warrantyExpiry: new Date('2032-08-20'),
        expectedLifespan: 20,
        purchasePrice: 2500000.00,
        currentValue: 1800000.00,
        replacementCost: 3000000.00,
        depreciationRate: 5.0,
        lastInspection: new Date('2024-01-15'),
        nextInspection: new Date('2024-02-15'),
        inspectionFrequency: 30,
        maintenanceCost: 54000.00,
        tags: ['road', 'asphalt', 'industrial', 'heavy-duty'],
        notes: 'Heavy duty asphalt road for industrial access'
      }
    ];

    // Waste Management Assets
    const wasteAssets = [
      {
        assetNumber: 'WTS-001',
        name: 'Waste Transfer Station WTS-001',
        description: 'Municipal waste transfer and sorting facility',
        assetType: 'OTHER',
        status: 'ACTIVE',
        condition: 'GOOD',
        priority: 'MEDIUM',
        address: 'Greenfield Waste Management Facility',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'WasteTech Solutions',
        model: 'Transfer Pro',
        serialNumber: 'TP-001-GF',
        installationDate: new Date('2017-04-15'),
        warrantyExpiry: new Date('2037-04-15'),
        expectedLifespan: 25,
        purchasePrice: 8000000.00,
        currentValue: 6500000.00,
        replacementCost: 9000000.00,
        depreciationRate: 4.0,
        lastInspection: new Date('2024-01-20'),
        nextInspection: new Date('2024-02-20'),
        inspectionFrequency: 30,
        maintenanceCost: 81600.00,
        tags: ['waste', 'transfer', 'sorting', 'environmental'],
        notes: 'Municipal waste transfer and sorting facility'
      },
      {
        assetNumber: 'RF-001',
        name: 'Recycling Facility RF-001',
        description: 'Materials recovery facility - Paper, plastic, metal',
        assetType: 'OTHER',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'MEDIUM',
        address: 'Greenfield Recycling Center',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'RecycleTech',
        model: 'MRF Advanced',
        serialNumber: 'MRFA-001-GF',
        installationDate: new Date('2019-07-20'),
        warrantyExpiry: new Date('2039-07-20'),
        expectedLifespan: 25,
        purchasePrice: 6000000.00,
        currentValue: 5200000.00,
        replacementCost: 6800000.00,
        depreciationRate: 4.0,
        lastInspection: new Date('2024-01-22'),
        nextInspection: new Date('2024-02-22'),
        inspectionFrequency: 30,
        maintenanceCost: 62400.00,
        tags: ['recycling', 'mrf', 'materials', 'recovery'],
        notes: 'Materials recovery facility for recycling'
      }
    ];

    // Create all traditional infrastructure assets
    const allAssets = [
      ...waterAssets,
      ...transportAssets,
      ...wasteAssets
    ];

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

      console.log(`✅ Created traditional infrastructure asset: ${asset.name}`);
    }

    console.log('🎉 Traditional infrastructure assets seeding completed successfully!');
    return allAssets.length;

  } catch (error) {
    console.error('❌ Error seeding traditional infrastructure assets:', error);
    throw error;
  }
}

export async function cleanupTraditionalInfrastructureAssets(organisationId: string) {
  console.log('🧹 Cleaning up traditional infrastructure assets...');
  
  try {
    await prisma.asset.deleteMany({
      where: {
        organisationId: organisationId,
        assetNumber: {
          in: ['WTP-001', 'WST-001', 'WWTP-001', 'MSB-001', 'IRS-001', 'WTS-001', 'RF-001']
        }
      }
    });

    console.log('✅ Traditional infrastructure assets cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up traditional infrastructure assets:', error);
    throw error;
  }
}