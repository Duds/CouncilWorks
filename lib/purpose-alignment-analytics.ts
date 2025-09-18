/**
 * Purpose Alignment Analytics System
 *
 * Provides comprehensive analytics and insights on asset purpose alignment,
 * function coverage, and organizational effectiveness to support decision-making
 * and continuous improvement of asset organization.
 *
 * @file lib/purpose-alignment-analytics.ts
 * @version 1.0.0
 * @since PI3 - E17: Create Function-Based Asset Organization
 */

import {
  PurposeAlignmentMetrics,
  AssetFunctionType,
  AssetPurposeCategory,
} from '@/types/resilience';
import { AssetModel } from './function-based-asset-modeling';

export interface AnalyticsConfiguration {
  enabled: boolean;
  enableRealTimeAnalytics: boolean;
  enableHistoricalTracking: boolean;
  enablePredictiveAnalytics: boolean;
  metricsRetentionDays: number;
  alertThresholds: AlertThreshold[];
  metadata: Record<string, any>;
}

export interface AlertThreshold {
  metric: string;
  operator: 'GT' | 'LT' | 'GTE' | 'LTE' | 'EQ';
  value: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  metadata: Record<string, any>;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  reportType: 'SUMMARY' | 'DETAILED' | 'TREND' | 'COMPARATIVE';
  generatedAt: Date;
  timeRange: { start: Date; end: Date };
  metrics: PurposeAlignmentMetrics;
  insights: AnalyticsInsight[];
  recommendations: AnalyticsRecommendation[];
  metadata: Record<string, any>;
}

export interface AnalyticsInsight {
  id: string;
  type: 'TREND' | 'ANOMALY' | 'PATTERN' | 'CORRELATION' | 'PREDICTION';
  title: string;
  description: string;
  confidence: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionable: boolean;
  metadata: Record<string, any>;
}

export interface AnalyticsRecommendation {
  id: string;
  type: 'OPTIMIZATION' | 'REORGANIZATION' | 'PURPOSE_ASSIGNMENT' | 'FUNCTION_ADDITION' | 'MAINTENANCE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  expectedBenefit: number;
  implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: string;
  metadata: Record<string, any>;
}

export interface TrendAnalysis {
  metric: string;
  timeSeries: { timestamp: Date; value: number }[];
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
  changeRate: number;
  confidence: number;
  metadata: Record<string, any>;
}

export interface ComparativeAnalysis {
  dimension: string;
  groups: { name: string; value: number; assets: string[] }[];
  bestPerformer: string;
  worstPerformer: string;
  improvementPotential: number;
  metadata: Record<string, any>;
}

/**
 * PurposeAlignmentAnalytics Class
 *
 * Provides comprehensive analytics on asset purpose alignment and organizational effectiveness.
 */
export class PurposeAlignmentAnalytics {
  private config: AnalyticsConfiguration;
  private assetModels: Map<string, AssetModel> = new Map();
  private historicalMetrics: Map<string, PurposeAlignmentMetrics[]> = new Map();
  private analyticsReports: Map<string, AnalyticsReport> = new Map();
  private alerts: Map<string, AnalyticsInsight[]> = new Map();

  constructor(config: AnalyticsConfiguration) {
    this.config = { ...config };
    console.log(`📊 Purpose Alignment Analytics System initialized.`);
  }

  /**
   * Registers an asset model with the analytics system.
   */
  public registerAssetModel(assetModel: AssetModel): void {
    this.assetModels.set(assetModel.id, assetModel);
    console.log(`📊 Registered asset model ${assetModel.name} with analytics system`);
  }

  /**
   * Generates comprehensive purpose alignment metrics.
   */
  public generatePurposeAlignmentMetrics(): PurposeAlignmentMetrics {
    const totalAssets = this.assetModels.size;
    const assetsWithPurpose = Array.from(this.assetModels.values()).filter(asset =>
      asset.purposes.length > 0
    ).length;

    const purposeAlignmentRate = totalAssets > 0 ? (assetsWithPurpose / totalAssets) * 100 : 0;

    // Calculate function coverage
    const functionCoverage: Record<AssetFunctionType, number> = {} as Record<AssetFunctionType, number>;
    Object.values(AssetFunctionType).forEach(funcType => {
      const assetsWithFunction = Array.from(this.assetModels.values()).filter(asset =>
        asset.functions.some(func => func.functionType === funcType)
      ).length;
      functionCoverage[funcType] = totalAssets > 0 ? (assetsWithFunction / totalAssets) * 100 : 0;
    });

    // Calculate category distribution
    const categoryDistribution: Record<AssetPurposeCategory, number> = {} as Record<AssetPurposeCategory, number>;
    Object.values(AssetPurposeCategory).forEach(category => {
      const assetsWithCategory = Array.from(this.assetModels.values()).filter(asset =>
        asset.purposes.some(purpose => purpose.category === category)
      ).length;
      categoryDistribution[category] = totalAssets > 0 ? (assetsWithCategory / totalAssets) * 100 : 0;
    });

    // Find orphaned assets
    const orphanedAssets = Array.from(this.assetModels.values()).filter(asset =>
      asset.functions.length === 0 || asset.purposes.length === 0
    ).map(asset => asset.id);

    // Generate recommendations
    const recommendations = this.generateRecommendations();

    const metrics: PurposeAlignmentMetrics = {
      id: `metrics-${Date.now()}`,
      timestamp: new Date(),
      totalAssets,
      assetsWithPurpose,
      purposeAlignmentRate: parseFloat(purposeAlignmentRate.toFixed(2)),
      functionCoverage,
      categoryDistribution,
      orphanedAssets,
      recommendations,
      metadata: { generatedBy: 'analytics-system' },
    };

    // Store historical metrics
    this.storeHistoricalMetrics(metrics);

    // Check for alerts
    this.checkAlerts(metrics);

    console.log(`📊 Generated purpose alignment metrics: ${purposeAlignmentRate.toFixed(1)}% alignment rate`);

    return metrics;
  }

  /**
   * Generates analytics insights based on current metrics.
   */
  public generateAnalyticsInsights(metrics: PurposeAlignmentMetrics): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // Purpose alignment insight
    if (metrics.purposeAlignmentRate < 80) {
      insights.push({
        id: `insight-alignment-${Date.now()}`,
        type: 'PATTERN',
        title: 'Low Purpose Alignment Rate',
        description: `Only ${metrics.purposeAlignmentRate.toFixed(1)}% of assets have assigned purposes. This indicates potential organizational gaps.`,
        confidence: 0.9,
        impact: 'HIGH',
        actionable: true,
        metadata: { metric: 'purposeAlignmentRate', value: metrics.purposeAlignmentRate },
      });
    }

    // Orphaned assets insight
    if (metrics.orphanedAssets.length > 0) {
      insights.push({
        id: `insight-orphaned-${Date.now()}`,
        type: 'ANOMALY',
        title: 'Orphaned Assets Detected',
        description: `${metrics.orphanedAssets.length} assets have no assigned functions or purposes. These assets may be underutilized or misclassified.`,
        confidence: 0.95,
        impact: 'MEDIUM',
        actionable: true,
        metadata: { orphanedCount: metrics.orphanedAssets.length },
      });
    }

    // Function coverage insights
    Object.entries(metrics.functionCoverage).forEach(([funcType, coverage]) => {
      if (coverage < 10) {
        insights.push({
          id: `insight-coverage-${funcType}-${Date.now()}`,
          type: 'PATTERN',
          title: `Low ${funcType} Coverage`,
          description: `Only ${coverage.toFixed(1)}% of assets serve ${funcType} functions. Consider if this aligns with organizational needs.`,
          confidence: 0.8,
          impact: 'MEDIUM',
          actionable: true,
          metadata: { functionType: funcType, coverage },
        });
      }
    });

    // Category distribution insights
    const primaryAssets = metrics.categoryDistribution[AssetPurposeCategory.PRIMARY] || 0;
    const backupAssets = metrics.categoryDistribution[AssetPurposeCategory.BACKUP] || 0;
    
    if (backupAssets > primaryAssets * 0.5) {
      insights.push({
        id: `insight-backup-ratio-${Date.now()}`,
        type: 'CORRELATION',
        title: 'High Backup Asset Ratio',
        description: `Backup assets represent ${backupAssets.toFixed(1)}% of total assets, which may indicate over-provisioning or inefficient resource allocation.`,
        confidence: 0.7,
        impact: 'MEDIUM',
        actionable: true,
        metadata: { primaryRatio: primaryAssets, backupRatio: backupAssets },
      });
    }

    return insights;
  }

  /**
   * Generates recommendations for improving purpose alignment.
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const totalAssets = this.assetModels.size;
    const orphanedAssets = Array.from(this.assetModels.values()).filter(asset =>
      asset.functions.length === 0 || asset.purposes.length === 0
    );

    if (orphanedAssets.length > 0) {
      recommendations.push(`Assign functions and purposes to ${orphanedAssets.length} orphaned assets`);
    }

    // Check for assets without primary functions
    const assetsWithoutPrimary = Array.from(this.assetModels.values()).filter(asset =>
      !asset.primaryFunction
    );

    if (assetsWithoutPrimary.length > 0) {
      recommendations.push(`Assign primary functions to ${assetsWithoutPrimary.length} assets`);
    }

    // Check for low-value assets
    const lowValueAssets = Array.from(this.assetModels.values()).filter(asset =>
      asset.valueContribution < 0.3
    );

    if (lowValueAssets.length > 0) {
      recommendations.push(`Review and optimize ${lowValueAssets.length} low-value assets`);
    }

    // Check for function type gaps
    const functionTypes = new Set(Array.from(this.assetModels.values())
      .flatMap(asset => asset.functions.map(func => func.functionType)));
    
    const expectedFunctionTypes = Object.values(AssetFunctionType);
    const missingFunctionTypes = expectedFunctionTypes.filter(funcType => !functionTypes.has(funcType));

    if (missingFunctionTypes.length > 0) {
      recommendations.push(`Consider adding assets for missing function types: ${missingFunctionTypes.join(', ')}`);
    }

    return recommendations;
  }

  /**
   * Generates a comprehensive analytics report.
   */
  public generateAnalyticsReport(
    reportType: 'SUMMARY' | 'DETAILED' | 'TREND' | 'COMPARATIVE',
    timeRange?: { start: Date; end: Date }
  ): AnalyticsReport {
    const metrics = this.generatePurposeAlignmentMetrics();
    const insights = this.generateAnalyticsInsights(metrics);
    const recommendations = this.generateAnalyticsRecommendations(metrics);

    const report: AnalyticsReport = {
      id: `report-${reportType.toLowerCase()}-${Date.now()}`,
      name: `${reportType} Purpose Alignment Report`,
      description: `Comprehensive ${reportType.toLowerCase()} analysis of asset purpose alignment`,
      reportType,
      generatedAt: new Date(),
      timeRange: timeRange || { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
      metrics,
      insights,
      recommendations,
      metadata: { generatedBy: 'analytics-system', reportType },
    };

    this.analyticsReports.set(report.id, report);

    console.log(`📊 Generated ${reportType.toLowerCase()} analytics report`);

    return report;
  }

  /**
   * Generates analytics recommendations.
   */
  private generateAnalyticsRecommendations(metrics: PurposeAlignmentMetrics): AnalyticsRecommendation[] {
    const recommendations: AnalyticsRecommendation[] = [];

    // Purpose assignment recommendation
    if (metrics.purposeAlignmentRate < 80) {
      recommendations.push({
        id: `rec-purpose-assignment-${Date.now()}`,
        type: 'PURPOSE_ASSIGNMENT',
        priority: 'HIGH',
        title: 'Improve Purpose Assignment',
        description: `Assign purposes to ${metrics.totalAssets - metrics.assetsWithPurpose} assets to improve organizational alignment`,
        expectedBenefit: 0.8,
        implementationEffort: 'MEDIUM',
        timeframe: '2-4 weeks',
        metadata: { targetAlignment: 90 },
      });
    }

    // Function addition recommendation
    const lowCoverageFunctions = Object.entries(metrics.functionCoverage)
      .filter(([, coverage]) => coverage < 20)
      .map(([funcType]) => funcType);

    if (lowCoverageFunctions.length > 0) {
      recommendations.push({
        id: `rec-function-addition-${Date.now()}`,
        type: 'FUNCTION_ADDITION',
        priority: 'MEDIUM',
        title: 'Add Missing Function Types',
        description: `Consider adding assets for function types with low coverage: ${lowCoverageFunctions.join(', ')}`,
        expectedBenefit: 0.6,
        implementationEffort: 'HIGH',
        timeframe: '1-3 months',
        metadata: { lowCoverageFunctions },
      });
    }

    // Optimization recommendation
    const orphanedCount = metrics.orphanedAssets.length;
    if (orphanedCount > 0) {
      recommendations.push({
        id: `rec-optimization-${Date.now()}`,
        type: 'OPTIMIZATION',
        priority: 'MEDIUM',
        title: 'Optimize Orphaned Assets',
        description: `Review and optimize ${orphanedCount} orphaned assets for better organizational value`,
        expectedBenefit: 0.7,
        implementationEffort: 'MEDIUM',
        timeframe: '3-6 weeks',
        metadata: { orphanedCount },
      });
    }

    return recommendations;
  }

  /**
   * Performs trend analysis on historical metrics.
   */
  public performTrendAnalysis(metric: string, days: number = 30): TrendAnalysis {
    const historicalData = this.getHistoricalMetrics(days);
    const timeSeries = historicalData.map(data => ({
      timestamp: data.timestamp,
      value: this.getMetricValue(data, metric),
    }));

    const trend = this.calculateTrend(timeSeries);
    const changeRate = this.calculateChangeRate(timeSeries);
    const confidence = this.calculateTrendConfidence(timeSeries);

    return {
      metric,
      timeSeries,
      trend,
      changeRate,
      confidence,
      metadata: { analysisPeriod: days },
    };
  }

  /**
   * Performs comparative analysis across different dimensions.
   */
  public performComparativeAnalysis(dimension: string): ComparativeAnalysis {
    const groups: { name: string; value: number; assets: string[] }[] = [];

    switch (dimension) {
      case 'functionType':
        Object.values(AssetFunctionType).forEach(funcType => {
          const assets = Array.from(this.assetModels.values()).filter(asset =>
            asset.functions.some(func => func.functionType === funcType)
          );
          groups.push({
            name: funcType,
            value: assets.length,
            assets: assets.map(asset => asset.id),
          });
        });
        break;

      case 'purposeCategory':
        Object.values(AssetPurposeCategory).forEach(category => {
          const assets = Array.from(this.assetModels.values()).filter(asset =>
            asset.purposes.some(purpose => purpose.category === category)
          );
          groups.push({
            name: category,
            value: assets.length,
            assets: assets.map(asset => asset.id),
          });
        });
        break;

      case 'valueContribution':
        const valueRanges = [
          { name: 'High Value (0.8+)', min: 0.8, max: 1.0 },
          { name: 'Medium Value (0.4-0.8)', min: 0.4, max: 0.8 },
          { name: 'Low Value (0-0.4)', min: 0.0, max: 0.4 },
        ];

        valueRanges.forEach(range => {
          const assets = Array.from(this.assetModels.values()).filter(asset =>
            asset.valueContribution >= range.min && asset.valueContribution < range.max
          );
          groups.push({
            name: range.name,
            value: assets.length,
            assets: assets.map(asset => asset.id),
          });
        });
        break;
    }

    const sortedGroups = groups.sort((a, b) => b.value - a.value);
    const bestPerformer = sortedGroups[0]?.name || 'N/A';
    const worstPerformer = sortedGroups[sortedGroups.length - 1]?.name || 'N/A';
    const improvementPotential = sortedGroups.length > 1 
      ? (sortedGroups[0].value - sortedGroups[sortedGroups.length - 1].value) / sortedGroups[0].value
      : 0;

    return {
      dimension,
      groups: sortedGroups,
      bestPerformer,
      worstPerformer,
      improvementPotential,
      metadata: { analysisDate: new Date() },
    };
  }

  /**
   * Gets historical metrics for trend analysis.
   */
  private getHistoricalMetrics(days: number): PurposeAlignmentMetrics[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allMetrics: PurposeAlignmentMetrics[] = [];
    for (const metrics of this.historicalMetrics.values()) {
      allMetrics.push(...metrics.filter(m => m.timestamp > cutoffDate));
    }

    return allMetrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Gets metric value from metrics object.
   */
  private getMetricValue(metrics: PurposeAlignmentMetrics, metric: string): number {
    switch (metric) {
      case 'purposeAlignmentRate':
        return metrics.purposeAlignmentRate;
      case 'totalAssets':
        return metrics.totalAssets;
      case 'assetsWithPurpose':
        return metrics.assetsWithPurpose;
      default:
        return 0;
    }
  }

  /**
   * Calculates trend from time series data.
   */
  private calculateTrend(timeSeries: { timestamp: Date; value: number }[]): 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE' {
    if (timeSeries.length < 2) return 'STABLE';

    const firstValue = timeSeries[0].value;
    const lastValue = timeSeries[timeSeries.length - 1].value;
    const change = lastValue - firstValue;
    const changePercent = Math.abs(change) / firstValue;

    if (changePercent < 0.05) return 'STABLE';
    if (changePercent > 0.2) return 'VOLATILE';
    return change > 0 ? 'INCREASING' : 'DECREASING';
  }

  /**
   * Calculates change rate from time series data.
   */
  private calculateChangeRate(timeSeries: { timestamp: Date; value: number }[]): number {
    if (timeSeries.length < 2) return 0;

    const firstValue = timeSeries[0].value;
    const lastValue = timeSeries[timeSeries.length - 1].value;
    const timeSpan = timeSeries[timeSeries.length - 1].timestamp.getTime() - timeSeries[0].timestamp.getTime();
    const days = timeSpan / (1000 * 60 * 60 * 24);

    return days > 0 ? (lastValue - firstValue) / days : 0;
  }

  /**
   * Calculates trend confidence based on data consistency.
   */
  private calculateTrendConfidence(timeSeries: { timestamp: Date; value: number }[]): number {
    if (timeSeries.length < 3) return 0.5;

    const values = timeSeries.map(point => point.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    // Higher confidence for lower variance
    return Math.max(0.1, Math.min(1.0, 1 - (standardDeviation / mean)));
  }

  /**
   * Stores historical metrics for trend analysis.
   */
  private storeHistoricalMetrics(metrics: PurposeAlignmentMetrics): void {
    const key = 'global';
    if (!this.historicalMetrics.has(key)) {
      this.historicalMetrics.set(key, []);
    }

    const history = this.historicalMetrics.get(key)!;
    history.push(metrics);

    // Keep only recent metrics
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.metricsRetentionDays);
    
    this.historicalMetrics.set(key, history.filter(m => m.timestamp > cutoffDate));
  }

  /**
   * Checks for alerts based on current metrics.
   */
  private checkAlerts(metrics: PurposeAlignmentMetrics): void {
    for (const threshold of this.config.alertThresholds) {
      const value = this.getMetricValue(metrics, threshold.metric);
      let triggered = false;

      switch (threshold.operator) {
        case 'GT':
          triggered = value > threshold.value;
          break;
        case 'LT':
          triggered = value < threshold.value;
          break;
        case 'GTE':
          triggered = value >= threshold.value;
          break;
        case 'LTE':
          triggered = value <= threshold.value;
          break;
        case 'EQ':
          triggered = value === threshold.value;
          break;
      }

      if (triggered) {
        const alert: AnalyticsInsight = {
          id: `alert-${threshold.metric}-${Date.now()}`,
          type: 'ANOMALY',
          title: `Alert: ${threshold.metric}`,
          description: threshold.message,
          confidence: 0.9,
          impact: threshold.severity,
          actionable: true,
          metadata: { threshold, value },
        };

        if (!this.alerts.has(threshold.metric)) {
          this.alerts.set(threshold.metric, []);
        }
        this.alerts.get(threshold.metric)!.push(alert);
      }
    }
  }

  /**
   * Gets all analytics reports.
   */
  public getAnalyticsReports(): AnalyticsReport[] {
    return Array.from(this.analyticsReports.values());
  }

  /**
   * Gets active alerts.
   */
  public getActiveAlerts(): AnalyticsInsight[] {
    const allAlerts: AnalyticsInsight[] = [];
    for (const alerts of this.alerts.values()) {
      allAlerts.push(...alerts);
    }
    return allAlerts;
  }

  /**
   * Updates the configuration of the analytics system.
   */
  public updateConfig(newConfig: Partial<AnalyticsConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Purpose Alignment Analytics configuration updated.`);
  }

  /**
   * Removes an asset model from the analytics system.
   */
  public unregisterAssetModel(assetId: string): boolean {
    const removed = this.assetModels.delete(assetId);
    if (removed) {
      console.log(`📊 Unregistered asset model ${assetId} from analytics system`);
    }
    return removed;
  }
}
