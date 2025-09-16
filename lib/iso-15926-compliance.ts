/**
 * ISO 15926 Compliance Implementation
 * 
 * Implements ISO 15926:2019 - Industrial automation systems and integration — Integration of lifecycle data for process plants including oil and gas production facilities
 * 
 * This module provides data integration implementation,
 * lifecycle information management, and interoperability standards.
 * 
 * @fileoverview ISO 15926 compliance for data integration and lifecycle information
 */

import { PrismaClient } from '@prisma/client';

export interface LifecycleDataModel {
  id: string;
  name: string;
  description: string;
  version: string;
  entities: LifecycleEntity[];
  relationships: LifecycleRelationship[];
  properties: LifecycleProperty[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LifecycleEntity {
  id: string;
  name: string;
  type: string;
  classification: string;
  properties: EntityProperty[];
  lifecyclePhase: 'Design' | 'Construction' | 'Operation' | 'Maintenance' | 'Decommissioning';
  status: 'Active' | 'Inactive' | 'Deprecated';
}

export interface LifecycleRelationship {
  id: string;
  name: string;
  type: string;
  source: string;
  target: string;
  cardinality: string;
  properties: RelationshipProperty[];
}

export interface LifecycleProperty {
  id: string;
  name: string;
  type: string;
  value: string;
  unit: string;
  dataType: string;
  required: boolean;
}

export interface EntityProperty {
  id: string;
  name: string;
  value: string;
  unit: string;
  dataType: string;
  quality: number;
}

export interface RelationshipProperty {
  id: string;
  name: string;
  value: string;
  unit: string;
  dataType: string;
  quality: number;
}

export interface DataExchangeFormat {
  id: string;
  name: string;
  version: string;
  format: 'STEP' | 'XML' | 'JSON' | 'RDF' | 'OWL';
  schema: string;
  conformance: number;
  organisationId: string;
}

export interface InteroperabilityTest {
  id: string;
  name: string;
  description: string;
  testType: 'Syntax' | 'Semantic' | 'Conformance' | 'Performance';
  status: 'Pass' | 'Fail' | 'Pending';
  result: string;
  executedAt: Date;
}

export class Iso15926Compliance {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create lifecycle data model
   */
  async createLifecycleDataModel(data: Omit<LifecycleDataModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<LifecycleDataModel> {
    const model = await this.prisma.lifecycleDataModel.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return model as LifecycleDataModel;
  }

  /**
   * Get lifecycle data models
   */
  async getLifecycleDataModels(organisationId: string): Promise<LifecycleDataModel[]> {
    const models = await this.prisma.lifecycleDataModel.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return models as LifecycleDataModel[];
  }

  /**
   * Create data exchange format
   */
  async createDataExchangeFormat(data: Omit<DataExchangeFormat, 'id'>): Promise<DataExchangeFormat> {
    const format = await this.prisma.dataExchangeFormat.create({
      data,
    });

    return format as DataExchangeFormat;
  }

  /**
   * Get data exchange formats
   */
  async getDataExchangeFormats(organisationId: string): Promise<DataExchangeFormat[]> {
    const formats = await this.prisma.dataExchangeFormat.findMany({
      where: { organisationId },
      orderBy: { conformance: 'desc' },
    });

    return formats as DataExchangeFormat[];
  }

  /**
   * Create interoperability test
   */
  async createInteroperabilityTest(data: Omit<InteroperabilityTest, 'id' | 'executedAt'>): Promise<InteroperabilityTest> {
    const test = await this.prisma.interoperabilityTest.create({
      data: {
        ...data,
        executedAt: new Date(),
      },
    });

    return test as InteroperabilityTest;
  }

  /**
   * Get interoperability tests
   */
  async getInteroperabilityTests(organisationId: string): Promise<InteroperabilityTest[]> {
    const tests = await this.prisma.interoperabilityTest.findMany({
      where: { organisationId },
      orderBy: { executedAt: 'desc' },
    });

    return tests as InteroperabilityTest[];
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
    dataModels: number;
    entities: number;
    relationships: number;
    exchangeFormats: number;
    interoperabilityTests: number;
    testPassRate: number;
    recommendations: string[];
  }> {
    const models = await this.getLifecycleDataModels(organisationId);
    const formats = await this.getDataExchangeFormats(organisationId);
    const tests = await this.getInteroperabilityTests(organisationId);

    const complianceScore = this.calculateComplianceScore(models, formats, tests);
    const recommendations = this.generateRecommendations(models, formats, tests);

    const entities = models.reduce((sum, model) => sum + model.entities.length, 0);
    const relationships = models.reduce((sum, model) => sum + model.relationships.length, 0);
    
    const passedTests = tests.filter(t => t.status === 'Pass').length;
    const testPassRate = tests.length > 0 ? (passedTests / tests.length) * 100 : 0;

    return {
      organisationId,
      period,
      generatedBy,
      generatedAt: new Date(),
      complianceScore,
      dataModels: models.length,
      entities,
      relationships,
      exchangeFormats: formats.length,
      interoperabilityTests: tests.length,
      testPassRate: Math.round(testPassRate * 100) / 100,
      recommendations,
    };
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(
    models: LifecycleDataModel[],
    formats: DataExchangeFormat[],
    tests: InteroperabilityTest[]
  ): number {
    let score = 0;
    let weight = 0;

    // Data models completeness
    if (models.length > 0) {
      const modelScore = models.reduce((sum, model) => {
        const entityScore = model.entities.length > 0 ? 100 : 0;
        const relationshipScore = model.relationships.length > 0 ? 100 : 0;
        const propertyScore = model.properties.length > 0 ? 100 : 0;
        return sum + (entityScore + relationshipScore + propertyScore) / 3;
      }, 0) / models.length;
      score += modelScore * 40;
      weight += 40;
    }

    // Data exchange formats
    if (formats.length > 0) {
      const formatScore = formats.reduce((sum, format) => {
        return sum + format.conformance;
      }, 0) / formats.length;
      score += formatScore * 30;
      weight += 30;
    }

    // Interoperability tests
    if (tests.length > 0) {
      const passedTests = tests.filter(t => t.status === 'Pass').length;
      const testScore = (passedTests / tests.length) * 100;
      score += testScore * 30;
      weight += 30;
    }

    return weight > 0 ? Math.round(score / weight * 100) : 0;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    models: LifecycleDataModel[],
    formats: DataExchangeFormat[],
    tests: InteroperabilityTest[]
  ): string[] {
    const recommendations: string[] = [];

    if (models.length === 0) {
      recommendations.push('Implement lifecycle data models');
    }

    if (formats.length === 0) {
      recommendations.push('Define data exchange formats');
    }

    if (tests.length === 0) {
      recommendations.push('Implement interoperability testing');
    }

    models.forEach(model => {
      if (model.entities.length === 0) {
        recommendations.push(`Define entities for data model: ${model.name}`);
      }
      if (model.relationships.length === 0) {
        recommendations.push(`Define relationships for data model: ${model.name}`);
      }
      if (model.properties.length === 0) {
        recommendations.push(`Define properties for data model: ${model.name}`);
      }
    });

    formats.forEach(format => {
      if (format.conformance < 0.8) {
        recommendations.push(`Improve conformance for exchange format: ${format.name}`);
      }
    });

    const failedTests = tests.filter(t => t.status === 'Fail');
    if (failedTests.length > 0) {
      recommendations.push(`Address ${failedTests.length} failed interoperability tests`);
    }

    return recommendations;
  }
}

export const iso15926Compliance = new Iso15926Compliance(new PrismaClient());
