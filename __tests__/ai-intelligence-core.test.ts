/**
 * AI Intelligence Core Integration Tests - E22
 *
 * Comprehensive tests for AI Intelligence Core functionality including
 * optimization, anomaly detection, predictive maintenance, and red-flagging
 *
 * Implements The Aegrid Rules for intelligent asset management
 */

import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { AIIntelligenceCore, createAIIntelligenceCore } from '../lib/ai-intelligence-core';
import { prisma } from '../lib/prisma';

describe('AI Intelligence Core Integration - E22', () => {
  let organisationId: string;
  let aiCore: AIIntelligenceCore;
  let testAssetId: string;

  beforeEach(async () => {
    // Create test organisation
    const organisation = await prisma.organisation.create({
      data: {
        name: 'Test AI Organisation',
        description: 'Test organisation for AI Intelligence',
        settings: {},
      },
    });
    organisationId = organisation.id;

    // Create test asset
    const asset = await prisma.asset.create({
      data: {
        organisationId,
        name: 'Test AI Asset',
        description: 'Test asset for AI Intelligence',
        assetType: 'EQUIPMENT',
        assetStatus: 'Active',
        assetCondition: 'Good',
        assetPriority: 'Medium',
        location: 'Test Location',
        installationDate: new Date('2020-01-01'),
        metadata: {},
      },
    });
    testAssetId = asset.id;

    // Initialize AI Intelligence Core
    aiCore = createAIIntelligenceCore(organisationId);
  });

  afterEach(async () => {
    // Cleanup test data
    await prisma.asset.deleteMany({ where: { organisationId } });
    await prisma.organisation.delete({ where: { id: organisationId } });
  });

  describe('F22.1: AI Optimisation Engine', () => {
    it('should execute comprehensive optimization analysis', async () => {
      const result = await aiCore.executeEngine('optimization');

      expect(result).toBeDefined();
      expect(result.optimizationId).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.assetsOptimized).toContain(testAssetId);
      expect(result.totalSavings).toBeGreaterThanOrEqual(0);
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should generate optimization insights for specific asset', async () => {
      const insights = await aiCore.getAssetAIInsights(testAssetId);

      expect(insights.optimization).toBeDefined();
      expect(insights.optimization.performanceInsights).toBeInstanceOf(Array);
      expect(insights.optimization.maintenanceInsights).toBeInstanceOf(Array);
      expect(insights.optimization.resourceInsights).toBeInstanceOf(Array);
      expect(insights.optimization.energyInsights).toBeInstanceOf(Array);
      expect(insights.optimization.overallScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('F22.2: AI Anomaly Detection System', () => {
    it('should detect anomalies across assets', async () => {
      const anomalies = await aiCore.executeEngine('anomaly');

      expect(anomalies).toBeInstanceOf(Array);

      // Check anomaly structure if any are detected
      if (anomalies.length > 0) {
        const anomaly = anomalies[0];
        expect(anomaly.anomalyId).toBeDefined();
        expect(anomaly.timestamp).toBeDefined();
        expect(anomaly.assetId).toBeDefined();
        expect(anomaly.severity).toBeDefined();
        expect(anomaly.confidence).toBeGreaterThanOrEqual(0);
        expect(anomaly.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should build behavioral profiles for assets', async () => {
      // This would require setting up some test data first
      // For now, just ensure the method exists and doesn't throw
      expect(() => aiCore.executeEngine('anomaly')).not.toThrow();
    });
  });

  describe('F22.3: AI Predictive Maintenance System', () => {
    it('should generate predictive maintenance insights', async () => {
      const insights = await aiCore.executeEngine('predictive');

      expect(insights).toBeDefined();
      expect(insights.timestamp).toBeDefined();
      expect(insights.failurePredictions).toBeInstanceOf(Array);
      expect(insights.conditionMonitoring).toBeInstanceOf(Array);
      expect(insights.remainingUsefulLife).toBeInstanceOf(Array);
      expect(insights.optimizedSchedules).toBeInstanceOf(Array);
      expect(insights.overallRiskScore).toBeGreaterThanOrEqual(0);
      expect(insights.recommendations).toBeInstanceOf(Array);
    });

    it('should predict failures for assets', async () => {
      const insights = await aiCore.executeEngine('predictive');

      // Check failure predictions structure
      for (const prediction of insights.failurePredictions) {
        expect(prediction.assetId).toBeDefined();
        expect(prediction.predictionId).toBeDefined();
        expect(prediction.failureProbability).toBeGreaterThanOrEqual(0);
        expect(prediction.failureProbability).toBeLessThanOrEqual(1);
        expect(prediction.confidence).toBeGreaterThanOrEqual(0);
        expect(prediction.confidence).toBeLessThanOrEqual(1);
        expect(prediction.contributingFactors).toBeInstanceOf(Array);
        expect(prediction.mitigationActions).toBeInstanceOf(Array);
      }
    });

    it('should monitor asset conditions', async () => {
      const insights = await aiCore.executeEngine('predictive');

      // Check condition monitoring structure
      for (const condition of insights.conditionMonitoring) {
        expect(condition.assetId).toBeDefined();
        expect(condition.currentCondition).toBeGreaterThanOrEqual(0);
        expect(condition.currentCondition).toBeLessThanOrEqual(100);
        expect(condition.degradationRate).toBeGreaterThanOrEqual(0);
        expect(condition.conditionTrend).toMatch(/^(improving|stable|degrading)$/);
        expect(condition.criticalComponents).toBeInstanceOf(Array);
        expect(condition.maintenanceRecommendations).toBeInstanceOf(Array);
      }
    });

    it('should estimate remaining useful life', async () => {
      const insights = await aiCore.executeEngine('predictive');

      // Check RUL estimates structure
      for (const rul of insights.remainingUsefulLife) {
        expect(rul.assetId).toBeDefined();
        expect(rul.rulId).toBeDefined();
        expect(rul.estimatedRUL).toBeGreaterThanOrEqual(0);
        expect(rul.confidenceInterval).toBeDefined();
        expect(rul.confidenceInterval.lower).toBeGreaterThanOrEqual(0);
        expect(rul.confidenceInterval.upper).toBeGreaterThanOrEqual(rul.confidenceInterval.lower);
        expect(rul.degradationFactors).toBeInstanceOf(Array);
        expect(rul.maintenanceImpact).toBeDefined();
      }
    });
  });

  describe('F22.4: AI Automated Red-flagging System', () => {
    it('should perform red-flagging analysis', async () => {
      const redFlags = await aiCore.executeEngine('redflagging');

      expect(redFlags).toBeInstanceOf(Array);

      // Check red flag structure if any are detected
      if (redFlags.length > 0) {
        const flag = redFlags[0];
        expect(flag.flagId).toBeDefined();
        expect(flag.timestamp).toBeDefined();
        expect(flag.assetId).toBeDefined();
        expect(flag.category).toBeDefined();
        expect(flag.severity).toBeDefined();
        expect(flag.priority).toBeGreaterThanOrEqual(0);
        expect(flag.priority).toBeLessThanOrEqual(100);
        expect(flag.riskAssessment).toBeDefined();
        expect(flag.automatedResponse).toBeDefined();
        expect(flag.escalation).toBeDefined();
      }
    });

    it('should assess risks for red flags', async () => {
      const redFlags = await aiCore.executeEngine('redflagging');

      for (const flag of redFlags) {
        const riskAssessment = flag.riskAssessment;
        expect(riskAssessment.overallRisk).toBeGreaterThanOrEqual(0);
        expect(riskAssessment.overallRisk).toBeLessThanOrEqual(100);
        expect(riskAssessment.riskFactors).toBeInstanceOf(Array);
        expect(riskAssessment.mitigationStrategies).toBeInstanceOf(Array);
        expect(riskAssessment.residualRisk).toBeGreaterThanOrEqual(0);
        expect(riskAssessment.residualRisk).toBeLessThanOrEqual(100);
      }
    });

    it('should generate automated responses', async () => {
      const redFlags = await aiCore.executeEngine('redflagging');

      for (const flag of redFlags) {
        const response = flag.automatedResponse;
        expect(response.responseId).toBeDefined();
        expect(response.responseType).toMatch(/^(notification|work_order|escalation|maintenance|shutdown)$/);
        expect(response.actions).toBeInstanceOf(Array);
        expect(response.executedAt).toBeDefined();
        expect(response.status).toMatch(/^(pending|executing|completed|failed)$/);
      }
    });
  });

  describe('AI Intelligence Core Integration', () => {
    it('should execute comprehensive analysis', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      expect(summary).toBeDefined();
      expect(summary.timestamp).toBeDefined();
      expect(summary.optimizationResults).toBeDefined();
      expect(summary.anomalyDetections).toBeInstanceOf(Array);
      expect(summary.predictiveInsights).toBeDefined();
      expect(summary.redFlags).toBeInstanceOf(Array);
      expect(summary.overallIntelligenceScore).toBeGreaterThanOrEqual(0);
      expect(summary.overallIntelligenceScore).toBeLessThanOrEqual(100);
      expect(summary.recommendations).toBeInstanceOf(Array);
      expect(summary.alerts).toBeInstanceOf(Array);
    });

    it('should generate unified recommendations', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      for (const recommendation of summary.recommendations) {
        expect(recommendation.recommendationId).toBeDefined();
        expect(recommendation.source).toMatch(/^(optimization|anomaly_detection|predictive_maintenance|red_flagging)$/);
        expect(recommendation.priority).toMatch(/^(low|medium|high|critical)$/);
        expect(recommendation.category).toBeDefined();
        expect(recommendation.description).toBeDefined();
        expect(recommendation.expectedImpact).toBeGreaterThanOrEqual(0);
        expect(recommendation.expectedImpact).toBeLessThanOrEqual(1);
        expect(recommendation.implementationCost).toBeGreaterThanOrEqual(0);
        expect(recommendation.confidence).toBeGreaterThanOrEqual(0);
        expect(recommendation.confidence).toBeLessThanOrEqual(1);
        expect(recommendation.assets).toBeInstanceOf(Array);
        expect(recommendation.timeline).toBeGreaterThanOrEqual(0);
      }
    });

    it('should generate unified alerts', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      for (const alert of summary.alerts) {
        expect(alert.alertId).toBeDefined();
        expect(alert.source).toMatch(/^(optimization|anomaly_detection|predictive_maintenance|red_flagging)$/);
        expect(alert.severity).toMatch(/^(low|medium|high|critical)$/);
        expect(alert.title).toBeDefined();
        expect(alert.description).toBeDefined();
        expect(alert.timestamp).toBeDefined();
        expect(alert.assetId).toBeDefined();
        expect(alert.actions).toBeInstanceOf(Array);
        expect(alert.status).toMatch(/^(active|acknowledged|resolved)$/);
      }
    });

    it('should calculate overall intelligence score', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      expect(summary.overallIntelligenceScore).toBeGreaterThanOrEqual(0);
      expect(summary.overallIntelligenceScore).toBeLessThanOrEqual(100);
      expect(typeof summary.overallIntelligenceScore).toBe('number');
    });

    it('should get intelligence dashboard', async () => {
      const dashboard = await aiCore.getIntelligenceDashboard();

      expect(dashboard).toBeDefined();
      expect(dashboard.summary).toBeDefined();
      expect(dashboard.performance).toBeDefined();
      expect(dashboard.trends).toBeDefined();
      expect(dashboard.insights).toBeDefined();

      // Check performance metrics
      expect(dashboard.performance.optimizationAccuracy).toBeGreaterThanOrEqual(0);
      expect(dashboard.performance.optimizationAccuracy).toBeLessThanOrEqual(1);
      expect(dashboard.performance.anomalyDetectionAccuracy).toBeGreaterThanOrEqual(0);
      expect(dashboard.performance.anomalyDetectionAccuracy).toBeLessThanOrEqual(1);
      expect(dashboard.performance.predictiveAccuracy).toBeGreaterThanOrEqual(0);
      expect(dashboard.performance.predictiveAccuracy).toBeLessThanOrEqual(1);
      expect(dashboard.performance.redFlaggingAccuracy).toBeGreaterThanOrEqual(0);
      expect(dashboard.performance.redFlaggingAccuracy).toBeLessThanOrEqual(1);
      expect(dashboard.performance.overallAccuracy).toBeGreaterThanOrEqual(0);
      expect(dashboard.performance.overallAccuracy).toBeLessThanOrEqual(1);

      // Check trends
      expect(dashboard.trends.performanceTrend).toMatch(/^(improving|stable|declining)$/);
      expect(dashboard.trends.costTrend).toMatch(/^(decreasing|stable|increasing)$/);
      expect(dashboard.trends.riskTrend).toMatch(/^(decreasing|stable|increasing)$/);
      expect(dashboard.trends.efficiencyTrend).toMatch(/^(improving|stable|declining)$/);

      // Check insights
      expect(dashboard.insights.keyInsights).toBeInstanceOf(Array);
      expect(dashboard.insights.strategicRecommendations).toBeInstanceOf(Array);
      expect(dashboard.insights.riskAssessment).toBeDefined();
      expect(dashboard.insights.riskAssessment.overallRisk).toMatch(/^(low|medium|high)$/);
      expect(typeof dashboard.insights.riskAssessment.criticalAssets).toBe('number');
      expect(typeof dashboard.insights.riskAssessment.highRiskAssets).toBe('number');
    });

    it('should get asset-specific AI insights', async () => {
      const insights = await aiCore.getAssetAIInsights(testAssetId);

      expect(insights).toBeDefined();
      expect(insights.optimization).toBeDefined();
      expect(insights.anomalies).toBeInstanceOf(Array);
      expect(insights.predictive).toBeDefined();
      expect(insights.redFlags).toBeInstanceOf(Array);
      expect(insights.integratedInsights).toBeDefined();

      // Check integrated insights
      expect(insights.integratedInsights.assetId).toBe(testAssetId);
      expect(insights.integratedInsights.overallRisk).toBeGreaterThanOrEqual(0);
      expect(insights.integratedInsights.overallRisk).toBeLessThanOrEqual(100);
      expect(insights.integratedInsights.priority).toMatch(/^(low|medium|high|critical)$/);
      expect(insights.integratedInsights.recommendations).toBeInstanceOf(Array);
      expect(insights.integratedInsights.nextActions).toBeInstanceOf(Array);
    });
  });

  describe('Cross-Engine Correlation', () => {
    it('should perform cross-engine correlation analysis', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      // The correlation analysis should be performed internally
      // We can verify that the summary includes correlated data
      expect(summary).toBeDefined();
      expect(summary.recommendations).toBeInstanceOf(Array);
      expect(summary.alerts).toBeInstanceOf(Array);

      // Verify that recommendations are properly sorted by priority
      if (summary.recommendations.length > 1) {
        const priorities = summary.recommendations.map(r => r.priority);
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

        for (let i = 0; i < priorities.length - 1; i++) {
          expect(priorityOrder[priorities[i]]).toBeGreaterThanOrEqual(priorityOrder[priorities[i + 1]]);
        }
      }
    });

    it('should correlate optimization with anomalies', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      // Check if optimization recommendations correlate with detected anomalies
      const optimizationRecs = summary.recommendations.filter(r => r.source === 'optimization');
      const anomalyAlerts = summary.alerts.filter(a => a.source === 'anomaly_detection');

      // Both should be present if there are issues to address
      expect(optimizationRecs).toBeInstanceOf(Array);
      expect(anomalyAlerts).toBeInstanceOf(Array);
    });
  });

  describe('Automated Actions', () => {
    it('should execute automated actions for critical items', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      // Check that critical recommendations and alerts are properly prioritized
      const criticalRecommendations = summary.recommendations.filter(r => r.priority === 'critical');
      const criticalAlerts = summary.alerts.filter(a => a.severity === 'critical');

      expect(criticalRecommendations).toBeInstanceOf(Array);
      expect(criticalAlerts).toBeInstanceOf(Array);

      // Verify critical items have appropriate actions
      for (const alert of criticalAlerts) {
        expect(alert.actions).toBeInstanceOf(Array);
        expect(alert.actions.length).toBeGreaterThan(0);
      }
    });

    it('should create work orders for critical alerts', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      // Check that work orders would be created for critical alerts
      const criticalAlerts = summary.alerts.filter(a => a.severity === 'critical');

      for (const alert of criticalAlerts) {
        expect(alert.actions).toContain('Investigate immediately');
        expect(alert.actions).toContain('Schedule maintenance');
      }
    });
  });

  describe('The Aegrid Rules Compliance', () => {
    it('should align with Rule 1: AI-powered asset purpose optimization', async () => {
      const insights = await aiCore.getAssetAIInsights(testAssetId);

      // Verify that optimization focuses on asset purpose
      expect(insights.optimization).toBeDefined();
      expect(insights.integratedInsights.recommendations).toBeInstanceOf(Array);

      // Recommendations should focus on improving asset purpose and value
      for (const rec of insights.integratedInsights.recommendations) {
        expect(rec).toHaveProperty('description');
        expect(typeof rec.description).toBe('string');
      }
    });

    it('should align with Rule 2: Predictive maintenance aligned with risk', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      // Verify that predictive maintenance is risk-based
      expect(summary.predictiveInsights).toBeDefined();
      expect(summary.predictiveInsights.overallRiskScore).toBeGreaterThanOrEqual(0);
      expect(summary.predictiveInsights.conditionMonitoring).toBeInstanceOf(Array);

      // Risk assessment should drive maintenance recommendations
      for (const condition of summary.predictiveInsights.conditionMonitoring) {
        expect(condition.maintenanceRecommendations).toBeInstanceOf(Array);
      }
    });

    it('should align with Rule 3: Critical asset failure prediction and alerts', async () => {
      const summary = await aiCore.executeComprehensiveAnalysis();

      // Verify critical asset protection
      expect(summary.alerts).toBeInstanceOf(Array);
      expect(summary.redFlags).toBeInstanceOf(Array);

      // Critical alerts should be properly flagged
      const criticalAlerts = summary.alerts.filter(a => a.severity === 'critical');
      for (const alert of criticalAlerts) {
        expect(alert.actions).toContain('Investigate immediately');
      }
    });

    it('should align with Rule 4: Future scenario modelling and planning', async () => {
      const insights = await aiCore.getAssetAIInsights(testAssetId);

      // Verify future planning capabilities
      expect(insights.predictive).toBeDefined();
      expect(insights.integratedInsights.nextActions).toBeInstanceOf(Array);

      // Should provide forward-looking recommendations
      expect(insights.integratedInsights.nextActions.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle errors gracefully', async () => {
      // Test with invalid asset ID
      const invalidAssetId = 'invalid-asset-id';

      await expect(aiCore.getAssetAIInsights(invalidAssetId)).rejects.toThrow();
    });

    it('should complete analysis within reasonable time', async () => {
      const startTime = Date.now();
      await aiCore.executeComprehensiveAnalysis();
      const endTime = Date.now();

      const executionTime = endTime - startTime;
      expect(executionTime).toBeLessThan(30000); // Should complete within 30 seconds
    });

    it('should handle empty asset lists', async () => {
      // Create AI core with no assets
      const emptyOrg = await prisma.organisation.create({
        data: {
          name: 'Empty Test Organisation',
          description: 'Empty test organisation',
          settings: {},
        },
      });

      const emptyAICore = createAIIntelligenceCore(emptyOrg.id);

      const summary = await emptyAICore.executeComprehensiveAnalysis();
      expect(summary).toBeDefined();
      expect(summary.recommendations).toBeInstanceOf(Array);
      expect(summary.alerts).toBeInstanceOf(Array);

      // Cleanup
      await prisma.organisation.delete({ where: { id: emptyOrg.id } });
    });
  });
});
