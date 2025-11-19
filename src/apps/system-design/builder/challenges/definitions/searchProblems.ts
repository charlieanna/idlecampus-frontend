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

  userFacingFRs: [
    '**GET /api/search?q=keywords** - Search documents with keywords and boolean operators (AND/OR)',
    '**POST /api/documents** - Index new document with title and content',
    '**PUT /api/documents/:id** - Update existing document and re-index',
    '**DELETE /api/documents/:id** - Remove document from search index',
  ],

  userFacingNFRs: [
    'Search queries must return results in <200ms at P95',
    'Support 1,000 searches/sec across 1M documents',
    'Rank results by relevance using TF-IDF scoring',
    'Return top 20 results sorted by relevance score',
  ],

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

  userFacingFRs: [
    '**GET /api/autocomplete?q=partial** - Get search suggestions for partial query',
    '**POST /api/autocomplete/track** - Track completed searches to update popularity rankings',
    '**GET /api/autocomplete/trending** - Get trending search queries',
    '**Supports fuzzy matching** - Return suggestions even with typos (edit distance <= 2)',
  ],

  userFacingNFRs: [
    'Autocomplete suggestions must return in <50ms at P95',
    'Support 50,000 keystrokes/sec from concurrent users',
    'Return top 10 suggestions ranked by popularity and recency',
    'Support fuzzy matching with edit distance up to 2 characters',
  ],

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

  userFacingFRs: [
    '**GET /api/products/search** - Search products with multiple facet filters (brand, category, rating)',
    '**GET /api/products/facets** - Retrieve available facets with dynamic counts',
    '**GET /api/products/filter?price=min-max** - Apply price range filter',
    '**POST /api/products/search/advanced** - Combine multiple filters (brand AND category AND price range)',
  ],

  userFacingNFRs: [
    'Faceted search queries must complete in <300ms at P95',
    'Support 5,000 requests/sec across 1M products',
    'Return dynamic facet counts based on current filter selections',
    'Support range filters for price, rating, and date fields',
  ],

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

  userFacingFRs: [
    '**GET /api/locations/nearby?lat=...&lon=...&radius=...** - Find locations within radius',
    '**GET /api/locations/bbox?neLat=...&neLon=...&swLat=...&swLon=...** - Search within bounding box',
    '**GET /api/locations/search?q=restaurant&lat=...&lon=...** - Search with keyword and location',
    '**Results sorted by distance** - All responses include distance in meters and sort by proximity',
  ],

  userFacingNFRs: [
    'Geo-search queries must complete in <100ms at P95',
    'Support 20,000 requests/sec across 10M worldwide locations',
    'Use geohash indexing for efficient radius searches',
    'Return results sorted by distance from user location',
  ],

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
