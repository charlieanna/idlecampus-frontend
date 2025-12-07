import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Telegram Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a cloud-based messaging platform like Telegram.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, load balancer, replication, queues, cost)
 *
 * Key Concepts:
 * - Cloud-based messaging (messages stored on servers)
 * - Massive groups (up to 200,000 members)
 * - Channels (broadcast to unlimited subscribers)
 * - File sharing and media delivery
 * - Bot platform
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const telegramRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a cloud-based messaging platform like Telegram",

  interviewer: {
    name: 'Maria Rodriguez',
    role: 'Principal Engineer at Secure Messaging Corp.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-messaging',
      category: 'functional',
      question: "What are the core features users need in a messaging platform?",
      answer: "Users need to:\n\n1. **Send messages** - Text messages to individuals and groups\n2. **Create groups** - Group chats with up to 200,000 members\n3. **Create channels** - Broadcast messages to unlimited subscribers\n4. **Share files** - Send photos, videos, documents (up to 2GB each)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Telegram is a cloud-based messenger - all messages stored on servers, accessible from any device",
    },
    {
      id: 'cloud-sync',
      category: 'functional',
      question: "How does Telegram's cloud-based messaging differ from WhatsApp?",
      answer: "**Cloud-based** means:\n- Messages stored on Telegram's servers (not just on your phone)\n- Access from any device (phone, tablet, desktop, web)\n- Message history syncs across all devices\n- No need for phone to be online\n\nUnlike WhatsApp which is phone-centric, Telegram is cloud-first.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Cloud storage enables multi-device access but requires more server infrastructure",
    },
    {
      id: 'groups-channels',
      category: 'functional',
      question: "What's the difference between groups and channels?",
      answer: "**Groups**: Two-way communication\n- Up to 200,000 members\n- Everyone can send messages\n- Discussion and collaboration\n\n**Channels**: One-way broadcast\n- Unlimited subscribers\n- Only admins can post\n- Used for news, announcements, content distribution",
      importance: 'critical',
      revealsRequirement: 'FR-2, FR-3',
      learningPoint: "Different use cases require different architectures - groups need fan-out, channels need broadcast",
    },
    {
      id: 'file-sharing',
      category: 'functional',
      question: "How do file uploads work? What's the size limit?",
      answer: "Telegram supports files up to **2GB** each:\n- Photos and videos with compression options\n- Documents (PDFs, ZIPs, etc.)\n- Files stored in the cloud forever\n- Fast streaming for videos\n\nThis is much larger than WhatsApp (100MB) or iMessage (100MB).",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Large file support requires CDN, chunked uploads, and significant storage",
    },
    {
      id: 'bots',
      category: 'functional',
      question: "Do we need to support bots?",
      answer: "Yes! Telegram bots are a key feature:\n- Automated accounts that respond to commands\n- Can be added to groups\n- API for developers to build custom bots\n\nFor MVP, let's focus on messaging. Bots can come later.",
      importance: 'nice-to-have',
      insight: "Bots are essentially API clients - good to defer for initial version",
    },
    {
      id: 'encryption',
      category: 'clarification',
      question: "What about security and encryption?",
      answer: "Telegram uses:\n- **Server-client encryption** for all messages\n- **Secret Chats** with end-to-end encryption (optional)\n\nFor MVP, assume basic server-side encryption. Secret chats add complexity with key exchange.",
      importance: 'nice-to-have',
      insight: "Security is important but complex - focus on core messaging first",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "700 million monthly active users, with 55 million daily active users sending messages",
      importance: 'critical',
      learningPoint: "Telegram is one of the largest messaging platforms globally",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages are sent per day?",
      answer: "About 2 billion messages per day across all chats",
      importance: 'critical',
      calculation: {
        formula: "2B ÷ 86,400 sec = 23,148 messages/sec",
        result: "~23K writes/sec (70K at peak)",
      },
      learningPoint: "High write volume with cloud storage requirement",
    },
    {
      id: 'throughput-files',
      category: 'throughput',
      question: "How many files are uploaded daily?",
      answer: "About 100 million files per day (photos, videos, documents). Average file size: 5MB",
      importance: 'critical',
      calculation: {
        formula: "100M files × 5MB = 500TB per day",
        result: "~500TB/day upload volume",
      },
      learningPoint: "File storage and delivery is a major infrastructure challenge",
    },
    {
      id: 'latency-messages',
      category: 'latency',
      question: "How fast should message delivery be?",
      answer: "Messages should arrive within 1-2 seconds. Telegram prioritizes reliability over instant delivery (unlike WhatsApp's sub-second target).",
      importance: 'important',
      learningPoint: "Telegram accepts slightly higher latency for better reliability and cloud features",
    },
    {
      id: 'groups-scale',
      category: 'burst',
      question: "How do super-large groups work with 200,000 members?",
      answer: "When someone sends a message to a 200K group:\n- Message is stored once in the database\n- Delivered to online members via push\n- Others fetch when they open the app\n\nThis is a massive fan-out challenge!",
      importance: 'critical',
      insight: "Large groups create the biggest scaling challenge - can't deliver to 200K users synchronously",
    },
    {
      id: 'channels-scale',
      category: 'burst',
      question: "How do channels handle unlimited subscribers?",
      answer: "Large channels have millions of subscribers. When a message is posted:\n- Stored once in the database\n- Pushed to recently active subscribers\n- Others see it when they check the channel\n\nNo synchronous delivery to all subscribers.",
      importance: 'critical',
      learningPoint: "Channels use a hybrid push/pull model for efficiency",
    },
    {
      id: 'multi-device',
      category: 'latency',
      question: "How fast do messages sync across devices?",
      answer: "When you send from phone, it should appear on desktop within 1-2 seconds. All devices stay in sync automatically.",
      importance: 'important',
      learningPoint: "Multi-device sync requires pub/sub coordination across user sessions",
    },
    {
      id: 'storage',
      category: 'reliability',
      question: "How long are messages and files stored?",
      answer: "Forever! Telegram stores all messages and files indefinitely in the cloud (unless user deletes them). This is a key feature - unlimited cloud storage.",
      importance: 'critical',
      learningPoint: "Permanent storage means database size grows forever - requires archival strategy",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-messaging', 'cloud-sync', 'groups-channels'],
  criticalFRQuestionIds: ['core-messaging', 'groups-channels'],
  criticalScaleQuestionIds: ['throughput-users', 'groups-scale', 'throughput-files'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can send messages',
      description: 'Send text messages to individuals and groups',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can create groups',
      description: 'Group chats with up to 200,000 members',
      emoji: '👥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can create channels',
      description: 'Broadcast messages to unlimited subscribers',
      emoji: '📢',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can share files',
      description: 'Upload and download files up to 2GB',
      emoji: '📎',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Multi-device sync',
      description: 'Access messages from any device with cloud sync',
      emoji: '☁️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '55 million',
    writesPerDay: '2 billion messages',
    readsPerDay: '20 billion message deliveries',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 23148, peak: 69444 },
    calculatedReadRPS: { average: 231480, peak: 694440 },
    maxPayloadSize: '2GB (files), ~2KB (messages)',
    storagePerRecord: '~1KB (message), ~5MB (avg file)',
    storageGrowthPerYear: '~730TB (messages) + ~180PB (files)',
    redirectLatencySLA: 'p99 < 2s (message delivery)',
    createLatencySLA: 'p99 < 1s (send message)',
  },

  architecturalImplications: [
    '✅ Cloud-based → Messages stored on servers, not client devices',
    '✅ Multi-device → Need session management and push notifications',
    '✅ 200K member groups → Async fan-out with message queues',
    '✅ Unlimited channels → Hybrid push/pull delivery model',
    '✅ 2GB files → CDN for file delivery, chunked uploads',
    '✅ 500TB/day uploads → Object storage (S3) and cleanup policies',
  ],

  outOfScope: [
    'Secret chats (end-to-end encryption)',
    'Voice/video calls',
    'Bots and bot API',
    'Stickers and animated GIFs',
    'Message reactions',
    'Stories feature',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can send messages and create groups. Cloud sync and massive group scaling will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to Secure Messaging Corp! You're building the next Telegram.",
  hook: "Your first users want to send messages and stay connected across all their devices!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your messaging platform is online!',
  achievement: 'Users can now connect to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting connections', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle messages yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every messaging app starts with a **Client** connecting to a **Server**.

For Telegram:
1. The **Client** (mobile app, desktop, web) sends requests to your **App Server**
2. Unlike WhatsApp (peer-to-peer), all messages go through Telegram's servers
3. This enables cloud storage and multi-device access

The client-server connection handles:
- Sending messages
- Creating groups and channels
- Uploading files
- Syncing across devices`,

  whyItMatters: 'Without this connection, users can\'t send messages or access their cloud-stored data.',

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Handling 55 million daily active users',
    howTheyDoIt: 'Uses a distributed server infrastructure across multiple data centers for reliability and speed',
  },

  keyPoints: [
    'Client = user\'s device (mobile, desktop, web)',
    'App Server = your backend that processes requests',
    'Cloud-based = messages stored on servers, not devices',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s Telegram app that sends requests', icon: '📱' },
    { title: 'App Server', explanation: 'Backend that handles messaging logic', icon: '🖥️' },
    { title: 'Cloud-Based', explanation: 'Messages stored on servers for multi-device access', icon: '☁️' },
  ],
};

const step1: GuidedStep = {
  id: 'telegram-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Telegram', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles messages, groups, channels', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle Telegram operations!",
  hook: "A user tried to send 'Hello, world!' but got an error.",
  challenge: "Write the Python code to send messages, create groups, and manage channels.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle messages!',
  achievement: 'You implemented the core Telegram functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can send messages', after: '✓' },
    { label: 'Can create groups', after: '✓' },
    { label: 'Can create channels', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all messages are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Message Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Telegram, we need handlers for:
- \`send_message()\` - Send a message to a user, group, or channel
- \`create_group()\` - Create a new group chat
- \`create_channel()\` - Create a broadcast channel
- \`upload_file()\` - Upload files to cloud storage

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just an empty shell. These functions are where the magic happens!',

  famousIncident: {
    title: 'Telegram\'s Rapid Growth Challenge',
    company: 'Telegram',
    year: '2014',
    whatHappened: 'When WhatsApp was acquired by Facebook, millions of users fled to Telegram overnight. Their servers struggled with the 10x surge in traffic and message volume.',
    lessonLearned: 'Start simple, but design for viral growth. Telegram had to rapidly scale their infrastructure.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Processing 2 billion messages per day',
    howTheyDoIt: 'Uses custom MTProto protocol with efficient binary encoding. Handlers optimized for speed and reliability.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (group not found, file too large, etc.)',
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
  id: 'telegram-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send messages, FR-2: Create groups, FR-3: Create channels',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/messages, POST /api/v1/groups, POST /api/v1/channels APIs',
      'Open the Python tab',
      'Implement send_message(), create_group(), create_channel() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for send_message, create_group, and create_channel',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/messages', 'POST /api/v1/groups', 'POST /api/v1/channels'] } },
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
  hook: "When it restarted, ALL messages were GONE! Users lost their entire chat history.",
  challenge: "Add a database so messages survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your messages are safe in the cloud!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But message delivery is getting slow as usage grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Cloud Storage with Databases',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Messages survive crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **Cloud storage**: Messages accessible from any device

For Telegram, we need tables for:
- \`users\` - User accounts and profiles
- \`messages\` - All messages with metadata
- \`groups\` - Group chats (up to 200K members)
- \`channels\` - Broadcast channels
- \`group_members\` - Who's in each group
- \`channel_subscribers\` - Who follows each channel`,

  whyItMatters: 'Telegram\'s key feature is cloud-based messaging. Without persistent storage, it\'s just another ephemeral chat app.',

  famousIncident: {
    title: 'Telegram DDoS and Data Center Outage',
    company: 'Telegram',
    year: '2015',
    whatHappened: 'A massive DDoS attack overwhelmed Telegram\'s infrastructure. Some data centers went offline, but messages were safe due to replication across multiple locations.',
    lessonLearned: 'Persistent, distributed storage with replication is essential for a cloud messaging platform.',
    icon: '🛡️',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Storing 2 billion messages per day permanently',
    howTheyDoIt: 'Uses distributed databases across multiple data centers. Messages are partitioned by user/chat ID for efficient retrieval.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Telegram uses distributed storage across data centers',
    'Messages are partitioned by chat ID for scalability',
    'Cloud storage enables multi-device access',
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
    { title: 'Database', explanation: 'Persistent storage for messages', icon: '🗄️' },
    { title: 'Partitioning', explanation: 'Split data across servers by key', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'telegram-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent cloud storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store messages, groups, channels permanently', displayName: 'Database' },
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
// STEP 4: Add Cache for Fast Message Retrieval
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million users, and loading chats takes 5+ seconds!",
  hook: "Users complain: 'Why is Telegram so slow?' Every message fetch hits the database.",
  challenge: "Add a cache to make message loading lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Messages load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Message load latency', before: '5000ms', after: '250ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But what happens when millions of users connect simultaneously?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Up Message Delivery',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For Telegram, we cache:
- **Recent messages** - Last 100 messages per chat
- **Group metadata** - Group names, member counts
- **User sessions** - Active device connections
- **Media thumbnails** - Quick preview images

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1-5ms) → Database (only if cache miss)
\`\`\``,

  whyItMatters: 'With 231K reads/sec at peak, hitting the database for every request would overwhelm it. Caching is essential.',

  famousIncident: {
    title: 'Telegram\'s Voice Message Feature Launch',
    company: 'Telegram',
    year: '2017',
    whatHappened: 'When voice messages launched, cache invalidation wasn\'t optimized. Users saw stale message counts and missed new messages until they refreshed.',
    lessonLearned: 'Cache invalidation is hard. Need proper TTL and invalidation strategies.',
    icon: '🎤',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Serving billions of message reads per day',
    howTheyDoIt: 'Uses in-memory caching at multiple levels: app servers, CDN, and client-side caching',
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
    'Cache recent messages for fast retrieval',
    'Set TTL to balance freshness and performance',
    'Use cache-aside pattern for reliability',
  ],

  quickCheck: {
    question: 'What should Telegram cache for best performance?',
    options: [
      'All messages ever sent',
      'Recent messages and frequently accessed chats',
      'Only user profiles',
      'Everything in the database',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed data: recent messages (temporal locality) and active chats (access patterns).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'telegram-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send messages (now with fast retrieval!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache recent messages and chat metadata', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds for messages)',
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
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out handling millions of requests!",
  hook: "CPU is at 100%, new users can't connect. The app is crashing!",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Traffic distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we still need database redundancy for high availability...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for High Availability',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across multiple app servers.

Benefits:
- **Horizontal scaling** - Add more servers to handle more traffic
- **No single point of failure** - If one server crashes, others continue
- **Better performance** - Each server handles fewer requests

For Telegram:
- Millions of users connecting simultaneously
- Need to distribute API calls across many servers
- Round-robin or least-connections algorithm`,

  whyItMatters: 'With 55M daily active users, no single server can handle all the traffic. Load balancing is essential for scale.',

  famousIncident: {
    title: 'Telegram\'s WhatsApp Migration Surge',
    company: 'Telegram',
    year: '2021',
    whatHappened: 'When WhatsApp announced privacy policy changes, 25 million new users joined Telegram in 72 hours. Load balancers helped distribute the surge across infrastructure.',
    lessonLearned: 'Load balancers enable horizontal scaling to handle viral growth.',
    icon: '🌊',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Handling millions of concurrent connections',
    howTheyDoIt: 'Uses multiple load balancers in different regions, routing users to nearest data center for low latency',
  },

  diagram: `
              ┌─────────────────┐
              │ App Server 1    │
┌────────┐   ┌──────────────────┐   └─────────────────┘
│ Client │──▶│  Load Balancer   │──▶ App Server 2
└────────┘   └──────────────────┘   ┌─────────────────┐
                                    │ App Server 3    │
                                    └─────────────────┘
`,

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Provides high availability (no single point of failure)',
    'Use health checks to detect failed servers',
  ],

  quickCheck: {
    question: 'What\'s the main benefit of a load balancer?',
    options: [
      'Makes requests faster',
      'Distributes traffic across multiple servers for scalability',
      'Reduces costs',
      'Encrypts data',
    ],
    correctIndex: 1,
    explanation: 'Load balancers enable horizontal scaling by distributing traffic. This prevents any single server from being overwhelmed.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '📈' },
    { title: 'High Availability', explanation: 'System stays up even if servers fail', icon: '🛡️' },
  ],
};

const step5: GuidedStep = {
  id: 'telegram-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing for high availability',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute requests across servers', displayName: 'Load Balancer' },
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
    level2: 'Reconnect: Client → Load Balancer → App Server. This enables traffic distribution.',
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
  scenario: "Your database crashed for 30 minutes this morning!",
  hook: "Millions of users couldn't send or receive messages. Revenue loss: $500,000.",
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
  nextTeaser: "But large group messages need async processing...",
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
- **Data safety**: Multiple copies of your messages
- **Geographic distribution**: Replicas in different regions`,

  whyItMatters: 'A single database is a single point of failure. For Telegram\'s 2B messages/day, downtime means millions of lost messages.',

  famousIncident: {
    title: 'Telegram Global Outage',
    company: 'Telegram',
    year: '2020',
    whatHappened: 'A database issue caused a 2-hour outage affecting users worldwide. The incident highlighted the importance of proper failover procedures.',
    lessonLearned: 'Database replication with automatic failover is essential. Test your failover procedures regularly.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Zero tolerance for message loss',
    howTheyDoIt: 'Uses multi-region database replication. Each message stored on 3+ servers in different data centers.',
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
    'Use at least 3 replicas for high availability',
    'Distribute replicas across data centers',
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
  id: 'telegram-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable data storage',
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
    level2: 'Enable replication and set replicas to 3. This creates read copies of your data.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 3 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Large Groups
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📢',
  scenario: "A message sent to a 200,000-member group is taking 30 seconds!",
  hook: "Large groups are broken. Messages timeout before reaching all members.",
  challenge: "Add a message queue to handle async delivery to large groups and channels.",
  illustration: 'message-delay',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Large group messages are delivered instantly!',
  achievement: 'Async processing handles fan-out to 200K members',
  metrics: [
    { label: 'Message send latency', before: '30s', after: '<1s' },
    { label: 'Fan-out time', after: 'Async (no blocking)' },
  ],
  nextTeaser: "But infrastructure costs are getting out of hand...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Handling Massive Group Fan-Out',
  conceptExplanation: `The **fan-out problem** for Telegram's 200K groups:
- A message in a 200,000-member group = 200,000 deliveries
- Synchronous delivery would timeout
- Users would see delays or missed messages

**Solution: Message Queue**
1. User sends message → Immediately stored in DB
2. Message goes to queue → Return "Sent!" to user
3. Workers consume queue → Deliver to online members
4. For offline users → Queue holds until they come online

This is the **write-through, async fan-out** pattern.`,

  whyItMatters: 'Without message queues, large groups and channels wouldn\'t work. No way to deliver to 200K users synchronously!',

  famousIncident: {
    title: 'Telegram Groups Limit Increase',
    company: 'Telegram',
    year: '2019',
    whatHappened: 'When Telegram increased group limits from 100K to 200K members, their message queue infrastructure needed significant upgrades to handle the doubled fan-out.',
    lessonLearned: 'Async processing with queues is essential for large group messaging.',
    icon: '👥',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Delivering to 200,000-member groups',
    howTheyDoIt: 'Uses message queues to async-deliver to online members. Offline members fetch when they open the app.',
  },

  diagram: `
User Sends to 200K Group
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
                                   │ Fan-out to online users
                                   ▼
                          200,000 members (async)
`,

  keyPoints: [
    'Queue decouples message send from delivery',
    'User gets instant "Sent!" confirmation',
    'Workers deliver to online members asynchronously',
    'Offline users fetch messages when they reconnect',
  ],

  quickCheck: {
    question: 'Why use async delivery for 200K-member groups?',
    options: [
      'It\'s cheaper',
      'User gets instant response while delivery happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the sender doesn\'t wait for 200K deliveries. Message is saved instantly, delivery happens in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async message delivery', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that delivers messages', icon: '⚙️' },
    { title: 'Fan-Out', explanation: 'Delivering one message to many users', icon: '📡' },
  ],
};

const step7: GuidedStep = {
  id: 'telegram-step-7',
  stepNumber: 7,
  frIndex: 1,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Large groups (now with async delivery), FR-3: Channels',
    taskDescription: 'Add a Message Queue for async delivery to large groups and channels',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle async delivery to 200K group members', displayName: 'Message Queue' },
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
    level2: 'Connect App Server to Message Queue. This enables async large group delivery.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $800,000.",
  hook: "The CFO says: 'Cut costs by 30% or we need to raise prices.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Telegram!',
  achievement: 'A scalable, cost-effective cloud messaging platform',
  metrics: [
    { label: 'Monthly cost', before: '$800K', after: 'Under budget' },
    { label: 'Message delivery', after: '<2s' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '200K member groups' },
  ],
  nextTeaser: "You've mastered Telegram system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Features and Budget',
  conceptExplanation: `System design isn't just about features - it's about **trade-offs**.

Cost optimization strategies for Telegram:
1. **Right-size instances** - Don't over-provision servers
2. **Cache aggressively** - Reduce database queries (90%+ cache hit rate)
3. **Object storage for files** - S3 cheaper than database for 2GB files
4. **Archive old messages** - Move messages >1 year to cold storage
5. **CDN for file delivery** - Reduce bandwidth costs
6. **Compression** - Use binary protocols (MTProto) instead of JSON

For Telegram:
- Most users access recent messages (cache these)
- Large files stored in S3, served via CDN
- Old messages archived to cheap cold storage`,

  whyItMatters: 'Building the best messenger means nothing if the company can\'t afford to run it. Users won\'t pay $20/month for messaging.',

  famousIncident: {
    title: 'Telegram\'s Free Service Model',
    company: 'Telegram',
    year: '2013-present',
    whatHappened: 'Telegram has operated as a free service funded by founder Pavel Durov. Cost optimization is critical to sustainability. They use efficient binary protocols and aggressive caching.',
    lessonLearned: 'Efficiency matters. Smart architecture can serve millions of users at reasonable cost.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Running at massive scale as free service',
    howTheyDoIt: 'Uses MTProto binary protocol (smaller than JSON), aggressive caching, CDN for files, and efficient server infrastructure.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Cache recent messages (90%+ hit rate)',
    'Use CDN for file delivery',
    'Archive old messages to cold storage',
    'Binary protocols reduce bandwidth costs',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for Telegram\'s file sharing?',
    options: [
      'Delete files after 30 days',
      'Use CDN for file delivery and S3 for storage',
      'Reduce file size limit to 100MB',
      'Store files in database',
    ],
    correctIndex: 1,
    explanation: 'S3 object storage is cheap for large files, and CDN reduces bandwidth costs by caching files near users.',
  },

  keyConcepts: [
    { title: 'CDN', explanation: 'Content Delivery Network for fast file access', icon: '🌐' },
    { title: 'Object Storage', explanation: 'S3 for cheap, scalable file storage', icon: '🗂️' },
    { title: 'Cold Storage', explanation: 'Archive old data to cheaper storage', icon: '❄️' },
  ],
};

const step8: GuidedStep = {
  id: 'telegram-step-8',
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
    level2: 'Consider: right-sized replicas (3), optimized cache TTL, efficient queue config. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const telegramGuidedTutorial: GuidedTutorial = {
  problemId: 'telegram',
  title: 'Design Telegram',
  description: 'Build a cloud-based messaging platform with groups, channels, and file sharing',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🚀',
    hook: "You've been hired as Lead Engineer at Secure Messaging Corp!",
    scenario: "Your mission: Build a Telegram-like platform that handles cloud-based messaging for millions of users with massive groups and unlimited file sharing.",
    challenge: "Can you design a system that handles 200,000-member groups and 2GB file transfers?",
  },

  requirementsPhase: telegramRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Cloud-Based Messaging',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Message Queues',
    'Fan-Out Pattern',
    'Large Group Messaging',
    'File Storage and CDN',
    'Multi-Device Sync',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning (by user/chat ID)',
    'Chapter 8: Distributed Data Challenges',
    'Chapter 11: Stream Processing & Message Queues',
  ],
};

export default telegramGuidedTutorial;
