/**
 * Service Factory Implementation
 * 
 * This module provides concrete implementations of the service interfaces
 * based on the deployment configuration.
 */

import { getConfig, DeploymentConfig } from '@/lib/config/deployment-config';
import {
  ServiceFactory,
  DatabaseService,
  AuthService,
  StorageService,
  AnalyticsService,
  NotificationService,
  IntegrationService,
  MonitoringService,
  DatabaseConfig,
  AuthConfig,
  StorageConfig,
  AnalyticsConfig,
} from './service-interfaces';

// Import concrete implementations
import { PrismaDatabaseService } from './implementations/database/prisma-database-service';
import { NextAuthService } from './implementations/auth/nextauth-service';
import { AzureBlobStorageService } from './implementations/storage/azure-blob-storage-service';
import { LocalFileStorageService } from './implementations/storage/local-file-storage-service';
import { SharedAnalyticsService } from './implementations/analytics/shared-analytics-service';
import { IsolatedAnalyticsService } from './implementations/analytics/isolated-analytics-service';
import { LocalAnalyticsService } from './implementations/analytics/local-analytics-service';
import { EmailNotificationService } from './implementations/notifications/email-notification-service';
import { SMSNotificationService } from './implementations/notifications/sms-notification-service';
import { WebhookIntegrationService } from './implementations/integrations/webhook-integration-service';
import { SharedMonitoringService } from './implementations/monitoring/shared-monitoring-service';
import { IsolatedMonitoringService } from './implementations/monitoring/isolated-monitoring-service';
import { LocalMonitoringService } from './implementations/monitoring/local-monitoring-service';

/**
 * Concrete implementation of ServiceFactory
 */
export class ConcreteServiceFactory implements ServiceFactory {
  private config: DeploymentConfig;

  constructor(config?: DeploymentConfig) {
    this.config = config || getConfig();
  }

  /**
   * Create database service based on configuration
   */
  createDatabaseService(config: DatabaseConfig): DatabaseService {
    return new PrismaDatabaseService(config);
  }

  /**
   * Create authentication service based on configuration
   */
  createAuthService(config: AuthConfig): AuthService {
    return new NextAuthService(config);
  }

  /**
   * Create storage service based on configuration
   */
  createStorageService(config: StorageConfig): StorageService {
    switch (config.type) {
      case 'azure-blob':
        return new AzureBlobStorageService(config);
      case 'azure-blob-isolated':
        return new AzureBlobStorageService(config, true);
      case 'local-file':
        return new LocalFileStorageService(config);
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }

  /**
   * Create analytics service based on configuration
   */
  createAnalyticsService(config: AnalyticsConfig): AnalyticsService {
    switch (config.type) {
      case 'shared':
        return new SharedAnalyticsService(config);
      case 'isolated':
        return new IsolatedAnalyticsService(config);
      case 'local':
        return new LocalAnalyticsService(config);
      case 'disabled':
        return new DisabledAnalyticsService();
      default:
        throw new Error(`Unsupported analytics type: ${config.type}`);
    }
  }

  /**
   * Create notification service
   */
  createNotificationService(): NotificationService {
    // Composite service that handles multiple notification types
    return new CompositeNotificationService([
      new EmailNotificationService(),
      new SMSNotificationService(),
    ]);
  }

  /**
   * Create integration service
   */
  createIntegrationService(): IntegrationService {
    return new WebhookIntegrationService();
  }

  /**
   * Create monitoring service based on deployment tier
   */
  createMonitoringService(): MonitoringService {
    switch (this.config.tier) {
      case 'saas':
        return new SharedMonitoringService();
      case 'single-tenant':
      case 'hybrid':
        return new IsolatedMonitoringService(this.config.customerId);
      case 'on-premise':
        return new LocalMonitoringService();
      default:
        throw new Error(`Unsupported deployment tier: ${this.config.tier}`);
    }
  }
}

/**
 * Composite notification service that handles multiple notification types
 */
class CompositeNotificationService implements NotificationService {
  constructor(private services: NotificationService[]) {}

  async sendEmail(to: string, subject: string, body: string, options?: any): Promise<void> {
    const emailService = this.services.find(s => s.constructor.name === 'EmailNotificationService');
    if (emailService) {
      await emailService.sendEmail(to, subject, body, options);
    }
  }

  async sendSMS(to: string, message: string, options?: any): Promise<void> {
    const smsService = this.services.find(s => s.constructor.name === 'SMSNotificationService');
    if (smsService) {
      await smsService.sendSMS(to, message, options);
    }
  }

  async sendPush(userId: string, title: string, body: string, data?: Record<string, any>): Promise<void> {
    // Push notifications not implemented yet
    console.log(`Push notification to ${userId}: ${title} - ${body}`);
  }

  async scheduleNotification(notification: any): Promise<void> {
    // Scheduled notifications not implemented yet
    console.log('Scheduled notification:', notification);
  }

  async cancelNotification(notificationId: string): Promise<void> {
    // Cancel notifications not implemented yet
    console.log('Cancel notification:', notificationId);
  }
}

/**
 * Disabled analytics service for air-gapped deployments
 */
class DisabledAnalyticsService implements AnalyticsService {
  async track(event: any): Promise<void> {
    // Analytics disabled in air-gapped mode
  }

  async query(metrics: any): Promise<any> {
    return { data: [], total: 0 };
  }

  async export(data: any): Promise<any> {
    throw new Error('Analytics export disabled in air-gapped mode');
  }

  async getDashboardData(filters: any): Promise<any> {
    return { metrics: {}, charts: [], tables: [] };
  }
}

/**
 * Global service factory instance
 */
let serviceFactory: ServiceFactory | null = null;

/**
 * Get the global service factory instance
 */
export function getServiceFactory(): ServiceFactory {
  if (!serviceFactory) {
    serviceFactory = new ConcreteServiceFactory();
  }
  return serviceFactory;
}

/**
 * Set the service factory (for testing)
 */
export function setServiceFactory(factory: ServiceFactory): void {
  serviceFactory = factory;
}

/**
 * Reset the service factory (for testing)
 */
export function resetServiceFactory(): void {
  serviceFactory = null;
}

/**
 * Convenience functions for getting services
 */
export function getDatabaseService(): DatabaseService {
  const factory = getServiceFactory();
  const config = getConfig();
  return factory.createDatabaseService(config.database);
}

export function getAuthService(): AuthService {
  const factory = getServiceFactory();
  const config = getConfig();
  return factory.createAuthService(config.auth);
}

export function getStorageService(): StorageService {
  const factory = getServiceFactory();
  const config = getConfig();
  return factory.createStorageService(config.storage);
}

export function getAnalyticsService(): AnalyticsService {
  const factory = getServiceFactory();
  const config = getConfig();
  return factory.createAnalyticsService(config.analytics);
}

export function getNotificationService(): NotificationService {
  const factory = getServiceFactory();
  return factory.createNotificationService();
}

export function getIntegrationService(): IntegrationService {
  const factory = getServiceFactory();
  return factory.createIntegrationService();
}

export function getMonitoringService(): MonitoringService {
  const factory = getServiceFactory();
  return factory.createMonitoringService();
}
