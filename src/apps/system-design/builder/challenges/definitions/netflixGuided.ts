import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Netflix Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a video streaming platform like Netflix.
 *
 * Key Concepts:
 * - Video streaming and CDN delivery (critical!)
 * - Content catalog and metadata
 * - Adaptive bitrate streaming
 * - Graceful degradation (DDIA Ch. 8)
 * - Circuit breaker patterns
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const netflixRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a video streaming platform like Netflix",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Architect at StreamTech Media',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main things users want to do on this streaming platform?",
      answer: "Users want to:\n\n1. **Browse the catalog** - Discover movies and TV shows\n2. **Stream videos** - Watch content on demand with smooth playback\n3. **Track watch history** - Resume where they left off\n4. **Get recommendations** - Discover content they'll enjoy\n5. **Search** - Find specific titles or genres",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Netflix is fundamentally about delivering high-quality video content on demand",
    },
    {
      id: 'video-streaming',
      category: 'functional',
      question: "How should video streaming work?",
      answer: "When a user clicks play, video should start within 2 seconds and play smoothly without buffering. The platform should adapt quality based on network conditions - this is called adaptive bitrate streaming.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Video streaming is fundamentally different from photo/text - it requires continuous data delivery",
    },
    {
      id: 'catalog-browsing',
      category: 'functional',
      question: "How should users browse the content catalog?",
      answer: "Users should see organized categories (Trending, New Releases, Genres). Each title shows a thumbnail, title, and brief description. The catalog should load instantly.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Catalog is read-heavy - perfect for caching",
    },
    {
      id: 'watch-history',
      category: 'functional',
      question: "What happens if a user stops watching mid-episode?",
      answer: "The system should track their progress. When they return, they can resume exactly where they left off. This is the 'watch history' feature.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Watch history requires persisting playback position periodically",
    },
    {
      id: 'live-streaming',
      category: 'clarification',
      question: "Do we need live streaming for sports or events?",
      answer: "Not for MVP. Live streaming has different requirements (low latency, no seeking backward). Let's focus on video-on-demand (VOD) first.",
      importance: 'nice-to-have',
      insight: "Live streaming is a separate challenge - HLS/DASH protocols, different infrastructure",
    },
    {
      id: 'downloads',
      category: 'clarification',
      question: "Should users be able to download videos for offline viewing?",
      answer: "Eventually yes, but not for MVP. Downloads require DRM, storage management, and expiration handling. Defer to v2.",
      importance: 'nice-to-have',
      insight: "Downloads add complexity around licensing and device storage",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "200 million subscribers globally, with 50 million concurrent viewers at peak (prime time)",
      importance: 'critical',
      learningPoint: "Netflix is one of the largest streaming platforms globally",
    },
    {
      id: 'throughput-streaming',
      category: 'throughput',
      question: "How much video traffic are we talking about?",
      answer: "During peak hours, 50 million concurrent streams. Each stream is 5-15 Mbps depending on quality. That's approximately 2.5-7.5 Petabits per second!",
      importance: 'critical',
      calculation: {
        formula: "50M streams × 10 Mbps average = 500 Tbps",
        result: "~500 Terabits/sec at peak - CDN is absolutely essential!",
      },
      learningPoint: "Video streaming dominates internet traffic - CDN is not optional",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many catalog browse requests per day?",
      answer: "About 1 billion catalog views per day (users browsing, searching)",
      importance: 'important',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 reads/sec",
        result: "~12K catalog reads/sec (36K at peak)",
      },
      learningPoint: "Catalog is heavily read - cache aggressively",
    },
    {
      id: 'video-library-size',
      category: 'payload',
      question: "How large is the video library?",
      answer: "About 10,000 titles (movies + TV shows). Each title has multiple versions (4K, 1080p, 720p, 480p) and multiple audio/subtitle tracks. Average content is 100GB per title across all versions.",
      importance: 'critical',
      calculation: {
        formula: "10,000 titles × 100GB = 1 PB storage",
        result: "~1 Petabyte of video content",
      },
      learningPoint: "Massive storage requirements - object storage + CDN essential",
    },
    {
      id: 'latency-start',
      category: 'latency',
      question: "How fast should video playback start?",
      answer: "p99 under 2 seconds from clicking play to video starting. Users abandon if it takes longer.",
      importance: 'critical',
      learningPoint: "Fast startup requires CDN edge caching close to users",
    },
    {
      id: 'latency-catalog',
      category: 'latency',
      question: "How fast should the catalog load?",
      answer: "p99 under 500ms for catalog/browse pages. Fast browsing is key to engagement.",
      importance: 'important',
      learningPoint: "Catalog metadata should be cached at app level and CDN",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.99% availability - users expect Netflix to always work. That's less than 5 minutes downtime per month.",
      importance: 'critical',
      learningPoint: "High availability requires redundancy at every layer",
    },
    {
      id: 'cdn-strategy',
      category: 'cdn',
      question: "How important is CDN for video delivery?",
      answer: "Absolutely critical. Netflix uses their own CDN (Open Connect) with servers embedded in ISPs globally. Without CDN, video would be unwatchable for most users due to bandwidth and latency constraints.",
      importance: 'critical',
      insight: "Netflix's Open Connect is their secret weapon - thousands of edge servers worldwide",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'video-streaming', 'throughput-streaming', 'cdn-strategy'],
  criticalFRQuestionIds: ['core-features', 'video-streaming', 'catalog-browsing'],
  criticalScaleQuestionIds: ['throughput-streaming', 'latency-start', 'availability-requirement', 'cdn-strategy'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can browse content catalog',
      description: 'Discover movies and TV shows by category',
      emoji: '🎬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can stream videos',
      description: 'Watch content with smooth, adaptive playback',
      emoji: '▶️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can track watch history',
      description: 'Resume playback where you left off',
      emoji: '⏯️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can get recommendations',
      description: 'Discover content based on viewing history',
      emoji: '🎯',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can search content',
      description: 'Find titles by name or genre',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million concurrent viewers',
    writesPerDay: 'Minimal writes (watch history updates)',
    readsPerDay: '1 billion catalog views + 50M concurrent streams',
    peakMultiplier: 3,
    readWriteRatio: '1000:1',
    calculatedWriteRPS: { average: 100, peak: 300 },
    calculatedReadRPS: { average: 11574, peak: 34722 },
    maxPayloadSize: '~5-15 Mbps per stream',
    storagePerRecord: '~100GB per title (all versions)',
    storageGrowthPerYear: '~500TB (new content)',
    redirectLatencySLA: 'p99 < 2s (video start)',
    createLatencySLA: 'p99 < 500ms (catalog)',
  },

  architecturalImplications: [
    '✅ 500 Tbps peak streaming → CDN is absolutely critical (Netflix Open Connect)',
    '✅ 50M concurrent streams → Need massive edge capacity',
    '✅ 2s video start SLA → Aggressive CDN caching at edge',
    '✅ 99.99% availability → Graceful degradation, circuit breakers required',
    '✅ Global users → Multi-region deployment essential',
    '✅ Adaptive bitrate → Multiple quality versions of each video',
  ],

  outOfScope: [
    'Live streaming (sports, events)',
    'Offline downloads',
    'User-generated content',
    'Social features (watch parties)',
    'Content production/encoding pipeline',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can browse a catalog and stream videos. The complexity of CDN, adaptive bitrate, and global distribution comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📺',
  scenario: "Welcome to StreamTech Media! You're building the next Netflix.",
  hook: "Your first user just signed up. They're ready to watch their first movie!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your streaming platform is online!',
  achievement: 'Users can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle videos yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every streaming platform starts with a **Client** connecting to a **Server**.

When a user opens Netflix:
1. Their device (TV, phone, laptop) is the **Client**
2. It sends requests to your **App Server**
3. The server responds with catalog data, video URLs, etc.

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, users can\'t do anything - no browsing, no streaming.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 200 million subscribers',
    howTheyDoIt: 'Started with a simple server in 2007, now uses microservices across global data centers',
  },

  keyPoints: [
    'Client = the user\'s device (smart TV, mobile app, browser)',
    'App Server = your backend that handles catalog and metadata',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s streaming device', icon: '📱' },
    { title: 'App Server', explanation: 'Backend handling catalog and control', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'netflix-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Netflix', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles catalog and streaming requests', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle catalog or streaming requests!",
  hook: "A user just tried to browse movies but got an error.",
  challenge: "Write the Python code for catalog browsing and video streaming APIs.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle requests!',
  achievement: 'You implemented the core Netflix functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can browse catalog', after: '✓' },
    { label: 'Can stream videos', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Catalog and Streaming Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For Netflix, we need handlers for:
- \`get_catalog()\` - Return list of available content
- \`stream_video(video_id)\` - Return video streaming URL
- \`update_watch_history()\` - Save playback progress

For now, we'll store data in memory (Python dictionaries). The actual video files and database come in later steps.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where the functionality lives!',

  famousIncident: {
    title: 'Netflix Christmas Eve Outage',
    company: 'Netflix',
    year: '2012',
    whatHappened: 'On Christmas Eve, AWS ELB (Elastic Load Balancer) failed in US-East, taking down Netflix for several hours during peak viewing time. Millions couldn\'t watch their holiday movies.',
    lessonLearned: 'Single points of failure are deadly. Netflix invested heavily in chaos engineering (Chaos Monkey) to prevent this.',
    icon: '🎄',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling catalog requests',
    howTheyDoIt: 'Uses microservices - separate services for catalog, recommendations, playback, each handling 10K+ req/sec',
  },

  keyPoints: [
    'get_catalog returns video metadata (title, thumbnail, description)',
    'stream_video returns a URL to the video file (will be CDN URL later)',
    'In-memory storage for now - database comes in Step 3',
  ],

  quickCheck: {
    question: 'Why do we return a URL instead of streaming video directly from the app server?',
    options: [
      'Video files are too large for HTTP',
      'App servers should handle control logic, not heavy data transfer',
      'It\'s easier to implement',
      'URLs are more secure',
    ],
    correctIndex: 1,
    explanation: 'App servers handle metadata and logic. Video delivery happens through specialized infrastructure (CDN). This separation of concerns is critical at scale.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Catalog API', explanation: 'Returns list of available content', icon: '📋' },
    { title: 'Streaming URL', explanation: 'Points to video file location', icon: '🔗' },
  ],
};

const step2: GuidedStep = {
  id: 'netflix-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse catalog, FR-2: Stream videos',
    taskDescription: 'Configure APIs and implement Python handlers for catalog and streaming',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/catalog and GET /api/v1/stream APIs',
      'Open the Python tab',
      'Implement get_catalog() and stream_video() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for get_catalog and stream_video',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/catalog', 'GET /api/v1/stream'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your server crashed and restarted...",
  hook: "When it came back online, the entire catalog disappeared! Users see 'No content available.'",
  challenge: "Add a database so metadata survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your catalog is safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But the catalog is loading slowly...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Netflix, we need tables for:
- \`videos\` - Video metadata (title, description, thumbnail URL)
- \`users\` - User accounts
- \`watch_history\` - Playback progress per user
- \`recommendations\` - Suggested content per user`,

  whyItMatters: 'Imagine losing your entire catalog because of a server restart. Users would see an empty Netflix!',

  famousIncident: {
    title: 'Amazon DynamoDB Outage',
    company: 'AWS/Netflix',
    year: '2015',
    whatHappened: 'DynamoDB outage in US-East affected Netflix for hours. Users couldn\'t access their watch history or get recommendations. But the video catalog served from cache kept working.',
    lessonLearned: 'Graceful degradation - core features (video playback) should work even if auxiliary features (recommendations) fail.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Storing metadata for millions of users and 10K+ titles',
    howTheyDoIt: 'Uses Cassandra for distributed storage, MySQL for some relational data, with heavy caching',
  },

  keyPoints: [
    'Database stores video metadata, NOT video files themselves',
    'Video files go to object storage (Step 8)',
    'PostgreSQL is great for structured data like catalogs',
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
    { title: 'Metadata', explanation: 'Information about videos, not the videos themselves', icon: '📝' },
  ],
};

const step3: GuidedStep = {
  id: 'netflix-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store video metadata and user data permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Catalog Reads
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million users, and the catalog takes 3 seconds to load!",
  hook: "Every browse request hits the database. The catalog rarely changes, but we query it millions of times.",
  challenge: "Add a cache to make catalog browsing instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Catalog loads 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Catalog latency', before: '3000ms', after: '150ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But one server can't handle peak traffic...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Netflix's catalog doesn't change often, but it's read millions of times per day. Perfect for caching!

**Cache-Aside Pattern**:
1. Check cache first
2. If miss → fetch from database
3. Store in cache for next time (with TTL)

For Netflix, we cache:
- Video catalog (list of all titles)
- Video metadata (thumbnails, descriptions)
- User recommendations`,

  whyItMatters: 'At 36K catalog reads/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Netflix EVCache Evolution',
    company: 'Netflix',
    year: '2011-2016',
    whatHappened: 'Netflix built EVCache (Ephemeral Volatile Cache) on top of Memcached to handle billions of cache requests. In 2016, a cache cluster failure caused temporary degradation, but graceful fallback to database kept service running.',
    lessonLearned: 'Cache failures should degrade performance, not cause outages. Always have fallback to origin.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving catalog to millions of users',
    howTheyDoIt: 'Uses EVCache (their custom Memcached clusters) for metadata caching. 99%+ cache hit rate for catalog data.',
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
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'TTL (Time To Live) ensures fresh data',
  ],

  quickCheck: {
    question: 'What happens during a cache miss?',
    options: [
      'Return an error to the user',
      'Fetch from database and store in cache',
      'Wait for cache to be populated',
      'Redirect to backup server',
    ],
    correctIndex: 1,
    explanation: 'On cache miss: fetch from DB, return to user, AND store in cache for next time.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'netflix-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse catalog (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache catalog metadata for fast browsing', displayName: 'Redis Cache' },
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
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Friday night! A new season just dropped and your single server is at 100% CPU!",
  hook: "Millions of users are trying to browse at once. The server is overwhelmed.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we still only have one app server instance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute the Load',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

Common strategies:
- Round-robin: Take turns
- Least connections: Send to least busy server
- IP hash: Same user goes to same server`,

  whyItMatters: 'Netflix has massive traffic spikes when new content drops. One server can\'t handle millions of concurrent users.',

  famousIncident: {
    title: 'House of Cards Season 2 Launch',
    company: 'Netflix',
    year: '2014',
    whatHappened: 'Netflix released all episodes at once at midnight. Traffic spiked 10x instantly. Their load balancing and auto-scaling infrastructure handled it smoothly - a testament to their chaos engineering.',
    lessonLearned: 'Plan for spikes. Load balancers + auto-scaling = resilience.',
    icon: '🏠',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling content release spikes',
    howTheyDoIt: 'Uses AWS ELB (Elastic Load Balancer) and their own Zuul gateway for intelligent routing across thousands of servers',
  },

  diagram: `
              ┌─────────────┐
              │ App Server 1│
┌────────┐   ┌──────────────┐   └─────────────┘
│ Client │──▶│Load Balancer │──▶ App Server 2
└────────┘   └──────────────┘   ┌─────────────┐
              │ App Server 3│
              └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Place between Client and App Servers',
  ],

  quickCheck: {
    question: 'What happens if one app server crashes when using a load balancer?',
    options: [
      'All requests fail',
      'Load balancer routes traffic to healthy servers',
      'Users see an error page',
      'The load balancer crashes too',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers and automatically route traffic to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'netflix-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
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
    level2: 'Reconnect: Client → Load Balancer → App Server',
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
  scenario: "Your database server just died. Hardware failure at 8 PM on a Saturday.",
  hook: "All users see 'Service Unavailable' for 45 minutes. Revenue loss: $2 million.",
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
  nextTeaser: "But we need more app servers to handle peak traffic...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Data',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your data`,

  whyItMatters: 'Netflix stores critical user data - watch history, preferences. Database failure without replication means losing everything.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. Their replication lag was too high, so backups were also affected. They lost 6 hours of data.',
    lessonLearned: 'Replication lag matters. Test your failover process regularly.',
    icon: '🗑️',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses Cassandra with 3-way replication across multiple availability zones. Each write is stored on 3 different servers.',
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
  id: 'netflix-step-6',
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
// STEP 7: Horizontal Scaling (Multiple App Server Instances)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "You've grown to 50 million users! One app server can't keep up!",
  hook: "Even with load balancing, request volume is overwhelming a single server.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 10x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Capacity', before: '10K req/s', after: '100K+ req/s' },
  ],
  nextTeaser: "But where are the actual video files stored?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Netflix:
- Start with 3-5 app server instances
- Scale up during peak times (evening hours)
- Scale down during quiet periods (3 AM)`,

  whyItMatters: 'At 36K requests/second peak for catalog alone, you need many app servers working in parallel.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs thousands of app server instances across multiple AWS regions. Auto-scales based on traffic patterns.',
  },

  famousIncident: {
    title: 'Squid Game Launch',
    company: 'Netflix',
    year: '2021',
    whatHappened: 'Squid Game became the most-watched show ever. Traffic in some regions spiked 10x overnight. Netflix\'s auto-scaling infrastructure handled it seamlessly.',
    lessonLearned: 'Design for horizontal scaling from day 1. Viral content is unpredictable.',
    icon: '🦑',
  },

  diagram: `
                    ┌─────────────────────────┐
                    │     Load Balancer       │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  ┌───────────┐           ┌───────────┐           ┌───────────┐
  │App Server │           │App Server │           │App Server │
  │ Instance 1│           │ Instance 2│           │ Instance 3│
  └───────────┘           └───────────┘           └───────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │  Shared Cache & DB    │
                    └───────────────────────┘
`,

  keyPoints: [
    'Add more app server instances to handle more traffic',
    'Load balancer distributes requests across all instances',
    'All instances share the same cache and database',
    'Stateless servers are easier to scale horizontally',
  ],

  quickCheck: {
    question: 'What\'s the main advantage of horizontal scaling over vertical scaling?',
    options: [
      'It\'s always faster',
      'There\'s no practical upper limit - keep adding servers',
      'It\'s easier to implement',
      'It uses less total resources',
    ],
    correctIndex: 1,
    explanation: 'Vertical scaling has a ceiling (biggest available server). Horizontal scaling can grow indefinitely.',
  },

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Vertical Scaling', explanation: 'Upgrade existing server', icon: '↕️' },
    { title: 'Stateless', explanation: 'Servers don\'t store user state', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'netflix-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from more compute capacity',
    taskDescription: 'Scale the App Server to multiple instances',
    successCriteria: [
      'Click on the App Server component',
      'Go to Configuration tab',
      'Set instances to 3 or more',
    ],
  },

  celebration: step7Celebration,

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
    level1: 'Click on the App Server, then find the instance count in Configuration',
    level2: 'Set instances to 3 or more. The load balancer will distribute traffic across all instances.',
    solutionComponents: [{ type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Object Storage for Video Files
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📦',
  scenario: "You're storing 1 Petabyte of video files. The database can't handle binary files!",
  hook: "Databases are designed for structured data, not 100GB movie files.",
  challenge: "Add object storage (S3) for video files.",
  illustration: 'storage-full',
};

const step8Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Videos have a proper home!',
  achievement: 'Object storage handles unlimited video files',
  metrics: [
    { label: 'Video storage', after: 'Unlimited (S3)' },
    { label: 'Durability', after: '99.999999999%' },
  ],
  nextTeaser: "But users far away experience buffering...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage for Media Files',
  conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (videos in multiple formats)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy

Architecture:
- **Database**: Video metadata (title, duration, thumbnail URL)
- **Object Storage**: Actual video files in multiple qualities
- Video URL stored in database points to S3 object

For adaptive bitrate streaming:
- Store same video in multiple qualities: 4K, 1080p, 720p, 480p
- Client switches between them based on network speed`,

  whyItMatters: 'Netflix stores 1+ Petabyte of video. You can\'t put that in PostgreSQL!',

  famousIncident: {
    title: 'AWS S3 Outage',
    company: 'AWS/Netflix',
    year: '2017',
    whatHappened: 'S3 outage in US-East took down many services. But Netflix kept streaming because videos were cached at CDN edge servers. Only new content couldn\'t be uploaded.',
    lessonLearned: 'Graceful degradation through caching. CDN acts as buffer against origin failures.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Storing petabytes of video',
    howTheyDoIt: 'Uses AWS S3 for video storage, with each title encoded in multiple bitrates and resolutions. Total storage exceeds 1 PB.',
  },

  diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Request catalog
       ▼
┌──────────────┐     2. Metadata    ┌──────────┐
│  App Server  │ ◀───────────────── │ Database │
└──────┬───────┘                    └──────────┘
       │
       │ 3. Return video URLs pointing to S3
       ▼
     (Client streams from S3/CDN later)
`,

  keyPoints: [
    'Object storage for video files, database for metadata',
    'Store video URLs in database, actual files in S3',
    'Multiple versions per video for adaptive bitrate',
    'S3 handles replication and durability',
  ],

  quickCheck: {
    question: 'Why not store videos directly in the database?',
    options: [
      'Databases can\'t store binary data',
      'It\'s too slow and expensive at petabyte scale',
      'Videos would be insecure',
      'It would violate copyright laws',
    ],
    correctIndex: 1,
    explanation: 'Databases CAN store binary, but it\'s not optimized for it. Storing petabytes of video would be prohibitively slow and expensive.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Designed for large binary files', icon: '📦' },
    { title: 'Adaptive Bitrate', explanation: 'Multiple quality versions of same video', icon: '📊' },
    { title: 'Metadata', explanation: 'Info about videos, stored in DB', icon: '📝' },
  ],
};

const step8: GuidedStep = {
  id: 'netflix-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-2: Stream videos (now at scale!)',
    taskDescription: 'Add Object Storage for video files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store video files in multiple qualities', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: step8Celebration,

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
    level2: 'Connect App Server to Object Storage. Videos will be stored here.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: Add CDN - CRITICAL for Video Streaming!
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Asia are experiencing constant buffering and 10-second load times!",
  hook: "Your servers are in US. Streaming video from across the world is impossible. This is the make-or-break moment for Netflix.",
  challenge: "Add a CDN to deliver videos from edge servers worldwide.",
  illustration: 'global-latency',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Videos stream smoothly worldwide!',
  achievement: 'CDN delivers videos from edge locations',
  metrics: [
    { label: 'Tokyo video start', before: '10s', after: '1.5s' },
    { label: 'Buffering events', before: 'Frequent', after: 'Rare' },
    { label: 'Global edge locations', after: '200+' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: The Secret Weapon for Video Streaming',
  conceptExplanation: `A **CDN** (Content Delivery Network) is CRITICAL for video streaming.

How it works:
1. Videos are cached at edge servers worldwide
2. When user clicks play, video streams from nearest edge
3. Edge location is < 50ms away vs 200ms+ to origin
4. This eliminates buffering and enables smooth playback

Netflix's Open Connect:
- Netflix built their own CDN with servers embedded in ISPs
- Videos are pre-positioned at edges during off-peak hours
- 95%+ of traffic never leaves the ISP's network

For adaptive bitrate:
- CDN serves multiple quality versions
- Client switches based on bandwidth
- HLS or DASH protocol handles the switching`,

  whyItMatters: 'Without CDN, Netflix would be unwatchable. 500 Tbps of video traffic MUST be served from edges.',

  famousIncident: {
    title: 'Netflix Open Connect Launch & Comcast Dispute',
    company: 'Netflix',
    year: '2011-2014',
    whatHappened: 'Before Open Connect (2011-12), Netflix relied on third-party CDNs with quality issues. After building Open Connect, buffering dropped 90%. In 2014, Comcast throttled Netflix traffic, forcing Netflix to pay for direct peering and aggressively deploy servers inside ISPs.',
    lessonLearned: 'For video streaming at scale, CDN isn\'t just important - it\'s the entire architecture. Control your distribution.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 500 Tbps of video traffic',
    howTheyDoIt: 'Netflix Open Connect has 17,000+ servers in 1,000+ locations globally. Videos are pre-cached at edges. 95%+ of traffic served from within ISP networks.',
  },

  diagram: `
User in Tokyo watching Stranger Things:

┌──────────┐    50ms    ┌──────────┐  ┌─────────────────┐
│   User   │◀──────────▶│   CDN    │──│  Tokyo ISP Edge │
│ (Tokyo)  │   Streaming│  Edge    │  │ (Netflix Server)│
└──────────┘            └──────────┘  └─────────────────┘
                             │
                             │ Pre-cached video
                             │ (pushed during off-peak)
                             │
                        ┌────▼──────┐
                        │  Origin   │
                        │    S3     │
                        │  US-East  │
                        └───────────┘

Graceful Degradation (DDIA Ch. 8):
- If edge fails → fallback to regional CDN
- If regional fails → origin (degraded experience)
- Circuit breaker prevents cascade failures
`,

  keyPoints: [
    'CDN is ESSENTIAL for video streaming - not optional',
    'Videos cached at edge locations worldwide',
    'Users stream from nearest edge (< 50ms latency)',
    'Netflix Open Connect: embedded in ISPs',
    'Graceful degradation: edge → regional → origin',
    'Circuit breakers prevent cascading failures',
  ],

  quickCheck: {
    question: 'Why is CDN especially critical for video streaming vs other content?',
    options: [
      'Videos are copyrighted',
      'Video requires sustained high bandwidth - edge delivery prevents buffering',
      'It\'s cheaper',
      'Videos are larger files',
    ],
    correctIndex: 1,
    explanation: 'Video streaming requires sustained 5-15 Mbps per user. Serving from distant origin would cause buffering. CDN edge servers close to users are essential.',
  },

  keyConcepts: [
    { title: 'CDN Edge', explanation: 'Video cache servers near users', icon: '📡' },
    { title: 'Adaptive Bitrate', explanation: 'Switch quality based on bandwidth', icon: '📊' },
    { title: 'Graceful Degradation', explanation: 'Fallback when edge fails (DDIA Ch. 8)', icon: '🛡️' },
    { title: 'Circuit Breaker', explanation: 'Prevent cascading failures', icon: '🔌' },
  ],
};

const step9: GuidedStep = {
  id: 'netflix-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-2: Stream videos globally with low latency',
    taskDescription: 'Add CDN for global video delivery from edge locations',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver videos from edge servers worldwide - CRITICAL!', displayName: 'CDN (Open Connect)' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step9Celebration,

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
    level2: 'CDN serves as the public endpoint for video streaming, S3 is the origin',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2.5 million.",
  hook: "The CFO says: 'Cut costs by 20% or we're raising subscription prices.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Netflix!',
  achievement: 'A scalable, cost-effective video streaming platform',
  metrics: [
    { label: 'Monthly cost', before: '$2.5M', after: 'Under budget' },
    { label: 'Video start time', after: '<2s' },
    { label: 'Buffering rate', after: '<1%' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Concurrent streams', after: '50M+' },
  ],
  nextTeaser: "You've mastered Netflix system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for Netflix:
1. **Right-size instances** - Don't over-provision app servers
2. **CDN pre-caching** - Push popular content during off-peak (cheaper bandwidth)
3. **Tiered storage** - Move old/unpopular content to cheaper storage tiers
4. **Auto-scaling** - Scale down during low-traffic hours (3-10 AM)
5. **Encoding optimization** - Better codecs (H.265) = less bandwidth
6. **Regional optimization** - More edge servers = less origin traffic

Netflix-specific optimizations:
- Open Connect saves millions vs third-party CDN
- Encoding at optimal bitrates (not higher than needed)
- Smart pre-caching based on predictions`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it. Netflix spends billions on AWS.',

  famousIncident: {
    title: 'Netflix Open Connect Savings',
    company: 'Netflix',
    year: '2016',
    whatHappened: 'By building Open Connect instead of using third-party CDNs, Netflix saved an estimated $100M+ per year. The investment in custom CDN infrastructure paid for itself many times over.',
    lessonLearned: 'At extreme scale, build your own. Below that, optimize cloud costs.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Heavily optimizes every layer. Open Connect CDN, efficient encoding, predictive caching. Auto-scales aggressively. Still spends $1B+/year on AWS.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'CDN edge caching reduces expensive origin bandwidth',
    'Auto-scale based on time-of-day patterns',
    'Tiered storage for hot (new) vs cold (old) content',
    'Better encoding = less bandwidth = lower costs',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a streaming platform?',
    options: [
      'Use smaller servers',
      'CDN edge caching to minimize origin bandwidth',
      'Delete old content',
      'Reduce video quality',
    ],
    correctIndex: 1,
    explanation: 'Origin bandwidth is expensive. CDN edge caching means 95%+ of traffic never hits origin, saving massive costs.',
  },

  keyConcepts: [
    { title: 'CDN Pre-caching', explanation: 'Push content to edges during off-peak', icon: '📡' },
    { title: 'Auto-Scaling', explanation: 'Scale based on time-of-day patterns', icon: '📊' },
    { title: 'Tiered Storage', explanation: 'Hot vs cold content pricing', icon: '🗄️' },
  ],
};

const step10: GuidedStep = {
  id: 'netflix-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $500/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $500/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step10Celebration,

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
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: fewer replicas if acceptable, smaller cache, right-sized instances. CDN and storage are essential - optimize elsewhere.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const netflixGuidedTutorial: GuidedTutorial = {
  problemId: 'netflix',
  title: 'Design Netflix',
  description: 'Build a video streaming platform with catalog, adaptive streaming, and global CDN delivery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📺',
    hook: "You've been hired as Lead Architect at StreamTech Media!",
    scenario: "Your mission: Build a video streaming platform that can serve 50 million concurrent viewers watching high-quality video without buffering.",
    challenge: "Can you design a system that handles 500 Terabits per second of video traffic?",
  },

  requirementsPhase: netflixRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Object Storage',
    'CDN (Critical for Video)',
    'Adaptive Bitrate Streaming',
    'Graceful Degradation',
    'Circuit Breaker Pattern',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed System Troubles (Graceful Degradation)',
    'Chapter 11: Stream Processing',
  ],
};

export default netflixGuidedTutorial;
