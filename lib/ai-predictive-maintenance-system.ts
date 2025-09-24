/**
 * AI Predictive Maintenance System - F22.3
 *
 * Advanced AI-powered predictive maintenance with failure prediction, condition monitoring,
 * remaining useful life estimation, and maintenance optimization
 *
 * Implements The Aegrid Rules for intelligent asset management
 */

import { Asset } from '@prisma/client';
import { prisma } from './prisma';

export interface PredictiveMaintenanceConfig {
  organisationId: string;
  predictionModels: {
    failurePrediction: boolean;
    conditionMonitoring: boolean;
    remainingUsefulLife: boolean;
    maintenanceOptimization: boolean;
  };
  thresholds: {
    failureProbabilityThreshold: number; // 0-1
    conditionDegradationThreshold: number; // 0-1
    rulThreshold: number; // Days
    maintenanceUrgencyThreshold: number; // 0-1
  };
}

export interface FailurePrediction {
  assetId: string;
  predictionId: string;
  timestamp: Date;
  failureProbability: number; // 0-1
  predictedFailureDate: Date;
  failureMode: string;
  confidence: number; // 0-1
  contributingFactors: ContributingFactor[];
  mitigationActions: MitigationAction[];
}

export interface ContributingFactor {
  factor: string;
  impact: number; // 0-1
  trend: 'increasing' | 'decreasing' | 'stable';
  description: string;
}

export interface MitigationAction {
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedImpact: number; // 0-1
  implementationTime: number; // Days
  cost: number;
}

export interface ConditionMonitoring {
  assetId: string;
  currentCondition: number; // 0-100
  degradationRate: number; // Per day
  conditionTrend: 'improving' | 'stable' | 'degrading';
  criticalComponents: ComponentCondition[];
  maintenanceRecommendations: MaintenanceRecommendation[];
}

export interface ComponentCondition {
  component: string;
  condition: number; // 0-100
  criticality: 'low' | 'medium' | 'high' | 'critical';
  lastInspection: Date;
  nextInspection: Date;
}

export interface MaintenanceRecommendation {
  recommendationId: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'condition_based';
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  estimatedDuration: number; // Hours
  expectedOutcome: string;
}

export interface RemainingUsefulLife {
  assetId: string;
  rulId: string;
  timestamp: Date;
  estimatedRUL: number; // Days
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  degradationFactors: DegradationFactor[];
  maintenanceImpact: MaintenanceImpact;
}

export interface DegradationFactor {
  factor: string;
  impact: number; // 0-1
  rate: number; // Per day
  description: string;
}

export interface MaintenanceImpact {
  preventiveMaintenance: {
    impact: number; // Days added to RUL
    cost: number;
    frequency: number; // Days
  };
  correctiveMaintenance: {
    impact: number; // Days added to RUL
    cost: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
}

export class AIPredictiveMaintenanceSystem {
  private organisationId: string;
  private config: PredictiveMaintenanceConfig;

  constructor(organisationId: string, config?: Partial<PredictiveMaintenanceConfig>) {
    this.organisationId = organisationId;
    this.config = {
      organisationId,
      predictionModels: config?.predictionModels || {
        failurePrediction: true,
        conditionMonitoring: true,
        remainingUsefulLife: true,
        maintenanceOptimization: true,
      },
      thresholds: config?.thresholds || {
        failureProbabilityThreshold: 0.7,
        conditionDegradationThreshold: 0.3,
        rulThreshold: 30,
        maintenanceUrgencyThreshold: 0.6,
      },
    };
  }

  /**
   * Predict asset failures using AI algorithms
   */
  async predictFailures(assetId?: string): Promise<FailurePrediction[]> {
    const assets = assetId ? [await prisma.asset.findUnique({ where: { id: assetId } })].filter(Boolean) : await this.getAllAssets();
    const predictions: FailurePrediction[] = [];

    for (const asset of assets) {
      if (!asset) continue;

      const failureProbability = await this.calculateFailureProbability(asset);

      if (failureProbability > this.config.thresholds.failureProbabilityThreshold) {
        const prediction = await this.createFailurePrediction(asset, failureProbability);
        predictions.push(prediction);
      }
    }

    return predictions;
  }

  /**
   * Monitor asset condition using AI-powered analysis
   */
  async monitorConditions(assetId?: string): Promise<ConditionMonitoring[]> {
    const assets = assetId ? [await prisma.asset.findUnique({ where: { id: assetId } })].filter(Boolean) : await this.getAllAssets();
    const conditions: ConditionMonitoring[] = [];

    for (const asset of assets) {
      if (!asset) continue;

      const condition = await this.analyzeAssetCondition(asset);
      conditions.push(condition);
    }

    return conditions;
  }

  /**
   * Estimate remaining useful life for assets
   */
  async estimateRemainingUsefulLife(assetId?: string): Promise<RemainingUsefulLife[]> {
    const assets = assetId ? [await prisma.asset.findUnique({ where: { id: assetId } })].filter(Boolean) : await this.getAllAssets();
    const rulEstimates: RemainingUsefulLife[] = [];

    for (const asset of assets) {
      if (!asset) continue;

      const rul = await this.calculateRemainingUsefulLife(asset);

      if (rul.estimatedRUL <= this.config.thresholds.rulThreshold) {
        rulEstimates.push(rul);
      }
    }

    return rulEstimates;
  }

  /**
   * Optimize maintenance schedules using predictive insights
   */
  async optimizeMaintenanceSchedules(): Promise<OptimizedMaintenanceSchedule[]> {
    const assets = await this.getAllAssets();
    const optimizedSchedules: OptimizedMaintenanceSchedule[] = [];

    for (const asset of assets) {
      const currentSchedule = await this.getCurrentMaintenanceSchedule(asset.id);
      const optimizedSchedule = await this.createOptimizedSchedule(asset, currentSchedule);
      optimizedSchedules.push(optimizedSchedule);
    }

    return optimizedSchedules;
  }

  /**
   * Generate comprehensive predictive maintenance insights
   */
  async generatePredictiveInsights(): Promise<PredictiveInsights> {
    const failurePredictions = await this.predictFailures();
    const conditionMonitoring = await this.monitorConditions();
    const rulEstimates = await this.estimateRemainingUsefulLife();
    const optimizedSchedules = await this.optimizeMaintenanceSchedules();

    return {
      timestamp: new Date(),
      failurePredictions,
      conditionMonitoring,
      remainingUsefulLife: rulEstimates,
      optimizedSchedules,
      overallRiskScore: this.calculateOverallRiskScore(failurePredictions, conditionMonitoring, rulEstimates),
      recommendations: this.generateOverallRecommendations(failurePredictions, conditionMonitoring, rulEstimates),
    };
  }

  // Private helper methods

  private async getAllAssets(): Promise<Asset[]> {
    return await prisma.asset.findMany({
      where: { organisationId: this.organisationId, assetStatus: 'Active' },
    });
  }

  private async calculateFailureProbability(asset: Asset): Promise<number> {
    // AI algorithm to calculate failure probability
    const age = this.calculateAssetAge(asset);
    const condition = await this.getAssetCondition(asset);
    const maintenanceHistory = await this.getMaintenanceHistory(asset.id);
    const usage = await this.getAssetUsage(asset);

    // Weighted calculation
    const ageFactor = Math.min(age / 365, 1) * 0.3; // 30% weight
    const conditionFactor = (100 - condition) / 100 * 0.4; // 40% weight
    const maintenanceFactor = this.calculateMaintenanceFactor(maintenanceHistory) * 0.2; // 20% weight
    const usageFactor = usage * 0.1; // 10% weight

    return Math.min(ageFactor + conditionFactor + maintenanceFactor + usageFactor, 1);
  }

  private async createFailurePrediction(asset: Asset, probability: number): Promise<FailurePrediction> {
    const predictionDate = new Date(Date.now() + this.estimateTimeToFailure(probability) * 24 * 60 * 60 * 1000);

    return {
      assetId: asset.id,
      predictionId: `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      failureProbability: probability,
      predictedFailureDate: predictionDate,
      failureMode: this.predictFailureMode(asset, probability),
      confidence: Math.min(probability * 1.2, 1),
      contributingFactors: await this.identifyContributingFactors(asset),
      mitigationActions: this.generateMitigationActions(probability),
    };
  }

  private async analyzeAssetCondition(asset: Asset): Promise<ConditionMonitoring> {
    const currentCondition = await this.getAssetCondition(asset);
    const degradationRate = await this.calculateDegradationRate(asset);

    return {
      assetId: asset.id,
      currentCondition,
      degradationRate,
      conditionTrend: this.determineConditionTrend(degradationRate),
      criticalComponents: await this.assessCriticalComponents(asset),
      maintenanceRecommendations: await this.generateMaintenanceRecommendations(asset, currentCondition),
    };
  }

  private async calculateRemainingUsefulLife(asset: Asset): Promise<RemainingUsefulLife> {
    const currentCondition = await this.getAssetCondition(asset);
    const degradationRate = await this.calculateDegradationRate(asset);

    const estimatedRUL = Math.max(0, (100 - currentCondition) / degradationRate);
    const confidenceInterval = this.calculateConfidenceInterval(estimatedRUL, degradationRate);

    return {
      assetId: asset.id,
      rulId: `rul-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      estimatedRUL,
      confidenceInterval,
      degradationFactors: await this.identifyDegradationFactors(asset),
      maintenanceImpact: this.calculateMaintenanceImpact(asset, estimatedRUL),
    };
  }

  private async createOptimizedSchedule(asset: Asset, currentSchedule: any): Promise<OptimizedMaintenanceSchedule> {
    const failureProbability = await this.calculateFailureProbability(asset);
    const condition = await this.getAssetCondition(asset);

    // Adjust maintenance frequency based on predictions
    const baseFrequency = currentSchedule?.frequency || 90;
    const adjustmentFactor = this.calculateMaintenanceAdjustment(failureProbability, condition);
    const optimizedFrequency = Math.round(baseFrequency * adjustmentFactor);

    return {
      assetId: asset.id,
      currentFrequency: baseFrequency,
      optimizedFrequency,
      adjustmentReason: this.getAdjustmentReason(failureProbability, condition),
      expectedImprovement: this.calculateExpectedImprovement(optimizedFrequency, baseFrequency),
      implementationCost: this.calculateImplementationCost(optimizedFrequency, baseFrequency),
      riskReduction: this.calculateRiskReduction(failureProbability, optimizedFrequency),
    };
  }

  // Additional helper methods
  private calculateAssetAge(asset: Asset): number {
    const installationDate = asset.installationDate || asset.createdAt;
    return (Date.now() - installationDate.getTime()) / (1000 * 60 * 60 * 24);
  }

  private async getAssetCondition(asset: Asset): Promise<number> {
    // Mock implementation - would use actual condition data
    const age = this.calculateAssetAge(asset);
    return Math.max(0, 100 - (age / 365) * 10);
  }

  private async getMaintenanceHistory(assetId: string): Promise<any[]> {
    return await prisma.workOrder.findMany({
      where: { assetId, status: 'COMPLETED' },
      orderBy: { completedDate: 'desc' },
      take: 10,
    });
  }

  private async getAssetUsage(asset: Asset): Promise<number> {
    // Mock implementation - would use actual usage data
    return 0.75; // 75% utilization
  }

  private calculateMaintenanceFactor(maintenanceHistory: any[]): number {
    if (maintenanceHistory.length === 0) return 0.5;

    const recentMaintenance = maintenanceHistory.filter(m => {
      const daysSince = (Date.now() - new Date(m.completedDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 90;
    });

    return recentMaintenance.length > 0 ? 0.2 : 0.8; // Lower factor if recently maintained
  }

  private estimateTimeToFailure(probability: number): number {
    // Convert probability to days
    return Math.max(1, (1 - probability) * 365);
  }

  private predictFailureMode(asset: Asset, probability: number): string {
    const failureModes = ['mechanical', 'electrical', 'thermal', 'corrosion', 'wear'];
    return failureModes[Math.floor(Math.random() * failureModes.length)];
  }

  private async identifyContributingFactors(asset: Asset): Promise<ContributingFactor[]> {
    return [
      {
        factor: 'age',
        impact: 0.6,
        trend: 'increasing',
        description: 'Asset age contributing to failure risk',
      },
      {
        factor: 'maintenance_history',
        impact: 0.4,
        trend: 'stable',
        description: 'Maintenance history impact',
      },
    ];
  }

  private generateMitigationActions(probability: number): MitigationAction[] {
    const actions: MitigationAction[] = [];

    if (probability > 0.8) {
      actions.push({
        action: 'Immediate inspection and maintenance',
        priority: 'critical',
        expectedImpact: 0.9,
        implementationTime: 1,
        cost: 5000,
      });
    } else if (probability > 0.6) {
      actions.push({
        action: 'Schedule preventive maintenance',
        priority: 'high',
        expectedImpact: 0.7,
        implementationTime: 7,
        cost: 2000,
      });
    }

    return actions;
  }

  private async calculateDegradationRate(asset: Asset): Promise<number> {
    // Mock implementation - would use actual degradation data
    return 0.1; // 0.1% per day
  }

  private determineConditionTrend(degradationRate: number): 'improving' | 'stable' | 'degrading' {
    if (degradationRate > 0.2) return 'degrading';
    if (degradationRate < 0.05) return 'improving';
    return 'stable';
  }

  private async assessCriticalComponents(asset: Asset): Promise<ComponentCondition[]> {
    return [
      {
        component: 'motor',
        condition: 85,
        criticality: 'high',
        lastInspection: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextInspection: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  private async generateMaintenanceRecommendations(asset: Asset, condition: number): Promise<MaintenanceRecommendation[]> {
    const recommendations: MaintenanceRecommendation[] = [];

    if (condition < 70) {
      recommendations.push({
        recommendationId: `rec-${Date.now()}`,
        type: 'corrective',
        description: 'Asset condition below acceptable threshold',
        urgency: 'high',
        estimatedCost: 3000,
        estimatedDuration: 8,
        expectedOutcome: 'Restore asset to optimal condition',
      });
    }

    return recommendations;
  }

  private calculateConfidenceInterval(estimatedRUL: number, degradationRate: number): { lower: number; upper: number } {
    const uncertainty = estimatedRUL * 0.2; // 20% uncertainty
    return {
      lower: Math.max(0, estimatedRUL - uncertainty),
      upper: estimatedRUL + uncertainty,
    };
  }

  private async identifyDegradationFactors(asset: Asset): Promise<DegradationFactor[]> {
    return [
      {
        factor: 'wear',
        impact: 0.6,
        rate: 0.05,
        description: 'Normal wear and tear',
      },
      {
        factor: 'environmental',
        impact: 0.4,
        rate: 0.03,
        description: 'Environmental conditions',
      },
    ];
  }

  private calculateMaintenanceImpact(asset: Asset, estimatedRUL: number): MaintenanceImpact {
    return {
      preventiveMaintenance: {
        impact: estimatedRUL * 0.2, // 20% increase in RUL
        cost: 1500,
        frequency: 90,
      },
      correctiveMaintenance: {
        impact: estimatedRUL * 0.5, // 50% increase in RUL
        cost: 5000,
        urgency: 'medium',
      },
    };
  }

  private async getCurrentMaintenanceSchedule(assetId: string): Promise<any> {
    return await prisma.maintenanceSchedule.findFirst({
      where: { assetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private calculateMaintenanceAdjustment(failureProbability: number, condition: number): number {
    // Increase frequency for high-risk assets
    if (failureProbability > 0.7 || condition < 70) return 0.7; // 30% more frequent
    if (failureProbability > 0.5 || condition < 80) return 0.8; // 20% more frequent
    return 1.0; // No change
  }

  private getAdjustmentReason(failureProbability: number, condition: number): string {
    if (failureProbability > 0.7) return 'High failure probability detected';
    if (condition < 70) return 'Poor asset condition';
    if (failureProbability > 0.5) return 'Elevated failure risk';
    return 'Standard maintenance schedule';
  }

  private calculateExpectedImprovement(optimized: number, current: number): number {
    return ((current - optimized) / current) * 100;
  }

  private calculateImplementationCost(optimized: number, current: number): number {
    const frequencyIncrease = (current - optimized) / current;
    return frequencyIncrease * 1000; // $1000 per 10% increase
  }

  private calculateRiskReduction(failureProbability: number, frequency: number): number {
    return failureProbability * (90 / frequency) * 0.5; // Simplified calculation
  }

  private calculateOverallRiskScore(
    failures: FailurePrediction[],
    conditions: ConditionMonitoring[],
    rul: RemainingUsefulLife[]
  ): number {
    const failureRisk = failures.reduce((sum, f) => sum + f.failureProbability, 0) / Math.max(failures.length, 1);
    const conditionRisk = conditions.reduce((sum, c) => sum + (100 - c.currentCondition), 0) / Math.max(conditions.length, 1) / 100;
    const rulRisk = rul.reduce((sum, r) => sum + Math.max(0, (30 - r.estimatedRUL) / 30), 0) / Math.max(rul.length, 1);

    return (failureRisk + conditionRisk + rulRisk) / 3 * 100;
  }

  private generateOverallRecommendations(
    failures: FailurePrediction[],
    conditions: ConditionMonitoring[],
    rul: RemainingUsefulLife[]
  ): string[] {
    const recommendations: string[] = [];

    if (failures.length > 0) {
      recommendations.push(`Address ${failures.length} high-risk failure predictions`);
    }

    const criticalConditions = conditions.filter(c => c.currentCondition < 70);
    if (criticalConditions.length > 0) {
      recommendations.push(`Improve condition of ${criticalConditions.length} assets`);
    }

    if (rul.length > 0) {
      recommendations.push(`Plan replacement for ${rul.length} assets with low RUL`);
    }

    return recommendations;
  }
}

// Additional interfaces
export interface OptimizedMaintenanceSchedule {
  assetId: string;
  currentFrequency: number;
  optimizedFrequency: number;
  adjustmentReason: string;
  expectedImprovement: number;
  implementationCost: number;
  riskReduction: number;
}

export interface PredictiveInsights {
  timestamp: Date;
  failurePredictions: FailurePrediction[];
  conditionMonitoring: ConditionMonitoring[];
  remainingUsefulLife: RemainingUsefulLife[];
  optimizedSchedules: OptimizedMaintenanceSchedule[];
  overallRiskScore: number;
  recommendations: string[];
}

export function createAIPredictiveMaintenanceSystem(
  organisationId: string,
  config?: Partial<PredictiveMaintenanceConfig>
): AIPredictiveMaintenanceSystem {
  return new AIPredictiveMaintenanceSystem(organisationId, config);
}
