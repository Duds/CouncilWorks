/**
 * Resilience Metrics & Monitoring System
 *
 * Comprehensive monitoring and metrics system for the Resilience Engine
 * Provides real-time monitoring, performance metrics, and resilience indicators
 * aligned with The Aegrid Rules and ISO standards
 *
 * @file lib/resilience-metrics-monitoring.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { EventEmitter } from 'events';
import {
  Signal,
  SignalType,
  SignalSeverity,
  ResilienceMode,
  MarginType,
  MarginAllocation,
  MarginDeployment,
  AntifragilePattern,
  StressAdaptationType,
  AdaptiveResponseResult,
  ResilienceState,
  ResilienceEvent,
  ResilienceEventType,
  ComponentHealth,
  HealthStatus
} from './resilience-types';

/**
 * Resilience Metrics
 */
export interface ResilienceMetrics {
  /** Overall resilience score (0-100) */
  overallScore: number;
  
  /** Resilience level by component */
  componentScores: {
    signalProcessing: number;
    antifragileSystem: number;
    adaptiveAlgorithms: number;
    marginManagement: number;
    responseTime: number;
    errorHandling: number;
  };
  
  /** Performance metrics */
  performance: {
    averageResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    throughput: number; // signals per second
    errorRate: number;
    availability: number;
  };
  
  /** Margin metrics */
  margins: {
    totalMargin: number;
    utilizedMargin: number;
    availableMargin: number;
    utilizationRate: number;
    efficiency: number;
    deployments: number;
    activeDeployments: number;
  };
  
  /** Antifragile metrics */
  antifragile: {
    score: number;
    activePatterns: number;
    adaptationsExecuted: number;
    stressEvents: number;
    learningRate: number;
    improvementRate: number;
  };
  
  /** Adaptive response metrics */
  adaptive: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    responseTime: number;
    learningEvents: number;
    modelUpdates: number;
  };
  
  /** Signal processing metrics */
  signals: {
    totalProcessed: number;
    processedPerSecond: number;
    averageProcessingTime: number;
    errorRate: number;
    severityDistribution: {
      [SignalSeverity.LOW]: number;
      [SignalSeverity.MEDIUM]: number;
      [SignalSeverity.HIGH]: number;
      [SignalSeverity.CRITICAL]: number;
    };
  };
  
  /** System health metrics */
  health: {
    status: HealthStatus;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
  
  /** Timestamp */
  timestamp: Date;
}

/**
 * Monitoring Configuration
 */
export interface MonitoringConfig {
  /** Enable monitoring */
  enabled: boolean;
  
  /** Metrics collection interval in milliseconds */
  collectionInterval: number;
  
  /** Metrics retention period in days */
  retentionPeriod: number;
  
  /** Alert thresholds */
  thresholds: {
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
    resilienceLevel: number;
  };
  
  /** Monitoring components */
  components: {
    performance: boolean;
    margins: boolean;
    antifragile: boolean;
    adaptive: boolean;
    signals: boolean;
    health: boolean;
  };
  
  /** Alert settings */
  alerts: {
    enabled: boolean;
    channels: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

/**
 * Monitoring Alert
 */
export interface MonitoringAlert {
  /** Alert identifier */
  id: string;
  
  /** Alert timestamp */
  timestamp: Date;
  
  /** Alert severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Alert type */
  type: 'performance' | 'resilience' | 'health' | 'margin' | 'antifragile' | 'adaptive';
  
  /** Alert message */
  message: string;
  
  /** Alert context */
  context: Record<string, any>;
  
  /** Alert status */
  status: 'active' | 'acknowledged' | 'resolved';
  
  /** Resolution timestamp */
  resolvedAt?: Date;
}

/**
 * Resilience Metrics & Monitoring System Class
 *
 * Provides comprehensive monitoring and metrics for the resilience engine:
 * - Real-time performance monitoring
 * - Resilience level tracking
 * - Margin utilization monitoring
 * - Antifragile system metrics
 * - Adaptive response monitoring
 * - Signal processing analytics
 * - System health monitoring
 * - Alert generation and management
 */
export class ResilienceMetricsMonitoring extends EventEmitter {
  private config: MonitoringConfig;
  private metrics: ResilienceMetrics[] = [];
  private alerts: MonitoringAlert[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;
  private startTime: Date = new Date();
  private signalCounts: Map<SignalType, number> = new Map();
  private severityCounts: Map<SignalSeverity, number> = new Map();
  private responseTimes: number[] = [];
  private errorCount: number = 0;
  private totalSignals: number = 0;

  constructor(config: MonitoringConfig) {
    super();
    this.config = config;
    this.initializeCounters();
  }

  /**
   * Initialize monitoring counters
   */
  private initializeCounters(): void {
    // Initialize signal type counters
    Object.values(SignalType).forEach(type => {
      this.signalCounts.set(type, 0);
    });

    // Initialize severity counters
    Object.values(SignalSeverity).forEach(severity => {
      this.severityCounts.set(severity, 0);
    });
  }

  /**
   * Start monitoring
   */
  public startMonitoring(): void {
    if (this.isMonitoring) {
      console.log('⚠️ Monitoring already started');
      return;
    }

    if (!this.config.enabled) {
      console.log('⚠️ Monitoring disabled in configuration');
      return;
    }

    console.log('📊 Starting resilience metrics monitoring...');
    
    this.isMonitoring = true;
    this.startTime = new Date();

    // Start metrics collection
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.collectionInterval);

    console.log('✅ Resilience metrics monitoring started');
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.log('⚠️ Monitoring not started');
      return;
    }

    console.log('📊 Stopping resilience metrics monitoring...');
    
    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    console.log('✅ Resilience metrics monitoring stopped');
  }

  /**
   * Collect metrics from all components
   */
  private collectMetrics(): void {
    try {
      const metrics: ResilienceMetrics = {
        overallScore: this.calculateOverallScore(),
        componentScores: this.calculateComponentScores(),
        performance: this.calculatePerformanceMetrics(),
        margins: this.calculateMarginMetrics(),
        antifragile: this.calculateAntifragileMetrics(),
        adaptive: this.calculateAdaptiveMetrics(),
        signals: this.calculateSignalMetrics(),
        health: this.calculateHealthMetrics(),
        timestamp: new Date()
      };

      this.metrics.push(metrics);
      this.cleanupOldMetrics();

      // Check for alerts
      this.checkForAlerts(metrics);

      // Emit metrics event
      this.emit('metrics', metrics);

    } catch (error) {
      console.error('❌ Error collecting metrics:', error);
      this.errorCount++;
    }
  }

  /**
   * Calculate overall resilience score
   */
  private calculateOverallScore(): number {
    const componentScores = this.calculateComponentScores();
    const weights = {
      signalProcessing: 0.2,
      antifragileSystem: 0.25,
      adaptiveAlgorithms: 0.2,
      marginManagement: 0.15,
      responseTime: 0.1,
      errorHandling: 0.1
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [component, score] of Object.entries(componentScores)) {
      const weight = weights[component as keyof typeof weights] || 0;
      weightedSum += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  /**
   * Calculate component scores
   */
  private calculateComponentScores(): ResilienceMetrics['componentScores'] {
    const performance = this.calculatePerformanceMetrics();
    const margins = this.calculateMarginMetrics();
    const antifragile = this.calculateAntifragileMetrics();
    const adaptive = this.calculateAdaptiveMetrics();

    return {
      signalProcessing: this.calculateSignalProcessingScore(),
      antifragileSystem: antifragile.score,
      adaptiveAlgorithms: adaptive.accuracy * 100,
      marginManagement: margins.efficiency * 100,
      responseTime: Math.max(0, 100 - (performance.averageResponseTime / 10)),
      errorHandling: Math.max(0, 100 - (performance.errorRate * 1000))
    };
  }

  /**
   * Calculate signal processing score
   */
  private calculateSignalProcessingScore(): number {
    if (this.totalSignals === 0) return 100;

    const errorRate = this.errorCount / this.totalSignals;
    const processingEfficiency = Math.max(0, 100 - (errorRate * 100));
    
    return Math.round(processingEfficiency);
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformanceMetrics(): ResilienceMetrics['performance'] {
    const uptime = Date.now() - this.startTime.getTime();
    const averageResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
      : 0;

    const maxResponseTime = this.responseTimes.length > 0
      ? Math.max(...this.responseTimes)
      : 0;

    const minResponseTime = this.responseTimes.length > 0
      ? Math.min(...this.responseTimes)
      : 0;

    const throughput = this.totalSignals / (uptime / 1000);
    const errorRate = this.totalSignals > 0 ? this.errorCount / this.totalSignals : 0;
    const availability = Math.max(0, 100 - (errorRate * 100));

    return {
      averageResponseTime,
      maxResponseTime,
      minResponseTime,
      throughput,
      errorRate,
      availability
    };
  }

  /**
   * Calculate margin metrics
   */
  private calculateMarginMetrics(): ResilienceMetrics['margins'] {
    // This would typically get data from the margin management system
    // For now, we'll simulate some metrics
    const totalMargin = 1000;
    const utilizedMargin = 200;
    const availableMargin = totalMargin - utilizedMargin;
    const utilizationRate = utilizedMargin / totalMargin;
    const efficiency = 0.8; // Simulated efficiency
    const deployments = 5; // Simulated deployments
    const activeDeployments = 2; // Simulated active deployments

    return {
      totalMargin,
      utilizedMargin,
      availableMargin,
      utilizationRate,
      efficiency,
      deployments,
      activeDeployments
    };
  }

  /**
   * Calculate antifragile metrics
   */
  private calculateAntifragileMetrics(): ResilienceMetrics['antifragile'] {
    // This would typically get data from the antifragile system
    // For now, we'll simulate some metrics
    const score = 75; // Simulated antifragile score
    const activePatterns = 3; // Simulated active patterns
    const adaptationsExecuted = 12; // Simulated adaptations
    const stressEvents = 8; // Simulated stress events
    const learningRate = 0.1; // Simulated learning rate
    const improvementRate = 0.15; // Simulated improvement rate

    return {
      score,
      activePatterns,
      adaptationsExecuted,
      stressEvents,
      learningRate,
      improvementRate
    };
  }

  /**
   * Calculate adaptive metrics
   */
  private calculateAdaptiveMetrics(): ResilienceMetrics['adaptive'] {
    // This would typically get data from the adaptive response system
    // For now, we'll simulate some metrics
    const accuracy = 0.85; // Simulated accuracy
    const precision = 0.82; // Simulated precision
    const recall = 0.88; // Simulated recall
    const f1Score = 0.85; // Simulated F1 score
    const responseTime = 150; // Simulated response time
    const learningEvents = 25; // Simulated learning events
    const modelUpdates = 8; // Simulated model updates

    return {
      accuracy,
      precision,
      recall,
      f1Score,
      responseTime,
      learningEvents,
      modelUpdates
    };
  }

  /**
   * Calculate signal metrics
   */
  private calculateSignalMetrics(): ResilienceMetrics['signals'] {
    const uptime = Date.now() - this.startTime.getTime();
    const processedPerSecond = this.totalSignals / (uptime / 1000);
    const averageProcessingTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
      : 0;

    const errorRate = this.totalSignals > 0 ? this.errorCount / this.totalSignals : 0;

    const severityDistribution = {
      [SignalSeverity.LOW]: this.severityCounts.get(SignalSeverity.LOW) || 0,
      [SignalSeverity.MEDIUM]: this.severityCounts.get(SignalSeverity.MEDIUM) || 0,
      [SignalSeverity.HIGH]: this.severityCounts.get(SignalSeverity.HIGH) || 0,
      [SignalSeverity.CRITICAL]: this.severityCounts.get(SignalSeverity.CRITICAL) || 0
    };

    return {
      totalProcessed: this.totalSignals,
      processedPerSecond,
      averageProcessingTime,
      errorRate,
      severityDistribution
    };
  }

  /**
   * Calculate health metrics
   */
  private calculateHealthMetrics(): ResilienceMetrics['health'] {
    const uptime = Date.now() - this.startTime.getTime();
    const memoryUsage = process.memoryUsage().heapUsed;
    const cpuUsage = 0; // Would need more sophisticated CPU monitoring
    const diskUsage = 0; // Would need disk usage monitoring
    const networkLatency = 0; // Would need network monitoring

    // Determine health status based on metrics
    let status: HealthStatus = 'HEALTHY';
    if (this.errorCount > this.totalSignals * 0.1) {
      status = 'UNHEALTHY';
    } else if (this.errorCount > this.totalSignals * 0.05) {
      status = 'DEGRADED';
    }

    return {
      status,
      uptime,
      memoryUsage,
      cpuUsage,
      diskUsage,
      networkLatency
    };
  }

  /**
   * Record signal processing event
   */
  public recordSignalProcessing(signal: Signal, processingTime: number, success: boolean): void {
    if (!this.isMonitoring) return;

    this.totalSignals++;
    this.responseTimes.push(processingTime);
    
    // Update signal type counter
    const currentCount = this.signalCounts.get(signal.type) || 0;
    this.signalCounts.set(signal.type, currentCount + 1);

    // Update severity counter
    const currentSeverityCount = this.severityCounts.get(signal.severity) || 0;
    this.severityCounts.set(signal.severity, currentSeverityCount + 1);

    if (!success) {
      this.errorCount++;
    }

    // Keep only recent response times (last 1000)
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  }

  /**
   * Record resilience event
   */
  public recordResilienceEvent(event: ResilienceEvent): void {
    if (!this.isMonitoring) return;

    // Emit event for external monitoring
    this.emit('resilienceEvent', event);

    // Check for specific event types that might trigger alerts
    if (event.type === ResilienceEventType.EMERGENCY_RESPONSE) {
      this.generateAlert('critical', 'emergency', 'Emergency response triggered', {
        eventType: event.type,
        timestamp: event.timestamp,
        data: event.data
      });
    }
  }

  /**
   * Check for alerts based on metrics
   */
  private checkForAlerts(metrics: ResilienceMetrics): void {
    if (!this.config.alerts.enabled) return;

    const thresholds = this.config.thresholds;

    // Check response time threshold
    if (metrics.performance.averageResponseTime > thresholds.responseTime) {
      this.generateAlert('high', 'performance', 'Response time exceeds threshold', {
        current: metrics.performance.averageResponseTime,
        threshold: thresholds.responseTime
      });
    }

    // Check error rate threshold
    if (metrics.performance.errorRate > thresholds.errorRate) {
      this.generateAlert('high', 'performance', 'Error rate exceeds threshold', {
        current: metrics.performance.errorRate,
        threshold: thresholds.errorRate
      });
    }

    // Check memory usage threshold
    if (metrics.health.memoryUsage > thresholds.memoryUsage) {
      this.generateAlert('medium', 'health', 'Memory usage exceeds threshold', {
        current: metrics.health.memoryUsage,
        threshold: thresholds.memoryUsage
      });
    }

    // Check resilience level threshold
    if (metrics.overallScore < thresholds.resilienceLevel) {
      this.generateAlert('critical', 'resilience', 'Resilience level below threshold', {
        current: metrics.overallScore,
        threshold: thresholds.resilienceLevel
      });
    }
  }

  /**
   * Generate monitoring alert
   */
  private generateAlert(
    severity: MonitoringAlert['severity'],
    type: MonitoringAlert['type'],
    message: string,
    context: Record<string, any>
  ): void {
    const alert: MonitoringAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      severity,
      type,
      message,
      context,
      status: 'active'
    };

    this.alerts.push(alert);
    this.emit('alert', alert);

    console.log(`🚨 Alert generated: ${message}`, context);
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && alert.status === 'active') {
      alert.status = 'acknowledged';
      this.emit('alertAcknowledged', alert);
      return true;
    }
    return false;
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && alert.status !== 'resolved') {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
      this.emit('alertResolved', alert);
      return true;
    }
    return false;
  }

  /**
   * Get current metrics
   */
  public getCurrentMetrics(): ResilienceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  /**
   * Get metrics history
   */
  public getMetricsHistory(limit?: number): ResilienceMetrics[] {
    if (limit) {
      return this.metrics.slice(-limit);
    }
    return [...this.metrics];
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): MonitoringAlert[] {
    return this.alerts.filter(alert => alert.status === 'active');
  }

  /**
   * Get all alerts
   */
  public getAllAlerts(limit?: number): MonitoringAlert[] {
    if (limit) {
      return this.alerts.slice(-limit);
    }
    return [...this.alerts];
  }

  /**
   * Get monitoring status
   */
  public getStatus(): {
    isMonitoring: boolean;
    uptime: number;
    metricsCount: number;
    alertsCount: number;
    activeAlertsCount: number;
  } {
    return {
      isMonitoring: this.isMonitoring,
      uptime: Date.now() - this.startTime.getTime(),
      metricsCount: this.metrics.length,
      alertsCount: this.alerts.length,
      activeAlertsCount: this.getActiveAlerts().length
    };
  }

  /**
   * Update monitoring configuration
   */
  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Monitoring configuration updated');
  }

  /**
   * Cleanup old metrics
   */
  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - (this.config.retentionPeriod * 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(metric => 
      metric.timestamp.getTime() >= cutoffTime
    );
  }

  /**
   * Get predefined monitoring configurations
   */
  public static getPredefinedConfigs(): MonitoringConfig[] {
    return [
      {
        enabled: true,
        collectionInterval: 5000, // 5 seconds
        retentionPeriod: 7, // 7 days
        thresholds: {
          responseTime: 2000, // 2 seconds
          errorRate: 0.05, // 5%
          memoryUsage: 100 * 1024 * 1024, // 100MB
          cpuUsage: 80, // 80%
          resilienceLevel: 60 // 60%
        },
        components: {
          performance: true,
          margins: true,
          antifragile: true,
          adaptive: true,
          signals: true,
          health: true
        },
        alerts: {
          enabled: true,
          channels: ['console', 'log'],
          severity: 'medium'
        }
      },
      {
        enabled: true,
        collectionInterval: 1000, // 1 second (high frequency)
        retentionPeriod: 1, // 1 day
        thresholds: {
          responseTime: 1000, // 1 second
          errorRate: 0.01, // 1%
          memoryUsage: 50 * 1024 * 1024, // 50MB
          cpuUsage: 70, // 70%
          resilienceLevel: 80 // 80%
        },
        components: {
          performance: true,
          margins: true,
          antifragile: true,
          adaptive: true,
          signals: true,
          health: true
        },
        alerts: {
          enabled: true,
          channels: ['console', 'log', 'email'],
          severity: 'low'
        }
      },
      {
        enabled: true,
        collectionInterval: 30000, // 30 seconds (low frequency)
        retentionPeriod: 30, // 30 days
        thresholds: {
          responseTime: 5000, // 5 seconds
          errorRate: 0.1, // 10%
          memoryUsage: 200 * 1024 * 1024, // 200MB
          cpuUsage: 90, // 90%
          resilienceLevel: 40 // 40%
        },
        components: {
          performance: true,
          margins: true,
          antifragile: true,
          adaptive: true,
          signals: true,
          health: true
        },
        alerts: {
          enabled: true,
          channels: ['console'],
          severity: 'high'
        }
      }
    ];
  }
}
