/**
 * Energy Optimisation Engine - F21.4
 *
 * Advanced energy optimization with automated controls, load balancing,
 * peak demand management, and equipment efficiency optimization
 *
 * Implements The Aegrid Rules for intelligent energy asset management
 *
 * @fileoverview Energy optimization engine with smart automation and controls
 */

import { Asset, EnergyOptimisationAction } from '@prisma/client';
import { prisma } from './prisma';

export interface OptimisationConfig {
  organisationId: string;
  peakDemandThreshold: number; // kW
  loadBalancingEnabled: boolean;
  automatedControlsEnabled: boolean;
  optimizationAlgorithms: {
    loadBalancing: boolean;
    peakShaving: boolean;
    demandResponse: boolean;
    equipmentEfficiency: boolean;
    renewableIntegration: boolean;
  };
  safetyLimits: {
    maxLoadReduction: number; // Percentage
    minEquipmentRuntime: number; // Minutes
    temperatureLimits: {
      min: number;
      max: number;
    };
  };
  costOptimization: {
    peakRateThreshold: number; // $/kWh
    demandChargeThreshold: number; // $/kW
    optimizationWindow: number; // Hours
  };
}

export interface LoadProfile {
  timestamp: Date;
  totalLoad: number;
  baseLoad: number;
  peakLoad: number;
  loadFactor: number;
  demandPattern: 'stable' | 'variable' | 'peaky';
  optimizationPotential: number;
}

export interface LoadBalancingStrategy {
  strategy: 'peak_shaving' | 'load_shift' | 'demand_response' | 'equipment_cycling';
  description: string;
  expectedReduction: number;
  implementationCost: number;
  paybackPeriod: number;
  riskLevel: 'low' | 'medium' | 'high';
  affectedSystems: string[];
}

export interface PeakDemandManagement {
  currentPeak: number;
  historicalPeak: number;
  peakReductionPotential: number;
  peakShavingActions: PeakShavingAction[];
  demandResponsePrograms: DemandResponseProgram[];
  costSavings: number;
}

export interface PeakShavingAction {
  id: string;
  type: 'load_reduction' | 'equipment_cycling' | 'battery_discharge' | 'generator_start';
  description: string;
  loadReduction: number;
  duration: number; // Minutes
  cost: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  automated: boolean;
}

export interface DemandResponseProgram {
  programName: string;
  provider: string;
  capacity: number;
  pricePerKW: number;
  availability: 'available' | 'enrolled' | 'active';
  nextEvent: Date | null;
  annualSavings: number;
}

export interface EquipmentEfficiencyOptimization {
  equipmentId: string;
  equipmentType: string;
  currentEfficiency: number;
  optimalEfficiency: number;
  improvementPotential: number;
  optimizationActions: EquipmentOptimizationAction[];
  maintenanceRecommendations: MaintenanceRecommendation[];
}

export interface EquipmentOptimizationAction {
  action: 'schedule_optimization' | 'setpoint_adjustment' | 'load_balancing' | 'maintenance_schedule';
  description: string;
  expectedImprovement: number;
  implementationTime: number; // Hours
  cost: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface MaintenanceRecommendation {
  type: 'preventive' | 'predictive' | 'corrective';
  description: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: number;
  expectedSavings: number;
  recommendedDate: Date;
}

export interface OptimizationResult {
  optimizationId: string;
  timestamp: Date;
  strategy: string;
  actionsExecuted: string[];
  loadReduction: number;
  costSavings: number;
  energySavings: number;
  success: boolean;
  errors: string[];
  nextOptimization: Date;
}

export interface RealTimeOptimization {
  currentLoad: number;
  targetLoad: number;
  optimizationStatus: 'idle' | 'optimizing' | 'peak_shaving' | 'load_balancing';
  activeActions: ActiveOptimizationAction[];
  systemPerformance: SystemPerformanceMetrics;
  alerts: OptimizationAlert[];
}

export interface ActiveOptimizationAction {
  actionId: string;
  type: string;
  startTime: Date;
  expectedDuration: number;
  currentStatus: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number; // Percentage
}

export interface SystemPerformanceMetrics {
  overallEfficiency: number;
  loadFactor: number;
  peakDemand: number;
  energyCost: number;
  carbonIntensity: number;
  equipmentUtilization: number;
}

export interface OptimizationAlert {
  id: string;
  type: 'performance_degradation' | 'equipment_failure' | 'optimization_failure' | 'safety_limit_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  actionRequired: boolean;
}

export class EnergyOptimisationEngine {
  private organisationId: string;
  private config: OptimisationConfig;

  constructor(organisationId: string, config?: Partial<OptimisationConfig>) {
    this.organisationId = organisationId;
    this.config = {
      organisationId,
      peakDemandThreshold: config?.peakDemandThreshold || 1000, // kW
      loadBalancingEnabled: config?.loadBalancingEnabled ?? true,
      automatedControlsEnabled: config?.automatedControlsEnabled ?? true,
      optimizationAlgorithms: config?.optimizationAlgorithms || {
        loadBalancing: true,
        peakShaving: true,
        demandResponse: true,
        equipmentEfficiency: true,
        renewableIntegration: true,
      },
      safetyLimits: config?.safetyLimits || {
        maxLoadReduction: 20, // 20%
        minEquipmentRuntime: 15, // 15 minutes
        temperatureLimits: { min: 18, max: 26 }, // Celsius
      },
      costOptimization: config?.costOptimization || {
        peakRateThreshold: 0.5, // $/kWh
        demandChargeThreshold: 15, // $/kW
        optimizationWindow: 4, // 4 hours
      },
    };
  }

  /**
   * Analyze current load profile and identify optimization opportunities
   */
  async analyzeLoadProfile(
    assetId?: string,
    timeWindow: number = 24 // hours
  ): Promise<LoadProfile> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - timeWindow * 60 * 60 * 1000);

    const consumptionData = await prisma.energyConsumption.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: startTime, lte: endTime },
        dataQuality: 'GOOD',
      },
      orderBy: { timestamp: 'asc' },
    });

    if (consumptionData.length === 0) {
      throw new Error('No consumption data available for load analysis');
    }

    const loads = consumptionData.map(d => d.powerDemand || 0);
    const totalLoad = loads.reduce((sum, load) => sum + load, 0);
    const averageLoad = totalLoad / loads.length;
    const peakLoad = Math.max(...loads);
    const baseLoad = this.calculateBaseLoad(loads);
    const loadFactor = (averageLoad / peakLoad) * 100;

    const demandPattern = this.analyzeDemandPattern(loads);
    const optimizationPotential = this.calculateOptimizationPotential(loads, peakLoad);

    return {
      timestamp: endTime,
      totalLoad,
      baseLoad,
      peakLoad,
      loadFactor,
      demandPattern,
      optimizationPotential,
    };
  }

  /**
   * Generate load balancing strategies based on current load profile
   */
  async generateLoadBalancingStrategies(
    assetId?: string
  ): Promise<LoadBalancingStrategy[]> {
    const loadProfile = await this.analyzeLoadProfile(assetId);
    const strategies: LoadBalancingStrategy[] = [];

    // Peak Shaving Strategy
    if (this.config.optimizationAlgorithms.peakShaving && loadProfile.peakLoad > this.config.peakDemandThreshold) {
      const peakReduction = loadProfile.peakLoad - this.config.peakDemandThreshold;
      strategies.push({
        strategy: 'peak_shaving',
        description: `Reduce peak demand by ${peakReduction.toFixed(1)} kW through load scheduling and equipment cycling`,
        expectedReduction: peakReduction,
        implementationCost: 5000,
        paybackPeriod: 2,
        riskLevel: 'low',
        affectedSystems: ['HVAC', 'Lighting', 'Process Equipment'],
      });
    }

    // Load Shifting Strategy
    if (loadProfile.demandPattern === 'peaky') {
      strategies.push({
        strategy: 'load_shift',
        description: 'Shift non-critical loads to off-peak periods to reduce peak demand',
        expectedReduction: loadProfile.peakLoad * 0.15,
        implementationCost: 10000,
        paybackPeriod: 3,
        riskLevel: 'low',
        affectedSystems: ['Water Heating', 'Battery Charging', 'Non-Critical Equipment'],
      });
    }

    // Demand Response Strategy
    if (this.config.optimizationAlgorithms.demandResponse) {
      strategies.push({
        strategy: 'demand_response',
        description: 'Participate in utility demand response programs for additional revenue',
        expectedReduction: loadProfile.peakLoad * 0.2,
        implementationCost: 15000,
        paybackPeriod: 1.5,
        riskLevel: 'medium',
        affectedSystems: ['All Systems'],
      });
    }

    // Equipment Cycling Strategy
    if (loadProfile.loadFactor < 70) {
      strategies.push({
        strategy: 'equipment_cycling',
        description: 'Optimize equipment cycling patterns to improve load factor',
        expectedReduction: loadProfile.peakLoad * 0.1,
        implementationCost: 8000,
        paybackPeriod: 2.5,
        riskLevel: 'medium',
        affectedSystems: ['HVAC', 'Process Equipment'],
      });
    }

    return strategies.sort((a, b) => a.paybackPeriod - b.paybackPeriod);
  }

  /**
   * Manage peak demand through automated controls and optimization
   */
  async managePeakDemand(
    assetId?: string,
    targetReduction: number = 15 // Percentage
  ): Promise<PeakDemandManagement> {
    const loadProfile = await this.analyzeLoadProfile(assetId, 1); // Last hour
    const historicalPeak = await this.getHistoricalPeak(assetId);

    const currentPeak = loadProfile.peakLoad;
    const peakReductionPotential = currentPeak * (targetReduction / 100);

    const peakShavingActions = await this.generatePeakShavingActions(assetId, peakReductionPotential);
    const demandResponsePrograms = await this.getDemandResponsePrograms();
    const costSavings = this.calculatePeakDemandSavings(peakReductionPotential);

    return {
      currentPeak,
      historicalPeak,
      peakReductionPotential,
      peakShavingActions,
      demandResponsePrograms,
      costSavings,
    };
  }

  /**
   * Optimize equipment efficiency through intelligent scheduling and control
   */
  async optimizeEquipmentEfficiency(assetId?: string): Promise<EquipmentEfficiencyOptimization[]> {
    const assets = await prisma.asset.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
      },
      include: {
        energyConsumptions: {
          where: {
            timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
          },
          orderBy: { timestamp: 'desc' },
        },
        energyEfficiencyMetrics: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const optimizations: EquipmentEfficiencyOptimization[] = [];

    for (const asset of assets) {
      if (asset.energyEfficiencyMetrics.length === 0) continue;

      const currentEfficiency = asset.energyEfficiencyMetrics[0].efficiencyScore;
      const optimalEfficiency = this.calculateOptimalEfficiency(asset.assetType);
      const improvementPotential = optimalEfficiency - currentEfficiency;

      if (improvementPotential > 5) { // Only optimize if improvement > 5%
        const optimizationActions = this.generateEquipmentOptimizationActions(asset);
        const maintenanceRecommendations = await this.generateMaintenanceRecommendations(asset);

        optimizations.push({
          equipmentId: asset.id,
          equipmentType: asset.assetType,
          currentEfficiency,
          optimalEfficiency,
          improvementPotential,
          optimizationActions,
          maintenanceRecommendations,
        });
      }
    }

    return optimizations;
  }

  /**
   * Execute real-time optimization based on current conditions
   */
  async executeRealTimeOptimization(assetId?: string): Promise<OptimizationResult> {
    const optimizationId = `opt-${Date.now()}`;
    const timestamp = new Date();

    try {
      const loadProfile = await this.analyzeLoadProfile(assetId, 1); // Last hour
      const strategies = await this.generateLoadBalancingStrategies(assetId);

      let actionsExecuted: string[] = [];
      let loadReduction = 0;
      let costSavings = 0;
      let energySavings = 0;
      let errors: string[] = [];

      // Execute highest priority strategy
      if (strategies.length > 0) {
        const primaryStrategy = strategies[0];

        switch (primaryStrategy.strategy) {
          case 'peak_shaving':
            const peakResult = await this.executePeakShaving(assetId, primaryStrategy.expectedReduction);
            actionsExecuted.push(...peakResult.actions);
            loadReduction += peakResult.loadReduction;
            costSavings += peakResult.costSavings;
            energySavings += peakResult.energySavings;
            if (peakResult.errors.length > 0) errors.push(...peakResult.errors);
            break;

          case 'load_shift':
            const shiftResult = await this.executeLoadShift(assetId, primaryStrategy.expectedReduction);
            actionsExecuted.push(...shiftResult.actions);
            loadReduction += shiftResult.loadReduction;
            costSavings += shiftResult.costSavings;
            energySavings += shiftResult.energySavings;
            if (shiftResult.errors.length > 0) errors.push(...shiftResult.errors);
            break;

          case 'equipment_cycling':
            const cycleResult = await this.executeEquipmentCycling(assetId, primaryStrategy.expectedReduction);
            actionsExecuted.push(...cycleResult.actions);
            loadReduction += cycleResult.loadReduction;
            costSavings += cycleResult.costSavings;
            energySavings += cycleResult.energySavings;
            if (cycleResult.errors.length > 0) errors.push(...cycleResult.errors);
            break;
        }
      }

      // Schedule next optimization
      const nextOptimization = new Date(timestamp.getTime() + 15 * 60 * 1000); // 15 minutes

      const result: OptimizationResult = {
        optimizationId,
        timestamp,
        strategy: strategies.length > 0 ? strategies[0].strategy : 'none',
        actionsExecuted,
        loadReduction,
        costSavings,
        energySavings,
        success: errors.length === 0,
        errors,
        nextOptimization,
      };

      // Store optimization result
      await this.storeOptimizationResult(result, assetId);

      return result;

    } catch (error) {
      return {
        optimizationId,
        timestamp,
        strategy: 'error',
        actionsExecuted: [],
        loadReduction: 0,
        costSavings: 0,
        energySavings: 0,
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        nextOptimization: new Date(timestamp.getTime() + 60 * 60 * 1000), // 1 hour
      };
    }
  }

  /**
   * Get real-time optimization status and performance metrics
   */
  async getRealTimeOptimizationStatus(assetId?: string): Promise<RealTimeOptimization> {
    const currentLoad = await this.getCurrentLoad(assetId);
    const targetLoad = await this.calculateTargetLoad(assetId);

    const optimizationStatus = this.determineOptimizationStatus(currentLoad, targetLoad);
    const activeActions = await this.getActiveOptimizationActions(assetId);
    const systemPerformance = await this.getSystemPerformanceMetrics(assetId);
    const alerts = await this.getOptimizationAlerts(assetId);

    return {
      currentLoad,
      targetLoad,
      optimizationStatus,
      activeActions,
      systemPerformance,
      alerts,
    };
  }

  /**
   * Create and execute optimization actions
   */
  async createOptimizationAction(
    assetId: string,
    actionType: string,
    parameters: any,
    scheduledAt?: Date
  ): Promise<EnergyOptimisationAction> {
    const action = await prisma.energyOptimisationAction.create({
      data: {
        organisationId: this.organisationId,
        assetId,
        systemType: parameters.systemType || 'GENERAL',
        actionType: actionType as any,
        description: parameters.description || `Optimization action: ${actionType}`,
        parameters,
        status: scheduledAt ? 'PENDING' : 'READY',
        scheduledAt: scheduledAt || new Date(),
        expectedSavings: parameters.expectedSavings || 0,
        metadata: {
          createdBy: 'optimization_engine',
          priority: parameters.priority || 'medium',
        },
      },
    });

    // If not scheduled, execute immediately
    if (!scheduledAt) {
      await this.executeOptimizationAction(action.id);
    }

    return action;
  }

  /**
   * Execute a specific optimization action
   */
  async executeOptimizationAction(actionId: string): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      const action = await prisma.energyOptimisationAction.findUnique({
        where: { id: actionId },
      });

      if (!action) {
        return { success: false, error: 'Action not found' };
      }

      // Update action status to executing
      await prisma.energyOptimisationAction.update({
        where: { id: actionId },
        data: {
          status: 'EXECUTING',
          executedAt: new Date(),
        },
      });

      let result: any = {};

      // Execute based on action type
      switch (action.actionType) {
        case 'SCHEDULE_ADJUSTMENT':
          result = await this.executeScheduleAdjustment(action);
          break;
        case 'SETPOINT_OPTIMIZATION':
          result = await this.executeSetpointOptimization(action);
          break;
        case 'LOAD_BALANCING':
          result = await this.executeLoadBalancing(action);
          break;
        case 'EQUIPMENT_CYCLING':
          result = await this.executeEquipmentCycling(action);
          break;
        default:
          result = { success: false, error: 'Unknown action type' };
      }

      // Update action status based on result
      await prisma.energyOptimisationAction.update({
        where: { id: actionId },
        data: {
          status: result.success ? 'COMPLETED' : 'FAILED',
          completedAt: new Date(),
          actualSavings: result.savings || 0,
          metadata: {
            ...action.metadata,
            executionResult: result,
          },
        },
      });

      return { success: result.success, result };

    } catch (error) {
      // Update action status to failed
      await prisma.energyOptimisationAction.update({
        where: { id: actionId },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      });

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Private helper methods

  private calculateBaseLoad(loads: number[]): number {
    // Use 25th percentile as base load
    const sorted = [...loads].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.25);
    return sorted[index];
  }

  private analyzeDemandPattern(loads: number[]): 'stable' | 'variable' | 'peaky' {
    const average = loads.reduce((sum, load) => sum + load, 0) / loads.length;
    const variance = loads.reduce((sum, load) => sum + Math.pow(load - average, 2), 0) / loads.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = stdDev / average;

    if (coefficient < 0.1) return 'stable';
    if (coefficient < 0.3) return 'variable';
    return 'peaky';
  }

  private calculateOptimizationPotential(loads: number[], peakLoad: number): number {
    const average = loads.reduce((sum, load) => sum + load, 0) / loads.length;
    const loadFactor = (average / peakLoad) * 100;

    // Higher optimization potential for lower load factors
    return Math.max(0, 100 - loadFactor);
  }

  private async getHistoricalPeak(assetId?: string): Promise<number> {
    const historicalData = await prisma.energyConsumption.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      },
      orderBy: { powerDemand: 'desc' },
      take: 1,
    });

    return historicalData.length > 0 ? (historicalData[0].powerDemand || 0) : 0;
  }

  private async generatePeakShavingActions(
    assetId: string | undefined,
    targetReduction: number
  ): Promise<PeakShavingAction[]> {
    const actions: PeakShavingAction[] = [];
    let remainingReduction = targetReduction;

    // Load reduction actions
    if (remainingReduction > 0) {
      const loadReduction = Math.min(remainingReduction * 0.4, 200); // Max 200 kW
      actions.push({
        id: `ps-load-${Date.now()}`,
        type: 'load_reduction',
        description: `Reduce non-critical loads by ${loadReduction.toFixed(1)} kW`,
        loadReduction,
        duration: 30, // 30 minutes
        cost: 0,
        priority: 'high',
        automated: true,
      });
      remainingReduction -= loadReduction;
    }

    // Equipment cycling actions
    if (remainingReduction > 0) {
      const cyclingReduction = Math.min(remainingReduction * 0.6, 150); // Max 150 kW
      actions.push({
        id: `ps-cycle-${Date.now()}`,
        type: 'equipment_cycling',
        description: `Cycle equipment to reduce load by ${cyclingReduction.toFixed(1)} kW`,
        loadReduction: cyclingReduction,
        duration: 20, // 20 minutes
        cost: 50,
        priority: 'medium',
        automated: true,
      });
    }

    return actions;
  }

  private async getDemandResponsePrograms(): Promise<DemandResponseProgram[]> {
    // Mock demand response programs - would integrate with utility APIs
    return [
      {
        programName: 'Peak Time Rebate',
        provider: 'Local Utility Co.',
        capacity: 500,
        pricePerKW: 0.5,
        availability: 'available',
        nextEvent: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        annualSavings: 5000,
      },
      {
        programName: 'Emergency Demand Response',
        provider: 'Grid Operator',
        capacity: 1000,
        pricePerKW: 2.0,
        availability: 'enrolled',
        nextEvent: null,
        annualSavings: 15000,
      },
    ];
  }

  private calculatePeakDemandSavings(peakReduction: number): number {
    // Calculate savings based on demand charges
    const demandChargeRate = this.config.costOptimization.demandChargeThreshold;
    const annualSavings = peakReduction * demandChargeRate * 12; // Monthly demand charges
    return annualSavings;
  }

  private calculateOptimalEfficiency(assetType: string): number {
    // Define optimal efficiency by asset type
    const optimalEfficiencies: { [key: string]: number } = {
      'BUILDING': 90,
      'HVAC': 85,
      'LIGHTING': 95,
      'MOTOR': 88,
      'PUMP': 82,
      'COMPRESSOR': 80,
      'GENERATOR': 75,
    };

    return optimalEfficiencies[assetType] || 80;
  }

  private generateEquipmentOptimizationActions(asset: Asset): EquipmentOptimizationAction[] {
    const actions: EquipmentOptimizationAction[] = [];

    // Schedule optimization
    actions.push({
      action: 'schedule_optimization',
      description: 'Optimize equipment schedule based on load patterns',
      expectedImprovement: 5,
      implementationTime: 2,
      cost: 1000,
      priority: 'medium',
    });

    // Setpoint adjustment
    if (asset.assetType === 'HVAC') {
      actions.push({
        action: 'setpoint_adjustment',
        description: 'Optimize temperature setpoints for energy efficiency',
        expectedImprovement: 8,
        implementationTime: 1,
        cost: 500,
        priority: 'high',
      });
    }

    // Load balancing
    actions.push({
      action: 'load_balancing',
      description: 'Balance load across multiple equipment units',
      expectedImprovement: 6,
      implementationTime: 4,
      cost: 2000,
      priority: 'medium',
    });

    return actions.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async generateMaintenanceRecommendations(asset: Asset): Promise<MaintenanceRecommendation[]> {
    const recommendations: MaintenanceRecommendation[] = [];

    // Check if maintenance is due based on efficiency metrics
    const latestEfficiency = asset.energyEfficiencyMetrics[0];
    if (latestEfficiency.efficiencyScore < 70) {
      recommendations.push({
        type: 'preventive',
        description: 'Schedule preventive maintenance to improve efficiency',
        urgency: 'high',
        estimatedCost: 2000,
        expectedSavings: 5000,
        recommendedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      });
    }

    // Predictive maintenance based on consumption patterns
    const consumptionData = asset.energyConsumptions;
    if (consumptionData.length > 10) {
      const recentConsumption = consumptionData.slice(0, 5);
      const olderConsumption = consumptionData.slice(5, 10);

      const recentAvg = recentConsumption.reduce((sum, c) => sum + c.consumptionValue, 0) / recentConsumption.length;
      const olderAvg = olderConsumption.reduce((sum, c) => sum + c.consumptionValue, 0) / olderConsumption.length;

      if (recentAvg > olderAvg * 1.1) { // 10% increase
        recommendations.push({
          type: 'predictive',
          description: 'Increased consumption detected - investigate equipment condition',
          urgency: 'medium',
          estimatedCost: 500,
          expectedSavings: 2000,
          recommendedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        });
      }
    }

    return recommendations;
  }

  private async executePeakShaving(
    assetId: string | undefined,
    targetReduction: number
  ): Promise<{ actions: string[]; loadReduction: number; costSavings: number; energySavings: number; errors: string[] }> {
    const actions: string[] = [];
    const errors: string[] = [];

    try {
      // Execute peak shaving actions
      const peakShavingActions = await this.generatePeakShavingActions(assetId, targetReduction);

      for (const action of peakShavingActions) {
        try {
          await this.createOptimizationAction(
            assetId || 'organization-wide',
            'PEAK_SHAVING',
            {
              actionType: action.type,
              loadReduction: action.loadReduction,
              duration: action.duration,
              description: action.description,
              expectedSavings: action.cost,
            }
          );

          actions.push(`Executed ${action.description}`);
        } catch (error) {
          errors.push(`Failed to execute ${action.description}: ${error}`);
        }
      }

      const loadReduction = peakShavingActions.reduce((sum, action) => sum + action.loadReduction, 0);
      const costSavings = this.calculatePeakDemandSavings(loadReduction);
      const energySavings = loadReduction * 0.5; // Estimated energy savings

      return { actions, loadReduction, costSavings, energySavings, errors };

    } catch (error) {
      errors.push(`Peak shaving execution failed: ${error}`);
      return { actions, loadReduction: 0, costSavings: 0, energySavings: 0, errors };
    }
  }

  private async executeLoadShift(
    assetId: string | undefined,
    targetReduction: number
  ): Promise<{ actions: string[]; loadReduction: number; costSavings: number; energySavings: number; errors: string[] }> {
    const actions: string[] = [];
    const errors: string[] = [];

    try {
      // Identify non-critical loads to shift
      const shiftableLoads = await this.identifyShiftableLoads(assetId);

      for (const load of shiftableLoads) {
        try {
          await this.createOptimizationAction(
            assetId || 'organization-wide',
            'LOAD_SHIFT',
            {
              loadId: load.id,
              shiftHours: load.shiftHours,
              description: `Shift ${load.description} by ${load.shiftHours} hours`,
              expectedSavings: load.costSavings,
            }
          );

          actions.push(`Shifted ${load.description}`);
        } catch (error) {
          errors.push(`Failed to shift ${load.description}: ${error}`);
        }
      }

      const loadReduction = shiftableLoads.reduce((sum, load) => sum + load.loadReduction, 0);
      const costSavings = shiftableLoads.reduce((sum, load) => sum + load.costSavings, 0);
      const energySavings = loadReduction * 0.3; // Estimated energy savings

      return { actions, loadReduction, costSavings, energySavings, errors };

    } catch (error) {
      errors.push(`Load shift execution failed: ${error}`);
      return { actions, loadReduction: 0, costSavings: 0, energySavings: 0, errors };
    }
  }

  private async executeEquipmentCycling(
    assetId: string | undefined,
    targetReduction: number
  ): Promise<{ actions: string[]; loadReduction: number; costSavings: number; energySavings: number; errors: string[] }> {
    const actions: string[] = [];
    const errors: string[] = [];

    try {
      // Identify equipment for cycling
      const cyclableEquipment = await this.identifyCyclableEquipment(assetId);

      for (const equipment of cyclableEquipment) {
        try {
          await this.createOptimizationAction(
            assetId || 'organization-wide',
            'EQUIPMENT_CYCLING',
            {
              equipmentId: equipment.id,
              cyclePattern: equipment.cyclePattern,
              description: `Cycle ${equipment.description}`,
              expectedSavings: equipment.costSavings,
            }
          );

          actions.push(`Cycled ${equipment.description}`);
        } catch (error) {
          errors.push(`Failed to cycle ${equipment.description}: ${error}`);
        }
      }

      const loadReduction = cyclableEquipment.reduce((sum, equipment) => sum + equipment.loadReduction, 0);
      const costSavings = cyclableEquipment.reduce((sum, equipment) => sum + equipment.costSavings, 0);
      const energySavings = loadReduction * 0.4; // Estimated energy savings

      return { actions, loadReduction, costSavings, energySavings, errors };

    } catch (error) {
      errors.push(`Equipment cycling execution failed: ${error}`);
      return { actions, loadReduction: 0, costSavings: 0, energySavings: 0, errors };
    }
  }

  private async storeOptimizationResult(result: OptimizationResult, assetId?: string): Promise<void> {
    // Store optimization result in metadata or separate table
    await prisma.energyOptimisationAction.create({
      data: {
        organisationId: this.organisationId,
        assetId,
        systemType: 'OPTIMIZATION_ENGINE',
        actionType: 'OPTIMIZATION_EXECUTION',
        description: `Optimization execution: ${result.strategy}`,
        parameters: {
          optimizationId: result.optimizationId,
          actionsExecuted: result.actionsExecuted,
          loadReduction: result.loadReduction,
          costSavings: result.costSavings,
          energySavings: result.energySavings,
        },
        status: result.success ? 'COMPLETED' : 'FAILED',
        executedAt: result.timestamp,
        completedAt: new Date(),
        expectedSavings: result.costSavings,
        actualSavings: result.costSavings,
        metadata: {
          strategy: result.strategy,
          errors: result.errors,
          nextOptimization: result.nextOptimization,
        },
      },
    });
  }

  private async getCurrentLoad(assetId?: string): Promise<number> {
    const recentConsumption = await prisma.energyConsumption.findFirst({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
      },
      orderBy: { timestamp: 'desc' },
    });

    return recentConsumption?.powerDemand || 0;
  }

  private async calculateTargetLoad(assetId?: string): Promise<number> {
    const loadProfile = await this.analyzeLoadProfile(assetId, 1);
    return loadProfile.peakLoad * 0.8; // Target 80% of peak
  }

  private determineOptimizationStatus(currentLoad: number, targetLoad: number): 'idle' | 'optimizing' | 'peak_shaving' | 'load_balancing' {
    if (currentLoad > targetLoad * 1.2) return 'peak_shaving';
    if (currentLoad > targetLoad * 1.1) return 'optimizing';
    if (currentLoad > targetLoad) return 'load_balancing';
    return 'idle';
  }

  private async getActiveOptimizationActions(assetId?: string): Promise<ActiveOptimizationAction[]> {
    const activeActions = await prisma.energyOptimisationAction.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        status: 'EXECUTING',
      },
    });

    return activeActions.map(action => ({
      actionId: action.id,
      type: action.actionType,
      startTime: action.executedAt || new Date(),
      expectedDuration: 30, // 30 minutes default
      currentStatus: 'executing',
      progress: 50, // Mock progress
    }));
  }

  private async getSystemPerformanceMetrics(assetId?: string): Promise<SystemPerformanceMetrics> {
    const loadProfile = await this.analyzeLoadProfile(assetId, 1);

    return {
      overallEfficiency: 85, // Mock efficiency
      loadFactor: loadProfile.loadFactor,
      peakDemand: loadProfile.peakLoad,
      energyCost: 0.25, // $/kWh
      carbonIntensity: 0.5, // kg CO2e/kWh
      equipmentUtilization: 75, // Percentage
    };
  }

  private async getOptimizationAlerts(assetId?: string): Promise<OptimizationAlert[]> {
    const alerts = await prisma.energyAlert.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        status: 'ACTIVE',
        alertType: { in: ['OPTIMIZATION_FAILURE', 'PERFORMANCE_DEGRADATION'] },
      },
      orderBy: { triggeredAt: 'desc' },
      take: 5,
    });

    return alerts.map(alert => ({
      id: alert.id,
      type: alert.alertType as any,
      severity: alert.severity.toLowerCase() as any,
      message: alert.description,
      timestamp: alert.triggeredAt,
      actionRequired: alert.severity === 'CRITICAL' || alert.severity === 'HIGH',
    }));
  }

  // Additional helper methods for specific action types
  private async executeScheduleAdjustment(action: EnergyOptimisationAction): Promise<any> {
    // Mock implementation for schedule adjustment
    return {
      success: true,
      savings: action.expectedSavings || 100,
      message: 'Schedule adjustment executed successfully',
    };
  }

  private async executeSetpointOptimization(action: EnergyOptimisationAction): Promise<any> {
    // Mock implementation for setpoint optimization
    return {
      success: true,
      savings: action.expectedSavings || 150,
      message: 'Setpoint optimization executed successfully',
    };
  }

  private async executeLoadBalancing(action: EnergyOptimisationAction): Promise<any> {
    // Mock implementation for load balancing
    return {
      success: true,
      savings: action.expectedSavings || 200,
      message: 'Load balancing executed successfully',
    };
  }

  private async executeEquipmentCyclingAction(action: EnergyOptimisationAction): Promise<any> {
    // Mock implementation for equipment cycling
    return {
      success: true,
      savings: action.expectedSavings || 120,
      message: 'Equipment cycling executed successfully',
    };
  }

  private async identifyShiftableLoads(assetId?: string): Promise<any[]> {
    // Mock implementation - would identify actual shiftable loads
    return [
      {
        id: 'load-1',
        description: 'Water heating system',
        shiftHours: 2,
        loadReduction: 50,
        costSavings: 25,
      },
      {
        id: 'load-2',
        description: 'Battery charging',
        shiftHours: 4,
        loadReduction: 30,
        costSavings: 15,
      },
    ];
  }

  private async identifyCyclableEquipment(assetId?: string): Promise<any[]> {
    // Mock implementation - would identify actual cyclable equipment
    return [
      {
        id: 'equipment-1',
        description: 'HVAC unit 1',
        cyclePattern: '15min_on_5min_off',
        loadReduction: 40,
        costSavings: 20,
      },
      {
        id: 'equipment-2',
        description: 'Process pump',
        cyclePattern: '20min_on_10min_off',
        loadReduction: 25,
        costSavings: 12,
      },
    ];
  }
}

export function createEnergyOptimisationEngine(
  organisationId: string,
  config?: Partial<OptimisationConfig>
): EnergyOptimisationEngine {
  return new EnergyOptimisationEngine(organisationId, config);
}
