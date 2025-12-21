import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * WhatsApp - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: Real-time messaging, WebSockets, message delivery guarantees, end-to-end encryption.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Send messages to users
 * - FR-2: Receive messages in real-time
 * - Build: Client → Server → Database, basic messaging
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Message delivery receipts (sent/delivered/read)
 * - FR-4: Group chats
 * - Build: WebSockets, presence, fan-out
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle 100B messages/day
 * - Offline message delivery
 * - Build: Message queues, connection management, partitioning
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - End-to-end encryption
 * - Media sharing (images, videos)
 * - Multi-device sync
 *
 * Key Teaching: Real-time at scale is HARD. Delivery guarantees matter!
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a messaging platform like WhatsApp",

  interviewer: {
    name: 'Marcus Johnson',
    role: 'Product Manager at ChatNow',
    avatar: '👨‍💼',
  },

  questions: [
    {
      id: 'send-message',
      category: 'functional',
      question: "What's the most basic thing users want to do?",
      answer: "Send messages! User A types a message, hits send, and User B should receive it. That's the core functionality.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with 1-to-1 messaging",
    },
    {
      id: 'real-time',
      category: 'functional',
      question: "How fast should messages arrive?",
      answer: "Instantly! If I send a message, the other person should see it within a second. Real-time is essential for chat.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Real-time delivery is expected",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['send-message', 'real-time'],
  criticalFRQuestionIds: ['send-message', 'real-time'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Send messages',
      description: 'Users can send text messages to other users',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Real-time delivery',
      description: 'Messages arrive instantly (< 1 second)',
      emoji: '⚡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000',
    writesPerDay: '5M messages',
    readsPerDay: '20M message loads',
    peakMultiplier: 3,
    readWriteRatio: '4:1',
    calculatedWriteRPS: { average: 60, peak: 200 },
    calculatedReadRPS: { average: 250, peak: 800 },
    maxPayloadSize: '~1KB per message',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~1TB',
    redirectLatencySLA: 'Message delivery < 1s',
    createLatencySLA: 'Send < 200ms',
  },

  architecturalImplications: [
    '✅ Write-heavy compared to typical apps',
    '✅ Real-time requirement → need persistent connections',
    '✅ Messages must be stored for offline users',
  ],

  outOfScope: [
    'Delivery receipts (Phase 2)',
    'Group chats (Phase 2)',
    'Offline delivery (Phase 3)',
    'End-to-end encryption (Phase 4)',
  ],

  keyInsight: "Messaging is REAL-TIME and BIDIRECTIONAL. HTTP request/response is too slow. We need persistent connections like WebSockets.",

  thinkingFramework: {
    title: "Phase 1: Basic 1-to-1 Messaging",
    intro: "We have 2 simple requirements. Let's build basic message sending and receiving.",

    steps: [
      {
        id: 'persistent-connection',
        title: 'Step 1: How Do We Get Real-Time?',
        alwaysAsk: "How do messages arrive instantly?",
        whyItMatters: "HTTP polling is too slow and wasteful. We need persistent connections.",
        expertBreakdown: {
          intro: "Options for real-time:",
          points: [
            "Polling: Client asks server every X seconds (wasteful)",
            "Long Polling: Server holds connection until data (better)",
            "WebSockets: Persistent bidirectional connection (best)",
            "For chat, WebSockets are the standard"
          ]
        },
        icon: '🔌',
        category: 'functional'
      },
      {
        id: 'message-flow',
        title: 'Step 2: Message Flow',
        alwaysAsk: "What happens when User A sends to User B?",
        whyItMatters: "Understanding the flow is key to the architecture.",
        expertBreakdown: {
          intro: "Basic flow:",
          points: [
            "User A sends message via WebSocket",
            "Server receives and stores message",
            "Server finds User B's connection",
            "Server pushes message to User B",
            "User B receives instantly"
          ]
        },
        icon: '📨',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client ↔ WebSocket Server → Database. Store messages, push to recipients.",
      whySimple: "This works for a small chat app. We'll add delivery receipts and groups later.",
      nextStepPreview: "Step 1: Set up the messaging connection"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic chat works!",
    hookMessage: "But users don't know if messages were delivered. And no group chats...",
    steps: [
      {
        id: 'receipts',
        title: 'Phase 2: Receipts & Groups',
        question: "How do users know messages were received?",
        whyItMatters: "Those checkmarks ✓✓ are essential for trust",
        example: "Delivery receipts, read receipts, group messaging",
        icon: '✓'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale',
        question: "What if someone is offline?",
        whyItMatters: "Messages must not be lost",
        example: "Offline queuing, guaranteed delivery",
        icon: '📴'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Server with WebSocket (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💬',
  scenario: "Welcome to ChatNow! You're building the next WhatsApp.",
  hook: "Two friends want to chat. They open the app and... nothing happens. Messages don't go anywhere!",
  challenge: "Set up the basic system with WebSocket connections for real-time messaging.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Real-time connection established!',
  achievement: 'Users can now connect to your chat server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'WebSocket', after: 'Connected' },
  ],
  nextTeaser: "But where do we store messages?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'WebSockets for Real-Time Chat',
  conceptExplanation: `**Why WebSockets?**

**HTTP (Request/Response):**
\`\`\`
Client → "Any new messages?" → Server → "No"
Client → "Any new messages?" → Server → "No"
Client → "Any new messages?" → Server → "Yes! Here's one"
(Wasteful! Checking constantly)
\`\`\`

**WebSocket (Persistent Connection):**
\`\`\`
Client ↔ Server (Connection stays open)
Server → "New message!" (Instant push when available)
\`\`\`

**WebSocket Handshake:**
\`\`\`
GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
\`\`\`

**Server Code:**
\`\`\`python
# Connection management
connections = {}  # user_id → websocket

async def on_connect(websocket, user_id):
    connections[user_id] = websocket

async def send_to_user(user_id, message):
    if user_id in connections:
        await connections[user_id].send(message)
\`\`\`

**Why is this better?**
- No polling overhead
- Instant delivery (~50ms)
- Bidirectional (server can push)
- Lower latency`,

  whyItMatters: 'WebSockets are THE foundation of real-time apps. Without them, chat feels sluggish.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Billions of messages daily',
    howTheyDoIt: 'XMPP-based protocol over TCP. Keeps connections open. Erlang servers handle millions of connections.',
  },

  keyPoints: [
    'WebSocket = persistent connection',
    'Server can push messages',
    'Much lower latency than polling',
  ],

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent bidirectional connection', icon: '🔌' },
    { title: 'Push', explanation: 'Server sends without client asking', icon: '📤' },
  ],
};

const step1: GuidedStep = {
  id: 'whatsapp-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Real-time messaging',
    taskDescription: 'Add Client and App Server with WebSocket support',
    componentsNeeded: [
      { type: 'client', reason: 'User sending messages', displayName: 'Chat App' },
      { type: 'app_server', reason: 'WebSocket server for real-time', displayName: 'Chat Server' },
    ],
    successCriteria: [
      'Client added',
      'App Server added',
      'WebSocket connection established',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server onto the canvas',
    level2: 'Connect them together (this represents WebSocket connection)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Message Storage (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Messages are flowing! But they disappear when you close the app.",
  hook: "User A sends 'Happy Birthday!' to User B. User B was offline. When they come online... the message is gone! We need to store messages.",
  challenge: "Add a database to persist messages.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Messages are now stored!',
  achievement: 'Chat history is persisted',
  metrics: [
    { label: 'Messages stored', after: '✓' },
    { label: 'History preserved', after: '✓' },
  ],
  nextTeaser: "Now let's implement the full send/receive flow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Message Data Model',
  conceptExplanation: `**What do we need to store?**

**Messages Table:**
\`\`\`sql
CREATE TABLE messages (
  id BIGINT PRIMARY KEY,
  conversation_id BIGINT,
  sender_id BIGINT,
  recipient_id BIGINT,
  content TEXT,
  content_type VARCHAR(20),  -- text, image, video
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  status VARCHAR(20)  -- sent, delivered, read
);
\`\`\`

**Conversations Table:**
\`\`\`sql
CREATE TABLE conversations (
  id BIGINT PRIMARY KEY,
  type VARCHAR(20),  -- direct, group
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE conversation_participants (
  conversation_id BIGINT,
  user_id BIGINT,
  joined_at TIMESTAMP,
  last_read_at TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);
\`\`\`

**Message ID Generation:**
\`\`\`python
# Option 1: UUID
message_id = uuid.uuid4()

# Option 2: Snowflake ID (timestamp + machine + sequence)
# Better for ordering!
message_id = snowflake.generate()
\`\`\`

**Key Design Decisions:**
- conversation_id groups related messages
- Indexes on (conversation_id, sent_at) for loading history
- Status tracking for receipts
- Snowflake IDs for distributed generation`,

  whyItMatters: 'Messages must never be lost. The data model determines query patterns.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Storing billions of messages',
    howTheyDoIt: 'Originally used Mnesia (Erlang DB). Now uses custom storage. Messages stored until delivered.',
  },

  keyPoints: [
    'Messages linked to conversations',
    'Status for delivery tracking',
    'Snowflake IDs for ordering',
  ],

  keyConcepts: [
    { title: 'Conversation', explanation: 'Groups messages between users', icon: '💬' },
    { title: 'Snowflake ID', explanation: 'Time-ordered unique IDs', icon: '❄️' },
  ],
};

const step2: GuidedStep = {
  id: 'whatsapp-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Persist messages',
    taskDescription: 'Add Database for message storage',
    componentsNeeded: [
      { type: 'database', reason: 'Store messages', displayName: 'Message DB' },
    ],
    successCriteria: [
      'Database added',
      'App Server connected to Database',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Database component',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Implement Message Send/Receive Flow (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📨',
  scenario: "We have connections and storage. Now let's wire up the full flow!",
  hook: "User A types 'Hello!' and hits send. What exactly happens? Let's trace the complete path of a message.",
  challenge: "Implement the full send/receive message flow.",
  illustration: 'message-flow',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic chat works!',
  achievement: 'Users can send and receive messages in real-time',
  metrics: [
    { label: 'Send messages', after: '✓ Working' },
    { label: 'Real-time delivery', after: '< 100ms' },
    { label: 'Messages stored', after: '✓' },
  ],
  nextTeaser: "But how do users know if messages were delivered?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Message Flow: Send to Receive',
  conceptExplanation: `**Complete Message Flow:**

\`\`\`
1. User A types "Hello" and hits send
   ↓
2. Client sends via WebSocket:
   { type: "message", to: "user_b", content: "Hello" }
   ↓
3. Server receives message
   ↓
4. Server generates message_id (Snowflake)
   ↓
5. Server stores in database:
   INSERT INTO messages (id, sender_id, recipient_id, content, sent_at)
   VALUES (123, 'user_a', 'user_b', 'Hello', NOW())
   ↓
6. Server looks up User B's WebSocket connection
   connection = connections.get('user_b')
   ↓
7. Server pushes to User B:
   connection.send({ type: "message", from: "user_a", content: "Hello" })
   ↓
8. User B's app displays the message instantly!
\`\`\`

**Server Code:**
\`\`\`python
async def handle_message(websocket, data):
    sender_id = get_user_id(websocket)
    recipient_id = data['to']
    content = data['content']

    # 1. Store message
    message = await db.insert_message(
        sender_id=sender_id,
        recipient_id=recipient_id,
        content=content
    )

    # 2. Try to deliver in real-time
    recipient_ws = connections.get(recipient_id)
    if recipient_ws:
        await recipient_ws.send(json.dumps({
            'type': 'message',
            'id': message.id,
            'from': sender_id,
            'content': content,
            'sent_at': message.sent_at
        }))
        # Mark as delivered
        await db.update_message_status(message.id, 'delivered')
    else:
        # User offline - message waits in DB
        pass

    # 3. Acknowledge to sender
    await websocket.send(json.dumps({
        'type': 'ack',
        'message_id': message.id,
        'status': 'sent'
    }))
\`\`\``,

  whyItMatters: 'Understanding the flow end-to-end is essential for debugging and optimization.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Message delivery',
    howTheyDoIt: 'XMPP protocol. Store and forward model. Messages stored until delivered.',
  },

  keyPoints: [
    'Store before delivering',
    'Push to online recipients',
    'Store for offline recipients',
  ],

  keyConcepts: [
    { title: 'Store-and-Forward', explanation: 'Store message, then deliver', icon: '📦' },
    { title: 'Acknowledgment', explanation: 'Confirm message received', icon: '✓' },
  ],
};

const step3: GuidedStep = {
  id: 'whatsapp-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Complete messaging flow',
    taskDescription: 'Implement send/receive with real-time delivery',
    successCriteria: [
      'Store message on send',
      'Push to online recipient',
      'Acknowledge to sender',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Implement the message handler',
    level2: 'Store → check connection → push or queue → ack',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Receipts & Groups
// =============================================================================

// =============================================================================
// STEP 4: Delivery Receipts (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '✓',
  scenario: "Phase 2 begins! Users want to know if messages were received!",
  hook: "User A sends an important message. Did it go through? Was it delivered? Did they read it? Those checkmarks matter!",
  challenge: "NEW REQUIREMENT: FR-3 - Delivery receipts (sent ✓, delivered ✓✓, read ✓✓ blue).",
  illustration: 'delivery-receipts',
};

const step4Celebration: CelebrationContent = {
  emoji: '✓',
  message: 'Delivery receipts working!',
  achievement: 'Users see sent, delivered, and read status',
  metrics: [
    { label: 'Sent receipt', after: '✓' },
    { label: 'Delivered receipt', after: '✓✓' },
    { label: 'Read receipt', after: '✓✓ (blue)' },
  ],
  nextTeaser: "Now let's add group chats...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Delivery Receipts',

  frameworkReminder: {
    question: "How do users know messages were received?",
    connection: "FR-3 requires tracking message status. Each status change triggers a notification."
  },

  conceptExplanation: `**Message Status States:**
\`\`\`
SENT ✓       → Server received message
DELIVERED ✓✓ → Recipient's device received message
READ ✓✓(blue)→ Recipient opened the chat
\`\`\`

**Status Update Flow:**

**1. SENT (Server Received):**
\`\`\`python
# When sender's message arrives at server
message = store_message(data)
send_to_sender({
    'type': 'receipt',
    'message_id': message.id,
    'status': 'sent'
})
\`\`\`

**2. DELIVERED (Recipient's Device Received):**
\`\`\`python
# When pushed to recipient's WebSocket
await recipient_ws.send(message)
# Recipient's client sends back:
{ 'type': 'delivered', 'message_id': 123 }

# Server updates and notifies sender:
db.update_message_status(123, 'delivered')
send_to_sender({
    'type': 'receipt',
    'message_id': 123,
    'status': 'delivered'
})
\`\`\`

**3. READ (Recipient Opened Chat):**
\`\`\`python
# When recipient opens the conversation
{ 'type': 'read', 'conversation_id': 456, 'last_message_id': 123 }

# Server notifies sender for each unread message:
send_to_sender({
    'type': 'receipt',
    'message_id': 123,
    'status': 'read'
})
\`\`\`

**Batching Receipts:**
\`\`\`python
# Don't send individual receipts for each message
# Batch: "Read up to message_id 123"
{ 'type': 'read_batch', 'conversation_id': 456, 'up_to': 123 }
\`\`\``,

  whyItMatters: 'Receipts build trust. Users need to know their messages were delivered.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'The famous double checkmark',
    howTheyDoIt: 'Single check = server received. Double check = delivered to device. Blue = read.',
  },

  keyPoints: [
    'Three states: sent, delivered, read',
    'Each state triggers notification to sender',
    'Batch read receipts',
  ],

  keyConcepts: [
    { title: 'Delivery Receipt', explanation: 'Message reached device', icon: '✓✓' },
    { title: 'Read Receipt', explanation: 'Message was opened', icon: '👁️' },
  ],
};

const step4: GuidedStep = {
  id: 'whatsapp-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Delivery receipts',
    taskDescription: 'Implement sent/delivered/read receipts',
    successCriteria: [
      'Track message status (sent, delivered, read)',
      'Notify sender on status change',
      'Display checkmarks in UI',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Track status in database, send receipt on change',
    level2: 'Sent on store, delivered on push, read when chat opened',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Online/Offline Presence (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🟢',
  scenario: "Users want to know if friends are online!",
  hook: "'Last seen' and 'online' status help users know when to expect replies. Is John online? When was he last active?",
  challenge: "Implement online/offline presence with 'last seen' timestamps.",
  illustration: 'presence',
};

const step5Celebration: CelebrationContent = {
  emoji: '🟢',
  message: 'Presence system working!',
  achievement: 'Users see online status and last seen',
  metrics: [
    { label: 'Online status', after: '🟢 Real-time' },
    { label: 'Last seen', after: 'Accurate' },
  ],
  nextTeaser: "Now let's implement group chats...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Online Presence & Last Seen',

  frameworkReminder: {
    question: "How do users know if friends are online?",
    connection: "Presence requires tracking connection state and broadcasting changes."
  },

  conceptExplanation: `**Presence States:**
\`\`\`
🟢 Online    → WebSocket connected, app in foreground
⚫ Offline   → No connection
Last seen   → Timestamp of last activity
\`\`\`

**Tracking Presence:**
\`\`\`python
# User table
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  is_online BOOLEAN DEFAULT false,
  last_seen_at TIMESTAMP,
  ...
);

# On WebSocket connect
async def on_connect(websocket, user_id):
    connections[user_id] = websocket
    await db.update_user(user_id, is_online=True)
    await broadcast_presence(user_id, 'online')

# On WebSocket disconnect
async def on_disconnect(user_id):
    del connections[user_id]
    await db.update_user(user_id, is_online=False, last_seen_at=NOW())
    await broadcast_presence(user_id, 'offline')
\`\`\`

**Who gets presence updates?**
\`\`\`python
async def broadcast_presence(user_id, status):
    # Get user's contacts who are online
    contacts = await db.get_user_contacts(user_id)
    online_contacts = [c for c in contacts if c.id in connections]

    for contact in online_contacts:
        await connections[contact.id].send({
            'type': 'presence',
            'user_id': user_id,
            'status': status,
            'last_seen': timestamp
        })
\`\`\`

**Optimization - Use Redis:**
\`\`\`python
# Store presence in Redis for fast lookups
redis.set(f"presence:{user_id}", "online", ex=60)

# Heartbeat every 30 seconds to keep alive
async def heartbeat(user_id):
    redis.expire(f"presence:{user_id}", 60)
\`\`\``,

  whyItMatters: 'Presence makes chat feel alive. But it\'s expensive to broadcast to everyone.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Last seen feature',
    howTheyDoIt: 'Privacy controls let users hide last seen. Only shows to contacts.',
  },

  keyPoints: [
    'Track on connect/disconnect',
    'Only broadcast to contacts',
    'Redis for fast presence lookups',
  ],

  keyConcepts: [
    { title: 'Presence', explanation: 'Online/offline status', icon: '🟢' },
    { title: 'Last Seen', explanation: 'When user was last active', icon: '🕐' },
  ],
};

const step5: GuidedStep = {
  id: 'whatsapp-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'NFR: Presence system',
    taskDescription: 'Implement online/offline presence',
    componentsNeeded: [
      { type: 'cache', reason: 'Fast presence lookups', displayName: 'Redis Presence' },
    ],
    successCriteria: [
      'Track online/offline status',
      'Store last seen timestamp',
      'Broadcast presence to contacts',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Redis for presence tracking',
    level2: 'Update on connect/disconnect, broadcast to online contacts',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Group Chats (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '👥',
  scenario: "Users want to chat with multiple people at once!",
  hook: "Family group chat. Work team chat. Friend group chat. 1-to-1 isn't enough - we need groups!",
  challenge: "NEW REQUIREMENT: FR-4 - Group chats with multiple participants.",
  illustration: 'group-chat',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Full-featured chat!',
  achievement: 'Receipts, presence, and group chats working',
  metrics: [
    { label: 'Delivery receipts', after: '✓✓' },
    { label: 'Presence', after: '🟢' },
    { label: 'Group chats', after: '✓ Up to 256 members' },
  ],
  nextTeaser: "Phase 3: What if users are offline?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Group Chat Architecture',

  frameworkReminder: {
    question: "How do we send messages to multiple people?",
    connection: "FR-4 requires fan-out to all group members. This is a write amplification problem."
  },

  conceptExplanation: `**Group Chat Data Model:**
\`\`\`sql
CREATE TABLE groups (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  created_by BIGINT,
  created_at TIMESTAMP,
  max_members INT DEFAULT 256
);

CREATE TABLE group_members (
  group_id BIGINT,
  user_id BIGINT,
  role VARCHAR(20),  -- admin, member
  joined_at TIMESTAMP,
  PRIMARY KEY (group_id, user_id)
);
\`\`\`

**Sending to a Group (Fan-Out):**
\`\`\`python
async def send_group_message(sender_id, group_id, content):
    # 1. Store message once
    message = await db.insert_message(
        conversation_id=group_id,
        sender_id=sender_id,
        content=content
    )

    # 2. Get all group members
    members = await db.get_group_members(group_id)

    # 3. Fan-out to all online members
    for member in members:
        if member.user_id == sender_id:
            continue  # Don't send to sender

        ws = connections.get(member.user_id)
        if ws:
            await ws.send({
                'type': 'group_message',
                'group_id': group_id,
                'message': message
            })
        else:
            # Queue for offline delivery
            await queue_for_delivery(member.user_id, message)
\`\`\`

**Read Receipts in Groups:**
\`\`\`sql
CREATE TABLE message_reads (
  message_id BIGINT,
  user_id BIGINT,
  read_at TIMESTAMP,
  PRIMARY KEY (message_id, user_id)
);
\`\`\`

**Optimization - Message stored ONCE:**
- Don't copy message for each recipient
- Store once, fan-out delivery
- Track delivery/read per user`,

  whyItMatters: 'Groups are where most messaging happens. Fan-out is a core scaling challenge.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Group chats',
    howTheyDoIt: 'Max 256 members originally (now 1024). Message stored once, delivered to each member.',
  },

  keyPoints: [
    'Store message once',
    'Fan-out to all members',
    'Track delivery per user',
  ],

  keyConcepts: [
    { title: 'Fan-Out', explanation: 'Send to multiple recipients', icon: '📢' },
    { title: 'Write Amplification', explanation: 'One write triggers many', icon: '📈' },
  ],
};

const step6: GuidedStep = {
  id: 'whatsapp-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Group chats',
    taskDescription: 'Implement group messaging with fan-out',
    successCriteria: [
      'Create/manage groups',
      'Fan-out messages to all members',
      'Track delivery per member',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Fan-out to all group members',
    level2: 'Store once, deliver to each, track per-user status',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Scale & Reliability
// =============================================================================

// =============================================================================
// STEP 7: Offline Message Delivery (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📴',
  scenario: "Phase 3 begins! Messages are being LOST!",
  hook: "User A sends a message while User B has no internet. When User B comes back online... the message never arrives! Messages must NEVER be lost!",
  challenge: "Implement guaranteed delivery for offline users.",
  illustration: 'offline-delivery',
};

const step7Celebration: CelebrationContent = {
  emoji: '📴',
  message: 'Offline delivery guaranteed!',
  achievement: 'Messages delivered even if recipient is offline',
  metrics: [
    { label: 'Message loss', before: 'Possible', after: '0%' },
    { label: 'Offline queue', after: '✓ Active' },
  ],
  nextTeaser: "Now let's add message queues for scale...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Guaranteed Message Delivery',

  frameworkReminder: {
    question: "What happens when users are offline?",
    connection: "Messages must be stored until the recipient comes online and confirms delivery."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
User A sends message → Server → User B (offline!)
                                    ↓
                              Message lost!
\`\`\`

**Solution: Store and Forward**
\`\`\`
User A sends → Server stores → Try delivery → Failed (offline)
                     ↓
              Message stays in DB with status='pending'
                     ↓
              User B comes online
                     ↓
              Server delivers pending messages
                     ↓
              User B confirms receipt
                     ↓
              Status → 'delivered'
\`\`\`

**Implementation:**
\`\`\`python
async def on_user_connect(user_id, websocket):
    connections[user_id] = websocket

    # Deliver all pending messages
    pending = await db.get_pending_messages(user_id)
    for message in pending:
        try:
            await websocket.send(json.dumps(message))
            await db.mark_message_delivered(message.id)
        except:
            # Connection lost, will retry next connect
            break
\`\`\`

**Per-User Message Queue:**
\`\`\`sql
CREATE TABLE message_queue (
  id BIGINT PRIMARY KEY,
  recipient_id BIGINT,
  message_id BIGINT,
  created_at TIMESTAMP,
  retry_count INT DEFAULT 0,
  INDEX (recipient_id, created_at)
);
\`\`\`

**Delivery Confirmation:**
\`\`\`python
# Client must acknowledge receipt
{ 'type': 'ack', 'message_id': 123 }

# Only then remove from queue
async def handle_ack(user_id, message_id):
    await db.delete_from_queue(user_id, message_id)
    await db.update_message_status(message_id, 'delivered')
\`\`\``,

  whyItMatters: 'Message loss is unacceptable. Users trust that messages will be delivered.',

  famousIncident: {
    title: 'WhatsApp Message Reliability',
    company: 'WhatsApp',
    year: '2016',
    whatHappened: 'WhatsApp built reputation on "messages always delivered". Store and forward model.',
    lessonLearned: 'Reliability is non-negotiable for messaging.',
    icon: '✓✓',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Offline message delivery',
    howTheyDoIt: 'Messages stored until delivered. Retry on connect. Keep for 30 days.',
  },

  keyPoints: [
    'Store until delivered',
    'Retry on reconnect',
    'Require acknowledgment',
  ],

  keyConcepts: [
    { title: 'Store and Forward', explanation: 'Keep until delivered', icon: '📦' },
    { title: 'Acknowledgment', explanation: 'Confirm receipt', icon: '✓' },
  ],
};

const step7: GuidedStep = {
  id: 'whatsapp-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Guaranteed delivery',
    taskDescription: 'Implement offline message queue',
    successCriteria: [
      'Queue messages for offline users',
      'Deliver on reconnect',
      'Require acknowledgment',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Queue messages when recipient is offline',
    level2: 'Deliver pending on connect, wait for ack before removing',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Message Queues for Scale (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📬',
  scenario: "Your chat server is overwhelmed!",
  hook: "100 million messages per hour. One server can't process them all. Messages are getting dropped during peak hours!",
  challenge: "Add message queues to handle high throughput.",
  illustration: 'message-queue',
};

const step8Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Message queues handling the load!',
  achievement: 'Async processing scales to millions of messages',
  metrics: [
    { label: 'Throughput', after: '100M/hour' },
    { label: 'Processing', after: 'Async queued' },
  ],
  nextTeaser: "Now let's add load balancing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues for High Throughput',

  frameworkReminder: {
    question: "How do we handle 100M messages/hour?",
    connection: "Synchronous processing doesn't scale. Message queues decouple receipt from processing."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
Receive message → Store → Fan-out → Push (all synchronous)
At high load, processing backs up and messages drop.
\`\`\`

**Solution: Queue-Based Architecture**
\`\`\`
Receive → Enqueue → ACK immediately
              ↓
     Workers process async
              ↓
     Store → Fan-out → Push
\`\`\`

**Kafka Topics:**
\`\`\`
incoming-messages   → Message Processing Workers
delivery-tasks      → Delivery Workers
receipt-events      → Receipt Processing Workers
presence-events     → Presence Workers
\`\`\`

**Message Flow with Queues:**
\`\`\`python
# 1. Receive and enqueue (fast path)
async def receive_message(websocket, data):
    # Generate ID and enqueue - return immediately
    message_id = snowflake.generate()
    await kafka.produce('incoming-messages', {
        'id': message_id,
        'sender_id': get_user_id(websocket),
        'recipient_id': data['to'],
        'content': data['content']
    })

    # ACK to sender immediately
    await websocket.send({'type': 'sent', 'id': message_id})

# 2. Worker processes async
async def message_worker():
    async for event in kafka.consume('incoming-messages'):
        # Store message
        await db.store_message(event)

        # Queue delivery task
        await kafka.produce('delivery-tasks', {
            'message_id': event['id'],
            'recipient_id': event['recipient_id']
        })

# 3. Delivery worker
async def delivery_worker():
    async for task in kafka.consume('delivery-tasks'):
        ws = connections.get(task['recipient_id'])
        if ws:
            message = await db.get_message(task['message_id'])
            await ws.send(message)
\`\`\``,

  whyItMatters: 'Message queues enable independent scaling. Essential for high-throughput systems.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Processing billions of messages',
    howTheyDoIt: 'Erlang queues for internal processing. Extremely efficient actor model.',
  },

  keyPoints: [
    'Receive → enqueue → ack immediately',
    'Workers process async',
    'Scale workers independently',
  ],

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Kafka for async processing', icon: '📬' },
    { title: 'Decoupling', explanation: 'Separate receipt from processing', icon: '🔓' },
  ],
};

const step8: GuidedStep = {
  id: 'whatsapp-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Scale message processing',
    taskDescription: 'Add message queue for async processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue messages for processing', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Add Message Queue',
      'Enqueue on receive',
      'Workers process async',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Kafka for message queuing',
    level2: 'Receive → enqueue → ack fast, workers process async',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Load Balancing WebSocket Connections (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "One server can only handle 100K WebSocket connections!",
  hook: "You have 50 million online users. That's 500 servers just for connections. And they need to find each other across servers!",
  challenge: "Add load balancing for WebSocket connections.",
  illustration: 'load-balancer',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Scalable messaging!',
  achievement: 'Offline delivery, message queues, distributed connections',
  metrics: [
    { label: 'Offline delivery', after: 'Guaranteed' },
    { label: 'Throughput', after: '100M/hour' },
    { label: 'Connections', after: '50M distributed' },
  ],
  nextTeaser: "Phase 4: End-to-end encryption!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing WebSocket Connections',

  frameworkReminder: {
    question: "How do we handle 50M concurrent connections?",
    connection: "Single server can handle ~100K connections. We need to distribute across hundreds of servers."
  },

  conceptExplanation: `**The Challenge:**
- Each WebSocket is a long-lived connection
- Can't just round-robin each request
- Need to route messages to the RIGHT server

**Architecture:**
\`\`\`
Client → Load Balancer → Chat Server 1 (User A connected here)
                       → Chat Server 2 (User B connected here)
                       → Chat Server 3
                       → ...
\`\`\`

**Connection Registry (Redis):**
\`\`\`python
# On connect: register where user is connected
async def on_connect(server_id, user_id):
    redis.set(f"connection:{user_id}", server_id, ex=300)

# On heartbeat: refresh TTL
async def heartbeat(user_id):
    redis.expire(f"connection:{user_id}", 300)

# On disconnect: remove
async def on_disconnect(user_id):
    redis.delete(f"connection:{user_id}")
\`\`\`

**Routing Messages:**
\`\`\`python
async def route_message(recipient_id, message):
    # 1. Find which server has the connection
    server_id = redis.get(f"connection:{recipient_id}")

    if not server_id:
        # User offline - queue for later
        await queue_message(recipient_id, message)
        return

    if server_id == MY_SERVER_ID:
        # I have the connection - deliver directly
        await connections[recipient_id].send(message)
    else:
        # Another server has it - forward via pub/sub
        await redis.publish(f"server:{server_id}", {
            'type': 'deliver',
            'recipient_id': recipient_id,
            'message': message
        })
\`\`\`

**Sticky Sessions:**
\`\`\`
Load balancer uses consistent hashing:
User A → always routes to Server 3
User B → always routes to Server 7
\`\`\``,

  whyItMatters: 'Distributing WebSocket connections is unique to real-time systems. Different from HTTP load balancing.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Handling 2B users',
    howTheyDoIt: 'Erlang servers handle 2M connections each. Custom routing. Only ~50 engineers for 2B users.',
  },

  keyPoints: [
    'Register connection location',
    'Route via pub/sub for cross-server',
    'Sticky sessions help',
  ],

  keyConcepts: [
    { title: 'Connection Registry', explanation: 'Track user → server mapping', icon: '📍' },
    { title: 'Pub/Sub Routing', explanation: 'Forward messages between servers', icon: '📡' },
  ],
};

const step9: GuidedStep = {
  id: 'whatsapp-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Distributed connections',
    taskDescription: 'Add load balancer with connection routing',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute connections', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Register connection locations',
      'Route messages across servers',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add LB and track connection locations',
    level2: 'Redis for connection registry, pub/sub for cross-server routing',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Security & Advanced Features
// =============================================================================

// =============================================================================
// STEP 10: End-to-End Encryption (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🔐',
  scenario: "Phase 4 begins! Users demand privacy!",
  hook: "Users want their messages to be private - even from YOUR servers! If your database is hacked, messages should be unreadable.",
  challenge: "Implement end-to-end encryption.",
  illustration: 'encryption',
};

const step10Celebration: CelebrationContent = {
  emoji: '🔐',
  message: 'End-to-end encryption active!',
  achievement: 'Only sender and recipient can read messages',
  metrics: [
    { label: 'Encryption', after: 'E2E' },
    { label: 'Server can read', after: 'Never' },
  ],
  nextTeaser: "Now let's add media sharing...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'End-to-End Encryption (E2EE)',

  frameworkReminder: {
    question: "How do we ensure only the intended recipient can read messages?",
    connection: "E2EE means the server only sees encrypted blobs. Even if hacked, messages are safe."
  },

  conceptExplanation: `**Why E2EE?**
- Server breach → messages still safe
- Government requests → can't hand over what you can't read
- User trust → privacy by design

**The Signal Protocol (used by WhatsApp):**

**1. Key Exchange (X3DH):**
\`\`\`
User A has: Identity key, Signed pre-key, One-time pre-keys
User B has: Same

First message:
A fetches B's public keys from server
A generates shared secret using Diffie-Hellman
A encrypts message with shared secret
B receives and derives same shared secret
B decrypts message
\`\`\`

**2. Double Ratchet (Forward Secrecy):**
\`\`\`
After initial exchange:
Each message → new key derived
Even if one key compromised → only one message exposed
Keys "ratchet" forward, can't go back
\`\`\`

**Simplified Flow:**
\`\`\`javascript
// Sender
const sharedSecret = deriveSharedSecret(myPrivateKey, recipientPublicKey);
const encryptedMessage = encrypt(message, sharedSecret);
send(encryptedMessage);

// Recipient
const sharedSecret = deriveSharedSecret(myPrivateKey, senderPublicKey);
const message = decrypt(encryptedMessage, sharedSecret);
\`\`\`

**What Server Sees:**
\`\`\`json
{
  "sender_id": "user_a",
  "recipient_id": "user_b",
  "ciphertext": "aGVsbG8gd29ybGQ=...",  // Gibberish!
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

**Challenges:**
- Key management is complex
- Group chats: share key with all members
- Multi-device: sync keys across devices`,

  whyItMatters: 'E2EE is the gold standard for messaging privacy. WhatsApp made it mainstream.',

  famousIncident: {
    title: 'WhatsApp E2EE Rollout',
    company: 'WhatsApp',
    year: '2016',
    whatHappened: 'WhatsApp enabled E2EE for 1B+ users. Largest deployment of end-to-end encryption ever.',
    lessonLearned: 'Privacy at scale is possible.',
    icon: '🔐',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'End-to-end encryption',
    howTheyDoIt: 'Signal Protocol. E2EE for all messages. Server never sees plaintext.',
  },

  keyPoints: [
    'Server only sees ciphertext',
    'Keys exchanged via Signal Protocol',
    'Forward secrecy with key ratcheting',
  ],

  keyConcepts: [
    { title: 'E2EE', explanation: 'Only endpoints can read', icon: '🔐' },
    { title: 'Signal Protocol', explanation: 'Industry standard E2EE', icon: '📡' },
  ],
};

const step10: GuidedStep = {
  id: 'whatsapp-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: End-to-end encryption',
    taskDescription: 'Implement E2EE using Signal Protocol concepts',
    successCriteria: [
      'Exchange public keys',
      'Encrypt messages client-side',
      'Server only sees ciphertext',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Implement key exchange and client-side encryption',
    level2: 'Exchange public keys, derive shared secret, encrypt before send',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: Media Sharing (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '📷',
  scenario: "Users want to share photos and videos!",
  hook: "Text is great, but users want to send photos, videos, voice messages, and documents. Media is HUGE compared to text!",
  challenge: "Implement media sharing with efficient storage and delivery.",
  illustration: 'media-sharing',
};

const step11Celebration: CelebrationContent = {
  emoji: '📷',
  message: 'Media sharing working!',
  achievement: 'Users can share photos, videos, and documents',
  metrics: [
    { label: 'Media types', after: 'Photo, Video, Audio, Docs' },
    { label: 'Encrypted', after: '✓ E2EE' },
  ],
  nextTeaser: "One final step: multi-device sync!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Media Sharing Architecture',

  frameworkReminder: {
    question: "How do we handle photos and videos?",
    connection: "Media is 1000x larger than text. Need separate storage and delivery path."
  },

  conceptExplanation: `**Text vs Media:**
| Type | Size | Storage |
|------|------|---------|
| Text message | ~1 KB | Database |
| Photo | 1-5 MB | Object Storage |
| Video | 10-100 MB | Object Storage |

**Media Upload Flow:**
\`\`\`
1. Client encrypts media locally (E2EE!)
2. Client uploads encrypted blob to S3
3. Client sends message with media URL + encryption key
4. Recipient downloads blob from S3
5. Recipient decrypts locally
\`\`\`

**Implementation:**
\`\`\`python
# 1. Client-side: Encrypt and upload
encrypted_blob = encrypt(photo, media_key)
upload_url = await get_presigned_upload_url()
await upload_to_s3(upload_url, encrypted_blob)

# 2. Send message with reference
await send_message({
    'type': 'media',
    'media_type': 'image',
    'media_url': 's3://bucket/encrypted_12345',
    'media_key': encrypted_media_key,  # Encrypted with recipient's key
    'thumbnail': base64_thumbnail  # Small preview
})

# 3. Recipient downloads and decrypts
blob = await download_from_s3(media_url)
photo = decrypt(blob, media_key)
\`\`\`

**Optimizations:**
- **Thumbnails**: Send small preview inline
- **Progressive download**: Start viewing while downloading
- **CDN**: Cache popular media at edge
- **Compression**: Compress before upload

**WhatsApp's Approach:**
\`\`\`
Photo upload:
1. Compress to max 16MB
2. Encrypt with AES-256
3. Upload to WhatsApp servers
4. Send encrypted reference
5. Delete from server after 30 days
\`\`\``,

  whyItMatters: 'Media is the majority of chat traffic by bytes. Efficient handling is essential.',

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Photo sharing',
    howTheyDoIt: 'Media encrypted client-side. Stored encrypted on servers. Auto-deleted after delivery.',
  },

  keyPoints: [
    'Encrypt media client-side',
    'Store encrypted blob in S3',
    'Send reference + key in message',
  ],

  keyConcepts: [
    { title: 'Media Upload', explanation: 'Encrypted blob to S3', icon: '📤' },
    { title: 'Thumbnail', explanation: 'Small preview sent inline', icon: '🖼️' },
  ],
};

const step11: GuidedStep = {
  id: 'whatsapp-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: Media sharing',
    taskDescription: 'Implement encrypted media upload and sharing',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store media files', displayName: 'Media Storage (S3)' },
    ],
    successCriteria: [
      'Encrypt media client-side',
      'Upload to Object Storage',
      'Share reference in message',
    ],
  },

  celebration: step11Celebration,

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
  },

  hints: {
    level1: 'Add S3 for media storage',
    level2: 'Encrypt → upload to S3 → send URL + key in message',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 12: Multi-Device Sync (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '📱',
  scenario: "Users want to use chat on multiple devices!",
  hook: "User has a phone, tablet, and laptop. They want to see the SAME chats on all devices. Send from laptop, see on phone.",
  challenge: "Implement multi-device synchronization.",
  illustration: 'multi-device',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered WhatsApp system design!',
  achievement: 'From basic chat to secure, scalable, multi-device messaging',
  metrics: [
    { label: 'Messages/day', after: '100B+' },
    { label: 'Concurrent users', after: '2B+' },
    { label: 'Features', after: 'E2EE, Media, Multi-device' },
    { label: 'Delivery guarantee', after: '100%' },
  ],
  nextTeaser: "You've completed the WhatsApp journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Device Synchronization',

  frameworkReminder: {
    question: "How do we sync messages across devices?",
    connection: "Multi-device with E2EE is HARD. Each device needs keys, and messages need to reach all devices."
  },

  conceptExplanation: `**The Challenge:**
- User has phone + tablet + laptop
- All devices need E2EE keys
- Messages sent TO user must reach all devices
- Messages sent FROM any device must sync to others

**Approach 1: Primary Device (WhatsApp original)**
\`\`\`
Phone is primary - always required
Web/Desktop → connects through phone
Messages routed via phone
Pro: Simpler key management
Con: Phone must be online
\`\`\`

**Approach 2: Independent Devices (WhatsApp Multi-Device)**
\`\`\`
Each device has own keys
Messages encrypted for ALL device keys
Sender encrypts message N times (once per device)
\`\`\`

**Multi-Device E2EE:**
\`\`\`python
# Sender encrypts for each of recipient's devices
def send_message(recipient_id, message):
    devices = get_user_devices(recipient_id)

    for device in devices:
        encrypted = encrypt(message, device.public_key)
        send_to_device(device.id, encrypted)
\`\`\`

**Device Registration:**
\`\`\`sql
CREATE TABLE user_devices (
  user_id BIGINT,
  device_id VARCHAR(64),
  device_name VARCHAR(100),
  public_key TEXT,
  created_at TIMESTAMP,
  last_active_at TIMESTAMP,
  PRIMARY KEY (user_id, device_id)
);
\`\`\`

**Message Sync:**
\`\`\`
1. User sends message from laptop
2. Message stored with device_id
3. Other devices poll/sync on connect
4. Each device downloads messages it hasn't seen
5. Message marked as synced per device
\`\`\`

**Conflict Resolution:**
- Messages ordered by timestamp (Snowflake ID)
- "Delete for everyone" synced across devices
- Read status synced`,

  whyItMatters: 'Multi-device is expected in modern messaging. WhatsApp took years to get it right with E2EE.',

  famousIncident: {
    title: 'WhatsApp Multi-Device Launch',
    company: 'WhatsApp',
    year: '2021',
    whatHappened: 'WhatsApp finally launched independent multi-device after years of engineering. Previously required phone connection.',
    lessonLearned: 'Multi-device with E2EE is extremely complex. Took years to solve.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'WhatsApp',
    scenario: 'Multi-device support',
    howTheyDoIt: 'Independent device keys. Encrypt for each device. Sync on connect.',
  },

  keyPoints: [
    'Each device has own keys',
    'Encrypt message for all devices',
    'Sync on connect',
  ],

  keyConcepts: [
    { title: 'Multi-Device', explanation: 'Same account, multiple devices', icon: '📱' },
    { title: 'Device Keys', explanation: 'Each device has unique keys', icon: '🔑' },
  ],
};

const step12: GuidedStep = {
  id: 'whatsapp-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Multi-device sync',
    taskDescription: 'Implement multi-device synchronization',
    successCriteria: [
      'Register multiple devices per user',
      'Encrypt for all devices',
      'Sync messages across devices',
    ],
  },

  celebration: step12Celebration,

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
  },

  hints: {
    level1: 'Track devices per user, encrypt for each',
    level2: 'Device registry, encrypt N times, sync on connect',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const whatsappProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'whatsapp-progressive',
  title: 'Design WhatsApp',
  description: 'Build an evolving messaging platform from basic chat to secure, scalable messaging',
  difficulty: 'beginner', // Starts beginner, evolves to expert
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '💬',
    hook: "Welcome to ChatNow! You're building the next WhatsApp.",
    scenario: "Your journey: Start with basic messaging, add delivery receipts and groups, scale to billions of messages, and implement end-to-end encryption.",
    challenge: "Can you build a messaging platform that handles 100 billion messages per day?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    // Phase 1: Beginner (Steps 1-3)
    step1, step2, step3,
    // Phase 2: Intermediate (Steps 4-6)
    step4, step5, step6,
    // Phase 3: Advanced (Steps 7-9)
    step7, step8, step9,
    // Phase 4: Expert (Steps 10-12)
    step10, step11, step12,
  ],

  concepts: [
    'WebSocket Connections',
    'Message Data Model',
    'Real-Time Delivery',
    'Delivery Receipts',
    'Online/Offline Presence',
    'Group Chat Fan-Out',
    'Offline Message Queuing',
    'Message Queues for Scale',
    'WebSocket Load Balancing',
    'End-to-End Encryption',
    'Media Sharing',
    'Multi-Device Synchronization',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 8: Distributed Locks',
    'Chapter 11: Stream Processing',
  ],
};

export default whatsappProgressiveGuidedTutorial;
