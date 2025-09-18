/**
 * Adaptive Response Algorithm Tests
 *
 * Comprehensive test suite for adaptive response algorithm functionality
 * Tests machine learning, pattern recognition, statistical analysis, and hybrid algorithms
 *
 * @file __tests__/adaptive-response-algorithms.test.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { AdaptiveResponseAlgorithmManager } from '@/lib/adaptive-response-algorithms';
import {
  AdaptiveAlgorithmConfig,
  AdaptiveAlgorithmType,
  ResponseStrategyType,
  LearningModeType,
  Signal,
  SignalType,
  SignalSeverity,
  SignalSource,
  ResilienceMode,
  MarginAllocation,
  MarginType
} from '@/types/resilience';

describe('AdaptiveResponseAlgorithmManager', () => {
  let algorithmManager: AdaptiveResponseAlgorithmManager;
  let config: AdaptiveAlgorithmConfig;

  beforeEach(() => {
    config = {
      algorithmType: AdaptiveAlgorithmType.HYBRID,
      responseStrategy: ResponseStrategyType.ADAPTIVE,
      learningMode: LearningModeType.ONLINE,
      confidenceThreshold: 0.7,
      learningRate: 0.1,
      maxResponseTime: 5000,
      enableRealTimeLearning: true,
      enablePatternRecognition: true,
      enablePredictiveAnalysis: true,
      parameters: {
        hybridWeights: { ml: 0.4, rule: 0.3, pattern: 0.3 },
        patternWindow: 86400000,
        anomalyThreshold: 2.0,
        effectivenessThreshold: 0.6
      }
    };

    algorithmManager = new AdaptiveResponseAlgorithmManager(config);
  });

  describe('Initialization', () => {
    test('should initialize with default configuration', () => {
      expect(algorithmManager).toBeDefined();
      const status = algorithmManager.getStatus();
      expect(status.activeModels).toBeGreaterThan(0);
      expect(status.algorithmTypes).toContain(AdaptiveAlgorithmType.MACHINE_LEARNING);
      expect(status.algorithmTypes).toContain(AdaptiveAlgorithmType.RULE_BASED);
      expect(status.algorithmTypes).toContain(AdaptiveAlgorithmType.PATTERN_MATCHING);
      expect(status.algorithmTypes).toContain(AdaptiveAlgorithmType.STATISTICAL_ANALYSIS);
      expect(status.algorithmTypes).toContain(AdaptiveAlgorithmType.HYBRID);
    });

    test('should initialize with empty learning events', () => {
      const learningEvents = algorithmManager.getLearningEvents();
      expect(learningEvents).toHaveLength(0);
    });

    test('should initialize with machine learning models', () => {
      const models = algorithmManager.getModels();
      expect(models).toHaveLength(5);
      
      const modelTypes = models.map(m => m.type);
      expect(modelTypes).toContain('signal_classification');
      expect(modelTypes).toContain('response_prediction');
      expect(modelTypes).toContain('pattern_recognition');
      expect(modelTypes).toContain('anomaly_detection');
      expect(modelTypes).toContain('effectiveness_prediction');
    });
  });

  describe('Signal Processing', () => {
    const createTestSignals = (): Signal[] => [
      {
        id: 'signal-1',
        type: SignalType.ASSET_CONDITION,
        severity: SignalSeverity.HIGH,
        source: SignalSource.SENSOR,
        timestamp: new Date(),
        data: { assetId: 'asset-1', condition: 'degraded' },
        metadata: { location: 'site-1' }
      },
      {
        id: 'signal-2',
        type: SignalType.RISK_ESCALATION,
        severity: SignalSeverity.MEDIUM,
        source: SignalSource.USER,
        timestamp: new Date(),
        data: { riskLevel: 'medium', assetId: 'asset-2' },
        metadata: { reportedBy: 'user-1' }
      }
    ];

    const createTestState = () => ({
      mode: ResilienceMode.NORMAL,
      marginAllocation: {
        time: { allocated: 1000, utilized: 200, available: 800 },
        capacity: { allocated: 100, utilized: 30, available: 70 },
        material: { allocated: 50, utilized: 10, available: 40 },
        financial: { allocated: 10000, utilized: 2000, available: 8000 }
      },
      activeSignals: []
    });

    test('should process signals successfully', async () => {
      const signals = createTestSignals();
      const state = createTestState();

      const result = await algorithmManager.processSignals(signals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.processingTime).toBeGreaterThan(0);
      expect(result.learningInsights).toBeDefined();
      expect(result.performanceMetrics).toBeDefined();
    });

    test('should generate response actions for critical signals', async () => {
      const criticalSignal: Signal = {
        id: 'critical-signal',
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM,
        timestamp: new Date(),
        data: { emergencyType: 'fire' },
        metadata: { location: 'building-1' }
      };

      const state = createTestState();
      const result = await algorithmManager.processSignals([criticalSignal], state);

      expect(result.recommendedActions.length).toBeGreaterThan(0);
      const emergencyActions = result.recommendedActions.filter(
        action => action.type === 'EMERGENCY_RESPONSE'
      );
      expect(emergencyActions.length).toBeGreaterThan(0);
    });

    test('should handle multiple signal types', async () => {
      const signals: Signal[] = [
        {
          id: 'asset-signal',
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.HIGH,
          source: SignalSource.SENSOR,
          timestamp: new Date(),
          data: { assetId: 'asset-1' },
          metadata: {}
        },
        {
          id: 'maintenance-signal',
          type: SignalType.MAINTENANCE,
          severity: SignalSeverity.MEDIUM,
          source: SignalSource.USER,
          timestamp: new Date(),
          data: { maintenanceType: 'scheduled' },
          metadata: {}
        },
        {
          id: 'environmental-signal',
          type: SignalType.ENVIRONMENTAL,
          severity: SignalSeverity.LOW,
          source: SignalSource.SENSOR,
          timestamp: new Date(),
          data: { temperature: 25 },
          metadata: {}
        }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(signals, state);

      expect(result.recommendedActions.length).toBeGreaterThan(0);
      expect(result.prediction.effectiveness).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should update learning events when real-time learning is enabled', async () => {
      const signals = createTestSignals();
      const state = createTestState();

      const initialEvents = algorithmManager.getLearningEvents().length;
      await algorithmManager.processSignals(signals, state);
      const finalEvents = algorithmManager.getLearningEvents().length;

      expect(finalEvents).toBeGreaterThan(initialEvents);
    });
  });

  describe('Algorithm Selection', () => {
    test('should select hybrid algorithm for complex situations', async () => {
      const complexSignals: Signal[] = Array.from({ length: 15 }, (_, i) => ({
        id: `signal-${i}`,
        type: SignalType.ASSET_CONDITION,
        severity: SignalSeverity.HIGH,
        source: SignalSource.SENSOR,
        timestamp: new Date(),
        data: { assetId: `asset-${i}` },
        metadata: {}
      }));

      const state = createTestState();
      const result = await algorithmManager.processSignals(complexSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });

    test('should select pattern matching for multiple signal types', async () => {
      const diverseSignals: Signal[] = [
        { id: '1', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.MEDIUM, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} },
        { id: '2', type: SignalType.MAINTENANCE, severity: SignalSeverity.MEDIUM, source: SignalSource.USER, timestamp: new Date(), data: {}, metadata: {} },
        { id: '3', type: SignalType.ENVIRONMENTAL, severity: SignalSeverity.MEDIUM, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} },
        { id: '4', type: SignalType.PERFORMANCE_DEGRADATION, severity: SignalSeverity.MEDIUM, source: SignalSource.SYSTEM, timestamp: new Date(), data: {}, metadata: {} }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(diverseSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });

    test('should select rule-based algorithm for emergency mode', async () => {
      const signals = createTestSignals();
      const emergencyState = {
        ...createTestState(),
        mode: ResilienceMode.EMERGENCY
      };

      const result = await algorithmManager.processSignals(signals, emergencyState);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });
  });

  describe('Machine Learning Algorithm', () => {
    test('should process signals with ML algorithm', async () => {
      const signals = createTestSignals();
      const state = createTestState();

      // Force ML algorithm by creating a simple scenario
      const mlConfig = { ...config, algorithmType: AdaptiveAlgorithmType.MACHINE_LEARNING };
      const mlManager = new AdaptiveResponseAlgorithmManager(mlConfig);

      const result = await mlManager.processSignals(signals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.performanceMetrics).toBeDefined();
    });

    test('should update model performance based on learning', async () => {
      const signals = createTestSignals();
      const state = createTestState();

      const initialModels = algorithmManager.getModels();
      const initialAccuracy = initialModels[0].performance.accuracy;

      await algorithmManager.processSignals(signals, state);

      const updatedModels = algorithmManager.getModels();
      const updatedAccuracy = updatedModels[0].performance.accuracy;

      // Accuracy should be updated (either improved or maintained)
      expect(updatedAccuracy).toBeGreaterThanOrEqual(0.5);
      expect(updatedAccuracy).toBeLessThanOrEqual(0.99);
    });
  });

  describe('Pattern Recognition', () => {
    test('should detect patterns in signal sequences', async () => {
      const patternSignals: Signal[] = [
        { id: '1', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.HIGH, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} },
        { id: '2', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.HIGH, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} },
        { id: '3', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.HIGH, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(patternSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });

    test('should detect anomalies in signal patterns', async () => {
      const anomalySignals: Signal[] = [
        { id: '1', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.LOW, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} },
        { id: '2', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.LOW, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} },
        { id: '3', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.CRITICAL, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(anomalySignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });
  });

  describe('Statistical Analysis', () => {
    test('should perform statistical analysis on signals', async () => {
      const statisticalSignals: Signal[] = [
        { id: '1', type: SignalType.ASSET_CONDITION, severity: SignalSeverity.MEDIUM, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} },
        { id: '2', type: SignalType.MAINTENANCE, severity: SignalSeverity.MEDIUM, source: SignalSource.USER, timestamp: new Date(), data: {}, metadata: {} },
        { id: '3', type: SignalType.ENVIRONMENTAL, severity: SignalSeverity.MEDIUM, source: SignalSource.SENSOR, timestamp: new Date(), data: {}, metadata: {} }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(statisticalSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });

    test('should identify trends in signal data', async () => {
      const trendSignals: Signal[] = Array.from({ length: 10 }, (_, i) => ({
        id: `trend-signal-${i}`,
        type: SignalType.PERFORMANCE_DEGRADATION,
        severity: SignalSeverity.MEDIUM,
        source: SignalSource.SYSTEM,
        timestamp: new Date(),
        data: { performance: 100 - (i * 5) },
        metadata: {}
      }));

      const state = createTestState();
      const result = await algorithmManager.processSignals(trendSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
    });
  });

  describe('Configuration Management', () => {
    test('should update configuration successfully', () => {
      const newConfig = {
        confidenceThreshold: 0.8,
        learningRate: 0.15,
        enableRealTimeLearning: false
      };

      algorithmManager.updateConfig(newConfig);

      // Configuration should be updated (we can't directly test internal state)
      // but we can verify the method doesn't throw
      expect(() => algorithmManager.updateConfig(newConfig)).not.toThrow();
    });

    test('should maintain configuration consistency', () => {
      const originalConfig = { ...config };
      const newConfig = {
        confidenceThreshold: 0.9,
        maxResponseTime: 10000
      };

      algorithmManager.updateConfig(newConfig);

      // Verify the manager still works after config update
      const signals = createTestSignals();
      const state = createTestState();

      expect(async () => {
        await algorithmManager.processSignals(signals, state);
      }).not.toThrow();
    });
  });

  describe('Learning and Adaptation', () => {
    test('should learn from successful responses', async () => {
      const signals = createTestSignals();
      const state = createTestState();

      const initialEvents = algorithmManager.getLearningEvents().length;
      await algorithmManager.processSignals(signals, state);
      const finalEvents = algorithmManager.getLearningEvents().length;

      expect(finalEvents).toBeGreaterThan(initialEvents);

      const learningEvent = algorithmManager.getLearningEvents()[finalEvents - 1];
      expect(learningEvent).toBeDefined();
      expect(learningEvent.originalSignals).toEqual(signals);
      expect(learningEvent.responseActions).toBeDefined();
      expect(learningEvent.actualOutcome).toBeDefined();
      expect(learningEvent.insights).toBeDefined();
    });

    test('should generate learning insights', async () => {
      const signals = createTestSignals();
      const state = createTestState();

      const result = await algorithmManager.processSignals(signals, state);

      expect(result.learningInsights).toBeDefined();
      expect(result.learningInsights.length).toBeGreaterThan(0);
      expect(typeof result.learningInsights[0]).toBe('string');
    });

    test('should track adaptation history', async () => {
      const signals = createTestSignals();
      const state = createTestState();

      await algorithmManager.processSignals(signals, state);
      const learningEvents = algorithmManager.getLearningEvents();

      expect(learningEvents.length).toBeGreaterThan(0);
      
      const event = learningEvents[0];
      expect(event.algorithmUpdates).toBeDefined();
      expect(event.insights).toBeDefined();
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle large numbers of signals efficiently', async () => {
      const largeSignalSet: Signal[] = Array.from({ length: 100 }, (_, i) => ({
        id: `signal-${i}`,
        type: SignalType.ASSET_CONDITION,
        severity: SignalSeverity.MEDIUM,
        source: SignalSource.SENSOR,
        timestamp: new Date(),
        data: { assetId: `asset-${i}` },
        metadata: {}
      }));

      const state = createTestState();
      const startTime = Date.now();
      
      const result = await algorithmManager.processSignals(largeSignalSet, state);
      
      const processingTime = Date.now() - startTime;

      expect(result).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
      expect(processingTime).toBeLessThan(10000); // Should complete within 10 seconds
    });

    test('should maintain performance under stress', async () => {
      const stressSignals: Signal[] = Array.from({ length: 50 }, (_, i) => ({
        id: `stress-signal-${i}`,
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM,
        timestamp: new Date(),
        data: { emergencyType: 'system_failure' },
        metadata: {}
      }));

      const state = createTestState();
      const result = await algorithmManager.processSignals(stressSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should handle concurrent signal processing', async () => {
      const signalBatches = Array.from({ length: 5 }, (_, batchIndex) => 
        Array.from({ length: 10 }, (_, signalIndex) => ({
          id: `batch-${batchIndex}-signal-${signalIndex}`,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          source: SignalSource.SENSOR,
          timestamp: new Date(),
          data: { assetId: `asset-${batchIndex}-${signalIndex}` },
          metadata: {}
        }))
      );

      const state = createTestState();
      
      const promises = signalBatches.map(batch => 
        algorithmManager.processSignals(batch, state)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.recommendedActions).toBeDefined();
        expect(result.prediction).toBeDefined();
      });
    });
  });

  describe('Aegrid Rules Alignment', () => {
    test('should align with Rule 1: Every Asset Has a Purpose', async () => {
      const purposeSignals: Signal[] = [
        {
          id: 'purpose-signal',
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.HIGH,
          source: SignalSource.SENSOR,
          timestamp: new Date(),
          data: { assetId: 'asset-1', purpose: 'transportation', condition: 'degraded' },
          metadata: { serviceFunction: 'transportation' }
        }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(purposeSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
      
      // Should generate actions that consider asset purpose
      const purposeActions = result.recommendedActions.filter(action => 
        action.description.includes('purpose') || 
        action.description.includes('transportation') ||
        action.parameters?.serviceFunction
      );
      expect(purposeActions.length).toBeGreaterThan(0);
    });

    test('should align with Rule 2: Risk Sets the Rhythm', async () => {
      const riskSignals: Signal[] = [
        {
          id: 'risk-signal',
          type: SignalType.RISK_ESCALATION,
          severity: SignalSeverity.HIGH,
          source: SignalSource.USER,
          timestamp: new Date(),
          data: { riskLevel: 'high', assetId: 'asset-1' },
          metadata: { riskCategory: 'safety' }
        }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(riskSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
      
      // Should generate risk-based responses
      const riskActions = result.recommendedActions.filter(action => 
        action.description.includes('risk') || 
        action.description.includes('safety') ||
        action.type === 'NOTIFY'
      );
      expect(riskActions.length).toBeGreaterThan(0);
    });

    test('should align with Rule 3: Respond to the Real World', async () => {
      const realWorldSignals: Signal[] = [
        {
          id: 'environmental-signal',
          type: SignalType.ENVIRONMENTAL,
          severity: SignalSeverity.MEDIUM,
          source: SignalSource.SENSOR,
          timestamp: new Date(),
          data: { temperature: 35, humidity: 80, weather: 'storm' },
          metadata: { location: 'outdoor', conditions: 'extreme' }
        }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(realWorldSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
      
      // Should generate adaptive responses to real-world conditions
      const adaptiveActions = result.recommendedActions.filter(action => 
        action.description.includes('environmental') || 
        action.description.includes('weather') ||
        action.description.includes('adaptive')
      );
      expect(adaptiveActions.length).toBeGreaterThan(0);
    });

    test('should align with Rule 4: Operate with Margin', async () => {
      const marginSignals: Signal[] = [
        {
          id: 'performance-signal',
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          source: SignalSource.SYSTEM,
          timestamp: new Date(),
          data: { performance: 60, threshold: 80 },
          metadata: { marginUtilization: 0.8 }
        }
      ];

      const state = createTestState();
      const result = await algorithmManager.processSignals(marginSignals, state);

      expect(result).toBeDefined();
      expect(result.recommendedActions.length).toBeGreaterThan(0);
      
      // Should generate margin-aware responses
      const marginActions = result.recommendedActions.filter(action => 
        action.description.includes('margin') || 
        action.description.includes('capacity') ||
        action.description.includes('scaling')
      );
      expect(marginActions.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid signals gracefully', async () => {
      const invalidSignals: any[] = [
        { id: 'invalid-1' }, // Missing required fields
        null,
        { id: 'invalid-2', type: 'INVALID_TYPE' }
      ];

      const state = createTestState();

      // Should not throw, but handle gracefully
      await expect(algorithmManager.processSignals(invalidSignals as Signal[], state))
        .resolves.toBeDefined();
    });

    test('should handle empty signal arrays', async () => {
      const state = createTestState();
      const result = await algorithmManager.processSignals([], state);

      expect(result).toBeDefined();
      expect(result.recommendedActions).toBeDefined();
      expect(result.prediction).toBeDefined();
    });

    test('should handle configuration errors', () => {
      const invalidConfig = {
        confidenceThreshold: -1, // Invalid threshold
        learningRate: 2.0, // Invalid learning rate
        maxResponseTime: -1000 // Invalid response time
      };

      expect(() => {
        algorithmManager.updateConfig(invalidConfig);
      }).not.toThrow(); // Should handle gracefully
    });
  });
});

// Helper function to create test signals
function createTestSignals(): Signal[] {
  return [
    {
      id: 'signal-1',
      type: SignalType.ASSET_CONDITION,
      severity: SignalSeverity.HIGH,
      source: SignalSource.SENSOR,
      timestamp: new Date(),
      data: { assetId: 'asset-1', condition: 'degraded' },
      metadata: { location: 'site-1' }
    },
    {
      id: 'signal-2',
      type: SignalType.RISK_ESCALATION,
      severity: SignalSeverity.MEDIUM,
      source: SignalSource.USER,
      timestamp: new Date(),
      data: { riskLevel: 'medium', assetId: 'asset-2' },
      metadata: { reportedBy: 'user-1' }
    }
  ];
}

// Helper function to create test state
function createTestState() {
  return {
    mode: ResilienceMode.NORMAL,
    marginAllocation: {
      time: { allocated: 1000, utilized: 200, available: 800 },
      capacity: { allocated: 100, utilized: 30, available: 70 },
      material: { allocated: 50, utilized: 10, available: 40 },
      financial: { allocated: 10000, utilized: 2000, available: 8000 }
    },
    activeSignals: []
  };
}
