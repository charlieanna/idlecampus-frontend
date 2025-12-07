import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Kafka Streaming Pipeline Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a real-time data streaming pipeline with Kafka.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (CDC, partitioning, exactly-once, etc.)
 *
 * Key Concepts:
 * - Change Data Capture (CDC)
 * - Event streaming architecture
 * - Exactly-once semantics
 * - Topic partitioning strategies
 * - Stream processing vs batch processing
 * - Consumer groups and rebalancing
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const kafkaRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time data streaming pipeline with Kafka for an e-commerce platform",

  interviewer: {
    name: 'David Martinez',
    role: 'Principal Data Engineer at StreamTech Inc.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-streaming',
      category: 'functional',
      question: "What's the core problem we're trying to solve with this streaming pipeline?",
      answer: "We need to:\n\n1. **Capture database changes** - Track every order, inventory update, and user action in real-time\n2. **Stream events** - Send these changes to downstream systems (analytics, notifications, inventory)\n3. **Process in real-time** - Calculate metrics, detect fraud, update recommendations as events happen\n4. **Guarantee delivery** - Every event must be processed exactly once, no duplicates or losses",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Streaming pipelines move data from sources to destinations in real-time with strong guarantees",
    },
    {
      id: 'cdc-requirement',
      category: 'functional',
      question: "How should we capture changes from the database without impacting production?",
      answer: "Use **Change Data Capture (CDC)**! Instead of polling the database, we'll read the database transaction log (binlog for MySQL, WAL for Postgres). This gives us:\n- Zero impact on production DB\n- Every change captured automatically\n- Historical replay capability\n- Ordered event stream",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "CDC reads database logs, not tables - minimal overhead, maximum completeness",
    },
    {
      id: 'event-types',
      category: 'functional',
      question: "What types of events need to flow through this pipeline?",
      answer: "Main event types:\n1. **Order events** - created, paid, shipped, delivered\n2. **Inventory events** - stock added, sold, reserved\n3. **User events** - registration, login, profile updates\n4. **Payment events** - authorization, capture, refund",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Different event types have different processing requirements and consumers",
    },
    {
      id: 'downstream-consumers',
      category: 'functional',
      question: "Who consumes these events and what do they do with them?",
      answer: "Multiple consumers:\n- **Analytics Service** - Builds dashboards and reports\n- **Notification Service** - Sends emails/SMS to users\n- **Inventory Service** - Updates stock levels\n- **Fraud Detection** - Analyzes patterns in real-time\n- **Data Warehouse** - Stores for historical analysis",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Stream processing enables multiple independent consumers of the same events",
    },
    {
      id: 'event-ordering',
      category: 'clarification',
      question: "Does event order matter? Can events be processed in parallel?",
      answer: "**Order matters within an entity**! All events for Order #12345 must be processed in sequence. But Order #12345 and Order #67890 can be processed in parallel. This is why we use **partitioning by order_id**.",
      importance: 'critical',
      insight: "Partitioning enables parallelism while maintaining per-entity ordering",
    },
    {
      id: 'replay-capability',
      category: 'clarification',
      question: "What if a downstream service has a bug and needs to reprocess last week's events?",
      answer: "Kafka topics retain events (default 7 days, configurable to indefinite). Consumers can reset their offset and replay from any point in time. This is huge for debugging and recovery!",
      importance: 'important',
      insight: "Event log retention enables time travel - replay history when needed",
    },
    {
      id: 'schema-evolution',
      category: 'clarification',
      question: "How do we handle changes to event structure over time?",
      answer: "Use a **Schema Registry** with Avro or Protobuf. Schemas are versioned, and consumers/producers negotiate compatibility. Forward and backward compatibility ensures old consumers can read new events.",
      importance: 'important',
      insight: "Schema evolution is critical for long-lived streaming systems",
    },

    // SCALE & NFRs
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many events per second should the pipeline handle?",
      answer: "100,000 events per second at steady state, with potential spikes to 500,000 during flash sales",
      importance: 'critical',
      calculation: {
        formula: "100K events/sec × 86,400 sec = 8.64B events/day",
        result: "~8.64 billion events daily",
      },
      learningPoint: "High throughput requires horizontal scaling via partitions",
    },
    {
      id: 'throughput-data',
      category: 'throughput',
      question: "How much data volume are we talking about?",
      answer: "Average event size is 2KB. At 100K events/sec, that's 200MB/sec or 17TB/day",
      importance: 'critical',
      calculation: {
        formula: "100K events/sec × 2KB = 200MB/sec",
        result: "~17TB per day",
      },
      learningPoint: "Data volume drives storage and network requirements",
    },
    {
      id: 'latency-e2e',
      category: 'latency',
      question: "How fast should events flow from database to downstream consumers?",
      answer: "End-to-end latency p99 under 1 second. For fraud detection, we need to analyze patterns while the user is still on the checkout page.",
      importance: 'critical',
      learningPoint: "Real-time processing means sub-second latency at scale",
    },
    {
      id: 'exactly-once',
      category: 'consistency',
      question: "What happens if an event is processed twice? Or not at all?",
      answer: "Both are catastrophic! Duplicate processing means double-charging or double-debiting inventory. Missing events means lost sales data. We need **exactly-once semantics** using idempotent producers and transactional consumers.",
      importance: 'critical',
      learningPoint: "Exactly-once semantics prevents duplicate and lost events in distributed systems",
    },
    {
      id: 'partition-strategy',
      category: 'scalability',
      question: "How should we partition topics to enable parallel processing?",
      answer: "Partition by **entity ID** (order_id, user_id, etc.). This ensures:\n- All events for an order go to the same partition (ordering preserved)\n- Different orders go to different partitions (parallel processing)\n- Even distribution across partitions (load balancing)",
      importance: 'critical',
      learningPoint: "Partitioning strategy determines parallelism and ordering guarantees",
    },
    {
      id: 'consumer-scaling',
      category: 'scalability',
      question: "How do we scale consumers as event volume grows?",
      answer: "Use **consumer groups**! Add more consumer instances to the group, and Kafka automatically rebalances partitions across them. Each partition is consumed by exactly one consumer in the group.",
      importance: 'critical',
      learningPoint: "Consumer groups enable horizontal scaling of event processing",
    },
    {
      id: 'fault-tolerance',
      category: 'reliability',
      question: "What happens if a Kafka broker crashes?",
      answer: "Kafka replicates each partition across multiple brokers (typically 3). If one broker fails, a replica is promoted to leader. Producers and consumers automatically failover. No data loss!",
      importance: 'critical',
      learningPoint: "Replication provides fault tolerance in distributed streaming systems",
    },
    {
      id: 'backpressure',
      category: 'reliability',
      question: "What if consumers can't keep up with the event rate?",
      answer: "Kafka acts as a buffer! Events accumulate in topics while slow consumers catch up. Monitor **consumer lag** (how far behind consumers are). Scale consumers or optimize processing when lag grows.",
      importance: 'important',
      learningPoint: "Message queues decouple producer and consumer speeds",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-streaming', 'cdc-requirement', 'exactly-once'],
  criticalFRQuestionIds: ['core-streaming', 'cdc-requirement', 'event-types'],
  criticalScaleQuestionIds: ['throughput-events', 'exactly-once', 'partition-strategy'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Capture database changes',
      description: 'Use CDC to stream all database changes in real-time',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Stream events to topics',
      description: 'Publish events to Kafka topics with proper partitioning',
      emoji: '🌊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Process events in real-time',
      description: 'Enable multiple consumers to process events independently',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Guarantee exactly-once delivery',
      description: 'Ensure every event is processed exactly once, no duplicates or losses',
      emoji: '✅',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Support event replay',
      description: 'Allow consumers to replay historical events when needed',
      emoji: '⏮️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (data pipeline)',
    writesPerDay: '8.64 billion events',
    readsPerDay: '25.92 billion (3 consumers)',
    peakMultiplier: 5,
    readWriteRatio: '3:1 (3 consumers)',
    calculatedWriteRPS: { average: 100000, peak: 500000 },
    calculatedReadRPS: { average: 300000, peak: 1500000 },
    maxPayloadSize: '~2KB (event)',
    storagePerRecord: '~2KB',
    storageGrowthPerYear: '~6.3PB (17TB/day × 365)',
    redirectLatencySLA: 'p99 < 1s (end-to-end)',
    createLatencySLA: 'p99 < 100ms (publish)',
  },

  architecturalImplications: [
    '✅ 100K events/sec → Need 20+ partitions per topic for parallelism',
    '✅ Exactly-once required → Idempotent producers + transactional consumers',
    '✅ CDC for zero DB impact → Use Debezium or similar CDC connector',
    '✅ 17TB/day → Retention policy + tiered storage (S3 for old events)',
    '✅ Multiple consumers → Each consumer group tracks own offset',
    '✅ Fault tolerance → 3-way replication across brokers',
  ],

  outOfScope: [
    'Multi-datacenter replication (MirrorMaker)',
    'KSQL/Flink for complex stream processing',
    'Kafka Connect for external integrations',
    'Schema evolution (Schema Registry)',
    'Monitoring (Prometheus, Grafana)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple pipeline where database changes flow to Kafka and get consumed. The critical exactly-once guarantees, partitioning strategies, and scaling challenges will come in later steps. Functionality first, then bulletproofing!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌊',
  scenario: "Welcome to StreamTech Inc! You've been hired to build a real-time data pipeline.",
  hook: "Your e-commerce platform generates 10,000 orders per minute. The analytics team is waiting!",
  challenge: "Set up the basic request flow so applications can send events to your system.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your streaming platform is online!',
  achievement: 'Applications can now send events to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle events yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Event-Driven Architecture',
  conceptExplanation: `Every streaming pipeline starts with **producers** connecting to an **event server**.

When an event occurs (order placed, payment processed):
1. The application is a **Producer** (Client)
2. It sends the event to your **Event Processing Server**
3. The server receives, validates, and prepares to store the event

This is the foundation of ALL event-driven systems!`,

  whyItMatters: 'Without this connection, no events can enter your streaming pipeline.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Processing 15 million trips per day',
    howTheyDoIt: 'Uses Kafka to stream every ride event (request, match, start, end) to 100+ downstream services for analytics, billing, and ML',
  },

  keyPoints: [
    'Producer = application generating events (order service, payment service)',
    'App Server = your backend that receives and validates events',
    'Events = immutable facts about what happened',
  ],

  keyConcepts: [
    { title: 'Producer', explanation: 'Application that generates and sends events', icon: '📤' },
    { title: 'Event Server', explanation: 'Receives and validates incoming events', icon: '🖥️' },
    { title: 'Event', explanation: 'Immutable record of something that happened', icon: '📋' },
  ],
};

const step1: GuidedStep = {
  id: 'kafka-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client (Producer) and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents event producers (order service, payment service)', displayName: 'Producer' },
      { type: 'app_server', reason: 'Handles event ingestion and validation', displayName: 'App Server' },
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
// STEP 2: Implement Event Handlers (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle events yet!",
  hook: "The order service just tried to send 'order.created' but got a 404 error.",
  challenge: "Write the Python code to receive and validate events.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle events!',
  achievement: 'You implemented event ingestion handlers',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can receive events', after: '✓' },
    { label: 'Can validate schema', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all events are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Event Ingestion: Receiving Events at Scale',
  conceptExplanation: `Every event needs a **handler function** that:
1. Receives the event payload
2. Validates the schema (required fields, data types)
3. Assigns metadata (timestamp, event_id)
4. Returns acknowledgment

For our pipeline, we need handlers for:
- \`ingest_event()\` - Receive and validate events
- \`query_events()\` - Retrieve events for debugging

For now, we'll store events in memory (Python lists).`,

  whyItMatters: 'Without validation, bad events can crash downstream consumers. Validate early, fail fast!',

  famousIncident: {
    title: 'The Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A software glitch caused their trading system to process duplicate events as new trades. In 45 minutes, they lost $440 million due to lack of idempotency checks.',
    lessonLearned: 'Event deduplication and validation are not optional in financial systems.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Processing billions of events daily',
    howTheyDoIt: 'Their Kafka pipeline validates every event against Avro schemas before accepting it, preventing downstream failures',
  },

  keyPoints: [
    'Each event type needs schema validation',
    'Use in-memory storage for now (message queue comes later)',
    'Assign unique event IDs for deduplication',
    'Add timestamps for ordering and debugging',
  ],

  quickCheck: {
    question: 'Why validate events at ingestion instead of at consumption?',
    options: [
      'It\'s easier to implement',
      'Prevents bad events from polluting the stream and crashing consumers',
      'Validation is faster at ingestion',
      'Consumers don\'t need validation',
    ],
    correctIndex: 1,
    explanation: 'Fail fast principle: reject bad events early before they cause cascading failures in consumers.',
  },

  keyConcepts: [
    { title: 'Schema Validation', explanation: 'Check event structure matches expected format', icon: '✅' },
    { title: 'Event ID', explanation: 'Unique identifier for deduplication', icon: '🔑' },
    { title: 'Timestamp', explanation: 'When the event occurred', icon: '⏰' },
  ],
};

const step2: GuidedStep = {
  id: 'kafka-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Stream events to topics',
    taskDescription: 'Configure APIs and implement Python handlers for event ingestion',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/events and GET /api/v1/events APIs',
      'Open the Python tab',
      'Implement ingest_event() and query_events() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for ingest_event and query_events',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/events', 'GET /api/v1/events'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Kafka Message Queue
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's Black Friday. Event volume just spiked from 1K/sec to 100K/sec!",
  hook: "Your server is overwhelmed and dropping events. Consumers can't keep up. Revenue is being lost!",
  challenge: "Add Kafka to buffer events and decouple producers from consumers.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '🌊',
  message: 'Your pipeline can handle the surge!',
  achievement: 'Kafka buffers events and enables independent consumer scaling',
  metrics: [
    { label: 'Events buffered', after: 'Unlimited' },
    { label: 'Producers decoupled', after: '✓' },
    { label: 'Can replay events', after: '✓' },
  ],
  nextTeaser: "But we're still capturing events manually from the database...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: The Heart of Event Streaming',
  conceptExplanation: `A **message queue** like Kafka decouples producers and consumers:

**Without Kafka:**
Producer → App Server → Process → Send to Consumer (synchronous, fragile)

**With Kafka:**
Producer → App Server → Kafka Topic → Consumers (async, durable)

Benefits:
- **Durability**: Events persist on disk, survive crashes
- **Buffering**: Handle traffic spikes by storing events temporarily
- **Replay**: Consumers can reprocess historical events
- **Scaling**: Add consumers without affecting producers

Kafka organizes events into **topics** (like channels). Each topic can have multiple **partitions** for parallel processing.`,

  whyItMatters: 'Without message queues, producers and consumers must run at the same speed. Kafka lets them operate independently.',

  famousIncident: {
    title: 'Black Friday at Target',
    company: 'Target',
    year: '2011',
    whatHappened: 'Their inventory system couldn\'t handle Black Friday traffic. Synchronous processing meant when checkout slowed, the entire site slowed. They lost millions in sales.',
    lessonLearned: 'Async processing with message queues prevents cascading slowdowns.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Processing 500 billion events per day',
    howTheyDoIt: 'Uses Kafka as the backbone of their entire data platform. Every user action flows through Kafka to 100+ consumer applications.',
  },

  diagram: `
┌──────────┐     ┌─────────────┐     ┌──────────────────┐
│ Producer │ ──▶ │ App Server  │ ──▶ │  Kafka Topics    │
└──────────┘     └─────────────┘     │ orders, payments │
                                     └────────┬─────────┘
                                              │
                       ┌──────────────────────┼──────────────────────┐
                       ▼                      ▼                      ▼
                 ┌──────────┐          ┌──────────┐          ┌──────────┐
                 │Analytics │          │  Email   │          │Inventory │
                 │ Consumer │          │ Consumer │          │ Consumer │
                 └──────────┘          └──────────┘          └──────────┘
`,

  keyPoints: [
    'Kafka topics are append-only logs of events',
    'Events are durable (replicated across brokers)',
    'Multiple consumers can read the same topic independently',
    'Consumers track their own offset (position in log)',
  ],

  quickCheck: {
    question: 'What happens to events in Kafka when all consumers are offline?',
    options: [
      'Events are lost',
      'Events are stored until retention period expires',
      'Producers can\'t send new events',
      'The server crashes',
    ],
    correctIndex: 1,
    explanation: 'Kafka persists events to disk. They remain available until retention period expires (configurable, default 7 days).',
  },

  keyConcepts: [
    { title: 'Topic', explanation: 'Category/channel for organizing events', icon: '📂' },
    { title: 'Partition', explanation: 'Subdivision of topic for parallel processing', icon: '🔀' },
    { title: 'Offset', explanation: 'Consumer\'s position in the event log', icon: '📍' },
  ],
};

const step3: GuidedStep = {
  id: 'kafka-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Stream events to topics (now with durability)',
    taskDescription: 'Add a Message Queue (Kafka) and connect the App Server to it',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer events and enable event streaming', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added to canvas',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Click App Server, then click Message Queue to create a connection',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 4: Add Database and CDC (Change Data Capture)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔍',
  scenario: "The CTO just realized: we're manually sending events to Kafka. What about direct DB updates?",
  hook: "Engineers sometimes update orders directly in the database, bypassing the API. Those changes never reach Kafka!",
  challenge: "Implement CDC to automatically capture all database changes.",
  illustration: 'data-sync',
};

const step4Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Every database change is now captured!',
  achievement: 'CDC streams all changes automatically with zero code changes',
  metrics: [
    { label: 'DB impact', after: 'Near zero' },
    { label: 'Capture completeness', after: '100%' },
    { label: 'Historical replay', after: 'Enabled' },
  ],
  nextTeaser: "But consumers are getting overwhelmed by the event volume...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Change Data Capture: The Database Event Stream',
  conceptExplanation: `**CDC (Change Data Capture)** reads the database transaction log to capture every change:

**Without CDC (Polling):**
- Query: SELECT * FROM orders WHERE updated_at > last_check
- High DB load, slow, may miss concurrent updates

**With CDC (Log Reading):**
- Read database binlog/WAL (write-ahead log)
- Zero impact on DB performance
- Capture every INSERT, UPDATE, DELETE in real-time
- Ordered by transaction commit order

Popular CDC tools:
- **Debezium** - Open source, supports MySQL, Postgres, MongoDB
- **AWS DMS** - Managed service for database migration and CDC
- **Maxwell** - Lightweight, MySQL-focused`,

  whyItMatters: 'CDC is the foundation of event-driven architecture. It turns your database into an event stream.',

  famousIncident: {
    title: 'Airbnb\'s Data Inconsistency Crisis',
    company: 'Airbnb',
    year: '2016',
    whatHappened: 'Their data warehouse was sync\'d via batch jobs that queried the database. During high traffic, queries missed concurrent updates, leading to revenue calculation errors.',
    lessonLearned: 'They migrated to CDC (Debezium + Kafka). Now every DB change flows to the warehouse in real-time.',
    icon: '🏠',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Syncing 50+ databases to their data lake',
    howTheyDoIt: 'Uses Debezium to capture changes from MySQL and Postgres databases. Every change flows to Kafka, then to their Hadoop data lake.',
  },

  diagram: `
┌────────────────────────────────────────────┐
│          Application Layer                 │
│  ┌──────────┐         ┌──────────┐        │
│  │  API     │         │  Admin   │        │
│  │ Service  │         │  Tool    │        │
│  └────┬─────┘         └────┬─────┘        │
└───────┼────────────────────┼───────────────┘
        │ writes             │ direct updates
        ▼                    ▼
   ┌─────────────────────────────────┐
   │        Database (MySQL)         │
   │      ┌───────────────┐          │
   │      │   Binlog      │◀─────────┼───── CDC reads here
   │      │ (change log)  │          │      (zero app changes!)
   │      └───────┬───────┘          │
   └──────────────┼──────────────────┘
                  │
                  ▼
          ┌────────────┐
          │  Debezium  │
          │ CDC Engine │
          └──────┬─────┘
                 │
                 ▼
          ┌────────────┐
          │   Kafka    │
          │   Topic    │
          └────────────┘
`,

  keyPoints: [
    'CDC reads transaction logs, not tables',
    'Captures every change with zero app code changes',
    'Preserves order within a transaction',
    'Enables event sourcing architecture',
  ],

  quickCheck: {
    question: 'Why is CDC better than polling the database for changes?',
    options: [
      'CDC is easier to implement',
      'CDC has zero DB impact and captures 100% of changes in order',
      'CDC is faster',
      'CDC requires less storage',
    ],
    correctIndex: 1,
    explanation: 'Polling adds load to DB and may miss concurrent updates. CDC reads logs asynchronously with no query overhead.',
  },

  keyConcepts: [
    { title: 'Binlog/WAL', explanation: 'Database write-ahead log for durability', icon: '📜' },
    { title: 'CDC Connector', explanation: 'Reads logs and publishes to Kafka', icon: '🔌' },
    { title: 'Event Sourcing', explanation: 'Store all changes as events', icon: '📝' },
  ],
};

const step4: GuidedStep = {
  id: 'kafka-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Capture database changes (CDC)',
    taskDescription: 'Add a Database and enable CDC to stream changes to Kafka',
    componentsNeeded: [
      { type: 'database', reason: 'Source of truth for orders, inventory, users', displayName: 'MySQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Database connected to Message Queue (CDC enabled)',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'database', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Database (MySQL) component onto the canvas',
    level2: 'Connect Database to Message Queue. This represents CDC streaming changes to Kafka.',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
      { from: 'database', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 5: Configure Topic Partitioning
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your single consumer is processing 10K events/sec. Event lag is growing to hours!",
  hook: "You tried adding more consumers, but only one is active. The others sit idle!",
  challenge: "Configure topic partitioning to enable parallel consumption.",
  illustration: 'slow-processing',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Consumers now process in parallel!',
  achievement: 'Partitioning enables horizontal scaling of event processing',
  metrics: [
    { label: 'Processing speed', before: '10K/sec', after: '100K/sec' },
    { label: 'Consumer lag', before: '2 hours', after: '<10 seconds' },
    { label: 'Active consumers', before: '1', after: '10+' },
  ],
  nextTeaser: "But we're seeing duplicate events in analytics...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Topic Partitioning: Parallelism with Ordering',
  conceptExplanation: `**Partitions** are the unit of parallelism in Kafka:

A topic with 1 partition:
- Only 1 consumer can read (others sit idle)
- Processing limited by single consumer's speed
- All events processed in order

A topic with 20 partitions:
- Up to 20 consumers can read in parallel
- 20x processing throughput
- Ordering preserved **within each partition**

**Partition Key Strategy:**
- Key = order_id: All events for an order go to same partition (ordering preserved)
- Key = user_id: All events for a user go to same partition
- Key = null: Round-robin across partitions (no ordering)

Formula: partition = hash(key) % num_partitions`,

  whyItMatters: 'Without partitioning, Kafka is just a slow queue. Partitions enable massive parallelism.',

  famousIncident: {
    title: 'LinkedIn\'s Feed Ranking Disaster',
    company: 'LinkedIn',
    year: '2015',
    whatHappened: 'They partitioned feed events by timestamp instead of user_id. Events for the same user went to different partitions, losing ordering. Users saw posts out of sequence.',
    lessonLearned: 'Partition by entity ID to preserve ordering where it matters.',
    icon: '🔀',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing order events at 100K/sec',
    howTheyDoIt: 'Partitions order topics by shop_id. Each shop\'s orders are processed in sequence, but different shops process in parallel across 50+ partitions.',
  },

  diagram: `
Topic: "orders" (3 partitions)

Producer sends with key=order_id

order_id=12345 ────────────────────▶  Partition 0  ──▶ Consumer A
order_id=67890 ────────────────────▶  Partition 1  ──▶ Consumer B
order_id=24680 ────────────────────▶  Partition 2  ──▶ Consumer C
order_id=13579 ────────────────────▶  Partition 0  ──▶ Consumer A
                                       ▲
                                       │
              hash(order_id) % 3 determines partition
`,

  keyPoints: [
    'More partitions = more parallelism (up to # of partitions)',
    'Choose partition key based on ordering requirements',
    'Consumer group automatically distributes partitions',
    'Rebalancing happens when consumers join/leave',
  ],

  quickCheck: {
    question: 'If you have 20 partitions, what\'s the max number of consumers that can read in parallel?',
    options: [
      'Unlimited',
      '20 (one per partition)',
      '10 (half the partitions)',
      '1 (Kafka doesn\'t support parallel consumers)',
    ],
    correctIndex: 1,
    explanation: 'Each partition can be consumed by exactly one consumer in a consumer group. More consumers than partitions = idle consumers.',
  },

  keyConcepts: [
    { title: 'Partition', explanation: 'Ordered, immutable log of events', icon: '📁' },
    { title: 'Partition Key', explanation: 'Determines which partition an event goes to', icon: '🔑' },
    { title: 'Consumer Group', explanation: 'Set of consumers that share partition consumption', icon: '👥' },
  ],
};

const step5: GuidedStep = {
  id: 'kafka-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Process events in real-time (now with parallelism)',
    taskDescription: 'Configure topic partitioning in Kafka to enable parallel consumption',
    successCriteria: [
      'Click on Message Queue component',
      'Go to Configuration tab',
      'Set number of partitions to 20',
      'Set partition key strategy to entity_id',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'database', toType: 'message_queue' },
    ],
    requirePartitioning: true,
  },

  hints: {
    level1: 'Click on the Message Queue, then find the partitioning settings',
    level2: 'Set partitions to 20 and partition key to entity_id (order_id, user_id, etc.)',
    solutionComponents: [
      { type: 'message_queue', config: { partitions: 20, partitionKey: 'entity_id' } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Implement Exactly-Once Semantics
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💸',
  scenario: "The analytics team is reporting inflated revenue numbers!",
  hook: "Investigation reveals: some order.completed events are being processed twice. Revenue is double-counted!",
  challenge: "Implement exactly-once semantics to prevent duplicate processing.",
  illustration: 'data-corruption',
};

const step6Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'Every event is processed exactly once!',
  achievement: 'Idempotent producers and transactional consumers prevent duplicates',
  metrics: [
    { label: 'Duplicate events', before: '0.1%', after: '0%' },
    { label: 'Revenue accuracy', after: '100%' },
    { label: 'Event guarantees', after: 'Exactly-once' },
  ],
  nextTeaser: "But what if Kafka brokers fail?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Exactly-Once Semantics: The Holy Grail',
  conceptExplanation: `Exactly-once is HARD in distributed systems. Kafka achieves it through:

**1. Idempotent Producers:**
- Producer assigns sequence number to each message
- Kafka detects and ignores duplicates (network retries)
- Enable: \`enable.idempotence=true\`

**2. Transactional Producers:**
- Group of messages committed atomically
- All or nothing: prevents partial writes
- Use for multi-topic writes

**3. Transactional Consumers:**
- Read messages and write results in a transaction
- Commit offset only if processing succeeds
- Enable: \`isolation.level=read_committed\`

The Three Guarantees:
- **At-most-once**: May lose messages (fast, unreliable)
- **At-least-once**: May duplicate messages (default)
- **Exactly-once**: No loss, no duplicates (requires config)`,

  whyItMatters: 'Financial systems cannot tolerate duplicates or losses. Exactly-once is non-negotiable.',

  famousIncident: {
    title: 'The $40 Million Typo',
    company: 'Citibank',
    year: '2020',
    whatHappened: 'A Citibank employee accidentally sent a $900M payment instead of $7.8M (meant to be interest payment). The system had no idempotency check. Revlon\'s lenders kept $500M, arguing it was payment of their loan.',
    lessonLearned: 'Financial operations MUST be idempotent. One accidental duplicate can cost millions.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing payments with zero duplicates',
    howTheyDoIt: 'Requires idempotency keys on all payment requests. Same key = same result (cached for 24 hours). Prevents accidental double-charges.',
  },

  diagram: `
EXACTLY-ONCE FLOW:

Producer                    Kafka Broker              Consumer
   │                             │                        │
   │ 1. Send event (seq=1)       │                        │
   ├────────────────────────────▶│                        │
   │ 2. ACK (but lost in network)│                        │
   │◀────────────────────────────┤                        │
   │    Network timeout!          │                        │
   │ 3. Retry (seq=1) ◀──idempotent producer            │
   ├────────────────────────────▶│                        │
   │                             │ Detected duplicate!    │
   │                             │ (same seq #)           │
   │ 4. ACK (duplicate ignored)  │                        │
   │◀────────────────────────────┤                        │
   │                             │ 5. Consumer reads      │
   │                             ├───────────────────────▶│
   │                             │                        │ 6. Process + commit
   │                             │                        │    in transaction
   │                             │ 7. ACK offset          │
   │                             │◀───────────────────────┤
                                              ▲
                                              │
                              If processing fails, offset
                              NOT committed = reprocess
`,

  keyPoints: [
    'Idempotent producers prevent duplicate sends',
    'Transactional consumers prevent duplicate processing',
    'Both producer and consumer must be configured',
    'Slight performance cost (~10%) for exactness',
  ],

  quickCheck: {
    question: 'What\'s the difference between at-least-once and exactly-once?',
    options: [
      'Exactly-once is faster',
      'At-least-once may process duplicates; exactly-once never does',
      'Exactly-once can lose messages',
      'There is no difference',
    ],
    correctIndex: 1,
    explanation: 'At-least-once guarantees delivery but may duplicate. Exactly-once guarantees no duplicates and no losses.',
  },

  keyConcepts: [
    { title: 'Idempotent Producer', explanation: 'Detects and prevents duplicate sends', icon: '🔁' },
    { title: 'Transactional Consumer', explanation: 'Process and commit atomically', icon: '⚛️' },
    { title: 'Sequence Number', explanation: 'Tracks message uniqueness', icon: '🔢' },
  ],
};

const step6: GuidedStep = {
  id: 'kafka-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Guarantee exactly-once delivery',
    taskDescription: 'Configure Kafka for exactly-once semantics',
    successCriteria: [
      'Click on Message Queue component',
      'Go to Configuration tab',
      'Enable idempotent producers',
      'Enable transactional consumers',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'database', toType: 'message_queue' },
    ],
    requirePartitioning: true,
    requireExactlyOnce: true,
  },

  hints: {
    level1: 'Click on the Message Queue, then find the delivery semantics settings',
    level2: 'Enable both idempotent producers and transactional consumers for exactly-once guarantees',
    solutionComponents: [
      { type: 'message_queue', config: { idempotent: true, transactional: true } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Kafka Replication
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚠️',
  scenario: "At 2 AM, a Kafka broker crashed. ALL event processing stopped for 20 minutes!",
  hook: "Revenue loss: $100,000. The on-call engineer had to manually restart the broker.",
  challenge: "Add replication so the system survives broker failures automatically.",
  illustration: 'database-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Your pipeline is now fault-tolerant!',
  achievement: 'Replication ensures automatic failover with zero data loss',
  metrics: [
    { label: 'Kafka availability', before: '99%', after: '99.99%' },
    { label: 'Automatic failover', after: 'Enabled' },
    { label: 'Data durability', after: '3 copies' },
  ],
  nextTeaser: "But we need to add consumers for downstream services...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Kafka Replication: Fault Tolerance at Scale',
  conceptExplanation: `**Replication** copies each partition across multiple Kafka brokers:

For each partition:
- **Leader**: Handles all reads and writes
- **Followers (Replicas)**: Keep in-sync copies
- **ISR (In-Sync Replicas)**: Replicas that are fully caught up

When a leader fails:
1. Kafka detects failure (via ZooKeeper/KRaft)
2. Promotes a follower from ISR to leader
3. Producers/consumers automatically reconnect
4. Happens in seconds with zero data loss

**Replication Factor:**
- RF=1: No replication (dangerous!)
- RF=2: 1 copy (can tolerate 1 broker failure)
- RF=3: 2 copies (can tolerate 2 broker failures) ← recommended`,

  whyItMatters: 'Without replication, a single broker failure loses all data on that broker. Replication is mandatory for production.',

  famousIncident: {
    title: 'AWS US-EAST-1 Outage',
    company: 'Amazon Web Services',
    year: '2017',
    whatHappened: 'A typo in a command brought down S3 in US-EAST-1. Services using Kafka with RF=1 lost data. Services with RF=3 stayed online by failing over to replicas in other availability zones.',
    lessonLearned: 'Replicate across failure domains (racks, AZs). RF=3 minimum for production.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Running 1000+ Kafka brokers',
    howTheyDoIt: 'Uses RF=3 for all critical topics. Replicas spread across 3 data centers. Can lose an entire datacenter and stay online.',
  },

  diagram: `
Topic: "orders" (3 partitions, RF=3)

Partition 0:  [Leader: Broker-1] ──replicates──▶ [Follower: Broker-2] ──▶ [Follower: Broker-3]
Partition 1:  [Follower: Broker-1] ◀──────────── [Leader: Broker-2] ──▶ [Follower: Broker-3]
Partition 2:  [Follower: Broker-1] ◀──────────── [Follower: Broker-2] ◀── [Leader: Broker-3]

If Broker-2 crashes:
- Partition 0: Still has leader on Broker-1 ✓
- Partition 1: Promotes follower on Broker-1 or Broker-3 to leader ✓
- Partition 2: Still has leader on Broker-3 ✓

Result: Zero downtime!
`,

  keyPoints: [
    'Replication Factor = number of copies (including leader)',
    'ISR = replicas that are caught up with leader',
    'Producers can wait for all ISR acknowledgment (safer)',
    'Spread replicas across racks/AZs for better fault tolerance',
  ],

  quickCheck: {
    question: 'With RF=3, how many broker failures can you tolerate without data loss?',
    options: [
      '3 brokers',
      '2 brokers (if not in ISR)',
      '1 broker (if it was the only leader)',
      'Depends on which brokers and ISR state',
    ],
    correctIndex: 3,
    explanation: 'It depends! If all 3 replicas of a partition are on failed brokers, that partition is lost. Spread replicas across racks/AZs.',
  },

  keyConcepts: [
    { title: 'Leader', explanation: 'Handles all I/O for a partition', icon: '👑' },
    { title: 'ISR', explanation: 'In-Sync Replicas that can become leader', icon: '🔄' },
    { title: 'Replication Factor', explanation: 'Number of copies of each partition', icon: '📋' },
  ],
};

const step7: GuidedStep = {
  id: 'kafka-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable event storage',
    taskDescription: 'Enable replication for Kafka topics',
    successCriteria: [
      'Click on Message Queue component',
      'Go to Configuration tab',
      'Set replication factor to 3',
      'Ensure min in-sync replicas is 2',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'database', toType: 'message_queue' },
    ],
    requirePartitioning: true,
    requireExactlyOnce: true,
    requireKafkaReplication: true,
  },

  hints: {
    level1: 'Click on the Message Queue, then find the replication settings',
    level2: 'Set replication factor to 3 and min ISR to 2 for fault tolerance',
    solutionComponents: [
      { type: 'message_queue', config: { replicationFactor: 3, minInSyncReplicas: 2 } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Consumer Services
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📊',
  scenario: "Events are flowing perfectly into Kafka. But nobody is consuming them!",
  hook: "The analytics team is asking: 'Where's our real-time dashboard?' The email service is asking: 'When do we send order confirmations?'",
  challenge: "Add consumer services to process events from Kafka.",
  illustration: 'integration',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Downstream services are now processing events!',
  achievement: 'Multiple independent consumers enable real-time analytics and notifications',
  metrics: [
    { label: 'Active consumers', after: '3+' },
    { label: 'Events processed/sec', after: '100K+' },
    { label: 'Consumer lag', after: '<5 seconds' },
  ],
  nextTeaser: "But consumers are slow and consuming the same partitions...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Consumer Groups: Independent Event Processing',
  conceptExplanation: `**Consumer Groups** enable multiple applications to independently consume the same events:

Each consumer group:
- Has a unique \`group.id\`
- Tracks its own offset (progress) in the topic
- Processes events independently of other groups

Example:
- **Group "analytics"**: Writes to data warehouse
- **Group "notifications"**: Sends emails
- **Group "fraud-detection"**: Analyzes patterns

Same events, different purposes!

Within a consumer group:
- Partitions are distributed across consumers
- Each partition consumed by exactly one consumer
- Adding consumers increases parallelism (up to # partitions)
- Consumer crashes → automatic rebalancing`,

  whyItMatters: 'Consumer groups are why Kafka scales. One event stream, unlimited independent consumers.',

  famousIncident: {
    title: 'Spotify\'s Discover Weekly',
    company: 'Spotify',
    year: '2015',
    whatHappened: 'When they launched Discover Weekly, they needed to process user listening history in multiple ways: recommendations, analytics, and reporting. Single consumer couldn\'t keep up. They created 3 consumer groups reading the same events, each optimized for its workload.',
    lessonLearned: 'Consumer groups enable specialized processing without duplicating data.',
    icon: '🎵',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Processing trip events for 10+ use cases',
    howTheyDoIt: 'Single "trips" topic consumed by 15+ consumer groups: billing, surge pricing, driver ratings, fraud detection, ML training, analytics, etc.',
  },

  diagram: `
          ┌────────────────────────────┐
          │   Kafka Topic: "orders"    │
          │  [P0] [P1] [P2] [P3] [P4]  │
          └──────────┬─────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│Consumer Group│ │Consumer  │ │Consumer Group│
│ "analytics"  │ │  Group   │ │ "fraud-det"  │
│              │ │"email"   │ │              │
│ ┌──────┐     │ │          │ │ ┌──────┐     │
│ │Worker│     │ │ ┌──────┐ │ │ │Worker│     │
│ │  1   │ P0  │ │ │Worker│ │ │ │  1   │ P0-2│
│ └──────┘     │ │ │  1   │ │ │ └──────┘     │
│ ┌──────┐     │ │ │      │ │ │ ┌──────┐     │
│ │Worker│     │ │ │All   │ │ │ │Worker│     │
│ │  2   │ P1-4│ │ │Parts │ │ │ │  2   │ P3-4│
│ └──────┘     │ │ └──────┘ │ │ └──────┘     │
└──────────────┘ └──────────┘ └──────────────┘
`,

  keyPoints: [
    'Different consumer groups process same events independently',
    'Each group tracks own offset (can be at different positions)',
    'Consumers within a group share partitions for parallelism',
    'Add/remove consumers triggers automatic rebalancing',
  ],

  quickCheck: {
    question: 'If you have 2 consumer groups reading the same topic, do they interfere with each other?',
    options: [
      'Yes, they consume the same events so one group starves',
      'No, each group tracks its own offset independently',
      'Yes, Kafka only supports one consumer group per topic',
      'It depends on partition count',
    ],
    correctIndex: 1,
    explanation: 'Consumer groups are completely independent. Each tracks its own offset. Same events, different purposes!',
  },

  keyConcepts: [
    { title: 'Consumer Group', explanation: 'Set of consumers sharing consumption', icon: '👥' },
    { title: 'Offset', explanation: 'Position of consumer in the event log', icon: '📍' },
    { title: 'Rebalancing', explanation: 'Redistributing partitions when consumers change', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'kafka-step-8',
  stepNumber: 8,
  frIndex: 2,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-3: Process events in real-time (downstream consumers)',
    taskDescription: 'Add consumer App Servers for different use cases',
    componentsNeeded: [
      { type: 'app_server', reason: 'Analytics consumer processing events', displayName: 'Analytics Service' },
      { type: 'app_server', reason: 'Notification consumer sending emails', displayName: 'Email Service' },
    ],
    successCriteria: [
      'Add at least 2 consumer App Server components',
      'Connect each consumer to Message Queue',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'database', toType: 'message_queue' },
    ],
    requirePartitioning: true,
    requireExactlyOnce: true,
    requireKafkaReplication: true,
    requireMultipleConsumers: true,
  },

  hints: {
    level1: 'Drag additional App Server components (for analytics, emails, etc.) onto the canvas',
    level2: 'Connect each consumer App Server to the Message Queue to read events',
    solutionComponents: [
      { type: 'app_server', displayName: 'Analytics Service' },
      { type: 'app_server', displayName: 'Email Service' },
    ],
    solutionConnections: [
      { from: 'message_queue', to: 'app_server' },
      { from: 'message_queue', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 9: Add Cache for Consumer Performance
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🐌',
  scenario: "The analytics consumer is slow! It queries the database for user info on every event.",
  hook: "Processing 100K events/sec means 100K database queries/sec. The database is melting!",
  challenge: "Add caching to reduce database load and speed up consumers.",
  illustration: 'slow-loading',
};

const step9Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Consumers are now 10x faster!',
  achievement: 'Caching eliminates redundant database queries',
  metrics: [
    { label: 'DB queries/sec', before: '100K', after: '5K' },
    { label: 'Processing speed', before: '10K/sec', after: '100K/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But we're still storing events in Kafka forever...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Caching in Stream Processing: Speed at Scale',
  conceptExplanation: `Stream consumers often need reference data (user profiles, product info) to enrich events:

**Without Cache:**
Event arrives → Query DB for user info → Process → Repeat for every event
- 100K events/sec = 100K DB queries/sec
- DB becomes bottleneck

**With Cache:**
Event arrives → Check cache for user info
- Cache hit (95%): Process instantly
- Cache miss (5%): Query DB, cache result, process
- 100K events/sec = 5K DB queries/sec

**Caching Strategies:**
- **Cache-aside**: Check cache, load on miss
- **Write-through**: Update cache when DB changes (via CDC!)
- **TTL**: Expire old entries to handle updates`,

  whyItMatters: 'Stream processing is about speed. Caching turns 100ms database queries into 1ms cache lookups.',

  famousIncident: {
    title: 'Twitter Timeline Stampede',
    company: 'Twitter',
    year: '2014',
    whatHappened: 'Their stream processing jobs fetched user profiles from the database for every tweet. During the World Cup, traffic spiked 10x. Database couldn\'t handle the load. Timelines stopped updating for millions of users.',
    lessonLearned: 'They added Redis caching for user profiles. Same spike, zero database load.',
    icon: '🏆',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Processing viewing events at 500K/sec',
    howTheyDoIt: 'Uses EVCache (distributed cache) to store user profiles, content metadata, and preferences. Streaming jobs hit cache, not database.',
  },

  diagram: `
Event Stream                    Consumer
     │                             │
     │  order.created             │
     ├────────────────────────────▶│
     │  {order_id: 123,           │ Need user email
     │   user_id: 456}            │ to send notification
     │                             │
     │                             ▼
     │                    ┌────────────────┐
     │                    │  Check Redis   │
     │                    │  for user:456  │
     │                    └───────┬────────┘
     │                            │
     │           ┌────────────────┴────────────────┐
     │           ▼                                  ▼
     │      Cache Hit                          Cache Miss
     │    ┌──────────┐                      ┌──────────┐
     │    │ Return   │                      │ Query DB │
     │    │instantly │                      │ Cache it │
     │    └──────────┘                      └──────────┘
     │           │                                  │
     │           └─────────────┬────────────────────┘
     │                         ▼
     │                  Process + Send Email
`,

  keyPoints: [
    'Cache reference data that\'s accessed frequently',
    'Use CDC to keep cache in sync with database',
    'Set appropriate TTL based on update frequency',
    'Monitor cache hit rate (aim for >90%)',
  ],

  quickCheck: {
    question: 'What\'s the benefit of caching in stream processing?',
    options: [
      'Reduces database load and increases processing speed',
      'Stores events permanently',
      'Replaces the database',
      'Makes events arrive faster',
    ],
    correctIndex: 0,
    explanation: 'Caching reduces database queries (lower load) and eliminates query latency (faster processing).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache, instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache, fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live before cached data expires', icon: '⏱️' },
  ],
};

const step9: GuidedStep = {
  id: 'kafka-step-9',
  stepNumber: 9,
  frIndex: 2,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-3: Process events in real-time (now with caching)',
    taskDescription: 'Add a Cache for consumer services to use',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache user and product data for fast lookups', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Consumer App Servers connected to Cache',
      'Cache TTL configured (300 seconds)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'database', toType: 'message_queue' },
    ],
    requirePartitioning: true,
    requireExactlyOnce: true,
    requireKafkaReplication: true,
    requireMultipleConsumers: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect consumer App Servers to Cache. Set TTL to 300 seconds for reference data.',
    solutionComponents: [{ type: 'cache', config: { ttl: 300 } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 10: Configure Event Retention and Storage Tiering
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💾',
  scenario: "Your Kafka cluster is running out of disk space! Storage costs are $50K/month.",
  hook: "You're storing 17TB of events per day forever. After 30 days, that's 500TB!",
  challenge: "Configure retention policies and tiered storage to optimize costs.",
  illustration: 'storage-full',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production Kafka pipeline!',
  achievement: 'A scalable, fault-tolerant real-time data streaming platform',
  metrics: [
    { label: 'Storage cost', before: '$50K/month', after: '$10K/month' },
    { label: 'Throughput', after: '100K events/sec' },
    { label: 'Latency', after: '<1 second' },
    { label: 'Exactly-once', after: 'Enabled' },
    { label: 'Fault tolerance', after: 'RF=3' },
  ],
  nextTeaser: "You've mastered Kafka streaming architecture!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Event Retention: Balancing Storage and Replay',
  conceptExplanation: `Kafka stores events on disk. How long should they be retained?

**Retention Policies:**
1. **Time-based**: Delete after N days (default 7 days)
   - Good for: High-volume topics where replay is rare
   - Example: \`retention.ms=604800000\` (7 days)

2. **Size-based**: Delete when topic reaches N GB
   - Good for: Limiting storage per topic
   - Example: \`retention.bytes=107374182400\` (100GB)

3. **Infinite retention**: Keep forever
   - Good for: Event sourcing, audit logs
   - Requires tiered storage!

**Tiered Storage (Kafka 2.8+):**
- Hot tier: Recent events on fast SSD (last 7 days)
- Cold tier: Old events on S3/GCS (7 days to forever)
- Seamless access: Consumers don't know the difference
- Cost savings: 90% cheaper storage for old events`,

  whyItMatters: 'Storage is expensive. Smart retention policies save money while preserving replay capability.',

  famousIncident: {
    title: 'Uber\'s Data Loss from Aggressive Retention',
    company: 'Uber',
    year: '2018',
    whatHappened: 'Set retention to 1 day to save storage costs. When a critical consumer fell behind by 2 days due to a bug, events were already deleted. Lost 2 days of trip data, impacting billing and analytics.',
    lessonLearned: 'Retention should be longer than max expected consumer lag + buffer. Now they use 14-day retention + tiered storage.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Storing 10+ years of order events',
    howTheyDoIt: 'Uses tiered storage: 7 days on SSD (hot), 90 days on HDD (warm), forever on S3 (cold). Can replay from any point in history.',
  },

  diagram: `
Event Lifecycle:

Day 0-7: Hot Tier (SSD)
┌─────────────────────────────────┐
│  Fast access, high cost          │
│  Recent events                   │
│  Low latency reads (<10ms)      │
└────────────┬────────────────────┘
             │ Age out after 7 days
             ▼
Day 7-90: Warm Tier (HDD)
┌─────────────────────────────────┐
│  Medium speed, medium cost       │
│  Replay capability               │
│  Medium latency reads (~100ms)  │
└────────────┬────────────────────┘
             │ Age out after 90 days
             ▼
Day 90+: Cold Tier (S3)
┌─────────────────────────────────┐
│  Slow access, low cost (90% ↓)  │
│  Long-term audit/compliance      │
│  High latency reads (~1s)       │
│  Can keep forever!               │
└─────────────────────────────────┘
`,

  keyPoints: [
    'Balance retention with storage costs and replay needs',
    'Use tiered storage to keep old events cheaply',
    'Retention should exceed max consumer lag',
    'Critical topics (audit logs) may need infinite retention',
  ],

  quickCheck: {
    question: 'What\'s the benefit of tiered storage over deleting old events?',
    options: [
      'It\'s faster',
      'Keeps events accessible for replay while reducing storage costs by 90%',
      'It improves throughput',
      'It simplifies configuration',
    ],
    correctIndex: 1,
    explanation: 'Tiered storage moves old events to cheap storage (S3) instead of deleting. Replay still works, but costs 90% less.',
  },

  keyConcepts: [
    { title: 'Retention Policy', explanation: 'How long to keep events', icon: '⏳' },
    { title: 'Tiered Storage', explanation: 'Hot/warm/cold storage by age', icon: '🗄️' },
    { title: 'Compacted Topics', explanation: 'Keep only latest value per key', icon: '🗜️' },
  ],
};

const step10: GuidedStep = {
  id: 'kafka-step-10',
  stepNumber: 10,
  frIndex: 4,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-5: Support event replay (with cost optimization)',
    taskDescription: 'Configure retention policies and tiered storage',
    successCriteria: [
      'Click on Message Queue component',
      'Set retention period to 7 days for hot storage',
      'Enable tiered storage with S3/cold tier for long-term retention',
      'Configure compaction for changelog topics',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'database', toType: 'message_queue' },
    ],
    requirePartitioning: true,
    requireExactlyOnce: true,
    requireKafkaReplication: true,
    requireMultipleConsumers: true,
    requireCacheStrategy: true,
    requireRetentionPolicy: true,
  },

  hints: {
    level1: 'Click on Message Queue, find retention and storage tier settings',
    level2: 'Set retention to 7 days and enable tiered storage for cost optimization',
    solutionComponents: [
      { type: 'message_queue', config: { retentionDays: 7, tieredStorage: true } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const kafkaStreamingPipelineGuidedTutorial: GuidedTutorial = {
  problemId: 'kafka-streaming-pipeline',
  title: 'Design a Kafka Streaming Pipeline',
  description: 'Build a real-time data streaming platform with CDC, exactly-once semantics, and partitioning',
  difficulty: 'advanced',
  estimatedMinutes: 75,

  welcomeStory: {
    emoji: '🌊',
    hook: "You've been hired as Lead Data Engineer at StreamTech Inc!",
    scenario: "Your mission: Build a real-time data pipeline that processes 100,000 events per second from an e-commerce platform, streaming changes to analytics, notifications, and fraud detection systems.",
    challenge: "Can you design a system that guarantees exactly-once processing at massive scale?",
  },

  requirementsPhase: kafkaRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Event-Driven Architecture',
    'Change Data Capture (CDC)',
    'Message Queues',
    'Topic Partitioning',
    'Exactly-Once Semantics',
    'Consumer Groups',
    'Kafka Replication',
    'Stream Processing',
    'Event Replay',
    'Tiered Storage',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (log-structured storage)',
    'Chapter 4: Encoding and Evolution (schema evolution)',
    'Chapter 10: Batch Processing',
    'Chapter 11: Stream Processing (Kafka architecture)',
  ],
};

export default kafkaStreamingPipelineGuidedTutorial;
