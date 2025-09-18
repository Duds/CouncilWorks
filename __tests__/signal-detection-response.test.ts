/**
 * Signal Detection & Response System Tests
 *
 * Comprehensive test suite for E15: Signal Detection & Response System
 * Tests all components including signal detection, processing, orchestration,
 * automated workflows, intelligence, and performance monitoring.
 *
 * @file __tests__/signal-detection-response.test.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { SignalDetectionEngine } from '@/lib/signal-detection-engine';
import { SignalProcessingEngine } from '@/lib/signal-processing-engine';
import { ResponseOrchestrationEngine } from '@/lib/response-orchestration-engine';
import { AutomatedResponseWorkflowsEngine } from '@/lib/automated-response-workflows';
import { SignalIntelligenceEngine } from '@/lib/signal-intelligence-engine';
import { ResponsePerformanceMonitoringEngine } from '@/lib/response-performance-monitoring-engine';
import {
  Signal,
  SignalType,
  SignalSeverity,
  SignalSource,
  SignalDetectionConfig,
  SignalIntelligenceConfig,
  ResponseOrchestrationConfig,
  MonitoringConfig,
  ResponseActionType,
  SignalSourceType
} from '@/types/resilience';

describe('E15: Signal Detection & Response System', () => {
  let signalDetectionEngine: SignalDetectionEngine;
  let signalProcessingEngine: SignalProcessingEngine;
  let responseOrchestrationEngine: ResponseOrchestrationEngine;
  let automatedWorkflowsEngine: AutomatedResponseWorkflowsEngine;
  let signalIntelligenceEngine: SignalIntelligenceEngine;
  let performanceMonitoringEngine: ResponsePerformanceMonitoringEngine;

  // Test signals
  const testSignals: Signal[] = [
    {
      id: 'signal-1',
      type: SignalType.ASSET_CONDITION,
      severity: SignalSeverity.HIGH,
      source: SignalSource.SYSTEM_MONITOR,
      timestamp: new Date(),
      strength: 85,
      assetId: 'asset-001',
      description: 'Asset condition deterioration detected',
      metadata: { sensor: 'temperature-sensor-1' }
    },
    {
      id: 'signal-2',
      type: SignalType.EMERGENCY,
      severity: SignalSeverity.CRITICAL,
      source: SignalSource.IOT_SENSOR,
      timestamp: new Date(),
      strength: 95,
      assetId: 'asset-002',
      description: 'Emergency condition detected',
      metadata: { sensor: 'pressure-sensor-1' }
    },
    {
      id: 'signal-3',
      type: SignalType.MAINTENANCE,
      severity: SignalSeverity.MEDIUM,
      source: SignalSource.USER_REPORT,
      timestamp: new Date(),
      strength: 70,
      assetId: 'asset-003',
      description: 'Maintenance required',
      metadata: { reportedBy: 'technician-1' }
    }
  ];

  beforeEach(() => {
    // Initialize signal detection engine
    const detectionConfig: SignalDetectionConfig = {
      id: 'test-detection-config',
      name: 'Test Signal Detection',
      description: 'Test configuration for signal detection',
      sources: [SignalSourceType.IOT_SENSOR, SignalSourceType.SYSTEM_MONITOR, SignalSourceType.USER_REPORT],
      thresholds: {
        minStrength: 50,
        maxFrequency: 10,
        correlationThreshold: 0.7
      },
      processing: {
        realTimeProcessing: true,
        batchInterval: 5000,
        maxBatchSize: 100,
        enableCorrelation: true
      },
      filters: {
        includeTypes: Object.values(SignalType),
        excludeTypes: [],
        minSeverity: SignalSeverity.LOW,
        assetCategories: []
      },
      alerts: {
        enabled: true,
        channels: ['email', 'sms'],
        escalation: {
          delay: 300000,
          levels: ['low', 'medium', 'high', 'critical']
        }
      },
      performance: {
        maxConcurrent: 10,
        timeout: 30000,
        retry: {
          maxRetries: 3,
          delay: 1000
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0'
    };

    signalDetectionEngine = new SignalDetectionEngine(detectionConfig);

    // Initialize signal processing engine
    const intelligenceConfig: SignalIntelligenceConfig = {
      id: 'test-intelligence-config',
      name: 'Test Signal Intelligence',
      description: 'Test configuration for signal intelligence',
      features: {
        patternRecognition: true,
        anomalyDetection: true,
        predictiveAnalytics: true,
        correlationAnalysis: true,
        trendAnalysis: true
      },
      machineLearning: {
        modelTypes: ['classification', 'regression', 'clustering'],
        trainingDataRetention: 30,
        updateFrequency: 24,
        validation: {
          method: 'CROSS_VALIDATION',
          split: 0.2
        }
      },
      analysis: {
        analysisWindow: 7,
        correlationThreshold: 0.7,
        anomalyThreshold: 0.8,
        predictionHorizon: 72
      },
      performance: {
        maxConcurrent: 5,
        timeout: 60000,
        cache: {
          enabled: true,
          ttl: 300000
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0'
    };

    signalProcessingEngine = new SignalProcessingEngine(intelligenceConfig);

    // Initialize response orchestration engine
    const orchestrationConfig: ResponseOrchestrationConfig = {
      id: 'test-orchestration-config',
      name: 'Test Response Orchestration',
      description: 'Test configuration for response orchestration',
      workflows: [],
      escalationRules: [],
      resourceAllocation: {
        maxConcurrent: 5,
        resourcePools: [],
        strategy: 'PRIORITY_BASED'
      },
      performance: {
        responseTimeout: 300000,
        retry: {
          maxRetries: 3,
          delay: 5000
        }
      },
      monitoring: {
        enabled: true,
        interval: 30000,
        thresholds: {
          responseTime: 60000,
          successRate: 0.9
        }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0'
    };

    responseOrchestrationEngine = new ResponseOrchestrationEngine(orchestrationConfig);

    // Initialize automated workflows engine
    automatedWorkflowsEngine = new AutomatedResponseWorkflowsEngine();

    // Initialize signal intelligence engine
    signalIntelligenceEngine = new SignalIntelligenceEngine(intelligenceConfig);

    // Initialize performance monitoring engine
    const monitoringConfig: MonitoringConfig = {
      monitoringInterval: 30000,
      metricsRetention: 7 * 24 * 60 * 60 * 1000, // 7 days
      alertThresholds: {
        responseTime: 10000,
        successRate: 0.9,
        errorRate: 0.1
      }
    };

    performanceMonitoringEngine = new ResponsePerformanceMonitoringEngine(monitoringConfig);
  });

  describe('F15.1: Multi-Source Signal Detection', () => {
    test('should initialize signal detection engine', async () => {
      const result = await signalDetectionEngine.initialize();
      expect(result.success).toBe(true);
      expect(signalDetectionEngine.isEngineInitialized()).toBe(true);
    });

    test('should detect and process signals', async () => {
      await signalDetectionEngine.initialize();
      
      const result = await signalDetectionEngine.detectSignals(testSignals);
      expect(result.success).toBe(true);
      expect(result.processed).toBeGreaterThan(0);
      expect(result.results.length).toBeGreaterThan(0);
    });

    test('should filter signals based on configuration', async () => {
      await signalDetectionEngine.initialize();
      
      const lowStrengthSignal: Signal = {
        ...testSignals[0],
        strength: 30 // Below threshold
      };
      
      const result = await signalDetectionEngine.detectSignals([lowStrengthSignal]);
      expect(result.filtered).toBeGreaterThan(0);
    });

    test('should update engine status', async () => {
      await signalDetectionEngine.initialize();
      
      const status = signalDetectionEngine.getStatus();
      expect(status.status).toBe('ACTIVE');
      expect(status.statistics.totalDetected).toBeGreaterThanOrEqual(0);
    });

    test('should handle engine shutdown', async () => {
      await signalDetectionEngine.initialize();
      
      const result = await signalDetectionEngine.shutdown();
      expect(result.success).toBe(true);
      expect(signalDetectionEngine.isEngineInitialized()).toBe(false);
    });
  });

  describe('F15.2: Signal Processing & Analysis', () => {
    test('should initialize signal processing engine', async () => {
      const result = await signalProcessingEngine.initialize();
      expect(result.success).toBe(true);
      expect(signalProcessingEngine.isEngineInitialized()).toBe(true);
    });

    test('should process signals and generate analysis results', async () => {
      await signalProcessingEngine.initialize();
      
      const results = await signalProcessingEngine.processSignals(testSignals);
      expect(results.length).toBe(testSignals.length);
      
      for (const result of results) {
        expect(result.signal).toBeDefined();
        expect(result.analysis).toBeDefined();
        expect(result.analysis.classification).toBeDefined();
        expect(result.analysis.riskAssessment).toBeDefined();
        expect(result.analysis.patternRecognition).toBeDefined();
        expect(result.analysis.predictiveAnalysis).toBeDefined();
        expect(result.recommendedActions).toBeDefined();
      }
    });

    test('should classify signals correctly', async () => {
      await signalProcessingEngine.initialize();
      
      const results = await signalProcessingEngine.processSignals([testSignals[0]]);
      const result = results[0];
      
      expect(result.analysis.classification.primaryType).toBe(testSignals[0].type);
      expect(result.analysis.classification.confidence).toBeGreaterThan(0);
    });

    test('should assess risk levels', async () => {
      await signalProcessingEngine.initialize();
      
      const results = await signalProcessingEngine.processSignals([testSignals[1]]);
      const result = results[0];
      
      expect(result.analysis.riskAssessment.riskLevel).toBeDefined();
      expect(result.analysis.riskAssessment.riskScore).toBeGreaterThanOrEqual(0);
      expect(result.analysis.riskAssessment.riskFactors).toBeDefined();
    });

    test('should generate recommended actions', async () => {
      await signalProcessingEngine.initialize();
      
      const results = await signalProcessingEngine.processSignals(testSignals);
      
      for (const result of results) {
        expect(result.recommendedActions).toBeDefined();
        expect(Array.isArray(result.recommendedActions)).toBe(true);
      }
    });
  });

  describe('F15.3: Response Orchestration Engine', () => {
    test('should initialize response orchestration engine', async () => {
      const result = await responseOrchestrationEngine.initialize();
      expect(result.success).toBe(true);
      expect(responseOrchestrationEngine.isEngineInitialized()).toBe(true);
    });

    test('should execute response workflows', async () => {
      await responseOrchestrationEngine.initialize();
      
      const actions = [
        {
          id: 'action-1',
          type: ResponseActionType.SCHEDULE_INSPECTION,
          description: 'Schedule asset inspection',
          priority: 'MEDIUM',
          parameters: {},
          estimatedDuration: 3600000,
          requiredResources: ['inspector'],
          successCriteria: 'Inspection scheduled'
        }
      ];
      
      const result = await responseOrchestrationEngine.executeResponse(testSignals[0], actions);
      expect(result.success).toBe(true);
    });

    test('should manage resource allocation', async () => {
      await responseOrchestrationEngine.initialize();
      
      const resourcePools = responseOrchestrationEngine.getResourcePools();
      expect(resourcePools).toBeDefined();
    });

    test('should track execution status', async () => {
      await responseOrchestrationEngine.initialize();
      
      const activeExecutions = responseOrchestrationEngine.getActiveExecutions();
      expect(Array.isArray(activeExecutions)).toBe(true);
    });

    test('should handle engine shutdown', async () => {
      await responseOrchestrationEngine.initialize();
      
      const result = await responseOrchestrationEngine.shutdown();
      expect(result.success).toBe(true);
      expect(responseOrchestrationEngine.isEngineInitialized()).toBe(false);
    });
  });

  describe('F15.4: Automated Response Workflows', () => {
    test('should initialize automated workflows engine', async () => {
      const result = await automatedWorkflowsEngine.initialize();
      expect(result.success).toBe(true);
      expect(automatedWorkflowsEngine.isEngineInitialized()).toBe(true);
    });

    test('should generate automated workflows', async () => {
      await automatedWorkflowsEngine.initialize();
      
      const workflow = await automatedWorkflowsEngine.generateWorkflow(testSignals[0]);
      expect(workflow).toBeDefined();
      expect(workflow?.triggers.signalTypes).toContain(testSignals[0].type);
    });

    test('should execute automated responses', async () => {
      await automatedWorkflowsEngine.initialize();
      
      const workflow = await automatedWorkflowsEngine.generateWorkflow(testSignals[0]);
      expect(workflow).toBeDefined();
      
      if (workflow) {
        const result = await automatedWorkflowsEngine.executeAutomatedResponse(testSignals[0], workflow);
        expect(result.success).toBe(true);
      }
    });

    test('should optimize workflows', async () => {
      await automatedWorkflowsEngine.initialize();
      
      const workflow = await automatedWorkflowsEngine.generateWorkflow(testSignals[0]);
      expect(workflow).toBeDefined();
      
      if (workflow) {
        const optimizedWorkflow = await automatedWorkflowsEngine.optimizeWorkflow(workflow, testSignals[0]);
        expect(optimizedWorkflow).toBeDefined();
        expect(optimizedWorkflow.steps).toBeDefined();
      }
    });

    test('should manage workflow templates', async () => {
      await automatedWorkflowsEngine.initialize();
      
      const templates = automatedWorkflowsEngine.getWorkflowTemplates();
      expect(templates.size).toBeGreaterThan(0);
    });
  });

  describe('F15.5: Signal Intelligence & Prediction', () => {
    test('should initialize signal intelligence engine', async () => {
      const result = await signalIntelligenceEngine.initialize();
      expect(result.success).toBe(true);
      expect(signalIntelligenceEngine.isEngineInitialized()).toBe(true);
    });

    test('should analyze signals for intelligence insights', async () => {
      await signalIntelligenceEngine.initialize();
      
      const result = await signalIntelligenceEngine.analyzeSignals(testSignals);
      expect(result).toBeDefined();
      expect(result.patternRecognition).toBeDefined();
      expect(result.anomalyDetection).toBeDefined();
      expect(result.predictiveAnalytics).toBeDefined();
      expect(result.correlationAnalysis).toBeDefined();
      expect(result.trendAnalysis).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    test('should detect patterns in signals', async () => {
      await signalIntelligenceEngine.initialize();
      
      const result = await signalIntelligenceEngine.analyzeSignals(testSignals);
      expect(result.patternRecognition.patterns).toBeDefined();
      expect(Array.isArray(result.patternRecognition.patterns)).toBe(true);
    });

    test('should detect anomalies', async () => {
      await signalIntelligenceEngine.initialize();
      
      const result = await signalIntelligenceEngine.analyzeSignals(testSignals);
      expect(result.anomalyDetection.anomalies).toBeDefined();
      expect(Array.isArray(result.anomalyDetection.anomalies)).toBe(true);
    });

    test('should generate predictions', async () => {
      await signalIntelligenceEngine.initialize();
      
      const result = await signalIntelligenceEngine.analyzeSignals(testSignals);
      expect(result.predictiveAnalytics.predictions).toBeDefined();
      expect(Array.isArray(result.predictiveAnalytics.predictions)).toBe(true);
    });

    test('should analyze correlations', async () => {
      await signalIntelligenceEngine.initialize();
      
      const result = await signalIntelligenceEngine.analyzeSignals(testSignals);
      expect(result.correlationAnalysis.correlations).toBeDefined();
      expect(Array.isArray(result.correlationAnalysis.correlations)).toBe(true);
    });

    test('should analyze trends', async () => {
      await signalIntelligenceEngine.initialize();
      
      const result = await signalIntelligenceEngine.analyzeSignals(testSignals);
      expect(result.trendAnalysis.trends).toBeDefined();
      expect(Array.isArray(result.trendAnalysis.trends)).toBe(true);
    });
  });

  describe('F15.6: Response Performance Monitoring', () => {
    test('should initialize performance monitoring engine', async () => {
      const result = await performanceMonitoringEngine.initialize();
      expect(result.success).toBe(true);
      expect(performanceMonitoringEngine.isEngineInitialized()).toBe(true);
    });

    test('should record signal processing metrics', async () => {
      await performanceMonitoringEngine.initialize();
      
      await performanceMonitoringEngine.recordSignalProcessing(testSignals[0], 1000, true);
      
      const metrics = performanceMonitoringEngine.getCurrentMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.responseTime).toBeDefined();
      expect(metrics.successRate).toBeDefined();
    });

    test('should record response execution metrics', async () => {
      await performanceMonitoringEngine.initialize();
      
      const execution: any = {
        executionId: 'exec-1',
        workflowId: 'workflow-1',
        triggerSignal: testSignals[0],
        totalTime: 5000,
        results: {
          success: true,
          metrics: {
            stepsExecuted: 3,
            stepsFailed: 0,
            resourceUtilization: 75
          }
        }
      };
      
      await performanceMonitoringEngine.recordResponseExecution(execution);
      
      const metrics = performanceMonitoringEngine.getCurrentMetrics();
      expect(metrics).toBeDefined();
    });

    test('should generate performance metrics', async () => {
      await performanceMonitoringEngine.initialize();
      
      // Record some test metrics
      await performanceMonitoringEngine.recordSignalProcessing(testSignals[0], 1000, true);
      await performanceMonitoringEngine.recordSignalProcessing(testSignals[1], 1500, true);
      await performanceMonitoringEngine.recordSignalProcessing(testSignals[2], 2000, false);
      
      const metrics = performanceMonitoringEngine.getCurrentMetrics();
      expect(metrics.responseTime.average).toBeGreaterThan(0);
      expect(metrics.successRate.overall).toBeGreaterThanOrEqual(0);
      expect(metrics.throughput.signalsPerMinute).toBeGreaterThanOrEqual(0);
    });

    test('should manage alerts', async () => {
      await performanceMonitoringEngine.initialize();
      
      // Record metrics that should trigger alerts
      await performanceMonitoringEngine.recordSignalProcessing(testSignals[0], 15000, false); // High response time, failure
      
      const activeAlerts = performanceMonitoringEngine.getActiveAlerts();
      expect(Array.isArray(activeAlerts)).toBe(true);
    });

    test('should handle alert acknowledgment and resolution', async () => {
      await performanceMonitoringEngine.initialize();
      
      // Record metrics to create alerts
      await performanceMonitoringEngine.recordSignalProcessing(testSignals[0], 15000, false);
      
      const activeAlerts = performanceMonitoringEngine.getActiveAlerts();
      if (activeAlerts.length > 0) {
        const alert = activeAlerts[0];
        
        performanceMonitoringEngine.acknowledgeAlert(alert.id, 'test-user');
        performanceMonitoringEngine.resolveAlert(alert.id, 'test-user', 'Issue resolved');
        
        const updatedAlerts = performanceMonitoringEngine.getActiveAlerts();
        expect(updatedAlerts.length).toBeLessThan(activeAlerts.length);
      }
    });

    test('should handle engine shutdown', async () => {
      await performanceMonitoringEngine.initialize();
      
      const result = await performanceMonitoringEngine.shutdown();
      expect(result.success).toBe(true);
      expect(performanceMonitoringEngine.isEngineInitialized()).toBe(false);
    });
  });

  describe('E15: Integration Tests', () => {
    test('should integrate all E15 components', async () => {
      // Initialize all engines
      await signalDetectionEngine.initialize();
      await signalProcessingEngine.initialize();
      await responseOrchestrationEngine.initialize();
      await automatedWorkflowsEngine.initialize();
      await signalIntelligenceEngine.initialize();
      await performanceMonitoringEngine.initialize();

      // Test end-to-end signal processing
      const detectionResult = await signalDetectionEngine.detectSignals(testSignals);
      expect(detectionResult.success).toBe(true);

      const processingResults = await signalProcessingEngine.processSignals(detectionResult.results);
      expect(processingResults.length).toBeGreaterThan(0);

      const intelligenceResult = await signalIntelligenceEngine.analyzeSignals(detectionResult.results);
      expect(intelligenceResult).toBeDefined();

      // Test automated response
      const workflow = await automatedWorkflowsEngine.generateWorkflow(testSignals[0]);
      if (workflow) {
        const responseResult = await automatedWorkflowsEngine.executeAutomatedResponse(testSignals[0], workflow);
        expect(responseResult.success).toBe(true);
      }

      // Test performance monitoring
      for (const signal of testSignals) {
        await performanceMonitoringEngine.recordSignalProcessing(signal, 1000, true);
      }

      const metrics = performanceMonitoringEngine.getCurrentMetrics();
      expect(metrics).toBeDefined();
    });

    test('should handle error scenarios gracefully', async () => {
      // Test with invalid signals
      const invalidSignals: Signal[] = [
        {
          id: '',
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.LOW,
          source: SignalSource.SYSTEM_MONITOR,
          timestamp: new Date(),
          strength: -1, // Invalid strength
          assetId: '',
          description: '',
          metadata: {}
        }
      ];

      await signalDetectionEngine.initialize();
      const result = await signalDetectionEngine.detectSignals(invalidSignals);
      
      // Should handle gracefully without crashing
      expect(result).toBeDefined();
    });

    test('should maintain system resilience under load', async () => {
      // Initialize all engines
      await signalDetectionEngine.initialize();
      await signalProcessingEngine.initialize();
      await performanceMonitoringEngine.initialize();

      // Generate many signals
      const manySignals: Signal[] = [];
      for (let i = 0; i < 100; i++) {
        manySignals.push({
          id: `load-test-signal-${i}`,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          source: SignalSource.SYSTEM_MONITOR,
          timestamp: new Date(),
          strength: 70 + Math.random() * 20,
          assetId: `asset-${i % 10}`,
          description: `Load test signal ${i}`,
          metadata: { test: true }
        });
      }

      // Process signals
      const detectionResult = await signalDetectionEngine.detectSignals(manySignals);
      expect(detectionResult.success).toBe(true);

      const processingResults = await signalProcessingEngine.processSignals(detectionResult.results);
      expect(processingResults.length).toBeGreaterThan(0);

      // Verify performance metrics
      const metrics = performanceMonitoringEngine.getCurrentMetrics();
      expect(metrics.throughput.signalsPerMinute).toBeGreaterThan(0);
    });
  });
});
