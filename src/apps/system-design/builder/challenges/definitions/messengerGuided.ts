import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Messenger (Facebook Messenger) Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a messaging platform like Facebook Messenger.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, load balancer, replication, queues, cost)
 *
 * Key Concepts:
 * - WebSocket for real-time messaging
 * - 1:1 and group chat
 * - Message delivery and read receipts
 * - Video call infrastructure
 * - Message encryption
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const messengerRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a messaging platform like Facebook Messenger",

  interviewer: {
    name: 'Marcus Thompson',
    role: 'Principal Engineer at Social Messaging Corp.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-messaging',
      category: 'functional',
      question: "What are the core features users expect from a messaging app like Messenger?",
      answer: "Users want to:\n\n1. **1:1 Chat** - Private conversations with individuals\n2. **Group Chat** - Talk with multiple people simultaneously\n3. **Message History** - Access past conversations\n4. **Delivery Status** - See when messages are sent/delivered/read\n5. **Rich Media** - Share photos, videos, voice messages",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Messenger is fundamentally about real-time, persistent 1:1 and group communication",
    },
    {
      id: 'real-time-delivery',
      category: 'functional',
      question: "How quickly should messages appear for the recipient?",
      answer: "Messages should appear **instantly** (within 100-200ms) when both users are online. If the recipient is offline, the message should be delivered when they come back online.",
      importance: 'critical',
      revealsRequirement: 'NFR-1',
      learningPoint: "Real-time messaging requires WebSocket connections for instant delivery",
    },
    {
      id: 'group-chat',
      category: 'functional',
      question: "How large can group chats be? Is there a limit?",
      answer: "For the MVP, let's support groups up to 250 people. Messenger supports larger groups, but that adds complexity with fan-out and permissions. Start with 250.",
      importance: 'important',
      revealsRequirement: 'FR-2',
      learningPoint: "Group size affects fan-out complexity - messages must reach all group members",
    },
    {
      id: 'video-calls',
      category: 'functional',
      question: "Do users need voice and video calling?",
      answer: "Yes! Video calls are essential. For MVP:\n- **1:1 video calls** - Two people can video chat\n- **Group calls** can come later\n\nVideo requires WebRTC infrastructure, which is complex. Let's design the signaling server but defer full implementation.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Video calls require WebRTC signaling but actual media doesn't flow through app servers",
    },
    {
      id: 'message-reactions',
      category: 'functional',
      question: "Can users react to messages with emoji?",
      answer: "Absolutely! Quick reactions (like, love, laugh, etc.) let users respond without typing. For MVP, support basic emoji reactions on any message.",
      importance: 'nice-to-have',
      revealsRequirement: 'FR-4',
      insight: "Reactions are lightweight updates that should propagate in real-time",
    },
    {
      id: 'message-requests',
      category: 'functional',
      question: "What if someone who isn't your friend messages you?",
      answer: "Good question! Implement **Message Requests**:\n- Messages from non-friends go to a separate 'Requests' folder\n- User can accept or decline\n- Prevents spam while allowing new connections\n\nFor MVP, assume all messages go through - requests can be v2.",
      importance: 'nice-to-have',
      insight: "Anti-spam features add complexity but are important for user safety",
    },
    {
      id: 'encryption',
      category: 'clarification',
      question: "Should messages be encrypted?",
      answer: "Yes! At minimum, **encryption in transit** (HTTPS/WSS). For MVP, that's sufficient.\n\n**End-to-end encryption** (like Signal) is more complex and can be a v2 feature - requires key exchange, device-specific encryption, etc.",
      importance: 'important',
      insight: "E2E encryption significantly complicates message delivery, search, and multi-device sync",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "1.3 billion monthly active users, 300 million daily active users sending messages",
      importance: 'critical',
      learningPoint: "Messenger is one of the largest messaging platforms globally",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages are sent per day?",
      answer: "About 100 billion messages per day across all conversations",
      importance: 'critical',
      calculation: {
        formula: "100B ÷ 86,400 sec = 1,157,407 messages/sec",
        result: "~1.2M writes/sec (3.5M at peak)",
      },
      learningPoint: "Massive write volume requiring horizontal scaling and sharding",
    },
    {
      id: 'concurrent-connections',
      category: 'throughput',
      question: "How many users are actively connected at once?",
      answer: "During peak hours, about 100 million concurrent WebSocket connections are active",
      importance: 'critical',
      learningPoint: "WebSocket connection management is a major challenge at this scale",
    },
    {
      id: 'message-latency',
      category: 'latency',
      question: "How fast should message delivery be?",
      answer: "p99 under 200ms from send to delivery when both users are online. This is critical for feeling like a real conversation.",
      importance: 'critical',
      learningPoint: "Sub-second delivery requires WebSocket and efficient message routing",
    },
    {
      id: 'group-fan-out',
      category: 'burst',
      question: "What happens when someone sends a message to a 250-person group?",
      answer: "That one message needs to fan out to all 250 members in real-time. If 100 are online, they get WebSocket delivery instantly. The other 150 get it when they reconnect.",
      importance: 'critical',
      insight: "Large group messages create fan-out challenges similar to Discord",
    },
    {
      id: 'storage-retention',
      category: 'reliability',
      question: "How long should messages be stored?",
      answer: "Forever (or until user deletes). Users expect to scroll back through years of conversations. This isn't ephemeral messaging like Snapchat.",
      importance: 'critical',
      learningPoint: "Permanent storage means ever-growing database and backup requirements",
    },
    {
      id: 'media-uploads',
      category: 'payload',
      question: "What's the average size of media uploads?",
      answer: "Photos average 2MB, videos can be up to 100MB. About 30% of messages include media. For MVP, focus on text - media can use object storage later.",
      importance: 'important',
      insight: "Media handling requires separate storage infrastructure (S3, CDN)",
    },
    {
      id: 'multi-device',
      category: 'latency',
      question: "Can a user be logged in on multiple devices?",
      answer: "Yes! Same user on phone, tablet, and desktop should all receive messages in real-time. Read receipts should sync across devices too.",
      importance: 'important',
      learningPoint: "Multi-device sync adds complexity - need to track multiple WebSocket connections per user",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-messaging', 'real-time-delivery', 'group-chat'],
  criticalFRQuestionIds: ['core-messaging', 'group-chat'],
  criticalScaleQuestionIds: ['throughput-messages', 'concurrent-connections', 'message-latency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can send 1:1 messages',
      description: 'Private conversations between two people',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can create group chats',
      description: 'Conversations with up to 250 people',
      emoji: '👥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can view message history',
      description: 'Scroll through past conversations',
      emoji: '📜',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can react to messages',
      description: 'Quick emoji reactions to messages',
      emoji: '❤️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can make video calls',
      description: '1:1 video chat with WebRTC',
      emoji: '📹',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '300 million',
    writesPerDay: '100 billion messages',
    readsPerDay: 'N/A (real-time push)',
    peakMultiplier: 3,
    readWriteRatio: 'N/A (push-based)',
    calculatedWriteRPS: { average: 1157407, peak: 3472221 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~1KB (text message)',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~18PB',
    redirectLatencySLA: 'p99 < 200ms (message delivery)',
    createLatencySLA: 'p99 < 100ms (send)',
  },

  architecturalImplications: [
    '✅ Real-time delivery → WebSocket connections required',
    '✅ 100M concurrent connections → Gateway servers with connection pooling',
    '✅ 3.5M messages/sec peak → Sharded database by conversation_id',
    '✅ Group fan-out → Message queue for async delivery',
    '✅ Multi-device sync → Track multiple connections per user_id',
    '✅ Video calls → WebRTC signaling server',
  ],

  outOfScope: [
    'End-to-end encryption (use TLS only)',
    'Message requests/spam filtering',
    'Stories/ephemeral content',
    'Payment features (Facebook Pay)',
    'Chatbots and business messaging',
    'Message search (full-text search)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can send messages 1:1 and in groups. Real-time WebSocket delivery and scaling challenges come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💼',
  scenario: "Welcome to Social Messaging Corp! You're building the next Messenger.",
  hook: "Your first users want to start chatting with their friends!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your messaging platform is online!',
  achievement: 'Users can now connect to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle messages yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every messaging app starts with a **Client** connecting to a **Server**.

When a user opens Messenger:
1. Their device (mobile app, web browser) is the **Client**
2. It sends requests to your **App Server**
3. The server processes the request and sends back a response

For real-time messaging, we'll upgrade this to WebSocket later. But we start with basic HTTP.`,

  whyItMatters: 'Without this connection, users can\'t send or receive messages at all.',

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Handling 300 million daily active users',
    howTheyDoIt: 'Started as Facebook Chat in 2008, now uses a complex distributed gateway system with WebSocket servers globally',
  },

  keyPoints: [
    'Client = the user\'s device (mobile app, browser)',
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
  id: 'messenger-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Messenger', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles messages and conversations', displayName: 'App Server' },
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
  hook: "A user just tried to send 'Hey! How are you?' but got an error.",
  challenge: "Write the Python code to send messages, create groups, and fetch history.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle messages!',
  achievement: 'You implemented the core Messenger functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can send 1:1 messages', after: '✓' },
    { label: 'Can create groups', after: '✓' },
    { label: 'Can fetch history', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all messages are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Message Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Messenger, we need handlers for:
- \`send_message()\` - Send a message to a 1:1 or group conversation
- \`create_group()\` - Create a new group chat
- \`get_messages()\` - Fetch conversation history
- \`add_reaction()\` - React to a message with emoji

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'Facebook Messenger Outage',
    company: 'Facebook Messenger',
    year: '2019',
    whatHappened: 'A configuration change caused Messenger to be down for several hours globally. Users couldn\'t send or receive messages, causing widespread disruption.',
    lessonLearned: 'Start simple, but design for resilience. Test your core handlers thoroughly.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Sending 100 billion messages per day',
    howTheyDoIt: 'Message service uses custom protocols optimized for mobile, with sophisticated batching and compression',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (conversation not found, empty message, etc.)',
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
  id: 'messenger-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send 1:1 messages, FR-2: Create groups, FR-3: View history',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/messages, POST /api/v1/groups, GET /api/v1/messages APIs',
      'Open the Python tab',
      'Implement send_message(), create_group(), and get_messages() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for send_message, create_group, and get_messages',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/messages', 'POST /api/v1/groups', 'GET /api/v1/messages', 'POST /api/v1/reactions'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed at 3 AM...",
  hook: "When it came back online, ALL the messages were GONE! Users lost their entire conversation history.",
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
  nextTeaser: "But conversations are loading slowly as message history grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Messenger, we need tables for:
- \`users\` - User accounts
- \`conversations\` - 1:1 and group chats
- \`messages\` - All sent messages
- \`conversation_members\` - Who's in each conversation
- \`reactions\` - Emoji reactions to messages`,

  whyItMatters: 'Imagine losing all your conversations because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'WhatsApp Message Loss Incident',
    company: 'WhatsApp',
    year: '2018',
    whatHappened: 'A database issue caused some users to lose message history. WhatsApp spent days restoring data from backups while users panicked.',
    lessonLearned: 'Persistent storage with proper backups is non-negotiable. Database reliability is critical.',
    icon: '😱',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Storing 100 billion messages per day',
    howTheyDoIt: 'Uses sharded databases (HBase) partitioned by conversation_id for horizontal scaling',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose database based on access patterns',
    'Messenger uses NoSQL (HBase) for massive scale',
    'Partition by conversation_id for distributed storage',
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
    { title: 'SQL/NoSQL', explanation: 'Choose based on scale and access patterns', icon: '🗄️' },
    { title: 'Sharding', explanation: 'Split data across servers by key', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'messenger-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store messages, conversations, users permanently', displayName: 'Database' },
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
    level1: 'Drag a Database component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Fast Conversations
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million users, and conversations are loading slowly!",
  hook: "Users complain: 'Why does it take 2 seconds to open a chat?' Every request hits the database.",
  challenge: "Add a cache to make conversation loads lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Conversations load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Conversation load latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But what happens when millions of users connect simultaneously?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Messenger, we cache:
- **Recent messages** - Last 50-100 messages per conversation
- **Conversation metadata** - Group names, participants
- **User presence** - Who's online right now
- **Unread counts** - How many unread messages per conversation

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\``,

  whyItMatters: 'Users open conversations constantly. Without caching, every open would hammer the database.',

  famousIncident: {
    title: 'Messenger New Year\'s Eve Spike',
    company: 'Facebook Messenger',
    year: '2020',
    whatHappened: 'As midnight hit, message volume spiked 100x. Cache infrastructure held, preventing database overload. Without caching, the system would have crashed.',
    lessonLearned: 'Cache recent, frequently accessed data aggressively. It saves your database during traffic spikes.',
    icon: '🎆',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Serving billions of conversation loads per day',
    howTheyDoIt: 'Uses massive Memcache clusters to cache recent messages and metadata. Most conversation opens never touch the database.',
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
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Cache recent messages and conversation metadata',
  ],

  quickCheck: {
    question: 'What should Messenger cache for best performance?',
    options: [
      'All messages ever sent',
      'Recent messages and conversation metadata',
      'Only user profiles',
      'Nothing - databases are fast enough',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed data: recent messages (shown when opening chat) and conversation metadata.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'messenger-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: View message history (now loads fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache recent messages and conversation metadata', displayName: 'Redis Cache' },
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
// STEP 5: Add Load Balancer with WebSocket Support
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out handling WebSocket connections!",
  hook: "100,000 concurrent users are connected, and new users can't join. CPU is at 100%!",
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

  whyItMatters: 'Real-time messaging requires 100M+ concurrent WebSocket connections. No single server can handle that.',

  famousIncident: {
    title: 'Facebook Chat Launch Struggles',
    company: 'Facebook',
    year: '2008',
    whatHappened: 'When Facebook Chat launched, connection infrastructure couldn\'t handle demand. Users experienced frequent disconnects and message delays for months.',
    lessonLearned: 'Load balancers must handle connection storms gracefully. WebSocket sticky sessions are essential.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Handling 100M+ concurrent connections',
    howTheyDoIt: 'Uses custom load balancing with sticky sessions. Distributes WebSocket connections across thousands of servers.',
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
  id: 'messenger-step-5',
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
  scenario: "Your database crashed for 30 minutes this morning. Users couldn't chat.",
  hook: "No messages could be sent or retrieved. Revenue loss: $500,000 in advertising.",
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
  nextTeaser: "But we need message queues for reliable delivery...",
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

  whyItMatters: 'A single database is a single point of failure. For Messenger\'s 100B messages/day, downtime is catastrophic.',

  famousIncident: {
    title: 'Instagram and Facebook Outage',
    company: 'Facebook',
    year: '2021',
    whatHappened: 'A configuration change cascaded and took down Facebook, Instagram, and Messenger for 6 hours. Database failover didn\'t work as expected.',
    lessonLearned: 'Database replication is essential. Test failover regularly - it must be automatic and fast.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Zero tolerance for message loss',
    howTheyDoIt: 'Uses HBase with multi-region replication. Each message is stored on multiple servers across data centers.',
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
  id: 'messenger-step-6',
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
// STEP 7: Add Message Queue for Async Delivery
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📨',
  scenario: "A message sent to a 250-person group is taking 15 seconds!",
  hook: "Synchronous delivery to all members is blocking. Some users never receive the message.",
  challenge: "Add a message queue to handle async delivery and fan-out.",
  illustration: 'message-delay',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Messages are delivered instantly!',
  achievement: 'Async processing handles group fan-out efficiently',
  metrics: [
    { label: 'Message send latency', before: '15s', after: '<200ms' },
    { label: 'Group delivery', after: 'Instant fan-out' },
  ],
  nextTeaser: "But we need to handle media uploads...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Delivery and Fan-Out',
  conceptExplanation: `Message queues enable **async processing** so users don't wait.

When a message is sent to a group:
1. **Synchronous**: Save to database, return success ✓
2. **Async via Queue**:
   - Fan-out to all online group members via WebSocket
   - Store for offline members (delivered when they reconnect)
   - Update unread counts
   - Send push notifications

This is the **write-through, async fan-out** pattern.

For Messenger:
- Message saved immediately
- Background workers handle delivery
- Users see instant confirmation`,

  whyItMatters: 'Without queues, sending to a 250-person group would block until all are notified. User waits 15+ seconds!',

  famousIncident: {
    title: 'WhatsApp Message Delay',
    company: 'WhatsApp',
    year: '2017',
    whatHappened: 'Message queue infrastructure couldn\'t keep up with New Year\'s Eve traffic. Messages were delayed by hours in some regions.',
    lessonLearned: 'Queue processing must scale independently. Use multiple worker pools for different priorities.',
    icon: '🎆',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Delivering 100B messages per day',
    howTheyDoIt: 'Uses distributed queues for message fan-out. Workers handle WebSocket delivery to online users and push notifications to offline users.',
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
        │WebSocket │          │  Push    │        │  Unread  │
        │ Delivery │          │  Notify  │        │  Counts  │
        └──────────┘          └──────────┘        └──────────┘
`,

  keyPoints: [
    'Queue decouples message send from delivery',
    'User gets instant response - delivery happens async',
    'Workers handle WebSocket fan-out, push notifications',
    'Essential for large groups with many members',
  ],

  quickCheck: {
    question: 'Why use async processing for group message delivery?',
    options: [
      'It\'s cheaper',
      'User gets instant response while delivery happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the user doesn\'t wait. Message is saved instantly, delivery to hundreds of users happens in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Fan-Out', explanation: 'Delivering one message to many users', icon: '📡' },
  ],
};

const step7: GuidedStep = {
  id: 'messenger-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Group chats (now with async delivery)',
    taskDescription: 'Add a Message Queue for async delivery and fan-out',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle async delivery and group fan-out', displayName: 'Kafka' },
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
    level2: 'Connect App Server to Message Queue. This enables async delivery and fan-out.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Add Object Storage for Media
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📦',
  scenario: "Users want to share photos and videos, but your database is melting!",
  hook: "Storing 2MB photos in the database is causing performance issues and storage costs are skyrocketing.",
  challenge: "Add object storage for media files (photos, videos, voice messages).",
  illustration: 'storage-full',
};

const step8Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Media uploads are working perfectly!',
  achievement: 'Object storage handles unlimited media files',
  metrics: [
    { label: 'Media storage', after: 'Unlimited (S3)' },
    { label: 'Database size', before: 'Growing 500GB/day', after: 'Growing 10GB/day' },
  ],
  nextTeaser: "But we need a CDN for fast media delivery...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage for Media Files',
  conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (images, videos, audio)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy

Architecture:
- **Database**: Message metadata (text, sender, timestamp)
- **Object Storage**: Actual media files
- Media URL stored in database points to S3 object

When user sends photo:
1. Upload photo to S3, get URL
2. Save message with photo URL to database
3. Send message with URL to recipients
4. Recipients download from S3`,

  whyItMatters: 'Messenger handles billions of photos and videos. You can\'t store that in a database!',

  famousIncident: {
    title: 'iCloud Photo Outage',
    company: 'Apple',
    year: '2019',
    whatHappened: 'iCloud photo storage issues caused users to lose access to their photos for hours. Demonstrates the importance of reliable object storage.',
    lessonLearned: 'Object storage must be reliable and redundant. Use proven solutions like S3.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Storing billions of photos and videos',
    howTheyDoIt: 'Uses Facebook\'s custom storage (Haystack) optimized for photo storage. Started with off-the-shelf solutions.',
  },

  diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Upload photo
       ▼
┌──────────────┐     2. Store media     ┌─────────────────┐
│  App Server  │ ──────────────────▶   │  Object Storage │
└──────┬───────┘                        │     (S3)        │
       │                                └─────────────────┘
       │ 3. Save message with URL
       ▼
┌──────────────┐
│   Database   │  (media_url: "s3://bucket/photo123.jpg")
└──────────────┘
`,

  keyPoints: [
    'Object storage for media, database for metadata',
    'Store media URL in database, actual file in S3',
    'S3 handles replication and durability',
    'Dramatically reduces database size and cost',
  ],

  quickCheck: {
    question: 'Why not store photos directly in the database?',
    options: [
      'Databases can\'t store binary data',
      'It\'s too slow and expensive at scale',
      'It would violate privacy laws',
      'Photos must be public',
    ],
    correctIndex: 1,
    explanation: 'Databases CAN store binary, but it\'s not optimized for it. Queries slow down, storage costs balloon, backups become massive.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Scalable storage for large files', icon: '📦' },
    { title: 'URL Reference', explanation: 'Database stores link, not file', icon: '🔗' },
    { title: 'Separation', explanation: 'Metadata vs media separation', icon: '📊' },
  ],
};

const step8: GuidedStep = {
  id: 'messenger-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send messages with photos/videos',
    taskDescription: 'Add Object Storage for media files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store photos, videos, voice messages', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect App Server to Object Storage for media uploads',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: Add CDN for Fast Media Delivery
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in India are seeing 5-second delays loading photos!",
  hook: "Your servers are in US-East. International users experience terrible latency downloading media.",
  challenge: "Add a CDN to serve media from edge locations worldwide.",
  illustration: 'global-latency',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Media loads fast everywhere!',
  achievement: 'CDN delivers media globally with low latency',
  metrics: [
    { label: 'India photo latency', before: '5000ms', after: '100ms' },
    { label: 'Global edge locations', after: '200+' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN for Global Media Delivery',
  conceptExplanation: `A **CDN** (Content Delivery Network) caches static content at edge locations worldwide.

How it works:
1. First request: Edge fetches from origin (S3), caches it
2. Subsequent requests: Served from edge (< 50ms)

For Messenger media:
- Photos/videos cached at edges close to users
- Popular media (viral photos) cached globally
- Less popular media fetched on demand
- Dramatically reduces S3 bandwidth costs`,

  whyItMatters: 'Messenger has users worldwide. CDN makes media load fast everywhere, reducing latency from seconds to milliseconds.',

  famousIncident: {
    title: 'WhatsApp Status Media Delays',
    company: 'WhatsApp',
    year: '2018',
    whatHappened: 'During a CDN configuration issue, Status photos took 10+ seconds to load in some regions. Users thought WhatsApp was broken.',
    lessonLearned: 'CDN is critical for global apps. Multi-CDN strategies provide redundancy.',
    icon: '🌐',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Serving billions of media files daily',
    howTheyDoIt: 'Uses Facebook\'s global CDN with thousands of edge locations. 99%+ cache hit rate for popular content.',
  },

  diagram: `
User in India:
                                    ┌─────────────┐
┌──────────┐    50ms    ┌──────────┤  India Edge │
│   User   │◀──────────▶│   CDN    │    Cache    │
│  (India) │            │          └─────────────┘
└──────────┘            │
                        │ Cache miss?
                        │    ▼
                        │ ┌─────────────┐
                        │ │   Origin    │
                        └─│    (S3)     │
                          │   US-East   │
                          └─────────────┘
`,

  keyPoints: [
    'CDN caches media at edge locations globally',
    'Users get media from nearest edge (< 50ms)',
    'Origin (S3) only hit on cache miss',
    'Reduces bandwidth costs significantly',
  ],

  quickCheck: {
    question: 'What\'s the main benefit of a CDN for Messenger media?',
    options: [
      'Media is stored more securely',
      'Users get media from nearby servers, reducing latency',
      'Media is compressed automatically',
      'It\'s cheaper than S3',
    ],
    correctIndex: 1,
    explanation: 'CDN edges are geographically distributed. Users fetch from nearby edge instead of distant origin, dramatically reducing latency.',
  },

  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN server near users', icon: '🌐' },
    { title: 'Cache Hit', explanation: 'Media found at edge', icon: '✅' },
    { title: 'Origin', explanation: 'S3 - source of truth', icon: '📦' },
  ],
};

const step9: GuidedStep = {
  id: 'messenger-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send messages with fast media delivery',
    taskDescription: 'Add CDN for global media delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver media from edge locations', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Add a CDN component connected to Object Storage',
    level2: 'CDN serves as the public endpoint for media, S3 is the origin',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2 million.",
  hook: "The CFO says: 'Cut costs by 30% or we need to raise prices and lose users.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Messenger!',
  achievement: 'A scalable, cost-effective messaging platform',
  metrics: [
    { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
    { label: 'Message delivery', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '100M concurrent users' },
  ],
  nextTeaser: "You've mastered Messenger system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision servers
2. **Use spot/preemptible instances** - 60-90% cheaper for stateless workers
3. **Cache aggressively** - Reduce expensive database calls
4. **Auto-scale** - Scale down during off-hours (nights/weekends)
5. **Compress media** - Reduce storage and bandwidth costs
6. **Archive old messages** - Move to cheaper cold storage after 1 year

For Messenger:
- Auto-scale WebSocket servers based on connections
- Cache recent messages and conversations
- Compress photos before storage
- Use tiered storage for old messages`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it. Users won\'t pay high subscription fees.',

  famousIncident: {
    title: 'WhatsApp\'s $19B Acquisition',
    company: 'WhatsApp',
    year: '2014',
    whatHappened: 'Facebook bought WhatsApp for $19B partly because WhatsApp ran incredibly lean - 900M users with only 50 engineers. Their cost-optimized infrastructure was a major asset.',
    lessonLearned: 'At scale, even small optimizations save millions. Design for cost from day 1.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Facebook Messenger',
    scenario: 'Running at scale profitably',
    howTheyDoIt: 'Uses auto-scaling, aggressive caching, media compression, and tiered storage. Heavily optimized resource usage.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure',
    'Use auto-scaling to match demand',
    'Cache to reduce expensive operations',
    'Archive old data to cheaper storage',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for Messenger\'s usage pattern?',
    options: [
      'Use bigger servers',
      'Auto-scale and cache aggressively',
      'Delete old messages',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Auto-scaling matches capacity to demand, and caching reduces expensive DB operations. Both save significant costs without impacting users.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'messenger-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $500/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $500/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
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

export const messengerGuidedTutorial: GuidedTutorial = {
  problemId: 'messenger',
  title: 'Design Messenger',
  description: 'Build a messaging platform with 1:1 chat, group chat, video calls, and real-time delivery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '💼',
    hook: "You've been hired as Lead Engineer at Social Messaging Corp!",
    scenario: "Your mission: Build a Messenger-like platform that enables real-time messaging for hundreds of millions of users.",
    challenge: "Can you design a system that handles 100 billion messages per day with sub-200ms delivery?",
  },

  requirementsPhase: messengerRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

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
    'Object Storage',
    'CDN',
    'Group Chat Fan-Out',
    'Multi-Device Sync',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed Systems',
    'Chapter 11: Stream Processing',
    'Chapter 12: Data Systems',
  ],
};

export default messengerGuidedTutorial;
