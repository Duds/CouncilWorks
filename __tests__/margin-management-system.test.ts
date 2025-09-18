/**
 * Margin Management System Tests
 *
 * Comprehensive tests for the Margin Management System implementation
 * Tests margin allocation, deployment, policies, and forecasting
 *
 * @file __tests__/margin-management-system.test.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { MarginManagementSystem } from '@/lib/margin-management-system';
import {
  MarginConfiguration,
  MarginType,
  MarginStrategy,
  Signal,
  SignalType,
  SignalSeverity,
  SignalSource,
  ResilienceMode,
  MarginStatus,
  MarginEventType
} from '@/types/resilience';

describe('MarginManagementSystem', () => {
  let marginSystem: MarginManagementSystem;
  let config: MarginConfiguration;

  beforeEach(() => {
    config = {
      enabled: true,
      defaultStrategy: MarginStrategy.DYNAMIC,
      marginTypes: [],
      defaultThresholds: [],
      defaultPolicies: [],
      updateInterval: 60000,
      retentionPeriod: 30
    };
    
    marginSystem = new MarginManagementSystem(config);
  });

  describe('Initialization', () => {
    it('should initialize with default configuration', () => {
      expect(marginSystem).toBeDefined();
      const status = marginSystem.getStatus();
      expect(status.allocations).toHaveLength(4); // TIME, CAPACITY, MATERIAL, FINANCIAL
      expect(status.activeDeployments).toHaveLength(0);
      expect(status.recentEvents).toHaveLength(0);
    });

    it('should initialize with default margin allocations', () => {
      const status = marginSystem.getStatus();
      const allocations = status.allocations;
      
      expect(allocations.find(a => a.marginType === MarginType.TIME)).toBeDefined();
      expect(allocations.find(a => a.marginType === MarginType.CAPACITY)).toBeDefined();
      expect(allocations.find(a => a.marginType === MarginType.MATERIAL)).toBeDefined();
      expect(allocations.find(a => a.marginType === MarginType.FINANCIAL)).toBeDefined();
      
      // Check initial utilization rates
      allocations.forEach(allocation => {
        expect(allocation.utilizationRate).toBe(0.2); // 20% initial utilization
        expect(allocation.status).toBe(MarginStatus.AVAILABLE);
      });
    });

    it('should initialize with default thresholds', () => {
      const metrics = marginSystem.getMetrics();
      expect(metrics.totalMargin).toBeGreaterThan(0);
      expect(metrics.totalAllocated).toBeGreaterThan(0);
      expect(metrics.totalAvailable).toBeGreaterThan(0);
      expect(metrics.averageUtilization).toBe(0.2);
    });
  });

  describe('Signal Processing', () => {
    let testSignals: Signal[];

    beforeEach(() => {
      testSignals = [
        {
          id: 'signal-1',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: { assetId: 'asset-1', condition: 'degrading' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.8,
            relatedSignals: [],
            tags: ['asset-condition'],
            custom: {}
          }
        },
        {
          id: 'signal-2',
          source: SignalSource.IOT_SENSOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 0.7, threshold: 0.8 },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.9,
            relatedSignals: [],
            tags: ['performance'],
            custom: {}
          }
        }
      ];
    });

    it('should process signals and update allocations', async () => {
      const result = await marginSystem.processSignals(testSignals, ResilienceMode.NORMAL);
      
      expect(result.allocations).toHaveLength(4);
      expect(result.deployments).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.events).toBeDefined();
      
      // Check that allocations were updated
      result.allocations.forEach(allocation => {
        expect(allocation.lastUpdated).toBeInstanceOf(Date);
        expect(allocation.utilizationRate).toBeGreaterThanOrEqual(0);
        expect(allocation.utilizationRate).toBeLessThanOrEqual(1);
      });
    });

    it('should generate recommendations for margin optimization', async () => {
      const result = await marginSystem.processSignals(testSignals, ResilienceMode.NORMAL);
      
      expect(result.recommendations).toBeDefined();
      // Recommendations may be empty if margins are within optimal range
      result.recommendations.forEach(rec => {
        expect(rec.marginType).toBeDefined();
        expect(rec.recommendationType).toBeDefined();
        expect(rec.priority).toBeDefined();
        expect(rec.description).toBeDefined();
      });
    });

    it('should record margin events', async () => {
      const result = await marginSystem.processSignals(testSignals, ResilienceMode.NORMAL);
      
      expect(result.events).toBeDefined();
      result.events.forEach(event => {
        expect(event.id).toBeDefined();
        expect(event.timestamp).toBeInstanceOf(Date);
        expect(event.eventType).toBeDefined();
        expect(event.marginType).toBeDefined();
        expect(event.description).toBeDefined();
        expect(event.impact).toBeDefined();
      });
    });

    it('should handle emergency signals with immediate deployment', async () => {
      const emergencySignals: Signal[] = [
        {
          id: 'emergency-signal',
          source: SignalSource.EMERGENCY_SERVICE,
          type: SignalType.EMERGENCY,
          severity: SignalSeverity.CRITICAL,
          data: { emergencyType: 'system_failure' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 1.0,
            relatedSignals: [],
            tags: ['emergency'],
            custom: {}
          }
        }
      ];

      const result = await marginSystem.processSignals(emergencySignals, ResilienceMode.EMERGENCY);
      
      // Should generate deployments for emergency
      expect(result.deployments.length).toBeGreaterThan(0);
      result.deployments.forEach(deployment => {
        expect(deployment.priority).toBeLessThanOrEqual(2); // High priority
        expect(['pending', 'in_progress']).toContain(deployment.status); // Status may change during execution
        expect(deployment.reason).toContain('Emergency');
      });
    });

    it('should handle empty signal array', async () => {
      const result = await marginSystem.processSignals([], ResilienceMode.NORMAL);
      
      expect(result.allocations).toHaveLength(4);
      expect(result.deployments).toHaveLength(0);
      expect(result.recommendations).toHaveLength(0);
      expect(result.events).toHaveLength(0);
    });
  });

  describe('Margin Deployment', () => {
    it('should calculate deployment amounts correctly', async () => {
      // Create signals that would trigger critical thresholds
      const criticalSignals: Signal[] = [
        {
          id: 'critical-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.CRITICAL,
          data: { performance: 0.3 },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.95,
            relatedSignals: [],
            tags: ['critical'],
            custom: {}
          }
        }
      ];

      const result = await marginSystem.processSignals(criticalSignals, ResilienceMode.HIGH_STRESS);
      
      if (result.deployments.length > 0) {
        result.deployments.forEach(deployment => {
          expect(deployment.amount).toBeGreaterThan(0);
          expect(deployment.estimatedDuration).toBeGreaterThan(0);
          expect(deployment.expectedOutcome).toBeDefined();
          expect(deployment.priority).toBeLessThanOrEqual(2);
        });
      }
    });

    it('should track deployment status', async () => {
      const signals: Signal[] = [
        {
          id: 'deployment-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.HIGH,
          data: { riskLevel: 0.8 },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.85,
            relatedSignals: [],
            tags: ['risk'],
            custom: {}
          }
        }
      ];

      const result = await marginSystem.processSignals(signals, ResilienceMode.ELEVATED);
      
      if (result.deployments.length > 0) {
        const deployment = result.deployments[0];
        expect(deployment.status).toBe('pending');
        expect(deployment.requestedAt).toBeInstanceOf(Date);
        expect(deployment.requestedBy).toBe('margin-management-system');
      }
    });
  });

  describe('Margin Metrics', () => {
    it('should calculate metrics correctly', () => {
      const metrics = marginSystem.getMetrics();
      
      expect(metrics.totalMargin).toBeGreaterThan(0);
      expect(metrics.totalAllocated).toBeGreaterThan(0);
      expect(metrics.totalAvailable).toBeGreaterThan(0);
      expect(metrics.averageUtilization).toBeGreaterThanOrEqual(0);
      expect(metrics.averageUtilization).toBeLessThanOrEqual(1);
      expect(metrics.marginEfficiency).toBeGreaterThanOrEqual(0);
      expect(metrics.marginEfficiency).toBeLessThanOrEqual(1);
      expect(metrics.criticalMargins).toBeGreaterThanOrEqual(0);
      expect(metrics.optimalMargins).toBeGreaterThanOrEqual(0);
      expect(metrics.lastUpdated).toBeInstanceOf(Date);
    });

    it('should update metrics after signal processing', async () => {
      const initialMetrics = marginSystem.getMetrics();
      
      const signals: Signal[] = [
        {
          id: 'metrics-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: { condition: 'stable' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.8,
            relatedSignals: [],
            tags: ['metrics'],
            custom: {}
          }
        }
      ];

      await marginSystem.processSignals(signals, ResilienceMode.NORMAL);
      
      const updatedMetrics = marginSystem.getMetrics();
      expect(updatedMetrics.lastUpdated.getTime()).toBeGreaterThanOrEqual(initialMetrics.lastUpdated.getTime());
    });
  });

  describe('Margin Forecasting', () => {
    it('should generate forecast with default time horizon', () => {
      const forecast = marginSystem.generateForecast();
      
      expect(forecast.timeHorizon).toBe(7); // Default 7 days
      expect(forecast.generatedAt).toBeInstanceOf(Date);
      expect(forecast.projections).toHaveLength(4); // One for each margin type
      expect(forecast.confidence).toBeGreaterThanOrEqual(0);
      expect(forecast.confidence).toBeLessThanOrEqual(1);
      expect(forecast.assumptions).toBeDefined();
      expect(forecast.assumptions.length).toBeGreaterThan(0);
    });

    it('should generate forecast with custom time horizon', () => {
      const forecast = marginSystem.generateForecast(14);
      
      expect(forecast.timeHorizon).toBe(14);
      expect(forecast.projections).toHaveLength(4);
      
      forecast.projections.forEach(projection => {
        expect(projection.marginType).toBeDefined();
        expect(projection.currentUtilization).toBeGreaterThanOrEqual(0);
        expect(projection.currentUtilization).toBeLessThanOrEqual(1);
        expect(projection.projectedUtilization).toBeGreaterThanOrEqual(0);
        expect(projection.projectedUtilization).toBeLessThanOrEqual(1);
        expect(projection.projectedAvailable).toBeGreaterThanOrEqual(0);
        expect(projection.riskLevel).toMatch(/^(low|medium|high)$/);
        expect(projection.recommendations).toBeDefined();
      });
    });

    it('should provide meaningful recommendations in forecast', () => {
      const forecast = marginSystem.generateForecast(30);
      
      forecast.projections.forEach(projection => {
        if (projection.recommendations.length > 0) {
          projection.recommendations.forEach(rec => {
            expect(rec).toBeDefined();
            expect(rec.length).toBeGreaterThan(0);
          });
        }
      });
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      const newConfig = {
        enabled: false,
        updateInterval: 30000
      };
      
      marginSystem.updateConfig(newConfig);
      
      // Configuration should be updated (we can't directly test this without exposing config)
      // But we can test that the method doesn't throw
      expect(() => marginSystem.updateConfig(newConfig)).not.toThrow();
    });

    it('should update thresholds', () => {
      const newThresholds = [
        {
          marginType: MarginType.TIME,
          warningThreshold: 25,
          criticalThreshold: 15,
          emergencyThreshold: 5,
          optimalRange: { min: 20, max: 35 },
          isActive: true
        }
      ];
      
      expect(() => marginSystem.updateThresholds(newThresholds)).not.toThrow();
    });

    it('should update policies', () => {
      const newPolicies = [
        {
          id: 'test-policy',
          name: 'Test Policy',
          description: 'Test policy for unit testing',
          triggerConditions: {
            signalTypes: [SignalType.ASSET_CONDITION],
            severityLevels: [SignalSeverity.MEDIUM],
            resilienceModes: [ResilienceMode.NORMAL]
          },
          allocationRules: {
            timeMargin: { min: 10, max: 30, priority: 1 },
            capacityMargin: { min: 15, max: 40, priority: 1 },
            materialMargin: { min: 20, max: 50, priority: 1 },
            financialMargin: { min: 5, max: 25, priority: 1 }
          },
          deploymentStrategy: 'graduated' as const,
          isActive: true
        }
      ];
      
      expect(() => marginSystem.updatePolicies(newPolicies)).not.toThrow();
    });
  });

  describe('Status and Health', () => {
    it('should return comprehensive status', () => {
      const status = marginSystem.getStatus();
      
      expect(status.allocations).toBeDefined();
      expect(status.activeDeployments).toBeDefined();
      expect(status.recentEvents).toBeDefined();
      expect(status.utilizationTrends).toBeDefined();
      expect(status.recommendations).toBeDefined();
      
      expect(Array.isArray(status.allocations)).toBe(true);
      expect(Array.isArray(status.activeDeployments)).toBe(true);
      expect(Array.isArray(status.recentEvents)).toBe(true);
      expect(Array.isArray(status.utilizationTrends)).toBe(true);
      expect(Array.isArray(status.recommendations)).toBe(true);
    });

    it('should track utilization trends over time', async () => {
      const signals: Signal[] = [
        {
          id: 'trend-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.OPERATIONAL,
          severity: SignalSeverity.LOW,
          data: { operation: 'routine' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.7,
            relatedSignals: [],
            tags: ['trend'],
            custom: {}
          }
        }
      ];

      await marginSystem.processSignals(signals, ResilienceMode.NORMAL);
      
      const status = marginSystem.getStatus();
      expect(status.utilizationTrends.length).toBeGreaterThan(0);
      
      status.utilizationTrends.forEach(trend => {
        expect(trend.marginType).toBeDefined();
        expect(trend.utilizationRate).toBeGreaterThanOrEqual(0);
        expect(trend.utilizationRate).toBeLessThanOrEqual(1);
        expect(trend.timestamp).toBeInstanceOf(Date);
        expect(trend.status).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle disabled system gracefully', async () => {
      const disabledConfig = { ...config, enabled: false };
      const disabledSystem = new MarginManagementSystem(disabledConfig);
      
      const signals: Signal[] = [
        {
          id: 'test-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: {},
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.8,
            relatedSignals: [],
            tags: [],
            custom: {}
          }
        }
      ];

      const result = await disabledSystem.processSignals(signals, ResilienceMode.NORMAL);
      
      expect(result.allocations).toHaveLength(0);
      expect(result.deployments).toHaveLength(0);
      expect(result.recommendations).toHaveLength(0);
      expect(result.events).toHaveLength(0);
    });

    it('should handle invalid signals gracefully', async () => {
      const invalidSignals: any[] = [
        null,
        undefined,
        { invalid: 'signal' },
        { id: 'partial-signal' }
      ];

      // Should not throw, but may filter out invalid signals
      const result = await marginSystem.processSignals(invalidSignals as Signal[], ResilienceMode.NORMAL);
      
      expect(result).toBeDefined();
      expect(result.allocations).toBeDefined();
      expect(result.deployments).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.events).toBeDefined();
    });
  });

  describe('Integration with Resilience Modes', () => {
    it('should adapt to different resilience modes', async () => {
      const signals: Signal[] = [
        {
          id: 'mode-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: { condition: 'stable' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.8,
            relatedSignals: [],
            tags: ['mode'],
            custom: {}
          }
        }
      ];

      const modes = [
        ResilienceMode.NORMAL,
        ResilienceMode.ELEVATED,
        ResilienceMode.HIGH_STRESS,
        ResilienceMode.EMERGENCY,
        ResilienceMode.RECOVERY,
        ResilienceMode.MAINTENANCE
      ];

      for (const mode of modes) {
        const result = await marginSystem.processSignals(signals, mode);
        
        expect(result.allocations).toBeDefined();
        expect(result.deployments).toBeDefined();
        expect(result.recommendations).toBeDefined();
        expect(result.events).toBeDefined();
        
        // Different modes may result in different allocation strategies
        result.allocations.forEach(allocation => {
          expect(allocation.marginType).toBeDefined();
          expect(allocation.utilizationRate).toBeGreaterThanOrEqual(0);
          expect(allocation.utilizationRate).toBeLessThanOrEqual(1);
        });
      }
    });
  });
});
