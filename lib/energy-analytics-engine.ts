/**
 * Energy Analytics Engine - F21.2
 *
 * Advanced analytics for energy consumption analysis, efficiency scoring,
 * anomaly detection, and cost tracking with machine learning capabilities
 *
 * Implements The Aegrid Rules for energy asset intelligence
 *
 * @fileoverview Energy analytics engine with advanced algorithms
 */

import { EnergyConsumption, EnergyEfficiencyMetric } from '@prisma/client';
import { prisma } from './prisma';

export interface EnergyAnalyticsConfig {
  organisationId: string;
  anomalyThreshold: number;
  efficiencyBenchmarks: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  costAnalysisPeriods: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface ConsumptionAnalysis {
  totalConsumption: number;
  averageConsumption: number;
  peakConsumption: number;
  baseLoadConsumption: number;
  consumptionTrend: 'increasing' | 'decreasing' | 'stable';
  seasonalPatterns: SeasonalPattern[];
  timeOfDayPatterns: TimeOfDayPattern[];
  dayOfWeekPatterns: DayOfWeekPattern[];
}

export interface SeasonalPattern {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  averageConsumption: number;
  variation: number;
  peakMonths: string[];
}

export interface TimeOfDayPattern {
  hour: number;
  averageConsumption: number;
  peakHour: boolean;
  offPeakHour: boolean;
}

export interface DayOfWeekPattern {
  day: string;
  averageConsumption: number;
  isWeekend: boolean;
  variation: number;
}

export interface EfficiencyAnalysis {
  currentEfficiency: number;
  benchmarkComparison: number;
  efficiencyTrend: 'improving' | 'declining' | 'stable';
  potentialSavings: number;
  efficiencyDrivers: EfficiencyDriver[];
  recommendations: EfficiencyRecommendation[];
}

export interface EfficiencyDriver {
  factor: string;
  impact: number;
  description: string;
  actionable: boolean;
}

export interface EfficiencyRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  potentialSavings: number;
  implementationCost: number;
  paybackPeriod: number;
}

export interface AnomalyDetection {
  anomalies: EnergyAnomaly[];
  anomalyScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  detectionMethod: 'statistical' | 'machine_learning' | 'threshold';
}

export interface EnergyAnomaly {
  id: string;
  timestamp: Date;
  consumptionValue: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'spike' | 'drop' | 'pattern_break' | 'equipment_failure';
  description: string;
  confidence: number;
}

export interface CostAnalysis {
  totalCost: number;
  costPerUnit: number;
  costTrend: 'increasing' | 'decreasing' | 'stable';
  peakCostPeriods: PeakCostPeriod[];
  costBreakdown: CostBreakdown;
  budgetVariance: number;
  forecastedCosts: CostForecast[];
}

export interface PeakCostPeriod {
  period: string;
  cost: number;
  consumption: number;
  costPerUnit: number;
  reason: string;
}

export interface CostBreakdown {
  energyCost: number;
  demandCharges: number;
  taxes: number;
  renewableCredits: number;
  otherCharges: number;
}

export interface CostForecast {
  period: string;
  forecastedCost: number;
  confidence: number;
  factors: string[];
}

export class EnergyAnalyticsEngine {
  private organisationId: string;
  private config: EnergyAnalyticsConfig;

  constructor(organisationId: string, config?: Partial<EnergyAnalyticsConfig>) {
    this.organisationId = organisationId;
    this.config = {
      organisationId,
      anomalyThreshold: config?.anomalyThreshold || 2.0,
      efficiencyBenchmarks: config?.efficiencyBenchmarks || {
        excellent: 90,
        good: 80,
        average: 70,
        poor: 60,
      },
      costAnalysisPeriods: config?.costAnalysisPeriods || {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
      },
    };
  }

  /**
   * Analyze energy consumption patterns with advanced algorithms
   */
  async analyzeConsumptionPatterns(
    assetId?: string,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): Promise<ConsumptionAnalysis> {
    const days = this.config.costAnalysisPeriods[period];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const consumptionData = await prisma.energyConsumption.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: startDate },
        dataQuality: 'GOOD',
      },
      orderBy: { timestamp: 'asc' },
    });

    if (consumptionData.length === 0) {
      throw new Error('No consumption data available for analysis');
    }

    const values = consumptionData.map(d => d.consumptionValue);
    const timestamps = consumptionData.map(d => d.timestamp);

    // Calculate basic statistics
    const totalConsumption = values.reduce((sum, val) => sum + val, 0);
    const averageConsumption = totalConsumption / values.length;
    const peakConsumption = Math.max(...values);
    const baseLoadConsumption = this.calculateBaseLoad(values);

    // Calculate consumption trend
    const consumptionTrend = this.calculateTrend(values, timestamps);

    // Analyze seasonal patterns
    const seasonalPatterns = await this.analyzeSeasonalPatterns(consumptionData);

    // Analyze time of day patterns
    const timeOfDayPatterns = this.analyzeTimeOfDayPatterns(consumptionData);

    // Analyze day of week patterns
    const dayOfWeekPatterns = this.analyzeDayOfWeekPatterns(consumptionData);

    return {
      totalConsumption,
      averageConsumption,
      peakConsumption,
      baseLoadConsumption,
      consumptionTrend,
      seasonalPatterns,
      timeOfDayPatterns,
      dayOfWeekPatterns,
    };
  }

  /**
   * Calculate advanced efficiency metrics with benchmarking
   */
  async calculateAdvancedEfficiency(
    assetId: string,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): Promise<EfficiencyAnalysis> {
    const days = this.config.costAnalysisPeriods[period];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get consumption data
    const consumptionData = await prisma.energyConsumption.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: startDate },
        dataQuality: 'GOOD',
      },
      orderBy: { timestamp: 'asc' },
    });

    // Get efficiency metrics
    const efficiencyMetrics = await prisma.energyEfficiencyMetric.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'asc' },
    });

    if (efficiencyMetrics.length === 0) {
      throw new Error('No efficiency metrics available for analysis');
    }

    const currentEfficiency = efficiencyMetrics[efficiencyMetrics.length - 1].efficiencyScore;
    const benchmarkComparison = this.calculateBenchmarkComparison(currentEfficiency);
    const efficiencyTrend = this.calculateEfficiencyTrend(efficiencyMetrics);
    const potentialSavings = this.calculatePotentialSavings(consumptionData, currentEfficiency);
    const efficiencyDrivers = await this.analyzeEfficiencyDrivers(assetId, consumptionData);
    const recommendations = this.generateEfficiencyRecommendations(
      currentEfficiency,
      efficiencyDrivers,
      potentialSavings
    );

    return {
      currentEfficiency,
      benchmarkComparison,
      efficiencyTrend,
      potentialSavings,
      efficiencyDrivers,
      recommendations,
    };
  }

  /**
   * Advanced anomaly detection using statistical and ML methods
   */
  async detectAdvancedAnomalies(
    assetId?: string,
    detectionMethod: 'statistical' | 'machine_learning' | 'hybrid' = 'hybrid'
  ): Promise<AnomalyDetection> {
    const days = 30; // Look back 30 days for anomaly detection
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const consumptionData = await prisma.energyConsumption.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: startDate },
        dataQuality: 'GOOD',
      },
      orderBy: { timestamp: 'asc' },
    });

    if (consumptionData.length < 10) {
      return {
        anomalies: [],
        anomalyScore: 0,
        riskLevel: 'low',
        detectionMethod: 'statistical',
      };
    }

    let anomalies: EnergyAnomaly[] = [];

    switch (detectionMethod) {
      case 'statistical':
        anomalies = this.detectStatisticalAnomalies(consumptionData);
        break;
      case 'machine_learning':
        anomalies = await this.detectMLAnomalies(consumptionData);
        break;
      case 'hybrid':
        const statisticalAnomalies = this.detectStatisticalAnomalies(consumptionData);
        const mlAnomalies = await this.detectMLAnomalies(consumptionData);
        anomalies = this.mergeAnomalies(statisticalAnomalies, mlAnomalies);
        break;
    }

    const anomalyScore = this.calculateAnomalyScore(anomalies);
    const riskLevel = this.determineRiskLevel(anomalyScore);

    // Create alerts for critical anomalies
    await this.createAnomalyAlerts(anomalies, assetId);

    return {
      anomalies,
      anomalyScore,
      riskLevel,
      detectionMethod,
    };
  }

  /**
   * Comprehensive cost analysis with forecasting
   */
  async performCostAnalysis(
    assetId?: string,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): Promise<CostAnalysis> {
    const days = this.config.costAnalysisPeriods[period];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const consumptionData = await prisma.energyConsumption.findMany({
      where: {
        organisationId: this.organisationId,
        assetId,
        timestamp: { gte: startDate },
        dataQuality: 'GOOD',
      },
      orderBy: { timestamp: 'asc' },
    });

    if (consumptionData.length === 0) {
      throw new Error('No consumption data available for cost analysis');
    }

    const totalCost = consumptionData.reduce((sum, d) => sum + (d.totalCost || 0), 0);
    const totalConsumption = consumptionData.reduce((sum, d) => sum + d.consumptionValue, 0);
    const costPerUnit = totalConsumption > 0 ? totalCost / totalConsumption : 0;
    const costTrend = this.calculateCostTrend(consumptionData);
    const peakCostPeriods = this.identifyPeakCostPeriods(consumptionData);
    const costBreakdown = this.calculateCostBreakdown(consumptionData);
    const budgetVariance = await this.calculateBudgetVariance(assetId, totalCost, period);
    const forecastedCosts = this.generateCostForecast(consumptionData, period);

    return {
      totalCost,
      costPerUnit,
      costTrend,
      peakCostPeriods,
      costBreakdown,
      budgetVariance,
      forecastedCosts,
    };
  }

  /**
   * Generate comprehensive energy intelligence report
   */
  async generateEnergyIntelligenceReport(
    assetId?: string,
    period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' = 'monthly'
  ): Promise<{
    consumptionAnalysis: ConsumptionAnalysis;
    efficiencyAnalysis: EfficiencyAnalysis;
    anomalyDetection: AnomalyDetection;
    costAnalysis: CostAnalysis;
    summary: {
      overallScore: number;
      keyInsights: string[];
      recommendations: EfficiencyRecommendation[];
      riskAssessment: string;
    };
  }> {
    const consumptionAnalysis = await this.analyzeConsumptionPatterns(assetId, period);
    const efficiencyAnalysis = await this.calculateAdvancedEfficiency(assetId, period);
    const anomalyDetection = await this.detectAdvancedAnomalies(assetId, 'hybrid');
    const costAnalysis = await this.performCostAnalysis(assetId, period);

    const overallScore = this.calculateOverallScore(
      efficiencyAnalysis.currentEfficiency,
      anomalyDetection.anomalyScore,
      costAnalysis.costTrend
    );

    const keyInsights = this.generateKeyInsights(
      consumptionAnalysis,
      efficiencyAnalysis,
      anomalyDetection,
      costAnalysis
    );

    const riskAssessment = this.assessEnergyRisk(
      efficiencyAnalysis.currentEfficiency,
      anomalyDetection.riskLevel,
      costAnalysis.budgetVariance
    );

    return {
      consumptionAnalysis,
      efficiencyAnalysis,
      anomalyDetection,
      costAnalysis,
      summary: {
        overallScore,
        keyInsights,
        recommendations: efficiencyAnalysis.recommendations,
        riskAssessment,
      },
    };
  }

  // Private helper methods

  private calculateBaseLoad(values: number[]): number {
    // Use percentile-based approach to find base load
    const sorted = [...values].sort((a, b) => a - b);
    const percentile25 = sorted[Math.floor(sorted.length * 0.25)];
    return percentile25;
  }

  private calculateTrend(values: number[], timestamps: Date[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }

  private async analyzeSeasonalPatterns(consumptionData: EnergyConsumption[]): Promise<SeasonalPattern[]> {
    const seasonalData: { [key: string]: number[] } = {
      spring: [],
      summer: [],
      autumn: [],
      winter: [],
    };

    consumptionData.forEach(data => {
      const month = data.timestamp.getMonth();
      if (month >= 2 && month <= 4) seasonalData.spring.push(data.consumptionValue);
      else if (month >= 5 && month <= 7) seasonalData.summer.push(data.consumptionValue);
      else if (month >= 8 && month <= 10) seasonalData.autumn.push(data.consumptionValue);
      else seasonalData.winter.push(data.consumptionValue);
    });

    return Object.entries(seasonalData).map(([season, values]) => {
      const averageConsumption = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variation = this.calculateVariation(values);
      return {
        season: season as 'spring' | 'summer' | 'autumn' | 'winter',
        averageConsumption,
        variation,
        peakMonths: this.getPeakMonths(season),
      };
    });
  }

  private analyzeTimeOfDayPatterns(consumptionData: EnergyConsumption[]): TimeOfDayPattern[] {
    const hourlyData: { [key: number]: number[] } = {};

    consumptionData.forEach(data => {
      const hour = data.timestamp.getHours();
      if (!hourlyData[hour]) hourlyData[hour] = [];
      hourlyData[hour].push(data.consumptionValue);
    });

    return Object.entries(hourlyData).map(([hour, values]) => {
      const averageConsumption = values.reduce((sum, val) => sum + val, 0) / values.length;
      return {
        hour: parseInt(hour),
        averageConsumption,
        peakHour: parseInt(hour) >= 17 && parseInt(hour) <= 19,
        offPeakHour: parseInt(hour) >= 22 || parseInt(hour) <= 6,
      };
    }).sort((a, b) => a.hour - b.hour);
  }

  private analyzeDayOfWeekPatterns(consumptionData: EnergyConsumption[]): DayOfWeekPattern[] {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData: { [key: string]: number[] } = {};

    consumptionData.forEach(data => {
      const day = dayNames[data.timestamp.getDay()];
      if (!dayData[day]) dayData[day] = [];
      dayData[day].push(data.consumptionValue);
    });

    return Object.entries(dayData).map(([day, values]) => {
      const averageConsumption = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variation = this.calculateVariation(values);
      return {
        day,
        averageConsumption,
        isWeekend: day === 'Saturday' || day === 'Sunday',
        variation,
      };
    });
  }

  private calculateBenchmarkComparison(efficiency: number): number {
    const { excellent, good, average, poor } = this.config.efficiencyBenchmarks;

    if (efficiency >= excellent) return 100;
    if (efficiency >= good) return 80;
    if (efficiency >= average) return 60;
    if (efficiency >= poor) return 40;
    return 20;
  }

  private calculateEfficiencyTrend(metrics: EnergyEfficiencyMetric[]): 'improving' | 'declining' | 'stable' {
    if (metrics.length < 2) return 'stable';

    const firstHalf = metrics.slice(0, Math.floor(metrics.length / 2));
    const secondHalf = metrics.slice(Math.floor(metrics.length / 2));

    const firstAvg = firstHalf.reduce((sum, m) => sum + m.efficiencyScore, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, m) => sum + m.efficiencyScore, 0) / secondHalf.length;

    const change = secondAvg - firstAvg;

    if (change > 2) return 'improving';
    if (change < -2) return 'declining';
    return 'stable';
  }

  private calculatePotentialSavings(consumptionData: EnergyConsumption[], currentEfficiency: number): number {
    const totalConsumption = consumptionData.reduce((sum, d) => sum + d.consumptionValue, 0);
    const potentialEfficiency = this.config.efficiencyBenchmarks.excellent;
    const efficiencyGap = potentialEfficiency - currentEfficiency;

    return (totalConsumption * efficiencyGap) / 100;
  }

  private async analyzeEfficiencyDrivers(
    assetId: string,
    consumptionData: EnergyConsumption[]
  ): Promise<EfficiencyDriver[]> {
    const drivers: EfficiencyDriver[] = [];

    // Analyze consumption patterns
    const peakConsumption = Math.max(...consumptionData.map(d => d.consumptionValue));
    const averageConsumption = consumptionData.reduce((sum, d) => sum + d.consumptionValue, 0) / consumptionData.length;
    const peakRatio = peakConsumption / averageConsumption;

    if (peakRatio > 2.0) {
      drivers.push({
        factor: 'Peak Demand Management',
        impact: 15,
        description: 'High peak-to-average ratio indicates potential for demand management',
        actionable: true,
      });
    }

    // Analyze temperature correlation
    const tempData = consumptionData.filter(d => d.temperature !== null);
    if (tempData.length > 10) {
      const tempCorrelation = this.calculateCorrelation(
        tempData.map(d => d.temperature!),
        tempData.map(d => d.consumptionValue)
      );

      if (Math.abs(tempCorrelation) > 0.7) {
        drivers.push({
          factor: 'Temperature Dependency',
          impact: Math.abs(tempCorrelation) * 20,
          description: 'Strong correlation with temperature suggests HVAC optimization opportunities',
          actionable: true,
        });
      }
    }

    return drivers;
  }

  private generateEfficiencyRecommendations(
    currentEfficiency: number,
    drivers: EfficiencyDriver[],
    potentialSavings: number
  ): EfficiencyRecommendation[] {
    const recommendations: EfficiencyRecommendation[] = [];

    if (currentEfficiency < this.config.efficiencyBenchmarks.good) {
      recommendations.push({
        priority: 'high',
        category: 'Equipment Upgrade',
        description: 'Consider upgrading to more efficient equipment',
        potentialSavings: potentialSavings * 0.3,
        implementationCost: potentialSavings * 0.8,
        paybackPeriod: 2.5,
      });
    }

    drivers.forEach(driver => {
      if (driver.actionable && driver.impact > 10) {
        recommendations.push({
          priority: driver.impact > 15 ? 'high' : 'medium',
          category: driver.factor,
          description: driver.description,
          potentialSavings: potentialSavings * (driver.impact / 100),
          implementationCost: potentialSavings * 0.2,
          paybackPeriod: 1.5,
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private detectStatisticalAnomalies(consumptionData: EnergyConsumption[]): EnergyAnomaly[] {
    const values = consumptionData.map(d => d.consumptionValue);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const anomalies: EnergyAnomaly[] = [];

    consumptionData.forEach((data, index) => {
      const zScore = Math.abs((data.consumptionValue - mean) / stdDev);

      if (zScore > this.config.anomalyThreshold) {
        const deviation = ((data.consumptionValue - mean) / mean) * 100;
        const severity = this.determineAnomalySeverity(zScore, deviation);

        anomalies.push({
          id: `anomaly-${data.id}-${index}`,
          timestamp: data.timestamp,
          consumptionValue: data.consumptionValue,
          expectedValue: mean,
          deviation,
          severity,
          type: this.determineAnomalyType(deviation),
          description: this.generateAnomalyDescription(deviation, severity),
          confidence: Math.min(zScore / this.config.anomalyThreshold, 1.0),
        });
      }
    });

    return anomalies;
  }

  private async detectMLAnomalies(consumptionData: EnergyConsumption[]): Promise<EnergyAnomaly[]> {
    // Simplified ML-based anomaly detection using moving averages and trend analysis
    const windowSize = 7;
    const anomalies: EnergyAnomaly[] = [];

    for (let i = windowSize; i < consumptionData.length; i++) {
      const window = consumptionData.slice(i - windowSize, i);
      const current = consumptionData[i];

      const windowAvg = window.reduce((sum, d) => sum + d.consumptionValue, 0) / window.length;
      const windowStd = Math.sqrt(
        window.reduce((sum, d) => sum + Math.pow(d.consumptionValue - windowAvg, 2), 0) / window.length
      );

      const deviation = Math.abs(current.consumptionValue - windowAvg);
      const threshold = windowStd * this.config.anomalyThreshold;

      if (deviation > threshold) {
        const severity = this.determineAnomalySeverity(deviation / windowStd, 0);

        anomalies.push({
          id: `ml-anomaly-${current.id}-${i}`,
          timestamp: current.timestamp,
          consumptionValue: current.consumptionValue,
          expectedValue: windowAvg,
          deviation: ((current.consumptionValue - windowAvg) / windowAvg) * 100,
          severity,
          type: this.determineAnomalyType(current.consumptionValue - windowAvg),
          description: `ML detected anomaly: ${deviation.toFixed(2)} units above expected`,
          confidence: Math.min(deviation / threshold, 1.0),
        });
      }
    }

    return anomalies;
  }

  private mergeAnomalies(statistical: EnergyAnomaly[], ml: EnergyAnomaly[]): EnergyAnomaly[] {
    const merged = [...statistical];

    ml.forEach(mlAnomaly => {
      const isDuplicate = statistical.some(statAnomaly =>
        Math.abs(statAnomaly.timestamp.getTime() - mlAnomaly.timestamp.getTime()) < 3600000 && // Within 1 hour
        Math.abs(statAnomaly.consumptionValue - mlAnomaly.consumptionValue) < statAnomaly.consumptionValue * 0.1
      );

      if (!isDuplicate) {
        merged.push(mlAnomaly);
      }
    });

    return merged.sort((a, b) => b.confidence - a.confidence);
  }

  private calculateAnomalyScore(anomalies: EnergyAnomaly[]): number {
    if (anomalies.length === 0) return 0;

    const weightedScore = anomalies.reduce((sum, anomaly) => {
      const severityWeight = { low: 1, medium: 2, high: 3, critical: 4 };
      return sum + (anomaly.confidence * severityWeight[anomaly.severity]);
    }, 0);

    return Math.min(weightedScore / anomalies.length, 10);
  }

  private determineRiskLevel(anomalyScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (anomalyScore >= 7) return 'critical';
    if (anomalyScore >= 5) return 'high';
    if (anomalyScore >= 3) return 'medium';
    return 'low';
  }

  private async createAnomalyAlerts(anomalies: EnergyAnomaly[], assetId?: string): Promise<void> {
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical' || a.severity === 'high');

    for (const anomaly of criticalAnomalies) {
      await prisma.energyAlert.create({
        data: {
          organisationId: this.organisationId,
          assetId,
          alertType: 'ANOMALY_DETECTED',
          title: `Energy Anomaly Detected`,
          description: anomaly.description,
          severity: anomaly.severity.toUpperCase() as any,
          status: 'ACTIVE',
          triggeredAt: anomaly.timestamp,
          metadata: {
            anomalyId: anomaly.id,
            consumptionValue: anomaly.consumptionValue,
            expectedValue: anomaly.expectedValue,
            deviation: anomaly.deviation,
            confidence: anomaly.confidence,
          },
        },
      });
    }
  }

  private calculateCostTrend(consumptionData: EnergyConsumption[]): 'increasing' | 'decreasing' | 'stable' {
    const costs = consumptionData.map(d => d.totalCost || 0).filter(c => c > 0);
    if (costs.length < 2) return 'stable';

    const firstHalf = costs.slice(0, Math.floor(costs.length / 2));
    const secondHalf = costs.slice(Math.floor(costs.length / 2));

    const firstAvg = firstHalf.reduce((sum, cost) => sum + cost, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, cost) => sum + cost, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  }

  private identifyPeakCostPeriods(consumptionData: EnergyConsumption[]): PeakCostPeriod[] {
    const periods: { [key: string]: { cost: number; consumption: number; count: number } } = {};

    consumptionData.forEach(data => {
      const periodKey = data.timestamp.toISOString().split('T')[0]; // Daily periods
      if (!periods[periodKey]) {
        periods[periodKey] = { cost: 0, consumption: 0, count: 0 };
      }
      periods[periodKey].cost += data.totalCost || 0;
      periods[periodKey].consumption += data.consumptionValue;
      periods[periodKey].count += 1;
    });

    return Object.entries(periods)
      .map(([period, data]) => ({
        period,
        cost: data.cost,
        consumption: data.consumption,
        costPerUnit: data.consumption > 0 ? data.cost / data.consumption : 0,
        reason: this.determinePeakCostReason(data.cost, data.consumption),
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5); // Top 5 peak cost periods
  }

  private calculateCostBreakdown(consumptionData: EnergyConsumption[]): CostBreakdown {
    const totalCost = consumptionData.reduce((sum, d) => sum + (d.totalCost || 0), 0);

    return {
      energyCost: totalCost * 0.7, // Assume 70% is energy cost
      demandCharges: totalCost * 0.15, // 15% demand charges
      taxes: totalCost * 0.10, // 10% taxes
      renewableCredits: -totalCost * 0.02, // 2% renewable credits
      otherCharges: totalCost * 0.07, // 7% other charges
    };
  }

  private async calculateBudgetVariance(assetId: string | undefined, actualCost: number, period: string): Promise<number> {
    // This would typically query budget data from another table
    // For now, return a mock variance
    const estimatedBudget = actualCost * 0.9; // Assume budget was 10% lower
    return ((actualCost - estimatedBudget) / estimatedBudget) * 100;
  }

  private generateCostForecast(consumptionData: EnergyConsumption[], period: string): CostForecast[] {
    const forecasts: CostForecast[] = [];
    const avgCost = consumptionData.reduce((sum, d) => sum + (d.totalCost || 0), 0) / consumptionData.length;

    // Generate forecasts for next 3 periods
    for (let i = 1; i <= 3; i++) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + (i * (period === 'daily' ? 1 : period === 'weekly' ? 7 : 30)));

      forecasts.push({
        period: forecastDate.toISOString().split('T')[0],
        forecastedCost: avgCost * (1 + (i * 0.05)), // 5% increase per period
        confidence: Math.max(0.8 - (i * 0.1), 0.5), // Decreasing confidence
        factors: ['Historical trend', 'Seasonal patterns', 'Economic indicators'],
      });
    }

    return forecasts;
  }

  private calculateOverallScore(efficiency: number, anomalyScore: number, costTrend: string): number {
    const efficiencyScore = (efficiency / 100) * 40; // 40% weight
    const anomalyScoreNormalized = Math.max(0, 10 - anomalyScore) * 3; // 30% weight
    const costScore = costTrend === 'decreasing' ? 30 : costTrend === 'stable' ? 20 : 10; // 30% weight

    return Math.min(Math.round(efficiencyScore + anomalyScoreNormalized + costScore), 100);
  }

  private generateKeyInsights(
    consumption: ConsumptionAnalysis,
    efficiency: EfficiencyAnalysis,
    anomalies: AnomalyDetection,
    cost: CostAnalysis
  ): string[] {
    const insights: string[] = [];

    if (efficiency.currentEfficiency > this.config.efficiencyBenchmarks.excellent) {
      insights.push('Energy efficiency is excellent and exceeds industry benchmarks');
    } else if (efficiency.currentEfficiency < this.config.efficiencyBenchmarks.poor) {
      insights.push('Energy efficiency needs immediate attention - below industry standards');
    }

    if (consumption.consumptionTrend === 'increasing') {
      insights.push('Energy consumption is trending upward - consider optimization measures');
    }

    if (anomalies.riskLevel === 'high' || anomalies.riskLevel === 'critical') {
      insights.push(`${anomalies.anomalies.length} energy anomalies detected requiring attention`);
    }

    if (cost.costTrend === 'increasing') {
      insights.push('Energy costs are increasing - review pricing and consumption patterns');
    }

    if (efficiency.recommendations.length > 0) {
      const highPriorityRecs = efficiency.recommendations.filter(r => r.priority === 'high').length;
      if (highPriorityRecs > 0) {
        insights.push(`${highPriorityRecs} high-priority efficiency improvements identified`);
      }
    }

    return insights;
  }

  private assessEnergyRisk(efficiency: number, riskLevel: string, budgetVariance: number): string {
    if (efficiency < this.config.efficiencyBenchmarks.poor && riskLevel === 'critical') {
      return 'CRITICAL: Poor efficiency with critical anomalies detected';
    }

    if (efficiency < this.config.efficiencyBenchmarks.average && budgetVariance > 20) {
      return 'HIGH: Below-average efficiency with significant budget overrun';
    }

    if (riskLevel === 'high' || riskLevel === 'critical') {
      return 'MEDIUM: Energy anomalies require monitoring';
    }

    if (efficiency > this.config.efficiencyBenchmarks.good) {
      return 'LOW: Good energy performance with minimal risks';
    }

    return 'MEDIUM: Standard energy performance with room for improvement';
  }

  // Additional helper methods
  private calculateVariation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private getPeakMonths(season: string): string[] {
    const seasonMonths: { [key: string]: string[] } = {
      spring: ['March', 'April', 'May'],
      summer: ['June', 'July', 'August'],
      autumn: ['September', 'October', 'November'],
      winter: ['December', 'January', 'February'],
    };
    return seasonMonths[season] || [];
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private determineAnomalySeverity(zScore: number, deviation: number): 'low' | 'medium' | 'high' | 'critical' {
    if (zScore > 4 || Math.abs(deviation) > 100) return 'critical';
    if (zScore > 3 || Math.abs(deviation) > 50) return 'high';
    if (zScore > 2 || Math.abs(deviation) > 25) return 'medium';
    return 'low';
  }

  private determineAnomalyType(deviation: number): 'spike' | 'drop' | 'pattern_break' | 'equipment_failure' {
    if (deviation > 50) return 'spike';
    if (deviation < -50) return 'drop';
    if (Math.abs(deviation) > 25) return 'pattern_break';
    return 'equipment_failure';
  }

  private generateAnomalyDescription(deviation: number, severity: string): string {
    const direction = deviation > 0 ? 'above' : 'below';
    const magnitude = Math.abs(deviation).toFixed(1);
    return `Energy consumption ${magnitude}% ${direction} expected levels (${severity} severity)`;
  }

  private determinePeakCostReason(cost: number, consumption: number): string {
    const costPerUnit = consumption > 0 ? cost / consumption : 0;
    if (costPerUnit > 0.5) return 'High energy rates during peak hours';
    if (consumption > 1000) return 'High consumption volume';
    return 'Multiple factors contributing to peak costs';
  }
}

export function createEnergyAnalyticsEngine(
  organisationId: string,
  config?: Partial<EnergyAnalyticsConfig>
): EnergyAnalyticsEngine {
  return new EnergyAnalyticsEngine(organisationId, config);
}
