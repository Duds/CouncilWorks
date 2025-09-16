/**
 * ISO/IEC 42010 Compliance Implementation
 * 
 * Implements ISO/IEC 42010:2011 - Systems and software engineering — Architecture description
 * 
 * This module provides architecture description framework implementation,
 * stakeholder concerns, architectural viewpoints, and architectural views.
 * 
 * @fileoverview ISO/IEC 42010 compliance for architecture description
 */

import { PrismaClient } from '@prisma/client';

export interface ArchitectureDescription {
  id: string;
  name: string;
  description: string;
  purpose: string;
  scope: string;
  stakeholders: string[];
  concerns: string[];
  viewpoints: ArchitectureViewpoint[];
  views: ArchitectureView[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchitectureViewpoint {
  id: string;
  name: string;
  description: string;
  concerns: string[];
  stakeholders: string[];
  languages: string[];
  methods: string[];
  models: string[];
}

export interface ArchitectureView {
  id: string;
  name: string;
  description: string;
  viewpoint: string;
  models: ArchitectureModel[];
  correspondences: ArchitectureCorrespondence[];
}

export interface ArchitectureModel {
  id: string;
  name: string;
  type: string;
  language: string;
  content: string;
  metadata: Record<string, any>;
}

export interface ArchitectureCorrespondence {
  id: string;
  source: string;
  target: string;
  type: string;
  description: string;
}

export interface StakeholderConcern {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  stakeholder: string;
  viewpoint: string;
}

export class Iso42010Compliance {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create architecture description
   */
  async createArchitectureDescription(data: Omit<ArchitectureDescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<ArchitectureDescription> {
    const description = await this.prisma.architectureDescription.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return description as ArchitectureDescription;
  }

  /**
   * Get architecture descriptions
   */
  async getArchitectureDescriptions(organisationId: string): Promise<ArchitectureDescription[]> {
    const descriptions = await this.prisma.architectureDescription.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return descriptions as ArchitectureDescription[];
  }

  /**
   * Create stakeholder concern
   */
  async createStakeholderConcern(data: Omit<StakeholderConcern, 'id'>): Promise<StakeholderConcern> {
    const concern = await this.prisma.stakeholderConcern.create({
      data,
    });

    return concern as StakeholderConcern;
  }

  /**
   * Get stakeholder concerns
   */
  async getStakeholderConcerns(organisationId: string): Promise<StakeholderConcern[]> {
    const concerns = await this.prisma.stakeholderConcern.findMany({
      where: { organisationId },
      orderBy: { priority: 'desc' },
    });

    return concerns as StakeholderConcern[];
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
    architectureDescriptions: number;
    stakeholderConcerns: number;
    viewpoints: number;
    views: number;
    recommendations: string[];
  }> {
    const descriptions = await this.getArchitectureDescriptions(organisationId);
    const concerns = await this.getStakeholderConcerns(organisationId);

    const complianceScore = this.calculateComplianceScore(descriptions, concerns);
    const recommendations = this.generateRecommendations(descriptions, concerns);

    return {
      organisationId,
      period,
      generatedBy,
      generatedAt: new Date(),
      complianceScore,
      architectureDescriptions: descriptions.length,
      stakeholderConcerns: concerns.length,
      viewpoints: descriptions.reduce((sum, desc) => sum + desc.viewpoints.length, 0),
      views: descriptions.reduce((sum, desc) => sum + desc.views.length, 0),
      recommendations,
    };
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(descriptions: ArchitectureDescription[], concerns: StakeholderConcern[]): number {
    if (descriptions.length === 0) return 0;

    let score = 0;
    let totalWeight = 0;

    // Architecture descriptions completeness
    descriptions.forEach(desc => {
      const weight = 30;
      totalWeight += weight;
      
      let descScore = 0;
      if (desc.stakeholders.length > 0) descScore += 25;
      if (desc.concerns.length > 0) descScore += 25;
      if (desc.viewpoints.length > 0) descScore += 25;
      if (desc.views.length > 0) descScore += 25;
      
      score += (descScore / 100) * weight;
    });

    // Stakeholder concerns coverage
    if (concerns.length > 0) {
      const weight = 20;
      totalWeight += weight;
      const highPriorityConcerns = concerns.filter(c => c.priority === 'High').length;
      const coverageScore = Math.min(100, (highPriorityConcerns / concerns.length) * 100);
      score += (coverageScore / 100) * weight;
    }

    // Viewpoint completeness
    const weight = 25;
    totalWeight += weight;
    const viewpointScore = descriptions.reduce((sum, desc) => {
      return sum + (desc.viewpoints.length > 0 ? 100 : 0);
    }, 0) / descriptions.length;
    score += (viewpointScore / 100) * weight;

    // View completeness
    const viewWeight = 25;
    totalWeight += viewWeight;
    const viewScore = descriptions.reduce((sum, desc) => {
      return sum + (desc.views.length > 0 ? 100 : 0);
    }, 0) / descriptions.length;
    score += (viewScore / 100) * viewWeight;

    return Math.round(score / totalWeight * 100);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(descriptions: ArchitectureDescription[], concerns: StakeholderConcern[]): string[] {
    const recommendations: string[] = [];

    if (descriptions.length === 0) {
      recommendations.push('Create initial architecture description document');
    }

    if (concerns.length === 0) {
      recommendations.push('Identify and document stakeholder concerns');
    }

    descriptions.forEach(desc => {
      if (desc.stakeholders.length === 0) {
        recommendations.push(`Identify stakeholders for architecture description: ${desc.name}`);
      }
      if (desc.concerns.length === 0) {
        recommendations.push(`Document concerns for architecture description: ${desc.name}`);
      }
      if (desc.viewpoints.length === 0) {
        recommendations.push(`Define viewpoints for architecture description: ${desc.name}`);
      }
      if (desc.views.length === 0) {
        recommendations.push(`Create views for architecture description: ${desc.name}`);
      }
    });

    const highPriorityConcerns = concerns.filter(c => c.priority === 'High');
    if (highPriorityConcerns.length > 0) {
      recommendations.push(`Address ${highPriorityConcerns.length} high-priority stakeholder concerns`);
    }

    return recommendations;
  }
}

export const iso42010Compliance = new Iso42010Compliance(new PrismaClient());
