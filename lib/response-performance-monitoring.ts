/**
 * Response Performance Monitoring Engine
 *
 * This module implements comprehensive response performance monitoring
 * including real-time metrics collection, performance analysis,
 * alerting, reporting, and optimization recommendations.
 *
 * @file lib/response-performance-monitoring.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  Signal,
  SignalType,
  SignalSeverity,
  ResponsePerformanceMetrics,
  ResponseExecutionStatus,
  ResponseActionType,
  Alert,
  AlertSeverity,
  AlertType,
  AlertStatus,
  MonitoringConfig,
  SystemHealthMetrics,
  SignalMetrics,
  ResilienceMetricsSnapshot
} from './resilience-types';

/**
 * Response Performance Monitoring Engine Class
 *
 * Monitors response performance with:
 * - Real-time metrics collection and analysis
 * - Performance trend analysis and alerting
 * - Resource utilization monitoring
 * - Success rate tracking and optimization
 * - Comprehensive reporting and insights
 */
export class ResponsePerformanceMonitoringEngine {
  private config: MonitoringConfig;
  private isInitialized: boolean = false;
  private metricsHistory: ResponsePerformanceMetrics[] = [];
  private activeAlerts: Map<string, Alert> = new Map();
  private alertHistory: Alert[] = [];
  private executionMetrics: Map<string, any> = new Map();
  private performanceBaselines: Map<string, number> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.initializeEventListeners();
    this.initializeBaselines();
  }

  /**
   * Initialize the response performance monitoring engine
   */
  public async initialize(): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('📊 Initializing Response Performance Monitoring Engine...');

      // Validate configuration
      this.validateConfig();

      // Initialize performance baselines
      await this.initializePerformanceBaselines();

      // Start monitoring
      this.startMonitoring();

      this.isInitialized = true;
      console.log('✅ Response Performance Monitoring Engine initialized successfully');
      this.emitEvent('initialized', { config: this.config });

      return {
        success: true,
        data: {
          monitoringInterval: this.config.monitoringInterval,
          alertThresholds: this.config.alertThresholds,
          metricsRetention: this.config.metricsRetention
        }
      };
    } catch (error: any) {
      console.error('❌ Failed to initialize Response Performance Monitoring Engine:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Shutdown the monitoring engine
   */
  public async shutdown(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Shutting down Response Performance Monitoring Engine...');

      // Stop monitoring
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }

      // Generate final metrics
      await this.generateFinalMetrics();

      this.isInitialized = false;
      console.log('✅ Response Performance Monitoring Engine shutdown completed');
      this.emitEvent('shutdown', { finalMetrics: this.getCurrentMetrics() });

      return { success: true };
    } catch (error: any) {
      console.error('❌ Failed to shutdown Response Performance Monitoring Engine:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Record signal processing metrics
   */
  public async recordSignalProcessing(
    signal: Signal,
    processingTime: number,
    success: boolean
  ): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      const metrics = {
        signalId: signal.id,
        signalType: signal.type,
        severity: signal.severity,
        processingTime,
        success,
        timestamp: new Date()
      };

      // Store execution metrics
      this.executionMetrics.set(signal.id, metrics);

      // Update performance baselines
      this.updatePerformanceBaselines(signal.type, processingTime, success);

      // Check for performance alerts
      await this.checkPerformanceAlerts(signal, processingTime, success);

      console.log(`📊 Recorded signal processing metrics: ${signal.id} (${processingTime}ms, ${success ? 'success' : 'failed'})`);
      this.emitEvent('metricsRecorded', { metrics });
    } catch (error: any) {
      console.error('❌ Failed to record signal processing metrics:', error);
    }
  }

  /**
   * Record response execution metrics
   */
  public async recordResponseExecution(execution: ResponseExecutionStatus): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      const metrics = {
        executionId: execution.executionId,
        workflowId: execution.workflowId,
        triggerSignal: execution.triggerSignal,
        executionTime: execution.totalTime || 0,
        success: execution.results.success,
        stepsExecuted: execution.results.metrics.stepsExecuted,
        stepsFailed: execution.results.metrics.stepsFailed,
        resourceUtilization: execution.results.metrics.resourceUtilization,
        timestamp: new Date()
      };

      // Store execution metrics
      this.executionMetrics.set(execution.executionId, metrics);

      // Update performance baselines
      this.updateExecutionBaselines(execution);

      // Check for execution alerts
      await this.checkExecutionAlerts(execution);

      console.log(`📊 Recorded response execution metrics: ${execution.executionId}`);
      this.emitEvent('executionRecorded', { metrics });
    } catch (error: any) {
      console.error('❌ Failed to record response execution metrics:', error);
    }
  }

  /**
   * Generate current performance metrics
   */
  public getCurrentMetrics(): ResponsePerformanceMetrics {
    const now = new Date();
    const recentMetrics = this.getRecentMetrics(5 * 60 * 1000); // Last 5 minutes

    return {
      id: `metrics-${now.getTime()}`,
      timestamp: now,
      responseTime: this.calculateResponseTimeMetrics(recentMetrics),
      successRate: this.calculateSuccessRateMetrics(recentMetrics),
      resourceUtilization: this.calculateResourceUtilizationMetrics(recentMetrics),
      throughput: this.calculateThroughputMetrics(recentMetrics),
      errors: this.calculateErrorMetrics(recentMetrics),
      trends: this.calculateTrendMetrics()
    };
  }

  /**
   * Get metrics history
   */
  public getMetricsHistory(timeWindow?: number): ResponsePerformanceMetrics[] {
    if (timeWindow) {
      const cutoffTime = Date.now() - timeWindow;
      return this.metricsHistory.filter(m => m.timestamp.getTime() >= cutoffTime);
    }
    return [...this.metricsHistory];
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Get alert history
   */
  public getAlertHistory(): Alert[] {
    return [...this.alertHistory];
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = AlertStatus.ACKNOWLEDGED;
      alert.acknowledgedAt = new Date();
      alert.acknowledgedBy = acknowledgedBy;
      
      console.log(`✅ Alert acknowledged: ${alertId} by ${acknowledgedBy}`);
      this.emitEvent('alertAcknowledged', { alert });
    }
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string, resolvedBy: string, resolution: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = AlertStatus.RESOLVED;
      alert.resolvedAt = new Date();
      alert.resolvedBy = resolvedBy;
      alert.resolution = resolution;

      // Move to history
      this.alertHistory.push(alert);
      this.activeAlerts.delete(alertId);

      console.log(`✅ Alert resolved: ${alertId} by ${resolvedBy}`);
      this.emitEvent('alertResolved', { alert });
    }
  }

  /**
   * Start monitoring
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      await this.collectMetrics();
    }, this.config.monitoringInterval);
  }

  /**
   * Collect metrics
   */
  private async collectMetrics(): Promise<void> {
    try {
      const metrics = this.getCurrentMetrics();
      this.metricsHistory.push(metrics);

      // Keep only recent metrics
      this.cleanupOldMetrics();

      // Check for system health alerts
      await this.checkSystemHealthAlerts(metrics);

      console.log(`📊 Collected performance metrics: ${metrics.id}`);
      this.emitEvent('metricsCollected', { metrics });
    } catch (error: any) {
      console.error('❌ Failed to collect metrics:', error);
    }
  }

  /**
   * Calculate response time metrics
   */
  private calculateResponseTimeMetrics(recentMetrics: any[]): {
    average: number;
    median: number;
    p95: number;
    p99: number;
    minimum: number;
    maximum: number;
  } {
    const responseTimes = recentMetrics
      .filter(m => m.processingTime !== undefined)
      .map(m => m.processingTime);

    if (responseTimes.length === 0) {
      return { average: 0, median: 0, p95: 0, p99: 0, minimum: 0, maximum: 0 };
    }

    const sorted = responseTimes.sort((a, b) => a - b);
    const average = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    const minimum = sorted[0];
    const maximum = sorted[sorted.length - 1];

    return { average, median, p95, p99, minimum, maximum };
  }

  /**
   * Calculate success rate metrics
   */
  private calculateSuccessRateMetrics(recentMetrics: any[]): {
    overall: number;
    bySignalType: Record<SignalType, number>;
    bySeverity: Record<SignalSeverity, number>;
    byWorkflow: Record<string, number>;
  } {
    const overall = recentMetrics.length > 0 
      ? recentMetrics.filter(m => m.success).length / recentMetrics.length
      : 0;

    const bySignalType: Record<SignalType, number> = {} as Record<SignalType, number>;
    const bySeverity: Record<SignalSeverity, number> = {} as Record<SignalSeverity, number>;
    const byWorkflow: Record<string, number> = {};

    // Calculate by signal type
    for (const signalType of Object.values(SignalType)) {
      const typeMetrics = recentMetrics.filter(m => m.signalType === signalType);
      bySignalType[signalType] = typeMetrics.length > 0 
        ? typeMetrics.filter(m => m.success).length / typeMetrics.length
        : 0;
    }

    // Calculate by severity
    for (const severity of Object.values(SignalSeverity)) {
      const severityMetrics = recentMetrics.filter(m => m.severity === severity);
      bySeverity[severity] = severityMetrics.length > 0 
        ? severityMetrics.filter(m => m.success).length / severityMetrics.length
        : 0;
    }

    // Calculate by workflow
    const workflowMetrics = recentMetrics.filter(m => m.workflowId);
    const workflows = [...new Set(workflowMetrics.map(m => m.workflowId))];
    for (const workflowId of workflows) {
      const workflowSpecificMetrics = workflowMetrics.filter(m => m.workflowId === workflowId);
      byWorkflow[workflowId] = workflowSpecificMetrics.length > 0 
        ? workflowSpecificMetrics.filter(m => m.success).length / workflowSpecificMetrics.length
        : 0;
    }

    return { overall, bySignalType, bySeverity, byWorkflow };
  }

  /**
   * Calculate resource utilization metrics
   */
  private calculateResourceUtilizationMetrics(recentMetrics: any[]): {
    overall: number;
    byResourceType: Record<string, number>;
    byResourcePool: Record<string, number>;
    peak: number;
  } {
    const utilizationMetrics = recentMetrics.filter(m => m.resourceUtilization !== undefined);
    
    if (utilizationMetrics.length === 0) {
      return { overall: 0, byResourceType: {}, byResourcePool: {}, peak: 0 };
    }

    const overall = utilizationMetrics.reduce((sum, m) => sum + m.resourceUtilization, 0) / utilizationMetrics.length;
    const peak = Math.max(...utilizationMetrics.map(m => m.resourceUtilization));

    // Simplified implementation - in a real system, this would track actual resource types and pools
    const byResourceType: Record<string, number> = {};
    const byResourcePool: Record<string, number> = {};

    return { overall, byResourceType, byResourcePool, peak };
  }

  /**
   * Calculate throughput metrics
   */
  private calculateThroughputMetrics(recentMetrics: any[]): {
    signalsPerMinute: number;
    responsesPerMinute: number;
    peakThroughput: number;
  } {
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const cutoffTime = Date.now() - timeWindow;
    const recentSignals = recentMetrics.filter(m => m.timestamp.getTime() >= cutoffTime);
    
    const signalsPerMinute = recentSignals.length / 5; // 5 minutes
    const responsesPerMinute = recentSignals.filter(m => m.executionId).length / 5;
    const peakThroughput = Math.max(signalsPerMinute, responsesPerMinute);

    return { signalsPerMinute, responsesPerMinute, peakThroughput };
  }

  /**
   * Calculate error metrics
   */
  private calculateErrorMetrics(recentMetrics: any[]): {
    total: number;
    rate: number;
    byType: Record<string, number>;
    byWorkflow: Record<string, number>;
  } {
    const errors = recentMetrics.filter(m => !m.success);
    const total = errors.length;
    const rate = recentMetrics.length > 0 ? total / recentMetrics.length : 0;

    const byType: Record<string, number> = {};
    const byWorkflow: Record<string, number> = {};

    // Count errors by type and workflow
    for (const error of errors) {
      const errorType = error.errorType || 'unknown';
      byType[errorType] = (byType[errorType] || 0) + 1;

      if (error.workflowId) {
        byWorkflow[error.workflowId] = (byWorkflow[error.workflowId] || 0) + 1;
      }
    }

    return { total, rate, byType, byWorkflow };
  }

  /**
   * Calculate trend metrics
   */
  private calculateTrendMetrics(): {
    responseTimeTrend: 'IMPROVING' | 'DEGRADING' | 'STABLE';
    successRateTrend: 'IMPROVING' | 'DEGRADING' | 'STABLE';
    throughputTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
  } {
    if (this.metricsHistory.length < 2) {
      return {
        responseTimeTrend: 'STABLE',
        successRateTrend: 'STABLE',
        throughputTrend: 'STABLE'
      };
    }

    const recent = this.metricsHistory.slice(-5); // Last 5 metrics
    const older = this.metricsHistory.slice(-10, -5); // Previous 5 metrics

    if (older.length === 0) {
      return {
        responseTimeTrend: 'STABLE',
        successRateTrend: 'STABLE',
        throughputTrend: 'STABLE'
      };
    }

    const recentAvgResponseTime = recent.reduce((sum, m) => sum + m.responseTime.average, 0) / recent.length;
    const olderAvgResponseTime = older.reduce((sum, m) => sum + m.responseTime.average, 0) / older.length;
    const responseTimeTrend = recentAvgResponseTime < olderAvgResponseTime * 0.9 ? 'IMPROVING' :
                             recentAvgResponseTime > olderAvgResponseTime * 1.1 ? 'DEGRADING' : 'STABLE';

    const recentAvgSuccessRate = recent.reduce((sum, m) => sum + m.successRate.overall, 0) / recent.length;
    const olderAvgSuccessRate = older.reduce((sum, m) => sum + m.successRate.overall, 0) / older.length;
    const successRateTrend = recentAvgSuccessRate > olderAvgSuccessRate + 0.05 ? 'IMPROVING' :
                            recentAvgSuccessRate < olderAvgSuccessRate - 0.05 ? 'DEGRADING' : 'STABLE';

    const recentAvgThroughput = recent.reduce((sum, m) => sum + m.throughput.signalsPerMinute, 0) / recent.length;
    const olderAvgThroughput = older.reduce((sum, m) => sum + m.throughput.signalsPerMinute, 0) / older.length;
    const throughputTrend = recentAvgThroughput > olderAvgThroughput * 1.1 ? 'INCREASING' :
                           recentAvgThroughput < olderAvgThroughput * 0.9 ? 'DECREASING' : 'STABLE';

    return { responseTimeTrend, successRateTrend, throughputTrend };
  }

  /**
   * Get recent metrics
   */
  private getRecentMetrics(timeWindow: number): any[] {
    const cutoffTime = Date.now() - timeWindow;
    return Array.from(this.executionMetrics.values())
      .filter(m => m.timestamp.getTime() >= cutoffTime);
  }

  /**
   * Update performance baselines
   */
  private updatePerformanceBaselines(signalType: SignalType, processingTime: number, success: boolean): void {
    const baselineKey = `${signalType}-processing-time`;
    const currentBaseline = this.performanceBaselines.get(baselineKey) || processingTime;
    
    // Update baseline using exponential moving average
    const alpha = 0.1; // Learning rate
    const newBaseline = alpha * processingTime + (1 - alpha) * currentBaseline;
    this.performanceBaselines.set(baselineKey, newBaseline);
  }

  /**
   * Update execution baselines
   */
  private updateExecutionBaselines(execution: ResponseExecutionStatus): void {
    const baselineKey = `${execution.workflowId}-execution-time`;
    const executionTime = execution.totalTime || 0;
    const currentBaseline = this.performanceBaselines.get(baselineKey) || executionTime;
    
    // Update baseline using exponential moving average
    const alpha = 0.1; // Learning rate
    const newBaseline = alpha * executionTime + (1 - alpha) * currentBaseline;
    this.performanceBaselines.set(baselineKey, newBaseline);
  }

  /**
   * Check performance alerts
   */
  private async checkPerformanceAlerts(signal: Signal, processingTime: number, success: boolean): Promise<void> {
    // Check response time alerts
    const baselineKey = `${signal.type}-processing-time`;
    const baseline = this.performanceBaselines.get(baselineKey);
    
    if (baseline && processingTime > baseline * 2) {
      await this.createAlert({
        id: `response-time-${signal.id}`,
        type: AlertType.PERFORMANCE_DEGRADATION,
        severity: AlertSeverity.MEDIUM,
        title: 'High Response Time Detected',
        description: `Signal processing time (${processingTime}ms) exceeds baseline (${baseline}ms)`,
        source: 'ResponsePerformanceMonitoring',
        timestamp: new Date(),
        status: AlertStatus.ACTIVE,
        metadata: {
          signalId: signal.id,
          signalType: signal.type,
          processingTime,
          baseline,
          threshold: baseline * 2
        }
      });
    }

    // Check success rate alerts
    if (!success) {
      await this.createAlert({
        id: `processing-failure-${signal.id}`,
        type: AlertType.PROCESSING_ERROR,
        severity: AlertSeverity.HIGH,
        title: 'Signal Processing Failure',
        description: `Failed to process signal ${signal.id}`,
        source: 'ResponsePerformanceMonitoring',
        timestamp: new Date(),
        status: AlertStatus.ACTIVE,
        metadata: {
          signalId: signal.id,
          signalType: signal.type,
          severity: signal.severity
        }
      });
    }
  }

  /**
   * Check execution alerts
   */
  private async checkExecutionAlerts(execution: ResponseExecutionStatus): Promise<void> {
    // Check execution time alerts
    const baselineKey = `${execution.workflowId}-execution-time`;
    const baseline = this.performanceBaselines.get(baselineKey);
    const executionTime = execution.totalTime || 0;
    
    if (baseline && executionTime > baseline * 1.5) {
      await this.createAlert({
        id: `execution-time-${execution.executionId}`,
        type: AlertType.PERFORMANCE_DEGRADATION,
        severity: AlertSeverity.MEDIUM,
        title: 'Slow Execution Detected',
        description: `Workflow execution time (${executionTime}ms) exceeds baseline (${baseline}ms)`,
        source: 'ResponsePerformanceMonitoring',
        timestamp: new Date(),
        status: AlertStatus.ACTIVE,
        metadata: {
          executionId: execution.executionId,
          workflowId: execution.workflowId,
          executionTime,
          baseline,
          threshold: baseline * 1.5
        }
      });
    }

    // Check failure alerts
    if (!execution.results.success) {
      await this.createAlert({
        id: `execution-failure-${execution.executionId}`,
        type: AlertType.EXECUTION_ERROR,
        severity: AlertSeverity.HIGH,
        title: 'Workflow Execution Failure',
        description: `Workflow ${execution.workflowId} failed to execute successfully`,
        source: 'ResponsePerformanceMonitoring',
        timestamp: new Date(),
        status: AlertStatus.ACTIVE,
        metadata: {
          executionId: execution.executionId,
          workflowId: execution.workflowId,
          errors: execution.results.errors
        }
      });
    }
  }

  /**
   * Check system health alerts
   */
  private async checkSystemHealthAlerts(metrics: ResponsePerformanceMetrics): Promise<void> {
    // Check success rate threshold
    if (metrics.successRate.overall < this.config.alertThresholds.successRate) {
      await this.createAlert({
        id: `low-success-rate-${Date.now()}`,
        type: AlertType.SYSTEM_HEALTH,
        severity: AlertSeverity.HIGH,
        title: 'Low Success Rate Alert',
        description: `Overall success rate (${(metrics.successRate.overall * 100).toFixed(1)}%) below threshold (${(this.config.alertThresholds.successRate * 100).toFixed(1)}%)`,
        source: 'ResponsePerformanceMonitoring',
        timestamp: new Date(),
        status: AlertStatus.ACTIVE,
        metadata: {
          currentSuccessRate: metrics.successRate.overall,
          threshold: this.config.alertThresholds.successRate
        }
      });
    }

    // Check response time threshold
    if (metrics.responseTime.average > this.config.alertThresholds.responseTime) {
      await this.createAlert({
        id: `high-response-time-${Date.now()}`,
        type: AlertType.PERFORMANCE_DEGRADATION,
        severity: AlertSeverity.MEDIUM,
        title: 'High Response Time Alert',
        description: `Average response time (${metrics.responseTime.average}ms) exceeds threshold (${this.config.alertThresholds.responseTime}ms)`,
        source: 'ResponsePerformanceMonitoring',
        timestamp: new Date(),
        status: AlertStatus.ACTIVE,
        metadata: {
          currentResponseTime: metrics.responseTime.average,
          threshold: this.config.alertThresholds.responseTime
        }
      });
    }
  }

  /**
   * Create alert
   */
  private async createAlert(alert: Alert): Promise<void> {
    // Check if similar alert already exists
    const existingAlert = Array.from(this.activeAlerts.values())
      .find(a => a.type === alert.type && a.title === alert.title && 
                 Date.now() - a.timestamp.getTime() < 5 * 60 * 1000); // 5 minutes

    if (existingAlert) {
      return; // Don't create duplicate alerts
    }

    this.activeAlerts.set(alert.id, alert);
    console.log(`🚨 Alert created: ${alert.title}`);
    this.emitEvent('alertCreated', { alert });
  }

  /**
   * Cleanup old metrics
   */
  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - this.config.metricsRetention;
    this.metricsHistory = this.metricsHistory.filter(m => m.timestamp.getTime() >= cutoffTime);
    
    // Cleanup execution metrics
    for (const [key, metrics] of this.executionMetrics.entries()) {
      if (metrics.timestamp.getTime() < cutoffTime) {
        this.executionMetrics.delete(key);
      }
    }
  }

  /**
   * Generate final metrics
   */
  private async generateFinalMetrics(): Promise<void> {
    const finalMetrics = this.getCurrentMetrics();
    this.metricsHistory.push(finalMetrics);
    console.log('📊 Final metrics generated');
  }

  /**
   * Initialize performance baselines
   */
  private async initializePerformanceBaselines(): Promise<void> {
    // Initialize baselines for common signal types
    const signalTypes = Object.values(SignalType);
    for (const signalType of signalTypes) {
      this.performanceBaselines.set(`${signalType}-processing-time`, 1000); // Default 1 second
    }

    console.log(`📊 Initialized performance baselines for ${signalTypes.length} signal types`);
  }

  /**
   * Initialize baselines
   */
  private initializeBaselines(): void {
    this.performanceBaselines = new Map();
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.eventListeners.set('initialized', []);
    this.eventListeners.set('shutdown', []);
    this.eventListeners.set('metricsRecorded', []);
    this.eventListeners.set('executionRecorded', []);
    this.eventListeners.set('metricsCollected', []);
    this.eventListeners.set('alertCreated', []);
    this.eventListeners.set('alertAcknowledged', []);
    this.eventListeners.set('alertResolved', []);
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(eventName: string, data: any): void {
    const listeners = this.eventListeners.get(eventName) || [];
    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error: any) {
        console.error(`❌ Event listener error for ${eventName}:`, error);
      }
    }
  }

  /**
   * Validate configuration
   */
  private validateConfig(): void {
    if (!this.config.monitoringInterval || this.config.monitoringInterval <= 0) {
      throw new Error('Invalid configuration: monitoringInterval must be greater than 0');
    }

    if (!this.config.metricsRetention || this.config.metricsRetention <= 0) {
      throw new Error('Invalid configuration: metricsRetention must be greater than 0');
    }

    if (!this.config.alertThresholds) {
      throw new Error('Invalid configuration: alertThresholds is required');
    }
  }

  // Public API methods

  /**
   * Add event listener
   */
  public addEventListener(eventName: string, listener: Function): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)!.push(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(eventName: string, listener: Function): void {
    const listeners = this.eventListeners.get(eventName) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Response Performance Monitoring Engine configuration updated');
  }

  /**
   * Get performance baselines
   */
  public getPerformanceBaselines(): Map<string, number> {
    return new Map(this.performanceBaselines);
  }

  /**
   * Update performance baseline
   */
  public updatePerformanceBaseline(key: string, value: number): void {
    this.performanceBaselines.set(key, value);
    console.log(`📊 Performance baseline updated: ${key} = ${value}`);
  }

  /**
   * Get execution metrics
   */
  public getExecutionMetrics(): Map<string, any> {
    return new Map(this.executionMetrics);
  }

  /**
   * Clear metrics history
   */
  public clearMetricsHistory(): void {
    this.metricsHistory = [];
    this.executionMetrics.clear();
    console.log('🧹 Metrics history cleared');
  }

  /**
   * Clear alert history
   */
  public clearAlertHistory(): void {
    this.alertHistory = [];
    this.activeAlerts.clear();
    console.log('🧹 Alert history cleared');
  }

  /**
   * Check if engine is initialized
   */
  public isEngineInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get engine statistics
   */
  public getStatistics(): {
    metricsCollected: number;
    activeAlerts: number;
    totalAlerts: number;
    averageResponseTime: number;
    overallSuccessRate: number;
    monitoringUptime: number;
  } {
    const metricsCollected = this.metricsHistory.length;
    const activeAlerts = this.activeAlerts.size;
    const totalAlerts = this.alertHistory.length + activeAlerts;
    
    const averageResponseTime = this.metricsHistory.length > 0 
      ? this.metricsHistory.reduce((sum, m) => sum + m.responseTime.average, 0) / this.metricsHistory.length
      : 0;
    
    const overallSuccessRate = this.metricsHistory.length > 0 
      ? this.metricsHistory.reduce((sum, m) => sum + m.successRate.overall, 0) / this.metricsHistory.length
      : 0;

    const monitoringUptime = this.isInitialized ? Date.now() - (this.metricsHistory[0]?.timestamp.getTime() || Date.now()) : 0;

    return {
      metricsCollected,
      activeAlerts,
      totalAlerts,
      averageResponseTime,
      overallSuccessRate,
      monitoringUptime
    };
  }

  /**
   * Get predefined monitoring configurations
   */
  public static getPredefinedMonitoringConfigs(): Record<string, MonitoringConfig> {
    return {
      'high-frequency': {
        monitoringInterval: 10000, // 10 seconds
        metricsRetention: 24 * 60 * 60 * 1000, // 24 hours
        alertThresholds: {
          responseTime: 5000, // 5 seconds
          successRate: 0.95, // 95%
          errorRate: 0.05 // 5%
        }
      },
      'standard': {
        monitoringInterval: 30000, // 30 seconds
        metricsRetention: 7 * 24 * 60 * 60 * 1000, // 7 days
        alertThresholds: {
          responseTime: 10000, // 10 seconds
          successRate: 0.90, // 90%
          errorRate: 0.10 // 10%
        }
      },
      'low-frequency': {
        monitoringInterval: 60000, // 1 minute
        metricsRetention: 30 * 24 * 60 * 60 * 1000, // 30 days
        alertThresholds: {
          responseTime: 30000, // 30 seconds
          successRate: 0.80, // 80%
          errorRate: 0.20 // 20%
        }
      }
    };
  }
}
