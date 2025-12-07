import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Notification Fanout Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching notification system design concepts
 * through building a scalable notification delivery platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (fan-out strategies, push vs pull, queues)
 *
 * Key Concepts:
 * - Fan-out on write vs fan-out on read
 * - Push vs pull notification delivery
 * - Message queues for async processing
 * - WebSockets for real-time push
 * - Notification preferences and filtering
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const notificationFanoutRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a notification system like Facebook or LinkedIn notifications",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Staff Engineer at Social Connect',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-notification',
      category: 'functional',
      question: "What types of notifications do users need to receive?",
      answer: "Users should receive notifications for:\n\n1. **Social interactions** - likes, comments, follows, mentions\n2. **System updates** - friend requests, group invites\n3. **Content updates** - new posts from followed users\n\nEach notification has: sender, recipient, type, content, timestamp, and read/unread status.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Notifications are event-driven - triggered by user actions throughout the system",
    },
    {
      id: 'notification-delivery',
      category: 'functional',
      question: "How should users receive notifications?",
      answer: "Multiple delivery channels:\n1. **In-app notifications** - Bell icon with unread count\n2. **Push notifications** - Mobile push and browser notifications\n3. **Email** - For important updates (optional)\n\nFor the MVP, focus on in-app notifications. Push and email are v2 features.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Multi-channel delivery requires different infrastructure for each channel",
    },
    {
      id: 'notification-list',
      category: 'functional',
      question: "What happens when users click the notification bell?",
      answer: "They see a dropdown with their recent notifications, newest first. Each notification shows:\n- Who triggered it (avatar, name)\n- What happened (liked your post, commented, etc.)\n- When it happened (2m ago, 1h ago)\n- Read/unread indicator\n\nUsers can mark as read or clear all.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Notification list is a read-heavy operation - caching is critical",
    },
    {
      id: 'notification-settings',
      category: 'functional',
      question: "Can users control what notifications they receive?",
      answer: "Yes, users should be able to:\n1. **Mute** certain notification types (e.g., no like notifications)\n2. **Mute** specific users\n3. **Set quiet hours** (no notifications 10pm-8am)\n\nFor MVP, let's defer this to v2 and send all notifications.",
      importance: 'important',
      insight: "Notification preferences add complexity - good to defer initially",
    },
    {
      id: 'notification-aggregation',
      category: 'clarification',
      question: "If 100 people like my post, do I get 100 notifications?",
      answer: "No! We should **aggregate** similar notifications:\n'John and 99 others liked your post'\n\nFor MVP, let's send individual notifications but design for aggregation in v2.",
      importance: 'nice-to-have',
      insight: "Aggregation reduces notification fatigue and storage",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "100 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Massive scale - notification systems are one of the highest-traffic subsystems",
    },
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many notification-triggering events happen per day?",
      answer: "About 1 billion events per day (likes, comments, follows, etc.)",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 events/sec",
        result: "~12K events/sec (36K at peak)",
      },
      learningPoint: "Each event might trigger notifications to multiple users - fan-out!",
    },
    {
      id: 'fanout-problem',
      category: 'burst',
      question: "What if a celebrity with 10 million followers posts something?",
      answer: "That single post could trigger 10 million 'new post' notifications! This is the classic fan-out problem.\n\nFor popular users, we'll need smart strategies:\n- Fan-out on read (pull model) instead of write\n- Rate limiting\n- Skip notifications for inactive users",
      importance: 'critical',
      insight: "Fan-out on write vs read is THE key design decision for notification systems",
    },
    {
      id: 'latency-realtime',
      category: 'latency',
      question: "How quickly should notifications appear?",
      answer: "For in-app notifications:\n- **Real-time** for users actively online (< 1 second)\n- **Best effort** for offline users (fetch on next app open)\n\nFor a like notification, users expect to see it almost instantly.",
      importance: 'critical',
      learningPoint: "Real-time delivery requires push mechanisms (WebSockets, long polling)",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How often do users check their notifications?",
      answer: "Average user checks 20 times per day. That's 2 billion notification list reads per day.",
      importance: 'important',
      calculation: {
        formula: "2B ÷ 86,400 sec = 23,148 reads/sec",
        result: "~23K reads/sec (70K at peak)",
      },
      learningPoint: "High read volume - caching recent notifications is essential",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-notification', 'notification-delivery', 'fanout-problem'],
  criticalFRQuestionIds: ['core-notification', 'notification-delivery'],
  criticalScaleQuestionIds: ['throughput-events', 'fanout-problem', 'latency-realtime'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Generate notifications from events',
      description: 'When users like, comment, or follow - create notifications',
      emoji: '🔔',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Deliver notifications to users',
      description: 'Get notifications to recipients in real-time',
      emoji: '📲',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can view notification list',
      description: 'See recent notifications with read/unread status',
      emoji: '📋',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Mark notifications as read',
      description: 'Track which notifications users have seen',
      emoji: '✅',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '1 billion events',
    readsPerDay: '2 billion notification checks',
    peakMultiplier: 3,
    readWriteRatio: '2:1',
    calculatedWriteRPS: { average: 11574, peak: 34722 },
    calculatedReadRPS: { average: 23148, peak: 69444 },
    maxPayloadSize: '~500 bytes (notification)',
    storagePerRecord: '~200 bytes',
    storageGrowthPerYear: '~73TB',
    redirectLatencySLA: 'p99 < 1s (real-time delivery)',
    createLatencySLA: 'p99 < 500ms (event processing)',
  },

  architecturalImplications: [
    '✅ High write volume (35K events/sec peak) → Async processing required',
    '✅ Fan-out problem → Need write vs read strategy per use case',
    '✅ Real-time delivery → WebSockets or long polling',
    '✅ 70K reads/sec peak → Caching recent notifications',
    '✅ Billions of notifications → Database partitioning by user_id',
  ],

  outOfScope: [
    'Email notifications',
    'Push notifications (mobile/browser)',
    'Notification aggregation',
    'User preferences/muting',
    'Notification analytics',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where events create notifications and users can view them. The fan-out optimization, real-time push, and delivery strategies come in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔔',
  scenario: "Welcome to Social Connect! You're building the notification system.",
  hook: "Your first user just got their first like. They need to know about it!",
  challenge: "Set up the basic request flow so users can reach your notification server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your notification system is online!',
  achievement: 'Users can now communicate with your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to create notifications yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Server Foundation for Notifications',
  conceptExplanation: `Every notification system starts with clients connecting to servers.

When a notification is triggered:
1. The **Client** (mobile app, web browser) connects to your **App Server**
2. The server processes the event (like, comment, etc.)
3. The server creates and delivers notifications

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, events happen in a vacuum - users never know about them.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Billions of notifications daily',
    howTheyDoIt: 'Started with simple request-response, now uses WebSockets for real-time push',
  },

  keyPoints: [
    'Client = user\'s app that displays notifications',
    'App Server = backend that creates and sends notifications',
    'HTTP/WebSocket = protocols for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device requesting notifications', icon: '📱' },
    { title: 'App Server', explanation: 'Backend handling notification logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'notification-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all notification FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users receiving notifications', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles notification creation and delivery', displayName: 'App Server' },
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
// STEP 2: Implement Notification Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "A user just liked a post, but nothing happened!",
  hook: "The server received the event, but doesn't know how to create notifications.",
  challenge: "Write the Python code to generate and retrieve notifications.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Notifications are being created!',
  achievement: 'Core notification logic implemented',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create notifications', after: '✓' },
    { label: 'Can fetch notifications', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all notifications are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Notification Generation and Retrieval',
  conceptExplanation: `Notification systems have two main operations:

**1. Generate Notification** (triggered by events):
- \`create_notification(user_id, type, content)\`
- Store: recipient, sender, type, content, timestamp, read=false

**2. Fetch Notifications** (user requests):
- \`get_notifications(user_id, limit=20)\`
- Return recent notifications, newest first

For now, we'll store in memory. Database comes next!`,

  whyItMatters: 'These handlers are the core of any notification system - create and retrieve.',

  famousIncident: {
    title: 'LinkedIn Notification Storm',
    company: 'LinkedIn',
    year: '2016',
    whatHappened: 'A bug caused some users to receive thousands of duplicate notifications. The generation logic had a retry loop that wasn\'t idempotent.',
    lessonLearned: 'Notification generation must be idempotent - same event should not create duplicate notifications.',
    icon: '🌪️',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Processing billions of notification events',
    howTheyDoIt: 'Uses event streaming (similar to Kafka) to process events and generate notifications asynchronously',
  },

  keyPoints: [
    'create_notification() stores notification metadata',
    'get_notifications() fetches recent notifications for a user',
    'In-memory storage for now - database in Step 3',
    'Each notification: recipient, sender, type, content, timestamp',
  ],

  quickCheck: {
    question: 'Why do we store notifications per user instead of just events?',
    options: [
      'It uses less storage',
      'Each user needs personalized notification state (read/unread)',
      'It\'s faster to query',
      'Events are too complex',
    ],
    correctIndex: 1,
    explanation: 'Notifications are user-specific: User A marks as read, User B doesn\'t. We need per-user state.',
  },

  keyConcepts: [
    { title: 'Event', explanation: 'Action that triggers notification (like, comment)', icon: '⚡' },
    { title: 'Notification', explanation: 'User-specific message about an event', icon: '🔔' },
    { title: 'Handler', explanation: 'Function that processes events/requests', icon: '⚙️' },
  ],
};

const step2: GuidedStep = {
  id: 'notification-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Generate notifications, FR-3: View notification list',
    taskDescription: 'Configure APIs and implement Python handlers for notifications',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign notification APIs (POST /notifications, GET /notifications)',
      'Open Python tab',
      'Implement create_notification() and get_notifications() functions',
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
    level1: 'Click App Server → APIs tab → Assign POST /api/v1/notifications and GET /api/v1/notifications',
    level2: 'Switch to Python tab and implement the TODO sections for create and fetch',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/notifications', 'GET /api/v1/notifications'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The server crashed at 3 AM.",
  hook: "When it restarted, all notifications were gone. Users lost important updates!",
  challenge: "Add a database so notifications survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Notifications are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But fetching notifications is getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistent Notification Storage',
  conceptExplanation: `In-memory storage is volatile. A **database** provides durability.

For notifications, we need a table:
- \`notifications\` table with columns:
  - id (primary key)
  - user_id (recipient - indexed!)
  - sender_id
  - type (like, comment, follow)
  - content (text)
  - timestamp
  - read (boolean)

Key insight: We'll query by user_id most often, so index it!`,

  whyItMatters: 'Users rely on notifications for important updates. Losing them breaks trust.',

  famousIncident: {
    title: 'Twitter Notification Delays',
    company: 'Twitter',
    year: '2018',
    whatHappened: 'Database overload caused notification delays of 30+ minutes. Users thought they were being ignored.',
    lessonLearned: 'Notification databases must be optimized for high write and read throughput.',
    icon: '🐌',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Storing billions of notifications',
    howTheyDoIt: 'Uses partitioned databases (sharded by user_id) to handle massive scale',
  },

  keyPoints: [
    'Database provides durability - survives crashes',
    'Notifications table indexed by user_id for fast queries',
    'Store read/unread state per notification',
    'PostgreSQL works well for structured notification data',
  ],

  quickCheck: {
    question: 'Why do we index the notifications table by user_id?',
    options: [
      'It makes writes faster',
      'We always query "get notifications for user X"',
      'It reduces storage space',
      'It\'s required by SQL',
    ],
    correctIndex: 1,
    explanation: 'Every notification fetch is "WHERE user_id = ?". Indexing makes this query fast.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'Index', explanation: 'Speeds up queries on specific columns', icon: '🔍' },
    { title: 'Partitioning', explanation: 'Split data across servers by user_id', icon: '🗂️' },
  ],
};

const step3: GuidedStep = {
  id: 'notification-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store notifications permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Reads
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You have 10 million users now. Notification fetches are taking 2 seconds!",
  hook: "Every fetch hits the database. Users refresh frequently - database is melting.",
  challenge: "Add a cache to make notification reads instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Notifications load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Fetch latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '85%' },
  ],
  nextTeaser: "But we need to handle massive event volume...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Recent Notifications',
  conceptExplanation: `Users check notifications frequently. **Caching** is essential!

**Cache Strategy**:
- Cache each user's recent 50 notifications
- Key: \`notifications:{user_id}\`
- Value: List of notification objects
- TTL: 5 minutes (notifications don't change often)

**Cache-Aside Pattern**:
1. Check cache for user's notifications
2. Cache hit → Return instantly
3. Cache miss → Fetch from DB, populate cache`,

  whyItMatters: 'At 70K reads/sec peak, every cache hit saves an expensive database query.',

  famousIncident: {
    title: 'Facebook New Year\'s Eve Cache Failure',
    company: 'Facebook',
    year: '2014',
    whatHappened: 'On New Year\'s Eve, notification checks spiked 10x. Cache servers couldn\'t keep up, and the database got hammered. Notifications delayed by minutes.',
    lessonLearned: 'Cache warming and over-provisioning for peaks is essential for notification systems.',
    icon: '🎆',
  },

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Handling notification reads',
    howTheyDoIt: 'Uses Redis to cache recent notifications per user with 80%+ hit rate',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                                   └───────┘
                                       │
                               85% cache hit!
`,

  keyPoints: [
    'Cache recent notifications per user (last 50)',
    'Cache-aside pattern: check cache → miss → fetch DB → populate',
    'TTL of 5 minutes balances freshness vs hit rate',
    'Cache key: notifications:{user_id}',
  ],

  quickCheck: {
    question: 'Why do we only cache recent notifications, not all of them?',
    options: [
      'To save memory - users rarely check old notifications',
      'Old notifications are in a different database',
      'Cache can\'t store that much data',
      'It\'s a Redis limitation',
    ],
    correctIndex: 0,
    explanation: '99% of notification checks are for recent ones. Caching old notifications wastes memory.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'notification-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: View notification list (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache recent notifications for fast reads', displayName: 'Redis Cache' },
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
    level2: 'Connect App Server to Cache. Set TTL to 300 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Async Event Processing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌊',
  scenario: "A viral post just got 100,000 likes in 1 minute!",
  hook: "Your server is trying to create 100K notifications synchronously. Everything is timing out!",
  challenge: "Add a message queue to process notification events asynchronously.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Events are processed asynchronously!',
  achievement: 'Message queue handles notification generation at scale',
  metrics: [
    { label: 'Event processing', before: 'Synchronous', after: 'Async' },
    { label: 'Can handle bursts', after: '✓' },
    { label: 'Response time', before: '5000ms', after: '<100ms' },
  ],
  nextTeaser: "But how do we handle the fan-out problem for popular users?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Async Processing with Message Queues',
  conceptExplanation: `**Problem**: Creating notifications synchronously blocks the request.

**Solution**: Use a **Message Queue** for async processing!

**Flow**:
1. Event happens (user likes a post) → Publish to queue → Return instantly
2. **Worker** processes queue → Creates notifications in background

Benefits:
- User doesn't wait for notification creation
- Handles traffic spikes (queue buffers events)
- Can scale workers independently`,

  whyItMatters: 'At 35K events/sec peak, synchronous processing would destroy your servers.',

  famousIncident: {
    title: 'Twitter Fail Whale',
    company: 'Twitter',
    year: '2008-2010',
    whatHappened: 'Twitter processed everything synchronously. During traffic spikes, servers couldn\'t keep up. The "Fail Whale" error page became infamous.',
    lessonLearned: 'Decouple event generation from processing using message queues.',
    icon: '🐋',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Processing notification events',
    howTheyDoIt: 'Uses Kafka to buffer billions of events. Workers process in parallel, creating notifications asynchronously.',
  },

  diagram: `
Event (Like, Comment)
      │
      ▼
┌─────────────┐     ┌──────────────────┐
│ App Server  │────▶│  Message Queue   │
│ (instant    │     │  (Kafka/RabbitMQ)│
│  response)  │     └────────┬─────────┘
└─────────────┘              │
                             │ Workers consume
                             ▼
                    ┌─────────────────┐
                    │ Notification    │
                    │ Worker          │
                    │ (background)    │
                    └────────┬────────┘
                             │
                             ▼
                  Create notifications in DB
`,

  keyPoints: [
    'Queue decouples event receipt from notification creation',
    'Workers process queue in background',
    'User gets instant response - processing happens async',
    'Queue buffers spikes - workers catch up gradually',
  ],

  quickCheck: {
    question: 'Why use a message queue instead of processing events synchronously?',
    options: [
      'It\'s cheaper',
      'Users get instant response while processing happens in background',
      'It\'s easier to implement',
      'Queues store more data',
    ],
    correctIndex: 1,
    explanation: 'Async processing means users don\'t wait. Event is queued instantly, workers process later.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async event processing', icon: '📬' },
    { title: 'Producer', explanation: 'App server that publishes events', icon: '📤' },
    { title: 'Consumer/Worker', explanation: 'Background process that handles events', icon: '⚙️' },
  ],
};

const step5: GuidedStep = {
  id: 'notification-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Generate notifications (now async!)',
    taskDescription: 'Add a Message Queue for async event processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer events for async processing', displayName: 'Kafka' },
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
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue for async event processing',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Fan-out Strategy - Write vs Read
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌟',
  scenario: "A celebrity with 50 million followers just posted!",
  hook: "Should we create 50 million notifications immediately? That would take hours!",
  challenge: "Implement smart fan-out: write for normal users, read for celebrities.",
  illustration: 'celebrity-post',
};

const step6Celebration: CelebrationContent = {
  emoji: '🧠',
  message: 'Smart fan-out strategy implemented!',
  achievement: 'Hybrid approach handles both regular and celebrity users',
  metrics: [
    { label: 'Normal users', after: 'Fan-out on write' },
    { label: 'Celebrities', after: 'Fan-out on read' },
    { label: 'Can scale to millions', after: '✓' },
  ],
  nextTeaser: "But how do we deliver notifications in real-time?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Fan-out on Write vs Fan-out on Read',
  conceptExplanation: `The **fan-out problem**: One event → many notifications.

**Fan-out on Write** (Push):
- When event happens → Create notifications for ALL followers
- Pro: Fast reads (notifications pre-computed)
- Con: Slow writes for popular users (create millions of rows)

**Fan-out on Read** (Pull):
- When user opens app → Fetch recent posts from followed users
- Pro: Fast writes (no fan-out needed)
- Con: Slow reads (compute on demand)

**Hybrid Solution** (Best!):
- Regular users (< 10K followers): Fan-out on write
- Celebrities (> 10K followers): Fan-out on read`,

  whyItMatters: 'The wrong fan-out strategy makes your system unusable. This is THE key decision.',

  famousIncident: {
    title: 'Twitter\'s Celebrity Fan-out Problem',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'When Justin Bieber (50M followers) tweeted, Twitter\'s fan-out on write approach tried to update 50M timelines. It caused cascading failures.',
    lessonLearned: 'Twitter switched to a hybrid model: fan-out on write for most, fan-out on read for celebrities.',
    icon: '🎤',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling celebrity tweets',
    howTheyDoIt: 'Hybrid: Fan-out on write for users with < 10K followers, fan-out on read for celebrities',
  },

  diagram: `
┌─────────────────────────────────────────────────────────┐
│              EVENT: User A posts something              │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │ Does User A have > 10K        │
         │ followers?                    │
         └───────────────┬───────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
        NO  │                         │  YES
            ▼                         ▼
    ┌───────────────┐         ┌──────────────┐
    │ Fan-out on    │         │ Fan-out on   │
    │ WRITE         │         │ READ         │
    │               │         │              │
    │ Create N      │         │ Store post   │
    │ notifications │         │ Users fetch  │
    │ immediately   │         │ on demand    │
    └───────────────┘         └──────────────┘
`,

  keyPoints: [
    'Fan-out on write: Create notifications immediately (good for few followers)',
    'Fan-out on read: Compute notifications on demand (good for many followers)',
    'Hybrid: Use write for < 10K followers, read for > 10K',
    'This is a classic trade-off: write performance vs read performance',
  ],

  quickCheck: {
    question: 'Why use fan-out on read for celebrities instead of fan-out on write?',
    options: [
      'It\'s faster',
      'Creating 50M notification rows is too slow',
      'It uses less memory',
      'Celebrities don\'t need notifications',
    ],
    correctIndex: 1,
    explanation: 'Writing 50M rows takes too long. Better to compute on-demand when users check notifications.',
  },

  keyConcepts: [
    { title: 'Fan-out on Write', explanation: 'Create all notifications immediately', icon: '✍️' },
    { title: 'Fan-out on Read', explanation: 'Compute notifications on demand', icon: '📖' },
    { title: 'Hybrid', explanation: 'Use write for some, read for others', icon: '🔀' },
  ],
};

const step6: GuidedStep = {
  id: 'notification-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from smart fan-out',
    taskDescription: 'Document your fan-out strategy in the system notes',
    successCriteria: [
      'Understand fan-out on write vs read trade-offs',
      'Hybrid approach: write for < 10K followers, read for celebrities',
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
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'This step is conceptual - no components to add',
    level2: 'Remember: Fan-out on write for regular users, fan-out on read for celebrities',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Real-time Push with WebSockets
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📡',
  scenario: "Users are manually refreshing to check for new notifications!",
  hook: "They expect real-time updates - notifications appearing instantly, no refresh needed.",
  challenge: "Add WebSocket support for real-time notification push.",
  illustration: 'real-time',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Real-time notifications working!',
  achievement: 'Users receive notifications instantly via WebSocket push',
  metrics: [
    { label: 'Delivery latency', before: '30s (polling)', after: '<1s (push)' },
    { label: 'Real-time connections', after: '✓' },
  ],
  nextTeaser: "But we need to scale this to millions of connections...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Push vs Pull: Real-time Notification Delivery',
  conceptExplanation: `**Pull (Polling)**: Client checks for new notifications every 30 seconds
- Simple to implement
- Wasteful: 95% of requests return "no new notifications"
- Delayed: Up to 30s before user sees notification

**Push (WebSocket)**: Server pushes notifications to client in real-time
- Persistent connection between client and server
- Server pushes notifications as they're created
- Instant delivery (< 1s)

**How it works**:
1. Client opens WebSocket connection on app launch
2. Server keeps connection alive
3. When notification created → Server pushes to client instantly`,

  whyItMatters: 'Users expect instant notifications. Polling is too slow and wasteful at scale.',

  famousIncident: {
    title: 'Facebook Chat Launch',
    company: 'Facebook',
    year: '2008',
    whatHappened: 'Facebook Chat launched with HTTP long-polling (predecessor to WebSockets). Millions of persistent connections brought down servers initially.',
    lessonLearned: 'Real-time push requires specialized infrastructure. WebSockets are more efficient than long-polling.',
    icon: '💬',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Real-time messaging and notifications',
    howTheyDoIt: 'Uses WebSockets to maintain persistent connections with millions of users for instant delivery',
  },

  diagram: `
PULL (Polling):
┌────────┐    "Any new notifications?"    ┌─────────┐
│ Client │ ──────────────────────────────▶│ Server  │
└────────┘                                 └─────────┘
    │           "Nope" (95% of time)          │
    │◀────────────────────────────────────────┘
    │
    │ Wait 30 seconds...
    │ Check again
    │

PUSH (WebSocket):
┌────────┐    WebSocket connection     ┌─────────┐
│ Client │◀═══════════════════════════▶│ Server  │
└────────┘       (persistent)          └─────────┘
    │                                       │
    │         New notification!             │
    │◀──────────────────────────────────────┘
    │            (instant!)
`,

  keyPoints: [
    'Polling: Client checks periodically (wasteful, delayed)',
    'Push: Server sends when available (efficient, instant)',
    'WebSocket: Persistent bidirectional connection',
    'For online users: Push. For offline: Store, deliver on reconnect',
  ],

  quickCheck: {
    question: 'What\'s the main advantage of WebSocket push over polling?',
    options: [
      'It\'s easier to implement',
      'Instant delivery without wasteful repeated requests',
      'It uses less code',
      'It works on more devices',
    ],
    correctIndex: 1,
    explanation: 'Push sends only when needed. Polling wastes 95% of requests checking for nothing.',
  },

  keyConcepts: [
    { title: 'Polling', explanation: 'Client repeatedly asks for updates', icon: '🔄' },
    { title: 'WebSocket', explanation: 'Persistent bidirectional connection', icon: '🔌' },
    { title: 'Push', explanation: 'Server sends data to client proactively', icon: '📤' },
  ],
};

const step7: GuidedStep = {
  id: 'notification-step-7',
  stepNumber: 7,
  frIndex: 1,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Deliver notifications in real-time',
    taskDescription: 'Add WebSocket support to App Server for real-time push',
    successCriteria: [
      'App Server configured for WebSocket connections',
      'Real-time push enabled for online users',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click App Server and enable WebSocket support in configuration',
    level2: 'WebSockets allow the server to push notifications to clients in real-time',
    solutionComponents: [{ type: 'app_server', config: { websocket: true } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Horizontal Scaling and Load Balancing
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📈',
  scenario: "You've grown to 100 million users! One server can't maintain all the WebSocket connections.",
  hook: "You need thousands of servers to handle millions of concurrent WebSocket connections.",
  challenge: "Add a load balancer and scale horizontally.",
  illustration: 'traffic-spike',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a scalable notification system!',
  achievement: 'System can handle millions of users with real-time notifications',
  metrics: [
    { label: 'App Server instances', before: '1', after: '10+' },
    { label: 'Can handle', after: '100M users' },
    { label: 'Real-time delivery', after: '< 1s' },
    { label: 'Fan-out strategy', after: 'Hybrid' },
  ],
  nextTeaser: "You've mastered notification system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling WebSocket Connections',
  conceptExplanation: `**Challenge**: One server can handle ~50K concurrent WebSocket connections.
For 100M users, you need ~2,000 servers!

**Solution**: Horizontal scaling + Load balancing

**Architecture**:
1. **Load Balancer** distributes new WebSocket connections across servers
2. **Multiple App Server instances** each handle a subset of connections
3. **Sticky sessions**: Once connected, client stays on same server

**Notification delivery across servers**:
- User A on Server 1, User B on Server 2
- When A's notification created → How to push to B?
- Solution: Pub/Sub (Redis) - workers publish, all servers subscribe`,

  whyItMatters: 'You can\'t serve millions of users with one server. Horizontal scaling is essential.',

  famousIncident: {
    title: 'WhatsApp Scales to 900M Users',
    company: 'WhatsApp',
    year: '2016',
    whatHappened: 'WhatsApp handled 900M concurrent connections with just 50 engineers and hundreds of servers, using Erlang\'s lightweight process model.',
    lessonLearned: 'Proper architecture allows massive scale with small teams.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Maintaining millions of WebSocket connections',
    howTheyDoIt: 'Uses hundreds of servers with load balancing. Pub/Sub for cross-server messaging.',
  },

  diagram: `
                    ┌─────────────────────────┐
                    │     Load Balancer       │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  ┌───────────┐           ┌───────────┐           ┌───────────┐
  │App Server │           │App Server │           │App Server │
  │Instance 1 │           │Instance 2 │           │Instance 3 │
  │           │           │           │           │           │
  │WS: 50K    │           │WS: 50K    │           │WS: 50K    │
  │clients    │           │clients    │           │clients    │
  └─────┬─────┘           └─────┬─────┘           └─────┬─────┘
        └───────────────────────┴───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │  Shared Cache & DB    │
                    │  + Pub/Sub (Redis)    │
                    └───────────────────────┘
`,

  keyPoints: [
    'Load balancer distributes WebSocket connections across servers',
    'Each server maintains a subset of connections',
    'Pub/Sub (Redis) enables cross-server notification delivery',
    'Horizontal scaling allows unlimited growth',
  ],

  quickCheck: {
    question: 'How do you deliver a notification when the user is connected to a different server?',
    options: [
      'Transfer the connection to the right server',
      'Use Pub/Sub - all servers subscribe, deliver to connected clients',
      'Store and wait for user to reconnect',
      'Send via the database',
    ],
    correctIndex: 1,
    explanation: 'Pub/Sub broadcasts to all servers. The server with that user\'s WebSocket connection delivers it.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Pub/Sub', explanation: 'Broadcast messages to all servers', icon: '📡' },
  ],
};

const step8: GuidedStep = {
  id: 'notification-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from horizontal scaling',
    taskDescription: 'Add Load Balancer and scale App Server to multiple instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute WebSocket connections', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added between Client and App Server',
      'App Server scaled to 3+ instances',
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
    requireCacheStrategy: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server',
    level2: 'Click App Server and set instances to 3 or more',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server', config: { instances: 3 } },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const notificationFanoutGuidedTutorial: GuidedTutorial = {
  problemId: 'notification-fanout',
  title: 'Design Notification System',
  description: 'Build a scalable notification system with fan-out strategies and real-time delivery',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🔔',
    hook: "You've been hired as Lead Engineer at Social Connect!",
    scenario: "Your mission: Build a notification system that delivers updates to millions of users in real-time.",
    challenge: "Can you handle the fan-out problem and choose the right delivery strategy?",
  },

  requirementsPhase: notificationFanoutRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Event-Driven Architecture',
    'Fan-out on Write vs Read',
    'Push vs Pull Delivery',
    'Message Queues',
    'WebSockets',
    'Caching Strategies',
    'Horizontal Scaling',
    'Pub/Sub Pattern',
  ],

  ddiaReferences: [
    'Chapter 1: Fan-out problem',
    'Chapter 11: Stream Processing',
    'Chapter 5: Replication',
  ],
};

export default notificationFanoutGuidedTutorial;
