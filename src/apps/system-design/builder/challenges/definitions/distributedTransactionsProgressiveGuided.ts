import { GuidedTutorial } from '../../types/guidedTutorial';

export const distributedTransactionsProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'distributed-transactions-progressive',
  title: 'Design Distributed Transactions',
  description: 'Build distributed transaction systems from basic 2PC to saga patterns and consensus protocols',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Understand distributed transaction challenges',
    'Implement two-phase commit (2PC)',
    'Design saga patterns for eventual consistency',
    'Handle partial failures and recovery',
    'Scale distributed transactions'
  ],
  prerequisites: ['ACID properties', 'Distributed systems', 'Consensus'],
  tags: ['distributed-systems', 'transactions', '2pc', 'saga', 'consistency'],

  progressiveStory: {
    title: 'Distributed Transactions Evolution',
    premise: "You're building a transaction coordinator for a microservices architecture. Starting with simple 2PC, you'll evolve to handle partial failures, implement sagas, and achieve reliable distributed transactions at scale.",
    phases: [
      { phase: 1, title: '2PC Basics', description: 'Two-phase commit' },
      { phase: 2, title: 'Failure Handling', description: 'Recovery and timeouts' },
      { phase: 3, title: 'Sagas', description: 'Eventual consistency patterns' },
      { phase: 4, title: 'Scale', description: 'High-performance transactions' }
    ]
  },

  steps: [
    // PHASE 1: 2PC Basics (Steps 1-3)
    {
      id: 'step-1',
      title: 'Transaction Coordinator',
      phase: 1,
      phaseTitle: '2PC Basics',
      learningObjective: 'Coordinate distributed transaction participants',
      thinkingFramework: {
        framework: 'Coordinator Pattern',
        approach: 'Central coordinator manages transaction lifecycle. Participants register and respond to prepare/commit. Coordinator decides outcome based on votes.',
        keyInsight: 'Coordinator is single source of truth for transaction state. All participants follow coordinators decision. This centralizes complexity but creates single point of failure.'
      },
      requirements: {
        functional: [
          'Register transaction participants',
          'Track transaction state',
          'Broadcast prepare/commit/abort',
          'Collect participant votes'
        ],
        nonFunctional: [
          'Coordinator failover < 10s',
          'Support 1000 concurrent transactions'
        ]
      },
      hints: [
        'Transaction: {id, participants: [], state: preparing|committing|aborting|completed}',
        'Participant: {id, endpoint, vote: unknown|prepared|aborted}',
        'State machine: begin → preparing → committing/aborting → completed'
      ],
      expectedComponents: ['Transaction Coordinator', 'Participant Registry', 'State Manager'],
      successCriteria: ['Coordinator tracks state', 'Participants registered'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Prepare Phase',
      phase: 1,
      phaseTitle: '2PC Basics',
      learningObjective: 'Implement the prepare phase of 2PC',
      thinkingFramework: {
        framework: 'Voting Protocol',
        approach: 'Coordinator asks all participants: "Can you commit?" Each participant validates locally, acquires locks, and votes yes/no. All votes must be yes to proceed.',
        keyInsight: 'Prepare = promise. Participant saying "prepared" promises it CAN commit if asked. Must hold locks and resources until final decision. This is the blocking phase.'
      },
      requirements: {
        functional: [
          'Send prepare to all participants',
          'Participants validate and lock resources',
          'Collect prepare responses',
          'Timeout handling for slow participants'
        ],
        nonFunctional: [
          'Prepare phase < 5 seconds',
          'All participants must respond'
        ]
      },
      hints: [
        'Prepare message: {transaction_id, operations: []}',
        'Response: {participant_id, vote: prepared|aborted, reason?}',
        'Timeout: treat as abort vote'
      ],
      expectedComponents: ['Prepare Handler', 'Vote Collector', 'Timeout Manager'],
      successCriteria: ['Prepare sent', 'Votes collected'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-3',
      title: 'Commit Phase',
      phase: 1,
      phaseTitle: '2PC Basics',
      learningObjective: 'Implement the commit phase of 2PC',
      thinkingFramework: {
        framework: 'Final Decision',
        approach: 'If all prepared → commit. If any aborted → abort all. Coordinator logs decision durably before sending. Participants must obey decision.',
        keyInsight: 'Decision is logged before broadcast. Even if coordinator crashes after logging, recovery can complete the transaction. Participants are slaves to logged decision.'
      },
      requirements: {
        functional: [
          'Decide commit or abort',
          'Log decision durably',
          'Broadcast decision to all participants',
          'Collect acknowledgments'
        ],
        nonFunctional: [
          'Commit broadcast < 1 second',
          'Decision survives coordinator crash'
        ]
      },
      hints: [
        'Decision: all prepared → COMMIT, any abort → ABORT',
        'Log: write decision to durable storage before broadcast',
        'Idempotent: participants handle duplicate commit messages'
      ],
      expectedComponents: ['Decision Logger', 'Commit Broadcaster', 'Ack Collector'],
      successCriteria: ['Decision logged', 'Participants notified'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Failure Handling (Steps 4-6)
    {
      id: 'step-4',
      title: 'Participant Failure Recovery',
      phase: 2,
      phaseTitle: 'Failure Handling',
      learningObjective: 'Handle participant crashes during transaction',
      thinkingFramework: {
        framework: 'Participant Recovery',
        approach: 'Participant crashes after prepare: on recovery, ask coordinator for decision. Participant must remember prepared transactions across restarts.',
        keyInsight: 'Prepared participant is "in doubt" after crash. It holds locks but doesnt know outcome. Must ask coordinator. This is why 2PC is "blocking" protocol.'
      },
      requirements: {
        functional: [
          'Persist prepared state before voting',
          'Query coordinator on recovery',
          'Resume or abort in-doubt transactions',
          'Release held locks appropriately'
        ],
        nonFunctional: [
          'Recovery < 30 seconds',
          'No stuck transactions'
        ]
      },
      hints: [
        'Participant log: {transaction_id, state, operations} persisted',
        'Recovery: scan log, find prepared transactions, query coordinator',
        'Coordinator query: GET /transaction/{id}/decision'
      ],
      expectedComponents: ['Participant Log', 'Recovery Manager', 'Coordinator Query'],
      successCriteria: ['Recovery works', 'Locks released'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Coordinator Failure Recovery',
      phase: 2,
      phaseTitle: 'Failure Handling',
      learningObjective: 'Handle coordinator crashes',
      thinkingFramework: {
        framework: 'Coordinator Recovery',
        approach: 'Coordinator crashes: new coordinator elected, reads log, resumes transactions. Logged decisions are replayed. Unlogged transactions are aborted.',
        keyInsight: 'Coordinator log is critical. Lost log = must abort all in-doubt transactions. Replicated log (Raft/Paxos) prevents this. High availability requires consensus.'
      },
      requirements: {
        functional: [
          'Coordinator election on failure',
          'Read and replay transaction log',
          'Resume in-progress transactions',
          'Abort transactions without logged decision'
        ],
        nonFunctional: [
          'Coordinator failover < 10 seconds',
          'Zero lost committed transactions'
        ]
      },
      hints: [
        'Log replication: synchronous to standby coordinator',
        'Election: Raft/Paxos for leader selection',
        'Recovery: replay log, send pending commits/aborts'
      ],
      expectedComponents: ['Leader Election', 'Log Replicator', 'Transaction Resumption'],
      successCriteria: ['Failover works', 'Transactions resume'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Timeout and Deadlock Handling',
      phase: 2,
      phaseTitle: 'Failure Handling',
      learningObjective: 'Prevent stuck transactions',
      thinkingFramework: {
        framework: 'Timeout Protocol',
        approach: 'No response = assume failure. Prepare timeout → abort. Commit timeout → retry. Deadlock detection for cross-transaction locks.',
        keyInsight: 'Network partitions look like failures. Conservative approach: timeout → abort. Aggressive retry for commits (already decided). Balance availability vs consistency.'
      },
      requirements: {
        functional: [
          'Prepare timeout handling',
          'Commit retry with backoff',
          'Deadlock detection',
          'Force transaction abort'
        ],
        nonFunctional: [
          'Max transaction duration: 60 seconds',
          'Deadlock detection < 5 seconds'
        ]
      },
      hints: [
        'Prepare timeout: 5 seconds, abort on timeout',
        'Commit retry: exponential backoff, max 10 retries',
        'Deadlock: wait-for graph, abort youngest transaction'
      ],
      expectedComponents: ['Timeout Handler', 'Retry Manager', 'Deadlock Detector'],
      successCriteria: ['Timeouts handled', 'No stuck transactions'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Sagas (Steps 7-9)
    {
      id: 'step-7',
      title: 'Saga Pattern Introduction',
      phase: 3,
      phaseTitle: 'Sagas',
      learningObjective: 'Implement saga for long-running transactions',
      thinkingFramework: {
        framework: 'Compensating Transactions',
        approach: 'Instead of distributed locks, execute steps with compensating actions. If step N fails, run compensations for N-1 to 1. Eventually consistent.',
        keyInsight: 'Sagas trade strong consistency for availability. No distributed locks means no blocking. But partial state is visible during execution. Design compensations carefully.'
      },
      requirements: {
        functional: [
          'Define saga steps and compensations',
          'Execute steps in sequence',
          'Trigger compensations on failure',
          'Track saga progress'
        ],
        nonFunctional: [
          'Saga completion < 30 seconds',
          'Compensations always run'
        ]
      },
      hints: [
        'Step: {action: "reserve_inventory", compensation: "release_inventory"}',
        'Saga: [step1, step2, step3] - execute forward, compensate backward',
        'State: {current_step, completed_steps: [], status}'
      ],
      expectedComponents: ['Saga Orchestrator', 'Step Executor', 'Compensation Runner'],
      successCriteria: ['Saga executes', 'Compensations work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Choreography vs Orchestration',
      phase: 3,
      phaseTitle: 'Sagas',
      learningObjective: 'Choose saga coordination style',
      thinkingFramework: {
        framework: 'Coordination Patterns',
        approach: 'Orchestration: central controller. Choreography: services react to events. Orchestration is simpler to understand, choreography is more decoupled.',
        keyInsight: 'Orchestration: explicit flow, easier debugging, single point of failure. Choreography: event-driven, scalable, harder to trace. Choose based on complexity and team structure.'
      },
      requirements: {
        functional: [
          'Orchestrator-based saga execution',
          'Event-driven choreography option',
          'Step status tracking',
          'Timeout handling per step'
        ],
        nonFunctional: [
          'Support both patterns',
          'Step timeout: 10 seconds'
        ]
      },
      hints: [
        'Orchestrator: POST /saga/start, polls step status',
        'Choreography: emit "order_created" → inventory listens → emits "reserved"',
        'Hybrid: orchestrator triggers events, listens for responses'
      ],
      expectedComponents: ['Orchestrator', 'Event Bus', 'Step Status Tracker'],
      successCriteria: ['Both patterns work', 'Events flow correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Saga Failure Handling',
      phase: 3,
      phaseTitle: 'Sagas',
      learningObjective: 'Handle failures in sagas gracefully',
      thinkingFramework: {
        framework: 'Compensation Strategies',
        approach: 'Step fails: run compensations in reverse order. Compensation fails: retry with backoff. Poison message: alert and manual intervention.',
        keyInsight: 'Compensations must be idempotent and always succeed eventually. Retry forever with backoff. If truly stuck, escalate to human. Never leave partial state.'
      },
      requirements: {
        functional: [
          'Backward compensation on failure',
          'Compensation retry with backoff',
          'Dead letter queue for stuck sagas',
          'Manual intervention API'
        ],
        nonFunctional: [
          'Compensation completion: 99.9%',
          'Max compensation retries: 100'
        ]
      },
      hints: [
        'Backward: step 3 fails → compensate step 2 → compensate step 1',
        'Retry: exponential backoff up to 1 hour',
        'DLQ: after max retries, move to dead letter queue for manual fix'
      ],
      expectedComponents: ['Compensation Runner', 'Retry Handler', 'DLQ Manager'],
      successCriteria: ['Compensations complete', 'DLQ for stuck'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Transaction Sharding',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Scale coordinator across shards',
      thinkingFramework: {
        framework: 'Sharded Coordination',
        approach: 'Single coordinator is bottleneck. Shard by transaction ID. Each shard handles subset of transactions. Cross-shard transactions still need global coordination.',
        keyInsight: 'Shard coordinators by transaction_id hash. Most transactions stay within shard. Rare cross-shard transactions use 2PC between coordinator shards.'
      },
      requirements: {
        functional: [
          'Shard transactions by ID',
          'Route to correct coordinator shard',
          'Handle cross-shard transactions',
          'Rebalance on shard changes'
        ],
        nonFunctional: [
          'Linear scalability',
          'Cross-shard overhead < 2x'
        ]
      },
      hints: [
        'Shard key: hash(transaction_id) mod num_shards',
        'Router: lookup shard, forward request',
        'Cross-shard: coordinator-to-coordinator 2PC'
      ],
      expectedComponents: ['Shard Router', 'Coordinator Cluster', 'Rebalancer'],
      successCriteria: ['Sharding works', 'Routing correct'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Optimistic Concurrency',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Reduce locking overhead',
      thinkingFramework: {
        framework: 'OCC Protocol',
        approach: 'Dont lock during transaction. Validate at commit time. If conflict detected, abort and retry. Works well for low-contention workloads.',
        keyInsight: '2PC locks resources for entire transaction. OCC: read → compute → validate → commit. Validation checks for conflicts. Retry on conflict. Higher throughput when conflicts rare.'
      },
      requirements: {
        functional: [
          'Version-based conflict detection',
          'Validate at commit time',
          'Automatic retry on conflict',
          'Conflict metrics'
        ],
        nonFunctional: [
          'Throughput 10x vs 2PC (low contention)',
          'Conflict rate < 5%'
        ]
      },
      hints: [
        'Version: each record has version number',
        'Read: record version at read time',
        'Validate: check version unchanged at commit',
        'Retry: re-read, re-execute, re-validate'
      ],
      expectedComponents: ['Version Manager', 'Validator', 'Conflict Retrier'],
      successCriteria: ['OCC works', 'Conflicts detected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Transaction Performance',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Optimize for global deployment',
      thinkingFramework: {
        framework: 'Geo-Distributed Transactions',
        approach: 'Cross-region transactions have high latency. Minimize cross-region coordination. Use local commits with async replication where possible. Accept higher latency for global consistency.',
        keyInsight: 'Speed of light limits cross-region latency. 100ms+ RTT between continents. Design data locality. Accept eventual consistency for reads, strong for writes in region.'
      },
      requirements: {
        functional: [
          'Region-local transactions',
          'Cross-region coordination when needed',
          'Async replication for reads',
          'Conflict resolution for multi-region writes'
        ],
        nonFunctional: [
          'Local transaction < 50ms',
          'Cross-region transaction < 500ms'
        ]
      },
      hints: [
        'Locality: route transaction to region where data lives',
        'Async: replicate committed data to other regions',
        'Conflict: last-writer-wins or custom resolution'
      ],
      expectedComponents: ['Region Router', 'Async Replicator', 'Conflict Resolver'],
      successCriteria: ['Local fast', 'Global consistent'],
      estimatedTime: '8 minutes'
    }
  ]
};
