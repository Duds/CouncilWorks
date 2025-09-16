/**
 * ISO 8000 Compliance Implementation
 * 
 * Implements ISO 8000:2011 - Data quality — Part 110: Master data: Exchange of characteristic data: Syntax, semantic encoding, and conformance to data specification
 * 
 * This module provides data quality management implementation,
 * master data management, and data specification compliance.
 * 
 * @fileoverview ISO 8000 compliance for data quality and master data
 */

import { PrismaClient } from '@prisma/client';

export interface DataQualityFramework {
  id: string;
  name: string;
  description: string;
  dimensions: DataQualityDimension[];
  metrics: DataQualityMetric[];
  thresholds: DataQualityThreshold[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataQualityDimension {
  id: string;
  name: string;
  description: string;
  type: 'Completeness' | 'Accuracy' | 'Consistency' | 'Timeliness' | 'Validity' | 'Uniqueness';
  weight: number;
  measurement: string;
}

export interface DataQualityMetric {
  id: string;
  name: string;
  description: string;
  dimension: string;
  formula: string;
  target: number;
  current: number;
  unit: string;
}

export interface DataQualityThreshold {
  id: string;
  name: string;
  dimension: string;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
  minValue: number;
  maxValue: number;
  action: string;
}

export interface MasterDataEntity {
  id: string;
  name: string;
  type: string;
  attributes: MasterDataAttribute[];
  relationships: MasterDataRelationship[];
  qualityScore: number;
  lastValidated: Date;
}

export interface MasterDataAttribute {
  id: string;
  name: string;
  type: string;
  required: boolean;
  format: string;
  validation: string;
  quality: number;
}

export interface MasterDataRelationship {
  id: string;
  source: string;
  target: string;
  type: string;
  cardinality: string;
  quality: number;
}

export interface DataSpecification {
  id: string;
  name: string;
  version: string;
  syntax: string;
  semantic: string;
  encoding: string;
  conformance: number;
  organisationId: string;
}

export class Iso8000Compliance {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create data quality framework
   */
  async createDataQualityFramework(data: Omit<DataQualityFramework, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataQualityFramework> {
    const framework = await this.prisma.dataQualityFramework.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return framework as DataQualityFramework;
  }

  /**
   * Get data quality frameworks
   */
  async getDataQualityFrameworks(organisationId: string): Promise<DataQualityFramework[]> {
    const frameworks = await this.prisma.dataQualityFramework.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return frameworks as DataQualityFramework[];
  }

  /**
   * Create master data entity
   */
  async createMasterDataEntity(data: Omit<MasterDataEntity, 'id'>): Promise<MasterDataEntity> {
    const entity = await this.prisma.masterDataEntity.create({
      data,
    });

    return entity as MasterDataEntity;
  }

  /**
   * Get master data entities
   */
  async getMasterDataEntities(organisationId: string): Promise<MasterDataEntity[]> {
    const entities = await this.prisma.masterDataEntity.findMany({
      where: { organisationId },
      orderBy: { qualityScore: 'desc' },
    });

    return entities as MasterDataEntity[];
  }

  /**
   * Create data specification
   */
  async createDataSpecification(data: Omit<DataSpecification, 'id'>): Promise<DataSpecification> {
    const specification = await this.prisma.dataSpecification.create({
      data,
    });

    return specification as DataSpecification;
  }

  /**
   * Get data specifications
   */
  async getDataSpecifications(organisationId: string): Promise<DataSpecification[]> {
    const specifications = await this.prisma.dataSpecification.findMany({
      where: { organisationId },
      orderBy: { conformance: 'desc' },
    });

    return specifications as DataSpecification[];
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
    masterDataEntities: number;
    dataSpecifications: number;
    averageQualityScore: number;
    recommendations: string[];
  }> {
    const frameworks = await this.getDataQualityFrameworks(organisationId);
    const entities = await this.getMasterDataEntities(organisationId);
    const specifications = await this.getDataSpecifications(organisationId);

    const complianceScore = this.calculateComplianceScore(frameworks, entities, specifications);
    const recommendations = this.generateRecommendations(frameworks, entities, specifications);

    const averageQualityScore = entities.length > 0 
      ? entities.reduce((sum, entity) => sum + entity.qualityScore, 0) / entities.length 
      : 0;

    return {
      organisationId,
      period,
      generatedBy,
      generatedAt: new Date(),
      complianceScore,
      frameworks: frameworks.length,
      masterDataEntities: entities.length,
      dataSpecifications: specifications.length,
      averageQualityScore: Math.round(averageQualityScore * 100) / 100,
      recommendations,
    };
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(
    frameworks: DataQualityFramework[],
    entities: MasterDataEntity[],
    specifications: DataSpecification[]
  ): number {
    let score = 0;
    let weight = 0;

    // Data quality frameworks
    if (frameworks.length > 0) {
      const frameworkScore = frameworks.reduce((sum, fw) => {
        const dimensionScore = fw.dimensions.length > 0 ? 100 : 0;
        const metricScore = fw.metrics.length > 0 ? 100 : 0;
        const thresholdScore = fw.thresholds.length > 0 ? 100 : 0;
        return sum + (dimensionScore + metricScore + thresholdScore) / 3;
      }, 0) / frameworks.length;
      score += frameworkScore * 30;
      weight += 30;
    }

    // Master data entities
    if (entities.length > 0) {
      const entityScore = entities.reduce((sum, entity) => {
        return sum + entity.qualityScore;
      }, 0) / entities.length;
      score += entityScore * 40;
      weight += 40;
    }

    // Data specifications
    if (specifications.length > 0) {
      const specScore = specifications.reduce((sum, spec) => {
        return sum + spec.conformance;
      }, 0) / specifications.length;
      score += specScore * 30;
      weight += 30;
    }

    return weight > 0 ? Math.round(score / weight * 100) : 0;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    frameworks: DataQualityFramework[],
    entities: MasterDataEntity[],
    specifications: DataSpecification[]
  ): string[] {
    const recommendations: string[] = [];

    if (frameworks.length === 0) {
      recommendations.push('Implement data quality framework');
    }

    if (entities.length === 0) {
      recommendations.push('Define master data entities');
    }

    if (specifications.length === 0) {
      recommendations.push('Create data specifications');
    }

    frameworks.forEach(fw => {
      if (fw.dimensions.length === 0) {
        recommendations.push(`Define data quality dimensions for framework: ${fw.name}`);
      }
      if (fw.metrics.length === 0) {
        recommendations.push(`Implement data quality metrics for framework: ${fw.name}`);
      }
      if (fw.thresholds.length === 0) {
        recommendations.push(`Set data quality thresholds for framework: ${fw.name}`);
      }
    });

    entities.forEach(entity => {
      if (entity.qualityScore < 0.8) {
        recommendations.push(`Improve data quality for entity: ${entity.name}`);
      }
      if (entity.attributes.length === 0) {
        recommendations.push(`Define attributes for master data entity: ${entity.name}`);
      }
    });

    specifications.forEach(spec => {
      if (spec.conformance < 0.8) {
        recommendations.push(`Improve conformance for data specification: ${spec.name}`);
      }
    });

    return recommendations;
  }
}

export const iso8000Compliance = new Iso8000Compliance(new PrismaClient());
