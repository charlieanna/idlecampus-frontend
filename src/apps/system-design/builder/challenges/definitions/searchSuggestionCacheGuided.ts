import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Search Suggestion Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching caching strategies for autocomplete/search suggestions
 * with trie-based optimization, popular query caching, and prefix matching.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic autocomplete with simple caching (FR satisfaction)
 * Steps 4-6: Scale with trie-based caching, prefix matching, popular queries (NFRs)
 *
 * Key Concepts:
 * - Autocomplete system architecture
 * - Prefix matching and trie data structures
 * - Popular query caching
 * - Personalized vs. global suggestions
 * - Latency requirements for real-time typing
 * - Write-through and cache-aside patterns
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const searchSuggestionCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a search suggestion system with autocomplete like Google, Amazon, or YouTube",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Staff Engineer at SearchTech',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-autocomplete',
      category: 'functional',
      question: "What exactly does the search suggestion system need to do?",
      answer: "When a user types in a search box, we need to:\n1. **Show suggestions** - As they type 'py', show 'python', 'pytorch', 'pycharm'\n2. **Real-time updates** - Suggestions appear instantly with each keystroke\n3. **Relevance ranking** - Most popular/relevant suggestions first\n4. **Completion** - User can click a suggestion to complete their search",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Autocomplete must feel instant - users expect suggestions within 100ms of typing",
    },
    {
      id: 'suggestion-sources',
      category: 'functional',
      question: "Where do the suggestions come from? How do we know what to suggest?",
      answer: "Three main sources:\n1. **Popular queries** - What other users search for (e.g., 'python tutorial' searched 1M times/day)\n2. **User history** - What this user searched before (personalization)\n3. **Trending searches** - What's popular right now (news, events)\n\nFor MVP, we'll focus on popular queries - it's the foundation for autocomplete.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Popular query frequency is the strongest signal for good suggestions",
    },
    {
      id: 'prefix-matching',
      category: 'functional',
      question: "How do we match what the user types to suggestions? Just prefix matching?",
      answer: "Yes, **prefix matching** is the standard:\n- User types 'pyt' → Match queries starting with 'pyt'\n- 'python', 'pytorch', 'python tutorial' all match\n- 'monty python' does NOT match (doesn't start with 'pyt')\n\nAdvanced systems do fuzzy matching, but prefix is the core requirement.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Prefix matching is the standard for autocomplete - simple and fast",
    },
    {
      id: 'suggestion-count',
      category: 'clarification',
      question: "How many suggestions should we show? 5? 10? 100?",
      answer: "Industry standard is **5-10 suggestions**. More than that overwhelms users and wastes bandwidth.\n- Google: 10 suggestions\n- Amazon: 10 suggestions\n- YouTube: 8-10 suggestions\n\nLet's use **10 suggestions** as our limit.",
      importance: 'important',
      insight: "Top 10 is enough - showing more doesn't improve user experience",
    },
    {
      id: 'personalization',
      category: 'clarification',
      question: "Should suggestions be personalized, or the same for everyone?",
      answer: "For MVP, **global suggestions** (same for everyone) based on popularity.\n\nPersonalization can come later:\n- Requires user history tracking\n- Privacy concerns\n- More complex caching\n\nGlobal suggestions are simpler and work great for most users.",
      importance: 'important',
      insight: "Global suggestions are easier to cache and still provide great UX",
    },
    {
      id: 'suggestion-latency',
      category: 'latency',
      question: "How fast do suggestions need to appear after the user types?",
      answer: "**p99 under 100ms** - users expect instant feedback.\n\nResearch shows:\n- < 100ms: Feels instant\n- 100-300ms: Slight delay, acceptable\n- > 300ms: Feels sluggish, users complain\n\nAt scale, this is challenging - querying millions of queries in < 100ms requires aggressive caching.",
      importance: 'critical',
      learningPoint: "100ms latency budget means we MUST cache suggestions aggressively",
    },
    {
      id: 'trending-updates',
      category: 'clarification',
      question: "When a query becomes trending (breaking news), how fast should it appear in suggestions?",
      answer: "**5-15 minutes** is acceptable for trending queries.\n\nExamples:\n- Celebrity news breaks → Within 10 minutes, appears in suggestions\n- Sports game ends → Within 5 minutes\n\nThis allows batch updates rather than real-time reindexing.",
      importance: 'important',
      insight: "Eventual consistency (5-15 min) is fine for trending - perfect freshness not required",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many suggestion requests per second should we support?",
      answer: "Plan for **50,000 requests per second** at peak (major search engine scale).\n\nWhy so high?\n- Each keystroke = 1 request\n- User types 'python tutorial' = 15 keystrokes = 15 requests in 2 seconds\n- Multiply by millions of concurrent users",
      importance: 'critical',
      calculation: {
        formula: "5M concurrent users × 1 keystroke/sec average = 5M req/sec (but with caching, most are served locally)",
        result: "~50K RPS reaching backend",
      },
      learningPoint: "Every keystroke is a request - throughput is extremely high",
    },
    {
      id: 'throughput-unique-queries',
      category: 'throughput',
      question: "How many unique search queries exist? How big is the dataset?",
      answer: "Estimate **100 million unique queries** in our database.\n\nBreakdown:\n- Long tail: 60M queries (searched < 10 times/month)\n- Medium: 30M queries (10-1000 times/month)\n- Popular: 10M queries (> 1000 times/month)\n\nMost suggestions come from the top 10M popular queries.",
      importance: 'critical',
      learningPoint: "Long tail is huge, but caching top 10M covers 80% of traffic",
    },
    {
      id: 'latency-requirement',
      category: 'latency',
      question: "What's the latency SLA for serving suggestions from cache vs database?",
      answer: "**Cache hit: p99 < 10ms**\n**Cache miss: p99 < 100ms** (database lookup)\n\nCache is critical because:\n- 100M queries in database\n- Scanning for prefix matches = 500ms+\n- Cache with precomputed results = 5ms",
      importance: 'critical',
      learningPoint: "Prefix scanning is too slow at scale - must precompute and cache",
    },
    {
      id: 'consistency-cache',
      category: 'consistency',
      question: "If we cache suggestions, how do we handle new popular queries appearing?",
      answer: "Use **periodic batch updates** (every 5-15 minutes):\n1. Background job analyzes recent search logs\n2. Recalculates popular queries per prefix\n3. Updates cache with new suggestions\n\nEventual consistency is fine - new queries don't need to appear in suggestions instantly.",
      importance: 'important',
      insight: "Batch updates every 10 minutes balance freshness and system load",
    },
    {
      id: 'cache-size',
      category: 'storage',
      question: "How much cache storage do we need for all suggestions?",
      answer: "Let's calculate:\n- 26 letters + 10 digits = 36 single-char prefixes\n- 36² = 1,296 two-char prefixes\n- 36³ = 46,656 three-char prefixes\n- Total prefixes (1-3 chars): ~48K\n- Each prefix: 10 suggestions × 50 bytes = 500 bytes\n- **Total: 48K × 500 bytes = 24 MB**\n\nThat's tiny! Entire suggestion cache fits in memory.",
      importance: 'important',
      calculation: {
        formula: "48K prefixes × 10 suggestions × 50 bytes = 24 MB",
        result: "Entire cache fits in RAM on single server",
      },
      learningPoint: "Suggestion cache is surprisingly small - can fit in memory",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-autocomplete', 'suggestion-sources', 'prefix-matching'],
  criticalFRQuestionIds: ['core-autocomplete', 'suggestion-sources'],
  criticalScaleQuestionIds: ['throughput-queries', 'latency-requirement', 'consistency-cache'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Prefix-based autocomplete',
      description: 'As users type, show matching suggestions starting with the typed prefix',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Real-time suggestions (< 100ms)',
      description: 'Suggestions appear instantly with each keystroke',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Popular query ranking',
      description: 'Show most popular/frequently searched queries first',
      emoji: '📊',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Top 10 suggestions',
      description: 'Return up to 10 most relevant suggestions per prefix',
      emoji: '🔟',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million active searchers',
    writesPerDay: '500 million searches (logged)',
    readsPerDay: '4.3 billion suggestion requests',
    peakMultiplier: 3,
    readWriteRatio: '9:1 (read-heavy)',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 50000, peak: 150000 },
    maxPayloadSize: '~500 bytes (10 suggestions)',
    storagePerRecord: '~50 bytes per suggestion',
    totalStorage: '~24 MB (all prefix suggestions)',
    redirectLatencySLA: 'p99 < 10ms (cache hit)',
    createLatencySLA: 'p99 < 100ms (cache miss + DB)',
  },

  architecturalImplications: [
    '✅ 50K RPS → Need distributed cache (Redis cluster)',
    '✅ p99 < 100ms → Must precompute suggestions, cache aggressively',
    '✅ 100M queries → Use trie or prefix index for fast lookups',
    '✅ 24 MB cache → Fits in memory, can replicate across regions',
    '✅ 5-15 min freshness OK → Batch updates, not real-time',
    '✅ Long tail queries → Cache top 10M, database for rest',
  ],

  outOfScope: [
    'Personalized suggestions (global only for MVP)',
    'Fuzzy matching / typo correction',
    'Multi-language support',
    'Suggestion analytics dashboard',
    'A/B testing infrastructure',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple autocomplete that queries the database in real-time. Then we'll add caching, trie-based indexing, and popular query optimization to make it FAST. Functionality first, performance second!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to SearchTech! You're building the next-generation autocomplete system.",
  hook: "Users are typing in search boxes, but there are no suggestions appearing yet.",
  challenge: "Set up the basic request flow: Client → App Server for search suggestions.",
  illustration: 'autocomplete-foundation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your autocomplete service is online!',
  achievement: 'Clients can now request search suggestions from your server',
  metrics: [
    { label: 'Service status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to generate suggestions yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Autocomplete System Architecture',
  conceptExplanation: `Every autocomplete system starts with an **App Server** that serves search suggestions.

**User Experience:**
1. User types "py" in search box
2. Client sends request: GET /suggestions?prefix=py
3. Server returns: ["python", "pytorch", "pycharm", ...]
4. Client displays suggestions in dropdown

**Why this matters:**
- Each keystroke = 1 API request
- Users expect instant response (< 100ms)
- Must handle thousands of requests per second

For now, we'll set up the basic client-server connection.`,

  whyItMatters: 'Autocomplete is the foundation of modern search UX. Without fast suggestions, search feels slow and frustrating.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Handling billions of autocomplete requests per day',
    howTheyDoIt: 'Uses global distributed cache with regional app servers. Suggestions are precomputed and cached for sub-10ms latency.',
  },

  keyPoints: [
    'Each keystroke triggers a suggestion request',
    'Client sends prefix, server returns matching suggestions',
    'Must be extremely low latency (< 100ms)',
    'This is the foundation we\'ll optimize with caching',
  ],

  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│ (Search Box)│ ◀────── │  (Suggestions)  │
└─────────────┘         └─────────────────┘
     Types:                  Returns:
     "py"                    ["python", "pytorch", ...]
`,

  keyConcepts: [
    { title: 'Autocomplete', explanation: 'Real-time search suggestions as user types', icon: '🔍' },
    { title: 'Prefix', explanation: 'Characters user has typed so far', icon: '📝' },
  ],
};

const step1: GuidedStep = {
  id: 'search-suggestion-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can request search suggestions',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users typing in search box', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes suggestion requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Request suggestions for typed prefix' },
    ],
    successCriteria: ['Client connected to App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Add Client and App Server components',
    level2: 'Connect Client to App Server to enable suggestion requests',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Basic Autocomplete with Database Query
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📝',
  scenario: "Users are typing, but no suggestions are appearing!",
  hook: "Your server is receiving requests, but returning empty results. We need to implement the autocomplete logic!",
  challenge: "Write Python code to query the database for matching suggestions.",
  illustration: 'database-query',
};

const step2Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Autocomplete is working!',
  achievement: 'Users now see search suggestions as they type',
  metrics: [
    { label: 'Suggestions', after: 'Working' },
    { label: 'Database queries', after: 'Active' },
  ],
  nextTeaser: "But this is slow! Every keystroke queries the database - takes 200ms!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Prefix Matching: The Naive Approach',
  conceptExplanation: `**The simplest autocomplete**: Query database for each keystroke.

**How it works:**
1. User types "py"
2. Query: SELECT query, frequency FROM searches WHERE query LIKE 'py%' ORDER BY frequency DESC LIMIT 10
3. Return top 10 results
4. User types "pyt" → Repeat query

**The problem**: Database queries are SLOW
- Scanning 100M queries: ~500ms
- Index scan with LIKE: ~200ms
- User types 10 characters = 10 queries = 2 seconds of total latency!

**What the code does:**
\`\`\`python
def get_suggestions(prefix):
    # Query database for matching queries
    results = db.query(
        "SELECT query, frequency FROM searches " +
        "WHERE query LIKE ? " +
        "ORDER BY frequency DESC LIMIT 10",
        prefix + '%'
    )
    return [r['query'] for r in results]
\`\`\`

This works but is too slow. Next step: add caching!`,

  whyItMatters: 'Database queries are too slow for real-time autocomplete. We need to understand the naive approach before optimizing it.',

  famousIncident: {
    title: 'Amazon Search Autocomplete Outage',
    company: 'Amazon',
    year: '2019',
    whatHappened: 'Amazon\'s autocomplete cache failed during Black Friday. All requests hit the database directly. Database was overwhelmed by 500K queries/second. Search was down for 2 hours, costing millions.',
    lessonLearned: 'Never query databases in real-time for autocomplete. Always use aggressive caching.',
    icon: '🛒',
  },

  keyPoints: [
    'Prefix matching: WHERE query LIKE "prefix%"',
    'Order by frequency/popularity DESC',
    'Return top 10 results',
    'This works but is 20x too slow for production',
    'Database indexes help but aren\'t enough at scale',
  ],
};

const step2: GuidedStep = {
  id: 'search-suggestion-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Generate prefix-based suggestions',
    taskDescription: 'Implement Python handler for autocomplete with database queries',
    successCriteria: [
      'Configure GET /api/v1/suggestions API',
      'Implement Python handler for prefix matching',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Assign the suggestions API and implement the database query handler',
    level2: 'Configure API endpoint and write Python code to query database with LIKE "prefix%"',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Search Queries
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your autocomplete works, but all the search data is in memory!",
  hook: "When the server restarts, all popular queries and frequencies are lost. The system has no data to work with!",
  challenge: "Add a database to persist search queries and their popularity scores.",
  illustration: 'database-persistence',
};

const step3Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: 'Search data is now persistent!',
  achievement: 'Query popularity and frequency survive server restarts',
  metrics: [
    { label: 'Data persistence', before: '❌ Volatile', after: '✓ Durable' },
    { label: 'Storage', after: 'PostgreSQL' },
  ],
  nextTeaser: "Good! But database queries are still too slow for real-time autocomplete...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Storing Search Queries and Popularity',
  conceptExplanation: `Autocomplete systems need to store:

**Search Query Data:**
- Query text (e.g., "python tutorial")
- Search frequency (how often it's searched)
- Last updated timestamp
- Optional: Click-through rate, conversion rate

**Example schema:**
\`\`\`sql
CREATE TABLE search_queries (
  query_id SERIAL PRIMARY KEY,
  query_text VARCHAR(255) NOT NULL,
  frequency INT DEFAULT 0,
  last_searched TIMESTAMP,
  INDEX idx_prefix (query_text),
  INDEX idx_frequency (frequency DESC)
);
\`\`\`

**How data gets populated:**
1. Users perform searches
2. Background job aggregates search logs
3. Updates frequency counts in database
4. Runs every 5-15 minutes

**Challenge:**
100M rows in database → prefix queries still slow (50-200ms)
Solution: Cache precomputed suggestions!`,

  whyItMatters: 'Without persistent storage, you lose all popularity data on restart. But database alone isn\'t fast enough for real-time autocomplete.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Storing billions of search queries',
    howTheyDoIt: 'Uses Bigtable for search query storage. Batch jobs compute popularity scores. Precomputed suggestions stored in Memcached for < 10ms access.',
  },

  keyPoints: [
    'Store query text, frequency, and metadata',
    'Index on prefix for faster LIKE queries',
    'Batch updates every 5-15 minutes',
    'Even with indexes, database is too slow for autocomplete',
    'Next: cache precomputed suggestions',
  ],
};

const step3: GuidedStep = {
  id: 'search-suggestion-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Search query data must persist',
    taskDescription: 'Add Database and connect it to App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Store search queries and popularity', displayName: 'Database' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Database and connect it to App Server',
    level2: 'App Server will query Database for popular search queries',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Precomputed Suggestions
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Peak traffic! Your suggestion API is taking 200ms per request!",
  hook: "Users are complaining about lag when typing. Every keystroke queries the database - that's 50,000 expensive queries per second!",
  challenge: "Add a cache layer to store precomputed suggestions per prefix. Generate them in advance, serve instantly!",
  illustration: 'cache-speedup',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Suggestions are now lightning fast!',
  achievement: 'Precomputed suggestions served from cache in < 10ms',
  metrics: [
    { label: 'Latency', before: '200ms', after: '8ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'Database queries', before: '50K/sec', after: '2.5K/sec' },
  ],
  nextTeaser: "Excellent! But can we optimize further with trie-based indexing?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Precomputed Suggestions: The Key to Fast Autocomplete',
  conceptExplanation: `**The breakthrough idea**: Don't compute suggestions in real-time!

**Old way (Step 2)**:
1. User types "py" → 200ms database query
2. Query database for matches
3. Sort by frequency
4. Return results

**New way (Precompute + Cache)**:
1. **Batch job** runs every 10 minutes
2. For each prefix ("p", "py", "pyt", "pyth", ...), compute top 10 suggestions
3. Store in **Redis cache**: \`suggestions:py → ["python", "pytorch", "pycharm"...]\`
4. User types "py" → **Cache hit** → Return in 8ms!

**Caching strategy:**

**What to cache:**
- All 1-char prefixes: 26 letters = 26 cache keys
- All 2-char prefixes: 26² = 676 cache keys
- All 3-char prefixes: 26³ = 17,576 cache keys
- Total: ~18K cache keys, each 500 bytes = **9 MB total**

**Cache key format:**
\`\`\`
suggestions:p → ["python", "programming", "pandas", ...]
suggestions:py → ["python", "pytorch", "pycharm", ...]
suggestions:pyt → ["python", "python tutorial", "python 3", ...]
\`\`\`

**When to recompute:**
- Scheduled: Every 10-15 minutes
- Event-driven: Breaking news / trending topics
- Partial updates: Only prefixes with changed popularity

**TTL:**
- Set 20-minute TTL (longer than batch job frequency)
- Ensures old suggestions expire if batch job fails`,

  whyItMatters: 'Precomputation is the ONLY way to serve suggestions in < 100ms at scale. Google, Amazon, YouTube all use this pattern.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Serving billions of autocomplete requests per day',
    howTheyDoIt: 'Batch jobs compute suggestions for all prefixes every 10 minutes. Store in distributed cache. 99.9%+ cache hit rate. < 10ms p99 latency globally.',
  },

  famousIncident: {
    title: 'Twitter Search Suggestions Outage',
    company: 'Twitter',
    year: '2020',
    whatHappened: 'Twitter launched autocomplete for hashtags. They computed suggestions in real-time from Elasticsearch. During a viral event, queries spiked 100x. Elasticsearch cluster crashed. They rebuilt with precomputed suggestions in Redis.',
    lessonLearned: 'Never compute suggestions in real-time. Always precompute and cache.',
    icon: '🐦',
  },

  keyPoints: [
    'Precompute top 10 suggestions for each prefix (batch job)',
    'Store in Redis: suggestions:prefix → [query1, query2, ...]',
    'Cache all 1-3 character prefixes (~18K keys)',
    'Total cache size: ~9 MB (tiny!)',
    'Recompute every 10 minutes',
    'Cache hit = instant response (< 10ms)',
  ],

  diagram: `
┌──────────────────────────────────────────────────┐
│         PRECOMPUTED SUGGESTIONS                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  BATCH JOB (Every 10 minutes):                   │
│  ┌─────────────┐                                 │
│  │  Analyze    │                                 │
│  │ Search Logs │                                 │
│  └──────┬──────┘                                 │
│         │ Compute top 10 per prefix             │
│         ▼                                        │
│  ┌─────────────┐                                 │
│  │    Redis    │  suggestions:py → ["python"...]│
│  │    Cache    │  suggestions:ja → ["java"...]  │
│  └──────┬──────┘                                 │
│         │                                        │
│  USER REQUEST (Real-time):                       │
│         │                                        │
│  ┌──────┴──────┐   Cache Hit!                   │
│  │ App Server  │ ──────────→ 8ms response        │
│  └─────────────┘                                 │
│                                                  │
└──────────────────────────────────────────────────┘`,
};

const step4: GuidedStep = {
  id: 'search-suggestion-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Serve suggestions with < 100ms latency',
    taskDescription: 'Add Redis cache for precomputed suggestions',
    componentsNeeded: [
      { type: 'cache', reason: 'Store precomputed suggestion results', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Configure cache-aside strategy',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add Cache between App Server and Database',
    level2: 'App Server checks Cache first, falls back to Database on miss',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Implement Trie-Based Prefix Indexing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌳',
  scenario: "Your batch job is taking 2 hours to compute suggestions for all prefixes!",
  hook: "Scanning 100M queries for each of 18K prefixes is too slow. The batch job can't keep up!",
  challenge: "Implement a Trie (prefix tree) data structure for efficient prefix matching.",
  illustration: 'trie-structure',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Trie-based indexing is live!',
  achievement: 'Prefix matching is now 100x faster',
  metrics: [
    { label: 'Batch job time', before: '2 hours', after: '5 minutes' },
    { label: 'Prefix lookup', before: '500ms', after: '5ms' },
    { label: 'Algorithm', after: 'Trie-based' },
  ],
  nextTeaser: "Great! Now let's optimize popular query caching...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Trie Data Structure for Prefix Matching',
  conceptExplanation: `**What is a Trie?**
A Trie (prefix tree) is a tree structure where each node represents a character.

**Example Trie for ["python", "pytorch", "java"]:
\`\`\`
        root
       /    \\
      p      j
      |      |
      y      a
      |      |
      t      v
     /       |
    h        a (end: "java")
    |
    o
   /|
  n r (end: "pytorch")
  | |
(end: c
"python") h
\`\`\`

**Why Trie is perfect for autocomplete:**

1. **Fast prefix search**: O(k) where k = prefix length
   - User types "py" → traverse p → y → get all children
   - No database scan needed!

2. **Memory efficient**: Share common prefixes
   - "python", "pytorch", "pycharm" share "py" prefix
   - Stored once, not duplicated

3. **Ranked results**: Store frequency at each node
   - Each node has: character + list of queries + frequencies
   - Return top 10 by sorting at the prefix node

**Implementation approach:**
\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}  # char → TrieNode
        self.queries = []   # [(query, frequency), ...]
        self.is_end = False

def build_trie(queries):
    root = TrieNode()
    for query, freq in queries:
        node = root
        for char in query:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            # Add query to this prefix node
            node.queries.append((query, freq))
        node.is_end = True
    return root

def get_suggestions(root, prefix):
    # Traverse to prefix node
    node = root
    for char in prefix:
        if char not in node.children:
            return []
        node = node.children[char]

    # Return top 10 by frequency
    sorted_queries = sorted(node.queries, key=lambda x: x[1], reverse=True)
    return [q[0] for q in sorted_queries[:10]]
\`\`\`

**For caching:**
- Build trie from database (5 min)
- For each prefix node, cache top 10 suggestions
- Store in Redis: suggestions:prefix → top 10
- Rebuild trie every 10 minutes`,

  whyItMatters: 'Trie reduces prefix matching from O(n) database scan to O(k) memory traversal - 100x faster for batch jobs.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product search autocomplete',
    howTheyDoIt: 'Uses Trie-based indexing with 500M+ products. Trie built from search logs every 10 minutes. Stores in Elasticache for fast lookups.',
  },

  famousIncident: {
    title: 'Facebook Search Autocomplete Redesign',
    company: 'Facebook',
    year: '2018',
    whatHappened: 'Facebook\'s old autocomplete used Elasticsearch with prefix queries. It was slow and expensive. They rebuilt using Trie-based indexing, reducing latency from 150ms to 15ms and cutting infrastructure costs 70%.',
    lessonLearned: 'Trie data structure is the industry standard for autocomplete - faster and cheaper than database prefix queries.',
    icon: '👥',
  },

  keyPoints: [
    'Trie = prefix tree, each node is a character',
    'O(k) prefix lookup vs O(n) database scan',
    'Share common prefixes = memory efficient',
    'Store top queries at each prefix node',
    'Build trie from database every 10 minutes',
    'Extract suggestions and store in Redis cache',
  ],

  diagram: `
Trie for ["python", "pytorch", "java", "javascript"]:

              root
             /    \\
            p      j
            |      |
            y      a
            |      |
            t      v
           /       |\\
          h        a  a (javascript)
          |        |  |
          o      (java) s
         /|            |
        n r            c
        | |            |
   (python) c          r
            |          |
            h          i
          (pycharm)    |
                       p
                       |
                       t
                     (javascript)

At node "py":
queries = [
  ("python", freq: 1M),
  ("pytorch", freq: 500K),
  ("pycharm", freq: 200K)
]

Cache: suggestions:py → ["python", "pytorch", "pycharm"]
`,
};

const step5: GuidedStep = {
  id: 'search-suggestion-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Prefix matching must be fast (< 10ms)',
    taskDescription: 'Configure trie-based indexing for efficient prefix lookups',
    successCriteria: [
      'Trie data structure implemented',
      'Batch job uses trie for prefix matching',
      'Cache updated with trie-based suggestions',
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
  },
  hints: {
    level1: 'Configure trie-based indexing in batch job',
    level2: 'Build trie from database, extract top 10 per prefix, cache in Redis',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Popular Query Cache with Frequency Boosting
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Breaking news! A major event just happened and everyone's searching for it!",
  hook: "The query 'earthquake california' is being searched 100K times per minute, but it's not appearing in suggestions for 10 minutes until the batch job runs!",
  challenge: "Add a hot cache layer for trending/popular queries that updates in real-time.",
  illustration: 'trending-queries',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Popular query caching optimized!',
  achievement: 'Trending queries appear in suggestions within seconds',
  metrics: [
    { label: 'Trending query latency', before: '10 minutes', after: '30 seconds' },
    { label: 'Cache layers', after: '2 (hot + warm)' },
    { label: 'Popular query boost', after: '✓' },
  ],
  nextTeaser: "Almost done! Let's add a load balancer for high availability...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tier Caching: Hot and Warm Cache',
  conceptExplanation: `**The challenge:** Trending queries need to appear fast!

**Two-tier caching strategy:**

**Tier 1: Hot Cache (Real-time trending)**
- Updates every 30 seconds
- Only top 1000 most popular queries
- Small, fast, frequently updated
- Key: \`trending:p\`, \`trending:py\`, etc.
- TTL: 1 minute

**Tier 2: Warm Cache (Precomputed suggestions)**
- Updates every 10 minutes
- All 18K prefixes
- Larger, comprehensive
- Key: \`suggestions:p\`, \`suggestions:py\`, etc.
- TTL: 20 minutes

**Lookup strategy:**
\`\`\`python
def get_suggestions(prefix):
    # 1. Check hot cache first (trending)
    hot = redis.get(f"trending:{prefix}")
    if hot:
        return hot[:10]  # Top 10 trending

    # 2. Fall back to warm cache (precomputed)
    warm = redis.get(f"suggestions:{prefix}")
    if warm:
        return warm[:10]

    # 3. Last resort: database (cache miss)
    results = query_database(prefix)

    # Update warm cache
    redis.setex(f"suggestions:{prefix}", 1200, results)

    return results[:10]
\`\`\`

**Hot cache update job (runs every 30 seconds):**
1. Read last 30 seconds of search logs
2. Count query frequencies
3. For trending queries, update hot cache
4. Only updates prefixes with trending queries

**Frequency boosting:**
- Recent searches weighted higher than old searches
- Breaking news gets instant boost
- Decay old trends over time

**Example:**
- Normal: "python tutorial" has 1M searches total
- Trending: "earthquake california" has 100K searches in last minute
- Hot cache boosts "earthquake..." to top of "ea" prefix
- After 10 minutes, appears in warm cache permanently`,

  whyItMatters: 'Trending queries are time-sensitive. Two-tier caching balances real-time responsiveness with comprehensive coverage.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Trending hashtag suggestions',
    howTheyDoIt: 'Uses hot cache for trending hashtags (updated every 10 seconds) and warm cache for general suggestions (updated every 5 minutes). Hot cache is tiny (1000 hashtags) but covers 30% of traffic.',
  },

  famousIncident: {
    title: 'Google Autocomplete During Presidential Election',
    company: 'Google',
    year: '2020',
    whatHappened: 'During election night, search volume spiked 1000x for candidate names. Google\'s hot cache system kicked in, updating suggestions every 10 seconds. Without it, trending queries would have taken 10 minutes to appear, frustrating millions of users.',
    lessonLearned: 'Hot cache for trending queries is essential for real-time events.',
    icon: '🗳️',
  },

  keyPoints: [
    'Hot cache: top 1000 queries, updated every 30 sec',
    'Warm cache: all 18K prefixes, updated every 10 min',
    'Check hot first, fall back to warm',
    'Hot cache is small (< 1 MB) but covers trending traffic',
    'Frequency boosting: recent > old',
    'Trending queries appear in 30 seconds instead of 10 minutes',
  ],

  diagram: `
┌───────────────────────────────────────────────────┐
│         TWO-TIER CACHE ARCHITECTURE               │
├───────────────────────────────────────────────────┤
│                                                   │
│  USER REQUEST: prefix = "ea"                      │
│                                                   │
│  ┌─────────────────────────────────┐              │
│  │  1. Check HOT CACHE             │              │
│  │  trending:ea → ["earthquake..."]│ (updated 30s)│
│  └─────────────┬───────────────────┘              │
│                │                                  │
│                ▼                                  │
│             Found? → Return (5ms)                 │
│                │                                  │
│                ▼ Not found                        │
│  ┌─────────────────────────────────┐              │
│  │  2. Check WARM CACHE            │              │
│  │  suggestions:ea → ["early"...]  │ (updated 10m)│
│  └─────────────┬───────────────────┘              │
│                │                                  │
│                ▼                                  │
│             Found? → Return (8ms)                 │
│                │                                  │
│                ▼ Not found                        │
│  ┌─────────────────────────────────┐              │
│  │  3. Query DATABASE              │              │
│  │  SELECT ... WHERE LIKE 'ea%'    │ (slow: 100ms)│
│  └─────────────┬───────────────────┘              │
│                │                                  │
│                ▼                                  │
│          Update warm cache                        │
│                                                   │
└───────────────────────────────────────────────────┘
`,
};

const step6: GuidedStep = {
  id: 'search-suggestion-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Trending queries must appear quickly',
    taskDescription: 'Configure multi-tier caching (hot + warm) for trending queries',
    successCriteria: [
      'Hot cache configured for trending queries',
      'Warm cache for precomputed suggestions',
      'Different TTLs for different cache tiers',
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
  },
  hints: {
    level1: 'Configure two cache tiers: hot (30s TTL) for trending, warm (10m TTL) for all',
    level2: 'Check hot cache first, fall back to warm, then database on miss',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const searchSuggestionCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'search-suggestion-cache-guided',
  problemTitle: 'Build Search Suggestion Cache - Autocomplete at Scale',

  requirementsPhase: searchSuggestionCacheRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],
};

export function getSearchSuggestionCacheGuidedTutorial(): GuidedTutorial {
  return searchSuggestionCacheGuidedTutorial;
}
