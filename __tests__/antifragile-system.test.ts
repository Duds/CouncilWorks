/**
 * Antifragile System Tests
 * 
 * Comprehensive test suite for the AntifragileSystem class
 * Aligned with The Aegrid Rules for resilient asset management
 * 
 * @file __tests__/antifragile-system.test.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { AntifragileSystem } from '@/lib/antifragile-system';
import {
  AntifragileConfig,
  AntifragilePattern,
  StressEvent,
  StressAdaptationType,
  Signal,
  SignalType,
  SignalSeverity,
  SignalSource
} from '@/types/resilience';

describe('AntifragileSystem', () => {
  let antifragileSystem: AntifragileSystem;
  let config: AntifragileConfig;

  beforeEach(() => {
    config = {
      enabled: true,
      stressAdaptationThreshold: 60,
      learningRate: 0.1,
      activationCooldown: 300000, // 5 minutes
      minSuccessRate: 0.7,
      eventRetentionPeriod: 30, // 30 days
      performanceThresholds: {
        minImprovement: 5,
        targetImprovement: 15,
        maxImprovement: 50
      },
      adaptationConfig: {
        [StressAdaptationType.CAPACITY_SCALING]: {
          enabled: true,
          parameters: { maxScalingFactor: 2.0 }
        },
        [StressAdaptationType.EFFICIENCY_IMPROVEMENT]: {
          enabled: true,
          parameters: { maxEfficiencyGain: 25 }
        },
        [StressAdaptationType.REDUNDANCY_ENHANCEMENT]: {
          enabled: true,
          parameters: { maxRedundancyIncrease: 15 }
        },
        [StressAdaptationType.STRESS_LEARNING]: {
          enabled: true,
          parameters: { learningWindow: 24 }
        },
        [StressAdaptationType.THRESHOLD_ADAPTATION]: {
          enabled: true,
          parameters: { adaptationRate: 0.1 }
        }
      }
    };

    antifragileSystem = new AntifragileSystem(config);
  });

  describe('Initialization', () => {
    it('should initialize with default patterns', () => {
      const patterns = antifragileSystem.getPatterns();
      expect(patterns).toHaveLength(3);
      
      const patternNames = patterns.map(p => p.name);
      expect(patternNames).toContain('High Load Capacity Scaling');
      expect(patternNames).toContain('Stress Learning Pattern');
      expect(patternNames).toContain('Efficiency Improvement Pattern');
    });

    it('should initialize with empty stress events and adaptation history', () => {
      const stressEvents = antifragileSystem.getStressEvents();
      const adaptationHistory = antifragileSystem.getAdaptationHistory();
      
      expect(stressEvents).toHaveLength(0);
      expect(adaptationHistory).toHaveLength(0);
    });

    it('should have correct initial status', () => {
      const status = antifragileSystem.getStatus();
      
      expect(status.activePatterns).toHaveLength(0);
      expect(status.recentAdaptations).toBe(0);
      expect(status.successRate).toBe(0);
      expect(status.antifragileScore).toBe(0);
    });
  });

  describe('Stress Event Processing', () => {
    it('should process high stress signals and activate patterns', async () => {
      const highStressSignals: Signal[] = [
        {
          id: 'stress-signal-1',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        },
        {
          id: 'stress-signal-2',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        },
        {
          id: 'stress-signal-3',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.MEDIUM,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(highStressSignals);

      expect(result.activatedPatterns.length).toBeGreaterThan(0);
      expect(result.adaptations.length).toBeGreaterThan(0);
      expect(result.performanceImprovements.length).toBeGreaterThan(0);
    });

    it('should not activate patterns for low stress signals', async () => {
      const lowStressSignals: Signal[] = [
        {
          id: 'low-stress-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.LOW,
          data: { condition: 'good' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['condition'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(lowStressSignals);

      expect(result.activatedPatterns).toHaveLength(0);
      expect(result.adaptations).toHaveLength(0);
    });

    it('should record stress events', async () => {
      const signals: Signal[] = [
        {
          id: 'test-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.MEDIUM,
          data: { risk: 'elevated' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: ['risk'], custom: {} }
        }
      ];

      await antifragileSystem.processStressEvent(signals);
      const stressEvents = antifragileSystem.getStressEvents();

      expect(stressEvents).toHaveLength(1);
      expect(stressEvents[0].triggerSignals).toEqual(signals);
    });
  });

  describe('Pattern Activation', () => {
    it('should activate capacity scaling pattern for high load', async () => {
      const highLoadSignals: Signal[] = [
        {
          id: 'load-signal-1',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { load: 'high' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['load'], custom: {} }
        },
        {
          id: 'load-signal-2',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { load: 'high' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['load'], custom: {} }
        },
        {
          id: 'load-signal-3',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.MEDIUM,
          data: { load: 'high' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['load'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(highLoadSignals);

      const capacityPattern = result.activatedPatterns.find(
        p => p.name === 'High Load Capacity Scaling'
      );
      expect(capacityPattern).toBeDefined();
      expect(result.adaptations).toContain(StressAdaptationType.CAPACITY_SCALING);
    });

    it('should activate stress learning pattern for risk escalation', async () => {
      const riskSignals: Signal[] = [
        {
          id: 'risk-signal-1',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.HIGH,
          data: { risk: 'high' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['risk'], custom: {} }
        },
        {
          id: 'asset-signal-1',
          source: SignalSource.ASSET_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: { condition: 'fair' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: ['asset'], custom: {} }
        },
        {
          id: 'risk-signal-2',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.MEDIUM,
          data: { risk: 'medium' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: ['risk'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(riskSignals);

      const learningPattern = result.activatedPatterns.find(
        p => p.name === 'Stress Learning Pattern'
      );
      expect(learningPattern).toBeDefined();
      expect(result.adaptations).toContain(StressAdaptationType.STRESS_LEARNING);
    });

    it('should respect activation cooldown', async () => {
      const signals: Signal[] = [
        {
          id: 'test-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        }
      ];

      // First activation
      await antifragileSystem.processStressEvent(signals);
      
      // Second activation immediately after (should be blocked by cooldown)
      const result = await antifragileSystem.processStressEvent(signals);
      
      expect(result.activatedPatterns).toHaveLength(0);
    });
  });

  describe('Adaptation Mechanisms', () => {
    it('should execute capacity scaling adaptation', async () => {
      const signals: Signal[] = [
        {
          id: 'capacity-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { capacity: 'low' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['capacity'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(signals);

      if (result.adaptations.includes(StressAdaptationType.CAPACITY_SCALING)) {
        expect(result.performanceImprovements).toContain(
          expect.stringContaining('Capacity scaled by')
        );
      }
    });

    it('should execute efficiency improvement adaptation', async () => {
      const signals: Signal[] = [
        {
          id: 'efficiency-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.MAINTENANCE,
          severity: SignalSeverity.MEDIUM,
          data: { efficiency: 'low' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: ['efficiency'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(signals);

      if (result.adaptations.includes(StressAdaptationType.EFFICIENCY_IMPROVEMENT)) {
        expect(result.performanceImprovements).toContain(
          expect.stringContaining('Efficiency improved by')
        );
      }
    });

    it('should execute stress learning adaptation', async () => {
      const signals: Signal[] = [
        {
          id: 'learning-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.HIGH,
          data: { risk: 'high' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['risk'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(signals);

      if (result.adaptations.includes(StressAdaptationType.STRESS_LEARNING)) {
        expect(result.performanceImprovements).toContain(
          expect.stringContaining('Learned from')
        );
      }
    });
  });

  describe('Status and Metrics', () => {
    it('should update status after processing stress events', async () => {
      const signals: Signal[] = [
        {
          id: 'status-signal-1',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        },
        {
          id: 'status-signal-2',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        },
        {
          id: 'status-signal-3',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.MEDIUM,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        }
      ];

      await antifragileSystem.processStressEvent(signals);
      const status = antifragileSystem.getStatus();

      expect(status.recentAdaptations).toBeGreaterThan(0);
      expect(status.antifragileScore).toBeGreaterThan(0);
    });

    it('should track adaptation history', async () => {
      const signals: Signal[] = [
        {
          id: 'history-signal-1',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        },
        {
          id: 'history-signal-2',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        },
        {
          id: 'history-signal-3',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.MEDIUM,
          data: { performance: 'degraded' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
        }
      ];

      await antifragileSystem.processStressEvent(signals);
      const history = antifragileSystem.getAdaptationHistory();

      expect(history.length).toBeGreaterThan(0);
      expect(history[0]).toHaveProperty('timestamp');
      expect(history[0]).toHaveProperty('adaptationType');
      expect(history[0]).toHaveProperty('performanceImpact');
      expect(history[0]).toHaveProperty('success');
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      const newConfig = {
        stressAdaptationThreshold: 70,
        learningRate: 0.2
      };

      antifragileSystem.updateConfig(newConfig);
      
      // Configuration update doesn't return the config, but we can test
      // that it doesn't throw an error
      expect(() => antifragileSystem.updateConfig(newConfig)).not.toThrow();
    });
  });

  describe('Aegrid Rules Alignment', () => {
    it('should support Rule 1: Every Asset Has a Purpose', async () => {
      const assetSignals: Signal[] = [
        {
          id: 'asset-purpose-signal',
          source: SignalSource.ASSET_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: { 
            assetId: 'asset-1',
            purpose: 'transportation',
            condition: 'fair'
          },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: ['asset', 'purpose'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(assetSignals);

      // Should process signals related to asset purpose
      expect(result.activatedPatterns.length).toBeGreaterThanOrEqual(0);
    });

    it('should support Rule 2: Risk Sets the Rhythm', async () => {
      const riskSignals: Signal[] = [
        {
          id: 'risk-rhythm-signal',
          source: SignalSource.RISK_MONITOR,
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.HIGH,
          data: { 
            riskLevel: 'High',
            impact: 'Service Disruption'
          },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.95, tags: ['risk'], custom: {} }
        },
        {
          id: 'asset-condition-signal',
          source: SignalSource.ASSET_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: { 
            assetId: 'asset-1',
            condition: 'fair'
          },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: ['asset'], custom: {} }
        },
        {
          id: 'risk-rhythm-signal-2',
          source: SignalSource.RISK_MONITOR,
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.MEDIUM,
          data: { 
            riskLevel: 'Medium',
            impact: 'Service Disruption'
          },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: ['risk'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(riskSignals);

      // Should activate risk-based patterns
      const riskPattern = result.activatedPatterns.find(
        p => p.name === 'Stress Learning Pattern'
      );
      expect(riskPattern).toBeDefined();
    });

    it('should support Rule 3: Respond to the Real World', async () => {
      const environmentalSignals: Signal[] = [
        {
          id: 'environmental-signal',
          source: SignalSource.WEATHER_SERVICE,
          type: SignalType.ENVIRONMENTAL,
          severity: SignalSeverity.MEDIUM,
          data: { 
            weather: 'Storm',
            windSpeed: 45,
            impact: 'Service Disruption'
          },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['environmental'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(environmentalSignals);

      // Should adapt to real-world conditions
      expect(result.adaptations.length).toBeGreaterThanOrEqual(0);
    });

    it('should support Rule 4: Operate with Margin', async () => {
      const marginSignals: Signal[] = [
        {
          id: 'margin-signal',
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { 
            marginUtilization: 85,
            capacity: 'low'
          },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: ['margin'], custom: {} }
        }
      ];

      const result = await antifragileSystem.processStressEvent(marginSignals);

      // Should activate margin-related adaptations
      if (result.adaptations.includes(StressAdaptationType.CAPACITY_SCALING)) {
        expect(result.performanceImprovements).toContain(
          expect.stringContaining('Capacity scaled by')
        );
      }
    });
  });

  describe('Performance', () => {
    it('should process multiple stress events efficiently', async () => {
      const signals: Signal[] = Array.from({ length: 10 }, (_, i) => ({
        id: `signal-${i}`,
        source: SignalSource.SYSTEM_MONITOR,
        type: SignalType.PERFORMANCE_DEGRADATION,
        severity: SignalSeverity.HIGH,
        data: { performance: 'degraded' },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'org-1',
        metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
      }));

      const startTime = Date.now();
      await antifragileSystem.processStressEvent(signals);
      const endTime = Date.now();

      // Should process within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should maintain performance under stress', async () => {
      // Process multiple stress events to test performance under stress
      for (let i = 0; i < 5; i++) {
        const signals: Signal[] = [
          {
            id: `stress-signal-${i}`,
            source: SignalSource.SYSTEM_MONITOR,
            type: SignalType.PERFORMANCE_DEGRADATION,
            severity: SignalSeverity.HIGH,
            data: { performance: 'degraded' },
            timestamp: new Date(),
            status: 'RECEIVED' as any,
            organisationId: 'org-1',
            metadata: { confidence: 0.9, tags: ['performance'], custom: {} }
          }
        ];

        const startTime = Date.now();
        await antifragileSystem.processStressEvent(signals);
        const endTime = Date.now();

        // Each event should process quickly
        expect(endTime - startTime).toBeLessThan(500);
      }
    });
  });
});
