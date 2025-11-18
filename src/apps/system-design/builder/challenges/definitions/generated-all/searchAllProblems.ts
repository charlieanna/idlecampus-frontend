import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def index_text_documents(**kwargs) -> Dict:
    """
    FR-1: Index text documents
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Search by keywords
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def support_and_or_operators(**kwargs) -> Dict:
    """
    FR-3: Support AND/OR operators
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rank_results_by_relevance(**kwargs) -> Dict:
    """
    FR-4: Rank results by relevance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def highlight_matching_terms(**kwargs) -> Dict:
    """
    FR-5: Highlight matching terms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
users = {}
items = {}
memory = {}
real = {}

def suggest_completions_for_partial_queries(**kwargs) -> Dict:
    """
    FR-1: Suggest completions for partial queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rank_by_popularity_and_recency(**kwargs) -> Dict:
    """
    FR-2: Rank by popularity and recency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_fuzzy_matching_for_typos(**kwargs) -> Dict:
    """
    FR-3: Support fuzzy matching for typos
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def personalize_based_on_user_history(**kwargs) -> Dict:
    """
    FR-4: Personalize based on user history
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Update suggestions in real-time
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
events = {}
memory = {}

def filter_by_multiple_attributes(**kwargs) -> Dict:
    """
    FR-1: Filter by multiple attributes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-2: Show facet counts
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]

def support_range_filters(**kwargs) -> Dict:
    """
    FR-3: Support range filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_empty_results_gracefully(**kwargs) -> Dict:
    """
    FR-4: Handle empty results gracefully
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Search within radius
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def bounding_box_queries(**kwargs) -> Dict:
    """
    FR-2: Bounding box queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def sort_by_distance(**kwargs) -> Dict:
    """
    FR-3: Sort by distance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def filter_by_category(**kwargs) -> Dict:
    """
    FR-4: Filter by category
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def tolerate_1_2_char_errors(**kwargs) -> Dict:
    """
    FR-1: Tolerate 1-2 char errors
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def suggest_corrections(**kwargs) -> Dict:
    """
    FR-2: Suggest corrections
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def phonetic_matching(**kwargs) -> Dict:
    """
    FR-3: Phonetic matching
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_multiple_languages(**kwargs) -> Dict:
    """
    FR-4: Support multiple languages
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def expand_with_synonyms(**kwargs) -> Dict:
    """
    FR-1: Expand with synonyms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def language_specific_synonyms(**kwargs) -> Dict:
    """
    FR-2: Language-specific synonyms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def domain_specific_terms(**kwargs) -> Dict:
    """
    FR-3: Domain-specific terms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def bidirectional_matching(**kwargs) -> Dict:
    """
    FR-4: Bidirectional matching
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def highlight_all_matched_terms(**kwargs) -> Dict:
    """
    FR-1: Highlight all matched terms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def show_context_window(**kwargs) -> Dict:
    """
    FR-2: Show context window
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_multi_word_matches(**kwargs) -> Dict:
    """
    FR-3: Handle multi-word matches
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def html_safe_highlighting(**kwargs) -> Dict:
    """
    FR-4: HTML-safe highlighting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def boost_title_matches_5x(**kwargs) -> Dict:
    """
    FR-1: Boost title matches 5x
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def boost_tags_3x(**kwargs) -> Dict:
    """
    FR-2: Boost tags 3x
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def recency_boosting(**kwargs) -> Dict:
    """
    FR-3: Recency boosting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def popularity_signals(**kwargs) -> Dict:
    """
    FR-4: Popularity signals
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def category_navigation(**kwargs) -> Dict:
    """
    FR-1: Category navigation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def faceted_filters(**kwargs) -> Dict:
    """
    FR-2: Faceted filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Search within category
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def sort_options_price_rating_relevance(**kwargs) -> Dict:
    """
    FR-4: Sort options (price, rating, relevance)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_sell_recommendations(**kwargs) -> Dict:
    """
    FR-5: Cross-sell recommendations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def suggest_related_queries(**kwargs) -> Dict:
    """
    FR-1: Suggest related queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Show trending searches
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def correct_common_mistakes(**kwargs) -> Dict:
    """
    FR-3: Correct common mistakes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def personalized_suggestions(**kwargs) -> Dict:
    """
    FR-4: Personalized suggestions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
users = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Search 10B+ products in <50ms P99 latency
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Handle 1M searches/sec (10M during Prime Day)
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def deep_personalization_for_500m_users(**kwargs) -> Dict:
    """
    FR-3: Deep personalization for 500M+ users
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-4: Visual search with computer vision
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-5: Voice search with NLP understanding
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def real_time_inventory_and_pricing_in_resul(**kwargs) -> Dict:
    """
    FR-6: Real-time inventory and pricing in results
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_100_languages_and_currencies(**kwargs) -> Dict:
    """
    FR-7: Support 100+ languages and currencies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-8: ML-based query understanding and expansion
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def get_item(item_id: str) -> Dict:
    """
    FR-1: Detect query language
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def language_specific_analyzers(**kwargs) -> Dict:
    """
    FR-2: Language-specific analyzers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Cross-language search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def handle_cjk_languages(**kwargs) -> Dict:
    """
    FR-4: Handle CJK languages
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
events = {}
items = {}
results = {}

def log_all_queries(**kwargs) -> Dict:
    """
    FR-1: Log all queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-2: Track CTR per query
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def detect_zero_result_queries(**kwargs) -> Dict:
    """
    FR-3: Detect zero-result queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def measure_latency_percentiles(**kwargs) -> Dict:
    """
    FR-4: Measure latency percentiles
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-5: Popular search trends
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
events = {}
users = {}
memory = {}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Track user interactions
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]

def build_user_profiles(**kwargs) -> Dict:
    """
    FR-2: Build user profiles
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def re_rank_with_preferences(**kwargs) -> Dict:
    """
    FR-3: Re-rank with preferences
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def privacy_preserving_personalization(**kwargs) -> Dict:
    """
    FR-4: Privacy-preserving personalization
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def speech_to_text_conversion(**kwargs) -> Dict:
    """
    FR-1: Speech-to-text conversion
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_accents_and_dialects(**kwargs) -> Dict:
    """
    FR-2: Handle accents and dialects
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def noise_cancellation(**kwargs) -> Dict:
    """
    FR-3: Noise cancellation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def intent_recognition(**kwargs) -> Dict:
    """
    FR-4: Intent recognition
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
posts = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Search 10B+ images with 100M queries/sec
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def visual_similarity_using_clip_vision_tran(**kwargs) -> Dict:
    """
    FR-2: Visual similarity using CLIP/Vision Transformers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Reverse image search with <100ms latency
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-4: Multi-modal search (text + image + video)
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def real_time_object_face_scene_detection(**kwargs) -> Dict:
    """
    FR-5: Real-time object/face/scene detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_image_generation_queries(**kwargs) -> Dict:
    """
    FR-6: Support image generation queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def content_moderation_and_safety_filters(**kwargs) -> Dict:
    """
    FR-7: Content moderation and safety filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_platform_image_deduplication(**kwargs) -> Dict:
    """
    FR-8: Cross-platform image deduplication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
memory = {}
results = {}

def sub_second_indexing_latency(**kwargs) -> Dict:
    """
    FR-1: Sub-second indexing latency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Handle write bursts
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Maintain search availability during indexing
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-4: Incremental index updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
parallel = {}

def get_item(item_id: str) -> Dict:
    """
    FR-1: Query multiple sources in parallel
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def merge_and_deduplicate_results(**kwargs) -> Dict:
    """
    FR-2: Merge and deduplicate results
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def unified_ranking_across_sources(**kwargs) -> Dict:
    """
    FR-3: Unified ranking across sources
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_partial_failures(**kwargs) -> Dict:
    """
    FR-4: Handle partial failures
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
events = {}
items = {}
results = {}

def ingest_100m_events_sec_from_1m_microser(**kwargs) -> Dict:
    """
    FR-1: Ingest 100M events/sec from 1M+ microservices
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Search 100PB logs with <1s latency
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def real_time_anomaly_detection_with_ml(**kwargs) -> Dict:
    """
    FR-3: Real-time anomaly detection with ML
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def complex_aggregations_across_years_of_dat(**kwargs) -> Dict:
    """
    FR-4: Complex aggregations across years of data
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def security_forensics_with_pattern_matching(**kwargs) -> Dict:
    """
    FR-5: Security forensics with pattern matching
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def compliance_with_10_year_retention_polici(**kwargs) -> Dict:
    """
    FR-6: Compliance with 10-year retention policies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def multi_tenant_isolation_for_10k_enterpri(**kwargs) -> Dict:
    """
    FR-7: Multi-tenant isolation for 10k+ enterprises
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automated_incident_root_cause_analysis(**kwargs) -> Dict:
    """
    FR-8: Automated incident root cause analysis
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def index_1b_repos_with_100t_lines_of_code(**kwargs) -> Dict:
    """
    FR-1: Index 1B+ repos with 100T+ lines of code
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Process 100M code searches/sec globally
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Semantic search using CodeBERT/Codex models
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def support_500_programming_languages(**kwargs) -> Dict:
    """
    FR-4: Support 500+ programming languages
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_indexing_of_1m_commits_minute(**kwargs) -> Dict:
    """
    FR-5: Real-time indexing of 1M+ commits/minute
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cross_repo_dependency_and_vulnerability(**kwargs) -> Dict:
    """
    FR-6: Cross-repo dependency and vulnerability scanning
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ai_powered_code_completion_and_suggestio(**kwargs) -> Dict:
    """
    FR-7: AI-powered code completion and suggestions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def git_history_and_blame_integration_at_sca(**kwargs) -> Dict:
    """
    FR-8: Git history and blame integration at scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def bm25_keyword_scoring(**kwargs) -> Dict:
    """
    FR-1: BM25 keyword scoring
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Vector embedding search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def reciprocal_rank_fusion_rrf(**kwargs) -> Dict:
    """
    FR-3: Reciprocal rank fusion (RRF)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-4: Query rewriting with LLM
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def hybrid_ranking_tuning(**kwargs) -> Dict:
    """
    FR-5: Hybrid ranking tuning
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
frames = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Transcript search with timestamps
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Visual scene search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def face_recognition(**kwargs) -> Dict:
    """
    FR-3: Face recognition
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def object_detection_in_frames(**kwargs) -> Dict:
    """
    FR-4: Object detection in frames
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def chapter_timestamp_navigation(**kwargs) -> Dict:
    """
    FR-5: Chapter/timestamp navigation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}

def ingest_firewall_ids_auth_logs(**kwargs) -> Dict:
    """
    FR-1: Ingest firewall, IDS, auth logs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def correlation_rules_across_sources(**kwargs) -> Dict:
    """
    FR-2: Correlation rules across sources
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def anomaly_detection(**kwargs) -> Dict:
    """
    FR-3: Anomaly detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def threat_intelligence_enrichment(**kwargs) -> Dict:
    """
    FR-4: Threat intelligence enrichment
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_alerting(**kwargs) -> Dict:
    """
    FR-5: Real-time alerting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def field_level_encryption_phi(**kwargs) -> Dict:
    """
    FR-1: Field-level encryption (PHI)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Audit all searches
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def icd_10_snomed_terminology(**kwargs) -> Dict:
    """
    FR-3: ICD-10/SNOMED terminology
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-4: De-identified research queries
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def access_control_by_role(**kwargs) -> Dict:
    """
    FR-5: Access control by role
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
users = {}
items = {}
results = {}

def real_time_indexing_5s(**kwargs) -> Dict:
    """
    FR-1: Real-time indexing (<5s)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-2: Hashtag and mention search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def trending_topic_detection(**kwargs) -> Dict:
    """
    FR-3: Trending topic detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-4: User search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def time_decay_ranking(**kwargs) -> Dict:
    """
    FR-5: Time-decay ranking
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Process 100M semantic searches/sec globally
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def index_100b_documents_with_2048_dim_embe(**kwargs) -> Dict:
    """
    FR-2: Index 100B+ documents with 2048-dim embeddings
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-3: GPT-4/PaLM-level query understanding
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-4: Multi-modal search across text/image/video/audio
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-5: Support 200+ languages with cross-lingual search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def real_time_re_ranking_with_100_signals(**kwargs) -> Dict:
    """
    FR-6: Real-time re-ranking with 100+ signals
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def continuous_learning_from_1b_daily_inter(**kwargs) -> Dict:
    """
    FR-7: Continuous learning from 1B+ daily interactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def explainable_ai_with_attribution_and_conf(**kwargs) -> Dict:
    """
    FR-8: Explainable AI with attribution and confidence
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Search by skills/title
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def location_radius_filter(**kwargs) -> Dict:
    """
    FR-2: Location radius filter
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def salary_range_filter(**kwargs) -> Dict:
    """
    FR-3: Salary range filter
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def experience_level(**kwargs) -> Dict:
    """
    FR-4: Experience level
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ml_relevance_ranking(**kwargs) -> Dict:
    """
    FR-5: ML relevance ranking
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
memory = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Multi-leg flight search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def flexible_date_ranges(**kwargs) -> Dict:
    """
    FR-2: Flexible date ranges
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def price_duration_sorting(**kwargs) -> Dict:
    """
    FR-3: Price + duration sorting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def airline_hotel_filters(**kwargs) -> Dict:
    """
    FR-4: Airline/hotel filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Real-time price updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Full-text search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def citation_graph_traversal(**kwargs) -> Dict:
    """
    FR-2: Citation graph traversal
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Author search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def topic_clustering(**kwargs) -> Dict:
    """
    FR-4: Topic clustering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def related_paper_suggestions(**kwargs) -> Dict:
    """
    FR-5: Related paper suggestions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
users = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Ingredient-based search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def dietary_filter_vegan_gluten_free(**kwargs) -> Dict:
    """
    FR-2: Dietary filter (vegan, gluten-free)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cook_time_filter(**kwargs) -> Dict:
    """
    FR-3: Cook time filter
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def nutrition_info(**kwargs) -> Dict:
    """
    FR-4: Nutrition info
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def user_ratings(**kwargs) -> Dict:
    """
    FR-5: User ratings
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
events = {}
items = {}
memory = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Full-text legal search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def citation_linking(**kwargs) -> Dict:
    """
    FR-2: Citation linking
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def jurisdiction_filter(**kwargs) -> Dict:
    """
    FR-3: Jurisdiction filter
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def date_range_queries(**kwargs) -> Dict:
    """
    FR-4: Date range queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Shepardize (track case history)
    Naive implementation - stores event in memory
    """
    event_id = f"{event_type}_{item_id}_{datetime.now().timestamp()}"
    events[event_id] = {
        'id': event_id,
        'type': event_type,
        'item_id': item_id,
        'metadata': metadata or {},
        'created_at': datetime.now()
    }
    return events[event_id]`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
posts = {}

def real_time_article_indexing(**kwargs) -> Dict:
    """
    FR-1: Real-time article indexing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def story_clustering(**kwargs) -> Dict:
    """
    FR-2: Story clustering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def entity_extraction_people_places(**kwargs) -> Dict:
    """
    FR-3: Entity extraction (people, places)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def topic_categorization(**kwargs) -> Dict:
    """
    FR-4: Topic categorization
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def recency_weighted_ranking(**kwargs) -> Dict:
    """
    FR-5: Recency-weighted ranking
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Search songs, artists, albums
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def audio_feature_filters(**kwargs) -> Dict:
    """
    FR-2: Audio feature filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Lyrics search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def genre_mood_filters(**kwargs) -> Dict:
    """
    FR-4: Genre/mood filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-5: Playlist search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Keyword search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def category_filters(**kwargs) -> Dict:
    """
    FR-2: Category filters
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rating_download_sorting(**kwargs) -> Dict:
    """
    FR-3: Rating/download sorting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def app_icon_screenshot_display(**kwargs) -> Dict:
    """
    FR-4: App icon/screenshot display
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def similar_app_recommendations(**kwargs) -> Dict:
    """
    FR-5: Similar app recommendations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
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
    // Feature-specific validators for each FR
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    // Generic validators
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
docs = {}
results = {}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-1: Permission-aware search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def full_text_in_docs_pdfs(**kwargs) -> Dict:
    """
    FR-2: Full-text in docs/PDFs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-3: Search by owner/editor
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def recent_activity_boost(**kwargs) -> Dict:
    """
    FR-4: Recent activity boost
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def folder_hierarchy(**kwargs) -> Dict:
    """
    FR-5: Folder hierarchy
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

// Auto-generate code challenges from functional requirements
(basicTextSearchProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicTextSearchProblemDefinition);
