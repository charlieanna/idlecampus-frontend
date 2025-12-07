import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Steam Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a gaming platform like Steam.
 *
 * Key Concepts:
 * - Game distribution and downloads
 * - User library management
 * - Social gaming features
 * - Real-time presence and chat
 * - Achievement system
 * - CDN for game distribution
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const steamRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a digital game distribution platform like Steam",

  interviewer: {
    name: 'Marcus Chen',
    role: 'Principal Architect at GamePlatform Inc.',
    avatar: '🎮',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the core features users need from a gaming platform like Steam?",
      answer: "Users want to:\n\n1. **Browse game store** - Discover and purchase games\n2. **Download and install games** - Get games onto their device\n3. **Access game library** - See all owned games\n4. **Launch games** - Play from the platform\n5. **Track achievements** - Unlock and view achievements\n6. **Connect with friends** - See what friends are playing, chat",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-6',
      learningPoint: "Steam is fundamentally about game distribution, library management, and social gaming",
    },
    {
      id: 'game-downloads',
      category: 'functional',
      question: "How should game downloads work?",
      answer: "When a user purchases a game, they should be able to download it quickly and reliably. Support pause/resume, bandwidth throttling, and automatic updates. Downloads should verify file integrity to prevent corruption.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Game downloads can be 50-100GB - this requires CDN and efficient distribution",
    },
    {
      id: 'social-features',
      category: 'functional',
      question: "What social features are essential for gamers?",
      answer: "Gamers want to:\n- See friends' online status and what they're playing\n- Chat with friends (text, voice)\n- Join friends' games\n- Share achievements\n- Write game reviews",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Social features drive engagement and retention - gamers play where their friends are",
    },
    {
      id: 'achievements',
      category: 'functional',
      question: "How should the achievement system work?",
      answer: "Games define achievements. When a player unlocks one, it's saved to their profile. Users can view achievement progress, compare with friends, and showcase rare achievements.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Achievement systems require real-time updates and persistent storage",
    },
    {
      id: 'workshop',
      category: 'clarification',
      question: "Should we support user-generated content like Steam Workshop?",
      answer: "Not for MVP. Workshop adds complexity around content moderation, storage, and copyright. Defer to v2.",
      importance: 'nice-to-have',
      insight: "UGC platforms require content moderation and legal infrastructure",
    },
    {
      id: 'streaming',
      category: 'clarification',
      question: "Should we support game streaming like GeForce NOW?",
      answer: "No. Cloud gaming requires massive GPU infrastructure and low-latency networking. Focus on traditional download-to-play model.",
      importance: 'nice-to-have',
      insight: "Cloud gaming is a different problem entirely - extreme infrastructure requirements",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "120 million monthly active users, with 30 million concurrent users at peak (evening hours)",
      importance: 'critical',
      learningPoint: "Steam is the largest PC gaming platform globally",
    },
    {
      id: 'throughput-downloads',
      category: 'throughput',
      question: "How much download traffic do we need to handle?",
      answer: "During peak hours (game releases, sales events), Steam delivers 50+ Petabits per second globally. Average game size is 50GB.",
      importance: 'critical',
      calculation: {
        formula: "1M concurrent downloads × 50 Mbps avg = 50 Tbps",
        result: "~50 Terabits/sec during major releases - CDN is absolutely essential!",
      },
      learningPoint: "Game distribution generates more bandwidth than almost any other service",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many games are in the store?",
      answer: "About 100,000 games currently, with 50-100 new games added daily. Each game has metadata, screenshots, videos, reviews.",
      importance: 'important',
      calculation: {
        formula: "100K games × 500MB media = 50TB media storage",
        result: "~50TB for store media (separate from game files)",
      },
      learningPoint: "Store catalog is large but dwarfed by actual game file storage",
    },
    {
      id: 'latency-store',
      category: 'latency',
      question: "How fast should the store load?",
      answer: "p99 under 500ms for store pages. Users expect snappy browsing when shopping for games.",
      importance: 'important',
      learningPoint: "Store browsing must be fast - cache aggressively",
    },
    {
      id: 'latency-downloads',
      category: 'latency',
      question: "How fast should downloads be?",
      answer: "Users should get their full internet bandwidth. If they have 1 Gbps, downloads should saturate it. This requires servers geographically close to users.",
      importance: 'critical',
      learningPoint: "Download speed is critical for user satisfaction - CDN edge servers essential",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.95% availability. Gamers expect Steam to always be available, especially on weekends and evenings.",
      importance: 'critical',
      learningPoint: "Gaming platforms have predictable peak hours - design for weekend evening traffic",
    },
    {
      id: 'storage-games',
      category: 'payload',
      question: "How much storage is needed for all game files?",
      answer: "100,000 games × 50GB average = 5 Petabytes of game files. But many games have multiple versions (Windows, Mac, Linux) and updates.",
      importance: 'critical',
      calculation: {
        formula: "100K games × 50GB × 1.5 (versions) = 7.5 PB",
        result: "~7.5 Petabytes of game files to store and distribute",
      },
      learningPoint: "Massive storage requirements - object storage essential",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'game-downloads', 'throughput-downloads', 'availability-requirement'],
  criticalFRQuestionIds: ['core-features', 'game-downloads', 'social-features'],
  criticalScaleQuestionIds: ['throughput-downloads', 'latency-downloads', 'storage-games'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can browse game store',
      description: 'Discover and purchase games from the catalog',
      emoji: '🛍️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can download games',
      description: 'Download and install purchased games',
      emoji: '⬇️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can access game library',
      description: 'View and manage all owned games',
      emoji: '📚',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can launch games',
      description: 'Start games from the platform',
      emoji: '🎮',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can track achievements',
      description: 'Unlock and view game achievements',
      emoji: '🏆',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Users can connect with friends',
      description: 'Friends list, chat, and presence',
      emoji: '👥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '30 million concurrent at peak',
    writesPerDay: 'Game purchases, achievement unlocks, friend activities',
    readsPerDay: 'Store browsing, library access, downloads',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 5000, peak: 15000 },
    calculatedReadRPS: { average: 50000, peak: 150000 },
    maxPayloadSize: '~50GB (game download)',
    storagePerRecord: '~50GB per game',
    storageGrowthPerYear: '~1PB (new games + updates)',
    redirectLatencySLA: 'p99 < 500ms (store)',
    createLatencySLA: 'p99 < 200ms (metadata)',
  },

  architecturalImplications: [
    '✅ 50 Tbps peak download → CDN is absolutely critical',
    '✅ 7.5 PB game storage → Object storage + CDN edge caching required',
    '✅ 30M concurrent users → Load balancing + horizontal scaling essential',
    '✅ Social features → WebSocket connections for presence/chat',
    '✅ Download reliability → Chunked downloads with resume support',
    '✅ Regional optimization → CDN edge servers in major gaming markets',
  ],

  outOfScope: [
    'Cloud gaming / game streaming',
    'User-generated content (Workshop)',
    'Payment processing (focus on game distribution)',
    'Game development tools',
    'VR platform features',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can browse games, make purchases, and download to their library. The complexity of CDN, massive downloads, and social features comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎮',
  scenario: "Welcome to GamePlatform Inc! You're building the next Steam.",
  hook: "Your first gamer just installed the client. They want to start playing games!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your gaming platform is online!',
  achievement: 'Users can now connect to your store',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle games yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every gaming platform starts with a **Client** connecting to a **Server**.

When a user opens the Steam client:
1. Their device (PC, Mac, Linux) is the **Client**
2. It sends requests to your **App Server**
3. The server responds with store data, library info, etc.

This is the foundation for all Steam operations:
- Browsing the store
- Managing game library
- Downloading games
- Chatting with friends`,

  whyItMatters: 'Without this connection, gamers can\'t access the store, download games, or play online.',

  realWorldExample: {
    company: 'Steam',
    scenario: 'Serving 30 million concurrent users',
    howTheyDoIt: 'Started with a simple client-server model in 2003, now uses distributed architecture with regional data centers',
  },

  keyPoints: [
    'Client = the gamer\'s Steam application',
    'App Server = your backend that handles store and library',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The Steam application on user\'s PC', icon: '💻' },
    { title: 'App Server', explanation: 'Backend handling store and library requests', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'steam-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Steam', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles store and library requests', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle game store operations!",
  hook: "A user tried to browse games but got an error. Another tried to add a game to their library - nothing happened.",
  challenge: "Write the Python code for store browsing and library management.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle game operations!',
  achievement: 'You implemented the core Steam functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can browse store', after: '✓' },
    { label: 'Can manage library', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Store and Library Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For Steam, we need handlers for:
- \`browse_store()\` - Return list of available games
- \`purchase_game()\` - Add game to user's library
- \`get_library()\` - Get user's owned games
- \`get_download_url()\` - Return download URL for a game

For now, we'll store data in memory (Python dictionaries). The actual game files and database come in later steps.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where the functionality lives!',

  famousIncident: {
    title: 'Steam Holiday Sale 2012 Outage',
    company: 'Steam',
    year: '2012',
    whatHappened: 'During the popular Winter Sale, Steam servers were overwhelmed by traffic. The store went down repeatedly, frustrating millions of gamers ready to buy games.',
    lessonLearned: 'Design for traffic spikes. Sales events create predictable surges - scale proactively.',
    icon: '🎄',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Handling millions of concurrent shoppers',
    howTheyDoIt: 'Uses microservices - separate services for store, library, downloads, community, each handling massive traffic',
  },

  keyPoints: [
    'browse_store returns game metadata (title, price, description)',
    'purchase_game adds to user library (requires auth)',
    'get_download_url returns CDN URL (will be CDN URL later)',
    'In-memory storage for now - database comes in Step 3',
  ],

  quickCheck: {
    question: 'Why do we return a download URL instead of serving game files directly from the app server?',
    options: [
      'Game files are too large for HTTP',
      'App servers handle control logic, not 50GB file transfers',
      'It\'s easier to implement',
      'URLs are more secure',
    ],
    correctIndex: 1,
    explanation: 'App servers handle metadata and business logic. Massive game file delivery happens through specialized infrastructure (CDN). Separation of concerns is critical.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Store API', explanation: 'Returns catalog of available games', icon: '🛍️' },
    { title: 'Library API', explanation: 'Returns user\'s owned games', icon: '📚' },
  ],
};

const step2: GuidedStep = {
  id: 'steam-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse store, FR-2: Download games, FR-3: Access library',
    taskDescription: 'Configure APIs and implement Python handlers for store and library',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/store, POST /api/v1/purchase, GET /api/v1/library APIs',
      'Open the Python tab',
      'Implement browse_store(), purchase_game(), and get_library() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for browse_store, purchase_game, and get_library',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/store', 'POST /api/v1/purchase', 'GET /api/v1/library'] } },
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
  hook: "When it came back online, ALL user libraries were GONE! Gamers lost access to hundreds of dollars worth of games they own.",
  challenge: "Add a database so game ownership and library data survive restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your game catalog and libraries are safe forever!',
  achievement: 'Data now persists across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But the store is loading slowly...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Steam, we need tables for:
- \`games\` - Game metadata (title, price, description, download_url)
- \`users\` - User accounts
- \`library\` - Which users own which games
- \`achievements\` - Achievement definitions and unlocks
- \`friends\` - Friend relationships`,

  whyItMatters: 'Imagine losing your entire game library because of a server restart. Users would lose hundreds of dollars in purchases!',

  famousIncident: {
    title: 'PlayStation Network Outage 2011',
    company: 'Sony',
    year: '2011',
    whatHappened: 'PSN was hacked, database compromised, and went offline for 23 days. 77 million users couldn\'t access their digital game libraries. Some data was permanently lost.',
    lessonLearned: 'Secure, reliable database infrastructure is non-negotiable. User library data must never be lost.',
    icon: '🔒',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Managing 120 million users and 100K games',
    howTheyDoIt: 'Uses PostgreSQL for structured data (users, library, purchases) with heavy replication and backups',
  },

  keyPoints: [
    'Database stores game metadata, NOT game files themselves',
    'Game files go to object storage (Step 8)',
    'User library is critical data - must be durable',
    'PostgreSQL is great for relational data like ownership',
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
    { title: 'User Library', explanation: 'Critical data that must never be lost', icon: '📚' },
  ],
};

const step3: GuidedStep = {
  id: 'steam-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store game metadata and user library permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Store Reads
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 5 million users, and the store takes 3 seconds to load!",
  hook: "Every store browse request hits the database. The game catalog rarely changes, but we query it millions of times per day.",
  challenge: "Add a cache to make store browsing instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Store loads 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Store latency', before: '3000ms', after: '150ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But one server can't handle peak traffic...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Steam's game catalog doesn't change often, but it's read millions of times per day. Perfect for caching!

**Cache-Aside Pattern**:
1. Check cache first
2. If miss → fetch from database
3. Store in cache for next time (with TTL)

For Steam, we cache:
- Game catalog (list of all games)
- Game metadata (price, description, screenshots)
- Featured games and sales
- User libraries (frequently accessed)`,

  whyItMatters: 'At 150K store reads/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Steam Summer Sale Database Overload',
    company: 'Steam',
    year: '2014',
    whatHappened: 'During a massive Summer Sale, cache invalidation issues caused database stampede. Millions of requests hit the database simultaneously, causing store slowdowns.',
    lessonLearned: 'Cache properly with appropriate TTLs. Don\'t invalidate all caches at once during high traffic.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Serving store to millions of concurrent shoppers',
    howTheyDoIt: 'Uses Redis clusters for aggressive caching. 99%+ cache hit rate for store catalog data.',
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
  id: 'steam-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse store (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache game catalog for fast browsing', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (600 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', to: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 600 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Major game release! Your single server is at 100% CPU!",
  hook: "A highly anticipated AAA game just launched and millions are trying to download at once. The server is overwhelmed.",
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
- IP hash: Same user goes to same server (for sessions)`,

  whyItMatters: 'Steam has massive traffic spikes when major games launch or sales start. One server can\'t handle millions of concurrent users.',

  famousIncident: {
    title: 'GTA V PC Launch on Steam',
    company: 'Steam',
    year: '2015',
    whatHappened: 'When GTA V launched on PC, Steam store slowed to a crawl. Millions tried to buy and download simultaneously. Load balancers prevented complete failure but the surge was extreme.',
    lessonLearned: 'Plan for spikes during major releases. Load balancers + auto-scaling = resilience.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Handling game launch spikes',
    howTheyDoIt: 'Uses multiple layers of load balancers across global regions to distribute traffic smoothly',
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
  id: 'steam-step-5',
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
  scenario: "Your database server just died. Hardware failure during evening prime time.",
  hook: "All users see 'Service Unavailable'. They can't access their game libraries. Social media backlash is brutal.",
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

  whyItMatters: 'Steam stores critical user data - game library, purchases, achievements. Database failure without replication means losing everything.',

  famousIncident: {
    title: 'Xbox Live Database Outage',
    company: 'Microsoft',
    year: '2013',
    whatHappened: 'Xbox Live database issues prevented millions from accessing their digital game libraries for hours. Gamers couldn\'t play games they owned.',
    lessonLearned: 'Database replication is essential. User library data is too critical to risk with single instance.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Zero tolerance for library data loss',
    howTheyDoIt: 'Uses multi-region replication. Each write is replicated to at least 3 database servers in different availability zones.',
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
  id: 'steam-step-6',
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
  scenario: "You've grown to 30 million concurrent users! One app server can't keep up!",
  hook: "Even with load balancing, request volume is overwhelming a single server instance.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 10x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Capacity', before: '50K req/s', after: '500K+ req/s' },
  ],
  nextTeaser: "But where are the actual game files stored?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Steam:
- Start with 3-5 app server instances
- Scale up during peak times (evening hours, sales events)
- Scale down during quiet periods (early morning)`,

  whyItMatters: 'At 150K requests/second peak, you need many app servers working in parallel.',

  realWorldExample: {
    company: 'Steam',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs thousands of app server instances across multiple regions. Auto-scales based on traffic patterns and events.',
  },

  famousIncident: {
    title: 'Steam Autumn Sale Traffic Surge',
    company: 'Steam',
    year: '2016',
    whatHappened: 'Autumn Sale began and traffic spiked 500%. Steam\'s auto-scaling kicked in, spinning up hundreds of new server instances within minutes.',
    lessonLearned: 'Design for horizontal scaling from day 1. Sales events create predictable traffic patterns.',
    icon: '🍂',
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
  id: 'steam-step-7',
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
// STEP 8: Add Object Storage for Game Files
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📦',
  scenario: "You're storing 7.5 Petabytes of game files. The database can't handle binary files!",
  hook: "Databases are designed for structured data, not 50GB game installers.",
  challenge: "Add object storage (S3) for game files.",
  illustration: 'storage-full',
};

const step8Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Games have a proper home!',
  achievement: 'Object storage handles unlimited game files',
  metrics: [
    { label: 'Game storage', after: 'Unlimited (S3)' },
    { label: 'Durability', after: '99.999999999%' },
  ],
  nextTeaser: "But users far away experience slow downloads...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage for Game Files',
  conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (game installers, patches, DLC)
- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy

Architecture:
- **Database**: Game metadata (title, price, description, download_url)
- **Object Storage**: Actual game files (50GB each)
- Download URL stored in database points to S3 object

For multi-platform games:
- Store Windows, Mac, Linux versions separately
- Store patches and DLC as separate objects`,

  whyItMatters: 'Steam stores 7.5+ Petabytes of game files. You can\'t put that in PostgreSQL!',

  famousIncident: {
    title: 'AWS S3 Outage Impact on Gaming',
    company: 'Various game platforms',
    year: '2017',
    whatHappened: 'S3 outage in US-East affected many gaming platforms. Those without CDN caching couldn\'t serve downloads. Platforms with proper CDN architecture kept working.',
    lessonLearned: 'CDN acts as buffer against origin failures. Never rely solely on object storage for active downloads.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Storing petabytes of game files',
    howTheyDoIt: 'Uses distributed object storage across multiple cloud providers and their own infrastructure. Each game stored redundantly.',
  },

  diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Request game info
       ▼
┌──────────────┐     2. Metadata    ┌──────────┐
│  App Server  │ ◀───────────────── │ Database │
└──────┬───────┘                    └──────────┘
       │
       │ 3. Return download URL pointing to S3
       ▼
     (Client downloads from S3/CDN later)
`,

  keyPoints: [
    'Object storage for game files, database for metadata',
    'Store download URLs in database, actual files in S3',
    'Multiple versions per game (Windows, Mac, Linux)',
    'S3 handles replication and durability',
  ],

  quickCheck: {
    question: 'Why not store games directly in the database?',
    options: [
      'Databases can\'t store binary data',
      'It\'s too slow and expensive at petabyte scale',
      'Games would be insecure',
      'It would violate copyright laws',
    ],
    correctIndex: 1,
    explanation: 'Databases CAN store binary, but it\'s not optimized for it. Storing petabytes of games would be prohibitively slow and expensive.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Designed for large binary files', icon: '📦' },
    { title: 'Multi-Platform', explanation: 'Store Windows, Mac, Linux versions', icon: '💻' },
    { title: 'Metadata', explanation: 'Info about games, stored in DB', icon: '📝' },
  ],
};

const step8: GuidedStep = {
  id: 'steam-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-2: Download games (now at scale!)',
    taskDescription: 'Add Object Storage for game files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store game files (7.5 PB+)', displayName: 'S3 Object Storage' },
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
    level2: 'Connect App Server to Object Storage. Game files will be stored here.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: Add CDN - CRITICAL for Game Downloads!
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Asia are experiencing terrible download speeds - 5 hours for a 50GB game!",
  hook: "Your servers are in US. Downloading 50GB from across the world is painfully slow. This is the make-or-break moment for Steam.",
  challenge: "Add a CDN to deliver games from edge servers worldwide.",
  illustration: 'global-latency',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Games download at full speed worldwide!',
  achievement: 'CDN delivers games from edge locations',
  metrics: [
    { label: 'Tokyo download speed', before: '5 Mbps', after: '500+ Mbps' },
    { label: 'Download time (50GB)', before: '5 hours', after: '15 minutes' },
    { label: 'Global edge locations', after: '200+' },
  ],
  nextTeaser: "Time to optimize costs...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: The Secret Weapon for Game Distribution',
  conceptExplanation: `A **CDN** (Content Delivery Network) is CRITICAL for game downloads.

How it works:
1. Game files are cached at edge servers worldwide
2. When user downloads, they get the nearest edge server
3. Edge location is < 20ms away vs 200ms+ to origin
4. This enables full bandwidth utilization

Steam's Content System:
- Steam has edge servers in every major region
- Popular games are pre-positioned at edges
- Less popular games are fetched on-demand and cached
- 95%+ of downloads never leave the region

For chunked downloads:
- Games downloaded in chunks (resume support)
- Each chunk verified for integrity
- CDN handles chunk delivery efficiently`,

  whyItMatters: 'Without CDN, Steam would be unusable. 50 Tbps of download traffic MUST be served from edges.',

  famousIncident: {
    title: 'Steam Content System Deployment',
    company: 'Steam',
    year: '2008-2010',
    whatHappened: 'Steam deployed their global content delivery network with edge servers worldwide. Download speeds improved 10-20x for most users. This was critical to Steam\'s growth.',
    lessonLearned: 'For massive file distribution, CDN isn\'t just important - it\'s the entire architecture. You can\'t succeed without it.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Serving 50 Tbps of download traffic',
    howTheyDoIt: 'Steam operates edge servers in hundreds of locations globally, many inside ISP networks. Games are pre-cached at edges. Downloads are chunked and parallelized.',
  },

  diagram: `
User in Tokyo downloading game:

┌──────────┐    20ms    ┌──────────┐  ┌─────────────────┐
│   User   │◀──────────▶│   CDN    │──│  Tokyo Edge     │
│ (Tokyo)  │  Download  │  Edge    │  │ (Steam Server)  │
└──────────┘            └──────────┘  └─────────────────┘
                             │
                             │ Pre-cached game
                             │ (pushed during off-peak)
                             │
                        ┌────▼──────┐
                        │  Origin   │
                        │    S3     │
                        │  US-West  │
                        └───────────┘

Chunked Downloads:
- Game split into 1MB chunks
- Download chunks in parallel
- Resume from last chunk on disconnect
- Verify each chunk integrity (SHA-256)
`,

  keyPoints: [
    'CDN is ESSENTIAL for game downloads - not optional',
    'Games cached at edge locations worldwide',
    'Users download from nearest edge (< 20ms latency)',
    'Chunked downloads with resume support',
    'Pre-cache popular games during off-peak hours',
  ],

  quickCheck: {
    question: 'Why is CDN especially critical for game distribution vs other content?',
    options: [
      'Games are copyrighted',
      'Games are massive (50GB+) - downloading from distant origin is unusably slow',
      'It\'s cheaper',
      'Games are more important',
    ],
    correctIndex: 1,
    explanation: 'Downloading 50GB from across the world at low speeds would take hours or days. CDN edge servers close to users enable fast downloads at full bandwidth.',
  },

  keyConcepts: [
    { title: 'CDN Edge', explanation: 'Game cache servers near users', icon: '📡' },
    { title: 'Chunked Downloads', explanation: 'Resume support, parallel downloads', icon: '📦' },
    { title: 'Edge Pre-caching', explanation: 'Popular games cached proactively', icon: '🔄' },
  ],
};

const step9: GuidedStep = {
  id: 'steam-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-2: Download games globally with high speed',
    taskDescription: 'Add CDN for global game delivery from edge locations',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver games from edge servers worldwide - CRITICAL!', displayName: 'CDN' },
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
    level2: 'CDN serves as the public endpoint for game downloads, S3 is the origin',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $5 million.",
  hook: "The CFO says: 'Cut costs by 30% or we're going bankrupt. Bandwidth costs are killing us.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Steam!',
  achievement: 'A scalable, cost-effective game distribution platform',
  metrics: [
    { label: 'Monthly cost', before: '$5M', after: 'Under budget' },
    { label: 'Download speed', after: 'Full bandwidth' },
    { label: 'Store latency', after: '<500ms' },
    { label: 'Availability', after: '99.95%' },
    { label: 'Concurrent users', after: '30M+' },
  ],
  nextTeaser: "You've mastered Steam system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for Steam:
1. **Smart CDN caching** - Cache popular games aggressively, purge unpopular ones
2. **Off-peak pre-caching** - Push popular games to edges during low traffic hours (cheaper)
3. **Regional optimization** - Cache region-specific popular games
4. **Tiered storage** - Move old game versions to cheaper storage
5. **Bandwidth optimization** - Compression, delta updates (download only changes)
6. **Auto-scaling** - Scale down during low-traffic hours (3-10 AM)

Steam-specific optimizations:
- Delta patching: Download only changed files, not entire game
- Compression: Games compressed for download
- Peak shaving: Encourage off-peak downloads with pre-load features
- ISP partnerships: Partner with ISPs to reduce bandwidth costs`,

  whyItMatters: 'Bandwidth costs at 50 Tbps scale are astronomical. Without optimization, Steam would be unprofitable.',

  famousIncident: {
    title: 'Steam Bandwidth Cost Crisis',
    company: 'Steam',
    year: '2007-2008',
    whatHappened: 'As Steam grew, bandwidth costs threatened profitability. Steam invested heavily in their own CDN infrastructure and ISP partnerships, reducing costs by 60% while improving speed.',
    lessonLearned: 'At extreme scale, owning infrastructure is cheaper than renting. Below that scale, optimize cloud costs.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Steam',
    scenario: 'Running at massive scale profitably',
    howTheyDoIt: 'Operates own CDN infrastructure, delta patching, aggressive compression, ISP partnerships, off-peak incentives. Still one of the most bandwidth-intensive platforms globally.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'CDN edge caching reduces expensive origin bandwidth',
    'Delta updates save massive bandwidth',
    'Auto-scale based on time-of-day patterns',
    'ISP partnerships reduce costs at massive scale',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a game distribution platform?',
    options: [
      'Reduce download speeds',
      'Delta patching + aggressive CDN caching to minimize origin bandwidth',
      'Delete old games',
      'Limit concurrent downloads',
    ],
    correctIndex: 1,
    explanation: 'Origin bandwidth is expensive. Delta patching means users download 1GB instead of 50GB. CDN caching means 95%+ of traffic never hits origin.',
  },

  keyConcepts: [
    { title: 'Delta Patching', explanation: 'Download only changed files, not entire game', icon: '📦' },
    { title: 'CDN Pre-caching', explanation: 'Push popular games to edges during off-peak', icon: '📡' },
    { title: 'Auto-Scaling', explanation: 'Scale based on time-of-day patterns', icon: '📊' },
  ],
};

const step10: GuidedStep = {
  id: 'steam-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $1000/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $1000/month',
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
      { fromType: 'cdn', to: 'object_storage' },
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

export const steamGuidedTutorial: GuidedTutorial = {
  problemId: 'steam',
  title: 'Design Steam',
  description: 'Build a digital game distribution platform with store, library, downloads, and social features',
  difficulty: 'advanced',
  estimatedMinutes: 65,

  welcomeStory: {
    emoji: '🎮',
    hook: "You've been hired as Lead Architect at GamePlatform Inc!",
    scenario: "Your mission: Build a game distribution platform that can serve 30 million concurrent gamers, delivering 50GB+ games at maximum speed worldwide.",
    challenge: "Can you design a system that handles 50 Terabits per second of download traffic?",
  },

  requirementsPhase: steamRequirementsPhase,

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
    'CDN (Critical for Downloads)',
    'Chunked Downloads',
    'Delta Patching',
    'Cost Optimization',
    'Gaming Platform Architecture',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 3: Storage and Retrieval (object storage)',
    'Chapter 8: Distributed System Troubles',
  ],
};

export default steamGuidedTutorial;
