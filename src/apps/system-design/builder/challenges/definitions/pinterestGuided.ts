import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Pinterest Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a visual discovery platform like Pinterest.
 *
 * Key Concepts:
 * - Image storage and CDN delivery
 * - Board-based content organization
 * - Visual search and recommendation
 * - Feed generation (following users and boards)
 * - High read-to-write ratio (discovery-heavy)
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const pinterestRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a visual discovery platform like Pinterest",

  interviewer: {
    name: 'Sarah Martinez',
    role: 'Senior Engineering Manager at Visual Discovery Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main things users want to do on this platform?",
      answer: "Users want to:\n\n1. **Create pins** - Save images with descriptions and links\n2. **Organize boards** - Group related pins into themed collections\n3. **Discover content** - Browse and search for visual inspiration\n4. **Follow users and boards** - Get updates from favorite creators\n5. **Save pins** - Add others' pins to your own boards (re-pinning)",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Pinterest is about visual discovery and curation, not social interaction",
    },
    {
      id: 'pin-creation',
      category: 'functional',
      question: "What happens when a user creates a pin?",
      answer: "User uploads an image or saves from a URL, adds a title, description, and selects a board. The pin should:\n1. Store the image in our system\n2. Be visible on their board immediately\n3. Appear in followers' feeds within seconds",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Pins are visual bookmarks - different from social media posts",
    },
    {
      id: 'boards',
      category: 'functional',
      question: "How do boards work?",
      answer: "Boards are collections of pins around a theme (e.g., 'Kitchen Ideas', 'Travel Inspiration'). Users can:\n1. Create multiple boards\n2. Make boards public or private\n3. Add pins to any board\n4. Follow specific boards, not just users",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Board-level following is unique to Pinterest - more granular than user-level",
    },
    {
      id: 'discovery',
      category: 'functional',
      question: "How should users discover new content?",
      answer: "Pinterest is discovery-first:\n1. **Home feed** - Pins from followed users/boards + recommendations\n2. **Search** - Visual and text search for pins\n3. **Related pins** - Similar content based on current pin\n4. **Trending** - Popular pins in categories",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Discovery is the core value - users browse more than they create",
    },
    {
      id: 'repinning',
      category: 'functional',
      question: "What is re-pinning and how does it work?",
      answer: "Re-pinning is saving someone else's pin to your board. It's like retweeting - creates a new reference without duplicating the image. The original creator gets credit.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Re-pinning creates network effects - one pin can reach millions",
    },
    {
      id: 'messaging',
      category: 'clarification',
      question: "Should users be able to message each other?",
      answer: "Not for the MVP. Pinterest is about discovery, not conversation. Comments on pins are sufficient for v1.",
      importance: 'nice-to-have',
      insight: "Direct messaging is a separate system - defer for later",
    },
    {
      id: 'analytics',
      category: 'clarification',
      question: "Should we track analytics for pins?",
      answer: "Basic analytics (views, saves, clicks) yes. Detailed creator analytics is a v2 feature for business accounts.",
      importance: 'nice-to-have',
      insight: "Start simple, add comprehensive analytics later",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "500 million registered users, 250 million monthly active users (MAU), 50 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Pinterest is one of the largest visual platforms globally",
    },
    {
      id: 'throughput-pins',
      category: 'throughput',
      question: "How many pins are created per day?",
      answer: "About 5 million new pins per day",
      importance: 'critical',
      calculation: {
        formula: "5M ÷ 86,400 sec = 58 pins/sec",
        result: "~60 pins/sec average (180 at peak)",
      },
      learningPoint: "Moderate write volume compared to reads",
    },
    {
      id: 'throughput-views',
      category: 'throughput',
      question: "How many pin views per day?",
      answer: "About 10 billion pin views per day (discovery-heavy platform)",
      importance: 'critical',
      calculation: {
        formula: "10B ÷ 86,400 sec = 115,740 views/sec",
        result: "~116K views/sec average (350K at peak)",
      },
      learningPoint: "200:1 read-to-write ratio - extremely read-heavy!",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day?",
      answer: "About 2 billion searches per day - Pinterest is a visual search engine",
      importance: 'important',
      calculation: {
        formula: "2B ÷ 86,400 sec = 23,148 searches/sec",
        result: "~23K searches/sec average (70K at peak)",
      },
      learningPoint: "Search is a critical feature - needs to be fast and relevant",
    },
    {
      id: 'image-size',
      category: 'payload',
      question: "What's the typical pin image size?",
      answer: "Average 500KB per image (Pinterest images are often tall/vertical). We'll generate multiple sizes (thumbnail, medium, full).",
      importance: 'important',
      calculation: {
        formula: "5M pins × 500KB × 3 sizes = 7.5TB/day new storage",
        result: "~2.7PB/year storage growth",
      },
      learningPoint: "Image storage grows steadily - need object storage + CDN",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the home feed load?",
      answer: "p99 under 300ms for initial feed load. Images should start appearing immediately with progressive loading.",
      importance: 'critical',
      learningPoint: "Fast visual browsing experience is key to engagement",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results appear?",
      answer: "p99 under 500ms for search results. Visual search is more complex than text search.",
      importance: 'important',
      learningPoint: "Search latency affects discovery - needs to feel instant",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'pin-creation', 'discovery', 'throughput-views'],
  criticalFRQuestionIds: ['core-features', 'pin-creation', 'boards'],
  criticalScaleQuestionIds: ['throughput-views', 'throughput-searches', 'image-size', 'latency-feed'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create pins',
      description: 'Save images with titles, descriptions, and links',
      emoji: '📌',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can organize boards',
      description: 'Create themed collections of pins',
      emoji: '📋',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can discover content',
      description: 'Browse feed and search for visual inspiration',
      emoji: '🔍',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can follow users and boards',
      description: 'Get updates from favorite creators and topics',
      emoji: '👥',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can re-pin content',
      description: 'Save others\' pins to your boards',
      emoji: '🔁',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '5 million pins',
    readsPerDay: '10 billion pin views',
    peakMultiplier: 3,
    readWriteRatio: '200:1',
    calculatedWriteRPS: { average: 58, peak: 174 },
    calculatedReadRPS: { average: 115740, peak: 347220 },
    maxPayloadSize: '~10MB (image)',
    storagePerRecord: '~1.5MB average (with thumbnails)',
    storageGrowthPerYear: '~2.7PB',
    redirectLatencySLA: 'p99 < 300ms (feed)',
    createLatencySLA: 'p99 < 1s (pin creation)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (200:1) → Aggressive caching essential',
    '✅ 350K views/sec peak → CDN + multiple cache layers required',
    '✅ 70K searches/sec → Elasticsearch for fast visual search',
    '✅ 2.7PB/year growth → Object storage with tiered pricing',
    '✅ Discovery-first → Recommendation engine needed (v2)',
    '✅ Board-level follows → More complex feed generation than user-level',
  ],

  outOfScope: [
    'Direct messaging',
    'Video pins (Idea Pins)',
    'Shopping integration',
    'ML-based visual search',
    'Comprehensive creator analytics',
    'Ads and monetization',
  ],

  keyInsight: "First, let's make it WORK. We'll build a system where users can save pins to boards and browse visual content. The complexity of visual search, recommendations, and feed optimization comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'pinterest-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '📌',
    scenario: "Welcome to Visual Discovery Inc! You're building the next Pinterest.",
    hook: "Your first user just opened the app. They found a beautiful recipe photo and want to save it!",
    challenge: "Set up the basic connection so users can reach your server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation',
    conceptExplanation: `Every app starts with a **Client** (the user's device) connecting to a **Server**.

When someone opens Pinterest:
1. The app (Client) sends requests to your servers
2. Your App Server processes the requests (create pin, get feed, search)
3. The server sends back responses (pins, images, boards)

This is the foundation we'll build on!`,

    whyItMatters: 'Without this connection, users can\'t save or discover pins.',

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Serving 250 million monthly users',
      howTheyDoIt: 'Started as a simple Django/Python server in 2010, now uses distributed systems globally',
    },

    keyPoints: [
      'Client = the mobile app or web browser',
      'App Server = your backend that handles pin operations',
      'HTTP/HTTPS = the protocol for communication',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users with the Pinterest app', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles pin creation and discovery requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Your platform is online!',
    achievement: 'Users can now connect to your server',
    metrics: [
      { label: 'Status', after: 'Online' },
      { label: 'Accepting requests', after: '✓' },
    ],
    nextTeaser: "But the server doesn't know how to handle pins yet...",
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
  id: 'pinterest-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A user just tried to create their first pin!",
    hook: "But the server doesn't know what to do with it. Error 500!",
    challenge: "Write the Python handlers for pin creation and feed viewing.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Pin Management APIs',
    conceptExplanation: `We need handlers for the core Pinterest functionality:

- \`create_pin()\` - Store pin metadata and image reference
- \`create_board()\` - Create a new themed board
- \`get_feed()\` - Return pins from followed users/boards
- \`repin()\` - Save someone else's pin to your board

For now, we'll store metadata in memory. The actual images will go to object storage in a later step.`,

    whyItMatters: 'These handlers are the core logic of Pinterest!',

    famousIncident: {
      title: 'Pinterest\'s Early Growth Crisis',
      company: 'Pinterest',
      year: '2011',
      whatHappened: 'Pinterest grew from 10K to 12M users in one year. The original architecture couldn\'t scale, causing frequent outages. They rebuilt the entire backend.',
      lessonLearned: 'Design for scale from day one. Technical debt compounds fast with viral growth.',
      icon: '📈',
    },

    keyPoints: [
      'create_pin stores image URL, title, description, board_id',
      'get_feed fetches pins from followed users and boards',
      'Boards are collections - one-to-many relationship with pins',
    ],

    quickCheck: {
      question: 'Why does Pinterest use boards instead of just user profiles?',
      options: [
        'It\'s just a design choice with no real benefit',
        'Boards allow topic-based following, better for discovery',
        'Boards are easier to implement technically',
        'To be different from Instagram',
      ],
      correctIndex: 1,
      explanation: 'Board-level following lets users curate their feed by topics (e.g., "recipes" but not "fashion" from the same creator). This enhances discovery.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Create pins, FR-2: Organize boards',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign pin and board APIs',
      'Open Python tab and implement handlers',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Pins can be created and organized!',
    achievement: 'Core Pinterest functionality working',
    metrics: [
      { label: 'APIs implemented', after: '4' },
      { label: 'Can create pins', after: '✓' },
      { label: 'Can organize boards', after: '✓' },
    ],
    nextTeaser: "But if the server restarts, all pins are lost...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /pins and GET /feed',
    level2: 'Switch to Python tab and fill in the TODO sections',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/pins', 'GET /api/v1/feed'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3: GuidedStep = {
  id: 'pinterest-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Disaster! Your server crashed overnight.",
    hook: "When it came back up, every pin, every board, every follow - GONE. Users are furious!",
    challenge: "Add a database so data survives server restarts.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Persistent Storage with Databases',
    conceptExplanation: `In-memory storage is fast but volatile. A **database** provides:

- **Durability**: Data survives crashes and restarts
- **Structure**: Tables for users, pins, boards, follows
- **Queries**: Efficient data retrieval with SQL

For Pinterest's metadata, we need tables:
- \`users\` - User accounts
- \`pins\` - Pin metadata (title, description, image URL, board_id)
- \`boards\` - Collections of pins
- \`follows\` - User and board follows
- \`repins\` - Track pin sharing across boards`,

    whyItMatters: 'Users spend hours curating their boards. Losing that data destroys trust forever.',

    famousIncident: {
      title: 'Ma.gnolia Bookmark Service Collapse',
      company: 'Ma.gnolia',
      year: '2009',
      whatHappened: 'A database corruption event wiped out all user bookmarks. The company never recovered and shut down.',
      lessonLearned: 'For user-generated content platforms, data loss is existential. Backups and replication are non-negotiable.',
      icon: '😱',
    },

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Storing 240B+ pins',
      howTheyDoIt: 'Uses MySQL for structured data with heavy sharding. HBase for some use cases.',
    },

    keyPoints: [
      'Database stores pin metadata, not images',
      'Actual images go to object storage (Step 8)',
      'Relational structure: boards have many pins',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, pins, boards, follows', displayName: 'MySQL' },
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
    nextTeaser: "But the feed is loading slowly with lots of users...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (MySQL) onto the canvas',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Fast Feeds
// =============================================================================

const step4: GuidedStep = {
  id: 'pinterest-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '🐌',
    scenario: "You have 5 million users now. The feed takes 5 seconds to load!",
    hook: "Every feed request queries the database for followed boards and their pins. It's melting!",
    challenge: "Add a cache to make feed loads instant.",
    illustration: 'slow-loading',
  },

  learnPhase: {
    conceptTitle: 'Caching Strategies for Discovery Platforms',
    conceptExplanation: `Pinterest has a 200:1 read-to-write ratio. **Caching** is essential!

**Cache-Aside Pattern** (what we'll use):
1. Check cache first for user's feed
2. If miss, fetch from database (complex join across boards/pins)
3. Store in cache for next time (TTL: 60 seconds)

For Pinterest, we cache:
- User feeds (list of pin IDs from followed boards)
- Board contents (pins in a board)
- Pin metadata (for fast rendering)

The cache dramatically reduces database load for browsing users.`,

    whyItMatters: 'At 350K reads/sec, every database query costs money. Cache hits are nearly free.',

    famousIncident: {
      title: 'Pinterest\'s Redis Migration',
      company: 'Pinterest',
      year: '2014',
      whatHappened: 'Pinterest moved from a custom caching solution to Redis. The migration required careful planning to avoid data loss.',
      lessonLearned: 'Caching infrastructure is mission-critical. Choose proven solutions and plan migrations carefully.',
      icon: '🔄',
    },

    realWorldExample: {
      company: 'Pinterest',
      scenario: '200:1 read-to-write ratio',
      howTheyDoIt: 'Uses Redis and Memcached heavily. 95%+ cache hit rate for feeds.',
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
      'Cache feeds and boards, not individual pins',
    ],

    quickCheck: {
      question: 'With a 200:1 read-write ratio, what cache hit rate should you target?',
      options: [
        '50% - half from cache is good enough',
        '80% - most requests from cache',
        '95%+ - almost all reads from cache',
        '100% - never hit the database',
      ],
      correctIndex: 2,
      explanation: 'For read-heavy discovery platforms, 95%+ hit rate is achievable and necessary. 100% is impossible due to cache misses on new content.',
    },
  },

  practicePhase: {
    frText: 'FR-3: Discover content (now fast!)',
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
    message: 'Feeds load 50x faster!',
    achievement: 'Caching dramatically improved performance',
    metrics: [
      { label: 'Feed latency', before: '5000ms', after: '100ms' },
      { label: 'Cache hit rate', after: '95%' },
    ],
    nextTeaser: "But one server can't handle millions of users...",
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
  id: 'pinterest-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: {
    emoji: '🔥',
    scenario: "A popular influencer just pinned your platform! Traffic spiked 100x!",
    hook: "Your single server is at 100% CPU. Users are getting timeouts.",
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
- **Session persistence** - optional sticky sessions for stateful apps

For Pinterest, we'll use Layer 7 (HTTP) load balancing to route different API paths efficiently.`,

    whyItMatters: 'Viral pins cause massive traffic spikes. One server will always fail under load.',

    famousIncident: {
      title: 'Pinterest\'s Viral Growth',
      company: 'Pinterest',
      year: '2011-2012',
      whatHappened: 'Pinterest went from 10K to 12M users in months. Traffic patterns were unpredictable, requiring aggressive scaling.',
      lessonLearned: 'Viral growth is exponential. Design for elasticity from the start.',
      icon: '📈',
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
    nextTeaser: "But we need database redundancy...",
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
  id: 'pinterest-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: {
    emoji: '⚠️',
    scenario: "Your database server just died. Hardware failure.",
    hook: "All users see 'Something went wrong.' 240 billion pins are inaccessible for 3 hours!",
    challenge: "Add database replication for instant failover.",
    illustration: 'database-failure',
  },

  learnPhase: {
    conceptTitle: 'Database Replication for High Availability',
    conceptExplanation: `**Replication** copies data to multiple servers:

- **Primary**: Handles all writes (create pin, follow board)
- **Replicas**: Handle reads (get feed, search pins), stay in sync with primary

Benefits:
- If primary fails, replica becomes new primary (automatic failover)
- Spread read load across replicas (perfect for 200:1 read ratio)
- Multiple copies = data safety and geographic distribution`,

    whyItMatters: 'Pinterest stores billions of pins. 3 hours of downtime = massive user loss and revenue impact.',

    famousIncident: {
      title: 'GitHub Database Incident',
      company: 'GitHub',
      year: '2018',
      whatHappened: 'Network partition caused replication lag. When recovered, conflicting writes required manual reconciliation. 24 hours of degraded service.',
      lessonLearned: 'Test failover regularly. Monitor replication lag closely. Have rollback plans.',
      icon: '🗄️',
    },

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Handling 350K reads/sec',
      howTheyDoIt: 'Uses MySQL replication with multiple read replicas. Reads distributed across replicas.',
    },

    keyPoints: [
      'Primary handles writes, replicas handle reads',
      'Failover: replica promoted to primary on failure',
      'Use 2+ replicas for safety and read scaling',
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
    achievement: 'Replicas provide redundancy and read scaling',
    metrics: [
      { label: 'Database availability', before: '99%', after: '99.99%' },
      { label: 'Read capacity', before: '1x', after: '3x' },
    ],
    nextTeaser: "But we need more app servers to handle traffic...",
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
  id: 'pinterest-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: {
    emoji: '📈',
    scenario: "You've grown to 250 million monthly users! One app server is maxed out.",
    hook: "Even with caching, the volume of searches and feed requests is overwhelming.",
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
- Easier to auto-scale based on demand

For Pinterest, we'll run multiple app server instances behind the load balancer.`,

    whyItMatters: 'At 350K requests/sec, you need dozens of servers working together.',

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Handling holiday traffic spikes',
      howTheyDoIt: 'Auto-scales from hundreds to thousands of servers based on traffic patterns',
    },

    keyPoints: [
      'Add more server instances to handle more traffic',
      'Load balancer distributes across all instances',
      'Stateless servers are easier to scale (state in cache/DB)',
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
    nextTeaser: "But the actual pin images are stored... where?",
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
// STEP 8: Object Storage for Images
// =============================================================================

const step8: GuidedStep = {
  id: 'pinterest-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: {
    emoji: '📦',
    scenario: "You're storing 7.5TB of images per day. The database can't handle binary files!",
    hook: "Databases are designed for structured data, not 500KB image blobs.",
    challenge: "Add object storage (S3) for pin images.",
    illustration: 'storage-full',
  },

  learnPhase: {
    conceptTitle: 'Object Storage for Image Files',
    conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (images, videos)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy (11 nines durability)

Architecture:
- **Database**: Pin metadata (title, description, board_id, user_id)
- **Object Storage**: Actual image files in multiple sizes
- Image URL stored in database points to S3 object

When user creates pin:
1. Upload image to S3 → get URL
2. Store metadata + URL in database
3. Return pin_id to client`,

    whyItMatters: 'Pinterest stores 240B+ pins. You can\'t put 7.5TB/day in MySQL.',

    famousIncident: {
      title: 'AWS S3 Outage',
      company: 'AWS',
      year: '2017',
      whatHappened: 'S3 outage in US-East took down huge portions of the internet for 4 hours. Pinterest and thousands of apps affected.',
      lessonLearned: 'Multi-region redundancy is critical. Don\'t put all eggs in one availability zone.',
      icon: '☁️',
    },

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Storing 240B+ pins',
      howTheyDoIt: 'Started on AWS S3, now uses custom storage + S3. Multiple regions for redundancy.',
    },

    diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Create pin with image
       ▼
┌──────────────┐     2. Store image    ┌─────────────────┐
│  App Server  │ ──────────────────▶  │  Object Storage │
└──────┬───────┘                       │     (S3)        │
       │                               └─────────────────┘
       │ 3. Save metadata + image URL
       ▼
┌──────────────┐
│   Database   │  (image_url: "s3://bucket/pins/abc123.jpg")
└──────────────┘
`,

    keyPoints: [
      'Object storage for files, database for metadata',
      'Store image URL in database, actual file in S3',
      'S3 handles replication and durability automatically',
    ],

    quickCheck: {
      question: 'Why not store images directly in the database?',
      options: [
        'Databases can\'t store binary data',
        'It\'s too slow and expensive at scale',
        'Images would be less secure',
        'It violates data privacy laws',
      ],
      correctIndex: 1,
      explanation: 'Databases CAN store binary, but it\'s not optimized for it. Queries slow down, backups become huge, storage costs balloon.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Create pins (now at scale!)',
    taskDescription: 'Add Object Storage for pin images',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store pin images durably', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '☁️',
    message: 'Images have a proper home!',
    achievement: 'Object storage handles unlimited images',
    metrics: [
      { label: 'Image storage', after: 'Unlimited (S3)' },
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
    level2: 'Connect App Server to Object Storage for image uploads',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: CDN for Fast Image Delivery
// =============================================================================

const step9: GuidedStep = {
  id: 'pinterest-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: {
    emoji: '🌍',
    scenario: "Users in Australia are seeing 4-second image load times!",
    hook: "Your servers are in US-East. Round-trip to Australia takes 250ms just for network latency.",
    challenge: "Add a CDN to serve images from edge locations worldwide.",
    illustration: 'global-latency',
  },

  learnPhase: {
    conceptTitle: 'CDN for Global Visual Discovery',
    conceptExplanation: `A **CDN** (Content Delivery Network) caches static content at edge locations worldwide.

How it works:
1. First request: Edge fetches from origin (S3), caches it
2. Subsequent requests: Served from edge (< 50ms)
3. Popular pins cached at all edges globally

For Pinterest images:
- Popular pins cached everywhere (long TTL)
- Less popular pins fetched on demand
- Multiple image sizes (thumbnail, medium, full) all cached`,

    whyItMatters: 'Pinterest is a visual discovery platform. Slow images = poor experience = users leave.',

    famousIncident: {
      title: 'Cloudflare Global Outage',
      company: 'Cloudflare',
      year: '2020',
      whatHappened: 'A bad router configuration took down 50% of Cloudflare\'s network for 27 minutes. Millions of sites affected.',
      lessonLearned: 'Multi-CDN strategy provides redundancy. Always have a fallback to origin.',
      icon: '🌐',
    },

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Serving 10B+ pin views daily',
      howTheyDoIt: 'Uses Akamai and Fastly CDNs. 99%+ cache hit rate for popular pins.',
    },

    diagram: `
User in Sydney:
                                    ┌─────────────┐
┌──────────┐    30ms    ┌──────────┤  Sydney Edge│
│   User   │◀──────────▶│   CDN    │    Cache    │
│ (Sydney) │            │          └─────────────┘
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
      question: 'What\'s the main benefit of a CDN for Pinterest?',
      options: [
        'Images are stored more cheaply',
        'Users get images from nearby servers, reducing latency',
        'Images are automatically compressed',
        'It provides better security',
      ],
      correctIndex: 1,
      explanation: 'CDN edges are geographically distributed. Users fetch from nearby edge instead of distant origin, making visual browsing feel instant.',
    },
  },

  practicePhase: {
    frText: 'FR-3: Discover content with fast image loading',
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
    achievement: 'CDN delivers pins globally',
    metrics: [
      { label: 'Sydney latency', before: '4000ms', after: '30ms' },
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
  id: 'pinterest-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: {
    emoji: '💸',
    scenario: "Finance is worried! Your cloud bill is $800K per month.",
    hook: "The CFO says: 'Cut costs 30% or we're scaling back the product.'",
    challenge: "Optimize your architecture to stay under budget while maintaining performance.",
    illustration: 'budget-crisis',
  },

  learnPhase: {
    conceptTitle: 'Cost Optimization Strategies',
    conceptExplanation: `Building scalable systems is great. Building affordable ones is essential.

Cost optimization strategies:
1. **Right-size instances** - Match capacity to actual load
2. **Use reserved instances** - Up to 70% savings for steady state
3. **Tiered storage** - Move old pins to cheaper storage (Glacier)
4. **CDN caching** - Reduce origin requests (S3 egress is expensive)
5. **Auto-scaling** - Scale down during low traffic periods
6. **Compress images** - WebP format saves 30% bandwidth

For Pinterest specifically:
- Old pins (1+ year) → Glacier storage (90% cheaper)
- Aggressive CDN caching → reduce S3 bandwidth costs
- Right-size cache and DB instances`,

    whyItMatters: 'The best architecture is one the company can afford to run long-term.',

    famousIncident: {
      title: 'Pinterest\'s HBase Migration',
      company: 'Pinterest',
      year: '2014',
      whatHappened: 'Pinterest moved some data from MySQL to HBase to handle growth more cost-effectively. Saved significant infrastructure costs.',
      lessonLearned: 'At scale, small optimizations save millions. Choose the right tool for each workload.',
      icon: '💰',
    },

    realWorldExample: {
      company: 'Pinterest',
      scenario: 'Managing 2.7PB/year growth',
      howTheyDoIt: 'Uses tiered storage, aggressive caching, and custom infrastructure for cost efficiency.',
    },

    keyPoints: [
      'Right-size your infrastructure to actual needs',
      'Use caching to reduce expensive operations',
      'Tiered storage for hot vs cold data',
      'Auto-scale based on demand patterns',
    ],

    quickCheck: {
      question: 'What\'s the easiest cost optimization for a read-heavy visual platform?',
      options: [
        'Delete old pins to save storage',
        'Use smaller servers for everything',
        'Improve CDN caching to reduce origin bandwidth costs',
        'Reduce database replicas',
      ],
      correctIndex: 2,
      explanation: 'Better CDN caching means fewer S3 requests and less bandwidth. For image-heavy platforms, bandwidth is often the biggest cost.',
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
    message: 'Congratulations! You built Pinterest!',
    achievement: 'A scalable, cost-effective visual discovery platform',
    metrics: [
      { label: 'Monthly cost', before: '$800K', after: 'Under budget' },
      { label: 'Feed latency', after: '<300ms' },
      { label: 'Pin views', after: '10B/day' },
      { label: 'Global availability', after: '99.99%' },
    ],
    nextTeaser: "You've mastered Pinterest system design!",
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
    level2: 'Consider: right-sized cache, optimized replica count, efficient instance types',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const pinterestGuidedTutorial: GuidedTutorial = {
  problemId: 'pinterest',
  title: 'Design Pinterest',
  description: 'Build a visual discovery platform with pins, boards, and global delivery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📌',
    hook: "You've been hired as Lead Engineer at Visual Discovery Inc!",
    scenario: "Your mission: Build a platform where users can discover and save visual inspiration - like Pinterest!",
    challenge: "Can you design a system that handles 10 billion pin views per day?",
  },

  requirementsPhase: pinterestRequirementsPhase,

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

export default pinterestGuidedTutorial;
