import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Snapchat Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building an ephemeral messaging platform like Snapchat.
 *
 * Key Concepts:
 * - Ephemeral content (auto-deletion after viewing)
 * - TTL-based expiration (Stories - 24 hours)
 * - Media delivery (photos/videos)
 * - Real-time messaging
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const snapchatRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an ephemeral messaging platform like Snapchat",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Engineer at Ephemeral Media Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    {
      id: 'core-features',
      category: 'functional',
      question: "What makes this platform different from other messaging apps?",
      answer: "The core differentiator is **ephemeral content** - messages that disappear!\n\n1. **Snaps** - Photo/video messages that disappear after being viewed\n2. **Stories** - Content visible to friends for 24 hours, then auto-deleted\n3. **Chat** - Direct messaging with friends\n4. **Lenses/Filters** - Augmented reality effects for photos",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-4',
      learningPoint: "Snapchat pioneered ephemeral content - privacy through auto-deletion",
    },
    {
      id: 'snap-lifecycle',
      category: 'functional',
      question: "What exactly happens to a Snap after it's sent?",
      answer: "1. User takes a photo/video and sends it\n2. Recipient gets a notification\n3. Recipient opens and views the Snap\n4. After viewing (or after 24 hours if unopened), the Snap is **permanently deleted**\n\nUsers can set a view timer: 1-10 seconds after opening.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "View-once + TTL deletion is the core mechanic - very different from Instagram!",
    },
    {
      id: 'stories-lifecycle',
      category: 'functional',
      question: "How do Stories work differently from Snaps?",
      answer: "Stories are posted to your 'Story feed' where all friends can view them:\n- Visible for exactly **24 hours** from posting\n- Friends can view multiple times during that window\n- Auto-deleted after 24 hours\n- Sender can see who viewed their Story",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Stories are TTL-based (24h expiry) vs view-based (Snaps)",
    },
    {
      id: 'chat-persistence',
      category: 'functional',
      question: "Are chat messages also ephemeral?",
      answer: "By default, yes! Chat messages disappear after both parties leave the conversation. But users can choose to save specific messages. For MVP, let's implement basic disappearing chat.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      insight: "Default-ephemeral chat is unique to Snapchat",
    },
    {
      id: 'filters-ar',
      category: 'clarification',
      question: "How important are filters and AR lenses?",
      answer: "They're a key differentiator, but for the MVP, let's focus on content delivery. Filters require real-time face detection and AR rendering - that's a v2 feature with significant ML complexity.",
      importance: 'nice-to-have',
      insight: "AR/ML features are complex - good to scope out for initial design",
    },
    {
      id: 'screenshot-detection',
      category: 'clarification',
      question: "Should we detect if someone takes a screenshot of a Snap?",
      answer: "Yes, that's important for privacy - Snapchat notifies the sender when someone screenshots. But it's a platform-specific feature we can add later.",
      importance: 'nice-to-have',
      insight: "Privacy features are important but not core to the architecture",
    },

    // Scale & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "750 million registered users, 400 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Snapchat is one of the largest messaging platforms globally",
    },
    {
      id: 'throughput-snaps',
      category: 'throughput',
      question: "How many Snaps are sent per day?",
      answer: "About 5 billion Snaps per day",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 Snaps/sec",
        result: "~58K sends/sec (175K at peak)",
      },
      learningPoint: "Extremely high write volume for media content",
    },
    {
      id: 'throughput-stories',
      category: 'throughput',
      question: "How many Story views per day?",
      answer: "About 10 billion Story views per day",
      importance: 'critical',
      calculation: {
        formula: "10B ÷ 86,400 sec = 115,740 views/sec",
        result: "~116K views/sec (350K at peak)",
      },
      learningPoint: "Stories are read-heavy, Snaps are write-heavy",
    },
    {
      id: 'media-size',
      category: 'payload',
      question: "What's the average Snap/Story size?",
      answer: "Photos average 500KB, videos average 2MB. Maximum 10 seconds of video.",
      importance: 'important',
      calculation: {
        formula: "5B Snaps × 1MB average = 5PB/day new content",
        result: "~1.8EB/year (but most deleted after 24h!)",
      },
      learningPoint: "Massive media volume, but ephemeral = aggressive deletion reduces long-term storage",
    },
    {
      id: 'latency-delivery',
      category: 'latency',
      question: "How fast should Snaps be delivered?",
      answer: "p99 under 2 seconds from send to notification. Users expect near-instant delivery like iMessage.",
      importance: 'critical',
      learningPoint: "Real-time delivery expectations despite large media files",
    },
    {
      id: 'deletion-timing',
      category: 'reliability',
      question: "How critical is the deletion guarantee?",
      answer: "**Extremely critical.** This is Snapchat's core privacy promise. If content isn't deleted when promised, it's a major trust violation. We need 100% reliability on TTL expiration.",
      importance: 'critical',
      learningPoint: "Ephemeral deletion is not just a feature - it's the product's core value proposition",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'snap-lifecycle', 'stories-lifecycle'],
  criticalFRQuestionIds: ['core-features', 'snap-lifecycle', 'stories-lifecycle'],
  criticalScaleQuestionIds: ['throughput-snaps', 'media-size', 'deletion-timing'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can send Snaps',
      description: 'Send photo/video messages that disappear after viewing',
      emoji: '📸',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can post Stories',
      description: 'Share content visible to friends for 24 hours',
      emoji: '📖',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can chat',
      description: 'Send disappearing text messages to friends',
      emoji: '💬',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can view friend content',
      description: 'See Snaps, Stories, and chats from friends',
      emoji: '👀',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '400 million',
    writesPerDay: '5 billion Snaps',
    readsPerDay: '10 billion Story views',
    peakMultiplier: 3,
    readWriteRatio: '2:1 (Snaps write-heavy, Stories read-heavy)',
    calculatedWriteRPS: { average: 57870, peak: 173610 },
    calculatedReadRPS: { average: 115740, peak: 347220 },
    maxPayloadSize: '~2MB (video)',
    storagePerRecord: '~1MB average',
    storageGrowthPerYear: '~1.8EB (but most deleted within 24h)',
    redirectLatencySLA: 'p99 < 2s (delivery)',
    createLatencySLA: 'p99 < 1s (upload)',
  },

  architecturalImplications: [
    '✅ Ephemeral content → TTL-based deletion jobs critical for trust',
    '✅ 175K writes/sec peak → High-throughput media upload pipeline',
    '✅ Large media files → Object storage (S3) + CDN required',
    '✅ Stories have 24h TTL → Redis/cache perfect for temporary storage',
    '✅ Real-time delivery → Message queues + push notifications',
    '✅ Most content deleted quickly → Tiered storage strategy',
  ],

  outOfScope: [
    'AR Filters/Lenses (ML-based)',
    'Screenshot detection',
    'Snap Map (geolocation features)',
    'Discover content (publisher stories)',
    'Memories (saved Snaps)',
    'Video calling',
  ],

  keyInsight: "First, let's make it WORK. We'll build a system where users can send and view photos. The complexity of ephemeral deletion, TTL management, and real-time delivery comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'snapchat-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '👻',
    scenario: "Welcome to Ephemeral Media Inc! You're building the next Snapchat.",
    hook: "Your first user just opened the app. They're ready to send their first Snap!",
    challenge: "Set up the basic connection so users can reach your server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation',
    conceptExplanation: `Every messaging app starts with a **Client** (the user's device) connecting to a **Server**.

When someone opens Snapchat:
1. The app (Client) sends requests to your servers
2. Your App Server processes the requests
3. The server sends back responses (messages, stories, etc.)

This is the foundation we'll build on!`,

    whyItMatters: 'Without this connection, users can\'t send or receive any content.',

    realWorldExample: {
      company: 'Snapchat',
      scenario: 'Serving 400 million daily users',
      howTheyDoIt: 'Started with a simple server in 2011, now uses Google Cloud Platform with thousands of servers globally',
    },

    keyPoints: [
      'Client = the mobile app (iOS/Android)',
      'App Server = your backend that handles Snaps and Stories',
      'HTTPS = secure protocol for private messages',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users with the Snapchat app', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles Snaps, Stories, and chat messages', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Your app is online!',
    achievement: 'Users can now connect to your server',
    metrics: [
      { label: 'Status', after: 'Online' },
      { label: 'Accepting requests', after: '✓' },
    ],
    nextTeaser: "But the server doesn't know how to handle Snaps yet...",
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
// STEP 2: Implement Core Logic
// =============================================================================

const step2: GuidedStep = {
  id: 'snapchat-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A user just tried to send their first Snap!",
    hook: "But the server doesn't know what to do with it. Error 500!",
    challenge: "Write the Python handlers for sending Snaps and viewing Stories.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Snap & Story APIs',
    conceptExplanation: `We need handlers for the core Snapchat functionality:

- \`send_snap()\` - Upload photo/video, mark as unviewed
- \`view_snap()\` - Mark as viewed, schedule deletion
- \`post_story()\` - Upload to Story feed with 24h TTL
- \`get_stories()\` - Fetch friend stories not yet expired
- \`send_message()\` - Send chat message

For now, we'll track metadata in memory. The actual media will go to object storage in a later step.`,

    whyItMatters: 'These handlers are the core logic of Snapchat!',

    famousIncident: {
      title: 'Snapchat Spam Attack',
      company: 'Snapchat',
      year: '2014',
      whatHappened: 'Hackers exploited the "Find Friends" API to scrape 4.6 million usernames and phone numbers. The API had no rate limiting.',
      lessonLearned: 'Always implement rate limiting and authentication on ALL endpoints.',
      icon: '🔒',
    },

    keyPoints: [
      'send_snap stores metadata + schedules deletion after view',
      'post_story sets 24h TTL for automatic expiration',
      'In-memory storage for now - database comes next',
    ],

    quickCheck: {
      question: 'What makes Snapchat different from Instagram for data management?',
      options: [
        'Snapchat uses more servers',
        'Snapchat content auto-deletes based on TTL or view events',
        'Snapchat doesn\'t store any data',
        'Instagram is read-only',
      ],
      correctIndex: 1,
      explanation: 'Ephemeral deletion is core to Snapchat. Most content is automatically deleted within 24 hours or after viewing.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Send Snaps, FR-2: Post Stories',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign Snap and Story APIs',
      'Open Python tab and implement handlers',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Snaps and Stories are working!',
    achievement: 'Core Snapchat functionality implemented',
    metrics: [
      { label: 'APIs implemented', after: '5' },
      { label: 'Can send Snaps', after: '✓' },
      { label: 'Can post Stories', after: '✓' },
    ],
    nextTeaser: "But if the server restarts, all Snaps are lost...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /snaps and POST /stories',
    level2: 'Switch to Python tab and fill in the TODO sections',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/snaps', 'POST /api/v1/stories', 'GET /api/v1/stories'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3: GuidedStep = {
  id: 'snapchat-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Disaster! The server crashed during peak hours.",
    hook: "When it came back up, every Snap, every Story, every friend connection - GONE.",
    challenge: "Add a database so data survives server restarts.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Persistent Storage with Databases',
    conceptExplanation: `In-memory storage is fast but volatile. A **database** provides:

- **Durability**: Data survives crashes
- **Structure**: Tables for users, snaps, stories, messages
- **Queries**: Efficient data retrieval with SQL

For Snapchat's metadata, we need tables:
- \`users\` - User accounts and friend lists
- \`snaps\` - Snap metadata (not the actual image!)
- \`stories\` - Story metadata with expiration timestamps
- \`messages\` - Chat history`,

    whyItMatters: 'Even though content is ephemeral, user accounts and friend relationships must persist.',

    famousIncident: {
      title: 'Snapchat Server Outage',
      company: 'Snapchat',
      year: '2015',
      whatHappened: 'A database failure caused a 3-hour outage. Users couldn\'t send or receive Snaps. The company lost significant user trust.',
      lessonLearned: 'Database reliability is critical - even for "ephemeral" apps. You need replication and backups.',
      icon: '😱',
    },

    realWorldExample: {
      company: 'Snapchat',
      scenario: 'Managing 400M user accounts and billions of ephemeral messages',
      howTheyDoIt: 'Uses Cloud SQL (PostgreSQL) for user data, with aggressive TTL-based cleanup for old content',
    },

    keyPoints: [
      'Database stores metadata (who, when, expires_at)',
      'Actual media goes to object storage (Step 8)',
      'TTL fields enable scheduled deletion',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, snaps, stories, messages', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },

  celebration: {
    emoji: '💾',
    message: 'Your data is safe!',
    achievement: 'Persistent storage enabled',
    metrics: [
      { label: 'Data durability', after: '100%' },
      { label: 'Survives restarts', after: '✓' },
    ],
    nextTeaser: "But we need to implement the ephemeral deletion...",
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
// STEP 4: Add Cache with TTL for Stories
// =============================================================================

const step4: GuidedStep = {
  id: 'snapchat-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '⏰',
    scenario: "Stories need to disappear after exactly 24 hours!",
    hook: "The database doesn't have built-in TTL. We're manually checking expiration on every query - it's slow!",
    challenge: "Add Redis cache with native TTL support for automatic Story expiration.",
    illustration: 'time-critical',
  },

  learnPhase: {
    conceptTitle: 'TTL-Based Caching for Ephemeral Content',
    conceptExplanation: `**Redis** is perfect for ephemeral content because it has native **TTL** (Time To Live):

**How TTL Works:**
1. Store a Story in Redis with TTL=86400 seconds (24 hours)
2. Redis automatically deletes it after 24 hours
3. No manual cleanup jobs needed!

For Snapchat:
- **Stories** → Redis with 24h TTL
- **Active Snaps** → Redis until viewed (then deleted)
- **User sessions** → Redis with short TTL

This also improves read performance - Stories are read-heavy!`,

    whyItMatters: 'Ephemeral deletion is Snapchat\'s core promise. TTL ensures it happens reliably.',

    famousIncident: {
      title: 'Snapchat Messages Not Deleting',
      company: 'Snapchat',
      year: '2013',
      whatHappened: 'Security researchers discovered that "deleted" Snaps were still recoverable from device storage. Major privacy scandal.',
      lessonLearned: 'Ephemeral deletion must happen at ALL layers - server AND client.',
      icon: '🔐',
    },

    realWorldExample: {
      company: 'Snapchat',
      scenario: 'Managing billions of Stories with 24h expiration',
      howTheyDoIt: 'Uses Redis clusters for Stories with automatic TTL. Also caches user data for fast access.',
    },

    diagram: `
┌────────┐     ┌─────────────┐     ┌───────────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │   Redis   │ ──▶ │ Database │
└────────┘     └─────────────┘     │ TTL: 24h  │     └──────────┘
                                   └───────────┘
                                        │
                                   Auto-delete
                                   after 24h!
`,

    keyPoints: [
      'Redis natively supports TTL (auto-deletion)',
      'Stories stored in Redis with 24h TTL',
      'Cache also speeds up Story feed reads',
    ],

    quickCheck: {
      question: 'Why use Redis for ephemeral content instead of the database?',
      options: [
        'Redis is cheaper than databases',
        'Redis has native TTL support and is faster for temporary data',
        'Databases can\'t delete data',
        'Redis stores images better',
      ],
      correctIndex: 1,
      explanation: 'Redis natively supports TTL-based expiration and is optimized for temporary data. Perfect for ephemeral content!',
    },
  },

  practicePhase: {
    frText: 'FR-2: Post Stories (with 24h auto-deletion)',
    taskDescription: 'Add Redis cache with TTL configuration',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache Stories with 24h TTL for auto-deletion', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'TTL configured (86400 seconds = 24 hours)',
      'Cache strategy set',
    ],
  },

  celebration: {
    emoji: '⏱️',
    message: 'Stories auto-delete after 24 hours!',
    achievement: 'TTL-based ephemeral deletion working',
    metrics: [
      { label: 'Story TTL', after: '24 hours' },
      { label: 'Auto-deletion', after: '✓' },
      { label: 'Read latency', before: '500ms', after: '50ms' },
    ],
    nextTeaser: "But one server can't handle 175K Snaps/sec...",
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
    level2: 'Connect App Server to Cache. Set TTL to 86400 seconds (24 hours).',
    solutionComponents: [{ type: 'cache', config: { ttl: 86400, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5: GuidedStep = {
  id: 'snapchat-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: {
    emoji: '🔥',
    scenario: "It's New Year's Eve! Everyone's sending Snaps at midnight!",
    hook: "Traffic spiked 20x in 60 seconds. Your single server crashed!",
    challenge: "Add a load balancer to distribute traffic across multiple servers.",
    illustration: 'server-overload',
  },

  learnPhase: {
    conceptTitle: 'Load Balancing for High Traffic',
    conceptExplanation: `A **Load Balancer** distributes requests across multiple servers.

Benefits:
- **No single point of failure** - one server down, others continue
- **Horizontal scaling** - add more servers for more capacity
- **Health checks** - automatically route around failures

For Snapchat at 175K writes/sec peak, we need many servers working together.`,

    whyItMatters: 'Holiday events and viral moments cause massive traffic spikes. One server will always fail.',

    famousIncident: {
      title: 'Snapchat New Year\'s Eve Crash',
      company: 'Snapchat',
      year: '2015',
      whatHappened: 'On New Year\'s Eve, traffic surged so high that Snapchat went down for several hours globally. Millions couldn\'t send celebratory Snaps.',
      lessonLearned: 'Plan for 10x traffic spikes on holidays. Load balancing and auto-scaling are essential.',
      icon: '🎆',
    },

    keyPoints: [
      'Load balancer distributes requests across servers',
      'Enables adding/removing servers without downtime',
      'Health checks detect and route around failures',
    ],
  },

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic to prevent overload', displayName: 'Load Balancer' },
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
    nextTeaser: "But we need more than one server...",
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
  id: 'snapchat-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: {
    emoji: '⚠️',
    scenario: "Your database server just died. Disk failure.",
    hook: "All users see 'Can't send Snaps' for hours until you restore from backup.",
    challenge: "Add database replication for instant failover.",
    illustration: 'database-failure',
  },

  learnPhase: {
    conceptTitle: 'Database Replication for High Availability',
    conceptExplanation: `**Replication** copies data to multiple servers:

- **Primary**: Handles all writes
- **Replicas**: Handle reads, stay in sync with primary

Benefits:
- If primary fails, replica becomes new primary (failover)
- Spread read load across replicas
- Multiple copies = data safety`,

    whyItMatters: 'Snapchat users trust you with their friend connections and account data. Database failure = complete outage.',

    famousIncident: {
      title: 'AWS RDS Failure Impact',
      company: 'Multiple companies',
      year: '2018',
      whatHappened: 'An AWS RDS outage in US-East-1 took down dozens of apps without database replication. Apps with replicas failed over seamlessly.',
      lessonLearned: 'Always use replication. Cloud providers have outages too.',
      icon: '🗄️',
    },

    keyPoints: [
      'Primary handles writes, replicas handle reads',
      'Failover: replica promoted to primary on failure',
      'Use 2+ replicas for safety',
    ],
  },

  practicePhase: {
    frText: 'All FRs need reliable data',
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
  id: 'snapchat-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: {
    emoji: '📈',
    scenario: "You've grown to 100 million users! Peak traffic is overwhelming.",
    hook: "Even with caching, 175K requests/sec is too much for one app server.",
    challenge: "Scale horizontally by adding more app server instances.",
    illustration: 'traffic-spike',
  },

  learnPhase: {
    conceptTitle: 'Horizontal Scaling',
    conceptExplanation: `**Horizontal scaling** = adding more servers (scale out)
**Vertical scaling** = upgrading a single server (scale up)

Horizontal is better because:
- No upper limit (keep adding servers)
- Better fault tolerance (one fails, others continue)
- More cost-effective at scale

For Snapchat, we'll run multiple app server instances behind the load balancer.`,

    whyItMatters: 'At 175K requests/sec peak, you need dozens of servers working together.',

    realWorldExample: {
      company: 'Snapchat',
      scenario: 'Handling holiday traffic spikes',
      howTheyDoIt: 'Auto-scales from hundreds to thousands of servers on Google Cloud during peak events',
    },

    keyPoints: [
      'Add more server instances to handle more traffic',
      'Load balancer distributes across all instances',
      'Stateless servers are easier to scale',
    ],
  },

  practicePhase: {
    frText: 'All FRs need more compute capacity',
    taskDescription: 'Scale App Server to 5+ instances',
    successCriteria: [
      'Click App Server',
      'Set instances to 5 or more',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: '10x more capacity!',
    achievement: 'Multiple servers share the load',
    metrics: [
      { label: 'App Server instances', before: '1', after: '5+' },
      { label: 'Request capacity', before: '10K/s', after: '200K+/s' },
    ],
    nextTeaser: "But the actual photos and videos are stored... where?",
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
    level2: 'Set instances to 5 for horizontal scaling',
    solutionComponents: [{ type: 'app_server', config: { instances: 5 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Object Storage for Media Files
// =============================================================================

const step8: GuidedStep = {
  id: 'snapchat-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: {
    emoji: '📦',
    scenario: "You're storing 5 petabytes of Snaps per day. The database is screaming!",
    hook: "Databases are designed for structured data, not 2MB video files.",
    challenge: "Add object storage (S3) for photo and video files.",
    illustration: 'storage-full',
  },

  learnPhase: {
    conceptTitle: 'Object Storage for Media Files',
    conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (photos, videos)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy

Architecture:
- **Database**: Snap metadata (sender, receiver, expires_at)
- **Object Storage**: Actual image/video files
- Media URL stored in database points to S3 object

For ephemeral content:
- S3 objects have TTL and auto-delete
- Saves massive storage costs vs keeping everything`,

    whyItMatters: 'Snapchat stores 5B Snaps/day. You can\'t put 5PB/day in PostgreSQL.',

    famousIncident: {
      title: 'Snapchat Photo Leak',
      company: 'Snapchat',
      year: '2014',
      whatHappened: 'Third-party apps exploited Snapchat\'s API to save Snaps to external servers. 200,000 private photos leaked.',
      lessonLearned: 'Secure your media URLs. Use signed URLs with expiration. Never trust the client to delete.',
      icon: '🔓',
    },

    realWorldExample: {
      company: 'Snapchat',
      scenario: 'Storing billions of photos/videos',
      howTheyDoIt: 'Uses Google Cloud Storage with aggressive lifecycle policies. Most content deleted within 24-48 hours.',
    },

    diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Upload Snap
       ▼
┌──────────────┐     2. Store media     ┌─────────────────┐
│  App Server  │ ──────────────────▶   │  Object Storage │
└──────┬───────┘                        │  (S3) + TTL     │
       │                                └─────────────────┘
       │ 3. Save metadata                       │
       ▼                                  Auto-delete
┌──────────────┐                         after 24h!
│   Database   │  (media_url, expires_at)
└──────────────┘
`,

    keyPoints: [
      'Object storage for files, database for metadata',
      'Store media URL in database, actual file in S3',
      'S3 lifecycle policies enable auto-deletion',
    ],

    quickCheck: {
      question: 'Why not store photos/videos directly in the database?',
      options: [
        'Databases can\'t store binary data',
        'It\'s too slow and expensive at scale',
        'Videos are always public',
        'Databases are faster for media',
      ],
      correctIndex: 1,
      explanation: 'Databases CAN store binary, but it\'s not optimized for it. At 5PB/day, costs and performance would be terrible.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Send Snaps (now at scale!)',
    taskDescription: 'Add Object Storage for media files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store photo/video files with TTL', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '☁️',
    message: 'Media files have a proper home!',
    achievement: 'Object storage handles unlimited media',
    metrics: [
      { label: 'Media storage', after: 'Unlimited (S3)' },
      { label: 'Durability', after: '99.999999999%' },
      { label: 'Daily uploads', after: '5B Snaps' },
    ],
    nextTeaser: "But users far away experience slow Snap delivery...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect App Server to Object Storage for media uploads',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: CDN for Fast Global Delivery
// =============================================================================

const step9: GuidedStep = {
  id: 'snapchat-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: {
    emoji: '🌍',
    scenario: "Users in Australia are waiting 5 seconds for Snaps to load!",
    hook: "Your servers are in US-West. Network latency to Australia is 300ms+ each way.",
    challenge: "Add a CDN to serve media from edge locations worldwide.",
    illustration: 'global-latency',
  },

  learnPhase: {
    conceptTitle: 'CDN for Global Performance',
    conceptExplanation: `A **CDN** (Content Delivery Network) caches content at edge locations worldwide.

How it works:
1. First request: Edge fetches from origin (S3), caches it
2. Subsequent requests: Served from edge (< 50ms)

For Snapchat Stories:
- Popular Stories cached at all edges
- Snaps (view-once) may skip cache
- Reduces latency from 3000ms to 50ms globally`,

    whyItMatters: 'Snapchat has users worldwide. Slow delivery = users switch to other apps.',

    famousIncident: {
      title: 'Snapchat Lenses Performance',
      company: 'Snapchat',
      year: '2016',
      whatHappened: 'When Snapchat launched sponsored AR lenses, they used CDN to distribute lens assets globally. Without CDN, users would wait 10+ seconds to download effects.',
      lessonLearned: 'For real-time features, every millisecond matters. CDN is essential.',
      icon: '🎭',
    },

    realWorldExample: {
      company: 'Snapchat',
      scenario: 'Serving billions of Snaps and Stories globally',
      howTheyDoIt: 'Uses Google Cloud CDN with hundreds of edge locations. Stories are cached, Snaps use edge for proximity.',
    },

    diagram: `
User in Australia:
                                    ┌─────────────┐
┌──────────┐    50ms    ┌──────────┤ Sydney Edge │
│   User   │◀──────────▶│   CDN    │    Cache    │
│ (Sydney) │            │          └─────────────┘
└──────────┘            │
                        │ Cache miss?
                        │    ▼
                        │ ┌─────────────┐
                        │ │   Origin    │
                        └─│    (S3)     │
                          │   US-West   │
                          └─────────────┘
`,

    keyPoints: [
      'CDN caches media at edge locations globally',
      'Users get content from nearest edge (< 50ms)',
      'Origin (S3) only hit on cache miss',
    ],

    quickCheck: {
      question: 'What\'s the main benefit of a CDN for Snapchat?',
      options: [
        'Media files are stored more securely',
        'Users get media from nearby servers, reducing latency',
        'Videos are compressed automatically',
        'It\'s cheaper than S3',
      ],
      correctIndex: 1,
      explanation: 'CDN edges are geographically distributed. Users fetch from nearby edge instead of distant origin, dramatically reducing latency.',
    },
  },

  practicePhase: {
    frText: 'FR-4: View content with fast global delivery',
    taskDescription: 'Add CDN for global media delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver media from edge locations worldwide', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: 'Snaps load fast everywhere!',
    achievement: 'CDN delivers media globally',
    metrics: [
      { label: 'Australia latency', before: '5000ms', after: '50ms' },
      { label: 'Global edge locations', after: '200+' },
    ],
    nextTeaser: "Time to optimize costs...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
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

const step10: GuidedStep = {
  id: 'snapchat-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: {
    emoji: '💸',
    scenario: "Finance is worried! Your cloud bill is $2M per month.",
    hook: "The CFO says: 'We're spending too much on ephemeral content that gets deleted anyway!'",
    challenge: "Optimize your architecture to stay under budget.",
    illustration: 'budget-crisis',
  },

  learnPhase: {
    conceptTitle: 'Cost Optimization for Ephemeral Content',
    conceptExplanation: `Building scalable systems is great. Building affordable ones is essential.

Cost optimization strategies for Snapchat:
1. **Aggressive TTL cleanup** - Delete content immediately after viewing/24h
2. **Right-size instances** - Don't over-provision
3. **CDN caching** - Reduce origin requests for Stories
4. **Tiered storage** - Most content deleted quickly, no need for expensive storage
5. **Auto-scaling** - Scale down during low traffic

The key insight: Ephemeral = lower long-term storage costs!`,

    whyItMatters: 'The best architecture is one the company can afford to run.',

    famousIncident: {
      title: 'Snapchat vs Instagram Stories',
      company: 'Snapchat',
      year: '2016',
      whatHappened: 'Instagram copied Snapchat Stories. Snapchat\'s advantage: their infrastructure was optimized for ephemeral content with auto-deletion, keeping costs lower.',
      lessonLearned: 'Architecture matters. Optimize for your use case - ephemeral content needs different infrastructure than permanent storage.',
      icon: '💰',
    },

    keyPoints: [
      'Ephemeral content = aggressive deletion = lower storage costs',
      'Use Redis TTL for automatic cleanup',
      'Right-size infrastructure for actual load',
      'Auto-scale based on traffic patterns',
    ],

    quickCheck: {
      question: 'What\'s the biggest cost advantage of ephemeral content?',
      options: [
        'Users pay for storage',
        'No need for databases',
        'Automatic deletion after 24h means minimal long-term storage costs',
        'Less bandwidth usage',
      ],
      correctIndex: 2,
      explanation: 'Most Snapchat content is deleted within 24 hours. Storage costs grow slowly vs apps that keep everything forever.',
    },
  },

  practicePhase: {
    frText: 'All FRs within budget',
    taskDescription: 'Optimize system to stay under $800/month budget',
    successCriteria: [
      'Review component configurations',
      'Ensure total cost under budget',
      'Maintain performance requirements',
    ],
  },

  celebration: {
    emoji: '🏆',
    message: 'Congratulations! You built Snapchat!',
    achievement: 'A scalable, cost-effective ephemeral messaging platform',
    metrics: [
      { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
      { label: 'Snap delivery', after: '<2s p99' },
      { label: 'Story views', after: '10B/day' },
      { label: 'Auto-deletion', after: '100% reliable' },
    ],
    nextTeaser: "You've mastered Snapchat system design!",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning',
    level2: 'Consider: fewer instances if traffic permits, optimized cache TTL, right-sized storage',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const snapchatGuidedTutorial: GuidedTutorial = {
  problemId: 'snapchat',
  title: 'Design Snapchat',
  description: 'Build an ephemeral messaging platform with disappearing Snaps and Stories',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '👻',
    hook: "You've been hired as Lead Engineer at Ephemeral Media Inc!",
    scenario: "Your mission: Build a platform where content disappears after viewing - like Snapchat!",
    challenge: "Can you design a system that handles 5 billion ephemeral Snaps per day?",
  },

  requirementsPhase: snapchatRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'TTL-Based Caching',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Object Storage',
    'CDN',
    'Cost Optimization',
    'Ephemeral Content Management',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 9: Consistency',
  ],
};

export default snapchatGuidedTutorial;
