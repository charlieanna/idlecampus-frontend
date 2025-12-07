import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Twitter Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a microblogging platform like Twitter.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, fan-out, queues, etc.)
 *
 * Key Concepts:
 * - Fan-out problem (DDIA Ch. 1)
 * - Timeline generation strategies
 * - Real-time messaging
 * - Stream processing for trends
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const twitterRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a microblogging platform like Twitter",

  interviewer: {
    name: 'Marcus Johnson',
    role: 'Staff Engineer at Social Media Inc.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-tweet',
      category: 'functional',
      question: "What's the core thing users want to do on this platform?",
      answer: "Users want to:\n\n1. **Post tweets** - Share short messages (up to 280 characters) with the world\n2. **Read their timeline** - See tweets from people they follow, newest first\n3. **Engage with tweets** - Like, retweet, or reply to content they enjoy",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Twitter is about creating and consuming short-form content in real-time",
    },
    {
      id: 'follow-system',
      category: 'functional',
      question: "How do users decide whose tweets they see?",
      answer: "Users **follow** other users. When you follow someone, their tweets appear in your timeline. You can unfollow anytime. It's a one-way relationship - they don't need to follow you back.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "The follow graph is asymmetric - this affects how we fan-out tweets",
    },
    {
      id: 'search-discover',
      category: 'functional',
      question: "How do users find new content or people to follow?",
      answer: "Users can:\n1. **Search** for tweets by keyword or hashtag\n2. **Search** for users by name or handle\n3. **View trending topics** - popular hashtags right now",
      importance: 'important',
      revealsRequirement: 'FR-5, FR-6',
      learningPoint: "Search and trending require different infrastructure than the timeline",
    },
    {
      id: 'tweet-content',
      category: 'clarification',
      question: "Can tweets include media like images or videos?",
      answer: "Yes, tweets can include up to 4 images or 1 video. For the MVP, let's focus on text-only tweets. Media upload is a v2 feature that adds significant complexity.",
      importance: 'nice-to-have',
      insight: "Media changes storage requirements dramatically - good to defer initially",
    },
    {
      id: 'notifications',
      category: 'clarification',
      question: "Should users get notifications when someone likes or retweets their content?",
      answer: "Eventually yes, but for the MVP, let's focus on the core timeline experience. Notifications can be added later.",
      importance: 'nice-to-have',
      insight: "Notifications are a separate push system - good to scope out initially",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "500 million registered users, with 200 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "This is a massive scale - one of the largest social platforms",
    },
    {
      id: 'throughput-tweets',
      category: 'throughput',
      question: "How many tweets are posted per day?",
      answer: "About 500 million tweets per day",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 tweets/sec",
        result: "~6K writes/sec (18K at peak)",
      },
      learningPoint: "High write volume - but reads are even higher!",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many timeline views per day?",
      answer: "About 10 billion timeline views per day",
      importance: 'critical',
      calculation: {
        formula: "10B ÷ 86,400 sec = 115,740 reads/sec",
        result: "~116K reads/sec (350K at peak)",
      },
      learningPoint: "20:1 read-to-write ratio - timeline reads dominate!",
    },
    {
      id: 'celebrity-problem',
      category: 'burst',
      question: "What happens when a celebrity with 50 million followers tweets?",
      answer: "That single tweet needs to appear in 50 million timelines! This is the 'fan-out' problem - one of the hardest challenges in social media design.",
      importance: 'critical',
      insight: "The fan-out problem is THE key design challenge for Twitter",
    },
    {
      id: 'latency-timeline',
      category: 'latency',
      question: "How fast should the timeline load?",
      answer: "p99 under 200ms for timeline load. Users expect a snappy experience.",
      importance: 'critical',
      learningPoint: "Low latency at massive scale requires caching",
    },
    {
      id: 'latency-post',
      category: 'latency',
      question: "How quickly should a tweet appear in followers' timelines?",
      answer: "Within a few seconds for most users. For celebrities with millions of followers, up to 30 seconds is acceptable.",
      importance: 'important',
      learningPoint: "This is 'fan-out latency' - different from request/response latency",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-tweet', 'follow-system', 'celebrity-problem'],
  criticalFRQuestionIds: ['core-tweet', 'follow-system'],
  criticalScaleQuestionIds: ['throughput-reads', 'celebrity-problem', 'latency-timeline'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can post tweets',
      description: 'Share short messages (up to 280 characters) instantly',
      emoji: '✍️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view their timeline',
      description: 'See tweets from followed users, newest first',
      emoji: '📰',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can engage with tweets',
      description: 'Like, retweet, or reply to any tweet',
      emoji: '❤️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can follow/unfollow',
      description: 'Manage who appears in your timeline',
      emoji: '👥',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can search',
      description: 'Find tweets and users by keyword',
      emoji: '🔍',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users can see trending topics',
      description: 'View what hashtags are popular right now',
      emoji: '📈',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '200 million',
    writesPerDay: '500 million tweets',
    readsPerDay: '10 billion timeline views',
    peakMultiplier: 3,
    readWriteRatio: '20:1',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 115740, peak: 347220 },
    maxPayloadSize: '~1KB (tweet)',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~90TB',
    redirectLatencySLA: 'p99 < 200ms (timeline)',
    createLatencySLA: 'p99 < 500ms (post)',
  },

  architecturalImplications: [
    '✅ Read-heavy (20:1) → Caching is CRITICAL for timelines',
    '✅ 350K reads/sec peak → Need many app servers + load balancing',
    '✅ Celebrity fan-out problem → Need async processing (message queue)',
    '✅ 500M tweets/day → Database partitioning needed',
    '✅ Real-time trending → Stream processing required',
  ],

  outOfScope: [
    'Media uploads (images/videos)',
    'Direct messages',
    'Push notifications',
    'Multi-region deployment',
    'Tweet threads/conversations',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can post and read tweets. The famous 'fan-out' problem and scaling challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🐦',
  scenario: "Welcome to Social Media Inc! You've been hired to build the next Twitter.",
  hook: "Your first user just signed up. They're ready to post their first tweet!",
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
  nextTeaser: "But the server is empty... let's write some code to handle tweets!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens the Twitter app or website:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t interact with your system at all.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling 500 million tweets per day',
    howTheyDoIt: 'Started with a simple Rails server in 2006, now uses a complex distributed system',
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
  id: 'twitter-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Twitter', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles tweet posting and reading', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle tweets yet!",
  hook: "A user just tried to post 'Hello, Twitter!' but got an error.",
  challenge: "Write the Python code to post tweets and read timelines.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle tweets!',
  achievement: 'You implemented the core Twitter functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can post tweets', after: '✓' },
    { label: 'Can read timeline', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all tweets are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Tweet Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Twitter, we need handlers for:
- \`post_tweet()\` - Create a new tweet
- \`get_timeline()\` - Fetch tweets from followed users
- \`follow_user()\` - Add someone to your follow list
- \`like_tweet()\` - Like a tweet

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'The Fail Whale Era',
    company: 'Twitter',
    year: '2008-2010',
    whatHappened: 'Twitter\'s simple Ruby handlers couldn\'t keep up with traffic. Users saw the "Fail Whale" error page constantly during peak times.',
    lessonLearned: 'Start simple, but design for growth. The handlers we write today will evolve.',
    icon: '🐋',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Posting a tweet',
    howTheyDoIt: 'Their Tweet Service handles ~6,000 tweets/second, using async processing for fan-out',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (user not found, empty tweet, etc.)',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory never fails',
      'Databases are expensive',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Database adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'CRUD', explanation: 'Create, Read, Update, Delete operations', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'twitter-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can post tweets, FR-2: Users can view timeline',
    taskDescription: 'Configure APIs and implement Python handlers for tweeting and timeline',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/tweets and GET /api/v1/timeline APIs',
      'Open the Python tab',
      'Implement post_tweet() and get_timeline() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for post_tweet and get_timeline',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/tweets', 'GET /api/v1/timeline'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted...",
  hook: "When it came back online, ALL the tweets were GONE! 500,000 tweets, vanished.",
  challenge: "Add a database so data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your tweets are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But reading timelines is getting slow as we grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Twitter, we need tables for:
- \`users\` - User accounts
- \`tweets\` - All posted tweets
- \`follows\` - Who follows whom
- \`likes\` - Tweet likes`,

  whyItMatters: 'Imagine losing ALL your tweets because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'MySpace Data Loss',
    company: 'MySpace',
    year: '2019',
    whatHappened: 'During a server migration, MySpace lost 12 years of user-uploaded music - over 50 million songs, gone forever.',
    lessonLearned: 'Persistent storage with proper backups is non-negotiable.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Storing 500 million tweets per day',
    howTheyDoIt: 'Uses Manhattan (their custom distributed database) partitioned by tweet_id for horizontal scaling',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data like tweets',
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
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'twitter-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store tweets, users, follows, likes permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Timeline Reads
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million users, and timelines are loading in 2+ seconds!",
  hook: "Users are complaining: 'Why is Twitter so slow?' Every timeline read hits the database.",
  challenge: "Add a cache to make timeline reads lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Timelines load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Timeline latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But what happens when a celebrity tweets to 10 million followers?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Twitter, we cache:
- User timelines (pre-computed list of tweet IDs)
- Popular tweets
- User profiles`,

  whyItMatters: 'At 350K reads/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Facebook Cache Stampede',
    company: 'Facebook',
    year: '2010',
    whatHappened: 'When memcached servers restarted, millions of requests simultaneously hit the database, causing a cascading failure that took down the site.',
    lessonLearned: 'Cache warming and graceful degradation are essential. Never let all caches expire at once.',
    icon: '🏃',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Serving 10 billion timeline views per day',
    howTheyDoIt: 'Uses Redis clusters to cache pre-computed timelines. Most timeline reads never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
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
  id: 'twitter-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can view their timeline (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache timelines for fast reads', displayName: 'Redis Cache' },
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
  hook: "A trending topic caused traffic to spike 5x. One server can't handle it all.",
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
- IP hash: Same user always goes to same server`,

  whyItMatters: 'At peak, Twitter handles 350K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Twitter Goes to the Super Bowl',
    company: 'Twitter',
    year: '2013',
    whatHappened: 'During the Super Bowl blackout, Twitter traffic spiked 10x in seconds. Their load balancers automatically distributed traffic, keeping the site alive.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling 350K requests/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers (DNS, L4, L7) to distribute traffic globally',
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
  id: 'twitter-step-5',
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
  scenario: "Your database crashed for 5 minutes last night. EVERYTHING stopped.",
  hook: "Users couldn't post, read, or do anything. Revenue loss: $50,000.",
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

  whyItMatters: 'A single database is a single point of failure. For Twitter\'s 500M tweets/day, downtime is not acceptable.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. Their replication lag was too high, so backups were also affected. They lost 6 hours of data.',
    lessonLearned: 'Replication lag matters. Test your failover process regularly.',
    icon: '🗑️',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses Manhattan with 3-way replication. Each tweet is stored on 3 different servers in different racks.',
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
  id: 'twitter-step-6',
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
  scenario: "Traffic has grown 10x. One app server can't keep up!",
  hook: "Users are getting timeouts. Your load balancer has nowhere to route traffic.",
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
  nextTeaser: "But celebrity tweets are still slow to fan out...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Twitter:
- Start with 2-3 app server instances
- Scale up during peak times
- Scale down during quiet periods`,

  whyItMatters: 'At 350K requests/second, you need 10+ app servers just for timeline reads.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs thousands of app server instances across multiple data centers. Auto-scales based on traffic.',
  },

  famousIncident: {
    title: 'Pokémon GO Launch',
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
  id: 'twitter-step-7',
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
// STEP 8: Add Message Queue for Fan-Out
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌟',
  scenario: "A celebrity with 50 million followers just tweeted!",
  hook: "Updating 50 million timelines synchronously would take hours. Users see delays.",
  challenge: "Add a message queue to handle fan-out asynchronously.",
  illustration: 'celebrity-tweet',
};

const step8Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Fan-out is now lightning fast!',
  achievement: 'Async processing handles celebrity tweets efficiently',
  metrics: [
    { label: 'Tweet post latency', before: '10s', after: '<500ms' },
    { label: 'Fan-out time', after: '<5s for 99% of users' },
  ],
  nextTeaser: "But we need search functionality...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: The Fan-Out Solution',
  conceptExplanation: `The **fan-out problem** is Twitter's biggest challenge:
- When you tweet, it needs to appear in every follower's timeline
- A celebrity with 50M followers = 50M timeline updates

**Synchronous**: Tweet → Update 50M timelines → Return "Posted!" ❌ (too slow)
**Async with Queue**: Tweet → Add to queue → Return "Posted!" ✓
- Background workers process the queue
- Update timelines in parallel

This is the **fan-out on write** approach from DDIA Chapter 1.`,

  whyItMatters: 'Without async processing, posting a tweet would timeout for popular accounts.',

  famousIncident: {
    title: 'Lady Gaga Breaks Twitter',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'When Lady Gaga tweeted to her 20 million followers, the synchronous fan-out caused cascading failures. Site went down for 20 minutes.',
    lessonLearned: 'This incident led Twitter to implement their async fan-out system.',
    icon: '👸',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Fan-out for 500M tweets/day',
    howTheyDoIt: 'Uses Kafka for event streaming. When you tweet, it goes to a "tweets" topic. Thousands of workers consume and update timelines.',
  },

  diagram: `
User Posts Tweet
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [tweet1, tweet2, tweet3, ...]      │
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
        │Timeline │          │Timeline │          │Timeline │
        │  Cache  │          │  Cache  │          │  Cache  │
        └─────────┘          └─────────┘          └─────────┘
`,

  keyPoints: [
    'Message queue decouples tweet posting from timeline updates',
    'User gets instant response - fan-out happens in background',
    'Workers process queue in parallel for speed',
    'For celebrities: use "fan-out on read" hybrid approach',
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
    explanation: 'Async means the user doesn\'t wait. Their tweet is posted instantly, and timeline updates happen in the background.',
  },

  keyConcepts: [
    { title: 'Fan-Out', explanation: 'Distributing one tweet to many timelines', icon: '📡' },
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
  ],
};

const step8: GuidedStep = {
  id: 'twitter-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can post tweets (now with fast fan-out)',
    taskDescription: 'Add a Message Queue for async fan-out processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle tweet fan-out asynchronously', displayName: 'Kafka' },
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
// STEP 9: Add Search with Elasticsearch
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are asking: 'How do I find tweets about a topic?'",
  hook: "There's no way to search! Users can only see their timeline, not discover new content.",
  challenge: "Add a search service to enable tweet and user search.",
  illustration: 'search-feature',
};

const step9Celebration: CelebrationContent = {
  emoji: '🔎',
  message: 'Search is live!',
  achievement: 'Users can now find tweets and users by keyword',
  metrics: [
    { label: 'Search latency', after: '<100ms' },
    { label: 'Searchable tweets', after: 'All 500M+' },
  ],
  nextTeaser: "But we\'re over budget...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Search: Full-Text Search with Elasticsearch',
  conceptExplanation: `Regular databases are bad at text search. Try finding all tweets containing "cat" in PostgreSQL - it's slow!

**Elasticsearch** is optimized for:
- Full-text search (find tweets by keywords)
- Fuzzy matching (typos still find results)
- Ranking (most relevant first)
- Real-time indexing (new tweets searchable instantly)

Architecture:
- When a tweet is posted, index it in Elasticsearch
- Search queries go to Elasticsearch, not the database
- Keep the database as source of truth`,

  whyItMatters: 'Search is how users discover new content. Without it, Twitter is just a closed timeline.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Searching 500M+ tweets',
    howTheyDoIt: 'Uses Earlybird (custom search system) indexing all tweets in real-time. Search results in <100ms.',
  },

  famousIncident: {
    title: 'Google Real-Time Search Shutdown',
    company: 'Google',
    year: '2011',
    whatHappened: 'Google had a deal with Twitter for real-time search. When it ended, Google lost access to billions of tweets. Showed how valuable tweet search is.',
    lessonLearned: 'Search is a core feature, not an add-on. Build it yourself.',
    icon: '🔇',
  },

  diagram: `
┌────────────────────────────────────────────────────────────┐
│                       Tweet Posted                          │
└────────────────────────────┬───────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
      ┌───────────────┐              ┌───────────────┐
      │   Database    │              │ Elasticsearch │
      │ (source of    │              │  (search      │
      │    truth)     │              │   index)      │
      └───────────────┘              └───────────────┘
              │                              │
              │                              │
              ▼                              ▼
      Timeline reads                  Search queries
`,

  keyPoints: [
    'Elasticsearch is optimized for text search',
    'Index tweets when they\'re created',
    'Search queries go to Elasticsearch, not database',
    'Database remains source of truth',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of database search?',
    options: [
      'It\'s free',
      'It\'s optimized for full-text search with ranking and fuzzy matching',
      'It stores more data',
      'It\'s easier to set up',
    ],
    correctIndex: 1,
    explanation: 'Databases do LIKE queries slowly. Elasticsearch is built for text search with inverted indexes.',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Find documents by keywords', icon: '📄' },
    { title: 'Inverted Index', explanation: 'Map words to documents', icon: '📇' },
    { title: 'Real-Time Indexing', explanation: 'New content searchable instantly', icon: '⏱️' },
  ],
};

const step9: GuidedStep = {
  id: 'twitter-step-9',
  stepNumber: 9,
  frIndex: 4,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-5: Users can search for tweets and users',
    taskDescription: 'Add Elasticsearch for search functionality',
    componentsNeeded: [
      { type: 'search', reason: 'Enable full-text search of tweets and users', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search component (Elasticsearch) added',
      'App Server connected to Search',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Search (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search. Tweets will be indexed for search.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $750,000.",
  hook: "The CFO says: 'Cut costs by 30% or we're shutting down features.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Twitter!',
  achievement: 'A scalable, cost-effective microblogging platform',
  metrics: [
    { label: 'Monthly cost', before: '$750K', after: 'Under budget' },
    { label: 'Timeline latency', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '350K req/sec' },
  ],
  nextTeaser: "You've mastered Twitter system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use spot/preemptible instances** - 60-90% cheaper for stateless workers
3. **Cache aggressively** - Reduce expensive database calls
4. **Auto-scale** - Scale down during low traffic
5. **Choose the right storage tier** - Hot vs cold data

For Twitter:
- Archive old tweets to cheaper storage
- Use smaller cache for less popular users
- Scale down at night when traffic is low`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Dropbox Saves $75M',
    company: 'Dropbox',
    year: '2017',
    whatHappened: 'Moved from AWS to own data centers. Saved $75M in two years by optimizing infrastructure.',
    lessonLearned: 'At scale, even small optimizations save millions.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Running at scale',
    howTheyDoIt: 'Heavily optimizes resource usage. Uses their own data centers where possible. Auto-scales aggressively.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure',
    'Use auto-scaling to match demand',
    'Cache to reduce expensive operations',
    'Consider different storage tiers for hot/cold data',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a read-heavy system?',
    options: [
      'Use bigger servers',
      'Aggressive caching to reduce database calls',
      'Delete old data',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Caching is often the most cost-effective optimization. Cache hits are cheap; database queries are expensive.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'twitter-step-10',
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
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'search' },
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

export const twitterGuidedTutorial: GuidedTutorial = {
  problemId: 'twitter',
  title: 'Design Twitter',
  description: 'Build a microblogging platform with timelines, follow, and search',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🐦',
    hook: "You've been hired as Lead Engineer at Social Media Inc!",
    scenario: "Your mission: Build a Twitter-like platform that can handle millions of users posting and reading tweets in real-time.",
    challenge: "Can you design a system that handles the famous 'fan-out' problem?",
  },

  requirementsPhase: twitterRequirementsPhase,

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
    'Message Queues',
    'Fan-out Problem',
    'Full-Text Search',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Fan-out problem',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
  ],
};

export default twitterGuidedTutorial;
