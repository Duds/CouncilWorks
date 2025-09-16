/**
 * E13 Integration Test Suite
 * 
 * Comprehensive integration tests for Database Migration & Integration (E13)
 * 
 * @fileoverview E13 integration test suite
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { Pool } from 'pg';
import { CosmosClient } from '@azure/cosmos';
import { GremlinClient } from 'gremlin';
import { CosmosDBInfrastructure } from '@/lib/infrastructure/cosmos-db-setup';
import { DatabaseConnectionService } from '@/lib/infrastructure/database-connections';
import { EnvironmentConfigManager } from '@/lib/infrastructure/environment-config';
import { DataSynchronizationService } from '@/lib/sync/real-time-sync';
import { BatchSynchronizationService } from '@/lib/sync/batch-sync';
import { ConflictDetectionService } from '@/lib/sync/conflict-detection';
import { MigrationTimelineManager } from '@/lib/migration/timeline-management';

describe('E13: Database Migration & Integration', () => {
  let postgresPool: Pool;
  let cosmosClient: CosmosClient;
  let gremlinClient: GremlinClient;
  let dbConnectionService: DatabaseConnectionService;
  let syncService: DataSynchronizationService;
  let batchService: BatchSynchronizationService;
  let conflictService: ConflictDetectionService;
  let timelineManager: MigrationTimelineManager;

  beforeAll(async () => {
    // Initialize test environment
    const config = {
      postgres: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DB || 'aegrid_test',
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        ssl: false,
        maxConnections: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      },
      cosmos: {
        endpoint: process.env.COSMOS_DB_ENDPOINT || 'https://localhost:8081',
        key: process.env.COSMOS_DB_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
        databaseId: 'aegrid-test',
        containerId: 'assets',
        partitionKey: 'organisationId',
        throughput: 400,
        enableAutoscale: false,
      },
    };

    // Initialize PostgreSQL
    postgresPool = new Pool(config.postgres);
    await postgresPool.query('SELECT 1'); // Test connection

    // Initialize Cosmos DB
    cosmosClient = new CosmosClient({
      endpoint: config.cosmos.endpoint,
      key: config.cosmos.key,
    });

    gremlinClient = new GremlinClient({
      endpoint: config.cosmos.endpoint,
      key: config.cosmos.key,
      database: config.cosmos.databaseId,
      collection: config.cosmos.containerId,
    });

    // Initialize services
    dbConnectionService = new DatabaseConnectionService(config);
    await dbConnectionService.initialize();

    const postgresClient = await dbConnectionService.getPostgresConnection();
    syncService = new DataSynchronizationService(
      postgresClient,
      cosmosClient,
      gremlinClient,
      {
        enabled: true,
        batchSize: 10,
        retryAttempts: 3,
        retryDelay: 1000,
        maxRetryDelay: 5000,
        conflictResolution: 'timestamp_wins',
        enableRealTimeSync: true,
        enableBatchSync: true,
        syncInterval: 1000,
      }
    );

    batchService = new BatchSynchronizationService(
      postgresClient,
      cosmosClient,
      gremlinClient
    );

    conflictService = new ConflictDetectionService(
      postgresClient,
      cosmosClient,
      gremlinClient
    );

    timelineManager = new MigrationTimelineManager();

    postgresClient.release();
  });

  afterAll(async () => {
    await dbConnectionService.close();
    await postgresPool.end();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await postgresPool.query('DELETE FROM sync_events');
    await postgresPool.query('DELETE FROM data_conflicts');
    await postgresPool.query('DELETE FROM sync_conflicts');
  });

  describe('E13.1: Infrastructure Setup & Configuration', () => {
    it('should initialize Cosmos DB infrastructure', async () => {
      const cosmosInfra = new CosmosDBInfrastructure({
        endpoint: process.env.COSMOS_DB_ENDPOINT || 'https://localhost:8081',
        key: process.env.COSMOS_DB_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==',
        databaseId: 'aegrid-test-infra',
        containerId: 'test-assets',
        partitionKey: 'organisationId',
        throughput: 400,
        enableAutoscale: false,
        consistencyLevel: 'Session',
        enableMultiRegion: false,
      });

      await cosmosInfra.initialize();
      const healthCheck = await cosmosInfra.healthCheck();
      
      expect(healthCheck.status).toBe('healthy');
      expect(cosmosInfra.getConnection().isConnected).toBe(true);
    });

    it('should manage database connections', async () => {
      const healthCheck = await dbConnectionService.healthCheck();
      
      expect(healthCheck.overall).toBe('healthy');
      expect(healthCheck.postgres.status).toBe('healthy');
      expect(healthCheck.cosmos.status).toBe('healthy');
    });

    it('should validate environment configuration', () => {
      const configManager = new EnvironmentConfigManager();
      const validation = configManager.getValidationResult();
      
      expect(configManager.isValid()).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('E13.2: Data Synchronization Implementation', () => {
    it('should initialize synchronization service', async () => {
      await syncService.initialize();
      
      // Test adding a sync event
      const eventId = await syncService.addSyncEvent({
        type: 'create',
        table: 'test_assets',
        recordId: 'test-001',
        data: { name: 'Test Asset', type: 'equipment' },
      });

      expect(eventId).toBeDefined();
      expect(eventId).toMatch(/^sync_/);
    });

    it('should handle real-time synchronization', async () => {
      await syncService.initialize();

      // Add multiple sync events
      const events = [];
      for (let i = 0; i < 5; i++) {
        const eventId = await syncService.addSyncEvent({
          type: 'create',
          table: 'test_assets',
          recordId: `test-${i}`,
          data: { name: `Test Asset ${i}`, type: 'equipment' },
        });
        events.push(eventId);
      }

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const metrics = syncService.getMetrics();
      expect(metrics.totalEvents).toBe(5);
      expect(metrics.successfulSyncs).toBeGreaterThan(0);
    });

    it('should handle batch synchronization', async () => {
      // Create test data in PostgreSQL
      await postgresPool.query(`
        CREATE TABLE IF NOT EXISTS test_assets (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          type VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Insert test data
      for (let i = 0; i < 10; i++) {
        await postgresPool.query(
          'INSERT INTO test_assets (id, name, type) VALUES ($1, $2, $3)',
          [`batch-test-${i}`, `Batch Asset ${i}`, 'equipment']
        );
      }

      // Create and execute batch job
      const jobId = await batchService.createBatchSyncJob(
        'Test Batch Migration',
        'Migrate test assets to Cosmos DB',
        'test_assets',
        'test_asset',
        {
          batchSize: 5,
          maxConcurrency: 2,
          retryAttempts: 3,
          retryDelay: 1000,
          enableProgressTracking: true,
          enableResume: true,
        }
      );

      const result = await batchService.executeBatchSyncJob(jobId);

      expect(result.jobId).toBe(jobId);
      expect(result.totalRecords).toBe(10);
      expect(result.successfulRecords).toBeGreaterThan(0);
    });

    it('should detect and resolve conflicts', async () => {
      await conflictService.initialize();

      // Create conflicting data
      await postgresPool.query(`
        CREATE TABLE IF NOT EXISTS test_conflicts (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          value INTEGER NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await postgresPool.query(
        'INSERT INTO test_conflicts (id, name, value) VALUES ($1, $2, $3)',
        ['conflict-test-001', 'Conflict Asset', 100]
      );

      // Simulate conflict by updating Cosmos DB directly
      await gremlinClient.submit(`
        g.addV('test_conflict')
          .property('id', 'conflict-test-001')
          .property('name', 'Conflict Asset')
          .property('value', 200)
          .property('updatedAt', '${new Date().toISOString()}')
      `);

      // Detect conflicts
      const conflicts = await conflictService.detectConflicts('test_conflicts', 'conflict-test-001');

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].conflictType).toBe('data_mismatch');
      expect(conflicts[0].conflictFields).toContain('value');

      // Resolve conflict
      const resolution = {
        strategy: 'postgres_wins' as const,
        resolvedData: { name: 'Conflict Asset', value: 100 },
        resolvedBy: 'test-user',
        resolvedAt: new Date(),
      };

      await conflictService.resolveConflict(conflicts[0].id, resolution);

      const metrics = conflictService.getMetrics();
      expect(metrics.resolvedConflicts).toBeGreaterThan(0);
    });
  });

  describe('E13.3: Migration Timeline & Risk Management', () => {
    it('should create migration timeline', () => {
      const timeline = timelineManager.getTimeline();
      
      expect(timeline.id).toBeDefined();
      expect(timeline.name).toBe('Aegrid Hybrid Database Migration');
      expect(timeline.phases).toHaveLength(5);
      expect(timeline.totalDuration).toBe(90);
    });

    it('should track migration progress', () => {
      const metrics = timelineManager.getMetrics();
      const summary = timelineManager.getTimelineSummary();
      
      expect(metrics.totalTasks).toBeGreaterThan(0);
      expect(summary.totalDuration).toBe(90);
      expect(summary.progress).toBeGreaterThanOrEqual(0);
    });

    it('should identify critical path', () => {
      const criticalPath = timelineManager.getCriticalPath();
      
      expect(criticalPath).toBeDefined();
      expect(criticalPath.length).toBeGreaterThan(0);
    });

    it('should assess risks', () => {
      const riskSummary = timelineManager.getRiskSummary();
      
      expect(riskSummary.total).toBeGreaterThan(0);
      expect(riskSummary.criticalRisks).toBeDefined();
      expect(riskSummary.byCategory).toBeDefined();
      expect(riskSummary.byProbability).toBeDefined();
      expect(riskSummary.byImpact).toBeDefined();
    });

    it('should update task status', () => {
      const timeline = timelineManager.getTimeline();
      const firstTask = timeline.phases[0].tasks[0];
      
      timelineManager.updateTaskStatus(firstTask.id, 'in-progress');
      
      const updatedTimeline = timelineManager.getTimeline();
      const updatedTask = updatedTimeline.phases[0].tasks[0];
      
      expect(updatedTask.status).toBe('in-progress');
      expect(updatedTask.startDate).toBeDefined();
    });

    it('should update phase status', () => {
      const timeline = timelineManager.getTimeline();
      const firstPhase = timeline.phases[0];
      
      timelineManager.updatePhaseStatus(firstPhase.id, 'in-progress');
      
      const updatedTimeline = timelineManager.getTimeline();
      const updatedPhase = updatedTimeline.phases[0];
      
      expect(updatedPhase.status).toBe('in-progress');
      expect(updatedPhase.startDate).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should perform end-to-end migration simulation', async () => {
      // Initialize all services
      await syncService.initialize();
      await conflictService.initialize();

      // Create test data
      await postgresPool.query(`
        CREATE TABLE IF NOT EXISTS e2e_test_assets (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          type VARCHAR(100) NOT NULL,
          organisation_id VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Insert test data
      const testAssets = [
        { id: 'e2e-001', name: 'E2E Asset 1', type: 'equipment', organisation_id: 'org-001' },
        { id: 'e2e-002', name: 'E2E Asset 2', type: 'vehicle', organisation_id: 'org-001' },
        { id: 'e2e-003', name: 'E2E Asset 3', type: 'building', organisation_id: 'org-002' },
      ];

      for (const asset of testAssets) {
        await postgresPool.query(
          'INSERT INTO e2e_test_assets (id, name, type, organisation_id) VALUES ($1, $2, $3, $4)',
          [asset.id, asset.name, asset.type, asset.organisation_id]
        );
      }

      // Perform batch migration
      const jobId = await batchService.createBatchSyncJob(
        'E2E Test Migration',
        'End-to-end migration test',
        'e2e_test_assets',
        'e2e_test_asset',
        {
          batchSize: 2,
          maxConcurrency: 1,
          retryAttempts: 3,
          retryDelay: 1000,
          enableProgressTracking: true,
          enableResume: true,
        }
      );

      const result = await batchService.executeBatchSyncJob(jobId);

      // Verify migration results
      expect(result.totalRecords).toBe(3);
      expect(result.successfulRecords).toBe(3);
      expect(result.failedRecords).toBe(0);

      // Test real-time sync
      const syncEventId = await syncService.addSyncEvent({
        type: 'update',
        table: 'e2e_test_assets',
        recordId: 'e2e-001',
        data: { name: 'Updated E2E Asset 1', type: 'equipment' },
      });

      expect(syncEventId).toBeDefined();

      // Wait for sync processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const syncMetrics = syncService.getMetrics();
      expect(syncMetrics.totalEvents).toBeGreaterThan(0);

      // Test conflict detection
      const conflicts = await conflictService.detectConflicts('e2e_test_assets', 'e2e-001');
      expect(conflicts).toBeDefined();

      // Verify timeline management
      const timeline = timelineManager.getTimeline();
      expect(timeline.phases).toHaveLength(5);

      const metrics = timelineManager.getMetrics();
      expect(metrics.totalTasks).toBeGreaterThan(0);
    });

    it('should handle error scenarios gracefully', async () => {
      await syncService.initialize();

      // Test with invalid data
      try {
        await syncService.addSyncEvent({
          type: 'create' as any,
          table: 'nonexistent_table',
          recordId: 'invalid-001',
          data: { invalid: 'data' },
        });
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Test batch service with invalid table
      try {
        const jobId = await batchService.createBatchSyncJob(
          'Invalid Test',
          'Test with invalid table',
          'nonexistent_table',
          'invalid_vertex',
          {
            batchSize: 1,
            maxConcurrency: 1,
            retryAttempts: 1,
            retryDelay: 1000,
            enableProgressTracking: true,
            enableResume: true,
          }
        );

        await batchService.executeBatchSyncJob(jobId);
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Verify services are still functional
      const healthCheck = await dbConnectionService.healthCheck();
      expect(healthCheck.overall).toBe('healthy');
    });
  });
});
