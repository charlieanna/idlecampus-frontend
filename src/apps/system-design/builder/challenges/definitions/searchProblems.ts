import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Basic Full-Text Search - Search documents with keywords
 * From extracted-problems/system-design/search.md
 */
export const basicTextSearchProblemDefinition: ProblemDefinition = {
  id: 'basic-text-search',
  title: 'Basic Full-Text Search',
  description: `Build a simple search engine for documents that:
- Indexes text documents with inverted index
- Searches by keywords with AND/OR operators
- Ranks results by relevance using TF-IDF
- Handles 1k searches/sec across 1M documents`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for search traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for search API',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch for inverted index',
      },
      {
        type: 'storage',
        reason: 'Need database to store original documents',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Search users connect through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to search API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API queries Elasticsearch index',
      },
    ],
    dataModel: {
      entities: ['document'],
      fields: {
        document: ['id', 'title', 'content', 'author', 'created_at', 'word_count'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Keyword searches
        { type: 'write', frequency: 'low' },                // Document indexing
      ],
    },
  },

  scenarios: generateScenarios('basic-text-search', problemConfigs['basic-text-search']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Search Autocomplete - Suggest completions as users type
 * From extracted-problems/system-design/search.md
 */
export const autocompleteSearchProblemDefinition: ProblemDefinition = {
  id: 'autocomplete-search',
  title: 'Search Autocomplete',
  description: `Implement Google-like search suggestions that:
- Suggests completions for partial queries using prefix trees
- Ranks by popularity and recency
- Supports fuzzy matching for typos
- Handles 50k keystrokes/sec with <50ms P95 latency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for autocomplete traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for suggest API',
      },
      {
        type: 'cache',
        reason: 'Need Redis for trie (prefix tree) storage',
      },
      {
        type: 'storage',
        reason: 'Need search engine for query analytics',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Search box sends keystrokes through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to suggest API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API queries trie in Redis for O(k) lookup',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API queries full query index for rankings',
      },
    ],
    dataModel: {
      entities: ['query', 'suggestion'],
      fields: {
        query: ['id', 'text', 'popularity_score', 'timestamp'],
        suggestion: ['prefix', 'completions', 'scores'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Prefix lookups
      ],
    },
  },

  scenarios: generateScenarios('autocomplete-search', problemConfigs['autocomplete-search']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Faceted Search with Filters - Multi-dimensional filtering UI
 * From extracted-problems/system-design/search.md
 */
export const facetedSearchProblemDefinition: ProblemDefinition = {
  id: 'faceted-search',
  title: 'Faceted Search with Filters',
  description: `Design a faceted search system that:
- Filters by multiple attributes (price, brand, category, rating)
- Shows facet counts dynamically
- Supports range filters
- Handles 5k requests/sec with 1M products`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for search traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for faceted search API',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch for aggregations',
      },
      {
        type: 'cache',
        reason: 'Need Redis to cache facet counts',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users send filter requests through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to search API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API caches popular facet combinations',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API queries ES aggregations for facet counts',
      },
    ],
    dataModel: {
      entities: ['product', 'facet'],
      fields: {
        product: ['id', 'name', 'price', 'brand', 'category', 'rating'],
        facet: ['name', 'values', 'counts'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Faceted searches
      ],
    },
  },

  scenarios: generateScenarios('faceted-search', problemConfigs['faceted-search']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Location-Based Search - Find nearby places with geo-queries
 * From extracted-problems/system-design/search.md
 */
export const geoSearchProblemDefinition: ProblemDefinition = {
  id: 'geo-search',
  title: 'Location-Based Search',
  description: `Design a location-based search system that:
- Searches within radius using geohash indexing
- Supports bounding box queries
- Sorts results by distance
- Handles 20k requests/sec across 10M locations worldwide`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for geo-search traffic',
      },
      {
        type: 'compute',
        reason: 'Need app servers for location API',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch with geo_point indexing',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Mobile users send location queries through LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to location API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API queries ES with geo_distance or geo_bounding_box',
      },
    ],
    dataModel: {
      entities: ['location'],
      fields: {
        location: ['id', 'name', 'lat', 'lon', 'category', 'rating'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Geo queries
      ],
    },
  },

  scenarios: generateScenarios('geo-search', problemConfigs['geo-search']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(basicTextSearchProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicTextSearchProblemDefinition);
