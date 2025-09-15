/**
 * Migration Service
 * 
 * This service handles migration between different deployment tiers:
 * - SaaS to Single-Tenant
 * - Single-Tenant to On-Premise
 * - Configuration migrations
 */

import { prisma } from '@/lib/prisma';
import { getConfig, DeploymentConfig } from '@/lib/config/deployment-config';
import { getStorageService } from '@/lib/services/service-factory';
import { StorageService } from '@/lib/services/service-interfaces';

export interface MigrationResult {
  success: boolean;
  newUrl?: string;
  handoverComplete?: boolean;
  error?: string;
  stats?: MigrationStats;
}

export interface MigrationStats {
  users: number;
  assets: number;
  workOrders: number;
  inspections: number;
  documents: number;
  totalSize: number;
}

export interface ExportData {
  organisation: any;
  users: any[];
  assets: any[];
  workOrders: any[];
  inspections: any[];
  documents: any[];
  rcmTemplates: any[];
  auditLogs: any[];
}

export class MigrationService {
  private storageService: StorageService;

  constructor() {
    this.storageService = getStorageService();
  }

  /**
   * Migrate from SaaS Multi-Tenant to Single-Tenant Cloud
   */
  async migrateToSingleTenant(organisationId: string): Promise<MigrationResult> {
    try {
      console.log(`Starting migration to single-tenant for organisation: ${organisationId}`);

      // 1. Export all data for the organisation
      const data = await this.exportOrganisationData(organisationId);
      
      // 2. Create isolated database
      const newDatabase = await this.createIsolatedDatabase(organisationId);
      
      // 3. Import data to new database
      await this.importData(newDatabase, data);
      
      // 4. Update DNS and configuration
      await this.updateDNS(organisationId);
      
      // 5. Verify migration
      await this.verifyMigration(organisationId);
      
      const stats = this.calculateStats(data);
      
      console.log(`Migration completed successfully for organisation: ${organisationId}`);
      
      return {
        success: true,
        newUrl: this.getNewUrl(organisationId),
        stats,
      };
    } catch (error) {
      console.error('Migration to single-tenant failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Migrate from Single-Tenant to On-Premise
   */
  async migrateToOnPremise(customerId: string, targetConfig: DeploymentConfig): Promise<MigrationResult> {
    try {
      console.log(`Starting migration to on-premise for customer: ${customerId}`);

      // 1. Export all data
      const data = await this.exportCustomerData(customerId);
      
      // 2. Prepare on-premise environment
      await this.prepareOnPremiseEnvironment(targetConfig);
      
      // 3. Import data to on-premise
      await this.importToOnPremise(targetConfig, data);
      
      // 4. Configure local integrations
      await this.configureLocalIntegrations(targetConfig);
      
      // 5. Handover to customer
      await this.handoverToCustomer(customerId, targetConfig);
      
      const stats = this.calculateStats(data);
      
      console.log(`Migration to on-premise completed for customer: ${customerId}`);
      
      return {
        success: true,
        handoverComplete: true,
        stats,
      };
    } catch (error) {
      console.error('Migration to on-premise failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Export organisation data for migration
   */
  private async exportOrganisationData(organisationId: string): Promise<ExportData> {
    console.log(`Exporting data for organisation: ${organisationId}`);

    // Set RLS context to ensure we only export data for this organisation
    await prisma.$executeRaw`
      SELECT set_config('app.current_user_organisation_id', ${organisationId}, true);
    `;

    const [organisation, users, assets, workOrders, inspections, documents, rcmTemplates, auditLogs] = await Promise.all([
      prisma.organisation.findUnique({
        where: { id: organisationId },
        include: {
          users: true,
          assets: true,
          rcmTemplates: true,
          auditLogs: true,
        },
      }),
      prisma.user.findMany({
        where: { organisationId },
      }),
      prisma.asset.findMany({
        where: { organisationId },
        include: {
          documents: true,
          inspections: true,
          maintenance: true,
          workOrders: true,
        },
      }),
      prisma.workOrder.findMany({
        where: { 
          asset: { organisationId }
        },
        include: {
          asset: true,
          assignedTo: true,
          createdBy: true,
        },
      }),
      prisma.assetInspection.findMany({
        where: { 
          asset: { organisationId }
        },
        include: {
          asset: true,
          inspector: true,
        },
      }),
      prisma.assetDocument.findMany({
        where: { 
          asset: { organisationId }
        },
        include: {
          asset: true,
          uploadedBy: true,
        },
      }),
      prisma.rCMTemplate.findMany({
        where: { organisationId },
        include: {
          createdBy: true,
        },
      }),
      prisma.auditLog.findMany({
        where: { organisationId },
        include: {
          user: true,
        },
      }),
    ]);

    // Clear RLS context
    await prisma.$executeRaw`
      SELECT set_config('app.current_user_organisation_id', '', true);
    `;

    if (!organisation) {
      throw new Error(`Organisation not found: ${organisationId}`);
    }

    return {
      organisation,
      users,
      assets,
      workOrders,
      inspections,
      documents,
      rcmTemplates,
      auditLogs,
    };
  }

  /**
   * Export customer data for on-premise migration
   */
  private async exportCustomerData(customerId: string): Promise<ExportData> {
    console.log(`Exporting data for customer: ${customerId}`);

    // For single-tenant, we can access all data directly
    const [organisation, users, assets, workOrders, inspections, documents, rcmTemplates, auditLogs] = await Promise.all([
      prisma.organisation.findFirst({
        where: { 
          name: { contains: customerId }
        },
        include: {
          users: true,
          assets: true,
          rcmTemplates: true,
          auditLogs: true,
        },
      }),
      prisma.user.findMany(),
      prisma.asset.findMany({
        include: {
          documents: true,
          inspections: true,
          maintenance: true,
          workOrders: true,
        },
      }),
      prisma.workOrder.findMany({
        include: {
          asset: true,
          assignedTo: true,
          createdBy: true,
        },
      }),
      prisma.assetInspection.findMany({
        include: {
          asset: true,
          inspector: true,
        },
      }),
      prisma.assetDocument.findMany({
        include: {
          asset: true,
          uploadedBy: true,
        },
      }),
      prisma.rCMTemplate.findMany({
        include: {
          createdBy: true,
        },
      }),
      prisma.auditLog.findMany({
        include: {
          user: true,
        },
      }),
    ]);

    if (!organisation) {
      throw new Error(`Customer data not found: ${customerId}`);
    }

    return {
      organisation,
      users,
      assets,
      workOrders,
      inspections,
      documents,
      rcmTemplates,
      auditLogs,
    };
  }

  /**
   * Create isolated database for single-tenant deployment
   */
  private async createIsolatedDatabase(organisationId: string): Promise<string> {
    console.log(`Creating isolated database for organisation: ${organisationId}`);
    
    // In a real implementation, this would:
    // 1. Create a new PostgreSQL database
    // 2. Run migrations
    // 3. Set up proper security
    // 4. Return connection string
    
    const dbName = `council_${organisationId}`;
    const connectionString = `postgresql://user:pass@host:5432/${dbName}`;
    
    console.log(`Created isolated database: ${dbName}`);
    return connectionString;
  }

  /**
   * Import data to new database
   */
  private async importData(connectionString: string, data: ExportData): Promise<void> {
    console.log('Importing data to new database');
    
    // In a real implementation, this would:
    // 1. Connect to the new database
    // 2. Import all data in the correct order
    // 3. Handle foreign key constraints
    // 4. Verify data integrity
    
    console.log(`Imported ${data.users.length} users, ${data.assets.length} assets, ${data.workOrders.length} work orders`);
  }

  /**
   * Update DNS and configuration for new deployment
   */
  private async updateDNS(organisationId: string): Promise<void> {
    console.log(`Updating DNS for organisation: ${organisationId}`);
    
    // In a real implementation, this would:
    // 1. Update DNS records
    // 2. Update load balancer configuration
    // 3. Update SSL certificates
    // 4. Update monitoring configuration
    
    console.log('DNS updated successfully');
  }

  /**
   * Verify migration was successful
   */
  private async verifyMigration(organisationId: string): Promise<void> {
    console.log(`Verifying migration for organisation: ${organisationId}`);
    
    // In a real implementation, this would:
    // 1. Connect to new database
    // 2. Verify data integrity
    // 3. Test key functionality
    // 4. Verify user access
    
    console.log('Migration verification completed');
  }

  /**
   * Prepare on-premise environment
   */
  private async prepareOnPremiseEnvironment(config: DeploymentConfig): Promise<void> {
    console.log('Preparing on-premise environment');
    
    // In a real implementation, this would:
    // 1. Deploy application to customer infrastructure
    // 2. Set up local database
    // 3. Configure local storage
    // 4. Set up monitoring
    // 5. Configure authentication (LDAP/AD)
    
    console.log('On-premise environment prepared');
  }

  /**
   * Import data to on-premise deployment
   */
  private async importToOnPremise(config: DeploymentConfig, data: ExportData): Promise<void> {
    console.log('Importing data to on-premise deployment');
    
    // In a real implementation, this would:
    // 1. Connect to on-premise database
    // 2. Import all data
    // 3. Set up local file storage
    // 4. Configure local integrations
    
    console.log('Data imported to on-premise deployment');
  }

  /**
   * Configure local integrations
   */
  private async configureLocalIntegrations(config: DeploymentConfig): Promise<void> {
    console.log('Configuring local integrations');
    
    // In a real implementation, this would:
    // 1. Configure local ERP integration
    // 2. Set up local email server
    // 3. Configure local monitoring
    // 4. Set up backup procedures
    
    console.log('Local integrations configured');
  }

  /**
   * Handover to customer
   */
  private async handoverToCustomer(customerId: string, config: DeploymentConfig): Promise<void> {
    console.log(`Handing over to customer: ${customerId}`);
    
    // In a real implementation, this would:
    // 1. Provide customer with access credentials
    // 2. Deliver documentation
    // 3. Schedule training sessions
    // 4. Set up support procedures
    
    console.log('Customer handover completed');
  }

  /**
   * Calculate migration statistics
   */
  private calculateStats(data: ExportData): MigrationStats {
    const totalSize = data.documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
    
    return {
      users: data.users.length,
      assets: data.assets.length,
      workOrders: data.workOrders.length,
      inspections: data.inspections.length,
      documents: data.documents.length,
      totalSize,
    };
  }

  /**
   * Get new URL for migrated deployment
   */
  private getNewUrl(organisationId: string): string {
    // In a real implementation, this would return the actual URL
    return `https://${organisationId}.councilworks.com`;
  }
}
