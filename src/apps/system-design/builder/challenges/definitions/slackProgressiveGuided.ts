import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Slack - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: Team messaging, channels, threads, real-time, search.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Send messages in channels
 * - FR-2: Create and join channels
 * - Build: Client → Server → Database, basic messaging
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Threads and replies
 * - FR-4: Direct messages
 * - Build: Threading model, DM conversations
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle thousands of workspaces
 * - Message search
 * - Build: Multi-tenancy, Elasticsearch, caching
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - File sharing
 * - Integrations/bots
 * - Enterprise features
 *
 * Key Teaching: Multi-tenant team collaboration. Different from 1:1 messaging.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a team collaboration platform like Slack",

  interviewer: {
    name: 'Rachel Kim',
    role: 'Product Manager at TeamChat',
    avatar: '👩‍💼',
  },

  questions: [
    {
      id: 'send-messages',
      category: 'functional',
      question: "What's the core action users take?",
      answer: "Send messages in channels! Team members post updates, ask questions, and collaborate in shared channels.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Channel-based messaging is the core",
    },
    {
      id: 'channels',
      category: 'functional',
      question: "How are conversations organized?",
      answer: "Channels! Teams create channels for different topics - #engineering, #marketing, #random. Users join channels relevant to them.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Channels organize team communication",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['send-messages', 'channels'],
  criticalFRQuestionIds: ['send-messages', 'channels'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Send messages in channels',
      description: 'Users post messages to shared channels',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Create and join channels',
      description: 'Create topic-based channels, users join relevant ones',
      emoji: '📢',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000',
    writesPerDay: '5M messages',
    readsPerDay: '50M message loads',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 60, peak: 200 },
    calculatedReadRPS: { average: 600, peak: 2000 },
    maxPayloadSize: '~10KB per message',
    storagePerRecord: '~2KB average',
    storageGrowthPerYear: '~5TB',
    redirectLatencySLA: 'Message delivery < 500ms',
    createLatencySLA: 'Send < 200ms',
  },

  architecturalImplications: [
    '✅ Read-heavy (10:1 ratio)',
    '✅ Real-time delivery essential',
    '✅ Multi-tenant (many workspaces)',
  ],

  outOfScope: [
    'Threads (Phase 2)',
    'Direct messages (Phase 2)',
    'Search (Phase 3)',
    'File sharing (Phase 4)',
  ],

  keyInsight: "Slack is MULTI-TENANT. Each workspace is isolated. Users see only their workspace's channels. This is different from global social networks.",

  thinkingFramework: {
    title: "Phase 1: Basic Channel Messaging",
    intro: "We have 2 simple requirements. Let's build channels and messaging.",

    steps: [
      {
        id: 'multi-tenant',
        title: 'Step 1: Multi-Tenant Architecture',
        alwaysAsk: "How do we isolate workspaces?",
        whyItMatters: "Each company has its own workspace. Data must be completely isolated.",
        expertBreakdown: {
          intro: "Multi-tenancy considerations:",
          points: [
            "Each workspace is a tenant",
            "Data isolated by workspace_id",
            "Users belong to workspaces",
            "Channels exist within workspaces"
          ]
        },
        icon: '🏢',
        category: 'functional'
      },
      {
        id: 'channel-model',
        title: 'Step 2: Channel Data Model',
        alwaysAsk: "How do channels work?",
        whyItMatters: "Channels are the organizational unit. Messages belong to channels.",
        expertBreakdown: {
          intro: "Channel structure:",
          points: [
            "Channels have names and descriptions",
            "Users join/leave channels",
            "Messages posted to channels",
            "Channel membership determines visibility"
          ]
        },
        icon: '📢',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client ↔ WebSocket Server → Database. Real-time messaging in channels.",
      whySimple: "This works for basic team chat. We'll add threads and search later.",
      nextStepPreview: "Step 1: Set up channel messaging"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic team chat works!",
    hookMessage: "But conversations get messy without threads. And no direct messages...",
    steps: [
      {
        id: 'threads',
        title: 'Phase 2: Threads & DMs',
        question: "How do we organize conversations within channels?",
        whyItMatters: "Threads keep channels clean",
        example: "Reply in thread, direct messages",
        icon: '🧵'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale',
        question: "How do we search across millions of messages?",
        whyItMatters: "Finding old messages is critical",
        example: "Elasticsearch, multi-tenant search",
        icon: '🔍'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Server (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💬',
  scenario: "Welcome to TeamChat! You're building the next Slack.",
  hook: "A startup team of 10 people wants to communicate. Email is too slow. They need real-time team messaging!",
  challenge: "Set up the basic system for team messaging.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your team chat platform is online!',
  achievement: 'Teams can connect to your service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Real-time', after: 'WebSocket ready' },
  ],
  nextTeaser: "But where do we store messages and channels?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tenant Team Chat Architecture',
  conceptExplanation: `**Multi-Tenant Model:**

\`\`\`
Workspace: Acme Corp (tenant)
├── Users: alice@acme.com, bob@acme.com
├── Channels: #general, #engineering, #random
└── Messages: Isolated to this workspace

Workspace: Startup Inc (different tenant)
├── Users: john@startup.io, jane@startup.io
├── Channels: #general, #product (different!)
└── Messages: Completely separate
\`\`\`

**Key Difference from WhatsApp:**
| WhatsApp | Slack |
|----------|-------|
| Global user base | Isolated workspaces |
| Phone number identity | Email + workspace |
| 1:1 and group chats | Channels + DMs |
| Consumer | Enterprise |

**Real-Time Requirement:**
- Messages appear instantly
- Typing indicators
- Presence (online/away)
- WebSocket connections

**API Design:**
\`\`\`
POST /workspaces/{ws}/channels         → Create channel
GET  /workspaces/{ws}/channels         → List channels
POST /workspaces/{ws}/channels/{ch}/messages → Send message
WS   /workspaces/{ws}/realtime         → Real-time connection
\`\`\``,

  whyItMatters: 'Multi-tenancy is fundamental. Each workspace must be completely isolated.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Serving millions of workspaces',
    howTheyDoIt: 'Each workspace is isolated. Sharding by workspace. Real-time via WebSocket.',
  },

  keyPoints: [
    'Workspace = tenant',
    'Data isolated by workspace',
    'WebSocket for real-time',
  ],

  keyConcepts: [
    { title: 'Multi-Tenant', explanation: 'Isolated workspaces', icon: '🏢' },
    { title: 'Workspace', explanation: 'Container for team data', icon: '📦' },
  ],
};

const step1: GuidedStep = {
  id: 'slack-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Team messaging',
    taskDescription: 'Add Client and App Server with WebSocket',
    componentsNeeded: [
      { type: 'client', reason: 'Team member using chat', displayName: 'TeamChat App' },
      { type: 'app_server', reason: 'Handles messages and channels', displayName: 'Chat Service' },
    ],
    successCriteria: [
      'Client added',
      'App Server added',
      'WebSocket connection ready',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server onto the canvas',
    level2: 'Connect them (WebSocket connection)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "We need to store workspaces, channels, and messages!",
  hook: "A team creates #engineering and posts updates. When they refresh the page... everything is gone! We need persistent storage.",
  challenge: "Add a database for workspaces, channels, and messages.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Data is now stored!',
  achievement: 'Workspaces, channels, and messages persisted',
  metrics: [
    { label: 'Workspaces', after: '✓ Stored' },
    { label: 'Channels', after: '✓ Stored' },
    { label: 'Messages', after: '✓ Stored' },
  ],
  nextTeaser: "Now let's implement the channel messaging flow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Team Chat Data Model',
  conceptExplanation: `**Core Tables:**

\`\`\`sql
CREATE TABLE workspaces (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  slug VARCHAR(50) UNIQUE,  -- acme-corp
  created_at TIMESTAMP
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255),
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP
);

CREATE TABLE workspace_members (
  workspace_id BIGINT,
  user_id BIGINT,
  role VARCHAR(20),  -- owner, admin, member
  joined_at TIMESTAMP,
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE channels (
  id BIGINT PRIMARY KEY,
  workspace_id BIGINT,
  name VARCHAR(80),
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  created_by BIGINT,
  created_at TIMESTAMP,
  UNIQUE (workspace_id, name)
);

CREATE TABLE channel_members (
  channel_id BIGINT,
  user_id BIGINT,
  joined_at TIMESTAMP,
  last_read_at TIMESTAMP,
  PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE messages (
  id BIGINT PRIMARY KEY,
  channel_id BIGINT,
  user_id BIGINT,
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (channel_id, created_at)
);
\`\`\`

**Key Relationships:**
\`\`\`
Workspace → has many → Channels
Workspace → has many → Members (users)
Channel → has many → Messages
Channel → has many → Members (subset of workspace)
\`\`\``,

  whyItMatters: 'The data model defines access patterns. Channel membership determines who sees what.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Storing billions of messages',
    howTheyDoIt: 'MySQL with Vitess sharding. Sharded by workspace_id for isolation.',
  },

  keyPoints: [
    'Workspace contains channels',
    'Channel membership for access',
    'Messages indexed by channel + time',
  ],

  keyConcepts: [
    { title: 'Channel', explanation: 'Topic-based conversation', icon: '📢' },
    { title: 'Membership', explanation: 'Who can see what', icon: '👥' },
  ],
};

const step2: GuidedStep = {
  id: 'slack-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Store channels and messages',
    taskDescription: 'Add Database for team data',
    componentsNeeded: [
      { type: 'database', reason: 'Store workspaces, channels, messages', displayName: 'TeamChat DB' },
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
// STEP 3: Channel Messaging Flow (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📨',
  scenario: "Let's wire up the complete messaging flow!",
  hook: "Alice posts 'Deployment complete!' in #engineering. Bob and Carol are in that channel. They should see it INSTANTLY!",
  challenge: "Implement real-time channel messaging.",
  illustration: 'message-flow',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic team chat works!',
  achievement: 'Channels and real-time messaging working',
  metrics: [
    { label: 'Channels', after: '✓ Working' },
    { label: 'Messages', after: '✓ Real-time' },
    { label: 'Multi-tenant', after: '✓ Isolated' },
  ],
  nextTeaser: "But conversations get messy. We need threads!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Channel Messaging',
  conceptExplanation: `**Message Flow:**

\`\`\`
1. Alice sends message to #engineering
   ↓
2. Server receives via WebSocket:
   { channel_id: 123, content: "Deployment complete!" }
   ↓
3. Server validates:
   - Is Alice in this channel?
   - Is channel in Alice's workspace?
   ↓
4. Server stores message in database
   ↓
5. Server finds all channel members
   ↓
6. Server broadcasts to online members via WebSocket
   ↓
7. Bob and Carol see message instantly!
\`\`\`

**Server Implementation:**
\`\`\`python
# Connection tracking per channel
channel_connections = {}  # channel_id → [websockets]

async def handle_message(ws, data):
    user = get_user_from_ws(ws)
    channel_id = data['channel_id']

    # Validate membership
    if not is_channel_member(user.id, channel_id):
        raise Forbidden()

    # Store message
    message = await db.create_message(
        channel_id=channel_id,
        user_id=user.id,
        content=data['content']
    )

    # Broadcast to channel
    await broadcast_to_channel(channel_id, {
        'type': 'message',
        'channel_id': channel_id,
        'message': serialize(message)
    })

async def broadcast_to_channel(channel_id, payload):
    connections = channel_connections.get(channel_id, [])
    for ws in connections:
        await ws.send(json.dumps(payload))
\`\`\`

**Channel Subscription:**
\`\`\`python
async def on_user_connect(ws, user_id, workspace_id):
    # Subscribe to all user's channels
    channels = await db.get_user_channels(user_id, workspace_id)
    for channel in channels:
        channel_connections[channel.id].append(ws)
\`\`\``,

  whyItMatters: 'Real-time is essential for team collaboration. Delayed messages hurt productivity.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Real-time messaging',
    howTheyDoIt: 'WebSocket with channel subscriptions. Message fanout to channel members.',
  },

  keyPoints: [
    'Validate channel membership',
    'Store then broadcast',
    'Subscribe to channels on connect',
  ],

  keyConcepts: [
    { title: 'Channel Subscription', explanation: 'Listen to channel updates', icon: '📡' },
    { title: 'Fanout', explanation: 'Send to all members', icon: '📢' },
  ],
};

const step3: GuidedStep = {
  id: 'slack-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time channel messaging',
    taskDescription: 'Implement message send and broadcast',
    successCriteria: [
      'Validate channel membership',
      'Store message',
      'Broadcast to channel members',
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
    level1: 'Validate membership, store, broadcast',
    level2: 'Check channel access, insert to DB, push to subscribers',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Threads & DMs
// =============================================================================

// =============================================================================
// STEP 4: Threaded Replies (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🧵',
  scenario: "Phase 2 begins! Channels are getting chaotic!",
  hook: "#general has 50 different conversations happening at once. It's impossible to follow! We need threads to organize discussions.",
  challenge: "NEW REQUIREMENT: FR-3 - Threaded replies to messages.",
  illustration: 'threads',
};

const step4Celebration: CelebrationContent = {
  emoji: '🧵',
  message: 'Threads are working!',
  achievement: 'Users can reply in threads',
  metrics: [
    { label: 'Threads', after: '✓ Working' },
    { label: 'Channel clutter', after: 'Reduced' },
  ],
  nextTeaser: "Now let's add direct messages...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Threaded Conversations',

  frameworkReminder: {
    question: "How do we organize conversations in busy channels?",
    connection: "FR-3 adds threads. Replies attach to parent messages, keeping channels clean."
  },

  conceptExplanation: `**Thread Model:**
\`\`\`
Channel #engineering:
├── Message 1: "Deployment starting" (parent)
│   ├── Reply 1a: "How long will it take?"
│   ├── Reply 1b: "About 30 min"
│   └── Reply 1c: "Done!"
├── Message 2: "Anyone free for code review?" (parent)
│   └── Reply 2a: "I can help"
└── Message 3: "Lunch?" (parent, no replies)
\`\`\`

**Data Model Update:**
\`\`\`sql
ALTER TABLE messages ADD COLUMN thread_id BIGINT;
ALTER TABLE messages ADD COLUMN reply_count INT DEFAULT 0;

-- thread_id points to parent message
-- NULL thread_id = top-level message
-- Non-NULL thread_id = reply in thread

CREATE INDEX idx_messages_thread ON messages(thread_id, created_at);
\`\`\`

**Sending a Reply:**
\`\`\`python
async def send_reply(channel_id, thread_id, user_id, content):
    # Get parent message
    parent = await db.get_message(thread_id)
    if parent.channel_id != channel_id:
        raise BadRequest("Thread not in channel")

    # Create reply
    message = await db.create_message(
        channel_id=channel_id,
        thread_id=thread_id,
        user_id=user_id,
        content=content
    )

    # Update parent reply count
    await db.increment_reply_count(thread_id)

    # Broadcast to thread followers
    await broadcast_to_thread(thread_id, message)

    # Also notify channel (collapsed preview)
    await notify_channel_of_thread_reply(channel_id, thread_id)
\`\`\`

**Thread Followers:**
\`\`\`sql
CREATE TABLE thread_followers (
  thread_id BIGINT,
  user_id BIGINT,
  PRIMARY KEY (thread_id, user_id)
);

-- Auto-follow when you:
-- 1. Start a thread
-- 2. Reply to a thread
-- 3. Get @mentioned in thread
\`\`\``,

  whyItMatters: 'Threads prevent channel chaos. Essential for busy teams.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Thread implementation',
    howTheyDoIt: 'thread_ts references parent. Collapsed in channel, expanded in sidebar.',
  },

  keyPoints: [
    'thread_id links to parent',
    'Reply count on parent',
    'Thread followers for notifications',
  ],

  keyConcepts: [
    { title: 'Thread', explanation: 'Conversation attached to message', icon: '🧵' },
    { title: 'Thread Follower', explanation: 'Notified of replies', icon: '👁️' },
  ],
};

const step4: GuidedStep = {
  id: 'slack-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Threaded replies',
    taskDescription: 'Implement threads with parent/reply model',
    successCriteria: [
      'Add thread_id to messages',
      'Reply to existing messages',
      'Track reply count and followers',
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
    level1: 'Add thread_id column referencing parent message',
    level2: 'thread_id = NULL for parent, non-NULL for reply',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Direct Messages (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '✉️',
  scenario: "Users need private conversations!",
  hook: "Alice wants to discuss salary with her manager. She can't post that in #general! We need direct messages.",
  challenge: "NEW REQUIREMENT: FR-4 - Direct messages between users.",
  illustration: 'direct-messages',
};

const step5Celebration: CelebrationContent = {
  emoji: '✉️',
  message: 'Direct messages working!',
  achievement: 'Users can have private conversations',
  metrics: [
    { label: 'DMs', after: '✓ Working' },
    { label: 'Privacy', after: '✓ Private' },
  ],
  nextTeaser: "Now let's add presence (online/away)...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Direct Messages',

  frameworkReminder: {
    question: "How do users have private conversations?",
    connection: "FR-4 adds DMs. These are like 2-person private channels."
  },

  conceptExplanation: `**DM vs Channel:**
| Aspect | Channel | DM |
|--------|---------|-----|
| Members | Many | 2 (or small group) |
| Discoverability | Listed | Private |
| Creation | Explicit | On first message |
| Naming | #engineering | Alice, Bob |

**Implementation Options:**

**Option 1: Treat DMs as Private Channels**
\`\`\`sql
-- DM is just a private channel with 2 members
CREATE TABLE conversations (
  id BIGINT PRIMARY KEY,
  workspace_id BIGINT,
  type VARCHAR(20),  -- 'channel', 'dm', 'group_dm'
  name VARCHAR(80),  -- NULL for DMs
  is_private BOOLEAN,
  created_at TIMESTAMP
);
\`\`\`

**Option 2: Separate DM Table**
\`\`\`sql
CREATE TABLE dm_conversations (
  id BIGINT PRIMARY KEY,
  workspace_id BIGINT,
  created_at TIMESTAMP
);

CREATE TABLE dm_participants (
  conversation_id BIGINT,
  user_id BIGINT,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE dm_messages (
  id BIGINT PRIMARY KEY,
  conversation_id BIGINT,
  user_id BIGINT,
  content TEXT,
  created_at TIMESTAMP
);
\`\`\`

**Creating/Getting DM:**
\`\`\`python
async def get_or_create_dm(workspace_id, user_ids):
    # Sort for consistent lookup
    user_ids = sorted(user_ids)

    # Check if DM exists
    existing = await db.query("""
        SELECT c.id FROM dm_conversations c
        JOIN dm_participants p1 ON c.id = p1.conversation_id
        JOIN dm_participants p2 ON c.id = p2.conversation_id
        WHERE c.workspace_id = ?
        AND p1.user_id = ? AND p2.user_id = ?
    """, workspace_id, user_ids[0], user_ids[1])

    if existing:
        return existing[0].id

    # Create new DM
    conv = await db.create_dm_conversation(workspace_id)
    for user_id in user_ids:
        await db.add_dm_participant(conv.id, user_id)

    return conv.id
\`\`\``,

  whyItMatters: 'DMs are essential for private communication within a workspace.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Direct messages',
    howTheyDoIt: 'DMs are special channels. Can have 1:1 or multi-party DMs.',
  },

  keyPoints: [
    'DMs are private 2-person conversations',
    'Created on first message',
    'Can extend to group DMs',
  ],

  keyConcepts: [
    { title: 'DM', explanation: 'Direct Message - private chat', icon: '✉️' },
    { title: 'Group DM', explanation: 'DM with 3+ people', icon: '👥' },
  ],
};

const step5: GuidedStep = {
  id: 'slack-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Direct messages',
    taskDescription: 'Implement direct message conversations',
    successCriteria: [
      'Create DM conversations',
      'Send messages in DMs',
      'Support group DMs',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Treat DMs as private channels or separate table',
    level2: 'Get-or-create pattern for DM lookup',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Presence (Online/Away) (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🟢',
  scenario: "Users want to know who's online!",
  hook: "Alice wants to ask Bob a quick question. Is he online? Away? In a meeting? Presence indicators help teams coordinate.",
  challenge: "Implement presence (online/away/DND).",
  illustration: 'presence',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Full-featured team chat!',
  achievement: 'Threads, DMs, and presence working',
  metrics: [
    { label: 'Threads', after: '✓ Working' },
    { label: 'DMs', after: '✓ Private' },
    { label: 'Presence', after: '🟢 Online' },
  ],
  nextTeaser: "Phase 3: Search and scale!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'User Presence',

  frameworkReminder: {
    question: "How do users know if teammates are available?",
    connection: "Presence shows online/away/DND status. Helps teams know who's available."
  },

  conceptExplanation: `**Presence States:**
\`\`\`
🟢 Active      → Online and recently active
🟡 Away        → Online but idle (5+ min)
🔴 Do Not Disturb → Online, no notifications
⚫ Offline     → Not connected
\`\`\`

**Tracking Presence:**
\`\`\`python
# Redis for real-time presence
# Key: workspace:{ws_id}:presence:{user_id}

async def set_presence(workspace_id, user_id, status):
    key = f"workspace:{workspace_id}:presence:{user_id}"
    await redis.hset(key, {
        'status': status,
        'last_active': now().isoformat()
    })
    await redis.expire(key, 300)  # 5 min TTL

    # Broadcast to workspace
    await broadcast_presence_change(workspace_id, user_id, status)

async def heartbeat(workspace_id, user_id):
    # Called every 30 seconds from client
    key = f"workspace:{workspace_id}:presence:{user_id}"
    await redis.expire(key, 300)
    await redis.hset(key, 'last_active', now().isoformat())
\`\`\`

**Auto-Away Detection:**
\`\`\`python
async def check_idle_users():
    # Run every minute
    for key in redis.scan("workspace:*:presence:*"):
        data = await redis.hgetall(key)
        last_active = parse(data['last_active'])

        if now() - last_active > timedelta(minutes=5):
            if data['status'] == 'active':
                await set_presence_auto_away(key)
\`\`\`

**Presence Subscription:**
\`\`\`python
async def on_workspace_connect(ws, user_id, workspace_id):
    # Set online
    await set_presence(workspace_id, user_id, 'active')

    # Get all presence in workspace
    presence_data = await get_workspace_presence(workspace_id)
    await ws.send({'type': 'presence_sync', 'data': presence_data})

async def on_disconnect(user_id, workspace_id):
    await set_presence(workspace_id, user_id, 'offline')
\`\`\``,

  whyItMatters: 'Presence helps teams coordinate. Know when to expect responses.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Presence at scale',
    howTheyDoIt: 'Redis for presence. Auto-away after idle. Custom status messages.',
  },

  keyPoints: [
    'Redis for real-time presence',
    'Heartbeat to maintain status',
    'Auto-away on idle',
  ],

  keyConcepts: [
    { title: 'Presence', explanation: 'Online status indicator', icon: '🟢' },
    { title: 'Heartbeat', explanation: 'Periodic status refresh', icon: '💓' },
  ],
};

const step6: GuidedStep = {
  id: 'slack-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'NFR: Presence system',
    taskDescription: 'Implement online/away/DND presence',
    componentsNeeded: [
      { type: 'cache', reason: 'Real-time presence storage', displayName: 'Redis Presence' },
    ],
    successCriteria: [
      'Track online/away/offline',
      'Heartbeat to maintain status',
      'Broadcast presence changes',
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
    level1: 'Add Redis for presence tracking',
    level2: 'Store status with TTL, heartbeat to refresh',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Search & Scale
// =============================================================================

// =============================================================================
// STEP 7: Message Search (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔍',
  scenario: "Phase 3 begins! Users can't find old messages!",
  hook: "'Where was that deployment doc that Bob shared last month?' Scrolling through thousands of messages is impossible. We need search!",
  challenge: "Implement message search.",
  illustration: 'search',
};

const step7Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Search is working!',
  achievement: 'Users can find messages across channels',
  metrics: [
    { label: 'Search', after: '✓ Full-text' },
    { label: 'Response time', after: '< 200ms' },
  ],
  nextTeaser: "Now let's add message queues for scale...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Search',

  frameworkReminder: {
    question: "How do users find old messages?",
    connection: "Search must be fast, respect permissions, and search across all accessible channels."
  },

  conceptExplanation: `**Search Requirements:**
- Full-text search on message content
- Filter by channel, user, date
- Respect channel membership (can't see private channels you're not in)
- Fast (< 200ms)

**Why Not Just Database?**
\`\`\`sql
-- This is slow and limited
SELECT * FROM messages
WHERE content LIKE '%deployment%'
AND channel_id IN (user's channels);
\`\`\`

**Solution: Elasticsearch**

\`\`\`json
{
  "mappings": {
    "properties": {
      "message_id": { "type": "keyword" },
      "workspace_id": { "type": "keyword" },
      "channel_id": { "type": "keyword" },
      "user_id": { "type": "keyword" },
      "content": {
        "type": "text",
        "analyzer": "standard"
      },
      "created_at": { "type": "date" }
    }
  }
}
\`\`\`

**Index on Send:**
\`\`\`python
async def index_message(message):
    await es.index(
        index=f"messages-{message.workspace_id}",
        id=message.id,
        body={
            'message_id': message.id,
            'workspace_id': message.workspace_id,
            'channel_id': message.channel_id,
            'user_id': message.user_id,
            'content': message.content,
            'created_at': message.created_at
        }
    )
\`\`\`

**Search with Permissions:**
\`\`\`python
async def search_messages(workspace_id, user_id, query, filters=None):
    # Get user's accessible channels
    accessible_channels = await get_user_channels(user_id, workspace_id)
    channel_ids = [c.id for c in accessible_channels]

    body = {
        "query": {
            "bool": {
                "must": {
                    "match": { "content": query }
                },
                "filter": [
                    { "terms": { "channel_id": channel_ids } }
                ]
            }
        },
        "sort": [{ "created_at": "desc" }],
        "highlight": {
            "fields": { "content": {} }
        }
    }

    return await es.search(
        index=f"messages-{workspace_id}",
        body=body
    )
\`\`\``,

  whyItMatters: 'Search is essential for knowledge retrieval. Old conversations have value.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Searching billions of messages',
    howTheyDoIt: 'Elasticsearch per workspace. Permission filtering. Highlighted results.',
  },

  keyPoints: [
    'Elasticsearch for full-text search',
    'Index per workspace for isolation',
    'Filter by accessible channels',
  ],

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Search message content', icon: '🔍' },
    { title: 'Permission Filter', explanation: 'Only search accessible channels', icon: '🔐' },
  ],
};

const step7: GuidedStep = {
  id: 'slack-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Message search',
    taskDescription: 'Implement full-text search with Elasticsearch',
    successCriteria: [
      'Index messages on send',
      'Search with permission filtering',
      'Highlighted results',
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
    level1: 'Use Elasticsearch, filter by accessible channels',
    level2: 'Index per workspace, include channel_id filter in query',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Message Queue for Scale (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📬',
  scenario: "Your platform is growing fast!",
  hook: "10,000 workspaces, millions of messages per hour. The real-time fanout is overwhelming your servers. We need async processing!",
  challenge: "Add message queues for scalable message delivery.",
  illustration: 'message-queue',
};

const step8Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Async processing enabled!',
  achievement: 'Message delivery scales independently',
  metrics: [
    { label: 'Processing', after: 'Async queue' },
    { label: 'Throughput', after: '10x higher' },
  ],
  nextTeaser: "Now let's add load balancing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Async Message Processing',

  frameworkReminder: {
    question: "How do we handle millions of messages?",
    connection: "Synchronous fanout doesn't scale. Queue messages and process async."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
Message sent → Store → Fanout to 1000 members
All synchronous = slow response to sender
\`\`\`

**Solution: Queue-Based Architecture**
\`\`\`
Message → Store → Queue → Return immediately
                   ↓
          Workers fanout async
\`\`\`

**Implementation:**
\`\`\`python
async def send_message(ws, data):
    user = get_user(ws)

    # 1. Store message (fast)
    message = await db.create_message(
        channel_id=data['channel_id'],
        user_id=user.id,
        content=data['content']
    )

    # 2. Queue for fanout (fast)
    await queue.publish('message-fanout', {
        'message_id': message.id,
        'channel_id': data['channel_id']
    })

    # 3. Return immediately
    await ws.send({'type': 'message_sent', 'id': message.id})

# Worker process
async def fanout_worker():
    async for job in queue.consume('message-fanout'):
        message = await db.get_message(job['message_id'])
        members = await get_channel_members(job['channel_id'])

        for member in members:
            ws = get_connection(member.user_id)
            if ws:
                await ws.send({'type': 'message', 'data': message})
\`\`\`

**Queue Topics:**
\`\`\`
message-fanout    → Deliver to channel members
search-index      → Index in Elasticsearch
notification      → Send push notifications
webhook           → Trigger integrations
\`\`\`

**Benefits:**
- Sender gets immediate confirmation
- Fanout scales independently
- Retry on failure
- Multiple workers for throughput`,

  whyItMatters: 'Queues decouple components. Essential for scale.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Processing millions of messages',
    howTheyDoIt: 'Kafka for message events. Separate services for delivery, search, notifications.',
  },

  keyPoints: [
    'Store and queue immediately',
    'Workers fanout async',
    'Multiple queues for different tasks',
  ],

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Async job processing', icon: '📬' },
    { title: 'Fanout Worker', explanation: 'Delivers to members', icon: '📢' },
  ],
};

const step8: GuidedStep = {
  id: 'slack-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Scale message delivery',
    taskDescription: 'Add message queue for async fanout',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue for async processing', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Add Message Queue',
      'Store and queue on send',
      'Workers process fanout',
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
    level1: 'Add Kafka for message events',
    level2: 'Store → queue → return fast, workers fanout',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Load Balancing (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Single server can't handle all WebSocket connections!",
  hook: "500,000 concurrent users. Each has a WebSocket connection. One server can handle ~50,000 connections max. We need to scale out!",
  challenge: "Add load balancing for WebSocket connections.",
  illustration: 'load-balancer',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Scalable team chat!',
  achievement: 'Search, async processing, and horizontal scale',
  metrics: [
    { label: 'Search', after: 'Elasticsearch' },
    { label: 'Processing', after: 'Async queues' },
    { label: 'Connections', after: 'Load balanced' },
  ],
  nextTeaser: "Phase 4: File sharing and integrations!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'WebSocket Load Balancing',

  frameworkReminder: {
    question: "How do we scale WebSocket connections?",
    connection: "WebSockets are stateful. Need connection registry and cross-server routing."
  },

  conceptExplanation: `**The Challenge:**
- 500K concurrent users
- WebSocket = long-lived connection
- One server: ~50K connections
- Need: 10+ servers

**Connection Registry:**
\`\`\`python
# Redis tracks which server has which user
async def on_connect(server_id, user_id, workspace_id):
    await redis.hset(f"connections:{workspace_id}", user_id, server_id)

async def on_disconnect(user_id, workspace_id):
    await redis.hdel(f"connections:{workspace_id}", user_id)
\`\`\`

**Cross-Server Messaging (Pub/Sub):**
\`\`\`python
async def send_to_user(workspace_id, user_id, message):
    # Find which server has the user
    server_id = await redis.hget(f"connections:{workspace_id}", user_id)

    if server_id == MY_SERVER_ID:
        # I have the connection
        await local_connections[user_id].send(message)
    else:
        # Another server has it - use pub/sub
        await redis.publish(f"server:{server_id}", json.dumps({
            'user_id': user_id,
            'message': message
        }))

# Each server subscribes to its channel
async def server_subscriber():
    async for msg in redis.subscribe(f"server:{MY_SERVER_ID}"):
        data = json.loads(msg)
        ws = local_connections.get(data['user_id'])
        if ws:
            await ws.send(data['message'])
\`\`\`

**Sticky Sessions (Alternative):**
\`\`\`
Load balancer: Hash user_id → consistent server
User A → always Server 3
User B → always Server 7
Pro: Simpler routing
Con: Uneven distribution possible
\`\`\``,

  whyItMatters: 'WebSocket scaling is different from HTTP. Connection state matters.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Millions of concurrent connections',
    howTheyDoIt: 'Connection gateways. Redis pub/sub for cross-server. Consistent hashing for routing.',
  },

  keyPoints: [
    'Registry tracks connection location',
    'Pub/sub for cross-server delivery',
    'Sticky sessions simplify routing',
  ],

  keyConcepts: [
    { title: 'Connection Registry', explanation: 'Tracks user → server', icon: '📍' },
    { title: 'Pub/Sub', explanation: 'Cross-server messaging', icon: '📡' },
  ],
};

const step9: GuidedStep = {
  id: 'slack-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Scale WebSocket connections',
    taskDescription: 'Add load balancer with connection routing',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute connections', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Connection registry in Redis',
      'Cross-server pub/sub routing',
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
    level1: 'Add LB with connection registry',
    level2: 'Redis for registry, pub/sub for cross-server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Files & Integrations
// =============================================================================

// =============================================================================
// STEP 10: File Sharing (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '📎',
  scenario: "Phase 4 begins! Teams need to share files!",
  hook: "A designer wants to share a mockup. A developer needs to upload a log file. Email attachments are clunky. We need file sharing in chat!",
  challenge: "Implement file sharing in channels and DMs.",
  illustration: 'file-sharing',
};

const step10Celebration: CelebrationContent = {
  emoji: '📎',
  message: 'File sharing working!',
  achievement: 'Users can share files in channels',
  metrics: [
    { label: 'File uploads', after: '✓ Working' },
    { label: 'Previews', after: '✓ Images, PDFs' },
  ],
  nextTeaser: "Now let's add integrations and bots...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'File Sharing',

  frameworkReminder: {
    question: "How do teams share files?",
    connection: "Files uploaded to S3, referenced in messages. Previews generated."
  },

  conceptExplanation: `**File Upload Flow:**
\`\`\`
1. User selects file in chat
2. Client → Server: Request upload URL
3. Server: Create file record, return presigned S3 URL
4. Client → S3: Upload directly
5. Client → Server: Upload complete, post message
6. Server: Generate preview, broadcast message
\`\`\`

**Data Model:**
\`\`\`sql
CREATE TABLE files (
  id BIGINT PRIMARY KEY,
  workspace_id BIGINT,
  uploader_id BIGINT,
  filename VARCHAR(255),
  size_bytes BIGINT,
  mime_type VARCHAR(100),
  storage_key VARCHAR(500),
  thumbnail_key VARCHAR(500),
  created_at TIMESTAMP
);

CREATE TABLE message_files (
  message_id BIGINT,
  file_id BIGINT,
  PRIMARY KEY (message_id, file_id)
);
\`\`\`

**Upload Implementation:**
\`\`\`python
async def request_upload(workspace_id, user_id, filename, size):
    file_id = generate_id()
    storage_key = f"workspaces/{workspace_id}/files/{file_id}/{filename}"

    # Create file record
    await db.create_file(
        id=file_id,
        workspace_id=workspace_id,
        uploader_id=user_id,
        filename=filename,
        size_bytes=size,
        storage_key=storage_key
    )

    # Generate presigned upload URL
    upload_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': 'teamchat-files', 'Key': storage_key},
        ExpiresIn=3600
    )

    return {'file_id': file_id, 'upload_url': upload_url}

async def complete_upload(file_id):
    file = await db.get_file(file_id)

    # Generate thumbnail if image
    if file.mime_type.startswith('image/'):
        thumbnail = await generate_thumbnail(file.storage_key)
        await db.update_file(file_id, thumbnail_key=thumbnail)

    # File is ready to be shared
    return {'file_id': file_id, 'ready': True}
\`\`\`

**Sharing File in Message:**
\`\`\`json
{
  "channel_id": 123,
  "content": "Here's the mockup",
  "file_ids": [456, 457]
}
\`\`\``,

  whyItMatters: 'File sharing is essential for team collaboration. Context stays in the conversation.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'File sharing',
    howTheyDoIt: 'S3 for storage. Thumbnails generated. Previews for images, PDFs, code.',
  },

  keyPoints: [
    'Direct upload to S3',
    'Generate thumbnails/previews',
    'Link files to messages',
  ],

  keyConcepts: [
    { title: 'File Upload', explanation: 'Presigned URL to S3', icon: '📤' },
    { title: 'Preview', explanation: 'Thumbnail/preview generation', icon: '🖼️' },
  ],
};

const step10: GuidedStep = {
  id: 'slack-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: File sharing',
    taskDescription: 'Implement file upload and sharing',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store uploaded files', displayName: 'File Storage (S3)' },
    ],
    successCriteria: [
      'Add Object Storage',
      'Presigned URL upload',
      'Attach files to messages',
    ],
  },

  celebration: step10Celebration,

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
    level1: 'Add S3 for file storage',
    level2: 'Presigned URL upload, link files to messages',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 11: Integrations & Bots (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '🤖',
  scenario: "Teams want to connect their tools!",
  hook: "When a deploy happens in GitHub, teams want a Slack notification. When someone mentions 'bug', create a Jira ticket. Integrations automate workflows!",
  challenge: "Build integration/bot platform.",
  illustration: 'integrations',
};

const step11Celebration: CelebrationContent = {
  emoji: '🤖',
  message: 'Integrations platform working!',
  achievement: 'Third-party tools can connect to TeamChat',
  metrics: [
    { label: 'Webhooks', after: '✓ Working' },
    { label: 'Bots', after: '✓ Can post' },
  ],
  nextTeaser: "One final step: enterprise features!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Integrations & Bots',

  frameworkReminder: {
    question: "How do external tools connect to chat?",
    connection: "Webhooks for inbound, APIs for outbound. Bots have special accounts."
  },

  conceptExplanation: `**Integration Types:**

**1. Incoming Webhooks (External → TeamChat)**
\`\`\`
GitHub → Webhook → TeamChat
"User pushed to main branch"
\`\`\`

\`\`\`python
# Create incoming webhook
async def create_webhook(workspace_id, channel_id, name):
    token = secrets.token_urlsafe(32)
    await db.create_webhook(
        workspace_id=workspace_id,
        channel_id=channel_id,
        name=name,
        token=token
    )
    return f"https://hooks.teamchat.com/{token}"

# Handle incoming webhook
@app.route('/hooks/<token>', methods=['POST'])
async def handle_webhook(token):
    webhook = await db.get_webhook_by_token(token)
    if not webhook:
        return 404

    # Post message to channel
    await post_bot_message(
        channel_id=webhook.channel_id,
        bot_name=webhook.name,
        content=request.json.get('text'),
        attachments=request.json.get('attachments')
    )
\`\`\`

**2. Bots (Automated users)**
\`\`\`sql
CREATE TABLE bots (
  id BIGINT PRIMARY KEY,
  workspace_id BIGINT,
  name VARCHAR(100),
  avatar_url VARCHAR(500),
  token VARCHAR(100),  -- API token
  scopes VARCHAR(500), -- Permissions
  created_at TIMESTAMP
);
\`\`\`

**Bot API:**
\`\`\`python
# Bot posts message
@app.route('/api/chat.postMessage', methods=['POST'])
async def bot_post_message():
    token = request.headers['Authorization'].replace('Bearer ', '')
    bot = await db.get_bot_by_token(token)

    if not bot:
        return 401

    await post_bot_message(
        channel_id=request.json['channel'],
        bot_name=bot.name,
        bot_id=bot.id,
        content=request.json['text']
    )
\`\`\`

**3. Slash Commands**
\`\`\`
User types: /jira create Bug in login
TeamChat → Jira API → Creates ticket
Jira API → TeamChat → "Created JIRA-123"
\`\`\`

**OAuth for Apps:**
\`\`\`
1. App redirects to TeamChat OAuth
2. User authorizes app for workspace
3. TeamChat returns access token
4. App uses token for API calls
\`\`\``,

  whyItMatters: 'Integrations make chat a productivity hub. Connect all your tools.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'App ecosystem',
    howTheyDoIt: 'App Directory with 2000+ apps. OAuth. Webhooks, bots, slash commands.',
  },

  keyPoints: [
    'Incoming webhooks for notifications',
    'Bot tokens for posting',
    'OAuth for app authorization',
  ],

  keyConcepts: [
    { title: 'Webhook', explanation: 'HTTP callback for events', icon: '🪝' },
    { title: 'Bot', explanation: 'Automated user account', icon: '🤖' },
  ],
};

const step11: GuidedStep = {
  id: 'slack-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: Integrations platform',
    taskDescription: 'Build webhook and bot support',
    successCriteria: [
      'Incoming webhooks',
      'Bot accounts and tokens',
      'Slash command framework',
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
    level1: 'Webhooks for inbound, bot tokens for outbound',
    level2: 'Webhook URLs post to channels, bots use API with tokens',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Enterprise Features (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '🏢',
  scenario: "Enterprise customers have special needs!",
  hook: "A Fortune 500 company wants to use TeamChat. They need: SSO, compliance exports, admin controls, and SLAs. Enterprise is where the money is!",
  challenge: "Add enterprise features.",
  illustration: 'enterprise',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered Slack system design!',
  achievement: 'From basic chat to enterprise collaboration platform',
  metrics: [
    { label: 'Workspaces', after: 'Thousands' },
    { label: 'Messages', after: 'Billions' },
    { label: 'Features', after: 'Threads, Search, Files, Bots' },
    { label: 'Enterprise', after: 'SSO, Compliance, Admin' },
  ],
  nextTeaser: "You've completed the Slack journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Enterprise Features',

  frameworkReminder: {
    question: "What do enterprise customers need?",
    connection: "SSO for security, compliance for regulations, admin controls for governance."
  },

  conceptExplanation: `**Enterprise Requirements:**

**1. Single Sign-On (SSO)**
\`\`\`
Employee → TeamChat → Redirect to Company IdP
         ← SAML/OIDC assertion
         → Session created
\`\`\`

\`\`\`python
# SAML SSO
@app.route('/sso/saml/callback')
async def saml_callback():
    assertion = parse_saml_response(request.form['SAMLResponse'])
    email = assertion['email']
    workspace_id = assertion['workspace_id']

    user = await get_or_create_user(email, workspace_id)
    session = create_session(user)
    return redirect_to_app(session)
\`\`\`

**2. Compliance & eDiscovery**
\`\`\`sql
-- Message retention
ALTER TABLE messages ADD COLUMN retention_policy_id BIGINT;

-- Legal holds
CREATE TABLE legal_holds (
  id BIGINT PRIMARY KEY,
  workspace_id BIGINT,
  name VARCHAR(100),
  custodian_ids JSONB,  -- Users under hold
  start_date DATE,
  end_date DATE
);

-- Export API
GET /api/compliance/export?start=2024-01-01&end=2024-02-01
\`\`\`

**3. Admin Controls**
\`\`\`python
# Workspace settings
settings = {
    'allow_public_channels': True,
    'allow_file_uploads': True,
    'message_retention_days': 365,
    'allowed_email_domains': ['acme.com'],
    'require_2fa': True,
    'allowed_integrations': ['github', 'jira']
}
\`\`\`

**4. Audit Logs**
\`\`\`sql
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY,
  workspace_id BIGINT,
  actor_id BIGINT,
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id BIGINT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP
);

-- Example actions:
-- user.login, channel.create, message.delete
-- admin.settings_changed, file.downloaded
\`\`\`

**5. Enterprise Grid (Multi-Workspace)**
\`\`\`
Acme Corp Enterprise Grid:
├── Workspace: Engineering (1000 users)
├── Workspace: Sales (500 users)
├── Workspace: Marketing (200 users)
└── Shared channels across workspaces
\`\`\``,

  whyItMatters: 'Enterprise features unlock big contracts. Security and compliance are table stakes.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'Enterprise Grid',
    howTheyDoIt: 'SAML/OIDC SSO. eDiscovery exports. Admin dashboard. Enterprise Grid for large orgs.',
  },

  keyPoints: [
    'SSO for centralized auth',
    'Compliance exports for legal',
    'Audit logs for security',
  ],

  keyConcepts: [
    { title: 'SSO', explanation: 'Single Sign-On via SAML/OIDC', icon: '🔐' },
    { title: 'Compliance', explanation: 'Data exports for legal', icon: '📋' },
  ],
};

const step12: GuidedStep = {
  id: 'slack-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Enterprise features',
    taskDescription: 'Add SSO, compliance, and admin controls',
    successCriteria: [
      'SAML/OIDC SSO',
      'Compliance exports',
      'Audit logging',
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
    level1: 'SSO, compliance exports, audit logs',
    level2: 'SAML callback, export API, log all admin actions',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const slackProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'slack-progressive',
  title: 'Design Slack',
  description: 'Build an evolving team collaboration platform from basic chat to enterprise solution',
  difficulty: 'beginner',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '💬',
    hook: "Welcome to TeamChat! You're building the next Slack.",
    scenario: "Your journey: Start with basic channel messaging, add threads and DMs, scale for thousands of workspaces, and build enterprise features.",
    challenge: "Can you build a team collaboration platform that powers millions of workspaces?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    step1, step2, step3,
    step4, step5, step6,
    step7, step8, step9,
    step10, step11, step12,
  ],

  concepts: [
    'Multi-Tenant Architecture',
    'Channel-Based Messaging',
    'Real-Time WebSocket Delivery',
    'Threaded Conversations',
    'Direct Messages',
    'User Presence',
    'Full-Text Search',
    'Async Message Processing',
    'WebSocket Load Balancing',
    'File Sharing',
    'Integrations & Bots',
    'Enterprise Features',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
    'Chapter 12: The Future of Data Systems',
  ],
};

export default slackProgressiveGuidedTutorial;
