/**
 * Production Monitoring and Logging Configuration
 * 
 * Implements comprehensive monitoring, logging, and alerting for Aegrid production environment
 * 
 * @fileoverview Production monitoring and logging setup
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { SeverityLevel } from '@microsoft/applicationinsights-common';

export interface MonitoringConfig {
  appInsightsConnectionString: string;
  environment: 'development' | 'staging' | 'production';
  enableConsoleLogging: boolean;
  enablePerformanceMonitoring: boolean;
  enableErrorTracking: boolean;
  enableUserTracking: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  actions: AlertAction[];
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'slack';
  target: string;
  template?: string;
}

export class ProductionMonitoring {
  private appInsights: ApplicationInsights | null = null;
  private config: MonitoringConfig;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.initializeAppInsights();
  }

  /**
   * Initialize Application Insights
   */
  private initializeAppInsights(): void {
    if (this.config.appInsightsConnectionString) {
      this.appInsights = new ApplicationInsights({
        config: {
          connectionString: this.config.appInsightsConnectionString,
          enableAutoRouteTracking: true,
          enableCorsCorrelation: true,
          enableRequestHeaderTracking: true,
          enableResponseHeaderTracking: true,
          enableAjaxErrorStatusText: true,
          enableAjaxPerfTracking: true,
          enableUnhandledPromiseRejectionTracking: true,
          enablePerfMarks: true,
          enablePerfMeasures: true,
          enableDebug: this.config.environment === 'development',
          loggingLevelConsole: this.config.enableConsoleLogging ? 1 : 0,
          loggingLevelTelemetry: this.config.enableErrorTracking ? 1 : 0,
        }
      });

      this.appInsights.loadAppInsights();
      this.appInsights.trackPageView();
    }
  }

  /**
   * Log message with context
   */
  log(level: LogEntry['level'], message: string, context?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      requestId: this.getCurrentRequestId(),
    };

    // Add to buffer
    this.logBuffer.push(logEntry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(logEntry);
    }

    // Application Insights logging
    if (this.appInsights) {
      this.logToAppInsights(logEntry);
    }
  }

  /**
   * Log to console
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const contextStr = entry.context ? JSON.stringify(entry.context) : '';
    const message = `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message} ${contextStr}`;

    switch (entry.level) {
      case 'debug':
        console.debug(message);
        break;
      case 'info':
        console.info(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      case 'error':
        console.error(message);
        break;
    }
  }

  /**
   * Log to Application Insights
   */
  private logToAppInsights(entry: LogEntry): void {
    if (!this.appInsights) return;

    const severityLevel = this.mapLogLevelToSeverity(entry.level);
    
    this.appInsights.trackTrace({
      message: entry.message,
      severityLevel,
      properties: {
        ...entry.context,
        userId: entry.userId,
        sessionId: entry.sessionId,
        requestId: entry.requestId,
        timestamp: entry.timestamp.toISOString(),
      }
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: PerformanceMetric): void {
    if (!this.appInsights || !this.config.enablePerformanceMonitoring) return;

    this.appInsights.trackMetric({
      name: metric.name,
      average: metric.value,
      properties: {
        unit: metric.unit,
        timestamp: metric.timestamp.toISOString(),
        ...metric.context,
      }
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    if (!this.appInsights || !this.config.enableErrorTracking) return;

    this.appInsights.trackException({
      exception: error,
      properties: {
        ...context,
        userId: this.getCurrentUserId(),
        sessionId: this.getCurrentSessionId(),
        requestId: this.getCurrentRequestId(),
        timestamp: new Date().toISOString(),
      }
    });

    // Also log as error
    this.log('error', error.message, {
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Track user action
   */
  trackUserAction(action: string, properties?: Record<string, any>): void {
    if (!this.appInsights || !this.config.enableUserTracking) return;

    this.appInsights.trackEvent({
      name: action,
      properties: {
        ...properties,
        userId: this.getCurrentUserId(),
        sessionId: this.getCurrentSessionId(),
        timestamp: new Date().toISOString(),
      }
    });
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, url?: string): void {
    if (!this.appInsights) return;

    this.appInsights.trackPageView({
      name: pageName,
      uri: url || window.location.href,
      properties: {
        userId: this.getCurrentUserId(),
        sessionId: this.getCurrentSessionId(),
        timestamp: new Date().toISOString(),
      }
    });
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string | undefined {
    // This would be implemented based on your auth system
    return undefined;
  }

  /**
   * Get current session ID
   */
  private getCurrentSessionId(): string | undefined {
    // This would be implemented based on your session management
    return undefined;
  }

  /**
   * Get current request ID
   */
  private getCurrentRequestId(): string | undefined {
    // This would be implemented based on your request tracking
    return undefined;
  }

  /**
   * Map log level to Application Insights severity
   */
  private mapLogLevelToSeverity(level: LogEntry['level']): SeverityLevel {
    switch (level) {
      case 'debug':
        return SeverityLevel.Verbose;
      case 'info':
        return SeverityLevel.Information;
      case 'warn':
        return SeverityLevel.Warning;
      case 'error':
        return SeverityLevel.Error;
      default:
        return SeverityLevel.Information;
    }
  }

  /**
   * Get log buffer
   */
  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Clear log buffer
   */
  clearLogBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Flush telemetry
   */
  flush(): void {
    if (this.appInsights) {
      this.appInsights.flush();
    }
  }
}

// Export singleton instance
export const productionMonitoring = new ProductionMonitoring({
  appInsightsConnectionString: process.env.APPLICATION_INSIGHTS_CONNECTION_STRING || '',
  environment: (process.env.NODE_ENV as any) || 'development',
  enableConsoleLogging: process.env.NODE_ENV !== 'production',
  enablePerformanceMonitoring: true,
  enableErrorTracking: true,
  enableUserTracking: true,
  logLevel: (process.env.LOG_LEVEL as any) || 'info',
});
