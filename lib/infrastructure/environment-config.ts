/**
 * Environment Configuration Management
 * 
 * Implements environment-specific configuration management for hybrid database architecture
 * 
 * @fileoverview Environment configuration management
 */

export interface EnvironmentConfig {
  nodeEnv: 'development' | 'staging' | 'production';
  database: {
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
      consistencyLevel: 'Strong' | 'BoundedStaleness' | 'Session' | 'Eventual' | 'ConsistentPrefix';
      enableMultiRegion: boolean;
      regions?: string[];
    };
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
    maxRetriesPerRequest: number;
    retryDelayOnFailover: number;
  };
  azure: {
    storage: {
      connectionString: string;
      containerName: string;
      enableVersioning: boolean;
      enableSoftDelete: boolean;
    };
    applicationInsights: {
      connectionString: string;
      enableAutoCollection: boolean;
      enableConsoleLogging: boolean;
    };
  };
  security: {
    rateLimiting: {
      windowMs: number;
      maxRequests: number;
      skipSuccessfulRequests: boolean;
      skipFailedRequests: boolean;
    };
    ddosProtection: {
      enabled: boolean;
      maxRequestsPerMinute: number;
      maxRequestsPerHour: number;
      maxRequestsPerDay: number;
      blockDuration: number;
    };
  };
  monitoring: {
    enableMetrics: boolean;
    enableLogging: boolean;
    enableTracing: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class EnvironmentConfigManager {
  private config: EnvironmentConfig;
  private validationResult: ConfigValidationResult | null = null;

  constructor() {
    this.config = this.loadConfiguration();
    this.validationResult = this.validateConfiguration();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfiguration(): EnvironmentConfig {
    const nodeEnv = (process.env.NODE_ENV as EnvironmentConfig['nodeEnv']) || 'development';
    
    return {
      nodeEnv,
      database: {
        postgres: {
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT || '5432'),
          database: process.env.POSTGRES_DB || 'aegrid',
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          ssl: process.env.POSTGRES_SSL === 'true',
          maxConnections: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '10'),
          idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000'),
          connectionTimeoutMillis: parseInt(process.env.POSTGRES_CONNECTION_TIMEOUT || '5000'),
        },
        cosmos: {
          endpoint: process.env.COSMOS_DB_ENDPOINT || 'https://localhost:8081',
          key: process.env.COSMOS_DB_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
          databaseId: process.env.COSMOS_DB_DATABASE_ID || 'aegrid-dev',
          containerId: process.env.COSMOS_DB_CONTAINER_ID || 'assets',
          partitionKey: process.env.COSMOS_DB_PARTITION_KEY || 'organisationId',
          throughput: parseInt(process.env.COSMOS_DB_THROUGHPUT || '400'),
          enableAutoscale: process.env.COSMOS_DB_ENABLE_AUTOSCALE === 'true',
          maxThroughput: process.env.COSMOS_DB_MAX_THROUGHPUT ? parseInt(process.env.COSMOS_DB_MAX_THROUGHPUT) : undefined,
          consistencyLevel: (process.env.COSMOS_DB_CONSISTENCY_LEVEL as any) || 'Session',
          enableMultiRegion: process.env.COSMOS_DB_ENABLE_MULTI_REGION === 'true',
          regions: process.env.COSMOS_DB_REGIONS ? process.env.COSMOS_DB_REGIONS.split(',') : undefined,
        },
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
        maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
        retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY || '100'),
      },
      azure: {
        storage: {
          connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
          containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'documents',
          enableVersioning: process.env.AZURE_STORAGE_ENABLE_VERSIONING === 'true',
          enableSoftDelete: process.env.AZURE_STORAGE_ENABLE_SOFT_DELETE === 'true',
        },
        applicationInsights: {
          connectionString: process.env.APPLICATION_INSIGHTS_CONNECTION_STRING || '',
          enableAutoCollection: process.env.APPLICATION_INSIGHTS_ENABLE_AUTO_COLLECTION !== 'false',
          enableConsoleLogging: process.env.APPLICATION_INSIGHTS_ENABLE_CONSOLE_LOGGING === 'true',
        },
      },
      security: {
        rateLimiting: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
          maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
          skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL === 'true',
          skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'true',
        },
        ddosProtection: {
          enabled: process.env.DDOS_PROTECTION_ENABLED !== 'false',
          maxRequestsPerMinute: parseInt(process.env.DDOS_MAX_REQUESTS_PER_MINUTE || '60'),
          maxRequestsPerHour: parseInt(process.env.DDOS_MAX_REQUESTS_PER_HOUR || '1000'),
          maxRequestsPerDay: parseInt(process.env.DDOS_MAX_REQUESTS_PER_DAY || '10000'),
          blockDuration: parseInt(process.env.DDOS_BLOCK_DURATION || '900000'), // 15 minutes
        },
      },
      monitoring: {
        enableMetrics: process.env.ENABLE_METRICS !== 'false',
        enableLogging: process.env.ENABLE_LOGGING !== 'false',
        enableTracing: process.env.ENABLE_TRACING !== 'false',
        logLevel: (process.env.LOG_LEVEL as any) || 'info',
      },
    };
  }

  /**
   * Validate configuration
   */
  private validateConfiguration(): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required environment variables
    if (this.config.nodeEnv === 'production') {
      if (!process.env.POSTGRES_HOST) {
        errors.push('POSTGRES_HOST is required in production');
      }
      if (!process.env.POSTGRES_PASSWORD) {
        errors.push('POSTGRES_PASSWORD is required in production');
      }
      if (!process.env.COSMOS_DB_ENDPOINT) {
        errors.push('COSMOS_DB_ENDPOINT is required in production');
      }
      if (!process.env.COSMOS_DB_KEY) {
        errors.push('COSMOS_DB_KEY is required in production');
      }
      if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
        errors.push('AZURE_STORAGE_CONNECTION_STRING is required in production');
      }
      if (!process.env.APPLICATION_INSIGHTS_CONNECTION_STRING) {
        errors.push('APPLICATION_INSIGHTS_CONNECTION_STRING is required in production');
      }
    }

    // Validate database configuration
    if (this.config.database.postgres.port < 1 || this.config.database.postgres.port > 65535) {
      errors.push('Invalid PostgreSQL port number');
    }
    if (this.config.database.postgres.maxConnections < 1) {
      errors.push('PostgreSQL maxConnections must be at least 1');
    }
    if (this.config.database.cosmos.throughput < 400) {
      warnings.push('Cosmos DB throughput below 400 RU/s may cause throttling');
    }

    // Validate Redis configuration
    if (this.config.redis.port < 1 || this.config.redis.port > 65535) {
      errors.push('Invalid Redis port number');
    }

    // Validate security configuration
    if (this.config.security.rateLimiting.maxRequests < 1) {
      errors.push('Rate limit maxRequests must be at least 1');
    }
    if (this.config.security.ddosProtection.maxRequestsPerMinute < 1) {
      errors.push('DDoS protection maxRequestsPerMinute must be at least 1');
    }

    // Validate Azure configuration
    if (this.config.nodeEnv === 'production' && !this.config.azure.storage.connectionString) {
      errors.push('Azure Storage connection string is required in production');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get configuration
   */
  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  /**
   * Get configuration for specific environment
   */
  getConfigForEnvironment(env: EnvironmentConfig['nodeEnv']): EnvironmentConfig {
    if (env === this.config.nodeEnv) {
      return this.getConfig();
    }

    // Return development config as fallback
    return this.getDevelopmentConfig();
  }

  /**
   * Get development configuration
   */
  private getDevelopmentConfig(): EnvironmentConfig {
    return {
      nodeEnv: 'development',
      database: {
        postgres: {
          host: 'localhost',
          port: 5432,
          database: 'aegrid',
          username: 'postgres',
          password: 'postgres',
          ssl: false,
          maxConnections: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
        cosmos: {
          endpoint: 'https://localhost:8081',
          key: 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
          databaseId: 'aegrid-dev',
          containerId: 'assets',
          partitionKey: 'organisationId',
          throughput: 400,
          enableAutoscale: false,
          consistencyLevel: 'Session',
          enableMultiRegion: false,
        },
      },
      redis: {
        host: 'localhost',
        port: 6379,
        db: 0,
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
      },
      azure: {
        storage: {
          connectionString: '',
          containerName: 'documents',
          enableVersioning: true,
          enableSoftDelete: true,
        },
        applicationInsights: {
          connectionString: '',
          enableAutoCollection: false,
          enableConsoleLogging: true,
        },
      },
      security: {
        rateLimiting: {
          windowMs: 900000,
          maxRequests: 100,
          skipSuccessfulRequests: false,
          skipFailedRequests: false,
        },
        ddosProtection: {
          enabled: true,
          maxRequestsPerMinute: 60,
          maxRequestsPerHour: 1000,
          maxRequestsPerDay: 10000,
          blockDuration: 900000,
        },
      },
      monitoring: {
        enableMetrics: true,
        enableLogging: true,
        enableTracing: false,
        logLevel: 'debug',
      },
    };
  }

  /**
   * Get validation result
   */
  getValidationResult(): ConfigValidationResult {
    return this.validationResult || { isValid: false, errors: ['Configuration not validated'], warnings: [] };
  }

  /**
   * Check if configuration is valid
   */
  isValid(): boolean {
    return this.validationResult?.isValid || false;
  }

  /**
   * Get configuration summary
   */
  getConfigSummary(): {
    environment: string;
    database: {
      postgres: { host: string; port: number; database: string };
      cosmos: { endpoint: string; databaseId: string; containerId: string };
    };
    redis: { host: string; port: number };
    azure: { storage: { containerName: string }; applicationInsights: { enabled: boolean } };
    security: { rateLimiting: { enabled: boolean }; ddosProtection: { enabled: boolean } };
    monitoring: { metrics: boolean; logging: boolean; tracing: boolean };
  } {
    return {
      environment: this.config.nodeEnv,
      database: {
        postgres: {
          host: this.config.database.postgres.host,
          port: this.config.database.postgres.port,
          database: this.config.database.postgres.database,
        },
        cosmos: {
          endpoint: this.config.database.cosmos.endpoint,
          databaseId: this.config.database.cosmos.databaseId,
          containerId: this.config.database.cosmos.containerId,
        },
      },
      redis: {
        host: this.config.redis.host,
        port: this.config.redis.port,
      },
      azure: {
        storage: {
          containerName: this.config.azure.storage.containerName,
        },
        applicationInsights: {
          enabled: !!this.config.azure.applicationInsights.connectionString,
        },
      },
      security: {
        rateLimiting: {
          enabled: this.config.security.rateLimiting.maxRequests > 0,
        },
        ddosProtection: {
          enabled: this.config.security.ddosProtection.enabled,
        },
      },
      monitoring: {
        metrics: this.config.monitoring.enableMetrics,
        logging: this.config.monitoring.enableLogging,
        tracing: this.config.monitoring.enableTracing,
      },
    };
  }
}

// Export singleton instance
export const environmentConfigManager = new EnvironmentConfigManager();
