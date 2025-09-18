/**
 * Margin Management System Implementation
 *
 * Manages different types of margins (time, capacity, material, financial)
 * and their allocation/deployment based on signals and system state.
 * Implements Rule 4: Operate with Margin from The Aegrid Rules.
 *
 * @file lib/margin-management-system.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  MarginType,
  MarginAllocation,
  MarginDeployment,
  Signal,
  SignalType,
  SignalSeverity,
  ResilienceMode,
  ResponseActionType,
  MarginStatus,
  MarginUtilization,
  MarginThreshold,
  MarginPolicy,
  MarginEvent,
  MarginEventType,
  MarginConfiguration,
  MarginMetrics,
  MarginForecast,
  MarginRecommendation
} from './resilience-types';

/**
 * Margin Management System Class
 *
 * Manages system margins to ensure operational resilience:
 * - Dynamic margin allocation based on risk and signals
 * - Proactive margin deployment before critical thresholds
 * - Margin utilization monitoring and optimization
 * - Predictive margin forecasting and recommendations
 */
export class MarginManagementSystem {
  private config: MarginConfiguration;
  private currentAllocations: Map<MarginType, MarginAllocation> = new Map();
  private deploymentHistory: MarginDeployment[] = [];
  private utilizationHistory: MarginUtilization[] = [];
  private marginEvents: MarginEvent[] = [];
  private thresholds: Map<MarginType, MarginThreshold> = new Map();
  private policies: MarginPolicy[] = [];

  constructor(config: MarginConfiguration) {
    this.config = config;
    this.initializeDefaultThresholds();
    this.initializeDefaultPolicies();
    this.initializeDefaultAllocations();
  }

  /**
   * Initialize default margin thresholds
   */
  private initializeDefaultThresholds(): void {
    const defaultThresholds: MarginThreshold[] = [
      {
        marginType: MarginType.TIME,
        warningThreshold: 20, // 20% margin remaining
        criticalThreshold: 10, // 10% margin remaining
        emergencyThreshold: 5, // 5% margin remaining
        optimalRange: { min: 15, max: 30 }, // Optimal margin range
        isActive: true
      },
      {
        marginType: MarginType.CAPACITY,
        warningThreshold: 25,
        criticalThreshold: 15,
        emergencyThreshold: 8,
        optimalRange: { min: 20, max: 40 },
        isActive: true
      },
      {
        marginType: MarginType.MATERIAL,
        warningThreshold: 30,
        criticalThreshold: 20,
        emergencyThreshold: 10,
        optimalRange: { min: 25, max: 50 },
        isActive: true
      },
      {
        marginType: MarginType.FINANCIAL,
        warningThreshold: 15,
        criticalThreshold: 8,
        emergencyThreshold: 3,
        optimalRange: { min: 10, max: 25 },
        isActive: true
      }
    ];

    defaultThresholds.forEach(threshold => {
      this.thresholds.set(threshold.marginType, threshold);
    });
  }

  /**
   * Initialize default margin policies
   */
  private initializeDefaultPolicies(): void {
    this.policies = [
      {
        id: 'emergency-response-policy',
        name: 'Emergency Response Policy',
        description: 'Deploy maximum available margins during emergency situations',
        triggerConditions: {
          signalTypes: [SignalType.EMERGENCY, SignalType.ASSET_CONDITION],
          severityLevels: [SignalSeverity.CRITICAL],
          resilienceModes: [ResilienceMode.EMERGENCY, ResilienceMode.HIGH_STRESS]
        },
        allocationRules: {
          timeMargin: { min: 80, max: 100, priority: 1 },
          capacityMargin: { min: 80, max: 100, priority: 1 },
          materialMargin: { min: 80, max: 100, priority: 1 },
          financialMargin: { min: 80, max: 100, priority: 1 }
        },
        deploymentStrategy: 'immediate',
        isActive: true
      },
      {
        id: 'risk-escalation-policy',
        name: 'Risk Escalation Policy',
        description: 'Increase margins when risk levels escalate',
        triggerConditions: {
          signalTypes: [SignalType.RISK_ESCALATION],
          severityLevels: [SignalSeverity.HIGH, SignalSeverity.MEDIUM],
          resilienceModes: [ResilienceMode.ELEVATED]
        },
        allocationRules: {
          timeMargin: { min: 20, max: 50, priority: 2 },
          capacityMargin: { min: 25, max: 60, priority: 2 },
          materialMargin: { min: 30, max: 70, priority: 2 },
          financialMargin: { min: 15, max: 40, priority: 2 }
        },
        deploymentStrategy: 'graduated',
        isActive: true
      },
      {
        id: 'maintenance-window-policy',
        name: 'Maintenance Window Policy',
        description: 'Allocate additional margins during planned maintenance',
        triggerConditions: {
          signalTypes: [SignalType.MAINTENANCE],
          severityLevels: [SignalSeverity.LOW, SignalSeverity.MEDIUM],
          resilienceModes: [ResilienceMode.MAINTENANCE]
        },
        allocationRules: {
          timeMargin: { min: 30, max: 60, priority: 3 },
          capacityMargin: { min: 20, max: 40, priority: 3 },
          materialMargin: { min: 40, max: 80, priority: 3 },
          financialMargin: { min: 10, max: 30, priority: 3 }
        },
        deploymentStrategy: 'scheduled',
        isActive: true
      },
      {
        id: 'normal-operations-policy',
        name: 'Normal Operations Policy',
        description: 'Maintain optimal margins during normal operations',
        triggerConditions: {
          signalTypes: [],
          severityLevels: [SignalSeverity.LOW],
          resilienceModes: [ResilienceMode.NORMAL]
        },
        allocationRules: {
          timeMargin: { min: 15, max: 30, priority: 4 },
          capacityMargin: { min: 20, max: 40, priority: 4 },
          materialMargin: { min: 25, max: 50, priority: 4 },
          financialMargin: { min: 10, max: 25, priority: 4 }
        },
        deploymentStrategy: 'maintenance',
        isActive: true
      }
    ];
  }

  /**
   * Initialize default margin allocations
   */
  private initializeDefaultAllocations(): void {
    const defaultAllocations: MarginAllocation[] = [
      {
        marginType: MarginType.TIME,
        totalMargin: 100, // 100 hours
        allocatedMargin: 20, // 20 hours allocated
        availableMargin: 80, // 80 hours available
        utilizationRate: 0.2, // 20% utilization
        lastUpdated: new Date(),
        status: MarginStatus.AVAILABLE
      },
      {
        marginType: MarginType.CAPACITY,
        totalMargin: 1000, // 1000 units
        allocatedMargin: 200, // 200 units allocated
        availableMargin: 800, // 800 units available
        utilizationRate: 0.2,
        lastUpdated: new Date(),
        status: MarginStatus.AVAILABLE
      },
      {
        marginType: MarginType.MATERIAL,
        totalMargin: 500, // 500 units
        allocatedMargin: 100, // 100 units allocated
        availableMargin: 400, // 400 units available
        utilizationRate: 0.2,
        lastUpdated: new Date(),
        status: MarginStatus.AVAILABLE
      },
      {
        marginType: MarginType.FINANCIAL,
        totalMargin: 100000, // $100,000
        allocatedMargin: 20000, // $20,000 allocated
        availableMargin: 80000, // $80,000 available
        utilizationRate: 0.2,
        lastUpdated: new Date(),
        status: MarginStatus.AVAILABLE
      }
    ];

    defaultAllocations.forEach(allocation => {
      this.currentAllocations.set(allocation.marginType, allocation);
    });
  }

  /**
   * Process signals and update margin allocations
   */
  public async processSignals(
    signals: Signal[],
    currentMode: ResilienceMode
  ): Promise<{
    allocations: MarginAllocation[];
    deployments: MarginDeployment[];
    recommendations: MarginRecommendation[];
    events: MarginEvent[];
  }> {
    if (!this.config.enabled) {
      return { allocations: [], deployments: [], recommendations: [], events: [] };
    }

    // Filter out invalid signals
    const validSignals = signals.filter(signal => 
      signal && 
      signal.type && 
      signal.severity && 
      signal.timestamp &&
      typeof signal.type === 'string' &&
      typeof signal.severity === 'string'
    );

    console.log(`💰 Processing ${validSignals.length} signals for margin management...`);

    const allocations: MarginAllocation[] = [];
    const deployments: MarginDeployment[] = [];
    const recommendations: MarginRecommendation[] = [];
    const events: MarginEvent[] = [];

    // If no valid signals, return current allocations
    if (validSignals.length === 0) {
      return {
        allocations: Array.from(this.currentAllocations.values()),
        deployments: [],
        recommendations: [],
        events: []
      };
    }

    // Determine applicable policies based on signals and mode
    const applicablePolicies = this.getApplicablePolicies(validSignals, currentMode);
    
    // If no policies apply, use default allocations
    if (applicablePolicies.length === 0) {
      return {
        allocations: Array.from(this.currentAllocations.values()),
        deployments: [],
        recommendations: [],
        events: []
      };
    }
    
    for (const policy of applicablePolicies) {
      console.log(`📋 Applying policy: ${policy.name}`);

      // Calculate new allocations based on policy
      const policyAllocations = await this.calculatePolicyAllocations(policy, validSignals);
      allocations.push(...policyAllocations);

      // Determine if margins need to be deployed
      const policyDeployments = await this.determineMarginDeployments(policyAllocations, validSignals);
      deployments.push(...policyDeployments);

      // Generate recommendations
      const policyRecommendations = await this.generateRecommendations(policyAllocations, validSignals);
      recommendations.push(...policyRecommendations);

      // Record margin events
      const policyEvents = this.recordMarginEvents(policy, policyAllocations, policyDeployments);
      events.push(...policyEvents);
    }

    // Update current allocations
    this.updateCurrentAllocations(allocations);

    // Execute deployments
    await this.executeDeployments(deployments);

    // Update utilization history
    this.updateUtilizationHistory();

    return { allocations, deployments, recommendations, events };
  }

  /**
   * Get applicable policies based on signals and current mode
   */
  private getApplicablePolicies(signals: Signal[], currentMode: ResilienceMode): MarginPolicy[] {
    const applicablePolicies = this.policies.filter(policy => {
      if (!policy.isActive) return false;

      // Check signal types
      if (policy.triggerConditions.signalTypes.length > 0) {
        const hasRequiredSignalType = policy.triggerConditions.signalTypes.some(type =>
          signals.some(signal => signal.type === type)
        );
        if (!hasRequiredSignalType) return false;
      }

      // Check severity levels
      if (policy.triggerConditions.severityLevels.length > 0) {
        const hasRequiredSeverity = policy.triggerConditions.severityLevels.some(severity =>
          signals.some(signal => signal.severity === severity)
        );
        if (!hasRequiredSeverity) return false;
      }

      // Check resilience mode
      if (policy.triggerConditions.resilienceModes.length > 0) {
        if (!policy.triggerConditions.resilienceModes.includes(currentMode)) return false;
      }

      return true;
    });

    // If no specific policies match, return the normal operations policy as fallback
    if (applicablePolicies.length === 0) {
      const normalPolicy = this.policies.find(p => p.id === 'normal-operations-policy');
      return normalPolicy ? [normalPolicy] : [];
    }

    return applicablePolicies;
  }

  /**
   * Calculate margin allocations based on policy
   */
  private async calculatePolicyAllocations(
    policy: MarginPolicy,
    signals: Signal[]
  ): Promise<MarginAllocation[]> {
    const allocations: MarginAllocation[] = [];

    // Get all margin types from current allocations
    const marginTypes = Array.from(this.currentAllocations.keys());
    
    for (const marginType of marginTypes) {
      const currentAllocation = this.currentAllocations.get(marginType);
      if (!currentAllocation) continue;

      // Get rules for this margin type
      const rules = policy.allocationRules[marginType.toLowerCase() + 'Margin' as keyof typeof policy.allocationRules];
      if (!rules) continue;

      // Calculate new allocation based on rules and signal severity
      const severityMultiplier = this.calculateSeverityMultiplier(signals);
      const newAllocatedMargin = Math.min(
        currentAllocation.totalMargin,
        Math.max(
          rules.min,
          Math.min(rules.max, currentAllocation.allocatedMargin * severityMultiplier)
        )
      );

      const newAvailableMargin = currentAllocation.totalMargin - newAllocatedMargin;
      const newUtilizationRate = newAllocatedMargin / currentAllocation.totalMargin;

      const allocation: MarginAllocation = {
        marginType: marginType,
        totalMargin: currentAllocation.totalMargin,
        allocatedMargin: newAllocatedMargin,
        availableMargin: newAvailableMargin,
        utilizationRate: newUtilizationRate,
        lastUpdated: new Date(),
        status: this.determineMarginStatus(newUtilizationRate, marginType)
      };

      allocations.push(allocation);
    }

    return allocations;
  }

  /**
   * Calculate severity multiplier based on signals
   */
  private calculateSeverityMultiplier(signals: Signal[]): number {
    let multiplier = 1.0;

    for (const signal of signals) {
      switch (signal.severity) {
        case SignalSeverity.CRITICAL:
          multiplier += 0.5;
          break;
        case SignalSeverity.HIGH:
          multiplier += 0.3;
          break;
        case SignalSeverity.MEDIUM:
          multiplier += 0.1;
          break;
        case SignalSeverity.LOW:
          multiplier += 0.05;
          break;
      }
    }

    return Math.min(2.0, multiplier); // Cap at 2x
  }

  /**
   * Determine margin status based on utilization rate
   */
  private determineMarginStatus(utilizationRate: number, marginType: MarginType): MarginStatus {
    const threshold = this.thresholds.get(marginType);
    if (!threshold) return MarginStatus.AVAILABLE;

    const remainingMargin = (1 - utilizationRate) * 100;

    if (remainingMargin <= threshold.emergencyThreshold) {
      return MarginStatus.EMERGENCY;
    } else if (remainingMargin <= threshold.criticalThreshold) {
      return MarginStatus.CRITICAL;
    } else if (remainingMargin <= threshold.warningThreshold) {
      return MarginStatus.WARNING;
    } else {
      return MarginStatus.AVAILABLE;
    }
  }

  /**
   * Determine if margins need to be deployed
   */
  private async determineMarginDeployments(
    allocations: MarginAllocation[],
    signals: Signal[]
  ): Promise<MarginDeployment[]> {
    const deployments: MarginDeployment[] = [];

    for (const allocation of allocations) {
      const threshold = this.thresholds.get(allocation.marginType);
      if (!threshold) continue;

      const remainingMargin = (1 - allocation.utilizationRate) * 100;

      // Check if deployment is needed - be more aggressive for emergency signals
      const isEmergency = signals.some(s => s.severity === SignalSeverity.CRITICAL);
      
      // For emergency signals, always deploy if utilization is high
      if (isEmergency && allocation.utilizationRate >= 0.8) {
        const deploymentAmount = this.calculateDeploymentAmount(allocation, threshold);
        
        const deployment: MarginDeployment = {
          id: `deployment-${Date.now()}-${allocation.marginType}`,
          marginType: allocation.marginType,
          amount: deploymentAmount,
          reason: `Emergency signal detected - high utilization: ${(allocation.utilizationRate * 100).toFixed(1)}%`,
          priority: 1, // Highest priority for emergency
          requestedBy: 'margin-management-system',
          requestedAt: new Date(),
          status: 'pending',
          estimatedDuration: this.calculateDeploymentDuration(allocation.marginType, deploymentAmount),
          expectedOutcome: this.generateExpectedOutcome(allocation.marginType, deploymentAmount)
        };

        deployments.push(deployment);
      } else {
        // Normal deployment logic for non-emergency situations
        const remainingMargin = (1 - allocation.utilizationRate) * 100;
        const deploymentThreshold = threshold.criticalThreshold;

        if (remainingMargin <= deploymentThreshold) {
          const deploymentAmount = this.calculateDeploymentAmount(allocation, threshold);
          
          const deployment: MarginDeployment = {
            id: `deployment-${Date.now()}-${allocation.marginType}`,
            marginType: allocation.marginType,
            amount: deploymentAmount,
            reason: `Critical threshold reached: ${remainingMargin.toFixed(1)}% remaining`,
            priority: this.calculateDeploymentPriority(allocation.status),
            requestedBy: 'margin-management-system',
            requestedAt: new Date(),
            status: 'pending',
            estimatedDuration: this.calculateDeploymentDuration(allocation.marginType, deploymentAmount),
            expectedOutcome: this.generateExpectedOutcome(allocation.marginType, deploymentAmount)
          };

          deployments.push(deployment);
        }
      }
    }

    return deployments;
  }

  /**
   * Calculate deployment amount based on allocation and threshold
   */
  private calculateDeploymentAmount(
    allocation: MarginAllocation,
    threshold: MarginThreshold
  ): number {
    const targetMargin = threshold.optimalRange.max;
    const currentMargin = (1 - allocation.utilizationRate) * 100;
    const marginGap = targetMargin - currentMargin;
    
    return Math.min(allocation.availableMargin, (marginGap / 100) * allocation.totalMargin);
  }

  /**
   * Calculate deployment priority based on margin status
   */
  private calculateDeploymentPriority(status: MarginStatus): number {
    switch (status) {
      case MarginStatus.EMERGENCY:
        return 1;
      case MarginStatus.CRITICAL:
        return 2;
      case MarginStatus.WARNING:
        return 3;
      default:
        return 4;
    }
  }

  /**
   * Calculate deployment duration based on margin type and amount
   */
  private calculateDeploymentDuration(marginType: MarginType, amount: number): number {
    const baseDuration = {
      [MarginType.TIME]: 60, // 1 hour
      [MarginType.CAPACITY]: 30, // 30 minutes
      [MarginType.MATERIAL]: 120, // 2 hours
      [MarginType.FINANCIAL]: 15 // 15 minutes
    };

    const scalingFactor = Math.min(2.0, amount / 100); // Scale with amount
    return baseDuration[marginType] * scalingFactor;
  }

  /**
   * Generate expected outcome for deployment
   */
  private generateExpectedOutcome(marginType: MarginType, amount: number): string {
    const outcomes = {
      [MarginType.TIME]: `Increase available time buffer by ${amount} hours`,
      [MarginType.CAPACITY]: `Increase system capacity by ${amount} units`,
      [MarginType.MATERIAL]: `Increase material inventory by ${amount} units`,
      [MarginType.FINANCIAL]: `Increase financial buffer by $${amount.toLocaleString()}`
    };

    return outcomes[marginType];
  }

  /**
   * Generate margin recommendations
   */
  private async generateRecommendations(
    allocations: MarginAllocation[],
    signals: Signal[]
  ): Promise<MarginRecommendation[]> {
    const recommendations: MarginRecommendation[] = [];

    for (const allocation of allocations) {
      const threshold = this.thresholds.get(allocation.marginType);
      if (!threshold) continue;

      const remainingMargin = (1 - allocation.utilizationRate) * 100;

      // Generate recommendations based on margin status
      if (remainingMargin < threshold.optimalRange.min) {
        recommendations.push({
          id: `rec-${Date.now()}-${allocation.marginType}`,
          marginType: allocation.marginType,
          recommendationType: 'increase_allocation',
          priority: 'high',
          description: `Increase ${allocation.marginType} margin allocation to maintain optimal range`,
          rationale: `Current margin (${remainingMargin.toFixed(1)}%) below optimal minimum (${threshold.optimalRange.min}%)`,
          suggestedAction: `Allocate additional ${this.calculateRecommendedAmount(allocation, threshold)} units`,
          expectedBenefit: 'Improved system resilience and reduced risk',
          implementationEffort: 'medium',
          estimatedCost: this.calculateRecommendationCost(allocation.marginType),
          timeframe: 'immediate'
        });
      } else if (remainingMargin > threshold.optimalRange.max) {
        recommendations.push({
          id: `rec-${Date.now()}-${allocation.marginType}`,
          marginType: allocation.marginType,
          recommendationType: 'optimize_allocation',
          priority: 'medium',
          description: `Optimize ${allocation.marginType} margin allocation for better efficiency`,
          rationale: `Current margin (${remainingMargin.toFixed(1)}%) above optimal maximum (${threshold.optimalRange.max}%)`,
          suggestedAction: `Reduce allocation by ${this.calculateOptimizationAmount(allocation, threshold)} units`,
          expectedBenefit: 'Improved resource utilization and cost efficiency',
          implementationEffort: 'low',
          estimatedCost: -this.calculateRecommendationCost(allocation.marginType) * 0.5,
          timeframe: 'planned'
        });
      }
    }

    return recommendations;
  }

  /**
   * Calculate recommended amount for margin increase
   */
  private calculateRecommendedAmount(
    allocation: MarginAllocation,
    threshold: MarginThreshold
  ): number {
    const targetUtilization = 1 - (threshold.optimalRange.min / 100);
    const currentUtilization = allocation.utilizationRate;
    const increaseNeeded = targetUtilization - currentUtilization;
    
    return Math.max(0, increaseNeeded * allocation.totalMargin);
  }

  /**
   * Calculate optimization amount for margin reduction
   */
  private calculateOptimizationAmount(
    allocation: MarginAllocation,
    threshold: MarginThreshold
  ): number {
    const targetUtilization = 1 - (threshold.optimalRange.max / 100);
    const currentUtilization = allocation.utilizationRate;
    const reductionNeeded = currentUtilization - targetUtilization;
    
    return Math.max(0, reductionNeeded * allocation.totalMargin);
  }

  /**
   * Calculate recommendation cost
   */
  private calculateRecommendationCost(marginType: MarginType): number {
    const baseCosts = {
      [MarginType.TIME]: 100, // $100 per hour
      [MarginType.CAPACITY]: 50, // $50 per unit
      [MarginType.MATERIAL]: 25, // $25 per unit
      [MarginType.FINANCIAL]: 1 // $1 per dollar
    };

    return baseCosts[marginType] || 0;
  }

  /**
   * Record margin events
   */
  private recordMarginEvents(
    policy: MarginPolicy,
    allocations: MarginAllocation[],
    deployments: MarginDeployment[]
  ): MarginEvent[] {
    const events: MarginEvent[] = [];

    // Record allocation events
    for (const allocation of allocations) {
      const event: MarginEvent = {
        id: `event-${Date.now()}-${allocation.marginType}`,
        timestamp: new Date(),
        eventType: MarginEventType.ALLOCATION_UPDATE,
        marginType: allocation.marginType,
        description: `Margin allocation updated for ${allocation.marginType}`,
        details: {
          previousAllocation: this.currentAllocations.get(allocation.marginType)?.allocatedMargin || 0,
          newAllocation: allocation.allocatedMargin,
          utilizationRate: allocation.utilizationRate,
          status: allocation.status
        },
        impact: this.calculateEventImpact(allocation),
        policyApplied: policy.id
      };
      events.push(event);
    }

    // Record deployment events
    for (const deployment of deployments) {
      const event: MarginEvent = {
        id: `event-${Date.now()}-deploy-${deployment.marginType}`,
        timestamp: new Date(),
        eventType: MarginEventType.MARGIN_DEPLOYMENT,
        marginType: deployment.marginType,
        description: `Margin deployment initiated for ${deployment.marginType}`,
        details: {
          deploymentAmount: deployment.amount,
          reason: deployment.reason,
          priority: deployment.priority,
          expectedDuration: deployment.estimatedDuration
        },
        impact: this.calculateDeploymentImpact(deployment),
        policyApplied: policy.id
      };
      events.push(event);
    }

    return events;
  }

  /**
   * Calculate event impact
   */
  private calculateEventImpact(allocation: MarginAllocation): 'low' | 'medium' | 'high' {
    const utilizationChange = Math.abs(allocation.utilizationRate - 0.2); // Compare to baseline 20%
    
    if (utilizationChange > 0.3) return 'high';
    if (utilizationChange > 0.15) return 'medium';
    return 'low';
  }

  /**
   * Calculate deployment impact
   */
  private calculateDeploymentImpact(deployment: MarginDeployment): 'low' | 'medium' | 'high' {
    switch (deployment.priority) {
      case 1: return 'high';
      case 2: return 'high';
      case 3: return 'medium';
      default: return 'low';
    }
  }

  /**
   * Update current allocations
   */
  private updateCurrentAllocations(allocations: MarginAllocation[]): void {
    for (const allocation of allocations) {
      this.currentAllocations.set(allocation.marginType, allocation);
    }
  }

  /**
   * Execute margin deployments
   */
  private async executeDeployments(deployments: MarginDeployment[]): Promise<void> {
    for (const deployment of deployments) {
      console.log(`🚀 Executing margin deployment: ${deployment.marginType} - ${deployment.amount} units`);
      
      // Simulate deployment execution
      deployment.status = 'in_progress';
      deployment.startedAt = new Date();
      
      // In a real system, this would trigger actual margin deployment
      // For now, we'll simulate the deployment
      setTimeout(() => {
        deployment.status = 'completed';
        deployment.completedAt = new Date();
        console.log(`✅ Margin deployment completed: ${deployment.marginType}`);
      }, deployment.estimatedDuration * 1000); // Convert to milliseconds
      
      this.deploymentHistory.push(deployment);
    }
  }

  /**
   * Update utilization history
   */
  private updateUtilizationHistory(): void {
    const timestamp = new Date();
    
    for (const [marginType, allocation] of this.currentAllocations) {
      const utilization: MarginUtilization = {
        marginType,
        utilizationRate: allocation.utilizationRate,
        availableMargin: allocation.availableMargin,
        allocatedMargin: allocation.allocatedMargin,
        timestamp,
        status: allocation.status
      };
      
      this.utilizationHistory.push(utilization);
    }

    // Keep only recent history (last 30 days)
    const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.utilizationHistory = this.utilizationHistory.filter(
      util => util.timestamp.getTime() >= cutoffTime
    );
  }

  /**
   * Get current margin status
   */
  public getStatus(): {
    allocations: MarginAllocation[];
    activeDeployments: MarginDeployment[];
    recentEvents: MarginEvent[];
    utilizationTrends: MarginUtilization[];
    recommendations: MarginRecommendation[];
  } {
    const activeDeployments = this.deploymentHistory.filter(d => d.status === 'in_progress');
    const recentEvents = this.marginEvents.slice(-10); // Last 10 events
    const utilizationTrends = this.utilizationHistory.slice(-24); // Last 24 data points

    return {
      allocations: Array.from(this.currentAllocations.values()),
      activeDeployments,
      recentEvents,
      utilizationTrends,
      recommendations: [] // Will be populated by processSignals
    };
  }

  /**
   * Get margin metrics
   */
  public getMetrics(): MarginMetrics {
    const allocations = Array.from(this.currentAllocations.values());
    const totalMargin = allocations.reduce((sum, a) => sum + a.totalMargin, 0);
    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedMargin, 0);
    const totalAvailable = allocations.reduce((sum, a) => sum + a.availableMargin, 0);
    const averageUtilization = allocations.reduce((sum, a) => sum + a.utilizationRate, 0) / allocations.length;

    return {
      totalMargin,
      totalAllocated,
      totalAvailable,
      averageUtilization,
      marginEfficiency: totalAvailable / totalMargin,
      criticalMargins: allocations.filter(a => a.status === MarginStatus.CRITICAL || a.status === MarginStatus.EMERGENCY).length,
      optimalMargins: allocations.filter(a => a.status === MarginStatus.AVAILABLE).length,
      lastUpdated: new Date()
    };
  }

  /**
   * Generate margin forecast
   */
  public generateForecast(timeHorizon: number = 7): MarginForecast {
    const allocations = Array.from(this.currentAllocations.values());
    const forecast: MarginForecast = {
      timeHorizon,
      generatedAt: new Date(),
      projections: [],
      confidence: 0.8,
      assumptions: [
        'Current utilization trends continue',
        'No major system changes',
        'Standard operational patterns'
      ]
    };

    for (const allocation of allocations) {
      const currentTrend = this.calculateUtilizationTrend(allocation.marginType);
      const projection = {
        marginType: allocation.marginType,
        currentUtilization: allocation.utilizationRate,
        projectedUtilization: Math.min(1.0, allocation.utilizationRate + (currentTrend * timeHorizon)),
        projectedAvailable: Math.max(0, allocation.totalMargin * (1 - Math.min(1.0, allocation.utilizationRate + (currentTrend * timeHorizon)))),
        riskLevel: this.calculateProjectionRisk(allocation, currentTrend, timeHorizon),
        recommendations: this.generateForecastRecommendations(allocation, currentTrend, timeHorizon)
      };
      
      forecast.projections.push(projection);
    }

    return forecast;
  }

  /**
   * Calculate utilization trend for a margin type
   */
  private calculateUtilizationTrend(marginType: MarginType): number {
    const recentUtilizations = this.utilizationHistory
      .filter(u => u.marginType === marginType)
      .slice(-10); // Last 10 data points

    if (recentUtilizations.length < 2) return 0;

    // Simple linear trend calculation
    const first = recentUtilizations[0];
    const last = recentUtilizations[recentUtilizations.length - 1];
    const timeDiff = (last.timestamp.getTime() - first.timestamp.getTime()) / (1000 * 60 * 60 * 24); // days
    
    if (timeDiff === 0) return 0;
    
    return (last.utilizationRate - first.utilizationRate) / timeDiff;
  }

  /**
   * Calculate projection risk
   */
  private calculateProjectionRisk(
    allocation: MarginAllocation,
    trend: number,
    timeHorizon: number
  ): 'low' | 'medium' | 'high' {
    const projectedUtilization = allocation.utilizationRate + (trend * timeHorizon);
    const threshold = this.thresholds.get(allocation.marginType);
    
    if (!threshold) return 'medium';
    
    const projectedRemainingMargin = (1 - projectedUtilization) * 100;
    
    if (projectedRemainingMargin <= threshold.emergencyThreshold) return 'high';
    if (projectedRemainingMargin <= threshold.criticalThreshold) return 'high';
    if (projectedRemainingMargin <= threshold.warningThreshold) return 'medium';
    return 'low';
  }

  /**
   * Generate forecast recommendations
   */
  private generateForecastRecommendations(
    allocation: MarginAllocation,
    trend: number,
    timeHorizon: number
  ): string[] {
    const recommendations: string[] = [];
    const projectedUtilization = allocation.utilizationRate + (trend * timeHorizon);
    const threshold = this.thresholds.get(allocation.marginType);
    
    if (!threshold) return recommendations;
    
    const projectedRemainingMargin = (1 - projectedUtilization) * 100;
    
    if (projectedRemainingMargin <= threshold.warningThreshold) {
      recommendations.push(`Consider increasing ${allocation.marginType} margin allocation`);
    }
    
    if (trend > 0.01) { // Increasing utilization trend
      recommendations.push(`Monitor ${allocation.marginType} utilization closely - upward trend detected`);
    }
    
    if (projectedRemainingMargin <= threshold.criticalThreshold) {
      recommendations.push(`Prepare emergency margin deployment for ${allocation.marginType}`);
    }
    
    return recommendations;
  }

  /**
   * Update margin configuration
   */
  public updateConfig(newConfig: Partial<MarginConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Margin management configuration updated');
  }

  /**
   * Update margin thresholds
   */
  public updateThresholds(thresholds: MarginThreshold[]): void {
    thresholds.forEach(threshold => {
      this.thresholds.set(threshold.marginType, threshold);
    });
    console.log('📊 Margin thresholds updated');
  }

  /**
   * Update margin policies
   */
  public updatePolicies(policies: MarginPolicy[]): void {
    this.policies = policies;
    console.log('📋 Margin policies updated');
  }
}
