/**
 * E11 Integration Test Suite
 * 
 * Comprehensive integration tests for Advanced Analytics & AI (E11)
 * 
 * @fileoverview E11 integration test suite
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { predictiveAnalyticsEngine } from '@/lib/analytics/predictive-engine';
import { aiPoweredAssetIntelligence } from '@/lib/analytics/ai-intelligence';
import { intelligentDecisionSupport } from '@/lib/analytics/decision-support';

describe('E11: Advanced Analytics & AI', () => {
  beforeAll(async () => {
    // Initialize test environment
    console.log('Initializing E11 test environment');
  });

  afterAll(async () => {
    // Cleanup test environment
    console.log('Cleaning up E11 test environment');
  });

  beforeEach(() => {
    // Reset state before each test
  });

  describe('E11.1: Predictive Analytics Engine', () => {
    it('should initialize predictive analytics engine', () => {
      expect(predictiveAnalyticsEngine).toBeDefined();
      expect(predictiveAnalyticsEngine.getAllModels()).toBeDefined();
    });

    it('should get models by type', () => {
      const failureModels = predictiveAnalyticsEngine.getModelsByType('failure_prediction');
      expect(failureModels).toBeDefined();
      expect(failureModels.length).toBeGreaterThan(0);
      
      const maintenanceModels = predictiveAnalyticsEngine.getModelsByType('maintenance_optimization');
      expect(maintenanceModels).toBeDefined();
      expect(maintenanceModels.length).toBeGreaterThan(0);
    });

    it('should get deployed models', () => {
      const deployedModels = predictiveAnalyticsEngine.getDeployedModels();
      expect(deployedModels).toBeDefined();
      expect(deployedModels.length).toBeGreaterThan(0);
      
      deployedModels.forEach(model => {
        expect(model.status).toBe('deployed');
      });
    });

    it('should create prediction for asset', async () => {
      const modelId = 'failure_prediction_v1';
      const assetId = 'asset_001';
      const features = {
        age: 5,
        maintenance_frequency: 4,
        operating_hours: 8760,
        environmental_stress: 0.3,
        last_maintenance_date: '2024-01-01',
        asset_type: 'pump',
      };

      const prediction = await predictiveAnalyticsEngine.createPrediction(modelId, assetId, features);
      
      expect(prediction).toBeDefined();
      expect(prediction.assetId).toBe(assetId);
      expect(prediction.modelId).toBe(modelId);
      expect(prediction.confidence).toBeGreaterThan(0);
      expect(prediction.confidence).toBeLessThanOrEqual(1);
      expect(prediction.prediction).toBeDefined();
      expect(prediction.explanation).toBeDefined();
    });

    it('should get predictions for asset', async () => {
      const assetId = 'asset_001';
      
      // Create multiple predictions
      await predictiveAnalyticsEngine.createPrediction('failure_prediction_v1', assetId, {
        age: 5,
        maintenance_frequency: 4,
        operating_hours: 8760,
        asset_type: 'pump',
      });
      
      await predictiveAnalyticsEngine.createPrediction('maintenance_optimization_v1', assetId, {
        risk_score: 0.7,
        maintenance_cost: 5000,
        downtime_cost: 10000,
        availability_requirement: 0.95,
      });

      const predictions = predictiveAnalyticsEngine.getPredictionsForAsset(assetId);
      expect(predictions).toBeDefined();
      expect(predictions.length).toBeGreaterThanOrEqual(2);
    });

    it('should get recent predictions', async () => {
      // Create some predictions
      await predictiveAnalyticsEngine.createPrediction('failure_prediction_v1', 'asset_001', {
        age: 5,
        maintenance_frequency: 4,
        operating_hours: 8760,
        asset_type: 'pump',
      });

      const recentPredictions = predictiveAnalyticsEngine.getRecentPredictions(10);
      expect(recentPredictions).toBeDefined();
      expect(recentPredictions.length).toBeGreaterThan(0);
    });

    it('should train model', async () => {
      const modelId = 'failure_prediction_v1';
      const trainingData = [
        { age: 5, maintenance_frequency: 4, failure: false },
        { age: 10, maintenance_frequency: 2, failure: true },
        { age: 3, maintenance_frequency: 6, failure: false },
      ];

      await predictiveAnalyticsEngine.trainModel(modelId, trainingData);
      
      const model = predictiveAnalyticsEngine.getModel(modelId);
      expect(model?.status).toBe('training');
    });

    it('should deploy model', async () => {
      const modelId = 'failure_prediction_v1';
      
      // First set model to ready status
      const model = predictiveAnalyticsEngine.getModel(modelId);
      if (model) {
        model.status = 'ready';
      }

      await predictiveAnalyticsEngine.deployModel(modelId);
      
      const deployedModel = predictiveAnalyticsEngine.getModel(modelId);
      expect(deployedModel?.status).toBe('deployed');
    });

    it('should evaluate model performance', async () => {
      const modelId = 'failure_prediction_v1';
      const testData = [
        { age: 5, maintenance_frequency: 4, failure: false },
        { age: 10, maintenance_frequency: 2, failure: true },
      ];

      const performance = await predictiveAnalyticsEngine.evaluateModel(modelId, testData);
      
      expect(performance).toBeDefined();
      expect(performance.accuracy).toBeGreaterThan(0);
      expect(performance.accuracy).toBeLessThanOrEqual(1);
      expect(performance.precision).toBeGreaterThan(0);
      expect(performance.recall).toBeGreaterThan(0);
      expect(performance.f1Score).toBeGreaterThan(0);
    });

    it('should get dashboard by ID', () => {
      const dashboard = predictiveAnalyticsEngine.getDashboard('predictive_analytics_main');
      
      expect(dashboard).toBeDefined();
      expect(dashboard?.id).toBe('predictive_analytics_main');
      expect(dashboard?.widgets).toBeDefined();
      expect(dashboard?.widgets.length).toBeGreaterThan(0);
    });

    it('should get all dashboards', () => {
      const dashboards = predictiveAnalyticsEngine.getAllDashboards();
      
      expect(dashboards).toBeDefined();
      expect(dashboards.length).toBeGreaterThan(0);
    });

    it('should get reports', () => {
      const reports = predictiveAnalyticsEngine.getAllReports();
      
      expect(reports).toBeDefined();
      expect(reports.length).toBeGreaterThan(0);
      
      const predictiveReport = reports.find(r => r.type === 'predictive');
      expect(predictiveReport).toBeDefined();
    });
  });

  describe('E11.2: AI-Powered Asset Intelligence', () => {
    it('should initialize AI intelligence system', () => {
      expect(aiPoweredAssetIntelligence).toBeDefined();
      expect(aiPoweredAssetIntelligence.getActiveIntelligence()).toBeDefined();
    });

    it('should get intelligence for asset', () => {
      const assetId = 'asset_001';
      const intelligence = aiPoweredAssetIntelligence.getIntelligenceForAsset(assetId);
      
      expect(intelligence).toBeDefined();
      expect(intelligence.length).toBeGreaterThan(0);
    });

    it('should get intelligence by type', () => {
      const anomalyIntelligence = aiPoweredAssetIntelligence.getIntelligenceByType('anomaly_detection');
      
      expect(anomalyIntelligence).toBeDefined();
      expect(anomalyIntelligence.length).toBeGreaterThan(0);
      
      anomalyIntelligence.forEach(intel => {
        expect(intel.intelligenceType).toBe('anomaly_detection');
      });
    });

    it('should get high severity intelligence', () => {
      const highSeverityIntelligence = aiPoweredAssetIntelligence.getHighSeverityIntelligence();
      
      expect(highSeverityIntelligence).toBeDefined();
      
      highSeverityIntelligence.forEach(intel => {
        expect(['high', 'critical']).toContain(intel.severity);
      });
    });

    it('should create intelligence', () => {
      const intelligence = {
        assetId: 'asset_002',
        intelligenceType: 'anomaly_detection' as const,
        confidence: 0.85,
        severity: 'high' as const,
        title: 'Test Anomaly',
        description: 'Test anomaly detection',
        insights: [
          {
            id: 'insight_001',
            type: 'anomaly' as const,
            title: 'Test Insight',
            description: 'Test insight description',
            value: 0.15,
            significance: 0.8,
            dataPoints: [
              { timestamp: new Date(), value: 0.15 },
            ],
          },
        ],
        recommendations: [
          {
            id: 'rec_001',
            type: 'maintenance' as const,
            priority: 'high' as const,
            title: 'Test Recommendation',
            description: 'Test recommendation',
            action: 'Test action',
            expectedOutcome: 'Test outcome',
            timeframe: '7 days',
            responsible: 'Test Team',
          },
        ],
        metadata: {
          modelVersion: 'v1.0.0',
          dataSource: ['test_data'],
          processingTime: 0.1,
          accuracy: 0.85,
          lastUpdated: new Date(),
          tags: ['test'],
          category: 'test',
        },
        status: 'active' as const,
      };

      const intelligenceId = aiPoweredAssetIntelligence.createIntelligence(intelligence);
      
      expect(intelligenceId).toBeDefined();
      expect(intelligenceId).toMatch(/^intel_/);
      
      const createdIntelligence = aiPoweredAssetIntelligence.getIntelligence(intelligenceId);
      expect(createdIntelligence).toBeDefined();
      expect(createdIntelligence?.title).toBe('Test Anomaly');
    });

    it('should acknowledge intelligence', () => {
      const intelligenceId = 'intel_001';
      const userId = 'user_001';
      
      aiPoweredAssetIntelligence.acknowledgeIntelligence(intelligenceId, userId);
      
      const intelligence = aiPoweredAssetIntelligence.getIntelligence(intelligenceId);
      expect(intelligence?.status).toBe('acknowledged');
    });

    it('should resolve intelligence', () => {
      const intelligenceId = 'intel_001';
      const resolution = 'Issue resolved';
      
      aiPoweredAssetIntelligence.resolveIntelligence(intelligenceId, resolution);
      
      const intelligence = aiPoweredAssetIntelligence.getIntelligence(intelligenceId);
      expect(intelligence?.status).toBe('resolved');
    });

    it('should get workflows', () => {
      const workflows = aiPoweredAssetIntelligence.getAllWorkflows();
      
      expect(workflows).toBeDefined();
      expect(workflows.length).toBeGreaterThan(0);
    });

    it('should get active workflows', () => {
      const activeWorkflows = aiPoweredAssetIntelligence.getActiveWorkflows();
      
      expect(activeWorkflows).toBeDefined();
      
      activeWorkflows.forEach(workflow => {
        expect(workflow.enabled).toBe(true);
        expect(workflow.status).toBe('active');
      });
    });

    it('should execute workflow', async () => {
      const workflowId = 'workflow_001';
      const context = { assetId: 'asset_001' };
      
      await aiPoweredAssetIntelligence.executeWorkflow(workflowId, context);
      
      const workflow = aiPoweredAssetIntelligence.getWorkflow(workflowId);
      expect(workflow?.lastRun).toBeDefined();
    });

    it('should generate insights for asset', async () => {
      const assetId = 'asset_001';
      const data = [
        { timestamp: new Date(), value: 0.1, efficiency: 0.8 },
        { timestamp: new Date(), value: 0.15, efficiency: 0.75 },
        { timestamp: new Date(), value: 0.2, efficiency: 0.7 },
      ];
      
      const insights = await aiPoweredAssetIntelligence.generateInsights(assetId, data);
      
      expect(insights).toBeDefined();
      expect(insights.length).toBeGreaterThan(0);
      
      insights.forEach(insight => {
        expect(insight.assetId).toBe(assetId);
        expect(insight.intelligenceType).toBeDefined();
        expect(insight.confidence).toBeGreaterThan(0);
      });
    });

    it('should get dashboards', () => {
      const dashboards = aiPoweredAssetIntelligence.getAllDashboards();
      
      expect(dashboards).toBeDefined();
      expect(dashboards.length).toBeGreaterThan(0);
    });

    it('should get configurations', () => {
      const configurations = aiPoweredAssetIntelligence.getAllConfigurations();
      
      expect(configurations).toBeDefined();
      expect(configurations.length).toBeGreaterThan(0);
    });

    it('should update configuration', () => {
      const configId = 'config_001';
      const updates = {
        configuration: {
          algorithm: 'updated_algorithm',
          parameters: { new_param: 'value' },
        },
      };
      const modifiedBy = 'test_user';
      
      aiPoweredAssetIntelligence.updateConfiguration(configId, updates, modifiedBy);
      
      const config = aiPoweredAssetIntelligence.getConfiguration(configId);
      expect(config?.configuration.algorithm).toBe('updated_algorithm');
      expect(config?.modifiedBy).toBe(modifiedBy);
    });
  });

  describe('E11.3: Intelligent Decision Support', () => {
    it('should initialize decision support system', () => {
      expect(intelligentDecisionSupport).toBeDefined();
      expect(intelligentDecisionSupport.getAllScenarios()).toBeDefined();
    });

    it('should get scenarios by status', () => {
      const pendingScenarios = intelligentDecisionSupport.getScenariosByStatus('pending');
      
      expect(pendingScenarios).toBeDefined();
      
      pendingScenarios.forEach(scenario => {
        expect(scenario.status).toBe('pending');
      });
    });

    it('should get scenarios by priority', () => {
      const highPriorityScenarios = intelligentDecisionSupport.getScenariosByPriority('high');
      
      expect(highPriorityScenarios).toBeDefined();
      
      highPriorityScenarios.forEach(scenario => {
        expect(scenario.priority).toBe('high');
      });
    });

    it('should create scenario', () => {
      const scenario = {
        name: 'Test Decision Scenario',
        description: 'Test scenario for decision support',
        type: 'maintenance' as const,
        priority: 'medium' as const,
        status: 'pending' as const,
        context: {
          assetId: 'asset_001',
          assetType: 'Test Asset',
          currentState: 'Test State',
          businessObjectives: ['Test Objective'],
          constraints: [],
          risks: [],
          opportunities: [],
          budget: {
            available: 100000,
            allocated: 0,
            remaining: 100000,
            currency: 'AUD',
            period: 'FY2024',
          },
          timeline: {
            start: new Date(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            duration: 30,
            critical: false,
            dependencies: [],
          },
        },
        options: [
          {
            id: 'option_001',
            name: 'Test Option',
            description: 'Test option description',
            type: 'action' as const,
            costs: {
              initial: 0,
              ongoing: 1000,
              total: 1000,
              breakdown: {
                labor: 500,
                materials: 300,
                equipment: 200,
                external: 0,
                contingency: 0,
              },
            },
            benefits: {
              financial: 0,
              operational: 500,
              strategic: 0,
              risk: 0,
              total: 500,
              breakdown: {
                costSavings: 0,
                revenueIncrease: 0,
                efficiencyGains: 500,
                riskReduction: 0,
                complianceValue: 0,
              },
            },
            risks: [],
            timeline: {
              start: new Date(),
              end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              duration: 30,
              critical: false,
              dependencies: [],
            },
            dependencies: [],
            requirements: [],
            probability: 0.8,
            impact: 'medium' as const,
          },
        ],
        analysis: {
          id: 'analysis_001',
          methodology: 'Test Methodology',
          dataSources: ['test_data'],
          assumptions: [],
          limitations: [],
          confidence: 0.8,
          uncertainty: {
            sources: [],
            impact: 0.2,
            mitigation: [],
          },
          sensitivity: {
            parameters: [],
            scenarios: [],
          },
          scenarios: [],
          results: [],
        },
        stakeholders: [],
        timeline: {
          phases: [],
          milestones: [],
          dependencies: [],
          criticalPath: [],
          estimatedDuration: 30,
          status: 'on_track' as const,
        },
      };

      const scenarioId = intelligentDecisionSupport.createScenario(scenario);
      
      expect(scenarioId).toBeDefined();
      expect(scenarioId).toMatch(/^scenario_/);
      
      const createdScenario = intelligentDecisionSupport.getScenario(scenarioId);
      expect(createdScenario).toBeDefined();
      expect(createdScenario?.name).toBe('Test Decision Scenario');
    });

    it('should analyze scenario and generate recommendation', async () => {
      const scenarioId = 'scenario_001';
      
      const recommendation = await intelligentDecisionSupport.analyzeScenario(scenarioId);
      
      expect(recommendation).toBeDefined();
      expect(recommendation.recommendedOption).toBeDefined();
      expect(recommendation.confidence).toBeGreaterThan(0);
      expect(recommendation.confidence).toBeLessThanOrEqual(1);
      expect(recommendation.reasoning).toBeDefined();
      expect(recommendation.reasoning.length).toBeGreaterThan(0);
      expect(recommendation.justification).toBeDefined();
      expect(recommendation.alternatives).toBeDefined();
      expect(recommendation.implementation).toBeDefined();
      expect(recommendation.monitoring).toBeDefined();
      expect(recommendation.successMetrics).toBeDefined();
    });

    it('should approve scenario', () => {
      const scenarioId = 'scenario_001';
      const approver = 'test_approver';
      const comments = 'Approved for implementation';
      
      intelligentDecisionSupport.approveScenario(scenarioId, approver, comments);
      
      const scenario = intelligentDecisionSupport.getScenario(scenarioId);
      expect(scenario?.status).toBe('approved');
    });

    it('should reject scenario', () => {
      const scenarioId = 'scenario_001';
      const rejector = 'test_rejector';
      const reason = 'Insufficient budget';
      
      intelligentDecisionSupport.rejectScenario(scenarioId, rejector, reason);
      
      const scenario = intelligentDecisionSupport.getScenario(scenarioId);
      expect(scenario?.status).toBe('rejected');
    });

    it('should get templates', () => {
      const templates = intelligentDecisionSupport.getAllTemplates();
      
      expect(templates).toBeDefined();
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should get rules', () => {
      const rules = intelligentDecisionSupport.getAllRules();
      
      expect(rules).toBeDefined();
      expect(rules.length).toBeGreaterThan(0);
      
      rules.forEach(rule => {
        expect(rule.enabled).toBeDefined();
        expect(rule.condition).toBeDefined();
        expect(rule.action).toBeDefined();
      });
    });
  });

  describe('Integration Tests', () => {
    it('should perform end-to-end analytics workflow', async () => {
      // Create a prediction
      const prediction = await predictiveAnalyticsEngine.createPrediction(
        'failure_prediction_v1',
        'asset_001',
        {
          age: 5,
          maintenance_frequency: 4,
          operating_hours: 8760,
          asset_type: 'pump',
        }
      );
      
      expect(prediction).toBeDefined();
      expect(prediction.assetId).toBe('asset_001');

      // Generate AI insights
      const insights = await aiPoweredAssetIntelligence.generateInsights('asset_001', [
        { timestamp: new Date(), value: 0.1, efficiency: 0.8 },
        { timestamp: new Date(), value: 0.15, efficiency: 0.75 },
      ]);
      
      expect(insights).toBeDefined();
      expect(insights.length).toBeGreaterThan(0);

      // Create decision scenario
      const scenarioId = intelligentDecisionSupport.createScenario({
        name: 'Integration Test Scenario',
        description: 'Test scenario for integration',
        type: 'maintenance',
        priority: 'medium',
        status: 'pending',
        context: {
          assetId: 'asset_001',
          assetType: 'Test Asset',
          currentState: 'Test State',
          businessObjectives: ['Test Objective'],
          constraints: [],
          risks: [],
          opportunities: [],
          budget: {
            available: 100000,
            allocated: 0,
            remaining: 100000,
            currency: 'AUD',
            period: 'FY2024',
          },
          timeline: {
            start: new Date(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            duration: 30,
            critical: false,
            dependencies: [],
          },
        },
        options: [],
        analysis: {
          id: 'analysis_001',
          methodology: 'Test Methodology',
          dataSources: ['test_data'],
          assumptions: [],
          limitations: [],
          confidence: 0.8,
          uncertainty: {
            sources: [],
            impact: 0.2,
            mitigation: [],
          },
          sensitivity: {
            parameters: [],
            scenarios: [],
          },
          scenarios: [],
          results: [],
        },
        stakeholders: [],
        timeline: {
          phases: [],
          milestones: [],
          dependencies: [],
          criticalPath: [],
          estimatedDuration: 30,
          status: 'on_track',
        },
      });
      
      expect(scenarioId).toBeDefined();

      // Analyze scenario
      const recommendation = await intelligentDecisionSupport.analyzeScenario(scenarioId);
      
      expect(recommendation).toBeDefined();
      expect(recommendation.recommendedOption).toBeDefined();
    });

    it('should handle error scenarios gracefully', () => {
      // Test invalid model ID
      expect(() => {
        predictiveAnalyticsEngine.getModel('invalid_model_id');
      }).not.toThrow();

      // Test invalid intelligence ID
      expect(() => {
        aiPoweredAssetIntelligence.getIntelligence('invalid_intelligence_id');
      }).not.toThrow();

      // Test invalid scenario ID
      expect(() => {
        intelligentDecisionSupport.getScenario('invalid_scenario_id');
      }).not.toThrow();

      // Test invalid workflow ID
      expect(() => {
        aiPoweredAssetIntelligence.getWorkflow('invalid_workflow_id');
      }).not.toThrow();
    });

    it('should maintain data consistency across systems', async () => {
      const assetId = 'asset_001';
      
      // Create prediction
      const prediction = await predictiveAnalyticsEngine.createPrediction(
        'failure_prediction_v1',
        assetId,
        { age: 5, maintenance_frequency: 4, operating_hours: 8760, asset_type: 'pump' }
      );
      
      // Generate insights for same asset
      const insights = await aiPoweredAssetIntelligence.generateInsights(assetId, [
        { timestamp: new Date(), value: 0.1, efficiency: 0.8 },
      ]);
      
      // Verify consistency
      expect(prediction.assetId).toBe(assetId);
      expect(insights.every(insight => insight.assetId === assetId)).toBe(true);
      
      // Get predictions for asset
      const assetPredictions = predictiveAnalyticsEngine.getPredictionsForAsset(assetId);
      expect(assetPredictions.length).toBeGreaterThan(0);
      
      // Get intelligence for asset
      const assetIntelligence = aiPoweredAssetIntelligence.getIntelligenceForAsset(assetId);
      expect(assetIntelligence.length).toBeGreaterThan(0);
    });
  });
});
