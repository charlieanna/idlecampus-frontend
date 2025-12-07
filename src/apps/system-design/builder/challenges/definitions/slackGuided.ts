import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Slack Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a team messaging platform like Slack.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, load balancer, replication, queues, cost)
 *
 * Key Concepts:
 * - WebSocket for real-time messaging
 * - Message threading and reactions
 * - Full-text search with Elasticsearch
 * - Channel-based communication
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const slackRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a team messaging platform like Slack",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Staff Engineer at Collaboration Systems Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-messaging',
      category: 'functional',
      question: "What are the core features users need in a team messaging platform?",
      answer: "Users need to:\n\n1. **Send messages** - Share text messages in real-time with team members\n2. **Create channels** - Organize conversations by topic or team\n3. **Direct messages** - Private 1-on-1 or small group conversations\n4. **Search** - Find past messages and files across all conversations",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Slack is about organized, searchable team communication in real-time",
    },
    {
      id: 'real-time',
      category: 'functional',
      question: "How quickly should messages appear for other users?",
      answer: "Messages should appear **instantly** (within 100-200ms). Unlike Twitter's feed which can update in seconds, Slack is a real-time chat application. Users expect immediate delivery.",
      importance: 'critical',
      revealsRequirement: 'NFR-1',
      learningPoint: "Real-time messaging requires WebSocket connections, not just HTTP polling",
    },
    {
      id: 'channel-system',
      category: 'functional',
      question: "How do channels work? Can anyone create them?",
      answer: "**Channels** are organized conversation spaces:\n- **Public channels** - Anyone in the workspace can join\n- **Private channels** - Invite-only\n- Users can create channels freely\n- Messages are visible to all channel members",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Channels are the organizing principle - different from Twitter's follow model",
    },
    {
      id: 'message-features',
      category: 'functional',
      question: "Can users do more than just send plain text?",
      answer: "Yes! Users can:\n1. **Thread replies** - Reply to specific messages to keep conversations organized\n2. **React with emoji** - Quick acknowledgment without cluttering\n3. **Share files** - Upload documents, images, etc.\n\nFor MVP, let's focus on text messages and threads. Files can come later.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Threading is what makes Slack different from basic chat - keeps conversations organized",
    },
    {
      id: 'workspace',
      category: 'clarification',
      question: "How are teams organized? Can a user be in multiple teams?",
      answer: "Teams use **workspaces**. Each company/team has its own workspace with separate channels and users. A user can be in multiple workspaces (like work and side project). For MVP, focus on single workspace functionality.",
      importance: 'nice-to-have',
      insight: "Workspaces are isolated namespaces - important for data separation",
    },
    {
      id: 'notifications',
      category: 'clarification',
      question: "Should users get notifications for new messages?",
      answer: "Yes, notifications are important for mentions (@user) and direct messages. But let's scope this to basic in-app indicators for the MVP. Push notifications can come later.",
      importance: 'nice-to-have',
      insight: "Notifications require a separate delivery system - good to defer initially",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "10 million daily active users across all workspaces, with average workspace size of 50-100 users. Largest workspaces may have 10,000+ users.",
      importance: 'critical',
      learningPoint: "Much smaller scale than Twitter, but real-time requirements are stricter",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages are sent per day?",
      answer: "About 500 million messages per day across all workspaces",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 messages/sec",
        result: "~6K writes/sec (18K at peak)",
      },
      learningPoint: "Similar write volume to Twitter, but delivery patterns are different",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many users are actively reading messages?",
      answer: "About 50% of DAU are actively connected during work hours. That's 5 million concurrent WebSocket connections at peak.",
      importance: 'critical',
      learningPoint: "Real-time connections are expensive - each user maintains an open socket",
    },
    {
      id: 'channel-activity',
      category: 'burst',
      question: "What happens in a very active channel with 1,000 members?",
      answer: "When a message is sent, it needs to be delivered to all 1,000 online members in real-time. During an incident or announcement, this could be dozens of messages per second.",
      importance: 'critical',
      insight: "Real-time fan-out to active channel members is the key challenge",
    },
    {
      id: 'latency-delivery',
      category: 'latency',
      question: "How fast should messages be delivered?",
      answer: "p99 under 200ms from send to delivery. Users expect chat to feel instant.",
      importance: 'critical',
      learningPoint: "Sub-second real-time delivery requires WebSocket and efficient fan-out",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results return?",
      answer: "p99 under 500ms. Search is used frequently to find past conversations, so it needs to be fast.",
      importance: 'important',
      learningPoint: "Search across millions of messages requires dedicated search infrastructure",
    },
    {
      id: 'persistence',
      category: 'reliability',
      question: "Do messages need to be stored permanently?",
      answer: "Yes! All messages must be persisted forever (or until manually deleted). Users need to search through years of message history. This is not ephemeral chat.",
      importance: 'critical',
      learningPoint: "Unlike some chat apps, Slack is a knowledge base - messages are permanent",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-messaging', 'real-time', 'channel-system'],
  criticalFRQuestionIds: ['core-messaging', 'channel-system'],
  criticalScaleQuestionIds: ['throughput-users', 'channel-activity', 'latency-delivery'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can send messages',
      description: 'Send real-time text messages in channels and DMs',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can create channels',
      description: 'Create public/private channels to organize conversations',
      emoji: '📺',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can send direct messages',
      description: 'Private 1-on-1 or small group conversations',
      emoji: '📨',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can search messages',
      description: 'Find past messages and conversations by keyword',
      emoji: '🔍',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can thread replies',
      description: 'Reply to specific messages to keep conversations organized',
      emoji: '🧵',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: '500 million messages',
    readsPerDay: 'N/A (real-time push)',
    peakMultiplier: 3,
    readWriteRatio: 'N/A (push-based)',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~2KB (message with metadata)',
    storagePerRecord: '~1KB',
    storageGrowthPerYear: '~180TB',
    redirectLatencySLA: 'p99 < 200ms (message delivery)',
    createLatencySLA: 'p99 < 200ms (send)',
  },

  architecturalImplications: [
    '✅ Real-time delivery → WebSocket connections required',
    '✅ 5M concurrent connections → Need connection pooling and load balancing',
    '✅ Channel fan-out → Message queue for async delivery to offline users',
    '✅ Message history → Database with efficient channel-based queries',
    '✅ Search across millions of messages → Elasticsearch required',
  ],

  outOfScope: [
    'File uploads and storage',
    'Video/audio calls',
    'Push notifications (mobile)',
    'Multi-workspace management',
    'Slack apps/integrations',
    'Message editing history',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can send messages in channels. Real-time WebSocket delivery and scaling challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💼',
  scenario: "Welcome to Collaboration Systems Inc! You've been hired to build the next Slack.",
  hook: "Your first team just signed up. They're ready to start messaging!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your messaging platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle messages yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens Slack:
1. Their device (desktop app, browser, mobile) is the **Client**
2. It sends requests to your **App Server**
3. The server processes the request and sends back a response

For real-time messaging, we'll upgrade this to WebSocket later. But we start with basic HTTP.`,

  whyItMatters: 'Without this connection, users can\'t send or receive messages at all.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Handling 10 million daily active users',
    howTheyDoIt: 'Started with a simple PHP backend in 2013, now uses a complex distributed system with WebSocket servers',
  },

  keyPoints: [
    'Client = the user\'s device (desktop app, browser, mobile)',
    'App Server = your backend that processes requests',
    'HTTP = the initial protocol (we\'ll upgrade to WebSocket later)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'slack-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Slack', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles messages and channels', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle messages yet!",
  hook: "A user just tried to send 'Hello, team!' but got an error.",
  challenge: "Write the Python code to send messages, create channels, and search.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle messages!',
  achievement: 'You implemented the core Slack functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can send messages', after: '✓' },
    { label: 'Can create channels', after: '✓' },
    { label: 'Can search messages', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all messages are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Message Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Slack, we need handlers for:
- \`send_message()\` - Send a message to a channel or DM
- \`create_channel()\` - Create a new channel
- \`search_messages()\` - Search through message history

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'Slack\'s Early Growth Pains',
    company: 'Slack',
    year: '2014',
    whatHappened: 'During rapid growth, Slack\'s simple message handlers couldn\'t keep up. Users experienced message delays and the infamous "connection issues" banner.',
    lessonLearned: 'Start simple, but design for growth. The handlers we write today will evolve as we scale.',
    icon: '📶',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Sending messages',
    howTheyDoIt: 'Message service handles ~6,000 messages/second, using WebSocket for real-time delivery and queues for offline users',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (channel not found, empty message, etc.)',
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
    { title: 'CRUD', explanation: 'Create, Read, Update, Delete operations', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'slack-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send messages, FR-2: Create channels, FR-4: Search messages',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/messages, POST /api/v1/channels, GET /api/v1/search APIs',
      'Open the Python tab',
      'Implement send_message(), create_channel(), and search_messages() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for send_message, create_channel, and search_messages',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/messages', 'POST /api/v1/channels', 'GET /api/v1/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL the messages were GONE! Your team lost all their conversations.",
  challenge: "Add a database so messages survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your messages are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But active channels are getting slow as message history grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Slack, we need tables for:
- \`workspaces\` - Team/company workspaces
- \`users\` - User accounts
- \`channels\` - All channels (public/private)
- \`messages\` - All sent messages
- \`channel_members\` - Who's in each channel`,

  whyItMatters: 'Imagine losing all your team\'s conversations because of a server restart. The company knowledge base would vanish!',

  famousIncident: {
    title: 'Slack Outage During Remote Work Surge',
    company: 'Slack',
    year: '2020',
    whatHappened: 'As COVID-19 forced remote work, Slack\'s database couldn\'t handle the sudden 3x traffic increase. Multiple outages affected millions. Messages were delayed or lost temporarily.',
    lessonLearned: 'Persistent storage with proper scaling is non-negotiable. Database capacity must grow with users.',
    icon: '🏠',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Storing 500 million messages per day',
    howTheyDoIt: 'Uses sharded MySQL databases partitioned by workspace_id for horizontal scaling. Each workspace\'s data stays together.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL/MySQL) for structured data like messages',
    'Connect App Server to Database for read/write operations',
    'Partition by workspace_id for scalability',
  ],

  quickCheck: {
    question: 'What happens to in-memory data when a server restarts?',
    options: [
      'It\'s automatically saved to disk',
      'It\'s backed up to the cloud',
      'It\'s completely lost',
      'It\'s restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'slack-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store messages, channels, users permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Channel Data
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10,000 users, and channels are loading slowly!",
  hook: "Users complain: 'Why does it take 3 seconds to open a channel?' Every request hits the database.",
  challenge: "Add a cache to make channel membership and recent messages lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Channels load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Channel load latency', before: '3000ms', after: '150ms' },
    { label: 'Cache hit rate', after: '85%' },
  ],
  nextTeaser: "But what happens when thousands of users connect simultaneously?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Slack, we cache:
- **Channel membership** - Who's in each channel (read frequently)
- **Recent messages** - Last 50-100 messages per channel
- **User presence** - Who's online right now

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\``,

  whyItMatters: 'Users switch between channels constantly. Without caching, every channel switch would hammer the database.',

  famousIncident: {
    title: 'Slack Search Indexing Challenges',
    company: 'Slack',
    year: '2019',
    whatHappened: 'As workspaces grew to millions of messages, search indexing fell behind. New messages weren\'t searchable for hours. They had to rebuild their entire search infrastructure.',
    lessonLearned: 'Cache recent data aggressively. Search indexing is expensive - keep it separate from real-time messaging.',
    icon: '🔍',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Serving millions of channel loads per day',
    howTheyDoIt: 'Uses Redis clusters to cache channel membership and recent messages. Most channel opens never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (85% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Cache channel membership and recent messages',
  ],

  quickCheck: {
    question: 'What should Slack cache for best performance?',
    options: [
      'All messages ever sent',
      'Channel membership and recent messages',
      'Only user profiles',
      'Search results',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed data: channel membership (read often) and recent messages (shown on channel open).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'slack-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can create channels (now loads fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache channel membership and recent messages', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds for channel data)',
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
// STEP 5: Add Load Balancer with WebSocket Support
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out handling WebSocket connections!",
  hook: "5,000 concurrent users are connected, and new users can't join. CPU is at 100%!",
  challenge: "Add a load balancer with sticky sessions for WebSocket connections.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'WebSocket traffic is now distributed!',
  achievement: 'Load balancer with sticky sessions spreads connections across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'WebSocket distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we still need database redundancy for high availability...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing with WebSocket Sticky Sessions',
  conceptExplanation: `A **Load Balancer** distributes incoming connections across servers.

For **WebSocket** (real-time messaging), we need **sticky sessions**:
- Once a user connects to a server, they stay on that server
- All their messages route through the same server
- Uses IP hash or cookie-based routing

Why sticky sessions?
- WebSocket is a stateful, long-lived connection
- Can't switch servers mid-conversation
- Server maintains the socket state`,

  whyItMatters: 'Real-time messaging requires 5M+ concurrent WebSocket connections. No single server can handle that.',

  famousIncident: {
    title: 'Slack WebSocket Storm',
    company: 'Slack',
    year: '2017',
    whatHappened: 'A bug caused mass WebSocket reconnections. All users disconnected and reconnected simultaneously, overwhelming load balancers. Took hours to recover.',
    lessonLearned: 'Load balancers must handle connection storms gracefully. Use connection rate limiting and circuit breakers.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Handling 5M+ concurrent connections',
    howTheyDoIt: 'Uses HAProxy with sticky sessions based on user_id. Distributes WebSocket connections across hundreds of servers.',
  },

  diagram: `
              ┌─────────────────┐
              │ App Server 1    │
┌────────┐   ┌──────────────────┐   │ (WebSocket)     │
│ Client │──▶│  Load Balancer   │──▶└─────────────────┘
└────────┘   │ (Sticky Session) │   ┌─────────────────┐
              └──────────────────┘   │ App Server 2    │
              │ (WebSocket)     │
              └─────────────────┘
`,

  keyPoints: [
    'Load balancer distributes WebSocket connections',
    'Sticky sessions keep user on same server',
    'Use IP hash or cookie-based routing',
    'Enables horizontal scaling of connections',
  ],

  quickCheck: {
    question: 'Why do WebSocket connections need sticky sessions?',
    options: [
      'To make them faster',
      'WebSocket is stateful - can\'t switch servers mid-connection',
      'To reduce costs',
      'To improve security',
    ],
    correctIndex: 1,
    explanation: 'WebSocket maintains a long-lived, stateful connection. The server holds the socket state, so users must stay on the same server.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across servers', icon: '⚖️' },
    { title: 'Sticky Session', explanation: 'User stays on same server', icon: '📌' },
    { title: 'WebSocket', explanation: 'Real-time bidirectional connection', icon: '🔌' },
  ],
};

const step5: GuidedStep = {
  id: 'slack-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing (especially real-time messaging)',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute WebSocket connections with sticky sessions', displayName: 'Load Balancer' },
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
    level2: 'Reconnect: Client → Load Balancer → App Server. This enables WebSocket sticky sessions.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database crashed for 10 minutes this morning. Teams couldn't work.",
  hook: "No messages could be sent or retrieved. Revenue loss: $100,000 in productivity.",
  challenge: "Add database replication so a backup is always ready.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we need more app servers to handle millions of concurrent users...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Messages',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your messages`,

  whyItMatters: 'A single database is a single point of failure. For Slack\'s 500M messages/day, downtime means teams can\'t work.',

  famousIncident: {
    title: 'Slack Major Outage',
    company: 'Slack',
    year: '2020',
    whatHappened: 'Database issues caused a 4-hour outage affecting millions of users worldwide. Teams couldn\'t send or receive messages during critical work hours.',
    lessonLearned: 'Database replication is essential. Test failover regularly - it must be automatic and fast.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Zero tolerance for message loss',
    howTheyDoIt: 'Uses MySQL with 3-way replication. Each workspace\'s messages are stored on 3 different servers across availability zones.',
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
    'If primary fails, a replica can be promoted',
    'Replication adds some latency (data sync delay)',
    'Use at least 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'What happens if the primary database fails with replication enabled?',
    options: [
      'All data is lost',
      'A replica is promoted to become the new primary',
      'All reads and writes fail',
      'The system automatically creates a new database',
    ],
    correctIndex: 1,
    explanation: 'With replication, a replica can be promoted to primary (failover), maintaining availability.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'slack-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable data storage',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
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
    level2: 'Enable replication and set replicas to 2. This creates read copies of your data.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Async Processing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📨',
  scenario: "A message sent to a channel with 5,000 members is taking 10 seconds!",
  hook: "Real-time delivery is broken. Online users wait forever for messages to arrive.",
  challenge: "Add a message queue to handle async notifications and search indexing.",
  illustration: 'message-delay',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Messages are delivered instantly!',
  achievement: 'Async processing handles notifications and indexing',
  metrics: [
    { label: 'Message send latency', before: '10s', after: '<200ms' },
    { label: 'Real-time delivery', after: 'Instant' },
  ],
  nextTeaser: "But search is still slow without proper indexing...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Notifications and Search',
  conceptExplanation: `Message queues enable **async processing** so users don't wait.

When a message is sent:
1. **Synchronous**: Save to database, return success ✓
2. **Async via Queue**:
   - Fan-out to online users via WebSocket
   - Index in Elasticsearch for search
   - Send notifications to offline users

This is the **write-through, async fan-out** pattern.

For Slack:
- Message saved immediately
- Background workers handle delivery and indexing
- Users see instant confirmation`,

  whyItMatters: 'Without queues, sending a message would block until all 5,000 channel members are notified. User waits 10+ seconds!',

  famousIncident: {
    title: 'Slack Notification Storm',
    company: 'Slack',
    year: '2018',
    whatHappened: 'A bug caused duplicate notifications to be sent. Message queue got overwhelmed with millions of notification tasks. Users got spammed with hundreds of notifications.',
    lessonLearned: 'Queue processing must be idempotent. Use deduplication and rate limiting.',
    icon: '🔔',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Real-time message delivery',
    howTheyDoIt: 'Uses Kafka for event streaming. Message events go to queue, workers handle WebSocket delivery to online users and push notifications to offline users.',
  },

  diagram: `
User Sends Message
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [msg1, msg2, msg3, ...]            │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Sent!"                    ▼
                          ┌─────────────────┐
                          │  Async Workers  │
                          │  (background)   │
                          └────────┬────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐          ┌──────────┐        ┌──────────┐
        │WebSocket │          │  Search  │        │  Mobile  │
        │ Delivery │          │ Indexing │        │  Push    │
        └──────────┘          └──────────┘        └──────────┘
`,

  keyPoints: [
    'Queue decouples message send from delivery',
    'User gets instant response - delivery happens async',
    'Workers handle WebSocket fan-out, search indexing, notifications',
    'Essential for large channels with thousands of members',
  ],

  quickCheck: {
    question: 'Why use async processing for message delivery?',
    options: [
      'It\'s cheaper',
      'User gets instant response while delivery happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the user doesn\'t wait. Message is saved instantly, delivery to thousands of users happens in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Fan-Out', explanation: 'Delivering one message to many users', icon: '📡' },
  ],
};

const step7: GuidedStep = {
  id: 'slack-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can send messages (now with async delivery)',
    taskDescription: 'Add a Message Queue for async notifications and search indexing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle async delivery and search indexing', displayName: 'Kafka' },
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
    level2: 'Connect App Server to Message Queue. This enables async delivery and indexing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $600,000.",
  hook: "The CFO says: 'Cut costs by 30% or we need to raise prices.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Slack!',
  achievement: 'A scalable, cost-effective team messaging platform',
  metrics: [
    { label: 'Monthly cost', before: '$600K', after: 'Under budget' },
    { label: 'Message delivery', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '5M concurrent connections' },
  ],
  nextTeaser: "You've mastered Slack system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision servers
2. **Use spot/preemptible instances** - 60-90% cheaper for stateless workers
3. **Cache aggressively** - Reduce expensive database calls
4. **Auto-scale** - Scale down during off-hours (nights/weekends)
5. **Archive old messages** - Move to cheaper cold storage after 90 days

For Slack:
- Most workspaces are small (<100 users) - don't over-allocate
- Auto-scale WebSocket servers based on connections
- Cache channel membership to reduce DB queries`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it. Teams won\'t pay $50/user/month.',

  famousIncident: {
    title: 'Slack\'s Infrastructure Evolution',
    company: 'Slack',
    year: '2015-2020',
    whatHappened: 'As Slack scaled from startup to enterprise, they had to optimize costs aggressively. Moved from expensive managed services to self-hosted infrastructure, saving millions.',
    lessonLearned: 'At scale, even small optimizations save millions. Design for cost from day 1.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Running at scale profitably',
    howTheyDoIt: 'Uses auto-scaling for WebSocket servers, aggressive caching, and cold storage for old messages. Heavily optimized resource usage.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure',
    'Use auto-scaling to match demand (work hours vs night)',
    'Cache to reduce expensive database operations',
    'Archive old data to cheaper storage',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for Slack\'s usage pattern (peak during work hours)?',
    options: [
      'Use bigger servers',
      'Auto-scale down at night and weekends',
      'Delete old messages',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Slack usage follows work hours. Auto-scaling saves 60%+ by scaling down nights and weekends when few users are active.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'slack-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $400/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $400/month',
      'Maintain all performance requirements',
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
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: fewer replicas, smaller cache, right-sized instances. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const slackGuidedTutorial: GuidedTutorial = {
  problemId: 'slack',
  title: 'Design Slack',
  description: 'Build a team messaging platform with channels, real-time messaging, and search',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '💼',
    hook: "You've been hired as Lead Engineer at Collaboration Systems Inc!",
    scenario: "Your mission: Build a Slack-like platform that enables real-time team communication for millions of users.",
    challenge: "Can you design a system that handles real-time WebSocket messaging at scale?",
  },

  requirementsPhase: slackRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'WebSocket Connections',
    'Sticky Sessions',
    'Database Replication',
    'Message Queues',
    'Real-Time Messaging',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
    'Chapter 12: Data Systems',
  ],
};

export default slackGuidedTutorial;
