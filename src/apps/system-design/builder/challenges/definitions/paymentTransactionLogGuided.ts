import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Payment Transaction Log Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching critical payment logging concepts:
 * - Immutable transaction logs
 * - Double-entry bookkeeping for payments
 * - Audit trails and compliance reporting
 * - Reconciliation and dispute resolution
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview about transaction types, audit, reconciliation)
 * Steps 1-3: Build basic payment logging system
 * Steps 4-6: Add immutability, double-entry bookkeeping, compliance reporting
 *
 * Key Concepts:
 * - Immutable logs (append-only, no updates/deletes)
 * - Double-entry bookkeeping for payment reconciliation
 * - Audit trail requirements (PCI DSS, SOX, GDPR)
 * - Transaction lifecycle tracking
 * - Reconciliation and settlement
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const paymentLogRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a payment transaction logging system",

  interviewer: {
    name: 'Jennifer Park',
    role: 'Head of Payments Engineering at PayFlow Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-logging',
      category: 'functional',
      question: "What payment events need to be logged?",
      answer: "Every payment operation must be logged:\n\n1. **Payment attempts** - Initial charge requests\n2. **Payment status changes** - pending → succeeded/failed\n3. **Refunds** - Full or partial refunds\n4. **Disputes** - Chargebacks and dispute lifecycle\n5. **Settlement** - When funds are transferred to merchant accounts",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Payment logs capture the complete lifecycle from attempt to settlement",
    },
    {
      id: 'transaction-types',
      category: 'functional',
      question: "What types of transactions should we support?",
      answer: "For MVP:\n- **Card payments** (credit/debit)\n- **Refunds** (full and partial)\n- **Adjustments** (fees, corrections)\n- **Settlements** (payouts to merchants)\n\nLater: ACH, wire transfers, digital wallets",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with card payments - the most common transaction type",
    },
    {
      id: 'immutability',
      category: 'functional',
      question: "Can transaction logs be modified or deleted after creation?",
      answer: "Absolutely NOT! Transaction logs MUST be **immutable**:\n- No updates allowed\n- No deletions allowed\n- Append-only operations\n- Changes create NEW log entries (e.g., refund creates separate entry)\n\nThis is required for audit compliance and fraud prevention.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Immutability prevents fraud and meets regulatory requirements",
    },
    {
      id: 'double-entry',
      category: 'functional',
      question: "How do we ensure payment books balance for reconciliation?",
      answer: "We use **double-entry bookkeeping**: every payment has TWO entries:\n- **Debit** from customer account/card\n- **Credit** to merchant account\n\nFor reconciliation, sum of all debits MUST equal sum of all credits. This catches errors immediately.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Double-entry bookkeeping enables automated reconciliation and error detection",
    },
    {
      id: 'audit-requirements',
      category: 'functional',
      question: "What audit information must be captured for each transaction?",
      answer: "Complete audit trail required:\n- **Who**: User/merchant ID, IP address\n- **What**: Transaction type, amount, currency\n- **When**: Timestamp (UTC, millisecond precision)\n- **Why**: Description, order ID, metadata\n- **How**: Payment method, gateway, device info\n- **Result**: Status, error codes, gateway response\n\nRetention: 7 years minimum (regulatory requirement)",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Comprehensive audit trails are legally required for payment systems",
    },
    {
      id: 'reconciliation',
      category: 'clarification',
      question: "How often do merchants need to reconcile payments against our logs?",
      answer: "Daily reconciliation is standard:\n- End-of-day settlement reports\n- Match against bank statements\n- Identify discrepancies\n- Dispute resolution\n\nLogs must support **point-in-time queries** to reconstruct any day's transactions.",
      importance: 'critical',
      insight: "Reconciliation requires efficient querying of historical transaction logs",
    },
    {
      id: 'dispute-handling',
      category: 'clarification',
      question: "What happens when a customer disputes a charge?",
      answer: "Disputes require complete transaction history:\n- Original payment log\n- Customer interaction logs\n- Merchant evidence logs\n- Timeline of all status changes\n\nWe need to retrieve this instantly for chargeback defense. Win rate depends on evidence quality.",
      importance: 'important',
      insight: "Dispute resolution requires instant access to complete transaction history",
    },

    // SCALE & NFRs
    {
      id: 'throughput-logging',
      category: 'throughput',
      question: "How many payment transactions per day need logging?",
      answer: "100 million payment events per day (attempts, updates, refunds, settlements combined)",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 events/sec",
        result: "~1,157 writes/sec average, ~5,785 peak (5x spike)",
      },
      learningPoint: "Payment logging is write-heavy - optimize for append operations",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many log queries per day for reconciliation and reports?",
      answer: "500 million queries per day - merchants checking transaction history, running reports, resolving disputes",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 reads/sec",
        result: "~5,787 reads/sec average, ~28,935 peak",
      },
      learningPoint: "5:1 read:write ratio - need efficient querying with indexes",
    },
    {
      id: 'latency-logging',
      category: 'latency',
      question: "How fast must log writes complete?",
      answer: "p99 under 50ms. Payment processing waits for log confirmation. Slow logging = slow checkout.",
      importance: 'critical',
      learningPoint: "Log writes are in the critical path - must be fast",
    },
    {
      id: 'latency-queries',
      category: 'latency',
      question: "How fast must reconciliation queries be?",
      answer: "p99 under 200ms for merchant dashboard queries. Daily reconciliation runs can be slower (< 30 seconds for full day).",
      importance: 'important',
      learningPoint: "Real-time queries need speed, batch reconciliation can tolerate higher latency",
    },
    {
      id: 'data-retention',
      category: 'reliability',
      question: "How long must we retain transaction logs?",
      answer: "**7 years minimum** - required by:\n- PCI DSS (Payment Card Industry)\n- SOX (Sarbanes-Oxley)\n- GDPR (with anonymization for deleted users)\n- State banking regulations\n\nLogs are immutable and must survive disasters.",
      importance: 'critical',
      insight: "Long-term retention requires archival strategy and disaster recovery",
    },
    {
      id: 'consistency',
      category: 'consistency',
      question: "Can we use eventual consistency for transaction logs?",
      answer: "NO! Logs must be **strongly consistent**:\n- Payment processor must confirm log write before returning success\n- Merchants need immediate visibility\n- Disputes require instant access\n\nEventual consistency could lose transactions during disputes.",
      importance: 'critical',
      learningPoint: "Financial logs require strong consistency - eventual consistency is unacceptable",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-logging', 'immutability', 'double-entry'],
  criticalFRQuestionIds: ['core-logging', 'transaction-types', 'immutability'],
  criticalScaleQuestionIds: ['throughput-logging', 'data-retention', 'consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Log all payment events',
      description: 'Capture attempts, status changes, refunds, disputes, settlements',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Query transaction history',
      description: 'Merchants can retrieve logs by date, status, customer, amount',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Generate reconciliation reports',
      description: 'Daily settlement reports matching all debits and credits',
      emoji: '📊',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Immutable logs',
      description: 'No updates or deletes - append-only operations',
      emoji: '🔒',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Double-entry bookkeeping',
      description: 'Every payment has balanced debit and credit entries',
      emoji: '⚖️',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Complete audit trail',
      description: 'Capture who, what, when, why, how for every transaction',
      emoji: '📜',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500,000 merchants',
    writesPerDay: '100 million events',
    readsPerDay: '500 million queries',
    peakMultiplier: 5,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 1157, peak: 5785 },
    calculatedReadRPS: { average: 5787, peak: 28935 },
    maxPayloadSize: '~10KB (transaction log with metadata)',
    storagePerRecord: '~5KB (log entry)',
    storageGrowthPerYear: '~180TB (7-year retention)',
    redirectLatencySLA: 'p99 < 50ms (log write)',
    createLatencySLA: 'p99 < 200ms (query)',
  },

  architecturalImplications: [
    '✅ Write-heavy workload → Optimized for append operations',
    '✅ Immutability required → Append-only storage, no updates',
    '✅ Strong consistency → Synchronous writes to durable storage',
    '✅ Query performance → Indexes on timestamp, merchant, status',
    '✅ Long retention → Archival tier for old data (S3, Glacier)',
    '✅ Double-entry → Transaction entries table with balanced debits/credits',
  ],

  outOfScope: [
    'Real-time fraud detection',
    'Machine learning on transaction patterns',
    'Multi-currency conversion',
    'Cryptocurrency transactions',
    'Custom merchant reporting dashboards',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple logging system that captures payment events and stores them durably. Then we'll add immutability, double-entry bookkeeping, and compliance reporting. Correctness first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📝',
  scenario: "Welcome to PayFlow Inc! You've been hired to build a payment transaction logging system.",
  hook: "A merchant just processed their first payment, but there's no log of it anywhere!",
  challenge: "Set up the basic connection so payment events can reach your logging server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your logging system is online!',
  achievement: 'Payment events can now reach your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive events', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to store logs yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Payment Logging Architecture',
  conceptExplanation: `Every payment logging system starts with a **Client** connecting to a **Logging Server**.

When a payment is processed:
1. The payment gateway is the **Client**
2. It sends log events to your **Logging Server**
3. The server stores the event with complete metadata

This is the foundation of ALL transaction logging systems!`,

  whyItMatters: 'Without this connection, payment events are lost forever - no audit trail, no reconciliation, no dispute resolution.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Logging billions of payment events annually',
    howTheyDoIt: 'Every payment operation immediately sends structured log events to their distributed logging infrastructure',
  },

  keyPoints: [
    'Client = payment gateway or processing system',
    'Logging Server = your backend that stores transaction logs',
    'HTTPS = secure protocol for sensitive payment data',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Payment system sending log events', icon: '💳' },
    { title: 'Logging Server', explanation: 'Backend that captures and stores events', icon: '📝' },
    { title: 'Log Event', explanation: 'Structured data about a payment operation', icon: '📄' },
  ],
};

const step1: GuidedStep = {
  id: 'payment-log-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all logging operations',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents payment gateways sending log events', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles log ingestion and processing', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Logging APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it's just an empty shell!",
  hook: "A payment succeeded but the log event got a 404 error. The server doesn't know how to process log events!",
  challenge: "Write the Python code to handle payment log ingestion and queries.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your logging APIs are live!',
  achievement: 'You implemented the core logging functionality',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can log events', after: '✓' },
    { label: 'Can query logs', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all logs are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Payment Log APIs: Critical Event Handlers',
  conceptExplanation: `Every payment logging system needs **handler functions** that process log events.

For our system, we need handlers for:
- \`log_event()\` - Store payment events
- \`query_logs()\` - Retrieve transaction history
- \`get_reconciliation_report()\` - Generate daily settlement reports (later)

**Critical requirements:**
1. **Validate input** - Check required fields (transaction_id, amount, timestamp, type)
2. **Store atomically** - Event is fully logged or not at all
3. **Return confirmation** - With log ID and timestamp
4. **Preserve order** - Events for same transaction maintain sequence

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Payment logs are legal evidence. A bug here means lost audit trails and failed compliance audits!',

  famousIncident: {
    title: 'PayPal Transaction Log Corruption',
    company: 'PayPal',
    year: '2017',
    whatHappened: 'A bug in PayPal\'s logging system caused some transaction events to be logged out of order. During a dispute investigation, they couldn\'t reconstruct the payment timeline accurately, leading to lost chargebacks and regulatory fines.',
    lessonLearned: 'Transaction logs must preserve event order and be stored reliably.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Square',
    scenario: 'Processing 5,785 log events per second at peak',
    howTheyDoIt: 'Their logging API uses structured events with schema validation, guaranteed ordering, and immediate durability',
  },

  keyPoints: [
    'Each log event needs a handler function',
    'Validate all inputs - required fields and data types',
    'Use in-memory storage for now (database comes next)',
    'Preserve event order for same transaction',
  ],

  quickCheck: {
    question: 'Why must payment logs preserve event order?',
    options: [
      'It makes queries faster',
      'To reconstruct transaction timeline during disputes and audits',
      'It saves storage space',
      'It\'s required by PCI DSS',
    ],
    correctIndex: 1,
    explanation: 'Event order is critical for understanding payment lifecycle and resolving disputes.',
  },

  keyConcepts: [
    { title: 'Log Event', explanation: 'Structured record of a payment operation', icon: '📄' },
    { title: 'Event Order', explanation: 'Chronological sequence of events preserved', icon: '🔢' },
    { title: 'Validation', explanation: 'Check event has all required fields', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'payment-log-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Log payment events, FR-2: Query transaction history',
    taskDescription: 'Configure APIs and implement Python handlers for logging',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/logs, GET /api/v1/logs/query APIs',
      'Open the Python tab',
      'Implement log_event() and query_logs() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the App Server, then go to the APIs tab to assign logging endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for log_event and query_logs',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/logs', 'GET /api/v1/logs/query'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Durable Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed at 3 AM during Black Friday...",
  hook: "When it came back, ALL transaction logs were GONE! Merchants can't reconcile sales. Disputes have no evidence. Regulators are furious!",
  challenge: "Add a database so logs survive crashes and are stored durably.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your logs are now durable!',
  achievement: 'Transaction logs persist with ACID guarantees',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Log durability', after: '100%' },
    { label: 'ACID compliance', after: '✓' },
  ],
  nextTeaser: "But logs can still be modified or deleted, which breaks audit compliance...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Durable Storage: Why Databases Are Critical for Payment Logs',
  conceptExplanation: `For payment logs, losing data is **catastrophic and illegal**.

A **database** provides:
- **Durability**: Log records survive crashes
- **ACID guarantees**: Atomicity, Consistency, Isolation, Durability
- **Query efficiency**: Fast lookups by transaction ID, merchant, date
- **Scalability**: Handle billions of log records

For payment logging, we need tables for:
- \`transaction_logs\` - All payment events with full metadata
- \`transaction_entries\` - Double-entry bookkeeping (debit/credit)
- \`reconciliation_reports\` - Daily settlement summaries`,

  whyItMatters: 'Losing payment logs means:\n1. Can\'t reconcile accounts\n2. Can\'t resolve disputes\n3. No audit trail for regulators\n4. Massive fines and legal liability',

  famousIncident: {
    title: 'Equifax Data Breach',
    company: 'Equifax',
    year: '2017',
    whatHappened: 'Poor database security and logging led to a breach affecting 147 million people. The lack of proper audit logs made it impossible to determine what data was accessed. Equifax paid $700 million in fines.',
    lessonLearned: 'Database security and comprehensive audit logging are mandatory for financial data.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Adyen',
    scenario: 'Storing billions of payment log records',
    howTheyDoIt: 'Uses PostgreSQL with custom extensions for time-series data, append-only tables, and efficient querying',
  },

  keyPoints: [
    'Use PostgreSQL for ACID compliance and JSON support',
    'Create indexes on merchant_id, timestamp, transaction_id',
    'Logs are append-only - never update or delete',
    'Partition tables by date for efficient archival',
  ],

  quickCheck: {
    question: 'What happens to in-memory payment logs when a server restarts?',
    options: [
      'They\'re automatically backed up',
      'They\'re saved to disk first',
      'They\'re completely lost - catastrophic for compliance',
      'They\'re recovered from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory data is volatile. For payment logs, this violates regulatory requirements.',
  },

  keyConcepts: [
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
    { title: 'Durability', explanation: 'Data survives crashes and power failures', icon: '🛡️' },
    { title: 'Audit Trail', explanation: 'Complete, permanent record of all events', icon: '📜' },
  ],
};

const step3: GuidedStep = {
  id: 'payment-log-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All logs need persistent, durable storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store transaction logs with ACID guarantees', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Implement Immutable Logs (Append-Only)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔐',
  scenario: "The auditors discovered a problem: some transaction logs have been modified!",
  hook: "A developer accidentally updated a log entry instead of creating a new one. Now we can't prove the original state. Auditors are threatening to fail our compliance review!",
  challenge: "Enforce immutability: logs can only be appended, never updated or deleted.",
  illustration: 'security-breach',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔒',
  message: 'Your logs are now immutable!',
  achievement: 'Append-only operations ensure audit trail integrity',
  metrics: [
    { label: 'Immutability', after: 'Enforced ✓' },
    { label: 'Audit compliance', after: '✓' },
    { label: 'Tampering', after: 'Impossible' },
  ],
  nextTeaser: "But we still can't reconcile payments against bank statements...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Immutable Logs: The Foundation of Audit Compliance',
  conceptExplanation: `**Immutability** means logs can NEVER be changed after creation.

**Why immutability matters:**
1. **Audit compliance** - Regulators require unalterable records
2. **Fraud prevention** - Can't cover tracks by modifying logs
3. **Dispute resolution** - Original evidence is preserved
4. **Trust** - Merchants trust logs haven't been tampered with

**Implementation:**
\`\`\`sql
-- WRONG: Allows updates
UPDATE transaction_logs SET status = 'failed' WHERE id = 123;

-- RIGHT: Create new log entry
INSERT INTO transaction_logs (
  transaction_id, event_type, status, timestamp, metadata
) VALUES (
  123, 'status_change', 'failed', NOW(), '{"reason": "timeout"}'
);
\`\`\`

**Database enforcement:**
- Use INSERT-only application logic
- Database triggers to prevent UPDATE/DELETE
- Append-only table storage
- Write-ahead log (WAL) for durability

**For payment logs:**
- Each status change creates a NEW log entry
- Refunds create separate log entries
- Corrections add compensating entries (like accounting)`,

  whyItMatters: 'Mutable logs:\n1. Violate PCI DSS and SOX compliance\n2. Can\'t be used as legal evidence\n3. Enable fraud and embezzlement\n4. Lead to massive fines and jail time',

  famousIncident: {
    title: 'Wirecard Accounting Fraud',
    company: 'Wirecard',
    year: '2020',
    whatHappened: 'Wirecard executives falsified transaction logs to hide €1.9 billion in missing funds. Mutable logs allowed them to cover their tracks. The fraud caused the company\'s collapse and criminal charges. Immutable logs would have prevented the fraud.',
    lessonLearned: 'Immutable audit logs are the only defense against accounting fraud.',
    icon: '🚔',
  },

  realWorldExample: {
    company: 'Coinbase',
    scenario: 'Crypto exchange with strict audit requirements',
    howTheyDoIt: 'All transaction logs are append-only with cryptographic hashing. Each log entry includes hash of previous entry, forming an immutable chain.',
  },

  keyPoints: [
    'Logs are append-only - only INSERT operations allowed',
    'Status changes create NEW log entries',
    'Enforce with database constraints and triggers',
    'Cryptographic hashing can prove logs haven\'t been tampered with',
  ],

  quickCheck: {
    question: 'Why must payment logs be immutable?',
    options: [
      'It makes queries faster',
      'To prevent fraud and meet regulatory requirements for unalterable records',
      'It saves storage space',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Immutable logs prevent tampering and fraud. Regulators require proof that records haven\'t been altered.',
  },

  keyConcepts: [
    { title: 'Immutable', explanation: 'Cannot be changed after creation', icon: '🔒' },
    { title: 'Append-Only', explanation: 'Only INSERT operations, no UPDATE/DELETE', icon: '➕' },
    { title: 'Audit Trail', explanation: 'Complete, unalterable history', icon: '📜' },
  ],
};

const step4: GuidedStep = {
  id: 'payment-log-step-4',
  stepNumber: 4,
  frIndex: 3,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-4: Enforce immutable, append-only logs',
    taskDescription: 'Update database schema and code to prevent updates/deletes',
    successCriteria: [
      'Database constraints prevent UPDATE/DELETE on logs',
      'Application code uses only INSERT for log events',
      'Status changes create new log entries',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add database triggers to prevent UPDATE and DELETE on transaction_logs table',
    level2: 'In log_event() function, only use INSERT. For status changes, INSERT a new row instead of UPDATE',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Implement Double-Entry Bookkeeping
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚖️',
  scenario: "It's month-end reconciliation time, and the books don't balance!",
  hook: "Total payments in = $10 million. Total payouts to merchants = $10.2 million. Where did the extra $200K go? Without double-entry bookkeeping, we can't find the error!",
  challenge: "Implement double-entry bookkeeping: every payment must have balanced debit and credit entries.",
  illustration: 'accounting-ledger',
};

const step5Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Your payment books always balance!',
  achievement: 'Double-entry bookkeeping enables automated reconciliation',
  metrics: [
    { label: 'Debits = Credits', after: 'Always ✓' },
    { label: 'Reconciliation', after: 'Automated ✓' },
    { label: 'Error detection', after: 'Instant' },
  ],
  nextTeaser: "But we still need compliance reports for regulators...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Double-Entry Bookkeeping: Reconciliation and Error Detection',
  conceptExplanation: `**Double-entry bookkeeping** ensures payment books always balance.

**The Core Principle:**
Every payment affects TWO accounts with equal and opposite entries.

**For a $100 card payment from Customer to Merchant:**

\`\`\`
Transaction ID: tx_12345
┌─────────────────────────────────────────────┐
│ Debit:  Customer Card/Account    -$100     │ ← Money leaving
│ Credit: Merchant Account         +$100     │ ← Money arriving
│ SUM:                              $0       │ ← Always balances!
└─────────────────────────────────────────────┘
\`\`\`

**Why this matters:**
1. **Detect errors** - If debits ≠ credits, something is wrong
2. **Prevent fraud** - Can't create money from nothing
3. **Reconciliation** - Automatically verify all transactions balance
4. **Audit trail** - See both sides of every payment

**Database Schema:**
\`\`\`
transaction_logs table:
  id, transaction_id, timestamp, event_type, status, metadata

transaction_entries table:
  id, transaction_id, account_id, amount, type (debit/credit), timestamp
\`\`\`

**For EVERY payment, we INSERT exactly 2 entries:**
1. Debit entry (negative amount)
2. Credit entry (positive amount)
Sum must equal zero.

**Reconciliation Query:**
\`\`\`sql
SELECT SUM(amount) FROM transaction_entries
WHERE date = '2024-01-15';
-- MUST return 0 (all balanced)
\`\`\``,

  whyItMatters: 'Double-entry bookkeeping prevents payment errors, detects fraud immediately, and enables automated reconciliation.',

  famousIncident: {
    title: 'Mt. Gox Bitcoin Exchange Collapse',
    company: 'Mt. Gox',
    year: '2014',
    whatHappened: 'Mt. Gox didn\'t implement proper double-entry bookkeeping. Over years, 850,000 bitcoins (worth $450 million) went missing without detection. With double-entry, the missing funds would have been caught immediately in daily reconciliation.',
    lessonLearned: 'Double-entry bookkeeping is mandatory for any system that moves value.',
    icon: '₿',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Reconciling billions in payment volume',
    howTheyDoIt: 'Every payment creates balanced double-entry records. Automated reconciliation runs continuously, alerting on any imbalance.',
  },

  keyPoints: [
    'Every payment has TWO entries: debit and credit',
    'Debits and credits must sum to zero',
    'Use transaction_entries table for both sides',
    'Daily reconciliation query verifies sum = 0',
  ],

  quickCheck: {
    question: 'If a customer pays $50 to a merchant, what entries do we create?',
    options: [
      'One entry: +$50 to merchant',
      'Two entries: -$50 from customer, +$50 to merchant',
      'Three entries: -$50 customer, +$50 merchant, $0 fee',
      'One entry: $50 payment',
    ],
    correctIndex: 1,
    explanation: 'Double-entry requires TWO entries that balance: debit customer -$50, credit merchant +$50. Sum = $0.',
  },

  keyConcepts: [
    { title: 'Debit', explanation: 'Entry that decreases balance (money leaving)', icon: '➖' },
    { title: 'Credit', explanation: 'Entry that increases balance (money arriving)', icon: '➕' },
    { title: 'Reconciliation', explanation: 'Verify all debits equal all credits', icon: '⚖️' },
  ],
};

const step5: GuidedStep = {
  id: 'payment-log-step-5',
  stepNumber: 5,
  frIndex: 4,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-5: Implement double-entry bookkeeping for all payments',
    taskDescription: 'Create transaction_entries table and update code to create balanced entries',
    successCriteria: [
      'Create transaction_entries table with: transaction_id, account_id, amount, type',
      'Every payment creates TWO entries (debit and credit)',
      'Entries always sum to zero',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Create transaction_entries table with: id, transaction_id, account_id, amount, type (debit/credit)',
    level2: 'In log_event(), for each payment create TWO entries: one debit (-amount) and one credit (+amount)',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 6: Add Compliance Reporting (Generate Reconciliation Reports)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📋',
  scenario: "The CFO needs the daily reconciliation report for auditors by 9 AM tomorrow!",
  hook: "She needs:\n- All payments processed yesterday\n- Total debits and credits (must balance)\n- Settlement breakdown by merchant\n- Any discrepancies\n\nCan your system generate this report?",
  challenge: "Implement compliance reporting: generate daily reconciliation reports that verify all transactions balance.",
  illustration: 'reporting',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-grade payment logging system!',
  achievement: 'Complete audit trail with immutability, double-entry, and compliance reporting',
  metrics: [
    { label: 'Immutable logs', after: '✓' },
    { label: 'Double-entry bookkeeping', after: '✓' },
    { label: 'Compliance reports', after: '✓' },
    { label: 'Data retention', after: '7 years' },
    { label: 'Audit trail', after: 'Complete' },
  ],
  nextTeaser: "You've mastered payment transaction logging!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Compliance Reporting: Meeting Regulatory Requirements',
  conceptExplanation: `Payment systems must generate **compliance reports** for regulators and auditors.

**Daily Reconciliation Report includes:**
1. **Transaction Summary**
   - Total payments processed
   - Total refunds issued
   - Net payment volume

2. **Double-Entry Verification**
   - Sum of all debits
   - Sum of all credits
   - Verification: debits = credits

3. **Settlement Breakdown**
   - Payments per merchant
   - Fees collected
   - Net settlements

4. **Discrepancy Detection**
   - Unbalanced transactions
   - Missing log entries
   - Duplicate transaction IDs

**SQL Query Example:**
\`\`\`sql
-- Daily reconciliation query
SELECT
  DATE(timestamp) as date,
  COUNT(*) as transaction_count,
  SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_debits,
  SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_credits,
  SUM(amount) as net_balance  -- MUST be 0
FROM transaction_entries
WHERE DATE(timestamp) = '2024-01-15'
GROUP BY DATE(timestamp);
\`\`\`

**Regulatory Requirements:**
- **PCI DSS** - Payment card industry data security
- **SOX** - Sarbanes-Oxley financial reporting
- **GDPR** - European data protection
- **Bank Secrecy Act** - Anti-money laundering

All require complete, immutable transaction logs.`,

  whyItMatters: 'Without compliance reports:\n1. Can\'t pass audits\n2. Face massive fines\n3. Lose payment processing licenses\n4. Criminal charges for executives',

  famousIncident: {
    title: 'HSBC Money Laundering Scandal',
    company: 'HSBC',
    year: '2012',
    whatHappened: 'HSBC\'s inadequate transaction monitoring and reporting systems failed to detect $881 million in money laundering. Their compliance reports were incomplete and inaccurate. HSBC paid $1.9 billion in fines - the largest banking fine in history at the time.',
    lessonLearned: 'Comprehensive transaction logging and compliance reporting are legally mandatory.',
    icon: '🏦',
  },

  realWorldExample: {
    company: 'PayPal',
    scenario: 'Processing millions of transactions daily',
    howTheyDoIt: 'Automated reconciliation runs every hour. Daily compliance reports verify all transactions balance. Any discrepancy triggers immediate investigation.',
  },

  keyPoints: [
    'Generate daily reconciliation reports automatically',
    'Verify debits = credits for all transactions',
    'Detect discrepancies immediately',
    'Retain reports for 7+ years',
  ],

  quickCheck: {
    question: 'What should the sum of all debits and credits equal in a reconciliation report?',
    options: [
      'Total payment volume',
      'Zero (debits and credits must balance)',
      'Total merchant fees',
      'Net profit',
    ],
    correctIndex: 1,
    explanation: 'Double-entry bookkeeping requires all debits to equal all credits, so sum = 0.',
  },

  keyConcepts: [
    { title: 'Reconciliation', explanation: 'Verify all transactions balance', icon: '⚖️' },
    { title: 'Compliance Report', explanation: 'Regulatory-required transaction summary', icon: '📋' },
    { title: 'Discrepancy', explanation: 'Transaction that doesn\'t balance', icon: '⚠️' },
  ],
};

const step6: GuidedStep = {
  id: 'payment-log-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Generate daily reconciliation reports for compliance',
    taskDescription: 'Implement report generation that verifies all transactions balance',
    successCriteria: [
      'Add GET /api/v1/reports/reconciliation API',
      'Implement get_reconciliation_report() function',
      'Query verifies sum of debits equals sum of credits',
      'Report includes transaction count, totals, and discrepancies',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
    requireAPIConfiguration: true,
  },

  hints: {
    level1: 'Add reconciliation report API to App Server',
    level2: 'Implement get_reconciliation_report() that queries transaction_entries and verifies sum(amount) = 0',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/reports/reconciliation'] } },
    ],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const paymentTransactionLogGuidedTutorial: GuidedTutorial = {
  problemId: 'payment-transaction-log',
  title: 'Design a Payment Transaction Log',
  description: 'Build a production-grade payment logging system with immutable logs, double-entry bookkeeping, and compliance reporting',
  difficulty: 'intermediate',
  estimatedMinutes: 35,

  welcomeStory: {
    emoji: '📝',
    hook: "You've been hired as Lead Engineer at PayFlow Inc!",
    scenario: "Your mission: Build a payment transaction logging system that captures every payment event with complete audit trails, supports reconciliation, and meets all regulatory requirements.",
    challenge: "Can you design a system with immutable logs, double-entry bookkeeping, and automated compliance reporting?",
  },

  requirementsPhase: paymentLogRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Transaction Logging',
    'Immutable Logs',
    'Append-Only Storage',
    'Double-Entry Bookkeeping',
    'Audit Trails',
    'Compliance Reporting',
    'Reconciliation',
    'ACID Transactions',
    'Data Retention',
    'PCI DSS Compliance',
    'Regulatory Requirements',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Append-only logs)',
    'Chapter 7: Transactions (ACID guarantees)',
    'Chapter 12: The Future of Data Systems (Immutability and audit logging)',
  ],
};

export default paymentTransactionLogGuidedTutorial;
