/**
 * Shared Monitoring Service Implementation
 * 
 * This service provides shared monitoring for SaaS multi-tenant deployments.
 * All metrics are tagged with organisation ID for proper isolation.
 */

import { MonitoringService, MonitoringEvent, Span } from '../../service-interfaces';
import { getCurrentOrganisationId } from '@/lib/rls';

export class SharedMonitoringService implements MonitoringService {
  private metrics: Map<string, number> = new Map();
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private gauges: Map<string, number> = new Map();
  private spans: Map<string, Span> = new Map();

  track(event: MonitoringEvent): void {
    const orgId = event.organisationId || getCurrentOrganisationId();
    const tags = {
      organisation: orgId || 'unknown',
      user: event.userId || 'unknown',
      ...event.properties,
    };

    // In a real implementation, this would send to a monitoring service like Prometheus, DataDog, etc.
    console.log(`[MONITORING] ${event.type}`, {
      organisation: tags.organisation,
      user: tags.user,
      properties: event.properties,
      timestamp: event.timestamp || new Date(),
    });

    // Store metrics locally for demonstration
    const key = `${event.type}_${tags.organisation}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
  }

  incrementCounter(name: string, tags?: Record<string, string>): void {
    const orgId = getCurrentOrganisationId();
    const key = `${name}_${orgId || 'unknown'}`;
    this.counters.set(key, (this.counters.get(key) || 0) + 1);

    // In a real implementation, this would send to a monitoring service
    console.log(`[COUNTER] ${name}`, {
      organisation: orgId || 'unknown',
      tags,
      value: this.counters.get(key),
    });
  }

  recordHistogram(name: string, value: number, tags?: Record<string, string>): void {
    const orgId = getCurrentOrganisationId();
    const key = `${name}_${orgId || 'unknown'}`;
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);

    // In a real implementation, this would send to a monitoring service
    console.log(`[HISTOGRAM] ${name}`, {
      organisation: orgId || 'unknown',
      tags,
      value,
      count: values.length,
    });
  }

  recordGauge(name: string, value: number, tags?: Record<string, string>): void {
    const orgId = getCurrentOrganisationId();
    const key = `${name}_${orgId || 'unknown'}`;
    this.gauges.set(key, value);

    // In a real implementation, this would send to a monitoring service
    console.log(`[GAUGE] ${name}`, {
      organisation: orgId || 'unknown',
      tags,
      value,
    });
  }

  createSpan(name: string, tags?: Record<string, string>): Span {
    const orgId = getCurrentOrganisationId();
    const span = new SharedSpan(name, {
      organisation: orgId || 'unknown',
      ...tags,
    });

    this.spans.set(span.id, span);
    return span;
  }

  /**
   * Get metrics for a specific organisation
   */
  getMetrics(organisationId?: string): Record<string, any> {
    const orgId = organisationId || getCurrentOrganisationId();
    const prefix = orgId ? `${orgId}_` : '';

    return {
      counters: Object.fromEntries(
        Array.from(this.counters.entries())
          .filter(([key]) => key.includes(prefix))
          .map(([key, value]) => [key.replace(prefix, ''), value])
      ),
      gauges: Object.fromEntries(
        Array.from(this.gauges.entries())
          .filter(([key]) => key.includes(prefix))
          .map(([key, value]) => [key.replace(prefix, ''), value])
      ),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries())
          .filter(([key]) => key.includes(prefix))
          .map(([key, values]) => [key.replace(prefix, ''), {
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
          }])
      ),
    };
  }
}

/**
 * Shared Span Implementation
 */
class SharedSpan implements Span {
  public id: string;
  public name: string;
  public startTime: Date;
  public endTime?: Date;
  public tags: Record<string, string>;
  public logs: Array<{ timestamp: Date; message: string; fields?: Record<string, any> }> = [];

  constructor(name: string, tags: Record<string, string>) {
    this.id = `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = name;
    this.startTime = new Date();
    this.tags = tags;
  }

  finish(): void {
    this.endTime = new Date();
    const duration = this.endTime.getTime() - this.startTime.getTime();
    
    console.log(`[SPAN] ${this.name}`, {
      id: this.id,
      duration: `${duration}ms`,
      tags: this.tags,
      logs: this.logs.length,
    });
  }

  addTag(key: string, value: string): void {
    this.tags[key] = value;
  }

  addLog(message: string, fields?: Record<string, any>): void {
    this.logs.push({
      timestamp: new Date(),
      message,
      fields,
    });
  }
}
