-- CreateTable
CREATE TABLE "ServicePurpose" (
  "id" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "criticalControlId" TEXT,
  "priority" "AssetPriority" NOT NULL DEFAULT 'MEDIUM',
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "isCoreFunction" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServicePurpose_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "AssetPurposeMapping" (
  "id" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "servicePurposeId" TEXT NOT NULL,
  "contribution" TEXT NOT NULL,
  "criticality" "AssetPriority" NOT NULL DEFAULT 'MEDIUM',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AssetPurposeMapping_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "RiskRhythmProfile" (
  "id" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "servicePurposeId" TEXT,
  "consequenceScore" INTEGER NOT NULL,
  "likelihoodScore" INTEGER NOT NULL,
  "riskScore" INTEGER NOT NULL,
  "seasonalAdjustment" DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  "weatherAdjustment" DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  "usageAdjustment" DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  "maintenanceFrequency" INTEGER NOT NULL,
  "lastMaintenance" TIMESTAMP(3),
  "nextMaintenance" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "lastCalculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RiskRhythmProfile_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "ResilienceSignal" (
  "id" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "signalType" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "assetId" TEXT,
  "servicePurposeId" TEXT,
  "signalData" JSONB,
  "processedAt" TIMESTAMP(3),
  "responseRequired" BOOLEAN NOT NULL DEFAULT false,
  "responseStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "detectedBy" TEXT,
  "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "respondedBy" TEXT,
  "respondedAt" TIMESTAMP(3),
  "responseActions" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResilienceSignal_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "MarginOperation" (
  "id" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "operationType" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "availableCapacity" INTEGER NOT NULL,
  "utilizedCapacity" INTEGER NOT NULL DEFAULT 0,
  "emergencyThreshold" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
  "lastDeployment" TIMESTAMP(3),
  "deploymentData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MarginOperation_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "DynamicMaintenanceSchedule" (
  "id" TEXT NOT NULL,
  "organisationId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "riskProfileId" TEXT,
  "scheduledDate" TIMESTAMP(3) NOT NULL,
  "maintenanceType" TEXT NOT NULL,
  "priority" "AssetPriority" NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
  "assignedTo" TEXT,
  "completedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DynamicMaintenanceSchedule_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "ServicePurpose_organisationId_idx" ON "ServicePurpose"("organisationId");
-- CreateIndex
CREATE INDEX "ServicePurpose_criticalControlId_idx" ON "ServicePurpose"("criticalControlId");
-- CreateIndex
CREATE INDEX "ServicePurpose_priority_idx" ON "ServicePurpose"("priority");
-- CreateIndex
CREATE INDEX "ServicePurpose_status_idx" ON "ServicePurpose"("status");
-- CreateIndex
CREATE INDEX "AssetPurposeMapping_assetId_idx" ON "AssetPurposeMapping"("assetId");
-- CreateIndex
CREATE INDEX "AssetPurposeMapping_servicePurposeId_idx" ON "AssetPurposeMapping"("servicePurposeId");
-- CreateIndex
CREATE INDEX "AssetPurposeMapping_criticality_idx" ON "AssetPurposeMapping"("criticality");
-- CreateIndex
CREATE INDEX "RiskRhythmProfile_organisationId_idx" ON "RiskRhythmProfile"("organisationId");
-- CreateIndex
CREATE INDEX "RiskRhythmProfile_assetId_idx" ON "RiskRhythmProfile"("assetId");
-- CreateIndex
CREATE INDEX "RiskRhythmProfile_servicePurposeId_idx" ON "RiskRhythmProfile"("servicePurposeId");
-- CreateIndex
CREATE INDEX "RiskRhythmProfile_riskScore_idx" ON "RiskRhythmProfile"("riskScore");
-- CreateIndex
CREATE INDEX "RiskRhythmProfile_nextMaintenance_idx" ON "RiskRhythmProfile"("nextMaintenance");
-- CreateIndex
CREATE INDEX "ResilienceSignal_organisationId_idx" ON "ResilienceSignal"("organisationId");
-- CreateIndex
CREATE INDEX "ResilienceSignal_signalType_idx" ON "ResilienceSignal"("signalType");
-- CreateIndex
CREATE INDEX "ResilienceSignal_severity_idx" ON "ResilienceSignal"("severity");
-- CreateIndex
CREATE INDEX "ResilienceSignal_assetId_idx" ON "ResilienceSignal"("assetId");
-- CreateIndex
CREATE INDEX "ResilienceSignal_servicePurposeId_idx" ON "ResilienceSignal"("servicePurposeId");
-- CreateIndex
CREATE INDEX "MarginOperation_organisationId_idx" ON "MarginOperation"("organisationId");
-- CreateIndex
CREATE INDEX "MarginOperation_operationType_idx" ON "MarginOperation"("operationType");
-- CreateIndex
CREATE INDEX "MarginOperation_resourceType_idx" ON "MarginOperation"("resourceType");
-- CreateIndex
CREATE INDEX "MarginOperation_status_idx" ON "MarginOperation"("status");
-- CreateIndex
CREATE INDEX "DynamicMaintenanceSchedule_organisationId_idx" ON "DynamicMaintenanceSchedule"("organisationId");
-- CreateIndex
CREATE INDEX "DynamicMaintenanceSchedule_assetId_idx" ON "DynamicMaintenanceSchedule"("assetId");
-- CreateIndex
CREATE INDEX "DynamicMaintenanceSchedule_riskProfileId_idx" ON "DynamicMaintenanceSchedule"("riskProfileId");
-- CreateIndex
CREATE INDEX "DynamicMaintenanceSchedule_scheduledDate_idx" ON "DynamicMaintenanceSchedule"("scheduledDate");
-- CreateIndex
CREATE INDEX "DynamicMaintenanceSchedule_priority_idx" ON "DynamicMaintenanceSchedule"("priority");
-- CreateIndex
CREATE INDEX "DynamicMaintenanceSchedule_status_idx" ON "DynamicMaintenanceSchedule"("status");
-- AddForeignKey
ALTER TABLE "ServicePurpose"
ADD CONSTRAINT "ServicePurpose_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "AssetPurposeMapping"
ADD CONSTRAINT "AssetPurposeMapping_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "AssetPurposeMapping"
ADD CONSTRAINT "AssetPurposeMapping_servicePurposeId_fkey" FOREIGN KEY ("servicePurposeId") REFERENCES "ServicePurpose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "RiskRhythmProfile"
ADD CONSTRAINT "RiskRhythmProfile_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "RiskRhythmProfile"
ADD CONSTRAINT "RiskRhythmProfile_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "RiskRhythmProfile"
ADD CONSTRAINT "RiskRhythmProfile_servicePurposeId_fkey" FOREIGN KEY ("servicePurposeId") REFERENCES "ServicePurpose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResilienceSignal"
ADD CONSTRAINT "ResilienceSignal_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResilienceSignal"
ADD CONSTRAINT "ResilienceSignal_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResilienceSignal"
ADD CONSTRAINT "ResilienceSignal_servicePurposeId_fkey" FOREIGN KEY ("servicePurposeId") REFERENCES "ServicePurpose"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResilienceSignal"
ADD CONSTRAINT "ResilienceSignal_detectedBy_fkey" FOREIGN KEY ("detectedBy") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "ResilienceSignal"
ADD CONSTRAINT "ResilienceSignal_respondedBy_fkey" FOREIGN KEY ("respondedBy") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "MarginOperation"
ADD CONSTRAINT "MarginOperation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DynamicMaintenanceSchedule"
ADD CONSTRAINT "DynamicMaintenanceSchedule_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DynamicMaintenanceSchedule"
ADD CONSTRAINT "DynamicMaintenanceSchedule_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DynamicMaintenanceSchedule"
ADD CONSTRAINT "DynamicMaintenanceSchedule_riskProfileId_fkey" FOREIGN KEY ("riskProfileId") REFERENCES "RiskRhythmProfile"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
