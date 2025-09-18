/**
 * Purpose-Driven Hierarchy Engine
 *
 * Implements hierarchical organization of assets based on their purposes
 * and functions, enabling flexible multi-level views and navigation.
 *
 * @file lib/purpose-driven-hierarchy-engine.ts
 * @version 1.0.0
 * @since PI3 - E17: Create Function-Based Asset Organization
 */

import {
  FunctionHierarchy,
  AssetFunctionType,
  AssetPurposeCategory,
  OrganizationViewType,
} from '@/types/resilience';
import { AssetModel, AssetFunction, AssetPurpose } from './function-based-asset-modeling';

export interface HierarchyNode {
  id: string;
  name: string;
  description: string;
  type: 'FUNCTION' | 'PURPOSE' | 'ASSET' | 'GROUP';
  level: number;
  parentId?: string;
  children: string[];
  path: string[];
  assetCount: number;
  valueContribution: number;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface HierarchyView {
  id: string;
  name: string;
  description: string;
  viewType: OrganizationViewType;
  rootNodes: string[];
  maxDepth: number;
  groupingStrategy: 'FUNCTION_FIRST' | 'PURPOSE_FIRST' | 'ASSET_FIRST' | 'MIXED';
  sortingStrategy: 'ALPHABETICAL' | 'VALUE' | 'PRIORITY' | 'CUSTOM';
  filters: Record<string, any>;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface HierarchyTraversalResult {
  nodes: HierarchyNode[];
  path: string[];
  depth: number;
  totalAssets: number;
  totalValue: number;
  metadata: Record<string, any>;
}

export interface HierarchyConfiguration {
  enabled: boolean;
  maxDepth: number;
  allowCircularReferences: boolean;
  autoRebuildOnChange: boolean;
  defaultViewType: OrganizationViewType;
  groupingStrategies: string[];
  sortingStrategies: string[];
  metadata: Record<string, any>;
}

/**
 * PurposeDrivenHierarchyEngine Class
 *
 * Manages hierarchical organization of assets based on purposes and functions.
 */
export class PurposeDrivenHierarchyEngine {
  private config: HierarchyConfiguration;
  private hierarchyNodes: Map<string, HierarchyNode> = new Map();
  private hierarchyViews: Map<string, HierarchyView> = new Map();
  private assetModels: Map<string, AssetModel> = new Map();
  private functionHierarchy: Map<string, FunctionHierarchy> = new Map();

  constructor(config: HierarchyConfiguration) {
    this.config = { ...config };
    this.initializeDefaultHierarchy();
    this.initializeDefaultViews();
    console.log(`🌳 Purpose-Driven Hierarchy Engine initialized.`);
  }

  /**
   * Initialize default hierarchy structure based on function types.
   */
  private initializeDefaultHierarchy(): void {
    const defaultHierarchy: FunctionHierarchy[] = [
      {
        id: 'hier-root',
        name: 'Asset Organization Root',
        description: 'Root of the purpose-driven hierarchy',
        functionType: AssetFunctionType.OTHER,
        level: 0,
        path: [],
        isActive: true,
        metadata: { isRoot: true },
      },
      {
        id: 'hier-transportation',
        name: 'Transportation',
        description: 'All transportation-related assets',
        parentId: 'hier-root',
        children: ['hier-road', 'hier-bridge', 'hier-public-transport'],
        functionType: AssetFunctionType.TRANSPORTATION,
        level: 1,
        path: ['transportation'],
        isActive: true,
        metadata: { priority: 100 },
      },
      {
        id: 'hier-infrastructure',
        name: 'Infrastructure',
        description: 'All infrastructure-related assets',
        parentId: 'hier-root',
        children: ['hier-water', 'hier-sewer', 'hier-stormwater'],
        functionType: AssetFunctionType.INFRASTRUCTURE,
        level: 1,
        path: ['infrastructure'],
        isActive: true,
        metadata: { priority: 95 },
      },
      {
        id: 'hier-utilities',
        name: 'Utilities',
        description: 'All utility-related assets',
        parentId: 'hier-root',
        children: ['hier-power', 'hier-gas', 'hier-renewable'],
        functionType: AssetFunctionType.UTILITIES,
        level: 1,
        path: ['utilities'],
        isActive: true,
        metadata: { priority: 90 },
      },
      {
        id: 'hier-emergency',
        name: 'Emergency Services',
        description: 'All emergency service assets',
        parentId: 'hier-root',
        children: ['hier-fire', 'hier-police', 'hier-medical'],
        functionType: AssetFunctionType.EMERGENCY_SERVICES,
        level: 1,
        path: ['emergency'],
        isActive: true,
        metadata: { priority: 100 },
      },
    ];

    defaultHierarchy.forEach(hier => {
      this.functionHierarchy.set(hier.id, hier);
    });
  }

  /**
   * Initialize default hierarchy views for different organizational perspectives.
   */
  private initializeDefaultViews(): void {
    const defaultViews: HierarchyView[] = [
      {
        id: 'view-functional',
        name: 'Functional View',
        description: 'Organize assets by their primary functions',
        viewType: OrganizationViewType.FUNCTIONAL,
        rootNodes: ['hier-transportation', 'hier-infrastructure', 'hier-utilities', 'hier-emergency'],
        maxDepth: 4,
        groupingStrategy: 'FUNCTION_FIRST',
        sortingStrategy: 'PRIORITY',
        filters: {},
        isActive: true,
        metadata: { isDefault: true },
      },
      {
        id: 'view-operational',
        name: 'Operational View',
        description: 'Organize assets by operational requirements',
        viewType: OrganizationViewType.OPERATIONAL,
        rootNodes: ['hier-root'],
        maxDepth: 3,
        groupingStrategy: 'MIXED',
        sortingStrategy: 'VALUE',
        filters: { includeInactive: false },
        isActive: true,
        metadata: { isDefault: false },
      },
      {
        id: 'view-financial',
        name: 'Financial View',
        description: 'Organize assets by financial value and cost',
        viewType: OrganizationViewType.FINANCIAL,
        rootNodes: ['hier-root'],
        maxDepth: 3,
        groupingStrategy: 'VALUE_FIRST',
        sortingStrategy: 'VALUE',
        filters: { minValue: 0 },
        isActive: true,
        metadata: { isDefault: false },
      },
    ];

    defaultViews.forEach(view => {
      this.hierarchyViews.set(view.id, view);
    });
  }

  /**
   * Registers an asset model with the hierarchy engine.
   */
  public registerAssetModel(assetModel: AssetModel): void {
    this.assetModels.set(assetModel.id, assetModel);
    this.rebuildHierarchyNodes();
    console.log(`🌳 Registered asset model ${assetModel.name} with hierarchy engine`);
  }

  /**
   * Rebuilds hierarchy nodes based on current asset models.
   */
  private rebuildHierarchyNodes(): void {
    // Clear existing nodes
    this.hierarchyNodes.clear();

    // Create nodes for each function hierarchy
    for (const [hierId, hierarchy] of this.functionHierarchy) {
      const node: HierarchyNode = {
        id: hierId,
        name: hierarchy.name,
        description: hierarchy.description,
        type: 'FUNCTION',
        level: hierarchy.level,
        parentId: hierarchy.parentId,
        children: [...(hierarchy.children || [])],
        path: [...hierarchy.path],
        assetCount: 0,
        valueContribution: 0,
        isActive: hierarchy.isActive,
        metadata: { ...hierarchy.metadata },
      };

      // Count assets for this function type
      const assetsForFunction = Array.from(this.assetModels.values()).filter(asset =>
        asset.functions.some(func => func.functionType === hierarchy.functionType)
      );

      node.assetCount = assetsForFunction.length;
      node.valueContribution = assetsForFunction.reduce((sum, asset) => 
        sum + asset.valueContribution, 0
      );

      this.hierarchyNodes.set(hierId, node);
    }

    // Create purpose-based nodes
    this.createPurposeNodes();

    // Create asset-level nodes
    this.createAssetNodes();
  }

  /**
   * Creates purpose-based hierarchy nodes.
   */
  private createPurposeNodes(): void {
    const purposeGroups = new Map<AssetPurposeCategory, string[]>();

    // Group assets by purpose category
    for (const assetModel of this.assetModels.values()) {
      for (const purpose of assetModel.purposes) {
        if (!purposeGroups.has(purpose.category)) {
          purposeGroups.set(purpose.category, []);
        }
        purposeGroups.get(purpose.category)!.push(assetModel.id);
      }
    }

    // Create purpose nodes
    for (const [category, assetIds] of purposeGroups) {
      const nodeId = `purpose-${category.toLowerCase()}`;
      const node: HierarchyNode = {
        id: nodeId,
        name: `${category} Purpose Assets`,
        description: `Assets serving ${category.toLowerCase()} purposes`,
        type: 'PURPOSE',
        level: 2,
        parentId: 'hier-root',
        children: assetIds,
        path: ['purposes', category.toLowerCase()],
        assetCount: assetIds.length,
        valueContribution: assetIds.reduce((sum, assetId) => {
          const asset = this.assetModels.get(assetId);
          return sum + (asset?.valueContribution || 0);
        }, 0),
        isActive: true,
        metadata: { category, assetIds },
      };

      this.hierarchyNodes.set(nodeId, node);
    }
  }

  /**
   * Creates asset-level hierarchy nodes.
   */
  private createAssetNodes(): void {
    for (const assetModel of this.assetModels.values()) {
      const nodeId = `asset-${assetModel.id}`;
      const node: HierarchyNode = {
        id: nodeId,
        name: assetModel.name,
        description: assetModel.description,
        type: 'ASSET',
        level: 3,
        children: [],
        path: ['assets', assetModel.id],
        assetCount: 1,
        valueContribution: assetModel.valueContribution,
        isActive: assetModel.isActive,
        metadata: { 
          assetType: assetModel.assetType,
          location: assetModel.location,
          functions: assetModel.functions.map(f => f.id),
          purposes: assetModel.purposes.map(p => p.id),
        },
      };

      this.hierarchyNodes.set(nodeId, node);
    }
  }

  /**
   * Gets hierarchy nodes for a specific view.
   */
  public getHierarchyForView(viewId: string): HierarchyNode[] {
    const view = this.hierarchyViews.get(viewId);
    if (!view || !view.isActive) {
      return [];
    }

    const nodes: HierarchyNode[] = [];
    const visited = new Set<string>();

    // Start from root nodes
    for (const rootNodeId of view.rootNodes) {
      this.traverseHierarchy(rootNodeId, view, nodes, visited, 0);
    }

    return this.applyViewFilters(nodes, view);
  }

  /**
   * Traverses hierarchy starting from a root node.
   */
  private traverseHierarchy(
    nodeId: string,
    view: HierarchyView,
    nodes: HierarchyNode[],
    visited: Set<string>,
    currentDepth: number
  ): void {
    if (visited.has(nodeId) || currentDepth >= view.maxDepth) {
      return;
    }

    const node = this.hierarchyNodes.get(nodeId);
    if (!node || !node.isActive) {
      return;
    }

    visited.add(nodeId);
    nodes.push(node);

    // Traverse children
    for (const childId of node.children) {
      this.traverseHierarchy(childId, view, nodes, visited, currentDepth + 1);
    }
  }

  /**
   * Applies view-specific filters to hierarchy nodes.
   */
  private applyViewFilters(nodes: HierarchyNode[], view: HierarchyView): HierarchyNode[] {
    let filteredNodes = [...nodes];

    // Apply active filter
    if (!view.filters.includeInactive) {
      filteredNodes = filteredNodes.filter(node => node.isActive);
    }

    // Apply minimum value filter
    if (view.filters.minValue !== undefined) {
      filteredNodes = filteredNodes.filter(node => 
        node.valueContribution >= view.filters.minValue
      );
    }

    // Apply sorting strategy
    filteredNodes = this.applySortingStrategy(filteredNodes, view.sortingStrategy);

    return filteredNodes;
  }

  /**
   * Applies sorting strategy to hierarchy nodes.
   */
  private applySortingStrategy(nodes: HierarchyNode[], strategy: string): HierarchyNode[] {
    switch (strategy) {
      case 'ALPHABETICAL':
        return nodes.sort((a, b) => a.name.localeCompare(b.name));
      case 'VALUE':
        return nodes.sort((a, b) => b.valueContribution - a.valueContribution);
      case 'PRIORITY':
        return nodes.sort((a, b) => {
          const aPriority = a.metadata.priority || 0;
          const bPriority = b.metadata.priority || 0;
          return bPriority - aPriority;
        });
      default:
        return nodes;
    }
  }

  /**
   * Gets a specific hierarchy node by ID.
   */
  public getHierarchyNode(nodeId: string): HierarchyNode | undefined {
    return this.hierarchyNodes.get(nodeId);
  }

  /**
   * Gets all hierarchy views.
   */
  public getHierarchyViews(): HierarchyView[] {
    return Array.from(this.hierarchyViews.values());
  }

  /**
   * Gets a specific hierarchy view by ID.
   */
  public getHierarchyView(viewId: string): HierarchyView | undefined {
    return this.hierarchyViews.get(viewId);
  }

  /**
   * Creates a new hierarchy view.
   */
  public createHierarchyView(view: HierarchyView): void {
    this.hierarchyViews.set(view.id, view);
    console.log(`🌳 Created hierarchy view ${view.name}`);
  }

  /**
   * Updates an existing hierarchy view.
   */
  public updateHierarchyView(viewId: string, updates: Partial<HierarchyView>): void {
    const existingView = this.hierarchyViews.get(viewId);
    if (existingView) {
      const updatedView = { ...existingView, ...updates };
      this.hierarchyViews.set(viewId, updatedView);
      console.log(`🌳 Updated hierarchy view ${viewId}`);
    }
  }

  /**
   * Gets assets organized by a specific function type.
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
   * Gets hierarchy statistics for a specific view.
   */
  public getHierarchyStatistics(viewId: string): {
    totalNodes: number;
    totalAssets: number;
    totalValue: number;
    averageDepth: number;
    functionDistribution: Record<string, number>;
    purposeDistribution: Record<string, number>;
  } {
    const nodes = this.getHierarchyForView(viewId);
    const totalNodes = nodes.length;
    const totalAssets = nodes.reduce((sum, node) => sum + node.assetCount, 0);
    const totalValue = nodes.reduce((sum, node) => sum + node.valueContribution, 0);
    const averageDepth = nodes.reduce((sum, node) => sum + node.level, 0) / totalNodes;

    const functionDistribution: Record<string, number> = {};
    const purposeDistribution: Record<string, number> = {};

    for (const node of nodes) {
      if (node.type === 'FUNCTION') {
        const funcType = node.metadata.functionType || 'UNKNOWN';
        functionDistribution[funcType] = (functionDistribution[funcType] || 0) + node.assetCount;
      } else if (node.type === 'PURPOSE') {
        const category = node.metadata.category || 'UNKNOWN';
        purposeDistribution[category] = (purposeDistribution[category] || 0) + node.assetCount;
      }
    }

    return {
      totalNodes,
      totalAssets,
      totalValue,
      averageDepth,
      functionDistribution,
      purposeDistribution,
    };
  }

  /**
   * Updates the configuration of the hierarchy engine.
   */
  public updateConfig(newConfig: Partial<HierarchyConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Purpose-Driven Hierarchy Engine configuration updated.`);
  }

  /**
   * Removes an asset model from the hierarchy.
   */
  public unregisterAssetModel(assetId: string): boolean {
    const removed = this.assetModels.delete(assetId);
    if (removed) {
      this.rebuildHierarchyNodes();
      console.log(`🌳 Unregistered asset model ${assetId} from hierarchy`);
    }
    return removed;
  }

  /**
   * Gets the function hierarchy for organizing functions by type and level.
   */
  public getFunctionHierarchy(): FunctionHierarchy[] {
    return Array.from(this.functionHierarchy.values());
  }

  /**
   * Gets the default hierarchy view.
   */
  public getDefaultView(): HierarchyView | undefined {
    return Array.from(this.hierarchyViews.values()).find(view => 
      view.metadata.isDefault
    );
  }
}
