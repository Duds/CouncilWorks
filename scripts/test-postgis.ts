import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Test PostGIS functionality with asset creation
 */
async function testPostGIS() {
  try {
    console.log('Testing PostGIS functionality...');

    // Test 1: Create a test organisation and user first
    const testOrg = await prisma.organisation.create({
      data: {
        name: 'Test Council',
      },
    });

    const testUser = await prisma.user.create({
      data: {
        email: 'test@testcouncil.gov.au',
        name: 'Test User',
        role: 'MANAGER',
        organisationId: testOrg.id,
      },
    });

    console.log('✅ Test organisation and user created');

    // Test 2: Create a test asset with spatial data using raw SQL
    const testAsset = await prisma.$queryRaw`
      INSERT INTO "Asset" (
        id, "assetNumber", name, description, "assetType", status, condition, priority,
        location, address, suburb, postcode, state, country,
        "organisationId", "createdBy", "updatedBy", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text,
        'TEST-001',
        'Test Asset - Sydney Opera House',
        'Test asset for PostGIS functionality',
        'BUILDING',
        'ACTIVE',
        'GOOD',
        'MEDIUM',
        ST_GeomFromText('POINT(151.2153 -33.8568)', 4326),
        'Bennelong Point, Sydney NSW 2000',
        'Sydney',
        '2000',
        'NSW',
        'Australia',
        ${testOrg.id},
        ${testUser.id},
        ${testUser.id},
        NOW(),
        NOW()
      )
      RETURNING id, "assetNumber", name
    `;

    console.log('✅ Test asset created:', testAsset);

    // Test 2: Query assets within a bounding box (Sydney CBD area)
    const sydneyCBDAssets = await prisma.$queryRaw`
      SELECT id, name, "assetNumber", ST_AsText(location) as location_text
      FROM "Asset"
      WHERE ST_Within(
        location,
        ST_MakeEnvelope(151.2, -33.87, 151.23, -33.84, 4326)
      )
    `;

    console.log('✅ Spatial query successful:', sydneyCBDAssets);

    // Test 3: Calculate distance from a point
    const distanceQuery = await prisma.$queryRaw`
      SELECT 
        id, 
        name, 
        ST_Distance(
          location, 
          ST_GeomFromText('POINT(151.2093 -33.8688)', 4326)
        ) as distance_meters
      FROM "Asset"
      WHERE location IS NOT NULL
      ORDER BY distance_meters
      LIMIT 5
    `;

    console.log('✅ Distance calculation successful:', distanceQuery);

    // Clean up test data
    await prisma.$queryRaw`
      DELETE FROM "Asset" WHERE "assetNumber" = 'TEST-001'
    `;

    await prisma.user.delete({
      where: { id: testUser.id },
    });

    await prisma.organisation.delete({
      where: { id: testOrg.id },
    });

    console.log('✅ Test data cleaned up');

    console.log('🎉 All PostGIS tests passed!');
  } catch (error) {
    console.error('❌ PostGIS test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPostGIS();
