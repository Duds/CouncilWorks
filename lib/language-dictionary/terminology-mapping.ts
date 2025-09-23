/**
 * Epic 24: Language Simplification & Visualisation Enhancement
 * Terminology Mapping System
 *
 * This module provides comprehensive terminology mapping from current terms
 * to standardised industry terms as defined in the language dictionary.
 *
 * @file terminology-mapping.ts
 * @version 1.0.0
 * @author Aegrid Development Team
 */

export interface TerminologyMapping {
  asIs: string;
  toBe: string;
  definition: string;
  context: string;
  priority: 'High' | 'Medium' | 'Low';
  category: TerminologyCategory;
}

export type TerminologyCategory =
  | 'asset_management'
  | 'maintenance_management'
  | 'risk_management'
  | 'database_fields'
  | 'ui_labels'
  | 'navigation'
  | 'api_endpoints'
  | 'component_names'
  | 'status_priority'
  | 'user_roles'
  | 'technical_system';

/**
 * Comprehensive terminology mapping based on language dictionary
 * Maps current terms to standardised industry terminology
 */
export const TERMINOLOGY_MAPPING: Record<string, TerminologyMapping> = {
  // Asset Management Core Terms
  Asset: {
    asIs: 'Asset',
    toBe: 'Asset',
    definition: 'Physical or logical entity that has value to an organisation',
    context: 'Database models, UI labels',
    priority: 'High',
    category: 'asset_management',
  },
  'Asset Register': {
    asIs: 'Asset Register',
    toBe: 'Asset Register',
    definition: 'Comprehensive inventory of all assets under management',
    context: 'Navigation, reports',
    priority: 'High',
    category: 'asset_management',
  },
  'Asset Hierarchy': {
    asIs: 'Asset Hierarchy',
    toBe: 'Asset Hierarchy',
    definition: 'Structured organisation of assets showing relationships',
    context: 'Database schema, UI',
    priority: 'High',
    category: 'asset_management',
  },

  // Maintenance Management Terms
  'Work Order': {
    asIs: 'Work Order',
    toBe: 'Work Order',
    definition: 'Authorisation to perform maintenance work on an asset',
    context: 'Database model, UI',
    priority: 'High',
    category: 'maintenance_management',
  },
  'Maintenance Schedule': {
    asIs: 'Maintenance Schedule',
    toBe: 'Maintenance Schedule',
    definition: 'Planned sequence of maintenance activities',
    context: 'Planning, scheduling',
    priority: 'High',
    category: 'maintenance_management',
  },
  'Preventive Maintenance': {
    asIs: 'Preventive Maintenance',
    toBe: 'Preventive Maintenance',
    definition: 'Maintenance performed at predetermined intervals',
    context: 'Scheduling, planning',
    priority: 'High',
    category: 'maintenance_management',
  },

  // Risk Management Terms - Key Simplifications
  'Risk Rhythm': {
    asIs: 'Risk Rhythm',
    toBe: 'Maintenance Scheduling',
    definition: 'Regular pattern of risk-based maintenance activities',
    context: 'Resilience planning',
    priority: 'High',
    category: 'risk_management',
  },
  'Margin Management Risk': {
    asIs: 'Margin Management',
    toBe: 'Resource Management',
    definition: 'Management of available resources for risk response',
    context: 'Resilience planning',
    priority: 'High',
    category: 'risk_management',
  },
  'Margin Operations': {
    asIs: 'Margin Operations',
    toBe: 'Resource Operations',
    definition: 'Resource deployment operations',
    context: 'System component',
    priority: 'High',
    category: 'risk_management',
  },

  // Navigation Groups - Key Simplifications
  'Strategic Overview': {
    asIs: 'Strategic Overview',
    toBe: 'Strategic Overview',
    definition: 'High-level executive dashboard and reporting',
    context: 'Sidebar navigation',
    priority: 'High',
    category: 'navigation',
  },
  'Resilience Command': {
    asIs: 'Resilience Command',
    toBe: 'Asset Planning',
    definition: 'Asset planning and risk management functions',
    context: 'Sidebar navigation',
    priority: 'High',
    category: 'navigation',
  },
  'Operations Management': {
    asIs: 'Operations Management',
    toBe: 'Operations Management',
    definition: 'Day-to-day operational activities',
    context: 'Sidebar navigation',
    priority: 'High',
    category: 'navigation',
  },
  'Contractor/Partner Portal': {
    asIs: 'Contractor/Partner Portal',
    toBe: 'Contractor Portal',
    definition: 'External contractor access and management',
    context: 'Sidebar navigation',
    priority: 'High',
    category: 'navigation',
  },
  'Community Engagement': {
    asIs: 'Community Engagement',
    toBe: 'Community Engagement',
    definition: 'Citizen interaction and reporting',
    context: 'Sidebar navigation',
    priority: 'High',
    category: 'navigation',
  },
  'System Administration': {
    asIs: 'System Administration',
    toBe: 'System Administration',
    definition: 'System configuration and management',
    context: 'Sidebar navigation',
    priority: 'High',
    category: 'navigation',
  },

  // Navigation Items - Key Simplifications
  'Strategic Dashboard': {
    asIs: 'Strategic Dashboard',
    toBe: 'Executive Dashboard',
    definition: 'High-level performance overview',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Manager Dashboard': {
    asIs: 'Manager Dashboard',
    toBe: 'Manager Dashboard',
    definition: 'Manager-level operational overview',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Margin Management': {
    asIs: 'Margin Management',
    toBe: 'Resource Management',
    definition: 'Resource allocation and management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Demo Showcase': {
    asIs: 'Demo Showcase',
    toBe: 'Demo Showcase',
    definition: 'System demonstration features',
    context: 'Navigation item',
    priority: 'Medium',
    category: 'navigation',
  },
  'Asset Performance': {
    asIs: 'Asset Performance',
    toBe: 'Asset Performance',
    definition: 'Asset performance metrics and trends',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Risk Overview': {
    asIs: 'Risk Overview',
    toBe: 'Risk Overview',
    definition: 'Risk assessment and management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Compliance Status': {
    asIs: 'Compliance Status',
    toBe: 'Compliance Status',
    definition: 'Regulatory compliance monitoring',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Asset Lookup': {
    asIs: 'Asset Lookup',
    toBe: 'Asset Register',
    definition: 'Asset search and information',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Asset Map': {
    asIs: 'Asset Map',
    toBe: 'Asset Map',
    definition: 'Geographic asset visualisation',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Field Operations': {
    asIs: 'Field Operations',
    toBe: 'Field Operations',
    definition: 'Mobile field work management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Mobile Dashboard': {
    asIs: 'Mobile Dashboard',
    toBe: 'Mobile Dashboard',
    definition: 'Mobile-optimised dashboard',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  Inspections: {
    asIs: 'Inspections',
    toBe: 'Inspections',
    definition: 'Asset inspection management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Work Orders': {
    asIs: 'Work Orders',
    toBe: 'Work Orders',
    definition: 'Work order management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Work Sessions': {
    asIs: 'Work Sessions',
    toBe: 'Work Tracking',
    definition: 'Work activity tracking',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Contract Dashboard': {
    asIs: 'Contract Dashboard',
    toBe: 'Contract Dashboard',
    definition: 'Contractor performance overview',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'My Work Orders': {
    asIs: 'My Work Orders',
    toBe: 'My Work Orders',
    definition: 'Personal work order assignments',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Performance Metrics': {
    asIs: 'Performance Metrics',
    toBe: 'Performance Metrics',
    definition: 'Performance measurement and reporting',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Capacity Management': {
    asIs: 'Capacity Management',
    toBe: 'Capacity Management',
    definition: 'Resource capacity planning',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Data Sharing': {
    asIs: 'Data Sharing',
    toBe: 'Data Sharing',
    definition: 'External data sharing capabilities',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Community Portal': {
    asIs: 'Community Portal',
    toBe: 'Community Portal',
    definition: 'Citizen access portal',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Track Requests': {
    asIs: 'Track Requests',
    toBe: 'Track Requests',
    definition: 'Citizen request tracking',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Activity Logs': {
    asIs: 'Activity Logs',
    toBe: 'Activity Logs',
    definition: 'System activity monitoring',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Report Triage': {
    asIs: 'Report Triage',
    toBe: 'Report Triage',
    definition: 'Citizen report management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Admin Dashboard': {
    asIs: 'Admin Dashboard',
    toBe: 'Admin Dashboard',
    definition: 'Administrative overview',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'User Management': {
    asIs: 'User Management',
    toBe: 'User Management',
    definition: 'User account management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Audit Logs': {
    asIs: 'Audit Logs',
    toBe: 'Audit Logs',
    definition: 'System audit trail',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'Security Dashboard': {
    asIs: 'Security Dashboard',
    toBe: 'Security Dashboard',
    definition: 'Security monitoring and management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  Notifications: {
    asIs: 'Notifications',
    toBe: 'Notifications',
    definition: 'System notification management',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },
  'System Settings': {
    asIs: 'System Settings',
    toBe: 'System Settings',
    definition: 'System configuration',
    context: 'Navigation item',
    priority: 'High',
    category: 'navigation',
  },

  // Technical & System Terms - Key Simplifications
  'Resilience Engine': {
    asIs: 'Resilience Engine',
    toBe: 'Asset Intelligence Engine',
    definition: 'Core system for asset intelligence',
    context: 'System component',
    priority: 'High',
    category: 'technical_system',
  },
  'Signal Processing': {
    asIs: 'Signal Processing',
    toBe: 'Event Processing',
    definition: 'Processing of system events',
    context: 'System component',
    priority: 'High',
    category: 'technical_system',
  },
  'Antifragile System': {
    asIs: 'Antifragile System',
    toBe: 'Adaptive System',
    definition: 'System that improves under stress',
    context: 'System component',
    priority: 'High',
    category: 'technical_system',
  },
  'Critical Control Planning': {
    asIs: 'Critical Control Planning',
    toBe: 'Risk Control Planning',
    definition: 'Planning of critical risk controls',
    context: 'System component',
    priority: 'High',
    category: 'technical_system',
  },
  'Field Tool': {
    asIs: 'Field Tool',
    toBe: 'Mobile Field App',
    definition: 'Mobile field application',
    context: 'System component',
    priority: 'High',
    category: 'technical_system',
  },

  // Status & Priority Terms
  ACTIVE: {
    asIs: 'ACTIVE',
    toBe: 'Active',
    definition: 'Asset is operational and in use',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  INACTIVE: {
    asIs: 'INACTIVE',
    toBe: 'Inactive',
    definition: 'Asset is not currently in use',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  UNDER_CONSTRUCTION: {
    asIs: 'UNDER_CONSTRUCTION',
    toBe: 'Under Construction',
    definition: 'Asset is being built or installed',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  UNDER_MAINTENANCE: {
    asIs: 'UNDER_MAINTENANCE',
    toBe: 'Under Maintenance',
    definition: 'Asset is being maintained',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  DECOMMISSIONED: {
    asIs: 'DECOMMISSIONED',
    toBe: 'Decommissioned',
    definition: 'Asset has been taken out of service',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  PLANNED: {
    asIs: 'PLANNED',
    toBe: 'Planned',
    definition: 'Asset is planned but not yet acquired',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  EXCELLENT: {
    asIs: 'EXCELLENT',
    toBe: 'Excellent',
    definition: 'Asset is in excellent condition',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  GOOD: {
    asIs: 'GOOD',
    toBe: 'Good',
    definition: 'Asset is in good condition',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  FAIR: {
    asIs: 'FAIR',
    toBe: 'Fair',
    definition: 'Asset is in fair condition',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  POOR: {
    asIs: 'POOR',
    toBe: 'Poor',
    definition: 'Asset is in poor condition',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  CRITICAL: {
    asIs: 'CRITICAL',
    toBe: 'Critical',
    definition: 'Asset is in critical condition',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  UNKNOWN: {
    asIs: 'UNKNOWN',
    toBe: 'Unknown',
    definition: 'Asset condition is unknown',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  LOW: {
    asIs: 'LOW',
    toBe: 'Low',
    definition: 'Low priority asset',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  MEDIUM: {
    asIs: 'MEDIUM',
    toBe: 'Medium',
    definition: 'Medium priority asset',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },
  HIGH: {
    asIs: 'HIGH',
    toBe: 'High',
    definition: 'High priority asset',
    context: 'Database enum, UI',
    priority: 'High',
    category: 'status_priority',
  },

  // User Roles & Permissions
  ADMIN: {
    asIs: 'ADMIN',
    toBe: 'Administrator',
    definition: 'System administrator with full access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  MANAGER: {
    asIs: 'MANAGER',
    toBe: 'Manager',
    definition: 'Asset manager with management access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  SUPERVISOR: {
    asIs: 'SUPERVISOR',
    toBe: 'Supervisor',
    definition: 'Maintenance supervisor with operational access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  CREW: {
    asIs: 'CREW',
    toBe: 'Crew Member',
    definition: 'Maintenance crew member with field access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  EXEC: {
    asIs: 'EXEC',
    toBe: 'Executive',
    definition: 'Executive with strategic access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  CONTRACTOR: {
    asIs: 'CONTRACTOR',
    toBe: 'Contractor',
    definition: 'External contractor with limited access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  PARTNER: {
    asIs: 'PARTNER',
    toBe: 'Partner',
    definition: 'Business partner with shared access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  CITIZEN: {
    asIs: 'CITIZEN',
    toBe: 'Citizen',
    definition: 'Community member with reporting access',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
  MAINTENANCE_PLANNER: {
    asIs: 'MAINTENANCE_PLANNER',
    toBe: 'Maintenance Planner',
    definition: 'Maintenance planning specialist',
    context: 'User role, permissions',
    priority: 'High',
    category: 'user_roles',
  },
};

/**
 * Get standardised terminology for a given term
 * @param term - The current term to look up
 * @returns The standardised terminology mapping or null if not found
 */
export function getStandardisedTerm(term: string): TerminologyMapping | null {
  return TERMINOLOGY_MAPPING[term] || null;
}

/**
 * Get all terms by category
 * @param category - The category to filter by
 * @returns Array of terminology mappings for the category
 */
export function getTermsByCategory(
  category: TerminologyCategory
): TerminologyMapping[] {
  return Object.values(TERMINOLOGY_MAPPING).filter(
    mapping => mapping.category === category
  );
}

/**
 * Get all high priority terms for Epic 24 Phase 1 implementation
 * @returns Array of high priority terminology mappings
 */
export function getHighPriorityTerms(): TerminologyMapping[] {
  return Object.values(TERMINOLOGY_MAPPING).filter(
    mapping => mapping.priority === 'High'
  );
}

/**
 * Get all navigation-related terms for UI updates
 * @returns Array of navigation terminology mappings
 */
export function getNavigationTerms(): TerminologyMapping[] {
  return Object.values(TERMINOLOGY_MAPPING).filter(mapping =>
    mapping.context.includes('navigation')
  );
}

/**
 * Get all UI label terms for form and interface updates
 * @returns Array of UI label terminology mappings
 */
export function getUILabelTerms(): TerminologyMapping[] {
  return Object.values(TERMINOLOGY_MAPPING).filter(
    mapping =>
      mapping.context.includes('UI') ||
      mapping.context.includes('Form') ||
      mapping.context.includes('label')
  );
}

/**
 * Get all database field terms for schema updates
 * @returns Array of database field terminology mappings
 */
export function getDatabaseFieldTerms(): TerminologyMapping[] {
  return Object.values(TERMINOLOGY_MAPPING).filter(mapping =>
    mapping.context.includes('Database')
  );
}

/**
 * Transform a term from current to standardised terminology
 * @param term - The current term
 * @returns The standardised term or original if no mapping found
 */
export function transformTerm(term: string): string {
  const mapping = getStandardisedTerm(term);
  return mapping ? mapping.toBe : term;
}

/**
 * Transform multiple terms from current to standardised terminology
 * @param terms - Array of current terms
 * @returns Array of standardised terms
 */
export function transformTerms(terms: string[]): string[] {
  return terms.map(transformTerm);
}

/**
 * Get terminology mapping statistics for Epic 24 progress tracking
 * @returns Statistics object with counts by category and priority
 */
export function getTerminologyStats() {
  const mappings = Object.values(TERMINOLOGY_MAPPING);

  const byCategory = mappings.reduce(
    (acc, mapping) => {
      acc[mapping.category] = (acc[mapping.category] || 0) + 1;
      return acc;
    },
    {} as Record<TerminologyCategory, number>
  );

  const byPriority = mappings.reduce(
    (acc, mapping) => {
      acc[mapping.priority] = (acc[mapping.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total: mappings.length,
    byCategory,
    byPriority,
    highPriority: mappings.filter(m => m.priority === 'High').length,
    mediumPriority: mappings.filter(m => m.priority === 'Medium').length,
    lowPriority: mappings.filter(m => m.priority === 'Low').length,
  };
}
