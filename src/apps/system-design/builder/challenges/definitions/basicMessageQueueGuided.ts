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
 * Basic Message Queue Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches message queue fundamentals:
 * - Producer/Consumer pattern
 * - Queue persistence
 * - Delivery guarantees (at-least-once, exactly-once)
 * - Message ordering
 * - Dead letter queues
 * - Consumer groups
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (producers, queue, consumers)
 * Steps 4-6: Add reliability (persistence, delivery guarantees, monitoring)
 * Steps 7-8: Scale and optimize (partitioning, consumer groups, cost)
 *
 * Key Pedagogy: First make it WORK, then make it RELIABLE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const messageQueueRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a message queue system like RabbitMQ or Amazon SQS",

  interviewer: {
    name: 'Alex Rodriguez',
    role: 'Principal Engineer - Infrastructure',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the basic operations users need from a message queue?",
      answer: "Users need three fundamental operations:\n1. **Produce**: Send messages to the queue\n2. **Consume**: Receive messages from the queue\n3. **Acknowledge**: Confirm successful message processing\n\nThe queue sits between producers (services that send messages) and consumers (services that process messages).",
      importance: 'critical',
      revealsRequirement: 'FR-1 and FR-2',
      learningPoint: "Message queues decouple producers from consumers - they don't need to know about each other",
    },
    {
      id: 'message-persistence',
      category: 'functional',
      question: "What happens to messages if the queue crashes? Should they survive restarts?",
      answer: "Yes! Messages MUST be persisted to disk. If the queue service crashes and restarts, all unprocessed messages should still be there. This is critical - losing messages means losing business data (orders, payments, notifications).",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Persistence is non-negotiable for production queues - in-memory queues lose data",
    },
    {
      id: 'delivery-guarantees',
      category: 'functional',
      question: "If a consumer crashes while processing a message, what happens to that message?",
      answer: "The message should be **redelivered** to another consumer. We need **at-least-once delivery** - the message is guaranteed to be delivered at least one time, possibly more if consumers fail.\n\nExactly-once is ideal but much harder - we'll design for at-least-once with idempotent consumers.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "At-least-once delivery requires acknowledgment - consumers must explicitly confirm processing",
    },

    // IMPORTANT - Clarifications
    {
      id: 'message-ordering',
      category: 'clarification',
      question: "Do messages need to be processed in the exact order they were sent?",
      answer: "For most use cases, **FIFO (First In, First Out)** ordering is desired but not strictly required. Messages should generally be processed in order, but if a consumer fails, that message might be reprocessed later.\n\nFor the MVP, we'll support best-effort ordering. Strict FIFO can be a v2 feature.",
      importance: 'important',
      insight: "Strict ordering and high throughput are often in tension - ordered queues are harder to scale",
    },
    {
      id: 'message-size',
      category: 'clarification',
      question: "What's the maximum message size? Can users send large payloads?",
      answer: "Maximum message size: **256KB**. For larger payloads (like files), users should upload to object storage (S3) and send a reference in the message.\n\nSmaller messages = better throughput and easier to replicate.",
      importance: 'important',
      insight: "Message queues are for coordination, not storage - keep messages small",
    },
    {
      id: 'dead-letter-queue',
      category: 'clarification',
      question: "What happens to messages that fail processing repeatedly?",
      answer: "After **3 failed attempts**, messages should be moved to a **Dead Letter Queue (DLQ)**. This prevents poison messages from blocking the queue forever.\n\nDevelopers can inspect DLQ messages to debug issues.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "DLQs are essential for operational visibility - you need to know what's failing",
    },
    {
      id: 'message-ttl',
      category: 'clarification',
      question: "Should old, unprocessed messages expire automatically?",
      answer: "Yes, support **TTL (Time To Live)** - default 7 days. Messages older than TTL are automatically deleted. This prevents the queue from growing unbounded with old messages nobody will process.",
      importance: 'nice-to-have',
      insight: "TTL is a safety mechanism - prevents storage costs from spiraling",
    },

    // SCOPE
    {
      id: 'scope-single-queue',
      category: 'scope',
      question: "Do users need multiple independent queues, or just one queue?",
      answer: "Users need **multiple independent queues**. Different services use different queues (e.g., 'email-queue', 'order-processing-queue'). Each queue has its own consumers and settings.",
      importance: 'critical',
      insight: "Multi-tenancy is key - each queue is isolated",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages per second should the queue handle?",
      answer: "Design for **10,000 messages/second** at peak (both produces and consumes combined).",
      importance: 'critical',
      calculation: {
        formula: "10K msg/sec = 600K messages/minute = 36M messages/hour",
        result: "~10,000 operations/sec at peak",
      },
      learningPoint: "This is medium scale - AWS SQS handles millions of messages/sec",
    },
    {
      id: 'throughput-consumers',
      category: 'throughput',
      question: "How many consumers can read from a single queue simultaneously?",
      answer: "Up to **100 concurrent consumers** per queue. More consumers = higher throughput, but requires coordination to avoid duplicates.",
      importance: 'important',
      learningPoint: "Consumer groups enable horizontal scaling of message processing",
    },

    // 2. PAYLOAD
    {
      id: 'payload-storage',
      category: 'payload',
      question: "How long do messages stay in the queue on average?",
      answer: "Average message lifetime: **30 seconds**. Most messages are processed quickly. But the queue should support hours-long retention for slow consumers.\n\nStorage needed: ~10K msg/sec × 30 sec × 256KB = ~76GB active messages (worst case).",
      importance: 'important',
      calculation: {
        formula: "10K msg/sec × 30 sec retention × 256KB = 76GB",
        result: "~100GB storage for active messages",
      },
      learningPoint: "Queue storage is temporary - it's not a database",
    },

    // 3. LATENCY
    {
      id: 'latency-produce',
      category: 'latency',
      question: "How fast should message publishing be?",
      answer: "**p99 < 10ms** for produce operations. Producers should get instant confirmation that the message is queued.",
      importance: 'critical',
      learningPoint: "Low latency requires in-memory buffering before disk writes",
    },
    {
      id: 'latency-consume',
      category: 'latency',
      question: "How fast should consumers receive messages?",
      answer: "**p99 < 50ms** for receive operations. When a consumer polls the queue, it should get messages (if available) within 50ms.\n\nIdeal: Long-polling to reduce empty responses.",
      importance: 'important',
      learningPoint: "Long polling reduces network overhead - consumers wait for messages instead of polling",
    },

    // 4. RELIABILITY
    {
      id: 'availability',
      category: 'reliability',
      question: "What's the uptime requirement?",
      answer: "**99.9% availability** (8.7 hours downtime per year). The queue is critical infrastructure - if it goes down, all dependent services are blocked.",
      importance: 'critical',
      insight: "Requires replication and failover - no single point of failure",
    },
    {
      id: 'data-durability',
      category: 'reliability',
      question: "What's the acceptable message loss rate?",
      answer: "**Zero data loss** for acknowledged messages. Once a producer gets confirmation, that message MUST be durable.\n\nUse replication and fsync to disk before ACK.",
      importance: 'critical',
      learningPoint: "Durability vs performance trade-off - fsync is expensive but necessary",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'message-persistence', 'delivery-guarantees'],
  criticalFRQuestionIds: ['core-operations', 'message-persistence', 'delivery-guarantees'],
  criticalScaleQuestionIds: ['throughput-messages', 'latency-produce', 'availability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Producers can send messages to queues',
      description: 'Services can publish messages with guaranteed delivery',
      emoji: '📤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Consumers can receive messages from queues',
      description: 'Services can poll and process messages with acknowledgment',
      emoji: '📥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Messages persist across restarts',
      description: 'Messages are written to disk and survive queue crashes',
      emoji: '💾',
    },
    {
      id: 'fr-4',
      text: 'FR-4: At-least-once delivery guarantee',
      description: 'Messages are redelivered if consumers fail to acknowledge',
      emoji: '🔁',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Dead letter queue for failed messages',
      description: 'Messages that fail repeatedly are moved to DLQ for inspection',
      emoji: '☠️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (B2B infrastructure)',
    writesPerDay: '864 million messages',
    readsPerDay: '864 million messages',
    peakMultiplier: 3,
    readWriteRatio: '1:1 (produces = consumes)',
    calculatedWriteRPS: { average: 10000, peak: 30000 },
    calculatedReadRPS: { average: 10000, peak: 30000 },
    maxPayloadSize: '256KB',
    storagePerRecord: '~256KB (max)',
    storageGrowthPerYear: 'N/A (messages expire)',
    redirectLatencySLA: 'p99 < 10ms (produce)',
    createLatencySLA: 'p99 < 50ms (consume)',
  },

  architecturalImplications: [
    '✅ 10K msg/sec → Need in-memory buffering + async disk writes',
    '✅ Zero data loss → Replication required (3+ copies)',
    '✅ At-least-once delivery → Need visibility timeout + redelivery',
    '✅ 100 concurrent consumers → Consumer groups with partition assignment',
    '✅ p99 < 10ms produce → Write to leader, async replicate',
  ],

  outOfScope: [
    'Exactly-once delivery (v2 feature)',
    'Strict FIFO ordering (best-effort only)',
    'Message routing/fanout (pub/sub model)',
    'Topic-based subscriptions',
    'Message transformations',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple Producer → Queue → Consumer flow that satisfies our functional requirements. Once messages flow reliably, we'll add persistence, delivery guarantees, and scaling. This is the right way to approach infrastructure design: functionality first, then reliability, then scale.",
};

// =============================================================================
// STEP 1: Basic Producer-Queue-Consumer Flow
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome, engineer! You're building a message queue system from scratch.",
  hook: "Your first task: connect producers to a queue so they can send messages.",
  challenge: "Set up the basic flow: Producer → Queue → Consumer",
  illustration: 'message-flow',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your message queue is connected!",
  achievement: "Producers can now send messages to the queue",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can send messages', after: '✓' },
  ],
  nextTeaser: "But the queue is empty... let's write some code!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Producer-Consumer Pattern: The Foundation',
  conceptExplanation: `A **message queue** sits between **producers** and **consumers**, decoupling them.

**Producer**: A service that sends messages
- Example: Order service sends "new order" messages
- Doesn't know who will process the message
- Gets immediate confirmation that message is queued

**Queue**: Storage buffer for messages
- Holds messages until consumers are ready
- Provides ordering, persistence, delivery guarantees

**Consumer**: A service that processes messages
- Example: Fulfillment service processes orders
- Polls queue for new messages
- Acknowledges successful processing

This is the **asynchronous processing** pattern.`,

  whyItMatters: 'Without queues, services would need to talk directly to each other (tight coupling). Queues enable loose coupling, resilience, and horizontal scaling.',

  keyPoints: [
    'Producer and consumer are decoupled - they don\'t know about each other',
    'Queue buffers messages when consumers are slow or offline',
    'Multiple consumers can share work from a single queue',
    'Async processing: producer doesn\'t wait for consumer to finish',
  ],

  diagram: `
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Producer   │ ──────▶ │    Queue    │ ──────▶ │  Consumer   │
│  (Sender)   │         │  (Buffer)   │         │ (Processor) │
└─────────────┘         └─────────────┘         └─────────────┘
  "Create order"       [msg1, msg2, ...]      "Process order"
`,

  keyConcepts: [
    {
      title: 'Producer',
      explanation: 'Service that sends messages to the queue',
      icon: '📤',
    },
    {
      title: 'Consumer',
      explanation: 'Service that receives and processes messages',
      icon: '📥',
    },
    {
      title: 'Queue',
      explanation: 'Buffer that stores messages between producer and consumer',
      icon: '📬',
    },
  ],

  quickCheck: {
    question: 'Why use a message queue instead of direct service-to-service calls?',
    options: [
      'It\'s faster',
      'It decouples services and provides buffering when consumers are slow',
      'It uses less memory',
      'It\'s easier to debug',
    ],
    correctIndex: 1,
    explanation: 'Message queues decouple producers from consumers and buffer messages when consumers can\'t keep up with production rate.',
  },
};

const step1: GuidedStep = {
  id: 'mq-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Basic message flow must work',
    taskDescription: 'Add Producer, Message Queue, and Consumer, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents message producers', displayName: 'Producer' },
      { type: 'message_queue', reason: 'Buffers messages', displayName: 'Message Queue' },
      { type: 'app_server', reason: 'Represents message consumers', displayName: 'Consumer' },
    ],
    connectionsNeeded: [
      { from: 'Producer', to: 'Message Queue', reason: 'Producers send messages to queue' },
      { from: 'Message Queue', to: 'Consumer', reason: 'Consumers receive messages from queue' },
    ],
    successCriteria: ['Add Producer, Queue, Consumer', 'Connect Producer → Queue → Consumer'],
  },
  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Build the flow: Producer → Message Queue → Consumer',
    level2: 'Drag Producer (client), Message Queue, and Consumer (app_server) from sidebar, then connect them in order',
    solutionComponents: [{ type: 'client' }, { type: 'message_queue' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'message_queue' },
      { from: 'message_queue', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Queue Operations (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your queue is connected, but it doesn't know how to handle messages yet!",
  hook: "A producer tried to send a message but got an error. The queue has no logic!",
  challenge: "Write Python code to implement produce(), consume(), and acknowledge() operations.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your queue is now functional!",
  achievement: "Messages can be sent, received, and acknowledged",
  metrics: [
    { label: 'Operations implemented', after: '3 APIs' },
    { label: 'Can produce', after: '✓' },
    { label: 'Can consume', after: '✓' },
    { label: 'Can acknowledge', after: '✓' },
  ],
  nextTeaser: "But what happens when the queue crashes?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Queue Operations: Produce, Consume, Acknowledge',
  conceptExplanation: `Your message queue needs three core operations:

**1. Produce (POST /api/v1/messages)** — Send a message
- Receives: queue_name, message_body
- Returns: message_id
- Your code: Store message in queue, return confirmation

**2. Consume (GET /api/v1/messages)** — Receive a message
- Receives: queue_name, max_messages
- Returns: List of messages with visibility timeout
- Your code: Fetch messages, mark as "in-flight" (invisible to other consumers)

**3. Acknowledge (DELETE /api/v1/messages/:id)** — Confirm processing
- Receives: message_id
- Returns: Success
- Your code: Remove message from queue

**Visibility Timeout**: When a consumer receives a message, it becomes invisible for 30 seconds. If not ACK'd, it reappears for other consumers.`,

  whyItMatters: 'Without acknowledgment, you can\'t guarantee at-least-once delivery. Messages would be lost if consumers crash.',

  keyPoints: [
    'Produce = add message to queue (async)',
    'Consume = fetch message + make it invisible (visibility timeout)',
    'Acknowledge = delete message permanently',
    'Visibility timeout prevents message loss when consumers crash',
  ],

  diagram: `
PRODUCE
┌─────────────────────────────────────────────────┐
│ POST /api/v1/messages                           │
│ { "queue": "orders", "body": "{order_id: 123}" }│
│ → Returns: { "message_id": "msg_001" }          │
└─────────────────────────────────────────────────┘

CONSUME
┌─────────────────────────────────────────────────┐
│ GET /api/v1/messages?queue=orders               │
│ → Returns: [{                                   │
│     "id": "msg_001",                            │
│     "body": "{order_id: 123}",                  │
│     "visibility_timeout": 30                    │
│   }]                                            │
└─────────────────────────────────────────────────┘

ACKNOWLEDGE
┌─────────────────────────────────────────────────┐
│ DELETE /api/v1/messages/msg_001                 │
│ → Returns: { "success": true }                  │
└─────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Visibility Timeout', explanation: 'Time a message is hidden after being received', icon: '👻' },
    { title: 'In-Flight', explanation: 'Message received but not yet acknowledged', icon: '✈️' },
    { title: 'Acknowledgment', explanation: 'Confirming successful message processing', icon: '✅' },
  ],

  quickCheck: {
    question: 'What happens if a consumer crashes without acknowledging a message?',
    options: [
      'The message is lost forever',
      'The message reappears after visibility timeout expires',
      'The message is sent to dead letter queue',
      'The queue crashes too',
    ],
    correctIndex: 1,
    explanation: 'After the visibility timeout (e.g., 30 seconds), the message becomes visible again and can be processed by another consumer. This provides at-least-once delivery.',
  },
};

const step2: GuidedStep = {
  id: 'mq-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Queue must handle produce, consume, and acknowledge operations',
    taskDescription: 'Configure Queue APIs and implement Python handlers',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Configure APIs and write Python code', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [],
    successCriteria: [
      'Click Message Queue to open inspector',
      'Assign POST /api/v1/messages, GET /api/v1/messages, DELETE /api/v1/messages/:id APIs',
      'Open Python tab and implement produce(), consume(), and acknowledge() handlers',
    ],
  },
  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click Queue, assign APIs, then write Python handlers in the Python tab',
    level2: 'After assigning APIs in inspector, switch to Python tab. Implement produce() to add messages, consume() to fetch with visibility timeout, acknowledge() to delete.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Persistence (Database)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your queue crashed and ALL messages were lost!",
  hook: "100,000 pending orders vanished. Customers are furious. Your boss is panicking.",
  challenge: "Messages were stored in memory. Add a database to persist messages to disk!",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Messages are now durable!",
  achievement: "Messages survive queue crashes and restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on crash', after: '✓ Persisted' },
    { label: 'Storage', after: 'PostgreSQL Database' },
  ],
  nextTeaser: "But we're only storing one copy - what if the database fails?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Queue Persistence: Saving Messages to Disk',
  conceptExplanation: `In-memory queues are fast but **volatile** - they lose all messages on crash.

**Production queues MUST persist messages to disk**:
- Store each message in a database
- Mark messages as "pending", "in-flight", or "processed"
- Use database transactions for atomicity

**Schema**:
\`\`\`sql
messages (
  id UUID PRIMARY KEY,
  queue_name VARCHAR,
  body TEXT,
  status VARCHAR,  -- 'pending', 'in_flight', 'processed'
  visibility_timeout TIMESTAMP,
  retry_count INT,
  created_at TIMESTAMP
)
\`\`\`

**Write-ahead log (WAL)**: Database writes to disk before confirming. Durability guaranteed.`,

  whyItMatters: 'Losing messages = losing business data. A payment queue losing messages means customers charged but orders never fulfilled!',

  realWorldExample: {
    company: 'AWS SQS',
    scenario: 'Guaranteeing message durability',
    howTheyDoIt: 'Replicates every message to 3+ servers across availability zones. Uses distributed storage with consensus for durability.',
  },

  famousIncident: {
    title: 'RabbitMQ Memory-Only Queue Outage',
    company: 'RabbitMQ User',
    year: '2019',
    whatHappened: 'A company used RabbitMQ\'s non-durable queues (memory-only) for "performance". During a server restart, 2 million messages were lost - including financial transactions. Cost: $500K+ in refunds and lost business.',
    lessonLearned: 'ALWAYS use durable queues for production. The performance gain isn\'t worth the risk of data loss.',
    icon: '💸',
  },

  keyPoints: [
    'In-memory = fast but volatile (lost on crash)',
    'Disk persistence = slower but durable',
    'Use database transactions for atomicity',
    'Write-ahead log (WAL) guarantees durability',
  ],

  diagram: `
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Producer   │ ──▶ │    Queue    │ ──▶ │   Database   │
└─────────────┘     │  (Service)  │     │              │
                    └─────────────┘     │ messages:    │
                          │             │  msg_001     │
                          │             │  msg_002     │
                          └───────────▶ │  msg_003     │
                      Write to disk     └──────────────┘
`,

  keyConcepts: [
    { title: 'Persistence', explanation: 'Messages written to disk, survive crashes', icon: '💾' },
    { title: 'WAL', explanation: 'Write-Ahead Log: guarantee durability', icon: '📝' },
    { title: 'Durability', explanation: 'Data survives power loss, crashes, restarts', icon: '🛡️' },
  ],

  quickCheck: {
    question: 'Why must message queues persist to disk?',
    options: [
      'It\'s faster than memory',
      'Messages are business data - losing them is unacceptable',
      'Disk is cheaper than RAM',
      'Databases are easier to use',
    ],
    correctIndex: 1,
    explanation: 'Messages represent business events (orders, payments). Losing them = losing critical data. Disk persistence ensures messages survive crashes.',
  },
};

const step3: GuidedStep = {
  id: 'mq-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-3: Messages must persist across restarts',
    taskDescription: 'Add Database to store messages durably',
    componentsNeeded: [
      { type: 'database', reason: 'Persist messages to disk', displayName: 'PostgreSQL' },
    ],
    connectionsNeeded: [
      { from: 'Message Queue', to: 'Database', reason: 'Queue stores messages in DB' },
    ],
    successCriteria: ['Add Database', 'Connect Queue → Database'],
  },
  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database and connect Queue to it',
    level2: 'Drag Database component, then connect Message Queue → Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'message_queue', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Database Replication (Zero Data Loss)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database crashed last night. It took 2 hours to recover.",
  hook: "During that time, NO messages could be sent or received. Production was down!",
  challenge: "A single database is a single point of failure. Add replication for redundancy!",
  illustration: 'database-failure',
};

const step4Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your queue is now fault-tolerant!",
  achievement: "Database replicas ensure zero message loss",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Data copies', before: '1', after: '3' },
    { label: 'Message loss risk', before: 'High', after: 'Near zero' },
  ],
  nextTeaser: "Great! But consumers are complaining about duplicate messages...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Ensuring Zero Message Loss',
  conceptExplanation: `**Problem**: Single database = single point of failure.

**Solution**: Replicate messages to 3+ database servers.

**How it works**:
1. Producer sends message
2. Queue writes to **Primary** database
3. Primary replicates to **Replicas** (synchronously or async)
4. If Primary fails, a Replica is promoted

**Synchronous vs Async Replication**:
- **Sync**: Wait for replicas before ACK (slower, zero data loss)
- **Async**: ACK immediately, replicate in background (faster, rare data loss)

**For queues**: Use **sync replication** for durability. Messages MUST be on 3+ servers before ACK.`,

  whyItMatters: 'Queues are critical infrastructure. If the queue goes down, all dependent services are blocked. Replication provides high availability and zero data loss.',

  realWorldExample: {
    company: 'Amazon SQS',
    scenario: 'Guaranteeing message durability',
    howTheyDoIt: 'Every message is synchronously replicated to 3+ servers across different availability zones before returning success to producer.',
  },

  famousIncident: {
    title: 'AWS SQS Outage (US-East-1)',
    company: 'Amazon',
    year: '2020',
    whatHappened: 'A power outage in one availability zone caused SQS to lose messages that weren\'t fully replicated. Services like Netflix, Roku, and Ring experienced issues for hours.',
    lessonLearned: 'Even the best systems fail. Replication across availability zones (physical separation) is critical for durability.',
    icon: '⚡',
  },

  keyPoints: [
    'Replication = copying messages to multiple servers',
    'Synchronous replication = zero data loss (slower)',
    'Asynchronous replication = faster (rare data loss)',
    'Use at least 3 replicas across availability zones',
  ],

  diagram: `
                    ┌──────────────┐
                    │   Primary    │
                    │   (Leader)   │
                    └──────┬───────┘
                           │ Replicate
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
      ┌──────────┐  ┌──────────┐  ┌──────────┐
      │ Replica 1│  │ Replica 2│  │ Replica 3│
      │ (AZ-1)   │  │ (AZ-2)   │  │ (AZ-3)   │
      └──────────┘  └──────────┘  └──────────┘
`,

  keyConcepts: [
    { title: 'Primary', explanation: 'Main database that receives writes', icon: '👑' },
    { title: 'Replica', explanation: 'Copy of database for redundancy', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting replica when primary fails', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why use synchronous replication for message queues?',
    options: [
      'It\'s faster than async',
      'It guarantees zero message loss - messages on 3+ servers before ACK',
      'It uses less storage',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Synchronous replication ensures messages are safely stored on multiple servers before confirming to producer. This guarantees zero data loss even if servers fail.',
  },
};

const step4: GuidedStep = {
  id: 'mq-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-3: Zero message loss (durability)',
    taskDescription: 'Enable database replication with 2+ replicas',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Click Database component',
      'Enable replication',
      'Set replica count to 2 or more',
    ],
  },
  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Click Database, go to Configuration, enable replication',
    level2: 'Enable replication and set replicas to 2. This creates redundant copies for failover.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Implement Dead Letter Queue (DLQ)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '☠️',
  scenario: "A poison message is stuck in your queue, failing over and over!",
  hook: "Consumers keep crashing on the same message. It's blocking all other messages from processing!",
  challenge: "After 3 failed attempts, move messages to a Dead Letter Queue for investigation.",
  illustration: 'poison-message',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚑',
  message: "Failed messages are now handled gracefully!",
  achievement: "Dead Letter Queue prevents poison messages from blocking the queue",
  metrics: [
    { label: 'Max retries', after: '3' },
    { label: 'Failed messages handled', after: '✓ Moved to DLQ' },
    { label: 'Queue blockage', before: 'Possible', after: 'Prevented' },
  ],
  nextTeaser: "Excellent! But we need to handle higher throughput...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Dead Letter Queue: Handling Failed Messages',
  conceptExplanation: `**Problem**: Some messages fail processing repeatedly (poison messages).

**Without DLQ**:
- Message fails → redelivered → fails → redelivered (infinite loop)
- Blocks other messages from processing
- No visibility into what's failing

**With DLQ**:
- Track retry count for each message
- After N failures (e.g., 3), move to Dead Letter Queue
- DLQ is a separate queue for failed messages
- Developers can inspect DLQ to debug issues

**Implementation**:
1. Increment \`retry_count\` on each delivery
2. If \`retry_count >= 3\`, move to DLQ
3. Alert operations team when DLQ grows`,

  whyItMatters: 'Poison messages can take down your entire queue. DLQs provide operational visibility and prevent cascading failures.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing webhook events',
    howTheyDoIt: 'Uses exponential backoff for retries (1s, 2s, 4s, 8s). After 10 failures, moves to DLQ. Developers get alerts when DLQ has items.',
  },

  famousIncident: {
    title: 'Target Canada Payment Failure',
    company: 'Target',
    year: '2013',
    whatHappened: 'A bug in their payment processing queue caused messages to fail and retry infinitely. The queue got backed up with millions of failing messages. Checkout systems went down nationwide.',
    lessonLearned: 'Always implement DLQ with retry limits. One poison message should never take down the entire system.',
    icon: '🎯',
  },

  keyPoints: [
    'Dead Letter Queue (DLQ) = queue for failed messages',
    'Move messages to DLQ after N retries (e.g., 3)',
    'DLQ provides visibility for debugging',
    'Prevents poison messages from blocking the queue',
  ],

  diagram: `
┌──────────────────────────────────────────────┐
│          MESSAGE LIFECYCLE                   │
├──────────────────────────────────────────────┤
│                                              │
│  Producer → [Queue] → Consumer ✓             │
│                │                             │
│                │ Fail (retry_count = 1)      │
│                ▼                             │
│             [Queue] → Consumer ✗             │
│                │                             │
│                │ Fail (retry_count = 2)      │
│                ▼                             │
│             [Queue] → Consumer ✗             │
│                │                             │
│                │ Fail (retry_count = 3)      │
│                ▼                             │
│          [Dead Letter Queue] 💀              │
│          (Manual investigation)              │
└──────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Poison Message', explanation: 'Message that repeatedly fails processing', icon: '☠️' },
    { title: 'Retry Count', explanation: 'Number of failed processing attempts', icon: '🔢' },
    { title: 'DLQ', explanation: 'Separate queue for permanently failed messages', icon: '🚑' },
  ],

  quickCheck: {
    question: 'Why do we need a Dead Letter Queue?',
    options: [
      'To make the system faster',
      'To prevent poison messages from blocking the queue forever',
      'To reduce costs',
      'To improve security',
    ],
    correctIndex: 1,
    explanation: 'DLQ prevents poison messages (messages that always fail) from blocking the queue. After N retries, they\'re moved to DLQ for manual investigation.',
  },
};

const step5: GuidedStep = {
  id: 'mq-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-5: Failed messages go to Dead Letter Queue',
    taskDescription: 'Add a second Message Queue to serve as DLQ',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Serves as Dead Letter Queue', displayName: 'DLQ' },
    ],
    connectionsNeeded: [
      { from: 'Message Queue', to: 'DLQ', reason: 'Failed messages moved to DLQ after 3 retries' },
    ],
    successCriteria: ['Add second Queue (DLQ)', 'Connect Main Queue → DLQ'],
  },
  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Add a second Message Queue component to serve as DLQ',
    level2: 'Drag another Message Queue onto canvas, connect Main Queue → DLQ',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for Horizontal Scaling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "Success! Your queue is handling 50,000 messages/second!",
  hook: "But traffic keeps growing. Your single queue server is at 100% CPU!",
  challenge: "Add a load balancer to distribute traffic across multiple queue instances.",
  illustration: 'high-traffic',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: "Your queue now scales horizontally!",
  achievement: "Load balancer distributes traffic across multiple queue servers",
  metrics: [
    { label: 'Queue instances', before: '1', after: 'Multiple' },
    { label: 'Throughput capacity', before: '10K msg/sec', after: '100K+ msg/sec' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "Awesome! But can we reduce costs while maintaining performance?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Scaling Message Queue Throughput',
  conceptExplanation: `**Problem**: One queue server can only handle ~10K msg/sec.

**Solution**: Multiple queue servers behind a load balancer.

**How it works**:
1. Producers send messages to Load Balancer
2. LB distributes to one of N queue servers (round-robin or hash-based)
3. Each queue server writes to the same shared database
4. Consumers poll any queue server

**Partitioning Strategy**:
- **No partitioning**: All servers share the same message pool (simpler)
- **Hash partitioning**: Route messages by hash(queue_name) for ordering

**For MVP**: Use shared pool (no partitioning). Ordering is best-effort.`,

  whyItMatters: 'Horizontal scaling is the only way to handle massive throughput. Vertical scaling (bigger servers) has limits.',

  realWorldExample: {
    company: 'Amazon SQS',
    scenario: 'Handling millions of messages per second',
    howTheyDoIt: 'Uses a fleet of queue servers behind load balancers. Each queue is partitioned across servers for parallelism.',
  },

  keyPoints: [
    'Load balancer distributes producer traffic across queue servers',
    'Each queue server writes to shared database',
    'Horizontal scaling = more servers = more throughput',
    'No single point of failure for compute',
  ],

  diagram: `
                        ┌──────────────┐
                   ┌───▶│ Queue Server │───┐
                   │    └──────────────┘   │
┌──────────┐   ┌──┴───┐                    ▼
│ Producer │──▶│  LB  │                ┌────────┐
└──────────┘   └──┬───┘                │Database│
                   │    ┌──────────────┐└────────┘
                   └───▶│ Queue Server │───┘
                        └──────────────┘
`,

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for capacity', icon: '📈' },
    { title: 'Shared Storage', explanation: 'All servers use same database', icon: '🗄️' },
  ],

  quickCheck: {
    question: 'Why add a load balancer to the message queue?',
    options: [
      'It makes messages faster',
      'It distributes traffic across multiple queue servers for horizontal scaling',
      'It reduces costs',
      'It improves security',
    ],
    correctIndex: 1,
    explanation: 'Load balancer enables horizontal scaling by distributing producer traffic across multiple queue servers, increasing total throughput.',
  },
};

const step6: GuidedStep = {
  id: 'mq-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must handle 10K+ msg/sec',
    taskDescription: 'Add Load Balancer between Producers and Queue',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic to queue instances', displayName: 'Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'Producer', to: 'Load Balancer', reason: 'Producers send to LB' },
      { from: 'Load Balancer', to: 'Message Queue', reason: 'LB routes to queue servers' },
    ],
    successCriteria: ['Add Load Balancer', 'Reconnect: Producer → LB → Queue'],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'message_queue', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Add Load Balancer between Producer and Queue',
    level2: 'Drag Load Balancer, reconnect: Producer → LB → Queue (remove old direct connection)',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Consumer Groups (Multiple Consumers)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🏃',
  scenario: "Your queue has 1 million pending messages and only 1 consumer!",
  hook: "Processing is taking forever. Messages are piling up faster than they're consumed!",
  challenge: "Configure multiple consumers in a consumer group to process messages in parallel.",
  illustration: 'message-backlog',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your queue now processes messages in parallel!",
  achievement: "Multiple consumers working together to process messages faster",
  metrics: [
    { label: 'Consumers', before: '1', after: 'Multiple (consumer group)' },
    { label: 'Processing speed', before: '100 msg/sec', after: '1000+ msg/sec' },
    { label: 'Backlog', before: 'Growing', after: 'Shrinking' },
  ],
  nextTeaser: "Final step: optimize costs!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Consumer Groups: Parallel Message Processing',
  conceptExplanation: `**Problem**: One consumer can only process messages so fast.

**Solution**: Consumer group - multiple consumers sharing work from one queue.

**How it works**:
1. Queue has N messages pending
2. Consumer 1 receives messages 1-10
3. Consumer 2 receives messages 11-20
4. Consumer 3 receives messages 21-30
5. All process in parallel

**Visibility timeout prevents duplicates**:
- When Consumer 1 receives msg_001, it becomes invisible
- Other consumers can't see it
- If Consumer 1 crashes, timeout expires, another consumer gets it

**Scaling**: More consumers = faster processing (until DB becomes bottleneck)`,

  whyItMatters: 'Consumer groups enable horizontal scaling of processing. Add more consumers to handle traffic spikes.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Processing ride requests',
    howTheyDoIt: 'Uses Kafka consumer groups with 100+ consumers per topic. Each consumer processes rides in parallel. Scales dynamically with traffic.',
  },

  keyPoints: [
    'Consumer group = multiple consumers sharing one queue',
    'Visibility timeout prevents duplicate processing',
    'Horizontal scaling: more consumers = faster processing',
    'Each consumer ACKs messages independently',
  ],

  diagram: `
                    ┌──────────────┐
              ┌────▶│  Consumer 1  │ (msg 1-10)
              │     └──────────────┘
┌──────────┐  │     ┌──────────────┐
│  Queue   │──┼────▶│  Consumer 2  │ (msg 11-20)
│ [1...N]  │  │     └──────────────┘
└──────────┘  │     ┌──────────────┐
              └────▶│  Consumer 3  │ (msg 21-30)
                    └──────────────┘

    All consumers ACK independently
`,

  keyConcepts: [
    { title: 'Consumer Group', explanation: 'Multiple consumers sharing work', icon: '👥' },
    { title: 'Parallel Processing', explanation: 'Process multiple messages simultaneously', icon: '⚡' },
    { title: 'Work Sharing', explanation: 'Each consumer gets different messages', icon: '🤝' },
  ],

  quickCheck: {
    question: 'How do multiple consumers avoid processing the same message?',
    options: [
      'They coordinate using locks',
      'Visibility timeout makes received messages invisible to other consumers',
      'Each consumer has its own queue',
      'The queue assigns messages explicitly',
    ],
    correctIndex: 1,
    explanation: 'When a consumer receives a message, it becomes invisible for the visibility timeout period. Other consumers can\'t see it during this time.',
  },
};

const step7: GuidedStep = {
  id: 'mq-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must support parallel message processing',
    taskDescription: 'Configure multiple consumer instances',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Click Consumer (App Server)',
      'Set instance count to 2 or more',
      'Multiple consumers now process messages in parallel',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'message_queue', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Click Consumer component and increase instance count',
    level2: 'Click App Server (consumer) → Set Instances to 2+. This creates a consumer group.',
    solutionComponents: [{ type: 'app_server', config: { instances: 2 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💰',
  scenario: "Your CFO just looked at the infrastructure bill: $5,000/month!",
  hook: "'We're only processing 1 million messages per day. This is too expensive!'",
  challenge: "Optimize your architecture to reduce costs while maintaining reliability.",
  illustration: 'cost-optimization',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Congratulations! You built a production message queue!",
  achievement: "A reliable, scalable, cost-effective message queue system",
  metrics: [
    { label: 'Throughput', after: '10K+ msg/sec' },
    { label: 'Availability', after: '99.9%' },
    { label: 'Delivery guarantee', after: 'At-least-once' },
    { label: 'Data durability', after: 'Zero loss' },
  ],
  nextTeaser: "You've mastered message queue design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Reliability and Budget',
  conceptExplanation: `**Cost breakdown**:
- Queue servers (3 instances): $150/month
- Load balancer: $20/month
- Database (primary + 2 replicas): $180/month
- **Total: ~$350/month**

**Optimization strategies**:

1. **Right-size instances**: Use t3.medium instead of m5.large
2. **Auto-scale consumers**: Scale up during peak, down at night
3. **Use reserved instances**: 30-40% savings for steady workload
4. **Reduce replication**: 2 replicas instead of 3 (if acceptable)
5. **Archive old messages**: Move to S3 after TTL

**Trade-offs**:
- Fewer replicas = lower cost, higher data loss risk
- Smaller instances = lower cost, lower throughput
- Auto-scaling = cost savings, but complexity`,

  whyItMatters: 'Infrastructure costs add up. Knowing how to optimize without sacrificing reliability is a key engineering skill.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Processing millions of events per day',
    howTheyDoIt: 'Uses auto-scaling for consumers based on queue depth. Scales to 0 instances at night when traffic is low. Saves 60%+ on compute costs.',
  },

  keyPoints: [
    'Right-size instances based on actual usage',
    'Auto-scale consumers to match traffic patterns',
    'Use reserved instances for base capacity',
    'Balance cost with reliability requirements',
  ],

  quickCheck: {
    question: 'Best cost optimization for a message queue with peak traffic during business hours?',
    options: [
      'Use smaller instances',
      'Auto-scale consumers based on queue depth and time of day',
      'Reduce database replicas to 1',
      'Remove the load balancer',
    ],
    correctIndex: 1,
    explanation: 'Auto-scaling matches capacity to demand. Scale up consumers during peak hours, scale down at night. This saves 50%+ on compute costs.',
  },

  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Automatically adjust instance count', icon: '📊' },
    { title: 'Reserved Instances', explanation: 'Commit for 1-3 years for discounts', icon: '💰' },
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
  ],
};

const step8: GuidedStep = {
  id: 'mq-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'System must meet all requirements within budget',
    taskDescription: 'Optimize components to reduce cost while maintaining reliability',
    componentsNeeded: [],
    connectionsNeeded: [],
    successCriteria: [
      'Review all component configurations',
      'Ensure total cost is reasonable (<$400/month)',
      'Maintain all reliability requirements',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'message_queue', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCostUnderBudget: true,
  },
  hints: {
    level1: 'Review configurations: right-size instances, maintain 2 replicas',
    level2: 'Balance cost with reliability: 2 DB replicas, right-sized instances, consider auto-scaling',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const basicMessageQueueGuidedTutorial: GuidedTutorial = {
  problemId: 'basic-message-queue-guided',
  problemTitle: 'Build a Message Queue - Producer/Consumer Journey',

  requirementsPhase: messageQueueRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Produce/Consume',
      type: 'functional',
      requirement: 'FR-1, FR-2',
      description: 'Producers can send messages and consumers can receive them',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Message Persistence',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Messages survive queue restart',
      traffic: { type: 'write', rps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'At-Least-Once Delivery',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Messages are redelivered if consumer crashes',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 60,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10,000 messages/sec with low latency',
      traffic: { type: 'mixed', rps: 10000, readRps: 5000, writeRps: 5000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System survives database failure with replication',
      traffic: { type: 'mixed', rps: 1000, readRps: 500, writeRps: 500 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Stay within budget while meeting performance requirements',
      traffic: { type: 'mixed', rps: 1000, readRps: 500, writeRps: 500 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 400, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getBasicMessageQueueGuidedTutorial(): GuidedTutorial {
  return basicMessageQueueGuidedTutorial;
}

export default basicMessageQueueGuidedTutorial;
