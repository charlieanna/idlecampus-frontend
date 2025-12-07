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
 * Simple Pub/Sub Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches pub/sub system design concepts
 * while building a message broker. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution (in-memory) - FRs satisfied!
 * Steps 4-6: Apply NFRs (persistence, fan-out, scale)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const simplePubsubRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a simple publish-subscribe (pub/sub) messaging system like RabbitMQ or Google Pub/Sub",

  interviewer: {
    name: 'Jordan Lee',
    role: 'Staff Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-topics',
      category: 'functional',
      question: "What's the main purpose of this system? What can users do?",
      answer: "The system implements a pub/sub pattern:\n1. **Create Topics**: Publishers can create named topics (e.g., 'orders', 'notifications')\n2. **Publish Messages**: Publishers send messages to topics\n3. **Subscribe**: Consumers subscribe to topics they're interested in\n4. **Receive Messages**: All subscribers to a topic receive every message published to that topic\n\nThink of it like a radio station - one broadcaster (publisher) sends a signal (message) to a channel (topic), and everyone tuned in (subscribers) receives it.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Pub/Sub decouples publishers from subscribers - they don't know about each other",
    },
    {
      id: 'fan-out',
      category: 'functional',
      question: "If I publish one message to a topic with 10 subscribers, how many messages get delivered?",
      answer: "All 10 subscribers receive a copy of the message. This is called **fan-out** - one message fans out to N subscribers. If a topic has 1,000 subscribers, all 1,000 get the message. This is the key difference from a queue (where only one consumer gets each message).",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Fan-out is the defining characteristic of pub/sub systems",
    },
    {
      id: 'subscription-isolation',
      category: 'functional',
      question: "If subscriber A has read 5 messages but subscriber B just joined, what does B see?",
      answer: "Each subscriber has independent message tracking. Subscriber B starts receiving messages from when they subscribed (or from the beginning if we support replay). A's progress doesn't affect B at all. Each subscription maintains its own read position.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Subscriptions are isolated - each tracks its own position independently",
    },

    // IMPORTANT - Clarifications
    {
      id: 'message-ordering',
      category: 'clarification',
      question: "If I publish messages A, B, C to a topic, do subscribers receive them in that order?",
      answer: "Yes, within a topic, messages should be delivered in order. If a publisher sends A, then B, then C, subscribers should receive them in that same order. This ordering guarantee is important for many use cases.",
      importance: 'important',
      insight: "Ordering within a topic is a key guarantee",
    },
    {
      id: 'multiple-topics',
      category: 'clarification',
      question: "Can one subscriber subscribe to multiple topics?",
      answer: "Yes! A subscriber can subscribe to as many topics as they want. For example, a logging service might subscribe to 'errors', 'warnings', and 'audit-logs'. Each subscription is independent.",
      importance: 'important',
      insight: "Subscribers can have multiple independent subscriptions",
    },
    {
      id: 'message-lifecycle',
      category: 'clarification',
      question: "How long do messages stay in the system? When are they deleted?",
      answer: "Messages are retained for a configurable time (e.g., 7 days) or until all subscribers have acknowledged them, whichever comes first. For the MVP, let's keep messages for 24 hours. This gives subscribers time to catch up if they're offline.",
      importance: 'important',
      insight: "Message retention is a configurable policy",
    },
    {
      id: 'ack-semantics',
      category: 'clarification',
      question: "What happens if a subscriber receives a message but crashes before processing it?",
      answer: "Subscribers must acknowledge (ACK) messages after processing. If a message is delivered but not acknowledged within a timeout (e.g., 30 seconds), it gets redelivered. This ensures at-least-once delivery - messages might be delivered more than once, but never lost.",
      importance: 'important',
      insight: "At-least-once delivery requires acknowledgment and redelivery",
    },

    // SCOPE
    {
      id: 'scope-dead-letter',
      category: 'scope',
      question: "What happens to messages that fail repeatedly?",
      answer: "For v1, let's retry up to 3 times. After 3 failures, we'll log an error. Dead-letter queues (DLQ) for failed messages can be a v2 feature.",
      importance: 'nice-to-have',
      insight: "Dead-letter queues are common but can be deferred",
    },
    {
      id: 'throughput-scale',
      category: 'throughput',
      question: "How many messages per second should the system handle?",
      answer: "Start with 5,000 messages/sec (publish + consume). A single topic might have 100 messages/sec with 50 subscribers, so that's 5,000 deliveries/sec total.",
      importance: 'critical',
      learningPoint: "Fan-out multiplies delivery load: 100 publishes × 50 subscribers = 5,000 deliveries",
    },
    {
      id: 'latency-target',
      category: 'latency',
      question: "How fast should message delivery be?",
      answer: "Publishing should be fast (< 10ms p95) since publishers wait for confirmation. Delivery can be slightly slower (< 50ms p95) since it's async. The key is reliability over raw speed.",
      importance: 'critical',
      learningPoint: "Pub/Sub prioritizes reliability and fan-out over ultra-low latency",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-topics', 'fan-out', 'subscription-isolation'],
  criticalFRQuestionIds: ['core-topics', 'fan-out', 'subscription-isolation'],
  criticalScaleQuestionIds: ['throughput-scale', 'latency-target'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Create and manage topics',
      description: 'Publishers can create named topics to organize message streams',
      emoji: '📢',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Publish messages to topics',
      description: 'Publishers can send messages to topics',
      emoji: '📤',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Subscribe to topics',
      description: 'Consumers can subscribe to topics to receive messages',
      emoji: '🔔',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Fan-out message delivery',
      description: 'One published message is delivered to ALL subscribers of that topic',
      emoji: '📡',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Independent subscription tracking',
      description: 'Each subscription tracks its own read position independently',
      emoji: '📍',
    },
  ],

  scaleMetrics: {
    throughputTarget: '5,000 messages/sec',
    publishLatency: '< 10ms p95',
    deliveryLatency: '< 50ms p95',
    messageRetention: '24 hours',
    maxRetries: 3,
    ackTimeout: '30 seconds',
  },

  architecturalImplications: [
    'Fan-out amplifies load: 100 publishes × 50 subscribers = 5,000 deliveries',
    'Need message broker to manage topics and subscriptions',
    'Each subscription needs independent offset tracking',
    'At-least-once delivery requires ACK tracking and redelivery',
    'Message persistence ensures durability',
  ],

  outOfScope: [
    'Dead-letter queues (v2)',
    'Message filtering/routing (v2)',
    'Exactly-once delivery (v2)',
    'Multi-region replication (v2)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple in-memory pub/sub that handles topics, subscriptions, and fan-out. Once it works, we'll add persistence and scale. This is the right way to approach system design: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome, engineer! You've been hired to build a pub/sub messaging system.",
  hook: "Your first task: get the basic system running. Publishers and subscribers need to connect to your server.",
  challenge: "Connect the Client to the App Server to handle publish and subscribe requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your system is connected!",
  achievement: "Publishers and subscribers can now send requests to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write some code!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Pub/Sub Architecture',
  conceptExplanation: `Every pub/sub system starts with an **App Server** (or Message Broker) - the brain of your messaging system.

When a publisher sends a message, the request travels to your app server, which:
1. Receives the publish request
2. Stores the message
3. Delivers it to all subscribers
4. Returns confirmation to the publisher

Think of it as a post office - publishers drop off mail, the post office sorts and delivers it to all subscribers.`,
  whyItMatters: 'The app server is the entry point for ALL publish and subscribe operations.',
  keyPoints: [
    'App servers handle both publish and subscribe requests',
    'Publishers and subscribers don\'t communicate directly',
    'The server manages topics, subscriptions, and message routing',
    'Decoupling is the key benefit of pub/sub',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│  Publisher  │ ──────▶ │   App Server    │
│  (Client)   │ ◀────── │  (Message Broker)│
└─────────────┘         └─────────────────┘
                               ▲
                               │
                               ▼
                        ┌─────────────┐
                        │ Subscriber  │
                        │  (Client)   │
                        └─────────────┘
`,
  keyConcepts: [
    {
      title: 'Pub/Sub Pattern',
      explanation: 'Publishers and subscribers are decoupled through topics',
      icon: '🔀',
    },
  ],
  quickCheck: {
    question: 'What is the main benefit of pub/sub over direct communication?',
    options: [
      'It\'s faster',
      'Publishers and subscribers are decoupled - they don\'t need to know about each other',
      'It uses less memory',
      'It\'s easier to code',
    ],
    correctIndex: 1,
    explanation: 'Pub/Sub decouples publishers from subscribers. Publishers don\'t need to know who will receive their messages, and subscribers don\'t need to know who sent them.',
  },
};

const step1: GuidedStep = {
  id: 'pubsub-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Publishers and subscribers can connect to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents publishers and subscribers', displayName: 'Client' },
      { type: 'app_server', reason: 'Message broker that handles pub/sub', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send publish/subscribe requests' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Topics and Publishing
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📢',
  scenario: "Your App Server is connected, but it's just an empty box right now.",
  hook: "It doesn't know HOW to create topics or publish messages. We need to teach it by writing actual Python code!",
  challenge: "Configure the App Server with APIs and implement the Python handlers for topic creation and message publishing.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your App Server can now handle topics and publishing!",
  achievement: "Publishers can create topics and send messages",
  metrics: [
    { label: 'APIs configured', after: '2 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But nobody's receiving these messages yet...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Topic Management',
  conceptExplanation: `Your App Server needs to handle topic and publishing operations. You'll implement these in Python!

**1. Create Topic (POST /api/v1/topics)** — You'll implement this in Python
- Receives: Topic name
- Returns: Topic ID
- Your code: Create topic, initialize subscriber list

**2. Publish Message (POST /api/v1/topics/:id/publish)** — You'll implement this in Python
- Receives: Topic ID, message payload
- Returns: Message ID, acknowledgment
- Your code: Store message, mark for delivery to all subscribers

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for both endpoints`,
  whyItMatters: 'Without the code, your server is just an empty shell. The Python handlers define what actually happens when publishers interact with your system.',
  keyPoints: [
    'Topics organize messages into streams (like channels)',
    'Publishing adds a message to a topic for fan-out',
    'Each topic maintains a list of subscribers',
    'Messages are stored temporarily until delivered',
    'Open the Python tab to see and edit your handler code',
  ],
  diagram: `
POST /api/v1/topics
┌─────────────────────────────────────────────────┐
│ Request:  { "name": "order-events" }            │
│ Response: { "topic_id": "t123" }                │
└─────────────────────────────────────────────────┘

POST /api/v1/topics/t123/publish
┌─────────────────────────────────────────────────┐
│ Request:  { "message": "Order #5 shipped" }     │
│ Response: { "message_id": "m456" }              │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Topic', explanation: 'Named channel for organizing messages', icon: '📢' },
    { title: 'Publish', explanation: 'Send a message to a topic for fan-out', icon: '📤' },
  ],
  quickCheck: {
    question: 'What is a topic in pub/sub?',
    options: [
      'A database table',
      'A named channel that organizes messages',
      'A type of message',
      'A subscriber',
    ],
    correctIndex: 1,
    explanation: 'A topic is a named channel (like "orders" or "notifications") that organizes messages. Publishers send to topics, subscribers receive from topics.',
  },
};

const step2: GuidedStep = {
  id: 'pubsub-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'System must support topic creation and message publishing',
    taskDescription: 'Re-use your Client → App Server from Step 1, then configure APIs and implement the Python handlers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/topics and POST /api/v1/topics/:id/publish APIs',
      'Open the Python tab and implement the handlers for both endpoints',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to the Python tab to write your handlers',
    level2: 'After assigning APIs in the inspector, switch to the Python editor tab and fill in the TODOs in the template. Implement create_topic() and publish_message().',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Implement Subscriptions and Fan-Out
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔔',
  scenario: "Publishers are sending messages to topics, but they're going into a black hole!",
  hook: "Nobody's subscribed yet. Messages are being published but not delivered. We need to implement subscriptions and fan-out!",
  challenge: "The core of pub/sub: when a message is published, deliver copies to ALL subscribers. This is fan-out!",
  illustration: 'fan-out',
};

const step3Celebration: CelebrationContent = {
  emoji: '📡',
  message: "Fan-out is working!",
  achievement: "One published message now reaches all subscribers",
  metrics: [
    { label: 'Subscriptions', after: 'Working' },
    { label: 'Fan-out ratio', after: '1 publish → N subscribers' },
  ],
  nextTeaser: "But what happens when the server crashes? All messages are lost!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Subscriptions and Fan-Out: The Heart of Pub/Sub',
  conceptExplanation: `Now comes the magic of pub/sub: **fan-out**.

When you publish one message to a topic with 10 subscribers, the system creates 10 deliveries - one for each subscriber.

**How it works:**
1. Subscriber calls POST /api/v1/topics/:id/subscribe
2. Server adds subscriber to topic's subscriber list
3. When a message is published:
   - Server finds all subscribers for that topic
   - Creates a delivery for each subscriber
   - Each subscriber can fetch their copy

**Key insight:** This is why pub/sub is different from queues. In a queue, one message goes to ONE consumer. In pub/sub, one message goes to ALL subscribers.`,
  whyItMatters: 'Fan-out is the defining characteristic of pub/sub. It enables event-driven architectures where multiple services react to the same event.',
  realWorldExample: {
    company: 'Google Pub/Sub',
    scenario: 'A single order event might need to notify inventory, shipping, analytics, and email services',
    howTheyDoIt: 'One publish to "orders" topic fans out to 4+ subscriptions, each with their own copy and tracking.',
  },
  keyPoints: [
    'Each topic maintains a list of subscribers',
    'Publishing triggers fan-out: create N deliveries for N subscribers',
    'Each subscription has independent tracking',
    'Subscribers can join/leave at any time',
  ],
  diagram: `
       Publisher publishes to "orders" topic
                    │
                    ▼
            ┌───────────────┐
            │     Topic     │
            │   "orders"    │
            └───────┬───────┘
                    │ Fan-out!
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │ Sub A  │ │ Sub B  │ │ Sub C  │
    │Inventory│ │Shipping│ │Analytics│
    └────────┘ └────────┘ └────────┘

    1 publish → 3 deliveries
`,
  keyConcepts: [
    { title: 'Subscribe', explanation: 'Join a topic to receive all future messages', icon: '🔔' },
    { title: 'Fan-Out', explanation: 'One message → N deliveries (one per subscriber)', icon: '📡' },
    { title: 'Independent Tracking', explanation: 'Each subscriber tracks their own progress', icon: '📍' },
  ],
  quickCheck: {
    question: 'If a topic has 50 subscribers and you publish 10 messages, how many total deliveries occur?',
    options: [
      '10 deliveries',
      '50 deliveries',
      '500 deliveries (10 messages × 50 subscribers)',
      '60 deliveries',
    ],
    correctIndex: 2,
    explanation: 'Fan-out multiplies: 10 messages × 50 subscribers = 500 deliveries. Each subscriber gets all 10 messages.',
  },
};

const step3: GuidedStep = {
  id: 'pubsub-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Subscribers can subscribe to topics and receive messages via fan-out',
    taskDescription: 'Add subscription and message delivery APIs with fan-out logic',
    componentsNeeded: [
      { type: 'client', reason: 'Publishers and subscribers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles pub/sub with fan-out', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients subscribe and pull messages' },
    ],
    successCriteria: [
      'Add POST /api/v1/topics/:id/subscribe API',
      'Add GET /api/v1/subscriptions/:id/messages API',
      'Implement fan-out: one publish creates N deliveries',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add subscribe and pull message APIs, then implement fan-out logic in Python',
    level2: 'When a message is published, loop through all subscribers and create a delivery for each',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 4: Add Message Queue for Reliable Delivery
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted.",
  hook: "When it came back online... ALL the messages were GONE! Publishers' messages vanished. Subscribers are furious!",
  challenge: "The problem: messages were stored in server memory. When the server restarted, everything vanished. We need a Message Queue for durability!",
  illustration: 'server-crash',
};

const step4Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your messages are now safe!",
  achievement: "Messages persist even if the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted' },
    { label: 'Storage', after: 'Message Queue' },
  ],
  nextTeaser: "Great! But we need to track subscription state too...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Durability for Pub/Sub',
  conceptExplanation: `Without persistent storage, your app server stores messages in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all messages are lost!

**Solution**: Use a **Message Queue** (like RabbitMQ, Kafka, or SQS). Message queues:
- Persist messages to disk
- Survive server crashes
- Ensure at-least-once delivery
- Handle fan-out efficiently

For pub/sub, the message queue stores:
- Published messages
- Deliveries per subscription
- Acknowledgment status`,
  whyItMatters: 'Without persistent storage, all your messages disappear when the server restarts! Message queues provide the durability guarantee.',
  realWorldExample: {
    company: 'Apache Kafka',
    scenario: 'Storing billions of messages with durability',
    howTheyDoIt: 'Kafka persists messages to disk and replicates them across brokers. Messages survive crashes and can be replayed.',
  },
  famousIncident: {
    title: 'AWS SQS Outage',
    company: 'Amazon Web Services',
    year: '2020',
    whatHappened: 'A bug caused SQS to lose messages during a brief outage. Companies relying on SQS for critical workflows experienced data loss.',
    lessonLearned: 'Always have message persistence with proper replication. Message queues are critical infrastructure that need high durability.',
    icon: '💀',
  },
  keyPoints: [
    'Message queues persist messages to disk',
    'They handle fan-out: one message → multiple deliveries',
    'Each subscription gets its own queue/partition',
    'Messages are retained until acknowledged by all subscribers',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│  Publisher  │ ────▶ │ App Server  │ ────▶ │ Message Queue  │
└─────────────┘       └─────────────┘       │                │
                                            │ Topic: orders  │
                                            │  - msg1 → [A,B]│
                                            │  - msg2 → [A,B]│
                                            └────────────────┘
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Messages survive restarts and crashes', icon: '💾' },
    { title: 'Durability', explanation: 'Write to disk before acknowledging publisher', icon: '🛡️' },
  ],
  quickCheck: {
    question: 'Why did we lose all messages when the server restarted?',
    options: [
      'The database was deleted',
      'Messages were only stored in RAM (memory), which is volatile',
      'The network connection failed',
      'Subscribers deleted them',
    ],
    correctIndex: 1,
    explanation: 'RAM is volatile - it loses all data when power is lost. Message queues persist data to disk for durability.',
  },
};

const step4: GuidedStep = {
  id: 'pubsub-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Messages must persist durably',
    taskDescription: 'Build Client → App Server → Message Queue',
    componentsNeeded: [
      { type: 'client', reason: 'Publishers and subscribers', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes pub/sub requests', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Stores messages durably', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send pub/sub requests' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server persists messages' },
    ],
    successCriteria: ['Add Client, App Server, Message Queue', 'Connect Client → App Server → Message Queue'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Message Queue',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 5: Add Database for Subscription Metadata
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📊',
  scenario: "Your messages are safe in the queue, but there's another problem!",
  hook: "When the server restarts, it forgets which topics exist, who's subscribed to what, and each subscription's read position. Subscribers lose track of their progress!",
  challenge: "We need a Database to store subscription metadata: topics, subscribers, and read positions.",
  illustration: 'database',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Subscription state is now persistent!",
  achievement: "Topics, subscriptions, and read positions survive restarts",
  metrics: [
    { label: 'Topics', before: '❌ Lost', after: '✓ Persisted' },
    { label: 'Subscriptions', before: '❌ Lost', after: '✓ Persisted' },
    { label: 'Read positions', before: '❌ Reset', after: '✓ Tracked' },
  ],
  nextTeaser: "Excellent! But we're still running on a single server...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Database for Metadata: Topics, Subscriptions, Offsets',
  conceptExplanation: `A pub/sub system has two types of data:

**1. Messages** (stored in Message Queue)
- The actual message payloads
- High volume, temporary (deleted after TTL)
- Written once, read by all subscribers

**2. Metadata** (stored in Database)
- Topics and their configuration
- Subscriptions (which subscriber → which topic)
- Read positions (offset/cursor per subscription)
- Low volume, permanent

**Why separate storage?**
- Message queues optimize for throughput and fan-out
- Databases optimize for queries and transactions
- Different access patterns need different storage`,
  whyItMatters: 'Without metadata persistence, subscribers lose their place and must re-read all messages after a restart!',
  keyPoints: [
    'Database stores topics, subscriptions, and offsets',
    'Each subscription tracks its read position (offset)',
    'Offset = last message ID successfully processed',
    'When subscriber reconnects, it resumes from its offset',
  ],
  diagram: `
┌─────────────────────────────────────────────────┐
│            DATABASE (Metadata)                  │
│                                                 │
│  Topics:                                        │
│    - orders (id: t1)                           │
│    - shipments (id: t2)                        │
│                                                 │
│  Subscriptions:                                │
│    - sub1 → topic: orders, offset: msg100      │
│    - sub2 → topic: orders, offset: msg98       │
│    - sub3 → topic: shipments, offset: msg50    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         MESSAGE QUEUE (Messages)                │
│                                                 │
│  orders: msg98, msg99, msg100, msg101, msg102  │
│  shipments: msg48, msg49, msg50, msg51         │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Offset', explanation: 'Position in message stream (like a bookmark)', icon: '📍' },
    { title: 'Metadata', explanation: 'Data about data (topics, subs, offsets)', icon: '📊' },
  ],
  quickCheck: {
    question: 'Why do we need both a Message Queue AND a Database?',
    options: [
      'We don\'t - one is enough',
      'Message Queue stores messages, Database stores metadata (topics, subscriptions, offsets)',
      'They\'re backups of each other',
      'Message Queue is faster',
    ],
    correctIndex: 1,
    explanation: 'They serve different purposes: Message Queue handles high-volume messages with fan-out, Database handles low-volume metadata with queryability.',
  },
};

const step5: GuidedStep = {
  id: 'pubsub-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Subscription metadata must persist',
    taskDescription: 'Build Client → App Server → Message Queue + Database',
    componentsNeeded: [
      { type: 'client', reason: 'Publishers and subscribers', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes pub/sub requests', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Stores messages', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores topics, subscriptions, offsets', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send requests' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server persists messages' },
      { from: 'App Server', to: 'Database', reason: 'Server stores metadata' },
    ],
    successCriteria: ['Build full architecture', 'Connect App Server to both Message Queue and Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Database and connect App Server to both Message Queue and Database',
    level2: 'App Server needs to talk to Message Queue (for messages) and Database (for metadata)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Scale with Load Balancer
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "Your pub/sub system is getting popular! Traffic is exploding.",
  hook: "You're getting 5,000 publishes/sec with 50 subscribers per topic. That's 250,000 deliveries/sec! Your single server is melting!",
  challenge: "One server can't handle this load. We need multiple app servers behind a Load Balancer!",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "You've built a scalable pub/sub system!",
  achievement: "Your system handles massive message throughput with high availability",
  metrics: [
    { label: 'Capacity', before: '1,000 msg/s', after: '250,000 deliveries/s' },
    { label: 'Servers', before: '1', after: 'Auto-scaling' },
  ],
  nextTeaser: "Almost there! Let's add cache for hot topic metadata...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Pub/Sub: Load Balancing',
  conceptExplanation: `One app server handles ~1,000-5,000 req/s. But with fan-out, load multiplies:

**The math:**
- 100 publishes/sec × 50 subscribers = 5,000 deliveries/sec
- Plus subscription management, ACKs, etc.
- Total load can easily hit 10,000+ operations/sec

**Solution**: Multiple app servers behind a **Load Balancer**

The load balancer:
1. Distributes publish requests across servers
2. Distributes subscribe/pull requests across servers
3. Each server connects to the shared Message Queue and Database
4. Servers are stateless - any server can handle any request`,
  whyItMatters: 'Load balancers provide scalability (handle more traffic) and availability (survive server failures).',
  realWorldExample: {
    company: 'Google Pub/Sub',
    scenario: 'Handling millions of messages per second globally',
    howTheyDoIt: 'Google runs thousands of pub/sub servers across regions, with load balancers distributing traffic. Auto-scaling adds servers during spikes.',
  },
  keyPoints: [
    'Fan-out multiplies load: plan for peak deliveries, not just publishes',
    'App servers are stateless - shared state lives in Queue + Database',
    'Load balancer enables horizontal scaling',
    'Multiple servers provide redundancy',
  ],
  diagram: `
                              ┌─────────────┐
                        ┌────▶│ App Server 1│──┐
                        │     └─────────────┘  │
┌────────┐   ┌─────────┐│     ┌─────────────┐  │
│ Client │──▶│   LB    │┼────▶│ App Server 2│──┤
└────────┘   └─────────┘│     └─────────────┘  │
                        │     ┌─────────────┐  │
                        └────▶│ App Server 3│──┘
                              └─────────────┘  │
                                    │          │
                          ┌─────────▼──────────▼─────┐
                          │   Message Queue + DB     │
                          └──────────────────────────┘
`,
  keyConcepts: [
    { title: 'Stateless Servers', explanation: 'Servers don\'t store state - use shared storage', icon: '🔄' },
    { title: 'Fan-out Load', explanation: 'Multiply publishes × subscribers for true load', icon: '📡' },
  ],
  quickCheck: {
    question: 'If you have 1,000 publishes/sec to a topic with 100 subscribers, what is the delivery load?',
    options: [
      '1,000 deliveries/sec',
      '1,100 deliveries/sec',
      '100,000 deliveries/sec (1,000 × 100)',
      '10,000 deliveries/sec',
    ],
    correctIndex: 2,
    explanation: 'Fan-out multiplies: 1,000 publishes × 100 subscribers = 100,000 deliveries per second!',
  },
};

const step6: GuidedStep = {
  id: 'pubsub-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must handle 250,000 deliveries/second',
    taskDescription: 'Build Client → Load Balancer → App Server → Message Queue + Database',
    componentsNeeded: [
      { type: 'client', reason: 'Publishers and subscribers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes pub/sub requests', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Stores messages', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores metadata', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server persists messages' },
      { from: 'App Server', to: 'Database', reason: 'Server stores metadata' },
    ],
    successCriteria: [
      'Build full architecture with Load Balancer',
      'Client → LB → App Server → Message Queue + Database',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full system with Load Balancer in front',
    level2: 'Client → Load Balancer → App Server, then App Server connects to Message Queue and Database',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Cache for Hot Topics
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your system is scaled, but there's a performance bottleneck!",
  hook: "Every subscribe request hits the database to fetch topic metadata. With thousands of subscribes/sec, the database is becoming a bottleneck. Hot topics are queried over and over!",
  challenge: "Cache hot topic metadata (topic configs, subscriber lists) to reduce database load and speed up subscribe operations.",
  illustration: 'slow-turtle',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Topic lookups are now lightning fast!",
  achievement: "Hot topic metadata served from cache in milliseconds",
  metrics: [
    { label: 'Topic lookup latency', before: '50ms', after: '2ms' },
    { label: 'Database load', before: '5,000 queries/sec', after: '500 queries/sec' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "Perfect! Now let's validate the complete system...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Topic Metadata',
  conceptExplanation: `**Key insight**: Topic metadata is read frequently but changes rarely.

**What to cache:**
- Topic configurations (name, retention, etc.)
- Subscriber lists per topic
- Topic existence checks

**Cache strategy (Cache-Aside):**
1. Subscribe request arrives
2. Check cache: Is topic metadata in Redis?
3. **Cache HIT**: Return immediately (2ms)
4. **Cache MISS**: Query database, store in cache, return (50ms)
5. Invalidate cache when topic/subscription changes

Hot topics (top 20%) stay in cache, reducing DB load by 80%+`,
  whyItMatters: 'Without caching, every subscribe and publish request hits the database for topic lookup. At scale, the database becomes the bottleneck.',
  keyPoints: [
    'Cache-aside pattern: Check cache first, then database',
    'Set TTL to prevent stale data (e.g., 5 minutes)',
    'Invalidate cache on topic/subscription changes',
    '90%+ cache hit ratio is achievable',
  ],
  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 2ms
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │───▶│App Server│      │ miss?
└────────┘    └────┬─────┘      ▼
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 50ms
                          └─────────────┘
`,
  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, DB on miss, update cache', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live: cached data expires automatically', icon: '⏰' },
    { title: 'Cache Invalidation', explanation: 'Remove stale data when source changes', icon: '🗑️' },
  ],
  quickCheck: {
    question: 'What happens on a cache MISS?',
    options: [
      'Return an error',
      'Query database, return result, update cache',
      'Wait for cache to be populated',
      'Redirect to a different server',
    ],
    correctIndex: 1,
    explanation: 'On a cache miss, we query the database, return the result to the user, and store it in cache for next time.',
  },
};

const step7: GuidedStep = {
  id: 'pubsub-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Topic metadata lookups must be fast (< 5ms p95)',
    taskDescription: 'Build Client → LB → App Server → Message Queue + Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Publishers and subscribers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes pub/sub requests', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Stores messages', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores metadata', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot topic metadata', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server persists messages' },
      { from: 'App Server', to: 'Database', reason: 'Server stores metadata' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches topic metadata' },
    ],
    successCriteria: ['Build full architecture with Cache', 'Connect App Server to Cache for topic lookups'],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'message_queue', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add Cache and connect it to App Server for fast topic lookups',
    level2: 'Add all components, configure everything, then connect App Server to Cache',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Final Validation - Production Ready
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💰',
  scenario: "Final Exam! It's time to prove your pub/sub system works in production.",
  hook: "Your architecture will be tested against real-world scenarios: topic creation, fan-out delivery, acknowledgments, and handling 5,000 messages/sec with 50x fan-out.",
  challenge: "Build a complete system that passes ALL test cases. This is exactly what you'd face in a real interview!",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Final Exam - All Test Cases Passed!",
  achievement: "Complete pub/sub system validated against production test cases",
  metrics: [
    { label: 'Test Cases Passed', after: 'All ✓' },
    { label: 'All Requirements', after: 'Met ✓' },
  ],
  nextTeaser: "Congratulations! You've mastered pub/sub system design. Try 'Solve on Your Own' mode or tackle a new challenge!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production-Ready Pub/Sub: The Complete Picture',
  conceptExplanation: `**You've built a complete pub/sub system with:**

**1. Topic Management**
- Create topics with configuration
- Manage topic lifecycle
- Cache topic metadata for speed

**2. Subscriptions**
- Subscribe to topics
- Track read position per subscription
- Independent subscription isolation

**3. Message Publishing**
- Publish messages to topics
- Persist to Message Queue
- Return acknowledgment to publisher

**4. Fan-Out Delivery**
- One message → N deliveries
- Parallel delivery to all subscribers
- Track delivery status per subscription

**5. Reliability**
- Message persistence in queue
- Metadata persistence in database
- At-least-once delivery with ACKs

**6. Scale**
- Load balancer for horizontal scaling
- Stateless app servers
- Cache for hot topic metadata`,
  whyItMatters: 'Pub/Sub is fundamental infrastructure for event-driven architectures. Companies use it for microservices communication, event streaming, and async processing.',
  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing payment events',
    howTheyDoIt: 'One payment publishes to "payment-completed" topic. Subscribers: invoice service, email service, analytics, fraud detection. All get the event independently.',
  },
  keyPoints: [
    'Pub/Sub decouples publishers from subscribers',
    'Fan-out enables one-to-many messaging',
    'Each subscription is independent with its own tracking',
    'Durability comes from message queue + database',
    'Scale comes from stateless servers + load balancer',
  ],
  diagram: `
┌──────────────────────────────────────────────────┐
│           COMPLETE PUB/SUB SYSTEM                │
├──────────────────────────────────────────────────┤
│                                                  │
│         Client (Publishers + Subscribers)        │
│                      │                           │
│                      ▼                           │
│              Load Balancer                       │
│                      │                           │
│         ┌────────────┴────────────┐              │
│         ▼                         ▼              │
│   App Server 1             App Server 2          │
│         │                         │              │
│    ┌────┴────┬────────┬──────────┴───┐          │
│    ▼         ▼        ▼              ▼          │
│  Cache   Database  Message Queue  (shared)      │
│  (Redis)  (MySQL)  (RabbitMQ)                   │
│                                                  │
│  Cache: Topic metadata (fast lookups)           │
│  Database: Topics, Subscriptions, Offsets       │
│  Queue: Messages with fan-out delivery          │
└──────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Event-Driven', explanation: 'Services react to events via pub/sub', icon: '⚡' },
    { title: 'Decoupling', explanation: 'Publishers and subscribers are independent', icon: '🔀' },
    { title: 'Fan-Out', explanation: 'One message reaches all subscribers', icon: '📡' },
    { title: 'At-Least-Once', explanation: 'Messages delivered reliably with ACKs', icon: '✅' },
  ],
  quickCheck: {
    question: 'What is the main benefit of pub/sub over direct API calls?',
    options: [
      'It\'s faster',
      'Decoupling - publishers don\'t need to know about subscribers',
      'It uses less memory',
      'It\'s cheaper',
    ],
    correctIndex: 1,
    explanation: 'Pub/Sub decouples services. Publishers emit events without knowing who will consume them. Subscribers can be added/removed without changing publishers.',
  },
};

const step8: GuidedStep = {
  id: 'pubsub-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Final Exam: Pass all production test cases',
    taskDescription: 'Build a complete system that passes all functional and non-functional requirements',
    componentsNeeded: [
      { type: 'client', reason: 'Publishers and subscribers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Right-sized instances', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Stores messages durably', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores metadata', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot topic metadata', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Message Queue', reason: 'Server persists messages' },
      { from: 'App Server', to: 'Database', reason: 'Server stores metadata' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches topic metadata' },
    ],
    successCriteria: [
      'Pass FR-1: Topic creation and management',
      'Pass FR-2: Message publishing',
      'Pass FR-3: Subscription creation',
      'Pass FR-4: Fan-out delivery (1 msg → N subscribers)',
      'Pass NFR-T1: Throughput (5,000 messages/sec)',
      'Pass NFR-L1: Latency (< 50ms p95 delivery)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'message_queue', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build complete system that passes all test cases',
    level2: 'You need all 6 components with proper connections for high throughput and reliability',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const simplePubsubGuidedTutorial: GuidedTutorial = {
  problemId: 'simple-pubsub-guided',
  problemTitle: 'Build Simple Pub/Sub - A System Design Journey',

  // Requirements gathering phase (Step 0)
  requirementsPhase: simplePubsubRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Topic Creation',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Publishers can create topics and configure them.',
      traffic: { type: 'mixed', rps: 10, readRps: 5, writeRps: 5 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Message Publishing',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Publishers can publish messages to topics.',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'Subscription Creation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Consumers can subscribe to topics.',
      traffic: { type: 'mixed', rps: 50, readRps: 25, writeRps: 25 },
      duration: 20,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fan-Out Delivery',
      type: 'functional',
      requirement: 'FR-4',
      description: 'One published message is delivered to all subscribers (fan-out).',
      traffic: { type: 'mixed', rps: 1000, readRps: 900, writeRps: 100 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-T1: High Throughput',
      type: 'performance',
      requirement: 'NFR-T1',
      description: 'Handle 5,000 messages/sec (publish + fan-out delivery).',
      traffic: { type: 'mixed', rps: 5000, readRps: 4500, writeRps: 500 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-L1: Low Latency',
      type: 'performance',
      requirement: 'NFR-L1',
      description: 'Keep p95 publish latency under 10ms and delivery latency under 50ms.',
      traffic: { type: 'mixed', rps: 1000, readRps: 900, writeRps: 100 },
      duration: 60,
      passCriteria: { maxP95Latency: 50, maxErrorRate: 0.01 },
    },
  ] as TestCase[],
};

export function getSimplePubsubGuidedTutorial(): GuidedTutorial {
  return simplePubsubGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = simplePubsubRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= simplePubsubRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
