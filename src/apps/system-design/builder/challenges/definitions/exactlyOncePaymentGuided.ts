import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Exactly-Once Payment Processing Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching distributed transaction concepts
 * through building a payment processing system with exactly-once guarantees.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (idempotency, sagas, distributed transactions)
 *
 * Key Concepts:
 * - Idempotency keys
 * - Deduplication strategies
 * - Distributed transactions (2PC, Saga pattern)
 * - Payment state machines
 * - Exactly-once semantics
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const exactlyOncePaymentRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a payment processing system with exactly-once guarantees",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Senior Staff Engineer, Payments Infrastructure',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-payment-flow',
      category: 'functional',
      question: "What's the core payment flow we need to support?",
      answer: "Users need to:\n\n1. **Initiate payment** - Submit payment details (amount, currency, payment method)\n2. **Process payment** - Authorize with payment gateway, reserve funds\n3. **Complete payment** - Capture funds, update order status\n4. **Handle failures** - Retry safely without double-charging",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Payment processing is a multi-step workflow that must be atomic",
    },
    {
      id: 'exactly-once-guarantee',
      category: 'functional',
      question: "What happens if a user accidentally clicks 'Pay' twice?",
      answer: "This is THE critical requirement! We must guarantee **exactly-once processing**:\n- Same request twice → process once, return same result\n- Use **idempotency keys** - unique identifier per payment intent\n- Deduplicate requests within a time window\n- Never charge a customer twice for the same purchase",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Exactly-once semantics prevent duplicate charges - the core challenge of payment systems",
    },
    {
      id: 'payment-states',
      category: 'functional',
      question: "What states can a payment be in?",
      answer: "Payments follow a state machine:\n\n1. **Pending** - Payment initiated, not yet processed\n2. **Authorized** - Funds reserved, not captured\n3. **Succeeded** - Funds captured successfully\n4. **Failed** - Payment rejected (insufficient funds, etc.)\n5. **Refunded** - Payment reversed\n\nTransitions must be atomic and idempotent!",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "State machines prevent invalid transitions and enable safe retries",
    },
    {
      id: 'refunds',
      category: 'functional',
      question: "How do we handle refunds and cancellations?",
      answer: "Users need to:\n- **Cancel** pending payments (before capture)\n- **Refund** completed payments (full or partial)\n- Refunds must also be idempotent (same refund key = same result)\n- Support multiple partial refunds up to original amount",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Refunds are reverse payments - same exactly-once guarantees apply",
    },

    // CLARIFICATIONS
    {
      id: 'payment-methods',
      category: 'clarification',
      question: "What payment methods should we support?",
      answer: "For MVP:\n- **Credit/debit cards** (primary focus)\n- **Digital wallets** can come later\n- Focus on card payment flow: authorize → capture pattern",
      importance: 'important',
      insight: "Card payments use 2-phase commit: authorize reserves funds, capture completes",
    },
    {
      id: 'distributed-nature',
      category: 'clarification',
      question: "Are we dealing with multiple services or a monolith?",
      answer: "This is a **distributed system**:\n- Payment Service\n- Order Service (tracks order status)\n- Inventory Service (reserves stock)\n- Notification Service (sends receipts)\n\nAll must stay consistent - if payment succeeds, order completes, inventory decreases, notification sent.",
      importance: 'critical',
      insight: "Distributed transactions require saga pattern or 2PC for consistency",
    },

    // SCALE & NFRs
    {
      id: 'throughput-payments',
      category: 'throughput',
      question: "How many payment transactions per day?",
      answer: "1 million payments per day at steady state, with spikes to 5 million during sales events",
      importance: 'critical',
      calculation: {
        formula: "1M ÷ 86,400 sec = 12 payments/sec average",
        result: "~12 TPS average, ~60 TPS peak",
      },
      learningPoint: "Payment systems have bursty traffic - flash sales create massive spikes",
    },
    {
      id: 'throughput-retries',
      category: 'throughput',
      question: "What about retry traffic?",
      answer: "Network failures and timeouts mean ~20% of requests are retries. So effective traffic is 1.2x base rate:\n- 14 TPS average (with retries)\n- 72 TPS peak (with retries)\n\nIdempotency keys prevent duplicates!",
      importance: 'critical',
      learningPoint: "Retries are inevitable - deduplication is mandatory",
    },
    {
      id: 'latency-payment',
      category: 'latency',
      question: "What's acceptable latency for payment processing?",
      answer: "p99 under 2 seconds for complete payment flow. Users wait at checkout - but they understand payments take a moment.",
      importance: 'critical',
      learningPoint: "Payment latency includes external gateway calls - budget accordingly",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "What consistency guarantees do we need?",
      answer: "**Strong consistency** is mandatory:\n- Payment succeeds → Order MUST complete\n- Payment fails → Order MUST be cancelled\n- No partial states allowed\n- ACID transactions where possible\n- Saga pattern for distributed transactions",
      importance: 'critical',
      learningPoint: "Financial systems require strong consistency - eventual consistency causes money loss",
    },
    {
      id: 'duplicate-detection',
      category: 'reliability',
      question: "How long should we deduplicate requests?",
      answer: "Store idempotency keys for **24 hours**:\n- Covers all retry scenarios\n- After 24h, user can resubmit same payment intent\n- Balance between safety and storage",
      importance: 'critical',
      insight: "Idempotency window must cover max retry period plus buffer",
    },
    {
      id: 'failure-scenarios',
      category: 'reliability',
      question: "What failures should we handle?",
      answer: "Must handle:\n1. **Network timeouts** - retry with same idempotency key\n2. **Database failures** - use transactions, rollback on error\n3. **Payment gateway failures** - retry with exponential backoff\n4. **Partial failures** - one service succeeds, another fails\n5. **Duplicate detection** - same request arrives twice simultaneously",
      importance: 'critical',
      learningPoint: "Distributed systems have many failure modes - idempotency and sagas handle them all",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-payment-flow', 'exactly-once-guarantee', 'distributed-nature'],
  criticalFRQuestionIds: ['core-payment-flow', 'exactly-once-guarantee', 'payment-states'],
  criticalScaleQuestionIds: ['throughput-payments', 'consistency-requirements', 'duplicate-detection'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Process payments',
      description: 'Initiate, authorize, and capture payment transactions',
      emoji: '💳',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Track payment state',
      description: 'Maintain payment state machine (pending → authorized → succeeded/failed)',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Exactly-once processing',
      description: 'Deduplicate requests using idempotency keys - never double-charge',
      emoji: '🔑',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Distributed consistency',
      description: 'Keep Payment, Order, and Inventory services consistent',
      emoji: '🔄',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Handle refunds',
      description: 'Process refunds and cancellations idempotently',
      emoji: '↩️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500,000 buyers',
    writesPerDay: '1 million payments',
    readsPerDay: '5 million status checks',
    peakMultiplier: 5,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 12, peak: 60 },
    calculatedReadRPS: { average: 58, peak: 290 },
    maxPayloadSize: '~3KB (payment request)',
    storagePerRecord: '~1KB (transaction)',
    storageGrowthPerYear: '~365GB',
    redirectLatencySLA: 'p99 < 2s (payment processing)',
    createLatencySLA: 'p99 < 100ms (status check)',
  },

  architecturalImplications: [
    '✅ Exactly-once → Idempotency keys stored in cache + database',
    '✅ Distributed txns → Saga pattern for cross-service consistency',
    '✅ Strong consistency → Use ACID transactions where possible',
    '✅ Retry safety → Idempotent APIs with deduplication',
    '✅ State management → State machine prevents invalid transitions',
    '✅ Failure handling → Compensating transactions for rollback',
  ],

  outOfScope: [
    'Multi-currency support',
    'Fraud detection',
    'PCI DSS vault implementation',
    'Chargeback handling',
    'Subscription billing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple payment flow with state tracking. Then we'll add idempotency, deduplication, and finally the saga pattern for distributed transactions. Functionality first, then bulletproofing!",
};

// =============================================================================
// STEP 1: Connect Client to Payment Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💳',
  scenario: "Welcome to PaymentCo! You're building a payment processing system.",
  hook: "A customer just tried to checkout, but there's no server to handle their payment!",
  challenge: "Set up the basic request flow so clients can reach your payment service.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Payment service is online!',
  achievement: 'Clients can now send payment requests to your service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process payments yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Payment API',
  conceptExplanation: `Every payment system starts with a **Client** connecting to a **Payment Service**.

When a customer checks out:
1. Their application (web/mobile) is the **Client**
2. It sends HTTPS POST requests to your **Payment Service**
3. The service processes the payment and returns success/failure

This is the foundation of ALL payment processing systems!`,

  whyItMatters: 'Without this connection, customers can\'t make any payments at all.',

  keyPoints: [
    'Client = customer\'s application making payment requests',
    'Payment Service = your backend that processes payments',
    'HTTPS = secure protocol for sensitive payment data',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Customer application making payment requests', icon: '📱' },
    { title: 'Payment Service', explanation: 'Backend that handles payment logic', icon: '🖥️' },
    { title: 'HTTPS', explanation: 'Encrypted protocol for secure payment data', icon: '🔒' },
  ],
};

const step1: GuidedStep = {
  id: 'exactly-once-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for payment processing',
    taskDescription: 'Add a Client and App Server (Payment Service), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers making payments', displayName: 'Client' },
      { type: 'app_server', reason: 'Payment Service that processes requests', displayName: 'Payment Service' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server (Payment Service) added to canvas',
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
// STEP 2: Implement Payment State Machine (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📊',
  scenario: "Your payment service is connected, but it's just an empty shell!",
  hook: "A customer tried to pay, but got an error. We need to implement the payment state machine.",
  challenge: "Write Python code to handle payment states: pending → authorized → succeeded/failed.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Payment state machine is working!',
  achievement: 'You implemented the core payment processing logic',
  metrics: [
    { label: 'Payment states', after: 'Implemented' },
    { label: 'State transitions', after: '✓' },
    { label: 'Can process payments', after: '✓' },
  ],
  nextTeaser: "But what happens if a customer clicks 'Pay' twice?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Payment State Machines: Managing Payment Lifecycle',
  conceptExplanation: `Payments aren't instant - they go through multiple states.

**Payment State Machine:**
\`\`\`
pending → authorized → succeeded
                    └→ failed
\`\`\`

**Why states matter:**
1. **Pending**: Payment initiated, not yet sent to gateway
2. **Authorized**: Funds reserved (held on card)
3. **Succeeded**: Funds captured (money transferred)
4. **Failed**: Payment rejected (insufficient funds, etc.)

**Critical rules:**
- State transitions must be atomic (all-or-nothing)
- Invalid transitions must be rejected
- Each state change is stored durably`,

  whyItMatters: 'Without state management, you can\'t handle failures, retries, or refunds safely.',

  famousIncident: {
    title: 'Target Canada Double-Charge Bug',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target Canada\'s payment system had a race condition that allowed payments to transition from pending to succeeded twice. Customers were double-charged, causing massive PR damage and contributing to Target\'s exit from Canada.',
    lessonLearned: 'State machines with atomic transitions prevent invalid state changes.',
    icon: '🎯',
  },

  keyPoints: [
    'Payments follow a state machine: pending → authorized → succeeded/failed',
    'Transitions must be atomic and validated',
    'Store state changes durably for audit trail',
    'Invalid transitions (e.g., succeeded → pending) must be rejected',
  ],

  keyConcepts: [
    { title: 'State Machine', explanation: 'Defined states and valid transitions between them', icon: '⚙️' },
    { title: 'Atomic Transition', explanation: 'State change is all-or-nothing, never partial', icon: '⚛️' },
    { title: 'Idempotent', explanation: 'Same transition request → same result', icon: '🔁' },
  ],
};

const step2: GuidedStep = {
  id: 'exactly-once-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Process payments, FR-2: Track payment state',
    taskDescription: 'Configure APIs and implement Python handlers for payment state management',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/payments, GET /api/v1/payments/:id APIs',
      'Open the Python tab',
      'Implement create_payment() and get_payment_status() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign payment endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_payment and get_payment_status',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/payments', 'GET /api/v1/payments/:id'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Payment Records
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed during a payment...",
  hook: "When it restarted, the payment state was GONE! The customer was charged but we have no record of it. This is a financial nightmare!",
  challenge: "Add a database so payment records survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Payment records are safe!',
  achievement: 'Payment data now persists with ACID guarantees',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'ACID compliance', after: '✓' },
    { label: 'Payment durability', after: '100%' },
  ],
  nextTeaser: "But if the same payment request comes twice, we'll charge the customer twice...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Are Critical for Payments',
  conceptExplanation: `For payment systems, losing data is **catastrophic and illegal**.

A **database** provides:
- **Durability**: Payment records survive crashes
- **ACID guarantees**: Atomicity, Consistency, Isolation, Durability
- **Audit trail**: Immutable records for compliance
- **State persistence**: Payment state machine survives restarts

For payments, we need tables for:
- \`payments\` - All payment attempts and their state
- \`idempotency_keys\` - Deduplication records
- \`transactions\` - Audit log of state changes
- \`refunds\` - Refund records linked to payments`,

  whyItMatters: 'Losing payment data means:\n1. Can\'t prove payment happened\n2. No audit trail for regulators\n3. Can\'t process refunds\n4. Customers lose trust',

  famousIncident: {
    title: 'Natwest Banking Outage',
    company: 'Natwest (RBS)',
    year: '2012',
    whatHappened: 'A failed software update corrupted Natwest\'s payment database. For 3 weeks, customers couldn\'t access accounts, payments were lost, and transactions were duplicated. The bank was fined £56 million.',
    lessonLearned: 'Database reliability for payments is non-negotiable. Always have ACID guarantees and backups.',
    icon: '🏦',
  },

  keyPoints: [
    'Payment databases MUST be ACID-compliant',
    'Use PostgreSQL for strong consistency guarantees',
    'Store payment state transitions as immutable log',
    'Never delete payment records - use soft deletes',
  ],

  keyConcepts: [
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
    { title: 'Durability', explanation: 'Data survives crashes and power failures', icon: '🛡️' },
    { title: 'Audit Trail', explanation: 'Immutable records for compliance', icon: '📜' },
  ],
};

const step3: GuidedStep = {
  id: 'exactly-once-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent, ACID-compliant storage',
    taskDescription: 'Add a Database and connect the Payment Service to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store payments, states, idempotency keys with ACID guarantees', displayName: 'PostgreSQL' },
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
// STEP 4: Add Idempotency Keys for Deduplication
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔑',
  scenario: "A customer's network glitched. They clicked 'Pay' - it timed out. They clicked again.",
  hook: "YOUR SYSTEM CHARGED THEM TWICE! Same payment, same amount, but no deduplication. The customer is furious and demanding a refund.",
  challenge: "Implement idempotency keys so the same payment request never charges twice.",
  illustration: 'duplicate-charge',
};

const step4Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Duplicate charges are now prevented!',
  achievement: 'Idempotency keys ensure exactly-once processing',
  metrics: [
    { label: 'Duplicate detection', after: 'Enabled' },
    { label: 'Deduplication window', after: '24 hours' },
    { label: 'Double charges prevented', after: '100%' },
  ],
  nextTeaser: "Great! But checking the database for every duplicate is slow...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Idempotency Keys: The Heart of Exactly-Once Processing',
  conceptExplanation: `**The Problem:**
Client sends: "Pay $100 with card 1234"
Network timeout → client retries
Server receives request TWICE → charges customer $200!

**The Solution: Idempotency Keys**
Client generates unique key: \`idem_abc123xyz\`
Every request includes this key.

**How it works:**
\`\`\`
1. Request arrives with key: idem_abc123xyz
2. Check: Have we seen this key before?
   - YES → Return cached result (don't charge again!)
   - NO → Process payment, store key + result
3. Store key for 24 hours
\`\`\`

**Critical implementation details:**
- Client generates key (UUID or hash of request)
- Server stores: idempotency_key → payment_result
- Store for 24 hours (covers all retry scenarios)
- Use database transactions to prevent race conditions`,

  whyItMatters: 'Without idempotency, retries cause duplicate charges. This is the #1 payment system bug.',

  famousIncident: {
    title: 'Citibank $900M Duplicate Payment',
    company: 'Citibank',
    year: '2020',
    whatHappened: 'A Citibank employee meant to make a $7.8M interest payment on a loan. Due to a UI bug and lack of idempotency checks, they accidentally sent $900 million to lenders. The court ruled they couldn\'t get it back!',
    lessonLearned: 'Idempotency isn\'t optional - it prevents catastrophic financial errors.',
    icon: '🏛️',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing millions of payments daily',
    howTheyDoIt: 'Every API request includes an Idempotency-Key header. Stripe stores keys in Redis + PostgreSQL for 24 hours. Same key = same response.',
  },

  keyPoints: [
    'Client generates unique idempotency key per payment intent',
    'Server checks key before processing payment',
    'Store key → result mapping for 24 hours',
    'Use database transactions to prevent race conditions',
    'Return cached result for duplicate keys',
  ],

  diagram: `
┌─────────────────────────────────────────────────────────┐
│            IDEMPOTENCY KEY FLOW                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  REQUEST 1:                                             │
│  POST /payments                                         │
│  Idempotency-Key: idem_abc123                           │
│  { amount: 100, card: "1234" }                          │
│                                                         │
│  ┌─────────────┐                                        │
│  │   Server    │                                        │
│  └──────┬──────┘                                        │
│         │ 1. Check: idem_abc123 exists?                 │
│         │    → NO (first time)                          │
│         │ 2. Process payment → SUCCESS                  │
│         │ 3. Store: idem_abc123 → {id:1, status:success}│
│         │ 4. Return: {id:1, status:success}             │
│                                                         │
│  REQUEST 2 (retry after network timeout):               │
│  POST /payments                                         │
│  Idempotency-Key: idem_abc123                           │
│  { amount: 100, card: "1234" }                          │
│                                                         │
│  ┌─────────────┐                                        │
│  │   Server    │                                        │
│  └──────┬──────┘                                        │
│         │ 1. Check: idem_abc123 exists?                 │
│         │    → YES! (duplicate)                         │
│         │ 2. Return cached: {id:1, status:success}      │
│         │ 3. NO CHARGE - customer not double-billed!    │
│                                                         │
└─────────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Idempotency', explanation: 'Same input → same output, no duplicate side effects', icon: '🔑' },
    { title: 'Deduplication', explanation: 'Detect and filter duplicate requests', icon: '🔍' },
    { title: 'Race Condition', explanation: 'Two requests with same key arrive simultaneously', icon: '🏃' },
  ],

  quickCheck: {
    question: 'Why must idempotency key checks use database transactions?',
    options: [
      'To make it faster',
      'To prevent race conditions where two requests with same key both process',
      'To reduce database load',
      'It\'s a regulatory requirement',
    ],
    correctIndex: 1,
    explanation: 'Without transactions, two simultaneous requests with the same key could both check, both find it missing, and both process (double charge!). Transactions prevent this race condition.',
  },
};

const step4: GuidedStep = {
  id: 'exactly-once-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Exactly-once processing with idempotency keys',
    taskDescription: 'Update your Python code to check and store idempotency keys',
    successCriteria: [
      'Open Python tab in App Server',
      'Update create_payment() to check idempotency key in database',
      'If key exists, return cached result',
      'If key is new, process payment and store key + result atomically',
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
    level1: 'Add idempotency key checking logic to your create_payment() function',
    level2: 'Use a transaction: BEGIN; check if key exists; if not, insert payment + key; COMMIT; Return result.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Fast Idempotency Key Lookups
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your deduplication works! But payment latency is terrible.",
  hook: "Every request hits the database to check idempotency keys. With 14 TPS (including retries), the database is overwhelmed. Latency went from 200ms to 2 seconds!",
  challenge: "Add a cache to check idempotency keys in memory before hitting the database.",
  illustration: 'slow-database',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Idempotency checks are now instant!',
  achievement: 'Cache reduces duplicate detection latency by 20x',
  metrics: [
    { label: 'Idempotency check latency', before: '50ms', after: '2ms' },
    { label: 'Cache hit rate', after: '80%' },
    { label: 'Database load', before: '100%', after: '30%' },
  ],
  nextTeaser: "Perfect! But we still have a single point of failure...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Idempotency Keys: Speed Without Sacrificing Safety',
  conceptExplanation: `**The Problem:**
Every payment checks idempotency key in database:
- Database query: 20-50ms
- With 20% retry rate: checking keys becomes bottleneck

**The Solution: Two-Layer Deduplication**
\`\`\`
1. Check Redis cache (1-2ms)
   - HIT → Return cached result immediately
   - MISS → Check database
2. Check database (20-50ms)
   - HIT → Store in cache, return result
   - MISS → Process payment, store in both cache + DB
\`\`\`

**Cache Strategy:**
- Store idempotency_key → payment_result in Redis
- TTL: 24 hours (matches deduplication window)
- Write-through: Write to DB, then cache
- Cache invalidation: Never (TTL handles expiry)

**Why this works:**
- Retries happen within seconds/minutes
- 80%+ of duplicate checks hit cache
- Database only sees unique payments + cache misses`,

  whyItMatters: 'Fast duplicate detection = better user experience and lower database load.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Handling millions of payment requests with retries',
    howTheyDoIt: 'Uses Redis for hot idempotency keys (last 1 hour) and PostgreSQL for cold keys (last 24 hours). 95% of duplicate checks hit Redis.',
  },

  keyPoints: [
    'Cache idempotency keys in Redis for fast lookups',
    'Two-layer check: cache first, then database',
    'Set TTL to 24 hours (matches deduplication window)',
    'Write-through: Update both cache and database atomically',
  ],

  diagram: `
┌─────────────────────────────────────────────────────────┐
│         TWO-LAYER IDEMPOTENCY CHECK                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Request: Idempotency-Key = idem_xyz                    │
│                                                         │
│         ┌─────────────┐                                 │
│         │   Server    │                                 │
│         └──────┬──────┘                                 │
│                │                                        │
│                │ 1. Check cache                         │
│                ▼                                        │
│         ┌─────────────┐                                 │
│         │    Redis    │  ← 1-2ms (80% hit rate)        │
│         └──────┬──────┘                                 │
│                │                                        │
│         Hit?   │   Miss?                                │
│         ├──────┴──────┐                                 │
│         ▼             ▼                                 │
│    Return         Check DB                              │
│    cached      ┌──────────┐                             │
│    result      │PostgreSQL│  ← 20-50ms (20% of time)   │
│                └────┬─────┘                             │
│                     │                                   │
│              Hit?   │   Miss?                           │
│              ├──────┴──────┐                            │
│              ▼             ▼                            │
│         Cache +        Process                          │
│         return         payment                          │
│         result         + store                          │
│                                                         │
└─────────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Key found in cache - instant response', icon: '✅' },
    { title: 'Write-Through', explanation: 'Write to database and cache together', icon: '📝' },
    { title: 'TTL', explanation: 'Time-To-Live - auto-expire after 24 hours', icon: '⏰' },
  ],

  quickCheck: {
    question: 'Why use cache for idempotency keys instead of just database?',
    options: [
      'Cache is more reliable than database',
      'Reduces latency for duplicate checks from 50ms to 2ms',
      'Cache is cheaper than database',
      'Required by payment regulations',
    ],
    correctIndex: 1,
    explanation: 'Cache provides 20x faster lookups. Since retries often happen within seconds, most duplicate checks hit cache.',
  },
};

const step5: GuidedStep = {
  id: 'exactly-once-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Fast duplicate detection with caching',
    taskDescription: 'Add a Redis cache for idempotency key lookups',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache idempotency keys for fast duplicate detection', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (24 hours = 86400 seconds)',
      'Cache strategy set (write-through)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 86400 seconds (24 hours), strategy to write-through',
    solutionComponents: [{ type: 'cache', config: { ttl: 86400, strategy: 'write-through' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Distributed Transaction Support (Saga Pattern)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "Your payment system now handles payments perfectly. But there's a bigger problem...",
  hook: "A payment succeeded, but the order service failed to mark the order complete. The customer was charged but got no order confirmation! We need to coordinate across services.",
  challenge: "Implement the Saga pattern to handle distributed transactions across Payment, Order, and Inventory services.",
  illustration: 'distributed-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Distributed transactions are coordinated!',
  achievement: 'Saga pattern ensures consistency across services',
  metrics: [
    { label: 'Distributed consistency', after: 'Enabled' },
    { label: 'Compensating transactions', after: 'Implemented' },
    { label: 'Cross-service failures', after: 'Handled' },
  ],
  nextTeaser: "Great! But we need to handle even more complex failure scenarios...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Saga Pattern: Distributed Transactions Without 2PC',
  conceptExplanation: `**The Problem:**
Payment must coordinate 3 services:
1. Payment Service - Process payment
2. Order Service - Mark order complete
3. Inventory Service - Decrease stock

If payment succeeds but inventory fails → inconsistent state!

**Traditional 2PC (Two-Phase Commit):**
- Phase 1: Ask all services "can you commit?"
- Phase 2: If all say yes, tell all to commit
- Problem: Locks resources, low throughput, single point of failure

**Saga Pattern (Modern Approach):**
Execute steps sequentially with compensating transactions:

\`\`\`
1. Reserve Inventory → Success
   Compensation: Release inventory
2. Process Payment → Success
   Compensation: Refund payment
3. Complete Order → Success
   Compensation: Cancel order

If ANY step fails → Run compensations in reverse!
\`\`\`

**Saga Types:**
1. **Choreography**: Services publish events, others react
2. **Orchestration**: Central coordinator manages flow (better for payments)`,

  whyItMatters: 'Distributed systems have partial failures. Sagas provide consistency without blocking resources.',

  famousIncident: {
    title: 'Amazon Prime Day Inventory Chaos',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'During Prime Day, payment processing succeeded but inventory deduction failed for thousands of orders. Amazon shipped products they thought were in stock but weren\'t. Cost: millions in expedited shipping and customer credits.',
    lessonLearned: 'Distributed transactions need coordination. Saga pattern with compensating transactions prevents inconsistency.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Ride payment must coordinate: charge rider, pay driver, update trip',
    howTheyDoIt: 'Uses orchestrated saga with compensating transactions. If payment fails after driver payment, saga refunds driver automatically.',
  },

  keyPoints: [
    'Saga = sequence of local transactions with compensations',
    'Each step has a compensating transaction (undo)',
    'Orchestration > Choreography for payment flows',
    'Store saga state to recover from crashes',
    'Idempotent compensations (can run multiple times safely)',
  ],

  diagram: `
┌─────────────────────────────────────────────────────────┐
│              SAGA PATTERN FLOW                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HAPPY PATH:                                            │
│  ┌──────────────┐                                       │
│  │ 1. Reserve   │ → Success                             │
│  │   Inventory  │                                       │
│  └──────┬───────┘                                       │
│         │                                               │
│  ┌──────▼───────┐                                       │
│  │ 2. Process   │ → Success                             │
│  │   Payment    │                                       │
│  └──────┬───────┘                                       │
│         │                                               │
│  ┌──────▼───────┐                                       │
│  │ 3. Complete  │ → Success                             │
│  │   Order      │                                       │
│  └──────────────┘                                       │
│                                                         │
│  FAILURE PATH (Payment fails):                         │
│  ┌──────────────┐                                       │
│  │ 1. Reserve   │ → Success                             │
│  │   Inventory  │                                       │
│  └──────┬───────┘                                       │
│         │                                               │
│  ┌──────▼───────┐                                       │
│  │ 2. Process   │ → FAILED!                             │
│  │   Payment    │                                       │
│  └──────┬───────┘                                       │
│         │                                               │
│         │ Trigger compensations ↓                       │
│         │                                               │
│  ┌──────▼───────┐                                       │
│  │ 1. Release   │ → Undo inventory reservation          │
│  │   Inventory  │                                       │
│  └──────────────┘                                       │
│                                                         │
│  Final state: Consistent (no charge, no inventory)     │
│                                                         │
└─────────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Saga', explanation: 'Sequence of transactions with compensations', icon: '🔄' },
    { title: 'Compensation', explanation: 'Undo operation for each saga step', icon: '↩️' },
    { title: 'Orchestration', explanation: 'Central coordinator manages saga flow', icon: '🎭' },
    { title: '2PC', explanation: 'Two-Phase Commit - traditional distributed transaction', icon: '🔀' },
  ],

  quickCheck: {
    question: 'Why is Saga pattern better than 2PC for payment systems?',
    options: [
      'Saga is faster and simpler',
      'Saga doesn\'t lock resources, allows higher throughput and handles failures gracefully',
      'Saga is required by payment regulations',
      '2PC doesn\'t work for payments',
    ],
    correctIndex: 1,
    explanation: 'Saga doesn\'t lock resources during coordination. Compensating transactions handle failures without blocking, enabling higher throughput.',
  },
};

const step6: GuidedStep = {
  id: 'exactly-once-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Distributed consistency across services',
    taskDescription: 'Add a Message Queue for saga orchestration and connect additional services',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Orchestrate saga steps and compensations', displayName: 'Message Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
      'Saga orchestration logic implemented',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables saga orchestration for distributed transactions.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 7: Add Database Replication for Payment Data
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your database crashed. ALL payment records are inaccessible!",
  hook: "Customers can't check payment status. New payments fail. Refunds are blocked. Your on-call phone won't stop ringing!",
  challenge: "Add database replication so payment data survives server failures.",
  illustration: 'database-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Payment data is now fault-tolerant!',
  achievement: 'Synchronous replication ensures zero payment data loss',
  metrics: [
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Data loss on failure', before: 'Possible', after: 'Zero' },
    { label: 'Failover time', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "Excellent! But we still need to handle high traffic...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Zero Data Loss for Payments',
  conceptExplanation: `For payment systems, database replication is **MANDATORY**.

**Why Synchronous Replication:**
- **Synchronous**: Write to primary AND replicas before success
  - Guarantees: Zero data loss
  - Trade-off: +10-50ms latency
  - Use for: Payment transactions (required!)

- **Asynchronous**: Write to primary, replicate later
  - Guarantees: None (can lose recent writes)
  - Use for: Never for payments!

**Architecture:**
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Stay in sync via synchronous replication
- **Failover**: Promote replica if primary fails (seconds, not hours)

**For payments:**
- Minimum 2 replicas in different availability zones
- Synchronous replication to at least 1 replica
- Automatic failover with health checks`,

  whyItMatters: 'Losing payment data is illegal and destroys customer trust. Synchronous replication prevents ALL data loss.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. All 5 backup methods had failed. They lost 6 hours of data. For payments, this would be catastrophic.',
    lessonLearned: 'Replication isn\'t enough - test it regularly. For payments, synchronous replication is mandatory.',
    icon: '💀',
  },

  keyPoints: [
    'Use SYNCHRONOUS replication for payment data',
    'Minimum 2 replicas in different availability zones',
    'Primary handles writes, replicas handle reads',
    'Automatic failover promotes replica in seconds',
  ],

  keyConcepts: [
    { title: 'Synchronous Replication', explanation: 'Write to replicas before success', icon: '🔒' },
    { title: 'Zero Data Loss', explanation: 'Data survives any single server failure', icon: '🛡️' },
    { title: 'Failover', explanation: 'Automatic promotion of replica to primary', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'exactly-once-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs require zero-data-loss guarantees',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
      'Set replication mode to synchronous',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', to: 'message_queue' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication, set replicas to 2+, and choose synchronous mode for payment data safety',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2, mode: 'synchronous' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer and Scale Out
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔥',
  scenario: "Black Friday! Payment traffic just spiked 5x to 300 TPS!",
  hook: "Your single app server is maxed out. Payment requests are timing out. Customers are abandoning carts. You're losing millions!",
  challenge: "Add a load balancer and scale out to multiple app server instances.",
  illustration: 'traffic-spike',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Congratulations! You built an exactly-once payment system!',
  achievement: 'Production-ready payment processing with all guarantees',
  metrics: [
    { label: 'Exactly-once guarantees', after: '✓' },
    { label: 'Distributed consistency', after: '✓' },
    { label: 'Zero data loss', after: '✓' },
    { label: 'High availability', after: '99.99%' },
    { label: 'Peak capacity', after: '300+ TPS' },
  ],
  nextTeaser: "You've mastered distributed payment systems!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing & Horizontal Scaling',
  conceptExplanation: `**The Final Piece: Scale Out**

With 300 TPS peak traffic:
- Each app server handles ~50 TPS
- Need at least 6 servers (with headroom)

**Load Balancer provides:**
1. **Traffic distribution** - Spread load across servers
2. **Health checks** - Remove failed servers
3. **Session affinity** - Not needed (stateless servers)
4. **Auto-scaling** - Add servers during spikes

**Complete Architecture:**
\`\`\`
Client → Load Balancer → App Servers (6+)
                              ↓
                    ┌─────────┴─────────┐
                    ▼                   ▼
              Redis Cache        PostgreSQL
                                (with replicas)
                    ▼
              Message Queue
              (saga orchestration)
\`\`\`

**Key properties:**
- **Stateless servers** - Any server can handle any request
- **Idempotency** - Safe to retry on any server
- **Distributed transactions** - Saga coordination via queue
- **Zero data loss** - Synchronous DB replication`,

  whyItMatters: 'Payment systems must handle traffic spikes without losing transactions. Horizontal scaling + idempotency enables this.',

  realWorldExample: {
    company: 'Square',
    scenario: 'Handling millions of payment transactions during holidays',
    howTheyDoIt: 'Auto-scales from 100 to 1000+ app servers based on traffic. Idempotency keys ensure safe retries across any server.',
  },

  keyPoints: [
    'Load balancer distributes traffic across app servers',
    'Horizontal scaling: add more servers for more capacity',
    'Stateless servers + idempotency = safe retries',
    'Auto-scaling handles traffic spikes automatically',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '📈' },
    { title: 'Stateless', explanation: 'Server stores no state - any server can handle any request', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'exactly-once-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'System must handle 300 TPS with high availability',
    taskDescription: 'Add Load Balancer and configure multiple app server instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute payment traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
      'App Server configured for multiple instances (3+)',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server, then configure App Server for multiple instances',
    level2: 'Reconnect: Client → Load Balancer → App Server. Then click App Server and set instances to 3+',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const exactlyOncePaymentGuidedTutorial: GuidedTutorial = {
  problemId: 'exactly-once-payment',
  title: 'Design Exactly-Once Payment Processing',
  description: 'Build a payment system with idempotency keys, deduplication, and distributed transactions using the saga pattern',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '💳',
    hook: "You've been hired as Lead Engineer at PaymentCo!",
    scenario: "Your mission: Build a payment processing system that guarantees exactly-once semantics - no duplicate charges, ever.",
    challenge: "Can you design a system with idempotency keys, saga-based distributed transactions, and zero data loss?",
  },

  requirementsPhase: exactlyOncePaymentRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Payment State Machines',
    'Idempotency Keys',
    'Deduplication Strategies',
    'Distributed Transactions',
    'Saga Pattern (Orchestration)',
    'Compensating Transactions',
    'Two-Phase Commit (2PC)',
    'Exactly-Once Semantics',
    'ACID Transactions',
    'Synchronous Replication',
    'Cache-Aside Pattern',
    'Load Balancing',
  ],

  ddiaReferences: [
    'Chapter 7: Transactions (ACID guarantees)',
    'Chapter 8: The Trouble with Distributed Systems',
    'Chapter 9: Consistency and Consensus',
    'Chapter 12: The Future of Data Systems (Saga pattern)',
  ],
};

export default exactlyOncePaymentGuidedTutorial;
