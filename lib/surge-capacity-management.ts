/**
 * Surge Capacity Management System
 *
 * Specialized system for managing surge capacity including:
 * - Emergency capacity deployment
 * - Surge capacity allocation and tracking
 * - Load balancing and capacity distribution
 * - Surge capacity optimization
 * - Emergency response coordination
 *
 * Implements F16.5: Surge Capacity Management
 *
 * @file lib/surge-capacity-management.ts
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
 * Surge Capacity Pool Interface
 */
export interface SurgeCapacityPool {
  id: string;
  name: string;
  type: 'COMPUTATIONAL' | 'HUMAN' | 'EQUIPMENT' | 'STORAGE' | 'NETWORK';
  baseCapacity: number;
  surgeCapacity: number;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  surgeUtilization: number;
  status: 'NORMAL' | 'SURGE' | 'EMERGENCY' | 'MAINTENANCE' | 'OFFLINE';
  surgeThreshold: number; // percentage to trigger surge
  emergencyThreshold: number; // percentage to trigger emergency
  metadata: Record<string, any>;
}

/**
 * Surge Capacity Request Interface
 */
export interface SurgeCapacityRequest {
  id: string;
  poolId: string;
  requestedCapacity: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  duration: number; // minutes
  reason: string;
  requester: string;
  emergencyLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  metadata: Record<string, any>;
}

/**
 * Surge Capacity Management System Class
 *
 * Manages surge capacity for operational resilience:
 * - Emergency capacity deployment and coordination
 * - Surge capacity allocation and tracking
 * - Load balancing and capacity distribution
 * - Surge capacity optimization and forecasting
 * - Emergency response coordination
 */
export class SurgeCapacityManagementSystem {
  private config: {
    enabled: boolean;
    defaultSurgeThreshold: number; // percentage
    defaultEmergencyThreshold: number; // percentage
    maxConcurrentSurges: number;
    surgeCooldownPeriod: number; // minutes
    emergencyResponseTime: number; // minutes
    updateInterval: number;
  };

  private surgePools: Map<string, SurgeCapacityPool> = new Map();
  private surgeAllocations: Map<string, MarginAllocation> = new Map();
  private surgeDeployments: MarginDeployment[] = [];
  private utilizationHistory: MarginUtilization[] = [];
  private surgeEvents: MarginEvent[] = [];
  private thresholds: Map<string, MarginThreshold> = new Map();
  private policies: MarginPolicy[] = [];
  private activeSurges: Set<string> = new Set();

  constructor(config?: Partial<SurgeCapacityManagementSystem['config']>) {
    this.config = {
      enabled: true,
      defaultSurgeThreshold: 0.8, // 80% utilization triggers surge
      defaultEmergencyThreshold: 0.95, // 95% utilization triggers emergency
      maxConcurrentSurges: 5,
      surgeCooldownPeriod: 30, // 30 minutes cooldown
      emergencyResponseTime: 5, // 5 minutes emergency response
      updateInterval: 60000, // 1 minute
      ...config,
    };
    this.initializeDefaultSurgePools();
    this.initializeDefaultThresholds();
    this.initializeDefaultPolicies();
    console.log(`⚡ Surge Capacity Management System initialized.`);
  }

  /**
   * Initialize default surge capacity pools
   */
  private initializeDefaultSurgePools(): void {
    const defaultPools: SurgeCapacityPool[] = [
      {
        id: 'computational-surge-pool',
        name: 'Computational Surge Pool',
        type: 'COMPUTATIONAL',
        baseCapacity: 1000, // CPU cores
        surgeCapacity: 500, // Additional surge capacity
        totalCapacity: 1500,
        allocatedCapacity: 0,
        availableCapacity: 1500,
        surgeUtilization: 0,
        status: 'NORMAL',
        surgeThreshold: 0.8,
        emergencyThreshold: 0.95,
        metadata: { description: 'Primary computational surge pool' },
      },
      {
        id: 'human-surge-pool',
        name: 'Human Resource Surge Pool',
        type: 'HUMAN',
        baseCapacity: 50, // Personnel
        surgeCapacity: 25, // Additional surge personnel
        totalCapacity: 75,
        allocatedCapacity: 0,
        availableCapacity: 75,
        surgeUtilization: 0,
        status: 'NORMAL',
        surgeThreshold: 0.8,
        emergencyThreshold: 0.95,
        metadata: { description: 'Human resource surge pool' },
      },
      {
        id: 'equipment-surge-pool',
        name: 'Equipment Surge Pool',
        type: 'EQUIPMENT',
        baseCapacity: 100, // Equipment units
        surgeCapacity: 50, // Additional surge equipment
        totalCapacity: 150,
        allocatedCapacity: 0,
        availableCapacity: 150,
        surgeUtilization: 0,
        status: 'NORMAL',
        surgeThreshold: 0.8,
        emergencyThreshold: 0.95,
        metadata: { description: 'Equipment surge pool' },
      },
      {
        id: 'storage-surge-pool',
        name: 'Storage Surge Pool',
        type: 'STORAGE',
        baseCapacity: 10000, // GB
        surgeCapacity: 5000, // Additional surge storage
        totalCapacity: 15000,
        allocatedCapacity: 0,
        availableCapacity: 15000,
        surgeUtilization: 0,
        status: 'NORMAL',
        surgeThreshold: 0.8,
        emergencyThreshold: 0.95,
        metadata: { description: 'Storage surge pool' },
      },
      {
        id: 'network-surge-pool',
        name: 'Network Surge Pool',
        type: 'NETWORK',
        baseCapacity: 1000, // Mbps
        surgeCapacity: 500, // Additional surge bandwidth
        totalCapacity: 1500,
        allocatedCapacity: 0,
        availableCapacity: 1500,
        surgeUtilization: 0,
        status: 'NORMAL',
        surgeThreshold: 0.8,
        emergencyThreshold: 0.95,
        metadata: { description: 'Network surge pool' },
      },
    ];

    defaultPools.forEach(pool => {
      this.surgePools.set(pool.id, pool);
    });
  }

  /**
   * Initialize default surge thresholds
   */
  private initializeDefaultThresholds(): void {
    const defaultThresholds: MarginThreshold[] = [
      {
        id: 'computational-surge-threshold',
        marginType: MarginType.CAPACITY,
        warningThreshold: 0.7, // 70% utilization
        criticalThreshold: 0.85, // 85% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.9, // 90% utilization
        metadata: { resourceType: 'COMPUTATIONAL', description: 'Computational surge threshold' },
      },
      {
        id: 'human-surge-threshold',
        marginType: MarginType.CAPACITY,
        warningThreshold: 0.8, // 80% utilization
        criticalThreshold: 0.9, // 90% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.92, // 92% utilization
        metadata: { resourceType: 'HUMAN', description: 'Human resource surge threshold' },
      },
      {
        id: 'equipment-surge-threshold',
        marginType: MarginType.CAPACITY,
        warningThreshold: 0.75, // 75% utilization
        criticalThreshold: 0.9, // 90% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.88, // 88% utilization
        metadata: { resourceType: 'EQUIPMENT', description: 'Equipment surge threshold' },
      },
    ];

    defaultThresholds.forEach(threshold => {
      this.thresholds.set(threshold.id, threshold);
    });
  }

  /**
   * Initialize default surge policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: MarginPolicy[] = [
      {
        id: 'emergency-surge-policy',
        name: 'Emergency Surge Policy',
        description: 'Automatically deploy surge capacity for emergency operations',
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
              amount: 200, // Emergency computational surge
              priority: 'CRITICAL',
              reason: 'Emergency response requirement',
            },
            metadata: { description: 'Allocate emergency computational surge' },
          },
          {
            type: 'ALLOCATE',
            parameters: {
              resourceType: 'HUMAN',
              amount: 15, // Emergency human surge
              priority: 'CRITICAL',
              reason: 'Emergency response requirement',
            },
            metadata: { description: 'Allocate emergency human surge' },
          },
        ],
        priority: 1,
        active: true,
        metadata: { description: 'High priority emergency surge policy' },
      },
      {
        id: 'high-load-surge-policy',
        name: 'High Load Surge Policy',
        description: 'Deploy surge capacity for high-load operations',
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
              amount: 100, // High load computational surge
              priority: 'HIGH',
              reason: 'High load surge requirement',
            },
            metadata: { description: 'Allocate high load computational surge' },
          },
        ],
        priority: 2,
        active: true,
        metadata: { description: 'High load surge allocation policy' },
      },
    ];

    this.policies = defaultPolicies;
  }

  /**
   * Allocate surge capacity for a specific operation
   */
  public async allocateSurgeCapacity(
    request: SurgeCapacityRequest
  ): Promise<MarginAllocation | null> {
    if (!this.config.enabled) {
      console.warn('Surge capacity management is disabled.');
      return null;
    }

    const pool = this.surgePools.get(request.poolId);
    if (!pool) {
      console.warn(`Surge pool ${request.poolId} not found.`);
      return null;
    }

    // Check if we can allocate the requested capacity
    if (request.requestedCapacity > pool.availableCapacity) {
      console.warn(`Insufficient surge capacity available. Required: ${request.requestedCapacity}, Available: ${pool.availableCapacity}`);
      return null;
    }

    // Check concurrent surge limit
    if (this.activeSurges.size >= this.config.maxConcurrentSurges) {
      console.warn('Maximum concurrent surges reached.');
      return null;
    }

    // Check if pool is in cooldown period
    if (this.isPoolInCooldown(pool.id)) {
      console.warn(`Surge pool ${pool.id} is in cooldown period.`);
      return null;
    }

    const allocation: MarginAllocation = {
      id: `surge-alloc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: MarginType.CAPACITY,
      amount: request.requestedCapacity,
      utilizationRate: 0,
      allocatedAt: new Date(),
      expiresAt: new Date(Date.now() + request.duration * 60000), // Convert minutes to milliseconds
      metadata: {
        requestId: request.id,
        poolId: request.poolId,
        poolName: pool.name,
        resourceType: pool.type,
        priority: request.priority,
        reason: request.reason,
        requester: request.requester,
        emergencyLevel: request.emergencyLevel,
        allocatedBy: 'SurgeCapacityManagementSystem',
      },
    };

    // Update surge pool
    pool.allocatedCapacity += request.requestedCapacity;
    pool.availableCapacity -= request.requestedCapacity;
    pool.surgeUtilization = pool.allocatedCapacity / pool.totalCapacity;

    // Update pool status based on utilization
    this.updatePoolStatus(pool);

    this.surgeAllocations.set(request.id, allocation);
    this.surgePools.set(pool.id, pool);
    this.activeSurges.add(pool.id);
    this.recordMarginEvent(MarginEventType.ALLOCATION, MarginType.CAPACITY, `Allocated ${request.requestedCapacity} surge capacity from ${pool.name} for ${request.reason}`);

    console.log(`⚡ Allocated ${request.requestedCapacity} surge capacity from ${pool.name} for operation ${request.id} (${request.reason})`);
    return allocation;
  }

  /**
   * Deploy surge capacity for immediate use
   */
  public async deploySurgeCapacity(
    allocationId: string,
    deploymentCapacity: number,
    reason: string = 'Emergency surge deployment'
  ): Promise<MarginDeployment | null> {
    const allocation = Array.from(this.surgeAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Surge allocation ${allocationId} not found.`);
      return null;
    }

    if (deploymentCapacity > allocation.amount) {
      console.warn(`Deployment capacity ${deploymentCapacity} exceeds allocated amount ${allocation.amount}`);
      return null;
    }

    const deployment: MarginDeployment = {
      id: `surge-deploy-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      allocationId,
      deployedAt: new Date(),
      amount: deploymentCapacity,
      reason,
      status: 'ACTIVE',
      metadata: {
        deployedBy: 'SurgeCapacityManagementSystem',
        originalAllocation: allocationId,
        poolId: allocation.metadata.poolId,
        poolName: allocation.metadata.poolName,
        resourceType: allocation.metadata.resourceType,
      },
    };

    this.surgeDeployments.push(deployment);
    this.recordMarginEvent(MarginEventType.DEPLOYMENT, MarginType.CAPACITY, `Deployed ${deploymentCapacity} surge capacity: ${reason}`);

    console.log(`⚡ Deployed ${deploymentCapacity} surge capacity from allocation ${allocationId} (${reason})`);
    return deployment;
  }

  /**
   * Recover surge capacity after operation completion
   */
  public async recoverSurgeCapacity(allocationId: string, reason: string = 'Operation completed'): Promise<boolean> {
    const allocation = Array.from(this.surgeAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Surge allocation ${allocationId} not found.`);
      return false;
    }

    // Calculate utilization rate
    const utilizationRate = this.calculateUtilizationRate(allocation);
    
    // Record utilization
    const utilization: MarginUtilization = {
      id: `surge-util-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      marginType: MarginType.CAPACITY,
      utilizationRate,
      peakUtilization: utilizationRate,
      averageUtilization: utilizationRate,
      timestamp: new Date(),
      duration: Date.now() - allocation.allocatedAt.getTime(),
      metadata: {
        allocationId,
        reason,
        poolId: allocation.metadata.poolId,
        poolName: allocation.metadata.poolName,
        resourceType: allocation.metadata.resourceType,
        recoveredBy: 'SurgeCapacityManagementSystem',
      },
    };

    this.utilizationHistory.push(utilization);

    // Update surge pool
    const pool = this.surgePools.get(allocation.metadata.poolId as string);
    if (pool) {
      pool.allocatedCapacity -= allocation.amount;
      pool.availableCapacity += allocation.amount;
      pool.surgeUtilization = pool.allocatedCapacity / pool.totalCapacity;
      
      // Update pool status
      this.updatePoolStatus(pool);
      
      // Remove from active surges if utilization is low
      if (pool.surgeUtilization < 0.1) {
        this.activeSurges.delete(pool.id);
      }
      
      this.surgePools.set(pool.id, pool);
    }

    // Remove allocation
    const requestId = Array.from(this.surgeAllocations.entries()).find(([_, alloc]) => alloc.id === allocationId)?.[0];
    if (requestId) {
      this.surgeAllocations.delete(requestId);
    }

    this.recordMarginEvent(MarginEventType.RECOVERY, MarginType.CAPACITY, `Recovered surge capacity: ${reason}`);

    console.log(`⚡ Recovered surge capacity from allocation ${allocationId} (${reason})`);
    return true;
  }

  /**
   * Process signals for surge capacity management
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
   * Process a single signal for surge capacity management
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
   * Update pool status based on utilization
   */
  private updatePoolStatus(pool: SurgeCapacityPool): void {
    if (pool.surgeUtilization >= pool.emergencyThreshold) {
      pool.status = 'EMERGENCY';
    } else if (pool.surgeUtilization >= pool.surgeThreshold) {
      pool.status = 'SURGE';
    } else {
      pool.status = 'NORMAL';
    }
  }

  /**
   * Check if pool is in cooldown period
   */
  private isPoolInCooldown(poolId: string): boolean {
    // In a real system, this would check against a cooldown registry
    // For now, we'll simulate this by checking if the pool was recently used
    const recentEvents = this.surgeEvents
      .filter(event => event.metadata.poolId === poolId)
      .filter(event => Date.now() - event.timestamp.getTime() < this.config.surgeCooldownPeriod * 60000);

    return recentEvents.length > 0;
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
    const currentUtilization = this.getOverallSurgeUtilization();
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
    const resourceType = action.parameters.resourceType as SurgeCapacityPool['type'];
    const amount = action.parameters.amount as number;
    const priority = action.parameters.priority as string;
    const reason = action.parameters.reason as string;

    // Find suitable surge pool
    const pool = Array.from(this.surgePools.values())
      .find(p => p.type === resourceType && p.availableCapacity >= amount);

    if (pool) {
      const request: SurgeCapacityRequest = {
        id: `policy-${signal.id}`,
        poolId: pool.id,
        requestedCapacity: amount,
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        duration: 60, // Default 1 hour
        reason,
        requester: 'System Policy',
        emergencyLevel: signal.severity === SignalSeverity.CRITICAL ? 'CRITICAL' : 'HIGH',
        metadata: { policyId: policy.id, signalId: signal.id },
      };

      await this.allocateSurgeCapacity(request);
    }
  }

  /**
   * Execute deployment action
   */
  private async executeDeploymentAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    const amount = action.parameters.amount as number;
    const reason = action.parameters.reason as string;

    // Find the most recent allocation for this signal
    const allocation = Array.from(this.surgeAllocations.values())
      .find(alloc => alloc.metadata.requestId === `policy-${signal.id}`);

    if (allocation) {
      await this.deploySurgeCapacity(allocation.id, amount, reason);
    }
  }

  /**
   * Execute alert action
   */
  private async executeAlertAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`🚨 Surge Capacity Alert: ${action.parameters.message || 'Policy triggered alert'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.CAPACITY, `Alert: ${action.parameters.message}`);
  }

  /**
   * Execute escalation action
   */
  private async executeEscalationAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`📈 Surge Capacity Escalation: ${action.parameters.message || 'Policy triggered escalation'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.CAPACITY, `Escalation: ${action.parameters.message}`);
  }

  /**
   * Check thresholds and trigger alerts
   */
  private checkThresholds(signal: Signal): void {
    for (const pool of this.surgePools.values()) {
      const threshold = Array.from(this.thresholds.values())
        .find(t => t.metadata.resourceType === pool.type);

      if (threshold) {
        if (pool.surgeUtilization >= threshold.emergencyThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.CAPACITY,
            `Emergency threshold breached for ${pool.name}: ${pool.surgeUtilization.toFixed(2)} >= ${threshold.emergencyThreshold}`
          );
        } else if (pool.surgeUtilization >= threshold.criticalThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.CAPACITY,
            `Critical threshold breached for ${pool.name}: ${pool.surgeUtilization.toFixed(2)} >= ${threshold.criticalThreshold}`
          );
        } else if (pool.surgeUtilization >= threshold.warningThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.CAPACITY,
            `Warning threshold breached for ${pool.name}: ${pool.surgeUtilization.toFixed(2)} >= ${threshold.warningThreshold}`
          );
        }
      }
    }
  }

  /**
   * Get overall surge utilization rate across all pools
   */
  public getOverallSurgeUtilization(): number {
    let totalCapacity = 0;
    let totalAllocated = 0;

    for (const pool of this.surgePools.values()) {
      totalCapacity += pool.totalCapacity;
      totalAllocated += pool.allocatedCapacity;
    }

    return totalCapacity > 0 ? totalAllocated / totalCapacity : 0;
  }

  /**
   * Get available surge capacity margin
   */
  public getAvailableSurgeCapacity(): number {
    return Array.from(this.surgePools.values())
      .reduce((sum, pool) => sum + pool.availableCapacity, 0);
  }

  /**
   * Calculate utilization rate for an allocation
   */
  private calculateUtilizationRate(allocation: MarginAllocation): number {
    const deployedAmount = this.surgeDeployments
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
      id: `surge-event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      marginType,
      timestamp: new Date(),
      description,
      impact: this.calculateEventImpact(type),
      metadata: {
        recordedBy: 'SurgeCapacityManagementSystem',
      },
    };

    this.surgeEvents.push(event);
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
    surgePools: SurgeCapacityPool[];
    totalCapacity: number;
    totalAllocated: number;
    totalAvailable: number;
    overallSurgeUtilization: number;
    activeSurges: number;
    activeAllocations: number;
    activeDeployments: number;
    recentEvents: MarginEvent[];
  } {
    const totalCapacity = Array.from(this.surgePools.values())
      .reduce((sum, pool) => sum + pool.totalCapacity, 0);
    
    const totalAllocated = Array.from(this.surgePools.values())
      .reduce((sum, pool) => sum + pool.allocatedCapacity, 0);
    
    const totalAvailable = Array.from(this.surgePools.values())
      .reduce((sum, pool) => sum + pool.availableCapacity, 0);

    const recentEvents = this.surgeEvents
      .slice(-10)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      enabled: this.config.enabled,
      surgePools: Array.from(this.surgePools.values()),
      totalCapacity,
      totalAllocated,
      totalAvailable,
      overallSurgeUtilization: this.getOverallSurgeUtilization(),
      activeSurges: this.activeSurges.size,
      activeAllocations: this.surgeAllocations.size,
      activeDeployments: this.surgeDeployments.filter(deploy => deploy.status === 'ACTIVE').length,
      recentEvents,
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SurgeCapacityManagementSystem['config']>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Surge Capacity Management System configuration updated.`);
  }

  /**
   * Get current configuration
   */
  public getConfig(): SurgeCapacityManagementSystem['config'] {
    return { ...this.config };
  }
}
