import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Stripe Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a payment processing platform like Stripe.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, replication, queues, etc.)
 *
 * Key Concepts:
 * - Idempotency keys (prevent duplicate charges)
 * - Two-phase commit for transactions
 * - PCI DSS compliance
 * - Webhook reliability and retry
 * - Strong consistency requirements
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const stripeRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a payment processing platform like Stripe",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at PaymentTech Inc.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-payment',
      category: 'functional',
      question: "What's the core functionality users need from a payment platform?",
      answer: "Merchants need to:\n\n1. **Charge customers** - Process one-time payments via credit card\n2. **Refund payments** - Return money to customers when needed\n3. **Create subscriptions** - Set up recurring billing for customers\n4. **Receive webhooks** - Get notified when payment events occur",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Payment platforms are about moving money safely and notifying merchants about payment events",
    },
    {
      id: 'payment-methods',
      category: 'functional',
      question: "What payment methods should we support?",
      answer: "For MVP, let's focus on **credit/debit cards** (Visa, Mastercard, Amex). We can add ACH, digital wallets, and crypto later.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with cards - the most common payment method globally",
    },
    {
      id: 'customer-management',
      category: 'functional',
      question: "Do merchants need to store customer payment information?",
      answer: "Yes! Merchants need to **save customer cards** for repeat purchases and subscriptions. We'll store tokenized card data securely (PCI DSS compliant).",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Never store raw card data - use tokenization for PCI compliance",
    },
    {
      id: 'webhook-delivery',
      category: 'clarification',
      question: "How reliable should webhook delivery be?",
      answer: "Webhooks must be **highly reliable**. If a merchant's server is down, we'll retry with exponential backoff for up to 72 hours. These notifications are critical for order fulfillment.",
      importance: 'critical',
      insight: "Webhooks are async notifications - reliability requires retry logic and idempotency",
    },
    {
      id: 'multi-currency',
      category: 'clarification',
      question: "Should we support payments in multiple currencies?",
      answer: "Eventually yes, but for MVP, let's stick with **USD only**. Multi-currency adds complexity with exchange rates and settlement.",
      importance: 'nice-to-have',
      insight: "Multi-currency requires forex APIs and settlement complexity - good to defer",
    },

    // SCALE & NFRs
    {
      id: 'throughput-transactions',
      category: 'throughput',
      question: "How many payment transactions per day should we handle?",
      answer: "10 million transactions per day at steady state, with potential spikes to 50 million during events like Black Friday",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 116 transactions/sec",
        result: "~116 TPS average, ~580 TPS peak",
      },
      learningPoint: "Payment volume spikes during shopping events - design for 5x peak capacity",
    },
    {
      id: 'throughput-webhooks',
      category: 'throughput',
      question: "How many webhook deliveries per day?",
      answer: "Each transaction triggers 2-3 webhooks on average (charge.succeeded, customer.updated, etc.). That's 20-30 million webhooks per day.",
      importance: 'critical',
      calculation: {
        formula: "30M ÷ 86,400 sec = 347 webhooks/sec",
        result: "~347 webhooks/sec average, ~1,735 peak",
      },
      learningPoint: "Webhooks can overwhelm systems - need async processing with queues",
    },
    {
      id: 'latency-payment',
      category: 'latency',
      question: "How fast should payment processing be?",
      answer: "p99 under 500ms for card charges. Users are waiting at checkout - every millisecond matters for conversion rates.",
      importance: 'critical',
      learningPoint: "Payment latency directly impacts merchant revenue - optimize aggressively",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "What happens if a payment is charged but our database fails before recording it?",
      answer: "This is catastrophic! We need **strong consistency** and **exactly-once semantics**. Use two-phase commit and idempotency keys to prevent duplicate charges.",
      importance: 'critical',
      learningPoint: "Financial systems require ACID guarantees - eventual consistency is unacceptable",
    },
    {
      id: 'duplicate-prevention',
      category: 'reliability',
      question: "What if a merchant accidentally submits the same charge twice?",
      answer: "We use **idempotency keys**! Merchants send a unique key with each request. If we see the same key twice, we return the original result instead of charging again.",
      importance: 'critical',
      insight: "Idempotency prevents duplicate charges - absolutely critical for payments",
    },
    {
      id: 'pci-compliance',
      category: 'security',
      question: "How do we handle PCI DSS compliance for storing card data?",
      answer: "We NEVER store raw card numbers. Instead:\n1. Tokenize cards immediately\n2. Store tokens in PCI-compliant vault\n3. Use encryption at rest and in transit\n4. Audit all access to payment data",
      importance: 'critical',
      learningPoint: "PCI DSS is mandatory for handling card data - violate it and lose your business",
    },
    {
      id: 'fraud-detection',
      category: 'security',
      question: "How do we prevent fraudulent transactions?",
      answer: "For MVP, we'll use basic fraud rules (velocity checks, card verification). Full ML-based fraud detection can come in v2.",
      importance: 'important',
      insight: "Fraud is a cat-and-mouse game - start with rules, evolve to ML",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-payment', 'payment-methods', 'duplicate-prevention'],
  criticalFRQuestionIds: ['core-payment', 'payment-methods'],
  criticalScaleQuestionIds: ['throughput-transactions', 'consistency-requirements', 'duplicate-prevention'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Process card payments',
      description: 'Charge credit/debit cards and return success/failure',
      emoji: '💳',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Refund payments',
      description: 'Return money to customers for completed transactions',
      emoji: '↩️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Manage subscriptions',
      description: 'Create recurring billing with automatic charges',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Send webhooks',
      description: 'Notify merchants about payment events',
      emoji: '📡',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Store customer data',
      description: 'Securely save customer and payment method info',
      emoji: '🔐',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000 merchants',
    writesPerDay: '10 million transactions',
    readsPerDay: '50 million API calls',
    peakMultiplier: 5,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 116, peak: 580 },
    calculatedReadRPS: { average: 579, peak: 2895 },
    maxPayloadSize: '~5KB (payment request)',
    storagePerRecord: '~2KB (transaction)',
    storageGrowthPerYear: '~7TB',
    redirectLatencySLA: 'p99 < 500ms (payment)',
    createLatencySLA: 'p99 < 200ms (API read)',
  },

  architecturalImplications: [
    '✅ Strong consistency required → ACID transactions with two-phase commit',
    '✅ Idempotency critical → Store idempotency keys in cache/DB',
    '✅ Webhook volume high → Message queue for async delivery',
    '✅ PCI compliance → Separate card vault with encryption',
    '✅ Financial data → Database replication with sync writes',
    '✅ Audit requirements → Immutable transaction logs',
  ],

  outOfScope: [
    'Multi-currency support',
    'ACH/bank transfers',
    'Digital wallets (Apple Pay, Google Pay)',
    'Cryptocurrency payments',
    'Fraud detection ML models',
    'Chargeback management',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where merchants can charge cards and get webhooks. The critical consistency guarantees and scaling challenges will come in later steps. Functionality first, then bulletproofing!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💳',
  scenario: "Welcome to PaymentTech Inc! You've been hired to build the next Stripe.",
  hook: "A merchant just integrated your API. They're ready to process their first payment!",
  challenge: "Set up the basic request flow so merchants can reach your payment server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your payment platform is online!',
  achievement: 'Merchants can now send payment requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process payments yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Payment API Architecture',
  conceptExplanation: `Every payment platform starts with a **Client** connecting to a **Server**.

When a merchant processes a payment:
1. Their application (web/mobile) is the **Client**
2. It sends HTTPS requests to your **Payment Server**
3. The server processes the payment and returns success/failure

This is the foundation of ALL payment systems!`,

  whyItMatters: 'Without this connection, merchants can\'t process any payments at all.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing billions in payments annually',
    howTheyDoIt: 'Started with a simple Rails API in 2010, now processes payments across globally distributed servers',
  },

  keyPoints: [
    'Client = merchant\'s application (web, mobile, server)',
    'Payment Server = your backend that processes payments',
    'HTTPS = secure protocol for sensitive payment data',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Merchant\'s application making payment requests', icon: '📱' },
    { title: 'Payment Server', explanation: 'Your backend that handles payment logic', icon: '🖥️' },
    { title: 'HTTPS', explanation: 'Encrypted protocol for secure data transfer', icon: '🔒' },
  ],
};

const step1: GuidedStep = {
  id: 'stripe-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents merchants using your API', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles payment processing logic', displayName: 'App Server' },
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
// STEP 2: Implement Payment APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to process payments!",
  hook: "A merchant tried to charge $99.99 but got a 404 error.",
  challenge: "Write the Python code to handle charges, refunds, and subscriptions.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your payment APIs are live!',
  achievement: 'You implemented the core payment processing functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can charge cards', after: '✓' },
    { label: 'Can process refunds', after: '✓' },
    { label: 'Can create subscriptions', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all payment records are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Payment API Implementation: Critical Handlers',
  conceptExplanation: `Every payment API needs **handler functions** that process financial transactions.

For Stripe, we need handlers for:
- \`create_charge()\` - Process a one-time payment
- \`refund()\` - Return money to a customer
- \`create_subscription()\` - Set up recurring billing

**Critical requirements:**
1. **Validate input** - Check amount, currency, payment method
2. **Process atomically** - All-or-nothing (charge + record)
3. **Return clear status** - succeeded, failed, or requires_action
4. **Use idempotency keys** - Prevent duplicate charges

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Payment handlers must be absolutely bulletproof. A bug here means real money lost!',

  famousIncident: {
    title: 'PayPal Double-Charge Bug',
    company: 'PayPal',
    year: '2015',
    whatHappened: 'A race condition in PayPal\'s payment processing caused thousands of customers to be charged twice for the same transaction. PayPal had to refund millions and faced regulatory scrutiny.',
    lessonLearned: 'Idempotency and proper transaction handling are non-negotiable for payments.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing 580 payments/second at peak',
    howTheyDoIt: 'Their Payment Intent API uses state machines to handle complex payment flows with retries and idempotency',
  },

  keyPoints: [
    'Each payment API needs a handler function',
    'Validate all inputs - amount, currency, payment method',
    'Use in-memory storage for now (database comes next)',
    'Always return a clear status: succeeded/failed/pending',
  ],

  quickCheck: {
    question: 'Why is idempotency critical for payment APIs?',
    options: [
      'It makes payments faster',
      'It prevents charging a customer twice for the same request',
      'It reduces server load',
      'It\'s required by PCI compliance',
    ],
    correctIndex: 1,
    explanation: 'Idempotency ensures that retrying the same payment request doesn\'t result in duplicate charges.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes a payment API request', icon: '⚙️' },
    { title: 'Idempotency', explanation: 'Same request → same result, no duplicates', icon: '🔑' },
    { title: 'Atomicity', explanation: 'All-or-nothing transaction execution', icon: '⚛️' },
  ],
};

const step2: GuidedStep = {
  id: 'stripe-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Process payments, FR-2: Refunds, FR-3: Subscriptions',
    taskDescription: 'Configure APIs and implement Python handlers for payment processing',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/charges, POST /api/v1/refunds, POST /api/v1/subscriptions APIs',
      'Open the Python tab',
      'Implement create_charge(), refund(), and create_subscription() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_charge, refund, and create_subscription',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/charges', 'POST /api/v1/refunds', 'POST /api/v1/subscriptions'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Transaction Records
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed and restarted at 2 AM...",
  hook: "When it came back, ALL payment records were GONE! Merchants are furious - they can't reconcile transactions or issue refunds.",
  challenge: "Add a database so financial data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your payment records are safe!',
  achievement: 'Financial data now persists with ACID guarantees',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Transaction durability', after: '100%' },
    { label: 'ACID compliance', after: '✓' },
  ],
  nextTeaser: "But looking up customers for repeat payments is getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Are Critical for Payments',
  conceptExplanation: `For payment systems, losing data is **catastrophic and illegal**.

A **database** provides:
- **Durability**: Transaction records survive crashes
- **ACID guarantees**: Atomicity, Consistency, Isolation, Durability
- **Audit trail**: Immutable records for compliance
- **Queries**: Efficient lookups for refunds and reconciliation

For Stripe, we need tables for:
- \`transactions\` - All payment attempts and their status
- \`customers\` - Customer profiles and metadata
- \`subscriptions\` - Recurring billing schedules
- \`payment_methods\` - Tokenized card data (PCI-compliant vault)
- \`idempotency_keys\` - Prevent duplicate charges`,

  whyItMatters: 'Losing payment data means:\n1. Can\'t issue refunds\n2. No audit trail for regulators\n3. Merchants lose trust\n4. Potential lawsuits and fines',

  famousIncident: {
    title: 'British Airways Payment System Failure',
    company: 'British Airways',
    year: '2018',
    whatHappened: 'A power surge corrupted their payment database. They couldn\'t process bookings for 3 days, losing £80 million in revenue. Worse: they lost customer trust.',
    lessonLearned: 'Database reliability for payments is non-negotiable. Always have replication and backups.',
    icon: '✈️',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Storing billions of transactions',
    howTheyDoIt: 'Uses PostgreSQL with custom extensions, heavy replication, and immutable transaction logs for audit compliance',
  },

  keyPoints: [
    'Financial databases MUST be ACID-compliant',
    'Use PostgreSQL for strong consistency guarantees',
    'Store idempotency keys to prevent duplicate charges',
    'Never delete transaction records - use soft deletes',
  ],

  quickCheck: {
    question: 'What happens to in-memory payment data when a server restarts?',
    options: [
      'It\'s automatically backed up',
      'It\'s saved to disk first',
      'It\'s completely lost - catastrophic for payments',
      'It\'s recovered from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory data is volatile. For financial systems, this is unacceptable - you MUST use durable storage.',
  },

  keyConcepts: [
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
    { title: 'Durability', explanation: 'Data survives crashes and power failures', icon: '🛡️' },
    { title: 'Audit Trail', explanation: 'Immutable records for compliance', icon: '📜' },
  ],
};

const step3: GuidedStep = {
  id: 'stripe-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent, ACID-compliant storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store transactions, customers, subscriptions with ACID guarantees', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Customer Data & Rate Limiting
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10,000 merchants processing payments, and API calls are getting slow!",
  hook: "Every payment lookup hits the database. Customer queries take 200ms+. Merchants are complaining about checkout lag.",
  challenge: "Add a cache to speed up customer lookups and enable rate limiting per API key.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Customer lookups are 20x faster!',
  achievement: 'Caching dramatically improved API performance',
  metrics: [
    { label: 'Customer lookup latency', before: '200ms', after: '10ms' },
    { label: 'Cache hit rate', after: '85%' },
    { label: 'Rate limiting', after: 'Enabled' },
  ],
  nextTeaser: "But what happens when your single server can't handle the load?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed + Rate Limiting for Payment APIs',
  conceptExplanation: `A **cache** serves two critical purposes for payment platforms:

**1. Speed up frequent reads:**
\`\`\`
Request → Cache (fast, 1ms) → Database (only on miss)
\`\`\`

**2. Enable rate limiting:**
Store per-API-key request counts in cache:
- "merchant_xyz": 95 requests in last minute
- Reject if > 100/min limit

For Stripe, we cache:
- Customer data (name, email, default payment method)
- API key → merchant mapping
- Rate limit counters per API key
- Idempotency key results (prevent duplicate charges)`,

  whyItMatters: 'Without caching:\n1. Every API call is slow (database query)\n2. Can\'t implement rate limiting\n3. Database gets overwhelmed\n4. Checkout experiences lag',

  famousIncident: {
    title: 'Stripe API Outage from Cache Failure',
    company: 'Stripe',
    year: '2019',
    whatHappened: 'A Redis cluster failure caused a cascading load spike on their databases. API response times went from 50ms to 5000ms. Checkouts worldwide failed for 2 hours.',
    lessonLearned: 'Cache failures can bring down your entire system. Always have fallback strategies.',
    icon: '🔴',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Handling 2,895 API calls/second at peak',
    howTheyDoIt: 'Uses Redis clusters for customer data, rate limiting, and idempotency key deduplication',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (85% of requests)
                     │   Return instantly!
                     │
                     │   Rate limit check:
                     │   redis.incr("api_key:xyz")
                     │   → Reject if > 100/min
`,

  keyPoints: [
    'Cache customer data to speed up payment processing',
    'Store idempotency keys in cache to prevent duplicates',
    'Use cache for rate limiting per API key',
    'Set short TTL (60-300s) to balance speed vs freshness',
  ],

  quickCheck: {
    question: 'Why is caching idempotency keys important for payments?',
    options: [
      'It makes payments faster',
      'It prevents charging the same customer twice when they retry',
      'It reduces database load',
      'It\'s required by PCI compliance',
    ],
    correctIndex: 1,
    explanation: 'Cached idempotency keys allow instant detection of duplicate requests, preventing double charges.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Rate Limiting', explanation: 'Limit requests per API key to prevent abuse', icon: '🚦' },
    { title: 'Idempotency Key', explanation: 'Unique ID to prevent duplicate operations', icon: '🔑' },
  ],
};

const step4: GuidedStep = {
  id: 'stripe-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from faster customer lookups',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache customer data, idempotency keys, rate limits', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step4Celebration,

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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 300 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for High Availability
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Black Friday is here! Payment volume just spiked 10x.",
  hook: "Your single app server is maxed out at 100% CPU. Payments are timing out. Merchants are losing sales!",
  challenge: "Add a load balancer to distribute payment traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Payment traffic is now distributed!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Payment capacity', before: '100 TPS', after: 'Ready to scale' },
  ],
  nextTeaser: "But we still only have one app server instance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute Payment Load',
  conceptExplanation: `A **Load Balancer** distributes incoming payment requests across multiple servers.

Benefits for payment platforms:
- **No single point of failure** - if one server crashes, others continue
- **Horizontal scaling** - add more servers during peak times
- **Even distribution** - no server gets overwhelmed
- **Health checks** - automatically route around failed servers

For payments, use **sticky sessions** for:
- In-progress checkout flows
- 3D Secure authentication flows
- Multi-step payment processing`,

  whyItMatters: 'At peak (580 TPS), a single server can\'t handle the load. Payment failures = lost revenue for merchants.',

  famousIncident: {
    title: 'Amazon Prime Day Payment Crash',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'At the start of Prime Day, payment systems couldn\'t scale fast enough. Checkouts failed for the first hour, costing Amazon an estimated $100 million in lost sales.',
    lessonLearned: 'Load balancers must be configured correctly with auto-scaling for sudden traffic spikes.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Handling global payment volume',
    howTheyDoIt: 'Uses multiple layers of load balancers with health checks, auto-scaling, and geographic routing',
  },

  diagram: `
              ┌─────────────┐
              │ App Server 1│
┌────────┐   ┌──────────────┐   └─────────────┘
│ Client │──▶│Load Balancer │──▶ App Server 2
└────────┘   └──────────────┘   ┌─────────────┐
              │ App Server 3│
              └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes payment requests across servers',
    'Enables horizontal scaling for peak traffic',
    'Health checks detect and route around failed servers',
    'Critical for handling Black Friday / Cyber Monday spikes',
  ],

  quickCheck: {
    question: 'What happens if one payment server crashes with a load balancer?',
    options: [
      'All payments fail',
      'Load balancer routes traffic to healthy servers',
      'Payments are queued until server recovers',
      'The database takes over processing',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers via health checks and automatically route to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Health Check', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Sticky Session', explanation: 'Route same user to same server', icon: '📌' },
  ],
};

const step5: GuidedStep = {
  id: 'stripe-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute payment traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Database Replication (CRITICAL for Financial Data)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "EMERGENCY! Your payment database crashed for 10 minutes last night.",
  hook: "During that time:\n- All payments failed\n- Merchants lost $2 million in sales\n- Regulators are investigating\n- Your job is on the line",
  challenge: "Add database replication so you NEVER lose payment data.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Payment data is now fault-tolerant!',
  achievement: 'Synchronous replication ensures zero data loss',
  metrics: [
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Data loss on failure', before: 'Possible', after: 'Zero' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But webhook delivery is getting slow and unreliable...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Zero Data Loss for Payments',
  conceptExplanation: `For payment systems, database replication is **CRITICAL and MANDATORY**.

**Types of Replication:**
1. **Synchronous** - Write to primary AND replicas before returning success
   - Guarantees: Zero data loss
   - Trade-off: Higher latency (~10-50ms extra)
   - Use for: Financial transactions (required!)

2. **Asynchronous** - Write to primary, replicate later
   - Guarantees: None (can lose recent writes)
   - Trade-off: Lower latency
   - Use for: Non-critical data only

**Architecture:**
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Stay in sync via replication
- **Read scaling**: Route read queries to replicas
- **Failover**: Promote replica if primary fails`,

  whyItMatters: 'For payments:\n1. Can\'t lose transaction data (illegal)\n2. Need audit trail for regulators\n3. Downtime = lost revenue for merchants\n4. Synchronous replication prevents data loss',

  famousIncident: {
    title: 'Robinhood Trading Outage',
    company: 'Robinhood',
    year: '2020',
    whatHappened: 'Their database failed during record trading volume. No failover plan. Platform was down for 2 full days. Users lost millions. SEC fined Robinhood $65 million.',
    lessonLearned: 'Financial platforms MUST have database replication with tested failover procedures.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Zero tolerance for payment data loss',
    howTheyDoIt: 'Uses synchronous replication across 3+ database instances in different availability zones',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │   SYNC WRITE →   │
                         └────────┬─────────┘
                                  │ Synchronous Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Use SYNCHRONOUS replication for payment data (zero data loss)',
    'Primary handles writes, replicas handle reads',
    'If primary fails, promote a replica (failover)',
    'Minimum 2 replicas in different availability zones',
  ],

  quickCheck: {
    question: 'Why must payment systems use synchronous replication?',
    options: [
      'It\'s faster than async',
      'It guarantees zero data loss - critical for financial records',
      'It\'s cheaper',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Synchronous replication ensures writes are committed to multiple servers before success. Financial data cannot be lost.',
  },

  keyConcepts: [
    { title: 'Synchronous Replication', explanation: 'Write to replicas before success', icon: '🔒' },
    { title: 'Zero Data Loss', explanation: 'Data survives any single server failure', icon: '🛡️' },
    { title: 'Failover', explanation: 'Automatic promotion of replica to primary', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'stripe-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

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

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication, set replicas to 2+, and choose synchronous mode for financial data safety',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2, mode: 'synchronous' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Async Webhooks & Retry Logic
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📡',
  scenario: "Merchants are furious! Webhooks are delayed or lost completely.",
  hook: "A payment succeeded but the webhook took 30 seconds. The order wasn't fulfilled. Customer got charged but received nothing!",
  challenge: "Add a message queue to deliver webhooks reliably with automatic retries.",
  illustration: 'webhook-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Webhooks are now bulletproof!',
  achievement: 'Async processing with retry logic ensures delivery',
  metrics: [
    { label: 'Webhook delivery rate', before: '85%', after: '99.9%' },
    { label: 'Delivery latency', before: '5s', after: '<500ms' },
    { label: 'Auto-retry', after: 'Enabled (72hrs)' },
  ],
  nextTeaser: "But we need more payment servers to handle peak traffic...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Reliable Async Webhooks',
  conceptExplanation: `Webhooks are **critical async notifications** to merchants. But what if their server is down?

**The Problem:**
- Synchronous webhooks block payment processing
- If merchant server is down, webhook is lost
- No retry logic = merchants miss critical events

**The Solution: Message Queue**
1. Payment succeeds → Publish webhook event to queue
2. Return success to client immediately (fast!)
3. Background workers consume queue and deliver webhooks
4. If delivery fails → Retry with exponential backoff
5. Retry for up to 72 hours before giving up

**For Stripe, we queue:**
- \`charge.succeeded\` events
- \`charge.failed\` events
- \`customer.updated\` events
- \`subscription.created\` events`,

  whyItMatters: 'Webhooks trigger critical business logic:\n- Fulfill orders\n- Update inventory\n- Send confirmation emails\n\nLost webhooks = broken checkout flows!',

  famousIncident: {
    title: 'Shopify Payment Webhook Outage',
    company: 'Shopify',
    year: '2020',
    whatHappened: 'Their webhook delivery system had a bug that caused webhooks to be delayed by 6+ hours during Black Friday. Thousands of merchants couldn\'t fulfill orders. Chaos ensued.',
    lessonLearned: 'Webhooks need queues with retry logic. Test at scale before peak traffic events.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Delivering 1,735 webhooks/second at peak',
    howTheyDoIt: 'Uses Kafka for event streaming with automatic retry, dead-letter queues, and delivery status tracking',
  },

  diagram: `
Payment Succeeds
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [webhook1, webhook2, webhook3...]  │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return "success!"          │ Workers consume
      ▼                            ▼
                          ┌─────────────────┐
                          │ Webhook Workers │
                          │ (background)    │
                          └────────┬────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  ▼                ▼                ▼
            POST to             POST to         POST to
            merchant_1          merchant_2      merchant_3

            If fails → Retry with exponential backoff
`,

  keyPoints: [
    'Queue decouples webhook delivery from payment processing',
    'Merchant gets instant payment response',
    'Workers deliver webhooks in background with retries',
    'Exponential backoff: retry at 1s, 2s, 4s, 8s, 16s...',
    'Dead-letter queue for webhooks that fail after 72hrs',
  ],

  quickCheck: {
    question: 'Why use a message queue for webhooks instead of sending them synchronously?',
    options: [
      'It\'s cheaper',
      'Decouples payment processing from webhook delivery, enables retries',
      'It\'s faster for the merchant',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Queues allow instant payment response while webhooks are delivered reliably in the background with automatic retries.',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Decouple slow operations from main flow', icon: '⚡' },
    { title: 'Retry Logic', explanation: 'Automatically retry failed deliveries', icon: '🔁' },
    { title: 'Exponential Backoff', explanation: 'Increase delay between retries', icon: '📈' },
  ],
};

const step7: GuidedStep = {
  id: 'stripe-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Send webhooks reliably with retry logic',
    taskDescription: 'Add a Message Queue for async webhook delivery',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Deliver webhooks asynchronously with auto-retry', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

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
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async webhook delivery with retries.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "The CFO just reviewed your infrastructure costs: $425,000/month!",
  hook: "She says: 'Our revenue is $800K/month. Cut infrastructure costs to under $200K or we\'re bankrupt in 6 months!'",
  challenge: "Optimize your architecture to reduce costs while maintaining reliability.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Stripe!',
  achievement: 'A secure, scalable, cost-effective payment platform',
  metrics: [
    { label: 'Monthly infrastructure cost', before: '$425K', after: 'Under $200K' },
    { label: 'Payment success rate', after: '99.9%' },
    { label: 'Payment latency', after: '<500ms' },
    { label: 'Webhook delivery', after: '99.9%' },
    { label: 'Zero data loss', after: '✓' },
  ],
  nextTeaser: "You've mastered payment system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Reliability and Budget',
  conceptExplanation: `Payment platforms have unique cost challenges:
1. **Can't compromise on reliability** - downtime = lost revenue
2. **Database costs are high** - synchronous replication isn't cheap
3. **Webhook delivery at scale** - message queues add cost

**Optimization strategies:**
1. **Right-size database** - Don't over-provision replicas
2. **Aggressive caching** - Reduce database queries by 80%+
3. **Auto-scale app servers** - Scale down during low traffic
4. **Use spot instances** - For webhook workers (can tolerate interruption)
5. **Archive old data** - Move old transactions to cheaper cold storage
6. **Optimize message queue** - Tune retention and partition count

**For Stripe:**
- Keep 2 database replicas (not 5)
- Cache customer/card data aggressively
- Use 2-3 app servers (not 10)
- Auto-scale webhook workers
- Archive transactions older than 7 years`,

  whyItMatters: 'Payment platforms operate on thin margins (2-3% per transaction). Infrastructure costs must be optimized without compromising reliability.',

  famousIncident: {
    title: "PayPal's Cost Optimization",
    company: 'PayPal',
    year: '2019',
    whatHappened: 'PayPal reduced infrastructure costs by 30% ($200M/year) by optimizing database queries, implementing aggressive caching, and right-sizing infrastructure. All while improving performance.',
    lessonLearned: 'Cost optimization doesn\'t mean cutting corners - it means being smart about resource allocation.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing billions in payments annually',
    howTheyDoIt: 'Heavily optimizes infrastructure: custom databases, aggressive caching, and auto-scaling everywhere',
  },

  keyPoints: [
    'Cache aggressively to reduce expensive database queries',
    'Right-size infrastructure - 2 replicas often enough',
    'Auto-scale based on traffic patterns',
    'Use spot instances for fault-tolerant workloads',
    'Archive old data to cheaper storage',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a payment platform?',
    options: [
      'Remove database replication',
      'Aggressive caching of customer/card data to reduce DB queries',
      'Reduce webhook retry attempts',
      'Use only one app server',
    ],
    correctIndex: 1,
    explanation: 'Caching reduces expensive database queries while maintaining reliability. Never compromise on replication or retries for financial systems.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match infrastructure to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Scale up/down based on traffic', icon: '📊' },
    { title: 'Cost/Reliability', explanation: 'Optimize cost without compromising uptime', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'stripe-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $200K/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $200K/month',
      'Maintain reliability: 2+ DB replicas, caching, message queue',
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
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning. Focus on: DB replicas, app server instances, cache size',
    level2: 'Optimal config: 2 DB replicas, 2-3 app servers, aggressive cache TTL. Keep message queue for reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const stripeGuidedTutorial: GuidedTutorial = {
  problemId: 'stripe',
  title: 'Design Stripe',
  description: 'Build a payment processing platform with charges, refunds, subscriptions, and webhooks',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '💳',
    hook: "You've been hired as Lead Engineer at PaymentTech Inc!",
    scenario: "Your mission: Build a Stripe-like payment platform that can handle millions of transactions per day with zero data loss.",
    challenge: "Can you design a system that guarantees idempotency, strong consistency, and 99.99% uptime?",
  },

  requirementsPhase: stripeRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Payment API Design',
    'ACID Transactions',
    'Idempotency Keys',
    'Caching',
    'Rate Limiting',
    'Load Balancing',
    'Synchronous Replication',
    'Message Queues',
    'Webhook Reliability',
    'Two-Phase Commit',
    'PCI DSS Compliance',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 7: Transactions (ACID guarantees)',
    'Chapter 5: Replication (Synchronous replication)',
    'Chapter 8: Distributed Systems (Two-phase commit)',
    'Chapter 12: The Future of Data Systems (Idempotency)',
  ],
};

export default stripeGuidedTutorial;
