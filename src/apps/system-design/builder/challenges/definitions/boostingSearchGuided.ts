import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Boosting Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching search result boosting and relevance tuning.
 * Focus: Field boosting, function scoring, recency decay, popularity signals
 *
 * Key Concepts:
 * - Field-level boosting (title vs description)
 * - Function score queries
 * - Recency decay functions
 * - Popularity signals (views, sales, ratings)
 * - Multi-signal ranking
 *
 * Flow:
 * Phase 0: Requirements gathering (boost factors, field weights, decay functions)
 * Steps 1-3: Basic field boosting (title > description > tags)
 * Steps 4-6: Function scoring, recency boost, popularity boost
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const boostingSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a search system with intelligent result boosting and relevance ranking",

  interviewer: {
    name: 'Jordan Chen',
    role: 'Principal Search Engineer at RankTech',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-boosting',
      category: 'functional',
      question: "What does 'boosting' mean in search, and why do we need it?",
      answer: "Boosting adjusts the relevance score of search results based on various factors. For example:\n\n1. **Field boosting** - Title matches are more important than description matches\n2. **Recency boosting** - Newer content ranked higher than old content\n3. **Popularity boosting** - Popular items ranked higher\n\nWithout boosting, a product with query text buried in description could rank higher than one with exact title match!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Boosting transforms basic text matching into intelligent relevance ranking",
    },
    {
      id: 'field-weights',
      category: 'functional',
      question: "Which fields should have higher boost values?",
      answer: "Based on user behavior analysis:\n\n1. **Title** - 3x boost (exact title match = very relevant)\n2. **Description** - 1x boost (baseline)\n3. **Tags/Categories** - 2x boost (user-curated, high signal)\n4. **Reviews** - 0.5x boost (less relevant, noisy)\n\nExample: 'wireless headphones' in title should rank much higher than same phrase in review text.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Field weights reflect information quality - titles are carefully chosen, reviews are verbose",
    },
    {
      id: 'recency-importance',
      category: 'functional',
      question: "How important is recency in search results?",
      answer: "Very important for certain categories:\n\n- **Electronics**: Newer models preferred (iPhone 15 > iPhone 12)\n- **News/Blog**: Recent articles matter more\n- **Fashion**: Current season styles\n\nUse **decay function**: Full boost for items < 30 days old, gradual decay over 365 days, minimal boost after 1 year.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Recency prevents old, outdated content from dominating results",
    },
    {
      id: 'popularity-signals',
      category: 'functional',
      question: "What popularity signals should boost search results?",
      answer: "Multiple signals indicate popularity:\n\n1. **Sales volume** - Products that sell well are more relevant\n2. **View count** - High traffic indicates interest\n3. **Rating** - 4.5 stars > 3.0 stars\n4. **Review count** - Social proof (100 reviews > 5 reviews)\n\nCombine these into a **popularity score** that boosts results. Popular products are usually what users want.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Popularity signals capture collective wisdom - what others like, this user probably will too",
    },

    // IMPORTANT - Clarifications
    {
      id: 'boost-formula',
      category: 'clarification',
      question: "How should multiple boost factors be combined?",
      answer: "Use **multiplicative combination** for most impact:\n\nFinal Score = Text Match Score × (1 + field_boost) × (1 + recency_boost) × (1 + popularity_boost)\n\nExample:\n- Base text score: 10\n- Title match: 3x boost → 10 × 3 = 30\n- Recent (15 days): +0.5 boost → 30 × 1.5 = 45\n- Popular (4.5⭐, 200 reviews): +0.8 boost → 45 × 1.8 = 81\n\nFinal score: 81 (vs base 10!)",
      importance: 'important',
      insight: "Multiplicative boosts create strong differentiation between good and great results",
    },
    {
      id: 'decay-functions',
      category: 'clarification',
      question: "What decay functions work best for recency boosting?",
      answer: "**Exponential decay** works best:\n\n```\nboost = e^(-λ × days_old)\n```\n\nWhere λ controls decay rate:\n- λ = 0.01: Slow decay (365 days to half-value)\n- λ = 0.1: Fast decay (7 days to half-value)\n\nFor products: Use λ = 0.005 (moderate decay)\nFor news: Use λ = 0.1 (fast decay)\n\n**Linear decay** is simpler but less realistic.",
      importance: 'important',
      insight: "Exponential decay models real-world relevance - recent items much more valuable",
    },
    {
      id: 'negative-boosting',
      category: 'clarification',
      question: "Should we negatively boost (demote) certain results?",
      answer: "Yes! Demote:\n\n1. **Out of stock** - Reduce score by 90% (frustrating UX)\n2. **Poor ratings** - Items < 3.0 stars reduce score by 50%\n3. **Low inventory** - About to go out of stock, slight demotion\n4. **Discontinued** - Old products no longer sold\n\nImplement as negative boost: score × 0.1 for out-of-stock items.",
      importance: 'important',
      insight: "Negative boosting ensures bad experiences don't appear prominently",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many search queries per second?",
      answer: "Peak load: 20,000 searches/second during major sales events. Average: 5,000 QPS.",
      importance: 'critical',
      calculation: {
        formula: "20K QPS with complex boost calculations per query",
        result: "Need efficient boost computation and caching",
      },
      learningPoint: "Boost calculations must be fast - can't do heavy computation per query",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many products in the catalog?",
      answer: "50 million products with varying freshness, popularity, and availability",
      importance: 'critical',
      learningPoint: "Boost values must be pre-computed and stored in search index",
    },

    // LATENCY
    {
      id: 'latency-requirement',
      category: 'latency',
      question: "What latency is acceptable for boosted search?",
      answer: "p99 < 200ms - same as regular search. Boosting shouldn't add significant latency. Users expect instant results.",
      importance: 'critical',
      learningPoint: "Boost calculations must be done at index time or use fast function scoring",
    },

    // ACCURACY
    {
      id: 'accuracy-relevance',
      category: 'accuracy',
      question: "How do we measure if boosting improves relevance?",
      answer: "Track these metrics:\n\n1. **Click-through rate (CTR)** - Are users clicking top results?\n2. **Conversion rate** - Do searches lead to purchases?\n3. **Time to purchase** - How quickly users find what they want?\n4. **Zero-result rate** - Fewer searches with no results?\n\nA/B test boost configurations and measure impact.",
      importance: 'important',
      learningPoint: "Boosting is an optimization problem - measure and iterate",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-boosting', 'field-weights', 'recency-importance', 'popularity-signals'],
  criticalFRQuestionIds: ['core-boosting', 'field-weights', 'recency-importance', 'popularity-signals'],
  criticalScaleQuestionIds: ['throughput-queries', 'latency-requirement', 'accuracy-relevance'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Field-level boosting',
      description: 'Boost title matches higher than description matches',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Recency boosting',
      description: 'Boost newer items with exponential decay',
      emoji: '📅',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Popularity boosting',
      description: 'Boost items based on sales, views, and ratings',
      emoji: '⭐',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million searchers/day',
    writesPerDay: '100K product updates/day',
    readsPerDay: '200 million searches/day',
    peakMultiplier: 4,
    readWriteRatio: '2000:1',
    calculatedWriteRPS: { average: 10, peak: 40 },
    calculatedReadRPS: { average: 2315, peak: 20000 },
    maxPayloadSize: '~2KB per search response',
    storagePerRecord: '~3KB per product (with boost metadata)',
    storageGrowthPerYear: '~50GB (new products)',
    redirectLatencySLA: 'p99 < 200ms',
    createLatencySLA: 'Boost updates < 5 seconds',
  },

  architecturalImplications: [
    '✅ 50M products → Pre-compute boost factors at index time',
    '✅ 20K QPS → Use Elasticsearch function_score for efficient boosting',
    '✅ p99 < 200ms → Boost calculations must be O(1) per document',
    '✅ Field boosting → Configure per-field weights in search index',
    '✅ Recency decay → Store timestamp, compute decay in function_score',
    '✅ Popularity → Pre-compute popularity score, store in index',
  ],

  outOfScope: [
    'Machine learning ranking models (v2)',
    'Personalized boosting per user (v2)',
    'A/B testing framework',
    'Real-time boost updates (eventual consistency OK)',
    'Geo-location boosting',
  ],

  keyInsight: "First, let's make it WORK. We'll build basic search, then layer in boosting: field weights → recency decay → popularity signals. Each boost factor improves relevance incrementally. Start simple, measure impact, iterate!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "You're building a search system for an e-commerce platform with 1 million products.",
  hook: "Users are searching, but all results are ranked equally - no intelligence!",
  challenge: "Set up the basic search infrastructure before adding boosting logic.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Search service is online!',
  achievement: 'Users can connect and send search queries',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Infrastructure', after: 'Ready' },
  ],
  nextTeaser: "But there's no intelligent ranking yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Search Foundation',
  conceptExplanation: `Every search system starts with basic infrastructure:

**Client** → sends search queries
**Search API Server** → processes requests
**Search Index (Elasticsearch)** → stores products with searchable text

Before we add boosting, we need this foundation working. Think of it like building a house - you need walls before you add paint!

**Basic search flow:**
1. User types query: "wireless headphones"
2. Client sends to API server: GET /search?q=wireless+headphones
3. Server queries Elasticsearch
4. Results returned (unsorted by relevance initially)`,

  whyItMatters: 'Without basic search working, boosting has nothing to improve. Foundation first!',

  keyPoints: [
    'Client sends search queries over HTTP',
    'API Server orchestrates the search',
    'Search Index stores and retrieves products',
    'This is the baseline before adding intelligence',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User device making search requests', icon: '📱' },
    { title: 'Search API', explanation: 'Backend service handling queries', icon: '🔌' },
    { title: 'Search Index', explanation: 'Elasticsearch index for products', icon: '📇' },
  ],
};

const step1: GuidedStep = {
  id: 'boosting-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up search infrastructure',
    taskDescription: 'Add Client, App Server, and Search Index with connections',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching', displayName: 'Client' },
      { type: 'app_server', reason: 'Search API server', displayName: 'Search API' },
      { type: 'search_index', reason: 'Elasticsearch for products', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Search Index component added',
      'Client → App Server connection',
      'App Server → Search Index connection',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Add all three components: Client, App Server, and Search Index',
    level2: 'Connect Client → App Server → Search Index in sequence',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'search_index' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'search_index' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Basic Search API (Python)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "The infrastructure is ready but search doesn't work yet!",
  hook: "Users type queries but get errors - no search logic implemented.",
  challenge: "Write Python code to handle search requests and query Elasticsearch.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Basic search works!',
  achievement: 'Users can search products, but ranking is random',
  metrics: [
    { label: 'Search endpoint', after: 'Implemented' },
    { label: 'Results returned', after: '✓' },
  ],
  nextTeaser: "But title matches rank same as description matches...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Implementing the Search Handler',
  conceptExplanation: `Your search API needs a handler function:

**Basic search (no boosting yet):**
\`\`\`python
def search(query: str) -> List[Product]:
    # Query Elasticsearch - all fields equal weight
    results = elasticsearch.search(
        index="products",
        body={
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title", "description", "tags"]
                }
            }
        }
    )
    return results
\`\`\`

This searches all fields equally. A product with "wireless headphones" in the title ranks the same as one with it buried in description. Not ideal!

Next steps: Add field boosting to prioritize title matches.`,

  whyItMatters: 'The search handler is where all the boosting magic will happen. Start simple, then enhance.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Processing 100K searches per second',
    howTheyDoIt: 'Started with basic search in 1995, gradually added sophisticated boosting and ranking algorithms',
  },

  keyPoints: [
    'multi_match searches multiple fields at once',
    'Without boosting, all fields have equal weight',
    'Results come back but ranking is poor',
    'This is the baseline we\'ll improve',
  ],

  keyConcepts: [
    { title: 'Search Handler', explanation: 'Function processing search queries', icon: '⚙️' },
    { title: 'Multi-Match', explanation: 'Search across multiple fields', icon: '🔍' },
    { title: 'Query DSL', explanation: 'Elasticsearch query language', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'boosting-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-0: Basic search functionality',
    taskDescription: 'Configure search API and implement Python search handler',
    successCriteria: [
      'Click App Server → Assign GET /api/v1/search',
      'Open Python tab',
      'Implement search() function with multi_match query',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Configure the search endpoint, then implement the Python handler',
    level2: 'Assign GET /api/v1/search, then write multi_match query in search() function',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/search'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Field-Level Boosting
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📝',
  scenario: "A user searches for 'sony headphones' and finds a product with that text in a review ranked #1!",
  hook: "Meanwhile, 'Sony WH-1000XM5 Headphones' (exact title match) is ranked #5. This is backwards!",
  challenge: "Add field-level boosting to prioritize title matches over description and reviews.",
  illustration: 'ranking-problem',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎊',
  message: 'Field boosting enabled!',
  achievement: 'Title matches now rank higher than description matches',
  metrics: [
    { label: 'Title boost', after: '3x' },
    { label: 'Tags boost', after: '2x' },
    { label: 'Relevance improved', after: '✓' },
  ],
  nextTeaser: "But old products from 2015 still rank above new 2024 models...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Field-Level Boosting: Not All Text is Equal',
  conceptExplanation: `**Field boosting** assigns different weights to different fields.

**Why it matters:**
- **Title**: Carefully chosen, high signal → 3x boost
- **Tags/Categories**: Curated, relevant → 2x boost
- **Description**: Detailed but verbose → 1x boost (baseline)
- **Reviews**: User content, noisy → 0.5x boost

**Implementation in Elasticsearch:**
\`\`\`python
{
    "query": {
        "multi_match": {
            "query": "wireless headphones",
            "fields": [
                "title^3",          # 3x boost
                "tags^2",           # 2x boost
                "description^1",    # 1x boost (default)
                "reviews^0.5"       # 0.5x boost
            ]
        }
    }
}
\`\`\`

**Example result:**
Product A: "Sony Wireless Headphones" (title) → score = 30
Product B: "Sony WH-1000XM5... wireless... headphones..." (description) → score = 10
Product A ranks 3x higher!`,

  whyItMatters: 'Field boosting is the simplest, most impactful relevance improvement. It recognizes that titles are more important than reviews.',

  famousIncident: {
    title: 'Google Search Quality Update',
    company: 'Google',
    year: '2011',
    whatHappened: 'Google heavily adjusted field boosting to prioritize page titles over body text. Sites with keyword-stuffed body content but poor titles saw rankings plummet. Quality titles became essential for SEO.',
    lessonLearned: 'Field boosting directly impacts what users see. Titles are the most important signal.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Searching 7M+ listings',
    howTheyDoIt: 'Boosts listing titles 5x over descriptions. Also boosts host-written summaries 2x. Field weights tuned through A/B testing.',
  },

  keyPoints: [
    'Use ^N syntax to boost fields: "title^3"',
    'Title is usually most important field (3-5x boost)',
    'Curated content (tags) gets medium boost (2x)',
    'User-generated content gets lower boost (0.5-1x)',
    'Tune weights based on CTR data',
  ],

  quickCheck: {
    question: 'Why boost title matches higher than description matches?',
    options: [
      'Titles are always longer',
      'Titles are carefully chosen and concise - high signal quality',
      'Descriptions are hard to search',
      'It\'s industry standard',
    ],
    correctIndex: 1,
    explanation: 'Titles are deliberately crafted to summarize the product. Descriptions are verbose and may mention many topics. Title matches indicate higher relevance.',
  },

  keyConcepts: [
    { title: 'Field Boost', explanation: 'Multiply score by field weight', icon: '×' },
    { title: 'Multi-Match', explanation: 'Search multiple fields with weights', icon: '🔍' },
    { title: 'Signal Quality', explanation: 'Better content gets higher boost', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'boosting-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Field-level boosting',
    taskDescription: 'Update search query to boost title (3x), tags (2x), description (1x)',
    successCriteria: [
      'Open Python tab in App Server',
      'Update multi_match query with field boosts',
      'Apply: title^3, tags^2, description^1',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add boost weights to the fields array using ^N syntax',
    level2: 'Change fields to: ["title^3", "tags^2", "description^1"]',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add Function Score for Advanced Boosting
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🎛️',
  scenario: "Field boosting helps, but you need more control - recency, popularity, availability!",
  hook: "A 5-year-old product with perfect title match ranks above a brand new popular item.",
  challenge: "Implement function_score to combine multiple boost signals beyond just field matching.",
  illustration: 'control-panel',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Function scoring enabled!',
  achievement: 'Search can now apply multiple boost factors simultaneously',
  metrics: [
    { label: 'Boost functions', after: 'Ready' },
    { label: 'Multi-signal ranking', after: 'Enabled' },
  ],
  nextTeaser: "But old products still rank too high...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Function Score: Combining Multiple Signals',
  conceptExplanation: `**function_score** lets you boost results based on custom functions, not just text matching.

**Architecture:**
\`\`\`python
{
    "query": {
        "function_score": {
            "query": { /* your multi_match query */ },
            "functions": [
                {
                    "filter": { "match": { "title": "query" } },
                    "weight": 3.0  # Title boost
                },
                {
                    "field_value_factor": {
                        "field": "popularity_score",
                        "modifier": "log1p",
                        "factor": 1.5
                    }
                },
                {
                    "gauss": {
                        "created_date": {
                            "origin": "now",
                            "scale": "30d",
                            "decay": 0.5
                        }
                    }
                }
            ],
            "score_mode": "multiply",
            "boost_mode": "multiply"
        }
    }
}
\`\`\`

**What this does:**
1. Base text matching score
2. × Title boost (if title matches)
3. × Popularity boost (from popularity_score field)
4. × Recency boost (decay function on date)

**Final score** = text_score × boosts`,

  whyItMatters: 'Function score is the most powerful Elasticsearch feature for relevance tuning. It combines text matching with business logic.',

  famousIncident: {
    title: 'Netflix Recommendation Engine',
    company: 'Netflix',
    year: '2006-2009',
    whatHappened: 'Netflix Prize competition to improve recommendations by 10%. Winning solution used ensemble of multiple scoring functions - popularity, recency, user similarity, genre matching - combined with weighted multiplication.',
    lessonLearned: 'Combining multiple signals (multi-factor boosting) outperforms single-signal ranking.',
    icon: '🎬',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Ranking song search results',
    howTheyDoIt: 'Uses function_score with: 1) Text match quality, 2) Popularity (play count), 3) Recency (release date), 4) User affinity. Multiplicative combination.',
  },

  keyPoints: [
    'function_score wraps your query with boost functions',
    'Each function adds a boost multiplier',
    'score_mode: how to combine function scores (multiply, sum, avg)',
    'boost_mode: how to combine with query score (multiply, replace, sum)',
    'Multiplicative mode creates strong differentiation',
  ],

  quickCheck: {
    question: 'Why use multiply instead of sum for combining boost signals?',
    options: [
      'Multiply is faster to compute',
      'Multiply creates stronger differentiation - great items get exponentially better scores',
      'Sum is too simple',
      'Elasticsearch requires multiply',
    ],
    correctIndex: 1,
    explanation: 'Multiplicative boosting: score × 3 × 1.5 × 2 = 9x boost. Additive: score + 3 + 1.5 + 2 = less differentiation. Multiply amplifies quality.',
  },

  keyConcepts: [
    { title: 'Function Score', explanation: 'Apply custom scoring functions', icon: '📊' },
    { title: 'Score Mode', explanation: 'How to combine function outputs', icon: '🔢' },
    { title: 'Boost Mode', explanation: 'How to apply to query score', icon: '⚡' },
  ],
};

const step4: GuidedStep = {
  id: 'boosting-search-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1+: Multi-signal boosting with function_score',
    taskDescription: 'Wrap search query in function_score for advanced boosting',
    successCriteria: [
      'Open Python tab in App Server',
      'Replace multi_match with function_score wrapper',
      'Set score_mode and boost_mode to "multiply"',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Wrap your existing query in a function_score block',
    level2: 'Create function_score with your multi_match as the "query" field, set both modes to multiply',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Recency Decay Function
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📅',
  scenario: "Users search for 'iPhone' and see iPhone 6 from 2014 ranked above iPhone 15!",
  hook: "Old products shouldn't dominate search results. Recent items are more relevant.",
  challenge: "Add a recency decay function that boosts newer products.",
  illustration: 'time-decay',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Recency boosting works!',
  achievement: 'Newer products now rank higher than old ones',
  metrics: [
    { label: 'Recency decay', after: 'Exponential (30d scale)' },
    { label: 'Recent items boosted', after: '+50%' },
    { label: 'Old items demoted', after: '-30%' },
  ],
  nextTeaser: "But unpopular items still rank above bestsellers...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Recency Decay: Time-Based Boosting',
  conceptExplanation: `**Recency decay** reduces the score of older items gradually.

**Decay functions:**
1. **Linear**: Score decreases proportionally with age
2. **Exponential**: Score drops quickly at first, then levels off
3. **Gaussian (gauss)**: Bell curve - peak at target date

**Best for search: Gaussian decay**

\`\`\`python
{
    "gauss": {
        "created_date": {
            "origin": "now",        # Center of curve
            "scale": "30d",         # Distance to 50% score
            "offset": "0d",         # No boost before decay
            "decay": 0.5            # Score at scale distance
        }
    }
}
\`\`\`

**How it works:**
- Items < 30 days old: ~100% boost
- Items = 30 days old: 50% boost
- Items = 90 days old: ~25% boost
- Items > 365 days: ~5% boost

Recent items get strong preference without completely eliminating old items.`,

  whyItMatters: 'Recency prevents outdated products from dominating. Users want current models, not discontinued ones.',

  famousIncident: {
    title: 'Google Freshness Update',
    company: 'Google',
    year: '2011',
    whatHappened: 'Google implemented stronger recency signals affecting 35% of searches. Recent news, reviews, and products got significant boost. Sites with stale content saw traffic drop.',
    lessonLearned: 'Recency matters enormously for user satisfaction. Fresh content is usually better content.',
    icon: '🗞️',
  },

  realWorldExample: {
    company: 'Best Buy',
    scenario: 'Electronics product search',
    howTheyDoIt: 'Uses aggressive recency decay (15-day scale) for electronics. New releases heavily boosted. Products > 1 year old appear only if no newer alternatives.',
  },

  diagram: `
Recency Boost Over Time:

Boost
100% │    ╭───╮
     │   ╱     ╲
 75% │  ╱       ╲
     │ ╱         ╲
 50% │╱           ╲___
     │                 ╲___
 25% │                     ╲___
     └─────────────────────────▶ Time
      0d   30d   90d   180d   365d

Gaussian decay with 30d scale
`,

  keyPoints: [
    'Gaussian (gauss) decay is smooth and natural',
    'scale parameter: days to reach 50% boost',
    'origin: reference point (usually "now")',
    'decay: boost value at scale distance (0.5 = 50%)',
    'Adjust scale per category (electronics: 30d, furniture: 180d)',
  ],

  quickCheck: {
    question: 'Why use Gaussian decay instead of linear decay?',
    options: [
      'Gaussian is faster to compute',
      'Gaussian more closely models real-world relevance - recent items much better, old items not worthless',
      'Linear doesn\'t work in Elasticsearch',
      'Gaussian is easier to configure',
    ],
    correctIndex: 1,
    explanation: 'Gaussian decay creates a smooth curve. Items just past the scale point still have value. Linear drops too aggressively.',
  },

  keyConcepts: [
    { title: 'Decay Function', explanation: 'Reduce score based on field value', icon: '📉' },
    { title: 'Gaussian Decay', explanation: 'Bell curve centered on target', icon: '🔔' },
    { title: 'Scale', explanation: 'Distance to 50% boost', icon: '📏' },
  ],
};

const step5: GuidedStep = {
  id: 'boosting-search-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Recency boosting with decay function',
    taskDescription: 'Add Gaussian decay function on created_date field',
    successCriteria: [
      'Open Python tab in App Server',
      'Add gauss decay function to function_score',
      'Configure: origin="now", scale="30d", decay=0.5',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add a gauss decay function to your functions array',
    level2: 'Add gauss function on created_date field with origin="now", scale="30d", decay=0.5',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Popularity Boosting
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⭐',
  scenario: "A product with 5,000 sales and 4.8 stars ranks below one with 2 sales and 3.2 stars!",
  hook: "Popular products are popular for a reason - they're usually what users want.",
  challenge: "Add popularity boosting based on sales volume, ratings, and review count.",
  illustration: 'popularity-signal',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Popularity boosting complete!',
  achievement: 'Search now surfaces bestsellers and highly-rated products',
  metrics: [
    { label: 'Popularity signals', after: '3' },
    { label: 'CTR improvement', after: '+35%' },
    { label: 'Conversion improvement', after: '+28%' },
  ],
  nextTeaser: "You've built a production-grade boosted search system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Popularity Signals: Wisdom of the Crowd',
  conceptExplanation: `**Popularity boosting** leverages collective behavior to improve relevance.

**Three key signals:**

1. **Sales Volume** (strongest signal)
   - Products that sell well are usually good matches
   - Use log scale to prevent runaway leaders

2. **Average Rating** (quality signal)
   - 4.5 stars > 3.0 stars
   - Normalize to 0-1 scale (rating / 5.0)

3. **Review Count** (social proof)
   - 500 reviews > 5 reviews
   - Use log scale: log(1 + review_count)

**Implementation:**
\`\`\`python
{
    "field_value_factor": {
        "field": "sales_count",
        "modifier": "log1p",      # log(1 + value)
        "factor": 2.0,            # Amplification
        "missing": 0              # Default for new products
    }
},
{
    "field_value_factor": {
        "field": "rating",        # Already 0-5 scale
        "modifier": "none",
        "factor": 1.5,            # 4.5 stars = 6.75 boost
        "missing": 3.0            # Assume average for unrated
    }
},
{
    "script_score": {
        "script": {
            "source": "Math.log(1 + doc['review_count'].value) / 10"
        }
    }
}
\`\`\`

**Combined boost:**
Final score = text × field × recency × (sales_boost × rating_boost × review_boost)`,

  whyItMatters: 'Popularity signals capture what thousands of users have already validated. It\'s free information - use it!',

  famousIncident: {
    title: 'Amazon "Customers Also Bought" Feature',
    company: 'Amazon',
    year: '2003',
    whatHappened: 'Amazon began heavily weighting popularity signals in search. Products with high sales velocity got massive boost. This created a virtuous cycle - popular items became more visible, driving more sales. Estimated to increase revenue 10-30%.',
    lessonLearned: 'Popularity boosting isn\'t just about relevance - it drives business outcomes.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Ranking handmade products',
    howTheyDoIt: 'Combines favorites count, sales volume, and shop rating into popularity score. Uses log scale to prevent mega-sellers from dominating. Balances with recency to surface new artisans.',
  },

  diagram: `
Popularity Score Calculation:

Sales: 500 → log(501) = 6.2 × 2.0 = 12.4
Rating: 4.5 → 4.5 × 1.5 = 6.75
Reviews: 200 → log(201) / 10 = 0.53

Popularity Boost = 12.4 × 6.75 × 0.53 = 44.4x

Combined with text (10) and recency (1.8):
Final Score = 10 × 44.4 × 1.8 = 799
`,

  keyPoints: [
    'Use log scale for counts to prevent runaway values',
    'field_value_factor boosts by field value',
    'modifier: log1p prevents log(0) errors',
    'Combine multiple signals multiplicatively',
    'Set sensible defaults (missing) for new products',
  ],

  quickCheck: {
    question: 'Why use log scale for sales count instead of raw values?',
    options: [
      'Log is faster to compute',
      'Prevents bestsellers from dominating - difference between 10 and 100 sales matters more than 10,000 vs 10,100',
      'Elasticsearch requires log scale',
      'It makes the math easier',
    ],
    correctIndex: 1,
    explanation: 'Log scale compresses large values. A product with 10K sales isn\'t 1000x better than one with 10 sales. Log creates balanced boosting.',
  },

  keyConcepts: [
    { title: 'Field Value Factor', explanation: 'Boost by numeric field value', icon: '🔢' },
    { title: 'Log Scale', explanation: 'Logarithmic compression of values', icon: '📊' },
    { title: 'Popularity Score', explanation: 'Aggregate of sales, ratings, reviews', icon: '⭐' },
  ],
};

const step6: GuidedStep = {
  id: 'boosting-search-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Popularity boosting',
    taskDescription: 'Add field_value_factor functions for sales, rating, and reviews',
    successCriteria: [
      'Open Python tab in App Server',
      'Add field_value_factor for sales_count (modifier: log1p)',
      'Add field_value_factor for rating',
      'Combine with existing boosts in functions array',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add field_value_factor functions for sales_count and rating to your functions array',
    level2: 'Add two field_value_factor objects: one for sales_count (log1p modifier), one for rating (none modifier)',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const boostingSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'boosting-search',
  title: 'Design Boosted Search Ranking',
  description: 'Build intelligent search with field boosting, recency decay, and popularity signals',
  difficulty: 'intermediate',
  estimatedMinutes: 35,

  welcomeStory: {
    emoji: '🎯',
    hook: "You've been hired as Search Relevance Engineer at RankTech!",
    scenario: "Your mission: Transform basic search into intelligent ranking using field boosting, recency decay, and popularity signals.",
    challenge: "Can you design a search system that surfaces the most relevant results?",
  },

  requirementsPhase: boostingSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Search Relevance',
    'Field-Level Boosting',
    'Function Score Queries',
    'Decay Functions',
    'Gaussian Decay',
    'Popularity Signals',
    'Multi-Signal Ranking',
    'Elasticsearch Boosting',
    'Relevance Tuning',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 11: Stream Processing (Relevance)',
  ],
};

export default boostingSearchGuidedTutorial;
