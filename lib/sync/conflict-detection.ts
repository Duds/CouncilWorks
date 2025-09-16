/**
 * Conflict Detection and Resolution
 * 
 * Implements conflict detection and resolution for data synchronization
 * 
 * @fileoverview Conflict detection and resolution system
 */

import { PoolClient } from 'pg';
import { CosmosClient } from '@azure/cosmos';
import { GremlinClient } from 'gremlin';

export interface ConflictDetectionRule {
  id: string;
  name: string;
  description: string;
  table: string;
  conditions: ConflictCondition[];
  resolutionStrategy: 'postgres_wins' | 'cosmos_wins' | 'timestamp_wins' | 'merge' | 'manual';
  enabled: boolean;
}

export interface ConflictCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
}

export interface DataConflict {
  id: string;
  table: string;
  recordId: string;
  conflictType: 'data_mismatch' | 'timestamp_conflict' | 'deletion_conflict' | 'constraint_violation';
  postgresData: Record<string, any>;
  cosmosData: Record<string, any>;
  conflictFields: string[];
  detectedAt: Date;
  resolvedAt?: Date;
  resolution?: ConflictResolution;
  status: 'detected' | 'resolving' | 'resolved' | 'failed';
}

export interface ConflictResolution {
  strategy: 'postgres_wins' | 'cosmos_wins' | 'timestamp_wins' | 'merge' | 'manual';
  resolvedData: Record<string, any>;
  resolvedBy: string;
  resolvedAt: Date;
  notes?: string;
}

export interface ConflictMetrics {
  totalConflicts: number;
  resolvedConflicts: number;
  unresolvedConflicts: number;
  conflictsByType: Record<string, number>;
  conflictsByTable: Record<string, number>;
  averageResolutionTime: number;
  lastConflictDetected: Date;
}

export class ConflictDetectionService {
  private postgresClient: PoolClient;
  private cosmosClient: CosmosClient;
  private gremlinClient: GremlinClient;
  private detectionRules: ConflictDetectionRule[] = [];
  private metrics: ConflictMetrics;

  constructor(
    postgresClient: PoolClient,
    cosmosClient: CosmosClient,
    gremlinClient: GremlinClient
  ) {
    this.postgresClient = postgresClient;
    this.cosmosClient = cosmosClient;
    this.gremlinClient = gremlinClient;
    this.metrics = {
      totalConflicts: 0,
      resolvedConflicts: 0,
      unresolvedConflicts: 0,
      conflictsByType: {},
      conflictsByTable: {},
      averageResolutionTime: 0,
      lastConflictDetected: new Date(),
    };
  }

  /**
   * Initialize conflict detection service
   */
  async initialize(): Promise<void> {
    await this.createConflictTables();
    await this.loadDetectionRules();
    console.log('Conflict detection service initialized');
  }

  /**
   * Create conflict detection tables
   */
  private async createConflictTables(): Promise<void> {
    const createConflictsTable = `
      CREATE TABLE IF NOT EXISTS data_conflicts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        table_name VARCHAR(100) NOT NULL,
        record_id VARCHAR(100) NOT NULL,
        conflict_type VARCHAR(50) NOT NULL,
        postgres_data JSONB NOT NULL,
        cosmos_data JSONB NOT NULL,
        conflict_fields TEXT[] NOT NULL,
        detected_at TIMESTAMP DEFAULT NOW(),
        resolved_at TIMESTAMP,
        resolution JSONB,
        status VARCHAR(20) DEFAULT 'detected',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createDetectionRulesTable = `
      CREATE TABLE IF NOT EXISTS conflict_detection_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        table_name VARCHAR(100) NOT NULL,
        conditions JSONB NOT NULL,
        resolution_strategy VARCHAR(50) NOT NULL,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_conflicts_table_record ON data_conflicts(table_name, record_id);
      CREATE INDEX IF NOT EXISTS idx_conflicts_status ON data_conflicts(status);
      CREATE INDEX IF NOT EXISTS idx_conflicts_type ON data_conflicts(conflict_type);
      CREATE INDEX IF NOT EXISTS idx_detection_rules_table ON conflict_detection_rules(table_name);
    `;

    await this.postgresClient.query(createConflictsTable);
    await this.postgresClient.query(createDetectionRulesTable);
    await this.postgresClient.query(createIndexes);
  }

  /**
   * Load detection rules
   */
  private async loadDetectionRules(): Promise<void> {
    const query = `
      SELECT id, name, description, table_name, conditions, resolution_strategy, enabled
      FROM conflict_detection_rules
      WHERE enabled = true
    `;

    const result = await this.postgresClient.query(query);
    this.detectionRules = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      table: row.table_name,
      conditions: row.conditions,
      resolutionStrategy: row.resolution_strategy,
      enabled: row.enabled,
    }));
  }

  /**
   * Detect conflicts for a specific record
   */
  async detectConflicts(
    table: string,
    recordId: string
  ): Promise<DataConflict[]> {
    const conflicts: DataConflict[] = [];

    try {
      // Get data from both databases
      const postgresData = await this.getPostgresData(table, recordId);
      const cosmosData = await this.getCosmosData(table, recordId);

      if (!postgresData && !cosmosData) {
        return conflicts; // No data in either database
      }

      if (!postgresData || !cosmosData) {
        // Deletion conflict
        conflicts.push({
          id: this.generateConflictId(),
          table,
          recordId,
          conflictType: 'deletion_conflict',
          postgresData: postgresData || {},
          cosmosData: cosmosData || {},
          conflictFields: ['existence'],
          detectedAt: new Date(),
          status: 'detected',
        });
        return conflicts;
      }

      // Check for data mismatches
      const dataConflicts = this.detectDataMismatches(
        table,
        recordId,
        postgresData,
        cosmosData
      );
      conflicts.push(...dataConflicts);

      // Check for timestamp conflicts
      const timestampConflicts = this.detectTimestampConflicts(
        table,
        recordId,
        postgresData,
        cosmosData
      );
      conflicts.push(...timestampConflicts);

      // Store conflicts in database
      for (const conflict of conflicts) {
        await this.storeConflict(conflict);
        this.updateMetrics(conflict);
      }

    } catch (error) {
      console.error(`Error detecting conflicts for ${table}.${recordId}:`, error);
    }

    return conflicts;
  }

  /**
   * Detect data mismatches
   */
  private detectDataMismatches(
    table: string,
    recordId: string,
    postgresData: Record<string, any>,
    cosmosData: Record<string, any>
  ): DataConflict[] {
    const conflicts: DataConflict[] = [];
    const conflictFields: string[] = [];

    // Compare all fields
    const allFields = new Set([
      ...Object.keys(postgresData),
      ...Object.keys(cosmosData)
    ]);

    for (const field of allFields) {
      const postgresValue = postgresData[field];
      const cosmosValue = cosmosData[field];

      if (!this.valuesEqual(postgresValue, cosmosValue)) {
        conflictFields.push(field);
      }
    }

    if (conflictFields.length > 0) {
      conflicts.push({
        id: this.generateConflictId(),
        table,
        recordId,
        conflictType: 'data_mismatch',
        postgresData,
        cosmosData,
        conflictFields,
        detectedAt: new Date(),
        status: 'detected',
      });
    }

    return conflicts;
  }

  /**
   * Detect timestamp conflicts
   */
  private detectTimestampConflicts(
    table: string,
    recordId: string,
    postgresData: Record<string, any>,
    cosmosData: Record<string, any>
  ): DataConflict[] {
    const conflicts: DataConflict[] = [];

    const postgresTimestamp = postgresData.updated_at || postgresData.created_at;
    const cosmosTimestamp = cosmosData.updatedAt || cosmosData.createdAt;

    if (postgresTimestamp && cosmosTimestamp) {
      const postgresTime = new Date(postgresTimestamp).getTime();
      const cosmosTime = new Date(cosmosTimestamp).getTime();
      const timeDiff = Math.abs(postgresTime - cosmosTime);

      // If timestamps differ by more than 1 second, consider it a conflict
      if (timeDiff > 1000) {
        conflicts.push({
          id: this.generateConflictId(),
          table,
          recordId,
          conflictType: 'timestamp_conflict',
          postgresData,
          cosmosData,
          conflictFields: ['updated_at', 'updatedAt'],
          detectedAt: new Date(),
          status: 'detected',
        });
      }
    }

    return conflicts;
  }

  /**
   * Resolve conflict
   */
  async resolveConflict(
    conflictId: string,
    resolution: ConflictResolution
  ): Promise<void> {
    try {
      // Get conflict
      const conflict = await this.getConflict(conflictId);
      if (!conflict) {
        throw new Error(`Conflict ${conflictId} not found`);
      }

      // Update conflict status
      await this.updateConflictStatus(conflictId, 'resolving');

      // Apply resolution based on strategy
      switch (resolution.strategy) {
        case 'postgres_wins':
          await this.applyPostgresResolution(conflict, resolution);
          break;
        case 'cosmos_wins':
          await this.applyCosmosResolution(conflict, resolution);
          break;
        case 'timestamp_wins':
          await this.applyTimestampResolution(conflict, resolution);
          break;
        case 'merge':
          await this.applyMergeResolution(conflict, resolution);
          break;
        case 'manual':
          await this.applyManualResolution(conflict, resolution);
          break;
      }

      // Update conflict status
      await this.updateConflictStatus(conflictId, 'resolved', resolution);
      this.metrics.resolvedConflicts++;
      this.metrics.unresolvedConflicts--;

    } catch (error) {
      await this.updateConflictStatus(conflictId, 'failed');
      throw error;
    }
  }

  /**
   * Apply PostgreSQL resolution
   */
  private async applyPostgresResolution(
    conflict: DataConflict,
    resolution: ConflictResolution
  ): Promise<void> {
    // Update Cosmos DB with PostgreSQL data
    const gremlinQuery = this.buildUpdateQuery(conflict.recordId, resolution.resolvedData);
    await this.gremlinClient.submit(gremlinQuery);
  }

  /**
   * Apply Cosmos DB resolution
   */
  private async applyCosmosResolution(
    conflict: DataConflict,
    resolution: ConflictResolution
  ): Promise<void> {
    // Update PostgreSQL with Cosmos DB data
    const updateQuery = this.buildPostgresUpdateQuery(
      conflict.table,
      conflict.recordId,
      resolution.resolvedData
    );
    await this.postgresClient.query(updateQuery);
  }

  /**
   * Apply timestamp-based resolution
   */
  private async applyTimestampResolution(
    conflict: DataConflict,
    resolution: ConflictResolution
  ): Promise<void> {
    const postgresTime = new Date(conflict.postgresData.updated_at || conflict.postgresData.created_at).getTime();
    const cosmosTime = new Date(conflict.cosmosData.updatedAt || conflict.cosmosData.createdAt).getTime();

    if (postgresTime > cosmosTime) {
      await this.applyPostgresResolution(conflict, resolution);
    } else {
      await this.applyCosmosResolution(conflict, resolution);
    }
  }

  /**
   * Apply merge resolution
   */
  private async applyMergeResolution(
    conflict: DataConflict,
    resolution: ConflictResolution
  ): Promise<void> {
    // Update both databases with merged data
    await this.applyPostgresResolution(conflict, resolution);
    await this.applyCosmosResolution(conflict, resolution);
  }

  /**
   * Apply manual resolution
   */
  private async applyManualResolution(
    conflict: DataConflict,
    resolution: ConflictResolution
  ): Promise<void> {
    // Apply the manually resolved data to both databases
    await this.applyPostgresResolution(conflict, resolution);
    await this.applyCosmosResolution(conflict, resolution);
  }

  /**
   * Get PostgreSQL data
   */
  private async getPostgresData(
    table: string,
    recordId: string
  ): Promise<Record<string, any> | null> {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await this.postgresClient.query(query, [recordId]);
    return result.rows[0] || null;
  }

  /**
   * Get Cosmos DB data
   */
  private async getCosmosData(
    table: string,
    recordId: string
  ): Promise<Record<string, any> | null> {
    try {
      const gremlinQuery = `g.V().has('id', '${recordId}').valueMap(true)`;
      const result = await this.gremlinClient.submit(gremlinQuery);
      return result._items?.[0] || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store conflict in database
   */
  private async storeConflict(conflict: DataConflict): Promise<void> {
    const insertQuery = `
      INSERT INTO data_conflicts (
        id, table_name, record_id, conflict_type, postgres_data, cosmos_data,
        conflict_fields, detected_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    await this.postgresClient.query(insertQuery, [
      conflict.id,
      conflict.table,
      conflict.recordId,
      conflict.conflictType,
      JSON.stringify(conflict.postgresData),
      JSON.stringify(conflict.cosmosData),
      conflict.conflictFields,
      conflict.detectedAt,
      conflict.status,
    ]);
  }

  /**
   * Update conflict status
   */
  private async updateConflictStatus(
    conflictId: string,
    status: DataConflict['status'],
    resolution?: ConflictResolution
  ): Promise<void> {
    const updateQuery = `
      UPDATE data_conflicts 
      SET status = $1, resolved_at = $2, resolution = $3, updated_at = NOW()
      WHERE id = $4
    `;

    await this.postgresClient.query(updateQuery, [
      status,
      status === 'resolved' ? new Date() : null,
      resolution ? JSON.stringify(resolution) : null,
      conflictId,
    ]);
  }

  /**
   * Get conflict by ID
   */
  private async getConflict(conflictId: string): Promise<DataConflict | null> {
    const query = `
      SELECT id, table_name, record_id, conflict_type, postgres_data, cosmos_data,
             conflict_fields, detected_at, resolved_at, resolution, status
      FROM data_conflicts
      WHERE id = $1
    `;

    const result = await this.postgresClient.query(query, [conflictId]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      table: row.table_name,
      recordId: row.record_id,
      conflictType: row.conflict_type,
      postgresData: row.postgres_data,
      cosmosData: row.cosmos_data,
      conflictFields: row.conflict_fields,
      detectedAt: row.detected_at,
      resolvedAt: row.resolved_at,
      resolution: row.resolution,
      status: row.status,
    };
  }

  /**
   * Build Gremlin update query
   */
  private buildUpdateQuery(recordId: string, data: Record<string, any>): string {
    const properties = Object.entries(data)
      .map(([key, value]) => `.property('${key}', '${JSON.stringify(value)}')`)
      .join('');

    return `
      g.V().has('id', '${recordId}')
        ${properties}
        .property('updatedAt', '${new Date().toISOString()}')
    `;
  }

  /**
   * Build PostgreSQL update query
   */
  private buildPostgresUpdateQuery(
    table: string,
    recordId: string,
    data: Record<string, any>
  ): string {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    return `
      UPDATE ${table} 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
    `;
  }

  /**
   * Check if two values are equal
   */
  private valuesEqual(value1: any, value2: any): boolean {
    if (value1 === value2) {
      return true;
    }

    if (value1 === null || value2 === null) {
      return value1 === value2;
    }

    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return JSON.stringify(value1) === JSON.stringify(value2);
    }

    return false;
  }

  /**
   * Update metrics
   */
  private updateMetrics(conflict: DataConflict): void {
    this.metrics.totalConflicts++;
    this.metrics.unresolvedConflicts++;
    this.metrics.lastConflictDetected = conflict.detectedAt;

    // Update conflicts by type
    this.metrics.conflictsByType[conflict.conflictType] = 
      (this.metrics.conflictsByType[conflict.conflictType] || 0) + 1;

    // Update conflicts by table
    this.metrics.conflictsByTable[conflict.table] = 
      (this.metrics.conflictsByTable[conflict.table] || 0) + 1;
  }

  /**
   * Get conflict metrics
   */
  getMetrics(): ConflictMetrics {
    return { ...this.metrics };
  }

  /**
   * Get unresolved conflicts
   */
  async getUnresolvedConflicts(): Promise<DataConflict[]> {
    const query = `
      SELECT id, table_name, record_id, conflict_type, postgres_data, cosmos_data,
             conflict_fields, detected_at, resolved_at, resolution, status
      FROM data_conflicts
      WHERE status = 'detected'
      ORDER BY detected_at DESC
    `;

    const result = await this.postgresClient.query(query);
    return result.rows.map(row => ({
      id: row.id,
      table: row.table_name,
      recordId: row.record_id,
      conflictType: row.conflict_type,
      postgresData: row.postgres_data,
      cosmosData: row.cosmos_data,
      conflictFields: row.conflict_fields,
      detectedAt: row.detected_at,
      resolvedAt: row.resolved_at,
      resolution: row.resolution,
      status: row.status,
    }));
  }

  /**
   * Generate conflict ID
   */
  private generateConflictId(): string {
    return `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
