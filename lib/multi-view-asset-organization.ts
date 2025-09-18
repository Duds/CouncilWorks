/**
 * Multi-View Asset Organization System
 *
 * Provides multiple organizational views of assets (functional, operational,
 * financial, compliance, risk, location, hierarchical) enabling different
 * perspectives without restructuring the underlying data.
 *
 * @file lib/multi-view-asset-organization.ts
 * @version 1.0.0
 * @since PI3 - E17: Create Function-Based Asset Organization
 */

import {
  OrganizationViewType,
  AssetOrganizationView,
  AssetFunctionType,
  AssetPurposeCategory,
} from '@/types/resilience';
import { AssetModel } from './function-based-asset-modeling';

export interface ViewConfiguration {
  id: string;
  name: string;
  description: string;
  viewType: OrganizationViewType;
  groupingFields: string[];
  sortingFields: string[];
  filters: ViewFilter[];
  displayFields: string[];
  isDefault: boolean;
  metadata: Record<string, any>;
}

export interface ViewFilter {
  field: string;
  operator: 'EQUALS' | 'CONTAINS' | 'IN' | 'GT' | 'LT' | 'GTE' | 'LTE' | 'BETWEEN';
  value: any;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface ViewResult {
  viewId: string;
  viewType: OrganizationViewType;
  groups: ViewGroup[];
  totalAssets: number;
  totalValue: number;
  metadata: Record<string, any>;
}

export interface ViewGroup {
  id: string;
  name: string;
  description: string;
  level: number;
  parentId?: string;
  children: string[];
  assets: AssetModel[];
  assetCount: number;
  totalValue: number;
  averageValue: number;
  metadata: Record<string, any>;
}

export interface ViewConfiguration {
  enabled: boolean;
  defaultViewType: OrganizationViewType;
  maxGroupingLevels: number;
  enableDynamicViews: boolean;
  enableCustomViews: boolean;
  viewCacheTimeout: number;
  metadata: Record<string, any>;
}

/**
 * MultiViewAssetOrganization Class
 *
 * Manages multiple organizational views of assets for different perspectives.
 */
export class MultiViewAssetOrganization {
  private config: ViewConfiguration;
  private viewConfigurations: Map<string, ViewConfiguration> = new Map();
  private assetModels: Map<string, AssetModel> = new Map();
  private viewCache: Map<string, { result: ViewResult; timestamp: Date }> = new Map();

  constructor(config: ViewConfiguration) {
    this.config = { ...config };
    this.initializeDefaultViews();
    console.log(`👁️ Multi-View Asset Organization System initialized.`);
  }

  /**
   * Initialize default view configurations for different organizational perspectives.
   */
  private initializeDefaultViews(): void {
    const defaultViews: ViewConfiguration[] = [
      {
        id: 'view-functional',
        name: 'Functional View',
        description: 'Organize assets by their primary functions and purposes',
        viewType: OrganizationViewType.FUNCTIONAL,
        groupingFields: ['primaryFunction.functionType', 'purposes.category'],
        sortingFields: ['primaryFunction.priority', 'valueContribution'],
        filters: [
          { field: 'isActive', operator: 'EQUALS', value: true, isActive: true, metadata: {} },
        ],
        displayFields: ['name', 'primaryFunction.name', 'purposes.purpose', 'valueContribution'],
        isDefault: true,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'view-operational',
        name: 'Operational View',
        description: 'Organize assets by operational requirements and usage patterns',
        viewType: OrganizationViewType.OPERATIONAL,
        groupingFields: ['assetType', 'location', 'purposes.category'],
        sortingFields: ['valueContribution', 'primaryFunction.priority'],
        filters: [
          { field: 'isActive', operator: 'EQUALS', value: true, isActive: true, metadata: {} },
        ],
        displayFields: ['name', 'assetType', 'location', 'purposes.purpose'],
        isDefault: false,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'view-financial',
        name: 'Financial View',
        description: 'Organize assets by financial value and cost implications',
        viewType: OrganizationViewType.FINANCIAL,
        groupingFields: ['valueContribution', 'primaryFunction.functionType'],
        sortingFields: ['valueContribution', 'purposes.priority'],
        filters: [
          { field: 'valueContribution', operator: 'GTE', value: 0.1, isActive: true, metadata: {} },
        ],
        displayFields: ['name', 'valueContribution', 'primaryFunction.name', 'purposes.purpose'],
        isDefault: false,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'view-compliance',
        name: 'Compliance View',
        description: 'Organize assets by compliance requirements and regulatory needs',
        viewType: OrganizationViewType.COMPLIANCE,
        groupingFields: ['primaryFunction.functionType', 'assetType'],
        sortingFields: ['primaryFunction.priority', 'valueContribution'],
        filters: [
          { field: 'isActive', operator: 'EQUALS', value: true, isActive: true, metadata: {} },
        ],
        displayFields: ['name', 'primaryFunction.name', 'assetType', 'complianceStatus'],
        isDefault: false,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'view-risk',
        name: 'Risk View',
        description: 'Organize assets by risk levels and criticality',
        viewType: OrganizationViewType.RISK,
        groupingFields: ['riskLevel', 'primaryFunction.functionType'],
        sortingFields: ['riskLevel', 'valueContribution'],
        filters: [
          { field: 'isActive', operator: 'EQUALS', value: true, isActive: true, metadata: {} },
        ],
        displayFields: ['name', 'riskLevel', 'primaryFunction.name', 'valueContribution'],
        isDefault: false,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'view-location',
        name: 'Location View',
        description: 'Organize assets by geographical location and proximity',
        viewType: OrganizationViewType.LOCATION,
        groupingFields: ['location', 'assetType'],
        sortingFields: ['location', 'name'],
        filters: [
          { field: 'location', operator: 'CONTAINS', value: '', isActive: false, metadata: {} },
        ],
        displayFields: ['name', 'location', 'assetType', 'primaryFunction.name'],
        isDefault: false,
        metadata: { createdBy: 'system', version: '1.0' },
      },
      {
        id: 'view-hierarchical',
        name: 'Hierarchical View',
        description: 'Organize assets in a traditional hierarchical structure',
        viewType: OrganizationViewType.HIERARCHICAL,
        groupingFields: ['primaryFunction.functionType', 'assetType', 'location'],
        sortingFields: ['primaryFunction.priority', 'name'],
        filters: [
          { field: 'isActive', operator: 'EQUALS', value: true, isActive: true, metadata: {} },
        ],
        displayFields: ['name', 'primaryFunction.name', 'assetType', 'location'],
        isDefault: false,
        metadata: { createdBy: 'system', version: '1.0' },
      },
    ];

    defaultViews.forEach(view => {
      this.viewConfigurations.set(view.id, view);
    });
  }

  /**
   * Registers an asset model with the multi-view organization system.
   */
  public registerAssetModel(assetModel: AssetModel): void {
    this.assetModels.set(assetModel.id, assetModel);
    this.invalidateViewCache();
    console.log(`👁️ Registered asset model ${assetModel.name} with multi-view organization`);
  }

  /**
   * Gets assets organized according to a specific view configuration.
   */
  public getView(viewId: string): ViewResult {
    // Check cache first
    const cached = this.viewCache.get(viewId);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.result;
    }

    const viewConfig = this.viewConfigurations.get(viewId);
    if (!viewConfig) {
      throw new Error(`View configuration ${viewId} not found`);
    }

    const result = this.generateView(viewConfig);
    
    // Cache the result
    this.viewCache.set(viewId, {
      result,
      timestamp: new Date(),
    });

    return result;
  }

  /**
   * Generates a view result based on view configuration.
   */
  private generateView(viewConfig: ViewConfiguration): ViewResult {
    // Apply filters to get relevant assets
    const filteredAssets = this.applyFilters(viewConfig.filters);
    
    // Group assets according to grouping fields
    const groups = this.groupAssets(filteredAssets, viewConfig.groupingFields);
    
    // Sort groups and assets within groups
    const sortedGroups = this.sortGroups(groups, viewConfig.sortingFields);
    
    // Calculate totals
    const totalAssets = filteredAssets.length;
    const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.valueContribution, 0);

    return {
      viewId: viewConfig.id,
      viewType: viewConfig.viewType,
      groups: sortedGroups,
      totalAssets,
      totalValue,
      metadata: { 
        generatedAt: new Date().toISOString(),
        viewConfig: viewConfig.id,
      },
    };
  }

  /**
   * Applies filters to asset models.
   */
  private applyFilters(filters: ViewFilter[]): AssetModel[] {
    let filteredAssets = Array.from(this.assetModels.values());

    for (const filter of filters) {
      if (!filter.isActive) continue;

      filteredAssets = filteredAssets.filter(asset => {
        return this.evaluateFilter(filter, asset);
      });
    }

    return filteredAssets;
  }

  /**
   * Evaluates a single filter against an asset model.
   */
  private evaluateFilter(filter: ViewFilter, asset: AssetModel): boolean {
    const fieldValue = this.getFieldValue(filter.field, asset);

    switch (filter.operator) {
      case 'EQUALS':
        return fieldValue === filter.value;
      case 'CONTAINS':
        return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(filter.value.toLowerCase());
      case 'IN':
        return Array.isArray(filter.value) && filter.value.includes(fieldValue);
      case 'GT':
        return typeof fieldValue === 'number' && fieldValue > filter.value;
      case 'LT':
        return typeof fieldValue === 'number' && fieldValue < filter.value;
      case 'GTE':
        return typeof fieldValue === 'number' && fieldValue >= filter.value;
      case 'LTE':
        return typeof fieldValue === 'number' && fieldValue <= filter.value;
      case 'BETWEEN':
        return typeof fieldValue === 'number' && 
               fieldValue >= filter.value[0] && 
               fieldValue <= filter.value[1];
      default:
        return true;
    }
  }

  /**
   * Gets field value from asset model using dot notation.
   */
  private getFieldValue(field: string, asset: AssetModel): any {
    const parts = field.split('.');
    let value: any = asset;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Groups assets according to grouping fields.
   */
  private groupAssets(assets: AssetModel[], groupingFields: string[]): ViewGroup[] {
    if (groupingFields.length === 0) {
      return [{
        id: 'all-assets',
        name: 'All Assets',
        description: 'All assets without grouping',
        level: 0,
        children: [],
        assets,
        assetCount: assets.length,
        totalValue: assets.reduce((sum, asset) => sum + asset.valueContribution, 0),
        averageValue: assets.length > 0 ? assets.reduce((sum, asset) => sum + asset.valueContribution, 0) / assets.length : 0,
        metadata: {},
      }];
    }

    const groups = new Map<string, ViewGroup>();
    const groupHierarchy = new Map<string, string[]>();

    for (const asset of assets) {
      const groupPath = this.getGroupPath(asset, groupingFields);
      const groupId = groupPath.join('|');

      if (!groups.has(groupId)) {
        const group: ViewGroup = {
          id: groupId,
          name: groupPath[groupPath.length - 1] || 'Unknown',
          description: `Assets grouped by ${groupPath.join(' > ')}`,
          level: groupPath.length - 1,
          children: [],
          assets: [],
          assetCount: 0,
          totalValue: 0,
          averageValue: 0,
          metadata: { groupPath },
        };

        groups.set(groupId, group);

        // Build hierarchy
        for (let i = 0; i < groupPath.length - 1; i++) {
          const parentPath = groupPath.slice(0, i + 1);
          const parentId = parentPath.join('|');
          
          if (!groupHierarchy.has(parentId)) {
            groupHierarchy.set(parentId, []);
          }
          
          const siblings = groupHierarchy.get(parentId)!;
          if (!siblings.includes(groupId)) {
            siblings.push(groupId);
          }
        }
      }

      const group = groups.get(groupId)!;
      group.assets.push(asset);
      group.assetCount++;
      group.totalValue += asset.valueContribution;
    }

    // Calculate averages and set parent-child relationships
    for (const group of groups.values()) {
      group.averageValue = group.assetCount > 0 ? group.totalValue / group.assetCount : 0;
      
      const children = groupHierarchy.get(group.id) || [];
      group.children = children;
      
      if (group.level > 0) {
        const parentPath = group.metadata.groupPath.slice(0, -1);
        group.parentId = parentPath.join('|');
      }
    }

    return Array.from(groups.values());
  }

  /**
   * Gets group path for an asset based on grouping fields.
   */
  private getGroupPath(asset: AssetModel, groupingFields: string[]): string[] {
    const path: string[] = [];

    for (const field of groupingFields) {
      const value = this.getFieldValue(field, asset);
      const displayValue = this.formatGroupValue(value, field);
      path.push(displayValue);
    }

    return path;
  }

  /**
   * Formats a value for display in group names.
   */
  private formatGroupValue(value: any, field: string): string {
    if (value === undefined || value === null) {
      return 'Unknown';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    if (typeof value === 'object') {
      if (field.includes('functionType')) {
        return value.toString();
      }
      if (field.includes('category')) {
        return value.toString();
      }
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Sorts groups according to sorting fields.
   */
  private sortGroups(groups: ViewGroup[], sortingFields: string[]): ViewGroup[] {
    return groups.sort((a, b) => {
      for (const field of sortingFields) {
        const aValue = this.getGroupSortValue(a, field);
        const bValue = this.getGroupSortValue(b, field);
        
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      }
      return 0;
    });
  }

  /**
   * Gets sort value for a group based on sorting field.
   */
  private getGroupSortValue(group: ViewGroup, field: string): any {
    switch (field) {
      case 'name':
        return group.name;
      case 'assetCount':
        return group.assetCount;
      case 'totalValue':
        return group.totalValue;
      case 'averageValue':
        return group.averageValue;
      case 'level':
        return group.level;
      default:
        return group.name;
    }
  }

  /**
   * Checks if cached view is still valid.
   */
  private isCacheValid(timestamp: Date): boolean {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    return diffMs < this.config.viewCacheTimeout;
  }

  /**
   * Invalidates view cache.
   */
  private invalidateViewCache(): void {
    this.viewCache.clear();
  }

  /**
   * Gets all available view configurations.
   */
  public getViewConfigurations(): ViewConfiguration[] {
    return Array.from(this.viewConfigurations.values());
  }

  /**
   * Gets a specific view configuration by ID.
   */
  public getViewConfiguration(viewId: string): ViewConfiguration | undefined {
    return this.viewConfigurations.get(viewId);
  }

  /**
   * Creates a new view configuration.
   */
  public createViewConfiguration(config: ViewConfiguration): void {
    this.viewConfigurations.set(config.id, config);
    this.invalidateViewCache();
    console.log(`👁️ Created view configuration ${config.name}`);
  }

  /**
   * Updates an existing view configuration.
   */
  public updateViewConfiguration(viewId: string, updates: Partial<ViewConfiguration>): void {
    const existing = this.viewConfigurations.get(viewId);
    if (existing) {
      const updated = { ...existing, ...updates };
      this.viewConfigurations.set(viewId, updated);
      this.invalidateViewCache();
      console.log(`👁️ Updated view configuration ${viewId}`);
    }
  }

  /**
   * Gets the default view configuration.
   */
  public getDefaultView(): ViewConfiguration | undefined {
    return Array.from(this.viewConfigurations.values()).find(config => config.isDefault);
  }

  /**
   * Gets assets organized by function type.
   */
  public getAssetsByFunctionType(functionType: AssetFunctionType): AssetModel[] {
    return Array.from(this.assetModels.values()).filter(asset =>
      asset.functions.some(func => func.functionType === functionType)
    );
  }

  /**
   * Gets assets organized by purpose category.
   */
  public getAssetsByPurposeCategory(category: AssetPurposeCategory): AssetModel[] {
    return Array.from(this.assetModels.values()).filter(asset =>
      asset.purposes.some(purpose => purpose.category === category)
    );
  }

  /**
   * Gets view statistics.
   */
  public getViewStatistics(): {
    totalViews: number;
    totalAssets: number;
    cacheHitRate: number;
    mostUsedView: string;
    viewDistribution: Record<string, number>;
  } {
    const totalViews = this.viewConfigurations.size;
    const totalAssets = this.assetModels.size;
    
    // Calculate cache hit rate (simplified)
    const cacheHitRate = this.viewCache.size > 0 ? 0.8 : 0; // Placeholder
    
    // Find most used view (simplified)
    const mostUsedView = Array.from(this.viewConfigurations.values())
      .find(config => config.isDefault)?.id || 'view-functional';
    
    // View distribution (simplified)
    const viewDistribution: Record<string, number> = {};
    for (const config of this.viewConfigurations.values()) {
      viewDistribution[config.viewType] = (viewDistribution[config.viewType] || 0) + 1;
    }

    return {
      totalViews,
      totalAssets,
      cacheHitRate,
      mostUsedView,
      viewDistribution,
    };
  }

  /**
   * Updates the configuration of the multi-view organization system.
   */
  public updateConfig(newConfig: Partial<ViewConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Multi-View Asset Organization configuration updated.`);
  }

  /**
   * Removes an asset model from the organization system.
   */
  public unregisterAssetModel(assetId: string): boolean {
    const removed = this.assetModels.delete(assetId);
    if (removed) {
      this.invalidateViewCache();
      console.log(`👁️ Unregistered asset model ${assetId} from multi-view organization`);
    }
    return removed;
  }
}
