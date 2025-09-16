/**
 * Real-time Data Synchronization Service
 * 
 * Implements robust data synchronization between PostgreSQL and Cosmos DB
 * 
 * @fileoverview Real-time data synchronization service
 */

import { PoolClient } from 'pg';
import { CosmosClient } from '@azure/cosmos';
import { GremlinClient } from 'gremlin';
import { EventEmitter } from 'events';

export interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  recordId: string;
  data: Record<string, any>;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retry';
  retryCount: number;
  error?: string;
}

export interface SyncConfig {
  enabled: boolean;
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
  maxRetryDelay: number;
  conflictResolution: 'postgres_wins' | 'cosmos_wins' | 'timestamp_wins' | 'manual';
  enableRealTimeSync: boolean;
  enableBatchSync: boolean;
  syncInterval: number;
}

export interface SyncMetrics {
  totalEvents: number;
  successfulSyncs: number;
  failedSyncs: number;
  pendingSyncs: number;
  averageSyncTime: number;
  lastSyncTime: Date;
  syncRate: number; // events per minute
}

export interface ConflictResolution {
  id: string;
  table: string;
  recordId: string;
  postgresData: Record<string, any>;
  cosmosData: Record<string, any>;
  conflictType: 'data_mismatch' | 'timestamp_conflict' | 'deletion_conflict';
  resolution: 'postgres_wins' | 'cosmos_wins' | 'merge' | 'manual';
  resolvedAt?: Date;
  resolvedBy?: string;
}

export class DataSynchronizationService extends EventEmitter {
  private postgresClient: PoolClient;
  private cosmosClient: CosmosClient;
  private gremlinClient: GremlinClient;
  private config: SyncConfig;
  private metrics: SyncMetrics;
  private syncQueue: SyncEvent[] = [];
  private isProcessing: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private conflicts: ConflictResolution[] = [];

  constructor(
    postgresClient: PoolClient,
    cosmosClient: CosmosClient,
    gremlinClient: GremlinClient,
    config: SyncConfig
  ) {
    super();
    this.postgresClient = postgresClient;
    this.cosmosClient = cosmosClient;
    this.gremlinClient = gremlinClient;
    this.config = config;
    this.metrics = {
      totalEvents: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      pendingSyncs: 0,
      averageSyncTime: 0,
      lastSyncTime: new Date(),
      syncRate: 0,
    };
  }

  /**
   * Initialize synchronization service
   */
  async initialize(): Promise<void> {
    try {
      // Create sync tables if they don't exist
      await this.createSyncTables();
      
      // Start sync processing
      if (this.config.enabled) {
        this.startSyncProcessing();
      }

      console.log('Data synchronization service initialized');
    } catch (error) {
      console.error('Failed to initialize data synchronization service:', error);
      throw error;
    }
  }

  /**
   * Create synchronization tables
   */
  private async createSyncTables(): Promise<void> {
    const createSyncEventsTable = `
      CREATE TABLE IF NOT EXISTS sync_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(20) NOT NULL,
        table_name VARCHAR(100) NOT NULL,
        record_id VARCHAR(100) NOT NULL,
        data JSONB NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        status VARCHAR(20) DEFAULT 'pending',
        retry_count INTEGER DEFAULT 0,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createSyncConflictsTable = `
      CREATE TABLE IF NOT EXISTS sync_conflicts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        table_name VARCHAR(100) NOT NULL,
        record_id VARCHAR(100) NOT NULL,
        postgres_data JSONB NOT NULL,
        cosmos_data JSONB NOT NULL,
        conflict_type VARCHAR(50) NOT NULL,
        resolution VARCHAR(20),
        resolved_at TIMESTAMP,
        resolved_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_sync_events_status ON sync_events(status);
      CREATE INDEX IF NOT EXISTS idx_sync_events_table_record ON sync_events(table_name, record_id);
      CREATE INDEX IF NOT EXISTS idx_sync_conflicts_resolution ON sync_conflicts(resolution);
    `;

    await this.postgresClient.query(createSyncEventsTable);
    await this.postgresClient.query(createSyncConflictsTable);
    await this.postgresClient.query(createIndexes);
  }

  /**
   * Add sync event
   */
  async addSyncEvent(event: Omit<SyncEvent, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<string> {
    const syncEvent: SyncEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
    };

    // Insert into database
    const insertQuery = `
      INSERT INTO sync_events (id, type, table_name, record_id, data, timestamp, status, retry_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    await this.postgresClient.query(insertQuery, [
      syncEvent.id,
      syncEvent.type,
      syncEvent.table,
      syncEvent.recordId,
      JSON.stringify(syncEvent.data),
      syncEvent.timestamp,
      syncEvent.status,
      syncEvent.retryCount,
    ]);

    this.syncQueue.push(syncEvent);
    this.metrics.totalEvents++;
    this.metrics.pendingSyncs++;

    this.emit('syncEventAdded', syncEvent);

    return syncEvent.id;
  }

  /**
   * Process sync events
   */
  private async processSyncEvents(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const batch = this.syncQueue.splice(0, this.config.batchSize);
      
      for (const event of batch) {
        await this.processSyncEvent(event);
      }

      this.updateSyncRate();
    } catch (error) {
      console.error('Error processing sync events:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process individual sync event
   */
  private async processSyncEvent(event: SyncEvent): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Update event status to processing
      await this.updateEventStatus(event.id, 'processing');

      // Process based on event type
      switch (event.type) {
        case 'create':
          await this.syncCreate(event);
          break;
        case 'update':
          await this.syncUpdate(event);
          break;
        case 'delete':
          await this.syncDelete(event);
          break;
      }

      // Update event status to completed
      await this.updateEventStatus(event.id, 'completed');
      
      this.metrics.successfulSyncs++;
      this.metrics.pendingSyncs--;
      
      const syncTime = Date.now() - startTime;
      this.updateAverageSyncTime(syncTime);

      this.emit('syncEventCompleted', event);
    } catch (error) {
      await this.handleSyncError(event, error);
    }
  }

  /**
   * Sync create operation
   */
  private async syncCreate(event: SyncEvent): Promise<void> {
    const { table, recordId, data } = event;

    // Create vertex in Cosmos DB
    const gremlinQuery = `
      g.addV('${table}')
        .property('id', '${recordId}')
        .property('data', '${JSON.stringify(data)}')
        .property('createdAt', '${new Date().toISOString()}')
        .property('updatedAt', '${new Date().toISOString()}')
    `;

    await this.gremlinClient.submit(gremlinQuery);
  }

  /**
   * Sync update operation
   */
  private async syncUpdate(event: SyncEvent): Promise<void> {
    const { table, recordId, data } = event;

    // Update vertex in Cosmos DB
    const gremlinQuery = `
      g.V().has('id', '${recordId}')
        .property('data', '${JSON.stringify(data)}')
        .property('updatedAt', '${new Date().toISOString()}')
    `;

    await this.gremlinClient.submit(gremlinQuery);
  }

  /**
   * Sync delete operation
   */
  private async syncDelete(event: SyncEvent): Promise<void> {
    const { recordId } = event;

    // Delete vertex from Cosmos DB
    const gremlinQuery = `g.V().has('id', '${recordId}').drop()`;

    await this.gremlinClient.submit(gremlinQuery);
  }

  /**
   * Handle sync error
   */
  private async handleSyncError(event: SyncEvent, error: any): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (event.retryCount < this.config.retryAttempts) {
      // Retry the event
      event.retryCount++;
      event.status = 'retry';
      event.error = errorMessage;
      
      await this.updateEventStatus(event.id, 'retry', errorMessage);
      
      // Add back to queue with delay
      setTimeout(() => {
        this.syncQueue.push(event);
      }, this.calculateRetryDelay(event.retryCount));
      
      this.emit('syncEventRetry', event);
    } else {
      // Mark as failed
      await this.updateEventStatus(event.id, 'failed', errorMessage);
      
      this.metrics.failedSyncs++;
      this.metrics.pendingSyncs--;
      
      this.emit('syncEventFailed', event);
    }
  }

  /**
   * Update event status
   */
  private async updateEventStatus(
    eventId: string,
    status: SyncEvent['status'],
    errorMessage?: string
  ): Promise<void> {
    const updateQuery = `
      UPDATE sync_events 
      SET status = $1, error_message = $2, updated_at = NOW()
      WHERE id = $3
    `;

    await this.postgresClient.query(updateQuery, [status, errorMessage, eventId]);
  }

  /**
   * Calculate retry delay
   */
  private calculateRetryDelay(retryCount: number): number {
    const delay = this.config.retryDelay * Math.pow(2, retryCount - 1);
    return Math.min(delay, this.config.maxRetryDelay);
  }

  /**
   * Update average sync time
   */
  private updateAverageSyncTime(syncTime: number): void {
    const totalSyncs = this.metrics.successfulSyncs + this.metrics.failedSyncs;
    if (totalSyncs > 0) {
      this.metrics.averageSyncTime = 
        (this.metrics.averageSyncTime * (totalSyncs - 1) + syncTime) / totalSyncs;
    }
  }

  /**
   * Update sync rate
   */
  private updateSyncRate(): void {
    const now = new Date();
    const timeDiff = now.getTime() - this.metrics.lastSyncTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff > 0) {
      this.metrics.syncRate = this.metrics.totalEvents / minutesDiff;
    }
    
    this.metrics.lastSyncTime = now;
  }

  /**
   * Start sync processing
   */
  private startSyncProcessing(): void {
    if (this.config.enableRealTimeSync) {
      // Process events immediately
      this.on('syncEventAdded', () => {
        this.processSyncEvents();
      });
    }

    if (this.config.enableBatchSync) {
      // Process events in batches
      this.syncInterval = setInterval(() => {
        this.processSyncEvents();
      }, this.config.syncInterval);
    }
  }

  /**
   * Stop sync processing
   */
  stopSyncProcessing(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Get sync metrics
   */
  getMetrics(): SyncMetrics {
    return { ...this.metrics };
  }

  /**
   * Get pending sync events
   */
  async getPendingSyncEvents(): Promise<SyncEvent[]> {
    const query = `
      SELECT id, type, table_name, record_id, data, timestamp, status, retry_count, error_message
      FROM sync_events
      WHERE status IN ('pending', 'retry')
      ORDER BY timestamp ASC
    `;

    const result = await this.postgresClient.query(query);
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      table: row.table_name,
      recordId: row.record_id,
      data: row.data,
      timestamp: row.timestamp,
      status: row.status,
      retryCount: row.retry_count,
      error: row.error_message,
    }));
  }

  /**
   * Get sync conflicts
   */
  async getSyncConflicts(): Promise<ConflictResolution[]> {
    const query = `
      SELECT id, table_name, record_id, postgres_data, cosmos_data, 
             conflict_type, resolution, resolved_at, resolved_by
      FROM sync_conflicts
      WHERE resolution IS NULL
      ORDER BY created_at DESC
    `;

    const result = await this.postgresClient.query(query);
    return result.rows.map(row => ({
      id: row.id,
      table: row.table_name,
      recordId: row.record_id,
      postgresData: row.postgres_data,
      cosmosData: row.cosmos_data,
      conflictType: row.conflict_type,
      resolution: row.resolution,
      resolvedAt: row.resolved_at,
      resolvedBy: row.resolved_by,
    }));
  }

  /**
   * Resolve conflict
   */
  async resolveConflict(
    conflictId: string,
    resolution: ConflictResolution['resolution'],
    resolvedBy: string
  ): Promise<void> {
    const updateQuery = `
      UPDATE sync_conflicts 
      SET resolution = $1, resolved_at = NOW(), resolved_by = $2
      WHERE id = $3
    `;

    await this.postgresClient.query(updateQuery, [resolution, resolvedBy, conflictId]);
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup old sync events
   */
  async cleanupOldEvents(daysToKeep: number = 30): Promise<void> {
    const deleteQuery = `
      DELETE FROM sync_events 
      WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
      AND status IN ('completed', 'failed')
    `;

    await this.postgresClient.query(deleteQuery);
  }
}

// Export default sync configuration
export const DEFAULT_SYNC_CONFIG: SyncConfig = {
  enabled: true,
  batchSize: 100,
  retryAttempts: 3,
  retryDelay: 1000,
  maxRetryDelay: 30000,
  conflictResolution: 'timestamp_wins',
  enableRealTimeSync: true,
  enableBatchSync: true,
  syncInterval: 5000, // 5 seconds
};
