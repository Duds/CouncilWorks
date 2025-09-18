/**
 * Response Performance Monitoring Engine
 *
 * This module is responsible for monitoring and tracking the performance
 * of response workflows and signal processing operations.
 * It implements F15.6: Response Performance Monitoring.
 *
 * @file lib/response-performance-monitoring-engine.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  ResponsePerformanceMetrics,
  PerformanceAlert,
  PerformanceAlertType,
  PerformanceAlertSeverity,
  SignalProcessingResult,
  ResponseExecutionStatus,
} from './resilience-types';

/**
 * ResponsePerformanceMonitoringEngine Class
 *
 * Monitors performance metrics and generates alerts for response operations.
 */
export class ResponsePerformanceMonitoringEngine {
  private metrics: ResponsePerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private config: {
    alertThresholds: {
      avgProcessingTime: number; // ms
      errorRate: number; // percentage
      throughput: number; // signals per minute
      resourceUtilization: number; // percentage
    };
    retentionPeriod: number; // days
    alertCooldown: number; // ms
  };

  constructor(config?: Partial<ResponsePerformanceMonitoringEngine['config']>) {
    this.config = {
      alertThresholds: {
        avgProcessingTime: 5000, // 5 seconds
        errorRate: 10, // 10%
        throughput: 100, // 100 signals per minute
        resourceUtilization: 80, // 80%
      },
      retentionPeriod: 30, // 30 days
      alertCooldown: 300000, // 5 minutes
      ...config,
    };
    console.log(`📊 Response Performance Monitoring Engine initialized.`);
  }

  /**
   * Initializes the performance monitoring engine.
   */
  public async initialize(): Promise<{ success: boolean; message: string }> {
    console.log(`📊 Initializing Response Performance Monitoring Engine...`);
    
    // Initialize any required resources, connections, etc.
    // For now, just mark as initialized
    console.log(`✅ Response Performance Monitoring Engine initialized successfully`);
    
    return {
      success: true,
      message: 'Performance monitoring engine initialized successfully'
    };
  }

  /**
   * Checks if the engine is initialized.
   */
  public isEngineInitialized(): boolean {
    return true; // Always initialized after constructor
  }

  /**
   * Records signal processing metrics (simplified interface for tests).
   */
  public async recordSignalProcessing(signal: Signal, processingTime: number, success: boolean): Promise<void> {
    const metrics: ResponsePerformanceMetrics = {
      id: `metrics-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      operationType: 'SIGNAL_PROCESSING',
      operationId: signal.id,
      duration: processingTime,
      success,
      resourceUtilization: Math.random() * 50 + 20, // Simulate 20-70%
      throughput: 1, // Single signal processed
      errorRate: success ? 0 : 100, // 100% error rate if failed
      metadata: {
        signalType: signal.type,
        signalSeverity: signal.severity,
      },
    };

    this.metrics.push(metrics);
    this.checkPerformanceThresholds(metrics);
    console.log(`📈 Recorded signal processing metrics: ${metrics.duration}ms, success: ${metrics.success}`);
  }

  /**
   * Records response execution metrics (simplified interface for tests).
   */
  public async recordResponseExecution(execution: any): Promise<void> {
    const metrics: ResponsePerformanceMetrics = {
      id: `metrics-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      operationType: 'RESPONSE_EXECUTION',
      operationId: execution.executionId,
      duration: execution.totalTime || 0,
      success: execution.success || false,
      resourceUtilization: execution.resourceUtilization || 0,
      throughput: execution.stepsExecuted || 0,
      errorRate: execution.errorRate || 0,
      metadata: {
        workflowId: execution.workflowId,
        stepsExecuted: execution.stepsExecuted,
        stepsFailed: execution.stepsFailed,
      },
    };

    this.metrics.push(metrics);
    this.checkPerformanceThresholds(metrics);
    console.log(`📈 Recorded response execution metrics: ${metrics.duration}ms, success: ${metrics.success}`);
  }

  /**
   * Records metrics for signal processing operations.
   */
  public recordSignalProcessingMetrics(processingResult: SignalProcessingResult): void {
    const metrics: ResponsePerformanceMetrics = {
      id: `metrics-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      operationType: 'SIGNAL_PROCESSING',
      operationId: processingResult.id,
      duration: processingResult.processingTime,
      success: true, // Assume success if we got a result
      resourceUtilization: Math.random() * 50 + 20, // Simulate 20-70%
      throughput: 1, // Single signal processed
      errorRate: 0, // No errors in this operation
      metadata: {
        signalType: processingResult.signal.type,
        signalSeverity: processingResult.signal.severity,
        riskLevel: processingResult.analysis.riskAssessment.riskLevel,
      },
    };

    this.metrics.push(metrics);
    this.checkPerformanceThresholds(metrics);
    console.log(`📈 Recorded signal processing metrics: ${metrics.duration}ms`);
  }

  /**
   * Records metrics for response execution operations.
   */
  public recordResponseExecutionMetrics(executionStatus: ResponseExecutionStatus): void {
    const metrics: ResponsePerformanceMetrics = {
      id: `metrics-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      operationType: 'RESPONSE_EXECUTION',
      operationId: executionStatus.executionId,
      duration: executionStatus.totalTime || 0,
      success: executionStatus.results.success,
      resourceUtilization: executionStatus.results.metrics.resourceUtilization,
      throughput: executionStatus.results.metrics.stepsExecuted,
      errorRate: executionStatus.results.metrics.stepsFailed > 0 ? 
        (executionStatus.results.metrics.stepsFailed / (executionStatus.results.metrics.stepsExecuted + executionStatus.results.metrics.stepsFailed)) * 100 : 0,
      metadata: {
        workflowId: executionStatus.workflowId,
        stepsExecuted: executionStatus.results.metrics.stepsExecuted,
        stepsFailed: executionStatus.results.metrics.stepsFailed,
        avgStepTime: executionStatus.results.metrics.avgStepTime,
      },
    };

    this.metrics.push(metrics);
    this.checkPerformanceThresholds(metrics);
    console.log(`📈 Recorded response execution metrics: ${metrics.duration}ms, success: ${metrics.success}`);
  }

  /**
   * Checks performance metrics against configured thresholds and generates alerts.
   */
  private checkPerformanceThresholds(metrics: ResponsePerformanceMetrics): void {
    const { alertThresholds } = this.config;

    // Check processing time threshold
    if (metrics.duration > alertThresholds.avgProcessingTime) {
      this.generateAlert({
        type: PerformanceAlertType.PROCESSING_TIME_EXCEEDED,
        severity: PerformanceAlertSeverity.WARNING,
        message: `Processing time ${metrics.duration}ms exceeds threshold ${alertThresholds.avgProcessingTime}ms`,
        operationId: metrics.operationId,
        operationType: metrics.operationType,
        threshold: alertThresholds.avgProcessingTime,
        actualValue: metrics.duration,
        metadata: metrics.metadata,
      });
    }

    // Check error rate threshold
    if (metrics.errorRate > alertThresholds.errorRate) {
      this.generateAlert({
        type: PerformanceAlertType.ERROR_RATE_EXCEEDED,
        severity: PerformanceAlertSeverity.CRITICAL,
        message: `Error rate ${metrics.errorRate}% exceeds threshold ${alertThresholds.errorRate}%`,
        operationId: metrics.operationId,
        operationType: metrics.operationType,
        threshold: alertThresholds.errorRate,
        actualValue: metrics.errorRate,
        metadata: metrics.metadata,
      });
    }

    // Check resource utilization threshold
    if (metrics.resourceUtilization > alertThresholds.resourceUtilization) {
      this.generateAlert({
        type: PerformanceAlertType.RESOURCE_UTILIZATION_EXCEEDED,
        severity: PerformanceAlertSeverity.WARNING,
        message: `Resource utilization ${metrics.resourceUtilization}% exceeds threshold ${alertThresholds.resourceUtilization}%`,
        operationId: metrics.operationId,
        operationType: metrics.operationType,
        threshold: alertThresholds.resourceUtilization,
        actualValue: metrics.resourceUtilization,
        metadata: metrics.metadata,
      });
    }
  }

  /**
   * Generates a performance alert if not in cooldown period.
   */
  private generateAlert(alertData: Omit<PerformanceAlert, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>): void {
    // Check for cooldown period
    const recentAlert = this.alerts.find(alert => 
      alert.type === alertData.type &&
      alert.operationType === alertData.operationType &&
      (Date.now() - alert.timestamp.getTime()) < this.config.alertCooldown
    );

    if (recentAlert) {
      console.log(`🚨 Alert suppressed due to cooldown period: ${alertData.type}`);
      return;
    }

    const alert: PerformanceAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      ...alertData,
    };

    this.alerts.push(alert);
    console.log(`🚨 Performance alert generated: ${alert.type} - ${alert.message}`);
  }

  /**
   * Gets performance metrics for a specific time range.
   */
  public getPerformanceMetrics(
    startTime?: Date,
    endTime?: Date,
    operationType?: 'SIGNAL_PROCESSING' | 'RESPONSE_EXECUTION'
  ): ResponsePerformanceMetrics[] {
    let filteredMetrics = [...this.metrics];

    if (startTime) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= startTime);
    }

    if (endTime) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp <= endTime);
    }

    if (operationType) {
      filteredMetrics = filteredMetrics.filter(m => m.operationType === operationType);
    }

    return filteredMetrics;
  }

  /**
   * Gets active performance alerts.
   */
  public getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Acknowledges a performance alert.
   */
  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      console.log(`✅ Alert acknowledged: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Resolves a performance alert.
   */
  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      console.log(`✅ Alert resolved: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Generates aggregated performance statistics.
   */
  public generatePerformanceStatistics(
    timeRange?: { start: Date; end: Date }
  ): {
    totalOperations: number;
    avgProcessingTime: number;
    successRate: number;
    avgErrorRate: number;
    avgResourceUtilization: number;
    totalAlerts: number;
    activeAlerts: number;
  } {
    let metricsToAnalyze = [...this.metrics];

    if (timeRange) {
      metricsToAnalyze = metricsToAnalyze.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    const totalOperations = metricsToAnalyze.length;
    const avgProcessingTime = totalOperations > 0 ? 
      metricsToAnalyze.reduce((sum, m) => sum + m.duration, 0) / totalOperations : 0;
    const successRate = totalOperations > 0 ? 
      (metricsToAnalyze.filter(m => m.success).length / totalOperations) * 100 : 0;
    const avgErrorRate = totalOperations > 0 ? 
      metricsToAnalyze.reduce((sum, m) => sum + m.errorRate, 0) / totalOperations : 0;
    const avgResourceUtilization = totalOperations > 0 ? 
      metricsToAnalyze.reduce((sum, m) => sum + m.resourceUtilization, 0) / totalOperations : 0;

    const totalAlerts = this.alerts.length;
    const activeAlerts = this.alerts.filter(a => !a.resolved).length;

    return {
      totalOperations,
      avgProcessingTime,
      successRate,
      avgErrorRate,
      avgResourceUtilization,
      totalAlerts,
      activeAlerts,
    };
  }

  /**
   * Cleans up old metrics and alerts based on retention period.
   */
  public cleanupOldData(): void {
    const cutoffDate = new Date(Date.now() - (this.config.retentionPeriod * 24 * 60 * 60 * 1000));
    
    const initialMetricsCount = this.metrics.length;
    const initialAlertsCount = this.alerts.length;

    this.metrics = this.metrics.filter(m => m.timestamp >= cutoffDate);
    this.alerts = this.alerts.filter(a => a.timestamp >= cutoffDate);

    const cleanedMetrics = initialMetricsCount - this.metrics.length;
    const cleanedAlerts = initialAlertsCount - this.alerts.length;

    console.log(`🧹 Cleaned up ${cleanedMetrics} old metrics and ${cleanedAlerts} old alerts`);
  }

  /**
   * Updates the configuration of the performance monitoring engine.
   */
  public updateConfig(newConfig: Partial<ResponsePerformanceMonitoringEngine['config']>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Response Performance Monitoring Engine configuration updated.`);
  }

  /**
   * Gets the current configuration of the performance monitoring engine.
   */
  public getConfig(): ResponsePerformanceMonitoringEngine['config'] {
    return { ...this.config };
  }

  /**
   * Gets current performance metrics (simplified interface for tests).
   */
  public getCurrentMetrics(): {
    throughput: { signalsPerMinute: number };
    avgResponseTime: number;
    errorRate: number;
    activeAlerts: number;
  } {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    
    const recentMetrics = this.metrics.filter(m => m.timestamp >= oneMinuteAgo);
    const signalsPerMinute = recentMetrics.length;
    const avgResponseTime = recentMetrics.length > 0 ? 
      recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length : 0;
    const errorRate = recentMetrics.length > 0 ? 
      (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100 : 0;
    const activeAlerts = this.alerts.filter(a => !a.resolved).length;

    return {
      throughput: { signalsPerMinute },
      avgResponseTime,
      errorRate,
      activeAlerts,
    };
  }

  /**
   * Gets all performance alerts.
   */
  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Creates a performance alert.
   */
  public createAlert(alertData: Omit<PerformanceAlert, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>): PerformanceAlert {
    const alert: PerformanceAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      ...alertData,
    };

    this.alerts.push(alert);
    console.log(`🚨 Performance alert created: ${alert.type} - ${alert.message}`);
    return alert;
  }

  /**
   * Shuts down the performance monitoring engine.
   */
  public async shutdown(): Promise<{ success: boolean; message: string }> {
    console.log(`📊 Shutting down Response Performance Monitoring Engine...`);
    
    // Clean up resources, save data, etc.
    this.cleanupOldData();
    
    console.log(`✅ Response Performance Monitoring Engine shutdown completed`);
    
    return {
      success: true,
      message: 'Performance monitoring engine shutdown successfully'
    };
  }
}
