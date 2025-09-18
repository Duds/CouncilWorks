/**
 * Resilience Engine Tests
 * 
 * Comprehensive test suite for the resilience engine implementation
 * Aligned with The Aegrid Rules for resilient asset management
 * 
 * @file __tests__/resilience-engine.test.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { 
  ResilienceEngine, 
  createResilienceEngine, 
  defaultResilienceConfig 
} from '@/lib/resilience-engine';
import { 
  Signal, 
  SignalSource, 
  SignalType, 
  SignalSeverity, 
  MarginType,
  ResilienceMode 
} from '@/types/resilience';

describe('Resilience Engine', () => {
  let resilienceEngine: ResilienceEngine;

  beforeEach(() => {
    resilienceEngine = createResilienceEngine(defaultResilienceConfig);
  });

  afterEach(async () => {
    if (resilienceEngine) {
      await resilienceEngine.shutdown();
    }
  });

  describe('Initialization', () => {
    it('should initialize successfully with default configuration', async () => {
      const result = await resilienceEngine.initialize();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.operational).toBe(true);
    });

    it('should create initial state with correct defaults', async () => {
      await resilienceEngine.initialize();
      const status = resilienceEngine.getStatus();
      
      expect(status.mode).toBe(ResilienceMode.NORMAL);
      expect(status.operational).toBe(true);
      expect(status.healthScore).toBeGreaterThan(0);
      expect(status.activeSignalsCount).toBe(0);
    });
  });

  describe('Signal Processing', () => {
    beforeEach(async () => {
      await resilienceEngine.initialize();
    });

    it('should process signals successfully', async () => {
      const signals: Signal[] = [
        {
          id: 'signal-1',
          source: SignalSource.IOT_SENSOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.MEDIUM,
          data: { temperature: 75, pressure: 120 },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: {
            confidence: 0.9,
            tags: ['temperature', 'pressure'],
            custom: {}
          }
        }
      ];

      const result = await resilienceEngine.processSignals(signals);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].status).toBe('PROCESSED');
    });

    it('should handle multiple signals', async () => {
      const signals: Signal[] = [
        {
          id: 'signal-1',
          source: SignalSource.IOT_SENSOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.LOW,
          data: { temperature: 70 },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.8, tags: [], custom: {} }
        },
        {
          id: 'signal-2',
          source: SignalSource.USER_REPORT,
          type: SignalType.MAINTENANCE,
          severity: SignalSeverity.MEDIUM,
          data: { issue: 'Noise from pump' },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'org-1',
          metadata: { confidence: 0.9, tags: [], custom: {} }
        }
      ];

      const result = await resilienceEngine.processSignals(signals);
      
      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(2);
    });

    it('should trigger emergency response for critical signals', async () => {
      const criticalSignal: Signal = {
        id: 'critical-signal-1',
        source: SignalSource.SYSTEM_MONITOR,
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        data: { emergency: 'System failure imminent' },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'org-1',
        metadata: { confidence: 1.0, tags: ['emergency'], custom: {} }
      };

      const result = await resilienceEngine.processSignals([criticalSignal]);
      
      expect(result.success).toBe(true);
      
      // Check if mode changed to emergency
      const status = resilienceEngine.getStatus();
      expect(status.mode).toBe(ResilienceMode.EMERGENCY);
    });
  });

  describe('Margin Management', () => {
    beforeEach(async () => {
      await resilienceEngine.initialize();
    });

    it('should allocate margin successfully', async () => {
      const result = await resilienceEngine.allocateMargin(
        MarginType.CAPACITY,
        25,
        'Test allocation'
      );
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.capacityMargin.allocated).toBe(25);
    });

    it('should deploy margin for emergency', async () => {
      // First allocate some margin
      await resilienceEngine.allocateMargin(MarginType.CAPACITY, 50, 'Initial allocation');
      
      // Then deploy it
      const result = await resilienceEngine.deployMargin(
        MarginType.CAPACITY,
        25,
        'Emergency deployment'
      );
      
      expect(result.success).toBe(true);
      
      // Check if mode changed to emergency
      const status = resilienceEngine.getStatus();
      expect(status.mode).toBe(ResilienceMode.EMERGENCY);
    });

    it('should reject margin deployment if insufficient margin available', async () => {
      const result = await resilienceEngine.deployMargin(
        MarginType.CAPACITY,
        150, // More than available
        'Emergency deployment'
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient');
    });
  });

  describe('Configuration Management', () => {
    beforeEach(async () => {
      await resilienceEngine.initialize();
    });

    it('should update configuration successfully', async () => {
      const updates = {
        minResilienceLevel: 70,
        maxMarginUtilization: 85
      };

      const result = await resilienceEngine.updateConfig(updates);
      
      expect(result.success).toBe(true);
      expect(result.data?.minResilienceLevel).toBe(70);
      expect(result.data?.maxMarginUtilization).toBe(85);
    });

    it('should maintain existing configuration when partial updates provided', async () => {
      const updates = {
        minResilienceLevel: 80
      };

      const result = await resilienceEngine.updateConfig(updates);
      
      expect(result.success).toBe(true);
      expect(result.data?.minResilienceLevel).toBe(80);
      expect(result.data?.maxMarginUtilization).toBe(defaultResilienceConfig.maxMarginUtilization);
    });
  });

  describe('Health Monitoring', () => {
    beforeEach(async () => {
      await resilienceEngine.initialize();
    });

    it('should perform health check successfully', async () => {
      const healthCheck = await resilienceEngine.performHealthCheck();
      
      expect(healthCheck.status).toBeDefined();
      expect(healthCheck.score).toBeGreaterThan(0);
      expect(healthCheck.components).toBeDefined();
      expect(healthCheck.components.length).toBeGreaterThan(0);
    });

    it('should return operational status', async () => {
      const status = resilienceEngine.getStatus();
      
      expect(status.operational).toBe(true);
      expect(status.mode).toBeDefined();
      expect(status.healthScore).toBeGreaterThan(0);
      expect(status.lastHealthCheck).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle operations before initialization', async () => {
      const result = await resilienceEngine.processSignals([]);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not initialized');
    });

    it('should handle invalid signal processing', async () => {
      await resilienceEngine.initialize();
      
      // Test with empty signals array
      const result = await resilienceEngine.processSignals([]);
      
      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(0);
    });
  });

  describe('Aegrid Rules Alignment', () => {
    beforeEach(async () => {
      await resilienceEngine.initialize();
    });

    it('should support Rule 1: Every Asset Has a Purpose', async () => {
      const assetSignal: Signal = {
        id: 'asset-purpose-signal',
        source: SignalSource.IOT_SENSOR,
        type: SignalType.ASSET_CONDITION,
        severity: SignalSeverity.MEDIUM,
        data: { 
          assetId: 'asset-1',
          purpose: 'Water Treatment',
          condition: 'Degraded'
        },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'org-1',
        metadata: { confidence: 0.9, tags: ['asset', 'purpose'], custom: {} }
      };

      const result = await resilienceEngine.processSignals([assetSignal]);
      
      expect(result.success).toBe(true);
      // Verify purpose-driven processing
      expect(result.data?.[0].data.purpose).toBe('Water Treatment');
    });

    it('should support Rule 2: Risk Sets the Rhythm', async () => {
      const riskSignal: Signal = {
        id: 'risk-signal',
        source: SignalSource.SYSTEM_MONITOR,
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
      };

      const result = await resilienceEngine.processSignals([riskSignal]);
      
      expect(result.success).toBe(true);
      
      // Check if mode changed based on risk
      const status = resilienceEngine.getStatus();
      expect(status.mode).toBe(ResilienceMode.ELEVATED);
    });

    it('should support Rule 3: Respond to the Real World', async () => {
      const environmentalSignal: Signal = {
        id: 'environmental-signal',
        source: SignalSource.WEATHER_SERVICE,
        type: SignalType.ENVIRONMENTAL,
        severity: SignalSeverity.MEDIUM,
        data: { 
          weather: 'Storm',
          windSpeed: 45,
          temperature: 15
        },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'org-1',
        metadata: { confidence: 0.9, tags: ['weather'], custom: {} }
      };

      const result = await resilienceEngine.processSignals([environmentalSignal]);
      
      expect(result.success).toBe(true);
      // Verify adaptive response to real-world conditions
      expect(result.data?.[0].data.weather).toBe('Storm');
    });

    it('should support Rule 4: Operate with Margin', async () => {
      // Test margin allocation
      const allocationResult = await resilienceEngine.allocateMargin(
        MarginType.TIME,
        20,
        'Storm preparation'
      );
      
      expect(allocationResult.success).toBe(true);
      expect(allocationResult.data?.timeMargin.allocated).toBe(20);
      
      // Test margin deployment
      const deploymentResult = await resilienceEngine.deployMargin(
        MarginType.TIME,
        10,
        'Emergency response'
      );
      
      expect(deploymentResult.success).toBe(true);
      
      // Verify margin utilization
      const status = resilienceEngine.getStatus();
      expect(status.marginUtilization).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await resilienceEngine.initialize();
    });

    it('should process signals within acceptable time', async () => {
      const signals: Signal[] = Array.from({ length: 100 }, (_, i) => ({
        id: `signal-${i}`,
        source: SignalSource.IOT_SENSOR,
        type: SignalType.ASSET_CONDITION,
        severity: SignalSeverity.LOW,
        data: { value: i },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'org-1',
        metadata: { confidence: 0.8, tags: [], custom: {} }
      }));

      const startTime = Date.now();
      const result = await resilienceEngine.processSignals(signals);
      const endTime = Date.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should maintain performance under stress', async () => {
      // Simulate stress by processing many signals
      const stressSignals: Signal[] = Array.from({ length: 50 }, (_, i) => ({
        id: `stress-signal-${i}`,
        source: SignalSource.SYSTEM_MONITOR,
        type: SignalType.PERFORMANCE_DEGRADATION,
        severity: SignalSeverity.HIGH,
        data: { load: 90 + i },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'org-1',
        metadata: { confidence: 0.9, tags: ['stress'], custom: {} }
      }));

      const result = await resilienceEngine.processSignals(stressSignals);
      
      expect(result.success).toBe(true);
      
      // Verify system remains operational under stress
      const status = resilienceEngine.getStatus();
      expect(status.operational).toBe(true);
      expect(status.healthScore).toBeGreaterThan(0);
    });
  });
});
