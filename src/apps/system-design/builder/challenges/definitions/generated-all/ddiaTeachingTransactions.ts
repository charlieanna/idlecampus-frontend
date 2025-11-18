import { ProblemDefinition } from '../../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../../validation/validators/featureValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * DDIA Teaching Problems - Chapter 7: Transactions
 * Total: 15 single-concept teaching problems
 *
 * Focus: One problem per transaction concept from DDIA Chapter 7
 */

// ============================================================================
// 7.1 ACID Properties
// ============================================================================

/**
 * Problem 74: Atomicity
 * Teaches: All-or-nothing transaction execution
 */
export const atomicityProblemDefinition: ProblemDefinition = {
  id: 'ddia-atomicity',
  title: 'Atomicity - All or Nothing',
  description: `Implement atomic transactions where either all operations succeed or none do. If any operation in a transaction fails, roll back all previous operations to maintain consistency.

Learning objectives:
- Understand atomicity (all-or-nothing execution)
- Implement transaction rollback
- Handle partial failures

Example: Bank transfer must debit one account AND credit another atomically.

Key requirements:
- Group multiple operations into a transaction
- Commit all operations if all succeed
- Rollback all operations if any fails`,

  userFacingFRs: [
    'Begin transaction (start tracking operations)',
    'Execute multiple operations within transaction scope',
    'Commit transaction if all operations succeed',
    'Rollback all operations if any operation fails',
    'Maintain undo log for rollback capability',
  ],
  userFacingNFRs: [
    'Transaction latency: <50ms for simple transactions',
    'Rollback time: <20ms',
    'Guarantee: 100% atomicity - no partial updates visible',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with transaction support',
      },
      {
        type: 'compute',
        reason: 'Transaction coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transaction requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute transaction operations',
      },
    ],
    dataModel: {
      entities: ['account', 'transaction_log'],
      fields: {
        account: ['account_id', 'balance', 'version'],
        transaction_log: ['tx_id', 'operations', 'status'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'high' },
      ],
    },
  },

  scenarios: generateScenarios('ddia-atomicity', problemConfigs['ddia-atomicity'] || {
    baseRps: 1000,
    readRatio: 0.3,
    maxLatency: 50,
    availability: 0.999,
  }, [
    'Begin transaction',
    'Execute multiple operations within transaction scope',
    'Commit transaction if all operations succeed',
    'Rollback all operations if any operation fails',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 75: Consistency
 * Teaches: Maintaining database invariants
 */
export const consistencyProblemDefinition: ProblemDefinition = {
  id: 'ddia-consistency',
  title: 'Consistency - Maintain Invariants',
  description: `Implement consistency checks to maintain database invariants. For example, total money in a banking system should remain constant after transfers. Validate invariants before committing transactions.

Learning objectives:
- Define and enforce database invariants
- Validate consistency constraints
- Reject transactions that violate invariants

Example: Sum of all account balances must equal total deposits minus total withdrawals.

Key requirements:
- Define invariants (e.g., account balance >= 0)
- Check invariants before committing transactions
- Reject transactions that violate invariants`,

  userFacingFRs: [
    'Define invariants: account.balance >= 0, sum(balances) = constant',
    'Before commit, validate all invariants',
    'Reject and rollback transaction if any invariant violated',
    'Maintain referential integrity constraints',
  ],
  userFacingNFRs: [
    'Validation overhead: <10ms per transaction',
    'Consistency: 100% - no invariant violations allowed',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with constraint checking',
      },
      {
        type: 'compute',
        reason: 'Invariant validation logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transaction requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute and validate transactions',
      },
    ],
  },

  scenarios: generateScenarios('ddia-consistency', problemConfigs['ddia-consistency'] || {
    baseRps: 800,
    readRatio: 0.2,
    maxLatency: 60,
    availability: 0.999,
  }, [
    'Define invariants',
    'Before commit, validate all invariants',
    'Reject and rollback transaction if any invariant violated',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 76: Isolation
 * Teaches: Concurrent transaction handling
 */
export const isolationProblemDefinition: ProblemDefinition = {
  id: 'ddia-isolation',
  title: 'Isolation - Concurrent Transactions',
  description: `Implement transaction isolation to prevent concurrent transactions from interfering with each other. Transactions should execute as if they are running serially, even when running concurrently.

Learning objectives:
- Understand isolation between concurrent transactions
- Prevent read/write conflicts
- Learn isolation levels and their trade-offs

Key requirements:
- Support concurrent transactions
- Prevent dirty reads, dirty writes
- Provide serializable execution semantics`,

  userFacingFRs: [
    'Support concurrent transactions on same data',
    'Prevent dirty reads (reading uncommitted data)',
    'Prevent dirty writes (overwriting uncommitted data)',
    'Ensure serializability (equivalent to serial execution)',
  ],
  userFacingNFRs: [
    'Concurrency: Support 100 concurrent transactions',
    'Latency: <100ms per transaction (may wait for locks)',
    'Throughput: Depends on lock contention',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with isolation support',
      },
      {
        type: 'compute',
        reason: 'Concurrency control (locking or MVCC)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Multiple clients send concurrent transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Coordinate concurrent access',
      },
    ],
  },

  scenarios: generateScenarios('ddia-isolation', problemConfigs['ddia-isolation'] || {
    baseRps: 2000,
    readRatio: 0.5,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Support concurrent transactions on same data',
    'Prevent dirty reads',
    'Prevent dirty writes',
    'Ensure serializability',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 77: Durability
 * Teaches: Persist committed transactions
 */
export const durabilityProblemDefinition: ProblemDefinition = {
  id: 'ddia-durability',
  title: 'Durability - Persistent Storage',
  description: `Implement durability to ensure that once a transaction is committed, its changes are permanent even if the system crashes. Use write-ahead logging (WAL) to persist changes before acknowledging commits.

Learning objectives:
- Understand durability guarantees
- Implement write-ahead logging (WAL)
- Recover from crashes

Key requirements:
- Write all changes to WAL before committing
- Persist WAL to durable storage (disk, SSD)
- Recover from WAL after crashes`,

  userFacingFRs: [
    'Write all transaction operations to WAL before committing',
    'Persist WAL to disk with fsync',
    'Only acknowledge commit after WAL is durable',
    'On crash recovery, replay WAL to restore committed transactions',
  ],
  userFacingNFRs: [
    'Commit latency: <50ms (includes disk write)',
    'Durability: 100% - no data loss after acknowledged commit',
    'Recovery time: <10 seconds to replay WAL',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with WAL support',
      },
      {
        type: 'storage',
        reason: 'Durable WAL storage (separate disk)',
      },
      {
        type: 'compute',
        reason: 'WAL writer and recovery manager',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Write WAL and execute transactions',
      },
    ],
  },

  scenarios: generateScenarios('ddia-durability', problemConfigs['ddia-durability'] || {
    baseRps: 1500,
    readRatio: 0.3,
    maxLatency: 50,
    availability: 0.9999,
  }, [
    'Write all transaction operations to WAL before committing',
    'Persist WAL to disk with fsync',
    'Only acknowledge commit after WAL is durable',
    'On crash recovery, replay WAL',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 7.2 Isolation Levels
// ============================================================================

/**
 * Problem 78: Read Committed
 * Teaches: Prevent dirty reads and dirty writes
 */
export const readCommittedProblemDefinition: ProblemDefinition = {
  id: 'ddia-read-committed',
  title: 'Read Committed Isolation',
  description: `Implement Read Committed isolation level that prevents dirty reads (reading uncommitted data) and dirty writes (overwriting uncommitted data). Use row-level locks for writes and snapshots for reads.

Learning objectives:
- Prevent dirty reads and writes
- Understand read committed semantics
- Learn row-level locking

Key requirements:
- Transactions only read committed data
- Transactions only overwrite committed data
- Allow non-repeatable reads (same read may return different values)`,

  userFacingFRs: [
    'Use row-level write locks to prevent dirty writes',
    'Return only committed values for reads (no dirty reads)',
    'Release read locks immediately after read (allow non-repeatable reads)',
    'Hold write locks until transaction commits',
  ],
  userFacingNFRs: [
    'Read latency: <15ms',
    'Write latency: <40ms',
    'Concurrency: High (minimal read locking)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with read committed support',
      },
      {
        type: 'compute',
        reason: 'Lock manager',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute with row-level locks',
      },
    ],
  },

  scenarios: generateScenarios('ddia-read-committed', problemConfigs['ddia-read-committed'] || {
    baseRps: 3000,
    readRatio: 0.7,
    maxLatency: 40,
    availability: 0.99,
  }, [
    'Use row-level write locks to prevent dirty writes',
    'Return only committed values for reads',
    'Release read locks immediately after read',
    'Hold write locks until transaction commits',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 79: Snapshot Isolation
 * Teaches: Consistent point-in-time reads using MVCC
 */
export const snapshotIsolationProblemDefinition: ProblemDefinition = {
  id: 'ddia-snapshot-isolation',
  title: 'Snapshot Isolation - MVCC',
  description: `Implement Snapshot Isolation using Multi-Version Concurrency Control (MVCC). Each transaction sees a consistent snapshot of the database as of the transaction start time. Prevents non-repeatable reads and phantom reads.

Learning objectives:
- Understand MVCC (multi-version concurrency control)
- Implement consistent snapshots
- Prevent read anomalies (non-repeatable reads, phantoms)

Key requirements:
- Store multiple versions of each row with timestamps
- Transactions read from consistent snapshot (transaction start time)
- Detect write conflicts and abort one transaction`,

  userFacingFRs: [
    'Assign transaction ID at transaction start',
    'Read from snapshot where version <= transaction start time',
    'Always see consistent snapshot (repeatable reads)',
    'On write conflict, abort one transaction (first-committer-wins)',
  ],
  userFacingNFRs: [
    'Read latency: <20ms',
    'Write latency: <50ms',
    'Storage overhead: 2-3x for multiple versions',
    'Garbage collection: Remove old versions periodically',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with MVCC support',
      },
      {
        type: 'compute',
        reason: 'Transaction coordinator with snapshot management',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Read from snapshot, detect write conflicts',
      },
    ],
  },

  scenarios: generateScenarios('ddia-snapshot-isolation', problemConfigs['ddia-snapshot-isolation'] || {
    baseRps: 2500,
    readRatio: 0.8,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Assign transaction ID at transaction start',
    'Read from snapshot where version <= transaction start time',
    'Always see consistent snapshot (repeatable reads)',
    'On write conflict, abort one transaction',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 80: Serializable Isolation
 * Teaches: Strictest isolation level (true serializability)
 */
export const serializableProblemDefinition: ProblemDefinition = {
  id: 'ddia-serializable',
  title: 'Serializable Isolation - Strictest',
  description: `Implement Serializable isolation, the strictest level that prevents all read and write anomalies. Transactions execute as if they ran in serial order. Use Serializable Snapshot Isolation (SSI) to detect conflicts.

Learning objectives:
- Understand true serializability
- Detect all read/write conflicts
- Prevent write skew and phantom reads

Key requirements:
- Detect read-write conflicts (transaction reads data that another writes)
- Detect write-write conflicts
- Abort transactions when conflicts detected`,

  userFacingFRs: [
    'Track all reads and writes per transaction',
    'Detect read-write conflicts between concurrent transactions',
    'Detect write-write conflicts',
    'Abort one transaction when conflict detected (choose victim)',
    'Ensure execution equivalent to some serial order',
  ],
  userFacingNFRs: [
    'Latency: <100ms (higher than snapshot isolation due to conflict detection)',
    'Abort rate: 5-15% under high contention',
    'Throughput: Lower than snapshot isolation',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with SSI support',
      },
      {
        type: 'compute',
        reason: 'Conflict detection and resolution',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Detect conflicts and abort when needed',
      },
    ],
  },

  scenarios: generateScenarios('ddia-serializable', problemConfigs['ddia-serializable'] || {
    baseRps: 1500,
    readRatio: 0.6,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Track all reads and writes per transaction',
    'Detect read-write conflicts between concurrent transactions',
    'Detect write-write conflicts',
    'Abort one transaction when conflict detected',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 81: Repeatable Read
 * Teaches: Same read returns same value within transaction
 */
export const repeatableReadProblemDefinition: ProblemDefinition = {
  id: 'ddia-repeatable-read',
  title: 'Repeatable Read - Consistent Reads',
  description: `Implement Repeatable Read isolation where reading the same row multiple times within a transaction always returns the same value. This is typically implemented using snapshot isolation.

Learning objectives:
- Prevent non-repeatable reads
- Understand repeatable read semantics
- Use MVCC for implementation

Key requirements:
- Multiple reads of same row return same value
- Prevent other transactions from modifying rows being read
- May still allow phantom reads (new rows appearing in range queries)`,

  userFacingFRs: [
    'Use MVCC to provide consistent snapshot',
    'All reads within transaction see same data version',
    'Prevent non-repeatable reads',
    'May allow phantom reads (new rows in range queries)',
  ],
  userFacingNFRs: [
    'Read latency: <20ms',
    'Consistency: Repeatable reads within transaction',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with repeatable read support (MVCC)',
      },
      {
        type: 'compute',
        reason: 'Snapshot management',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Read from consistent snapshot',
      },
    ],
  },

  scenarios: generateScenarios('ddia-repeatable-read', problemConfigs['ddia-repeatable-read'] || {
    baseRps: 2000,
    readRatio: 0.8,
    maxLatency: 30,
    availability: 0.99,
  }, [
    'Use MVCC to provide consistent snapshot',
    'All reads within transaction see same data version',
    'Prevent non-repeatable reads',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 7.3 Concurrency Issues
// ============================================================================

/**
 * Problem 82: Dirty Reads
 * Teaches: Read uncommitted data problem
 */
export const dirtyReadsProblemDefinition: ProblemDefinition = {
  id: 'ddia-dirty-reads',
  title: 'Dirty Reads - Reading Uncommitted Data',
  description: `Demonstrate the dirty read problem where a transaction reads uncommitted data from another transaction. Then show how to prevent it using Read Committed isolation.

Learning objectives:
- Understand dirty read anomaly
- See why it's problematic
- Learn to prevent with Read Committed

Scenario: Transaction A updates balance, Transaction B reads new balance, then A rolls back. B read data that never existed!

Key requirements:
- Show dirty read problem
- Implement prevention mechanism`,

  userFacingFRs: [
    'Allow Read Uncommitted mode (demonstrates problem)',
    'Transaction reads uncommitted writes from concurrent transaction',
    'Show how rollback creates inconsistency',
    'Implement Read Committed to prevent dirty reads',
  ],
  userFacingNFRs: [
    'Demonstration: Show dirty read anomaly clearly',
    'Prevention: 100% - no dirty reads with Read Committed',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database demonstrating dirty reads',
      },
      {
        type: 'compute',
        reason: 'Transaction coordinator',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send concurrent transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Execute transactions',
      },
    ],
  },

  scenarios: generateScenarios('ddia-dirty-reads', problemConfigs['ddia-dirty-reads'] || {
    baseRps: 1000,
    readRatio: 0.6,
    maxLatency: 40,
    availability: 0.99,
  }, [
    'Allow Read Uncommitted mode',
    'Transaction reads uncommitted writes from concurrent transaction',
    'Show how rollback creates inconsistency',
    'Implement Read Committed to prevent',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 83: Dirty Writes
 * Teaches: Overwriting uncommitted data problem
 */
export const dirtyWritesProblemDefinition: ProblemDefinition = {
  id: 'ddia-dirty-writes',
  title: 'Dirty Writes - Overwriting Uncommitted Data',
  description: `Demonstrate dirty writes where a transaction overwrites uncommitted data from another transaction. Prevent using row-level write locks.

Learning objectives:
- Understand dirty write anomaly
- See data corruption from concurrent writes
- Learn to prevent with write locks

Scenario: Both transactions update same row, one rolls back - which value should remain?

Key requirements:
- Show dirty write problem
- Implement write locks to prevent`,

  userFacingFRs: [
    'Allow concurrent writes to same row (demonstrates problem)',
    'Show data corruption when one transaction rolls back',
    'Implement row-level write locks',
    'Ensure only one transaction can write to a row at a time',
  ],
  userFacingNFRs: [
    'Demonstration: Show dirty write anomaly',
    'Prevention: 100% - no dirty writes with locking',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with write lock capability',
      },
      {
        type: 'compute',
        reason: 'Lock manager',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send concurrent transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Acquire write locks before updating',
      },
    ],
  },

  scenarios: generateScenarios('ddia-dirty-writes', problemConfigs['ddia-dirty-writes'] || {
    baseRps: 800,
    readRatio: 0.2,
    maxLatency: 50,
    availability: 0.99,
  }, [
    'Allow concurrent writes to same row',
    'Show data corruption when one transaction rolls back',
    'Implement row-level write locks',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 84: Read Skew (Non-Repeatable Reads)
 * Teaches: Reading different values in same transaction
 */
export const readSkewProblemDefinition: ProblemDefinition = {
  id: 'ddia-read-skew',
  title: 'Read Skew - Non-Repeatable Reads',
  description: `Demonstrate read skew (non-repeatable reads) where reading the same row twice within a transaction returns different values. Prevent using snapshot isolation.

Learning objectives:
- Understand read skew / non-repeatable reads
- See inconsistencies from mid-transaction updates
- Learn to prevent with snapshot isolation

Scenario: Transaction reads balance, another transaction updates it, first transaction reads again - different value!

Key requirements:
- Show read skew problem
- Implement snapshot isolation to prevent`,

  userFacingFRs: [
    'Allow Read Committed (demonstrates read skew)',
    'Transaction reads same row twice, gets different values',
    'Show inconsistency in business logic',
    'Implement Snapshot Isolation (MVCC) to prevent',
  ],
  userFacingNFRs: [
    'Demonstration: Show read skew anomaly',
    'Prevention: Repeatable reads with snapshot isolation',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with MVCC capability',
      },
      {
        type: 'compute',
        reason: 'Snapshot manager',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Provide consistent snapshots',
      },
    ],
  },

  scenarios: generateScenarios('ddia-read-skew', problemConfigs['ddia-read-skew'] || {
    baseRps: 1500,
    readRatio: 0.8,
    maxLatency: 40,
    availability: 0.99,
  }, [
    'Allow Read Committed',
    'Transaction reads same row twice, gets different values',
    'Implement Snapshot Isolation to prevent',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 85: Write Skew
 * Teaches: Concurrent transactions violating constraints
 */
export const writeSkewProblemDefinition: ProblemDefinition = {
  id: 'ddia-write-skew',
  title: 'Write Skew - Constraint Violations',
  description: `Demonstrate write skew where two concurrent transactions each read data, make decisions, and write - resulting in constraint violations. Requires serializable isolation to prevent.

Learning objectives:
- Understand write skew anomaly
- See how snapshot isolation isn't enough
- Learn to prevent with serializable isolation

Example: "At least one doctor must be on call." Two doctors concurrently read that the other is on-call, then both go off-call - violates constraint!

Key requirements:
- Show write skew problem
- Implement serializable isolation to prevent`,

  userFacingFRs: [
    'Allow Snapshot Isolation (demonstrates write skew)',
    'Two transactions read overlapping data, make decisions, write',
    'Show constraint violation after both commit',
    'Implement Serializable Isolation to detect conflict and abort one transaction',
  ],
  userFacingNFRs: [
    'Demonstration: Show write skew anomaly',
    'Prevention: Detect conflicts with serializable isolation',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with serializable support',
      },
      {
        type: 'compute',
        reason: 'Conflict detection for write skew',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Detect read-write conflicts',
      },
    ],
  },

  scenarios: generateScenarios('ddia-write-skew', problemConfigs['ddia-write-skew'] || {
    baseRps: 1000,
    readRatio: 0.4,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Allow Snapshot Isolation',
    'Two transactions read overlapping data, make decisions, write',
    'Show constraint violation',
    'Implement Serializable Isolation to prevent',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 86: Phantom Reads
 * Teaches: New rows appearing in range queries
 */
export const phantomReadsProblemDefinition: ProblemDefinition = {
  id: 'ddia-phantom-reads',
  title: 'Phantom Reads - New Rows in Range',
  description: `Demonstrate phantom reads where a transaction executes the same range query twice and gets different results because another transaction inserted/deleted rows. Prevent using serializable isolation or predicate locks.

Learning objectives:
- Understand phantom read anomaly
- See how it affects range queries
- Learn to prevent with predicate locks or serializable isolation

Example: Transaction queries "count rooms available on 5th floor", another transaction adds a room, first transaction queries again - different count!

Key requirements:
- Show phantom read problem with range queries
- Implement predicate locks or serializable isolation`,

  userFacingFRs: [
    'Execute range query (e.g., SELECT * WHERE floor = 5)',
    'Concurrent transaction inserts row matching range',
    'Re-execute same range query, get different results (phantom row)',
    'Implement predicate locks or serializable isolation to prevent',
  ],
  userFacingNFRs: [
    'Demonstration: Show phantom reads',
    'Prevention: Lock entire range or use serializable isolation',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with range lock or serializable support',
      },
      {
        type: 'compute',
        reason: 'Predicate lock manager or conflict detection',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send range queries',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Lock ranges or detect phantoms',
      },
    ],
  },

  scenarios: generateScenarios('ddia-phantom-reads', problemConfigs['ddia-phantom-reads'] || {
    baseRps: 1200,
    readRatio: 0.7,
    maxLatency: 80,
    availability: 0.99,
  }, [
    'Execute range query',
    'Concurrent transaction inserts row matching range',
    'Re-execute same range query, get different results',
    'Implement predicate locks or serializable isolation',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// ============================================================================
// 7.4 Locking Mechanisms
// ============================================================================

/**
 * Problem 87: Two-Phase Locking (2PL)
 * Teaches: Pessimistic concurrency control
 */
export const twoPhaseLockingProblemDefinition: ProblemDefinition = {
  id: 'ddia-two-phase-locking',
  title: 'Two-Phase Locking (2PL)',
  description: `Implement Two-Phase Locking (2PL) for serializability. Transactions acquire locks during growing phase and release all locks during shrinking phase. Provides strong isolation but can cause deadlocks.

Learning objectives:
- Understand 2PL protocol
- Implement shared and exclusive locks
- Handle deadlocks

Key requirements:
- Growing phase: Acquire locks, cannot release any lock
- Shrinking phase: Release locks, cannot acquire any lock
- Shared locks for reads, exclusive locks for writes`,

  userFacingFRs: [
    'Acquire shared lock for reads (multiple transactions can hold)',
    'Acquire exclusive lock for writes (only one transaction)',
    'Growing phase: Acquire locks as needed, don\'t release any',
    'Shrinking phase (commit/abort): Release all locks at once',
    'Detect and resolve deadlocks',
  ],
  userFacingNFRs: [
    'Latency: <100ms (may wait for locks)',
    'Deadlock detection: <5 seconds',
    'Throughput: Lower due to lock contention',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with 2PL support',
      },
      {
        type: 'compute',
        reason: 'Lock manager with deadlock detection',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Acquire locks before access',
      },
    ],
  },

  scenarios: generateScenarios('ddia-two-phase-locking', problemConfigs['ddia-two-phase-locking'] || {
    baseRps: 1000,
    readRatio: 0.6,
    maxLatency: 100,
    availability: 0.99,
  }, [
    'Acquire shared lock for reads',
    'Acquire exclusive lock for writes',
    'Growing phase: Acquire locks, don\'t release',
    'Shrinking phase: Release all locks at once',
    'Detect and resolve deadlocks',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 88: Optimistic Concurrency Control
 * Teaches: Version-based validation instead of locking
 */
export const optimisticConcurrencyProblemDefinition: ProblemDefinition = {
  id: 'ddia-optimistic-concurrency',
  title: 'Optimistic Concurrency Control',
  description: `Implement Optimistic Concurrency Control (OCC) where transactions execute without locks, and conflicts are detected at commit time using version numbers. Abort transaction if any read data was modified.

Learning objectives:
- Understand optimistic vs pessimistic concurrency
- Implement version-based validation
- Handle conflicts at commit time

Key requirements:
- Execute transaction without locks (read phase)
- Track read and write sets
- At commit, validate that read data hasn't changed
- Abort if validation fails`,

  userFacingFRs: [
    'Read phase: Execute without locks, track all reads',
    'Write phase: Buffer all writes locally',
    'Validation phase: Check if any read data was modified by other transactions',
    'If validation succeeds, commit writes; otherwise abort',
  ],
  userFacingNFRs: [
    'Read latency: <10ms (no lock waiting)',
    'Commit latency: <30ms (validation + write)',
    'Abort rate: 5-20% under high contention',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with versioning',
      },
      {
        type: 'compute',
        reason: 'OCC validation logic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Validate and commit',
      },
    ],
  },

  scenarios: generateScenarios('ddia-optimistic-concurrency', problemConfigs['ddia-optimistic-concurrency'] || {
    baseRps: 2000,
    readRatio: 0.7,
    maxLatency: 40,
    availability: 0.99,
  }, [
    'Read phase: Execute without locks',
    'Write phase: Buffer writes locally',
    'Validation phase: Check if read data changed',
    'If validation succeeds, commit; otherwise abort',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

/**
 * Problem 89: Deadlock Detection
 * Teaches: Detect and resolve circular wait deadlocks
 */
export const deadlockDetectionProblemDefinition: ProblemDefinition = {
  id: 'ddia-deadlock-detection',
  title: 'Deadlock Detection and Resolution',
  description: `Implement deadlock detection by building a wait-for graph and detecting cycles. When a deadlock is detected, choose a victim transaction to abort and break the cycle.

Learning objectives:
- Understand deadlocks (circular wait)
- Build wait-for graph
- Detect cycles and choose victim

Example: Transaction A holds lock X, waits for Y. Transaction B holds lock Y, waits for X. Deadlock!

Key requirements:
- Build wait-for graph (who is waiting for whom)
- Detect cycles in the graph
- Abort one transaction to break cycle`,

  userFacingFRs: [
    'Track lock holders and waiters (wait-for graph)',
    'Periodically check for cycles in wait-for graph',
    'When cycle detected, choose victim (youngest, least work done, etc.)',
    'Abort victim transaction and release its locks',
  ],
  userFacingNFRs: [
    'Detection latency: <2 seconds after deadlock forms',
    'Victim selection: Minimize wasted work',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'storage',
        reason: 'Database with locking',
      },
      {
        type: 'compute',
        reason: 'Deadlock detector',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Clients send transactions',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Detect deadlocks and abort victim',
      },
    ],
  },

  scenarios: generateScenarios('ddia-deadlock-detection', problemConfigs['ddia-deadlock-detection'] || {
    baseRps: 1000,
    readRatio: 0.4,
    maxLatency: 200,
    availability: 0.99,
  }, [
    'Track lock holders and waiters',
    'Periodically check for cycles in wait-for graph',
    'When cycle detected, choose victim',
    'Abort victim transaction',
  ]),

  validators: [
    { name: 'Basic Functionality', validate: basicFunctionalValidator },
    { name: 'Valid Connection Flow', validate: validConnectionFlowValidator },
  ],
};

// Export all transaction problems
export const ddiaTransactionProblems = [
  atomicityProblemDefinition,
  consistencyProblemDefinition,
  isolationProblemDefinition,
  durabilityProblemDefinition,
  readCommittedProblemDefinition,
  snapshotIsolationProblemDefinition,
  serializableProblemDefinition,
  repeatableReadProblemDefinition,
  dirtyReadsProblemDefinition,
  dirtyWritesProblemDefinition,
  readSkewProblemDefinition,
  writeSkewProblemDefinition,
  phantomReadsProblemDefinition,
  twoPhaseLockingProblemDefinition,
  optimisticConcurrencyProblemDefinition,
  deadlockDetectionProblemDefinition,
];

// Auto-generate code challenges from functional requirements
(atomicityProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(atomicityProblemDefinition);
