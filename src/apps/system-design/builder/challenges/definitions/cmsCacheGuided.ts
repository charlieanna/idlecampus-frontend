import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * CMS Content Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching content caching strategies for a CMS platform.
 * Focus areas: Content caching, cache invalidation on publish, preview vs live environments.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic CMS (Client → App Server → Database)
 * Step 3: Add caching for published content
 * Step 4: Implement cache invalidation on publish
 * Step 5: Add preview vs live content separation
 * Step 6: Scale with CDN for global content delivery
 * Step 7: Multi-tier caching strategy
 * Step 8: Final optimization - cost and performance
 *
 * Key Pedagogy: First make it WORK, then make it FAST, then make it SCALABLE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const cmsCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Content Management System (CMS) like WordPress or Contentful with smart caching",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Staff Engineer at ContentHub',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main user experiences in this CMS? Who are the users?",
      answer: "We have two types of users:\n\n**Content Editors:**\n1. Create and edit articles/pages\n2. Preview changes before publishing\n3. Publish content to make it live\n\n**End Users (Visitors):**\n1. Read published content\n2. Experience should be fast (< 200ms page load)\n3. Always see the latest published version",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "CMS serves two distinct audiences with different needs - editors need flexibility, visitors need speed",
    },
    {
      id: 'preview-vs-live',
      category: 'functional',
      question: "What's the difference between preview and live content?",
      answer: "**Preview:** Editors can see their unpublished changes without affecting live site. Only authenticated editors can access preview.\n\n**Live:** Public-facing content that all visitors see. Must be the latest published version.\n\nKey constraint: Preview changes should NOT bust the live cache!",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Preview and live are separate data paths - mixing them causes cache invalidation chaos",
    },
    {
      id: 'publish-workflow',
      category: 'functional',
      question: "What happens when an editor clicks 'Publish'?",
      answer: "1. Save the content to database\n2. Invalidate cached versions of that content\n3. New requests should immediately see the updated content\n4. No stale content should be served\n\nExpectation: Published changes should be visible to visitors within 1 second.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Cache invalidation is one of the hardest problems in computer science - timing matters!",
    },

    // IMPORTANT - Clarifications
    {
      id: 'content-types',
      category: 'clarification',
      question: "What types of content does the CMS manage?",
      answer: "Articles and pages with:\n- Title, body text, images\n- Metadata (author, publish date, tags)\n- Static pages (About Us, Contact)\n\nNo user-generated comments or real-time features for MVP.",
      importance: 'important',
      insight: "Focus on static content - perfect for aggressive caching",
    },
    {
      id: 'versioning',
      category: 'clarification',
      question: "Do we need content versioning or rollback?",
      answer: "Not for MVP. Editors can overwrite content, but we don't track history. Versioning could be v2.",
      importance: 'nice-to-have',
      insight: "Simplifies cache invalidation - no need to invalidate historical versions",
    },
    {
      id: 'permissions',
      category: 'clarification',
      question: "What about user roles and permissions?",
      answer: "Simple model: Editors (can edit/publish) and Visitors (can only read). Authentication for editors only.",
      importance: 'important',
      insight: "Preview content requires authentication, live content doesn't",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many visitors reading content per day?",
      answer: "10 million page views per day, with 100 concurrent editors",
      importance: 'critical',
      calculation: {
        formula: "10M reads ÷ 86,400 sec = 115 reads/sec average",
        result: "~115 reads/sec (350 at peak)",
      },
      learningPoint: "Read-heavy workload - perfect for caching!",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many content publishes per day?",
      answer: "About 1,000 publishes per day (articles + updates)",
      importance: 'important',
      calculation: {
        formula: "1,000 publishes ÷ 86,400 sec = 0.01 writes/sec",
        result: "Very low write rate - cache can stay fresh for minutes!",
      },
      learningPoint: "Rare writes means cache can have long TTL with invalidation",
    },

    // 2. LATENCY
    {
      id: 'latency-read',
      category: 'latency',
      question: "What's the acceptable page load time for visitors?",
      answer: "p99 under 200ms for content delivery. Users expect instant page loads.",
      importance: 'critical',
      learningPoint: "200ms is tight - database alone is 50-100ms. Cache is essential!",
    },
    {
      id: 'latency-publish',
      category: 'latency',
      question: "How fast must published changes appear to visitors?",
      answer: "Within 1 second. Editor publishes, refreshes site, should see new content.",
      importance: 'critical',
      learningPoint: "Fast cache invalidation is critical - can't wait for TTL expiry",
    },
    {
      id: 'latency-preview',
      category: 'latency',
      question: "What about preview latency?",
      answer: "p99 under 500ms is fine - editors can tolerate slightly slower preview since they're authenticated.",
      importance: 'important',
      learningPoint: "Preview can bypass cache or use shorter TTL",
    },

    // 3. AVAILABILITY
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.9% for live content (visitors). Preview can tolerate brief outages.",
      importance: 'critical',
      learningPoint: "Separate availability requirements for preview vs live",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['core-operations', 'preview-vs-live', 'publish-workflow'],
  criticalFRQuestionIds: ['core-operations', 'preview-vs-live', 'publish-workflow'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-read', 'latency-publish'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Editors can create and edit content',
      description: 'Authenticated editors can create articles and pages',
      emoji: '✍️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Visitors can read published content',
      description: 'Public users can access live, published content quickly',
      emoji: '📖',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Editors can preview unpublished changes',
      description: 'See draft changes without affecting live site',
      emoji: '👁️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Publish makes content immediately live',
      description: 'Published content appears to visitors within 1 second',
      emoji: '🚀',
    },
    {
      id: 'fr-5',
      text: 'FR-5: No stale content served',
      description: 'Cache invalidation ensures visitors always see latest published version',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million page views/day',
    writesPerDay: '1,000 publishes',
    readsPerDay: '10 million',
    peakMultiplier: 3,
    readWriteRatio: '10,000:1',
    calculatedWriteRPS: { average: 0.01, peak: 0.03 },
    calculatedReadRPS: { average: 115, peak: 350 },
    maxPayloadSize: '~100KB per page',
    storagePerRecord: '~50KB per article',
    storageGrowthPerYear: '~50GB',
    redirectLatencySLA: 'p99 < 200ms (read)',
    createLatencySLA: 'p99 < 500ms (preview)',
  },

  architecturalImplications: [
    '✅ Read-heavy (10,000:1) → Aggressive caching is ESSENTIAL',
    '✅ Rare publishes → Long TTL with invalidation on write',
    '✅ p99 < 200ms → Database too slow, must cache',
    '✅ Preview vs Live → Separate cache keys or bypass cache',
    '✅ 1s invalidation SLA → Active invalidation, not TTL expiry',
  ],

  outOfScope: [
    'Content versioning',
    'User-generated comments',
    'Real-time collaboration',
    'Multi-language content',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple CMS where editors can create content and visitors can read it. Then we'll optimize with caching and smart invalidation. This is the right approach: functionality first, then performance!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏗️',
  scenario: "Welcome to ContentHub! You're building a modern CMS platform.",
  hook: "Your first editor just logged in and wants to create an article. Your first visitor wants to read content.",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your CMS is online!",
  achievement: "Users can now send requests to your server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle content yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: CMS Architecture',
  conceptExplanation: `Every CMS starts with a **Client** connecting to an **App Server**.

When an editor creates content or a visitor reads an article:
1. Their browser (Client) sends an HTTP request
2. The App Server processes the request
3. The server returns the content or confirmation

Think of the App Server as the CMS brain - it handles all the content management logic.`,
  whyItMatters: 'Without this connection, editors can\'t create content and visitors can\'t read it.',
  keyPoints: [
    'Client = browser (both editors and visitors)',
    'App Server = processes content creation and retrieval',
    'HTTP/HTTPS = communication protocol',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (CMS Backend)  │
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    {
      title: 'Client',
      explanation: 'User\'s browser making requests',
      icon: '🌐',
    },
    {
      title: 'App Server',
      explanation: 'Processes content operations',
      icon: '🖥️',
    },
  ],
};

const step1: GuidedStep = {
  id: 'cms-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit requests to the CMS',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents editors and visitors', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes content requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Configure APIs and Implement Python Handlers
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your App Server is connected, but it's empty!",
  hook: "An editor tried to create an article but got an error. The server doesn't know HOW to handle content operations.",
  challenge: "Configure APIs and implement Python handlers for content creation, editing, and reading.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your CMS can handle content!",
  achievement: "Editors can create content and visitors can read it",
  metrics: [
    { label: 'APIs configured', after: '3 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But when the server restarts, all content disappears!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'CMS API Design & Implementation',
  conceptExplanation: `Your CMS needs to handle three main operations:

**1. Create/Edit Content (POST /api/v1/content)** — You'll implement this in Python
- Receives: Article data (title, body, author)
- Returns: Content ID
- Your code: Validate and store in memory (for now)

**2. Read Published Content (GET /api/v1/content/:id)** — You'll implement this in Python
- Receives: Content ID
- Returns: Published article
- Your code: Look up and return content

**3. Preview Draft Content (GET /api/v1/content/:id/preview)** — You'll implement this in Python
- Receives: Content ID + auth token
- Returns: Draft version (unpublished changes)
- Your code: Return draft if authenticated

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for all endpoints`,
  whyItMatters: 'Without handlers, your CMS is just an empty shell. The Python code defines what actually happens when editors create content and visitors read it.',
  keyPoints: [
    'POST endpoint creates/updates content',
    'GET endpoint serves published content to visitors',
    'Preview endpoint shows drafts to authenticated editors',
    'Open the Python tab to see and edit your handler code',
  ],
  diagram: `
POST /api/v1/content
┌─────────────────────────────────────────────────┐
│ Request:  { "title": "...", "body": "..." }     │
│ Response: { "id": "123" }                       │
└─────────────────────────────────────────────────┘

GET /api/v1/content/123
┌─────────────────────────────────────────────────┐
│ Response: { "title": "...", "body": "..." }     │
└─────────────────────────────────────────────────┘

GET /api/v1/content/123/preview (with auth)
┌─────────────────────────────────────────────────┐
│ Response: { "title": "...", "draft": true }     │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'REST API', explanation: 'POST to create, GET to read', icon: '🔌' },
    { title: 'Preview vs Live', explanation: 'Separate endpoints for draft vs published', icon: '👁️' },
    { title: 'Python Handlers', explanation: 'The actual code that processes each request', icon: '🐍' },
  ],
};

const step2: GuidedStep = {
  id: 'cms-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1: Create content, FR-2: Read content, FR-3: Preview drafts',
    taskDescription: 'Configure APIs and implement the Python handlers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/content, GET /api/v1/content/:id, and GET /api/v1/content/:id/preview APIs',
      'Open the Python tab and implement the handlers',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to the Python tab to write your handlers',
    level2: 'After assigning APIs in the inspector, switch to the Python editor tab and fill in the TODOs. Implement create_content(), get_content(), and preview_content().',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The server restarted overnight...",
  hook: "When it came back online, ALL the articles were GONE! Editors are furious - they spent hours writing content!",
  challenge: "Add a database so content survives server restarts.",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Content is now safe forever!",
  achievement: "Articles persist even if the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted forever' },
    { label: 'Storage', after: 'PostgreSQL Database' },
  ],
  nextTeaser: "But content is loading really slowly for visitors...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Why CMS Needs a Database',
  conceptExplanation: `Without a database, your CMS stores content in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all content is lost!

**Solution**: Store content in a database. Databases write to disk and ensure your content survives:
- Server crashes
- Deploys and restarts
- Power outages
- Hardware failures (with replication)

For a CMS, we need to store:
- Articles (title, body, author, publish_date)
- Draft vs published versions
- Metadata (tags, categories)`,
  whyItMatters: 'Imagine editors writing articles all day, then losing everything because of a server restart!',
  realWorldExample: {
    company: 'WordPress',
    scenario: 'Storing billions of blog posts',
    howTheyDoIt: 'Uses MySQL to store all content, with tables for posts, metadata, and revisions. Handles millions of queries per second.',
  },
  famousIncident: {
    title: 'Ma.gnolia Bookmark Service Data Loss',
    company: 'Ma.gnolia',
    year: '2009',
    whatHappened: 'A database corruption combined with failed backups caused Ma.gnolia to lose all user data. The service never recovered and shut down permanently.',
    lessonLearned: 'Always have persistent storage with working backups. Test your recovery process regularly!',
    icon: '🔖',
  },
  keyPoints: [
    'RAM is volatile, databases persist to disk',
    'Store both draft and published versions',
    'Database handles concurrent writes from multiple editors',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Client    │ ────▶ │ App Server  │ ────▶ │   Database     │
└─────────────┘       └─────────────┘       │                │
                                            │  articles      │
                                            │  drafts        │
                                            │  metadata      │
                                            └────────────────┘
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives restarts and crashes', icon: '💾' },
    { title: 'Transactions', explanation: 'Atomic content updates', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'cms-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Content must persist durably',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores content persistently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes content' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Published Content
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your CMS now has 1 million articles. Visitors are complaining...",
  hook: '"Pages take 3 seconds to load!" Every visitor request hits the database. But content rarely changes!',
  challenge: "Add a cache to serve published content instantly.",
  illustration: 'slow-turtle',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Content loads 20x faster!",
  achievement: "Published articles served from cache",
  metrics: [
    { label: 'Page load latency', before: '3000ms', after: '150ms' },
    { label: 'Database load', before: '100%', after: '5%' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But when editors publish updates, visitors still see old content!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Published Content',
  conceptExplanation: `**Key insight**: Published content rarely changes, but it's read millions of times.

**The math**:
- Database query: 50-100ms
- Cache lookup: 1-5ms
- That's **10-50x faster!**

**Cache-Aside Pattern for CMS**:
1. Visitor requests article
2. Check cache: Is article ID in Redis?
3. **Cache HIT**: Return immediately (2ms)
4. **Cache MISS**: Query database, store in cache, return (100ms)

**Important**: Only cache PUBLISHED content, not drafts!

Preview requests should bypass cache or use separate cache keys.`,
  whyItMatters: 'At 350 req/s peak, hitting the database for every request would overwhelm it. Cache is essential for p99 < 200ms SLA.',
  realWorldExample: {
    company: 'Medium',
    scenario: 'Serving millions of blog posts',
    howTheyDoIt: 'Uses Redis to cache published articles aggressively. Cache hit rate > 98% for popular posts. Database only hit for cache misses and publishes.',
  },
  famousIncident: {
    title: 'Cloudflare Cache Poisoning',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A misconfigured cache rule caused authenticated admin pages to be cached and served to regular users. Sensitive data was exposed because preview/admin content wasn\'t properly separated from public cache.',
    lessonLearned: 'Never cache authenticated or preview content in the public cache! Use separate cache keys or bypass caching entirely.',
    icon: '☁️',
  },
  keyPoints: [
    'Cache only PUBLISHED content, not drafts',
    'Preview requests bypass cache (or use separate keys)',
    'Long TTL (e.g., 1 hour) since content rarely changes',
    'Cache-aside pattern: check cache, fallback to DB',
  ],
  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 2ms (HIT)
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │───▶│App Server│      │ miss?
└────────┘    └────┬─────┘      ▼
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 100ms (MISS)
                          └─────────────┘

Cache Key: "article:123:published"
Preview Key: "article:123:draft" (or bypass cache)
`,
  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, DB on miss', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live: how long data stays cached', icon: '⏰' },
    { title: 'Cache Key', explanation: 'Unique identifier for cached content', icon: '🔑' },
  ],
};

const step4: GuidedStep = {
  id: 'cms-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-2: Read published content must be fast (< 200ms)',
    taskDescription: 'Add Cache for published content',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores content', displayName: 'Database' },
      { type: 'cache', reason: 'Caches published content for fast reads', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes content' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches published content' },
    ],
    successCriteria: ['Add Cache component', 'Connect App Server to Cache', 'Configure cache strategy'],
  },
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
    level1: 'Add a Cache component and connect it to App Server',
    level2: 'Add Redis cache, connect it, then configure cache-aside strategy with TTL',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Implement Cache Invalidation on Publish
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "An editor just published an important update to an article...",
  hook: "But visitors are still seeing the OLD version! The cache has stale data and won't expire for another hour!",
  challenge: "Implement active cache invalidation - when content is published, immediately clear the old cached version.",
  illustration: 'stale-cache',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Published changes appear instantly!",
  achievement: "Cache invalidation ensures no stale content",
  metrics: [
    { label: 'Time to see updates', before: '1 hour (TTL)', after: '< 1 second' },
    { label: 'Stale content risk', before: 'High', after: 'Eliminated' },
  ],
  nextTeaser: "Great! But the system needs to handle more traffic...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation: The Hard Problem',
  conceptExplanation: `**The famous quote**: "There are only two hard things in Computer Science: cache invalidation and naming things."

**Why it's hard**:
- TTL-based expiry is too slow (1 hour = 1 hour of stale content)
- Need to invalidate immediately when content changes
- Must handle race conditions (publish during read)

**Solution for CMS: Active Invalidation**

When editor publishes:
1. Save new content to database
2. **DELETE** cache key for that article
3. Next visitor request will be a cache miss
4. Cache miss → fetch from DB → cache new version

**Implementation**:
\`\`\`python
def publish_article(article_id, content):
    # 1. Save to database
    db.save(article_id, content)

    # 2. Invalidate cache - CRITICAL!
    cache.delete(f"article:{article_id}:published")

    # Next read will be a cache miss
    # and will cache the new version
\`\`\`

**Race condition handling**:
- Use short TTL (5-10 min) as safety net
- Invalidate ALL related cache keys (article, category pages, homepage)`,
  whyItMatters: 'Without invalidation, editors publish content but visitors don\'t see it for hours. This breaks the core CMS promise!',
  realWorldExample: {
    company: 'WordPress',
    scenario: 'Handling content updates',
    howTheyDoIt: 'Uses cache invalidation plugins that clear specific cache keys on publish. Also invalidates related pages (category archives, homepage). Some plugins purge entire cache to be safe.',
  },
  famousIncident: {
    title: 'Facebook Cache Consistency Bug',
    company: 'Facebook',
    year: '2014',
    whatHappened: 'A bug in cache invalidation logic caused some users to see deleted posts reappear. The cache wasn\'t properly invalidated when posts were deleted, and stale data served from CDN edges.',
    lessonLearned: 'Cache invalidation must be bulletproof. Invalidate all affected cache keys, not just the primary one. Use versioning as additional safety.',
    icon: '📘',
  },
  keyPoints: [
    'Active invalidation: delete cache key on publish',
    'Don\'t wait for TTL expiry - invalidate immediately',
    'Invalidate ALL related keys (article, listings, homepage)',
    'Use short TTL (5-10 min) as safety net for missed invalidations',
    'Handle race conditions with atomic operations',
  ],
  diagram: `
PUBLISH WORKFLOW WITH INVALIDATION:

┌──────────┐
│  Editor  │ clicks "Publish"
└────┬─────┘
     │
     ▼
┌─────────────────┐
│  App Server     │
│                 │
│  1. Save to DB  │ ─────▶ Database
│  2. DELETE      │ ─────▶ Redis: delete("article:123:published")
│     cache key   │
└─────────────────┘

Next visitor request:
┌────────┐
│Visitor │ GET /article/123
└───┬────┘
    │
    ▼
┌─────────────────┐
│  App Server     │
│                 │
│  Check cache    │ ─────▶ Redis: MISS! (we just deleted it)
│  Fetch from DB  │ ─────▶ Database: get new version
│  Cache result   │ ─────▶ Redis: set("article:123:published")
└─────────────────┘

Result: Visitor sees new content within 1 second!
`,
  keyConcepts: [
    { title: 'Active Invalidation', explanation: 'Explicitly delete cache on write', icon: '🗑️' },
    { title: 'Race Condition', explanation: 'Concurrent read during write', icon: '🏁' },
    { title: 'TTL Safety Net', explanation: 'Short TTL catches missed invalidations', icon: '🛡️' },
  ],
  quickCheck: {
    question: 'Why can\'t we rely on TTL expiry for published updates?',
    options: [
      'TTL is unreliable',
      'Users would see stale content until TTL expires (too slow)',
      'TTL doesn\'t work with Redis',
      'It\'s more expensive',
    ],
    correctIndex: 1,
    explanation: 'TTL expiry is passive - content stays stale until TTL expires. Active invalidation immediately removes stale data so next request gets fresh content.',
  },
};

const step5: GuidedStep = {
  id: 'cms-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-4: Published content appears immediately, FR-5: No stale content served',
    taskDescription: 'Re-use your architecture and configure cache invalidation strategy',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Update code to invalidate cache on publish', displayName: 'App Server' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
      { type: 'cache', reason: 'Configure invalidation strategy', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected' },
      { from: 'App Server', to: 'Database', reason: 'Already connected' },
      { from: 'App Server', to: 'Cache', reason: 'Already connected' },
    ],
    successCriteria: [
      'Open Python code and add cache invalidation to publish handler',
      'Configure cache with short TTL (300s) as safety net',
      'Verify invalidation happens on write',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Update your Python handlers to delete cache keys on publish',
    level2: 'In publish_content() handler, after saving to DB, add: cache.delete(f"article:{id}:published")',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer and Scale App Servers
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "Your CMS just went viral! Traffic increased 10x overnight!",
  hook: "Your single App Server is at 100% CPU. Requests are timing out. Editors can't publish!",
  challenge: "Add a Load Balancer and scale to multiple App Server instances.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your CMS can handle the traffic!",
  achievement: "Load balancer distributes requests across multiple servers",
  metrics: [
    { label: 'Capacity', before: '100 req/s', after: '1000+ req/s' },
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "But global users are experiencing high latency...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing and Horizontal Scaling',
  conceptExplanation: `One App Server can handle ~100-1000 req/s. What if you need 10,000?

**Solution**: Multiple App Servers behind a **Load Balancer**

The load balancer:
1. Receives ALL incoming traffic
2. Distributes requests across healthy servers
3. Detects failed servers and removes them
4. Enables zero-downtime deployments

**For CMS**:
- App servers are stateless (no session data)
- Cache and database are shared across all instances
- Scale app servers based on traffic

**Important for cache invalidation**:
- ALL app servers share the same cache
- Invalidation from one server affects all servers
- This ensures consistency across instances`,
  whyItMatters: 'Single server is a single point of failure. Load balancer provides both scale and availability.',
  realWorldExample: {
    company: 'WordPress.com',
    scenario: 'Hosting millions of blogs',
    howTheyDoIt: 'Uses load balancers with hundreds of app servers. Auto-scales based on traffic. All servers share Redis cache and MySQL database.',
  },
  keyPoints: [
    'Load balancer distributes traffic across servers',
    'Horizontal scaling: add more servers for more capacity',
    'Stateless app servers: any server can handle any request',
    'Shared cache ensures invalidation works across all instances',
  ],
  diagram: `
                    ┌──────────────┐
                    │Load Balancer │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │App Server│    │App Server│    │App Server│
    │Instance 1│    │Instance 2│    │Instance 3│
    └─────┬────┘    └─────┬────┘    └─────┬────┘
          │               │               │
          └───────────────┴───────────────┘
                          │
           ┌──────────────┴──────────────┐
           ▼                             ▼
    ┌─────────────┐              ┌──────────┐
    │Shared Cache │              │ Database │
    └─────────────┘              └──────────┘
`,
  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests evenly', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Stateless', explanation: 'Servers share nothing, use shared cache/DB', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'cms-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must handle 1000+ req/s with high availability',
    taskDescription: 'Add Load Balancer and scale App Server to 3+ instances',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Scale to 3+ instances', displayName: 'App Server' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
      { type: 'cache', reason: 'Already added', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to instances' },
      { from: 'App Server', to: 'Database', reason: 'Shared database' },
      { from: 'App Server', to: 'Cache', reason: 'Shared cache' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and App Server',
      'Configure App Server for 3+ instances',
      'Verify cache invalidation still works across all instances',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Add Load Balancer, reconnect Client → LB → App Server, then scale App Server instances',
    level2: 'Insert Load Balancer in front of App Server, set App Server instances to 3+',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: Add CDN for Global Content Delivery
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your CMS has global users now - readers in Asia, Europe, Australia...",
  hook: "But users in Tokyo are seeing 2-second page loads! The servers are in US-East, and every request crosses the Pacific Ocean.",
  challenge: "Add a CDN to cache published content at edge locations worldwide.",
  illustration: 'global-latency',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Global users get instant page loads!",
  achievement: "CDN serves cached content from nearest edge location",
  metrics: [
    { label: 'Tokyo latency', before: '2000ms', after: '150ms' },
    { label: 'Origin traffic', before: '100%', after: '5%' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Amazing! But how do we invalidate CDN cache on publish?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'CDN for Global Content Delivery',
  conceptExplanation: `A **CDN** (Content Delivery Network) caches content at edge locations worldwide.

**How it works for CMS**:
1. Visitor in Tokyo requests article
2. Request goes to nearest CDN edge (Tokyo)
3. If cached: serve from edge (< 50ms)
4. If not cached: CDN fetches from origin, caches, serves

**Multi-Tier Caching**:
- **Tier 1**: CDN Edge (Tokyo, London, Sydney)
- **Tier 2**: Redis Cache (US-East)
- **Tier 3**: Database (US-East)

**Cache Invalidation Challenge**:
When editor publishes:
1. Invalidate Redis cache (Tier 2) ✓
2. **Also need to invalidate CDN cache (Tier 1)!**

**Solution**: CDN Purge API
- On publish, call CDN API to purge specific URLs
- Or use cache keys with versioning
- Some CDNs support tag-based purging`,
  whyItMatters: 'Global users shouldn\'t wait for cross-continent requests. CDN makes the CMS feel local everywhere.',
  realWorldExample: {
    company: 'Medium',
    scenario: 'Serving blog posts globally',
    howTheyDoIt: 'Uses Fastly CDN to cache articles at 60+ edge locations. Purges CDN cache on publish using Fastly API. Cache hit rate > 95% globally.',
  },
  famousIncident: {
    title: 'Cloudflare CDN Outage',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A bad regex in WAF rules caused CPU spikes across Cloudflare\'s global CDN network. Major websites went down worldwide for 27 minutes.',
    lessonLearned: 'CDN is critical infrastructure but introduces new failure modes. Always have origin fallback and test CDN configs carefully.',
    icon: '☁️',
  },
  keyPoints: [
    'CDN caches content at edge locations worldwide',
    'Multi-tier caching: CDN (edge) → Redis (app) → Database',
    'On publish: invalidate both Redis AND CDN cache',
    'Use CDN purge API or cache versioning',
    'CDN reduces origin traffic by 90-95%',
  ],
  diagram: `
GLOBAL CDN ARCHITECTURE:

Tokyo User:
┌─────────┐  50ms   ┌──────────────┐
│ Visitor │ ◀─────▶ │ CDN Edge     │ (cache hit)
└─────────┘         │ (Tokyo)      │
                    └──────────────┘
                           │ cache miss
                           ▼
                    ┌──────────────┐
                    │   Origin     │
                    │  (US-East)   │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌──────────┐      ┌──────────┐      ┌──────────┐
  │App Server│      │  Redis   │      │ Database │
  └──────────┘      │  Cache   │      └──────────┘
                    └──────────┘

PUBLISH INVALIDATION:
1. Editor publishes
2. App Server: save to DB
3. App Server: DELETE Redis cache
4. App Server: PURGE CDN cache (API call)
`,
  keyConcepts: [
    { title: 'CDN Edge', explanation: 'Cache servers near users', icon: '📡' },
    { title: 'Multi-Tier Cache', explanation: 'CDN → Redis → Database', icon: '🏗️' },
    { title: 'CDN Purge', explanation: 'API to invalidate CDN cache', icon: '🗑️' },
  ],
  quickCheck: {
    question: 'Why do we need to purge CDN cache on publish?',
    options: [
      'To save money',
      'CDN would serve stale content until TTL expires',
      'CDN can\'t cache dynamic content',
      'It\'s a legal requirement',
    ],
    correctIndex: 1,
    explanation: 'CDN caches content at edge. Without purging on publish, edge servers serve stale content until TTL expires (could be hours).',
  },
};

const step7: GuidedStep = {
  id: 'cms-cache-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Global users need fast access to published content',
    taskDescription: 'Add CDN for global content delivery with cache invalidation',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'cdn', reason: 'Cache content at edge locations', displayName: 'CDN' },
      { type: 'load_balancer', reason: 'Already added', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Already scaled', displayName: 'App Server' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
      { type: 'cache', reason: 'Already added', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Visitors request through CDN' },
      { from: 'CDN', to: 'Load Balancer', reason: 'CDN fetches from origin on miss' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to instances' },
      { from: 'App Server', to: 'Database', reason: 'Shared database' },
      { from: 'App Server', to: 'Cache', reason: 'Shared Redis cache' },
    ],
    successCriteria: [
      'Add CDN between Client and Load Balancer',
      'Update Python code to purge CDN cache on publish',
      'Verify multi-tier caching works',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add CDN in front of Load Balancer, update publish code to purge CDN',
    level2: 'Insert CDN: Client → CDN → LB. In publish handler, add cdn.purge() after cache.delete()',
    solutionComponents: [
      { type: 'client' },
      { type: 'cdn' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Final Optimization - Database Replication and Cost Control
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎯',
  scenario: "Final challenge! Your CMS needs to pass production readiness review.",
  hook: "Requirements: 99.9% availability, handle database failures, stay under budget, and pass all test cases!",
  challenge: "Add database replication for HA and optimize costs while maintaining performance.",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Congratulations! You built a production-ready CMS!",
  achievement: "Multi-tier caching, instant invalidation, global delivery, high availability",
  metrics: [
    { label: 'Page load latency', after: '< 200ms globally' },
    { label: 'Publish latency', after: '< 1s to go live' },
    { label: 'Availability', after: '99.9%' },
    { label: 'Cache hit rate', after: '95%+' },
    { label: 'Test cases passed', after: '8/8 ✓' },
  ],
  nextTeaser: "You've mastered CMS caching and invalidation!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production Readiness: HA and Cost Optimization',
  conceptExplanation: `**High Availability Requirements**:
1. Database replication (survive DB failures)
2. Multiple app server instances (survive server failures)
3. CDN with origin fallback (survive CDN issues)

**Database Replication for CMS**:
- Primary: handles writes (publishes)
- Replicas: handle reads (content delivery)
- Automatic failover if primary fails

**Cost Optimization Strategies**:
1. **Aggressive caching**: 95% cache hit = 95% less origin traffic
2. **CDN reduces bandwidth**: Edge serves most requests
3. **Right-sized instances**: Don't over-provision
4. **Read replicas**: Scale reads without scaling primary

**Multi-Tier Caching Summary**:
- **CDN**: 95% of requests (global edge)
- **Redis**: 4% of requests (app-level cache)
- **Database**: 1% of requests (cache misses)

This means database handles only 1% of original load!`,
  whyItMatters: 'Production systems must survive failures AND stay within budget. Over-engineering wastes money, under-engineering causes outages.',
  realWorldExample: {
    company: 'WordPress.com',
    scenario: 'Running millions of blogs',
    howTheyDoIt: 'Multi-region database replication, aggressive caching (Memcached + Varnish + CDN), auto-scaling app servers. Cache hit rate > 98%, DB handles < 2% of traffic.',
  },
  keyPoints: [
    'Database replication: 2+ replicas for 99.9% availability',
    'Multi-tier caching reduces DB load by 99%',
    'CDN + Redis + Database = optimal cost/performance',
    'Cache invalidation must work across all tiers',
    'Monitor cache hit rates and adjust TTLs',
  ],
  diagram: `
PRODUCTION ARCHITECTURE:

┌─────────┐
│ Client  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│  CDN (Global)   │ ← 95% requests served here
└────┬────────────┘
     │ 5% miss
     ▼
┌─────────────────┐
│ Load Balancer   │
└────┬────────────┘
     │
     ▼
┌─────────────────────────┐
│ App Servers (3+)        │
└──┬──────────────────┬───┘
   │                  │
   ▼                  ▼
┌──────────┐   ┌──────────────────┐
│  Redis   │   │  PostgreSQL      │
│  Cache   │   │  Primary + 2     │
└──────────┘   │  Replicas        │
               └──────────────────┘

Cache Hit Rates:
- CDN: 95%
- Redis: 80% of remaining 5% = 4%
- Database: 1% (only cache misses)

On Publish:
1. Save to DB primary
2. Replicate to DB replicas (async)
3. DELETE Redis cache
4. PURGE CDN cache
`,
  keyConcepts: [
    { title: 'Database Replication', explanation: 'Primary + replicas for HA', icon: '🔄' },
    { title: 'Multi-Tier Cache', explanation: 'CDN → Redis → DB', icon: '🏗️' },
    { title: 'Cache Hit Rate', explanation: '% of requests served from cache', icon: '📊' },
  ],
  quickCheck: {
    question: 'If CDN has 95% hit rate and Redis has 80% hit rate, what % of requests hit the database?',
    options: [
      '5%',
      '1%',
      '20%',
      '15%',
    ],
    correctIndex: 1,
    explanation: '95% served by CDN, 5% miss to Redis, 80% of 5% = 4% served by Redis, remaining 1% hit database.',
  },
};

const step8: GuidedStep = {
  id: 'cms-cache-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Final Exam: Pass all 8 production test cases',
    taskDescription: 'Add database replication and ensure all requirements are met',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'cdn', reason: 'Already added', displayName: 'CDN' },
      { type: 'load_balancer', reason: 'Already added', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Already scaled', displayName: 'App Server' },
      { type: 'database', reason: 'Enable replication', displayName: 'Database' },
      { type: 'cache', reason: 'Already added', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Already connected' },
      { from: 'CDN', to: 'Load Balancer', reason: 'Already connected' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Already connected' },
      { from: 'App Server', to: 'Database', reason: 'Already connected' },
      { from: 'App Server', to: 'Cache', reason: 'Already connected' },
    ],
    successCriteria: [
      'Enable database replication (2+ replicas)',
      'Verify cache invalidation works across all tiers',
      'Pass all 8 test cases',
      'Stay under cost budget',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click Database → Enable replication with 2+ replicas, verify all configs',
    level2: 'Final checklist: DB replication ✓, 3+ app instances ✓, cache strategy ✓, CDN ✓, invalidation code ✓',
    solutionComponents: [
      { type: 'client' },
      { type: 'cdn' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const cmsCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'cms-content-cache-guided',
  problemTitle: 'Build a CMS with Smart Caching - A System Design Journey',

  requirementsPhase: cmsCacheRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Content Operations',
      type: 'functional',
      requirement: 'FR-1, FR-2',
      description: 'Editors can create content and visitors can read it.',
      traffic: { type: 'mixed', rps: 10, readRps: 9, writeRps: 1 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fast Content Delivery',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Published content loads quickly for visitors (p99 < 200ms).',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Preview vs Live Separation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Preview requests don\'t affect live cache.',
      traffic: { type: 'mixed', rps: 50, readRps: 40, writeRps: 10 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Instant Cache Invalidation',
      type: 'functional',
      requirement: 'FR-4, FR-5',
      description: 'Published changes appear within 1 second, no stale content.',
      traffic: { type: 'mixed', rps: 20, readRps: 18, writeRps: 2 },
      duration: 30,
      passCriteria: { maxStaleSeconds: 1, maxErrorRate: 0 },
    },
    {
      name: 'NFR-P1: High Read Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 350 RPS peak traffic with p99 < 200ms.',
      traffic: { type: 'read', rps: 350, readRps: 350 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Global Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle traffic spike with CDN and multi-tier caching.',
      traffic: { type: 'mixed', rps: 500, readRps: 495, writeRps: 5 },
      duration: 60,
      passCriteria: { maxP99Latency: 300, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Primary database fails mid-test, system maintains availability.',
      traffic: { type: 'mixed', rps: 200, readRps: 198, writeRps: 2 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.999, maxDowntime: 5, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-C1: Cost Guardrail',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet budget constraints while maintaining performance.',
      traffic: { type: 'mixed', rps: 200, readRps: 198, writeRps: 2 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 1500, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export default cmsCacheGuidedTutorial;

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = cmsCacheRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= cmsCacheRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
