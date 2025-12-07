import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * News Aggregator Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches caching strategies for
 * news aggregation systems. Focus areas: feed freshness, personalization,
 * trending content, and cache warming for breaking news.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic news feed system (real-time aggregation)
 * Steps 4-6: Apply caching strategies (feed precomputation, TTL, cache warming)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const newsAggregatorCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a caching layer for a news aggregator like Google News, Flipboard, or Apple News",

  interviewer: {
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-news-feed',
      category: 'functional',
      question: "What's the core functionality users expect from a news aggregator?",
      answer: "Users have three main experiences:\n1. **Personalized Feed**: When opening the app, users see a curated feed of news articles based on their interests\n2. **Trending News**: Users can browse what's currently trending/breaking globally or by topic\n3. **Real-time Updates**: Breaking news appears quickly in feeds (within minutes)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "News aggregation balances personalization with timeliness",
    },
    {
      id: 'freshness-vs-latency',
      category: 'functional',
      question: "How fresh does news content need to be? Can we show articles from 1 hour ago?",
      answer: "It depends on the content type:\n- **Breaking News**: Must appear within 2-5 minutes of publication\n- **Personalized Feed**: Can be 15-30 minutes stale - users won't notice\n- **Trending Topics**: Updated every 5-10 minutes is acceptable\n\nKey insight: We can trade perfect freshness for performance on most content!",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Different content types have different freshness requirements",
    },
    {
      id: 'personalization-level',
      category: 'functional',
      question: "How personalized should feeds be? Does every user get a unique feed?",
      answer: "Hybrid approach works best:\n- **Interest-based clustering**: Group users by interests (sports, tech, politics)\n- **Popularity blending**: Mix personalized + trending content (70/30 split)\n- **Geographic relevance**: Local news based on user location\n\nNot every user needs a 100% unique feed - clustering improves cache hit rates!",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Smart clustering reduces cache keys while maintaining good personalization",
    },

    // IMPORTANT - Clarifications
    {
      id: 'breaking-news',
      category: 'clarification',
      question: "When breaking news happens, how do we ensure it reaches users quickly?",
      answer: "We need a **cache warming** strategy:\n1. News sources publish breaking news (detected via webhooks or polling)\n2. System identifies it as breaking (trending, from trusted source, high engagement)\n3. **Warm the cache**: Pre-compute feeds WITH breaking news\n4. Next user request gets fresh feed from cache (< 5 minutes old)\n\nThis is different from normal cache refresh!",
      importance: 'important',
      insight: "Breaking news requires proactive cache warming, not reactive updates",
    },
    {
      id: 'feed-generation',
      category: 'clarification',
      question: "How are personalized feeds generated? What's the computation involved?",
      answer: "Feed generation is expensive:\n1. **Fetch user interests** (topics, sources they follow) - 50ms\n2. **Query recent articles** matching interests - 200ms\n3. **Rank by relevance** (ML scoring, recency, engagement) - 300ms\n4. **Filter duplicates and sensitive content** - 50ms\n**Total: ~600ms per feed generation**\n\nThis is too slow to do on every request!",
      importance: 'important',
      insight: "Feed computation is multi-step and expensive - perfect for caching",
    },
    {
      id: 'trending-detection',
      category: 'clarification',
      question: "How do you determine what's 'trending'?",
      answer: "Trending is computed via:\n- **Engagement velocity**: Articles with rapid increase in views/shares\n- **Source authority**: Weight from trusted news sources\n- **Topic clustering**: Group related articles about same event\n- **Time decay**: Recent articles weighted higher\n\nThis computation runs every 5-10 minutes across ALL articles - very expensive!",
      importance: 'important',
      insight: "Trending computation is global and expensive - must be cached and reused",
    },

    // SCOPE
    {
      id: 'scope-content-crawling',
      category: 'scope',
      question: "Should we design the news crawling and article extraction?",
      answer: "No, assume news sources push articles via APIs or we have a separate crawler. We're focusing on:\n- Feed generation and caching\n- Personalization strategies\n- Breaking news distribution\n- TTL and cache warming strategies\n\nContent acquisition is out of scope.",
      importance: 'nice-to-have',
      insight: "Focus on caching layer, not content acquisition",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "50 million active users, with 5 million concurrent users during peak news hours (morning, evening)",
      importance: 'critical',
      learningPoint: "Peak news consumption during morning commute and evening - 10x traffic spikes",
    },
    {
      id: 'throughput-feed-requests',
      category: 'throughput',
      question: "How many feed requests per day?",
      answer: "Users check news 8-10 times per day on average:\n\n400 million feed requests/day",
      importance: 'critical',
      calculation: {
        formula: "400M ÷ 86,400 sec = 4,629 feeds/sec",
        result: "~4,600 feeds/sec average, ~46K peak (10x during breaking news)",
      },
      learningPoint: "Breaking news events cause massive traffic spikes - cache must handle 10x normal load",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should feeds load?",
      answer: "p99 under 200ms for initial feed load. Users expect near-instant news:\n- Feed from cache: < 50ms\n- Feed generation (cache miss): < 600ms\n- Breaking news must propagate within 5 minutes",
      importance: 'critical',
      learningPoint: "Feed generation takes 600ms - caching is essential for good UX",
    },
    {
      id: 'article-volume',
      category: 'throughput',
      question: "How many new articles are published per day?",
      answer: "Aggregating from thousands of news sources:\n\n~500K new articles per day globally",
      importance: 'critical',
      calculation: {
        formula: "500K ÷ 86,400 sec = 5.7 articles/sec",
        result: "~6 articles/sec average, ~60/sec during major events",
      },
      learningPoint: "Constant stream of new content requires frequent cache invalidation",
    },
    {
      id: 'cache-hit-target',
      category: 'performance',
      question: "What cache hit rate should we target for feeds?",
      answer: "Aim for 85-90% cache hit rate:\n- Most users in interest clusters share cached feeds\n- 10-15% personalization requires cache miss\n- Breaking news causes temporary cache invalidation\n\nThis reduces feed generation from 4,600/sec to ~500/sec",
      importance: 'critical',
      learningPoint: "High cache hit rate critical for handling peak traffic",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-news-feed', 'freshness-vs-latency', 'personalization-level'],
  criticalFRQuestionIds: ['core-news-feed', 'freshness-vs-latency', 'personalization-level'],
  criticalScaleQuestionIds: ['throughput-feed-requests', 'latency-feed', 'cache-hit-target'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Personalized news feed',
      description: 'Users see a personalized feed of news articles based on their interests',
      emoji: '📰',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Trending/breaking news',
      description: 'Users can view trending news and breaking news appears quickly in feeds',
      emoji: '🔥',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Real-time updates',
      description: 'New articles appear in feeds within minutes of publication',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Acceptable staleness',
      description: 'Personalized feeds can be 15-30 minutes stale, breaking news < 5 minutes',
      emoji: '⏰',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Interest-based personalization',
      description: 'Feeds personalized via user interest clustering (not purely unique per user)',
      emoji: '🎯',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '500K new articles',
    readsPerDay: '400 million feed requests',
    peakMultiplier: 10,
    readWriteRatio: '800:1 (very read-heavy)',
    calculatedWriteRPS: { average: 6, peak: 60 },
    calculatedReadRPS: { average: 4629, peak: 46290 },
    maxPayloadSize: '~100KB per feed (20 articles)',
    redirectLatencySLA: 'p99 < 200ms for feed load',
    createLatencySLA: 'p99 < 600ms for feed generation',
  },

  architecturalImplications: [
    '✅ 46K reads/sec peak → Must cache feeds aggressively',
    '✅ p99 < 200ms → Feed generation (600ms) too slow, must cache',
    '✅ 85-90% cache hit → Pre-compute feeds for interest clusters',
    '✅ 15-30 min staleness OK → Use TTL-based cache invalidation',
    '✅ Breaking news < 5 min → Cache warming strategy required',
    '✅ 10x traffic spikes → Cache must handle peak load',
  ],

  outOfScope: [
    'Article crawling and content extraction',
    'Comment/discussion features',
    'Article search functionality',
    'User authentication (assume it exists)',
    'Content recommendation algorithms (assume they exist)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that generates personalized feeds in real-time (even if slow). Then we'll add smart caching to make it FAST. Functionality first, optimization second!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📰',
  scenario: "Welcome to NewsFlash! You're building a modern news aggregator.",
  hook: "Your first task: connect users to your news server so they can request personalized feeds.",
  challenge: "Set up the basic request flow - Client to App Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your news aggregator is online!",
  achievement: "Users can now request news feeds from your server",
  metrics: [
    { label: 'Status', after: 'Connected' },
    { label: 'Ready for requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to generate feeds yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: News Aggregator Service',
  conceptExplanation: `Every news aggregator starts with an **App Server** that serves news feeds.

When a user opens the app:
1. Client sends request: "Get news feed for user_id=123"
2. App Server processes the request
3. App Server returns personalized news feed

For now, we'll keep it simple - just connect the client to the server.`,

  whyItMatters: 'The app server is the entry point for all feed requests. Without it, users can\'t get news updates.',

  keyPoints: [
    'App servers handle news feed API requests',
    'Clients request feeds for specific users or interest clusters',
    'This is the foundation we\'ll build caching on top of',
  ],

  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (News App) │ ◀────── │  (News Feeds)   │
└─────────────┘         └─────────────────┘
`,

  interviewTip: 'Start simple with Client-Server. Add complexity (caching, databases, etc.) incrementally.',
};

const step1: GuidedStep = {
  id: 'news-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can request news feeds',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users requesting news', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes news feed requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users request news feeds' },
    ],
    successCriteria: ['Client connected to App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Add Client and App Server components',
    level2: 'Connect Client to App Server to enable feed requests',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Real-time Feed Generation Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to generate news feeds yet!",
  hook: "Users are requesting feeds, but getting empty responses. We need to implement the feed generation logic!",
  challenge: "Write Python code to generate personalized news feeds by fetching and ranking articles.",
  illustration: 'coding',
};

const step2Celebration: CelebrationContent = {
  emoji: '📱',
  message: "News feeds are working!",
  achievement: "Users now get personalized news feeds",
  metrics: [
    { label: 'Feed generation', after: 'Implemented' },
    { label: 'Articles ranked', after: '✓' },
  ],
  nextTeaser: "But wait... this takes 600ms per request! Users are seeing loading spinners!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Feed Generation: The Expensive Operation',
  conceptExplanation: `Your news aggregator generates feeds by:

**The problem**: Feed generation is SLOW
- Fetch user interests and followed sources: ~50ms
- Query recent articles matching interests: ~200ms
- Rank articles by relevance and recency: ~300ms
- Filter duplicates and format response: ~50ms
**Total: 600ms per request!**

For now, we'll implement this real-time approach to make it WORK. In the next steps, we'll add caching to make it FAST.

**What the code does**:
1. Load user interest profile
2. Fetch recent articles from database
3. Rank by relevance score and timestamp
4. Return top N articles`,

  whyItMatters: 'Feed generation is complex but slow. Doing this on every request creates a poor user experience.',

  famousIncident: {
    title: 'Twitter Timeline Generation Crisis',
    company: 'Twitter',
    year: '2011',
    whatHappened: 'Twitter\'s early timeline feature computed feeds in real-time by querying all followed users\' tweets. During peak hours, timelines took 5-10 seconds to load. The database couldn\'t keep up.',
    lessonLearned: 'Pre-compute and cache feeds. Don\'t generate complex feeds synchronously on user requests.',
    icon: '🐦',
  },

  keyPoints: [
    'Feed generation takes 600ms - too slow for user requests',
    'For now, we accept the slow performance to prove functionality',
    'Next steps: we\'ll add caching to reduce latency to < 50ms',
    'Pre-computing feeds is the key to scalability',
  ],
};

const step2: GuidedStep = {
  id: 'news-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Generate personalized news feeds',
    taskDescription: 'Implement Python handlers for feed generation',
    successCriteria: [
      'Configure GET /api/v1/feed API',
      'Implement Python handler for feed generation',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Assign the feed API and implement the feed generation handler',
    level2: 'Configure API endpoint and write Python code to fetch and rank articles',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Articles and User Interests
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your feed generator is working, but every server restart loses all articles and user data!",
  hook: "Articles, user interests, and trending scores vanish when the server restarts. The feed has nothing to show!",
  challenge: "Add a database to persist articles, user interests, and engagement metrics.",
  illustration: 'database',
};

const step3Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: "News data is now persistent!",
  achievement: "Articles and user preferences survive server restarts",
  metrics: [
    { label: 'Data persistence', before: '❌ Volatile', after: '✓ Durable' },
    { label: 'Storage', after: 'PostgreSQL' },
  ],
  nextTeaser: "Good! But feed generation is still painfully slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persisting News Articles and User Data',
  conceptExplanation: `News aggregators need to store:

**Article Data**:
- Article content (title, summary, URL, source)
- Publication timestamp and last update
- Category/topic tags
- Engagement metrics (views, shares, clicks)

**User Data**:
- Interest profiles (topics they follow)
- Followed sources
- Reading history
- Personalization weights

**Trending Data**:
- Trending scores per article
- Topic-level trending metrics
- Geographic trending data

All of this must be persisted in a database for feed generation.`,

  whyItMatters: 'Without persistent storage, you lose all articles and user data on restart. Feed generation needs this data.',

  realWorldExample: {
    company: 'Flipboard',
    scenario: 'Storing billions of articles and user interests',
    howTheyDoIt: 'Uses Cassandra for article storage (fast writes for new articles), PostgreSQL for user profiles, and Redis for trending scores.',
  },

  keyPoints: [
    'Store articles with metadata and engagement metrics',
    'Store user interest profiles for personalization',
    'Database queries for feed generation are slow (200-300ms)',
    'Next step: cache generated feeds to avoid repeated queries',
  ],
};

const step3: GuidedStep = {
  id: 'news-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Articles and user interests must persist',
    taskDescription: 'Add Database and connect it to App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Store articles and user data', displayName: 'Database' },
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
    level2: 'App Server will query Database for articles and user interests',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Pre-computed Feeds
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Peak news hour! Your feed API is taking 600ms per request!",
  hook: "Users are complaining about slow load times. Your server generates feeds on EVERY request - that's 4,600 expensive operations per second!",
  challenge: "Add a cache layer to store pre-computed feeds. Generate them in advance, serve them instantly!",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "News feeds are now lightning fast!",
  achievement: "Pre-computed feeds served from cache in < 50ms",
  metrics: [
    { label: 'Latency', before: '600ms', after: '40ms' },
    { label: 'Cache hit rate', after: '87%' },
    { label: 'Feed generations', before: '4,600/sec', after: '600/sec' },
  ],
  nextTeaser: "Excellent! But how do we handle different TTLs for personalized vs trending content?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Pre-computed Feeds: The News Aggregator Approach',
  conceptExplanation: `**The breakthrough idea**: Don't compute feeds in real-time!

**Old way (Step 2)**:
1. User requests feed → 600ms
2. Query database → Rank articles → Return results

**New way (Pre-compute + Cache)**:
1. **Batch job** runs every 15-30 minutes
2. Generate feeds for ALL user interest clusters
3. Store results in **Redis cache**
4. User requests → **Cache hit** → Return in 40ms!

**Key pattern: Write-Behind Caching**
- Async batch job writes to cache
- User reads are instant (cache hit)
- Acceptable staleness: 15-30 minutes

**When to recompute**:
- Scheduled: Every 15-30 minutes for personalized feeds
- Scheduled: Every 5 minutes for trending content
- Event-driven: Breaking news triggers immediate cache warming`,

  whyItMatters: 'Pre-computation is the only way to serve feeds in real-time. All major news apps use this pattern.',

  realWorldExample: {
    company: 'Flipboard',
    scenario: 'Generating feeds for 100M+ users',
    howTheyDoIt: 'Batch jobs run every 20 minutes. Pre-compute feeds for ~50K interest clusters. Store in Memcached. Cache hit rate: 85%+.',
  },

  famousIncident: {
    title: 'Google News Launch Scalability Crisis',
    company: 'Google',
    year: '2002',
    whatHappened: 'Google News initially generated feeds in real-time by clustering news articles on every request. It couldn\'t scale past a few thousand users. They rewrote it to pre-compute article clusters and cache feeds every 15 minutes.',
    lessonLearned: 'Pre-compute expensive operations. Don\'t wait for user requests to trigger heavy computational workloads.',
    icon: '📰',
  },

  keyPoints: [
    'Pre-compute feeds in batch jobs (every 15-30 minutes)',
    'Store results in Redis with TTL matching batch frequency',
    'Cache hit = instant response (< 50ms)',
    'Cache miss = generate feed, update cache',
    'Acceptable staleness makes this possible',
  ],

  diagram: `
┌──────────────────────────────────────────────────┐
│         PRE-COMPUTED NEWS FEEDS                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  BATCH JOB (Every 30 minutes):                   │
│  ┌─────────────┐                                 │
│  │Feed Generator│                                │
│  │ + Ranker    │                                 │
│  └──────┬──────┘                                 │
│         │ Generate for all clusters              │
│         ▼                                        │
│  ┌─────────────┐                                 │
│  │    Redis    │  cluster:tech → [art1, art2...] │
│  │    Cache    │  cluster:sports → [art5, art8..]│
│  └──────┬──────┘                                 │
│         │                                        │
│  USER REQUEST (Real-time):                       │
│         │                                        │
│  ┌──────┴──────┐   Cache Hit!                   │
│  │ App Server  │ ──────────→ 40ms response       │
│  └─────────────┘                                 │
│                                                  │
└──────────────────────────────────────────────────┘`,
};

const step4: GuidedStep = {
  id: 'news-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Serve feeds with < 200ms latency',
    taskDescription: 'Add Redis cache for pre-computed feeds',
    componentsNeeded: [
      { type: 'cache', reason: 'Store pre-computed feed results', displayName: 'Redis Cache' },
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
    level2: 'App Server checks Cache first, falls back to Database + feed generation on miss',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Implement Multi-TTL Strategy for Different Content Types
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⏰',
  scenario: "Your cache is working, but all content has the same TTL! That's wasteful!",
  hook: "Breaking news becomes stale in 30 minutes, while personalized feeds could be cached longer. You're over-invalidating some content and under-invalidating others!",
  challenge: "Configure different TTL strategies for personalized feeds, trending content, and breaking news.",
  illustration: 'cache-management',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Multi-TTL caching optimized!",
  achievement: "Different content types cached with appropriate freshness",
  metrics: [
    { label: 'Personalized feeds TTL', after: '30 minutes' },
    { label: 'Trending content TTL', after: '5 minutes' },
    { label: 'Breaking news TTL', after: '2 minutes' },
    { label: 'Cache efficiency', after: '↑ 25%' },
  ],
  nextTeaser: "Great! Now let's add cache warming for breaking news events...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-TTL Caching: Match TTL to Content Freshness',
  conceptExplanation: `**Not all content is equal!** Different content types have different freshness requirements.

**The smart approach** (TIERED TTLs):

**Tier 1: Personalized Feeds** (30-minute TTL)
- User interest profiles change slowly
- Most users won't notice 30-minute staleness
- Maximizes cache hit rate
\`\`\`
cluster:tech:feed → TTL: 1800 seconds
cluster:sports:feed → TTL: 1800 seconds
\`\`\`

**Tier 2: Trending Content** (5-minute TTL)
- Trending scores update every 5 minutes
- Needs fresher data than personalized feeds
- Still cacheable for good performance
\`\`\`
trending:global → TTL: 300 seconds
trending:tech → TTL: 300 seconds
\`\`\`

**Tier 3: Breaking News** (2-minute TTL)
- Must appear quickly in feeds
- Short TTL + cache warming strategy
- Acceptable trade-off for timeliness
\`\`\`
breaking:latest → TTL: 120 seconds
\`\`\`

**Benefits**:
- Personalized feeds: 87% hit rate (30-min TTL)
- Trending: 65% hit rate (5-min TTL)
- Breaking news: 40% hit rate (2-min TTL + warming)
- Overall cache efficiency improved 25%`,

  whyItMatters: 'One-size-fits-all TTL wastes cache space and provides poor freshness. Match TTL to actual freshness requirements.',

  realWorldExample: {
    company: 'Apple News',
    scenario: 'Balancing freshness across content types',
    howTheyDoIt: 'Uses tiered caching: 1-hour TTL for personalized "For You" feeds, 10-minute TTL for trending topics, 2-minute TTL for breaking news with cache warming.',
  },

  famousIncident: {
    title: 'Reddit Breaking News Delay',
    company: 'Reddit',
    year: '2013',
    whatHappened: 'During the Boston Marathon bombing, Reddit\'s front page algorithm had a 1-hour cache TTL. Breaking news took 45+ minutes to surface. Users went to Twitter instead, which showed updates in real-time.',
    lessonLearned: 'Breaking news requires short TTLs and cache warming. Don\'t use the same cache strategy for all content types.',
    icon: '🔴',
  },

  keyPoints: [
    'Personalized feeds: 30-minute TTL (slow-changing user interests)',
    'Trending content: 5-minute TTL (moderate freshness needed)',
    'Breaking news: 2-minute TTL + proactive cache warming',
    'Match TTL to actual freshness requirements, not arbitrary values',
    'Tiered caching improves both performance and freshness',
  ],
};

const step5: GuidedStep = {
  id: 'news-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Different content types need different freshness levels',
    taskDescription: 'Configure multi-TTL caching strategy for different feed types',
    successCriteria: [
      'Configure personalized feed cache (30-min TTL)',
      'Configure trending content cache (5-min TTL)',
      'Configure breaking news cache (2-min TTL)',
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
    level1: 'Configure cache with different TTLs for different content types',
    level2: 'Use cache-aside pattern with tiered TTLs: personalized (1800s), trending (300s), breaking (120s)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Cache Warming for Breaking News
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "BREAKING NEWS: Major event just happened! But users won't see it for 30 minutes!",
  hook: "Your pre-computed feeds are cached for 30 minutes. Breaking news won't appear until the next batch job runs. Users are going to Twitter instead!",
  challenge: "Implement cache warming: when breaking news is detected, proactively regenerate and warm all affected feed caches.",
  illustration: 'breaking-news',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Cache warming implemented!",
  achievement: "Breaking news now appears in feeds within 2 minutes",
  metrics: [
    { label: 'Breaking news latency', before: '30 minutes', after: '< 2 minutes' },
    { label: 'Cache warming triggers', after: 'Automated' },
    { label: 'User engagement', after: '↑ 40%' },
  ],
  nextTeaser: "Almost done! Let's add a load balancer for high availability...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Warming: Proactive Updates for Breaking News',
  conceptExplanation: `**The problem**: With 30-minute TTL, breaking news takes too long to appear in feeds.

**The solution**: Cache warming - proactively regenerate caches when important events happen.

**How cache warming works**:

**Step 1: Detect breaking news**
- Article published by trusted source
- Rapid engagement spike detected
- Manual editorial flag
- API webhook from news agency

**Step 2: Identify affected feeds**
- Which interest clusters care about this topic?
- Geographic relevance (local news)
- User segments that follow this source

**Step 3: Warm the cache**
- Regenerate affected feed clusters immediately
- Update cache with new feeds including breaking news
- Set short TTL (2 minutes) for continued freshness

**Example flow**:
\`\`\`
1. Breaking news detected: "Tech company announces major product"
2. System identifies affected clusters: tech, business, innovation
3. Regenerate feeds for those clusters (20% of total)
4. Update cache: cluster:tech:feed → [breaking_article, ...]
5. Next user request gets fresh feed with breaking news!
\`\`\`

**Key insight**: Don't warm ALL caches (expensive!), only affected ones.`,

  whyItMatters: 'Cache warming ensures breaking news reaches users quickly without sacrificing the performance benefits of caching.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Surfacing breaking news in real-time',
    howTheyDoIt: 'Uses event-driven cache warming. When high-velocity tweets detected, immediately regenerates relevant timelines and pushes to caches. Users see breaking news within seconds.',
  },

  famousIncident: {
    title: 'CNN Breaking News Cache Miss',
    company: 'CNN',
    year: '2016',
    whatHappened: 'During the 2016 US election results, CNN\'s mobile app used aggressive caching with 1-hour TTL. As results came in, the app showed outdated information while Twitter had real-time updates. Users complained loudly on social media.',
    lessonLearned: 'For news apps, implement cache warming for time-sensitive content. Don\'t rely solely on TTL expiration.',
    icon: '📺',
  },

  keyPoints: [
    'Detect breaking news via engagement spikes or editorial flags',
    'Identify affected feed clusters (don\'t warm everything)',
    'Regenerate and update cache for affected feeds only',
    'Set short TTL (2 min) for breaking news content',
    'Cache warming = proactive, TTL expiration = reactive',
  ],

  diagram: `
┌───────────────────────────────────────────────────┐
│         CACHE WARMING FOR BREAKING NEWS           │
├───────────────────────────────────────────────────┤
│                                                   │
│  1. DETECT BREAKING NEWS:                         │
│     ┌──────────────────┐                          │
│     │ Engagement Spike │ OR Editorial Flag        │
│     └────────┬─────────┘                          │
│              │                                    │
│  2. IDENTIFY AFFECTED CLUSTERS:                   │
│              ▼                                    │
│     [ tech, business, innovation ] ← 20% of feeds │
│                                                   │
│  3. WARM CACHE (Regenerate feeds):                │
│     ┌─────────────────┐                           │
│     │ Feed Generator  │                           │
│     └────────┬────────┘                           │
│              ▼                                    │
│     ┌─────────────────────────────────┐           │
│     │        REDIS CACHE              │           │
│     │  cluster:tech → [BREAKING_NEWS] │           │
│     │  TTL: 120 seconds               │           │
│     └────────┬────────────────────────┘           │
│              │                                    │
│  4. USER REQUEST:                                 │
│              ▼                                    │
│     Fresh feed with breaking news! (< 2 min)     │
│                                                   │
└───────────────────────────────────────────────────┘`,
};

const step6: GuidedStep = {
  id: 'news-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Breaking news must appear quickly in feeds',
    taskDescription: 'Configure cache warming strategy for breaking news events',
    successCriteria: [
      'Configure breaking news detection',
      'Set up cache warming triggers',
      'Configure selective cache regeneration',
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
    level1: 'Configure cache warming to regenerate affected feeds when breaking news detected',
    level2: 'Set up event-driven cache warming with selective cluster regeneration',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer and Scale for High Availability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Breaking news event! Traffic just spiked 10x!",
  hook: "Your single app server is melting. Cache is fast, but one server can't handle 46,000 requests/sec!",
  challenge: "Add a load balancer and scale to multiple app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Your news aggregator is production-ready!",
  achievement: "High availability, low latency, intelligent caching - you've mastered news feed design!",
  metrics: [
    { label: 'Capacity', before: '4,600 req/s', after: '46,000 req/s' },
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Latency (p99)', before: '600ms', after: '45ms' },
    { label: 'Cache hit rate', after: '87%+' },
    { label: 'Breaking news latency', before: '30 min', after: '< 2 min' },
  ],
  nextTeaser: "Congratulations! You've built a scalable news aggregator with intelligent caching!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for News Aggregation',
  conceptExplanation: `**The final piece**: High availability and horizontal scaling.

**Architecture components**:
1. **Load Balancer**: Distributes requests across app servers
2. **Multiple App Servers**: Stateless, share Redis cache
3. **Redis Cluster**: Distributed cache for high throughput
4. **Database Replicas**: Read scaling for article lookups

**Why this works for news aggregators**:
- App servers are **stateless** (all state in cache/DB)
- Any server can serve any request
- Cache is shared across all servers
- Horizontal scaling: add more servers for more capacity

**Key metrics achieved**:
- Latency: 45ms (p99) - down from 600ms
- Throughput: 46,000 req/s - up from 4,600 req/s
- Cache hit rate: 87%+ - reduced feed generations 7x
- Availability: 99.99% - no single points of failure
- Breaking news: < 2 minutes - down from 30 minutes`,

  whyItMatters: 'News aggregators must scale to millions of users and handle 10x traffic spikes during breaking news. Caching + horizontal scaling is the only way.',

  realWorldExample: {
    company: 'Flipboard',
    scenario: 'Serving news to 100M+ users globally',
    howTheyDoIt: 'Hundreds of stateless app servers behind load balancers. Memcached cluster with 100+ nodes. Pre-computed feeds refreshed every 20 minutes. 85%+ cache hit rate. Sub-100ms p99 latency globally.',
  },

  keyPoints: [
    'Load balancer distributes traffic across stateless app servers',
    'Shared Redis cache ensures consistency',
    'Database replication for read scaling',
    'Auto-scaling based on traffic patterns (morning/evening peaks)',
    'Pre-computed + cached = real-time feel at massive scale',
  ],
};

const step7: GuidedStep = {
  id: 'news-cache-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must handle 46K+ RPS with high availability',
    taskDescription: 'Add load balancer and scale app servers horizontally',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added between Client and App Server',
      'App Server scaled to 3+ instances',
      'Database replication enabled',
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
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Add Load Balancer, scale App Server to 3+ instances, enable DB replication',
    level2: 'Client → Load Balancer → App Server (3+ instances) → Cache + Database (replicated)',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const newsAggregatorCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'news-aggregator-cache-guided',
  problemTitle: 'Build a News Aggregator Cache - Feed Generation at Scale',

  requirementsPhase: newsAggregatorCacheRequirementsPhase,

  totalSteps: 7,
  steps: [step1, step2, step3, step4, step5, step6, step7],
};

export function getNewsAggregatorCacheGuidedTutorial(): GuidedTutorial {
  return newsAggregatorCacheGuidedTutorial;
}
