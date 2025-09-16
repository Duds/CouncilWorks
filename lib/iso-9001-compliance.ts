/**
 * ISO 9001 Compliance Implementation
 * 
 * Implements ISO 9001:2015 - Quality management systems — Requirements
 * 
 * This module provides quality management system implementation,
 * quality processes, and continuous improvement management.
 * 
 * @fileoverview ISO 9001 compliance for quality management systems
 */

import { PrismaClient } from '@prisma/client';

export interface QualityManagementSystem {
  id: string;
  name: string;
  description: string;
  scope: string;
  processes: QualityProcess[];
  objectives: QualityObjective[];
  policies: QualityPolicy[];
  procedures: QualityProcedure[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QualityProcess {
  id: string;
  name: string;
  description: string;
  type: 'Management' | 'Core' | 'Support';
  inputs: string[];
  outputs: string[];
  activities: ProcessActivity[];
  controls: ProcessControl[];
  metrics: QualityMetric[];
  risks: ProcessRisk[];
}

export interface ProcessActivity {
  id: string;
  name: string;
  description: string;
  responsible: string;
  sequence: number;
  duration: number;
  resources: string[];
}

export interface ProcessControl {
  id: string;
  name: string;
  description: string;
  type: 'Preventive' | 'Detective' | 'Corrective';
  frequency: string;
  responsible: string;
  effectiveness: number;
}

export interface QualityMetric {
  id: string;
  name: string;
  description: string;
  type: 'Efficiency' | 'Effectiveness' | 'Customer Satisfaction' | 'Process Performance';
  value: number;
  target: number;
  unit: string;
  measuredAt: Date;
  trend: 'Improving' | 'Stable' | 'Declining';
}

export interface ProcessRisk {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation: string;
  status: 'Open' | 'Mitigated' | 'Accepted' | 'Transferred';
}

export interface QualityObjective {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: 'On Track' | 'At Risk' | 'Behind';
  responsible: string;
  resources: string[];
}

export interface QualityPolicy {
  id: string;
  name: string;
  description: string;
  scope: string;
  commitments: string[];
  objectives: string[];
  compliance: number;
  lastReviewed: Date;
  nextReview: Date;
}

export interface QualityProcedure {
  id: string;
  name: string;
  description: string;
  process: string;
  steps: ProcedureStep[];
  roles: ProcedureRole[];
  forms: string[];
  version: string;
  approvedBy: string;
  approvedAt: Date;
}

export interface ProcedureStep {
  id: string;
  sequence: number;
  description: string;
  responsible: string;
  duration: number;
  inputs: string[];
  outputs: string[];
}

export interface ProcedureRole {
  id: string;
  name: string;
  responsibilities: string[];
  skills: string[];
  training: string[];
}

export interface NonConformity {
  id: string;
  title: string;
  description: string;
  process: string;
  severity: 'Minor' | 'Major' | 'Critical';
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Verified';
  reportedAt: Date;
  closedAt?: Date;
  verifiedAt?: Date;
}

export interface ManagementReview {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  findings: ReviewFinding[];
  decisions: ReviewDecision[];
  actions: ReviewAction[];
  conductedAt: Date;
  conductedBy: string;
  nextReview: Date;
}

export interface ReviewFinding {
  id: string;
  description: string;
  category: 'Performance' | 'Compliance' | 'Risk' | 'Opportunity';
  impact: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Addressed' | 'Closed';
}

export interface ReviewDecision {
  id: string;
  description: string;
  category: 'Resource' | 'Process' | 'Policy' | 'Objective';
  priority: 'Low' | 'Medium' | 'High';
  responsible: string;
  deadline: Date;
}

export interface ReviewAction {
  id: string;
  description: string;
  responsible: string;
  deadline: Date;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  completedAt?: Date;
}

export class Iso9001Compliance {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create quality management system
   */
  async createQualityManagementSystem(data: Omit<QualityManagementSystem, 'id' | 'createdAt' | 'updatedAt'>): Promise<QualityManagementSystem> {
    const system = await this.prisma.qualityManagementSystem.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return system as QualityManagementSystem;
  }

  /**
   * Get quality management systems
   */
  async getQualityManagementSystems(organisationId: string): Promise<QualityManagementSystem[]> {
    const systems = await this.prisma.qualityManagementSystem.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return systems as QualityManagementSystem[];
  }

  /**
   * Create non-conformity
   */
  async createNonConformity(data: Omit<NonConformity, 'id' | 'reportedAt'>): Promise<NonConformity> {
    const nonConformity = await this.prisma.nonConformity.create({
      data: {
        ...data,
        reportedAt: new Date(),
      },
    });

    return nonConformity as NonConformity;
  }

  /**
   * Get non-conformities
   */
  async getNonConformities(organisationId: string): Promise<NonConformity[]> {
    const nonConformities = await this.prisma.nonConformity.findMany({
      where: { organisationId },
      orderBy: { reportedAt: 'desc' },
    });

    return nonConformities as NonConformity[];
  }

  /**
   * Create management review
   */
  async createManagementReview(data: Omit<ManagementReview, 'id' | 'conductedAt'>): Promise<ManagementReview> {
    const review = await this.prisma.managementReview.create({
      data: {
        ...data,
        conductedAt: new Date(),
      },
    });

    return review as ManagementReview;
  }

  /**
   * Get management reviews
   */
  async getManagementReviews(organisationId: string): Promise<ManagementReview[]> {
    const reviews = await this.prisma.managementReview.findMany({
      where: { organisationId },
      orderBy: { conductedAt: 'desc' },
    });

    return reviews as ManagementReview[];
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
    objectives: number;
    policies: number;
    procedures: number;
    nonConformities: number;
    managementReviews: number;
    averageObjectiveAchievement: number;
    recommendations: string[];
  }> {
    const systems = await this.getQualityManagementSystems(organisationId);
    const nonConformities = await this.getNonConformities(organisationId);
    const reviews = await this.getManagementReviews(organisationId);

    const complianceScore = this.calculateComplianceScore(systems, nonConformities, reviews);
    const recommendations = this.generateRecommendations(systems, nonConformities, reviews);

    const processes = systems.reduce((sum, sys) => sum + sys.processes.length, 0);
    const objectives = systems.reduce((sum, sys) => sum + sys.objectives.length, 0);
    const policies = systems.reduce((sum, sys) => sum + sys.policies.length, 0);
    const procedures = systems.reduce((sum, sys) => sum + sys.procedures.length, 0);

    const averageObjectiveAchievement = this.calculateObjectiveAchievement(systems);

    return {
      organisationId,
      period,
      generatedBy,
      generatedAt: new Date(),
      complianceScore,
      systems: systems.length,
      processes,
      objectives,
      policies,
      procedures,
      nonConformities: nonConformities.length,
      managementReviews: reviews.length,
      averageObjectiveAchievement: Math.round(averageObjectiveAchievement * 100) / 100,
      recommendations,
    };
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(
    systems: QualityManagementSystem[],
    nonConformities: NonConformity[],
    reviews: ManagementReview[]
  ): number {
    let score = 0;
    let weight = 0;

    // Quality management systems
    if (systems.length > 0) {
      const systemScore = systems.reduce((sum, sys) => {
        const processScore = sys.processes.length > 0 ? 100 : 0;
        const objectiveScore = sys.objectives.length > 0 ? 100 : 0;
        const policyScore = sys.policies.length > 0 ? 100 : 0;
        const procedureScore = sys.procedures.length > 0 ? 100 : 0;
        return sum + (processScore + objectiveScore + policyScore + procedureScore) / 4;
      }, 0) / systems.length;
      score += systemScore * 40;
      weight += 40;
    }

    // Non-conformity management
    if (nonConformities.length > 0) {
      const closedNonConformities = nonConformities.filter(nc => nc.status === 'Closed' || nc.status === 'Verified').length;
      const nonConformityScore = (closedNonConformities / nonConformities.length) * 100;
      score += nonConformityScore * 30;
      weight += 30;
    }

    // Management reviews
    if (reviews.length > 0) {
      const recentReviews = reviews.filter(r => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return r.conductedAt >= sixMonthsAgo;
      }).length;
      const reviewScore = (recentReviews / reviews.length) * 100;
      score += reviewScore * 30;
      weight += 30;
    }

    return weight > 0 ? Math.round(score / weight * 100) : 0;
  }

  /**
   * Calculate objective achievement
   */
  private calculateObjectiveAchievement(systems: QualityManagementSystem[]): number {
    if (systems.length === 0) return 0;

    let totalAchievement = 0;
    let totalObjectives = 0;

    systems.forEach(sys => {
      sys.objectives.forEach(obj => {
        const achievement = obj.current / obj.target;
        totalAchievement += Math.min(achievement, 1); // Cap at 100%
        totalObjectives++;
      });
    });

    return totalObjectives > 0 ? totalAchievement / totalObjectives : 0;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    systems: QualityManagementSystem[],
    nonConformities: NonConformity[],
    reviews: ManagementReview[]
  ): string[] {
    const recommendations: string[] = [];

    if (systems.length === 0) {
      recommendations.push('Implement quality management system');
    }

    systems.forEach(sys => {
      if (sys.processes.length === 0) {
        recommendations.push(`Define quality processes for system: ${sys.name}`);
      }
      if (sys.objectives.length === 0) {
        recommendations.push(`Set quality objectives for system: ${sys.name}`);
      }
      if (sys.policies.length === 0) {
        recommendations.push(`Define quality policies for system: ${sys.name}`);
      }
      if (sys.procedures.length === 0) {
        recommendations.push(`Document quality procedures for system: ${sys.name}`);
      }
    });

    const openNonConformities = nonConformities.filter(nc => nc.status === 'Open' || nc.status === 'In Progress');
    if (openNonConformities.length > 0) {
      recommendations.push(`Address ${openNonConformities.length} open non-conformities`);
    }

    const overdueReviews = reviews.filter(r => r.nextReview < new Date());
    if (overdueReviews.length > 0) {
      recommendations.push(`Conduct ${overdueReviews.length} overdue management reviews`);
    }

    const overdueActions = reviews.flatMap(r => r.actions.filter(a => a.deadline < new Date() && a.status !== 'Completed'));
    if (overdueActions.length > 0) {
      recommendations.push(`Complete ${overdueActions.length} overdue management review actions`);
    }

    return recommendations;
  }
}

export const iso9001Compliance = new Iso9001Compliance(new PrismaClient());
