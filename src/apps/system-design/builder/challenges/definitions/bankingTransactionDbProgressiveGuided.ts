import { GuidedTutorial } from '../../types/guidedTutorial';

export const bankingTransactionDbProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'banking-transaction-db-progressive',
  title: 'Design Banking Transaction Database',
  description: 'Build a financial transaction database from basic ledger to distributed ACID-compliant system',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design double-entry bookkeeping ledger',
    'Implement ACID transactions for money movement',
    'Build audit trails and reconciliation',
    'Handle distributed transactions across accounts',
    'Scale to billions of transactions'
  ],
  prerequisites: ['ACID properties', 'Database transactions', 'Financial systems'],
  tags: ['database', 'transactions', 'banking', 'ledger', 'acid'],

  progressiveStory: {
    title: 'Banking Database Evolution',
    premise: "You're building the core transaction database for a digital bank. Starting with a simple ledger, you'll evolve to support ACID guarantees, distributed transactions, audit compliance, and massive scale.",
    phases: [
      { phase: 1, title: 'Ledger', description: 'Double-entry bookkeeping' },
      { phase: 2, title: 'ACID', description: 'Transaction guarantees' },
      { phase: 3, title: 'Compliance', description: 'Audit and reconciliation' },
      { phase: 4, title: 'Scale', description: 'Distributed transactions' }
    ]
  },

  steps: [
    // PHASE 1: Ledger (Steps 1-3)
    {
      id: 'step-1',
      title: 'Account Data Model',
      phase: 1,
      phaseTitle: 'Ledger',
      learningObjective: 'Model accounts with balance tracking',
      thinkingFramework: {
        framework: 'Double-Entry Bookkeeping',
        approach: 'Every transaction has debit and credit entries. Sum of debits = sum of credits. Account balance = sum of all entries. Never delete, only append.',
        keyInsight: 'Banks dont store "balance" directly. Balance is computed from transaction history. This ensures audit trail and prevents discrepancies.'
      },
      requirements: {
        functional: [
          'Create accounts with types (checking, savings)',
          'Track account ownership',
          'Store account metadata',
          'Support multiple currencies'
        ],
        nonFunctional: [
          'Account lookup < 10ms',
          'Support 100M accounts'
        ]
      },
      hints: [
        'Account: {id, user_id, type, currency, status, created_at}',
        'Dont store balance field - compute from ledger entries',
        'Account types: checking, savings, loan, credit'
      ],
      expectedComponents: ['Account Store', 'Account Manager', 'Currency Handler'],
      successCriteria: ['Accounts created', 'Types supported'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Ledger Entry System',
      phase: 1,
      phaseTitle: 'Ledger',
      learningObjective: 'Implement double-entry bookkeeping',
      thinkingFramework: {
        framework: 'Immutable Ledger',
        approach: 'Each entry records debit or credit to an account. Entries are immutable - never update or delete. Corrections are new entries that reverse the original.',
        keyInsight: 'Double-entry is self-balancing. If debits != credits, something is wrong. This catches errors and fraud. Immutability provides complete audit trail.'
      },
      requirements: {
        functional: [
          'Create ledger entries (debit/credit)',
          'Link entries to transactions',
          'Ensure debits = credits per transaction',
          'Compute account balance from entries'
        ],
        nonFunctional: [
          'Entry insert < 50ms',
          'Balance calculation < 100ms'
        ]
      },
      hints: [
        'Entry: {id, account_id, transaction_id, type: debit|credit, amount, timestamp}',
        'Transaction: {id, entries: [], description, created_at}',
        'Balance: SUM(credits) - SUM(debits) for account'
      ],
      expectedComponents: ['Ledger Store', 'Entry Manager', 'Balance Calculator'],
      successCriteria: ['Entries recorded', 'Balance computed'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-3',
      title: 'Basic Money Transfer',
      phase: 1,
      phaseTitle: 'Ledger',
      learningObjective: 'Move money between accounts',
      thinkingFramework: {
        framework: 'Transfer as Transaction',
        approach: 'Transfer = debit source + credit destination. Both entries in same transaction. If one fails, both fail. Balance check before debit.',
        keyInsight: 'Transfer is not "subtract then add". Its atomic: create debit and credit entries together. Partial transfers are impossible - all or nothing.'
      },
      requirements: {
        functional: [
          'Transfer between accounts',
          'Check sufficient balance',
          'Create matching debit/credit entries',
          'Record transfer metadata'
        ],
        nonFunctional: [
          'Transfer < 200ms',
          'Zero partial transfers'
        ]
      },
      hints: [
        'Transfer: check balance → create debit entry → create credit entry (atomic)',
        'Validation: source_balance >= amount',
        'Entries: {source: debit, destination: credit, same transaction_id}'
      ],
      expectedComponents: ['Transfer Service', 'Validation Engine', 'Transaction Creator'],
      successCriteria: ['Transfers work', 'Balances correct'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: ACID (Steps 4-6)
    {
      id: 'step-4',
      title: 'Transaction Isolation',
      phase: 2,
      phaseTitle: 'ACID',
      learningObjective: 'Prevent concurrent transaction conflicts',
      thinkingFramework: {
        framework: 'Isolation Levels',
        approach: 'Concurrent transfers to same account can cause race conditions. Use serializable isolation or row-level locking. Prevent double-spending and lost updates.',
        keyInsight: 'Two concurrent transfers from same account: both read balance $100, both think they can transfer $100, result = -$100 balance. Isolation prevents this.'
      },
      requirements: {
        functional: [
          'Prevent double-spending',
          'Handle concurrent transfers',
          'Implement optimistic or pessimistic locking',
          'Detect and resolve conflicts'
        ],
        nonFunctional: [
          'Serializable isolation for transfers',
          'Conflict resolution < 100ms'
        ]
      },
      hints: [
        'Pessimistic: SELECT FOR UPDATE on account row',
        'Optimistic: version number, retry on conflict',
        'Serializable: strongest isolation, prevents all anomalies'
      ],
      expectedComponents: ['Lock Manager', 'Conflict Detector', 'Retry Handler'],
      successCriteria: ['No double-spending', 'Concurrent safety'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Atomic Commits',
      phase: 2,
      phaseTitle: 'ACID',
      learningObjective: 'Ensure all-or-nothing transactions',
      thinkingFramework: {
        framework: 'Atomicity Guarantee',
        approach: 'Transaction either fully commits or fully rolls back. No partial state. Write-ahead logging (WAL) ensures durability even on crash.',
        keyInsight: 'Crash during transfer: either both entries exist or neither. WAL records intent before action. On recovery, replay or rollback incomplete transactions.'
      },
      requirements: {
        functional: [
          'All-or-nothing commits',
          'Rollback on failure',
          'Write-ahead logging',
          'Crash recovery'
        ],
        nonFunctional: [
          'Zero partial transactions',
          'Recovery < 30 seconds'
        ]
      },
      hints: [
        'WAL: write intention to log before modifying data',
        'Commit: mark transaction complete in log',
        'Recovery: replay committed, rollback uncommitted'
      ],
      expectedComponents: ['WAL Manager', 'Commit Controller', 'Recovery Service'],
      successCriteria: ['Atomic commits', 'Crash recovery works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Durability and Persistence',
      phase: 2,
      phaseTitle: 'ACID',
      learningObjective: 'Ensure committed data survives failures',
      thinkingFramework: {
        framework: 'Durable Storage',
        approach: 'Committed transactions must survive power loss, crashes, disk failures. Synchronous writes to disk. Replication for hardware failures.',
        keyInsight: 'fsync on commit ensures data reaches disk, not just OS buffer. Replication ensures data survives disk failure. Banks require both.'
      },
      requirements: {
        functional: [
          'Synchronous disk writes on commit',
          'Replicate to standby',
          'Point-in-time recovery',
          'Backup and restore'
        ],
        nonFunctional: [
          'Committed data never lost',
          'RPO: 0 (no data loss)'
        ]
      },
      hints: [
        'fsync: force write to disk on commit',
        'Replication: synchronous standby for zero data loss',
        'PITR: continuous archiving of WAL for recovery'
      ],
      expectedComponents: ['Durable Writer', 'Replication Manager', 'Backup Service'],
      successCriteria: ['Data survives crash', 'Replication works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Compliance (Steps 7-9)
    {
      id: 'step-7',
      title: 'Audit Trail',
      phase: 3,
      phaseTitle: 'Compliance',
      learningObjective: 'Track all changes for regulatory compliance',
      thinkingFramework: {
        framework: 'Immutable Audit Log',
        approach: 'Every change logged with who, what, when. Logs are append-only, never modified. Cryptographic chaining prevents tampering.',
        keyInsight: 'Regulators require complete history. Who approved this transfer? When? From which IP? Audit logs answer these questions years later.'
      },
      requirements: {
        functional: [
          'Log all data changes',
          'Record user and timestamp',
          'Tamper-evident logging',
          'Query audit history'
        ],
        nonFunctional: [
          'Audit log retention: 7 years',
          'Query < 5 seconds'
        ]
      },
      hints: [
        'AuditEntry: {id, entity, action, old_value, new_value, user_id, ip, timestamp}',
        'Chaining: hash of previous entry in current entry',
        'Storage: append-only, separate from operational DB'
      ],
      expectedComponents: ['Audit Logger', 'Chain Validator', 'Audit Query Service'],
      successCriteria: ['Changes tracked', 'Tamper-evident'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Reconciliation System',
      phase: 3,
      phaseTitle: 'Compliance',
      learningObjective: 'Verify ledger integrity',
      thinkingFramework: {
        framework: 'Balance Verification',
        approach: 'Daily reconciliation: sum of all account balances = 0 (assets = liabilities). Compare with external systems. Detect and investigate discrepancies.',
        keyInsight: 'Double-entry should always balance. If total debits != total credits, there is a bug or fraud. Daily reconciliation catches issues early.'
      },
      requirements: {
        functional: [
          'Daily balance reconciliation',
          'Compare with external systems',
          'Detect discrepancies',
          'Generate reconciliation reports'
        ],
        nonFunctional: [
          'Reconciliation < 1 hour',
          'Discrepancy detection immediate'
        ]
      },
      hints: [
        'Internal: SUM(all debits) = SUM(all credits)',
        'External: compare with payment processor, central bank',
        'Alert: any discrepancy > $0.01 triggers investigation'
      ],
      expectedComponents: ['Reconciliation Engine', 'Discrepancy Detector', 'Report Generator'],
      successCriteria: ['Reconciliation runs', 'Discrepancies detected'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Regulatory Reporting',
      phase: 3,
      phaseTitle: 'Compliance',
      learningObjective: 'Generate required regulatory reports',
      thinkingFramework: {
        framework: 'Compliance Reports',
        approach: 'Banks must report to regulators: suspicious activity, large transactions, daily positions. Pre-aggregate data for fast reporting.',
        keyInsight: 'Regulations vary by jurisdiction. US: BSA/AML, CTR for >$10K. EU: PSD2, GDPR. Reports must be accurate and timely - fines are severe.'
      },
      requirements: {
        functional: [
          'Suspicious activity reports (SAR)',
          'Currency transaction reports (CTR)',
          'Daily position reports',
          'Ad-hoc regulatory queries'
        ],
        nonFunctional: [
          'Report generation < 1 hour',
          'SAR filing within 24 hours'
        ]
      },
      hints: [
        'SAR: flag unusual patterns, large round amounts, structuring',
        'CTR: automatically file for transactions >$10K',
        'Aggregation: pre-compute daily summaries for fast reporting'
      ],
      expectedComponents: ['SAR Generator', 'CTR Filer', 'Report Engine'],
      successCriteria: ['Reports generated', 'Regulatory compliance'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Distributed Transactions',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Handle cross-shard transactions',
      thinkingFramework: {
        framework: 'Two-Phase Commit',
        approach: 'Accounts on different shards: transfer requires coordination. 2PC: prepare on both shards, then commit. Saga pattern for eventual consistency alternative.',
        keyInsight: 'Sharding breaks single-database ACID. Cross-shard transfer: debit on shard A, credit on shard B. Need distributed transaction protocol.'
      },
      requirements: {
        functional: [
          'Cross-shard transfers',
          'Two-phase commit protocol',
          'Handle coordinator failures',
          'Transaction timeout and recovery'
        ],
        nonFunctional: [
          'Cross-shard latency < 500ms',
          'No stuck transactions'
        ]
      },
      hints: [
        '2PC: coordinator → prepare all → commit all (or abort all)',
        'Saga: debit → credit, compensate on failure',
        'Timeout: abort if no response within deadline'
      ],
      expectedComponents: ['Transaction Coordinator', '2PC Manager', 'Saga Orchestrator'],
      successCriteria: ['Cross-shard works', 'No partial transactions'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Horizontal Sharding',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Scale to billions of accounts',
      thinkingFramework: {
        framework: 'Account Sharding',
        approach: 'Shard by account_id hash. Most transfers are within-shard (same user). Cross-shard for external transfers. Keep related accounts together.',
        keyInsight: 'User typically transfers between own accounts (same shard = fast). External transfers are less frequent (cross-shard OK). Shard key choice is critical.'
      },
      requirements: {
        functional: [
          'Shard accounts by ID',
          'Route queries to correct shard',
          'Handle shard splits',
          'Rebalance data'
        ],
        nonFunctional: [
          'Even distribution across shards',
          'Support 100+ shards'
        ]
      },
      hints: [
        'Shard key: hash(account_id) mod num_shards',
        'Routing: lookup shard from account_id',
        'Split: when shard too large, split and migrate'
      ],
      expectedComponents: ['Shard Router', 'Shard Manager', 'Rebalancer'],
      successCriteria: ['Sharding works', 'Routing correct'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'High Availability',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Ensure zero downtime for banking',
      thinkingFramework: {
        framework: 'Active-Active',
        approach: 'Banks cannot have downtime. Multiple data centers, synchronous replication, automatic failover. RTO and RPO must be near-zero.',
        keyInsight: 'Banking is critical infrastructure. Downtime = regulatory fines, customer losses, reputation damage. Design for failure at every level.'
      },
      requirements: {
        functional: [
          'Multi-datacenter deployment',
          'Synchronous replication',
          'Automatic failover',
          'Zero-downtime maintenance'
        ],
        nonFunctional: [
          '99.999% availability',
          'RTO < 30 seconds, RPO = 0'
        ]
      },
      hints: [
        'Active-active: both DCs serve traffic',
        'Sync replication: commit waits for standby ACK',
        'Failover: detect failure, promote standby, update routing'
      ],
      expectedComponents: ['Replication Manager', 'Failover Controller', 'Health Monitor'],
      successCriteria: ['Multi-DC works', 'Failover automatic'],
      estimatedTime: '8 minutes'
    }
  ]
};
