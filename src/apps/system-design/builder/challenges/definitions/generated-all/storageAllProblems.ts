import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Storage Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 35 problems
 */

/**
 * Basic RDBMS Design
 * From extracted-problems/system-design/storage.md
 */
export const basicDatabaseDesignProblemDefinition: ProblemDefinition = {
  id: 'basic-database-design',
  title: 'Basic RDBMS Design',
  description: `Design a relational database for a blog platform. Learn about normalization, primary/foreign keys, indexes, and basic query optimization.
- Store users, posts, and comments
- Support tags and categories
- Handle user relationships (followers)
- Enable full-text search on posts`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store users, posts, and comments',
    'Support tags and categories',
    'Handle user relationships (followers)',
    'Enable full-text search on posts',
    'Track view counts and likes'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms for queries',
    'Request Rate: 10k reads/sec, 1k writes/sec',
    'Dataset Size: 1M users, 10M posts',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Blog Users (redirect_client) for design tables for a blog system',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for design tables for a blog system',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for design tables for a blog system',
      },
      {
        type: 'storage',
        reason: 'Need MySQL Primary (db_primary) for design tables for a blog system',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Blog Users routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Blog API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Blog API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Blog API routes to MySQL Primary',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Blog API routes to Read Replicas',
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

  scenarios: generateScenarios('basic-database-design', problemConfigs['basic-database-design'], [
    'Store users, posts, and comments',
    'Support tags and categories',
    'Handle user relationships (followers)',
    'Enable full-text search on posts',
    'Track view counts and likes'
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
messages = {}
posts = {}
reactions = {}
relationships = {}
users = {}
items = {}
memory = {}
results = {}

def create_user(user_id: str, **kwargs) -> Dict:
    """
    FR-1: Store users, posts, and comments
    Naive implementation - stores user in memory
    """
    users[user_id] = {
        'id': user_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return users[user_id]

def support_tags_and_categories(**kwargs) -> Dict:
    """
    FR-2: Support tags and categories
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-3: Handle user relationships (followers)
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-4: Enable full-text search on posts
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def add_reaction(item_id: str, user_id: str, reaction_type: str = 'like') -> Dict:
    """
    FR-5: Track view counts and likes
    Naive implementation - stores reaction in memory
    """
    reaction_id = f"{item_id}_{user_id}"
    reactions[reaction_id] = {
        'item_id': item_id,
        'user_id': user_id,
        'type': reaction_type,
        'created_at': datetime.now()
    }
    return reactions[reaction_id]`,
};

/**
 * NoSQL Document Store
 * From extracted-problems/system-design/storage.md
 */
export const nosqlBasicsProblemDefinition: ProblemDefinition = {
  id: 'nosql-basics',
  title: 'NoSQL Document Store',
  description: `Design a user profile system using MongoDB. Learn about document modeling, embedded vs referenced data, and when to denormalize.
- Store flexible user profiles
- Support nested preferences
- Handle varying field types
- Enable complex queries`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store flexible user profiles',
    'Support nested preferences',
    'Handle varying field types',
    'Enable complex queries',
    'Support schema evolution'
  ],
  userFacingNFRs: [
    'Latency: P95 < 30ms for document reads',
    'Request Rate: 20k ops/sec',
    'Dataset Size: 100M documents, 1KB average',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Profile Service (redirect_client) for flexible schema for user profiles',
      },
      {
        type: 'load_balancer',
        reason: 'Need Load Balancer (lb) for flexible schema for user profiles',
      },
      {
        type: 'storage',
        reason: 'Need MongoDB Shard 1 (db_primary) for flexible schema for user profiles',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Profile Service routes to Load Balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Load Balancer routes to Profile API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Profile API routes to MongoDB Shard 1',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Profile API routes to MongoDB Shard 2',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Profile API routes to Config Servers',
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

  scenarios: generateScenarios('nosql-basics', problemConfigs['nosql-basics'], [
    'Store flexible user profiles',
    'Support nested preferences',
    'Handle varying field types',
    'Enable complex queries',
    'Support schema evolution'
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
memory = {}

def create_user(user_id: str, **kwargs) -> Dict:
    """
    FR-1: Store flexible user profiles
    Naive implementation - stores user in memory
    """
    users[user_id] = {
        'id': user_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return users[user_id]

def support_nested_preferences(**kwargs) -> Dict:
    """
    FR-2: Support nested preferences
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_varying_field_types(**kwargs) -> Dict:
    """
    FR-3: Handle varying field types
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_complex_queries(**kwargs) -> Dict:
    """
    FR-4: Enable complex queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_schema_evolution(**kwargs) -> Dict:
    """
    FR-5: Support schema evolution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Redis-like Key-Value Store
 * From extracted-problems/system-design/storage.md
 */
export const keyValueStoreProblemDefinition: ProblemDefinition = {
  id: 'key-value-store',
  title: 'Redis-like Key-Value Store',
  description: `Design a distributed key-value store like Redis. Learn about data structures, persistence, replication, and cache eviction policies.
- Support GET/SET operations
- Implement LRU eviction
- Handle string, list, set, hash types
- Provide pub/sub messaging`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support GET/SET operations',
    'Implement LRU eviction',
    'Handle string, list, set, hash types',
    'Provide pub/sub messaging',
    'Support TTL expiration'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1ms for cache hits',
    'Request Rate: 100k ops/sec',
    'Dataset Size: 10GB in-memory',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need App Servers (redirect_client) for build a distributed cache',
      },
      {
        type: 'load_balancer',
        reason: 'Need Proxy Layer (lb) for build a distributed cache',
      },
      {
        type: 'cache',
        reason: 'Need Redis Master 1 (cache) for build a distributed cache',
      },
      {
        type: 'storage',
        reason: 'Need RDB Snapshots (db_primary) for build a distributed cache',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'App Servers routes to Proxy Layer',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Proxy Layer routes to Redis Master 1',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Proxy Layer routes to Redis Master 2',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Proxy Layer routes to Redis Master 3',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Master 1 routes to RDB Snapshots',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Master 2 routes to RDB Snapshots',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Master 3 routes to RDB Snapshots',
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

  scenarios: generateScenarios('key-value-store', problemConfigs['key-value-store'], [
    'Support GET/SET operations',
    'Implement LRU eviction',
    'Handle string, list, set, hash types',
    'Provide pub/sub messaging',
    'Support TTL expiration'
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

def get_item(item_id: str) -> Dict:
    """
    FR-1: Support GET/SET operations
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def implement_lru_eviction(**kwargs) -> Dict:
    """
    FR-2: Implement LRU eviction
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_string_list_set_hash_types(**kwargs) -> Dict:
    """
    FR-3: Handle string, list, set, hash types
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_pub_sub_messaging(**kwargs) -> Dict:
    """
    FR-4: Provide pub/sub messaging
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_ttl_expiration(**kwargs) -> Dict:
    """
    FR-5: Support TTL expiration
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Product Catalog Store
 * From extracted-problems/system-design/storage.md
 */
export const productCatalogProblemDefinition: ProblemDefinition = {
  id: 'product-catalog',
  title: 'Product Catalog Store',
  description: `Design a product catalog for e-commerce. Handle hierarchical categories, variants, inventory, and search.
- Store products with variants (size, color)
- Support category hierarchies
- Track inventory per variant
- Enable faceted search`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store products with variants (size, color)',
    'Support category hierarchies',
    'Track inventory per variant',
    'Enable faceted search',
    'Handle product reviews'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for product page',
    'Request Rate: 5k reads/sec, 500 writes/sec',
    'Dataset Size: 1M products, 10M variants',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Shoppers (redirect_client) for e-commerce product database',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for e-commerce product database',
      },
      {
        type: 'cache',
        reason: 'Need Product Cache (cache) for e-commerce product database',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for e-commerce product database',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Shoppers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Catalog API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Catalog API routes to Product Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Catalog API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Catalog API routes to Elasticsearch',
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

  scenarios: generateScenarios('product-catalog', problemConfigs['product-catalog'], [
    'Store products with variants (size, color)',
    'Support category hierarchies',
    'Track inventory per variant',
    'Enable faceted search',
    'Handle product reviews'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store products with variants (size, color)
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_category_hierarchies(**kwargs) -> Dict:
    """
    FR-2: Support category hierarchies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-3: Track inventory per variant
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

def search(query: str, limit: int = 20) -> List[Dict]:
    """
    FR-4: Enable faceted search
    Naive implementation - simple string matching
    """
    results = []
    for item in items.values():
        if query.lower() in str(item).lower():
            results.append(item)
    return results[:limit]

def handle_product_reviews(**kwargs) -> Dict:
    """
    FR-5: Handle product reviews
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Metrics Time-Series DB
 * From extracted-problems/system-design/storage.md
 */
export const timeSeriesMetricsProblemDefinition: ProblemDefinition = {
  id: 'time-series-metrics',
  title: 'Metrics Time-Series DB',
  description: `Design a metrics database for monitoring. Learn about time-series optimization, downsampling, and retention policies.
- Ingest metrics at high rate
- Store with microsecond precision
- Support aggregation queries
- Implement retention policies`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest metrics at high rate',
    'Store with microsecond precision',
    'Support aggregation queries',
    'Implement retention policies',
    'Enable alerting on thresholds'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for writes, < 100ms for queries',
    'Request Rate: 1M metrics/sec ingestion',
    'Dataset Size: 100TB time-series data',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for store application metrics',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for store application metrics',
      },
      {
        type: 'storage',
        reason: 'Need InfluxDB (db_primary) for store application metrics',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Services routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Collector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Collector routes to InfluxDB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Compaction routes to InfluxDB',
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

  scenarios: generateScenarios('time-series-metrics', problemConfigs['time-series-metrics'], [
    'Ingest metrics at high rate',
    'Store with microsecond precision',
    'Support aggregation queries',
    'Implement retention policies',
    'Enable alerting on thresholds'
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

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Ingest metrics at high rate
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Store with microsecond precision
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_aggregation_queries(**kwargs) -> Dict:
    """
    FR-3: Support aggregation queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def implement_retention_policies(**kwargs) -> Dict:
    """
    FR-4: Implement retention policies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_alerting_on_thresholds(**kwargs) -> Dict:
    """
    FR-5: Enable alerting on thresholds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Session Storage System
 * From extracted-problems/system-design/storage.md
 */
export const sessionStoreProblemDefinition: ProblemDefinition = {
  id: 'session-store',
  title: 'Session Storage System',
  description: `Design a distributed session store. Handle session creation, validation, and expiration with high availability.
- Create and validate sessions
- Support session TTL
- Handle concurrent logins
- Enable session revocation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Create and validate sessions',
    'Support session TTL',
    'Handle concurrent logins',
    'Enable session revocation',
    'Store session metadata'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5ms for session lookup',
    'Request Rate: 50k sessions/sec',
    'Dataset Size: 10M active sessions',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Web Servers (redirect_client) for manage user sessions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for manage user sessions',
      },
      {
        type: 'cache',
        reason: 'Need Redis Cluster (cache) for manage user sessions',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for manage user sessions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Web Servers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'cache',
        reason: 'LB routes to Redis Cluster',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Cluster routes to PostgreSQL',
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

  scenarios: generateScenarios('session-store', problemConfigs['session-store'], [
    'Create and validate sessions',
    'Support session TTL',
    'Handle concurrent logins',
    'Enable session revocation',
    'Store session metadata'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Create and validate sessions
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_session_ttl(**kwargs) -> Dict:
    """
    FR-2: Support session TTL
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_concurrent_logins(**kwargs) -> Dict:
    """
    FR-3: Handle concurrent logins
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_session_revocation(**kwargs) -> Dict:
    """
    FR-4: Enable session revocation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Store session metadata
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]`,
};

/**
 * File Metadata Store
 * From extracted-problems/system-design/storage.md
 */
export const fileMetadataStoreProblemDefinition: ProblemDefinition = {
  id: 'file-metadata-store',
  title: 'File Metadata Store',
  description: `Design a metadata store for a distributed file system. Handle directory hierarchies, permissions, and file attributes.
- Store file and directory metadata
- Support hierarchical paths
- Track permissions and ownership
- Enable quick path lookups`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store file and directory metadata',
    'Support hierarchical paths',
    'Track permissions and ownership',
    'Enable quick path lookups',
    'Handle renames efficiently'
  ],
  userFacingNFRs: [
    'Latency: P95 < 20ms for metadata ops',
    'Request Rate: 100k ops/sec',
    'Dataset Size: 1B files and directories',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need FS Clients (redirect_client) for manage file system metadata',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for manage file system metadata',
      },
      {
        type: 'cache',
        reason: 'Need Path Cache (cache) for manage file system metadata',
      },
      {
        type: 'storage',
        reason: 'Need MySQL Sharded (db_primary) for manage file system metadata',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'FS Clients routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Metadata Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Metadata Service routes to Path Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Metadata Service routes to MySQL Sharded',
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

  scenarios: generateScenarios('file-metadata-store', problemConfigs['file-metadata-store'], [
    'Store file and directory metadata',
    'Support hierarchical paths',
    'Track permissions and ownership',
    'Enable quick path lookups',
    'Handle renames efficiently'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store file and directory metadata
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_hierarchical_paths(**kwargs) -> Dict:
    """
    FR-2: Support hierarchical paths
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-3: Track permissions and ownership
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

def enable_quick_path_lookups(**kwargs) -> Dict:
    """
    FR-4: Enable quick path lookups
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_renames_efficiently(**kwargs) -> Dict:
    """
    FR-5: Handle renames efficiently
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Configuration Management Store
 * From extracted-problems/system-design/storage.md
 */
export const configManagementProblemDefinition: ProblemDefinition = {
  id: 'config-management',
  title: 'Configuration Management Store',
  description: `Design a configuration management system. Support versioning, rollback, and real-time updates to services.
- Store key-value configurations
- Support versioning and rollback
- Enable environment-specific configs
- Provide audit trail`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store key-value configurations',
    'Support versioning and rollback',
    'Enable environment-specific configs',
    'Provide audit trail',
    'Push config updates to subscribers'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for reads',
    'Request Rate: 10k config reads/sec',
    'Dataset Size: 100K config keys',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for centralized config service',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for centralized config service',
      },
      {
        type: 'cache',
        reason: 'Need Config Cache (cache) for centralized config service',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for centralized config service',
      },
      {
        type: 'message_queue',
        reason: 'Need Update Queue (queue) for centralized config service',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Services routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Config API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Config API routes to Config Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Config API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Config API routes to Update Queue',
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

  scenarios: generateScenarios('config-management', problemConfigs['config-management'], [
    'Store key-value configurations',
    'Support versioning and rollback',
    'Enable environment-specific configs',
    'Provide audit trail',
    'Push config updates to subscribers'
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
relationships = {}
items = {}
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store key-value configurations
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_versioning_and_rollback(**kwargs) -> Dict:
    """
    FR-2: Support versioning and rollback
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_environment_specific_configs(**kwargs) -> Dict:
    """
    FR-3: Enable environment-specific configs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_audit_trail(**kwargs) -> Dict:
    """
    FR-4: Provide audit trail
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Push config updates to subscribers
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None`,
};

/**
 * E-commerce Order Database
 * From extracted-problems/system-design/storage.md
 */
export const ecommerceOrderDbProblemDefinition: ProblemDefinition = {
  id: 'ecommerce-order-db',
  title: 'E-commerce Order Database',
  description: `Design a sharded order database for e-commerce. Handle high write rates, complex queries, and maintain consistency.
- Store orders with line items
- Support order status tracking
- Handle inventory reservations
- Enable customer order history`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store orders with line items',
    'Support order status tracking',
    'Handle inventory reservations',
    'Enable customer order history',
    'Provide merchant dashboards',
    'Support refunds and cancellations'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms for order creation',
    'Request Rate: 10k orders/sec peak',
    'Dataset Size: 1B orders, 5B line items',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Customers (redirect_client) for sharded order management',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for sharded order management',
      },
      {
        type: 'storage',
        reason: 'Need Shard 1 (db_primary) for sharded order management',
      },
      {
        type: 'cache',
        reason: 'Need Order Cache (cache) for sharded order management',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Queue (queue) for sharded order management',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Customers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Order Service',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 1',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 2',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 3',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Order Service routes to Shard 4',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Order Service routes to Order Cache',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Order Service routes to Event Queue',
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

  scenarios: generateScenarios('ecommerce-order-db', problemConfigs['ecommerce-order-db'], [
    'Store orders with line items',
    'Support order status tracking',
    'Handle inventory reservations',
    'Enable customer order history',
    'Provide merchant dashboards',
    'Support refunds and cancellations'
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
posts = {}
items = {}
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store orders with line items
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-2: Support order status tracking
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

def handle_inventory_reservations(**kwargs) -> Dict:
    """
    FR-3: Handle inventory reservations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_customer_order_history(**kwargs) -> Dict:
    """
    FR-4: Enable customer order history
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_merchant_dashboards(**kwargs) -> Dict:
    """
    FR-5: Provide merchant dashboards
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_refunds_and_cancellations(**kwargs) -> Dict:
    """
    FR-6: Support refunds and cancellations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Social Network Graph Database
 * From extracted-problems/system-design/storage.md
 */
export const socialGraphDbProblemDefinition: ProblemDefinition = {
  id: 'social-graph-db',
  title: 'Social Network Graph Database',
  description: `Design a graph database for social connections. Support friend relationships, activity feeds, and graph traversal queries.
- Store user profiles and connections
- Support bidirectional friendships
- Generate personalized feeds
- Find mutual friends`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store user profiles and connections',
    'Support bidirectional friendships',
    'Generate personalized feeds',
    'Find mutual friends',
    'Suggest new connections',
    'Track engagement metrics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for feed generation',
    'Request Rate: 50k queries/sec',
    'Dataset Size: 1B users, 100B connections',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for friend connections and feeds',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for friend connections and feeds',
      },
      {
        type: 'cache',
        reason: 'Need Graph Cache (cache) for friend connections and feeds',
      },
      {
        type: 'storage',
        reason: 'Need Neo4j Cluster (db_primary) for friend connections and feeds',
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
        reason: 'LB routes to Social API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Social API routes to Graph Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Social API routes to Neo4j Cluster',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Social API routes to User Search',
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

  scenarios: generateScenarios('social-graph-db', problemConfigs['social-graph-db'], [
    'Store user profiles and connections',
    'Support bidirectional friendships',
    'Generate personalized feeds',
    'Find mutual friends',
    'Suggest new connections',
    'Track engagement metrics'
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
relationships = {}
users = {}
items = {}
memory = {}

def create_user(user_id: str, **kwargs) -> Dict:
    """
    FR-1: Store user profiles and connections
    Naive implementation - stores user in memory
    """
    users[user_id] = {
        'id': user_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return users[user_id]

def follow_user(follower_id: str, followee_id: str) -> Dict:
    """
    FR-2: Support bidirectional friendships
    Naive implementation - stores relationship in memory
    """
    relationship_id = f"{follower_id}_{followee_id}"
    relationships[relationship_id] = {
        'follower_id': follower_id,
        'followee_id': followee_id,
        'created_at': datetime.now()
    }
    return relationships[relationship_id]

def generate_personalized_feeds(**kwargs) -> Dict:
    """
    FR-3: Generate personalized feeds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-4: Find mutual friends
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def suggest_new_connections(**kwargs) -> Dict:
    """
    FR-5: Suggest new connections
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-6: Track engagement metrics
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
 * Analytics Data Warehouse
 * From extracted-problems/system-design/storage.md
 */
export const analyticsWarehouseProblemDefinition: ProblemDefinition = {
  id: 'analytics-warehouse',
  title: 'Analytics Data Warehouse',
  description: `Design an analytics warehouse with columnar storage. Optimize for complex aggregations and large scans.
- Store clickstream and event data
- Support complex aggregations
- Enable dimensional modeling
- Provide fast group-by queries`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store clickstream and event data',
    'Support complex aggregations',
    'Enable dimensional modeling',
    'Provide fast group-by queries',
    'Handle late-arriving data',
    'Support data cubes'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5s for analytical queries',
    'Request Rate: 1M events/sec ingestion',
    'Dataset Size: 1PB historical data',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Data Sources (redirect_client) for columnar storage for analytics',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for columnar storage for analytics',
      },
      {
        type: 'storage',
        reason: 'Need ClickHouse (db_primary) for columnar storage for analytics',
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
        reason: 'Data Sources routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to ETL Workers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ETL Workers routes to ClickHouse',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Query Engine routes to ClickHouse',
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

  scenarios: generateScenarios('analytics-warehouse', problemConfigs['analytics-warehouse'], [
    'Store clickstream and event data',
    'Support complex aggregations',
    'Enable dimensional modeling',
    'Provide fast group-by queries',
    'Handle late-arriving data',
    'Support data cubes'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store clickstream and event data
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_complex_aggregations(**kwargs) -> Dict:
    """
    FR-2: Support complex aggregations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_dimensional_modeling(**kwargs) -> Dict:
    """
    FR-3: Enable dimensional modeling
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_fast_group_by_queries(**kwargs) -> Dict:
    """
    FR-4: Provide fast group-by queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_late_arriving_data(**kwargs) -> Dict:
    """
    FR-5: Handle late-arriving data
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_data_cubes(**kwargs) -> Dict:
    """
    FR-6: Support data cubes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Multi-Tenant SaaS Database
 * From extracted-problems/system-design/storage.md
 */
export const multiTenantSaasProblemDefinition: ProblemDefinition = {
  id: 'multi-tenant-saas',
  title: 'Multi-Tenant SaaS Database',
  description: `Design a multi-tenant database with proper isolation. Balance shared resources with tenant-specific requirements.
- Isolate tenant data
- Support custom schemas per tenant
- Handle varying tenant sizes
- Provide per-tenant backups`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Isolate tenant data',
    'Support custom schemas per tenant',
    'Handle varying tenant sizes',
    'Provide per-tenant backups',
    'Enable tenant-specific SLAs',
    'Support data residency requirements'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for queries',
    'Request Rate: 50k queries/sec across all tenants',
    'Dataset Size: 10k tenants, 100TB total',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Tenant Apps (redirect_client) for tenant isolation and scaling',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for tenant isolation and scaling',
      },
      {
        type: 'cache',
        reason: 'Need Tenant Router (cache) for tenant isolation and scaling',
      },
      {
        type: 'storage',
        reason: 'Need Large Tenants (db_primary) for tenant isolation and scaling',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Tenant Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to API Gateway',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Tenant Router',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Large Tenants',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'API Gateway routes to Small Tenants',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Large Tenants routes to Replicas',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Small Tenants routes to Replicas',
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

  scenarios: generateScenarios('multi-tenant-saas', problemConfigs['multi-tenant-saas'], [
    'Isolate tenant data',
    'Support custom schemas per tenant',
    'Handle varying tenant sizes',
    'Provide per-tenant backups',
    'Enable tenant-specific SLAs',
    'Support data residency requirements'
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

def isolate_tenant_data(**kwargs) -> Dict:
    """
    FR-1: Isolate tenant data
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_custom_schemas_per_tenant(**kwargs) -> Dict:
    """
    FR-2: Support custom schemas per tenant
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_varying_tenant_sizes(**kwargs) -> Dict:
    """
    FR-3: Handle varying tenant sizes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_per_tenant_backups(**kwargs) -> Dict:
    """
    FR-4: Provide per-tenant backups
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_tenant_specific_slas(**kwargs) -> Dict:
    """
    FR-5: Enable tenant-specific SLAs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_data_residency_requirements(**kwargs) -> Dict:
    """
    FR-6: Support data residency requirements
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Inventory Management System
 * From extracted-problems/system-design/storage.md
 */
export const inventoryManagementProblemDefinition: ProblemDefinition = {
  id: 'inventory-management',
  title: 'Inventory Management System',
  description: `Design an Amazon-scale inventory system managing 10B SKUs across 5000+ fulfillment centers globally. Must handle 1M reservations/sec (10M during Prime Day), prevent overselling with <10ms latency, survive regional failures, and maintain perfect inventory accuracy. Support real-time inventory transfers, predictive restocking using ML, and operate within $50M/month budget while handling $1T+ inventory value.
- Track 10B SKUs across 5000+ fulfillment centers
- Process 1M reservations/sec (10M Prime Day)
- Distributed locks preventing any overselling
- ML-based predictive restocking across regions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Track 10B SKUs across 5000+ fulfillment centers',
    'Process 1M reservations/sec (10M Prime Day)',
    'Distributed locks preventing any overselling',
    'ML-based predictive restocking across regions',
    'Real-time cross-warehouse inventory transfers',
    'Support flash sales with 100x traffic spikes',
    'Multi-channel inventory (stores, online, partners)',
    'Complete audit trail for SOX compliance'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10ms reservation, P99.9 < 25ms',
    'Request Rate: 1M reservations/sec, 10M during Prime Day',
    'Dataset Size: 10B SKUs, 5000 locations, 100TB hot data',
    'Availability: 99.999% uptime, zero overselling tolerance'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Order Systems (redirect_client) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'cache',
        reason: 'Need Redis Locks (cache) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for amazon-scale 10b skus real-time inventory',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Queue (queue) for amazon-scale 10b skus real-time inventory',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Order Systems routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Inventory API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Inventory API routes to Redis Locks',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Inventory API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Inventory API routes to Event Queue',
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

  scenarios: generateScenarios('inventory-management', problemConfigs['inventory-management'], [
    'Track 10B SKUs across 5000+ fulfillment centers',
    'Process 1M reservations/sec (10M Prime Day)',
    'Distributed locks preventing any overselling',
    'ML-based predictive restocking across regions',
    'Real-time cross-warehouse inventory transfers',
    'Support flash sales with 100x traffic spikes',
    'Multi-channel inventory (stores, online, partners)',
    'Complete audit trail for SOX compliance'
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

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Track 10B SKUs across 5000+ fulfillment centers
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

def process_1m_reservations_sec_10m_prime_d(**kwargs) -> Dict:
    """
    FR-2: Process 1M reservations/sec (10M Prime Day)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def distributed_locks_preventing_any_oversel(**kwargs) -> Dict:
    """
    FR-3: Distributed locks preventing any overselling
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ml_based_predictive_restocking_across_re(**kwargs) -> Dict:
    """
    FR-4: ML-based predictive restocking across regions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_cross_warehouse_inventory_tran(**kwargs) -> Dict:
    """
    FR-5: Real-time cross-warehouse inventory transfers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_flash_sales_with_100x_traffic_sp(**kwargs) -> Dict:
    """
    FR-6: Support flash sales with 100x traffic spikes
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-7: Multi-channel inventory (stores, online, partners)
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def complete_audit_trail_for_sox_compliance(**kwargs) -> Dict:
    """
    FR-8: Complete audit trail for SOX compliance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * CMS with Media Storage
 * From extracted-problems/system-design/storage.md
 */
export const cmsMediaStorageProblemDefinition: ProblemDefinition = {
  id: 'cms-media-storage',
  title: 'CMS with Media Storage',
  description: `Design a CMS with separate storage for metadata and media. Handle large files, CDN integration, and content versioning.
- Store articles and media metadata
- Handle large media uploads
- Support content versioning
- Enable CDN distribution`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store articles and media metadata',
    'Handle large media uploads',
    'Support content versioning',
    'Enable CDN distribution',
    'Provide media transformations',
    'Track usage analytics'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms for metadata, < 200ms for media',
    'Request Rate: 10k reads/sec, 1k writes/sec',
    'Dataset Size: 1M articles, 100M media files, 500TB',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Readers (redirect_client) for content and media management',
      },
      {
        type: 'cdn',
        reason: 'Need Media CDN (cdn) for content and media management',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for content and media management',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for content and media management',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 (storage) for content and media management',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Readers routes to Media CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Media CDN routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to CMS API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'CMS API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'CMS API routes to S3',
      },
      {
        from: 'object_storage',
        to: 'cdn',
        reason: 'S3 routes to Media CDN',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'S3 routes to Image Processor',
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

  scenarios: generateScenarios('cms-media-storage', problemConfigs['cms-media-storage'], [
    'Store articles and media metadata',
    'Handle large media uploads',
    'Support content versioning',
    'Enable CDN distribution',
    'Provide media transformations',
    'Track usage analytics'
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
cache = {}
events = {}
posts = {}
item = {}
items = {}
memory = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store articles and media metadata
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Handle large media uploads
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_content_versioning(**kwargs) -> Dict:
    """
    FR-3: Support content versioning
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-4: Enable CDN distribution
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-4: Enable CDN distribution
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def provide_media_transformations(**kwargs) -> Dict:
    """
    FR-5: Provide media transformations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-6: Track usage analytics
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
 * Banking Transaction Database
 * From extracted-problems/system-design/storage.md
 */
export const bankingTransactionDbProblemDefinition: ProblemDefinition = {
  id: 'banking-transaction-db',
  title: 'Banking Transaction Database',
  description: `Design a JPMorgan/Bank of America-scale transaction system processing 100M transactions/sec globally with perfect ACID guarantees. Must handle market crashes (1000x spikes), maintain zero data loss even during datacenter failures, meet Basel III regulations, and operate within $500M/month budget. Support real-time fraud detection, instant international transfers, and coordinate with 10k+ partner banks while ensuring complete regulatory compliance.
- Process 100M transactions/sec (1B during crises)
- Zero tolerance for data loss or inconsistency
- Real-time fraud detection on every transaction
- Instant cross-border transfers to 200+ countries`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 100M transactions/sec (1B during crises)',
    'Zero tolerance for data loss or inconsistency',
    'Real-time fraud detection on every transaction',
    'Instant cross-border transfers to 200+ countries',
    'Support 1B+ accounts across all products',
    'Complete audit trail for 10-year retention',
    'Meet Basel III, Dodd-Frank, GDPR requirements',
    'Coordinate with 10k+ partner banks via APIs'
  ],
  userFacingNFRs: [
    'Latency: P99 < 50ms domestic, < 200ms international',
    'Request Rate: 100M transactions/sec, 1B during market events',
    'Dataset Size: 1B accounts, 100B transactions, 1PB audit logs',
    'Availability: 99.9999% uptime (31 seconds/year downtime)'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Banking Apps (redirect_client) for jpmorgan-scale 100m transactions/sec',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for jpmorgan-scale 100m transactions/sec',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for jpmorgan-scale 100m transactions/sec',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Banking Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Transaction Service',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Transaction Service routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Transaction Service routes to Read Replicas',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'PostgreSQL routes to Archive',
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

  scenarios: generateScenarios('banking-transaction-db', problemConfigs['banking-transaction-db'], [
    'Process 100M transactions/sec (1B during crises)',
    'Zero tolerance for data loss or inconsistency',
    'Real-time fraud detection on every transaction',
    'Instant cross-border transfers to 200+ countries',
    'Support 1B+ accounts across all products',
    'Complete audit trail for 10-year retention',
    'Meet Basel III, Dodd-Frank, GDPR requirements',
    'Coordinate with 10k+ partner banks via APIs'
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
events = {}
memory = {}

def process_100m_transactions_sec_1b_during(**kwargs) -> Dict:
    """
    FR-1: Process 100M transactions/sec (1B during crises)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def zero_tolerance_for_data_loss_or_inconsis(**kwargs) -> Dict:
    """
    FR-2: Zero tolerance for data loss or inconsistency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def real_time_fraud_detection_on_every_trans(**kwargs) -> Dict:
    """
    FR-3: Real-time fraud detection on every transaction
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-4: Instant cross-border transfers to 200+ countries
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

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Support 1B+ accounts across all products
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

def complete_audit_trail_for_10_year_retenti(**kwargs) -> Dict:
    """
    FR-6: Complete audit trail for 10-year retention
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def meet_basel_iii_dodd_frank_gdpr_require(**kwargs) -> Dict:
    """
    FR-7: Meet Basel III, Dodd-Frank, GDPR requirements
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def coordinate_with_10k_partner_banks_via_a(**kwargs) -> Dict:
    """
    FR-8: Coordinate with 10k+ partner banks via APIs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Healthcare Records System
 * From extracted-problems/system-design/storage.md
 */
export const healthcareRecordsProblemDefinition: ProblemDefinition = {
  id: 'healthcare-records',
  title: 'Healthcare Records System',
  description: `Design a healthcare records system with HIPAA compliance. Handle patient data, access controls, and audit logging.
- Store patient medical records
- Enforce role-based access control
- Track all data access
- Support data encryption at rest and in transit`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store patient medical records',
    'Enforce role-based access control',
    'Track all data access',
    'Support data encryption at rest and in transit',
    'Enable patient consent management',
    'Provide audit trail for compliance'
  ],
  userFacingNFRs: [
    'Latency: P95 < 200ms for record access',
    'Request Rate: 5k queries/sec',
    'Dataset Size: 100M patient records',
    'Availability: 99.99% uptime',
    'Durability: HIPAA, GDPR compliant'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need EHR Systems (redirect_client) for hipaa-compliant medical records',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for hipaa-compliant medical records',
      },
      {
        type: 'storage',
        reason: 'Need Encrypted PostgreSQL (db_primary) for hipaa-compliant medical records',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log Queue (queue) for hipaa-compliant medical records',
      },
      {
        type: 'object_storage',
        reason: 'Need Encrypted S3 (storage) for hipaa-compliant medical records',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'EHR Systems routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Records API',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Records API routes to Encrypted PostgreSQL',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Records API routes to Audit Log Queue',
      },
      {
        from: 'storage',
        to: 'object_storage',
        reason: 'Encrypted PostgreSQL routes to Encrypted S3',
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

  scenarios: generateScenarios('healthcare-records', problemConfigs['healthcare-records'], [
    'Store patient medical records',
    'Enforce role-based access control',
    'Track all data access',
    'Support data encryption at rest and in transit',
    'Enable patient consent management',
    'Provide audit trail for compliance'
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
transit = {}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store patient medical records
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def enforce_role_based_access_control(**kwargs) -> Dict:
    """
    FR-2: Enforce role-based access control
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-3: Track all data access
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

def support_data_encryption_at_rest_and_in_t(**kwargs) -> Dict:
    """
    FR-4: Support data encryption at rest and in transit
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_patient_consent_management(**kwargs) -> Dict:
    """
    FR-5: Enable patient consent management
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_audit_trail_for_compliance(**kwargs) -> Dict:
    """
    FR-6: Provide audit trail for compliance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * IoT Time-Series Store
 * From extracted-problems/system-design/storage.md
 */
export const iotTimeSeriesProblemDefinition: ProblemDefinition = {
  id: 'iot-time-series',
  title: 'IoT Time-Series Store',
  description: `Design an IoT time-series database with aggressive compression. Handle millions of devices sending telemetry.
- Ingest sensor data from millions of devices
- Apply delta and run-length compression
- Support time-range queries
- Enable aggregation by device/sensor`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest sensor data from millions of devices',
    'Apply delta and run-length compression',
    'Support time-range queries',
    'Enable aggregation by device/sensor',
    'Implement data retention policies',
    'Provide real-time dashboards'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5ms for writes, < 500ms for queries',
    'Request Rate: 5M data points/sec',
    'Dataset Size: 500TB compressed',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need IoT Devices (redirect_client) for compressed sensor data storage',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for compressed sensor data storage',
      },
      {
        type: 'storage',
        reason: 'Need TimescaleDB (db_primary) for compressed sensor data storage',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for compressed sensor data storage',
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
        reason: 'IoT Devices routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to Compression',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Compression routes to TimescaleDB',
      },
      {
        from: 'storage',
        to: 'cache',
        reason: 'TimescaleDB routes to Query Cache',
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

  scenarios: generateScenarios('iot-time-series', problemConfigs['iot-time-series'], [
    'Ingest sensor data from millions of devices',
    'Apply delta and run-length compression',
    'Support time-range queries',
    'Enable aggregation by device/sensor',
    'Implement data retention policies',
    'Provide real-time dashboards'
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

def ingest_sensor_data_from_millions_of_devi(**kwargs) -> Dict:
    """
    FR-1: Ingest sensor data from millions of devices
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def apply_delta_and_run_length_compression(**kwargs) -> Dict:
    """
    FR-2: Apply delta and run-length compression
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_time_range_queries(**kwargs) -> Dict:
    """
    FR-3: Support time-range queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_aggregation_by_device_sensor(**kwargs) -> Dict:
    """
    FR-4: Enable aggregation by device/sensor
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def implement_data_retention_policies(**kwargs) -> Dict:
    """
    FR-5: Implement data retention policies
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_real_time_dashboards(**kwargs) -> Dict:
    """
    FR-6: Provide real-time dashboards
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Gaming Leaderboard Database
 * From extracted-problems/system-design/storage.md
 */
export const gamingLeaderboardProblemDefinition: ProblemDefinition = {
  id: 'gaming-leaderboard',
  title: 'Gaming Leaderboard Database',
  description: `Design a real-time gaming leaderboard. Handle score updates, rank queries, and global/regional leaderboards.
- Update player scores in real-time
- Query player rank by score
- Retrieve top N players
- Support multiple leaderboards`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Update player scores in real-time',
    'Query player rank by score',
    'Retrieve top N players',
    'Support multiple leaderboards',
    'Handle ties in ranking',
    'Provide historical snapshots'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for rank queries',
    'Request Rate: 100k score updates/sec',
    'Dataset Size: 100M active players',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Game Servers (redirect_client) for real-time rankings and scores',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for real-time rankings and scores',
      },
      {
        type: 'cache',
        reason: 'Need Redis Sorted Sets (cache) for real-time rankings and scores',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for real-time rankings and scores',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Game Servers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Score API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Score API routes to Redis Sorted Sets',
      },
      {
        from: 'cache',
        to: 'storage',
        reason: 'Redis Sorted Sets routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Snapshot Worker routes to Redis Sorted Sets',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Snapshot Worker routes to PostgreSQL',
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

  scenarios: generateScenarios('gaming-leaderboard', problemConfigs['gaming-leaderboard'], [
    'Update player scores in real-time',
    'Query player rank by score',
    'Retrieve top N players',
    'Support multiple leaderboards',
    'Handle ties in ranking',
    'Provide historical snapshots'
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
ranking = {}
real = {}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Update player scores in real-time
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def get_item(item_id: str) -> Dict:
    """
    FR-2: Query player rank by score
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def get_item(item_id: str) -> Dict:
    """
    FR-3: Retrieve top N players
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def support_multiple_leaderboards(**kwargs) -> Dict:
    """
    FR-4: Support multiple leaderboards
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_ties_in_ranking(**kwargs) -> Dict:
    """
    FR-5: Handle ties in ranking
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_historical_snapshots(**kwargs) -> Dict:
    """
    FR-6: Provide historical snapshots
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Booking/Reservation System
 * From extracted-problems/system-design/storage.md
 */
export const bookingReservationProblemDefinition: ProblemDefinition = {
  id: 'booking-reservation',
  title: 'Booking/Reservation System',
  description: `Design a booking system for hotels/flights. Prevent double-booking with proper concurrency control.
- Check availability in real-time
- Reserve resources atomically
- Handle concurrent booking attempts
- Support hold/release of reservations`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Check availability in real-time',
    'Reserve resources atomically',
    'Handle concurrent booking attempts',
    'Support hold/release of reservations',
    'Enable waitlists',
    'Provide booking confirmations'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for availability check',
    'Request Rate: 10k bookings/sec',
    'Dataset Size: 1M resources, 100M bookings/year',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Booking Apps (redirect_client) for prevent double-booking conflicts',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for prevent double-booking conflicts',
      },
      {
        type: 'cache',
        reason: 'Need Redis Locks (cache) for prevent double-booking conflicts',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for prevent double-booking conflicts',
      },
      {
        type: 'message_queue',
        reason: 'Need Waitlist (queue) for prevent double-booking conflicts',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Booking Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Reservation API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Reservation API routes to Redis Locks',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Reservation API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Reservation API routes to Waitlist',
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

  scenarios: generateScenarios('booking-reservation', problemConfigs['booking-reservation'], [
    'Check availability in real-time',
    'Reserve resources atomically',
    'Handle concurrent booking attempts',
    'Support hold/release of reservations',
    'Enable waitlists',
    'Provide booking confirmations'
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
real = {}

def check_availability_in_real_time(**kwargs) -> Dict:
    """
    FR-1: Check availability in real-time
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-2: Reserve resources atomically
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def handle_concurrent_booking_attempts(**kwargs) -> Dict:
    """
    FR-3: Handle concurrent booking attempts
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_hold_release_of_reservations(**kwargs) -> Dict:
    """
    FR-4: Support hold/release of reservations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_waitlists(**kwargs) -> Dict:
    """
    FR-5: Enable waitlists
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_booking_confirmations(**kwargs) -> Dict:
    """
    FR-6: Provide booking confirmations
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Audit Trail Database
 * From extracted-problems/system-design/storage.md
 */
export const auditTrailProblemDefinition: ProblemDefinition = {
  id: 'audit-trail',
  title: 'Audit Trail Database',
  description: `Design an append-only audit trail. Ensure immutability, support compliance queries, and handle high write rates.
- Log all system events
- Guarantee immutability
- Support time-range queries
- Enable filtering by entity/action`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Log all system events',
    'Guarantee immutability',
    'Support time-range queries',
    'Enable filtering by entity/action',
    'Provide tamper detection',
    'Archive old logs'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for writes',
    'Request Rate: 100k events/sec',
    'Dataset Size: 1PB total logs',
    'Availability: 99.99% uptime',
    'Durability: Write-once, read-many immutability'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Services (redirect_client) for append-only event log',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for append-only event log',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (db_primary) for append-only event log',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Glacier (storage) for append-only event log',
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
        reason: 'Services routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to Indexer',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Indexer routes to Elasticsearch',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Indexer routes to S3 Glacier',
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

  scenarios: generateScenarios('audit-trail', problemConfigs['audit-trail'], [
    'Log all system events',
    'Guarantee immutability',
    'Support time-range queries',
    'Enable filtering by entity/action',
    'Provide tamper detection',
    'Archive old logs'
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

def log_all_system_events(**kwargs) -> Dict:
    """
    FR-1: Log all system events
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def guarantee_immutability(**kwargs) -> Dict:
    """
    FR-2: Guarantee immutability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_time_range_queries(**kwargs) -> Dict:
    """
    FR-3: Support time-range queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_filtering_by_entity_action(**kwargs) -> Dict:
    """
    FR-4: Enable filtering by entity/action
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_tamper_detection(**kwargs) -> Dict:
    """
    FR-5: Provide tamper detection
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def archive_old_logs(**kwargs) -> Dict:
    """
    FR-6: Archive old logs
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Search Index Storage
 * From extracted-problems/system-design/storage.md
 */
export const searchIndexStorageProblemDefinition: ProblemDefinition = {
  id: 'search-index-storage',
  title: 'Search Index Storage',
  description: `Design a search index storage system. Handle document indexing, query processing, and relevance ranking.
- Index documents with full-text
- Support boolean queries
- Rank results by relevance
- Handle typos and synonyms`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Index documents with full-text',
    'Support boolean queries',
    'Rank results by relevance',
    'Handle typos and synonyms',
    'Enable faceted filtering',
    'Provide autocomplete'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for search queries',
    'Request Rate: 50k queries/sec, 10k indexing/sec',
    'Dataset Size: 100M documents, 1TB index',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Search Users (redirect_client) for inverted index for full-text search',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for inverted index for full-text search',
      },
      {
        type: 'cache',
        reason: 'Need Query Cache (cache) for inverted index for full-text search',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch (search) for inverted index for full-text search',
      },
      {
        type: 'message_queue',
        reason: 'Need Index Queue (queue) for inverted index for full-text search',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Search Users routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Search API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Search API routes to Query Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Search API routes to Elasticsearch',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Search API routes to Index Queue',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Index Queue routes to Elasticsearch',
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

  scenarios: generateScenarios('search-index-storage', problemConfigs['search-index-storage'], [
    'Index documents with full-text',
    'Support boolean queries',
    'Rank results by relevance',
    'Handle typos and synonyms',
    'Enable faceted filtering',
    'Provide autocomplete'
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

def index_documents_with_full_text(**kwargs) -> Dict:
    """
    FR-1: Index documents with full-text
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_boolean_queries(**kwargs) -> Dict:
    """
    FR-2: Support boolean queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def rank_results_by_relevance(**kwargs) -> Dict:
    """
    FR-3: Rank results by relevance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_typos_and_synonyms(**kwargs) -> Dict:
    """
    FR-4: Handle typos and synonyms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_faceted_filtering(**kwargs) -> Dict:
    """
    FR-5: Enable faceted filtering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_autocomplete(**kwargs) -> Dict:
    """
    FR-6: Provide autocomplete
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * ML Model Registry
 * From extracted-problems/system-design/storage.md
 */
export const mlModelRegistryProblemDefinition: ProblemDefinition = {
  id: 'ml-model-registry',
  title: 'ML Model Registry',
  description: `Design an ML model registry. Store model artifacts, track versions, and manage deployment metadata.
- Store model binaries and weights
- Track model versions and lineage
- Store experiment metadata
- Enable model comparison`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store model binaries and weights',
    'Track model versions and lineage',
    'Store experiment metadata',
    'Enable model comparison',
    'Support model rollback',
    'Provide deployment tracking'
  ],
  userFacingNFRs: [
    'Latency: P95 < 200ms for metadata queries',
    'Request Rate: 1k model uploads/day, 10k queries/sec',
    'Dataset Size: 1M models, 100TB artifacts',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need ML Engineers (redirect_client) for versioned model artifacts',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for versioned model artifacts',
      },
      {
        type: 'cache',
        reason: 'Need Metadata Cache (cache) for versioned model artifacts',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for versioned model artifacts',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 (storage) for versioned model artifacts',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'ML Engineers routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Registry API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Registry API routes to Metadata Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Registry API routes to PostgreSQL',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Registry API routes to S3',
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

  scenarios: generateScenarios('ml-model-registry', problemConfigs['ml-model-registry'], [
    'Store model binaries and weights',
    'Track model versions and lineage',
    'Store experiment metadata',
    'Enable model comparison',
    'Support model rollback',
    'Provide deployment tracking'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store model binaries and weights
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-2: Track model versions and lineage
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Store experiment metadata
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def enable_model_comparison(**kwargs) -> Dict:
    """
    FR-4: Enable model comparison
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_model_rollback(**kwargs) -> Dict:
    """
    FR-5: Support model rollback
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-6: Provide deployment tracking
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
 * API Rate Limit Counters
 * From extracted-problems/system-design/storage.md
 */
export const rateLimitCountersProblemDefinition: ProblemDefinition = {
  id: 'rate-limit-counters',
  title: 'API Rate Limit Counters',
  description: `Design a distributed rate limiter. Track API usage per user/IP with sliding windows and token buckets.
- Track requests per time window
- Support multiple rate limit tiers
- Handle burst traffic
- Provide real-time quota checks`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Track requests per time window',
    'Support multiple rate limit tiers',
    'Handle burst traffic',
    'Provide real-time quota checks',
    'Enable analytics on usage',
    'Support rate limit headers'
  ],
  userFacingNFRs: [
    'Latency: P95 < 5ms for rate check',
    'Request Rate: 1M rate checks/sec',
    'Dataset Size: 10M active API keys',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API Gateway (redirect_client) for distributed rate limiting',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for distributed rate limiting',
      },
      {
        type: 'cache',
        reason: 'Need Redis Counters (cache) for distributed rate limiting',
      },
      {
        type: 'storage',
        reason: 'Need Limit Config (db_primary) for distributed rate limiting',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'API Gateway routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Rate Limiter',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Rate Limiter routes to Redis Counters',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Rate Limiter routes to Limit Config',
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

  scenarios: generateScenarios('rate-limit-counters', problemConfigs['rate-limit-counters'], [
    'Track requests per time window',
    'Support multiple rate limit tiers',
    'Handle burst traffic',
    'Provide real-time quota checks',
    'Enable analytics on usage',
    'Support rate limit headers'
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
memory = {}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Track requests per time window
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

def support_multiple_rate_limit_tiers(**kwargs) -> Dict:
    """
    FR-2: Support multiple rate limit tiers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_burst_traffic(**kwargs) -> Dict:
    """
    FR-3: Handle burst traffic
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_real_time_quota_checks(**kwargs) -> Dict:
    """
    FR-4: Provide real-time quota checks
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-5: Enable analytics on usage
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

def support_rate_limit_headers(**kwargs) -> Dict:
    """
    FR-6: Support rate limit headers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Distributed SQL Database
 * From extracted-problems/system-design/storage.md
 */
export const distributedDatabaseProblemDefinition: ProblemDefinition = {
  id: 'distributed-database',
  title: 'Distributed SQL Database',
  description: `Design a Google Spanner-scale distributed SQL database handling 10M transactions/sec across 100+ regions with perfect ACID guarantees. Must survive entire continent failures, maintain <5ms P99 latency within regions, support 1PB+ datasets, and operate within $100M/month budget. Implement TrueTime for global consistency, automatic resharding, and seamless schema evolution while serving mission-critical workloads for 1B+ users.
- Process 10M transactions/sec globally
- Distribute across 100+ regions with auto-sharding
- TrueTime-based global consistency
- Zero-downtime schema migrations at scale`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Process 10M transactions/sec globally',
    'Distribute across 100+ regions with auto-sharding',
    'TrueTime-based global consistency',
    'Zero-downtime schema migrations at scale',
    'Multi-version concurrency control (MVCC)',
    'Support 1M+ concurrent connections',
    'Automatic data rebalancing and healing',
    'Point-in-time recovery to any second in 30 days'
  ],
  userFacingNFRs: [
    'Latency: P99 < 5ms same-region, < 50ms cross-region',
    'Request Rate: 10M transactions/sec, 100M during spikes',
    'Dataset Size: 1PB active data, 10PB historical',
    'Availability: 99.999% with 5-second RTO'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Clients (redirect_client) for google spanner-scale 10m tps globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Global LB (lb) for google spanner-scale 10m tps globally',
      },
      {
        type: 'storage',
        reason: 'Need US Region (db_primary) for google spanner-scale 10m tps globally',
      },
      {
        type: 'message_queue',
        reason: 'Need CDC Stream (stream) for google spanner-scale 10m tps globally',
      },
      {
        type: 'cache',
        reason: 'Need Read Cache (cache) for google spanner-scale 10m tps globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Clients routes to Global LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Global LB routes to Data API',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Data API routes to US Region',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Data API routes to EU Region',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Data API routes to APAC Region',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'US Region routes to CDC Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'EU Region routes to CDC Stream',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'APAC Region routes to CDC Stream',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Data API routes to Read Cache',
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

  scenarios: generateScenarios('distributed-database', problemConfigs['distributed-database'], [
    'Process 10M transactions/sec globally',
    'Distribute across 100+ regions with auto-sharding',
    'TrueTime-based global consistency',
    'Zero-downtime schema migrations at scale',
    'Multi-version concurrency control (MVCC)',
    'Support 1M+ concurrent connections',
    'Automatic data rebalancing and healing',
    'Point-in-time recovery to any second in 30 days'
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
30 = {}

def process_10m_transactions_sec_globally(**kwargs) -> Dict:
    """
    FR-1: Process 10M transactions/sec globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def distribute_across_100_regions_with_auto(**kwargs) -> Dict:
    """
    FR-2: Distribute across 100+ regions with auto-sharding
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def truetime_based_global_consistency(**kwargs) -> Dict:
    """
    FR-3: TrueTime-based global consistency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def zero_downtime_schema_migrations_at_scale(**kwargs) -> Dict:
    """
    FR-4: Zero-downtime schema migrations at scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def multi_version_concurrency_control_mvcc(**kwargs) -> Dict:
    """
    FR-5: Multi-version concurrency control (MVCC)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_1m_concurrent_connections(**kwargs) -> Dict:
    """
    FR-6: Support 1M+ concurrent connections
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_data_rebalancing_and_healing(**kwargs) -> Dict:
    """
    FR-7: Automatic data rebalancing and healing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def point_in_time_recovery_to_any_second_in(**kwargs) -> Dict:
    """
    FR-8: Point-in-time recovery to any second in 30 days
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Video/Image CDN Storage
 * From extracted-problems/system-design/storage.md
 */
export const contentDeliveryStorageProblemDefinition: ProblemDefinition = {
  id: 'content-delivery-storage',
  title: 'Video/Image CDN Storage',
  description: `Design a multi-tier storage system for a video/image CDN. Implement hot/warm/cold tiers based on access patterns, with automatic tier migration and cost optimization.
- Store videos and images
- Auto-migrate to cold storage after 30 days
- Restore from cold storage on demand
- Generate multiple resolutions`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store videos and images',
    'Auto-migrate to cold storage after 30 days',
    'Restore from cold storage on demand',
    'Generate multiple resolutions',
    'Purge based on retention policy',
    'Track access patterns for tier decisions'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms hot tier, < 50ms warm, < 500ms cold restore',
    'Request Rate: 500k reads/s, 10k writes/s',
    'Dataset Size: 10PB total (1PB hot, 3PB warm, 6PB cold)',
    'Availability: 99.99% for hot tier, 99.9% for warm/cold',
    'Durability: 11 nines durability required'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Users (redirect_client) for multi-tier storage for media delivery',
      },
      {
        type: 'cdn',
        reason: 'Need CDN (cdn) for multi-tier storage for media delivery',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for multi-tier storage for media delivery',
      },
      {
        type: 'cache',
        reason: 'Need Metadata Cache (cache) for multi-tier storage for media delivery',
      },
      {
        type: 'object_storage',
        reason: 'Need Hot Tier (S3 Standard) (object_store) for multi-tier storage for media delivery',
      },
      {
        type: 'message_queue',
        reason: 'Need Tiering Queue (queue) for multi-tier storage for media delivery',
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
        reason: 'LB routes to Media API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Media API routes to Metadata Cache',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Media API routes to Hot Tier (S3 Standard)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Media API routes to Warm Tier (S3 IA)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Media API routes to Cold Tier (Glacier)',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Tiering Queue routes to Tier Migration',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Tier Migration routes to Hot Tier (S3 Standard)',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Tier Migration routes to Warm Tier (S3 IA)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tier Migration routes to Cold Tier (Glacier)',
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

  scenarios: generateScenarios('content-delivery-storage', problemConfigs['content-delivery-storage'], [
    'Store videos and images',
    'Auto-migrate to cold storage after 30 days',
    'Restore from cold storage on demand',
    'Generate multiple resolutions',
    'Purge based on retention policy',
    'Track access patterns for tier decisions'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store videos and images
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def auto_migrate_to_cold_storage_after_30_da(**kwargs) -> Dict:
    """
    FR-2: Auto-migrate to cold storage after 30 days
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Restore from cold storage on demand
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def generate_multiple_resolutions(**kwargs) -> Dict:
    """
    FR-4: Generate multiple resolutions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def purge_based_on_retention_policy(**kwargs) -> Dict:
    """
    FR-5: Purge based on retention policy
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-6: Track access patterns for tier decisions
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
 * Amazon DynamoDB Clone
 * From extracted-problems/system-design/storage.md
 */
export const multiModelDatabaseProblemDefinition: ProblemDefinition = {
  id: 'multi-model-database',
  title: 'Amazon DynamoDB Clone',
  description: `Design an AWS DynamoDB-scale database handling 100M requests/sec globally across all data models (KV, document, graph, time-series). Must support 10PB+ storage with <1ms P99 latency, survive multiple region failures, auto-scale from 0 to millions QPS in seconds, and operate within $200M/month budget. Implement adaptive capacity, global tables with millisecond replication, and support 100k+ concurrent streams while serving Netflix, Lyft, and Airbnb scale workloads.
- Support 100M requests/sec across all models
- Store 10PB+ with automatic sharding
- Global tables with <100ms replication
- Auto-scale from 0 to 10M QPS in 60 seconds`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support 100M requests/sec across all models',
    'Store 10PB+ with automatic sharding',
    'Global tables with <100ms replication',
    'Auto-scale from 0 to 10M QPS in 60 seconds',
    'Stream 100k+ concurrent change streams',
    'Adaptive capacity for hot partitions',
    'Point-in-time recovery to any second',
    'Support ACID transactions across items'
  ],
  userFacingNFRs: [
    'Latency: P99 < 1ms single-region, < 10ms global',
    'Request Rate: 100M requests/sec, 1B during spikes',
    'Dataset Size: 10PB active, 100PB with backups',
    'Availability: 99.999% SLA with automatic failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Applications (redirect_client) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'cache',
        reason: 'Need Edge Cache (cdn) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'load_balancer',
        reason: 'Need Request LB (lb) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'storage',
        reason: 'Need Storage Nodes (db_primary) for dynamodb-scale 100m requests/sec globally',
      },
      {
        type: 'message_queue',
        reason: 'Need Change Streams (stream) for dynamodb-scale 100m requests/sec globally',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cache',
        reason: 'Applications routes to Edge Cache',
      },
      {
        from: 'cache',
        to: 'load_balancer',
        reason: 'Edge Cache routes to Request LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Request LB routes to Request Router',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Request Router routes to Item Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Request Router routes to Storage Nodes',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Storage Nodes routes to Global Tables',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Storage Nodes routes to Change Streams',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Change Streams routes to Auto Scaler',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Auto Scaler routes to Storage Nodes',
      },
      {
        from: 'message_queue',
        to: 'message_queue',
        reason: 'Change Streams routes to Backup Queue',
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

  scenarios: generateScenarios('multi-model-database', problemConfigs['multi-model-database'], [
    'Support 100M requests/sec across all models',
    'Store 10PB+ with automatic sharding',
    'Global tables with <100ms replication',
    'Auto-scale from 0 to 10M QPS in 60 seconds',
    'Stream 100k+ concurrent change streams',
    'Adaptive capacity for hot partitions',
    'Point-in-time recovery to any second',
    'Support ACID transactions across items'
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
60 = {}
memory = {}

def support_100m_requests_sec_across_all_mod(**kwargs) -> Dict:
    """
    FR-1: Support 100M requests/sec across all models
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Store 10PB+ with automatic sharding
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def global_tables_with_100ms_replication(**kwargs) -> Dict:
    """
    FR-3: Global tables with <100ms replication
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def auto_scale_from_0_to_10m_qps_in_60_secon(**kwargs) -> Dict:
    """
    FR-4: Auto-scale from 0 to 10M QPS in 60 seconds
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-5: Stream 100k+ concurrent change streams
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def adaptive_capacity_for_hot_partitions(**kwargs) -> Dict:
    """
    FR-6: Adaptive capacity for hot partitions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def point_in_time_recovery_to_any_second(**kwargs) -> Dict:
    """
    FR-7: Point-in-time recovery to any second
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_acid_transactions_across_items(**kwargs) -> Dict:
    """
    FR-8: Support ACID transactions across items
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Distributed Transactions (2PC/3PC)
 * From extracted-problems/system-design/storage.md
 */
export const distributedTransactionsProblemDefinition: ProblemDefinition = {
  id: 'distributed-transactions',
  title: 'Distributed Transactions (2PC/3PC)',
  description: `Implement Visa/Google-scale distributed transactions processing 10M cross-shard transactions/sec across 10k+ database shards globally. Must guarantee ACID even during network partitions, handle coordinator failures in <100ms, survive entire datacenter losses, and operate within $300M/month budget. Support Spanner-style TrueTime, Percolator-style 2PC optimization, and coordinate transactions spanning 100+ shards while maintaining perfect consistency.
- Execute 10M cross-shard transactions/sec
- Coordinate across 10k+ database shards globally
- Spanner-style TrueTime for global ordering
- Percolator optimization for 2PC at scale`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Execute 10M cross-shard transactions/sec',
    'Coordinate across 10k+ database shards globally',
    'Spanner-style TrueTime for global ordering',
    'Percolator optimization for 2PC at scale',
    'Handle transactions spanning 100+ shards',
    'Automatic deadlock detection and resolution',
    'Zero-loss coordinator failover in <100ms',
    'Support snapshot isolation and serializability'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for 2PC, < 200ms for 100-shard txns',
    'Request Rate: 10M distributed txns/sec, 100M during peaks',
    'Dataset Size: 100PB across 10k nodes, 1000+ datacenters',
    'Availability: 99.9999% with automatic coordinator failover'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Applications (redirect_client) for visa-scale 10m cross-shard tps',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for visa-scale 10m cross-shard tps',
      },
      {
        type: 'message_queue',
        reason: 'Need Tx Log (Kafka) (queue) for visa-scale 10m cross-shard tps',
      },
      {
        type: 'storage',
        reason: 'Need Shard 1 (db_primary) for visa-scale 10m cross-shard tps',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Applications routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Tx Coordinator',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Backup Coordinators',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Tx Coordinator routes to Tx Log (Kafka)',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard 1',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard 2',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard 3',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinator routes to Shard N',
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

  scenarios: generateScenarios('distributed-transactions', problemConfigs['distributed-transactions'], [
    'Execute 10M cross-shard transactions/sec',
    'Coordinate across 10k+ database shards globally',
    'Spanner-style TrueTime for global ordering',
    'Percolator optimization for 2PC at scale',
    'Handle transactions spanning 100+ shards',
    'Automatic deadlock detection and resolution',
    'Zero-loss coordinator failover in <100ms',
    'Support snapshot isolation and serializability'
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

def execute_10m_cross_shard_transactions_sec(**kwargs) -> Dict:
    """
    FR-1: Execute 10M cross-shard transactions/sec
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def coordinate_across_10k_database_shards_g(**kwargs) -> Dict:
    """
    FR-2: Coordinate across 10k+ database shards globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def spanner_style_truetime_for_global_orderi(**kwargs) -> Dict:
    """
    FR-3: Spanner-style TrueTime for global ordering
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def percolator_optimization_for_2pc_at_scale(**kwargs) -> Dict:
    """
    FR-4: Percolator optimization for 2PC at scale
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_transactions_spanning_100_shards(**kwargs) -> Dict:
    """
    FR-5: Handle transactions spanning 100+ shards
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def automatic_deadlock_detection_and_resolut(**kwargs) -> Dict:
    """
    FR-6: Automatic deadlock detection and resolution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def zero_loss_coordinator_failover_in_100ms(**kwargs) -> Dict:
    """
    FR-7: Zero-loss coordinator failover in <100ms
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_snapshot_isolation_and_serializa(**kwargs) -> Dict:
    """
    FR-8: Support snapshot isolation and serializability
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Multi-Master Replication
 * From extracted-problems/system-design/storage.md
 */
export const multiMasterReplicationProblemDefinition: ProblemDefinition = {
  id: 'multi-master-replication',
  title: 'Multi-Master Replication',
  description: `Design a multi-master replicated database. Handle write conflicts, implement CRDTs, and provide eventual consistency with causal ordering.
- Accept writes at any replica
- Detect and resolve conflicts automatically
- Propagate changes between replicas
- Maintain causal consistency`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Accept writes at any replica',
    'Detect and resolve conflicts automatically',
    'Propagate changes between replicas',
    'Maintain causal consistency',
    'Support version vectors',
    'Handle network partitions gracefully',
    'Provide conflict-free data types'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms for local writes',
    'Request Rate: 200k writes/sec globally',
    'Dataset Size: 10 replicas, 50TB each',
    'Availability: 99.999% per-replica'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Global Clients (redirect_client) for conflict-free replicated data',
      },
      {
        type: 'load_balancer',
        reason: 'Need Geo LB (lb) for conflict-free replicated data',
      },
      {
        type: 'storage',
        reason: 'Need Master US (db_primary) for conflict-free replicated data',
      },
      {
        type: 'message_queue',
        reason: 'Need Replication Log (stream) for conflict-free replicated data',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Global Clients routes to Geo LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Geo LB routes to Conflict Resolver',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master US',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master EU',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master APAC',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Conflict Resolver routes to Master SA',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master US routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master EU routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master APAC routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Master SA routes to Replication Log',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Replication Log routes to Merge Workers',
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

  scenarios: generateScenarios('multi-master-replication', problemConfigs['multi-master-replication'], [
    'Accept writes at any replica',
    'Detect and resolve conflicts automatically',
    'Propagate changes between replicas',
    'Maintain causal consistency',
    'Support version vectors',
    'Handle network partitions gracefully',
    'Provide conflict-free data types'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Accept writes at any replica
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def detect_and_resolve_conflicts_automatical(**kwargs) -> Dict:
    """
    FR-2: Detect and resolve conflicts automatically
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Propagate changes between replicas
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def maintain_causal_consistency(**kwargs) -> Dict:
    """
    FR-4: Maintain causal consistency
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_version_vectors(**kwargs) -> Dict:
    """
    FR-5: Support version vectors
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_network_partitions_gracefully(**kwargs) -> Dict:
    """
    FR-6: Handle network partitions gracefully
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_conflict_free_data_types(**kwargs) -> Dict:
    """
    FR-7: Provide conflict-free data types
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Global Inventory with Strong Consistency
 * From extracted-problems/system-design/storage.md
 */
export const globalInventoryStrongProblemDefinition: ProblemDefinition = {
  id: 'global-inventory-strong',
  title: 'Global Inventory with Strong Consistency',
  description: `Design a globally distributed inventory system with strong consistency. Prevent overselling across continents while maintaining low latency.
- Maintain globally consistent stock counts
- Support atomic cross-region transfers
- Prevent overselling under any partition
- Provide linearizable reads`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Maintain globally consistent stock counts',
    'Support atomic cross-region transfers',
    'Prevent overselling under any partition',
    'Provide linearizable reads',
    'Handle regional failures gracefully',
    'Enable global transactions',
    'Support multi-datacenter writes'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms same-region, < 300ms cross-region',
    'Request Rate: 100k inventory operations/sec',
    'Dataset Size: 50M SKUs across 10 regions',
    'Availability: 99.99% per region'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Warehouses (redirect_client) for globally consistent stock levels',
      },
      {
        type: 'load_balancer',
        reason: 'Need Global LB (lb) for globally consistent stock levels',
      },
      {
        type: 'cache',
        reason: 'Need Read Cache (cache) for globally consistent stock levels',
      },
      {
        type: 'storage',
        reason: 'Need US Zone (db_primary) for globally consistent stock levels',
      },
      {
        type: 'message_queue',
        reason: 'Need Audit Log (queue) for globally consistent stock levels',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Warehouses routes to Global LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Global LB routes to Inventory Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Inventory Service routes to Read Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Inventory Service routes to Tx Coordinators',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to US Zone',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to EU Zone',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to APAC Zone',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Tx Coordinators routes to Audit Log',
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

  scenarios: generateScenarios('global-inventory-strong', problemConfigs['global-inventory-strong'], [
    'Maintain globally consistent stock counts',
    'Support atomic cross-region transfers',
    'Prevent overselling under any partition',
    'Provide linearizable reads',
    'Handle regional failures gracefully',
    'Enable global transactions',
    'Support multi-datacenter writes'
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

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-1: Maintain globally consistent stock counts
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

def support_atomic_cross_region_transfers(**kwargs) -> Dict:
    """
    FR-2: Support atomic cross-region transfers
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def prevent_overselling_under_any_partition(**kwargs) -> Dict:
    """
    FR-3: Prevent overselling under any partition
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def get_item(item_id: str) -> Dict:
    """
    FR-4: Provide linearizable reads
    Naive implementation - retrieves from memory
    """
    return items.get(item_id)

def handle_regional_failures_gracefully(**kwargs) -> Dict:
    """
    FR-5: Handle regional failures gracefully
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_global_transactions(**kwargs) -> Dict:
    """
    FR-6: Enable global transactions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-7: Support multi-datacenter writes
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]`,
};

/**
 * Financial Ledger (Strict ACID)
 * From extracted-problems/system-design/storage.md
 */
export const financialLedgerProblemDefinition: ProblemDefinition = {
  id: 'financial-ledger',
  title: 'Financial Ledger (Strict ACID)',
  description: `Design a financial ledger with strict ACID, double-entry bookkeeping, and regulatory compliance. Handle high-value transactions with zero data loss.
- Implement double-entry bookkeeping
- Ensure zero balance drift
- Provide immutable audit trail
- Support complex transaction types`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Implement double-entry bookkeeping',
    'Ensure zero balance drift',
    'Provide immutable audit trail',
    'Support complex transaction types',
    'Enable real-time balance queries',
    'Handle regulatory reporting',
    'Prevent any data loss',
    'Support transaction replay'
  ],
  userFacingNFRs: [
    'Latency: P95 < 100ms for transactions',
    'Request Rate: 50k transactions/sec',
    'Dataset Size: 1B accounts, 100B transactions',
    'Availability: 99.999% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Financial Apps (redirect_client) for immutable financial transactions',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for immutable financial transactions',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Log (Kafka) (queue) for immutable financial transactions',
      },
      {
        type: 'storage',
        reason: 'Need PostgreSQL (db_primary) for immutable financial transactions',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Financial Apps routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Ledger Service',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Ledger Service routes to Event Log (Kafka)',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Event Log (Kafka) routes to PostgreSQL',
      },
      {
        from: 'storage',
        to: 'compute',
        reason: 'PostgreSQL routes to Read Replicas',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Log (Kafka) routes to Balance Projector',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Balance Projector routes to PostgreSQL',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Event Log (Kafka) routes to WORM Storage',
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

  scenarios: generateScenarios('financial-ledger', problemConfigs['financial-ledger'], [
    'Implement double-entry bookkeeping',
    'Ensure zero balance drift',
    'Provide immutable audit trail',
    'Support complex transaction types',
    'Enable real-time balance queries',
    'Handle regulatory reporting',
    'Prevent any data loss',
    'Support transaction replay'
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

def implement_double_entry_bookkeeping(**kwargs) -> Dict:
    """
    FR-1: Implement double-entry bookkeeping
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def ensure_zero_balance_drift(**kwargs) -> Dict:
    """
    FR-2: Ensure zero balance drift
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_immutable_audit_trail(**kwargs) -> Dict:
    """
    FR-3: Provide immutable audit trail
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_complex_transaction_types(**kwargs) -> Dict:
    """
    FR-4: Support complex transaction types
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_real_time_balance_queries(**kwargs) -> Dict:
    """
    FR-5: Enable real-time balance queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_regulatory_reporting(**kwargs) -> Dict:
    """
    FR-6: Handle regulatory reporting
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def prevent_any_data_loss(**kwargs) -> Dict:
    """
    FR-7: Prevent any data loss
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_transaction_replay(**kwargs) -> Dict:
    """
    FR-8: Support transaction replay
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Blockchain State Database
 * From extracted-problems/system-design/storage.md
 */
export const blockchainStateDbProblemDefinition: ProblemDefinition = {
  id: 'blockchain-state-db',
  title: 'Blockchain State Database',
  description: `Design a blockchain state database with Merkle trees. Support efficient state transitions, proofs, and historical queries.
- Store account balances and smart contract state
- Generate Merkle proofs for state
- Support state snapshots
- Enable fast state root calculation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store account balances and smart contract state',
    'Generate Merkle proofs for state',
    'Support state snapshots',
    'Enable fast state root calculation',
    'Provide historical state queries',
    'Handle state pruning',
    'Support light client verification'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms for state reads',
    'Request Rate: 100k state transitions/sec',
    'Dataset Size: 1B accounts, 10TB state',
    'Availability: 99.99% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Blockchain Nodes (redirect_client) for merkle tree state storage',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for merkle tree state storage',
      },
      {
        type: 'cache',
        reason: 'Need State Cache (cache) for merkle tree state storage',
      },
      {
        type: 'storage',
        reason: 'Need LevelDB (db_primary) for merkle tree state storage',
      },
      {
        type: 'object_storage',
        reason: 'Need Snapshot S3 (storage) for merkle tree state storage',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Blockchain Nodes routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to State Service',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'State Service routes to State Cache',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'State Service routes to LevelDB',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Pruning Workers routes to LevelDB',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Pruning Workers routes to Snapshot S3',
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

  scenarios: generateScenarios('blockchain-state-db', problemConfigs['blockchain-state-db'], [
    'Store account balances and smart contract state',
    'Generate Merkle proofs for state',
    'Support state snapshots',
    'Enable fast state root calculation',
    'Provide historical state queries',
    'Handle state pruning',
    'Support light client verification'
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
memory = {}

def create_user(user_id: str, **kwargs) -> Dict:
    """
    FR-1: Store account balances and smart contract state
    Naive implementation - stores user in memory
    """
    users[user_id] = {
        'id': user_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return users[user_id]

def generate_merkle_proofs_for_state(**kwargs) -> Dict:
    """
    FR-2: Generate Merkle proofs for state
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_state_snapshots(**kwargs) -> Dict:
    """
    FR-3: Support state snapshots
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_fast_state_root_calculation(**kwargs) -> Dict:
    """
    FR-4: Enable fast state root calculation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_historical_state_queries(**kwargs) -> Dict:
    """
    FR-5: Provide historical state queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_state_pruning(**kwargs) -> Dict:
    """
    FR-6: Handle state pruning
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_light_client_verification(**kwargs) -> Dict:
    """
    FR-7: Support light client verification
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Real-time Gaming State Sync
 * From extracted-problems/system-design/storage.md
 */
export const realtimeGamingStateProblemDefinition: ProblemDefinition = {
  id: 'realtime-gaming-state',
  title: 'Real-time Gaming State Sync',
  description: `Design a real-time gaming state synchronization system. Handle player positions, actions, and game state with <50ms latency globally.
- Sync player positions in real-time
- Handle 100+ players per game session
- Resolve conflicting actions
- Support lag compensation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Sync player positions in real-time',
    'Handle 100+ players per game session',
    'Resolve conflicting actions',
    'Support lag compensation',
    'Enable spectator mode',
    'Provide match replay',
    'Handle player disconnections'
  ],
  userFacingNFRs: [
    'Latency: P95 < 50ms globally',
    'Request Rate: 1M state updates/sec',
    'Dataset Size: 1M concurrent game sessions',
    'Availability: 99.95% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Game Clients (redirect_client) for sub-50ms state synchronization',
      },
      {
        type: 'cdn',
        reason: 'Need Edge PoPs (cdn) for sub-50ms state synchronization',
      },
      {
        type: 'load_balancer',
        reason: 'Need Session LB (lb) for sub-50ms state synchronization',
      },
      {
        type: 'cache',
        reason: 'Need Session State (cache) for sub-50ms state synchronization',
      },
      {
        type: 'message_queue',
        reason: 'Need Event Log (stream) for sub-50ms state synchronization',
      },
      {
        type: 'storage',
        reason: 'Need Match DB (db_primary) for sub-50ms state synchronization',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Game Clients routes to Edge PoPs',
      },
      {
        from: 'compute',
        to: 'load_balancer',
        reason: 'Edge PoPs routes to Session LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Session LB routes to Game Servers',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Game Servers routes to Session State',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Game Servers routes to Event Log',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Event Log routes to Match DB',
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

  scenarios: generateScenarios('realtime-gaming-state', problemConfigs['realtime-gaming-state'], [
    'Sync player positions in real-time',
    'Handle 100+ players per game session',
    'Resolve conflicting actions',
    'Support lag compensation',
    'Enable spectator mode',
    'Provide match replay',
    'Handle player disconnections'
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
real = {}

def sync_player_positions_in_real_time(**kwargs) -> Dict:
    """
    FR-1: Sync player positions in real-time
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_100_players_per_game_session(**kwargs) -> Dict:
    """
    FR-2: Handle 100+ players per game session
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def resolve_conflicting_actions(**kwargs) -> Dict:
    """
    FR-3: Resolve conflicting actions
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_lag_compensation(**kwargs) -> Dict:
    """
    FR-4: Support lag compensation
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_spectator_mode(**kwargs) -> Dict:
    """
    FR-5: Enable spectator mode
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_match_replay(**kwargs) -> Dict:
    """
    FR-6: Provide match replay
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_player_disconnections(**kwargs) -> Dict:
    """
    FR-7: Handle player disconnections
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * Autonomous Vehicle Map Database
 * From extracted-problems/system-design/storage.md
 */
export const autonomousVehicleMapProblemDefinition: ProblemDefinition = {
  id: 'autonomous-vehicle-map',
  title: 'Autonomous Vehicle Map Database',
  description: `Design a map database for autonomous vehicles. Store HD maps, handle real-time updates, and support sub-meter precision queries.
- Store HD map data with cm precision
- Support spatial queries (nearby objects)
- Handle real-time map updates
- Provide versioned map tiles`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Store HD map data with cm precision',
    'Support spatial queries (nearby objects)',
    'Handle real-time map updates',
    'Provide versioned map tiles',
    'Enable offline map downloads',
    'Support route planning queries',
    'Track dynamic obstacles'
  ],
  userFacingNFRs: [
    'Latency: P95 < 10ms for map queries',
    'Request Rate: 10M queries/sec from vehicles',
    'Dataset Size: 1PB HD map data',
    'Availability: 99.999% uptime, sub-10cm accuracy'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Vehicles (redirect_client) for high-precision spatial database',
      },
      {
        type: 'cdn',
        reason: 'Need Map CDN (cdn) for high-precision spatial database',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB (lb) for high-precision spatial database',
      },
      {
        type: 'cache',
        reason: 'Need Tile Cache (cache) for high-precision spatial database',
      },
      {
        type: 'storage',
        reason: 'Need PostGIS (db_primary) for high-precision spatial database',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Tiles (storage) for high-precision spatial database',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'cdn',
        reason: 'Vehicles routes to Map CDN',
      },
      {
        from: 'cdn',
        to: 'load_balancer',
        reason: 'Map CDN routes to LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to Map API',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Map API routes to Tile Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Map API routes to PostGIS',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Map API routes to S3 Tiles',
      },
      {
        from: 'object_storage',
        to: 'cdn',
        reason: 'S3 Tiles routes to Map CDN',
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

  scenarios: generateScenarios('autonomous-vehicle-map', problemConfigs['autonomous-vehicle-map'], [
    'Store HD map data with cm precision',
    'Support spatial queries (nearby objects)',
    'Handle real-time map updates',
    'Provide versioned map tiles',
    'Enable offline map downloads',
    'Support route planning queries',
    'Track dynamic obstacles'
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

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-1: Store HD map data with cm precision
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_spatial_queries_nearby_objects(**kwargs) -> Dict:
    """
    FR-2: Support spatial queries (nearby objects)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def update_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Handle real-time map updates
    Naive implementation - updates item in memory
    """
    if item_id in items:
        items[item_id].update(kwargs)
        items[item_id]['updated_at'] = datetime.now()
        return items[item_id]
    return None

def provide_versioned_map_tiles(**kwargs) -> Dict:
    """
    FR-4: Provide versioned map tiles
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_offline_map_downloads(**kwargs) -> Dict:
    """
    FR-5: Enable offline map downloads
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_route_planning_queries(**kwargs) -> Dict:
    """
    FR-6: Support route planning queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def track_event(event_type: str, item_id: str, metadata: Dict = None) -> Dict:
    """
    FR-7: Track dynamic obstacles
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
 * Petabyte-Scale Data Lake
 * From extracted-problems/system-design/storage.md
 */
export const petabyteDataLakeProblemDefinition: ProblemDefinition = {
  id: 'petabyte-data-lake',
  title: 'Petabyte-Scale Data Lake',
  description: `Design a petabyte-scale data lake. Handle diverse data formats, enable efficient analytics, and support both batch and streaming ingestion.
- Ingest data from 1000s of sources
- Store raw, processed, and curated data
- Support multiple file formats (Parquet, ORC, Avro)
- Enable schema evolution`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest data from 1000s of sources',
    'Store raw, processed, and curated data',
    'Support multiple file formats (Parquet, ORC, Avro)',
    'Enable schema evolution',
    'Provide data catalog and lineage',
    'Support time travel queries',
    'Enable data governance and compliance'
  ],
  userFacingNFRs: [
    'Latency: P95 < 1s for metadata queries, minutes for analytics',
    'Request Rate: 100k files/sec ingestion',
    'Dataset Size: 1PB+ multi-format data',
    'Availability: 99.9% uptime'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need Data Sources (redirect_client) for exabyte-ready data lake',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka (stream) for exabyte-ready data lake',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 Data Lake (storage) for exabyte-ready data lake',
      },
      {
        type: 'storage',
        reason: 'Need Hive Metastore (db_primary) for exabyte-ready data lake',
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
        reason: 'Data Sources routes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Kafka routes to ETL Workers',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'ETL Workers routes to S3 Data Lake',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'ETL Workers routes to Hive Metastore',
      },
      {
        from: 'object_storage',
        to: 'compute',
        reason: 'S3 Data Lake routes to Data Catalog',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Hive Metastore routes to Data Catalog',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'Query Engine routes to S3 Data Lake',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Query Engine routes to Hive Metastore',
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

  scenarios: generateScenarios('petabyte-data-lake', problemConfigs['petabyte-data-lake'], [
    'Ingest data from 1000s of sources',
    'Store raw, processed, and curated data',
    'Support multiple file formats (Parquet, ORC, Avro)',
    'Enable schema evolution',
    'Provide data catalog and lineage',
    'Support time travel queries',
    'Enable data governance and compliance'
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

def ingest_data_from_1000s_of_sources(**kwargs) -> Dict:
    """
    FR-1: Ingest data from 1000s of sources
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-2: Store raw, processed, and curated data
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_multiple_file_formats_parquet(**kwargs) -> Dict:
    """
    FR-3: Support multiple file formats (Parquet, ORC, Avro)
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_schema_evolution(**kwargs) -> Dict:
    """
    FR-4: Enable schema evolution
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def provide_data_catalog_and_lineage(**kwargs) -> Dict:
    """
    FR-5: Provide data catalog and lineage
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def support_time_travel_queries(**kwargs) -> Dict:
    """
    FR-6: Support time travel queries
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def enable_data_governance_and_compliance(**kwargs) -> Dict:
    """
    FR-7: Enable data governance and compliance
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

/**
 * AWS EBS-like Block Storage
 * From extracted-problems/system-design/storage.md
 */
export const blockStorageProblemDefinition: ProblemDefinition = {
  id: 'block-storage',
  title: 'AWS EBS-like Block Storage',
  description: `Design a distributed block storage system like AWS EBS. Provide durable volumes attached to compute instances, support snapshots, replication, and handle failures gracefully.
- Attach volumes to compute instances
- Replicate blocks across availability zones
- Create point-in-time snapshots
- Restore volumes from snapshots`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Attach volumes to compute instances',
    'Replicate blocks across availability zones',
    'Create point-in-time snapshots',
    'Restore volumes from snapshots',
    'Support volume resizing',
    'Handle node failures transparently'
  ],
  userFacingNFRs: [
    'Latency: P50 < 1ms, P95 < 3ms, P99 < 10ms for block I/O',
    'Request Rate: 100k IOPS per volume, millions globally',
    'Dataset Size: 1PB total across all volumes. 16TB max volume size',
    'Availability: 99.99% availability with auto-failover',
    'Durability: 11 nines annual durability via replication'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need VMs (redirect_client) for network-attached block storage with snapshots',
      },
      {
        type: 'load_balancer',
        reason: 'Need Volume Router (lb) for network-attached block storage with snapshots',
      },
      {
        type: 'cache',
        reason: 'Need Block Cache (cache) for network-attached block storage with snapshots',
      },
      {
        type: 'storage',
        reason: 'Need Volume Metadata (db_primary) for network-attached block storage with snapshots',
      },
      {
        type: 'object_storage',
        reason: 'Need Snapshot Storage (object_store) for network-attached block storage with snapshots',
      }
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'VMs routes to Volume Router',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Volume Router routes to Primary Nodes',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Replica Nodes',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Replica Nodes 2',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Primary Nodes routes to Block Cache',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Volume Metadata',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Snapshot Workers routes to Snapshot Storage',
      },
      {
        from: 'compute',
        to: 'compute',
        reason: 'Primary Nodes routes to Snapshot Workers',
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

  scenarios: generateScenarios('block-storage', problemConfigs['block-storage'], [
    'Attach volumes to compute instances',
    'Replicate blocks across availability zones',
    'Create point-in-time snapshots',
    'Restore volumes from snapshots',
    'Support volume resizing',
    'Handle node failures transparently'
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

def attach_volumes_to_compute_instances(**kwargs) -> Dict:
    """
    FR-1: Attach volumes to compute instances
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def replicate_blocks_across_availability_zon(**kwargs) -> Dict:
    """
    FR-2: Replicate blocks across availability zones
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-3: Create point-in-time snapshots
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def create_item(item_id: str, **kwargs) -> Dict:
    """
    FR-4: Restore volumes from snapshots
    Naive implementation - stores item in memory
    """
    items[item_id] = {
        'id': item_id,
        'created_at': datetime.now(),
        **kwargs
    }
    return items[item_id]

def support_volume_resizing(**kwargs) -> Dict:
    """
    FR-5: Support volume resizing
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def handle_node_failures_transparently(**kwargs) -> Dict:
    """
    FR-6: Handle node failures transparently
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}`,
};

// Auto-generate code challenges from functional requirements
(basicDatabaseDesignProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(basicDatabaseDesignProblemDefinition);
