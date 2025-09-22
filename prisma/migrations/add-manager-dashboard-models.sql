-- Migration: Add Manager Dashboard Models
-- Description: Add database models for Manager Dashboard, Critical Controls, Risk Planner, Margin Management, Demo data, Citizen Dashboard, and Asset Intelligence
-- Date: January 2025

-- Create ManagerMetrics table
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

-- Create MarginStatus table
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

-- Create RiskTrend table
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

-- Create DemoScenario table
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

-- Create CitizenDashboardStats table
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

-- Create AssetIntelligenceData table
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

-- Add foreign key constraints
ALTER TABLE "ManagerMetrics" ADD CONSTRAINT "ManagerMetrics_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MarginStatus" ADD CONSTRAINT "MarginStatus_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "RiskTrend" ADD CONSTRAINT "RiskTrend_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RiskTrend" ADD CONSTRAINT "RiskTrend_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DemoScenario" ADD CONSTRAINT "DemoScenario_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CitizenDashboardStats" ADD CONSTRAINT "CitizenDashboardStats_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AssetIntelligenceData" ADD CONSTRAINT "AssetIntelligenceData_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX "ManagerMetrics_organisationId_idx" ON "ManagerMetrics"("organisationId");
CREATE INDEX "ManagerMetrics_calculatedAt_idx" ON "ManagerMetrics"("calculatedAt");

CREATE INDEX "MarginStatus_organisationId_idx" ON "MarginStatus"("organisationId");
CREATE INDEX "MarginStatus_marginType_idx" ON "MarginStatus"("marginType");
CREATE INDEX "MarginStatus_status_idx" ON "MarginStatus"("status");

CREATE INDEX "RiskTrend_organisationId_idx" ON "RiskTrend"("organisationId");
CREATE INDEX "RiskTrend_assetId_idx" ON "RiskTrend"("assetId");
CREATE INDEX "RiskTrend_calculatedAt_idx" ON "RiskTrend"("calculatedAt");

CREATE INDEX "DemoScenario_organisationId_idx" ON "DemoScenario"("organisationId");
CREATE INDEX "DemoScenario_scenarioType_idx" ON "DemoScenario"("scenarioType");
CREATE INDEX "DemoScenario_isActive_idx" ON "DemoScenario"("isActive");

CREATE INDEX "CitizenDashboardStats_organisationId_idx" ON "CitizenDashboardStats"("organisationId");
CREATE INDEX "CitizenDashboardStats_calculatedAt_idx" ON "CitizenDashboardStats"("calculatedAt");

CREATE INDEX "AssetIntelligenceData_organisationId_idx" ON "AssetIntelligenceData"("organisationId");
CREATE INDEX "AssetIntelligenceData_calculatedAt_idx" ON "AssetIntelligenceData"("calculatedAt");
