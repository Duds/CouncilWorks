/**
 * Snap Send Solve API Integration Service
 * Handles integration with Snap Send Solve for external citizen reports
 */

export interface SnapSendSolveReport {
  id: string;
  externalId: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'acknowledged' | 'in-progress' | 'completed' | 'closed';
  submittedAt: string;
  location: {
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    lat: number;
    lng: number;
  };
  reporter: {
    name: string;
    email: string;
    phone?: string;
    isAnonymous: boolean;
  };
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
  snapSendSolveData: {
    reportId: string;
    apiVersion: string;
    source: 'snap-send-solve';
    webhookReceivedAt: string;
  };
}

export interface SnapSendSolveWebhookPayload {
  event: 'report.created' | 'report.updated' | 'report.status_changed';
  data: {
    id: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
    location: {
      address: string;
      suburb: string;
      state: string;
      postcode: string;
      latitude: number;
      longitude: number;
    };
    reporter: {
      name: string;
      email: string;
      phone?: string;
      anonymous: boolean;
    };
    attachments?: Array<{
      id: string;
      filename: string;
      content_type: string;
      url: string;
      size_bytes: number;
    }>;
  };
}

export interface SnapSendSolveConfig {
  apiKey: string;
  webhookSecret: string;
  baseUrl: string;
  organizationId: string;
}

/**
 * Snap Send Solve API Service
 * Handles integration with Snap Send Solve external reporting platform
 */
export class SnapSendSolveService {
  private config: SnapSendSolveConfig;

  constructor(config: SnapSendSolveConfig) {
    this.config = config;
  }

  /**
   * Process incoming webhook from Snap Send Solve
   */
  async processWebhook(payload: SnapSendSolveWebhookPayload): Promise<SnapSendSolveReport> {
    try {
      // Validate webhook signature
      await this.validateWebhookSignature(payload);

      // Transform Snap Send Solve data to internal format
      const report = this.transformToInternalFormat(payload);

      // Store in database
      await this.storeReport(report);

      // Send acknowledgment email to reporter
      if (!report.reporter.isAnonymous) {
        await this.sendAcknowledgmentEmail(report);
      }

      // Notify relevant staff
      await this.notifyStaff(report);

      return report;
    } catch (error) {
      console.error('Failed to process Snap Send Solve webhook:', error);
      throw error;
    }
  }

  /**
   * Transform Snap Send Solve data to internal report format
   */
  private transformToInternalFormat(payload: SnapSendSolveWebhookPayload): SnapSendSolveReport {
    const { data } = payload;

    return {
      id: `snap-${data.id}`,
      externalId: data.id,
      title: data.title,
      description: data.description,
      category: this.mapCategory(data.category, data.subcategory),
      subcategory: data.subcategory,
      priority: this.mapPriority(data.priority),
      status: this.mapStatus(data.status),
      submittedAt: data.created_at,
      location: {
        address: data.location.address,
        suburb: data.location.suburb,
        state: data.location.state,
        postcode: data.location.postcode,
        lat: data.location.latitude,
        lng: data.location.longitude,
      },
      reporter: {
        name: data.reporter.name,
        email: data.reporter.email,
        phone: data.reporter.phone,
        isAnonymous: data.reporter.anonymous,
      },
      attachments: (data.attachments || []).map(att => ({
        id: att.id,
        name: att.filename,
        type: att.content_type,
        url: att.url,
        size: att.size_bytes,
      })),
      snapSendSolveData: {
        reportId: data.id,
        apiVersion: '1.0',
        source: 'snap-send-solve',
        webhookReceivedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Map Snap Send Solve categories to internal categories
   */
  private mapCategory(category: string, subcategory?: string): string {
    const categoryMap: Record<string, string> = {
      'roads': 'road-maintenance',
      'street-lighting': 'street-lighting',
      'parks': 'parks-recreation',
      'waste': 'waste-management',
      'water': 'water-sewer',
      'buildings': 'building-maintenance',
      'safety': 'safety-hazard',
      'noise': 'noise-complaint',
      'environment': 'environmental',
    };

    return categoryMap[category.toLowerCase()] || 'other';
  }

  /**
   * Map Snap Send Solve priority to internal priority
   */
  private mapPriority(priority: string): 'low' | 'medium' | 'high' | 'urgent' {
    const priorityMap: Record<string, 'low' | 'medium' | 'high' | 'urgent'> = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'urgent': 'urgent',
      'critical': 'urgent',
    };

    return priorityMap[priority.toLowerCase()] || 'medium';
  }

  /**
   * Map Snap Send Solve status to internal status
   */
  private mapStatus(status: string): 'new' | 'acknowledged' | 'in-progress' | 'completed' | 'closed' {
    const statusMap: Record<string, 'new' | 'acknowledged' | 'in-progress' | 'completed' | 'closed'> = {
      'new': 'new',
      'submitted': 'new',
      'acknowledged': 'acknowledged',
      'in-progress': 'in-progress',
      'investigating': 'in-progress',
      'completed': 'completed',
      'resolved': 'completed',
      'closed': 'closed',
    };

    return statusMap[status.toLowerCase()] || 'new';
  }

  /**
   * Validate webhook signature for security
   */
  private async validateWebhookSignature(payload: SnapSendSolveWebhookPayload): Promise<void> {
    // In a real implementation, this would validate the webhook signature
    // using HMAC-SHA256 with the webhook secret
    console.log('Validating Snap Send Solve webhook signature...');
  }

  /**
   * Store report in database
   */
  private async storeReport(report: SnapSendSolveReport): Promise<void> {
    // In a real implementation, this would store the report in the database
    console.log('Storing Snap Send Solve report:', report.id);
  }

  /**
   * Send acknowledgment email to reporter
   */
  private async sendAcknowledgmentEmail(report: SnapSendSolveReport): Promise<void> {
    // In a real implementation, this would send an email notification
    console.log('Sending acknowledgment email to:', report.reporter.email);
  }

  /**
   * Notify relevant staff about new report
   */
  private async notifyStaff(report: SnapSendSolveReport): Promise<void> {
    // In a real implementation, this would notify relevant staff members
    console.log('Notifying staff about new Snap Send Solve report:', report.id);
  }

  /**
   * Update report status in Snap Send Solve
   */
  async updateReportStatus(externalId: string, status: string, note?: string): Promise<void> {
    try {
      // In a real implementation, this would make an API call to Snap Send Solve
      console.log(`Updating Snap Send Solve report ${externalId} to status: ${status}`);
      
      if (note) {
        console.log(`Adding note: ${note}`);
      }
    } catch (error) {
      console.error('Failed to update Snap Send Solve report status:', error);
      throw error;
    }
  }

  /**
   * Sync report status with Snap Send Solve
   */
  async syncReportStatus(reportId: string): Promise<void> {
    try {
      // In a real implementation, this would sync the report status
      console.log(`Syncing report status for Snap Send Solve report: ${reportId}`);
    } catch (error) {
      console.error('Failed to sync report status:', error);
      throw error;
    }
  }
}

/**
 * Create Snap Send Solve service instance
 */
export function createSnapSendSolveService(): SnapSendSolveService {
  const config: SnapSendSolveConfig = {
    apiKey: process.env.SNAP_SEND_SOLVE_API_KEY || '',
    webhookSecret: process.env.SNAP_SEND_SOLVE_WEBHOOK_SECRET || '',
    baseUrl: process.env.SNAP_SEND_SOLVE_BASE_URL || 'https://api.snapsendsolve.com.au',
    organizationId: process.env.SNAP_SEND_SOLVE_ORG_ID || '',
  };

  return new SnapSendSolveService(config);
}
