import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { logAuditEvent, AuditAction } from "@/lib/audit";
import { 
  BackupEnhancementSystem,
  BackupType,
  BackupJobStatus,
  BackupRunStatus,
  BackupTestType,
  BackupTestStatus,
  RestoreType,
  RestoreStatus,
  type BackupJob,
  type BackupRun,
  type BackupTest,
  type BackupRestore,
  type BackupMonitoring
} from "@/lib/security/backup-enhancement";

// Initialize backup enhancement system
const backupSystem = new BackupEnhancementSystem();

/**
 * GET /api/security/backup-enhancement
 * Get backup enhancement overview
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const monitoring = backupSystem.getBackupMonitoring();
    const activeJobs = backupSystem.getBackupJobsByStatus(BackupJobStatus.ACTIVE);
    const failedRuns = backupSystem.getFailedBackupRuns();
    const integrityIssues = backupSystem.getBackupRunsWithIntegrityIssues();

    return NextResponse.json({
      monitoring,
      activeJobs,
      failedRuns,
      integrityIssues,
    });
  } catch (error) {
    console.error("Backup enhancement API error:", error);
    return NextResponse.json(
      { error: "Failed to load backup enhancement data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/backup-enhancement/create-job
 * Create backup job
 */
export async function POST_CREATE_JOB(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      type, 
      source, 
      destination, 
      schedule, 
      retention, 
      encryption, 
      compression 
    } = body;

    if (!name || !type || !source || !destination) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create backup job
    const job = await backupSystem.createBackupJob(
      name,
      description || '',
      type as BackupType,
      source,
      destination,
      schedule,
      retention,
      encryption,
      compression
    );

    // Log audit event
    await logAuditEvent(
      AuditAction.BACKUP_JOB_CREATED,
      session.user.id,
      session.user.organisationId,
      {
        jobId: job.id,
        jobName: job.name,
        jobType: job.type,
        sourceType: source.type,
        destinationType: destination.type,
        encryptionEnabled: encryption.enabled,
        compressionEnabled: compression.enabled,
      }
    );

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Create backup job API error:", error);
    return NextResponse.json(
      { error: "Failed to create backup job" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/backup-enhancement/execute/[id]
 * Execute backup job
 */
export async function POST_EXECUTE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Execute backup job
    const run = await backupSystem.executeBackupJob(id);

    // Log audit event
    await logAuditEvent(
      AuditAction.BACKUP_EXECUTION,
      session.user.id,
      session.user.organisationId,
      {
        jobId: id,
        runId: run.id,
        runStatus: run.status,
        filesCount: run.filesCount,
        size: run.size,
        compressedSize: run.compressedSize,
        errors: run.errors.length,
        warnings: run.warnings.length,
      }
    );

    return NextResponse.json({ run });
  } catch (error) {
    console.error("Execute backup job API error:", error);
    return NextResponse.json(
      { error: "Failed to execute backup job" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/backup-enhancement/test-integrity/[id]
 * Test backup integrity
 */
export async function POST_TEST_INTEGRITY(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Test backup integrity
    const test = await backupSystem.testBackupIntegrity(id);

    // Log audit event
    await logAuditEvent(
      AuditAction.BACKUP_INTEGRITY_TEST,
      session.user.id,
      session.user.organisationId,
      {
        backupRunId: id,
        testId: test.id,
        testType: test.testType,
        testStatus: test.status,
        testDuration: test.testDuration,
        failures: test.failures.length,
      }
    );

    return NextResponse.json({ test });
  } catch (error) {
    console.error("Test backup integrity API error:", error);
    return NextResponse.json(
      { error: "Failed to test backup integrity" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/backup-enhancement/test-restore/[id]
 * Test backup restore
 */
export async function POST_TEST_RESTORE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Test backup restore
    const test = await backupSystem.testBackupRestore(id);

    // Log audit event
    await logAuditEvent(
      AuditAction.BACKUP_RESTORE_TEST,
      session.user.id,
      session.user.organisationId,
      {
        backupRunId: id,
        testId: test.id,
        testType: test.testType,
        testStatus: test.status,
        testDuration: test.testDuration,
        failures: test.failures.length,
      }
    );

    return NextResponse.json({ test });
  } catch (error) {
    console.error("Test backup restore API error:", error);
    return NextResponse.json(
      { error: "Failed to test backup restore" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/backup-enhancement/restore/[id]
 * Restore backup
 */
export async function POST_RESTORE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { restoreType, targetLocation } = body;

    if (!restoreType || !targetLocation) {
      return NextResponse.json(
        { error: "Missing restore type or target location" },
        { status: 400 }
      );
    }

    // Restore backup
    const restore = await backupSystem.restoreBackup(
      id,
      restoreType as RestoreType,
      targetLocation
    );

    // Log audit event
    await logAuditEvent(
      AuditAction.BACKUP_RESTORE,
      session.user.id,
      session.user.organisationId,
      {
        backupRunId: id,
        restoreId: restore.id,
        restoreType: restoreType,
        targetLocation: targetLocation,
        restoreStatus: restore.status,
        restoredFiles: restore.restoredFiles,
        errors: restore.errors.length,
      }
    );

    return NextResponse.json({ restore });
  } catch (error) {
    console.error("Restore backup API error:", error);
    return NextResponse.json(
      { error: "Failed to restore backup" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/security/backup-enhancement/monitoring
 * Get detailed backup monitoring report
 */
export async function GET_MONITORING(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has appropriate role
    if (!['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const monitoring = backupSystem.getBackupMonitoring();
    const jobsByStatus = {
      active: backupSystem.getBackupJobsByStatus(BackupJobStatus.ACTIVE),
      paused: backupSystem.getBackupJobsByStatus(BackupJobStatus.PAUSED),
      disabled: backupSystem.getBackupJobsByStatus(BackupJobStatus.DISABLED),
      error: backupSystem.getBackupJobsByStatus(BackupJobStatus.ERROR),
    };

    return NextResponse.json({
      monitoring,
      jobsByStatus,
    });
  } catch (error) {
    console.error("Backup monitoring API error:", error);
    return NextResponse.json(
      { error: "Failed to load backup monitoring data" },
      { status: 500 }
    );
  }
}
