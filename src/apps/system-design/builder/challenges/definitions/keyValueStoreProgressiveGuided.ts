import { GuidedTutorial } from '../../types/guidedTutorial';

export const keyValueStoreProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'key-value-store-progressive',
  title: 'Design a Distributed Key-Value Store',
  description: 'Build a key-value store from simple hash map to globally distributed database',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Implement persistent key-value storage with LSM trees',
    'Design consistent hashing for data distribution',
    'Handle replication and consistency trade-offs',
    'Build conflict resolution for concurrent writes',
    'Implement transactions and ACID guarantees'
  ],
  prerequisites: ['Data structures', 'Distributed systems', 'CAP theorem'],
  tags: ['database', 'distributed-systems', 'storage', 'consistency', 'replication'],

  progressiveStory: {
    title: 'Key-Value Store Evolution',
    premise: "You're building a distributed key-value store like DynamoDB or Redis. Starting with a simple in-memory store, you'll evolve to handle petabytes with tunable consistency and global distribution.",
    phases: [
      { phase: 1, title: 'Single Node Store', description: 'Basic get/set with persistence' },
      { phase: 2, title: 'Distributed Store', description: 'Partition data across nodes' },
      { phase: 3, title: 'Highly Available', description: 'Replication and failure handling' },
      { phase: 4, title: 'Advanced Features', description: 'Transactions and global scale' }
    ]
  },

  steps: [
    // PHASE 1: Single Node Store (Steps 1-3)
    {
      id: 'step-1',
      title: 'In-Memory Hash Map',
      phase: 1,
      phaseTitle: 'Single Node Store',
      learningObjective: 'Implement basic get/set operations',
      thinkingFramework: {
        framework: 'Start Simple',
        approach: 'Hash map is O(1) for get/set. Start here. Key → value mapping with string keys and binary values.',
        keyInsight: 'Support TTL (expiration) from the start. Lazy expiration on read + background cleanup.'
      },
      requirements: {
        functional: [
          'Set key-value pairs',
          'Get value by key',
          'Delete key',
          'Support TTL (time to live)'
        ],
        nonFunctional: []
      },
      hints: [
        'Hash map: Map<string, {value, expiration}>',
        'Check expiration on get, return null if expired',
        'Background thread to clean expired keys'
      ],
      expectedComponents: ['Hash Map Store', 'Expiration Handler', 'API Layer'],
      successCriteria: ['Get/set works correctly', 'Expired keys return null'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Write-Ahead Log (WAL)',
      phase: 1,
      phaseTitle: 'Single Node Store',
      learningObjective: 'Add durability with write-ahead logging',
      thinkingFramework: {
        framework: 'Durability First',
        approach: 'In-memory is fast but lost on crash. WAL: append operation to disk log before applying. On recovery, replay log.',
        keyInsight: 'WAL is append-only (sequential writes = fast). fsync after each write for true durability, or batch for performance.'
      },
      requirements: {
        functional: [
          'Log all write operations before applying',
          'Replay log on startup to recover state',
          'Compact log periodically (remove obsolete entries)',
          'Configurable fsync policy (every write vs batched)'
        ],
        nonFunctional: [
          'Survive process crash without data loss'
        ]
      },
      hints: [
        'Log entry: {operation, key, value, timestamp}',
        'On replay: apply operations in order',
        'Compact: snapshot current state, truncate log'
      ],
      expectedComponents: ['WAL Writer', 'Recovery Manager', 'Log Compactor'],
      successCriteria: ['Data survives restart', 'Recovery completes correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'LSM Tree Storage',
      phase: 1,
      phaseTitle: 'Single Node Store',
      learningObjective: 'Implement log-structured merge tree for efficiency',
      thinkingFramework: {
        framework: 'Write-Optimized Storage',
        approach: 'WAL + hash map doesnt scale. LSM tree: write to memory (memtable), flush to disk (SSTable), merge SSTables. Optimized for writes.',
        keyInsight: 'Reads check memtable → L0 SSTables → L1 → ... Use bloom filters to skip SSTables that dont contain key.'
      },
      requirements: {
        functional: [
          'Buffer writes in memtable (sorted in memory)',
          'Flush memtable to immutable SSTable on disk',
          'Compact SSTables to reduce read amplification',
          'Use bloom filters to speed up reads'
        ],
        nonFunctional: [
          'Write throughput: 100K ops/sec',
          'Read latency: < 10ms'
        ]
      },
      hints: [
        'Memtable: red-black tree or skip list',
        'SSTable: sorted key-value pairs + index',
        'Leveled compaction: L0 → L1 → L2 with size ratio'
      ],
      expectedComponents: ['Memtable', 'SSTable Writer', 'Compaction Manager', 'Bloom Filter'],
      successCriteria: ['Writes are fast', 'Reads find data across levels'],
      estimatedTime: '10 minutes'
    },

    // PHASE 2: Distributed Store (Steps 4-6)
    {
      id: 'step-4',
      title: 'Consistent Hashing',
      phase: 2,
      phaseTitle: 'Distributed Store',
      learningObjective: 'Distribute keys across multiple nodes',
      thinkingFramework: {
        framework: 'Minimal Redistribution',
        approach: 'Simple hash(key) % N breaks when N changes. Consistent hashing: keys and nodes on ring. Key goes to next node clockwise.',
        keyInsight: 'When node added/removed, only K/N keys move on average (K=total keys, N=nodes). Virtual nodes improve balance.'
      },
      requirements: {
        functional: [
          'Map keys to nodes using consistent hashing',
          'Handle node addition with minimal data movement',
          'Handle node removal with redistribution',
          'Use virtual nodes for better balance'
        ],
        nonFunctional: [
          'Key redistribution affects < 1/N of data on node change'
        ]
      },
      hints: [
        'Ring: sorted list of (hash, node) pairs',
        'Lookup: binary search for hash >= key_hash',
        'Virtual nodes: each physical node has 100-200 positions'
      ],
      expectedComponents: ['Hash Ring', 'Node Manager', 'Data Migration Service'],
      successCriteria: ['Keys route to correct node', 'Node changes cause minimal movement'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Request Routing',
      phase: 2,
      phaseTitle: 'Distributed Store',
      learningObjectpoint: 'Route requests to correct partition',
      thinkingFramework: {
        framework: 'Routing Strategies',
        approach: 'Client needs to find right node. Options: client-side routing (client knows ring), proxy routing (coordinator routes), or gossip-based discovery.',
        keyInsight: 'Any-node routing: client connects to any node, that node forwards to correct owner. Simpler client, extra hop.'
      },
      requirements: {
        functional: [
          'Client discovers cluster topology',
          'Route requests to key owner node',
          'Handle routing during node transitions',
          'Support any-node queries (proxy to owner)'
        ],
        nonFunctional: [
          'Routing adds < 1ms latency'
        ]
      },
      hints: [
        'Gossip protocol for topology propagation',
        'Cache topology at client with TTL',
        'Redirect response if topology stale'
      ],
      expectedComponents: ['Router', 'Topology Service', 'Gossip Protocol'],
      successCriteria: ['Requests reach correct node', 'Topology changes propagate quickly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Data Rebalancing',
      phase: 2,
      phaseTitle: 'Distributed Store',
      learningObjective: 'Move data when cluster topology changes',
      thinkingFramework: {
        framework: 'Online Migration',
        approach: 'When node joins, it must receive its key range from existing nodes. Stream data while serving requests. Coordinate handoff.',
        keyInsight: 'Two-phase handoff: new node receives data, then atomically takes ownership. Reads go to old node until handoff complete.'
      },
      requirements: {
        functional: [
          'Stream key ranges to new nodes',
          'Continue serving during rebalancing',
          'Track rebalancing progress',
          'Handle rebalancing failures'
        ],
        nonFunctional: [
          'Zero downtime during rebalancing',
          'Rebalancing speed: 100 MB/s per node'
        ]
      },
      hints: [
        'Snapshot + stream approach: snapshot existing, stream new writes',
        'Checkpointing for resumable transfers',
        'Throttle to avoid impacting live traffic'
      ],
      expectedComponents: ['Rebalancer', 'Data Streamer', 'Handoff Coordinator'],
      successCriteria: ['Data moves without downtime', 'No data loss during transfer'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Highly Available (Steps 7-9)
    {
      id: 'step-7',
      title: 'Replication',
      phase: 3,
      phaseTitle: 'Highly Available',
      learningObjective: 'Replicate data across multiple nodes',
      thinkingFramework: {
        framework: 'Replication Factor',
        approach: 'Store N copies of each key on N consecutive nodes in ring. Replication factor 3 means key lives on 3 nodes. Survive N-1 failures.',
        keyInsight: 'Prefer rack/AZ diversity for replicas. All 3 copies in same rack = single point of failure.'
      },
      requirements: {
        functional: [
          'Replicate writes to N nodes',
          'Read from any replica (for availability)',
          'Configure replication factor',
          'Ensure replicas are in different failure domains'
        ],
        nonFunctional: [
          'Survive up to N-1 node failures'
        ]
      },
      hints: [
        'N=3 is common: balance durability and overhead',
        'Coordinator writes to all replicas, returns on W acks',
        'Rack-aware placement: hash includes rack ID'
      ],
      expectedComponents: ['Replication Manager', 'Replica Selector', 'Rack-Aware Placer'],
      successCriteria: ['Data replicated to N nodes', 'Failures dont lose data'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Quorum Consistency',
      phase: 3,
      phaseTitle: 'Highly Available',
      learningObjective: 'Implement tunable consistency with quorums',
      thinkingFramework: {
        framework: 'W + R > N',
        approach: 'Strong consistency: W + R > N (write and read quorums overlap). W=N, R=1 for write-heavy. W=1, R=N for read-heavy. Trade latency for consistency.',
        keyInsight: 'W=1, R=1 is eventually consistent (fast but stale reads possible). W=2, R=2 with N=3 is strongly consistent.'
      },
      requirements: {
        functional: [
          'Configure write quorum (W)',
          'Configure read quorum (R)',
          'Return after W successful writes',
          'Read from R replicas and return latest'
        ],
        nonFunctional: []
      },
      hints: [
        'Version/timestamp each write for "latest" detection',
        'Timeout slow replicas, proceed with quorum',
        'Read repair: if replicas disagree, fix stale ones'
      ],
      expectedComponents: ['Quorum Handler', 'Version Resolver', 'Read Repair Service'],
      successCriteria: ['Quorum semantics enforced', 'Correct value returned'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Conflict Resolution',
      phase: 3,
      phaseTitle: 'Highly Available',
      learningObjective: 'Handle concurrent writes to same key',
      thinkingFramework: {
        framework: 'Vector Clocks vs LWW',
        approach: 'Concurrent writes create conflicts. Last-Write-Wins (LWW): timestamp decides. Vector clocks: track causality, surface conflicts to app.',
        keyInsight: 'LWW loses data silently. Vector clocks are complex but preserve concurrent writes. Choose based on use case.'
      },
      requirements: {
        functional: [
          'Detect concurrent writes (no causal order)',
          'Implement Last-Write-Wins resolution',
          'Implement vector clock tracking (optional)',
          'Surface conflicts to application (optional)'
        ],
        nonFunctional: []
      },
      hints: [
        'LWW: use physical timestamp + node ID for tie-breaker',
        'Vector clock: {node: counter} incremented on write',
        'Conflict: neither VC dominates the other'
      ],
      expectedComponents: ['Conflict Detector', 'LWW Resolver', 'Vector Clock Manager'],
      successCriteria: ['Conflicts resolved deterministically', 'No data corruption'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Advanced Features (Steps 10-12)
    {
      id: 'step-10',
      title: 'Anti-Entropy & Repair',
      phase: 4,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Detect and fix replica divergence',
      thinkingFramework: {
        framework: 'Background Consistency',
        approach: 'Replicas drift over time (missed writes, partial failures). Merkle trees detect differences efficiently. Repair only divergent ranges.',
        keyInsight: 'Merkle tree: hash tree over key ranges. Compare roots → different means subtrees differ → drill down to find divergent keys.'
      },
      requirements: {
        functional: [
          'Build Merkle tree over key ranges',
          'Compare trees between replicas',
          'Identify divergent key ranges',
          'Sync only divergent data'
        ],
        nonFunctional: [
          'Full consistency check in < 1 hour for 1TB'
        ]
      },
      hints: [
        'Merkle tree: leaf = hash of keys in range, parent = hash of children',
        'Compare incrementally: start at root, descend into differences',
        'Schedule repairs during low traffic'
      ],
      expectedComponents: ['Merkle Tree Builder', 'Tree Comparator', 'Repair Streamer'],
      successCriteria: ['Divergence detected efficiently', 'Repairs complete correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Transactions',
      phase: 4,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Support multi-key atomic operations',
      thinkingFramework: {
        framework: 'Distributed Transactions',
        approach: 'Single-key ops are easy. Multi-key needs coordination. Two-phase commit (2PC) or optimistic concurrency control (OCC) for ACID.',
        keyInsight: '2PC has blocking problem. Paxos-based commit (Spanner) or timestamp ordering (TiDB) avoid it but add complexity.'
      },
      requirements: {
        functional: [
          'Begin/commit/rollback transactions',
          'Atomic multi-key writes',
          'Isolation: transactions dont see partial writes',
          'Handle coordinator failures'
        ],
        nonFunctional: [
          'Transaction latency < 100ms for 3-key txn'
        ]
      },
      hints: [
        '2PC: prepare all, then commit all',
        'Lock keys during transaction',
        'Timeout and rollback on coordinator failure'
      ],
      expectedComponents: ['Transaction Coordinator', 'Lock Manager', '2PC Handler'],
      successCriteria: ['Multi-key atomicity guaranteed', 'Failures rolled back'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Distribution',
      phase: 4,
      phaseTitle: 'Advanced Features',
      learningObjective: 'Deploy across multiple geographic regions',
      thinkingFramework: {
        framework: 'Geo-Replication',
        approach: 'Global presence for low latency reads. Async replication for availability, sync for consistency. Or: flexible placement per key.',
        keyInsight: 'Geo-partition: assign keys to regions based on access patterns. User data in users region. Global data replicated everywhere.'
      },
      requirements: {
        functional: [
          'Replicate across geographic regions',
          'Support sync and async replication modes',
          'Route reads to nearest replica',
          'Handle cross-region failures'
        ],
        nonFunctional: [
          'Local read latency < 10ms',
          'Cross-region write latency < 200ms (sync)',
          'RPO < 1 second (async)'
        ]
      },
      hints: [
        'Async: stream WAL to remote regions',
        'Sync: Paxos across regions (high latency)',
        'Hybrid: local writes with async global sync'
      ],
      expectedComponents: ['Geo Router', 'Cross-Region Replicator', 'Region Failover Manager'],
      successCriteria: ['Global reads are fast', 'Region failure handled gracefully'],
      estimatedTime: '10 minutes'
    }
  ]
};
