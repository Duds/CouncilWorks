/**
 * Epic 24: Language Simplification & Visualisation Enhancement
 * Component Naming Standardisation Utility
 *
 * Provides utilities to standardise component names and variables
 * using the comprehensive language dictionary mappings.
 *
 * @file component-standardisation.ts
 * @version 1.0.0
 * @author Aegrid Development Team
 */

export interface ComponentMapping {
  originalName: string;
  standardisedName: string;
  componentType: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  filePath?: string;
}

export interface VariableMapping {
  originalName: string;
  standardisedName: string;
  context: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

/**
 * Component mappings for standardisation
 * Maps current component names to standardised terminology
 */
export const COMPONENT_MAPPINGS: Record<string, ComponentMapping> = {
  // Dashboard Components
  EnhancedExecutiveDashboard: {
    originalName: 'EnhancedExecutiveDashboard',
    standardisedName: 'ExecutiveDashboard',
    componentType: 'Dashboard',
    description: 'Interactive executive dashboard with drill-down capabilities',
    priority: 'High',
  },
  AssetVisualisationMap: {
    originalName: 'AssetVisualisationMap',
    standardisedName: 'AssetMap',
    componentType: 'Map',
    description: 'Geographic asset mapping with condition overlays',
    priority: 'High',
  },
  ExecutiveVisualReport: {
    originalName: 'ExecutiveVisualReport',
    standardisedName: 'ExecutiveReport',
    componentType: 'Report',
    description: 'Comprehensive executive reporting with visual elements',
    priority: 'High',
  },
  ManagerDashboard: {
    originalName: 'ManagerDashboard',
    standardisedName: 'ManagerDashboard',
    componentType: 'Dashboard',
    description: 'Manager-level operational overview dashboard',
    priority: 'High',
  },
  StrategicDashboard: {
    originalName: 'StrategicDashboard',
    standardisedName: 'ExecutiveDashboard',
    componentType: 'Dashboard',
    description: 'High-level strategic overview dashboard',
    priority: 'High',
  },

  // Asset Management Components
  AssetForm: {
    originalName: 'AssetForm',
    standardisedName: 'AssetForm',
    componentType: 'Form',
    description: 'Asset creation and editing form',
    priority: 'High',
  },
  AssetList: {
    originalName: 'AssetList',
    standardisedName: 'AssetList',
    componentType: 'List',
    description: 'Asset listing and management component',
    priority: 'High',
  },
  AssetDetails: {
    originalName: 'AssetDetails',
    standardisedName: 'AssetDetails',
    componentType: 'Detail',
    description: 'Asset detail view component',
    priority: 'High',
  },
  AssetSearch: {
    originalName: 'AssetSearch',
    standardisedName: 'AssetSearch',
    componentType: 'Search',
    description: 'Asset search and filtering component',
    priority: 'High',
  },
  AssetRegister: {
    originalName: 'AssetRegister',
    standardisedName: 'AssetRegister',
    componentType: 'Register',
    description: 'Comprehensive asset register component',
    priority: 'High',
  },

  // Work Order Components
  WorkOrderForm: {
    originalName: 'WorkOrderForm',
    standardisedName: 'WorkOrderForm',
    componentType: 'Form',
    description: 'Work order creation and editing form',
    priority: 'High',
  },
  WorkOrderList: {
    originalName: 'WorkOrderList',
    standardisedName: 'WorkOrderList',
    componentType: 'List',
    description: 'Work order listing and management component',
    priority: 'High',
  },
  WorkOrderDetails: {
    originalName: 'WorkOrderDetails',
    standardisedName: 'WorkOrderDetails',
    componentType: 'Detail',
    description: 'Work order detail view component',
    priority: 'High',
  },
  WorkOrderScheduler: {
    originalName: 'WorkOrderScheduler',
    standardisedName: 'WorkOrderScheduler',
    componentType: 'Scheduler',
    description: 'Work order scheduling component',
    priority: 'High',
  },

  // Maintenance Components
  MaintenanceForm: {
    originalName: 'MaintenanceForm',
    standardisedName: 'MaintenanceForm',
    componentType: 'Form',
    description: 'Maintenance activity form',
    priority: 'High',
  },
  MaintenanceSchedule: {
    originalName: 'MaintenanceSchedule',
    standardisedName: 'MaintenanceSchedule',
    componentType: 'Schedule',
    description: 'Maintenance scheduling component',
    priority: 'High',
  },
  MaintenancePlanner: {
    originalName: 'MaintenancePlanner',
    standardisedName: 'MaintenancePlanner',
    componentType: 'Planner',
    description: 'Maintenance planning component',
    priority: 'High',
  },
  MaintenanceDashboard: {
    originalName: 'MaintenanceDashboard',
    standardisedName: 'MaintenanceDashboard',
    componentType: 'Dashboard',
    description: 'Maintenance overview dashboard',
    priority: 'High',
  },

  // Risk Management Components
  RiskAssessment: {
    originalName: 'RiskAssessment',
    standardisedName: 'RiskAssessment',
    componentType: 'Assessment',
    description: 'Risk assessment component',
    priority: 'High',
  },
  RiskAnalysis: {
    originalName: 'RiskAnalysis',
    standardisedName: 'RiskAnalysis',
    componentType: 'Analysis',
    description: 'Risk analysis component',
    priority: 'High',
  },
  RiskPlanner: {
    originalName: 'RiskPlanner',
    standardisedName: 'RiskPlanner',
    componentType: 'Planner',
    description: 'Risk planning component',
    priority: 'High',
  },
  CriticalControlPlanning: {
    originalName: 'CriticalControlPlanning',
    standardisedName: 'RiskControlPlanning',
    componentType: 'Planning',
    description: 'Critical control planning component',
    priority: 'High',
  },

  // Navigation Components
  AppSidebar: {
    originalName: 'AppSidebar',
    standardisedName: 'AppSidebar',
    componentType: 'Navigation',
    description: 'Main application sidebar navigation',
    priority: 'High',
  },
  SiteHeader: {
    originalName: 'SiteHeader',
    standardisedName: 'SiteHeader',
    componentType: 'Navigation',
    description: 'Site header navigation component',
    priority: 'High',
  },
  Breadcrumb: {
    originalName: 'Breadcrumb',
    standardisedName: 'Breadcrumb',
    componentType: 'Navigation',
    description: 'Breadcrumb navigation component',
    priority: 'High',
  },

  // User Management Components
  UserForm: {
    originalName: 'UserForm',
    standardisedName: 'UserForm',
    componentType: 'Form',
    description: 'User creation and editing form',
    priority: 'High',
  },
  UserList: {
    originalName: 'UserList',
    standardisedName: 'UserList',
    componentType: 'List',
    description: 'User listing and management component',
    priority: 'High',
  },
  UserProfile: {
    originalName: 'UserProfile',
    standardisedName: 'UserProfile',
    componentType: 'Profile',
    description: 'User profile component',
    priority: 'High',
  },
  RoleManagement: {
    originalName: 'RoleManagement',
    standardisedName: 'UserManagement',
    componentType: 'Management',
    description: 'User role management component',
    priority: 'High',
  },

  // Mobile Components
  MobileDashboard: {
    originalName: 'MobileDashboard',
    standardisedName: 'MobileDashboard',
    componentType: 'Dashboard',
    description: 'Mobile-optimised dashboard',
    priority: 'High',
  },
  FieldTool: {
    originalName: 'FieldTool',
    standardisedName: 'MobileFieldApp',
    componentType: 'Mobile',
    description: 'Mobile field application',
    priority: 'High',
  },
  MobileAssetForm: {
    originalName: 'MobileAssetForm',
    standardisedName: 'MobileAssetForm',
    componentType: 'MobileForm',
    description: 'Mobile asset form component',
    priority: 'High',
  },

  // Reporting Components
  AssetReport: {
    originalName: 'AssetReport',
    standardisedName: 'AssetReport',
    componentType: 'Report',
    description: 'Asset reporting component',
    priority: 'High',
  },
  MaintenanceReport: {
    originalName: 'MaintenanceReport',
    standardisedName: 'MaintenanceReport',
    componentType: 'Report',
    description: 'Maintenance reporting component',
    priority: 'High',
  },
  ComplianceReport: {
    originalName: 'ComplianceReport',
    standardisedName: 'ComplianceReport',
    componentType: 'Report',
    description: 'Compliance reporting component',
    priority: 'High',
  },
  PerformanceReport: {
    originalName: 'PerformanceReport',
    standardisedName: 'PerformanceReport',
    componentType: 'Report',
    description: 'Performance reporting component',
    priority: 'High',
  },
};

/**
 * Variable mappings for standardisation
 * Maps current variable names to standardised terminology
 */
export const VARIABLE_MAPPINGS: Record<string, VariableMapping> = {
  // Asset-related variables
  assetStatus: {
    originalName: 'assetStatus',
    standardisedName: 'assetStatus',
    context: 'Asset',
    description: 'Current status of an asset',
    priority: 'High',
  },
  assetCondition: {
    originalName: 'assetCondition',
    standardisedName: 'assetCondition',
    context: 'Asset',
    description: 'Physical condition of an asset',
    priority: 'High',
  },
  assetPriority: {
    originalName: 'assetPriority',
    standardisedName: 'assetPriority',
    context: 'Asset',
    description: 'Priority level of an asset',
    priority: 'High',
  },
  assetType: {
    originalName: 'assetType',
    standardisedName: 'assetType',
    context: 'Asset',
    description: 'Type classification of an asset',
    priority: 'High',
  },

  // Work Order variables
  workOrderStatus: {
    originalName: 'workOrderStatus',
    standardisedName: 'workOrderStatus',
    context: 'WorkOrder',
    description: 'Current status of a work order',
    priority: 'High',
  },
  workOrderPriority: {
    originalName: 'workOrderPriority',
    standardisedName: 'workOrderPriority',
    context: 'WorkOrder',
    description: 'Priority level of a work order',
    priority: 'High',
  },
  workOrderType: {
    originalName: 'workOrderType',
    standardisedName: 'workOrderType',
    context: 'WorkOrder',
    description: 'Type of maintenance work',
    priority: 'High',
  },
  workDescription: {
    originalName: 'workDescription',
    standardisedName: 'workDescription',
    context: 'WorkOrder',
    description: 'Description of work to be performed',
    priority: 'High',
  },

  // User-related variables
  userRole: {
    originalName: 'userRole',
    standardisedName: 'userRole',
    context: 'User',
    description: "User's role in the system",
    priority: 'High',
  },
  userId: {
    originalName: 'userId',
    standardisedName: 'userId',
    context: 'User',
    description: 'Unique user identifier',
    priority: 'High',
  },

  // Navigation variables
  strategicOverviewItems: {
    originalName: 'strategicOverviewItems',
    standardisedName: 'strategicOverviewItems',
    context: 'Navigation',
    description: 'Strategic overview navigation items',
    priority: 'High',
  },
  resilienceCommandItems: {
    originalName: 'resilienceCommandItems',
    standardisedName: 'assetPlanningItems',
    context: 'Navigation',
    description: 'Asset planning navigation items',
    priority: 'High',
  },
  operationsManagementItems: {
    originalName: 'operationsManagementItems',
    standardisedName: 'operationsManagementItems',
    context: 'Navigation',
    description: 'Operations management navigation items',
    priority: 'High',
  },
  contractorPartnerItems: {
    originalName: 'contractorPartnerItems',
    standardisedName: 'contractorPortalItems',
    context: 'Navigation',
    description: 'Contractor portal navigation items',
    priority: 'High',
  },
  communityEngagementItems: {
    originalName: 'communityEngagementItems',
    standardisedName: 'communityEngagementItems',
    context: 'Navigation',
    description: 'Community engagement navigation items',
    priority: 'High',
  },
  systemAdministrationItems: {
    originalName: 'systemAdministrationItems',
    standardisedName: 'systemAdministrationItems',
    context: 'Navigation',
    description: 'System administration navigation items',
    priority: 'High',
  },

  // System variables
  resilienceEngine: {
    originalName: 'resilienceEngine',
    standardisedName: 'assetIntelligenceEngine',
    context: 'System',
    description: 'Core system for asset intelligence',
    priority: 'High',
  },
  marginManagement: {
    originalName: 'marginManagement',
    standardisedName: 'resourceManagement',
    context: 'System',
    description: 'Resource allocation and management',
    priority: 'High',
  },
  riskRhythm: {
    originalName: 'riskRhythm',
    standardisedName: 'maintenanceScheduling',
    context: 'System',
    description: 'Risk-based maintenance scheduling',
    priority: 'High',
  },
  signalProcessing: {
    originalName: 'signalProcessing',
    standardisedName: 'eventProcessing',
    context: 'System',
    description: 'Processing of system events',
    priority: 'High',
  },
  antifragileSystem: {
    originalName: 'antifragileSystem',
    standardisedName: 'adaptiveSystem',
    context: 'System',
    description: 'System that improves under stress',
    priority: 'High',
  },
  marginOperations: {
    originalName: 'marginOperations',
    standardisedName: 'resourceOperations',
    context: 'System',
    description: 'Resource deployment operations',
    priority: 'High',
  },
  assetLookup: {
    originalName: 'assetLookup',
    standardisedName: 'assetSearch',
    context: 'System',
    description: 'Asset search and retrieval',
    priority: 'High',
  },
  fieldTool: {
    originalName: 'fieldTool',
    standardisedName: 'mobileFieldApp',
    context: 'System',
    description: 'Mobile field application',
    priority: 'High',
  },
  workSessions: {
    originalName: 'workSessions',
    standardisedName: 'workTracking',
    context: 'System',
    description: 'Work activity tracking',
    priority: 'High',
  },
};

/**
 * Get standardised component name
 * @param componentName - The current component name
 * @returns The standardised component mapping or null if not found
 */
export function getStandardisedComponent(
  componentName: string
): ComponentMapping | null {
  return COMPONENT_MAPPINGS[componentName] || null;
}

/**
 * Get standardised variable name
 * @param variableName - The current variable name
 * @returns The standardised variable mapping or null if not found
 */
export function getStandardisedVariable(
  variableName: string
): VariableMapping | null {
  return VARIABLE_MAPPINGS[variableName] || null;
}

/**
 * Transform component name to standardised terminology
 * @param componentName - The current component name
 * @returns The standardised component name or original if no mapping found
 */
export function transformComponentName(componentName: string): string {
  const mapping = getStandardisedComponent(componentName);
  return mapping ? mapping.standardisedName : componentName;
}

/**
 * Transform variable name to standardised terminology
 * @param variableName - The current variable name
 * @returns The standardised variable name or original if no mapping found
 */
export function transformVariableName(variableName: string): string {
  const mapping = getStandardisedVariable(variableName);
  return mapping ? mapping.standardisedName : variableName;
}

/**
 * Get all component mappings by type
 * @param componentType - The component type to filter by
 * @returns Array of component mappings for the type
 */
export function getComponentsByType(componentType: string): ComponentMapping[] {
  return Object.values(COMPONENT_MAPPINGS).filter(
    mapping => mapping.componentType === componentType
  );
}

/**
 * Get all variable mappings by context
 * @param context - The context to filter by
 * @returns Array of variable mappings for the context
 */
export function getVariablesByContext(context: string): VariableMapping[] {
  return Object.values(VARIABLE_MAPPINGS).filter(
    mapping => mapping.context === context
  );
}

/**
 * Get high priority component mappings
 * @returns Array of high priority component mappings
 */
export function getHighPriorityComponents(): ComponentMapping[] {
  return Object.values(COMPONENT_MAPPINGS).filter(
    mapping => mapping.priority === 'High'
  );
}

/**
 * Get high priority variable mappings
 * @returns Array of high priority variable mappings
 */
export function getHighPriorityVariables(): VariableMapping[] {
  return Object.values(VARIABLE_MAPPINGS).filter(
    mapping => mapping.priority === 'High'
  );
}

/**
 * Get component standardisation statistics
 * @returns Statistics object with counts by type and priority
 */
export function getComponentStandardisationStats() {
  const componentMappings = Object.values(COMPONENT_MAPPINGS);
  const variableMappings = Object.values(VARIABLE_MAPPINGS);

  const componentsByType = componentMappings.reduce(
    (acc, mapping) => {
      acc[mapping.componentType] = (acc[mapping.componentType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const componentsByPriority = componentMappings.reduce(
    (acc, mapping) => {
      acc[mapping.priority] = (acc[mapping.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const variablesByContext = variableMappings.reduce(
    (acc, mapping) => {
      acc[mapping.context] = (acc[mapping.context] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const variablesByPriority = variableMappings.reduce(
    (acc, mapping) => {
      acc[mapping.priority] = (acc[mapping.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total: componentMappings.length + variableMappings.length,
    components: {
      total: componentMappings.length,
      byType: componentsByType,
      byPriority: componentsByPriority,
      highPriority: componentMappings.filter(m => m.priority === 'High').length,
    },
    variables: {
      total: variableMappings.length,
      byContext: variablesByContext,
      byPriority: variablesByPriority,
      highPriority: variableMappings.filter(m => m.priority === 'High').length,
    },
  };
}
