import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Realtime Chat Messages Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a real-time chat messaging system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, load balancer, replication, queues, cost)
 *
 * Key Concepts:
 * - Real-time message delivery via WebSocket
 * - User presence and online status
 * - Typing indicators
 * - Read receipts and delivery confirmations
 * - Message persistence and history
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const realtimeChatRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time chat messaging system",

  interviewer: {
    name: 'Jordan Blake',
    role: 'Engineering Director at Real-Time Messaging Co.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-messaging',
      category: 'functional',
      question: "What are the core features users need in a real-time chat system?",
      answer: "Users need to:\n\n1. **Send messages** - Real-time text messaging between users\n2. **See message status** - Sent, delivered, and read receipts\n3. **Know who's online** - See user presence (online/offline/away)\n4. **See typing indicators** - Know when someone is typing a response\n5. **View message history** - Access past conversations",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Real-time chat is about instant, transparent communication with status awareness",
    },
    {
      id: 'real-time-delivery',
      category: 'functional',
      question: "How quickly should messages appear for recipients?",
      answer: "Messages should appear **instantly** (within 100-200ms). This is a real-time chat system - users expect immediate delivery when both parties are online. Unlike email or notifications, there's zero tolerance for delay.",
      importance: 'critical',
      revealsRequirement: 'NFR-1',
      learningPoint: "Real-time delivery requires persistent bidirectional connections (WebSocket), not polling",
    },
    {
      id: 'read-receipts',
      category: 'functional',
      question: "How do read receipts work?",
      answer: "**Three-tier status system:**\n1. **Sent (✓)** - Message left sender's device, received by server\n2. **Delivered (✓✓)** - Message delivered to recipient's device\n3. **Read (✓✓ blue)** - Recipient opened the chat and viewed the message\n\nThis requires acknowledgment messages at each stage.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Read receipts require bidirectional communication - recipients must send ACKs back",
    },
    {
      id: 'presence',
      category: 'functional',
      question: "How does user presence work? What states exist?",
      answer: "**Presence states:**\n- **Online** - User is actively connected and available\n- **Away** - Connected but inactive (no activity for 5+ minutes)\n- **Offline** - Disconnected from the system\n\nPresence updates should be near-instant (within 1-2 seconds) so users see accurate status.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Presence requires heartbeat messages and timeout detection to track user state",
    },
    {
      id: 'typing-indicators',
      category: 'functional',
      question: "How do typing indicators work?",
      answer: "When a user starts typing, show \"User is typing...\" to others in the conversation. Stop showing it after:\n- User stops typing for 3 seconds\n- User sends the message\n\nTyping indicators should appear within 200-300ms of the user typing. They're ephemeral - no need to store them.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      insight: "Typing indicators are transient events - use lightweight signaling, don't persist",
    },
    {
      id: 'message-history',
      category: 'functional',
      question: "Do messages need to be stored? For how long?",
      answer: "Yes! Messages must be stored permanently (or until user deletes them). Users need to:\n- Scroll back through conversation history\n- Search old messages\n- Access conversations from new devices\n\nFor MVP, store unlimited history. Can add retention policies later.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      insight: "Permanent storage requires a database - can't keep everything in memory",
    },
    {
      id: 'offline-delivery',
      category: 'clarification',
      question: "What happens when a recipient is offline?",
      answer: "Messages must be **queued** and delivered when they come online:\n- Server stores messages for offline users\n- When user reconnects, deliver all queued messages\n- Show delivery status as 'Sent' until recipient connects\n\nThis is critical for mobile users with intermittent connectivity.",
      importance: 'critical',
      insight: "Offline support requires per-user message queues and state management",
    },
    {
      id: 'group-chat',
      category: 'clarification',
      question: "Is this 1:1 chat only, or do we support group chats?",
      answer: "For MVP, focus on **1:1 chat** (two users). Group chat adds complexity:\n- Message fan-out to multiple recipients\n- Tracking read receipts for multiple users\n- Managing group membership\n\nWe can add groups later, but let's start with 1:1.",
      importance: 'nice-to-have',
      insight: "1:1 chat is simpler - each message has one recipient. Group chat multiplies complexity.",
    },
    {
      id: 'multimedia',
      category: 'clarification',
      question: "Can users send more than text? Images, videos, files?",
      answer: "For MVP, focus on **text messages only**. Media sharing requires:\n- File upload infrastructure\n- CDN for serving media\n- Preview generation\n- Storage costs increase dramatically\n\nText messages are ~1KB each. We can add media later.",
      importance: 'nice-to-have',
      insight: "Text-only simplifies initial implementation - add media once core chat works",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "50 million monthly active users globally. About 10 million peak concurrent connections (users actively online at the same time).",
      importance: 'critical',
      learningPoint: "10M concurrent WebSocket connections is massive scale - requires horizontal scaling",
    },
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many messages are sent per day?",
      answer: "About 10 billion messages per day globally",
      importance: 'critical',
      calculation: {
        formula: "10B ÷ 86,400 sec = 115,740 messages/sec",
        result: "~116K writes/sec (350K at peak)",
      },
      learningPoint: "High write throughput requires database sharding and async processing",
    },
    {
      id: 'throughput-presence',
      category: 'throughput',
      question: "How often do presence updates happen?",
      answer: "Each connected user sends a heartbeat every 30 seconds. With 10M concurrent users, that's 333,333 heartbeats/sec. Plus presence changes (online → offline, etc.) which happen less frequently.",
      importance: 'critical',
      calculation: {
        formula: "10M users ÷ 30 sec = 333,333 heartbeats/sec",
        result: "~333K presence updates/sec",
      },
      learningPoint: "Presence heartbeats create massive background traffic - need efficient handling",
    },
    {
      id: 'throughput-typing',
      category: 'burst',
      question: "How many typing indicator events happen?",
      answer: "Every time a user types, we send a typing event. If 5% of concurrent users are typing at any moment, that's 500K users. Each might send 5-10 typing events per message. This creates significant burst traffic.",
      importance: 'important',
      insight: "Typing indicators create bursty traffic - needs rate limiting and debouncing",
    },
    {
      id: 'latency-delivery',
      category: 'latency',
      question: "How fast should messages be delivered?",
      answer: "p99 under 200ms from send to delivery for online users. Anything slower feels laggy. Offline users get messages when they reconnect (no time limit).",
      importance: 'critical',
      learningPoint: "Sub-200ms requires efficient WebSocket routing and minimal processing",
    },
    {
      id: 'latency-presence',
      category: 'latency',
      question: "How fast should presence updates appear?",
      answer: "Within 2 seconds. When someone goes online/offline, others should see the status change quickly. Not as critical as message delivery, but still important for UX.",
      importance: 'important',
      learningPoint: "Presence can tolerate slightly higher latency than messages",
    },
    {
      id: 'persistence',
      category: 'reliability',
      question: "Can messages ever be lost?",
      answer: "**Never!** Every message must be persisted to durable storage before acknowledging to sender. If the server crashes after receiving a message, it must still be delivered when server recovers.",
      importance: 'critical',
      learningPoint: "Message durability requires write-ahead logging and database persistence",
    },
    {
      id: 'availability',
      category: 'reliability',
      question: "What's the uptime requirement?",
      answer: "99.9% availability (8.7 hours downtime per year). Chat is critical for business communication - downtime impacts productivity.",
      importance: 'critical',
      learningPoint: "High availability requires redundancy, health checks, and automatic failover",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-messaging', 'real-time-delivery', 'read-receipts'],
  criticalFRQuestionIds: ['core-messaging', 'read-receipts', 'presence'],
  criticalScaleQuestionIds: ['throughput-users', 'throughput-messages', 'latency-delivery'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can send and receive messages in real-time',
      description: 'Instant message delivery with persistent storage',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Message delivery status (sent, delivered, read)',
      description: 'Track message status with read receipts',
      emoji: '✓',
    },
    {
      id: 'fr-3',
      text: 'FR-3: User presence (online/offline/away)',
      description: 'Show real-time user online status',
      emoji: '🟢',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Typing indicators',
      description: 'Show when the other user is typing',
      emoji: '⌨️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '10 billion messages',
    readsPerDay: 'N/A (real-time push)',
    peakMultiplier: 3,
    readWriteRatio: 'N/A (push-based)',
    calculatedWriteRPS: { average: 115740, peak: 347220 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~1KB (text message with metadata)',
    storagePerRecord: '~500 bytes (message)',
    storageGrowthPerYear: '~1.8 PB (10B msgs/day × 365 × 500 bytes)',
    redirectLatencySLA: 'p99 < 200ms (message delivery)',
    createLatencySLA: 'p99 < 200ms (send)',
  },

  architecturalImplications: [
    '✅ Real-time delivery → WebSocket connections required',
    '✅ 10M concurrent connections → Need connection pooling across many servers',
    '✅ Offline users → Message queue per user for pending delivery',
    '✅ Message history → Database sharded by user_id or conversation_id',
    '✅ Presence tracking → Heartbeat mechanism with timeout detection',
    '✅ Read receipts → Bidirectional ACK messages over WebSocket',
  ],

  outOfScope: [
    'Group chats (focus on 1:1)',
    'Media sharing (images, videos, files)',
    'Voice/video calls',
    'Message editing or deletion',
    'End-to-end encryption',
    'Push notifications (mobile)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can send messages in real-time. Presence, typing indicators, and read receipts will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💬',
  scenario: "Welcome to Real-Time Messaging Co! You've been hired to build a chat system.",
  hook: "Your first users want to message each other right now!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your chat system is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting connections', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle messages yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every chat application starts with a **Client** connecting to a **Server**.

When a user opens your chat app:
1. Their device (mobile, desktop, browser) is the **Client**
2. It sends requests to your **App Server**
3. The server processes the request and sends back a response

For real-time messaging, we'll upgrade this to WebSocket in later steps. But we start with basic HTTP to establish the connection.`,

  whyItMatters: 'Without this connection, users can\'t send or receive messages at all. This is the foundation everything else builds on.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Handling 10 million concurrent connections',
    howTheyDoIt: 'Started with simple Erlang servers, now uses distributed WebSocket servers worldwide with load balancing',
  },

  keyPoints: [
    'Client = the user\'s device that initiates communication',
    'App Server = your backend that processes messages',
    'HTTP = the initial protocol (we\'ll upgrade to WebSocket later)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles message logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Initial protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'realtime-chat-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the chat app', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles messages and real-time communication', displayName: 'App Server' },
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
// STEP 2: Implement Core Message Handling (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle messages yet!",
  hook: "A user just tried to send 'Hello!' but got a 404 error.",
  challenge: "Write the Python code to send messages, fetch message history, and handle delivery status.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle messages!',
  achievement: 'You implemented the core messaging functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can send messages', after: '✓' },
    { label: 'Can fetch history', after: '✓' },
    { label: 'Can track delivery', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all messages disappear...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Message Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For a chat system, we need handlers for:
- \`send_message()\` - Send a message from one user to another
- \`get_messages()\` - Fetch conversation history
- \`update_delivery_status()\` - Update sent/delivered/read status

For now, we'll store everything in memory (Python dictionaries). This is temporary - we'll add a database in the next step.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where the messaging logic lives!',

  famousIncident: {
    title: 'WhatsApp\'s Early Erlang Architecture',
    company: 'WhatsApp',
    year: '2009',
    whatHappened: 'WhatsApp chose Erlang specifically for its ability to handle millions of concurrent connections efficiently. Early handler implementations were kept extremely simple - just message routing, no fancy features.',
    lessonLearned: 'Start simple with core functionality. Fancy features can wait - reliability and simplicity come first.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Processing millions of messages per second',
    howTheyDoIt: 'Message handlers are stateless and horizontally scalable. Each server can handle ~100K messages/sec.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (empty message, invalid user, etc.)',
    'Return proper status codes and error messages',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory is cheaper',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Database adds complexity, so we\'ll add it in Step 3 when we need persistence.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Stateless', explanation: 'Each request is independent', icon: '🔄' },
  ],
};

const step2: GuidedStep = {
  id: 'realtime-chat-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Send/receive messages, FR-2: Delivery status',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/messages, GET /api/v1/messages, PUT /api/v1/delivery APIs',
      'Open the Python tab',
      'Implement send_message(), get_messages(), and update_delivery_status() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for send_message, get_messages, and update_delivery_status',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/messages', 'GET /api/v1/messages', 'PUT /api/v1/delivery'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Message Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed at 2 AM and restarted...",
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
  nextTeaser: "But fetching message history is getting slow as conversations grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes and restarts
- **Structure**: Organized tables with indexes for fast queries
- **Consistency**: ACID guarantees for data integrity

For a chat system, we need tables for:
- \`users\` - User accounts and profiles
- \`conversations\` - 1:1 or group conversations
- \`messages\` - All sent messages with timestamps
- \`delivery_status\` - Sent, delivered, read tracking`,

  whyItMatters: 'Imagine losing all your chat history because of a server restart. Years of conversations would vanish. Databases make data permanent.',

  famousIncident: {
    title: 'Signal\'s Database Encryption',
    company: 'Signal',
    year: '2016',
    whatHappened: 'Signal implemented full database encryption on mobile devices, meaning even if the phone is compromised, messages are encrypted at rest. This became the gold standard for secure messaging.',
    lessonLearned: 'Persistent storage is critical, but so is security. Consider encryption for sensitive chat data.',
    icon: '🔒',
  },

  realWorldExample: {
    company: 'Discord',
    scenario: 'Storing billions of messages',
    howTheyDoIt: 'Uses Cassandra for message storage, partitioned by channel_id. Each message is stored with microsecond-precision timestamps for ordering.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL/MySQL) for structured, relational data',
    'Index by conversation_id and timestamp for fast history queries',
    'Shard by user_id or conversation_id for horizontal scaling',
  ],

  quickCheck: {
    question: 'What happens to in-memory data when a server restarts?',
    options: [
      'It\'s automatically saved to disk',
      'It\'s backed up to the cloud',
      'It\'s completely lost',
      'It\'s cached temporarily',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone forever.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'realtime-chat-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Messages need permanent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store messages, users, conversations permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Presence and Recent Messages
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 100,000 users, and the app is getting slow!",
  hook: "Users complain: 'Why does it take 2 seconds to see who's online?' Every presence check hits the database.",
  challenge: "Add a cache to make presence lookups and recent messages lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Presence and messages load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Presence lookup latency', before: '2000ms', after: '100ms' },
    { label: 'Recent messages latency', before: '1500ms', after: '80ms' },
    { label: 'Cache hit rate', after: '92%' },
  ],
  nextTeaser: "But what happens when millions of users connect simultaneously?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

For a chat system, we cache:
- **User presence** - Online/offline/away status (very frequently accessed)
- **Recent messages** - Last 50-100 messages per conversation
- **Typing indicators** - Active typing state (ephemeral)
- **Delivery status** - Read receipt state

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\``,

  whyItMatters: 'Users check presence constantly (every time they open a chat). Without caching, you\'d hit the database millions of times per second.',

  famousIncident: {
    title: 'Facebook Messenger\'s TAO Cache',
    company: 'Facebook Messenger',
    year: '2013',
    whatHappened: 'Facebook built TAO (The Associations and Objects), a custom distributed cache for social data. It reduced database queries by 99%, handling billions of presence and message queries per second.',
    lessonLearned: 'At massive scale, caching is mandatory. Cache hot data aggressively - presence, recent messages, active conversations.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Serving presence for 2 billion users',
    howTheyDoIt: 'Uses Redis clusters to cache user presence. Presence state expires after 60 seconds if no heartbeat is received.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (92% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache presence state with short TTL (60 seconds)',
    'Cache recent messages per conversation',
    'Cache Hit = instant response, Cache Miss = fetch from DB',
  ],

  quickCheck: {
    question: 'What should a chat system cache for best performance?',
    options: [
      'All messages ever sent',
      'User presence and recent messages',
      'Only user profiles',
      'Nothing - databases are fast enough',
    ],
    correctIndex: 1,
    explanation: 'Cache frequently accessed data: presence (checked constantly) and recent messages (shown when opening a chat).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'realtime-chat-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: User presence (now loads fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache presence state and recent messages', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (60 seconds for presence data)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 60 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer with WebSocket Support
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out handling WebSocket connections!",
  hook: "50,000 concurrent users are connected, and new users can't join. CPU is at 100%!",
  challenge: "Add a load balancer with sticky sessions for WebSocket connections.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'WebSocket traffic is now distributed!',
  achievement: 'Load balancer with sticky sessions spreads connections across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Max concurrent connections', before: '50K', after: '10M+' },
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
- Server maintains the socket state and delivery queues`,

  whyItMatters: 'Real-time messaging requires 10M+ concurrent WebSocket connections. No single server can handle that scale - you need horizontal scaling.',

  famousIncident: {
    title: 'WhatsApp\'s Connection Crisis',
    company: 'WhatsApp',
    year: '2014',
    whatHappened: 'During a surge, WhatsApp\'s load balancers couldn\'t handle the connection spike. Millions of users couldn\'t connect. The issue was fixed by implementing better connection distribution and rate limiting.',
    lessonLearned: 'Load balancers must handle connection storms gracefully. Use connection rate limiting and health checks.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Slack',
    scenario: 'Handling 10M+ concurrent WebSocket connections',
    howTheyDoIt: 'Uses HAProxy with sticky sessions based on user_id. Distributes WebSocket connections across hundreds of servers worldwide.',
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
    'Enables horizontal scaling to millions of connections',
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
    explanation: 'WebSocket maintains a long-lived, stateful connection. The server holds the socket state and message queues, so users must stay on the same server.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across servers', icon: '⚖️' },
    { title: 'Sticky Session', explanation: 'User stays on same server', icon: '📌' },
    { title: 'WebSocket', explanation: 'Real-time bidirectional connection', icon: '🔌' },
  ],
};

const step5: GuidedStep = {
  id: 'realtime-chat-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing (especially real-time delivery)',
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
  scenario: "Your database crashed for 30 minutes this morning. Users couldn't send or receive messages.",
  hook: "Hundreds of thousands of messages were queued but couldn't be delivered. Trust is shaken.",
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
- **Data safety**: Multiple copies prevent message loss`,

  whyItMatters: 'A single database is a single point of failure. For a chat system handling 116K messages/sec, downtime means lost messages and angry users.',

  famousIncident: {
    title: 'Telegram\'s Database Outage',
    company: 'Telegram',
    year: '2020',
    whatHappened: 'Database issues caused a multi-hour outage affecting millions. Messages were queued but not delivered. Telegram had to restore from replicas and replay queued messages.',
    lessonLearned: 'Database replication is essential. Messages must never be lost - persist before acknowledging to sender.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Zero tolerance for message loss',
    howTheyDoIt: 'Uses multi-region replication. Each message is stored on at least 3 servers across different data centers before acknowledging to sender.',
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
      'Messages are lost temporarily',
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
  id: 'realtime-chat-step-6',
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
// STEP 7: Add Message Queue for Offline Users and Async Processing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📨',
  scenario: "Users are complaining about delayed message delivery!",
  hook: "When the recipient is offline, messages take 30+ seconds to be queued. Typing indicators lag by 5 seconds.",
  challenge: "Add a message queue to handle offline delivery and async events like typing indicators.",
  illustration: 'message-delay',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Messages are delivered instantly!',
  achievement: 'Async processing handles offline users and real-time events',
  metrics: [
    { label: 'Message send latency', before: '30s', after: '<100ms' },
    { label: 'Typing indicator lag', before: '5s', after: '<200ms' },
    { label: 'Offline delivery', after: 'Queued' },
  ],
  nextTeaser: "But the infrastructure costs are getting too high...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Handling Offline Users and Real-Time Events',
  conceptExplanation: `Message queues enable **async processing** so users don't wait.

When a message is sent:
1. **Synchronous**: Save to database, return success ✓
2. **Async via Queue**:
   - Deliver to online users via WebSocket
   - Queue for offline users (delivered when they connect)
   - Send read receipts back to sender
   - Update presence and typing indicators

For real-time events (typing indicators, presence):
- Events go to queue
- Workers broadcast to relevant users
- No database writes needed - ephemeral

This is critical because:
- Users are often offline (mobile, battery saving)
- Can't make sender wait for offline delivery
- Typing indicators need low-latency broadcast`,

  whyItMatters: 'Without queues, sending a message to an offline user would block. Real-time events like typing indicators would lag. UX would suffer.',

  famousIncident: {
    title: 'Facebook Messenger\'s Queue Backlog',
    company: 'Facebook Messenger',
    year: '2015',
    whatHappened: 'Message queue infrastructure couldn\'t keep up during peak hours. Message delivery was delayed by minutes for offline users. Queue backlog reached millions of messages.',
    lessonLearned: 'Queue processing must scale horizontally. Use dedicated queues per user for offline delivery to prevent head-of-line blocking.',
    icon: '⏰',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Delivering to offline users',
    howTheyDoIt: 'Uses distributed message queues. Each user has a personal queue for offline messages. When they connect, queued messages are delivered in order.',
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
        │WebSocket │          │ Offline  │        │ Typing & │
        │ Delivery │          │  Queue   │        │ Presence │
        └──────────┘          └──────────┘        └──────────┘
`,

  keyPoints: [
    'Queue decouples message send from delivery',
    'User gets instant response - delivery happens async',
    'Offline users: messages queued until they connect',
    'Typing indicators and presence go through queue for broadcast',
  ],

  quickCheck: {
    question: 'Why use async processing for message delivery?',
    options: [
      'It\'s cheaper',
      'Sender gets instant response while offline delivery happens in background',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Async means the sender doesn\'t wait. Message is saved instantly, delivery to offline users happens in the background via queue workers.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Ephemeral Events', explanation: 'Temporary events like typing (no storage)', icon: '💨' },
  ],
};

const step7: GuidedStep = {
  id: 'realtime-chat-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2, FR-4: Messages, delivery status, and typing indicators',
    taskDescription: 'Add a Message Queue for offline users and async events',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle offline delivery and real-time events', displayName: 'Kafka' },
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
    level2: 'Connect App Server to Message Queue. This enables async delivery to offline users and broadcasting of typing indicators.',
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
  hook: "The CFO says: 'Cut costs by 40% or we can't grow to more users.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a real-time chat system!',
  achievement: 'A scalable, cost-effective messaging platform',
  metrics: [
    { label: 'Monthly cost', before: '$800K', after: 'Under budget' },
    { label: 'Message delivery', after: '<200ms' },
    { label: 'Availability', after: '99.9%' },
    { label: 'Can handle', after: '10M concurrent users' },
  ],
  nextTeaser: "You've mastered real-time messaging system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Efficiency at Scale',
  conceptExplanation: `System design isn't just about performance - it's about **smart trade-offs**.

Cost optimization strategies for real-time chat:
1. **Connection pooling** - Reuse WebSocket connections efficiently
2. **Presence heartbeat optimization** - Reduce heartbeat frequency (30s → 60s)
3. **Cache aggressively** - Reduce database queries for presence and recent messages
4. **Auto-scale** - Scale down during off-peak hours (nights)
5. **Compress messages** - Reduce bandwidth costs with compression
6. **Efficient protocols** - Use binary protocols (MessagePack, Protobuf) instead of JSON

For chat at scale:
- Each WebSocket connection costs ~1KB memory - 10M connections = 10GB
- Presence heartbeats create 333K updates/sec - optimize or cache
- Message storage: 10B messages/day × 500 bytes = 5TB/day = $$$`,

  whyItMatters: 'Building the best system means nothing if you can\'t afford to run it. Chat apps need to be profitable at scale.',

  famousIncident: {
    title: 'WhatsApp\'s Legendary Efficiency',
    company: 'WhatsApp',
    year: '2014',
    whatHappened: 'When Facebook acquired WhatsApp for $19B, WhatsApp was serving 450 million users with only 32 engineers and minimal infrastructure. Cost per user was under $0.20/year through extreme efficiency.',
    lessonLearned: 'Extreme efficiency is possible with smart architecture. Erlang for efficient connections, aggressive caching, minimal features, and ruthless optimization.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Telegram',
    scenario: 'Running billions of messages per day profitably',
    howTheyDoIt: 'MTProto protocol (custom binary), aggressive compression, efficient server infrastructure. Cost per user is ~$0.03/month.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Optimize heartbeat frequency and payload size',
    'Cache presence and recent messages to reduce DB load',
    'Auto-scale based on concurrent connections (peak vs off-peak)',
    'Use compression and binary protocols to reduce bandwidth',
  ],

  quickCheck: {
    question: 'What\'s the best cost optimization for presence heartbeats?',
    options: [
      'Disable presence entirely',
      'Increase heartbeat interval (30s → 60s) and cache presence state',
      'Send heartbeats only when status changes',
      'Store heartbeats in database',
    ],
    correctIndex: 1,
    explanation: 'Longer heartbeat intervals reduce traffic (333K → 166K updates/sec). Caching presence state reduces DB queries by 90%+.',
  },

  keyConcepts: [
    { title: 'Compression', explanation: 'Reduce message size to save bandwidth', icon: '🗜️' },
    { title: 'Auto-Scaling', explanation: 'Adjust capacity based on load', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'realtime-chat-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $500K/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $500K/month',
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
    level2: 'Consider: compression, optimized heartbeats, right-sized instances, aggressive caching. Balance cost with reliability.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const realtimeChatMessagesGuidedTutorial: GuidedTutorial = {
  problemId: 'realtime-chat-messages',
  title: 'Design Real-Time Chat Messages',
  description: 'Build a real-time chat system with message delivery, presence, typing indicators, and read receipts',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '💬',
    hook: "You've been hired as Lead Engineer at Real-Time Messaging Co!",
    scenario: "Your mission: Build a chat system that enables instant, transparent communication with presence awareness and delivery confirmations.",
    challenge: "Can you design a system that handles 10 million concurrent WebSocket connections and 116K messages/sec?",
  },

  requirementsPhase: realtimeChatRequirementsPhase,

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
    'User Presence',
    'Typing Indicators',
    'Read Receipts',
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

export default realtimeChatMessagesGuidedTutorial;
