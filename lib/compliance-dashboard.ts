/**
 * Compliance Dashboard and Monitoring System
 * 
 * Comprehensive compliance management system that integrates all ISO standards
 * and provides real-time monitoring, reporting, and alerting capabilities.
 * 
 * @fileoverview Compliance dashboard and monitoring system
 */

import { PrismaClient } from '@prisma/client';
import { iso14224Compliance, ComplianceReport as ISO14224Report } from './iso-14224-compliance';
import { iso55000Compliance } from './iso-55000-compliance';
import { iso27001Compliance } from './iso-27001-compliance';
import { iso31000Compliance } from './iso-31000-compliance';

export interface ComplianceDashboard {
  organisationId: string;
  overallComplianceScore: number;
  standards: {
    iso14224: ComplianceStandardStatus;
    iso55000: ComplianceStandardStatus;
    iso27001: ComplianceStandardStatus;
    iso31000: ComplianceStandardStatus;
  };
  criticalFindings: ComplianceFinding[];
  upcomingReviews: ComplianceReview[];
  recentActivities: ComplianceActivity[];
  lastUpdated: Date;
}

export interface ComplianceStandardStatus {
  standard: string;
  name: string;
  complianceScore: number;
  status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Assessed';
  lastAssessment: Date;
  nextAssessment: Date;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: number;
}

export interface ComplianceFinding {
  id: string;
  standard: string;
  type: 'Non-Compliance' | 'Partial Compliance' | 'Observation' | 'Recommendation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  description: string;
  evidence: string[];
  correctiveAction?: string;
  dueDate?: Date;
  status: 'Open' | 'In Progress' | 'Closed' | 'Overdue';
  assignedTo?: string;
  createdAt: Date;
}

export interface ComplianceReview {
  id: string;
  standard: string;
  type: 'Internal Audit' | 'External Audit' | 'Management Review' | 'Surveillance';
  scheduledDate: Date;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  auditor?: string;
  scope: string;
}

export interface ComplianceActivity {
  id: string;
  type: 'Assessment' | 'Finding' | 'Review' | 'Training' | 'Policy Update';
  description: string;
  standard: string;
  user: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface ComplianceAlert {
  id: string;
  type: 'Overdue Finding' | 'Upcoming Review' | 'Policy Expiry' | 'Training Due' | 'Risk Escalation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  standard: string;
  dueDate?: Date;
  assignedTo?: string;
  status: 'Active' | 'Acknowledged' | 'Resolved' | 'Dismissed';
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export interface ComplianceReport {
  id: string;
  title: string;
  type: 'Standard' | 'Combined' | 'Custom';
  standards: string[];
  period: {
    startDate: Date;
    endDate: Date;
  };
  organisationId: string;
  generatedBy: string;
  generatedAt: Date;
  summary: {
    overallScore: number;
    standardsAssessed: number;
    totalFindings: number;
    criticalFindings: number;
    recommendations: number;
  };
  details: {
    standards: ComplianceStandardStatus[];
    findings: ComplianceFinding[];
    recommendations: string[];
  };
}

export class ComplianceDashboardSystem {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get comprehensive compliance dashboard
   */
  async getComplianceDashboard(organisationId: string): Promise<ComplianceDashboard> {
    const period = {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
      endDate: new Date(),
    };

    // Get compliance reports for all standards
    const [iso14224Report, iso55000Report, iso27001Report, iso31000Report] = await Promise.all([
      iso14224Compliance.generateComplianceReport(organisationId, period, 'System'),
      iso55000Compliance.generateComplianceReport(organisationId, period, 'System'),
      iso27001Compliance.generateComplianceReport(organisationId, period, 'System'),
      iso31000Compliance.generateComplianceReport(organisationId, period, 'System'),
    ]);

    // Calculate overall compliance score
    const overallScore = Math.round(
      (iso14224Report.complianceScore + iso55000Report.complianceScore + 
       iso27001Report.complianceScore + iso31000Report.complianceScore) / 4
    );

    // Get critical findings across all standards
    const criticalFindings: ComplianceFinding[] = [
      ...iso14224Report.findings.map(f => ({ ...f, standard: 'ISO 14224' })),
      ...iso55000Report.findings.map(f => ({ ...f, standard: 'ISO 55000' })),
      ...iso27001Report.findings.map(f => ({ ...f, standard: 'ISO 27001' })),
      ...iso31000Report.findings.map(f => ({ ...f, standard: 'ISO 31000' })),
    ].filter(f => f.severity === 'Critical' || f.severity === 'High');

    // Get upcoming reviews
    const upcomingReviews: ComplianceReview[] = [
      {
        id: 'review-001',
        standard: 'ISO 14224',
        type: 'Internal Audit',
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Scheduled',
        scope: 'Reliability data collection and exchange',
      },
      {
        id: 'review-002',
        standard: 'ISO 55000',
        type: 'Management Review',
        scheduledDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'Scheduled',
        scope: 'Asset management system effectiveness',
      },
      {
        id: 'review-003',
        standard: 'ISO 27001',
        type: 'External Audit',
        scheduledDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'Scheduled',
        auditor: 'External Auditor',
        scope: 'Information security management system',
      },
    ];

    // Get recent activities
    const recentActivities: ComplianceActivity[] = [
      {
        id: 'activity-001',
        type: 'Assessment',
        description: 'ISO 14224 compliance assessment completed',
        standard: 'ISO 14224',
        user: 'Compliance Manager',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'activity-002',
        type: 'Finding',
        description: 'Critical finding identified in ISO 27001 assessment',
        standard: 'ISO 27001',
        user: 'Security Manager',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'activity-003',
        type: 'Training',
        description: 'Risk management training completed',
        standard: 'ISO 31000',
        user: 'Risk Manager',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    const dashboard: ComplianceDashboard = {
      organisationId,
      overallComplianceScore: overallScore,
      standards: {
        iso14224: {
          standard: 'ISO 14224',
          name: 'Reliability Data Collection',
          complianceScore: iso14224Report.complianceScore,
          status: this.getComplianceStatus(iso14224Report.complianceScore),
          lastAssessment: new Date(),
          nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          findings: this.categorizeFindings(iso14224Report.findings),
          recommendations: iso14224Report.recommendations.length,
        },
        iso55000: {
          standard: 'ISO 55000',
          name: 'Asset Management System',
          complianceScore: iso55000Report.complianceScore,
          status: this.getComplianceStatus(iso55000Report.complianceScore),
          lastAssessment: new Date(),
          nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          findings: this.categorizeFindings(iso55000Report.findings),
          recommendations: iso55000Report.recommendations.length,
        },
        iso27001: {
          standard: 'ISO 27001',
          name: 'Information Security',
          complianceScore: iso27001Report.complianceScore,
          status: this.getComplianceStatus(iso27001Report.complianceScore),
          lastAssessment: new Date(),
          nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          findings: this.categorizeFindings(iso27001Report.findings),
          recommendations: iso27001Report.recommendations.length,
        },
        iso31000: {
          standard: 'ISO 31000',
          name: 'Risk Management',
          complianceScore: iso31000Report.complianceScore,
          status: this.getComplianceStatus(iso31000Report.complianceScore),
          lastAssessment: new Date(),
          nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          findings: this.categorizeFindings(iso31000Report.findings),
          recommendations: iso31000Report.recommendations.length,
        },
      },
      criticalFindings,
      upcomingReviews,
      recentActivities,
      lastUpdated: new Date(),
    };

    return dashboard;
  }

  /**
   * Get compliance alerts
   */
  async getComplianceAlerts(organisationId: string): Promise<ComplianceAlert[]> {
    const alerts: ComplianceAlert[] = [];

    // Check for overdue findings
    const dashboard = await this.getComplianceDashboard(organisationId);
    const overdueFindings = dashboard.criticalFindings.filter(f => 
      f.dueDate && f.dueDate < new Date() && f.status !== 'Closed'
    );

    overdueFindings.forEach(finding => {
      alerts.push({
        id: `alert-${finding.id}`,
        type: 'Overdue Finding',
        severity: finding.severity === 'Critical' ? 'Critical' : 'High',
        title: `Overdue Finding: ${finding.description}`,
        description: `Finding in ${finding.standard} is overdue for resolution`,
        standard: finding.standard,
        dueDate: finding.dueDate,
        assignedTo: finding.assignedTo,
        status: 'Active',
        createdAt: new Date(),
      });
    });

    // Check for upcoming reviews
    const upcomingReviews = dashboard.upcomingReviews.filter(r => 
      r.scheduledDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    upcomingReviews.forEach(review => {
      alerts.push({
        id: `alert-review-${review.id}`,
        type: 'Upcoming Review',
        severity: 'Medium',
        title: `Upcoming Review: ${review.standard}`,
        description: `${review.type} for ${review.standard} is scheduled`,
        standard: review.standard,
        dueDate: review.scheduledDate,
        status: 'Active',
        createdAt: new Date(),
      });
    });

    // Check for policy expiries
    const expiringPolicies = [
      {
        id: 'policy-001',
        title: 'Information Security Policy',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        standard: 'ISO 27001',
      },
    ];

    expiringPolicies.forEach(policy => {
      alerts.push({
        id: `alert-policy-${policy.id}`,
        type: 'Policy Expiry',
        severity: 'Medium',
        title: `Policy Expiring: ${policy.title}`,
        description: `${policy.title} expires soon and needs review`,
        standard: policy.standard,
        dueDate: policy.expiryDate,
        status: 'Active',
        createdAt: new Date(),
      });
    });

    return alerts.sort((a, b) => {
      const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Generate comprehensive compliance report
   */
  async generateComplianceReport(
    organisationId: string,
    standards: string[],
    period: { startDate: Date; endDate: Date },
    generatedBy: string
  ): Promise<ComplianceReport> {
    const reports = [];
    let totalScore = 0;
    let totalFindings = 0;
    let totalRecommendations = 0;

    // Generate reports for requested standards
    if (standards.includes('ISO 14224')) {
      const report = await iso14224Compliance.generateComplianceReport(organisationId, period, generatedBy);
      reports.push({ standard: 'ISO 14224', report });
      totalScore += report.complianceScore;
      totalFindings += report.findings.length;
      totalRecommendations += report.recommendations.length;
    }

    if (standards.includes('ISO 55000')) {
      const report = await iso55000Compliance.generateComplianceReport(organisationId, period, generatedBy);
      reports.push({ standard: 'ISO 55000', report });
      totalScore += report.complianceScore;
      totalFindings += report.findings.length;
      totalRecommendations += report.recommendations.length;
    }

    if (standards.includes('ISO 27001')) {
      const report = await iso27001Compliance.generateComplianceReport(organisationId, period, generatedBy);
      reports.push({ standard: 'ISO 27001', report });
      totalScore += report.complianceScore;
      totalFindings += report.findings.length;
      totalRecommendations += report.recommendations.length;
    }

    if (standards.includes('ISO 31000')) {
      const report = await iso31000Compliance.generateComplianceReport(organisationId, period, generatedBy);
      reports.push({ standard: 'ISO 31000', report });
      totalScore += report.complianceScore;
      totalFindings += report.findings.length;
      totalRecommendations += report.recommendations.length;
    }

    const overallScore = reports.length > 0 ? Math.round(totalScore / reports.length) : 0;
    const criticalFindings = reports.reduce((sum, r) => 
      sum + r.report.findings.filter(f => f.severity === 'Critical').length, 0
    );

    const allFindings: ComplianceFinding[] = [];
    const allRecommendations: string[] = [];
    const standardStatuses: ComplianceStandardStatus[] = [];

    reports.forEach(({ standard, report }) => {
      allFindings.push(...report.findings.map(f => ({ ...f, standard })));
      allRecommendations.push(...report.recommendations);
      
      standardStatuses.push({
        standard,
        name: this.getStandardName(standard),
        complianceScore: report.complianceScore,
        status: this.getComplianceStatus(report.complianceScore),
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        findings: this.categorizeFindings(report.findings),
        recommendations: report.recommendations.length,
      });
    });

    const report: ComplianceReport = {
      id: `report-${Date.now()}`,
      title: `Compliance Report - ${standards.join(', ')}`,
      type: standards.length === 1 ? 'Standard' : 'Combined',
      standards,
      period,
      organisationId,
      generatedBy,
      generatedAt: new Date(),
      summary: {
        overallScore,
        standardsAssessed: standards.length,
        totalFindings,
        criticalFindings,
        recommendations: totalRecommendations,
      },
      details: {
        standards: standardStatuses,
        findings: allFindings,
        recommendations: allRecommendations,
      },
    };

    return report;
  }

  /**
   * Acknowledge compliance alert
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<void> {
    // In a real implementation, this would update the alert status in the database
    console.log(`Alert ${alertId} acknowledged by ${acknowledgedBy}`);
  }

  /**
   * Update compliance activity
   */
  async recordComplianceActivity(
    activity: Omit<ComplianceActivity, 'id' | 'timestamp'>
  ): Promise<ComplianceActivity> {
    const newActivity: ComplianceActivity = {
      id: `activity-${Date.now()}`,
      ...activity,
      timestamp: new Date(),
    };

    return newActivity;
  }

  /**
   * Helper methods
   */

  private getComplianceStatus(score: number): 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Assessed' {
    if (score >= 90) return 'Compliant';
    if (score >= 70) return 'Partially Compliant';
    if (score >= 50) return 'Non-Compliant';
    return 'Not Assessed';
  }

  private categorizeFindings(findings: any[]): { critical: number; high: number; medium: number; low: number } {
    return {
      critical: findings.filter(f => f.severity === 'Critical').length,
      high: findings.filter(f => f.severity === 'High').length,
      medium: findings.filter(f => f.severity === 'Medium').length,
      low: findings.filter(f => f.severity === 'Low').length,
    };
  }

  private getStandardName(standard: string): string {
    const names: Record<string, string> = {
      'ISO 14224': 'Reliability Data Collection',
      'ISO 55000': 'Asset Management System',
      'ISO 27001': 'Information Security',
      'ISO 31000': 'Risk Management',
    };
    return names[standard] || standard;
  }
}

export const complianceDashboardSystem = new ComplianceDashboardSystem();
