/**
 * Automated Response Workflows Engine
 *
 * This module implements automated response workflow capabilities
 * including workflow templates, dynamic workflow generation,
 * workflow optimization, and automated response coordination.
 *
 * @file lib/automated-response-workflows.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  Signal,
  SignalType,
  SignalSeverity,
  ResponseWorkflow,
  WorkflowStep,
  WorkflowCondition,
  ResponseActionType,
  ResponseOrchestrationConfig,
  ResourcePool,
  EscalationRule
} from './resilience-types';

/**
 * Automated Response Workflows Engine Class
 *
 * Manages automated response workflows with:
 * - Predefined workflow templates
 * - Dynamic workflow generation
 * - Workflow optimization and adaptation
 * - Automated response coordination
 * - Performance monitoring and improvement
 */
export class AutomatedResponseWorkflowsEngine {
  private isInitialized: boolean = false;
  private workflowTemplates: Map<string, ResponseWorkflow> = new Map();
  private generatedWorkflows: Map<string, ResponseWorkflow> = new Map();
  private workflowPerformance: Map<string, any> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeEventListeners();
    this.initializeWorkflowTemplates();
  }

  /**
   * Initialize the automated response workflows engine
   */
  public async initialize(): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('🤖 Initializing Automated Response Workflows Engine...');

      // Initialize workflow templates
      await this.initializeWorkflowTemplates();

      // Initialize performance tracking
      this.initializePerformanceTracking();

      this.isInitialized = true;
      console.log('✅ Automated Response Workflows Engine initialized successfully');
      this.emitEvent('initialized', { templatesCount: this.workflowTemplates.size });

      return {
        success: true,
        data: {
          templatesCount: this.workflowTemplates.size,
          features: [
            'workflow-templates',
            'dynamic-generation',
            'workflow-optimization',
            'performance-monitoring',
            'automated-coordination'
          ]
        }
      };
    } catch (error: any) {
      console.error('❌ Failed to initialize Automated Response Workflows Engine:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate automated workflow for signal
   */
  public async generateWorkflow(signal: Signal, context?: any): Promise<ResponseWorkflow | null> {
    if (!this.isInitialized) {
      throw new Error('Automated Response Workflows Engine not initialized');
    }

    try {
      console.log(`🤖 Generating automated workflow for signal ${signal.id}...`);

      // Find best matching template
      const template = this.findBestTemplate(signal);
      if (!template) {
        console.log(`⚠️ No suitable template found for signal ${signal.id}`);
        return null;
      }

      // Generate workflow from template
      const workflow = await this.generateWorkflowFromTemplate(template, signal, context);

      // Optimize workflow
      const optimizedWorkflow = await this.optimizeWorkflow(workflow, signal);

      // Store generated workflow
      this.generatedWorkflows.set(workflow.id, optimizedWorkflow);

      console.log(`✅ Generated workflow: ${optimizedWorkflow.name}`);
      this.emitEvent('workflowGenerated', { workflow: optimizedWorkflow, signal });

      return optimizedWorkflow;
    } catch (error: any) {
      console.error(`❌ Failed to generate workflow for signal ${signal.id}:`, error);
      return null;
    }
  }

  /**
   * Execute automated response workflow
   */
  public async executeAutomatedResponse(signal: Signal, workflow: ResponseWorkflow): Promise<{
    success: boolean;
    executionId?: string;
    error?: string;
    results?: any;
  }> {
    try {
      console.log(`🤖 Executing automated response workflow: ${workflow.name}`);

      // Validate workflow
      const validation = this.validateWorkflow(workflow);
      if (!validation.valid) {
        return {
          success: false,
          error: `Workflow validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Execute workflow steps
      const results = await this.executeWorkflowSteps(workflow, signal);

      // Update performance metrics
      this.updateWorkflowPerformance(workflow.id, results);

      console.log(`✅ Automated response executed: ${workflow.name}`);
      this.emitEvent('automatedResponseExecuted', { workflow, signal, results });

      return {
        success: true,
        executionId: `auto-${workflow.id}-${Date.now()}`,
        results
      };
    } catch (error: any) {
      console.error(`❌ Automated response execution failed:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Optimize existing workflow
   */
  public async optimizeWorkflow(workflow: ResponseWorkflow, signal: Signal): Promise<ResponseWorkflow> {
    try {
      console.log(`🔧 Optimizing workflow: ${workflow.name}`);

      // Analyze workflow performance
      const performance = this.analyzeWorkflowPerformance(workflow);

      // Apply optimizations
      const optimizedSteps = await this.optimizeWorkflowSteps(workflow.steps, performance);
      const optimizedExecution = await this.optimizeExecutionSettings(workflow.execution, performance);

      const optimizedWorkflow: ResponseWorkflow = {
        ...workflow,
        steps: optimizedSteps,
        execution: optimizedExecution,
        updatedAt: new Date()
      };

      console.log(`✅ Workflow optimized: ${workflow.name}`);
      this.emitEvent('workflowOptimized', { originalWorkflow: workflow, optimizedWorkflow });

      return optimizedWorkflow;
    } catch (error: any) {
      console.error(`❌ Workflow optimization failed:`, error);
      return workflow; // Return original workflow if optimization fails
    }
  }

  /**
   * Create workflow template
   */
  public createWorkflowTemplate(
    name: string,
    description: string,
    signalTypes: SignalType[],
    severityLevels: SignalSeverity[],
    steps: WorkflowStep[]
  ): ResponseWorkflow {
    const template: ResponseWorkflow = {
      id: `template-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name,
      description,
      triggers: {
        signalTypes,
        severityLevels,
        assetCategories: [],
        conditions: []
      },
      steps,
      execution: {
        mode: 'SEQUENTIAL',
        stepTimeout: 30000,
        overallTimeout: 300000,
        retry: {
          maxRetries: 3,
          delay: 5000
        }
      },
      priority: 'MEDIUM',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workflowTemplates.set(template.id, template);
    console.log(`📋 Workflow template created: ${template.name}`);

    return template;
  }

  /**
   * Find best matching template
   */
  private findBestTemplate(signal: Signal): ResponseWorkflow | null {
    let bestMatch: ResponseWorkflow | null = null;
    let bestScore = 0;

    for (const template of this.workflowTemplates.values()) {
      if (!template.active) continue;

      const score = this.calculateTemplateMatchScore(template, signal);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = template;
      }
    }

    return bestMatch;
  }

  /**
   * Calculate template match score
   */
  private calculateTemplateMatchScore(template: ResponseWorkflow, signal: Signal): number {
    let score = 0;

    // Signal type match
    if (template.triggers.signalTypes.includes(signal.type)) {
      score += 0.4;
    }

    // Severity match
    if (template.triggers.severityLevels.includes(signal.severity)) {
      score += 0.3;
    }

    // Asset category match
    if (template.triggers.assetCategories.length === 0 || 
        template.triggers.assetCategories.includes(signal.assetId || '')) {
      score += 0.2;
    }

    // Performance bonus
    const performance = this.workflowPerformance.get(template.id);
    if (performance && performance.successRate > 0.8) {
      score += 0.1;
    }

    return score;
  }

  /**
   * Generate workflow from template
   */
  private async generateWorkflowFromTemplate(
    template: ResponseWorkflow,
    signal: Signal,
    context?: any
  ): Promise<ResponseWorkflow> {
    const workflowId = `workflow-${signal.id}-${Date.now()}`;
    
    // Clone template and customize for signal
    const workflow: ResponseWorkflow = {
      ...template,
      id: workflowId,
      name: `${template.name} - ${signal.type}`,
      description: `Generated workflow for ${signal.type} signal`,
      triggers: {
        ...template.triggers,
        signalTypes: [signal.type],
        severityLevels: [signal.severity],
        assetCategories: signal.assetId ? [signal.assetId] : []
      },
      steps: await this.customizeWorkflowSteps(template.steps, signal, context),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return workflow;
  }

  /**
   * Customize workflow steps for signal
   */
  private async customizeWorkflowSteps(
    steps: WorkflowStep[],
    signal: Signal,
    context?: any
  ): Promise<WorkflowStep[]> {
    return steps.map(step => ({
      ...step,
      config: {
        ...step.config,
        // Customize step configuration based on signal
        ...this.customizeStepConfig(step, signal, context)
      }
    }));
  }

  /**
   * Customize step configuration
   */
  private customizeStepConfig(step: WorkflowStep, signal: Signal, context?: any): any {
    const customConfig: any = {};

    switch (step.type) {
      case 'NOTIFICATION':
        if (step.config.notification) {
          customConfig.notification = {
            ...step.config.notification,
            template: this.customizeNotificationTemplate(step.config.notification.template, signal)
          };
        }
        break;

      case 'ACTION':
        if (step.config.action) {
          customConfig.action = this.customizeActionForSignal(step.config.action, signal);
        }
        break;

      case 'ESCALATION':
        if (step.config.escalation) {
          customConfig.escalation = {
            ...step.config.escalation,
            level: this.determineEscalationLevel(signal)
          };
        }
        break;
    }

    return customConfig;
  }

  /**
   * Customize notification template
   */
  private customizeNotificationTemplate(template: string, signal: Signal): string {
    return template
      .replace('{signalType}', signal.type)
      .replace('{severity}', signal.severity)
      .replace('{assetId}', signal.assetId || 'Unknown')
      .replace('{timestamp}', signal.timestamp.toISOString())
      .replace('{strength}', signal.strength.toString());
  }

  /**
   * Customize action for signal
   */
  private customizeActionForSignal(action: ResponseActionType, signal: Signal): ResponseActionType {
    // Customize action based on signal characteristics
    if (signal.severity === SignalSeverity.CRITICAL && action !== ResponseActionType.IMMEDIATE_RESPONSE) {
      return ResponseActionType.IMMEDIATE_RESPONSE;
    }

    return action;
  }

  /**
   * Determine escalation level
   */
  private determineEscalationLevel(signal: Signal): string {
    switch (signal.severity) {
      case SignalSeverity.CRITICAL:
        return 'CRITICAL';
      case SignalSeverity.HIGH:
        return 'HIGH';
      case SignalSeverity.MEDIUM:
        return 'MEDIUM';
      case SignalSeverity.LOW:
        return 'LOW';
      default:
        return 'MEDIUM';
    }
  }

  /**
   * Optimize workflow steps
   */
  private async optimizeWorkflowSteps(steps: WorkflowStep[], performance: any): Promise<WorkflowStep[]> {
    const optimizedSteps = [...steps];

    // Remove redundant steps
    const filteredSteps = this.removeRedundantSteps(optimizedSteps);

    // Reorder steps for better performance
    const reorderedSteps = this.reorderStepsForPerformance(filteredSteps);

    // Optimize step configurations
    const optimizedStepsConfig = await this.optimizeStepConfigurations(reorderedSteps);

    return optimizedStepsConfig;
  }

  /**
   * Remove redundant steps
   */
  private removeRedundantSteps(steps: WorkflowStep[]): WorkflowStep[] {
    const seenActions = new Set<ResponseActionType>();
    return steps.filter(step => {
      if (step.type === 'ACTION' && step.config.action) {
        if (seenActions.has(step.config.action)) {
          return false; // Remove duplicate action
        }
        seenActions.add(step.config.action);
      }
      return true;
    });
  }

  /**
   * Reorder steps for better performance
   */
  private reorderStepsForPerformance(steps: WorkflowStep[]): WorkflowStep[] {
    // Sort by priority: IMMEDIATE_RESPONSE first, then by order
    return steps.sort((a, b) => {
      const aPriority = a.config.action === ResponseActionType.IMMEDIATE_RESPONSE ? 0 : 1;
      const bPriority = b.config.action === ResponseActionType.IMMEDIATE_RESPONSE ? 0 : 1;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return a.order - b.order;
    });
  }

  /**
   * Optimize step configurations
   */
  private async optimizeStepConfigurations(steps: WorkflowStep[]): Promise<WorkflowStep[]> {
    return steps.map(step => {
      const optimizedStep = { ...step };

      // Optimize delays
      if (step.type === 'DELAY' && step.config.delay) {
        optimizedStep.config.delay = Math.min(step.config.delay, 10000); // Max 10 seconds
      }

      // Optimize timeouts
      if (step.config.action) {
        // Reduce timeouts for non-critical actions
        if (step.config.action !== ResponseActionType.IMMEDIATE_RESPONSE) {
          // This would be customized based on historical performance
        }
      }

      return optimizedStep;
    });
  }

  /**
   * Optimize execution settings
   */
  private async optimizeExecutionSettings(execution: any, performance: any): Promise<any> {
    const optimizedExecution = { ...execution };

    // Optimize timeouts based on performance
    if (performance.avgExecutionTime) {
      optimizedExecution.overallTimeout = Math.max(
        performance.avgExecutionTime * 2,
        60000 // Minimum 1 minute
      );
    }

    // Optimize retry settings
    if (performance.errorRate > 0.1) {
      optimizedExecution.retry.maxRetries = Math.min(execution.retry.maxRetries + 1, 5);
    }

    return optimizedExecution;
  }

  /**
   * Execute workflow steps
   */
  private async executeWorkflowSteps(workflow: ResponseWorkflow, signal: Signal): Promise<any> {
    const results = {
      stepsExecuted: 0,
      stepsFailed: 0,
      totalTime: 0,
      outputs: [] as any[]
    };

    const startTime = Date.now();

    for (const step of workflow.steps) {
      try {
        console.log(`🔄 Executing step: ${step.name}`);
        
        const stepStartTime = Date.now();
        const stepResult = await this.executeStep(step, signal);
        const stepTime = Date.now() - stepStartTime;

        results.stepsExecuted++;
        results.outputs.push({
          stepId: step.id,
          stepName: step.name,
          result: stepResult,
          executionTime: stepTime
        });

        console.log(`✅ Step completed: ${step.name} (${stepTime}ms)`);
      } catch (error: any) {
        console.error(`❌ Step failed: ${step.name}`, error);
        results.stepsFailed++;
        results.outputs.push({
          stepId: step.id,
          stepName: step.name,
          error: error.message,
          executionTime: 0
        });
      }
    }

    results.totalTime = Date.now() - startTime;
    return results;
  }

  /**
   * Execute individual step
   */
  private async executeStep(step: WorkflowStep, signal: Signal): Promise<any> {
    switch (step.type) {
      case 'ACTION':
        return await this.executeActionStep(step, signal);
      case 'CONDITION':
        return await this.executeConditionStep(step, signal);
      case 'DELAY':
        return await this.executeDelayStep(step, signal);
      case 'NOTIFICATION':
        return await this.executeNotificationStep(step, signal);
      case 'ESCALATION':
        return await this.executeEscalationStep(step, signal);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  /**
   * Execute action step
   */
  private async executeActionStep(step: WorkflowStep, signal: Signal): Promise<any> {
    if (!step.config.action) {
      throw new Error('Action step missing action configuration');
    }

    console.log(`⚡ Executing action: ${step.config.action}`);

    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      action: step.config.action,
      success: true,
      timestamp: new Date()
    };
  }

  /**
   * Execute condition step
   */
  private async executeConditionStep(step: WorkflowStep, signal: Signal): Promise<any> {
    if (!step.config.condition) {
      throw new Error('Condition step missing condition configuration');
    }

    console.log(`🔍 Evaluating condition: ${step.config.condition}`);

    // Simulate condition evaluation
    const result = true; // Simplified evaluation

    return {
      condition: step.config.condition,
      result,
      timestamp: new Date()
    };
  }

  /**
   * Execute delay step
   */
  private async executeDelayStep(step: WorkflowStep, signal: Signal): Promise<any> {
    const delay = step.config.delay || 1000;
    console.log(`⏳ Delaying execution for ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return {
      delay,
      completed: true,
      timestamp: new Date()
    };
  }

  /**
   * Execute notification step
   */
  private async executeNotificationStep(step: WorkflowStep, signal: Signal): Promise<any> {
    if (!step.config.notification) {
      throw new Error('Notification step missing notification configuration');
    }

    console.log(`📢 Sending notification: ${step.config.notification.template}`);

    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      notification: step.config.notification,
      sent: true,
      timestamp: new Date()
    };
  }

  /**
   * Execute escalation step
   */
  private async executeEscalationStep(step: WorkflowStep, signal: Signal): Promise<any> {
    if (!step.config.escalation) {
      throw new Error('Escalation step missing escalation configuration');
    }

    console.log(`🚨 Executing escalation: ${step.config.escalation.level}`);

    // Simulate escalation execution
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      escalation: step.config.escalation,
      executed: true,
      timestamp: new Date()
    };
  }

  /**
   * Validate workflow
   */
  private validateWorkflow(workflow: ResponseWorkflow): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!workflow.id || !workflow.name) {
      errors.push('Missing required fields: id, name');
    }

    if (workflow.steps.length === 0) {
      errors.push('Workflow must have at least one step');
    }

    for (const step of workflow.steps) {
      if (!step.id || !step.name) {
        errors.push(`Step missing required fields: ${step.id || 'unknown'}`);
      }

      if (step.type === 'ACTION' && !step.config.action) {
        errors.push(`Action step missing action: ${step.id}`);
      }

      if (step.type === 'CONDITION' && !step.config.condition) {
        errors.push(`Condition step missing condition: ${step.id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Analyze workflow performance
   */
  private analyzeWorkflowPerformance(workflow: ResponseWorkflow): any {
    const performance = this.workflowPerformance.get(workflow.id);
    
    if (!performance) {
      return {
        avgExecutionTime: 30000, // Default 30 seconds
        successRate: 0.8, // Default 80%
        errorRate: 0.2 // Default 20%
      };
    }

    return performance;
  }

  /**
   * Update workflow performance
   */
  private updateWorkflowPerformance(workflowId: string, results: any): void {
    const currentPerformance = this.workflowPerformance.get(workflowId) || {
      executions: 0,
      totalTime: 0,
      successes: 0,
      failures: 0
    };

    currentPerformance.executions++;
    currentPerformance.totalTime += results.totalTime;
    
    if (results.stepsFailed === 0) {
      currentPerformance.successes++;
    } else {
      currentPerformance.failures++;
    }

    this.workflowPerformance.set(workflowId, currentPerformance);
  }

  /**
   * Initialize workflow templates
   */
  private async initializeWorkflowTemplates(): Promise<void> {
    // Emergency Response Template
    const emergencyTemplate = this.createWorkflowTemplate(
      'Emergency Response',
      'Automated emergency response workflow',
      [SignalType.EMERGENCY],
      [SignalSeverity.CRITICAL, SignalSeverity.HIGH],
      [
        {
          id: 'emergency-notification',
          name: 'Emergency Notification',
          description: 'Send immediate emergency notifications',
          type: 'NOTIFICATION',
          config: {
            notification: {
              recipients: ['emergency-team', 'management'],
              template: 'EMERGENCY: {signalType} detected for asset {assetId} at {timestamp}',
              channels: ['email', 'sms', 'push']
            }
          },
          dependencies: [],
          order: 1,
          requiredResources: ['notification-service'],
          successCriteria: {
            expectedOutcome: 'Emergency notifications sent',
            validationRules: ['notifications-sent']
          }
        },
        {
          id: 'immediate-response',
          name: 'Immediate Response',
          description: 'Execute immediate emergency response',
          type: 'ACTION',
          config: {
            action: ResponseActionType.IMMEDIATE_RESPONSE
          },
          dependencies: ['emergency-notification'],
          order: 2,
          requiredResources: ['emergency-team'],
          successCriteria: {
            expectedOutcome: 'Emergency response initiated',
            validationRules: ['response-initiated']
          }
        }
      ]
    );

    // Asset Condition Template
    const assetConditionTemplate = this.createWorkflowTemplate(
      'Asset Condition Response',
      'Automated response to asset condition signals',
      [SignalType.ASSET_CONDITION],
      [SignalSeverity.MEDIUM, SignalSeverity.HIGH],
      [
        {
          id: 'condition-assessment',
          name: 'Condition Assessment',
          description: 'Assess asset condition',
          type: 'ACTION',
          config: {
            action: ResponseActionType.SCHEDULE_INSPECTION
          },
          dependencies: [],
          order: 1,
          requiredResources: ['inspector'],
          successCriteria: {
            expectedOutcome: 'Condition assessment scheduled',
            validationRules: ['inspection-scheduled']
          }
        },
        {
          id: 'condition-notification',
          name: 'Condition Notification',
          description: 'Notify relevant stakeholders',
          type: 'NOTIFICATION',
          config: {
            notification: {
              recipients: ['maintenance-team', 'supervisor'],
              template: 'Asset condition alert: {signalType} for asset {assetId}',
              channels: ['email']
            }
          },
          dependencies: ['condition-assessment'],
          order: 2,
          requiredResources: ['notification-service'],
          successCriteria: {
            expectedOutcome: 'Stakeholders notified',
            validationRules: ['notifications-sent']
          }
        }
      ]
    );

    // Maintenance Template
    const maintenanceTemplate = this.createWorkflowTemplate(
      'Maintenance Response',
      'Automated maintenance response workflow',
      [SignalType.MAINTENANCE],
      [SignalSeverity.LOW, SignalSeverity.MEDIUM],
      [
        {
          id: 'maintenance-scheduling',
          name: 'Maintenance Scheduling',
          description: 'Schedule maintenance work order',
          type: 'ACTION',
          config: {
            action: ResponseActionType.SCHEDULE_MAINTENANCE
          },
          dependencies: [],
          order: 1,
          requiredResources: ['maintenance-team'],
          successCriteria: {
            expectedOutcome: 'Maintenance scheduled',
            validationRules: ['maintenance-scheduled']
          }
        },
        {
          id: 'maintenance-notification',
          name: 'Maintenance Notification',
          description: 'Notify maintenance team',
          type: 'NOTIFICATION',
          config: {
            notification: {
              recipients: ['maintenance-team'],
              template: 'Maintenance required: {signalType} for asset {assetId}',
              channels: ['email']
            }
          },
          dependencies: ['maintenance-scheduling'],
          order: 2,
          requiredResources: ['notification-service'],
          successCriteria: {
            expectedOutcome: 'Maintenance team notified',
            validationRules: ['notifications-sent']
          }
        }
      ]
    );

    console.log(`📋 Initialized ${this.workflowTemplates.size} workflow templates`);
  }

  /**
   * Initialize performance tracking
   */
  private initializePerformanceTracking(): void {
    // Initialize performance tracking for each template
    for (const template of this.workflowTemplates.values()) {
      this.workflowPerformance.set(template.id, {
        executions: 0,
        totalTime: 0,
        successes: 0,
        failures: 0,
        avgExecutionTime: 0,
        successRate: 0,
        errorRate: 0
      });
    }
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.eventListeners.set('initialized', []);
    this.eventListeners.set('workflowGenerated', []);
    this.eventListeners.set('workflowOptimized', []);
    this.eventListeners.set('automatedResponseExecuted', []);
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(eventName: string, data: any): void {
    const listeners = this.eventListeners.get(eventName) || [];
    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error: any) {
        console.error(`❌ Event listener error for ${eventName}:`, error);
      }
    }
  }

  // Public API methods

  /**
   * Get workflow templates
   */
  public getWorkflowTemplates(): Map<string, ResponseWorkflow> {
    return new Map(this.workflowTemplates);
  }

  /**
   * Get generated workflows
   */
  public getGeneratedWorkflows(): Map<string, ResponseWorkflow> {
    return new Map(this.generatedWorkflows);
  }

  /**
   * Get workflow performance
   */
  public getWorkflowPerformance(): Map<string, any> {
    return new Map(this.workflowPerformance);
  }

  /**
   * Add workflow template
   */
  public addWorkflowTemplate(template: ResponseWorkflow): void {
    this.workflowTemplates.set(template.id, template);
    console.log(`📋 Workflow template added: ${template.name}`);
  }

  /**
   * Update workflow template
   */
  public updateWorkflowTemplate(templateId: string, updates: Partial<ResponseWorkflow>): void {
    const template = this.workflowTemplates.get(templateId);
    if (template) {
      const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
      this.workflowTemplates.set(templateId, updatedTemplate);
      console.log(`📋 Workflow template updated: ${template.name}`);
    }
  }

  /**
   * Add event listener
   */
  public addEventListener(eventName: string, listener: Function): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)!.push(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(eventName: string, listener: Function): void {
    const listeners = this.eventListeners.get(eventName) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Check if engine is initialized
   */
  public isEngineInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get engine statistics
   */
  public getStatistics(): {
    templatesCount: number;
    generatedWorkflowsCount: number;
    totalExecutions: number;
    averageSuccessRate: number;
  } {
    const templatesCount = this.workflowTemplates.size;
    const generatedWorkflowsCount = this.generatedWorkflows.size;
    
    let totalExecutions = 0;
    let totalSuccesses = 0;
    
    for (const performance of this.workflowPerformance.values()) {
      totalExecutions += performance.executions;
      totalSuccesses += performance.successes;
    }
    
    const averageSuccessRate = totalExecutions > 0 ? totalSuccesses / totalExecutions : 0;

    return {
      templatesCount,
      generatedWorkflowsCount,
      totalExecutions,
      averageSuccessRate
    };
  }
}
