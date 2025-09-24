/**
 * ISO 55000 Compliance Integration Tests - E23
 *
 * Comprehensive tests for ISO 55000 compliance functionality including
 * policy framework, strategic planning, objectives, and performance evaluation
 *
 * Implements The Aegrid Rules for ISO 55000 compliance and governance
 */

import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import {
  AssetManagementObjectives,
  createAssetManagementObjectives,
} from '../lib/asset-management-objectives';
import {
  ISO55000PolicyFramework,
  createISO55000PolicyFramework,
} from '../lib/iso-55000-policy-framework';
import {
  PerformanceEvaluationSystem,
  createPerformanceEvaluationSystem,
} from '../lib/performance-evaluation-system';
import { prisma } from '../lib/prisma';
import {
  StrategicAssetManagementPlan,
  createStrategicAssetManagementPlan,
} from '../lib/strategic-asset-management-plan';

// Mock Prisma client for isolated testing
jest.mock('../lib/prisma', () => ({
  prisma: {
    workOrder: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    organisation: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('ISO 55000 Compliance (E23) Integration Tests', () => {
  const organisationId = 'test-org-iso55000';
  let policyFramework: ISO55000PolicyFramework;
  let strategicPlan: StrategicAssetManagementPlan;
  let objectives: AssetManagementObjectives;
  let performanceEvaluation: PerformanceEvaluationSystem;

  beforeEach(async () => {
    policyFramework = createISO55000PolicyFramework(organisationId);
    strategicPlan = createStrategicAssetManagementPlan(organisationId);
    objectives = createAssetManagementObjectives(organisationId);
    performanceEvaluation = createPerformanceEvaluationSystem(organisationId);

    // Mock workOrder.create for all tests
    (prisma.workOrder.create as jest.Mock).mockResolvedValue({
      id: 'mock-work-order-id',
      organisationId,
      title: 'Mock Work Order',
      description: 'Mock description',
      priority: 'High',
      status: 'Pending',
      assignedTo: 'test-user',
      scheduledDate: new Date(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('F23.1: Policy Framework Integration', () => {
    it('should create policy document from template', async () => {
      const templateId = 'asset-management-policy';
      const variables = {
        organisationName: 'Test Organisation',
        assetManagerName: 'John Doe',
        reviewDate: new Date(),
        approvalAuthority: 'CEO',
      };
      const createdBy = 'policy-creator';

      const policyDocument = await policyFramework.createPolicyDocument(
        templateId,
        variables,
        createdBy
      );

      expect(policyDocument).toBeDefined();
      expect(policyDocument.documentId).toBeDefined();
      expect(policyDocument.organisationId).toBe(organisationId);
      expect(policyDocument.templateId).toBe(templateId);
      expect(policyDocument.title).toContain('Asset Management Policy');
      expect(policyDocument.status).toBe('DRAFT');
      expect(policyDocument.version).toBe('1.0');
      expect(policyDocument.createdBy).toBe(createdBy);
      expect(policyDocument.content).toContain('Test Organisation');
      expect(policyDocument.content).toContain('John Doe');
    });

    it('should review and approve policy document', async () => {
      // First create a policy document
      const templateId = 'asset-management-policy';
      const variables = {
        organisationName: 'Test Organisation',
        assetManagerName: 'John Doe',
        reviewDate: new Date(),
        approvalAuthority: 'CEO',
      };
      const createdBy = 'policy-creator';

      const policyDocument = await policyFramework.createPolicyDocument(
        templateId,
        variables,
        createdBy
      );

      // Then review it
      const reviewer = 'policy-reviewer';
      const comments = 'Policy looks good, approved';
      const action = 'APPROVE';

      // Mock the getPolicyDocument method to return our created document
      jest
        .spyOn(policyFramework as any, 'getPolicyDocument')
        .mockResolvedValue(policyDocument);
      jest
        .spyOn(policyFramework as any, 'updatePolicyDocument')
        .mockResolvedValue(undefined);

      await policyFramework.reviewPolicyDocument(
        documentId,
        reviewer,
        comments,
        action
      );

      expect(policyDocument.approvalHistory).toHaveLength(1);
      expect(policyDocument.approvalHistory[0].approver).toBe(reviewer);
      expect(policyFramework.approvalHistory[0].action).toBe('APPROVED');
      expect(policyDocument.approvalHistory[0].comments).toBe(comments);
    });

    it('should assess policy alignment with ISO 55000 principles', async () => {
      const documentId = 'test-policy-document';
      const mockDocument = {
        documentId,
        content:
          'This policy demonstrates value creation, strategic alignment, assurance, and leadership.',
        templateId: 'asset-management-policy',
      };

      jest
        .spyOn(policyFramework as any, 'getPolicyDocument')
        .mockResolvedValue(mockDocument);

      const alignment = await policyFramework.assessPolicyAlignment(documentId);

      expect(alignment).toBeDefined();
      expect(alignment.overallAlignment).toBeGreaterThanOrEqual(0);
      expect(alignment.overallAlignment).toBeLessThanOrEqual(100);
      expect(alignment.principleAlignment).toBeDefined();
      expect(alignment.principleAlignment.value).toBeGreaterThanOrEqual(0);
      expect(alignment.principleAlignment.alignment).toBeGreaterThanOrEqual(0);
      expect(alignment.principleAlignment.assurance).toBeGreaterThanOrEqual(0);
      expect(alignment.principleAlignment.leadership).toBeGreaterThanOrEqual(0);
      expect(alignment.recommendations).toBeInstanceOf(Array);
    });

    it('should generate compliance report for all policies', async () => {
      const mockPolicies = [
        {
          documentId: 'policy-1',
          title: 'Asset Management Policy',
          compliance: { overallCompliance: 85 },
          status: 'ACTIVE',
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          gaps: [],
          recommendations: [],
        },
      ];

      jest
        .spyOn(policyFramework as any, 'getAllPolicyDocuments')
        .mockResolvedValue(mockPolicies);

      const complianceReport = await policyFramework.generateComplianceReport();

      expect(complianceReport).toBeDefined();
      expect(complianceReport.reportId).toBeDefined();
      expect(complianceReport.organisationId).toBe(organisationId);
      expect(complianceReport.overallCompliance).toBeGreaterThanOrEqual(0);
      expect(complianceReport.policyCompliance).toBeInstanceOf(Array);
      expect(complianceReport.gaps).toBeInstanceOf(Array);
      expect(complianceReport.recommendations).toBeInstanceOf(Array);
      expect(complianceReport.nextActions).toBeInstanceOf(Array);
    });

    it('should track policy implementation progress', async () => {
      const progress = await policyFramework.trackImplementationProgress();

      expect(progress).toBeDefined();
      expect(progress.totalPolicies).toBeGreaterThanOrEqual(0);
      expect(progress.implementedPolicies).toBeGreaterThanOrEqual(0);
      expect(progress.inProgressPolicies).toBeGreaterThanOrEqual(0);
      expect(progress.pendingPolicies).toBeGreaterThanOrEqual(0);
      expect(progress.complianceTrend).toBeInstanceOf(Array);
      expect(progress.upcomingReviews).toBeInstanceOf(Array);
    });
  });

  describe('F23.2: Strategic Asset Management Plan Integration', () => {
    it('should create strategic asset management plan', async () => {
      const title = 'Strategic Asset Management Plan 2025';
      const description = 'Comprehensive strategic plan for asset management';
      const planningHorizon = 5;
      const createdBy = 'strategic-planner';

      const plan = await strategicPlan.createStrategicPlan(
        title,
        description,
        planningHorizon,
        createdBy
      );

      expect(plan).toBeDefined();
      expect(plan.planId).toBeDefined();
      expect(plan.organisationId).toBe(organisationId);
      expect(plan.title).toBe(title);
      expect(plan.description).toBe(description);
      expect(plan.planningPeriod.horizon).toBe(planningHorizon);
      expect(plan.status).toBe('DRAFT');
      expect(plan.version).toBe('1.0');
      expect(plan.createdBy).toBe(createdBy);
      expect(plan.objectives).toBeInstanceOf(Array);
      expect(plan.strategies).toBeInstanceOf(Array);
      expect(plan.scenarios).toBeInstanceOf(Array);
      expect(plan.forecasts).toBeInstanceOf(Array);
      expect(plan.lifecyclePlans).toBeInstanceOf(Array);
    });

    it('should add strategic objective to plan', async () => {
      // First create a plan
      const plan = await strategicPlan.createStrategicPlan(
        'Test Plan',
        'Test Description',
        5,
        'test-user'
      );

      const objective = {
        title: 'Improve Asset Performance',
        description: 'Increase asset efficiency by 20%',
        category: {
          id: 'performance',
          name: 'Performance',
          description: 'Performance objectives',
          iso55000Principle: 'VALUE' as const,
          strategicTheme: 'Efficiency',
          weight: 0.5,
        },
        priority: 'HIGH' as const,
        type: {
          id: 'operational',
          name: 'Operational',
          description: 'Operational objectives',
          category: 'OPERATIONAL' as const,
          measurement: 'QUANTITATIVE' as const,
          timeframe: 'MEDIUM_TERM' as const,
        },
        targets: [
          {
            description: 'Achieve 20% efficiency improvement',
            type: 'PERCENTAGE' as const,
            value: 20,
            unit: '%',
            baseline: 0,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            measurementFrequency: 30,
            confidence: 0.8,
            assumptions: ['Current baseline is accurate'],
          },
        ],
        metrics: [],
        timeline: {
          startDate: new Date(),
          targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          milestones: [],
          dependencies: [],
          criticalPath: [],
          buffer: 30,
        },
        dependencies: [],
        risks: [],
        resources: [],
        owner: 'asset-manager',
        stakeholders: ['operations-team'],
      };

      jest
        .spyOn(strategicPlan as any, 'getStrategicPlan')
        .mockResolvedValue(plan);
      jest
        .spyOn(strategicPlan as any, 'updateStrategicPlan')
        .mockResolvedValue(undefined);

      await strategicPlan.addStrategicObjective(plan.planId, objective);

      expect(plan.objectives).toHaveLength(1);
      expect(plan.objectives[0].title).toBe(objective.title);
      expect(plan.objectives[0].description).toBe(objective.description);
    });

    it('should create scenario analysis', async () => {
      const plan = await strategicPlan.createStrategicPlan(
        'Test Plan',
        'Test Description',
        5,
        'test-user'
      );

      const scenario = {
        name: 'Best Case Scenario',
        description: 'Optimistic scenario with favorable conditions',
        type: {
          id: 'best-case',
          name: 'Best Case',
          description: 'Most favorable outcome scenario',
          category: 'BEST_CASE' as const,
          focus: 'Maximum value realization',
        },
        assumptions: [
          {
            description: 'Favorable economic conditions',
            type: 'ECONOMIC' as const,
            confidence: 'HIGH' as const,
            source: 'Economic forecasts',
            validation: 'Historical data analysis',
          },
        ],
        parameters: [],
        outcomes: [],
        probability: 0.25,
        impact: {
          financial: {
            cost: -100000,
            revenue: 500000,
            roi: 0.25,
            payback: 2,
            npv: 1000000,
          },
          operational: {
            efficiency: 0.95,
            capacity: 1.2,
            quality: 0.98,
            reliability: 0.99,
            safety: 0.99,
          },
          strategic: {
            objectives: ['Cost reduction', 'Performance improvement'],
            alignment: 0.95,
            competitiveness: 0.9,
            sustainability: 0.85,
          },
          risk: {
            overall: 0.2,
            categories: { technical: 0.1, financial: 0.2, operational: 0.15 },
            mitigation: ['Regular monitoring', 'Preventive maintenance'],
            monitoring: ['Performance metrics', 'Financial indicators'],
          },
        },
        recommendations: [
          'Implement aggressive cost reduction strategies',
          'Invest in performance improvement technologies',
        ],
      };

      jest
        .spyOn(strategicPlan as any, 'getStrategicPlan')
        .mockResolvedValue(plan);
      jest
        .spyOn(strategicPlan as any, 'updateStrategicPlan')
        .mockResolvedValue(undefined);

      await strategicPlan.createScenarioAnalysis(plan.planId, scenario);

      expect(plan.scenarios).toHaveLength(1);
      expect(plan.scenarios[0].name).toBe(scenario.name);
      expect(plan.scenarios[0].probability).toBe(scenario.probability);
    });

    it('should track implementation progress', async () => {
      const plan = await strategicPlan.createStrategicPlan(
        'Test Plan',
        'Test Description',
        5,
        'test-user'
      );

      jest
        .spyOn(strategicPlan as any, 'getStrategicPlan')
        .mockResolvedValue(plan);
      jest
        .spyOn(strategicPlan as any, 'updateStrategicPlan')
        .mockResolvedValue(undefined);

      const progress = await strategicPlan.trackImplementationProgress(
        plan.planId
      );

      expect(progress).toBeDefined();
      expect(progress.overallProgress).toBeGreaterThanOrEqual(0);
      expect(progress.overallProgress).toBeLessThanOrEqual(100);
      expect(progress.objectives).toBeInstanceOf(Array);
      expect(progress.strategies).toBeInstanceOf(Array);
      expect(progress.milestones).toBeInstanceOf(Array);
      expect(progress.risks).toBeInstanceOf(Array);
      expect(progress.budget).toBeDefined();
    });

    it('should generate strategic dashboard', async () => {
      const plan = await strategicPlan.createStrategicPlan(
        'Test Plan',
        'Test Description',
        5,
        'test-user'
      );

      jest
        .spyOn(strategicPlan as any, 'getStrategicPlan')
        .mockResolvedValue(plan);

      const dashboard = await strategicPlan.generateStrategicDashboard(
        plan.planId
      );

      expect(dashboard).toBeDefined();
      expect(dashboard.planSummary).toBeDefined();
      expect(dashboard.objectives).toBeDefined();
      expect(dashboard.strategies).toBeDefined();
      expect(dashboard.scenarios).toBeDefined();
      expect(dashboard.forecasts).toBeDefined();
      expect(dashboard.lifecycle).toBeDefined();
      expect(dashboard.progress).toBeDefined();
    });
  });

  describe('F23.3: Asset Management Objectives Integration', () => {
    it('should create asset management objective', async () => {
      const objectiveData = {
        title: 'Improve Energy Efficiency',
        description: 'Reduce energy consumption by 15%',
        category: {
          id: 'efficiency',
          name: 'Efficiency',
          description: 'Efficiency objectives',
          iso55000Principle: 'VALUE' as const,
          strategicTheme: 'Sustainability',
          weight: 0.3,
        },
        priority: 'HIGH' as const,
        status: 'ACTIVE' as const,
        type: {
          id: 'operational',
          name: 'Operational',
          description: 'Operational objectives',
          category: 'OPERATIONAL' as const,
          measurement: 'QUANTITATIVE' as const,
          timeframe: 'MEDIUM_TERM' as const,
        },
        targets: [
          {
            description: 'Achieve 15% energy reduction',
            type: 'PERCENTAGE' as const,
            value: 15,
            unit: '%',
            baseline: 0,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            measurementFrequency: 30,
            confidence: 0.85,
            assumptions: ['Current baseline is accurate'],
          },
        ],
        metrics: [],
        timeline: {
          startDate: new Date(),
          targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          milestones: [],
          dependencies: [],
          criticalPath: [],
          buffer: 30,
        },
        dependencies: [],
        risks: [],
        resources: [],
        owner: 'energy-manager',
        stakeholders: ['facilities-team'],
      };

      const objective = await objectives.createObjective(objectiveData);

      expect(objective).toBeDefined();
      expect(objective.objectiveId).toBeDefined();
      expect(objective.organisationId).toBe(organisationId);
      expect(objective.title).toBe(objectiveData.title);
      expect(objective.description).toBe(objectiveData.description);
      expect(objective.priority).toBe(objectiveData.priority);
      expect(objective.status).toBe(objectiveData.status);
      expect(objective.owner).toBe(objectiveData.owner);
      expect(objective.progress).toBeDefined();
      expect(objective.performance).toBeDefined();
    });

    it('should update objective progress', async () => {
      const objectiveData = {
        title: 'Test Objective',
        description: 'Test description',
        category: {
          id: 'test',
          name: 'Test',
          description: 'Test category',
          iso55000Principle: 'VALUE' as const,
          strategicTheme: 'Test',
          weight: 0.5,
        },
        priority: 'MEDIUM' as const,
        status: 'ACTIVE' as const,
        type: {
          id: 'test',
          name: 'Test',
          description: 'Test type',
          category: 'OPERATIONAL' as const,
          measurement: 'QUANTITATIVE' as const,
          timeframe: 'MEDIUM_TERM' as const,
        },
        targets: [],
        metrics: [],
        timeline: {
          startDate: new Date(),
          targetDate: new Date(),
          milestones: [],
          dependencies: [],
          criticalPath: [],
          buffer: 30,
        },
        dependencies: [],
        risks: [],
        resources: [],
        owner: 'test-owner',
        stakeholders: [],
      };

      const objective = await objectives.createObjective(objectiveData);

      jest
        .spyOn(objectives as any, 'getObjective')
        .mockResolvedValue(objective);
      jest
        .spyOn(objectives as any, 'updateObjective')
        .mockResolvedValue(undefined);

      await objectives.updateObjectiveProgress(objective.objectiveId);

      expect(objective.progress.lastCalculated).toBeDefined();
      expect(objective.lastUpdated).toBeDefined();
    });

    it('should generate KPI dashboard', async () => {
      const dashboard = await objectives.generateKPIDashboard();

      expect(dashboard).toBeDefined();
      expect(dashboard.dashboardId).toBeDefined();
      expect(dashboard.organisationId).toBe(organisationId);
      expect(dashboard.overallPerformance).toBeGreaterThanOrEqual(0);
      expect(dashboard.categoryPerformance).toBeInstanceOf(Array);
      expect(dashboard.topPerformers).toBeInstanceOf(Array);
      expect(dashboard.underPerformers).toBeInstanceOf(Array);
      expect(dashboard.trends).toBeInstanceOf(Array);
      expect(dashboard.recommendations).toBeInstanceOf(Array);
    });

    it('should track objective achievement', async () => {
      const achievement = await objectives.trackObjectiveAchievement();

      expect(achievement).toBeDefined();
      expect(achievement.totalObjectives).toBeGreaterThanOrEqual(0);
      expect(achievement.achievedObjectives).toBeGreaterThanOrEqual(0);
      expect(achievement.atRiskObjectives).toBeGreaterThanOrEqual(0);
      expect(achievement.onTrackObjectives).toBeGreaterThanOrEqual(0);
      expect(achievement.achievementRate).toBeGreaterThanOrEqual(0);
      expect(achievement.achievementRate).toBeLessThanOrEqual(100);
      expect(achievement.riskTrend).toMatch(/^(IMPROVING|STABLE|DECLINING)$/);
      expect(achievement.upcomingMilestones).toBeInstanceOf(Array);
      expect(achievement.criticalRisks).toBeInstanceOf(Array);
    });

    it('should generate performance report', async () => {
      const objectiveData = {
        title: 'Test Objective',
        description: 'Test description',
        category: {
          id: 'test',
          name: 'Test',
          description: 'Test category',
          iso55000Principle: 'VALUE' as const,
          strategicTheme: 'Test',
          weight: 0.5,
        },
        priority: 'MEDIUM' as const,
        status: 'ACTIVE' as const,
        type: {
          id: 'test',
          name: 'Test',
          description: 'Test type',
          category: 'OPERATIONAL' as const,
          measurement: 'QUANTITATIVE' as const,
          timeframe: 'MEDIUM_TERM' as const,
        },
        targets: [],
        metrics: [],
        timeline: {
          startDate: new Date(),
          targetDate: new Date(),
          milestones: [],
          dependencies: [],
          criticalPath: [],
          buffer: 30,
        },
        dependencies: [],
        risks: [],
        resources: [],
        owner: 'test-owner',
        stakeholders: [],
      };

      const objective = await objectives.createObjective(objectiveData);

      jest
        .spyOn(objectives as any, 'getObjective')
        .mockResolvedValue(objective);

      const report = await objectives.generatePerformanceReport(
        objective.objectiveId
      );

      expect(report).toBeDefined();
      expect(report.reportId).toBeDefined();
      expect(report.objectiveId).toBe(objective.objectiveId);
      expect(report.executiveSummary).toBeDefined();
      expect(report.detailedAnalysis).toBeDefined();
      expect(report.benchmarking).toBeInstanceOf(Array);
      expect(report.recommendations).toBeInstanceOf(Array);
      expect(report.nextActions).toBeInstanceOf(Array);
    });
  });

  describe('F23.4: Performance Evaluation System Integration', () => {
    it('should create performance evaluation', async () => {
      const title = 'Annual Performance Evaluation 2025';
      const description = 'Comprehensive annual performance evaluation';
      const evaluationPeriod = {
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      };
      const scope = {
        scopeId: 'annual-evaluation',
        name: 'Annual Evaluation',
        description: 'Annual performance evaluation scope',
        assets: ['asset-1', 'asset-2'],
        processes: ['maintenance', 'operation'],
        departments: ['facilities', 'operations'],
        timeframes: ['annual'],
        exclusions: [],
      };
      const createdBy = 'evaluation-manager';

      const evaluation =
        await performanceEvaluation.createPerformanceEvaluation(
          title,
          description,
          evaluationPeriod,
          scope,
          createdBy
        );

      expect(evaluation).toBeDefined();
      expect(evaluation.evaluationId).toBeDefined();
      expect(evaluation.organisationId).toBe(organisationId);
      expect(evaluation.title).toBe(title);
      expect(evaluation.description).toBe(description);
      expect(evaluation.evaluationPeriod).toEqual(evaluationPeriod);
      expect(evaluation.scope).toEqual(scope);
      expect(evaluation.status).toBe('PLANNED');
      expect(evaluation.createdBy).toBe(createdBy);
      expect(evaluation.results).toBeDefined();
      expect(evaluation.compliance).toBeDefined();
      expect(evaluation.audit).toBeDefined();
      expect(evaluation.recommendations).toBeInstanceOf(Array);
    });

    it('should execute performance evaluation', async () => {
      const evaluation =
        await performanceEvaluation.createPerformanceEvaluation(
          'Test Evaluation',
          'Test description',
          {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          },
          {
            scopeId: 'test-scope',
            name: 'Test Scope',
            description: 'Test scope description',
            assets: [],
            processes: [],
            departments: [],
            timeframes: [],
            exclusions: [],
          },
          'test-user'
        );

      jest
        .spyOn(performanceEvaluation as any, 'getPerformanceEvaluation')
        .mockResolvedValue(evaluation);
      jest
        .spyOn(performanceEvaluation as any, 'updatePerformanceEvaluation')
        .mockResolvedValue(undefined);

      await performanceEvaluation.executePerformanceEvaluation(
        evaluation.evaluationId
      );

      expect(evaluation.status).toBe('COMPLETED');
      expect(evaluation.completedAt).toBeDefined();
      expect(evaluation.results.overallScore).toBeGreaterThanOrEqual(0);
      expect(evaluation.results.dimensionScores).toBeInstanceOf(Array);
    });

    it('should generate performance dashboard', async () => {
      const evaluation =
        await performanceEvaluation.createPerformanceEvaluation(
          'Test Evaluation',
          'Test description',
          {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          },
          {
            scopeId: 'test-scope',
            name: 'Test Scope',
            description: 'Test scope description',
            assets: [],
            processes: [],
            departments: [],
            timeframes: [],
            exclusions: [],
          },
          'test-user'
        );

      jest
        .spyOn(performanceEvaluation as any, 'getRecentEvaluations')
        .mockResolvedValue([evaluation]);

      const dashboard =
        await performanceEvaluation.generatePerformanceDashboard();

      expect(dashboard).toBeDefined();
      expect(dashboard.dashboardId).toBeDefined();
      expect(dashboard.organisationId).toBe(organisationId);
      expect(dashboard.overallPerformance).toBeGreaterThanOrEqual(0);
      expect(dashboard.performanceTrend).toMatch(
        /^(IMPROVING|STABLE|DECLINING)$/
      );
      expect(dashboard.dimensionPerformance).toBeInstanceOf(Array);
      expect(dashboard.complianceStatus).toBeDefined();
      expect(dashboard.auditStatus).toBeDefined();
      expect(dashboard.topRecommendations).toBeInstanceOf(Array);
      expect(dashboard.criticalIssues).toBeInstanceOf(Array);
      expect(dashboard.performanceAlerts).toBeInstanceOf(Array);
    });

    it('should track compliance status', async () => {
      const evaluation =
        await performanceEvaluation.createPerformanceEvaluation(
          'Test Evaluation',
          'Test description',
          {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          },
          {
            scopeId: 'test-scope',
            name: 'Test Scope',
            description: 'Test scope description',
            assets: [],
            processes: [],
            departments: [],
            timeframes: [],
            exclusions: [],
          },
          'test-user'
        );

      jest
        .spyOn(performanceEvaluation as any, 'getRecentEvaluations')
        .mockResolvedValue([evaluation]);

      const complianceStatus =
        await performanceEvaluation.trackComplianceStatus();

      expect(complianceStatus).toBeDefined();
      expect(complianceStatus.overallCompliance).toBeGreaterThanOrEqual(0);
      expect(complianceStatus.overallCompliance).toBeLessThanOrEqual(100);
      expect(complianceStatus.standardCompliance).toBeInstanceOf(Array);
      expect(complianceStatus.nonCompliances).toBeInstanceOf(Array);
      expect(complianceStatus.correctiveActions).toBeInstanceOf(Array);
      expect(complianceStatus.upcomingAudits).toBeInstanceOf(Array);
      expect(complianceStatus.complianceTrend).toBeDefined();
    });

    it('should generate audit trail', async () => {
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const auditTrail = await performanceEvaluation.generateAuditTrail(
        startDate,
        endDate
      );

      expect(auditTrail).toBeDefined();
      expect(auditTrail.trailId).toBeDefined();
      expect(auditTrail.period.startDate).toEqual(startDate);
      expect(auditTrail.period.endDate).toEqual(endDate);
      expect(auditTrail.events).toBeInstanceOf(Array);
      expect(auditTrail.summary).toBeDefined();
      expect(auditTrail.compliance).toBeDefined();
    });

    it('should generate performance report', async () => {
      const evaluation =
        await performanceEvaluation.createPerformanceEvaluation(
          'Test Evaluation',
          'Test description',
          {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          },
          {
            scopeId: 'test-scope',
            name: 'Test Scope',
            description: 'Test scope description',
            assets: [],
            processes: [],
            departments: [],
            timeframes: [],
            exclusions: [],
          },
          'test-user'
        );

      jest
        .spyOn(performanceEvaluation as any, 'getPerformanceEvaluation')
        .mockResolvedValue(evaluation);

      const report = await performanceEvaluation.generatePerformanceReport(
        evaluation.evaluationId
      );

      expect(report).toBeDefined();
      expect(report.reportId).toBeDefined();
      expect(report.evaluationId).toBe(evaluation.evaluationId);
      expect(report.executiveSummary).toBeDefined();
      expect(report.detailedAnalysis).toBeDefined();
      expect(report.complianceReport).toBeDefined();
      expect(report.auditReport).toBeDefined();
      expect(report.recommendations).toBeInstanceOf(Array);
      expect(report.nextSteps).toBeInstanceOf(Array);
    });
  });

  describe('The Aegrid Rules Compliance (E23)', () => {
    it('should align with Rule 1: ISO 55000 value principle implementation', async () => {
      const policyDocument = await policyFramework.createPolicyDocument(
        'asset-management-policy',
        {
          organisationName: 'Test Organisation',
          assetManagerName: 'John Doe',
          reviewDate: new Date(),
          approvalAuthority: 'CEO',
        },
        'policy-creator'
      );

      // Verify that policies focus on value creation
      expect(policyDocument.content).toContain('value');
      expect(
        policyDocument.complianceStatus.overallCompliance
      ).toBeGreaterThanOrEqual(0);
      expect(policyDocument.alignmentScore).toBeGreaterThanOrEqual(0);
    });

    it('should align with Rule 2: ISO 55000 alignment principle with risk-based management', async () => {
      const strategicPlan = await strategicPlan.createStrategicPlan(
        'Strategic Plan',
        'Strategic description',
        5,
        'strategic-planner'
      );

      // Verify that strategic plans align with risk-based management
      expect(strategicPlan.alignmentScore).toBeGreaterThanOrEqual(0);
      expect(strategicPlan.objectives).toBeInstanceOf(Array);
      expect(strategicPlan.strategies).toBeInstanceOf(Array);
    });

    it('should align with Rule 3: ISO 55000 assurance principle with real-world response', async () => {
      const evaluation =
        await performanceEvaluation.createPerformanceEvaluation(
          'Performance Evaluation',
          'Performance description',
          {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          },
          {
            scopeId: 'test-scope',
            name: 'Test Scope',
            description: 'Test scope description',
            assets: [],
            processes: [],
            departments: [],
            timeframes: [],
            exclusions: [],
          },
          'evaluation-manager'
        );

      // Verify that performance evaluation provides real-world assurance
      expect(evaluation.audit).toBeDefined();
      expect(evaluation.compliance).toBeDefined();
      expect(evaluation.recommendations).toBeInstanceOf(Array);
    });

    it('should align with Rule 4: ISO 55000 leadership principle with margin management', async () => {
      const objective = await objectives.createObjective({
        title: 'Leadership Objective',
        description: 'Demonstrate leadership in asset management',
        category: {
          id: 'leadership',
          name: 'Leadership',
          description: 'Leadership objectives',
          iso55000Principle: 'LEADERSHIP',
          strategicTheme: 'Governance',
          weight: 0.3,
        },
        priority: 'HIGH',
        status: 'ACTIVE',
        type: {
          id: 'strategic',
          name: 'Strategic',
          description: 'Strategic objectives',
          category: 'STRATEGIC',
          measurement: 'QUALITATIVE',
          timeframe: 'LONG_TERM',
        },
        targets: [],
        metrics: [],
        timeline: {
          startDate: new Date(),
          targetDate: new Date(),
          milestones: [],
          dependencies: [],
          criticalPath: [],
          buffer: 30,
        },
        dependencies: [],
        risks: [],
        resources: [],
        owner: 'leadership-team',
        stakeholders: [],
      });

      // Verify that objectives support leadership and margin management
      expect(objective.category.iso55000Principle).toBe('LEADERSHIP');
      expect(objective.priority).toBe('HIGH');
      expect(objective.performance).toBeDefined();
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle non-existent evaluation ID gracefully', async () => {
      const invalidEvaluationId = 'invalid-evaluation-id';

      jest
        .spyOn(performanceEvaluation as any, 'getPerformanceEvaluation')
        .mockResolvedValue(null);

      await expect(
        performanceEvaluation.executePerformanceEvaluation(invalidEvaluationId)
      ).rejects.toThrow();
    });

    it('should complete performance evaluation within a reasonable time', async () => {
      const evaluation =
        await performanceEvaluation.createPerformanceEvaluation(
          'Performance Evaluation',
          'Performance description',
          {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
          },
          {
            scopeId: 'test-scope',
            name: 'Test Scope',
            description: 'Test scope description',
            assets: [],
            processes: [],
            departments: [],
            timeframes: [],
            exclusions: [],
          },
          'evaluation-manager'
        );

      jest
        .spyOn(performanceEvaluation as any, 'getPerformanceEvaluation')
        .mockResolvedValue(evaluation);
      jest
        .spyOn(performanceEvaluation as any, 'updatePerformanceEvaluation')
        .mockResolvedValue(undefined);

      const startTime = Date.now();
      await performanceEvaluation.executePerformanceEvaluation(
        evaluation.evaluationId
      );
      const endTime = Date.now();

      const executionTime = endTime - startTime;
      expect(executionTime).toBeLessThan(30000); // Should complete within 30 seconds
    });

    it('should return empty results for an organisation with no data', async () => {
      const emptyOrg = await prisma.organisation.create({
        data: {
          id: 'empty-org-iso55000',
          name: 'Empty Org',
          description: 'Org with no ISO 55000 data',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const emptyPolicyFramework = createISO55000PolicyFramework(emptyOrg.id);
      const _emptyStrategicPlan = createStrategicAssetManagementPlan(
        emptyOrg.id
      );
      const emptyObjectives = createAssetManagementObjectives(emptyOrg.id);
      const emptyPerformanceEvaluation = createPerformanceEvaluationSystem(
        emptyOrg.id
      );

      const policyProgress =
        await emptyPolicyFramework.trackImplementationProgress();
      const achievementTracking =
        await emptyObjectives.trackObjectiveAchievement();
      const complianceStatus =
        await emptyPerformanceEvaluation.trackComplianceStatus();

      expect(policyProgress.totalPolicies).toBe(0);
      expect(achievementTracking.totalObjectives).toBe(0);
      expect(complianceStatus.overallCompliance).toBe(0);

      // Cleanup
      await prisma.organisation.delete({ where: { id: emptyOrg.id } });
    });
  });
});
