/**
 * Database Connection Services
 * 
 * Implements connection management for hybrid database architecture
 * 
 * @fileoverview Database connection services for PostgreSQL and Cosmos DB
 */

import { Pool, PoolClient } from 'pg';
import { CosmosClient } from '@azure/cosmos';
import { GremlinClient } from 'gremlin';

export interface DatabaseConnectionConfig {
  postgres: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
    maxConnections: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
  };
  cosmos: {
    endpoint: string;
    key: string;
    databaseId: string;
    containerId: string;
    partitionKey: string;
    throughput: number;
    enableAutoscale: boolean;
    maxThroughput?: number;
  };
}

export interface ConnectionPool {
  postgres: Pool;
  cosmos: CosmosClient;
  gremlin: GremlinClient;
  isHealthy: boolean;
  lastHealthCheck: Date;
  metrics: ConnectionMetrics;
}

export interface ConnectionMetrics {
  postgresConnections: {
    total: number;
    active: number;
    idle: number;
    waiting: number;
  };
  cosmosConnections: {
    active: number;
    failed: number;
    averageResponseTime: number;
  };
  lastUpdated: Date;
}

export interface HealthCheckResult {
  postgres: {
    status: 'healthy' | 'unhealthy' | 'degraded';
    responseTime: number;
    error?: string;
  };
  cosmos: {
    status: 'healthy' | 'unhealthy' | 'degraded';
    responseTime: number;
    error?: string;
  };
  overall: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
}

export class DatabaseConnectionService {
  private config: DatabaseConnectionConfig;
  private pool: ConnectionPool | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: DatabaseConnectionConfig) {
    this.config = config;
  }

  /**
   * Initialize connection pools
   */
  async initialize(): Promise<void> {
    try {
      // Initialize PostgreSQL connection pool
      const postgresPool = new Pool({
        host: this.config.postgres.host,
        port: this.config.postgres.port,
        database: this.config.postgres.database,
        user: this.config.postgres.username,
        password: this.config.postgres.password,
        ssl: this.config.postgres.ssl,
        max: this.config.postgres.maxConnections,
        idleTimeoutMillis: this.config.postgres.idleTimeoutMillis,
        connectionTimeoutMillis: this.config.postgres.connectionTimeoutMillis,
      });

      // Initialize Cosmos DB client
      const cosmosClient = new CosmosClient({
        endpoint: this.config.cosmos.endpoint,
        key: this.config.cosmos.key,
      });

      // Initialize Gremlin client
      const gremlinClient = new GremlinClient({
        endpoint: this.config.cosmos.endpoint,
        key: this.config.cosmos.key,
        database: this.config.cosmos.databaseId,
        collection: this.config.cosmos.containerId,
      });

      // Test connections
      await this.testConnections(postgresPool, cosmosClient, gremlinClient);

      this.pool = {
        postgres: postgresPool,
        cosmos: cosmosClient,
        gremlin: gremlinClient,
        isHealthy: true,
        lastHealthCheck: new Date(),
        metrics: {
          postgresConnections: {
            total: 0,
            active: 0,
            idle: 0,
            waiting: 0,
          },
          cosmosConnections: {
            active: 0,
            failed: 0,
            averageResponseTime: 0,
          },
          lastUpdated: new Date(),
        },
      };

      // Start health check interval
      this.startHealthCheck();

      console.log('Database connection service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database connection service:', error);
      throw error;
    }
  }

  /**
   * Test database connections
   */
  private async testConnections(
    postgresPool: Pool,
    cosmosClient: CosmosClient,
    gremlinClient: GremlinClient
  ): Promise<void> {
    // Test PostgreSQL connection
    const postgresClient = await postgresPool.connect();
    try {
      await postgresClient.query('SELECT 1');
      console.log('PostgreSQL connection test successful');
    } finally {
      postgresClient.release();
    }

    // Test Cosmos DB connection
    await cosmosClient.getDatabaseAccount();
    console.log('Cosmos DB connection test successful');

    // Test Gremlin connection
    await gremlinClient.submit('g.V().limit(1)');
    console.log('Gremlin connection test successful');
  }

  /**
   * Get PostgreSQL connection
   */
  async getPostgresConnection(): Promise<PoolClient> {
    if (!this.pool || !this.pool.isHealthy) {
      throw new Error('Database connection pool not available');
    }

    try {
      const client = await this.pool.postgres.connect();
      this.updateMetrics();
      return client;
    } catch (error) {
      this.pool.metrics.cosmosConnections.failed++;
      throw error;
    }
  }

  /**
   * Get Cosmos DB client
   */
  getCosmosClient(): CosmosClient {
    if (!this.pool || !this.pool.isHealthy) {
      throw new Error('Cosmos DB connection not available');
    }
    return this.pool.cosmos;
  }

  /**
   * Get Gremlin client
   */
  getGremlinClient(): GremlinClient {
    if (!this.pool || !this.pool.isHealthy) {
      throw new Error('Gremlin connection not available');
    }
    return this.pool.gremlin;
  }

  /**
   * Execute PostgreSQL query
   */
  async executePostgresQuery<T = any>(
    query: string,
    params?: any[]
  ): Promise<{ rows: T[]; rowCount: number }> {
    const client = await this.getPostgresConnection();
    try {
      const result = await client.query(query, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Execute Gremlin query
   */
  async executeGremlinQuery(query: string): Promise<any[]> {
    const gremlinClient = this.getGremlinClient();
    try {
      const result = await gremlinClient.submit(query);
      return result._items || [];
    } catch (error) {
      this.pool!.metrics.cosmosConnections.failed++;
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const result: HealthCheckResult = {
      postgres: { status: 'unhealthy', responseTime: 0 },
      cosmos: { status: 'unhealthy', responseTime: 0 },
      overall: 'unhealthy',
      timestamp: new Date(),
    };

    if (!this.pool) {
      return result;
    }

    // Check PostgreSQL
    try {
      const startTime = Date.now();
      const client = await this.pool.postgres.connect();
      await client.query('SELECT 1');
      client.release();
      result.postgres = {
        status: 'healthy',
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      result.postgres = {
        status: 'unhealthy',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Check Cosmos DB
    try {
      const startTime = Date.now();
      await this.pool.cosmos.getDatabaseAccount();
      result.cosmos = {
        status: 'healthy',
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      result.cosmos = {
        status: 'unhealthy',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Determine overall status
    if (result.postgres.status === 'healthy' && result.cosmos.status === 'healthy') {
      result.overall = 'healthy';
    } else if (result.postgres.status === 'unhealthy' || result.cosmos.status === 'unhealthy') {
      result.overall = 'unhealthy';
    } else {
      result.overall = 'degraded';
    }

    this.pool.lastHealthCheck = new Date();
    this.updateMetrics();

    return result;
  }

  /**
   * Start health check interval
   */
  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const healthResult = await this.healthCheck();
        if (healthResult.overall === 'unhealthy') {
          console.warn('Database health check failed:', healthResult);
        }
      } catch (error) {
        console.error('Health check error:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Update connection metrics
   */
  private updateMetrics(): void {
    if (!this.pool) return;

    const postgresStats = this.pool.postgres.totalCount;
    const postgresIdle = this.pool.postgres.idleCount;
    const postgresWaiting = this.pool.postgres.waitingCount;

    this.pool.metrics = {
      postgresConnections: {
        total: postgresStats,
        active: postgresStats - postgresIdle,
        idle: postgresIdle,
        waiting: postgresWaiting,
      },
      cosmosConnections: {
        active: this.pool.metrics.cosmosConnections.active,
        failed: this.pool.metrics.cosmosConnections.failed,
        averageResponseTime: this.pool.metrics.cosmosConnections.averageResponseTime,
      },
      lastUpdated: new Date(),
    };
  }

  /**
   * Get connection metrics
   */
  getMetrics(): ConnectionMetrics {
    if (!this.pool) {
      return {
        postgresConnections: { total: 0, active: 0, idle: 0, waiting: 0 },
        cosmosConnections: { active: 0, failed: 0, averageResponseTime: 0 },
        lastUpdated: new Date(),
      };
    }
    return { ...this.pool.metrics };
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.pool) {
      try {
        await this.pool.postgres.end();
        await this.pool.gremlin.close();
        this.pool.isHealthy = false;
        console.log('Database connections closed');
      } catch (error) {
        console.error('Error closing database connections:', error);
      }
    }
  }
}

// Export configuration for different environments
export const DATABASE_CONFIGS = {
  development: {
    postgres: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'aegrid',
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      ssl: false,
      maxConnections: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
    cosmos: {
      endpoint: process.env.COSMOS_DB_ENDPOINT || 'https://localhost:8081',
      key: process.env.COSMOS_DB_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
      databaseId: 'aegrid-dev',
      containerId: 'assets',
      partitionKey: 'organisationId',
      throughput: 400,
      enableAutoscale: false,
    },
  },
  production: {
    postgres: {
      host: process.env.POSTGRES_HOST || '',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'aegrid',
      username: process.env.POSTGRES_USER || '',
      password: process.env.POSTGRES_PASSWORD || '',
      ssl: true,
      maxConnections: 50,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    },
    cosmos: {
      endpoint: process.env.COSMOS_DB_ENDPOINT || '',
      key: process.env.COSMOS_DB_KEY || '',
      databaseId: 'aegrid-prod',
      containerId: 'assets',
      partitionKey: 'organisationId',
      throughput: 2000,
      enableAutoscale: true,
      maxThroughput: 10000,
    },
  },
};

// Export singleton instance
export const databaseConnectionService = new DatabaseConnectionService(
  DATABASE_CONFIGS[process.env.NODE_ENV as keyof typeof DATABASE_CONFIGS] || DATABASE_CONFIGS.development
);
