import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Twitch Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a live streaming platform like Twitch.
 *
 * Key Concepts:
 * - Live video streaming (real-time, low latency)
 * - Real-time chat with WebSockets
 * - Subscription and donation handling
 * - VOD (Video on Demand) storage
 * - Channel discovery and recommendation
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const twitchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a live streaming platform like Twitch",

  interviewer: {
    name: 'Marcus Lee',
    role: 'Head of Engineering at LiveStream Technologies',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main things users want to do on Twitch?",
      answer: "Users want to:\n\n1. **Stream live video** - Broadcast gameplay or content in real-time\n2. **Watch live streams** - View streams with low latency (< 5 seconds)\n3. **Chat during streams** - Interact with streamers and viewers in real-time\n4. **Subscribe/donate** - Support favorite streamers financially\n5. **Watch VODs** - Replay past broadcasts\n6. **Discover channels** - Find new streamers and content",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-6',
      learningPoint: "Twitch is fundamentally about LIVE interaction - real-time video + real-time chat",
    },
    {
      id: 'live-streaming',
      category: 'functional',
      question: "How should live streaming work?",
      answer: "Streamers broadcast video from their PC/console using software like OBS. The stream is ingested, transcoded to multiple qualities (1080p, 720p, 480p), and delivered to viewers with < 5 second latency. This is MUCH harder than YouTube's pre-recorded videos!",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Live streaming requires real-time transcoding and low-latency protocols (HLS Low-Latency or WebRTC)",
    },
    {
      id: 'chat-system',
      category: 'functional',
      question: "How should the chat system work?",
      answer: "Chat must be real-time. When someone types a message, all viewers in that channel see it within 100-200ms. Popular streams can have 100K+ concurrent chatters. Chat messages are ephemeral - they don't need to be stored forever.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Chat requires bidirectional real-time communication - WebSockets are essential",
    },
    {
      id: 'subscriptions',
      category: 'functional',
      question: "How do subscriptions and donations work?",
      answer: "Users can subscribe monthly ($5-$25) or make one-time donations. Subscriptions unlock emotes and remove ads. Streamers get ~50% of subscription revenue. Donations go through payment processors like Stripe.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Monetization is critical - payment processing must be reliable and fast",
    },
    {
      id: 'vod-storage',
      category: 'functional',
      question: "What happens to streams after they end?",
      answer: "Streams are automatically saved as VODs (Video on Demand) for 14-60 days depending on subscription tier. VODs can be watched like YouTube videos - they're pre-recorded, so latency isn't critical.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "VOD is simpler than live - standard CDN + object storage works",
    },
    {
      id: 'clips',
      category: 'clarification',
      question: "Should we support creating clips from streams?",
      answer: "Clips are a v2 feature. They allow users to create 30-second highlights from VODs. For MVP, focus on live streaming, chat, and basic VOD playback.",
      importance: 'nice-to-have',
      insight: "Clips require video editing capabilities and their own discovery system",
    },
    {
      id: 'multi-streaming',
      category: 'clarification',
      question: "Can streamers broadcast to multiple platforms simultaneously?",
      answer: "No, Twitch has exclusivity agreements with top streamers. Each stream goes only to Twitch. Focus on single-platform streaming for MVP.",
      importance: 'nice-to-have',
      insight: "Multi-streaming adds complexity around authentication and stream management",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "140 million monthly active users, with 2.5 million concurrent viewers at peak (evening hours in US/EU)",
      importance: 'critical',
      learningPoint: "Twitch is the dominant live streaming platform for gaming",
    },
    {
      id: 'throughput-streams',
      category: 'throughput',
      question: "How many concurrent streams should we handle?",
      answer: "About 100,000 concurrent live streams at peak. Most streams have 5-50 viewers, but top streams have 50K-200K concurrent viewers.",
      importance: 'critical',
      calculation: {
        formula: "2.5M viewers ÷ 100K streams = 25 viewers/stream average",
        result: "Long-tail distribution: few massive streams, many small ones",
      },
      learningPoint: "Load is heavily skewed - a few channels drive most of the traffic",
    },
    {
      id: 'throughput-chat',
      category: 'throughput',
      question: "How many chat messages per second?",
      answer: "During major events (esports finals), popular channels see 50K+ messages per second. Average channel: 10-100 msg/sec.",
      importance: 'critical',
      calculation: {
        formula: "50K msg/sec peak × 100 bytes/msg = 5 MB/sec",
        result: "Chat can generate massive fan-out during viral moments",
      },
      learningPoint: "Chat fan-out is the hardest scaling challenge - everyone must see every message",
    },
    {
      id: 'stream-bitrate',
      category: 'payload',
      question: "What's the typical stream bitrate?",
      answer: "Streamers upload at 4-8 Mbps (1080p source). We transcode to 480p (1 Mbps), 720p (2.5 Mbps), 1080p (6 Mbps). Viewers download based on their bandwidth.",
      importance: 'critical',
      calculation: {
        formula: "100K streams × 6 Mbps source = 600 Gbps ingress",
        result: "Massive bandwidth requirements for ingestion + delivery",
      },
      learningPoint: "Live transcoding is CPU-intensive and must happen in real-time",
    },
    {
      id: 'latency-stream',
      category: 'latency',
      question: "How low should stream latency be?",
      answer: "Target < 5 seconds from streamer to viewer. Lower is better for interactivity. Standard HLS is 10-30 seconds, so we need HLS Low-Latency or WebRTC.",
      importance: 'critical',
      learningPoint: "Low latency enables real-time interaction between streamer and chat",
    },
    {
      id: 'latency-chat',
      category: 'latency',
      question: "How fast should chat messages appear?",
      answer: "p99 < 200ms. Chat must feel instant. Anything over 500ms feels laggy and breaks the experience.",
      importance: 'critical',
      learningPoint: "Chat latency is more critical than stream latency for engagement",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What happens if a stream goes down mid-broadcast?",
      answer: "Streamers expect 99.9% uptime. If infrastructure fails, auto-reconnect the stream within 10 seconds. VODs should never be lost - they're permanent revenue sources.",
      importance: 'critical',
      learningPoint: "Streamers earn money from live broadcasts - downtime costs them income",
    },
    {
      id: 'viral-stream',
      category: 'burst',
      question: "What happens when a stream goes viral?",
      answer: "A major esports event or celebrity stream can go from 1K to 200K viewers in minutes. The system must scale instantly without dropping frames or chat messages.",
      importance: 'critical',
      insight: "Auto-scaling and CDN edge caching are essential for viral moments",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'live-streaming', 'chat-system', 'throughput-streams'],
  criticalFRQuestionIds: ['core-features', 'live-streaming', 'chat-system'],
  criticalScaleQuestionIds: ['throughput-streams', 'throughput-chat', 'latency-stream', 'latency-chat'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Streamers can broadcast live video',
      description: 'Upload and stream live content to viewers',
      emoji: '📹',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Viewers can watch live streams',
      description: 'Watch streams with low latency (< 5s)',
      emoji: '👀',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can chat in real-time',
      description: 'Send and receive messages during streams',
      emoji: '💬',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can subscribe/donate',
      description: 'Support streamers financially',
      emoji: '💰',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can watch VODs',
      description: 'Replay past broadcasts',
      emoji: '📺',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users can discover channels',
      description: 'Browse and search for streamers',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '15 million',
    writesPerDay: '100K concurrent streams + 5M chat messages/min',
    readsPerDay: '2.5M concurrent viewers',
    peakMultiplier: 3,
    readWriteRatio: '25:1 (viewers to streamers)',
    calculatedWriteRPS: { average: 83333, peak: 250000 },
    calculatedReadRPS: { average: 2500000, peak: 7500000 },
    maxPayloadSize: '~1 MB (video chunk)',
    storagePerRecord: '~5GB per hour of VOD',
    storageGrowthPerYear: '~175 PB (VODs)',
    redirectLatencySLA: 'p99 < 5s (stream start)',
    createLatencySLA: 'p99 < 200ms (chat)',
  },

  architecturalImplications: [
    '✅ Real-time streaming → Media servers with live transcoding',
    '✅ Low-latency chat → WebSockets + pub/sub message broker',
    '✅ 2.5M concurrent viewers → Multi-region CDN essential',
    '✅ 50K msg/sec in chat → Message queue fan-out pattern',
    '✅ Live transcoding → GPU-accelerated encoding servers',
    '✅ VOD storage → Object storage + CDN (similar to YouTube)',
  ],

  outOfScope: [
    'Clip creation and editing',
    'Multi-platform streaming',
    'Advanced moderation tools (AutoMod)',
    'Extensions and overlays',
    'Host/raid functionality',
    'Streamer analytics dashboard',
  ],

  keyInsight: "Live streaming is HARD. Unlike YouTube's pre-recorded videos, we must transcode in real-time and deliver with < 5 second latency. Plus chat must feel instant. We'll start simple and layer in complexity step by step!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'twitch-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '🎮',
    scenario: "Welcome to LiveStream Technologies! You're building the next Twitch.",
    hook: "Your first streamer just installed OBS and is ready to go live!",
    challenge: "Set up the basic connection so streamers and viewers can reach your server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation for Live Streaming',
    conceptExplanation: `Every streaming platform starts with **Clients** connecting to a **Server**.

For Twitch, we have TWO types of clients:
1. **Streamers** - Upload live video (OBS software, console apps)
2. **Viewers** - Watch streams (web browser, mobile app, TV app)

Both connect to your App Server:
- Streamers send video stream via RTMP protocol
- Viewers request video playback and chat via HTTP/WebSockets
- App Server coordinates everything

This is your foundation!`,

    whyItMatters: 'Without this connection, nobody can stream or watch anything.',

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Serving 2.5M concurrent viewers',
      howTheyDoIt: 'Started with a simple server in 2011, now uses global infrastructure with thousands of media servers',
    },

    keyPoints: [
      'Client = streamers (OBS) + viewers (web/mobile apps)',
      'App Server = your backend coordinating streams and chat',
      'RTMP for stream ingestion, HTTP/WS for playback and chat',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents streamers and viewers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles stream ingestion and viewer requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Your streaming platform is online!',
    achievement: 'Users can now connect to your server',
    metrics: [
      { label: 'Status', after: 'Online' },
      { label: 'Accepting connections', after: '✓' },
    ],
    nextTeaser: "But the server doesn't know how to handle streams yet...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette',
    level2: 'Click Client, then click App Server to connect them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2: GuidedStep = {
  id: 'twitch-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A streamer just tried to go live!",
    hook: "But the server doesn't know what to do with the video stream. Error 500!",
    challenge: "Write the Python handlers for streaming, chat, and subscriptions.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Live Streaming & Chat APIs',
    conceptExplanation: `We need handlers for core Twitch functionality:

- \`start_stream()\` - Begin broadcasting, create stream session
- \`watch_stream()\` - Get stream URL and metadata for playback
- \`send_chat_message()\` - Post message to channel chat
- \`subscribe_channel()\` - Subscribe to a streamer
- \`get_vod()\` - Retrieve past broadcast

For now, we'll store data in memory. Real video processing comes in later steps.`,

    whyItMatters: 'These handlers are the core logic that makes Twitch work!',

    famousIncident: {
      title: 'Twitch Launches as Justin.tv Spinoff',
      company: 'Twitch',
      year: '2011',
      whatHappened: 'Justin.tv pivoted to focus on gaming streams, creating Twitch. The original live streaming code was basic but worked. Within 2 years, Twitch became the dominant gaming platform.',
      lessonLearned: 'Start simple. Get basic streaming and chat working, then optimize for scale.',
      icon: '🎮',
    },

    keyPoints: [
      'start_stream creates stream session and ingest point',
      'watch_stream returns streaming URL for playback',
      'send_chat_message handles real-time chat (WebSocket soon)',
      'In-memory storage for now - database comes next',
    ],

    quickCheck: {
      question: 'Why is live streaming harder than YouTube-style video uploads?',
      options: [
        'Live video files are larger',
        'Live streaming requires real-time transcoding with < 5s latency',
        'Live streaming uses different video codecs',
        'There\'s no technical difference',
      ],
      correctIndex: 1,
      explanation: 'With YouTube, you can transcode offline. With Twitch, video must be transcoded in REAL-TIME as the streamer broadcasts.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Start stream, FR-2: Watch stream, FR-3: Send chat',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign stream and chat APIs',
      'Open Python tab and implement handlers',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Streams and chat are working!',
    achievement: 'Core Twitch functionality implemented',
    metrics: [
      { label: 'APIs implemented', after: '5' },
      { label: 'Can go live', after: '✓' },
      { label: 'Can chat', after: '✓' },
    ],
    nextTeaser: "But if the server restarts, all streams and chat history are lost...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /streams and POST /chat',
    level2: 'Switch to Python tab and fill in the TODO sections for start_stream and send_chat_message',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/streams', 'GET /api/v1/watch', 'POST /api/v1/chat'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3: GuidedStep = {
  id: 'twitch-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Disaster! The server crashed during a 50K viewer stream.",
    hook: "When it came back up, all stream metadata, subscriptions, and VODs - GONE. Streamers lost their earnings data!",
    challenge: "Add a database so data survives server restarts.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Persistent Storage for Streaming Platform',
    conceptExplanation: `In-memory storage is fast but volatile. A **database** provides:

- **Durability**: Stream metadata, subscriptions, chat logs survive crashes
- **Structure**: Tables for users, streams, subscriptions, VODs
- **Queries**: Efficient lookups (find all streams for a channel)

For Twitch's metadata, we need tables:
- \`users\` - Streamer and viewer accounts
- \`streams\` - Active and past stream sessions
- \`subscriptions\` - Who subscribes to which channel
- \`vods\` - Video on demand metadata
- \`chat_logs\` - Optional chat history (recent only)`,

    whyItMatters: 'Streamers rely on subscription data for income. Losing this data destroys trust and costs real money.',

    famousIncident: {
      title: 'Twitch Data Breach',
      company: 'Twitch',
      year: '2021',
      whatHappened: 'A massive data breach exposed Twitch\'s source code and streamer earnings. 125GB of data leaked. The incident highlighted the importance of database security and access controls.',
      lessonLearned: 'Protect your database with encryption, access controls, and audit logs. User data is sacred.',
      icon: '🔒',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Storing metadata for millions of streamers',
      howTheyDoIt: 'Uses Amazon DynamoDB (NoSQL) for massive scale, sharded by channel_id. PostgreSQL for relational data like subscriptions.',
    },

    keyPoints: [
      'Database stores stream metadata, subscriptions, VOD info',
      'Actual video files go to object storage (Step 8)',
      'PostgreSQL handles relational data well at this scale',
      'Chat messages can be logged temporarily for moderation',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, streams, subscriptions, VODs', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },

  celebration: {
    emoji: '💾',
    message: 'Your data is safe forever!',
    achievement: 'Persistent storage enabled',
    metrics: [
      { label: 'Data durability', after: '100%' },
      { label: 'Survives restarts', after: '✓' },
    ],
    nextTeaser: "But stream metadata queries are getting slow...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) onto the canvas',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Stream Metadata
// =============================================================================

const step4: GuidedStep = {
  id: 'twitch-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '🐌',
    scenario: "You have 100K active streamers. The browse page takes 5 seconds to load!",
    hook: "Every page load hits the database for stream info. It's melting under the load.",
    challenge: "Add a cache to make stream metadata lookups instant.",
    illustration: 'slow-loading',
  },

  learnPhase: {
    conceptTitle: 'Caching Live Stream Metadata',
    conceptExplanation: `Twitch has thousands of viewers browsing for streams. **Caching** is essential!

**Cache-Aside Pattern**:
1. Check cache for stream metadata first
2. If miss, fetch from database
3. Store in cache for next request

For Twitch, we cache:
- Active stream list (updated every 30 seconds)
- Channel metadata (followers, subscriber count)
- Popular streams and categories
- VOD metadata

Live stream status changes frequently, so use short TTLs (30-60 seconds).`,

    whyItMatters: 'At 2.5M concurrent viewers browsing, every database query costs money and latency. Cache hits are nearly free.',

    famousIncident: {
      title: 'Twitch Plays Pokemon',
      company: 'Twitch',
      year: '2014',
      whatHappened: 'A stream where viewers controlled Pokemon via chat commands exploded to 100K+ concurrent viewers. The chat system nearly collapsed under 50K messages per second. Twitch had to rapidly scale their infrastructure.',
      lessonLearned: 'Plan for viral moments. Cache aggressively and design for 10x traffic spikes.',
      icon: '🎮',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Handling millions of browse requests',
      howTheyDoIt: 'Uses Redis clusters to cache stream metadata. 99%+ cache hit rate for browse pages.',
    },

    diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                                   └───────┘
                                       │
                               Cache stream list!
`,

    keyPoints: [
      'Cache-aside: Check cache → miss → fetch DB → populate cache',
      'Short TTL (30-60s) for live stream status',
      'Longer TTL (5-10 min) for channel metadata',
      'Invalidate cache when stream ends',
    ],

    quickCheck: {
      question: 'Why use a shorter TTL for live stream metadata compared to VOD metadata?',
      options: [
        'Live streams change status frequently (going online/offline)',
        'VOD metadata is larger',
        'Live streams are more popular',
        'There\'s no difference',
      ],
      correctIndex: 0,
      explanation: 'Live streams go online/offline constantly. Stale cache showing an offline stream as live ruins UX. VOD metadata rarely changes.',
    },
  },

  practicePhase: {
    frText: 'FR-6: Discover channels (now fast!)',
    taskDescription: 'Add Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache stream metadata for instant lookups', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'TTL configured (60 seconds)',
      'Cache strategy set',
    ],
  },

  celebration: {
    emoji: '⚡',
    message: 'Browse page loads 50x faster!',
    achievement: 'Caching dramatically improved performance',
    metrics: [
      { label: 'Browse page latency', before: '5000ms', after: '100ms' },
      { label: 'Cache hit rate', after: '99%' },
    ],
    nextTeaser: "But one server can't handle viral streams...",
  },

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
    level1: 'Drag a Cache (Redis) onto the canvas',
    level2: 'Connect App Server to Cache. Set TTL to 60 seconds.',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5: GuidedStep = {
  id: 'twitch-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: {
    emoji: '🔥',
    scenario: "A major esports tournament just started! Your single server is at 100% CPU!",
    hook: "Traffic spiked to 200K viewers in 10 minutes. Users are getting connection timeouts.",
    challenge: "Add a load balancer to distribute traffic across servers.",
    illustration: 'server-overload',
  },

  learnPhase: {
    conceptTitle: 'Load Balancing for Live Streaming',
    conceptExplanation: `A **Load Balancer** distributes requests across multiple servers.

**Load Balancing Algorithms**:
- **Round Robin**: Take turns (simple, fair)
- **Least Connections**: Send to least busy server
- **IP Hash**: Same user → same server (session affinity)
- **Weighted**: More powerful servers get more traffic

**Layer 4 vs Layer 7**:
- **L4 (Transport)**: Fast, routes by IP/port
- **L7 (Application)**: Smart, routes by URL path/headers

For Twitch, we'll use **L7 load balancing** to route:
- Stream ingestion (RTMP) to media servers
- API calls to app servers
- Chat (WebSocket) to dedicated chat servers`,

    whyItMatters: 'Viral streams cause unpredictable traffic spikes. One server will always fail.',

    famousIncident: {
      title: 'Ninja Fortnite Stream with Drake',
      company: 'Twitch',
      year: '2018',
      whatHappened: 'Ninja\'s stream with Drake hit 635K concurrent viewers, breaking Twitch records. The platform handled it gracefully thanks to load balancing and CDN infrastructure.',
      lessonLearned: 'Celebrity collaborations create massive, unpredictable spikes. Auto-scaling is essential.',
      icon: '🎯',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Handling 2.5M concurrent viewers',
      howTheyDoIt: 'Uses AWS Elastic Load Balancing with multiple layers (DNS, L4, L7) to distribute traffic globally',
    },

    keyPoints: [
      'L7 load balancing routes by URL path (streams, chat, API)',
      'Round Robin works well for stateless API servers',
      'IP Hash for stateful WebSocket connections (chat)',
      'Health checks detect and route around failures',
    ],

    quickCheck: {
      question: 'Why use IP Hash for WebSocket chat connections?',
      options: [
        'It\'s faster',
        'WebSocket is stateful - same user must connect to same server',
        'It\'s cheaper',
        'IP Hash balances load better',
      ],
      correctIndex: 1,
      explanation: 'WebSocket maintains a persistent connection. IP Hash ensures the same user always connects to the same server instance.',
    },
  },

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic using L7 routing', displayName: 'Load Balancer (L7)' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client → Load Balancer connection',
      'Load Balancer → App Server connection',
    ],
  },

  celebration: {
    emoji: '🎛️',
    message: 'Traffic is distributed!',
    achievement: 'Load balancer prevents overload',
    metrics: [
      { label: 'Single point of failure', before: 'Yes', after: 'No' },
      { label: 'Can scale horizontally', after: '✓' },
    ],
    nextTeaser: "But the database is becoming a bottleneck...",
  },

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
    level1: 'Add Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Database Replication
// =============================================================================

const step6: GuidedStep = {
  id: 'twitch-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: {
    emoji: '⚠️',
    scenario: "Your database crashed for 20 minutes. Twitch was completely down.",
    hook: "No one could stream, watch, or chat. Streamers lost thousands in donations. Emergency!",
    challenge: "Add database replication for instant failover.",
    illustration: 'database-failure',
  },

  learnPhase: {
    conceptTitle: 'Database Replication for High Availability',
    conceptExplanation: `**Replication** copies data to multiple servers:

- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- If primary fails, replica becomes new primary (failover)
- Spread read load across replicas (stream metadata queries)
- Multiple copies = data safety

For Twitch:
- Primary handles stream start/stop, subscriptions (writes)
- Replicas handle browse page, channel info (reads)
- 2-3 replicas for redundancy`,

    whyItMatters: 'Twitch stores millions of stream records. Downtime means streamers can\'t earn money and you lose millions.',

    famousIncident: {
      title: 'Amazon Prime Day Crash',
      company: 'Amazon',
      year: '2018',
      whatHappened: 'Amazon\'s database couldn\'t handle Prime Day traffic surge. The site crashed for hours. Amazon lost $100M+ in sales.',
      lessonLearned: 'Database is often the bottleneck. Replication distributes read load and provides failover.',
      icon: '📦',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Zero tolerance for data loss',
      howTheyDoIt: 'Uses Amazon RDS with Multi-AZ replication. Each record stored on 3+ servers across availability zones.',
    },

    keyPoints: [
      'Primary handles writes, replicas handle reads',
      'Failover: replica promoted to primary on failure',
      'Monitor replication lag to prevent stale data',
      'Use 2+ replicas for safety',
    ],
  },

  practicePhase: {
    frText: 'All FRs need reliable data storage',
    taskDescription: 'Enable database replication with 2+ replicas',
    successCriteria: [
      'Click Database component',
      'Enable replication in config',
      'Set replica count to 2',
    ],
  },

  celebration: {
    emoji: '🛡️',
    message: 'Database is fault-tolerant!',
    achievement: 'Replicas provide redundancy',
    metrics: [
      { label: 'Database availability', before: '99%', after: '99.99%' },
      { label: 'Read capacity', before: '1x', after: '3x' },
    ],
    nextTeaser: "But we need more app servers to handle the traffic...",
  },

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
    level1: 'Click Database → Configuration → Enable replication',
    level2: 'Set replica count to 2 for redundancy',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Horizontal Scaling
// =============================================================================

const step7: GuidedStep = {
  id: 'twitch-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: {
    emoji: '📈',
    scenario: "You've grown to 100 million users! One app server is overwhelmed.",
    hook: "Even with caching and load balancing, a single server instance can't handle the volume.",
    challenge: "Scale horizontally by adding more app server instances.",
    illustration: 'traffic-spike',
  },

  learnPhase: {
    conceptTitle: 'Horizontal Scaling for Global Streaming',
    conceptExplanation: `**Horizontal scaling** = adding more servers (scale out)
**Vertical scaling** = upgrading a single server (scale up)

Horizontal is better because:
- No upper limit (keep adding servers)
- Better fault tolerance (one fails, others continue)
- More cost-effective at scale
- Can scale different services independently

For Twitch, we'll run multiple app server instances:
- API servers handle metadata requests
- Chat servers handle WebSocket connections
- All instances share cache and database`,

    whyItMatters: 'At 2.5M concurrent viewers, you need hundreds of servers working together.',

    famousIncident: {
      title: 'Twitch\'s Rapid Growth',
      company: 'Twitch',
      year: '2013-2014',
      whatHappened: 'Twitch grew from 20M to 100M monthly users in 18 months. They had to rapidly scale infrastructure, eventually leading to Amazon acquisition.',
      lessonLearned: 'Design for horizontal scaling from day 1. It\'s much harder to retrofit later.',
      icon: '📊',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Handling global traffic 24/7',
      howTheyDoIt: 'Runs thousands of servers across AWS regions worldwide. Auto-scales based on concurrent viewer count.',
    },

    keyPoints: [
      'Add more server instances to handle more traffic',
      'Load balancer distributes across all instances',
      'Stateless servers are easier to scale (store state in DB/cache)',
      'Chat servers need IP Hash for WebSocket persistence',
    ],
  },

  practicePhase: {
    frText: 'All FRs need more compute capacity',
    taskDescription: 'Scale App Server to 3+ instances',
    successCriteria: [
      'Click App Server',
      'Set instances to 3 or more',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: '10x more capacity!',
    achievement: 'Multiple servers share the load',
    metrics: [
      { label: 'App Server instances', before: '1', after: '3+' },
      { label: 'Request capacity', before: '10K/s', after: '100K+/s' },
    ],
    nextTeaser: "But where do we store the actual video streams?",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click App Server → Configuration → Set instances',
    level2: 'Set instances to 3 for horizontal scaling',
    solutionComponents: [{ type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Media Server + Object Storage for VODs
// =============================================================================

const step8: GuidedStep = {
  id: 'twitch-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: {
    emoji: '📹',
    scenario: "You have 100K live streams. Where do the video streams actually go?",
    hook: "App servers can't handle real-time video transcoding. Plus VODs need durable storage!",
    challenge: "Add Media Server for live transcoding and Object Storage for VODs.",
    illustration: 'video-processing',
  },

  learnPhase: {
    conceptTitle: 'Media Servers and Object Storage',
    conceptExplanation: `Live streaming needs specialized infrastructure:

**Media Server** (like Wowza, Nginx-RTMP):
- Receives RTMP stream from streamer (OBS)
- Transcodes in real-time to multiple qualities (480p, 720p, 1080p)
- Outputs HLS/DASH for viewers
- GPU-accelerated for low latency

**Object Storage** (like S3):
- Stores VOD recordings of past streams
- Virtually unlimited capacity
- 99.999999999% durability
- Lifecycle policies (delete after 60 days)

Architecture:
- **Media Server**: Handle live transcoding
- **Object Storage**: Store VODs permanently
- **Database**: Store VOD metadata and URLs`,

    whyItMatters: 'Real-time transcoding requires specialized hardware. App servers aren\'t designed for this workload.',

    famousIncident: {
      title: 'Twitch VOD Storage Costs',
      company: 'Twitch',
      year: '2020',
      whatHappened: 'Twitch reduced VOD retention from 60 days to 14 days for non-Partners due to massive storage costs. With 100K+ hours of content daily, storage was unsustainable.',
      lessonLearned: 'Video storage is expensive at scale. Implement lifecycle policies and tier storage.',
      icon: '💸',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Transcoding 100K concurrent streams',
      howTheyDoIt: 'Uses AWS Elemental MediaLive for transcoding, S3 for VOD storage. Auto-scales media servers based on stream count.',
    },

    diagram: `
Stream Ingestion:
┌──────────┐   RTMP   ┌──────────────┐   HLS    ┌─────────┐
│ Streamer │ ──────▶  │ Media Server │ ───────▶ │ Viewers │
│  (OBS)   │          │ (Transcode)  │          └─────────┘
└──────────┘          └──────┬───────┘
                             │
                     Save VOD │
                             ▼
                    ┌─────────────────┐
                    │ Object Storage  │
                    │     (S3)        │
                    └─────────────────┘
`,

    keyPoints: [
      'Media Server handles live transcoding (CPU/GPU intensive)',
      'Object Storage for VODs, database for VOD metadata',
      'RTMP ingest → HLS/DASH output for viewers',
      'Lifecycle policies: delete VODs after retention period',
    ],

    quickCheck: {
      question: 'Why not use regular App Servers for video transcoding?',
      options: [
        'App servers can\'t process video',
        'Transcoding is extremely CPU/GPU intensive and needs specialized hardware',
        'It would violate copyright laws',
        'Transcoding must happen on the viewer\'s device',
      ],
      correctIndex: 1,
      explanation: 'Transcoding 1080p video in real-time requires GPUs and specialized software. App servers would melt under this load.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Stream live, FR-5: Watch VODs',
    taskDescription: 'Add Media Server and Object Storage',
    componentsNeeded: [
      { type: 'media_server', reason: 'Handle live stream transcoding', displayName: 'Media Server' },
      { type: 'object_storage', reason: 'Store VOD recordings', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Media Server component added',
      'Object Storage component added',
      'App Server connected to Media Server',
      'Media Server connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '🎬',
    message: 'Live streaming and VODs working!',
    achievement: 'Professional video infrastructure in place',
    metrics: [
      { label: 'Can transcode live', after: '✓' },
      { label: 'VOD storage', after: 'Unlimited (S3)' },
      { label: 'Stream qualities', after: '480p, 720p, 1080p' },
    ],
    nextTeaser: "But viewers far away experience buffering and high latency...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'media_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'media_server' },
      { fromType: 'media_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag Media Server and Object Storage onto the canvas',
    level2: 'Connect App Server → Media Server → Object Storage',
    solutionComponents: [{ type: 'media_server' }, { type: 'object_storage' }],
    solutionConnections: [
      { from: 'app_server', to: 'media_server' },
      { from: 'media_server', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 9: CDN + Message Queue for Chat
// =============================================================================

const step9: GuidedStep = {
  id: 'twitch-step-9',
  stepNumber: 9,
  frIndex: 2,

  story: {
    emoji: '🌍',
    scenario: "Viewers in Europe are experiencing 10+ second stream delay!",
    hook: "Your media servers are in US. Plus chat messages are overwhelming the app servers!",
    challenge: "Add CDN for global delivery and Message Queue for chat fan-out.",
    illustration: 'global-latency',
  },

  learnPhase: {
    conceptTitle: 'CDN for Streaming + Message Queue for Chat',
    conceptExplanation: `**CDN (Content Delivery Network)** for video:
- Caches HLS segments at edge locations globally
- First viewer: Edge fetches from origin, caches it
- Subsequent viewers: Served from edge (< 50ms latency)
- Essential for live streaming at global scale

**Message Queue for Chat**:
- When user sends chat message → Publish to queue
- All viewers in that channel are subscribed
- Message broker (Kafka/Redis Pub/Sub) fans out to millions
- Decouples chat from app servers

For Twitch:
- CDN delivers video streams globally
- Message queue handles chat fan-out (50K+ msg/sec in popular channels)`,

    whyItMatters: 'Without CDN, streams buffer constantly. Without message queue, chat collapses under viral moments.',

    famousIncident: {
      title: 'Pokimane\'s 100K Viewer Streams',
      company: 'Twitch',
      year: '2020',
      whatHappened: 'Popular streamer Pokimane regularly hit 100K+ viewers. Chat generated 30K+ messages per second. Twitch\'s message queue infrastructure handled it flawlessly.',
      lessonLearned: 'Chat at scale requires pub/sub messaging. Direct server-to-client doesn\'t scale.',
      icon: '💬',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Serving 2.5M viewers globally + 50K msg/sec chat',
      howTheyDoIt: 'Uses AWS CloudFront CDN for video, Amazon Kinesis for chat message fan-out. Edge locations in 200+ cities.',
    },

    diagram: `
Video Delivery:
┌─────────┐   50ms   ┌──────────┐  Cache miss  ┌──────────────┐
│ Viewer  │◀────────▶│   CDN    │ ───────────▶ │ Media Server │
│ (Tokyo) │          │   Edge   │              │   (Origin)   │
└─────────┘          └──────────┘              └──────────────┘

Chat Fan-out:
┌──────────┐  Send msg  ┌────────────┐  Publish  ┌───────────────┐
│  User A  │ ─────────▶ │ App Server │ ────────▶ │ Message Queue │
└──────────┘            └────────────┘           │   (Pub/Sub)   │
                                                 └───────┬───────┘
                                                         │
                                                 Fan-out to all
                                                         │
                              ┌──────────┬───────────────┼──────────┬──────────┐
                              ▼          ▼               ▼          ▼          ▼
                         Viewer 1   Viewer 2  ...  Viewer 50K  Viewer 100K
`,

    keyPoints: [
      'CDN caches HLS video segments globally',
      'Edge locations reduce latency from 1000ms to 50ms',
      'Message queue handles chat fan-out at scale',
      'Pub/Sub pattern: one message → millions of subscribers',
    ],

    quickCheck: {
      question: 'Why use a message queue for chat instead of direct WebSocket connections?',
      options: [
        'Message queues are faster',
        'With 100K viewers, fan-out from app server would overwhelm it. Queue handles this.',
        'WebSockets don\'t work for chat',
        'Message queues are cheaper',
      ],
      correctIndex: 1,
      explanation: 'Publishing one message to 100K WebSocket connections from an app server is impossible. Message queue distributes this load.',
    },
  },

  practicePhase: {
    frText: 'FR-2: Watch streams globally, FR-3: Real-time chat',
    taskDescription: 'Add CDN for video and Message Queue for chat',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver streams from edge locations globally', displayName: 'CloudFront CDN' },
      { type: 'message_queue', reason: 'Handle chat message fan-out', displayName: 'Kafka' },
    ],
    successCriteria: [
      'CDN component added',
      'Message Queue component added',
      'CDN connected to Media Server (origin)',
      'App Server connected to Message Queue',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: 'Global streaming + real-time chat working!',
    achievement: 'CDN + message queue complete',
    metrics: [
      { label: 'Europe latency', before: '10s', after: '2s' },
      { label: 'Global edge locations', after: '200+' },
      { label: 'Chat capacity', before: '1K msg/s', after: '50K+ msg/s' },
    ],
    nextTeaser: "Time to optimize costs...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'media_server', 'object_storage', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'media_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'media_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'media_server' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add CDN and Message Queue components',
    level2: 'Connect CDN → Media Server (for playback) and App Server → Message Queue (for chat)',
    solutionComponents: [{ type: 'cdn' }, { type: 'message_queue' }],
    solutionConnections: [
      { from: 'cdn', to: 'media_server' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10: GuidedStep = {
  id: 'twitch-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: {
    emoji: '💸',
    scenario: "Finance is panicking! Your cloud bill is $8M per month.",
    hook: "The CFO says: 'Live streaming is bleeding money. Cut costs 40% or we shut down.'",
    challenge: "Optimize your architecture to stay under budget while maintaining quality.",
    illustration: 'budget-crisis',
  },

  learnPhase: {
    conceptTitle: 'Cost Optimization for Live Streaming Platforms',
    conceptExplanation: `Live streaming is EXPENSIVE. Smart optimization is survival.

Cost optimization strategies:
1. **VOD Retention** - Delete VODs after 14-30 days (or tier to Glacier)
2. **CDN Caching** - Aggressive edge caching reduces bandwidth costs
3. **Smart Transcoding** - Don't transcode to 1080p if everyone watches at 720p
4. **Right-size Media Servers** - GPU instances are expensive, don't over-provision
5. **Auto-scaling** - Scale down media servers when streams end
6. **Compression** - Use efficient codecs (H.265/AV1 vs H.264)

For Twitch:
- VODs are 80% of storage costs (aggressive retention policies)
- Transcode on-demand for low-viewer streams (< 10 viewers)
- Scale media servers based on concurrent stream count`,

    whyItMatters: 'Bandwidth and transcoding are the biggest costs. Optimization can save millions monthly.',

    famousIncident: {
      title: 'Twitch Reduces VOD Storage',
      company: 'Twitch',
      year: '2020',
      whatHappened: 'Twitch cut VOD retention from 60 days to 14 days for non-Partners. Storage costs were unsustainable at scale. Community backlash was intense.',
      lessonLearned: 'Balance costs with user value. Communicate changes transparently.',
      icon: '💰',
    },

    realWorldExample: {
      company: 'Twitch',
      scenario: 'Running at massive scale profitably',
      howTheyDoIt: 'Aggressive VOD policies, tiered transcoding (only top streams get 1080p), leverages Amazon\'s infrastructure discounts.',
    },

    keyPoints: [
      'VOD retention policies: 14 days for most, 60 days for Partners',
      'Transcode on-demand for low-viewer streams',
      'CDN caching reduces expensive origin bandwidth',
      'Auto-scale media servers with stream count',
    ],

    quickCheck: {
      question: 'What\'s the most effective cost optimization for a live streaming platform?',
      options: [
        'Delete all VODs immediately',
        'Reduce video quality for everyone',
        'Aggressive VOD retention policies + on-demand transcoding for small streams',
        'Use cheaper servers',
      ],
      correctIndex: 2,
      explanation: 'VOD storage is 80% of costs. Smart retention + on-demand transcoding can cut costs by 50%+ without hurting UX.',
    },
  },

  practicePhase: {
    frText: 'All FRs within budget',
    taskDescription: 'Optimize system to stay under $500/month budget',
    successCriteria: [
      'Review component configurations',
      'Ensure total cost under budget',
      'Maintain performance requirements',
    ],
  },

  celebration: {
    emoji: '🏆',
    message: 'Congratulations! You built Twitch!',
    achievement: 'A scalable, cost-effective live streaming platform',
    metrics: [
      { label: 'Monthly cost', before: '$8M', after: 'Under budget' },
      { label: 'Stream latency', after: '<5s' },
      { label: 'Chat latency', after: '<200ms' },
      { label: 'Concurrent viewers', after: '2.5M' },
      { label: 'Global availability', after: '99.99%' },
    ],
    nextTeaser: "You've mastered live streaming system design!",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'media_server', 'object_storage', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'media_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'media_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'media_server' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning',
    level2: 'Consider: VOD retention policies, fewer media server instances if acceptable, right-sized instances. Keep CDN caching aggressive.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const twitchGuidedTutorial: GuidedTutorial = {
  problemId: 'twitch',
  title: 'Design Twitch',
  description: 'Build a live streaming platform with real-time video, chat, and global delivery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🎮',
    hook: "You've been hired as Lead Engineer at LiveStream Technologies!",
    scenario: "Your mission: Build a platform where gamers can stream live and viewers can watch and chat in real-time - like Twitch!",
    challenge: "Can you design a system that handles 100K concurrent streams with < 5 second latency?",
  },

  requirementsPhase: twitchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'Live Video Streaming (RTMP, HLS)',
    'Real-time Chat (WebSockets)',
    'Database Design',
    'Caching Strategies',
    'Load Balancing (L4 vs L7)',
    'Database Replication',
    'Horizontal Scaling',
    'Media Servers and Transcoding',
    'Object Storage for VODs',
    'CDN for Video Delivery',
    'Message Queues (Pub/Sub)',
    'Low-latency Streaming',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Trouble with Distributed Systems',
    'Chapter 11: Stream Processing',
  ],
};

export default twitchGuidedTutorial;
