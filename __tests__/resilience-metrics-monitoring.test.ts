/**
 * Resilience Metrics & Monitoring Tests
 *
 * Comprehensive test suite for the Resilience Metrics & Monitoring System
 * Tests metrics collection, alerting, and monitoring capabilities
 *
 * @file __tests__/resilience-metrics-monitoring.test.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { ResilienceMetricsMonitoring } from '@/lib/resilience-metrics-monitoring';
import { Signal, SignalType, SignalSeverity, SignalSource, ResilienceEvent, ResilienceEventType } from '@/types/resilience';

describe('ResilienceMetricsMonitoring', () => {
  let monitoring: ResilienceMetricsMonitoring;
  let config: any;

  beforeEach(() => {
    config = {
      enabled: true,
      collectionInterval: 1000, // 1 second for faster testing
      retentionPeriod: 1, // 1 day
      thresholds: {
        responseTime: 2000,
        errorRate: 0.05,
        memoryUsage: 100 * 1024 * 1024, // 100MB
        cpuUsage: 80,
        resilienceLevel: 60
      },
      components: {
        performance: true,
        margins: true,
        antifragile: true,
        adaptive: true,
        signals: true,
        health: true
      },
      alerts: {
        enabled: true,
        channels: ['console', 'log'],
        severity: 'medium'
      }
    };
    monitoring = new ResilienceMetricsMonitoring(config);
  });

  describe('Initialization', () => {
    it('should initialize with configuration', () => {
      expect(monitoring).toBeDefined();
      expect(monitoring['config']).toEqual(config);
    });

    it('should initialize counters', () => {
      expect(monitoring['signalCounts']).toBeDefined();
      expect(monitoring['severityCounts']).toBeDefined();
      expect(monitoring['responseTimes']).toBeDefined();
      expect(monitoring['errorCount']).toBe(0);
      expect(monitoring['totalSignals']).toBe(0);
    });

    it('should not be monitoring initially', () => {
      expect(monitoring['isMonitoring']).toBe(false);
    });
  });

  describe('Monitoring Control', () => {
    it('should start monitoring', () => {
      monitoring.startMonitoring();
      expect(monitoring['isMonitoring']).toBe(true);
      expect(monitoring['monitoringInterval']).toBeDefined();
    });

    it('should stop monitoring', () => {
      monitoring.startMonitoring();
      monitoring.stopMonitoring();
      expect(monitoring['isMonitoring']).toBe(false);
      expect(monitoring['monitoringInterval']).toBeUndefined();
    });

    it('should not start monitoring if disabled', () => {
      const disabledConfig = { ...config, enabled: false };
      const disabledMonitoring = new ResilienceMetricsMonitoring(disabledConfig);
      
      disabledMonitoring.startMonitoring();
      expect(disabledMonitoring['isMonitoring']).toBe(false);
    });

    it('should handle multiple start/stop calls gracefully', () => {
      monitoring.startMonitoring();
      monitoring.startMonitoring(); // Should not cause issues
      expect(monitoring['isMonitoring']).toBe(true);
      
      monitoring.stopMonitoring();
      monitoring.stopMonitoring(); // Should not cause issues
      expect(monitoring['isMonitoring']).toBe(false);
    });
  });

  describe('Signal Processing Recording', () => {
    beforeEach(() => {
      monitoring.startMonitoring();
    });

    afterEach(() => {
      monitoring.stopMonitoring();
    });

    it('should record successful signal processing', () => {
      const signal: Signal = {
        id: 'test-signal-1',
        source: SignalSource.SYSTEM_MONITOR,
        type: SignalType.ASSET_CONDITION,
        severity: SignalSeverity.MEDIUM,
        data: { test: true },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'test-org',
        metadata: { confidence: 0.8 }
      };

      monitoring.recordSignalProcessing(signal, 150, true);

      expect(monitoring['totalSignals']).toBe(1);
      expect(monitoring['responseTimes']).toContain(150);
      expect(monitoring['errorCount']).toBe(0);
      expect(monitoring['signalCounts'].get(SignalType.ASSET_CONDITION)).toBe(1);
      expect(monitoring['severityCounts'].get(SignalSeverity.MEDIUM)).toBe(1);
    });

    it('should record failed signal processing', () => {
      const signal: Signal = {
        id: 'test-signal-2',
        source: SignalSource.SYSTEM_MONITOR,
        type: SignalType.PERFORMANCE_DEGRADATION,
        severity: SignalSeverity.HIGH,
        data: { test: true },
        timestamp: new Date(),
        status: 'RECEIVED' as any,
        organisationId: 'test-org',
        metadata: { confidence: 0.8 }
      };

      monitoring.recordSignalProcessing(signal, 200, false);

      expect(monitoring['totalSignals']).toBe(1);
      expect(monitoring['responseTimes']).toContain(200);
      expect(monitoring['errorCount']).toBe(1);
      expect(monitoring['signalCounts'].get(SignalType.PERFORMANCE_DEGRADATION)).toBe(1);
      expect(monitoring['severityCounts'].get(SignalSeverity.HIGH)).toBe(1);
    });

    it('should maintain response time history limit', () => {
      // Generate more than 1000 signals to test the limit
      for (let i = 0; i < 1500; i++) {
        const signal: Signal = {
          id: `test-signal-${i}`,
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.LOW,
          data: { test: true },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'test-org',
          metadata: { confidence: 0.8 }
        };
        monitoring.recordSignalProcessing(signal, 100 + i, true);
      }

      expect(monitoring['responseTimes'].length).toBeLessThanOrEqual(1000);
      expect(monitoring['totalSignals']).toBe(1500);
    });
  });

  describe('Resilience Event Recording', () => {
    beforeEach(() => {
      monitoring.startMonitoring();
    });

    afterEach(() => {
      monitoring.stopMonitoring();
    });

    it('should record resilience events', () => {
      const event: ResilienceEvent = {
        id: 'test-event-1',
        type: ResilienceEventType.STATE_CHANGE,
        timestamp: new Date(),
        data: { test: true },
        organisationId: 'test-org'
      };

      let emittedEvent: ResilienceEvent | null = null;
      monitoring.on('resilienceEvent', (event) => {
        emittedEvent = event;
      });

      monitoring.recordResilienceEvent(event);

      expect(emittedEvent).toEqual(event);
    });

    it('should generate alerts for emergency events', () => {
      const emergencyEvent: ResilienceEvent = {
        id: 'emergency-event-1',
        type: ResilienceEventType.EMERGENCY_RESPONSE,
        timestamp: new Date(),
        data: { emergency: true },
        organisationId: 'test-org'
      };

      let emittedAlert: any = null;
      monitoring.on('alert', (alert) => {
        emittedAlert = alert;
      });

      monitoring.recordResilienceEvent(emergencyEvent);

      expect(emittedAlert).toBeDefined();
      expect(emittedAlert.severity).toBe('critical');
      expect(emittedAlert.type).toBe('emergency');
      expect(emittedAlert.message).toContain('Emergency response triggered');
    });
  });

  describe('Metrics Collection', () => {
    beforeEach(() => {
      monitoring.startMonitoring();
      
      // Record some test data
      for (let i = 0; i < 10; i++) {
        const signal: Signal = {
          id: `test-signal-${i}`,
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: i % 2 === 0 ? SignalSeverity.LOW : SignalSeverity.MEDIUM,
          data: { test: true },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'test-org',
          metadata: { confidence: 0.8 }
        };
        monitoring.recordSignalProcessing(signal, 100 + i * 10, i % 3 === 0); // Some failures
      }
    });

    afterEach(() => {
      monitoring.stopMonitoring();
    });

    it('should collect comprehensive metrics', (done) => {
      monitoring.on('metrics', (metrics) => {
        expect(metrics).toBeDefined();
        expect(metrics.overallScore).toBeGreaterThanOrEqual(0);
        expect(metrics.componentScores).toBeDefined();
        expect(metrics.performance).toBeDefined();
        expect(metrics.margins).toBeDefined();
        expect(metrics.antifragile).toBeDefined();
        expect(metrics.adaptive).toBeDefined();
        expect(metrics.signals).toBeDefined();
        expect(metrics.health).toBeDefined();
        expect(metrics.timestamp).toBeInstanceOf(Date);
        done();
      });

      // Wait for metrics collection
      setTimeout(() => {}, 1500);
    }, 5000);

    it('should calculate correct performance metrics', (done) => {
      monitoring.on('metrics', (metrics) => {
        expect(metrics.performance.averageResponseTime).toBeGreaterThan(0);
        expect(metrics.performance.maxResponseTime).toBeGreaterThanOrEqual(metrics.performance.averageResponseTime);
        expect(metrics.performance.minResponseTime).toBeLessThanOrEqual(metrics.performance.averageResponseTime);
        expect(metrics.performance.throughput).toBeGreaterThan(0);
        expect(metrics.performance.errorRate).toBeGreaterThanOrEqual(0);
        expect(metrics.performance.availability).toBeGreaterThanOrEqual(0);
        done();
      });

      setTimeout(() => {}, 1500);
    }, 5000);

    it('should calculate correct signal metrics', (done) => {
      monitoring.on('metrics', (metrics) => {
        expect(metrics.signals.totalProcessed).toBe(10);
        expect(metrics.signals.processedPerSecond).toBeGreaterThan(0);
        expect(metrics.signals.averageProcessingTime).toBeGreaterThan(0);
        expect(metrics.signals.errorRate).toBeGreaterThanOrEqual(0);
        expect(metrics.signals.severityDistribution).toBeDefined();
        expect(metrics.signals.severityDistribution[SignalSeverity.LOW]).toBeGreaterThan(0);
        expect(metrics.signals.severityDistribution[SignalSeverity.MEDIUM]).toBeGreaterThan(0);
        done();
      });

      setTimeout(() => {}, 1500);
    }, 5000);
  });

  describe('Alert Management', () => {
    beforeEach(() => {
      monitoring.startMonitoring();
    });

    afterEach(() => {
      monitoring.stopMonitoring();
    });

    it('should generate alerts when thresholds are exceeded', (done) => {
      let alertCount = 0;
      monitoring.on('alert', (alert) => {
        alertCount++;
        expect(alert.id).toBeDefined();
        expect(alert.timestamp).toBeInstanceOf(Date);
        expect(['low', 'medium', 'high', 'critical']).toContain(alert.severity);
        expect(['performance', 'resilience', 'health', 'margin', 'antifragile', 'adaptive']).toContain(alert.type);
        expect(alert.message).toBeDefined();
        expect(alert.context).toBeDefined();
        expect(alert.status).toBe('active');
      });

      // Record signals that will trigger alerts
      for (let i = 0; i < 20; i++) {
        const signal: Signal = {
          id: `alert-signal-${i}`,
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.PERFORMANCE_DEGRADATION,
          severity: SignalSeverity.HIGH,
          data: { test: true },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'test-org',
          metadata: { confidence: 0.8 }
        };
        monitoring.recordSignalProcessing(signal, 3000, false); // High response time and errors
      }

      setTimeout(() => {
        expect(alertCount).toBeGreaterThan(0);
        done();
      }, 2000);
    }, 10000);

    it('should acknowledge alerts', () => {
      const alert = {
        id: 'test-alert-1',
        timestamp: new Date(),
        severity: 'medium' as const,
        type: 'performance' as const,
        message: 'Test alert',
        context: {},
        status: 'active' as const
      };

      monitoring['alerts'].push(alert);
      
      const result = monitoring.acknowledgeAlert(alert.id);
      expect(result).toBe(true);
      expect(alert.status).toBe('acknowledged');
    });

    it('should resolve alerts', () => {
      const alert = {
        id: 'test-alert-2',
        timestamp: new Date(),
        severity: 'high' as const,
        type: 'resilience' as const,
        message: 'Test alert',
        context: {},
        status: 'active' as const
      };

      monitoring['alerts'].push(alert);
      
      const result = monitoring.resolveAlert(alert.id);
      expect(result).toBe(true);
      expect(alert.status).toBe('resolved');
      expect(alert.resolvedAt).toBeDefined();
    });

    it('should return false for non-existent alerts', () => {
      expect(monitoring.acknowledgeAlert('non-existent')).toBe(false);
      expect(monitoring.resolveAlert('non-existent')).toBe(false);
    });
  });

  describe('Data Retrieval', () => {
    beforeEach(() => {
      monitoring.startMonitoring();
      
      // Record some test data
      for (let i = 0; i < 5; i++) {
        const signal: Signal = {
          id: `test-signal-${i}`,
          source: SignalSource.SYSTEM_MONITOR,
          type: SignalType.ASSET_CONDITION,
          severity: SignalSeverity.LOW,
          data: { test: true },
          timestamp: new Date(),
          status: 'RECEIVED' as any,
          organisationId: 'test-org',
          metadata: { confidence: 0.8 }
        };
        monitoring.recordSignalProcessing(signal, 100, true);
      }
    });

    afterEach(() => {
      monitoring.stopMonitoring();
    });

    it('should get current metrics', (done) => {
      setTimeout(() => {
        const currentMetrics = monitoring.getCurrentMetrics();
        expect(currentMetrics).toBeDefined();
        expect(currentMetrics.overallScore).toBeGreaterThanOrEqual(0);
        done();
      }, 1500);
    }, 5000);

    it('should get metrics history', (done) => {
      setTimeout(() => {
        const history = monitoring.getMetricsHistory();
        expect(Array.isArray(history)).toBe(true);
        expect(history.length).toBeGreaterThan(0);
        
        const limitedHistory = monitoring.getMetricsHistory(2);
        expect(limitedHistory.length).toBeLessThanOrEqual(2);
        done();
      }, 2000);
    }, 5000);

    it('should get active alerts', () => {
      const activeAlerts = monitoring.getActiveAlerts();
      expect(Array.isArray(activeAlerts)).toBe(true);
    });

    it('should get all alerts', () => {
      const allAlerts = monitoring.getAllAlerts();
      expect(Array.isArray(allAlerts)).toBe(true);
      
      const limitedAlerts = monitoring.getAllAlerts(5);
      expect(limitedAlerts.length).toBeLessThanOrEqual(5);
    });

    it('should get monitoring status', () => {
      const status = monitoring.getStatus();
      expect(status.isMonitoring).toBe(true);
      expect(status.uptime).toBeGreaterThan(0);
      expect(status.metricsCount).toBeGreaterThanOrEqual(0);
      expect(status.alertsCount).toBeGreaterThanOrEqual(0);
      expect(status.activeAlertsCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      const newConfig = {
        collectionInterval: 2000,
        thresholds: {
          responseTime: 3000,
          errorRate: 0.1
        }
      };

      monitoring.updateConfig(newConfig);
      
      expect(monitoring['config'].collectionInterval).toBe(2000);
      expect(monitoring['config'].thresholds.responseTime).toBe(3000);
      expect(monitoring['config'].thresholds.errorRate).toBe(0.1);
    });
  });

  describe('Predefined Configurations', () => {
    it('should provide predefined configurations', () => {
      const predefinedConfigs = ResilienceMetricsMonitoring.getPredefinedConfigs();
      
      expect(predefinedConfigs).toBeDefined();
      expect(Array.isArray(predefinedConfigs)).toBe(true);
      expect(predefinedConfigs.length).toBeGreaterThan(0);
      
      predefinedConfigs.forEach(config => {
        expect(config.enabled).toBeDefined();
        expect(config.collectionInterval).toBeGreaterThan(0);
        expect(config.retentionPeriod).toBeGreaterThan(0);
        expect(config.thresholds).toBeDefined();
        expect(config.components).toBeDefined();
        expect(config.alerts).toBeDefined();
      });
    });

    it('should have different collection intervals for different configs', () => {
      const predefinedConfigs = ResilienceMetricsMonitoring.getPredefinedConfigs();
      
      const intervals = predefinedConfigs.map(config => config.collectionInterval);
      const uniqueIntervals = [...new Set(intervals)];
      
      expect(uniqueIntervals.length).toBeGreaterThan(1);
    });
  });

  describe('Event Emission', () => {
    beforeEach(() => {
      monitoring.startMonitoring();
    });

    afterEach(() => {
      monitoring.stopMonitoring();
    });

    it('should emit metrics events', (done) => {
      monitoring.on('metrics', (metrics) => {
        expect(metrics).toBeDefined();
        done();
      });

      setTimeout(() => {}, 1500);
    }, 5000);

    it('should emit alert events', () => {
      let alertEmitted = false;
      monitoring.on('alert', () => {
        alertEmitted = true;
      });

      monitoring['generateAlert']('high', 'performance', 'Test alert', { test: true });
      
      expect(alertEmitted).toBe(true);
    });

    it('should emit alert acknowledgment events', () => {
      const alert = {
        id: 'test-alert',
        timestamp: new Date(),
        severity: 'medium' as const,
        type: 'performance' as const,
        message: 'Test alert',
        context: {},
        status: 'active' as const
      };

      monitoring['alerts'].push(alert);

      let acknowledgmentEmitted = false;
      monitoring.on('alertAcknowledged', () => {
        acknowledgmentEmitted = true;
      });

      monitoring.acknowledgeAlert(alert.id);
      
      expect(acknowledgmentEmitted).toBe(true);
    });

    it('should emit alert resolution events', () => {
      const alert = {
        id: 'test-alert',
        timestamp: new Date(),
        severity: 'high' as const,
        type: 'resilience' as const,
        message: 'Test alert',
        context: {},
        status: 'active' as const
      };

      monitoring['alerts'].push(alert);

      let resolutionEmitted = false;
      monitoring.on('alertResolved', () => {
        resolutionEmitted = true;
      });

      monitoring.resolveAlert(alert.id);
      
      expect(resolutionEmitted).toBe(true);
    });
  });
});
