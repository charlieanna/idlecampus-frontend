import { GuidedTutorial } from '../../types/guidedTutorial';

export const distributedCacheProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'distributed-cache-progressive',
  title: 'Design a Distributed Cache (Redis/Memcached)',
  description: 'Build a distributed caching system from simple LRU to cluster-scale cache',
  difficulty: 'hard',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Implement cache eviction policies (LRU, LFU)',
    'Design distributed cache with consistent hashing',
    'Handle cache invalidation patterns',
    'Build cache clusters with replication',
    'Implement advanced data structures'
  ],
  prerequisites: ['Data structures', 'Distributed systems', 'Memory management'],
  tags: ['caching', 'distributed-systems', 'memory', 'performance', 'redis'],

  progressiveStory: {
    title: 'Distributed Cache Evolution',
    premise: "You're building a caching layer for a high-traffic application. Starting with a simple in-memory cache, you'll evolve to a distributed system handling millions of requests per second.",
    phases: [
      { phase: 1, title: 'Single Node Cache', description: 'In-memory cache with eviction' },
      { phase: 2, title: 'Distributed Cache', description: 'Scale across multiple nodes' },
      { phase: 3, title: 'High Availability', description: 'Replication and failover' },
      { phase: 4, title: 'Advanced Features', description: 'Data structures and pub/sub' }
    ]
  },

  steps: [
    // PHASE 1: Single Node Cache (Steps 1-3)
    {
      id: 'step-1',
      title: 'Hash Map with TTL',
      phase: 1,
      phaseTitle: 'Single Node Cache',
      learningObjective: 'Build basic key-value cache with expiration',
      thinkingFramework: {
        framework: 'In-Memory Speed',
        approach: 'Hash map for O(1) get/set. Store expiration timestamp with each entry. Check TTL on read, lazy eviction.',
        keyInsight: 'Lazy expiration: dont actively scan for expired keys. Check on access, return null if expired. Background cleanup for memory.'
      },
      requirements: {
        functional: [
          'Set key-value with optional TTL',
          'Get value by key (return null if expired)',
          'Delete key explicitly',
          'Background cleanup of expired keys'
        ],
        nonFunctional: [
          'Get/set latency: < 1ms'
        ]
      },
      hints: [
        'Entry: {value, expiration_timestamp}',
        'On get: if now > expiration, return null, queue for delete',
        'Background thread: scan 20 random keys, delete expired'
      ],
      expectedComponents: ['Cache Store', 'Expiration Handler', 'Cleanup Worker'],
      successCriteria: ['Basic operations work', 'Expired keys return null'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'LRU Eviction Policy',
      phase: 1,
      phaseTitle: 'Single Node Cache',
      learningObjective: 'Implement Least Recently Used eviction',
      thinkingFramework: {
        framework: 'Bounded Memory',
        approach: 'Cache has max size. When full, evict least recently used. LRU = doubly linked list + hash map. O(1) operations.',
        keyInsight: 'Access moves node to head of list. Eviction removes tail. Hash map provides O(1) lookup to list node.'
      },
      requirements: {
        functional: [
          'Set maximum cache size (entries or bytes)',
          'Evict LRU entries when cache full',
          'Update access order on get and set',
          'Track cache hit/miss statistics'
        ],
        nonFunctional: [
          'Eviction is O(1)'
        ]
      },
      hints: [
        'Doubly linked list: head = most recent, tail = LRU',
        'Hash map: key → list node',
        'On access: remove node, add to head'
      ],
      expectedComponents: ['LRU List', 'Hash Map', 'Eviction Manager'],
      successCriteria: ['LRU eviction works correctly', 'Access order maintained'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'LFU Eviction Policy',
      phase: 1,
      phaseTitle: 'Single Node Cache',
      learningObjective: 'Implement Least Frequently Used eviction',
      thinkingFramework: {
        framework: 'Frequency-Based Eviction',
        approach: 'LFU evicts keys with lowest access frequency. Tracks count per key. Tie-breaker: oldest among same frequency.',
        keyInsight: 'Naive LFU is O(log n). O(1) LFU: group keys by frequency, maintain min frequency pointer. Double linked list per frequency.'
      },
      requirements: {
        functional: [
          'Track access frequency per key',
          'Evict least frequently used on full',
          'Handle frequency ties with recency',
          'Support frequency decay over time'
        ],
        nonFunctional: [
          'All operations O(1)'
        ]
      },
      hints: [
        'frequency_map: freq → list of keys at that freq',
        'min_freq pointer to lowest non-empty freq',
        'On access: move key from freq list to freq+1 list'
      ],
      expectedComponents: ['LFU Manager', 'Frequency Buckets', 'Access Counter'],
      successCriteria: ['LFU eviction correct', 'O(1) operations achieved'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Distributed Cache (Steps 4-6)
    {
      id: 'step-4',
      title: 'Consistent Hashing for Distribution',
      phase: 2,
      phaseTitle: 'Distributed Cache',
      learningObjective: 'Distribute keys across cache nodes',
      thinkingFramework: {
        framework: 'Minimal Redistribution',
        approach: 'Simple hash mod N breaks on node add/remove. Consistent hashing: hash ring, keys map to next node clockwise. Minimal key movement.',
        keyInsight: 'Virtual nodes: each physical node has 100+ positions on ring. Improves balance, especially with few nodes.'
      },
      requirements: {
        functional: [
          'Hash keys to cache nodes',
          'Handle node addition with minimal redistribution',
          'Handle node removal gracefully',
          'Balance load across nodes'
        ],
        nonFunctional: [
          'Key redistribution: ~1/N on node change'
        ]
      },
      hints: [
        'Ring: sorted list of (hash, node) tuples',
        'Lookup: binary search for hash >= key_hash',
        'Virtual nodes: node_0_v0, node_0_v1, ... on ring'
      ],
      expectedComponents: ['Hash Ring', 'Node Manager', 'Key Router'],
      successCriteria: ['Keys route to correct node', 'Minimal redistribution on changes'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Cache Client Library',
      phase: 2,
      phaseTitle: 'Distributed Cache',
      learningObjective: 'Build smart client for distributed cache',
      thinkingFramework: {
        framework: 'Client-Side Intelligence',
        approach: 'Client knows cluster topology. Routes directly to correct node. Connection pooling for efficiency. Handles retries.',
        keyInsight: 'Smart client vs proxy: smart client has lower latency (direct connection) but more complex. Proxy is simpler but adds hop.'
      },
      requirements: {
        functional: [
          'Route requests to correct node',
          'Maintain connection pool per node',
          'Handle node failures with retry',
          'Refresh topology on changes'
        ],
        nonFunctional: [
          'Client overhead < 0.5ms'
        ]
      },
      hints: [
        'Connection pool: min 2, max 10 per node',
        'Topology refresh: on error or periodic (30s)',
        'Retry: once on connection error, not on cache miss'
      ],
      expectedComponents: ['Cache Client', 'Connection Pool', 'Topology Watcher'],
      successCriteria: ['Client routes correctly', 'Connections reused efficiently'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Cache Invalidation Patterns',
      phase: 2,
      phaseTitle: 'Distributed Cache',
      learningObjective: 'Handle cache invalidation across nodes',
      thinkingFramework: {
        framework: 'Invalidation Strategies',
        approach: 'Stale cache = bugs. Patterns: TTL (passive), explicit delete (active), write-through (synchronous). Choose based on consistency needs.',
        keyInsight: 'Two hard things in CS: cache invalidation, naming, and off-by-one errors. TTL is safest, explicit delete is most precise.'
      },
      requirements: {
        functional: [
          'Support TTL-based expiration',
          'Support explicit key invalidation',
          'Support pattern-based invalidation (delete all user:*)',
          'Handle write-through caching'
        ],
        nonFunctional: [
          'Invalidation propagates within 100ms'
        ]
      },
      hints: [
        'Tags: associate keys with tags, invalidate by tag',
        'Write-through: update cache on DB write',
        'Pub/sub for invalidation broadcast'
      ],
      expectedComponents: ['Invalidation Service', 'Tag Manager', 'Broadcast Channel'],
      successCriteria: ['Invalidation methods work', 'No stale data after invalidation'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: High Availability (Steps 7-9)
    {
      id: 'step-7',
      title: 'Primary-Replica Replication',
      phase: 3,
      phaseTitle: 'High Availability',
      learningObjective: 'Replicate data for fault tolerance',
      thinkingFramework: {
        framework: 'Async Replication',
        approach: 'Primary handles writes, replicates to replicas. Reads can go to replicas (eventual consistency). On primary failure, promote replica.',
        keyInsight: 'Async replication: fast but can lose recent writes on failure. Sync replication: durable but slower. Usually async for cache (can reload from DB).'
      },
      requirements: {
        functional: [
          'Replicate writes from primary to replicas',
          'Allow reads from replicas',
          'Promote replica on primary failure',
          'Support configurable replication factor'
        ],
        nonFunctional: [
          'Replication lag < 100ms',
          'Failover < 30 seconds'
        ]
      },
      hints: [
        'Stream write operations to replicas',
        'Replica lag = primary_offset - replica_offset',
        'Sentinel pattern for failover coordination'
      ],
      expectedComponents: ['Replication Stream', 'Replica Manager', 'Failover Coordinator'],
      successCriteria: ['Writes replicated', 'Failover automatic'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Cluster Mode',
      phase: 3,
      phaseTitle: 'High Availability',
      learningObjective: 'Build multi-node cache cluster',
      thinkingFramework: {
        framework: 'Sharding + Replication',
        approach: 'Combine sharding (distribute data) with replication (redundancy). Each shard has primary + replicas. Redis Cluster model.',
        keyInsight: 'Slot-based sharding: 16384 slots, each shard owns range. Easier to rebalance than consistent hashing for cluster operations.'
      },
      requirements: {
        functional: [
          'Divide keyspace into slots',
          'Assign slot ranges to shards',
          'Replicate each shard',
          'Handle slot migration for rebalancing'
        ],
        nonFunctional: [
          'Survive minority node failures',
          'Zero downtime rebalancing'
        ]
      },
      hints: [
        'Slot = CRC16(key) % 16384',
        'Shard: slots 0-5460, another: 5461-10922, etc.',
        'Gossip protocol for cluster state'
      ],
      expectedComponents: ['Slot Manager', 'Cluster Coordinator', 'Gossip Protocol'],
      successCriteria: ['Cluster routes correctly', 'Rebalancing works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-9',
      title: 'Cache Stampede Prevention',
      phase: 3,
      phaseTitle: 'High Availability',
      learningObjective: 'Handle cache miss thundering herd',
      thinkingFramework: {
        framework: 'Single Flight',
        approach: 'Hot key expires, 1000 requests hit DB simultaneously. Single flight: first request fetches, others wait. Or probabilistic early refresh.',
        keyInsight: 'Locking can become bottleneck. Probabilistic refresh: refresh before expiry with probability increasing as TTL approaches.'
      },
      requirements: {
        functional: [
          'Detect cache miss stampede conditions',
          'Coalesce duplicate requests (single flight)',
          'Implement probabilistic early refresh',
          'Support background refresh without blocking'
        ],
        nonFunctional: [
          'DB load during stampede: 1 request instead of N'
        ]
      },
      hints: [
        'Lock with key_lock:{key} before fetch',
        'Others wait with timeout, then retry',
        'Probabilistic: refresh_prob = (now - last_refresh) / ttl'
      ],
      expectedComponents: ['Request Coalescer', 'Lock Manager', 'Background Refresher'],
      successCriteria: ['Stampede prevented', 'Hot keys refreshed proactively'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Advanced Features (Steps 10-12)
    {
      id: 'step-10',
      title: 'Advanced Data Structures',
      phase: 4,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Support lists, sets, sorted sets, hashes',
      thinkingFramework: {
        framework: 'Rich Data Types',
        approach: 'Beyond key-value: lists (queues), sets (membership), sorted sets (leaderboards), hashes (objects). Each has optimal internal representation.',
        keyInsight: 'Sorted set: skip list + hash map. O(log N) insert/delete, O(1) score lookup. Perfect for leaderboards, rate limiting windows.'
      },
      requirements: {
        functional: [
          'Lists: push, pop, range operations',
          'Sets: add, remove, membership, intersection',
          'Sorted sets: add with score, range by score/rank',
          'Hashes: field-level get/set'
        ],
        nonFunctional: [
          'Operations match Redis complexity'
        ]
      },
      hints: [
        'List: doubly linked list (fast ends) or ziplist (small)',
        'Set: hash set or intset (small integers)',
        'Sorted set: skip list + hash for score lookup'
      ],
      expectedComponents: ['List Store', 'Set Store', 'Sorted Set Store', 'Hash Store'],
      successCriteria: ['All data structures work', 'Performance matches expectations'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Pub/Sub Messaging',
      phase: 4,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Implement publish/subscribe for real-time updates',
      thinkingFramework: {
        framework: 'In-Process Message Broker',
        approach: 'Publishers send to channels, subscribers receive. No persistence (fire and forget). Great for cache invalidation broadcast, real-time notifications.',
        keyInsight: 'Pub/sub is per-node. For cluster, client subscribes to all nodes or use keyspace notifications routed by key.'
      },
      requirements: {
        functional: [
          'Subscribe to channels',
          'Publish messages to channels',
          'Pattern subscriptions (user:*)',
          'Handle subscriber disconnect'
        ],
        nonFunctional: [
          'Message delivery < 10ms',
          'Support 100K subscribers'
        ]
      },
      hints: [
        'Channel: list of subscriber connections',
        'Pattern: regex matching on publish',
        'No persistence: missed messages are lost'
      ],
      expectedComponents: ['Channel Manager', 'Subscriber Registry', 'Message Router'],
      successCriteria: ['Pub/sub works', 'Patterns match correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Lua Scripting & Transactions',
      phase: 4,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Support atomic operations with scripting',
      thinkingFramework: {
        framework: 'Server-Side Logic',
        approach: 'Multiple operations need atomicity (check-and-set). Options: MULTI/EXEC transactions (optimistic), Lua scripts (pessimistic, single-threaded execution).',
        keyInsight: 'Lua scripts execute atomically: no other commands run during script. Enables complex logic without races. But blocks server during execution.'
      },
      requirements: {
        functional: [
          'Support MULTI/EXEC transactions',
          'Execute Lua scripts atomically',
          'Pass keys and arguments to scripts',
          'Cache compiled scripts (EVALSHA)'
        ],
        nonFunctional: [
          'Script execution < 100ms (or timeout)'
        ]
      },
      hints: [
        'MULTI queues commands, EXEC runs atomically',
        'Lua: all keys accessed must be declared upfront (for cluster)',
        'Script cache: SHA1(script) → compiled function'
      ],
      expectedComponents: ['Transaction Manager', 'Lua VM', 'Script Cache'],
      successCriteria: ['Transactions atomic', 'Scripts execute correctly'],
      estimatedTime: '8 minutes'
    }
  ]
};
