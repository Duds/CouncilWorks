/**
 * Antifragile System Implementation
 * 
 * Implements systems that get stronger under stress, following antifragile principles
 * Aligned with The Aegrid Rules for resilient asset management
 * 
 * @file lib/antifragile-system.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  AntifragileConfig,
  AntifragilePattern,
  StressEvent,
  StressAdaptationType,
  Signal,
  SignalType,
  SignalSeverity,
  ResponseActionType,
  MarginAllocation,
  ResilienceMode
} from './resilience-types';

/**
 * Antifragile System Class
 * 
 * Manages systems that improve under stress through:
 * - Pattern recognition and learning
 * - Stress adaptation mechanisms
 * - Performance improvement tracking
 * - Adaptive threshold adjustment
 */
export class AntifragileSystem {
  private config: AntifragileConfig;
  private patterns: Map<string, AntifragilePattern>;
  private stressEvents: StressEvent[];
  private adaptationHistory: Array<{
    timestamp: Date;
    adaptationType: StressAdaptationType;
    performanceImpact: number;
    success: boolean;
  }>;

  constructor(config: AntifragileConfig) {
    this.config = config;
    this.patterns = new Map();
    this.stressEvents = [];
    this.adaptationHistory = [];
    
    this.initializeDefaultPatterns();
  }

  /**
   * Initialize default antifragile patterns
   */
  private initializeDefaultPatterns(): void {
    const defaultPatterns: AntifragilePattern[] = [
      {
        id: 'high-load-capacity-scaling',
        name: 'High Load Capacity Scaling',
        description: 'Automatically scale capacity when under high load',
        triggerConditions: {
          minStressLevel: 70,
          requiredSignals: [SignalType.PERFORMANCE_DEGRADATION],
          durationThreshold: 300000 // 5 minutes
        },
        adaptations: [StressAdaptationType.CAPACITY_SCALING],
        successMetrics: {
          performanceImprovement: 15,
          efficiencyGain: 10,
          capacityIncrease: 20
        },
        isActive: false,
        activationCount: 0,
        successRate: 0
      },
      {
        id: 'stress-learning-pattern',
        name: 'Stress Learning Pattern',
        description: 'Learn from stress events to improve future responses',
        triggerConditions: {
          minStressLevel: 60,
          requiredSignals: [SignalType.RISK_ESCALATION, SignalType.ASSET_CONDITION],
          durationThreshold: 600000 // 10 minutes
        },
        adaptations: [StressAdaptationType.STRESS_LEARNING, StressAdaptationType.THRESHOLD_ADAPTATION],
        successMetrics: {
          performanceImprovement: 10,
          efficiencyGain: 15,
          capacityIncrease: 5
        },
        isActive: false,
        activationCount: 0,
        successRate: 0
      },
      {
        id: 'efficiency-improvement-pattern',
        name: 'Efficiency Improvement Pattern',
        description: 'Improve system efficiency under moderate stress',
        triggerConditions: {
          minStressLevel: 50,
          requiredSignals: [SignalType.MAINTENANCE, SignalType.ENVIRONMENTAL],
          durationThreshold: 900000 // 15 minutes
        },
        adaptations: [StressAdaptationType.EFFICIENCY_IMPROVEMENT],
        successMetrics: {
          performanceImprovement: 8,
          efficiencyGain: 20,
          capacityIncrease: 0
        },
        isActive: false,
        activationCount: 0,
        successRate: 0
      }
    ];

    defaultPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  /**
   * Process stress event and determine antifragile responses
   */
  async processStressEvent(signals: Signal[]): Promise<{
    activatedPatterns: AntifragilePattern[];
    adaptations: StressAdaptationType[];
    performanceImprovements: string[];
  }> {
    console.log(`🧠 Processing stress event with ${signals.length} signals...`);

    const activatedPatterns: AntifragilePattern[] = [];
    const adaptations: StressAdaptationType[] = [];
    const performanceImprovements: string[] = [];

    // Calculate current stress level
    const stressLevel = this.calculateStressLevel(signals);
    
    // Check for pattern activation
    for (const pattern of this.patterns.values()) {
      if (this.shouldActivatePattern(pattern, signals, stressLevel)) {
        console.log(`🎯 Activating antifragile pattern: ${pattern.name}`);
        
        // Activate pattern
        pattern.isActive = true;
        pattern.lastActivated = new Date();
        pattern.activationCount++;
        
        activatedPatterns.push(pattern);
        
        // Execute adaptations
        for (const adaptation of pattern.adaptations) {
          const improvement = await this.executeAdaptation(adaptation, signals);
          adaptations.push(adaptation);
          
          if (improvement.success) {
            performanceImprovements.push(improvement.description);
            this.recordAdaptation(adaptation, improvement.performanceImpact, true);
          } else {
            this.recordAdaptation(adaptation, 0, false);
          }
        }
      }
    }

    // Record stress event
    const stressEvent: StressEvent = {
      id: `stress-event-${Date.now()}`,
      timestamp: new Date(),
      duration: 0, // Will be updated when event ends
      stressLevel,
      triggerSignals: signals,
      systemResponse: {
        marginsDeployed: [], // Will be populated by resilience engine
        adaptations,
        performanceMetrics: {
          responseTime: this.calculateResponseTime(signals),
          throughput: this.calculateThroughput(signals),
          errorRate: this.calculateErrorRate(signals),
          resourceUtilization: this.calculateResourceUtilization(signals)
        }
      },
      outcome: {
        success: adaptations.length > 0,
        performanceImprovement: this.calculatePerformanceImprovement(adaptations),
        lessonsLearned: this.extractLessonsLearned(signals, adaptations),
        systemImprovements: performanceImprovements
      },
      followUpActions: this.generateFollowUpActions(adaptations)
    };

    this.stressEvents.push(stressEvent);
    
    // Clean up old events
    this.cleanupOldEvents();

    return {
      activatedPatterns,
      adaptations,
      performanceImprovements
    };
  }

  /**
   * Calculate current stress level based on signals
   */
  private calculateStressLevel(signals: Signal[]): number {
    let stressLevel = 0;
    
    for (const signal of signals) {
      switch (signal.severity) {
        case SignalSeverity.CRITICAL:
          stressLevel += 40;
          break;
        case SignalSeverity.HIGH:
          stressLevel += 30;
          break;
        case SignalSeverity.MEDIUM:
          stressLevel += 20;
          break;
        case SignalSeverity.LOW:
          stressLevel += 10;
          break;
      }
    }
    
    return Math.min(100, stressLevel);
  }

  /**
   * Determine if a pattern should be activated
   */
  private shouldActivatePattern(
    pattern: AntifragilePattern,
    signals: Signal[],
    stressLevel: number
  ): boolean {
    // Check if pattern is already active and within cooldown
    if (pattern.isActive && pattern.lastActivated) {
      const timeSinceActivation = Date.now() - pattern.lastActivated.getTime();
      if (timeSinceActivation < this.config.activationCooldown) {
        return false;
      }
    }

    // Check stress level threshold
    if (stressLevel < pattern.triggerConditions.minStressLevel) {
      return false;
    }

    // Check required signal types
    const signalTypes = signals.map(s => s.type);
    const hasRequiredSignals = pattern.triggerConditions.requiredSignals.every(
      requiredType => signalTypes.includes(requiredType)
    );

    if (!hasRequiredSignals) {
      return false;
    }

    // Check success rate threshold
    if (pattern.successRate < this.config.minSuccessRate && pattern.activationCount > 0) {
      return false;
    }

    return true;
  }

  /**
   * Execute a specific adaptation mechanism
   */
  private async executeAdaptation(
    adaptation: StressAdaptationType,
    signals: Signal[]
  ): Promise<{ success: boolean; performanceImpact: number; description: string }> {
    console.log(`⚡ Executing adaptation: ${adaptation}`);

    switch (adaptation) {
      case StressAdaptationType.CAPACITY_SCALING:
        return this.executeCapacityScaling(signals);
      
      case StressAdaptationType.EFFICIENCY_IMPROVEMENT:
        return this.executeEfficiencyImprovement(signals);
      
      case StressAdaptationType.REDUNDANCY_ENHANCEMENT:
        return this.executeRedundancyEnhancement(signals);
      
      case StressAdaptationType.STRESS_LEARNING:
        return this.executeStressLearning(signals);
      
      case StressAdaptationType.THRESHOLD_ADAPTATION:
        return this.executeThresholdAdaptation(signals);
      
      default:
        return {
          success: false,
          performanceImpact: 0,
          description: `Unknown adaptation type: ${adaptation}`
        };
    }
  }

  /**
   * Execute capacity scaling adaptation
   */
  private async executeCapacityScaling(signals: Signal[]): Promise<{
    success: boolean;
    performanceImpact: number;
    description: string;
  }> {
    console.log(`📈 Scaling capacity under stress...`);
    
    // Simulate capacity scaling logic
    const scalingFactor = Math.min(2.0, 1.0 + (signals.length * 0.1));
    const performanceImpact = Math.round((scalingFactor - 1) * 100);
    
    return {
      success: true,
      performanceImpact,
      description: `Capacity scaled by ${Math.round((scalingFactor - 1) * 100)}%`
    };
  }

  /**
   * Execute efficiency improvement adaptation
   */
  private async executeEfficiencyImprovement(signals: Signal[]): Promise<{
    success: boolean;
    performanceImpact: number;
    description: string;
  }> {
    console.log(`⚙️ Improving efficiency under stress...`);
    
    // Simulate efficiency improvement logic
    const efficiencyGain = Math.min(25, signals.length * 2);
    
    return {
      success: true,
      performanceImpact: efficiencyGain,
      description: `Efficiency improved by ${efficiencyGain}%`
    };
  }

  /**
   * Execute redundancy enhancement adaptation
   */
  private async executeRedundancyEnhancement(signals: Signal[]): Promise<{
    success: boolean;
    performanceImpact: number;
    description: string;
  }> {
    console.log(`🔄 Enhancing redundancy under stress...`);
    
    // Simulate redundancy enhancement logic
    const redundancyIncrease = Math.min(15, signals.length * 1.5);
    
    return {
      success: true,
      performanceImpact: redundancyIncrease,
      description: `Redundancy enhanced by ${redundancyIncrease}%`
    };
  }

  /**
   * Execute stress learning adaptation
   */
  private async executeStressLearning(signals: Signal[]): Promise<{
    success: boolean;
    performanceImpact: number;
    description: string;
  }> {
    console.log(`🧠 Learning from stress event...`);
    
    // Analyze signals for learning opportunities
    const learningOpportunities = signals.filter(s => 
      s.severity === SignalSeverity.HIGH || s.severity === SignalSeverity.CRITICAL
    ).length;
    
    const learningImpact = Math.min(20, learningOpportunities * 5);
    
    return {
      success: true,
      performanceImpact: learningImpact,
      description: `Learned from ${learningOpportunities} critical signals`
    };
  }

  /**
   * Execute threshold adaptation
   */
  private async executeThresholdAdaptation(signals: Signal[]): Promise<{
    success: boolean;
    performanceImpact: number;
    description: string;
  }> {
    console.log(`🎯 Adapting thresholds based on stress history...`);
    
    // Analyze historical stress events for threshold adjustment
    const recentEvents = this.stressEvents.filter(e => 
      Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    const thresholdAdjustment = Math.min(10, recentEvents.length * 2);
    
    return {
      success: true,
      performanceImpact: thresholdAdjustment,
      description: `Thresholds adapted based on ${recentEvents.length} recent events`
    };
  }

  /**
   * Record adaptation in history
   */
  private recordAdaptation(
    adaptationType: StressAdaptationType,
    performanceImpact: number,
    success: boolean
  ): void {
    this.adaptationHistory.push({
      timestamp: new Date(),
      adaptationType,
      performanceImpact,
      success
    });

    // Keep only recent history
    const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
    this.adaptationHistory = this.adaptationHistory.filter(
      entry => entry.timestamp.getTime() > cutoffTime
    );
  }

  /**
   * Calculate response time based on signals
   */
  private calculateResponseTime(signals: Signal[]): number {
    // Simulate response time calculation
    const baseTime = 100; // ms
    const signalPenalty = signals.length * 10;
    return Math.max(50, baseTime + signalPenalty);
  }

  /**
   * Calculate throughput based on signals
   */
  private calculateThroughput(signals: Signal[]): number {
    // Simulate throughput calculation
    const baseThroughput = 1000; // requests per second
    const stressReduction = signals.length * 50;
    return Math.max(100, baseThroughput - stressReduction);
  }

  /**
   * Calculate error rate based on signals
   */
  private calculateErrorRate(signals: Signal[]): number {
    // Simulate error rate calculation
    const criticalSignals = signals.filter(s => s.severity === SignalSeverity.CRITICAL).length;
    const highSignals = signals.filter(s => s.severity === SignalSeverity.HIGH).length;
    
    return (criticalSignals * 0.1) + (highSignals * 0.05);
  }

  /**
   * Calculate resource utilization based on signals
   */
  private calculateResourceUtilization(signals: Signal[]): number {
    // Simulate resource utilization calculation
    const baseUtilization = 50; // percentage
    const stressIncrease = signals.length * 5;
    return Math.min(95, baseUtilization + stressIncrease);
  }

  /**
   * Calculate performance improvement from adaptations
   */
  private calculatePerformanceImprovement(adaptations: StressAdaptationType[]): number {
    return adaptations.length * 10; // Simple calculation
  }

  /**
   * Extract lessons learned from stress event
   */
  private extractLessonsLearned(signals: Signal[], adaptations: StressAdaptationType[]): string[] {
    const lessons: string[] = [];
    
    if (signals.some(s => s.severity === SignalSeverity.CRITICAL)) {
      lessons.push('Critical signals require immediate response');
    }
    
    if (adaptations.includes(StressAdaptationType.CAPACITY_SCALING)) {
      lessons.push('Capacity scaling improves system resilience');
    }
    
    if (adaptations.includes(StressAdaptationType.STRESS_LEARNING)) {
      lessons.push('Learning from stress events improves future responses');
    }
    
    return lessons;
  }

  /**
   * Generate follow-up actions based on adaptations
   */
  private generateFollowUpActions(adaptations: StressAdaptationType[]): ResponseActionType[] {
    const actions: ResponseActionType[] = [];
    
    if (adaptations.includes(StressAdaptationType.CAPACITY_SCALING)) {
      actions.push(ResponseActionType.UPDATE_CONFIG);
    }
    
    if (adaptations.includes(StressAdaptationType.STRESS_LEARNING)) {
      actions.push(ResponseActionType.NOTIFY);
    }
    
    return actions;
  }

  /**
   * Clean up old stress events
   */
  private cleanupOldEvents(): void {
    const cutoffTime = Date.now() - (this.config.eventRetentionPeriod * 24 * 60 * 60 * 1000);
    this.stressEvents = this.stressEvents.filter(
      event => event.timestamp.getTime() > cutoffTime
    );
  }

  /**
   * Get antifragile system status
   */
  getStatus(): {
    activePatterns: AntifragilePattern[];
    recentAdaptations: number;
    successRate: number;
    antifragileScore: number;
  } {
    const activePatterns = Array.from(this.patterns.values()).filter(p => p.isActive);
    
    const recentAdaptations = this.adaptationHistory.filter(
      entry => Date.now() - entry.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    ).length;
    
    const successfulAdaptations = this.adaptationHistory.filter(entry => entry.success).length;
    const successRate = this.adaptationHistory.length > 0 
      ? successfulAdaptations / this.adaptationHistory.length 
      : 0;
    
    const antifragileScore = Math.round(
      (successRate * 50) + 
      (activePatterns.length * 10) + 
      (recentAdaptations * 2)
    );

    return {
      activePatterns,
      recentAdaptations,
      successRate,
      antifragileScore: Math.min(100, antifragileScore)
    };
  }

  /**
   * Update antifragile configuration
   */
  updateConfig(newConfig: Partial<AntifragileConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Antifragile configuration updated`);
  }

  /**
   * Get all patterns
   */
  getPatterns(): AntifragilePattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get stress events
   */
  getStressEvents(): StressEvent[] {
    return [...this.stressEvents];
  }

  /**
   * Get adaptation history
   */
  getAdaptationHistory(): typeof this.adaptationHistory {
    return [...this.adaptationHistory];
  }
}
