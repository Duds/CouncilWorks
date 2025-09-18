/**
 * Resilience Types
 * 
 * Type definitions for resilience engine and related components
 * 
 * @fileoverview Resilience system type definitions
 */

export enum SignalType {
  ASSET_CONDITION = 'ASSET_CONDITION',
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
  RISK_ESCALATION = 'RISK_ESCALATION',
  EMERGENCY = 'EMERGENCY',
  MAINTENANCE = 'MAINTENANCE',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  OPERATIONAL = 'OPERATIONAL',
  COMPLIANCE = 'COMPLIANCE',
  OTHER = 'OTHER'
}

export enum SignalSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum SignalSource {
  IOT_SENSOR = 'IOT_SENSOR',
  USER_REPORT = 'USER_REPORT',
  SYSTEM_MONITOR = 'SYSTEM_MONITOR',
  EXTERNAL_API = 'EXTERNAL_API',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  MAINTENANCE = 'MAINTENANCE',
  COMMUNITY = 'COMMUNITY',
  PREDICTIVE = 'PREDICTIVE'
}

export enum ResilienceMode {
  NORMAL = 'NORMAL',
  ELEVATED = 'ELEVATED',
  EMERGENCY = 'EMERGENCY',
  HIGH_STRESS = 'HIGH_STRESS',
  RECOVERY = 'RECOVERY',
  MAINTENANCE = 'MAINTENANCE',
  ANTIFRAGILE = 'ANTIFRAGILE'
}

export enum MarginType {
  CAPACITY = 'CAPACITY',
  TIME = 'TIME',
  MATERIAL = 'MATERIAL',
  FINANCIAL = 'FINANCIAL',
  HUMAN = 'HUMAN',
  COMPUTATIONAL = 'COMPUTATIONAL'
}

export enum StressEventType {
  LOAD_SPIKE = 'LOAD_SPIKE',
  RESOURCE_EXHAUSTION = 'RESOURCE_EXHAUSTION',
  FAILURE_CASCADE = 'FAILURE_CASCADE',
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
  EXTERNAL_THREAT = 'EXTERNAL_THREAT',
  SYSTEM_OVERLOAD = 'SYSTEM_OVERLOAD'
}

export enum ResponseOutcome {
  SUCCESS = 'SUCCESS',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
  FAILURE = 'FAILURE',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED'
}

export enum LearningType {
  REINFORCEMENT = 'REINFORCEMENT',
  SUPERVISED = 'SUPERVISED',
  UNSUPERVISED = 'UNSUPERVISED',
  TRANSFER = 'TRANSFER',
  META = 'META'
}

export enum AntifragilePattern {
  REDUNDANCY = 'REDUNDANCY',
  DIVERSITY = 'DIVERSITY',
  MODULARITY = 'MODULARITY',
  ADAPTATION = 'ADAPTATION',
  LEARNING = 'LEARNING',
  EVOLUTION = 'EVOLUTION'
}

export enum StressAdaptationType {
  SCALING = 'SCALING',
  ROUTING = 'ROUTING',
  CACHING = 'CACHING',
  THROTTLING = 'THROTTLING',
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER',
  GRACEFUL_DEGRADATION = 'GRACEFUL_DEGRADATION'
}

export interface StressEvent {
  id: string;
  type: StressEventType;
  severity: SignalSeverity;
  timestamp: Date;
  description: string;
  impact: number;
  duration: number;
  resolved: boolean;
  metadata: Record<string, any>;
}

export interface MarginAllocation {
  id: string;
  type: MarginType;
  amount: number;
  utilizationRate: number;
  allocatedAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
}

export interface MarginDeployment {
  id: string;
  allocationId: string;
  deployedAt: Date;
  amount: number;
  reason: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  metadata: Record<string, any>;
}

export interface AdaptiveResponseResult {
  id: string;
  algorithm: string;
  input: Record<string, any>;
  output: Record<string, any>;
  confidence: number;
  executionTime: number;
  timestamp: Date;
  success: boolean;
  metadata: Record<string, any>;
}

export interface Signal {
  id: string;
  type: SignalType;
  severity: SignalSeverity;
  source: SignalSource;
  timestamp: Date;
  assetId?: string;
  description: string;
  data: Record<string, any>;
  correlationId?: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED';
  acknowledged: boolean;
  resolved: boolean;
  metadata: Record<string, any>;
}

export interface ResilienceState {
  mode: ResilienceMode;
  healthScore: number;
  stressLevel: number;
  marginUtilization: number;
  antifragileScore: number;
  lastUpdated: Date;
  metadata: Record<string, any>;
}

// E16: Margin Management & Antifragile Operations Types

export enum MarginStrategy {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
  ADAPTIVE = 'ADAPTIVE',
  ANTIFRAGILE = 'ANTIFRAGILE'
}

export enum MarginStatus {
  AVAILABLE = 'AVAILABLE',
  ALLOCATED = 'ALLOCATED',
  DEPLOYED = 'DEPLOYED',
  EXHAUSTED = 'EXHAUSTED',
  RECOVERING = 'RECOVERING'
}

export interface MarginUtilization {
  id: string;
  marginType: MarginType;
  utilizationRate: number;
  peakUtilization: number;
  averageUtilization: number;
  timestamp: Date;
  duration: number;
  metadata: Record<string, any>;
}

export interface MarginThreshold {
  id: string;
  marginType: MarginType;
  warningThreshold: number;
  criticalThreshold: number;
  emergencyThreshold: number;
  autoDeployThreshold: number;
  metadata: Record<string, any>;
}

export interface MarginPolicy {
  id: string;
  name: string;
  description: string;
  marginType: MarginType;
  conditions: MarginPolicyCondition[];
  actions: MarginPolicyAction[];
  priority: number;
  active: boolean;
  metadata: Record<string, any>;
}

export interface MarginPolicyCondition {
  type: 'UTILIZATION' | 'SIGNAL' | 'TIME' | 'RISK';
  operator: 'GT' | 'LT' | 'EQ' | 'GTE' | 'LTE';
  value: number | string;
  metadata: Record<string, any>;
}

export interface MarginPolicyAction {
  type: 'ALLOCATE' | 'DEPLOY' | 'RECOVER' | 'ALERT' | 'ESCALATE';
  parameters: Record<string, any>;
  metadata: Record<string, any>;
}

export enum MarginEventType {
  ALLOCATION = 'ALLOCATION',
  DEPLOYMENT = 'DEPLOYMENT',
  RECOVERY = 'RECOVERY',
  THRESHOLD_BREACH = 'THRESHOLD_BREACH',
  POLICY_TRIGGER = 'POLICY_TRIGGER',
  OPTIMIZATION = 'OPTIMIZATION',
  EXHAUSTION = 'EXHAUSTION'
}

export interface MarginEvent {
  id: string;
  type: MarginEventType;
  marginType: MarginType;
  timestamp: Date;
  description: string;
  impact: number;
  metadata: Record<string, any>;
}

export interface MarginConfiguration {
  enabled: boolean;
  defaultStrategy: MarginStrategy;
  marginTypes: MarginType[];
  defaultThresholds: MarginThreshold[];
  defaultPolicies: MarginPolicy[];
  updateInterval: number;
  retentionPeriod: number;
  metadata: Record<string, any>;
}

export interface MarginMetrics {
  id: string;
  timestamp: Date;
  marginType: MarginType;
  totalAllocated: number;
  totalDeployed: number;
  utilizationRate: number;
  efficiency: number;
  cost: number;
  effectiveness: number;
  metadata: Record<string, any>;
}

export interface MarginForecast {
  id: string;
  marginType: MarginType;
  timeHorizon: number;
  predictedUtilization: number[];
  confidence: number;
  recommendations: MarginRecommendation[];
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface MarginRecommendation {
  id: string;
  type: 'ALLOCATE' | 'DEPLOY' | 'RECOVER' | 'OPTIMIZE';
  marginType: MarginType;
  amount: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  expectedBenefit: number;
  confidence: number;
  metadata: Record<string, any>;
}

// E17: Function-Based Asset Organization Types

export enum AssetFunctionType {
  TRANSPORTATION = 'TRANSPORTATION',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  UTILITIES = 'UTILITIES',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  SAFETY = 'SAFETY',
  COMMUNICATION = 'COMMUNICATION',
  WASTE_MANAGEMENT = 'WASTE_MANAGEMENT',
  RECREATION = 'RECREATION',
  EMERGENCY_SERVICES = 'EMERGENCY_SERVICES',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER'
}

export enum AssetPurposeCategory {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  SUPPORT = 'SUPPORT',
  BACKUP = 'BACKUP',
  EMERGENCY = 'EMERGENCY',
  MAINTENANCE = 'MAINTENANCE'
}

export enum OrganizationViewType {
  FUNCTIONAL = 'FUNCTIONAL',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  COMPLIANCE = 'COMPLIANCE',
  RISK = 'RISK',
  LOCATION = 'LOCATION',
  HIERARCHICAL = 'HIERARCHICAL'
}

export interface AssetFunction {
  id: string;
  name: string;
  description: string;
  functionType: AssetFunctionType;
  category: AssetPurposeCategory;
  priority: number;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface AssetPurpose {
  id: string;
  assetId: string;
  functionId: string;
  purpose: string;
  description: string;
  category: AssetPurposeCategory;
  priority: number;
  isPrimary: boolean;
  valueContribution: number;
  metadata: Record<string, any>;
}

export interface FunctionHierarchy {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  children: string[];
  functionType: AssetFunctionType;
  level: number;
  path: string[];
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface AssetOrganizationView {
  id: string;
  name: string;
  description: string;
  viewType: OrganizationViewType;
  filters: Record<string, any>;
  grouping: string[];
  sorting: string[];
  isDefault: boolean;
  metadata: Record<string, any>;
}

export interface AssetDiscoveryQuery {
  id: string;
  name: string;
  description: string;
  functionTypes: AssetFunctionType[];
  purposeCategories: AssetPurposeCategory[];
  filters: Record<string, any>;
  searchTerms: string[];
  metadata: Record<string, any>;
}

export interface PurposeAlignmentMetrics {
  id: string;
  timestamp: Date;
  totalAssets: number;
  assetsWithPurpose: number;
  purposeAlignmentRate: number;
  functionCoverage: Record<AssetFunctionType, number>;
  categoryDistribution: Record<AssetPurposeCategory, number>;
  orphanedAssets: string[];
  recommendations: string[];
  metadata: Record<string, any>;
}

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