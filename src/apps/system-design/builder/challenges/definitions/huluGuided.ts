import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Hulu Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a video streaming platform like Hulu.
 *
 * Key Concepts:
 * - Video streaming with live TV support
 * - Content catalog and watchlist management
 * - Continue watching and recommendations
 * - CDN delivery for VOD and live content
 * - Graceful degradation and fault tolerance
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const huluRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a video streaming platform like Hulu",

  interviewer: {
    name: 'Marcus Rodriguez',
    role: 'Senior Engineering Manager at StreamMedia Labs',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main features users expect from Hulu?",
      answer: "Users want to:\n\n1. **Stream on-demand videos** - Watch TV shows and movies\n2. **Watch live TV** - Stream live channels in real-time\n3. **Manage watchlist** - Save shows to watch later\n4. **Continue watching** - Resume where they left off\n5. **Get recommendations** - Discover new content based on viewing history",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Hulu is unique in combining VOD (video-on-demand) with live TV streaming",
    },
    {
      id: 'video-streaming',
      category: 'functional',
      question: "How should on-demand video streaming work?",
      answer: "When a user selects a show, video should start within 2 seconds with smooth playback. The system should adapt quality based on network conditions using adaptive bitrate streaming (HLS/DASH).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "VOD streaming allows seeking, pausing, and resuming - different from live TV",
    },
    {
      id: 'live-tv',
      category: 'functional',
      question: "What's different about live TV streaming?",
      answer: "Live TV requires low latency (<5 seconds delay), no seeking backward beyond buffer, and synchronized delivery to all viewers. It's technically more challenging than VOD.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Live streaming has stricter latency requirements and different buffering strategies",
    },
    {
      id: 'watchlist',
      category: 'functional',
      question: "How should the watchlist feature work?",
      answer: "Users can add/remove shows to their personal watchlist. This list should be instantly accessible and sync across all their devices.",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Watchlist is user-specific state that needs fast read access",
    },
    {
      id: 'continue-watching',
      category: 'functional',
      question: "How do we track viewing progress?",
      answer: "The system should save playback position every 30 seconds. When users return, they can resume from where they stopped. This data must be consistent across devices.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Playback tracking requires frequent writes but must not impact performance",
    },
    {
      id: 'offline-downloads',
      category: 'clarification',
      question: "Should we support offline downloads?",
      answer: "Not for MVP. Downloads require DRM management, storage quotas, and expiration handling. Focus on streaming first.",
      importance: 'nice-to-have',
      insight: "Offline viewing adds significant complexity around licensing and storage",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should the platform support?",
      answer: "50 million subscribers in the US, with 15 million concurrent viewers during prime time (8-11 PM)",
      importance: 'critical',
      learningPoint: "Hulu's scale is large but more US-focused compared to global platforms",
    },
    {
      id: 'throughput-streaming',
      category: 'throughput',
      question: "What's the expected video streaming traffic?",
      answer: "15 million concurrent streams at peak. Each stream averages 8 Mbps. That's approximately 120 Terabits per second at peak!",
      importance: 'critical',
      calculation: {
        formula: "15M streams × 8 Mbps average = 120 Tbps",
        result: "~120 Terabits/sec at peak - CDN is absolutely essential!",
      },
      learningPoint: "Video streaming dominates bandwidth - CDN infrastructure is critical",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many catalog and watchlist requests per day?",
      answer: "About 500 million catalog/watchlist views per day (browsing, searching, updating)",
      importance: 'important',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 reads/sec",
        result: "~6K reads/sec (18K at peak)",
      },
      learningPoint: "Catalog and watchlist data should be heavily cached",
    },
    {
      id: 'content-library',
      category: 'payload',
      question: "How large is the content library?",
      answer: "About 85,000 TV episodes and 2,000 movies. Each title has multiple versions (1080p, 720p, 480p). Average 50GB per title across all versions.",
      importance: 'critical',
      calculation: {
        formula: "87,000 titles × 50GB = 4.35 PB storage",
        result: "~4-5 Petabytes of video content",
      },
      learningPoint: "Large storage requirements - object storage with CDN caching essential",
    },
    {
      id: 'latency-vod',
      category: 'latency',
      question: "How fast should VOD playback start?",
      answer: "p99 under 2 seconds from clicking play to video starting. Users abandon if longer.",
      importance: 'critical',
      learningPoint: "Fast startup requires CDN edge caching near users",
    },
    {
      id: 'latency-live',
      category: 'latency',
      question: "What's the latency requirement for live TV?",
      answer: "p99 under 5 seconds delay from broadcast. Lower is better - users compare with cable TV which is near real-time.",
      importance: 'critical',
      learningPoint: "Live streaming requires specialized low-latency protocols (LL-HLS)",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.99% availability - that's less than 5 minutes downtime per month. Especially critical during prime time and live sports events.",
      importance: 'critical',
      learningPoint: "High availability requires redundancy at every layer plus graceful degradation",
    },
    {
      id: 'cdn-strategy',
      category: 'cdn',
      question: "How important is CDN for Hulu?",
      answer: "Critical. Hulu uses multi-CDN strategy (Akamai, Level3, others) for redundancy. Videos are cached at edge servers nationwide. Live TV requires even more aggressive edge caching.",
      importance: 'critical',
      insight: "Multi-CDN approach provides failover and better coverage than single CDN",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'video-streaming', 'live-tv', 'throughput-streaming', 'cdn-strategy'],
  criticalFRQuestionIds: ['core-features', 'video-streaming', 'live-tv'],
  criticalScaleQuestionIds: ['throughput-streaming', 'latency-vod', 'latency-live', 'availability-requirement', 'cdn-strategy'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can stream on-demand videos',
      description: 'Watch TV shows and movies with adaptive quality',
      emoji: '📺',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can watch live TV',
      description: 'Stream live channels in real-time',
      emoji: '📡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can manage watchlist',
      description: 'Save and organize shows to watch later',
      emoji: '📋',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can continue watching',
      description: 'Resume playback from where you left off',
      emoji: '⏯️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can get recommendations',
      description: 'Discover content based on viewing history',
      emoji: '🎯',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '15 million concurrent viewers at peak',
    writesPerDay: 'Moderate writes (watchlist, playback tracking)',
    readsPerDay: '500M catalog views + 15M concurrent streams',
    peakMultiplier: 3,
    readWriteRatio: '500:1',
    calculatedWriteRPS: { average: 200, peak: 600 },
    calculatedReadRPS: { average: 5787, peak: 17361 },
    maxPayloadSize: '~8 Mbps per stream',
    storagePerRecord: '~50GB per title (all versions)',
    storageGrowthPerYear: '~300TB (new content)',
    redirectLatencySLA: 'p99 < 2s (VOD), p99 < 5s (live TV)',
    createLatencySLA: 'p99 < 300ms (catalog)',
  },

  architecturalImplications: [
    '✅ 120 Tbps peak streaming → CDN is absolutely critical (multi-CDN strategy)',
    '✅ 15M concurrent streams → Massive edge capacity required',
    '✅ Live TV support → Low-latency streaming protocols (LL-HLS)',
    '✅ 2s VOD start SLA → Aggressive CDN caching at edge',
    '✅ 99.99% availability → Graceful degradation, multi-CDN failover',
    '✅ US-focused → Optimize for US edge locations',
  ],

  outOfScope: [
    'Offline downloads',
    'User-generated content',
    'Social features (watch parties)',
    'Content encoding pipeline',
    'Ad insertion system (for ad-supported tier)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can browse content and stream videos. The complexity of live TV, CDN optimization, and multi-region distribution comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📺',
  scenario: "Welcome to StreamMedia Labs! You're building the next Hulu.",
  hook: "Your first user just signed up and wants to browse the catalog!",
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
  nextTeaser: "But the server doesn't know how to handle video requests yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every streaming platform starts with a **Client** connecting to a **Server**.

When a user opens Hulu:
1. Their device (smart TV, phone, tablet) is the **Client**
2. It sends requests to your **App Server**
3. The server responds with catalog data, video URLs, watchlist info, etc.

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, users can\'t do anything - no browsing, no streaming, no watchlist.',

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Serving 50 million subscribers',
    howTheyDoIt: 'Started with simple servers, now uses microservices architecture across multiple data centers',
  },

  keyPoints: [
    'Client = the user\'s streaming device (smart TV, mobile app, browser)',
    'App Server = your backend that handles catalog and user data',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s streaming device', icon: '📱' },
    { title: 'App Server', explanation: 'Backend handling catalog and control', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'hulu-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Hulu', displayName: 'Client' },
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
  scenario: "Your server is connected, but it doesn't know how to handle catalog, watchlist, or streaming requests!",
  hook: "A user just tried to browse shows but got an error.",
  challenge: "Write the Python code for catalog browsing, watchlist, and video streaming APIs.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle requests!',
  achievement: 'You implemented the core Hulu functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can browse catalog', after: '✓' },
    { label: 'Can manage watchlist', after: '✓' },
    { label: 'Can stream videos', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Catalog, Watchlist, and Streaming Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For Hulu, we need handlers for:
- \`get_catalog()\` - Return list of available shows and movies
- \`get_watchlist(user_id)\` - Return user's saved content
- \`add_to_watchlist(user_id, content_id)\` - Save content to watchlist
- \`stream_video(video_id)\` - Return video streaming URL

For now, we'll store data in memory (Python dictionaries). The actual video files and database come in later steps.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where the functionality lives!',

  famousIncident: {
    title: 'Hulu Super Bowl Outage',
    company: 'Hulu',
    year: '2019',
    whatHappened: 'During Super Bowl halftime, Hulu experienced widespread streaming issues. Millions of users couldn\'t watch the game. The problem was traced to overwhelmed backend servers that couldn\'t handle the spike in concurrent streams.',
    lessonLearned: 'Plan for traffic spikes during major events. Load testing and auto-scaling are critical.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Handling catalog and watchlist requests',
    howTheyDoIt: 'Uses microservices architecture - separate services for catalog, watchlist, playback, each handling thousands of req/sec',
  },

  keyPoints: [
    'get_catalog returns video metadata (title, thumbnail, description)',
    'get_watchlist returns user-specific saved content',
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
    { title: 'Watchlist API', explanation: 'Manages user-saved content', icon: '📌' },
    { title: 'Streaming URL', explanation: 'Points to video file location', icon: '🔗' },
  ],
};

const step2: GuidedStep = {
  id: 'hulu-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Stream videos, FR-3: Manage watchlist',
    taskDescription: 'Configure APIs and implement Python handlers for catalog, watchlist, and streaming',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/catalog, GET /api/v1/watchlist, POST /api/v1/watchlist, and GET /api/v1/stream APIs',
      'Open the Python tab',
      'Implement get_catalog(), get_watchlist(), add_to_watchlist(), and stream_video() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for get_catalog, get_watchlist, add_to_watchlist, and stream_video',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/catalog', 'GET /api/v1/watchlist', 'POST /api/v1/watchlist', 'GET /api/v1/stream'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed during a system update...",
  hook: "When it came back online, everyone's watchlist disappeared! Users are furious.",
  challenge: "Add a database so user data and catalog survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
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

For Hulu, we need tables for:
- \`content\` - Video metadata (title, description, thumbnail URL, duration)
- \`users\` - User accounts and preferences
- \`watchlist\` - User-saved shows and movies
- \`watch_history\` - Playback progress per user
- \`recommendations\` - Suggested content per user`,

  whyItMatters: 'Imagine losing everyone\'s watchlist because of a server restart. Users would lose trust in your platform!',

  famousIncident: {
    title: 'AWS DynamoDB Outage Impact',
    company: 'Multiple Streaming Services',
    year: '2015',
    whatHappened: 'DynamoDB outage in US-East affected multiple streaming services including Hulu for several hours. Users couldn\'t access their watchlist or get recommendations. But core video playback kept working from cached catalog.',
    lessonLearned: 'Graceful degradation - core features (video playback) should work even if auxiliary features (watchlist, recommendations) fail.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Storing data for millions of users and 87,000 titles',
    howTheyDoIt: 'Uses combination of SQL databases for structured data and NoSQL for high-volume writes like playback tracking',
  },

  keyPoints: [
    'Database stores video metadata, NOT video files themselves',
    'Video files go to object storage (Step 8)',
    'PostgreSQL is great for structured data like catalogs and watchlists',
    'Watchlist and watch history are user-specific data',
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
  id: 'hulu-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store video metadata, watchlists, and user data permanently', displayName: 'PostgreSQL' },
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
  scenario: "You now have 5 million users, and the catalog takes 4 seconds to load!",
  hook: "Every browse request hits the database. The catalog rarely changes, but we query it millions of times.",
  challenge: "Add a cache to make catalog browsing instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Catalog loads 25x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Catalog latency', before: '4000ms', after: '160ms' },
    { label: 'Cache hit rate', after: '96%' },
  ],
  nextTeaser: "But one server can't handle prime time traffic...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Hulu's catalog doesn't change often, but it's read millions of times per day. Perfect for caching!

**Cache-Aside Pattern**:
1. Check cache first
2. If miss → fetch from database
3. Store in cache for next time (with TTL)

For Hulu, we cache:
- Video catalog (list of all shows and movies)
- Video metadata (thumbnails, descriptions)
- User watchlists (frequently accessed)
- Recommendations`,

  whyItMatters: 'At 18K catalog reads/sec peak, hitting the database for every request would overwhelm it. Caching is essential.',

  famousIncident: {
    title: 'Hulu Cache Invalidation Bug',
    company: 'Hulu',
    year: '2018',
    whatHappened: 'A cache invalidation bug caused some users to see outdated catalog data - new episodes weren\'t appearing for hours. The issue was traced to aggressive TTL settings that weren\'t properly invalidated when new content was added.',
    lessonLearned: 'Cache invalidation is one of the hardest problems in CS. Balance freshness with performance.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Serving catalog to millions of users',
    howTheyDoIt: 'Uses Redis and Memcached for multi-layer caching. 98%+ cache hit rate for catalog data.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (96% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'TTL (Time To Live) ensures fresh data',
    'Invalidate cache when content is added/updated',
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
  id: 'hulu-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse catalog (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache catalog metadata and watchlists for fast browsing', displayName: 'Redis Cache' },
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
  scenario: "Monday Night Football just started and your single server is at 100% CPU!",
  hook: "Millions of users are trying to watch live TV at once. The server is overwhelmed.",
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
- IP hash: Same user goes to same server (session affinity)`,

  whyItMatters: 'Hulu has massive traffic spikes during live sports and popular show releases. One server can\'t handle millions of concurrent users.',

  famousIncident: {
    title: 'The Handmaid\'s Tale Season Premiere',
    company: 'Hulu',
    year: '2017',
    whatHappened: 'The Handmaid\'s Tale season premiere caused traffic to spike 8x at midnight. Hulu\'s load balancing and auto-scaling infrastructure handled it well, but some users experienced brief delays during the first few minutes.',
    lessonLearned: 'Pre-scale before major content releases. Load balancers + auto-scaling = resilience.',
    icon: '📺',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Handling live sports and content release spikes',
    howTheyDoIt: 'Uses cloud load balancers with intelligent routing across hundreds of app server instances',
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
  id: 'hulu-step-5',
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
  scenario: "Your database server just died during Sunday night's live game. Hardware failure.",
  hook: "All users see 'Service Unavailable' for 30 minutes during prime time. Revenue loss: $1.5 million.",
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
- **Data safety**: Multiple copies of your data

For Hulu:
- Watchlists and watch history are critical user data
- Must survive hardware failures
- Read replicas help with catalog queries`,

  whyItMatters: 'Hulu stores critical user data - watchlists, viewing history, preferences. Database failure without replication means losing everything.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. Their replication lag was too high, so backups were also affected. They lost 6 hours of data.',
    lessonLearned: 'Replication lag matters. Test your failover process regularly. Monitor replication health.',
    icon: '🗑️',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses multi-AZ database replication with at least 2 read replicas. Automated failover within 30 seconds.',
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
  id: 'hulu-step-6',
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
  scenario: "You've grown to 15 million concurrent viewers! One app server can't keep up!",
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
    { label: 'Capacity', before: '5K req/s', after: '50K+ req/s' },
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

For Hulu:
- Start with 3-5 app server instances
- Scale up during peak times (prime time, live sports)
- Scale down during quiet periods (3-6 AM)
- Auto-scaling based on CPU/memory metrics`,

  whyItMatters: 'At 18K requests/second peak for catalog alone, plus streaming control, you need many app servers working in parallel.',

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Handling US-wide traffic',
    howTheyDoIt: 'Runs hundreds of app server instances across multiple cloud regions. Auto-scales based on traffic patterns and time of day.',
  },

  famousIncident: {
    title: 'March Madness Streaming',
    company: 'Hulu + Live TV',
    year: '2020',
    whatHappened: 'March Madness streaming caused unprecedented traffic spikes. Hulu\'s auto-scaling infrastructure added hundreds of server instances within minutes, handling the surge smoothly.',
    lessonLearned: 'Design for horizontal scaling from day 1. Sports events create unpredictable traffic patterns.',
    icon: '🏀',
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
  id: 'hulu-step-7',
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
  scenario: "You're storing 4+ Petabytes of video files. The database can't handle binary files!",
  hook: "Databases are designed for structured data, not 50GB TV show files.",
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
  nextTeaser: "But users experience buffering and slow load times...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage for Media Files',
  conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (videos in multiple formats)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy and durability

Architecture:
- **Database**: Video metadata (title, duration, thumbnail URL, episode info)
- **Object Storage**: Actual video files in multiple qualities
- Video URL stored in database points to S3 object

For adaptive bitrate streaming:
- Store same video in multiple qualities: 1080p, 720p, 480p, 360p
- Client switches between them based on network speed
- HLS (HTTP Live Streaming) protocol manages quality switching`,

  whyItMatters: 'Hulu stores 4+ Petabytes of video content. You can\'t put that in PostgreSQL!',

  famousIncident: {
    title: 'AWS S3 Outage',
    company: 'AWS/Multiple Services',
    year: '2017',
    whatHappened: 'S3 outage in US-East took down many services. But Hulu kept streaming because videos were cached at CDN edge servers. Only new content uploads were affected.',
    lessonLearned: 'Graceful degradation through caching. CDN acts as buffer against origin failures.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Storing petabytes of TV shows and movies',
    howTheyDoIt: 'Uses cloud object storage with each title encoded in multiple bitrates and resolutions. Total storage exceeds 4 PB.',
  },

  diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Request catalog/watchlist
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
    'S3 handles replication and durability automatically',
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
    { title: 'HLS', explanation: 'HTTP Live Streaming protocol', icon: '📡' },
  ],
};

const step8: GuidedStep = {
  id: 'hulu-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Stream videos (now at scale!)',
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
  scenario: "Users on the West Coast are experiencing constant buffering while watching live TV!",
  hook: "Your servers are on the East Coast. Streaming video across the country causes 8-second delays and buffering. This is unacceptable for live TV.",
  challenge: "Add a CDN to deliver videos from edge servers nationwide.",
  illustration: 'global-latency',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Videos stream smoothly nationwide!',
  achievement: 'CDN delivers videos from edge locations',
  metrics: [
    { label: 'West Coast video start', before: '8s', after: '1.2s' },
    { label: 'Buffering events', before: 'Frequent', after: 'Rare' },
    { label: 'US edge locations', after: '100+' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: The Secret Weapon for Video Streaming',
  conceptExplanation: `A **CDN** (Content Delivery Network) is CRITICAL for video streaming.

How it works:
1. Videos are cached at edge servers nationwide
2. When user clicks play, video streams from nearest edge
3. Edge location is < 50ms away vs 200ms+ to origin
4. This eliminates buffering and enables smooth playback

For Hulu:
- Uses multi-CDN strategy (Akamai, Level3, Fastly)
- VOD content pre-cached at edges during off-peak
- Live TV requires real-time edge distribution
- 95%+ of traffic served from edge locations

For adaptive bitrate:
- CDN serves multiple quality versions
- Client switches based on bandwidth
- HLS protocol handles the switching automatically`,

  whyItMatters: 'Without CDN, Hulu would be unwatchable. 120 Tbps of video traffic MUST be served from edges. Live TV especially requires low-latency edge delivery.',

  famousIncident: {
    title: 'Hulu Multi-CDN Strategy',
    company: 'Hulu',
    year: '2016',
    whatHappened: 'Hulu experienced issues with a primary CDN provider during a major live event. Because they had a multi-CDN strategy, they automatically failed over to backup CDNs. Most users didn\'t notice any degradation.',
    lessonLearned: 'For critical infrastructure like CDN, redundancy is essential. Multi-CDN provides resilience.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Serving 120 Tbps of video traffic',
    howTheyDoIt: 'Hulu uses multiple CDN providers with intelligent load balancing. Videos pre-cached at 100+ US edge locations. Real-time monitoring switches between CDNs based on performance.',
  },

  diagram: `
User in Seattle watching live TV:

┌──────────┐    30ms    ┌──────────┐  ┌─────────────────┐
│   User   │◀──────────▶│   CDN    │──│ Seattle CDN Edge│
│(Seattle) │   Streaming│  Edge    │  │  (Akamai/Level3)│
└──────────┘            └──────────┘  └─────────────────┘
                             │
                             │ Pre-cached video
                             │ (or live feed for live TV)
                             │
                        ┌────▼──────┐
                        │  Origin   │
                        │    S3     │
                        │  US-East  │
                        └───────────┘

Multi-CDN Failover:
- Primary CDN (Akamai) serves 70% of traffic
- Secondary CDN (Level3) handles overflow
- Tertiary CDN (Fastly) for failover
- Real-time health monitoring switches between CDNs
`,

  keyPoints: [
    'CDN is ESSENTIAL for video streaming - not optional',
    'Multi-CDN strategy provides redundancy and failover',
    'Videos cached at edge locations nationwide',
    'Users stream from nearest edge (< 50ms latency)',
    'Live TV requires real-time edge distribution',
    'Graceful degradation: edge → regional → origin',
  ],

  quickCheck: {
    question: 'Why does Hulu use multiple CDN providers instead of just one?',
    options: [
      'It\'s cheaper',
      'Redundancy and failover - if one CDN fails, others take over',
      'To store more content',
      'To support more video formats',
    ],
    correctIndex: 1,
    explanation: 'Multi-CDN provides redundancy. If one CDN has issues, traffic automatically fails over to backup CDNs, ensuring reliability.',
  },

  keyConcepts: [
    { title: 'CDN Edge', explanation: 'Video cache servers near users', icon: '📡' },
    { title: 'Multi-CDN', explanation: 'Using multiple CDN providers for redundancy', icon: '🔄' },
    { title: 'Adaptive Bitrate', explanation: 'Switch quality based on bandwidth', icon: '📊' },
    { title: 'Graceful Degradation', explanation: 'Fallback when edge fails', icon: '🛡️' },
  ],
};

const step9: GuidedStep = {
  id: 'hulu-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Stream VOD and live TV with low latency',
    taskDescription: 'Add CDN for nationwide video delivery from edge locations',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver videos from edge servers nationwide - CRITICAL!', displayName: 'CDN (Multi-CDN)' },
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
  scenario: "Finance is concerned! Your monthly cloud bill is $1.8 million.",
  hook: "The CFO says: 'Cut costs by 25% or we need to raise subscription prices.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Hulu!',
  achievement: 'A scalable, cost-effective streaming platform',
  metrics: [
    { label: 'Monthly cost', before: '$1.8M', after: 'Under budget' },
    { label: 'VOD start time', after: '<2s' },
    { label: 'Live TV latency', after: '<5s' },
    { label: 'Buffering rate', after: '<1%' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Concurrent streams', after: '15M+' },
  ],
  nextTeaser: "You've mastered Hulu system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for Hulu:
1. **Right-size instances** - Don't over-provision app servers
2. **CDN pre-caching** - Push popular content during off-peak (cheaper bandwidth)
3. **Tiered storage** - Move old/unpopular content to cheaper storage tiers
4. **Auto-scaling** - Scale down during low-traffic hours (3-10 AM)
5. **Encoding optimization** - Better codecs (H.265/AV1) = less bandwidth
6. **Multi-CDN optimization** - Route to cheapest CDN based on region
7. **Smart caching** - Cache popular shows aggressively, less popular on-demand

Hulu-specific optimizations:
- Use cheaper CDN bandwidth for VOD vs live TV
- Archive old episodes to cold storage (S3 Glacier)
- Predictive pre-caching based on viewing patterns
- Regional CDN optimization (more edges in high-usage areas)`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it. Streaming is bandwidth-intensive and expensive.',

  famousIncident: {
    title: 'Hulu CDN Cost Optimization',
    company: 'Hulu',
    year: '2018',
    whatHappened: 'Hulu optimized their CDN strategy by analyzing viewing patterns and pre-caching popular content during off-peak hours when bandwidth is cheaper. They also moved less popular older content to cheaper CDN tiers. This saved an estimated $50M+ per year.',
    lessonLearned: 'Smart caching and tiered storage strategies can dramatically reduce costs without impacting user experience.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Hulu',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Heavily optimizes every layer. Multi-CDN routing to cheapest option, efficient encoding, predictive caching, tiered storage. Auto-scales aggressively.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'CDN pre-caching reduces expensive real-time bandwidth',
    'Auto-scale based on time-of-day patterns',
    'Tiered storage for new vs old content',
    'Better encoding reduces bandwidth costs',
    'Multi-CDN routing optimizes for cost and performance',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a streaming platform?',
    options: [
      'Use smaller servers',
      'CDN edge caching and pre-positioning to minimize real-time bandwidth',
      'Delete old content',
      'Reduce video quality',
    ],
    correctIndex: 1,
    explanation: 'Real-time bandwidth is expensive. CDN edge caching and pre-caching during off-peak hours means 95%+ of traffic is served from cache, saving massive costs.',
  },

  keyConcepts: [
    { title: 'CDN Pre-caching', explanation: 'Push content to edges during off-peak', icon: '📡' },
    { title: 'Auto-Scaling', explanation: 'Scale based on time-of-day patterns', icon: '📊' },
    { title: 'Tiered Storage', explanation: 'Hot vs cold content pricing', icon: '🗄️' },
    { title: 'Multi-CDN Routing', explanation: 'Route to cheapest/best performing CDN', icon: '🔄' },
  ],
};

const step10: GuidedStep = {
  id: 'hulu-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $400/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $400/month',
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

export const huluGuidedTutorial: GuidedTutorial = {
  problemId: 'hulu',
  title: 'Design Hulu',
  description: 'Build a video streaming platform with VOD, live TV, watchlist, and nationwide CDN delivery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📺',
    hook: "You've been hired as Principal Engineer at StreamMedia Labs!",
    scenario: "Your mission: Build a video streaming platform that can serve 15 million concurrent viewers watching both on-demand content and live TV without buffering.",
    challenge: "Can you design a system that handles 120 Terabits per second of video traffic with <5 second live TV latency?",
  },

  requirementsPhase: huluRequirementsPhase,

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
    'Multi-CDN Strategy',
    'Adaptive Bitrate Streaming',
    'Live TV Streaming',
    'Graceful Degradation',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed System Troubles (Graceful Degradation)',
    'Chapter 11: Stream Processing',
  ],
};

export default huluGuidedTutorial;
