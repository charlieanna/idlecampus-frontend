import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Medium Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a blogging platform like Medium.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, CDN, search, etc.)
 *
 * Key Concepts:
 * - Content delivery (articles, rich media)
 * - Personalized feed generation
 * - Full-text search
 * - Reading analytics
 * - Claps/highlights interaction
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const mediumRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a blogging platform like Medium",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Engineering Manager at Content Platform Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the core features users expect from a blogging platform?",
      answer: "Users want to:\n\n1. **Write and publish articles** - Create rich content with text, images, and formatting\n2. **Read articles** - Discover and consume content from various authors\n3. **Follow authors** - Build a personalized reading list\n4. **Engage with content** - Clap for articles, highlight passages, and leave comments\n5. **Curate reading lists** - Save articles to read later",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "Medium focuses on long-form content and reader experience",
    },
    {
      id: 'article-publishing',
      category: 'functional',
      question: "What happens when an author publishes an article?",
      answer: "The author writes content in a rich text editor, adds images/media, and hits publish. The article should appear in their followers' feeds immediately and be searchable within seconds.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Articles are larger payloads than tweets - can be 50KB+ of text plus images",
    },
    {
      id: 'feed-generation',
      category: 'functional',
      question: "How should a user's personalized feed be generated?",
      answer: "The feed shows articles from:\n1. Authors the user follows (chronological)\n2. Recommended articles based on reading history\n3. Trending articles in topics they're interested in\n\nFor MVP, let's focus on chronological feed from followed authors.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Personalized feeds require tracking user interests and behavior",
    },
    {
      id: 'claps-highlights',
      category: 'functional',
      question: "How do claps and highlights work differently from simple likes?",
      answer: "**Claps**: Users can clap multiple times (up to 50) for the same article - shows degree of appreciation. **Highlights**: Users can select and save specific text passages. Both are unique to Medium's engagement model.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Claps require counting (not just boolean), highlights need text ranges",
    },
    {
      id: 'reading-lists',
      category: 'functional',
      question: "What are reading lists and how do they work?",
      answer: "Users can bookmark articles to 'reading lists' (like folders). They can create multiple lists: 'Read Later', 'Favorites', custom topics, etc. This helps users organize their saved content.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Reading lists are essentially user-created collections with many-to-many relationships",
    },
    {
      id: 'rich-content',
      category: 'clarification',
      question: "What types of media can articles contain?",
      answer: "Articles can include text, images, embedded videos, code blocks, and quotes. For MVP, let's focus on text and images. Complex embeds (YouTube, Twitter, etc.) can be v2.",
      importance: 'important',
      insight: "Rich media increases storage and bandwidth requirements significantly",
    },
    {
      id: 'publications',
      category: 'clarification',
      question: "Should we support publications (multi-author blogs)?",
      answer: "Publications are important but complex - they involve permissions, editorial workflows, and branding. Let's defer to v2 and focus on individual authors first.",
      importance: 'nice-to-have',
      insight: "Publications add team management complexity - good to scope out initially",
    },
    {
      id: 'paywall',
      category: 'clarification',
      question: "Do we need to support paywalled content and subscriptions?",
      answer: "Eventually yes, but for MVP, all content is free to read. Monetization is a separate system we can add later.",
      importance: 'nice-to-have',
      insight: "Paywalls require payment processing and access control - scope out for now",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "100 million registered users, with 30 million monthly active readers (MAU), and 1 million active writers",
      importance: 'critical',
      learningPoint: "Read-heavy platform - most users consume, few create",
    },
    {
      id: 'throughput-articles',
      category: 'throughput',
      question: "How many articles are published per day?",
      answer: "About 50,000 new articles per day",
      importance: 'critical',
      calculation: {
        formula: "50K ÷ 86,400 sec = 0.58 articles/sec",
        result: "~1 article/sec (3 at peak)",
      },
      learningPoint: "Low write volume compared to Twitter - quality over quantity",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many article reads per day?",
      answer: "About 500 million article views per day",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 reads/sec",
        result: "~6K reads/sec (18K at peak)",
      },
      learningPoint: "500,000:1 read-to-write ratio - extremely read-heavy!",
    },
    {
      id: 'payload-size',
      category: 'payload',
      question: "What's the average article size?",
      answer: "Average article: ~50KB text + 5 images (~500KB total). Max article size: 2MB.",
      importance: 'important',
      calculation: {
        formula: "50K articles × 500KB = 25TB/day new storage",
        result: "~9PB/year storage growth",
      },
      learningPoint: "Much larger payloads than tweets - need CDN for media",
    },
    {
      id: 'latency-read',
      category: 'latency',
      question: "How fast should articles load?",
      answer: "p99 under 300ms for article content (text), images can lazy load. Reading experience must feel snappy.",
      importance: 'critical',
      learningPoint: "Text content should be immediate, images progressive",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results appear?",
      answer: "p99 under 200ms for search results. Users expect instant feedback as they type.",
      importance: 'important',
      learningPoint: "Search is critical for content discovery - must be fast",
    },
    {
      id: 'viral-article',
      category: 'burst',
      question: "What happens when an article goes viral?",
      answer: "A viral article can get 100K+ reads in an hour. The system must handle sudden traffic spikes without degrading performance for other articles.",
      importance: 'important',
      insight: "Hot content needs aggressive caching - CDN is essential",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'article-publishing', 'feed-generation'],
  criticalFRQuestionIds: ['core-features', 'article-publishing'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-read', 'payload-size'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Authors can publish articles',
      description: 'Write and publish rich content with text and images',
      emoji: '✍️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can read personalized feed',
      description: 'See articles from followed authors, newest first',
      emoji: '📰',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can follow authors',
      description: 'Build a personalized reading experience',
      emoji: '👥',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can clap and highlight',
      description: 'Engage with articles through claps and text highlights',
      emoji: '👏',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can manage reading lists',
      description: 'Save and organize articles for later',
      emoji: '📚',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users can search articles',
      description: 'Find content by keyword, author, or topic',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '30 million monthly',
    writesPerDay: '50,000 articles',
    readsPerDay: '500 million views',
    peakMultiplier: 3,
    readWriteRatio: '500,000:1',
    calculatedWriteRPS: { average: 0.58, peak: 1.74 },
    calculatedReadRPS: { average: 5787, peak: 17361 },
    maxPayloadSize: '~2MB (article with images)',
    storagePerRecord: '~500KB average',
    storageGrowthPerYear: '~9PB',
    redirectLatencySLA: 'p99 < 300ms (article)',
    createLatencySLA: 'p99 < 1s (publish)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (500K:1) → Aggressive caching at ALL layers',
    '✅ Large content payloads → CDN required for media delivery',
    '✅ 18K reads/sec peak → Multiple app servers + load balancing',
    '✅ Full-text search → Dedicated search service (Elasticsearch)',
    '✅ Viral articles → CDN caching to handle traffic spikes',
  ],

  outOfScope: [
    'Publications (multi-author blogs)',
    'Paywalled content and subscriptions',
    'Complex embeds (YouTube, Twitter)',
    'Editorial workflows',
    'Push notifications',
    'Email newsletters',
  ],

  keyInsight: "First, let's make it WORK. We'll build a system where authors can publish and readers can discover articles. Personalization, search, and scaling challenges come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📝',
  scenario: "Welcome to Content Platform Inc! You're building the next Medium.",
  hook: "Your first author is ready to publish their inaugural post!",
  challenge: "Set up the basic connection so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Users can now connect to your publishing platform',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle articles yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every content platform starts with a **Client** connecting to a **Server**.

When a user opens Medium:
1. Their browser or app (Client) sends HTTP requests
2. Your App Server processes these requests
3. The server sends back responses (articles, feeds, etc.)

This simple pattern scales to millions of users with the right architecture!`,

  whyItMatters: 'Without this connection, no one can read or write on your platform.',

  realWorldExample: {
    company: 'Medium',
    scenario: 'Serving 30 million monthly readers',
    howTheyDoIt: 'Started with a Node.js server in 2012, now uses a distributed system across multiple data centers',
  },

  keyPoints: [
    'Client = the user\'s browser or mobile app',
    'App Server = your backend that handles article requests',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '💻' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'medium-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents readers and writers accessing Medium', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles article publishing and reading', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle articles!",
  hook: "An author just tried to publish 'Hello, Medium!' but got a 500 error.",
  challenge: "Write the Python code to publish articles and serve the feed.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle articles!',
  achievement: 'You implemented core Medium functionality',
  metrics: [
    { label: 'APIs implemented', after: '5' },
    { label: 'Can publish articles', after: '✓' },
    { label: 'Can read feed', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all articles disappear...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Article Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For Medium, we need handlers for:
- \`publish_article()\` - Create and publish new articles
- \`get_feed()\` - Fetch personalized article feed
- \`get_article()\` - Retrieve a specific article
- \`follow_author()\` - Follow an author
- \`clap_article()\` - Add claps to an article

For now, we'll store everything in memory (Python dictionaries). The database comes next!`,

  whyItMatters: 'These handlers are the core logic of your publishing platform. Get them right!',

  famousIncident: {
    title: 'Medium\'s Transition from Collections',
    company: 'Medium',
    year: '2017',
    whatHappened: 'Medium changed how content was organized from "Collections" to "Publications". The API changes were rolled out carefully to avoid breaking existing content.',
    lessonLearned: 'API design matters. Changes are hard once you have users. Start simple but think ahead.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Medium',
    scenario: 'Handling 50K article publications per day',
    howTheyDoIt: 'Uses Node.js services with async processing for publishing workflow, including image upload and text processing',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Articles are larger than tweets - need to handle bigger payloads',
    'Claps require counting, not just boolean flags',
  ],

  quickCheck: {
    question: 'Why do we start with in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory is more reliable',
      'Databases can\'t store articles',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Adding a database adds complexity, so we\'ll add it in Step 3 once the basic logic works.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Rich Content', explanation: 'Articles with text, images, formatting', icon: '📄' },
  ],
};

const step2: GuidedStep = {
  id: 'medium-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Authors can publish articles, FR-2: Users can read feed',
    taskDescription: 'Configure APIs and implement Python handlers for publishing and reading',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/articles and GET /api/v1/feed APIs',
      'Open the Python tab',
      'Implement publish_article() and get_feed() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for publish_article and get_feed',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/articles', 'GET /api/v1/feed'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes at 2 AM. Your server crashed during a deployment...",
  hook: "When it restarted, 10,000 articles - weeks of authors' work - GONE.",
  challenge: "Add a database so articles are never lost.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Articles are now permanent!',
  achievement: 'Data persists forever, even through crashes',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But loading articles is getting slow as we grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Articles survive crashes and restarts
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Medium, we need tables for:
- \`users\` - Reader and author accounts
- \`articles\` - Published content (text, metadata)
- \`follows\` - Who follows which authors
- \`claps\` - Article claps (with counts)
- \`highlights\` - Saved text selections
- \`reading_lists\` - User-created collections`,

  whyItMatters: 'Authors trust you with their creative work. Losing articles would destroy your platform\'s reputation.',

  famousIncident: {
    title: 'The Ma.tt Blog Post Loss',
    company: 'WordPress.com',
    year: '2011',
    whatHappened: 'A database corruption issue caused some blog posts to be lost. Even with backups, some recent content couldn\'t be recovered.',
    lessonLearned: 'Persistent storage with proper replication is non-negotiable for content platforms.',
    icon: '📝',
  },

  realWorldExample: {
    company: 'Medium',
    scenario: 'Storing millions of articles',
    howTheyDoIt: 'Uses DynamoDB for scalable NoSQL storage, with PostgreSQL for relational data like user follows',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data like articles',
    'Connect App Server to Database for read/write operations',
    'Articles can be 50KB+ - database must handle large text fields',
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
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory disappears forever.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'medium-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store articles, users, follows, claps permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Article Reads
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million articles, and popular ones take 2 seconds to load!",
  hook: "Every article request hits the database. With 6K reads/sec, it's overwhelmed.",
  challenge: "Add a cache to make article reads lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Articles load 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Article latency', before: '2000ms', after: '50ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what happens when an article goes viral?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Essential for Read-Heavy Systems',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Medium has a 500,000:1 read-to-write ratio - caching is CRITICAL!

**Cache-Aside Pattern**:
1. Check cache first
2. If miss → fetch from database
3. Store in cache for next time

For Medium, we cache:
- Popular articles (full text)
- User feeds (list of article IDs)
- Author profiles
- Clap counts`,

  whyItMatters: 'At 18K reads/sec peak, hitting the database for every request would cost thousands in infrastructure and add latency.',

  famousIncident: {
    title: 'Reddit\'s Cache Stampede',
    company: 'Reddit',
    year: '2010',
    whatHappened: 'When their cache layer went down, all requests hit the database simultaneously. Cascading failures took down the entire site for hours.',
    lessonLearned: 'Cache warming and graceful degradation are essential. Never let all caches expire at once.',
    icon: '🏃',
  },

  realWorldExample: {
    company: 'Medium',
    scenario: 'Serving 500 million article views per day',
    howTheyDoIt: 'Uses Redis clusters to cache articles and feeds. Popular articles are cached at multiple layers.',
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
    'Set TTL (Time To Live) for article caching',
    'Invalidate cache when article is updated',
  ],

  quickCheck: {
    question: 'With a 500,000:1 read-write ratio, what should we cache aggressively?',
    options: [
      'Nothing - databases are fast enough',
      'Only the homepage',
      'Articles, feeds, and user profiles',
      'Only images',
    ],
    correctIndex: 2,
    explanation: 'With extreme read-heaviness, cache everything that\'s read frequently. Articles, feeds, and profiles are read far more than written.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'medium-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can read feed (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache articles and feeds for fast reads', displayName: 'Redis Cache' },
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
  scenario: "A viral article just hit the front page of Hacker News!",
  hook: "Your single app server is at 100% CPU. Requests are timing out.",
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
- Sticky sessions: Same user always goes to same server`,

  whyItMatters: 'At peak, Medium handles 18K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Medium\'s AWS Outage',
    company: 'Medium',
    year: '2017',
    whatHappened: 'An AWS S3 outage in US-East took down many sites. Medium stayed partially available thanks to load balancing across regions.',
    lessonLearned: 'Load balancers enable redundancy. Multi-region setups provide resilience.',
    icon: '🌐',
  },

  realWorldExample: {
    company: 'Medium',
    scenario: 'Handling traffic spikes from viral articles',
    howTheyDoIt: 'Uses multiple load balancer layers to distribute traffic globally and handle sudden spikes',
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
    explanation: 'Load balancers perform health checks and automatically route traffic only to healthy servers.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'medium-step-5',
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
  scenario: "Your database crashed for 30 minutes last night. Complete outage.",
  hook: "No one could read or publish. Revenue loss: $25,000. Authors are angry.",
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
  nextTeaser: "But we need more app servers to handle growing traffic...",
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

  whyItMatters: 'Medium stores millions of articles. Any downtime means lost revenue and angry authors.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. Their replication lag was too high, so backups were also affected. They lost 6 hours of data.',
    lessonLearned: 'Replication lag matters. Test your failover process regularly. Have proper backups.',
    icon: '🗑️',
  },

  realWorldExample: {
    company: 'Medium',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses multi-region replication with automatic failover. Each write is replicated to at least 3 servers.',
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
    explanation: 'With replication, a replica can be promoted to primary (failover), maintaining availability with minimal downtime.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'medium-step-6',
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
  hook: "Users are getting timeouts. Your load balancer needs more servers to distribute to.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 10x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Capacity', before: '6K req/s', after: '60K+ req/s' },
  ],
  nextTeaser: "But where are the article images stored?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Medium:
- Start with 2-3 app server instances
- Scale up during peak times
- Scale down during quiet periods
- Auto-scaling adjusts based on traffic`,

  whyItMatters: 'At 18K requests/second, you need multiple app servers working together.',

  realWorldExample: {
    company: 'Medium',
    scenario: 'Handling traffic spikes',
    howTheyDoIt: 'Auto-scales from dozens to hundreds of servers based on traffic patterns. Viral articles can trigger instant scaling.',
  },

  famousIncident: {
    title: 'Substack\'s Growth Pains',
    company: 'Substack',
    year: '2020',
    whatHappened: 'Rapid growth caused performance issues. They had to quickly scale horizontally to handle newsletter sends.',
    lessonLearned: 'Design for horizontal scaling from day 1. It\'s much harder to add later.',
    icon: '📧',
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
    explanation: 'Vertical scaling has a ceiling (biggest available server). Horizontal scaling can grow indefinitely by adding more servers.',
  },

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Vertical Scaling', explanation: 'Upgrade existing server', icon: '↕️' },
    { title: 'Stateless', explanation: 'Servers don\'t store user state', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'medium-step-7',
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
// STEP 8: Add CDN for Article Images
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Articles with images take forever to load for international users!",
  hook: "Images are hosted on your server in US-East. Users in Asia see 3-second load times.",
  challenge: "Add a CDN to deliver images from edge locations worldwide.",
  illustration: 'global-latency',
};

const step8Celebration: CelebrationContent = {
  emoji: '🌍',
  message: 'Images load fast everywhere!',
  achievement: 'CDN delivers media globally with low latency',
  metrics: [
    { label: 'Tokyo image load', before: '3000ms', after: '100ms' },
    { label: 'Global edge locations', after: '200+' },
  ],
  nextTeaser: "But users can't find articles without search...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'CDN for Global Content Delivery',
  conceptExplanation: `A **CDN** (Content Delivery Network) caches static content at edge locations worldwide.

How it works:
1. First request: Edge fetches from origin, caches it
2. Subsequent requests: Served from edge (< 100ms)

For Medium, we use CDN for:
- Article images (largest payload)
- Author avatars
- Static assets (CSS, JS)

Articles with 5+ images can be 500KB. CDN makes them load fast globally.`,

  whyItMatters: 'Medium has users worldwide. Without CDN, international readers have poor experience.',

  famousIncident: {
    title: 'Fastly CDN Outage',
    company: 'Fastly',
    year: '2021',
    whatHappened: 'A configuration bug took down major sites globally for an hour. Reddit, Medium, Stack Overflow - all affected.',
    lessonLearned: 'CDN is critical infrastructure. Multi-CDN strategies provide redundancy.',
    icon: '🌐',
  },

  realWorldExample: {
    company: 'Medium',
    scenario: 'Serving images for 500M article views daily',
    howTheyDoIt: 'Uses Fastly CDN with edge locations worldwide. Popular article images cached at all edges.',
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
                        └─│  App Server │
                          │   US-East   │
                          └─────────────┘
`,

  keyPoints: [
    'CDN caches images at edge locations globally',
    'Users get images from nearest edge (< 100ms)',
    'Origin only hit on cache miss',
    'Reduces bandwidth costs significantly',
  ],

  quickCheck: {
    question: 'What\'s the main benefit of CDN for a global blogging platform?',
    options: [
      'Images are stored more securely',
      'Users get images from nearby servers, reducing latency',
      'Images are compressed automatically',
      'It\'s cheaper than normal hosting',
    ],
    correctIndex: 1,
    explanation: 'CDN edges are geographically distributed. Users fetch from nearby edge instead of distant origin, dramatically reducing latency.',
  },

  keyConcepts: [
    { title: 'CDN', explanation: 'Content Delivery Network with global edges', icon: '🌍' },
    { title: 'Edge Location', explanation: 'Cache server near users', icon: '📍' },
    { title: 'Origin', explanation: 'Source server for content', icon: '🏠' },
  ],
};

const step8: GuidedStep = {
  id: 'medium-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Publish articles with fast image delivery',
    taskDescription: 'Add a CDN for global content delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver images from edge locations worldwide', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'App Server connected to CDN (or CDN to App Server)',
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
  },

  hints: {
    level1: 'Drag a CDN component onto the canvas',
    level2: 'Connect App Server to CDN. CDN will cache and serve images globally.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'app_server', to: 'cdn' }],
  },
};

// =============================================================================
// STEP 9: Add Search with Elasticsearch
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are asking: 'How do I find articles on a specific topic?'",
  hook: "There's no way to search! Users can only see their feed, not discover new content.",
  challenge: "Add a search service to enable article discovery.",
  illustration: 'search-feature',
};

const step9Celebration: CelebrationContent = {
  emoji: '🔎',
  message: 'Search is live!',
  achievement: 'Users can now discover articles by keyword and author',
  metrics: [
    { label: 'Search latency', after: '<200ms' },
    { label: 'Searchable articles', after: '1M+' },
  ],
  nextTeaser: "But we're over budget on infrastructure costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Full-Text Search with Elasticsearch',
  conceptExplanation: `Regular databases are bad at text search. Finding all articles containing "machine learning" in PostgreSQL is slow!

**Elasticsearch** is optimized for:
- Full-text search (find articles by keywords)
- Fuzzy matching (typos still find results)
- Ranking (most relevant first)
- Real-time indexing (new articles searchable instantly)
- Faceted search (filter by author, topic, date)

Architecture:
- When an article is published, index it in Elasticsearch
- Search queries go to Elasticsearch, not the database
- Database remains source of truth`,

  whyItMatters: 'Search is how users discover new content. Without it, Medium is just a closed feed.',

  realWorldExample: {
    company: 'Medium',
    scenario: 'Searching millions of articles',
    howTheyDoIt: 'Uses Elasticsearch clusters to index all articles. Search results in <200ms with relevance ranking.',
  },

  famousIncident: {
    title: 'Stack Overflow Search Downtime',
    company: 'Stack Overflow',
    year: '2016',
    whatHappened: 'Their Elasticsearch cluster went down. Search was unavailable for hours. Traffic dropped 40% because users couldn\'t find content.',
    lessonLearned: 'Search is critical infrastructure for content platforms. Requires redundancy.',
    icon: '🔧',
  },

  diagram: `
┌────────────────────────────────────────────────────────────┐
│                       Article Published                     │
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
      Article reads                   Search queries
`,

  keyPoints: [
    'Elasticsearch is optimized for full-text search',
    'Index articles when they\'re published',
    'Search queries go to Elasticsearch, not database',
    'Database remains source of truth for content',
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
    explanation: 'Databases do LIKE queries slowly. Elasticsearch is built for text search with inverted indexes and relevance scoring.',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Find documents by keywords', icon: '📄' },
    { title: 'Inverted Index', explanation: 'Map words to documents', icon: '📇' },
    { title: 'Real-Time Indexing', explanation: 'New content searchable instantly', icon: '⏱️' },
  ],
};

const step9: GuidedStep = {
  id: 'medium-step-9',
  stepNumber: 9,
  frIndex: 5,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-6: Users can search for articles',
    taskDescription: 'Add Elasticsearch for search functionality',
    componentsNeeded: [
      { type: 'search', reason: 'Enable full-text search of articles', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search component (Elasticsearch) added',
      'App Server connected to Search',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'cdn', 'search'],
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
    level2: 'Connect App Server to Search. Articles will be indexed for search.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $500,000.",
  hook: "The CFO says: 'Cut costs by 30% or we're shutting down features.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Medium!',
  achievement: 'A scalable, cost-effective blogging platform',
  metrics: [
    { label: 'Monthly cost', before: '$500K', after: 'Under budget' },
    { label: 'Article latency', after: '<300ms' },
    { label: 'Search latency', after: '<200ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '18K req/sec' },
  ],
  nextTeaser: "You've mastered Medium system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use spot/preemptible instances** - 60-90% cheaper for non-critical workloads
3. **Cache aggressively** - Reduce expensive database calls
4. **Auto-scale** - Scale down during low traffic
5. **Tiered storage** - Move old articles to cheaper storage
6. **CDN caching** - Reduce origin bandwidth costs

For Medium:
- Archive articles older than 1 year to cold storage
- Use smaller cache for less popular articles
- Scale down at night when traffic is low
- Compress images before storing`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Medium\'s Business Model Pivot',
    company: 'Medium',
    year: '2017',
    whatHappened: 'Medium laid off 50 staff and pivoted from advertising to subscriptions, citing unsustainable unit economics.',
    lessonLearned: 'At scale, even small cost optimizations save millions. Infrastructure costs must align with business model.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Medium',
    scenario: 'Running at scale profitably',
    howTheyDoIt: 'Heavily optimizes resource usage. Uses CDN for 90%+ of content delivery. Auto-scales aggressively.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure',
    'Use auto-scaling to match demand',
    'Cache to reduce expensive operations',
    'Consider tiered storage for hot/cold data',
    'CDN reduces bandwidth costs',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a read-heavy platform?',
    options: [
      'Use bigger servers',
      'Aggressive caching to reduce database/origin calls',
      'Delete old articles',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Caching is often the most cost-effective optimization. Cache hits are cheap; database queries and bandwidth are expensive.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'medium-step-10',
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
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'cdn', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
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

export const mediumGuidedTutorial: GuidedTutorial = {
  problemId: 'medium',
  title: 'Design Medium',
  description: 'Build a blogging platform with articles, personalized feeds, and search',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📝',
    hook: "You've been hired as Lead Engineer at Content Platform Inc!",
    scenario: "Your mission: Build a blogging platform where authors can publish long-form content and readers can discover articles they love.",
    challenge: "Can you design a system that handles 500 million article views per day?",
  },

  requirementsPhase: mediumRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching Strategies',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'CDN',
    'Full-Text Search',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default mediumGuidedTutorial;
