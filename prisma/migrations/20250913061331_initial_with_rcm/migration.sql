-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW', 'EXEC', 'CONTRACTOR', 'PARTNER', 'CITIZEN');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_LOGIN', 'USER_LOGOUT', 'USER_ROLE_CHANGE', 'USER_STATUS_CHANGE', 'USER_PASSWORD_RESET', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'ORGANISATION_CREATED', 'ORGANISATION_UPDATED', 'ORGANISATION_DELETED', 'MFA_ENABLED', 'MFA_DISABLED', 'MFA_VERIFIED', 'MFA_BACKUP_CODE_USED', 'ASSET_CREATED', 'ASSET_UPDATED', 'ASSET_DELETED', 'ASSET_IMPORTED', 'ASSET_DOCUMENT_ATTACHED', 'ASSET_DOCUMENT_REMOVED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('BUILDING', 'ROAD', 'BRIDGE', 'FOOTPATH', 'PARK', 'PLAYGROUND', 'SPORTS_FACILITY', 'LIBRARY', 'COMMUNITY_CENTRE', 'CAR_PARK', 'STREET_FURNITURE', 'TRAFFIC_LIGHT', 'STREET_LIGHT', 'DRAINAGE', 'WATER_SUPPLY', 'SEWER', 'ELECTRICAL_INFRASTRUCTURE', 'TELECOMMUNICATIONS', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_CONSTRUCTION', 'UNDER_MAINTENANCE', 'DECOMMISSIONED', 'PLANNED');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AssetPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RCMTemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "FailureModeType" AS ENUM ('FUNCTIONAL_FAILURE', 'DEGRADED_PERFORMANCE', 'COMPLETE_FAILURE', 'INTERMITTENT_FAILURE');

-- CreateEnum
CREATE TYPE "FailureEffectSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MaintenanceTaskType" AS ENUM ('INSPECTION', 'CLEANING', 'LUBRICATION', 'ADJUSTMENT', 'REPLACEMENT', 'REPAIR', 'CALIBRATION', 'TESTING');

-- CreateEnum
CREATE TYPE "MaintenanceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY', 'BIENNIALLY', 'AS_NEEDED', 'CONDITION_BASED');

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CITIZEN',
    "organisationId" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "passwordResetAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "mfaBackupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mfaVerifiedAt" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "bio" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Australia/Sydney',
    "language" TEXT NOT NULL DEFAULT 'en-AU',
    "notificationPreferences" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceInfo" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "userId" TEXT,
    "organisationId" TEXT,
    "assetId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetType" "AssetType" NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "condition" "AssetCondition" NOT NULL DEFAULT 'UNKNOWN',
    "priority" "AssetPriority" NOT NULL DEFAULT 'MEDIUM',
    "location" geometry(Point,4326),
    "address" TEXT,
    "suburb" TEXT,
    "postcode" TEXT,
    "state" TEXT NOT NULL DEFAULT 'NSW',
    "country" TEXT NOT NULL DEFAULT 'Australia',
    "manufacturer" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "installationDate" TIMESTAMP(3),
    "warrantyExpiry" TIMESTAMP(3),
    "expectedLifespan" INTEGER,
    "purchasePrice" DECIMAL(12,2),
    "currentValue" DECIMAL(12,2),
    "replacementCost" DECIMAL(12,2),
    "depreciationRate" DECIMAL(5,2),
    "lastInspection" TIMESTAMP(3),
    "nextInspection" TIMESTAMP(3),
    "inspectionFrequency" INTEGER,
    "maintenanceCost" DECIMAL(12,2),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetDocument" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "description" TEXT,
    "documentType" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetInspection" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "inspectorName" TEXT NOT NULL,
    "inspectorId" TEXT,
    "condition" "AssetCondition" NOT NULL,
    "conditionNotes" TEXT,
    "issues" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT,
    "nextInspectionDate" TIMESTAMP(3),
    "priorityActions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetMaintenance" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "maintenanceDate" TIMESTAMP(3) NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performedBy" TEXT,
    "cost" DECIMAL(12,2),
    "duration" INTEGER,
    "materials" TEXT,
    "issuesFound" TEXT,
    "workPerformed" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "workOrderNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "AssetPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedTo" TEXT,
    "assignedBy" TEXT,
    "scheduledDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "estimatedCost" DECIMAL(12,2),
    "actualCost" DECIMAL(12,2),
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "workPerformed" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RCMTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assetType" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "RCMTemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RCMTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RCMFailureMode" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "FailureModeType" NOT NULL,
    "cause" TEXT,
    "effect" TEXT NOT NULL,
    "severity" "FailureEffectSeverity" NOT NULL,
    "consequences" TEXT,
    "detectionMethod" TEXT,
    "preventionMethod" TEXT,
    "probability" INTEGER,
    "impact" INTEGER,
    "riskScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RCMFailureMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RCMMaintenanceTask" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "MaintenanceTaskType" NOT NULL,
    "frequency" "MaintenanceFrequency" NOT NULL,
    "duration" INTEGER,
    "skillLevel" TEXT,
    "tools" TEXT,
    "materials" TEXT,
    "instructions" TEXT,
    "safetyRequirements" TEXT,
    "complianceNotes" TEXT,
    "estimatedCost" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RCMMaintenanceTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetRCMTemplate" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastReview" TIMESTAMP(3),
    "nextReview" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetRCMTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceSchedule" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "templateId" TEXT,
    "taskName" TEXT NOT NULL,
    "taskType" "MaintenanceTaskType" NOT NULL,
    "frequency" "MaintenanceFrequency" NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "assignedTo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" "AssetPriority" NOT NULL DEFAULT 'MEDIUM',
    "workPerformed" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_name_key" ON "Organisation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_organisationId_idx" ON "AuditLog"("organisationId");

-- CreateIndex
CREATE INDEX "AuditLog_assetId_idx" ON "AuditLog"("assetId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetNumber_key" ON "Asset"("assetNumber");

-- CreateIndex
CREATE INDEX "Asset_organisationId_idx" ON "Asset"("organisationId");

-- CreateIndex
CREATE INDEX "Asset_assetNumber_idx" ON "Asset"("assetNumber");

-- CreateIndex
CREATE INDEX "Asset_assetType_idx" ON "Asset"("assetType");

-- CreateIndex
CREATE INDEX "Asset_status_idx" ON "Asset"("status");

-- CreateIndex
CREATE INDEX "Asset_condition_idx" ON "Asset"("condition");

-- CreateIndex
CREATE INDEX "Asset_priority_idx" ON "Asset"("priority");

-- CreateIndex
CREATE INDEX "Asset_location_idx" ON "Asset"("location");

-- CreateIndex
CREATE INDEX "Asset_createdAt_idx" ON "Asset"("createdAt");

-- CreateIndex
CREATE INDEX "AssetDocument_assetId_idx" ON "AssetDocument"("assetId");

-- CreateIndex
CREATE INDEX "AssetDocument_documentType_idx" ON "AssetDocument"("documentType");

-- CreateIndex
CREATE INDEX "AssetDocument_createdAt_idx" ON "AssetDocument"("createdAt");

-- CreateIndex
CREATE INDEX "AssetInspection_assetId_idx" ON "AssetInspection"("assetId");

-- CreateIndex
CREATE INDEX "AssetInspection_inspectionDate_idx" ON "AssetInspection"("inspectionDate");

-- CreateIndex
CREATE INDEX "AssetInspection_condition_idx" ON "AssetInspection"("condition");

-- CreateIndex
CREATE INDEX "AssetMaintenance_assetId_idx" ON "AssetMaintenance"("assetId");

-- CreateIndex
CREATE INDEX "AssetMaintenance_maintenanceDate_idx" ON "AssetMaintenance"("maintenanceDate");

-- CreateIndex
CREATE INDEX "AssetMaintenance_maintenanceType_idx" ON "AssetMaintenance"("maintenanceType");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_workOrderNumber_key" ON "WorkOrder"("workOrderNumber");

-- CreateIndex
CREATE INDEX "WorkOrder_assetId_idx" ON "WorkOrder"("assetId");

-- CreateIndex
CREATE INDEX "WorkOrder_workOrderNumber_idx" ON "WorkOrder"("workOrderNumber");

-- CreateIndex
CREATE INDEX "WorkOrder_status_idx" ON "WorkOrder"("status");

-- CreateIndex
CREATE INDEX "WorkOrder_priority_idx" ON "WorkOrder"("priority");

-- CreateIndex
CREATE INDEX "WorkOrder_assignedTo_idx" ON "WorkOrder"("assignedTo");

-- CreateIndex
CREATE INDEX "WorkOrder_dueDate_idx" ON "WorkOrder"("dueDate");

-- CreateIndex
CREATE INDEX "RCMTemplate_assetType_idx" ON "RCMTemplate"("assetType");

-- CreateIndex
CREATE INDEX "RCMTemplate_status_idx" ON "RCMTemplate"("status");

-- CreateIndex
CREATE INDEX "RCMTemplate_createdBy_idx" ON "RCMTemplate"("createdBy");

-- CreateIndex
CREATE INDEX "RCMTemplate_organisationId_idx" ON "RCMTemplate"("organisationId");

-- CreateIndex
CREATE INDEX "RCMFailureMode_templateId_idx" ON "RCMFailureMode"("templateId");

-- CreateIndex
CREATE INDEX "RCMFailureMode_type_idx" ON "RCMFailureMode"("type");

-- CreateIndex
CREATE INDEX "RCMFailureMode_severity_idx" ON "RCMFailureMode"("severity");

-- CreateIndex
CREATE INDEX "RCMMaintenanceTask_templateId_idx" ON "RCMMaintenanceTask"("templateId");

-- CreateIndex
CREATE INDEX "RCMMaintenanceTask_type_idx" ON "RCMMaintenanceTask"("type");

-- CreateIndex
CREATE INDEX "RCMMaintenanceTask_frequency_idx" ON "RCMMaintenanceTask"("frequency");

-- CreateIndex
CREATE INDEX "AssetRCMTemplate_assetId_idx" ON "AssetRCMTemplate"("assetId");

-- CreateIndex
CREATE INDEX "AssetRCMTemplate_templateId_idx" ON "AssetRCMTemplate"("templateId");

-- CreateIndex
CREATE INDEX "AssetRCMTemplate_isActive_idx" ON "AssetRCMTemplate"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AssetRCMTemplate_assetId_templateId_key" ON "AssetRCMTemplate"("assetId", "templateId");

-- CreateIndex
CREATE INDEX "MaintenanceSchedule_assetId_idx" ON "MaintenanceSchedule"("assetId");

-- CreateIndex
CREATE INDEX "MaintenanceSchedule_scheduledDate_idx" ON "MaintenanceSchedule"("scheduledDate");

-- CreateIndex
CREATE INDEX "MaintenanceSchedule_dueDate_idx" ON "MaintenanceSchedule"("dueDate");

-- CreateIndex
CREATE INDEX "MaintenanceSchedule_status_idx" ON "MaintenanceSchedule"("status");

-- CreateIndex
CREATE INDEX "MaintenanceSchedule_assignedTo_idx" ON "MaintenanceSchedule"("assignedTo");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDocument" ADD CONSTRAINT "AssetDocument_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetDocument" ADD CONSTRAINT "AssetDocument_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetInspection" ADD CONSTRAINT "AssetInspection_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetInspection" ADD CONSTRAINT "AssetInspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetMaintenance" ADD CONSTRAINT "AssetMaintenance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetMaintenance" ADD CONSTRAINT "AssetMaintenance_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RCMTemplate" ADD CONSTRAINT "RCMTemplate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RCMTemplate" ADD CONSTRAINT "RCMTemplate_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RCMFailureMode" ADD CONSTRAINT "RCMFailureMode_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RCMTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RCMMaintenanceTask" ADD CONSTRAINT "RCMMaintenanceTask_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RCMTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRCMTemplate" ADD CONSTRAINT "AssetRCMTemplate_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRCMTemplate" ADD CONSTRAINT "AssetRCMTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RCMTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSchedule" ADD CONSTRAINT "MaintenanceSchedule_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
