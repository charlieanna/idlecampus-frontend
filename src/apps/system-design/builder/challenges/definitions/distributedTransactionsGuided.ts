import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Distributed Transactions Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching distributed transaction patterns:
 * - Two-Phase Commit (2PC) for strong consistency
 * - Saga pattern for long-running transactions
 * - Compensation logic and eventual consistency
 * - Trade-offs between consistency and availability
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview about consistency, failures, performance)
 * Steps 1-3: Build basic 2PC implementation
 * Steps 4-6: Implement Saga pattern with compensation and eventual consistency
 *
 * Key Concepts:
 * - Distributed transactions across multiple databases
 * - Two-Phase Commit protocol (prepare, commit)
 * - Saga pattern (choreography vs orchestration)
 * - Compensating transactions
 * - Eventual consistency vs strong consistency
 * - CAP theorem trade-offs
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const distributedTransactionsRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a distributed transaction system for an e-commerce platform with multiple microservices",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Architect at GlobalCommerce Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the core operations that need to happen atomically across multiple services?",
      answer: "When a customer places an order, we need to:\n\n1. **Reserve inventory** - Decrement product stock in Inventory Service\n2. **Charge payment** - Process payment in Payment Service\n3. **Create order** - Record order in Order Service\n4. **Reserve shipping** - Allocate shipping slot in Shipping Service\n\nAll four must succeed together, or none should happen (atomicity).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Distributed transactions coordinate atomic operations across multiple independent services/databases",
    },
    {
      id: 'consistency-requirements',
      category: 'functional',
      question: "If payment succeeds but inventory reservation fails, what should happen?",
      answer: "The entire transaction must ROLL BACK! We can't charge the customer if we can't fulfill the order. This requires either:\n\n**Option 1: Strong consistency (2PC)**\n- All services agree before committing\n- Either all succeed or all fail\n- Blocks until consensus\n\n**Option 2: Eventual consistency (Saga)**\n- Services commit independently\n- Compensate on failure (refund payment)\n- Better availability, complex rollback logic",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Strong vs eventual consistency is a fundamental architectural decision",
    },
    {
      id: 'failure-handling',
      category: 'functional',
      question: "What happens if a service crashes during a transaction?",
      answer: "We need **failure recovery mechanisms**:\n\n**For 2PC:**\n- Transaction coordinator tracks state\n- Crashed services recover and check status\n- Can complete or abort on recovery\n\n**For Sagas:**\n- Failed steps trigger compensation\n- Saga log tracks progress\n- Resume or compensate on recovery\n\nCrashes can't leave the system in an inconsistent state!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Distributed systems must handle partial failures gracefully",
    },
    {
      id: 'rollback-semantics',
      category: 'functional',
      question: "Can all operations be easily rolled back? What about sending emails or external API calls?",
      answer: "This is crucial!\n\n**Reversible operations:**\n- Database writes → DELETE/UPDATE\n- Inventory reservation → Release stock\n- Payment hold → Release funds\n\n**Irreversible operations:**\n- Sending emails → Can't unsend!\n- External API calls → May not support rollback\n- Physical actions → Can't undo shipping\n\n**Solution:** Do irreversible actions LAST, after all critical steps commit.",
      importance: 'critical',
      insight: "Not all operations are reversible - design transactions carefully",
    },
    {
      id: 'isolation-requirements',
      category: 'clarification',
      question: "Can two customers order the last item in stock simultaneously?",
      answer: "We need **distributed locking** to prevent race conditions:\n\n**Approach 1:** Lock inventory during transaction\n- Use distributed lock (Redis, ZooKeeper)\n- Hold lock across all transaction phases\n- Risk: Lock held too long can reduce throughput\n\n**Approach 2:** Optimistic concurrency\n- Check inventory version on commit\n- Retry if version changed\n- Better throughput, may require retries",
      importance: 'important',
      insight: "Distributed isolation is harder than single-database isolation",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requirements',
      category: 'throughput',
      question: "How many orders per second should the system handle?",
      answer: "We need to support:\n- **5,000 orders/second** at peak (Black Friday)\n- **500 orders/second** average\n- **Each order = 4 service calls** (inventory, payment, order, shipping)\n- **Total: 20,000 service operations/second at peak**",
      importance: 'critical',
      calculation: {
        formula: "5,000 orders × 4 services = 20,000 ops/sec",
        result: "20,000 service operations/second at peak",
      },
      learningPoint: "Distributed transactions multiply network calls - latency and throughput are critical",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "How long can a customer wait for order confirmation?",
      answer: "Maximum **3 seconds** for order completion:\n- Customer clicks 'Place Order'\n- System coordinates across 4 services\n- Returns success or failure\n\n**Latency breakdown:**\n- 2PC: ~100-500ms (all services must respond)\n- Saga: ~50-200ms (async compensation acceptable)\n\nSaga pattern has better latency for user-facing operations!",
      importance: 'critical',
      learningPoint: "User-facing latency favors Saga over 2PC",
    },
    {
      id: 'availability-vs-consistency',
      category: 'burst',
      question: "If the Payment Service is down, should we still accept orders?",
      answer: "This is the **CAP theorem trade-off**!\n\n**Option 1: Favor Consistency (2PC)**\n- Reject orders if any service is unavailable\n- Guarantees atomicity\n- Lower availability\n\n**Option 2: Favor Availability (Saga)**\n- Accept order, queue payment for later\n- Compensate if payment fails\n- Higher availability, eventual consistency\n\nFor e-commerce: **Favor availability** - losing sales hurts more than occasional compensation.",
      importance: 'critical',
      learningPoint: "CAP theorem: Can't have both strong consistency AND high availability during partitions",
    },
    {
      id: 'compensation-complexity',
      category: 'payload',
      question: "How complex are compensating transactions?",
      answer: "Compensation difficulty varies:\n\n**Easy compensations:**\n- Inventory: Re-add stock\n- Payment hold: Release funds\n- Order: Mark as cancelled\n\n**Complex compensations:**\n- Partial shipment: Return logistics\n- Loyalty points: Reverse rewards\n- Promotional codes: Re-enable used codes\n\n**Non-compensable:**\n- Emails sent\n- Analytics events logged\n\nDesign Sagas to handle compensation complexity!",
      importance: 'important',
      insight: "Saga pattern requires careful design of compensating transactions",
    },
    {
      id: 'performance-vs-consistency',
      category: 'payload',
      question: "What's more important: fast order placement or guaranteed consistency?",
      answer: "**Business priority: Fast checkout with eventual consistency**\n\nWhy:\n- Cart abandonment increases with latency\n- Users accept occasional 'order failed' emails\n- Can compensate 0.1% of orders vs losing 5% to slow checkout\n\n**Decision:** Use Saga pattern for availability and speed, handle edge cases with compensation.",
      importance: 'critical',
      learningPoint: "Business requirements drive architectural decisions - not just technical purity",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'consistency-requirements', 'failure-handling'],
  criticalFRQuestionIds: ['core-operations', 'consistency-requirements', 'failure-handling'],
  criticalScaleQuestionIds: ['throughput-requirements', 'latency-requirements', 'availability-vs-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Atomic operations across services',
      description: 'Coordinate inventory, payment, order, and shipping atomically',
      emoji: '⚛️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Transaction rollback on failure',
      description: 'All operations succeed or all fail together',
      emoji: '🔄',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Failure recovery',
      description: 'System recovers from crashes mid-transaction',
      emoji: '🛡️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Compensating transactions',
      description: 'Undo operations when rollback is needed',
      emoji: '↩️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Eventual consistency',
      description: 'Accept operations that eventually become consistent',
      emoji: '⏱️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million shoppers',
    writesPerDay: '43 million orders',
    readsPerDay: '500 million product views',
    peakMultiplier: 10,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 500, peak: 5000 },
    calculatedReadRPS: { average: 5787, peak: 57870 },
    maxPayloadSize: '~5KB (order with items)',
    storagePerRecord: '~2KB (transaction log)',
    storageGrowthPerYear: '~86TB (transaction logs)',
    redirectLatencySLA: 'p99 < 3s (order placement)',
    createLatencySLA: 'p99 < 200ms (individual service call)',
  },

  architecturalImplications: [
    '✅ Need atomic operations → Use 2PC or Saga pattern',
    '✅ 5,000 orders/sec → Must minimize latency and network calls',
    '✅ Favor availability → Saga pattern preferred over 2PC',
    '✅ Compensating transactions → Design reverse operations for each step',
    '✅ Service crashes → Transaction coordinator for recovery',
    '✅ p99 < 3s → Async operations where possible',
  ],

  outOfScope: [
    'Multi-region transactions',
    'Byzantine fault tolerance',
    'Distributed deadlock detection',
    'Cross-database queries',
    'Distributed snapshots',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple 2PC coordinator to ensure atomicity. Then we'll evolve to Saga pattern for better availability and performance. Start with strong consistency, then optimize for real-world constraints!",
};

// =============================================================================
// STEP 1: Set Up Multi-Service Architecture
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏗️',
  scenario: "Welcome to GlobalCommerce! You're building their distributed transaction system.",
  hook: "The monolithic system can't scale. Engineering has split it into 4 microservices: Inventory, Payment, Order, and Shipping. Now orders need to coordinate across all of them!",
  challenge: "Set up the basic microservices architecture with a client and coordinator.",
  illustration: 'microservices-architecture',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Microservices architecture established!',
  achievement: 'Services are connected and ready for distributed transactions',
  metrics: [
    { label: 'Services deployed', after: '4' },
    { label: 'Transaction coordinator', after: 'Active' },
  ],
  nextTeaser: "But the services don't know how to coordinate transactions yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Transactions: The Multi-Service Challenge',
  conceptExplanation: `In a **microservices architecture**, each service has its own database. A single business operation might span multiple services.

**The Problem:**
Traditional ACID transactions only work within a single database. When you need atomicity across multiple databases/services, you need distributed transactions.

**E-commerce Order Example:**
1. **Inventory Service** - Reserves product stock
2. **Payment Service** - Charges customer card
3. **Order Service** - Creates order record
4. **Shipping Service** - Allocates delivery slot

All four must succeed, or all must fail. But they're independent services with separate databases!

**Solution Approaches:**
1. **Two-Phase Commit (2PC)** - Strong consistency, blocking protocol
2. **Saga Pattern** - Eventual consistency, compensation-based

We'll start with 2PC to understand the fundamentals.`,

  whyItMatters: 'Without distributed transactions, you get partial failures: charged customers with no inventory, reserved stock with no payment, etc.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Order placement across 50+ microservices',
    howTheyDoIt: 'Uses Saga pattern with Step Functions for orchestration. Each service can fail independently with automatic compensation.',
  },

  keyPoints: [
    'Microservices = separate databases, separate failure domains',
    'Business operations often span multiple services',
    'Need coordination to ensure all-or-nothing semantics',
    'Transaction coordinator manages distributed protocol',
  ],

  keyConcepts: [
    { title: 'Microservice', explanation: 'Independent service with its own database', icon: '🔧' },
    { title: 'Distributed Transaction', explanation: 'Atomic operation across multiple services', icon: '🌐' },
    { title: 'Coordinator', explanation: 'Orchestrates transaction across services', icon: '🎭' },
  ],
};

const step1: GuidedStep = {
  id: 'dist-tx-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for distributed transactions',
    taskDescription: 'Add Client, Transaction Coordinator, and 4 microservices (Inventory, Payment, Order, Shipping)',
    componentsNeeded: [
      { type: 'client', reason: 'Initiates order placement', displayName: 'Client' },
      { type: 'app_server', reason: 'Transaction Coordinator', displayName: 'Transaction Coordinator' },
      { type: 'app_server', reason: 'Inventory Service', displayName: 'Inventory Service' },
      { type: 'app_server', reason: 'Payment Service', displayName: 'Payment Service' },
      { type: 'app_server', reason: 'Order Service', displayName: 'Order Service' },
      { type: 'app_server', reason: 'Shipping Service', displayName: 'Shipping Service' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Transaction Coordinator', reason: 'Client requests orders' },
      { from: 'Transaction Coordinator', to: 'Inventory Service', reason: 'Coordinate inventory' },
      { from: 'Transaction Coordinator', to: 'Payment Service', reason: 'Coordinate payment' },
      { from: 'Transaction Coordinator', to: 'Order Service', reason: 'Coordinate order' },
      { from: 'Transaction Coordinator', to: 'Shipping Service', reason: 'Coordinate shipping' },
    ],
    successCriteria: [
      'All components added to canvas',
      'Client connected to Transaction Coordinator',
      'Coordinator connected to all 4 services',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and 5 App Servers (1 coordinator + 4 services) onto the canvas',
    level2: 'Connect Client → Coordinator, then Coordinator → each of the 4 services',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'app_server' },
      { type: 'app_server' },
      { type: 'app_server' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Two-Phase Commit - Prepare Phase
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔍',
  scenario: "First order came in! But it failed halfway...",
  hook: "Inventory was reserved, payment succeeded, but the Order Service crashed before recording the order. Customer was charged but has no order! This is unacceptable!",
  challenge: "Implement the PREPARE phase of Two-Phase Commit to check if all services can commit before actually committing.",
  illustration: 'two-phase-commit',
};

const step2Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'Prepare phase implemented!',
  achievement: 'Services now pre-validate before committing',
  metrics: [
    { label: 'Prepare requests', after: 'Implemented' },
    { label: 'Pre-validation', after: 'Active' },
    { label: 'All-or-nothing', after: '50% complete' },
  ],
  nextTeaser: "But we still need to actually commit or abort based on prepare results...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Two-Phase Commit: The Prepare Phase',
  conceptExplanation: `**Two-Phase Commit (2PC)** is a distributed consensus protocol ensuring atomic transactions.

**Phase 1: PREPARE**
The coordinator asks each service: "Can you commit this transaction?"

\`\`\`
Coordinator → Inventory: PREPARE reserve(product_id=123, qty=1)
Coordinator → Payment:   PREPARE charge(user_id=456, amount=$50)
Coordinator → Order:     PREPARE create(order_data)
Coordinator → Shipping:  PREPARE allocate(address, date)
\`\`\`

**Each service must:**
1. Check if operation is valid (has stock? card valid? shipping available?)
2. Lock resources (hold inventory, authorization on card)
3. Write to transaction log (for recovery)
4. Respond: VOTE-COMMIT or VOTE-ABORT

**Prepare Phase Rules:**
- If ANY service votes ABORT → entire transaction aborts
- If ALL services vote COMMIT → proceed to commit phase
- Services MUST hold locks until coordinator decides

**Why Prepare Phase Matters:**
Without prepare, we might commit to some services before discovering another service can't complete. Prepare ensures everyone agrees BEFORE committing anywhere.`,

  whyItMatters: 'Prepare phase prevents partial commits. All services must agree they CAN commit before ANY service actually commits.',

  famousIncident: {
    title: 'Heathrow Terminal 5 Baggage Failure',
    company: 'British Airways',
    year: '2008',
    whatHappened: 'Heathrow\'s new baggage system had distributed components that didn\'t properly coordinate. Bags were scanned but not tracked, or tracked but not routed. The lack of atomic coordination caused 42,000 bags to be mishandled in the first 10 days. Cost: £16 million.',
    lessonLearned: 'Distributed systems need coordination protocols. Can\'t just hope all components succeed independently.',
    icon: '🧳',
  },

  realWorldExample: {
    company: 'Google Spanner',
    scenario: 'Global distributed transactions',
    howTheyDoIt: 'Uses 2PC with Paxos for consensus. Prepare phase uses TrueTime API to assign globally-consistent timestamps.',
  },

  keyPoints: [
    'Phase 1: PREPARE - ask all services if they can commit',
    'Services validate, lock resources, and vote',
    'If ANY service votes ABORT, transaction aborts',
    'If ALL vote COMMIT, proceed to commit phase',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│       TWO-PHASE COMMIT: PREPARE PHASE           │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Client → Coordinator: PlaceOrder            │
│                                                 │
│  2. Coordinator → All Services: PREPARE         │
│     ┌─────────────┐                             │
│     │ Coordinator │                             │
│     └──────┬──────┘                             │
│            │                                     │
│     ┌──────┼──────┬──────────┬─────────┐       │
│     ▼      ▼      ▼          ▼         ▼       │
│   ┌───┐  ┌───┐  ┌───┐     ┌───┐               │
│   │Inv│  │Pay│  │Ord│     │Ship│               │
│   └─┬─┘  └─┬─┘  └─┬─┘     └─┬──┘              │
│     │      │      │          │                  │
│  3. Services validate and vote:                │
│     ▼      ▼      ▼          ▼                 │
│   COMMIT COMMIT COMMIT     COMMIT              │
│                                                 │
│  → All voted COMMIT, proceed to Phase 2        │
│                                                 │
│  If ANY voted ABORT:                           │
│   → Coordinator sends ABORT to all             │
│   → Services release locks and rollback        │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Prepare', explanation: 'Phase 1: Ask if services can commit', icon: '🔍' },
    { title: 'Vote', explanation: 'Service responds COMMIT or ABORT', icon: '🗳️' },
    { title: 'Lock', explanation: 'Hold resources during prepare phase', icon: '🔒' },
  ],

  quickCheck: {
    question: 'What happens if Inventory votes COMMIT but Payment votes ABORT?',
    options: [
      'Transaction commits to Inventory only',
      'Coordinator sends ABORT to all services - transaction fails',
      'Transaction retries Payment',
      'Transaction commits to both anyway',
    ],
    correctIndex: 1,
    explanation: 'If ANY service votes ABORT, the coordinator aborts the entire transaction across all services.',
  },
};

const step2: GuidedStep = {
  id: 'dist-tx-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Implement prepare phase to validate all operations before committing',
    taskDescription: 'Implement PREPARE logic in Transaction Coordinator and services',
    successCriteria: [
      'Click on Transaction Coordinator to open inspector',
      'Implement prepare() function that sends PREPARE to all services',
      'Each service validates and returns VOTE-COMMIT or VOTE-ABORT',
      'Coordinator collects all votes',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Implement prepare_transaction() in the coordinator that sends PREPARE to all 4 services',
    level2: 'Services should check if operation is valid (has inventory, payment authorized, etc.) and return vote',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Implement Two-Phase Commit - Commit Phase
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🎯',
  scenario: "All services voted COMMIT! Now we need to actually complete the transaction.",
  hook: "But what if a service crashes after voting COMMIT but before receiving the final COMMIT command? We need to handle this!",
  challenge: "Implement the COMMIT phase with proper logging and recovery mechanisms.",
  illustration: 'commit-phase',
};

const step3Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Two-Phase Commit fully implemented!',
  achievement: 'Atomic transactions across all services with crash recovery',
  metrics: [
    { label: 'Transaction atomicity', after: '100%' },
    { label: 'Crash recovery', after: 'Enabled' },
    { label: '2PC protocol', after: 'Complete' },
  ],
  nextTeaser: "But 2PC blocks under failures. What if we need better availability?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Two-Phase Commit: The Commit Phase',
  conceptExplanation: `**Phase 2: COMMIT** (or ABORT)

After all services vote, the coordinator makes the final decision:

**If all voted COMMIT:**
\`\`\`
Coordinator → All Services: COMMIT
- Services apply changes permanently
- Release locks
- Respond: ACK (acknowledgment)
\`\`\`

**If any voted ABORT:**
\`\`\`
Coordinator → All Services: ABORT
- Services rollback changes
- Release locks
- Respond: ACK
\`\`\`

**Critical: Transaction Log**
Before sending COMMIT/ABORT, coordinator writes decision to durable log:
\`\`\`
txn_id: 12345
status: COMMITTED
participants: [inventory, payment, order, shipping]
timestamp: 2024-01-15T10:30:00Z
\`\`\`

**Why logging matters:**
If coordinator crashes AFTER deciding but BEFORE sending COMMIT to all services, it must recover the decision from the log and complete the transaction.

**Failure Scenarios:**
1. **Service crashes before PREPARE**: Coordinator times out, votes ABORT
2. **Service crashes after VOTE-COMMIT**: Coordinator sends COMMIT on recovery
3. **Coordinator crashes after logging COMMIT**: Recovers and completes commit
4. **Network partition**: Services wait (blocking) until coordinator recovers

**The Blocking Problem:**
2PC blocks when coordinator crashes - services hold locks waiting for decision. This is why we need alternatives like Saga pattern.`,

  whyItMatters: 'Commit phase finalizes the transaction. Logging ensures crash recovery without data loss or inconsistency.',

  famousIncident: {
    title: 'AWS DynamoDB Service Disruption',
    company: 'Amazon DynamoDB',
    year: '2015',
    whatHappened: 'A bug in DynamoDB\'s distributed transaction coordinator caused it to timeout on commit decisions. Tables became unavailable as transactions held locks waiting for coordinator decisions. Services were blocked for hours.',
    lessonLearned: '2PC can block indefinitely if coordinator fails. Need timeouts and recovery mechanisms.',
    icon: '⏰',
  },

  realWorldExample: {
    company: 'MySQL Cluster',
    scenario: 'Distributed database with 2PC',
    howTheyDoIt: 'Uses 2PC for multi-node transactions. Coordinator writes commit decision to replicated log before sending to participants. Fast recovery on coordinator failure.',
  },

  keyPoints: [
    'Phase 2: Send COMMIT or ABORT based on votes',
    'Log decision before sending to services',
    'Services apply changes and release locks',
    'Coordinator must ensure all services complete',
    'Blocking problem: services wait if coordinator crashes',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│       TWO-PHASE COMMIT: COMMIT PHASE            │
├─────────────────────────────────────────────────┤
│                                                 │
│  After all voted COMMIT:                       │
│                                                 │
│  1. Coordinator writes decision to log         │
│     ┌─────────────┐                             │
│     │ Coordinator │                             │
│     │   (LOG:     │                             │
│     │  COMMITTED) │                             │
│     └──────┬──────┘                             │
│            │                                     │
│  2. Send COMMIT to all services                │
│     ┌──────┼──────┬──────────┬─────────┐       │
│     ▼      ▼      ▼          ▼         ▼       │
│   ┌───┐  ┌───┐  ┌───┐     ┌───┐               │
│   │Inv│  │Pay│  │Ord│     │Ship│               │
│   └─┬─┘  └─┬─┘  └─┬─┘     └─┬──┘              │
│     │      │      │          │                  │
│  3. Services commit locally:                   │
│     ▼      ▼      ▼          ▼                 │
│   DONE   DONE   DONE       DONE                │
│                                                 │
│  All services committed atomically!            │
│                                                 │
│  If coordinator crashes after logging:         │
│   → Recovers from log                          │
│   → Resends COMMIT to any missing services     │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Commit', explanation: 'Phase 2: Apply changes permanently', icon: '✅' },
    { title: 'Transaction Log', explanation: 'Durable record of coordinator decisions', icon: '📝' },
    { title: 'Blocking', explanation: '2PC blocks if coordinator crashes', icon: '🚫' },
  ],

  quickCheck: {
    question: 'Why must the coordinator log its decision before sending COMMIT?',
    options: [
      'For performance optimization',
      'To recover and complete the transaction if coordinator crashes',
      'To audit transactions',
      'To send to participants faster',
    ],
    correctIndex: 1,
    explanation: 'If coordinator crashes after deciding but before sending COMMIT, it must recover the decision from the log and complete the transaction.',
  },
};

const step3: GuidedStep = {
  id: 'dist-tx-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Implement commit/abort phase with crash recovery',
    taskDescription: 'Complete 2PC implementation with commit logic and transaction logging',
    successCriteria: [
      'Implement commit_transaction() in coordinator',
      'Log COMMIT/ABORT decision to durable storage',
      'Send COMMIT or ABORT to all services',
      'Services apply changes and acknowledge',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'After collecting votes, log decision then send COMMIT or ABORT to all services',
    level2: 'Use database or file to log decision. Services should apply changes on COMMIT, rollback on ABORT',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Introduce Saga Pattern - Sequential Saga
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🚀',
  scenario: "Your 2PC system works, but customers complain about slowness...",
  hook: "Black Friday traffic hit! 2PC is too slow - it blocks waiting for all services to prepare. Orders are timing out. Plus, when Payment Service had a 5-second hiccup, ALL orders were blocked!",
  challenge: "Implement Saga pattern for better availability and performance.",
  illustration: 'saga-pattern',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Saga pattern implemented!',
  achievement: 'Non-blocking transactions with better availability',
  metrics: [
    { label: 'Order latency', before: '800ms', after: '200ms' },
    { label: 'Blocking on failure', before: 'Yes', after: 'No' },
    { label: 'Availability', before: '95%', after: '99.5%' },
  ],
  nextTeaser: "But what happens when a saga step fails midway?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Saga Pattern: Long-Running Transactions with Compensation',
  conceptExplanation: `**Saga Pattern** is an alternative to 2PC for distributed transactions.

**Key Idea:**
Instead of locking all resources upfront (2PC), execute steps sequentially and compensate on failure.

**Saga for Order Placement:**
\`\`\`
Step 1: ReserveInventory(product_id, qty)
  ↓ success
Step 2: ChargePayment(user_id, amount)
  ↓ success
Step 3: CreateOrder(order_data)
  ↓ success
Step 4: AllocateShipping(address, date)
  ↓ SUCCESS - Order complete!
\`\`\`

**If Step 3 fails:**
\`\`\`
Step 3: CreateOrder() → FAILED
  ↓ trigger compensation
Compensate Step 2: RefundPayment()
  ↓
Compensate Step 1: ReleaseInventory()
  ↓
Order ABORTED
\`\`\`

**Saga vs 2PC:**

| Aspect | 2PC | Saga |
|--------|-----|------|
| Consistency | Strong | Eventual |
| Availability | Lower | Higher |
| Latency | Higher | Lower |
| Blocking | Yes | No |
| Complexity | Protocol | Compensation logic |

**Saga Advantages:**
- No blocking on failures
- Better availability
- Lower latency
- Each service commits independently

**Saga Challenges:**
- Must design compensating transactions
- Temporary inconsistency visible
- Compensation might fail (need retries)`,

  whyItMatters: 'Saga pattern favors availability over consistency - critical for user-facing e-commerce systems where blocking is unacceptable.',

  famousIncident: {
    title: 'Uber Trip Cancellation Race',
    company: 'Uber',
    year: '2016',
    whatHappened: 'Uber used Saga pattern for ride booking. A bug allowed drivers to accept rides that were being cancelled. The saga steps executed: (1) Match driver, (2) Charge rider, (3) Start trip. If rider cancelled during (2), compensation didn\'t properly handle active trips. Riders were charged for rides they cancelled.',
    lessonLearned: 'Saga compensations must handle all edge cases, including concurrent operations.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Account signup saga across multiple services',
    howTheyDoIt: 'Uses AWS Step Functions to orchestrate sagas. Each step has a compensating transaction. If email verification fails after payment, they refund the charge automatically.',
  },

  keyPoints: [
    'Saga = sequence of local transactions with compensation',
    'Each step commits independently (no locks across steps)',
    'On failure, execute compensating transactions in reverse',
    'Eventual consistency instead of strong consistency',
    'Better availability and performance than 2PC',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         SAGA PATTERN: SEQUENTIAL                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Success Path:                                 │
│    Reserve  →  Charge  →  Create  →  Ship      │
│   Inventory   Payment    Order                  │
│      ✓          ✓         ✓         ✓          │
│                                                 │
│  Failure Path (Charge fails):                  │
│    Reserve  →  Charge  ✗                       │
│   Inventory   Payment                           │
│      ✓          ✗                               │
│      │                                           │
│      ▼ Compensate                               │
│    Release                                      │
│   Inventory                                     │
│      ✓                                           │
│                                                 │
│  → Order aborted, inventory released            │
│  → Customer sees "Payment failed" message       │
│  → Can retry order                              │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Saga', explanation: 'Sequence of local transactions', icon: '🔄' },
    { title: 'Compensation', explanation: 'Undo transaction (reverse operation)', icon: '↩️' },
    { title: 'Eventual Consistency', explanation: 'System becomes consistent over time', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'What is the main advantage of Saga over 2PC?',
    options: [
      'Saga provides stronger consistency',
      'Saga is easier to implement',
      'Saga does not block on failures - better availability',
      'Saga is always faster',
    ],
    correctIndex: 2,
    explanation: 'Saga does not block when services fail. Each step commits independently, so the system remains available.',
  },
};

const step4: GuidedStep = {
  id: 'dist-tx-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-5: Implement Saga pattern for eventual consistency and better availability',
    taskDescription: 'Convert coordinator to Saga orchestrator with sequential steps',
    successCriteria: [
      'Implement saga_execute() that runs steps sequentially',
      'Each step commits independently',
      'Track saga state (completed steps)',
      'No blocking on service failures',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Implement saga orchestrator that executes: ReserveInventory → ChargePayment → CreateOrder → AllocateShipping',
    level2: 'Each step should commit to its service database immediately. Track completed steps in saga log.',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Implement Compensating Transactions
// =============================================================================

const step5Story: StoryContent = {
  emoji: '↩️',
  scenario: "A saga is running smoothly until step 3 fails...",
  hook: "Inventory reserved, payment charged, but Order Service crashed! Customer is charged but has no order. The saga is stuck halfway! We need to rollback!",
  challenge: "Implement compensating transactions to undo completed saga steps.",
  illustration: 'compensation',
};

const step5Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Compensation logic complete!',
  achievement: 'Failed sagas automatically rollback with compensating transactions',
  metrics: [
    { label: 'Compensation handlers', after: '4' },
    { label: 'Automatic rollback', after: 'Enabled' },
    { label: 'Partial failure handling', after: '100%' },
  ],
  nextTeaser: "But what if compensation itself fails?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Compensating Transactions: Undoing Distributed Changes',
  conceptExplanation: `**Compensating Transaction** = the reverse operation that undoes a saga step.

**For each forward transaction, design a compensation:**

| Forward Transaction | Compensating Transaction |
|---------------------|--------------------------|
| ReserveInventory(item, qty) | ReleaseInventory(item, qty) |
| ChargePayment(user, amount) | RefundPayment(user, amount) |
| CreateOrder(order_data) | CancelOrder(order_id) |
| AllocateShipping(slot) | ReleaseShippingSlot(slot) |

**Compensation Rules:**

1. **Idempotent**: Can run multiple times safely
   \`\`\`python
   # Bad - can over-refund
   balance += amount

   # Good - idempotent
   if not already_refunded(txn_id):
       balance += amount
       mark_refunded(txn_id)
   \`\`\`

2. **Retriable**: Must eventually succeed
   - Store in retry queue if fails
   - Exponential backoff
   - Manual intervention for permanent failures

3. **Semantic Compensation**: Sometimes can't truly undo
   - Can't unsend email → Send apology email
   - Can't undo shipped package → Initiate return process
   - Can't revoke printed ticket → Invalidate ticket

**Compensation Order:**
Execute compensations in REVERSE order of saga steps:
\`\`\`
Forward:  Step1 → Step2 → Step3 → Step4 [FAIL]
Backward: Comp3 ← Comp2 ← Comp1 ←
\`\`\`

**Compensation Failure:**
If compensation fails, retry until success. Never give up - system MUST eventually reach consistency.`,

  whyItMatters: 'Without proper compensation, failed sagas leave system in inconsistent state - inventory reserved forever, charges never refunded.',

  famousIncident: {
    title: 'Ticketmaster Booking Saga Failure',
    company: 'Ticketmaster',
    year: '2019',
    whatHappened: 'During a Taylor Swift concert sale, their saga-based booking system failed to properly compensate when payment authorization expired. Thousands of fans had "phantom" seats reserved that they couldn\'t pay for, while the website showed "sold out" to other customers. The reservations should have been released (compensated) after payment failure.',
    lessonLearned: 'Compensating transactions must be reliable and monitored. Timeouts should trigger compensation.',
    icon: '🎫',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Booking cancellation saga',
    howTheyDoIt: 'When guest cancels: (1) Release calendar dates, (2) Calculate refund based on policy, (3) Process refund, (4) Notify host. Each step has compensation in case of failure.',
  },

  keyPoints: [
    'Every saga step needs a compensating transaction',
    'Compensations execute in reverse order',
    'Must be idempotent and retriable',
    'Some operations need semantic compensation',
    'Never give up on compensation - retry until success',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         SAGA COMPENSATION                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Saga Execution:                               │
│    Step 1: Reserve Inventory      ✓            │
│    Step 2: Charge Payment         ✓            │
│    Step 3: Create Order           ✗ FAILED     │
│                                                 │
│  Compensation (reverse order):                 │
│    Comp 2: Refund Payment         ✓            │
│    Comp 1: Release Inventory      ✓            │
│                                                 │
│  Final State:                                  │
│    - Inventory available again                 │
│    - Payment refunded                          │
│    - No order created                          │
│    - Customer notified of failure              │
│                                                 │
│  If Comp 2 fails:                              │
│    → Retry with exponential backoff            │
│    → Alert on-call engineer                    │
│    → System must not proceed until resolved    │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Compensation', explanation: 'Transaction that reverses a saga step', icon: '↩️' },
    { title: 'Idempotent', explanation: 'Can execute multiple times safely', icon: '🔁' },
    { title: 'Semantic Undo', explanation: 'Compensating action when true undo impossible', icon: '🎭' },
  ],

  quickCheck: {
    question: 'Why must compensating transactions be idempotent?',
    options: [
      'To make them faster',
      'Because they might be retried multiple times if they fail',
      'To save storage space',
      'To reduce network calls',
    ],
    correctIndex: 1,
    explanation: 'Compensations may fail and be retried. Idempotency ensures multiple executions produce the same result.',
  },
};

const step5: GuidedStep = {
  id: 'dist-tx-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Implement compensating transactions for all saga steps',
    taskDescription: 'Add compensation handlers for each service',
    successCriteria: [
      'Implement ReleaseInventory() compensation',
      'Implement RefundPayment() compensation',
      'Implement CancelOrder() compensation',
      'Implement ReleaseShippingSlot() compensation',
      'Execute compensations in reverse order on failure',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'For each saga step, implement its reverse operation (compensation)',
    level2: 'When a step fails, call compensations for all completed steps in reverse order',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Saga Orchestration with Event Sourcing
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📜',
  scenario: "Your saga orchestrator just crashed mid-saga!",
  hook: "When it restarted, it had no idea which steps completed and which compensations to run. Some customers got double-charged, others got free inventory!",
  challenge: "Implement saga event sourcing to track state and recover from crashes.",
  illustration: 'event-sourcing',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎊',
  message: 'Production-ready distributed transactions!',
  achievement: 'Complete saga implementation with crash recovery and monitoring',
  metrics: [
    { label: 'Saga pattern', after: 'Complete' },
    { label: 'Event sourcing', after: 'Enabled' },
    { label: 'Crash recovery', after: '100%' },
    { label: 'Order success rate', before: '95%', after: '99.9%' },
  ],
  nextTeaser: "You've mastered distributed transactions!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Saga Orchestration with Event Sourcing',
  conceptExplanation: `**Event Sourcing** for sagas = store every state change as an immutable event.

**Saga Event Log:**
\`\`\`
saga_id: 12345
events:
  - { timestamp: T0, event: SagaStarted }
  - { timestamp: T1, event: Step1_ReserveInventory_Started }
  - { timestamp: T2, event: Step1_ReserveInventory_Completed }
  - { timestamp: T3, event: Step2_ChargePayment_Started }
  - { timestamp: T4, event: Step2_ChargePayment_Completed }
  - { timestamp: T5, event: Step3_CreateOrder_Started }
  - { timestamp: T6, event: Step3_CreateOrder_Failed }
  - { timestamp: T7, event: Compensation2_RefundPayment_Started }
  - { timestamp: T8, event: Compensation2_RefundPayment_Completed }
  - { timestamp: T9, event: Compensation1_ReleaseInventory_Started }
  - { timestamp: T10, event: Compensation1_ReleaseInventory_Completed }
  - { timestamp: T11, event: SagaAborted }
\`\`\`

**Benefits:**

1. **Crash Recovery**
   - Orchestrator crashes at T6
   - On restart, reads event log
   - Sees Step3 failed, Step2 and Step1 completed
   - Resumes compensation from where it left off

2. **Audit Trail**
   - Complete history of saga execution
   - Debug why sagas fail
   - Regulatory compliance

3. **Replay and Testing**
   - Replay events to reproduce bugs
   - Test compensation logic

4. **Monitoring**
   - Track saga success/failure rates
   - Identify bottleneck steps
   - Alert on stuck sagas

**Implementation:**
\`\`\`python
class SagaOrchestrator:
    def execute_saga(self, saga_id, steps):
        self.log_event(saga_id, "SagaStarted")

        completed_steps = []
        for i, step in enumerate(steps):
            self.log_event(saga_id, f"Step{i}_Started")
            try:
                result = step.execute()
                self.log_event(saga_id, f"Step{i}_Completed", result)
                completed_steps.append(step)
            except Exception as e:
                self.log_event(saga_id, f"Step{i}_Failed", str(e))
                self.compensate(saga_id, completed_steps)
                return

        self.log_event(saga_id, "SagaCompleted")
\`\`\``,

  whyItMatters: 'Event sourcing provides crash recovery, audit trails, and debuggability - essential for production saga systems.',

  famousIncident: {
    title: 'Stripe Payment Saga Debugging',
    company: 'Stripe',
    year: '2020',
    whatHappened: 'Stripe had a bug where some payment sagas got stuck in "pending" state forever. Without event sourcing, they couldn\'t debug what happened. They rebuilt event sourcing for all payment sagas. Now they can trace every step and automatically recover stuck transactions.',
    lessonLearned: 'Event sourcing is critical for debugging and recovering distributed transactions in production.',
    icon: '💳',
  },

  realWorldExample: {
    company: 'Amazon Step Functions',
    scenario: 'Managed saga orchestration service',
    howTheyDoIt: 'Automatically logs every state transition. Provides visual timeline of saga execution. Can resume from any point on failure.',
  },

  keyPoints: [
    'Log every saga event to durable storage',
    'Events are immutable and append-only',
    'Enables crash recovery by replaying events',
    'Provides complete audit trail',
    'Essential for debugging production sagas',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         SAGA EVENT SOURCING                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Saga Event Log (append-only):                │
│  ┌───────────────────────────────────────┐     │
│  │ T0: SagaStarted                       │     │
│  │ T1: Step1_Started                     │     │
│  │ T2: Step1_Completed                   │     │
│  │ T3: Step2_Started                     │     │
│  │ T4: Step2_Completed                   │     │
│  │ T5: Step3_Started                     │     │
│  │ T6: [CRASH - orchestrator died]       │     │
│  └───────────────────────────────────────┘     │
│                                                 │
│  Recovery on restart:                          │
│  1. Read event log                             │
│  2. See Step1 and Step2 completed             │
│  3. Step3 started but not completed           │
│  4. Resume: either retry Step3 or compensate   │
│                                                 │
│  Continue execution:                           │
│  ┌───────────────────────────────────────┐     │
│  │ T7: Step3_Completed (on retry)        │     │
│  │ T8: Step4_Started                     │     │
│  │ T9: Step4_Completed                   │     │
│  │ T10: SagaCompleted                    │     │
│  └───────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Event Sourcing', explanation: 'Store state as sequence of events', icon: '📜' },
    { title: 'Immutable Log', explanation: 'Events never change, only append', icon: '🔒' },
    { title: 'Replay', explanation: 'Reconstruct state by replaying events', icon: '▶️' },
  ],

  quickCheck: {
    question: 'How does event sourcing enable crash recovery for sagas?',
    options: [
      'It prevents crashes from happening',
      'It stores completed steps so orchestrator can resume where it left off',
      'It automatically retries failed steps',
      'It makes sagas faster',
    ],
    correctIndex: 1,
    explanation: 'Event log records completed steps. On crash, orchestrator reads the log and resumes from the last recorded state.',
  },
};

const step6: GuidedStep = {
  id: 'dist-tx-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Add event sourcing for saga crash recovery and monitoring',
    taskDescription: 'Implement saga event logging and recovery',
    successCriteria: [
      'Add Database to store saga events',
      'Connect orchestrator to database',
      'Log every saga state change',
      'Implement recovery logic that reads event log',
      'Resume or compensate based on event history',
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
  },

  hints: {
    level1: 'Add Database for saga event log. Log events before and after each step.',
    level2: 'On orchestrator restart, read event log to determine which steps completed and resume from there',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const distributedTransactionsGuidedTutorial: GuidedTutorial = {
  problemId: 'distributed-transactions-guided',
  problemTitle: 'Design a Distributed Transaction System',

  requirementsPhase: distributedTransactionsRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Distributed Transaction',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Verify atomic operations across all services',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Transaction Rollback',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Verify rollback when any service fails',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 60,
      failureInjection: { type: 'service_failure', service: 'payment', atSecond: 30 },
      passCriteria: { maxErrorRate: 0, noPartialCommits: true },
    },
    {
      name: 'High Throughput Orders',
      type: 'performance',
      requirement: 'Throughput',
      description: 'Handle 5,000 orders/second at peak',
      traffic: { type: 'write', rps: 5000, writeRps: 5000 },
      duration: 60,
      passCriteria: { maxP99Latency: 3000, maxErrorRate: 0.01 },
    },
    {
      name: 'Saga Compensation',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Verify compensating transactions execute on failure',
      traffic: { type: 'write', rps: 500, writeRps: 500 },
      duration: 60,
      failureInjection: { type: 'service_failure', service: 'order', atSecond: 30 },
      passCriteria: { compensationsExecuted: true, noDataLoss: true },
    },
    {
      name: 'Crash Recovery',
      type: 'reliability',
      requirement: 'FR-3',
      description: 'Orchestrator crashes mid-saga and recovers',
      traffic: { type: 'write', rps: 1000, writeRps: 1000 },
      duration: 120,
      failureInjection: { type: 'coordinator_crash', atSecond: 60, recoverySecond: 90 },
      passCriteria: { sagasCompleted: true, noDataLoss: true, maxErrorRate: 0.05 },
    },
    {
      name: 'Eventual Consistency',
      type: 'functional',
      requirement: 'FR-5',
      description: 'System reaches consistency after failures',
      traffic: { type: 'write', rps: 500, writeRps: 500 },
      duration: 180,
      failureInjection: { type: 'intermittent_failures', services: ['inventory', 'payment'] },
      passCriteria: { eventuallyConsistent: true, maxInconsistencyWindow: 30 },
    },
  ] as TestCase[],
};

export function getDistributedTransactionsGuidedTutorial(): GuidedTutorial {
  return distributedTransactionsGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = distributedTransactionsRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= distributedTransactionsRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
