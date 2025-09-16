/**
 * Migration API Endpoints
 * 
 * Implements API endpoints for migration management and monitoring
 * 
 * @fileoverview Migration API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { migrationTimelineManager } from '@/lib/migration/timeline-management';
import { databaseConnectionService } from '@/lib/infrastructure/database-connections';
import { DataSynchronizationService } from '@/lib/sync/real-time-sync';
import { BatchSynchronizationService } from '@/lib/sync/batch-sync';
import { ConflictDetectionService } from '@/lib/sync/conflict-detection';

/**
 * GET /api/migration/timeline
 * Get migration timeline and status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timeline = migrationTimelineManager.getTimeline();
    const metrics = migrationTimelineManager.getMetrics();
    const summary = migrationTimelineManager.getTimelineSummary();
    const criticalPath = migrationTimelineManager.getCriticalPath();
    const riskSummary = migrationTimelineManager.getRiskSummary();

    return NextResponse.json({
      timeline,
      metrics,
      summary,
      criticalPath,
      riskSummary,
    });
  } catch (error) {
    console.error('Error getting migration timeline:', error);
    return NextResponse.json(
      { error: 'Failed to get migration timeline' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/migration/timeline/phase/{phaseId}/start
 * Start a migration phase
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { phaseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phaseId } = params;
    migrationTimelineManager.updatePhaseStatus(phaseId, 'in-progress');

    return NextResponse.json({ 
      message: `Phase ${phaseId} started successfully`,
      phaseId,
      status: 'in-progress'
    });
  } catch (error) {
    console.error('Error starting migration phase:', error);
    return NextResponse.json(
      { error: 'Failed to start migration phase' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/migration/timeline/phase/{phaseId}/complete
 * Complete a migration phase
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { phaseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phaseId } = params;
    migrationTimelineManager.updatePhaseStatus(phaseId, 'completed');

    return NextResponse.json({ 
      message: `Phase ${phaseId} completed successfully`,
      phaseId,
      status: 'completed'
    });
  } catch (error) {
    console.error('Error completing migration phase:', error);
    return NextResponse.json(
      { error: 'Failed to complete migration phase' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migration/health
 * Get migration health status
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const healthCheck = await databaseConnectionService.healthCheck();
    const metrics = migrationTimelineManager.getMetrics();

    return NextResponse.json({
      database: healthCheck,
      migration: {
        progress: metrics.completedTasks / metrics.totalTasks * 100,
        status: healthCheck.overall === 'healthy' ? 'healthy' : 'degraded',
        metrics,
      },
    });
  } catch (error) {
    console.error('Error getting migration health:', error);
    return NextResponse.json(
      { error: 'Failed to get migration health' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migration/conflicts
 * Get data conflicts
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postgresClient = await databaseConnectionService.getPostgresConnection();
    const cosmosClient = databaseConnectionService.getCosmosClient();
    const gremlinClient = databaseConnectionService.getGremlinClient();

    const conflictService = new ConflictDetectionService(
      postgresClient,
      cosmosClient,
      gremlinClient
    );

    await conflictService.initialize();
    const conflicts = await conflictService.getUnresolvedConflicts();
    const metrics = conflictService.getMetrics();

    postgresClient.release();

    return NextResponse.json({
      conflicts,
      metrics,
    });
  } catch (error) {
    console.error('Error getting conflicts:', error);
    return NextResponse.json(
      { error: 'Failed to get conflicts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/migration/conflicts/{conflictId}/resolve
 * Resolve a data conflict
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { conflictId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conflictId } = params;
    const { strategy, resolvedData, notes } = await request.json();

    const postgresClient = await databaseConnectionService.getPostgresConnection();
    const cosmosClient = databaseConnectionService.getCosmosClient();
    const gremlinClient = databaseConnectionService.getGremlinClient();

    const conflictService = new ConflictDetectionService(
      postgresClient,
      cosmosClient,
      gremlinClient
    );

    await conflictService.initialize();
    
    const resolution = {
      strategy,
      resolvedData,
      resolvedBy: session.user?.email || 'unknown',
      resolvedAt: new Date(),
      notes,
    };

    await conflictService.resolveConflict(conflictId, resolution);

    postgresClient.release();

    return NextResponse.json({ 
      message: 'Conflict resolved successfully',
      conflictId,
      resolution,
    });
  } catch (error) {
    console.error('Error resolving conflict:', error);
    return NextResponse.json(
      { error: 'Failed to resolve conflict' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migration/batch-jobs
 * Get batch synchronization jobs
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postgresClient = await databaseConnectionService.getPostgresConnection();
    const cosmosClient = databaseConnectionService.getCosmosClient();
    const gremlinClient = databaseConnectionService.getGremlinClient();

    const batchService = new BatchSynchronizationService(
      postgresClient,
      cosmosClient,
      gremlinClient
    );

    const jobs = batchService.listBatchSyncJobs();
    const activeJobs = batchService.getActiveBatchSyncJobs();

    postgresClient.release();

    return NextResponse.json({
      jobs,
      activeJobs,
    });
  } catch (error) {
    console.error('Error getting batch jobs:', error);
    return NextResponse.json(
      { error: 'Failed to get batch jobs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/migration/batch-jobs
 * Create a new batch synchronization job
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, sourceTable, targetContainer, config } = await request.json();

    const postgresClient = await databaseConnectionService.getPostgresConnection();
    const cosmosClient = databaseConnectionService.getCosmosClient();
    const gremlinClient = databaseConnectionService.getGremlinClient();

    const batchService = new BatchSynchronizationService(
      postgresClient,
      cosmosClient,
      gremlinClient
    );

    const jobId = await batchService.createBatchSyncJob(
      name,
      description,
      sourceTable,
      targetContainer,
      config
    );

    postgresClient.release();

    return NextResponse.json({ 
      message: 'Batch job created successfully',
      jobId,
    });
  } catch (error) {
    console.error('Error creating batch job:', error);
    return NextResponse.json(
      { error: 'Failed to create batch job' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/migration/batch-jobs/{jobId}/execute
 * Execute a batch synchronization job
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = params;

    const postgresClient = await databaseConnectionService.getPostgresConnection();
    const cosmosClient = databaseConnectionService.getCosmosClient();
    const gremlinClient = databaseConnectionService.getGremlinClient();

    const batchService = new BatchSynchronizationService(
      postgresClient,
      cosmosClient,
      gremlinClient
    );

    const result = await batchService.executeBatchSyncJob(jobId);

    postgresClient.release();

    return NextResponse.json({ 
      message: 'Batch job executed successfully',
      result,
    });
  } catch (error) {
    console.error('Error executing batch job:', error);
    return NextResponse.json(
      { error: 'Failed to execute batch job' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migration/metrics
 * Get migration metrics and progress
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = migrationTimelineManager.getMetrics();
    const summary = migrationTimelineManager.getTimelineSummary();
    const riskSummary = migrationTimelineManager.getRiskSummary();

    return NextResponse.json({
      metrics,
      summary,
      riskSummary,
    });
  } catch (error) {
    console.error('Error getting migration metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get migration metrics' },
      { status: 500 }
    );
  }
}
