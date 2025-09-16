/**
 * Batch Synchronization Processes
 * 
 * Implements batch synchronization for large data sets and initial migration
 * 
 * @fileoverview Batch synchronization processes
 */

import { PoolClient } from 'pg';
import { CosmosClient } from '@azure/cosmos';
import { GremlinClient } from 'gremlin';

export interface BatchSyncConfig {
  batchSize: number;
  maxConcurrency: number;
  retryAttempts: number;
  retryDelay: number;
  enableProgressTracking: boolean;
  enableResume: boolean;
}

export interface BatchSyncJob {
  id: string;
  name: string;
  description: string;
  sourceTable: string;
  targetContainer: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: {
    totalRecords: number;
    processedRecords: number;
    failedRecords: number;
    percentage: number;
  };
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  config: BatchSyncConfig;
}

export interface BatchSyncResult {
  jobId: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  duration: number;
  averageTimePerRecord: number;
  errors: BatchSyncError[];
}

export interface BatchSyncError {
  recordId: string;
  error: string;
  timestamp: Date;
  retryCount: number;
}

export class BatchSynchronizationService {
  private postgresClient: PoolClient;
  private cosmosClient: CosmosClient;
  private gremlinClient: GremlinClient;
  private activeJobs: Map<string, BatchSyncJob> = new Map();
  private jobResults: Map<string, BatchSyncResult> = new Map();

  constructor(
    postgresClient: PoolClient,
    cosmosClient: CosmosClient,
    gremlinClient: GremlinClient
  ) {
    this.postgresClient = postgresClient;
    this.cosmosClient = cosmosClient;
    this.gremlinClient = gremlinClient;
  }

  /**
   * Create batch sync job
   */
  async createBatchSyncJob(
    name: string,
    description: string,
    sourceTable: string,
    targetContainer: string,
    config: BatchSyncConfig
  ): Promise<string> {
    const jobId = this.generateJobId();
    
    const job: BatchSyncJob = {
      id: jobId,
      name,
      description,
      sourceTable,
      targetContainer,
      status: 'pending',
      progress: {
        totalRecords: 0,
        processedRecords: 0,
        failedRecords: 0,
        percentage: 0,
      },
      config,
    };

    this.activeJobs.set(jobId, job);
    
    // Get total record count
    const countQuery = `SELECT COUNT(*) FROM ${sourceTable}`;
    const countResult = await this.postgresClient.query(countQuery);
    job.progress.totalRecords = parseInt(countResult.rows[0].count);

    return jobId;
  }

  /**
   * Execute batch sync job
   */
  async executeBatchSyncJob(jobId: string): Promise<BatchSyncResult> {
    const job = this.activeJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    if (job.status === 'running') {
      throw new Error(`Job ${jobId} is already running`);
    }

    job.status = 'running';
    job.startedAt = new Date();

    const startTime = Date.now();
    const errors: BatchSyncError[] = [];
    let successfulRecords = 0;
    let failedRecords = 0;

    try {
      // Process records in batches
      const offset = job.progress.processedRecords;
      const limit = job.config.batchSize;

      while (job.progress.processedRecords < job.progress.totalRecords) {
        const batch = await this.fetchBatch(job.sourceTable, offset, limit);
        
        if (batch.length === 0) {
          break;
        }

        // Process batch concurrently
        const batchPromises = batch.map(record => 
          this.processRecord(record, job.targetContainer)
        );

        const batchResults = await Promise.allSettled(batchPromises);
        
        // Count results
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulRecords++;
          } else {
            failedRecords++;
            errors.push({
              recordId: batch[index].id || `unknown_${index}`,
              error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
              timestamp: new Date(),
              retryCount: 0,
            });
          }
        });

        // Update progress
        job.progress.processedRecords += batch.length;
        job.progress.failedRecords = failedRecords;
        job.progress.percentage = (job.progress.processedRecords / job.progress.totalRecords) * 100;

        // Check if job should be paused
        if (job.status === 'paused') {
          break;
        }
      }

      // Mark job as completed
      if (job.status === 'running') {
        job.status = 'completed';
        job.completedAt = new Date();
      }

    } catch (error) {
      job.status = 'failed';
      job.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }

    const duration = Date.now() - startTime;
    const result: BatchSyncResult = {
      jobId,
      totalRecords: job.progress.totalRecords,
      successfulRecords,
      failedRecords,
      duration,
      averageTimePerRecord: duration / job.progress.totalRecords,
      errors,
    };

    this.jobResults.set(jobId, result);
    return result;
  }

  /**
   * Fetch batch of records
   */
  private async fetchBatch(
    tableName: string,
    offset: number,
    limit: number
  ): Promise<Record<string, any>[]> {
    const query = `
      SELECT * FROM ${tableName}
      ORDER BY id
      OFFSET $1 LIMIT $2
    `;

    const result = await this.postgresClient.query(query, [offset, limit]);
    return result.rows;
  }

  /**
   * Process individual record
   */
  private async processRecord(
    record: Record<string, any>,
    targetContainer: string
  ): Promise<void> {
    try {
      // Transform record for Cosmos DB
      const transformedRecord = this.transformRecord(record);
      
      // Create vertex in Cosmos DB
      const gremlinQuery = this.buildGremlinQuery(transformedRecord, targetContainer);
      await this.gremlinClient.submit(gremlinQuery);
      
    } catch (error) {
      throw new Error(`Failed to process record ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transform record for Cosmos DB
   */
  private transformRecord(record: Record<string, any>): Record<string, any> {
    // Remove PostgreSQL-specific fields
    const transformed = { ...record };
    delete transformed.created_at;
    delete transformed.updated_at;
    
    // Add Cosmos DB-specific fields
    transformed.createdAt = record.created_at || new Date().toISOString();
    transformed.updatedAt = record.updated_at || new Date().toISOString();
    
    return transformed;
  }

  /**
   * Build Gremlin query
   */
  private buildGremlinQuery(record: Record<string, any>, targetContainer: string): string {
    const properties = Object.entries(record)
      .map(([key, value]) => `.property('${key}', '${JSON.stringify(value)}')`)
      .join('');

    return `
      g.addV('${targetContainer}')
        .property('id', '${record.id}')
        ${properties}
    `;
  }

  /**
   * Pause batch sync job
   */
  async pauseBatchSyncJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    if (job.status === 'running') {
      job.status = 'paused';
    }
  }

  /**
   * Resume batch sync job
   */
  async resumeBatchSyncJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    if (job.status === 'paused') {
      await this.executeBatchSyncJob(jobId);
    }
  }

  /**
   * Cancel batch sync job
   */
  async cancelBatchSyncJob(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = 'failed';
    job.errorMessage = 'Job cancelled by user';
  }

  /**
   * Get batch sync job status
   */
  getBatchSyncJobStatus(jobId: string): BatchSyncJob | null {
    return this.activeJobs.get(jobId) || null;
  }

  /**
   * Get batch sync job result
   */
  getBatchSyncJobResult(jobId: string): BatchSyncResult | null {
    return this.jobResults.get(jobId) || null;
  }

  /**
   * List all batch sync jobs
   */
  listBatchSyncJobs(): BatchSyncJob[] {
    return Array.from(this.activeJobs.values());
  }

  /**
   * Get active batch sync jobs
   */
  getActiveBatchSyncJobs(): BatchSyncJob[] {
    return Array.from(this.activeJobs.values()).filter(job => 
      job.status === 'running' || job.status === 'paused'
    );
  }

  /**
   * Cleanup completed jobs
   */
  async cleanupCompletedJobs(daysToKeep: number = 7): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    for (const [jobId, job] of this.activeJobs.entries()) {
      if (job.status === 'completed' && job.completedAt && job.completedAt < cutoffDate) {
        this.activeJobs.delete(jobId);
        this.jobResults.delete(jobId);
      }
    }
  }

  /**
   * Generate job ID
   */
  private generateJobId(): string {
    return `batch_sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Migrate all assets to Cosmos DB
   */
  async migrateAllAssets(): Promise<BatchSyncResult> {
    const jobId = await this.createBatchSyncJob(
      'Migrate All Assets',
      'Migrate all assets from PostgreSQL to Cosmos DB',
      'assets',
      'asset',
      {
        batchSize: 1000,
        maxConcurrency: 10,
        retryAttempts: 3,
        retryDelay: 1000,
        enableProgressTracking: true,
        enableResume: true,
      }
    );

    return await this.executeBatchSyncJob(jobId);
  }

  /**
   * Migrate all work orders to Cosmos DB
   */
  async migrateAllWorkOrders(): Promise<BatchSyncResult> {
    const jobId = await this.createBatchSyncJob(
      'Migrate All Work Orders',
      'Migrate all work orders from PostgreSQL to Cosmos DB',
      'work_orders',
      'work_order',
      {
        batchSize: 500,
        maxConcurrency: 5,
        retryAttempts: 3,
        retryDelay: 1000,
        enableProgressTracking: true,
        enableResume: true,
      }
    );

    return await this.executeBatchSyncJob(jobId);
  }

  /**
   * Migrate all users to Cosmos DB
   */
  async migrateAllUsers(): Promise<BatchSyncResult> {
    const jobId = await this.createBatchSyncJob(
      'Migrate All Users',
      'Migrate all users from PostgreSQL to Cosmos DB',
      'users',
      'user',
      {
        batchSize: 100,
        maxConcurrency: 3,
        retryAttempts: 3,
        retryDelay: 1000,
        enableProgressTracking: true,
        enableResume: true,
      }
    );

    return await this.executeBatchSyncJob(jobId);
  }
}

// Export default batch sync configuration
export const DEFAULT_BATCH_SYNC_CONFIG: BatchSyncConfig = {
  batchSize: 1000,
  maxConcurrency: 10,
  retryAttempts: 3,
  retryDelay: 1000,
  enableProgressTracking: true,
  enableResume: true,
};
