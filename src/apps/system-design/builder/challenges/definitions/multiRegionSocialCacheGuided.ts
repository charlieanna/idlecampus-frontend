import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Multi-Region Social Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a globally distributed social platform with advanced caching.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with multi-region NFRs (cache, consistency, CDN, etc.)
 *
 * Key Concepts:
 * - Social graph caching strategies
 * - Feed pre-computation and materialized views
 * - Regional consistency models (eventual vs strong)
 * - Multi-region data replication
 * - CDN for static content delivery
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const multiRegionSocialCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a globally distributed social media platform with advanced caching",

  interviewer: {
    name: 'Dr. Priya Sharma',
    role: 'Distinguished Engineer at GlobalSocial Inc.',
    avatar: '👩‍🔬',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-social',
      category: 'functional',
      question: "What are the core social features users need?",
      answer: "Users want to:\n\n1. **Follow other users** - Build their social graph\n2. **View their feed** - See posts from people they follow in real-time\n3. **Post updates** - Share content with followers\n4. **See engagement** - View likes and comments on posts",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "This is a classic social graph problem with read-heavy access patterns",
    },
    {
      id: 'global-users',
      category: 'functional',
      question: "Where are users located?",
      answer: "Users are **globally distributed**:\n- 30% in North America\n- 25% in Europe\n- 25% in Asia-Pacific\n- 20% elsewhere\n\nUsers expect low latency regardless of location.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Multi-region architecture is essential for global user experience",
    },
    {
      id: 'feed-freshness',
      category: 'functional',
      question: "How fresh must the feed be?",
      answer: "Users expect to see new posts within **seconds** of posting. However:\n- Own posts: instant visibility\n- Friends' posts: < 5 seconds is acceptable\n- Feed ordering: eventual consistency is fine (doesn't need to be perfect real-time)",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Eventual consistency enables better caching and scalability",
    },
    {
      id: 'social-graph',
      category: 'clarification',
      question: "How does the follow relationship work?",
      answer: "It's **bidirectional friendship** (like Facebook):\n- User A sends friend request to User B\n- User B accepts\n- Both see each other's posts\n\nFor MVP, let's assume all relationships are established. Request/accept flow can be v2.",
      importance: 'important',
      insight: "Bidirectional graphs are simpler than asymmetric (Twitter-style) for caching",
    },
    {
      id: 'feed-algorithm',
      category: 'clarification',
      question: "Is the feed chronological or algorithmically ranked?",
      answer: "Start with **reverse chronological** (newest first). Algorithmic ranking can be added later as it requires ML infrastructure.",
      importance: 'important',
      insight: "Chronological is easier to cache than personalized algorithmic feeds",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "1 billion registered users, with 300 million daily active users (DAU) globally distributed",
      importance: 'critical',
      learningPoint: "Massive scale with global distribution",
    },
    {
      id: 'throughput-posts',
      category: 'throughput',
      question: "How many posts per day?",
      answer: "About 500 million posts per day globally",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 posts/sec",
        result: "~6K writes/sec (18K at peak)",
      },
      learningPoint: "High write volume spread across regions",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many feed views per day?",
      answer: "About 50 billion feed views per day",
      importance: 'critical',
      calculation: {
        formula: "50B ÷ 86,400 sec = 578,703 reads/sec",
        result: "~579K reads/sec (1.7M at peak)",
      },
      learningPoint: "100:1 read-to-write ratio - caching is CRITICAL",
    },
    {
      id: 'social-graph-size',
      category: 'payload',
      question: "How many friends does the average user have?",
      answer: "Average 200 friends, with some users having up to 5,000 friends (the max limit).",
      importance: 'important',
      learningPoint: "Social graph queries must be optimized for fanout",
    },
    {
      id: 'regional-latency',
      category: 'latency',
      question: "What latency targets do we have for different regions?",
      answer: "**Intra-region**: p99 < 100ms (user to nearest data center)\n**Cross-region**: p99 < 300ms (acceptable for global feed sync)\n\nUsers should always hit their nearest region.",
      importance: 'critical',
      learningPoint: "Multi-region requires data replication and regional caching",
    },
    {
      id: 'consistency-model',
      category: 'latency',
      question: "What consistency guarantees do we need?",
      answer: "**Eventual consistency** is acceptable:\n- User's own posts: read-your-writes consistency\n- Friends' posts: can be delayed by a few seconds\n- Feed ordering: doesn't need to be perfectly consistent across regions",
      importance: 'critical',
      insight: "Eventual consistency enables aggressive caching and better performance",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-social', 'global-users', 'throughput-reads'],
  criticalFRQuestionIds: ['core-social', 'feed-freshness'],
  criticalScaleQuestionIds: ['throughput-reads', 'regional-latency', 'consistency-model'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can follow/befriend other users',
      description: 'Build bidirectional social connections',
      emoji: '👥',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view their feed',
      description: 'See posts from friends, newest first',
      emoji: '📰',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can post updates',
      description: 'Share content with all friends',
      emoji: '✍️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Global availability',
      description: 'Low latency for users worldwide',
      emoji: '🌍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '300 million',
    writesPerDay: '500 million posts',
    readsPerDay: '50 billion feed views',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 578703, peak: 1736109 },
    maxPayloadSize: '~2KB (post)',
    storagePerRecord: '~1KB (post metadata)',
    storageGrowthPerYear: '~180TB',
    redirectLatencySLA: 'p99 < 100ms (intra-region)',
    createLatencySLA: 'p99 < 500ms (post)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (100:1) → Multi-layer caching CRITICAL',
    '✅ 1.7M reads/sec peak → CDN + Regional caches required',
    '✅ Global users → Multi-region deployment essential',
    '✅ Social graph queries → Cache friend lists and pre-compute feeds',
    '✅ Eventual consistency → Enables aggressive caching strategies',
  ],

  outOfScope: [
    'Media uploads (images/videos)',
    'Direct messages',
    'Notifications',
    'Friend request/accept flow',
    'Algorithmic feed ranking',
    'Stories/ephemeral content',
  ],

  keyInsight: "First, let's make it WORK in a single region. We'll build a system where users can follow friends, post updates, and view feeds. Multi-region complexity and advanced caching strategies come later. Functionality first, then global scale!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌐',
  scenario: "Welcome to GlobalSocial Inc! You've been hired to build a worldwide social platform.",
  hook: "Your first user in New York just signed up. They want to connect with friends globally!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle social features yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every social platform starts with a **Client** connecting to a **Server**.

When a user opens your app:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation we'll build on for global scale!`,

  whyItMatters: 'Without this connection, users can\'t interact with your system at all.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving 3 billion users globally',
    howTheyDoIt: 'Started with a simple LAMP stack in 2004, now uses thousands of servers across 15+ data center regions worldwide',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'multi-region-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the social platform', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles social graph, posts, and feeds', displayName: 'App Server' },
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
// STEP 2: Implement Core Social Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle social features yet!",
  hook: "A user just tried to post 'Hello, world!' but got an error. There's no code!",
  challenge: "Write the Python code to handle friends, posts, and feeds.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle social features!',
  achievement: 'You implemented the core social functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can follow friends', after: '✓' },
    { label: 'Can post updates', after: '✓' },
    { label: 'Can view feed', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Social Graph Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For a social platform, we need handlers for:
- \`add_friend()\` - Create bidirectional friendship
- \`create_post()\` - Share content with friends
- \`get_feed()\` - Fetch posts from all friends
- \`get_friends()\` - Query the social graph

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the social magic happens!',

  famousIncident: {
    title: 'Facebook Feed Launch',
    company: 'Facebook',
    year: '2006',
    whatHappened: 'When Facebook launched News Feed, it showed users EVERYTHING their friends did. The initial implementation had no filtering and caused a massive privacy backlash. Facebook had to quickly add controls.',
    lessonLearned: 'Start simple with basic feed functionality, but design for privacy and filtering from the start.',
    icon: '📰',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Generating feeds for 3 billion users',
    howTheyDoIt: 'Uses TAO (The Associations and Objects) - a distributed graph database optimized for social graph queries',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Social graph stored as adjacency list (user → list of friends)',
    'Feed generated by querying all friends\' recent posts',
    'Use dictionaries for in-memory storage (temporary)',
  ],

  quickCheck: {
    question: 'Why is the social graph typically stored as an adjacency list?',
    options: [
      'It uses less memory than other structures',
      'It enables O(1) friend lookups and efficient traversal',
      'It\'s the only way to store graphs',
      'It works better with SQL databases',
    ],
    correctIndex: 1,
    explanation: 'Adjacency lists allow fast "who are my friends?" queries and efficient graph traversal for feed generation.',
  },

  keyConcepts: [
    { title: 'Social Graph', explanation: 'Network of user relationships', icon: '🕸️' },
    { title: 'Adjacency List', explanation: 'User → [list of friends]', icon: '📋' },
    { title: 'Feed Generation', explanation: 'Aggregate posts from all friends', icon: '📰' },
  ],
};

const step2: GuidedStep = {
  id: 'multi-region-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2, FR-3: Follow friends, view feed, create posts',
    taskDescription: 'Configure APIs and implement Python handlers for social features',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/friends, POST /api/v1/posts, and GET /api/v1/feed APIs',
      'Open the Python tab',
      'Implement add_friend(), create_post(), and get_feed() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for add_friend, create_post, and get_feed',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/friends', 'POST /api/v1/posts', 'GET /api/v1/feed'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL friendships, posts, and social connections were GONE!",
  challenge: "Add a database so the social graph persists across restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your social graph is safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Social graph durability', after: '100%' },
  ],
  nextTeaser: "But feed queries are getting slow as the user base grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Social Graphs',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Social graph survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient friend lookups and feed generation

For social platforms, we need tables for:
- \`users\` - User accounts
- \`friendships\` - Bidirectional relationships (user_id_1, user_id_2)
- \`posts\` - User-generated content
- \`feed_cache\` - Pre-computed feeds (we'll add this later)`,

  whyItMatters: 'Imagine losing all your friendships because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'MySpace Data Loss',
    company: 'MySpace',
    year: '2019',
    whatHappened: 'During a server migration, MySpace lost 12 years of user data including 50 million songs and countless social connections. The data was unrecoverable.',
    lessonLearned: 'Persistent storage with proper backups is non-negotiable for social platforms.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Storing 3+ billion social graphs',
    howTheyDoIt: 'Uses MySQL for social graph storage with TAO (caching layer) on top. Data is replicated across multiple data centers.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Use SQL (PostgreSQL) for structured social graph data',
    'Friend relationships stored bidirectionally for fast lookups',
    'Connect App Server to Database for read/write operations',
  ],

  quickCheck: {
    question: 'Why store friendships bidirectionally (both A→B and B→A)?',
    options: [
      'It uses more storage so it must be better',
      'It enables O(1) friend lookups in either direction',
      'Databases require it',
      'It makes queries slower',
    ],
    correctIndex: 1,
    explanation: 'Bidirectional storage means "who are Alice\'s friends?" is a single query, not scanning all friendships.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'Social Graph DB', explanation: 'Stores user relationships efficiently', icon: '🗄️' },
    { title: 'Bidirectional Storage', explanation: 'Both A→B and B→A for fast queries', icon: '↔️' },
  ],
};

const step3: GuidedStep = {
  id: 'multi-region-cache-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, friendships, posts permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Social Graph and Feed Pre-Computation
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million users, and feeds are loading in 5+ seconds!",
  hook: "Every feed request queries the database for friends, then queries all their posts. It's crushing the DB!",
  challenge: "Add a cache to store friend lists and pre-computed feeds.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Feeds load 50x faster!',
  achievement: 'Social graph caching and feed pre-computation working',
  metrics: [
    { label: 'Feed latency', before: '5000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'DB load', before: '100%', after: '5%' },
  ],
  nextTeaser: "But what about users on the other side of the world?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Social Graph Caching: Friend Lists and Pre-Computed Feeds',
  conceptExplanation: `A **cache** is critical for social platforms with 100:1 read-to-write ratio.

Two key caching strategies for social graphs:

1. **Social Graph Cache** - Cache each user's friend list
   - Key: user_id → Value: [friend_id_1, friend_id_2, ...]
   - Avoids repeated DB queries for "who are my friends?"

2. **Feed Pre-Computation** (Materialized View)
   - When user posts, push to all friends' feed caches
   - Key: user_id:feed → Value: [post_1, post_2, ...]
   - Feed reads become O(1) cache lookups instead of O(friends × posts) DB queries

This is the **fan-out on write** pattern from DDIA Chapter 1.`,

  whyItMatters: 'At 1.7M reads/sec peak, hitting the database for every feed query would melt it. Pre-computation is essential.',

  famousIncident: {
    title: 'Facebook Memcache Failure',
    company: 'Facebook',
    year: '2012',
    whatHappened: 'A bug in Facebook\'s Memcache cluster caused all feed caches to be lost simultaneously. Database servers were overwhelmed by the sudden load spike. Site went down for 30 minutes.',
    lessonLearned: 'Cache warming and graceful degradation are essential. Never let all caches expire at once.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving 50 billion feed views per day',
    howTheyDoIt: 'Uses Memcache for social graph caching and TAO for feed pre-computation. 95%+ cache hit rate.',
  },

  diagram: `
User Posts → Fan-out to all friends' feed caches

┌─────────┐
│ Alice   │ posts
│ (100    │
│ friends)│
└────┬────┘
     │ 1. Post stored in DB
     │ 2. Push to 100 friends' feed caches
     ▼
┌──────────────────────────────────────┐
│         Redis Cache                  │
│                                      │
│ bob:feed → [alice_post, ...]        │
│ charlie:feed → [alice_post, ...]    │
│ ...100 cache updates...              │
└──────────────────────────────────────┘

When Bob requests feed:
  → Check cache (bob:feed) → Instant! ✓
`,

  keyPoints: [
    'Cache social graph (friend lists) for O(1) lookups',
    'Pre-compute feeds using fan-out on write',
    'When user posts, update all friends\' feed caches',
    'Set TTL to 300 seconds - feeds refresh every 5 minutes',
  ],

  quickCheck: {
    question: 'Why pre-compute feeds (fan-out on write) instead of generating them on-demand (fan-out on read)?',
    options: [
      'It uses less memory',
      'Reads are 100x more frequent than writes - optimize for reads',
      'It\'s easier to implement',
      'Databases prefer it',
    ],
    correctIndex: 1,
    explanation: 'With 100:1 read-to-write ratio, it\'s worth doing expensive work at write time to make reads instant.',
  },

  keyConcepts: [
    { title: 'Social Graph Cache', explanation: 'Cache friend lists for fast lookups', icon: '🕸️' },
    { title: 'Feed Pre-Computation', explanation: 'Materialized view of user feeds', icon: '📰' },
    { title: 'Fan-out on Write', explanation: 'Push updates to all friends at write time', icon: '📡' },
  ],
};

const step4: GuidedStep = {
  id: 'multi-region-cache-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can view their feed (now with pre-computation!)',
    taskDescription: 'Add a Redis cache for social graph and feed pre-computation',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache friend lists and pre-computed feeds', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds)',
      'Cache strategy set (write-through for feed updates)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 300 seconds, strategy to write-through',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'write-through' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for Horizontal Scaling
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your app went viral! Traffic spiked 20x in one hour.",
  hook: "Your single app server is maxed out at 100% CPU. Users are getting 503 errors.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Can scale horizontally', after: '✓' },
  ],
  nextTeaser: "But we need to deploy to multiple regions for global users...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Prepare for Multi-Region',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

For multi-region deployments, load balancers operate at two levels:
1. **Regional**: Distribute traffic within a region
2. **Global**: Route users to their nearest region (we'll add this next)`,

  whyItMatters: 'At peak, you handle 1.7M requests/second globally. Load balancers are essential for distributing this load.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Handling 3 billion users globally',
    howTheyDoIt: 'Uses multi-tier load balancing: DNS-based global routing + regional load balancers + per-data center balancing',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Foundation for multi-region architecture',
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
    explanation: 'Load balancers detect unhealthy servers via health checks and automatically route traffic to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
  ],
};

const step5: GuidedStep = {
  id: 'multi-region-cache-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across multiple app servers', displayName: 'Load Balancer' },
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
// STEP 6: Add Database Replication for Multi-Region
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Tokyo are experiencing 500ms feed latencies!",
  hook: "Every request crosses the Pacific to your US data center. Network latency alone is 200ms.",
  challenge: "Enable database replication to support multi-region deployment.",
  illustration: 'global-latency',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is ready for multi-region!',
  achievement: 'Replicas enable regional read scaling and fault tolerance',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Regional read capacity', after: '3x per region' },
  ],
  nextTeaser: "But we still need regional caching for optimal performance...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Foundation for Multi-Region',
  conceptExplanation: `**Replication** copies your data to multiple database servers, enabling multi-region deployment.

For social platforms:
- **Primary (Leader)**: Handles all writes (single region for consistency)
- **Regional Replicas (Followers)**: Handle reads in each region
- **Replication Lag**: Acceptable for social feeds (eventual consistency)

Architecture:
- Writes always go to primary (e.g., US-East)
- Reads use nearest replica (Tokyo users → Tokyo replica)
- Replication lag: < 1 second is acceptable for feeds`,

  whyItMatters: 'Without regional replicas, Tokyo users would experience 200ms+ network latency just to reach the database.',

  famousIncident: {
    title: 'Facebook Cross-Region Replication Failure',
    company: 'Facebook',
    year: '2019',
    whatHappened: 'A configuration change caused cross-region database replication to fail. Users in some regions saw stale data for several hours while engineers fixed the issue.',
    lessonLearned: 'Test replication lag monitoring and failover procedures regularly. Have clear consistency guarantees.',
    icon: '🌐',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Global database replication',
    howTheyDoIt: 'Uses MySQL with async replication across 15+ data center regions. Replication lag typically < 1 second.',
  },

  diagram: `
Global Database Replication:

┌─────────────────┐
│  Primary (US)   │ ← All writes
└────────┬────────┘
         │ Async replication
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Replica│ │ Replica│ │Replica │ │Replica │
│ (EU)   │ │ (Asia) │ │(Brazil)│ │(India) │
│(reads) │ │(reads) │ │(reads) │ │(reads) │
└────────┘ └────────┘ └────────┘ └────────┘
`,

  keyPoints: [
    'Primary in one region handles all writes',
    'Regional replicas handle local reads',
    'Async replication: slight lag is acceptable',
    'Use at least 2 replicas per region for availability',
  ],

  quickCheck: {
    question: 'Why is eventual consistency (async replication) acceptable for social feeds?',
    options: [
      'It\'s not acceptable, we need strong consistency',
      'Seeing a friend\'s post 1 second late is acceptable for better performance',
      'It saves money',
      'Databases require it',
    ],
    correctIndex: 1,
    explanation: 'For social feeds, seeing updates within a few seconds is fine. This trade-off enables much better performance and scalability.',
  },

  keyConcepts: [
    { title: 'Primary-Replica', explanation: 'One writer, many regional readers', icon: '👑' },
    { title: 'Eventual Consistency', explanation: 'Updates propagate with small lag', icon: '⏱️' },
    { title: 'Regional Reads', explanation: 'Users read from nearest replica', icon: '🌍' },
  ],
};

const step6: GuidedStep = {
  id: 'multi-region-cache-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Global availability with low latency',
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
    level2: 'Enable replication and set replicas to 2. This creates regional read copies.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add CDN for Static Content Delivery
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📸',
  scenario: "Users are uploading profile pictures and post images!",
  hook: "Images are served from your app servers, adding load and latency for global users.",
  challenge: "Add a CDN to cache and deliver static content from edge locations worldwide.",
  illustration: 'cdn-needed',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Static content loads instantly worldwide!',
  achievement: 'CDN delivers images and assets from edge locations',
  metrics: [
    { label: 'Image load time (Tokyo)', before: '1500ms', after: '50ms' },
    { label: 'App server bandwidth', before: '100%', after: '10%' },
  ],
  nextTeaser: "But the infrastructure costs are too high...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: Global Edge Caching for Static Content',
  conceptExplanation: `A **CDN** (Content Delivery Network) caches static content at edge locations worldwide.

For social platforms, CDN caches:
- **Profile pictures** - Don't change often
- **Post images** - Popular images cached globally
- **Static assets** - CSS, JS, fonts

How it works:
1. User requests image → CDN edge (nearest location)
2. If cached: serve immediately (< 50ms)
3. If not cached: fetch from origin, cache it, serve to user

This offloads bandwidth from your app servers and reduces latency.`,

  whyItMatters: 'Without CDN, every image request would hit your servers. With 1.7M req/sec, that would overwhelm them.',

  famousIncident: {
    title: 'Cloudflare Outage Impact',
    company: 'Cloudflare',
    year: '2020',
    whatHappened: 'A Cloudflare outage took down thousands of websites that relied solely on CDN. Sites with proper origin fallback stayed partially available.',
    lessonLearned: 'CDN is critical but have fallback to origin servers. Don\'t make CDN a single point of failure.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving billions of images daily',
    howTheyDoIt: 'Uses custom CDN (Akamai-like) with thousands of edge locations. 99%+ cache hit rate for popular images.',
  },

  diagram: `
CDN Edge Caching:

User in Brazil:
                      ┌──────────────┐
┌──────┐    50ms     │ Brazil Edge  │
│ User │◀───────────▶│   (cached)   │
└──────┘             └──────────────┘
                            │ Cache miss?
                            ▼
                     ┌──────────────┐
                     │ Origin (US)  │
                     │ App Servers  │
                     └──────────────┘
`,

  keyPoints: [
    'CDN caches static content at edge locations',
    'Users get content from nearest edge (< 50ms)',
    'Offloads bandwidth from app servers',
    'Configure TTL based on content type (profile pics: 1 day, posts: 1 hour)',
  ],

  quickCheck: {
    question: 'Why cache profile pictures longer (1 day) than post images (1 hour)?',
    options: [
      'Profile pictures are smaller',
      'Profile pictures change rarely; posts are more dynamic',
      'It saves more money',
      'CDNs work better with longer TTLs',
    ],
    correctIndex: 1,
    explanation: 'Users rarely change profile pictures, so longer cache TTL is safe. Posts are more dynamic and may be deleted.',
  },

  keyConcepts: [
    { title: 'CDN', explanation: 'Global network of edge caches', icon: '🌐' },
    { title: 'Edge Location', explanation: 'Cache server close to users', icon: '📍' },
    { title: 'Cache TTL', explanation: 'How long content stays cached', icon: '⏰' },
  ],
};

const step7: GuidedStep = {
  id: 'multi-region-cache-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fast static content delivery',
    taskDescription: 'Add a CDN for global static content delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache and deliver images/assets from edge locations', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to App Server or Load Balancer',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a CDN component onto the canvas',
    level2: 'Connect CDN to Load Balancer or App Server as the origin',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'load_balancer' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization and Horizontal Scaling
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2M.",
  hook: "The CFO says: 'Cut costs by 30% or we're shutting down regions.'",
  challenge: "Optimize your architecture to stay under budget while maintaining global performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a global social platform!',
  achievement: 'Multi-region, highly cached, cost-optimized architecture',
  metrics: [
    { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
    { label: 'Global latency', after: 'p99 < 100ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Peak capacity', after: '1.7M req/sec' },
  ],
  nextTeaser: "You've mastered multi-region social cache design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Global Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for global social platforms:
1. **Aggressive caching** - 95%+ cache hit rate reduces DB costs
2. **Regional app server scaling** - Scale based on local traffic patterns
3. **CDN for bandwidth offload** - Reduce origin bandwidth charges
4. **Right-size replicas** - Not every region needs 3 replicas
5. **Feed pre-computation** - Do work once (write time) not repeatedly (read time)

For this platform:
- Cache hit rate > 95% is critical (100:1 read-to-write)
- Pre-compute feeds to avoid expensive DB queries
- Use CDN to offload 90%+ of bandwidth
- Scale app servers based on regional traffic patterns`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it globally.',

  famousIncident: {
    title: 'Twitter Pre-Computation Optimization',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'Twitter moved from fan-out-on-read to fan-out-on-write for most users. This reduced database load by 90% and improved performance, saving millions in infrastructure costs.',
    lessonLearned: 'For read-heavy systems, pre-computation (fan-out-on-write) is often worth the cost.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Running 3B users cost-effectively',
    howTheyDoIt: '95%+ cache hit rate, aggressive pre-computation, custom data centers, regional traffic-based scaling',
  },

  keyPoints: [
    'Cache aggressively - target 95%+ hit rate',
    'Pre-compute feeds to optimize for reads (100:1 ratio)',
    'Use CDN to offload bandwidth',
    'Right-size infrastructure per region',
    'Scale app servers based on actual demand',
  ],

  quickCheck: {
    question: 'With 100:1 read-to-write ratio, what\'s the most impactful cost optimization?',
    options: [
      'Reduce database size',
      'Achieve 95%+ cache hit rate to minimize expensive DB reads',
      'Use smaller app servers',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'With 100:1 ratio, 95% cache hit rate means only 5% of reads hit the database - massive cost savings.',
  },

  keyConcepts: [
    { title: 'Cache Hit Rate', explanation: 'Percentage of reads served from cache', icon: '🎯' },
    { title: 'Regional Scaling', explanation: 'Scale based on local traffic', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with global SLAs', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'multi-region-cache-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered globally within budget',
    taskDescription: 'Optimize system to stay under budget and scale app servers',
    successCriteria: [
      'Review all component configurations',
      'Set App Server instances to 3 or more for horizontal scaling',
      'Ensure cache hit rate optimizations are in place',
      'Verify multi-region architecture is cost-effective',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click App Server → Configuration → Set instances to 3 or more',
    level2: 'Review cache TTL and strategy. Ensure write-through is configured for feed pre-computation.',
    solutionComponents: [{ type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const multiRegionSocialCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'multi-region-social-cache',
  title: 'Design Multi-Region Social Cache',
  description: 'Build a globally distributed social platform with advanced caching strategies',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🌐',
    hook: "You've been hired as Principal Engineer at GlobalSocial Inc!",
    scenario: "Your mission: Build a social platform that serves 300 million users across the globe with consistently low latency using advanced caching strategies.",
    challenge: "Can you design a multi-region system with social graph caching, feed pre-computation, and regional consistency?",
  },

  requirementsPhase: multiRegionSocialCacheRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Social Graph Storage',
    'Database Persistence',
    'Social Graph Caching',
    'Feed Pre-Computation',
    'Fan-out on Write',
    'Load Balancing',
    'Multi-Region Replication',
    'Eventual Consistency',
    'CDN for Static Content',
    'Horizontal Scaling',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Fan-out problem and pre-computation',
    'Chapter 5: Multi-region replication',
    'Chapter 7: Eventual consistency models',
    'Chapter 9: Consistency guarantees',
  ],
};

export default multiRegionSocialCacheGuidedTutorial;
