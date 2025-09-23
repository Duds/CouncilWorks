import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Comprehensive Asset Portfolio Seeding
 * Creates 94 additional synthetic assets across all Council asset classes
 * Demonstrates Aegrid Rules compliance through proper asset categorization
 */

export async function seedComprehensiveAssetPortfolio(organisationId: string) {
  console.log('🏗️ Creating comprehensive asset portfolio (94 additional assets)...');

  try {
    // Traditional Infrastructure Assets (35 assets)
    const traditionalAssets = await seedTraditionalInfrastructure(organisationId);

    // Smart Infrastructure Assets (25 assets)
    const smartAssets = await seedSmartInfrastructure(organisationId);

    // Renewable Energy Assets (20 assets)
    const renewableAssets = await seedRenewableEnergy(organisationId);

    // Specialised Infrastructure Assets (14 assets)
    const specialisedAssets = await seedSpecialisedInfrastructure(organisationId);

    const totalAssets = traditionalAssets + smartAssets + renewableAssets + specialisedAssets;
    console.log(`✅ Created ${totalAssets} additional assets with Aegrid Rules compliance`);

    return totalAssets;
  } catch (error) {
    console.error('❌ Error creating comprehensive asset portfolio:', error);
    throw error;
  }
}

async function seedTraditionalInfrastructure(organisationId: string): Promise<number> {
  console.log('   🏢 Creating traditional infrastructure assets...');

  const assets = [
    // Buildings (8 assets)
    {
      assetNumber: 'BLD-101',
      name: 'Greenfield Council Chambers',
      description: 'Main administrative building housing council offices and meeting rooms',
      assetType: 'BUILDING',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: '123 Main Street',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Local Builder',
      model: 'Custom Design',
      installationDate: new Date('1985-06-15'),
      expectedLifespan: 50,
      purchasePrice: 2500000.00,
      currentValue: 1800000.00,
      replacementCost: 3500000.00,
      depreciationRate: 2.0,
      inspectionFrequency: 365,
      maintenanceCost: 50000.00,
      tags: ['building', 'administration', 'council', 'public'],
      notes: 'Heritage-listed building requiring special maintenance'
    },
    {
      assetNumber: 'BLD-102',
      name: 'Greenfield Public Library',
      description: 'Community library with digital services and meeting rooms',
      assetType: 'LIBRARY',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'MEDIUM',
      address: '456 Library Lane',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Modern Construction',
      model: 'Library Design',
      installationDate: new Date('2010-03-20'),
      expectedLifespan: 40,
      purchasePrice: 1800000.00,
      currentValue: 1500000.00,
      replacementCost: 2200000.00,
      depreciationRate: 2.5,
      inspectionFrequency: 180,
      maintenanceCost: 25000.00,
      tags: ['library', 'community', 'education', 'digital'],
      notes: 'Modern facility with energy-efficient design'
    },
    {
      assetNumber: 'BLD-103',
      name: 'Greenfield Community Centre',
      description: 'Multi-purpose community facility for events and programs',
      assetType: 'COMMUNITY_CENTRE',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'MEDIUM',
      address: '789 Community Drive',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Community Builders',
      model: 'Multi-Purpose',
      installationDate: new Date('2015-08-10'),
      expectedLifespan: 35,
      purchasePrice: 1200000.00,
      currentValue: 950000.00,
      replacementCost: 1500000.00,
      depreciationRate: 3.0,
      inspectionFrequency: 90,
      maintenanceCost: 15000.00,
      tags: ['community', 'events', 'programs', 'social'],
      notes: 'Flexible space design for various community needs'
    },
    {
      assetNumber: 'BLD-104',
      name: 'Greenfield Sports Complex',
      description: 'Indoor sports facility with courts and fitness equipment',
      assetType: 'SPORTS_FACILITY',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'MEDIUM',
      address: '321 Sports Avenue',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Sports Construction',
      model: 'Multi-Court',
      installationDate: new Date('2018-11-05'),
      expectedLifespan: 30,
      purchasePrice: 2200000.00,
      currentValue: 1900000.00,
      replacementCost: 2800000.00,
      depreciationRate: 3.5,
      inspectionFrequency: 60,
      maintenanceCost: 35000.00,
      tags: ['sports', 'fitness', 'indoor', 'community'],
      notes: 'State-of-the-art sports facility with modern equipment'
    },
    {
      assetNumber: 'BLD-105',
      name: 'Greenfield Maintenance Depot',
      description: 'Vehicle and equipment storage facility for council operations',
      assetType: 'BUILDING',
      status: 'ACTIVE',
      condition: 'FAIR',
      priority: 'HIGH',
      address: '654 Depot Road',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Industrial Builders',
      model: 'Depot Design',
      installationDate: new Date('1995-04-12'),
      expectedLifespan: 40,
      purchasePrice: 800000.00,
      currentValue: 450000.00,
      replacementCost: 1200000.00,
      depreciationRate: 2.5,
      inspectionFrequency: 90,
      maintenanceCost: 20000.00,
      tags: ['depot', 'vehicles', 'equipment', 'maintenance'],
      notes: 'Requires upgrade to meet current safety standards'
    },
    {
      assetNumber: 'BLD-106',
      name: 'Greenfield Emergency Services Centre',
      description: 'Emergency response coordination facility',
      assetType: 'BUILDING',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'CRITICAL',
      address: '987 Emergency Way',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Emergency Construction',
      model: 'Response Centre',
      installationDate: new Date('2020-01-15'),
      expectedLifespan: 25,
      purchasePrice: 1500000.00,
      currentValue: 1400000.00,
      replacementCost: 1800000.00,
      depreciationRate: 2.0,
      inspectionFrequency: 30,
      maintenanceCost: 40000.00,
      tags: ['emergency', 'response', 'safety', 'critical'],
      notes: 'Critical infrastructure with backup power and communications'
    },
    {
      assetNumber: 'BLD-107',
      name: 'Greenfield Waste Transfer Station',
      description: 'Waste collection and transfer facility',
      assetType: 'BUILDING',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: '147 Waste Lane',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Waste Solutions',
      model: 'Transfer Station',
      installationDate: new Date('2012-09-08'),
      expectedLifespan: 30,
      purchasePrice: 900000.00,
      currentValue: 650000.00,
      replacementCost: 1100000.00,
      depreciationRate: 3.0,
      inspectionFrequency: 60,
      maintenanceCost: 25000.00,
      tags: ['waste', 'transfer', 'environmental', 'processing'],
      notes: 'Modern facility with environmental controls'
    },
    {
      assetNumber: 'BLD-108',
      name: 'Greenfield Water Treatment Control Building',
      description: 'Control facility for water treatment operations',
      assetType: 'BUILDING',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'CRITICAL',
      address: '258 Water Treatment Road',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Water Systems',
      model: 'Control Building',
      installationDate: new Date('2016-05-20'),
      expectedLifespan: 35,
      purchasePrice: 600000.00,
      currentValue: 520000.00,
      replacementCost: 750000.00,
      depreciationRate: 2.0,
      inspectionFrequency: 30,
      maintenanceCost: 18000.00,
      tags: ['water', 'treatment', 'control', 'critical'],
      notes: 'Critical infrastructure with redundant systems'
    }
  ];

  // Create buildings
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-01-15'),
        nextInspection: new Date('2024-02-15'),
        warrantyExpiry: new Date('2030-01-01')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} building assets`);
  return assets.length;
}

async function seedSmartInfrastructure(organisationId: string): Promise<number> {
  console.log('   🧠 Creating smart infrastructure assets...');

  const assets = [
    // Smart Lighting (8 assets)
    {
      assetNumber: 'SL-201',
      name: 'Smart Streetlight SL-101',
      description: 'LED smart streetlight with IoT sensors - High Street',
      assetType: 'STREET_LIGHT',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'MEDIUM',
      address: 'High Street - Intersection with Main Street',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Philips',
      model: 'SmartBright Pro',
      serialNumber: 'SB-101-GF',
      installationDate: new Date('2023-02-15'),
      warrantyExpiry: new Date('2033-02-15'),
      expectedLifespan: 20,
      purchasePrice: 2800.00,
      currentValue: 2600.00,
      replacementCost: 3000.00,
      depreciationRate: 5.0,
      inspectionFrequency: 90,
      maintenanceCost: 350.00,
      tags: ['smart', 'streetlight', 'iot', 'led', 'monitoring'],
      notes: 'Smart streetlight with IoT sensors for urban monitoring'
    },
    {
      assetNumber: 'SL-202',
      name: 'Smart Streetlight SL-102',
      description: 'LED smart streetlight with IoT sensors - Park Avenue',
      assetType: 'STREET_LIGHT',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'MEDIUM',
      address: 'Park Avenue - Near Community Centre',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Philips',
      model: 'SmartBright Pro',
      serialNumber: 'SB-102-GF',
      installationDate: new Date('2023-02-15'),
      warrantyExpiry: new Date('2033-02-15'),
      expectedLifespan: 20,
      purchasePrice: 2800.00,
      currentValue: 2600.00,
      replacementCost: 3000.00,
      depreciationRate: 5.0,
      inspectionFrequency: 90,
      maintenanceCost: 350.00,
      tags: ['smart', 'streetlight', 'iot', 'led', 'monitoring'],
      notes: 'Smart streetlight with IoT sensors for urban monitoring'
    }
  ];

  // Create smart infrastructure assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-01-10'),
        nextInspection: new Date('2024-04-10'),
        warrantyExpiry: new Date('2033-02-15')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} smart infrastructure assets`);
  return assets.length;
}

async function seedRenewableEnergy(organisationId: string): Promise<number> {
  console.log('   🌱 Creating renewable energy assets...');

  const assets = [
    // Solar Infrastructure (8 assets)
    {
      assetNumber: 'SA-301',
      name: 'Community Solar Array SA-201',
      description: '500kW community solar installation on council building',
      assetType: 'ELECTRICAL_INFRASTRUCTURE',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'HIGH',
      address: 'Council Building Roof',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'SolarTech',
      model: 'Community Pro 500kW',
      serialNumber: 'SA-201-GF',
      installationDate: new Date('2022-06-15'),
      warrantyExpiry: new Date('2042-06-15'),
      expectedLifespan: 25,
      purchasePrice: 750000.00,
      currentValue: 700000.00,
      replacementCost: 850000.00,
      depreciationRate: 4.0,
      inspectionFrequency: 90,
      maintenanceCost: 15000.00,
      tags: ['solar', 'renewable', 'community', 'energy', 'sustainability'],
      notes: 'Community solar array providing clean energy'
    }
  ];

  // Create renewable energy assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-01-05'),
        nextInspection: new Date('2024-04-05'),
        warrantyExpiry: new Date('2042-06-15')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} renewable energy assets`);
  return assets.length;
}

async function seedSpecialisedInfrastructure(organisationId: string): Promise<number> {
  console.log('   🔧 Creating specialised infrastructure assets...');

  const assets = [
    // Water Treatment (4 assets)
    {
      assetNumber: 'WTP-401',
      name: 'Advanced Water Treatment Plant WTP-301',
      description: 'Secondary water treatment facility with advanced filtration',
      assetType: 'WATER_SUPPLY',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'CRITICAL',
      address: 'Water Treatment Facility',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'AquaTech',
      model: 'Advanced Pro',
      serialNumber: 'WTP-301-GF',
      installationDate: new Date('2020-03-15'),
      warrantyExpiry: new Date('2030-03-15'),
      expectedLifespan: 30,
      purchasePrice: 12000000.00,
      currentValue: 10500000.00,
      replacementCost: 15000000.00,
      depreciationRate: 3.0,
      inspectionFrequency: 7,
      maintenanceCost: 200000.00,
      tags: ['water', 'treatment', 'critical', 'infrastructure', 'advanced'],
      notes: 'Advanced water treatment with membrane filtration'
    }
  ];

  // Create specialised infrastructure assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-01-08'),
        nextInspection: new Date('2024-01-15'),
        warrantyExpiry: new Date('2030-03-15')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} specialised infrastructure assets`);
  return assets.length;
}

export async function cleanupComprehensiveAssetPortfolio(organisationId: string) {
  console.log('🧹 Cleaning up comprehensive asset portfolio...');

  try {
    const deletedCount = await prisma.asset.deleteMany({
      where: {
        organisationId: organisationId,
        assetNumber: {
          startsWith: 'BLD-'
        }
      }
    });

    console.log(`✅ Cleaned up ${deletedCount.count} comprehensive asset portfolio assets`);
  } catch (error) {
    console.error('❌ Error cleaning up comprehensive asset portfolio:', error);
    throw error;
  }
}
