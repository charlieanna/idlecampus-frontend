import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Instagram Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a photo-sharing platform like Instagram.
 *
 * Key Concepts:
 * - Image storage and CDN delivery
 * - Feed generation (fan-out)
 * - Caching strategies (read-heavy 100:1)
 * - Object storage for media
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const instagramRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a photo-sharing platform like Instagram",

  interviewer: {
    name: 'Emily Rodriguez',
    role: 'Principal Engineer at Photo Social Inc.',
    avatar: '👩‍💻',
  },

  questions: [
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main things users want to do on this platform?",
      answer: "Users want to:\n\n1. **Upload photos** - Share images with captions and filters\n2. **View their feed** - See photos from people they follow\n3. **Engage with content** - Like and comment on posts\n4. **Follow others** - Build their social network\n5. **Explore** - Discover new content and users",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Instagram is fundamentally about visual content sharing and social connection",
    },
    {
      id: 'photo-upload',
      category: 'functional',
      question: "What happens when a user uploads a photo?",
      answer: "The user selects a photo, optionally applies filters, writes a caption, and posts it. The photo should appear in their followers' feeds within seconds.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Photo upload involves large file handling - different from text-based apps",
    },
    {
      id: 'feed-algorithm',
      category: 'functional',
      question: "How should the feed be ordered?",
      answer: "For the MVP, show posts from followed users in reverse chronological order (newest first). Algorithmic ranking can be a v2 feature.",
      importance: 'important',
      insight: "Starting with chronological is simpler than algorithmic feeds",
    },
    {
      id: 'stories-reels',
      category: 'clarification',
      question: "What about Stories or Reels (short videos)?",
      answer: "Let's focus on photo sharing for the MVP. Stories (24-hour ephemeral content) and Reels (short videos) are v2 features that add significant complexity.",
      importance: 'nice-to-have',
      insight: "Stories require TTL-based deletion, Reels require video processing - good to defer",
    },
    {
      id: 'direct-messages',
      category: 'clarification',
      question: "Should users be able to send direct messages?",
      answer: "Not for the MVP. DMs are a separate messaging system. Let's focus on the public feed experience first.",
      importance: 'nice-to-have',
      insight: "DMs are essentially a separate chat application - scope creep to include",
    },

    // Scale & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "1 billion registered users, 500 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Instagram is one of the largest photo platforms globally",
    },
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many photos are uploaded per day?",
      answer: "About 100 million new photos per day",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 uploads/sec",
        result: "~1,200 uploads/sec (3,600 at peak)",
      },
      learningPoint: "High write volume for media files",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many feed views per day?",
      answer: "About 10 billion feed views per day",
      importance: 'critical',
      calculation: {
        formula: "10B ÷ 86,400 sec = 115,740 reads/sec",
        result: "~116K reads/sec (350K at peak)",
      },
      learningPoint: "100:1 read-to-write ratio - caching is essential!",
    },
    {
      id: 'photo-size',
      category: 'payload',
      question: "What's the average photo size?",
      answer: "Average 2MB per photo, max 10MB. We'll generate multiple resolutions (thumbnail, medium, full).",
      importance: 'important',
      calculation: {
        formula: "100M photos × 2MB = 200TB/day new storage",
        result: "~73PB/year storage growth",
      },
      learningPoint: "Media storage grows fast - need object storage + CDN",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the feed load?",
      answer: "p99 under 200ms for feed load. Images should start appearing immediately.",
      importance: 'critical',
      learningPoint: "Fast initial load, then progressive image loading",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'photo-upload', 'throughput-reads'],
  criticalFRQuestionIds: ['core-features', 'photo-upload'],
  criticalScaleQuestionIds: ['throughput-reads', 'photo-size', 'latency-feed'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can upload photos',
      description: 'Share images with captions to your profile',
      emoji: '📷',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view their feed',
      description: 'See photos from followed users, newest first',
      emoji: '📰',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can like and comment',
      description: 'Engage with posts through likes and comments',
      emoji: '❤️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can follow others',
      description: 'Build your network by following other users',
      emoji: '👥',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can explore content',
      description: 'Discover new photos and users',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500 million',
    writesPerDay: '100 million photos',
    readsPerDay: '10 billion feed views',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 1157, peak: 3471 },
    calculatedReadRPS: { average: 115740, peak: 347220 },
    maxPayloadSize: '~10MB (photo)',
    storagePerRecord: '~2MB average',
    storageGrowthPerYear: '~73PB',
    redirectLatencySLA: 'p99 < 200ms (feed)',
    createLatencySLA: 'p99 < 2s (upload)',
  },

  architecturalImplications: [
    '✅ Read-heavy (100:1) → Aggressive caching for feed',
    '✅ Large media files → Object storage (S3) + CDN required',
    '✅ 350K reads/sec peak → Multiple app servers + load balancing',
    '✅ 73PB/year growth → Tiered storage strategy',
    '✅ Global users → Multi-region CDN for low latency',
  ],

  outOfScope: [
    'Stories (ephemeral content)',
    'Reels (short videos)',
    'Direct messages',
    'Filters/image processing',
    'Algorithmic feed ranking',
  ],

  keyInsight: "First, let's make it WORK. We'll build a system where users can upload and view photos. The complexity of CDN, caching, and feed optimization comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'instagram-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '📸',
    scenario: "Welcome to Photo Social Inc! You're building the next Instagram.",
    hook: "Your first user just downloaded the app. They're ready to share their first photo!",
    challenge: "Set up the basic connection so users can reach your server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation',
    conceptExplanation: `Every app starts with a **Client** (the user's device) connecting to a **Server**.

When someone opens Instagram:
1. The app (Client) sends requests to your servers
2. Your App Server processes the requests
3. The server sends back responses (feed data, images, etc.)

This is the foundation we'll build on!`,

    whyItMatters: 'Without this connection, users can\'t do anything in your app.',

    realWorldExample: {
      company: 'Instagram',
      scenario: 'Serving 500 million daily users',
      howTheyDoIt: 'Started as a simple Python server in 2010, now uses thousands of servers globally',
    },

    keyPoints: [
      'Client = the mobile app or web browser',
      'App Server = your backend that handles requests',
      'HTTP/HTTPS = the protocol for communication',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users with the Instagram app', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles photo uploads and feed requests', displayName: 'App Server' },
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
    nextTeaser: "But the server doesn't know how to handle photos yet...",
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
  id: 'instagram-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A user just tried to upload their first photo!",
    hook: "But the server doesn't know what to do with it. Error 500!",
    challenge: "Write the Python handlers for photo uploads and feed viewing.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Photo Upload & Feed APIs',
    conceptExplanation: `We need handlers for the core Instagram functionality:

- \`upload_photo()\` - Store photo metadata and return success
- \`get_feed()\` - Return photos from followed users
- \`follow_user()\` - Add someone to your following list
- \`like_photo()\` - Like a post

For now, we'll store metadata in memory. The actual image will go to object storage in a later step.`,

    whyItMatters: 'These handlers are the core logic of Instagram!',

    famousIncident: {
      title: 'Instagram\'s 2012 Terms of Service Crisis',
      company: 'Instagram',
      year: '2012',
      whatHappened: 'A poorly communicated terms update about photo rights caused massive user backlash. But the technical foundation held - the upload and feed APIs kept working.',
      lessonLearned: 'Get your core APIs rock solid. Everything else can be fixed.',
      icon: '📜',
    },

    keyPoints: [
      'upload_photo stores metadata (caption, user_id, timestamp)',
      'get_feed fetches posts from users you follow',
      'In-memory storage for now - database comes next',
    ],

    quickCheck: {
      question: 'Why do we store photo metadata separately from the actual image?',
      options: [
        'Images are too big for databases',
        'It\'s faster to query text than binary data',
        'Both A and B - metadata in DB, images in object storage',
        'There\'s no reason, just convention',
      ],
      correctIndex: 2,
      explanation: 'Databases are optimized for structured queries. Storing 2MB images in a DB would be slow and expensive.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Upload photos, FR-2: View feed',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign upload and feed APIs',
      'Open Python tab and implement handlers',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Photos can be uploaded and viewed!',
    achievement: 'Core Instagram functionality working',
    metrics: [
      { label: 'APIs implemented', after: '4' },
      { label: 'Can upload', after: '✓' },
      { label: 'Can view feed', after: '✓' },
    ],
    nextTeaser: "But if the server restarts, all photos are lost...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /photos and GET /feed',
    level2: 'Switch to Python tab and fill in the TODO sections',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/photos', 'GET /api/v1/feed'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3: GuidedStep = {
  id: 'instagram-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Disaster! The server crashed last night.",
    hook: "When it came back up, every photo, every like, every follow - GONE.",
    challenge: "Add a database so data survives server restarts.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Persistent Storage with Databases',
    conceptExplanation: `In-memory storage is fast but volatile. A **database** provides:

- **Durability**: Data survives crashes
- **Structure**: Tables for users, photos, follows, likes
- **Queries**: Efficient data retrieval with SQL

For Instagram's metadata, we need tables:
- \`users\` - User accounts
- \`photos\` - Photo metadata (not the actual image!)
- \`follows\` - Who follows whom
- \`likes\` - Photo likes`,

    whyItMatters: 'Users trust you with their memories. Losing photos is unforgivable.',

    famousIncident: {
      title: 'Flickr Photo Loss',
      company: 'Flickr',
      year: '2011',
      whatHappened: 'A bug in Flickr\'s storage system permanently deleted 3,400 users\' photos. The company spent weeks in crisis mode.',
      lessonLearned: 'Data durability isn\'t optional. Test your backup and recovery procedures.',
      icon: '😱',
    },

    realWorldExample: {
      company: 'Instagram',
      scenario: 'Storing metadata for 100B+ photos',
      howTheyDoIt: 'Uses PostgreSQL for structured data, with heavy sharding by user_id',
    },

    keyPoints: [
      'Database stores photo metadata (caption, timestamp, likes)',
      'Actual images go to object storage (Step 8)',
      'PostgreSQL is great for relational data',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, photos, follows, likes', displayName: 'PostgreSQL' },
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
    nextTeaser: "But the feed is loading slowly...",
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
// STEP 4: Add Cache for Fast Feeds
// =============================================================================

const step4: GuidedStep = {
  id: 'instagram-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '🐌',
    scenario: "You have 1 million users now. The feed takes 3 seconds to load!",
    hook: "Every feed request hits the database. It's melting under the load.",
    challenge: "Add a cache to make feed loads instant.",
    illustration: 'slow-loading',
  },

  learnPhase: {
    conceptTitle: 'Caching Strategies for Read-Heavy Systems',
    conceptExplanation: `Instagram has a 100:1 read-to-write ratio. **Caching** is essential!

**Cache-Aside Pattern** (what we'll use):
1. Check cache first
2. If miss, fetch from database
3. Store in cache for next time

For Instagram, we cache:
- User feeds (list of photo IDs)
- Photo metadata
- User profiles

TTL (Time To Live) ensures stale data expires.`,

    whyItMatters: 'At 350K reads/sec, every database query costs money and latency. Cache hits are nearly free.',

    famousIncident: {
      title: 'Instagram\'s Redis Migration',
      company: 'Instagram',
      year: '2017',
      whatHappened: 'Instagram moved from Memcached to Redis for more features. The careful migration took months to avoid any user impact.',
      lessonLearned: 'Caching infrastructure is critical. Changes require extreme care.',
      icon: '🔄',
    },

    realWorldExample: {
      company: 'Instagram',
      scenario: '100:1 read-to-write ratio',
      howTheyDoIt: 'Uses Redis clusters to cache feeds and profiles. 95%+ cache hit rate.',
    },

    diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                                   └───────┘
                                       │
                               95% cache hit!
`,

    keyPoints: [
      'Cache-aside: Check cache → miss → fetch DB → populate cache',
      'Set TTL to balance freshness vs hit rate',
      'Cache user feeds, not individual photos',
    ],

    quickCheck: {
      question: 'With a 100:1 read-write ratio, what cache hit rate should you target?',
      options: [
        '50% - half from cache is good enough',
        '80% - most requests from cache',
        '95%+ - almost all reads from cache',
        '100% - never hit the database',
      ],
      correctIndex: 2,
      explanation: 'For read-heavy systems, 95%+ hit rate is achievable and necessary. 100% is impossible due to cache misses on new data.',
    },
  },

  practicePhase: {
    frText: 'FR-2: View feed (now fast!)',
    taskDescription: 'Add Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache feeds for instant loading', displayName: 'Redis Cache' },
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
    message: 'Feeds load 30x faster!',
    achievement: 'Caching dramatically improved performance',
    metrics: [
      { label: 'Feed latency', before: '3000ms', after: '100ms' },
      { label: 'Cache hit rate', after: '95%' },
    ],
    nextTeaser: "But one server can't handle all this traffic...",
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
  id: 'instagram-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: {
    emoji: '🔥',
    scenario: "A celebrity just posted! Your single server is at 100% CPU!",
    hook: "Traffic spiked 10x in 30 seconds. Users are getting timeouts.",
    challenge: "Add a load balancer to distribute traffic.",
    illustration: 'server-overload',
  },

  learnPhase: {
    conceptTitle: 'Load Balancing for High Traffic',
    conceptExplanation: `A **Load Balancer** distributes requests across multiple servers.

Benefits:
- **No single point of failure** - one server down, others continue
- **Horizontal scaling** - add more servers for more capacity
- **Health checks** - automatically route around failures

For Instagram, we'll use Layer 7 (HTTP) load balancing to route different API paths to specialized servers.`,

    whyItMatters: 'Celebrity posts cause 100x traffic spikes. One server will always fail.',

    famousIncident: {
      title: 'Kylie Jenner Egg Challenge',
      company: 'Instagram',
      year: '2019',
      whatHappened: 'A photo of an egg became the most-liked post ever. Traffic patterns were unexpected but the infrastructure held.',
      lessonLearned: 'Viral content is unpredictable. Design for elasticity.',
      icon: '🥚',
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
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
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
  id: 'instagram-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: {
    emoji: '⚠️',
    scenario: "Your database server just died. Hardware failure.",
    hook: "All users see 'Something went wrong.' for 2 hours until you restore from backup.",
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

    whyItMatters: 'Instagram stores billions of photos. 2 hours of downtime = millions in lost revenue and user trust.',

    famousIncident: {
      title: 'GitLab Database Deletion',
      company: 'GitLab',
      year: '2017',
      whatHappened: 'An engineer accidentally deleted the production database. Replication was lagging, so backups were also affected. 6 hours of data lost.',
      lessonLearned: 'Test your replication and failover regularly. Monitor replication lag.',
      icon: '🗑️',
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
    nextTeaser: "But we need more app servers...",
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
  id: 'instagram-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: {
    emoji: '📈',
    scenario: "You've grown to 100 million users! One app server is maxed out.",
    hook: "Even with caching, request volume is overwhelming a single server.",
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

For Instagram, we'll run multiple app server instances behind the load balancer.`,

    whyItMatters: 'At 350K requests/sec, you need dozens of servers working together.',

    realWorldExample: {
      company: 'Instagram',
      scenario: 'Handling Super Bowl traffic',
      howTheyDoIt: 'Auto-scales from 100s to 1000s of servers based on traffic patterns',
    },

    keyPoints: [
      'Add more server instances to handle more traffic',
      'Load balancer distributes across all instances',
      'Stateless servers are easier to scale',
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
    nextTeaser: "But the actual photos are stored... where?",
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
// STEP 8: Object Storage for Photos
// =============================================================================

const step8: GuidedStep = {
  id: 'instagram-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: {
    emoji: '📦',
    scenario: "You're storing 200TB of photos per day. The database can't handle binary files!",
    hook: "Databases are designed for structured data, not 2MB image blobs.",
    challenge: "Add object storage (S3) for photo files.",
    illustration: 'storage-full',
  },

  learnPhase: {
    conceptTitle: 'Object Storage for Media Files',
    conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (images, videos)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy

Architecture:
- **Database**: Photo metadata (caption, user_id, timestamp)
- **Object Storage**: Actual image files
- Photo URL stored in database points to S3 object`,

    whyItMatters: 'Instagram stores 100B+ photos. You can\'t put 200TB/day in PostgreSQL.',

    famousIncident: {
      title: 'Dropbox S3 to Own Storage',
      company: 'Dropbox',
      year: '2016',
      whatHappened: 'Dropbox moved from S3 to their own storage (Magic Pocket) to save $75M/year at their scale.',
      lessonLearned: 'Start with managed services. Build your own only at massive scale.',
      icon: '💰',
    },

    realWorldExample: {
      company: 'Instagram',
      scenario: 'Storing 100B+ photos',
      howTheyDoIt: 'Uses Facebook\'s custom storage (Haystack) optimized for photos. Started on S3.',
    },

    diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Upload photo
       ▼
┌──────────────┐     2. Store image    ┌─────────────────┐
│  App Server  │ ──────────────────▶  │  Object Storage │
└──────┬───────┘                       │     (S3)        │
       │                               └─────────────────┘
       │ 3. Save metadata
       ▼
┌──────────────┐
│   Database   │  (photo_url: "s3://bucket/photo123.jpg")
└──────────────┘
`,

    keyPoints: [
      'Object storage for files, database for metadata',
      'Store photo URL in database, actual file in S3',
      'S3 handles replication and durability',
    ],

    quickCheck: {
      question: 'Why not store photos directly in the database?',
      options: [
        'Databases can\'t store binary data',
        'It\'s too slow and expensive at scale',
        'It would violate data privacy laws',
        'Photos are always public',
      ],
      correctIndex: 1,
      explanation: 'Databases CAN store binary, but it\'s not optimized for it. Queries slow down, storage costs balloon.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Upload photos (now at scale!)',
    taskDescription: 'Add Object Storage for photo files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store photo files durably', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '☁️',
    message: 'Photos have a proper home!',
    achievement: 'Object storage handles unlimited photos',
    metrics: [
      { label: 'Photo storage', after: 'Unlimited (S3)' },
      { label: 'Durability', after: '99.999999999%' },
    ],
    nextTeaser: "But users far away experience slow image loading...",
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
    level2: 'Connect App Server to Object Storage for photo uploads',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: CDN for Fast Image Delivery
// =============================================================================

const step9: GuidedStep = {
  id: 'instagram-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: {
    emoji: '🌍',
    scenario: "Users in Tokyo are seeing 3-second image load times!",
    hook: "Your servers are in US-East. Round-trip to Japan takes 200ms just for network latency.",
    challenge: "Add a CDN to serve images from edge locations worldwide.",
    illustration: 'global-latency',
  },

  learnPhase: {
    conceptTitle: 'CDN for Global Performance',
    conceptExplanation: `A **CDN** (Content Delivery Network) caches static content at edge locations worldwide.

How it works:
1. First request: Edge fetches from origin (S3), caches it
2. Subsequent requests: Served from edge (< 50ms)

For Instagram photos:
- Popular photos cached at all edges
- Less popular photos fetched on demand
- TTL ensures fresh content after updates`,

    whyItMatters: 'Instagram has users worldwide. CDN makes photos load fast everywhere.',

    famousIncident: {
      title: 'Fastly Outage',
      company: 'Fastly CDN',
      year: '2021',
      whatHappened: 'A single configuration change took down major websites globally for an hour. Reddit, Twitch, NYTimes - all down.',
      lessonLearned: 'CDN is critical infrastructure. Multi-CDN strategies provide redundancy.',
      icon: '🌐',
    },

    realWorldExample: {
      company: 'Instagram',
      scenario: 'Serving 10B+ images daily',
      howTheyDoIt: 'Uses Facebook\'s global CDN with thousands of edge locations. 99%+ cache hit rate for popular content.',
    },

    diagram: `
User in Tokyo:
                                    ┌─────────────┐
┌──────────┐    50ms    ┌──────────┤  Tokyo Edge │
│   User   │◀──────────▶│   CDN    │    Cache    │
│ (Tokyo)  │            │          └─────────────┘
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
      'CDN caches images at edge locations globally',
      'Users get images from nearest edge (< 50ms)',
      'Origin (S3) only hit on cache miss',
    ],

    quickCheck: {
      question: 'What\'s the main benefit of a CDN for image delivery?',
      options: [
        'Images are stored more securely',
        'Users get images from nearby servers, reducing latency',
        'Images are compressed automatically',
        'It\'s cheaper than S3',
      ],
      correctIndex: 1,
      explanation: 'CDN edges are geographically distributed. Users fetch from nearby edge instead of distant origin.',
    },
  },

  practicePhase: {
    frText: 'FR-2: View feed with fast image loading',
    taskDescription: 'Add CDN for global image delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver images from edge locations', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: 'Images load fast everywhere!',
    achievement: 'CDN delivers photos globally',
    metrics: [
      { label: 'Tokyo latency', before: '3000ms', after: '50ms' },
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
    level2: 'CDN serves as the public endpoint for images, S3 is the origin',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10: GuidedStep = {
  id: 'instagram-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: {
    emoji: '💸',
    scenario: "Finance is worried! Your cloud bill is $1.2M per month.",
    hook: "The CFO says: 'Cut costs 25% or we're shutting down features.'",
    challenge: "Optimize your architecture to stay under budget.",
    illustration: 'budget-crisis',
  },

  learnPhase: {
    conceptTitle: 'Cost Optimization Strategies',
    conceptExplanation: `Building scalable systems is great. Building affordable ones is essential.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use reserved/spot instances** - Up to 70% savings
3. **Tiered storage** - Move old photos to cheaper storage
4. **CDN caching** - Reduce origin requests
5. **Auto-scaling** - Scale down during low traffic`,

    whyItMatters: 'The best architecture is one the company can afford to run.',

    famousIncident: {
      title: 'Dropbox Saves $75M',
      company: 'Dropbox',
      year: '2017',
      whatHappened: 'By moving from AWS to their own infrastructure, Dropbox saved $75M over two years.',
      lessonLearned: 'At extreme scale, build your own. Below that, optimize cloud costs.',
      icon: '💰',
    },

    keyPoints: [
      'Right-size your infrastructure',
      'Use caching to reduce expensive operations',
      'Tiered storage for hot vs cold data',
      'Auto-scale based on actual demand',
    ],

    quickCheck: {
      question: 'What\'s the easiest cost optimization for a read-heavy system?',
      options: [
        'Delete old data',
        'Use smaller servers',
        'Improve caching to reduce database/origin requests',
        'Reduce replica count',
      ],
      correctIndex: 2,
      explanation: 'Better caching means fewer expensive database queries and origin fetches. It\'s often the highest-impact optimization.',
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
    message: 'Congratulations! You built Instagram!',
    achievement: 'A scalable, cost-effective photo-sharing platform',
    metrics: [
      { label: 'Monthly cost', before: '$1.2M', after: 'Under budget' },
      { label: 'Feed latency', after: '<200ms' },
      { label: 'Photo uploads', after: '100M/day' },
      { label: 'Global availability', after: '99.99%' },
    ],
    nextTeaser: "You've mastered Instagram system design!",
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
    level2: 'Consider: smaller cache, fewer replicas if acceptable, right-sized instances',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const instagramGuidedTutorial: GuidedTutorial = {
  problemId: 'instagram',
  title: 'Design Instagram',
  description: 'Build a photo-sharing platform with feeds, likes, and global delivery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📸',
    hook: "You've been hired as Lead Engineer at Photo Social Inc!",
    scenario: "Your mission: Build a platform where users can share photos and see content from people they follow - like Instagram!",
    challenge: "Can you design a system that handles 100 million photo uploads per day?",
  },

  requirementsPhase: instagramRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching Strategies',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Object Storage',
    'CDN',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 9: Consistency',
  ],
};

export default instagramGuidedTutorial;
