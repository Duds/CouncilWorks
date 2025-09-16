/**
 * ISO 14224 Compliance Implementation
 * 
 * Implements ISO 14224:2016 - Petroleum, petrochemical and natural gas industries
 * — Collection and exchange of reliability and maintenance data for equipment
 * 
 * This module provides standardized equipment classification, failure mode
 * classification, maintenance action classification, and data exchange formats.
 * 
 * @fileoverview ISO 14224 compliance for reliability data management
 */

import { PrismaClient } from '@prisma/client';

export interface EquipmentClassification {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  organisationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FailureModeClassification {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'Functional' | 'Degraded' | 'Complete' | 'Intermittent';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  detectionMethod: string;
  preventionMethod: string;
  organisationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceActionClassification {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'Preventive' | 'Corrective' | 'Predictive' | 'Emergency';
  category: 'Inspection' | 'Cleaning' | 'Lubrication' | 'Adjustment' | 'Replacement' | 'Repair';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'As-Needed';
  organisationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReliabilityData {
  id: string;
  assetId: string;
  equipmentClassificationId: string;
  failureModeId?: string;
  maintenanceActionId?: string;
  dataType: 'Failure' | 'Maintenance' | 'Inspection' | 'Performance';
  eventDate: Date;
  duration?: number; // in hours
  cost?: number;
  description: string;
  metadata: Record<string, any>;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceReport {
  id: string;
  reportType: 'ISO14224' | 'ISO55000' | 'ISO27001' | 'ISO31000';
  period: {
    startDate: Date;
    endDate: Date;
  };
  organisationId: string;
  complianceScore: number;
  findings: ComplianceFinding[];
  recommendations: string[];
  generatedAt: Date;
  generatedBy: string;
}

export interface ComplianceFinding {
  id: string;
  type: 'Non-Compliance' | 'Partial Compliance' | 'Observation' | 'Recommendation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  description: string;
  evidence: string[];
  correctiveAction?: string;
  dueDate?: Date;
  status: 'Open' | 'In Progress' | 'Closed' | 'Overdue';
}

export class ISO14224Compliance {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get equipment classification system
   */
  async getEquipmentClassifications(organisationId: string): Promise<EquipmentClassification[]> {
    // In a real implementation, this would query a dedicated equipment classification table
    // For now, we'll return standard ISO 14224 classifications
    const standardClassifications: EquipmentClassification[] = [
      {
        id: 'eq-001',
        code: 'ROT',
        name: 'Rotating Equipment',
        description: 'Equipment with rotating components',
        category: 'Mechanical',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'eq-002',
        code: 'STA',
        name: 'Static Equipment',
        description: 'Equipment without moving parts',
        category: 'Mechanical',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'eq-003',
        code: 'ELE',
        name: 'Electrical Equipment',
        description: 'Electrical and electronic equipment',
        category: 'Electrical',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'eq-004',
        code: 'INS',
        name: 'Instrumentation',
        description: 'Control and measurement instruments',
        category: 'Instrumentation',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'eq-005',
        code: 'CIV',
        name: 'Civil Infrastructure',
        description: 'Civil and structural infrastructure',
        category: 'Civil',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return standardClassifications;
  }

  /**
   * Get failure mode classification system
   */
  async getFailureModeClassifications(organisationId: string): Promise<FailureModeClassification[]> {
    const standardFailureModes: FailureModeClassification[] = [
      {
        id: 'fm-001',
        code: 'FUNC',
        name: 'Functional Failure',
        description: 'Complete loss of function',
        category: 'Complete',
        severity: 'Critical',
        detectionMethod: 'Performance monitoring',
        preventionMethod: 'Preventive maintenance',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fm-002',
        code: 'DEGR',
        name: 'Degraded Performance',
        description: 'Reduced performance or efficiency',
        category: 'Degraded',
        severity: 'High',
        detectionMethod: 'Condition monitoring',
        preventionMethod: 'Predictive maintenance',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fm-003',
        code: 'INTE',
        name: 'Intermittent Failure',
        description: 'Occasional or sporadic failure',
        category: 'Intermittent',
        severity: 'Medium',
        detectionMethod: 'Fault logging',
        preventionMethod: 'Corrective maintenance',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fm-004',
        code: 'PART',
        name: 'Partial Failure',
        description: 'Partial loss of function',
        category: 'Functional',
        severity: 'Medium',
        detectionMethod: 'Functional testing',
        preventionMethod: 'Preventive maintenance',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return standardFailureModes;
  }

  /**
   * Get maintenance action classification system
   */
  async getMaintenanceActionClassifications(organisationId: string): Promise<MaintenanceActionClassification[]> {
    const standardMaintenanceActions: MaintenanceActionClassification[] = [
      {
        id: 'ma-001',
        code: 'INSP',
        name: 'Inspection',
        description: 'Visual or instrument-based inspection',
        type: 'Preventive',
        category: 'Inspection',
        frequency: 'Monthly',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ma-002',
        code: 'CLEA',
        name: 'Cleaning',
        description: 'Cleaning and housekeeping activities',
        type: 'Preventive',
        category: 'Cleaning',
        frequency: 'Weekly',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ma-003',
        code: 'LUBR',
        name: 'Lubrication',
        description: 'Lubrication and oil changes',
        type: 'Preventive',
        category: 'Lubrication',
        frequency: 'Monthly',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ma-004',
        code: 'ADJU',
        name: 'Adjustment',
        description: 'Calibration and adjustment activities',
        type: 'Preventive',
        category: 'Adjustment',
        frequency: 'Quarterly',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ma-005',
        code: 'REPL',
        name: 'Replacement',
        description: 'Component or equipment replacement',
        type: 'Corrective',
        category: 'Replacement',
        frequency: 'As-Needed',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ma-006',
        code: 'REPA',
        name: 'Repair',
        description: 'Repair and restoration activities',
        type: 'Corrective',
        category: 'Repair',
        frequency: 'As-Needed',
        organisationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return standardMaintenanceActions;
  }

  /**
   * Record reliability data according to ISO 14224
   */
  async recordReliabilityData(data: Omit<ReliabilityData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReliabilityData> {
    const reliabilityData: ReliabilityData = {
      id: `rd-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real implementation, this would be stored in a dedicated reliability data table
    // For now, we'll store it in the asset's metadata or create a separate table
    await this.prisma.asset.update({
      where: { id: data.assetId },
      data: {
        notes: `Reliability data recorded: ${data.description}`,
        updatedAt: new Date(),
      },
    });

    return reliabilityData;
  }

  /**
   * Generate ISO 14224 compliance report
   */
  async generateComplianceReport(
    organisationId: string,
    period: { startDate: Date; endDate: Date },
    generatedBy: string
  ): Promise<ComplianceReport> {
    const assets = await this.prisma.asset.findMany({
      where: { organisationId },
      include: {
        inspections: {
          where: {
            inspectionDate: {
              gte: period.startDate,
              lte: period.endDate,
            },
          },
        },
        maintenance: {
          where: {
            maintenanceDate: {
              gte: period.startDate,
              lte: period.endDate,
            },
          },
        },
        workOrders: {
          where: {
            createdAt: {
              gte: period.startDate,
              lte: period.endDate,
            },
          },
        },
      },
    });

    const findings: ComplianceFinding[] = [];
    let complianceScore = 100;

    // Check equipment classification compliance
    const equipmentClassifications = await this.getEquipmentClassifications(organisationId);
    const assetsWithoutClassification = assets.filter(asset => 
      !asset.tags.some(tag => tag.startsWith('equipment-class:'))
    );

    if (assetsWithoutClassification.length > 0) {
      findings.push({
        id: `finding-${Date.now()}-1`,
        type: 'Non-Compliance',
        severity: 'High',
        category: 'Equipment Classification',
        description: `${assetsWithoutClassification.length} assets lack proper equipment classification`,
        evidence: assetsWithoutClassification.map(asset => asset.assetNumber),
        correctiveAction: 'Assign ISO 14224 equipment classifications to all assets',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'Open',
      });
      complianceScore -= 20;
    }

    // Check failure mode documentation
    const assetsWithFailures = assets.filter(asset => 
      asset.workOrders.some(wo => wo.status === 'COMPLETED' && wo.description.toLowerCase().includes('failure'))
    );

    const failureModeClassifications = await this.getFailureModeClassifications(organisationId);
    const failuresWithoutClassification = assetsWithFailures.filter(asset =>
      !asset.workOrders.some(wo => wo.description.includes('Failure Mode:'))
    );

    if (failuresWithoutClassification.length > 0) {
      findings.push({
        id: `finding-${Date.now()}-2`,
        type: 'Partial Compliance',
        severity: 'Medium',
        category: 'Failure Mode Classification',
        description: `${failuresWithoutClassification.length} failure events lack proper failure mode classification`,
        evidence: failuresWithoutClassification.map(asset => asset.assetNumber),
        correctiveAction: 'Document failure modes according to ISO 14224 standards',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        status: 'Open',
      });
      complianceScore -= 15;
    }

    // Check maintenance action documentation
    const maintenanceActionClassifications = await this.getMaintenanceActionClassifications(organisationId);
    const maintenanceWithoutClassification = assets.filter(asset =>
      asset.maintenance.length > 0 && 
      !asset.maintenance.some(m => m.description.includes('Maintenance Action:'))
    );

    if (maintenanceWithoutClassification.length > 0) {
      findings.push({
        id: `finding-${Date.now()}-3`,
        type: 'Observation',
        severity: 'Low',
        category: 'Maintenance Action Classification',
        description: `${maintenanceWithoutClassification.length} maintenance activities lack proper action classification`,
        evidence: maintenanceWithoutClassification.map(asset => asset.assetNumber),
        correctiveAction: 'Classify maintenance actions according to ISO 14224 standards',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        status: 'Open',
      });
      complianceScore -= 10;
    }

    const recommendations = [
      'Implement automated equipment classification during asset creation',
      'Establish failure mode analysis procedures for all failure events',
      'Standardize maintenance action documentation across all activities',
      'Create regular compliance monitoring and reporting processes',
      'Provide training on ISO 14224 standards to maintenance personnel',
    ];

    const report: ComplianceReport = {
      id: `report-${Date.now()}`,
      reportType: 'ISO14224',
      period,
      organisationId,
      complianceScore: Math.max(0, complianceScore),
      findings,
      recommendations,
      generatedAt: new Date(),
      generatedBy,
    };

    return report;
  }

  /**
   * Get data exchange format for external systems
   */
  async exportReliabilityData(
    organisationId: string,
    format: 'JSON' | 'XML' | 'CSV',
    period?: { startDate: Date; endDate: Date }
  ): Promise<string> {
    const assets = await this.prisma.asset.findMany({
      where: { organisationId },
      include: {
        inspections: period ? {
          where: {
            inspectionDate: {
              gte: period.startDate,
              lte: period.endDate,
            },
          },
        } : true,
        maintenance: period ? {
          where: {
            maintenanceDate: {
              gte: period.startDate,
              lte: period.endDate,
            },
          },
        } : true,
        workOrders: period ? {
          where: {
            createdAt: {
              gte: period.startDate,
              lte: period.endDate,
            },
          },
        } : true,
      },
    });

    const equipmentClassifications = await this.getEquipmentClassifications(organisationId);
    const failureModeClassifications = await this.getFailureModeClassifications(organisationId);
    const maintenanceActionClassifications = await this.getMaintenanceActionClassifications(organisationId);

    const exportData = {
      metadata: {
        standard: 'ISO 14224:2016',
        organisationId,
        exportDate: new Date().toISOString(),
        period: period || { startDate: null, endDate: null },
        version: '1.0',
      },
      classifications: {
        equipment: equipmentClassifications,
        failureModes: failureModeClassifications,
        maintenanceActions: maintenanceActionClassifications,
      },
      assets: assets.map(asset => ({
        assetId: asset.id,
        assetNumber: asset.assetNumber,
        name: asset.name,
        assetType: asset.assetType,
        equipmentClassification: asset.tags.find(tag => tag.startsWith('equipment-class:'))?.split(':')[1] || 'Unknown',
        reliabilityData: {
          inspections: asset.inspections.map(inspection => ({
            date: inspection.inspectionDate,
            type: 'Inspection',
            description: inspection.conditionNotes,
            classification: 'INSP',
          })),
          maintenance: asset.maintenance.map(maintenance => ({
            date: maintenance.maintenanceDate,
            type: maintenance.maintenanceType,
            description: maintenance.description,
            classification: this.getMaintenanceClassification(maintenance.description, maintenanceActionClassifications),
          })),
          failures: asset.workOrders
            .filter(wo => wo.description.toLowerCase().includes('failure'))
            .map(workOrder => ({
              date: workOrder.createdAt,
              type: 'Failure',
              description: workOrder.description,
              classification: this.getFailureClassification(workOrder.description, failureModeClassifications),
            })),
        },
      })),
    };

    switch (format) {
      case 'JSON':
        return JSON.stringify(exportData, null, 2);
      case 'XML':
        return this.convertToXML(exportData);
      case 'CSV':
        return this.convertToCSV(exportData);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Helper methods
   */

  private getMaintenanceClassification(description: string, classifications: MaintenanceActionClassification[]): string {
    const desc = description.toLowerCase();
    if (desc.includes('inspect')) return 'INSP';
    if (desc.includes('clean')) return 'CLEA';
    if (desc.includes('lubricat') || desc.includes('oil')) return 'LUBR';
    if (desc.includes('adjust') || desc.includes('calibrat')) return 'ADJU';
    if (desc.includes('replace')) return 'REPL';
    if (desc.includes('repair')) return 'REPA';
    return 'UNKN';
  }

  private getFailureClassification(description: string, classifications: FailureModeClassification[]): string {
    const desc = description.toLowerCase();
    if (desc.includes('complete') || desc.includes('total')) return 'FUNC';
    if (desc.includes('degraded') || desc.includes('reduced')) return 'DEGR';
    if (desc.includes('intermittent') || desc.includes('sporadic')) return 'INTE';
    if (desc.includes('partial')) return 'PART';
    return 'UNKN';
  }

  private convertToXML(data: any): string {
    // Simplified XML conversion - in production, use a proper XML library
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<reliabilityData>\n';
    xml += `  <metadata>\n`;
    xml += `    <standard>${data.metadata.standard}</standard>\n`;
    xml += `    <organisationId>${data.metadata.organisationId}</organisationId>\n`;
    xml += `    <exportDate>${data.metadata.exportDate}</exportDate>\n`;
    xml += `  </metadata>\n`;
    xml += `  <assets count="${data.assets.length}">\n`;
    
    data.assets.forEach((asset: any) => {
      xml += `    <asset id="${asset.assetId}">\n`;
      xml += `      <assetNumber>${asset.assetNumber}</assetNumber>\n`;
      xml += `      <name>${asset.name}</name>\n`;
      xml += `      <assetType>${asset.assetType}</assetType>\n`;
      xml += `      <equipmentClassification>${asset.equipmentClassification}</equipmentClassification>\n`;
      xml += `    </asset>\n`;
    });
    
    xml += `  </assets>\n`;
    xml += '</reliabilityData>';
    return xml;
  }

  private convertToCSV(data: any): string {
    let csv = 'Asset ID,Asset Number,Name,Asset Type,Equipment Classification,Event Type,Event Date,Description,Classification\n';
    
    data.assets.forEach((asset: any) => {
      const baseInfo = `${asset.assetId},${asset.assetNumber},${asset.name},${asset.assetType},${asset.equipmentClassification}`;
      
      asset.reliabilityData.inspections.forEach((inspection: any) => {
        csv += `${baseInfo},Inspection,${inspection.date},${inspection.description},${inspection.classification}\n`;
      });
      
      asset.reliabilityData.maintenance.forEach((maintenance: any) => {
        csv += `${baseInfo},Maintenance,${maintenance.date},${maintenance.description},${maintenance.classification}\n`;
      });
      
      asset.reliabilityData.failures.forEach((failure: any) => {
        csv += `${baseInfo},Failure,${failure.date},${failure.description},${failure.classification}\n`;
      });
    });
    
    return csv;
  }
}

export const iso14224Compliance = new ISO14224Compliance();
