import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Social Media Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches system design concepts
 * while building a social media search platform like Twitter Search or Instagram Search.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic social content search
 * Steps 4-6: Hashtag search, mention search, viral content detection
 *
 * Key Concepts:
 * - Full-text search for social content
 * - Real-time indexing
 * - Hashtag and mention extraction
 * - Trending topics detection
 * - Viral content ranking
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const socialMediaSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a search system for a social media platform",

  interviewer: {
    name: 'Jessica Chen',
    role: 'Principal Engineer at Social Search Co.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-search',
      category: 'functional',
      question: "What types of content should users be able to search for?",
      answer: "Users want to search:\n\n1. **Posts** - Find posts by keyword (e.g., 'climate change')\n2. **Users** - Find people by name or handle (e.g., '@nasa')\n3. **Hashtags** - Discover trending topics (e.g., '#WorldCup')\n4. **Media** - Find posts with images or videos (defer to v2)",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Social media search is about discovering content and people in real-time",
    },
    {
      id: 'content-types',
      category: 'functional',
      question: "What metadata should be searchable in posts?",
      answer: "Posts contain:\n1. **Text content** - The actual message\n2. **Hashtags** - #trending topics\n3. **Mentions** - @username references\n4. **Author** - Who posted it\n5. **Timestamp** - When it was posted\n\nAll of these should be searchable and filterable.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Social content has rich metadata that powers different search experiences",
    },
    {
      id: 'real-time',
      category: 'functional',
      question: "How quickly should new posts appear in search results?",
      answer: "**Near real-time** - within 1-2 seconds of posting. When a breaking news event happens, users expect to search for it immediately and see the latest posts.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Real-time indexing is what separates social search from traditional search",
    },
    {
      id: 'trending-topics',
      category: 'functional',
      question: "Should we detect and show trending topics?",
      answer: "Yes! **Trending topics** (hashtags or keywords) are critical:\n1. Show what's popular RIGHT NOW\n2. Compute based on recent velocity (spike detection)\n3. Update every few minutes\n4. Personalized by location or interests\n\nThis requires stream processing of search queries and post creation.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Trending detection is about velocity analysis, not just volume",
    },
    {
      id: 'viral-content',
      category: 'functional',
      question: "How should we rank search results?",
      answer: "**Viral content first** - combine multiple signals:\n1. **Relevance** - Text match quality\n2. **Engagement** - Likes, shares, comments\n3. **Recency** - Recent posts boosted\n4. **Author popularity** - Verified/popular accounts ranked higher\n5. **Virality** - Rapid engagement growth\n\nDifferent from e-commerce - social media prioritizes engagement and recency.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Social media ranking emphasizes engagement and recency over pure text relevance",
    },
    {
      id: 'search-filters',
      category: 'functional',
      question: "What filters should users have?",
      answer: "Users need filters:\n1. **Date range** - Posts from last hour, day, week\n2. **Account type** - Verified accounts only\n3. **Language** - Filter by language\n4. **Media type** - Only posts with images/videos (v2)\n5. **Location** - Posts from specific region (v2)\n\nFor MVP, focus on date and account type.",
      importance: 'important',
      revealsRequirement: 'FR-1',
      learningPoint: "Time-based filtering is especially critical for social media",
    },
    {
      id: 'autocomplete',
      category: 'functional',
      question: "Should search have autocomplete suggestions?",
      answer: "Eventually yes - show trending hashtags and popular accounts as users type. But for MVP, defer to v2. Focus on making basic search work first.",
      importance: 'nice-to-have',
      insight: "Autocomplete requires sub-50ms latency - complex to implement",
    },
    {
      id: 'personalization',
      category: 'clarification',
      question: "Should search results be personalized?",
      answer: "Eventually yes - boost posts from accounts the user follows or topics they engage with. But for MVP, keep it simple with universal ranking. Add personalization in v2.",
      importance: 'nice-to-have',
      insight: "Personalization adds complexity - good to start with universal search",
    },

    // SCALE & NFRs
    {
      id: 'throughput-posts',
      category: 'throughput',
      question: "How many posts are created per day?",
      answer: "About 500 million posts per day across all users - all need to be indexed in real-time",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 posts/sec",
        result: "~6K writes/sec average (18K at peak)",
      },
      learningPoint: "Real-time indexing at this scale requires stream processing",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day?",
      answer: "About 2 billion searches per day from 200 million daily active users",
      importance: 'critical',
      calculation: {
        formula: "2B ÷ 86,400 sec = 23,148 searches/sec",
        result: "~23K searches/sec average (70K at peak)",
      },
      learningPoint: "Read-heavy workload - caching is critical",
    },
    {
      id: 'throughput-trending',
      category: 'throughput',
      question: "How do we compute trending topics at scale?",
      answer: "Trending requires analyzing:\n- 500M posts/day for hashtag extraction\n- 2B searches/day for query frequency\n- Real-time aggregation windows (last 5 min, 1 hour, 24 hours)\n\nThis needs stream processing (Kafka + Flink or Spark Streaming).",
      importance: 'critical',
      learningPoint: "Trending detection is a real-time analytics problem",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results return?",
      answer: "p99 under 300ms for search. Slower than e-commerce because results are constantly changing - users understand slight delay for fresh content.",
      importance: 'critical',
      learningPoint: "Social search can tolerate slightly higher latency than commerce search",
    },
    {
      id: 'latency-indexing',
      category: 'latency',
      question: "How fast must new posts be indexed?",
      answer: "Within 1-2 seconds. When breaking news happens, users search for it immediately. Stale results = bad experience.",
      importance: 'critical',
      learningPoint: "Real-time indexing is a key differentiator for social search",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if search goes down?",
      answer: "Major impact but not catastrophic. Users can still see their timeline and post. But discovery is broken. Need 99.9% availability - less than 45 minutes downtime per month.",
      importance: 'important',
      learningPoint: "Search downtime impacts discovery but doesn't break core posting",
    },
    {
      id: 'consistency-requirement',
      category: 'consistency',
      question: "How consistent must search results be?",
      answer: "**Eventual consistency is fine**:\n- New posts in search: 1-2 seconds OK\n- Trending topics update: 5 minutes OK\n- Engagement counts: 30 seconds OK\n\nSpeed matters more than perfect consistency for social search.",
      importance: 'important',
      learningPoint: "Social media users expect eventual consistency - real-time matters more",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-search', 'content-types', 'real-time', 'trending-topics', 'viral-content'],
  criticalFRQuestionIds: ['core-search', 'content-types', 'real-time', 'trending-topics'],
  criticalScaleQuestionIds: ['throughput-searches', 'throughput-posts', 'latency-indexing'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search posts by keywords',
      description: 'Full-text search with hashtag and mention support',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Real-time indexing of new posts',
      description: 'Posts appear in search within 1-2 seconds',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Trending topics detection',
      description: 'Identify and display trending hashtags in real-time',
      emoji: '📈',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Viral content ranking',
      description: 'Rank by engagement, recency, and virality',
      emoji: '🔥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '200 million searchers',
    writesPerDay: '500 million posts',
    readsPerDay: '2 billion searches',
    peakMultiplier: 3,
    readWriteRatio: '4:1',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 23148, peak: 69444 },
    maxPayloadSize: '~10KB (search results page)',
    storagePerRecord: '~1KB per post document',
    storageGrowthPerYear: '~180TB (new posts)',
    redirectLatencySLA: 'p99 < 300ms (search)',
    createLatencySLA: 'p99 < 2s (indexing)',
  },

  architecturalImplications: [
    '✅ 500M posts/day → Real-time indexing pipeline required',
    '✅ 70K searches/sec at peak → Distributed search cluster (Elasticsearch)',
    '✅ p99 < 300ms → Aggressive caching of popular queries',
    '✅ Real-time trending → Stream processing (Kafka + Flink)',
    '✅ Hashtag/mention extraction → Text processing pipeline',
    '✅ Viral ranking → Real-time engagement tracking',
  ],

  outOfScope: [
    'Search autocomplete (v2)',
    'Personalized search (v2)',
    'Image/video search (v2)',
    'Location-based search (v2)',
    'Multi-language support (v2)',
    'Search analytics dashboard',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search posts and find trending content. The complexity of real-time indexing, viral detection, and advanced ranking will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome to Social Search Co! You're building the next-gen social media search.",
  hook: "Your first user wants to search for posts about 'climate change'!",
  challenge: "Set up the basic request flow so search queries can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search service is online!',
  achievement: 'Users can now send search requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every search system starts with a **Client** connecting to a **Server**.

When a user searches on Twitter or Instagram:
1. Their browser/app (the **Client**) sends the query
2. It goes to your **Search API Server**
3. The server processes the query and returns results

This is the foundation of all search applications!`,

  whyItMatters: 'Without this connection, users can\'t search at all - they\'re stuck with just their timeline.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling 23,000 searches per second',
    howTheyDoIt: 'Uses distributed search clusters with Earlybird (their custom search engine) to serve results in under 300ms',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'Search API Server = backend that handles search requests',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that submits search queries', icon: '📱' },
    { title: 'Search API Server', explanation: 'Backend that processes search requests', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'social-media-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for search',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching for posts', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles search API requests', displayName: 'Search API Server' },
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
// STEP 2: Implement Search API (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to search!",
  hook: "A user searched for 'climate change' but got an error.",
  challenge: "Write the Python code to handle search queries and return results.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search API works!',
  achievement: 'You implemented basic social media search functionality',
  metrics: [
    { label: 'APIs implemented', after: '1' },
    { label: 'Can search posts', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all posts are gone...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Search Handler',
  conceptExplanation: `Every search API needs a **handler function** that:
1. Receives the search query
2. Searches through posts
3. Returns matching results

For social media search, we need:
- \`search_posts(query, filters)\` - Find posts matching keywords

For now, we'll store posts in memory (Python lists) and use simple string matching.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where search happens!',

  famousIncident: {
    title: 'Twitter Search Downtime During Breaking News',
    company: 'Twitter',
    year: '2011',
    whatHappened: 'During major breaking news (Osama bin Laden announcement), Twitter search went down for 45 minutes. Millions of users couldn\'t find information about the event happening in real-time.',
    lessonLearned: 'Search is critical during breaking news - downtime at key moments has massive impact.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Processing 23K searches per second',
    howTheyDoIt: 'Their search service uses distributed Elasticsearch-like clusters with custom ranking algorithms for engagement',
  },

  keyPoints: [
    'Search API receives query and filters as parameters',
    'Use in-memory storage for MVP (search index comes later)',
    'Extract hashtags and mentions from posts',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - search index comes later',
      'Memory never fails',
      'Databases can\'t search text',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Search index (Elasticsearch) adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Search Handler', explanation: 'Function that processes search queries', icon: '⚙️' },
    { title: 'Query', explanation: 'The text user types to search', icon: '🔤' },
    { title: 'Results', explanation: 'List of matching posts', icon: '📋' },
  ],
};

const step2: GuidedStep = {
  id: 'social-media-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search posts by keywords',
    taskDescription: 'Configure search API and implement Python handler',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/search API',
      'Open the Python tab',
      'Implement search_posts() function',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign the search endpoint',
    level2: 'After assigning API, switch to the Python tab. Implement the TODO for search_posts',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Search Index (Elasticsearch)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million posts, and search takes 8+ seconds!",
  hook: "Scanning through millions of posts for every search query is impossibly slow. And you can't rank by engagement or extract hashtags efficiently.",
  challenge: "Add a search index (Elasticsearch) for fast, smart social search.",
  illustration: 'slow-search',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search is lightning fast now!',
  achievement: 'Search index enables sub-second queries on millions of posts',
  metrics: [
    { label: 'Search latency', before: '8000ms', after: '150ms' },
    { label: 'Hashtag extraction', after: 'Enabled' },
    { label: 'Engagement ranking', after: 'Enabled' },
  ],
  nextTeaser: "But new posts aren't appearing in search results...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Search Index: Why Elasticsearch for Social Search?',
  conceptExplanation: `A **search index** is a specialized data structure for fast text search.

Why NOT use a database?
- SQL LIKE queries are slow on millions of posts
- No ranking by engagement or virality
- No hashtag extraction and aggregation
- No real-time trending detection

**Elasticsearch** provides:
- **Inverted index** - Lightning fast text search
- **Aggregations** - Count hashtags, mentions, trends
- **Custom scoring** - Rank by engagement + recency
- **Near real-time** - New posts searchable in seconds
- **Distributed** - Scales to billions of posts

For social media search, Elasticsearch is essential.`,

  whyItMatters: 'At scale, SQL databases can\'t provide the real-time search experience users expect from social media.',

  famousIncident: {
    title: 'Instagram Search Overhaul',
    company: 'Instagram',
    year: '2015',
    whatHappened: 'Instagram initially used simple database queries for hashtag search. As they grew to billions of posts, search became unusably slow (5-10 seconds). They rebuilt with Elasticsearch, reducing latency to under 200ms.',
    lessonLearned: 'Social media scale requires purpose-built search infrastructure from the start.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Searching 500M+ posts per day in real-time',
    howTheyDoIt: 'Uses Earlybird (custom Lucene-based search) with specialized indexes for hashtags, mentions, and real-time trends.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │Elasticsearch │
└────────┘     └─────────────┘     │ Search Index │
                                   └──────────────┘

Elasticsearch Index Structure:
{
  "post_id": "12345",
  "content": "Just landed! #travel #NYC",
  "author": "@john",
  "hashtags": ["travel", "NYC"],
  "mentions": [],
  "likes": 42,
  "retweets": 15,
  "timestamp": "2025-12-07T10:30:00Z"
}

Inverted Index for hashtags:
- #travel → [post_12345, post_67890, ...]
- #NYC → [post_12345, post_23456, ...]
`,

  keyPoints: [
    'Elasticsearch is optimized for text search with metadata',
    'Inverted index enables fast hashtag and keyword search',
    'Custom scoring combines text relevance + engagement',
    'Near real-time indexing for fresh content',
    'Aggregations power trending detection',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of SQL database for social media search?',
    options: [
      'Elasticsearch is cheaper',
      'SQL can\'t store post data',
      'Elasticsearch provides fast full-text search, hashtag aggregation, and engagement-based ranking',
      'Elasticsearch is easier to set up',
    ],
    correctIndex: 2,
    explanation: 'Elasticsearch is purpose-built for search with features SQL lacks: inverted index, real-time updates, custom scoring, and aggregations for trending.',
  },

  keyConcepts: [
    { title: 'Search Index', explanation: 'Specialized structure for fast text search', icon: '📇' },
    { title: 'Inverted Index', explanation: 'Maps words to posts containing them', icon: '🔍' },
    { title: 'Aggregations', explanation: 'Group and count hashtags, mentions', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'social-media-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast social media search',
    taskDescription: 'Add Elasticsearch search index and connect App Server to it',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enable fast full-text search on millions of posts', displayName: 'Elasticsearch' },
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
// STEP 4: Add Message Queue for Real-Time Indexing
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⏰',
  scenario: "Breaking news is happening! But new posts take 30 seconds to appear in search!",
  hook: "Users are posting about a major event, but search results are stale. You need real-time indexing.",
  challenge: "Add a message queue to index posts in near real-time.",
  illustration: 'real-time-update',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Posts appear in search instantly!',
  achievement: 'Real-time indexing pipeline processes posts in under 2 seconds',
  metrics: [
    { label: 'Indexing latency', before: '30s', after: '<2s' },
    { label: 'Search freshness', after: 'Real-time' },
  ],
  nextTeaser: "But popular searches are hitting the search index too hard...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Indexing: The Message Queue Pattern',
  conceptExplanation: `**Real-time indexing** is what makes social media search different from web search.

The problem:
- 500M posts/day (6K posts/sec) need to be indexed
- Synchronous indexing would block post creation
- Search results must be fresh (< 2 seconds)

**Message Queue Solution**:
1. User posts → Save to database → Publish to queue → Return "Posted!"
2. Background workers consume queue → Index to Elasticsearch
3. Posts appear in search within 1-2 seconds

This decouples posting from indexing - users get instant response!`,

  whyItMatters: 'Real-time indexing is the core differentiator for social search. Stale results during breaking news = bad experience.',

  famousIncident: {
    title: 'Twitter Arab Spring Search Lag',
    company: 'Twitter',
    year: '2011',
    whatHappened: 'During Arab Spring protests, Twitter\'s search indexing lagged by 10-15 minutes during peak posting. Users couldn\'t find real-time updates about rapidly evolving events.',
    lessonLearned: 'Real-time indexing is critical for social media - especially during breaking news.',
    icon: '📰',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Indexing 500M posts/day in real-time',
    howTheyDoIt: 'Uses Kafka for event streaming. Posts flow through Kafka to Earlybird indexing workers. Average indexing latency: 1-2 seconds.',
  },

  diagram: `
User Posts Content
      │
      ▼
┌─────────────┐     ┌──────────────┐
│ App Server  │────▶│   Database   │
│             │     │ (source of   │
└─────────────┘     │   truth)     │
      │             └──────────────┘
      │ Publish
      ▼
┌─────────────────────────────────────┐
│          Message Queue              │
│    [post1, post2, post3, ...]       │
└──────────────┬──────────────────────┘
               │ Workers consume
               ▼
        ┌─────────────────┐
        │ Indexing Workers│
        │  (background)   │
        └────────┬────────┘
                 │
                 ▼
        ┌──────────────┐
        │Elasticsearch │
        │              │
        └──────────────┘
`,

  keyPoints: [
    'Message queue decouples posting from indexing',
    'Posts saved to database first (source of truth)',
    'Background workers index to Elasticsearch',
    'Near real-time: posts searchable in 1-2 seconds',
    'Workers can scale independently of API servers',
  ],

  quickCheck: {
    question: 'Why use async indexing instead of synchronous?',
    options: [
      'It\'s cheaper',
      'Users get instant response, indexing happens in background without blocking',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async indexing means posting returns instantly. Background workers handle indexing without blocking user experience.',
  },

  keyConcepts: [
    { title: 'Real-Time Indexing', explanation: 'Posts searchable within 1-2 seconds', icon: '⚡' },
    { title: 'Message Queue', explanation: 'Buffer for async processing', icon: '📬' },
    { title: 'Indexing Worker', explanation: 'Background process that indexes posts', icon: '⚙️' },
  ],
};

const step4: GuidedStep = {
  id: 'social-media-search-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Real-time indexing of new posts',
    taskDescription: 'Add a Message Queue for async indexing and connect to Database',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle real-time post indexing', displayName: 'Kafka' },
      { type: 'database', reason: 'Store posts as source of truth', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Database component added',
      'App Server connected to Message Queue',
      'App Server connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) and Database (PostgreSQL) onto the canvas',
    level2: 'Connect App Server to both Message Queue and Database',
    solutionComponents: [{ type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Cache for Popular Searches
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Everyone is searching for '#WorldCup'! The same query hits Elasticsearch 5,000 times per second!",
  hook: "Trending searches are overwhelming your search index. You're paying for the same computation over and over.",
  challenge: "Add a cache to serve popular search results instantly.",
  illustration: 'cache-layer',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Popular searches are instant now!',
  achievement: 'Cache dramatically reduced search index load',
  metrics: [
    { label: 'Popular query latency', before: '200ms', after: '10ms' },
    { label: 'Cache hit rate', after: '75%' },
    { label: 'Search index load', before: '100%', after: '25%' },
  ],
  nextTeaser: "But we need to detect trending topics...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Search Results: The Power Law',
  conceptExplanation: `Social media search follows a **power law**: A tiny fraction of queries get most of the traffic.

Popular queries like:
- "#WorldCup"
- "#BreakingNews"
- "@celebrity_name"

These get searched thousands of times per minute during events!

**Cache Strategy**:
1. Check cache for query + filters
2. If hit → return cached results (< 10ms)
3. If miss → query Elasticsearch, cache results

TTL considerations:
- Short TTL (30-60 sec) for trending topics
- Medium TTL (5 min) for general searches
- Cache invalidation on viral content updates`,

  whyItMatters: 'At 70K searches/sec, caching popular queries saves massive compute costs and improves latency by 20x.',

  famousIncident: {
    title: 'Instagram World Cup Search Storm',
    company: 'Instagram',
    year: '2018',
    whatHappened: 'During World Cup finals, hashtag searches spiked 100x. Without proper caching, search cluster would have melted. Their cache absorbed 95% of requests.',
    lessonLearned: 'Event-driven spikes are the norm for social search - caching is essential.',
    icon: '⚽',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Handling trending topic searches',
    howTheyDoIt: 'Uses multi-layer caching - CDN edge for ultra-popular, Redis for recent queries. 80%+ cache hit rate during events.',
  },

  diagram: `
Search Query Flow with Cache:

┌────────┐     ┌─────────────┐     ┌───────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │
└────────┘     └─────────────┘     │ Cache │
                     │              └───────┘
                     │                  │
                     │   Hit (75%)? ────┘
                     │   Return instantly!
                     │
                     │   Miss (25%)?
                     ▼
                ┌──────────────┐
                │Elasticsearch │
                │              │
                └──────────────┘
`,

  keyPoints: [
    'Cache sits between App Server and Elasticsearch',
    'Popular queries (trending hashtags) get cached',
    'Cache key = query + filters + sort',
    'Short TTL (30-60s) to keep results fresh',
    'Invalidate cache when viral posts get updated',
  ],

  quickCheck: {
    question: 'Why cache search results for social media?',
    options: [
      'Elasticsearch is always slow',
      'Trending queries get searched thousands of times - cache eliminates redundant work',
      'Caching is cheaper than Elasticsearch',
      'Cache is easier to implement',
    ],
    correctIndex: 1,
    explanation: 'During events, the same trending hashtags get searched repeatedly. Caching serves these instantly and reduces expensive queries by 75%+.',
  },

  keyConcepts: [
    { title: 'Query Cache', explanation: 'Store search results for popular queries', icon: '💾' },
    { title: 'Cache Key', explanation: 'Query + filters + sort', icon: '🔑' },
    { title: 'TTL', explanation: 'How long to cache (30-60s for social)', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'social-media-search-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search with caching for performance',
    taskDescription: 'Add a Redis cache between App Server and Search Index',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache popular search results', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (60 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'message_queue', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'message_queue' },
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
// STEP 6: Add Stream Processing for Trending Detection
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "Users want to see what's trending RIGHT NOW!",
  hook: "You need to detect which hashtags are spiking in real-time. '#BreakingNews' went from 10 posts/min to 10,000 posts/min!",
  challenge: "Add stream processing to detect trending topics.",
  illustration: 'trending-detection',
};

const step6Celebration: CelebrationContent = {
  emoji: '🔥',
  message: 'Trending topics are live!',
  achievement: 'Stream processing detects viral hashtags in real-time',
  metrics: [
    { label: 'Trending update frequency', after: '1 minute' },
    { label: 'Hashtags tracked', after: '10,000+' },
    { label: 'Detection latency', after: '<60s' },
  ],
  nextTeaser: "You've built a powerful social media search system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Trending Detection: Real-Time Stream Processing',
  conceptExplanation: `**Trending detection** is about finding spikes, not just volume.

The challenge:
- Track 500M posts/day with hashtags
- Detect velocity changes (going from 100 to 10,000 posts/hour)
- Update trending list every minute
- Handle sudden viral events

**Stream Processing Solution**:
Use Kafka + Flink/Spark Streaming to:
1. Consume post events from Kafka
2. Extract hashtags from each post
3. Count hashtags in sliding time windows (last 5 min, 1 hour, 24 hours)
4. Compare current velocity to historical baseline
5. Rank by spike magnitude
6. Update trending topics cache

This is real-time analytics, not batch processing!`,

  whyItMatters: 'Trending topics drive discovery and engagement. Without real-time detection, your platform misses breaking news.',

  famousIncident: {
    title: 'Twitter Trending Algorithm Controversy',
    company: 'Twitter',
    year: '2016',
    whatHappened: 'Twitter switched from pure algorithmic trending to human-curated trending. Users complained they were missing real-time events. Twitter had to revert to algorithmic detection with better spike detection.',
    lessonLearned: 'Real-time algorithmic trending is what users expect - velocity detection is critical.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Detecting trending topics globally',
    howTheyDoIt: 'Uses Heron (stream processing) to analyze 500M tweets/day. Tracks hashtag velocity in sliding windows, detects spikes, updates trending every 60 seconds.',
  },

  diagram: `
Stream Processing for Trending:

┌──────────────┐     ┌─────────────────────────┐
│ Post Created │────▶│     Kafka Queue         │
│   (500M/day) │     │  [posts with metadata]  │
└──────────────┘     └──────────┬──────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Stream Processor     │
                     │ (Flink/Spark)        │
                     │                      │
                     │ 1. Extract hashtags  │
                     │ 2. Window counting   │
                     │    (5min, 1hr, 24hr) │
                     │ 3. Spike detection   │
                     │ 4. Rank by velocity  │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │  Trending Cache      │
                     │  (Redis)             │
                     │                      │
                     │  Top 10 Trending:    │
                     │  1. #WorldCup +900%  │
                     │  2. #BreakingNews +700%│
                     └──────────────────────┘
`,

  keyPoints: [
    'Trending = velocity (spike), not just volume',
    'Stream processing analyzes posts in real-time',
    'Sliding time windows detect recent spikes',
    'Compare current rate to historical baseline',
    'Update trending cache every 1-2 minutes',
  ],

  quickCheck: {
    question: 'Why use stream processing instead of batch analytics for trending?',
    options: [
      'It\'s cheaper',
      'Real-time detection - trending must update within minutes, not hours',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Trending topics change by the minute during breaking news. Stream processing provides real-time detection; batch would be hours stale.',
  },

  keyConcepts: [
    { title: 'Stream Processing', explanation: 'Real-time event processing', icon: '🌊' },
    { title: 'Sliding Window', explanation: 'Aggregate over recent time period', icon: '⏱️' },
    { title: 'Spike Detection', explanation: 'Identify velocity increases', icon: '📈' },
  ],
};

const step6: GuidedStep = {
  id: 'social-media-search-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Trending topics detection',
    taskDescription: 'Add Stream Processor to detect trending hashtags',
    componentsNeeded: [
      { type: 'app_server', reason: 'Stream processor for trending detection', displayName: 'Stream Processor (Flink)' },
    ],
    successCriteria: [
      'Add second App Server component (stream processor)',
      'Connect Stream Processor to Message Queue',
      'Connect Stream Processor to Cache (for trending results)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'message_queue', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add a second App Server to represent the Stream Processor',
    level2: 'Connect Stream Processor to Message Queue (consume posts) and Cache (write trending results)',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const socialMediaSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'social-media-search',
  title: 'Design Social Media Search',
  description: 'Build a real-time search system for social content with hashtags, mentions, and trending detection',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🔍',
    hook: "You've been hired as Lead Search Engineer at Social Search Co!",
    scenario: "Your mission: Build a social media search system that handles 500M posts/day with real-time indexing, trending detection, and viral content ranking.",
    challenge: "Can you design a search system that captures breaking news in real-time?",
  },

  requirementsPhase: socialMediaSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Search API Design',
    'Elasticsearch / Full-text Search',
    'Real-Time Indexing',
    'Message Queue',
    'Stream Processing',
    'Trending Detection',
    'Hashtag Extraction',
    'Viral Content Ranking',
    'Search Caching',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 11: Stream Processing',
  ],
};

export default socialMediaSearchGuidedTutorial;
