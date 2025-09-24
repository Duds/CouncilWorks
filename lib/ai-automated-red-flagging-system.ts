/**
 * AI Automated Red-flagging System - F22.4
 *
 * Advanced AI-powered automated red-flagging with risk assessment, priority scoring,
 * exception handling, and automated response for proactive asset management
 *
 * Implements The Aegrid Rules for intelligent risk management and critical asset protection
 */

import { Asset } from '@prisma/client';
import { prisma } from './prisma';

export interface RedFlaggingConfig {
  organisationId: string;
  riskAssessment: {
    enabled: boolean;
    riskCategories: string[];
    severityLevels: string[];
    escalationThresholds: Record<string, number>;
  };
  priorityScoring: {
    enabled: boolean;
    scoringFactors: string[];
    weights: Record<string, number>;
  };
  exceptionHandling: {
    enabled: boolean;
    exceptionTypes: string[];
    handlingRules: ExceptionRule[];
  };
  automatedResponse: {
    enabled: boolean;
    responseTypes: string[];
    escalationPaths: EscalationPath[];
  };
}

export interface ExceptionRule {
  ruleId: string;
  name: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  escalationLevel: number;
}

export interface EscalationPath {
  level: number;
  name: string;
  triggers: string[];
  actions: string[];
  timeouts: number; // Minutes
}

export interface RedFlag {
  flagId: string;
  timestamp: Date;
  assetId: string;
  category: RedFlagCategory;
  severity: RedFlagSeverity;
  priority: number; // 0-100
  description: string;
  riskAssessment: RiskAssessment;
  automatedResponse: AutomatedResponse;
  escalation: EscalationInfo;
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
}

export interface RedFlagCategory {
  type: 'performance' | 'safety' | 'compliance' | 'financial' | 'operational' | 'environmental';
  subcategory: string;
  description: string;
}

export interface RedFlagSeverity {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-100
  factors: SeverityFactor[];
}

export interface SeverityFactor {
  factor: string;
  weight: number;
  contribution: number;
  description: string;
}

export interface RiskAssessment {
  overallRisk: number; // 0-100
  riskFactors: RiskFactor[];
  mitigationStrategies: MitigationStrategy[];
  residualRisk: number; // 0-100
}

export interface RiskFactor {
  factor: string;
  probability: number; // 0-1
  impact: number; // 0-1
  riskScore: number; // 0-100
  description: string;
}

export interface MitigationStrategy {
  strategy: string;
  effectiveness: number; // 0-1
  cost: number;
  implementationTime: number; // Days
  description: string;
}

export interface AutomatedResponse {
  responseId: string;
  responseType: 'notification' | 'work_order' | 'escalation' | 'maintenance' | 'shutdown';
  actions: ResponseAction[];
  executedAt: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface ResponseAction {
  action: string;
  target: string;
  parameters: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
}

export interface EscalationInfo {
  currentLevel: number;
  escalatedAt: Date;
  escalatedBy: string;
  escalationReason: string;
  nextEscalation: Date;
  escalationHistory: EscalationEvent[];
}

export interface EscalationEvent {
  level: number;
  timestamp: Date;
  triggeredBy: string;
  reason: string;
  actions: string[];
}

export class AIAutomatedRedFlaggingSystem {
  private organisationId: string;
  private config: RedFlaggingConfig;
  private activeFlags: Map<string, RedFlag> = new Map();

  constructor(organisationId: string, config?: Partial<RedFlaggingConfig>) {
    this.organisationId = organisationId;
    this.config = {
      organisationId,
      riskAssessment: config?.riskAssessment || {
        enabled: true,
        riskCategories: ['performance', 'safety', 'compliance', 'financial'],
        severityLevels: ['low', 'medium', 'high', 'critical'],
        escalationThresholds: { low: 30, medium: 60, high: 90, critical: 120 },
      },
      priorityScoring: config?.priorityScoring || {
        enabled: true,
        scoringFactors: ['severity', 'impact', 'urgency', 'complexity'],
        weights: { severity: 0.4, impact: 0.3, urgency: 0.2, complexity: 0.1 },
      },
      exceptionHandling: config?.exceptionHandling || {
        enabled: true,
        exceptionTypes: ['performance_degradation', 'safety_violation', 'compliance_breach'],
        handlingRules: this.getDefaultExceptionRules(),
      },
      automatedResponse: config?.automatedResponse || {
        enabled: true,
        responseTypes: ['notification', 'work_order', 'escalation'],
        escalationPaths: this.getDefaultEscalationPaths(),
      },
    };
  }

  /**
   * Perform comprehensive red-flagging analysis across all assets
   */
  async performRedFlaggingAnalysis(): Promise<RedFlag[]> {
    const assets = await this.getAllAssets();
    const redFlags: RedFlag[] = [];

    for (const asset of assets) {
      const assetFlags = await this.analyzeAssetForRedFlags(asset);
      redFlags.push(...assetFlags);
    }

    // Process and store red flags
    for (const flag of redFlags) {
      await this.processRedFlag(flag);
    }

    return redFlags;
  }

  /**
   * Analyze specific asset for red flags
   */
  async analyzeAssetForRedFlags(asset: Asset): Promise<RedFlag[]> {
    const flags: RedFlag[] = [];

    // Performance red flags
    const performanceFlags = await this.checkPerformanceRedFlags(asset);
    flags.push(...performanceFlags);

    // Safety red flags
    const safetyFlags = await this.checkSafetyRedFlags(asset);
    flags.push(...safetyFlags);

    // Compliance red flags
    const complianceFlags = await this.checkComplianceRedFlags(asset);
    flags.push(...complianceFlags);

    // Financial red flags
    const financialFlags = await this.checkFinancialRedFlags(asset);
    flags.push(...financialFlags);

    return flags;
  }

  /**
   * Execute automated response for red flag
   */
  async executeAutomatedResponse(flagId: string): Promise<AutomatedResponse> {
    const flag = this.activeFlags.get(flagId);
    if (!flag) throw new Error(`Red flag ${flagId} not found`);

    const response = await this.createAutomatedResponse(flag);

    // Execute response actions
    for (const action of response.actions) {
      await this.executeResponseAction(action);
    }

    // Update flag status
    flag.automatedResponse = response;
    flag.status = response.status === 'completed' ? 'acknowledged' : 'active';

    return response;
  }

  /**
   * Escalate red flag to next level
   */
  async escalateRedFlag(flagId: string, reason: string): Promise<void> {
    const flag = this.activeFlags.get(flagId);
    if (!flag) throw new Error(`Red flag ${flagId} not found`);

    const nextLevel = flag.escalation.currentLevel + 1;
    const escalationPath = this.config.automatedResponse.escalationPaths.find(p => p.level === nextLevel);

    if (!escalationPath) {
      throw new Error(`No escalation path found for level ${nextLevel}`);
    }

    // Create escalation event
    const escalationEvent: EscalationEvent = {
      level: nextLevel,
      timestamp: new Date(),
      triggeredBy: 'ai-system',
      reason,
      actions: escalationPath.actions,
    };

    // Update escalation info
    flag.escalation.currentLevel = nextLevel;
    flag.escalation.escalatedAt = new Date();
    flag.escalation.escalatedBy = 'ai-system';
    flag.escalation.escalationReason = reason;
    flag.escalation.escalationHistory.push(escalationEvent);
    flag.escalation.nextEscalation = new Date(Date.now() + escalationPath.timeouts * 60 * 1000);
    flag.status = 'escalated';

    // Execute escalation actions
    await this.executeEscalationActions(escalationPath.actions, flag);

    // Store escalation
    await this.storeRedFlag(flag);
  }

  /**
   * Get red flag dashboard data
   */
  async getRedFlagDashboard(): Promise<RedFlagDashboard> {
    const activeFlags = Array.from(this.activeFlags.values());

    return {
      totalFlags: activeFlags.length,
      criticalFlags: activeFlags.filter(f => f.severity.level === 'critical').length,
      highFlags: activeFlags.filter(f => f.severity.level === 'high').length,
      mediumFlags: activeFlags.filter(f => f.severity.level === 'medium').length,
      lowFlags: activeFlags.filter(f => f.severity.level === 'low').length,
      categories: this.groupFlagsByCategory(activeFlags),
      trends: this.calculateFlagTrends(activeFlags),
      topAssets: this.getTopAssetsWithFlags(activeFlags),
      escalationSummary: this.getEscalationSummary(activeFlags),
    };
  }

  // Private helper methods

  private async getAllAssets(): Promise<Asset[]> {
    return await prisma.asset.findMany({
      where: { organisationId: this.organisationId, assetStatus: 'Active' },
    });
  }

  private async checkPerformanceRedFlags(asset: Asset): Promise<RedFlag[]> {
    const flags: RedFlag[] = [];

    // Check energy efficiency
    const efficiencyFlags = await this.checkEfficiencyRedFlags(asset);
    flags.push(...efficiencyFlags);

    // Check maintenance overdue
    const maintenanceFlags = await this.checkMaintenanceRedFlags(asset);
    flags.push(...maintenanceFlags);

    return flags;
  }

  private async checkEfficiencyRedFlags(asset: Asset): Promise<RedFlag[]> {
    const flags: RedFlag[] = [];

    // Get recent efficiency data
    const efficiencyData = await prisma.energyEfficiencyMetric.findMany({
      where: { assetId: asset.id },
      orderBy: { timestamp: 'desc' },
      take: 5,
    });

    if (efficiencyData.length === 0) return flags;

    const latestEfficiency = efficiencyData[0].efficiencyScore;

    if (latestEfficiency < 60) {
      const flag = await this.createRedFlag(
        asset.id,
        {
          type: 'performance',
          subcategory: 'energy_efficiency',
          description: 'Low energy efficiency detected',
        },
        this.calculateSeverity(latestEfficiency, 60),
        'Energy efficiency below acceptable threshold'
      );
      flags.push(flag);
    }

    return flags;
  }

  private async checkMaintenanceRedFlags(asset: Asset): Promise<RedFlag[]> {
    const flags: RedFlag[] = [];

    // Check overdue maintenance
    const overdueMaintenance = await prisma.workOrder.findMany({
      where: {
        assetId: asset.id,
        status: 'PENDING',
        scheduledDate: { lt: new Date() },
      },
    });

    if (overdueMaintenance.length > 0) {
      const flag = await this.createRedFlag(
        asset.id,
        {
          type: 'operational',
          subcategory: 'maintenance_overdue',
          description: 'Overdue maintenance detected',
        },
        this.calculateMaintenanceSeverity(overdueMaintenance.length),
        `${overdueMaintenance.length} maintenance items overdue`
      );
      flags.push(flag);
    }

    return flags;
  }

  private async checkSafetyRedFlags(asset: Asset): Promise<RedFlag[]> {
    const flags: RedFlag[] = [];

    // Check for safety-related alerts
    const safetyAlerts = await prisma.energyAlert.findMany({
      where: {
        assetId: asset.id,
        alertType: 'SAFETY_ISSUE',
        status: 'ACTIVE',
      },
    });

    for (const alert of safetyAlerts) {
      const flag = await this.createRedFlag(
        asset.id,
        {
          type: 'safety',
          subcategory: 'safety_alert',
          description: 'Safety issue detected',
        },
        { level: 'critical', score: 95, factors: [] },
        alert.description
      );
      flags.push(flag);
    }

    return flags;
  }

  private async checkComplianceRedFlags(asset: Asset): Promise<RedFlag[]> {
    const flags: RedFlag[] = [];

    // Check compliance violations
    const complianceViolations = await this.checkComplianceViolations(asset);

    if (complianceViolations.length > 0) {
      const flag = await this.createRedFlag(
        asset.id,
        {
          type: 'compliance',
          subcategory: 'violation',
          description: 'Compliance violation detected',
        },
        { level: 'high', score: 80, factors: [] },
        `${complianceViolations.length} compliance violations found`
      );
      flags.push(flag);
    }

    return flags;
  }

  private async checkFinancialRedFlags(asset: Asset): Promise<RedFlag[]> {
    const flags: RedFlag[] = [];

    // Check cost overruns
    const costOverruns = await this.checkCostOverruns(asset);

    if (costOverruns.length > 0) {
      const flag = await this.createRedFlag(
        asset.id,
        {
          type: 'financial',
          subcategory: 'cost_overrun',
          description: 'Cost overrun detected',
        },
        { level: 'medium', score: 65, factors: [] },
        `${costOverruns.length} cost overruns detected`
      );
      flags.push(flag);
    }

    return flags;
  }

  private async createRedFlag(
    assetId: string,
    category: RedFlagCategory,
    severity: RedFlagSeverity,
    description: string
  ): Promise<RedFlag> {
    const flagId = `flag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const riskAssessment = await this.performRiskAssessment(assetId, category, severity);
    const priority = this.calculatePriority(severity, riskAssessment);
    const automatedResponse = await this.createAutomatedResponse({
      flagId,
      timestamp: new Date(),
      assetId,
      category,
      severity,
      priority,
      description,
      riskAssessment,
      automatedResponse: {} as any,
      escalation: {} as any,
      status: 'active',
    });

    const flag: RedFlag = {
      flagId,
      timestamp: new Date(),
      assetId,
      category,
      severity,
      priority,
      description,
      riskAssessment,
      automatedResponse,
      escalation: {
        currentLevel: 0,
        escalatedAt: new Date(),
        escalatedBy: 'ai-system',
        escalationReason: 'Initial detection',
        nextEscalation: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        escalationHistory: [],
      },
      status: 'active',
    };

    return flag;
  }

  private calculateSeverity(value: number, threshold: number): RedFlagSeverity {
    const deviation = (threshold - value) / threshold;

    let level: 'low' | 'medium' | 'high' | 'critical';
    let score: number;

    if (deviation > 0.5) {
      level = 'critical';
      score = 95;
    } else if (deviation > 0.3) {
      level = 'high';
      score = 80;
    } else if (deviation > 0.1) {
      level = 'medium';
      score = 60;
    } else {
      level = 'low';
      score = 40;
    }

    return {
      level,
      score,
      factors: [
        {
          factor: 'threshold_deviation',
          weight: 1.0,
          contribution: deviation,
          description: 'Deviation from acceptable threshold',
        },
      ],
    };
  }

  private calculateMaintenanceSeverity(count: number): RedFlagSeverity {
    let level: 'low' | 'medium' | 'high' | 'critical';
    let score: number;

    if (count > 5) {
      level = 'critical';
      score = 95;
    } else if (count > 3) {
      level = 'high';
      score = 80;
    } else if (count > 1) {
      level = 'medium';
      score = 60;
    } else {
      level = 'low';
      score = 40;
    }

    return {
      level,
      score,
      factors: [
        {
          factor: 'maintenance_count',
          weight: 1.0,
          contribution: count / 10,
          description: 'Number of overdue maintenance items',
        },
      ],
    };
  }

  private async performRiskAssessment(
    assetId: string,
    category: RedFlagCategory,
    severity: RedFlagSeverity
  ): Promise<RiskAssessment> {
    const riskFactors: RiskFactor[] = [
      {
        factor: 'severity_impact',
        probability: severity.score / 100,
        impact: severity.score / 100,
        riskScore: severity.score,
        description: 'Impact of current severity level',
      },
    ];

    const mitigationStrategies: MitigationStrategy[] = [
      {
        strategy: 'immediate_response',
        effectiveness: 0.8,
        cost: 1000,
        implementationTime: 1,
        description: 'Immediate response to address the issue',
      },
    ];

    const overallRisk = riskFactors.reduce((sum, factor) => sum + factor.riskScore, 0) / riskFactors.length;
    const residualRisk = overallRisk * 0.3; // Assume 70% risk reduction with mitigation

    return {
      overallRisk,
      riskFactors,
      mitigationStrategies,
      residualRisk,
    };
  }

  private calculatePriority(severity: RedFlagSeverity, riskAssessment: RiskAssessment): number {
    const severityWeight = this.config.priorityScoring.weights.severity;
    const impactWeight = this.config.priorityScoring.weights.impact;

    const severityScore = severity.score;
    const impactScore = riskAssessment.overallRisk;

    return Math.round(severityScore * severityWeight + impactScore * impactWeight);
  }

  private async createAutomatedResponse(flag: RedFlag): Promise<AutomatedResponse> {
    const responseId = `response-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const actions: ResponseAction[] = [];

    // Create notification action
    actions.push({
      action: 'send_notification',
      target: 'maintenance_team',
      parameters: {
        message: `Red flag detected: ${flag.description}`,
        priority: flag.severity.level,
        assetId: flag.assetId,
      },
      status: 'pending',
    });

    // Create work order if critical
    if (flag.severity.level === 'critical') {
      actions.push({
        action: 'create_work_order',
        target: 'maintenance_system',
        parameters: {
          title: `URGENT: ${flag.description}`,
          priority: 'Critical',
          assetId: flag.assetId,
        },
        status: 'pending',
      });
    }

    return {
      responseId,
      responseType: flag.severity.level === 'critical' ? 'work_order' : 'notification',
      actions,
      executedAt: new Date(),
      status: 'pending',
    };
  }

  private async executeResponseAction(action: ResponseAction): Promise<void> {
    try {
      action.status = 'executing';

      switch (action.action) {
        case 'send_notification':
          await this.sendNotification(action.parameters);
          break;
        case 'create_work_order':
          await this.createWorkOrder(action.parameters);
          break;
        case 'escalate':
          await this.escalateToNextLevel(action.parameters);
          break;
      }

      action.status = 'completed';
    } catch (error) {
      action.status = 'failed';
      action.result = error;
    }
  }

  private async sendNotification(parameters: any): Promise<void> {
    // Mock notification sending
    console.log('Sending notification:', parameters);
  }

  private async createWorkOrder(parameters: any): Promise<void> {
    await prisma.workOrder.create({
      data: {
        organisationId: this.organisationId,
        assetId: parameters.assetId,
        title: parameters.title,
        priority: parameters.priority,
        status: 'Pending',
        assignedTo: 'maintenance_team',
        scheduledDate: new Date(),
        metadata: {
          source: 'ai_red_flagging_system',
          automated: true,
        },
      },
    });
  }

  private async escalateToNextLevel(parameters: any): Promise<void> {
    // Mock escalation logic
    console.log('Escalating to next level:', parameters);
  }

  private async processRedFlag(flag: RedFlag): Promise<void> {
    this.activeFlags.set(flag.flagId, flag);
    await this.storeRedFlag(flag);

    // Execute automated response if enabled
    if (this.config.automatedResponse.enabled) {
      await this.executeAutomatedResponse(flag.flagId);
    }
  }

  private async storeRedFlag(flag: RedFlag): Promise<void> {
    // Store red flag in database
    await prisma.energyAlert.create({
      data: {
        organisationId: this.organisationId,
        assetId: flag.assetId,
        alertType: 'RED_FLAG',
        title: `Red Flag: ${flag.category.description}`,
        description: flag.description,
        severity: flag.severity.level.toUpperCase() as any,
        status: 'ACTIVE',
        triggeredAt: flag.timestamp,
        metadata: {
          flagId: flag.flagId,
          category: flag.category,
          priority: flag.priority,
          riskAssessment: flag.riskAssessment,
          escalation: flag.escalation,
        },
      },
    });
  }

  private async executeEscalationActions(actions: string[], flag: RedFlag): Promise<void> {
    for (const action of actions) {
      switch (action) {
        case 'notify_management':
          await this.notifyManagement(flag);
          break;
        case 'create_urgent_work_order':
          await this.createUrgentWorkOrder(flag);
          break;
        case 'escalate_to_external':
          await this.escalateToExternal(flag);
          break;
      }
    }
  }

  private async notifyManagement(flag: RedFlag): Promise<void> {
    // Mock management notification
    console.log('Notifying management of red flag:', flag.flagId);
  }

  private async createUrgentWorkOrder(flag: RedFlag): Promise<void> {
    await prisma.workOrder.create({
      data: {
        organisationId: this.organisationId,
        assetId: flag.assetId,
        title: `URGENT ESCALATION: ${flag.description}`,
        priority: 'Critical',
        status: 'Pending',
        assignedTo: 'senior_maintenance',
        scheduledDate: new Date(),
        metadata: {
          source: 'ai_red_flagging_escalation',
          flagId: flag.flagId,
          escalationLevel: flag.escalation.currentLevel,
        },
      },
    });
  }

  private async escalateToExternal(flag: RedFlag): Promise<void> {
    // Mock external escalation
    console.log('Escalating to external resources:', flag.flagId);
  }

  // Dashboard helper methods
  private groupFlagsByCategory(flags: RedFlag[]): Record<string, number> {
    const categories: Record<string, number> = {};

    for (const flag of flags) {
      const category = flag.category.type;
      categories[category] = (categories[category] || 0) + 1;
    }

    return categories;
  }

  private calculateFlagTrends(flags: RedFlag[]): { trend: string; change: number } {
    // Mock trend calculation
    return {
      trend: 'increasing',
      change: 15, // 15% increase
    };
  }

  private getTopAssetsWithFlags(flags: RedFlag[]): Array<{ assetId: string; flagCount: number }> {
    const assetCounts: Record<string, number> = {};

    for (const flag of flags) {
      assetCounts[flag.assetId] = (assetCounts[flag.assetId] || 0) + 1;
    }

    return Object.entries(assetCounts)
      .map(([assetId, flagCount]) => ({ assetId, flagCount }))
      .sort((a, b) => b.flagCount - a.flagCount)
      .slice(0, 5);
  }

  private getEscalationSummary(flags: RedFlag[]): { totalEscalated: number; averageLevel: number } {
    const escalatedFlags = flags.filter(f => f.status === 'escalated');
    const totalEscalated = escalatedFlags.length;
    const averageLevel = escalatedFlags.reduce((sum, f) => sum + f.escalation.currentLevel, 0) / Math.max(totalEscalated, 1);

    return { totalEscalated, averageLevel };
  }

  private async checkComplianceViolations(asset: Asset): Promise<any[]> {
    // Mock compliance violation check
    return [];
  }

  private async checkCostOverruns(asset: Asset): Promise<any[]> {
    // Mock cost overrun check
    return [];
  }

  private getDefaultExceptionRules(): ExceptionRule[] {
    return [
      {
        ruleId: 'perf-degradation',
        name: 'Performance Degradation',
        condition: 'efficiency < 70%',
        severity: 'high',
        action: 'schedule_maintenance',
        escalationLevel: 1,
      },
      {
        ruleId: 'safety-violation',
        name: 'Safety Violation',
        condition: 'safety_alert = true',
        severity: 'critical',
        action: 'immediate_response',
        escalationLevel: 2,
      },
    ];
  }

  private getDefaultEscalationPaths(): EscalationPath[] {
    return [
      {
        level: 1,
        name: 'Initial Escalation',
        triggers: ['high_severity', 'no_response'],
        actions: ['notify_supervisor', 'create_work_order'],
        timeouts: 30,
      },
      {
        level: 2,
        name: 'Management Escalation',
        triggers: ['critical_severity', 'level_1_timeout'],
        actions: ['notify_management', 'create_urgent_work_order'],
        timeouts: 60,
      },
      {
        level: 3,
        name: 'Executive Escalation',
        triggers: ['level_2_timeout', 'multiple_failures'],
        actions: ['notify_executive', 'escalate_to_external'],
        timeouts: 120,
      },
    ];
  }
}

// Dashboard interface
export interface RedFlagDashboard {
  totalFlags: number;
  criticalFlags: number;
  highFlags: number;
  mediumFlags: number;
  lowFlags: number;
  categories: Record<string, number>;
  trends: { trend: string; change: number };
  topAssets: Array<{ assetId: string; flagCount: number }>;
  escalationSummary: { totalEscalated: number; averageLevel: number };
}

export function createAIAutomatedRedFlaggingSystem(
  organisationId: string,
  config?: Partial<RedFlaggingConfig>
): AIAutomatedRedFlaggingSystem {
  return new AIAutomatedRedFlaggingSystem(organisationId, config);
}
