/**
 * Stress Testing & Validation Framework
 *
 * Comprehensive stress testing framework for the Resilience Engine
 * Tests system behavior under various stress conditions and validates
 * antifragile capabilities, margin management, and adaptive responses
 *
 * @file lib/stress-testing-framework.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  Signal,
  SignalType,
  SignalSeverity,
  SignalSource,
  ResilienceMode,
  MarginType,
  StressEvent,
  StressEventType,
  ResponseOutcome,
  LearningType,
  AntifragilePattern,
  StressAdaptationType,
  MarginAllocation,
  MarginDeployment,
  AdaptiveResponseResult,
  ResilienceState
} from './resilience-types';
import { ResilienceEngine } from './resilience-engine';
import { AntifragileSystem } from './antifragile-system';
import { AdaptiveResponseAlgorithmManager } from './adaptive-response-algorithms';
import { MarginManagementSystem } from './margin-management-system';

/**
 * Stress Test Configuration
 */
export interface StressTestConfig {
  /** Test identifier */
  id: string;
  
  /** Test name */
  name: string;
  
  /** Test description */
  description: string;
  
  /** Test duration in milliseconds */
  duration: number;
  
  /** Signal generation rate (signals per second) */
  signalRate: number;
  
  /** Stress level (0-100) */
  stressLevel: number;
  
  /** Signal types to generate */
  signalTypes: SignalType[];
  
  /** Signal severity distribution */
  severityDistribution: {
    [SignalSeverity.LOW]: number;
    [SignalSeverity.MEDIUM]: number;
    [SignalSeverity.HIGH]: number;
    [SignalSeverity.CRITICAL]: number;
  };
  
  /** Expected outcomes */
  expectedOutcomes: {
    minResilienceLevel: number;
    maxResponseTime: number;
    minAntifragileScore: number;
    maxMarginUtilization: number;
    minAdaptiveAccuracy: number;
  };
  
  /** Test parameters */
  parameters: {
    concurrentSignals: number;
    burstPatterns: boolean;
    gradualIncrease: boolean;
    recoveryTesting: boolean;
  };
}

/**
 * Stress Test Result
 */
export interface StressTestResult {
  /** Test identifier */
  testId: string;
  
  /** Test execution time */
  executionTime: number;
  
  /** Test outcome */
  outcome: 'PASS' | 'FAIL' | 'PARTIAL';
  
  /** Performance metrics */
  performance: {
    averageResponseTime: number;
    maxResponseTime: number;
    signalsProcessed: number;
    signalsPerSecond: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  
  /** Resilience metrics */
  resilience: {
    finalResilienceLevel: number;
    resilienceDegradation: number;
    recoveryTime: number;
    marginUtilization: number;
    antifragileScore: number;
  };
  
  /** System behavior */
  behavior: {
    patternsActivated: AntifragilePattern[];
    adaptationsExecuted: StressAdaptationType[];
    marginsDeployed: MarginDeployment[];
    adaptiveResponses: AdaptiveResponseResult[];
    stressEvents: StressEvent[];
  };
  
  /** Validation results */
  validation: {
    resilienceLevelValid: boolean;
    responseTimeValid: boolean;
    antifragileScoreValid: boolean;
    marginUtilizationValid: boolean;
    adaptiveAccuracyValid: boolean;
    overallValid: boolean;
  };
  
  /** Test insights */
  insights: {
    bottlenecks: string[];
    improvements: string[];
    recommendations: string[];
    lessonsLearned: string[];
  };
  
  /** Detailed logs */
  logs: StressTestLog[];
}

/**
 * Stress Test Log Entry
 */
export interface StressTestLog {
  /** Log timestamp */
  timestamp: Date;
  
  /** Log level */
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  
  /** Log message */
  message: string;
  
  /** Log context */
  context: Record<string, any>;
}

/**
 * Stress Testing Framework Class
 *
 * Provides comprehensive stress testing capabilities for the resilience engine:
 * - Signal generation and injection
 * - Performance monitoring
 * - Resilience validation
 * - Antifragile behavior testing
 * - Margin management validation
 * - Adaptive response testing
 */
export class StressTestingFramework {
  private config: StressTestConfig;
  private resilienceEngine: ResilienceEngine;
  private isRunning: boolean = false;
  private startTime: Date | null = null;
  private logs: StressTestLog[] = [];
  private signalGenerator: NodeJS.Timeout | null = null;
  private performanceMonitor: NodeJS.Timeout | null = null;

  constructor(config: StressTestConfig, resilienceEngine: ResilienceEngine) {
    this.config = config;
    this.resilienceEngine = resilienceEngine;
  }

  /**
   * Execute stress test
   */
  public async executeTest(): Promise<StressTestResult> {
    console.log(`🧪 Starting stress test: ${this.config.name}`);
    
    this.isRunning = true;
    this.startTime = new Date();
    this.logs = [];
    
    this.log('INFO', 'Stress test started', { config: this.config });

    try {
      // Initialize resilience engine
      await this.resilienceEngine.initialize();
      this.log('INFO', 'Resilience engine initialized');

      // Start performance monitoring
      this.startPerformanceMonitoring();

      // Generate stress signals
      await this.generateStressSignals();

      // Wait for test duration
      await this.waitForTestDuration();

      // Stop signal generation
      this.stopSignalGeneration();

      // Stop performance monitoring
      this.stopPerformanceMonitoring();

      // Collect results
      const result = await this.collectTestResults();

      this.log('INFO', 'Stress test completed', { outcome: result.outcome });
      
      return result;

    } catch (error) {
      this.log('ERROR', 'Stress test failed', { error: error.message });
      throw error;
    } finally {
      this.isRunning = false;
      this.cleanup();
    }
  }

  /**
   * Generate stress signals based on configuration
   */
  private async generateStressSignals(): Promise<void> {
    const signalInterval = 1000 / this.config.signalRate; // Convert to milliseconds
    let signalCount = 0;
    const totalSignals = Math.floor((this.config.duration / 1000) * this.config.signalRate);

    this.log('INFO', 'Starting signal generation', { 
      rate: this.config.signalRate, 
      interval: signalInterval,
      totalSignals 
    });

    this.signalGenerator = setInterval(async () => {
      if (!this.isRunning) return;

      const signals = this.generateSignalBatch();
      signalCount += signals.length;

      try {
        await this.resilienceEngine.processSignals(signals);
        this.log('DEBUG', 'Signals processed', { 
          batchSize: signals.length, 
          totalProcessed: signalCount 
        });
      } catch (error) {
        this.log('ERROR', 'Signal processing failed', { 
          error: error.message, 
          batchSize: signals.length 
        });
      }

      // Check if we've generated enough signals
      if (signalCount >= totalSignals) {
        this.stopSignalGeneration();
      }
    }, signalInterval);
  }

  /**
   * Generate a batch of signals for stress testing
   */
  private generateSignalBatch(): Signal[] {
    const batchSize = Math.min(
      this.config.parameters.concurrentSignals,
      Math.floor(this.config.signalRate / 10) // Generate in smaller batches
    );

    const signals: Signal[] = [];

    for (let i = 0; i < batchSize; i++) {
      const signal = this.generateSingleSignal();
      signals.push(signal);
    }

    return signals;
  }

  /**
   * Generate a single stress signal
   */
  private generateSingleSignal(): Signal {
    const signalType = this.selectRandomSignalType();
    const severity = this.selectRandomSeverity();
    const timestamp = new Date();

    return {
      id: `stress-signal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: SignalSource.SYSTEM_MONITOR,
      type: signalType,
      severity: severity,
      data: this.generateSignalData(signalType, severity),
      timestamp: timestamp,
      status: 'RECEIVED' as any,
      organisationId: 'stress-test-org',
      metadata: {
        confidence: 0.8 + Math.random() * 0.2, // 0.8-1.0
        relatedSignals: [],
        tags: ['stress-test'],
        custom: {
          stressLevel: this.config.stressLevel,
          testId: this.config.id
        }
      }
    };
  }

  /**
   * Select random signal type based on configuration
   */
  private selectRandomSignalType(): SignalType {
    const types = this.config.signalTypes;
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Select random severity based on distribution
   */
  private selectRandomSeverity(): SignalSeverity {
    const distribution = this.config.severityDistribution;
    const random = Math.random() * 100;
    
    let cumulative = 0;
    for (const [severity, percentage] of Object.entries(distribution)) {
      cumulative += percentage;
      if (random <= cumulative) {
        return severity as SignalSeverity;
      }
    }
    
    return SignalSeverity.LOW; // Fallback
  }

  /**
   * Generate signal data based on type and severity
   */
  private generateSignalData(signalType: SignalType, severity: SignalSeverity): Record<string, any> {
    const baseData: Record<string, any> = {
      testId: this.config.id,
      stressLevel: this.config.stressLevel,
      timestamp: new Date().toISOString()
    };

    switch (signalType) {
      case SignalType.ASSET_CONDITION:
        return {
          ...baseData,
          assetId: `asset-${Math.floor(Math.random() * 100)}`,
          condition: severity === SignalSeverity.CRITICAL ? 'critical' : 'degrading',
          performance: 0.3 + Math.random() * 0.7
        };

      case SignalType.PERFORMANCE_DEGRADATION:
        return {
          ...baseData,
          performance: 0.1 + Math.random() * 0.9,
          threshold: 0.8,
          degradation: severity === SignalSeverity.CRITICAL ? 0.9 : 0.5
        };

      case SignalType.RISK_ESCALATION:
        return {
          ...baseData,
          riskLevel: 0.5 + Math.random() * 0.5,
          escalation: severity === SignalSeverity.CRITICAL ? 'critical' : 'high',
          impact: severity === SignalSeverity.CRITICAL ? 'system-wide' : 'localized'
        };

      case SignalType.EMERGENCY:
        return {
          ...baseData,
          emergencyType: 'system_failure',
          priority: severity === SignalSeverity.CRITICAL ? 1 : 2,
          responseRequired: true
        };

      case SignalType.MAINTENANCE:
        return {
          ...baseData,
          maintenanceType: 'scheduled',
          duration: 60 + Math.random() * 240, // 1-5 hours
          priority: 3
        };

      case SignalType.ENVIRONMENTAL:
        return {
          ...baseData,
          temperature: 20 + Math.random() * 30,
          humidity: 30 + Math.random() * 40,
          pressure: 1000 + Math.random() * 50
        };

      case SignalType.OPERATIONAL:
        return {
          ...baseData,
          operation: 'routine',
          efficiency: 0.6 + Math.random() * 0.4,
          throughput: 100 + Math.random() * 900
        };

      case SignalType.COMPLIANCE:
        return {
          ...baseData,
          complianceType: 'safety',
          status: severity === SignalSeverity.CRITICAL ? 'violation' : 'warning',
          severity: severity
        };

      default:
        return baseData;
    }
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    this.performanceMonitor = setInterval(() => {
      if (!this.isRunning) return;

      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      this.log('DEBUG', 'Performance metrics', {
        memory: {
          rss: memoryUsage.rss,
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        }
      });
    }, 1000); // Monitor every second
  }

  /**
   * Stop performance monitoring
   */
  private stopPerformanceMonitoring(): void {
    if (this.performanceMonitor) {
      clearInterval(this.performanceMonitor);
      this.performanceMonitor = null;
    }
  }

  /**
   * Stop signal generation
   */
  private stopSignalGeneration(): void {
    if (this.signalGenerator) {
      clearInterval(this.signalGenerator);
      this.signalGenerator = null;
    }
  }

  /**
   * Wait for test duration
   */
  private waitForTestDuration(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.config.duration);
    });
  }

  /**
   * Collect test results
   */
  private async collectTestResults(): Promise<StressTestResult> {
    const endTime = new Date();
    const executionTime = endTime.getTime() - this.startTime!.getTime();

    // Get resilience engine status
    const status = this.resilienceEngine.getStatus();
    const antifragileStatus = this.resilienceEngine.getAntifragileStatus();
    const adaptiveStatus = this.resilienceEngine.getAdaptiveAlgorithmStatus();
    const marginStatus = this.resilienceEngine.getMarginManagementStatus();

    // Calculate performance metrics
    const performance = this.calculatePerformanceMetrics(executionTime);

    // Calculate resilience metrics
    const resilience = this.calculateResilienceMetrics(status, antifragileStatus, marginStatus);

    // Collect system behavior data
    const behavior = this.collectBehaviorData(antifragileStatus, adaptiveStatus, marginStatus);

    // Validate against expected outcomes
    const validation = this.validateResults(resilience, performance, adaptiveStatus);

    // Generate insights
    const insights = this.generateInsights(validation, behavior, performance);

    const result: StressTestResult = {
      testId: this.config.id,
      executionTime,
      outcome: validation.overallValid ? 'PASS' : 'FAIL',
      performance,
      resilience,
      behavior,
      validation,
      insights,
      logs: this.logs
    };

    return result;
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformanceMetrics(executionTime: number): StressTestResult['performance'] {
    const totalSignals = Math.floor((executionTime / 1000) * this.config.signalRate);
    const signalsPerSecond = totalSignals / (executionTime / 1000);
    
    // Calculate average response time from logs
    const responseTimeLogs = this.logs.filter(log => 
      log.context.responseTime !== undefined
    );
    const averageResponseTime = responseTimeLogs.length > 0
      ? responseTimeLogs.reduce((sum, log) => sum + log.context.responseTime, 0) / responseTimeLogs.length
      : 0;

    const maxResponseTime = responseTimeLogs.length > 0
      ? Math.max(...responseTimeLogs.map(log => log.context.responseTime))
      : 0;

    // Calculate error rate
    const errorLogs = this.logs.filter(log => log.level === 'ERROR');
    const errorRate = this.logs.length > 0 ? errorLogs.length / this.logs.length : 0;

    // Get memory usage
    const memoryUsage = process.memoryUsage().heapUsed;

    return {
      averageResponseTime,
      maxResponseTime,
      signalsProcessed: totalSignals,
      signalsPerSecond,
      errorRate,
      memoryUsage,
      cpuUsage: 0 // Would need more sophisticated CPU monitoring
    };
  }

  /**
   * Calculate resilience metrics
   */
  private calculateResilienceMetrics(
    status: any,
    antifragileStatus: any,
    marginStatus: any
  ): StressTestResult['resilience'] {
    const finalResilienceLevel = status.resilienceLevel || 0;
    const initialResilienceLevel = 100; // Assume starting at 100%
    const resilienceDegradation = initialResilienceLevel - finalResilienceLevel;
    
    const antifragileScore = antifragileStatus.antifragileScore || 0;
    const marginUtilization = marginStatus.allocations.reduce(
      (sum: number, allocation: MarginAllocation) => sum + allocation.utilizationRate, 0
    ) / marginStatus.allocations.length;

    return {
      finalResilienceLevel,
      resilienceDegradation,
      recoveryTime: 0, // Would need more sophisticated tracking
      marginUtilization,
      antifragileScore
    };
  }

  /**
   * Collect behavior data
   */
  private collectBehaviorData(
    antifragileStatus: any,
    adaptiveStatus: any,
    marginStatus: any
  ): StressTestResult['behavior'] {
    return {
      patternsActivated: antifragileStatus.activePatterns || [],
      adaptationsExecuted: [], // Would need to track during test
      marginsDeployed: marginStatus.activeDeployments || [],
      adaptiveResponses: [], // Would need to track during test
      stressEvents: [] // Would need to track during test
    };
  }

  /**
   * Validate results against expected outcomes
   */
  private validateResults(
    resilience: StressTestResult['resilience'],
    performance: StressTestResult['performance'],
    adaptiveStatus: any
  ): StressTestResult['validation'] {
    const expected = this.config.expectedOutcomes;

    const resilienceLevelValid = resilience.finalResilienceLevel >= expected.minResilienceLevel;
    const responseTimeValid = performance.averageResponseTime <= expected.maxResponseTime;
    const antifragileScoreValid = resilience.antifragileScore >= expected.minAntifragileScore;
    const marginUtilizationValid = resilience.marginUtilization <= expected.maxMarginUtilization;
    const adaptiveAccuracyValid = (adaptiveStatus.performanceMetrics?.accuracy || 0) >= expected.minAdaptiveAccuracy;

    const overallValid = resilienceLevelValid && 
                         responseTimeValid && 
                         antifragileScoreValid && 
                         marginUtilizationValid && 
                         adaptiveAccuracyValid;

    return {
      resilienceLevelValid,
      responseTimeValid,
      antifragileScoreValid,
      marginUtilizationValid,
      adaptiveAccuracyValid,
      overallValid
    };
  }

  /**
   * Generate insights from test results
   */
  private generateInsights(
    validation: StressTestResult['validation'],
    behavior: StressTestResult['behavior'],
    performance: StressTestResult['performance']
  ): StressTestResult['insights'] {
    const bottlenecks: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    const lessonsLearned: string[] = [];

    // Analyze bottlenecks
    if (performance.averageResponseTime > this.config.expectedOutcomes.maxResponseTime) {
      bottlenecks.push('Response time exceeds expected threshold');
    }
    if (performance.errorRate > 0.05) {
      bottlenecks.push('High error rate detected');
    }
    if (performance.memoryUsage > 100 * 1024 * 1024) { // 100MB
      bottlenecks.push('High memory usage detected');
    }

    // Generate improvements
    if (!validation.resilienceLevelValid) {
      improvements.push('Improve resilience level maintenance under stress');
    }
    if (!validation.antifragileScoreValid) {
      improvements.push('Enhance antifragile system performance');
    }
    if (!validation.marginUtilizationValid) {
      improvements.push('Optimize margin utilization');
    }

    // Generate recommendations
    if (behavior.patternsActivated.length === 0) {
      recommendations.push('Consider activating more antifragile patterns');
    }
    if (behavior.marginsDeployed.length === 0) {
      recommendations.push('Review margin deployment thresholds');
    }

    // Generate lessons learned
    lessonsLearned.push(`Processed ${performance.signalsProcessed} signals in ${performance.executionTime}ms`);
    lessonsLearned.push(`Average response time: ${performance.averageResponseTime.toFixed(2)}ms`);
    lessonsLearned.push(`Error rate: ${(performance.errorRate * 100).toFixed(2)}%`);

    return {
      bottlenecks,
      improvements,
      recommendations,
      lessonsLearned
    };
  }

  /**
   * Log test event
   */
  private log(level: StressTestLog['level'], message: string, context: Record<string, any> = {}): void {
    const logEntry: StressTestLog = {
      timestamp: new Date(),
      level,
      message,
      context
    };

    this.logs.push(logEntry);

    // Also log to console for debugging
    console.log(`[${level}] ${message}`, context);
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.stopSignalGeneration();
    this.stopPerformanceMonitoring();
    this.log('INFO', 'Stress test cleanup completed');
  }

  /**
   * Get predefined stress test configurations
   */
  public static getPredefinedTests(): StressTestConfig[] {
    return [
      {
        id: 'normal-load-test',
        name: 'Normal Load Test',
        description: 'Test system behavior under normal load conditions',
        duration: 30000, // 30 seconds
        signalRate: 10, // 10 signals per second
        stressLevel: 30,
        signalTypes: [SignalType.ASSET_CONDITION, SignalType.OPERATIONAL],
        severityDistribution: {
          [SignalSeverity.LOW]: 70,
          [SignalSeverity.MEDIUM]: 25,
          [SignalSeverity.HIGH]: 5,
          [SignalSeverity.CRITICAL]: 0
        },
        expectedOutcomes: {
          minResilienceLevel: 80,
          maxResponseTime: 1000,
          minAntifragileScore: 60,
          maxMarginUtilization: 0.3,
          minAdaptiveAccuracy: 0.7
        },
        parameters: {
          concurrentSignals: 5,
          burstPatterns: false,
          gradualIncrease: false,
          recoveryTesting: false
        }
      },
      {
        id: 'high-load-test',
        name: 'High Load Test',
        description: 'Test system behavior under high load conditions',
        duration: 60000, // 60 seconds
        signalRate: 50, // 50 signals per second
        stressLevel: 70,
        signalTypes: [SignalType.PERFORMANCE_DEGRADATION, SignalType.RISK_ESCALATION],
        severityDistribution: {
          [SignalSeverity.LOW]: 40,
          [SignalSeverity.MEDIUM]: 35,
          [SignalSeverity.HIGH]: 20,
          [SignalSeverity.CRITICAL]: 5
        },
        expectedOutcomes: {
          minResilienceLevel: 60,
          maxResponseTime: 2000,
          minAntifragileScore: 50,
          maxMarginUtilization: 0.6,
          minAdaptiveAccuracy: 0.6
        },
        parameters: {
          concurrentSignals: 20,
          burstPatterns: true,
          gradualIncrease: true,
          recoveryTesting: false
        }
      },
      {
        id: 'emergency-stress-test',
        name: 'Emergency Stress Test',
        description: 'Test system behavior under emergency conditions',
        duration: 45000, // 45 seconds
        signalRate: 100, // 100 signals per second
        stressLevel: 90,
        signalTypes: [SignalType.EMERGENCY, SignalType.ASSET_CONDITION, SignalType.RISK_ESCALATION],
        severityDistribution: {
          [SignalSeverity.LOW]: 10,
          [SignalSeverity.MEDIUM]: 20,
          [SignalSeverity.HIGH]: 30,
          [SignalSeverity.CRITICAL]: 40
        },
        expectedOutcomes: {
          minResilienceLevel: 40,
          maxResponseTime: 5000,
          minAntifragileScore: 40,
          maxMarginUtilization: 0.8,
          minAdaptiveAccuracy: 0.5
        },
        parameters: {
          concurrentSignals: 50,
          burstPatterns: true,
          gradualIncrease: false,
          recoveryTesting: true
        }
      },
      {
        id: 'antifragile-test',
        name: 'Antifragile Capability Test',
        description: 'Test antifragile system capabilities under sustained stress',
        duration: 120000, // 2 minutes
        signalRate: 30, // 30 signals per second
        stressLevel: 80,
        signalTypes: [SignalType.PERFORMANCE_DEGRADATION, SignalType.OPERATIONAL],
        severityDistribution: {
          [SignalSeverity.LOW]: 20,
          [SignalSeverity.MEDIUM]: 30,
          [SignalSeverity.HIGH]: 35,
          [SignalSeverity.CRITICAL]: 15
        },
        expectedOutcomes: {
          minResilienceLevel: 50,
          maxResponseTime: 3000,
          minAntifragileScore: 70, // Higher expectation for antifragile
          maxMarginUtilization: 0.7,
          minAdaptiveAccuracy: 0.8
        },
        parameters: {
          concurrentSignals: 15,
          burstPatterns: true,
          gradualIncrease: true,
          recoveryTesting: true
        }
      }
    ];
  }
}
