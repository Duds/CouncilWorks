/**
 * Time Margin Management System
 *
 * Specialized system for managing time-based margins including:
 * - Buffer time allocation and tracking
 * - Schedule slack management
 * - Emergency response time margins
 * - Maintenance window buffers
 * - Project timeline margins
 *
 * Implements F16.1: Time Margin Management
 *
 * @file lib/time-margin-management.ts
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
 * Time Margin Management System Class
 *
 * Manages time-based margins for operational resilience:
 * - Buffer time allocation for critical operations
 * - Schedule slack management for maintenance windows
 * - Emergency response time margins
 * - Project timeline buffer management
 * - Time margin optimization and forecasting
 */
export class TimeMarginManagementSystem {
  private config: {
    enabled: boolean;
    defaultBufferTime: number; // minutes
    emergencyResponseTime: number; // minutes
    maintenanceWindowBuffer: number; // minutes
    projectTimelineBuffer: number; // percentage
    maxConcurrentAllocations: number;
    updateInterval: number;
  };

  private timeAllocations: Map<string, MarginAllocation> = new Map();
  private timeDeployments: MarginDeployment[] = [];
  private utilizationHistory: MarginUtilization[] = [];
  private timeEvents: MarginEvent[] = [];
  private thresholds: Map<string, MarginThreshold> = new Map();
  private policies: MarginPolicy[] = [];

  constructor(config?: Partial<TimeMarginManagementSystem['config']>) {
    this.config = {
      enabled: true,
      defaultBufferTime: 30, // 30 minutes default buffer
      emergencyResponseTime: 15, // 15 minutes emergency response
      maintenanceWindowBuffer: 60, // 1 hour maintenance buffer
      projectTimelineBuffer: 0.2, // 20% project timeline buffer
      maxConcurrentAllocations: 10,
      updateInterval: 300000, // 5 minutes
      ...config,
    };
    this.initializeDefaultThresholds();
    this.initializeDefaultPolicies();
    console.log(`⏰ Time Margin Management System initialized.`);
  }

  /**
   * Initialize default time margin thresholds
   */
  private initializeDefaultThresholds(): void {
    const defaultThresholds: MarginThreshold[] = [
      {
        id: 'buffer-time-threshold',
        marginType: MarginType.TIME,
        warningThreshold: 0.7, // 70% utilization
        criticalThreshold: 0.85, // 85% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.9, // 90% utilization
        metadata: { description: 'Buffer time utilization threshold' },
      },
      {
        id: 'emergency-response-threshold',
        marginType: MarginType.TIME,
        warningThreshold: 0.6, // 60% utilization
        criticalThreshold: 0.8, // 80% utilization
        emergencyThreshold: 0.95, // 95% utilization
        autoDeployThreshold: 0.85, // 85% utilization
        metadata: { description: 'Emergency response time threshold' },
      },
      {
        id: 'maintenance-window-threshold',
        marginType: MarginType.TIME,
        warningThreshold: 0.5, // 50% utilization
        criticalThreshold: 0.75, // 75% utilization
        emergencyThreshold: 0.9, // 90% utilization
        autoDeployThreshold: 0.8, // 80% utilization
        metadata: { description: 'Maintenance window buffer threshold' },
      },
    ];

    defaultThresholds.forEach(threshold => {
      this.thresholds.set(threshold.id, threshold);
    });
  }

  /**
   * Initialize default time margin policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: MarginPolicy[] = [
      {
        id: 'emergency-response-policy',
        name: 'Emergency Response Time Policy',
        description: 'Automatically allocate emergency response time margins',
        marginType: MarginType.TIME,
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
              amount: this.config.emergencyResponseTime,
              priority: 'CRITICAL',
              reason: 'Emergency response requirement',
            },
            metadata: { description: 'Allocate emergency response time' },
          },
        ],
        priority: 1,
        active: true,
        metadata: { description: 'High priority emergency response policy' },
      },
      {
        id: 'maintenance-window-policy',
        name: 'Maintenance Window Buffer Policy',
        description: 'Allocate buffer time for maintenance windows',
        marginType: MarginType.TIME,
        conditions: [
          {
            type: 'SIGNAL',
            operator: 'EQ',
            value: SignalType.MAINTENANCE,
            metadata: { description: 'Maintenance signal detected' },
          },
        ],
        actions: [
          {
            type: 'ALLOCATE',
            parameters: {
              amount: this.config.maintenanceWindowBuffer,
              priority: 'HIGH',
              reason: 'Maintenance window requirement',
            },
            metadata: { description: 'Allocate maintenance buffer time' },
          },
        ],
        priority: 2,
        active: true,
        metadata: { description: 'Maintenance window buffer policy' },
      },
    ];

    this.policies = defaultPolicies;
  }

  /**
   * Allocate time margin for a specific operation
   */
  public async allocateTimeMargin(
    operationId: string,
    requiredTime: number,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    reason: string = 'Operation time requirement'
  ): Promise<MarginAllocation | null> {
    if (!this.config.enabled) {
      console.warn('Time margin management is disabled.');
      return null;
    }

    // Check if we can allocate the requested time
    const availableTime = this.getAvailableTimeMargin();
    if (requiredTime > availableTime) {
      console.warn(`Insufficient time margin available. Required: ${requiredTime}min, Available: ${availableTime}min`);
      return null;
    }

    // Check concurrent allocation limit
    if (this.timeAllocations.size >= this.config.maxConcurrentAllocations) {
      console.warn('Maximum concurrent time allocations reached.');
      return null;
    }

    const allocation: MarginAllocation = {
      id: `time-alloc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: MarginType.TIME,
      amount: requiredTime,
      utilizationRate: 0,
      allocatedAt: new Date(),
      expiresAt: new Date(Date.now() + requiredTime * 60000), // Convert minutes to milliseconds
      metadata: {
        operationId,
        priority,
        reason,
        allocatedBy: 'TimeMarginManagementSystem',
      },
    };

    this.timeAllocations.set(operationId, allocation);
    this.recordMarginEvent(MarginEventType.ALLOCATION, MarginType.TIME, `Allocated ${requiredTime}min for ${reason}`);

    console.log(`⏰ Allocated ${requiredTime} minutes for operation ${operationId} (${reason})`);
    return allocation;
  }

  /**
   * Deploy time margin for immediate use
   */
  public async deployTimeMargin(
    allocationId: string,
    deploymentTime: number,
    reason: string = 'Emergency deployment'
  ): Promise<MarginDeployment | null> {
    const allocation = Array.from(this.timeAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Time allocation ${allocationId} not found.`);
      return null;
    }

    if (deploymentTime > allocation.amount) {
      console.warn(`Deployment time ${deploymentTime}min exceeds allocated amount ${allocation.amount}min`);
      return null;
    }

    const deployment: MarginDeployment = {
      id: `time-deploy-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      allocationId,
      deployedAt: new Date(),
      amount: deploymentTime,
      reason,
      status: 'ACTIVE',
      metadata: {
        deployedBy: 'TimeMarginManagementSystem',
        originalAllocation: allocationId,
      },
    };

    this.timeDeployments.push(deployment);
    this.recordMarginEvent(MarginEventType.DEPLOYMENT, MarginType.TIME, `Deployed ${deploymentTime}min: ${reason}`);

    console.log(`⏰ Deployed ${deploymentTime} minutes from allocation ${allocationId} (${reason})`);
    return deployment;
  }

  /**
   * Recover time margin after operation completion
   */
  public async recoverTimeMargin(allocationId: string, reason: string = 'Operation completed'): Promise<boolean> {
    const allocation = Array.from(this.timeAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Time allocation ${allocationId} not found.`);
      return false;
    }

    // Calculate utilization rate
    const utilizationRate = this.calculateUtilizationRate(allocation);
    
    // Record utilization
    const utilization: MarginUtilization = {
      id: `time-util-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      marginType: MarginType.TIME,
      utilizationRate,
      peakUtilization: utilizationRate,
      averageUtilization: utilizationRate,
      timestamp: new Date(),
      duration: Date.now() - allocation.allocatedAt.getTime(),
      metadata: {
        allocationId,
        reason,
        recoveredBy: 'TimeMarginManagementSystem',
      },
    };

    this.utilizationHistory.push(utilization);

    // Remove allocation
    const operationId = Array.from(this.timeAllocations.entries()).find(([_, alloc]) => alloc.id === allocationId)?.[0];
    if (operationId) {
      this.timeAllocations.delete(operationId);
    }

    this.recordMarginEvent(MarginEventType.RECOVERY, MarginType.TIME, `Recovered time margin: ${reason}`);

    console.log(`⏰ Recovered time margin from allocation ${allocationId} (${reason})`);
    return true;
  }

  /**
   * Process signals for time margin management
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
   * Process a single signal for time margin management
   */
  private async processSignal(signal: Signal): Promise<void> {
    // Check policies for automatic allocation
    for (const policy of this.policies) {
      if (!policy.active || policy.marginType !== MarginType.TIME) {
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
    const currentUtilization = this.getCurrentUtilizationRate();
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
          await this.executeAllocationAction(action, signal);
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
  private async executeAllocationAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    const amount = action.parameters.amount as number;
    const priority = action.parameters.priority as string;
    const reason = action.parameters.reason as string;

    await this.allocateTimeMargin(
      `policy-${signal.id}`,
      amount,
      priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      reason
    );
  }

  /**
   * Execute deployment action
   */
  private async executeDeploymentAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    const amount = action.parameters.amount as number;
    const reason = action.parameters.reason as string;

    // Find the most recent allocation for this signal
    const allocation = Array.from(this.timeAllocations.values())
      .find(alloc => alloc.metadata.operationId === `policy-${signal.id}`);

    if (allocation) {
      await this.deployTimeMargin(allocation.id, amount, reason);
    }
  }

  /**
   * Execute alert action
   */
  private async executeAlertAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`🚨 Time Margin Alert: ${action.parameters.message || 'Policy triggered alert'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.TIME, `Alert: ${action.parameters.message}`);
  }

  /**
   * Execute escalation action
   */
  private async executeEscalationAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`📈 Time Margin Escalation: ${action.parameters.message || 'Policy triggered escalation'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.TIME, `Escalation: ${action.parameters.message}`);
  }

  /**
   * Check thresholds and trigger alerts
   */
  private checkThresholds(signal: Signal): void {
    const currentUtilization = this.getCurrentUtilizationRate();

    for (const threshold of this.thresholds.values()) {
      if (currentUtilization >= threshold.emergencyThreshold) {
        this.recordMarginEvent(
          MarginEventType.THRESHOLD_BREACH,
          MarginType.TIME,
          `Emergency threshold breached: ${currentUtilization.toFixed(2)} >= ${threshold.emergencyThreshold}`
        );
      } else if (currentUtilization >= threshold.criticalThreshold) {
        this.recordMarginEvent(
          MarginEventType.THRESHOLD_BREACH,
          MarginType.TIME,
          `Critical threshold breached: ${currentUtilization.toFixed(2)} >= ${threshold.criticalThreshold}`
        );
      } else if (currentUtilization >= threshold.warningThreshold) {
        this.recordMarginEvent(
          MarginEventType.THRESHOLD_BREACH,
          MarginType.TIME,
          `Warning threshold breached: ${currentUtilization.toFixed(2)} >= ${threshold.warningThreshold}`
        );
      }
    }
  }

  /**
   * Get available time margin
   */
  public getAvailableTimeMargin(): number {
    const totalAllocated = Array.from(this.timeAllocations.values())
      .reduce((sum, alloc) => sum + alloc.amount, 0);
    
    const totalDeployed = this.timeDeployments
      .filter(deploy => deploy.status === 'ACTIVE')
      .reduce((sum, deploy) => sum + deploy.amount, 0);

    // Return a base available time margin plus allocated minus deployed
    const baseAvailableTime = 1000; // 1000 minutes base available time
    return Math.max(0, baseAvailableTime + totalAllocated - totalDeployed);
  }

  /**
   * Get current utilization rate
   */
  public getCurrentUtilizationRate(): number {
    const totalAllocated = Array.from(this.timeAllocations.values())
      .reduce((sum, alloc) => sum + alloc.amount, 0);
    
    if (totalAllocated === 0) {
      return 0;
    }

    const totalDeployed = this.timeDeployments
      .filter(deploy => deploy.status === 'ACTIVE')
      .reduce((sum, deploy) => sum + deploy.amount, 0);

    return totalDeployed / totalAllocated;
  }

  /**
   * Calculate utilization rate for an allocation
   */
  private calculateUtilizationRate(allocation: MarginAllocation): number {
    const deployedAmount = this.timeDeployments
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
      id: `time-event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      marginType,
      timestamp: new Date(),
      description,
      impact: this.calculateEventImpact(type),
      metadata: {
        recordedBy: 'TimeMarginManagementSystem',
      },
    };

    this.timeEvents.push(event);
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
    totalAllocated: number;
    totalDeployed: number;
    availableMargin: number;
    utilizationRate: number;
    activeAllocations: number;
    activeDeployments: number;
    recentEvents: MarginEvent[];
  } {
    const totalAllocated = Array.from(this.timeAllocations.values())
      .reduce((sum, alloc) => sum + alloc.amount, 0);
    
    const totalDeployed = this.timeDeployments
      .filter(deploy => deploy.status === 'ACTIVE')
      .reduce((sum, deploy) => sum + deploy.amount, 0);

    const recentEvents = this.timeEvents
      .slice(-10)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      enabled: this.config.enabled,
      totalAllocated,
      totalDeployed,
      availableMargin: this.getAvailableTimeMargin(),
      utilizationRate: this.getCurrentUtilizationRate(),
      activeAllocations: this.timeAllocations.size,
      activeDeployments: this.timeDeployments.filter(deploy => deploy.status === 'ACTIVE').length,
      recentEvents,
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<TimeMarginManagementSystem['config']>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Time Margin Management System configuration updated.`);
  }

  /**
   * Get current configuration
   */
  public getConfig(): TimeMarginManagementSystem['config'] {
    return { ...this.config };
  }
}
