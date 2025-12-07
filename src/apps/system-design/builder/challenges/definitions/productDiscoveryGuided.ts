import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Product Discovery Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 6-step tutorial that teaches product discovery concepts
 * while building a faceted navigation and filter system for e-commerce.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements about facets, filters, sorting)
 * Steps 1-3: Build basic product catalog search
 * Steps 4-6: Add faceted navigation, filter counts, category browsing
 *
 * Key Concepts:
 * - Product catalog browsing
 * - Faceted navigation (category tree, filters)
 * - Filter aggregations and counts
 * - Dynamic facet computation
 * - Category hierarchy browsing
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const productDiscoveryRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a product discovery system with faceted navigation for an e-commerce platform",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at Discovery Platform Team',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-discovery',
      category: 'functional',
      question: "What's the core product discovery experience users expect?",
      answer: "Users discover products through multiple paths:\n\n1. **Browse by category** - Click 'Electronics' → 'Computers' → 'Laptops'\n2. **Filter by attributes** - Price range, brand, color, size, rating\n3. **Sort results** - By price, popularity, newest, rating\n4. **See counts** - 'Laptops (2,340)' - how many products match\n\nThis is different from search - users are exploring, not searching specific keywords.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Discovery is about browsing and narrowing down - it's navigation, not search",
    },
    {
      id: 'faceted-navigation',
      category: 'functional',
      question: "How do faceted filters work exactly?",
      answer: "Facets are **independent filter dimensions** that users can apply simultaneously:\n\n**Example**: Browse 'Laptops'\n- Brand: Dell (450), HP (320), Apple (280), Lenovo (210)\n- Price: $0-500 (340), $500-1000 (520), $1000+ (420)\n- RAM: 8GB (380), 16GB (520), 32GB (180)\n- Screen: 13\" (290), 14\" (380), 15\" (450), 17\" (160)\n\nApplying filters:\n- Select 'Apple' → counts update for other facets\n- Select '$1000+' → see only expensive Apple laptops\n- Select '16GB RAM' → further narrow results\n\nKey: Counts must update dynamically based on selected filters!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Faceted navigation requires real-time aggregation - counts change as filters are applied",
    },
    {
      id: 'category-hierarchy',
      category: 'functional',
      question: "How deep can category hierarchies go?",
      answer: "Categories form a tree structure:\n\n**Example**:\n- Electronics (root)\n  - Computers\n    - Laptops\n      - Gaming Laptops\n      - Business Laptops\n      - Ultrabooks\n    - Desktops\n    - Tablets\n  - Audio\n    - Headphones\n    - Speakers\n\nTypically 3-5 levels deep. Users can browse down the tree or jump to specific categories. Need to show product counts at each level.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Category hierarchies enable progressive refinement - users drill down from broad to specific",
    },
    {
      id: 'filter-counts',
      category: 'functional',
      question: "Why are filter counts important?",
      answer: "Counts provide critical feedback:\n\n**Without counts**:\n- User clicks 'Sony' → 0 results (frustrating!)\n\n**With counts**:\n- Sony (0) - grayed out, user knows nothing matches\n- Samsung (45) - user sees options available\n\nCounts prevent dead ends and guide users toward successful discoveries. They must be computed efficiently for all facets simultaneously.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Filter counts turn browsing into a conversation - system shows what's available before user commits",
    },
    {
      id: 'sorting-options',
      category: 'functional',
      question: "What sorting options should we support?",
      answer: "Users want multiple sort orders:\n\n1. **Relevance** (default for search)\n2. **Price: Low to High**\n3. **Price: High to Low**\n4. **Newest Arrivals**\n5. **Best Selling**\n6. **Customer Rating**\n\nSorting must work with active filters - e.g., 'Show me Dell laptops under $1000, sorted by rating'",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Sorting + filtering = powerful discovery - users need both to find what they want",
    },
    {
      id: 'text-search-integration',
      category: 'clarification',
      question: "Does product discovery integrate with text search?",
      answer: "Yes! Search and discovery work together:\n- User searches 'gaming laptop' → gets results\n- Then applies filters: Price $500-1000, Brand Asus\n- Results narrow down with updated counts\n\nFor MVP, focus on browse-only discovery. Search integration is v2.",
      importance: 'nice-to-have',
      insight: "Discovery and search complement each other - browse provides structure, search provides shortcuts",
    },

    // SCALE & NFRs
    {
      id: 'throughput-catalog-size',
      category: 'throughput',
      question: "How many products across how many categories?",
      answer: "50 million products across 10,000 categories (leaf nodes). Category tree has ~500 internal nodes. Each product has 5-20 facet values (brand, color, size, material, etc.)",
      importance: 'critical',
      learningPoint: "Large catalogs require efficient facet computation - can't compute counts on every request",
    },
    {
      id: 'throughput-browse-queries',
      category: 'throughput',
      question: "How many discovery/browse queries per day?",
      answer: "About 2 billion browse queries per day from 100 million daily active users. 70% are category browsing, 30% are filtered views.",
      importance: 'critical',
      calculation: {
        formula: "2B ÷ 86,400 sec = 23,148 queries/sec",
        result: "~23K browse/sec average (80K at peak sales)",
      },
      learningPoint: "Discovery is extremely high-traffic - must be fast and cached aggressively",
    },
    {
      id: 'throughput-facet-dimensions',
      category: 'throughput',
      question: "How many facet dimensions per category?",
      answer: "Varies by category:\n- Laptops: 15 facets (brand, price, RAM, storage, screen, processor, etc.)\n- Clothing: 12 facets (brand, price, size, color, material, style, etc.)\n- Books: 8 facets (author, price, format, publisher, language, etc.)\n\nAverage: 10-15 facets per category, each with 5-50 distinct values",
      importance: 'critical',
      learningPoint: "Computing aggregations across 15 dimensions with millions of products is expensive",
    },
    {
      id: 'latency-browse',
      category: 'latency',
      question: "How fast should category browsing respond?",
      answer: "p99 under 200ms for initial category load (products + facet counts). Applying filters should be under 100ms. Slow discovery = users abandon browsing.",
      importance: 'critical',
      learningPoint: "Discovery must feel instant - latency kills the browsing experience",
    },
    {
      id: 'latency-facet-computation',
      category: 'latency',
      question: "How quickly must facet counts update when filters change?",
      answer: "Under 100ms! Users are clicking rapidly - 'Price $500-1000' → counts update → 'Brand Dell' → counts update. If slow, feels laggy and broken.",
      importance: 'critical',
      learningPoint: "Dynamic facet updates are the heart of discovery - must be lightning fast",
    },
    {
      id: 'consistency-counts',
      category: 'consistency',
      question: "How accurate must filter counts be?",
      answer: "**Eventually consistent is fine** for counts:\n- If a product just sold out, showing count as 51 instead of 50 is acceptable\n- Counts can be 1-2 minutes stale\n\n**Strong consistency needed for**:\n- Actual product availability when user clicks\n\nCounts are navigational aids - approximate is OK!",
      importance: 'important',
      learningPoint: "Filter counts don't need perfect accuracy - speed matters more than precision",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-discovery', 'faceted-navigation', 'category-hierarchy', 'filter-counts'],
  criticalFRQuestionIds: ['core-discovery', 'faceted-navigation', 'category-hierarchy'],
  criticalScaleQuestionIds: ['throughput-browse-queries', 'latency-browse', 'latency-facet-computation'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Browse products by category',
      description: 'Users can navigate category hierarchy and see product listings',
      emoji: '📂',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Filter with faceted navigation',
      description: 'Apply multiple filters simultaneously with dynamic counts',
      emoji: '🎛️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Category hierarchy navigation',
      description: 'Browse multi-level category tree with product counts per category',
      emoji: '🌳',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Sort product results',
      description: 'Sort by price, popularity, rating, newest',
      emoji: '🔢',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million browsers',
    writesPerDay: '2 million catalog updates',
    readsPerDay: '2 billion browse queries',
    peakMultiplier: 3.5,
    readWriteRatio: '1000:1',
    calculatedWriteRPS: { average: 23, peak: 80 },
    calculatedReadRPS: { average: 23148, peak: 80000 },
    maxPayloadSize: '~100KB (product list + facets)',
    storagePerRecord: '~5KB per product (with facet values)',
    storageGrowthPerYear: '~20TB (new products)',
    redirectLatencySLA: 'p99 < 200ms (category browse)',
    createLatencySLA: 'p99 < 100ms (filter application)',
  },

  architecturalImplications: [
    '✅ 80K browse/sec at peak → Aggressive caching, CDN for category pages',
    '✅ 15 facets × 50 values → Pre-computed aggregations in search index',
    '✅ p99 < 100ms filters → Elasticsearch aggregations essential',
    '✅ 50M products → Distributed search cluster with sharding',
    '✅ Dynamic counts → Aggregation-capable search engine (not SQL)',
    '✅ Category hierarchy → Tree storage in cache + search index',
  ],

  outOfScope: [
    'Text search integration (browse-only MVP)',
    'Personalized recommendations',
    'Recently viewed products',
    'Product comparisons',
    'Filter history/breadcrumbs',
    'Saved filters/preferences',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple category browsing system with basic filtering. The complexity of dynamic facet counts, multi-level hierarchies, and real-time aggregations will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛒',
  scenario: "Welcome to Discovery Platform Engineering! You're building the browsing experience for a major e-commerce site.",
  hook: "Your first customer wants to browse the 'Electronics' category!",
  challenge: "Set up the basic request flow so users can reach your catalog service.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your discovery platform is online!',
  achievement: 'Users can now send browse requests to your service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to retrieve products yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Discovery Service',
  conceptExplanation: `Every product discovery system starts with a **Client** connecting to a **Discovery Service**.

When a customer browses products:
1. Their browser (the **Client**) sends category/filter requests
2. It goes to your **Discovery Service**
3. The service processes the request and returns products with facets

This is the foundation of all browsing applications!`,

  whyItMatters: 'Without this connection, users can\'t browse your catalog - they\'re stuck without navigation.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling 80,000 browse requests per second at peak',
    howTheyDoIt: 'Started with simple category pages in 1995, now uses distributed services across multiple data centers with aggressive caching',
  },

  keyPoints: [
    'Client = the customer\'s device (browser, mobile app)',
    'Discovery Service = backend that handles browse/filter requests',
    'HTTP/HTTPS = the protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device browsing products', icon: '📱' },
    { title: 'Discovery Service', explanation: 'Backend that handles category browsing', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'product-discovery-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for product discovery',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users browsing products', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles discovery API requests', displayName: 'Discovery Service' },
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
// STEP 2: Implement Browse API (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to browse categories!",
  hook: "A customer clicked 'Electronics' but got an error.",
  challenge: "Write the Python code to handle category browsing and return product listings.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your browse API works!',
  achievement: 'You implemented basic category browsing functionality',
  metrics: [
    { label: 'APIs implemented', after: '1' },
    { label: 'Can browse categories', after: '✓' },
  ],
  nextTeaser: "But where is the product data actually stored?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Browse Handler',
  conceptExplanation: `Every discovery API needs a **handler function** that:
1. Receives the category/filter parameters
2. Queries products matching the criteria
3. Returns products with metadata

For product discovery, we need:
- \`browse_category(category_id, filters, sort)\` - Get products in a category with optional filters

For now, we'll store products in memory (Python lists) and filter them in-memory.`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where discovery happens!',

  realWorldExample: {
    company: 'eBay',
    scenario: 'Processing 23K browse requests per second',
    howTheyDoIt: 'Their discovery service uses distributed search engines with pre-computed category indexes',
  },

  keyPoints: [
    'Browse API receives category and filter parameters',
    'Use in-memory storage for MVP (search index comes later)',
    'Return product list matching the browse criteria',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - search index comes later',
      'Memory never fails',
      'Databases can\'t filter products',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Search index (Elasticsearch) adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Browse Handler', explanation: 'Function that processes category requests', icon: '⚙️' },
    { title: 'Category ID', explanation: 'The category user is browsing', icon: '📂' },
    { title: 'Filters', explanation: 'Optional filter parameters (price, brand, etc.)', icon: '🎛️' },
  ],
};

const step2: GuidedStep = {
  id: 'product-discovery-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can browse products by category',
    taskDescription: 'Configure browse API and implement Python handler',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/browse API',
      'Open the Python tab',
      'Implement browse_category() function',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign the browse endpoint',
    level2: 'After assigning API, switch to the Python tab. Implement the TODO for browse_category',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/browse'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Search Index for Faceted Navigation
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million products, and users want to filter by brand, price, and rating!",
  hook: "Scanning through millions of products and computing filter counts in-memory takes 10+ seconds. Users are abandoning the page!",
  challenge: "Add a search index (Elasticsearch) for fast faceted navigation with aggregations.",
  illustration: 'slow-search',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Faceted navigation is lightning fast now!',
  achievement: 'Search index enables sub-second browsing with dynamic facet counts',
  metrics: [
    { label: 'Browse latency', before: '10000ms', after: '80ms' },
    { label: 'Facet computation', after: 'Real-time ✓' },
    { label: 'Filter counts', after: 'Dynamic ✓' },
  ],
  nextTeaser: "But we need to store the product data somewhere permanently...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Search Index: Why Elasticsearch for Discovery?',
  conceptExplanation: `A **search index** is essential for faceted navigation and filter counts.

Why NOT use a database?
- SQL can't efficiently compute 15 facet aggregations simultaneously
- No dynamic count updates as filters change
- Poor performance on millions of products

**Elasticsearch** provides:
- **Aggregations** - Compute facet counts in milliseconds
- **Dynamic filtering** - Counts update based on active filters
- **Distributed** - Scales to billions of products
- **Category hierarchy** - Efficient nested queries

For product discovery, Elasticsearch is essential.`,

  whyItMatters: 'Faceted navigation is impossible to build efficiently without a search engine. Elasticsearch makes it trivial.',

  famousIncident: {
    title: 'Etsy\'s Search Revolution',
    company: 'Etsy',
    year: '2011',
    whatHappened: 'Etsy was using MySQL for product browsing. As catalog grew to millions of items, faceted filtering became too slow (5+ seconds). They migrated to Solr (search engine) and latency dropped to 100ms. Conversion rate increased 25%.',
    lessonLearned: 'Faceted navigation at scale requires specialized search infrastructure.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Wayfair',
    scenario: 'Browsing millions of furniture items with 40+ filter dimensions',
    howTheyDoIt: 'Uses distributed Elasticsearch clusters with custom aggregation pipelines. Handles nested categories and dynamic facet counts.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │ ──▶ │ Discovery   │ ──▶ │Elasticsearch │
└────────┘     │  Service    │     │ Search Index │
               └─────────────┘     └──────────────┘

Elasticsearch Aggregation Query:
{
  "query": { "term": { "category": "laptops" } },
  "aggs": {
    "brands": {
      "terms": { "field": "brand" }
    },
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 500 },
          { "from": 500, "to": 1000 },
          { "from": 1000 }
        ]
      }
    },
    "ram": {
      "terms": { "field": "specs.ram" }
    }
  }
}

Returns: Products + facet counts in one query!
`,

  keyPoints: [
    'Elasticsearch is a distributed search engine',
    'Aggregations compute facet counts efficiently',
    'Handles dynamic count updates as filters change',
    'Essential for discovery at scale',
    'Products indexed with all filterable attributes',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of SQL database for faceted navigation?',
    options: [
      'Elasticsearch is cheaper',
      'SQL can\'t store product data',
      'Elasticsearch provides efficient aggregations for dynamic facet counts',
      'Elasticsearch is easier to set up',
    ],
    correctIndex: 2,
    explanation: 'Elasticsearch is purpose-built for aggregations. Computing 15 facet counts with millions of products takes milliseconds in Elasticsearch, minutes in SQL.',
  },

  keyConcepts: [
    { title: 'Search Index', explanation: 'Specialized structure for faceted queries', icon: '📇' },
    { title: 'Aggregation', explanation: 'Compute counts per facet value', icon: '📊' },
    { title: 'Facet', explanation: 'Filter dimension (brand, price, etc.)', icon: '🎛️' },
  ],
};

const step3: GuidedStep = {
  id: 'product-discovery-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Filter with faceted navigation',
    taskDescription: 'Add Elasticsearch search index and connect Discovery Service to it',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enable fast faceted navigation on millions of products', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index component added to canvas',
      'Discovery Service connected to Search Index',
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
    level2: 'Click Discovery Service, then click Search Index to create a connection',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 4: Add Database for Product Catalog
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💾',
  scenario: "Elasticsearch is great for browsing, but we need to store the actual product data somewhere!",
  hook: "Elasticsearch is an index, not a primary data store. You need a database for the authoritative product catalog.",
  challenge: "Add a database to store product catalog data.",
  illustration: 'data-storage',
};

const step4Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: 'Product catalog has a permanent home!',
  achievement: 'Database stores product catalog, Elasticsearch indexes it for discovery',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Product updates', after: 'Synced to search index' },
  ],
  nextTeaser: "But popular category pages are hitting the search index too hard...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Database + Search Index: Complementary Roles',
  conceptExplanation: `**Database vs Search Index** - You need BOTH:

**Database (PostgreSQL):**
- Source of truth for product data
- Handles transactions (inventory, pricing)
- Stores complete product details
- ACID guarantees

**Search Index (Elasticsearch):**
- Denormalized copy for fast browsing
- Optimized for queries and aggregations
- Eventually consistent with database

Architecture:
1. Product updates go to Database first
2. Changes are synced to Elasticsearch (near real-time)
3. Browse queries go to Elasticsearch
4. Product detail pages fetch from Database (or cache)`,

  whyItMatters: 'Elasticsearch is NOT a database - it\'s an index. You need both for a complete system.',

  realWorldExample: {
    company: 'Home Depot',
    scenario: 'Managing millions of products across stores',
    howTheyDoIt: 'Oracle database for product data. Products are indexed to Elasticsearch for discovery. Browse queries hit Elasticsearch, checkout fetches from database.',
  },

  keyPoints: [
    'Database = source of truth for product data',
    'Elasticsearch = denormalized index for fast browsing',
    'Product updates: Database → Elasticsearch',
    'Browse queries: Client → Elasticsearch',
    'Keep both in sync with near real-time updates',
  ],

  quickCheck: {
    question: 'Why do we need both Database and Elasticsearch?',
    options: [
      'Elasticsearch can\'t store data',
      'Database handles transactions, Elasticsearch handles discovery - different strengths',
      'They\'re redundant backups of each other',
      'It\'s industry best practice',
    ],
    correctIndex: 1,
    explanation: 'Database provides ACID transactions and is source of truth. Elasticsearch provides fast aggregations and faceted navigation. Each is optimized for different workloads.',
  },

  keyConcepts: [
    { title: 'Source of Truth', explanation: 'Database holds authoritative product data', icon: '🗄️' },
    { title: 'Search Index', explanation: 'Denormalized copy for fast queries', icon: '📇' },
    { title: 'Data Sync', explanation: 'Keep database and index in sync', icon: '🔄' },
  ],
};

const step4: GuidedStep = {
  id: 'product-discovery-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent product data',
    taskDescription: 'Add a Database and connect Discovery Service to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store authoritative product catalog data', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Discovery Service connected to Database',
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
    level2: 'Click Discovery Service, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Category Pages
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Everyone is browsing 'Electronics > Laptops'! The same category page is hit 10,000 times per minute!",
  hook: "Popular category pages are overwhelming your search index. You're computing the same facets over and over.",
  challenge: "Add a cache to serve popular category pages instantly.",
  illustration: 'cache-layer',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Popular categories are instant now!',
  achievement: 'Cache dramatically reduced search index load',
  metrics: [
    { label: 'Category page latency', before: '150ms', after: '5ms' },
    { label: 'Cache hit rate', after: '85%' },
    { label: 'Search index load', before: '100%', after: '15%' },
  ],
  nextTeaser: "But how do we handle the category hierarchy efficiently?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Discovery Pages: The 80/20 Rule',
  conceptExplanation: `The **80/20 rule for discovery**: 80% of traffic goes to 20% of categories.

Popular categories like:
- "Electronics > Laptops"
- "Clothing > Women's Shoes"
- "Home & Garden > Furniture"

These get browsed thousands of times per minute!

**Cache Strategy**:
1. Check cache for category_id + filters + sort
2. If hit → return cached page with facets (< 5ms)
3. If miss → query Elasticsearch, compute facets, cache results

TTL considerations:
- Short TTL (5-10 min) for price-sensitive categories
- Longer TTL (30 min) for stable categories
- Cache invalidation when products update

**What to cache**:
- ✅ Product listings for popular categories
- ✅ Facet counts for base category (no filters)
- ✅ Category metadata (name, hierarchy)
- ❌ User-specific personalized results`,

  whyItMatters: 'At 80K browse/sec, caching popular categories saves massive compute costs and improves latency.',

  realWorldExample: {
    company: 'Target',
    scenario: 'Handling category browsing during sales events',
    howTheyDoIt: 'Multi-layer caching - CDN for static category structure, Redis for faceted pages. 90%+ cache hit rate during normal traffic, 70% during sales.',
  },

  diagram: `
Browse Query Flow with Cache:

┌────────┐     ┌─────────────┐     ┌───────┐
│ Client │ ──▶ │ Discovery   │ ──▶ │ Redis │
└────────┘     │  Service    │     │ Cache │
               └─────────────┘     └───────┘
                     │                  │
                     │   Hit (85%)? ────┘
                     │   Return instantly!
                     │
                     │   Miss (15%)?
                     ▼
                ┌──────────────┐
                │Elasticsearch │
                │  + Compute   │
                │   Facets     │
                └──────────────┘
`,

  keyPoints: [
    'Cache sits between Discovery Service and Elasticsearch',
    '80% of traffic to 20% of categories - perfect for caching',
    'Cache key = category_id + filters + sort + page',
    'Short TTL to keep facet counts reasonably fresh',
    'Invalidate cache when catalog updates',
  ],

  quickCheck: {
    question: 'Why cache category pages instead of just making Elasticsearch faster?',
    options: [
      'Elasticsearch is always slow',
      'Popular categories get browsed thousands of times - cache eliminates redundant work',
      'Caching is cheaper than Elasticsearch',
      'Cache is easier to implement',
    ],
    correctIndex: 1,
    explanation: 'The same popular categories get browsed repeatedly. Caching serves these instantly and reduces expensive Elasticsearch aggregations by 85%+.',
  },

  keyConcepts: [
    { title: 'Category Cache', explanation: 'Store browse results for popular categories', icon: '💾' },
    { title: 'Cache Key', explanation: 'Category + filters + sort + page', icon: '🔑' },
    { title: 'TTL', explanation: 'How long to cache results', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'product-discovery-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from caching popular browse pages',
    taskDescription: 'Add a Redis cache between Discovery Service and Search Index',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache popular category pages and facets', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Discovery Service connected to Cache',
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
    level2: 'Connect Discovery Service to Cache. Then click Cache and set TTL to 600 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Implement Category Hierarchy Navigation
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌳',
  scenario: "Users want to drill down: Electronics → Computers → Laptops → Gaming Laptops",
  hook: "Right now, categories are flat. Users need hierarchical navigation with breadcrumbs and product counts at each level.",
  challenge: "Implement category tree navigation with efficient count queries.",
  illustration: 'category-tree',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Category hierarchy navigation is working!',
  achievement: 'Users can browse multi-level categories with counts',
  metrics: [
    { label: 'Category levels', after: '5' },
    { label: 'Hierarchy queries', after: 'Optimized ✓' },
    { label: 'Breadcrumbs', after: 'Enabled ✓' },
  ],
  nextTeaser: "You've built a complete product discovery system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Category Hierarchy: Tree Navigation and Counts',
  conceptExplanation: `**Category hierarchy** is a tree structure that enables progressive refinement.

**Storing the tree**:
\`\`\`sql
CREATE TABLE categories (
  category_id UUID PRIMARY KEY,
  name VARCHAR(200),
  parent_id UUID REFERENCES categories(category_id),
  level INT,
  path VARCHAR(1000)  -- e.g., "Electronics/Computers/Laptops"
);
\`\`\`

**Querying the tree**:
- Get children: \`WHERE parent_id = ?\`
- Get ancestors: Parse the path or use recursive CTE
- Get all descendants: \`WHERE path LIKE 'Electronics/Computers/%'\`

**Computing counts**:
Elasticsearch aggregation by category:
\`\`\`json
{
  "aggs": {
    "categories": {
      "terms": { "field": "category_id", "size": 10000 }
    }
  }
}
\`\`\`

Returns counts for all categories in one query!

**Optimization**:
- Cache category tree structure (changes rarely)
- Cache category counts (with short TTL)
- Pre-compute popular category paths`,

  whyItMatters: 'Category hierarchy is the backbone of discovery - users rely on it to narrow from millions of products to relevant items.',

  famousIncident: {
    title: 'Best Buy Category Redesign',
    company: 'Best Buy',
    year: '2019',
    whatHappened: 'Best Buy redesigned their category navigation to be more intuitive. They reduced category depth from 7 to 4 levels and improved breadcrumb navigation. Conversion rate increased 18%.',
    lessonLearned: 'Category hierarchy design directly impacts discoverability and conversions.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Managing category hierarchy for millions of products',
    howTheyDoIt: 'Category tree stored in PostgreSQL. Category metadata cached in Redis. Elasticsearch indexes products with full category path for efficient aggregations.',
  },

  diagram: `
Category Tree Structure:

Electronics (50,000 products)
├── Computers (15,000)
│   ├── Laptops (8,000)
│   │   ├── Gaming Laptops (2,300)
│   │   ├── Business Laptops (3,200)
│   │   └── Ultrabooks (2,500)
│   ├── Desktops (4,500)
│   └── Tablets (2,500)
└── Audio (12,000)
    ├── Headphones (7,000)
    └── Speakers (5,000)

User clicks "Laptops":
1. Query Elasticsearch: category_path LIKE "Electronics/Computers/Laptops%"
2. Get aggregations for subcategories (Gaming, Business, Ultrabooks)
3. Display 8,000 laptops with facets (brand, price, RAM, etc.)
4. Show counts for each subcategory
`,

  keyPoints: [
    'Category tree stored in database with parent-child relationships',
    'Path field enables efficient subtree queries',
    'Elasticsearch aggregations compute counts per category',
    'Cache category tree structure (changes rarely)',
    'Breadcrumb navigation built from category path',
  ],

  quickCheck: {
    question: 'Why store the full category path in each product document?',
    options: [
      'To save storage space',
      'To enable efficient filtering and aggregations on category hierarchy',
      'Because Elasticsearch requires it',
      'To make searches faster',
    ],
    correctIndex: 1,
    explanation: 'Storing the full path like "Electronics/Computers/Laptops" enables efficient queries for all products in a subtree using simple prefix matching.',
  },

  keyConcepts: [
    { title: 'Category Tree', explanation: 'Hierarchical structure of product categories', icon: '🌳' },
    { title: 'Breadcrumbs', explanation: 'Navigation trail showing category path', icon: '🍞' },
    { title: 'Category Counts', explanation: 'Number of products in each category', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'product-discovery-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Category hierarchy navigation',
    taskDescription: 'Your system now supports category tree navigation - conceptual understanding step',
    successCriteria: [
      'Understand category tree structure',
      'Learn how category counts are computed',
      'Recognize the role of path-based queries',
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
    level1: 'This step is about understanding category hierarchy design - no new components needed',
    level2: 'Your existing architecture now supports category tree navigation through database + search index + cache',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const productDiscoveryGuidedTutorial: GuidedTutorial = {
  problemId: 'product-discovery',
  title: 'Design Product Discovery System',
  description: 'Build a faceted navigation system with category browsing, filters, and dynamic counts',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🛒',
    hook: "You've been hired as Lead Discovery Engineer at E-Commerce Platform!",
    scenario: "Your mission: Build a product discovery system that handles 50M products with faceted navigation, category hierarchies, and real-time filter counts for 80K requests per second.",
    challenge: "Can you design a discovery system that helps users find the perfect product through browsing?",
  },

  requirementsPhase: productDiscoveryRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Product Discovery Architecture',
    'Faceted Navigation',
    'Search Index Aggregations',
    'Dynamic Filter Counts',
    'Category Hierarchy',
    'Browse Query Optimization',
    'Category Page Caching',
    'Tree Structure Navigation',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning (Sharding search index)',
  ],
};

export default productDiscoveryGuidedTutorial;
