import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSmartInfrastructureAssets(organisationId: string) {
  console.log('🤖 Seeding smart infrastructure assets...');

  try {
    // Smart Streetlights
    const smartStreetlights = [
      {
        assetNumber: 'SL-001',
        name: 'Smart Streetlight SL-001',
        description: 'LED smart streetlight with IoT sensors - Main Street',
        assetType: 'STREET_LIGHT',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'MEDIUM',
        address: 'Main Street - Intersection with High Street',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Philips',
        model: 'SmartBright Pro',
        serialNumber: 'SB-001-GF',
        installationDate: new Date('2022-01-15'),
        warrantyExpiry: new Date('2032-01-15'),
        expectedLifespan: 20,
        purchasePrice: 2500.00,
        currentValue: 2200.00,
        replacementCost: 2800.00,
        depreciationRate: 5.0,
        lastInspection: new Date('2024-01-10'),
        nextInspection: new Date('2024-04-10'),
        inspectionFrequency: 90,
        maintenanceCost: 300.00,
        tags: ['smart', 'streetlight', 'iot', 'led'],
        notes: 'Smart streetlight with IoT sensors for urban monitoring'
      },
      {
        assetNumber: 'SL-002',
        name: 'Smart Streetlight SL-002',
        description: 'LED smart streetlight with air quality monitoring - Park Avenue',
        assetType: 'STREET_LIGHT',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'MEDIUM',
        address: 'Park Avenue - Near Community Center',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Philips',
        model: 'SmartBright Pro',
        serialNumber: 'SB-002-GF',
        installationDate: new Date('2022-02-20'),
        warrantyExpiry: new Date('2032-02-20'),
        expectedLifespan: 20,
        purchasePrice: 2500.00,
        currentValue: 2200.00,
        replacementCost: 2800.00,
        depreciationRate: 5.0,
        lastInspection: new Date('2024-01-15'),
        nextInspection: new Date('2024-04-15'),
        inspectionFrequency: 90,
        maintenanceCost: 300.00,
        tags: ['smart', 'streetlight', 'iot', 'air-quality'],
        notes: 'Smart streetlight with air quality monitoring capabilities'
      },
      {
        assetNumber: 'SL-003',
        name: 'Smart Streetlight SL-003',
        description: 'LED smart streetlight with traffic monitoring - Industrial Road',
        assetType: 'STREET_LIGHT',
        status: 'ACTIVE',
        condition: 'GOOD',
        priority: 'MEDIUM',
        address: 'Industrial Road - Near Wind Farm Access',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Philips',
        model: 'SmartBright Pro',
        serialNumber: 'SB-003-GF',
        installationDate: new Date('2022-03-10'),
        warrantyExpiry: new Date('2032-03-10'),
        expectedLifespan: 20,
        purchasePrice: 2500.00,
        currentValue: 2100.00,
        replacementCost: 2800.00,
        depreciationRate: 5.0,
        lastInspection: new Date('2024-01-20'),
        nextInspection: new Date('2024-04-20'),
        inspectionFrequency: 90,
        maintenanceCost: 320.00,
        tags: ['smart', 'streetlight', 'iot', 'traffic'],
        notes: 'Smart streetlight with traffic monitoring capabilities'
      }
    ];

    // Smart Traffic Lights
    const smartTrafficLights = [
      {
        assetNumber: 'TL-001',
        name: 'Smart Traffic Light TL-001',
        description: 'AI-powered traffic light with adaptive timing - Main Street Intersection',
        assetType: 'TRAFFIC_LIGHT',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'Main Street & High Street Intersection',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Siemens',
        model: 'Sitraffic Adaptive',
        serialNumber: 'STL-001-GF',
        installationDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2033-01-15'),
        expectedLifespan: 15,
        purchasePrice: 45000.00,
        currentValue: 42000.00,
        replacementCost: 48000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-08'),
        nextInspection: new Date('2024-02-08'),
        inspectionFrequency: 30,
        maintenanceCost: 550.00,
        tags: ['smart', 'traffic', 'ai', 'adaptive'],
        notes: 'AI-powered traffic light with adaptive timing system'
      },
      {
        assetNumber: 'TL-002',
        name: 'Smart Traffic Light TL-002',
        description: 'AI-powered traffic light with pedestrian detection - School Zone',
        assetType: 'TRAFFIC_LIGHT',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'School Road & Park Avenue Intersection',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Siemens',
        model: 'Sitraffic Adaptive',
        serialNumber: 'STL-002-GF',
        installationDate: new Date('2023-02-28'),
        warrantyExpiry: new Date('2033-02-28'),
        expectedLifespan: 15,
        purchasePrice: 45000.00,
        currentValue: 42000.00,
        replacementCost: 48000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-12'),
        nextInspection: new Date('2024-02-12'),
        inspectionFrequency: 30,
        maintenanceCost: 550.00,
        tags: ['smart', 'traffic', 'ai', 'pedestrian'],
        notes: 'AI-powered traffic light with pedestrian detection'
      }
    ];

    // EV Charging Stations
    const evChargingStations = [
      {
        assetNumber: 'EV-001',
        name: 'EV Charging Station EV-001',
        description: '50kW DC fast charger - Council Administration Building',
        assetType: 'ELECTRICAL_INFRASTRUCTURE',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'MEDIUM',
        address: 'Council Administration Building - Visitor Parking',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'ABB',
        model: 'Terra 54',
        serialNumber: 'T54-001-GF',
        installationDate: new Date('2023-03-15'),
        warrantyExpiry: new Date('2033-03-15'),
        expectedLifespan: 15,
        purchasePrice: 85000.00,
        currentValue: 78000.00,
        replacementCost: 90000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-05'),
        nextInspection: new Date('2024-02-05'),
        inspectionFrequency: 30,
        maintenanceCost: 1020.00,
        tags: ['ev', 'charging', 'dc', 'fast-charger'],
        notes: '50kW DC fast charger for electric vehicles'
      },
      {
        assetNumber: 'EV-002',
        name: 'EV Charging Station EV-002',
        description: '22kW AC charger - Community Center',
        assetType: 'ELECTRICAL_INFRASTRUCTURE',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'MEDIUM',
        address: 'Community Center - Public Parking',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'ABB',
        model: 'Terra AC',
        serialNumber: 'TAC-002-GF',
        installationDate: new Date('2023-05-20'),
        warrantyExpiry: new Date('2033-05-20'),
        expectedLifespan: 15,
        purchasePrice: 35000.00,
        currentValue: 32000.00,
        replacementCost: 38000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-14'),
        nextInspection: new Date('2024-02-14'),
        inspectionFrequency: 30,
        maintenanceCost: 780.00,
        tags: ['ev', 'charging', 'ac', 'community'],
        notes: '22kW AC charger for community electric vehicles'
      },
      {
        assetNumber: 'EH-001',
        name: 'EV Charging Hub EH-001',
        description: 'Multi-port charging hub with solar integration - Energy Hub',
        assetType: 'ELECTRICAL_INFRASTRUCTURE',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        priority: 'HIGH',
        address: 'Community Energy Hub - Charging Plaza',
        suburb: 'Greenfield',
        postcode: '2000',
        manufacturer: 'Tesla',
        model: 'Supercharger V4',
        serialNumber: 'SCV4-001-GF',
        installationDate: new Date('2023-07-10'),
        warrantyExpiry: new Date('2033-07-10'),
        expectedLifespan: 15,
        purchasePrice: 150000.00,
        currentValue: 140000.00,
        replacementCost: 160000.00,
        depreciationRate: 6.0,
        lastInspection: new Date('2024-01-16'),
        nextInspection: new Date('2024-02-16'),
        inspectionFrequency: 30,
        maintenanceCost: 1500.00,
        tags: ['ev', 'charging', 'hub', 'solar-integrated'],
        notes: 'Multi-port charging hub with solar integration'
      }
    ];

    // Create all smart infrastructure assets
    const allAssets = [
      ...smartStreetlights,
      ...smartTrafficLights,
      ...evChargingStations
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

      console.log(`✅ Created smart infrastructure asset: ${asset.name}`);
    }

    console.log('🎉 Smart infrastructure assets seeding completed successfully!');
    return allAssets.length;

  } catch (error) {
    console.error('❌ Error seeding smart infrastructure assets:', error);
    throw error;
  }
}

export async function cleanupSmartInfrastructureAssets(organisationId: string) {
  console.log('🧹 Cleaning up smart infrastructure assets...');
  
  try {
    await prisma.asset.deleteMany({
      where: {
        organisationId: organisationId,
        assetNumber: {
          in: ['SL-001', 'SL-002', 'SL-003', 'TL-001', 'TL-002', 'EV-001', 'EV-002', 'EH-001']
        }
      }
    });

    console.log('✅ Smart infrastructure assets cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning up smart infrastructure assets:', error);
    throw error;
  }
}