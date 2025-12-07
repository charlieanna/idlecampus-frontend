import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * News Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 6-step tutorial that teaches system design concepts
 * while building a news search platform like Google News or Apple News.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview - freshness, sources, deduplication)
 * Steps 1-3: Build basic news article search
 * Steps 4-6: Advanced features (recency boosting, source ranking, near-duplicate detection)
 *
 * Key Concepts:
 * - News article search with full-text indexing
 * - Recency/freshness boosting for time-sensitive content
 * - Source credibility ranking
 * - Near-duplicate detection and clustering
 * - Real-time indexing of breaking news
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const newsSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a news search system like Google News or Apple News",

  interviewer: {
    name: 'Maya Patel',
    role: 'Principal Engineer at NewsFlow',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-search',
      category: 'functional',
      question: "What's the core functionality users expect from news search?",
      answer: "Users want to:\n\n1. **Search breaking news** - Type 'climate summit' and find latest articles\n2. **See fresh results** - News from last hour, not last year\n3. **Filter by time** - Today, this week, this month\n4. **Trusted sources** - Prioritize credible news organizations\n5. **Avoid duplicates** - Same story from 50 sources shown once",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "News search is fundamentally different from product search - recency matters more than anything",
    },
    {
      id: 'freshness-requirement',
      category: 'functional',
      question: "How important is freshness for news search?",
      answer: "CRITICAL! News search is all about freshness:\n\n- Breaking news (< 1 hour old) should rank FIRST\n- Articles from yesterday are already 'old news'\n- Users expect results sorted by recency by default\n- A 2-day-old article, even if highly relevant, shouldn't beat a 2-hour-old article on breaking news\n\nFreshness is THE primary ranking signal for news.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "News search inverts normal relevance - newer content ranks higher, even if less textually relevant",
    },
    {
      id: 'source-credibility',
      category: 'functional',
      question: "Should all news sources be treated equally?",
      answer: "No! Source credibility matters:\n\n**Tier 1 (Premium)**: Reuters, AP, NYT, BBC, WSJ - boost significantly\n**Tier 2 (Mainstream)**: CNN, NBC, Guardian - standard ranking\n**Tier 3 (Local/Blog)**: Local news, blogs - rank lower\n**Tier 4 (Questionable)**: Known misinformation sources - demote heavily\n\nUsers trust established sources more. Credibility is a key ranking signal.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Source quality prevents misinformation from ranking high in search results",
    },
    {
      id: 'duplicate-detection',
      category: 'functional',
      question: "What about duplicate stories? The same event is covered by 100 sources!",
      answer: "Excellent question! **Near-duplicate detection** is essential:\n\n- Same event covered by AP, Reuters, CNN, BBC, etc.\n- Users don't want to see 50 nearly-identical articles\n- Solution: **Cluster similar articles**, show one representative\n- Display count: 'Climate summit (35 related articles)'\n\nThis requires similarity detection, not just exact matching.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "News aggregation requires deduplication - same story, many sources",
    },
    {
      id: 'real-time-indexing',
      category: 'functional',
      question: "How quickly should new articles appear in search?",
      answer: "For breaking news: **within seconds**!\n\n- Major event happens (earthquake, election result)\n- News wire publishes (AP, Reuters)\n- Article should be searchable in < 30 seconds\n\nThis requires near real-time indexing, not batch updates.",
      importance: 'critical',
      insight: "News search needs streaming ingestion, not daily batch indexing",
    },
    {
      id: 'time-filtering',
      category: 'functional',
      question: "Should users be able to filter by time period?",
      answer: "Yes! Time filters are essential:\n\n- **Last hour** - Breaking news\n- **Today** - Current events\n- **This week** - Recent developments\n- **This month** - Background context\n- **Custom range** - Historical research\n\nMost users default to 'Today' or 'This week'.",
      importance: 'important',
      insight: "News users almost always filter by recency - unlike product search",
    },
    {
      id: 'topic-clustering',
      category: 'clarification',
      question: "Should we group articles by topic or event?",
      answer: "Eventually yes - show 'Top Stories' clusters:\n- 'Climate Summit' (50 articles)\n- 'Tech Earnings' (30 articles)\n\nBut for MVP, let's focus on search first. Topic clustering can come in v2.",
      importance: 'nice-to-have',
      insight: "Topic clustering is complex - good feature for later iteration",
    },

    // SCALE & NFRs
    {
      id: 'throughput-articles',
      category: 'throughput',
      question: "How many news articles are published per day?",
      answer: "About 5 million articles per day globally from all sources (wires, newspapers, blogs, etc.)",
      importance: 'critical',
      calculation: {
        formula: "5M ÷ 86,400 sec = 58 articles/sec average",
        result: "~60 articles/sec (200+ at peak during breaking news)",
      },
      learningPoint: "Massive write volume requires streaming ingestion pipeline",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day?",
      answer: "About 500 million searches per day from 100 million daily active users",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 searches/sec",
        result: "~6K searches/sec average (20K at peak during major events)",
      },
      learningPoint: "High query volume during breaking news - traffic spikes are common",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results return?",
      answer: "p99 under 300ms. Users are willing to wait slightly longer for news than e-commerce, but not much. Anything over 500ms feels slow.",
      importance: 'critical',
      learningPoint: "News search can tolerate slightly higher latency than e-commerce, but speed still matters",
    },
    {
      id: 'latency-indexing',
      category: 'latency',
      question: "How quickly must new articles be indexed?",
      answer: "For breaking news: **under 30 seconds** from publish to searchable. For regular news: under 2 minutes is acceptable.",
      importance: 'critical',
      learningPoint: "Real-time indexing is essential - batch processing too slow for news",
    },
    {
      id: 'consistency-requirement',
      category: 'consistency',
      question: "How fresh must search results be?",
      answer: "**Near real-time consistency**:\n\n- New articles: Searchable within 30 seconds\n- Updates/corrections: Within 1 minute\n- Deletions (retractions): Within 1 minute\n\nEventual consistency is acceptable - users understand breaking news evolves.",
      importance: 'important',
      learningPoint: "News search needs near real-time updates, but eventual consistency is OK",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if news search goes down?",
      answer: "Very bad - but not catastrophic like e-commerce. Users can go directly to news sites. Target: 99.9% availability (43 minutes downtime/month acceptable).",
      importance: 'important',
      learningPoint: "News search needs high availability but can tolerate brief outages",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-search', 'freshness-requirement', 'source-credibility', 'duplicate-detection'],
  criticalFRQuestionIds: ['core-search', 'freshness-requirement', 'source-credibility', 'duplicate-detection'],
  criticalScaleQuestionIds: ['throughput-articles', 'throughput-searches', 'latency-indexing'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Search news with recency boosting',
      description: 'Full-text search with breaking news ranked first, fresher content prioritized',
      emoji: '📰',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Source credibility ranking',
      description: 'Trusted sources (Reuters, AP, NYT) ranked higher than questionable sources',
      emoji: '🏆',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Near-duplicate detection',
      description: 'Cluster similar articles covering the same story, show representative article',
      emoji: '🔗',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million readers',
    writesPerDay: '5 million articles published',
    readsPerDay: '500 million searches',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 58, peak: 200 },
    calculatedReadRPS: { average: 5787, peak: 20000 },
    maxPayloadSize: '~100KB (article with images)',
    storagePerRecord: '~50KB per article',
    storageGrowthPerYear: '~90TB (5M articles/day)',
    redirectLatencySLA: 'p99 < 300ms (search)',
    createLatencySLA: 'p99 < 30s (indexing)',
  },

  architecturalImplications: [
    '✅ 5M articles/day → Real-time streaming ingestion (not batch)',
    '✅ 20K searches/sec at peak → Distributed search cluster',
    '✅ Recency boosting → Time-decay ranking function',
    '✅ Source ranking → Pre-computed source credibility scores',
    '✅ Duplicate detection → LSH or MinHash for similarity',
    '✅ 30-second indexing SLA → Kafka + Elasticsearch streaming',
  ],

  outOfScope: [
    'Topic clustering / Top Stories',
    'Personalized news feed',
    'Sentiment analysis',
    'Fact-checking integration',
    'Multi-language support',
    'Image/video search',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search news articles with basic text matching. The complexity of recency boosting, source ranking, and duplicate detection will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📰',
  scenario: "Welcome to NewsFlow! You're building the next-generation news search engine.",
  hook: "Your first reader wants to search for 'climate summit' and find the latest breaking news!",
  challenge: "Set up the basic request flow so search queries can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your news search service is online!',
  achievement: 'Readers can now send search requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search news yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every news search system starts with a **Client** connecting to a **Server**.

When a user searches for breaking news:
1. Their browser/app (the **Client**) sends the query
2. It goes to your **News Search API Server**
3. The server processes the query and returns news articles
4. Results are sorted by recency and relevance

This is the foundation of all news search applications!`,

  whyItMatters: 'Without this connection, users can\'t search for news - they\'re stuck manually checking news sites.',

  realWorldExample: {
    company: 'Google News',
    scenario: 'Handling millions of news searches per day',
    howTheyDoIt: 'Started with basic news search in 2002, now uses distributed search clusters that index articles from 100,000+ sources in real-time',
  },

  keyPoints: [
    'Client = the reader\'s device (browser, mobile app)',
    'News Search API Server = backend that handles search requests',
    'HTTP/HTTPS = the protocol for communication',
    'News search prioritizes recency over other factors',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that submits news search queries', icon: '📱' },
    { title: 'News API Server', explanation: 'Backend that processes news search requests', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'news-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for news search',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching for news', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles news search API requests', displayName: 'News Search API' },
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
// STEP 2: Implement News Search API (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to search news!",
  hook: "A reader typed 'climate summit' but got an error.",
  challenge: "Write the Python code to handle news search queries and return articles.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your news search API works!',
  achievement: 'You implemented basic news article search functionality',
  metrics: [
    { label: 'APIs implemented', after: '1' },
    { label: 'Can search news', after: '✓' },
  ],
  nextTeaser: "But searching through millions of articles is too slow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: News Search Handler',
  conceptExplanation: `Every news search API needs a **handler function** that:
1. Receives the search query
2. Searches through news articles
3. Returns matching results sorted by recency

For news search, we need:
- \`search_news(query, time_filter)\` - Find articles matching text, sorted by publish time

Key differences from product search:
- Default sort: newest first (not relevance)
- Time filters are critical (today, this week, etc.)
- Article metadata: title, source, publish_time, url`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where news search happens!',

  famousIncident: {
    title: 'Google News Indexing Delay',
    company: 'Google',
    year: '2018',
    whatHappened: 'Google News had a bug that delayed indexing of breaking news by 2-3 hours. Users searching for "Hawaii volcano eruption" couldn\'t find articles published in the last hour. Traffic shifted to Twitter for real-time news.',
    lessonLearned: 'For news search, real-time indexing is critical. Delays of even minutes hurt user experience.',
    icon: '⏰',
  },

  realWorldExample: {
    company: 'Google News',
    scenario: 'Processing 20K searches per second during breaking events',
    howTheyDoIt: 'Their search service uses distributed Elasticsearch clusters with custom time-decay ranking',
  },

  keyPoints: [
    'News search API receives query and time_filter as parameters',
    'Use in-memory storage for MVP (search index comes in Step 3)',
    'Return article list sorted by publish time (newest first)',
    'Include metadata: title, source, publish_time, url',
  ],

  quickCheck: {
    question: 'What\'s the key difference between news search and product search?',
    options: [
      'News search is faster',
      'News search prioritizes recency over text relevance',
      'News search has fewer results',
      'News search doesn\'t need caching',
    ],
    correctIndex: 1,
    explanation: 'News search inverts traditional relevance - newer articles rank higher, even if less textually relevant. Freshness is the primary ranking signal.',
  },

  keyConcepts: [
    { title: 'Search Handler', explanation: 'Function that processes news search queries', icon: '⚙️' },
    { title: 'Recency Sort', explanation: 'Sort by publish time, newest first', icon: '🕐' },
    { title: 'Time Filter', explanation: 'Filter by time range (today, this week, etc.)', icon: '📅' },
  ],
};

const step2: GuidedStep = {
  id: 'news-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search news articles by text',
    taskDescription: 'Configure news search API and implement Python handler',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/news/search API',
      'Open the Python tab',
      'Implement search_news() function',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign the news search endpoint',
    level2: 'After assigning API, switch to the Python tab. Implement the TODO for search_news',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/news/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Search Index (Elasticsearch)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 5 million news articles, and search takes 10+ seconds!",
  hook: "Scanning through millions of articles for every search query is impossibly slow. And you can't handle real-time indexing of breaking news.",
  challenge: "Add a search index (Elasticsearch) for fast, real-time news search.",
  illustration: 'slow-search',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'News search is lightning fast now!',
  achievement: 'Search index enables sub-second queries on millions of articles',
  metrics: [
    { label: 'Search latency', before: '10000ms', after: '100ms' },
    { label: 'Articles indexed', after: '5M+' },
    { label: 'Real-time indexing', after: 'Enabled' },
  ],
  nextTeaser: "But old articles are ranking higher than breaking news...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Search Index: Why Elasticsearch for News?',
  conceptExplanation: `A **search index** is a specialized data structure for fast text search.

Why Elasticsearch for news search?
- **Inverted index** - Lightning fast text search on millions of articles
- **Time-based indexing** - Efficient filtering by publish time
- **Real-time indexing** - New articles searchable in seconds
- **Distributed** - Scales to billions of articles
- **Time series optimization** - Perfect for time-ordered data like news

News articles are stored with:
- \`title\`, \`content\`, \`source\`, \`publish_time\`
- \`url\`, \`author\`, \`category\`
- Indexed by publish time for fast recency queries`,

  whyItMatters: 'At scale, SQL databases can\'t provide the real-time search and time-based ranking that news requires.',

  famousIncident: {
    title: 'Reuters News Search Overhaul',
    company: 'Reuters',
    year: '2015',
    whatHappened: 'Reuters replaced their SQL-based news archive search with Elasticsearch. Search latency dropped from 5 seconds to under 100ms. Users could finally search breaking news in real-time.',
    lessonLearned: 'News search has unique requirements - SQL databases aren\'t designed for time-series search at scale.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Google News',
    scenario: 'Searching 5M articles published daily',
    howTheyDoIt: 'Uses distributed Elasticsearch clusters with time-based sharding. Each shard holds one day of news. Recent shards get higher query priority.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │Elasticsearch │
└────────┘     └─────────────┘     │ Search Index │
                                   └──────────────┘

Elasticsearch Index Structure (Time-based):
{
  "article_id": "123",
  "title": "Climate Summit Reaches Agreement",
  "content": "...",
  "source": "Reuters",
  "publish_time": "2025-12-07T10:30:00Z",
  "url": "https://...",
  "category": "Environment"
}

Index Sharding Strategy:
- Shard by day: news_2025-12-07, news_2025-12-06, ...
- Recent shards searched first
- Old shards archived for historical search
`,

  keyPoints: [
    'Elasticsearch is optimized for time-series data like news',
    'Real-time indexing: articles searchable in < 30 seconds',
    'Time-based sharding: one index per day',
    'Recent shards prioritized for breaking news',
    'Handles typos, relevance scoring out of the box',
  ],

  quickCheck: {
    question: 'Why use time-based sharding for news search?',
    options: [
      'It\'s cheaper',
      'Recent news gets searched most - time-based sharding is more efficient',
      'It\'s easier to implement',
      'It uses less storage',
    ],
    correctIndex: 1,
    explanation: 'Most news searches focus on recent articles (today, this week). Time-based sharding lets you search recent shards first, making queries faster.',
  },

  keyConcepts: [
    { title: 'Search Index', explanation: 'Specialized structure for fast text search', icon: '📇' },
    { title: 'Time-based Sharding', explanation: 'Split index by time period (day/week)', icon: '📅' },
    { title: 'Real-time Indexing', explanation: 'New articles searchable in seconds', icon: '⚡' },
  ],
};

const step3: GuidedStep = {
  id: 'news-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast news search with real-time indexing',
    taskDescription: 'Add Elasticsearch search index and connect App Server to it',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enable fast full-text search on millions of articles', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index component added to canvas',
      'App Server connected to Search Index',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Drag a Search Index (Elasticsearch) component onto the canvas',
    level2: 'Click App Server, then click Search Index to create a connection',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 4: Implement Recency Boosting
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📅',
  scenario: "Users search for 'climate summit' and get articles from last month!",
  hook: "Breaking news published 1 hour ago is ranked BELOW articles from weeks ago just because they're slightly more textually relevant. This is backwards!",
  challenge: "Implement recency boosting so fresh news ranks first.",
  illustration: 'time-decay',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔥',
  message: 'Breaking news now ranks first!',
  achievement: 'Recency boosting prioritizes fresh content',
  metrics: [
    { label: 'Recency weight', after: '70%' },
    { label: 'Breaking news ranking', before: '#15', after: '#1' },
    { label: 'User satisfaction', after: '+80%' },
  ],
  nextTeaser: "But unreliable sources are ranking too high...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Recency Boosting: Time-Decay Ranking',
  conceptExplanation: `**Recency boosting** ensures fresh news ranks higher than old news.

Time-decay function:
\`\`\`
recency_score = 1 / (1 + (current_time - publish_time) / decay_rate)
\`\`\`

Example decay rates:
- **1 hour**: Breaking news gets huge boost
- **1 day**: Recent news still boosted
- **1 week**: Old news significantly demoted

Combined scoring:
\`\`\`
final_score = (text_relevance × 0.3) + (recency_score × 0.7)
\`\`\`

For news, recency weight is 70%+ (vs 5% for e-commerce).

Elasticsearch implementation:
\`\`\`json
{
  "function_score": {
    "functions": [{
      "gauss": {
        "publish_time": {
          "scale": "1h",
          "decay": 0.5
        }
      },
      "weight": 0.7
    }]
  }
}
\`\`\``,

  whyItMatters: 'Without recency boosting, news search is useless - users want breaking news, not old articles.',

  famousIncident: {
    title: 'Apple News Recency Bug',
    company: 'Apple',
    year: '2019',
    whatHappened: 'Apple News had a bug where older cached articles ranked higher than breaking news. Users searching for "election results" saw articles from previous elections. Thousands of complaints before fix.',
    lessonLearned: 'For news, recency is THE primary ranking signal. Text relevance is secondary.',
    icon: '📰',
  },

  realWorldExample: {
    company: 'Google News',
    scenario: 'Ranking breaking news during major events',
    howTheyDoIt: 'Uses aggressive time-decay with 1-hour half-life for breaking news. Articles older than 24 hours get significant ranking penalty unless highly relevant.',
  },

  diagram: `
Time-Decay Curve:

Score
  │
1 │●
  │ ●
  │  ●
  │   ●●
  │     ●●
  │       ●●●
  │          ●●●●
  │              ●●●●●●●●●●
0 └─────────────────────────▶ Time
  Now  1h   6h  12h  24h  1w

Breaking news (< 1h): Score near 1.0
Today's news (< 24h): Score 0.5-0.8
This week (< 7d): Score 0.2-0.5
Old news (> 7d): Score < 0.2
`,

  keyPoints: [
    'Recency is the PRIMARY ranking signal for news (70%+ weight)',
    'Time-decay function: exponential or Gaussian decay',
    'Breaking news (< 1 hour) gets massive boost',
    'Articles older than 1 week heavily demoted',
    'Elasticsearch function_score with gauss decay',
  ],

  quickCheck: {
    question: 'Why does news search prioritize recency over text relevance?',
    options: [
      'It\'s easier to implement',
      'Users want breaking news, not the most textually relevant old article',
      'Recency is more accurate',
      'It reduces server load',
    ],
    correctIndex: 1,
    explanation: 'News is time-sensitive. A breaking article from 1 hour ago is more valuable than a highly relevant article from last month.',
  },

  keyConcepts: [
    { title: 'Time Decay', explanation: 'Score decreases as content ages', icon: '📉' },
    { title: 'Recency Weight', explanation: 'How much recency affects final score (70%+)', icon: '⚖️' },
    { title: 'Gaussian Decay', explanation: 'Smooth decay curve, not linear', icon: '📈' },
  ],
};

const step4: GuidedStep = {
  id: 'news-search-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Breaking news ranks first with recency boosting',
    taskDescription: 'Configure time-decay ranking in Elasticsearch',
    successCriteria: [
      'Click on Search Index component',
      'Go to Ranking Configuration',
      'Enable function_score with time decay',
      'Set recency weight to 70%',
      'Configure decay scale: 1 hour for breaking news',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Click on Search Index, find the Ranking Configuration section',
    level2: 'Enable function_score, add time decay with 70% weight and 1-hour scale',
    solutionComponents: [{ type: 'search_index', config: { ranking: { recency_weight: 0.7 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Implement Source Ranking
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🏆',
  scenario: "Users search for 'vaccine study' and a random blog ranks above Reuters!",
  hook: "Not all sources are equal. Users trust Reuters, AP, NYT more than unknown blogs. We need source credibility ranking.",
  challenge: "Implement source ranking to prioritize trusted news organizations.",
  illustration: 'source-trust',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎖️',
  message: 'Trusted sources now rank higher!',
  achievement: 'Source credibility ranking prevents misinformation',
  metrics: [
    { label: 'Source tiers', after: '4 levels' },
    { label: 'Premium sources boosted', after: '+50%' },
    { label: 'Questionable sources demoted', after: '-80%' },
    { label: 'User trust', after: '+70%' },
  ],
  nextTeaser: "But users see 50 articles about the same story...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Source Ranking: Credibility Matters',
  conceptExplanation: `**Source ranking** boosts trusted sources and demotes questionable ones.

Source tiers with multipliers:

**Tier 1 - Premium (2.0x boost)**
- Wire services: Reuters, AP, AFP
- Prestigious: NYT, WSJ, BBC, The Guardian
- Boost: +100% to final score

**Tier 2 - Mainstream (1.0x neutral)**
- Major outlets: CNN, NBC, Fox News, NPR
- National newspapers: USA Today, LA Times
- Boost: 0% (baseline)

**Tier 3 - Local/Niche (0.5x penalty)**
- Local newspapers
- Specialized blogs
- Boost: -50% to final score

**Tier 4 - Questionable (0.1x severe penalty)**
- Known misinformation sources
- Unverified blogs
- Boost: -90% to final score

Combined scoring:
\`\`\`
final_score = (text_relevance × 0.2) + (recency × 0.6) + (source_credibility × 0.2)
\`\`\``,

  whyItMatters: 'Source ranking prevents misinformation from ranking high and helps users find trustworthy news.',

  famousIncident: {
    title: 'Facebook Misinformation Crisis',
    company: 'Facebook',
    year: '2016-2018',
    whatHappened: 'Facebook\'s news feed algorithm didn\'t prioritize source credibility. Misinformation from questionable sources spread widely. After public outcry, they added source ranking to demote low-quality sources.',
    lessonLearned: 'Source credibility MUST be a ranking signal. Not all sources are equal - prioritize trusted journalism.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Google News',
    scenario: 'Ranking sources for breaking news',
    howTheyDoIt: 'Maintains curated list of 100,000+ sources with credibility scores. Wire services (Reuters, AP) get automatic top ranking. Uses algorithmic signals: fact-check rate, corrections rate, awards.',
  },

  diagram: `
Source Ranking Example:

Query: "vaccine effectiveness study"

Article A: Reuters - Clinical trial results
- Text relevance: 90/100
- Recency: 85/100 (2 hours old)
- Source credibility: 100/100 (Tier 1)
→ Final Score: 91.0 → Rank #1

Article B: Unknown Blog - Opinion piece
- Text relevance: 95/100 (higher text match!)
- Recency: 95/100 (1 hour old)
- Source credibility: 10/100 (Tier 4)
→ Final Score: 62.0 → Rank #12

Source boost prevents misinformation from ranking high.
`,

  keyPoints: [
    'Source credibility is a key ranking signal (20% weight)',
    'Tier 1 sources (Reuters, AP, NYT) get 2x boost',
    'Tier 4 sources (misinformation) get 0.1x penalty',
    'Maintain curated source credibility database',
    'Algorithmic signals: fact-checks, corrections, awards',
  ],

  quickCheck: {
    question: 'Why prioritize source credibility over text relevance?',
    options: [
      'Source ranking is easier to compute',
      'Prevents misinformation from ranking high - user trust matters',
      'It uses less server resources',
      'Text relevance is inaccurate',
    ],
    correctIndex: 1,
    explanation: 'A highly relevant article from an unreliable source can spread misinformation. Source credibility protects users and builds trust.',
  },

  keyConcepts: [
    { title: 'Source Tier', explanation: 'Credibility level (Tier 1 = Premium)', icon: '🏆' },
    { title: 'Credibility Score', explanation: 'Numeric score (0-100) for source quality', icon: '📊' },
    { title: 'Source Boost', explanation: 'Multiplier applied to final score', icon: '⚡' },
  ],
};

const step5: GuidedStep = {
  id: 'news-search-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Trusted sources ranked higher',
    taskDescription: 'Implement source credibility ranking',
    successCriteria: [
      'Click on Search Index component',
      'Go to Source Ranking Configuration',
      'Define source tiers (Tier 1-4)',
      'Assign credibility scores to major sources',
      'Set source ranking weight to 20%',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Click on Search Index, find Source Ranking Configuration',
    level2: 'Define 4 source tiers with appropriate boosts: Tier 1 (2.0x), Tier 2 (1.0x), Tier 3 (0.5x), Tier 4 (0.1x)',
    solutionComponents: [{ type: 'search_index', config: { source_ranking: { enabled: true } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Implement Near-Duplicate Detection
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔗',
  scenario: "Users search for 'climate summit' and see 50 nearly identical articles!",
  hook: "Reuters, AP, CNN, BBC all covered the same story. Users don't want to see 50 duplicates - they want one representative article with a count.",
  challenge: "Implement near-duplicate detection to cluster similar articles.",
  illustration: 'duplicate-detection',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Duplicate articles are now clustered!',
  achievement: 'Near-duplicate detection provides clean search results',
  metrics: [
    { label: 'Duplicate clusters', after: 'Enabled' },
    { label: 'Results shown', before: '50', after: '5 (with counts)' },
    { label: 'User experience', after: '+90%' },
    { label: 'Click-through rate', after: '+60%' },
  ],
  nextTeaser: "You've built a production-grade news search system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Near-Duplicate Detection: Clustering Similar Articles',
  conceptExplanation: `**Near-duplicate detection** identifies articles covering the same story.

Similarity techniques:

**1. MinHash / LSH (Locality-Sensitive Hashing)**
- Convert article to set of shingles (word n-grams)
- Hash shingles to create signature
- Similar articles have similar signatures
- Fast: O(1) lookup for duplicates

**2. Cosine Similarity**
- Convert articles to TF-IDF vectors
- Compute cosine similarity
- Threshold: > 0.8 = duplicates
- More accurate but slower

**3. Title + First Paragraph Matching**
- Many duplicates share identical leads
- Fast heuristic for wire service articles
- Combine with full-text similarity

Clustering approach:
1. New article arrives
2. Compute MinHash signature
3. Find articles with similarity > 0.8
4. If found: add to existing cluster
5. If not: create new cluster
6. Show cluster representative (highest source tier)

Display:
- "Climate summit reaches agreement (35 related articles)"
- Click to expand cluster`,

  whyItMatters: 'Without deduplication, search results are cluttered with the same story repeated 50 times.',

  famousIncident: {
    title: 'Google News Duplicate Avalanche',
    company: 'Google',
    year: '2008',
    whatHappened: 'Google News launched without good duplicate detection. Major stories would have 100+ nearly identical results. Users complained search was "unusable". They added clustering in 2008, dramatically improving UX.',
    lessonLearned: 'News aggregation requires deduplication - same story, many sources. Clustering is essential.',
    icon: '📰',
  },

  realWorldExample: {
    company: 'Google News',
    scenario: 'Clustering articles during breaking news',
    howTheyDoIt: 'Uses MinHash for real-time similarity detection. Clusters articles within seconds of publication. Shows highest-credibility source as representative.',
  },

  diagram: `
Near-Duplicate Detection Pipeline:

New Article: "Climate Summit Reaches Deal"
       │
       ▼
Compute MinHash Signature
       │
       ▼
Search for Similar Articles (> 0.8 similarity)
       │
       ├─ Found: Reuters "Climate Summit Reaches Deal"
       ├─ Found: AP "Climate Summit Reaches Agreement"
       ├─ Found: CNN "Climate Summit Deal Announced"
       │
       ▼
Create Cluster
       │
       ▼
Select Representative (highest source tier)
→ Show: "Climate Summit Reaches Deal - Reuters (35 related)"

Similarity Computation:
Article A: "Climate summit reaches agreement on emissions"
Article B: "Climate summit reaches deal on emissions cuts"
→ Shingles: {climate summit, summit reaches, reaches agreement, ...}
→ MinHash signatures: 85% overlap
→ DUPLICATE! Add to cluster.
`,

  keyPoints: [
    'MinHash/LSH for fast similarity detection',
    'Similarity threshold: 0.8+ = near-duplicates',
    'Cluster articles in real-time as they arrive',
    'Show highest-tier source as representative',
    'Display cluster count: "(35 related articles)"',
  ],

  quickCheck: {
    question: 'Why use MinHash instead of comparing every article pair?',
    options: [
      'MinHash is more accurate',
      'Comparing all pairs is O(n²) - too slow at scale',
      'MinHash uses less storage',
      'MinHash is easier to implement',
    ],
    correctIndex: 1,
    explanation: 'With millions of articles, comparing all pairs is computationally infeasible. MinHash provides O(1) lookup for duplicates using hashing.',
  },

  keyConcepts: [
    { title: 'MinHash', explanation: 'Hash-based similarity estimation', icon: '#️⃣' },
    { title: 'LSH', explanation: 'Locality-Sensitive Hashing for fast lookups', icon: '🔍' },
    { title: 'Clustering', explanation: 'Group similar articles together', icon: '🔗' },
    { title: 'Representative', explanation: 'Best article shown for cluster', icon: '🏆' },
  ],
};

const step6: GuidedStep = {
  id: 'news-search-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Near-duplicate detection clusters similar articles',
    taskDescription: 'Implement duplicate detection and clustering',
    successCriteria: [
      'Click on Search Index component',
      'Go to Deduplication Configuration',
      'Enable MinHash/LSH similarity detection',
      'Set similarity threshold to 0.8',
      'Configure clustering to show representative article',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Click on Search Index, find Deduplication Configuration',
    level2: 'Enable MinHash with 0.8 similarity threshold and clustering enabled',
    solutionComponents: [{ type: 'search_index', config: { deduplication: { enabled: true } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const newsSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'news-search',
  title: 'Design News Search System',
  description: 'Build a news article search platform with recency boosting, source ranking, and duplicate detection',
  difficulty: 'intermediate',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '📰',
    hook: "You've been hired as Lead Search Engineer at NewsFlow!",
    scenario: "Your mission: Build a news search system that indexes 5M articles per day with real-time search, recency boosting, and duplicate detection.",
    challenge: "Can you design a search system that surfaces breaking news instantly while filtering out misinformation?",
  },

  requirementsPhase: newsSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'News Search API Design',
    'Elasticsearch / Full-text Search',
    'Time-based Indexing',
    'Real-time Indexing',
    'Recency Boosting',
    'Time-Decay Ranking',
    'Source Credibility Ranking',
    'Near-Duplicate Detection',
    'MinHash / LSH',
    'Article Clustering',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
  ],
};

export default newsSearchGuidedTutorial;
