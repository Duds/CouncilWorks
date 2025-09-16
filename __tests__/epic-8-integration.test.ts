/**
 * Epic 8 Integration Tests - Graph-Based Asset Intelligence
 * 
 * Comprehensive test suite for Epic 8 features including:
 * - Hybrid database architecture
 * - Function-based organization
 * - Multiple hierarchies
 * - Critical asset elevation
 * 
 * @fileoverview Epic 8 integration tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock the Cosmos DB client for testing
jest.mock('@/lib/cosmos-db', () => ({
  getCosmosClient: jest.fn(() => ({
    executeQuery: jest.fn(),
    addVertex: jest.fn(),
    addEdge: jest.fn(),
    getVertex: jest.fn(),
    getVerticesByLabel: jest.fn(),
    getEdges: jest.fn(),
    deleteVertex: jest.fn(),
    deleteEdge: jest.fn(),
    close: jest.fn(),
  })),
  assetGraphOps: {
    createAssetVertex: jest.fn(),
    createServiceFunctionVertex: jest.fn(),
    createLocationVertex: jest.fn(),
    linkAssetToServiceFunction: jest.fn(),
    linkAssetToLocation: jest.fn(),
    linkLocationHierarchy: jest.fn(),
    getAssetsByServiceFunction: jest.fn(),
    getServiceFunctionsByAsset: jest.fn(),
    getAssetsByLocation: jest.fn(),
    getCriticalAssets: jest.fn(),
    getAssetHierarchyPath: jest.fn(),
    client: {
      executeQuery: jest.fn(),
      addVertex: jest.fn(),
      addEdge: jest.fn(),
      getVertex: jest.fn(),
      getVerticesByLabel: jest.fn(),
      getEdges: jest.fn(),
      deleteVertex: jest.fn(),
      deleteEdge: jest.fn(),
      close: jest.fn(),
    },
  },
}));

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    asset: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    organisation: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

describe('Epic 8: Graph-Based Asset Intelligence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('F8.1: Hybrid Database Architecture', () => {
    it('should create asset vertex in graph database', async () => {
      const { assetGraphOps } = require('@/lib/cosmos-db');
      
      const mockAsset = {
        id: 'asset-1',
        assetNumber: 'A001',
        name: 'Main Water Treatment Plant',
        assetType: 'WATER_SUPPLY',
        organisationId: 'org-1',
        servicePurpose: 'Water Infrastructure',
        criticality: 'Critical',
        condition: 'Good',
        location: { lat: -33.8688, lng: 151.2093 },
      };

      assetGraphOps.createAssetVertex.mockResolvedValue('vertex-id-1');

      const result = await assetGraphOps.createAssetVertex(mockAsset);

      expect(assetGraphOps.createAssetVertex).toHaveBeenCalledWith(mockAsset);
      expect(result).toBe('vertex-id-1');
    });

    it('should create service function vertex', async () => {
      const { assetGraphOps } = require('@/lib/cosmos-db');
      
      const mockFunction = {
        id: 'sf-1',
        name: 'Water Infrastructure',
        description: 'Water supply and treatment services',
        category: 'Infrastructure',
        organisationId: 'org-1',
      };

      assetGraphOps.createServiceFunctionVertex.mockResolvedValue('function-vertex-id');

      const result = await assetGraphOps.createServiceFunctionVertex(mockFunction);

      expect(assetGraphOps.createServiceFunctionVertex).toHaveBeenCalledWith(mockFunction);
      expect(result).toBe('function-vertex-id');
    });

    it('should link asset to service function', async () => {
      const { assetGraphOps } = require('@/lib/cosmos-db');
      
      assetGraphOps.linkAssetToServiceFunction.mockResolvedValue('edge-id-1');

      const result = await assetGraphOps.linkAssetToServiceFunction('asset-1', 'sf-1');

      expect(assetGraphOps.linkAssetToServiceFunction).toHaveBeenCalledWith('asset-1', 'sf-1');
      expect(result).toBe('edge-id-1');
    });
  });

  describe('F8.2: Multiple Hierarchy Support', () => {
    it('should get function-based hierarchy', async () => {
      const { multipleHierarchySupport } = require('@/lib/multiple-hierarchies');
      
      const mockHierarchy = {
        id: 'func_hierarchy_org-1',
        name: 'Function-Based Hierarchy',
        type: 'Function',
        description: 'Assets organised by service purpose and function',
        organisationId: 'org-1',
        rootNodes: [
          {
            id: 'cat_Infrastructure',
            name: 'Infrastructure',
            type: 'Category',
            level: 0,
            children: [],
            assetCount: 567,
            totalValue: 28000000,
            criticalAssetCount: 45,
            metadata: { category: 'Infrastructure' },
          },
        ],
        totalAssets: 1247,
        totalValue: 45600000,
        lastUpdated: expect.any(Date),
      };

      multipleHierarchySupport.getFunctionHierarchy.mockResolvedValue(mockHierarchy);

      const result = await multipleHierarchySupport.getFunctionHierarchy('org-1');

      expect(multipleHierarchySupport.getFunctionHierarchy).toHaveBeenCalledWith('org-1');
      expect(result).toEqual(mockHierarchy);
    });

    it('should get geographic hierarchy', async () => {
      const { multipleHierarchySupport } = require('@/lib/multiple-hierarchies');
      
      const mockHierarchy = {
        id: 'geo_hierarchy_org-1',
        name: 'Geographic Hierarchy',
        type: 'Geographic',
        description: 'Assets organised by geographic location and regions',
        organisationId: 'org-1',
        rootNodes: [
          {
            id: 'loc_org-1_North_Region',
            name: 'North Region',
            type: 'Region',
            level: 0,
            children: [],
            assetCount: 312,
            totalValue: 12000000,
            criticalAssetCount: 23,
            metadata: { coordinates: { lat: -33.8, lng: 151.2 } },
          },
        ],
        totalAssets: 1247,
        totalValue: 45600000,
        lastUpdated: expect.any(Date),
      };

      multipleHierarchySupport.getGeographicHierarchy.mockResolvedValue(mockHierarchy);

      const result = await multipleHierarchySupport.getGeographicHierarchy('org-1');

      expect(multipleHierarchySupport.getGeographicHierarchy).toHaveBeenCalledWith('org-1');
      expect(result).toEqual(mockHierarchy);
    });

    it('should get asset hierarchy context', async () => {
      const { multipleHierarchySupport } = require('@/lib/multiple-hierarchies');
      
      const mockContext = {
        assetId: 'asset-1',
        hierarchies: {
          function: [],
          geographic: [],
          organisational: [],
          funding: [],
        },
        primaryHierarchy: 'function',
        crossHierarchyRelationships: [],
      };

      multipleHierarchySupport.getAssetHierarchyContext.mockResolvedValue(mockContext);

      const result = await multipleHierarchySupport.getAssetHierarchyContext('asset-1');

      expect(multipleHierarchySupport.getAssetHierarchyContext).toHaveBeenCalledWith('asset-1');
      expect(result).toEqual(mockContext);
    });
  });

  describe('Function-Based Organization', () => {
    it('should get service functions for organisation', async () => {
      const { functionBasedOrg } = require('@/lib/function-based-org');
      
      const mockServiceFunctions = [
        {
          id: 'sf-1',
          name: 'Water Infrastructure',
          description: 'Water supply and treatment services',
          category: 'Infrastructure',
          organisationId: 'org-1',
          assetCount: 45,
          totalValue: 15000000,
          criticalAssetCount: 8,
          lastUpdated: expect.any(Date),
        },
      ];

      functionBasedOrg.getServiceFunctions.mockResolvedValue(mockServiceFunctions);

      const result = await functionBasedOrg.getServiceFunctions('org-1');

      expect(functionBasedOrg.getServiceFunctions).toHaveBeenCalledWith('org-1');
      expect(result).toEqual(mockServiceFunctions);
    });

    it('should get function hierarchy organised by category', async () => {
      const { functionBasedOrg } = require('@/lib/function-based-org');
      
      const mockHierarchy = [
        {
          category: 'Infrastructure',
          functions: [
            {
              id: 'sf-1',
              name: 'Water Infrastructure',
              description: 'Water supply and treatment services',
              category: 'Infrastructure',
              organisationId: 'org-1',
              assetCount: 45,
              totalValue: 15000000,
              criticalAssetCount: 8,
              lastUpdated: expect.any(Date),
            },
          ],
          totalAssets: 45,
          totalValue: 15000000,
          criticalAssets: 8,
        },
      ];

      functionBasedOrg.getFunctionHierarchy.mockResolvedValue(mockHierarchy);

      const result = await functionBasedOrg.getFunctionHierarchy('org-1');

      expect(functionBasedOrg.getFunctionHierarchy).toHaveBeenCalledWith('org-1');
      expect(result).toEqual(mockHierarchy);
    });

    it('should get assets by service function', async () => {
      const { functionBasedOrg } = require('@/lib/function-based-org');
      
      const mockAssets = [
        {
          id: 'asset-1',
          assetNumber: 'A001',
          name: 'Main Water Treatment Plant',
          assetType: 'WATER_SUPPLY',
          organisationId: 'org-1',
          priority: 'CRITICAL',
          condition: 'Good',
          currentValue: 5000000,
        },
      ];

      functionBasedOrg.getAssetsByServiceFunction.mockResolvedValue(mockAssets);

      const result = await functionBasedOrg.getAssetsByServiceFunction('org-1', 'Water Infrastructure');

      expect(functionBasedOrg.getAssetsByServiceFunction).toHaveBeenCalledWith('org-1', 'Water Infrastructure');
      expect(result).toEqual(mockAssets);
    });
  });

  describe('Critical Asset Elevation', () => {
    it('should get critical asset dashboard', async () => {
      const { criticalAssetElevation } = require('@/lib/critical-asset-elevation');
      
      const mockDashboard = {
        totalCriticalAssets: 89,
        compliantAssets: 67,
        nonCompliantAssets: 15,
        overdueAssets: 7,
        totalValue: 28000000,
        totalRiskExposure: 2340,
        criticalControls: {
          total: 267,
          compliant: 198,
          nonCompliant: 45,
          overdue: 24,
        },
        recentAlerts: [
          {
            id: 'alert-1',
            assetId: 'asset-1',
            assetName: 'Main Water Treatment Plant',
            alertType: 'Assessment Overdue',
            severity: 'High',
            message: 'Critical asset assessment overdue by 5 days',
            createdAt: expect.any(Date),
            acknowledged: false,
          },
        ],
        topRiskAssets: [
          {
            id: 'asset-1',
            name: 'Main Water Treatment Plant',
            riskScore: 95,
            criticalityLevel: 'Critical',
          },
        ],
        upcomingAssessments: [
          {
            assetId: 'asset-1',
            assetName: 'Main Water Treatment Plant',
            assessmentDate: expect.any(Date),
            daysUntilDue: 15,
          },
        ],
      };

      criticalAssetElevation.getCriticalAssetDashboard.mockResolvedValue(mockDashboard);

      const result = await criticalAssetElevation.getCriticalAssetDashboard('org-1');

      expect(criticalAssetElevation.getCriticalAssetDashboard).toHaveBeenCalledWith('org-1');
      expect(result).toEqual(mockDashboard);
    });

    it('should get critical assets with filters', async () => {
      const { criticalAssetElevation } = require('@/lib/critical-asset-elevation');
      
      const mockCriticalAssets = [
        {
          id: 'asset-1',
          assetNumber: 'A001',
          name: 'Main Water Treatment Plant',
          assetType: 'WATER_SUPPLY',
          criticalityLevel: 'Critical',
          criticalityReason: 'High priority designation, High asset value',
          serviceImpact: 'Water service delivery and public health',
          failureConsequences: ['Service disruption', 'Safety risk', 'Public health risk'],
          controls: [
            {
              id: 'control-1',
              name: 'Regular Inspection',
              type: 'Preventive',
              frequency: 'Quarterly',
              lastPerformed: expect.any(Date),
              nextDue: expect.any(Date),
              status: 'Compliant',
              responsible: 'Maintenance Team',
              description: 'Regular inspection to identify potential issues',
            },
          ],
          lastAssessment: expect.any(Date),
          nextAssessment: expect.any(Date),
          status: 'Compliant',
          organisationId: 'org-1',
          currentValue: 5000000,
          replacementCost: 8000000,
          riskScore: 95,
        },
      ];

      const filter = {
        criticalityLevel: ['Critical'],
        status: ['Compliant'],
      };

      criticalAssetElevation.getCriticalAssets.mockResolvedValue(mockCriticalAssets);

      const result = await criticalAssetElevation.getCriticalAssets('org-1', filter);

      expect(criticalAssetElevation.getCriticalAssets).toHaveBeenCalledWith('org-1', filter);
      expect(result).toEqual(mockCriticalAssets);
    });

    it('should get critical asset by ID', async () => {
      const { criticalAssetElevation } = require('@/lib/critical-asset-elevation');
      
      const mockCriticalAsset = {
        id: 'asset-1',
        assetNumber: 'A001',
        name: 'Main Water Treatment Plant',
        assetType: 'WATER_SUPPLY',
        criticalityLevel: 'Critical',
        criticalityReason: 'High priority designation, High asset value',
        serviceImpact: 'Water service delivery and public health',
        failureConsequences: ['Service disruption', 'Safety risk', 'Public health risk'],
        controls: [],
        lastAssessment: expect.any(Date),
        nextAssessment: expect.any(Date),
        status: 'Compliant',
        organisationId: 'org-1',
        currentValue: 5000000,
        replacementCost: 8000000,
        riskScore: 95,
      };

      criticalAssetElevation.getCriticalAssetById.mockResolvedValue(mockCriticalAsset);

      const result = await criticalAssetElevation.getCriticalAssetById('asset-1');

      expect(criticalAssetElevation.getCriticalAssetById).toHaveBeenCalledWith('asset-1');
      expect(result).toEqual(mockCriticalAsset);
    });
  });

  describe('Data Synchronization', () => {
    it('should sync assets to graph database', async () => {
      const { dataSyncService } = require('@/lib/data-sync');
      
      const mockSyncResult = {
        success: true,
        recordsProcessed: 1247,
        errors: [],
        warnings: [],
      };

      dataSyncService.syncAssetsToGraph.mockResolvedValue(mockSyncResult);

      const result = await dataSyncService.syncAssetsToGraph({
        batchSize: 100,
        dryRun: false,
        forceUpdate: false,
      });

      expect(dataSyncService.syncAssetsToGraph).toHaveBeenCalledWith({
        batchSize: 100,
        dryRun: false,
        forceUpdate: false,
      });
      expect(result).toEqual(mockSyncResult);
    });

    it('should get asset intelligence data', async () => {
      const { dataSyncService } = require('@/lib/data-sync');
      
      const mockIntelligence = {
        asset: {
          id: 'asset-1',
          assetNumber: 'A001',
          name: 'Main Water Treatment Plant',
          assetType: 'WATER_SUPPLY',
          organisationId: 'org-1',
          priority: 'CRITICAL',
          condition: 'Good',
          currentValue: 5000000,
        },
        serviceFunctions: [
          {
            id: 'sf-1',
            properties: {
              name: 'Water Infrastructure',
              description: 'Water supply and treatment services',
            },
          },
        ],
        locations: [
          {
            id: 'loc-1',
            properties: {
              name: 'North Region',
              type: 'Region',
            },
          },
        ],
        criticality: 'Critical',
        relatedAssets: [],
      };

      dataSyncService.getAssetIntelligence.mockResolvedValue(mockIntelligence);

      const result = await dataSyncService.getAssetIntelligence('asset-1');

      expect(dataSyncService.getAssetIntelligence).toHaveBeenCalledWith('asset-1');
      expect(result).toEqual(mockIntelligence);
    });
  });

  describe('API Endpoints', () => {
    it('should handle asset intelligence API requests', async () => {
      // Mock fetch for API testing
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            functionAnalytics: {
              totalFunctions: 12,
              totalAssets: 1247,
              totalValue: 45600000,
              criticalAssets: 89,
            },
            hierarchyViews: [],
            criticalDashboard: {
              totalCriticalAssets: 89,
              compliantAssets: 67,
              nonCompliantAssets: 15,
              overdueAssets: 7,
            },
          }),
        })
      ) as jest.Mock;

      const response = await fetch('/api/assets/intelligence?organisationId=org-1');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.functionAnalytics.totalAssets).toBe(1247);
      expect(data.criticalDashboard.totalCriticalAssets).toBe(89);
    });

    it('should handle service functions API requests', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 'sf-1',
              name: 'Water Infrastructure',
              description: 'Water supply and treatment services',
              category: 'Infrastructure',
              organisationId: 'org-1',
              assetCount: 45,
              totalValue: 15000000,
              criticalAssetCount: 8,
            },
          ]),
        })
      ) as jest.Mock;

      const response = await fetch('/api/assets/service-functions?organisationId=org-1');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Water Infrastructure');
    });

    it('should handle critical assets API requests', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            totalCriticalAssets: 89,
            compliantAssets: 67,
            nonCompliantAssets: 15,
            overdueAssets: 7,
            totalValue: 28000000,
            totalRiskExposure: 2340,
            criticalControls: {
              total: 267,
              compliant: 198,
              nonCompliant: 45,
              overdue: 24,
            },
            topRiskAssets: [
              {
                id: 'asset-1',
                name: 'Main Water Treatment Plant',
                riskScore: 95,
                criticalityLevel: 'Critical',
              },
            ],
          }),
        })
      ) as jest.Mock;

      const response = await fetch('/api/assets/critical?organisationId=org-1&dashboard=true');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.totalCriticalAssets).toBe(89);
      expect(data.topRiskAssets).toHaveLength(1);
    });
  });

  describe('Aegrid Rules Compliance', () => {
    it('should implement Rule 1: Every Asset Has a Purpose', async () => {
      const { functionBasedOrg } = require('@/lib/function-based-org');
      
      const mockAssetPurpose = {
        assetId: 'asset-1',
        serviceFunction: 'Water Infrastructure',
        primaryPurpose: 'Water supply and treatment services',
        secondaryPurposes: [],
        valueContribution: 5000000,
        criticalityLevel: 'Critical',
      };

      functionBasedOrg.getAssetPurpose.mockResolvedValue(mockAssetPurpose);

      const result = await functionBasedOrg.getAssetPurpose('asset-1');

      expect(result.serviceFunction).toBe('Water Infrastructure');
      expect(result.primaryPurpose).toBe('Water supply and treatment services');
      expect(result.criticalityLevel).toBe('Critical');
    });

    it('should implement Rule 2: Match Maintenance to Risk', async () => {
      const { criticalAssetElevation } = require('@/lib/critical-asset-elevation');
      
      const mockCriticalAsset = {
        id: 'asset-1',
        criticalityLevel: 'Critical',
        riskScore: 95,
        controls: [
          {
            id: 'control-1',
            name: 'Regular Inspection',
            type: 'Preventive',
            frequency: 'Quarterly',
            status: 'Compliant',
          },
        ],
      };

      criticalAssetElevation.getCriticalAssetById.mockResolvedValue(mockCriticalAsset);

      const result = await criticalAssetElevation.getCriticalAssetById('asset-1');

      expect(result.criticalityLevel).toBe('Critical');
      expect(result.riskScore).toBeGreaterThan(80);
      expect(result.controls[0].type).toBe('Preventive');
    });

    it('should implement Rule 3: Protect the Critical Few', async () => {
      const { criticalAssetElevation } = require('@/lib/critical-asset-elevation');
      
      const mockDashboard = {
        totalCriticalAssets: 89,
        topRiskAssets: [
          {
            id: 'asset-1',
            name: 'Main Water Treatment Plant',
            riskScore: 95,
            criticalityLevel: 'Critical',
          },
        ],
      };

      criticalAssetElevation.getCriticalAssetDashboard.mockResolvedValue(mockDashboard);

      const result = await criticalAssetElevation.getCriticalAssetDashboard('org-1');

      expect(result.totalCriticalAssets).toBeGreaterThan(0);
      expect(result.topRiskAssets[0].criticalityLevel).toBe('Critical');
      expect(result.topRiskAssets[0].riskScore).toBeGreaterThan(90);
    });

    it('should implement Rule 4: Plan for Tomorrow, Today', async () => {
      const { multipleHierarchySupport } = require('@/lib/multiple-hierarchies');
      
      const mockHierarchyViews = [
        {
          id: 'func_hierarchy_org-1',
          name: 'Function-Based Hierarchy',
          type: 'Function',
          totalAssets: 1247,
          totalValue: 45600000,
        },
        {
          id: 'geo_hierarchy_org-1',
          name: 'Geographic Hierarchy',
          type: 'Geographic',
          totalAssets: 1247,
          totalValue: 45600000,
        },
        {
          id: 'org_hierarchy_org-1',
          name: 'Organisational Hierarchy',
          type: 'Organisational',
          totalAssets: 1247,
          totalValue: 45600000,
        },
        {
          id: 'funding_hierarchy_org-1',
          name: 'Funding Hierarchy',
          type: 'Funding',
          totalAssets: 1247,
          totalValue: 45600000,
        },
      ];

      multipleHierarchySupport.getAllHierarchyViews.mockResolvedValue(mockHierarchyViews);

      const result = await multipleHierarchySupport.getAllHierarchyViews('org-1');

      expect(result).toHaveLength(4);
      expect(result.map(h => h.type)).toEqual(['Function', 'Geographic', 'Organisational', 'Funding']);
    });
  });
});
