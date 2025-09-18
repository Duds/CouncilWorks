/**
 * Function-Based Asset Modeling System
 *
 * Implements The Aegrid Rules Rule 1: "Every Asset Has a Purpose"
 * Provides function-based anchoring and purpose-driven asset modeling.
 *
 * @file lib/function-based-asset-modeling.ts
 * @version 1.0.0
 * @since PI3 - E17: Create Function-Based Asset Organization
 */

import {
  AssetFunction,
  AssetPurpose,
  AssetFunctionType,
  AssetPurposeCategory,
  FunctionHierarchy,
} from '@/types/resilience';

export interface AssetModel {
  id: string;
  name: string;
  description: string;
  assetType: string;
  location?: string;
  functions: AssetFunction[];
  purposes: AssetPurpose[];
  primaryFunction?: AssetFunction;
  valueContribution: number;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface FunctionModelingConfig {
  enabled: boolean;
  requirePrimaryFunction: boolean;
  allowMultiplePurposes: boolean;
  maxPurposesPerAsset: number;
  defaultFunctionType: AssetFunctionType;
  validationRules: FunctionValidationRule[];
  metadata: Record<string, any>;
}

export interface FunctionValidationRule {
  id: string;
  name: string;
  description: string;
  functionType: AssetFunctionType;
  requiredFields: string[];
  validationLogic: string;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface FunctionModelingResult {
  success: boolean;
  assetId: string;
  assignedFunctions: AssetFunction[];
  assignedPurposes: AssetPurpose[];
  validationResults: ValidationResult[];
  recommendations: string[];
  metadata: Record<string, any>;
}

export interface ValidationResult {
  ruleId: string;
  passed: boolean;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  metadata: Record<string, any>;
}

/**
 * FunctionBasedAssetModeling Class
 *
 * Core system for function-based asset modeling and purpose assignment.
 */
export class FunctionBasedAssetModeling {
  private config: FunctionModelingConfig;
  private assetModels: Map<string, AssetModel> = new Map();
  private functionLibrary: Map<string, AssetFunction> = new Map();
  private purposeLibrary: Map<string, AssetPurpose> = new Map();
  private functionHierarchy: Map<string, FunctionHierarchy> = new Map();

  constructor(config: FunctionModelingConfig) {
    this.config = { ...config };
    this.initializeDefaultFunctions();
    this.initializeDefaultPurposes();
    this.initializeFunctionHierarchy();
    console.log(`🏗️ Function-Based Asset Modeling System initialized.`);
  }

  /**
   * Initialize default asset functions based on common asset types.
   */
  private initializeDefaultFunctions(): void {
    const defaultFunctions: AssetFunction[] = [
      {
        id: 'func-transport-road',
        name: 'Road Transportation',
        description: 'Primary function for road-based transportation assets',
        functionType: AssetFunctionType.TRANSPORTATION,
        category: AssetPurposeCategory.PRIMARY,
        priority: 100,
        isActive: true,
        metadata: { assetTypes: ['road', 'bridge', 'tunnel'] },
      },
      {
        id: 'func-infra-water',
        name: 'Water Infrastructure',
        description: 'Function for water supply and distribution assets',
        functionType: AssetFunctionType.INFRASTRUCTURE,
        category: AssetPurposeCategory.PRIMARY,
        priority: 95,
        isActive: true,
        metadata: { assetTypes: ['water_main', 'reservoir', 'treatment_plant'] },
      },
      {
        id: 'func-util-power',
        name: 'Power Distribution',
        description: 'Function for electrical power distribution assets',
        functionType: AssetFunctionType.UTILITIES,
        category: AssetPurposeCategory.PRIMARY,
        priority: 90,
        isActive: true,
        metadata: { assetTypes: ['power_line', 'substation', 'generator'] },
      },
      {
        id: 'func-env-waste',
        name: 'Waste Management',
        description: 'Function for waste collection and processing assets',
        functionType: AssetFunctionType.WASTE_MANAGEMENT,
        category: AssetPurposeCategory.PRIMARY,
        priority: 85,
        isActive: true,
        metadata: { assetTypes: ['landfill', 'recycling_center', 'waste_truck'] },
      },
      {
        id: 'func-safety-emergency',
        name: 'Emergency Response',
        description: 'Function for emergency response and safety assets',
        functionType: AssetFunctionType.EMERGENCY_SERVICES,
        category: AssetPurposeCategory.EMERGENCY,
        priority: 100,
        isActive: true,
        metadata: { assetTypes: ['fire_station', 'ambulance', 'emergency_equipment'] },
      },
    ];

    defaultFunctions.forEach(func => {
      this.functionLibrary.set(func.id, func);
    });
  }

  /**
   * Initialize default asset purposes based on common use cases.
   */
  private initializeDefaultPurposes(): void {
    const defaultPurposes: AssetPurpose[] = [
      {
        id: 'purpose-primary-transport',
        assetId: '',
        functionId: 'func-transport-road',
        purpose: 'Primary Transportation Route',
        description: 'Serves as primary transportation route for community',
        category: AssetPurposeCategory.PRIMARY,
        priority: 100,
        isPrimary: true,
        valueContribution: 1.0,
        metadata: { usage: 'daily_commute', capacity: 'high' },
      },
      {
        id: 'purpose-backup-transport',
        assetId: '',
        functionId: 'func-transport-road',
        purpose: 'Backup Transportation Route',
        description: 'Provides alternative transportation route during disruptions',
        category: AssetPurposeCategory.BACKUP,
        priority: 80,
        isPrimary: false,
        valueContribution: 0.7,
        metadata: { usage: 'emergency_access', capacity: 'medium' },
      },
      {
        id: 'purpose-water-supply',
        assetId: '',
        functionId: 'func-infra-water',
        purpose: 'Water Supply Distribution',
        description: 'Distributes potable water to community',
        category: AssetPurposeCategory.PRIMARY,
        priority: 95,
        isPrimary: true,
        valueContribution: 1.0,
        metadata: { usage: 'daily_supply', capacity: 'critical' },
      },
      {
        id: 'purpose-emergency-response',
        assetId: '',
        functionId: 'func-safety-emergency',
        purpose: 'Emergency Response Service',
        description: 'Provides emergency response services to community',
        category: AssetPurposeCategory.EMERGENCY,
        priority: 100,
        isPrimary: true,
        valueContribution: 1.0,
        metadata: { usage: 'emergency_only', capacity: 'critical' },
      },
    ];

    defaultPurposes.forEach(purpose => {
      this.purposeLibrary.set(purpose.id, purpose);
    });
  }

  /**
   * Initialize function hierarchy for organizing functions by type and level.
   */
  private initializeFunctionHierarchy(): void {
    const hierarchy: FunctionHierarchy[] = [
      {
        id: 'hier-transportation',
        name: 'Transportation Functions',
        description: 'All transportation-related asset functions',
        functionType: AssetFunctionType.TRANSPORTATION,
        level: 1,
        path: ['transportation'],
        isActive: true,
        metadata: { children: ['road', 'bridge', 'tunnel', 'public_transport'] },
      },
      {
        id: 'hier-infrastructure',
        name: 'Infrastructure Functions',
        description: 'All infrastructure-related asset functions',
        functionType: AssetFunctionType.INFRASTRUCTURE,
        level: 1,
        path: ['infrastructure'],
        isActive: true,
        metadata: { children: ['water', 'sewer', 'stormwater', 'telecommunications'] },
      },
      {
        id: 'hier-utilities',
        name: 'Utilities Functions',
        description: 'All utility-related asset functions',
        functionType: AssetFunctionType.UTILITIES,
        level: 1,
        path: ['utilities'],
        isActive: true,
        metadata: { children: ['power', 'gas', 'renewable_energy'] },
      },
    ];

    hierarchy.forEach(hier => {
      this.functionHierarchy.set(hier.id, hier);
    });
  }

  /**
   * Creates a new asset model with function-based organization.
   */
  public async createAssetModel(
    assetId: string,
    assetName: string,
    assetDescription: string,
    assetType: string,
    location?: string
  ): Promise<AssetModel> {
    const assetModel: AssetModel = {
      id: assetId,
      name: assetName,
      description: assetDescription,
      assetType,
      location,
      functions: [],
      purposes: [],
      valueContribution: 0,
      isActive: true,
      metadata: { createdAt: new Date().toISOString() },
    };

    this.assetModels.set(assetId, assetModel);
    console.log(`🏗️ Created asset model for ${assetName} (${assetId})`);
    return assetModel;
  }

  /**
   * Assigns a function to an asset model.
   */
  public async assignFunctionToAsset(
    assetId: string,
    functionId: string,
    isPrimary: boolean = false,
    customPurpose?: string
  ): Promise<FunctionModelingResult> {
    const assetModel = this.assetModels.get(assetId);
    if (!assetModel) {
      return {
        success: false,
        assetId,
        assignedFunctions: [],
        assignedPurposes: [],
        validationResults: [{
          ruleId: 'asset-exists',
          passed: false,
          message: `Asset model with ID ${assetId} not found`,
          severity: 'ERROR',
          metadata: {},
        }],
        recommendations: ['Create asset model before assigning functions'],
        metadata: {},
      };
    }

    const assetFunction = this.functionLibrary.get(functionId);
    if (!assetFunction) {
      return {
        success: false,
        assetId,
        assignedFunctions: [],
        assignedPurposes: [],
        validationResults: [{
          ruleId: 'function-exists',
          passed: false,
          message: `Function with ID ${functionId} not found`,
          severity: 'ERROR',
          metadata: {},
        }],
        recommendations: ['Use valid function ID from function library'],
        metadata: {},
      };
    }

    // Validate assignment
    const validationResults = await this.validateFunctionAssignment(assetModel, assetFunction);
    const hasErrors = validationResults.some(r => r.severity === 'ERROR');
    
    if (hasErrors) {
      return {
        success: false,
        assetId,
        assignedFunctions: [],
        assignedPurposes: [],
        validationResults,
        recommendations: ['Fix validation errors before proceeding'],
        metadata: {},
      };
    }

    // Assign function
    const assignedFunction = { ...assetFunction };
    assetModel.functions.push(assignedFunction);

    if (isPrimary) {
      assetModel.primaryFunction = assignedFunction;
    }

    // Create purpose
    const purpose: AssetPurpose = {
      id: `purpose-${assetId}-${functionId}-${Date.now()}`,
      assetId,
      functionId,
      purpose: customPurpose || assetFunction.name,
      description: customPurpose ? `${customPurpose} - ${assetFunction.description}` : assetFunction.description,
      category: isPrimary ? AssetPurposeCategory.PRIMARY : AssetPurposeCategory.SECONDARY,
      priority: assetFunction.priority,
      isPrimary,
      valueContribution: isPrimary ? 1.0 : 0.7,
      metadata: { assignedAt: new Date().toISOString() },
    };

    assetModel.purposes.push(purpose);
    this.purposeLibrary.set(purpose.id, purpose);

    // Update value contribution
    assetModel.valueContribution = this.calculateValueContribution(assetModel);

    console.log(`🏗️ Assigned function ${assetFunction.name} to asset ${assetModel.name}`);

    return {
      success: true,
      assetId,
      assignedFunctions: [assignedFunction],
      assignedPurposes: [purpose],
      validationResults,
      recommendations: this.generateRecommendations(assetModel),
      metadata: { assignedAt: new Date().toISOString() },
    };
  }

  /**
   * Validates a function assignment against defined rules.
   */
  private async validateFunctionAssignment(
    assetModel: AssetModel,
    assetFunction: AssetFunction
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Check if asset already has primary function
    if (assetModel.primaryFunction && assetFunction.category === AssetPurposeCategory.PRIMARY) {
      results.push({
        ruleId: 'primary-function-unique',
        passed: false,
        message: 'Asset already has a primary function',
        severity: 'WARNING',
        metadata: { existingPrimary: assetModel.primaryFunction.name },
      });
    }

    // Check maximum purposes per asset
    if (assetModel.purposes.length >= this.config.maxPurposesPerAsset) {
      results.push({
        ruleId: 'max-purposes',
        passed: false,
        message: `Asset has reached maximum purposes limit (${this.config.maxPurposesPerAsset})`,
        severity: 'ERROR',
        metadata: { currentCount: assetModel.purposes.length },
      });
    }

    // Check function compatibility with asset type
    const compatibleAssetTypes = assetFunction.metadata.assetTypes as string[] || [];
    if (compatibleAssetTypes.length > 0 && !compatibleAssetTypes.includes(assetModel.assetType)) {
      results.push({
        ruleId: 'asset-type-compatibility',
        passed: false,
        message: `Function ${assetFunction.name} may not be compatible with asset type ${assetModel.assetType}`,
        severity: 'WARNING',
        metadata: { compatibleTypes: compatibleAssetTypes },
      });
    }

    // Run custom validation rules
    for (const rule of this.config.validationRules) {
      if (rule.isActive && rule.functionType === assetFunction.functionType) {
        const ruleResult = await this.executeValidationRule(rule, assetModel, assetFunction);
        results.push(ruleResult);
      }
    }

    return results;
  }

  /**
   * Executes a custom validation rule.
   */
  private async executeValidationRule(
    rule: FunctionValidationRule,
    assetModel: AssetModel,
    assetFunction: AssetFunction
  ): Promise<ValidationResult> {
    // Simplified validation logic - in a real system, this would execute the validationLogic string
    const hasRequiredFields = rule.requiredFields.every(field => 
      assetModel.metadata[field] !== undefined
    );

    return {
      ruleId: rule.id,
      passed: hasRequiredFields,
      message: hasRequiredFields ? 'Validation rule passed' : `Missing required fields: ${rule.requiredFields.join(', ')}`,
      severity: hasRequiredFields ? 'INFO' : 'ERROR',
      metadata: { ruleName: rule.name },
    };
  }

  /**
   * Calculates the value contribution of an asset based on its purposes.
   */
  private calculateValueContribution(assetModel: AssetModel): number {
    if (assetModel.purposes.length === 0) return 0;

    const totalValue = assetModel.purposes.reduce((sum, purpose) => {
      return sum + (purpose.valueContribution * purpose.priority / 100);
    }, 0);

    return Math.min(1.0, totalValue / assetModel.purposes.length);
  }

  /**
   * Generates recommendations for improving asset function assignment.
   */
  private generateRecommendations(assetModel: AssetModel): string[] {
    const recommendations: string[] = [];

    if (!assetModel.primaryFunction) {
      recommendations.push('Consider assigning a primary function to improve asset value visibility');
    }

    if (assetModel.purposes.length === 0) {
      recommendations.push('Asset has no assigned purposes - consider adding functions');
    }

    if (assetModel.valueContribution < 0.5) {
      recommendations.push('Low value contribution - review purpose assignments and priorities');
    }

    const functionTypes = new Set(assetModel.functions.map(f => f.functionType));
    if (functionTypes.size > 3) {
      recommendations.push('Asset has many different function types - consider consolidating');
    }

    return recommendations;
  }

  /**
   * Gets all asset models organized by function type.
   */
  public getAssetsByFunctionType(functionType: AssetFunctionType): AssetModel[] {
    return Array.from(this.assetModels.values()).filter(asset =>
      asset.functions.some(func => func.functionType === functionType)
    );
  }

  /**
   * Gets assets with specific purpose category.
   */
  public getAssetsByPurposeCategory(category: AssetPurposeCategory): AssetModel[] {
    return Array.from(this.assetModels.values()).filter(asset =>
      asset.purposes.some(purpose => purpose.category === category)
    );
  }

  /**
   * Gets orphaned assets (assets without assigned functions).
   */
  public getOrphanedAssets(): AssetModel[] {
    return Array.from(this.assetModels.values()).filter(asset =>
      asset.functions.length === 0
    );
  }

  /**
   * Gets the function hierarchy for organizing functions.
   */
  public getFunctionHierarchy(): FunctionHierarchy[] {
    return Array.from(this.functionHierarchy.values());
  }

  /**
   * Gets all available functions in the library.
   */
  public getFunctionLibrary(): AssetFunction[] {
    return Array.from(this.functionLibrary.values());
  }

  /**
   * Gets all purposes in the library.
   */
  public getPurposeLibrary(): AssetPurpose[] {
    return Array.from(this.purposeLibrary.values());
  }

  /**
   * Gets a specific asset model by ID.
   */
  public getAssetModel(assetId: string): AssetModel | undefined {
    return this.assetModels.get(assetId);
  }

  /**
   * Gets all asset models.
   */
  public getAllAssetModels(): AssetModel[] {
    return Array.from(this.assetModels.values());
  }

  /**
   * Updates the configuration of the function-based asset modeling system.
   */
  public updateConfig(newConfig: Partial<FunctionModelingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Function-Based Asset Modeling configuration updated.`);
  }

  /**
   * Adds a new function to the library.
   */
  public addFunction(assetFunction: AssetFunction): void {
    this.functionLibrary.set(assetFunction.id, assetFunction);
    console.log(`🏗️ Added function ${assetFunction.name} to library`);
  }

  /**
   * Adds a new purpose template to the library.
   */
  public addPurposeTemplate(purpose: AssetPurpose): void {
    this.purposeLibrary.set(purpose.id, purpose);
    console.log(`🏗️ Added purpose template ${purpose.purpose} to library`);
  }

  /**
   * Removes an asset model.
   */
  public removeAssetModel(assetId: string): boolean {
    const removed = this.assetModels.delete(assetId);
    if (removed) {
      console.log(`🏗️ Removed asset model ${assetId}`);
    }
    return removed;
  }
}
