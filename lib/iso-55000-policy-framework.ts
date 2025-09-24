/**
 * ISO 55000 Policy Framework - F23.1
 *
 * Comprehensive asset management policy framework with templates, guidance,
 * alignment tracking, and review processes for ISO 55000 compliance
 *
 * Implements The Aegrid Rules for ISO 55000 compliance and governance
 */

import { prisma } from './prisma';

export interface PolicyFrameworkConfig {
  organisationId: string;
  complianceLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'CERTIFIED';
  reviewCycles: {
    policyReview: number; // Days
    alignmentCheck: number; // Days
    complianceAudit: number; // Days
  };
  templates: PolicyTemplate[];
  governance: GovernanceStructure;
}

export interface PolicyTemplate {
  templateId: string;
  name: string;
  category: PolicyCategory;
  description: string;
  content: string;
  variables: PolicyVariable[];
  complianceRequirements: ComplianceRequirement[];
  lastUpdated: Date;
  version: string;
}

export interface PolicyCategory {
  id: string;
  name: string;
  description: string;
  iso55000Principle: 'VALUE' | 'ALIGNMENT' | 'ASSURANCE' | 'LEADERSHIP';
  mandatory: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PolicyVariable {
  name: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT';
  description: string;
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

export interface ComplianceRequirement {
  requirementId: string;
  iso55000Clause: string;
  description: string;
  mandatory: boolean;
  evidence: EvidenceType[];
  validationCriteria: string;
}

export interface EvidenceType {
  type: 'DOCUMENT' | 'PROCEDURE' | 'RECORD' | 'MEETING_MINUTES' | 'TRAINING_RECORD';
  description: string;
  retentionPeriod: number; // Days
}

export interface GovernanceStructure {
  policyOwner: string;
  reviewBoard: ReviewBoardMember[];
  approvalProcess: ApprovalStep[];
  communicationPlan: CommunicationPlan;
}

export interface ReviewBoardMember {
  name: string;
  role: string;
  department: string;
  responsibilities: string[];
}

export interface ApprovalStep {
  stepNumber: number;
  role: string;
  action: 'REVIEW' | 'APPROVE' | 'ENDORSE' | 'CONSULT';
  timeLimit: number; // Days
  required: boolean;
}

export interface CommunicationPlan {
  stakeholders: Stakeholder[];
  communicationMethods: CommunicationMethod[];
  frequency: number; // Days
  escalationProcess: EscalationProcess;
}

export interface Stakeholder {
  name: string;
  role: string;
  department: string;
  communicationLevel: 'INFORM' | 'CONSULT' | 'PARTICIPATE' | 'LEAD';
}

export interface CommunicationMethod {
  method: 'EMAIL' | 'MEETING' | 'PORTAL' | 'REPORT' | 'TRAINING';
  description: string;
  frequency: number; // Days
}

export interface EscalationProcess {
  levels: EscalationLevel[];
  timeouts: number[]; // Days for each level
  finalAuthority: string;
}

export interface EscalationLevel {
  level: number;
  role: string;
  authority: string;
  actions: string[];
}

export interface PolicyDocument {
  documentId: string;
  organisationId: string;
  templateId: string;
  title: string;
  content: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
  version: string;
  createdBy: string;
  createdAt: Date;
  lastReviewed: Date;
  nextReview: Date;
  approvalHistory: ApprovalRecord[];
  complianceStatus: ComplianceStatus;
  alignmentScore: number; // 0-100
}

export interface ApprovalRecord {
  recordId: string;
  approver: string;
  role: string;
  action: 'APPROVED' | 'REJECTED' | 'CONDITIONAL_APPROVAL';
  comments: string;
  timestamp: Date;
  conditions?: string[];
}

export interface ComplianceStatus {
  overallCompliance: number; // 0-100
  iso55000Alignment: {
    value: number;
    alignment: number;
    assurance: number;
    leadership: number;
  };
  gaps: ComplianceGap[];
  recommendations: ComplianceRecommendation[];
  lastAudit: Date;
  nextAudit: Date;
}

export interface ComplianceGap {
  gapId: string;
  requirementId: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impact: string;
  remediationPlan: string;
  targetDate: Date;
  responsible: string;
}

export interface ComplianceRecommendation {
  recommendationId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  rationale: string;
  implementationPlan: string;
  expectedOutcome: string;
  resourceRequirements: string;
}

export class ISO55000PolicyFramework {
  private organisationId: string;
  private config: PolicyFrameworkConfig;

  constructor(organisationId: string, config?: Partial<PolicyFrameworkConfig>) {
    this.organisationId = organisationId;
    this.config = {
      organisationId,
      complianceLevel: config?.complianceLevel || 'BASIC',
      reviewCycles: config?.reviewCycles || {
        policyReview: 365,
        alignmentCheck: 90,
        complianceAudit: 180,
      },
      templates: config?.templates || this.getDefaultPolicyTemplates(),
      governance: config?.governance || this.getDefaultGovernanceStructure(),
    };
  }

  /**
   * Create a new policy document from template
   */
  async createPolicyDocument(templateId: string, variables: Record<string, any>, createdBy: string): Promise<PolicyDocument> {
    const template = this.config.templates.find(t => t.templateId === templateId);
    if (!template) {
      throw new Error(`Policy template ${templateId} not found`);
    }

    // Validate required variables
    this.validatePolicyVariables(template, variables);

    // Generate content from template
    const content = this.generatePolicyContent(template, variables);

    const documentId = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const policyDocument: PolicyDocument = {
      documentId,
      organisationId: this.organisationId,
      templateId,
      title: this.generatePolicyTitle(template, variables),
      content,
      status: 'DRAFT',
      version: '1.0',
      createdBy,
      createdAt: new Date(),
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + this.config.reviewCycles.policyReview * 24 * 60 * 60 * 1000),
      approvalHistory: [],
      complianceStatus: await this.assessInitialCompliance(template),
      alignmentScore: await this.calculateAlignmentScore(template),
    };

    // Store policy document
    await this.storePolicyDocument(policyDocument);

    return policyDocument;
  }

  /**
   * Review and update policy document
   */
  async reviewPolicyDocument(documentId: string, reviewer: string, comments: string, action: 'APPROVE' | 'REJECT' | 'CONDITIONAL_APPROVAL', conditions?: string[]): Promise<void> {
    const document = await this.getPolicyDocument(documentId);
    if (!document) {
      throw new Error(`Policy document ${documentId} not found`);
    }

    const approvalRecord: ApprovalRecord = {
      recordId: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      approver: reviewer,
      role: this.getReviewerRole(reviewer),
      action,
      comments,
      timestamp: new Date(),
      conditions,
    };

    document.approvalHistory.push(approvalRecord);

    // Update document status based on action
    if (action === 'APPROVED') {
      document.status = 'APPROVED';
    } else if (action === 'REJECTED') {
      document.status = 'DRAFT';
    } else if (action === 'CONDITIONAL_APPROVAL') {
      document.status = 'DRAFT';
    }

    document.lastReviewed = new Date();

    // Update compliance status
    document.complianceStatus = await this.assessComplianceStatus(document);

    await this.updatePolicyDocument(document);
  }

  /**
   * Assess policy alignment with ISO 55000 principles
   */
  async assessPolicyAlignment(documentId: string): Promise<{
    overallAlignment: number;
    principleAlignment: {
      value: number;
      alignment: number;
      assurance: number;
      leadership: number;
    };
    recommendations: string[];
  }> {
    const document = await this.getPolicyDocument(documentId);
    if (!document) {
      throw new Error(`Policy document ${documentId} not found`);
    }

    const template = this.config.templates.find(t => t.templateId === document.templateId);
    if (!template) {
      throw new Error(`Template for document ${documentId} not found`);
    }

    // Analyze content for ISO 55000 principle alignment
    const principleAlignment = {
      value: this.assessValuePrinciple(document.content, template),
      alignment: this.assessAlignmentPrinciple(document.content, template),
      assurance: this.assessAssurancePrinciple(document.content, template),
      leadership: this.assessLeadershipPrinciple(document.content, template),
    };

    const overallAlignment = Object.values(principleAlignment).reduce((sum, score) => sum + score, 0) / 4;

    const recommendations = this.generateAlignmentRecommendations(principleAlignment, template);

    return {
      overallAlignment,
      principleAlignment,
      recommendations,
    };
  }

  /**
   * Generate compliance report for all policies
   */
  async generateComplianceReport(): Promise<{
    reportId: string;
    generatedAt: Date;
    organisationId: string;
    overallCompliance: number;
    policyCompliance: PolicyComplianceSummary[];
    gaps: ComplianceGap[];
    recommendations: ComplianceRecommendation[];
    nextActions: string[];
  }> {
    const policies = await this.getAllPolicyDocuments();

    let totalCompliance = 0;
    const policyCompliance: PolicyComplianceSummary[] = [];
    const allGaps: ComplianceGap[] = [];
    const allRecommendations: ComplianceRecommendation[] = [];

    for (const policy of policies) {
      const compliance = policy.complianceStatus.overallCompliance;
      totalCompliance += compliance;

      policyCompliance.push({
        documentId: policy.documentId,
        title: policy.title,
        compliance,
        status: policy.status,
        lastReviewed: policy.lastReviewed,
        nextReview: policy.nextReview,
        gaps: policy.complianceStatus.gaps,
        recommendations: policy.complianceStatus.recommendations,
      });

      allGaps.push(...policy.complianceStatus.gaps);
      allRecommendations.push(...policy.complianceStatus.recommendations);
    }

    const overallCompliance = policies.length > 0 ? totalCompliance / policies.length : 0;

    const nextActions = this.generateNextActions(policyCompliance, allGaps, allRecommendations);

    const report = {
      reportId: `compliance-report-${Date.now()}`,
      generatedAt: new Date(),
      organisationId: this.organisationId,
      overallCompliance,
      policyCompliance,
      gaps: allGaps,
      recommendations: allRecommendations,
      nextActions,
    };

    // Store compliance report
    await this.storeComplianceReport(report);

    return report;
  }

  /**
   * Track policy implementation progress
   */
  async trackImplementationProgress(): Promise<{
    totalPolicies: number;
    implementedPolicies: number;
    inProgressPolicies: number;
    pendingPolicies: number;
    complianceTrend: ComplianceTrend[];
    upcomingReviews: PolicyReview[];
  }> {
    const policies = await this.getAllPolicyDocuments();

    const implementedPolicies = policies.filter(p => p.status === 'ACTIVE').length;
    const inProgressPolicies = policies.filter(p => p.status === 'DRAFT' || p.status === 'REVIEW').length;
    const pendingPolicies = policies.filter(p => p.status === 'APPROVED').length;

    const complianceTrend = await this.calculateComplianceTrend();
    const upcomingReviews = this.getUpcomingReviews(policies);

    return {
      totalPolicies: policies.length,
      implementedPolicies,
      inProgressPolicies,
      pendingPolicies,
      complianceTrend,
      upcomingReviews,
    };
  }

  // Private helper methods

  private validatePolicyVariables(template: PolicyTemplate, variables: Record<string, any>): void {
    for (const variable of template.variables) {
      if (variable.required && !(variable.name in variables)) {
        throw new Error(`Required variable ${variable.name} not provided`);
      }
    }
  }

  private generatePolicyContent(template: PolicyTemplate, variables: Record<string, any>): string {
    let content = template.content;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return content;
  }

  private generatePolicyTitle(template: PolicyTemplate, variables: Record<string, any>): string {
    return `${template.name} - ${variables.organisationName || 'Organisation'}`;
  }

  private async assessInitialCompliance(template: PolicyTemplate): Promise<ComplianceStatus> {
    return {
      overallCompliance: 0,
      iso55000Alignment: {
        value: 0,
        alignment: 0,
        assurance: 0,
        leadership: 0,
      },
      gaps: [],
      recommendations: [],
      lastAudit: new Date(),
      nextAudit: new Date(Date.now() + this.config.reviewCycles.complianceAudit * 24 * 60 * 60 * 1000),
    };
  }

  private async calculateAlignmentScore(template: PolicyTemplate): Promise<number> {
    // Calculate initial alignment score based on template and requirements
    const baseScore = 50;
    const requirementScore = template.complianceRequirements.length * 5;
    const categoryScore = template.category.priority === 'CRITICAL' ? 20 :
                         template.category.priority === 'HIGH' ? 15 :
                         template.category.priority === 'MEDIUM' ? 10 : 5;

    return Math.min(100, baseScore + requirementScore + categoryScore);
  }

  private async storePolicyDocument(document: PolicyDocument): Promise<void> {
    await prisma.workOrder.create({
      data: {
        organisationId: this.organisationId,
        title: `Policy Document: ${document.title}`,
        description: `ISO 55000 Policy Document - ${document.templateId}`,
        priority: 'Medium',
        status: document.status === 'ACTIVE' ? 'Completed' : 'Pending',
        assignedTo: document.createdBy,
        scheduledDate: document.createdAt,
        metadata: {
          type: 'iso55000_policy_document',
          documentId: document.documentId,
          templateId: document.templateId,
          version: document.version,
          complianceStatus: document.complianceStatus,
          alignmentScore: document.alignmentScore,
        },
      },
    });
  }

  private async getPolicyDocument(documentId: string): Promise<PolicyDocument | null> {
    // Mock implementation - would retrieve from database
    return null;
  }

  private async getAllPolicyDocuments(): Promise<PolicyDocument[]> {
    // Mock implementation - would retrieve from database
    return [];
  }

  private async updatePolicyDocument(document: PolicyDocument): Promise<void> {
    // Mock implementation - would update in database
  }

  private async assessComplianceStatus(document: PolicyDocument): Promise<ComplianceStatus> {
    // Mock implementation - would assess actual compliance
    return document.complianceStatus;
  }

  private getReviewerRole(reviewer: string): string {
    // Mock implementation - would determine role from user data
    return 'Policy Reviewer';
  }

  private assessValuePrinciple(content: string, template: PolicyTemplate): number {
    // Assess how well the policy addresses the value principle
    const valueKeywords = ['value', 'benefit', 'return', 'investment', 'cost', 'efficiency'];
    const matches = valueKeywords.filter(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    return Math.min(100, (matches / valueKeywords.length) * 100);
  }

  private assessAlignmentPrinciple(content: string, template: PolicyTemplate): number {
    // Assess how well the policy addresses the alignment principle
    const alignmentKeywords = ['strategy', 'objective', 'goal', 'plan', 'alignment', 'consistency'];
    const matches = alignmentKeywords.filter(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    return Math.min(100, (matches / alignmentKeywords.length) * 100);
  }

  private assessAssurancePrinciple(content: string, template: PolicyTemplate): number {
    // Assess how well the policy addresses the assurance principle
    const assuranceKeywords = ['assurance', 'control', 'risk', 'compliance', 'audit', 'monitoring'];
    const matches = assuranceKeywords.filter(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    return Math.min(100, (matches / assuranceKeywords.length) * 100);
  }

  private assessLeadershipPrinciple(content: string, template: PolicyTemplate): number {
    // Assess how well the policy addresses the leadership principle
    const leadershipKeywords = ['leadership', 'management', 'responsibility', 'authority', 'decision', 'governance'];
    const matches = leadershipKeywords.filter(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    return Math.min(100, (matches / leadershipKeywords.length) * 100);
  }

  private generateAlignmentRecommendations(principleAlignment: any, template: PolicyTemplate): string[] {
    const recommendations: string[] = [];

    if (principleAlignment.value < 70) {
      recommendations.push('Strengthen value creation and benefit realization aspects in policy content');
    }
    if (principleAlignment.alignment < 70) {
      recommendations.push('Enhance strategic alignment and objective setting components');
    }
    if (principleAlignment.assurance < 70) {
      recommendations.push('Improve risk management and assurance mechanisms');
    }
    if (principleAlignment.leadership < 70) {
      recommendations.push('Strengthen leadership and governance elements');
    }

    return recommendations;
  }

  private generateNextActions(policyCompliance: PolicyComplianceSummary[], gaps: ComplianceGap[], recommendations: ComplianceRecommendation[]): string[] {
    const actions: string[] = [];

    // Critical gaps
    const criticalGaps = gaps.filter(g => g.severity === 'CRITICAL');
    if (criticalGaps.length > 0) {
      actions.push(`Address ${criticalGaps.length} critical compliance gaps immediately`);
    }

    // High priority recommendations
    const highPriorityRecs = recommendations.filter(r => r.priority === 'CRITICAL' || r.priority === 'HIGH');
    if (highPriorityRecs.length > 0) {
      actions.push(`Implement ${highPriorityRecs.length} high-priority recommendations`);
    }

    // Upcoming reviews
    const upcomingReviews = policyCompliance.filter(p =>
      new Date(p.nextReview).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
    );
    if (upcomingReviews.length > 0) {
      actions.push(`Schedule reviews for ${upcomingReviews.length} policies due within 30 days`);
    }

    return actions;
  }

  private async calculateComplianceTrend(): Promise<ComplianceTrend[]> {
    // Mock implementation - would calculate trend from historical data
    return [
      {
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        compliance: 75,
      },
      {
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        compliance: 80,
      },
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        compliance: 85,
      },
      {
        date: new Date(),
        compliance: 90,
      },
    ];
  }

  private getUpcomingReviews(policies: PolicyDocument[]): PolicyReview[] {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return policies
      .filter(p => p.nextReview >= now && p.nextReview <= thirtyDaysFromNow)
      .map(p => ({
        documentId: p.documentId,
        title: p.title,
        nextReview: p.nextReview,
        status: p.status,
        priority: this.calculateReviewPriority(p),
      }));
  }

  private calculateReviewPriority(policy: PolicyDocument): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const daysUntilReview = (policy.nextReview.getTime() - Date.now()) / (24 * 60 * 60 * 1000);

    if (daysUntilReview <= 7) return 'CRITICAL';
    if (daysUntilReview <= 14) return 'HIGH';
    if (daysUntilReview <= 21) return 'MEDIUM';
    return 'LOW';
  }

  private async storeComplianceReport(report: any): Promise<void> {
    // Mock implementation - would store report in database
  }

  private getDefaultPolicyTemplates(): PolicyTemplate[] {
    return [
      {
        templateId: 'asset-management-policy',
        name: 'Asset Management Policy',
        category: {
          id: 'core-policy',
          name: 'Core Asset Management Policy',
          description: 'Fundamental asset management policy',
          iso55000Principle: 'VALUE',
          mandatory: true,
          priority: 'CRITICAL',
        },
        description: 'Comprehensive asset management policy template',
        content: `# Asset Management Policy

## 1. Purpose
This policy establishes the framework for effective asset management within {{organisationName}}.

## 2. Scope
This policy applies to all assets managed by {{organisationName}}.

## 3. Objectives
- Maximize asset value and performance
- Minimize asset lifecycle costs
- Ensure compliance with regulatory requirements
- Support organizational objectives

## 4. Principles
- Value creation and benefit realization
- Strategic alignment with organizational goals
- Risk management and assurance
- Leadership and governance

## 5. Responsibilities
- Asset Manager: {{assetManagerName}}
- Review Date: {{reviewDate}}
- Approval Authority: {{approvalAuthority}}`,
        variables: [
          { name: 'organisationName', type: 'TEXT', description: 'Organization name', required: true },
          { name: 'assetManagerName', type: 'TEXT', description: 'Asset Manager name', required: true },
          { name: 'reviewDate', type: 'DATE', description: 'Policy review date', required: true },
          { name: 'approvalAuthority', type: 'TEXT', description: 'Approval authority', required: true },
        ],
        complianceRequirements: [
          {
            requirementId: 'iso55000-4.1',
            iso55000Clause: '4.1 Value',
            description: 'Policy must demonstrate value creation',
            mandatory: true,
            evidence: [
              { type: 'DOCUMENT', description: 'Policy document', retentionPeriod: 2555 },
            ],
            validationCriteria: 'Policy includes value creation objectives',
          },
        ],
        lastUpdated: new Date(),
        version: '1.0',
      },
    ];
  }

  private getDefaultGovernanceStructure(): GovernanceStructure {
    return {
      policyOwner: 'Asset Management Director',
      reviewBoard: [
        {
          name: 'Asset Management Director',
          role: 'Policy Owner',
          department: 'Asset Management',
          responsibilities: ['Policy development', 'Approval authority'],
        },
        {
          name: 'Compliance Manager',
          role: 'Compliance Reviewer',
          department: 'Compliance',
          responsibilities: ['Compliance assessment', 'Audit coordination'],
        },
      ],
      approvalProcess: [
        {
          stepNumber: 1,
          role: 'Policy Developer',
          action: 'REVIEW',
          timeLimit: 5,
          required: true,
        },
        {
          stepNumber: 2,
          role: 'Compliance Manager',
          action: 'REVIEW',
          timeLimit: 7,
          required: true,
        },
        {
          stepNumber: 3,
          role: 'Asset Management Director',
          action: 'APPROVE',
          timeLimit: 3,
          required: true,
        },
      ],
      communicationPlan: {
        stakeholders: [
          {
            name: 'All Staff',
            role: 'Policy Users',
            department: 'All',
            communicationLevel: 'INFORM',
          },
        ],
        communicationMethods: [
          {
            method: 'EMAIL',
            description: 'Email notification',
            frequency: 0,
          },
        ],
        frequency: 30,
        escalationProcess: {
          levels: [
            {
              level: 1,
              role: 'Line Manager',
              authority: 'Departmental',
              actions: ['Initial review', 'Feedback provision'],
            },
            {
              level: 2,
              role: 'Asset Management Director',
              authority: 'Organizational',
              actions: ['Final approval', 'Policy authorization'],
            },
          ],
          timeouts: [7, 14],
          finalAuthority: 'Chief Executive Officer',
        },
      },
    };
  }
}

// Additional interfaces
export interface PolicyComplianceSummary {
  documentId: string;
  title: string;
  compliance: number;
  status: string;
  lastReviewed: Date;
  nextReview: Date;
  gaps: ComplianceGap[];
  recommendations: ComplianceRecommendation[];
}

export interface ComplianceTrend {
  date: Date;
  compliance: number;
}

export interface PolicyReview {
  documentId: string;
  title: string;
  nextReview: Date;
  status: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export function createISO55000PolicyFramework(
  organisationId: string,
  config?: Partial<PolicyFrameworkConfig>
): ISO55000PolicyFramework {
  return new ISO55000PolicyFramework(organisationId, config);
}
