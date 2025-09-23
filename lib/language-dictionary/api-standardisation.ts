/**
 * Epic 24: Language Simplification & Visualisation Enhancement
 * API Endpoint Standardisation Utility
 *
 * Provides utilities to standardise API endpoints and function names
 * using the comprehensive language dictionary mappings.
 *
 * @file api-standardisation.ts
 * @version 1.0.0
 * @author Aegrid Development Team
 */

export interface ApiEndpointMapping {
  originalEndpoint: string;
  standardisedEndpoint: string;
  method: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}

export interface ApiFunctionMapping {
  originalFunction: string;
  standardisedFunction: string;
  context: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

/**
 * API endpoint mappings for standardisation
 * Maps current API endpoints to standardised terminology
 */
export const API_ENDPOINT_MAPPINGS: Record<string, ApiEndpointMapping> = {
  // Asset Management API Endpoints
  '/api/assets': {
    originalEndpoint: '/api/assets',
    standardisedEndpoint: '/api/assets',
    method: 'GET',
    description: 'Get all assets',
    priority: 'High',
    category: 'AssetManagement',
  },
  '/api/assets/create': {
    originalEndpoint: '/api/assets/create',
    standardisedEndpoint: '/api/assets/create',
    method: 'POST',
    description: 'Create new asset',
    priority: 'High',
    category: 'AssetManagement',
  },
  '/api/assets/[id]': {
    originalEndpoint: '/api/assets/[id]',
    standardisedEndpoint: '/api/assets/[id]',
    method: 'GET',
    description: 'Get asset by ID',
    priority: 'High',
    category: 'AssetManagement',
  },
  '/api/assets/[id]/update': {
    originalEndpoint: '/api/assets/[id]/update',
    standardisedEndpoint: '/api/assets/[id]/update',
    method: 'PUT',
    description: 'Update asset',
    priority: 'High',
    category: 'AssetManagement',
  },
  '/api/assets/[id]/delete': {
    originalEndpoint: '/api/assets/[id]/delete',
    standardisedEndpoint: '/api/assets/[id]/delete',
    method: 'DELETE',
    description: 'Delete asset',
    priority: 'High',
    category: 'AssetManagement',
  },
  '/api/assets/search': {
    originalEndpoint: '/api/assets/search',
    standardisedEndpoint: '/api/assets/search',
    method: 'GET',
    description: 'Search assets',
    priority: 'High',
    category: 'AssetManagement',
  },
  '/api/assets/register': {
    originalEndpoint: '/api/assets/register',
    standardisedEndpoint: '/api/assets/register',
    method: 'GET',
    description: 'Get asset register',
    priority: 'High',
    category: 'AssetManagement',
  },
  '/api/assets/map': {
    originalEndpoint: '/api/assets/map',
    standardisedEndpoint: '/api/assets/map',
    method: 'GET',
    description: 'Get asset map data',
    priority: 'High',
    category: 'AssetManagement',
  },

  // Work Order API Endpoints
  '/api/work-orders': {
    originalEndpoint: '/api/work-orders',
    standardisedEndpoint: '/api/work-orders',
    method: 'GET',
    description: 'Get all work orders',
    priority: 'High',
    category: 'WorkOrderManagement',
  },
  '/api/work-orders/create': {
    originalEndpoint: '/api/work-orders/create',
    standardisedEndpoint: '/api/work-orders/create',
    method: 'POST',
    description: 'Create new work order',
    priority: 'High',
    category: 'WorkOrderManagement',
  },
  '/api/work-orders/[id]': {
    originalEndpoint: '/api/work-orders/[id]',
    standardisedEndpoint: '/api/work-orders/[id]',
    method: 'GET',
    description: 'Get work order by ID',
    priority: 'High',
    category: 'WorkOrderManagement',
  },
  '/api/work-orders/[id]/update': {
    originalEndpoint: '/api/work-orders/[id]/update',
    standardisedEndpoint: '/api/work-orders/[id]/update',
    method: 'PUT',
    description: 'Update work order',
    priority: 'High',
    category: 'WorkOrderManagement',
  },
  '/api/work-orders/[id]/complete': {
    originalEndpoint: '/api/work-orders/[id]/complete',
    standardisedEndpoint: '/api/work-orders/[id]/complete',
    method: 'PUT',
    description: 'Complete work order',
    priority: 'High',
    category: 'WorkOrderManagement',
  },
  '/api/work-orders/schedule': {
    originalEndpoint: '/api/work-orders/schedule',
    standardisedEndpoint: '/api/work-orders/schedule',
    method: 'GET',
    description: 'Get work order schedule',
    priority: 'High',
    category: 'WorkOrderManagement',
  },

  // Maintenance API Endpoints
  '/api/maintenance': {
    originalEndpoint: '/api/maintenance',
    standardisedEndpoint: '/api/maintenance',
    method: 'GET',
    description: 'Get maintenance activities',
    priority: 'High',
    category: 'MaintenanceManagement',
  },
  '/api/maintenance/schedule': {
    originalEndpoint: '/api/maintenance/schedule',
    standardisedEndpoint: '/api/maintenance/schedule',
    method: 'GET',
    description: 'Get maintenance schedule',
    priority: 'High',
    category: 'MaintenanceManagement',
  },
  '/api/maintenance/planner': {
    originalEndpoint: '/api/maintenance/planner',
    standardisedEndpoint: '/api/maintenance/planner',
    method: 'GET',
    description: 'Get maintenance planning data',
    priority: 'High',
    category: 'MaintenanceManagement',
  },
  '/api/maintenance/templates': {
    originalEndpoint: '/api/maintenance/templates',
    standardisedEndpoint: '/api/maintenance/templates',
    method: 'GET',
    description: 'Get maintenance templates',
    priority: 'High',
    category: 'MaintenanceManagement',
  },

  // Risk Management API Endpoints
  '/api/risk-assessment': {
    originalEndpoint: '/api/risk-assessment',
    standardisedEndpoint: '/api/risk-assessment',
    method: 'GET',
    description: 'Get risk assessment data',
    priority: 'High',
    category: 'RiskManagement',
  },
  '/api/risk-analysis': {
    originalEndpoint: '/api/risk-analysis',
    standardisedEndpoint: '/api/risk-analysis',
    method: 'GET',
    description: 'Get risk analysis data',
    priority: 'High',
    category: 'RiskManagement',
  },
  '/api/risk-planner': {
    originalEndpoint: '/api/risk-planner',
    standardisedEndpoint: '/api/risk-planner',
    method: 'GET',
    description: 'Get risk planning data',
    priority: 'High',
    category: 'RiskManagement',
  },
  '/api/critical-controls': {
    originalEndpoint: '/api/critical-controls',
    standardisedEndpoint: '/api/risk-controls',
    method: 'GET',
    description: 'Get critical risk controls',
    priority: 'High',
    category: 'RiskManagement',
  },

  // Dashboard API Endpoints
  '/api/dashboard/strategic': {
    originalEndpoint: '/api/dashboard/strategic',
    standardisedEndpoint: '/api/dashboard/executive',
    method: 'GET',
    description: 'Get executive dashboard data',
    priority: 'High',
    category: 'Dashboard',
  },
  '/api/dashboard/manager': {
    originalEndpoint: '/api/dashboard/manager',
    standardisedEndpoint: '/api/dashboard/manager',
    method: 'GET',
    description: 'Get manager dashboard data',
    priority: 'High',
    category: 'Dashboard',
  },
  '/api/dashboard/performance': {
    originalEndpoint: '/api/dashboard/performance',
    standardisedEndpoint: '/api/dashboard/performance',
    method: 'GET',
    description: 'Get performance dashboard data',
    priority: 'High',
    category: 'Dashboard',
  },
  '/api/dashboard/metrics': {
    originalEndpoint: '/api/dashboard/metrics',
    standardisedEndpoint: '/api/dashboard/metrics',
    method: 'GET',
    description: 'Get dashboard metrics',
    priority: 'High',
    category: 'Dashboard',
  },

  // Reporting API Endpoints
  '/api/reports/asset': {
    originalEndpoint: '/api/reports/asset',
    standardisedEndpoint: '/api/reports/asset',
    method: 'GET',
    description: 'Generate asset reports',
    priority: 'High',
    category: 'Reporting',
  },
  '/api/reports/maintenance': {
    originalEndpoint: '/api/reports/maintenance',
    standardisedEndpoint: '/api/reports/maintenance',
    method: 'GET',
    description: 'Generate maintenance reports',
    priority: 'High',
    category: 'Reporting',
  },
  '/api/reports/compliance': {
    originalEndpoint: '/api/reports/compliance',
    standardisedEndpoint: '/api/reports/compliance',
    method: 'GET',
    description: 'Generate compliance reports',
    priority: 'High',
    category: 'Reporting',
  },
  '/api/reports/executive': {
    originalEndpoint: '/api/reports/executive',
    standardisedEndpoint: '/api/reports/executive',
    method: 'GET',
    description: 'Generate executive reports',
    priority: 'High',
    category: 'Reporting',
  },

  // User Management API Endpoints
  '/api/users': {
    originalEndpoint: '/api/users',
    standardisedEndpoint: '/api/users',
    method: 'GET',
    description: 'Get all users',
    priority: 'High',
    category: 'UserManagement',
  },
  '/api/users/create': {
    originalEndpoint: '/api/users/create',
    standardisedEndpoint: '/api/users/create',
    method: 'POST',
    description: 'Create new user',
    priority: 'High',
    category: 'UserManagement',
  },
  '/api/users/[id]': {
    originalEndpoint: '/api/users/[id]',
    standardisedEndpoint: '/api/users/[id]',
    method: 'GET',
    description: 'Get user by ID',
    priority: 'High',
    category: 'UserManagement',
  },
  '/api/users/[id]/update': {
    originalEndpoint: '/api/users/[id]/update',
    standardisedEndpoint: '/api/users/[id]/update',
    method: 'PUT',
    description: 'Update user',
    priority: 'High',
    category: 'UserManagement',
  },
  '/api/users/roles': {
    originalEndpoint: '/api/users/roles',
    standardisedEndpoint: '/api/users/roles',
    method: 'GET',
    description: 'Get user roles',
    priority: 'High',
    category: 'UserManagement',
  },

  // System Management API Endpoints
  '/api/admin/dashboard': {
    originalEndpoint: '/api/admin/dashboard',
    standardisedEndpoint: '/api/admin/dashboard',
    method: 'GET',
    description: 'Get admin dashboard data',
    priority: 'High',
    category: 'SystemManagement',
  },
  '/api/admin/audit': {
    originalEndpoint: '/api/admin/audit',
    standardisedEndpoint: '/api/admin/audit',
    method: 'GET',
    description: 'Get audit logs',
    priority: 'High',
    category: 'SystemManagement',
  },
  '/api/admin/security': {
    originalEndpoint: '/api/admin/security',
    standardisedEndpoint: '/api/admin/security',
    method: 'GET',
    description: 'Get security dashboard data',
    priority: 'High',
    category: 'SystemManagement',
  },
  '/api/admin/settings': {
    originalEndpoint: '/api/admin/settings',
    standardisedEndpoint: '/api/admin/settings',
    method: 'GET',
    description: 'Get system settings',
    priority: 'High',
    category: 'SystemManagement',
  },

  // Mobile API Endpoints
  '/api/mobile/dashboard': {
    originalEndpoint: '/api/mobile/dashboard',
    standardisedEndpoint: '/api/mobile/dashboard',
    method: 'GET',
    description: 'Get mobile dashboard data',
    priority: 'High',
    category: 'Mobile',
  },
  '/api/mobile/field-app': {
    originalEndpoint: '/api/mobile/field-app',
    standardisedEndpoint: '/api/mobile/field-app',
    method: 'GET',
    description: 'Get mobile field app data',
    priority: 'High',
    category: 'Mobile',
  },
  '/api/mobile/inspections': {
    originalEndpoint: '/api/mobile/inspections',
    standardisedEndpoint: '/api/mobile/inspections',
    method: 'GET',
    description: 'Get mobile inspection data',
    priority: 'High',
    category: 'Mobile',
  },
  '/api/mobile/work-tracking': {
    originalEndpoint: '/api/mobile/work-sessions',
    standardisedEndpoint: '/api/mobile/work-tracking',
    method: 'GET',
    description: 'Get mobile work tracking data',
    priority: 'High',
    category: 'Mobile',
  },

  // Community API Endpoints
  '/api/citizen/reports': {
    originalEndpoint: '/api/citizen/reports',
    standardisedEndpoint: '/api/citizen/reports',
    method: 'GET',
    description: 'Get citizen reports',
    priority: 'High',
    category: 'Community',
  },
  '/api/citizen/portal': {
    originalEndpoint: '/api/citizen/portal',
    standardisedEndpoint: '/api/citizen/portal',
    method: 'GET',
    description: 'Get citizen portal data',
    priority: 'High',
    category: 'Community',
  },
  '/api/citizen/track-requests': {
    originalEndpoint: '/api/citizen/track-requests',
    standardisedEndpoint: '/api/citizen/track-requests',
    method: 'GET',
    description: 'Track citizen requests',
    priority: 'High',
    category: 'Community',
  },

  // Contractor API Endpoints
  '/api/contractor/dashboard': {
    originalEndpoint: '/api/contractor/dashboard',
    standardisedEndpoint: '/api/contractor/dashboard',
    method: 'GET',
    description: 'Get contractor dashboard data',
    priority: 'High',
    category: 'Contractor',
  },
  '/api/contractor/work-orders': {
    originalEndpoint: '/api/contractor/work-orders',
    standardisedEndpoint: '/api/contractor/work-orders',
    method: 'GET',
    description: 'Get contractor work orders',
    priority: 'High',
    category: 'Contractor',
  },
  '/api/contractor/performance': {
    originalEndpoint: '/api/contractor/performance',
    standardisedEndpoint: '/api/contractor/performance',
    method: 'GET',
    description: 'Get contractor performance metrics',
    priority: 'High',
    category: 'Contractor',
  },
  '/api/contractor/capacity': {
    originalEndpoint: '/api/contractor/capacity',
    standardisedEndpoint: '/api/contractor/capacity',
    method: 'GET',
    description: 'Get contractor capacity management',
    priority: 'High',
    category: 'Contractor',
  },
};

/**
 * API function mappings for standardisation
 * Maps current API function names to standardised terminology
 */
export const API_FUNCTION_MAPPINGS: Record<string, ApiFunctionMapping> = {
  // Asset Management Functions
  getAllAssets: {
    originalFunction: 'getAllAssets',
    standardisedFunction: 'getAllAssets',
    context: 'AssetManagement',
    description: 'Retrieve all assets',
    priority: 'High',
  },
  createAsset: {
    originalFunction: 'createAsset',
    standardisedFunction: 'createAsset',
    context: 'AssetManagement',
    description: 'Create new asset',
    priority: 'High',
  },
  getAssetById: {
    originalFunction: 'getAssetById',
    standardisedFunction: 'getAssetById',
    context: 'AssetManagement',
    description: 'Get asset by ID',
    priority: 'High',
  },
  updateAsset: {
    originalFunction: 'updateAsset',
    standardisedFunction: 'updateAsset',
    context: 'AssetManagement',
    description: 'Update asset',
    priority: 'High',
  },
  deleteAsset: {
    originalFunction: 'deleteAsset',
    standardisedFunction: 'deleteAsset',
    context: 'AssetManagement',
    description: 'Delete asset',
    priority: 'High',
  },
  searchAssets: {
    originalFunction: 'searchAssets',
    standardisedFunction: 'searchAssets',
    context: 'AssetManagement',
    description: 'Search assets',
    priority: 'High',
  },
  getAssetRegister: {
    originalFunction: 'getAssetRegister',
    standardisedFunction: 'getAssetRegister',
    context: 'AssetManagement',
    description: 'Get asset register',
    priority: 'High',
  },
  getAssetMapData: {
    originalFunction: 'getAssetMapData',
    standardisedFunction: 'getAssetMapData',
    context: 'AssetManagement',
    description: 'Get asset map data',
    priority: 'High',
  },

  // Work Order Functions
  getAllWorkOrders: {
    originalFunction: 'getAllWorkOrders',
    standardisedFunction: 'getAllWorkOrders',
    context: 'WorkOrderManagement',
    description: 'Retrieve all work orders',
    priority: 'High',
  },
  createWorkOrder: {
    originalFunction: 'createWorkOrder',
    standardisedFunction: 'createWorkOrder',
    context: 'WorkOrderManagement',
    description: 'Create new work order',
    priority: 'High',
  },
  getWorkOrderById: {
    originalFunction: 'getWorkOrderById',
    standardisedFunction: 'getWorkOrderById',
    context: 'WorkOrderManagement',
    description: 'Get work order by ID',
    priority: 'High',
  },
  updateWorkOrder: {
    originalFunction: 'updateWorkOrder',
    standardisedFunction: 'updateWorkOrder',
    context: 'WorkOrderManagement',
    description: 'Update work order',
    priority: 'High',
  },
  completeWorkOrder: {
    originalFunction: 'completeWorkOrder',
    standardisedFunction: 'completeWorkOrder',
    context: 'WorkOrderManagement',
    description: 'Complete work order',
    priority: 'High',
  },
  getWorkOrderSchedule: {
    originalFunction: 'getWorkOrderSchedule',
    standardisedFunction: 'getWorkOrderSchedule',
    context: 'WorkOrderManagement',
    description: 'Get work order schedule',
    priority: 'High',
  },

  // Maintenance Functions
  getMaintenanceActivities: {
    originalFunction: 'getMaintenanceActivities',
    standardisedFunction: 'getMaintenanceActivities',
    context: 'MaintenanceManagement',
    description: 'Get maintenance activities',
    priority: 'High',
  },
  getMaintenanceSchedule: {
    originalFunction: 'getMaintenanceSchedule',
    standardisedFunction: 'getMaintenanceSchedule',
    context: 'MaintenanceManagement',
    description: 'Get maintenance schedule',
    priority: 'High',
  },
  getMaintenancePlanner: {
    originalFunction: 'getMaintenancePlanner',
    standardisedFunction: 'getMaintenancePlanner',
    context: 'MaintenanceManagement',
    description: 'Get maintenance planning data',
    priority: 'High',
  },
  getMaintenanceTemplates: {
    originalFunction: 'getMaintenanceTemplates',
    standardisedFunction: 'getMaintenanceTemplates',
    context: 'MaintenanceManagement',
    description: 'Get maintenance templates',
    priority: 'High',
  },

  // Risk Management Functions
  getRiskAssessment: {
    originalFunction: 'getRiskAssessment',
    standardisedFunction: 'getRiskAssessment',
    context: 'RiskManagement',
    description: 'Get risk assessment data',
    priority: 'High',
  },
  getRiskAnalysis: {
    originalFunction: 'getRiskAnalysis',
    standardisedFunction: 'getRiskAnalysis',
    context: 'RiskManagement',
    description: 'Get risk analysis data',
    priority: 'High',
  },
  getRiskPlanner: {
    originalFunction: 'getRiskPlanner',
    standardisedFunction: 'getRiskPlanner',
    context: 'RiskManagement',
    description: 'Get risk planning data',
    priority: 'High',
  },
  getCriticalControls: {
    originalFunction: 'getCriticalControls',
    standardisedFunction: 'getRiskControls',
    context: 'RiskManagement',
    description: 'Get critical risk controls',
    priority: 'High',
  },

  // Dashboard Functions
  getStrategicDashboard: {
    originalFunction: 'getStrategicDashboard',
    standardisedFunction: 'getExecutiveDashboard',
    context: 'Dashboard',
    description: 'Get executive dashboard data',
    priority: 'High',
  },
  getManagerDashboard: {
    originalFunction: 'getManagerDashboard',
    standardisedFunction: 'getManagerDashboard',
    context: 'Dashboard',
    description: 'Get manager dashboard data',
    priority: 'High',
  },
  getPerformanceDashboard: {
    originalFunction: 'getPerformanceDashboard',
    standardisedFunction: 'getPerformanceDashboard',
    context: 'Dashboard',
    description: 'Get performance dashboard data',
    priority: 'High',
  },
  getDashboardMetrics: {
    originalFunction: 'getDashboardMetrics',
    standardisedFunction: 'getDashboardMetrics',
    context: 'Dashboard',
    description: 'Get dashboard metrics',
    priority: 'High',
  },

  // Reporting Functions
  generateAssetReport: {
    originalFunction: 'generateAssetReport',
    standardisedFunction: 'generateAssetReport',
    context: 'Reporting',
    description: 'Generate asset reports',
    priority: 'High',
  },
  generateMaintenanceReport: {
    originalFunction: 'generateMaintenanceReport',
    standardisedFunction: 'generateMaintenanceReport',
    context: 'Reporting',
    description: 'Generate maintenance reports',
    priority: 'High',
  },
  generateComplianceReport: {
    originalFunction: 'generateComplianceReport',
    standardisedFunction: 'generateComplianceReport',
    context: 'Reporting',
    description: 'Generate compliance reports',
    priority: 'High',
  },
  generateExecutiveReport: {
    originalFunction: 'generateExecutiveReport',
    standardisedFunction: 'generateExecutiveReport',
    context: 'Reporting',
    description: 'Generate executive reports',
    priority: 'High',
  },

  // User Management Functions
  getAllUsers: {
    originalFunction: 'getAllUsers',
    standardisedFunction: 'getAllUsers',
    context: 'UserManagement',
    description: 'Retrieve all users',
    priority: 'High',
  },
  createUser: {
    originalFunction: 'createUser',
    standardisedFunction: 'createUser',
    context: 'UserManagement',
    description: 'Create new user',
    priority: 'High',
  },
  getUserById: {
    originalFunction: 'getUserById',
    standardisedFunction: 'getUserById',
    context: 'UserManagement',
    description: 'Get user by ID',
    priority: 'High',
  },
  updateUser: {
    originalFunction: 'updateUser',
    standardisedFunction: 'updateUser',
    context: 'UserManagement',
    description: 'Update user',
    priority: 'High',
  },
  getUserRoles: {
    originalFunction: 'getUserRoles',
    standardisedFunction: 'getUserRoles',
    context: 'UserManagement',
    description: 'Get user roles',
    priority: 'High',
  },

  // System Management Functions
  getAdminDashboard: {
    originalFunction: 'getAdminDashboard',
    standardisedFunction: 'getAdminDashboard',
    context: 'SystemManagement',
    description: 'Get admin dashboard data',
    priority: 'High',
  },
  getAuditLogs: {
    originalFunction: 'getAuditLogs',
    standardisedFunction: 'getAuditLogs',
    context: 'SystemManagement',
    description: 'Get audit logs',
    priority: 'High',
  },
  getSecurityDashboard: {
    originalFunction: 'getSecurityDashboard',
    standardisedFunction: 'getSecurityDashboard',
    context: 'SystemManagement',
    description: 'Get security dashboard data',
    priority: 'High',
  },
  getSystemSettings: {
    originalFunction: 'getSystemSettings',
    standardisedFunction: 'getSystemSettings',
    context: 'SystemManagement',
    description: 'Get system settings',
    priority: 'High',
  },

  // Mobile Functions
  getMobileDashboard: {
    originalFunction: 'getMobileDashboard',
    standardisedFunction: 'getMobileDashboard',
    context: 'Mobile',
    description: 'Get mobile dashboard data',
    priority: 'High',
  },
  getMobileFieldApp: {
    originalFunction: 'getFieldTool',
    standardisedFunction: 'getMobileFieldApp',
    context: 'Mobile',
    description: 'Get mobile field app data',
    priority: 'High',
  },
  getMobileInspections: {
    originalFunction: 'getMobileInspections',
    standardisedFunction: 'getMobileInspections',
    context: 'Mobile',
    description: 'Get mobile inspection data',
    priority: 'High',
  },
  getMobileWorkSessions: {
    originalFunction: 'getWorkSessions',
    standardisedFunction: 'getWorkTracking',
    context: 'Mobile',
    description: 'Get mobile work tracking data',
    priority: 'High',
  },

  // Community Functions
  getCitizenReports: {
    originalFunction: 'getCitizenReports',
    standardisedFunction: 'getCitizenReports',
    context: 'Community',
    description: 'Get citizen reports',
    priority: 'High',
  },
  getCitizenPortal: {
    originalFunction: 'getCitizenPortal',
    standardisedFunction: 'getCitizenPortal',
    context: 'Community',
    description: 'Get citizen portal data',
    priority: 'High',
  },
  trackCitizenRequests: {
    originalFunction: 'trackCitizenRequests',
    standardisedFunction: 'trackCitizenRequests',
    context: 'Community',
    description: 'Track citizen requests',
    priority: 'High',
  },

  // Contractor Functions
  getContractorDashboard: {
    originalFunction: 'getContractorDashboard',
    standardisedFunction: 'getContractorDashboard',
    context: 'Contractor',
    description: 'Get contractor dashboard data',
    priority: 'High',
  },
  getContractorWorkOrders: {
    originalFunction: 'getContractorWorkOrders',
    standardisedFunction: 'getContractorWorkOrders',
    context: 'Contractor',
    description: 'Get contractor work orders',
    priority: 'High',
  },
  getContractorPerformance: {
    originalFunction: 'getContractorPerformance',
    standardisedFunction: 'getContractorPerformance',
    context: 'Contractor',
    description: 'Get contractor performance metrics',
    priority: 'High',
  },
  getContractorCapacity: {
    originalFunction: 'getContractorCapacity',
    standardisedFunction: 'getContractorCapacity',
    context: 'Contractor',
    description: 'Get contractor capacity management',
    priority: 'High',
  },
};

/**
 * Get standardised API endpoint
 * @param endpoint - The current API endpoint
 * @returns The standardised endpoint mapping or null if not found
 */
export function getStandardisedEndpoint(
  endpoint: string
): ApiEndpointMapping | null {
  return API_ENDPOINT_MAPPINGS[endpoint] || null;
}

/**
 * Get standardised API function
 * @param functionName - The current API function name
 * @returns The standardised function mapping or null if not found
 */
export function getStandardisedApiFunction(
  functionName: string
): ApiFunctionMapping | null {
  return API_FUNCTION_MAPPINGS[functionName] || null;
}

/**
 * Transform API endpoint to standardised terminology
 * @param endpoint - The current API endpoint
 * @returns The standardised endpoint or original if no mapping found
 */
export function transformApiEndpoint(endpoint: string): string {
  const mapping = getStandardisedEndpoint(endpoint);
  return mapping ? mapping.standardisedEndpoint : endpoint;
}

/**
 * Transform API function name to standardised terminology
 * @param functionName - The current API function name
 * @returns The standardised function name or original if no mapping found
 */
export function transformApiFunction(functionName: string): string {
  const mapping = getStandardisedApiFunction(functionName);
  return mapping ? mapping.standardisedFunction : functionName;
}

/**
 * Get all API endpoints by category
 * @param category - The category to filter by
 * @returns Array of API endpoint mappings for the category
 */
export function getEndpointsByCategory(category: string): ApiEndpointMapping[] {
  return Object.values(API_ENDPOINT_MAPPINGS).filter(
    mapping => mapping.category === category
  );
}

/**
 * Get all API functions by context
 * @param context - The context to filter by
 * @returns Array of API function mappings for the context
 */
export function getFunctionsByContext(context: string): ApiFunctionMapping[] {
  return Object.values(API_FUNCTION_MAPPINGS).filter(
    mapping => mapping.context === context
  );
}

/**
 * Get high priority API endpoints
 * @returns Array of high priority API endpoint mappings
 */
export function getHighPriorityEndpoints(): ApiEndpointMapping[] {
  return Object.values(API_ENDPOINT_MAPPINGS).filter(
    mapping => mapping.priority === 'High'
  );
}

/**
 * Get high priority API functions
 * @returns Array of high priority API function mappings
 */
export function getHighPriorityFunctions(): ApiFunctionMapping[] {
  return Object.values(API_FUNCTION_MAPPINGS).filter(
    mapping => mapping.priority === 'High'
  );
}

/**
 * Get API standardisation statistics
 * @returns Statistics object with counts by category and priority
 */
export function getApiStandardisationStats() {
  const endpointMappings = Object.values(API_ENDPOINT_MAPPINGS);
  const functionMappings = Object.values(API_FUNCTION_MAPPINGS);

  const endpointsByCategory = endpointMappings.reduce(
    (acc, mapping) => {
      acc[mapping.category] = (acc[mapping.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const endpointsByPriority = endpointMappings.reduce(
    (acc, mapping) => {
      acc[mapping.priority] = (acc[mapping.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const functionsByContext = functionMappings.reduce(
    (acc, mapping) => {
      acc[mapping.context] = (acc[mapping.context] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const functionsByPriority = functionMappings.reduce(
    (acc, mapping) => {
      acc[mapping.priority] = (acc[mapping.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total: endpointMappings.length + functionMappings.length,
    endpoints: {
      total: endpointMappings.length,
      byCategory: endpointsByCategory,
      byPriority: endpointsByPriority,
      highPriority: endpointMappings.filter(m => m.priority === 'High').length,
    },
    functions: {
      total: functionMappings.length,
      byContext: functionsByContext,
      byPriority: functionsByPriority,
      highPriority: functionMappings.filter(m => m.priority === 'High').length,
    },
  };
}
