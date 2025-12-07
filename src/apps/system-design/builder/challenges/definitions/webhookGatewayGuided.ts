import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Webhook Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a webhook delivery platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (retry logic, signature verification, rate limiting, etc.)
 *
 * Key Concepts:
 * - Webhook delivery and fan-out
 * - Exponential backoff retry logic
 * - HMAC signature verification
 * - Rate limiting per endpoint
 * - Message queues for reliability
 * - Dead letter queues
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const webhookGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a webhook delivery gateway for a SaaS platform",

  interviewer: {
    name: 'Jordan Martinez',
    role: 'Principal Engineer at WebhookCo',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-delivery',
      category: 'functional',
      question: "What's the core functionality we need from a webhook gateway?",
      answer: "Our platform needs to:\n\n1. **Accept webhook events** - Receive events from internal services (payment.success, order.created, etc.)\n2. **Deliver to customer endpoints** - POST events to customer-configured webhook URLs\n3. **Verify delivery** - Track success/failure of each webhook delivery\n4. **Retry failed deliveries** - Automatically retry with exponential backoff",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Webhooks are async notifications - reliability is critical because customers depend on them for business logic",
    },
    {
      id: 'signature-verification',
      category: 'functional',
      question: "How do customers verify webhooks are from us and not attackers?",
      answer: "We need **signature verification** using HMAC:\n1. Generate a secret key for each customer\n2. Sign each webhook payload with HMAC-SHA256\n3. Include signature in HTTP header (X-Webhook-Signature)\n4. Customer verifies signature matches payload\n\nThis prevents webhook spoofing attacks.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Without signatures, attackers could send fake webhooks to customer systems - a critical security vulnerability",
    },
    {
      id: 'event-types',
      category: 'functional',
      question: "What types of events should webhooks support?",
      answer: "Customers should be able to subscribe to specific event types:\n- payment.succeeded\n- payment.failed\n- order.created\n- order.shipped\n- subscription.renewed\n\nEach customer can choose which events they want to receive.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Event filtering reduces noise - customers only receive webhooks they care about",
    },
    {
      id: 'retry-policy',
      category: 'clarification',
      question: "What happens if a customer's webhook endpoint is down?",
      answer: "We need an **exponential backoff retry policy**:\n- Retry at: 1s, 2s, 4s, 8s, 16s, 32s, 1min, 5min, 15min, 1hr\n- Give up after 24 hours of failures\n- Move to dead letter queue for manual review\n\nThis gives customers time to fix issues without losing events.",
      importance: 'critical',
      insight: "Exponential backoff prevents hammering customer endpoints while maximizing delivery chances",
    },
    {
      id: 'delivery-order',
      category: 'clarification',
      question: "Do webhooks need to be delivered in order?",
      answer: "For MVP, **no strict ordering required**. Customers should design webhooks to be idempotent anyway. But we'll use FIFO queues per customer endpoint to maintain best-effort ordering.",
      importance: 'important',
      insight: "Strict ordering is hard in distributed systems - better to design for idempotency",
    },
    {
      id: 'webhook-logs',
      category: 'functional',
      question: "Do customers need visibility into webhook delivery status?",
      answer: "Yes! Customers need a **webhook dashboard** showing:\n- Recent webhook deliveries\n- Success/failure status\n- Response codes from their endpoints\n- Retry history\n- Ability to manually retry failed webhooks",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Observability is crucial - customers need to debug webhook issues themselves",
    },

    // SCALE & NFRs
    {
      id: 'throughput-webhooks',
      category: 'throughput',
      question: "How many webhooks per day should we handle?",
      answer: "50 million webhook deliveries per day at steady state, with potential spikes to 200 million during major events",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 webhooks/sec",
        result: "~579 webhooks/sec average, ~2,315 peak",
      },
      learningPoint: "High webhook volume requires async processing with message queues",
    },
    {
      id: 'latency-delivery',
      category: 'latency',
      question: "How fast should webhooks be delivered?",
      answer: "p99 delivery within 5 seconds of event creation. Fast delivery is important, but reliability matters more than speed for webhooks.",
      importance: 'important',
      learningPoint: "Webhooks are async by nature - sub-second delivery not critical",
    },
    {
      id: 'fan-out-problem',
      category: 'burst',
      question: "What if a single event needs to notify 10,000 customers?",
      answer: "That's the **fan-out problem**! One payment.succeeded event might need 10,000+ webhook deliveries. We need async workers to handle fan-out without blocking.",
      importance: 'critical',
      insight: "Fan-out requires parallel workers - can't do this synchronously",
    },
    {
      id: 'rate-limiting',
      category: 'throughput',
      question: "What if a customer's endpoint is slow or returns errors?",
      answer: "We need **rate limiting per endpoint**:\n- Max 100 requests/min per customer endpoint\n- Queue additional webhooks\n- Back off if endpoint consistently fails\n\nThis prevents us from overwhelming customer systems.",
      importance: 'critical',
      learningPoint: "Rate limiting protects both us and customers from cascading failures",
    },
    {
      id: 'delivery-guarantees',
      category: 'consistency',
      question: "Do we guarantee exactly-once delivery?",
      answer: "**At-least-once delivery** is realistic. Webhooks may be delivered multiple times due to retries. Customers should implement idempotency on their side using event IDs.",
      importance: 'critical',
      learningPoint: "Exactly-once is nearly impossible in distributed systems - design for at-least-once with idempotency",
    },
    {
      id: 'security-endpoint',
      category: 'security',
      question: "How do we prevent customers from using our system to attack other services?",
      answer: "Security measures:\n1. **Whitelist customer endpoints** - Only allow HTTPS URLs\n2. **Timeout enforcement** - 30 second max timeout per webhook\n3. **Payload size limits** - Max 1MB per webhook\n4. **Blacklist internal IPs** - Prevent SSRF attacks\n5. **TLS verification** - Verify SSL certificates",
      importance: 'critical',
      learningPoint: "Webhook gateways can be abused for SSRF attacks - strict validation required",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-delivery', 'signature-verification', 'retry-policy'],
  criticalFRQuestionIds: ['core-delivery', 'signature-verification'],
  criticalScaleQuestionIds: ['throughput-webhooks', 'rate-limiting', 'fan-out-problem'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Accept webhook events from services',
      description: 'Receive events from internal services',
      emoji: '📥',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Deliver webhooks to customer endpoints',
      description: 'POST webhook payloads to customer URLs',
      emoji: '📤',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Retry failed deliveries',
      description: 'Automatic retry with exponential backoff',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Sign webhooks for verification',
      description: 'HMAC signature for security',
      emoji: '🔐',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Filter events by subscription',
      description: 'Customers choose which events to receive',
      emoji: '🔍',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Webhook delivery logs',
      description: 'Track and display delivery status',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000 webhook endpoints',
    writesPerDay: '50 million webhooks',
    readsPerDay: '10 million log queries',
    peakMultiplier: 4,
    readWriteRatio: '1:5',
    calculatedWriteRPS: { average: 579, peak: 2315 },
    calculatedReadRPS: { average: 116, peak: 463 },
    maxPayloadSize: '~1MB (webhook payload)',
    storagePerRecord: '~10KB (event + metadata)',
    storageGrowthPerYear: '~183TB',
    redirectLatencySLA: 'p99 < 5s (delivery time)',
    createLatencySLA: 'p99 < 100ms (event ingestion)',
  },

  architecturalImplications: [
    '✅ High webhook volume → Message queue for async processing',
    '✅ Retry logic → Exponential backoff scheduler',
    '✅ Fan-out problem → Parallel worker pool',
    '✅ Rate limiting → Redis counter per endpoint',
    '✅ Delivery logs → Time-series database',
    '✅ Signature verification → HMAC signing service',
  ],

  outOfScope: [
    'Webhook payload transformations',
    'Bi-directional webhooks',
    'Custom retry policies per customer',
    'Webhook replay functionality',
    'Real-time webhook analytics',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that accepts events and delivers them to customer endpoints. The retry logic, signature verification, and scaling challenges will come in later steps. Functionality first, then reliability!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📡',
  scenario: "Welcome to WebhookCo! You're building a webhook delivery platform.",
  hook: "Your first customer just integrated. They need to receive payment notifications via webhooks!",
  challenge: "Set up the basic flow so services can send events to your webhook gateway.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your webhook gateway is online!',
  achievement: 'Services can now send events to your gateway',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting events', after: '✓' },
  ],
  nextTeaser: "But the gateway doesn't know how to deliver webhooks yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Webhook Gateway Architecture',
  conceptExplanation: `A **webhook gateway** sits between your services and your customers.

The flow:
1. **Internal Service** (payment service, order service) sends event to gateway
2. **Webhook Gateway** receives event, finds subscribers
3. Gateway delivers webhook to **Customer Endpoints** (their servers)

For this step, we'll create:
- **Client** = Internal services sending events
- **App Server** = Webhook gateway that processes and delivers events

This is the foundation of ALL webhook systems!`,

  whyItMatters: 'Without this connection, your services have no way to notify customers about important events.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Delivering billions of webhooks annually',
    howTheyDoIt: 'Stripe\'s webhook infrastructure accepts events from payment services and delivers them to millions of merchant endpoints',
  },

  keyPoints: [
    'Client = your internal services generating events',
    'App Server = webhook gateway that handles delivery',
    'HTTPS required for secure webhook delivery',
  ],

  keyConcepts: [
    { title: 'Event Producer', explanation: 'Service that generates webhook events', icon: '🏭' },
    { title: 'Webhook Gateway', explanation: 'System that delivers webhooks reliably', icon: '📡' },
    { title: 'Webhook Endpoint', explanation: 'Customer URL that receives webhooks', icon: '🎯' },
  ],
};

const step1: GuidedStep = {
  id: 'webhook-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents internal services sending events', displayName: 'Client' },
      { type: 'app_server', reason: 'Webhook gateway that processes events', displayName: 'App Server' },
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
// STEP 2: Implement Core Webhook Handlers (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your gateway is connected, but it doesn't know how to process webhook events!",
  hook: "A payment service tried to send a payment.succeeded event but got an error.",
  challenge: "Write the Python code to receive events, find subscribers, and deliver webhooks.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your webhook gateway can deliver events!',
  achievement: 'You implemented the core webhook delivery functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can receive events', after: '✓' },
    { label: 'Can deliver webhooks', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all webhook data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Webhook Delivery: Core Implementation',
  conceptExplanation: `Every webhook gateway needs these **core handlers**:

**1. receive_event(event_type, payload)**
- Accept event from internal service
- Validate event format
- Find all subscribers for this event type
- Queue for delivery

**2. deliver_webhook(endpoint_url, payload)**
- POST payload to customer endpoint
- Include signature in headers
- Handle response (2xx = success, 4xx/5xx = retry)
- Log delivery status

**3. get_webhook_logs(customer_id)**
- Return delivery history for customer
- Include status, timestamps, response codes

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'These handlers are the heart of webhook delivery. Without them, no events reach customers!',

  famousIncident: {
    title: 'GitHub Webhook Delivery Delays',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub\'s webhook delivery system had a bug that caused webhooks to be delayed by several hours during high traffic. CI/CD pipelines broke for thousands of projects.',
    lessonLearned: 'Webhook reliability is critical - delayed webhooks are almost as bad as lost webhooks.',
    icon: '⏱️',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Delivering webhooks at massive scale',
    howTheyDoIt: 'Uses async worker pools with retry queues. Each webhook attempt is tracked with detailed logs.',
  },

  keyPoints: [
    'Accept events from internal services',
    'Find subscribers for each event type',
    'Deliver webhooks via HTTP POST',
    'Track delivery status for observability',
  ],

  quickCheck: {
    question: 'Why should webhook delivery be asynchronous?',
    options: [
      'It\'s faster',
      'Prevents blocking the event producer if customer endpoint is slow',
      'It uses less memory',
      'It\'s required by HTTP',
    ],
    correctIndex: 1,
    explanation: 'Async delivery prevents slow customer endpoints from blocking your internal services. Events are queued and delivered in the background.',
  },

  keyConcepts: [
    { title: 'Event Handler', explanation: 'Function that processes incoming events', icon: '⚙️' },
    { title: 'Webhook Delivery', explanation: 'HTTP POST to customer endpoint', icon: '📤' },
    { title: 'Delivery Log', explanation: 'Record of webhook attempts and results', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'webhook-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Receive events, FR-2: Deliver webhooks, FR-6: Track logs',
    taskDescription: 'Configure APIs and implement Python handlers for webhook delivery',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/events, POST /api/v1/webhooks/deliver, GET /api/v1/webhooks/logs APIs',
      'Open the Python tab',
      'Implement receive_event(), deliver_webhook(), and get_logs() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign webhook endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for receive_event, deliver_webhook, and get_logs',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/events', 'POST /api/v1/webhooks/deliver', 'GET /api/v1/webhooks/logs'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Webhook Logs and Event Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your webhook gateway crashed at 3 AM...",
  hook: "When it restarted, ALL webhook logs were GONE! Customers can't see delivery history. Pending webhooks were lost!",
  challenge: "Add a database so webhook data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your webhook data is safe!',
  achievement: 'Events and delivery logs now persist across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Webhook durability', after: '100%' },
  ],
  nextTeaser: "But webhook delivery is getting slow with high volume...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Webhooks',
  conceptExplanation: `For webhook systems, losing data is **catastrophic**.

A **database** provides:
- **Durability**: Webhook logs survive crashes
- **Queryability**: Customers can search delivery history
- **Audit trail**: Regulatory compliance and debugging

For webhook gateways, we need tables for:
- \`webhook_events\` - All incoming events
- \`webhook_deliveries\` - Delivery attempts and results
- \`webhook_subscriptions\` - Customer endpoint configurations
- \`webhook_signatures\` - HMAC secrets per customer`,

  whyItMatters: 'Without persistent logs:\n1. Can\'t debug failed webhooks\n2. Can\'t retry lost events\n3. No audit trail for compliance\n4. Customers lose trust',

  famousIncident: {
    title: 'Twilio Webhook Incident',
    company: 'Twilio',
    year: '2020',
    whatHappened: 'A database failure caused Twilio to lose webhook delivery logs for several hours. Customers couldn\'t debug why webhooks failed, causing support tickets to spike.',
    lessonLearned: 'Webhook logs are critical for customer success - database reliability is non-negotiable.',
    icon: '📞',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Storing billions of webhook delivery logs',
    howTheyDoIt: 'Uses PostgreSQL for webhook metadata and time-series DB for delivery logs. Customers can query 30 days of history.',
  },

  keyPoints: [
    'Store all webhook events in database',
    'Log every delivery attempt with timestamp and result',
    'Use time-series DB for efficient log queries',
    'Keep webhook logs for at least 30 days',
  ],

  quickCheck: {
    question: 'What happens to in-memory webhook logs when a server restarts?',
    options: [
      'They\'re automatically backed up',
      'They\'re restored from cache',
      'They\'re completely lost',
      'They\'re saved to disk first',
    ],
    correctIndex: 2,
    explanation: 'In-memory data is volatile. When the process restarts, all logs are gone. This is why databases are essential.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server crashes', icon: '🛡️' },
    { title: 'Audit Trail', explanation: 'Complete history of webhook deliveries', icon: '📜' },
    { title: 'Time-Series DB', explanation: 'Optimized for timestamped log data', icon: '📈' },
  ],
};

const step3: GuidedStep = {
  id: 'webhook-gateway-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent, reliable storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store events, logs, subscriptions with durability', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Rate Limiting and Endpoint Status
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔥',
  scenario: "A customer's endpoint is failing, and your gateway is hammering it with retries!",
  hook: "Every second, 100 webhooks are being sent to a broken endpoint. Their server is overwhelmed. You need rate limiting!",
  challenge: "Add a cache to track rate limits and endpoint health per customer.",
  illustration: 'server-overload',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Rate limiting protects customer endpoints!',
  achievement: 'Caching enables smart delivery throttling',
  metrics: [
    { label: 'Rate limit checks', after: '<1ms' },
    { label: 'Endpoint protection', after: 'Enabled' },
    { label: 'Cache hit rate', after: '99%' },
  ],
  nextTeaser: "But we need better retry logic with exponential backoff...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Rate Limiting for Webhook Delivery',
  conceptExplanation: `A **cache** enables fast rate limiting and endpoint tracking.

For webhook gateways, we cache:
- **Rate limit counters** - Requests per minute per endpoint
- **Endpoint health** - Is endpoint currently failing?
- **Backoff state** - Exponential backoff delay per endpoint
- **Recent delivery results** - Quick access to retry decisions

Instead of hitting the database for every delivery decision:
\`\`\`
redis.incr("rate:endpoint:customer_xyz")
if count > 100:
    queue_for_later()
\`\`\`

This protects customer endpoints from being overwhelmed!`,

  whyItMatters: 'Without rate limiting:\n1. Failed endpoints get hammered with retries\n2. Customer servers crash from traffic\n3. Your IP gets blacklisted\n4. Waste bandwidth on doomed deliveries',

  famousIncident: {
    title: 'Shopify Webhook Rate Limiting',
    company: 'Shopify',
    year: '2019',
    whatHappened: 'During a major sale, Shopify\'s webhook system didn\'t have proper rate limiting. Some merchant endpoints were hit with 10,000+ webhooks per minute, crashing their servers.',
    lessonLearned: 'Rate limiting protects both you and your customers. It\'s not optional.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Protecting millions of merchant endpoints',
    howTheyDoIt: 'Uses Redis to track rate limits per endpoint. Max 100 webhooks/min per endpoint. Backs off exponentially on failures.',
  },

  diagram: `
┌────────────┐     ┌─────────────┐     ┌───────┐
│ App Server │ ──▶ │ Redis Cache │     │  DB   │
│            │     │             │     └───────┘
│ Check:     │     │ rate:ep_xyz │
│ Can send?  │◀────│ count: 95   │
└────────────┘     │ limit: 100  │
                   └─────────────┘
`,

  keyPoints: [
    'Use Redis for fast rate limit counters',
    'Track per-endpoint request counts',
    'Store endpoint health status in cache',
    'Implement circuit breaker pattern for failing endpoints',
  ],

  quickCheck: {
    question: 'Why use cache for rate limiting instead of database?',
    options: [
      'It\'s cheaper',
      'Sub-millisecond lookups - can\'t afford DB query on every webhook',
      'It\'s easier to implement',
      'Databases can\'t do counters',
    ],
    correctIndex: 1,
    explanation: 'At 2,315 webhooks/sec peak, every delivery needs a rate limit check. Redis gives <1ms lookups vs 10-50ms for DB.',
  },

  keyConcepts: [
    { title: 'Rate Limiting', explanation: 'Limit requests per endpoint per time window', icon: '🚦' },
    { title: 'Circuit Breaker', explanation: 'Stop sending to failing endpoints temporarily', icon: '🔌' },
    { title: 'Backoff State', explanation: 'Track exponential delay per endpoint', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'webhook-gateway-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from rate limiting protection',
    taskDescription: 'Add a Redis cache for rate limiting and endpoint tracking',
    componentsNeeded: [
      { type: 'cache', reason: 'Track rate limits and endpoint health', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (60 seconds for rate limit windows)',
      'Cache strategy set (write-through)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 60 seconds, strategy to write-through',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'write-through' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Async Delivery and Retry Logic
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "A webhook delivery just failed because the customer endpoint is down!",
  hook: "Without retry logic, that event is lost forever. The customer's order won't be fulfilled!",
  challenge: "Add a message queue to implement reliable retry logic with exponential backoff.",
  illustration: 'webhook-failure',
};

const step5Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Webhooks now retry automatically!',
  achievement: 'Exponential backoff ensures eventual delivery',
  metrics: [
    { label: 'Delivery success rate', before: '75%', after: '99.5%' },
    { label: 'Retry attempts', after: 'Up to 10 retries/24hrs' },
    { label: 'Auto-retry', after: 'Enabled' },
  ],
  nextTeaser: "But webhooks need signature verification for security...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Reliable Retry with Exponential Backoff',
  conceptExplanation: `**The Retry Problem:**
- Customer endpoints fail (downtime, deploys, errors)
- Synchronous delivery = immediate failure
- No retry = lost events = broken customer workflows

**Solution: Message Queue with Retry Logic**
1. Event arrives → Queue immediately → Return success
2. Worker attempts delivery
3. If fails → Requeue with delay: 1s, 2s, 4s, 8s, 16s, 32s...
4. Exponential backoff prevents hammering
5. After 10 attempts (24hrs) → Dead letter queue

**Retry Schedule:**
- Attempt 1: Immediate
- Attempt 2: +1s
- Attempt 3: +2s
- Attempt 4: +4s
- Attempt 5: +8s
- ...
- Attempt 10: +1hr
- After 24hrs: Dead letter queue`,

  whyItMatters: 'Customer endpoints fail all the time:\n- Deployments\n- Network issues\n- Rate limits\n- Server crashes\n\nRetry logic is what makes webhooks reliable!',

  famousIncident: {
    title: 'Stripe Webhook Retry Incident',
    company: 'Stripe',
    year: '2021',
    whatHappened: 'A bug in Stripe\'s retry logic caused some webhooks to retry too aggressively, overwhelming merchant servers. They had to implement better backoff and circuit breakers.',
    lessonLearned: 'Exponential backoff is crucial - linear retry or too-fast backoff can DoS customer endpoints.',
    icon: '💳',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Retrying millions of failed webhooks daily',
    howTheyDoIt: 'Uses SQS delay queues for exponential backoff. Each retry is scheduled with increasing delays. Dead letter queue for manual review.',
  },

  diagram: `
Event Arrives
      │
      ▼
┌─────────────┐     ┌──────────────────────┐
│ App Server  │────▶│   Message Queue      │
│ (instant)   │     │   [webhook events]   │
└─────────────┘     └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │ Delivery Workers │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    ▼                  ▼
              Success             Failed
              (done!)        (requeue with delay)
                                      │
                          ┌───────────┴──────────┐
                          ▼                      ▼
                    Retry 1-9           Retry 10 failed
                  (exponential)       (dead letter queue)
`,

  keyPoints: [
    'Queue decouples event ingestion from delivery',
    'Workers consume queue and attempt delivery',
    'Failed deliveries requeue with exponential backoff',
    'Dead letter queue after max retries',
  ],

  quickCheck: {
    question: 'Why use exponential backoff instead of constant retry interval?',
    options: [
      'It\'s easier to implement',
      'Gives customer time to recover without hammering their endpoint',
      'It\'s faster',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Exponential backoff starts fast (quick retry for transient errors) but backs off to avoid overwhelming a struggling endpoint.',
  },

  keyConcepts: [
    { title: 'Exponential Backoff', explanation: 'Retry delay: 1s, 2s, 4s, 8s, 16s...', icon: '📈' },
    { title: 'Dead Letter Queue', explanation: 'Failed webhooks after all retries', icon: '☠️' },
    { title: 'Async Processing', explanation: 'Decouple ingestion from delivery', icon: '⚡' },
  ],
};

const step5: GuidedStep = {
  id: 'webhook-gateway-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Retry failed deliveries with exponential backoff',
    taskDescription: 'Add a Message Queue for async delivery with retry logic',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Enable async delivery with exponential backoff', displayName: 'SQS' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

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
    level1: 'Drag a Message Queue (SQS) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async delivery with automatic retries.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Implement HMAC Signature Verification
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔐',
  scenario: "SECURITY ALERT! A customer just got attacked by fake webhooks!",
  hook: "An attacker sent spoofed payment.succeeded webhooks to their endpoint. They fulfilled fake orders and lost thousands of dollars!",
  challenge: "Implement HMAC signature verification so customers can verify webhooks are authentic.",
  illustration: 'security-breach',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Webhooks are now cryptographically signed!',
  achievement: 'HMAC signatures prevent webhook spoofing',
  metrics: [
    { label: 'Security', after: 'HMAC-SHA256 enabled' },
    { label: 'Spoofing prevention', after: '✓' },
    { label: 'Customer verification', after: 'Available' },
  ],
  nextTeaser: "But we need load balancing to scale delivery workers...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'HMAC Signatures: Preventing Webhook Spoofing',
  conceptExplanation: `**The Security Problem:**
Without signatures, anyone can POST to a customer endpoint and claim to be you!

**Solution: HMAC Signatures**
1. Generate a **secret key** per customer
2. For each webhook, compute HMAC:
   \`\`\`
   signature = HMAC_SHA256(secret_key, payload)
   \`\`\`
3. Send signature in header:
   \`\`\`
   X-Webhook-Signature: sha256=abc123...
   \`\`\`
4. Customer recomputes HMAC with their secret
5. If signatures match → webhook is authentic ✓

**HMAC Properties:**
- One-way: Can't forge signature without secret key
- Deterministic: Same input always produces same signature
- Fast: Sub-millisecond computation`,

  whyItMatters: 'Without signatures:\n1. Attackers send fake webhooks\n2. Customer fulfills fake orders\n3. Customer loses money\n4. Customer loses trust in your platform',

  famousIncident: {
    title: 'Shopify Webhook Verification Bypass',
    company: 'Shopify',
    year: '2015',
    whatHappened: 'Researchers found some Shopify apps weren\'t verifying webhook signatures. Attackers exploited this to send fake order webhooks, causing merchants to ship products for free.',
    lessonLearned: 'Webhook signatures must be verified - it\'s the customer\'s responsibility, but the platform must make it easy and document it clearly.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Signing billions of webhooks',
    howTheyDoIt: 'Uses HMAC-SHA256 with unique secrets per merchant. Provides libraries in every language to verify signatures easily.',
  },

  diagram: `
Webhook Gateway:
1. event_payload = {"type": "payment.succeeded", ...}
2. signature = HMAC_SHA256(customer_secret, payload)
3. POST to customer endpoint with header:
   X-Webhook-Signature: sha256=abc123...

Customer Endpoint:
1. Receives webhook + signature
2. Recomputes: HMAC_SHA256(my_secret, payload)
3. Compare signatures
4. If match → Process ✓
   If mismatch → Reject (possible attack!)
`,

  keyPoints: [
    'Generate unique secret key per customer',
    'Sign every webhook with HMAC-SHA256',
    'Include signature in HTTP header',
    'Customers verify signature before processing',
  ],

  quickCheck: {
    question: 'Why is HMAC-SHA256 better than just hashing the payload?',
    options: [
      'It\'s faster',
      'Uses a secret key - attacker can\'t forge signature without it',
      'It creates smaller signatures',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'HMAC requires a secret key. Even if attacker knows the payload, they can\'t create a valid signature without the secret.',
  },

  keyConcepts: [
    { title: 'HMAC', explanation: 'Hash-based Message Authentication Code', icon: '🔐' },
    { title: 'Signature', explanation: 'Cryptographic proof of authenticity', icon: '✍️' },
    { title: 'Secret Key', explanation: 'Shared secret between you and customer', icon: '🔑' },
  ],
};

const step6: GuidedStep = {
  id: 'webhook-gateway-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Sign webhooks with HMAC for verification',
    taskDescription: 'Update webhook delivery code to include HMAC signatures',
    successCriteria: [
      'Click on App Server',
      'Open Python tab',
      'Implement generate_signature() using HMAC-SHA256',
      'Add X-Webhook-Signature header to webhook deliveries',
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
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on App Server, go to Python tab. Find the generate_signature() TODO',
    level2: 'Use hmac.new(secret_key, payload, hashlib.sha256) to create the signature. Add it to webhook headers as X-Webhook-Signature.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer for Worker Scaling
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Black Friday is here! Webhook volume just spiked 10x to 20,000/sec!",
  hook: "Your single app server can't keep up. The message queue is backing up. Delivery delays are increasing!",
  challenge: "Add a load balancer to scale webhook delivery workers horizontally.",
  illustration: 'server-overload',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Webhook workers now scale horizontally!',
  achievement: 'Load balancer enables parallel delivery at massive scale',
  metrics: [
    { label: 'Delivery capacity', before: '1,000 webhooks/sec', after: '20,000+ webhooks/sec' },
    { label: 'Worker instances', after: 'Auto-scaled' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "But we need database replication for reliability...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Scale Webhook Workers',
  conceptExplanation: `A **Load Balancer** distributes webhook delivery work across multiple workers.

For webhook gateways:
- **Event ingestion** → Load balanced across API servers
- **Webhook delivery** → Load balanced worker pool
- **Queue consumption** → Each worker pulls from queue

Benefits:
- **Horizontal scaling** - Add more workers during peak traffic
- **High availability** - If one worker crashes, others continue
- **Even distribution** - No single worker gets overwhelmed
- **Auto-scaling** - Scale workers based on queue depth

Unlike WebSocket systems, webhooks DON'T need sticky sessions!`,

  whyItMatters: 'At peak (2,315 webhooks/sec), a single server can\'t handle the load. Load balancing is essential for scaling.',

  famousIncident: {
    title: 'SendGrid Webhook Processing Delays',
    company: 'SendGrid',
    year: '2019',
    whatHappened: 'SendGrid\'s webhook delivery workers couldn\'t scale fast enough during a major email campaign. Delivery delays reached several hours, breaking customer email analytics.',
    lessonLearned: 'Webhook workers must auto-scale based on queue depth. Manual scaling is too slow for sudden traffic spikes.',
    icon: '📧',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Handling massive webhook volume',
    howTheyDoIt: 'Uses Kubernetes to auto-scale webhook workers based on SQS queue depth. Can scale from 10 to 1,000+ workers in minutes.',
  },

  diagram: `
              ┌─────────────────┐
              │  Worker 1       │
              │  (queue consume)│
┌──────────┐  ┌──────────────────┐  └─────────────────┘
│ Queue    │─▶│ Load Balancer   │─▶ Worker 2
│ (events) │  │ (distribute)    │  ┌─────────────────┐
└──────────┘  └──────────────────┘  │  Worker 3       │
                                    └─────────────────┘

Auto-scale: More workers when queue depth > 1000
`,

  keyPoints: [
    'Load balancer distributes work across workers',
    'Each worker pulls from message queue',
    'Auto-scale workers based on queue depth',
    'No sticky sessions needed for webhooks',
  ],

  quickCheck: {
    question: 'Why don\'t webhook workers need sticky sessions?',
    options: [
      'Webhook delivery is stateless - any worker can deliver any webhook',
      'It\'s faster without sticky sessions',
      'Sticky sessions are too expensive',
      'Webhooks don\'t use HTTP',
    ],
    correctIndex: 0,
    explanation: 'Unlike WebSocket connections, webhook delivery is stateless. Each webhook can be delivered by any worker.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes work across workers', icon: '⚖️' },
    { title: 'Worker Pool', explanation: 'Multiple processes consuming queue', icon: '👷' },
    { title: 'Auto-Scaling', explanation: 'Dynamically adjust worker count', icon: '📊' },
  ],
};

const step7: GuidedStep = {
  id: 'webhook-gateway-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from scalable delivery',
    taskDescription: 'Add a Load Balancer to distribute webhook delivery work',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute delivery work across workers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
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
// STEP 8: Add Database Replication for Reliability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚠️',
  scenario: "EMERGENCY! Your database crashed for 15 minutes last night!",
  hook: "During that time:\n- No webhooks were delivered\n- Customers lost critical events\n- Your SLA was violated\n- Trust is damaged",
  challenge: "Add database replication so webhook data survives failures.",
  illustration: 'database-failure',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a Webhook Gateway!',
  achievement: 'A reliable, scalable, secure webhook delivery platform',
  metrics: [
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Delivery success rate', after: '99.5%' },
    { label: 'Peak throughput', after: '20,000 webhooks/sec' },
    { label: 'Security', after: 'HMAC signed' },
    { label: 'Rate limiting', after: 'Enabled' },
  ],
  nextTeaser: "You've mastered webhook system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Webhook Data',
  conceptExplanation: `For webhook systems, database replication is **CRITICAL**.

**Types of Replication:**
1. **Asynchronous** - Write to primary, replicate later
   - Faster writes
   - Can lose recent data on failure
   - Use for: Webhook logs (acceptable loss)

2. **Synchronous** - Write to primary AND replicas
   - Slower writes
   - Zero data loss
   - Use for: Webhook subscriptions (critical)

**Architecture:**
- **Primary**: Handles all writes
- **Replicas**: Handle reads, stay in sync
- **Failover**: Promote replica if primary fails

For webhook gateways:
- Event metadata → Synchronous replication
- Delivery logs → Asynchronous replication (volume is high)`,

  whyItMatters: 'Webhook gateway failure means:\n1. Customer events are lost\n2. Business workflows break\n3. Revenue loss\n4. SLA violations and refunds\n5. Customer churn',

  famousIncident: {
    title: 'AWS SNS Webhook Outage',
    company: 'Amazon SNS',
    year: '2020',
    whatHappened: 'A database failure in SNS (Amazon\'s notification service) caused webhook deliveries to stop for several hours. Thousands of applications lost critical notifications.',
    lessonLearned: 'Database replication with tested failover is non-negotiable for notification systems.',
    icon: '📢',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Zero tolerance for webhook data loss',
    howTheyDoIt: 'Uses PostgreSQL with synchronous replication for webhook metadata. Asynchronous replication for high-volume delivery logs.',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         └────────┬─────────┘
                                  │ Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Use synchronous replication for critical webhook metadata',
    'Use asynchronous replication for high-volume logs',
    'Primary handles writes, replicas handle reads',
    'If primary fails, promote a replica (failover)',
  ],

  quickCheck: {
    question: 'Why use async replication for webhook logs but sync for subscriptions?',
    options: [
      'Async is cheaper',
      'Logs are high volume (performance) vs subscriptions are critical (can\'t lose)',
      'Sync is harder to implement',
      'Logs don\'t need durability',
    ],
    correctIndex: 1,
    explanation: 'Webhook logs are high volume - sync replication would slow writes. Subscriptions are low volume but critical - losing them breaks delivery.',
  },

  keyConcepts: [
    { title: 'Async Replication', explanation: 'Fast writes, eventual consistency', icon: '⚡' },
    { title: 'Sync Replication', explanation: 'Slower writes, zero data loss', icon: '🔒' },
    { title: 'Failover', explanation: 'Automatic replica promotion', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'webhook-gateway-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs require reliable webhook storage',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
      'Set replication mode to asynchronous (acceptable for webhook logs)',
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
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2+. Choose async mode for high-volume webhook logs.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2, mode: 'asynchronous' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const webhookGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'webhook-gateway',
  title: 'Design a Webhook Gateway',
  description: 'Build a reliable webhook delivery platform with retry logic, signatures, and rate limiting',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📡',
    hook: "You've been hired as Lead Engineer at WebhookCo!",
    scenario: "Your mission: Build a webhook delivery gateway that can reliably deliver millions of webhooks per day with retry logic, signature verification, and rate limiting.",
    challenge: "Can you design a system that guarantees delivery even when customer endpoints fail?",
  },

  requirementsPhase: webhookGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Webhook Architecture',
    'Async Event Processing',
    'Exponential Backoff Retry',
    'HMAC Signature Verification',
    'Rate Limiting',
    'Message Queues',
    'Dead Letter Queues',
    'Circuit Breaker Pattern',
    'Load Balancing',
    'Database Replication',
    'At-Least-Once Delivery',
    'Idempotency',
  ],

  ddiaReferences: [
    'Chapter 11: Stream Processing & Message Queues',
    'Chapter 8: Distributed Systems (At-least-once delivery)',
    'Chapter 5: Replication',
    'Chapter 12: The Future of Data Systems (Reliability)',
  ],
};

export default webhookGatewayGuidedTutorial;
