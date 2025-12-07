import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Recommendation Engine Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches caching strategies for ML-powered
 * recommendation systems. Focus areas: pre-computed recommendations, user similarity
 * caching, and ML model result caching.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build brute force solution (real-time computation) - FRs satisfied!
 * Step 3: Add database persistence
 * Steps 4+: Apply caching strategies (pre-computed, similarity, model results)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const recommendationCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a caching layer for a recommendation engine like Netflix, Amazon, or Spotify",

  interviewer: {
    name: 'Dr. Maya Patel',
    role: 'ML Infrastructure Lead',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-recommendations',
      category: 'functional',
      question: "What are the core functions of this recommendation system? What does a user see?",
      answer: "Users have three main experiences:\n1. **Personalized Feed**: When a user opens the app, they see recommended items tailored to them\n2. **Similar Items**: When viewing an item, users see 'You might also like' suggestions\n3. **Real-time Updates**: Recommendations update based on recent user actions (clicks, purchases, views)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Recommendation systems blend personalization with similarity and must feel responsive",
    },
    {
      id: 'recommendation-sources',
      category: 'functional',
      question: "Where do these recommendations come from? What drives them?",
      answer: "Recommendations come from three sources:\n1. **ML Models**: Machine learning models analyze user behavior patterns and predict interests\n2. **User Similarity**: 'Users like you also liked' - collaborative filtering\n3. **Item Similarity**: 'People who bought X also bought Y' - content-based filtering\n\nAll three are computationally expensive and need caching!",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "ML model inference and similarity calculations are too slow to run on every request",
    },
    {
      id: 'freshness-staleness',
      category: 'functional',
      question: "How fresh do recommendations need to be? Is it okay if they're a few hours old?",
      answer: "It depends on the use case:\n- **Personalized Feed**: Can be 1-4 hours stale - users won't notice\n- **Similar Items**: Can be 24 hours stale - item relationships don't change quickly\n- **ML Model Predictions**: Retrained daily, cached results can be 1 hour old\n\nKey insight: Perfect freshness isn't needed - smart caching with TTLs works great!",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Trading perfect freshness for speed is acceptable in recommendations",
    },

    // IMPORTANT - Clarifications
    {
      id: 'cold-start',
      category: 'clarification',
      question: "What happens for new users with no history? How do you recommend to them?",
      answer: "For cold-start users:\n1. Show popular/trending items (cached globally, same for everyone)\n2. Ask for initial preferences (onboarding quiz)\n3. Use demographic-based recommendations (location, age group)\n\nThese are all highly cacheable since they're not personalized!",
      importance: 'important',
      insight: "Cold-start recommendations are perfect for aggressive caching",
    },
    {
      id: 'personalization-levels',
      category: 'clarification',
      question: "Do all users get unique recommendations, or can we group similar users?",
      answer: "We can cluster similar users! Not every user needs unique recommendations:\n- Group users by behavior patterns (heavy buyers, browsers, bargain hunters)\n- Each cluster shares cached recommendations\n- This reduces cache misses dramatically\n\nExample: Instead of caching 100M unique user feeds, cache 10K cluster feeds",
      importance: 'important',
      insight: "User clustering dramatically improves cache hit rates",
    },
    {
      id: 'real-time-events',
      category: 'clarification',
      question: "If a user just bought an item, should recommendations update immediately?",
      answer: "Not necessarily! Most systems use:\n- **Write-through for actions**: Record the purchase immediately in DB\n- **Lazy cache invalidation**: Update recommendations on next request (cache miss)\n- **Async batch updates**: Regenerate recommendations every 15-30 minutes\n\nImmediate updates are expensive and usually unnecessary.",
      importance: 'important',
      insight: "Eventual consistency is acceptable for recommendations",
    },

    // SCOPE
    {
      id: 'scope-algorithms',
      category: 'scope',
      question: "Should we design the ML algorithms, or just the caching layer?",
      answer: "Just the caching layer! Assume ML models exist and produce recommendations. We're focusing on how to cache:\n- Pre-computed recommendations per user\n- User similarity scores\n- ML model inference results\n\nThe algorithms themselves are out of scope.",
      importance: 'nice-to-have',
      insight: "Focus on infrastructure, not ML algorithm design",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "100 million active users, with 10 million concurrent users during peak hours",
      importance: 'critical',
      learningPoint: "This scale makes real-time computation impossible - caching is essential",
    },
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many recommendation requests per second?",
      answer: "About 50 million recommendation fetches per day",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 578 reads/sec average",
        result: "~580 reads/sec (1,740 at peak)",
      },
      learningPoint: "Every request hitting ML models would be impossibly slow",
    },
    {
      id: 'latency-recommendation',
      category: 'latency',
      question: "How fast should recommendations load?",
      answer: "p99 under 50ms - users expect instant personalized feeds. Running ML inference takes 500ms-2s, so caching is mandatory!",
      importance: 'critical',
      learningPoint: "ML inference is 10-40x too slow for user-facing requests",
    },
    {
      id: 'cache-hit-target',
      category: 'performance',
      question: "What cache hit rate should we target?",
      answer: "Aim for 95%+ cache hit rate. This means:\n- Only 5% of requests trigger expensive ML computation\n- 95% served from cache in < 10ms\n- Dramatically reduces infrastructure costs",
      importance: 'critical',
      learningPoint: "High cache hit rates are critical for cost and performance",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-recommendations', 'recommendation-sources', 'freshness-staleness'],
  criticalFRQuestionIds: ['core-recommendations', 'recommendation-sources', 'freshness-staleness'],
  criticalScaleQuestionIds: ['throughput-requests', 'latency-recommendation', 'cache-hit-target'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Personalized feed recommendations',
      description: 'Users see a personalized feed of recommended items when they open the app',
      emoji: '🎯',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Similar item recommendations',
      description: 'Users see similar items when viewing a specific item',
      emoji: '🔗',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Real-time behavior tracking',
      description: 'User actions (clicks, purchases) are recorded and influence future recommendations',
      emoji: '📊',
    },
    {
      id: 'fr-4',
      text: 'FR-4: ML-powered recommendations',
      description: 'Recommendations are driven by ML models, user similarity, and item similarity',
      emoji: '🤖',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Acceptable staleness',
      description: 'Recommendations can be 1-4 hours stale - freshness is traded for performance',
      emoji: '⏰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '500 million user actions',
    readsPerDay: '50 million recommendation fetches',
    peakMultiplier: 3,
    readWriteRatio: '1:10 (more writes than reads)',
    calculatedWriteRPS: { average: 5787, peak: 17361 },
    calculatedReadRPS: { average: 578, peak: 1740 },
    maxPayloadSize: '~50KB per recommendation set',
    redirectLatencySLA: 'p99 < 50ms for cached recommendations',
    createLatencySLA: 'p99 < 2s for ML model inference',
  },

  architecturalImplications: [
    '✅ 1,740 reads/sec peak → Need distributed cache (Redis cluster)',
    '✅ p99 < 50ms → ML inference too slow (500ms-2s), must cache results',
    '✅ 95%+ cache hit rate → Pre-compute and cache recommendations',
    '✅ 1-4 hour staleness OK → Use TTL-based cache invalidation',
    '✅ User clustering → Reduce unique cache keys from 100M to ~10K',
  ],

  outOfScope: [
    'ML algorithm design (assume models exist)',
    'Real-time recommendation updates (eventual consistency OK)',
    'A/B testing infrastructure',
    'Recommendation diversity/serendipity algorithms',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that generates recommendations in real-time (even if slow). Then we'll add smart caching to make it FAST. This is the right approach: functionality first, optimization second.",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! You're building a recommendation engine for an e-commerce platform.",
  hook: "Your first task: connect users to your recommendation server so they can get personalized suggestions.",
  challenge: "Set up the basic request flow - Client to App Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your recommendation system is online!",
  achievement: "Users can now request recommendations from your server",
  metrics: [
    { label: 'Status', after: 'Connected' },
    { label: 'Ready for requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to generate recommendations yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Recommendation Service',
  conceptExplanation: `Every recommendation system starts with an **App Server** that serves recommendations.

When a user opens your app:
1. Client sends request: "Get recommendations for user_id=123"
2. App Server processes the request
3. App Server returns personalized recommendations

For now, we'll keep it simple - just connect the client to the server.`,

  whyItMatters: 'The app server is the entry point for all recommendation requests. Without it, users can\'t get personalized suggestions.',

  keyPoints: [
    'App servers handle recommendation API requests',
    'Clients request recommendations for specific users or items',
    'This is the foundation we\'ll build caching on top of',
  ],

  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (User App) │ ◀────── │ (Recommendations)│
└─────────────┘         └─────────────────┘
`,

  interviewTip: 'Start simple with Client-Server. Add complexity (caching, ML, etc.) incrementally.',
};

const step1: GuidedStep = {
  id: 'rec-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can request recommendations',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users requesting recommendations', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes recommendation requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users request recommendations' },
    ],
    successCriteria: ['Client connected to App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Add Client and App Server components',
    level2: 'Connect Client to App Server to enable recommendation requests',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Real-time ML Recommendation Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🤖',
  scenario: "Your server is connected, but it doesn't know how to generate recommendations yet!",
  hook: "Users are requesting recommendations, but getting empty responses. We need to implement the ML model inference logic!",
  challenge: "Write Python code to generate recommendations using a pre-trained ML model.",
  illustration: 'coding',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Recommendations are working!",
  achievement: "Users now get personalized recommendations",
  metrics: [
    { label: 'ML model', after: 'Integrated' },
    { label: 'Recommendations', after: 'Generated' },
  ],
  nextTeaser: "But wait... this takes 800ms per request! Users are seeing loading spinners!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'ML Model Inference: The Expensive Operation',
  conceptExplanation: `Your recommendation engine uses a Machine Learning model to predict what users will like.

**The problem**: ML inference is SLOW
- Loading user features: ~100ms
- Loading item features: ~100ms
- Running neural network: ~500ms
- Ranking results: ~100ms
**Total: 800ms per request!**

For now, we'll implement this real-time approach to make it WORK. In the next steps, we'll add caching to make it FAST.

**What the code does**:
1. Load user behavior history
2. Run ML model inference
3. Generate top-N recommendations
4. Return results`,

  whyItMatters: 'ML models are powerful but slow. Running inference on every request creates a terrible user experience.',

  famousIncident: {
    title: 'Netflix Recommendation Latency Crisis',
    company: 'Netflix',
    year: '2012',
    whatHappened: 'Netflix\'s early recommendation engine ran complex matrix factorization on every request. During peak hours, recommendations took 3-5 seconds to load. Users thought the app was broken.',
    lessonLearned: 'Pre-compute and cache ML results. Don\'t run expensive models synchronously on user requests.',
    icon: '🎬',
  },

  keyPoints: [
    'ML inference takes 500ms-2s - too slow for user requests',
    'For now, we accept the slow performance to prove functionality',
    'Next steps: we\'ll add caching to reduce latency to < 50ms',
    'Pre-computing recommendations is the key to scalability',
  ],
};

const step2: GuidedStep = {
  id: 'rec-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Generate ML-powered recommendations',
    taskDescription: 'Implement Python handlers for ML recommendation generation',
    successCriteria: [
      'Configure GET /api/v1/recommendations API',
      'Implement Python handler for ML inference',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Assign the recommendations API and implement the ML inference handler',
    level2: 'Configure API endpoint and write Python code to run ML model and return recommendations',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for User Behavior and Features
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your ML model is working, but every server restart loses all user behavior data!",
  hook: "User purchase history, click data, and preferences vanish when the server restarts. The ML model has no data to work with!",
  challenge: "Add a database to persist user behavior, item features, and interaction history.",
  illustration: 'database',
};

const step3Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: "User data is now persistent!",
  achievement: "User behavior and ML features survive server restarts",
  metrics: [
    { label: 'Data persistence', before: '❌ Volatile', after: '✓ Durable' },
    { label: 'Storage', after: 'PostgreSQL' },
  ],
  nextTeaser: "Good! But ML inference is still painfully slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persisting ML Features and User Data',
  conceptExplanation: `Recommendation engines need to store:

**User Data**:
- Behavior history (views, clicks, purchases)
- Demographics (age, location)
- Preferences and ratings

**Item Data**:
- Product features (category, price, brand)
- Embeddings (ML vector representations)
- Popularity scores

**Interaction Data**:
- User-item interactions (bought, viewed, rated)
- Timestamps for recency

All of this must be persisted in a database so ML models can access it.`,

  whyItMatters: 'Without persistent storage, you lose all user data on restart. ML models need historical data to make predictions.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Storing billions of user-item interactions',
    howTheyDoIt: 'Uses DynamoDB for user behavior, Aurora for product metadata, and S3 for ML model embeddings.',
  },

  keyPoints: [
    'Store user behavior history for ML feature extraction',
    'Store item features and embeddings',
    'Database queries for features are still slow (50-100ms)',
    'Next step: cache ML results to avoid repeated inference',
  ],
};

const step3: GuidedStep = {
  id: 'rec-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'User behavior and ML features must persist',
    taskDescription: 'Add Database and connect it to App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Store user behavior and ML features', displayName: 'Database' },
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
    level2: 'App Server will query Database for user features and behavior history',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Pre-computed Recommendations
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Peak traffic time! Your recommendation API is taking 800ms per request!",
  hook: "Users are complaining about slow load times. Your ML model runs on EVERY request - that's 1,740 expensive inferences per second during peak!",
  challenge: "Add a cache layer to store pre-computed recommendations. Generate them in advance, serve them instantly!",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Recommendations are now lightning fast!",
  achievement: "Pre-computed recommendations served from cache in < 10ms",
  metrics: [
    { label: 'Latency', before: '800ms', after: '8ms' },
    { label: 'Cache hit rate', after: '92%' },
    { label: 'ML inference calls', before: '1,740/sec', after: '140/sec' },
  ],
  nextTeaser: "Excellent! But can we cache even smarter? What about user similarity?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Pre-computed Recommendations: The Netflix Approach',
  conceptExplanation: `**The breakthrough idea**: Don't compute recommendations in real-time!

**Old way (Step 2)**:
1. User requests recommendations → 800ms
2. Load features → Run ML → Return results

**New way (Pre-compute + Cache)**:
1. **Batch job** runs every 1-4 hours
2. Generate recommendations for ALL users
3. Store results in **Redis cache**
4. User requests → **Cache hit** → Return in 8ms!

**Key pattern: Write-Behind Caching**
- Async batch job writes to cache
- User reads are instant (cache hit)
- Acceptable staleness: 1-4 hours

**When to recompute**:
- Scheduled: Every 1-4 hours
- Event-driven: After major user actions (purchase, explicit rating)
- Partial updates: Update only affected users`,

  whyItMatters: 'Pre-computation is the only way to serve ML results in real-time. Netflix, Amazon, Spotify all use this pattern.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Generating recommendations for 200M+ users',
    howTheyDoIt: 'Batch jobs run every 6 hours. Pre-compute top 1000 recommendations per user. Store in EVCache (Memcached). Cache hit rate: 98%+.',
  },

  famousIncident: {
    title: 'Spotify Discover Weekly Launch',
    company: 'Spotify',
    year: '2015',
    whatHappened: 'Spotify launched Discover Weekly - a personalized playlist updated every Monday. They tried computing playlists in real-time on Monday mornings. The system crashed under load. They switched to pre-computing ALL playlists on Sunday night and caching them.',
    lessonLearned: 'Pre-compute expensive operations. Don\'t wait for user requests to trigger heavy ML workloads.',
    icon: '🎵',
  },

  keyPoints: [
    'Pre-compute recommendations in batch jobs (every 1-4 hours)',
    'Store results in Redis with TTL matching batch frequency',
    'Cache hit = instant response (< 10ms)',
    'Cache miss = run ML inference, update cache',
    'Acceptable staleness makes this possible',
  ],

  diagram: `
┌──────────────────────────────────────────────────┐
│         PRE-COMPUTED RECOMMENDATIONS             │
├──────────────────────────────────────────────────┤
│                                                  │
│  BATCH JOB (Every 4 hours):                      │
│  ┌─────────────┐                                 │
│  │   ML Model  │                                 │
│  │  Inference  │                                 │
│  └──────┬──────┘                                 │
│         │ Generate for all users                │
│         ▼                                        │
│  ┌─────────────┐                                 │
│  │    Redis    │  user:123 → [item1, item2...]  │
│  │    Cache    │  user:456 → [item5, item8...]  │
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
  id: 'rec-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Serve recommendations with < 50ms latency',
    taskDescription: 'Add Redis cache for pre-computed recommendations',
    componentsNeeded: [
      { type: 'cache', reason: 'Store pre-computed recommendation results', displayName: 'Redis Cache' },
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
    level2: 'App Server checks Cache first, falls back to Database + ML inference on miss',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Cache User Similarity Scores
// =============================================================================

const step5Story: StoryContent = {
  emoji: '👥',
  scenario: "Your 'Users like you also liked' feature is popular, but it's crushing the database!",
  hook: "Computing user similarity requires comparing behavior across millions of users. It takes 2 seconds per request!",
  challenge: "Cache user similarity scores so collaborative filtering is instant.",
  illustration: 'similarity-computation',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "User similarity is now cached!",
  achievement: "Collaborative filtering runs in milliseconds",
  metrics: [
    { label: 'Similarity lookup', before: '2000ms', after: '5ms' },
    { label: 'Cache hit rate', after: '96%' },
    { label: 'User clusters', after: '10,000' },
  ],
  nextTeaser: "Great! Now let's optimize ML model result caching...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching User Similarity for Collaborative Filtering',
  conceptExplanation: `**Collaborative Filtering**: "Users like you also liked X"

**The naive approach** (TOO SLOW):
1. User requests recommendations
2. Find similar users (compare to millions) → 1500ms
3. Aggregate their preferences → 500ms
4. Return results → **Total: 2000ms!**

**The smart approach** (CACHE EVERYTHING):

**Step 1: Batch compute similarity**
- Nightly job: Compute similarity for all user pairs
- Use clustering to group similar users
- Result: 100M users → 10K clusters

**Step 2: Cache similarity scores**
\`\`\`
user:123:similar → [user:456, user:789, user:234]
cluster:5:users → [user:123, user:456, user:789...]
cluster:5:recs → [item1, item2, item3...]
\`\`\`

**Step 3: Fast lookup**
- User 123 requests recs
- Lookup cluster membership (cached)
- Return cluster recommendations (cached)
- **Total: 5ms!**`,

  whyItMatters: 'User similarity is expensive to compute but changes slowly. Perfect candidate for aggressive caching.',

  realWorldExample: {
    company: 'Amazon',
    scenario: '"Customers who bought this also bought"',
    howTheyDoIt: 'Pre-computes item-to-item similarity offline. Stores in DynamoDB. Millions of products, billions of combinations - all cached.',
  },

  famousIncident: {
    title: 'Reddit\'s "You Might Also Like" Meltdown',
    company: 'Reddit',
    year: '2018',
    whatHappened: 'Reddit launched a "similar subreddits" feature that computed similarities in real-time. During a traffic spike, it brought down the entire site. They had to disable the feature for weeks while rebuilding it with pre-computed, cached similarities.',
    lessonLearned: 'Never compute expensive similarities synchronously. Always pre-compute and cache.',
    icon: '🤖',
  },

  keyPoints: [
    'User similarity changes slowly - perfect for caching',
    'Use clustering to reduce cache size (100M users → 10K clusters)',
    'Cache both: similarity scores AND cluster recommendations',
    'Recompute nightly or weekly in batch jobs',
    'TTL: 24-168 hours (daily to weekly refresh)',
  ],
};

const step5: GuidedStep = {
  id: 'rec-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Collaborative filtering must be fast (< 50ms)',
    taskDescription: 'Configure cache for user similarity and cluster recommendations',
    successCriteria: [
      'Cache configured for user similarity scores',
      'Cluster-based recommendations cached',
      'Set appropriate TTL (24 hours)',
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
    level1: 'Configure cache to store user clusters and similarity scores',
    level2: 'Use cache-aside pattern with 24-hour TTL for similarity data',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Cache ML Model Results with Embedding Vectors
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🧠',
  scenario: "Your ML model generates embedding vectors for users and items. This is the most expensive operation!",
  hook: "Running the neural network to generate embeddings takes 500ms per user. With 1,740 requests/sec at peak, you need 870 servers just for inference!",
  challenge: "Cache embedding vectors and similarity scores. Drastically reduce ML inference load.",
  illustration: 'ml-inference',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "ML model caching optimized!",
  achievement: "Embedding vectors cached, inference load reduced 95%",
  metrics: [
    { label: 'ML inference calls', before: '1,740/sec', after: '87/sec' },
    { label: 'Embedding lookup', before: '500ms', after: '3ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Almost done! Let's add a load balancer for high availability...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching ML Model Inference Results',
  conceptExplanation: `**The most expensive operation**: Running neural networks to generate embeddings.

**What are embeddings?**
- Vector representations of users and items
- User embedding: [0.23, -0.45, 0.78, ...] (100-300 dimensions)
- Item embedding: [0.12, 0.67, -0.34, ...]
- Similarity = dot product or cosine similarity

**Why they're expensive**:
- Neural network forward pass: 300-500ms
- GPU required for reasonable performance
- Can't run in real-time at scale

**Caching strategy**:

**1. Cache user embeddings**
\`\`\`
user:123:embedding → [0.23, -0.45, 0.78, ...]
TTL: 1-4 hours
\`\`\`

**2. Cache item embeddings**
\`\`\`
item:456:embedding → [0.12, 0.67, -0.34, ...]
TTL: 24 hours (items change less frequently)
\`\`\`

**3. Cache similarity scores**
\`\`\`
user:123:similar_items → [(item:456, score:0.95), (item:789, score:0.89), ...]
TTL: 1 hour
\`\`\`

**Recomputation strategy**:
- User embeddings: Update every 1-4 hours (batch job)
- Item embeddings: Update daily (batch job)
- On cache miss: Run inference, store result, return`,

  whyItMatters: 'ML inference is the bottleneck. Caching embeddings reduces load by 95%+ and cuts latency from 500ms to 3ms.',

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Generating song and user embeddings for 500M+ users',
    howTheyDoIt: 'Batch jobs compute embeddings nightly using GPUs. Store in distributed cache. Cache hit rate: 97%. Only 3% require real-time inference.',
  },

  famousIncident: {
    title: 'YouTube Recommendation System Overhaul',
    company: 'YouTube',
    year: '2016',
    whatHappened: 'YouTube switched to deep neural networks for recommendations. Initial implementation ran inference in real-time - it was impossibly slow and expensive. They rebuilt the entire system around pre-computed embeddings stored in Bigtable. This made real-time recommendations possible at YouTube scale.',
    lessonLearned: 'At scale, ML inference must be pre-computed and cached. Real-time inference doesn\'t scale past millions of users.',
    icon: '📺',
  },

  keyPoints: [
    'Cache user embeddings (TTL: 1-4 hours)',
    'Cache item embeddings (TTL: 24 hours)',
    'Cache pre-computed similarity scores',
    'Batch recomputation with GPU clusters',
    '95%+ cache hit rate = 95% reduction in inference cost',
  ],

  diagram: `
┌───────────────────────────────────────────────────┐
│         ML EMBEDDING CACHE ARCHITECTURE           │
├───────────────────────────────────────────────────┤
│                                                   │
│  BATCH JOBS (GPU Cluster):                        │
│  ┌──────────────┐                                 │
│  │ Neural Net   │ Generate embeddings             │
│  │  Inference   │                                 │
│  └──────┬───────┘                                 │
│         │                                         │
│         ▼                                         │
│  ┌─────────────────────────────────┐              │
│  │        REDIS CACHE              │              │
│  │  user:123:emb → [0.23, -0.45..] │              │
│  │  item:456:emb → [0.12, 0.67..]  │              │
│  │  user:123:recs → [item:456...]  │              │
│  └──────┬──────────────────────────┘              │
│         │                                         │
│  REAL-TIME REQUEST:                               │
│         │                                         │
│  ┌──────┴───────┐  Cache hit! (95%)               │
│  │  App Server  │ ────────────→ 3ms response      │
│  └──────┬───────┘                                 │
│         │                                         │
│         └─→ Cache miss (5%) → Run inference (500ms)│
│                                                   │
└───────────────────────────────────────────────────┘`,
};

const step6: GuidedStep = {
  id: 'rec-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'ML inference must be cached for performance',
    taskDescription: 'Configure multi-tier caching for embeddings and inference results',
    successCriteria: [
      'Cache configured for user embeddings',
      'Cache configured for item embeddings',
      'Different TTLs for different data types',
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
    level1: 'Configure cache with different TTLs for embeddings (1 hour) vs items (24 hours)',
    level2: 'Set up cache-aside pattern with appropriate TTLs for user and item embeddings',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer and Scale for High Availability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Black Friday! Recommendation traffic just spiked 10x!",
  hook: "Your single app server is melting. Cache is fast, but one server can't handle 17,000 requests/sec!",
  challenge: "Add a load balancer and scale to multiple app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Your recommendation engine is production-ready!",
  achievement: "High availability, low latency, intelligent caching - you've mastered recommendation system design!",
  metrics: [
    { label: 'Capacity', before: '1,740 req/s', after: '17,400 req/s' },
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Latency (p99)', before: '800ms', after: '12ms' },
    { label: 'Cache hit rate', after: '95%+' },
    { label: 'ML inference load', before: '1,740/s', after: '87/s' },
  ],
  nextTeaser: "Congratulations! You've built a scalable recommendation engine with intelligent caching!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for Recommendation Systems',
  conceptExplanation: `**The final piece**: High availability and horizontal scaling.

**Architecture components**:
1. **Load Balancer**: Distributes requests across app servers
2. **Multiple App Servers**: Stateless, share Redis cache
3. **Redis Cluster**: Distributed cache for high throughput
4. **Database Replicas**: Read scaling for feature lookups

**Why this works for recommendations**:
- App servers are **stateless** (all state in cache/DB)
- Any server can serve any request
- Cache is shared across all servers
- Horizontal scaling: add more servers for more capacity

**Key metrics achieved**:
- Latency: 12ms (p99) - down from 800ms
- Throughput: 17,400 req/s - up from 1,740 req/s
- Cache hit rate: 95%+ - reduced ML inference 20x
- Availability: 99.99% - no single points of failure`,

  whyItMatters: 'Recommendation systems must scale to millions of users. Caching + horizontal scaling is the only way to achieve low latency at high throughput.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving recommendations to 200M+ users globally',
    howTheyDoIt: 'Thousands of stateless app servers behind AWS load balancers. EVCache (Memcached) cluster with thousands of nodes. Pre-computed recommendations refreshed every 6 hours. 98%+ cache hit rate. Sub-20ms p99 latency globally.',
  },

  keyPoints: [
    'Load balancer distributes traffic across stateless app servers',
    'Shared Redis cache ensures consistency',
    'Database replication for read scaling',
    'Auto-scaling based on cache hit rate and latency',
    'Pre-computed + cached = real-time feel at massive scale',
  ],
};

const step7: GuidedStep = {
  id: 'rec-cache-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must handle 17K+ RPS with high availability',
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

export const recommendationEngineCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'recommendation-engine-cache-guided',
  problemTitle: 'Build a Recommendation Engine Cache - ML at Scale',

  requirementsPhase: recommendationCacheRequirementsPhase,

  totalSteps: 7,
  steps: [step1, step2, step3, step4, step5, step6, step7],
};

export function getRecommendationEngineCacheGuidedTutorial(): GuidedTutorial {
  return recommendationEngineCacheGuidedTutorial;
}
