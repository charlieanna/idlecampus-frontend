import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Realtime Notifications Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a realtime notification system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (WebSocket, SSE, fanout, queues, cost)
 *
 * Key Concepts:
 * - Push notifications vs pull
 * - WebSocket for bidirectional real-time communication
 * - Server-Sent Events (SSE) for unidirectional updates
 * - Notification fanout patterns
 * - Message queues for reliable delivery
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const realtimeNotificationsRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a realtime notification system",

  interviewer: {
    name: 'Maya Patel',
    role: 'Principal Engineer at Notification Systems Inc.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-notifications',
      category: 'functional',
      question: "What types of notifications should the system support?",
      answer: "The system needs to handle:\n\n1. **User activity notifications** - Likes, comments, mentions, follows\n2. **System notifications** - Updates, alerts, announcements\n3. **Real-time updates** - New messages, live events\n\nNotifications should be delivered instantly when users are online.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Notifications come from different sources but need a unified delivery system",
    },
    {
      id: 'delivery-mechanism',
      category: 'functional',
      question: "How should notifications be delivered to users?",
      answer: "We need **push notifications** - the server pushes updates to clients without them asking. This is different from polling where clients repeatedly ask 'any updates?'\n\nPush is instant and efficient. Polling wastes bandwidth and has latency.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Push (WebSocket/SSE) beats pull (polling) for real-time updates",
    },
    {
      id: 'notification-persistence',
      category: 'functional',
      question: "Should notifications be stored? Can users see old notifications?",
      answer: "Yes! Users should be able to:\n- See a notification history\n- Mark notifications as read/unread\n- Get notifications they missed while offline\n\nNotifications aren't ephemeral - they're stored in a database.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Notifications need both real-time delivery AND persistent storage",
    },
    {
      id: 'notification-preferences',
      category: 'functional',
      question: "Can users control what notifications they receive?",
      answer: "Absolutely! Users should be able to:\n- Enable/disable specific notification types\n- Set quiet hours\n- Choose notification channels (in-app, email, mobile push)\n\nFor MVP, let's focus on in-app real-time notifications. Email/mobile can come later.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      insight: "User preferences add complexity - good to start simple with all notifications enabled",
    },
    {
      id: 'delivery-guarantees',
      category: 'functional',
      question: "What if a user is offline when a notification is generated?",
      answer: "Notifications must be **guaranteed delivery**. If a user is offline:\n1. Store the notification\n2. When they come back online, deliver all missed notifications\n3. Order matters - show them in chronological order",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Queuing is essential for offline users - can't lose notifications",
    },
    {
      id: 'notification-fanout',
      category: 'clarification',
      question: "What happens when a notification needs to go to many users?",
      answer: "Good question! Some notifications are:\n- **1-to-1**: A direct message notification to one user\n- **1-to-many**: A celebrity tweets, notify 1M followers\n\nThe 1-to-many case is called **fanout** - one event creates millions of notifications.",
      importance: 'critical',
      insight: "Fanout is the hardest problem in notifications - can't do it synchronously",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "100 million daily active users who might receive notifications",
      importance: 'critical',
      learningPoint: "Large scale requires careful design of fanout and delivery mechanisms",
    },
    {
      id: 'throughput-notifications',
      category: 'throughput',
      question: "How many notifications are generated per day?",
      answer: "About 1 billion notifications per day",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 notifications/sec",
        result: "~12K notifications/sec (36K at peak)",
      },
      learningPoint: "High volume requires async processing and efficient fanout",
    },
    {
      id: 'concurrent-connections',
      category: 'throughput',
      question: "How many users are online simultaneously?",
      answer: "At peak, 20 million concurrent connections need to be maintained for real-time delivery",
      importance: 'critical',
      learningPoint: "20M WebSocket connections require distributed gateway architecture",
    },
    {
      id: 'delivery-latency',
      category: 'latency',
      question: "How fast should notifications be delivered?",
      answer: "p99 under 1 second for online users. Real-time means instant - users expect to see notifications immediately.",
      importance: 'critical',
      learningPoint: "Sub-second delivery requires push mechanisms (WebSocket/SSE), not polling",
    },
    {
      id: 'fanout-scale',
      category: 'burst',
      question: "What's the largest fanout we need to handle?",
      answer: "Think celebrity tweet or breaking news: one notification might need to reach 10 million users. All in real-time.",
      importance: 'critical',
      insight: "Massive fanout can't be synchronous - needs async queue-based processing",
    },
    {
      id: 'storage-requirements',
      category: 'reliability',
      question: "How long should we keep notification history?",
      answer: "90 days minimum. Users should be able to scroll through notification history. After 90 days, archive to cold storage.",
      importance: 'important',
      learningPoint: "Storage grows linearly with notifications - need retention policy",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-notifications', 'delivery-mechanism', 'notification-persistence'],
  criticalFRQuestionIds: ['core-notifications', 'delivery-mechanism', 'notification-persistence'],
  criticalScaleQuestionIds: ['throughput-notifications', 'concurrent-connections', 'fanout-scale'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users receive real-time push notifications',
      description: 'Notifications are pushed to online users instantly',
      emoji: '🔔',
    },
    {
      id: 'fr-2',
      text: 'FR-2: System supports multiple notification types',
      description: 'Handle activity, system, and real-time update notifications',
      emoji: '📬',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Notifications are stored persistently',
      description: 'Users can view notification history and missed notifications',
      emoji: '💾',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can mark notifications as read',
      description: 'Track read/unread status for all notifications',
      emoji: '✅',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '1 billion notifications',
    readsPerDay: 'N/A (push-based)',
    peakMultiplier: 3,
    readWriteRatio: 'N/A (push model)',
    calculatedWriteRPS: { average: 11574, peak: 34722 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~500 bytes (notification)',
    storagePerRecord: '~200 bytes',
    storageGrowthPerYear: '~73TB',
    redirectLatencySLA: 'p99 < 1s (notification delivery)',
    createLatencySLA: 'p99 < 100ms (notification creation)',
  },

  architecturalImplications: [
    '✅ Real-time push → WebSocket or SSE connections required',
    '✅ 20M concurrent connections → Need WebSocket gateway layer',
    '✅ Massive fanout → Message queue for async processing',
    '✅ Offline users → Queue notifications for later delivery',
    '✅ Guaranteed delivery → Persistent queue with acknowledgments',
    '✅ 1B notifications/day → Database partitioning by user_id',
  ],

  outOfScope: [
    'Email notifications',
    'Mobile push notifications (APNs/FCM)',
    'SMS notifications',
    'Complex user preference management',
    'Notification grouping/bundling',
    'Rich media in notifications',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can receive notifications. Real-time delivery with WebSocket and massive fanout challenges will come in later steps. Functionality first, then real-time optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔔',
  scenario: "Welcome to Notification Systems Inc! You're building a real-time notification platform.",
  hook: "Users want to know instantly when something important happens!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your notification system is online!',
  achievement: 'Users can now connect to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to create or deliver notifications yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every notification system starts with a **Client** connecting to a **Server**.

When a user opens the app:
1. Their device (web browser, mobile app) is the **Client**
2. It connects to your **App Server**
3. The server will eventually push notifications back to the client

For now, we start with basic HTTP for APIs. Later, we'll add WebSocket for real-time push.`,

  whyItMatters: 'Without this connection, users can\'t receive notifications at all.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Delivering billions of notifications daily',
    howTheyDoIt: 'Uses a distributed notification gateway system with WebSocket connections to push notifications instantly',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that handles notification logic',
    'HTTP = initial protocol (we\'ll add WebSocket for push later)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s device that receives notifications', icon: '📱' },
    { title: 'App Server', explanation: 'Backend that manages notifications', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for API requests', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'notifications-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
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
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle notifications!",
  hook: "A user just received a like, but no notification appeared.",
  challenge: "Write the Python code to create and fetch notifications.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle notifications!',
  achievement: 'You implemented the core notification functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create notifications', after: '✓' },
    { label: 'Can fetch notifications', after: '✓' },
    { label: 'Can mark as read', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all notifications are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Notification Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For notifications, we need handlers for:
- \`create_notification()\` - Create a new notification for a user
- \`get_notifications()\` - Fetch all notifications for a user
- \`mark_as_read()\` - Mark a notification as read

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy router. This is where notification logic lives!',

  famousIncident: {
    title: 'Twitter Notification Storm',
    company: 'Twitter',
    year: '2016',
    whatHappened: 'A bug caused users to receive duplicate notifications repeatedly. Some users got thousands of notifications for the same event, overwhelming both servers and user devices.',
    lessonLearned: 'Notification deduplication and rate limiting are critical. Always validate before sending.',
    icon: '🌪️',
  },

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Handling billions of like/follow notifications',
    howTheyDoIt: 'Uses a notification service that validates, deduplicates, and batches notifications before delivery',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (user not found, invalid notification)',
    'Return proper success/error responses',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory never fails',
      'Databases are expensive',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Database adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'CRUD', explanation: 'Create, Read, Update operations', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'notifications-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-3, FR-4: Create, fetch, and mark notifications',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/notifications, GET /api/v1/notifications, PUT /api/v1/notifications/:id/read APIs',
      'Open the Python tab',
      'Implement create_notification(), get_notifications(), and mark_as_read() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_notification, get_notifications, and mark_as_read',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/notifications', 'GET /api/v1/notifications', 'PUT /api/v1/notifications/:id/read'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed and all notifications vanished.",
  hook: "Users lost their entire notification history. They're furious about missing important updates.",
  challenge: "Add a database so notifications survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Notifications are now persistent!',
  achievement: 'Data survives server restarts and crashes',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But users still have to refresh to see new notifications...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Notifications',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Notifications survive crashes
- **Querying**: Fetch notifications by user, timestamp, read status
- **History**: Users can see old notifications

For notifications, we need tables for:
- \`notifications\` - All generated notifications
- \`user_notification_status\` - Read/unread status per user`,

  whyItMatters: 'Imagine losing all your notification history because of a server restart. Users would miss critical updates!',

  famousIncident: {
    title: 'LinkedIn Notification Database Outage',
    company: 'LinkedIn',
    year: '2019',
    whatHappened: 'Database issues caused a 6-hour outage where no notifications were delivered. Users missed job opportunities, messages, and important updates.',
    lessonLearned: 'Notification database must be highly available. Replication and backups are non-negotiable.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Storing billions of notifications',
    howTheyDoIt: 'Uses Cassandra (NoSQL) partitioned by user_id for horizontal scaling. Each user\'s notifications stay together.',
  },

  keyPoints: [
    'Databases provide durability - notifications survive crashes',
    'Choose SQL (PostgreSQL) for structured notification data',
    'Connect App Server to Database for read/write operations',
    'Partition by user_id for scalability',
  ],

  quickCheck: {
    question: 'What happens to in-memory notifications when a server restarts?',
    options: [
      'They\'re automatically saved to disk',
      'They\'re backed up to the cloud',
      'They\'re completely lost',
      'They\'re restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'Partitioning', explanation: 'Split data by user_id for scale', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'notifications-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store notifications and read status permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add WebSocket for Real-Time Push
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔄',
  scenario: "Users are frustrated! They have to refresh the page to see new notifications.",
  hook: "Your friend sent you a message 5 minutes ago, but you don't know because you haven't refreshed.",
  challenge: "Add WebSocket so notifications are pushed to users in real-time.",
  illustration: 'real-time-sync',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Notifications now appear instantly!',
  achievement: 'Real-time push delivery with WebSocket',
  metrics: [
    { label: 'Delivery method', before: 'Poll (slow)', after: 'Push (instant)' },
    { label: 'Latency', before: '10-30s', after: '<1s' },
  ],
  nextTeaser: "But what happens when millions of users are online simultaneously?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'WebSocket: Real-Time Push Notifications',
  conceptExplanation: `**WebSocket** enables true push notifications - the server sends data to the client without being asked.

Traditional HTTP (polling):
\`\`\`
Client: "Any notifications?" (every 10 seconds)
Server: "Nope"
Client: "Any notifications?"
Server: "Nope"
Client: "Any notifications?"
Server: "Yes! Here's one"
\`\`\`

WebSocket (push):
\`\`\`
Client: [maintains open connection]
Server: [sends notification when it happens] → INSTANT!
\`\`\`

WebSocket is:
- **Bidirectional**: Both client and server can send messages
- **Persistent**: Connection stays open
- **Efficient**: No repeated polling overhead`,

  whyItMatters: 'Polling wastes bandwidth and adds 10-30s latency. WebSocket delivers notifications instantly!',

  famousIncident: {
    title: 'WhatsApp\'s WebSocket Migration',
    company: 'WhatsApp',
    year: '2013',
    whatHappened: 'Early WhatsApp used polling, causing high battery drain and delayed messages. Switching to XMPP (similar to WebSocket) reduced latency from 10s to under 1s.',
    lessonLearned: 'For real-time notifications, WebSocket is the only viable option at scale.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Delivering instant notifications to millions',
    howTheyDoIt: 'Uses WebSocket connections maintained by a distributed gateway layer. When a notification is created, it\'s pushed through the WebSocket instantly.',
  },

  diagram: `
┌────────┐                          ┌─────────────┐
│ Client │◄────WebSocket────────────│ App Server  │
│        │   (persistent connection)│             │
└────────┘                          └──────┬──────┘
     ▲                                     │
     │                                     │
     │   Notification pushed instantly     │
     └─────────────────────────────────────┘
`,

  keyPoints: [
    'WebSocket = persistent bidirectional connection',
    'Server pushes notifications to client instantly',
    'No polling overhead - much more efficient',
    'Requires maintaining open connections (stateful)',
  ],

  quickCheck: {
    question: 'Why is WebSocket better than polling for notifications?',
    options: [
      'WebSocket uses less memory',
      'WebSocket is easier to implement',
      'WebSocket delivers instantly without repeated requests',
      'WebSocket works on older browsers',
    ],
    correctIndex: 2,
    explanation: 'WebSocket enables instant push delivery. Polling has latency (poll interval) and wastes bandwidth with repeated "any updates?" requests.',
  },

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent bidirectional connection', icon: '🔌' },
    { title: 'Push', explanation: 'Server sends data to client proactively', icon: '📤' },
    { title: 'Polling', explanation: 'Client repeatedly asks for updates (inefficient)', icon: '🔄' },
  ],
};

const step4: GuidedStep = {
  id: 'notifications-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time push notifications via WebSocket',
    taskDescription: 'Add WebSocket support to enable real-time push delivery',
    componentsNeeded: [
      { type: 'websocket', reason: 'Enable real-time push notifications to clients', displayName: 'WebSocket Gateway' },
    ],
    successCriteria: [
      'WebSocket component added to canvas',
      'Client connected to WebSocket Gateway',
      'WebSocket Gateway connected to App Server',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'websocket', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a WebSocket Gateway component onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → WebSocket Gateway → App Server. This enables real-time push.',
    solutionComponents: [{ type: 'websocket' }],
    solutionConnections: [
      { from: 'client', to: 'websocket' },
      { from: 'websocket', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Notification Fanout
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📢',
  scenario: "A celebrity just posted! 5 million followers need to be notified.",
  hook: "Your server is trying to send 5M notifications synchronously. It's taking 20 minutes!",
  challenge: "Add a message queue to handle massive notification fanout asynchronously.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Fanout is now instant and scalable!',
  achievement: 'Async processing handles millions of notifications',
  metrics: [
    { label: 'Fanout time', before: '20 minutes', after: '<5 seconds' },
    { label: 'User experience', before: 'Blocked', after: 'Instant response' },
  ],
  nextTeaser: "But we need load balancing to handle millions of WebSocket connections...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Notification Fanout',
  conceptExplanation: `**Fanout** = one event creates notifications for many users.

Without a queue (synchronous):
\`\`\`
Celebrity posts → Create 5M notifications → Wait 20 minutes → Response
\`\`\`

With a message queue (async):
\`\`\`
Celebrity posts → Put "fanout task" in queue → Instant response ✓
Background workers → Process queue → Send notifications gradually
\`\`\`

The queue enables:
- **Instant response**: User doesn't wait
- **Scalability**: Workers process in parallel
- **Reliability**: Retries if delivery fails

For notifications:
1. Event happens (like, comment, post)
2. App Server puts fanout task in queue
3. Workers consume queue and send notifications
4. Each worker handles a batch of users`,

  whyItMatters: 'Without async fanout, a single celebrity post would block your server for minutes. Users would wait forever!',

  famousIncident: {
    title: 'Twitter Notification Delays',
    company: 'Twitter',
    year: '2018',
    whatHappened: 'During a major world event, celebrities\' tweets caused massive fanout. Without proper queuing, notifications were delayed by hours. Millions of users missed real-time updates.',
    lessonLearned: 'Fanout must be async with queues. Synchronous fanout doesn\'t scale beyond 100s of users.',
    icon: '⏰',
  },

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Fanout for celebrity posts',
    howTheyDoIt: 'Uses Kafka queues. When a celebrity posts, a fanout task goes to the queue. Workers gradually create notifications for millions of followers.',
  },

  diagram: `
Celebrity Posts
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant ✓) │     │  [fanout_task_1, fanout_task_2...] │
└─────────────┘     └──────────────┬──────────────────────┘
                                   │
                         Workers consume in parallel
                                   ▼
                          ┌─────────────────┐
                          │  Fanout Workers │
                          │  (background)   │
                          └────────┬────────┘
                                   │
              Send notifications to millions of users
                                   ▼
                          [User1, User2, ... User5M]
`,

  keyPoints: [
    'Queue decouples notification creation from delivery',
    'User gets instant response - fanout happens async',
    'Workers process queue in parallel for speed',
    'Essential for large fanout (1000+ recipients)',
  ],

  quickCheck: {
    question: 'Why use async fanout for notifications?',
    options: [
      'It\'s easier to implement',
      'User gets instant response while fanout happens in background',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Async means the user doesn\'t wait. Notification event is queued instantly, fanout to millions happens in the background.',
  },

  keyConcepts: [
    { title: 'Fanout', explanation: 'Delivering one notification to many users', icon: '📡' },
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
  ],
};

const step5: GuidedStep = {
  id: 'notifications-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Scalable notification delivery via async fanout',
    taskDescription: 'Add a Message Queue for async notification fanout',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle async fanout to millions of users', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'websocket', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async fanout processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for WebSocket Scaling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single WebSocket gateway is maxed out with 20 million connections!",
  hook: "New users can't connect. The gateway is at 100% capacity and crashing.",
  challenge: "Add a load balancer with sticky sessions to distribute WebSocket connections.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'WebSocket connections are now distributed!',
  achievement: 'Load balancer scales to millions of concurrent users',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Max connections', before: '1M', after: '20M+' },
  ],
  nextTeaser: "But we need to cache notification data to reduce database load...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing WebSocket Connections',
  conceptExplanation: `A **Load Balancer** distributes WebSocket connections across multiple gateways.

For **WebSocket**, we need **sticky sessions**:
- Once a user connects to a gateway, they stay on that gateway
- All their notifications route through the same gateway
- Uses IP hash or cookie-based routing

Why sticky sessions?
- WebSocket is a stateful, long-lived connection
- Can't switch gateways mid-connection
- Gateway maintains the connection state

This enables horizontal scaling:
- 1 gateway → 1M connections
- 20 gateways → 20M connections`,

  whyItMatters: 'No single server can handle 20M concurrent WebSocket connections. Load balancing is essential for scale.',

  famousIncident: {
    title: 'Facebook Messenger WebSocket Outage',
    company: 'Facebook',
    year: '2021',
    whatHappened: 'Load balancer misconfiguration caused WebSocket connections to be distributed unevenly. Some gateways were overloaded while others were idle. Service degraded for millions.',
    lessonLearned: 'Load balancer health checks must account for connection count, not just CPU. WebSocket load balancing requires special care.',
    icon: '⚖️',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Handling 2 billion WebSocket connections',
    howTheyDoIt: 'Uses custom load balancer with connection-aware routing. Distributes connections evenly across gateways based on active connection count.',
  },

  diagram: `
              ┌─────────────────┐
              │  WS Gateway 1   │
┌────────┐   ┌──────────────────┐   │ (5M connections)│
│ Client │──▶│  Load Balancer   │──▶└─────────────────┘
└────────┘   │ (Sticky Session) │   ┌─────────────────┐
              └──────────────────┘   │  WS Gateway 2   │
                                     │ (5M connections)│
                                     └─────────────────┘
`,

  keyPoints: [
    'Load balancer distributes WebSocket connections',
    'Sticky sessions keep user on same gateway',
    'Enables horizontal scaling (add more gateways)',
    'Use connection-aware routing for even distribution',
  ],

  quickCheck: {
    question: 'Why do WebSocket connections need sticky sessions?',
    options: [
      'To make them faster',
      'WebSocket is stateful - can\'t switch gateways mid-connection',
      'To reduce costs',
      'To improve security',
    ],
    correctIndex: 1,
    explanation: 'WebSocket maintains a long-lived, stateful connection. The gateway holds the connection state, so users must stay on the same gateway.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across servers', icon: '⚖️' },
    { title: 'Sticky Session', explanation: 'User stays on same server', icon: '📌' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '➡️' },
  ],
};

const step6: GuidedStep = {
  id: 'notifications-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1: Scale real-time push to millions of users',
    taskDescription: 'Add a Load Balancer between Client and WebSocket Gateway',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute WebSocket connections with sticky sessions', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to WebSocket Gateway',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'websocket', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and WebSocket Gateway',
    level2: 'Reconnect: Client → Load Balancer → WebSocket Gateway. This enables sticky session routing.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'websocket' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Cache for Recent Notifications
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🐌',
  scenario: "Users are complaining about slow notification loading!",
  hook: "Every time someone opens notifications, it hits the database. With 100M users, your DB is overwhelmed.",
  challenge: "Add a cache for recent notifications to reduce database load.",
  illustration: 'slow-loading',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Notifications load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Notification load latency', before: '500ms', after: '25ms' },
    { label: 'Cache hit rate', after: '90%' },
    { label: 'Database load', before: '100%', after: '10%' },
  ],
  nextTeaser: "But we still need to optimize costs...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Notification Retrieval',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For notifications, we cache:
- **Recent notifications** - Last 50-100 notifications per user
- **Unread counts** - How many unread notifications each user has
- **User preferences** - Notification settings (if implemented)

Cache flow:
\`\`\`
Get notifications → Check cache (1ms)
  ├─ Hit → Return from cache ✓
  └─ Miss → Fetch from DB (100ms) → Store in cache
\`\`\`

Cache invalidation:
- When new notification created → Update user's cache
- TTL (Time To Live) → Cache expires after 5 minutes
- Ensures cache doesn't get stale`,

  whyItMatters: 'Users check notifications frequently. Without caching, every check hammers the database.',

  famousIncident: {
    title: 'Instagram Notification Cache Stampede',
    company: 'Instagram',
    year: '2017',
    whatHappened: 'Cache TTL for notifications was set to expire at the same time for millions of users. When it expired, millions of requests hit the database simultaneously, causing a 30-minute outage.',
    lessonLearned: 'Use random TTL jitter to prevent cache stampede. Distribute expirations over time.',
    icon: '🐘',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Serving notification feeds to millions',
    howTheyDoIt: 'Uses Redis to cache recent notifications. 95% of notification fetches are served from cache, not database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache recent notifications per user',
    'Cache Hit = instant response (1ms)',
    'Cache Miss = fetch from DB, store in cache',
    'Invalidate cache when new notification arrives',
  ],

  quickCheck: {
    question: 'What should be cached for best notification performance?',
    options: [
      'All notifications ever created',
      'Recent notifications and unread counts',
      'Only user profiles',
      'Nothing - caching adds complexity',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed data: recent notifications (shown immediately) and unread counts (displayed constantly).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step7: GuidedStep = {
  id: 'notifications-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Fast notification retrieval via caching',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache recent notifications and unread counts', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds for notifications)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'websocket', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
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
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is panicking! Your monthly cloud bill is $800,000.",
  hook: "The CFO says: 'Optimize costs by 40% or we're shutting down the notification system.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a scalable notification system!',
  achievement: 'A cost-effective, real-time notification platform',
  metrics: [
    { label: 'Monthly cost', before: '$800K', after: 'Under budget' },
    { label: 'Delivery latency', after: '<1s' },
    { label: 'Availability', after: '99.9%' },
    { label: 'Can handle', after: '20M concurrent connections' },
  ],
  nextTeaser: "You've mastered real-time notification system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for notifications:
1. **Right-size WebSocket gateways** - Don't over-provision
2. **Cache aggressively** - Reduce expensive database queries
3. **Batch fanout** - Send notifications in batches (100-1000 at a time)
4. **Auto-scale** - Scale down during off-hours
5. **Archive old notifications** - Move to cheaper cold storage after 90 days
6. **Use message queue retention** - Don't keep processed tasks forever

For notifications:
- Most users have <100 notifications - don't allocate for millions
- Auto-scale WebSocket gateways based on active connections
- Batch fanout workers to send 1000 notifications per DB write`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Twitter\'s Notification Cost Crisis',
    company: 'Twitter',
    year: '2022',
    whatHappened: 'Twitter\'s notification infrastructure was over-provisioned. They were paying for 10x more capacity than needed. Cost optimization efforts saved millions annually.',
    lessonLearned: 'Monitor actual usage and right-size infrastructure. Most of the time, you don\'t need peak capacity.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Running notifications cost-effectively at scale',
    howTheyDoIt: 'Uses aggressive caching, batched fanout, and auto-scaling. Old notifications archived to S3. Achieves <$0.01 per 1000 notifications.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size WebSocket gateways and workers',
    'Use auto-scaling to match demand',
    'Cache to reduce database operations',
    'Archive old data to cheaper storage',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for notification systems?',
    options: [
      'Use bigger servers',
      'Cache recent notifications and auto-scale',
      'Delete old notifications',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Caching reduces expensive database queries. Auto-scaling adjusts capacity to actual usage, saving 40-60% on compute costs.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match capacity to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'notifications-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $500/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $500/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'websocket', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: right-sized instances, cache hit ratio, auto-scaling. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const realtimeNotificationsGuidedTutorial: GuidedTutorial = {
  problemId: 'realtime-notifications',
  title: 'Design Realtime Notifications',
  description: 'Build a scalable notification system with WebSocket push, SSE, and notification fanout',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🔔',
    hook: "You've been hired as Lead Engineer at Notification Systems Inc!",
    scenario: "Your mission: Build a notification system that delivers real-time updates to millions of users instantly.",
    challenge: "Can you design a system that handles WebSocket connections, massive fanout, and guaranteed delivery?",
  },

  requirementsPhase: realtimeNotificationsRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'WebSocket Connections',
    'Server-Sent Events',
    'Push vs Pull',
    'Message Queues',
    'Notification Fanout',
    'Load Balancing',
    'Sticky Sessions',
    'Caching',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding and Evolution',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
    'Chapter 12: Data Systems',
  ],
};

export default realtimeNotificationsGuidedTutorial;
