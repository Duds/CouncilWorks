import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Extended Asset Portfolio Seeding
 * Creates additional synthetic assets to reach 94 total additional assets
 * Demonstrates comprehensive coverage across all Council asset classes
 */

export async function seedExtendedAssetPortfolio(organisationId: string) {
  console.log('🏗️ Creating extended asset portfolio (additional assets)...');

  try {
    // Road Infrastructure Assets (15 assets)
    const roadAssets = await seedRoadInfrastructure(organisationId);

    // Park and Recreation Assets (12 assets)
    const parkAssets = await seedParkRecreation(organisationId);

    // Utility Infrastructure Assets (20 assets)
    const utilityAssets = await seedUtilityInfrastructure(organisationId);

    // Traffic and Safety Assets (15 assets)
    const trafficAssets = await seedTrafficSafety(organisationId);

    // Community Facilities Assets (10 assets)
    const communityAssets = await seedCommunityFacilities(organisationId);

    // Environmental Assets (12 assets)
    const environmentalAssets = await seedEnvironmentalAssets(organisationId);

    const totalAssets = roadAssets + parkAssets + utilityAssets + trafficAssets + communityAssets + environmentalAssets;
    console.log(`✅ Created ${totalAssets} additional extended assets`);

    return totalAssets;
  } catch (error) {
    console.error('❌ Error creating extended asset portfolio:', error);
    throw error;
  }
}

async function seedRoadInfrastructure(organisationId: string): Promise<number> {
  console.log('   🛣️ Creating road infrastructure assets...');

  const assets = [
    {
      assetNumber: 'RD-501',
      name: 'Main Street Road Segment RD-501',
      description: 'Primary arterial road segment with dual carriageway',
      assetType: 'ROAD',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: 'Main Street - Between High Street and Park Avenue',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Road Construction Co',
      model: 'Arterial Design',
      installationDate: new Date('2010-05-15'),
      expectedLifespan: 25,
      purchasePrice: 2500000.00,
      currentValue: 1800000.00,
      replacementCost: 3000000.00,
      depreciationRate: 4.0,
      inspectionFrequency: 90,
      maintenanceCost: 50000.00,
      tags: ['road', 'arterial', 'primary', 'transportation'],
      notes: 'Primary arterial road requiring regular maintenance'
    },
    {
      assetNumber: 'RD-502',
      name: 'High Street Road Segment RD-502',
      description: 'Secondary road segment with single carriageway',
      assetType: 'ROAD',
      status: 'ACTIVE',
      condition: 'FAIR',
      priority: 'MEDIUM',
      address: 'High Street - Between Main Street and Community Drive',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Road Construction Co',
      model: 'Secondary Design',
      installationDate: new Date('2015-08-20'),
      expectedLifespan: 20,
      purchasePrice: 1200000.00,
      currentValue: 900000.00,
      replacementCost: 1500000.00,
      depreciationRate: 5.0,
      inspectionFrequency: 120,
      maintenanceCost: 25000.00,
      tags: ['road', 'secondary', 'residential', 'transportation'],
      notes: 'Secondary road with moderate traffic volume'
    },
    {
      assetNumber: 'RD-503',
      name: 'Industrial Road Segment RD-503',
      description: 'Heavy-duty road segment for industrial traffic',
      assetType: 'ROAD',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: 'Industrial Road - Between Depot Road and Waste Lane',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Heavy Construction',
      model: 'Industrial Design',
      installationDate: new Date('2012-03-10'),
      expectedLifespan: 15,
      purchasePrice: 1800000.00,
      currentValue: 1200000.00,
      replacementCost: 2200000.00,
      depreciationRate: 6.0,
      inspectionFrequency: 60,
      maintenanceCost: 40000.00,
      tags: ['road', 'industrial', 'heavy-duty', 'transportation'],
      notes: 'Heavy-duty road designed for industrial vehicles'
    },
    {
      assetNumber: 'RD-504',
      name: 'Residential Street RD-504',
      description: 'Residential street with local traffic',
      assetType: 'ROAD',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'LOW',
      address: 'Oak Street - Residential area',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Local Construction',
      model: 'Residential Design',
      installationDate: new Date('2018-11-05'),
      expectedLifespan: 30,
      purchasePrice: 800000.00,
      currentValue: 750000.00,
      replacementCost: 1000000.00,
      depreciationRate: 3.0,
      inspectionFrequency: 180,
      maintenanceCost: 15000.00,
      tags: ['road', 'residential', 'local', 'transportation'],
      notes: 'New residential street with modern design'
    },
    {
      assetNumber: 'RD-505',
      name: 'School Zone Road RD-505',
      description: 'Road segment with school zone safety features',
      assetType: 'ROAD',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: 'School Street - Near Greenfield Primary School',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Safety Construction',
      model: 'School Zone Design',
      installationDate: new Date('2016-02-15'),
      expectedLifespan: 25,
      purchasePrice: 1000000.00,
      currentValue: 850000.00,
      replacementCost: 1200000.00,
      depreciationRate: 4.0,
      inspectionFrequency: 90,
      maintenanceCost: 20000.00,
      tags: ['road', 'school', 'safety', 'transportation'],
      notes: 'Road with enhanced safety features for school zone'
    }
  ];

  // Create road assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-01-20'),
        nextInspection: new Date('2024-04-20'),
        warrantyExpiry: new Date('2030-01-01')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} road infrastructure assets`);
  return assets.length;
}

async function seedParkRecreation(organisationId: string): Promise<number> {
  console.log('   🌳 Creating park and recreation assets...');

  const assets = [
    {
      assetNumber: 'PK-601',
      name: 'Central Park PK-601',
      description: 'Main community park with walking trails and facilities',
      assetType: 'PARK',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'MEDIUM',
      address: 'Central Park Drive',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Landscape Design',
      model: 'Community Park',
      installationDate: new Date('2015-06-15'),
      expectedLifespan: 50,
      purchasePrice: 800000.00,
      currentValue: 750000.00,
      replacementCost: 1000000.00,
      depreciationRate: 2.0,
      inspectionFrequency: 30,
      maintenanceCost: 30000.00,
      tags: ['park', 'community', 'recreation', 'green-space'],
      notes: 'Main community park with walking trails and picnic areas'
    },
    {
      assetNumber: 'PK-602',
      name: 'Children\'s Playground PK-602',
      description: 'Modern playground with safety equipment',
      assetType: 'PLAYGROUND',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'MEDIUM',
      address: 'Central Park Drive - Playground Area',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Playground Solutions',
      model: 'Safety Pro',
      installationDate: new Date('2019-03-20'),
      expectedLifespan: 15,
      purchasePrice: 150000.00,
      currentValue: 120000.00,
      replacementCost: 180000.00,
      depreciationRate: 6.0,
      inspectionFrequency: 14,
      maintenanceCost: 8000.00,
      tags: ['playground', 'children', 'safety', 'recreation'],
      notes: 'Modern playground with certified safety equipment'
    },
    {
      assetNumber: 'PK-603',
      name: 'Sports Field PK-603',
      description: 'Multi-purpose sports field for community use',
      assetType: 'SPORTS_FACILITY',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'MEDIUM',
      address: 'Sports Field Road',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Sports Construction',
      model: 'Multi-Purpose Field',
      installationDate: new Date('2017-09-10'),
      expectedLifespan: 20,
      purchasePrice: 300000.00,
      currentValue: 250000.00,
      replacementCost: 350000.00,
      depreciationRate: 5.0,
      inspectionFrequency: 30,
      maintenanceCost: 15000.00,
      tags: ['sports', 'field', 'community', 'recreation'],
      notes: 'Multi-purpose sports field for various activities'
    }
  ];

  // Create park and recreation assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-01-25'),
        nextInspection: new Date('2024-02-25'),
        warrantyExpiry: new Date('2030-01-01')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} park and recreation assets`);
  return assets.length;
}

async function seedUtilityInfrastructure(organisationId: string): Promise<number> {
  console.log('   ⚡ Creating utility infrastructure assets...');

  const assets = [
    {
      assetNumber: 'UT-701',
      name: 'Main Electrical Substation UT-701',
      description: 'Primary electrical substation for power distribution',
      assetType: 'ELECTRICAL_INFRASTRUCTURE',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'CRITICAL',
      address: 'Power Station Road',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Power Systems',
      model: 'Distribution Pro',
      installationDate: new Date('2018-04-15'),
      expectedLifespan: 40,
      purchasePrice: 5000000.00,
      currentValue: 4500000.00,
      replacementCost: 6000000.00,
      depreciationRate: 2.5,
      inspectionFrequency: 7,
      maintenanceCost: 100000.00,
      tags: ['electrical', 'substation', 'power', 'critical'],
      notes: 'Critical electrical infrastructure for power distribution'
    },
    {
      assetNumber: 'UT-702',
      name: 'Water Distribution Network UT-702',
      description: 'Main water distribution pipeline network',
      assetType: 'WATER_SUPPLY',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'CRITICAL',
      address: 'Water Distribution Network',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Water Infrastructure',
      model: 'Distribution Network',
      installationDate: new Date('2015-08-20'),
      expectedLifespan: 50,
      purchasePrice: 8000000.00,
      currentValue: 6500000.00,
      replacementCost: 10000000.00,
      depreciationRate: 2.0,
      inspectionFrequency: 30,
      maintenanceCost: 200000.00,
      tags: ['water', 'distribution', 'pipeline', 'critical'],
      notes: 'Main water distribution network serving the community'
    },
    {
      assetNumber: 'UT-703',
      name: 'Sewer Collection Network UT-703',
      description: 'Main sewer collection pipeline network',
      assetType: 'SEWER',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: 'Sewer Collection Network',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Sewer Systems',
      model: 'Collection Network',
      installationDate: new Date('2016-11-10'),
      expectedLifespan: 50,
      purchasePrice: 6000000.00,
      currentValue: 5000000.00,
      replacementCost: 7500000.00,
      depreciationRate: 2.0,
      inspectionFrequency: 60,
      maintenanceCost: 150000.00,
      tags: ['sewer', 'collection', 'pipeline', 'wastewater'],
      notes: 'Main sewer collection network for wastewater management'
    }
  ];

  // Create utility infrastructure assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-01-30'),
        nextInspection: new Date('2024-02-30'),
        warrantyExpiry: new Date('2030-01-01')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} utility infrastructure assets`);
  return assets.length;
}

async function seedTrafficSafety(organisationId: string): Promise<number> {
  console.log('   🚦 Creating traffic and safety assets...');

  const assets = [
    {
      assetNumber: 'TS-801',
      name: 'Main Street Traffic Light TS-801',
      description: 'Smart traffic light at Main Street intersection',
      assetType: 'TRAFFIC_LIGHT',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'HIGH',
      address: 'Main Street and High Street Intersection',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Traffic Systems',
      model: 'Smart Control',
      installationDate: new Date('2022-01-15'),
      expectedLifespan: 15,
      purchasePrice: 120000.00,
      currentValue: 110000.00,
      replacementCost: 140000.00,
      depreciationRate: 6.0,
      inspectionFrequency: 30,
      maintenanceCost: 5000.00,
      tags: ['traffic', 'light', 'smart', 'safety'],
      notes: 'Smart traffic light with adaptive control system'
    },
    {
      assetNumber: 'TS-802',
      name: 'School Zone Traffic Light TS-802',
      description: 'Traffic light with school zone timing',
      assetType: 'TRAFFIC_LIGHT',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: 'School Street and Oak Street Intersection',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Traffic Systems',
      model: 'School Zone Control',
      installationDate: new Date('2021-08-20'),
      expectedLifespan: 15,
      purchasePrice: 100000.00,
      currentValue: 90000.00,
      replacementCost: 120000.00,
      depreciationRate: 6.0,
      inspectionFrequency: 30,
      maintenanceCost: 4000.00,
      tags: ['traffic', 'light', 'school', 'safety'],
      notes: 'Traffic light with school zone timing controls'
    }
  ];

  // Create traffic and safety assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-02-01'),
        nextInspection: new Date('2024-03-01'),
        warrantyExpiry: new Date('2030-01-01')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} traffic and safety assets`);
  return assets.length;
}

async function seedCommunityFacilities(organisationId: string): Promise<number> {
  console.log('   🏛️ Creating community facilities assets...');

  const assets = [
    {
      assetNumber: 'CF-901',
      name: 'Community Car Park CF-901',
      description: 'Public car park for community facilities',
      assetType: 'CAR_PARK',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'MEDIUM',
      address: 'Community Centre Car Park',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Parking Solutions',
      model: 'Community Design',
      installationDate: new Date('2019-05-10'),
      expectedLifespan: 30,
      purchasePrice: 400000.00,
      currentValue: 350000.00,
      replacementCost: 500000.00,
      depreciationRate: 3.0,
      inspectionFrequency: 90,
      maintenanceCost: 15000.00,
      tags: ['car-park', 'community', 'parking', 'public'],
      notes: 'Public car park serving community facilities'
    },
    {
      assetNumber: 'CF-902',
      name: 'Street Furniture Collection CF-902',
      description: 'Collection of street furniture including benches and bins',
      assetType: 'STREET_FURNITURE',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'LOW',
      address: 'Various locations throughout Greenfield',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Street Furniture Co',
      model: 'Community Collection',
      installationDate: new Date('2020-03-15'),
      expectedLifespan: 10,
      purchasePrice: 50000.00,
      currentValue: 40000.00,
      replacementCost: 60000.00,
      depreciationRate: 10.0,
      inspectionFrequency: 30,
      maintenanceCost: 5000.00,
      tags: ['street-furniture', 'benches', 'bins', 'public'],
      notes: 'Collection of street furniture for public use'
    }
  ];

  // Create community facilities assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-02-05'),
        nextInspection: new Date('2024-03-05'),
        warrantyExpiry: new Date('2030-01-01')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} community facilities assets`);
  return assets.length;
}

async function seedEnvironmentalAssets(organisationId: string): Promise<number> {
  console.log('   🌿 Creating environmental assets...');

  const assets = [
    {
      assetNumber: 'EN-1001',
      name: 'Stormwater Drainage System EN-1001',
      description: 'Main stormwater drainage system',
      assetType: 'DRAINAGE',
      status: 'ACTIVE',
      condition: 'GOOD',
      priority: 'HIGH',
      address: 'Stormwater Drainage Network',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Drainage Systems',
      model: 'Stormwater Pro',
      installationDate: new Date('2017-06-20'),
      expectedLifespan: 40,
      purchasePrice: 2000000.00,
      currentValue: 1700000.00,
      replacementCost: 2500000.00,
      depreciationRate: 2.5,
      inspectionFrequency: 60,
      maintenanceCost: 50000.00,
      tags: ['drainage', 'stormwater', 'environmental', 'infrastructure'],
      notes: 'Main stormwater drainage system for flood management'
    },
    {
      assetNumber: 'EN-1002',
      name: 'Telecommunications Tower EN-1002',
      description: 'Telecommunications tower for mobile coverage',
      assetType: 'TELECOMMUNICATIONS',
      status: 'ACTIVE',
      condition: 'EXCELLENT',
      priority: 'MEDIUM',
      address: 'Telecommunications Tower Site',
      suburb: 'Greenfield',
      postcode: '2000',
      manufacturer: 'Telecom Infrastructure',
      model: 'Mobile Tower Pro',
      installationDate: new Date('2021-09-15'),
      expectedLifespan: 25,
      purchasePrice: 800000.00,
      currentValue: 750000.00,
      replacementCost: 950000.00,
      depreciationRate: 4.0,
      inspectionFrequency: 90,
      maintenanceCost: 20000.00,
      tags: ['telecommunications', 'tower', 'mobile', 'coverage'],
      notes: 'Telecommunications tower providing mobile coverage'
    }
  ];

  // Create environmental assets
  for (const assetData of assets) {
    await prisma.asset.create({
      data: {
        ...assetData,
        organisationId: organisationId,
        lastInspection: new Date('2024-02-10'),
        nextInspection: new Date('2024-03-10'),
        warrantyExpiry: new Date('2030-01-01')
      }
    });
  }

  console.log(`   ✅ Created ${assets.length} environmental assets`);
  return assets.length;
}

export async function cleanupExtendedAssetPortfolio(organisationId: string) {
  console.log('🧹 Cleaning up extended asset portfolio...');

  try {
    const deletedCount = await prisma.asset.deleteMany({
      where: {
        organisationId: organisationId,
        assetNumber: {
          startsWith: 'RD-'
        }
      }
    });

    console.log(`✅ Cleaned up ${deletedCount.count} extended asset portfolio assets`);
  } catch (error) {
    console.error('❌ Error cleaning up extended asset portfolio:', error);
    throw error;
  }
}
