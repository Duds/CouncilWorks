/**
 * AI Intelligence Core - E22 Integration
 *
 * Main integration point for all AI intelligence capabilities including optimization,
 * anomaly detection, predictive maintenance, and automated red-flagging
 *
 * Implements The Aegrid Rules for comprehensive AI-powered asset management
 */

import { AIAnomalyDetectionSystem, createAIAnomalyDetectionSystem } from './ai-anomaly-detection-system';
import { AIAutomatedRedFlaggingSystem, createAIAutomatedRedFlaggingSystem } from './ai-automated-red-flagging-system';
import { AIOptimisationEngine, createAIOptimisationEngine } from './ai-optimisation-engine';
import { AIPredictiveMaintenanceSystem, createAIPredictiveMaintenanceSystem } from './ai-predictive-maintenance-system';
import { prisma } from './prisma';

export interface AIIntelligenceConfig {
  organisationId: string;
  optimization: {
    enabled: boolean;
    schedule: string; // Cron expression
    parameters: any;
  };
  anomalyDetection: {
    enabled: boolean;
    schedule: string; // Cron expression
    parameters: any;
  };
  predictiveMaintenance: {
    enabled: boolean;
    schedule: string; // Cron expression
    parameters: any;
  };
  redFlagging: {
    enabled: boolean;
    schedule: string; // Cron expression
    parameters: any;
  };
  integration: {
    crossEngineCorrelation: boolean;
    unifiedReporting: boolean;
    automatedActions: boolean;
  };
}

export interface AIIntelligenceSummary {
  timestamp: Date;
  optimizationResults: any;
  anomalyDetections: any;
  predictiveInsights: any;
  redFlags: any;
  overallIntelligenceScore: number;
  recommendations: AIRecommendation[];
  alerts: AIAlert[];
}

export interface AIRecommendation {
  recommendationId: string;
  source: 'optimization' | 'anomaly_detection' | 'predictive_maintenance' | 'red_flagging';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  expectedImpact: number; // 0-1
  implementationCost: number;
  confidence: number; // 0-1
  assets: string[];
  timeline: number; // Days
}

export interface AIAlert {
  alertId: string;
  source: 'optimization' | 'anomaly_detection' | 'predictive_maintenance' | 'red_flagging';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  assetId: string;
  actions: string[];
  status: 'active' | 'acknowledged' | 'resolved';
}

export class AIIntelligenceCore {
  private organisationId: string;
  private config: AIIntelligenceConfig;
  private optimisationEngine: AIOptimisationEngine;
  private anomalyDetectionSystem: AIAnomalyDetectionSystem;
  private predictiveMaintenanceSystem: AIPredictiveMaintenanceSystem;
  private redFlaggingSystem: AIAutomatedRedFlaggingSystem;

  constructor(organisationId: string, config?: Partial<AIIntelligenceConfig>) {
    this.organisationId = organisationId;
    this.config = {
      organisationId,
      optimization: config?.optimization || {
        enabled: true,
        schedule: '0 2 * * *', // Daily at 2 AM
        parameters: {},
      },
      anomalyDetection: config?.anomalyDetection || {
        enabled: true,
        schedule: '0 */6 * * *', // Every 6 hours
        parameters: { timeWindow: 24 },
      },
      predictiveMaintenance: config?.predictiveMaintenance || {
        enabled: true,
        schedule: '0 1 * * 1', // Weekly on Monday at 1 AM
        parameters: {},
      },
      redFlagging: config?.redFlagging || {
        enabled: true,
        schedule: '0 */4 * * *', // Every 4 hours
        parameters: {},
      },
      integration: config?.integration || {
        crossEngineCorrelation: true,
        unifiedReporting: true,
        automatedActions: true,
      },
    };

    // Initialize AI engines
    this.optimisationEngine = createAIOptimisationEngine(organisationId);
    this.anomalyDetectionSystem = createAIAnomalyDetectionSystem(organisationId);
    this.predictiveMaintenanceSystem = createAIPredictiveMaintenanceSystem(organisationId);
    this.redFlaggingSystem = createAIAutomatedRedFlaggingSystem(organisationId);
  }

  /**
   * Execute comprehensive AI intelligence analysis
   */
  async executeComprehensiveAnalysis(): Promise<AIIntelligenceSummary> {
    const timestamp = new Date();

    try {
      // Execute all AI engines in parallel
      const [
        optimizationResults,
        anomalyDetections,
        predictiveInsights,
        redFlags,
      ] = await Promise.all([
        this.config.optimization.enabled ? this.optimisationEngine.executeComprehensiveOptimization() : null,
        this.config.anomalyDetection.enabled ? this.anomalyDetectionSystem.detectAnomalies(24) : null,
        this.config.predictiveMaintenance.enabled ? this.predictiveMaintenanceSystem.generatePredictiveInsights() : null,
        this.config.redFlagging.enabled ? this.redFlaggingSystem.performRedFlaggingAnalysis() : null,
      ]);

      // Generate cross-engine correlations if enabled
      const correlations = this.config.integration.crossEngineCorrelation
        ? await this.performCrossEngineCorrelation(optimizationResults, anomalyDetections, predictiveInsights, redFlags)
        : null;

      // Generate unified recommendations
      const recommendations = await this.generateUnifiedRecommendations(
        optimizationResults,
        anomalyDetections,
        predictiveInsights,
        redFlags,
        correlations
      );

      // Generate unified alerts
      const alerts = await this.generateUnifiedAlerts(
        optimizationResults,
        anomalyDetections,
        predictiveInsights,
        redFlags
      );

      // Calculate overall intelligence score
      const overallIntelligenceScore = this.calculateOverallIntelligenceScore(
        optimizationResults,
        anomalyDetections,
        predictiveInsights,
        redFlags
      );

      const summary: AIIntelligenceSummary = {
        timestamp,
        optimizationResults,
        anomalyDetections,
        predictiveInsights,
        redFlags,
        overallIntelligenceScore,
        recommendations,
        alerts,
      };

      // Store intelligence summary
      await this.storeIntelligenceSummary(summary);

      // Execute automated actions if enabled
      if (this.config.integration.automatedActions) {
        await this.executeAutomatedActions(recommendations, alerts);
      }

      return summary;

    } catch (error) {
      throw new Error(`Comprehensive AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get AI intelligence dashboard data
   */
  async getIntelligenceDashboard(): Promise<{
    summary: AIIntelligenceSummary;
    performance: AIPerformanceMetrics;
    trends: AITrends;
    insights: AIInsights;
  }> {
    const summary = await this.executeComprehensiveAnalysis();
    const performance = await this.calculatePerformanceMetrics();
    const trends = await this.analyzeTrends();
    const insights = await this.generateInsights(summary);

    return {
      summary,
      performance,
      trends,
      insights,
    };
  }

  /**
   * Execute specific AI engine
   */
  async executeEngine(engine: 'optimization' | 'anomaly' | 'predictive' | 'redflagging'): Promise<any> {
    switch (engine) {
      case 'optimization':
        return await this.optimisationEngine.executeComprehensiveOptimization();
      case 'anomaly':
        return await this.anomalyDetectionSystem.detectAnomalies(24);
      case 'predictive':
        return await this.predictiveMaintenanceSystem.generatePredictiveInsights();
      case 'redflagging':
        return await this.redFlaggingSystem.performRedFlaggingAnalysis();
      default:
        throw new Error(`Unknown AI engine: ${engine}`);
    }
  }

  /**
   * Get AI insights for specific asset
   */
  async getAssetAIInsights(assetId: string): Promise<{
    optimization: any;
    anomalies: any;
    predictive: any;
    redFlags: any;
    integratedInsights: any;
  }> {
    const [optimization, anomalies, predictive, redFlags] = await Promise.all([
      this.optimisationEngine.getOptimizationInsights(assetId),
      this.anomalyDetectionSystem.detectAnomalies(24),
      this.predictiveMaintenanceSystem.generatePredictiveInsights(),
      this.redFlaggingSystem.performRedFlaggingAnalysis(),
    ]);

    const integratedInsights = await this.integrateAssetInsights(assetId, optimization, anomalies, predictive, redFlags);

    return {
      optimization,
      anomalies: anomalies.filter((a: any) => a.assetId === assetId),
      predictive,
      redFlags: redFlags.filter((f: any) => f.assetId === assetId),
      integratedInsights,
    };
  }

  // Private helper methods

  private async performCrossEngineCorrelation(
    optimization: any,
    anomalies: any,
    predictive: any,
    redFlags: any
  ): Promise<any> {
    const correlations = {
      optimizationAnomaly: this.correlateOptimizationWithAnomalies(optimization, anomalies),
      predictiveRedFlags: this.correlatePredictiveWithRedFlags(predictive, redFlags),
      anomalyPredictive: this.correlateAnomaliesWithPredictive(anomalies, predictive),
      overallCorrelation: 0,
    };

    // Calculate overall correlation strength
    const correlationValues = [
      correlations.optimizationAnomaly.strength,
      correlations.predictiveRedFlags.strength,
      correlations.anomalyPredictive.strength,
    ];
    correlations.overallCorrelation = correlationValues.reduce((sum, val) => sum + val, 0) / correlationValues.length;

    return correlations;
  }

  private correlateOptimizationWithAnomalies(optimization: any, anomalies: any): any {
    // Find correlations between optimization recommendations and detected anomalies
    const correlations: any[] = [];

    if (optimization?.recommendations && anomalies) {
      for (const recommendation of optimization.recommendations) {
        for (const anomaly of anomalies) {
          if (recommendation.assets?.includes(anomaly.assetId)) {
            correlations.push({
              recommendationId: recommendation.recommendationId,
              anomalyId: anomaly.anomalyId,
              assetId: anomaly.assetId,
              correlationType: 'asset_overlap',
              strength: 0.8,
            });
          }
        }
      }
    }

    return {
      correlations,
      strength: correlations.length > 0 ? 0.7 : 0,
    };
  }

  private correlatePredictiveWithRedFlags(predictive: any, redFlags: any): any {
    // Find correlations between predictive insights and red flags
    const correlations: any[] = [];

    if (predictive?.failurePredictions && redFlags) {
      for (const prediction of predictive.failurePredictions) {
        for (const flag of redFlags) {
          if (prediction.assetId === flag.assetId && prediction.failureProbability > 0.7) {
            correlations.push({
              predictionId: prediction.predictionId,
              flagId: flag.flagId,
              assetId: prediction.assetId,
              correlationType: 'failure_risk',
              strength: prediction.failureProbability,
            });
          }
        }
      }
    }

    return {
      correlations,
      strength: correlations.length > 0 ? 0.8 : 0,
    };
  }

  private correlateAnomaliesWithPredictive(anomalies: any, predictive: any): any {
    // Find correlations between anomalies and predictive maintenance
    const correlations: any[] = [];

    if (anomalies && predictive?.conditionMonitoring) {
      for (const anomaly of anomalies) {
        const condition = predictive.conditionMonitoring.find((c: any) => c.assetId === anomaly.assetId);
        if (condition && condition.currentCondition < 70) {
          correlations.push({
            anomalyId: anomaly.anomalyId,
            conditionAssetId: condition.assetId,
            correlationType: 'condition_degradation',
            strength: 0.9,
          });
        }
      }
    }

    return {
      correlations,
      strength: correlations.length > 0 ? 0.6 : 0,
    };
  }

  private async generateUnifiedRecommendations(
    optimization: any,
    anomalies: any,
    predictive: any,
    redFlags: any,
    correlations: any
  ): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Optimization recommendations
    if (optimization?.recommendations) {
      for (const rec of optimization.recommendations) {
        recommendations.push({
          recommendationId: `opt-${rec.recommendationId}`,
          source: 'optimization',
          priority: rec.priority,
          category: rec.category,
          description: rec.description,
          expectedImpact: rec.expectedImpact,
          implementationCost: rec.implementationCost,
          confidence: 0.85,
          assets: [rec.assets || []].flat(),
          timeline: rec.paybackPeriod * 30, // Convert months to days
        });
      }
    }

    // Anomaly recommendations
    if (anomalies) {
      for (const anomaly of anomalies) {
        if (anomaly.recommendations) {
          for (const rec of anomaly.recommendations) {
            recommendations.push({
              recommendationId: `anom-${rec.recommendationId}`,
              source: 'anomaly_detection',
              priority: rec.priority === 'critical' ? 'critical' : rec.priority,
              category: 'anomaly_response',
              description: rec.description,
              expectedImpact: rec.expectedImpact,
              implementationCost: rec.cost,
              confidence: anomaly.confidence,
              assets: [anomaly.assetId],
              timeline: rec.implementationTime,
            });
          }
        }
      }
    }

    // Predictive maintenance recommendations
    if (predictive?.conditionMonitoring) {
      for (const condition of predictive.conditionMonitoring) {
        if (condition.maintenanceRecommendations) {
          for (const rec of condition.maintenanceRecommendations) {
            recommendations.push({
              recommendationId: `pred-${rec.recommendationId}`,
              source: 'predictive_maintenance',
              priority: rec.urgency,
              category: 'maintenance',
              description: rec.description,
              expectedImpact: rec.urgency === 'critical' ? 0.9 : 0.7,
              implementationCost: rec.estimatedCost,
              confidence: 0.8,
              assets: [condition.assetId],
              timeline: rec.estimatedDuration / 8, // Convert hours to days
            });
          }
        }
      }
    }

    // Red flag recommendations
    if (redFlags) {
      for (const flag of redFlags) {
        if (flag.riskAssessment?.mitigationStrategies) {
          for (const strategy of flag.riskAssessment.mitigationStrategies) {
            recommendations.push({
              recommendationId: `flag-${flag.flagId}-${strategy.strategy}`,
              source: 'red_flagging',
              priority: flag.severity.level,
              category: 'risk_mitigation',
              description: strategy.description,
              expectedImpact: strategy.effectiveness,
              implementationCost: strategy.cost,
              confidence: 0.75,
              assets: [flag.assetId],
              timeline: strategy.implementationTime,
            });
          }
        }
      }
    }

    // Sort by priority and impact
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.expectedImpact - a.expectedImpact;
    });
  }

  private async generateUnifiedAlerts(
    optimization: any,
    anomalies: any,
    predictive: any,
    redFlags: any
  ): Promise<AIAlert[]> {
    const alerts: AIAlert[] = [];

    // Critical anomalies
    if (anomalies) {
      const criticalAnomalies = anomalies.filter((a: any) => a.severity?.level === 'critical');
      for (const anomaly of criticalAnomalies) {
        alerts.push({
          alertId: `anom-${anomaly.anomalyId}`,
          source: 'anomaly_detection',
          severity: 'critical',
          title: `Critical Anomaly Detected`,
          description: anomaly.description,
          timestamp: anomaly.timestamp,
          assetId: anomaly.assetId,
          actions: ['Investigate immediately', 'Schedule maintenance'],
          status: 'active',
        });
      }
    }

    // High-risk failure predictions
    if (predictive?.failurePredictions) {
      const highRiskPredictions = predictive.failurePredictions.filter((p: any) => p.failureProbability > 0.8);
      for (const prediction of highRiskPredictions) {
        alerts.push({
          alertId: `pred-${prediction.predictionId}`,
          source: 'predictive_maintenance',
          severity: 'high',
          title: `High-Risk Failure Prediction`,
          description: `Asset ${prediction.assetId} has ${(prediction.failureProbability * 100).toFixed(1)}% failure probability`,
          timestamp: prediction.timestamp,
          assetId: prediction.assetId,
          actions: ['Schedule preventive maintenance', 'Increase monitoring'],
          status: 'active',
        });
      }
    }

    // Critical red flags
    if (redFlags) {
      const criticalFlags = redFlags.filter((f: any) => f.severity?.level === 'critical');
      for (const flag of criticalFlags) {
        alerts.push({
          alertId: `flag-${flag.flagId}`,
          source: 'red_flagging',
          severity: 'critical',
          title: `Critical Red Flag`,
          description: flag.description,
          timestamp: flag.timestamp,
          assetId: flag.assetId,
          actions: ['Immediate response required', 'Escalate to management'],
          status: 'active',
        });
      }
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  private calculateOverallIntelligenceScore(
    optimization: any,
    anomalies: any,
    predictive: any,
    redFlags: any
  ): number {
    let totalScore = 0;
    let factorCount = 0;

    // Optimization score
    if (optimization?.totalSavings !== undefined) {
      const optimizationScore = Math.min(optimization.totalSavings / 10000, 1) * 100; // Normalize to 0-100
      totalScore += optimizationScore;
      factorCount++;
    }

    // Anomaly detection score (inverse - fewer critical anomalies is better)
    if (anomalies) {
      const criticalAnomalies = anomalies.filter((a: any) => a.severity?.level === 'critical').length;
      const anomalyScore = Math.max(0, 100 - criticalAnomalies * 10); // Reduce score for each critical anomaly
      totalScore += anomalyScore;
      factorCount++;
    }

    // Predictive maintenance score
    if (predictive?.overallRiskScore !== undefined) {
      const predictiveScore = Math.max(0, 100 - predictive.overallRiskScore);
      totalScore += predictiveScore;
      factorCount++;
    }

    // Red flagging score (inverse - fewer critical flags is better)
    if (redFlags) {
      const criticalFlags = redFlags.filter((f: any) => f.severity?.level === 'critical').length;
      const flagScore = Math.max(0, 100 - criticalFlags * 15); // Reduce score for each critical flag
      totalScore += flagScore;
      factorCount++;
    }

    return factorCount > 0 ? totalScore / factorCount : 0;
  }

  private async storeIntelligenceSummary(summary: AIIntelligenceSummary): Promise<void> {
    // Store intelligence summary in database
    await prisma.workOrder.create({
      data: {
        organisationId: this.organisationId,
        title: `AI Intelligence Summary - ${summary.timestamp.toISOString()}`,
        description: `AI intelligence analysis completed with score: ${summary.overallIntelligenceScore.toFixed(1)}`,
        priority: 'Medium',
        status: 'Completed',
        assignedTo: 'ai-intelligence-core',
        scheduledDate: summary.timestamp,
        completedDate: summary.timestamp,
        metadata: {
          summary,
          recommendations: summary.recommendations,
          alerts: summary.alerts,
        },
      },
    });
  }

  private async executeAutomatedActions(recommendations: AIRecommendation[], alerts: AIAlert[]): Promise<void> {
    // Execute high-priority recommendations automatically
    const criticalRecommendations = recommendations.filter(r => r.priority === 'critical');

    for (const recommendation of criticalRecommendations) {
      if (recommendation.implementationCost < 5000) { // Auto-execute if cost is low
        await this.executeRecommendation(recommendation);
      }
    }

    // Create work orders for critical alerts
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');

    for (const alert of criticalAlerts) {
      await prisma.workOrder.create({
        data: {
          organisationId: this.organisationId,
          assetId: alert.assetId,
          title: `URGENT: ${alert.title}`,
          description: alert.description,
          priority: 'Critical',
          status: 'Pending',
          assignedTo: 'maintenance_team',
          scheduledDate: new Date(),
          metadata: {
            source: 'ai_intelligence_automation',
            alertId: alert.alertId,
            automated: true,
          },
        },
      });
    }
  }

  private async executeRecommendation(recommendation: AIRecommendation): Promise<void> {
    // Mock recommendation execution
    console.log('Executing recommendation:', recommendation.recommendationId);
  }

  private async integrateAssetInsights(
    assetId: string,
    optimization: any,
    anomalies: any,
    predictive: any,
    redFlags: any
  ): Promise<any> {
    return {
      assetId,
      overallRisk: this.calculateAssetRisk(anomalies, predictive, redFlags),
      priority: this.determineAssetPriority(optimization, anomalies, predictive, redFlags),
      recommendations: this.consolidateAssetRecommendations(optimization, anomalies, predictive, redFlags),
      nextActions: this.determineNextActions(optimization, anomalies, predictive, redFlags),
    };
  }

  private calculateAssetRisk(anomalies: any, predictive: any, redFlags: any): number {
    let risk = 0;

    if (anomalies?.length > 0) risk += 30;
    if (predictive?.failurePredictions?.length > 0) risk += 40;
    if (redFlags?.length > 0) risk += 50;

    return Math.min(risk, 100);
  }

  private determineAssetPriority(optimization: any, anomalies: any, predictive: any, redFlags: any): string {
    if (redFlags?.length > 0) return 'critical';
    if (predictive?.failurePredictions?.length > 0) return 'high';
    if (anomalies?.length > 0) return 'medium';
    return 'low';
  }

  private consolidateAssetRecommendations(optimization: any, anomalies: any, predictive: any, redFlags: any): any[] {
    const recommendations: any[] = [];

    // Add recommendations from all sources
    if (optimization?.recommendations) recommendations.push(...optimization.recommendations);
    if (anomalies?.recommendations) recommendations.push(...anomalies.recommendations);
    if (predictive?.recommendations) recommendations.push(...predictive.recommendations);
    if (redFlags?.riskAssessment?.mitigationStrategies) {
      recommendations.push(...redFlags.riskAssessment.mitigationStrategies);
    }

    return recommendations;
  }

  private determineNextActions(optimization: any, anomalies: any, predictive: any, redFlags: any): string[] {
    const actions: string[] = [];

    if (redFlags?.length > 0) actions.push('Address red flags immediately');
    if (predictive?.failurePredictions?.length > 0) actions.push('Schedule preventive maintenance');
    if (anomalies?.length > 0) actions.push('Investigate anomalies');
    if (optimization?.recommendations?.length > 0) actions.push('Implement optimization recommendations');

    return actions;
  }

  private async calculatePerformanceMetrics(): Promise<AIPerformanceMetrics> {
    // Mock performance metrics calculation
    return {
      optimizationAccuracy: 0.85,
      anomalyDetectionAccuracy: 0.90,
      predictiveAccuracy: 0.80,
      redFlaggingAccuracy: 0.88,
      overallAccuracy: 0.86,
      processingTime: 120, // seconds
      costSavings: 50000, // dollars
    };
  }

  private async analyzeTrends(): Promise<AITrends> {
    // Mock trends analysis
    return {
      performanceTrend: 'improving',
      costTrend: 'decreasing',
      riskTrend: 'stable',
      efficiencyTrend: 'increasing',
    };
  }

  private async generateInsights(summary: AIIntelligenceSummary): Promise<AIInsights> {
    return {
      keyInsights: [
        `Overall intelligence score: ${summary.overallIntelligenceScore.toFixed(1)}/100`,
        `${summary.recommendations.length} recommendations generated`,
        `${summary.alerts.length} alerts requiring attention`,
      ],
      strategicRecommendations: [
        'Continue AI optimization implementation',
        'Focus on critical asset maintenance',
        'Monitor anomaly detection accuracy',
      ],
      riskAssessment: {
        overallRisk: 'medium',
        criticalAssets: 3,
        highRiskAssets: 7,
      },
    };
  }
}

// Additional interfaces
export interface AIPerformanceMetrics {
  optimizationAccuracy: number;
  anomalyDetectionAccuracy: number;
  predictiveAccuracy: number;
  redFlaggingAccuracy: number;
  overallAccuracy: number;
  processingTime: number;
  costSavings: number;
}

export interface AITrends {
  performanceTrend: 'improving' | 'stable' | 'declining';
  costTrend: 'decreasing' | 'stable' | 'increasing';
  riskTrend: 'decreasing' | 'stable' | 'increasing';
  efficiencyTrend: 'improving' | 'stable' | 'declining';
}

export interface AIInsights {
  keyInsights: string[];
  strategicRecommendations: string[];
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    criticalAssets: number;
    highRiskAssets: number;
  };
}

export function createAIIntelligenceCore(
  organisationId: string,
  config?: Partial<AIIntelligenceConfig>
): AIIntelligenceCore {
  return new AIIntelligenceCore(organisationId, config);
}
