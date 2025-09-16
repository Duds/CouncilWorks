/**
 * ISO 31000 Compliance Implementation
 * 
 * Implements ISO 31000:2018 - Risk management — Guidelines
 * 
 * This module provides risk management framework implementation,
 * risk assessment processes, risk treatment, and monitoring.
 * 
 * @fileoverview ISO 31000 compliance for risk management framework
 */

import { PrismaClient } from '@prisma/client';

export interface RiskContext {
  id: string;
  name: string;
  description: string;
  scope: string;
  objectives: string[];
  stakeholders: string[];
  externalFactors: string[];
  internalFactors: string[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskCriteria {
  id: string;
  name: string;
  description: string;
  category: 'Probability' | 'Impact' | 'Risk Level';
  values: RiskCriteriaValue[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskCriteriaValue {
  level: string;
  description: string;
  score: number;
  color: string;
}

export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  contextId: string;
  riskCategory: 'Strategic' | 'Operational' | 'Financial' | 'Compliance' | 'Reputational' | 'Environmental' | 'Safety';
  riskSource: string;
  riskEvent: string;
  riskConsequence: string;
  probability: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  impact: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  riskScore: number;
  riskAppetite: 'Accept' | 'Mitigate' | 'Transfer' | 'Avoid';
  controls: RiskControl[];
  treatmentOptions: RiskTreatment[];
  selectedTreatment?: RiskTreatment;
  residualRisk: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  residualRiskScore: number;
  status: 'Identified' | 'Assessed' | 'Treated' | 'Monitored' | 'Closed';
  assessedBy: string;
  assessmentDate: Date;
  nextReviewDate: Date;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskControl {
  id: string;
  name: string;
  description: string;
  type: 'Preventive' | 'Detective' | 'Corrective' | 'Compensating';
  effectiveness: 'Low' | 'Medium' | 'High';
  cost: number;
  implementationStatus: 'Not Implemented' | 'Partially Implemented' | 'Implemented' | 'Fully Implemented';
  responsible: string;
  dueDate?: Date;
  lastReview: Date;
  nextReview: Date;
}

export interface RiskTreatment {
  id: string;
  name: string;
  description: string;
  type: 'Avoid' | 'Mitigate' | 'Transfer' | 'Accept';
  effectiveness: 'Low' | 'Medium' | 'High';
  cost: number;
  benefits: string[];
  implementationPlan: string;
  responsible: string;
  startDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface RiskRegister {
  id: string;
  name: string;
  description: string;
  contextId: string;
  risks: RiskAssessment[];
  totalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  lastUpdated: Date;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskMonitoring {
  id: string;
  riskId: string;
  monitoringType: 'KPI' | 'KRI' | 'Audit' | 'Review' | 'Incident';
  indicator: string;
  target: number;
  current: number;
  trend: 'Improving' | 'Stable' | 'Declining';
  status: 'Green' | 'Yellow' | 'Red';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  lastMeasurement: Date;
  nextMeasurement: Date;
  responsible: string;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
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

export class ISO31000Compliance {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Create risk context
   */
  async createRiskContext(
    context: Omit<RiskContext, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RiskContext> {
    const newContext: RiskContext = {
      id: `context-${Date.now()}`,
      ...context,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newContext;
  }

  /**
   * Get risk contexts
   */
  async getRiskContexts(organisationId: string): Promise<RiskContext[]> {
    const contexts: RiskContext[] = [
      {
        id: 'context-001',
        name: 'Asset Management Operations',
        description: 'Risk context for asset management operations and maintenance',
        scope: 'All asset management activities including maintenance, inspections, and operations',
        objectives: [
          'Ensure asset availability and reliability',
          'Minimize maintenance costs',
          'Comply with safety regulations',
          'Optimize asset performance',
        ],
        stakeholders: [
          'Asset Managers',
          'Maintenance Teams',
          'Operations Staff',
          'Safety Officers',
          'Compliance Officers',
        ],
        externalFactors: [
          'Regulatory changes',
          'Economic conditions',
          'Weather events',
          'Supply chain disruptions',
        ],
        internalFactors: [
          'Organizational changes',
          'Budget constraints',
          'Staff turnover',
          'Technology changes',
        ],
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'context-002',
        name: 'Information Technology',
        description: 'Risk context for IT systems and data management',
        scope: 'All IT systems, data, and technology infrastructure',
        objectives: [
          'Ensure system availability',
          'Protect data confidentiality',
          'Maintain system integrity',
          'Comply with data protection regulations',
        ],
        stakeholders: [
          'IT Department',
          'Data Protection Officer',
          'System Administrators',
          'End Users',
        ],
        externalFactors: [
          'Cyber threats',
          'Technology changes',
          'Regulatory requirements',
          'Vendor dependencies',
        ],
        internalFactors: [
          'System complexity',
          'User behavior',
          'Budget limitations',
          'Staff skills',
        ],
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return contexts;
  }

  /**
   * Get risk criteria
   */
  async getRiskCriteria(organisationId: string): Promise<RiskCriteria[]> {
    const criteria: RiskCriteria[] = [
      {
        id: 'criteria-001',
        name: 'Probability Criteria',
        description: 'Criteria for assessing probability of risk events',
        category: 'Probability',
        values: [
          { level: 'Very Low', description: 'Rare occurrence', score: 1, color: 'green' },
          { level: 'Low', description: 'Unlikely to occur', score: 2, color: 'lightgreen' },
          { level: 'Medium', description: 'Possible occurrence', score: 3, color: 'yellow' },
          { level: 'High', description: 'Likely to occur', score: 4, color: 'orange' },
          { level: 'Very High', description: 'Almost certain', score: 5, color: 'red' },
        ],
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'criteria-002',
        name: 'Impact Criteria',
        description: 'Criteria for assessing impact of risk events',
        category: 'Impact',
        values: [
          { level: 'Very Low', description: 'Minimal impact', score: 1, color: 'green' },
          { level: 'Low', description: 'Minor impact', score: 2, color: 'lightgreen' },
          { level: 'Medium', description: 'Moderate impact', score: 3, color: 'yellow' },
          { level: 'High', description: 'Significant impact', score: 4, color: 'orange' },
          { level: 'Very High', description: 'Severe impact', score: 5, color: 'red' },
        ],
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'criteria-003',
        name: 'Risk Level Criteria',
        description: 'Criteria for determining overall risk level',
        category: 'Risk Level',
        values: [
          { level: 'Very Low', description: 'Risk score 1-2', score: 1, color: 'green' },
          { level: 'Low', description: 'Risk score 3-4', score: 2, color: 'lightgreen' },
          { level: 'Medium', description: 'Risk score 5-9', score: 3, color: 'yellow' },
          { level: 'High', description: 'Risk score 10-16', score: 4, color: 'orange' },
          { level: 'Very High', description: 'Risk score 17-25', score: 5, color: 'red' },
        ],
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return criteria;
  }

  /**
   * Conduct risk assessment
   */
  async conductRiskAssessment(
    assessment: Omit<RiskAssessment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RiskAssessment> {
    const newAssessment: RiskAssessment = {
      id: `risk-${Date.now()}`,
      ...assessment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Calculate risk score
    const probabilityScore = this.getProbabilityScore(assessment.probability);
    const impactScore = this.getImpactScore(assessment.impact);
    newAssessment.riskScore = probabilityScore * impactScore;
    newAssessment.riskLevel = this.getRiskLevel(newAssessment.riskScore);

    // Determine risk appetite based on risk level
    if (newAssessment.riskLevel === 'Very High' || newAssessment.riskLevel === 'High') {
      newAssessment.riskAppetite = 'Mitigate';
    } else if (newAssessment.riskLevel === 'Medium') {
      newAssessment.riskAppetite = 'Mitigate';
    } else {
      newAssessment.riskAppetite = 'Accept';
    }

    return newAssessment;
  }

  /**
   * Get risk assessments
   */
  async getRiskAssessments(organisationId: string): Promise<RiskAssessment[]> {
    const assessments: RiskAssessment[] = [
      {
        id: 'risk-001',
        title: 'Asset Failure Risk',
        description: 'Risk of critical asset failure affecting operations',
        contextId: 'context-001',
        riskCategory: 'Operational',
        riskSource: 'Equipment aging and wear',
        riskEvent: 'Critical asset failure',
        riskConsequence: 'Service disruption and safety concerns',
        probability: 'Medium',
        impact: 'High',
        riskLevel: 'High',
        riskScore: 12,
        riskAppetite: 'Mitigate',
        controls: [
          {
            id: 'ctrl-001',
            name: 'Preventive Maintenance',
            description: 'Regular preventive maintenance activities',
            type: 'Preventive',
            effectiveness: 'High',
            cost: 50000,
            implementationStatus: 'Implemented',
            responsible: 'Maintenance Team',
            lastReview: new Date('2024-01-01'),
            nextReview: new Date('2024-07-01'),
          },
        ],
        treatmentOptions: [
          {
            id: 'treatment-001',
            name: 'Enhanced Maintenance Program',
            description: 'Implement more frequent and comprehensive maintenance',
            type: 'Mitigate',
            effectiveness: 'High',
            cost: 75000,
            benefits: ['Reduced failure probability', 'Extended asset life'],
            implementationPlan: 'Gradual implementation over 6 months',
            responsible: 'Maintenance Manager',
            startDate: new Date('2024-02-01'),
            targetCompletionDate: new Date('2024-08-01'),
            status: 'In Progress',
          },
        ],
        selectedTreatment: {
          id: 'treatment-001',
          name: 'Enhanced Maintenance Program',
          description: 'Implement more frequent and comprehensive maintenance',
          type: 'Mitigate',
          effectiveness: 'High',
          cost: 75000,
          benefits: ['Reduced failure probability', 'Extended asset life'],
          implementationPlan: 'Gradual implementation over 6 months',
          responsible: 'Maintenance Manager',
          startDate: new Date('2024-02-01'),
          targetCompletionDate: new Date('2024-08-01'),
          status: 'In Progress',
        },
        residualRisk: 'Medium',
        residualRiskScore: 6,
        status: 'Treated',
        assessedBy: 'Risk Manager',
        assessmentDate: new Date('2024-01-01'),
        nextReviewDate: new Date('2024-07-01'),
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'risk-002',
        title: 'Cybersecurity Risk',
        description: 'Risk of cyber attacks compromising systems and data',
        contextId: 'context-002',
        riskCategory: 'Operational',
        riskSource: 'External threats and vulnerabilities',
        riskEvent: 'Cyber attack',
        riskConsequence: 'System compromise and data breach',
        probability: 'Medium',
        impact: 'High',
        riskLevel: 'High',
        riskScore: 12,
        riskAppetite: 'Mitigate',
        controls: [
          {
            id: 'ctrl-002',
            name: 'Firewall Protection',
            description: 'Network firewall and intrusion detection',
            type: 'Preventive',
            effectiveness: 'High',
            cost: 25000,
            implementationStatus: 'Implemented',
            responsible: 'IT Team',
            lastReview: new Date('2024-01-01'),
            nextReview: new Date('2024-07-01'),
          },
        ],
        treatmentOptions: [
          {
            id: 'treatment-002',
            name: 'Enhanced Security Controls',
            description: 'Implement additional security measures',
            type: 'Mitigate',
            effectiveness: 'High',
            cost: 100000,
            benefits: ['Reduced attack surface', 'Better threat detection'],
            implementationPlan: 'Phased implementation over 12 months',
            responsible: 'CISO',
            startDate: new Date('2024-03-01'),
            targetCompletionDate: new Date('2025-03-01'),
            status: 'Planned',
          },
        ],
        residualRisk: 'Medium',
        residualRiskScore: 6,
        status: 'Treated',
        assessedBy: 'CISO',
        assessmentDate: new Date('2024-01-01'),
        nextReviewDate: new Date('2024-07-01'),
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'risk-003',
        title: 'Regulatory Compliance Risk',
        description: 'Risk of non-compliance with regulatory requirements',
        contextId: 'context-001',
        riskCategory: 'Compliance',
        riskSource: 'Regulatory changes and requirements',
        riskEvent: 'Regulatory non-compliance',
        riskConsequence: 'Fines, penalties, and reputational damage',
        probability: 'Low',
        impact: 'High',
        riskLevel: 'Medium',
        riskScore: 8,
        riskAppetite: 'Mitigate',
        controls: [
          {
            id: 'ctrl-003',
            name: 'Compliance Monitoring',
            description: 'Regular compliance monitoring and reporting',
            type: 'Detective',
            effectiveness: 'High',
            cost: 30000,
            implementationStatus: 'Implemented',
            responsible: 'Compliance Officer',
            lastReview: new Date('2024-01-01'),
            nextReview: new Date('2024-07-01'),
          },
        ],
        treatmentOptions: [
          {
            id: 'treatment-003',
            name: 'Compliance Training Program',
            description: 'Comprehensive compliance training for all staff',
            type: 'Mitigate',
            effectiveness: 'Medium',
            cost: 40000,
            benefits: ['Improved compliance awareness', 'Reduced violation risk'],
            implementationPlan: 'Roll out training program over 3 months',
            responsible: 'HR Manager',
            startDate: new Date('2024-04-01'),
            targetCompletionDate: new Date('2024-07-01'),
            status: 'Planned',
          },
        ],
        residualRisk: 'Low',
        residualRiskScore: 4,
        status: 'Treated',
        assessedBy: 'Compliance Officer',
        assessmentDate: new Date('2024-01-01'),
        nextReviewDate: new Date('2024-07-01'),
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ];

    return assessments;
  }

  /**
   * Create risk register
   */
  async createRiskRegister(
    register: Omit<RiskRegister, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RiskRegister> {
    const newRegister: RiskRegister = {
      id: `register-${Date.now()}`,
      ...register,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newRegister;
  }

  /**
   * Get risk registers
   */
  async getRiskRegisters(organisationId: string): Promise<RiskRegister[]> {
    const assessments = await this.getRiskAssessments(organisationId);
    
    const registers: RiskRegister[] = [
      {
        id: 'register-001',
        name: 'Asset Management Risk Register',
        description: 'Comprehensive risk register for asset management operations',
        contextId: 'context-001',
        risks: assessments.filter(r => r.contextId === 'context-001'),
        totalRisks: assessments.filter(r => r.contextId === 'context-001').length,
        highRisks: assessments.filter(r => r.contextId === 'context-001' && r.riskLevel === 'High').length,
        mediumRisks: assessments.filter(r => r.contextId === 'context-001' && r.riskLevel === 'Medium').length,
        lowRisks: assessments.filter(r => r.contextId === 'context-001' && r.riskLevel === 'Low').length,
        lastUpdated: new Date(),
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'register-002',
        name: 'IT Risk Register',
        description: 'Risk register for information technology systems',
        contextId: 'context-002',
        risks: assessments.filter(r => r.contextId === 'context-002'),
        totalRisks: assessments.filter(r => r.contextId === 'context-002').length,
        highRisks: assessments.filter(r => r.contextId === 'context-002' && r.riskLevel === 'High').length,
        mediumRisks: assessments.filter(r => r.contextId === 'context-002' && r.riskLevel === 'Medium').length,
        lowRisks: assessments.filter(r => r.contextId === 'context-002' && r.riskLevel === 'Low').length,
        lastUpdated: new Date(),
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ];

    return registers;
  }

  /**
   * Set up risk monitoring
   */
  async setupRiskMonitoring(
    monitoring: Omit<RiskMonitoring, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RiskMonitoring> {
    const newMonitoring: RiskMonitoring = {
      id: `monitoring-${Date.now()}`,
      ...monitoring,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newMonitoring;
  }

  /**
   * Get risk monitoring indicators
   */
  async getRiskMonitoring(organisationId: string): Promise<RiskMonitoring[]> {
    const monitoring: RiskMonitoring[] = [
      {
        id: 'monitoring-001',
        riskId: 'risk-001',
        monitoringType: 'KRI',
        indicator: 'Asset Failure Rate',
        target: 5,
        current: 3,
        trend: 'Improving',
        status: 'Green',
        frequency: 'Monthly',
        lastMeasurement: new Date('2024-01-31'),
        nextMeasurement: new Date('2024-02-29'),
        responsible: 'Maintenance Manager',
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-31'),
      },
      {
        id: 'monitoring-002',
        riskId: 'risk-002',
        monitoringType: 'KRI',
        indicator: 'Security Incidents',
        target: 0,
        current: 1,
        trend: 'Stable',
        status: 'Yellow',
        frequency: 'Monthly',
        lastMeasurement: new Date('2024-01-31'),
        nextMeasurement: new Date('2024-02-29'),
        responsible: 'CISO',
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-31'),
      },
      {
        id: 'monitoring-003',
        riskId: 'risk-003',
        monitoringType: 'KPI',
        indicator: 'Compliance Score',
        target: 95,
        current: 92,
        trend: 'Improving',
        status: 'Yellow',
        frequency: 'Quarterly',
        lastMeasurement: new Date('2024-01-31'),
        nextMeasurement: new Date('2024-04-30'),
        responsible: 'Compliance Officer',
        organisationId,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-31'),
      },
    ];

    return monitoring;
  }

  /**
   * Generate ISO 31000 compliance report
   */
  async generateComplianceReport(
    organisationId: string,
    period: { startDate: Date; endDate: Date },
    generatedBy: string
  ): Promise<{
    contexts: RiskContext[];
    criteria: RiskCriteria[];
    assessments: RiskAssessment[];
    registers: RiskRegister[];
    monitoring: RiskMonitoring[];
    complianceScore: number;
    findings: ComplianceFinding[];
    recommendations: string[];
  }> {
    const contexts = await this.getRiskContexts(organisationId);
    const criteria = await this.getRiskCriteria(organisationId);
    const assessments = await this.getRiskAssessments(organisationId);
    const registers = await this.getRiskRegisters(organisationId);
    const monitoring = await this.getRiskMonitoring(organisationId);

    const findings: ComplianceFinding[] = [];
    let complianceScore = 100;

    // Check risk context establishment
    if (contexts.length < 2) {
      findings.push({
        id: `finding-${Date.now()}-1`,
        type: 'Non-Compliance',
        severity: 'High',
        category: 'Risk Context',
        description: 'Insufficient risk contexts established',
        evidence: [`Only ${contexts.length} risk contexts found`],
        correctiveAction: 'Establish comprehensive risk contexts for all business areas',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Open',
      });
      complianceScore -= 25;
    }

    // Check risk criteria
    if (criteria.length < 3) {
      findings.push({
        id: `finding-${Date.now()}-2`,
        type: 'Non-Compliance',
        severity: 'High',
        category: 'Risk Criteria',
        description: 'Incomplete risk criteria framework',
        evidence: [`Only ${criteria.length} risk criteria categories found`],
        correctiveAction: 'Establish comprehensive risk criteria for probability, impact, and risk level',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Open',
      });
      complianceScore -= 20;
    }

    // Check risk assessments
    const untreatedRisks = assessments.filter(r => r.status === 'Identified' || r.status === 'Assessed').length;
    if (untreatedRisks > 0) {
      findings.push({
        id: `finding-${Date.now()}-3`,
        type: 'Partial Compliance',
        severity: 'Medium',
        category: 'Risk Treatment',
        description: `${untreatedRisks} risks identified but not treated`,
        evidence: assessments.filter(r => r.status === 'Identified' || r.status === 'Assessed').map(r => r.title),
        correctiveAction: 'Develop and implement risk treatment plans',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'Open',
      });
      complianceScore -= 15;
    }

    // Check risk monitoring
    const redMonitoring = monitoring.filter(m => m.status === 'Red').length;
    if (redMonitoring > 0) {
      findings.push({
        id: `finding-${Date.now()}-4`,
        type: 'Observation',
        severity: 'Medium',
        category: 'Risk Monitoring',
        description: `${redMonitoring} risk monitoring indicators in red status`,
        evidence: monitoring.filter(m => m.status === 'Red').map(m => m.indicator),
        correctiveAction: 'Address risk monitoring issues and improve controls',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'Open',
      });
      complianceScore -= 10;
    }

    const recommendations = [
      'Establish comprehensive risk management framework',
      'Develop risk management policies and procedures',
      'Implement regular risk assessment processes',
      'Create risk treatment and monitoring programs',
      'Provide risk management training to all staff',
      'Establish risk management governance structure',
      'Implement risk reporting and communication processes',
      'Conduct regular risk management reviews and audits',
    ];

    return {
      contexts,
      criteria,
      assessments,
      registers,
      monitoring,
      complianceScore: Math.max(0, complianceScore),
      findings,
      recommendations,
    };
  }

  /**
   * Helper methods
   */

  private getProbabilityScore(probability: string): number {
    const scores: Record<string, number> = {
      'Very Low': 1,
      'Low': 2,
      'Medium': 3,
      'High': 4,
      'Very High': 5,
    };
    return scores[probability] || 3;
  }

  private getImpactScore(impact: string): number {
    const scores: Record<string, number> = {
      'Very Low': 1,
      'Low': 2,
      'Medium': 3,
      'High': 4,
      'Very High': 5,
    };
    return scores[impact] || 3;
  }

  private getRiskLevel(riskScore: number): 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' {
    if (riskScore <= 2) return 'Very Low';
    if (riskScore <= 4) return 'Low';
    if (riskScore <= 9) return 'Medium';
    if (riskScore <= 16) return 'High';
    return 'Very High';
  }
}

export const iso31000Compliance = new ISO31000Compliance();
