import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Facebook Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a social networking platform like Facebook.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, load balancer, replication, CDN, etc.)
 *
 * Key Concepts:
 * - News feed generation (fan-out problem)
 * - Social graph storage
 * - Real-time updates
 * - Media delivery at scale
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const facebookRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a social networking platform like Facebook",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Staff Engineer at Social Network Co.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the core features users expect from a social network?",
      answer: "Users want to:\n\n1. **Create and manage profiles** - Personal information, profile picture\n2. **Connect with friends** - Send/accept friend requests (bidirectional)\n3. **Post updates** - Share text, photos, videos with their network\n4. **View News Feed** - See posts from friends, ordered by relevance/time\n5. **Engage with content** - Like and comment on posts",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Facebook is about connecting people and sharing content within your social network",
    },
    {
      id: 'friend-system',
      category: 'functional',
      question: "How does the friend system work? Is it like Twitter's follow?",
      answer: "No, it's **bidirectional**. On Facebook:\n- You send a friend request\n- They accept it\n- Now BOTH of you see each other's posts\n\nThis is different from Twitter's one-way follow. It creates a symmetric relationship graph.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Bidirectional friendships affect how we model the social graph and generate feeds",
    },
    {
      id: 'news-feed',
      category: 'functional',
      question: "How should the News Feed be generated?",
      answer: "For the MVP, show posts from friends in reverse chronological order (newest first). Each post can include:\n- Text content\n- Photos/videos (we'll handle metadata, actual files in object storage)\n- Likes count and comments\n\nAlgorithmic ranking (EdgeRank) can be a v2 feature.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "News Feed is the heart of Facebook - this is where users spend most of their time",
    },
    {
      id: 'groups-events',
      category: 'functional',
      question: "What about Groups and Events?",
      answer: "Great question! Groups and Events are important features:\n- **Groups** - Users can join communities and post within them\n- **Events** - Create events, invite friends, track RSVPs\n\nLet's include basic versions in our design. They're essentially variations of the news feed pattern.",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Groups and Events extend the core news feed concept to different contexts",
    },
    {
      id: 'messenger',
      category: 'clarification',
      question: "Should we include Messenger (chat/DMs)?",
      answer: "Messenger is now a separate product with its own infrastructure. Let's scope it out for the MVP. It's essentially a real-time messaging system that deserves its own design.",
      importance: 'nice-to-have',
      insight: "Messenger is a separate microservice with different scaling patterns",
    },
    {
      id: 'pages-ads',
      category: 'clarification',
      question: "What about Pages (for businesses) and Ads?",
      answer: "Let's focus on the core user experience. Pages are like profiles with different permissions. Ads are a completely separate system. Both are v2 features.",
      importance: 'nice-to-have',
      insight: "Pages and Ads add complexity - good to defer initially",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "3 billion registered users, 2 billion daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Facebook is the largest social network globally - extreme scale",
    },
    {
      id: 'throughput-posts',
      category: 'throughput',
      question: "How many posts are created per day?",
      answer: "About 300 million new posts per day",
      importance: 'critical',
      calculation: {
        formula: "300M ÷ 86,400 sec = 3,472 posts/sec",
        result: "~3,500 posts/sec (10,500 at peak)",
      },
      learningPoint: "High write volume - but reads dominate even more!",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many News Feed views per day?",
      answer: "About 20 billion News Feed views per day",
      importance: 'critical',
      calculation: {
        formula: "20B ÷ 86,400 sec = 231,481 reads/sec",
        result: "~230K reads/sec (700K at peak)",
      },
      learningPoint: "66:1 read-to-write ratio - aggressive caching essential!",
    },
    {
      id: 'friend-connections',
      category: 'scale',
      question: "What's the average number of friends per user?",
      answer: "Average 338 friends per user, but power users have 5,000 (the limit). This affects fan-out complexity.",
      importance: 'important',
      learningPoint: "Friend count directly impacts how many feeds need updating per post",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the News Feed load?",
      answer: "p99 under 300ms for initial feed load. Users expect a responsive experience.",
      importance: 'critical',
      learningPoint: "Fast feed generation requires pre-computation and caching",
    },
    {
      id: 'latency-post',
      category: 'latency',
      question: "How quickly should a new post appear in friends' feeds?",
      answer: "Within 5 seconds for most users. It doesn't need to be instant, but should feel real-time.",
      importance: 'important',
      learningPoint: "Eventual consistency is acceptable for social feeds",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'friend-system', 'news-feed'],
  criticalFRQuestionIds: ['core-features', 'friend-system', 'news-feed'],
  criticalScaleQuestionIds: ['throughput-reads', 'friend-connections', 'latency-feed'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create profiles',
      description: 'Manage personal information and profile pictures',
      emoji: '👤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can add friends',
      description: 'Send/accept friend requests (bidirectional)',
      emoji: '🤝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can create posts',
      description: 'Share text, photos, videos with network',
      emoji: '📝',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can view News Feed',
      description: 'See posts from friends, newest first',
      emoji: '📰',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can like and comment',
      description: 'Engage with posts through likes and comments',
      emoji: '👍',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users can join Groups and Events',
      description: 'Participate in communities and organize gatherings',
      emoji: '👥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '2 billion',
    writesPerDay: '300 million posts',
    readsPerDay: '20 billion feed views',
    peakMultiplier: 3,
    readWriteRatio: '66:1',
    calculatedWriteRPS: { average: 3472, peak: 10416 },
    calculatedReadRPS: { average: 231481, peak: 694443 },
    maxPayloadSize: '~10MB (photo/video)',
    storagePerRecord: '~2KB (post metadata)',
    storageGrowthPerYear: '~220TB',
    redirectLatencySLA: 'p99 < 300ms (feed)',
    createLatencySLA: 'p99 < 1s (post)',
  },

  architecturalImplications: [
    '✅ Read-heavy (66:1) → Caching is CRITICAL for News Feed',
    '✅ 700K reads/sec peak → Multiple app servers + load balancing required',
    '✅ Bidirectional friend graph → More complex than Twitter\'s follow',
    '✅ Fan-out to avg 338 friends → Message queue for async processing',
    '✅ Media content → Object storage + CDN needed',
  ],

  outOfScope: [
    'Messenger (real-time chat)',
    'Pages (business profiles)',
    'Ads system',
    'Live video streaming',
    'Algorithmic feed ranking (EdgeRank)',
    'Multi-region deployment',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create profiles, add friends, post updates, and view their feed. The complexity of fan-out optimization, caching strategies, and media delivery comes in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '👥',
  scenario: "Welcome to Social Network Co! You're building the next Facebook.",
  hook: "Your first user just signed up. They want to create their profile!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your social network is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle profiles and posts yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every social network starts with a **Client** connecting to a **Server**.

When a user opens Facebook:
1. Their device (phone, browser) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, users can\'t interact with your platform at all.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling 2 billion daily active users',
    howTheyDoIt: 'Started with a simple PHP server in 2004, now uses thousands of servers globally with complex load balancing',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP/HTTPS = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles business logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response communication', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'facebook-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Facebook', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles profiles, posts, and News Feed', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle social network features!",
  hook: "A user just tried to create a profile and post an update, but got errors.",
  challenge: "Write the Python code to handle profiles, friend requests, posts, and News Feed.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle social networking!',
  achievement: 'You implemented the core Facebook functionality',
  metrics: [
    { label: 'APIs implemented', after: '5' },
    { label: 'Can create profiles', after: '✓' },
    { label: 'Can add friends', after: '✓' },
    { label: 'Can post updates', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Social Network Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Facebook, we need handlers for:
- \`create_profile()\` - Set up user profile
- \`send_friend_request()\` - Create friendship connection
- \`create_post()\` - Share a new post
- \`get_news_feed()\` - Fetch posts from friends
- \`like_post()\` - Like a post

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server can\'t do anything. This is where the social network logic lives!',

  famousIncident: {
    title: 'The Great Facebook Outage',
    company: 'Facebook',
    year: '2021',
    whatHappened: 'A configuration change took down all of Facebook, Instagram, and WhatsApp for 6 hours. The core services were fine, but networking issues prevented servers from communicating.',
    lessonLearned: 'Even simple systems need robust infrastructure. Start simple, but design for growth.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling 300M posts per day',
    howTheyDoIt: 'Uses a sophisticated feed ranking system (EdgeRank) with machine learning, but started with simple chronological ordering',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle bidirectional friendships (different from Twitter)',
    'News Feed aggregates posts from all friends',
  ],

  quickCheck: {
    question: 'How is Facebook\'s friend system different from Twitter\'s follow?',
    options: [
      'They\'re exactly the same',
      'Facebook is bidirectional (both users must agree)',
      'Facebook only allows 5,000 friends',
      'Twitter is more popular',
    ],
    correctIndex: 1,
    explanation: 'Facebook friendships are symmetric (bidirectional) - both users see each other\'s content. Twitter follows are asymmetric (one-way).',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Social Graph', explanation: 'Network of user relationships', icon: '🕸️' },
    { title: 'News Feed', explanation: 'Aggregated posts from connections', icon: '📰' },
  ],
};

const step2: GuidedStep = {
  id: 'facebook-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1 through FR-5: Core social networking features',
    taskDescription: 'Configure APIs and implement Python handlers for profiles, friends, posts, and feed',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign profile, friend, post, and feed APIs',
      'Open the Python tab',
      'Implement handler functions for core features',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for profile, friend, post, and feed handlers',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/profiles', 'POST /api/v1/friends', 'POST /api/v1/posts', 'GET /api/v1/feed'] } },
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
  hook: "When it came back online, ALL the profiles, friendships, and posts were GONE! Millions of users affected.",
  challenge: "Add a database so data survives server restarts.",
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
  nextTeaser: "But News Feed is getting slow as the network grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Facebook, we need tables for:
- \`users\` - User profiles
- \`friendships\` - Bidirectional friend relationships
- \`posts\` - All content created by users
- \`likes\` - Post likes
- \`comments\` - Post comments
- \`groups\` - Community groups
- \`events\` - Event information`,

  whyItMatters: 'Imagine losing all your friends and posts because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'MySpace Data Loss',
    company: 'MySpace',
    year: '2019',
    whatHappened: 'During a server migration, MySpace lost 12 years of user content - over 50 million songs and millions of photos, gone forever.',
    lessonLearned: 'Persistent storage with proper backups is non-negotiable. Test your recovery procedures.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Storing 300M posts per day',
    howTheyDoIt: 'Uses MySQL (TAO - The Associations and Objects) heavily sharded across thousands of servers, with a graph-oriented caching layer',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL/MySQL) for structured social data',
    'Social graph (friendships) is stored as relationships',
    'Connect App Server to Database for read/write operations',
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
    { title: 'Social Graph', explanation: 'Network of user connections', icon: '🕸️' },
  ],
};

const step3: GuidedStep = {
  id: 'facebook-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, friendships, posts, likes, comments, groups, events permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast News Feed
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million users, and News Feed is loading in 3+ seconds!",
  hook: "Every feed request queries the database for hundreds of posts. It's melting under the load.",
  challenge: "Add a cache to make News Feed reads lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'News Feed loads 25x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Feed latency', before: '3000ms', after: '120ms' },
    { label: 'Cache hit rate', after: '92%' },
  ],
  nextTeaser: "But your single server can't handle the traffic...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier for Social Feeds',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Facebook, we cache:
- User News Feeds (pre-computed list of post IDs)
- User profiles
- Popular posts
- Friend lists`,

  whyItMatters: 'At 700K reads/sec peak, hitting the database for every request would be catastrophically expensive. Caching is essential.',

  famousIncident: {
    title: 'Facebook Cache Stampede',
    company: 'Facebook',
    year: '2010',
    whatHappened: 'When their Memcached layer had issues, millions of requests simultaneously hit the database, causing a cascading failure. Site was down for 2.5 hours.',
    lessonLearned: 'Cache warming and graceful degradation are essential. Never let all caches expire at once.',
    icon: '🏃',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving 20 billion feed views per day',
    howTheyDoIt: 'Uses Memcached clusters (later evolved to TAO) to cache pre-computed feeds. Most feed reads never touch the database.',
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
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Set TTL (Time To Live) to prevent stale data',
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
  id: 'facebook-step-4',
  stepNumber: 4,
  frIndex: 3,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-4: Users can view News Feed (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache News Feeds for fast reads', displayName: 'Redis Cache' },
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
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "A viral post caused traffic to spike 10x. One server can't handle it all.",
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
- IP hash: Same user always goes to same server (for sticky sessions)`,

  whyItMatters: 'At peak, Facebook handles 700K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Super Bowl XLVII Blackout',
    company: 'Facebook/Twitter',
    year: '2013',
    whatHappened: 'During the Super Bowl power outage, social media traffic spiked 10x in minutes. Load balancers automatically distributed the load, keeping both platforms alive.',
    lessonLearned: 'Load balancers are essential for handling unpredictable viral traffic spikes.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling 700K requests/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers (DNS, L4, L7) to distribute traffic across thousands of servers globally',
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
  id: 'facebook-step-5',
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
  scenario: "Your database crashed for 10 minutes last night. EVERYTHING stopped.",
  hook: "Users couldn't view feeds, post updates, or do anything. Revenue loss: $500,000.",
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

  whyItMatters: 'A single database is a single point of failure. For Facebook\'s 300M posts/day, downtime is not acceptable.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. Their replication lag was too high, so backups were also affected. They lost 6 hours of data.',
    lessonLearned: 'Replication lag matters. Test your failover process regularly.',
    icon: '🗑️',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses MySQL with aggressive replication. Each shard has multiple replicas across different data centers.',
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
  id: 'facebook-step-6',
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
  scenario: "Traffic has grown 20x. One app server can't keep up!",
  hook: "Users are getting timeouts. Your load balancer has nowhere to route traffic.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 20x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Capacity', before: '10K req/s', after: '200K+ req/s' },
  ],
  nextTeaser: "But new posts are slow to appear in friends' feeds...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Facebook:
- Start with 3-5 app server instances
- Scale up during peak times
- Scale down during quiet periods`,

  whyItMatters: 'At 700K requests/second, you need hundreds of app servers just for the API layer.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs tens of thousands of web servers across multiple data centers. Auto-scales based on traffic patterns.',
  },

  famousIncident: {
    title: 'Pokemon GO Launch',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Traffic was 50x higher than expected. Servers couldn\'t scale fast enough. Game was unplayable for days.',
    lessonLearned: 'Design for horizontal scaling from day 1. It\'s harder to add later.',
    icon: '🎮',
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
  id: 'facebook-step-7',
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
// STEP 8: Add Message Queue for News Feed Fan-Out
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌟',
  scenario: "A user with 5,000 friends just posted an update!",
  hook: "Updating 5,000 News Feeds synchronously would take 10+ seconds. Users see delays.",
  challenge: "Add a message queue to handle News Feed updates asynchronously.",
  illustration: 'celebrity-tweet',
};

const step8Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'News Feed fan-out is now lightning fast!',
  achievement: 'Async processing handles large friend networks efficiently',
  metrics: [
    { label: 'Post creation latency', before: '10s', after: '<500ms' },
    { label: 'Feed update time', after: '<5s for 99% of users' },
  ],
  nextTeaser: "But we need to handle photos and videos...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: The News Feed Fan-Out Solution',
  conceptExplanation: `The **fan-out problem**: When you post, it needs to appear in all your friends' feeds.
- Average user has 338 friends = 338 feed updates
- Power user with 5,000 friends = 5,000 feed updates

**Synchronous**: Post → Update 5,000 feeds → Return "Posted!" ❌ (too slow)
**Async with Queue**: Post → Add to queue → Return "Posted!" ✓
- Background workers process the queue
- Update feeds in parallel
- User gets instant response`,

  whyItMatters: 'Without async processing, posting would timeout for users with many friends.',

  famousIncident: {
    title: 'Facebook News Feed Launch',
    company: 'Facebook',
    year: '2006',
    whatHappened: 'When News Feed launched, the synchronous implementation couldn\'t keep up. They quickly re-architected to use queues for fan-out.',
    lessonLearned: 'Fan-out at scale requires async processing from the start.',
    icon: '📰',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Fan-out for 300M posts/day',
    howTheyDoIt: 'Uses custom messaging infrastructure. When you post, it goes to a queue. Thousands of workers consume and update feeds in parallel.',
  },

  diagram: `
User Posts Update
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [post1, post2, post3, ...]         │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Posted!"                  ▼
                          ┌─────────────────┐
                          │ Fan-out Workers │
                          │ (background)    │
                          └────────┬────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌─────────┐          ┌─────────┐          ┌─────────┐
        │Friend 1 │          │Friend 2 │          │Friend N │
        │  Feed   │          │  Feed   │          │  Feed   │
        └─────────┘          └─────────┘          └─────────┘
`,

  keyPoints: [
    'Message queue decouples posting from feed updates',
    'User gets instant response - fan-out happens in background',
    'Workers process queue in parallel for speed',
    'Handles variable friend counts gracefully',
  ],

  quickCheck: {
    question: 'Why do we use async fan-out instead of synchronous updates?',
    options: [
      'It\'s cheaper',
      'Users get instant response while updates happen in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the user doesn\'t wait. Their post is created instantly, and feed updates happen in the background.',
  },

  keyConcepts: [
    { title: 'Fan-Out', explanation: 'Distributing one post to many feeds', icon: '📡' },
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
  ],
};

const step8: GuidedStep = {
  id: 'facebook-step-8',
  stepNumber: 8,
  frIndex: 2,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users can create posts (now with fast fan-out)',
    taskDescription: 'Add a Message Queue for async News Feed fan-out processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle News Feed fan-out asynchronously', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
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
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async fan-out.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add Object Storage and CDN for Photos/Videos
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📸',
  scenario: "Users are uploading millions of photos and videos!",
  hook: "The database can't handle binary files. Users in other countries see slow load times.",
  challenge: "Add object storage for media files and a CDN for fast global delivery.",
  illustration: 'storage-full',
};

const step9Celebration: CelebrationContent = {
  emoji: '🌍',
  message: 'Media uploads and delivery are working globally!',
  achievement: 'Photos and videos load fast everywhere',
  metrics: [
    { label: 'Photo storage', after: 'Unlimited (S3)' },
    { label: 'Global image latency', before: '2000ms', after: '50ms' },
    { label: 'CDN cache hit rate', after: '95%' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage + CDN for Media at Scale',
  conceptExplanation: `**Object Storage** (like S3) is designed for large files:
- Stores binary objects (images, videos)
- Virtually unlimited capacity
- Built-in redundancy

**CDN** (Content Delivery Network) caches media at edge locations:
- Users get media from nearby servers
- Reduces origin load
- Faster loading globally

Architecture:
- **Database**: Photo/video metadata (caption, user_id, URL)
- **Object Storage**: Actual media files
- **CDN**: Global cache layer for fast delivery`,

  whyItMatters: 'Facebook users upload 350 million photos per day. You need specialized storage and delivery infrastructure.',

  famousIncident: {
    title: 'Facebook Photo Infrastructure',
    company: 'Facebook',
    year: '2009',
    whatHappened: 'Facebook built Haystack, a custom photo storage system, because S3 couldn\'t handle their scale cost-effectively. Saved millions in storage costs.',
    lessonLearned: 'Start with managed services (S3, CDN). Build custom solutions only at extreme scale.',
    icon: '📷',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Storing and serving 350M photos per day',
    howTheyDoIt: 'Uses custom Haystack storage with global CDN. Photos are stored in multiple formats (thumbnail, medium, full) for optimal delivery.',
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
       │                               └────────┬────────┘
       │ 3. Save metadata                      │
       ▼                                       │
┌──────────────┐                              │
│   Database   │  (photo_url)                 │
└──────────────┘                              │
                                              │
       User views photo                       │
       │                                       │
       ▼                                       │
┌──────────────┐     Cache hit       ┌────────▼────────┐
│   Client     │◀────────────────────│      CDN        │
└──────────────┘                     │   (CloudFront)  │
                                     └─────────────────┘
`,

  keyPoints: [
    'Object storage for files, database for metadata',
    'Store media URL in database, actual file in S3',
    'CDN caches media at edge locations globally',
    'Users get media from nearest edge (< 50ms)',
  ],

  quickCheck: {
    question: 'Why use both Object Storage AND CDN?',
    options: [
      'They do the same thing',
      'S3 stores files, CDN caches them globally for fast delivery',
      'CDN is cheaper than S3',
      'S3 can\'t store images',
    ],
    correctIndex: 1,
    explanation: 'S3 is the origin storage. CDN caches content at edge locations worldwide for fast, low-latency delivery.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Scalable storage for binary files', icon: '☁️' },
    { title: 'CDN', explanation: 'Global edge cache for fast delivery', icon: '🌐' },
    { title: 'Edge Location', explanation: 'CDN server close to users', icon: '📍' },
  ],
};

const step9: GuidedStep = {
  id: 'facebook-step-9',
  stepNumber: 9,
  frIndex: 2,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users can create posts with photos/videos (now at scale!)',
    taskDescription: 'Add Object Storage for media files and CDN for global delivery',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store photo and video files', displayName: 'S3 Object Storage' },
      { type: 'cdn', reason: 'Deliver media from edge locations', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'Object Storage component added',
      'CDN component added',
      'App Server connected to Object Storage',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Object Storage and CDN components. Connect App Server to Object Storage.',
    level2: 'Connect CDN to Object Storage (CDN uses S3 as origin). This enables fast global media delivery.',
    solutionComponents: [{ type: 'object_storage' }, { type: 'cdn' }],
    solutionConnections: [
      { from: 'app_server', to: 'object_storage' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2.5 million.",
  hook: "The CFO says: 'Cut costs by 30% or we're shutting down features.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Facebook!',
  achievement: 'A scalable, cost-effective social networking platform',
  metrics: [
    { label: 'Monthly cost', before: '$2.5M', after: 'Under budget' },
    { label: 'Feed latency', after: '<300ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '700K req/sec' },
  ],
  nextTeaser: "You've mastered Facebook system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use spot/reserved instances** - 60-70% cheaper
3. **Cache aggressively** - Reduce expensive database calls
4. **Auto-scale** - Scale down during low traffic
5. **Tiered storage** - Move old media to cheaper storage
6. **Optimize CDN** - Increase cache TTL for popular content

For Facebook:
- Archive old posts to cheaper storage
- Use smaller cache for less active users
- Scale down servers at night
- Compress media files`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Dropbox Saves $75M',
    company: 'Dropbox',
    year: '2017',
    whatHappened: 'Moved from AWS to own data centers. Saved $75M in two years by optimizing infrastructure at their scale.',
    lessonLearned: 'At extreme scale, even small optimizations save millions. Below that, optimize cloud costs.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Heavily optimizes resource usage. Runs own data centers. Custom hardware. Auto-scales aggressively. Compresses data everywhere.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure',
    'Use auto-scaling to match demand',
    'Cache to reduce expensive operations',
    'Consider different storage tiers for hot/cold data',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a read-heavy social network?',
    options: [
      'Use bigger servers',
      'Aggressive caching to reduce database calls',
      'Delete old data',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Caching is often the most cost-effective optimization. Cache hits are cheap; database queries are expensive at scale.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'facebook-step-10',
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
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
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
    level2: 'Consider: fewer replicas, smaller cache, right-sized instances. Keep 3 app servers.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const facebookGuidedTutorial: GuidedTutorial = {
  problemId: 'facebook',
  title: 'Design Facebook',
  description: 'Build a social networking platform with profiles, friends, News Feed, and media sharing',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '👥',
    hook: "You've been hired as Lead Engineer at Social Network Co!",
    scenario: "Your mission: Build a platform like Facebook where people can connect with friends, share updates, and stay in touch with their social network.",
    challenge: "Can you design a system that handles 2 billion daily active users and their News Feeds?",
  },

  requirementsPhase: facebookRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Social Graph Modeling',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Message Queues',
    'News Feed Fan-Out',
    'Object Storage',
    'CDN',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Fan-out problem',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
  ],
};

export default facebookGuidedTutorial;
