import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * TinyURL - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Requirements evolve as the "business" grows, teaching iterative system design.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Shorten URLs
 * - FR-2: Redirect via short code
 * - Build: Client → Server → Database
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Unique codes (no collisions)
 * - NFR: Fast redirects
 * - Build: Add Cache, optimize code generation
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle 35K requests/sec
 * - NFR: High availability
 * - Build: Load Balancer, Database Replication, Rate Limiting
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - NFR: Global scale, analytics
 * - Build: CDN, Sharding, Analytics Pipeline
 *
 * This mirrors real-world evolution: Start simple, add features, then scale globally.
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a URL shortener like bit.ly or TinyURL",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Product Manager at LinkShort',
    avatar: '👩‍💼',
  },

  questions: [
    {
      id: 'shorten-urls',
      category: 'functional',
      question: "What's the main thing users want to do?",
      answer: "Users want to take a long URL and get a short one. They paste 'https://example.com/very/long/path' and get back 'short.ly/abc123'.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with the core user need",
    },
    {
      id: 'redirect',
      category: 'functional',
      question: "What happens when someone clicks the short URL?",
      answer: "They get redirected to the original long URL. Click 'short.ly/abc123' → go to 'https://example.com/very/long/path'.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "The redirect is the core functionality",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['shorten-urls', 'redirect'],
  criticalFRQuestionIds: ['shorten-urls', 'redirect'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can shorten URLs',
      description: 'Paste a long URL, get a short code back.',
      emoji: '✂️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Short URLs redirect to original',
      description: 'Clicking a short URL redirects to the original long URL.',
      emoji: '↪️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000',
    writesPerDay: '10,000 URLs',
    readsPerDay: '100,000 redirects',
    peakMultiplier: 2,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 0.1, peak: 1 },
    calculatedReadRPS: { average: 1, peak: 5 },
    maxPayloadSize: '~2KB',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~2GB',
    redirectLatencySLA: 'p99 < 500ms',
    createLatencySLA: 'p99 < 1s',
  },

  architecturalImplications: [
    '✅ Low volume → Simple architecture works',
    '✅ Client → Server → Database is enough',
  ],

  outOfScope: [
    'Unique code guarantees (Phase 2)',
    'Caching (Phase 2)',
    'High availability (Phase 3)',
    'Global scale (Phase 4)',
  ],

  keyInsight: "Start simple! Build a working URL shortener first. We'll add uniqueness guarantees, caching, and scaling as the product grows.",

  thinkingFramework: {
    title: "Phase 1: Make It Work",
    intro: "We have 2 simple requirements. Let's build the SIMPLEST system that works.",

    steps: [
      {
        id: 'what-apis',
        title: 'Step 1: What APIs?',
        alwaysAsk: "What operations does the user need?",
        whyItMatters: "FR-1 needs a create endpoint, FR-2 needs a redirect endpoint.",
        expertBreakdown: {
          intro: "Two endpoints:",
          points: [
            "POST /urls → Create short URL",
            "GET /:code → Redirect to original",
            "Simple request/response"
          ]
        },
        icon: '🔌',
        category: 'functional'
      },
      {
        id: 'what-store',
        title: 'Step 2: What Data?',
        alwaysAsk: "What do we need to store?",
        whyItMatters: "To redirect, we need to store the mapping: short_code → long_url.",
        expertBreakdown: {
          intro: "Simple mapping:",
          points: [
            "short_code (string)",
            "long_url (string)",
            "created_at (timestamp)",
            "One database table"
          ]
        },
        icon: '💾',
        category: 'data-flow'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → App Server → Database. Create URLs, store them, redirect.",
      whySimple: "This satisfies both FRs! Not optimized yet, but it WORKS.",
      nextStepPreview: "Step 1: Connect Client to App Server"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the product will evolve:",
    celebrationMessage: "Your basic URL shortener works!",
    hookMessage: "But what if two users get the same code? And redirects are slow...",
    steps: [
      {
        id: 'uniqueness',
        title: 'Phase 2: Uniqueness & Speed',
        question: "How do we guarantee unique codes?",
        whyItMatters: "Collisions cause wrong redirects",
        example: "Better code generation + caching",
        icon: '🔑'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale',
        question: "Can we handle viral URLs?",
        whyItMatters: "A viral tweet can get millions of clicks",
        example: "Load balancing, replication",
        icon: '📈'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to App Server (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to LinkShort! You're building their URL shortening service.",
  hook: "Marketing wants to share campaign URLs on Twitter, but they're too long! They need short URLs that fit in tweets.",
  challenge: "Set up the basic system: a server that can receive requests from users.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server is online!',
  achievement: 'Users can now send requests to your system',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive requests', after: '✓' },
  ],
  nextTeaser: "But where do we store the URLs?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Server Architecture',
  conceptExplanation: `Every web app starts with two parts:

**Client** - The user's browser or app
**Server** - Your backend that processes requests

When a user wants to shorten a URL:
1. Client sends the long URL to your server
2. Server generates a short code
3. Server returns the short URL to the client

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without a server, there\'s no way for users to interact with your system.',

  realWorldExample: {
    company: 'bit.ly',
    scenario: 'Handling URL shortening requests',
    howTheyDoIt: 'Their servers receive millions of requests per day, each one a simple request/response.',
  },

  keyPoints: [
    'Client sends requests',
    'Server processes and responds',
    'This is the foundation',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s browser or app', icon: '💻' },
    { title: 'Server', explanation: 'Your backend code', icon: '🖥️' },
  ],
};

const step1: GuidedStep = {
  id: 'tinyurl-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can shorten URLs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Users sending requests', displayName: 'Client' },
      { type: 'app_server', reason: 'Your backend', displayName: 'URL Service' },
    ],
    successCriteria: [
      'Client added',
      'App Server added',
      'Connected together',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server onto the canvas',
    level2: 'Connect them by clicking Client then App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Persistence (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💥',
  scenario: "Your server is working! But disaster strikes...",
  hook: "The server restarted overnight. When it came back up, ALL the shortened URLs were GONE! Users' links don't work anymore!",
  challenge: "The URLs were stored in memory. When the server restarted, everything vanished. We need persistent storage!",
  illustration: 'server-crash',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'URLs are now safely stored!',
  achievement: 'Data persists even if the server restarts',
  metrics: [
    { label: 'Data durability', before: 'Lost on restart', after: 'Persisted' },
    { label: 'Storage', after: 'Database' },
  ],
  nextTeaser: "Now let's implement the actual URL shortening logic...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Databases: Persistent Storage',
  conceptExplanation: `**The Problem:**
Server memory (RAM) is volatile. Restart = data gone.

**The Solution:**
Store data in a database. Databases write to disk:
- Survives server restarts
- Survives crashes
- Can be backed up

**What we store:**
\`\`\`sql
CREATE TABLE urls (
  short_code VARCHAR(10) PRIMARY KEY,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP
);
\`\`\`

Simple table: short_code → long_url mapping.`,

  whyItMatters: 'Without a database, all your data disappears when the server restarts!',

  famousIncident: {
    title: 'MySpace Lost 12 Years of Music',
    company: 'MySpace',
    year: '2019',
    whatHappened: 'During a server migration, MySpace accidentally deleted 50 million songs. No proper backups existed.',
    lessonLearned: 'Always have persistent storage with backups.',
    icon: '🎵',
  },

  realWorldExample: {
    company: 'Bitly',
    scenario: 'Storing billions of URL mappings',
    howTheyDoIt: 'Uses MySQL for metadata. Each URL mapping is a simple row.',
  },

  keyPoints: [
    'RAM is volatile, databases persist',
    'Simple key-value: short_code → long_url',
    'Database survives restarts',
  ],

  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives restarts', icon: '💾' },
    { title: 'Primary Key', explanation: 'Unique identifier (short_code)', icon: '🔑' },
  ],
};

const step2: GuidedStep = {
  id: 'tinyurl-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Store URL mappings persistently',
    taskDescription: 'Add a Database to store URL mappings',
    componentsNeeded: [
      { type: 'database', reason: 'Store URLs persistently', displayName: 'URLs DB' },
    ],
    successCriteria: [
      'Database added',
      'App Server connected to Database',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database onto the canvas',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Implement URL Shortening Logic (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚙️',
  scenario: "You have the infrastructure, but the server doesn't know HOW to shorten URLs!",
  hook: "It's just an empty shell. We need to write the actual logic: generate codes, store mappings, handle redirects.",
  challenge: "Implement the API handlers that make URL shortening work.",
  illustration: 'code-editor',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Your URL shortener works!',
  achievement: 'Users can create short URLs and get redirected',
  metrics: [
    { label: 'Create URLs', after: '✓ Working' },
    { label: 'Redirects', after: '✓ Working' },
    { label: 'Data persists', after: '✓' },
  ],
  nextTeaser: "But wait... what if two users get the same code?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation',
  conceptExplanation: `**Two endpoints to implement:**

**POST /api/v1/urls** - Create short URL
\`\`\`python
def shorten_url(long_url):
    code = generate_random_code()  # e.g., "abc123"
    db.save(code, long_url)
    return {"short_url": f"short.ly/{code}"}
\`\`\`

**GET /api/v1/urls/:code** - Redirect
\`\`\`python
def redirect(code):
    long_url = db.get(code)
    if not long_url:
        return 404
    return redirect_to(long_url)
\`\`\`

Simple code generation for now - we'll improve it in Phase 2.`,

  whyItMatters: 'Without the logic, your server is just an empty shell.',

  realWorldExample: {
    company: 'TinyURL',
    scenario: 'The original URL shortener',
    howTheyDoIt: 'Simple hash-based codes stored in a database. Billions of redirects served.',
  },

  keyPoints: [
    'POST creates new short URLs',
    'GET redirects to original',
    'Simple random code generation',
  ],

  keyConcepts: [
    { title: 'Code Generation', explanation: 'Create unique short codes', icon: '🔑' },
    { title: 'Redirect', explanation: 'HTTP 301/302 to original URL', icon: '↪️' },
  ],
};

const step3: GuidedStep = {
  id: 'tinyurl-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Implement shortening and redirect',
    taskDescription: 'Configure APIs and implement the logic',
    successCriteria: [
      'Assign POST /api/v1/urls API',
      'Assign GET /api/v1/urls/:code API',
      'Implement handlers',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server to configure APIs',
    level2: 'Assign both endpoints, then implement the handlers',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 2 TRANSITION: New Challenges!
// =============================================================================

// =============================================================================
// STEP 4: Add Unique Code Generation (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💥',
  scenario: "Phase 2 begins! Your URL shortener is getting popular, but there's a problem...",
  hook: "Two users just got the same short code! User A's link now redirects to User B's URL. This is a disaster!",
  challenge: "NEW REQUIREMENT: FR-3 - Each short code must be unique. No collisions allowed!",
  illustration: 'collision',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔑',
  message: 'Codes are now guaranteed unique!',
  achievement: 'No more collisions - each code maps to exactly one URL',
  metrics: [
    { label: 'Collisions', before: 'Possible', after: '0%' },
    { label: 'Code generation', after: 'Counter-based' },
  ],
  nextTeaser: "But redirects are slow. Every click hits the database...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Unique Code Generation',

  frameworkReminder: {
    question: "What if two users get the same code?",
    connection: "FR-3 says each code must be unique. Random codes can collide. We need a better strategy."
  },

  conceptExplanation: `**NEW FR-3: Each short code must be unique**

**The Problem with Random:**
- Random("abc123") might already exist
- Check-and-retry is slow and can still collide under load

**Better Approaches:**

**1. Counter-based (Simple)**
\`\`\`
Counter: 1, 2, 3... → Base62: "1", "2", "3"... "a", "b"...
\`\`\`
Guaranteed unique, but predictable.

**2. Snowflake ID (Better)**
\`\`\`
timestamp + machine_id + sequence
\`\`\`
Unique across distributed systems.

**3. Hash with collision handling**
\`\`\`
hash(url)[:7] + check DB + retry if collision
\`\`\``,

  whyItMatters: 'Collisions mean users get redirected to the wrong URL. This destroys trust!',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Generating unique tweet IDs',
    howTheyDoIt: 'Uses Snowflake IDs - 64-bit unique IDs generated at 10,000+ per second per machine.',
  },

  keyPoints: [
    'Random codes can collide',
    'Counter-based is simple and safe',
    'Snowflake for distributed systems',
  ],

  keyConcepts: [
    { title: 'Base62', explanation: 'a-z, A-Z, 0-9 = 62 characters', icon: '🔤' },
    { title: 'Snowflake', explanation: 'Distributed unique ID generation', icon: '❄️' },
  ],
};

const step4: GuidedStep = {
  id: 'tinyurl-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Each short code must be unique',
    taskDescription: 'Update code generation to guarantee uniqueness',
    successCriteria: [
      'Use counter-based or hash-based code generation',
      'Ensure no collisions possible',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Update the code generation logic in your handler',
    level2: 'Use an auto-incrementing counter converted to Base62',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Cache for Fast Redirects (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your URL shortener is working great, but users are complaining...",
  hook: "'Why does it take 200ms to redirect?' Every single click hits the database. For viral URLs clicked thousands of times per minute, this is wasteful!",
  challenge: "Add caching to make redirects lightning fast.",
  illustration: 'slow-turtle',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Redirects are now instant!',
  achievement: 'Hot URLs served from cache in milliseconds',
  metrics: [
    { label: 'Redirect latency', before: '200ms', after: '2ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'DB load reduced', after: '95%' },
  ],
  nextTeaser: "Phase 2 Complete! But what happens when a URL goes viral?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching for Performance',

  frameworkReminder: {
    question: "How do we make redirects fast?",
    connection: "URL shorteners are read-heavy. A viral URL might get millions of clicks. Caching avoids hitting the database every time."
  },

  conceptExplanation: `**The Math:**
- Database query: 10-50ms
- Cache lookup: 1-5ms
- That's **10-50x faster!**

**Cache-Aside Pattern:**
1. User clicks short URL
2. Check cache: Is "abc123" in Redis?
3. **HIT**: Return immediately (2ms)
4. **MISS**: Query DB, store in cache, return

**Why it works for URL shorteners:**
- URLs are immutable (never change)
- Read-heavy (100:1 read/write)
- Hot URLs get clicked repeatedly`,

  whyItMatters: 'At scale, every database query costs time and money. Caching is essential.',

  famousIncident: {
    title: 'Facebook Cache Stampede',
    company: 'Facebook',
    year: '2010',
    whatHappened: 'Cache servers restarted, millions of requests hit the database simultaneously, causing a cascade failure.',
    lessonLearned: 'Caching isn\'t optional at scale.',
    icon: '🏃',
  },

  realWorldExample: {
    company: 'Twitter (t.co)',
    scenario: 'Viral tweet links',
    howTheyDoIt: 'Redis cache for hot links. Celebrity tweets get millions of clicks - all from cache.',
  },

  keyPoints: [
    'Cache-aside: check cache first',
    'TTL prevents stale data',
    '95%+ hit rate is achievable',
  ],

  keyConcepts: [
    { title: 'Cache', explanation: 'Fast in-memory storage', icon: '⚡' },
    { title: 'TTL', explanation: 'Time-to-live before expiry', icon: '⏰' },
  ],
};

const step5: GuidedStep = {
  id: 'tinyurl-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'NFR: Fast redirects (< 10ms)',
    taskDescription: 'Add a Cache for fast URL lookups',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache hot URLs', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache added',
      'App Server connected to Cache',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Cache component',
    level2: 'Connect App Server to Cache',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Phase 2 Wrap-up (Implement Caching Logic)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '✅',
  scenario: "You've added the cache infrastructure. Now implement the caching logic!",
  hook: "The cache is connected but empty. We need to implement cache-aside pattern in our code.",
  challenge: "Update handlers to check cache first, then database.",
  illustration: 'code-editor',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Your URL shortener is optimized!',
  achievement: 'Unique codes + fast cached redirects',
  metrics: [
    { label: 'Unique codes', after: '✓ Guaranteed' },
    { label: 'Cache', after: '✓ Implemented' },
    { label: 'Performance', after: '10x faster' },
  ],
  nextTeaser: "Phase 3: What happens when you go viral?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Implementing Cache-Aside',
  conceptExplanation: `**Update your redirect handler:**

\`\`\`python
def redirect(code):
    # 1. Check cache first
    long_url = cache.get(code)

    if long_url:
        return redirect_to(long_url)  # Cache HIT!

    # 2. Cache miss - query database
    long_url = db.get(code)

    if not long_url:
        return 404

    # 3. Store in cache for next time
    cache.set(code, long_url, ttl=3600)

    return redirect_to(long_url)
\`\`\`

**On URL creation, pre-warm cache:**
\`\`\`python
def shorten_url(long_url):
    code = generate_unique_code()
    db.save(code, long_url)
    cache.set(code, long_url, ttl=3600)  # Pre-warm
    return code
\`\`\``,

  whyItMatters: 'Without caching logic, the cache infrastructure is useless.',

  realWorldExample: {
    company: 'Instagram',
    scenario: 'Caching user profiles',
    howTheyDoIt: 'Cache-aside pattern. Hot profiles stay in cache, cold profiles fetched from DB.',
  },

  keyPoints: [
    'Check cache first',
    'On miss, query DB and cache result',
    'Pre-warm cache on creation',
  ],

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'App manages cache explicitly', icon: '📦' },
    { title: 'Pre-warming', explanation: 'Cache on write, not just read', icon: '🔥' },
  ],
};

const step6: GuidedStep = {
  id: 'tinyurl-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'NFR: Implement caching logic',
    taskDescription: 'Update handlers to use cache-aside pattern',
    successCriteria: [
      'Check cache before database',
      'Cache results on miss',
      'Pre-warm cache on creation',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Update the redirect handler to check cache first',
    level2: 'Add cache.get() before db.get(), and cache.set() after db.get()',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Scale!
// =============================================================================

// =============================================================================
// STEP 7: Add Load Balancer (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Phase 3 begins! Your URL shortener got featured on Hacker News!",
  hook: "Traffic surged to 35,000 requests/second! Your single server is overwhelmed. Users are getting timeouts!",
  challenge: "Add load balancing to distribute traffic across multiple servers.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Traffic is now distributed!',
  achievement: 'Multiple servers share the load',
  metrics: [
    { label: 'Servers', before: '1', after: '3+' },
    { label: 'Capacity', after: '35K req/sec' },
    { label: 'Availability', after: 'Improved' },
  ],
  nextTeaser: "But what if the database fails?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing',

  frameworkReminder: {
    question: "Can we handle 35K requests/second?",
    connection: "One server handles ~1-5K req/sec. At 35K, we need multiple servers with a load balancer."
  },

  conceptExplanation: `**The Problem:**
One server can handle ~1,000-5,000 requests/second.
At 35K req/sec, a single server melts.

**The Solution: Load Balancer**
- Distributes requests across multiple servers
- If one server dies, traffic goes to others
- Can add/remove servers dynamically

**Load Balancing Strategies:**
- **Round Robin**: Rotate through servers
- **Least Connections**: Send to least busy server
- **IP Hash**: Same user → same server (session affinity)`,

  whyItMatters: 'Single servers have limits. Load balancing enables horizontal scaling.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Streaming to 200M users',
    howTheyDoIt: 'Multiple load balancer layers. AWS ELB at the edge, custom Zuul for microservices.',
  },

  keyPoints: [
    'Distribute traffic across servers',
    'Horizontal scaling',
    'Fault tolerance',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '➕' },
  ],
};

const step7: GuidedStep = {
  id: 'tinyurl-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle 35K requests/second',
    taskDescription: 'Add a Load Balancer in front of your servers',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client connects to Load Balancer',
      'Load Balancer connects to App Servers',
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
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server',
    level2: 'Client → Load Balancer → App Server(s)',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Database Replication (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your database crashed!",
  hook: "All URL lookups are failing. Redirects return 500 errors. Users can't access their shortened URLs!",
  challenge: "Add database replication for high availability.",
  illustration: 'database-crash',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now highly available!',
  achievement: 'System survives database failures',
  metrics: [
    { label: 'DB replicas', after: '2+' },
    { label: 'Availability', after: '99.9%' },
    { label: 'Failover', after: 'Automatic' },
  ],
  nextTeaser: "What about protecting from abuse?",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication',

  frameworkReminder: {
    question: "What if the database fails?",
    connection: "Single database = single point of failure. Replication provides redundancy."
  },

  conceptExplanation: `**The Problem:**
Single database = single point of failure.
If it crashes, your entire service goes down.

**The Solution: Replication**
- **Primary**: Handles writes
- **Replicas**: Handle reads, ready for failover
- If primary dies, a replica becomes primary

**Read/Write Split:**
- Writes → Primary only
- Reads → Any replica (faster, distributed)

For TinyURL (read-heavy):
- 99% of traffic is redirects (reads)
- Replicas handle most load`,

  whyItMatters: 'Users expect 24/7 availability. Replication provides fault tolerance.',

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Always-available code hosting',
    howTheyDoIt: 'MySQL with 3 replicas per cluster. Automatic failover in < 30 seconds.',
  },

  keyPoints: [
    'Primary for writes',
    'Replicas for reads',
    'Automatic failover',
  ],

  keyConcepts: [
    { title: 'Primary', explanation: 'Main DB for writes', icon: '👑' },
    { title: 'Replica', explanation: 'Copy for reads and failover', icon: '📋' },
  ],
};

const step8: GuidedStep = {
  id: 'tinyurl-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: High availability (99.9%)',
    taskDescription: 'Configure database replication',
    successCriteria: [
      'Enable database replication',
      'Configure at least 2 replicas',
    ],
  },

  celebration: step8Celebration,

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
    level1: 'Click on Database to configure replication',
    level2: 'Enable replication with 2+ replicas',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Add Rate Limiting (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🚦',
  scenario: "A spammer discovered your service!",
  hook: "Someone is creating millions of URLs per hour, overwhelming your system. Other users can't create URLs anymore!",
  challenge: "Add rate limiting to protect against abuse.",
  illustration: 'spam-attack',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Your system is production-ready!',
  achievement: 'Scalable, available, and protected',
  metrics: [
    { label: 'Scale', after: '35K req/sec' },
    { label: 'Availability', after: '99.9%' },
    { label: 'Protection', after: 'Rate limited' },
  ],
  nextTeaser: "Phase 4: Go global!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting',

  frameworkReminder: {
    question: "How do we protect against abuse?",
    connection: "Without rate limiting, a single bad actor can overwhelm your service."
  },

  conceptExplanation: `**The Problem:**
Without limits, abusers can:
- Create millions of spam URLs
- DDoS your service
- Exhaust your resources

**Rate Limiting Strategies:**

**Token Bucket:**
- Each user gets N tokens
- Each request consumes 1 token
- Tokens replenish over time

**Sliding Window:**
- Track requests in time window
- Reject if over limit

**Common Limits:**
- 100 URL creations per hour per IP
- 1000 redirects per minute per IP`,

  whyItMatters: 'Rate limiting protects your service from abuse and ensures fair usage.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'API rate limiting',
    howTheyDoIt: '300 tweets/3 hours per user. Token bucket algorithm with Redis.',
  },

  keyPoints: [
    'Limit requests per user/IP',
    'Token bucket or sliding window',
    'Return 429 Too Many Requests',
  ],

  keyConcepts: [
    { title: 'Rate Limit', explanation: 'Max requests per time period', icon: '🚦' },
    { title: 'Token Bucket', explanation: 'Tokens replenish over time', icon: '🪣' },
  ],
};

const step9: GuidedStep = {
  id: 'tinyurl-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Protect against abuse',
    taskDescription: 'Add rate limiting to your API',
    successCriteria: [
      'Configure rate limiting on Load Balancer or App Server',
      'Set limits for URL creation',
    ],
  },

  celebration: step9Celebration,

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
    level1: 'Configure rate limiting on the Load Balancer',
    level2: 'Set 100 creations/hour, 1000 redirects/minute',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 4: EXPERT - Global Scale
// =============================================================================

// =============================================================================
// STEP 10: Add CDN for Global Performance (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🌍',
  scenario: "Phase 4 begins! LinkShort is going global!",
  hook: "Users in Europe complain about 500ms latency. Your servers are in US-East. Every request crosses the Atlantic!",
  challenge: "Add a CDN to serve users from the nearest location.",
  illustration: 'global-map',
};

const step10Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Global performance achieved!',
  achievement: 'Users served from nearest edge location',
  metrics: [
    { label: 'EU latency', before: '500ms', after: '50ms' },
    { label: 'Edge locations', after: '200+' },
  ],
  nextTeaser: "What about database scaling?",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Content Delivery Networks (CDN)',

  frameworkReminder: {
    question: "How do we serve global users fast?",
    connection: "Light travels at 200km/ms in fiber. US to Europe = 7000km = 35ms minimum. CDNs put content closer."
  },

  conceptExplanation: `**The Problem:**
- Your servers are in one location
- Global users have high latency
- Physics: light travels 200km/ms in fiber

**The Solution: CDN**
- Servers at 200+ edge locations worldwide
- Cache content at the edge
- Users hit nearest server

**For URL Shortener:**
- Cache URL mappings at edge
- Redirect from edge (no round trip to origin)
- 10x faster for global users`,

  whyItMatters: 'Global users expect fast response. CDNs eliminate geography.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving 25M+ websites',
    howTheyDoIt: '200+ edge locations. Cache at edge, route to origin only on miss.',
  },

  keyPoints: [
    'Edge servers worldwide',
    'Cache content close to users',
    'Reduces latency dramatically',
  ],

  keyConcepts: [
    { title: 'CDN', explanation: 'Content Delivery Network', icon: '🌐' },
    { title: 'Edge', explanation: 'Server near users', icon: '📍' },
  ],
};

const step10: GuidedStep = {
  id: 'tinyurl-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: Global performance',
    taskDescription: 'Add a CDN for edge caching',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache at edge locations', displayName: 'CDN' },
    ],
    successCriteria: [
      'CDN added',
      'Client connects through CDN',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add CDN between Client and Load Balancer',
    level2: 'Client → CDN → Load Balancer',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
    ],
  },
};

// =============================================================================
// STEP 11: Add Database Sharding (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '📊',
  scenario: "You now have 10 billion URLs in your database!",
  hook: "The database is huge. Queries are slow, backups take hours. One machine can't handle it anymore.",
  challenge: "Shard the database to distribute data across multiple machines.",
  illustration: 'big-data',
};

const step11Celebration: CelebrationContent = {
  emoji: '🗃️',
  message: 'Database is now sharded!',
  achievement: 'Data distributed across multiple machines',
  metrics: [
    { label: 'Total URLs', after: '10B+' },
    { label: 'Shards', after: '16+' },
    { label: 'Per-shard size', after: 'Manageable' },
  ],
  nextTeaser: "One more thing: analytics!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Database Sharding',

  frameworkReminder: {
    question: "What if the database gets too big?",
    connection: "10 billion rows don't fit on one machine. Sharding splits data across multiple databases."
  },

  conceptExplanation: `**The Problem:**
- 10 billion URLs = ~5TB of data
- Single machine can't handle it
- Queries slow down, backups fail

**The Solution: Sharding**
- Split data across multiple databases
- Each shard holds a portion of data
- Route queries to correct shard

**Sharding Strategies:**
- **Hash**: hash(short_code) % num_shards
- **Range**: a-m → shard1, n-z → shard2
- **Geographic**: US → shard1, EU → shard2

For TinyURL, hash sharding works well:
\`\`\`
shard = hash(short_code) % 16
\`\`\``,

  whyItMatters: 'Single databases have limits. Sharding enables unlimited scale.',

  realWorldExample: {
    company: 'Pinterest',
    scenario: 'Storing billions of pins',
    howTheyDoIt: 'Hash-based sharding with 4096 virtual shards mapped to physical servers.',
  },

  keyPoints: [
    'Split data across machines',
    'Route queries to correct shard',
    'Hash sharding for even distribution',
  ],

  keyConcepts: [
    { title: 'Shard', explanation: 'Partition of data', icon: '🗃️' },
    { title: 'Shard Key', explanation: 'Determines which shard', icon: '🔑' },
  ],
};

const step11: GuidedStep = {
  id: 'tinyurl-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle billions of URLs',
    taskDescription: 'Configure database sharding',
    successCriteria: [
      'Enable sharding on database',
      'Configure shard key (short_code)',
      'Set up 16+ shards',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Configure sharding on the Database',
    level2: 'Use short_code as shard key with hash strategy',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Add Analytics Pipeline (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '📈',
  scenario: "Marketing wants analytics! How many clicks per URL? Where are users from?",
  hook: "Adding analytics to the hot path would slow down redirects. We need a separate analytics pipeline.",
  challenge: "Add async analytics without impacting redirect performance.",
  illustration: 'analytics',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered TinyURL system design!',
  achievement: 'From simple URL shortener to global-scale system with analytics',
  metrics: [
    { label: 'URLs', after: '10B+' },
    { label: 'Requests/sec', after: '35K+' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Global latency', after: '< 50ms' },
    { label: 'Analytics', after: 'Real-time' },
  ],
  nextTeaser: "You've completed the TinyURL journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Analytics Pipeline',

  frameworkReminder: {
    question: "How do we add analytics without slowing redirects?",
    connection: "Synchronous analytics would add latency. Async pipelines process data separately."
  },

  conceptExplanation: `**The Problem:**
- Marketing wants click analytics
- Writing to analytics DB on every redirect adds latency
- 35K redirects/sec = 35K analytics writes/sec

**The Solution: Async Pipeline**
1. Redirect happens (fast)
2. Log click event to queue (async)
3. Analytics workers process queue
4. Store in analytics database

**Architecture:**
\`\`\`
Redirect → Log to Kafka → Analytics Worker → Analytics DB
                              ↓
                         Dashboard
\`\`\`

**Benefits:**
- Redirect stays fast
- Analytics processed async
- Can replay/reprocess events`,

  whyItMatters: 'Analytics shouldn\'t impact user experience. Async pipelines separate concerns.',

  realWorldExample: {
    company: 'Bitly',
    scenario: 'Real-time click analytics',
    howTheyDoIt: 'Kafka for event streaming. ClickHouse for analytics. Sub-second dashboard updates.',
  },

  keyPoints: [
    'Log events asynchronously',
    'Process in separate pipeline',
    'Don\'t block the hot path',
  ],

  keyConcepts: [
    { title: 'Event Queue', explanation: 'Kafka for async events', icon: '📬' },
    { title: 'Analytics DB', explanation: 'Optimized for reads/aggregations', icon: '📊' },
  ],
};

const step12: GuidedStep = {
  id: 'tinyurl-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Click analytics',
    taskDescription: 'Add analytics pipeline without impacting performance',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer click events', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Add message queue for events',
      'App Server logs clicks to queue',
      'Async processing enabled',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Kafka for async click events',
    level2: 'App Server logs to Kafka, analytics workers process',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const tinyUrlProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'tinyurl-progressive',
  title: 'Design TinyURL',
  description: 'Build an evolving URL shortener from simple service to global-scale platform',
  difficulty: 'beginner', // Starts beginner, evolves to expert
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🔗',
    hook: "Welcome to LinkShort! You're building their URL shortening service.",
    scenario: "Your journey: Start with a simple URL shortener, then evolve it as the business grows. You'll add caching, scaling, and go global.",
    challenge: "Can you build a URL shortener that grows with the business?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    // Phase 1: Beginner (Steps 1-3)
    step1, step2, step3,
    // Phase 2: Intermediate (Steps 4-6)
    step4, step5, step6,
    // Phase 3: Advanced (Steps 7-9)
    step7, step8, step9,
    // Phase 4: Expert (Steps 10-12)
    step10, step11, step12,
  ],

  concepts: [
    'Client-Server Architecture',
    'Database Persistence',
    'API Design',
    'Unique ID Generation',
    'Caching (Cache-Aside)',
    'Load Balancing',
    'Database Replication',
    'Rate Limiting',
    'CDN',
    'Database Sharding',
    'Analytics Pipeline',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
  ],
};

export default tinyUrlProgressiveGuidedTutorial;
