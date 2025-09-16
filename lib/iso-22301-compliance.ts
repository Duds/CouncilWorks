/**
 * ISO 22301 Compliance Implementation
 * 
 * Implements ISO 22301:2019 - Security and resilience — Business continuity management systems — Requirements
 * 
 * This module provides business continuity management implementation,
 * continuity planning, and resilience management.
 * 
 * @fileoverview ISO 22301 compliance for business continuity management
 */

import { PrismaClient } from '@prisma/client';

export interface BusinessContinuityManagementSystem {
  id: string;
  name: string;
  description: string;
  scope: string;
  processes: ContinuityProcess[];
  plans: ContinuityPlan[];
  risks: ContinuityRisk[];
  exercises: ContinuityExercise[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContinuityProcess {
  id: string;
  name: string;
  description: string;
  type: 'Critical' | 'Important' | 'Support';
  rto: number; // Recovery Time Objective (hours)
  rpo: number; // Recovery Point Objective (hours)
  dependencies: string[];
  resources: string[];
  procedures: string[];
}

export interface ContinuityPlan {
  id: string;
  name: string;
  description: string;
  process: string;
  scenarios: ContinuityScenario[];
  procedures: ContinuityProcedure[];
  resources: ContinuityResource[];
  contacts: ContinuityContact[];
  version: string;
  approvedBy: string;
  approvedAt: Date;
  nextReview: Date;
}

export interface ContinuityScenario {
  id: string;
  name: string;
  description: string;
  type: 'Natural Disaster' | 'Technology Failure' | 'Human Error' | 'Cyber Attack' | 'Pandemic';
  probability: number;
  impact: number;
  triggers: string[];
  response: string[];
}

export interface ContinuityProcedure {
  id: string;
  name: string;
  description: string;
  sequence: number;
  responsible: string;
  duration: number;
  dependencies: string[];
  resources: string[];
  escalation: string;
}

export interface ContinuityResource {
  id: string;
  name: string;
  type: 'Personnel' | 'Technology' | 'Facility' | 'Equipment' | 'Vendor';
  availability: 'Available' | 'Limited' | 'Unavailable';
  location: string;
  contact: string;
  backup: string;
}

export interface ContinuityContact {
  id: string;
  name: string;
  role: string;
  organization: string;
  phone: string;
  email: string;
  availability: '24/7' | 'Business Hours' | 'On Call';
  escalation: number;
}

export interface ContinuityRisk {
  id: string;
  name: string;
  description: string;
  category: 'Operational' | 'Technology' | 'Human' | 'External';
  probability: number;
  impact: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation: string;
  contingency: string;
  status: 'Open' | 'Mitigated' | 'Accepted' | 'Transferred';
}

export interface ContinuityExercise {
  id: string;
  name: string;
  description: string;
  type: 'Tabletop' | 'Walkthrough' | 'Simulation' | 'Full Scale';
  scenario: string;
  participants: string[];
  objectives: string[];
  conductedAt: Date;
  results: ExerciseResult[];
  lessonsLearned: string[];
  improvements: string[];
}

export interface ExerciseResult {
  id: string;
  objective: string;
  achieved: boolean;
  score: number;
  comments: string;
  improvements: string[];
}

export interface BusinessImpactAnalysis {
  id: string;
  process: string;
  criticality: 'Critical' | 'Important' | 'Support';
  maxTolerableDowntime: number;
  financialImpact: number;
  operationalImpact: string;
  reputationImpact: string;
  dependencies: string[];
  recoveryRequirements: string[];
  conductedAt: Date;
  conductedBy: string;
}

export interface ContinuityAudit {
  id: string;
  title: string;
  description: string;
  scope: string;
  findings: AuditFinding[];
  recommendations: string[];
  score: number;
  conductedAt: Date;
  conductedBy: string;
  nextAudit: Date;
}

export interface AuditFinding {
  id: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Process' | 'Plan' | 'Resource' | 'Exercise' | 'Risk';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  correctiveAction: string;
}

export class Iso22301Compliance {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create business continuity management system
   */
  async createBusinessContinuityManagementSystem(data: Omit<BusinessContinuityManagementSystem, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessContinuityManagementSystem> {
    const system = await this.prisma.businessContinuityManagementSystem.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return system as BusinessContinuityManagementSystem;
  }

  /**
   * Get business continuity management systems
   */
  async getBusinessContinuityManagementSystems(organisationId: string): Promise<BusinessContinuityManagementSystem[]> {
    const systems = await this.prisma.businessContinuityManagementSystem.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return systems as BusinessContinuityManagementSystem[];
  }

  /**
   * Create business impact analysis
   */
  async createBusinessImpactAnalysis(data: Omit<BusinessImpactAnalysis, 'id' | 'conductedAt'>): Promise<BusinessImpactAnalysis> {
    const analysis = await this.prisma.businessImpactAnalysis.create({
      data: {
        ...data,
        conductedAt: new Date(),
      },
    });

    return analysis as BusinessImpactAnalysis;
  }

  /**
   * Get business impact analyses
   */
  async getBusinessImpactAnalyses(organisationId: string): Promise<BusinessImpactAnalysis[]> {
    const analyses = await this.prisma.businessImpactAnalysis.findMany({
      where: { organisationId },
      orderBy: { conductedAt: 'desc' },
    });

    return analyses as BusinessImpactAnalysis[];
  }

  /**
   * Create continuity exercise
   */
  async createContinuityExercise(data: Omit<ContinuityExercise, 'id' | 'conductedAt'>): Promise<ContinuityExercise> {
    const exercise = await this.prisma.continuityExercise.create({
      data: {
        ...data,
        conductedAt: new Date(),
      },
    });

    return exercise as ContinuityExercise;
  }

  /**
   * Get continuity exercises
   */
  async getContinuityExercises(organisationId: string): Promise<ContinuityExercise[]> {
    const exercises = await this.prisma.continuityExercise.findMany({
      where: { organisationId },
      orderBy: { conductedAt: 'desc' },
    });

    return exercises as ContinuityExercise[];
  }

  /**
   * Create continuity audit
   */
  async createContinuityAudit(data: Omit<ContinuityAudit, 'id' | 'conductedAt'>): Promise<ContinuityAudit> {
    const audit = await this.prisma.continuityAudit.create({
      data: {
        ...data,
        conductedAt: new Date(),
      },
    });

    return audit as ContinuityAudit;
  }

  /**
   * Get continuity audits
   */
  async getContinuityAudits(organisationId: string): Promise<ContinuityAudit[]> {
    const audits = await this.prisma.continuityAudit.findMany({
      where: { organisationId },
      orderBy: { conductedAt: 'desc' },
    });

    return audits as ContinuityAudit[];
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    organisationId: string,
    period: { startDate: Date; endDate: Date },
    generatedBy: string
  ): Promise<{
    organisationId: string;
    period: { startDate: Date; endDate: Date };
    generatedBy: string;
    generatedAt: Date;
    complianceScore: number;
    systems: number;
    processes: number;
    plans: number;
    risks: number;
    exercises: number;
    audits: number;
    averageExerciseScore: number;
    recommendations: string[];
  }> {
    const systems = await this.getBusinessContinuityManagementSystems(organisationId);
    const exercises = await this.getContinuityExercises(organisationId);
    const audits = await this.getContinuityAudits(organisationId);

    const complianceScore = this.calculateComplianceScore(systems, exercises, audits);
    const recommendations = this.generateRecommendations(systems, exercises, audits);

    const processes = systems.reduce((sum, sys) => sum + sys.processes.length, 0);
    const plans = systems.reduce((sum, sys) => sum + sys.plans.length, 0);
    const risks = systems.reduce((sum, sys) => sum + sys.risks.length, 0);

    const averageExerciseScore = this.calculateAverageExerciseScore(exercises);

    return {
      organisationId,
      period,
      generatedBy,
      generatedAt: new Date(),
      complianceScore,
      systems: systems.length,
      processes,
      plans,
      risks,
      exercises: exercises.length,
      audits: audits.length,
      averageExerciseScore: Math.round(averageExerciseScore * 100) / 100,
      recommendations,
    };
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(
    systems: BusinessContinuityManagementSystem[],
    exercises: ContinuityExercise[],
    audits: ContinuityAudit[]
  ): number {
    let score = 0;
    let weight = 0;

    // Business continuity management systems
    if (systems.length > 0) {
      const systemScore = systems.reduce((sum, sys) => {
        const processScore = sys.processes.length > 0 ? 100 : 0;
        const planScore = sys.plans.length > 0 ? 100 : 0;
        const riskScore = sys.risks.length > 0 ? 100 : 0;
        const exerciseScore = sys.exercises.length > 0 ? 100 : 0;
        return sum + (processScore + planScore + riskScore + exerciseScore) / 4;
      }, 0) / systems.length;
      score += systemScore * 40;
      weight += 40;
    }

    // Continuity exercises
    if (exercises.length > 0) {
      const exerciseScore = exercises.reduce((sum, exercise) => {
        const achievedObjectives = exercise.results.filter(r => r.achieved).length;
        const totalObjectives = exercise.results.length;
        return sum + (totalObjectives > 0 ? (achievedObjectives / totalObjectives) * 100 : 0);
      }, 0) / exercises.length;
      score += exerciseScore * 30;
      weight += 30;
    }

    // Continuity audits
    if (audits.length > 0) {
      const auditScore = audits.reduce((sum, audit) => {
        return sum + audit.score;
      }, 0) / audits.length;
      score += auditScore * 30;
      weight += 30;
    }

    return weight > 0 ? Math.round(score / weight * 100) : 0;
  }

  /**
   * Calculate average exercise score
   */
  private calculateAverageExerciseScore(exercises: ContinuityExercise[]): number {
    if (exercises.length === 0) return 0;

    const totalScore = exercises.reduce((sum, exercise) => {
      const achievedObjectives = exercise.results.filter(r => r.achieved).length;
      const totalObjectives = exercise.results.length;
      return sum + (totalObjectives > 0 ? (achievedObjectives / totalObjectives) : 0);
    }, 0);

    return totalScore / exercises.length;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    systems: BusinessContinuityManagementSystem[],
    exercises: ContinuityExercise[],
    audits: ContinuityAudit[]
  ): string[] {
    const recommendations: string[] = [];

    if (systems.length === 0) {
      recommendations.push('Implement business continuity management system');
    }

    systems.forEach(sys => {
      if (sys.processes.length === 0) {
        recommendations.push(`Define continuity processes for system: ${sys.name}`);
      }
      if (sys.plans.length === 0) {
        recommendations.push(`Develop continuity plans for system: ${sys.name}`);
      }
      if (sys.risks.length === 0) {
        recommendations.push(`Identify continuity risks for system: ${sys.name}`);
      }
      if (sys.exercises.length === 0) {
        recommendations.push(`Conduct continuity exercises for system: ${sys.name}`);
      }
    });

    const recentExercises = exercises.filter(e => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return e.conductedAt >= sixMonthsAgo;
    });

    if (recentExercises.length === 0) {
      recommendations.push('Conduct continuity exercises within the last 6 months');
    }

    const failedExercises = exercises.filter(e => {
      const achievedObjectives = e.results.filter(r => r.achieved).length;
      const totalObjectives = e.results.length;
      return totalObjectives > 0 && (achievedObjectives / totalObjectives) < 0.8;
    });

    if (failedExercises.length > 0) {
      recommendations.push(`Improve performance in ${failedExercises.length} continuity exercises`);
    }

    const openFindings = audits.flatMap(audit => audit.findings.filter(f => f.status === 'Open'));
    if (openFindings.length > 0) {
      recommendations.push(`Address ${openFindings.length} open audit findings`);
    }

    const overdueAudits = audits.filter(a => a.nextAudit < new Date());
    if (overdueAudits.length > 0) {
      recommendations.push(`Conduct ${overdueAudits.length} overdue continuity audits`);
    }

    return recommendations;
  }
}

export const iso22301Compliance = new Iso22301Compliance(new PrismaClient());
