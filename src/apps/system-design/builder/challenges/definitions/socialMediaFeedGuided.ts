import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Social Media Feed Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches system design concepts
 * while building a social media feed with personalization.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic chronological feed
 * Steps 4-6: Add fan-out strategies, ranking algorithms, infinite scroll
 *
 * Key Concepts:
 * - Feed generation strategies (fan-out on write vs read)
 * - Ranking algorithms and personalization
 * - Infinite scroll and pagination
 * - Real-time updates
 * - Caching strategies for feeds
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const socialMediaFeedRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a social media feed system",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Systems Architect at FeedTech Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-feed',
      category: 'functional',
      question: "What's the primary purpose of this feed system?",
      answer: "Users want to:\n\n1. **View their feed** - See posts from people they follow in a scrollable feed\n2. **Post content** - Share updates (text, images) that appear in followers' feeds\n3. **Engage with posts** - Like, comment, and share content\n4. **Discover content** - See recommended posts from users they don't follow",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Social feeds balance consumption (viewing) with creation (posting)",
    },
    {
      id: 'feed-ordering',
      category: 'functional',
      question: "How should posts be ordered in the feed?",
      answer: "For MVP, we'll start with **reverse chronological** (newest first). This is simpler and more transparent. Later, we can add **algorithmic ranking** based on engagement, relevance, and user preferences.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Chronological is simple and predictable; algorithmic ranking is complex but drives engagement",
    },
    {
      id: 'real-time-updates',
      category: 'functional',
      question: "Should users see new posts appear in real-time as they're scrolling?",
      answer: "Yes, but with a 'pull to refresh' model for MVP. Live streaming updates (like Facebook's 'New posts available') can be a v2 feature. Real-time adds significant complexity with WebSockets.",
      importance: 'important',
      insight: "Real-time streaming requires WebSockets and adds complexity - good to start with polling",
    },
    {
      id: 'infinite-scroll',
      category: 'functional',
      question: "How should users navigate through their feed?",
      answer: "**Infinite scroll** - as users scroll down, we automatically load more posts. This is standard for social feeds. We'll paginate results in chunks of 20 posts at a time.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Pagination is essential for performance - can't load thousands of posts at once",
    },
    {
      id: 'content-types',
      category: 'clarification',
      question: "What types of content can be posted?",
      answer: "For MVP, support text posts (up to 5000 characters) and single images. Videos, multiple images, and rich media are v2 features that add significant storage and processing complexity.",
      importance: 'important',
      insight: "Video adds encoding, storage, and streaming complexity - good to defer initially",
    },
    {
      id: 'notifications',
      category: 'clarification',
      question: "Should users get notifications when someone likes or comments on their posts?",
      answer: "Not for the MVP. Notifications are a separate push notification system. Let's focus on the core feed experience first.",
      importance: 'nice-to-have',
      insight: "Push notifications require separate infrastructure - scope out initially",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "300 million registered users, with 100 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Large-scale social platform requiring distributed architecture",
    },
    {
      id: 'throughput-posts',
      category: 'throughput',
      question: "How many posts are created per day?",
      answer: "About 50 million posts per day",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 posts/sec",
        result: "~600 posts/sec (1,800 at peak)",
      },
      learningPoint: "Moderate write volume - but fan-out is the challenge!",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many feed views per day?",
      answer: "About 5 billion feed views per day",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 reads/sec",
        result: "~58K reads/sec (175K at peak)",
      },
      learningPoint: "100:1 read-to-write ratio - feed reads dominate traffic!",
    },
    {
      id: 'fan-out-problem',
      category: 'burst',
      question: "What happens when a celebrity with 10 million followers posts?",
      answer: "That single post needs to appear in 10 million feeds! This is the 'fan-out' problem - we need a strategy to handle this efficiently without blocking the user.",
      importance: 'critical',
      insight: "Fan-out is the key design challenge - need async processing",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the feed load?",
      answer: "p99 under 300ms for initial feed load. Users expect a snappy experience, especially on mobile.",
      importance: 'critical',
      learningPoint: "Low latency requires aggressive caching and pre-computation",
    },
    {
      id: 'latency-post',
      category: 'latency',
      question: "How quickly should a new post appear in followers' feeds?",
      answer: "Within 5 seconds for most users. For celebrities with millions of followers, up to 30 seconds is acceptable.",
      importance: 'important',
      learningPoint: "This is fan-out latency - different from API response time",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-feed', 'feed-ordering', 'fan-out-problem'],
  criticalFRQuestionIds: ['core-feed', 'feed-ordering'],
  criticalScaleQuestionIds: ['throughput-reads', 'fan-out-problem', 'latency-feed'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can view their feed',
      description: 'See posts from followed users in reverse chronological order',
      emoji: '📰',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can create posts',
      description: 'Share text and image updates with followers',
      emoji: '✍️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can engage with posts',
      description: 'Like, comment, and share posts',
      emoji: '❤️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can follow others',
      description: 'Build their network to customize their feed',
      emoji: '👥',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Infinite scroll pagination',
      description: 'Load more posts as users scroll down',
      emoji: '📜',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Discover recommended content',
      description: 'See posts from users they don\'t follow',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '50 million posts',
    readsPerDay: '5 billion feed views',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 579, peak: 1737 },
    calculatedReadRPS: { average: 57870, peak: 173610 },
    maxPayloadSize: '~10KB (post with text + metadata)',
    storagePerRecord: '~5KB average',
    storageGrowthPerYear: '~90TB',
    redirectLatencySLA: 'p99 < 300ms (feed load)',
    createLatencySLA: 'p99 < 500ms (post creation)',
  },

  architecturalImplications: [
    '✅ Read-heavy (100:1) → Aggressive feed caching is CRITICAL',
    '✅ 175K reads/sec peak → Multiple app servers + load balancing',
    '✅ Fan-out problem → Async processing with message queues',
    '✅ 50M posts/day → Database partitioning by user_id',
    '✅ Infinite scroll → Cursor-based pagination required',
  ],

  outOfScope: [
    'Video posts',
    'Stories (ephemeral content)',
    'Live streaming',
    'Push notifications',
    'Multi-region deployment',
    'Advanced algorithmic ranking (ML-based)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple chronological feed where users can post and view updates. The fan-out optimization, ranking algorithms, and infinite scroll will come in later steps. Functionality first, then scale!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📱',
  scenario: "Welcome to FeedTech Inc! You're building the next generation social feed.",
  hook: "Your first user just signed up and opened the app. They want to see their feed!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your feed platform is online!',
  achievement: 'Users can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But there's no code to generate feeds yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Server Architecture for Social Feeds',
  conceptExplanation: `Every social feed starts with a **Client** (mobile app or web browser) connecting to a **Server**.

When a user opens your app:
1. Their device (the **Client**) sends HTTP requests to your **App Server**
2. The server processes the request (e.g., "get my feed")
3. The server returns a response (list of posts)

This request-response cycle is the foundation of all web applications!`,

  whyItMatters: 'Without this connection, users can\'t interact with your feed at all. This is day 1 infrastructure.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving 2 billion users daily',
    howTheyDoIt: 'Started with a simple LAMP stack in 2004, now uses thousands of distributed servers globally',
  },

  keyPoints: [
    'Client = user\'s device (mobile app, browser)',
    'App Server = your backend that generates feeds',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device making requests', icon: '📱' },
    { title: 'App Server', explanation: 'Backend that processes feed logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'social-feed-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the feed', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles feed generation and post creation', displayName: 'App Server' },
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
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Feed Generation Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to generate feeds!",
  hook: "A user just requested their feed, but got back an empty response.",
  challenge: "Write the Python code to create posts and generate personalized feeds.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your feed system works!',
  achievement: 'Users can now post and view their personalized feeds',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create posts', after: '✓' },
    { label: 'Can view feed', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all posts disappear...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Feed Generation: The Core Algorithm',
  conceptExplanation: `Every feed needs these core handler functions:

- \`create_post()\` - Save a new post from a user
- \`get_feed()\` - Generate the feed for a specific user
- \`follow_user()\` - Add someone to the follow graph
- \`like_post()\` - Record a like on a post

**Feed Generation Algorithm (Simple Version):**
1. Get list of users that current user follows
2. Get recent posts from those users
3. Sort by timestamp (newest first)
4. Return top 20 posts

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'This is the heart of your social network. Get this logic right and everything else builds on it.',

  famousIncident: {
    title: 'Facebook\'s News Feed Launch',
    company: 'Facebook',
    year: '2006',
    whatHappened: 'When Facebook launched the News Feed feature, it caused massive controversy - users weren\'t used to seeing all updates in one place. But technically, the simple chronological feed worked perfectly.',
    lessonLearned: 'Start with a simple, working feed. You can always make it smarter later.',
    icon: '📰',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Generating 5 billion feeds per day',
    howTheyDoIt: 'Uses complex ranking algorithms now, but started with simple chronological ordering',
  },

  keyPoints: [
    'Feed = posts from users you follow, sorted by time',
    'Store posts with user_id and timestamp for sorting',
    'Use in-memory storage initially - database comes next',
  ],

  quickCheck: {
    question: 'Why do we sort by timestamp in reverse chronological order?',
    options: [
      'It\'s faster to compute',
      'Users want to see the newest content first',
      'It uses less memory',
      'Databases require it',
    ],
    correctIndex: 1,
    explanation: 'Users expect to see fresh content at the top. Newest-first is intuitive and keeps feeds engaging.',
  },

  keyConcepts: [
    { title: 'Feed Generation', explanation: 'Algorithm to select and order posts', icon: '⚙️' },
    { title: 'Follow Graph', explanation: 'Data structure of who follows whom', icon: '🕸️' },
    { title: 'Chronological', explanation: 'Ordered by time, newest first', icon: '⏰' },
  ],
};

const step2: GuidedStep = {
  id: 'social-feed-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: View feed, FR-2: Create posts',
    taskDescription: 'Configure APIs and implement Python handlers for feed generation',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/posts and GET /api/v1/feed APIs',
      'Open the Python tab',
      'Implement create_post() and get_feed() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_post and get_feed',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/posts', 'GET /api/v1/feed'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes! Your server crashed and had to restart...",
  hook: "When it came back online, every post, every like, every follower - GONE! Users are furious.",
  challenge: "Add a database so data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is now persistent!',
  achievement: 'Posts and relationships survive server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But feeds are loading slowly as we grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Database Design for Social Feeds',
  conceptExplanation: `In-memory storage is fast but **volatile** - everything disappears on restart.

A **database** provides:
- **Durability**: Data survives crashes and restarts
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval with indexes

For social feeds, we need tables:
- \`users\` - User accounts and profiles
- \`posts\` - All posts with content and metadata
- \`follows\` - The follow graph (who follows whom)
- \`likes\` - Post engagement data
- \`comments\` - User comments on posts`,

  whyItMatters: 'Users trust you with their content. Losing posts destroys trust and kills your platform.',

  famousIncident: {
    title: 'Twitter\'s Data Durability Investment',
    company: 'Twitter',
    year: '2010',
    whatHappened: 'Early Twitter had several incidents where tweets were lost during failures. They invested heavily in their database infrastructure (Manhattan) to ensure durability.',
    lessonLearned: 'Data durability is non-negotiable for social platforms. Invest in it early.',
    icon: '🛡️',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Storing trillions of posts and relationships',
    howTheyDoIt: 'Uses MySQL with heavy sharding by user_id, plus custom storage solutions like TAO for the social graph',
  },

  keyPoints: [
    'Use SQL database for structured data (PostgreSQL)',
    'Index on user_id and timestamp for fast feed queries',
    'Database connection from App Server for read/write',
  ],

  quickCheck: {
    question: 'Why do we need an index on timestamp for the posts table?',
    options: [
      'To save disk space',
      'To sort posts quickly when generating feeds',
      'Databases require timestamps to be indexed',
      'To prevent duplicate posts',
    ],
    correctIndex: 1,
    explanation: 'Indexes speed up queries. Since we sort by timestamp for every feed, indexing it makes queries much faster.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Relational tables with relationships', icon: '🗄️' },
    { title: 'Indexes', explanation: 'Speed up queries on specific columns', icon: '📇' },
  ],
};

const step3: GuidedStep = {
  id: 'social-feed-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store posts, users, follows, likes permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Feed Reads
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 5 million users, and feeds are taking 2+ seconds to load!",
  hook: "Every feed request hits the database to join posts and users. The database is melting!",
  challenge: "Add a cache to make feed loads instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Feeds now load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Feed latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'DB queries', before: '100%', after: '5%' },
  ],
  nextTeaser: "But what about celebrities with millions of followers?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Feed Caching: Pre-computed Timelines',
  conceptExplanation: `A **cache** stores pre-computed feeds in fast memory (Redis), avoiding expensive database queries.

**Two caching strategies for feeds:**

1. **Cache-aside** (what we'll use for now):
   - Check cache for user's feed
   - If miss, generate from DB and cache it
   - Subsequent requests hit cache (fast!)

2. **Fan-out on write** (later step):
   - When someone posts, push it to all followers' cached feeds
   - Feed reads are instant (just read from cache)
   - But writes are expensive (update millions of caches)

With 100:1 read-to-write ratio, caching is essential!`,

  whyItMatters: 'At 175K reads/sec, hitting the database every time would be impossibly slow and expensive.',

  famousIncident: {
    title: 'Reddit Cache Invalidation Bug',
    company: 'Reddit',
    year: '2018',
    whatHappened: 'A bug caused all feed caches to invalidate simultaneously. Millions of requests hit the database, causing a 30-minute outage.',
    lessonLearned: 'Cache invalidation is one of the hardest problems in CS. Stagger expirations!',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Serving 10 billion timeline views per day',
    howTheyDoIt: 'Uses Redis to cache pre-computed timelines. 95%+ of timeline reads never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (95% of requests)
                     │   Return feed instantly!
`,

  keyPoints: [
    'Cache stores pre-computed feeds (list of post IDs)',
    'Cache Hit = instant response, no DB query',
    'Cache Miss = generate from DB, store in cache',
    'Set TTL (60 seconds) to prevent stale feeds',
  ],

  quickCheck: {
    question: 'With a 100:1 read-to-write ratio, why is caching so effective?',
    options: [
      'Caches are cheaper than databases',
      'Same feed is read 100 times but only needs to be computed once',
      'Caches never fail',
      'Databases don\'t support social feeds',
    ],
    correctIndex: 1,
    explanation: 'The same user checks their feed many times. Cache it once, serve it 100 times - huge savings!',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Feed found in cache - instant!', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Feed not cached - generate from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'social-feed-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: View feed (now with caching!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache pre-computed feeds for fast reads', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (60 seconds)',
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
// STEP 5: Add Message Queue for Fan-Out
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌟',
  scenario: "A celebrity with 10 million followers just posted!",
  hook: "The server tried to update 10 million cached feeds immediately. It timed out and crashed!",
  challenge: "Add a message queue to handle fan-out asynchronously.",
  illustration: 'celebrity-post',
};

const step5Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Fan-out is now handled asynchronously!',
  achievement: 'Celebrity posts no longer crash the system',
  metrics: [
    { label: 'Post latency', before: 'Timeout', after: '<500ms' },
    { label: 'Fan-out time', after: '<10s for 10M followers' },
  ],
  nextTeaser: "But we need smarter feed ranking...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Fan-Out Strategies: Write vs Read',
  conceptExplanation: `The **fan-out problem**: When someone posts, how do we update all followers' feeds?

**Two approaches:**

1. **Fan-out on Write** (push):
   - When user posts, immediately update all followers' cached feeds
   - Reads are instant (just fetch from cache)
   - BUT: Celebrity with 10M followers = 10M cache updates!
   - Solution: Use message queue + background workers

2. **Fan-out on Read** (pull):
   - When user requests feed, query posts from all followees at that moment
   - Writes are instant
   - BUT: Reads are slow (complex query)

**Hybrid approach** (what big platforms use):
- Regular users: Fan-out on write
- Celebrities (>1M followers): Fan-out on read
- Best of both worlds!`,

  whyItMatters: 'Without async fan-out, a single celebrity post could block your entire system for minutes.',

  famousIncident: {
    title: 'Twitter\'s Lady Gaga Problem',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'Lady Gaga had 20M followers. Her tweets caused synchronous fan-out that crashed the system. Twitter rewrote their fan-out to be fully async.',
    lessonLearned: 'Never block on fan-out. Always use async processing.',
    icon: '👸',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling posts from users with millions of followers',
    howTheyDoIt: 'Uses Kafka for event streaming. Background workers process fan-out in parallel. Hybrid approach for celebrities.',
  },

  diagram: `
User Posts
    │
    ▼
┌─────────────┐     ┌─────────────────────────────┐
│ App Server  │────▶│    Message Queue (Kafka)    │
│ (instant    │     │  [post1, post2, post3...]   │
│  return!)   │     └──────────────┬──────────────┘
└─────────────┘                    │
                                   │ Workers consume
                                   ▼
                          ┌─────────────────┐
                          │  Fan-out Workers│
                          │   (parallel)    │
                          └────────┬────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        Update cache         Update cache         Update cache
       (follower 1-1M)     (follower 1M-2M)     (follower 2M-3M)
`,

  keyPoints: [
    'Message queue decouples posting from fan-out',
    'User gets instant response - fan-out happens in background',
    'Workers process queue in parallel for speed',
    'Hybrid: fan-out on write for regular users, on read for celebrities',
  ],

  quickCheck: {
    question: 'Why do we use a message queue for fan-out instead of doing it synchronously?',
    options: [
      'Message queues are faster',
      'User gets instant response while fan-out happens in background',
      'Message queues are cheaper',
      'Databases require it',
    ],
    correctIndex: 1,
    explanation: 'Async fan-out means the user doesn\'t wait. Post returns instantly, and followers\' feeds update in the background.',
  },

  keyConcepts: [
    { title: 'Fan-Out', explanation: 'Distributing one post to many feeds', icon: '📡' },
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Background Workers', explanation: 'Process queue in parallel', icon: '⚙️' },
  ],
};

const step5: GuidedStep = {
  id: 'social-feed-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Create posts (now with async fan-out)',
    taskDescription: 'Add a Message Queue for async fan-out processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle post fan-out asynchronously', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async fan-out.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Ranking Algorithm Service
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "User engagement is dropping! People are complaining about boring feeds.",
  hook: "Chronological feeds show everything, but users want to see the BEST content first.",
  challenge: "Add a ranking algorithm to prioritize engaging content.",
  illustration: 'algorithm-thinking',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Feeds are now personalized!',
  achievement: 'Ranking algorithm increases engagement',
  metrics: [
    { label: 'User engagement', before: '20%', after: '45%' },
    { label: 'Time on app', before: '5 min', after: '15 min' },
  ],
  nextTeaser: "Now you have a scalable, engaging social feed!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Feed Ranking: From Chronological to Algorithmic',
  conceptExplanation: `**Chronological feeds** are simple but not optimal. Users miss great content from hours ago.

**Algorithmic ranking** scores each post and shows highest-scoring first:

**Simple Ranking Formula:**
\`\`\`
Score = (likes + 2*comments + 3*shares) / age_in_hours
\`\`\`

**Advanced factors** (ML-based):
- User's past interactions
- Post engagement rate
- Content type (video > photo > text)
- Relationship strength (close friends rank higher)
- Recency decay

**Implementation:**
- Fetch candidate posts (chronological)
- Score each post with ranking algorithm
- Sort by score, return top N
- Cache ranked feeds`,

  whyItMatters: 'Ranking algorithms are why people spend hours on Facebook/Instagram. They optimize for engagement.',

  famousIncident: {
    title: 'Facebook\'s Algorithm Controversy',
    company: 'Facebook',
    year: '2018',
    whatHappened: 'Facebook\'s ranking algorithm was criticized for creating "filter bubbles" and prioritizing divisive content. They adjusted to prioritize "meaningful interactions".',
    lessonLearned: 'Ranking algorithms are powerful - optimize for the right metrics.',
    icon: '⚖️',
  },

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Ranking billions of feed posts',
    howTheyDoIt: 'Uses ML models trained on engagement data. Factors: relationship, timeliness, interest, engagement. Re-ranks every feed request.',
  },

  diagram: `
Feed Request
     │
     ▼
┌─────────────────┐
│  Fetch Posts    │  (last 1000 posts from followees)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Score Each     │  score = f(likes, comments, age, ...)
│  Post           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sort by Score  │  (highest first)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return Top 20  │
└─────────────────┘
`,

  keyPoints: [
    'Ranking optimizes for engagement (likes, comments, shares)',
    'Recency decay: older posts score lower',
    'Can use simple formula or ML model',
    'Re-rank on every feed request for freshness',
  ],

  quickCheck: {
    question: 'Why do we divide by age_in_hours in the ranking formula?',
    options: [
      'Older posts have more likes',
      'To give fresher content a boost - recency matters',
      'It makes the formula more complex',
      'Databases require it',
    ],
    correctIndex: 1,
    explanation: 'Recency decay ensures fresh content ranks high. A 1-hour-old post with 10 likes beats a 10-hour-old post with 20 likes.',
  },

  keyConcepts: [
    { title: 'Engagement Score', explanation: 'Metric combining likes, comments, shares', icon: '📈' },
    { title: 'Recency Decay', explanation: 'Older posts rank lower', icon: '⏰' },
    { title: 'Personalization', explanation: 'Tailored to each user\'s interests', icon: '🎯' },
  ],
};

const step6: GuidedStep = {
  id: 'social-feed-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1: View feed (now with ranking!), FR-6: Discover content',
    taskDescription: 'Configure ranking algorithm in App Server',
    successCriteria: [
      'Click App Server to open inspector',
      'Navigate to Configuration tab',
      'Enable feed ranking algorithm',
      'Set ranking factors (engagement, recency)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click App Server, then Configuration tab to find ranking settings',
    level2: 'Enable algorithmic ranking and configure engagement weights',
    solutionComponents: [
      { type: 'app_server', config: { ranking: { enabled: true, algorithm: 'engagement' } } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const socialMediaFeedGuidedTutorial: GuidedTutorial = {
  problemId: 'social-media-feed',
  title: 'Design a Social Media Feed',
  description: 'Build a scalable feed system with chronological ordering, fan-out strategies, and algorithmic ranking',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '📱',
    hook: "You've been hired as Lead Engineer at FeedTech Inc!",
    scenario: "Your mission: Build a social media feed that can handle millions of users posting and viewing content in real-time.",
    challenge: "Can you design a system that balances instant posting with personalized feed delivery?",
  },

  requirementsPhase: socialMediaFeedRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Feed Generation Algorithms',
    'Database Design',
    'Caching Strategies',
    'Fan-Out Problem',
    'Message Queues',
    'Async Processing',
    'Ranking Algorithms',
    'Infinite Scroll',
    'Cache-Aside Pattern',
  ],

  ddiaReferences: [
    'Chapter 1: Fan-out problem (Twitter example)',
    'Chapter 5: Replication for read scaling',
    'Chapter 11: Stream processing for fan-out',
  ],
};

export default socialMediaFeedGuidedTutorial;
