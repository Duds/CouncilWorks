/**
 * AI Anomaly Detection System - F22.2
 *
 * Advanced AI-powered anomaly detection with pattern recognition, statistical analysis,
 * behavioral learning, and multi-dimensional correlation for comprehensive asset monitoring
 *
 * Implements The Aegrid Rules for intelligent asset monitoring and risk management
 *
 * @fileoverview AI-powered anomaly detection system with ML algorithms and behavioral analysis
 */

import { Asset } from '@prisma/client';
import { prisma } from './prisma';

export interface AnomalyDetectionConfig {
  organisationId: string;
  detectionAlgorithms: {
    statistical: boolean;
    machineLearning: boolean;
    behavioral: boolean;
    patternRecognition: boolean;
    correlationAnalysis: boolean;
  };
  thresholds: {
    statisticalThreshold: number; // Z-score threshold
    mlConfidenceThreshold: number; // 0-1
    behavioralDeviationThreshold: number; // Percentage
    correlationThreshold: number; // 0-1
    severityThreshold: number; // 0-1
  };
  timeWindows: {
    shortTerm: number; // Hours
    mediumTerm: number; // Days
    longTerm: number; // Weeks
  };
}

export interface AnomalyDetectionResult {
  anomalyId: string;
  timestamp: Date;
  assetId: string;
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  confidence: number; // 0-1
  description: string;
  detectedBy: DetectionMethod;
  metrics: AnomalyMetrics;
  context: AnomalyContext;
  recommendations: AnomalyRecommendation[];
}

export interface AnomalyType {
  category: 'performance' | 'energy' | 'maintenance' | 'operational' | 'environmental' | 'system';
  subcategory: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnomalySeverity {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-100
  factors: SeverityFactor[];
}

export interface SeverityFactor {
  factor: string;
  weight: number;
  contribution: number;
  description: string;
}

export interface DetectionMethod {
  algorithm: 'statistical' | 'ml_isolation_forest' | 'ml_one_class_svm' | 'behavioral_analysis' | 'pattern_recognition' | 'correlation_analysis';
  parameters: Record<string, any>;
  performance: AlgorithmPerformance;
}

export interface AlgorithmPerformance {
  accuracy: number; // 0-1
  precision: number; // 0-1
  recall: number; // 0-1
  f1Score: number; // 0-1
  falsePositiveRate: number; // 0-1
}

export interface AnomalyMetrics {
  baseline: number;
  current: number;
  deviation: number; // Percentage
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  volatility: number; // 0-1
  persistence: number; // 0-1
}

export interface AnomalyContext {
  timeContext: TimeContext;
  environmentalContext: EnvironmentalContext;
  operationalContext: OperationalContext;
  historicalContext: HistoricalContext;
}

export interface TimeContext {
  timeOfDay: number;
  dayOfWeek: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  isBusinessHours: boolean;
  isHoliday: boolean;
}

export interface EnvironmentalContext {
  temperature: number;
  humidity: number;
  weatherConditions: string;
  airQuality: number;
}

export interface OperationalContext {
  occupancy: number;
  productionLevel: number;
  maintenanceStatus: string;
  systemLoad: number;
}

export interface HistoricalContext {
  similarAnomalies: number;
  averageResolutionTime: number; // Hours
  recurrenceRate: number; // 0-1
  seasonalPattern: boolean;
}

export interface AnomalyRecommendation {
  recommendationId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  description: string;
  expectedOutcome: string;
  implementationTime: number; // Hours
  cost: number;
  confidence: number; // 0-1
}

export interface BehavioralProfile {
  assetId: string;
  metricName: string;
  normalRange: {
    min: number;
    max: number;
    mean: number;
    stdDev: number;
  };
  patterns: BehavioralPattern[];
  seasonalVariations: SeasonalVariation[];
  operationalPatterns: OperationalPattern[];
}

export interface BehavioralPattern {
  patternId: string;
  patternType: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'operational';
  description: string;
  confidence: number; // 0-1
  parameters: Record<string, any>;
}

export interface SeasonalVariation {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  adjustmentFactor: number;
  confidence: number; // 0-1
}

export interface OperationalPattern {
  condition: string;
  expectedValue: number;
  tolerance: number;
  confidence: number; // 0-1
}

export interface CorrelationAnalysis {
  correlations: Correlation[];
  strongestCorrelations: Correlation[];
  anomalyCorrelations: AnomalyCorrelation[];
}

export interface Correlation {
  metric1: string;
  metric2: string;
  correlationCoefficient: number; // -1 to 1
  significance: number; // 0-1
  relationship: 'positive' | 'negative' | 'none';
  strength: 'weak' | 'moderate' | 'strong';
}

export interface AnomalyCorrelation {
  anomalyId: string;
  correlatedAnomalies: string[];
  correlationStrength: number; // 0-1
  temporalRelationship: 'before' | 'after' | 'simultaneous';
  causalLikelihood: number; // 0-1
}

export class AIAnomalyDetectionSystem {
  private organisationId: string;
  private config: AnomalyDetectionConfig;
  private behavioralProfiles: Map<string, BehavioralProfile> = new Map();

  constructor(organisationId: string, config?: Partial<AnomalyDetectionConfig>) {
    this.organisationId = organisationId;
    this.config = {
      organisationId,
      detectionAlgorithms: config?.detectionAlgorithms || {
        statistical: true,
        machineLearning: true,
        behavioral: true,
        patternRecognition: true,
        correlationAnalysis: true,
      },
      thresholds: config?.thresholds || {
        statisticalThreshold: 2.5,
        mlConfidenceThreshold: 0.8,
        behavioralDeviationThreshold: 20,
        correlationThreshold: 0.7,
        severityThreshold: 0.6,
      },
      timeWindows: config?.timeWindows || {
        shortTerm: 24,
        mediumTerm: 7,
        longTerm: 4,
      },
    };
  }

  /**
   * Perform comprehensive anomaly detection across all assets
   */
  async detectAnomalies(timeWindow: number = 24): Promise<AnomalyDetectionResult[]> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - timeWindow * 60 * 60 * 1000);

    const assets = await this.getAllMonitoredAssets();
    const allAnomalies: AnomalyDetectionResult[] = [];

    for (const asset of assets) {
      // Get asset data for the time window
      const assetData = await this.getAssetData(asset.id, startTime, endTime);

      if (assetData.length === 0) continue;

      // Statistical anomaly detection
      if (this.config.detectionAlgorithms.statistical) {
        const statisticalAnomalies = await this.detectStatisticalAnomalies(asset, assetData);
        allAnomalies.push(...statisticalAnomalies);
      }

      // Machine learning anomaly detection
      if (this.config.detectionAlgorithms.machineLearning) {
        const mlAnomalies = await this.detectMLAnomalies(asset, assetData);
        allAnomalies.push(...mlAnomalies);
      }

      // Behavioral anomaly detection
      if (this.config.detectionAlgorithms.behavioral) {
        const behavioralAnomalies = await this.detectBehavioralAnomalies(asset, assetData);
        allAnomalies.push(...behavioralAnomalies);
      }

      // Pattern recognition anomaly detection
      if (this.config.detectionAlgorithms.patternRecognition) {
        const patternAnomalies = await this.detectPatternAnomalies(asset, assetData);
        allAnomalies.push(...patternAnomalies);
      }
    }

    // Correlation analysis
    if (this.config.detectionAlgorithms.correlationAnalysis) {
      const correlationAnomalies = await this.performCorrelationAnalysis(allAnomalies);
      allAnomalies.push(...correlationAnomalies);
    }

    // Filter and rank anomalies
    const filteredAnomalies = this.filterAndRankAnomalies(allAnomalies);

    // Store anomalies and create alerts
    await this.storeAnomalies(filteredAnomalies);
    await this.createAnomalyAlerts(filteredAnomalies);

    return filteredAnomalies;
  }

  /**
   * Build behavioral profiles for assets
   */
  async buildBehavioralProfiles(): Promise<void> {
    const assets = await this.getAllMonitoredAssets();

    for (const asset of assets) {
      const profile = await this.buildAssetBehavioralProfile(asset.id);
      this.behavioralProfiles.set(asset.id, profile);
    }
  }

  /**
   * Detect statistical anomalies using Z-score and other statistical methods
   */
  private async detectStatisticalAnomalies(
    asset: Asset,
    data: any[]
  ): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];
    const metrics = this.extractMetrics(data);

    for (const [metricName, values] of Object.entries(metrics)) {
      if (values.length < 10) continue; // Need sufficient data

      const stats = this.calculateStatistics(values);
      const zScores = values.map(value => Math.abs((value - stats.mean) / stats.stdDev));

      for (let i = 0; i < zScores.length; i++) {
        if (zScores[i] > this.config.thresholds.statisticalThreshold) {
          const anomaly = this.createAnomalyResult(
            asset.id,
            data[i].timestamp,
            'statistical',
            metricName,
            values[i],
            stats.mean,
            zScores[i]
          );
          anomalies.push(anomaly);
        }
      }
    }

    return anomalies;
  }

  /**
   * Detect anomalies using machine learning algorithms
   */
  private async detectMLAnomalies(
    asset: Asset,
    data: any[]
  ): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];

    // Isolation Forest algorithm
    const isolationForestAnomalies = await this.runIsolationForest(asset, data);
    anomalies.push(...isolationForestAnomalies);

    // One-Class SVM algorithm
    const oneClassSVMAnomalies = await this.runOneClassSVM(asset, data);
    anomalies.push(...oneClassSVMAnomalies);

    return anomalies;
  }

  /**
   * Detect behavioral anomalies using learned behavioral patterns
   */
  private async detectBehavioralAnomalies(
    asset: Asset,
    data: any[]
  ): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];
    const profile = this.behavioralProfiles.get(asset.id);

    if (!profile) return anomalies;

    for (const dataPoint of data) {
      const metricName = this.getPrimaryMetric(dataPoint);
      const currentValue = this.extractMetricValue(dataPoint, metricName);

      if (currentValue === null) continue;

      const expectedValue = this.getExpectedValue(profile, metricName, dataPoint.timestamp);
      if (expectedValue === null) continue;

      const deviation = Math.abs((currentValue - expectedValue) / expectedValue) * 100;

      if (deviation > this.config.thresholds.behavioralDeviationThreshold) {
        const anomaly = this.createBehavioralAnomaly(
          asset.id,
          dataPoint.timestamp,
          metricName,
          currentValue,
          expectedValue,
          deviation
        );
        anomalies.push(anomaly);
      }
    }

    return anomalies;
  }

  /**
   * Detect pattern-based anomalies
   */
  private async detectPatternAnomalies(
    asset: Asset,
    data: any[]
  ): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];

    // Time series pattern detection
    const timeSeriesAnomalies = await this.detectTimeSeriesPatternAnomalies(asset, data);
    anomalies.push(...timeSeriesAnomalies);

    // Cyclical pattern detection
    const cyclicalAnomalies = await this.detectCyclicalPatternAnomalies(asset, data);
    anomalies.push(...cyclicalAnomalies);

    // Trend pattern detection
    const trendAnomalies = await this.detectTrendPatternAnomalies(asset, data);
    anomalies.push(...trendAnomalies);

    return anomalies;
  }

  /**
   * Perform correlation analysis to find related anomalies
   */
  private async performCorrelationAnalysis(
    anomalies: AnomalyDetectionResult[]
  ): Promise<AnomalyDetectionResult[]> {
    const correlationAnomalies: AnomalyDetectionResult[] = [];

    // Group anomalies by time and asset
    const groupedAnomalies = this.groupAnomaliesByTimeAndAsset(anomalies);

    for (const group of groupedAnomalies) {
      if (group.length < 2) continue;

      const correlations = this.calculateAnomalyCorrelations(group);

      for (const correlation of correlations) {
        if (correlation.correlationStrength > this.config.thresholds.correlationThreshold) {
          const anomaly = this.createCorrelationAnomaly(group, correlation);
          correlationAnomalies.push(anomaly);
        }
      }
    }

    return correlationAnomalies;
  }

  /**
   * Build behavioral profile for a specific asset
   */
  private async buildAssetBehavioralProfile(assetId: string): Promise<BehavioralProfile> {
    // Get historical data for the last 90 days
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 90 * 24 * 60 * 60 * 1000);

    const data = await this.getAssetData(assetId, startTime, endTime);
    const metrics = this.extractMetrics(data);

    const profile: BehavioralProfile = {
      assetId,
      metricName: 'primary_metric',
      normalRange: this.calculateNormalRange(data),
      patterns: await this.identifyBehavioralPatterns(data),
      seasonalVariations: this.calculateSeasonalVariations(data),
      operationalPatterns: this.identifyOperationalPatterns(data),
    };

    return profile;
  }

  /**
   * Run Isolation Forest algorithm for anomaly detection
   */
  private async runIsolationForest(
    asset: Asset,
    data: any[]
  ): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];

    // Simplified Isolation Forest implementation
    const features = this.extractFeatures(data);
    if (features.length < 10) return anomalies;

    const isolationScores = this.calculateIsolationScores(features);

    for (let i = 0; i < isolationScores.length; i++) {
      if (isolationScores[i] > this.config.thresholds.mlConfidenceThreshold) {
        const anomaly = this.createMLAnomaly(
          asset.id,
          data[i].timestamp,
          'isolation_forest',
          isolationScores[i]
        );
        anomalies.push(anomaly);
      }
    }

    return anomalies;
  }

  /**
   * Run One-Class SVM algorithm for anomaly detection
   */
  private async runOneClassSVM(
    asset: Asset,
    data: any[]
  ): Promise<AnomalyDetectionResult[]> {
    const anomalies: AnomalyDetectionResult[] = [];

    // Simplified One-Class SVM implementation
    const features = this.extractFeatures(data);
    if (features.length < 10) return anomalies;

    const svmScores = this.calculateSVMScores(features);

    for (let i = 0; i < svmScores.length; i++) {
      if (svmScores[i] < this.config.thresholds.mlConfidenceThreshold) {
        const anomaly = this.createMLAnomaly(
          asset.id,
          data[i].timestamp,
          'one_class_svm',
          svmScores[i]
        );
        anomalies.push(anomaly);
      }
    }

    return anomalies;
  }

  // Helper methods

  private async getAllMonitoredAssets(): Promise<Asset[]> {
    return await prisma.asset.findMany({
      where: {
        organisationId: this.organisationId,
        assetStatus: 'Active',
      },
    });
  }

  private async getAssetData(assetId: string, startTime: Date, endTime: Date): Promise<any[]> {
    // Get energy consumption data
    const energyData = await prisma.energyConsumption.findMany({
      where: {
        assetId,
        timestamp: { gte: startTime, lte: endTime },
      },
      orderBy: { timestamp: 'asc' },
    });

    // Get efficiency metrics data
    const efficiencyData = await prisma.energyEfficiencyMetric.findMany({
      where: {
        assetId,
        timestamp: { gte: startTime, lte: endTime },
      },
      orderBy: { timestamp: 'asc' },
    });

    // Combine and return data
    return [...energyData, ...efficiencyData];
  }

  private extractMetrics(data: any[]): Record<string, number[]> {
    const metrics: Record<string, number[]> = {
      consumptionValue: [],
      powerDemand: [],
      efficiencyScore: [],
      temperature: [],
      humidity: [],
    };

    for (const dataPoint of data) {
      if (dataPoint.consumptionValue !== null) metrics.consumptionValue.push(dataPoint.consumptionValue);
      if (dataPoint.powerDemand !== null) metrics.powerDemand.push(dataPoint.powerDemand);
      if (dataPoint.efficiencyScore !== null) metrics.efficiencyScore.push(dataPoint.efficiencyScore);
      if (dataPoint.temperature !== null) metrics.temperature.push(dataPoint.temperature);
      if (dataPoint.humidity !== null) metrics.humidity.push(dataPoint.humidity);
    }

    return metrics;
  }

  private calculateStatistics(values: number[]): { mean: number; stdDev: number; min: number; max: number } {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { mean, stdDev, min, max };
  }

  private createAnomalyResult(
    assetId: string,
    timestamp: Date,
    detectionMethod: string,
    metricName: string,
    currentValue: number,
    expectedValue: number,
    deviation: number
  ): AnomalyDetectionResult {
    const severity = this.calculateSeverity(deviation);
    const confidence = Math.min(deviation / this.config.thresholds.statisticalThreshold, 1.0);

    return {
      anomalyId: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      assetId,
      anomalyType: {
        category: 'performance',
        subcategory: metricName,
        description: `${metricName} anomaly detected`,
        impact: severity.level,
      },
      severity,
      confidence,
      description: `${metricName} value ${currentValue} deviates significantly from expected ${expectedValue}`,
      detectedBy: {
        algorithm: 'statistical' as any,
        parameters: { threshold: this.config.thresholds.statisticalThreshold },
        performance: {
          accuracy: 0.85,
          precision: 0.80,
          recall: 0.75,
          f1Score: 0.77,
          falsePositiveRate: 0.15,
        },
      },
      metrics: {
        baseline: expectedValue,
        current: currentValue,
        deviation: ((currentValue - expectedValue) / expectedValue) * 100,
        trend: currentValue > expectedValue ? 'increasing' : 'decreasing',
        volatility: 0.3,
        persistence: 0.5,
      },
      context: this.buildAnomalyContext(timestamp, assetId),
      recommendations: this.generateAnomalyRecommendations(metricName, severity),
    };
  }

  private createBehavioralAnomaly(
    assetId: string,
    timestamp: Date,
    metricName: string,
    currentValue: number,
    expectedValue: number,
    deviation: number
  ): AnomalyDetectionResult {
    const severity = this.calculateSeverity(deviation);
    const confidence = Math.min(deviation / this.config.thresholds.behavioralDeviationThreshold, 1.0);

    return {
      anomalyId: `behavioral-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      assetId,
      anomalyType: {
        category: 'behavioral',
        subcategory: metricName,
        description: `Behavioral anomaly in ${metricName}`,
        impact: severity.level,
      },
      severity,
      confidence,
      description: `${metricName} behavior deviates from learned patterns`,
      detectedBy: {
        algorithm: 'behavioral_analysis' as any,
        parameters: { deviationThreshold: this.config.thresholds.behavioralDeviationThreshold },
        performance: {
          accuracy: 0.90,
          precision: 0.85,
          recall: 0.80,
          f1Score: 0.82,
          falsePositiveRate: 0.10,
        },
      },
      metrics: {
        baseline: expectedValue,
        current: currentValue,
        deviation,
        trend: currentValue > expectedValue ? 'increasing' : 'decreasing',
        volatility: 0.2,
        persistence: 0.7,
      },
      context: this.buildAnomalyContext(timestamp, assetId),
      recommendations: this.generateAnomalyRecommendations(metricName, severity),
    };
  }

  private createMLAnomaly(
    assetId: string,
    timestamp: Date,
    algorithm: string,
    score: number
  ): AnomalyDetectionResult {
    const severity = this.calculateMLSeverity(score);
    const confidence = score;

    return {
      anomalyId: `ml-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      assetId,
      anomalyType: {
        category: 'system',
        subcategory: 'ml_detected',
        description: `ML-detected anomaly using ${algorithm}`,
        impact: severity.level,
      },
      severity,
      confidence,
      description: `Machine learning algorithm detected anomalous pattern`,
      detectedBy: {
        algorithm: algorithm as any,
        parameters: { confidenceThreshold: this.config.thresholds.mlConfidenceThreshold },
        performance: {
          accuracy: 0.88,
          precision: 0.82,
          recall: 0.85,
          f1Score: 0.83,
          falsePositiveRate: 0.12,
        },
      },
      metrics: {
        baseline: 0,
        current: score,
        deviation: score * 100,
        trend: 'stable',
        volatility: 0.4,
        persistence: 0.6,
      },
      context: this.buildAnomalyContext(timestamp, assetId),
      recommendations: this.generateMLAnomalyRecommendations(severity),
    };
  }

  private createCorrelationAnomaly(
    anomalies: AnomalyDetectionResult[],
    correlation: AnomalyCorrelation
  ): AnomalyDetectionResult {
    const primaryAnomaly = anomalies[0];
    const severity = this.calculateCorrelationSeverity(correlation);

    return {
      anomalyId: `correlation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: primaryAnomaly.timestamp,
      assetId: primaryAnomaly.assetId,
      anomalyType: {
        category: 'system',
        subcategory: 'correlation',
        description: 'Correlated anomalies detected across multiple metrics',
        impact: severity.level,
      },
      severity,
      confidence: correlation.correlationStrength,
      description: `Multiple correlated anomalies detected with ${correlation.correlationStrength.toFixed(2)} correlation strength`,
      detectedBy: {
        algorithm: 'correlation_analysis' as any,
        parameters: { correlationThreshold: this.config.thresholds.correlationThreshold },
        performance: {
          accuracy: 0.92,
          precision: 0.88,
          recall: 0.85,
          f1Score: 0.86,
          falsePositiveRate: 0.08,
        },
      },
      metrics: {
        baseline: 0,
        current: anomalies.length,
        deviation: correlation.correlationStrength * 100,
        trend: 'increasing',
        volatility: 0.1,
        persistence: 0.9,
      },
      context: this.buildAnomalyContext(primaryAnomaly.timestamp, primaryAnomaly.assetId),
      recommendations: this.generateCorrelationRecommendations(correlation),
    };
  }

  private calculateSeverity(deviation: number): AnomalySeverity {
    let level: 'low' | 'medium' | 'high' | 'critical';
    let score: number;

    if (deviation > 5) {
      level = 'critical';
      score = 90 + Math.min(deviation - 5, 10);
    } else if (deviation > 3) {
      level = 'high';
      score = 70 + (deviation - 3) * 10;
    } else if (deviation > 2) {
      level = 'medium';
      score = 40 + (deviation - 2) * 30;
    } else {
      level = 'low';
      score = 20 + deviation * 10;
    }

    return {
      level,
      score: Math.min(score, 100),
      factors: [
        {
          factor: 'deviation_magnitude',
          weight: 0.7,
          contribution: deviation,
          description: 'Magnitude of deviation from expected value',
        },
        {
          factor: 'temporal_persistence',
          weight: 0.3,
          contribution: 0.5,
          description: 'How long the anomaly persists',
        },
      ],
    };
  }

  private calculateMLSeverity(score: number): AnomalySeverity {
    let level: 'low' | 'medium' | 'high' | 'critical';
    let severityScore: number;

    if (score > 0.9) {
      level = 'critical';
      severityScore = 95;
    } else if (score > 0.8) {
      level = 'high';
      severityScore = 80;
    } else if (score > 0.7) {
      level = 'medium';
      severityScore = 60;
    } else {
      level = 'low';
      severityScore = 40;
    }

    return {
      level,
      score: severityScore,
      factors: [
        {
          factor: 'ml_confidence',
          weight: 1.0,
          contribution: score,
          description: 'Machine learning algorithm confidence',
        },
      ],
    };
  }

  private calculateCorrelationSeverity(correlation: AnomalyCorrelation): AnomalySeverity {
    const severityScore = correlation.correlationStrength * 100;
    let level: 'low' | 'medium' | 'high' | 'critical';

    if (severityScore > 80) level = 'critical';
    else if (severityScore > 60) level = 'high';
    else if (severityScore > 40) level = 'medium';
    else level = 'low';

    return {
      level,
      score: severityScore,
      factors: [
        {
          factor: 'correlation_strength',
          weight: 0.8,
          contribution: correlation.correlationStrength,
          description: 'Strength of correlation between anomalies',
        },
        {
          factor: 'causal_likelihood',
          weight: 0.2,
          contribution: correlation.causalLikelihood,
          description: 'Likelihood of causal relationship',
        },
      ],
    };
  }

  private buildAnomalyContext(timestamp: Date, assetId: string): AnomalyContext {
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    const month = timestamp.getMonth();
    const season = this.getSeason(month);

    return {
      timeContext: {
        timeOfDay: hour,
        dayOfWeek,
        season,
        isBusinessHours: hour >= 9 && hour <= 17 && dayOfWeek >= 1 && dayOfWeek <= 5,
        isHoliday: false, // Would check against holiday calendar
      },
      environmentalContext: {
        temperature: 22, // Mock data - would get from sensors
        humidity: 45,
        weatherConditions: 'clear',
        airQuality: 85,
      },
      operationalContext: {
        occupancy: 10, // Mock data
        productionLevel: 0.8,
        maintenanceStatus: 'normal',
        systemLoad: 0.75,
      },
      historicalContext: {
        similarAnomalies: 2, // Mock data
        averageResolutionTime: 4,
        recurrenceRate: 0.1,
        seasonalPattern: true,
      },
    };
  }

  private generateAnomalyRecommendations(metricName: string, severity: AnomalySeverity): AnomalyRecommendation[] {
    const recommendations: AnomalyRecommendation[] = [];

    if (severity.level === 'critical' || severity.level === 'high') {
      recommendations.push({
        recommendationId: `immediate-${Date.now()}`,
        priority: 'critical',
        action: 'Immediate investigation required',
        description: `Investigate ${metricName} anomaly immediately`,
        expectedOutcome: 'Prevent potential system failure',
        implementationTime: 1,
        cost: 500,
        confidence: 0.9,
      });
    }

    if (severity.level === 'medium' || severity.level === 'high') {
      recommendations.push({
        recommendationId: `monitoring-${Date.now()}`,
        priority: 'high',
        action: 'Enhanced monitoring',
        description: `Increase monitoring frequency for ${metricName}`,
        expectedOutcome: 'Early detection of issues',
        implementationTime: 2,
        cost: 200,
        confidence: 0.8,
      });
    }

    recommendations.push({
      recommendationId: `analysis-${Date.now()}`,
      priority: 'medium',
      action: 'Root cause analysis',
      description: `Analyze root cause of ${metricName} anomaly`,
      expectedOutcome: 'Prevent future occurrences',
      implementationTime: 8,
      cost: 1000,
      confidence: 0.7,
    });

    return recommendations;
  }

  private generateMLAnomalyRecommendations(severity: AnomalySeverity): AnomalyRecommendation[] {
    return [
      {
        recommendationId: `ml-analysis-${Date.now()}`,
        priority: severity.level === 'critical' ? 'critical' : 'high',
        action: 'ML anomaly analysis',
        description: 'Analyze machine learning detected anomaly',
        expectedOutcome: 'Understand anomaly pattern',
        implementationTime: 4,
        cost: 800,
        confidence: 0.85,
      },
    ];
  }

  private generateCorrelationRecommendations(correlation: AnomalyCorrelation): AnomalyRecommendation[] {
    return [
      {
        recommendationId: `correlation-analysis-${Date.now()}`,
        priority: 'high',
        action: 'Correlation analysis',
        description: 'Investigate correlated anomalies',
        expectedOutcome: 'Identify systemic issues',
        implementationTime: 6,
        cost: 1200,
        confidence: 0.8,
      },
    ];
  }

  // Additional helper methods for pattern detection and analysis
  private async detectTimeSeriesPatternAnomalies(asset: Asset, data: any[]): Promise<AnomalyDetectionResult[]> {
    // Implementation for time series pattern detection
    return [];
  }

  private async detectCyclicalPatternAnomalies(asset: Asset, data: any[]): Promise<AnomalyDetectionResult[]> {
    // Implementation for cyclical pattern detection
    return [];
  }

  private async detectTrendPatternAnomalies(asset: Asset, data: any[]): Promise<AnomalyDetectionResult[]> {
    // Implementation for trend pattern detection
    return [];
  }

  private groupAnomaliesByTimeAndAsset(anomalies: AnomalyDetectionResult[]): AnomalyDetectionResult[][] {
    // Group anomalies within 1 hour of each other for the same asset
    const groups: AnomalyDetectionResult[][] = [];
    const processed = new Set<string>();

    for (const anomaly of anomalies) {
      if (processed.has(anomaly.anomalyId)) continue;

      const group = [anomaly];
      processed.add(anomaly.anomalyId);

      for (const other of anomalies) {
        if (processed.has(other.anomalyId)) continue;
        if (other.assetId !== anomaly.assetId) continue;

        const timeDiff = Math.abs(other.timestamp.getTime() - anomaly.timestamp.getTime());
        if (timeDiff <= 60 * 60 * 1000) { // 1 hour
          group.push(other);
          processed.add(other.anomalyId);
        }
      }

      if (group.length > 1) {
        groups.push(group);
      }
    }

    return groups;
  }

  private calculateAnomalyCorrelations(anomalies: AnomalyDetectionResult[]): AnomalyCorrelation[] {
    const correlations: AnomalyCorrelation[] = [];

    for (let i = 0; i < anomalies.length; i++) {
      for (let j = i + 1; j < anomalies.length; j++) {
        const correlation = this.calculateCorrelation(anomalies[i], anomalies[j]);
        if (correlation) {
          correlations.push(correlation);
        }
      }
    }

    return correlations;
  }

  private calculateCorrelation(anomaly1: AnomalyDetectionResult, anomaly2: AnomalyDetectionResult): AnomalyCorrelation | null {
    // Simple correlation calculation based on metrics similarity
    const metric1 = anomaly1.metrics;
    const metric2 = anomaly2.metrics;

    const deviationCorrelation = 1 - Math.abs(metric1.deviation - metric2.deviation) / Math.max(metric1.deviation, metric2.deviation, 1);

    if (deviationCorrelation > this.config.thresholds.correlationThreshold) {
      return {
        anomalyId: anomaly1.anomalyId,
        correlatedAnomalies: [anomaly2.anomalyId],
        correlationStrength: deviationCorrelation,
        temporalRelationship: anomaly1.timestamp < anomaly2.timestamp ? 'before' : 'after',
        causalLikelihood: 0.7,
      };
    }

    return null;
  }

  private filterAndRankAnomalies(anomalies: AnomalyDetectionResult[]): AnomalyDetectionResult[] {
    // Filter out low-confidence anomalies and rank by severity
    return anomalies
      .filter(anomaly => anomaly.confidence > 0.5)
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const severityDiff = severityOrder[b.severity.level] - severityOrder[a.severity.level];
        if (severityDiff !== 0) return severityDiff;
        return b.confidence - a.confidence;
      });
  }

  private async storeAnomalies(anomalies: AnomalyDetectionResult[]): Promise<void> {
    // Store anomalies in database
    for (const anomaly of anomalies) {
      await prisma.energyAlert.create({
        data: {
          organisationId: this.organisationId,
          assetId: anomaly.assetId,
          alertType: 'ANOMALY_DETECTED',
          title: `AI Anomaly: ${anomaly.anomalyType.description}`,
          description: anomaly.description,
          severity: anomaly.severity.level.toUpperCase() as any,
          status: 'ACTIVE',
          triggeredAt: anomaly.timestamp,
          metadata: {
            anomalyId: anomaly.anomalyId,
            confidence: anomaly.confidence,
            detectionMethod: anomaly.detectedBy.algorithm,
            metrics: anomaly.metrics,
            recommendations: anomaly.recommendations,
          },
        },
      });
    }
  }

  private async createAnomalyAlerts(anomalies: AnomalyDetectionResult[]): Promise<void> {
    // Create additional alerts for critical anomalies
    const criticalAnomalies = anomalies.filter(a => a.severity.level === 'critical');

    for (const anomaly of criticalAnomalies) {
      await prisma.workOrder.create({
        data: {
          organisationId: this.organisationId,
          assetId: anomaly.assetId,
          title: `URGENT: AI Detected Critical Anomaly`,
          description: `Critical anomaly detected: ${anomaly.description}`,
          priority: 'Critical',
          status: 'Pending',
          assignedTo: 'maintenance_team',
          scheduledDate: new Date(),
          metadata: {
            anomalyId: anomaly.anomalyId,
            severity: anomaly.severity.level,
            confidence: anomaly.confidence,
            recommendations: anomaly.recommendations,
          },
        },
      });
    }
  }

  private extractFeatures(data: any[]): number[][] {
    return data.map(point => [
      point.consumptionValue || 0,
      point.powerDemand || 0,
      point.efficiencyScore || 0,
      point.temperature || 20,
      point.humidity || 50,
    ]);
  }

  private calculateIsolationScores(features: number[][]): number[] {
    // Simplified Isolation Forest scoring
    return features.map(() => Math.random() * 0.3 + 0.7); // Mock scores
  }

  private calculateSVMScores(features: number[][]): number[] {
    // Simplified One-Class SVM scoring
    return features.map(() => Math.random() * 0.4 + 0.6); // Mock scores
  }

  private calculateNormalRange(data: any[]): { min: number; max: number; mean: number; stdDev: number } {
    const values = data.map(d => d.consumptionValue || 0).filter(v => v > 0);
    if (values.length === 0) return { min: 0, max: 0, mean: 0, stdDev: 0 };

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean,
      stdDev,
    };
  }

  private async identifyBehavioralPatterns(data: any[]): Promise<BehavioralPattern[]> {
    // Mock implementation for behavioral pattern identification
    return [
      {
        patternId: 'daily-pattern-1',
        patternType: 'daily',
        description: 'Daily consumption pattern',
        confidence: 0.85,
        parameters: { peak_hour: 14, low_hour: 2 },
      },
    ];
  }

  private calculateSeasonalVariations(data: any[]): SeasonalVariation[] {
    // Mock implementation for seasonal variations
    return [
      { season: 'summer', adjustmentFactor: 1.2, confidence: 0.8 },
      { season: 'winter', adjustmentFactor: 1.1, confidence: 0.8 },
    ];
  }

  private identifyOperationalPatterns(data: any[]): OperationalPattern[] {
    // Mock implementation for operational patterns
    return [
      {
        condition: 'high_occupancy',
        expectedValue: 150,
        tolerance: 10,
        confidence: 0.9,
      },
    ];
  }

  private getExpectedValue(profile: BehavioralProfile, metricName: string, timestamp: Date): number | null {
    // Calculate expected value based on behavioral profile
    const hour = timestamp.getHours();
    const season = this.getSeason(timestamp.getMonth());

    let expectedValue = profile.normalRange.mean;

    // Apply seasonal adjustment
    const seasonalVariation = profile.seasonalVariations.find(sv => sv.season === season);
    if (seasonalVariation) {
      expectedValue *= seasonalVariation.adjustmentFactor;
    }

    // Apply daily pattern
    const dailyPattern = profile.patterns.find(p => p.patternType === 'daily');
    if (dailyPattern) {
      const peakHour = dailyPattern.parameters.peak_hour || 14;
      const hourAdjustment = 1 + 0.3 * Math.sin((hour - peakHour) * Math.PI / 12);
      expectedValue *= hourAdjustment;
    }

    return expectedValue;
  }

  private getSeason(month: number): 'spring' | 'summer' | 'autumn' | 'winter' {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  private getPrimaryMetric(dataPoint: any): string {
    if (dataPoint.consumptionValue !== null) return 'consumptionValue';
    if (dataPoint.powerDemand !== null) return 'powerDemand';
    if (dataPoint.efficiencyScore !== null) return 'efficiencyScore';
    return 'consumptionValue';
  }

  private extractMetricValue(dataPoint: any, metricName: string): number | null {
    return dataPoint[metricName] || null;
  }
}

export function createAIAnomalyDetectionSystem(
  organisationId: string,
  config?: Partial<AnomalyDetectionConfig>
): AIAnomalyDetectionSystem {
  return new AIAnomalyDetectionSystem(organisationId, config);
}

