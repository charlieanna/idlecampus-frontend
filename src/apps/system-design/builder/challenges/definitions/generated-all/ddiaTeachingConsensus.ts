import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * DDIA Teaching Problems - Chapter 9: Consistency and Consensus
 * Total: 13 single-concept teaching problems
 *
 * Focus: One problem per consensus/consistency concept from DDIA Chapter 9
 */

// ============================================================================
// 9.1 Consistency Models
// ============================================================================

/**
 * Problem 100: Linearizability
 * Teaches: Strongest consistency guarantee (appears as single copy)
 */
export const linearizabilityProblemDefinition: ProblemDefinition = {
  id: 'ddia-linearizability',
  title: 'Linearizability - Strongest Consistency',
  description: `Implement linearizability, the strongest consistency model where all operations appear to execute atomically at a single point in time. Once a write completes, all subsequent reads must return that value (or a newer one).

Learning objectives:
- Understand linearizability guarantees
- Implement total ordering of operations
- Use compare-and-swap (CAS) for atomic updates

Key requirements:
- Every operation takes effect atomically at a single point between invocation and response
- Once a read returns a value, all future reads must return that value or newer
- Implement compare-and-swap for coordination`,

  userFacingFRs: [
    'All writes take effect atomically at a single point in time',
    'Reads always return the latest value (or fail)',
    'Implement compare-and-swap (CAS) operation',
    'Provide total order of all operations',
  ],
  userFacingNFRs: [
    'Read latency: <50ms',
    'Write latency: <80ms',
    'Consistency: Linearizable (strongest)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Linearizable storage (e.g., Raft-based)',
      },
      {
        type: 'compute',
        reason: 'Consensus coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send operations',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute linearizable operations',
      },
    ],
    dataModel: {
      entities: ['key_value'],
      fields: {
        key_value: ['key', 'value', 'version'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'high' },
      ],
    },
  },

  scenarios: generateScenarios('ddia-linearizability', problemConfigs['ddia-linearizability'] || {
    baseRps: 1500,
    readRatio: 0.6,
    maxLatency: 80,
    availability: 0.999,
  }, [
    'All writes take effect atomically',
    'Reads always return latest value',
    'Implement compare-and-swap (CAS)',
    'Provide total order of operations',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 101: Eventual Consistency
 * Teaches: Weak consistency model (converges over time)
 */
export const eventualConsistencyProblemDefinition: ProblemDefinition = {
  id: 'ddia-eventual-consistency',
  title: 'Eventual Consistency - Weak Guarantees',
  description: `Implement eventual consistency where replicas may temporarily diverge but eventually converge to the same value if no new writes arrive. Trade consistency for availability and performance.

Learning objectives:
- Understand eventual consistency trade-offs
- Learn convergence guarantees
- Handle temporary inconsistency

Key requirements:
- Allow replicas to have different values temporarily
- Replicas converge eventually (if writes stop)
- Handle stale reads gracefully`,

  userFacingFRs: [
    'Accept writes at any replica without coordination',
    'Replicate writes asynchronously to other replicas',
    'Reads may return stale values',
    'All replicas converge to same value eventually (if writes stop)',
  ],
  userFacingNFRs: [
    'Write latency: <10ms (no coordination)',
    'Read latency: <5ms (local replica)',
    'Convergence time: <5 seconds',
    'Availability: 99.99% (highly available)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Multiple replicas with async replication',
      },
      {
        type: 'compute',
        reason: 'Replication coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests to any replica',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Async replication between replicas',
      },
    ],
  },

  scenarios: generateScenarios('ddia-eventual-consistency', problemConfigs['ddia-eventual-consistency'] || {
    baseRps: 5000,
    readRatio: 0.8,
    maxLatency: 20,
    availability: 0.9999,
  }, [
    'Accept writes at any replica without coordination',
    'Replicate writes asynchronously',
    'Reads may return stale values',
    'All replicas converge eventually',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 102: Causal Consistency
 * Teaches: Preserve cause-effect relationships
 */
export const causalConsistencyProblemDefinition: ProblemDefinition = {
  id: 'ddia-causal-consistency',
  title: 'Causal Consistency - Preserve Causality',
  description: `Implement causal consistency where causally related operations are seen in the same order by all processes, but concurrent operations may be seen in different orders. Use version vectors to track causality.

Learning objectives:
- Understand causal relationships
- Use version vectors to track happens-before
- Preserve causality without linearizability

Example: If Alice posts "I got the job!" and then "Thanks everyone!", all users must see the posts in that order (causally related).

Key requirements:
- Track causal dependencies with version vectors
- Ensure causally related writes are seen in order
- Allow concurrent writes to be reordered`,

  userFacingFRs: [
    'Track version vectors for each write',
    'Ensure causally dependent operations seen in correct order',
    'Allow concurrent operations to be seen in any order',
    'Replicate writes with causal dependencies',
  ],
  userFacingNFRs: [
    'Write latency: <30ms',
    'Read latency: <20ms',
    'Causality: 100% preserved',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Storage with version vector support',
      },
      {
        type: 'compute',
        reason: 'Causal dependency tracker',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send operations with causality info',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Track and enforce causal ordering',
      },
    ],
  },

  scenarios: generateScenarios('ddia-causal-consistency', problemConfigs['ddia-causal-consistency'] || {
    baseRps: 2000,
    readRatio: 0.7,
    maxLatency: 30,
    availability: 0.999,
  }, [
    'Track version vectors for each write',
    'Ensure causally dependent operations seen in correct order',
    'Allow concurrent operations to be reordered',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 103: Read-Your-Writes Consistency
 * Teaches: Session consistency (see own writes)
 */
export const readYourWritesProblemDefinition: ProblemDefinition = {
  id: 'ddia-read-your-writes',
  title: 'Read-Your-Writes Consistency',
  description: `Implement read-your-writes consistency where a user always sees their own writes immediately, even with eventual consistency for other users. Common in social media applications.

Learning objectives:
- Provide session-level consistency
- Route user reads to up-to-date replicas
- Balance consistency for same user vs different users

Key requirements:
- Track which user made which writes
- Route user's reads to replicas with their writes
- Other users can tolerate eventual consistency`,

  userFacingFRs: [
    'Track user sessions and recent writes per session',
    'Route user reads to replica containing their writes',
    'Option 1: Read from leader for short time after write',
    'Option 2: Track write timestamps, only read from sufficiently up-to-date replica',
  ],
  userFacingNFRs: [
    'Read-your-writes latency: <30ms',
    'Other user reads: <10ms (eventual consistency OK)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Leader and replica databases',
      },
      {
        type: 'compute',
        reason: 'Session tracker and routing logic',
      },
      {
        type: 'cache',
        reason: 'Track recent writes per session',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send requests with session ID',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Track session writes',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route to appropriate replica',
      },
    ],
  },

  scenarios: generateScenarios('ddia-read-your-writes', problemConfigs['ddia-read-your-writes'] || {
    baseRps: 3000,
    readRatio: 0.8,
    maxLatency: 30,
    availability: 0.99,
  }, [
    'Track user sessions and recent writes',
    'Route user reads to replica containing their writes',
    'Read from leader or up-to-date replica after write',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 104: Monotonic Reads
 * Teaches: No going backward in time
 */
export const monotonicReadsProblemDefinition: ProblemDefinition = {
  id: 'ddia-monotonic-reads',
  title: 'Monotonic Reads - No Time Travel',
  description: `Implement monotonic reads where if a user reads a value, all subsequent reads will return that value or newer (never older). Prevents "moving backward in time" when reading from different replicas.

Learning objectives:
- Prevent reading stale data after seeing newer data
- Ensure time doesn't move backward for a user
- Route user to consistent replica

Key requirements:
- Track latest read timestamp per user
- Ensure future reads are at least as recent
- Route user to same replica or more up-to-date one`,

  userFacingFRs: [
    'Track each user\'s latest read timestamp',
    'Route reads to replica with data at least as recent',
    'Option 1: Sticky sessions (same replica)',
    'Option 2: Track timestamp, route to sufficiently up-to-date replica',
  ],
  userFacingNFRs: [
    'Read latency: <25ms',
    'Monotonic reads: 100% (never go backward)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Multiple replicas with different lag',
      },
      {
        type: 'compute',
        reason: 'Routing with timestamp tracking',
      },
      {
        type: 'cache',
        reason: 'Track user read timestamps',
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
        reason: 'Track read timestamps per user',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Route to appropriate replica',
      },
    ],
  },

  scenarios: generateScenarios('ddia-monotonic-reads', problemConfigs['ddia-monotonic-reads'] || {
    baseRps: 2500,
    readRatio: 0.9,
    maxLatency: 25,
    availability: 0.99,
  }, [
    'Track each user\'s latest read timestamp',
    'Route reads to replica at least as recent',
    'Ensure monotonic reads per user',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 9.2 Consensus Algorithms
// ============================================================================

/**
 * Problem 105: Paxos Algorithm
 * Teaches: Classic consensus algorithm (propose/accept phases)
 */
export const paxosProblemDefinition: ProblemDefinition = {
  id: 'ddia-paxos',
  title: 'Paxos Consensus Algorithm',
  description: `Implement the Paxos consensus algorithm with proposers, acceptors, and learners. Use prepare and accept phases to reach consensus on a single value despite failures.

Learning objectives:
- Understand Paxos prepare and accept phases
- Handle competing proposals
- Achieve consensus with fault tolerance

Key requirements:
- Phase 1 (Prepare): Proposer gets promises from majority of acceptors
- Phase 2 (Accept): Proposer sends value, acceptors accept if no higher-numbered proposal seen
- Learners learn chosen value once majority accepts`,

  userFacingFRs: [
    'Proposer sends prepare(n) to all acceptors',
    'Acceptors promise not to accept proposals < n',
    'Proposer sends accept(n, value) to acceptors',
    'Acceptors accept if no higher-numbered proposal seen',
    'Value chosen when majority of acceptors accept',
  ],
  userFacingNFRs: [
    'Consensus time: <500ms under normal conditions',
    'Fault tolerance: Tolerate f failures with 2f+1 nodes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Proposer nodes',
      },
      {
        type: 'storage',
        reason: 'Acceptor nodes with durable storage',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send proposals',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Proposers coordinate with acceptors',
      },
    ],
  },

  scenarios: generateScenarios('ddia-paxos', problemConfigs['ddia-paxos'] || {
    baseRps: 500,
    readRatio: 0.2,
    maxLatency: 500,
    availability: 0.999,
  }, [
    'Proposer sends prepare(n)',
    'Acceptors promise not to accept lower proposals',
    'Proposer sends accept(n, value)',
    'Acceptors accept if valid',
    'Value chosen when majority accepts',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 106: Raft Algorithm
 * Teaches: More understandable consensus (leader-based)
 */
export const raftProblemDefinition: ProblemDefinition = {
  id: 'ddia-raft',
  title: 'Raft Consensus Algorithm',
  description: `Implement the Raft consensus algorithm with leader election, log replication, and safety. Raft is designed to be more understandable than Paxos while providing the same guarantees.

Learning objectives:
- Understand leader-based consensus
- Implement leader election
- Replicate log entries with strong consistency

Key requirements:
- Leader election using randomized timeouts
- Log replication from leader to followers
- Commit entries when majority replicated
- Ensure safety (election safety, leader completeness, log matching, state machine safety)`,

  userFacingFRs: [
    'Leader election: Candidates request votes, majority wins',
    'Heartbeats: Leader sends regular heartbeats to prevent new elections',
    'Log replication: Leader appends entries to followers',
    'Commit when majority of followers have entry',
    'Apply committed entries to state machine',
  ],
  userFacingNFRs: [
    'Leader election time: <1 second',
    'Log replication latency: <50ms',
    'Fault tolerance: Tolerate f failures with 2f+1 nodes',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Raft nodes (leader + followers)',
      },
      {
        type: 'storage',
        reason: 'Durable log storage on each node',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send commands to leader',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Nodes replicate log entries',
      },
    ],
  },

  scenarios: generateScenarios('ddia-raft', problemConfigs['ddia-raft'] || {
    baseRps: 1000,
    readRatio: 0.4,
    maxLatency: 50,
    availability: 0.9999,
  }, [
    'Leader election using randomized timeouts',
    'Heartbeats to prevent new elections',
    'Log replication from leader to followers',
    'Commit when majority replicated',
    'Apply committed entries',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 107: Leader Election
 * Teaches: Elect a coordinator among distributed nodes
 */
export const leaderElectionProblemDefinition: ProblemDefinition = {
  id: 'ddia-leader-election',
  title: 'Leader Election',
  description: `Implement leader election where distributed nodes elect a single leader to coordinate operations. Use timeouts, heartbeats, and voting to ensure exactly one leader at a time.

Learning objectives:
- Elect a single leader reliably
- Detect leader failures
- Prevent split-brain (multiple leaders)

Key requirements:
- Nodes start election on timeout
- Candidate requests votes from peers
- Node with majority votes becomes leader
- Leader sends heartbeats to prevent new elections`,

  userFacingFRs: [
    'Nodes detect leader failure via missing heartbeats',
    'Candidate increments term and requests votes',
    'Nodes vote for first candidate in each term',
    'Candidate with majority becomes leader',
    'Leader sends periodic heartbeats',
  ],
  userFacingNFRs: [
    'Election time: <2 seconds',
    'Heartbeat interval: 100ms',
    'Split-brain prevention: 100% (fencing tokens)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Nodes participating in election',
      },
      {
        type: 'storage',
        reason: 'Persist term and vote',
      },
    ],
    mustConnect: [
      {
        from: 'compute',
        to: 'compute',
        reason: 'Nodes communicate for voting',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Persist election state',
      },
    ],
  },

  scenarios: generateScenarios('ddia-leader-election', problemConfigs['ddia-leader-election'] || {
    baseRps: 100,
    readRatio: 0.1,
    maxLatency: 2000,
    availability: 0.999,
  }, [
    'Nodes detect leader failure',
    'Candidate requests votes',
    'Nodes vote for first candidate per term',
    'Majority wins and becomes leader',
    'Leader sends heartbeats',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 108: Distributed Locks
 * Teaches: Coordinate exclusive access with locks
 */
export const distributedLocksProblemDefinition: ProblemDefinition = {
  id: 'ddia-distributed-locks',
  title: 'Distributed Locks',
  description: `Implement distributed locks to coordinate exclusive access to shared resources across multiple nodes. Use lease-based locks with timeouts to handle failures.

Learning objectives:
- Implement distributed lock acquisition
- Handle lock expiration and renewal
- Prevent deadlocks and stale locks

Key requirements:
- Acquire lock with timeout (lease)
- Renew lock before expiration
- Release lock explicitly or let it expire
- Prevent two clients from holding same lock`,

  userFacingFRs: [
    'Client requests lock with name and lease duration',
    'Lock service grants lock if available',
    'Client must renew lock before expiration',
    'Lock released explicitly or expires after lease duration',
    'Only one client can hold a given lock at a time',
  ],
  userFacingNFRs: [
    'Lock acquisition: <20ms',
    'Lease duration: 10 seconds default',
    'Exclusivity: 100% (only one holder)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Store lock state (holder, expiration)',
      },
      {
        type: 'compute',
        reason: 'Lock service coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients request locks',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Store and check lock state',
      },
    ],
  },

  scenarios: generateScenarios('ddia-distributed-locks', problemConfigs['ddia-distributed-locks'] || {
    baseRps: 1000,
    readRatio: 0.3,
    maxLatency: 20,
    availability: 0.999,
  }, [
    'Client requests lock with lease duration',
    'Lock service grants if available',
    'Client renews before expiration',
    'Lock released or expires',
    'Only one client holds lock',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 109: Fencing Tokens
 * Teaches: Prevent zombie processes with monotonic tokens
 */
export const fencingTokensProblemDefinition: ProblemDefinition = {
  id: 'ddia-fencing-tokens',
  title: 'Fencing Tokens - Prevent Zombies',
  description: `Implement fencing tokens to prevent zombie processes from corrupting data. When granting a lock, also issue a monotonically increasing token. Storage rejects writes with lower token numbers.

Learning objectives:
- Prevent zombie process problem
- Use monotonic tokens for fencing
- Ensure safety even with message delays

Example: Client A gets lock (token=33), pauses for GC, Client B gets lock (token=34) and writes, Client A wakes up and tries to write - storage rejects because token 33 < 34.

Key requirements:
- Issue monotonically increasing token with each lock grant
- Storage checks token before accepting writes
- Reject writes with stale (lower) tokens`,

  userFacingFRs: [
    'Lock service maintains monotonic counter',
    'When granting lock, increment counter and return as token',
    'Client includes token with all writes',
    'Storage accepts write only if token > all previous tokens for that resource',
    'Reject writes with stale tokens',
  ],
  userFacingNFRs: [
    'Lock acquisition: <30ms (includes token)',
    'Write latency: <40ms (includes token check)',
    'Safety: 100% (zombie writes rejected)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Store locks, tokens, and validate writes',
      },
      {
        type: 'compute',
        reason: 'Lock service with token generation',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Acquire locks and get tokens',
      },
      {
        from: 'client',
        to: 'storage',
        reason: 'Write with token',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Coordinate locks and tokens',
      },
    ],
  },

  scenarios: generateScenarios('ddia-fencing-tokens', problemConfigs['ddia-fencing-tokens'] || {
    baseRps: 800,
    readRatio: 0.2,
    maxLatency: 40,
    availability: 0.999,
  }, [
    'Lock service maintains monotonic counter',
    'Grant lock with incremented token',
    'Client includes token with writes',
    'Storage validates token before accepting write',
    'Reject stale tokens',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 9.3 CRDTs (Conflict-Free Replicated Data Types)
// ============================================================================

/**
 * Problem 110: G-Counter (Grow-Only Counter)
 * Teaches: Distributed counter that only increments
 */
export const gCounterProblemDefinition: ProblemDefinition = {
  id: 'ddia-g-counter',
  title: 'G-Counter - Grow-Only Counter',
  description: `Implement a Grow-Only Counter (G-Counter) CRDT that can be incremented at any replica and eventually converges. Each replica maintains its own counter, total is the sum.

Learning objectives:
- Understand CRDT (Conflict-Free Replicated Data Type)
- Implement state-based CRDT
- Achieve convergence without coordination

Key requirements:
- Each replica has its own counter
- Increment only local counter
- Read = sum of all replica counters
- Merge state from other replicas`,

  userFacingFRs: [
    'Each replica maintains counter map: {replica_id: count}',
    'Increment: Increase local replica\'s counter',
    'Read: Return sum of all replica counters',
    'Merge: Take max count for each replica from both states',
  ],
  userFacingNFRs: [
    'Increment latency: <5ms (local only)',
    'Read latency: <10ms',
    'Convergence: Eventual (once states merge)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Multiple replicas with G-Counter state',
      },
      {
        type: 'compute',
        reason: 'CRDT merge logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients increment counter at any replica',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Store and merge CRDT state',
      },
    ],
  },

  scenarios: generateScenarios('ddia-g-counter', problemConfigs['ddia-g-counter'] || {
    baseRps: 3000,
    readRatio: 0.5,
    maxLatency: 10,
    availability: 0.9999,
  }, [
    'Each replica maintains counter map',
    'Increment local replica counter',
    'Read returns sum of all counters',
    'Merge takes max for each replica',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 111: PN-Counter (Positive-Negative Counter)
 * Teaches: Counter that can increment and decrement
 */
export const pnCounterProblemDefinition: ProblemDefinition = {
  id: 'ddia-pn-counter',
  title: 'PN-Counter - Increment and Decrement',
  description: `Implement a PN-Counter (Positive-Negative Counter) CRDT that supports both increment and decrement operations. Use two G-Counters: one for increments, one for decrements.

Learning objectives:
- Extend G-Counter to support decrements
- Use two counters (positive and negative)
- Achieve conflict-free convergence

Key requirements:
- Maintain two G-Counters: positive and negative
- Increment adds to positive counter
- Decrement adds to negative counter
- Read = sum(positive) - sum(negative)`,

  userFacingFRs: [
    'Maintain two G-Counters per replica: increments and decrements',
    'Increment: Add to local increment counter',
    'Decrement: Add to local decrement counter',
    'Read: sum(all increments) - sum(all decrements)',
    'Merge: Merge both G-Counters independently',
  ],
  userFacingNFRs: [
    'Operation latency: <5ms',
    'Read latency: <10ms',
    'Convergence: Eventual',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Replicas with PN-Counter state',
      },
      {
        type: 'compute',
        reason: 'CRDT merge logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients increment/decrement',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Store and merge state',
      },
    ],
  },

  scenarios: generateScenarios('ddia-pn-counter', problemConfigs['ddia-pn-counter'] || {
    baseRps: 2500,
    readRatio: 0.6,
    maxLatency: 10,
    availability: 0.9999,
  }, [
    'Maintain two G-Counters',
    'Increment adds to positive counter',
    'Decrement adds to negative counter',
    'Read is difference of sums',
    'Merge both counters',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 112: LWW-Register (Last-Write-Wins Register)
 * Teaches: Simple register with timestamp-based conflict resolution
 */
export const lwwRegisterProblemDefinition: ProblemDefinition = {
  id: 'ddia-lww-register',
  title: 'LWW-Register - Last Write Wins',
  description: `Implement a Last-Write-Wins Register that resolves conflicts using timestamps. The write with the latest timestamp wins. Simple but may lose data.

Learning objectives:
- Implement timestamp-based conflict resolution
- Understand LWW trade-offs (simplicity vs data loss)
- Use logical or physical timestamps

Key requirements:
- Store value with timestamp
- On write, update value and timestamp
- On merge, keep value with latest timestamp
- Handle tie-breaking (e.g., by replica ID)`,

  userFacingFRs: [
    'Store (value, timestamp) pair',
    'Write: Set value and current timestamp',
    'Merge: Keep value with latest timestamp (break ties by replica ID)',
    'Read: Return current value',
  ],
  userFacingNFRs: [
    'Write latency: <5ms',
    'Read latency: <5ms',
    'Data loss: Concurrent writes may be lost',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Replicas with LWW-Register state',
      },
      {
        type: 'compute',
        reason: 'Timestamp-based merge',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients write values',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Store and merge with timestamps',
      },
    ],
  },

  scenarios: generateScenarios('ddia-lww-register', problemConfigs['ddia-lww-register'] || {
    baseRps: 4000,
    readRatio: 0.7,
    maxLatency: 10,
    availability: 0.9999,
  }, [
    'Store (value, timestamp)',
    'Write sets value and timestamp',
    'Merge keeps latest timestamp',
    'Read returns current value',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 113: OR-Set (Observed-Remove Set)
 * Teaches: Set CRDT with proper add/remove semantics
 */
export const orSetProblemDefinition: ProblemDefinition = {
  id: 'ddia-or-set',
  title: 'OR-Set - Observed-Remove Set',
  description: `Implement an OR-Set (Observed-Remove Set) CRDT where an element can be added and removed multiple times. Removals only affect elements that were observed (seen) at the time of removal.

Learning objectives:
- Understand add-wins vs remove-wins semantics
- Track unique identifiers for each add
- Implement observed-remove logic

Key requirements:
- Each add gets unique identifier (UUID)
- Add element with unique ID to set
- Remove deletes only observed IDs
- Merge unions all adds and removals`,

  userFacingFRs: [
    'Add element with unique ID: adds[element] = {uuid1, uuid2, ...}',
    'Remove element: Removes all currently observed UUIDs from adds',
    'Membership: Element in set if it has any UUIDs in adds',
    'Merge: Union adds, union removes',
  ],
  userFacingNFRs: [
    'Add latency: <10ms',
    'Remove latency: <10ms',
    'Membership check: <5ms',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Replicas with OR-Set state',
      },
      {
        type: 'compute',
        reason: 'OR-Set merge logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients add/remove elements',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Store and merge OR-Set state',
      },
    ],
  },

  scenarios: generateScenarios('ddia-or-set', problemConfigs['ddia-or-set'] || {
    baseRps: 2000,
    readRatio: 0.6,
    maxLatency: 10,
    availability: 0.9999,
  }, [
    'Add element with unique ID',
    'Remove deletes observed IDs',
    'Membership check for UUIDs',
    'Merge unions adds and removes',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all consensus problems
export const ddiaConsensusProblems = [
  linearizabilityProblemDefinition,
  eventualConsistencyProblemDefinition,
  causalConsistencyProblemDefinition,
  readYourWritesProblemDefinition,
  monotonicReadsProblemDefinition,
  paxosProblemDefinition,
  raftProblemDefinition,
  leaderElectionProblemDefinition,
  distributedLocksProblemDefinition,
  fencingTokensProblemDefinition,
  gCounterProblemDefinition,
  pnCounterProblemDefinition,
  lwwRegisterProblemDefinition,
  orSetProblemDefinition,
];

