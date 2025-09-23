/**
 * Semantic Search Utilities for Asset Lookup
 * Provides intelligent search capabilities including natural language processing,
 * fuzzy matching, and smart suggestions
 */

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'asset' | 'purpose' | 'location' | 'action' | 'recent';
  category?: string;
  metadata?: Record<string, any>;
}

export interface SearchIntent {
  action: 'find' | 'inspect' | 'maintain' | 'emergency' | 'report';
  entities: string[];
  filters: Record<string, any>;
  confidence: number;
}

/**
 * Natural language query patterns for asset search
 */
const SEARCH_PATTERNS = {
  // Asset identification patterns
  assetNumber: /(?:asset|number|id)\s*[#:]?\s*([A-Z0-9-]+)/gi,
  assetName: /(?:find|show|get)\s+(?:the\s+)?([a-z\s]+?)(?:\s+(?:asset|pump|generator|tank|system))/gi,

  // Location patterns
  location: /(?:in|at|near|around)\s+([a-z\s]+?)(?:\s+(?:zone|area|district|region|site))/gi,

  // Condition patterns
  condition: /(?:condition|status)\s+(?:is\s+)?(excellent|good|fair|poor|critical|bad|broken)/gi,

  // Priority patterns
  priority: /(?:priority|urgent|important|critical|high|medium|low)\s+(?:priority\s+)?(?:assets?|items?)/gi,

  // Action patterns
  action: {
    inspect: /(?:inspect|check|examine|audit|review)/gi,
    maintain: /(?:maintain|repair|fix|service|overhaul)/gi,
    emergency: /(?:emergency|urgent|critical|immediate|asap)/gi,
    report: /(?:report|generate|create|show)\s+(?:report|summary|list)/gi,
  },

  // Purpose patterns
  purpose: /(?:for|purpose|used\s+for|serves?)\s+([a-z\s]+?)(?:\s+(?:treatment|management|supply|distribution))/gi,
};

/**
 * Asset search synonyms and related terms
 */
const SEARCH_SYNONYMS = {
  // Asset types
  'water pump': ['pump', 'motor', 'water motor', 'hydraulic pump', 'water system'],
  'generator': ['gen', 'genset', 'power generator', 'backup generator', 'emergency power'],
  'tank': ['storage tank', 'reservoir', 'container', 'vessel', 'cistern'],
  'pipe': ['pipeline', 'conduit', 'duct', 'line', 'main'],
  'valve': ['control valve', 'shutoff', 'gate valve', 'ball valve'],

  // Conditions
  'excellent': ['perfect', 'great', 'optimal', 'best', 'top'],
  'good': ['okay', 'fine', 'acceptable', 'satisfactory', 'decent'],
  'fair': ['average', 'mediocre', 'ok', 'so-so', 'adequate'],
  'poor': ['bad', 'worn', 'damaged', 'deteriorated', 'substandard'],
  'critical': ['urgent', 'emergency', 'dangerous', 'failing', 'broken'],

  // Locations
  'treatment plant': ['wastewater plant', 'sewage plant', 'treatment facility', 'wtw', 'wtp'],
  'pumping station': ['pump station', 'lift station', 'booster station'],
  'reservoir': ['storage', 'tank farm', 'water storage', 'holding tank'],

  // Actions
  'inspect': ['check', 'examine', 'audit', 'review', 'assess'],
  'maintain': ['service', 'repair', 'fix', 'overhaul', 'upkeep'],
  'replace': ['swap', 'exchange', 'substitute', 'install new'],
};

/**
 * Recent searches storage key
 */
const RECENT_SEARCHES_KEY = 'aegrid_recent_searches';

/**
 * Parse natural language query and extract search intent
 */
export function parseSearchIntent(query: string): SearchIntent {
  const normalizedQuery = query.toLowerCase().trim();

  // Extract action intent
  let action: SearchIntent['action'] = 'find';
  let confidence = 0.5;

  for (const [actionType, pattern] of Object.entries(SEARCH_PATTERNS.action)) {
    if (pattern.test(normalizedQuery)) {
      action = actionType as SearchIntent['action'];
      confidence = 0.8;
      break;
    }
  }

  // Extract entities
  const entities: string[] = [];

  // Asset numbers
  const assetMatches = normalizedQuery.match(SEARCH_PATTERNS.assetNumber);
  if (assetMatches) {
    entities.push(...assetMatches.map(match => match.trim()));
  }

  // Asset names
  const nameMatches = normalizedQuery.match(SEARCH_PATTERNS.assetName);
  if (nameMatches) {
    entities.push(...nameMatches.map(match => match.trim()));
  }

  // Locations
  const locationMatches = normalizedQuery.match(SEARCH_PATTERNS.location);
  if (locationMatches) {
    entities.push(...locationMatches.map(match => match.trim()));
  }

  // Extract filters
  const filters: Record<string, any> = {};

  // Condition filter
  const conditionMatch = normalizedQuery.match(SEARCH_PATTERNS.condition);
  if (conditionMatch) {
    filters.condition = conditionMatch[1].toUpperCase();
  }

  // Priority filter
  if (SEARCH_PATTERNS.priority.test(normalizedQuery)) {
    if (normalizedQuery.includes('critical') || normalizedQuery.includes('urgent')) {
      filters.priority = 'CRITICAL';
    } else if (normalizedQuery.includes('high') || normalizedQuery.includes('important')) {
      filters.priority = 'HIGH';
    } else if (normalizedQuery.includes('medium')) {
      filters.priority = 'MEDIUM';
    } else if (normalizedQuery.includes('low')) {
      filters.priority = 'LOW';
    }
  }

  return {
    action,
    entities,
    filters,
    confidence,
  };
}

/**
 * Generate search suggestions based on query and context
 */
export function generateSearchSuggestions(
  query: string,
  context: {
    recentSearches?: string[];
    popularSearches?: string[];
    assets?: Array<{ name: string; assetNumber: string; location: string }>;
    purposes?: Array<{ name: string; description: string }>;
  }
): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    // Show popular and recent searches when no query
    if (context.popularSearches) {
      suggestions.push(...context.popularSearches.slice(0, 5).map((search, index) => ({
        id: `popular-${index}`,
        text: search,
        type: 'recent' as const,
        category: 'Popular',
      })));
    }

    if (context.recentSearches) {
      suggestions.push(...context.recentSearches.slice(0, 3).map((search, index) => ({
        id: `recent-${index}`,
        text: search,
        type: 'recent' as const,
        category: 'Recent',
      })));
    }

    return suggestions;
  }

  // Asset name suggestions
  if (context.assets) {
    const assetMatches = context.assets
      .filter(asset =>
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.assetNumber.toLowerCase().includes(normalizedQuery) ||
        asset.location.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 5)
      .map(asset => ({
        id: `asset-${asset.assetNumber}`,
        text: `${asset.name} (${asset.assetNumber})`,
        type: 'asset' as const,
        category: 'Assets',
        metadata: { assetNumber: asset.assetNumber, location: asset.location },
      }));
    suggestions.push(...assetMatches);
  }

  // Purpose suggestions
  if (context.purposes) {
    const purposeMatches = context.purposes
      .filter(purpose =>
        purpose.name.toLowerCase().includes(normalizedQuery) ||
        purpose.description.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 3)
      .map(purpose => ({
        id: `purpose-${purpose.name}`,
        text: purpose.name,
        type: 'purpose' as const,
        category: 'Service Purposes',
        metadata: { description: purpose.description },
      }));
    suggestions.push(...purposeMatches);
  }

  // Synonym-based suggestions
  for (const [term, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (synonyms.some(synonym => synonym.toLowerCase().includes(normalizedQuery))) {
      suggestions.push({
        id: `synonym-${term}`,
        text: `Search for ${term}`,
        type: 'purpose' as const,
        category: 'Suggestions',
        metadata: { originalTerm: term },
      });
    }
  }

  // Natural language suggestions
  const intent = parseSearchIntent(query);
  if (intent.confidence > 0.6) {
    suggestions.push({
      id: `intent-${intent.action}`,
      text: `Find assets for ${intent.action}`,
      type: 'action' as const,
      category: 'Smart Suggestions',
      metadata: { intent },
    });
  }

  return suggestions.slice(0, 10); // Limit to 10 suggestions
}

/**
 * Fuzzy search implementation for handling typos
 */
export function fuzzyMatch(query: string, target: string, threshold: number = 0.6): boolean {
  if (!query || !target) return false;

  const normalizedQuery = query.toLowerCase();
  const normalizedTarget = target.toLowerCase();

  // Exact match
  if (normalizedTarget.includes(normalizedQuery)) return true;

  // Levenshtein distance-based fuzzy matching
  const distance = levenshteinDistance(normalizedQuery, normalizedTarget);
  const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length);
  const similarity = 1 - (distance / maxLength);

  return similarity >= threshold;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const recent = localStorage.getItem(RECENT_SEARCHES_KEY);
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
}

/**
 * Save search to recent searches
 */
export function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;

  try {
    const recent = getRecentSearches();
    const updated = [query.trim(), ...recent.filter((item: string) => item !== query.trim())].slice(0, 10);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Popular search terms (could be fetched from analytics)
 */
export const POPULAR_SEARCHES = [
  'water pumps',
  'critical assets',
  'maintenance overdue',
  'treatment plant',
  'emergency assets',
  'pumping station',
  'water treatment',
  'infrastructure',
  'safety systems',
  'backup generators',
];

/**
 * Search query examples for user guidance
 */
export const SEARCH_EXAMPLES = [
  'Find all water pumps in the eastern zone',
  'Show me critical assets that need maintenance',
  'Assets with condition poor or critical',
  'Water treatment plant equipment',
  'Emergency backup systems',
  'Assets inspected in the last 30 days',
  'High priority infrastructure',
  'Pumping stations near reservoir',
];
