import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * E-commerce Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a product search platform like Amazon Search or Algolia.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working search (FR satisfaction)
 * Steps 4-8: Scale with NFRs (relevance, personalization, caching)
 *
 * Key Concepts:
 * - Product search with full-text indexing
 * - Faceted filtering (category, price, brand, ratings)
 * - Relevance ranking and scoring
 * - Personalization based on user behavior
 * - Search performance optimization
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const ecommerceSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a product search system for an e-commerce platform",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Staff Engineer at SearchTech Commerce',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-search',
      category: 'functional',
      question: "What's the core search functionality users expect?",
      answer: "Users want to:\n\n1. **Text search** - Type 'wireless headphones' and find relevant products\n2. **Filter results** - Narrow by price, brand, rating, category\n3. **Sort results** - By price, popularity, relevance, newest\n4. **See results fast** - Instant results as they type",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Search is the primary discovery mechanism - if search fails, users can't find products to buy",
    },
    {
      id: 'text-search',
      category: 'functional',
      question: "How should text search work exactly?",
      answer: "Users type a query like 'red nike shoes size 10' and the system should:\n1. **Match keywords** - Find products with those terms\n2. **Handle typos** - 'nikee' should still match 'nike'\n3. **Understand synonyms** - 'sneakers' matches 'shoes'\n4. **Rank by relevance** - Most relevant products first\n\nThis requires full-text search, not simple SQL LIKE.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Full-text search engines (Elasticsearch) are essential - databases alone aren't sufficient",
    },
    {
      id: 'faceted-filtering',
      category: 'functional',
      question: "What filters should users have?",
      answer: "Users need **faceted filters**:\n1. **Category** - Electronics → Headphones → Wireless\n2. **Price range** - $50-$100\n3. **Brand** - Sony, Bose, Apple\n4. **Ratings** - 4 stars and above\n5. **Availability** - In stock only\n\nFilters should update counts dynamically based on current search.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Faceted search is what separates e-commerce search from basic search",
    },
    {
      id: 'relevance-ranking',
      category: 'functional',
      question: "How should search results be ranked?",
      answer: "Relevance ranking considers multiple signals:\n1. **Text match quality** - Title match > description match\n2. **Popularity** - Sales volume, click-through rate\n3. **Ratings** - Average star rating\n4. **Recency** - Newer products ranked higher\n5. **Inventory** - In-stock products prioritized\n\nThis requires a scoring algorithm, not just sorting.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Relevance is what makes search useful - poor ranking = lost sales",
    },
    {
      id: 'personalization',
      category: 'functional',
      question: "Should search be personalized for each user?",
      answer: "Yes! Personalization improves relevance:\n1. **User history** - Previously viewed/purchased categories\n2. **Location** - Show local inventory first\n3. **Preferences** - Preferred brands, price ranges\n4. **Context** - Device type (mobile vs desktop)\n\nFor MVP, let's start without personalization - add in v2.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Personalization adds complexity - good to start simple and add later",
    },
    {
      id: 'autocomplete',
      category: 'functional',
      question: "Should we show suggestions as users type?",
      answer: "Yes! **Autocomplete/typeahead** is critical:\n1. Show popular queries\n2. Show matching product names\n3. Show categories\n\nResponse must be under 50ms or it feels laggy. Defer to v2 for MVP.",
      importance: 'nice-to-have',
      insight: "Autocomplete requires separate architecture - can add after basic search works",
    },
    {
      id: 'search-analytics',
      category: 'clarification',
      question: "Should we track search analytics?",
      answer: "Eventually yes - track what users search, what they click, conversion rates. But for MVP, focus on making search work. Analytics come later.",
      importance: 'nice-to-have',
      insight: "Analytics help improve relevance but aren't needed for basic functionality",
    },

    // SCALE & NFRs
    {
      id: 'throughput-products',
      category: 'throughput',
      question: "How many products in the catalog?",
      answer: "100 million products (SKUs) across all categories, sellers, and variations",
      importance: 'critical',
      learningPoint: "Massive scale requires specialized search infrastructure - can't use SQL LIKE queries",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day?",
      answer: "About 1 billion searches per day from 50 million daily active users",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 searches/sec",
        result: "~12K searches/sec average (50K at peak)",
      },
      learningPoint: "Extremely high query volume - caching and optimization critical",
    },
    {
      id: 'throughput-index-updates',
      category: 'throughput',
      question: "How often does the product catalog change?",
      answer: "Constantly! Products are added/updated/removed throughout the day:\n- New products: 100K/day\n- Price updates: 1M/day\n- Inventory changes: 10M/day\n\nSearch index must stay fresh.",
      importance: 'critical',
      learningPoint: "Search index must be updated in near real-time while serving queries",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results return?",
      answer: "p99 under 200ms for initial search. Users abandon if slower. Filtering/sorting should be under 100ms.",
      importance: 'critical',
      learningPoint: "Search latency directly impacts conversion - every 100ms costs sales",
    },
    {
      id: 'latency-autocomplete',
      category: 'latency',
      question: "How fast should autocomplete respond?",
      answer: "p99 under 50ms. Anything slower feels laggy as users type. This is why autocomplete is hard!",
      importance: 'important',
      learningPoint: "Autocomplete has stricter latency requirements than search",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if search goes down?",
      answer: "CATASTROPHIC! Users can't find products to buy. Revenue drops to near zero. Need 99.99% availability - less than 5 minutes downtime per month.",
      importance: 'critical',
      learningPoint: "Search is mission-critical - downtime directly equals lost revenue",
    },
    {
      id: 'consistency-requirement',
      category: 'consistency',
      question: "How fresh must search results be?",
      answer: "**Eventual consistency is acceptable**:\n- Price updates: within 1 minute OK\n- New products: within 5 minutes OK\n- Out-of-stock: within 1 minute (critical for user experience)\n\nSearch doesn't need strong consistency - speed matters more.",
      importance: 'important',
      learningPoint: "Search can tolerate stale data briefly - availability and speed are more important",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-search', 'text-search', 'faceted-filtering', 'relevance-ranking'],
  criticalFRQuestionIds: ['core-search', 'text-search', 'faceted-filtering', 'relevance-ranking'],
  criticalScaleQuestionIds: ['throughput-searches', 'latency-search', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search products by text',
      description: 'Full-text search with typo tolerance and synonym matching',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can apply faceted filters',
      description: 'Filter by category, price, brand, rating, availability',
      emoji: '🎛️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Results ranked by relevance',
      description: 'Smart ranking based on text match, popularity, ratings',
      emoji: '📊',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Personalized search results',
      description: 'Tailored results based on user history and preferences',
      emoji: '👤',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million searchers',
    writesPerDay: '11 million product updates',
    readsPerDay: '1 billion searches',
    peakMultiplier: 4,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 127, peak: 500 },
    calculatedReadRPS: { average: 11574, peak: 50000 },
    maxPayloadSize: '~50KB (search results page)',
    storagePerRecord: '~2KB per product document',
    storageGrowthPerYear: '~100GB (new products)',
    redirectLatencySLA: 'p99 < 200ms (search)',
    createLatencySLA: 'p99 < 50ms (autocomplete)',
  },

  architecturalImplications: [
    '✅ 100M products → Elasticsearch or Solr required (not SQL)',
    '✅ 50K searches/sec at peak → Distributed search cluster with sharding',
    '✅ p99 < 200ms → Aggressive caching of popular queries',
    '✅ Faceted filtering → Pre-computed aggregations',
    '✅ 11M updates/day → Near real-time indexing pipeline',
    '✅ Personalization → Separate ranking service with user profiles',
  ],

  outOfScope: [
    'Autocomplete/typeahead (v2)',
    'Visual search (image-based)',
    'Voice search',
    'Search analytics dashboard',
    'A/B testing framework',
    'Multi-language support',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search products and filter results. The complexity of relevance ranking, personalization, and real-time updates will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome to SearchTech Commerce! You're building the next-gen product search.",
  hook: "Your first customer is ready to search for 'wireless headphones'!",
  challenge: "Set up the basic request flow so search queries can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search service is online!',
  achievement: 'Customers can now send search requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every search system starts with a **Client** connecting to a **Server**.

When a user searches on Amazon:
1. Their browser/app (the **Client**) sends the query
2. It goes to your **Search API Server**
3. The server processes the query and returns results

This is the foundation of all search applications!`,

  whyItMatters: 'Without this connection, users can\'t search at all - they\'re stuck browsing randomly.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling 50,000 searches per second at peak',
    howTheyDoIt: 'Started with basic search in 1995, now uses distributed search clusters across multiple data centers',
  },

  keyPoints: [
    'Client = the customer\'s device (browser, mobile app)',
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
  id: 'ecommerce-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for search',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching for products', displayName: 'Client' },
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
  hook: "A customer typed 'wireless headphones' but got an error.",
  challenge: "Write the Python code to handle search queries and return results.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your search API works!',
  achievement: 'You implemented basic product search functionality',
  metrics: [
    { label: 'APIs implemented', after: '1' },
    { label: 'Can search products', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all products are gone...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Search Handler',
  conceptExplanation: `Every search API needs a **handler function** that:
1. Receives the search query
2. Searches through products
3. Returns matching results

For e-commerce search, we need:
- \`search_products(query, filters)\` - Find products matching text and filters

For now, we'll store products in memory (Python lists) and use simple string matching.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where search happens!',

  famousIncident: {
    title: 'Amazon Search Outage',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'Amazon\'s search went down for 30 minutes during peak shopping hours. Users couldn\'t find products. Estimated loss: $3-5 million in that half hour alone.',
    lessonLearned: 'Search is mission-critical for e-commerce. Downtime = immediate revenue loss.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Processing 50K searches per second',
    howTheyDoIt: 'Their search service uses distributed Elasticsearch clusters with sophisticated ranking algorithms',
  },

  keyPoints: [
    'Search API receives query and filters as parameters',
    'Use in-memory storage for MVP (search index comes later)',
    'Return product list matching the search criteria',
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
    { title: 'Results', explanation: 'List of matching products', icon: '📋' },
  ],
};

const step2: GuidedStep = {
  id: 'ecommerce-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search products by text',
    taskDescription: 'Configure search API and implement Python handler',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/search API',
      'Open the Python tab',
      'Implement search_products() function',
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
    level2: 'After assigning API, switch to the Python tab. Implement the TODO for search_products',
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
  scenario: "You now have 1 million products, and search takes 5+ seconds!",
  hook: "Scanning through a million products for every search query is impossibly slow. And you can't handle typos or relevance ranking.",
  challenge: "Add a search index (Elasticsearch) for fast, smart search.",
  illustration: 'slow-search',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search is lightning fast now!',
  achievement: 'Search index enables sub-second queries on millions of products',
  metrics: [
    { label: 'Search latency', before: '5000ms', after: '50ms' },
    { label: 'Typo tolerance', after: 'Enabled' },
    { label: 'Relevance ranking', after: 'Enabled' },
  ],
  nextTeaser: "But users can't filter results by price or brand yet...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Search Index: Why Elasticsearch?',
  conceptExplanation: `A **search index** is a specialized data structure for fast text search.

Why NOT use a database?
- SQL LIKE queries are slow on millions of products
- No typo tolerance ('nikee' won't match 'nike')
- No relevance scoring
- No faceted filtering

**Elasticsearch** provides:
- **Inverted index** - Lightning fast text search
- **Fuzzy matching** - Handles typos automatically
- **Relevance scoring** - Ranks results by match quality
- **Aggregations** - Powers faceted filters
- **Distributed** - Scales to billions of products

For e-commerce, Elasticsearch is essential.`,

  whyItMatters: 'At scale, SQL databases can\'t provide the search experience users expect. Search engines are purpose-built for this.',

  famousIncident: {
    title: 'Algolia\'s Birth Story',
    company: 'Algolia',
    year: '2012',
    whatHappened: 'Algolia founders were building mobile apps and found existing search solutions too slow (500ms+). They built Algolia to achieve <50ms search latency, revolutionizing e-commerce search.',
    lessonLearned: 'Search latency matters enormously for user experience and conversion rates.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Searching 100M+ products in under 200ms',
    howTheyDoIt: 'Uses distributed Elasticsearch clusters with custom plugins for relevance ranking. Shards across hundreds of nodes.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │Elasticsearch │
└────────┘     └─────────────┘     │ Search Index │
                                   └──────────────┘

Elasticsearch Index Structure:
{
  "product_id": "123",
  "title": "Sony Wireless Headphones",
  "description": "...",
  "brand": "Sony",
  "price": 99.99,
  "category": "Electronics/Audio",
  "rating": 4.5
}

Inverted Index for "wireless headphones":
- wireless → [product_123, product_456, product_789]
- headphones → [product_123, product_456, product_234]
`,

  keyPoints: [
    'Elasticsearch is a distributed search engine',
    'Inverted index enables fast full-text search',
    'Handles typos, synonyms, and relevance ranking',
    'Essential for e-commerce at scale',
    'Products are indexed with all searchable fields',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of SQL database for product search?',
    options: [
      'Elasticsearch is cheaper',
      'SQL can\'t store product data',
      'Elasticsearch provides fast full-text search with typo tolerance and relevance ranking',
      'Elasticsearch is easier to set up',
    ],
    correctIndex: 2,
    explanation: 'Elasticsearch is purpose-built for search with features SQL lacks: inverted index, fuzzy matching, relevance scoring, and aggregations.',
  },

  keyConcepts: [
    { title: 'Search Index', explanation: 'Specialized structure for fast text search', icon: '📇' },
    { title: 'Inverted Index', explanation: 'Maps words to documents containing them', icon: '🔍' },
    { title: 'Relevance Score', explanation: 'Ranking algorithm for search results', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'ecommerce-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast, smart product search',
    taskDescription: 'Add Elasticsearch search index and connect App Server to it',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enable fast full-text search on millions of products', displayName: 'Elasticsearch' },
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
// STEP 4: Add Database for Product Data
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💾',
  scenario: "Search is fast, but you need to store the actual product data somewhere!",
  hook: "Elasticsearch is an index, not a primary data store. You need a database for product catalog, inventory, and pricing.",
  challenge: "Add a database to store authoritative product data.",
  illustration: 'data-storage',
};

const step4Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: 'Product data has a home!',
  achievement: 'Database stores product catalog, Elasticsearch indexes it for search',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Product updates', after: 'Synced to search index' },
  ],
  nextTeaser: "But popular searches are hitting the search index too hard...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Database + Search Index: The Dynamic Duo',
  conceptExplanation: `**Database vs Search Index** - You need BOTH:

**Database (PostgreSQL):**
- Source of truth for product data
- Handles transactions (inventory, pricing)
- Stores complete product details
- ACID guarantees

**Search Index (Elasticsearch):**
- Denormalized copy for fast search
- Optimized for queries, not transactions
- Eventually consistent with database

Architecture:
1. Product updates go to Database first
2. Changes are synced to Elasticsearch (near real-time)
3. Search queries go to Elasticsearch
4. Product detail pages fetch from Database (or cache)`,

  whyItMatters: 'Elasticsearch is NOT a database - it\'s an index. You need both for a complete system.',

  famousIncident: {
    title: 'Elasticsearch Data Loss at GitLab',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'GitLab used Elasticsearch as secondary index. When they accidentally deleted production database, Elasticsearch couldn\'t restore data - it was just an index, not the source of truth.',
    lessonLearned: 'Never use search index as primary data store. Database is source of truth.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Managing product catalog',
    howTheyDoIt: 'DynamoDB/Aurora stores product data. Products are indexed to Elasticsearch in near real-time. Search queries hit Elasticsearch, product pages fetch from database.',
  },

  diagram: `
Product Update Flow:
1. ┌──────────┐  Write  ┌──────────┐
   │  Admin   │────────▶│ Database │
   │  Portal  │         │(Source of│
   └──────────┘         │  Truth)  │
                        └────┬─────┘
                             │
                             │ Sync (near real-time)
                             ▼
                        ┌──────────────┐
                        │Elasticsearch │
                        │   (Index)    │
                        └──────────────┘
                             ▲
                             │ Query
                        ┌────┴─────┐
                        │  Client  │
                        │ (Search) │
                        └──────────┘
`,

  keyPoints: [
    'Database = source of truth for product data',
    'Elasticsearch = denormalized index for fast search',
    'Product updates: Database → Elasticsearch',
    'Search queries: Client → Elasticsearch',
    'Keep both in sync with near real-time updates',
  ],

  quickCheck: {
    question: 'Why do we need both Database and Elasticsearch?',
    options: [
      'Elasticsearch can\'t store data',
      'Database handles transactions, Elasticsearch handles search - different strengths',
      'They\'re redundant backups of each other',
      'It\'s industry best practice',
    ],
    correctIndex: 1,
    explanation: 'Database provides ACID transactions and is source of truth. Elasticsearch provides fast full-text search. Each is optimized for different workloads.',
  },

  keyConcepts: [
    { title: 'Source of Truth', explanation: 'Database holds authoritative product data', icon: '🗄️' },
    { title: 'Search Index', explanation: 'Denormalized copy for fast queries', icon: '📇' },
    { title: 'Data Sync', explanation: 'Keep database and index in sync', icon: '🔄' },
  ],
};

const step4: GuidedStep = {
  id: 'ecommerce-search-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent product data',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store authoritative product catalog data', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
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
// STEP 5: Add Cache for Popular Search Queries
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Everyone is searching for 'iPhone 15'! The same query hits Elasticsearch 1,000 times per second!",
  hook: "Popular queries are overwhelming your search index. You're paying for the same computation over and over.",
  challenge: "Add a cache to serve popular search results instantly.",
  illustration: 'cache-layer',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Popular searches are instant now!',
  achievement: 'Cache dramatically reduced search index load',
  metrics: [
    { label: 'Popular query latency', before: '100ms', after: '5ms' },
    { label: 'Cache hit rate', after: '80%' },
    { label: 'Search index load', before: '100%', after: '20%' },
  ],
  nextTeaser: "But faceted filtering is still slow...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Search Results: The 80/20 Rule',
  conceptExplanation: `The **80/20 rule for search**: 80% of queries are for 20% of terms.

Popular queries like:
- "iPhone 15"
- "wireless headphones"
- "running shoes"

These get searched thousands of times per day!

**Cache Strategy**:
1. Check cache for query + filters
2. If hit → return cached results (< 5ms)
3. If miss → query Elasticsearch, cache results

TTL considerations:
- Short TTL (5-10 min) for price/inventory sensitive
- Longer TTL (1 hour) for stable catalog queries
- Cache invalidation when products update`,

  whyItMatters: 'At 50K searches/sec, caching popular queries saves massive compute costs and improves latency.',

  famousIncident: {
    title: 'eBay Search Cache Strategy',
    company: 'eBay',
    year: '2015',
    whatHappened: 'eBay implemented aggressive search result caching with smart invalidation. Reduced search backend load by 70% and improved p99 latency from 300ms to 50ms.',
    lessonLearned: 'Search caching is essential at scale - but cache invalidation is the hard part.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling popular search queries',
    howTheyDoIt: 'Uses multi-layer caching - CDN for ultra-popular queries, Redis for personalized results. 80%+ cache hit rate.',
  },

  diagram: `
Search Query Flow with Cache:

┌────────┐     ┌─────────────┐     ┌───────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │
└────────┘     └─────────────┘     │ Cache │
                     │              └───────┘
                     │                  │
                     │   Hit (80%)? ────┘
                     │   Return instantly!
                     │
                     │   Miss (20%)?
                     ▼
                ┌──────────────┐
                │Elasticsearch │
                │              │
                └──────────────┘
`,

  keyPoints: [
    'Cache sits between App Server and Elasticsearch',
    '80% of queries are for 20% of terms - perfect for caching',
    'Cache key = query + filters + sort + page',
    'Short TTL to keep results fresh',
    'Invalidate cache when products update',
  ],

  quickCheck: {
    question: 'Why cache search results instead of just making Elasticsearch faster?',
    options: [
      'Elasticsearch is always slow',
      'Popular queries get searched thousands of times - cache eliminates redundant work',
      'Caching is cheaper than Elasticsearch',
      'Cache is easier to implement',
    ],
    correctIndex: 1,
    explanation: 'The same popular queries get searched repeatedly. Caching serves these instantly and reduces expensive Elasticsearch queries by 80%+.',
  },

  keyConcepts: [
    { title: 'Query Cache', explanation: 'Store search results for popular queries', icon: '💾' },
    { title: 'Cache Key', explanation: 'Query + filters + sort + page', icon: '🔑' },
    { title: 'TTL', explanation: 'How long to cache results', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'ecommerce-search-step-5',
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
      'Cache TTL configured (600 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
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
// STEP 6: Implement Faceted Filtering (Aggregations)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🎛️',
  scenario: "Users found 10,000 results for 'headphones' but can't narrow them down!",
  hook: "Users need filters: price range, brand, ratings, in-stock. This is faceted search.",
  challenge: "Implement faceted filtering using Elasticsearch aggregations.",
  illustration: 'filter-panel',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Users can now filter results!',
  achievement: 'Faceted search enables precise product discovery',
  metrics: [
    { label: 'Filters available', after: '5' },
    { label: 'Filter response time', after: '<100ms' },
    { label: 'User satisfaction', after: '+40%' },
  ],
  nextTeaser: "But search results aren't ranked very well...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Faceted Search: The Power of Aggregations',
  conceptExplanation: `**Faceted search** lets users filter by multiple dimensions simultaneously.

Example: User searches "headphones"
- Category: Wireless (2,340), Wired (1,450), Gaming (890)
- Brand: Sony (550), Bose (420), Apple (380)
- Price: $0-50 (1,200), $50-100 (1,800), $100+ (900)
- Rating: 4+ stars (2,100), 3+ stars (3,500)

**Elasticsearch Aggregations** power this:
\`\`\`json
{
  "aggs": {
    "brands": { "terms": { "field": "brand" } },
    "price_ranges": { "range": { "field": "price", "ranges": [...] } },
    "categories": { "terms": { "field": "category" } }
  }
}
\`\`\`

Aggregations compute counts efficiently while respecting active filters.`,

  whyItMatters: 'Faceted search is what separates e-commerce from basic search. Users need to narrow 10,000 results to 10 relevant ones.',

  famousIncident: {
    title: 'Amazon Faceted Search Evolution',
    company: 'Amazon',
    year: '2003-2006',
    whatHappened: 'Amazon added faceted navigation in 2003 (late compared to competitors). After implementing, they saw 25% increase in conversion rate. It\'s now core to their search.',
    lessonLearned: 'Faceted search directly impacts conversion - users need to filter to find what they want.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Wayfair',
    scenario: 'Furniture search with 40+ filter dimensions',
    howTheyDoIt: 'Uses Elasticsearch aggregations with pre-computed facet values. Supports nested filters (e.g., "Sofas → Leather → Under $1000").',
  },

  diagram: `
Faceted Search Query:

User Query: "headphones" + [Brand: Sony, Price: $50-100]

┌─────────────────────────────────────────┐
│         Elasticsearch Query             │
├─────────────────────────────────────────┤
│ Text Match: "headphones"                │
│ Filters:                                │
│   - brand = "Sony"                      │
│   - price >= 50 AND price <= 100        │
│                                         │
│ Aggregations (for filter counts):      │
│   - brands.terms                        │
│   - price_ranges.range                  │
│   - ratings.range                       │
└─────────────────────────────────────────┘
                    ▼
         Results + Facet Counts
`,

  keyPoints: [
    'Faceted search = multiple independent filter dimensions',
    'Elasticsearch aggregations compute filter counts',
    'Filters apply to search results, aggregations show what\'s available',
    'Common facets: category, brand, price, rating, availability',
    'Facet counts update based on active filters',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch aggregations instead of separate queries for each facet?',
    options: [
      'Aggregations are faster',
      'Single query computes all facets together - much more efficient',
      'Aggregations are more accurate',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Aggregations compute all facet counts in a single query pass. Separate queries would be N times slower and wouldn\'t respect filter interactions.',
  },

  keyConcepts: [
    { title: 'Facet', explanation: 'Filter dimension (brand, price, category)', icon: '🎛️' },
    { title: 'Aggregation', explanation: 'Compute counts per facet value', icon: '📊' },
    { title: 'Filter', explanation: 'Active user selections that narrow results', icon: '🔍' },
  ],
};

const step6: GuidedStep = {
  id: 'ecommerce-search-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: Users can apply faceted filters',
    taskDescription: 'Configure search to support faceted filtering with aggregations',
    successCriteria: [
      'Click on Search Index component',
      'Go to Configuration tab',
      'Enable aggregations',
      'Configure facets: category, brand, price, rating',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click on the Search Index, then find the aggregations settings',
    level2: 'Enable aggregations and add facets for category, brand, price_range, and rating',
    solutionComponents: [{ type: 'search_index', config: { aggregations: { enabled: true } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Implement Relevance Ranking
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "Users search for 'laptop' and out-of-stock, outdated products show up first!",
  hook: "Search results are ordered randomly. Users want the BEST matches first, not just any match.",
  challenge: "Implement relevance ranking to show the best products first.",
  illustration: 'ranking-algorithm',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Search results are now ranked intelligently!',
  achievement: 'Relevance ranking surfaces the best matches first',
  metrics: [
    { label: 'Ranking signals', after: '5' },
    { label: 'Click-through rate', after: '+60%' },
    { label: 'User satisfaction', after: '+50%' },
  ],
  nextTeaser: "But results aren't personalized for each user...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Relevance Ranking: Beyond Keyword Matching',
  conceptExplanation: `**Relevance ranking** determines the order of search results.

Multiple signals contribute to a product's score:

1. **Text Match Quality** (40% weight)
   - Title match > description match
   - Exact phrase > individual words
   - TF-IDF scoring

2. **Popularity Signals** (30% weight)
   - Sales volume (last 30 days)
   - Click-through rate
   - Add-to-cart rate

3. **Quality Signals** (20% weight)
   - Average rating (4.5 stars > 3.0 stars)
   - Number of reviews
   - Return rate (lower is better)

4. **Freshness** (5% weight)
   - Newer products boosted slightly
   - Recent price drops

5. **Availability** (5% weight)
   - In-stock products ranked higher
   - Fast shipping available

**Scoring formula**:
Final Score = (text_score × 0.4) + (popularity × 0.3) + (quality × 0.2) + (freshness × 0.05) + (availability × 0.05)`,

  whyItMatters: 'Relevance ranking directly impacts conversion. If users can\'t find what they want in the first 10 results, they leave.',

  famousIncident: {
    title: 'Google Shopping Relevance Overhaul',
    company: 'Google',
    year: '2019',
    whatHappened: 'Google Shopping updated their ranking algorithm to prioritize relevance over advertiser bids. Conversion rates increased 40% because users found what they actually wanted.',
    lessonLearned: 'Relevance beats everything. Users click on what\'s relevant, not what\'s ranked first randomly.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Ranking millions of products for each query',
    howTheyDoIt: 'Uses machine learning models trained on billions of search sessions. Factors: text match, sales velocity, reviews, Prime eligibility, personalization.',
  },

  diagram: `
Relevance Scoring Example:

Query: "wireless headphones"

Product A: "Sony WH-1000XM5 Wireless Headphones"
- Text match: 95/100 (exact title match)
- Popularity: 90/100 (best seller)
- Quality: 92/100 (4.6 stars, 10K reviews)
- Freshness: 80/100 (6 months old)
- Availability: 100/100 (in stock, Prime)
→ Final Score: 92.3 → Rank #1

Product B: "Bluetooth Earbuds"
- Text match: 40/100 (synonym match)
- Popularity: 70/100
- Quality: 85/100 (4.2 stars)
- Freshness: 50/100 (2 years old)
- Availability: 80/100 (in stock, slow ship)
→ Final Score: 61.5 → Rank #8
`,

  keyPoints: [
    'Multiple signals contribute to relevance score',
    'Text match is important but not everything',
    'Popularity and quality signals boost relevant products',
    'Weights are tuned based on conversion data',
    'Elasticsearch function_score or learning-to-rank models',
  ],

  quickCheck: {
    question: 'Why not just rank by text match quality?',
    options: [
      'Text match is too slow to compute',
      'Users want popular, high-quality products - not just keyword matches',
      'Text match is inaccurate',
      'It\'s easier to combine multiple signals',
    ],
    correctIndex: 1,
    explanation: 'A perfect text match on a low-quality, out-of-stock product is useless. Combining text match with popularity, quality, and availability gives users what they actually want.',
  },

  keyConcepts: [
    { title: 'Relevance Score', explanation: 'Combined score from multiple signals', icon: '📊' },
    { title: 'Text Match', explanation: 'How well query matches product', icon: '🔤' },
    { title: 'Popularity Signal', explanation: 'Sales, clicks, engagement metrics', icon: '📈' },
  ],
};

const step7: GuidedStep = {
  id: 'ecommerce-search-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Results ranked by relevance',
    taskDescription: 'Configure multi-signal relevance ranking in search index',
    successCriteria: [
      'Click on Search Index component',
      'Go to Ranking Configuration',
      'Enable function_score',
      'Configure ranking signals: text_match, popularity, quality, availability',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click on Search Index, find the Ranking Configuration section',
    level2: 'Enable function_score and add ranking signals with appropriate weights',
    solutionComponents: [{ type: 'search_index', config: { ranking: { enabled: true } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Personalization Service
// =============================================================================

const step8Story: StoryContent = {
  emoji: '👤',
  scenario: "Two users search for 'running shoes' - one is a marathon runner, one is casual!",
  hook: "Same query, but users have different preferences. Personalization tailors results to each user.",
  challenge: "Add a personalization service to customize search results per user.",
  illustration: 'personalization',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Search is now personalized!',
  achievement: 'Each user sees results tailored to their preferences',
  metrics: [
    { label: 'Personalization signals', after: '4' },
    { label: 'Conversion rate', after: '+35%' },
    { label: 'User engagement', after: '+45%' },
    { label: 'Return visits', after: '+50%' },
  ],
  nextTeaser: "You've built a world-class search system!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Personalization: Tailoring Results Per User',
  conceptExplanation: `**Personalization** adjusts search ranking based on individual user behavior and preferences.

Personalization signals:

1. **Purchase History**
   - User bought Nike before → boost Nike products
   - User bought electronics → boost tech products

2. **Browsing Behavior**
   - Recently viewed categories
   - Time spent on product pages
   - Products added to cart (but not purchased)

3. **Preferences**
   - Preferred brands (implicit from clicks)
   - Price range affinity
   - Style preferences (colors, features)

4. **Contextual**
   - Location (show local inventory)
   - Device (mobile vs desktop)
   - Time of day

**Architecture:**
- Personalization Service stores user profiles
- Search queries enriched with user_id
- Results re-ranked based on personalization score
- Combined score = relevance_score + personalization_boost`,

  whyItMatters: 'Personalization can improve conversion by 30-50%. Same query for different users should show different results based on their needs.',

  famousIncident: {
    title: 'Netflix Prize & Personalization',
    company: 'Netflix',
    year: '2006-2009',
    whatHappened: 'Netflix offered $1M prize to improve their recommendation algorithm by 10%. They learned that personalization is incredibly valuable - but also that the winning algorithm was too complex to deploy in production!',
    lessonLearned: 'Personalization adds massive value, but balance complexity with practicality. Simple personalization > perfect personalization.',
    icon: '🎬',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Personalizing search for 300M users',
    howTheyDoIt: 'User behavior tracked in DynamoDB. Real-time feature computation. Search results re-ranked with personalization layer. Different users see different top results for same query.',
  },

  diagram: `
Personalized Search Flow:

┌────────┐  search query   ┌─────────────┐
│ Client │────────────────▶│ App Server  │
└────────┘   + user_id     └──────┬──────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼                           ▼
            ┌──────────────┐           ┌───────────────┐
            │Elasticsearch │           │Personalization│
            │ (base results)│          │   Service     │
            └──────┬───────┘           └───────┬───────┘
                   │                           │
                   │   Base ranking            │ User profile
                   └────────────┬──────────────┘
                                ▼
                    Re-rank with personalization
                                │
                                ▼
                        Personalized Results
`,

  keyPoints: [
    'Personalization adjusts ranking per user',
    'Track user behavior: purchases, clicks, views',
    'Combine base relevance with personalization boost',
    'Store user profiles in separate service',
    'Balance personalization with serendipity (don\'t over-filter)',
  ],

  quickCheck: {
    question: 'Why not just personalize in Elasticsearch instead of separate service?',
    options: [
      'Elasticsearch can\'t do personalization',
      'Separate service allows real-time user profile updates without re-indexing products',
      'It\'s cheaper',
      'It\'s industry standard',
    ],
    correctIndex: 1,
    explanation: 'User behavior changes constantly (every click). Separate personalization service can update profiles in real-time without touching the product index.',
  },

  keyConcepts: [
    { title: 'User Profile', explanation: 'History and preferences per user', icon: '👤' },
    { title: 'Personalization Boost', explanation: 'Score adjustment based on user', icon: '📈' },
    { title: 'Re-ranking', explanation: 'Adjust result order after base search', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'ecommerce-search-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Personalized search results',
    taskDescription: 'Add a Personalization Service for user-specific ranking',
    componentsNeeded: [
      { type: 'app_server', reason: 'Personalization service for user profiles', displayName: 'Personalization Service' },
    ],
    successCriteria: [
      'Add second App Server component (personalization service)',
      'Connect main App Server to Personalization Service',
      'Personalization Service connected to Database (for user profiles)',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'search_index', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add a second App Server to represent the Personalization Service',
    level2: 'Connect main App Server → Personalization Service → Database',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [
      { from: 'app_server', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const ecommerceSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'ecommerce-search',
  title: 'Design E-commerce Search',
  description: 'Build a product search system with full-text search, faceted filtering, relevance ranking, and personalization',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🔍',
    hook: "You've been hired as Lead Search Engineer at SearchTech Commerce!",
    scenario: "Your mission: Build a product search system that handles 100M products and 50K searches per second with intelligent ranking and personalization.",
    challenge: "Can you design a search system that finds the perfect product for every user?",
  },

  requirementsPhase: ecommerceSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Search API Design',
    'Elasticsearch / Full-text Search',
    'Inverted Index',
    'Database + Search Index Pattern',
    'Search Result Caching',
    'Faceted Search',
    'Aggregations',
    'Relevance Ranking',
    'Multi-signal Scoring',
    'Personalization',
    'User Profiling',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default ecommerceSearchGuidedTutorial;
