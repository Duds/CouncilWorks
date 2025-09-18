/**
 * Multi-Source Signal Detection Engine
 *
 * This module implements comprehensive signal detection capabilities
 * from multiple sources including IoT sensors, user reports, system
 * monitoring, external APIs, environmental data, and community feedback.
 *
 * @file lib/signal-detection-engine.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  Signal,
  SignalType,
  SignalSeverity,
  SignalSource,
  SignalDetectionConfig,
  SignalDetectionStatus,
  SignalSourceType,
  ResponseAction,
  ResponseActionType
} from './resilience-types';

/**
 * Signal Detection Engine Class
 *
 * Manages multi-source signal detection with:
 * - Real-time and batch processing
 * - Signal correlation and filtering
 * - Performance monitoring and health checks
 * - Configurable detection thresholds
 */
export class SignalDetectionEngine {
  private config: SignalDetectionConfig;
  private status: SignalDetectionStatus;
  private isInitialized: boolean = false;
  private processingQueue: Signal[] = [];
  private batchProcessor: NodeJS.Timeout | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private signalHistory: Map<string, Signal[]> = new Map();
  private correlationMatrix: Map<string, Map<string, number>> = new Map();
  private lastSignalTimes: Map<string, number> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: SignalDetectionConfig) {
    this.config = config;
    this.status = this.createInitialStatus();
    this.initializeEventListeners();
  }

  /**
   * Initialize the signal detection engine
   */
  public async initialize(): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('🔍 Initializing Signal Detection Engine...');

      // Validate configuration
      this.validateConfig();

      // Initialize signal history for correlation analysis
      this.initializeSignalHistory();

      // Start batch processing if enabled
      if (!this.config.processing.realTimeProcessing) {
        this.startBatchProcessing();
      }

      // Start health monitoring
      this.startHealthMonitoring();

      // Initialize correlation matrix
      this.initializeCorrelationMatrix();

      this.isInitialized = true;
      this.status.status = 'ACTIVE';
      this.status.lastHealthCheck = new Date();

      console.log('✅ Signal Detection Engine initialized successfully');
      this.emitEvent('initialized', { config: this.config });

      return {
        success: true,
        data: {
          engineId: this.status.engineId,
          sources: this.config.sources,
          processingMode: this.config.processing.realTimeProcessing ? 'real-time' : 'batch'
        }
      };
    } catch (error: any) {
      console.error('❌ Failed to initialize Signal Detection Engine:', error);
      this.status.status = 'ERROR';
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Shutdown the signal detection engine
   */
  public async shutdown(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Shutting down Signal Detection Engine...');

      // Stop batch processing
      if (this.batchProcessor) {
        clearInterval(this.batchProcessor);
        this.batchProcessor = null;
      }

      // Stop health monitoring
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }

      // Process remaining signals in queue
      if (this.processingQueue.length > 0) {
        console.log(`📡 Processing ${this.processingQueue.length} remaining signals...`);
        await this.processSignalBatch(this.processingQueue);
        this.processingQueue = [];
      }

      this.isInitialized = false;
      this.status.status = 'INACTIVE';

      console.log('✅ Signal Detection Engine shutdown completed');
      this.emitEvent('shutdown', { finalStatus: this.status });

      return { success: true };
    } catch (error: any) {
      console.error('❌ Failed to shutdown Signal Detection Engine:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Detect and process signals from various sources
   */
  public async detectSignals(signals: Signal[]): Promise<{
    success: boolean;
    processed: number;
    filtered: number;
    errors: string[];
    results: Signal[];
  }> {
    if (!this.isInitialized) {
      return {
        success: false,
        processed: 0,
        filtered: 0,
        errors: ['Signal Detection Engine not initialized'],
        results: []
      };
    }

    const startTime = Date.now();
    let processedCount = 0;
    let filteredCount = 0;
    const errors: string[] = [];
    const results: Signal[] = [];

    try {
      console.log(`🔍 Detecting ${signals.length} signals...`);

      // Filter signals based on configuration
      const filteredSignals = this.filterSignals(signals);
      filteredCount = signals.length - filteredSignals.length;

      // Process signals based on mode
      if (this.config.processing.realTimeProcessing) {
        // Real-time processing
        for (const signal of filteredSignals) {
          try {
            const processedSignal = await this.processSignal(signal);
            if (processedSignal) {
              results.push(processedSignal);
              processedCount++;
            }
          } catch (error: any) {
            errors.push(`Failed to process signal ${signal.id}: ${error.message}`);
          }
        }
      } else {
        // Batch processing - add to queue
        this.processingQueue.push(...filteredSignals);
        processedCount = filteredSignals.length;
      }

      // Update statistics
      this.updateStatistics(processedCount, Date.now() - startTime);

      // Update last signal detected time
      if (filteredSignals.length > 0) {
        this.status.lastSignalDetected = new Date();
      }

      console.log(`✅ Processed ${processedCount} signals, filtered ${filteredCount}`);

      return {
        success: true,
        processed: processedCount,
        filtered: filteredCount,
        errors,
        results
      };
    } catch (error: any) {
      console.error('❌ Signal detection failed:', error);
      return {
        success: false,
        processed: processedCount,
        filtered: filteredCount,
        errors: [...errors, error.message],
        results
      };
    }
  }

  /**
   * Process a single signal
   */
  private async processSignal(signal: Signal): Promise<Signal | null> {
    try {
      // Check frequency limits
      if (!this.checkFrequencyLimits(signal)) {
        console.log(`⚠️ Signal ${signal.id} filtered due to frequency limits`);
        return null;
      }

      // Enhance signal with detection metadata
      const enhancedSignal = this.enhanceSignal(signal);

      // Perform correlation analysis if enabled
      if (this.config.processing.enableCorrelation) {
        this.updateCorrelationMatrix(enhancedSignal);
      }

      // Store in signal history
      this.storeSignalHistory(enhancedSignal);

      // Emit signal detected event
      this.emitEvent('signalDetected', { signal: enhancedSignal });

      return enhancedSignal;
    } catch (error: any) {
      console.error(`❌ Failed to process signal ${signal.id}:`, error);
      throw error;
    }
  }

  /**
   * Process a batch of signals
   */
  private async processSignalBatch(signals: Signal[]): Promise<void> {
    const startTime = Date.now();
    let processedCount = 0;

    try {
      console.log(`📦 Processing batch of ${signals.length} signals...`);

      for (const signal of signals) {
        try {
          await this.processSignal(signal);
          processedCount++;
        } catch (error: any) {
          console.error(`❌ Failed to process signal ${signal.id}:`, error);
        }
      }

      const processingTime = Date.now() - startTime;
      console.log(`✅ Batch processing completed: ${processedCount}/${signals.length} signals in ${processingTime}ms`);

      // Update statistics
      this.updateStatistics(processedCount, processingTime);
    } catch (error: any) {
      console.error('❌ Batch processing failed:', error);
    }
  }

  /**
   * Filter signals based on configuration
   */
  private filterSignals(signals: Signal[]): Signal[] {
    return signals.filter(signal => {
      // Check signal type filters
      if (this.config.filters.includeTypes.length > 0 && 
          !this.config.filters.includeTypes.includes(signal.type)) {
        return false;
      }

      if (this.config.filters.excludeTypes.includes(signal.type)) {
        return false;
      }

      // Check severity filter
      if (this.getSeverityLevel(signal.severity) < this.getSeverityLevel(this.config.filters.minSeverity)) {
        return false;
      }

      // Check asset category filter
      if (this.config.filters.assetCategories.length > 0 && 
          signal.assetId && 
          !this.config.filters.assetCategories.includes(signal.assetId)) {
        return false;
      }

      // Check signal strength threshold
      if (signal.strength < this.config.thresholds.minStrength) {
        return false;
      }

      return true;
    });
  }

  /**
   * Check frequency limits for signal
   */
  private checkFrequencyLimits(signal: Signal): boolean {
    const signalKey = `${signal.type}-${signal.assetId || 'global'}`;
    const now = Date.now();
    const lastTime = this.lastSignalTimes.get(signalKey) || 0;
    const timeDiff = now - lastTime;
    const minInterval = 1000 / this.config.thresholds.maxFrequency; // Convert to milliseconds

    if (timeDiff < minInterval) {
      return false; // Too frequent
    }

    this.lastSignalTimes.set(signalKey, now);
    return true;
  }

  /**
   * Enhance signal with detection metadata
   */
  private enhanceSignal(signal: Signal): Signal {
    return {
      ...signal,
      metadata: {
        ...signal.metadata,
        detection: {
          detectedAt: new Date(),
          detectionEngine: this.status.engineId,
          processingMode: this.config.processing.realTimeProcessing ? 'real-time' : 'batch',
          correlationScore: this.calculateCorrelationScore(signal),
          confidence: this.calculateDetectionConfidence(signal)
        }
      }
    };
  }

  /**
   * Calculate correlation score for signal
   */
  private calculateCorrelationScore(signal: Signal): number {
    const signalKey = `${signal.type}-${signal.assetId || 'global'}`;
    const correlations = this.correlationMatrix.get(signalKey);
    
    if (!correlations || correlations.size === 0) {
      return 0;
    }

    // Calculate average correlation with other signals
    let totalCorrelation = 0;
    let correlationCount = 0;

    for (const [otherKey, correlation] of correlations) {
      if (otherKey !== signalKey) {
        totalCorrelation += correlation;
        correlationCount++;
      }
    }

    return correlationCount > 0 ? totalCorrelation / correlationCount : 0;
  }

  /**
   * Calculate detection confidence for signal
   */
  private calculateDetectionConfidence(signal: Signal): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on signal strength
    confidence += (signal.strength / 100) * 0.3;

    // Increase confidence based on severity
    const severityMultiplier = this.getSeverityLevel(signal.severity) / 4;
    confidence += severityMultiplier * 0.2;

    // Increase confidence if signal has historical correlation
    const correlationScore = this.calculateCorrelationScore(signal);
    confidence += correlationScore * 0.2;

    return Math.min(1, Math.max(0, confidence));
  }

  /**
   * Update correlation matrix with new signal
   */
  private updateCorrelationMatrix(signal: Signal): void {
    const signalKey = `${signal.type}-${signal.assetId || 'global'}`;
    
    if (!this.correlationMatrix.has(signalKey)) {
      this.correlationMatrix.set(signalKey, new Map());
    }

    const signalCorrelations = this.correlationMatrix.get(signalKey)!;

    // Calculate correlations with recent signals
    const recentSignals = this.getRecentSignals(1000 * 60 * 5); // Last 5 minutes
    for (const recentSignal of recentSignals) {
      const otherKey = `${recentSignal.type}-${recentSignal.assetId || 'global'}`;
      if (otherKey !== signalKey) {
        const correlation = this.calculateSignalCorrelation(signal, recentSignal);
        signalCorrelations.set(otherKey, correlation);
      }
    }
  }

  /**
   * Calculate correlation between two signals
   */
  private calculateSignalCorrelation(signal1: Signal, signal2: Signal): number {
    // Simple correlation based on signal properties
    let correlation = 0;

    // Same signal type increases correlation
    if (signal1.type === signal2.type) {
      correlation += 0.3;
    }

    // Same asset increases correlation
    if (signal1.assetId === signal2.assetId) {
      correlation += 0.4;
    }

    // Similar severity increases correlation
    const severityDiff = Math.abs(this.getSeverityLevel(signal1.severity) - this.getSeverityLevel(signal2.severity));
    correlation += (1 - severityDiff / 4) * 0.2;

    // Time proximity increases correlation
    const timeDiff = Math.abs(signal1.timestamp.getTime() - signal2.timestamp.getTime());
    const timeCorrelation = Math.max(0, 1 - timeDiff / (1000 * 60 * 10)); // 10 minutes window
    correlation += timeCorrelation * 0.1;

    return Math.min(1, correlation);
  }

  /**
   * Store signal in history
   */
  private storeSignalHistory(signal: Signal): void {
    const signalKey = `${signal.type}-${signal.assetId || 'global'}`;
    
    if (!this.signalHistory.has(signalKey)) {
      this.signalHistory.set(signalKey, []);
    }

    const history = this.signalHistory.get(signalKey)!;
    history.push(signal);

    // Keep only recent signals (last hour)
    const cutoffTime = Date.now() - (1000 * 60 * 60);
    const filteredHistory = history.filter(s => s.timestamp.getTime() > cutoffTime);
    this.signalHistory.set(signalKey, filteredHistory);
  }

  /**
   * Get recent signals within time window
   */
  private getRecentSignals(timeWindowMs: number): Signal[] {
    const cutoffTime = Date.now() - timeWindowMs;
    const recentSignals: Signal[] = [];

    for (const history of this.signalHistory.values()) {
      recentSignals.push(...history.filter(s => s.timestamp.getTime() > cutoffTime));
    }

    return recentSignals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Start batch processing
   */
  private startBatchProcessing(): void {
    if (this.batchProcessor) {
      clearInterval(this.batchProcessor);
    }

    this.batchProcessor = setInterval(async () => {
      if (this.processingQueue.length > 0) {
        const batchSize = Math.min(
          this.processingQueue.length,
          this.config.processing.maxBatchSize
        );
        const batch = this.processingQueue.splice(0, batchSize);
        await this.processSignalBatch(batch);
      }
    }, this.config.processing.batchInterval);
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }

  /**
   * Perform health check
   */
  private performHealthCheck(): void {
    try {
      // Update health metrics
      this.status.health = {
        cpuUsage: this.getCpuUsage(),
        memoryUsage: this.getMemoryUsage(),
        diskUsage: this.getDiskUsage(),
        networkLatency: this.getNetworkLatency()
      };

      this.status.lastHealthCheck = new Date();

      // Check for health issues
      if (this.status.health.cpuUsage > 90 || this.status.health.memoryUsage > 90) {
        console.warn('⚠️ Signal Detection Engine health warning: High resource usage');
        this.emitEvent('healthWarning', { health: this.status.health });
      }

      // Emit health check event
      this.emitEvent('healthCheck', { health: this.status.health });
    } catch (error: any) {
      console.error('❌ Health check failed:', error);
    }
  }

  /**
   * Update statistics
   */
  private updateStatistics(processedCount: number, processingTime: number): void {
    this.status.statistics.totalDetected += processedCount;
    this.status.statistics.lastHour += processedCount;
    this.status.statistics.lastDay += processedCount;

    // Update average processing time
    const totalProcessed = this.status.statistics.totalDetected;
    const currentAvg = this.status.statistics.avgProcessingTime;
    this.status.statistics.avgProcessingTime = 
      (currentAvg * (totalProcessed - processedCount) + processingTime) / totalProcessed;
  }

  /**
   * Initialize signal history
   */
  private initializeSignalHistory(): void {
    // Initialize empty history for each signal source
    for (const source of this.config.sources) {
      const sourceKey = `source-${source}`;
      this.signalHistory.set(sourceKey, []);
    }
  }

  /**
   * Initialize correlation matrix
   */
  private initializeCorrelationMatrix(): void {
    // Initialize correlation matrix for signal types
    const signalTypes = Object.values(SignalType);
    for (const type of signalTypes) {
      const typeKey = `type-${type}`;
      this.correlationMatrix.set(typeKey, new Map());
    }
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.eventListeners.set('signalDetected', []);
    this.eventListeners.set('healthCheck', []);
    this.eventListeners.set('healthWarning', []);
    this.eventListeners.set('initialized', []);
    this.eventListeners.set('shutdown', []);
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
   * Create initial status
   */
  private createInitialStatus(): SignalDetectionStatus {
    return {
      engineId: `signal-detection-${Date.now()}`,
      name: this.config.name,
      status: 'INACTIVE',
      statistics: {
        totalDetected: 0,
        lastHour: 0,
        lastDay: 0,
        avgProcessingTime: 0,
        errorRate: 0
      },
      activeSources: this.config.sources,
      lastSignalDetected: null,
      config: this.config,
      health: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkLatency: 0
      },
      lastHealthCheck: new Date()
    };
  }

  /**
   * Validate configuration
   */
  private validateConfig(): void {
    if (!this.config.id || !this.config.name) {
      throw new Error('Invalid configuration: missing required fields');
    }

    if (this.config.sources.length === 0) {
      throw new Error('Invalid configuration: no signal sources specified');
    }

    if (this.config.thresholds.minStrength < 0 || this.config.thresholds.minStrength > 100) {
      throw new Error('Invalid configuration: minStrength must be between 0 and 100');
    }

    if (this.config.thresholds.maxFrequency <= 0) {
      throw new Error('Invalid configuration: maxFrequency must be greater than 0');
    }
  }

  /**
   * Get severity level as number
   */
  private getSeverityLevel(severity: SignalSeverity): number {
    switch (severity) {
      case SignalSeverity.LOW: return 1;
      case SignalSeverity.MEDIUM: return 2;
      case SignalSeverity.HIGH: return 3;
      case SignalSeverity.CRITICAL: return 4;
      default: return 0;
    }
  }

  /**
   * Get CPU usage percentage (simulated)
   */
  private getCpuUsage(): number {
    return Math.random() * 100;
  }

  /**
   * Get memory usage percentage (simulated)
   */
  private getMemoryUsage(): number {
    return Math.random() * 100;
  }

  /**
   * Get disk usage percentage (simulated)
   */
  private getDiskUsage(): number {
    return Math.random() * 100;
  }

  /**
   * Get network latency in milliseconds (simulated)
   */
  private getNetworkLatency(): number {
    return Math.random() * 100;
  }

  // Public API methods

  /**
   * Get current engine status
   */
  public getStatus(): SignalDetectionStatus {
    return { ...this.status };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SignalDetectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.status.config = this.config;
    console.log('⚙️ Signal Detection Engine configuration updated');
  }

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
   * Get signal history for analysis
   */
  public getSignalHistory(signalKey?: string): Map<string, Signal[]> {
    if (signalKey) {
      const history = this.signalHistory.get(signalKey);
      return history ? new Map([[signalKey, history]]) : new Map();
    }
    return new Map(this.signalHistory);
  }

  /**
   * Get correlation matrix
   */
  public getCorrelationMatrix(): Map<string, Map<string, number>> {
    return new Map(this.correlationMatrix);
  }

  /**
   * Clear signal history
   */
  public clearSignalHistory(): void {
    this.signalHistory.clear();
    this.correlationMatrix.clear();
    this.lastSignalTimes.clear();
    console.log('🧹 Signal history cleared');
  }

  /**
   * Check if engine is initialized
   */
  public isEngineInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get processing queue status
   */
  public getQueueStatus(): { queueLength: number; processingMode: string } {
    return {
      queueLength: this.processingQueue.length,
      processingMode: this.config.processing.realTimeProcessing ? 'real-time' : 'batch'
    };
  }
}
