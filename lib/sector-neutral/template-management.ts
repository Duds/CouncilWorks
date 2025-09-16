/**
 * Sector-Specific Templates & Configurations
 * 
 * Implements sector-specific templates, configurations, and customization options
 * 
 * @fileoverview Sector-specific templates and configurations
 */

export interface SectorTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  sector: string;
  category: 'dashboard' | 'workflow' | 'report' | 'form' | 'notification';
  template: any;
  variables: TemplateVariable[];
  permissions: string[];
  enabled: boolean;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface SectorConfiguration {
  id: string;
  name: string;
  displayName: string;
  description: string;
  sector: string;
  settings: SectorSettings;
  branding: BrandingConfiguration;
  workflows: WorkflowConfiguration[];
  reports: ReportConfiguration[];
  notifications: NotificationConfiguration[];
  enabled: boolean;
}

export interface SectorSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  units: {
    distance: 'metric' | 'imperial';
    weight: 'metric' | 'imperial';
    temperature: 'celsius' | 'fahrenheit';
  };
  features: {
    enableAdvancedAnalytics: boolean;
    enablePredictiveMaintenance: boolean;
    enableMobileApp: boolean;
    enableOfflineMode: boolean;
    enableMultiTenant: boolean;
  };
}

export interface BrandingConfiguration {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCSS?: string;
  favicon?: string;
  organizationName: string;
  organizationDescription: string;
}

export interface WorkflowConfiguration {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'form' | 'approval' | 'notification' | 'integration' | 'condition';
  configuration: any;
  required: boolean;
  order: number;
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event' | 'condition';
  configuration: any;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
}

export interface WorkflowAction {
  type: 'notification' | 'integration' | 'data_update' | 'workflow_start';
  configuration: any;
}

export interface ReportConfiguration {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'analytics' | 'compliance' | 'financial' | 'operational';
  template: any;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    time: string;
    recipients: string[];
  };
  permissions: string[];
  enabled: boolean;
}

export interface NotificationConfiguration {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  template: any;
  triggers: NotificationTrigger[];
  recipients: NotificationRecipient[];
  enabled: boolean;
}

export interface NotificationTrigger {
  event: string;
  conditions: NotificationCondition[];
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface NotificationRecipient {
  type: 'user' | 'role' | 'group' | 'email';
  value: string;
}

export class SectorTemplateManager {
  private templates: SectorTemplate[] = [];
  private configurations: SectorConfiguration[] = [];

  constructor() {
    this.initializeTemplates();
    this.initializeConfigurations();
  }

  /**
   * Initialize sector templates
   */
  private initializeTemplates(): void {
    this.templates = [
      // Government Sector Templates
      {
        id: 'gov_dashboard_main',
        name: 'Government Main Dashboard',
        displayName: 'Government Operations Dashboard',
        description: 'Main dashboard template for government organizations',
        sector: 'government',
        category: 'dashboard',
        template: {
          layout: 'grid',
          widgets: [
            { type: 'asset_summary', position: { x: 0, y: 0, w: 4, h: 2 } },
            { type: 'maintenance_alerts', position: { x: 4, y: 0, w: 4, h: 2 } },
            { type: 'work_orders', position: { x: 8, y: 0, w: 4, h: 2 } },
            { type: 'compliance_status', position: { x: 0, y: 2, w: 6, h: 3 } },
            { type: 'financial_summary', position: { x: 6, y: 2, w: 6, h: 3 } },
          ],
        },
        variables: [
          {
            name: 'organizationName',
            type: 'string',
            required: true,
            description: 'Name of the government organization',
          },
          {
            name: 'primaryColor',
            type: 'string',
            required: false,
            defaultValue: '#3B82F6',
            description: 'Primary color for the dashboard',
          },
        ],
        permissions: ['admin', 'manager', 'supervisor'],
        enabled: true,
      },
      {
        id: 'gov_workflow_asset_disposal',
        name: 'Government Asset Disposal Workflow',
        displayName: 'Asset Disposal Process',
        description: 'Workflow for disposing of government assets',
        sector: 'government',
        category: 'workflow',
        template: {
          steps: [
            {
              id: 'assessment',
              name: 'Asset Assessment',
              type: 'form',
              form: 'asset_disposal_assessment',
              required: true,
              order: 1,
            },
            {
              id: 'approval',
              name: 'Manager Approval',
              type: 'approval',
              approvers: ['manager'],
              required: true,
              order: 2,
            },
            {
              id: 'disposal',
              name: 'Asset Disposal',
              type: 'form',
              form: 'asset_disposal_execution',
              required: true,
              order: 3,
            },
            {
              id: 'documentation',
              name: 'Documentation',
              type: 'form',
              form: 'asset_disposal_documentation',
              required: true,
              order: 4,
            },
          ],
          triggers: [
            {
              type: 'manual',
              configuration: {
                buttonText: 'Start Asset Disposal',
                icon: 'trash-2',
              },
            },
          ],
        },
        variables: [
          {
            name: 'approvalLevel',
            type: 'string',
            required: true,
            validation: {
              options: ['manager', 'director', 'executive'],
            },
            description: 'Level of approval required',
          },
        ],
        permissions: ['admin', 'manager', 'supervisor'],
        enabled: true,
      },

      // Utilities Sector Templates
      {
        id: 'util_dashboard_main',
        name: 'Utilities Main Dashboard',
        displayName: 'Utilities Operations Dashboard',
        description: 'Main dashboard template for utility companies',
        sector: 'utilities',
        category: 'dashboard',
        template: {
          layout: 'grid',
          widgets: [
            { type: 'infrastructure_status', position: { x: 0, y: 0, w: 6, h: 3 } },
            { type: 'maintenance_schedule', position: { x: 6, y: 0, w: 6, h: 3 } },
            { type: 'safety_alerts', position: { x: 0, y: 3, w: 4, h: 2 } },
            { type: 'performance_metrics', position: { x: 4, y: 3, w: 4, h: 2 } },
            { type: 'compliance_status', position: { x: 8, y: 3, w: 4, h: 2 } },
          ],
        },
        variables: [
          {
            name: 'utilityType',
            type: 'string',
            required: true,
            validation: {
              options: ['water', 'electricity', 'gas', 'wastewater'],
            },
            description: 'Type of utility service',
          },
        ],
        permissions: ['admin', 'manager', 'supervisor'],
        enabled: true,
      },

      // Transport Sector Templates
      {
        id: 'trans_dashboard_main',
        name: 'Transport Main Dashboard',
        displayName: 'Transportation Operations Dashboard',
        description: 'Main dashboard template for transportation companies',
        sector: 'transport',
        category: 'dashboard',
        template: {
          layout: 'grid',
          widgets: [
            { type: 'fleet_status', position: { x: 0, y: 0, w: 4, h: 2 } },
            { type: 'route_performance', position: { x: 4, y: 0, w: 4, h: 2 } },
            { type: 'maintenance_alerts', position: { x: 8, y: 0, w: 4, h: 2 } },
            { type: 'driver_performance', position: { x: 0, y: 2, w: 6, h: 3 } },
            { type: 'fuel_efficiency', position: { x: 6, y: 2, w: 6, h: 3 } },
          ],
        },
        variables: [
          {
            name: 'transportType',
            type: 'string',
            required: true,
            validation: {
              options: ['public_transit', 'freight', 'logistics', 'passenger'],
            },
            description: 'Type of transportation service',
          },
        ],
        permissions: ['admin', 'manager', 'supervisor'],
        enabled: true,
      },

      // Healthcare Sector Templates
      {
        id: 'health_dashboard_main',
        name: 'Healthcare Main Dashboard',
        displayName: 'Healthcare Operations Dashboard',
        description: 'Main dashboard template for healthcare organizations',
        sector: 'healthcare',
        category: 'dashboard',
        template: {
          layout: 'grid',
          widgets: [
            { type: 'equipment_status', position: { x: 0, y: 0, w: 4, h: 2 } },
            { type: 'maintenance_schedule', position: { x: 4, y: 0, w: 4, h: 2 } },
            { type: 'compliance_alerts', position: { x: 8, y: 0, w: 4, h: 2 } },
            { type: 'patient_safety', position: { x: 0, y: 2, w: 6, h: 3 } },
            { type: 'quality_metrics', position: { x: 6, y: 2, w: 6, h: 3 } },
          ],
        },
        variables: [
          {
            name: 'healthcareType',
            type: 'string',
            required: true,
            validation: {
              options: ['hospital', 'clinic', 'nursing_home', 'ambulatory'],
            },
            description: 'Type of healthcare facility',
          },
        ],
        permissions: ['admin', 'manager', 'supervisor'],
        enabled: true,
      },

      // Manufacturing Sector Templates
      {
        id: 'mfg_dashboard_main',
        name: 'Manufacturing Main Dashboard',
        displayName: 'Manufacturing Operations Dashboard',
        description: 'Main dashboard template for manufacturing companies',
        sector: 'manufacturing',
        category: 'dashboard',
        template: {
          layout: 'grid',
          widgets: [
            { type: 'production_status', position: { x: 0, y: 0, w: 4, h: 2 } },
            { type: 'equipment_status', position: { x: 4, y: 0, w: 4, h: 2 } },
            { type: 'quality_metrics', position: { x: 8, y: 0, w: 4, h: 2 } },
            { type: 'maintenance_schedule', position: { x: 0, y: 2, w: 6, h: 3 } },
            { type: 'safety_alerts', position: { x: 6, y: 2, w: 6, h: 3 } },
          ],
        },
        variables: [
          {
            name: 'manufacturingType',
            type: 'string',
            required: true,
            validation: {
              options: ['automotive', 'electronics', 'food', 'pharmaceutical', 'textiles'],
            },
            description: 'Type of manufacturing industry',
          },
        ],
        permissions: ['admin', 'manager', 'supervisor'],
        enabled: true,
      },
    ];
  }

  /**
   * Initialize sector configurations
   */
  private initializeConfigurations(): void {
    this.configurations = [
      {
        id: 'government_config',
        name: 'government',
        displayName: 'Government Configuration',
        description: 'Default configuration for government organizations',
        sector: 'government',
        settings: {
          timezone: 'Australia/Sydney',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'AUD',
          language: 'en-AU',
          units: {
            distance: 'metric',
            weight: 'metric',
            temperature: 'celsius',
          },
          features: {
            enableAdvancedAnalytics: true,
            enablePredictiveMaintenance: true,
            enableMobileApp: true,
            enableOfflineMode: true,
            enableMultiTenant: false,
          },
        },
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          accentColor: '#F59E0B',
          fontFamily: 'Inter',
          organizationName: 'Government Organization',
          organizationDescription: 'Public sector asset management',
        },
        workflows: [
          {
            id: 'asset_disposal',
            name: 'Asset Disposal Process',
            description: 'Process for disposing of government assets',
            steps: [
              {
                id: 'assessment',
                name: 'Asset Assessment',
                type: 'form',
                configuration: { formId: 'asset_disposal_assessment' },
                required: true,
                order: 1,
              },
              {
                id: 'approval',
                name: 'Manager Approval',
                type: 'approval',
                configuration: { approvers: ['manager'] },
                required: true,
                order: 2,
              },
            ],
            triggers: [{ type: 'manual', configuration: {} }],
            conditions: [],
            actions: [],
            enabled: true,
          },
        ],
        reports: [
          {
            id: 'compliance_report',
            name: 'Compliance Report',
            description: 'Government compliance reporting',
            type: 'compliance',
            template: { format: 'pdf', sections: ['overview', 'details', 'recommendations'] },
            schedule: {
              frequency: 'monthly',
              time: '09:00',
              recipients: ['manager', 'director'],
            },
            permissions: ['admin', 'manager'],
            enabled: true,
          },
        ],
        notifications: [
          {
            id: 'maintenance_alert',
            name: 'Maintenance Alert',
            description: 'Alert for scheduled maintenance',
            type: 'email',
            template: { subject: 'Maintenance Due', body: 'Asset {assetName} requires maintenance' },
            triggers: [{ event: 'maintenance_due', conditions: [] }],
            recipients: [{ type: 'role', value: 'supervisor' }],
            enabled: true,
          },
        ],
        enabled: true,
      },
      {
        id: 'utilities_config',
        name: 'utilities',
        displayName: 'Utilities Configuration',
        description: 'Default configuration for utility companies',
        sector: 'utilities',
        settings: {
          timezone: 'Australia/Sydney',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'AUD',
          language: 'en-AU',
          units: {
            distance: 'metric',
            weight: 'metric',
            temperature: 'celsius',
          },
          features: {
            enableAdvancedAnalytics: true,
            enablePredictiveMaintenance: true,
            enableMobileApp: true,
            enableOfflineMode: true,
            enableMultiTenant: true,
          },
        },
        branding: {
          primaryColor: '#0EA5E9',
          secondaryColor: '#0284C7',
          accentColor: '#F59E0B',
          fontFamily: 'Inter',
          organizationName: 'Utility Company',
          organizationDescription: 'Utility infrastructure management',
        },
        workflows: [],
        reports: [],
        notifications: [],
        enabled: true,
      },
    ];
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): SectorTemplate | null {
    return this.templates.find(template => template.id === templateId) || null;
  }

  /**
   * Get templates by sector
   */
  getTemplatesBySector(sector: string): SectorTemplate[] {
    return this.templates.filter(template => template.sector === sector && template.enabled);
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: SectorTemplate['category']): SectorTemplate[] {
    return this.templates.filter(template => template.category === category && template.enabled);
  }

  /**
   * Get sector configuration
   */
  getSectorConfiguration(sectorId: string): SectorConfiguration | null {
    return this.configurations.find(config => config.id === sectorId) || null;
  }

  /**
   * Get all sector configurations
   */
  getAllSectorConfigurations(): SectorConfiguration[] {
    return this.configurations.filter(config => config.enabled);
  }

  /**
   * Create custom template
   */
  createTemplate(template: Omit<SectorTemplate, 'id'>): string {
    const templateId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTemplate: SectorTemplate = {
      ...template,
      id: templateId,
    };

    this.templates.push(newTemplate);
    return templateId;
  }

  /**
   * Update template
   */
  updateTemplate(templateId: string, updates: Partial<SectorTemplate>): void {
    const templateIndex = this.templates.findIndex(t => t.id === templateId);
    if (templateIndex !== -1) {
      this.templates[templateIndex] = { ...this.templates[templateIndex], ...updates };
    }
  }

  /**
   * Delete template
   */
  deleteTemplate(templateId: string): void {
    this.templates = this.templates.filter(t => t.id !== templateId);
  }

  /**
   * Render template with variables
   */
  renderTemplate(templateId: string, variables: Record<string, any>): any {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    // Deep clone the template
    let renderedTemplate = JSON.parse(JSON.stringify(template.template));

    // Replace variables in the template
    for (const variable of template.variables) {
      const value = variables[variable.name] ?? variable.defaultValue;
      
      if (variable.required && value === undefined) {
        throw new Error(`Required variable '${variable.name}' not provided`);
      }

      // Replace variable placeholders in the template
      this.replaceVariableInTemplate(renderedTemplate, variable.name, value);
    }

    return renderedTemplate;
  }

  /**
   * Replace variable in template recursively
   */
  private replaceVariableInTemplate(obj: any, variableName: string, value: any): void {
    if (typeof obj === 'string') {
      const regex = new RegExp(`\\{\\{${variableName}\\}\\}`, 'g');
      obj = obj.replace(regex, value);
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = this.replaceVariableInTemplate(obj[i], variableName, value);
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = this.replaceVariableInTemplate(obj[key], variableName, value);
      }
    }
  }

  /**
   * Validate template variables
   */
  validateTemplateVariables(templateId: string, variables: Record<string, any>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const template = this.getTemplate(templateId);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!template) {
      errors.push(`Template '${templateId}' not found`);
      return { isValid: false, errors, warnings };
    }

    for (const variable of template.variables) {
      const value = variables[variable.name];

      // Check required variables
      if (variable.required && value === undefined) {
        errors.push(`Required variable '${variable.name}' not provided`);
        continue;
      }

      // Skip validation if value is undefined and not required
      if (value === undefined) {
        continue;
      }

      // Type validation
      if (variable.type === 'string' && typeof value !== 'string') {
        errors.push(`Variable '${variable.name}' must be a string`);
      } else if (variable.type === 'number' && typeof value !== 'number') {
        errors.push(`Variable '${variable.name}' must be a number`);
      } else if (variable.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Variable '${variable.name}' must be a boolean`);
      }

      // Validation rules
      if (variable.validation) {
        if (variable.validation.min !== undefined && value < variable.validation.min) {
          errors.push(`Variable '${variable.name}' must be at least ${variable.validation.min}`);
        }
        if (variable.validation.max !== undefined && value > variable.validation.max) {
          errors.push(`Variable '${variable.name}' must be at most ${variable.validation.max}`);
        }
        if (variable.validation.pattern && !new RegExp(variable.validation.pattern).test(value)) {
          errors.push(`Variable '${variable.name}' does not match required pattern`);
        }
        if (variable.validation.options && !variable.validation.options.includes(value)) {
          errors.push(`Variable '${variable.name}' must be one of: ${variable.validation.options.join(', ')}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Export template
   */
  exportTemplate(templateId: string): string {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    return JSON.stringify(template, null, 2);
  }

  /**
   * Import template
   */
  importTemplate(templateJson: string): string {
    try {
      const template = JSON.parse(templateJson) as SectorTemplate;
      
      // Validate the template
      if (!template.id || !template.name || !template.sector) {
        throw new Error('Invalid template: missing required fields');
      }

      // Check if template already exists
      if (this.getTemplate(template.id)) {
        throw new Error(`Template '${template.id}' already exists`);
      }

      this.templates.push(template);
      return template.id;
    } catch (error) {
      throw new Error(`Failed to import template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const sectorTemplateManager = new SectorTemplateManager();
