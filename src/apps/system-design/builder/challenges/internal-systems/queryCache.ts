import { Challenge } from '../../types/testCase';

export const queryCacheChallenge: Challenge = {
  id: 'query_cache',
  title: 'Query Result Cache (Presto/Druid style)',
  difficulty: 'advanced',
  description: `Design a query result cache for data warehouse to speed up repeated queries.

Cache query results with intelligent invalidation, support partial cache hits (query rewriting),
and handle high cardinality of queries. Reduce query latency from seconds to milliseconds.

Example workflow:
- Query runs → Cache result with TTL
- Same query → Serve from cache (1ms vs 5s)
- Table updated → Invalidate affected queries
- Similar query → Partial cache hit (rewrite to use cached data)

Key challenges:
- Cache key generation (normalize SQL)
- Intelligent invalidation (table-level, row-level)
- Partial cache hits and query rewriting
- High cardinality (millions of unique queries)`,

  requirements: {
    functional: [
      'Cache query results with configurable TTL',
      'Smart cache invalidation on data changes',
      'Query normalization for cache keys',
      'Partial cache hit detection',
      'Cache warming for popular queries',
    ],
    traffic: '10,000 queries/sec (70% cache hit rate)',
    latency: 'Cache hit < 5ms, miss = normal query time',
    availability: '99.9% uptime (fallback to query on cache miss)',
    budget: '$6,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Query Caching',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Cache query results and serve from cache.',
      traffic: {
        type: 'read',
        rps: 1000,
        cacheHitRate: 0.7,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        maxCacheHitLatency: 5,
        cacheHitRate: 0.7,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 5 } },
          { type: 'redis', config: { memorySizeGB: 64 } },
          { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 200 } },
          { type: 'kafka', config: { partitions: 20 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'kafka' },
        ],
        explanation: `Architecture:
- Redis stores cached query results
- App servers normalize queries for cache keys
- PostgreSQL tracks table versions for invalidation
- Kafka streams table change events`,
      },
    },

    {
      name: 'Query Normalization',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Normalize queries to improve cache hit rate.',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        cacheHitRate: 0.8, // Higher with normalization
      },
      hints: [
        'Normalize: Strip whitespace, lowercase keywords',
        'Canonicalize: ORDER BY, column order',
        'Parameter binding: SELECT * WHERE id = ?',
        'Ignore comments and formatting',
      ],
    },

    {
      name: 'Smart Cache Invalidation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Invalidate cached queries when underlying data changes.',
      traffic: {
        type: 'mixed',
        rps: 800,
        readRatio: 0.9,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        staleDataRate: 0, // No stale results served
        invalidationLatency: 1000, // <1s
      },
      hints: [
        'Table-level invalidation: Any write → invalidate all queries on table',
        'Row-level: Track which rows each query accessed',
        'TTL-based: Expire after N minutes',
        'Version-based: Table version number',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High Query Throughput',
      type: 'performance',
      requirement: 'NFR-P',
      description: '10K QPS with 70% cache hit rate.',
      traffic: {
        type: 'read',
        rps: 10000,
        cacheHitRate: 0.7,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 10, // Cache hits
        cacheHitRate: 0.7,
      },
      hints: [
        'Redis cluster for horizontal scaling',
        'Consistent hashing for key distribution',
        'Compress large results (>1MB)',
        'LRU eviction for memory management',
      ],
    },

    {
      name: 'Partial Cache Hits',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Detect partial cache hits and rewrite queries.',
      traffic: {
        type: 'read',
        rps: 500,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        partialHitRate: 0.3, // 30% partial hits
      },
      hints: [
        'Example: Cached SELECT * → New SELECT col1 (subset)',
        'Cached WHERE id IN (1,2,3) → New WHERE id IN (1,2,3,4)',
        'Rewrite query to use cached base data',
        'Requires query parser and rewriter',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'High Cardinality Queries',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Handle millions of unique queries.',
      traffic: {
        type: 'read',
        rps: 5000,
        uniqueQueries: 1000000,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        maxP99Latency: 15,
      },
      hints: [
        'LRU eviction (keep popular queries)',
        'Bloom filter to quickly check cache existence',
        'Tiered caching (hot in Redis, warm in disk)',
        'Probabilistic admission (don\'t cache one-time queries)',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Cache Failure Fallback',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Gracefully degrade to database on cache failure.',
      traffic: {
        type: 'read',
        rps: 2000,
        cacheFailure: true,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
        maxP99Latency: 5000, // Normal query latency
      },
      hints: [
        'Catch cache errors, fallback to DB',
        'Circuit breaker for cache',
        'Alert on high cache miss rate',
        'Async cache rebuild',
      ],
    },
  ],

  hints: [
    {
      category: 'Cache Key Generation',
      items: [
        'Normalize SQL: lowercase, strip whitespace',
        'Canonicalize: Sort ORDER BY, WHERE clauses',
        'Include: user context (for row-level security)',
        'Hash: MD5/SHA-1 of normalized query',
      ],
    },
    {
      category: 'Invalidation Strategies',
      items: [
        'TTL: Simple, may serve stale data',
        'Table version: Increment on write, invalidate old',
        'Row-level tracking: Complex, accurate',
        'Hybrid: TTL + explicit invalidation',
      ],
    },
    {
      category: 'Optimization',
      items: [
        'Compression: Snappy for large results',
        'Admission control: Don\'t cache one-time queries',
        'Prefetching: Warm cache for scheduled queries',
        'Partitioning: Shard cache by table or user',
      ],
    },
    {
      category: 'Partial Hits',
      items: [
        'Detect: Query is subset/superset of cached',
        'Rewrite: Use cached data + delta query',
        'Example: Cached WHERE date > X, new WHERE date > X AND status = Y',
        'Requires SQL parser (sqlparse, JSQLParser)',
      ],
    },
  ],

  learningObjectives: [
    'Query result caching strategies',
    'SQL query normalization',
    'Cache invalidation techniques',
    'Partial cache hit detection',
    'High-cardinality caching',
  ],

  realWorldExample: `**Presto Query Cache:**
- Coordinator caches query plans and results
- Table version-based invalidation
- Configurable TTL per query
- Supports partial result caching

**Druid Query Cache:**
- Per-segment result caching
- Immutable segments (never invalidate)
- LRU eviction with memory limits
- Distributed cache across cluster

**Snowflake Result Cache:**
- 24-hour TTL for cached results
- Invalidated on table changes
- Free (no compute cost for cache hits)
- Per-user and per-query caching`,

  pythonTemplate: `from typing import Dict, Any
import hashlib
import json

class QueryCache:
    def __init__(self):
        self.cache = None  # Redis
        self.db = None  # PostgreSQL
        self.table_versions = {}  # Table → version mapping

    def execute_query(self, sql: str, user_context: Dict) -> Any:
        """Execute query with caching."""
        # TODO: Normalize SQL
        # TODO: Generate cache key
        # TODO: Check cache
        # TODO: If hit, return cached result
        # TODO: If miss, execute query, cache result
        pass

    def normalize_query(self, sql: str) -> str:
        """Normalize SQL for consistent cache keys."""
        # TODO: Convert to lowercase
        # TODO: Strip whitespace
        # TODO: Remove comments
        # TODO: Canonicalize (sort clauses)
        return sql.lower().strip()

    def generate_cache_key(self, sql: str, user_context: Dict) -> str:
        """Generate cache key from normalized query."""
        normalized = self.normalize_query(sql)
        # Include user context for row-level security
        key_data = f"{normalized}:{json.dumps(user_context, sort_keys=True)}"
        return hashlib.md5(key_data.encode()).hexdigest()

    def check_cache(self, cache_key: str) -> Any:
        """Check if query result is cached."""
        # TODO: Get from Redis
        # TODO: Decompress if needed
        # TODO: Return result or None
        return None

    def cache_result(self, cache_key: str, result: Any,
                    tables: list, ttl: int = 3600):
        """Cache query result."""
        # TODO: Compress result
        # TODO: Store in Redis with TTL
        # TODO: Track which tables this query depends on
        # TODO: For invalidation
        pass

    def invalidate_cache(self, table: str):
        """Invalidate all queries that depend on table."""
        # TODO: Increment table version
        # TODO: Find all cache keys for table
        # TODO: Delete from Redis
        # TODO: Or use versioned keys (automatic invalidation)
        pass

    def detect_partial_hit(self, sql: str) -> str:
        """Detect if query can use partially cached result."""
        # TODO: Parse SQL query
        # TODO: Check for cached base query
        # TODO: If found, rewrite to use cached data
        # TODO: Return cache key or None
        return None

    def warm_cache(self, queries: list):
        """Pre-warm cache with popular queries."""
        # TODO: Execute queries
        # TODO: Cache results
        # TODO: Schedule for periodic refresh
        pass

    def get_stats(self) -> Dict:
        """Get cache statistics."""
        # TODO: Hit rate, miss rate
        # TODO: Eviction count
        # TODO: Memory usage
        return {
            'hit_rate': 0.75,
            'miss_rate': 0.25,
            'evictions': 1000,
            'memory_mb': 512
        }

# Example usage
if __name__ == '__main__':
    cache = QueryCache()

    # Execute with caching
    sql = 'SELECT * FROM users WHERE status = "active"'
    user_ctx = {'user_id': 'alice', 'role': 'analyst'}
    result = cache.execute_query(sql, user_ctx)

    # Invalidate on table update
    cache.invalidate_cache('users')

    # Warm cache
    cache.warm_cache([
        'SELECT COUNT(*) FROM orders',
        'SELECT * FROM products WHERE category = "electronics"'
    ])

    # Stats
    stats = cache.get_stats()
    print(f"Cache hit rate: {stats['hit_rate']}")`,
};
