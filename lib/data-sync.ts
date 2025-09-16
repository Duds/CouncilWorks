/**
 * Data Synchronization Service
 * 
 * This service handles bidirectional synchronization between PostgreSQL (transactional data)
 * and Azure Cosmos DB Gremlin API (graph relationships and hierarchies).
 * 
 * @fileoverview Synchronization service for hybrid database architecture
 */

import { PrismaClient } from '@prisma/client';
import { AssetGraphOperations, GraphVertex } from './cosmos-db';

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  warnings: string[];
}

export interface SyncOptions {
  batchSize?: number;
  dryRun?: boolean;
  forceUpdate?: boolean;
  includeDeleted?: boolean;
}

export class DataSyncService {
  private prisma: PrismaClient;
  private graphOps: AssetGraphOperations;

  constructor() {
    this.prisma = new PrismaClient();
    this.graphOps = new AssetGraphOperations();
  }

  /**
   * Sync all assets from PostgreSQL to Cosmos DB
   */
  async syncAssetsToGraph(options: SyncOptions = {}): Promise<SyncResult> {
    const {
      batchSize = 100,
      dryRun = false,
      forceUpdate = false,
    } = options;

    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      errors: [],
      warnings: [],
    };

    try {
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        const assets = await this.prisma.asset.findMany({
          skip,
          take: batchSize,
          include: {
            organisation: true,
          },
        });

        if (assets.length === 0) {
          hasMore = false;
          break;
        }

        for (const asset of assets) {
          try {
            if (!dryRun) {
              await this.syncAssetToGraph(asset, forceUpdate);
            }
            result.recordsProcessed++;
          } catch (error) {
            result.errors.push(`Asset ${asset.assetNumber}: ${error.message}`);
          }
        }

        skip += batchSize;
        hasMore = assets.length === batchSize;
      }

      console.log(`Synced ${result.recordsProcessed} assets to graph database`);
    } catch (error) {
      result.success = false;
      result.errors.push(`Sync failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Sync a single asset to the graph database
   */
  async syncAssetToGraph(asset: any, forceUpdate: boolean = false): Promise<void> {
    // Check if asset already exists in graph
    const existingAsset = await this.graphOps.client.getVertex(asset.id);
    
    if (existingAsset && !forceUpdate) {
      // Update existing asset properties
      await this.updateAssetInGraph(asset);
    } else {
      // Create new asset vertex
      await this.graphOps.createAssetVertex({
        id: asset.id,
        assetNumber: asset.assetNumber,
        name: asset.name,
        assetType: asset.assetType,
        organisationId: asset.organisationId,
        servicePurpose: this.extractServicePurpose(asset),
        criticality: this.mapPriorityToCriticality(asset.priority),
        condition: asset.condition,
        location: asset.location ? this.extractLocation(asset.location) : undefined,
      });

      // Create service function relationships
      await this.createServiceFunctionRelationships(asset);
      
      // Create location relationships
      await this.createLocationRelationships(asset);
    }
  }

  /**
   * Update an existing asset in the graph
   */
  private async updateAssetInGraph(asset: any): Promise<void> {
    // For now, we'll delete and recreate the vertex
    // In a production system, you'd want to update properties individually
    await this.graphOps.client.deleteVertex(asset.id);
    await this.syncAssetToGraph(asset, true);
  }

  /**
   * Extract service purpose from asset data
   */
  private extractServicePurpose(asset: any): string {
    // Map asset types to service purposes based on Aegrid Rule 1
    const servicePurposeMap: Record<string, string> = {
      BUILDING: 'Facility Management',
      ROAD: 'Transportation',
      BRIDGE: 'Transportation',
      FOOTPATH: 'Transportation',
      PARK: 'Community Services',
      PLAYGROUND: 'Community Services',
      SPORTS_FACILITY: 'Community Services',
      LIBRARY: 'Community Services',
      COMMUNITY_CENTRE: 'Community Services',
      CAR_PARK: 'Transportation',
      STREET_FURNITURE: 'Urban Services',
      TRAFFIC_LIGHT: 'Transportation',
      STREET_LIGHT: 'Urban Services',
      DRAINAGE: 'Infrastructure',
      WATER_SUPPLY: 'Infrastructure',
      SEWER: 'Infrastructure',
      ELECTRICAL_INFRASTRUCTURE: 'Infrastructure',
      TELECOMMUNICATIONS: 'Infrastructure',
      OTHER: 'General Services',
    };

    return servicePurposeMap[asset.assetType] || 'General Services';
  }

  /**
   * Map asset priority to criticality level
   */
  private mapPriorityToCriticality(priority: string): string {
    const criticalityMap: Record<string, string> = {
      LOW: 'Low',
      MEDIUM: 'Medium',
      HIGH: 'High',
      CRITICAL: 'Critical',
    };

    return criticalityMap[priority] || 'Medium';
  }

  /**
   * Extract location coordinates from PostGIS geometry
   */
  private extractLocation(location: any): { lat: number; lng: number } | undefined {
    // This would need to be implemented based on your PostGIS setup
    // For now, return undefined
    return undefined;
  }

  /**
   * Create service function relationships for an asset
   */
  private async createServiceFunctionRelationships(asset: any): Promise<void> {
    const servicePurpose = this.extractServicePurpose(asset);
    
    // Find or create service function vertex
    const serviceFunctions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
      name: servicePurpose,
      organisationId: asset.organisationId,
    });

    let functionId: string;
    if (serviceFunctions.length === 0) {
      functionId = await this.graphOps.createServiceFunctionVertex({
        id: `sf_${asset.organisationId}_${servicePurpose.replace(/\s+/g, '_')}`,
        name: servicePurpose,
        description: `Service function for ${servicePurpose}`,
        category: this.getServiceCategory(servicePurpose),
        organisationId: asset.organisationId,
      });
    } else {
      functionId = serviceFunctions[0].id;
    }

    // Link asset to service function
    await this.graphOps.linkAssetToServiceFunction(asset.id, functionId);
  }

  /**
   * Create location relationships for an asset
   */
  private async createLocationRelationships(asset: any): Promise<void> {
    // Create location hierarchy based on asset address
    const locationHierarchy = this.buildLocationHierarchy(asset);
    
    for (const location of locationHierarchy) {
      // Find or create location vertex
      const existingLocations = await this.graphOps.client.getVerticesByLabel('Location', {
        name: location.name,
        type: location.type,
        organisationId: asset.organisationId,
      });

      let locationId: string;
      if (existingLocations.length === 0) {
        locationId = await this.graphOps.createLocationVertex({
          id: `loc_${asset.organisationId}_${location.name.replace(/\s+/g, '_')}`,
          name: location.name,
          type: location.type,
          parentId: location.parentId,
          organisationId: asset.organisationId,
          coordinates: location.coordinates,
        });
      } else {
        locationId = existingLocations[0].id;
      }

      // Link asset to location
      await this.graphOps.linkAssetToLocation(asset.id, locationId);
    }
  }

  /**
   * Build location hierarchy from asset address
   */
  private buildLocationHierarchy(asset: any): Array<{
    name: string;
    type: 'Region' | 'Area' | 'Site' | 'Zone';
    parentId?: string;
    coordinates?: { lat: number; lng: number };
  }> {
    const hierarchy = [];
    
    if (asset.state) {
      hierarchy.push({
        name: asset.state,
        type: 'Region' as const,
      });
    }
    
    if (asset.suburb) {
      hierarchy.push({
        name: asset.suburb,
        type: 'Area' as const,
        parentId: hierarchy.length > 0 ? hierarchy[hierarchy.length - 1].name : undefined,
      });
    }
    
    if (asset.address) {
      hierarchy.push({
        name: asset.address,
        type: 'Site' as const,
        parentId: hierarchy.length > 0 ? hierarchy[hierarchy.length - 1].name : undefined,
      });
    }

    return hierarchy;
  }

  /**
   * Get service category from service purpose
   */
  private getServiceCategory(servicePurpose: string): string {
    const categoryMap: Record<string, string> = {
      'Facility Management': 'Infrastructure',
      'Transportation': 'Infrastructure',
      'Community Services': 'Social',
      'Urban Services': 'Infrastructure',
      'Infrastructure': 'Infrastructure',
      'General Services': 'General',
    };

    return categoryMap[servicePurpose] || 'General';
  }

  /**
   * Sync service functions from graph back to PostgreSQL
   */
  async syncServiceFunctionsFromGraph(organisationId: string): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      errors: [],
      warnings: [],
    };

    try {
      const serviceFunctions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
        organisationId,
      });

      for (const sf of serviceFunctions) {
        try {
          // Update asset tags with service function information
          await this.prisma.asset.updateMany({
            where: {
              organisationId,
              // This would need to be implemented based on your relationship logic
            },
            data: {
              tags: {
                push: `service-purpose:${sf.properties.name}`,
              },
            },
          });

          result.recordsProcessed++;
        } catch (error) {
          result.errors.push(`Service Function ${sf.properties.name}: ${error.message}`);
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Sync failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Get asset intelligence data combining PostgreSQL and graph data
   */
  async getAssetIntelligence(assetId: string): Promise<{
    asset: any;
    serviceFunctions: GraphVertex[];
    locations: GraphVertex[];
    criticality: string;
    relatedAssets: GraphVertex[];
  }> {
    // Get asset from PostgreSQL
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        organisation: true,
        documents: true,
        inspections: true,
        maintenance: true,
        workOrders: true,
      },
    });

    if (!asset) {
      throw new Error(`Asset ${assetId} not found`);
    }

    // Get graph relationships
    const hierarchy = await this.graphOps.getAssetHierarchyPath(assetId);
    
    // Get related assets (same service function or location)
    const relatedAssets = await this.graphOps.client.executeQuery(
      `g.V('${assetId}').both('SERVES_PURPOSE', 'LOCATED_AT').in('SERVES_PURPOSE', 'LOCATED_AT').dedup()`
    );

    return {
      asset,
      serviceFunctions: hierarchy.serviceFunctions,
      locations: hierarchy.locations,
      criticality: hierarchy.criticality,
      relatedAssets,
    };
  }

  /**
   * Clean up orphaned vertices in the graph
   */
  async cleanupOrphanedVertices(organisationId: string): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      errors: [],
      warnings: [],
    };

    try {
      // Get all asset IDs from PostgreSQL
      const assets = await this.prisma.asset.findMany({
        where: { organisationId },
        select: { id: true },
      });
      const assetIds = new Set(assets.map(a => a.id));

      // Get all asset vertices from graph
      const graphAssets = await this.graphOps.client.getVerticesByLabel('Asset', {
        organisationId,
      });

      // Find orphaned vertices
      const orphanedVertices = graphAssets.filter(va => !assetIds.has(va.id));

      for (const vertex of orphanedVertices) {
        try {
          await this.graphOps.client.deleteVertex(vertex.id);
          result.recordsProcessed++;
        } catch (error) {
          result.errors.push(`Failed to delete vertex ${vertex.id}: ${error.message}`);
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Cleanup failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Close connections
   */
  async close(): Promise<void> {
    await this.prisma.$disconnect();
    await this.graphOps.client.close();
  }
}

export const dataSyncService = new DataSyncService();
