/**
 * Azure Cosmos DB Gremlin API Integration
 * 
 * This module provides the connection and query interface for the graph database
 * component of the hybrid architecture. It handles asset relationships, hierarchies,
 * and graph-based intelligence features.
 * 
 * @fileoverview Azure Cosmos DB Gremlin API client and query utilities
 */

import { Client } from 'gremlin';

export interface CosmosDBConfig {
  endpoint: string;
  key: string;
  database: string;
  graph: string;
}

export interface GraphVertex {
  id: string;
  label: string;
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  label: string;
  inV: string;
  outV: string;
  properties: Record<string, any>;
}

export class CosmosGraphClient {
  private client: Client;
  private config: CosmosDBConfig;

  constructor(config: CosmosDBConfig) {
    this.config = config;
    this.client = new Client(
      `wss://${config.endpoint}:443/gremlin`,
      {
        username: `/dbs/${config.database}/colls/${config.graph}`,
        password: config.key,
      }
    );
  }

  /**
   * Execute a Gremlin query against the graph database
   */
  async executeQuery(query: string, bindings?: Record<string, any>): Promise<any[]> {
    try {
      const result = await this.client.submit(query, bindings);
      return result._items || [];
    } catch (error) {
      console.error('Cosmos DB Gremlin query error:', error);
      throw new Error(`Graph query failed: ${error.message}`);
    }
  }

  /**
   * Add a vertex to the graph
   */
  async addVertex(label: string, properties: Record<string, any>): Promise<string> {
    const query = `g.addV('${label}').property('id', '${properties.id}')`;
    const propertyQueries = Object.entries(properties)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => `.property('${key}', '${value}')`)
      .join('');
    
    const fullQuery = query + propertyQueries;
    const result = await this.executeQuery(fullQuery);
    return result[0]?.id;
  }

  /**
   * Add an edge between two vertices
   */
  async addEdge(
    label: string,
    fromVertexId: string,
    toVertexId: string,
    properties: Record<string, any> = {}
  ): Promise<string> {
    const query = `g.V('${fromVertexId}').addE('${label}').to(g.V('${toVertexId}'))`;
    const propertyQueries = Object.entries(properties)
      .map(([key, value]) => `.property('${key}', '${value}')`)
      .join('');
    
    const fullQuery = query + propertyQueries;
    const result = await this.executeQuery(fullQuery);
    return result[0]?.id;
  }

  /**
   * Get a vertex by ID
   */
  async getVertex(id: string): Promise<GraphVertex | null> {
    const query = `g.V('${id}')`;
    const result = await this.executeQuery(query);
    return result[0] || null;
  }

  /**
   * Get vertices by label and properties
   */
  async getVerticesByLabel(label: string, properties?: Record<string, any>): Promise<GraphVertex[]> {
    let query = `g.V().hasLabel('${label}')`;
    
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        query += `.has('${key}', '${value}')`;
      });
    }
    
    const result = await this.executeQuery(query);
    return result;
  }

  /**
   * Get edges between vertices
   */
  async getEdges(fromVertexId?: string, toVertexId?: string, label?: string): Promise<GraphEdge[]> {
    let query = 'g.E()';
    
    if (fromVertexId) {
      query += `.where(outV().hasId('${fromVertexId}'))`;
    }
    
    if (toVertexId) {
      query += `.where(inV().hasId('${toVertexId}'))`;
    }
    
    if (label) {
      query += `.hasLabel('${label}')`;
    }
    
    const result = await this.executeQuery(query);
    return result;
  }

  /**
   * Delete a vertex and all its edges
   */
  async deleteVertex(id: string): Promise<void> {
    const query = `g.V('${id}').drop()`;
    await this.executeQuery(query);
  }

  /**
   * Delete an edge
   */
  async deleteEdge(id: string): Promise<void> {
    const query = `g.E('${id}').drop()`;
    await this.executeQuery(query);
  }

  /**
   * Close the connection
   */
  async close(): Promise<void> {
    await this.client.close();
  }
}

// Singleton instance
let cosmosClient: CosmosGraphClient | null = null;

/**
 * Get the singleton Cosmos DB client instance
 */
export function getCosmosClient(): CosmosGraphClient {
  if (!cosmosClient) {
    const config: CosmosDBConfig = {
      endpoint: process.env.COSMOS_DB_ENDPOINT || '',
      key: process.env.COSMOS_DB_KEY || '',
      database: process.env.COSMOS_DB_DATABASE || 'councilworks',
      graph: process.env.COSMOS_DB_GRAPH || 'assets',
    };

    if (!config.endpoint || !config.key) {
      throw new Error('Cosmos DB configuration missing. Please set COSMOS_DB_ENDPOINT and COSMOS_DB_KEY environment variables.');
    }

    cosmosClient = new CosmosGraphClient(config);
  }

  return cosmosClient;
}

/**
 * Asset-specific graph operations
 */
export class AssetGraphOperations {
  private client: CosmosGraphClient;

  constructor() {
    this.client = getCosmosClient();
  }

  /**
   * Create an asset vertex in the graph
   */
  async createAssetVertex(asset: {
    id: string;
    assetNumber: string;
    name: string;
    assetType: string;
    organisationId: string;
    servicePurpose?: string;
    criticality?: string;
    condition?: string;
    location?: { lat: number; lng: number };
  }): Promise<string> {
    const properties = {
      id: asset.id,
      assetNumber: asset.assetNumber,
      name: asset.name,
      assetType: asset.assetType,
      organisationId: asset.organisationId,
      servicePurpose: asset.servicePurpose || 'Unknown',
      criticality: asset.criticality || 'Medium',
      condition: asset.condition || 'Unknown',
      ...(asset.location && {
        latitude: asset.location.lat,
        longitude: asset.location.lng,
      }),
    };

    return await this.client.addVertex('Asset', properties);
  }

  /**
   * Create a service function vertex
   */
  async createServiceFunctionVertex(functionData: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    organisationId: string;
  }): Promise<string> {
    const properties = {
      id: functionData.id,
      name: functionData.name,
      description: functionData.description || '',
      category: functionData.category || 'General',
      organisationId: functionData.organisationId,
    };

    return await this.client.addVertex('ServiceFunction', properties);
  }

  /**
   * Create a geographic location vertex
   */
  async createLocationVertex(locationData: {
    id: string;
    name: string;
    type: 'Region' | 'Area' | 'Site' | 'Zone';
    parentId?: string;
    organisationId: string;
    coordinates?: { lat: number; lng: number };
  }): Promise<string> {
    const properties = {
      id: locationData.id,
      name: locationData.name,
      type: locationData.type,
      parentId: locationData.parentId || '',
      organisationId: locationData.organisationId,
      ...(locationData.coordinates && {
        latitude: locationData.coordinates.lat,
        longitude: locationData.coordinates.lng,
      }),
    };

    return await this.client.addVertex('Location', properties);
  }

  /**
   * Link asset to service function
   */
  async linkAssetToServiceFunction(assetId: string, functionId: string): Promise<string> {
    return await this.client.addEdge('SERVES_PURPOSE', assetId, functionId, {
      relationshipType: 'service_purpose',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Link asset to location
   */
  async linkAssetToLocation(assetId: string, locationId: string): Promise<string> {
    return await this.client.addEdge('LOCATED_AT', assetId, locationId, {
      relationshipType: 'geographic',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Link location hierarchy (parent-child)
   */
  async linkLocationHierarchy(parentId: string, childId: string): Promise<string> {
    return await this.client.addEdge('CONTAINS', parentId, childId, {
      relationshipType: 'hierarchy',
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Get assets by service function
   */
  async getAssetsByServiceFunction(functionId: string): Promise<GraphVertex[]> {
    const query = `g.V('${functionId}').in('SERVES_PURPOSE')`;
    return await this.client.executeQuery(query);
  }

  /**
   * Get service functions by asset
   */
  async getServiceFunctionsByAsset(assetId: string): Promise<GraphVertex[]> {
    const query = `g.V('${assetId}').out('SERVES_PURPOSE')`;
    return await this.client.executeQuery(query);
  }

  /**
   * Get assets by location
   */
  async getAssetsByLocation(locationId: string): Promise<GraphVertex[]> {
    const query = `g.V('${locationId}').in('LOCATED_AT')`;
    return await this.client.executeQuery(query);
  }

  /**
   * Get critical assets (high criticality)
   */
  async getCriticalAssets(organisationId: string): Promise<GraphVertex[]> {
    const query = `g.V().hasLabel('Asset').has('organisationId', '${organisationId}').has('criticality', 'Critical')`;
    return await this.client.executeQuery(query);
  }

  /**
   * Get asset hierarchy path
   */
  async getAssetHierarchyPath(assetId: string): Promise<{
    serviceFunctions: GraphVertex[];
    locations: GraphVertex[];
    criticality: string;
  }> {
    const serviceFunctions = await this.getServiceFunctionsByAsset(assetId);
    const locations = await this.client.executeQuery(`g.V('${assetId}').out('LOCATED_AT')`);
    const asset = await this.client.getVertex(assetId);
    
    return {
      serviceFunctions,
      locations,
      criticality: asset?.properties?.criticality || 'Unknown',
    };
  }
}

export const assetGraphOps = new AssetGraphOperations();
