import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * WhatsApp Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a messaging platform like WhatsApp.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, load balancer, replication, queues, cost)
 *
 * Key Concepts:
 * - 1:1 and group messaging
 * - End-to-end encryption
 * - Message delivery status
 * - Media sharing
 * - Real-time communication
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const whatsappRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a messaging platform like WhatsApp",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Principal Engineer at Global Messaging Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-messaging',
      category: 'functional',
      question: "What are the core features users need in a messaging platform?",
      answer: "Users need to:\n\n1. **Send 1:1 messages** - Private conversations between two people\n2. **Create group chats** - Conversations with up to 256 people\n3. **See delivery status** - Sent (✓), Delivered (✓✓), Read (✓✓ blue)\n4. **Share media** - Photos, videos, voice messages\n5. **Know who's online** - See last seen and online status",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "WhatsApp is about simple, reliable, real-time 1:1 and group communication",
    },
    {
      id: 'encryption',
      category: 'functional',
      question: "How important is message privacy and security?",
      answer: "**Critical!** WhatsApp uses **end-to-end encryption** (E2EE):\n- Messages are encrypted on sender's device\n- Only recipient can decrypt them\n- Not even WhatsApp servers can read messages\n- Uses Signal Protocol for encryption\n\nFor MVP, we'll focus on basic encryption. Full E2EE implementation is complex.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Privacy is a core feature, not an afterthought. E2EE changes architecture.",
    },
    {
      id: 'real-time',
      category: 'functional',
      question: "How quickly should messages be delivered?",
      answer: "Messages should appear **instantly** (within 100-200ms). WhatsApp is a real-time chat app. Users expect immediate delivery when both parties are online.",
      importance: 'critical',
      revealsRequirement: 'NFR-1',
      learningPoint: "Real-time delivery requires persistent connections (WebSocket), not polling",
    },
    {
      id: 'group-chats',
      category: 'functional',
      question: "How do group chats work? How large can they be?",
      answer: "**Group chats** support:\n- Up to 256 members per group\n- Anyone can create a group\n- Admin controls (add/remove members, change settings)\n- All members see all messages\n- Group metadata (name, icon, description)\n\nFor MVP, let's support groups up to 100 members.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Groups require message fan-out to multiple recipients - different from 1:1",
    },
    {
      id: 'media-sharing',
      category: 'functional',
      question: "Can users share more than text messages?",
      answer: "Yes! Users can share:\n1. **Images** - Compressed for mobile data efficiency\n2. **Videos** - With size limits (16MB originally, now 2GB)\n3. **Voice messages** - Record and send audio\n4. **Documents** - PDFs, spreadsheets, etc.\n\nFor MVP, focus on text and images. Other media can come later.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      insight: "Media requires separate storage and CDN - different from message text",
    },
    {
      id: 'delivery-status',
      category: 'functional',
      question: "How do delivery status indicators work?",
      answer: "Three-tier status system:\n1. **Sent (✓)** - Message left your device, received by server\n2. **Delivered (✓✓)** - Message delivered to recipient's device\n3. **Read (✓✓ blue)** - Recipient opened the chat and saw the message\n\nThis requires acknowledgments at each step.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      insight: "Status tracking requires bidirectional communication and ACK messages",
    },
    {
      id: 'offline-support',
      category: 'clarification',
      question: "What happens when a user is offline?",
      answer: "Messages must be **queued** and delivered when they come online:\n- Server stores messages for offline users\n- When user reconnects, queued messages are delivered\n- Messages stored up to 30 days\n\nThis is critical for mobile users with intermittent connectivity.",
      importance: 'critical',
      insight: "Offline support requires message queuing and persistent storage per user",
    },
    {
      id: 'notifications',
      category: 'clarification',
      question: "Should users get notifications for new messages?",
      answer: "Yes! Push notifications are essential:\n- **Push notifications** when app is in background\n- Show sender and preview (if not encrypted preview)\n- Badge counts for unread messages\n\nFor MVP, we can defer this. Focus on message delivery first.",
      importance: 'nice-to-have',
      insight: "Push notifications require integration with Apple/Google push services",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "2 billion monthly active users globally. About 100 million daily active users in a major region like US/Europe.",
      importance: 'critical',
      learningPoint: "WhatsApp is one of the largest messaging platforms - massive scale",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages are sent per day?",
      answer: "About 100 billion messages per day globally",
      importance: 'critical',
      calculation: {
        formula: "100B ÷ 86,400 sec = 1,157,407 messages/sec",
        result: "~1.2M writes/sec (3.5M at peak)",
      },
      learningPoint: "Extremely high throughput - requires massive horizontal scaling",
    },
    {
      id: 'throughput-media',
      category: 'throughput',
      question: "How much media is shared?",
      answer: "About 4.5 billion images and 1 billion videos shared per day. Average image size: 200KB, video: 2MB.",
      importance: 'critical',
      calculation: {
        formula: "4.5B × 200KB + 1B × 2MB = 900TB + 2000TB = 2.9PB/day",
        result: "~2.9PB of media storage per day",
      },
      learningPoint: "Media storage dominates infrastructure costs - need CDN and compression",
    },
    {
      id: 'group-fanout',
      category: 'burst',
      question: "What happens when someone sends a message to a 100-member group?",
      answer: "The message must be delivered to all 100 members. If 50 are online, they get it instantly via WebSocket. The other 50 get it when they come online.",
      importance: 'critical',
      insight: "Group messages require fan-out to all members - multiplies delivery work",
    },
    {
      id: 'latency-delivery',
      category: 'latency',
      question: "How fast should messages be delivered?",
      answer: "p99 under 200ms for online users. Offline users get messages when they reconnect (no time limit).",
      importance: 'critical',
      learningPoint: "Sub-200ms requires efficient routing and persistent WebSocket connections",
    },
    {
      id: 'latency-media',
      category: 'latency',
      question: "How fast should images and videos load?",
      answer: "Images should load in under 1 second, even on slower mobile networks. Videos can take a bit longer but should start playing within 2-3 seconds.",
      importance: 'important',
      learningPoint: "Media requires CDN with edge locations worldwide for low latency",
    },
    {
      id: 'persistence',
      category: 'reliability',
      question: "Do messages need to be stored permanently?",
      answer: "Yes! Messages are stored permanently on user devices and on servers (for offline delivery). Users can scroll back through years of chat history.",
      importance: 'critical',
      learningPoint: "Permanent storage of billions of messages requires efficient database sharding",
    },
    {
      id: 'availability',
      category: 'reliability',
      question: "What's the uptime requirement?",
      answer: "WhatsApp aims for 99.99% uptime (52 minutes downtime per year). Messaging is critical infrastructure for billions - downtime affects lives.",
      importance: 'critical',
      learningPoint: "High availability requires redundancy, replication, and automatic failover",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-messaging', 'real-time', 'encryption'],
  criticalFRQuestionIds: ['core-messaging', 'group-chats'],
  criticalScaleQuestionIds: ['throughput-users', 'throughput-messages', 'latency-delivery'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can send 1:1 messages',
      description: 'Private real-time text messaging between two users',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can create group chats',
      description: 'Group conversations with up to 100 members',
      emoji: '👥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Message delivery status',
      description: 'Track sent, delivered, and read status',
      emoji: '✓',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Share media (images)',
      description: 'Upload and share images in conversations',
      emoji: '📸',
    },
    {
      id: 'fr-5',
      text: 'FR-5: End-to-end encryption',
      description: 'Messages encrypted so only sender and recipient can read',
      emoji: '🔐',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million (per region)',
    writesPerDay: '100 billion messages',
    readsPerDay: 'N/A (real-time push)',
    peakMultiplier: 3,
    readWriteRatio: 'N/A (push-based)',
    calculatedWriteRPS: { average: 1157407, peak: 3472221 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~1KB (text message), 200KB (image avg)',
    storagePerRecord: '~500 bytes (message), 200KB (image)',
    storageGrowthPerYear: '~1 Exabyte (1000 PB)',
    redirectLatencySLA: 'p99 < 200ms (message delivery)',
    createLatencySLA: 'p99 < 200ms (send)',
  },

  architecturalImplications: [
    '✅ Real-time delivery → WebSocket connections required',
    '✅ 100M+ concurrent connections → Need massive connection pooling',
    '✅ Offline users → Message queue per user for pending messages',
    '✅ Message history → Database sharded by user_id or conversation_id',
    '✅ Media storage → CDN with global edge locations',
    '✅ E2E encryption → Encryption/decryption on client, key exchange protocol',
  ],

  outOfScope: [
    'Voice/video calls',
    'Status updates (stories)',
    'WhatsApp Business features',
    'Multi-device sync',
    'Message editing/deletion',
    'Stickers and GIFs',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can send 1:1 messages. Real-time delivery, encryption, and scaling challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📱',
  scenario: "Welcome to Global Messaging Inc! You've been hired to build the next WhatsApp.",
  hook: "Your first users want to send messages to each other!",
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
  conceptExplanation: `Every messaging app starts with a **Client** connecting to a **Server**.

When a user opens WhatsApp:
1. Their mobile device (iPhone, Android) is the **Client**
2. It sends requests to your **App Server**
3. The server processes the request and sends back a response

For real-time messaging, we'll upgrade this to WebSocket later. But we start with basic HTTP.`,

  whyItMatters: 'Without this connection, users can\'t send or receive messages at all.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Handling 100 million daily active users',
    howTheyDoIt: 'Started with simple Erlang servers in 2009, now uses a distributed system with servers worldwide',
  },

  keyPoints: [
    'Client = the user\'s mobile device (iPhone, Android)',
    'App Server = your backend that processes messages',
    'HTTP = the initial protocol (we\'ll upgrade to WebSocket later)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s mobile device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles message logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'whatsapp-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing WhatsApp', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles messages and groups', displayName: 'App Server' },
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
  hook: "A user just tried to send 'Hey there!' but got an error.",
  challenge: "Write the Python code to send messages, create groups, and handle delivery status.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle messages!',
  achievement: 'You implemented the core WhatsApp functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can send 1:1 messages', after: '✓' },
    { label: 'Can create groups', after: '✓' },
    { label: 'Can track delivery status', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all messages are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Message Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For WhatsApp, we need handlers for:
- \`send_message()\` - Send a 1:1 or group message
- \`create_group()\` - Create a new group chat
- \`update_status()\` - Update message delivery/read status

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the messaging magic happens!',

  famousIncident: {
    title: 'WhatsApp\'s 24-Hour Outage',
    company: 'WhatsApp',
    year: '2014',
    whatHappened: 'WhatsApp went down for nearly 4 hours on February 22, 2014, affecting 450 million users. Poor message routing caused cascading failures.',
    lessonLearned: 'Start simple, but design for growth. The handlers we write today will evolve as we scale.',
    icon: '📶',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Sending messages',
    howTheyDoIt: 'Message service handles ~1.2M messages/second globally, using Erlang for real-time delivery',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (user offline, group not found, etc.)',
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
  id: 'whatsapp-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send 1:1 messages, FR-2: Create groups, FR-3: Delivery status',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/messages, POST /api/v1/groups, PUT /api/v1/status APIs',
      'Open the Python tab',
      'Implement send_message(), create_group(), and update_status() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for send_message, create_group, and update_status',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/messages', 'POST /api/v1/groups', 'PUT /api/v1/status'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL the messages were GONE! Users lost their entire chat history.",
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
  nextTeaser: "But active conversations are getting slow as message history grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For WhatsApp, we need tables for:
- \`users\` - User accounts and profiles
- \`conversations\` - 1:1 and group conversations
- \`messages\` - All sent messages
- \`group_members\` - Who's in each group
- \`delivery_status\` - Message delivery tracking`,

  whyItMatters: 'Imagine losing all your WhatsApp conversations because of a server restart. Years of memories and important info would vanish!',

  famousIncident: {
    title: 'WhatsApp Message Loss Incident',
    company: 'WhatsApp',
    year: '2015',
    whatHappened: 'A database failure caused some users to lose message history. WhatsApp had to restore from backups, and some recent messages were permanently lost.',
    lessonLearned: 'Persistent storage with proper backups is non-negotiable. Messages are precious user data.',
    icon: '💔',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Storing 100 billion messages per day',
    howTheyDoIt: 'Uses sharded databases with message data distributed by user_id. Each shard handles millions of users.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL/MySQL) for structured data like messages',
    'Connect App Server to Database for read/write operations',
    'Shard by user_id for horizontal scalability',
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
  id: 'whatsapp-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store messages, users, groups permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Message Retrieval
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million users, and conversations are loading slowly!",
  hook: "Users complain: 'Why does it take 2 seconds to open a chat?' Every message fetch hits the database.",
  challenge: "Add a cache to make recent messages and user data lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Conversations load 15x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Chat load latency', before: '2000ms', after: '130ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But what happens when millions of users connect simultaneously?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For WhatsApp, we cache:
- **Recent messages** - Last 100 messages per conversation
- **User profiles** - Display name, photo, online status
- **Group metadata** - Group name, members list
- **Delivery status** - Quick lookups for read receipts

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\``,

  whyItMatters: 'Users open chats constantly. Without caching, every chat open would hammer the database with queries.',

  famousIncident: {
    title: 'WhatsApp New Year\'s Eve Overload',
    company: 'WhatsApp',
    year: '2016',
    whatHappened: 'On New Year\'s Eve, WhatsApp saw record message volume. Database couldn\'t keep up with profile and status lookups. Many users saw delays.',
    lessonLearned: 'Cache frequently accessed data aggressively. User profiles and recent messages are perfect for caching.',
    icon: '🎆',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Serving millions of chat opens per minute',
    howTheyDoIt: 'Uses Redis clusters to cache recent messages and user data. Most chat opens never touch the database.',
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
    'Cache recent messages and user profiles',
  ],

  quickCheck: {
    question: 'What should WhatsApp cache for best performance?',
    options: [
      'All messages ever sent',
      'Recent messages and user profiles',
      'Only encryption keys',
      'Media files',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed data: recent messages (shown on chat open) and user profiles (shown in every conversation).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'whatsapp-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can send messages (now loads fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache recent messages and user profiles', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (600 seconds for message data)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 600 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer with WebSocket Support
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out handling WebSocket connections!",
  hook: "10,000 concurrent users are connected, and new users can't join. CPU is at 100%!",
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
- Uses consistent hashing or user_id-based routing

Why sticky sessions?
- WebSocket is a stateful, long-lived connection
- Can't switch servers mid-conversation
- Server maintains the socket state and encryption context`,

  whyItMatters: 'Real-time messaging requires millions of concurrent WebSocket connections. No single server can handle that scale.',

  famousIncident: {
    title: 'WhatsApp Connection Spike',
    company: 'WhatsApp',
    year: '2018',
    whatHappened: 'During a major world event, millions tried to connect simultaneously. Load balancers couldn\'t handle the sudden spike, causing connection failures.',
    lessonLearned: 'Load balancers must handle connection storms gracefully. Use connection rate limiting and auto-scaling.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Handling 100M+ concurrent connections globally',
    howTheyDoIt: 'Uses HAProxy and custom load balancing with sticky sessions. Distributes WebSocket connections across thousands of servers.',
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
    'Use user_id-based routing or consistent hashing',
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
    explanation: 'WebSocket maintains a long-lived, stateful connection. The server holds the socket state and encryption keys, so users must stay on the same server.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across servers', icon: '⚖️' },
    { title: 'Sticky Session', explanation: 'User stays on same server', icon: '📌' },
    { title: 'WebSocket', explanation: 'Real-time bidirectional connection', icon: '🔌' },
  ],
};

const step5: GuidedStep = {
  id: 'whatsapp-step-5',
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
  scenario: "Your database crashed for 20 minutes this morning. Users couldn't communicate.",
  hook: "No messages could be sent or retrieved. Businesses lost critical communication.",
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
  nextTeaser: "But we need message queues to handle offline users...",
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

  whyItMatters: 'A single database is a single point of failure. For WhatsApp\'s 100B messages/day, downtime means people can\'t communicate.',

  famousIncident: {
    title: 'WhatsApp Global Outage',
    company: 'WhatsApp',
    year: '2021',
    whatHappened: 'Facebook (WhatsApp\'s parent) had a BGP routing issue that took down all services for 6 hours. WhatsApp was completely unreachable worldwide.',
    lessonLearned: 'Database replication alone isn\'t enough - need geographic redundancy and proper failover mechanisms.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Zero tolerance for message loss',
    howTheyDoIt: 'Uses multi-region database replication. Each message is stored on at least 3 servers across different data centers.',
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
  id: 'whatsapp-step-6',
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
// STEP 7: Add Message Queue for Offline Users
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📨',
  scenario: "Users in a group chat are complaining about massive delays!",
  hook: "When someone sends a message to a 100-member group, it takes 15 seconds for everyone to get it.",
  challenge: "Add a message queue to handle async delivery to offline users and group fan-out.",
  illustration: 'message-delay',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Messages are delivered instantly!',
  achievement: 'Async processing handles offline users and group fan-out',
  metrics: [
    { label: 'Message send latency', before: '15s', after: '<200ms' },
    { label: 'Offline delivery', after: 'Queued' },
  ],
  nextTeaser: "But the infrastructure costs are getting too high...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Handling Offline Users and Groups',
  conceptExplanation: `Message queues enable **async processing** so users don't wait.

When a message is sent:
1. **Synchronous**: Save to database, return success ✓
2. **Async via Queue**:
   - Deliver to online users via WebSocket
   - Queue for offline users (delivered when they connect)
   - Fan-out to all group members
   - Update delivery status

This is critical for WhatsApp because:
- Users are often offline (mobile, intermittent connectivity)
- Group messages need fan-out to 100+ members
- Can't make sender wait for all deliveries`,

  whyItMatters: 'Without queues, sending a group message would block until all 100 members are notified. User waits 15+ seconds!',

  famousIncident: {
    title: 'WhatsApp Message Delivery Delays',
    company: 'WhatsApp',
    year: '2019',
    whatHappened: 'Message queue infrastructure couldn\'t keep up during a traffic spike. Messages were delayed by hours for some users. Queue backlog reached millions.',
    lessonLearned: 'Queue processing must scale horizontally. Use dedicated queues per user for offline delivery.',
    icon: '⏰',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Delivering to offline users',
    howTheyDoIt: 'Uses distributed message queues. Each user has a personal queue for offline messages. When they connect, queued messages are delivered.',
  },

  diagram: `
User Sends Message
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [User1: msg1, User2: msg2, ...]    │
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
        │WebSocket │          │ Offline  │        │  Group   │
        │ Delivery │          │  Queue   │        │ Fan-Out  │
        └──────────┘          └──────────┘        └──────────┘
`,

  keyPoints: [
    'Queue decouples message send from delivery',
    'User gets instant response - delivery happens async',
    'Offline users: messages queued until they connect',
    'Groups: message fanned out to all members',
  ],

  quickCheck: {
    question: 'Why use async processing for WhatsApp message delivery?',
    options: [
      'It\'s cheaper',
      'Sender gets instant response while offline delivery happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the sender doesn\'t wait. Message is saved instantly, delivery to offline users and groups happens in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Fan-Out', explanation: 'Delivering one message to many users', icon: '📡' },
  ],
};

const step7: GuidedStep = {
  id: 'whatsapp-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Messages and groups (now with offline support)',
    taskDescription: 'Add a Message Queue for offline users and group fan-out',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle offline delivery and group fan-out', displayName: 'Kafka' },
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
    level2: 'Connect App Server to Message Queue. This enables async delivery to offline users.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2 million.",
  hook: "The CFO says: 'Cut costs by 40% or we can't scale to more users.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built WhatsApp!',
  achievement: 'A scalable, cost-effective messaging platform',
  metrics: [
    { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
    { label: 'Message delivery', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '100M concurrent users' },
  ],
  nextTeaser: "You've mastered WhatsApp system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Efficiency at Scale',
  conceptExplanation: `System design isn't just about performance - it's about **smart trade-offs**.

Cost optimization strategies for WhatsApp:
1. **Right-size instances** - Match server size to actual load
2. **Compression** - Compress messages and media (saves bandwidth and storage)
3. **Cache aggressively** - Reduce expensive database queries
4. **Auto-scale** - Scale down during off-peak hours
5. **Media tiering** - Move old media to cheaper cold storage
6. **Efficient protocols** - Use binary protocols (not JSON) for messaging

For WhatsApp at scale:
- Erlang servers are incredibly efficient for WebSocket connections
- Aggressive media compression saves petabytes of storage
- Smart caching reduces database load by 90%`,

  whyItMatters: 'Building the best system means nothing if you can\'t afford to run it. WhatsApp famously ran 450M users with only 32 engineers!',

  famousIncident: {
    title: 'WhatsApp\'s Legendary Efficiency',
    company: 'WhatsApp',
    year: '2014',
    whatHappened: 'When Facebook acquired WhatsApp for $19B, WhatsApp was serving 450 million users with only 32 engineers and 50 servers (mostly for message routing). Cost per user was under $0.50/year.',
    lessonLearned: 'Extreme efficiency is possible with smart architecture. Erlang, aggressive caching, and simple design enabled massive scale cheaply.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Running billions of messages per day profitably',
    howTheyDoIt: 'Erlang for efficient WebSocket handling, image compression (reduces 200KB → 50KB), aggressive caching, and minimal features keep costs incredibly low.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Compression saves massive storage/bandwidth costs',
    'Cache to reduce expensive database operations',
    'Auto-scale to match actual demand',
    'Simple architecture = lower operational costs',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for WhatsApp\'s media storage?',
    options: [
      'Delete old media',
      'Compress images and move old media to cold storage',
      'Charge users for storage',
      'Reduce image quality to minimum',
    ],
    correctIndex: 1,
    explanation: 'Compression (200KB → 50KB) saves 75% storage. Cold storage for old media saves another 80% on infrequently accessed data.',
  },

  keyConcepts: [
    { title: 'Compression', explanation: 'Reduce data size to save costs', icon: '🗜️' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'whatsapp-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $1.2M/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $1.2M/month',
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
      { fromType: 'app_server', to: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: compression, right-sized instances, caching strategy. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const whatsappGuidedTutorial: GuidedTutorial = {
  problemId: 'whatsapp',
  title: 'Design WhatsApp',
  description: 'Build a messaging platform with 1:1 chat, groups, end-to-end encryption, and delivery status',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📱',
    hook: "You've been hired as Lead Engineer at Global Messaging Inc!",
    scenario: "Your mission: Build a WhatsApp-like platform that enables secure, real-time messaging for billions of users worldwide.",
    challenge: "Can you design a system that handles 100 billion messages per day with end-to-end encryption?",
  },

  requirementsPhase: whatsappRequirementsPhase,

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
    'End-to-End Encryption',
    'Offline Message Delivery',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
    'Chapter 12: Data Systems',
  ],
};

export default whatsappGuidedTutorial;
