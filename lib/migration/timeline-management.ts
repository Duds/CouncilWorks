/**
 * Migration Timeline and Risk Management
 * 
 * Implements comprehensive migration planning, timeline management, and risk assessment
 * 
 * @fileoverview Migration timeline and risk management system
 */

export interface MigrationPhase {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  dependencies: string[];
  tasks: MigrationTask[];
  risks: MigrationRisk[];
  successCriteria: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'blocked';
  startDate?: Date;
  endDate?: Date;
  actualDuration?: number;
}

export interface MigrationTask {
  id: string;
  name: string;
  description: string;
  phaseId: string;
  duration: number; // in hours
  dependencies: string[];
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: number; // story points
  startDate?: Date;
  endDate?: Date;
  actualDuration?: number;
  notes?: string;
}

export interface MigrationRisk {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'business' | 'operational' | 'security' | 'compliance';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string[];
  contingency: string[];
  owner: string;
  status: 'identified' | 'monitoring' | 'mitigated' | 'resolved';
  lastReviewed: Date;
}

export interface MigrationTimeline {
  id: string;
  name: string;
  description: string;
  phases: MigrationPhase[];
  totalDuration: number; // in days
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  progress: number; // percentage
  budget: number;
  actualCost?: number;
}

export interface MigrationMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  blockedTasks: number;
  totalEffort: number;
  completedEffort: number;
  totalRisks: number;
  activeRisks: number;
  mitigatedRisks: number;
  averageTaskDuration: number;
  onTimeDelivery: number; // percentage
  budgetVariance: number; // percentage
}

export class MigrationTimelineManager {
  private timeline: MigrationTimeline;
  private metrics: MigrationMetrics;

  constructor() {
    this.timeline = this.createDefaultTimeline();
    this.metrics = this.calculateMetrics();
  }

  /**
   * Create default migration timeline
   */
  private createDefaultTimeline(): MigrationTimeline {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 90); // 90 days total

    return {
      id: 'migration_timeline_001',
      name: 'Aegrid Hybrid Database Migration',
      description: 'Complete migration from PostgreSQL-only to hybrid PostgreSQL + Cosmos DB architecture',
      phases: this.createMigrationPhases(),
      totalDuration: 90,
      startDate,
      endDate,
      status: 'planning',
      progress: 0,
      budget: 50000, // $50,000 budget
    };
  }

  /**
   * Create migration phases
   */
  private createMigrationPhases(): MigrationPhase[] {
    return [
      {
        id: 'phase_1',
        name: 'Infrastructure Setup',
        description: 'Set up Azure Cosmos DB infrastructure and configure connections',
        duration: 7,
        dependencies: [],
        tasks: [
          {
            id: 'task_1_1',
            name: 'Create Azure Cosmos DB Account',
            description: 'Create and configure Azure Cosmos DB account with Gremlin API',
            phaseId: 'phase_1',
            duration: 4,
            dependencies: [],
            priority: 'critical',
            effort: 3,
            status: 'pending',
          },
          {
            id: 'task_1_2',
            name: 'Configure Database Connections',
            description: 'Set up connection pooling and database clients',
            phaseId: 'phase_1',
            duration: 8,
            dependencies: ['task_1_1'],
            priority: 'high',
            effort: 5,
            status: 'pending',
          },
          {
            id: 'task_1_3',
            name: 'Environment Configuration',
            description: 'Configure environment-specific settings and secrets',
            phaseId: 'phase_1',
            duration: 4,
            dependencies: ['task_1_2'],
            priority: 'high',
            effort: 2,
            status: 'pending',
          },
        ],
        risks: [
          {
            id: 'risk_1_1',
            name: 'Azure Cosmos DB Setup Delays',
            description: 'Potential delays in Azure Cosmos DB account creation and configuration',
            category: 'technical',
            probability: 'medium',
            impact: 'high',
            mitigation: [
              'Start Azure setup early',
              'Have backup Azure regions ready',
              'Engage Azure support if needed',
            ],
            contingency: [
              'Use local Cosmos DB emulator for development',
              'Extend timeline by 2-3 days',
            ],
            owner: 'DevOps Team',
            status: 'identified',
            lastReviewed: new Date(),
          },
        ],
        successCriteria: [
          'Cosmos DB account created and accessible',
          'Connection pooling configured',
          'Environment variables set up',
          'Health checks passing',
        ],
        status: 'pending',
      },
      {
        id: 'phase_2',
        name: 'Data Synchronization Implementation',
        description: 'Implement real-time and batch synchronization services',
        duration: 14,
        dependencies: ['phase_1'],
        tasks: [
          {
            id: 'task_2_1',
            name: 'Real-time Sync Service',
            description: 'Implement real-time data synchronization between PostgreSQL and Cosmos DB',
            phaseId: 'phase_2',
            duration: 16,
            dependencies: ['task_1_3'],
            priority: 'critical',
            effort: 8,
            status: 'pending',
          },
          {
            id: 'task_2_2',
            name: 'Batch Sync Service',
            description: 'Implement batch synchronization for large data sets',
            phaseId: 'phase_2',
            duration: 12,
            dependencies: ['task_2_1'],
            priority: 'high',
            effort: 6,
            status: 'pending',
          },
          {
            id: 'task_2_3',
            name: 'Conflict Detection',
            description: 'Implement conflict detection and resolution mechanisms',
            phaseId: 'phase_2',
            duration: 10,
            dependencies: ['task_2_1'],
            priority: 'high',
            effort: 5,
            status: 'pending',
          },
        ],
        risks: [
          {
            id: 'risk_2_1',
            name: 'Data Consistency Issues',
            description: 'Potential data consistency problems during synchronization',
            category: 'technical',
            probability: 'high',
            impact: 'critical',
            mitigation: [
              'Implement comprehensive conflict detection',
              'Use transaction logs for consistency',
              'Implement rollback mechanisms',
            ],
            contingency: [
              'Pause synchronization and investigate',
              'Implement manual conflict resolution',
              'Consider data reconciliation tools',
            ],
            owner: 'Database Team',
            status: 'identified',
            lastReviewed: new Date(),
          },
        ],
        successCriteria: [
          'Real-time sync working for all CRUD operations',
          'Batch sync handling large datasets',
          'Conflict detection identifying discrepancies',
          'Performance benchmarks met',
        ],
        status: 'pending',
      },
      {
        id: 'phase_3',
        name: 'Data Migration',
        description: 'Migrate existing data from PostgreSQL to Cosmos DB',
        duration: 21,
        dependencies: ['phase_2'],
        tasks: [
          {
            id: 'task_3_1',
            name: 'Data Backup',
            description: 'Create comprehensive backup of existing PostgreSQL data',
            phaseId: 'phase_3',
            duration: 8,
            dependencies: ['task_2_3'],
            priority: 'critical',
            effort: 3,
            status: 'pending',
          },
          {
            id: 'task_3_2',
            name: 'Asset Data Migration',
            description: 'Migrate all asset data to Cosmos DB',
            phaseId: 'phase_3',
            duration: 16,
            dependencies: ['task_3_1'],
            priority: 'critical',
            effort: 8,
            status: 'pending',
          },
          {
            id: 'task_3_3',
            name: 'Work Order Migration',
            description: 'Migrate all work order data to Cosmos DB',
            phaseId: 'phase_3',
            duration: 12,
            dependencies: ['task_3_2'],
            priority: 'high',
            effort: 6,
            status: 'pending',
          },
          {
            id: 'task_3_4',
            name: 'User Data Migration',
            description: 'Migrate all user and organization data to Cosmos DB',
            phaseId: 'phase_3',
            duration: 8,
            dependencies: ['task_3_3'],
            priority: 'high',
            effort: 4,
            status: 'pending',
          },
        ],
        risks: [
          {
            id: 'risk_3_1',
            name: 'Data Loss During Migration',
            description: 'Risk of data loss during the migration process',
            category: 'technical',
            probability: 'low',
            impact: 'critical',
            mitigation: [
              'Comprehensive backup strategy',
              'Incremental migration approach',
              'Data validation at each step',
            ],
            contingency: [
              'Restore from backup',
              'Re-run migration process',
              'Manual data recovery',
            ],
            owner: 'Database Team',
            status: 'identified',
            lastReviewed: new Date(),
          },
          {
            id: 'risk_3_2',
            name: 'Extended Downtime',
            description: 'Migration taking longer than expected causing extended downtime',
            category: 'operational',
            probability: 'medium',
            impact: 'high',
            mitigation: [
              'Parallel migration processes',
              'Incremental migration approach',
              'Rollback procedures',
            ],
            contingency: [
              'Extend maintenance window',
              'Implement read-only mode',
              'Gradual migration approach',
            ],
            owner: 'Operations Team',
            status: 'identified',
            lastReviewed: new Date(),
          },
        ],
        successCriteria: [
          'All data successfully migrated',
          'Data integrity verified',
          'Performance benchmarks met',
          'Zero data loss',
        ],
        status: 'pending',
      },
      {
        id: 'phase_4',
        name: 'Testing and Validation',
        description: 'Comprehensive testing of hybrid database functionality',
        duration: 14,
        dependencies: ['phase_3'],
        tasks: [
          {
            id: 'task_4_1',
            name: 'Unit Testing',
            description: 'Comprehensive unit tests for all sync services',
            phaseId: 'phase_4',
            duration: 12,
            dependencies: ['task_3_4'],
            priority: 'high',
            effort: 6,
            status: 'pending',
          },
          {
            id: 'task_4_2',
            name: 'Integration Testing',
            description: 'End-to-end integration testing of hybrid database',
            phaseId: 'phase_4',
            duration: 16,
            dependencies: ['task_4_1'],
            priority: 'critical',
            effort: 8,
            status: 'pending',
          },
          {
            id: 'task_4_3',
            name: 'Performance Testing',
            description: 'Load testing and performance validation',
            phaseId: 'phase_4',
            duration: 10,
            dependencies: ['task_4_2'],
            priority: 'high',
            effort: 5,
            status: 'pending',
          },
        ],
        risks: [
          {
            id: 'risk_4_1',
            name: 'Performance Issues',
            description: 'Hybrid database not meeting performance requirements',
            category: 'technical',
            probability: 'medium',
            impact: 'high',
            mitigation: [
              'Early performance testing',
              'Optimization during development',
              'Scalability planning',
            ],
            contingency: [
              'Performance tuning',
              'Additional infrastructure',
              'Architecture adjustments',
            ],
            owner: 'Performance Team',
            status: 'identified',
            lastReviewed: new Date(),
          },
        ],
        successCriteria: [
          'All tests passing',
          'Performance benchmarks met',
          'No critical bugs found',
          'User acceptance testing passed',
        ],
        status: 'pending',
      },
      {
        id: 'phase_5',
        name: 'Deployment and Go-Live',
        description: 'Deploy to production and go live with hybrid database',
        duration: 7,
        dependencies: ['phase_4'],
        tasks: [
          {
            id: 'task_5_1',
            name: 'Production Deployment',
            description: 'Deploy hybrid database to production environment',
            phaseId: 'phase_5',
            duration: 8,
            dependencies: ['task_4_3'],
            priority: 'critical',
            effort: 4,
            status: 'pending',
          },
          {
            id: 'task_5_2',
            name: 'Monitoring Setup',
            description: 'Set up comprehensive monitoring and alerting',
            phaseId: 'phase_5',
            duration: 6,
            dependencies: ['task_5_1'],
            priority: 'high',
            effort: 3,
            status: 'pending',
          },
          {
            id: 'task_5_3',
            name: 'Go-Live Support',
            description: 'Provide support during go-live period',
            phaseId: 'phase_5',
            duration: 24,
            dependencies: ['task_5_2'],
            priority: 'high',
            effort: 5,
            status: 'pending',
          },
        ],
        risks: [
          {
            id: 'risk_5_1',
            name: 'Production Issues',
            description: 'Issues arising in production environment',
            category: 'operational',
            probability: 'medium',
            impact: 'high',
            mitigation: [
              'Comprehensive testing',
              'Rollback procedures',
              '24/7 support during go-live',
            ],
            contingency: [
              'Immediate rollback',
              'Emergency support team',
              'Communication plan',
            ],
            owner: 'Operations Team',
            status: 'identified',
            lastReviewed: new Date(),
          },
        ],
        successCriteria: [
          'Successful production deployment',
          'Monitoring and alerting working',
          'No critical issues in first 24 hours',
          'User satisfaction maintained',
        ],
        status: 'pending',
      },
    ];
  }

  /**
   * Calculate migration metrics
   */
  private calculateMetrics(): MigrationMetrics {
    const allTasks = this.timeline.phases.flatMap(phase => phase.tasks);
    const allRisks = this.timeline.phases.flatMap(phase => phase.risks);

    return {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(task => task.status === 'completed').length,
      failedTasks: allTasks.filter(task => task.status === 'failed').length,
      blockedTasks: allTasks.filter(task => task.status === 'blocked').length,
      totalEffort: allTasks.reduce((sum, task) => sum + task.effort, 0),
      completedEffort: allTasks
        .filter(task => task.status === 'completed')
        .reduce((sum, task) => sum + task.effort, 0),
      totalRisks: allRisks.length,
      activeRisks: allRisks.filter(risk => risk.status === 'identified' || risk.status === 'monitoring').length,
      mitigatedRisks: allRisks.filter(risk => risk.status === 'mitigated' || risk.status === 'resolved').length,
      averageTaskDuration: allTasks.reduce((sum, task) => sum + task.duration, 0) / allTasks.length,
      onTimeDelivery: 0, // Will be calculated based on actual progress
      budgetVariance: 0, // Will be calculated based on actual costs
    };
  }

  /**
   * Get migration timeline
   */
  getTimeline(): MigrationTimeline {
    return { ...this.timeline };
  }

  /**
   * Get migration metrics
   */
  getMetrics(): MigrationMetrics {
    return { ...this.metrics };
  }

  /**
   * Update task status
   */
  updateTaskStatus(taskId: string, status: MigrationTask['status']): void {
    for (const phase of this.timeline.phases) {
      const task = phase.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        if (status === 'completed' && !task.endDate) {
          task.endDate = new Date();
        }
        if (status === 'in-progress' && !task.startDate) {
          task.startDate = new Date();
        }
        break;
      }
    }
    this.metrics = this.calculateMetrics();
  }

  /**
   * Update phase status
   */
  updatePhaseStatus(phaseId: string, status: MigrationPhase['status']): void {
    const phase = this.timeline.phases.find(p => p.id === phaseId);
    if (phase) {
      phase.status = status;
      if (status === 'completed' && !phase.endDate) {
        phase.endDate = new Date();
      }
      if (status === 'in-progress' && !phase.startDate) {
        phase.startDate = new Date();
      }
    }
  }

  /**
   * Get critical path
   */
  getCriticalPath(): string[] {
    const criticalPath: string[] = [];
    
    // Find tasks with no dependencies or all dependencies completed
    const completedTasks = new Set<string>();
    
    while (completedTasks.size < this.metrics.totalTasks) {
      let foundTask = false;
      
      for (const phase of this.timeline.phases) {
        for (const task of phase.tasks) {
          if (!completedTasks.has(task.id) && 
              task.dependencies.every(dep => completedTasks.has(dep))) {
            criticalPath.push(task.id);
            completedTasks.add(task.id);
            foundTask = true;
            break;
          }
        }
        if (foundTask) break;
      }
      
      if (!foundTask) break; // Prevent infinite loop
    }
    
    return criticalPath;
  }

  /**
   * Get risk summary
   */
  getRiskSummary(): {
    total: number;
    byCategory: Record<string, number>;
    byProbability: Record<string, number>;
    byImpact: Record<string, number>;
    criticalRisks: MigrationRisk[];
  } {
    const allRisks = this.timeline.phases.flatMap(phase => phase.risks);
    
    const byCategory = allRisks.reduce((acc, risk) => {
      acc[risk.category] = (acc[risk.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byProbability = allRisks.reduce((acc, risk) => {
      acc[risk.probability] = (acc[risk.probability] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byImpact = allRisks.reduce((acc, risk) => {
      acc[risk.impact] = (acc[risk.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const criticalRisks = allRisks.filter(risk => 
      risk.probability === 'high' && risk.impact === 'critical'
    );
    
    return {
      total: allRisks.length,
      byCategory,
      byProbability,
      byImpact,
      criticalRisks,
    };
  }

  /**
   * Get timeline summary
   */
  getTimelineSummary(): {
    totalDuration: number;
    completedDuration: number;
    remainingDuration: number;
    progress: number;
    phases: Array<{
      id: string;
      name: string;
      status: string;
      progress: number;
      duration: number;
    }>;
  } {
    const totalDuration = this.timeline.phases.reduce((sum, phase) => sum + phase.duration, 0);
    const completedDuration = this.timeline.phases
      .filter(phase => phase.status === 'completed')
      .reduce((sum, phase) => sum + phase.duration, 0);
    const remainingDuration = totalDuration - completedDuration;
    const progress = (completedDuration / totalDuration) * 100;
    
    const phases = this.timeline.phases.map(phase => ({
      id: phase.id,
      name: phase.name,
      status: phase.status,
      progress: phase.tasks.length > 0 
        ? (phase.tasks.filter(task => task.status === 'completed').length / phase.tasks.length) * 100
        : 0,
      duration: phase.duration,
    }));
    
    return {
      totalDuration,
      completedDuration,
      remainingDuration,
      progress,
      phases,
    };
  }
}

// Export singleton instance
export const migrationTimelineManager = new MigrationTimelineManager();
