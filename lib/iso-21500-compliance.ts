/**
 * ISO 21500 Compliance Implementation
 * 
 * Implements ISO 21500:2021 - Guidance on project management
 * 
 * This module provides project management implementation,
 * project lifecycle management, and project quality assurance.
 * 
 * @fileoverview ISO 21500 compliance for project management
 */

import { PrismaClient } from '@prisma/client';

export interface ProjectManagementFramework {
  id: string;
  name: string;
  description: string;
  projects: Project[];
  processes: ProjectProcess[];
  knowledgeAreas: KnowledgeArea[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  phase: 'Initiation' | 'Planning' | 'Execution' | 'Monitoring' | 'Closure';
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: Date;
  endDate: Date;
  budget: number;
  actualCost: number;
  progress: number;
  risks: ProjectRisk[];
  deliverables: ProjectDeliverable[];
  stakeholders: ProjectStakeholder[];
}

export interface ProjectRisk {
  id: string;
  name: string;
  description: string;
  probability: number;
  impact: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation: string;
  status: 'Open' | 'Mitigated' | 'Accepted' | 'Transferred';
}

export interface ProjectDeliverable {
  id: string;
  name: string;
  description: string;
  type: 'Document' | 'Software' | 'Hardware' | 'Service';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Accepted';
  dueDate: Date;
  completedDate?: Date;
  quality: number;
}

export interface ProjectStakeholder {
  id: string;
  name: string;
  role: string;
  influence: 'Low' | 'Medium' | 'High';
  interest: 'Low' | 'Medium' | 'High';
  communication: string;
  satisfaction: number;
}

export interface ProjectProcess {
  id: string;
  name: string;
  description: string;
  group: 'Initiating' | 'Planning' | 'Executing' | 'Monitoring' | 'Closing';
  inputs: string[];
  outputs: string[];
  tools: string[];
  techniques: string[];
}

export interface KnowledgeArea {
  id: string;
  name: string;
  description: string;
  processes: string[];
  skills: string[];
  tools: string[];
  metrics: ProjectMetric[];
}

export interface ProjectMetric {
  id: string;
  name: string;
  type: 'Schedule' | 'Cost' | 'Quality' | 'Scope' | 'Risk';
  value: number;
  target: number;
  unit: string;
  measuredAt: Date;
}

export interface ProjectAudit {
  id: string;
  projectId: string;
  auditType: 'Compliance' | 'Quality' | 'Performance' | 'Risk';
  findings: AuditFinding[];
  recommendations: string[];
  score: number;
  conductedAt: Date;
  conductedBy: string;
}

export interface AuditFinding {
  id: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Process' | 'Documentation' | 'Resource' | 'Quality';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
}

export class Iso21500Compliance {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create project management framework
   */
  async createProjectManagementFramework(data: Omit<ProjectManagementFramework, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectManagementFramework> {
    const framework = await this.prisma.projectManagementFramework.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return framework as ProjectManagementFramework;
  }

  /**
   * Get project management frameworks
   */
  async getProjectManagementFrameworks(organisationId: string): Promise<ProjectManagementFramework[]> {
    const frameworks = await this.prisma.projectManagementFramework.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return frameworks as ProjectManagementFramework[];
  }

  /**
   * Create project
   */
  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    const project = await this.prisma.project.create({
      data,
    });

    return project as Project;
  }

  /**
   * Get projects
   */
  async getProjects(organisationId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { organisationId },
      orderBy: { startDate: 'desc' },
    });

    return projects as Project[];
  }

  /**
   * Create project audit
   */
  async createProjectAudit(data: Omit<ProjectAudit, 'id' | 'conductedAt'>): Promise<ProjectAudit> {
    const audit = await this.prisma.projectAudit.create({
      data: {
        ...data,
        conductedAt: new Date(),
      },
    });

    return audit as ProjectAudit;
  }

  /**
   * Get project audits
   */
  async getProjectAudits(organisationId: string): Promise<ProjectAudit[]> {
    const audits = await this.prisma.projectAudit.findMany({
      where: { organisationId },
      orderBy: { conductedAt: 'desc' },
    });

    return audits as ProjectAudit[];
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
    frameworks: number;
    projects: number;
    processes: number;
    knowledgeAreas: number;
    audits: number;
    averageAuditScore: number;
    recommendations: string[];
  }> {
    const frameworks = await this.getProjectManagementFrameworks(organisationId);
    const projects = await this.getProjects(organisationId);
    const audits = await this.getProjectAudits(organisationId);

    const complianceScore = this.calculateComplianceScore(frameworks, projects, audits);
    const recommendations = this.generateRecommendations(frameworks, projects, audits);

    const processes = frameworks.reduce((sum, fw) => sum + fw.processes.length, 0);
    const knowledgeAreas = frameworks.reduce((sum, fw) => sum + fw.knowledgeAreas.length, 0);
    
    const averageAuditScore = audits.length > 0 
      ? audits.reduce((sum, audit) => sum + audit.score, 0) / audits.length 
      : 0;

    return {
      organisationId,
      period,
      generatedBy,
      generatedAt: new Date(),
      complianceScore,
      frameworks: frameworks.length,
      projects: projects.length,
      processes,
      knowledgeAreas,
      audits: audits.length,
      averageAuditScore: Math.round(averageAuditScore * 100) / 100,
      recommendations,
    };
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(
    frameworks: ProjectManagementFramework[],
    projects: Project[],
    audits: ProjectAudit[]
  ): number {
    let score = 0;
    let weight = 0;

    // Project management frameworks
    if (frameworks.length > 0) {
      const frameworkScore = frameworks.reduce((sum, fw) => {
        const processScore = fw.processes.length > 0 ? 100 : 0;
        const knowledgeScore = fw.knowledgeAreas.length > 0 ? 100 : 0;
        const projectScore = fw.projects.length > 0 ? 100 : 0;
        return sum + (processScore + knowledgeScore + projectScore) / 3;
      }, 0) / frameworks.length;
      score += frameworkScore * 40;
      weight += 40;
    }

    // Project performance
    if (projects.length > 0) {
      const projectScore = projects.reduce((sum, project) => {
        const scheduleScore = project.progress >= 90 ? 100 : project.progress;
        const budgetScore = project.actualCost <= project.budget ? 100 : Math.max(0, 100 - ((project.actualCost - project.budget) / project.budget) * 100);
        const qualityScore = project.deliverables.length > 0 
          ? project.deliverables.reduce((sum, del) => sum + del.quality, 0) / project.deliverables.length 
          : 0;
        return sum + (scheduleScore + budgetScore + qualityScore) / 3;
      }, 0) / projects.length;
      score += projectScore * 40;
      weight += 40;
    }

    // Project audits
    if (audits.length > 0) {
      const auditScore = audits.reduce((sum, audit) => {
        return sum + audit.score;
      }, 0) / audits.length;
      score += auditScore * 20;
      weight += 20;
    }

    return weight > 0 ? Math.round(score / weight * 100) : 0;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    frameworks: ProjectManagementFramework[],
    projects: Project[],
    audits: ProjectAudit[]
  ): string[] {
    const recommendations: string[] = [];

    if (frameworks.length === 0) {
      recommendations.push('Implement project management framework');
    }

    frameworks.forEach(fw => {
      if (fw.processes.length === 0) {
        recommendations.push(`Define project processes for framework: ${fw.name}`);
      }
      if (fw.knowledgeAreas.length === 0) {
        recommendations.push(`Define knowledge areas for framework: ${fw.name}`);
      }
      if (fw.projects.length === 0) {
        recommendations.push(`Initiate projects for framework: ${fw.name}`);
      }
    });

    projects.forEach(project => {
      if (project.progress < 50 && project.status === 'Active') {
        recommendations.push(`Accelerate progress for project: ${project.name}`);
      }
      if (project.actualCost > project.budget) {
        recommendations.push(`Control costs for project: ${project.name}`);
      }
      if (project.risks.length === 0) {
        recommendations.push(`Identify risks for project: ${project.name}`);
      }
      if (project.stakeholders.length === 0) {
        recommendations.push(`Identify stakeholders for project: ${project.name}`);
      }
    });

    const openFindings = audits.flatMap(audit => audit.findings.filter(f => f.status === 'Open'));
    if (openFindings.length > 0) {
      recommendations.push(`Address ${openFindings.length} open audit findings`);
    }

    return recommendations;
  }
}

export const iso21500Compliance = new Iso21500Compliance(new PrismaClient());
