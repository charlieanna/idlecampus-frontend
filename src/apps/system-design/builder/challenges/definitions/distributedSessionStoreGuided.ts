import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Distributed Session Store Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching distributed session management through
 * building a global session store with cross-region replication and failover.
 *
 * Key Concepts:
 * - Cross-region session storage
 * - Session replication strategies
 * - Failover and consistency
 * - Session affinity vs stateless design
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const sessionStoreRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a distributed session store for a global e-commerce platform",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Staff Engineer at GlobalCart',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main operations users need for session management?",
      answer: "Users need to:\n\n1. **Create session** - When they log in from any region\n2. **Read session** - Retrieve their session data on every request\n3. **Update session** - Modify session data (shopping cart, preferences)\n4. **Delete session** - Log out or session expiration\n5. **Session should follow them** - Access from any region seamlessly",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-4',
      learningPoint: "Sessions must be globally accessible and consistent across regions",
    },
    {
      id: 'cross-region-access',
      category: 'functional',
      question: "What happens if a user logs in from US, then immediately accesses from Europe?",
      answer: "Their session must be available in Europe immediately. Users travel, use VPNs, or access from multiple locations. The session store must replicate across regions so users never see 'session not found' errors.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Cross-region replication is critical for global session stores",
    },
    {
      id: 'session-consistency',
      category: 'functional',
      question: "If a user updates their shopping cart in one region, when should it be visible in another region?",
      answer: "Within seconds (eventual consistency is acceptable). For example, adding an item to cart in US should appear in EU within 1-2 seconds. Strong consistency across regions is too expensive - eventual consistency works for most session data.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Eventual consistency is acceptable for session data across regions",
    },
    {
      id: 'session-expiration',
      category: 'clarification',
      question: "How long should sessions last?",
      answer: "30 days of inactivity for logged-in users, 24 hours for guest sessions. After expiration, sessions should be automatically cleaned up to save storage.",
      importance: 'important',
      insight: "TTL-based cleanup prevents storage bloat",
    },
    {
      id: 'session-security',
      category: 'clarification',
      question: "What about session hijacking protection?",
      answer: "Sessions should have secure tokens, IP binding, and device fingerprinting. But the core session store design focuses on availability and replication. Security is a layer on top.",
      importance: 'important',
      insight: "Security is important but separate from distributed storage design",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many concurrent sessions should we support?",
      answer: "100 million active sessions globally, with 10 million concurrent users at peak",
      importance: 'critical',
      learningPoint: "Session stores must handle massive concurrency",
    },
    {
      id: 'throughput-operations',
      category: 'throughput',
      question: "How many session reads/writes per second?",
      answer: "Reads: 500,000 per second (every page view reads session). Writes: 50,000 per second (cart updates, preferences). That's a 10:1 read/write ratio.",
      importance: 'critical',
      calculation: {
        formula: "500K reads/sec + 50K writes/sec = 550K ops/sec total",
        result: "~550K total operations per second",
      },
      learningPoint: "Session stores are read-heavy but writes are still significant",
    },
    {
      id: 'payload-session-size',
      category: 'payload',
      question: "How large is typical session data?",
      answer: "Average session: 5KB (user info, cart, preferences, browsing history). Maximum: 50KB for power users with large carts.",
      importance: 'important',
      calculation: {
        formula: "100M sessions × 5KB average = 500GB total storage",
        result: "~500GB of active session data",
      },
      learningPoint: "Session data is relatively small but adds up at scale",
    },
    {
      id: 'latency-read',
      category: 'latency',
      question: "What's the acceptable latency for reading sessions?",
      answer: "p99 under 10ms. Every page load reads the session, so this is critical. Users notice delays above 100ms.",
      importance: 'critical',
      learningPoint: "Session reads must be extremely fast - they're on every request",
    },
    {
      id: 'latency-replication',
      category: 'latency',
      question: "How fast must cross-region replication be?",
      answer: "Eventual consistency within 1-2 seconds is acceptable. Users rarely switch regions instantly, and a brief delay is tolerable.",
      importance: 'important',
      learningPoint: "Cross-region replication can be asynchronous for better performance",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if a region goes down?",
      answer: "Sessions must failover to another region automatically. 99.99% availability required - less than 5 minutes downtime per month.",
      importance: 'critical',
      learningPoint: "Multi-region replication enables automatic failover",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'cross-region-access', 'session-consistency'],
  criticalFRQuestionIds: ['core-operations', 'cross-region-access', 'session-consistency'],
  criticalScaleQuestionIds: ['throughput-operations', 'latency-read', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Create and manage sessions',
      description: 'Users can create, read, update, and delete sessions',
      emoji: '🔐',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Cross-region access',
      description: 'Sessions accessible from any geographic region',
      emoji: '🌍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Session replication',
      description: 'Sessions replicated across regions with eventual consistency',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Automatic failover',
      description: 'If a region fails, sessions served from another region',
      emoji: '🛡️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million active sessions',
    writesPerDay: '4.3 billion writes/day',
    readsPerDay: '43 billion reads/day',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 50000, peak: 150000 },
    calculatedReadRPS: { average: 500000, peak: 1500000 },
    maxPayloadSize: '~50KB max session',
    storagePerRecord: '~5KB average',
    storageGrowthPerYear: '~500GB active data',
    redirectLatencySLA: 'p99 < 10ms (read)',
    createLatencySLA: 'p99 < 50ms (write)',
  },

  architecturalImplications: [
    '✅ Read-heavy (10:1) → Caching is critical',
    '✅ 1.5M reads/sec peak → Need distributed cache clusters',
    '✅ Cross-region access → Multi-region replication essential',
    '✅ p99 < 10ms read → In-memory cache required',
    '✅ 99.99% availability → Multi-region failover',
    '✅ Eventual consistency acceptable → Async replication',
  ],

  outOfScope: [
    'Session security implementation (encryption, tokens)',
    'User authentication system',
    'Session analytics',
    'A/B testing with sessions',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple session store that can create and read sessions. Then we'll add cross-region replication, failover, and optimize for the massive scale. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔐',
  scenario: "Welcome to GlobalCart! You're building a session store for a global e-commerce platform.",
  hook: "Your first user just logged in. Their session needs to be created and accessible!",
  challenge: "Set up the basic request flow so clients can reach your session service.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Session service is online!',
  achievement: 'Users can now connect to your session store',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle sessions yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Session Service Architecture',
  conceptExplanation: `Every session store starts with a **Client** connecting to a **Session Service**.

When a user logs in:
1. Their device (Client) sends a request
2. Your App Server processes the session operations
3. Session data must be stored and retrieved quickly

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, users can\'t maintain logged-in state across requests.',

  keyPoints: [
    'Client = user\'s device making requests',
    'App Server = session service handling operations',
    'Every page load requires a session lookup',
  ],

  keyConcepts: [
    { title: 'Session', explanation: 'Temporary user state stored server-side', icon: '🔐' },
    { title: 'Session ID', explanation: 'Unique token identifying a user\'s session', icon: '🎫' },
    { title: 'Stateless Server', explanation: 'Server doesn\'t store state in memory', icon: '🔄' },
  ],
};

const step1: GuidedStep = {
  id: 'session-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can create sessions',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the platform', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles session operations', displayName: 'Session Service' },
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
    level1: 'Drag a Client and App Server from the component palette',
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Session APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your session service is connected, but it can't create or read sessions!",
  hook: "A user just tried to log in but got an error.",
  challenge: "Write the Python code to create, read, update, and delete sessions.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Session operations working!',
  achievement: 'You implemented the core session functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create sessions', after: '✓' },
    { label: 'Can read sessions', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all sessions are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Session API Implementation',
  conceptExplanation: `Every session operation needs a handler function.

For session management, we need:
- \`create_session(user_id)\` - Generate session ID and store data
- \`get_session(session_id)\` - Retrieve session data
- \`update_session(session_id, data)\` - Modify session data
- \`delete_session(session_id)\` - Remove session (logout)

For now, we'll store sessions in memory (Python dictionaries). Persistent storage comes in the next step.`,

  whyItMatters: 'Without handlers, your server can\'t manage sessions. This is where the functionality lives!',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Managing millions of shopping sessions',
    howTheyDoIt: 'Uses DynamoDB for session storage with TTL for automatic cleanup. Session reads on every page view.',
  },

  keyPoints: [
    'create_session returns a unique session ID',
    'get_session retrieves data by session ID',
    'update_session modifies cart, preferences, etc.',
    'delete_session for logout',
  ],

  quickCheck: {
    question: 'Why store session data server-side instead of in cookies?',
    options: [
      'Cookies are too slow',
      'Server-side is more secure and supports larger data',
      'Cookies don\'t work across domains',
      'Server-side is cheaper',
    ],
    correctIndex: 1,
    explanation: 'Server-side sessions are more secure (can\'t be tampered with) and can store more data (cookies limited to 4KB).',
  },

  keyConcepts: [
    { title: 'Session ID', explanation: 'Unique token (UUID) identifying a session', icon: '🎫' },
    { title: 'Session Data', explanation: 'User info, cart, preferences stored server-side', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live - automatic session expiration', icon: '⏰' },
  ],
};

const step2: GuidedStep = {
  id: 'session-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create and manage sessions',
    taskDescription: 'Configure APIs and implement Python handlers for session operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/sessions and GET /api/v1/sessions/:id APIs',
      'Open the Python tab',
      'Implement create_session(), get_session(), update_session(), delete_session()',
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
    level1: 'Click on the App Server, then go to APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to Python tab and implement the session handlers',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add In-Memory Cache for Session Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚡',
  scenario: "Sessions are working, but they're too slow! Database queries take 50ms per session read.",
  hook: "Every page view reads the session. At 500K reads/sec, the database can't keep up!",
  challenge: "Add Redis cache for ultra-fast session access.",
  illustration: 'performance-bottleneck',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Sessions are now lightning fast!',
  achievement: 'In-memory cache delivers sub-millisecond reads',
  metrics: [
    { label: 'Session read latency', before: '50ms', after: '1ms' },
    { label: 'Cache hit rate', after: '99%' },
  ],
  nextTeaser: "But if the cache server restarts, all sessions vanish...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'In-Memory Caching for Sessions',
  conceptExplanation: `**Why cache sessions?**

Sessions are read on EVERY page view. Database queries are too slow (10-50ms). Redis delivers session data in 1ms.

**Redis for sessions**:
- Stores data in RAM (extremely fast)
- Supports TTL (automatic session expiration)
- Atomic operations (no race conditions)
- Persistence options (AOF, RDB)

**Session storage pattern**:
1. User logs in → Create session in Redis with TTL
2. Every request → Read session from Redis
3. Cart update → Update session in Redis
4. 30 days later → TTL expires, session auto-deleted`,

  whyItMatters: 'At 500K reads/sec, database latency would kill performance. Redis handles millions of ops/sec.',

  famousIncident: {
    title: 'Amazon Prime Day Cache Failure',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'During Prime Day launch, internal session cache infrastructure failed under load. Users saw "Service Unavailable" errors for 90 minutes. Amazon estimated $100M in lost sales.',
    lessonLearned: 'Session stores must be sized for peak load with redundancy. Cache failures = complete outage.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Managing 200 million user sessions',
    howTheyDoIt: 'Uses Redis clusters for session storage with replication. Sessions include viewing history, preferences, device info.',
  },

  keyPoints: [
    'Redis stores sessions in RAM for speed',
    'TTL automatically expires old sessions',
    'Redis supports replication for durability',
    'Sessions are small (5KB) but accessed frequently',
  ],

  quickCheck: {
    question: 'Why use Redis instead of a traditional database for sessions?',
    options: [
      'Redis is cheaper',
      'Redis provides sub-millisecond latency from RAM storage',
      'Redis has better security',
      'Redis supports more data types',
    ],
    correctIndex: 1,
    explanation: 'Redis stores data in RAM, providing 100x faster reads than disk-based databases. Critical for high-frequency session reads.',
  },

  keyConcepts: [
    { title: 'In-Memory', explanation: 'Data stored in RAM, not disk', icon: '⚡' },
    { title: 'TTL', explanation: 'Automatic expiration after N seconds', icon: '⏰' },
    { title: 'Cache-Aside', explanation: 'App manages cache directly', icon: '🔄' },
  ],
};

const step3: GuidedStep = {
  id: 'session-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast session access required',
    taskDescription: 'Add Redis cache for session storage',
    componentsNeeded: [
      { type: 'cache', reason: 'Store sessions in memory for speed', displayName: 'Redis' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Configure TTL (30 days = 2592000 seconds)',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Redis Cache onto the canvas',
    level2: 'Connect App Server to Cache. Sessions will be stored here with TTL.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Add Database for Session Persistence
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The Redis server crashed and restarted.",
  hook: "When it came back online, ALL 100 million sessions were gone! Users are logged out, carts empty. Chaos!",
  challenge: "Add a database for durable session backup. Redis for speed, DB for safety.",
  illustration: 'data-loss',
};

const step4Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Sessions are now safe!',
  achievement: 'Database provides durability, cache provides speed',
  metrics: [
    { label: 'Data durability', after: '100%' },
    { label: 'Recovery time', after: 'Instant' },
  ],
  nextTeaser: "But users in Europe see slow session loads...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Cache + Database: Speed AND Durability',
  conceptExplanation: `**Two-tier session storage**:

**Redis (Primary)**:
- ALL session operations hit Redis first
- Sub-millisecond latency
- Volatile (lost on crash without persistence)

**Database (Backup)**:
- Write-through: every session write also goes to DB
- Slow (10-50ms) but durable
- Used for recovery if Redis fails

**Write pattern**:
1. Create session → Write to Redis + DB
2. Update session → Update Redis + DB
3. Read session → Redis only (cache-aside)
4. Redis failure → Rebuild from DB

**Why both?**
- Speed: Redis handles 99% of reads (1ms)
- Safety: DB preserves sessions across failures
- Recovery: On Redis crash, reload from DB`,

  whyItMatters: 'Redis alone = fast but risky. Database alone = safe but slow. Together = fast AND safe.',

  famousIncident: {
    title: 'GitHub Session Store Outage',
    company: 'GitHub',
    year: '2016',
    whatHappened: 'A Redis cluster failure caused all user sessions to be lost. Millions of users were logged out simultaneously. Recovery took hours because session backups were incomplete.',
    lessonLearned: 'Always back up volatile caches to durable storage. Test recovery procedures regularly.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Billions of user sessions',
    howTheyDoIt: 'Uses Memcache for speed + MySQL for durability. Sessions written to both, read from cache only.',
  },

  keyPoints: [
    'Redis = speed (primary), Database = safety (backup)',
    'Write-through pattern: write to both',
    'Read-aside: read from Redis only',
    'On Redis failure: rebuild from database',
  ],

  quickCheck: {
    question: 'Why not just use Redis persistence (AOF/RDB) instead of a database?',
    options: [
      'Redis persistence is too slow',
      'Database provides better recovery, querying, and backup options',
      'Redis can\'t do persistence',
      'Databases are required by law',
    ],
    correctIndex: 1,
    explanation: 'While Redis has persistence, databases offer better recovery guarantees, SQL querying, and backup/restore capabilities.',
  },

  keyConcepts: [
    { title: 'Write-Through', explanation: 'Write to cache and DB simultaneously', icon: '📝' },
    { title: 'Cache-Aside', explanation: 'Read from cache only, not DB', icon: '📖' },
    { title: 'Durability', explanation: 'Data survives crashes', icon: '🛡️' },
  ],
};

const step4: GuidedStep = {
  id: 'session-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Sessions must survive failures',
    taskDescription: 'Add Database for session durability',
    componentsNeeded: [
      { type: 'database', reason: 'Durable backup for sessions', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Database component',
    level2: 'Connect App Server to Database. Sessions will be backed up here.',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Cross-Region Deployment
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your platform is going global! Users in Europe, Asia, and US.",
  hook: "A user in Tokyo experiences 500ms latency for every session read. They're connecting to a US server!",
  challenge: "Deploy session services in multiple regions to serve users locally.",
  illustration: 'global-latency',
};

const step5Celebration: CelebrationContent = {
  emoji: '🌎',
  message: 'Now serving users globally!',
  achievement: 'Multi-region deployment reduces latency',
  metrics: [
    { label: 'Tokyo latency', before: '500ms', after: '10ms' },
    { label: 'Europe latency', before: '200ms', after: '8ms' },
    { label: 'Regions', after: '3 (US, EU, Asia)' },
  ],
  nextTeaser: "But sessions created in US aren't visible in Europe...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Deployment',
  conceptExplanation: `**Why multi-region?**

Network latency across continents:
- US ↔ Europe: 100-200ms
- US ↔ Asia: 200-500ms
- Within region: 5-20ms

**Multi-region architecture**:
- Deploy complete stack in each region
- Users route to nearest region
- Each region has own Redis + DB
- Regions must replicate sessions between them

**Benefits**:
- Low latency (users hit local servers)
- Fault isolation (US down doesn't affect EU)
- Regulatory compliance (data residency)

**Challenge**: How to keep sessions in sync?`,

  whyItMatters: 'Global users demand local performance. Single-region = bad UX for 90% of users.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Serving customers in 180+ countries',
    howTheyDoIt: 'Deploys session stores in 20+ AWS regions. Route 53 routes users to nearest region.',
  },

  keyPoints: [
    'Deploy full stack in each major region',
    'Route users to geographically nearest region',
    'Each region is independent but must replicate',
    'Failover between regions if one fails',
  ],

  quickCheck: {
    question: 'What\'s the main benefit of multi-region deployment?',
    options: [
      'It\'s cheaper',
      'Reduced latency by serving users from nearby servers',
      'Better security',
      'Easier to manage',
    ],
    correctIndex: 1,
    explanation: 'Serving users from a nearby region (10ms) vs cross-continent (200ms) dramatically improves performance.',
  },

  keyConcepts: [
    { title: 'Region', explanation: 'Geographic deployment location (US-East, EU-West, etc.)', icon: '🌍' },
    { title: 'Geo-Routing', explanation: 'Route users to nearest region', icon: '🗺️' },
    { title: 'Data Residency', explanation: 'Store data in specific regions (GDPR)', icon: '📍' },
  ],
};

const step5: GuidedStep = {
  id: 'session-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Cross-region access',
    taskDescription: 'Deploy your session service in multiple regions',
    successCriteria: [
      'Configure multi-region deployment',
      'At least 2 regions (US, EU)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Configure multi-region deployment in app server settings',
    level2: 'Set regions to at least 2 (US, EU) for global coverage',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Session Replication Across Regions
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "A user logs in from New York, then opens the app in London 2 hours later.",
  hook: "London server says 'Session not found' - they have to log in again! Each region has its own isolated sessions.",
  challenge: "Implement cross-region session replication so users can access their session globally.",
  illustration: 'replication-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Sessions now replicate globally!',
  achievement: 'Cross-region replication ensures global session access',
  metrics: [
    { label: 'Cross-region availability', after: '100%' },
    { label: 'Replication lag', after: '<2 seconds' },
  ],
  nextTeaser: "But what happens if the US region goes down completely?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cross-Region Session Replication',
  conceptExplanation: `**Session replication strategies**:

**1. Active-Passive (Simple)**:
- One "home" region owns the session
- Other regions replicate asynchronously
- Reads can happen anywhere
- Writes go to home region

**2. Active-Active (Complex)**:
- Any region can write
- Conflict resolution needed
- Last-write-wins or CRDTs
- Higher complexity but better UX

**3. Sticky Sessions (Anti-pattern)**:
- User always routes to same region
- No replication needed
- Fails if that region goes down
- Not truly global

**Best for session store: Active-Passive with async replication**:
1. Session created in US (primary region)
2. Async replication to EU, Asia (1-2 seconds)
3. Reads from any region (eventual consistency OK)
4. Updates go to primary, then replicate`,

  whyItMatters: 'Users travel, use VPNs, or access from multiple devices. Sessions must follow them globally.',

  famousIncident: {
    title: 'AWS DynamoDB Global Tables Launch',
    company: 'Amazon',
    year: '2017',
    whatHappened: 'Before global tables, teams built custom replication. One e-commerce site had sessions fail to replicate during Black Friday, causing duplicate orders and cart corruption.',
    lessonLearned: 'Use proven multi-region replication systems. Custom solutions fail under stress.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Users listening in multiple countries',
    howTheyDoIt: 'Uses Cassandra with multi-datacenter replication. Sessions include playback state, playlists. Replication lag < 1 second.',
  },

  diagram: `
┌──────────────────────────────────────────────────┐
│          CROSS-REGION REPLICATION                │
├──────────────────────────────────────────────────┤
│                                                  │
│  US Region (Primary)                             │
│  ┌────────────┐                                  │
│  │   Redis    │ ───┐                             │
│  │  (Session) │    │ Async Replication           │
│  └────────────┘    │ (1-2 seconds)               │
│                    │                             │
│  ┌────────────┐    │                             │
│  │ PostgreSQL │    │                             │
│  │  (Backup)  │    │                             │
│  └────────────┘    │                             │
│                    │                             │
│                    ▼                             │
│  EU Region         ┌────────────┐                │
│                    │   Redis    │                │
│                    │ (Replica)  │                │
│                    └────────────┘                │
│                    ┌────────────┐                │
│                    │ PostgreSQL │                │
│                    │ (Replica)  │                │
│                    └────────────┘                │
└──────────────────────────────────────────────────┘
`,

  keyPoints: [
    'Active-Passive: one primary region, others replicate',
    'Async replication: 1-2 second lag is acceptable',
    'Read from any region (eventual consistency)',
    'Write to primary region, then replicate',
    'Database replication for durability',
  ],

  quickCheck: {
    question: 'Why is eventual consistency acceptable for session replication?',
    options: [
      'It\'s cheaper',
      'Users rarely switch regions instantly, so 1-2 second delay is fine',
      'Strong consistency is impossible across regions',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Users don\'t teleport between continents. A 1-2 second replication delay is unnoticeable in practice.',
  },

  keyConcepts: [
    { title: 'Active-Passive', explanation: 'One primary region, others replicate', icon: '👑' },
    { title: 'Async Replication', explanation: 'Background sync with lag', icon: '🔄' },
    { title: 'Eventual Consistency', explanation: 'Data becomes consistent after delay', icon: '⏱️' },
  ],
};

const step6: GuidedStep = {
  id: 'session-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Session replication across regions',
    taskDescription: 'Enable database and cache replication for cross-region session access',
    successCriteria: [
      'Enable database replication with 2+ replicas',
      'Configure cache for cross-region replication',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click Database and enable replication',
    level2: 'Set at least 2 replicas for cross-region durability',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Automatic Failover
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚨',
  scenario: "ALERT: The US-East region is down! AWS outage!",
  hook: "All users in the US region see 'Service Unavailable'. Sessions are inaccessible for 20 million users!",
  challenge: "Implement automatic failover so sessions remain accessible from other regions.",
  illustration: 'region-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Failover working perfectly!',
  achievement: 'Sessions survive regional failures',
  metrics: [
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Failover time', after: '<30 seconds' },
    { label: 'Data loss', after: 'Zero' },
  ],
  nextTeaser: "Now let's add load balancing for peak traffic...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Automatic Failover for High Availability',
  conceptExplanation: `**Failover scenarios**:

**Database failover**:
- Primary region goes down
- Promote a replica to primary (30-60 seconds)
- Redirect writes to new primary
- Reads continue from replicas

**Cache failover**:
- Redis cluster down in one region
- Route to nearest healthy region
- Rebuild cache from database if needed
- Temporary degraded performance OK

**Multi-region failover architecture**:
1. Health checks detect region failure
2. DNS/Load balancer routes traffic away
3. Promote database replica in healthy region
4. Sessions continue working (slight delay)

**Why it works**:
- Sessions replicated to multiple regions
- No single point of failure
- Automatic detection and recovery`,

  whyItMatters: 'Regional failures happen. AWS, Azure, GCP all have outages. Your session store must survive.',

  famousIncident: {
    title: 'AWS US-East-1 Outage',
    company: 'AWS/Multiple Companies',
    year: '2020',
    whatHappened: 'Kinesis service failure cascaded to other services in US-East-1 for 9 hours. Companies with multi-region failover (like Netflix) stayed online. Single-region companies went down.',
    lessonLearned: 'Multi-region with automatic failover is essential for high availability. US-East-1 fails regularly.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'AWS region failures',
    howTheyDoIt: 'Deploys across 3+ AWS regions. Chaos Monkey randomly kills instances/regions to test failover. Sub-minute recovery time.',
  },

  diagram: `
┌──────────────────────────────────────────────────┐
│         FAILOVER ARCHITECTURE                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  Normal Operation:                               │
│  US Region (Primary) ◀── Writes                  │
│    ├─ Redis Primary                              │
│    └─ DB Primary                                 │
│                                                  │
│  EU Region (Replica) ◀── Reads                   │
│    ├─ Redis Replica                              │
│    └─ DB Replica                                 │
│                                                  │
│  ─────────────────────────────────────────────  │
│                                                  │
│  After US Region Fails:                          │
│  US Region ✗ OFFLINE                             │
│                                                  │
│  EU Region (Promoted) ◀── Writes + Reads         │
│    ├─ Redis Primary (promoted)                   │
│    └─ DB Primary (promoted)                      │
│                                                  │
│  Failover time: 30 seconds                       │
└──────────────────────────────────────────────────┘
`,

  keyPoints: [
    'Health checks detect region failures',
    'Automatic promotion of replicas to primary',
    'DNS/routing redirects traffic to healthy region',
    'Sessions preserved due to replication',
    'Failover time: 30-60 seconds typical',
  ],

  quickCheck: {
    question: 'Why does failover work without data loss?',
    options: [
      'Sessions are stored in the cloud',
      'Replicas already have session data from replication',
      'Sessions are automatically backed up',
      'DNS caches the data',
    ],
    correctIndex: 1,
    explanation: 'Because sessions are continuously replicated to multiple regions, replicas already have the data when primary fails.',
  },

  keyConcepts: [
    { title: 'Failover', explanation: 'Automatic switch to backup when primary fails', icon: '🔄' },
    { title: 'Replica Promotion', explanation: 'Replica becomes new primary', icon: '👑' },
    { title: 'Health Checks', explanation: 'Monitor system health and detect failures', icon: '💓' },
  ],
};

const step7: GuidedStep = {
  id: 'session-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Automatic failover',
    taskDescription: 'Ensure your replication setup supports automatic failover',
    successCriteria: [
      'Database replication enabled (from Step 6)',
      'Multi-region deployment configured (from Step 5)',
      'System can survive region failure',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Your replication setup from Step 6 enables failover',
    level2: 'With database replicas and multi-region deployment, failover is automatic',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer for Traffic Distribution
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚦',
  scenario: "Black Friday! Traffic just hit 3 million requests per second!",
  hook: "Your session service is overwhelmed. Users see timeouts and errors.",
  challenge: "Add a load balancer to distribute traffic across multiple app servers.",
  illustration: 'traffic-overload',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Traffic distributed smoothly!',
  achievement: 'Load balancer handles millions of requests per second',
  metrics: [
    { label: 'Peak RPS', before: '100K', after: '3M' },
    { label: 'Error rate', before: '15%', after: '0.1%' },
  ],
  nextTeaser: "Almost there! Time to complete the final optimization...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for Session Services',
  conceptExplanation: `**Why load balancers for sessions?**

Single server limits:
- 10K-50K RPS per server
- Need 100+ servers for millions of RPS
- Load balancer distributes across all servers

**Session-specific considerations**:
1. **Stateless servers** - session in Redis, not server memory
2. **Any server can handle any request** - no sticky sessions needed
3. **Health checks** - remove failed servers automatically

**Load balancing algorithms**:
- **Round-robin**: Simple rotation
- **Least connections**: Send to least busy server
- **IP hash**: NOT recommended for sessions (sticky = bad)

**Benefits**:
- Horizontal scaling (add more servers)
- No single point of failure
- Automatic failure detection`,

  whyItMatters: 'At 1.5M reads/sec peak, you need 50+ app servers. Load balancer makes this work.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling billions of session operations',
    howTheyDoIt: 'Uses AWS ELB distributing across hundreds of session service instances. Auto-scales based on CPU and request rate.',
  },

  keyPoints: [
    'Load balancer distributes traffic across servers',
    'Stateless servers = no sticky sessions needed',
    'Health checks remove failed servers',
    'Enables horizontal scaling',
  ],

  quickCheck: {
    question: 'Why are sticky sessions (session affinity) an anti-pattern?',
    options: [
      'They\'re too slow',
      'They create single points of failure and prevent true scaling',
      'They\'re not secure',
      'They\'re too expensive',
    ],
    correctIndex: 1,
    explanation: 'Sticky sessions tie users to specific servers. If that server dies, sessions are lost. Stateless design with shared storage is better.',
  },

  keyConcepts: [
    { title: 'Stateless', explanation: 'Server has no local state, only shared storage', icon: '🔄' },
    { title: 'Round-Robin', explanation: 'Distribute requests evenly across servers', icon: '🔁' },
    { title: 'Health Check', explanation: 'Monitor server health, remove failed ones', icon: '💓' },
  ],
};

const step8: GuidedStep = {
  id: 'session-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Add a Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 9: Final Exam - Complete Production System
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🏆',
  scenario: "Final exam! Your session store will be tested against production workloads.",
  hook: "Can your system handle 1.5M RPS, survive region failures, and maintain 99.99% availability?",
  challenge: "Optimize your architecture to pass all production test cases.",
  illustration: 'final-exam',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Congratulations! You built a distributed session store!',
  achievement: 'Production-ready session management system',
  metrics: [
    { label: 'Read RPS', after: '1.5M' },
    { label: 'Write RPS', after: '150K' },
    { label: 'Availability', after: '99.99%' },
    { label: 'P99 latency', after: '<10ms' },
    { label: 'Regions', after: 'Multi-region' },
  ],
  nextTeaser: "You've mastered distributed session management!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Production-Ready Session Store',
  conceptExplanation: `**Complete architecture review**:

**Layer 1: Traffic Management**
- Load Balancer: Distributes traffic
- Multiple app server instances
- Health checks and auto-scaling

**Layer 2: Session Storage**
- Redis: Primary session store (speed)
- PostgreSQL: Backup for durability
- Write-through caching pattern

**Layer 3: Global Distribution**
- Multi-region deployment
- Cross-region replication
- Automatic failover

**Layer 4: Reliability**
- Database replication (2+ replicas)
- Cache clusters (no single point of failure)
- Health monitoring

**Key metrics**:
- Read latency: p99 < 10ms
- Write latency: p99 < 50ms
- Availability: 99.99%
- Throughput: 1.5M reads/sec, 150K writes/sec`,

  whyItMatters: 'This is exactly what production session stores look like at scale. You\'ve built the real thing.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Global session management',
    howTheyDoIt: 'Uses Redis clusters in 12+ regions. Sessions include user state, ride info, payment methods. 99.99% availability with automatic failover.',
  },

  keyPoints: [
    'Multi-region for global performance',
    'Cache + DB for speed and durability',
    'Replication for failover',
    'Load balancing for scale',
    'All layers are redundant',
  ],

  keyConcepts: [
    { title: 'High Availability', explanation: '99.99% uptime - less than 5 min downtime/month', icon: '🛡️' },
    { title: 'Multi-Region', explanation: 'Deployed in multiple geographic regions', icon: '🌍' },
    { title: 'Failover', explanation: 'Automatic recovery from failures', icon: '🔄' },
  ],
};

const step9: GuidedStep = {
  id: 'session-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'Final Exam: All FRs + NFRs',
    taskDescription: 'Complete production system with all optimizations',
    successCriteria: [
      'Client → Load Balancer → App Server → Cache + Database',
      'Multi-region deployment',
      'Database replication enabled',
      'Multiple app server instances',
      'All test cases passing',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Ensure all components are configured: replication, multi-region, multiple instances',
    level2: 'Complete architecture: LB → App Servers (3+) → Redis + PostgreSQL (replicated)',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const distributedSessionStoreGuidedTutorial: GuidedTutorial = {
  problemId: 'distributed-session-store',
  title: 'Design Distributed Session Store',
  description: 'Build a global session management system with cross-region replication and automatic failover',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🔐',
    hook: "You've been hired as Lead Architect at GlobalCart!",
    scenario: "Your mission: Build a session store that serves 100 million users across the globe with 99.99% availability.",
    challenge: "Can you design a system that handles 1.5 million session reads per second and survives regional failures?",
  },

  requirementsPhase: sessionStoreRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],

  concepts: [
    'Session Management',
    'In-Memory Caching (Redis)',
    'Write-Through Caching',
    'Multi-Region Deployment',
    'Cross-Region Replication',
    'Automatic Failover',
    'Load Balancing',
    'Eventual Consistency',
    'Database Replication',
    'High Availability',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed System Troubles',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default distributedSessionStoreGuidedTutorial;
