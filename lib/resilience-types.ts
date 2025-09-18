/**
 * Resilience Types
 * 
 * Type definitions for resilience engine and related components
 * 
 * @fileoverview Resilience system type definitions
 */

export interface ResilienceConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Delay between retries in milliseconds */
  retryDelay: number;
  /** Circuit breaker failure threshold */
  failureThreshold: number;
  /** Circuit breaker recovery timeout */
  recoveryTimeout: number;
  /** Enable adaptive response algorithms */
  enableAdaptiveResponse: boolean;
  /** Enable antifragile system features */
  enableAntifragile: boolean;
}

export interface ResilienceMetrics {
  /** Current system health score (0-100) */
  healthScore: number;
  /** Number of active failures */
  activeFailures: number;
  /** Average response time in milliseconds */
  averageResponseTime: number;
  /** Success rate percentage */
  successRate: number;
  /** Circuit breaker state */
  circuitBreakerState: 'closed' | 'open' | 'half-open';
  /** Last failure timestamp */
  lastFailureAt?: Date;
  /** Recovery attempts count */
  recoveryAttempts: number;
}

export interface AdaptiveResponseConfig {
  /** Learning rate for adaptive algorithms */
  learningRate: number;
  /** Memory size for historical data */
  memorySize: number;
  /** Confidence threshold for predictions */
  confidenceThreshold: number;
  /** Enable machine learning features */
  enableML: boolean;
}

export interface AntifragileConfig {
  /** Enable stress testing */
  enableStressTesting: boolean;
  /** Stress test frequency in minutes */
  stressTestFrequency: number;
  /** Enable margin management */
  enableMarginManagement: boolean;
  /** Margin threshold percentage */
  marginThreshold: number;
}

export interface ResilienceEvent {
  /** Event ID */
  id: string;
  /** Event type */
  type: 'failure' | 'recovery' | 'stress_test' | 'adaptation';
  /** Event severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Event timestamp */
  timestamp: Date;
  /** Event description */
  description: string;
  /** Related component or service */
  component?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

export interface StressTestResult {
  /** Test ID */
  id: string;
  /** Test timestamp */
  timestamp: Date;
  /** Test duration in milliseconds */
  duration: number;
  /** System performance under stress */
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      disk: number;
    };
  };
  /** Test outcome */
  outcome: 'passed' | 'failed' | 'degraded';
  /** Recommendations */
  recommendations: string[];
}

export interface MarginManagementMetrics {
  /** Current margin percentage */
  currentMargin: number;
  /** Target margin percentage */
  targetMargin: number;
  /** Margin trend */
  marginTrend: 'increasing' | 'decreasing' | 'stable';
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Recommended actions */
  recommendedActions: string[];
}

export interface SignalDetectionConfig {
  /** Signal detection sensitivity */
  sensitivity: number;
  /** Signal processing window size */
  windowSize: number;
  /** Enable anomaly detection */
  enableAnomalyDetection: boolean;
  /** Anomaly threshold */
  anomalyThreshold: number;
}

export interface ResponsePerformanceMetrics {
  /** Response time metrics */
  responseTime: {
    min: number;
    max: number;
    average: number;
    p95: number;
    p99: number;
  };
  /** Throughput metrics */
  throughput: {
    requestsPerSecond: number;
    peakThroughput: number;
    averageThroughput: number;
  };
  /** Error metrics */
  errors: {
    totalErrors: number;
    errorRate: number;
    errorTypes: Record<string, number>;
  };
}

export interface ResilienceEngine {
  /** Get current resilience metrics */
  getMetrics(): Promise<ResilienceMetrics>;
  /** Update resilience configuration */
  updateConfig(config: Partial<ResilienceConfig>): Promise<void>;
  /** Record a resilience event */
  recordEvent(event: Omit<ResilienceEvent, 'id' | 'timestamp'>): Promise<void>;
  /** Get resilience events */
  getEvents(filter?: Partial<ResilienceEvent>): Promise<ResilienceEvent[]>;
  /** Trigger stress test */
  runStressTest(): Promise<StressTestResult>;
  /** Get margin management metrics */
  getMarginMetrics(): Promise<MarginManagementMetrics>;
  /** Check system health */
  checkHealth(): Promise<boolean>;
  /** Recover from failure */
  recover(): Promise<void>;
}

// Core resilience types
export type ResilienceState = 'healthy' | 'degraded' | 'failed' | 'recovering';
export type ResilienceMode = 'normal' | 'adaptive' | 'antifragile' | 'emergency';
export type SignalSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ResponseActionType = 'retry' | 'fallback' | 'circuit_breaker' | 'scale';
export type AdaptiveAlgorithmType = 'exponential_backoff' | 'linear_backoff' | 'adaptive';
export type ResponseStrategyType = 'immediate' | 'delayed' | 'adaptive';
export type LearningModeType = 'supervised' | 'unsupervised' | 'reinforcement';
export type StressAdaptationType = 'immediate' | 'gradual' | 'adaptive';

export interface Signal {
  id: string;
  type: string;
  severity: SignalSeverity;
  timestamp: Date;
  data: Record<string, any>;
}

export interface MarginAllocation {
  id: string;
  component: string;
  allocatedMargin: number;
  usedMargin: number;
  availableMargin: number;
}

export interface AntifragileMetrics {
  stressLevel: number;
  adaptationRate: number;
  learningProgress: number;
  systemRobustness: number;
}

export interface StressEvent {
  id: string;
  type: string;
  intensity: number;
  duration: number;
  timestamp: Date;
}

export type ResilienceEventType = 'failure' | 'recovery' | 'stress_test' | 'adaptation';
export type ResilienceResponse = 'success' | 'failure' | 'timeout' | 'error';
export type ResilienceStatus = 'active' | 'inactive' | 'maintenance';

export interface ResilienceHealthCheck {
  component: string;
  status: ResilienceStatus;
  lastCheck: Date;
  responseTime: number;
}

export interface ComponentHealth {
  component: string;
  healthScore: number;
  status: ResilienceStatus;
  lastUpdate: Date;
}

export type MarginStrategy = 'conservative' | 'moderate' | 'aggressive';

export interface ResponseAction {
  type: ResponseActionType;
  parameters: Record<string, any>;
  priority: number;
}

export interface AdaptiveAlgorithmConfig {
  type: AdaptiveAlgorithmType;
  parameters: Record<string, any>;
  learningMode: LearningModeType;
}

export interface AdaptiveResponseResult {
  action: ResponseAction;
  confidence: number;
  reasoning: string;
}

export interface LearningEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface MachineLearningModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  lastTrained: Date;
}

// Additional types for stress testing framework
export type SignalType = 'performance' | 'error' | 'capacity' | 'security' | 'compliance';
export type SignalSource = 'system' | 'user' | 'external' | 'internal';
export type MarginType = 'time' | 'capacity' | 'material' | 'financial';
export type StressEventType = 'load' | 'failure' | 'resource' | 'network' | 'security';
export type ResponseOutcome = 'success' | 'failure' | 'partial' | 'timeout';
export type LearningType = 'supervised' | 'unsupervised' | 'reinforcement';
export type AntifragilePattern = 'redundancy' | 'diversity' | 'modularity' | 'adaptability';
export type MarginDeploymentStrategy = 'immediate' | 'gradual' | 'conditional';

export interface MarginDeployment {
  id: string;
  marginType: MarginType;
  amount: number;
  deploymentStrategy: MarginDeploymentStrategy;
  conditions: string[];
}

export type SignalIntelligenceResult = {
  confidence: number;
  recommendations: string[];
  riskLevel: SignalSeverity;
};