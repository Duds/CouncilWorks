/**
 * Epic 24: Language Simplification & Visualisation Enhancement
 * Language Transformer Utility
 *
 * This module provides utilities to transform terminology across the application
 * using the comprehensive language dictionary mappings.
 *
 * @file language-transformer.ts
 * @version 1.0.0
 * @author Aegrid Development Team
 */

import {
  getStandardisedTerm,
  TERMINOLOGY_MAPPING,
  TerminologyMapping,
} from './terminology-mapping';

export interface TransformationContext {
  component?: string;
  page?: string;
  section?: string;
  userRole?: string;
}

export interface TransformationResult {
  original: string;
  transformed: string;
  mapping?: TerminologyMapping;
  context: TransformationContext;
}

/**
 * Transform navigation labels using standardised terminology
 * @param label - The navigation label to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformNavigationLabel(
  label: string,
  context?: TransformationContext
): TransformationResult {
  const mapping = getStandardisedTerm(label);
  const transformed = mapping ? mapping.toBe : label;

  return {
    original: label,
    transformed,
    mapping,
    context: context || {},
  };
}

/**
 * Transform multiple navigation labels
 * @param labels - Array of navigation labels
 * @param context - Optional context information
 * @returns Array of transformation results
 */
export function transformNavigationLabels(
  labels: string[],
  context?: TransformationContext
): TransformationResult[] {
  return labels.map(label => transformNavigationLabel(label, context));
}

/**
 * Transform UI form labels using standardised terminology
 * @param label - The form label to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformFormLabel(
  label: string,
  context?: TransformationContext
): TransformationResult {
  return transformNavigationLabel(label, context);
}

/**
 * Transform database field names for display purposes
 * @param fieldName - The database field name
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformDatabaseField(
  fieldName: string,
  context?: TransformationContext
): TransformationResult {
  // Convert camelCase to readable format first
  const readableName = fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();

  const mapping = getStandardisedTerm(readableName);
  const transformed = mapping ? mapping.toBe : readableName;

  return {
    original: fieldName,
    transformed,
    mapping,
    context: context || {},
  };
}

/**
 * Transform enum values for display purposes
 * @param enumValue - The enum value to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformEnumValue(
  enumValue: string,
  context?: TransformationContext
): TransformationResult {
  const mapping = getStandardisedTerm(enumValue);
  const transformed = mapping ? mapping.toBe : enumValue;

  return {
    original: enumValue,
    transformed,
    mapping,
    context: context || {},
  };
}

/**
 * Transform component names using standardised terminology
 * @param componentName - The component name to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformComponentName(
  componentName: string,
  context?: TransformationContext
): TransformationResult {
  return transformNavigationLabel(componentName, context);
}

/**
 * Transform API endpoint names for display purposes
 * @param endpoint - The API endpoint name
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformApiEndpoint(
  endpoint: string,
  context?: TransformationContext
): TransformationResult {
  // Convert API endpoint format to readable format
  const readableName = endpoint
    .replace(/^\/api\//, '')
    .replace(/\//g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const mapping = getStandardisedTerm(readableName);
  const transformed = mapping ? mapping.toBe : readableName;

  return {
    original: endpoint,
    transformed,
    mapping,
    context: context || {},
  };
}

/**
 * Transform user role names for display purposes
 * @param role - The user role to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformUserRole(
  role: string,
  context?: TransformationContext
): TransformationResult {
  return transformEnumValue(role, context);
}

/**
 * Transform status values for display purposes
 * @param status - The status value to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformStatus(
  status: string,
  context?: TransformationContext
): TransformationResult {
  return transformEnumValue(status, context);
}

/**
 * Transform priority values for display purposes
 * @param priority - The priority value to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformPriority(
  priority: string,
  context?: TransformationContext
): TransformationResult {
  return transformEnumValue(priority, context);
}

/**
 * Transform condition values for display purposes
 * @param condition - The condition value to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformCondition(
  condition: string,
  context?: TransformationContext
): TransformationResult {
  return transformEnumValue(condition, context);
}

/**
 * Transform any text content using standardised terminology
 * @param text - The text content to transform
 * @param context - Optional context information
 * @returns Transformation result
 */
export function transformTextContent(
  text: string,
  context?: TransformationContext
): TransformationResult {
  // Split text into words and transform each potential term
  const words = text.split(/\s+/);
  const transformedWords = words.map(word => {
    // Remove punctuation for lookup
    const cleanWord = word.replace(/[^\w]/g, '');
    const mapping = getStandardisedTerm(cleanWord);
    return mapping ? word.replace(cleanWord, mapping.toBe) : word;
  });

  return {
    original: text,
    transformed: transformedWords.join(' '),
    context: context || {},
  };
}

/**
 * Create a transformation context for a specific component
 * @param component - Component name
 * @param page - Page name
 * @param section - Section name
 * @param userRole - User role
 * @returns Transformation context
 */
export function createTransformationContext(
  component?: string,
  page?: string,
  section?: string,
  userRole?: string
): TransformationContext {
  return {
    component,
    page,
    section,
    userRole,
  };
}

/**
 * Batch transform multiple items of the same type
 * @param items - Array of items to transform
 * @param transformer - Transformation function
 * @param context - Optional context information
 * @returns Array of transformation results
 */
export function batchTransform<T>(
  items: T[],
  transformer: (
    item: T,
    context?: TransformationContext
  ) => TransformationResult,
  context?: TransformationContext
): TransformationResult[] {
  return items.map(item => transformer(item, context));
}

/**
 * Get transformation statistics for a batch of transformations
 * @param results - Array of transformation results
 * @returns Statistics object
 */
export function getTransformationStats(results: TransformationResult[]) {
  const total = results.length;
  const transformed = results.filter(r => r.transformed !== r.original).length;
  const unchanged = total - transformed;
  const withMapping = results.filter(r => r.mapping).length;

  const byCategory = results
    .filter(r => r.mapping)
    .reduce(
      (acc, result) => {
        const category = result.mapping!.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  return {
    total,
    transformed,
    unchanged,
    withMapping,
    transformationRate: total > 0 ? (transformed / total) * 100 : 0,
    byCategory,
  };
}

/**
 * Validate transformation results for consistency
 * @param results - Array of transformation results
 * @returns Validation result with any issues found
 */
export function validateTransformations(results: TransformationResult[]) {
  const issues: string[] = [];

  // Check for empty transformations
  const emptyTransformations = results.filter(
    r => !r.transformed || r.transformed.trim() === ''
  );
  if (emptyTransformations.length > 0) {
    issues.push(`${emptyTransformations.length} empty transformations found`);
  }

  // Check for unchanged high-priority terms
  const highPriorityUnchanged = results.filter(
    r =>
      !r.mapping &&
      r.original &&
      Object.values(TERMINOLOGY_MAPPING).some(
        m => m.asIs === r.original && m.priority === 'High'
      )
  );
  if (highPriorityUnchanged.length > 0) {
    issues.push(
      `${highPriorityUnchanged.length} high-priority terms not transformed`
    );
  }

  // Check for inconsistent transformations
  const duplicateOriginals = new Map<string, string[]>();
  results.forEach(r => {
    if (!duplicateOriginals.has(r.original)) {
      duplicateOriginals.set(r.original, []);
    }
    duplicateOriginals.get(r.original)!.push(r.transformed);
  });

  const inconsistent = Array.from(duplicateOriginals.entries()).filter(
    ([_original, transformed]) => new Set(transformed).size > 1
  );

  if (inconsistent.length > 0) {
    issues.push(`${inconsistent.length} inconsistent transformations found`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      total: results.length,
      empty: emptyTransformations.length,
      highPriorityUnchanged: highPriorityUnchanged.length,
      inconsistent: inconsistent.length,
    },
  };
}
