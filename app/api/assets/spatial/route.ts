import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Spatial query schema
 */
const spatialQuerySchema = z.object({
  bounds: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }).optional(),
  center: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  radius: z.number().optional(), // in meters
  assetTypes: z.array(z.string()).optional(),
  conditions: z.array(z.string()).optional(),
  statuses: z.array(z.string()).optional(),
});

/**
 * POST /api/assets/spatial - Get assets within spatial bounds or radius
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const query = spatialQuerySchema.parse(body);

    // Build where clause
    const where: any = {
      organisationId: session.user.organisationId,
      location: { not: null },
    };

    // Add filters
    if (query.assetTypes && query.assetTypes.length > 0) {
      where.assetType = { in: query.assetTypes };
    }

    if (query.conditions && query.conditions.length > 0) {
      where.condition = { in: query.conditions };
    }

    if (query.statuses && query.statuses.length > 0) {
      where.status = { in: query.statuses };
    }

    let spatialQuery = "";

    if (query.bounds) {
      // Bounding box query
      spatialQuery = `
        ST_Within(location, ST_MakeEnvelope(
          ${query.bounds.west}, 
          ${query.bounds.south}, 
          ${query.bounds.east}, 
          ${query.bounds.north}, 
          4326
        ))
      `;
    } else if (query.center && query.radius) {
      // Radius query
      const radiusInDegrees = query.radius / 111320; // Rough conversion from meters to degrees
      spatialQuery = `
        ST_DWithin(
          location, 
          ST_GeomFromText('POINT(${query.center.lng} ${query.center.lat})', 4326), 
          ${radiusInDegrees}
        )
      `;
    } else {
      return NextResponse.json({ error: "Either bounds or center+radius must be provided" }, { status: 400 });
    }

    // Execute spatial query
    const assets = await prisma.$queryRaw`
      SELECT 
        id,
        "assetNumber",
        name,
        "assetType",
        status,
        condition,
        priority,
        ST_X(location) as longitude,
        ST_Y(location) as latitude,
        address,
        suburb,
        postcode,
        state,
        country,
        "isPublic"
      FROM "Asset"
      WHERE 
        "organisationId" = ${session.user.organisationId}
        AND location IS NOT NULL
        AND ${spatialQuery}
        ${query.assetTypes && query.assetTypes.length > 0 ? 
          `AND "assetType" = ANY(${query.assetTypes})` : ''}
        ${query.conditions && query.conditions.length > 0 ? 
          `AND condition = ANY(${query.conditions})` : ''}
        ${query.statuses && query.statuses.length > 0 ? 
          `AND status = ANY(${query.statuses})` : ''}
    `;

    return NextResponse.json({
      assets: assets,
      count: Array.isArray(assets) ? assets.length : 0,
      query: query,
    });

  } catch (error) {
    console.error("Error executing spatial query:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to execute spatial query" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/assets/spatial - Get spatial statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bounds = searchParams.get("bounds");

    let spatialStats;

    if (bounds) {
      const [north, south, east, west] = bounds.split(',').map(Number);
      
      spatialStats = await prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_assets,
          COUNT(CASE WHEN condition = 'EXCELLENT' THEN 1 END) as excellent_count,
          COUNT(CASE WHEN condition = 'GOOD' THEN 1 END) as good_count,
          COUNT(CASE WHEN condition = 'FAIR' THEN 1 END) as fair_count,
          COUNT(CASE WHEN condition = 'POOR' THEN 1 END) as poor_count,
          COUNT(CASE WHEN condition = 'CRITICAL' THEN 1 END) as critical_count,
          COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_count,
          COUNT(CASE WHEN status = 'UNDER_MAINTENANCE' THEN 1 END) as maintenance_count,
          COUNT(CASE WHEN priority = 'HIGH' THEN 1 END) as high_priority_count,
          COUNT(CASE WHEN priority = 'CRITICAL' THEN 1 END) as critical_priority_count,
          AVG(ST_X(location)) as center_longitude,
          AVG(ST_Y(location)) as center_latitude
        FROM "Asset"
        WHERE 
          "organisationId" = ${session.user.organisationId}
          AND location IS NOT NULL
          AND ST_Within(location, ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326))
      `;
    } else {
      spatialStats = await prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_assets,
          COUNT(CASE WHEN condition = 'EXCELLENT' THEN 1 END) as excellent_count,
          COUNT(CASE WHEN condition = 'GOOD' THEN 1 END) as good_count,
          COUNT(CASE WHEN condition = 'FAIR' THEN 1 END) as fair_count,
          COUNT(CASE WHEN condition = 'POOR' THEN 1 END) as poor_count,
          COUNT(CASE WHEN condition = 'CRITICAL' THEN 1 END) as critical_count,
          COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_count,
          COUNT(CASE WHEN status = 'UNDER_MAINTENANCE' THEN 1 END) as maintenance_count,
          COUNT(CASE WHEN priority = 'HIGH' THEN 1 END) as high_priority_count,
          COUNT(CASE WHEN priority = 'CRITICAL' THEN 1 END) as critical_priority_count,
          AVG(ST_X(location)) as center_longitude,
          AVG(ST_Y(location)) as center_latitude
        FROM "Asset"
        WHERE 
          "organisationId" = ${session.user.organisationId}
          AND location IS NOT NULL
      `;
    }

    return NextResponse.json({
      stats: Array.isArray(spatialStats) ? spatialStats[0] : spatialStats,
      bounds: bounds ? bounds.split(',').map(Number) : null,
    });

  } catch (error) {
    console.error("Error getting spatial stats:", error);
    return NextResponse.json(
      { error: "Failed to get spatial statistics" },
      { status: 500 }
    );
  }
}
