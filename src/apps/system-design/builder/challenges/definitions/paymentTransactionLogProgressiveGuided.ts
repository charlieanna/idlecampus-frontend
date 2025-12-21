import { GuidedTutorial } from '../../types/guidedTutorial';

export const paymentTransactionLogProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'payment-transaction-log-progressive',
  title: 'Design Payment Transaction Log',
  description: 'Build an append-only transaction log for payment systems with audit, reconciliation, and compliance',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design append-only immutable log',
    'Implement idempotency and deduplication',
    'Build reconciliation and audit systems',
    'Handle regulatory compliance requirements',
    'Scale to billions of transactions'
  ],
  prerequisites: ['Append-only logs', 'Financial systems', 'Compliance'],
  tags: ['payments', 'transaction-log', 'audit', 'compliance', 'fintech'],

  progressiveStory: {
    title: 'Payment Transaction Log Evolution',
    premise: "You're building the transaction log for a payment processor. Starting with basic append-only logging, you'll evolve to support idempotency, reconciliation, regulatory compliance, and massive scale.",
    phases: [
      { phase: 1, title: 'Logging', description: 'Append-only transactions' },
      { phase: 2, title: 'Integrity', description: 'Idempotency and ordering' },
      { phase: 3, title: 'Compliance', description: 'Audit and reconciliation' },
      { phase: 4, title: 'Scale', description: 'High-volume processing' }
    ]
  },

  steps: [
    // PHASE 1: Logging (Steps 1-3)
    {
      id: 'step-1',
      title: 'Append-Only Log Structure',
      phase: 1,
      phaseTitle: 'Logging',
      learningObjective: 'Design immutable transaction log',
      thinkingFramework: {
        framework: 'Immutable Log',
        approach: 'Every transaction appended, never modified or deleted. Sequential log with monotonic IDs. Timestamp and sequence number for ordering.',
        keyInsight: 'Immutability is legal requirement. "Transaction was $100, now shows $90" is fraud indicator. Append-only log is evidence of what actually happened.'
      },
      requirements: {
        functional: [
          'Append transaction entries',
          'Sequential, monotonic IDs',
          'No updates or deletes',
          'Timestamp each entry'
        ],
        nonFunctional: [
          'Append latency < 10ms',
          'Sequential guarantees'
        ]
      },
      hints: [
        'Entry: {sequence_id, timestamp, transaction_id, type, amount, parties, metadata}',
        'Storage: append-only file or log-structured DB',
        'Sequence: atomic increment for ordering'
      ],
      expectedComponents: ['Log Writer', 'Sequence Generator', 'Entry Store'],
      successCriteria: ['Entries appended', 'Sequential order'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Transaction States',
      phase: 1,
      phaseTitle: 'Logging',
      learningObjective: 'Model transaction lifecycle',
      thinkingFramework: {
        framework: 'State Machine Log',
        approach: 'Transaction goes through states: initiated → processing → completed/failed. Each state change is new log entry. Never modify previous entries.',
        keyInsight: 'Dont update status field. Append new entry with new state. Entry 1: initiated. Entry 2: completed. Both entries exist forever. State = latest entry.'
      },
      requirements: {
        functional: [
          'Log state transitions',
          'Link entries by transaction_id',
          'Query current state',
          'Full state history'
        ],
        nonFunctional: [
          'State query < 20ms',
          'History query < 100ms'
        ]
      },
      hints: [
        'States: initiated, authorized, captured, settled, refunded, failed',
        'Transition: new entry with same transaction_id, new state',
        'Current state: latest entry for transaction_id'
      ],
      expectedComponents: ['State Manager', 'History Index', 'State Query'],
      successCriteria: ['State transitions logged', 'Current state queryable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Basic Querying',
      phase: 1,
      phaseTitle: 'Logging',
      learningObjective: 'Query transactions efficiently',
      thinkingFramework: {
        framework: 'Log Indexing',
        approach: 'Log is append-only but needs indexes for queries. Index by transaction_id, merchant_id, time range. Indexes point to log positions.',
        keyInsight: 'Raw log scan is O(n) - unusable at scale. Secondary indexes enable point lookups. But indexes must be updated atomically with append.'
      },
      requirements: {
        functional: [
          'Query by transaction ID',
          'Query by merchant',
          'Query by time range',
          'Query by amount range'
        ],
        nonFunctional: [
          'Point lookup < 10ms',
          'Range query < 100ms'
        ]
      },
      hints: [
        'Index: {key → [log_positions]}',
        'B-tree: for range queries (time, amount)',
        'Hash: for exact lookups (transaction_id)'
      ],
      expectedComponents: ['Index Manager', 'Query Engine', 'Range Scanner'],
      successCriteria: ['Indexes work', 'Queries fast'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Integrity (Steps 4-6)
    {
      id: 'step-4',
      title: 'Idempotency Keys',
      phase: 2,
      phaseTitle: 'Integrity',
      learningObjective: 'Prevent duplicate transactions',
      thinkingFramework: {
        framework: 'Idempotent Processing',
        approach: 'Client provides idempotency key. If key seen before, return previous result. Prevents double-charging on retry. Key → transaction_id mapping.',
        keyInsight: 'Network failures cause retries. Without idempotency, retry = duplicate charge. Idempotency key guarantees "exactly-once" semantics for client.'
      },
      requirements: {
        functional: [
          'Accept idempotency key with request',
          'Check for existing key before processing',
          'Return cached result for duplicate',
          'Key expiration policy'
        ],
        nonFunctional: [
          'Key check < 5ms',
          'Key retention: 24 hours'
        ]
      },
      hints: [
        'Key store: {idempotency_key → transaction_id, result, expires_at}',
        'Check: lookup key → if exists, return cached result',
        'Atomic: check-and-set to prevent race conditions'
      ],
      expectedComponents: ['Idempotency Store', 'Key Checker', 'Result Cache'],
      successCriteria: ['Duplicates prevented', 'Cached results returned'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Exactly-Once Semantics',
      phase: 2,
      phaseTitle: 'Integrity',
      learningObjective: 'Guarantee no lost or duplicate entries',
      thinkingFramework: {
        framework: 'Deduplication Pipeline',
        approach: 'Multiple entry points (API, webhooks, batch). Dedup at log layer. Sequence numbers detect gaps. Replay fills missing entries.',
        keyInsight: 'At-least-once delivery is easy. Exactly-once requires dedup. Transaction ID + sequence detects duplicates. Gaps trigger replay from source.'
      },
      requirements: {
        functional: [
          'Detect duplicate entries',
          'Detect missing entries (gaps)',
          'Replay to fill gaps',
          'Dead letter queue for failures'
        ],
        nonFunctional: [
          'Zero duplicates in log',
          'Gap detection < 1 minute'
        ]
      },
      hints: [
        'Dedup: check transaction_id before append',
        'Gap detection: expected_seq vs actual_seq',
        'Replay: request missing range from source system'
      ],
      expectedComponents: ['Deduplicator', 'Gap Detector', 'Replay Manager'],
      successCriteria: ['No duplicates', 'Gaps filled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Cryptographic Integrity',
      phase: 2,
      phaseTitle: 'Integrity',
      learningObjective: 'Tamper-evident logging',
      thinkingFramework: {
        framework: 'Hash Chain',
        approach: 'Each entry includes hash of previous entry. Tampering breaks chain. Periodic checkpoints with Merkle tree. Auditors can verify integrity.',
        keyInsight: 'Append-only is policy, hash chain is enforcement. Tampering requires rewriting all subsequent entries. Distributed witnesses make this impossible.'
      },
      requirements: {
        functional: [
          'Hash chain linking entries',
          'Merkle tree checkpoints',
          'Integrity verification',
          'Tamper detection alerts'
        ],
        nonFunctional: [
          'Hash overhead < 1ms per entry',
          'Verification < 1 second'
        ]
      },
      hints: [
        'Entry: {..., prev_hash, hash = SHA256(entry + prev_hash)}',
        'Merkle: hourly checkpoint with root hash',
        'Verify: recompute hashes, compare with stored'
      ],
      expectedComponents: ['Hash Chain', 'Merkle Builder', 'Integrity Verifier'],
      successCriteria: ['Chain unbroken', 'Tampering detected'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Compliance (Steps 7-9)
    {
      id: 'step-7',
      title: 'Audit Trail',
      phase: 3,
      phaseTitle: 'Compliance',
      learningObjective: 'Support regulatory audits',
      thinkingFramework: {
        framework: 'Audit Log',
        approach: 'Every access logged. Who queried what, when. Every state change attributed to user/system. Immutable audit log separate from transaction log.',
        keyInsight: 'Regulators ask: "Who approved this refund?" Audit log answers. Transaction log shows what happened. Audit log shows who did it and why.'
      },
      requirements: {
        functional: [
          'Log all data access',
          'Log all state changes with actor',
          'Tamper-evident audit log',
          'Query audit by actor or transaction'
        ],
        nonFunctional: [
          'Audit retention: 7 years',
          'Query < 5 seconds'
        ]
      },
      hints: [
        'AuditEntry: {timestamp, actor_id, action, target_transaction, ip_address, reason}',
        'Actions: view, initiate, approve, refund, dispute',
        'Separate store: audit log independent of transaction log'
      ],
      expectedComponents: ['Audit Logger', 'Actor Tracker', 'Audit Query'],
      successCriteria: ['All actions logged', 'Queryable by auditors'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Reconciliation',
      phase: 3,
      phaseTitle: 'Compliance',
      learningObjective: 'Balance with external systems',
      thinkingFramework: {
        framework: 'Multi-System Reconciliation',
        approach: 'Compare transaction log with bank statements, card network reports, merchant records. Detect and investigate discrepancies. Daily automated reconciliation.',
        keyInsight: 'Your log vs bank statement should match. Discrepancies = fraud, bugs, or timing issues. Daily reconciliation catches problems before they compound.'
      },
      requirements: {
        functional: [
          'Import external statements',
          'Match transactions by reference',
          'Identify unmatched entries',
          'Generate discrepancy reports'
        ],
        nonFunctional: [
          'Daily reconciliation < 1 hour',
          'Discrepancy detection same-day'
        ]
      },
      hints: [
        'Match key: external_reference_id or (amount, date, merchant)',
        'Categories: matched, internal_only, external_only, amount_mismatch',
        'Report: list discrepancies with context for investigation'
      ],
      expectedComponents: ['Reconciliation Engine', 'Matcher', 'Discrepancy Reporter'],
      successCriteria: ['Matching works', 'Discrepancies found'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Regulatory Reporting',
      phase: 3,
      phaseTitle: 'Compliance',
      learningObjective: 'Generate required reports',
      thinkingFramework: {
        framework: 'Compliance Reports',
        approach: 'PCI-DSS transaction logs. AML suspicious activity reports. Tax reporting (1099-K). Format-specific exports. Automated generation on schedule.',
        keyInsight: 'Different regulations require different reports. PCI: access logs. AML: large/suspicious transactions. Tax: merchant payouts. Single source, multiple reports.'
      },
      requirements: {
        functional: [
          'Generate PCI compliance logs',
          'Suspicious activity detection and reporting',
          'Tax form generation (1099-K)',
          'Scheduled report generation'
        ],
        nonFunctional: [
          'Report generation < 1 hour',
          'SAR filing within 24 hours'
        ]
      },
      hints: [
        'PCI: log cardholder data access with justification',
        'SAR: flag transactions > threshold or unusual patterns',
        '1099-K: aggregate payouts per merchant per year'
      ],
      expectedComponents: ['Report Generator', 'SAR Detector', 'Tax Calculator'],
      successCriteria: ['Reports generated', 'Compliance met'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Log Partitioning',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Distribute log across machines',
      thinkingFramework: {
        framework: 'Partitioned Log',
        approach: 'Partition by merchant_id or time. Each partition is independent log. Global ordering not required. Partition-level ordering sufficient.',
        keyInsight: 'Single log bottlenecks at millions TPS. Partition by merchant: each merchants transactions ordered, cross-merchant ordering not needed for most queries.'
      },
      requirements: {
        functional: [
          'Partition by merchant ID',
          'Route writes to correct partition',
          'Cross-partition queries',
          'Rebalance partitions'
        ],
        nonFunctional: [
          'Linear scalability',
          'Partition size < 1TB'
        ]
      },
      hints: [
        'Partition key: hash(merchant_id) mod num_partitions',
        'Router: lookup partition, forward append',
        'Cross-partition: scatter-gather for range queries'
      ],
      expectedComponents: ['Partition Manager', 'Write Router', 'Query Coordinator'],
      successCriteria: ['Partitioning works', 'Routing correct'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'High-Throughput Ingestion',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Handle massive transaction volume',
      thinkingFramework: {
        framework: 'Batch and Stream',
        approach: 'Buffer writes, batch append for throughput. Async acknowledgment for lower latency. Kafka as ingestion buffer. Write-behind to permanent storage.',
        keyInsight: 'Single write per transaction is slow. Batch 100 transactions, single disk write. 100x throughput. Acknowledge after Kafka persist, before final storage.'
      },
      requirements: {
        functional: [
          'Buffer incoming transactions',
          'Batch writes to log',
          'Async acknowledgment',
          'Backpressure handling'
        ],
        nonFunctional: [
          'Throughput > 100K TPS',
          'Ack latency < 50ms'
        ]
      },
      hints: [
        'Buffer: Kafka topic per partition',
        'Batch: consume 100 messages, single write',
        'Ack: return success after Kafka persist'
      ],
      expectedComponents: ['Ingestion Buffer', 'Batch Writer', 'Ack Handler'],
      successCriteria: ['High throughput', 'Low latency acks'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Archival and Retention',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Manage log lifecycle',
      thinkingFramework: {
        framework: 'Tiered Storage',
        approach: 'Hot storage for recent (SSD). Warm for months (HDD). Cold for years (S3/Glacier). Retention policies by regulation. Secure deletion when allowed.',
        keyInsight: 'Keep 7 years for compliance, but not all on SSD. Tier by age. Old data accessed rarely. Archive to cheap storage, restore on demand.'
      },
      requirements: {
        functional: [
          'Automatic tiering by age',
          'Archive to cold storage',
          'Restore archived data on demand',
          'Secure deletion after retention'
        ],
        nonFunctional: [
          'Tier transition < 24 hours',
          'Restore < 1 hour'
        ]
      },
      hints: [
        'Tiers: hot (< 30 days), warm (< 1 year), cold (< 7 years)',
        'Archive: compress and upload to S3 Glacier',
        'Restore: async job to fetch and decompress'
      ],
      expectedComponents: ['Tier Manager', 'Archiver', 'Restore Service'],
      successCriteria: ['Tiering works', 'Costs optimized'],
      estimatedTime: '8 minutes'
    }
  ]
};
