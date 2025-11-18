import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * DDIA Teaching Problems - Chapter 6: Partitioning
 * Total: 12 single-concept teaching problems
 *
 * Focus: One problem per partitioning concept from DDIA Chapter 6
 */

// ============================================================================
// 6.1 Partitioning Strategies
// ============================================================================

/**
 * Problem 62: Hash Partitioning
 * Teaches: Partitioning data by key hash for uniform distribution
 */
export const hashPartitioningProblemDefinition: ProblemDefinition = {
  id: 'ddia-hash-partitioning',
  title: 'Hash Partitioning - Uniform Distribution',
  description: `Implement hash-based partitioning to distribute data uniformly across multiple database nodes. Hash each key and assign it to a partition based on hash value modulo number of partitions.

Learning objectives:
- Understand hash partitioning for even data distribution
- Learn to avoid hot spots with hash-based routing
- Handle partition assignment based on hash values

Key requirements:
- 4 database partitions
- Hash each key (user_id) to determine partition
- Ensure uniform distribution across partitions`,

  userFacingFRs: [
    'Hash each key using consistent hash function (e.g., MD5, SHA-1)',
    'Route writes to partition = hash(key) % num_partitions',
    'Route reads to same partition for lookups',
    'Ensure roughly equal data distribution across 4 partitions',
  ],
  userFacingNFRs: [
    'Write latency: <20ms',
    'Read latency: <15ms',
    'Data skew: <10% variance between partitions',
    'Throughput: 10,000 ops/sec total',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Partition 1 database',
      },
      {
        type: 'storage',
        reason: 'Partition 2 database',
      },
      {
        type: 'storage',
        reason: 'Partition 3 database',
      },
      {
        type: 'storage',
        reason: 'Partition 4 database',
      },
      {
        type: 'compute',
        reason: 'Routing layer with hash partitioning logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests to routing layer',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Router sends request to correct partition based on hash',
      },
    ],
    dataModel: {
      entities: ['user', 'profile'],
      fields: {
        user: ['id', 'username', 'email'],
        profile: ['user_id', 'bio', 'avatar_url'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'high' },
      ],
    },
  },

  scenarios: generateScenarios('ddia-hash-partitioning', problemConfigs['ddia-hash-partitioning'] || {
    baseRps: 10000,
    readRatio: 0.7,
    maxLatency: 20,
    availability: 0.999,
  }, [
    'Hash each key using consistent hash function',
    'Route writes to partition = hash(key) % num_partitions',
    'Route reads to same partition for lookups',
    'Ensure roughly equal data distribution across 4 partitions',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 63: Range Partitioning
 * Teaches: Partitioning by key ranges for range queries
 */
export const rangePartitioningProblemDefinition: ProblemDefinition = {
  id: 'ddia-range-partitioning',
  title: 'Range Partitioning - Efficient Range Queries',
  description: `Implement range-based partitioning where data is divided by key ranges (e.g., A-F, G-M, N-S, T-Z). This enables efficient range queries but requires careful attention to avoid hot spots.

Learning objectives:
- Understand range partitioning for sorted data
- Learn to optimize range query performance
- Handle potential hot spots with uneven data distribution

Key requirements:
- 4 partitions with key ranges: [A-F], [G-M], [N-S], [T-Z]
- Route queries based on key range
- Support efficient range scans within and across partitions`,

  userFacingFRs: [
    'Define partition boundaries: P1=[A-F], P2=[G-M], P3=[N-S], P4=[T-Z]',
    'Route point queries to appropriate partition based on key',
    'Execute range queries across relevant partitions',
    'Return sorted results for range queries',
  ],
  userFacingNFRs: [
    'Point query latency: <20ms',
    'Range query latency: <100ms (may span multiple partitions)',
    'Throughput: 5,000 ops/sec',
    'Hot spot risk: Some partitions may get more traffic',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Partition 1: Keys A-F',
      },
      {
        type: 'storage',
        reason: 'Partition 2: Keys G-M',
      },
      {
        type: 'storage',
        reason: 'Partition 3: Keys N-S',
      },
      {
        type: 'storage',
        reason: 'Partition 4: Keys T-Z',
      },
      {
        type: 'compute',
        reason: 'Routing layer with range-based logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Router sends to appropriate partition(s) based on range',
      },
    ],
    dataModel: {
      entities: ['user', 'session'],
      fields: {
        user: ['username', 'email', 'created_at'],
        session: ['username', 'session_id', 'expires_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'high' },
        { type: 'range_query', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('ddia-range-partitioning', problemConfigs['ddia-range-partitioning'] || {
    baseRps: 5000,
    readRatio: 0.8,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Define partition boundaries',
    'Route point queries to appropriate partition based on key',
    'Execute range queries across relevant partitions',
    'Return sorted results for range queries',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 64: Consistent Hashing
 * Teaches: Minimize data movement when adding/removing nodes
 */
export const consistentHashingProblemDefinition: ProblemDefinition = {
  id: 'ddia-consistent-hashing',
  title: 'Consistent Hashing - Minimal Rebalancing',
  description: `Implement consistent hashing to minimize data movement when nodes are added or removed. Place nodes on a hash ring and assign keys to the nearest node clockwise. When adding/removing a node, only K/N keys need to move (K = total keys, N = number of nodes).

Learning objectives:
- Understand consistent hashing algorithm
- Learn to minimize data movement during scaling
- Use virtual nodes to improve balance

Key requirements:
- Hash ring with nodes placed at hash positions
- Keys assigned to first node clockwise from key's hash
- Adding/removing nodes only affects adjacent keys`,

  userFacingFRs: [
    'Create hash ring with 4 nodes at hash positions',
    'Hash each key and assign to first node clockwise',
    'Support adding new node with minimal key movement',
    'Support removing node and reassigning its keys to next node',
    'Use virtual nodes (e.g., 150 per physical node) for better balance',
  ],
  userFacingNFRs: [
    'Read/write latency: <30ms',
    'Rebalancing: Only ~25% of keys move when adding/removing a node (ideal: 1/N)',
    'Balance: <15% variance with virtual nodes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Storage nodes on hash ring',
      },
      {
        type: 'compute',
        reason: 'Consistent hashing coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route to appropriate node on ring',
      },
    ],
  },

  scenarios: generateScenarios('ddia-consistent-hashing', problemConfigs['ddia-consistent-hashing'] || {
    baseRps: 8000,
    readRatio: 0.7,
    maxLatency: 30,
    availability: 0.999,
  }, [
    'Create hash ring with 4 nodes at hash positions',
    'Hash each key and assign to first node clockwise',
    'Support adding new node with minimal key movement',
    'Support removing node and reassigning its keys to next node',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 65: Hot Spot Avoidance
 * Teaches: Strategies to prevent partition hot spots
 */
export const hotSpotAvoidanceProblemDefinition: ProblemDefinition = {
  id: 'ddia-hot-spot-avoidance',
  title: 'Hot Spot Avoidance - Load Balancing',
  description: `Handle hot spot scenarios where certain keys (e.g., celebrity users) receive disproportionate traffic. Implement strategies like adding a random prefix to hot keys to spread load across multiple partitions.

Learning objectives:
- Identify hot keys causing partition overload
- Implement hot key detection and mitigation
- Learn trade-offs of splitting hot keys

Key requirements:
- Detect keys receiving >10x average traffic
- Split hot keys across multiple partitions with random prefix
- Route reads to all replicas of split key and merge results`,

  userFacingFRs: [
    'Monitor request rate per key',
    'Detect hot keys (>10x average traffic)',
    'Split hot keys by adding random prefix (key_0, key_1, ..., key_9)',
    'Write to all splits of hot key',
    'Read from all splits and merge/aggregate results',
  ],
  userFacingNFRs: [
    'Hot key detection: <30 seconds',
    'Split overhead: 10x write amplification for hot keys',
    'Read latency: <50ms (parallel reads from all splits)',
    'Load distribution: Reduce hot partition load by 90%',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Multiple partitions to distribute load',
      },
      {
        type: 'compute',
        reason: 'Hot key detection and splitting logic',
      },
      {
        type: 'cache',
        reason: 'Track request counts per key',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Track hot keys',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route to partitions, split hot keys',
      },
    ],
  },

  scenarios: generateScenarios('ddia-hot-spot-avoidance', problemConfigs['ddia-hot-spot-avoidance'] || {
    baseRps: 15000,
    readRatio: 0.9,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Monitor request rate per key',
    'Detect hot keys (>10x average traffic)',
    'Split hot keys by adding random prefix',
    'Write to all splits of hot key',
    'Read from all splits and merge results',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 66: Composite Partitioning Keys
 * Teaches: Multi-column partitioning for complex access patterns
 */
export const compositePartitioningProblemDefinition: ProblemDefinition = {
  id: 'ddia-composite-partitioning',
  title: 'Composite Partitioning Keys',
  description: `Implement composite partitioning using multiple columns (e.g., tenant_id + user_id) to enable efficient queries within a tenant while distributing data across partitions. This is common in multi-tenant SaaS applications.

Learning objectives:
- Use compound keys for partitioning
- Optimize for multi-tenant access patterns
- Balance tenant isolation with global distribution

Key requirements:
- Partition by hash(tenant_id) for tenant isolation
- Secondary partition by user_id within tenant
- Support efficient queries within a tenant`,

  userFacingFRs: [
    'Partition data by composite key: (tenant_id, user_id)',
    'Primary partition by hash(tenant_id) % num_partitions',
    'Within each partition, organize by user_id for range queries',
    'Support queries like "get all users for tenant X"',
  ],
  userFacingNFRs: [
    'Latency: <25ms for tenant-scoped queries',
    'Tenant isolation: Each tenant\'s data on specific partition',
    'Scalability: Support 10,000 tenants across 4 partitions',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Partitioned databases with composite keys',
      },
      {
        type: 'compute',
        reason: 'Routing with composite key logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send tenant-scoped requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route based on (tenant_id, user_id)',
      },
    ],
  },

  scenarios: generateScenarios('ddia-composite-partitioning', problemConfigs['ddia-composite-partitioning'] || {
    baseRps: 6000,
    readRatio: 0.75,
    maxLatency: 25,
    availability: 0.999,
  }, [
    'Partition data by composite key: (tenant_id, user_id)',
    'Primary partition by hash(tenant_id)',
    'Support queries like "get all users for tenant X"',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 6.2 Secondary Indexes
// ============================================================================

/**
 * Problem 67: Local Secondary Index
 * Teaches: Partitioned indexes (document-based partitioning)
 */
export const localSecondaryIndexProblemDefinition: ProblemDefinition = {
  id: 'ddia-local-secondary-index',
  title: 'Local Secondary Index - Partitioned Indexes',
  description: `Implement local secondary indexes where each partition maintains its own index. Queries on secondary attributes require scatter-gather across all partitions. This is also called "document-based partitioning."

Learning objectives:
- Understand local (partitioned) secondary indexes
- Learn scatter-gather query pattern
- Handle index maintenance within each partition

Key requirements:
- Each partition has its own local index on secondary attributes
- Queries on primary key go to single partition
- Queries on secondary attributes require scatter-gather across all partitions`,

  userFacingFRs: [
    'Primary index: Partition by user_id',
    'Secondary index: Index by email (local to each partition)',
    'Query by user_id: Route to single partition',
    'Query by email: Scatter to all partitions, gather results',
  ],
  userFacingNFRs: [
    'Primary key lookup: <15ms (single partition)',
    'Secondary key lookup: <80ms (scatter-gather across 4 partitions)',
    'Index maintenance: Local to each partition (fast writes)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Partitions with local secondary indexes',
      },
      {
        type: 'compute',
        reason: 'Query coordinator for scatter-gather',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send queries',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route to single partition or scatter-gather',
      },
    ],
  },

  scenarios: generateScenarios('ddia-local-secondary-index', problemConfigs['ddia-local-secondary-index'] || {
    baseRps: 4000,
    readRatio: 0.8,
    maxLatency: 80,
    availability: 0.99,
  }, [
    'Primary index: Partition by user_id',
    'Secondary index: Index by email (local to each partition)',
    'Query by user_id: Route to single partition',
    'Query by email: Scatter to all partitions, gather results',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 68: Global Secondary Index
 * Teaches: Global indexes spanning all partitions (term-based partitioning)
 */
export const globalSecondaryIndexProblemDefinition: ProblemDefinition = {
  id: 'ddia-global-secondary-index',
  title: 'Global Secondary Index - Term-Based Partitioning',
  description: `Implement global secondary indexes where the index itself is partitioned across nodes. Each index partition covers all data partitions for a subset of index values. This enables fast secondary key lookups but complicates writes.

Learning objectives:
- Understand global (term-based) secondary indexes
- Learn cross-partition index updates
- Trade-off: Fast reads vs complex writes

Key requirements:
- Partition primary data by user_id
- Partition secondary index (on email) separately by hash(email)
- Queries on email go to single index partition
- Writes update both data partition and index partition`,

  userFacingFRs: [
    'Partition primary data by hash(user_id)',
    'Partition secondary index by hash(email) - separate partitioning scheme',
    'Query by email: Route to single index partition (fast)',
    'Writes: Update data partition + update index partition (distributed transaction)',
  ],
  userFacingNFRs: [
    'Email lookup: <20ms (single index partition)',
    'Write latency: <60ms (update data + index partitions)',
    'Consistency: Index may lag behind data (eventual consistency)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Data partitions (by user_id)',
      },
      {
        type: 'storage',
        reason: 'Index partitions (by email)',
      },
      {
        type: 'compute',
        reason: 'Coordinator to update both data and index',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Update data and index partitions',
      },
    ],
  },

  scenarios: generateScenarios('ddia-global-secondary-index', problemConfigs['ddia-global-secondary-index'] || {
    baseRps: 5000,
    readRatio: 0.7,
    maxLatency: 60,
    availability: 0.99,
  }, [
    'Partition primary data by hash(user_id)',
    'Partition secondary index by hash(email)',
    'Query by email: Route to single index partition',
    'Writes: Update data partition + update index partition',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 69: Index Maintenance
 * Teaches: Keeping indexes in sync with data during writes
 */
export const indexMaintenanceProblemDefinition: ProblemDefinition = {
  id: 'ddia-index-maintenance',
  title: 'Index Maintenance - Sync Updates',
  description: `Implement proper index maintenance to keep secondary indexes in sync with primary data. Handle index updates during inserts, updates, and deletes. Deal with the consistency challenges of maintaining indexes across partitions.

Learning objectives:
- Synchronous vs asynchronous index updates
- Handle index update failures
- Maintain index consistency with data

Key requirements:
- Update indexes synchronously with data writes
- Handle partial failures (data written but index update fails)
- Implement retry and reconciliation for failed index updates`,

  userFacingFRs: [
    'On INSERT: Write to data partition + update secondary indexes',
    'On UPDATE: Update data partition + update old and new index entries',
    'On DELETE: Delete from data partition + remove from indexes',
    'Handle failures: Retry index updates or mark for background reconciliation',
  ],
  userFacingNFRs: [
    'Write latency: <70ms (data + index updates)',
    'Index consistency: <1% stale entries at any time',
    'Reconciliation: Fix stale indexes within 5 minutes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Data partitions',
      },
      {
        type: 'storage',
        reason: 'Index partitions',
      },
      {
        type: 'compute',
        reason: 'Index maintenance coordinator',
      },
      {
        type: 'message_queue',
        reason: 'Queue failed index updates for retry',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send write requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Update data and indexes',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Queue failed index updates',
      },
    ],
  },

  scenarios: generateScenarios('ddia-index-maintenance', problemConfigs['ddia-index-maintenance'] || {
    baseRps: 3000,
    readRatio: 0.4,
    maxLatency: 70,
    availability: 0.99,
  }, [
    'On INSERT: Write to data partition + update secondary indexes',
    'On UPDATE: Update data partition + update old and new index entries',
    'On DELETE: Delete from data partition + remove from indexes',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 6.3 Rebalancing Partitions
// ============================================================================

/**
 * Problem 70: Fixed Number of Partitions
 * Teaches: Pre-allocated partitions moved between nodes
 */
export const fixedPartitionsProblemDefinition: ProblemDefinition = {
  id: 'ddia-fixed-partitions',
  title: 'Fixed Partitions - Pre-allocated',
  description: `Create a fixed number of partitions (much larger than number of nodes) and move entire partitions between nodes when rebalancing. For example, 256 partitions across 4 nodes means 64 partitions per node initially.

Learning objectives:
- Understand fixed partition rebalancing
- Learn partition-to-node assignment
- Move entire partitions atomically

Key requirements:
- Create 256 virtual partitions upfront
- Initially assign 64 partitions to each of 4 nodes
- When adding 5th node, move some partitions from existing nodes to new node`,

  userFacingFRs: [
    'Create 256 fixed partitions at system initialization',
    'Assign partitions to nodes (initially 64 per node with 4 nodes)',
    'When adding new node, reassign some partitions to it',
    'Move entire partition data atomically to new node',
    'Update routing table after partition migration',
  ],
  userFacingNFRs: [
    'Rebalancing time: <30 minutes to move partitions',
    'Availability: System remains available during rebalancing',
    'Data distribution: Balanced within 5% after adding node',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Storage nodes holding partitions',
      },
      {
        type: 'compute',
        reason: 'Rebalancing coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route to appropriate node based on partition assignment',
      },
    ],
  },

  scenarios: generateScenarios('ddia-fixed-partitions', problemConfigs['ddia-fixed-partitions'] || {
    baseRps: 7000,
    readRatio: 0.7,
    maxLatency: 40,
    availability: 0.999,
  }, [
    'Create 256 fixed partitions at system initialization',
    'Assign partitions to nodes',
    'When adding new node, reassign some partitions to it',
    'Update routing table after partition migration',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 71: Dynamic Partitioning
 * Teaches: Automatically split/merge partitions based on size
 */
export const dynamicPartitioningProblemDefinition: ProblemDefinition = {
  id: 'ddia-dynamic-partitioning',
  title: 'Dynamic Partitioning - Split and Merge',
  description: `Implement dynamic partitioning where partitions automatically split when they exceed a size threshold and merge when they become too small. Similar to B-tree node splits.

Learning objectives:
- Automatically split large partitions
- Merge small partitions
- Maintain balanced partition sizes

Key requirements:
- Split partitions when size exceeds 10GB
- Merge adjacent partitions when combined size < 1GB
- Distribute split partitions across nodes for load balancing`,

  userFacingFRs: [
    'Monitor partition sizes continuously',
    'When partition exceeds 10GB, split into two partitions',
    'When adjacent partitions combined < 1GB, merge them',
    'Rebalance partitions across nodes after split/merge',
  ],
  userFacingNFRs: [
    'Split/merge time: <5 minutes per operation',
    'Partition size: Keep between 1GB and 10GB',
    'Availability: Continue serving requests during split/merge',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Partitions that can split/merge',
      },
      {
        type: 'compute',
        reason: 'Partition size monitoring and split/merge logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Manage partitions and route requests',
      },
    ],
  },

  scenarios: generateScenarios('ddia-dynamic-partitioning', problemConfigs['ddia-dynamic-partitioning'] || {
    baseRps: 5000,
    readRatio: 0.6,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Monitor partition sizes continuously',
    'When partition exceeds 10GB, split into two partitions',
    'When adjacent partitions combined < 1GB, merge them',
    'Rebalance partitions across nodes after split/merge',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 72: Proportional Partitioning
 * Teaches: Number of partitions proportional to nodes
 */
export const proportionalPartitioningProblemDefinition: ProblemDefinition = {
  id: 'ddia-proportional-partitioning',
  title: 'Proportional Partitioning - Partitions Per Node',
  description: `Maintain a fixed number of partitions per node (e.g., 64 partitions per node). When adding a node, create new partitions on it and move some data from existing partitions.

Learning objectives:
- Keep partitions proportional to node count
- Create new partitions when scaling up
- Maintain consistent partition count per node

Key requirements:
- Maintain 64 partitions per node
- Starting with 4 nodes = 256 partitions
- Adding 5th node creates 64 new partitions (total 320)`,

  userFacingFRs: [
    'Maintain ratio: 64 partitions per node',
    'When adding node, create 64 new empty partitions on it',
    'Rebalance data from existing partitions to new partitions',
    'Use consistent hashing to determine which keys move',
  ],
  userFacingNFRs: [
    'Rebalancing: Move ~20% of data when adding 5th node to 4-node cluster',
    'Partition count: Always N_nodes × 64',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Nodes with proportional partitions',
      },
      {
        type: 'compute',
        reason: 'Rebalancing coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route and rebalance partitions',
      },
    ],
  },

  scenarios: generateScenarios('ddia-proportional-partitioning', problemConfigs['ddia-proportional-partitioning'] || {
    baseRps: 6000,
    readRatio: 0.7,
    maxLatency: 45,
    availability: 0.999,
  }, [
    'Maintain ratio: 64 partitions per node',
    'When adding node, create 64 new empty partitions on it',
    'Rebalance data from existing partitions to new partitions',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 73: Automatic Rebalancing
 * Teaches: Trigger rebalancing based on load metrics
 */
export const automaticRebalancingProblemDefinition: ProblemDefinition = {
  id: 'ddia-automatic-rebalancing',
  title: 'Automatic Rebalancing - Load-Based',
  description: `Implement automatic rebalancing that triggers when node load becomes imbalanced. Monitor CPU, memory, and request rate per node, and automatically rebalance partitions to even out the load.

Learning objectives:
- Monitor node load metrics
- Detect imbalance (>20% variance)
- Automatically trigger rebalancing

Key requirements:
- Monitor request rate, CPU, memory per node
- Detect imbalance (e.g., one node handling 40% of traffic)
- Automatically move partitions to balance load`,

  userFacingFRs: [
    'Monitor load metrics per node: request rate, CPU, memory',
    'Detect load imbalance (>20% variance between nodes)',
    'Automatically trigger partition movement to balance load',
    'Gradually move partitions to avoid overwhelming network',
  ],
  userFacingNFRs: [
    'Imbalance detection: <1 minute',
    'Rebalancing: Complete within 10 minutes',
    'Availability: No downtime during rebalancing',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Partitioned storage nodes',
      },
      {
        type: 'compute',
        reason: 'Load monitoring and rebalancing coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Monitor and rebalance partitions',
      },
    ],
  },

  scenarios: generateScenarios('ddia-automatic-rebalancing', problemConfigs['ddia-automatic-rebalancing'] || {
    baseRps: 8000,
    readRatio: 0.7,
    maxLatency: 50,
    availability: 0.999,
  }, [
    'Monitor load metrics per node: request rate, CPU, memory',
    'Detect load imbalance (>20% variance between nodes)',
    'Automatically trigger partition movement to balance load',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all partitioning problems
export const ddiaPartitioningProblems = [
  hashPartitioningProblemDefinition,
  rangePartitioningProblemDefinition,
  consistentHashingProblemDefinition,
  hotSpotAvoidanceProblemDefinition,
  compositePartitioningProblemDefinition,
  localSecondaryIndexProblemDefinition,
  globalSecondaryIndexProblemDefinition,
  indexMaintenanceProblemDefinition,
  fixedPartitionsProblemDefinition,
  dynamicPartitioningProblemDefinition,
  proportionalPartitioningProblemDefinition,
  automaticRebalancingProblemDefinition,
];

// Auto-generate code challenges from functional requirements
(hashPartitioningProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(hashPartitioningProblemDefinition);
