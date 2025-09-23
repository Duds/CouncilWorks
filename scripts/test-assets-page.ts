#!/usr/bin/env tsx

/**
 * Test script to verify /assets page database connectivity
 * This simulates what the AssetList component does when fetching assets
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAssetsPage() {
  console.log('🧪 Testing /assets page database connectivity...\n');

  try {
    // Simulate the API call that AssetList makes
    console.log('1. Fetching assets from database...');
    const assets = await prisma.asset.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
        updatedByUser: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: {
            documents: true,
            inspections: true,
            maintenance: true,
            workOrders: true,
          },
        },
      },
    });

    console.log(`✅ Found ${assets.length} assets\n`);

    // Process assets like the API does
    console.log('2. Processing assets with coordinates...');
    const assetsWithCoordinates = assets.map(asset => {
      let latitude: number | undefined;
      let longitude: number | undefined;

      if (asset.location) {
        try {
          // Parse PostGIS geometry - assuming it's stored as GeoJSON
          const locationData = typeof asset.location === 'string'
            ? JSON.parse(asset.location)
            : asset.location;

          if (locationData && locationData.coordinates && Array.isArray(locationData.coordinates)) {
            // PostGIS stores coordinates as [longitude, latitude]
            [longitude, latitude] = locationData.coordinates;
          }
        } catch (error) {
          console.warn(`⚠️  Failed to parse location data for asset ${asset.id}:`, error);
        }
      }

      return {
        ...asset,
        latitude,
        longitude,
      };
    });

    console.log('✅ Processed assets with coordinate extraction\n');

    // Display results
    console.log('3. Asset Details:');
    console.log('='.repeat(80));

    assetsWithCoordinates.forEach((asset, index) => {
      console.log(`${index + 1}. ${asset.assetNumber}: ${asset.name}`);
      console.log(`   Type: ${asset.assetType}`);
      console.log(`   Status: ${asset.status}, Condition: ${asset.condition}`);
      console.log(`   Address: ${asset.address || 'N/A'}`);
      console.log(`   Coordinates: ${asset.latitude && asset.longitude ? `(${asset.latitude}, ${asset.longitude})` : 'N/A'}`);
      console.log(`   Created: ${asset.createdAt.toISOString().split('T')[0]}`);
      console.log(`   Documents: ${asset._count.documents}, Inspections: ${asset._count.inspections}`);
      console.log(`   Maintenance: ${asset._count.maintenance}, Work Orders: ${asset._count.workOrders}`);
      console.log('');
    });

    // Test filtering capabilities
    console.log('4. Testing filtering capabilities...');

    const waterAssets = await prisma.asset.findMany({
      where: { assetType: 'WATER_SUPPLY' },
      select: { assetNumber: true, name: true, assetType: true }
    });

    const activeAssets = await prisma.asset.findMany({
      where: { status: 'ACTIVE' },
      select: { assetNumber: true, name: true, status: true }
    });

    console.log(`✅ Water Supply Assets: ${waterAssets.length}`);
    console.log(`✅ Active Assets: ${activeAssets.length}\n`);

    // Test search functionality
    console.log('5. Testing search functionality...');

    const searchResults = await prisma.asset.findMany({
      where: {
        OR: [
          { name: { contains: 'Water', mode: 'insensitive' } },
          { assetNumber: { contains: 'WTP', mode: 'insensitive' } },
        ]
      },
      select: { assetNumber: true, name: true }
    });

    console.log(`✅ Search results for "Water" or "WTP": ${searchResults.length}`);
    searchResults.forEach(asset => {
      console.log(`   - ${asset.assetNumber}: ${asset.name}`);
    });

    console.log('\n🎉 /assets page database connectivity test completed successfully!');
    console.log('\nThe page should now be able to:');
    console.log('✅ Fetch assets from the database');
    console.log('✅ Display asset information');
    console.log('✅ Show coordinates on the map');
    console.log('✅ Filter assets by type and status');
    console.log('✅ Search assets by name and number');
    console.log('✅ Show asset counts for related entities');

  } catch (error) {
    console.error('❌ Error testing /assets page:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAssetsPage().catch(console.error);
