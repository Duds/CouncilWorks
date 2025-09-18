/**
 * Material Margin Management System
 *
 * Specialized system for managing material-based margins including:
 * - Critical spare parts inventory
 * - Material buffer management
 * - Emergency material deployment
 * - Material optimization and forecasting
 * - Supply chain resilience
 *
 * Implements F16.3: Material Margin Management
 *
 * @file lib/material-margin-management.ts
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
 * Material Inventory Item Interface
 */
export interface MaterialInventoryItem {
  id: string;
  name: string;
  category: 'SPARE_PARTS' | 'CONSUMABLES' | 'TOOLS' | 'EQUIPMENT' | 'SAFETY';
  description: string;
  unit: 'PIECES' | 'KILOGRAMS' | 'LITRES' | 'METRES' | 'UNITS';
  totalQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
  minimumStock: number;
  reorderPoint: number;
  unitCost: number;
  supplier: string;
  leadTime: number; // days
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'DISCONTINUED' | 'OBSOLETE';
  metadata: Record<string, any>;
}

/**
 * Material Allocation Request Interface
 */
export interface MaterialAllocationRequest {
  id: string;
  itemId: string;
  requestedQuantity: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  duration: number; // days
  reason: string;
  requester: string;
  metadata: Record<string, any>;
}

/**
 * Material Margin Management System Class
 *
 * Manages material-based margins for operational resilience:
 * - Critical spare parts inventory management
 * - Material buffer allocation and tracking
 * - Emergency material deployment
 * - Material optimization and forecasting
 * - Supply chain resilience management
 */
export class MaterialMarginManagementSystem {
  private config: {
    enabled: boolean;
    defaultBufferPercentage: number; // percentage of total inventory
    emergencyReservePercentage: number; // percentage for emergency use
    maxConcurrentAllocations: number;
    inventoryUpdateInterval: number; // milliseconds
    reorderCheckInterval: number; // milliseconds
    updateInterval: number;
  };

  private inventory: Map<string, MaterialInventoryItem> = new Map();
  private materialAllocations: Map<string, MarginAllocation> = new Map();
  private materialDeployments: MarginDeployment[] = [];
  private utilizationHistory: MarginUtilization[] = [];
  private materialEvents: MarginEvent[] = [];
  private thresholds: Map<string, MarginThreshold> = new Map();
  private policies: MarginPolicy[] = [];
  private inventoryInterval: NodeJS.Timeout | null = null;
  private reorderInterval: NodeJS.Timeout | null = null;

  constructor(config?: Partial<MaterialMarginManagementSystem['config']>) {
    this.config = {
      enabled: true,
      defaultBufferPercentage: 0.15, // 15% buffer
      emergencyReservePercentage: 0.05, // 5% emergency reserve
      maxConcurrentAllocations: 50,
      inventoryUpdateInterval: 3600000, // 1 hour
      reorderCheckInterval: 86400000, // 24 hours
      updateInterval: 300000, // 5 minutes
      ...config,
    };
    this.initializeDefaultInventory();
    this.initializeDefaultThresholds();
    this.initializeDefaultPolicies();
    this.startInventoryIntervals();
    console.log(`📦 Material Margin Management System initialized.`);
  }

  /**
   * Initialize default material inventory
   */
  private initializeDefaultInventory(): void {
    const defaultItems: MaterialInventoryItem[] = [
      {
        id: 'bearing-6205',
        name: 'Ball Bearing 6205',
        category: 'SPARE_PARTS',
        description: 'Deep groove ball bearing 25x52x15mm',
        unit: 'PIECES',
        totalQuantity: 50,
        allocatedQuantity: 0,
        availableQuantity: 50,
        minimumStock: 10,
        reorderPoint: 15,
        unitCost: 25.50,
        supplier: 'Bearing Supply Co.',
        leadTime: 7,
        criticality: 'HIGH',
        status: 'ACTIVE',
        metadata: { partNumber: '6205-2RS', manufacturer: 'SKF' },
      },
      {
        id: 'hydraulic-oil-46',
        name: 'Hydraulic Oil ISO 46',
        category: 'CONSUMABLES',
        description: 'High-performance hydraulic oil',
        unit: 'LITRES',
        totalQuantity: 200,
        allocatedQuantity: 0,
        availableQuantity: 200,
        minimumStock: 50,
        reorderPoint: 75,
        unitCost: 8.75,
        supplier: 'Oil Distributors Ltd.',
        leadTime: 3,
        criticality: 'MEDIUM',
        status: 'ACTIVE',
        metadata: { viscosity: 'ISO 46', temperature: '-20°C to +80°C' },
      },
      {
        id: 'safety-helmet',
        name: 'Safety Helmet',
        category: 'SAFETY',
        description: 'ANSI Z89.1 Type I Class C safety helmet',
        unit: 'PIECES',
        totalQuantity: 100,
        allocatedQuantity: 0,
        availableQuantity: 100,
        minimumStock: 20,
        reorderPoint: 30,
        unitCost: 45.00,
        supplier: 'Safety Equipment Inc.',
        leadTime: 5,
        criticality: 'CRITICAL',
        status: 'ACTIVE',
        metadata: { standard: 'ANSI Z89.1', color: 'White' },
      },
      {
        id: 'electrical-cable-16mm',
        name: 'Electrical Cable 16mm²',
        category: 'EQUIPMENT',
        description: 'Copper electrical cable 16mm² cross-section',
        unit: 'METRES',
        totalQuantity: 500,
        allocatedQuantity: 0,
        availableQuantity: 500,
        minimumStock: 100,
        reorderPoint: 150,
        unitCost: 12.50,
        supplier: 'Electrical Supplies Co.',
        leadTime: 10,
        criticality: 'HIGH',
        status: 'ACTIVE',
        metadata: { conductor: 'Copper', insulation: 'PVC', voltage: '1000V' },
      },
      {
        id: 'welding-electrode-7018',
        name: 'Welding Electrode E7018',
        category: 'CONSUMABLES',
        description: 'Low hydrogen welding electrode',
        unit: 'KILOGRAMS',
        totalQuantity: 50,
        allocatedQuantity: 0,
        availableQuantity: 50,
        minimumStock: 10,
        reorderPoint: 15,
        unitCost: 18.50,
        supplier: 'Welding Supplies Ltd.',
        leadTime: 7,
        criticality: 'MEDIUM',
        status: 'ACTIVE',
        metadata: { diameter: '3.25mm', position: 'All', current: 'AC/DC' },
      },
    ];

    defaultItems.forEach(item => {
      this.inventory.set(item.id, item);
    });
  }

  /**
   * Initialize default material thresholds
   */
  private initializeDefaultThresholds(): void {
    const defaultThresholds: MarginThreshold[] = [
      {
        id: 'critical-parts-threshold',
        marginType: MarginType.MATERIAL,
        warningThreshold: 0.3, // 30% of minimum stock
        criticalThreshold: 0.1, // 10% of minimum stock
        emergencyThreshold: 0.05, // 5% of minimum stock
        autoDeployThreshold: 0.15, // 15% of minimum stock
        metadata: { category: 'SPARE_PARTS', description: 'Critical spare parts threshold' },
      },
      {
        id: 'consumables-threshold',
        marginType: MarginType.MATERIAL,
        warningThreshold: 0.4, // 40% of minimum stock
        criticalThreshold: 0.2, // 20% of minimum stock
        emergencyThreshold: 0.1, // 10% of minimum stock
        autoDeployThreshold: 0.25, // 25% of minimum stock
        metadata: { category: 'CONSUMABLES', description: 'Consumables threshold' },
      },
      {
        id: 'safety-equipment-threshold',
        marginType: MarginType.MATERIAL,
        warningThreshold: 0.2, // 20% of minimum stock
        criticalThreshold: 0.1, // 10% of minimum stock
        emergencyThreshold: 0.05, // 5% of minimum stock
        autoDeployThreshold: 0.15, // 15% of minimum stock
        metadata: { category: 'SAFETY', description: 'Safety equipment threshold' },
      },
    ];

    defaultThresholds.forEach(threshold => {
      this.thresholds.set(threshold.id, threshold);
    });
  }

  /**
   * Initialize default material policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: MarginPolicy[] = [
      {
        id: 'emergency-material-policy',
        name: 'Emergency Material Policy',
        description: 'Automatically allocate emergency materials for critical operations',
        marginType: MarginType.MATERIAL,
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
              category: 'SAFETY',
              quantity: 10,
              priority: 'CRITICAL',
              reason: 'Emergency response requirement',
            },
            metadata: { description: 'Allocate emergency safety equipment' },
          },
        ],
        priority: 1,
        active: true,
        metadata: { description: 'High priority emergency material policy' },
      },
      {
        id: 'maintenance-material-policy',
        name: 'Maintenance Material Policy',
        description: 'Allocate materials for scheduled maintenance',
        marginType: MarginType.MATERIAL,
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
              category: 'SPARE_PARTS',
              quantity: 5,
              priority: 'HIGH',
              reason: 'Scheduled maintenance requirement',
            },
            metadata: { description: 'Allocate maintenance spare parts' },
          },
        ],
        priority: 2,
        active: true,
        metadata: { description: 'Maintenance material allocation policy' },
      },
    ];

    this.policies = defaultPolicies;
  }

  /**
   * Start inventory management intervals
   */
  private startInventoryIntervals(): void {
    if (this.inventoryInterval) {
      clearInterval(this.inventoryInterval);
    }
    if (this.reorderInterval) {
      clearInterval(this.reorderInterval);
    }

    this.inventoryInterval = setInterval(() => {
      this.updateInventoryStatus();
    }, this.config.inventoryUpdateInterval);

    this.reorderInterval = setInterval(() => {
      this.checkReorderPoints();
    }, this.config.reorderCheckInterval);
  }

  /**
   * Allocate material margin for a specific operation
   */
  public async allocateMaterialMargin(
    request: MaterialAllocationRequest
  ): Promise<MarginAllocation | null> {
    if (!this.config.enabled) {
      console.warn('Material margin management is disabled.');
      return null;
    }

    const item = this.inventory.get(request.itemId);
    if (!item) {
      console.warn(`Material item ${request.itemId} not found.`);
      return null;
    }

    // Check if we can allocate the requested quantity
    if (request.requestedQuantity > item.availableQuantity) {
      console.warn(`Insufficient material available. Required: ${request.requestedQuantity}, Available: ${item.availableQuantity}`);
      return null;
    }

    // Check concurrent allocation limit
    if (this.materialAllocations.size >= this.config.maxConcurrentAllocations) {
      console.warn('Maximum concurrent material allocations reached.');
      return null;
    }

    const allocation: MarginAllocation = {
      id: `material-alloc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: MarginType.MATERIAL,
      amount: request.requestedQuantity,
      utilizationRate: 0,
      allocatedAt: new Date(),
      expiresAt: new Date(Date.now() + request.duration * 86400000), // Convert days to milliseconds
      metadata: {
        requestId: request.id,
        itemId: request.itemId,
        itemName: item.name,
        category: item.category,
        priority: request.priority,
        reason: request.reason,
        requester: request.requester,
        allocatedBy: 'MaterialMarginManagementSystem',
      },
    };

    // Update inventory
    item.allocatedQuantity += request.requestedQuantity;
    item.availableQuantity -= request.requestedQuantity;

    this.materialAllocations.set(request.id, allocation);
    this.inventory.set(request.itemId, item);
    this.recordMarginEvent(MarginEventType.ALLOCATION, MarginType.MATERIAL, `Allocated ${request.requestedQuantity} ${item.unit} of ${item.name} for ${request.reason}`);

    console.log(`📦 Allocated ${request.requestedQuantity} ${item.unit} of ${item.name} for operation ${request.id} (${request.reason})`);
    return allocation;
  }

  /**
   * Deploy material margin for immediate use
   */
  public async deployMaterialMargin(
    allocationId: string,
    deploymentQuantity: number,
    reason: string = 'Emergency deployment'
  ): Promise<MarginDeployment | null> {
    const allocation = Array.from(this.materialAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Material allocation ${allocationId} not found.`);
      return null;
    }

    if (deploymentQuantity > allocation.amount) {
      console.warn(`Deployment quantity ${deploymentQuantity} exceeds allocated amount ${allocation.amount}`);
      return null;
    }

    const deployment: MarginDeployment = {
      id: `material-deploy-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      allocationId,
      deployedAt: new Date(),
      amount: deploymentQuantity,
      reason,
      status: 'ACTIVE',
      metadata: {
        deployedBy: 'MaterialMarginManagementSystem',
        originalAllocation: allocationId,
        itemId: allocation.metadata.itemId,
        itemName: allocation.metadata.itemName,
      },
    };

    this.materialDeployments.push(deployment);
    this.recordMarginEvent(MarginEventType.DEPLOYMENT, MarginType.MATERIAL, `Deployed ${deploymentQuantity} ${allocation.metadata.itemName}: ${reason}`);

    console.log(`📦 Deployed ${deploymentQuantity} ${allocation.metadata.itemName} from allocation ${allocationId} (${reason})`);
    return deployment;
  }

  /**
   * Recover material margin after operation completion
   */
  public async recoverMaterialMargin(allocationId: string, reason: string = 'Operation completed'): Promise<boolean> {
    const allocation = Array.from(this.materialAllocations.values()).find(alloc => alloc.id === allocationId);
    if (!allocation) {
      console.warn(`Material allocation ${allocationId} not found.`);
      return false;
    }

    // Calculate utilization rate
    const utilizationRate = this.calculateUtilizationRate(allocation);
    
    // Record utilization
    const utilization: MarginUtilization = {
      id: `material-util-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      marginType: MarginType.MATERIAL,
      utilizationRate,
      peakUtilization: utilizationRate,
      averageUtilization: utilizationRate,
      timestamp: new Date(),
      duration: Date.now() - allocation.allocatedAt.getTime(),
      metadata: {
        allocationId,
        reason,
        itemId: allocation.metadata.itemId,
        itemName: allocation.metadata.itemName,
        recoveredBy: 'MaterialMarginManagementSystem',
      },
    };

    this.utilizationHistory.push(utilization);

    // Update inventory
    const item = this.inventory.get(allocation.metadata.itemId as string);
    if (item) {
      item.allocatedQuantity -= allocation.amount;
      item.availableQuantity += allocation.amount;
      this.inventory.set(item.id, item);
    }

    // Remove allocation
    const requestId = Array.from(this.materialAllocations.entries()).find(([_, alloc]) => alloc.id === allocationId)?.[0];
    if (requestId) {
      this.materialAllocations.delete(requestId);
    }

    this.recordMarginEvent(MarginEventType.RECOVERY, MarginType.MATERIAL, `Recovered material margin: ${reason}`);

    console.log(`📦 Recovered material margin from allocation ${allocationId} (${reason})`);
    return true;
  }

  /**
   * Process signals for material margin management
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
   * Process a single signal for material margin management
   */
  private async processSignal(signal: Signal): Promise<void> {
    // Check policies for automatic allocation
    for (const policy of this.policies) {
      if (!policy.active || policy.marginType !== MarginType.MATERIAL) {
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
    const category = action.parameters.category as MaterialInventoryItem['category'];
    const quantity = action.parameters.quantity as number;
    const priority = action.parameters.priority as string;
    const reason = action.parameters.reason as string;

    // Find suitable item in the category
    const item = Array.from(this.inventory.values())
      .find(inv => inv.category === category && inv.availableQuantity >= quantity);

    if (item) {
      const request: MaterialAllocationRequest = {
        id: `policy-${signal.id}`,
        itemId: item.id,
        requestedQuantity: quantity,
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        duration: 7, // Default 7 days
        reason,
        requester: 'System Policy',
        metadata: { policyId: policy.id, signalId: signal.id },
      };

      await this.allocateMaterialMargin(request);
    }
  }

  /**
   * Execute deployment action
   */
  private async executeDeploymentAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    const quantity = action.parameters.quantity as number;
    const reason = action.parameters.reason as string;

    // Find the most recent allocation for this signal
    const allocation = Array.from(this.materialAllocations.values())
      .find(alloc => alloc.metadata.requestId === `policy-${signal.id}`);

    if (allocation) {
      await this.deployMaterialMargin(allocation.id, quantity, reason);
    }
  }

  /**
   * Execute alert action
   */
  private async executeAlertAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`🚨 Material Margin Alert: ${action.parameters.message || 'Policy triggered alert'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.MATERIAL, `Alert: ${action.parameters.message}`);
  }

  /**
   * Execute escalation action
   */
  private async executeEscalationAction(action: MarginPolicyAction, signal: Signal): Promise<void> {
    console.log(`📈 Material Margin Escalation: ${action.parameters.message || 'Policy triggered escalation'}`);
    this.recordMarginEvent(MarginEventType.POLICY_TRIGGER, MarginType.MATERIAL, `Escalation: ${action.parameters.message}`);
  }

  /**
   * Check thresholds and trigger alerts
   */
  private checkThresholds(signal: Signal): void {
    for (const item of this.inventory.values()) {
      const threshold = Array.from(this.thresholds.values())
        .find(t => t.metadata.category === item.category);

      if (threshold) {
        const stockRatio = item.availableQuantity / item.minimumStock;
        
        if (stockRatio <= threshold.emergencyThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.MATERIAL,
            `Emergency threshold breached for ${item.name}: ${stockRatio.toFixed(2)} <= ${threshold.emergencyThreshold}`
          );
        } else if (stockRatio <= threshold.criticalThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.MATERIAL,
            `Critical threshold breached for ${item.name}: ${stockRatio.toFixed(2)} <= ${threshold.criticalThreshold}`
          );
        } else if (stockRatio <= threshold.warningThreshold) {
          this.recordMarginEvent(
            MarginEventType.THRESHOLD_BREACH,
            MarginType.MATERIAL,
            `Warning threshold breached for ${item.name}: ${stockRatio.toFixed(2)} <= ${threshold.warningThreshold}`
          );
        }
      }
    }
  }

  /**
   * Update inventory status
   */
  private updateInventoryStatus(): void {
    if (!this.config.enabled) {
      return;
    }

    for (const item of this.inventory.values()) {
      // Check if item needs reordering
      if (item.availableQuantity <= item.reorderPoint && item.status === 'ACTIVE') {
        this.recordMarginEvent(
          MarginEventType.OPTIMIZATION,
          MarginType.MATERIAL,
          `Reorder point reached for ${item.name}: ${item.availableQuantity} <= ${item.reorderPoint}`
        );
      }
    }

    console.log(`📦 Inventory status updated.`);
  }

  /**
   * Check reorder points and generate reorder recommendations
   */
  private checkReorderPoints(): void {
    if (!this.config.enabled) {
      return;
    }

    for (const item of this.inventory.values()) {
      if (item.availableQuantity <= item.reorderPoint && item.status === 'ACTIVE') {
        this.recordMarginEvent(
          MarginEventType.OPTIMIZATION,
          MarginType.MATERIAL,
          `Reorder recommendation for ${item.name}: Order ${item.minimumStock * 2} ${item.unit}`
        );
      }
    }

    console.log(`📦 Reorder points checked.`);
  }

  /**
   * Get overall utilization rate across all materials
   */
  public getOverallUtilizationRate(): number {
    let totalQuantity = 0;
    let totalAllocated = 0;

    for (const item of this.inventory.values()) {
      totalQuantity += item.totalQuantity;
      totalAllocated += item.allocatedQuantity;
    }

    return totalQuantity > 0 ? totalAllocated / totalQuantity : 0;
  }

  /**
   * Get available material margin
   */
  public getAvailableMaterialMargin(): number {
    return Array.from(this.inventory.values())
      .reduce((sum, item) => sum + item.availableQuantity, 0);
  }

  /**
   * Calculate utilization rate for an allocation
   */
  private calculateUtilizationRate(allocation: MarginAllocation): number {
    const deployedAmount = this.materialDeployments
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
      id: `material-event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type,
      marginType,
      timestamp: new Date(),
      description,
      impact: this.calculateEventImpact(type),
      metadata: {
        recordedBy: 'MaterialMarginManagementSystem',
      },
    };

    this.materialEvents.push(event);
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
    inventory: MaterialInventoryItem[];
    totalItems: number;
    totalQuantity: number;
    totalAllocated: number;
    totalAvailable: number;
    overallUtilization: number;
    activeAllocations: number;
    activeDeployments: number;
    recentEvents: MarginEvent[];
  } {
    const totalQuantity = Array.from(this.inventory.values())
      .reduce((sum, item) => sum + item.totalQuantity, 0);
    
    const totalAllocated = Array.from(this.inventory.values())
      .reduce((sum, item) => sum + item.allocatedQuantity, 0);
    
    const totalAvailable = Array.from(this.inventory.values())
      .reduce((sum, item) => sum + item.availableQuantity, 0);

    const recentEvents = this.materialEvents
      .slice(-10)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      enabled: this.config.enabled,
      inventory: Array.from(this.inventory.values()),
      totalItems: this.inventory.size,
      totalQuantity,
      totalAllocated,
      totalAvailable,
      overallUtilization: this.getOverallUtilizationRate(),
      activeAllocations: this.materialAllocations.size,
      activeDeployments: this.materialDeployments.filter(deploy => deploy.status === 'ACTIVE').length,
      recentEvents,
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<MaterialMarginManagementSystem['config']>): void {
    this.config = { ...this.config, ...newConfig };
    this.startInventoryIntervals(); // Restart intervals
    console.log(`⚙️ Material Margin Management System configuration updated.`);
  }

  /**
   * Get current configuration
   */
  public getConfig(): MaterialMarginManagementSystem['config'] {
    return { ...this.config };
  }

  /**
   * Shutdown the system
   */
  public shutdown(): void {
    if (this.inventoryInterval) {
      clearInterval(this.inventoryInterval);
      this.inventoryInterval = null;
    }
    if (this.reorderInterval) {
      clearInterval(this.reorderInterval);
      this.reorderInterval = null;
    }
    console.log(`📦 Material Margin Management System shut down.`);
  }
}
