import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Discord Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a real-time gaming chat platform like Discord.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, load balancing, queues, etc.)
 *
 * Key Concepts:
 * - WebSocket architecture for real-time messaging (DDIA Ch. 11)
 * - Binary encoding vs JSON (DDIA Ch. 4)
 * - Message fan-out to channel members
 * - Sticky sessions for WebSocket connections
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const discordRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time gaming chat platform like Discord",

  interviewer: {
    name: 'Alex Kim',
    role: 'Senior Engineer at Gaming Chat Inc.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-messaging',
      category: 'functional',
      question: "What's the core functionality users need from this platform?",
      answer: "Users want to:\n\n1. **Create and join servers** - Private communities for gaming groups\n2. **Send messages in channels** - Text channels for different topics\n3. **Real-time communication** - Messages appear instantly with no refresh needed",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Discord is about real-time, persistent group communication organized by servers and channels",
    },
    {
      id: 'voice-video',
      category: 'functional',
      question: "Do users need voice and video calls?",
      answer: "Yes! Voice channels are critical for gamers. Users can join a voice channel and talk with multiple people simultaneously. For the MVP, let's focus on text messaging. Voice/video adds significant complexity with WebRTC.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Voice is important but can be deferred - it requires different infrastructure (WebRTC, media servers)",
    },
    {
      id: 'server-channels',
      category: 'functional',
      question: "How are servers and channels organized?",
      answer: "A **server** is like a community. Within each server, you have:\n- **Text channels** - For different topics (#general, #memes, #gaming)\n- **Voice channels** - For real-time voice chat\n\nUsers can create servers, invite friends, and organize channels however they want.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "The hierarchy is: Server → Channels → Messages. This affects data modeling.",
    },
    {
      id: 'message-features',
      category: 'functional',
      question: "What features do messages need?",
      answer: "Messages should support:\n1. **Text** - The core content\n2. **File attachments** - Images, videos, files\n3. **Message history** - Scroll back to see old messages\n4. **Editing and deletion** - Fix typos or remove messages\n\nFor MVP, let's focus on text with basic message history. File attachments can come later.",
      importance: 'important',
      insight: "File uploads add complexity (storage, CDN, virus scanning) - good to defer",
    },
    {
      id: 'online-presence',
      category: 'functional',
      question: "Should users see who's online?",
      answer: "Absolutely! Gamers want to know who's available. Show online/offline/away status for all server members in real-time.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Online presence requires maintaining WebSocket connections and broadcasting status updates",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "150 million monthly active users, with 19 million daily active users sending messages",
      importance: 'critical',
      learningPoint: "Discord is one of the largest real-time messaging platforms globally",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages are sent per day?",
      answer: "About 4 billion messages per day across all servers and channels",
      importance: 'critical',
      calculation: {
        formula: "4B ÷ 86,400 sec = 46,296 messages/sec",
        result: "~46K writes/sec (140K at peak)",
      },
      learningPoint: "Extremely high write volume - real-time delivery is critical",
    },
    {
      id: 'concurrent-connections',
      category: 'throughput',
      question: "How many users are connected simultaneously?",
      answer: "At peak, around 5 million concurrent WebSocket connections need to be maintained",
      importance: 'critical',
      learningPoint: "WebSocket connections are stateful - this affects load balancing strategy",
    },
    {
      id: 'message-latency',
      category: 'latency',
      question: "How fast should messages appear for other users?",
      answer: "Sub-second delivery. When you send a message, everyone in the channel should see it within 100-200ms. This is critical for real-time gaming coordination.",
      importance: 'critical',
      learningPoint: "Real-time means WebSockets, not polling. HTTP request/response is too slow.",
    },
    {
      id: 'message-ordering',
      category: 'latency',
      question: "Do messages need to arrive in order?",
      answer: "Yes! Messages in a channel must appear in the exact order they were sent. Out-of-order messages would break conversations.",
      importance: 'critical',
      learningPoint: "Ordering is challenging in distributed systems - requires careful design",
    },
    {
      id: 'server-size',
      category: 'burst',
      question: "How large can a single server or channel get?",
      answer: "Some popular Discord servers have 1+ million members. A single message in a large channel might need to fan out to 10,000+ active users instantly.",
      importance: 'critical',
      insight: "Large channels create the fan-out problem - similar to Twitter celebrities",
    },
    {
      id: 'connection-reliability',
      category: 'latency',
      question: "What happens if a user's connection drops?",
      answer: "When they reconnect, they should see any messages they missed. No data loss. Reconnection should be fast and seamless.",
      importance: 'important',
      learningPoint: "Need message queuing and session resume capability",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-messaging', 'server-channels', 'message-latency'],
  criticalFRQuestionIds: ['core-messaging', 'server-channels'],
  criticalScaleQuestionIds: ['concurrent-connections', 'message-latency', 'server-size'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create and join servers',
      description: 'Create private communities with customizable settings',
      emoji: '🏰',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can create channels within servers',
      description: 'Organize conversations into text channels',
      emoji: '📝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can send messages in real-time',
      description: 'Messages appear instantly for all channel members',
      emoji: '💬',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can view message history',
      description: 'Scroll back through past conversations',
      emoji: '📜',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can see online presence',
      description: 'Know who is online, offline, or away',
      emoji: '🟢',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '19 million',
    writesPerDay: '4 billion messages',
    readsPerDay: '40 billion message deliveries',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 46296, peak: 138888 },
    calculatedReadRPS: { average: 462960, peak: 1388880 },
    maxPayloadSize: '~2KB (message with metadata)',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~730TB',
    redirectLatencySLA: 'p99 < 200ms (message delivery)',
    createLatencySLA: 'p99 < 100ms (send message)',
  },

  architecturalImplications: [
    '✅ Real-time messaging → WebSocket connections required',
    '✅ 5M concurrent connections → Need sticky sessions on load balancer',
    '✅ 140K messages/sec peak → Message queue for reliable delivery',
    '✅ Large channel fan-out → Need async processing for big servers',
    '✅ Message ordering → Sequence IDs and careful queue design',
    '✅ Online presence → Redis Pub/Sub for cross-gateway coordination',
  ],

  outOfScope: [
    'Voice and video calls (WebRTC)',
    'File uploads and CDN',
    'Emoji reactions',
    'Message threading',
    'Screen sharing',
    'Direct messages (1-on-1 chat)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create servers, channels, and send messages. WebSocket complexity and massive scaling challenges will come in later steps. Functionality first, then real-time optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎮',
  scenario: "Welcome to Gaming Chat Inc! You're building the next Discord.",
  hook: "A gaming clan wants to chat while playing together. They need a real-time platform!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Users can now connect to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting connections', after: '✓' },
  ],
  nextTeaser: "But the server can't handle servers and messages yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server for Real-Time Apps',
  conceptExplanation: `Every real-time application starts with a **Client** connecting to a **Server**.

For Discord:
1. The **Client** (desktop app, mobile app, web browser) connects to your **App Server**
2. Initially, this connection uses HTTP for API calls
3. Later, we'll upgrade to WebSockets for real-time messaging

This foundation supports all Discord operations:
- Creating servers and channels
- Sending messages
- Loading message history
- Managing user presence`,

  whyItMatters: 'Without this connection, gamers can\'t communicate. This is the foundation of real-time chat.',

  realWorldExample: {
    company: 'Discord',
    scenario: 'Handling 19 million daily active users',
    howTheyDoIt: 'Started with a simple Node.js server, now uses a complex distributed gateway system',
  },

  keyPoints: [
    'Client = the user\'s device (app, browser)',
    'App Server = your backend that handles logic',
    'HTTP for initial setup, WebSockets for real-time later',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s Discord app that sends requests', icon: '📱' },
    { title: 'App Server', explanation: 'Backend that processes chat logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for initial API calls', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'discord-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Discord', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles server/channel/message logic', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle Discord operations!",
  hook: "A user tried to create a server called 'Gaming Squad' but got an error.",
  challenge: "Write the Python code to create servers, channels, and send messages.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle Discord operations!',
  achievement: 'You implemented the core chat functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create servers', after: '✓' },
    { label: 'Can send messages', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all servers and messages are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Discord Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Discord, we need handlers for:
- \`create_server()\` - Create a new Discord server
- \`create_channel()\` - Create a channel within a server
- \`send_message()\` - Send a message to a channel
- \`get_messages()\` - Fetch message history

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'These handlers are the core of Discord. Without them, users can\'t communicate!',

  famousIncident: {
    title: 'Discord\'s Launch Day Crash',
    company: 'Discord',
    year: '2015',
    whatHappened: 'On launch day, Discord\'s simple handlers couldn\'t handle the unexpected surge of gamers. Servers crashed repeatedly as gaming communities flooded in.',
    lessonLearned: 'Start simple but design for growth. The handlers we write today will need to scale.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Handling 4 billion messages per day',
    howTheyDoIt: 'Uses Elixir/Erlang for message handling - built for concurrency and fault tolerance',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (server not found, invalid channel, etc.)',
    'Return proper success/error responses',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory never fails',
      'Databases are too expensive',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Database adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'REST API', explanation: 'HTTP endpoints for creating resources', icon: '🌐' },
  ],
};

const step2: GuidedStep = {
  id: 'discord-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create servers, FR-2: Create channels, FR-3: Send messages',
    taskDescription: 'Configure APIs and implement Python handlers for Discord operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/servers, POST /api/v1/channels, POST /api/v1/messages APIs',
      'Open the Python tab',
      'Implement create_server(), create_channel(), send_message() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_server, create_channel, and send_message',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          handledAPIs: [
            'POST /api/v1/servers',
            'POST /api/v1/channels',
            'POST /api/v1/messages',
            'GET /api/v1/messages'
          ]
        }
      },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed at 2 AM during a gaming session...",
  hook: "When it restarted, ALL servers, channels, and messages were GONE! 500 gaming communities lost their entire chat history.",
  challenge: "Add a database so data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your chat data is safe forever!',
  achievement: 'Messages and servers now persist across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But message delivery is slow as servers grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Chat',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Messages survive crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval and search

For Discord, we need tables for:
- \`servers\` - Discord server metadata
- \`channels\` - Channels within servers
- \`messages\` - All chat messages with timestamps
- \`users\` - User accounts and memberships`,

  whyItMatters: 'Imagine losing months of gaming strategy discussions because of a server restart. Communities would never trust your platform again!',

  famousIncident: {
    title: 'Slack\'s Database Incident',
    company: 'Slack',
    year: '2020',
    whatHappened: 'A database issue caused message delivery delays and some messages to disappear temporarily. Users panicked, thinking their work conversations were lost forever.',
    lessonLearned: 'Persistent, reliable storage is non-negotiable for chat platforms.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Storing 4 billion messages per day',
    howTheyDoIt: 'Uses Cassandra (later ScyllaDB) for message storage - partitioned by channel_id for horizontal scaling',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose database based on access patterns',
    'Discord uses NoSQL (Cassandra/ScyllaDB) for massive scale',
    'Partition by channel_id for distributed storage',
  ],

  quickCheck: {
    question: 'What happens to in-memory chat messages when a server restarts?',
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
    { title: 'Database', explanation: 'Persistent storage for messages', icon: '🗄️' },
    { title: 'Partitioning', explanation: 'Split data across servers by key', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'discord-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store servers, channels, messages permanently', displayName: 'Database' },
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
// STEP 4: Add Cache for Message History and Online Presence
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 100,000 active users, and loading message history takes 3+ seconds!",
  hook: "Gamers are complaining: 'Why is Discord so slow?' Every message fetch hits the database.",
  challenge: "Add a cache to make message history loads lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Messages load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Message load latency', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But WebSocket connections need special load balancing...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Discord with Redis',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Discord, we cache:
- **Recent message history** - Last 100 messages per channel
- **Online presence** - Who's online/offline/away
- **Channel metadata** - Server and channel info
- **User sessions** - Active WebSocket connections

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\``,

  whyItMatters: 'Discord users expect instant message loading. At 460K reads/sec peak, hitting the database for every request would melt it.',

  famousIncident: {
    title: 'Discord\'s Redis Pub/Sub Scaling',
    company: 'Discord',
    year: '2017',
    whatHappened: 'Discord used Redis Pub/Sub to coordinate presence updates across gateway servers. As they scaled to millions of users, Redis became a bottleneck.',
    lessonLearned: 'They optimized by batching presence updates and using Redis clusters with careful sharding.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Serving billions of message reads per day',
    howTheyDoIt: 'Uses Redis clusters to cache recent messages and online presence. Most reads never touch the main database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (95% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache recent messages (last 100 per channel)',
    'Cache online presence for real-time updates',
    'Use Redis for both caching and Pub/Sub coordination',
  ],

  quickCheck: {
    question: 'What happens during a cache miss for message history?',
    options: [
      'Return an error to the user',
      'Fetch from database and store in cache',
      'Wait for cache to be populated',
      'Show a loading spinner forever',
    ],
    correctIndex: 1,
    explanation: 'On cache miss: fetch from DB, return to user, AND store in cache for next time (cache-aside pattern).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'Redis Pub/Sub', explanation: 'Coordinate events across servers', icon: '📢' },
  ],
};

const step4: GuidedStep = {
  id: 'discord-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-4: View message history (now fast!), FR-5: Online presence',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache messages and presence for fast reads', displayName: 'Redis Cache' },
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
// STEP 5: Add Load Balancer with Sticky Sessions for WebSockets
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server crashed trying to handle 100,000 WebSocket connections!",
  hook: "A popular game just launched and everyone joined Discord at once. One server can't handle it.",
  challenge: "Add a load balancer with sticky sessions to distribute WebSocket connections.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'WebSocket connections are now distributed!',
  achievement: 'Load balancer with sticky sessions maintains real-time connections',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'WebSocket support', after: 'Sticky Sessions' },
  ],
  nextTeaser: "But we still need more reliability for our database...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing WebSockets: Sticky Sessions',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across app servers.

But WebSockets are different from HTTP:
- **HTTP**: Stateless, each request is independent
- **WebSocket**: Stateful, long-lived connections

For WebSockets, we need **sticky sessions** (session affinity):
- Same user always routes to the same app server
- Maintains WebSocket connection state
- Uses IP hash or session cookies for routing

Without sticky sessions, WebSocket connections break when requests hit different servers!`,

  whyItMatters: 'Discord needs to maintain 5 million concurrent WebSocket connections. Load balancing with sticky sessions is critical.',

  famousIncident: {
    title: 'Discord\'s WebSocket Scaling Challenge',
    company: 'Discord',
    year: '2016',
    whatHappened: 'As Discord grew, they struggled to scale WebSocket connections. Their Erlang-based gateway system needed careful load balancer configuration with sticky sessions.',
    lessonLearned: 'Sticky sessions are essential for WebSocket load balancing. They eventually built custom gateway routing.',
    icon: '🔌',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Handling 5M concurrent WebSocket connections',
    howTheyDoIt: 'Uses multiple gateway servers with sophisticated session routing. Each gateway handles ~50K connections.',
  },

  diagram: `
              ┌─────────────────┐
              │ App Server 1    │
              │ (WebSocket GW)  │
┌────────┐   ┌──────────────────┐   └─────────────────┘
│ Client │──▶│ Load Balancer   │──▶ App Server 2
└────────┘   │ (Sticky Session)│   ┌─────────────────┐
              └──────────────────┘   │ App Server 3    │
                                     └─────────────────┘

Note: Same user always goes to same server (sticky)
`,

  keyPoints: [
    'Load balancer distributes connections across servers',
    'Sticky sessions keep same user on same server',
    'Essential for maintaining WebSocket state',
    'Use IP hash or session cookie for routing',
  ],

  quickCheck: {
    question: 'Why do WebSockets need sticky sessions?',
    options: [
      'It makes connections faster',
      'WebSocket connections are stateful - need same server',
      'It reduces server load',
      'It\'s easier to configure',
    ],
    correctIndex: 1,
    explanation: 'WebSocket connections maintain state. If a user\'s messages hit different servers, the connection breaks. Sticky sessions ensure consistency.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across servers', icon: '⚖️' },
    { title: 'Sticky Sessions', explanation: 'Route user to same server every time', icon: '📌' },
    { title: 'WebSocket', explanation: 'Long-lived, stateful connection', icon: '🔌' },
  ],
};

const step5: GuidedStep = {
  id: 'discord-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Real-time messaging needs reliable load balancing',
    taskDescription: 'Add a Load Balancer with sticky sessions between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute WebSocket connections with sticky sessions', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
      'Sticky sessions configured',
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
    level2: 'Reconnect: Client → Load Balancer → App Server. Configure sticky sessions for WebSocket support.',
    solutionComponents: [{ type: 'load_balancer', config: { stickySession: true } }],
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
  scenario: "Your database crashed for 10 minutes during a major gaming tournament!",
  hook: "Users couldn't send or receive messages. Thousands of gamers were furious. Revenue loss: $100,000.",
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

  whyItMatters: 'A single database is a single point of failure. For Discord\'s billions of messages, downtime is not acceptable.',

  famousIncident: {
    title: 'Discord\'s Cassandra to ScyllaDB Migration',
    company: 'Discord',
    year: '2017',
    whatHappened: 'Discord outgrew Cassandra - garbage collection pauses caused message delays. They migrated to ScyllaDB (C++ rewrite of Cassandra) for better performance.',
    lessonLearned: 'Replication strategy matters. They use 3-way replication for durability and read scaling.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Zero tolerance for message loss',
    howTheyDoIt: 'Uses ScyllaDB with 3-way replication. Each message stored on 3 different servers in different racks.',
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
    'Use at least 3 replicas for high availability',
  ],

  quickCheck: {
    question: 'What happens if the primary database fails with replication enabled?',
    options: [
      'All messages are lost',
      'A replica is promoted to become the new primary',
      'All reads and writes fail',
      'The system automatically creates a new database',
    ],
    correctIndex: 1,
    explanation: 'With replication, a replica can be promoted to primary (failover), maintaining availability and preventing message loss.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'discord-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable message storage',
    taskDescription: 'Enable database replication with at least 3 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 3 or more',
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
    level2: 'Enable replication and set replicas to 3. This creates read copies of your messages.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 3 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Reliable Delivery and Fan-Out
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📢',
  scenario: "A message was sent to a channel with 10,000 active users!",
  hook: "Delivering that message to everyone synchronously takes too long. Some users see delays, others miss it entirely.",
  challenge: "Add a message queue to handle reliable delivery and fan-out to channel members.",
  illustration: 'message-fanout',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Messages are now reliably delivered!',
  achievement: 'Async processing handles large channel fan-out efficiently',
  metrics: [
    { label: 'Message delivery latency', before: '2s', after: '<200ms' },
    { label: 'Fan-out time', after: '<500ms for 10K users' },
  ],
  nextTeaser: "But our infrastructure is expensive to run...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Reliable Discord Messaging',
  conceptExplanation: `The **fan-out problem** happens when one message needs to reach many users:
- A message in a 10,000-member channel = 10,000 deliveries
- Synchronous delivery would timeout
- Users might disconnect and miss messages

**Solution: Message Queue**
1. User sends message → Immediately stored in DB
2. Message goes to queue → Return "Sent!" to user
3. Workers consume queue → Deliver to connected users
4. If user offline → Queue holds message until reconnect

This is the **reliable messaging** pattern from DDIA Chapter 11.`,

  whyItMatters: 'Without message queues, Discord can\'t guarantee delivery. Messages would be lost when users disconnect or servers crash.',

  famousIncident: {
    title: 'Discord Message Delivery Incident',
    company: 'Discord',
    year: '2018',
    whatHappened: 'During a major game launch, message queue throughput couldn\'t keep up with demand. Messages were delayed by minutes, frustrating millions of gamers.',
    lessonLearned: 'They scaled their message queue infrastructure and improved partition strategies.',
    icon: '⏱️',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Delivering 4 billion messages per day',
    howTheyDoIt: 'Uses message queues for fan-out. When you send a message, it\'s queued and workers deliver to all active channel members via WebSocket.',
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
                          │ Delivery Workers│
                          │ (background)    │
                          └────────┬────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐         ┌──────────┐         ┌──────────┐
        │ User 1   │         │ User 2   │         │ User 3   │
        │WebSocket │         │WebSocket │         │WebSocket │
        └──────────┘         └──────────┘         └──────────┘
`,

  keyPoints: [
    'Message queue decouples sending from delivery',
    'User gets instant "Sent!" confirmation',
    'Workers deliver to active users via WebSocket',
    'Queue holds messages for offline users',
  ],

  quickCheck: {
    question: 'Why use async delivery instead of synchronous fan-out?',
    options: [
      'It\'s cheaper',
      'User gets instant response while delivery happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the sender doesn\'t wait. Message is queued instantly, and delivery happens in the background. No timeouts!',
  },

  keyConcepts: [
    { title: 'Fan-Out', explanation: 'Distributing one message to many users', icon: '📡' },
    { title: 'Message Queue', explanation: 'Buffer for reliable async delivery', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that delivers messages', icon: '⚙️' },
  ],
};

const step7: GuidedStep = {
  id: 'discord-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Real-time messaging (now with reliable delivery)',
    taskDescription: 'Add a Message Queue for async message delivery and fan-out',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle reliable message delivery and fan-out', displayName: 'Message Queue' },
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
    level1: 'Drag a Message Queue component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables reliable async message delivery.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is concerned! Your monthly cloud bill is $600,000.",
  hook: "The CFO says: 'Cut costs by 30% or we need to reduce features.'",
  challenge: "Optimize your architecture to stay under budget while maintaining real-time performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Discord!',
  achievement: 'A scalable, cost-effective real-time chat platform',
  metrics: [
    { label: 'Monthly cost', before: '$600K', after: 'Under budget' },
    { label: 'Message delivery', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '5M concurrent connections' },
  ],
  nextTeaser: "You've mastered Discord system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Real-Time Performance and Budget',
  conceptExplanation: `System design isn't just about features - it's about **trade-offs**.

Cost optimization strategies for Discord:
1. **Right-size instances** - Match server size to actual load
2. **Cache aggressively** - Reduce database queries
3. **Auto-scale** - Scale down during low activity hours
4. **Optimize binary protocols** - Use ETF/MessagePack instead of JSON (smaller payloads)
5. **Archive old messages** - Move messages >1 year to cheaper cold storage

For Discord:
- Peak hours: Late afternoon/evening (gaming time)
- Low hours: Early morning (scale down)
- Cache recent messages (last 100 per channel)
- Archive messages older than 1 year`,

  whyItMatters: 'Building the best real-time chat means nothing if the company can\'t afford to run it. Discord must balance performance with cost.',

  famousIncident: {
    title: 'Discord\'s Move to ScyllaDB',
    company: 'Discord',
    year: '2017',
    whatHappened: 'Discord was struggling with Cassandra garbage collection pauses and costs. They migrated to ScyllaDB and saved significant infrastructure costs while improving performance.',
    lessonLearned: 'Sometimes the right database choice can improve both performance AND reduce costs.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Uses binary encoding (ETF) instead of JSON - 50% smaller payloads. Auto-scales gateway servers based on connection count. Archives old messages to cheaper storage.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Use binary encoding for smaller message payloads',
    'Cache recent messages aggressively',
    'Archive old messages to cold storage',
    'Auto-scale based on connection count',
  ],

  quickCheck: {
    question: 'What\'s an effective cost optimization for a real-time chat platform?',
    options: [
      'Delete old messages',
      'Use binary encoding instead of JSON for smaller payloads',
      'Reduce database replicas',
      'Remove caching',
    ],
    correctIndex: 1,
    explanation: 'Binary encoding (ETF, MessagePack) creates 30-50% smaller payloads than JSON, reducing bandwidth costs significantly at scale.',
  },

  keyConcepts: [
    { title: 'Binary Encoding', explanation: 'Compact message format (ETF, MessagePack)', icon: '0️⃣' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cold Storage', explanation: 'Cheaper storage for old messages', icon: '❄️' },
  ],
};

const step8: GuidedStep = {
  id: 'discord-step-8',
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
    level2: 'Consider: right-sized database replicas (3), optimized cache settings, efficient message queue config.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const discordGuidedTutorial: GuidedTutorial = {
  problemId: 'discord',
  title: 'Design Discord',
  description: 'Build a real-time gaming chat platform with servers, channels, and WebSocket messaging',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🎮',
    hook: "You've been hired as Lead Engineer at Gaming Chat Inc!",
    scenario: "Your mission: Build a Discord-like platform that can handle millions of gamers chatting in real-time across servers and channels.",
    challenge: "Can you design a system that handles WebSocket connections at massive scale?",
  },

  requirementsPhase: discordRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'WebSocket Connections',
    'Real-Time Messaging',
    'Database Design',
    'Caching',
    'Load Balancing with Sticky Sessions',
    'Database Replication',
    'Message Queues',
    'Message Fan-Out',
    'Online Presence',
    'Binary Encoding',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 4: Binary Encoding (ETF, MessagePack vs JSON)',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning (by channel_id)',
    'Chapter 11: Stream Processing & Message Queues',
  ],
};

export default discordGuidedTutorial;
