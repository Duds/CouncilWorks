/**
 * Application Inventory Management System
 * 
 * Implements Essential Eight compliance for Application Control
 * Provides comprehensive application whitelisting and inventory management
 */

export interface Application {
  id: string;
  name: string;
  version: string;
  vendor: string;
  category: ApplicationCategory;
  status: ApplicationStatus;
  riskLevel: RiskLevel;
  approvedBy?: string;
  approvedAt?: Date;
  lastScanAt?: Date;
  vulnerabilities: Vulnerability[];
  dependencies: Dependency[];
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedVersions: string[];
  fixedVersions: string[];
  publishedAt: Date;
  lastModifiedAt: Date;
}

export interface Dependency {
  id: string;
  name: string;
  version: string;
  type: 'PRODUCTION' | 'DEVELOPMENT' | 'PEER';
  license: string;
  vulnerabilities: Vulnerability[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  required: boolean;
  granted: boolean;
  justification?: string;
}

export enum ApplicationCategory {
  WEB_APPLICATION = 'WEB_APPLICATION',
  MOBILE_APP = 'MOBILE_APP',
  DESKTOP_APP = 'DESKTOP_APP',
  LIBRARY = 'LIBRARY',
  FRAMEWORK = 'FRAMEWORK',
  TOOL = 'TOOL',
  SERVICE = 'SERVICE',
  DATABASE = 'DATABASE',
  MIDDLEWARE = 'MIDDLEWARE',
  OTHER = 'OTHER',
}

export enum ApplicationStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEPRECATED = 'DEPRECATED',
  QUARANTINED = 'QUARANTINED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ApplicationInventory {
  applications: Application[];
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  quarantinedApplications: number;
  highRiskApplications: number;
  criticalVulnerabilities: number;
  lastUpdated: Date;
}

export class ApplicationInventoryManager {
  private applications: Map<string, Application> = new Map();
  private vulnerabilities: Map<string, Vulnerability> = new Map();
  private dependencies: Map<string, Dependency> = new Map();

  /**
   * Add application to inventory
   */
  async addApplication(application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    const id = this.generateId();
    const now = new Date();
    
    const newApplication: Application = {
      ...application,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    this.applications.set(id, newApplication);
    
    // Scan for vulnerabilities
    await this.scanApplicationVulnerabilities(id);
    
    return newApplication;
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: string, 
    status: ApplicationStatus, 
    approvedBy?: string
  ): Promise<Application | null> {
    const application = this.applications.get(applicationId);
    if (!application) return null;
    
    application.status = status;
    application.updatedAt = new Date();
    
    if (status === ApplicationStatus.APPROVED && approvedBy) {
      application.approvedBy = approvedBy;
      application.approvedAt = new Date();
    }
    
    this.applications.set(applicationId, application);
    return application;
  }

  /**
   * Scan application for vulnerabilities
   */
  async scanApplicationVulnerabilities(applicationId: string): Promise<Vulnerability[]> {
    const application = this.applications.get(applicationId);
    if (!application) return [];
    
    // Simulate vulnerability scanning
    const vulnerabilities = await this.performVulnerabilityScan(application);
    
    // Update application with scan results
    application.vulnerabilities = vulnerabilities;
    application.lastScanAt = new Date();
    application.updatedAt = new Date();
    
    // Update risk level based on vulnerabilities
    application.riskLevel = this.calculateRiskLevel(vulnerabilities);
    
    this.applications.set(applicationId, application);
    return vulnerabilities;
  }

  /**
   * Get application inventory summary
   */
  getInventory(): ApplicationInventory {
    const applications = Array.from(this.applications.values());
    
    return {
      applications,
      totalApplications: applications.length,
      approvedApplications: applications.filter(app => app.status === ApplicationStatus.APPROVED).length,
      pendingApplications: applications.filter(app => app.status === ApplicationStatus.PENDING_APPROVAL).length,
      rejectedApplications: applications.filter(app => app.status === ApplicationStatus.REJECTED).length,
      quarantinedApplications: applications.filter(app => app.status === ApplicationStatus.QUARANTINED).length,
      highRiskApplications: applications.filter(app => app.riskLevel === RiskLevel.HIGH || app.riskLevel === RiskLevel.CRITICAL).length,
      criticalVulnerabilities: applications.reduce((sum, app) => 
        sum + app.vulnerabilities.filter(vuln => vuln.severity === 'CRITICAL').length, 0),
      lastUpdated: new Date(),
    };
  }

  /**
   * Get applications by status
   */
  getApplicationsByStatus(status: ApplicationStatus): Application[] {
    return Array.from(this.applications.values())
      .filter(app => app.status === status);
  }

  /**
   * Get high-risk applications
   */
  getHighRiskApplications(): Application[] {
    return Array.from(this.applications.values())
      .filter(app => app.riskLevel === RiskLevel.HIGH || app.riskLevel === RiskLevel.CRITICAL);
  }

  /**
   * Get applications with critical vulnerabilities
   */
  getApplicationsWithCriticalVulnerabilities(): Application[] {
    return Array.from(this.applications.values())
      .filter(app => app.vulnerabilities.some(vuln => vuln.severity === 'CRITICAL'));
  }

  /**
   * Perform vulnerability scan (simulated)
   */
  private async performVulnerabilityScan(application: Application): Promise<Vulnerability[]> {
    // In a real implementation, this would integrate with:
    // - NPM audit for Node.js packages
    // - OWASP Dependency Check
    // - Snyk vulnerability database
    // - CVE databases
    
    const vulnerabilities: Vulnerability[] = [];
    
    // Simulate finding vulnerabilities based on application type
    if (application.category === ApplicationCategory.WEB_APPLICATION) {
      // Simulate common web application vulnerabilities
      vulnerabilities.push({
        id: this.generateId(),
        cveId: 'CVE-2024-0001',
        severity: 'HIGH',
        description: 'Cross-Site Scripting (XSS) vulnerability',
        affectedVersions: ['1.0.0', '1.1.0'],
        fixedVersions: ['1.2.0'],
        publishedAt: new Date('2024-01-15'),
        lastModifiedAt: new Date('2024-01-15'),
      });
    }
    
    if (application.category === ApplicationCategory.LIBRARY) {
      // Simulate library vulnerabilities
      vulnerabilities.push({
        id: this.generateId(),
        cveId: 'CVE-2024-0002',
        severity: 'MEDIUM',
        description: 'Prototype pollution vulnerability',
        affectedVersions: ['2.0.0', '2.1.0'],
        fixedVersions: ['2.2.0'],
        publishedAt: new Date('2024-01-20'),
        lastModifiedAt: new Date('2024-01-20'),
      });
    }
    
    return vulnerabilities;
  }

  /**
   * Calculate risk level based on vulnerabilities
   */
  private calculateRiskLevel(vulnerabilities: Vulnerability[]): RiskLevel {
    if (vulnerabilities.some(vuln => vuln.severity === 'CRITICAL')) {
      return RiskLevel.CRITICAL;
    }
    
    if (vulnerabilities.some(vuln => vuln.severity === 'HIGH')) {
      return RiskLevel.HIGH;
    }
    
    if (vulnerabilities.some(vuln => vuln.severity === 'MEDIUM')) {
      return RiskLevel.MEDIUM;
    }
    
    return RiskLevel.LOW;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * Application Whitelist Manager
 * 
 * Manages application whitelisting for Essential Eight compliance
 */
export class ApplicationWhitelistManager {
  private whitelist: Set<string> = new Set();
  private blacklist: Set<string> = new Set();
  private inventoryManager: ApplicationInventoryManager;

  constructor(inventoryManager: ApplicationInventoryManager) {
    this.inventoryManager = inventoryManager;
  }

  /**
   * Add application to whitelist
   */
  async whitelistApplication(applicationId: string, approvedBy: string): Promise<boolean> {
    const application = this.inventoryManager.getApplicationsByStatus(ApplicationStatus.APPROVED)
      .find(app => app.id === applicationId);
    
    if (!application) {
      throw new Error('Application not found or not approved');
    }
    
    this.whitelist.add(applicationId);
    this.blacklist.delete(applicationId);
    
    return true;
  }

  /**
   * Add application to blacklist
   */
  async blacklistApplication(applicationId: string, reason: string): Promise<boolean> {
    this.blacklist.add(applicationId);
    this.whitelist.delete(applicationId);
    
    return true;
  }

  /**
   * Check if application is whitelisted
   */
  isWhitelisted(applicationId: string): boolean {
    return this.whitelist.has(applicationId);
  }

  /**
   * Check if application is blacklisted
   */
  isBlacklisted(applicationId: string): boolean {
    return this.blacklist.has(applicationId);
  }

  /**
   * Get whitelist status
   */
  getWhitelistStatus(): { whitelisted: string[]; blacklisted: string[] } {
    return {
      whitelisted: Array.from(this.whitelist),
      blacklisted: Array.from(this.blacklist),
    };
  }
}
