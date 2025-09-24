/**
 * Multi-Sector Asset Classification System
 *
 * Implements comprehensive asset classification system for multiple industry sectors
 *
 * @fileoverview Multi-sector asset classification system
 */

export interface AssetClassification {
  id: string;
  name: string;
  displayName: string;
  description: string;
  sector: string;
  category: string;
  subcategory?: string;
  attributes: AssetAttribute[];
  relationships: AssetRelationship[];
  lifecycle: AssetLifecycle;
  compliance: ComplianceRequirement[];
  maintenance: MaintenanceRequirement[];
  enabled: boolean;
}

export interface AssetAttribute {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object';
  required: boolean;
  defaultValue?: any;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  sectorSpecific?: boolean;
}

export interface AssetRelationship {
  type: 'parent' | 'child' | 'sibling' | 'dependency' | 'location';
  targetClassification: string;
  description: string;
  required: boolean;
}

export interface AssetLifecycle {
  phases: LifecyclePhase[];
  transitions: LifecycleTransition[];
  duration: {
    planned: number; // in years
    actual?: number; // in years
  };
}

export interface LifecyclePhase {
  id: string;
  name: string;
  description: string;
  order: number;
  activities: string[];
  deliverables: string[];
  duration: number; // in months
}

export interface LifecycleTransition {
  from: string;
  to: string;
  conditions: TransitionCondition[];
  actions: TransitionAction[];
}

export interface TransitionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface TransitionAction {
  type: 'notification' | 'workflow' | 'data_update' | 'integration';
  configuration: any;
}

export interface ComplianceRequirement {
  standard: string;
  version: string;
  requirements: string[];
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  responsible: string;
  documentation: string[];
}

export interface MaintenanceRequirement {
  type: 'preventive' | 'corrective' | 'predictive' | 'condition_based';
  frequency: string;
  duration: number; // in hours
  skills: string[];
  tools: string[];
  parts: string[];
  cost: {
    labor: number;
    materials: number;
    total: number;
  };
}

export interface SectorAssetMapping {
  sector: string;
  classifications: AssetClassification[];
  hierarchies: AssetHierarchy[];
  workflows: AssetWorkflow[];
}

export interface AssetHierarchy {
  id: string;
  name: string;
  description: string;
  levels: HierarchyLevel[];
  rootClassification: string;
}

export interface HierarchyLevel {
  level: number;
  name: string;
  description: string;
  classifications: string[];
  parentLevel?: number;
}

export interface AssetWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  classifications: string[];
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event' | 'condition';
  configuration: any;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'form' | 'approval' | 'notification' | 'integration' | 'condition';
  configuration: any;
  required: boolean;
  order: number;
}

export class MultiSectorAssetClassificationManager {
  private classifications: AssetClassification[] = [];
  private sectorMappings: SectorAssetMapping[] = [];

  constructor() {
    this.initializeClassifications();
    this.initializeSectorMappings();
  }

  /**
   * Initialize asset classifications
   */
  private initializeClassifications(): void {
    this.classifications = [
      // Government Sector Classifications
      {
        id: 'gov_road_infrastructure',
        name: 'Road Infrastructure',
        displayName: 'Road Infrastructure',
        description: 'Roads, bridges, and transportation infrastructure',
        sector: 'government',
        category: 'infrastructure',
        subcategory: 'transportation',
        attributes: [
          {
            name: 'roadType',
            type: 'enum',
            required: true,
            validation: { options: ['highway', 'arterial', 'collector', 'local', 'bridge'] },
            description: 'Type of road infrastructure',
          },
          {
            name: 'length',
            type: 'number',
            required: true,
            validation: { min: 0 },
            description: 'Length of road in kilometers',
          },
          {
            name: 'lanes',
            type: 'number',
            required: true,
            validation: { min: 1, max: 8 },
            description: 'Number of lanes',
          },
          {
            name: 'surfaceType',
            type: 'enum',
            required: true,
            validation: { options: ['asphalt', 'concrete', 'gravel', 'unsealed'] },
            description: 'Surface type of the road',
          },
          {
            name: 'constructionDate',
            type: 'date',
            required: true,
            description: 'Date of construction',
          },
          {
            name: 'lastResurfacing',
            type: 'date',
            required: false,
            description: 'Date of last resurfacing',
          },
        ],
        relationships: [
          {
            type: 'location',
            targetClassification: 'gov_facility',
            description: 'Located within a government facility',
            required: false,
          },
        ],
        lifecycle: {
          phases: [
            {
              id: 'planning',
              name: 'Planning',
              description: 'Planning and design phase',
              order: 1,
              activities: ['Design', 'Environmental Assessment', 'Community Consultation'],
              deliverables: ['Design Plans', 'Environmental Report', 'Community Feedback'],
              duration: 12,
            },
            {
              id: 'construction',
              name: 'Construction',
              description: 'Construction phase',
              order: 2,
              activities: ['Site Preparation', 'Construction', 'Quality Control'],
              deliverables: ['Completed Road', 'Quality Certificates'],
              duration: 18,
            },
            {
              id: 'operation',
              name: 'Operation',
              description: 'Operational phase',
              order: 3,
              activities: ['Maintenance', 'Monitoring', 'Repairs'],
              deliverables: ['Maintenance Records', 'Performance Reports'],
              duration: 240, // 20 years
            },
            {
              id: 'renewal',
              name: 'Renewal',
              description: 'Renewal or replacement phase',
              order: 4,
              activities: ['Assessment', 'Renewal Planning', 'Reconstruction'],
              deliverables: ['Renewed Infrastructure'],
              duration: 24,
            },
          ],
          transitions: [
            {
              from: 'planning',
              to: 'construction',
              conditions: [
                { field: 'approvalStatus', operator: 'equals', value: 'approved' },
              ],
              actions: [
                { type: 'notification', configuration: { recipients: ['project_manager'] } },
              ],
            },
          ],
          duration: { planned: 20 },
        },
        compliance: [
          {
            standard: 'ISO 55000',
            version: '2014',
            requirements: ['Asset Management Policy', 'Asset Management Objectives'],
            frequency: 'yearly',
            responsible: 'Asset Manager',
            documentation: ['Policy Document', 'Objectives Report'],
          },
        ],
        maintenance: [
          {
            type: 'preventive',
            frequency: 'annually',
            duration: 40,
            skills: ['Road Maintenance', 'Equipment Operation'],
            tools: ['Paving Equipment', 'Surveying Tools'],
            parts: ['Asphalt', 'Road Markings'],
            cost: { labor: 2000, materials: 5000, total: 7000 },
          },
        ],
        enabled: true,
      },
      {
        id: 'gov_parks_recreation',
        name: 'Parks & Recreation',
        displayName: 'Parks & Recreation Facilities',
        description: 'Parks, playgrounds, and recreational facilities',
        sector: 'government',
        category: 'facility',
        subcategory: 'recreation',
        attributes: [
          {
            name: 'facilityType',
            type: 'enum',
            required: true,
            validation: { options: ['park', 'playground', 'sports_field', 'recreation_center'] },
            description: 'Type of recreational facility',
          },
          {
            name: 'area',
            type: 'number',
            required: true,
            validation: { min: 0 },
            description: 'Area in square meters',
          },
          {
            name: 'capacity',
            type: 'number',
            required: false,
            validation: { min: 0 },
            description: 'Maximum capacity of people',
          },
          {
            name: 'amenities',
            type: 'object',
            required: false,
            description: 'Available amenities',
          },
        ],
        relationships: [],
        lifecycle: {
          phases: [
            {
              id: 'planning',
              name: 'Planning',
              description: 'Planning and design phase',
              order: 1,
              activities: ['Design', 'Community Consultation'],
              deliverables: ['Design Plans', 'Community Feedback'],
              duration: 6,
            },
            {
              id: 'construction',
              name: 'Construction',
              description: 'Construction phase',
              order: 2,
              activities: ['Site Preparation', 'Construction', 'Landscaping'],
              deliverables: ['Completed Facility'],
              duration: 12,
            },
            {
              id: 'operation',
              name: 'Operation',
              description: 'Operational phase',
              order: 3,
              activities: ['Maintenance', 'Cleaning', 'Safety Inspections'],
              deliverables: ['Maintenance Records', 'Safety Reports'],
              duration: 180, // 30 years
            },
          ],
          transitions: [],
          duration: { planned: 15 },
        },
        compliance: [],
        maintenance: [
          {
            type: 'preventive',
            frequency: 'monthly',
            duration: 8,
            skills: ['Landscaping', 'Facility Maintenance'],
            tools: ['Mowing Equipment', 'Cleaning Supplies'],
            parts: ['Plants', 'Cleaning Materials'],
            cost: { labor: 400, materials: 200, total: 600 },
          },
        ],
        enabled: true,
      },

      // Utilities Sector Classifications
      {
        id: 'util_water_infrastructure',
        name: 'Water Infrastructure',
        displayName: 'Water Infrastructure',
        description: 'Water treatment, distribution, and storage systems',
        sector: 'utilities',
        category: 'infrastructure',
        subcategory: 'water',
        attributes: [
          {
            name: 'infrastructureType',
            type: 'enum',
            required: true,
            validation: { options: ['treatment_plant', 'distribution_network', 'storage_tank', 'pumping_station'] },
            description: 'Type of water infrastructure',
          },
          {
            name: 'capacity',
            type: 'number',
            required: true,
            validation: { min: 0 },
            description: 'Capacity in liters per day',
          },
          {
            name: 'pressure',
            type: 'number',
            required: false,
            validation: { min: 0 },
            description: 'Operating pressure in kPa',
          },
          {
            name: 'material',
            type: 'enum',
            required: true,
            validation: { options: ['steel', 'concrete', 'plastic', 'cast_iron'] },
            description: 'Construction material',
          },
        ],
        relationships: [
          {
            type: 'dependency',
            targetClassification: 'util_water_treatment',
            description: 'Depends on water treatment facilities',
            required: true,
          },
        ],
        lifecycle: {
          phases: [
            {
              id: 'design',
              name: 'Design',
              description: 'Design and engineering phase',
              order: 1,
              activities: ['Engineering Design', 'Hydraulic Analysis'],
              deliverables: ['Design Plans', 'Hydraulic Report'],
              duration: 6,
            },
            {
              id: 'construction',
              name: 'Construction',
              description: 'Construction phase',
              order: 2,
              activities: ['Site Preparation', 'Construction', 'Testing'],
              deliverables: ['Completed Infrastructure', 'Test Results'],
              duration: 18,
            },
            {
              id: 'operation',
              name: 'Operation',
              description: 'Operational phase',
              order: 3,
              activities: ['Monitoring', 'Maintenance', 'Water Quality Testing'],
              deliverables: ['Operation Reports', 'Quality Certificates'],
              duration: 300, // 25 years
            },
          ],
          transitions: [],
          duration: { planned: 25 },
        },
        compliance: [
          {
            standard: 'AS/NZS 3500',
            version: '2018',
            requirements: ['Water Quality Standards', 'Safety Requirements'],
            frequency: 'continuous',
            responsible: 'Water Quality Manager',
            documentation: ['Quality Reports', 'Safety Certificates'],
          },
        ],
        maintenance: [
          {
            type: 'preventive',
            frequency: 'quarterly',
            duration: 16,
            skills: ['Water Treatment', 'Mechanical Maintenance'],
            tools: ['Testing Equipment', 'Maintenance Tools'],
            parts: ['Filters', 'Valves', 'Pumps'],
            cost: { labor: 800, materials: 1200, total: 2000 },
          },
        ],
        enabled: true,
      },

      // Transport Sector Classifications
      {
        id: 'trans_fleet_vehicle',
        name: 'Fleet Vehicle',
        displayName: 'Service Vehicle',
        description: 'Vehicles used for transportation services',
        sector: 'transport',
        category: 'vehicle',
        subcategory: 'service',
        attributes: [
          {
            name: 'vehicleType',
            type: 'enum',
            required: true,
            validation: { options: ['bus', 'truck', 'van', 'car', 'motorcycle'] },
            description: 'Type of vehicle',
          },
          {
            name: 'make',
            type: 'string',
            required: true,
            description: 'Vehicle manufacturer',
          },
          {
            name: 'model',
            type: 'string',
            required: true,
            description: 'Vehicle model',
          },
          {
            name: 'year',
            type: 'number',
            required: true,
            validation: { min: 1900, max: 2030 },
            description: 'Year of manufacture',
          },
          {
            name: 'engineType',
            type: 'enum',
            required: true,
            validation: { options: ['petrol', 'diesel', 'electric', 'hybrid', 'lpg'] },
            description: 'Type of engine',
          },
          {
            name: 'capacity',
            type: 'number',
            required: false,
            validation: { min: 0 },
            description: 'Passenger or cargo capacity',
          },
        ],
        relationships: [
          {
            type: 'location',
            targetClassification: 'trans_depot',
            description: 'Located at transport depot',
            required: true,
          },
        ],
        lifecycle: {
          phases: [
            {
              id: 'procurement',
              name: 'Procurement',
              description: 'Vehicle procurement phase',
              order: 1,
              activities: ['Specification', 'Tendering', 'Purchase'],
              deliverables: ['Vehicle Specifications', 'Purchase Order'],
              duration: 3,
            },
            {
              id: 'commissioning',
              name: 'Commissioning',
              description: 'Vehicle commissioning phase',
              order: 2,
              activities: ['Delivery', 'Inspection', 'Registration'],
              deliverables: ['Commissioned Vehicle', 'Registration'],
              duration: 1,
            },
            {
              id: 'operation',
              name: 'Operation',
              description: 'Operational phase',
              order: 3,
              activities: ['Scheduled Service', 'Repairs', 'Inspections'],
              deliverables: ['Service Records', 'Inspection Reports'],
              duration: 120, // 10 years
            },
            {
              id: 'disposal',
              name: 'Disposal',
              description: 'Vehicle disposal phase',
              order: 4,
              activities: ['Assessment', 'Sale', 'Documentation'],
              deliverables: ['Disposal Records'],
              duration: 1,
            },
          ],
          transitions: [],
          duration: { planned: 10 },
        },
        compliance: [
          {
            standard: 'ADR',
            version: '2021',
            requirements: ['Vehicle Safety Standards', 'Emission Standards'],
            frequency: 'yearly',
            responsible: 'Fleet Manager',
            documentation: ['Safety Certificates', 'Emission Reports'],
          },
        ],
        maintenance: [
          {
            type: 'preventive',
            frequency: 'monthly',
            duration: 4,
            skills: ['Vehicle Maintenance', 'Diagnostics'],
            tools: ['Diagnostic Equipment', 'Hand Tools'],
            parts: ['Oil', 'Filters', 'Brake Pads'],
            cost: { labor: 200, materials: 300, total: 500 },
          },
        ],
        enabled: true,
      },

      // Healthcare Sector Classifications
      {
        id: 'health_medical_equipment',
        name: 'Medical Equipment',
        displayName: 'Medical Equipment',
        description: 'Medical devices and equipment',
        sector: 'healthcare',
        category: 'equipment',
        subcategory: 'medical',
        attributes: [
          {
            name: 'equipmentType',
            type: 'enum',
            required: true,
            validation: { options: ['diagnostic', 'therapeutic', 'monitoring', 'surgical'] },
            description: 'Type of medical equipment',
          },
          {
            name: 'manufacturer',
            type: 'string',
            required: true,
            description: 'Equipment manufacturer',
          },
          {
            name: 'model',
            type: 'string',
            required: true,
            description: 'Equipment model',
          },
          {
            name: 'serialNumber',
            type: 'string',
            required: true,
            description: 'Equipment serial number',
          },
          {
            name: 'purchaseDate',
            type: 'date',
            required: true,
            description: 'Date of purchase',
          },
          {
            name: 'warrantyExpiry',
            type: 'date',
            required: false,
            description: 'Warranty expiry date',
          },
        ],
        relationships: [
          {
            type: 'location',
            targetClassification: 'health_facility',
            description: 'Located in healthcare facility',
            required: true,
          },
        ],
        lifecycle: {
          phases: [
            {
              id: 'procurement',
              name: 'Procurement',
              description: 'Equipment procurement phase',
              order: 1,
              activities: ['Specification', 'Tendering', 'Purchase'],
              deliverables: ['Equipment Specifications', 'Purchase Order'],
              duration: 2,
            },
            {
              id: 'installation',
              name: 'Installation',
              description: 'Equipment installation phase',
              order: 2,
              activities: ['Delivery', 'Installation', 'Testing'],
              deliverables: ['Installed Equipment', 'Test Results'],
              duration: 1,
            },
            {
              id: 'operation',
              name: 'Operation',
              description: 'Operational phase',
              order: 3,
              activities: ['Calibration', 'Maintenance', 'Quality Control'],
              deliverables: ['Calibration Records', 'Maintenance Reports'],
              duration: 84, // 7 years
            },
          ],
          transitions: [],
          duration: { planned: 7 },
        },
        compliance: [
          {
            standard: 'TGA',
            version: '2021',
            requirements: ['Medical Device Registration', 'Quality Management'],
            frequency: 'continuous',
            responsible: 'Biomedical Engineer',
            documentation: ['Registration Certificate', 'Quality Records'],
          },
        ],
        maintenance: [
          {
            type: 'preventive',
            frequency: 'monthly',
            duration: 2,
            skills: ['Biomedical Engineering', 'Calibration'],
            tools: ['Calibration Equipment', 'Test Equipment'],
            parts: ['Calibration Standards', 'Test Probes'],
            cost: { labor: 100, materials: 50, total: 150 },
          },
        ],
        enabled: true,
      },

      // Manufacturing Sector Classifications
      {
        id: 'mfg_production_equipment',
        name: 'Production Equipment',
        displayName: 'Production Equipment',
        description: 'Manufacturing and production equipment',
        sector: 'manufacturing',
        category: 'equipment',
        subcategory: 'production',
        attributes: [
          {
            name: 'equipmentType',
            type: 'enum',
            required: true,
            validation: { options: ['machining', 'assembly', 'packaging', 'quality_control'] },
            description: 'Type of production equipment',
          },
          {
            name: 'manufacturer',
            type: 'string',
            required: true,
            description: 'Equipment manufacturer',
          },
          {
            name: 'model',
            type: 'string',
            required: true,
            description: 'Equipment model',
          },
          {
            name: 'capacity',
            type: 'number',
            required: true,
            validation: { min: 0 },
            description: 'Production capacity per hour',
          },
          {
            name: 'automationLevel',
            type: 'enum',
            required: true,
            validation: { options: ['manual', 'semi_automatic', 'automatic', 'fully_automatic'] },
            description: 'Level of automation',
          },
        ],
        relationships: [
          {
            type: 'location',
            targetClassification: 'mfg_production_line',
            description: 'Part of production line',
            required: true,
          },
        ],
        lifecycle: {
          phases: [
            {
              id: 'procurement',
              name: 'Procurement',
              description: 'Equipment procurement phase',
              order: 1,
              activities: ['Specification', 'Tendering', 'Purchase'],
              deliverables: ['Equipment Specifications', 'Purchase Order'],
              duration: 3,
            },
            {
              id: 'installation',
              name: 'Installation',
              description: 'Equipment installation phase',
              order: 2,
              activities: ['Delivery', 'Installation', 'Commissioning'],
              deliverables: ['Installed Equipment', 'Commissioning Report'],
              duration: 2,
            },
            {
              id: 'operation',
              name: 'Operation',
              description: 'Operational phase',
              order: 3,
              activities: ['Production', 'Maintenance', 'Quality Control'],
              deliverables: ['Production Records', 'Maintenance Reports'],
              duration: 180, // 30 years
            },
          ],
          transitions: [],
          duration: { planned: 15 },
        },
        compliance: [
          {
            standard: 'ISO 9001',
            version: '2015',
            requirements: ['Quality Management', 'Process Control'],
            frequency: 'continuous',
            responsible: 'Quality Manager',
            documentation: ['Quality Manual', 'Process Records'],
          },
        ],
        maintenance: [
          {
            type: 'preventive',
            frequency: 'weekly',
            duration: 8,
            skills: ['Mechanical Maintenance', 'Electrical Maintenance'],
            tools: ['Hand Tools', 'Diagnostic Equipment'],
            parts: ['Belts', 'Bearings', 'Filters'],
            cost: { labor: 400, materials: 200, total: 600 },
          },
        ],
        enabled: true,
      },
    ];
  }

  /**
   * Initialize sector mappings
   */
  private initializeSectorMappings(): void {
    this.sectorMappings = [
      {
        sector: 'government',
        classifications: this.classifications.filter(c => c.sector === 'government'),
        hierarchies: [
          {
            id: 'gov_infrastructure_hierarchy',
            name: 'Infrastructure Hierarchy',
            description: 'Hierarchy for government infrastructure assets',
            levels: [
              {
                level: 1,
                name: 'Infrastructure Category',
                description: 'Top-level infrastructure categories',
                classifications: ['gov_road_infrastructure', 'gov_parks_recreation'],
              },
              {
                level: 2,
                name: 'Asset Type',
                description: 'Specific asset types within categories',
                classifications: ['gov_road_infrastructure', 'gov_parks_recreation'],
                parentLevel: 1,
              },
            ],
            rootClassification: 'gov_infrastructure',
          },
        ],
        workflows: [
          {
            id: 'gov_asset_disposal',
            name: 'Asset Disposal Process',
            description: 'Process for disposing of government assets',
            trigger: { type: 'manual', configuration: {} },
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
            classifications: ['gov_road_infrastructure', 'gov_parks_recreation'],
          },
        ],
      },
      {
        sector: 'utilities',
        classifications: this.classifications.filter(c => c.sector === 'utilities'),
        hierarchies: [],
        workflows: [],
      },
      {
        sector: 'transport',
        classifications: this.classifications.filter(c => c.sector === 'transport'),
        hierarchies: [],
        workflows: [],
      },
      {
        sector: 'healthcare',
        classifications: this.classifications.filter(c => c.sector === 'healthcare'),
        hierarchies: [],
        workflows: [],
      },
      {
        sector: 'manufacturing',
        classifications: this.classifications.filter(c => c.sector === 'manufacturing'),
        hierarchies: [],
        workflows: [],
      },
    ];
  }

  /**
   * Get classification by ID
   */
  getClassification(classificationId: string): AssetClassification | null {
    return this.classifications.find(c => c.id === classificationId) || null;
  }

  /**
   * Get classifications by sector
   */
  getClassificationsBySector(sector: string): AssetClassification[] {
    return this.classifications.filter(c => c.sector === sector && c.enabled);
  }

  /**
   * Get classifications by category
   */
  getClassificationsByCategory(category: string): AssetClassification[] {
    return this.classifications.filter(c => c.category === category && c.enabled);
  }

  /**
   * Get sector mapping
   */
  getSectorMapping(sector: string): SectorAssetMapping | null {
    return this.sectorMappings.find(m => m.sector === sector) || null;
  }

  /**
   * Get all sector mappings
   */
  getAllSectorMappings(): SectorAssetMapping[] {
    return this.sectorMappings;
  }

  /**
   * Create custom classification
   */
  createClassification(classification: Omit<AssetClassification, 'id'>): string {
    const classificationId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newClassification: AssetClassification = {
      ...classification,
      id: classificationId,
    };

    this.classifications.push(newClassification);
    return classificationId;
  }

  /**
   * Update classification
   */
  updateClassification(classificationId: string, updates: Partial<AssetClassification>): void {
    const classificationIndex = this.classifications.findIndex(c => c.id === classificationId);
    if (classificationIndex !== -1) {
      this.classifications[classificationIndex] = { ...this.classifications[classificationIndex], ...updates };
    }
  }

  /**
   * Delete classification
   */
  deleteClassification(classificationId: string): void {
    this.classifications = this.classifications.filter(c => c.id !== classificationId);
  }

  /**
   * Validate asset against classification
   */
  validateAsset(classificationId: string, assetData: Record<string, any>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const classification = this.getClassification(classificationId);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!classification) {
      errors.push(`Classification '${classificationId}' not found`);
      return { isValid: false, errors, warnings };
    }

    for (const attribute of classification.attributes) {
      const value = assetData[attribute.name];

      // Check required attributes
      if (attribute.required && value === undefined) {
        errors.push(`Required attribute '${attribute.name}' not provided`);
        continue;
      }

      // Skip validation if value is undefined and not required
      if (value === undefined) {
        continue;
      }

      // Type validation
      if (attribute.type === 'string' && typeof value !== 'string') {
        errors.push(`Attribute '${attribute.name}' must be a string`);
      } else if (attribute.type === 'number' && typeof value !== 'number') {
        errors.push(`Attribute '${attribute.name}' must be a number`);
      } else if (attribute.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Attribute '${attribute.name}' must be a boolean`);
      }

      // Validation rules
      if (attribute.validation) {
        if (attribute.validation.min !== undefined && value < attribute.validation.min) {
          errors.push(`Attribute '${attribute.name}' must be at least ${attribute.validation.min}`);
        }
        if (attribute.validation.max !== undefined && value > attribute.validation.max) {
          errors.push(`Attribute '${attribute.name}' must be at most ${attribute.validation.max}`);
        }
        if (attribute.validation.pattern && !new RegExp(attribute.validation.pattern).test(value)) {
          errors.push(`Attribute '${attribute.name}' does not match required pattern`);
        }
        if (attribute.validation.options && !attribute.validation.options.includes(value)) {
          errors.push(`Attribute '${attribute.name}' must be one of: ${attribute.validation.options.join(', ')}`);
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
   * Get asset lifecycle phase
   */
  getAssetLifecyclePhase(classificationId: string, assetAge: number): LifecyclePhase | null {
    const classification = this.getClassification(classificationId);
    if (!classification) {
      return null;
    }

    let cumulativeDuration = 0;
    for (const phase of classification.lifecycle.phases) {
      cumulativeDuration += phase.duration;
      if (assetAge <= cumulativeDuration) {
        return phase;
      }
    }

    return classification.lifecycle.phases[classification.lifecycle.phases.length - 1];
  }

  /**
   * Get maintenance requirements for asset
   */
  getMaintenanceRequirements(classificationId: string): MaintenanceRequirement[] {
    const classification = this.getClassification(classificationId);
    return classification ? classification.maintenance : [];
  }

  /**
   * Get compliance requirements for asset
   */
  getComplianceRequirements(classificationId: string): ComplianceRequirement[] {
    const classification = this.getClassification(classificationId);
    return classification ? classification.compliance : [];
  }

  /**
   * Export classification
   */
  exportClassification(classificationId: string): string {
    const classification = this.getClassification(classificationId);
    if (!classification) {
      throw new Error(`Classification '${classificationId}' not found`);
    }

    return JSON.stringify(classification, null, 2);
  }

  /**
   * Import classification
   */
  importClassification(classificationJson: string): string {
    try {
      const classification = JSON.parse(classificationJson) as AssetClassification;

      // Validate the classification
      if (!classification.id || !classification.name || !classification.sector) {
        throw new Error('Invalid classification: missing required fields');
      }

      // Check if classification already exists
      if (this.getClassification(classification.id)) {
        throw new Error(`Classification '${classification.id}' already exists`);
      }

      this.classifications.push(classification);
      return classification.id;
    } catch (error) {
      throw new Error(`Failed to import classification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const multiSectorAssetClassificationManager = new MultiSectorAssetClassificationManager();
