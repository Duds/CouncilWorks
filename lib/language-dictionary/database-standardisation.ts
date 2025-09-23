/**
 * Epic 24: Language Simplification & Visualisation Enhancement
 * Database Field Standardisation Utility
 *
 * Provides utilities to standardise database field names and enum values
 * using the comprehensive language dictionary mappings.
 *
 * @file database-standardisation.ts
 * @version 1.0.0
 * @author Aegrid Development Team
 */

export interface DatabaseFieldMapping {
  originalField: string;
  standardisedField: string;
  tableName: string;
  fieldType: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface EnumValueMapping {
  originalValue: string;
  standardisedValue: string;
  enumName: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

/**
 * Database field mappings for standardisation
 * Maps current database field names to standardised terminology
 */
export const DATABASE_FIELD_MAPPINGS: Record<string, DatabaseFieldMapping> = {
  // Asset table fields
  assetNumber: {
    originalField: 'assetNumber',
    standardisedField: 'assetNumber',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Unique identifier for an asset',
    priority: 'High',
  },
  assetType: {
    originalField: 'assetType',
    standardisedField: 'assetType',
    tableName: 'Asset',
    fieldType: 'AssetType',
    description: 'Classification of asset type',
    priority: 'High',
  },
  assetStatus: {
    originalField: 'status',
    standardisedField: 'assetStatus',
    tableName: 'Asset',
    fieldType: 'AssetStatus',
    description: 'Current operational status',
    priority: 'High',
  },
  assetCondition: {
    originalField: 'condition',
    standardisedField: 'assetCondition',
    tableName: 'Asset',
    fieldType: 'AssetCondition',
    description: 'Physical condition assessment',
    priority: 'High',
  },
  assetPriority: {
    originalField: 'priority',
    standardisedField: 'assetPriority',
    tableName: 'Asset',
    fieldType: 'AssetPriority',
    description: 'Relative importance level',
    priority: 'High',
  },
  organisationId: {
    originalField: 'organisationId',
    standardisedField: 'organisationId',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Reference to owning organisation',
    priority: 'High',
  },
  location: {
    originalField: 'location',
    standardisedField: 'location',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Physical location of asset',
    priority: 'High',
  },
  address: {
    originalField: 'address',
    standardisedField: 'address',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Specific address of asset',
    priority: 'High',
  },
  suburb: {
    originalField: 'suburb',
    standardisedField: 'suburb',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Suburb or district location',
    priority: 'High',
  },
  postcode: {
    originalField: 'postcode',
    standardisedField: 'postcode',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Postal code of location',
    priority: 'High',
  },
  state: {
    originalField: 'state',
    standardisedField: 'state',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'State or territory',
    priority: 'High',
  },
  country: {
    originalField: 'country',
    standardisedField: 'country',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Country of location',
    priority: 'High',
  },
  manufacturer: {
    originalField: 'manufacturer',
    standardisedField: 'manufacturer',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Asset manufacturer',
    priority: 'High',
  },
  model: {
    originalField: 'model',
    standardisedField: 'model',
    tableName: 'Asset',
    fieldType: 'String',
    description: 'Asset model designation',
    priority: 'High',
  },
  serialNumber: {
    originalField: 'serialNumber',
    standardisedField: 'serialNumber',
    tableName: 'Asset',
    fieldType: 'String',
    description: "Manufacturer's serial number",
    priority: 'High',
  },
  installationDate: {
    originalField: 'installationDate',
    standardisedField: 'installationDate',
    tableName: 'Asset',
    fieldType: 'DateTime',
    description: 'Date of asset installation',
    priority: 'High',
  },
  warrantyExpiry: {
    originalField: 'warrantyExpiry',
    standardisedField: 'warrantyExpiry',
    tableName: 'Asset',
    fieldType: 'DateTime',
    description: 'Warranty expiration date',
    priority: 'High',
  },
  expectedLifespan: {
    originalField: 'expectedLifespan',
    standardisedField: 'expectedLifespan',
    tableName: 'Asset',
    fieldType: 'Int',
    description: 'Expected operational life in years',
    priority: 'High',
  },
  purchasePrice: {
    originalField: 'purchasePrice',
    standardisedField: 'purchasePrice',
    tableName: 'Asset',
    fieldType: 'Decimal',
    description: 'Original purchase cost',
    priority: 'High',
  },
  currentValue: {
    originalField: 'currentValue',
    standardisedField: 'currentValue',
    tableName: 'Asset',
    fieldType: 'Decimal',
    description: 'Current market value',
    priority: 'High',
  },
  replacementCost: {
    originalField: 'replacementCost',
    standardisedField: 'replacementCost',
    tableName: 'Asset',
    fieldType: 'Decimal',
    description: 'Cost to replace asset',
    priority: 'High',
  },
  depreciationRate: {
    originalField: 'depreciationRate',
    standardisedField: 'depreciationRate',
    tableName: 'Asset',
    fieldType: 'Decimal',
    description: 'Annual depreciation percentage',
    priority: 'High',
  },
  lastInspection: {
    originalField: 'lastInspection',
    standardisedField: 'lastInspection',
    tableName: 'Asset',
    fieldType: 'DateTime',
    description: 'Date of last inspection',
    priority: 'High',
  },
  nextInspection: {
    originalField: 'nextInspection',
    standardisedField: 'nextInspection',
    tableName: 'Asset',
    fieldType: 'DateTime',
    description: 'Date of next scheduled inspection',
    priority: 'High',
  },

  // Work Order fields
  workOrderNumber: {
    originalField: 'workOrderNumber',
    standardisedField: 'workOrderNumber',
    tableName: 'WorkOrder',
    fieldType: 'String',
    description: 'Unique work order identifier',
    priority: 'High',
  },
  workOrderStatus: {
    originalField: 'status',
    standardisedField: 'workOrderStatus',
    tableName: 'WorkOrder',
    fieldType: 'String',
    description: 'Current status of work order',
    priority: 'High',
  },
  workOrderPriority: {
    originalField: 'priority',
    standardisedField: 'workOrderPriority',
    tableName: 'WorkOrder',
    fieldType: 'AssetPriority',
    description: 'Priority level of work order',
    priority: 'High',
  },
  workOrderType: {
    originalField: 'title',
    standardisedField: 'workOrderType',
    tableName: 'WorkOrder',
    fieldType: 'String',
    description: 'Type of maintenance work',
    priority: 'High',
  },
  assignedTo: {
    originalField: 'assignedTo',
    standardisedField: 'assignedTo',
    tableName: 'WorkOrder',
    fieldType: 'String',
    description: 'Person assigned to work order',
    priority: 'High',
  },
  dueDate: {
    originalField: 'dueDate',
    standardisedField: 'dueDate',
    tableName: 'WorkOrder',
    fieldType: 'DateTime',
    description: 'Scheduled completion date',
    priority: 'High',
  },
  estimatedDuration: {
    originalField: 'estimatedDuration',
    standardisedField: 'estimatedDuration',
    tableName: 'WorkOrder',
    fieldType: 'Int',
    description: 'Expected time to complete',
    priority: 'High',
  },
  actualDuration: {
    originalField: 'actualDuration',
    standardisedField: 'actualDuration',
    tableName: 'WorkOrder',
    fieldType: 'Int',
    description: 'Actual time taken to complete',
    priority: 'High',
  },
  workDescription: {
    originalField: 'description',
    standardisedField: 'workDescription',
    tableName: 'WorkOrder',
    fieldType: 'String',
    description: 'Description of work to be performed',
    priority: 'High',
  },

  // User fields
  userId: {
    originalField: 'id',
    standardisedField: 'userId',
    tableName: 'User',
    fieldType: 'String',
    description: 'Unique user identifier',
    priority: 'High',
  },
  userRole: {
    originalField: 'role',
    standardisedField: 'userRole',
    tableName: 'User',
    fieldType: 'Role',
    description: "User's role in the system",
    priority: 'High',
  },
  email: {
    originalField: 'email',
    standardisedField: 'email',
    tableName: 'User',
    fieldType: 'String',
    description: "User's email address",
    priority: 'High',
  },
  name: {
    originalField: 'name',
    standardisedField: 'name',
    tableName: 'User',
    fieldType: 'String',
    description: "User's full name",
    priority: 'High',
  },
  phoneNumber: {
    originalField: 'phoneNumber',
    standardisedField: 'phoneNumber',
    tableName: 'User',
    fieldType: 'String',
    description: "User's phone number",
    priority: 'High',
  },
  timezone: {
    originalField: 'timezone',
    standardisedField: 'timezone',
    tableName: 'User',
    fieldType: 'String',
    description: "User's timezone",
    priority: 'High',
  },
  language: {
    originalField: 'language',
    standardisedField: 'language',
    tableName: 'User',
    fieldType: 'String',
    description: "User's preferred language",
    priority: 'High',
  },
  isActive: {
    originalField: 'isActive',
    standardisedField: 'isActive',
    tableName: 'User',
    fieldType: 'Boolean',
    description: 'Whether user account is active',
    priority: 'High',
  },
  lastLoginAt: {
    originalField: 'lastLoginAt',
    standardisedField: 'lastLoginAt',
    tableName: 'User',
    fieldType: 'DateTime',
    description: 'Date of last login',
    priority: 'High',
  },
  createdAt: {
    originalField: 'createdAt',
    standardisedField: 'createdAt',
    tableName: 'User',
    fieldType: 'DateTime',
    description: 'Account creation date',
    priority: 'High',
  },
  updatedAt: {
    originalField: 'updatedAt',
    standardisedField: 'updatedAt',
    tableName: 'User',
    fieldType: 'DateTime',
    description: 'Last update date',
    priority: 'High',
  },
};

/**
 * Enum value mappings for standardisation
 * Maps current enum values to standardised terminology
 */
export const ENUM_VALUE_MAPPINGS: Record<string, EnumValueMapping> = {
  // Asset Status
  ACTIVE: {
    originalValue: 'ACTIVE',
    standardisedValue: 'Active',
    enumName: 'AssetStatus',
    description: 'Asset is operational and in use',
    priority: 'High',
  },
  INACTIVE: {
    originalValue: 'INACTIVE',
    standardisedValue: 'Inactive',
    enumName: 'AssetStatus',
    description: 'Asset is not currently in use',
    priority: 'High',
  },
  UNDER_CONSTRUCTION: {
    originalValue: 'UNDER_CONSTRUCTION',
    standardisedValue: 'Under Construction',
    enumName: 'AssetStatus',
    description: 'Asset is being built or installed',
    priority: 'High',
  },
  UNDER_MAINTENANCE: {
    originalValue: 'UNDER_MAINTENANCE',
    standardisedValue: 'Under Maintenance',
    enumName: 'AssetStatus',
    description: 'Asset is being maintained',
    priority: 'High',
  },
  DECOMMISSIONED: {
    originalValue: 'DECOMMISSIONED',
    standardisedValue: 'Decommissioned',
    enumName: 'AssetStatus',
    description: 'Asset has been taken out of service',
    priority: 'High',
  },
  PLANNED: {
    originalValue: 'PLANNED',
    standardisedValue: 'Planned',
    enumName: 'AssetStatus',
    description: 'Asset is planned but not yet acquired',
    priority: 'High',
  },

  // Asset Condition
  EXCELLENT: {
    originalValue: 'EXCELLENT',
    standardisedValue: 'Excellent',
    enumName: 'AssetCondition',
    description: 'Asset is in excellent condition',
    priority: 'High',
  },
  GOOD: {
    originalValue: 'GOOD',
    standardisedValue: 'Good',
    enumName: 'AssetCondition',
    description: 'Asset is in good condition',
    priority: 'High',
  },
  FAIR: {
    originalValue: 'FAIR',
    standardisedValue: 'Fair',
    enumName: 'AssetCondition',
    description: 'Asset is in fair condition',
    priority: 'High',
  },
  POOR: {
    originalValue: 'POOR',
    standardisedValue: 'Poor',
    enumName: 'AssetCondition',
    description: 'Asset is in poor condition',
    priority: 'High',
  },
  CRITICAL_CONDITION: {
    originalValue: 'CRITICAL',
    standardisedValue: 'Critical',
    enumName: 'AssetCondition',
    description: 'Asset is in critical condition',
    priority: 'High',
  },
  UNKNOWN: {
    originalValue: 'UNKNOWN',
    standardisedValue: 'Unknown',
    enumName: 'AssetCondition',
    description: 'Asset condition is unknown',
    priority: 'High',
  },

  // Asset Priority
  LOW: {
    originalValue: 'LOW',
    standardisedValue: 'Low',
    enumName: 'AssetPriority',
    description: 'Low priority asset',
    priority: 'High',
  },
  MEDIUM: {
    originalValue: 'MEDIUM',
    standardisedValue: 'Medium',
    enumName: 'AssetPriority',
    description: 'Medium priority asset',
    priority: 'High',
  },
  HIGH: {
    originalValue: 'HIGH',
    standardisedValue: 'High',
    enumName: 'AssetPriority',
    description: 'High priority asset',
    priority: 'High',
  },
  CRITICAL_PRIORITY: {
    originalValue: 'CRITICAL',
    standardisedValue: 'Critical',
    enumName: 'AssetPriority',
    description: 'Critical priority asset',
    priority: 'High',
  },

  // User Roles
  ADMIN: {
    originalValue: 'ADMIN',
    standardisedValue: 'Administrator',
    enumName: 'Role',
    description: 'System administrator with full access',
    priority: 'High',
  },
  MANAGER: {
    originalValue: 'MANAGER',
    standardisedValue: 'Manager',
    enumName: 'Role',
    description: 'Asset manager with management access',
    priority: 'High',
  },
  SUPERVISOR: {
    originalValue: 'SUPERVISOR',
    standardisedValue: 'Supervisor',
    enumName: 'Role',
    description: 'Maintenance supervisor with operational access',
    priority: 'High',
  },
  CREW: {
    originalValue: 'CREW',
    standardisedValue: 'Crew Member',
    enumName: 'Role',
    description: 'Maintenance crew member with field access',
    priority: 'High',
  },
  EXEC: {
    originalValue: 'EXEC',
    standardisedValue: 'Executive',
    enumName: 'Role',
    description: 'Executive with strategic access',
    priority: 'High',
  },
  CONTRACTOR: {
    originalValue: 'CONTRACTOR',
    standardisedValue: 'Contractor',
    enumName: 'Role',
    description: 'External contractor with limited access',
    priority: 'High',
  },
  PARTNER: {
    originalValue: 'PARTNER',
    standardisedValue: 'Partner',
    enumName: 'Role',
    description: 'Business partner with shared access',
    priority: 'High',
  },
  CITIZEN: {
    originalValue: 'CITIZEN',
    standardisedValue: 'Citizen',
    enumName: 'Role',
    description: 'Community member with reporting access',
    priority: 'High',
  },
  MAINTENANCE_PLANNER: {
    originalValue: 'MAINTENANCE_PLANNER',
    standardisedValue: 'Maintenance Planner',
    enumName: 'Role',
    description: 'Maintenance planning specialist',
    priority: 'High',
  },
};

/**
 * Get standardised database field name
 * @param fieldName - The current field name
 * @param tableName - The table name for context
 * @returns The standardised field mapping or null if not found
 */
export function getStandardisedField(
  fieldName: string,
  tableName: string
): DatabaseFieldMapping | null {
  const key = `${tableName}.${fieldName}`;
  return DATABASE_FIELD_MAPPINGS[key] || null;
}

/**
 * Get standardised enum value
 * @param enumValue - The current enum value
 * @param enumName - The enum name for context
 * @returns The standardised enum mapping or null if not found
 */
export function getStandardisedEnumValue(
  enumValue: string,
  enumName: string
): EnumValueMapping | null {
  const key = `${enumName}.${enumValue}`;
  return ENUM_VALUE_MAPPINGS[key] || null;
}

/**
 * Transform database field name to standardised terminology
 * @param fieldName - The current field name
 * @param tableName - The table name for context
 * @returns The standardised field name or original if no mapping found
 */
export function transformDatabaseField(
  fieldName: string,
  tableName: string
): string {
  const mapping = getStandardisedField(fieldName, tableName);
  return mapping ? mapping.standardisedField : fieldName;
}

/**
 * Transform enum value to standardised terminology
 * @param enumValue - The current enum value
 * @param enumName - The enum name for context
 * @returns The standardised enum value or original if no mapping found
 */
export function transformEnumValue(
  enumValue: string,
  enumName: string
): string {
  const mapping = getStandardisedEnumValue(enumValue, enumName);
  return mapping ? mapping.standardisedValue : enumValue;
}

/**
 * Get all database field mappings by table
 * @param tableName - The table name to filter by
 * @returns Array of database field mappings for the table
 */
export function getFieldsByTable(tableName: string): DatabaseFieldMapping[] {
  return Object.values(DATABASE_FIELD_MAPPINGS).filter(
    mapping => mapping.tableName === tableName
  );
}

/**
 * Get all enum value mappings by enum name
 * @param enumName - The enum name to filter by
 * @returns Array of enum value mappings for the enum
 */
export function getEnumValuesByName(enumName: string): EnumValueMapping[] {
  return Object.values(ENUM_VALUE_MAPPINGS).filter(
    mapping => mapping.enumName === enumName
  );
}

/**
 * Get high priority database field mappings
 * @returns Array of high priority database field mappings
 */
export function getHighPriorityFields(): DatabaseFieldMapping[] {
  return Object.values(DATABASE_FIELD_MAPPINGS).filter(
    mapping => mapping.priority === 'High'
  );
}

/**
 * Get high priority enum value mappings
 * @returns Array of high priority enum value mappings
 */
export function getHighPriorityEnumValues(): EnumValueMapping[] {
  return Object.values(ENUM_VALUE_MAPPINGS).filter(
    mapping => mapping.priority === 'High'
  );
}

/**
 * Get database standardisation statistics
 * @returns Statistics object with counts by table and priority
 */
export function getDatabaseStandardisationStats() {
  const fieldMappings = Object.values(DATABASE_FIELD_MAPPINGS);
  const enumMappings = Object.values(ENUM_VALUE_MAPPINGS);

  const fieldsByTable = fieldMappings.reduce(
    (acc, mapping) => {
      acc[mapping.tableName] = (acc[mapping.tableName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const fieldsByPriority = fieldMappings.reduce(
    (acc, mapping) => {
      acc[mapping.priority] = (acc[mapping.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const enumsByName = enumMappings.reduce(
    (acc, mapping) => {
      acc[mapping.enumName] = (acc[mapping.enumName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const enumsByPriority = enumMappings.reduce(
    (acc, mapping) => {
      acc[mapping.priority] = (acc[mapping.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total: fieldMappings.length + enumMappings.length,
    fields: {
      total: fieldMappings.length,
      byTable: fieldsByTable,
      byPriority: fieldsByPriority,
      highPriority: fieldMappings.filter(m => m.priority === 'High').length,
    },
    enums: {
      total: enumMappings.length,
      byName: enumsByName,
      byPriority: enumsByPriority,
      highPriority: enumMappings.filter(m => m.priority === 'High').length,
    },
  };
}
