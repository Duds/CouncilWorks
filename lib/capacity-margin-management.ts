/**
 * Capacity Margin Management System
 *
 * Specialized system for managing capacity-based margins including:
 * - Surge capacity allocation and tracking
 * - Resource pool management
 * - Load balancing margins
 * - Emergency capacity deployment
 * - Capacity optimization and forecasting
 *
 * Implements F16.2: Capacity Margin Management
 *
 * @file lib/capacity-margin-management.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  MarginType,
  MarginAllocation,
  MarginDeployment,
  MarginUtilization,
  MarginThreshold,
  MarginPolicy,
  MarginEvent,
  MarginEventType,
  MarginStatus,
  MarginStrategy,
  Signal,
  SignalType,
  SignalSeverity,
  ResilienceMode,
} from '@/types/resilience';

/**
 * Capacity Resource Pool Interface
 */
export interface CapacityResourcePool {
  id: string;
  name: string;
  type: 'COMPUTATIONAL' | 'HUMAN' | 'EQUIPMENT' | 'STORAGE' | 'NETWORK';
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilizationRate: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE' | 'EMERGENCY';
  metadata: Record<string, any>;
}

/**
 * Capacity Allocation Request Interface
 */
export interface CapacityAllocationRequest {
  id: string;
  resourceType: CapacityResourcePool['type'];
  requestedCapacity: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  duration: number; // minutes
  reason: string;
  metadata: Record<string, any>;
}

/**
 * Capacity Margin Management System Class
 *
 * Manages capacity-based margins for operational resilience:
 * - Surge capacity allocation and tracking
 * - Resource pool management and optimization
 * - Load balancing and capacity distribution
 * - Emergency capacity deployment
 * - Capacity forecasting and optimization
 */
export class CapacityMarginManagementSystem {
  private config: {
    enabled: boolean;
    defaultSurgeCapacity: number; // percentage
    emergencyCapacityReserve: number; // percentage
    maxConcurrentAllocations: number;
    capacityOptimizationInterval: number; // milliseconds
    updateInterval: number;
  };

  private resourcePools: Map<string, CapacityResourcePool> = new Map();
  private capacityAllocations: Map<string, MarginAllocation> = new Map();
  private capacityDeployments: MarginDeployment[] = [];
  private utilizationHistory: MarginUtilization[] = [];
  private capacityEvents: MarginEvent[] = [];
  private thresholds: Map<string, MarginThreshold> = new Map();
  private policies: MarginPolicy[] = [];
  private optimizationInterval: NodeJS.Timeout | null = null;

  constructor(config?: Partial<CapacityMarginManagementSystem['config']>) {
    this.config = {
      enabled: true,
      defaultSurgeCapacity: 0.2, // 20% surge capacity
      emergencyCapacityReserve: 0.1, // 10% emergency reserve
      maxConcurrentAllocations: 20,
      capacityOptimizationInterval: 300000, // 5 minutes
      updateInterval: 60000, // 1 minute
      ...config,
    };
    this.initializeDefaultResourcePools();
    this.initializeDefaultThresholds();
    this.initializeDefaultPolicies();
    this.startOptimizationInterval();
    console.log(`🏗️ Capacity Margin Management System initialized.`);
  }

  /**
   * Initialize default resource pools
   */
  private initializeDefaultResourcePools(): void {
    const defaultPools: CapacityResourcePool[] = [
      {
        id: 'computational-pool',
        name: 'Computational Resources',
        type: 'COMPUTATIONAL',
        totalCapacity: 1000, // CPU cores or compute units
        allocatedCapacity: 0,
        availableCapacity: 1000,
        utilizationRate: 0,
        status: 'ACTIVE',
        metadata: { description: 'Primary computational resource pool' },
      },
      {
        id: 'human-pool',
        name: 'Human Resources',
        type: 'HUMAN',
        totalCapacity: 50, // Number of personnel
        allocatedCapacity: 0,
        availableCapacity: 50,
        utilizationRate: 0,
        status: 'ACTIVE',
        metadata: { description: 'Human resource pool for operations' },
      },
      {
        id: 'equipment-pool',
        name: 'Equipment Resources',
        type: 'EQUIPMENT',
        totalCapacity: 100, // Equipment units
        allocatedCapacity: 0,
        availableCapacity: 100,
        utilizationRate: 0,
        status: 'ACTIVE',
        metadata: { description: 'Equipment resource pool' },
      },
      {
        id: 'storage-pool',
        name: 'Storage Resources',
        type: 'STORAGE',
        totalCapacity: 10000, // GB or TB
        allocatedCapacity: 0,
        availableCapacity: 10000,
        utilizationRate: 0,
        status: 'ACTIVE',
        metadata: { description: 'Storage resource pool' },
      },
      {
        id: 'network-pool',
        name: 'Network Resources',
        type: 'NETWORK',
        totalCapacity: 1000, // Mbps or Gbps
        allocatedCapacity: 0,
        availableCapacity: 1000,
        utilizationRate: 0,
        status: 'ACTIVE',
        metadata: { description: 'Network bandwidth pool' },
      },
    ];

    defaultPools.forEach(pool => {
      this.resourcePools.set(pool.id, pool);
    });
  }

  /**
   * Initialize default capacity thresholds
   */
  private initializeDefaultThresholds(): void {
    const defaultThresholds: MarginThreshold[] = [
      {
        id: 'computational-threshold',
        marginType: MarginType.CAPACITY,
        warningThreshold: 0.7, // 70% utilization
        criticalThreshold: 0.85, // 85% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.9, // 90% utilization
        metadata: { resourceType: 'COMPUTATIONAL', description: 'Computational capacity threshold' },
      },
      {
        id: 'human-threshold',
        marginType: MarginType.CAPACITY,
        warningThreshold: 0.8, // 80% utilization
        criticalThreshold: 0.9, // 90% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.92, // 92% utilization
        metadata: { resourceType: 'HUMAN', description: 'Human resource threshold' },
      },
      {
        id: 'equipment-threshold',
        marginType: MarginType.CAPACITY,
        warningThreshold: 0.75, // 75% utilization
        criticalThreshold: 0.9, // 90% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.88, // 88% utilization
        metadata: { resourceType: 'EQUIPMENT', description: 'Equipment capacity threshold' },
      },
    ];

    defaultThresholds.forEach(threshold => {
      this.thresholds.set(threshold.id, threshold);
    });
  }

  /**
   * Initialize default capacity policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: MarginPolicy[] = [
      {
        id: 'emergency-capacity-policy',
        name: 'Emergency Capacity Policy',
        description: 'Automatically allocate emergency capacity for critical operations',
        marginType: MarginType.CAPACITY,
        conditions: [
          {
            type: 'SIGNAL',
            operator: 'EQ',
            value: SignalType.EMERGENCY,
            metadata: { description: 'Emergency signal detected' },
          },
        ],
        actions: [
          {
            type: 'ALLOCATE',
            parameters: {
              resourceType: 'COMPUTATIONAL',
              amount: 200, // Emergency computational capacity
              priority: 'CRITICAL',
              reason: 'Emergency response requirement',
            },
            metadata: { description: 'Allocate emergency computational capacity' },
          },
          {
            type: 'ALLOCATE',
            parameters: {
              resourceType: 'HUMAN',
              amount: 10, // Emergency human resources
              priority: 'CRITICAL',
              reason: 'Emergency response requirement',
            },
            metadata: { description: 'Allocate emergency human resources' },
          },
        ],
        priority: 1,
        active: true,
        metadata: { description: 'High priority emergency capacity policy' },
      },
      {
        id: 'surge-capacity-policy',
        name: 'Surge Capacity Policy',
        description: 'Allocate surge capacity for high-load operations',
        marginType: MarginType.CAPACITY,
        conditions: [
          {
            type: 'UTILIZATION',
            operator: 'GTE',
            value: 0.8,
            metadata: { description: 'High utilization detected' },
          },
        ],
        actions: [
          {
            type: 'ALLOCATE',
            parameters: {
              resourceType: 'COMPUTATIONAL',
              amount: 100, // Surge computational capacity
              priority: 'HIGH',
              reason: 'High load surge requirement',
            },
            metadata: { description: 'Allocate surge computational capacity' },
          },
        ],
        priority: 2,
        active: true,
        metadata: { description: 'Surge capacity allocation policy' },
      },
    ];

    this.policies = defaultPolicies;
  }

  /**
   * Start capacity optimization interval
   */
  private startOptimizationInterval(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }

    this.optimizationInterval = setInterval(() => {
      this.optimizeCapacityAllocation();
    }, this.config.capacityOptimizationInterval);
  }

  /**
   * Allocate capacity margin for a specific operation
   */
  public async allocateCapacityMargin(
    request: CapacityAllocationRequest
  ): Promise<MarginAllocation | null> {
    if (!this.config.enabled) {
      console.warn('Capacity margin management is disabled.');
      return null;
    }

    // Find suitable resource pool
    const pool = this.findSuitableResourcePool(request.resourceType, request.requestedCapacity);
    if (!pool) {
      console.warn(`No suitable resource pool found for ${request.resourceType} with ${request.requestedCapacity} capacity`);
      return null;
    }

    // Check if we can allocate the requested capacity
    if (request.requestedCapacity > pool.availableCapacity) {
      console.warn(`Insufficient capacity available. Required: ${request.requestedCapacity}, Available: ${pool.availableCapacity}`);
      return null;
    }

    // Check concurrent allocation limit
    if (this.capacityAllocations.size >= this.config.maxConcurrentAllocations) {
      console.warn('Maximum concurrent capacity allocations reached.');
      return null;
    }

    const allocation: MarginAllocation = {
      id: `capacity-alloc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: MarginType.CAPACITY,
      amount: request.requestedCapacity,
      utilizationRate: 0,
      allocatedAt: new Date(),
      expiresAt: new Date(Date.now() + request.duration * 60000), // Convert minutes to milliseconds
      metadata: {
        requestId: request.id,
        resourceType: request.resourceType,
        priority: request.priority,
        reason: request.reason,
        poolId: pool.id,
        allocatedBy: 'CapacityMarginManagementSystem',
      },
    };

    // Update resource pool
    pool.allocatedCapacity += request.requestedCapacity;
    pool.availableCapacity -= request.requestedCapacity;
    pool.utilizationRate = pool.allocatedCapacity / pool.totalCapacity;

    this.capacityAllocations.set(request.id, allocation);
    this.resourcePools.set(pool.id, pool);
    this.recordMarginEvent(MarginEventType.ALLOCATION, MarginType.CAPACITY, `Allocated ${request.requestedCapacity} ${request.resourceType} for ${request.reason}`);

    console.log(`🏗️ Allocated ${request.requestedCapacity} ${request.resourceType} capacity for operation ${request.id} (${request.reason})`);
    return allocation;
  }

  /**
   * Deploy capacity margin for immediate use
   */
  public async deployCapacityMargin(
    allocationId: string,
    deploymentCapacity: number,
    reason: string = 'Emergency deployment'
  ): Promise<MarginDeployment | null> {
    const allocation = Array.from(this.capacityAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Capacity allocation ${allocationId} not found.`);
      return null;
    }

    if (deploymentCapacity > allocation.amount) {
      console.warn(`Deployment capacity ${deploymentCapacity} exceeds allocated amount ${allocation.amount}`);
      return null;
    }

    const deployment: MarginDeployment = {
      id: `capacity-deploy-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      allocationId,
      deployedAt: new Date(),
      amount: deploymentCapacity,
      reason,
      status: 'ACTIVE',
      metadata: {
        deployedBy: 'CapacityMarginManagementSystem',
        originalAllocation: allocationId,
        resourceType: allocation.metadata.resourceType,
      },
    };

    this.capacityDeployments.push(deployment);
    this.recordMarginEvent(MarginEventType.DEPLOYMENT, MarginType.CAPACITY, `Deployed ${deploymentCapacity} capacity: ${reason}`);

    console.log(`🏗️ Deployed ${deploymentCapacity} capacity from allocation ${allocationId} (${reason})`);
    return deployment;
  }

  /**
   * Recover capacity margin after operation completion
   */
  public async recoverCapacityMargin(allocationId: string, reason: string = 'Operation completed'): Promise<boolean> {
    const allocation = Array.from(this.capacityAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Capacity allocation ${allocationId} not found.`);
      return false;
    }

    // Calculate utilization rate
    const utilizationRate = this.calculateUtilizationRate(allocation);
    
    // Record utilization
    const utilization: MarginUtilization = {
      id: `capacity-util-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      marginType: MarginType.CAPACITY,
      utilizationRate,
      peakUtilization: utilizationRate,
      averageUtilization: utilizationRate,
      timestamp: new Date(),
      duration: Date.now() - allocation.allocatedAt.getTime(),
      metadata: {
        allocationId,
        reason,
        resourceType: allocation.metadata.resourceType,
        recoveredBy: 'CapacityMarginManagementSystem',
      },
    };

    this.utilizationHistory.push(utilization);

    // Update resource pool
    const poolId = allocation.metadata.poolId as string;
    const pool = this.resourcePools.get(poolId);
    if (pool) {
      pool.allocatedCapacity -= allocation.amount;
      pool.availableCapacity += allocation.amount;
      pool.utilizationRate = pool.allocatedCapacity / pool.totalCapacity;
      this.resourcePools.set(poolId, pool);
    }

    // Remove allocation
    const requestId = Array.from(this.capacityAllocations.entries()).find(([_, alloc]) => alloc.id === allocationId)?.[0];
    if (requestId) {
      this.capacityAllocations.delete(requestId);
    }

    this.recordMarginEvent(MarginEventType.RECOVERY, MarginType.CAPACITY, `Recovered capacity margin: ${reason}`);

    console.log(`🏗️ Recovered capacity margin from allocation ${allocationId} (${reason})`);
    return true;
  }

  /**
   * Process signals for capacity margin management
   */
  public async processSignals(signals: Signal[]): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    for (const signal of signals) {
      await this.processSignal(signal);
    }
  }

  /**
   * Process a single signal for capacity margin management
   */
  private async processSignal(signal: Signal): Promise<void> {
    // Check policies for automatic allocation
    for (const policy of this.policies) {
      if (!policy.active || policy.marginType !== MarginType.CAPACITY) {
        continue;
      }

      if (this.evaluatePolicyConditions(policy, signal)) {
        await this.executePolicyActions(policy, signal);
      }
    }

    // Check thresholds for alerts
    this.checkThresholds(signal);
  }

  /**
   * Find suitable resource pool for allocation
   */
  private findSuitableResourcePool(
    resourceType: CapacityResourcePool['type'],
    requestedCapacity: number
  ): CapacityResourcePool | null {
    for (const pool of this.resourcePools.values()) {
      if (pool.type === resourceType && pool.availableCapacity >= requestedCapacity && pool.status === 'ACTIVE') {
        return pool;
      }
    }
    return null;
  }

  /**
   * Evaluate policy conditions against a signal
   */
  private evaluatePolicyConditions(policy: MarginPolicy, signal: Signal): boolean {
    return policy.conditions.every(condition => {
      switch (condition.type) {
        case 'SIGNAL':
          return this.evaluateSignalCondition(condition, signal);
        case 'UTILIZATION':
          return this.evaluateUtilizationCondition(condition);
        case 'TIME':
          return this.evaluateTimeCondition(condition);
        case 'RISK':
          return this.evaluateRiskCondition(condition, signal);
        default:
          return false;
      }
    });
  }

  /**
   * Evaluate signal-based policy condition
   */
  private evaluateSignalCondition(condition: MarginPolicyCondition, signal: Signal): boolean {
    const signalValue = signal.type;
    const conditionValue = condition.value as string;

    switch (condition.operator) {
      case 'EQ':
        return signalValue === conditionValue;
      case 'NE':
        return signalValue !== conditionValue;
      default:
        return false;
    }
  }

  /**
   * Evaluate utilization-based policy condition
   */
  private evaluateUtilizationCondition(condition: MarginPolicyCondition): boolean {
    const currentUtilization = this.getOverallUtilizationRate();
    const threshold = condition.value as number;

    switch (condition.operator) {
      case 'GT':
        return currentUtilization > threshold;
      case 'LT':
        return currentUtilization < threshold;
      case 'GTE':
        return currentUtilization >= threshold;
      case 'LTE':
        return currentUtilization <= threshold;
      case 'EQ':
        return Math.abs(currentUtilization - threshold) < 0.01;
      default:
        return false;
    }
  }

  /**
   * Evaluate time-based policy condition
   */
  private evaluateTimeCondition(condition: MarginPolicyCondition): boolean {
    const currentTime = new Date();
    const conditionTime = new Date(condition.value as string);

    switch (condition.operator) {
      case 'GT':
        return currentTime > conditionTime;
      case 'LT':
        return currentTime < conditionTime;
      case 'GTE':
        return currentTime >= conditionTime;
      case 'LTE':
        return currentTime <= conditionTime;
      default:
        return false;
    }
  }

  /**
   * Evaluate risk-based policy condition
   */
  private evaluateRiskCondition(condition: MarginPolicyCondition, signal: Signal): boolean {
    const riskLevel = this.calculateRiskLevel(signal);
    const threshold = condition.value as number;

    switch (condition.operator) {
      case 'GT':
        return riskLevel > threshold;
      case 'LT':
        return riskLevel < threshold;
      case 'GTE':
        return riskLevel >= threshold;
      case 'LTE':
        return riskLevel <= threshold;
      case 'EQ':
        return Math.abs(riskLevel - threshold) < 0.01;
      default:
        return false;
    }
  }

  /**
   * Execute policy actions
   */
  private async executePolicyActions(policy: MarginPolicy, signal: Signal): Promise<void> {
    for (const action of policy.actions) {
      switch (action.type) {
        case 'ALLOCATE':
          await this.executeAllocationAction(action, signal, policy);
          break;
        case 'DEPLOY':
          await this.executeDeploymentAction(action, signal);
          break;
        case 'ALERT':
          await this.executeAlertAction(action, signal);
          break;
        case 'ESCALATE':
          await this.executeEscalationAction(action, signal);
          break;
        default:
          console.warn(`Unknown policy action type: ${action.type}`);
      }
    }
  }

  /**
   * Execute allocation action
   */
  private async executeAllocationAction(action: MarginPolicyAction, signal: Signal, policy: MarginPolicy): Promise<void> {
    const resourceType = action.parameters.resourceType as CapacityResourcePool['type'];
    const amount = action.parameters.amount as number;
    const priority = action.parameters.priority as string;
    const reason = action.parameters.reason as string;

    const request: CapacityAllocationRequest = {
      id: `policy-${signal.id}`,
      resourceType,
      requestedCapacity: amount,
      priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      duration: 60, // Default 1 hour
      reason,
      metadata: { policyId: policy.id, signalId: signal.id },
    };

    await this.allocateCapacityMargin(request);
  }

  /**
   * Execute deployment action
   */
  private async executeDeploymentAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    const amount = action.parameters.amount as number;
    const reason = action.parameters.reason as string;

    // Find the most recent allocation for this signal
    const allocation = Array.from(this.capacityAllocations.values())
      .find(alloc => alloc.metadata.requestId === `policy-${signal.id}`);

    if (allocation) {
      await this.deployCapacityMargin(allocation.id, amount, reason);
    }
  }

  /**
   * Execute alert action
   */
  private async executeAlertAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`🚨 Capacity Margin Alert: ${action.parameters.message || 'Policy triggered alert'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.CAPACITY, `Alert: ${action.parameters.message}`);
  }

  /**
   * Execute escalation action
   */
  private async executeEscalationAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`📈 Capacity Margin Escalation: ${action.parameters.message || 'Policy triggered escalation'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.CAPACITY, `Escalation: ${action.parameters.message}`);
  }

  /**
   * Check thresholds and trigger alerts
   */
  private checkThresholds(signal: Signal): void {
    for (const pool of this.resourcePools.values()) {
      const threshold = Array.from(this.thresholds.values())
        .find(t => t.metadata.resourceType === pool.type);

      if (threshold) {
        if (pool.utilizationRate >= threshold.emergencyThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.CAPACITY,
            `Emergency threshold breached for ${pool.type}: ${pool.utilizationRate.toFixed(2)} >= ${threshold.emergencyThreshold}`
          );
        } else if (pool.utilizationRate >= threshold.criticalThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.CAPACITY,
            `Critical threshold breached for ${pool.type}: ${pool.utilizationRate.toFixed(2)} >= ${threshold.criticalThreshold}`
          );
        } else if (pool.utilizationRate >= threshold.warningThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.CAPACITY,
            `Warning threshold breached for ${pool.type}: ${pool.utilizationRate.toFixed(2)} >= ${threshold.warningThreshold}`
          );
        }
      }
    }
  }

  /**
   * Optimize capacity allocation
   */
  private optimizeCapacityAllocation(): void {
    if (!this.config.enabled) {
      return;
    }

    // Rebalance resource pools
    for (const pool of this.resourcePools.values()) {
      if (pool.utilizationRate < 0.3 && pool.status === 'ACTIVE') {
        // Low utilization - consider releasing some capacity
        this.recordMarginEvent(
          MarginEventType.OPTIMIZATION,
          MarginType.CAPACITY,
          `Low utilization detected for ${pool.type}: ${pool.utilizationRate.toFixed(2)}`
        );
      } else if (pool.utilizationRate > 0.9) {
        // High utilization - consider expanding capacity
        this.recordMarginEvent(
          MarginEventType.OPTIMIZATION,
          MarginType.CAPACITY,
          `High utilization detected for ${pool.type}: ${pool.utilizationRate.toFixed(2)}`
        );
      }
    }

    console.log(`🔧 Capacity optimization completed.`);
  }

  /**
   * Get overall utilization rate across all resource pools
   */
  public getOverallUtilizationRate(): number {
    let totalCapacity = 0;
    let totalAllocated = 0;

    for (const pool of this.resourcePools.values()) {
      totalCapacity += pool.totalCapacity;
      totalAllocated += pool.allocatedCapacity;
    }

    return totalCapacity > 0 ? totalAllocated / totalCapacity : 0;
  }

  /**
   * Get available capacity margin
   */
  public getAvailableCapacityMargin(): number {
    return Array.from(this.resourcePools.values())
      .reduce((sum, pool) => sum + pool.availableCapacity, 0);
  }

  /**
   * Calculate utilization rate for an allocation
   */
  private calculateUtilizationRate(allocation: MarginAllocation): number {
    const deployedAmount = this.capacityDeployments
      .filter(deploy => deploy.allocationId === allocation.id)
      .reduce((sum, deploy) => sum + deploy.amount, 0);

    return deployedAmount / allocation.amount;
  }

  /**
   * Calculate risk level for a signal
   */
  private calculateRiskLevel(signal: Signal): number {
    const severityMap = {
      [SignalSeverity.LOW]: 0.2,
      [SignalSeverity.MEDIUM]: 0.5,
      [SignalSeverity.HIGH]: 0.8,
      [SignalSeverity.CRITICAL]: 1.0,
    };

    return severityMap[signal.severity] || 0;
  }

  /**
   * Record margin event
   */
  private recordMarginEvent(type: MarginEventType, marginType: MarginType, description: string): void {
    const event: MarginEvent = {
      id: `capacity-event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      marginType,
      timestamp: new Date(),
      description,
      impact: this.calculateEventImpact(type),
      metadata: {
        recordedBy: 'CapacityMarginManagementSystem',
      },
    };

    this.capacityEvents.push(event);
  }

  /**
   * Calculate event impact score
   */
  private calculateEventImpact(type: MarginEventType): number {
    const impactMap = {
      [MarginEventType.ALLOCATION]: 0.3,
      [MarginEventType.DEPLOYMENT]: 0.5,
      [MarginEventType.RECOVERY]: 0.2,
      [MarginEventType.THRESHOLD_BREACH]: 0.7,
      [MarginEventType.POLICY_TRIGGER]: 0.4,
      [MarginEventType.OPTIMIZATION]: 0.1,
      [MarginEventType.EXHAUSTION]: 1.0,
    };

    return impactMap[type] || 0;
  }

  /**
   * Get system status
   */
  public getStatus(): {
    enabled: boolean;
    resourcePools: CapacityResourcePool[];
    totalAllocated: number;
    totalAvailable: number;
    overallUtilization: number;
    activeAllocations: number;
    activeDeployments: number;
    recentEvents: MarginEvent[];
  } {
    const totalAllocated = Array.from(this.resourcePools.values())
      .reduce((sum, pool) => sum + pool.allocatedCapacity, 0);
    
    const totalAvailable = Array.from(this.resourcePools.values())
      .reduce((sum, pool) => sum + pool.availableCapacity, 0);

    const recentEvents = this.capacityEvents
      .slice(-10)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      enabled: this.config.enabled,
      resourcePools: Array.from(this.resourcePools.values()),
      totalAllocated,
      totalAvailable,
      overallUtilization: this.getOverallUtilizationRate(),
      activeAllocations: this.capacityAllocations.size,
      activeDeployments: this.capacityDeployments.filter(deploy => deploy.status === 'ACTIVE').length,
      recentEvents,
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<CapacityMarginManagementSystem['config']>): void {
    this.config = { ...this.config, ...newConfig };
    this.startOptimizationInterval(); // Restart optimization interval
    console.log(`⚙️ Capacity Margin Management System configuration updated.`);
  }

  /**
   * Get current configuration
   */
  public getConfig(): CapacityMarginManagementSystem['config'] {
    return { ...this.config };
  }

  /**
   * Shutdown the system
   */
  public shutdown(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = null;
    }
    console.log(`🏗️ Capacity Margin Management System shut down.`);
  }
}
