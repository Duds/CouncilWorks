-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'SUPERVISOR', 'CREW', 'EXEC', 'CONTRACTOR', 'PARTNER', 'CITIZEN', 'MAINTENANCE_PLANNER');

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

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resilienceConfig" JSONB,
    "marginSettings" JSONB,
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
    "vendorId" TEXT,
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
    "location" TEXT,
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
    "vendorId" TEXT,
    "contractId" TEXT,
    "slaId" TEXT,
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

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abn" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "performanceRating" DECIMAL(3,2),
    "capacityMargin" INTEGER DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "scope" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "renewalDueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SLA" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "responseTimeHours" INTEGER NOT NULL,
    "resolutionTimeHours" INTEGER NOT NULL,
    "frequencyDays" INTEGER,
    "costModel" TEXT NOT NULL,
    "breachEscalation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SLA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CriticalControl" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "windowHours" INTEGER NOT NULL,
    "frequencyDays" INTEGER NOT NULL,
    "escalationPolicy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CriticalControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetCriticalControl" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "criticalControlId" TEXT NOT NULL,
    "vendorId" TEXT,
    "lastExecutedAt" TIMESTAMP(3),
    "nextDueAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetCriticalControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitizenReport" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetId" TEXT,
    "workOrderId" TEXT,
    "reporterName" TEXT NOT NULL,
    "reporterEmail" TEXT NOT NULL,
    "reporterPhone" TEXT,
    "reportedBy" TEXT,
    "issueCategory" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CitizenReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitizenFeedback" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "citizenReportId" TEXT,
    "workOrderId" TEXT,
    "submittedBy" TEXT,
    "satisfactionRating" INTEGER NOT NULL,
    "feedbackText" TEXT,
    "serviceImprovement" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CitizenFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskSignal" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetId" TEXT,
    "detectedBy" TEXT,
    "signalType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentalSignal" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "signalType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentalSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarginCapacity" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "capacityType" TEXT NOT NULL,
    "availableCapacity" INTEGER NOT NULL,
    "utilisedCapacity" INTEGER NOT NULL,
    "marginPercentage" DECIMAL(5,2) NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarginCapacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyResponse" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetId" TEXT,
    "workOrderId" TEXT,
    "activatedBy" TEXT,
    "emergencyType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "responseTimeMinutes" INTEGER NOT NULL,
    "resolutionTimeMinutes" INTEGER NOT NULL,
    "marginDeployed" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceRecord" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetId" TEXT,
    "criticalControlId" TEXT,
    "assignedTo" TEXT,
    "complianceType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalationEvent" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetId" TEXT,
    "criticalControlId" TEXT,
    "workOrderId" TEXT,
    "escalatedBy" TEXT,
    "escalationType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "escalatedTo" TEXT NOT NULL,
    "escalatedAt" TIMESTAMP(3) NOT NULL,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscalationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrderEvidence" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "evidenceType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "gpsCoordinates" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkOrderEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionPhoto" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "gpsCoordinates" TEXT,
    "description" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InspectionPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "organisationId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "message" TEXT,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerMetrics" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "criticalControls" INTEGER NOT NULL,
    "marginUtilization" DOUBLE PRECISION NOT NULL,
    "riskTrend" DOUBLE PRECISION NOT NULL,
    "signalResponse" DOUBLE PRECISION NOT NULL,
    "antifragileScore" DOUBLE PRECISION NOT NULL,
    "timeRange" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagerMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarginStatus" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "marginType" TEXT NOT NULL,
    "utilizationRate" DOUBLE PRECISION NOT NULL,
    "availableCapacity" DOUBLE PRECISION NOT NULL,
    "totalCapacity" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarginStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskTrend" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "assetId" TEXT,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "trend" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoScenario" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "scenarioType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "keyStories" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitizenDashboardStats" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "totalReportsCompleted" INTEGER NOT NULL,
    "reportsThisMonth" INTEGER NOT NULL,
    "averageResolutionTime" DOUBLE PRECISION NOT NULL,
    "satisfactionRate" DOUBLE PRECISION NOT NULL,
    "totalPeopleHelped" INTEGER NOT NULL,
    "costSavings" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CitizenDashboardStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetIntelligenceData" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "totalFunctions" INTEGER NOT NULL,
    "totalAssets" INTEGER NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "criticalAssets" INTEGER NOT NULL,
    "categoryBreakdown" JSONB NOT NULL,
    "period" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetIntelligenceData_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "WorkOrder_vendorId_idx" ON "WorkOrder"("vendorId");

-- CreateIndex
CREATE INDEX "WorkOrder_contractId_idx" ON "WorkOrder"("contractId");

-- CreateIndex
CREATE INDEX "WorkOrder_slaId_idx" ON "WorkOrder"("slaId");

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

-- CreateIndex
CREATE INDEX "Vendor_organisationId_idx" ON "Vendor"("organisationId");

-- CreateIndex
CREATE INDEX "Vendor_performanceRating_idx" ON "Vendor"("performanceRating");

-- CreateIndex
CREATE INDEX "Contract_organisationId_idx" ON "Contract"("organisationId");

-- CreateIndex
CREATE INDEX "Contract_vendorId_idx" ON "Contract"("vendorId");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- CreateIndex
CREATE INDEX "SLA_organisationId_idx" ON "SLA"("organisationId");

-- CreateIndex
CREATE INDEX "SLA_contractId_idx" ON "SLA"("contractId");

-- CreateIndex
CREATE INDEX "CriticalControl_organisationId_idx" ON "CriticalControl"("organisationId");

-- CreateIndex
CREATE INDEX "CriticalControl_type_idx" ON "CriticalControl"("type");

-- CreateIndex
CREATE INDEX "CriticalControl_status_idx" ON "CriticalControl"("status");

-- CreateIndex
CREATE INDEX "AssetCriticalControl_organisationId_idx" ON "AssetCriticalControl"("organisationId");

-- CreateIndex
CREATE INDEX "AssetCriticalControl_assetId_idx" ON "AssetCriticalControl"("assetId");

-- CreateIndex
CREATE INDEX "AssetCriticalControl_criticalControlId_idx" ON "AssetCriticalControl"("criticalControlId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetCriticalControl_assetId_criticalControlId_key" ON "AssetCriticalControl"("assetId", "criticalControlId");

-- CreateIndex
CREATE INDEX "CitizenReport_organisationId_idx" ON "CitizenReport"("organisationId");

-- CreateIndex
CREATE INDEX "CitizenReport_assetId_idx" ON "CitizenReport"("assetId");

-- CreateIndex
CREATE INDEX "CitizenReport_issueCategory_idx" ON "CitizenReport"("issueCategory");

-- CreateIndex
CREATE INDEX "CitizenReport_riskLevel_idx" ON "CitizenReport"("riskLevel");

-- CreateIndex
CREATE INDEX "CitizenReport_status_idx" ON "CitizenReport"("status");

-- CreateIndex
CREATE INDEX "CitizenFeedback_organisationId_idx" ON "CitizenFeedback"("organisationId");

-- CreateIndex
CREATE INDEX "CitizenFeedback_citizenReportId_idx" ON "CitizenFeedback"("citizenReportId");

-- CreateIndex
CREATE INDEX "CitizenFeedback_workOrderId_idx" ON "CitizenFeedback"("workOrderId");

-- CreateIndex
CREATE INDEX "CitizenFeedback_satisfactionRating_idx" ON "CitizenFeedback"("satisfactionRating");

-- CreateIndex
CREATE INDEX "RiskSignal_organisationId_idx" ON "RiskSignal"("organisationId");

-- CreateIndex
CREATE INDEX "RiskSignal_assetId_idx" ON "RiskSignal"("assetId");

-- CreateIndex
CREATE INDEX "RiskSignal_signalType_idx" ON "RiskSignal"("signalType");

-- CreateIndex
CREATE INDEX "RiskSignal_severity_idx" ON "RiskSignal"("severity");

-- CreateIndex
CREATE INDEX "RiskSignal_detectedAt_idx" ON "RiskSignal"("detectedAt");

-- CreateIndex
CREATE INDEX "EnvironmentalSignal_organisationId_idx" ON "EnvironmentalSignal"("organisationId");

-- CreateIndex
CREATE INDEX "EnvironmentalSignal_signalType_idx" ON "EnvironmentalSignal"("signalType");

-- CreateIndex
CREATE INDEX "EnvironmentalSignal_severity_idx" ON "EnvironmentalSignal"("severity");

-- CreateIndex
CREATE INDEX "EnvironmentalSignal_detectedAt_idx" ON "EnvironmentalSignal"("detectedAt");

-- CreateIndex
CREATE INDEX "MarginCapacity_organisationId_idx" ON "MarginCapacity"("organisationId");

-- CreateIndex
CREATE INDEX "MarginCapacity_capacityType_idx" ON "MarginCapacity"("capacityType");

-- CreateIndex
CREATE INDEX "EmergencyResponse_organisationId_idx" ON "EmergencyResponse"("organisationId");

-- CreateIndex
CREATE INDEX "EmergencyResponse_assetId_idx" ON "EmergencyResponse"("assetId");

-- CreateIndex
CREATE INDEX "EmergencyResponse_emergencyType_idx" ON "EmergencyResponse"("emergencyType");

-- CreateIndex
CREATE INDEX "EmergencyResponse_severity_idx" ON "EmergencyResponse"("severity");

-- CreateIndex
CREATE INDEX "EmergencyResponse_activatedAt_idx" ON "EmergencyResponse"("activatedAt");

-- CreateIndex
CREATE INDEX "ComplianceRecord_organisationId_idx" ON "ComplianceRecord"("organisationId");

-- CreateIndex
CREATE INDEX "ComplianceRecord_assetId_idx" ON "ComplianceRecord"("assetId");

-- CreateIndex
CREATE INDEX "ComplianceRecord_criticalControlId_idx" ON "ComplianceRecord"("criticalControlId");

-- CreateIndex
CREATE INDEX "ComplianceRecord_complianceType_idx" ON "ComplianceRecord"("complianceType");

-- CreateIndex
CREATE INDEX "ComplianceRecord_status_idx" ON "ComplianceRecord"("status");

-- CreateIndex
CREATE INDEX "EscalationEvent_organisationId_idx" ON "EscalationEvent"("organisationId");

-- CreateIndex
CREATE INDEX "EscalationEvent_assetId_idx" ON "EscalationEvent"("assetId");

-- CreateIndex
CREATE INDEX "EscalationEvent_criticalControlId_idx" ON "EscalationEvent"("criticalControlId");

-- CreateIndex
CREATE INDEX "EscalationEvent_workOrderId_idx" ON "EscalationEvent"("workOrderId");

-- CreateIndex
CREATE INDEX "EscalationEvent_escalationType_idx" ON "EscalationEvent"("escalationType");

-- CreateIndex
CREATE INDEX "EscalationEvent_severity_idx" ON "EscalationEvent"("severity");

-- CreateIndex
CREATE INDEX "EscalationEvent_escalatedAt_idx" ON "EscalationEvent"("escalatedAt");

-- CreateIndex
CREATE INDEX "WorkOrderEvidence_organisationId_idx" ON "WorkOrderEvidence"("organisationId");

-- CreateIndex
CREATE INDEX "WorkOrderEvidence_workOrderId_idx" ON "WorkOrderEvidence"("workOrderId");

-- CreateIndex
CREATE INDEX "WorkOrderEvidence_evidenceType_idx" ON "WorkOrderEvidence"("evidenceType");

-- CreateIndex
CREATE INDEX "WorkOrderEvidence_uploadedAt_idx" ON "WorkOrderEvidence"("uploadedAt");

-- CreateIndex
CREATE INDEX "InspectionPhoto_organisationId_idx" ON "InspectionPhoto"("organisationId");

-- CreateIndex
CREATE INDEX "InspectionPhoto_inspectionId_idx" ON "InspectionPhoto"("inspectionId");

-- CreateIndex
CREATE INDEX "InspectionPhoto_uploadedAt_idx" ON "InspectionPhoto"("uploadedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_email_organisationId_key" ON "Invitation"("email", "organisationId");

-- CreateIndex
CREATE INDEX "ManagerMetrics_organisationId_idx" ON "ManagerMetrics"("organisationId");

-- CreateIndex
CREATE INDEX "ManagerMetrics_calculatedAt_idx" ON "ManagerMetrics"("calculatedAt");

-- CreateIndex
CREATE INDEX "MarginStatus_organisationId_idx" ON "MarginStatus"("organisationId");

-- CreateIndex
CREATE INDEX "MarginStatus_marginType_idx" ON "MarginStatus"("marginType");

-- CreateIndex
CREATE INDEX "MarginStatus_status_idx" ON "MarginStatus"("status");

-- CreateIndex
CREATE INDEX "RiskTrend_organisationId_idx" ON "RiskTrend"("organisationId");

-- CreateIndex
CREATE INDEX "RiskTrend_assetId_idx" ON "RiskTrend"("assetId");

-- CreateIndex
CREATE INDEX "RiskTrend_calculatedAt_idx" ON "RiskTrend"("calculatedAt");

-- CreateIndex
CREATE INDEX "DemoScenario_organisationId_idx" ON "DemoScenario"("organisationId");

-- CreateIndex
CREATE INDEX "DemoScenario_scenarioType_idx" ON "DemoScenario"("scenarioType");

-- CreateIndex
CREATE INDEX "DemoScenario_isActive_idx" ON "DemoScenario"("isActive");

-- CreateIndex
CREATE INDEX "CitizenDashboardStats_organisationId_idx" ON "CitizenDashboardStats"("organisationId");

-- CreateIndex
CREATE INDEX "CitizenDashboardStats_calculatedAt_idx" ON "CitizenDashboardStats"("calculatedAt");

-- CreateIndex
CREATE INDEX "AssetIntelligenceData_organisationId_idx" ON "AssetIntelligenceData"("organisationId");

-- CreateIndex
CREATE INDEX "AssetIntelligenceData_calculatedAt_idx" ON "AssetIntelligenceData"("calculatedAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_slaId_fkey" FOREIGN KEY ("slaId") REFERENCES "SLA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLA" ADD CONSTRAINT "SLA_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SLA" ADD CONSTRAINT "SLA_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriticalControl" ADD CONSTRAINT "CriticalControl_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCriticalControl" ADD CONSTRAINT "AssetCriticalControl_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCriticalControl" ADD CONSTRAINT "AssetCriticalControl_criticalControlId_fkey" FOREIGN KEY ("criticalControlId") REFERENCES "CriticalControl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCriticalControl" ADD CONSTRAINT "AssetCriticalControl_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCriticalControl" ADD CONSTRAINT "AssetCriticalControl_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenFeedback" ADD CONSTRAINT "CitizenFeedback_citizenReportId_fkey" FOREIGN KEY ("citizenReportId") REFERENCES "CitizenReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenFeedback" ADD CONSTRAINT "CitizenFeedback_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenFeedback" ADD CONSTRAINT "CitizenFeedback_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenFeedback" ADD CONSTRAINT "CitizenFeedback_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskSignal" ADD CONSTRAINT "RiskSignal_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskSignal" ADD CONSTRAINT "RiskSignal_detectedBy_fkey" FOREIGN KEY ("detectedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskSignal" ADD CONSTRAINT "RiskSignal_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentalSignal" ADD CONSTRAINT "EnvironmentalSignal_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarginCapacity" ADD CONSTRAINT "MarginCapacity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyResponse" ADD CONSTRAINT "EmergencyResponse_activatedBy_fkey" FOREIGN KEY ("activatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyResponse" ADD CONSTRAINT "EmergencyResponse_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyResponse" ADD CONSTRAINT "EmergencyResponse_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyResponse" ADD CONSTRAINT "EmergencyResponse_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceRecord" ADD CONSTRAINT "ComplianceRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceRecord" ADD CONSTRAINT "ComplianceRecord_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceRecord" ADD CONSTRAINT "ComplianceRecord_criticalControlId_fkey" FOREIGN KEY ("criticalControlId") REFERENCES "CriticalControl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceRecord" ADD CONSTRAINT "ComplianceRecord_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationEvent" ADD CONSTRAINT "EscalationEvent_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationEvent" ADD CONSTRAINT "EscalationEvent_criticalControlId_fkey" FOREIGN KEY ("criticalControlId") REFERENCES "CriticalControl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationEvent" ADD CONSTRAINT "EscalationEvent_escalatedBy_fkey" FOREIGN KEY ("escalatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationEvent" ADD CONSTRAINT "EscalationEvent_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationEvent" ADD CONSTRAINT "EscalationEvent_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrderEvidence" ADD CONSTRAINT "WorkOrderEvidence_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrderEvidence" ADD CONSTRAINT "WorkOrderEvidence_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrderEvidence" ADD CONSTRAINT "WorkOrderEvidence_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionPhoto" ADD CONSTRAINT "InspectionPhoto_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "AssetInspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionPhoto" ADD CONSTRAINT "InspectionPhoto_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionPhoto" ADD CONSTRAINT "InspectionPhoto_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerMetrics" ADD CONSTRAINT "ManagerMetrics_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarginStatus" ADD CONSTRAINT "MarginStatus_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskTrend" ADD CONSTRAINT "RiskTrend_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskTrend" ADD CONSTRAINT "RiskTrend_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoScenario" ADD CONSTRAINT "DemoScenario_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenDashboardStats" ADD CONSTRAINT "CitizenDashboardStats_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetIntelligenceData" ADD CONSTRAINT "AssetIntelligenceData_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

