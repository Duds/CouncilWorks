/**
 * Asset Purpose Classification System
 *
 * Automatically classifies assets based on their characteristics, usage patterns,
 * and contextual information to assign appropriate purposes and functions.
 *
 * @file lib/asset-purpose-classification-system.ts
 * @version 1.0.0
 * @since PI3 - E17: Create Function-Based Asset Organization
 */

import {
  AssetFunctionType,
  AssetPurposeCategory,
  AssetFunction,
  AssetPurpose,
} from '@/types/resilience';
import { AssetModel } from './function-based-asset-modeling';

export interface ClassificationRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  conditions: ClassificationCondition[];
  actions: ClassificationAction[];
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface ClassificationCondition {
  field: string;
  operator: 'EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'REGEX' | 'IN' | 'GT' | 'LT' | 'GTE' | 'LTE';
  value: any;
  weight: number;
  metadata: Record<string, any>;
}

export interface ClassificationAction {
  type: 'ASSIGN_FUNCTION' | 'ASSIGN_PURPOSE' | 'SET_CATEGORY' | 'SET_PRIORITY' | 'SET_VALUE_CONTRIBUTION';
  parameters: Record<string, any>;
  confidence: number;
  metadata: Record<string, any>;
}

export interface ClassificationResult {
  assetId: string;
  success: boolean;
  assignedFunctions: AssetFunction[];
  assignedPurposes: AssetPurpose[];
  confidence: number;
  appliedRules: string[];
  recommendations: string[];
  metadata: Record<string, any>;
}

export interface ClassificationConfiguration {
  enabled: boolean;
  autoClassifyOnCreate: boolean;
  autoClassifyOnUpdate: boolean;
  minConfidenceThreshold: number;
  maxRulesPerAsset: number;
  enableMachineLearning: boolean;
  learningDataRetentionDays: number;
  metadata: Record<string, any>;
}

export interface AssetCharacteristics {
  assetType: string;
  location?: string;
  age?: number;
  condition?: string;
  usage?: string;
  capacity?: number;
  value?: number;
  maintenanceHistory?: string[];
  performanceMetrics?: Record<string, number>;
  metadata: Record<string, any>;
}

/**
 * AssetPurposeClassificationSystem Class
 *
 * Automatically classifies assets and assigns appropriate purposes and functions.
 */
export class AssetPurposeClassificationSystem {
  private config: ClassificationConfiguration;
  private classificationRules: Map<string, ClassificationRule> = new Map();
  private classificationHistory: Map<string, ClassificationResult[]> = new Map();
  private assetCharacteristics: Map<string, AssetCharacteristics> = new Map();

  constructor(config: ClassificationConfiguration) {
    this.config = { ...config };
    this.initializeDefaultRules();
    console.log(`🏷️ Asset Purpose Classification System initialized.`);
  }

  /**
   * Initialize default classification rules based on common asset patterns.
   */
  private initializeDefaultRules(): void {
    const defaultRules: ClassificationRule[] = [
      {
        id: 'rule-road-transportation',
        name: 'Road Transportation Classification',
        description: 'Classifies road assets as transportation functions',
        priority: 100,
        conditions: [
          { field: 'assetType', operator: 'IN', value: ['road', 'highway', 'street', 'avenue'], weight: 1.0, metadata: {} },
          { field: 'usage', operator: 'CONTAINS', value: 'transport', weight: 0.8, metadata: {} },
        ],
        actions: [
          {
            type: 'ASSIGN_FUNCTION',
            parameters: { functionType: AssetFunctionType.TRANSPORTATION, category: AssetPurposeCategory.PRIMARY },
            confidence: 0.9,
            metadata: {},
          },
          {
            type: 'ASSIGN_PURPOSE',
            parameters: { purpose: 'Primary Transportation Route', category: AssetPurposeCategory.PRIMARY },
            confidence: 0.9,
            metadata: {},
          },
        ],
        isActive: true,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'rule-water-infrastructure',
        name: 'Water Infrastructure Classification',
        description: 'Classifies water-related assets as infrastructure functions',
        priority: 95,
        conditions: [
          { field: 'assetType', operator: 'IN', value: ['water_main', 'reservoir', 'treatment_plant', 'pump_station'], weight: 1.0, metadata: {} },
          { field: 'usage', operator: 'CONTAINS', value: 'water', weight: 0.9, metadata: {} },
        ],
        actions: [
          {
            type: 'ASSIGN_FUNCTION',
            parameters: { functionType: AssetFunctionType.INFRASTRUCTURE, category: AssetPurposeCategory.PRIMARY },
            confidence: 0.95,
            metadata: {},
          },
          {
            type: 'ASSIGN_PURPOSE',
            parameters: { purpose: 'Water Supply Distribution', category: AssetPurposeCategory.PRIMARY },
            confidence: 0.95,
            metadata: {},
          },
        ],
        isActive: true,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'rule-power-utilities',
        name: 'Power Utilities Classification',
        description: 'Classifies power-related assets as utility functions',
        priority: 90,
        conditions: [
          { field: 'assetType', operator: 'IN', value: ['power_line', 'substation', 'generator', 'transformer'], weight: 1.0, metadata: {} },
          { field: 'usage', operator: 'CONTAINS', value: 'power', weight: 0.9, metadata: {} },
        ],
        actions: [
          {
            type: 'ASSIGN_FUNCTION',
            parameters: { functionType: AssetFunctionType.UTILITIES, category: AssetPurposeCategory.PRIMARY },
            confidence: 0.9,
            metadata: {},
          },
          {
            type: 'ASSIGN_PURPOSE',
            parameters: { purpose: 'Power Distribution', category: AssetPurposeCategory.PRIMARY },
            confidence: 0.9,
            metadata: {},
          },
        ],
        isActive: true,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'rule-emergency-services',
        name: 'Emergency Services Classification',
        description: 'Classifies emergency-related assets as emergency service functions',
        priority: 100,
        conditions: [
          { field: 'assetType', operator: 'IN', value: ['fire_station', 'ambulance', 'emergency_equipment', 'police_station'], weight: 1.0, metadata: {} },
          { field: 'usage', operator: 'CONTAINS', value: 'emergency', weight: 0.95, metadata: {} },
        ],
        actions: [
          {
            type: 'ASSIGN_FUNCTION',
            parameters: { functionType: AssetFunctionType.EMERGENCY_SERVICES, category: AssetPurposeCategory.EMERGENCY },
            confidence: 0.95,
            metadata: {},
          },
          {
            type: 'ASSIGN_PURPOSE',
            parameters: { purpose: 'Emergency Response Service', category: AssetPurposeCategory.EMERGENCY },
            confidence: 0.95,
            metadata: {},
          },
        ],
        isActive: true,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'rule-waste-management',
        name: 'Waste Management Classification',
        description: 'Classifies waste-related assets as waste management functions',
        priority: 85,
        conditions: [
          { field: 'assetType', operator: 'IN', value: ['landfill', 'recycling_center', 'waste_truck', 'compost_facility'], weight: 1.0, metadata: {} },
          { field: 'usage', operator: 'CONTAINS', value: 'waste', weight: 0.9, metadata: {} },
        ],
        actions: [
          {
            type: 'ASSIGN_FUNCTION',
            parameters: { functionType: AssetFunctionType.WASTE_MANAGEMENT, category: AssetPurposeCategory.PRIMARY },
            confidence: 0.9,
            metadata: {},
          },
          {
            type: 'ASSIGN_PURPOSE',
            parameters: { purpose: 'Waste Collection and Processing', category: AssetPurposeCategory.PRIMARY },
            confidence: 0.9,
            metadata: {},
          },
        ],
        isActive: true,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'rule-backup-assets',
        name: 'Backup Assets Classification',
        description: 'Classifies backup and secondary assets',
        priority: 70,
        conditions: [
          { field: 'usage', operator: 'CONTAINS', value: 'backup', weight: 0.8, metadata: {} },
          { field: 'condition', operator: 'EQUALS', value: 'standby', weight: 0.7, metadata: {} },
        ],
        actions: [
          {
            type: 'SET_CATEGORY',
            parameters: { category: AssetPurposeCategory.BACKUP },
            confidence: 0.8,
            metadata: {},
          },
          {
            type: 'SET_VALUE_CONTRIBUTION',
            parameters: { valueContribution: 0.6 },
            confidence: 0.7,
            metadata: {},
          },
        ],
        isActive: true,
        metadata: { createdBy: 'system', version: '1.0' },
      },
    ];

    defaultRules.forEach(rule => {
      this.classificationRules.set(rule.id, rule);
    });
  }

  /**
   * Classifies an asset based on its characteristics and applies appropriate rules.
   */
  public async classifyAsset(
    assetModel: AssetModel,
    characteristics: AssetCharacteristics
  ): Promise<ClassificationResult> {
    this.assetCharacteristics.set(assetModel.id, characteristics);

    const applicableRules = this.findApplicableRules(characteristics);
    const classificationResult: ClassificationResult = {
      assetId: assetModel.id,
      success: false,
      assignedFunctions: [],
      assignedPurposes: [],
      confidence: 0,
      appliedRules: [],
      recommendations: [],
      metadata: { classifiedAt: new Date().toISOString() },
    };

    if (applicableRules.length === 0) {
      classificationResult.recommendations.push('No applicable classification rules found');
      return classificationResult;
    }

    // Sort rules by priority
    applicableRules.sort((a, b) => b.priority - a.priority);

    // Apply rules (limit to maxRulesPerAsset)
    const rulesToApply = applicableRules.slice(0, this.config.maxRulesPerAsset);
    let totalConfidence = 0;

    for (const rule of rulesToApply) {
      const ruleResult = await this.applyClassificationRule(rule, assetModel, characteristics);
      
      if (ruleResult.confidence >= this.config.minConfidenceThreshold) {
        classificationResult.assignedFunctions.push(...ruleResult.assignedFunctions);
        classificationResult.assignedPurposes.push(...ruleResult.assignedPurposes);
        classificationResult.appliedRules.push(rule.id);
        totalConfidence += ruleResult.confidence;
      }
    }

    // Calculate overall confidence
    classificationResult.confidence = totalConfidence / rulesToApply.length;
    classificationResult.success = classificationResult.confidence >= this.config.minConfidenceThreshold;

    // Generate recommendations
    classificationResult.recommendations = this.generateClassificationRecommendations(assetModel, characteristics);

    // Store classification history
    this.storeClassificationHistory(assetModel.id, classificationResult);

    console.log(`🏷️ Classified asset ${assetModel.name} with confidence ${classificationResult.confidence.toFixed(2)}`);

    return classificationResult;
  }

  /**
   * Finds applicable classification rules based on asset characteristics.
   */
  private findApplicableRules(characteristics: AssetCharacteristics): ClassificationRule[] {
    const applicableRules: ClassificationRule[] = [];

    for (const rule of this.classificationRules.values()) {
      if (!rule.isActive) continue;

      const ruleMatches = this.evaluateRuleConditions(rule, characteristics);
      if (ruleMatches.confidence > 0) {
        applicableRules.push(rule);
      }
    }

    return applicableRules;
  }

  /**
   * Evaluates rule conditions against asset characteristics.
   */
  private evaluateRuleConditions(
    rule: ClassificationRule,
    characteristics: AssetCharacteristics
  ): { confidence: number; matchedConditions: number } {
    let totalWeight = 0;
    let matchedWeight = 0;

    for (const condition of rule.conditions) {
      totalWeight += condition.weight;
      
      if (this.evaluateCondition(condition, characteristics)) {
        matchedWeight += condition.weight;
      }
    }

    return {
      confidence: totalWeight > 0 ? matchedWeight / totalWeight : 0,
      matchedConditions: matchedWeight,
    };
  }

  /**
   * Evaluates a single condition against asset characteristics.
   */
  private evaluateCondition(
    condition: ClassificationCondition,
    characteristics: AssetCharacteristics
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field, characteristics);

    switch (condition.operator) {
      case 'EQUALS':
        return fieldValue === condition.value;
      case 'CONTAINS':
        return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(condition.value.toLowerCase());
      case 'STARTS_WITH':
        return typeof fieldValue === 'string' && fieldValue.toLowerCase().startsWith(condition.value.toLowerCase());
      case 'ENDS_WITH':
        return typeof fieldValue === 'string' && fieldValue.toLowerCase().endsWith(condition.value.toLowerCase());
      case 'REGEX':
        return typeof fieldValue === 'string' && new RegExp(condition.value).test(fieldValue);
      case 'IN':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'GT':
        return typeof fieldValue === 'number' && fieldValue > condition.value;
      case 'LT':
        return typeof fieldValue === 'number' && fieldValue < condition.value;
      case 'GTE':
        return typeof fieldValue === 'number' && fieldValue >= condition.value;
      case 'LTE':
        return typeof fieldValue === 'number' && fieldValue <= condition.value;
      default:
        return false;
    }
  }

  /**
   * Gets field value from asset characteristics or metadata.
   */
  private getFieldValue(field: string, characteristics: AssetCharacteristics): any {
    if (field in characteristics) {
      return characteristics[field as keyof AssetCharacteristics];
    }
    return characteristics.metadata[field];
  }

  /**
   * Applies a classification rule to an asset model.
   */
  private async applyClassificationRule(
    rule: ClassificationRule,
    assetModel: AssetModel,
    characteristics: AssetCharacteristics
  ): Promise<{
    assignedFunctions: AssetFunction[];
    assignedPurposes: AssetPurpose[];
    confidence: number;
  }> {
    const assignedFunctions: AssetFunction[] = [];
    const assignedPurposes: AssetPurpose[] = [];
    let totalConfidence = 0;

    for (const action of rule.actions) {
      switch (action.type) {
        case 'ASSIGN_FUNCTION':
          const functionResult = this.createFunctionFromAction(action, rule);
          if (functionResult) {
            assignedFunctions.push(functionResult);
            totalConfidence += action.confidence;
          }
          break;

        case 'ASSIGN_PURPOSE':
          const purposeResult = this.createPurposeFromAction(action, assetModel.id, rule);
          if (purposeResult) {
            assignedPurposes.push(purposeResult);
            totalConfidence += action.confidence;
          }
          break;

        case 'SET_CATEGORY':
          // This would update the asset model's category
          totalConfidence += action.confidence;
          break;

        case 'SET_PRIORITY':
          // This would update the asset model's priority
          totalConfidence += action.confidence;
          break;

        case 'SET_VALUE_CONTRIBUTION':
          // This would update the asset model's value contribution
          totalConfidence += action.confidence;
          break;
      }
    }

    return {
      assignedFunctions,
      assignedPurposes,
      confidence: totalConfidence / rule.actions.length,
    };
  }

  /**
   * Creates a function from a classification action.
   */
  private createFunctionFromAction(action: ClassificationAction, rule: ClassificationRule): AssetFunction | null {
    const params = action.parameters;
    
    return {
      id: `func-${rule.id}-${Date.now()}`,
      name: `${params.functionType} Function`,
      description: `Auto-generated function from rule ${rule.name}`,
      functionType: params.functionType,
      category: params.category,
      priority: rule.priority,
      isActive: true,
      metadata: { 
        generatedBy: 'classification-system',
        ruleId: rule.id,
        confidence: action.confidence,
      },
    };
  }

  /**
   * Creates a purpose from a classification action.
   */
  private createPurposeFromAction(
    action: ClassificationAction,
    assetId: string,
    rule: ClassificationRule
  ): AssetPurpose | null {
    const params = action.parameters;
    
    return {
      id: `purpose-${assetId}-${rule.id}-${Date.now()}`,
      assetId,
      functionId: `func-${rule.id}`,
      purpose: params.purpose,
      description: `Auto-generated purpose from rule ${rule.name}`,
      category: params.category,
      priority: rule.priority,
      isPrimary: params.category === AssetPurposeCategory.PRIMARY,
      valueContribution: params.category === AssetPurposeCategory.PRIMARY ? 1.0 : 0.7,
      metadata: { 
        generatedBy: 'classification-system',
        ruleId: rule.id,
        confidence: action.confidence,
      },
    };
  }

  /**
   * Generates classification recommendations.
   */
  private generateClassificationRecommendations(
    assetModel: AssetModel,
    characteristics: AssetCharacteristics
  ): string[] {
    const recommendations: string[] = [];

    if (assetModel.functions.length === 0) {
      recommendations.push('Asset has no assigned functions - consider manual classification');
    }

    if (assetModel.purposes.length === 0) {
      recommendations.push('Asset has no assigned purposes - consider manual purpose assignment');
    }

    if (characteristics.condition === 'poor' || characteristics.condition === 'critical') {
      recommendations.push('Asset condition is poor - consider maintenance or replacement');
    }

    if (characteristics.age && characteristics.age > 50) {
      recommendations.push('Asset is aging - consider lifecycle planning');
    }

    return recommendations;
  }

  /**
   * Stores classification history for an asset.
   */
  private storeClassificationHistory(assetId: string, result: ClassificationResult): void {
    if (!this.classificationHistory.has(assetId)) {
      this.classificationHistory.set(assetId, []);
    }

    const history = this.classificationHistory.get(assetId)!;
    history.push(result);

    // Keep only recent history (based on retention period)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.learningDataRetentionDays);
    
    this.classificationHistory.set(assetId, history.filter(r => 
      new Date(r.metadata.classifiedAt) > cutoffDate
    ));
  }

  /**
   * Gets classification history for an asset.
   */
  public getClassificationHistory(assetId: string): ClassificationResult[] {
    return this.classificationHistory.get(assetId) || [];
  }

  /**
   * Gets all classification rules.
   */
  public getClassificationRules(): ClassificationRule[] {
    return Array.from(this.classificationRules.values());
  }

  /**
   * Adds a new classification rule.
   */
  public addClassificationRule(rule: ClassificationRule): void {
    this.classificationRules.set(rule.id, rule);
    console.log(`🏷️ Added classification rule ${rule.name}`);
  }

  /**
   * Updates an existing classification rule.
   */
  public updateClassificationRule(ruleId: string, updates: Partial<ClassificationRule>): void {
    const existingRule = this.classificationRules.get(ruleId);
    if (existingRule) {
      const updatedRule = { ...existingRule, ...updates };
      this.classificationRules.set(ruleId, updatedRule);
      console.log(`🏷️ Updated classification rule ${ruleId}`);
    }
  }

  /**
   * Gets asset characteristics for an asset.
   */
  public getAssetCharacteristics(assetId: string): AssetCharacteristics | undefined {
    return this.assetCharacteristics.get(assetId);
  }

  /**
   * Updates the configuration of the classification system.
   */
  public updateConfig(newConfig: Partial<ClassificationConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Asset Purpose Classification System configuration updated.`);
  }

  /**
   * Gets classification statistics.
   */
  public getClassificationStatistics(): {
    totalRules: number;
    activeRules: number;
    totalClassifications: number;
    averageConfidence: number;
    ruleDistribution: Record<string, number>;
  } {
    const totalRules = this.classificationRules.size;
    const activeRules = Array.from(this.classificationRules.values()).filter(r => r.isActive).length;
    
    let totalClassifications = 0;
    let totalConfidence = 0;
    const ruleDistribution: Record<string, number> = {};

    for (const history of this.classificationHistory.values()) {
      totalClassifications += history.length;
      totalConfidence += history.reduce((sum, r) => sum + r.confidence, 0);
      
      for (const result of history) {
        for (const ruleId of result.appliedRules) {
          ruleDistribution[ruleId] = (ruleDistribution[ruleId] || 0) + 1;
        }
      }
    }

    return {
      totalRules,
      activeRules,
      totalClassifications,
      averageConfidence: totalClassifications > 0 ? totalConfidence / totalClassifications : 0,
      ruleDistribution,
    };
  }
}
