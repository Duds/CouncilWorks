/**
 * Sector-Neutral Language Management
 * 
 * Implements comprehensive language refactoring from council-specific to industry-neutral terminology
 * 
 * @fileoverview Sector-neutral language management system
 */

export interface LanguageMapping {
  councilTerm: string;
  neutralTerm: string;
  description: string;
  category: 'asset' | 'process' | 'role' | 'location' | 'system' | 'workflow';
  sectors: string[];
  context: string;
}

export interface SectorConfiguration {
  id: string;
  name: string;
  displayName: string;
  description: string;
  terminology: LanguageMapping[];
  assetTypes: AssetTypeMapping[];
  workflows: WorkflowMapping[];
  compliance: ComplianceMapping[];
  enabled: boolean;
}

export interface AssetTypeMapping {
  councilType: string;
  neutralType: string;
  category: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface WorkflowMapping {
  councilWorkflow: string;
  neutralWorkflow: string;
  description: string;
  steps: string[];
  roles: string[];
}

export interface ComplianceMapping {
  councilStandard: string;
  neutralStandard: string;
  description: string;
  requirements: string[];
}

export interface LanguageContext {
  sector: string;
  userRole: string;
  context: 'ui' | 'api' | 'documentation' | 'reports' | 'notifications';
  language: 'en-AU' | 'en-US' | 'en-GB';
}

export class SectorNeutralLanguageManager {
  private languageMappings: LanguageMapping[] = [];
  private sectorConfigurations: SectorConfiguration[] = [];
  private currentSector: string = 'general';

  constructor() {
    this.initializeLanguageMappings();
    this.initializeSectorConfigurations();
  }

  /**
   * Initialize language mappings
   */
  private initializeLanguageMappings(): void {
    this.languageMappings = [
      // Asset-related terms
      {
        councilTerm: 'Council Asset',
        neutralTerm: 'Organizational Asset',
        description: 'Assets owned and managed by the organization',
        category: 'asset',
        sectors: ['government', 'utilities', 'transport', 'healthcare', 'education'],
        context: 'General asset management terminology',
      },
      {
        councilTerm: 'Depot',
        neutralTerm: 'Facility',
        description: 'Physical location where assets are stored or maintained',
        category: 'location',
        sectors: ['government', 'utilities', 'transport', 'logistics'],
        context: 'Asset storage and maintenance locations',
      },
      {
        councilTerm: 'Works Depot',
        neutralTerm: 'Maintenance Facility',
        description: 'Facility dedicated to asset maintenance and repair',
        category: 'location',
        sectors: ['government', 'utilities', 'transport', 'manufacturing'],
        context: 'Maintenance and repair operations',
      },
      {
        councilTerm: 'Plant & Equipment',
        neutralTerm: 'Machinery & Equipment',
        description: 'Mechanical and electrical equipment used in operations',
        category: 'asset',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'construction'],
        context: 'Equipment and machinery management',
      },
      {
        councilTerm: 'Fleet Vehicle',
        neutralTerm: 'Service Vehicle',
        description: 'Vehicles used for operational purposes',
        category: 'asset',
        sectors: ['government', 'utilities', 'transport', 'logistics', 'healthcare'],
        context: 'Vehicle fleet management',
      },
      {
        councilTerm: 'Infrastructure Asset',
        neutralTerm: 'Infrastructure Asset',
        description: 'Physical infrastructure such as roads, bridges, buildings',
        category: 'asset',
        sectors: ['government', 'utilities', 'transport', 'construction'],
        context: 'Infrastructure management',
      },

      // Process-related terms
      {
        councilTerm: 'Council Works',
        neutralTerm: 'Operations',
        description: 'Operational activities and services',
        category: 'process',
        sectors: ['government', 'utilities', 'transport', 'healthcare'],
        context: 'Operational processes and activities',
      },
      {
        councilTerm: 'Maintenance Schedule',
        neutralTerm: 'Maintenance Schedule',
        description: 'Planned maintenance activities and timing',
        category: 'process',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Maintenance planning and scheduling',
      },
      {
        councilTerm: 'Work Order',
        neutralTerm: 'Work Order',
        description: 'Documented request for maintenance or repair work',
        category: 'process',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Work request and execution',
      },
      {
        councilTerm: 'Asset Register',
        neutralTerm: 'Asset Register',
        description: 'Comprehensive record of all organizational assets',
        category: 'system',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Asset inventory and tracking',
      },

      // Role-related terms
      {
        councilTerm: 'Council Employee',
        neutralTerm: 'Employee',
        description: 'Person employed by the organization',
        category: 'role',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Human resources and personnel management',
      },
      {
        councilTerm: 'Works Supervisor',
        neutralTerm: 'Operations Supervisor',
        description: 'Person responsible for supervising operational activities',
        category: 'role',
        sectors: ['government', 'utilities', 'transport', 'manufacturing'],
        context: 'Supervisory roles and responsibilities',
      },
      {
        councilTerm: 'Council Manager',
        neutralTerm: 'Operations Manager',
        description: 'Person responsible for managing operational activities',
        category: 'role',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Management roles and responsibilities',
      },
      {
        councilTerm: 'Field Worker',
        neutralTerm: 'Field Technician',
        description: 'Person who performs work in the field',
        category: 'role',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Field operations and technical work',
      },

      // System-related terms
      {
        councilTerm: 'Council System',
        neutralTerm: 'Organizational System',
        description: 'System used by the organization',
        category: 'system',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'System and technology management',
      },
      {
        councilTerm: 'Council Database',
        neutralTerm: 'Organizational Database',
        description: 'Database containing organizational data',
        category: 'system',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Data management and storage',
      },

      // Workflow-related terms
      {
        councilTerm: 'Council Process',
        neutralTerm: 'Organizational Process',
        description: 'Process used by the organization',
        category: 'workflow',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Process management and optimization',
      },
      {
        councilTerm: 'Council Policy',
        neutralTerm: 'Organizational Policy',
        description: 'Policy established by the organization',
        category: 'workflow',
        sectors: ['government', 'utilities', 'transport', 'manufacturing', 'healthcare'],
        context: 'Policy management and compliance',
      },
    ];
  }

  /**
   * Initialize sector configurations
   */
  private initializeSectorConfigurations(): void {
    this.sectorConfigurations = [
      {
        id: 'government',
        name: 'government',
        displayName: 'Government & Public Sector',
        description: 'Configuration for government and public sector organizations',
        terminology: this.languageMappings.filter(m => m.sectors.includes('government')),
        assetTypes: [
          {
            councilType: 'Road Infrastructure',
            neutralType: 'Transportation Infrastructure',
            category: 'infrastructure',
            description: 'Roads, bridges, and transportation infrastructure',
            icon: 'road',
            color: '#3B82F6',
          },
          {
            councilType: 'Parks & Recreation',
            neutralType: 'Recreational Facilities',
            category: 'facility',
            description: 'Parks, playgrounds, and recreational facilities',
            icon: 'tree-pine',
            color: '#10B981',
          },
          {
            councilType: 'Waste Management',
            neutralType: 'Waste Management',
            category: 'equipment',
            description: 'Waste collection and management equipment',
            icon: 'trash-2',
            color: '#6B7280',
          },
        ],
        workflows: [
          {
            councilWorkflow: 'Road Maintenance',
            neutralWorkflow: 'Infrastructure Maintenance',
            description: 'Maintenance of transportation infrastructure',
            steps: ['Inspection', 'Assessment', 'Planning', 'Execution', 'Verification'],
            roles: ['Inspector', 'Planner', 'Supervisor', 'Technician'],
          },
          {
            councilWorkflow: 'Asset Disposal',
            neutralWorkflow: 'Asset Disposal',
            description: 'Process for disposing of end-of-life assets',
            steps: ['Assessment', 'Approval', 'Disposal', 'Documentation'],
            roles: ['Manager', 'Supervisor', 'Technician'],
          },
        ],
        compliance: [
          {
            councilStandard: 'Local Government Act',
            neutralStandard: 'Government Regulations',
            description: 'Regulatory requirements for government operations',
            requirements: ['Asset Management', 'Financial Reporting', 'Public Safety'],
          },
        ],
        enabled: true,
      },
      {
        id: 'utilities',
        name: 'utilities',
        displayName: 'Utilities & Infrastructure',
        description: 'Configuration for utility companies and infrastructure providers',
        terminology: this.languageMappings.filter(m => m.sectors.includes('utilities')),
        assetTypes: [
          {
            councilType: 'Water Infrastructure',
            neutralType: 'Water Infrastructure',
            category: 'infrastructure',
            description: 'Water treatment, distribution, and storage systems',
            icon: 'droplets',
            color: '#0EA5E9',
          },
          {
            councilType: 'Electrical Infrastructure',
            neutralType: 'Electrical Infrastructure',
            category: 'infrastructure',
            description: 'Power generation, transmission, and distribution systems',
            icon: 'zap',
            color: '#F59E0B',
          },
          {
            councilType: 'Gas Infrastructure',
            neutralType: 'Gas Infrastructure',
            category: 'infrastructure',
            description: 'Gas distribution and storage systems',
            icon: 'flame',
            color: '#EF4444',
          },
        ],
        workflows: [
          {
            councilWorkflow: 'Utility Maintenance',
            neutralWorkflow: 'Infrastructure Maintenance',
            description: 'Maintenance of utility infrastructure',
            steps: ['Monitoring', 'Inspection', 'Maintenance', 'Testing'],
            roles: ['Engineer', 'Technician', 'Supervisor'],
          },
        ],
        compliance: [
          {
            councilStandard: 'Utility Regulations',
            neutralStandard: 'Utility Regulations',
            description: 'Regulatory requirements for utility operations',
            requirements: ['Safety Standards', 'Environmental Compliance', 'Service Reliability'],
          },
        ],
        enabled: true,
      },
      {
        id: 'transport',
        name: 'transport',
        displayName: 'Transportation & Logistics',
        description: 'Configuration for transportation and logistics companies',
        terminology: this.languageMappings.filter(m => m.sectors.includes('transport')),
        assetTypes: [
          {
            councilType: 'Fleet Vehicle',
            neutralType: 'Service Vehicle',
            category: 'vehicle',
            description: 'Vehicles used for transportation services',
            icon: 'truck',
            color: '#8B5CF6',
          },
          {
            councilType: 'Transit Infrastructure',
            neutralType: 'Transit Infrastructure',
            category: 'infrastructure',
            description: 'Public transit infrastructure and facilities',
            icon: 'bus',
            color: '#06B6D4',
          },
        ],
        workflows: [
          {
            councilWorkflow: 'Fleet Management',
            neutralWorkflow: 'Fleet Management',
            description: 'Management of vehicle fleet operations',
            steps: ['Planning', 'Scheduling', 'Maintenance', 'Monitoring'],
            roles: ['Fleet Manager', 'Dispatcher', 'Mechanic', 'Driver'],
          },
        ],
        compliance: [
          {
            councilStandard: 'Transport Regulations',
            neutralStandard: 'Transport Regulations',
            description: 'Regulatory requirements for transport operations',
            requirements: ['Safety Standards', 'Driver Licensing', 'Vehicle Compliance'],
          },
        ],
        enabled: true,
      },
      {
        id: 'healthcare',
        name: 'healthcare',
        displayName: 'Healthcare & Medical',
        description: 'Configuration for healthcare and medical organizations',
        terminology: this.languageMappings.filter(m => m.sectors.includes('healthcare')),
        assetTypes: [
          {
            councilType: 'Medical Equipment',
            neutralType: 'Medical Equipment',
            category: 'equipment',
            description: 'Medical devices and equipment',
            icon: 'stethoscope',
            color: '#EC4899',
          },
          {
            councilType: 'Facility Infrastructure',
            neutralType: 'Facility Infrastructure',
            category: 'infrastructure',
            description: 'Healthcare facility infrastructure',
            icon: 'building-2',
            color: '#84CC16',
          },
        ],
        workflows: [
          {
            councilWorkflow: 'Medical Equipment Maintenance',
            neutralWorkflow: 'Medical Equipment Maintenance',
            description: 'Maintenance of medical equipment',
            steps: ['Inspection', 'Calibration', 'Maintenance', 'Testing'],
            roles: ['Biomedical Engineer', 'Technician', 'Supervisor'],
          },
        ],
        compliance: [
          {
            councilStandard: 'Healthcare Regulations',
            neutralStandard: 'Healthcare Regulations',
            description: 'Regulatory requirements for healthcare operations',
            requirements: ['Medical Device Compliance', 'Safety Standards', 'Quality Assurance'],
          },
        ],
        enabled: true,
      },
      {
        id: 'manufacturing',
        name: 'manufacturing',
        displayName: 'Manufacturing & Industrial',
        description: 'Configuration for manufacturing and industrial organizations',
        terminology: this.languageMappings.filter(m => m.sectors.includes('manufacturing')),
        assetTypes: [
          {
            councilType: 'Production Equipment',
            neutralType: 'Production Equipment',
            category: 'equipment',
            description: 'Manufacturing and production equipment',
            icon: 'cog',
            color: '#F97316',
          },
          {
            councilType: 'Industrial Infrastructure',
            neutralType: 'Industrial Infrastructure',
            category: 'infrastructure',
            description: 'Industrial facilities and infrastructure',
            icon: 'factory',
            color: '#64748B',
          },
        ],
        workflows: [
          {
            councilWorkflow: 'Production Maintenance',
            neutralWorkflow: 'Production Maintenance',
            description: 'Maintenance of production equipment',
            steps: ['Monitoring', 'Preventive Maintenance', 'Repair', 'Testing'],
            roles: ['Maintenance Engineer', 'Technician', 'Supervisor'],
          },
        ],
        compliance: [
          {
            councilStandard: 'Manufacturing Standards',
            neutralStandard: 'Manufacturing Standards',
            description: 'Standards for manufacturing operations',
            requirements: ['Quality Standards', 'Safety Compliance', 'Environmental Regulations'],
          },
        ],
        enabled: true,
      },
    ];
  }

  /**
   * Translate text from council-specific to sector-neutral terminology
   */
  translateText(text: string, context: LanguageContext): string {
    let translatedText = text;
    const sectorConfig = this.getSectorConfiguration(context.sector);
    
    if (!sectorConfig) {
      return text;
    }

    // Apply terminology mappings
    for (const mapping of sectorConfig.terminology) {
      const regex = new RegExp(`\\b${mapping.councilTerm}\\b`, 'gi');
      translatedText = translatedText.replace(regex, mapping.neutralTerm);
    }

    return translatedText;
  }

  /**
   * Get sector configuration
   */
  getSectorConfiguration(sectorId: string): SectorConfiguration | null {
    return this.sectorConfigurations.find(config => config.id === sectorId) || null;
  }

  /**
   * Get all sector configurations
   */
  getAllSectorConfigurations(): SectorConfiguration[] {
    return this.sectorConfigurations.filter(config => config.enabled);
  }

  /**
   * Set current sector
   */
  setCurrentSector(sectorId: string): void {
    this.currentSector = sectorId;
  }

  /**
   * Get current sector
   */
  getCurrentSector(): string {
    return this.currentSector;
  }

  /**
   * Get language mappings for a specific sector
   */
  getLanguageMappings(sectorId: string): LanguageMapping[] {
    const sectorConfig = this.getSectorConfiguration(sectorId);
    return sectorConfig ? sectorConfig.terminology : [];
  }

  /**
   * Get asset type mappings for a specific sector
   */
  getAssetTypeMappings(sectorId: string): AssetTypeMapping[] {
    const sectorConfig = this.getSectorConfiguration(sectorId);
    return sectorConfig ? sectorConfig.assetTypes : [];
  }

  /**
   * Get workflow mappings for a specific sector
   */
  getWorkflowMappings(sectorId: string): WorkflowMapping[] {
    const sectorConfig = this.getSectorConfiguration(sectorId);
    return sectorConfig ? sectorConfig.workflows : [];
  }

  /**
   * Get compliance mappings for a specific sector
   */
  getComplianceMappings(sectorId: string): ComplianceMapping[] {
    const sectorConfig = this.getSectorConfiguration(sectorId);
    return sectorConfig ? sectorConfig.compliance : [];
  }

  /**
   * Add custom language mapping
   */
  addLanguageMapping(mapping: LanguageMapping): void {
    this.languageMappings.push(mapping);
    
    // Update sector configurations that include this mapping
    for (const sectorConfig of this.sectorConfigurations) {
      if (sectorConfig.terminology.some(t => t.councilTerm === mapping.councilTerm)) {
        sectorConfig.terminology.push(mapping);
      }
    }
  }

  /**
   * Update language mapping
   */
  updateLanguageMapping(councilTerm: string, updates: Partial<LanguageMapping>): void {
    const mappingIndex = this.languageMappings.findIndex(m => m.councilTerm === councilTerm);
    if (mappingIndex !== -1) {
      this.languageMappings[mappingIndex] = { ...this.languageMappings[mappingIndex], ...updates };
    }
  }

  /**
   * Remove language mapping
   */
  removeLanguageMapping(councilTerm: string): void {
    this.languageMappings = this.languageMappings.filter(m => m.councilTerm !== councilTerm);
    
    // Remove from sector configurations
    for (const sectorConfig of this.sectorConfigurations) {
      sectorConfig.terminology = sectorConfig.terminology.filter(t => t.councilTerm !== councilTerm);
    }
  }

  /**
   * Validate sector configuration
   */
  validateSectorConfiguration(sectorId: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const sectorConfig = this.getSectorConfiguration(sectorId);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!sectorConfig) {
      errors.push(`Sector configuration '${sectorId}' not found`);
      return { isValid: false, errors, warnings };
    }

    // Check required fields
    if (!sectorConfig.name) {
      errors.push('Sector name is required');
    }
    if (!sectorConfig.displayName) {
      errors.push('Sector display name is required');
    }
    if (!sectorConfig.description) {
      errors.push('Sector description is required');
    }

    // Check terminology mappings
    if (sectorConfig.terminology.length === 0) {
      warnings.push('No terminology mappings defined');
    }

    // Check asset types
    if (sectorConfig.assetTypes.length === 0) {
      warnings.push('No asset types defined');
    }

    // Check workflows
    if (sectorConfig.workflows.length === 0) {
      warnings.push('No workflows defined');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Export sector configuration
   */
  exportSectorConfiguration(sectorId: string): string {
    const sectorConfig = this.getSectorConfiguration(sectorId);
    if (!sectorConfig) {
      throw new Error(`Sector configuration '${sectorId}' not found`);
    }

    return JSON.stringify(sectorConfig, null, 2);
  }

  /**
   * Import sector configuration
   */
  importSectorConfiguration(configJson: string): void {
    try {
      const sectorConfig = JSON.parse(configJson) as SectorConfiguration;
      
      // Validate the configuration
      const validation = this.validateSectorConfiguration(sectorConfig.id);
      if (!validation.isValid) {
        throw new Error(`Invalid sector configuration: ${validation.errors.join(', ')}`);
      }

      // Update or add the configuration
      const existingIndex = this.sectorConfigurations.findIndex(c => c.id === sectorConfig.id);
      if (existingIndex !== -1) {
        this.sectorConfigurations[existingIndex] = sectorConfig;
      } else {
        this.sectorConfigurations.push(sectorConfig);
      }
    } catch (error) {
      throw new Error(`Failed to import sector configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const sectorNeutralLanguageManager = new SectorNeutralLanguageManager();
