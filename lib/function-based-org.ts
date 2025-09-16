/**
 * Function-Based Asset Organization System
 * 
 * Implements Aegrid Rule 1: Every Asset Has a Purpose
 * This system organizes assets by their service function rather than just location,
 * enabling value-driven asset management and purpose-based workflows.
 * 
 * @fileoverview Function-based asset organization and management
 */

import { PrismaClient } from '@prisma/client';
import { AssetGraphOperations, GraphVertex } from './cosmos-db';

export interface ServiceFunction {
  id: string;
  name: string;
  description: string;
  category: string;
  organisationId: string;
  assetCount: number;
  totalValue: number;
  criticalAssetCount: number;
  lastUpdated: Date;
}

export interface AssetPurpose {
  assetId: string;
  serviceFunction: string;
  primaryPurpose: string;
  secondaryPurposes: string[];
  valueContribution: number;
  criticalityLevel: string;
}

export interface FunctionHierarchy {
  category: string;
  functions: ServiceFunction[];
  totalAssets: number;
  totalValue: number;
  criticalAssets: number;
}

export class FunctionBasedOrganization {
  private prisma: PrismaClient;
  private graphOps: AssetGraphOperations;

  constructor() {
    this.prisma = new PrismaClient();
    this.graphOps = new AssetGraphOperations();
  }

  /**
   * Get all service functions for an organisation
   */
  async getServiceFunctions(organisationId: string): Promise<ServiceFunction[]> {
    const functions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
      organisationId,
    });

    const serviceFunctions: ServiceFunction[] = [];

    for (const func of functions) {
      const assets = await this.graphOps.getAssetsByServiceFunction(func.id);
      
      const assetData = await Promise.all(
        assets.map(async (asset) => {
          const assetRecord = await this.prisma.asset.findUnique({
            where: { id: asset.id },
            select: {
              currentValue: true,
              priority: true,
            },
          });
          return assetRecord;
        })
      );

      const totalValue = assetData.reduce((sum, asset) => 
        sum + (asset?.currentValue ? Number(asset.currentValue) : 0), 0
      );

      const criticalAssetCount = assetData.filter(asset => 
        asset?.priority === 'CRITICAL'
      ).length;

      serviceFunctions.push({
        id: func.id,
        name: func.properties.name,
        description: func.properties.description || '',
        category: func.properties.category || 'General',
        organisationId: func.properties.organisationId,
        assetCount: assets.length,
        totalValue,
        criticalAssetCount,
        lastUpdated: new Date(),
      });
    }

    return serviceFunctions.sort((a, b) => b.totalValue - a.totalValue);
  }

  /**
   * Get function hierarchy organized by category
   */
  async getFunctionHierarchy(organisationId: string): Promise<FunctionHierarchy[]> {
    const serviceFunctions = await this.getServiceFunctions(organisationId);
    
    const hierarchyMap = new Map<string, ServiceFunction[]>();
    
    serviceFunctions.forEach(func => {
      if (!hierarchyMap.has(func.category)) {
        hierarchyMap.set(func.category, []);
      }
      hierarchyMap.get(func.category)!.push(func);
    });

    const hierarchy: FunctionHierarchy[] = [];

    for (const [category, functions] of hierarchyMap) {
      const totalAssets = functions.reduce((sum, func) => sum + func.assetCount, 0);
      const totalValue = functions.reduce((sum, func) => sum + func.totalValue, 0);
      const criticalAssets = functions.reduce((sum, func) => sum + func.criticalAssetCount, 0);

      hierarchy.push({
        category,
        functions: functions.sort((a, b) => b.totalValue - a.totalValue),
        totalAssets,
        totalValue,
        criticalAssets,
      });
    }

    return hierarchy.sort((a, b) => b.totalValue - a.totalValue);
  }

  /**
   * Get assets by service function
   */
  async getAssetsByServiceFunction(
    organisationId: string,
    serviceFunction: string
  ): Promise<any[]> {
    const functions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
      name: serviceFunction,
      organisationId,
    });

    if (functions.length === 0) {
      return [];
    }

    const assetVertices = await this.graphOps.getAssetsByServiceFunction(functions[0].id);
    
    const assets = await Promise.all(
      assetVertices.map(async (vertex) => {
        const asset = await this.prisma.asset.findUnique({
          where: { id: vertex.id },
          include: {
            organisation: true,
            documents: true,
            inspections: {
              orderBy: { inspectionDate: 'desc' },
              take: 1,
            },
            maintenance: {
              orderBy: { maintenanceDate: 'desc' },
              take: 1,
            },
            workOrders: {
              where: { status: 'OPEN' },
              orderBy: { priority: 'desc' },
            },
          },
        });
        return asset;
      })
    );

    return assets.filter(asset => asset !== null);
  }

  /**
   * Get asset purpose analysis
   */
  async getAssetPurpose(assetId: string): Promise<AssetPurpose | null> {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
      select: {
        id: true,
        currentValue: true,
        priority: true,
        assetType: true,
        tags: true,
      },
    });

    if (!asset) {
      return null;
    }

    const serviceFunctions = await this.graphOps.getServiceFunctionsByAsset(assetId);
    
    if (serviceFunctions.length === 0) {
      return {
        assetId: asset.id,
        serviceFunction: 'Unknown',
        primaryPurpose: this.mapAssetTypeToPurpose(asset.assetType),
        secondaryPurposes: [],
        valueContribution: asset.currentValue ? Number(asset.currentValue) : 0,
        criticalityLevel: asset.priority,
      };
    }

    const primaryFunction = serviceFunctions[0];
    const secondaryPurposes = serviceFunctions.slice(1).map(sf => sf.properties.name);

    return {
      assetId: asset.id,
      serviceFunction: primaryFunction.properties.name,
      primaryPurpose: primaryFunction.properties.description || primaryFunction.properties.name,
      secondaryPurposes,
      valueContribution: asset.currentValue ? Number(asset.currentValue) : 0,
      criticalityLevel: asset.priority,
    };
  }

  /**
   * Create or update service function
   */
  async createServiceFunction(data: {
    name: string;
    description: string;
    category: string;
    organisationId: string;
  }): Promise<string> {
    const functionId = `sf_${data.organisationId}_${data.name.replace(/\s+/g, '_')}`;
    
    const existingFunctions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
      name: data.name,
      organisationId: data.organisationId,
    });

    if (existingFunctions.length > 0) {
      return existingFunctions[0].id;
    }

    return await this.graphOps.createServiceFunctionVertex({
      id: functionId,
      name: data.name,
      description: data.description,
      category: data.category,
      organisationId: data.organisationId,
    });
  }

  /**
   * Assign asset to service function
   */
  async assignAssetToServiceFunction(
    assetId: string,
    serviceFunctionName: string,
    organisationId: string
  ): Promise<void> {
    // Find or create service function
    const functions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
      name: serviceFunctionName,
      organisationId,
    });

    let functionId: string;
    if (functions.length === 0) {
      functionId = await this.createServiceFunction({
        name: serviceFunctionName,
        description: `Service function for ${serviceFunctionName}`,
        category: this.getServiceCategory(serviceFunctionName),
        organisationId,
      });
    } else {
      functionId = functions[0].id;
    }

    // Link asset to service function
    await this.graphOps.linkAssetToServiceFunction(assetId, functionId);

    // Update asset tags
    await this.prisma.asset.update({
      where: { id: assetId },
      data: {
        tags: {
          push: `service-purpose:${serviceFunctionName}`,
        },
      },
    });
  }

  /**
   * Get assets by purpose category
   */
  async getAssetsByPurposeCategory(
    organisationId: string,
    category: string
  ): Promise<any[]> {
    const functions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
      category,
      organisationId,
    });

    const allAssets = [];

    for (const func of functions) {
      const assets = await this.getAssetsByServiceFunction(organisationId, func.properties.name);
      allAssets.push(...assets);
    }

    return allAssets;
  }

  /**
   * Get critical assets by service function
   */
  async getCriticalAssetsByServiceFunction(
    organisationId: string,
    serviceFunction?: string
  ): Promise<any[]> {
    let functions: GraphVertex[];

    if (serviceFunction) {
      functions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
        name: serviceFunction,
        organisationId,
      });
    } else {
      functions = await this.graphOps.client.getVerticesByLabel('ServiceFunction', {
        organisationId,
      });
    }

    const criticalAssets = [];

    for (const func of functions) {
      const assets = await this.graphOps.getAssetsByServiceFunction(func.id);
      
      for (const asset of assets) {
        if (asset.properties.criticality === 'Critical') {
          const assetRecord = await this.prisma.asset.findUnique({
            where: { id: asset.id },
            include: {
              organisation: true,
              inspections: {
                orderBy: { inspectionDate: 'desc' },
                take: 1,
              },
              workOrders: {
                where: { status: 'OPEN' },
                orderBy: { priority: 'desc' },
              },
            },
          });

          if (assetRecord) {
            criticalAssets.push({
              ...assetRecord,
              serviceFunction: func.properties.name,
            });
          }
        }
      }
    }

    return criticalAssets.sort((a, b) => {
      // Sort by priority first, then by value
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      const aValue = a.currentValue ? Number(a.currentValue) : 0;
      const bValue = b.currentValue ? Number(b.currentValue) : 0;
      return bValue - aValue;
    });
  }

  /**
   * Map asset type to purpose
   */
  private mapAssetTypeToPurpose(assetType: string): string {
    const purposeMap: Record<string, string> = {
      BUILDING: 'Facility Management',
      ROAD: 'Transportation Infrastructure',
      BRIDGE: 'Transportation Infrastructure',
      FOOTPATH: 'Pedestrian Infrastructure',
      PARK: 'Community Recreation',
      PLAYGROUND: 'Community Recreation',
      SPORTS_FACILITY: 'Community Recreation',
      LIBRARY: 'Community Services',
      COMMUNITY_CENTRE: 'Community Services',
      CAR_PARK: 'Transportation Infrastructure',
      STREET_FURNITURE: 'Urban Services',
      TRAFFIC_LIGHT: 'Traffic Management',
      STREET_LIGHT: 'Urban Services',
      DRAINAGE: 'Infrastructure',
      WATER_SUPPLY: 'Infrastructure',
      SEWER: 'Infrastructure',
      ELECTRICAL_INFRASTRUCTURE: 'Infrastructure',
      TELECOMMUNICATIONS: 'Infrastructure',
      OTHER: 'General Services',
    };

    return purposeMap[assetType] || 'General Services';
  }

  /**
   * Get service category from service function name
   */
  private getServiceCategory(serviceFunction: string): string {
    const categoryMap: Record<string, string> = {
      'Facility Management': 'Infrastructure',
      'Transportation Infrastructure': 'Infrastructure',
      'Pedestrian Infrastructure': 'Infrastructure',
      'Community Recreation': 'Social',
      'Community Services': 'Social',
      'Urban Services': 'Infrastructure',
      'Traffic Management': 'Infrastructure',
      'Infrastructure': 'Infrastructure',
      'General Services': 'General',
    };

    return categoryMap[serviceFunction] || 'General';
  }

  /**
   * Get function-based analytics
   */
  async getFunctionAnalytics(organisationId: string): Promise<{
    totalFunctions: number;
    totalAssets: number;
    totalValue: number;
    criticalAssets: number;
    categoryBreakdown: Array<{
      category: string;
      functions: number;
      assets: number;
      value: number;
      criticalAssets: number;
    }>;
  }> {
    const hierarchy = await this.getFunctionHierarchy(organisationId);
    
    const totalFunctions = hierarchy.reduce((sum, cat) => sum + cat.functions.length, 0);
    const totalAssets = hierarchy.reduce((sum, cat) => sum + cat.totalAssets, 0);
    const totalValue = hierarchy.reduce((sum, cat) => sum + cat.totalValue, 0);
    const criticalAssets = hierarchy.reduce((sum, cat) => sum + cat.criticalAssets, 0);

    const categoryBreakdown = hierarchy.map(cat => ({
      category: cat.category,
      functions: cat.functions.length,
      assets: cat.totalAssets,
      value: cat.totalValue,
      criticalAssets: cat.criticalAssets,
    }));

    return {
      totalFunctions,
      totalAssets,
      totalValue,
      criticalAssets,
      categoryBreakdown,
    };
  }
}

export const functionBasedOrg = new FunctionBasedOrganization();
