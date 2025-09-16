/**
 * Azure Cosmos DB Gremlin API Setup and Configuration
 * 
 * Implements infrastructure setup for hybrid database architecture
 * 
 * @fileoverview Azure Cosmos DB Gremlin API infrastructure setup
 */

import { CosmosClient } from '@azure/cosmos';
import { GremlinClient } from 'gremlin';

export interface CosmosDBConfig {
  endpoint: string;
  key: string;
  databaseId: string;
  containerId: string;
  partitionKey: string;
  throughput: number;
  enableAutoscale: boolean;
  maxThroughput?: number;
  consistencyLevel: 'Strong' | 'BoundedStaleness' | 'Session' | 'Eventual' | 'ConsistentPrefix';
  enableMultiRegion: boolean;
  regions?: string[];
}

export interface DatabaseConnection {
  cosmosClient: CosmosClient;
  gremlinClient: GremlinClient;
  database: any;
  container: any;
  isConnected: boolean;
  lastHealthCheck: Date;
}

export interface InfrastructureMetrics {
  connectionCount: number;
  activeConnections: number;
  failedConnections: number;
  averageResponseTime: number;
  throughput: number;
  storageUsed: number;
  lastUpdated: Date;
}

export class CosmosDBInfrastructure {
  private config: CosmosDBConfig;
  private connection: DatabaseConnection | null = null;
  private metrics: InfrastructureMetrics;

  constructor(config: CosmosDBConfig) {
    this.config = config;
    this.metrics = {
      connectionCount: 0,
      activeConnections: 0,
      failedConnections: 0,
      averageResponseTime: 0,
      throughput: 0,
      storageUsed: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Initialize Cosmos DB infrastructure
   */
  async initialize(): Promise<void> {
    try {
      // Create Cosmos DB client
      const cosmosClient = new CosmosClient({
        endpoint: this.config.endpoint,
        key: this.config.key,
      });

      // Create Gremlin client
      const gremlinClient = new GremlinClient({
        endpoint: this.config.endpoint,
        key: this.config.key,
        database: this.config.databaseId,
        collection: this.config.containerId,
      });

      // Create database if it doesn't exist
      const { database } = await cosmosClient.databases.createIfNotExists({
        id: this.config.databaseId,
        throughput: this.config.enableAutoscale ? undefined : this.config.throughput,
        autoscaleSettings: this.config.enableAutoscale ? {
          maxThroughput: this.config.maxThroughput || 4000,
        } : undefined,
      });

      // Create container if it doesn't exist
      const { container } = await database.containers.createIfNotExists({
        id: this.config.containerId,
        partitionKey: {
          paths: [`/${this.config.partitionKey}`],
        },
        indexingPolicy: {
          indexingMode: 'consistent',
          automatic: true,
          includedPaths: [
            {
              path: '/*',
            },
          ],
          excludedPaths: [
            {
              path: '/"_etag"/?',
            },
          ],
        },
        conflictResolutionPolicy: {
          mode: 'LastWriterWins',
          conflictResolutionPath: '/_ts',
        },
      });

      // Test connection
      await this.testConnection(cosmosClient, gremlinClient);

      this.connection = {
        cosmosClient,
        gremlinClient,
        database,
        container,
        isConnected: true,
        lastHealthCheck: new Date(),
      };

      this.metrics.connectionCount++;
      this.metrics.activeConnections++;

      console.log('Cosmos DB infrastructure initialized successfully');
    } catch (error) {
      this.metrics.failedConnections++;
      console.error('Failed to initialize Cosmos DB infrastructure:', error);
      throw error;
    }
  }

  /**
   * Test database connection
   */
  async testConnection(cosmosClient: CosmosClient, gremlinClient: GremlinClient): Promise<boolean> {
    try {
      // Test Cosmos DB connection
      await cosmosClient.getDatabaseAccount();
      
      // Test Gremlin connection
      await gremlinClient.submit('g.V().limit(1)');
      
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get database connection
   */
  getConnection(): DatabaseConnection {
    if (!this.connection || !this.connection.isConnected) {
      throw new Error('Database connection not available');
    }
    return this.connection;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy' | 'degraded';
    details: Record<string, any>;
  }> {
    if (!this.connection) {
      return {
        status: 'unhealthy',
        details: { error: 'No connection available' },
      };
    }

    try {
      const startTime = Date.now();
      const isConnected = await this.testConnection(
        this.connection.cosmosClient,
        this.connection.gremlinClient
      );
      const responseTime = Date.now() - startTime;

      this.connection.lastHealthCheck = new Date();
      this.metrics.averageResponseTime = responseTime;

      if (isConnected) {
        return {
          status: 'healthy',
          details: {
            responseTime,
            lastHealthCheck: this.connection.lastHealthCheck,
            connectionCount: this.metrics.connectionCount,
          },
        };
      } else {
        return {
          status: 'unhealthy',
          details: { error: 'Connection test failed' },
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  /**
   * Get infrastructure metrics
   */
  getMetrics(): InfrastructureMetrics {
    return { ...this.metrics };
  }

  /**
   * Update throughput
   */
  async updateThroughput(throughput: number): Promise<void> {
    if (!this.connection) {
      throw new Error('Database connection not available');
    }

    try {
      await this.connection.container.replace({
        id: this.config.containerId,
        partitionKey: {
          paths: [`/${this.config.partitionKey}`],
        },
        throughput,
      });

      this.config.throughput = throughput;
      this.metrics.throughput = throughput;
      this.metrics.lastUpdated = new Date();

      console.log(`Throughput updated to ${throughput} RU/s`);
    } catch (error) {
      console.error('Failed to update throughput:', error);
      throw error;
    }
  }

  /**
   * Enable autoscale
   */
  async enableAutoscale(maxThroughput: number): Promise<void> {
    if (!this.connection) {
      throw new Error('Database connection not available');
    }

    try {
      await this.connection.container.replace({
        id: this.config.containerId,
        partitionKey: {
          paths: [`/${this.config.partitionKey}`],
        },
        autoscaleSettings: {
          maxThroughput,
        },
      });

      this.config.enableAutoscale = true;
      this.config.maxThroughput = maxThroughput;
      this.metrics.lastUpdated = new Date();

      console.log(`Autoscale enabled with max throughput ${maxThroughput} RU/s`);
    } catch (error) {
      console.error('Failed to enable autoscale:', error);
      throw error;
    }
  }

  /**
   * Get storage usage
   */
  async getStorageUsage(): Promise<{
    used: number;
    available: number;
    percentage: number;
  }> {
    if (!this.connection) {
      throw new Error('Database connection not available');
    }

    try {
      const response = await this.connection.container.read();
      const storageUsed = response.resource?.storageSize || 0;
      const maxStorage = response.resource?.maxStorageSize || 0;
      
      this.metrics.storageUsed = storageUsed;
      this.metrics.lastUpdated = new Date();

      return {
        used: storageUsed,
        available: maxStorage - storageUsed,
        percentage: maxStorage > 0 ? (storageUsed / maxStorage) * 100 : 0,
      };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      throw error;
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.gremlinClient.close();
        this.connection.isConnected = false;
        this.metrics.activeConnections--;
        console.log('Cosmos DB connection closed');
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// Export configuration for different environments
export const COSMOS_DB_CONFIGS = {
  development: {
    endpoint: process.env.COSMOS_DB_ENDPOINT || 'https://localhost:8081',
    key: process.env.COSMOS_DB_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
    databaseId: 'aegrid-dev',
    containerId: 'assets',
    partitionKey: 'organisationId',
    throughput: 400,
    enableAutoscale: false,
    consistencyLevel: 'Session' as const,
    enableMultiRegion: false,
  },
  staging: {
    endpoint: process.env.COSMOS_DB_ENDPOINT || '',
    key: process.env.COSMOS_DB_KEY || '',
    databaseId: 'aegrid-staging',
    containerId: 'assets',
    partitionKey: 'organisationId',
    throughput: 1000,
    enableAutoscale: true,
    maxThroughput: 4000,
    consistencyLevel: 'Session' as const,
    enableMultiRegion: false,
  },
  production: {
    endpoint: process.env.COSMOS_DB_ENDPOINT || '',
    key: process.env.COSMOS_DB_KEY || '',
    databaseId: 'aegrid-prod',
    containerId: 'assets',
    partitionKey: 'organisationId',
    throughput: 2000,
    enableAutoscale: true,
    maxThroughput: 10000,
    consistencyLevel: 'Session' as const,
    enableMultiRegion: true,
    regions: ['Australia East', 'Australia Southeast'],
  },
};

// Export singleton instance
export const cosmosDBInfrastructure = new CosmosDBInfrastructure(
  COSMOS_DB_CONFIGS[process.env.NODE_ENV as keyof typeof COSMOS_DB_CONFIGS] || COSMOS_DB_CONFIGS.development
);
