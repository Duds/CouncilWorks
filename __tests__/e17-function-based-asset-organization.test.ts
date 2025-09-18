/**
 * E17: Function-Based Asset Organization Tests
 *
 * Comprehensive test suite for E17 features implementing The Aegrid Rules
 * Rule 1: "Every Asset Has a Purpose" through function-based anchoring.
 *
 * @file __tests__/e17-function-based-asset-organization.test.ts
 * @version 1.0.0
 * @since PI3 - E17: Create Function-Based Asset Organization
 */

import {
  AssetFunctionType,
  AssetPurposeCategory,
  OrganizationViewType,
} from '@/types/resilience';
import { FunctionBasedAssetModeling } from '@/lib/function-based-asset-modeling';
import { PurposeDrivenHierarchyEngine } from '@/lib/purpose-driven-hierarchy-engine';
import { AssetPurposeClassificationSystem } from '@/lib/asset-purpose-classification-system';
import { MultiViewAssetOrganization } from '@/lib/multi-view-asset-organization';
import { FunctionBasedAssetDiscovery } from '@/lib/function-based-asset-discovery';
import { PurposeAlignmentAnalytics } from '@/lib/purpose-alignment-analytics';

describe('E17: Function-Based Asset Organization', () => {
  describe('F17.1: Function-Based Asset Modeling', () => {
    let modelingSystem: FunctionBasedAssetModeling;

    beforeEach(() => {
      modelingSystem = new FunctionBasedAssetModeling({
        enabled: true,
        requirePrimaryFunction: true,
        allowMultiplePurposes: true,
        maxPurposesPerAsset: 5,
        defaultFunctionType: AssetFunctionType.OTHER,
        validationRules: [],
        metadata: {},
      });
    });

    test('should initialize with default configuration', () => {
      expect(modelingSystem).toBeDefined();
      const functionLibrary = modelingSystem.getFunctionLibrary();
      expect(functionLibrary.length).toBeGreaterThan(0);
      expect(functionLibrary.some(f => f.functionType === AssetFunctionType.TRANSPORTATION)).toBe(true);
    });

    test('should create asset model with function assignment', async () => {
      const assetModel = await modelingSystem.createAssetModel(
        'asset-1',
        'Main Street Bridge',
        'Primary bridge connecting downtown areas',
        'bridge',
        'Downtown'
      );

      expect(assetModel.id).toBe('asset-1');
      expect(assetModel.name).toBe('Main Street Bridge');
      expect(assetModel.functions).toHaveLength(0);
      expect(assetModel.purposes).toHaveLength(0);

      const result = await modelingSystem.assignFunctionToAsset(
        'asset-1',
        'func-transport-road',
        true,
        'Primary Transportation Route'
      );

      expect(result.success).toBe(true);
      expect(result.assignedFunctions).toHaveLength(1);
      expect(result.assignedPurposes).toHaveLength(1);
      expect(result.assignedFunctions[0].functionType).toBe(AssetFunctionType.TRANSPORTATION);
    });

    test('should validate function assignment rules', async () => {
      await modelingSystem.createAssetModel('asset-2', 'Test Asset', 'Test Description', 'road', 'Test Location');
      
      const result = await modelingSystem.assignFunctionToAsset(
        'asset-2',
        'invalid-function-id',
        true
      );

      expect(result.success).toBe(false);
      expect(result.validationResults.some(r => r.severity === 'ERROR')).toBe(true);
    });

    test('should get assets by function type', async () => {
      await modelingSystem.createAssetModel('asset-3', 'Highway 101', 'Main highway', 'highway', 'Regional');
      await modelingSystem.assignFunctionToAsset('asset-3', 'func-transport-road', true);

      const transportationAssets = modelingSystem.getAssetsByFunctionType(AssetFunctionType.TRANSPORTATION);
      expect(transportationAssets.length).toBeGreaterThan(0);
      expect(transportationAssets.some(a => a.id === 'asset-3')).toBe(true);
    });

    test('should get orphaned assets', async () => {
      await modelingSystem.createAssetModel('asset-4', 'Orphaned Asset', 'No functions assigned', 'unknown', 'Unknown');

      const orphanedAssets = modelingSystem.getOrphanedAssets();
      expect(orphanedAssets.length).toBeGreaterThan(0);
      expect(orphanedAssets.some(a => a.id === 'asset-4')).toBe(true);
    });
  });

  describe('F17.2: Purpose-Driven Hierarchy Engine', () => {
    let hierarchyEngine: PurposeDrivenHierarchyEngine;

    beforeEach(() => {
      hierarchyEngine = new PurposeDrivenHierarchyEngine({
        enabled: true,
        maxDepth: 4,
        allowCircularReferences: false,
        autoRebuildOnChange: true,
        defaultViewType: OrganizationViewType.FUNCTIONAL,
        groupingStrategies: ['FUNCTION_FIRST', 'PURPOSE_FIRST'],
        sortingStrategies: ['ALPHABETICAL', 'VALUE', 'PRIORITY'],
        metadata: {},
      });
    });

    test('should initialize with default hierarchy', () => {
      expect(hierarchyEngine).toBeDefined();
      const hierarchy = hierarchyEngine.getFunctionHierarchy();
      expect(hierarchy.length).toBeGreaterThan(0);
      expect(hierarchy.some(h => h.id === 'hier-root')).toBe(true);
    });

    test('should register asset model and rebuild hierarchy', () => {
      const assetModel = {
        id: 'asset-1',
        name: 'Test Asset',
        description: 'Test Description',
        assetType: 'road',
        functions: [{
          id: 'func-1',
          name: 'Transportation',
          description: 'Transportation function',
          functionType: AssetFunctionType.TRANSPORTATION,
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isActive: true,
          metadata: {},
        }],
        purposes: [],
        valueContribution: 0.8,
        isActive: true,
        metadata: {},
      };

      hierarchyEngine.registerAssetModel(assetModel);
      
      const functionalView = hierarchyEngine.getHierarchyForView('view-functional');
      expect(functionalView.length).toBeGreaterThan(0);
    });

    test('should get hierarchy statistics', () => {
      const stats = hierarchyEngine.getHierarchyStatistics('view-functional');
      expect(stats).toHaveProperty('totalNodes');
      expect(stats).toHaveProperty('totalAssets');
      expect(stats).toHaveProperty('totalValue');
      expect(stats).toHaveProperty('functionDistribution');
    });

    test('should get assets by function type', () => {
      const transportationAssets = hierarchyEngine.getAssetsByFunctionType(AssetFunctionType.TRANSPORTATION);
      expect(Array.isArray(transportationAssets)).toBe(true);
    });

    test('should create and update hierarchy views', () => {
      const newView = {
        id: 'view-custom',
        name: 'Custom View',
        description: 'Custom hierarchy view',
        viewType: OrganizationViewType.OPERATIONAL,
        rootNodes: ['hier-root'],
        maxDepth: 3,
        groupingStrategy: 'MIXED',
        sortingStrategy: 'VALUE',
        filters: {},
        isActive: true,
        metadata: {},
      };

      hierarchyEngine.createHierarchyView(newView);
      const view = hierarchyEngine.getHierarchyView('view-custom');
      expect(view).toBeDefined();
      expect(view?.name).toBe('Custom View');
    });
  });

  describe('F17.3: Asset Purpose Classification System', () => {
    let classificationSystem: AssetPurposeClassificationSystem;

    beforeEach(() => {
      classificationSystem = new AssetPurposeClassificationSystem({
        enabled: true,
        autoClassifyOnCreate: true,
        autoClassifyOnUpdate: true,
        minConfidenceThreshold: 0.7,
        maxRulesPerAsset: 3,
        enableMachineLearning: false,
        learningDataRetentionDays: 30,
        metadata: {},
      });
    });

    test('should initialize with default classification rules', () => {
      expect(classificationSystem).toBeDefined();
      const rules = classificationSystem.getClassificationRules();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.some(r => r.id === 'rule-road-transportation')).toBe(true);
    });

    test('should classify asset based on characteristics', async () => {
      const assetModel = {
        id: 'asset-1',
        name: 'Main Street',
        description: 'Primary road through downtown',
        assetType: 'road',
        functions: [],
        purposes: [],
        valueContribution: 0,
        isActive: true,
        metadata: {},
      };

      const characteristics = {
        assetType: 'road',
        location: 'Downtown',
        age: 15,
        condition: 'good',
        usage: 'transport',
        capacity: 1000,
        value: 500000,
        metadata: {},
      };

      const result = await classificationSystem.classifyAsset(assetModel, characteristics);

      expect(result.success).toBe(true);
      expect(result.assignedFunctions.length).toBeGreaterThan(0);
      expect(result.assignedPurposes.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should get classification history', async () => {
      const assetModel = {
        id: 'asset-2',
        name: 'Water Treatment Plant',
        description: 'Municipal water treatment facility',
        assetType: 'treatment_plant',
        functions: [],
        purposes: [],
        valueContribution: 0,
        isActive: true,
        metadata: {},
      };

      const characteristics = {
        assetType: 'treatment_plant',
        usage: 'water',
        metadata: {},
      };

      await classificationSystem.classifyAsset(assetModel, characteristics);
      const history = classificationSystem.getClassificationHistory('asset-2');
      expect(history.length).toBeGreaterThan(0);
    });

    test('should get classification statistics', () => {
      const stats = classificationSystem.getClassificationStatistics();
      expect(stats).toHaveProperty('totalRules');
      expect(stats).toHaveProperty('activeRules');
      expect(stats).toHaveProperty('totalClassifications');
      expect(stats).toHaveProperty('averageConfidence');
    });

    test('should add custom classification rule', () => {
      const customRule = {
        id: 'rule-custom',
        name: 'Custom Classification Rule',
        description: 'Custom rule for testing',
        priority: 80,
        conditions: [
          { field: 'assetType', operator: 'EQUALS', value: 'custom', weight: 1.0, metadata: {} },
        ],
        actions: [
          {
            type: 'ASSIGN_FUNCTION',
            parameters: { functionType: AssetFunctionType.OTHER, category: AssetPurposeCategory.SUPPORT },
            confidence: 0.8,
            metadata: {},
          },
        ],
        isActive: true,
        metadata: {},
      };

      classificationSystem.addClassificationRule(customRule);
      const rules = classificationSystem.getClassificationRules();
      expect(rules.some(r => r.id === 'rule-custom')).toBe(true);
    });
  });

  describe('F17.4: Multi-View Asset Organization', () => {
    let multiViewOrg: MultiViewAssetOrganization;

    beforeEach(() => {
      multiViewOrg = new MultiViewAssetOrganization({
        enabled: true,
        defaultViewType: OrganizationViewType.FUNCTIONAL,
        maxGroupingLevels: 3,
        enableDynamicViews: true,
        enableCustomViews: true,
        viewCacheTimeout: 300000,
        metadata: {},
      });
    });

    test('should initialize with default view configurations', () => {
      expect(multiViewOrg).toBeDefined();
      const views = multiViewOrg.getViewConfigurations();
      expect(views.length).toBeGreaterThan(0);
      expect(views.some(v => v.id === 'view-functional')).toBe(true);
    });

    test('should register asset model and generate view', () => {
      const assetModel = {
        id: 'asset-1',
        name: 'Test Asset',
        description: 'Test Description',
        assetType: 'road',
        functions: [{
          id: 'func-1',
          name: 'Transportation',
          description: 'Transportation function',
          functionType: AssetFunctionType.TRANSPORTATION,
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isActive: true,
          metadata: {},
        }],
        purposes: [],
        valueContribution: 0.8,
        isActive: true,
        metadata: {},
      };

      multiViewOrg.registerAssetModel(assetModel);
      
      const functionalView = multiViewOrg.getView('view-functional');
      expect(functionalView).toBeDefined();
      expect(functionalView.viewType).toBe(OrganizationViewType.FUNCTIONAL);
      expect(functionalView.groups.length).toBeGreaterThan(0);
    });

    test('should create custom view configuration', () => {
      const customView = {
        id: 'view-custom',
        name: 'Custom View',
        description: 'Custom organizational view',
        viewType: OrganizationViewType.OPERATIONAL,
        groupingFields: ['assetType', 'location'],
        sortingFields: ['name'],
        filters: [
          { field: 'isActive', operator: 'EQUALS', value: true, isActive: true, metadata: {} },
        ],
        displayFields: ['name', 'assetType', 'location'],
        isDefault: false,
        metadata: {},
      };

      multiViewOrg.createViewConfiguration(customView);
      const view = multiViewOrg.getViewConfiguration('view-custom');
      expect(view).toBeDefined();
      expect(view?.name).toBe('Custom View');
    });

    test('should get view statistics', () => {
      const stats = multiViewOrg.getViewStatistics();
      expect(stats).toHaveProperty('totalViews');
      expect(stats).toHaveProperty('totalAssets');
      expect(stats).toHaveProperty('cacheHitRate');
      expect(stats).toHaveProperty('viewDistribution');
    });

    test('should get assets by function type and purpose category', () => {
      const transportationAssets = multiViewOrg.getAssetsByFunctionType(AssetFunctionType.TRANSPORTATION);
      const primaryAssets = multiViewOrg.getAssetsByPurposeCategory(AssetPurposeCategory.PRIMARY);
      
      expect(Array.isArray(transportationAssets)).toBe(true);
      expect(Array.isArray(primaryAssets)).toBe(true);
    });
  });

  describe('F17.5: Function-Based Asset Discovery', () => {
    let discoverySystem: FunctionBasedAssetDiscovery;

    beforeEach(() => {
      discoverySystem = new FunctionBasedAssetDiscovery({
        enabled: true,
        enableFuzzySearch: true,
        enableSemanticSearch: false,
        maxResults: 100,
        defaultSearchFields: ['name', 'description', 'assetType'],
        indexRefreshInterval: 3600000,
        enableSuggestions: true,
        metadata: {},
      });
    });

    test('should initialize with default indexes and queries', () => {
      expect(discoverySystem).toBeDefined();
      const queries = discoverySystem.getDiscoveryQueries();
      expect(queries.length).toBeGreaterThan(0);
      expect(queries.some(q => q.id === 'query-transportation')).toBe(true);
    });

    test('should search assets by criteria', async () => {
      const assetModel = {
        id: 'asset-1',
        name: 'Main Street Bridge',
        description: 'Primary bridge for transportation',
        assetType: 'bridge',
        functions: [{
          id: 'func-1',
          name: 'Transportation',
          description: 'Transportation function',
          functionType: AssetFunctionType.TRANSPORTATION,
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isActive: true,
          metadata: {},
        }],
        purposes: [],
        valueContribution: 0.9,
        isActive: true,
        metadata: {},
      };

      discoverySystem.registerAssetModel(assetModel);

      const criteria = {
        functionTypes: [AssetFunctionType.TRANSPORTATION],
        keywords: ['bridge', 'transportation'],
        metadata: {},
      };

      const result = await discoverySystem.searchAssets(criteria);
      
      expect(result.success).toBe(true);
      expect(result.assets.length).toBeGreaterThan(0);
      expect(result.totalFound).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should execute predefined discovery query', async () => {
      const assetModel = {
        id: 'asset-2',
        name: 'Highway 101',
        description: 'Main highway for regional transportation',
        assetType: 'highway',
        functions: [{
          id: 'func-1',
          name: 'Transportation',
          description: 'Transportation function',
          functionType: AssetFunctionType.TRANSPORTATION,
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isActive: true,
          metadata: {},
        }],
        purposes: [{
          id: 'purpose-1',
          assetId: 'asset-2',
          functionId: 'func-1',
          purpose: 'Primary Transportation Route',
          description: 'Primary transportation purpose',
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isPrimary: true,
          valueContribution: 1.0,
          metadata: {},
        }],
        valueContribution: 0.8,
        isActive: true,
        metadata: {},
      };

      discoverySystem.registerAssetModel(assetModel);

      const result = await discoverySystem.executeQuery('query-transportation');
      
      expect(result.assets.length).toBeGreaterThan(0);
      expect(result.totalFound).toBeGreaterThan(0);
    });

    test('should get search suggestions', () => {
      const suggestions = discoverySystem.getSearchSuggestions('trans');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.type === 'FUNCTION')).toBe(true);
    });

    test('should get discovery statistics', () => {
      const stats = discoverySystem.getDiscoveryStatistics();
      expect(stats).toHaveProperty('totalAssets');
      expect(stats).toHaveProperty('totalQueries');
      expect(stats).toHaveProperty('totalSearches');
      expect(stats).toHaveProperty('averageSearchTime');
    });

    test('should create custom discovery query', () => {
      const customQuery = {
        id: 'query-custom',
        name: 'Custom Search Query',
        description: 'Custom query for testing',
        functionTypes: [AssetFunctionType.INFRASTRUCTURE],
        purposeCategories: [AssetPurposeCategory.PRIMARY],
        filters: {},
        searchTerms: ['infrastructure', 'water'],
        metadata: {},
      };

      discoverySystem.createDiscoveryQuery(customQuery);
      const queries = discoverySystem.getDiscoveryQueries();
      expect(queries.some(q => q.id === 'query-custom')).toBe(true);
    });
  });

  describe('F17.6: Purpose Alignment Analytics', () => {
    let analyticsSystem: PurposeAlignmentAnalytics;

    beforeEach(() => {
      analyticsSystem = new PurposeAlignmentAnalytics({
        enabled: true,
        enableRealTimeAnalytics: true,
        enableHistoricalTracking: true,
        enablePredictiveAnalytics: false,
        metricsRetentionDays: 90,
        alertThresholds: [
          {
            metric: 'purposeAlignmentRate',
            operator: 'LT',
            value: 80,
            severity: 'HIGH',
            message: 'Purpose alignment rate is below threshold',
            metadata: {},
          },
        ],
        metadata: {},
      });
    });

    test('should initialize with default configuration', () => {
      expect(analyticsSystem).toBeDefined();
    });

    test('should generate purpose alignment metrics', () => {
      const assetModel = {
        id: 'asset-1',
        name: 'Test Asset',
        description: 'Test Description',
        assetType: 'road',
        functions: [{
          id: 'func-1',
          name: 'Transportation',
          description: 'Transportation function',
          functionType: AssetFunctionType.TRANSPORTATION,
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isActive: true,
          metadata: {},
        }],
        purposes: [{
          id: 'purpose-1',
          assetId: 'asset-1',
          functionId: 'func-1',
          purpose: 'Primary Transportation',
          description: 'Primary transportation purpose',
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isPrimary: true,
          valueContribution: 1.0,
          metadata: {},
        }],
        valueContribution: 0.8,
        isActive: true,
        metadata: {},
      };

      analyticsSystem.registerAssetModel(assetModel);
      const metrics = analyticsSystem.generatePurposeAlignmentMetrics();

      expect(metrics.totalAssets).toBe(1);
      expect(metrics.assetsWithPurpose).toBe(1);
      expect(metrics.purposeAlignmentRate).toBe(100);
      expect(metrics.functionCoverage).toHaveProperty(AssetFunctionType.TRANSPORTATION);
    });

    test('should generate analytics insights', () => {
      const assetModel = {
        id: 'asset-2',
        name: 'Orphaned Asset',
        description: 'Asset without functions or purposes',
        assetType: 'unknown',
        functions: [],
        purposes: [],
        valueContribution: 0,
        isActive: true,
        metadata: {},
      };

      analyticsSystem.registerAssetModel(assetModel);
      const metrics = analyticsSystem.generatePurposeAlignmentMetrics();
      const insights = analyticsSystem.generateAnalyticsInsights(metrics);

      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(i => i.type === 'ANOMALY')).toBe(true);
    });

    test('should generate analytics report', () => {
      const assetModel = {
        id: 'asset-3',
        name: 'High Value Asset',
        description: 'High value asset with full purpose alignment',
        assetType: 'critical_infrastructure',
        functions: [{
          id: 'func-1',
          name: 'Infrastructure',
          description: 'Infrastructure function',
          functionType: AssetFunctionType.INFRASTRUCTURE,
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isActive: true,
          metadata: {},
        }],
        purposes: [{
          id: 'purpose-1',
          assetId: 'asset-3',
          functionId: 'func-1',
          purpose: 'Critical Infrastructure',
          description: 'Critical infrastructure purpose',
          category: AssetPurposeCategory.PRIMARY,
          priority: 100,
          isPrimary: true,
          valueContribution: 1.0,
          metadata: {},
        }],
        valueContribution: 0.95,
        isActive: true,
        metadata: {},
      };

      analyticsSystem.registerAssetModel(assetModel);
      const report = analyticsSystem.generateAnalyticsReport('SUMMARY');

      expect(report).toBeDefined();
      expect(report.reportType).toBe('SUMMARY');
      expect(report.metrics).toBeDefined();
      expect(report.insights).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });

    test('should perform trend analysis', () => {
      const trendAnalysis = analyticsSystem.performTrendAnalysis('purposeAlignmentRate', 30);
      
      expect(trendAnalysis).toBeDefined();
      expect(trendAnalysis.metric).toBe('purposeAlignmentRate');
      expect(trendAnalysis.timeSeries).toBeDefined();
      expect(trendAnalysis.trend).toBeDefined();
    });

    test('should perform comparative analysis', () => {
      const comparativeAnalysis = analyticsSystem.performComparativeAnalysis('functionType');
      
      expect(comparativeAnalysis).toBeDefined();
      expect(comparativeAnalysis.dimension).toBe('functionType');
      expect(comparativeAnalysis.groups).toBeDefined();
      expect(comparativeAnalysis.bestPerformer).toBeDefined();
    });

    test('should get analytics reports and alerts', () => {
      const reports = analyticsSystem.getAnalyticsReports();
      const alerts = analyticsSystem.getActiveAlerts();
      
      expect(Array.isArray(reports)).toBe(true);
      expect(Array.isArray(alerts)).toBe(true);
    });
  });

  describe('E17 Integration Tests', () => {
    test('should integrate all E17 systems together', async () => {
      // Initialize all systems
      const modelingSystem = new FunctionBasedAssetModeling({
        enabled: true,
        requirePrimaryFunction: true,
        allowMultiplePurposes: true,
        maxPurposesPerAsset: 5,
        defaultFunctionType: AssetFunctionType.OTHER,
        validationRules: [],
        metadata: {},
      });

      const hierarchyEngine = new PurposeDrivenHierarchyEngine({
        enabled: true,
        maxDepth: 4,
        allowCircularReferences: false,
        autoRebuildOnChange: true,
        defaultViewType: OrganizationViewType.FUNCTIONAL,
        groupingStrategies: ['FUNCTION_FIRST'],
        sortingStrategies: ['VALUE'],
        metadata: {},
      });

      const classificationSystem = new AssetPurposeClassificationSystem({
        enabled: true,
        autoClassifyOnCreate: true,
        autoClassifyOnUpdate: true,
        minConfidenceThreshold: 0.7,
        maxRulesPerAsset: 3,
        enableMachineLearning: false,
        learningDataRetentionDays: 30,
        metadata: {},
      });

      const multiViewOrg = new MultiViewAssetOrganization({
        enabled: true,
        defaultViewType: OrganizationViewType.FUNCTIONAL,
        maxGroupingLevels: 3,
        enableDynamicViews: true,
        enableCustomViews: true,
        viewCacheTimeout: 300000,
        metadata: {},
      });

      const discoverySystem = new FunctionBasedAssetDiscovery({
        enabled: true,
        enableFuzzySearch: true,
        enableSemanticSearch: false,
        maxResults: 100,
        defaultSearchFields: ['name', 'description'],
        indexRefreshInterval: 3600000,
        enableSuggestions: true,
        metadata: {},
      });

      const analyticsSystem = new PurposeAlignmentAnalytics({
        enabled: true,
        enableRealTimeAnalytics: true,
        enableHistoricalTracking: true,
        enablePredictiveAnalytics: false,
        metricsRetentionDays: 90,
        alertThresholds: [],
        metadata: {},
      });

      // Create and classify an asset
      const assetModel = await modelingSystem.createAssetModel(
        'integration-asset-1',
        'Integration Test Bridge',
        'Bridge for integration testing',
        'bridge',
        'Test Location'
      );

      const characteristics = {
        assetType: 'bridge',
        location: 'Test Location',
        usage: 'transport',
        metadata: {},
      };

      const classificationResult = await classificationSystem.classifyAsset(assetModel, characteristics);
      expect(classificationResult.success).toBe(true);

      // Register with all systems
      hierarchyEngine.registerAssetModel(assetModel);
      multiViewOrg.registerAssetModel(assetModel);
      discoverySystem.registerAssetModel(assetModel);
      analyticsSystem.registerAssetModel(assetModel);

      // Test hierarchy view
      const hierarchyView = hierarchyEngine.getHierarchyForView('view-functional');
      expect(hierarchyView.length).toBeGreaterThan(0);

      // Test multi-view organization
      const functionalView = multiViewOrg.getView('view-functional');
      expect(functionalView).toBeDefined();

      // Test discovery
      const searchResult = await discoverySystem.searchAssets({
        keywords: ['bridge', 'transportation'],
        metadata: {},
      });
      expect(searchResult.assets.length).toBeGreaterThan(0);

      // Test analytics
      const metrics = analyticsSystem.generatePurposeAlignmentMetrics();
      expect(metrics.totalAssets).toBeGreaterThan(0);

      console.log('✅ E17 Integration test completed successfully');
    });
  });
});
