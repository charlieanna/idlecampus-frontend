import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * NewSQL/Spanner-style CAP Theorem Breaker Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches how Google Spanner and other NewSQL
 * databases achieve the "impossible" - strong consistency AND high availability
 * in a globally distributed system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic globally distributed database (FR satisfaction)
 * Steps 4-8: Scale with TrueTime, distributed transactions, linearizability
 *
 * Key Concepts:
 * - TrueTime API and atomic clocks
 * - Paxos for consensus
 * - Externally consistent transactions
 * - Multi-version concurrency control (MVCC)
 * - Two-phase commit across datacenters
 * - Spanner's architecture (zones, regions, universe)
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const capTheoremBreakerRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a globally distributed database like Google Spanner that provides strong consistency AND high availability",

  interviewer: {
    name: 'Dr. Eric Brewer',
    role: 'VP of Infrastructure, former Google Fellow',
    avatar: '👨‍🔬',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-transactions',
      category: 'functional',
      question: "What kind of transactions does this database need to support?",
      answer: "The database must support **globally distributed ACID transactions**:\n\n1. **Read-write transactions** - Modify data across multiple rows, even across different datacenters\n2. **Read-only transactions** - Consistent snapshot reads without locks\n3. **Strong consistency** - Linearizability for all operations\n4. **Multi-version concurrency control (MVCC)** - Readers never block writers\n\nThis is what makes NewSQL databases special - they provide traditional SQL guarantees at global scale.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "NewSQL = SQL semantics + NoSQL scalability",
    },
    {
      id: 'external-consistency',
      category: 'functional',
      question: "What does 'external consistency' mean and why is it important?",
      answer: "**External consistency** (linearizability) means:\n\nIf transaction T1 commits before T2 starts, then T1's timestamp < T2's timestamp.\n\nExample: You transfer $100 from Account A to Account B. Your friend immediately queries both accounts. They MUST see the updated balances - not the old values.\n\nThis is stronger than eventual consistency and critical for:\n- Financial transactions\n- Inventory management\n- Distributed locking\n- Any system where causality matters",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "External consistency = wall-clock time ordering of transactions",
    },
    {
      id: 'schema-support',
      category: 'functional',
      question: "What kind of data model and schema does this support?",
      answer: "We need a **strongly-typed relational schema** with:\n- Tables with primary keys\n- Secondary indexes (global and local)\n- Foreign key constraints\n- Schema migrations that don't block queries\n\nUnlike NoSQL, we provide full SQL semantics. Unlike traditional databases, we scale globally.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Schema flexibility with SQL semantics",
    },
    {
      id: 'truetime-necessity',
      category: 'clarification',
      question: "Why can't we just use NTP for clock synchronization?",
      answer: "NTP (Network Time Protocol) has **millisecond-level uncertainty**, which is too high for distributed transactions.\n\nGoogle Spanner uses **TrueTime** - a time API backed by:\n- GPS receivers (accurate to microseconds)\n- Atomic clocks (drift: ~200 microseconds/day)\n\nTrueTime provides an **interval** [earliest, latest] with guaranteed bounds on clock uncertainty (typically 1-7ms).\n\nThis bounded uncertainty enables external consistency without sacrificing availability!",
      importance: 'critical',
      insight: "TrueTime's bounded uncertainty is the key innovation that 'breaks' the CAP theorem",
    },
    {
      id: 'global-distribution',
      category: 'clarification',
      question: "How geographically distributed should this database be?",
      answer: "We need **multi-continental distribution**:\n- Replicas across 3+ geographic regions (e.g., US East, US West, Europe)\n- Read-write capability from any region\n- Survive entire datacenter failures\n- Low-latency reads from nearby replicas\n\nEach region has multiple zones for high availability within the region.",
      importance: 'critical',
      insight: "Global distribution for both performance and disaster recovery",
    },

    // SCALE & NFRs
    {
      id: 'throughput-transactions',
      category: 'throughput',
      question: "How many transactions per second should we handle globally?",
      answer: "100,000 transactions/second globally at steady state, with potential spikes to 500,000 TPS during peak hours across all continents",
      importance: 'critical',
      calculation: {
        formula: "100K TPS distributed across 3+ regions",
        result: "~33K TPS per region average, ~166K peak",
      },
      learningPoint: "Global scale requires distributing load across regions",
    },
    {
      id: 'read-write-ratio',
      category: 'throughput',
      question: "What's the ratio of read operations to write operations?",
      answer: "Typical workload is **read-heavy: 70% reads, 30% writes**. This is important because:\n- Read-only transactions can use snapshot reads (no locks)\n- Writes require consensus across replicas (slower)\n- We can optimize for read latency with witness replicas",
      importance: 'critical',
      calculation: {
        formula: "70K reads/sec + 30K writes/sec globally",
        result: "Read-heavy workload allows snapshot optimization",
      },
      learningPoint: "Read-write patterns influence replication strategy",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "What are the latency requirements for reads and writes?",
      answer: "**Reads:** p99 < 10ms (served from nearest replica)\n**Writes:** p99 < 50ms (requires consensus across regions)\n\nReads are fast because they hit local replicas. Writes are slower because they need agreement across geographic regions.",
      importance: 'critical',
      learningPoint: "Geographic distribution creates inherent write latency (speed of light)",
    },
    {
      id: 'consistency-guarantee',
      category: 'consistency',
      question: "Can we relax to eventual consistency for better performance?",
      answer: "**NO!** That's the whole point of NewSQL. We provide:\n- **Linearizability** (external consistency)\n- **Serializable isolation** for all transactions\n- **Strict 2PL** for read-write transactions\n\nThis is what distinguishes us from NoSQL systems like Cassandra or DynamoDB (which offer eventual consistency).",
      importance: 'critical',
      learningPoint: "NewSQL refuses to compromise on consistency",
    },
    {
      id: 'availability-zones',
      category: 'availability',
      question: "How do we ensure availability if a datacenter fails?",
      answer: "We use **Paxos-based replication** with:\n- 5 replicas per data shard (quorum = 3)\n- Replicas spread across 3+ geographic regions\n- Automatic failover via Paxos leader election\n\nKey insight: With 5 replicas, we can tolerate 2 failures and still maintain consensus (3/5 quorum).",
      importance: 'critical',
      learningPoint: "Paxos provides both consistency and availability",
    },
    {
      id: 'partition-tolerance',
      category: 'consistency',
      question: "What happens during a network partition between regions?",
      answer: "With **TrueTime + Paxos**, we handle partitions gracefully:\n- Majority side (3+ replicas) continues serving reads and writes\n- Minority side (2 replicas) can serve stale reads only\n- When partition heals, Paxos automatically reconciles\n\nThis is how we 'break' CAP: TrueTime's bounded uncertainty lets us achieve consensus without sacrificing availability in the majority partition.",
      importance: 'critical',
      insight: "CAP theorem assumes unbounded clock skew - TrueTime bounds it!",
    },
    {
      id: 'failure-scenarios',
      category: 'reliability',
      question: "What failure scenarios must we handle?",
      answer: "We must survive:\n1. **Single server failure** - Paxos continues with 4/5 replicas\n2. **Entire datacenter failure** - Replicas in other regions take over\n3. **Network partition** - Majority side stays available\n4. **Clock skew** - TrueTime API provides bounds, system waits for uncertainty\n5. **Slow replica** - Paxos doesn't wait for stragglers",
      importance: 'critical',
      learningPoint: "Design for failure at every level",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-transactions', 'external-consistency', 'truetime-necessity'],
  criticalFRQuestionIds: ['core-transactions', 'external-consistency', 'schema-support'],
  criticalScaleQuestionIds: ['throughput-transactions', 'consistency-guarantee', 'partition-tolerance'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: ACID transactions across datacenters',
      description: 'Support distributed read-write transactions with full ACID guarantees',
      emoji: '⚛️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Snapshot reads without locks',
      description: 'Read-only transactions using MVCC - readers never block writers',
      emoji: '📸',
    },
    {
      id: 'fr-3',
      text: 'FR-3: External consistency (linearizability)',
      description: 'Globally consistent ordering based on real-time causality',
      emoji: '⏱️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: SQL schema with indexes',
      description: 'Relational schema with primary keys, secondary indexes, foreign keys',
      emoji: '🗂️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: High availability across regions',
      description: 'Survive datacenter failures with automatic failover',
      emoji: '🌍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000 applications',
    writesPerDay: '2.6 billion transactions',
    readsPerDay: '6 billion transactions',
    peakMultiplier: 5,
    readWriteRatio: '70:30 (read-heavy)',
    calculatedWriteRPS: { average: 30000, peak: 150000 },
    calculatedReadRPS: { average: 70000, peak: 350000 },
    maxPayloadSize: '~10MB per transaction',
    storagePerRecord: '~1KB average',
    storageGrowthPerYear: '~1PB',
    redirectLatencySLA: 'p99 < 10ms (reads)',
    createLatencySLA: 'p99 < 50ms (writes)',
  },

  architecturalImplications: [
    '✅ Global distribution → Multi-region deployment with 5+ replicas per shard',
    '✅ External consistency → TrueTime API with atomic clocks and GPS',
    '✅ High availability → Paxos consensus for automatic failover',
    '✅ ACID transactions → Two-phase commit + strict 2PL',
    '✅ Read optimization → Snapshot reads from nearest replica',
    '✅ Write coordination → Commit wait for TrueTime uncertainty',
  ],

  outOfScope: [
    'Multi-master writes (single Paxos leader per shard)',
    'Eventually consistent reads (all reads are strongly consistent)',
    'Schema-less NoSQL (we enforce SQL schemas)',
    'Sub-millisecond write latency (physics limits apply)',
  ],

  keyInsight: "The 'secret' to breaking CAP: TrueTime provides bounded clock uncertainty, enabling global consensus without sacrificing availability. First, we'll build the basic distributed database. Then we'll add TrueTime and see the magic happen!",
};

// =============================================================================
// STEP 1: Connect Client to Distributed Database
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌍',
  scenario: "Welcome to Google! You're building Spanner - the globally distributed database that will power Google Ads, Gmail, and Cloud services.",
  hook: "Applications need to run transactions across multiple continents with strong consistency.",
  challenge: "Set up the basic architecture: clients connecting to a distributed database cluster.",
  illustration: 'global-network',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your distributed database is online!',
  achievement: 'Applications can now connect and issue queries globally',
  metrics: [
    { label: 'Global reach', after: 'Multi-region' },
    { label: 'Status', after: 'Online' },
  ],
  nextTeaser: "But how do we handle transactions across datacenters?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Globally Distributed Architecture',
  conceptExplanation: `A globally distributed database like Spanner has a **hierarchical architecture**:

**Universe** (entire deployment)
├── **Region** (e.g., us-east, europe-west, asia-southeast)
│   ├── **Zone** (datacenter within region)
│   │   ├── **Spanserver** (serves data shards)
│   │   │   └── **Tablet** (sorted key-value map, replicated via Paxos)

When an application issues a query:
1. Client connects to **nearest zone**
2. Query is routed to appropriate **Spanservers**
3. Data is served from **local tablets** (for reads) or coordinated globally (for writes)

This hierarchy enables both **low-latency local reads** and **globally consistent writes**.`,

  whyItMatters: `Global distribution provides:
- **Low latency**: Users read from nearby datacenters
- **High availability**: Survive datacenter failures
- **Disaster recovery**: Data replicated across continents
- **Regulatory compliance**: Keep data in specific regions`,

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Running Google Ads, Google Play, and Gmail',
    howTheyDoIt: 'Deploys across 30+ regions worldwide with 5 replicas per data shard, serving millions of TPS with 99.999% availability',
  },

  keyPoints: [
    'Client connects to nearest zone for low-latency access',
    'Database is sharded across many servers (spanservers)',
    'Each shard is replicated across 5+ zones in different regions',
    'Paxos ensures consistency across replicas',
  ],

  diagram: `
    [Client US] ──→ [Zone US-East] ──→ [Spanserver] ──→ [Tablet]
    [Client EU] ──→ [Zone EU-West] ──→ [Spanserver] ──→ [Tablet]
                          │                                │
                          └────── Paxos Replication ───────┘
  `,

  interviewTip: 'Always start by explaining the geographic distribution - it sets the stage for all the hard problems (consensus, latency, failure handling).',
};

const step1: GuidedStep = {
  id: 'cap-breaker-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and a globally distributed Database, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Applications issuing queries', displayName: 'Client App' },
      { type: 'database', reason: 'Distributed NewSQL database cluster', displayName: 'Spanner DB' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'Database component added to canvas',
      'Client connected to Database',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'database'],
    requiredConnections: [{ fromType: 'client', toType: 'database' }],
  },

  hints: {
    level1: 'Drag a Client and a Database from the component palette onto the canvas',
    level2: 'Click the Client, then click the Database to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'database' }],
  },
};

// =============================================================================
// STEP 2: Implement Basic Transaction Handlers
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your database is connected, but it doesn't know how to execute transactions yet!",
  hook: "A client tried to run a distributed transaction but got an error.",
  challenge: "Write Python code to handle read-write and read-only transactions.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Transaction processing works!',
  achievement: 'You implemented the core transaction handlers',
  metrics: [
    { label: 'Read-write transactions', after: 'Implemented' },
    { label: 'Read-only transactions', after: 'Implemented' },
    { label: 'MVCC snapshots', after: '✓' },
  ],
  nextTeaser: "But transactions are slow... and how do we guarantee consistency?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Transaction Processing: Read-Write vs Read-Only',
  conceptExplanation: `Spanner supports two types of transactions:

**1. Read-Write Transactions**
- Use strict two-phase locking (2PL)
- Acquire locks on all modified rows
- Commit via two-phase commit (2PC) across Paxos groups
- Slower but provides full ACID guarantees

\`\`\`python
def read_write_transaction(operations):
    # Phase 1: Acquire locks
    locks = acquire_locks(operations)

    # Phase 2: Execute operations
    results = execute_operations(operations)

    # Phase 3: Two-phase commit
    commit_timestamp = commit_with_2pc(results)

    # Phase 4: Release locks
    release_locks(locks)

    return commit_timestamp
\`\`\`

**2. Read-Only Transactions**
- No locks required (MVCC snapshots)
- Choose a snapshot timestamp (past commit time)
- Read from any up-to-date replica
- Fast because they don't block writers

\`\`\`python
def read_only_transaction(query, timestamp=None):
    # Use provided timestamp or pick current time
    snapshot_time = timestamp or now()

    # Read from nearest replica with data >= snapshot_time
    return read_snapshot(query, snapshot_time)
\`\`\``,

  whyItMatters: 'MVCC (Multi-Version Concurrency Control) is the key to high throughput: readers never block writers, and writers never block readers.',

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Running Google AdWords transactions',
    howTheyDoIt: 'Uses Paxos-based 2PC for writes and snapshot reads from local replicas, achieving millions of TPS',
  },

  keyPoints: [
    'Read-write transactions use 2PL + 2PC for ACID guarantees',
    'Read-only transactions use MVCC snapshots (no locks)',
    'Each transaction gets a globally unique timestamp',
    'MVCC allows high concurrency: readers never block writers',
  ],

  famousIncident: {
    title: 'Gmail Outage from Transaction Lock Contention',
    company: 'Google',
    year: '2014',
    whatHappened: 'A bug in transaction lock management caused cascading lock contention in Spanner, bringing down Gmail for 50 minutes. Millions of users couldn\'t access email.',
    lessonLearned: 'Transaction lock management must be bulletproof. Always use deadlock detection and timeouts.',
    icon: '📧',
  },

  quickCheck: {
    question: 'Why can read-only transactions avoid acquiring locks?',
    options: [
      'They run faster on SSDs',
      'They use MVCC snapshots of past committed data',
      'They only read one row at a time',
      'They skip validation',
    ],
    correctIndex: 1,
    explanation: 'MVCC maintains multiple versions of data. Read-only transactions read from a consistent snapshot, so they don\'t interfere with ongoing writes.',
  },
};

const step2: GuidedStep = {
  id: 'cap-breaker-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: ACID transactions, FR-2: Snapshot reads',
    taskDescription: 'Implement transaction handlers in Python',
    successCriteria: [
      'Click on Database to open inspector',
      'Open the Python tab',
      'Implement read_write_transaction() and read_only_transaction()',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'database'],
    requiredConnections: [{ fromType: 'client', toType: 'database' }],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the Database component, then go to the Python tab',
    level2: 'Implement both transaction handlers: read_write_transaction uses 2PL+2PC, read_only_transaction uses MVCC snapshots',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Multi-Region Replication (Paxos Groups)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your datacenter just went offline for 2 hours.",
  hook: "All data was lost. Applications crashed. Customers are furious. The CEO is demanding answers!",
  challenge: "Add Paxos-based replication across multiple geographic regions to survive failures.",
  illustration: 'datacenter-failure',
};

const step3Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Your database survives datacenter failures!',
  achievement: 'Paxos replication provides high availability across regions',
  metrics: [
    { label: 'Replicas per shard', after: '5' },
    { label: 'Geographic regions', after: '3+' },
    { label: 'Availability', after: '99.999%' },
    { label: 'Failure tolerance', after: '2 replicas can fail' },
  ],
  nextTeaser: "But writes are slow... we need better clock synchronization!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Paxos Replication: Consensus for High Availability',
  conceptExplanation: `**Paxos** is a consensus algorithm that ensures replicas agree on transaction order even during failures.

**How Paxos Works:**
1. **Propose phase**: Leader proposes a value (transaction commit)
2. **Promise phase**: Replicas promise to accept if no higher proposal seen
3. **Accept phase**: Leader asks replicas to accept the value
4. **Commit phase**: Once majority (quorum) accepts, value is committed

**Spanner's Paxos Setup:**
- Each data shard has a **Paxos group** of 5 replicas
- Replicas spread across 3+ geographic regions
- One replica is elected **Paxos leader** (handles writes)
- Quorum = 3 (majority of 5 replicas must agree)
- Can tolerate 2 replica failures and still function

**Why 5 replicas?**
- 3 replicas: Tolerates 1 failure (quorum = 2/3)
- 5 replicas: Tolerates 2 failures (quorum = 3/5) ← Spanner's choice
- 7 replicas: Tolerates 3 failures but higher write latency`,

  whyItMatters: `Paxos provides:
- **Consistency**: All replicas see same transaction order
- **Availability**: System functions even if minority fails
- **Partition tolerance**: Majority partition stays available

This is how Spanner "breaks" CAP - Paxos + TrueTime achieve CP while maintaining high availability!`,

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Surviving datacenter failures',
    howTheyDoIt: '5 replicas per Paxos group across 3+ continents. Automatic leader re-election in <10 seconds on failure.',
  },

  famousIncident: {
    title: 'AWS DynamoDB Multi-Region Outage',
    company: 'AWS',
    year: '2015',
    whatHappened: 'DynamoDB\'s cross-region replication failed during a network partition. Write capacity dropped to zero for 7 hours in some regions because they didn\'t use Paxos-style consensus.',
    lessonLearned: 'Consensus algorithms like Paxos are essential for true multi-region availability.',
    icon: '☁️',
  },

  diagram: `
    Paxos Group (5 replicas across 3 regions):

    US-East (Leader)  ──┐
    US-West           ──┤  Quorum (3/5 must agree)
    Europe            ──┤  ↓
    Asia              ──┤  Commit!
    US-Central        ──┘

    If 2 replicas fail → Remaining 3 still form quorum
  `,

  keyPoints: [
    '5 replicas per Paxos group across multiple regions',
    'Quorum of 3 required for commits (majority)',
    'Tolerate up to 2 simultaneous replica failures',
    'Automatic leader election via Paxos',
    'Writes go through leader, reads can use any replica',
  ],

  quickCheck: {
    question: 'With 5 replicas, how many can fail while maintaining availability?',
    options: [
      '1 replica',
      '2 replicas',
      '3 replicas',
      '4 replicas',
    ],
    correctIndex: 1,
    explanation: 'With 5 replicas, quorum is 3 (majority). You can lose 2 replicas and still have 3 for quorum.',
  },

  keyConcepts: [
    { title: 'Paxos', explanation: 'Consensus algorithm for distributed agreement', icon: '🤝' },
    { title: 'Quorum', explanation: 'Majority of replicas must agree (3 out of 5)', icon: '✋' },
    { title: 'Leader Election', explanation: 'Automatic selection of leader replica', icon: '👑' },
  ],
};

const step3: GuidedStep = {
  id: 'cap-breaker-step-3',
  stepNumber: 3,
  frIndex: 4,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-5: High availability across regions',
    taskDescription: 'Enable Paxos-based replication with 5 replicas',
    componentsNeeded: [],
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 5',
      'Set replication mode to synchronous (Paxos)',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'database'],
    requiredConnections: [{ fromType: 'client', toType: 'database' }],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings',
    level2: 'Enable replication, set replicas to 5, and choose synchronous mode for Paxos consensus',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 5, mode: 'synchronous' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Implement TrueTime API
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⏰',
  scenario: "Your distributed transactions are working, but they're SLOW. Each write takes 200ms!",
  hook: "The problem: clock skew between datacenters. You're using NTP but clocks can be off by 100ms+. This forces conservative waiting.",
  challenge: "Implement TrueTime - a time API with bounded uncertainty using atomic clocks and GPS.",
  illustration: 'atomic-clock',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'TrueTime is online!',
  achievement: 'Clock uncertainty reduced from 100ms to 7ms',
  metrics: [
    { label: 'Clock uncertainty', before: '100ms (NTP)', after: '7ms (TrueTime)' },
    { label: 'Commit wait time', before: '200ms', after: '14ms' },
    { label: 'Write throughput', before: '5K TPS', after: '30K TPS' },
  ],
  nextTeaser: "Now we can implement externally consistent transactions!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'TrueTime: The Secret Weapon',
  conceptExplanation: `**TrueTime** is Google's innovation that makes Spanner possible.

**The Problem with NTP:**
- NTP synchronizes clocks to within milliseconds
- But uncertainty is unbounded and unknown
- You don't know if your clock is 1ms or 100ms off!

**TrueTime Solution:**
Instead of a single timestamp, TrueTime returns an **interval**:

\`\`\`
TT.now() → [earliest, latest]
\`\`\`

Guarantees:
- The true time is GUARANTEED to be within this interval
- Typical uncertainty: 1-7 milliseconds
- Worst case: 7ms (if GPS/atomic clocks fail)

**Implementation:**
- Each datacenter has:
  - **GPS receivers** (multiple for redundancy)
  - **Atomic clocks** (drift ~200µs/day)
- Time Masters sync clocks every 30 seconds
- Uncertainty is computed from last sync + clock drift

**Why This Matters:**
With bounded uncertainty, we can:
1. **Wait out the uncertainty** (commit wait)
2. **Guarantee external consistency** (linearizability)
3. **Avoid distributed coordination** for most reads

Example:
\`\`\`
Transaction T1 commits at TT.now().latest = 100.007s
Transaction T2 starts at TT.now().earliest = 100.010s

Because T2.earliest > T1.latest, we KNOW T2 came after T1!
\`\`\``,

  whyItMatters: `TrueTime enables:
- External consistency without expensive coordination
- Fast snapshot reads (no locks)
- Global ordering of transactions
- The "CAP theorem breakthrough"`,

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Achieving linearizability at global scale',
    howTheyDoIt: 'Installed atomic clocks and GPS antennas in every datacenter. The hardware cost is tiny compared to the performance gain.',
  },

  famousIncident: {
    title: 'Spanner TrueTime Uncertainty Spike',
    company: 'Google',
    year: '2012',
    whatHappened: 'A bug caused GPS to fail in one datacenter, causing TrueTime uncertainty to spike from 7ms to 50ms. Commit latency increased 7x. But the system stayed correct - just slower!',
    lessonLearned: 'TrueTime\'s bounded uncertainty guarantees correctness even when uncertainty increases. The system trades performance for correctness.',
    icon: '🛰️',
  },

  diagram: `
TrueTime Architecture:

┌─────────────────────────────────────┐
│         Datacenter                  │
│                                     │
│  ┌───────┐  ┌───────┐  ┌───────┐  │
│  │  GPS  │  │  GPS  │  │ Atomic│  │
│  │   1   │  │   2   │  │ Clock │  │
│  └───┬───┘  └───┬───┘  └───┬───┘  │
│      │          │          │      │
│      └──────────┴──────────┘      │
│               │                   │
│         ┌─────▼─────┐            │
│         │Time Master│            │
│         └─────┬─────┘            │
│               │                   │
│    ┌──────────┴──────────┐       │
│    ▼                      ▼       │
│ [Server]  ...  [Server_n]         │
│                                   │
│ TT.now() = [100.000, 100.007]     │
│ Uncertainty = 7ms                 │
└─────────────────────────────────────┘
  `,

  keyPoints: [
    'TrueTime returns an interval [earliest, latest], not a single time',
    'Backed by GPS receivers and atomic clocks in each datacenter',
    'Typical uncertainty: 1-7ms (much better than NTP\'s 100ms+)',
    'Commit wait: transactions wait for TT.now().latest to pass',
    'Enables external consistency without expensive coordination',
  ],

  quickCheck: {
    question: 'Why does Spanner need to "commit wait" for TT.now().latest?',
    options: [
      'To make commits slower on purpose',
      'To ensure the commit timestamp is definitely in the past for all observers',
      'To sync with GPS satellites',
      'To wait for Paxos consensus',
    ],
    correctIndex: 1,
    explanation: 'By waiting until TT.now().latest, we ensure any future transaction will have a timestamp greater than our commit, guaranteeing external consistency.',
  },

  keyConcepts: [
    { title: 'TrueTime API', explanation: 'Returns time interval [earliest, latest]', icon: '⏱️' },
    { title: 'Bounded Uncertainty', explanation: 'Guaranteed max clock error (~7ms)', icon: '📏' },
    { title: 'Commit Wait', explanation: 'Wait for commit timestamp to be in the past', icon: '⏳' },
  ],
};

const step4: GuidedStep = {
  id: 'cap-breaker-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: External consistency requires TrueTime',
    taskDescription: 'Add a TrueTime component and implement the API',
    componentsNeeded: [
      { type: 'cache', reason: 'Represents TrueTime servers (GPS + atomic clocks)', displayName: 'TrueTime' },
    ],
    successCriteria: [
      'Add TrueTime component',
      'Connect Database to TrueTime',
      'Update transaction code to use TT.now() for timestamps',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'database' },
      { fromType: 'database', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Use a Cache component to represent TrueTime infrastructure',
    level2: 'Connect Database to TrueTime (Cache). Update your transaction code to call TT.now() for timestamps.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'database', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Implement Two-Phase Commit for Distributed Transactions
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "Your transactions span multiple Paxos groups (shards) across datacenters.",
  hook: "You're transferring $1000 from an account in US-East to an account in Europe. This requires updating 2 shards atomically!",
  challenge: "Implement two-phase commit (2PC) to coordinate transactions across multiple Paxos groups.",
  illustration: 'distributed-transaction',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Distributed transactions are atomic!',
  achievement: 'Two-phase commit ensures all-or-nothing across shards',
  metrics: [
    { label: 'Cross-shard transactions', after: 'Supported' },
    { label: 'Atomicity', after: '100%' },
    { label: 'Coordinator failures handled', after: '✓' },
  ],
  nextTeaser: "But how do we avoid blocking during 2PC?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Two-Phase Commit: Atomic Distributed Transactions',
  conceptExplanation: `**Two-Phase Commit (2PC)** ensures atomicity across multiple Paxos groups.

**Phase 1: Prepare**
1. **Coordinator** (transaction manager) sends PREPARE to all **participants** (Paxos leaders)
2. Each participant:
   - Acquires locks on modified data
   - Writes to local Paxos group (durably)
   - Votes YES or NO
3. Coordinator collects votes

**Phase 2: Commit**
- If ALL vote YES:
  - Coordinator assigns **commit timestamp** using TrueTime
  - Sends COMMIT to all participants
  - Participants apply changes and release locks
- If ANY vote NO:
  - Coordinator sends ABORT
  - Participants release locks

**Spanner's Optimizations:**
1. **Paxos for durability**: Each participant's vote is replicated via Paxos
2. **TrueTime for ordering**: Commit timestamp from TT.now()
3. **Commit wait**: Wait for TT.now().latest to ensure external consistency
4. **Non-blocking reads**: Use MVCC snapshots to read while 2PC is ongoing

**Example:**
\`\`\`
Transaction: Transfer $1000 from Account A to Account B
- Account A in Shard 1 (US-East Paxos group)
- Account B in Shard 2 (Europe Paxos group)

Coordinator: Transaction Manager
Participants: Leader of Shard 1, Leader of Shard 2

Phase 1:
  Coordinator → Shard 1 Leader: PREPARE (debit $1000)
  Coordinator → Shard 2 Leader: PREPARE (credit $1000)
  Both vote YES

Phase 2:
  Coordinator assigns timestamp from TrueTime: 100.007s
  Coordinator waits until TT.now().earliest > 100.007s  (commit wait!)
  Coordinator → Shard 1 Leader: COMMIT at 100.007s
  Coordinator → Shard 2 Leader: COMMIT at 100.007s
  Both apply and release locks
\`\`\``,

  whyItMatters: `2PC enables:
- **Atomicity** across distributed data
- **Consistency** with global transaction ordering
- **Distributed locking** with Paxos durability`,

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Multi-shard transactions in Google Ads',
    howTheyDoIt: 'Uses Paxos-replicated 2PC with TrueTime commit wait. Can commit 30,000 distributed TPS globally.',
  },

  famousIncident: {
    title: 'Yahoo Omid Transaction System Corruption',
    company: 'Yahoo',
    year: '2016',
    whatHappened: 'Their custom 2PC implementation had a bug where coordinator failure could leave participants in prepared state forever, causing deadlocks. Entire system locked up.',
    lessonLearned: '2PC coordinator must be highly available and participants need timeouts to handle coordinator failures.',
    icon: '🔒',
  },

  diagram: `
Two-Phase Commit Flow:

  Coordinator
      │
      ├──── PREPARE ────┐
      │                 ▼
      │           Participant 1
      │           (Shard 1 / US)
      │                 │
      │                 └── YES
      │
      ├──── PREPARE ────┐
      │                 ▼
      │           Participant 2
      │           (Shard 2 / EU)
      │                 │
      │                 └── YES
      │
      ├── Assign timestamp from TrueTime: T
      │── Commit wait (wait for TT.now().earliest > T)
      │
      ├──── COMMIT ─────▶ Participant 1 (apply + unlock)
      │
      └──── COMMIT ─────▶ Participant 2 (apply + unlock)
  `,

  keyPoints: [
    'Phase 1: All participants prepare and vote (YES/NO)',
    'Phase 2: Coordinator commits if all YES, aborts otherwise',
    'Each participant uses Paxos to durably record its vote',
    'Commit timestamp from TrueTime + commit wait ensures ordering',
    'MVCC allows reads during 2PC (non-blocking)',
  ],

  quickCheck: {
    question: 'What happens if one participant votes NO during 2PC prepare phase?',
    options: [
      'Coordinator waits for it to change its vote',
      'Transaction commits anyway with partial data',
      'Coordinator aborts the entire transaction',
      'Other participants keep their locks',
    ],
    correctIndex: 2,
    explanation: '2PC guarantees atomicity: if any participant votes NO, the entire transaction is aborted across all participants.',
  },

  keyConcepts: [
    { title: '2PC Coordinator', explanation: 'Orchestrates distributed commit', icon: '🎯' },
    { title: '2PC Participant', explanation: 'Paxos leader holding locks', icon: '🔐' },
    { title: 'Commit Wait', explanation: 'Wait for TrueTime uncertainty', icon: '⏳' },
  ],
};

const step5: GuidedStep = {
  id: 'cap-breaker-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Distributed ACID transactions require 2PC',
    taskDescription: 'Add coordinator service and implement two-phase commit',
    componentsNeeded: [
      { type: 'app_server', reason: 'Transaction coordinator for 2PC', displayName: 'Coordinator' },
    ],
    successCriteria: [
      'Add App Server component (Transaction Coordinator)',
      'Connect Client to Coordinator',
      'Connect Coordinator to Database',
      'Implement 2PC logic in coordinator',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add an App Server to act as the 2PC coordinator',
    level2: 'Connect Client → Coordinator → Database. Implement 2PC phases: prepare, vote, commit/abort with TrueTime timestamps.',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Optimize Read Performance with Witness Replicas
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your system is globally consistent, but reads from distant regions are SLOW!",
  hook: "A user in Asia is reading data. The nearest full replica is in Europe (200ms away). They're experiencing terrible latency.",
  challenge: "Add witness replicas for Paxos quorum without storing full data, enabling fast local reads.",
  illustration: 'slow-network',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Read latency slashed!',
  achievement: 'Witness replicas enable fast local reads globally',
  metrics: [
    { label: 'Read latency (Asia)', before: '200ms', after: '10ms' },
    { label: 'Replicas per shard', after: '3 full + 2 witness' },
    { label: 'Storage cost', before: '5x', after: '3.5x' },
  ],
  nextTeaser: "Can we handle even higher write throughput?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Witness Replicas: Cheap Quorum, Fast Reads',
  conceptExplanation: `**The Problem:**
With 5 full replicas globally:
- High storage costs (5x data replication)
- Slow reads from regions without local replicas

**The Solution: Witness Replicas**
A **witness replica**:
- Participates in Paxos voting (for quorum)
- Stores minimal data (just Paxos log, no user data)
- Can serve as "timestamp authority" for reads

**Example Configuration:**
- **3 full replicas**: US-East, US-West, Europe (store all data)
- **2 witness replicas**: Asia, South America (Paxos voting only)

**Benefits:**
1. **Quorum**: Still have 5 replicas for voting (quorum = 3)
2. **Storage**: Only 3x data replication (vs 5x)
3. **Read optimization**: Asia witness can timestamp reads locally

**How Reads Work with Witnesses:**
\`\`\`
Client in Asia wants to read at timestamp T:

1. Contact local witness (Asia)
2. Witness checks: "Is T safe to read?"
   - Safe if: T < Last Paxos commit timestamp
3. If safe, witness returns: "Go ahead, read from nearest full replica"
4. Client reads from nearest full replica (Europe, 100ms away)
   - But no Paxos coordination needed! (Fast)
\`\`\`

**Key Insight:**
Witnesses don't store data, but they know the latest committed timestamp. This is enough to guarantee consistency for reads!`,

  whyItMatters: `Witness replicas provide:
- **Cost savings**: 30% less storage vs full replication
- **Fast local reads**: Local timestamp authority
- **Same availability**: Still tolerate 2 failures`,

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Serving reads globally with minimal latency',
    howTheyDoIt: 'Uses witness replicas in regions with low write volume but high read demand',
  },

  diagram: `
Paxos Group with Witnesses:

Full Replicas (store all data):
  ┌───────────┐  ┌───────────┐  ┌───────────┐
  │  US-East  │  │  US-West  │  │  Europe   │
  │  (Leader) │  │           │  │           │
  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
        │              │              │
        └──────── Paxos Voting ───────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
  ┌─────▼─────┐               ┌───────▼───┐
  │   Asia    │               │ S.America │
  │ (Witness) │               │ (Witness) │
  └───────────┘               └───────────┘

  Quorum = 3 out of 5 replicas
  Storage = 3x (full) + 2x (logs only)
  `,

  keyPoints: [
    'Witness replicas vote in Paxos but don\'t store full data',
    'Typical config: 3 full replicas + 2 witnesses',
    'Witnesses provide local timestamp authority for reads',
    'Saves storage costs while maintaining availability',
    'Reads still go to full replicas, but no coordination needed',
  ],

  quickCheck: {
    question: 'What do witness replicas store?',
    options: [
      'Full user data like regular replicas',
      'Only Paxos log and commit timestamps',
      'Only read queries',
      'Nothing - they just vote',
    ],
    correctIndex: 1,
    explanation: 'Witnesses store Paxos logs (for voting) and commit timestamps (for read authorization) but not user data.',
  },

  keyConcepts: [
    { title: 'Witness Replica', explanation: 'Votes in Paxos without storing data', icon: '👁️' },
    { title: 'Timestamp Authority', explanation: 'Validates read timestamps locally', icon: '✓' },
    { title: 'Cost Optimization', explanation: 'Reduce storage while keeping quorum', icon: '💰' },
  ],
};

const step6: GuidedStep = {
  id: 'cap-breaker-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: Optimize snapshot reads with witnesses',
    taskDescription: 'Configure database with witness replicas',
    successCriteria: [
      'Update Database configuration',
      'Set 3 full replicas + 2 witness replicas',
      'Verify quorum still works (3/5)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click Database → Configuration. You need 5 replicas total, but configure some as witnesses.',
    level2: 'Set replication config to use 3 full replicas and 2 witness replicas. This maintains quorum while reducing storage.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer for Global Request Routing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌍',
  scenario: "You have replicas globally, but clients don't know which one to contact!",
  hook: "A client in Asia is connecting to a coordinator in the US. Every request has 200ms of network overhead.",
  challenge: "Add a global load balancer to route clients to their nearest zone.",
  illustration: 'global-routing',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Clients are routed optimally!',
  achievement: 'Geographic load balancing minimizes latency',
  metrics: [
    { label: 'Client routing', after: 'Nearest zone' },
    { label: 'Average latency', before: '150ms', after: '10ms' },
    { label: 'Cross-region traffic', before: '80%', after: '20%' },
  ],
  nextTeaser: "Final step: ensure we're under budget!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Global Load Balancing: Geographic Request Routing',
  conceptExplanation: `For globally distributed databases, **load balancing** serves two purposes:

**1. Geographic Routing**
- Route clients to nearest zone/region
- Minimize network latency (speed of light!)
- Use anycast DNS or GeoDNS

**2. Failover**
- If nearest zone is down, route to next nearest
- Health checks detect failures
- Automatic recovery

**Spanner's Architecture:**
\`\`\`
Client in Asia:
  ↓
GeoDNS → Asia Zone (nearest)
  ↓
Coordinator in Asia
  ↓
Local read: Asia witness authorizes → Read from nearest full replica
Local write: Forward to Paxos leader (cross-region if needed)
\`\`\`

**Read vs Write Routing:**
- **Reads**: Serve from nearest replica (10ms)
- **Writes**: Route to Paxos leader (may be cross-region, 50-100ms)

**Why Writes Are Slower:**
- Physics: Speed of light between continents
- Paxos: Need quorum from 3/5 replicas
- 2PC: Cross-shard coordination
- Commit wait: TrueTime uncertainty

But this is unavoidable - the CAP theorem still applies to latency!`,

  whyItMatters: `Global routing provides:
- **Low latency**: Users connect to nearby infrastructure
- **High availability**: Automatic failover to healthy zones
- **Scalability**: Distribute load across regions`,

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Serving queries from 30+ regions worldwide',
    howTheyDoIt: 'Uses Google\'s global anycast network and intelligent routing to send each request to the optimal zone',
  },

  diagram: `
Global Load Balancing:

Client (Asia) ──→ [GeoDNS/Anycast]
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Asia Zone      US Zone        EU Zone
   (nearest)      (backup)       (backup)
        │
        ▼
   Coordinator (Asia)
        │
        ├─→ Read-only: Local witness
        │
        └─→ Read-write: Forward to Paxos leader
  `,

  keyPoints: [
    'Load balancer routes clients to geographically nearest zone',
    'Uses GeoDNS or anycast for global routing',
    'Reads are fast (local), writes may be cross-region',
    'Automatic failover if nearest zone is unhealthy',
    'Speed of light is the ultimate limit on write latency',
  ],

  quickCheck: {
    question: 'Why are global writes slower than local reads in Spanner?',
    options: [
      'Writes use slower algorithms',
      'Writes require Paxos consensus across geographically distributed replicas',
      'Writes are not optimized',
      'Reads are cached',
    ],
    correctIndex: 1,
    explanation: 'Writes need Paxos consensus from 3+ replicas across regions. Speed of light + consensus = higher latency.',
  },

  keyConcepts: [
    { title: 'GeoDNS', explanation: 'DNS that returns nearest server IP', icon: '🌐' },
    { title: 'Anycast', explanation: 'Route to nearest instance using BGP', icon: '📡' },
    { title: 'Zone Affinity', explanation: 'Prefer local zone for requests', icon: '🎯' },
  ],
};

const step7: GuidedStep = {
  id: 'cap-breaker-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-5: Global availability requires smart routing',
    taskDescription: 'Add load balancer for geographic routing',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Route clients to nearest zone', displayName: 'Global LB' },
    ],
    successCriteria: [
      'Add Load Balancer component',
      'Connect Client to Load Balancer',
      'Connect Load Balancer to Coordinator',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer between Client and Coordinator',
    level2: 'Connect: Client → Load Balancer → Coordinator. The LB routes based on client geography.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Cost Optimization - Balance Consistency and Budget
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💰',
  scenario: "The CFO is reviewing infrastructure costs: $450K/month for a globally distributed database!",
  hook: "She says: 'We need strong consistency, but at what cost? Optimize to under $300K or we switch to Postgres sharding!'",
  challenge: "Optimize your architecture to reduce costs while maintaining linearizability.",
  illustration: 'budget-review',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a CAP theorem breaker!',
  achievement: 'A globally distributed, strongly consistent, highly available database',
  metrics: [
    { label: 'Monthly cost', before: '$450K', after: 'Under $300K' },
    { label: 'Consistency', after: 'Linearizable ✓' },
    { label: 'Availability', after: '99.999% ✓' },
    { label: 'Global distribution', after: '3+ regions ✓' },
    { label: 'Read latency', after: '<10ms ✓' },
    { label: 'Write latency', after: '<50ms ✓' },
  ],
  nextTeaser: "You've mastered NewSQL database design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: The Price of Global Consistency',
  conceptExplanation: `NewSQL databases are expensive, but you can optimize:

**Cost Drivers:**
1. **Replicas** - 5 replicas = 5x storage + compute
2. **TrueTime infrastructure** - GPS + atomic clocks per DC
3. **Cross-region bandwidth** - Paxos + 2PC traffic
4. **Coordinator resources** - Transaction coordination overhead

**Optimization Strategies:**
1. **Witness replicas** - Use 3 full + 2 witness (vs 5 full)
   - Saves: 40% storage cost
   - Maintains: Same availability and consistency

2. **Shard intelligently** - Co-locate related data
   - Reduces: Cross-shard transactions (expensive 2PC)
   - Example: User data + their orders in same shard

3. **Read-only transactions** - Use snapshot reads
   - No locks, no 2PC overhead
   - 10x cheaper than read-write transactions

4. **Region selection** - Deploy where you need it
   - Don't replicate to regions with no users
   - Example: US + Europe only (no Asia if no Asian users)

5. **Batch writes** - Amortize commit wait overhead
   - Single transaction: 14ms commit wait
   - Batched (100 writes): 14ms / 100 = 0.14ms per write

**For Our System:**
- Use 3 full + 2 witness replicas
- Shard by user_id (keeps user data together)
- 70% read-only transactions (cheap snapshots)
- Deploy to 3 regions (US-East, US-West, EU)
- Batch background writes`,

  whyItMatters: 'NewSQL databases trade cost for consistency. Optimize wisely without compromising guarantees!',

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Optimizing for billions in revenue',
    howTheyDoIt: 'Uses 3+2 witness config, intelligent sharding, and extensive caching. Still costs more than MySQL, but availability and consistency are worth it.',
  },

  famousIncident: {
    title: 'CockroachDB Cost Surprise',
    company: 'Various Startups',
    year: '2021',
    whatHappened: 'Several startups migrated from Postgres to CockroachDB (NewSQL) and saw 5-10x cost increase. They didn\'t account for multi-region replication and cross-region bandwidth costs.',
    lessonLearned: 'Understand the cost model before adopting NewSQL. Use it where you need strong consistency, not everywhere.',
    icon: '🪳',
  },

  keyPoints: [
    'Witness replicas save 40% storage while maintaining consistency',
    'Intelligent sharding reduces expensive cross-shard transactions',
    'Read-only transactions are 10x cheaper than writes',
    'Deploy only to regions where you have users',
    'Batch writes to amortize commit wait overhead',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for NewSQL?',
    options: [
      'Remove TrueTime (use NTP instead)',
      'Reduce to 3 replicas (no witnesses)',
      'Use 3 full + 2 witness replicas',
      'Make all transactions read-write',
    ],
    correctIndex: 2,
    explanation: 'Witnesses maintain 5-replica quorum (availability) while reducing storage to 3x (vs 5x). Best of both worlds!',
  },

  keyConcepts: [
    { title: 'Witness Cost Savings', explanation: '3 full + 2 witness vs 5 full', icon: '💰' },
    { title: 'Sharding Strategy', explanation: 'Co-locate related data', icon: '🗂️' },
    { title: 'Read-Only Optimization', explanation: 'Snapshot reads are cheap', icon: '📖' },
  ],
};

const step8: GuidedStep = {
  id: 'cap-breaker-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize system to stay under $300K/month',
    successCriteria: [
      'Review all component configurations',
      'Use 3 full + 2 witness replicas',
      'Ensure total cost is under $300K/month',
      'Maintain: Linearizability, HA, multi-region',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review Database replication config. Use witness replicas to save costs.',
    level2: 'Optimal: 3 full + 2 witness replicas, 3 regions, witness configuration in Database settings.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l6DbCapTheoremBreakerGuidedTutorial: GuidedTutorial = {
  problemId: 'l6-db-cap-theorem-breaker',
  title: 'Design a NewSQL Database (Spanner)',
  description: 'Build a globally distributed database that achieves strong consistency AND high availability using TrueTime',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🌍',
    hook: "You've been hired as Principal Engineer at Google!",
    scenario: "Your mission: Build Google Spanner - the database that 'breaks' the CAP theorem by providing strong consistency, high availability, AND partition tolerance.",
    challenge: "Can you design a system with TrueTime, Paxos, and distributed transactions that achieves linearizability at global scale?",
  },

  requirementsPhase: capTheoremBreakerRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Distributed Transactions',
    'Paxos Consensus',
    'TrueTime API',
    'External Consistency (Linearizability)',
    'Two-Phase Commit',
    'Multi-Version Concurrency Control (MVCC)',
    'Snapshot Isolation',
    'Witness Replicas',
    'Global Load Balancing',
    'Commit Wait',
    'Bounded Clock Uncertainty',
    'Quorum-Based Replication',
    'Geographic Distribution',
  ],

  ddiaReferences: [
    'Chapter 7: Transactions (ACID, 2PL, Serializable Isolation)',
    'Chapter 8: The Trouble with Distributed Systems (Clock Synchronization)',
    'Chapter 9: Consistency and Consensus (Linearizability, Paxos)',
    'Chapter 12: The Future of Data Systems (NewSQL)',
  ],
};

export default l6DbCapTheoremBreakerGuidedTutorial;
