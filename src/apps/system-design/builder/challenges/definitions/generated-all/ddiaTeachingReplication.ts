import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * DDIA Teaching Problems - Chapter 5: Replication
 * Total: 15 single-concept teaching problems
 *
 * Focus: One problem per replication concept from DDIA Chapter 5
 */

// ============================================================================
// 5.1 Single-Leader Replication
// ============================================================================

/**
 * Problem 46: Read Replicas
 * Teaches: Setting up read-only replicas to scale read throughput
 */
export const readReplicasProblemDefinition: ProblemDefinition = {
  id: 'ddia-read-replicas',
  title: 'Read Replicas - Scale Read Traffic',
  description: `Design a simple system with read replicas to handle high read traffic. You have a primary database receiving 100 writes/sec and need to handle 10,000 reads/sec. Use read replicas to scale read throughput while keeping writes on the primary.

Learning objectives:
- Understand how read replicas distribute read load
- Learn the trade-offs of asynchronous replication
- Handle eventual consistency in reads

Key requirements:
- Primary database for all writes
- Multiple read replicas for scaling reads
- Route read traffic to replicas, write traffic to primary`,

  userFacingFRs: [
    'Accept write requests (100/sec) - route to primary only',
    'Accept read requests (10,000/sec) - distribute across replicas',
    'Replicate data from primary to replicas asynchronously',
    'Load balance read traffic across all available replicas',
  ],
  userFacingNFRs: [
    'Write latency: <50ms (primary database)',
    'Read latency: <20ms (from nearest replica)',
    'Read throughput: 10,000 reads/sec',
    'Write throughput: 100 writes/sec',
    'Replication lag: <1 second average',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Primary database for writes',
      },
      {
        type: 'storage',
        reason: 'At least 2 read replicas for scaling reads',
      },
      {
        type: 'load_balancer',
        reason: 'Distribute read traffic across replicas',
      },
      {
        type: 'compute',
        reason: 'Application servers to handle requests',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Clients send read requests to load balancer',
      },
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send write requests to app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers write to primary database',
      },
      {
        from: 'load_balancer',
        to: 'storage',
        reason: 'Load balancer routes reads to replicas',
      },
    ],
    dataModel: {
      entities: ['user', 'post'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        post: ['id', 'user_id', 'content', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('ddia-read-replicas', problemConfigs['ddia-read-replicas'] || {
    baseRps: 10100,
    readRatio: 0.99, // 10,000 reads, 100 writes
    maxLatency: 50,
    availability: 0.995,
  }, [
    'Accept write requests (100/sec) - route to primary only',
    'Accept read requests (10,000/sec) - distribute across replicas',
    'Replicate data from primary to replicas asynchronously',
    'Load balance read traffic across all available replicas',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 47: Asynchronous Replication
 * Teaches: Trade-offs of async replication (performance vs durability)
 */
export const asyncReplicationProblemDefinition: ProblemDefinition = {
  id: 'ddia-async-replication',
  title: 'Asynchronous Replication - Performance vs Durability',
  description: `Implement asynchronous replication where the primary doesn't wait for replicas to acknowledge writes. This maximizes write performance but introduces the risk of data loss if the primary fails before replication completes.

Learning objectives:
- Understand async replication mechanics
- Learn the performance benefits (low write latency)
- Understand durability risks (potential data loss)

Key requirements:
- Primary acknowledges writes immediately (doesn't wait for replicas)
- Replicas receive updates asynchronously in the background
- Monitor replication lag between primary and replicas`,

  userFacingFRs: [
    'Accept writes to primary database',
    'Acknowledge writes immediately without waiting for replicas',
    'Replicate writes to followers in background',
    'Monitor replication lag for each replica',
    'Handle replica failures gracefully (continue serving from primary)',
  ],
  userFacingNFRs: [
    'Write latency: <10ms (fast acknowledgment)',
    'Replication lag: <2 seconds under normal load',
    'Throughput: 1,000 writes/sec',
    'Durability: Risk of losing recent writes if primary fails',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Primary database for writes',
      },
      {
        type: 'storage',
        reason: 'Replica databases for async replication',
      },
      {
        type: 'compute',
        reason: 'Application servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests to app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers write to primary and read from replicas',
      },
    ],
  },

  scenarios: generateScenarios('ddia-async-replication', problemConfigs['ddia-async-replication'] || {
    baseRps: 1000,
    readRatio: 0.5,
    maxLatency: 10,
    availability: 0.99,
  }, [
    'Accept writes to primary database',
    'Acknowledge writes immediately without waiting for replicas',
    'Replicate writes to followers in background',
    'Monitor replication lag for each replica',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 48: Synchronous Replication
 * Teaches: Strong durability with sync replication (slower but safer)
 */
export const syncReplicationProblemDefinition: ProblemDefinition = {
  id: 'ddia-sync-replication',
  title: 'Synchronous Replication - Strong Durability',
  description: `Implement synchronous replication where writes must be acknowledged by at least one replica before confirming to the client. This ensures data is safely stored on multiple nodes but increases write latency.

Learning objectives:
- Understand synchronous replication mechanics
- Learn the durability benefits (no data loss)
- Understand performance trade-offs (higher write latency)

Key requirements:
- Wait for at least one replica to acknowledge writes
- Ensure data is persisted on multiple nodes before responding to client
- Handle scenarios where replicas are slow or unavailable`,

  userFacingFRs: [
    'Accept writes to primary database',
    'Wait for at least one replica to confirm write before acknowledging client',
    'Ensure writes are durable on 2+ nodes',
    'Timeout and fail writes if replicas are too slow',
  ],
  userFacingNFRs: [
    'Write latency: <100ms (includes replica acknowledgment)',
    'Durability: Zero data loss on single node failure',
    'Throughput: 500 writes/sec',
    'Availability: Writes fail if no replicas available',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Primary database for writes',
      },
      {
        type: 'storage',
        reason: 'Synchronous replica (must acknowledge writes)',
      },
      {
        type: 'compute',
        reason: 'Application servers',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests to app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers write to primary and wait for replica ack',
      },
    ],
  },

  scenarios: generateScenarios('ddia-sync-replication', problemConfigs['ddia-sync-replication'] || {
    baseRps: 500,
    readRatio: 0.5,
    maxLatency: 100,
    availability: 0.995,
  }, [
    'Accept writes to primary database',
    'Wait for at least one replica to confirm write before acknowledging client',
    'Ensure writes are durable on 2+ nodes',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 49: Replication Lag
 * Teaches: Handling eventual consistency and replication lag
 */
export const replicationLagProblemDefinition: ProblemDefinition = {
  id: 'ddia-replication-lag',
  title: 'Replication Lag - Eventual Consistency',
  description: `Build a system that handles replication lag gracefully. When users write data and then immediately read it back, they might read from a replica that hasn't received the update yet. Implement strategies to handle this "read-your-writes" consistency problem.

Learning objectives:
- Understand replication lag and eventual consistency
- Learn read-your-writes consistency patterns
- Handle stale reads from lagging replicas

Key requirements:
- Users should see their own writes immediately
- Other users can tolerate slightly stale data
- Monitor and expose replication lag metrics`,

  userFacingFRs: [
    'Users can write data to the system',
    'Users can read their own writes immediately (read-your-writes)',
    'Route reads after writes to primary or up-to-date replica',
    'Other users may see slightly stale data (eventual consistency)',
    'Display replication lag to administrators',
  ],
  userFacingNFRs: [
    'Write latency: <50ms',
    'Read latency: <20ms (may route to primary for consistency)',
    'Replication lag: <500ms under normal load',
    'Read-your-writes: 100% consistency for same user',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Primary database for writes',
      },
      {
        type: 'storage',
        reason: 'Read replicas with potential lag',
      },
      {
        type: 'compute',
        reason: 'Application servers with routing logic',
      },
      {
        type: 'cache',
        reason: 'Session cache to track recent writes per user',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests to app servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Track recent writes per user session',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Read from primary or replicas based on consistency needs',
      },
    ],
  },

  scenarios: generateScenarios('ddia-replication-lag', problemConfigs['ddia-replication-lag'] || {
    baseRps: 2000,
    readRatio: 0.8,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Users can write data to the system',
    'Users can read their own writes immediately (read-your-writes)',
    'Route reads after writes to primary or up-to-date replica',
    'Display replication lag to administrators',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 50: Failover Mechanism
 * Teaches: Automatic leader election and failover
 */
export const failoverProblemDefinition: ProblemDefinition = {
  id: 'ddia-failover',
  title: 'Failover - Automatic Leader Election',
  description: `Implement automatic failover when the primary database fails. Detect primary failure, elect a new primary from replicas, and redirect all writes to the new primary. Handle the complexities of split-brain scenarios and data loss.

Learning objectives:
- Detect primary database failures
- Elect a new leader from replicas
- Prevent split-brain scenarios
- Handle potential data loss during failover

Key requirements:
- Monitor primary health with heartbeats
- Automatically promote a replica to primary on failure
- Update all clients to write to new primary
- Prevent two primaries from operating simultaneously`,

  userFacingFRs: [
    'Monitor primary database health with heartbeats',
    'Detect primary failure within 10 seconds',
    'Automatically elect most up-to-date replica as new primary',
    'Redirect all write traffic to new primary',
    'Prevent split-brain (two active primaries)',
    'Reconfigure old primary as replica when it recovers',
  ],
  userFacingNFRs: [
    'Failure detection: <10 seconds',
    'Failover time: <30 seconds total',
    'Availability: 99.9% (brief downtime during failover)',
    'Data loss: Potentially lose writes in flight to old primary',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Primary database (may fail)',
      },
      {
        type: 'storage',
        reason: 'Replica databases (candidates for promotion)',
      },
      {
        type: 'compute',
        reason: 'Application servers',
      },
      {
        type: 'load_balancer',
        reason: 'Route traffic and health check databases',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Load balancer routes to current primary',
      },
      {
        from: 'load_balancer',
        to: 'storage',
        reason: 'Route writes to active primary',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Monitor health and perform failover',
      },
    ],
  },

  scenarios: generateScenarios('ddia-failover', problemConfigs['ddia-failover'] || {
    baseRps: 1000,
    readRatio: 0.5,
    maxLatency: 50,
    availability: 0.999,
  }, [
    'Monitor primary database health with heartbeats',
    'Detect primary failure within 10 seconds',
    'Automatically elect most up-to-date replica as new primary',
    'Redirect all write traffic to new primary',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 5.2 Multi-Leader Replication
// ============================================================================

/**
 * Problem 51: Multi-Datacenter Replication
 * Teaches: Multi-leader replication across geographic regions
 */
export const multiDatacenterReplicationProblemDefinition: ProblemDefinition = {
  id: 'ddia-multi-datacenter',
  title: 'Multi-Datacenter Replication',
  description: `Design a multi-datacenter system where each datacenter has its own leader that accepts writes. Users in each region write to their local leader for low latency, and changes are replicated asynchronously to other datacenters.

Learning objectives:
- Understand multi-leader replication benefits (low latency, fault tolerance)
- Learn cross-datacenter replication patterns
- Handle network partitions between datacenters

Key requirements:
- 3 datacenters: US-East, US-West, Europe
- Each datacenter has a leader accepting writes
- Asynchronous replication between datacenters
- Users write to nearest datacenter`,

  userFacingFRs: [
    'Accept writes in any datacenter',
    'Replicate writes to all other datacenters asynchronously',
    'Route users to nearest datacenter for low latency',
    'Continue operating if one datacenter becomes unavailable',
  ],
  userFacingNFRs: [
    'Write latency: <50ms (local datacenter)',
    'Cross-datacenter replication: <2 seconds',
    'Availability: 99.95% (tolerate single datacenter failure)',
    'Conflict rate: <1% of writes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Leader database in US-East datacenter',
      },
      {
        type: 'storage',
        reason: 'Leader database in US-West datacenter',
      },
      {
        type: 'storage',
        reason: 'Leader database in Europe datacenter',
      },
      {
        type: 'compute',
        reason: 'Application servers in each datacenter',
      },
      {
        type: 'load_balancer',
        reason: 'Route users to nearest datacenter',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Route to nearest datacenter',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'Send requests to local app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Write to local leader, replicate to remote leaders',
      },
    ],
  },

  scenarios: generateScenarios('ddia-multi-datacenter', problemConfigs['ddia-multi-datacenter'] || {
    baseRps: 3000,
    readRatio: 0.6,
    maxLatency: 50,
    availability: 0.9995,
  }, [
    'Accept writes in any datacenter',
    'Replicate writes to all other datacenters asynchronously',
    'Route users to nearest datacenter for low latency',
    'Continue operating if one datacenter becomes unavailable',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 52: Write Conflicts
 * Teaches: Detecting write conflicts in multi-leader systems
 */
export const writeConflictsProblemDefinition: ProblemDefinition = {
  id: 'ddia-write-conflicts',
  title: 'Write Conflicts - Conflict Detection',
  description: `In a multi-leader system, two users can modify the same data simultaneously in different datacenters, creating a write conflict. Implement conflict detection by comparing versions and identifying when the same key is modified concurrently.

Learning objectives:
- Detect write conflicts using version vectors or timestamps
- Identify concurrent modifications to the same data
- Log conflicts for resolution

Key requirements:
- Track versions for all writes
- Detect when two leaders modify the same key concurrently
- Log conflicts for manual or automatic resolution`,

  userFacingFRs: [
    'Accept concurrent writes to same key in different datacenters',
    'Track version vectors or logical timestamps for each write',
    'Detect conflicts when merging replicated writes',
    'Log all conflicts with both versions',
    'Provide conflict notification to application layer',
  ],
  userFacingNFRs: [
    'Conflict detection latency: <100ms after replication',
    'Conflict rate: Depends on concurrent write patterns',
    'Storage overhead: Store version metadata with each write',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Leader databases in multiple datacenters',
      },
      {
        type: 'compute',
        reason: 'Conflict detection logic',
      },
      {
        type: 'storage',
        reason: 'Conflict log storage',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send writes to app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Write to local leader and detect conflicts',
      },
    ],
  },

  scenarios: generateScenarios('ddia-write-conflicts', problemConfigs['ddia-write-conflicts'] || {
    baseRps: 1000,
    readRatio: 0.3,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Accept concurrent writes to same key in different datacenters',
    'Track version vectors or logical timestamps for each write',
    'Detect conflicts when merging replicated writes',
    'Log all conflicts with both versions',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 53: Conflict Resolution Strategies
 * Teaches: Automatic conflict resolution (LWW, custom logic)
 */
export const conflictResolutionProblemDefinition: ProblemDefinition = {
  id: 'ddia-conflict-resolution',
  title: 'Conflict Resolution - Last Write Wins',
  description: `Implement automatic conflict resolution using Last-Write-Wins (LWW) strategy. When two conflicting writes are detected, keep the one with the later timestamp and discard the other. Understand the trade-offs of this simple but lossy approach.

Learning objectives:
- Implement Last-Write-Wins conflict resolution
- Understand timestamp-based ordering
- Learn the limitations of LWW (data loss)

Key requirements:
- Assign timestamps to all writes
- Resolve conflicts automatically by keeping latest write
- Discard older conflicting writes`,

  userFacingFRs: [
    'Assign timestamps to every write (using wall-clock time)',
    'When conflict detected, compare timestamps',
    'Keep write with later timestamp, discard earlier one',
    'Log all discarded writes for audit',
    'Ensure deterministic conflict resolution across all replicas',
  ],
  userFacingNFRs: [
    'Conflict resolution: <10ms',
    'Data loss: Older conflicting writes are lost',
    'Consistency: Eventually all replicas converge to same value',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Leader databases with conflict resolution',
      },
      {
        type: 'compute',
        reason: 'Conflict resolution logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send writes',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Apply conflict resolution and store winning write',
      },
    ],
  },

  scenarios: generateScenarios('ddia-conflict-resolution', problemConfigs['ddia-conflict-resolution'] || {
    baseRps: 1000,
    readRatio: 0.5,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Assign timestamps to every write (using wall-clock time)',
    'When conflict detected, compare timestamps',
    'Keep write with later timestamp, discard earlier one',
    'Ensure deterministic conflict resolution across all replicas',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 54: Replication Topology - Circular
 * Teaches: Circular replication topology between leaders
 */
export const circularTopologyProblemDefinition: ProblemDefinition = {
  id: 'ddia-circular-topology',
  title: 'Replication Topology - Circular',
  description: `Implement circular replication topology where datacenter A replicates to B, B replicates to C, and C replicates back to A. Each write must be tagged with an origin identifier to prevent infinite loops.

Learning objectives:
- Understand circular replication topology
- Prevent infinite replication loops
- Handle node failures in circular topology

Key requirements:
- 3 datacenters in a ring: A → B → C → A
- Tag each write with origin ID
- Filter out writes that originated from self (prevent loops)`,

  userFacingFRs: [
    'Replicate writes in circular pattern: DC-A → DC-B → DC-C → DC-A',
    'Tag each write with origin datacenter ID',
    'Skip writes that originated from current datacenter (prevent loops)',
    'Ensure all writes eventually reach all datacenters',
  ],
  userFacingNFRs: [
    'Replication latency: <3 seconds to propagate around the ring',
    'Loop prevention: 100% (no infinite replication)',
    'Fault tolerance: Handle single datacenter failure',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Leader database in datacenter A',
      },
      {
        type: 'storage',
        reason: 'Leader database in datacenter B',
      },
      {
        type: 'storage',
        reason: 'Leader database in datacenter C',
      },
      {
        type: 'compute',
        reason: 'Replication logic in each datacenter',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients write to any datacenter',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Write locally and replicate to next datacenter in ring',
      },
    ],
  },

  scenarios: generateScenarios('ddia-circular-topology', problemConfigs['ddia-circular-topology'] || {
    baseRps: 1500,
    readRatio: 0.6,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Replicate writes in circular pattern: DC-A → DC-B → DC-C → DC-A',
    'Tag each write with origin datacenter ID',
    'Skip writes that originated from current datacenter (prevent loops)',
    'Ensure all writes eventually reach all datacenters',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 55: Replication Topology - Star
 * Teaches: Star replication topology with central hub
 */
export const starTopologyProblemDefinition: ProblemDefinition = {
  id: 'ddia-star-topology',
  title: 'Replication Topology - Star',
  description: `Implement star replication topology where one central datacenter acts as a hub, and all other datacenters (spokes) replicate through it. All writes from spoke datacenters go to the hub, which then replicates to all other spokes.

Learning objectives:
- Understand star topology trade-offs
- Learn hub-and-spoke replication pattern
- Handle hub failure (single point of failure)

Key requirements:
- Central hub datacenter receives all writes
- Hub replicates to all spoke datacenters
- Spokes only replicate to/from hub, not directly to each other`,

  userFacingFRs: [
    'Central hub datacenter receives writes from all spokes',
    'Hub replicates every write to all spoke datacenters',
    'Spoke datacenters send local writes to hub',
    'Spokes receive writes from other spokes via hub',
  ],
  userFacingNFRs: [
    'Write latency: <100ms (includes hub round-trip)',
    'Replication latency: <2 seconds from any spoke to any other spoke',
    'Single point of failure: Hub failure blocks all cross-datacenter writes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Hub datacenter database (central leader)',
      },
      {
        type: 'storage',
        reason: 'Spoke datacenter database (US-East)',
      },
      {
        type: 'storage',
        reason: 'Spoke datacenter database (US-West)',
      },
      {
        type: 'storage',
        reason: 'Spoke datacenter database (Europe)',
      },
      {
        type: 'compute',
        reason: 'Replication logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients write to spoke datacenters',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Spokes send writes to hub, hub replicates to all spokes',
      },
    ],
  },

  scenarios: generateScenarios('ddia-star-topology', problemConfigs['ddia-star-topology'] || {
    baseRps: 2000,
    readRatio: 0.6,
    maxLatency: 100,
    availability: 0.98,
  }, [
    'Central hub datacenter receives writes from all spokes',
    'Hub replicates every write to all spoke datacenters',
    'Spoke datacenters send local writes to hub',
    'Spokes receive writes from other spokes via hub',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 5.3 Leaderless Replication
// ============================================================================

/**
 * Problem 56: Quorum Reads and Writes
 * Teaches: Quorum consensus (W + R > N)
 */
export const quorumProblemDefinition: ProblemDefinition = {
  id: 'ddia-quorum',
  title: 'Quorum Reads and Writes',
  description: `Implement a leaderless replication system using quorums. With N=3 replicas, configure W=2 (write quorum) and R=2 (read quorum) to ensure W + R > N, guaranteeing that reads always see the latest write.

Learning objectives:
- Understand quorum-based replication
- Learn the W + R > N consistency guarantee
- Handle partial failures with quorums

Key requirements:
- 3 replica nodes (N=3)
- Write to 2 nodes before acknowledging (W=2)
- Read from 2 nodes and return latest value (R=2)`,

  userFacingFRs: [
    'Write data to N=3 replica nodes',
    'Wait for W=2 nodes to acknowledge write before confirming to client',
    'Read from R=2 nodes and return value with latest timestamp/version',
    'Continue operating if 1 node is down (tolerate N-W or N-R failures)',
  ],
  userFacingNFRs: [
    'Write latency: <100ms (wait for 2 out of 3 replicas)',
    'Read latency: <80ms (read from 2 out of 3 replicas)',
    'Consistency: W + R > N guarantees seeing latest write',
    'Availability: Tolerate 1 node failure',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Replica node 1',
      },
      {
        type: 'storage',
        reason: 'Replica node 2',
      },
      {
        type: 'storage',
        reason: 'Replica node 3',
      },
      {
        type: 'compute',
        reason: 'Coordinator to handle quorum logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests to coordinator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Coordinator reads/writes to quorum of replicas',
      },
    ],
  },

  scenarios: generateScenarios('ddia-quorum', problemConfigs['ddia-quorum'] || {
    baseRps: 1000,
    readRatio: 0.6,
    maxLatency: 100,
    availability: 0.999,
  }, [
    'Write data to N=3 replica nodes',
    'Wait for W=2 nodes to acknowledge write before confirming to client',
    'Read from R=2 nodes and return value with latest timestamp/version',
    'Continue operating if 1 node is down',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 57: Dynamo-Style Replication
 * Teaches: Consistent hashing + replication (Dynamo, Cassandra style)
 */
export const dynamoStyleProblemDefinition: ProblemDefinition = {
  id: 'ddia-dynamo-style',
  title: 'Dynamo-Style Replication',
  description: `Implement a Dynamo-style distributed database using consistent hashing and leaderless replication. Hash keys to a ring, and replicate each key to N consecutive nodes. Use quorum reads/writes for consistency.

Learning objectives:
- Combine consistent hashing with replication
- Understand Dynamo/Cassandra architecture
- Learn node placement and data distribution

Key requirements:
- Consistent hash ring with virtual nodes
- Replicate each key to N=3 consecutive nodes
- Quorum reads (R=2) and writes (W=2)`,

  userFacingFRs: [
    'Hash keys onto consistent hash ring',
    'Replicate each key to N=3 consecutive nodes on ring',
    'Write to W=2 replicas for quorum',
    'Read from R=2 replicas and return latest version',
    'Add/remove nodes with minimal data movement',
  ],
  userFacingNFRs: [
    'Write latency: <50ms',
    'Read latency: <40ms',
    'Data distribution: Balanced across nodes using virtual nodes',
    'Availability: 99.99% (highly available)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Multiple storage nodes forming hash ring',
      },
      {
        type: 'compute',
        reason: 'Coordinator for consistent hashing and quorum logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests to coordinator',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Coordinator routes to N consecutive nodes on hash ring',
      },
    ],
  },

  scenarios: generateScenarios('ddia-dynamo-style', problemConfigs['ddia-dynamo-style'] || {
    baseRps: 5000,
    readRatio: 0.7,
    maxLatency: 50,
    availability: 0.9999,
  }, [
    'Hash keys onto consistent hash ring',
    'Replicate each key to N=3 consecutive nodes on ring',
    'Write to W=2 replicas for quorum',
    'Read from R=2 replicas and return latest version',
    'Add/remove nodes with minimal data movement',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 58: Sloppy Quorums
 * Teaches: Handling node failures with sloppy quorums
 */
export const sloppyQuorumProblemDefinition: ProblemDefinition = {
  id: 'ddia-sloppy-quorum',
  title: 'Sloppy Quorums - High Availability',
  description: `Implement sloppy quorums to maintain write availability even when some designated replicas are down. If the normal N=3 replicas are unavailable, write to alternative "fallback" nodes temporarily.

Learning objectives:
- Understand sloppy quorums for high availability
- Learn trade-off: availability vs consistency
- Handle temporary replica failures

Key requirements:
- Normal operation: Write to designated N=3 replicas
- During failures: Write to W=2 available nodes (may include fallback nodes)
- Eventual consistency when designated replicas recover`,

  userFacingFRs: [
    'Write to N=3 designated replicas under normal operation',
    'If designated replicas are down, write to fallback nodes',
    'Ensure W=2 writes succeed even with node failures',
    'Transfer data from fallback nodes back to designated replicas (hinted handoff)',
  ],
  userFacingNFRs: [
    'Write availability: 99.99% (accept writes even with failures)',
    'Consistency: Sloppy quorum may read stale data temporarily',
    'Recovery: Data migrates from fallback to designated replicas when they recover',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Designated replica nodes (may be down)',
      },
      {
        type: 'storage',
        reason: 'Fallback nodes for sloppy quorum',
      },
      {
        type: 'compute',
        reason: 'Coordinator to handle fallback logic',
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
        reason: 'Write to designated or fallback nodes',
      },
    ],
  },

  scenarios: generateScenarios('ddia-sloppy-quorum', problemConfigs['ddia-sloppy-quorum'] || {
    baseRps: 1000,
    readRatio: 0.5,
    maxLatency: 80,
    availability: 0.9999,
  }, [
    'Write to N=3 designated replicas under normal operation',
    'If designated replicas are down, write to fallback nodes',
    'Ensure W=2 writes succeed even with node failures',
    'Transfer data from fallback nodes back to designated replicas',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 59: Hinted Handoff
 * Teaches: Returning data from fallback nodes to designated replicas
 */
export const hintedHandoffProblemDefinition: ProblemDefinition = {
  id: 'ddia-hinted-handoff',
  title: 'Hinted Handoff - Replica Recovery',
  description: `When using sloppy quorums, data may be temporarily stored on fallback nodes. Implement hinted handoff to transfer this data back to the designated replicas once they recover.

Learning objectives:
- Understand hinted handoff mechanism
- Learn how to restore proper replication after failures
- Handle data migration between nodes

Key requirements:
- Detect when designated replicas come back online
- Transfer data from fallback nodes to recovered replicas
- Clean up data from fallback nodes after successful handoff`,

  userFacingFRs: [
    'Monitor designated replica nodes for recovery',
    'When replica recovers, transfer all hinted data from fallback nodes',
    'Verify successful transfer before deleting from fallback',
    'Resume normal replication to recovered replicas',
  ],
  userFacingNFRs: [
    'Handoff latency: <5 minutes after replica recovery',
    'Data consistency: Eventually all designated replicas have complete data',
    'Network efficiency: Batch transfers to minimize overhead',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Designated replica nodes',
      },
      {
        type: 'storage',
        reason: 'Fallback nodes with hinted data',
      },
      {
        type: 'compute',
        reason: 'Hinted handoff coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Monitor replicas and transfer hinted data',
      },
    ],
  },

  scenarios: generateScenarios('ddia-hinted-handoff', problemConfigs['ddia-hinted-handoff'] || {
    baseRps: 500,
    readRatio: 0.3,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Monitor designated replica nodes for recovery',
    'When replica recovers, transfer all hinted data from fallback nodes',
    'Verify successful transfer before deleting from fallback',
    'Resume normal replication to recovered replicas',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 60: Read Repair
 * Teaches: Fixing inconsistencies during read operations
 */
export const readRepairProblemDefinition: ProblemDefinition = {
  id: 'ddia-read-repair',
  title: 'Read Repair - Fix Stale Replicas',
  description: `Implement read repair to detect and fix stale replicas during read operations. When reading from multiple replicas, compare versions and update any stale replicas with the latest value.

Learning objectives:
- Detect stale data during quorum reads
- Update stale replicas in background
- Improve consistency over time

Key requirements:
- Read from R=2 replicas during quorum reads
- Compare versions/timestamps to identify stale values
- Update stale replicas with latest value in background`,

  userFacingFRs: [
    'Read from R=2 replicas (quorum read)',
    'Compare versions to identify latest value',
    'Return latest value to client immediately',
    'Asynchronously update any stale replicas with latest value (read repair)',
  ],
  userFacingNFRs: [
    'Read latency: <60ms (client gets response immediately)',
    'Read repair latency: <200ms (background update)',
    'Consistency improvement: Stale replicas updated on every read',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Multiple replica nodes (may have stale data)',
      },
      {
        type: 'compute',
        reason: 'Read repair coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send read requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Read from replicas and repair stale ones',
      },
    ],
  },

  scenarios: generateScenarios('ddia-read-repair', problemConfigs['ddia-read-repair'] || {
    baseRps: 2000,
    readRatio: 0.9,
    maxLatency: 60,
    availability: 0.999,
  }, [
    'Read from R=2 replicas (quorum read)',
    'Compare versions to identify latest value',
    'Return latest value to client immediately',
    'Asynchronously update any stale replicas with latest value',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 61: Anti-Entropy Process
 * Teaches: Background synchronization between replicas
 */
export const antiEntropyProblemDefinition: ProblemDefinition = {
  id: 'ddia-anti-entropy',
  title: 'Anti-Entropy Process',
  description: `Implement a background anti-entropy process that continuously compares replicas and repairs any inconsistencies. Unlike read repair (which happens during reads), anti-entropy runs independently to ensure all replicas converge.

Learning objectives:
- Understand background replica synchronization
- Learn Merkle tree-based comparison for efficiency
- Ensure eventual consistency

Key requirements:
- Periodically compare replicas in background
- Use Merkle trees or similar to efficiently find differences
- Repair detected inconsistencies`,

  userFacingFRs: [
    'Run background process to compare all replicas',
    'Build Merkle trees for efficient comparison',
    'Identify missing or inconsistent data',
    'Synchronize replicas to repair inconsistencies',
    'Run continuously without impacting foreground traffic',
  ],
  userFacingNFRs: [
    'Sync frequency: Every 1 hour',
    'Overhead: <5% of system resources',
    'Convergence: All replicas consistent within 2 hours',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Multiple replica nodes to synchronize',
      },
      {
        type: 'compute',
        reason: 'Anti-entropy background process',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'storage',
        reason: 'Compare and synchronize replicas',
      },
    ],
  },

  scenarios: generateScenarios('ddia-anti-entropy', problemConfigs['ddia-anti-entropy'] || {
    baseRps: 100,
    readRatio: 0.5,
    maxLatency: 1000,
    availability: 0.99,
  }, [
    'Run background process to compare all replicas',
    'Build Merkle trees for efficient comparison',
    'Identify missing or inconsistent data',
    'Synchronize replicas to repair inconsistencies',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all replication problems
export const ddiaReplicationProblems = [
  readReplicasProblemDefinition,
  asyncReplicationProblemDefinition,
  syncReplicationProblemDefinition,
  replicationLagProblemDefinition,
  failoverProblemDefinition,
  multiDatacenterReplicationProblemDefinition,
  writeConflictsProblemDefinition,
  conflictResolutionProblemDefinition,
  circularTopologyProblemDefinition,
  starTopologyProblemDefinition,
  quorumProblemDefinition,
  dynamoStyleProblemDefinition,
  sloppyQuorumProblemDefinition,
  hintedHandoffProblemDefinition,
  readRepairProblemDefinition,
  antiEntropyProblemDefinition,
];
