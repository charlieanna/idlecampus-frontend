import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Email Queue System Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a high-throughput email delivery platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working system (FR satisfaction)
 * Steps 5-10: Scale with NFRs (queues, rate limiting, delivery guarantees, bounce handling)
 *
 * Key Concepts:
 * - Message queuing and async processing
 * - Delivery guarantees (at-least-once, exactly-once)
 * - Rate limiting and throttling
 * - Bounce handling and retry logic
 * - Priority queues
 * - Dead letter queues
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const emailQueueSystemRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a high-throughput email delivery system like SendGrid or Amazon SES",

  interviewer: {
    name: 'Michael Rodriguez',
    role: 'Principal Engineer at EmailTech Systems',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-email',
      category: 'functional',
      question: "What are the core features needed for an email delivery system?",
      answer: "Users (applications/companies) need to:\n\n1. **Send emails** - Submit emails via API for delivery\n2. **Track delivery status** - Know if emails were delivered, bounced, or failed\n3. **Handle bounces** - Detect and manage undeliverable emails\n4. **Retry failed deliveries** - Automatically retry temporary failures",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Email delivery is about reliable, asynchronous message delivery with status tracking",
    },
    {
      id: 'email-types',
      category: 'functional',
      question: "What types of emails should we support?",
      answer: "We need to support:\n1. **Transactional emails** - Order confirmations, password resets (high priority)\n2. **Marketing emails** - Newsletters, campaigns (can be delayed)\n3. **Bulk emails** - Large batch sends to many recipients\n\nFor MVP, let's focus on transactional and marketing emails.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Different email types need different priority levels and delivery guarantees",
    },
    {
      id: 'delivery-guarantees',
      category: 'functional',
      question: "What delivery guarantees should we provide?",
      answer: "We need **at-least-once delivery** for all emails:\n- Transactional: Must deliver (retry until success or permanent failure)\n- Marketing: Best effort but retry temporary failures\n\nWe'll use **idempotency** to prevent duplicate sends when retrying.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "At-least-once delivery with idempotency provides reliability without duplicates",
    },
    {
      id: 'bounce-handling',
      category: 'functional',
      question: "How should we handle email bounces?",
      answer: "**Bounces** come in two types:\n1. **Hard bounces** - Permanent failures (invalid email, domain doesn't exist)\n   - Don't retry, mark email as suppressed\n2. **Soft bounces** - Temporary failures (mailbox full, server down)\n   - Retry with exponential backoff for up to 72 hours\n\nWe need to track bounce rates per sender to prevent spam reputation damage.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      insight: "Bounce handling protects sender reputation and email deliverability",
    },
    {
      id: 'rate-limiting',
      category: 'clarification',
      question: "Do we need rate limiting?",
      answer: "Yes! Critical for two reasons:\n1. **Per-sender rate limits** - Prevent abuse, enforce plan quotas\n2. **Per-recipient domain limits** - Gmail accepts max 20 emails/sec, Yahoo 10/sec\n\nExceeding limits damages sender reputation and causes throttling.",
      importance: 'critical',
      insight: "Rate limiting prevents abuse and maintains good relationships with email providers",
    },
    {
      id: 'email-templates',
      category: 'clarification',
      question: "Should we support email templates?",
      answer: "Eventually yes, but for MVP, users can send HTML/text content directly. Templates add complexity with variable substitution and rendering.",
      importance: 'nice-to-have',
      insight: "Templates are important but can be added after core delivery is working",
    },
    {
      id: 'webhooks',
      category: 'functional',
      question: "How should users get delivery status updates?",
      answer: "We'll send **webhooks** for email events:\n- email.delivered\n- email.bounced\n- email.opened (if tracking enabled)\n- email.clicked\n\nUsers provide a webhook URL, we POST events with retry logic.",
      importance: 'important',
      revealsRequirement: 'FR-2',
      learningPoint: "Webhooks enable real-time delivery status notifications",
    },

    // SCALE & NFRs
    {
      id: 'throughput-emails',
      category: 'throughput',
      question: "How many emails should we handle per day?",
      answer: "1 billion emails per day at steady state, with spikes to 5 billion during holiday campaigns",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 emails/sec",
        result: "~12K emails/sec average, ~58K peak",
      },
      learningPoint: "Email volume has extreme spikes - design for 5x peak capacity with queues",
    },
    {
      id: 'throughput-recipients',
      category: 'throughput',
      question: "What's the typical recipient list size for bulk emails?",
      answer: "Marketing campaigns can have 1-10 million recipients. We need to handle batch processing efficiently without overwhelming queues.",
      importance: 'critical',
      learningPoint: "Bulk sends require smart batching and queue partitioning",
    },
    {
      id: 'latency-transactional',
      category: 'latency',
      question: "How quickly should transactional emails be delivered?",
      answer: "p99 under 5 seconds for transactional emails (password resets, order confirmations). Marketing emails can take longer.",
      importance: 'critical',
      learningPoint: "Transactional emails need priority queuing for fast delivery",
    },
    {
      id: 'latency-acceptance',
      category: 'latency',
      question: "How fast should the API accept email submissions?",
      answer: "p99 under 200ms. Users shouldn't wait - accept the email and queue it immediately for async processing.",
      importance: 'critical',
      learningPoint: "API acceptance must be fast - queue everything for async processing",
    },
    {
      id: 'retry-policy',
      category: 'reliability',
      question: "What retry policy should we use for failed deliveries?",
      answer: "**Exponential backoff with jitter:**\n- Retry at: 1min, 5min, 15min, 1hr, 4hr, 12hr, 24hr\n- Maximum 7 retry attempts over 72 hours\n- Add jitter to prevent thundering herd\n- Soft bounces only - hard bounces aren't retried",
      importance: 'critical',
      insight: "Exponential backoff balances persistence with resource efficiency",
    },
    {
      id: 'sender-reputation',
      category: 'reliability',
      question: "How do we protect sender reputation?",
      answer: "Critical for email deliverability:\n1. Monitor bounce rates (>5% is concerning)\n2. Implement suppression lists (hard bounces, complaints)\n3. Rate limit per recipient domain\n4. Validate email addresses before sending\n5. Support SPF, DKIM, DMARC authentication",
      importance: 'critical',
      learningPoint: "Poor sender reputation = emails go to spam. Must monitor and protect.",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-email', 'delivery-guarantees', 'bounce-handling'],
  criticalFRQuestionIds: ['core-email', 'email-types'],
  criticalScaleQuestionIds: ['throughput-emails', 'latency-transactional', 'retry-policy'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Send emails via API',
      description: 'Accept email submission requests and queue for delivery',
      emoji: '📧',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Track delivery status',
      description: 'Provide delivery status (delivered, bounced, failed) via webhooks',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Handle bounces',
      description: 'Detect and categorize hard/soft bounces, maintain suppression lists',
      emoji: '↩️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Retry failed deliveries',
      description: 'Automatically retry soft bounces with exponential backoff',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000 senders',
    writesPerDay: '1 billion emails',
    readsPerDay: '100 million status checks',
    peakMultiplier: 5,
    readWriteRatio: '1:10',
    calculatedWriteRPS: { average: 11574, peak: 57870 },
    calculatedReadRPS: { average: 1157, peak: 5787 },
    maxPayloadSize: '~10MB (email with attachments)',
    storagePerRecord: '~50KB (average email)',
    storageGrowthPerYear: '~18PB',
    redirectLatencySLA: 'p99 < 5s (transactional delivery)',
    createLatencySLA: 'p99 < 200ms (API acceptance)',
  },

  architecturalImplications: [
    '✅ High throughput → Message queue (Kafka/RabbitMQ) required',
    '✅ At-least-once delivery → Retry logic with idempotency',
    '✅ Priority emails → Multiple queue priorities (high/normal/low)',
    '✅ Rate limiting → Redis for per-sender and per-domain throttling',
    '✅ Bounce handling → Dead letter queue for permanent failures',
    '✅ Async processing → Worker pools to consume queues',
    '✅ Sender reputation → Monitoring and suppression list management',
  ],

  outOfScope: [
    'Email template engine',
    'A/B testing for campaigns',
    'Email analytics dashboard',
    'Spam filtering',
    'Attachment virus scanning',
    'Email tracking pixel generation',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can submit emails and they get delivered. Message queuing, rate limiting, and bounce handling will come in later steps. Functionality first, then reliability!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📬',
  scenario: "Welcome to EmailTech Systems! You've been hired to build a high-scale email delivery platform.",
  hook: "A startup just signed up. They need to send password reset emails to their users!",
  challenge: "Set up the basic request flow so applications can submit emails to your API.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your email API is online!',
  achievement: 'Applications can now submit emails to your system',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process emails yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Email API Architecture',
  conceptExplanation: `Every email delivery system starts with a **Client** connecting to an **API Server**.

When an application needs to send an email:
1. The application (web app, mobile backend, etc.) is the **Client**
2. It sends an HTTPS POST request to your **Email API Server**
3. The server accepts the request and returns immediately (async processing)

This is the foundation of systems like SendGrid, Mailgun, Amazon SES.`,

  whyItMatters: 'Without this API, applications can\'t send emails at all. This is the entry point to your entire system.',

  realWorldExample: {
    company: 'SendGrid',
    scenario: 'Handling 100+ billion emails per month',
    howTheyDoIt: 'Started with a simple API server, now uses globally distributed API endpoints with auto-scaling',
  },

  keyPoints: [
    'Client = any application that needs to send emails',
    'Email API Server = accepts email submission requests',
    'HTTPS = secure protocol for API communication',
    'Response is immediate - actual sending happens async',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Application submitting emails via API', icon: '📱' },
    { title: 'API Server', explanation: 'Accepts and validates email requests', icon: '🖥️' },
    { title: 'Async Processing', explanation: 'Accept fast, process in background', icon: '⚡' },
  ],
};

const step1: GuidedStep = {
  id: 'email-queue-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for FR-1: Send emails via API',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications sending emails', displayName: 'Client' },
      { type: 'app_server', reason: 'API server that accepts email requests', displayName: 'App Server' },
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
// STEP 2: Implement Email API (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your API is connected, but it doesn't know how to handle email requests!",
  hook: "An application tried to send a password reset email but got a 404 error.",
  challenge: "Write the Python code to accept email submissions and validate them.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your email API is working!',
  achievement: 'You implemented email submission and validation',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can accept emails', after: '✓' },
    { label: 'Can check status', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all email records are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Email API Implementation: Accept and Validate',
  conceptExplanation: `Every email API needs **handler functions** that process requests.

For an email delivery system, we need:
- \`send_email()\` - Accept email submission, validate, assign ID
- \`get_status()\` - Retrieve delivery status for an email

**Critical validation:**
1. **Email format** - Valid sender/recipient addresses
2. **Content** - Has subject and body
3. **Rate limits** - Check sender hasn't exceeded quota
4. **Idempotency** - Use request ID to prevent duplicates

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Email APIs must validate thoroughly. Invalid emails waste resources and damage sender reputation.',

  famousIncident: {
    title: 'SendGrid Email Delivery Failure',
    company: 'SendGrid',
    year: '2017',
    whatHappened: 'A bug in their email validation allowed malformed emails into the system. This caused downstream delivery failures affecting thousands of customers for 6 hours.',
    lessonLearned: 'Validate email inputs rigorously before accepting them. Bad data in = system failures.',
    icon: '📧',
  },

  realWorldExample: {
    company: 'Amazon SES',
    scenario: 'Processing 57,000+ emails/second at peak',
    howTheyDoIt: 'API servers validate emails, assign unique IDs, then immediately queue for async processing',
  },

  keyPoints: [
    'Validate email addresses (RFC 5322 format)',
    'Check sender reputation and rate limits',
    'Assign unique ID for tracking',
    'Return 200 immediately - queue for processing',
  ],

  quickCheck: {
    question: 'Why should the email API return success immediately instead of waiting for delivery?',
    options: [
      'To save money',
      'Email delivery is async and can take seconds - users shouldn\'t wait',
      'It\'s easier to implement',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Email delivery is asynchronous. API should accept quickly and process in background via queues.',
  },

  keyConcepts: [
    { title: 'Validation', explanation: 'Check email format, content, limits', icon: '✅' },
    { title: 'Idempotency', explanation: 'Same request ID = same result', icon: '🔑' },
    { title: 'Async Accept', explanation: 'Return fast, process in background', icon: '⚡' },
  ],
};

const step2: GuidedStep = {
  id: 'email-queue-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send emails via API, FR-2: Track delivery status',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/emails, GET /api/v1/emails/:id APIs',
      'Open the Python tab',
      'Implement send_email() and get_status() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for send_email and get_status',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/emails', 'GET /api/v1/emails/:id'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Email Records
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed at 3 AM and restarted...",
  hook: "All email records are GONE! Customers can't check delivery status. You have no audit trail.",
  challenge: "Add a database so email records and status survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your email records are safe!',
  achievement: 'Email data now persists with full audit trail',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Audit trail', after: '100%' },
  ],
  nextTeaser: "But emails aren't actually being delivered yet...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Email Audit Trail',
  conceptExplanation: `For email systems, losing data means losing customer trust and violating compliance.

A **database** provides:
- **Durability**: Email records survive crashes
- **Audit trail**: Track every email's journey
- **Status tracking**: Record delivery, bounces, opens, clicks
- **Queries**: Efficient lookups by ID, sender, recipient

For email delivery, we need tables for:
- \`emails\` - Email metadata (sender, recipient, subject, status)
- \`delivery_attempts\` - Each delivery attempt and result
- \`bounces\` - Bounce events and reasons
- \`suppression_list\` - Hard bounces and complaints`,

  whyItMatters: 'Email systems must provide delivery proof for compliance. No database = no audit trail = legal risk.',

  famousIncident: {
    title: 'Mailgun Data Loss Incident',
    company: 'Mailgun',
    year: '2018',
    whatHappened: 'A database failure caused loss of delivery logs for 24 hours. Customers couldn\'t prove emails were sent, causing compliance issues for healthcare and financial services.',
    lessonLearned: 'Email delivery requires permanent, durable storage with replication.',
    icon: '📨',
  },

  realWorldExample: {
    company: 'SendGrid',
    scenario: 'Storing billions of email records',
    howTheyDoIt: 'Uses PostgreSQL with time-series partitioning, keeping 30 days of detailed logs, then archiving to S3',
  },

  keyPoints: [
    'Store email metadata and delivery status',
    'Track all delivery attempts for debugging',
    'Maintain suppression lists (hard bounces)',
    'Use time-series partitioning for scale',
  ],

  quickCheck: {
    question: 'Why is an audit trail critical for email delivery systems?',
    options: [
      'It makes the system faster',
      'Required for compliance, debugging, and proving delivery',
      'It saves money',
      'It improves deliverability',
    ],
    correctIndex: 1,
    explanation: 'Email systems must prove delivery for legal/compliance reasons and debug delivery issues.',
  },

  keyConcepts: [
    { title: 'Audit Trail', explanation: 'Permanent record of all email events', icon: '📜' },
    { title: 'Durability', explanation: 'Data survives server crashes', icon: '🛡️' },
    { title: 'Suppression List', explanation: 'Track addresses to never email again', icon: '🚫' },
  ],
};

const step3: GuidedStep = {
  id: 'email-queue-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage for audit trail',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store email records, delivery status, bounces', displayName: 'PostgreSQL' },
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
// STEP 4: Add Message Queue for Async Email Processing
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your API is working, but emails aren't being delivered!",
  hook: "The API server accepts emails but doesn't actually send them. They're stuck in the database.",
  challenge: "Add a message queue to decouple acceptance from delivery.",
  illustration: 'stuck-emails',
};

const step4Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Emails are flowing through the queue!',
  achievement: 'Async processing decouples API from delivery',
  metrics: [
    { label: 'API response time', before: 'Blocked', after: '<100ms' },
    { label: 'Email processing', after: 'Async via queue' },
  ],
  nextTeaser: "But what if we get a huge spike in email volume?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: The Heart of Email Delivery',
  conceptExplanation: `Message queues are **essential** for email systems. Here's why:

**Without a Queue:**
\`\`\`
API Request → Send Email → Wait for SMTP → Return Response
(Slow! 3-10 seconds per email)
\`\`\`

**With a Queue:**
\`\`\`
API Request → Queue Email → Return Success (< 100ms)
                  ↓
        Background Workers → Send Email
\`\`\`

**Benefits:**
1. **Fast API responses** - Accept and return immediately
2. **Handle spikes** - Queue buffers when workers are busy
3. **Retry failures** - Failed emails stay in queue for retry
4. **Scale workers** - Add more workers independent of API servers

For email delivery, the queue contains:
- Email ID, sender, recipient, content
- Priority (transactional = high, marketing = low)
- Retry count and next retry time`,

  whyItMatters: 'Without queues, API requests block waiting for SMTP delivery. With 12K emails/sec, this is impossible.',

  famousIncident: {
    title: 'Mailchimp Queue Overflow',
    company: 'Mailchimp',
    year: '2019',
    whatHappened: 'A sudden campaign spike (50M emails) overwhelmed their queue capacity. The queue filled up, causing API rejections. Took 6 hours to drain the backlog.',
    lessonLearned: 'Size queues for peak load (5-10x average). Monitor queue depth and alert on saturation.',
    icon: '📮',
  },

  realWorldExample: {
    company: 'SendGrid',
    scenario: 'Processing 57,000 emails/second at peak',
    howTheyDoIt: 'Uses Kafka with multiple partitions, separate queues for transactional vs marketing emails',
  },

  diagram: `
Client sends email
      │
      ▼
┌─────────────┐     ┌──────────────────────────┐
│ API Server  │────▶│    Message Queue         │
│ (instant)   │     │ [email1, email2, ...]    │
└─────────────┘     └──────────┬───────────────┘
      │                        │
      │ Return "Accepted!"     │ Workers consume
      ▼                        ▼
                      ┌──────────────────┐
                      │  Email Workers   │
                      │  (background)    │
                      └────────┬─────────┘
                               │
                               ▼
                         Send via SMTP
`,

  keyPoints: [
    'Queue decouples API acceptance from SMTP delivery',
    'API returns instantly - workers process async',
    'Queue acts as a buffer during traffic spikes',
    'Failed deliveries stay in queue for retry',
  ],

  quickCheck: {
    question: 'What\'s the main benefit of using a message queue for email delivery?',
    options: [
      'Emails are delivered faster',
      'API responds instantly while delivery happens async in background',
      'Emails use less storage',
      'It\'s cheaper',
    ],
    correctIndex: 1,
    explanation: 'Queues decouple API from slow SMTP delivery. API returns fast, workers process emails async.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer between API and workers', icon: '📬' },
    { title: 'Async Processing', explanation: 'Workers process queue in background', icon: '⚙️' },
    { title: 'Decoupling', explanation: 'API and workers scale independently', icon: '🔀' },
  ],
};

const step4: GuidedStep = {
  id: 'email-queue-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send emails via API (now async!)',
    taskDescription: 'Add a Message Queue for async email processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue emails for async delivery by workers', displayName: 'RabbitMQ/Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (RabbitMQ/Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async email processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Rate Limiting
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🚨',
  scenario: "EMERGENCY! A customer is spamming 1 million emails per minute!",
  hook: "Your system is overwhelmed. Other customers' emails are delayed. Email providers are blocking your IP addresses!",
  challenge: "Add a cache to implement rate limiting per sender and per recipient domain.",
  illustration: 'spam-attack',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚦',
  message: 'Rate limiting is protecting your system!',
  achievement: 'Per-sender and per-domain limits prevent abuse',
  metrics: [
    { label: 'Spam prevention', after: 'Enabled' },
    { label: 'Rate limiting', after: '✓' },
    { label: 'IP reputation', after: 'Protected' },
  ],
  nextTeaser: "But we need to handle delivery failures and retries...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting: Protecting Sender Reputation',
  conceptExplanation: `Rate limiting is **critical** for email systems. Without it, you face:

**Problems:**
1. **Spam abuse** - Customers send unlimited emails
2. **IP blacklisting** - Gmail/Yahoo block your IPs
3. **Resource exhaustion** - System overwhelmed
4. **Reputation damage** - Marked as spam sender

**Two types of rate limits:**

**1. Per-Sender Limits** (customer quotas)
\`\`\`
Starter plan: 1,000 emails/day
Pro plan: 100,000 emails/day
Enterprise: Unlimited
\`\`\`

**2. Per-Recipient Domain Limits** (ISP throttling)
\`\`\`
Gmail: 20 emails/second max
Yahoo: 10 emails/second max
Custom domains: 5 emails/second
\`\`\`

**Implementation with Redis:**
\`\`\`python
# Check per-sender limit
key = f"rate_limit:sender:{sender_id}:{current_minute}"
count = redis.incr(key)
redis.expire(key, 60)
if count > limit: reject()

# Check per-domain limit
key = f"rate_limit:domain:{recipient_domain}:{current_second}"
count = redis.incr(key)
redis.expire(key, 1)
if count > domain_limit: queue_for_later()
\`\`\``,

  whyItMatters: 'Without rate limiting, one abusive customer can:\n1. Overwhelm your system\n2. Get your IPs blacklisted\n3. Ruin deliverability for all customers',

  famousIncident: {
    title: 'Amazon SES IP Blacklisting',
    company: 'Amazon SES',
    year: '2016',
    whatHappened: 'Multiple customers were spamming from shared IP pools without proper rate limiting. Gmail blacklisted entire IP ranges, affecting thousands of legitimate senders for weeks.',
    lessonLearned: 'Rate limiting is non-negotiable. Protect reputation at all costs.',
    icon: '🔴',
  },

  realWorldExample: {
    company: 'SendGrid',
    scenario: 'Enforcing rate limits on 100K+ senders',
    howTheyDoIt: 'Uses Redis Cluster with sliding window counters, separate limits per plan tier and recipient domain',
  },

  diagram: `
Email Request
      │
      ▼
┌──────────────────┐
│   API Server     │
│                  │
│  Check Redis:    │──────▶ Redis Cache
│  1. Sender quota │        - sender:123:minute_45 → 987 emails
│  2. Domain limit │        - domain:gmail.com:sec_12 → 18 emails
│                  │
│  Under limit? ─┐ │
│               YES→ Queue email
│                NO→ Return 429 Too Many Requests
└──────────────────┘
`,

  keyPoints: [
    'Use Redis for fast rate limit checks',
    'Implement per-sender quotas (plan-based)',
    'Enforce per-domain limits (Gmail, Yahoo, etc.)',
    'Return 429 status code when limit exceeded',
  ],

  quickCheck: {
    question: 'Why do we need per-recipient-domain rate limits in addition to per-sender limits?',
    options: [
      'To save money',
      'Email providers like Gmail limit how many emails they accept per second',
      'It makes emails faster',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'Gmail accepts max 20 emails/sec, Yahoo 10/sec. Exceeding this gets your IPs throttled or blocked.',
  },

  keyConcepts: [
    { title: 'Rate Limiting', explanation: 'Restrict requests per time window', icon: '🚦' },
    { title: 'Sliding Window', explanation: 'Rate limit over rolling time period', icon: '⏱️' },
    { title: 'Sender Reputation', explanation: 'ISPs track if you send spam', icon: '⭐' },
  ],
};

const step5: GuidedStep = {
  id: 'email-queue-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs protected by rate limiting',
    taskDescription: 'Add a Redis cache for rate limiting',
    componentsNeeded: [
      { type: 'cache', reason: 'Track rate limits per sender and domain', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache strategy configured for rate limiting',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache for rate limit tracking',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'write-through' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Black Friday campaign! Email volume just spiked 10x to 120K emails/sec!",
  hook: "Your single API server is maxed out. Request timeouts everywhere. Customers are furious!",
  challenge: "Add a load balancer to distribute API traffic across multiple servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Traffic is distributed across servers!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'API capacity', before: '1K RPS', after: 'Ready to scale' },
  ],
  nextTeaser: "But we need database redundancy for reliability...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Scaling Email APIs',
  conceptExplanation: `A **Load Balancer** distributes incoming API requests across multiple servers.

**Benefits for email systems:**
1. **No single point of failure** - If one API server crashes, others handle traffic
2. **Horizontal scaling** - Add more servers during campaigns
3. **Even distribution** - Balance load across servers
4. **Health checks** - Route around unhealthy servers

**Load balancing strategies:**
- **Round-robin** - Distribute evenly across servers
- **Least connections** - Send to server with fewest active connections
- **IP hash** - Same client always goes to same server (for sticky sessions)

For email APIs, round-robin or least connections work best.`,

  whyItMatters: 'At 57K emails/sec peak, a single API server can\'t handle the load. Load balancers are essential.',

  famousIncident: {
    title: 'Mailgun API Outage',
    company: 'Mailgun',
    year: '2020',
    whatHappened: 'During a holiday campaign, their load balancer failed to distribute traffic properly. All requests went to one server, which crashed. Cascading failure took down the entire API for 3 hours.',
    lessonLearned: 'Load balancers are critical infrastructure. Must be redundant with health checks.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Amazon SES',
    scenario: 'Handling global email volume',
    howTheyDoIt: 'Uses AWS ELB with auto-scaling groups, distributes across availability zones',
  },

  diagram: `
              ┌─────────────┐
              │ API Server 1│
┌────────┐   ┌──────────────┐   └─────────────┘
│ Client │──▶│Load Balancer │──▶ API Server 2
└────────┘   └──────────────┘   ┌─────────────┐
              │ API Server 3│
              └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes API requests',
    'Enables horizontal scaling (add more servers)',
    'Health checks detect and route around failures',
    'Essential for handling traffic spikes',
  ],

  quickCheck: {
    question: 'What happens if one API server crashes with a load balancer?',
    options: [
      'All requests fail',
      'Load balancer routes traffic to healthy servers',
      'Requests are queued',
      'Database takes over',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers via health checks and route to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Health Check', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for capacity', icon: '📈' },
  ],
};

const step6: GuidedStep = {
  id: 'email-queue-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute API traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
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
// STEP 7: Add Database Replication for Reliability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚠️',
  scenario: "CRITICAL! Your database crashed for 20 minutes last night.",
  hook: "During downtime:\n- API rejected all emails\n- No delivery status available\n- Lost audit trail\n- Customers threatening to leave",
  challenge: "Add database replication so you never lose email records.",
  illustration: 'database-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Email data is now fault-tolerant!',
  achievement: 'Replication ensures high availability and zero data loss',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we still need to handle bounce events...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Email Records',
  conceptExplanation: `For email systems, database replication is **mandatory** for:

1. **High availability** - If primary fails, replica takes over
2. **Zero data loss** - Multiple copies of email records
3. **Read scaling** - Status queries go to replicas
4. **Disaster recovery** - Replicas in different data centers

**Types:**
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Stay in sync, handle reads

**For email systems:**
- Use **synchronous replication** for writes (no data loss)
- Route status queries to **replicas** (read scaling)
- Keep **at least 2 replicas** in different availability zones`,

  whyItMatters: 'Email records must be durable. Losing data = compliance violations, no audit trail, customer churn.',

  famousIncident: {
    title: 'Postmark Database Failure',
    company: 'Postmark',
    year: '2019',
    whatHappened: 'Their primary database failed and replica promotion took 15 minutes. During that time, email API was down, costing customers thousands in lost transactions.',
    lessonLearned: 'Automated failover is critical. Manual failover takes too long.',
    icon: '📧',
  },

  realWorldExample: {
    company: 'SendGrid',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses PostgreSQL with streaming replication across 3 availability zones, automated failover',
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
    'Primary handles writes, replicas handle reads',
    'Synchronous replication prevents data loss',
    'Automated failover promotes replica when primary fails',
    'Minimum 2 replicas in different zones',
  ],

  quickCheck: {
    question: 'Why do email systems need database replication?',
    options: [
      'To make queries faster',
      'To ensure email records survive database failures',
      'To save money',
      'To reduce storage',
    ],
    correctIndex: 1,
    explanation: 'Replication ensures email records and audit trails survive database failures.',
  },

  keyConcepts: [
    { title: 'Replication', explanation: 'Multiple copies of data', icon: '📋' },
    { title: 'Failover', explanation: 'Promote replica when primary fails', icon: '🔄' },
    { title: 'Read Scaling', explanation: 'Distribute reads across replicas', icon: '📊' },
  ],
};

const step7: GuidedStep = {
  id: 'email-queue-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs require reliable data storage',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2. This ensures email records survive failures.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Worker Service for Email Processing
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Emails are piling up in the queue but not being delivered!",
  hook: "The queue has 500,000 emails waiting. Nothing is consuming them. Customers are angry about delays.",
  challenge: "Add worker services to consume the queue and actually deliver emails via SMTP.",
  illustration: 'queue-backlog',
};

const step8Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Emails are being delivered!',
  achievement: 'Worker pools process emails from queue via SMTP',
  metrics: [
    { label: 'Queue backlog', before: '500K', after: 'Draining' },
    { label: 'Emails delivered/sec', after: '5,000+' },
  ],
  nextTeaser: "But we need to handle bounces and retry failed deliveries...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Worker Services: The Email Delivery Engine',
  conceptExplanation: `Workers are **background services** that consume the queue and deliver emails.

**Architecture:**
1. Workers pull emails from queue (FIFO or priority-based)
2. Connect to SMTP server to deliver
3. Update database with delivery status
4. Handle failures (soft bounce = retry, hard bounce = suppress)

**Worker Pool:**
- Run **multiple workers** in parallel (10-100+)
- Each worker processes one email at a time
- Workers auto-scale based on queue depth
- Separate workers for transactional (high priority) vs marketing (low priority)

**Delivery Process:**
\`\`\`python
while True:
    email = queue.consume()
    result = smtp.send(email)

    if result.success:
        db.update_status(email.id, 'delivered')
    elif result.soft_bounce:
        queue.retry_later(email)  # Exponential backoff
    elif result.hard_bounce:
        db.add_to_suppression_list(email.recipient)
\`\`\``,

  whyItMatters: 'Without workers, emails sit in the queue forever. Workers are the engine that actually delivers emails.',

  famousIncident: {
    title: 'SendGrid Worker Crash',
    company: 'SendGrid',
    year: '2018',
    whatHappened: 'A bug in worker code caused all workers to crash simultaneously. Queue backed up to 10M emails. Took 8 hours to recover and clear the backlog.',
    lessonLearned: 'Workers must be fault-tolerant. Use circuit breakers and health monitoring.',
    icon: '⚙️',
  },

  realWorldExample: {
    company: 'Amazon SES',
    scenario: 'Delivering 57,000 emails/second at peak',
    howTheyDoIt: 'Uses thousands of worker instances auto-scaling based on queue depth, separate pools per priority',
  },

  diagram: `
┌──────────────────────┐
│   Message Queue      │
│  [email1, email2...] │
└──────────┬───────────┘
           │
    ┌──────┴────────┐
    ▼               ▼
┌─────────┐    ┌─────────┐     ┌──────────────┐
│Worker 1 │    │Worker 2 │ ──▶ │ SMTP Server  │
└─────────┘    └─────────┘     │ (delivery)   │
    │               │           └──────────────┘
    ▼               ▼
┌──────────────────────┐
│ Update Database      │
│ - status: delivered  │
│ - timestamp          │
└──────────────────────┘
`,

  keyPoints: [
    'Workers consume queue and deliver emails via SMTP',
    'Run multiple workers in parallel for throughput',
    'Auto-scale workers based on queue depth',
    'Update database with delivery status',
  ],

  quickCheck: {
    question: 'Why do we need multiple worker instances instead of just one?',
    options: [
      'To save money',
      'One worker can\'t handle 57K emails/sec - need parallelism',
      'It\'s easier to code',
      'To use less memory',
    ],
    correctIndex: 1,
    explanation: 'SMTP delivery is slow (100-500ms per email). Need many workers in parallel for high throughput.',
  },

  keyConcepts: [
    { title: 'Worker', explanation: 'Background service that processes queue', icon: '⚙️' },
    { title: 'Worker Pool', explanation: 'Multiple workers running in parallel', icon: '👥' },
    { title: 'SMTP', explanation: 'Protocol for email delivery', icon: '📮' },
  ],
};

const step8: GuidedStep = {
  id: 'email-queue-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Emails actually being delivered now!',
    taskDescription: 'Add Worker service to consume queue and deliver emails',
    componentsNeeded: [
      { type: 'app_server', reason: 'Worker service pool to process email queue', displayName: 'Worker Service' },
    ],
    successCriteria: [
      'Additional App Server (Worker) added',
      'Worker connected to Message Queue',
      'Worker connected to Database',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Add another App Server component to represent the Worker pool',
    level2: 'Connect Worker to Message Queue (consumes) and Database (updates status)',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 9: Implement Retry Logic with Dead Letter Queue
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🔁',
  scenario: "Many emails are failing with temporary errors!",
  hook: "Recipient mailboxes full, SMTP servers temporarily down. These are soft bounces - should be retried. But right now they're just failing permanently.",
  challenge: "Implement retry logic with exponential backoff and a dead letter queue for permanent failures.",
  illustration: 'retry-failures',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Retry logic is maximizing deliverability!',
  achievement: 'Exponential backoff with DLQ handles all failure scenarios',
  metrics: [
    { label: 'Soft bounce recovery', before: '0%', after: '85%' },
    { label: 'Retry attempts', after: 'Up to 7x over 72hrs' },
    { label: 'Permanent failures', after: 'Tracked in DLQ' },
  ],
  nextTeaser: "Now we need to track bounces and maintain suppression lists...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'FR-4: Retry Logic and Dead Letter Queues',
  conceptExplanation: `Email delivery fails for many reasons. We must retry intelligently.

**Failure Types:**

**1. Soft Bounces (Temporary)** - RETRY
- Mailbox full
- SMTP server temporarily down
- Rate limit exceeded
- Network timeout

**2. Hard Bounces (Permanent)** - DON'T RETRY
- Email address doesn't exist
- Domain doesn't exist
- Recipient blocked sender
- Email rejected as spam

**Retry Strategy: Exponential Backoff**
\`\`\`
Attempt 1: Immediate
Attempt 2: Wait 1 minute
Attempt 3: Wait 5 minutes
Attempt 4: Wait 15 minutes
Attempt 5: Wait 1 hour
Attempt 6: Wait 4 hours
Attempt 7: Wait 12 hours
Max: Give up after 72 hours
\`\`\`

**Dead Letter Queue (DLQ):**
- Emails that fail all retry attempts go to DLQ
- DLQ is manually reviewed for issues
- Prevents infinite retry loops
- Helps identify systemic problems`,

  whyItMatters: 'Soft bounces are often temporary (mailbox full). Retrying can recover 80%+ of these failures.',

  famousIncident: {
    title: 'Mailchimp Retry Storm',
    company: 'Mailchimp',
    year: '2020',
    whatHappened: 'A bug caused failed emails to retry immediately without backoff. This created a "retry storm" that overwhelmed SMTP servers. Took 4 hours to stop and fix.',
    lessonLearned: 'Exponential backoff is critical. Never retry immediately - it amplifies load.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'SendGrid',
    scenario: 'Maximizing delivery success rate',
    howTheyDoIt: 'Retries soft bounces for 72 hours with exponential backoff, achieves 99%+ eventual delivery rate',
  },

  diagram: `
Email Delivery Attempt
      │
      ▼
   Success? ──YES──▶ Mark delivered
      │
      NO
      │
      ▼
  Soft Bounce? ──YES──▶ Retry Queue (exponential backoff)
      │                       │
      NO                      ▼
      │                 Max retries reached?
      ▼                       │
  Hard Bounce               YES
      │                       │
      └───────────────────────┘
                  │
                  ▼
          Dead Letter Queue
          - Review manually
          - Add to suppression list
          - Alert on patterns
`,

  keyPoints: [
    'Soft bounces = retry with exponential backoff',
    'Hard bounces = never retry, suppress immediately',
    'Exponential backoff: 1m, 5m, 15m, 1h, 4h, 12h, 24h',
    'Dead Letter Queue for max retries exceeded',
  ],

  quickCheck: {
    question: 'Why use exponential backoff instead of retrying immediately?',
    options: [
      'To save money',
      'Prevents overwhelming the system and allows time for temporary issues to resolve',
      'It\'s easier to implement',
      'Emails are delivered faster',
    ],
    correctIndex: 1,
    explanation: 'Exponential backoff prevents retry storms and gives temporary issues (mailbox full) time to clear.',
  },

  keyConcepts: [
    { title: 'Soft Bounce', explanation: 'Temporary failure - should retry', icon: '🔄' },
    { title: 'Hard Bounce', explanation: 'Permanent failure - never retry', icon: '🚫' },
    { title: 'Exponential Backoff', explanation: 'Increasing delays between retries', icon: '📈' },
    { title: 'Dead Letter Queue', explanation: 'Queue for failed messages after max retries', icon: '☠️' },
  ],
};

const step9: GuidedStep = {
  id: 'email-queue-step-9',
  stepNumber: 9,
  frIndex: 3,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-4: Retry failed deliveries with exponential backoff',
    taskDescription: 'Configure retry logic and add Dead Letter Queue',
    successCriteria: [
      'Click on Message Queue',
      'Configure retry policy: exponential backoff, max 7 attempts',
      'Enable Dead Letter Queue for permanent failures',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Message Queue component to open its configuration',
    level2: 'Set retry policy to exponential backoff with max 7 attempts. Enable Dead Letter Queue.',
    solutionComponents: [
      {
        type: 'message_queue',
        config: {
          retryPolicy: 'exponential_backoff',
          maxRetries: 7,
          deadLetterQueue: true
        }
      }
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Add Monitoring and Bounce Tracking
// =============================================================================

const step10Story: StoryContent = {
  emoji: '📊',
  scenario: "Your email system is running, but you're blind to problems!",
  hook: "A customer's bounce rate spiked to 15% - their IP got blacklisted and you didn't know. Gmail started marking all their emails as spam.",
  challenge: "Add monitoring to track bounce rates, delivery metrics, and alert on issues.",
  illustration: 'blind-monitoring',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a complete Email Queue System!',
  achievement: 'A production-ready email delivery platform with monitoring',
  metrics: [
    { label: 'Throughput', after: '57K emails/sec peak' },
    { label: 'Delivery rate', after: '99%+' },
    { label: 'Bounce tracking', after: 'Enabled' },
    { label: 'Rate limiting', after: 'Active' },
    { label: 'Retry logic', after: 'Exponential backoff' },
  ],
  nextTeaser: "You've mastered email delivery system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'FR-3: Bounce Handling and Monitoring',
  conceptExplanation: `Monitoring is critical for email systems. Track these metrics:

**Delivery Metrics:**
1. **Delivery rate** - % of emails successfully delivered
2. **Bounce rate** - % of emails that bounced (target: <5%)
3. **Hard bounce rate** - Permanent failures
4. **Soft bounce rate** - Temporary failures
5. **Retry success rate** - % of retries that succeed

**Per-Sender Metrics:**
- Track bounce rate per customer
- Alert if bounce rate > 5% (reputation risk)
- Throttle or suspend if > 10%

**Suppression List Management:**
\`\`\`
Hard bounce → Add to suppression list
Complaint (marked as spam) → Add to suppression list
Unsubscribe → Add to suppression list

Before sending:
  if recipient in suppression_list:
    reject("Email address suppressed")
\`\`\`

**Alerts:**
- Queue depth > 100K (backlog building)
- Worker failure rate > 1%
- Bounce rate spike > 5%
- SMTP connection failures
- Rate limit breaches`,

  whyItMatters: 'Email reputation is fragile. High bounce rates = blacklisted IPs = all emails go to spam for all customers.',

  famousIncident: {
    title: 'Mailgun IP Blacklisting',
    company: 'Mailgun',
    year: '2021',
    whatHappened: 'They didn\'t monitor bounce rates per customer. One customer sent to 100K invalid addresses, causing a 50% bounce rate. Gmail blacklisted entire IP ranges, affecting thousands of legitimate senders.',
    lessonLearned: 'Monitor bounce rates religiously. Suspend senders with high bounce rates immediately.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'SendGrid',
    scenario: 'Protecting sender reputation',
    howTheyDoIt: 'Real-time bounce tracking, automatic sender suspension at 10% bounce rate, suppression list with 100M+ addresses',
  },

  diagram: `
┌─────────────────────────────────────────┐
│         Monitoring Dashboard            │
│                                         │
│  📊 Delivery Rate: 99.2%                │
│  ↩️  Bounce Rate: 2.1% ✓               │
│  🔄 Retry Success: 87%                  │
│  ⏱️  Queue Depth: 12,453               │
│  ⚙️  Worker Health: 98/100 healthy     │
│                                         │
│  🚨 Alerts:                             │
│  - Customer #1234: Bounce rate 8% ⚠️   │
│  - Queue depth growing +5K/min ⚠️      │
└─────────────────────────────────────────┘
           │
           ▼
  Alert on problems:
  - Slack notification
  - PagerDuty alert
  - Auto-throttle sender
`,

  keyPoints: [
    'Track bounce rate per sender (alert if > 5%)',
    'Maintain suppression list (hard bounces, complaints)',
    'Monitor queue depth and worker health',
    'Alert on anomalies (spike in failures)',
  ],

  quickCheck: {
    question: 'Why is tracking bounce rate per sender critical?',
    options: [
      'To save money',
      'High bounce rates damage sender reputation and can blacklist IPs',
      'It makes emails faster',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'High bounce rates signal poor email list quality. ISPs will blacklist your IPs, affecting all senders.',
  },

  keyConcepts: [
    { title: 'Bounce Rate', explanation: '% of emails that fail delivery', icon: '📊' },
    { title: 'Suppression List', explanation: 'Addresses to never email again', icon: '🚫' },
    { title: 'Sender Reputation', explanation: 'ISP trust score based on behavior', icon: '⭐' },
  ],
};

const step10: GuidedStep = {
  id: 'email-queue-step-10',
  stepNumber: 10,
  frIndex: 2,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-3: Handle bounces and protect sender reputation',
    taskDescription: 'Review your complete architecture and ensure monitoring is in place',
    successCriteria: [
      'All components properly connected',
      'Database replication enabled',
      'Message queue with retry policy',
      'Cache for rate limiting',
      'Workers processing emails',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Review your architecture - all components should be connected and configured',
    level2: 'Ensure: Load balancer for API, workers consuming queue, database with replication, cache for rate limits',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const emailQueueSystemGuidedTutorial: GuidedTutorial = {
  problemId: 'email-queue-system',
  title: 'Design Email Queue System',
  description: 'Build a high-throughput email delivery platform with message queuing, delivery guarantees, rate limiting, and bounce handling',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📧',
    hook: "You've been hired as Lead Engineer at EmailTech Systems!",
    scenario: "Your mission: Build a scalable email delivery platform like SendGrid that can handle billions of emails per day with high deliverability.",
    challenge: "Can you design a system with message queuing, retry logic, rate limiting, and bounce handling?",
  },

  requirementsPhase: emailQueueSystemRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Email API Design',
    'Message Queuing',
    'Async Processing',
    'Rate Limiting',
    'Load Balancing',
    'Database Replication',
    'Worker Pools',
    'Retry Logic',
    'Exponential Backoff',
    'Dead Letter Queue',
    'Bounce Handling',
    'Suppression Lists',
    'Sender Reputation',
    'At-Least-Once Delivery',
    'Idempotency',
  ],

  ddiaReferences: [
    'Chapter 11: Stream Processing (Message Queues)',
    'Chapter 5: Replication',
    'Chapter 8: Distributed Systems (Retry Logic)',
    'Chapter 12: Data Systems (Idempotency)',
  ],
};

export default emailQueueSystemGuidedTutorial;
