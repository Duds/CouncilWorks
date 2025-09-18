/**
 * Financial Margin Management System
 *
 * Specialized system for managing financial-based margins including:
 * - Contingency budget allocation
 * - Emergency fund management
 * - Financial buffer tracking
 * - Cost optimization and forecasting
 * - Financial risk management
 *
 * Implements F16.4: Financial Margin Management
 *
 * @file lib/financial-margin-management.ts
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
 * Financial Budget Category Interface
 */
export interface FinancialBudgetCategory {
  id: string;
  name: string;
  type: 'OPERATIONAL' | 'CAPITAL' | 'EMERGENCY' | 'MAINTENANCE' | 'CONTINGENCY';
  description: string;
  totalBudget: number;
  allocatedAmount: number;
  availableAmount: number;
  currency: 'AUD' | 'USD' | 'EUR' | 'GBP';
  fiscalYear: number;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  metadata: Record<string, any>;
}

/**
 * Financial Allocation Request Interface
 */
export interface FinancialAllocationRequest {
  id: string;
  categoryId: string;
  requestedAmount: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  duration: number; // days
  reason: string;
  requester: string;
  approvalRequired: boolean;
  metadata: Record<string, any>;
}

/**
 * Financial Margin Management System Class
 *
 * Manages financial-based margins for operational resilience:
 * - Contingency budget allocation and tracking
 * - Emergency fund management
 * - Financial buffer allocation and deployment
 * - Cost optimization and forecasting
 * - Financial risk management and monitoring
 */
export class FinancialMarginManagementSystem {
  private config: {
    enabled: boolean;
    defaultContingencyPercentage: number; // percentage of total budget
    emergencyReservePercentage: number; // percentage for emergency use
    maxConcurrentAllocations: number;
    budgetUpdateInterval: number; // milliseconds
    costOptimizationInterval: number; // milliseconds
    updateInterval: number;
    currency: 'AUD' | 'USD' | 'EUR' | 'GBP';
  };

  private budgetCategories: Map<string, FinancialBudgetCategory> = new Map();
  private financialAllocations: Map<string, MarginAllocation> = new Map();
  private financialDeployments: MarginDeployment[] = [];
  private utilizationHistory: MarginUtilization[] = [];
  private financialEvents: MarginEvent[] = [];
  private thresholds: Map<string, MarginThreshold> = new Map();
  private policies: MarginPolicy[] = [];
  private budgetInterval: NodeJS.Timeout | null = null;
  private optimizationInterval: NodeJS.Timeout | null = null;

  constructor(config?: Partial<FinancialMarginManagementSystem['config']>) {
    this.config = {
      enabled: true,
      defaultContingencyPercentage: 0.1, // 10% contingency
      emergencyReservePercentage: 0.05, // 5% emergency reserve
      maxConcurrentAllocations: 100,
      budgetUpdateInterval: 3600000, // 1 hour
      costOptimizationInterval: 86400000, // 24 hours
      updateInterval: 300000, // 5 minutes
      currency: 'AUD',
      ...config,
    };
    this.initializeDefaultBudgetCategories();
    this.initializeDefaultThresholds();
    this.initializeDefaultPolicies();
    this.startFinancialIntervals();
    console.log(`💰 Financial Margin Management System initialized.`);
  }

  /**
   * Initialize default budget categories
   */
  private initializeDefaultBudgetCategories(): void {
    const defaultCategories: FinancialBudgetCategory[] = [
      {
        id: 'operational-budget',
        name: 'Operational Budget',
        type: 'OPERATIONAL',
        description: 'Day-to-day operational expenses',
        totalBudget: 1000000, // $1M AUD
        allocatedAmount: 0,
        availableAmount: 1000000,
        currency: this.config.currency,
        fiscalYear: 2024,
        status: 'ACTIVE',
        metadata: { department: 'Operations', costCenter: 'OP001' },
      },
      {
        id: 'capital-budget',
        name: 'Capital Budget',
        type: 'CAPITAL',
        description: 'Capital expenditure and asset purchases',
        totalBudget: 500000, // $500K AUD
        allocatedAmount: 0,
        availableAmount: 500000,
        currency: this.config.currency,
        fiscalYear: 2024,
        status: 'ACTIVE',
        metadata: { department: 'Capital', costCenter: 'CAP001' },
      },
      {
        id: 'emergency-budget',
        name: 'Emergency Budget',
        type: 'EMERGENCY',
        description: 'Emergency response and crisis management funds',
        totalBudget: 200000, // $200K AUD
        allocatedAmount: 0,
        availableAmount: 200000,
        currency: this.config.currency,
        fiscalYear: 2024,
        status: 'ACTIVE',
        metadata: { department: 'Emergency', costCenter: 'EMG001' },
      },
      {
        id: 'maintenance-budget',
        name: 'Maintenance Budget',
        type: 'MAINTENANCE',
        description: 'Preventive and corrective maintenance funds',
        totalBudget: 300000, // $300K AUD
        allocatedAmount: 0,
        availableAmount: 300000,
        currency: this.config.currency,
        fiscalYear: 2024,
        status: 'ACTIVE',
        metadata: { department: 'Maintenance', costCenter: 'MNT001' },
      },
      {
        id: 'contingency-budget',
        name: 'Contingency Budget',
        type: 'CONTINGENCY',
        description: 'Unexpected expenses and risk mitigation funds',
        totalBudget: 150000, // $150K AUD
        allocatedAmount: 0,
        availableAmount: 150000,
        currency: this.config.currency,
        fiscalYear: 2024,
        status: 'ACTIVE',
        metadata: { department: 'Finance', costCenter: 'CON001' },
      },
    ];

    defaultCategories.forEach(category => {
      this.budgetCategories.set(category.id, category);
    });
  }

  /**
   * Initialize default financial thresholds
   */
  private initializeDefaultThresholds(): void {
    const defaultThresholds: MarginThreshold[] = [
      {
        id: 'operational-threshold',
        marginType: MarginType.FINANCIAL,
        warningThreshold: 0.8, // 80% of budget used
        criticalThreshold: 0.9, // 90% of budget used
        emergencyThreshold: 0.95, // 95% of budget used
        autoDeployThreshold: 0.92, // 92% of budget used
        metadata: { category: 'OPERATIONAL', description: 'Operational budget threshold' },
      },
      {
        id: 'emergency-threshold',
        marginType: MarginType.FINANCIAL,
        warningThreshold: 0.7, // 70% of emergency budget used
        criticalThreshold: 0.85, // 85% of emergency budget used
        emergencyThreshold: 0.95, // 95% of emergency budget used
        autoDeployThreshold: 0.9, // 90% of emergency budget used
        metadata: { category: 'EMERGENCY', description: 'Emergency budget threshold' },
      },
      {
        id: 'contingency-threshold',
        marginType: MarginType.FINANCIAL,
        warningThreshold: 0.6, // 60% of contingency budget used
        criticalThreshold: 0.8, // 80% of contingency budget used
        emergencyThreshold: 0.9, // 90% of contingency budget used
        autoDeployThreshold: 0.85, // 85% of contingency budget used
        metadata: { category: 'CONTINGENCY', description: 'Contingency budget threshold' },
      },
    ];

    defaultThresholds.forEach(threshold => {
      this.thresholds.set(threshold.id, threshold);
    });
  }

  /**
   * Initialize default financial policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: MarginPolicy[] = [
      {
        id: 'emergency-financial-policy',
        name: 'Emergency Financial Policy',
        description: 'Automatically allocate emergency funds for critical operations',
        marginType: MarginType.FINANCIAL,
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
              category: 'EMERGENCY',
              amount: 50000, // $50K AUD
              priority: 'CRITICAL',
              reason: 'Emergency response requirement',
            },
            metadata: { description: 'Allocate emergency funds' },
          },
        ],
        priority: 1,
        active: true,
        metadata: { description: 'High priority emergency financial policy' },
      },
      {
        id: 'maintenance-financial-policy',
        name: 'Maintenance Financial Policy',
        description: 'Allocate funds for critical maintenance operations',
        marginType: MarginType.FINANCIAL,
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
              category: 'MAINTENANCE',
              amount: 25000, // $25K AUD
              priority: 'HIGH',
              reason: 'Critical maintenance requirement',
            },
            metadata: { description: 'Allocate maintenance funds' },
          },
        ],
        priority: 2,
        active: true,
        metadata: { description: 'Maintenance financial allocation policy' },
      },
    ];

    this.policies = defaultPolicies;
  }

  /**
   * Start financial management intervals
   */
  private startFinancialIntervals(): void {
    if (this.budgetInterval) {
      clearInterval(this.budgetInterval);
    }
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }

    this.budgetInterval = setInterval(() => {
      this.updateBudgetStatus();
    }, this.config.budgetUpdateInterval);

    this.optimizationInterval = setInterval(() => {
      this.optimizeFinancialAllocation();
    }, this.config.costOptimizationInterval);
  }

  /**
   * Allocate financial margin for a specific operation
   */
  public async allocateFinancialMargin(
    request: FinancialAllocationRequest
  ): Promise<MarginAllocation | null> {
    if (!this.config.enabled) {
      console.warn('Financial margin management is disabled.');
      return null;
    }

    const category = this.budgetCategories.get(request.categoryId);
    if (!category) {
      console.warn(`Budget category ${request.categoryId} not found.`);
      return null;
    }

    // Check if we can allocate the requested amount
    if (request.requestedAmount > category.availableAmount) {
      console.warn(`Insufficient funds available. Required: ${request.requestedAmount}, Available: ${category.availableAmount}`);
      return null;
    }

    // Check concurrent allocation limit
    if (this.financialAllocations.size >= this.config.maxConcurrentAllocations) {
      console.warn('Maximum concurrent financial allocations reached.');
      return null;
    }

    const allocation: MarginAllocation = {
      id: `financial-alloc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: MarginType.FINANCIAL,
      amount: request.requestedAmount,
      utilizationRate: 0,
      allocatedAt: new Date(),
      expiresAt: new Date(Date.now() + request.duration * 86400000), // Convert days to milliseconds
      metadata: {
        requestId: request.id,
        categoryId: request.categoryId,
        categoryName: category.name,
        categoryType: category.type,
        priority: request.priority,
        reason: request.reason,
        requester: request.requester,
        approvalRequired: request.approvalRequired,
        currency: category.currency,
        allocatedBy: 'FinancialMarginManagementSystem',
      },
    };

    // Update budget category
    category.allocatedAmount += request.requestedAmount;
    category.availableAmount -= request.requestedAmount;

    this.financialAllocations.set(request.id, allocation);
    this.budgetCategories.set(request.categoryId, category);
    this.recordMarginEvent(MarginEventType.ALLOCATION, MarginType.FINANCIAL, `Allocated ${this.formatCurrency(request.requestedAmount, category.currency)} from ${category.name} for ${request.reason}`);

    console.log(`💰 Allocated ${this.formatCurrency(request.requestedAmount, category.currency)} from ${category.name} for operation ${request.id} (${request.reason})`);
    return allocation;
  }

  /**
   * Deploy financial margin for immediate use
   */
  public async deployFinancialMargin(
    allocationId: string,
    deploymentAmount: number,
    reason: string = 'Emergency deployment'
  ): Promise<MarginDeployment | null> {
    const allocation = Array.from(this.financialAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Financial allocation ${allocationId} not found.`);
      return null;
    }

    if (deploymentAmount > allocation.amount) {
      console.warn(`Deployment amount ${deploymentAmount} exceeds allocated amount ${allocation.amount}`);
      return null;
    }

    const deployment: MarginDeployment = {
      id: `financial-deploy-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      allocationId,
      deployedAt: new Date(),
      amount: deploymentAmount,
      reason,
      status: 'ACTIVE',
      metadata: {
        deployedBy: 'FinancialMarginManagementSystem',
        originalAllocation: allocationId,
        categoryId: allocation.metadata.categoryId,
        categoryName: allocation.metadata.categoryName,
        currency: allocation.metadata.currency,
      },
    };

    this.financialDeployments.push(deployment);
    this.recordMarginEvent(MarginEventType.DEPLOYMENT, MarginType.FINANCIAL, `Deployed ${this.formatCurrency(deploymentAmount, allocation.metadata.currency as string)}: ${reason}`);

    console.log(`💰 Deployed ${this.formatCurrency(deploymentAmount, allocation.metadata.currency as string)} from allocation ${allocationId} (${reason})`);
    return deployment;
  }

  /**
   * Recover financial margin after operation completion
   */
  public async recoverFinancialMargin(allocationId: string, reason: string = 'Operation completed'): Promise<boolean> {
    const allocation = Array.from(this.financialAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Financial allocation ${allocationId} not found.`);
      return false;
    }

    // Calculate utilization rate
    const utilizationRate = this.calculateUtilizationRate(allocation);
    
    // Record utilization
    const utilization: MarginUtilization = {
      id: `financial-util-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      marginType: MarginType.FINANCIAL,
      utilizationRate,
      peakUtilization: utilizationRate,
      averageUtilization: utilizationRate,
      timestamp: new Date(),
      duration: Date.now() - allocation.allocatedAt.getTime(),
      metadata: {
        allocationId,
        reason,
        categoryId: allocation.metadata.categoryId,
        categoryName: allocation.metadata.categoryName,
        recoveredBy: 'FinancialMarginManagementSystem',
      },
    };

    this.utilizationHistory.push(utilization);

    // Update budget category
    const category = this.budgetCategories.get(allocation.metadata.categoryId as string);
    if (category) {
      category.allocatedAmount -= allocation.amount;
      category.availableAmount += allocation.amount;
      this.budgetCategories.set(category.id, category);
    }

    // Remove allocation
    const requestId = Array.from(this.financialAllocations.entries()).find(([_, alloc]) => alloc.id === allocationId)?.[0];
    if (requestId) {
      this.financialAllocations.delete(requestId);
    }

    this.recordMarginEvent(MarginEventType.RECOVERY, MarginType.FINANCIAL, `Recovered financial margin: ${reason}`);

    console.log(`💰 Recovered financial margin from allocation ${allocationId} (${reason})`);
    return true;
  }

  /**
   * Process signals for financial margin management
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
   * Process a single signal for financial margin management
   */
  private async processSignal(signal: Signal): Promise<void> {
    // Check policies for automatic allocation
    for (const policy of this.policies) {
      if (!policy.active || policy.marginType !== MarginType.FINANCIAL) {
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
    const categoryType = action.parameters.category as FinancialBudgetCategory['type'];
    const amount = action.parameters.amount as number;
    const priority = action.parameters.priority as string;
    const reason = action.parameters.reason as string;

    // Find suitable category
    const category = Array.from(this.budgetCategories.values())
      .find(cat => cat.type === categoryType && cat.availableAmount >= amount);

    if (category) {
      const request: FinancialAllocationRequest = {
        id: `policy-${signal.id}`,
        categoryId: category.id,
        requestedAmount: amount,
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        duration: 30, // Default 30 days
        reason,
        requester: 'System Policy',
        approvalRequired: false,
        metadata: { policyId: policy.id, signalId: signal.id },
      };

      await this.allocateFinancialMargin(request);
    }
  }

  /**
   * Execute deployment action
   */
  private async executeDeploymentAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    const amount = action.parameters.amount as number;
    const reason = action.parameters.reason as string;

    // Find the most recent allocation for this signal
    const allocation = Array.from(this.financialAllocations.values())
      .find(alloc => alloc.metadata.requestId === `policy-${signal.id}`);

    if (allocation) {
      await this.deployFinancialMargin(allocation.id, amount, reason);
    }
  }

  /**
   * Execute alert action
   */
  private async executeAlertAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`🚨 Financial Margin Alert: ${action.parameters.message || 'Policy triggered alert'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.FINANCIAL, `Alert: ${action.parameters.message}`);
  }

  /**
   * Execute escalation action
   */
  private async executeEscalationAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`📈 Financial Margin Escalation: ${action.parameters.message || 'Policy triggered escalation'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.FINANCIAL, `Escalation: ${action.parameters.message}`);
  }

  /**
   * Check thresholds and trigger alerts
   */
  private checkThresholds(signal: Signal): void {
    for (const category of this.budgetCategories.values()) {
      const threshold = Array.from(this.thresholds.values())
        .find(t => t.metadata.category === category.type);

      if (threshold) {
        const budgetRatio = category.allocatedAmount / category.totalBudget;
        
        if (budgetRatio >= threshold.emergencyThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.FINANCIAL,
            `Emergency threshold breached for ${category.name}: ${budgetRatio.toFixed(2)} >= ${threshold.emergencyThreshold}`
          );
        } else if (budgetRatio >= threshold.criticalThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.FINANCIAL,
            `Critical threshold breached for ${category.name}: ${budgetRatio.toFixed(2)} >= ${threshold.criticalThreshold}`
          );
        } else if (budgetRatio >= threshold.warningThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.FINANCIAL,
            `Warning threshold breached for ${category.name}: ${budgetRatio.toFixed(2)} >= ${threshold.warningThreshold}`
          );
        }
      }
    }
  }

  /**
   * Update budget status
   */
  private updateBudgetStatus(): void {
    if (!this.config.enabled) {
      return;
    }

    for (const category of this.budgetCategories.values()) {
      // Check if category needs attention
      const budgetRatio = category.allocatedAmount / category.totalBudget;
      if (budgetRatio > 0.8 && category.status === 'ACTIVE') {
        this.recordMarginEvent(
          MarginEventType.OPTIMIZATION,
          MarginType.FINANCIAL,
          `High budget utilization for ${category.name}: ${budgetRatio.toFixed(2)}`
        );
      }
    }

    console.log(`💰 Budget status updated.`);
  }

  /**
   * Optimize financial allocation
   */
  private optimizeFinancialAllocation(): void {
    if (!this.config.enabled) {
      return;
    }

    // Check for budget rebalancing opportunities
    for (const category of this.budgetCategories.values()) {
      const budgetRatio = category.allocatedAmount / category.totalBudget;
      
      if (budgetRatio < 0.2 && category.status === 'ACTIVE') {
        // Low utilization - consider reallocating
        this.recordMarginEvent(
          MarginEventType.OPTIMIZATION,
          MarginType.FINANCIAL,
          `Low budget utilization for ${category.name}: ${budgetRatio.toFixed(2)}`
        );
      } else if (budgetRatio > 0.9) {
        // High utilization - consider expanding budget
        this.recordMarginEvent(
          MarginEventType.OPTIMIZATION,
          MarginType.FINANCIAL,
          `High budget utilization for ${category.name}: ${budgetRatio.toFixed(2)}`
        );
      }
    }

    console.log(`💰 Financial optimization completed.`);
  }

  /**
   * Get overall utilization rate across all budget categories
   */
  public getOverallUtilizationRate(): number {
    let totalBudget = 0;
    let totalAllocated = 0;

    for (const category of this.budgetCategories.values()) {
      totalBudget += category.totalBudget;
      totalAllocated += category.allocatedAmount;
    }

    return totalBudget > 0 ? totalAllocated / totalBudget : 0;
  }

  /**
   * Get available financial margin
   */
  public getAvailableFinancialMargin(): number {
    return Array.from(this.budgetCategories.values())
      .reduce((sum, category) => sum + category.availableAmount, 0);
  }

  /**
   * Calculate utilization rate for an allocation
   */
  private calculateUtilizationRate(allocation: MarginAllocation): number {
    const deployedAmount = this.financialDeployments
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
   * Format currency amount
   */
  private formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Record margin event
   */
  private recordMarginEvent(type: MarginEventType, marginType: MarginType, description: string): void {
    const event: MarginEvent = {
      id: `financial-event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      marginType,
      timestamp: new Date(),
      description,
      impact: this.calculateEventImpact(type),
      metadata: {
        recordedBy: 'FinancialMarginManagementSystem',
      },
    };

    this.financialEvents.push(event);
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
    budgetCategories: FinancialBudgetCategory[];
    totalBudget: number;
    totalAllocated: number;
    totalAvailable: number;
    overallUtilization: number;
    activeAllocations: number;
    activeDeployments: number;
    recentEvents: MarginEvent[];
  } {
    const totalBudget = Array.from(this.budgetCategories.values())
      .reduce((sum, category) => sum + category.totalBudget, 0);
    
    const totalAllocated = Array.from(this.budgetCategories.values())
      .reduce((sum, category) => sum + category.allocatedAmount, 0);
    
    const totalAvailable = Array.from(this.budgetCategories.values())
      .reduce((sum, category) => sum + category.availableAmount, 0);

    const recentEvents = this.financialEvents
      .slice(-10)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      enabled: this.config.enabled,
      budgetCategories: Array.from(this.budgetCategories.values()),
      totalBudget,
      totalAllocated,
      totalAvailable,
      overallUtilization: this.getOverallUtilizationRate(),
      activeAllocations: this.financialAllocations.size,
      activeDeployments: this.financialDeployments.filter(deploy => deploy.status === 'ACTIVE').length,
      recentEvents,
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<FinancialMarginManagementSystem['config']>): void {
    this.config = { ...this.config, ...newConfig };
    this.startFinancialIntervals(); // Restart intervals
    console.log(`⚙️ Financial Margin Management System configuration updated.`);
  }

  /**
   * Get current configuration
   */
  public getConfig(): FinancialMarginManagementSystem['config'] {
    return { ...this.config };
  }

  /**
   * Shutdown the system
   */
  public shutdown(): void {
    if (this.budgetInterval) {
      clearInterval(this.budgetInterval);
      this.budgetInterval = null;
    }
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = null;
    }
    console.log(`💰 Financial Margin Management System shut down.`);
  }
}
