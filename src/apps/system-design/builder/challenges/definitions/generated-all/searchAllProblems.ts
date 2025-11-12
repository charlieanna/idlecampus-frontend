import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Search Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 35 problems
 */

/**
 * Basic Full-Text Search
 * From extracted-problems/system-design/search.md
 */
export const basicTextSearchProblemDefinition: ProblemDefinition = {
  id: 'basic-text-search',
  title: 'Basic Full-Text Search',
  description: `Learn search fundamentals by building a basic full-text search system. Understand inverted indexes, relevance scoring, and basic query operators.
- Index text documents
- Search by keywords
- Support AND/OR operators
- Rank results by relevance`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Index text documents',
    'Search by keywords',
    'Support AND/OR operators',
    'Rank results by relevance',
    'Highlight matching terms'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for queries',
    'Request Rate: 1k searches/sec',
    'Dataset Size: 1M documents',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Search Users (redirect_client) for search documents with keywords',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for search documents with keywords',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for search documents with keywords',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Search Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Search API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Search API routes to Elasticsearch',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'Elasticsearch routes to Document DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('basic-text-search', problemConfigs['basic-text-search'], [
    'Index text documents',
    'Search by keywords',
    'Support AND/OR operators',
    'Rank results by relevance',
    'Highlight matching terms'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Search Autocomplete
 * From extracted-problems/system-design/search.md
 */
export const autocompleteSearchProblemDefinition: ProblemDefinition = {
  id: 'autocomplete-search',
  title: 'Search Autocomplete',
  description: `Implement search autocomplete using prefix trees (tries). Learn about fuzzy matching, popularity weighting, and personalization.
- Suggest completions for partial queries
- Rank by popularity and recency
- Support fuzzy matching for typos
- Personalize based on user history`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Suggest completions for partial queries',
    'Rank by popularity and recency',
    'Support fuzzy matching for typos',
    'Personalize based on user history',
    'Update suggestions in real-time'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms per keystroke',
    'Request Rate: 50k keystrokes/sec',
    'Dataset Size: 10M unique queries',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Search Box (redirect_client) for suggest completions as users type',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for suggest completions as users type',
      },
      {
        type: 'cache',
        reason: 'Need Trie Cache (cache) for suggest completions as users type',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Search Box routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Suggest API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Suggest API routes to Trie Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Suggest API routes to Query Index',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('autocomplete-search', problemConfigs['autocomplete-search'], [
    'Suggest completions for partial queries',
    'Rank by popularity and recency',
    'Support fuzzy matching for typos',
    'Personalize based on user history',
    'Update suggestions in real-time'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Faceted Search with Filters
 * From extracted-problems/system-design/search.md
 */
export const facetedSearchProblemDefinition: ProblemDefinition = {
  id: 'faceted-search',
  title: 'Faceted Search with Filters',
  description: `Design a faceted search system that allows users to filter by multiple attributes (price, brand, category, rating). Count documents per facet dynamically.
- Filter by multiple attributes
- Show facet counts
- Support range filters
- Handle empty results gracefully`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Filter by multiple attributes',
    'Show facet counts',
    'Support range filters',
    'Handle empty results gracefully'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 5k req/s',
    'Dataset Size: 1M products, 20 facets',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for multi-dimensional filtering ui',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for multi-dimensional filtering ui',
      },
      {
        type: 'cache',
        reason: 'Need Facet Cache (cache) for multi-dimensional filtering ui',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for multi-dimensional filtering ui',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Facet Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'API routes to Elasticsearch',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('faceted-search', problemConfigs['faceted-search'], [
    'Filter by multiple attributes',
    'Show facet counts',
    'Support range filters',
    'Handle empty results gracefully'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Location-Based Search
 * From extracted-problems/system-design/search.md
 */
export const geoSearchProblemDefinition: ProblemDefinition = {
  id: 'geo-search',
  title: 'Location-Based Search',
  description: `Design a location-based search system for finding nearby restaurants, stores, or services. Support radius search, bounding box, and sorting by distance.
- Search within radius
- Bounding box queries
- Sort by distance
- Filter by category`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Search within radius',
    'Bounding box queries',
    'Sort by distance',
    'Filter by category'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms',
    'Request Rate: 20k req/s',
    'Dataset Size: 10M locations worldwide',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Mobile Users (redirect_client) for find nearby places with geo-queries',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for find nearby places with geo-queries',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Mobile Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES Geo',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('geo-search', problemConfigs['geo-search'], [
    'Search within radius',
    'Bounding box queries',
    'Sort by distance',
    'Filter by category'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Typo-Tolerant Fuzzy Search
 * From extracted-problems/system-design/search.md
 */
export const fuzzySearchProblemDefinition: ProblemDefinition = {
  id: 'fuzzy-search',
  title: 'Typo-Tolerant Fuzzy Search',
  description: `Design a fuzzy search system that handles typos, misspellings, and character transpositions using edit distance algorithms.
- Tolerate 1-2 char errors
- Suggest corrections
- Phonetic matching
- Support multiple languages`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Tolerate 1-2 char errors',
    'Suggest corrections',
    'Phonetic matching',
    'Support multiple languages'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms',
    'Request Rate: 10k req/s',
    'Dataset Size: 5M documents',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for handle typos and misspellings',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for handle typos and misspellings',
      },
      {
        type: 'cache',
        reason: 'Need Suggestion Cache (cache) for handle typos and misspellings',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Suggestion Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES Fuzzy',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('fuzzy-search', problemConfigs['fuzzy-search'], [
    'Tolerate 1-2 char errors',
    'Suggest corrections',
    'Phonetic matching',
    'Support multiple languages'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Synonym-Aware Search
 * From extracted-problems/system-design/search.md
 */
export const synonymSearchProblemDefinition: ProblemDefinition = {
  id: 'synonym-search',
  title: 'Synonym-Aware Search',
  description: `Design a search system that expands queries with synonyms to improve recall (e.g., "laptop" → "notebook", "computer").
- Expand with synonyms
- Language-specific synonyms
- Domain-specific terms
- Bidirectional matching`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Expand with synonyms',
    'Language-specific synonyms',
    'Domain-specific terms',
    'Bidirectional matching'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 15k req/s',
    'Dataset Size: 2M products, 50k synonym rules',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for expand queries with synonyms',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for expand queries with synonyms',
      },
      {
        type: 'storage',
        reason: 'Need Synonyms (db_primary) for expand queries with synonyms',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Synonyms',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('synonym-search', problemConfigs['synonym-search'], [
    'Expand with synonyms',
    'Language-specific synonyms',
    'Domain-specific terms',
    'Bidirectional matching'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Search Result Highlighting
 * From extracted-problems/system-design/search.md
 */
export const highlightSearchProblemDefinition: ProblemDefinition = {
  id: 'highlight-search',
  title: 'Search Result Highlighting',
  description: `Design a search system that highlights matched terms in result snippets with context windows.
- Highlight all matched terms
- Show context window
- Handle multi-word matches
- HTML-safe highlighting`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Highlight all matched terms',
    'Show context window',
    'Handle multi-word matches',
    'HTML-safe highlighting'
  ],
  userFacingNFRs: [
    'Latency: P95 < 120ms',
    'Request Rate: 8k req/s',
    'Dataset Size: 3M documents',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for highlight matched terms in results',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for highlight matched terms in results',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('highlight-search', problemConfigs['highlight-search'], [
    'Highlight all matched terms',
    'Show context window',
    'Handle multi-word matches',
    'HTML-safe highlighting'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Field Boosting & Relevance Tuning
 * From extracted-problems/system-design/search.md
 */
export const boostingSearchProblemDefinition: ProblemDefinition = {
  id: 'boosting-search',
  title: 'Field Boosting & Relevance Tuning',
  description: `Design a search system with field boosting to prioritize matches in titles, tags, and other important fields.
- Boost title matches 5x
- Boost tags 3x
- Recency boosting
- Popularity signals`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Boost title matches 5x',
    'Boost tags 3x',
    'Recency boosting',
    'Popularity signals'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 12k req/s',
    'Dataset Size: 8M documents',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for weight fields differently for ranking',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for weight fields differently for ranking',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for weight fields differently for ranking',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('boosting-search', problemConfigs['boosting-search'], [
    'Boost title matches 5x',
    'Boost tags 3x',
    'Recency boosting',
    'Popularity signals'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Product Discovery with Browse & Search
 * From extracted-problems/system-design/search.md
 */
export const productDiscoveryProblemDefinition: ProblemDefinition = {
  id: 'product-discovery',
  title: 'Product Discovery with Browse & Search',
  description: `Design a product discovery system that seamlessly integrates category browsing with search, filters, and recommendations.
- Category navigation
- Faceted filters
- Search within category
- Sort options (price, rating, relevance)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Category navigation',
    'Faceted filters',
    'Search within category',
    'Sort options (price, rating, relevance)',
    'Cross-sell recommendations'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 50k req/s',
    'Dataset Size: 50M products, 1k categories',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for combine browsing catalog with search',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for combine browsing catalog with search',
      },
      {
        type: 'cache',
        reason: 'Need Category Cache (cache) for combine browsing catalog with search',
      },
      {
        type: 'storage',
        reason: 'Need Catalog DB (db_primary) for combine browsing catalog with search',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Category Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Product Index',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Product Index routes to Catalog DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('product-discovery', problemConfigs['product-discovery'], [
    'Category navigation',
    'Faceted filters',
    'Search within category',
    'Sort options (price, rating, relevance)',
    'Cross-sell recommendations'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Search Suggestions & Related Queries
 * From extracted-problems/system-design/search.md
 */
export const searchSuggestionsProblemDefinition: ProblemDefinition = {
  id: 'search-suggestions',
  title: 'Search Suggestions & Related Queries',
  description: `Design a search suggestion system that recommends related queries and alternative searches based on query logs.
- Suggest related queries
- Show trending searches
- Correct common mistakes
- Personalized suggestions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Suggest related queries',
    'Show trending searches',
    'Correct common mistakes',
    'Personalized suggestions'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms',
    'Request Rate: 40k req/s',
    'Dataset Size: 100M unique queries',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for suggest queries and related searches',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for suggest queries and related searches',
      },
      {
        type: 'cache',
        reason: 'Need Suggestion Cache (cache) for suggest queries and related searches',
      },
      {
        type: 'storage',
        reason: 'Need Query Graph (db_primary) for suggest queries and related searches',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Suggestion Cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Suggestion Cache routes to Query Graph',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('search-suggestions', problemConfigs['search-suggestions'], [
    'Suggest related queries',
    'Show trending searches',
    'Correct common mistakes',
    'Personalized suggestions'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * E-commerce Product Search
 * From extracted-problems/system-design/search.md
 */
export const ecommerceSearchProblemDefinition: ProblemDefinition = {
  id: 'ecommerce-search',
  title: 'E-commerce Product Search',
  description: `Design an Amazon-scale product search handling 1M searches/sec across 10B+ products globally. Must return results in <50ms P99 with deep personalization, survive entire region failures, handle Prime Day spikes (10M searches/sec), and operate within $100M/month budget. Support 100+ languages, visual search, voice search, and real-time inventory-aware ranking while serving 500M+ daily active users.
- Search 10B+ products in <50ms P99 latency
- Handle 1M searches/sec (10M during Prime Day)
- Deep personalization for 500M+ users
- Visual search with computer vision`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Search 10B+ products in <50ms P99 latency',
    'Handle 1M searches/sec (10M during Prime Day)',
    'Deep personalization for 500M+ users',
    'Visual search with computer vision',
    'Voice search with NLP understanding',
    'Real-time inventory and pricing in results',
    'Support 100+ languages and currencies',
    'ML-based query understanding and expansion'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms, P99.9 < 100ms even during spikes',
    'Request Rate: 1M searches/sec normal, 10M during Prime Day',
    'Dataset Size: 10B products, 500M user profiles, 100TB indexes',
    'Availability: 99.99% uptime with region failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Shoppers (redirect_client) for amazon-scale 1m searches/sec globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for amazon-scale 1m searches/sec globally',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for amazon-scale 1m searches/sec globally',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for amazon-scale 1m searches/sec globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Shoppers routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Search Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Search Service routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Search Service routes to Elasticsearch',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Search Service routes to ML Ranker',
      },
      {
        from: 'storage',
        to: 'storage',
        reason: 'Elasticsearch routes to Product DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('ecommerce-search', problemConfigs['ecommerce-search'], [
    'Search 10B+ products in <50ms P99 latency',
    'Handle 1M searches/sec (10M during Prime Day)',
    'Deep personalization for 500M+ users',
    'Visual search with computer vision',
    'Voice search with NLP understanding',
    'Real-time inventory and pricing in results',
    'Support 100+ languages and currencies',
    'ML-based query understanding and expansion'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Multilingual Search Engine
 * From extracted-problems/system-design/search.md
 */
export const multilingualSearchProblemDefinition: ProblemDefinition = {
  id: 'multilingual-search',
  title: 'Multilingual Search Engine',
  description: `Design a search engine that handles multiple languages with language-specific analyzers, stemming, and stopwords.
- Detect query language
- Language-specific analyzers
- Cross-language search
- Handle CJK languages`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Detect query language',
    'Language-specific analyzers',
    'Cross-language search',
    'Handle CJK languages'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms',
    'Request Rate: 25k req/s',
    'Dataset Size: 50M documents, 20 languages',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search across 20+ languages',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search across 20+ languages',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Lang Detect',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES Multi',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('multilingual-search', problemConfigs['multilingual-search'], [
    'Detect query language',
    'Language-specific analyzers',
    'Cross-language search',
    'Handle CJK languages'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Search Analytics & Query Logs
 * From extracted-problems/system-design/search.md
 */
export const searchAnalyticsProblemDefinition: ProblemDefinition = {
  id: 'search-analytics',
  title: 'Search Analytics & Query Logs',
  description: `Design a search analytics system that tracks queries, click-through rates, zero-result searches, and latency metrics.
- Log all queries
- Track CTR per query
- Detect zero-result queries
- Measure latency percentiles`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Log all queries',
    'Track CTR per query',
    'Detect zero-result queries',
    'Measure latency percentiles',
    'Popular search trends'
  ],
  userFacingNFRs: [
    'Latency: Logging adds < 5ms overhead',
    'Request Rate: 30k search req/s, 30k log writes/s',
    'Dataset Size: 1B query logs/month',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for track search behavior and failures',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for track search behavior and failures',
      },
      {
        type: 'message_queue',
        reason: 'Need Query Logs (stream) for track search behavior and failures',
      },
      {
        type: 'storage',
        reason: 'Need Analytics DB (db_primary) for track search behavior and failures',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Query Logs',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Query Logs routes to Aggregator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Aggregator routes to Analytics DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('search-analytics', problemConfigs['search-analytics'], [
    'Log all queries',
    'Track CTR per query',
    'Detect zero-result queries',
    'Measure latency percentiles',
    'Popular search trends'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Personalized Search Results
 * From extracted-problems/system-design/search.md
 */
export const personalizedSearchProblemDefinition: ProblemDefinition = {
  id: 'personalized-search',
  title: 'Personalized Search Results',
  description: `Design a personalized search system that re-ranks results based on user browsing history, purchases, and preferences.
- Track user interactions
- Build user profiles
- Re-rank with preferences
- Privacy-preserving personalization`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Track user interactions',
    'Build user profiles',
    'Re-rank with preferences',
    'Privacy-preserving personalization'
  ],
  userFacingNFRs: [
    'Latency: P95 < 200ms with personalization',
    'Request Rate: 20k req/s',
    'Dataset Size: 100M users, 10M products',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for customize results per user preferences',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for customize results per user preferences',
      },
      {
        type: 'cache',
        reason: 'Need Profile Cache (cache) for customize results per user preferences',
      },
      {
        type: 'storage',
        reason: 'Need User Profiles (db_primary) for customize results per user preferences',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to ES',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ES routes to Reranker',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Profile Cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'Profile Cache routes to User Profiles',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Reranker routes to User Profiles',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('personalized-search', problemConfigs['personalized-search'], [
    'Track user interactions',
    'Build user profiles',
    'Re-rank with preferences',
    'Privacy-preserving personalization'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Voice Search with Speech Recognition
 * From extracted-problems/system-design/search.md
 */
export const voiceSearchProblemDefinition: ProblemDefinition = {
  id: 'voice-search',
  title: 'Voice Search with Speech Recognition',
  description: `Design a voice search system with speech-to-text conversion, noise handling, and natural language understanding.
- Speech-to-text conversion
- Handle accents and dialects
- Noise cancellation
- Intent recognition`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Speech-to-text conversion',
    'Handle accents and dialects',
    'Noise cancellation',
    'Intent recognition'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1s including transcription',
    'Request Rate: 10k req/s',
    'Dataset Size: 50M voice queries/month',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search by voice commands',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search by voice commands',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Whisper STT',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Whisper STT routes to NLU',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'NLU routes to ES',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('voice-search', problemConfigs['voice-search'], [
    'Speech-to-text conversion',
    'Handle accents and dialects',
    'Noise cancellation',
    'Intent recognition'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Image Search with Computer Vision
 * From extracted-problems/system-design/search.md
 */
export const imageSearchProblemDefinition: ProblemDefinition = {
  id: 'image-search',
  title: 'Image Search with Computer Vision',
  description: `Design a Google Images-scale visual search system handling 100M searches/sec across 10B+ images globally. Must perform visual similarity search in <100ms using CLIP/Vision Transformers, handle viral memes (10x spikes), survive GPU datacenter failures, and operate within $200M/month budget. Support reverse image search, multi-modal queries, real-time image understanding, and face/object detection while maintaining >90% precision.
- Search 10B+ images with 100M queries/sec
- Visual similarity using CLIP/Vision Transformers
- Reverse image search with <100ms latency
- Multi-modal search (text + image + video)`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Search 10B+ images with 100M queries/sec',
    'Visual similarity using CLIP/Vision Transformers',
    'Reverse image search with <100ms latency',
    'Multi-modal search (text + image + video)',
    'Real-time object/face/scene detection',
    'Support image generation queries',
    'Content moderation and safety filters',
    'Cross-platform image deduplication'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms visual search, <200ms multi-modal',
    'Request Rate: 100M searches/sec, 1B during viral events',
    'Dataset Size: 10B images, 100TB embeddings, 1PB raw data',
    'Availability: 99.99% uptime with GPU failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for google images-scale 10b images/100m qps',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for google images-scale 10b images/100m qps',
      },
      {
        type: 'cache',
        reason: 'Need Embedding Cache (cache) for google images-scale 10b images/100m qps',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Images (object_store) for google images-scale 10b images/100m qps',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to CLIP Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Embedding Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'CLIP Service routes to FAISS',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'FAISS routes to S3 Images',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('image-search', problemConfigs['image-search'], [
    'Search 10B+ images with 100M queries/sec',
    'Visual similarity using CLIP/Vision Transformers',
    'Reverse image search with <100ms latency',
    'Multi-modal search (text + image + video)',
    'Real-time object/face/scene detection',
    'Support image generation queries',
    'Content moderation and safety filters',
    'Cross-platform image deduplication'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-Time Search Indexing Pipeline
 * From extracted-problems/system-design/search.md
 */
export const realtimeIndexingProblemDefinition: ProblemDefinition = {
  id: 'realtime-indexing',
  title: 'Real-Time Search Indexing Pipeline',
  description: `Design a real-time indexing pipeline that makes new content searchable within 1 second of creation.
- Sub-second indexing latency
- Handle write bursts
- Maintain search availability during indexing
- Incremental index updates`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Sub-second indexing latency',
    'Handle write bursts',
    'Maintain search availability during indexing',
    'Incremental index updates'
  ],
  userFacingNFRs: [
    'Latency: Indexing < 1s, Search P95 < 100ms',
    'Request Rate: 100k writes/s, 50k searches/s',
    'Dataset Size: 500M documents',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Writers (redirect_client) for index updates visible in <1s',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for index updates visible in <1s',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for index updates visible in <1s',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Writers routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to Indexers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Indexers routes to ES',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Searchers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Search API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Search API routes to ES',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('realtime-indexing', problemConfigs['realtime-indexing'], [
    'Sub-second indexing latency',
    'Handle write bursts',
    'Maintain search availability during indexing',
    'Incremental index updates'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Federated Multi-Source Search
 * From extracted-problems/system-design/search.md
 */
export const federatedSearchProblemDefinition: ProblemDefinition = {
  id: 'federated-search',
  title: 'Federated Multi-Source Search',
  description: `Design a federated search system that queries multiple data sources (SQL, NoSQL, files) and merges results intelligently.
- Query multiple sources in parallel
- Merge and deduplicate results
- Unified ranking across sources
- Handle partial failures`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Query multiple sources in parallel',
    'Merge and deduplicate results',
    'Unified ranking across sources',
    'Handle partial failures'
  ],
  userFacingNFRs: [
    'Latency: P95 < 500ms querying 5 sources',
    'Request Rate: 8k req/s',
    'Dataset Size: 100M docs across 10 sources',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search across disparate systems',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search across disparate systems',
      },
      {
        type: 'storage',
        reason: 'Need SQL DB (db_primary) for search across disparate systems',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Files (object_store) for search across disparate systems',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Federation API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Federation API routes to ES Docs',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Federation API routes to SQL DB',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Federation API routes to S3 Files',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ES Docs routes to Result Merger',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'SQL DB routes to Result Merger',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'S3 Files routes to Result Merger',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('federated-search', problemConfigs['federated-search'], [
    'Query multiple sources in parallel',
    'Merge and deduplicate results',
    'Unified ranking across sources',
    'Handle partial failures'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Log Search & Analytics (Splunk-like)
 * From extracted-problems/system-design/search.md
 */
export const logSearchProblemDefinition: ProblemDefinition = {
  id: 'log-search',
  title: 'Log Search & Analytics (Splunk-like)',
  description: `Design a Google Cloud Logging-scale platform ingesting 100M events/sec from millions of services globally. Must search 100PB of logs in <1 second, handle security incident investigations (scanning years of data), survive entire region failures, and operate within $300M/month budget. Support real-time anomaly detection, ML-based pattern recognition, and compliance with 10-year retention while serving Fortune 500 enterprises.
- Ingest 100M events/sec from 1M+ microservices
- Search 100PB logs with <1s latency
- Real-time anomaly detection with ML
- Complex aggregations across years of data`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest 100M events/sec from 1M+ microservices',
    'Search 100PB logs with <1s latency',
    'Real-time anomaly detection with ML',
    'Complex aggregations across years of data',
    'Security forensics with pattern matching',
    'Compliance with 10-year retention policies',
    'Multi-tenant isolation for 10k+ enterprises',
    'Automated incident root cause analysis'
  ],
  userFacingNFRs: [
    'Latency: P99 < 1s for day queries, < 10s for year queries',
    'Request Rate: 100M events/sec ingestion, 100k queries/sec',
    'Dataset Size: 100PB hot storage, 1EB total with archives',
    'Availability: 99.999% for ingestion, 99.99% for search'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Agents (redirect_client) for google cloud logging-scale 100m events/sec',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for google cloud logging-scale 100m events/sec',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Cold (90d) (object_store) for google cloud logging-scale 100m events/sec',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for google cloud logging-scale 100m events/sec',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Agents routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to Parsers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Parsers routes to ES Hot (7d)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Parsers routes to ES Warm (30d)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'ES Warm (30d) routes to S3 Cold (90d)',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Query API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Query API routes to ES Hot (7d)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Query API routes to ES Warm (30d)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Query API routes to S3 Cold (90d)',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('log-search', problemConfigs['log-search'], [
    'Ingest 100M events/sec from 1M+ microservices',
    'Search 100PB logs with <1s latency',
    'Real-time anomaly detection with ML',
    'Complex aggregations across years of data',
    'Security forensics with pattern matching',
    'Compliance with 10-year retention policies',
    'Multi-tenant isolation for 10k+ enterprises',
    'Automated incident root cause analysis'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Code Search Engine (GitHub-like)
 * From extracted-problems/system-design/search.md
 */
export const codeSearchProblemDefinition: ProblemDefinition = {
  id: 'code-search',
  title: 'Code Search Engine (GitHub-like)',
  description: `Design a GitHub/Google Code Search-scale engine indexing 1B+ repositories with 100T+ lines of code. Must search in <100ms with semantic understanding using CodeBERT, handle 100M searches/sec, survive datacenter failures, and operate within $400M/month budget. Support 500+ programming languages, real-time indexing of commits, cross-repository dependency analysis, and AI-powered code suggestions while serving 100M+ developers globally.
- Index 1B+ repos with 100T+ lines of code
- Process 100M code searches/sec globally
- Semantic search using CodeBERT/Codex models
- Support 500+ programming languages`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Index 1B+ repos with 100T+ lines of code',
    'Process 100M code searches/sec globally',
    'Semantic search using CodeBERT/Codex models',
    'Support 500+ programming languages',
    'Real-time indexing of 1M+ commits/minute',
    'Cross-repo dependency and vulnerability scanning',
    'AI-powered code completion and suggestions',
    'Git history and blame integration at scale'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms symbol search, < 200ms semantic',
    'Request Rate: 100M searches/sec, 1B during launches',
    'Dataset Size: 1B repos, 100T lines, 10PB indexes',
    'Availability: 99.99% uptime with instant failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Devs (redirect_client) for github-scale 1b repos/100m searches/sec',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for github-scale 1b repos/100m searches/sec',
      },
      {
        type: 'cache',
        reason: 'Need AST Cache (cache) for github-scale 1b repos/100m searches/sec',
      },
      {
        type: 'storage',
        reason: 'Need Repo Metadata (db_primary) for github-scale 1b repos/100m searches/sec',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Devs routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to AST Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Tree-sitter',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tree-sitter routes to Code Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Code Index routes to Repo Metadata',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('code-search', problemConfigs['code-search'], [
    'Index 1B+ repos with 100T+ lines of code',
    'Process 100M code searches/sec globally',
    'Semantic search using CodeBERT/Codex models',
    'Support 500+ programming languages',
    'Real-time indexing of 1M+ commits/minute',
    'Cross-repo dependency and vulnerability scanning',
    'AI-powered code completion and suggestions',
    'Git history and blame integration at scale'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Hybrid Search (Lexical + Vector)
 * From extracted-problems/system-design/search.md
 */
export const hybridSearchProblemDefinition: ProblemDefinition = {
  id: 'hybrid-search',
  title: 'Hybrid Search (Lexical + Vector)',
  description: `Design a hybrid search combining traditional keyword search (BM25) with vector semantic search, using reciprocal rank fusion for result merging.
- BM25 keyword scoring
- Vector embedding search
- Reciprocal rank fusion (RRF)
- Query rewriting with LLM`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'BM25 keyword scoring',
    'Vector embedding search',
    'Reciprocal rank fusion (RRF)',
    'Query rewriting with LLM',
    'Hybrid ranking tuning'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms',
    'Request Rate: 30k req/s',
    'Dataset Size: 10M documents with embeddings',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for combine keyword and semantic search',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for combine keyword and semantic search',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to BM25 Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Vector Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'BM25 Index routes to RRF Merger',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Vector Index routes to RRF Merger',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('hybrid-search', problemConfigs['hybrid-search'], [
    'BM25 keyword scoring',
    'Vector embedding search',
    'Reciprocal rank fusion (RRF)',
    'Query rewriting with LLM',
    'Hybrid ranking tuning'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Video Content Search (YouTube-like)
 * From extracted-problems/system-design/search.md
 */
export const videoSearchProblemDefinition: ProblemDefinition = {
  id: 'video-search',
  title: 'Video Content Search (YouTube-like)',
  description: `Design a video search system that indexes transcripts, visual frames, and metadata to find specific moments in videos.
- Transcript search with timestamps
- Visual scene search
- Face recognition
- Object detection in frames`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Transcript search with timestamps',
    'Visual scene search',
    'Face recognition',
    'Object detection in frames',
    'Chapter/timestamp navigation'
  ],
  userFacingNFRs: [
    'Latency: P95 < 300ms',
    'Request Rate: 100k req/s',
    'Dataset Size: 1B videos, 100PB storage',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search video transcripts and visual content',
      },
      {
        type: 'cdn',
        reason: 'Need CDN (cdn) for search video transcripts and visual content',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search video transcripts and visual content',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Videos (object_store) for search video transcripts and visual content',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Users routes to CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'CDN routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Whisper STT',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to CLIP Vision',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Whisper STT routes to Video Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'CLIP Vision routes to Video Index',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Video Index routes to S3 Videos',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('video-search', problemConfigs['video-search'], [
    'Transcript search with timestamps',
    'Visual scene search',
    'Face recognition',
    'Object detection in frames',
    'Chapter/timestamp navigation'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Security Event Search (SIEM)
 * From extracted-problems/system-design/search.md
 */
export const securityEventSearchProblemDefinition: ProblemDefinition = {
  id: 'security-event-search',
  title: 'Security Event Search (SIEM)',
  description: `Design a Security Information and Event Management (SIEM) system for threat detection across millions of security events.
- Ingest firewall, IDS, auth logs
- Correlation rules across sources
- Anomaly detection
- Threat intelligence enrichment`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest firewall, IDS, auth logs',
    'Correlation rules across sources',
    'Anomaly detection',
    'Threat intelligence enrichment',
    'Real-time alerting'
  ],
  userFacingNFRs: [
    'Latency: Alerting < 10s, Search P95 < 1s',
    'Request Rate: 500k events/s',
    'Dataset Size: 100TB/month',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Logs (redirect_client) for detect threats in security logs',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for detect threats in security logs',
      },
      {
        type: 'storage',
        reason: 'Need Threat Intel (db_primary) for detect threats in security logs',
      },
      {
        type: 'cache',
        reason: 'Need Rule Cache (cache) for detect threats in security logs',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Logs routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to Normalizers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Normalizers routes to Correlation',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Correlation routes to Event Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Correlation routes to Threat Intel',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Correlation routes to Rule Cache',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('security-event-search', problemConfigs['security-event-search'], [
    'Ingest firewall, IDS, auth logs',
    'Correlation rules across sources',
    'Anomaly detection',
    'Threat intelligence enrichment',
    'Real-time alerting'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * HIPAA-Compliant Medical Record Search
 * From extracted-problems/system-design/search.md
 */
export const medicalRecordSearchProblemDefinition: ProblemDefinition = {
  id: 'medical-record-search',
  title: 'HIPAA-Compliant Medical Record Search',
  description: `Design a medical record search system with field-level encryption, audit logging, and clinical terminology understanding.
- Field-level encryption (PHI)
- Audit all searches
- ICD-10/SNOMED terminology
- De-identified research queries`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Field-level encryption (PHI)',
    'Audit all searches',
    'ICD-10/SNOMED terminology',
    'De-identified research queries',
    'Access control by role'
  ],
  userFacingNFRs: [
    'Latency: P95 < 300ms',
    'Request Rate: 5k req/s',
    'Dataset Size: 500M patient records',
    'Availability: 99.99% uptime, HIPAA compliant'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search patient records securely',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search patient records securely',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log (stream) for search patient records securely',
      },
      {
        type: 'storage',
        reason: 'Need Patient DB (db_primary) for search patient records securely',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API + AuthZ',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API + AuthZ routes to Encryption',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Encryption routes to EMR Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API + AuthZ routes to Audit Log',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'EMR Index routes to Patient DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('medical-record-search', problemConfigs['medical-record-search'], [
    'Field-level encryption (PHI)',
    'Audit all searches',
    'ICD-10/SNOMED terminology',
    'De-identified research queries',
    'Access control by role'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Social Media Search (Twitter-like)
 * From extracted-problems/system-design/search.md
 */
export const socialMediaSearchProblemDefinition: ProblemDefinition = {
  id: 'social-media-search',
  title: 'Social Media Search (Twitter-like)',
  description: `Design a social media search system optimized for recency, hashtags, mentions, and real-time trends.
- Real-time indexing (<5s)
- Hashtag and mention search
- Trending topic detection
- User search`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Real-time indexing (<5s)',
    'Hashtag and mention search',
    'Trending topic detection',
    'User search',
    'Time-decay ranking'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 200k req/s',
    'Dataset Size: 500B posts, 1B users',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search billions of posts with recency bias',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search billions of posts with recency bias',
      },
      {
        type: 'message_queue',
        reason: 'Need Post Stream (stream) for search billions of posts with recency bias',
      },
      {
        type: 'cache',
        reason: 'Need Trend Cache (cache) for search billions of posts with recency bias',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'API routes to Post Stream',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Post Stream routes to Indexers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Indexers routes to Recent (7d)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Indexers routes to Historical',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Recent (7d)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Historical',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Trend Cache',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('social-media-search', problemConfigs['social-media-search'], [
    'Real-time indexing (<5s)',
    'Hashtag and mention search',
    'Trending topic detection',
    'User search',
    'Time-decay ranking'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * AI-Powered Semantic Search
 * From extracted-problems/system-design/search.md
 */
export const semanticSearchPlatformProblemDefinition: ProblemDefinition = {
  id: 'semantic-search-platform',
  title: 'AI-Powered Semantic Search',
  description: `Design a Google-scale semantic search platform processing 100M queries/sec across 100B+ documents using state-of-the-art LLMs. Must generate embeddings in <10ms, perform billion-scale vector search in <50ms, survive GPU cluster failures, and operate within $500M/month budget. Support GPT-4 level understanding, 200+ languages, multi-modal search (text/image/video), and continuous learning from 1B+ daily user interactions.
- Process 100M semantic searches/sec globally
- Index 100B+ documents with 2048-dim embeddings
- GPT-4/PaLM-level query understanding
- Multi-modal search across text/image/video/audio`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 100M semantic searches/sec globally',
    'Index 100B+ documents with 2048-dim embeddings',
    'GPT-4/PaLM-level query understanding',
    'Multi-modal search across text/image/video/audio',
    'Support 200+ languages with cross-lingual search',
    'Real-time re-ranking with 100+ signals',
    'Continuous learning from 1B+ daily interactions',
    'Explainable AI with attribution and confidence'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms end-to-end, <10ms embedding generation',
    'Request Rate: 100M searches/sec, 1B during major events',
    'Dataset Size: 100B docs, 1PB embeddings, 100TB models',
    'Availability: 99.999% uptime with automatic GPU failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Search Queries (redirect_client) for google-scale 100m semantic searches/sec',
      },
      {
        type: 'load_balancer',
        reason: 'Need API Gateway (lb) for google-scale 100m semantic searches/sec',
      },
      {
        type: 'cache',
        reason: 'Need Embedding Cache (cache) for google-scale 100m semantic searches/sec',
      },
      {
        type: 'storage',
        reason: 'Need Document Store (db_primary) for google-scale 100m semantic searches/sec',
      },
      {
        type: 'message_queue',
        reason: 'Need Feedback Stream (stream) for google-scale 100m semantic searches/sec',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Search Queries routes to API Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Search API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Search API routes to Embedding Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Search API routes to Embedding Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Embedding Service routes to Vector Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Vector Index routes to Re-ranker GPUs',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Re-ranker GPUs routes to Document Store',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Search API routes to Feedback Stream',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Feedback Stream routes to Training Queue',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('semantic-search-platform', problemConfigs['semantic-search-platform'], [
    'Process 100M semantic searches/sec globally',
    'Index 100B+ documents with 2048-dim embeddings',
    'GPT-4/PaLM-level query understanding',
    'Multi-modal search across text/image/video/audio',
    'Support 200+ languages with cross-lingual search',
    'Real-time re-ranking with 100+ signals',
    'Continuous learning from 1B+ daily interactions',
    'Explainable AI with attribution and confidence'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Job Search Engine (Indeed/LinkedIn)
 * From extracted-problems/system-design/search.md
 */
export const jobSearchProblemDefinition: ProblemDefinition = {
  id: 'job-search',
  title: 'Job Search Engine (Indeed/LinkedIn)',
  description: `Design a job search platform matching candidates to jobs using skills, location, and salary filters with ML ranking.
- Search by skills/title
- Location radius filter
- Salary range filter
- Experience level`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Search by skills/title',
    'Location radius filter',
    'Salary range filter',
    'Experience level',
    'ML relevance ranking'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms',
    'Request Rate: 50k req/s',
    'Dataset Size: 100M jobs, 500M candidates',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for match candidates to jobs with ml',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for match candidates to jobs with ml',
      },
      {
        type: 'cache',
        reason: 'Need Result Cache (cache) for match candidates to jobs with ml',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Job Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Job Index routes to ML Ranker',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Result Cache',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('job-search', problemConfigs['job-search'], [
    'Search by skills/title',
    'Location radius filter',
    'Salary range filter',
    'Experience level',
    'ML relevance ranking'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Travel Search Engine (Kayak/Expedia)
 * From extracted-problems/system-design/search.md
 */
export const travelSearchProblemDefinition: ProblemDefinition = {
  id: 'travel-search',
  title: 'Travel Search Engine (Kayak/Expedia)',
  description: `Design a travel search aggregating flights/hotels with date ranges, multi-leg trips, and price sorting.
- Multi-leg flight search
- Flexible date ranges
- Price + duration sorting
- Airline/hotel filters`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Multi-leg flight search',
    'Flexible date ranges',
    'Price + duration sorting',
    'Airline/hotel filters',
    'Real-time price updates'
  ],
  userFacingNFRs: [
    'Latency: P95 < 2s aggregating 100 providers',
    'Request Rate: 30k req/s',
    'Dataset Size: 10M daily price updates',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search flights and hotels with complex filters',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search flights and hotels with complex filters',
      },
      {
        type: 'cache',
        reason: 'Need Route Cache (cache) for search flights and hotels with complex filters',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Route Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Aggregators',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Aggregators routes to Price Index',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('travel-search', problemConfigs['travel-search'], [
    'Multi-leg flight search',
    'Flexible date ranges',
    'Price + duration sorting',
    'Airline/hotel filters',
    'Real-time price updates'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Academic Paper Search (Google Scholar)
 * From extracted-problems/system-design/search.md
 */
export const academicPaperSearchProblemDefinition: ProblemDefinition = {
  id: 'academic-paper-search',
  title: 'Academic Paper Search (Google Scholar)',
  description: `Design an academic search engine with citation graph, author profiles, and semantic paper similarity.
- Full-text search
- Citation graph traversal
- Author search
- Topic clustering`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Full-text search',
    'Citation graph traversal',
    'Author search',
    'Topic clustering',
    'Related paper suggestions'
  ],
  userFacingNFRs: [
    'Latency: P95 < 300ms',
    'Request Rate: 15k req/s',
    'Dataset Size: 200M papers, 2B citations',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search scholarly articles with citations',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search scholarly articles with citations',
      },
      {
        type: 'storage',
        reason: 'Need Citation Graph (db_primary) for search scholarly articles with citations',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Paper Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Paper Index routes to Citation Graph',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to PageRank',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('academic-paper-search', problemConfigs['academic-paper-search'], [
    'Full-text search',
    'Citation graph traversal',
    'Author search',
    'Topic clustering',
    'Related paper suggestions'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Recipe Search with Ingredients
 * From extracted-problems/system-design/search.md
 */
export const recipeSearchProblemDefinition: ProblemDefinition = {
  id: 'recipe-search',
  title: 'Recipe Search with Ingredients',
  description: `Design a recipe search allowing users to find recipes based on ingredients they have, dietary restrictions, and cooking time.
- Ingredient-based search
- Dietary filter (vegan, gluten-free)
- Cook time filter
- Nutrition info`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingredient-based search',
    'Dietary filter (vegan, gluten-free)',
    'Cook time filter',
    'Nutrition info',
    'User ratings'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 10k req/s',
    'Dataset Size: 5M recipes',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for find recipes by available ingredients',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for find recipes by available ingredients',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Recipe Index',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('recipe-search', problemConfigs['recipe-search'], [
    'Ingredient-based search',
    'Dietary filter (vegan, gluten-free)',
    'Cook time filter',
    'Nutrition info',
    'User ratings'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Legal Document Search
 * From extracted-problems/system-design/search.md
 */
export const legalDocSearchProblemDefinition: ProblemDefinition = {
  id: 'legal-doc-search',
  title: 'Legal Document Search',
  description: `Design a legal document search with citation analysis, jurisdiction filters, and case similarity matching.
- Full-text legal search
- Citation linking
- Jurisdiction filter
- Date range queries`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Full-text legal search',
    'Citation linking',
    'Jurisdiction filter',
    'Date range queries',
    'Shepardize (track case history)'
  ],
  userFacingNFRs: [
    'Latency: P95 < 500ms',
    'Request Rate: 5k req/s',
    'Dataset Size: 50M court opinions, 100M citations',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search case law and statutes',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search case law and statutes',
      },
      {
        type: 'storage',
        reason: 'Need Citation DB (db_primary) for search case law and statutes',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Case Index',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Case Index routes to Citation DB',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('legal-doc-search', problemConfigs['legal-doc-search'], [
    'Full-text legal search',
    'Citation linking',
    'Jurisdiction filter',
    'Date range queries',
    'Shepardize (track case history)'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * News Article Search with Clustering
 * From extracted-problems/system-design/search.md
 */
export const newsSearchProblemDefinition: ProblemDefinition = {
  id: 'news-search',
  title: 'News Article Search with Clustering',
  description: `Design a news search engine that clusters similar articles into stories and ranks by recency and relevance.
- Real-time article indexing
- Story clustering
- Entity extraction (people, places)
- Topic categorization`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Real-time article indexing',
    'Story clustering',
    'Entity extraction (people, places)',
    'Topic categorization',
    'Recency-weighted ranking'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 40k req/s',
    'Dataset Size: 500M articles, 10k new/hour',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search news with story clustering',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search news with story clustering',
      },
      {
        type: 'message_queue',
        reason: 'Need Article Stream (stream) for search news with story clustering',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Article Index',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Article Stream routes to Clustering',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Clustering routes to Article Index',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('news-search', problemConfigs['news-search'], [
    'Real-time article indexing',
    'Story clustering',
    'Entity extraction (people, places)',
    'Topic categorization',
    'Recency-weighted ranking'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Music Search (Spotify/Apple Music)
 * From extracted-problems/system-design/search.md
 */
export const musicSearchProblemDefinition: ProblemDefinition = {
  id: 'music-search',
  title: 'Music Search (Spotify/Apple Music)',
  description: `Design a music search with artist/song/album search, audio feature filters (tempo, key), and playlist search.
- Search songs, artists, albums
- Audio feature filters
- Lyrics search
- Genre/mood filters`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Search songs, artists, albums',
    'Audio feature filters',
    'Lyrics search',
    'Genre/mood filters',
    'Playlist search'
  ],
  userFacingNFRs: [
    'Latency: P95 < 80ms',
    'Request Rate: 100k req/s',
    'Dataset Size: 100M tracks, 10M artists',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search songs, artists, albums',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search songs, artists, albums',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for search songs, artists, albums',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Music Index',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('music-search', problemConfigs['music-search'], [
    'Search songs, artists, albums',
    'Audio feature filters',
    'Lyrics search',
    'Genre/mood filters',
    'Playlist search'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * App Store Search & Discovery
 * From extracted-problems/system-design/search.md
 */
export const appStoreSearchProblemDefinition: ProblemDefinition = {
  id: 'app-store-search',
  title: 'App Store Search & Discovery',
  description: `Design an app store search with category browse, keyword optimization (ASO), and download-based ranking.
- Keyword search
- Category filters
- Rating/download sorting
- App icon/screenshot display`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Keyword search',
    'Category filters',
    'Rating/download sorting',
    'App icon/screenshot display',
    'Similar app recommendations'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms',
    'Request Rate: 80k req/s',
    'Dataset Size: 5M apps',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search mobile apps with ranking',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search mobile apps with ranking',
      },
      {
        type: 'cache',
        reason: 'Need Top Apps Cache (cache) for search mobile apps with ranking',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to Top Apps Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to App Index',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('app-store-search', problemConfigs['app-store-search'], [
    'Keyword search',
    'Category filters',
    'Rating/download sorting',
    'App icon/screenshot display',
    'Similar app recommendations'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Collaborative Document Search (Google Drive)
 * From extracted-problems/system-design/search.md
 */
export const documentCollabSearchProblemDefinition: ProblemDefinition = {
  id: 'document-collab-search',
  title: 'Collaborative Document Search (Google Drive)',
  description: `Design a document search for collaborative workspace with permission filtering, version search, and shared folder navigation.
- Permission-aware search
- Full-text in docs/PDFs
- Search by owner/editor
- Recent activity boost`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Permission-aware search',
    'Full-text in docs/PDFs',
    'Search by owner/editor',
    'Recent activity boost',
    'Folder hierarchy'
  ],
  userFacingNFRs: [
    'Latency: P95 < 150ms including ACL check',
    'Request Rate: 50k req/s',
    'Dataset Size: 10B documents',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for search shared documents with permissions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for search shared documents with permissions',
      },
      {
        type: 'cache',
        reason: 'Need ACL Cache (cache) for search shared documents with permissions',
      },
      {
        type: 'storage',
        reason: 'Need Permissions (db_primary) for search shared documents with permissions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API routes to ACL Cache',
      },
      {
        from: 'cache',
        to: 'compute',
        reason: 'ACL Cache routes to Permissions',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API routes to Doc Index',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Doc Index routes to Permissions',
      }
    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('document-collab-search', problemConfigs['document-collab-search'], [
    'Permission-aware search',
    'Full-text in docs/PDFs',
    'Search by owner/editor',
    'Recent activity boost',
    'Folder hierarchy'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

