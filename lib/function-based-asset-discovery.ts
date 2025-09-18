/**
 * Function-Based Asset Discovery System
 *
 * Provides intelligent asset discovery and search capabilities based on
 * functions, purposes, and contextual information to help users find
 * relevant assets quickly and efficiently.
 *
 * @file lib/function-based-asset-discovery.ts
 * @version 1.0.0
 * @since PI3 - E17: Create Function-Based Asset Organization
 */

import {
  AssetDiscoveryQuery,
  AssetFunctionType,
  AssetPurposeCategory,
} from '@/types/resilience';
import { AssetModel } from './function-based-asset-modeling';

export interface DiscoveryCriteria {
  functionTypes?: AssetFunctionType[];
  purposeCategories?: AssetPurposeCategory[];
  assetTypes?: string[];
  locations?: string[];
  valueRange?: { min: number; max: number };
  conditionRange?: { min: string; max: string };
  ageRange?: { min: number; max: number };
  keywords?: string[];
  metadata: Record<string, any>;
}

export interface DiscoveryResult {
  queryId: string;
  success: boolean;
  assets: AssetModel[];
  totalFound: number;
  searchTime: number;
  confidence: number;
  suggestions: string[];
  filters: DiscoveryCriteria;
  metadata: Record<string, any>;
}

export interface DiscoveryIndex {
  id: string;
  name: string;
  description: string;
  fields: string[];
  weights: Record<string, number>;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface DiscoveryConfiguration {
  enabled: boolean;
  enableFuzzySearch: boolean;
  enableSemanticSearch: boolean;
  maxResults: number;
  defaultSearchFields: string[];
  indexRefreshInterval: number;
  enableSuggestions: boolean;
  metadata: Record<string, any>;
}

export interface SearchSuggestion {
  text: string;
  type: 'FUNCTION' | 'PURPOSE' | 'ASSET_TYPE' | 'LOCATION' | 'KEYWORD';
  confidence: number;
  metadata: Record<string, any>;
}

/**
 * FunctionBasedAssetDiscovery Class
 *
 * Provides intelligent asset discovery and search capabilities.
 */
export class FunctionBasedAssetDiscovery {
  private config: DiscoveryConfiguration;
  private assetModels: Map<string, AssetModel> = new Map();
  private discoveryQueries: Map<string, AssetDiscoveryQuery> = new Map();
  private discoveryIndexes: Map<string, DiscoveryIndex> = new Map();
  private searchHistory: Map<string, DiscoveryResult[]> = new Map();

  constructor(config: DiscoveryConfiguration) {
    this.config = { ...config };
    this.initializeDefaultIndexes();
    this.initializeDefaultQueries();
    console.log(`🔍 Function-Based Asset Discovery System initialized.`);
  }

  /**
   * Initialize default search indexes for different asset attributes.
   */
  private initializeDefaultIndexes(): void {
    const defaultIndexes: DiscoveryIndex[] = [
      {
        id: 'index-function',
        name: 'Function Index',
        description: 'Index for searching by asset functions',
        fields: ['functions.name', 'functions.functionType', 'primaryFunction.name'],
        weights: { 'primaryFunction.name': 1.0, 'functions.name': 0.8, 'functions.functionType': 0.6 },
        isActive: true,
        metadata: { type: 'function' },
      },
      {
        id: 'index-purpose',
        name: 'Purpose Index',
        description: 'Index for searching by asset purposes',
        fields: ['purposes.purpose', 'purposes.description', 'purposes.category'],
        weights: { 'purposes.purpose': 1.0, 'purposes.description': 0.7, 'purposes.category': 0.5 },
        isActive: true,
        metadata: { type: 'purpose' },
      },
      {
        id: 'index-asset-type',
        name: 'Asset Type Index',
        description: 'Index for searching by asset types',
        fields: ['assetType', 'name', 'description'],
        weights: { 'assetType': 1.0, 'name': 0.8, 'description': 0.6 },
        isActive: true,
        metadata: { type: 'asset' },
      },
      {
        id: 'index-location',
        name: 'Location Index',
        description: 'Index for searching by asset locations',
        fields: ['location', 'metadata.region', 'metadata.zone'],
        weights: { 'location': 1.0, 'metadata.region': 0.8, 'metadata.zone': 0.6 },
        isActive: true,
        metadata: { type: 'location' },
      },
      {
        id: 'index-metadata',
        name: 'Metadata Index',
        description: 'Index for searching by asset metadata',
        fields: ['metadata.*'],
        weights: { 'metadata.*': 0.5 },
        isActive: true,
        metadata: { type: 'metadata' },
      },
    ];

    defaultIndexes.forEach(index => {
      this.discoveryIndexes.set(index.id, index);
    });
  }

  /**
   * Initialize default discovery queries for common search patterns.
   */
  private initializeDefaultQueries(): void {
    const defaultQueries: AssetDiscoveryQuery[] = [
      {
        id: 'query-transportation',
        name: 'Transportation Assets',
        description: 'Find all transportation-related assets',
        functionTypes: [AssetFunctionType.TRANSPORTATION],
        purposeCategories: [AssetPurposeCategory.PRIMARY, AssetPurposeCategory.SECONDARY],
        filters: {},
        searchTerms: ['transport', 'road', 'bridge', 'highway'],
        metadata: { category: 'transportation' },
      },
      {
        id: 'query-infrastructure',
        name: 'Infrastructure Assets',
        description: 'Find all infrastructure-related assets',
        functionTypes: [AssetFunctionType.INFRASTRUCTURE],
        purposeCategories: [AssetPurposeCategory.PRIMARY],
        filters: {},
        searchTerms: ['infrastructure', 'water', 'sewer', 'utility'],
        metadata: { category: 'infrastructure' },
      },
      {
        id: 'query-emergency',
        name: 'Emergency Service Assets',
        description: 'Find all emergency service assets',
        functionTypes: [AssetFunctionType.EMERGENCY_SERVICES],
        purposeCategories: [AssetPurposeCategory.EMERGENCY, AssetPurposeCategory.PRIMARY],
        filters: {},
        searchTerms: ['emergency', 'fire', 'police', 'ambulance'],
        metadata: { category: 'emergency' },
      },
      {
        id: 'query-high-value',
        name: 'High Value Assets',
        description: 'Find high-value assets requiring special attention',
        functionTypes: [],
        purposeCategories: [AssetPurposeCategory.PRIMARY],
        filters: { valueContribution: { min: 0.8 } },
        searchTerms: ['critical', 'important', 'high value'],
        metadata: { category: 'value' },
      },
      {
        id: 'query-orphaned',
        name: 'Orphaned Assets',
        description: 'Find assets without assigned functions or purposes',
        functionTypes: [],
        purposeCategories: [],
        filters: { hasFunctions: false, hasPurposes: false },
        searchTerms: ['orphaned', 'unassigned', 'no purpose'],
        metadata: { category: 'orphaned' },
      },
    ];

    defaultQueries.forEach(query => {
      this.discoveryQueries.set(query.id, query);
    });
  }

  /**
   * Registers an asset model with the discovery system.
   */
  public registerAssetModel(assetModel: AssetModel): void {
    this.assetModels.set(assetModel.id, assetModel);
    console.log(`🔍 Registered asset model ${assetModel.name} with discovery system`);
  }

  /**
   * Searches for assets based on discovery criteria.
   */
  public async searchAssets(criteria: DiscoveryCriteria): Promise<DiscoveryResult> {
    const startTime = Date.now();
    const queryId = `query-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    let matchingAssets = Array.from(this.assetModels.values());

    // Apply function type filter
    if (criteria.functionTypes && criteria.functionTypes.length > 0) {
      matchingAssets = matchingAssets.filter(asset =>
        asset.functions.some(func => criteria.functionTypes!.includes(func.functionType))
      );
    }

    // Apply purpose category filter
    if (criteria.purposeCategories && criteria.purposeCategories.length > 0) {
      matchingAssets = matchingAssets.filter(asset =>
        asset.purposes.some(purpose => criteria.purposeCategories!.includes(purpose.category))
      );
    }

    // Apply asset type filter
    if (criteria.assetTypes && criteria.assetTypes.length > 0) {
      matchingAssets = matchingAssets.filter(asset =>
        criteria.assetTypes!.includes(asset.assetType)
      );
    }

    // Apply location filter
    if (criteria.locations && criteria.locations.length > 0) {
      matchingAssets = matchingAssets.filter(asset =>
        asset.location && criteria.locations!.includes(asset.location)
      );
    }

    // Apply value range filter
    if (criteria.valueRange) {
      matchingAssets = matchingAssets.filter(asset =>
        asset.valueContribution >= criteria.valueRange!.min &&
        asset.valueContribution <= criteria.valueRange!.max
      );
    }

    // Apply keyword search
    if (criteria.keywords && criteria.keywords.length > 0) {
      matchingAssets = this.performKeywordSearch(matchingAssets, criteria.keywords);
    }

    // Apply metadata filters
    matchingAssets = this.applyMetadataFilters(matchingAssets, criteria.metadata);

    // Sort by relevance
    matchingAssets = this.sortByRelevance(matchingAssets, criteria);

    // Limit results
    const limitedAssets = matchingAssets.slice(0, this.config.maxResults);

    const searchTime = Date.now() - startTime;
    const confidence = this.calculateSearchConfidence(limitedAssets, criteria);

    const result: DiscoveryResult = {
      queryId,
      success: true,
      assets: limitedAssets,
      totalFound: matchingAssets.length,
      searchTime,
      confidence,
      suggestions: this.generateSuggestions(criteria),
      filters: criteria,
      metadata: { searchedAt: new Date().toISOString() },
    };

    // Store search history
    this.storeSearchHistory(queryId, result);

    console.log(`🔍 Found ${limitedAssets.length} assets in ${searchTime}ms (confidence: ${confidence.toFixed(2)})`);

    return result;
  }

  /**
   * Performs keyword search across asset fields.
   */
  private performKeywordSearch(assets: AssetModel[], keywords: string[]): AssetModel[] {
    return assets.filter(asset => {
      const searchableText = this.getSearchableText(asset).toLowerCase();
      
      return keywords.some(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        
        // Exact match gets highest priority
        if (searchableText.includes(lowerKeyword)) {
          return true;
        }
        
        // Fuzzy matching if enabled
        if (this.config.enableFuzzySearch) {
          return this.performFuzzyMatch(searchableText, lowerKeyword);
        }
        
        return false;
      });
    });
  }

  /**
   * Gets searchable text from an asset model.
   */
  private getSearchableText(asset: AssetModel): string {
    const parts: string[] = [
      asset.name,
      asset.description,
      asset.assetType,
      asset.location || '',
    ];

    // Add function information
    asset.functions.forEach(func => {
      parts.push(func.name, func.description, func.functionType);
    });

    // Add purpose information
    asset.purposes.forEach(purpose => {
      parts.push(purpose.purpose, purpose.description, purpose.category);
    });

    // Add metadata
    Object.values(asset.metadata).forEach(value => {
      if (typeof value === 'string') {
        parts.push(value);
      }
    });

    return parts.join(' ');
  }

  /**
   * Performs fuzzy matching between text and keyword.
   */
  private performFuzzyMatch(text: string, keyword: string): boolean {
    // Simple fuzzy matching - in a real system, this would use more sophisticated algorithms
    const keywordWords = keyword.split(' ');
    
    return keywordWords.every(word => {
      if (word.length < 3) return text.includes(word);
      
      // Check for partial matches
      for (let i = 0; i <= text.length - word.length; i++) {
        const substring = text.substring(i, i + word.length);
        if (this.calculateSimilarity(substring, word) > 0.7) {
          return true;
        }
      }
      
      return false;
    });
  }

  /**
   * Calculates similarity between two strings.
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.calculateEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculates edit distance between two strings.
   */
  private calculateEditDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Applies metadata filters to assets.
   */
  private applyMetadataFilters(assets: AssetModel[], metadataFilters: Record<string, any>): AssetModel[] {
    return assets.filter(asset => {
      for (const [key, value] of Object.entries(metadataFilters)) {
        if (asset.metadata[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Sorts assets by relevance to search criteria.
   */
  private sortByRelevance(assets: AssetModel[], criteria: DiscoveryCriteria): AssetModel[] {
    return assets.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, criteria);
      const scoreB = this.calculateRelevanceScore(b, criteria);
      return scoreB - scoreA;
    });
  }

  /**
   * Calculates relevance score for an asset based on search criteria.
   */
  private calculateRelevanceScore(asset: AssetModel, criteria: DiscoveryCriteria): number {
    let score = 0;

    // Base score from value contribution
    score += asset.valueContribution * 10;

    // Function type match
    if (criteria.functionTypes && criteria.functionTypes.length > 0) {
      const matchingFunctions = asset.functions.filter(func =>
        criteria.functionTypes!.includes(func.functionType)
      );
      score += matchingFunctions.length * 5;
    }

    // Purpose category match
    if (criteria.purposeCategories && criteria.purposeCategories.length > 0) {
      const matchingPurposes = asset.purposes.filter(purpose =>
        criteria.purposeCategories!.includes(purpose.category)
      );
      score += matchingPurposes.length * 3;
    }

    // Keyword match
    if (criteria.keywords && criteria.keywords.length > 0) {
      const searchableText = this.getSearchableText(asset).toLowerCase();
      const keywordMatches = criteria.keywords.filter(keyword =>
        searchableText.includes(keyword.toLowerCase())
      );
      score += keywordMatches.length * 2;
    }

    // Primary function bonus
    if (asset.primaryFunction) {
      score += 5;
    }

    return score;
  }

  /**
   * Calculates search confidence based on results and criteria.
   */
  private calculateSearchConfidence(assets: AssetModel[], criteria: DiscoveryCriteria): number {
    if (assets.length === 0) return 0;

    let totalConfidence = 0;
    for (const asset of assets) {
      const relevanceScore = this.calculateRelevanceScore(asset, criteria);
      const maxPossibleScore = 50; // Estimated maximum possible score
      totalConfidence += Math.min(relevanceScore / maxPossibleScore, 1);
    }

    return totalConfidence / assets.length;
  }

  /**
   * Generates search suggestions based on criteria.
   */
  private generateSuggestions(criteria: DiscoveryCriteria): string[] {
    const suggestions: string[] = [];

    if (criteria.keywords && criteria.keywords.length > 0) {
      suggestions.push('Try searching for related terms or synonyms');
      suggestions.push('Use more specific keywords for better results');
    }

    if (criteria.functionTypes && criteria.functionTypes.length > 0) {
      suggestions.push('Consider searching by purpose categories as well');
    }

    if (criteria.purposeCategories && criteria.purposeCategories.length > 0) {
      suggestions.push('Try searching by function types for broader results');
    }

    suggestions.push('Use filters to narrow down results');
    suggestions.push('Check spelling and try alternative terms');

    return suggestions;
  }

  /**
   * Stores search history for analytics and improvement.
   */
  private storeSearchHistory(queryId: string, result: DiscoveryResult): void {
    if (!this.searchHistory.has(queryId)) {
      this.searchHistory.set(queryId, []);
    }

    const history = this.searchHistory.get(queryId)!;
    history.push(result);

    // Keep only recent history
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // Keep 30 days
    
    this.searchHistory.set(queryId, history.filter(r => 
      new Date(r.metadata.searchedAt) > cutoffDate
    ));
  }

  /**
   * Executes a predefined discovery query.
   */
  public async executeQuery(queryId: string): Promise<DiscoveryResult> {
    const query = this.discoveryQueries.get(queryId);
    if (!query) {
      throw new Error(`Discovery query ${queryId} not found`);
    }

    const criteria: DiscoveryCriteria = {
      functionTypes: query.functionTypes,
      purposeCategories: query.purposeCategories,
      keywords: query.searchTerms,
      metadata: query.filters,
    };

    return this.searchAssets(criteria);
  }

  /**
   * Gets all available discovery queries.
   */
  public getDiscoveryQueries(): AssetDiscoveryQuery[] {
    return Array.from(this.discoveryQueries.values());
  }

  /**
   * Creates a new discovery query.
   */
  public createDiscoveryQuery(query: AssetDiscoveryQuery): void {
    this.discoveryQueries.set(query.id, query);
    console.log(`🔍 Created discovery query ${query.name}`);
  }

  /**
   * Gets search suggestions based on partial input.
   */
  public getSearchSuggestions(partialInput: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const lowerInput = partialInput.toLowerCase();

    // Function type suggestions
    Object.values(AssetFunctionType).forEach(funcType => {
      if (funcType.toLowerCase().includes(lowerInput)) {
        suggestions.push({
          text: funcType,
          type: 'FUNCTION',
          confidence: 0.9,
          metadata: { category: 'function' },
        });
      }
    });

    // Purpose category suggestions
    Object.values(AssetPurposeCategory).forEach(category => {
      if (category.toLowerCase().includes(lowerInput)) {
        suggestions.push({
          text: category,
          type: 'PURPOSE',
          confidence: 0.8,
          metadata: { category: 'purpose' },
        });
      }
    });

    // Asset type suggestions from existing assets
    const assetTypes = new Set(Array.from(this.assetModels.values()).map(asset => asset.assetType));
    assetTypes.forEach(assetType => {
      if (assetType.toLowerCase().includes(lowerInput)) {
        suggestions.push({
          text: assetType,
          type: 'ASSET_TYPE',
          confidence: 0.7,
          metadata: { category: 'asset_type' },
        });
      }
    });

    // Location suggestions
    const locations = new Set(Array.from(this.assetModels.values())
      .map(asset => asset.location)
      .filter(location => location !== undefined));
    locations.forEach(location => {
      if (location!.toLowerCase().includes(lowerInput)) {
        suggestions.push({
          text: location!,
          type: 'LOCATION',
          confidence: 0.6,
          metadata: { category: 'location' },
        });
      }
    });

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Gets discovery statistics.
   */
  public getDiscoveryStatistics(): {
    totalAssets: number;
    totalQueries: number;
    totalSearches: number;
    averageSearchTime: number;
    mostSearchedTerms: string[];
    queryDistribution: Record<string, number>;
  } {
    const totalAssets = this.assetModels.size;
    const totalQueries = this.discoveryQueries.size;
    
    let totalSearches = 0;
    let totalSearchTime = 0;
    const searchTerms: string[] = [];
    const queryDistribution: Record<string, number> = {};

    for (const history of this.searchHistory.values()) {
      totalSearches += history.length;
      totalSearchTime += history.reduce((sum, r) => sum + r.searchTime, 0);
      
      for (const result of history) {
        if (result.filters.keywords) {
          searchTerms.push(...result.filters.keywords);
        }
        
        const queryType = result.metadata.queryType || 'custom';
        queryDistribution[queryType] = (queryDistribution[queryType] || 0) + 1;
      }
    }

    // Find most searched terms
    const termCounts = searchTerms.reduce((counts, term) => {
      counts[term] = (counts[term] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostSearchedTerms = Object.entries(termCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([term]) => term);

    return {
      totalAssets,
      totalQueries,
      totalSearches,
      averageSearchTime: totalSearches > 0 ? totalSearchTime / totalSearches : 0,
      mostSearchedTerms,
      queryDistribution,
    };
  }

  /**
   * Updates the configuration of the discovery system.
   */
  public updateConfig(newConfig: Partial<DiscoveryConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`⚙️ Function-Based Asset Discovery configuration updated.`);
  }

  /**
   * Removes an asset model from the discovery system.
   */
  public unregisterAssetModel(assetId: string): boolean {
    const removed = this.assetModels.delete(assetId);
    if (removed) {
      console.log(`🔍 Unregistered asset model ${assetId} from discovery system`);
    }
    return removed;
  }
}
