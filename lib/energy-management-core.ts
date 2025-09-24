/**
 * Energy Management Core Integration - E21
 *
 * Core energy management system implementing The Aegrid Rules:
 * - Rule 1: Energy purpose mapping and value contribution tracking
 * - Rule 2: Risk-based energy optimisation and maintenance
 * - Rule 3: Critical energy asset monitoring and response
 * - Rule 4: Long-term energy planning and sustainability
 *
 * @fileoverview Energy management core functionality
 */

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { CarbonTrackingSystem, createCarbonTrackingSystem } from './carbon-tracking-system';
import { createEnergyAnalyticsEngine, EnergyAnalyticsEngine } from './energy-analytics-engine';
import { createEnergyOptimisationEngine, EnergyOptimisationEngine } from './energy-optimisation-engine';

// Energy Data Ingestion Schemas

export const EnergyMeterSchema = z.object({
  meterId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  meterType: z.enum(['ELECTRICITY', 'GAS', 'WATER', 'STEAM', 'CHILLED_WATER', 'HOT_WATER', 'SOLAR_PV', 'WIND_TURBINE', 'BATTERY_STORAGE', 'THERMAL_STORAGE', 'OTHER']),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  assetId: z.string().optional(),
  location: z.string().optional(),
  installationDate: z.date().optional(),
  unit: z.string().default('kWh'),
  precision: z.number().int().min(0).max(6).default(4),
  samplingRate: z.number().int().min(1).default(15),
  connectionType: z.string().default('DIRECT'),
  connectionConfig: z.record(z.any()).optional(),
});

export const EnergyConsumptionSchema = z.object({
  meterId: z.string(),
  assetId: z.string().optional(),
  consumptionValue: z.number().positive(),
  consumptionUnit: z.string().default('kWh'),
  timestamp: z.date(),
  powerDemand: z.number().positive().optional(),
  costPerUnit: z.number().positive().optional(),
  totalCost: z.number().positive().optional(),
  dataQuality: z.enum(['GOOD', 'SUSPICIOUS', 'ERROR', 'ESTIMATED']).default('GOOD'),
  source: z.enum(['METER', 'ESTIMATED', 'CALCULATED']).default('METER'),
  temperature: z.number().optional(),
  humidity: z.number().min(0).max(100).optional(),
  occupancy: z.number().int().min(0).optional(),
});

export const EnergyEfficiencySchema = z.object({
  assetId: z.string().optional(),
  meterId: z.string().optional(),
  efficiencyScore: z.number().min(0).max(100),
  benchmarkScore: z.number().min(0).max(100).optional(),
  carbonIntensity: z.number().positive(),
  costPerUnit: z.number().positive(),
  energyUseIndex: z.number().positive().optional(),
  peakDemand: z.number().positive().optional(),
  loadFactor: z.number().min(0).max(100).optional(),
  periodStart: z.date(),
  periodEnd: z.date(),
  periodType: z.enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('DAILY'),
});

export const CarbonEmissionSchema = z.object({
  assetId: z.string().optional(),
  meterId: z.string().optional(),
  scope1Emissions: z.number().min(0),
  scope2Emissions: z.number().min(0),
  scope3Emissions: z.number().min(0).optional(),
  emissionFactor: z.number().positive(),
  energyConsumed: z.number().positive(),
  measurementPeriod: z.date(),
  periodType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('MONTHLY'),
  renewableEnergy: z.number().min(0).optional(),
  carbonOffset: z.number().min(0).optional(),
  reportingStandard: z.string().optional(),
});

// Energy Management Core Class

export class EnergyManagementCore {
  private organisationId: string;
  private analyticsEngine: EnergyAnalyticsEngine;
  private carbonTrackingSystem: CarbonTrackingSystem;
  private optimisationEngine: EnergyOptimisationEngine;

  constructor(organisationId: string) {
    this.organisationId = organisationId;
    this.analyticsEngine = createEnergyAnalyticsEngine(organisationId);
    this.carbonTrackingSystem = createCarbonTrackingSystem(organisationId);
    this.optimisationEngine = createEnergyOptimisationEngine(organisationId);
  }

  // F21.1: Energy Data Ingestion

  /**
   * Register a new energy meter
   */
  async registerEnergyMeter(data: z.infer<typeof EnergyMeterSchema>) {
    try {
      const validatedData = EnergyMeterSchema.parse(data);

      const meter = await prisma.energyMeter.create({
        data: {
          ...validatedData,
          organisationId: this.organisationId,
        },
      });

      return {
        success: true,
        meter,
        message: 'Energy meter registered successfully',
      };
    } catch (error) {
      console.error('Failed to register energy meter:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Ingest energy consumption data
   */
  async ingestEnergyConsumption(data: z.infer<typeof EnergyConsumptionSchema>) {
    try {
      const validatedData = EnergyConsumptionSchema.parse(data);

      // Verify meter exists and is online
      const meter = await prisma.energyMeter.findFirst({
        where: {
          meterId: validatedData.meterId,
          organisationId: this.organisationId,
          isOnline: true,
        },
      });

      if (!meter) {
        throw new Error('Meter not found or offline');
      }

      // Calculate total cost if not provided
      let totalCost = validatedData.totalCost;
      if (!totalCost && validatedData.costPerUnit && validatedData.consumptionValue) {
        totalCost = Number(validatedData.consumptionValue) * Number(validatedData.costPerUnit);
      }

      const consumption = await prisma.energyConsumption.create({
        data: {
          ...validatedData,
          totalCost,
          organisationId: this.organisationId,
          meterId: meter.id,
        },
      });

      // Update meter last reading
      await prisma.energyMeter.update({
        where: { id: meter.id },
        data: { lastReading: validatedData.timestamp },
      });

      // Trigger anomaly detection
      await this.detectEnergyAnomalies(meter.id, validatedData);

      return {
        success: true,
        consumption,
        message: 'Energy consumption data ingested successfully',
      };
    } catch (error) {
      console.error('Failed to ingest energy consumption:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get energy consumption data with filtering
   */
  async getEnergyConsumption(filters: {
    assetId?: string;
    meterId?: string;
    startDate?: Date;
    endDate?: Date;
    periodType?: string;
    limit?: number;
  }) {
    try {
      const where: any = {
        organisationId: this.organisationId,
      };

      if (filters.assetId) where.assetId = filters.assetId;
      if (filters.meterId) where.meterId = filters.meterId;
      if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        if (filters.startDate) where.timestamp.gte = filters.startDate;
        if (filters.endDate) where.timestamp.lte = filters.endDate;
      }

      const consumption = await prisma.energyConsumption.findMany({
        where,
        include: {
          meter: {
            select: {
              meterId: true,
              name: true,
              meterType: true,
              unit: true,
            },
          },
          asset: {
            select: {
              id: true,
              name: true,
              assetNumber: true,
              assetType: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: filters.limit || 1000,
      });

      return {
        success: true,
        data: consumption,
        count: consumption.length,
      };
    } catch (error) {
      console.error('Failed to get energy consumption:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // F21.2: Energy Analytics Engine

  /**
   * Calculate energy efficiency metrics
   */
  async calculateEnergyEfficiency(data: z.infer<typeof EnergyEfficiencySchema>) {
    try {
      const validatedData = EnergyEfficiencySchema.parse(data);

      // Calculate total emissions
      const totalEmissions = validatedData.carbonIntensity * validatedData.costPerUnit;

      // Determine status based on efficiency score
      let status = 'NORMAL';
      let alertLevel: string | null = null;

      if (validatedData.efficiencyScore < 60) {
        status = 'CRITICAL';
        alertLevel = 'CRITICAL';
      } else if (validatedData.efficiencyScore < 75) {
        status = 'WARNING';
        alertLevel = 'HIGH';
      } else if (validatedData.efficiencyScore < 85) {
        alertLevel = 'MEDIUM';
      }

      const efficiencyMetric = await prisma.energyEfficiencyMetric.create({
        data: {
          ...validatedData,
          organisationId: this.organisationId,
          status,
          alertLevel,
        },
      });

      // Trigger alerts if necessary
      if (alertLevel) {
        await this.createEnergyAlert({
          assetId: validatedData.assetId,
          meterId: validatedData.meterId,
          alertType: 'EFFICIENCY_DECLINE',
          severity: alertLevel,
          title: 'Energy Efficiency Decline',
          description: `Energy efficiency has declined to ${validatedData.efficiencyScore}%`,
          actualValue: validatedData.efficiencyScore,
          unit: '%',
        });
      }

      return {
        success: true,
        efficiencyMetric,
        message: 'Energy efficiency calculated successfully',
      };
    } catch (error) {
      console.error('Failed to calculate energy efficiency:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Detect energy consumption anomalies
   */
  async detectEnergyAnomalies(meterId: string, currentReading: z.infer<typeof EnergyConsumptionSchema>) {
    try {
      // Get historical data for comparison (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const historicalData = await prisma.energyConsumption.findMany({
        where: {
          meterId,
          organisationId: this.organisationId,
          timestamp: { gte: thirtyDaysAgo },
          dataQuality: 'GOOD',
        },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });

      if (historicalData.length < 10) {
        // Not enough data for anomaly detection
        return { success: true, anomalies: [] };
      }

      const anomalies = [];

      // Calculate statistical thresholds
      const consumptionValues = historicalData.map(d => Number(d.consumptionValue));
      const mean = consumptionValues.reduce((a, b) => a + b, 0) / consumptionValues.length;
      const variance = consumptionValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / consumptionValues.length;
      const stdDev = Math.sqrt(variance);

      // Check for consumption spike (3 standard deviations above mean)
      const currentValue = Number(currentReading.consumptionValue);
      if (currentValue > mean + (3 * stdDev)) {
        await this.createEnergyAlert({
          meterId,
          assetId: currentReading.assetId,
          alertType: 'CONSUMPTION_SPIKE',
          severity: 'HIGH',
          title: 'Energy Consumption Spike Detected',
          description: `Consumption spike detected: ${currentValue.toFixed(2)} ${currentReading.consumptionUnit} (normal range: ${(mean - stdDev).toFixed(2)} - ${(mean + stdDev).toFixed(2)})`,
          thresholdValue: mean + (3 * stdDev),
          actualValue: currentValue,
          unit: currentReading.consumptionUnit,
        });

        anomalies.push({
          type: 'CONSUMPTION_SPIKE',
          severity: 'HIGH',
          value: currentValue,
          threshold: mean + (3 * stdDev),
        });
      }

      // Check for consumption drop (3 standard deviations below mean)
      if (currentValue < mean - (3 * stdDev)) {
        await this.createEnergyAlert({
          meterId,
          assetId: currentReading.assetId,
          alertType: 'CONSUMPTION_DROP',
          severity: 'MEDIUM',
          title: 'Energy Consumption Drop Detected',
          description: `Consumption drop detected: ${currentValue.toFixed(2)} ${currentReading.consumptionUnit} (normal range: ${(mean - stdDev).toFixed(2)} - ${(mean + stdDev).toFixed(2)})`,
          thresholdValue: mean - (3 * stdDev),
          actualValue: currentValue,
          unit: currentReading.consumptionUnit,
        });

        anomalies.push({
          type: 'CONSUMPTION_DROP',
          severity: 'MEDIUM',
          value: currentValue,
          threshold: mean - (3 * stdDev),
        });
      }

      return {
        success: true,
        anomalies,
        statistics: {
          mean,
          stdDev,
          currentValue,
        },
      };
    } catch (error) {
      console.error('Failed to detect energy anomalies:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // F21.3: Carbon Tracking System

  /**
   * Calculate and record carbon emissions
   */
  async calculateCarbonEmissions(data: z.infer<typeof CarbonEmissionSchema>) {
    try {
      const validatedData = CarbonEmissionSchema.parse(data);

      // Calculate total emissions
      const totalEmissions = validatedData.scope1Emissions + validatedData.scope2Emissions + (validatedData.scope3Emissions || 0);

      // Apply renewable energy offset if available
      const netEmissions = validatedData.renewableEnergy
        ? totalEmissions - (validatedData.renewableEnergy * validatedData.emissionFactor)
        : totalEmissions;

      const carbonEmission = await prisma.carbonEmission.create({
        data: {
          ...validatedData,
          totalEmissions: netEmissions,
          organisationId: this.organisationId,
        },
      });

      // Check for high carbon intensity alert
      if (validatedData.emissionFactor > 0.5) { // 0.5 kg CO2e per kWh threshold
        await this.createEnergyAlert({
          assetId: validatedData.assetId,
          meterId: validatedData.meterId,
          alertType: 'CARBON_INTENSITY_HIGH',
          severity: 'HIGH',
          title: 'High Carbon Intensity Detected',
          description: `Carbon intensity is ${validatedData.emissionFactor.toFixed(4)} kg CO2e/kWh, exceeding threshold`,
          actualValue: validatedData.emissionFactor,
          unit: 'kg CO2e/kWh',
        });
      }

      return {
        success: true,
        carbonEmission,
        message: 'Carbon emissions calculated successfully',
      };
    } catch (error) {
      console.error('Failed to calculate carbon emissions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get carbon emissions summary
   */
  async getCarbonEmissionsSummary(period: string = 'MONTHLY') {
    try {
      const now = new Date();
      const startOfPeriod = new Date();

      switch (period) {
        case 'DAILY':
          startOfPeriod.setDate(now.getDate() - 1);
          break;
        case 'WEEKLY':
          startOfPeriod.setDate(now.getDate() - 7);
          break;
        case 'MONTHLY':
          startOfPeriod.setMonth(now.getMonth() - 1);
          break;
        case 'YEARLY':
          startOfPeriod.setFullYear(now.getFullYear() - 1);
          break;
      }

      const emissions = await prisma.carbonEmission.findMany({
        where: {
          organisationId: this.organisationId,
          measurementPeriod: { gte: startOfPeriod },
        },
        include: {
          asset: {
            select: {
              name: true,
              assetNumber: true,
            },
          },
        },
      });

      const summary = emissions.reduce((acc, emission) => {
        acc.totalScope1 += Number(emission.scope1Emissions);
        acc.totalScope2 += Number(emission.scope2Emissions);
        acc.totalScope3 += Number(emission.scope3Emissions || 0);
        acc.totalEmissions += Number(emission.totalEmissions);
        acc.totalRenewable += Number(emission.renewableEnergy || 0);
        acc.totalOffset += Number(emission.carbonOffset || 0);
        return acc;
      }, {
        totalScope1: 0,
        totalScope2: 0,
        totalScope3: 0,
        totalEmissions: 0,
        totalRenewable: 0,
        totalOffset: 0,
        count: emissions.length,
      });

      return {
        success: true,
        summary,
        period,
        emissions,
      };
    } catch (error) {
      console.error('Failed to get carbon emissions summary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // F21.4: Energy Optimisation Engine

  /**
   * Create energy optimisation action
   */
  async createOptimisationAction(action: {
    assetId?: string;
    systemType: string;
    actionType: string;
    description: string;
    parameters?: Record<string, any>;
    scheduledAt?: Date;
    expectedSavings?: number;
  }) {
    try {
      const optimisationAction = await prisma.energyOptimisationAction.create({
        data: {
          ...action,
          organisationId: this.organisationId,
          status: 'PENDING',
        },
      });

      return {
        success: true,
        action: optimisationAction,
        message: 'Optimisation action created successfully',
      };
    } catch (error) {
      console.error('Failed to create optimisation action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute energy optimisation action
   */
  async executeOptimisationAction(actionId: string) {
    try {
      const action = await prisma.energyOptimisationAction.findFirst({
        where: {
          id: actionId,
          organisationId: this.organisationId,
        },
      });

      if (!action) {
        throw new Error('Optimisation action not found');
      }

      if (action.status !== 'PENDING') {
        throw new Error('Action is not in pending status');
      }

      // Update status to executing
      await prisma.energyOptimisationAction.update({
        where: { id: actionId },
        data: {
          status: 'EXECUTING',
          executedAt: new Date(),
        },
      });

      // Simulate action execution (in real implementation, this would interface with BMS/EMS)
      const executionLog = {
        startedAt: new Date().toISOString(),
        systemType: action.systemType,
        actionType: action.actionType,
        parameters: action.parameters,
        status: 'IN_PROGRESS',
      };

      // Update with execution log
      await prisma.energyOptimisationAction.update({
        where: { id: actionId },
        data: {
          executionLog,
        },
      });

      return {
        success: true,
        actionId,
        message: 'Optimisation action execution started',
      };
    } catch (error) {
      console.error('Failed to execute optimisation action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Utility Methods

  /**
   * Create energy alert
   */
  private async createEnergyAlert(alert: {
    assetId?: string;
    meterId?: string;
    alertType: string;
    severity: string;
    title: string;
    description: string;
    alertData?: Record<string, any>;
    thresholdValue?: number;
    actualValue?: number;
    unit?: string;
  }) {
    try {
      const energyAlert = await prisma.energyAlert.create({
        data: {
          ...alert,
          organisationId: this.organisationId,
          status: 'ACTIVE',
          detectedAt: new Date(),
        },
      });

      return energyAlert;
    } catch (error) {
      console.error('Failed to create energy alert:', error);
      return null;
    }
  }

  /**
   * Get energy dashboard data
   */
  async getEnergyDashboard() {
    try {
      // Get recent consumption data
      const recentConsumption = await this.getEnergyConsumption({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        limit: 100,
      });

      // Get active alerts
      const activeAlerts = await prisma.energyAlert.findMany({
        where: {
          organisationId: this.organisationId,
          status: 'ACTIVE',
        },
        include: {
          asset: {
            select: {
              name: true,
              assetNumber: true,
            },
          },
          meter: {
            select: {
              name: true,
              meterType: true,
            },
          },
        },
        orderBy: { detectedAt: 'desc' },
        take: 10,
      });

      // Get energy efficiency metrics
      const efficiencyMetrics = await prisma.energyEfficiencyMetric.findMany({
        where: {
          organisationId: this.organisationId,
          periodStart: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        },
        include: {
          asset: {
            select: {
              name: true,
              assetNumber: true,
            },
          },
        },
        orderBy: { periodStart: 'desc' },
        take: 20,
      });

      // Get carbon emissions summary
      const carbonSummary = await this.getCarbonEmissionsSummary('MONTHLY');

      // Get optimisation actions
      const optimisationActions = await prisma.energyOptimisationAction.findMany({
        where: {
          organisationId: this.organisationId,
          status: { in: ['PENDING', 'EXECUTING'] },
        },
        include: {
          asset: {
            select: {
              name: true,
              assetNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      return {
        success: true,
        dashboard: {
          recentConsumption: recentConsumption.success ? recentConsumption.data : [],
          activeAlerts,
          efficiencyMetrics,
          carbonSummary: carbonSummary.success ? carbonSummary.summary : null,
          optimisationActions,
        },
      };
    } catch (error) {
      console.error('Failed to get energy dashboard:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Advanced Analytics Methods (F21.2)

  /**
   * Perform advanced energy consumption analysis
   */
  async performAdvancedConsumptionAnalysis(assetId?: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
    try {
      const analysis = await this.analyticsEngine.analyzeConsumptionPatterns(assetId, period);
      return { success: true, analysis };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Calculate advanced efficiency metrics with benchmarking
   */
  async calculateAdvancedEfficiency(assetId: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
    try {
      const analysis = await this.analyticsEngine.calculateAdvancedEfficiency(assetId, period);
      return { success: true, analysis };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Detect energy anomalies using advanced algorithms
   */
  async detectAdvancedAnomalies(assetId?: string, detectionMethod: 'statistical' | 'machine_learning' | 'hybrid' = 'hybrid') {
    try {
      const detection = await this.analyticsEngine.detectAdvancedAnomalies(assetId, detectionMethod);
      return { success: true, detection };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Perform comprehensive cost analysis with forecasting
   */
  async performAdvancedCostAnalysis(assetId?: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
    try {
      const analysis = await this.analyticsEngine.performCostAnalysis(assetId, period);
      return { success: true, analysis };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate comprehensive energy intelligence report
   */
  async generateEnergyIntelligenceReport(assetId?: string, period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' = 'monthly') {
    try {
      const report = await this.analyticsEngine.generateEnergyIntelligenceReport(assetId, period);
      return { success: true, report };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Advanced Carbon Tracking Methods (F21.3)

  /**
   * Calculate comprehensive carbon footprint with Scope 1, 2, 3 breakdown
   */
  async calculateComprehensiveCarbonFootprint(assetId?: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
    try {
      const footprint = await this.carbonTrackingSystem.calculateCarbonFootprint(assetId, period);
      return { success: true, footprint };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate detailed scope breakdown analysis
   */
  async generateScopeBreakdown(assetId?: string, period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') {
    try {
      const breakdown = await this.carbonTrackingSystem.generateScopeBreakdown(assetId, period);
      return { success: true, breakdown };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Calculate sustainability metrics and ESG rating
   */
  async calculateSustainabilityMetrics(assetId?: string) {
    try {
      const metrics = await this.carbonTrackingSystem.calculateSustainabilityMetrics(assetId);
      return { success: true, metrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate carbon emission forecasts
   */
  async generateCarbonForecasts(assetId?: string, scenarios: ('baseline' | 'optimistic' | 'pessimistic')[] = ['baseline']) {
    try {
      const forecasts = await this.carbonTrackingSystem.generateCarbonForecasts(assetId, scenarios);
      return { success: true, forecasts };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate comprehensive sustainability report
   */
  async generateSustainabilityReport(assetId?: string, period: 'quarterly' | 'yearly' = 'yearly') {
    try {
      const report = await this.carbonTrackingSystem.generateSustainabilityReport(assetId, period);
      return { success: true, report };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Track carbon offset projects and credits
   */
  async trackCarbonOffset(projectId: string, projectType: 'tree_planting' | 'renewable_credits' | 'carbon_capture', quantity: number, verification: string) {
    try {
      const result = await this.carbonTrackingSystem.trackCarbonOffset(projectId, projectType, quantity, verification);
      return { success: result.success, offsetAmount: result.offsetAmount, error: result.error };
    } catch (error) {
      return {
        success: false,
        offsetAmount: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Monitor carbon intensity trends and create alerts
   */
  async monitorCarbonIntensity(assetId?: string) {
    try {
      await this.carbonTrackingSystem.monitorCarbonIntensity(assetId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Advanced Optimization Methods (F21.4)

  /**
   * Analyze current load profile and identify optimization opportunities
   */
  async analyzeLoadProfile(assetId?: string, timeWindow: number = 24) {
    try {
      const profile = await this.optimisationEngine.analyzeLoadProfile(assetId, timeWindow);
      return { success: true, profile };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate load balancing strategies based on current load profile
   */
  async generateLoadBalancingStrategies(assetId?: string) {
    try {
      const strategies = await this.optimisationEngine.generateLoadBalancingStrategies(assetId);
      return { success: true, strategies };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Manage peak demand through automated controls and optimization
   */
  async managePeakDemand(assetId?: string, targetReduction: number = 15) {
    try {
      const management = await this.optimisationEngine.managePeakDemand(assetId, targetReduction);
      return { success: true, management };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Optimize equipment efficiency through intelligent scheduling and control
   */
  async optimizeEquipmentEfficiency(assetId?: string) {
    try {
      const optimizations = await this.optimisationEngine.optimizeEquipmentEfficiency(assetId);
      return { success: true, optimizations };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute real-time optimization based on current conditions
   */
  async executeRealTimeOptimization(assetId?: string) {
    try {
      const result = await this.optimisationEngine.executeRealTimeOptimization(assetId);
      return { success: true, result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get real-time optimization status and performance metrics
   */
  async getRealTimeOptimizationStatus(assetId?: string) {
    try {
      const status = await this.optimisationEngine.getRealTimeOptimizationStatus(assetId);
      return { success: true, status };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create and execute advanced optimization actions
   */
  async createAdvancedOptimizationAction(assetId: string, actionType: string, parameters: any, scheduledAt?: Date) {
    try {
      const action = await this.optimisationEngine.createOptimizationAction(assetId, actionType, parameters, scheduledAt);
      return { success: true, action };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute advanced optimization actions
   */
  async executeAdvancedOptimizationAction(actionId: string) {
    try {
      const result = await this.optimisationEngine.executeOptimizationAction(actionId);
      return { success: result.success, result: result.result, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance factory
export function createEnergyManagementCore(organisationId: string) {
  return new EnergyManagementCore(organisationId);
}
