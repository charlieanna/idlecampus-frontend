import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * LinkedIn Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a professional networking platform like LinkedIn.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, load balancer, queues, etc.)
 *
 * Key Concepts:
 * - Professional networking and connection graph
 * - News feed for professional content
 * - Job matching and recommendations
 * - Messaging between connections
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const linkedinRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a professional networking platform like LinkedIn",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Engineering Director at Professional Network Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the essential features users need in a professional networking platform?",
      answer: "Users want to:\n\n1. **Create and manage profiles** - Showcase their work experience, skills, and education\n2. **Connect with professionals** - Build their network by sending/accepting connection requests\n3. **View their feed** - See professional updates, articles, and posts from connections\n4. **Find and apply for jobs** - Browse job postings and submit applications",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "LinkedIn is about professional identity, networking, and career opportunities",
    },
    {
      id: 'connections',
      category: 'functional',
      question: "How does the connection system work?",
      answer: "Users send connection requests to other professionals. The recipient can accept or ignore. Once connected, users can:\n- See each other's updates in their feeds\n- Message each other directly\n- View 2nd and 3rd degree connections for networking",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "The connection graph is symmetric (mutual acceptance required) unlike Twitter's follow",
    },
    {
      id: 'feed-content',
      category: 'functional',
      question: "What appears in a user's professional feed?",
      answer: "The feed shows:\n1. **Posts from connections** - Updates, articles, career news\n2. **Job recommendations** - Based on skills and experience\n3. **Network updates** - New connections, job changes, work anniversaries\n4. **Promoted content** - Sponsored posts and articles",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "LinkedIn feed mixes social updates with career-focused content",
    },
    {
      id: 'job-platform',
      category: 'functional',
      question: "How does the job posting and application system work?",
      answer: "Companies can:\n- Post job openings with requirements\n- Search for candidates\n\nUsers can:\n- Search jobs by title, location, skills\n- Apply with their profile (acts as resume)\n- Track application status",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Job platform is a two-sided marketplace - requires matching algorithms",
    },
    {
      id: 'messaging',
      category: 'functional',
      question: "Can users message each other?",
      answer: "Yes, but only between connections (for basic/free accounts). Users can:\n- Send 1-on-1 messages\n- Share files and links\n- See read receipts\n\nFor the MVP, let's focus on basic text messaging between connections.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Messaging is gated by connections - reduces spam compared to open platforms",
    },
    {
      id: 'endorsements',
      category: 'clarification',
      question: "What about skills endorsements and recommendations?",
      answer: "Yes, but these are v2 features. For MVP:\n- Users can list skills on their profile\n- Job matching uses these skills\n\nEndorsements (validation from connections) and written recommendations can come later.",
      importance: 'nice-to-have',
      insight: "Skills are core to the platform, but social validation features can be deferred",
    },
    {
      id: 'company-pages',
      category: 'clarification',
      question: "Do we need company pages and employee listings?",
      answer: "For MVP, keep it simple:\n- Users can list their employer on their profile\n- Jobs are posted by companies\n\nFull company pages with followers and analytics are v2.",
      importance: 'nice-to-have',
      insight: "Company pages add complexity - focus on user profiles first",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "800 million registered users, with 300 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "LinkedIn is one of the largest professional networks globally",
    },
    {
      id: 'throughput-posts',
      category: 'throughput',
      question: "How many posts are created per day?",
      answer: "About 50 million posts/updates per day (includes shares, articles, status updates)",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 posts/sec",
        result: "~600 writes/sec (1,800 at peak)",
      },
      learningPoint: "Lower write volume than Twitter - professionals post less frequently",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many feed views per day?",
      answer: "About 6 billion feed views per day",
      importance: 'critical',
      calculation: {
        formula: "6B ÷ 86,400 sec = 69,444 reads/sec",
        result: "~70K reads/sec (200K at peak)",
      },
      learningPoint: "100:1 read-to-write ratio - caching is crucial!",
    },
    {
      id: 'job-applications',
      category: 'throughput',
      question: "How many job applications per day?",
      answer: "About 15 million job applications per day",
      importance: 'important',
      calculation: {
        formula: "15M ÷ 86,400 sec = 174 applications/sec",
        result: "~200 applications/sec (600 at peak)",
      },
      learningPoint: "Job applications are write-heavy operations with document attachments",
    },
    {
      id: 'connection-requests',
      category: 'burst',
      question: "What happens when a popular CEO joins and many people try to connect?",
      answer: "Thousands of connection requests could flood in within minutes. The system needs to:\n- Queue connection requests\n- Notify the user without overwhelming them\n- Update the connection graph incrementally",
      importance: 'important',
      insight: "Connection bursts are common when influencers join - need async processing",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the feed load?",
      answer: "p99 under 300ms for feed load. Professional users expect a fast experience but content quality matters more than Instagram-like speed.",
      importance: 'critical',
      learningPoint: "Feed latency target is slightly higher than consumer social apps",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should job and people search return results?",
      answer: "p99 under 500ms for search results. Users are doing career research - they'll tolerate slightly higher latency for better results.",
      importance: 'important',
      learningPoint: "Search quality matters more than ultra-low latency in professional context",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'connections', 'job-platform'],
  criticalFRQuestionIds: ['core-features', 'connections', 'feed-content'],
  criticalScaleQuestionIds: ['throughput-reads', 'throughput-users', 'latency-feed'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can create and manage profiles',
      description: 'Showcase work experience, skills, and education',
      emoji: '👤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can connect with professionals',
      description: 'Send/accept connection requests to build network',
      emoji: '🤝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can view their professional feed',
      description: 'See updates and content from connections',
      emoji: '📰',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can browse and apply for jobs',
      description: 'Search jobs and submit applications',
      emoji: '💼',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can message connections',
      description: 'Direct messaging between connected professionals',
      emoji: '💬',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '300 million',
    writesPerDay: '50 million posts + 15M job applications',
    readsPerDay: '6 billion feed views',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 579, peak: 1737 },
    calculatedReadRPS: { average: 69444, peak: 208332 },
    maxPayloadSize: '~2KB (post), ~5MB (resume)',
    storagePerRecord: '~1KB (post), ~10KB (profile)',
    storageGrowthPerYear: '~20TB (metadata)',
    redirectLatencySLA: 'p99 < 300ms (feed)',
    createLatencySLA: 'p99 < 500ms (post/application)',
  },

  architecturalImplications: [
    '✅ Read-heavy (100:1) → Aggressive caching for feeds and profiles',
    '✅ 200K reads/sec peak → Multiple app servers + load balancing',
    '✅ Connection graph → Graph database or optimized relational schema',
    '✅ Job matching → Search infrastructure (Elasticsearch)',
    '✅ Messaging → Real-time infrastructure (WebSockets or long polling)',
  ],

  outOfScope: [
    'Skills endorsements',
    'Written recommendations',
    'Company pages with analytics',
    'Learning platform (LinkedIn Learning)',
    'Premium features (InMail, advanced search)',
    'Multi-language support',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can create profiles, connect with others, and view their feed. The complexity of job matching, real-time messaging, and recommendation algorithms comes in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💼',
  scenario: "Welcome to Professional Network Inc! You're building the next LinkedIn.",
  hook: "Your first user just signed up - a software engineer looking to network with peers.",
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
  nextTeaser: "But the server is empty... let's write some code to handle profiles and connections!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens LinkedIn on their browser or mobile app:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t create profiles, connect with others, or view their feed.',

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling 300 million daily active users',
    howTheyDoIt: 'Started with a simple Java server in 2003, now uses a complex distributed system with thousands of services',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP/HTTPS = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'linkedin-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing LinkedIn', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles profiles, connections, feed, jobs', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle profiles yet!",
  hook: "A user just tried to create their profile but got an error.",
  challenge: "Write the Python code to handle profiles, connections, and feed.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle professional networking!',
  achievement: 'You implemented the core LinkedIn functionality',
  metrics: [
    { label: 'APIs implemented', after: '5' },
    { label: 'Can create profiles', after: '✓' },
    { label: 'Can connect', after: '✓' },
    { label: 'Can view feed', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all profiles and connections are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Professional Networking Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For LinkedIn, we need handlers for:
- \`create_profile()\` - Create/update user profile
- \`send_connection_request()\` - Send connection request
- \`accept_connection()\` - Accept connection request
- \`get_feed()\` - Fetch posts from connections
- \`post_update()\` - Share professional update

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the networking magic happens!',

  famousIncident: {
    title: 'The LinkedIn Outage of 2013',
    company: 'LinkedIn',
    year: '2013',
    whatHappened: 'A deployment issue caused LinkedIn to go down globally for 90 minutes. The root cause was a cascading failure in their API infrastructure.',
    lessonLearned: 'Start with simple, robust handlers. Build in circuit breakers and graceful degradation from day one.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling connection requests',
    howTheyDoIt: 'Uses async processing for connection requests to handle bursts when influencers join',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (user not found, already connected, etc.)',
  ],

  quickCheck: {
    question: 'Why are connection requests good candidates for async processing?',
    options: [
      'They take a long time to process',
      'Bursts of requests can overwhelm the system',
      'Users don\'t care about latency',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'When popular users join, thousands of connection requests can flood in. Async processing prevents system overload.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Connection Graph', explanation: 'Data structure representing user connections', icon: '🕸️' },
  ],
};

const step2: GuidedStep = {
  id: 'linkedin-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create profiles, FR-2: Connect with professionals, FR-3: View feed',
    taskDescription: 'Configure APIs and implement Python handlers for profiles, connections, and feed',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign profile, connection, and feed APIs',
      'Open the Python tab',
      'Implement handler functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for profile, connection, and feed handlers',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/profile', 'POST /api/v1/connections', 'GET /api/v1/feed'] } },
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
  hook: "When it came back online, ALL the profiles, connections, and jobs were GONE! 2 million users, vanished.",
  challenge: "Add a database so data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your professional data is safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But feed loading is getting slow as the network grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For LinkedIn, we need tables for:
- \`users\` - User profiles
- \`connections\` - The professional network graph
- \`posts\` - Feed updates and articles
- \`jobs\` - Job postings and applications`,

  whyItMatters: 'Imagine losing your entire professional network because of a server restart. Users would never trust your platform again!',

  famousIncident: {
    title: 'LinkedIn Password Breach',
    company: 'LinkedIn',
    year: '2012',
    whatHappened: '6.5 million hashed passwords were stolen and leaked online. LinkedIn had to force password resets for millions of users.',
    lessonLearned: 'Persistent storage with proper security (encryption, hashing, backups) is non-negotiable.',
    icon: '🔓',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Storing 800M user profiles',
    howTheyDoIt: 'Uses Espresso (their custom distributed database) and Voldemort (distributed key-value store) for different data types',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data like profiles',
    'Connection graph can use SQL with proper indexing',
    'Connect App Server to Database for read/write operations',
  ],

  quickCheck: {
    question: 'Why is the connection graph particularly important to store durably?',
    options: [
      'It\'s the largest table',
      'It\'s the most frequently queried',
      'It represents users\' professional relationships - losing it is catastrophic',
      'It changes the most often',
    ],
    correctIndex: 2,
    explanation: 'The connection graph is the core value of LinkedIn. Losing it means users lose their entire professional network.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'Connection Graph', explanation: 'Network of professional relationships', icon: '🕸️' },
  ],
};

const step3: GuidedStep = {
  id: 'linkedin-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store profiles, connections, posts, jobs permanently', displayName: 'PostgreSQL' },
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
  scenario: "You now have 5 million users, and feeds are loading in 3+ seconds!",
  hook: "Users are complaining: 'Why is my feed so slow?' Every feed read hits the database.",
  challenge: "Add a cache to make feed reads lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Feeds load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Feed latency', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what happens when traffic spikes during business hours?",
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

For LinkedIn, we cache:
- User feeds (pre-computed list of post IDs)
- User profiles (frequently viewed)
- Connection lists
- Job recommendations`,

  whyItMatters: 'At 200K reads/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'LinkedIn Feed Redesign',
    company: 'LinkedIn',
    year: '2016',
    whatHappened: 'LinkedIn redesigned their feed with algorithmic ranking. Initial version was too slow because they didn\'t cache recommendations properly. They had to roll back and optimize.',
    lessonLearned: 'Cache aggressively for read-heavy features. Test at scale before launch.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Serving 6 billion feed views per day',
    howTheyDoIt: 'Uses Couchbase and Redis clusters to cache pre-computed feeds and profiles',
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
    'Set TTL (Time To Live) to prevent stale data',
  ],

  quickCheck: {
    question: 'Why do we cache feeds rather than individual posts?',
    options: [
      'Feeds are smaller',
      'Feeds are requested more frequently than individual posts',
      'A user\'s feed is pre-computed and cached as a whole for faster retrieval',
      'Posts change too frequently',
    ],
    correctIndex: 2,
    explanation: 'Caching the entire feed for a user (list of post IDs) is more efficient than assembling it from individual posts on every request.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'linkedin-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Users can view their professional feed (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache feeds and profiles for fast reads', displayName: 'Redis Cache' },
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
  scenario: "Your single app server is maxed out at 100% CPU during business hours!",
  hook: "A viral job posting caused traffic to spike 5x. One server can't handle it all.",
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
- Sticky sessions: Same user always goes to same server (for stateful apps)`,

  whyItMatters: 'At peak, LinkedIn handles 200K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'LinkedIn Goes Public',
    company: 'LinkedIn',
    year: '2011',
    whatHappened: 'On IPO day, traffic surged as media coverage exploded. LinkedIn\'s infrastructure held strong thanks to proper load balancing and auto-scaling.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling 200K requests/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers with health checks and auto-scaling',
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
  id: 'linkedin-step-5',
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
  scenario: "Your database crashed for 30 minutes last night. EVERYTHING stopped.",
  hook: "Users couldn't access profiles, connections, or jobs. Revenue loss: $100,000.",
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

  whyItMatters: 'LinkedIn stores 800M professional profiles. Downtime is not acceptable for career-critical data.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. Their replication lag was too high, so backups were also affected. They lost 6 hours of data.',
    lessonLearned: 'Replication lag matters. Test your failover process regularly.',
    icon: '🗑️',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses Espresso with multi-datacenter replication. Each record is stored on multiple servers.',
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
  id: 'linkedin-step-6',
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
  hook: "Users are getting timeouts during business hours. Your load balancer has nowhere to route traffic.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 10x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Capacity', before: '20K req/s', after: '200K+ req/s' },
  ],
  nextTeaser: "But job search is getting slow as more jobs are posted...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For LinkedIn:
- Start with 3-5 app server instances
- Scale up during business hours (9am-5pm)
- Scale down during nights and weekends`,

  whyItMatters: 'At 200K requests/second, you need dozens of app servers working together.',

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs thousands of app server instances across multiple data centers. Auto-scales based on traffic patterns.',
  },

  famousIncident: {
    title: 'LinkedIn Endorsements Launch',
    company: 'LinkedIn',
    year: '2012',
    whatHappened: 'Skills endorsements were so popular that traffic spiked 100x on launch day. Auto-scaling saved the day.',
    lessonLearned: 'Design for horizontal scaling from day 1. New features can cause unexpected traffic.',
    icon: '👍',
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
  id: 'linkedin-step-7',
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
// STEP 8: Add Search with Elasticsearch
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users can't find jobs! Database queries for job search are timing out.",
  hook: "Searching through 10 million job postings with SQL LIKE queries is painfully slow.",
  challenge: "Add a search service to enable fast job and people search.",
  illustration: 'search-feature',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Job search is blazing fast!',
  achievement: 'Users can now find jobs and people instantly',
  metrics: [
    { label: 'Search latency', before: '5000ms', after: '<100ms' },
    { label: 'Searchable jobs', after: '10M+' },
  ],
  nextTeaser: "But messaging between connections isn't working yet...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Search: Full-Text Search with Elasticsearch',
  conceptExplanation: `Regular databases are bad at text search. Try finding jobs matching "senior engineer machine learning" in PostgreSQL - it's slow!

**Elasticsearch** is optimized for:
- Full-text search (find jobs by keywords)
- Fuzzy matching (typos still find results)
- Ranking (most relevant first)
- Faceted search (filter by location, experience, etc.)

Architecture:
- When a job is posted, index it in Elasticsearch
- Search queries go to Elasticsearch, not the database
- Keep the database as source of truth`,

  whyItMatters: 'Job search is THE killer feature of LinkedIn. Without fast search, users leave.',

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Searching 10M+ jobs',
    howTheyDoIt: 'Uses Galene (their custom search engine built on top of Lucene) for job and people search',
  },

  famousIncident: {
    title: 'Indeed Search Outage',
    company: 'Indeed',
    year: '2019',
    whatHappened: 'Indeed\'s job search went down for 3 hours during peak hiring season. Millions of job seekers couldn\'t search.',
    lessonLearned: 'Search infrastructure needs redundancy. It\'s too critical to have a single point of failure.',
    icon: '🚨',
  },

  diagram: `
┌────────────────────────────────────────────────────────────┐
│                       Job Posted                           │
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
      Store job data               Search queries
`,

  keyPoints: [
    'Elasticsearch is optimized for text search',
    'Index jobs and profiles when they\'re created/updated',
    'Search queries go to Elasticsearch, not database',
    'Database remains source of truth',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of database search for jobs?',
    options: [
      'It\'s free',
      'It\'s optimized for full-text search with ranking and relevance',
      'It stores more data',
      'It\'s easier to set up',
    ],
    correctIndex: 1,
    explanation: 'Databases do LIKE queries slowly. Elasticsearch is built for text search with inverted indexes and relevance scoring.',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Find documents by keywords', icon: '📄' },
    { title: 'Inverted Index', explanation: 'Map words to documents', icon: '📇' },
    { title: 'Relevance Scoring', explanation: 'Rank results by match quality', icon: '⭐' },
  ],
};

const step8: GuidedStep = {
  id: 'linkedin-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Users can browse and apply for jobs (with fast search!)',
    taskDescription: 'Add Elasticsearch for job and people search',
    componentsNeeded: [
      { type: 'search', reason: 'Enable full-text search of jobs and profiles', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search component (Elasticsearch) added',
      'App Server connected to Search',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Search (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search. Jobs and profiles will be indexed for search.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 9: Add Message Queue for Async Processing
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📬',
  scenario: "Connection requests are getting lost during peak traffic!",
  hook: "When 1000 people try to connect with a popular CEO, the synchronous processing times out.",
  challenge: "Add a message queue to handle connection requests and feed updates asynchronously.",
  illustration: 'queue-processing',
};

const step9Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Async processing is live!',
  achievement: 'Connection requests and feed updates handled reliably',
  metrics: [
    { label: 'Connection request latency', before: '5s', after: '<200ms' },
    { label: 'Dropped requests', before: '5%', after: '0%' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Processing at Scale',
  conceptExplanation: `Some operations don't need to complete immediately. **Message queues** enable async processing.

**Synchronous**: User sends connection request → Update DB → Notify recipient → Return ❌ (slow, can fail)
**Async with Queue**: User sends request → Add to queue → Return "Sent!" ✓
- Background workers process the queue
- Retries on failure
- Scales independently

For LinkedIn, we use queues for:
- Connection requests
- Feed updates (when someone posts)
- Email notifications
- Analytics events`,

  whyItMatters: 'Without async processing, bursts of activity (popular user joins, viral post) crash the system.',

  famousIncident: {
    title: 'LinkedIn Connection Storm',
    company: 'LinkedIn',
    year: '2014',
    whatHappened: 'A Fortune 500 CEO joined LinkedIn. Within an hour, 50,000+ connection requests flooded in. The async queue system handled it without breaking a sweat.',
    lessonLearned: 'Async processing with queues handles unpredictable bursts gracefully.',
    icon: '🌪️',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling connection requests and feed updates',
    howTheyDoIt: 'Uses Kafka for event streaming and async job processing',
  },

  diagram: `
User Sends Connection Request
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [req1, req2, req3, ...]           │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Request sent!"            ▼
                          ┌─────────────────┐
                          │     Workers     │
                          │ (background)    │
                          └────────┬────────┘
                                   │
                              Update DB & Notify
`,

  keyPoints: [
    'Message queue decouples request from processing',
    'User gets instant response - work happens in background',
    'Workers process queue in parallel for speed',
    'Retries handle transient failures',
  ],

  quickCheck: {
    question: 'Why do we use async processing for connection requests?',
    options: [
      'It\'s cheaper',
      'Users get instant response while processing happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the user doesn\'t wait. Their request is acknowledged instantly, and processing happens in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Async Processing', explanation: 'Work happens in background', icon: '🔄' },
  ],
};

const step9: GuidedStep = {
  id: 'linkedin-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-2: Connect with professionals (now with reliable async processing)',
    taskDescription: 'Add a Message Queue for async processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle connection requests and feed updates asynchronously', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async processing for connections and feed updates.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $850,000.",
  hook: "The CFO says: 'Cut costs by 30% or we're reducing features.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built LinkedIn!',
  achievement: 'A scalable, cost-effective professional networking platform',
  metrics: [
    { label: 'Monthly cost', before: '$850K', after: 'Under budget' },
    { label: 'Feed latency', after: '<300ms' },
    { label: 'Search latency', after: '<100ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '200K req/sec' },
  ],
  nextTeaser: "You've mastered LinkedIn system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use reserved instances** - 60% cheaper for predictable workloads
3. **Cache aggressively** - Reduce expensive database calls
4. **Auto-scale** - Scale down during nights and weekends
5. **Archive old data** - Move inactive profiles to cold storage

For LinkedIn:
- Business hours traffic is 5x higher than nights
- Cache job postings aggressively (they don't change often)
- Archive profiles inactive for 2+ years`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'LinkedIn Infrastructure Optimization',
    company: 'LinkedIn',
    year: '2015',
    whatHappened: 'LinkedIn reduced their infrastructure costs by 40% through aggressive caching, right-sizing, and moving to their own data centers.',
    lessonLearned: 'At scale, even small optimizations save millions.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Heavily optimizes resource usage. Uses own data centers where possible. Auto-scales aggressively based on time-of-day patterns.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure',
    'Use auto-scaling to match demand patterns',
    'Cache to reduce expensive operations',
    'Consider different storage tiers for hot/cold data',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a read-heavy system like LinkedIn?',
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
  id: 'linkedin-step-10',
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
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'app_server', toType: 'message_queue' },
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

export const linkedinGuidedTutorial: GuidedTutorial = {
  problemId: 'linkedin',
  title: 'Design LinkedIn',
  description: 'Build a professional networking platform with profiles, connections, jobs, and messaging',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '💼',
    hook: "You've been hired as Lead Engineer at Professional Network Inc!",
    scenario: "Your mission: Build a LinkedIn-like platform where professionals can network, find jobs, and advance their careers.",
    challenge: "Can you design a system that handles 300 million daily active users and 10 million job applications per day?",
  },

  requirementsPhase: linkedinRequirementsPhase,

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
    'Full-Text Search',
    'Message Queues',
    'Async Processing',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
  ],
};

export default linkedinGuidedTutorial;
