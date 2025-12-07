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
 * Product Catalog Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches caching strategies for product catalogs
 * with focus on catalog caching, inventory updates, and cache warming.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic product catalog (FR satisfaction)
 * Steps 3-6: Apply caching strategies (catalog cache, inventory consistency, cache warming)
 * Steps 7-8: Optimize for scale (cache invalidation, performance)
 *
 * Key Concepts:
 * - Multi-layer caching for product catalogs
 * - Inventory consistency vs catalog consistency
 * - Cache warming strategies
 * - Cache invalidation patterns
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const productCatalogCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a product catalog system with efficient caching for an e-commerce platform",

  interviewer: {
    name: 'Alex Morgan',
    role: 'Staff Engineer - E-Commerce Infrastructure',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-catalog',
      category: 'functional',
      question: "What operations do users need to perform on the product catalog?",
      answer: "Users need to:\n\n1. **Browse products** - View product listings by category\n2. **Search products** - Find products by name, description, or attributes\n3. **View product details** - See full information including price, description, images, and inventory\n4. **Check inventory** - See real-time stock availability\n\nThe catalog contains millions of products that are mostly read, rarely written.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Product catalogs are extremely read-heavy - the perfect use case for caching",
    },
    {
      id: 'inventory-updates',
      category: 'functional',
      question: "When does inventory change and how frequently?",
      answer: "Inventory changes when:\n- Customer completes checkout (decrement)\n- Warehouse receives shipment (increment)\n- Returns are processed (increment)\n\nFrequency: ~500 inventory updates per second during peak hours.\n\nCritical: Inventory must be accurate. Can't oversell items that are out of stock!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Inventory requires stronger consistency than product details - can't cache as aggressively",
    },
    {
      id: 'product-updates',
      category: 'functional',
      question: "How often do product details (price, description) change?",
      answer: "Product details change infrequently:\n- Prices: Updated 1-10 times per day\n- Descriptions: Updated a few times per week\n- Images: Rarely updated once set\n\nEventual consistency is acceptable - if a price change takes 5 minutes to propagate, that's fine.",
      importance: 'important',
      revealsRequirement: 'FR-1',
      learningPoint: "Product metadata can be cached aggressively with longer TTLs",
    },
    {
      id: 'cache-warming',
      category: 'functional',
      question: "Should we pre-load popular products into cache?",
      answer: "Yes! Cache warming is critical:\n- Top 10% of products get 90% of traffic\n- Cold cache at startup causes latency spikes\n- Pre-load bestsellers, trending items, and featured products\n\nWarm cache on:\n- Server startup\n- Cache cluster scaling\n- After cache evictions",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Cache warming prevents thundering herd and improves user experience",
    },

    // SCALE & NFRs
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many products in the catalog and how many views per second?",
      answer: "Catalog size: 10 million products\nProduct views: 50,000 reads per second (peak)\nInventory checks: 5,000 reads per second (peak)\nInventory updates: 500 writes per second (peak)",
      importance: 'critical',
      calculation: {
        formula: "50K product reads/sec + 5K inventory reads/sec = 55K reads/sec total",
        result: "~55K reads/sec at peak (heavily read-dominated)",
      },
      learningPoint: "Read-write ratio is 100:1 - perfect for caching",
    },
    {
      id: 'latency-catalog',
      category: 'latency',
      question: "What are the latency requirements for product catalog?",
      answer: "Product details: p99 < 50ms (users expect instant page loads)\nInventory check: p99 < 100ms (shown during product view)\nSearch results: p99 < 200ms (list of products)",
      importance: 'critical',
      learningPoint: "Cache is essential to meet these latency targets - DB alone is too slow",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "How fresh does the cached data need to be?",
      answer: "Different consistency needs:\n\n**Inventory (strong consistency):**\n- Must be accurate within seconds\n- Can't show in-stock when actually out-of-stock\n- Short cache TTL (5-10 seconds) or write-through\n\n**Product details (eventual consistency):**\n- Can be stale for minutes\n- Price/description changes can take 5-10 minutes to propagate\n- Longer cache TTL (5-15 minutes)",
      importance: 'critical',
      learningPoint: "Different data has different consistency requirements - cache accordingly",
    },
    {
      id: 'cache-size',
      category: 'payload',
      question: "How much cache memory do we need?",
      answer: "Product record: ~5KB (details, images URLs, metadata)\n10M products × 5KB = 50GB total catalog\n\nBut we don't need to cache everything!\n- Cache hot 20% of products = 10GB\n- Add working set for inventory = 2GB\n- Total needed: ~15GB cache cluster",
      importance: 'important',
      calculation: {
        formula: "20% of 10M products × 5KB = 10GB + 2GB buffer",
        result: "~15GB Redis cluster needed",
      },
      learningPoint: "Cache the working set, not everything - Pareto principle applies",
    },
    {
      id: 'burst-flash-sale',
      category: 'burst',
      question: "What happens during flash sales or product launches?",
      answer: "Traffic can spike 100x on a single product!\n- Apple iPhone launch: 1M views in first hour\n- Without cache: thundering herd on database\n- Need cache warming before sale starts\n- Need cache strategy to handle stampede",
      importance: 'critical',
      insight: "Flash sales are the ultimate cache stress test - must pre-warm and handle bursts",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-catalog', 'inventory-updates', 'consistency-requirements'],
  criticalFRQuestionIds: ['core-catalog', 'inventory-updates'],
  criticalScaleQuestionIds: ['throughput-catalog', 'latency-catalog', 'consistency-requirements'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can browse and view product catalog',
      description: 'Browse categories, view product details with low latency (< 50ms p99)',
      emoji: '📋',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can search products',
      description: 'Search by name, category, attributes with fast response (< 200ms p99)',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can check real-time inventory',
      description: 'Accurate stock availability within seconds of updates',
      emoji: '📦',
    },
    {
      id: 'fr-4',
      text: 'FR-4: System pre-loads popular products (cache warming)',
      description: 'Bestsellers and trending items are ready in cache on startup',
      emoji: '🔥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '43 million inventory updates',
    readsPerDay: '4.3 billion product views',
    peakMultiplier: 5,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 500, peak: 2500 },
    calculatedReadRPS: { average: 50000, peak: 250000 },
    maxPayloadSize: '~5KB (product details)',
    storagePerRecord: '~5KB',
    storageGrowthPerYear: '~50GB (catalog) + ~100GB (logs)',
    redirectLatencySLA: 'p99 < 50ms (product details)',
    createLatencySLA: 'p99 < 100ms (inventory check)',
  },

  architecturalImplications: [
    '✅ Read-heavy (100:1) → Multi-layer caching essential',
    '✅ 250K reads/sec peak → CDN + Redis + local cache',
    '✅ Inventory consistency → Short TTL or write-through cache',
    '✅ Product catalog → Longer TTL, eventual consistency OK',
    '✅ Flash sales → Cache warming + burst capacity',
  ],

  outOfScope: [
    'Product recommendations',
    'Personalized pricing',
    'A/B testing',
    'User reviews and ratings',
    'Multi-region catalog sync',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple product catalog with database storage. Then we'll add intelligent caching strategies to handle massive read traffic while keeping inventory accurate. This is real-world caching at scale!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏪',
  scenario: "Welcome to CatalogTech! You're building the product catalog system for a major e-commerce platform.",
  hook: "Your first customer wants to browse products. Time to get the basic system running!",
  challenge: "Set up the foundation: connect the Client to your App Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your catalog service is online!',
  achievement: 'Customers can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Connection', after: 'Established' },
  ],
  nextTeaser: "But the server doesn't know how to serve product data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server for Catalogs',
  conceptExplanation: `Every product catalog starts with a **Client-Server** architecture.

When a customer browses products:
1. Their browser/app (Client) sends a request
2. Your App Server receives the request
3. The server fetches product data and responds

This is the foundation for all catalog operations!`,

  whyItMatters: 'Without this connection, customers cannot view any products. This is the entry point for all catalog interactions.',

  keyPoints: [
    'Client represents customers browsing your catalog',
    'App Server handles product listing and detail requests',
    'HTTP/REST is the standard protocol for catalog APIs',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Customer device requesting product data', icon: '📱' },
    { title: 'App Server', explanation: 'Serves product catalog and inventory', icon: '🖥️' },
    { title: 'REST API', explanation: 'Standard interface for catalog operations', icon: '🔌' },
  ],
};

const step1: GuidedStep = {
  id: 'catalog-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Foundation for all FRs',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers browsing products', displayName: 'Client' },
      { type: 'app_server', reason: 'Serves catalog requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Add Client component',
      'Add App Server component',
      'Connect Client to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server from the palette onto the canvas',
    level2: 'Click Client, then click App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Product Catalog
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "You need to store 10 million products with details like name, price, description, and images.",
  hook: "In-memory storage won't work - you need persistent storage that survives restarts.",
  challenge: "Add a database to store the product catalog permanently.",
  illustration: 'data-storage',
};

const step2Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: 'Product catalog is now persistent!',
  achievement: 'Your 10M products are safely stored',
  metrics: [
    { label: 'Products stored', after: '10 million' },
    { label: 'Data durability', after: '100%' },
  ],
  nextTeaser: "But catalog queries are SLOW - 500ms per product page load!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Database: The Source of Truth for Catalogs',
  conceptExplanation: `A **database** is essential for product catalogs:

**What we store:**
- \`products\` table: product_id, name, description, price, category, image_urls
- \`inventory\` table: product_id, quantity, warehouse_location
- \`categories\` table: category hierarchy

**Database choice:**
- PostgreSQL: Good for structured product data, ACID transactions
- MongoDB: Good for flexible product attributes
- For this tutorial, we'll use PostgreSQL

The database is the **source of truth** - cache serves it, but DB owns the data.`,

  whyItMatters: 'Without a database, you lose all product data on restart. Customers see empty shelves!',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Managing 500M+ products',
    howTheyDoIt: 'Uses a combination of DynamoDB (NoSQL) for product catalog and RDS (SQL) for inventory transactions. Database is partitioned by product_id.',
  },

  keyPoints: [
    'Database stores all product and inventory data',
    'Source of truth for catalog - cache is derivative',
    'Structure data in tables: products, inventory, categories',
    'Database provides ACID guarantees for inventory updates',
  ],

  quickCheck: {
    question: 'Why do we need a database instead of just in-memory storage?',
    options: [
      'Databases are faster',
      'Data persists across restarts and provides durability',
      'Databases are cheaper',
      'In-memory storage is deprecated',
    ],
    correctIndex: 1,
    explanation: 'Databases persist data to disk, ensuring catalog and inventory survive server restarts. In-memory data is lost when the process ends.',
  },

  keyConcepts: [
    { title: 'Source of Truth', explanation: 'Database owns the authoritative data', icon: '📚' },
    { title: 'Durability', explanation: 'Data survives crashes and restarts', icon: '🛡️' },
    { title: 'ACID', explanation: 'Transactions for inventory consistency', icon: '⚛️' },
  ],
};

const step2: GuidedStep = {
  id: 'catalog-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2, FR-3 need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store product catalog and inventory', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Add Database component',
      'Connect App Server to Database',
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
    level1: 'Drag a Database component onto the canvas',
    level2: 'Click App Server, then click Database to connect them',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Cache for Product Catalog
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "Product pages are loading in 500ms - customers are abandoning carts!",
  hook: "Every product view hits the database. At 50K requests/sec, your database is melting.",
  challenge: "Add a cache layer to serve product catalog at lightning speed.",
  illustration: 'slow-database',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Product pages now load 10x faster!',
  achievement: 'Cache serves 95% of requests in < 5ms',
  metrics: [
    { label: 'Page load time', before: '500ms', after: '50ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'Database load', before: '50K QPS', after: '2.5K QPS' },
  ],
  nextTeaser: "But inventory is showing stale data - customers see 'In Stock' for sold-out items!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Catalog Caching: The Performance Multiplier',
  conceptExplanation: `**The Problem**: Databases are slow compared to memory.
- Database query: 10-100ms
- Cache lookup: 1-5ms
- **10-100x faster!**

**Cache-Aside Pattern for Catalogs:**

1. Request comes in for product_id=123
2. Check cache: Is product_123 in Redis?
3. **Cache HIT** (95% of time): Return instantly
4. **Cache MISS** (5% of time):
   - Query database
   - Store in cache with TTL
   - Return to user

**What to cache:**
- Product details (name, description, price, images)
- Category listings
- Search results (for popular queries)
- TTL: 5-15 minutes (eventual consistency OK)`,

  whyItMatters: 'At 50K reads/sec, hitting the database for every request would require 100+ database servers. Cache reduces this to 5 servers.',

  famousIncident: {
    title: 'Best Buy Cache Failure During Black Friday',
    company: 'Best Buy',
    year: '2011',
    whatHappened: 'During Black Friday, Best Buy\'s cache cluster failed. All traffic hit the database directly. Database crashed under load. Website was down for 3 hours during peak shopping hours.',
    lessonLearned: 'Cache is not optional at scale - it\'s infrastructure. Always have cache redundancy and failover.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Wayfair',
    scenario: 'Serving 14 million products to millions of shoppers',
    howTheyDoIt: 'Uses multi-layer caching: Redis for product details (15-min TTL), Varnish for HTML (5-min TTL), CDN for images. 98% cache hit rate.',
  },

  diagram: `
┌────────────────────────────────────────────────────┐
│            CACHE-ASIDE FOR CATALOGS                │
├────────────────────────────────────────────────────┤
│                                                    │
│  Customer views product_id=123                    │
│                                                    │
│  ┌──────────┐    1. GET      ┌───────────┐       │
│  │   App    │ ─────────────→ │   Redis   │       │
│  │  Server  │                │   Cache   │       │
│  └────┬─────┘    2. Return   └───────────┘       │
│       │          (95% HIT)                        │
│       │              │                            │
│       │              │ 3. MISS?                   │
│       │              ▼                            │
│       │         ┌──────────┐                      │
│       └────────▶│ Database │                      │
│    4. Query     │(Products)│                      │
│                 └──────────┘                      │
│    5. Cache the result (TTL: 15 min)             │
│                                                    │
└────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Cache-aside: App controls what gets cached',
    'Cache product details with 5-15 minute TTL',
    'Eventual consistency is OK for catalog (not inventory!)',
    '95%+ cache hit rate is achievable',
    'Cache dramatically reduces database load',
  ],

  quickCheck: {
    question: 'Why can we cache product catalog with long TTL (15 minutes)?',
    options: [
      'Product details never change',
      'Eventual consistency is acceptable - price changes can take minutes to propagate',
      'Databases are always slow',
      'Caches are free',
    ],
    correctIndex: 1,
    explanation: 'Product details change infrequently (prices update a few times per day). If a price change takes 15 minutes to show, that\'s acceptable for catalog browsing.',
  },

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'App checks cache, falls back to DB on miss', icon: '🔄' },
    { title: 'TTL', explanation: 'Time To Live - how long cached data is valid', icon: '⏰' },
    { title: 'Cache Hit Rate', explanation: 'Percentage of requests served from cache', icon: '🎯' },
  ],
};

const step3: GuidedStep = {
  id: 'catalog-cache-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse products (fast), FR-2: Search products (fast)',
    taskDescription: 'Add Redis cache for product catalog',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache product catalog for fast access', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache component',
      'Connect App Server to Cache',
      'Configure cache strategy (cache-aside)',
      'Set TTL (300-900 seconds for products)',
    ],
  },

  celebration: step3Celebration,

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
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Click Cache and set strategy to cache-aside with TTL of 300-900 seconds',
    solutionComponents: [{ type: 'cache', config: { strategy: 'cache-aside', ttl: 600 } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Separate Inventory Cache with Write-Through
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Disaster! Customers are buying products that are out of stock.",
  hook: "Your 15-minute cache TTL means inventory can be stale. A customer just bought the 'last item' that sold out 10 minutes ago.",
  challenge: "Implement a separate caching strategy for inventory that stays accurate within seconds.",
  illustration: 'inventory-error',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Inventory is now accurate!',
  achievement: 'Write-through cache keeps inventory fresh',
  metrics: [
    { label: 'Inventory freshness', before: '15 minutes', after: '< 1 second' },
    { label: 'Oversell incidents', before: 'Daily', after: 'Zero' },
    { label: 'Customer complaints', before: '100/day', after: '0' },
  ],
  nextTeaser: "Great! But what happens when the cache is empty on startup?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Inventory Caching: Strong Consistency Required',
  conceptExplanation: `**The Inventory Challenge**: Different data, different consistency needs!

**Product Catalog (eventual consistency OK):**
- Cache-aside with 15-min TTL
- Price/description can be stale
- 95% hit rate

**Inventory (strong consistency required):**
- Can't show in-stock for out-of-stock items
- Can't oversell limited inventory
- Need fresh data within seconds

**Solution: Write-Through Cache for Inventory**

When inventory changes:
1. Write to database AND cache simultaneously
2. Cache is always up-to-date
3. Short TTL (5-10 seconds) as backup
4. Read from cache (almost always current)

Alternative: Cache with very short TTL (5-10 seconds) and cache-aside.`,

  whyItMatters: 'Inventory accuracy is critical for customer trust. Overselling causes cancellations, refunds, and angry customers.',

  famousIncident: {
    title: 'Amazon PlayStation 5 Overselling',
    company: 'Amazon',
    year: '2020',
    whatHappened: 'During PS5 launch, Amazon\'s inventory cache had stale data during high concurrency. They oversold thousands of units. Had to cancel orders and offer apology credits.',
    lessonLearned: 'Inventory requires strong consistency. Use write-through cache or very short TTLs. Never cache inventory with same strategy as catalog.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Managing inventory for millions of merchants',
    howTheyDoIt: 'Uses Redis with write-through for inventory. Every inventory change updates both database and cache. Cache TTL is 10 seconds as safety net. Never had overselling issue.',
  },

  diagram: `
┌────────────────────────────────────────────────────────┐
│     TWO-TIER CACHING: CATALOG vs INVENTORY             │
├────────────────────────────────────────────────────────┤
│                                                        │
│  CATALOG (Eventual Consistency):                      │
│  ┌──────────┐   Cache-Aside    ┌─────────┐           │
│  │   App    │ ←──────────────→ │  Redis  │           │
│  │  Server  │   TTL: 15 min    │ (Catalog)│          │
│  └──────────┘                  └─────────┘           │
│                                                        │
│  INVENTORY (Strong Consistency):                      │
│  ┌──────────┐  Write-Through   ┌─────────┐           │
│  │   App    │ ←──────────────→ │  Redis  │           │
│  │  Server  │   TTL: 5 sec     │(Inventory)│         │
│  └────┬─────┘                  └─────────┘           │
│       │ Update both on write                         │
│       ▼                                               │
│  ┌──────────┐                                         │
│  │ Database │ (Source of truth)                      │
│  └──────────┘                                         │
│                                                        │
└────────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Separate caching strategies for catalog vs inventory',
    'Catalog: cache-aside, 15-min TTL (eventual consistency)',
    'Inventory: write-through or 5-10 sec TTL (strong consistency)',
    'Can use same Redis cluster with different key patterns',
    'Never cache inventory with same long TTL as catalog',
  ],

  quickCheck: {
    question: 'Why do we need different caching strategies for product catalog vs inventory?',
    options: [
      'They use different databases',
      'Catalog can be stale (eventual consistency), inventory must be accurate (strong consistency)',
      'Inventory data is larger',
      'Catalog changes more frequently',
    ],
    correctIndex: 1,
    explanation: 'Catalog data (price, description) can be stale for minutes. Inventory must be accurate to prevent overselling. Different consistency requirements need different caching strategies.',
  },

  keyConcepts: [
    { title: 'Write-Through', explanation: 'Update cache and DB simultaneously', icon: '✍️' },
    { title: 'Strong Consistency', explanation: 'Data is always accurate', icon: '🎯' },
    { title: 'Eventual Consistency', explanation: 'Data may be temporarily stale', icon: '⏳' },
  ],
};

const step4: GuidedStep = {
  id: 'catalog-cache-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Accurate real-time inventory',
    taskDescription: 'Configure cache for two-tier strategy: catalog + inventory',
    successCriteria: [
      'Keep existing cache for catalog (cache-aside, long TTL)',
      'Note: In practice, you\'d configure cache key patterns and TTLs for different data types',
      'The cache component now handles both catalog (15-min TTL) and inventory (5-sec TTL or write-through)',
    ],
  },

  celebration: step4Celebration,

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
    level1: 'Your existing cache now handles two strategies: catalog (long TTL) and inventory (short TTL)',
    level2: 'In production, you\'d use cache key prefixes: catalog:* (15-min TTL) and inventory:* (5-sec TTL). For now, just understand the concept.',
    solutionComponents: [{ type: 'cache', config: { strategy: 'cache-aside', ttl: 300 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Implement Cache Warming
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🥶',
  scenario: "You just deployed a new cache cluster. It's completely empty!",
  hook: "All traffic is now hitting the database. Latency spiked to 2 seconds. Customers are seeing error pages!",
  challenge: "Implement cache warming to pre-load popular products before serving traffic.",
  illustration: 'cold-cache',
};

const step5Celebration: CelebrationContent = {
  emoji: '🔥',
  message: 'Cache is pre-warmed and ready!',
  achievement: 'Popular products loaded before traffic arrives',
  metrics: [
    { label: 'Cache hit rate on startup', before: '0%', after: '90%' },
    { label: 'Startup latency spike', before: '2000ms', after: '50ms' },
    { label: 'Database queries on startup', before: '50K/sec', after: '5K/sec' },
  ],
  nextTeaser: "Excellent! But can we handle flash sales and traffic bursts?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Warming: Prevent Cold Start Problems',
  conceptExplanation: `**The Cold Cache Problem:**

When cache is empty (server restart, new cluster, cache eviction):
- Every request = cache MISS
- All traffic hits database
- Database overloads
- Latency spikes
- Customers see errors

This is called a **thundering herd** or **cache stampede**.

**Solution: Cache Warming**

Pre-load cache with hot data BEFORE serving traffic:

1. **On Startup:**
   - Query database for top 1000 bestselling products
   - Load into cache
   - Then start serving traffic

2. **Continuous Warming:**
   - Background job runs every hour
   - Refreshes cache for trending products
   - Prevents eviction of hot items

3. **Predictive Warming:**
   - Before flash sales, pre-load sale items
   - Before product launches, pre-warm cache

**What to warm:**
- Bestsellers (top 1%)
- Trending products
- Featured/promoted items
- Upcoming flash sale items`,

  whyItMatters: 'Cache warming prevents latency spikes and database overload during cold starts. Critical for zero-downtime deployments.',

  famousIncident: {
    title: 'Etsy Cache Warming Saves Black Friday',
    company: 'Etsy',
    year: '2019',
    whatHappened: 'Etsy scaled up cache clusters before Black Friday. Without cache warming, new clusters would have caused database stampede. They pre-loaded top 10K products into every new cache node. Zero incidents.',
    lessonLearned: 'Always warm cache before serving traffic, especially during scale-up events.',
    icon: '🛍️',
  },

  realWorldExample: {
    company: 'Alibaba',
    scenario: 'Preparing for Singles\' Day (11/11) sale',
    howTheyDoIt: 'Starts cache warming 24 hours before sale. Loads all sale items into cache. Runs drills to test cache performance. Has backup cache warming if primary fails.',
  },

  diagram: `
┌────────────────────────────────────────────────────────┐
│              CACHE WARMING STRATEGIES                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. STARTUP WARMING (Before serving traffic):         │
│                                                        │
│     ┌──────────────┐                                  │
│     │ Warming Job  │                                  │
│     └──────┬───────┘                                  │
│            │ 1. Query top 1000 products              │
│            ▼                                          │
│     ┌──────────────┐        ┌─────────┐              │
│     │   Database   │ ─────→ │  Redis  │              │
│     └──────────────┘   2. Load cache   └─────────┘   │
│            │                                          │
│            │ 3. Cache warmed, start serving traffic  │
│            ▼                                          │
│     ┌──────────────┐                                  │
│     │  App Server  │ (Cache hit rate: 90%+)         │
│     └──────────────┘                                  │
│                                                        │
│  2. CONTINUOUS WARMING (Background job):              │
│     - Run every hour                                  │
│     - Refresh trending products                       │
│     - Prevent hot item eviction                       │
│                                                        │
│  3. PREDICTIVE WARMING (Before events):               │
│     - Flash sale items pre-loaded                     │
│     - Product launches pre-warmed                     │
│     - Seasonal items refreshed                        │
│                                                        │
└────────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Warm cache before serving traffic (prevents cold start)',
    'Load top 1% of products (covers 90% of traffic)',
    'Background job continuously refreshes hot items',
    'Predictive warming for flash sales and launches',
    'Warming = intentionally causing cache misses to populate cache',
  ],

  quickCheck: {
    question: 'When should you warm the cache?',
    options: [
      'Only when cache is completely empty',
      'On startup, during scale-up, before flash sales, and continuously via background jobs',
      'Never - let it warm naturally',
      'Only after errors occur',
    ],
    correctIndex: 1,
    explanation: 'Cache warming should be proactive: on startup, during scale events, before traffic spikes, and continuously for hot items. Prevents thundering herd.',
  },

  keyConcepts: [
    { title: 'Cache Warming', explanation: 'Pre-loading cache with hot data', icon: '🔥' },
    { title: 'Thundering Herd', explanation: 'All requests hit DB when cache is cold', icon: '🐘' },
    { title: 'Cold Start', explanation: 'Empty cache causes latency spike', icon: '❄️' },
  ],
};

const step5: GuidedStep = {
  id: 'catalog-cache-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Pre-load popular products (cache warming)',
    taskDescription: 'Understand cache warming strategy (implementation details in Python code)',
    successCriteria: [
      'Cache warming is a code-level implementation',
      'In your App Server Python code, you would:',
      '  1. Query database for top products on startup',
      '  2. Load them into cache before serving traffic',
      '  3. Run background job to refresh hot items',
      'For this step, understand the concept and architecture',
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
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Cache warming is implemented in application code, not as a separate component',
    level2: 'Your existing architecture supports cache warming - App Server can query DB and populate cache on startup',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer and Scale App Servers
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "A flash sale just started! Traffic jumped from 5K to 250K requests per second!",
  hook: "Your single app server is at 100% CPU and dropping requests. Cache is fine, but app layer can't keep up!",
  challenge: "Add a load balancer and scale to multiple app server instances.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Your system handles flash sale traffic!',
  achievement: 'Load balancer distributes across multiple servers',
  metrics: [
    { label: 'Capacity', before: '5K req/s', after: '250K req/s' },
    { label: 'App Server instances', before: '1', after: '10+' },
    { label: 'Request success rate', before: '60%', after: '99.9%' },
  ],
  nextTeaser: "Awesome! But can the database handle this?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for High Throughput',
  conceptExplanation: `**The Scaling Challenge:**

One app server can handle:
- ~5K requests/sec (with cache)
- ~500 requests/sec (without cache)

At 250K requests/sec, you need **50+ servers**.

**Solution: Load Balancer + Horizontal Scaling**

Load Balancer:
- Receives all incoming requests
- Distributes across N app servers
- Round-robin, least connections, or IP hash
- Health checks remove failed servers

App Servers:
- Stateless (session in cache/DB, not memory)
- All share same cache and database
- Auto-scale based on CPU/RPS metrics

For catalog systems:
- Cache hit rate determines scaling needs
- 95% hit rate = 10x less app servers needed
- 98% hit rate = 50x less!`,

  whyItMatters: 'Flash sales can spike traffic 100x. Without horizontal scaling, you can\'t handle burst traffic.',

  realWorldExample: {
    company: 'Target',
    scenario: 'Black Friday flash sale',
    howTheyDoIt: 'Auto-scales from 100 app servers to 1000+ during flash sales. Load balancer distributes traffic. Cache handles 98% of reads. Database only sees 2% of traffic.',
  },

  famousIncident: {
    title: 'Target Canada Website Crash',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target Canada launched website without load balancer and auto-scaling. First Black Friday, site crashed within 10 minutes. Single server couldn\'t handle traffic.',
    lessonLearned: 'Always design for peak traffic with horizontal scaling from day 1. Load balancer is infrastructure, not optional.',
    icon: '💥',
  },

  diagram: `
                    ┌──────────────────┐
                    │  Load Balancer   │
                    └────────┬─────────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │   App    │   │   App    │   │   App    │
        │ Server 1 │   │ Server 2 │   │ Server 3 │
        └────┬─────┘   └────┬─────┘   └────┬─────┘
             └──────────────┴──────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
        ┌──────────┐                ┌──────────┐
        │  Cache   │                │ Database │
        │ (Redis)  │                │(PostgreSQL)
        └──────────┘                └──────────┘
`,

  keyPoints: [
    'Load balancer distributes traffic across app servers',
    'Scale horizontally (more servers) not vertically (bigger servers)',
    'App servers must be stateless (share cache/DB)',
    'Auto-scale based on metrics: CPU, RPS, cache hit rate',
    'Cache hit rate directly impacts scaling needs',
  ],

  quickCheck: {
    question: 'If cache hit rate is 98%, how much does it reduce app server needs?',
    options: [
      '2x less servers',
      '10x less servers',
      '50x less servers (only 2% of traffic hits backend)',
      'Makes no difference',
    ],
    correctIndex: 2,
    explanation: '98% hit rate means only 2% of traffic needs database/backend processing. That\'s 50x reduction in backend load and required servers.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Stateless', explanation: 'Servers don\'t store user state', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'catalog-cache-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from horizontal scaling',
    taskDescription: 'Add Load Balancer and scale App Server instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and App Server',
      'Reconnect: Client → Load Balancer → App Server',
      'Click App Server and set instances to 5+',
    ],
  },

  celebration: step6Celebration,

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
    level1: 'Add Load Balancer between Client and App Server, then scale app instances',
    level2: 'Reconnect the flow, then click App Server and set instances to 5 or more',
    solutionComponents: [{ type: 'load_balancer' }, { type: 'app_server', config: { instances: 5 } }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Database Replication for Read Scaling
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Cache is handling 98% of traffic, but the remaining 2% (5K QPS) is overwhelming your database!",
  hook: "Cache misses, catalog updates, and inventory writes are all hitting one database server.",
  challenge: "Add database replication to scale reads and provide high availability.",
  illustration: 'database-overload',
};

const step7Celebration: CelebrationContent = {
  emoji: '💪',
  message: 'Database is now highly available!',
  achievement: 'Read replicas scale catalog queries',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '5K QPS', after: '25K QPS' },
    { label: 'Failover time', before: 'Manual (hours)', after: 'Automatic (seconds)' },
  ],
  nextTeaser: "Perfect! Now let's optimize cache invalidation...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Scale Reads, Ensure Availability',
  conceptExplanation: `**Replication for Catalog Systems:**

**Primary (Write):**
- Handles all writes (inventory updates, catalog changes)
- Source of truth

**Replicas (Read):**
- Handle read queries (product lookups, search)
- Asynchronously sync from primary
- Can serve stale data (replication lag: 0.1-1 second)

**For Product Catalog:**
- Catalog reads → Replicas (eventual consistency OK)
- Inventory reads → Primary (strong consistency needed)
- All writes → Primary

**Failover:**
- If primary fails, promote a replica
- Minimizes downtime (99.99% availability)

**Replication Lag:**
- Typically < 1 second
- Acceptable for catalog (not for inventory!)
- Monitor lag, alert if > 5 seconds`,

  whyItMatters: 'Replicas provide both read scaling and high availability. Single database = single point of failure.',

  realWorldExample: {
    company: 'eBay',
    scenario: 'Managing 1.3 billion product listings',
    howTheyDoIt: 'Uses MySQL with 5 read replicas per shard. Catalog reads go to replicas. Inventory and bid updates go to primary. Monitors replication lag closely.',
  },

  famousIncident: {
    title: 'GitHub Database Outage',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'Primary MySQL database failed. Automatic failover kicked in, but replica was 40 minutes behind. GitHub was down for 24 hours while they recovered data. Lost some commits.',
    lessonLearned: 'Monitor replication lag. Have sync replication for critical data. Test failover regularly.',
    icon: '⚠️',
  },

  diagram: `
                     ┌───────────────┐
                     │   Primary DB  │
                     │   (Writes)    │
                     └───────┬───────┘
                             │ Async replication
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Replica 1│   │ Replica 2│   │ Replica 3│
        │  (Read)  │   │  (Read)  │   │  (Read)  │
        └──────────┘   └──────────┘   └──────────┘
              ▲              ▲              ▲
              └──────────────┴──────────────┘
                            │
                     Catalog reads
                   (eventual consistency OK)
`,

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'Catalog reads → replicas (stale OK)',
    'Inventory reads → primary (fresh data)',
    'Replication lag typically < 1 second',
    'Replicas provide failover for high availability',
  ],

  quickCheck: {
    question: 'Should inventory checks read from primary or replica?',
    options: [
      'Replica - it\'s faster',
      'Primary - inventory needs strong consistency, replicas may be stale',
      'Either one is fine',
      'Cache only',
    ],
    correctIndex: 1,
    explanation: 'Inventory requires strong consistency to prevent overselling. Replicas can have replication lag (stale data). Always read inventory from primary.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'Handles all writes, source of truth', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy, may be slightly stale', icon: '📋' },
    { title: 'Replication Lag', explanation: 'Delay between write and replica sync', icon: '⏱️' },
  ],
};

const step7: GuidedStep = {
  id: 'catalog-cache-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from database high availability',
    taskDescription: 'Enable database replication with read replicas',
    successCriteria: [
      'Click on Database component',
      'Enable replication',
      'Set replica count to 2+',
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
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click Database, go to Configuration, enable replication',
    level2: 'Set replicas to 2 or more for read scaling and high availability',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Optimize Cache Invalidation
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔄',
  scenario: "Marketing just updated the price on 1000 products for a flash sale. But customers are still seeing old prices!",
  hook: "Your 15-minute cache TTL means price changes take 15 minutes to appear. Flash sale started 10 minutes ago!",
  challenge: "Implement cache invalidation to instantly update changed products.",
  illustration: 'stale-cache',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎊',
  message: 'Congratulations! You built a production-grade catalog cache!',
  achievement: 'Complete caching system with warming, consistency, and invalidation',
  metrics: [
    { label: 'Cache hit rate', after: '98%' },
    { label: 'Catalog freshness', before: '15 minutes', after: '< 1 second' },
    { label: 'System throughput', after: '250K req/sec' },
    { label: 'p99 latency', after: '< 50ms' },
  ],
  nextTeaser: "You've mastered product catalog caching!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation: The Hardest Problem in Computer Science',
  conceptExplanation: `**The Invalidation Challenge:**

Phil Karlton: "There are only two hard things in Computer Science: cache invalidation and naming things."

**The Problem:**
- Catalog cached with 15-min TTL
- Price changes must appear immediately
- Can't wait 15 minutes for TTL expiry

**Solution Strategies:**

**1. Write-Through + Invalidate:**
   - On product update: Write to DB, invalidate cache key
   - Next read = cache miss, fetch fresh data
   - Simple, but brief inconsistency window

**2. Write-Through + Update:**
   - On product update: Write to DB AND update cache
   - Cache always current
   - Risk: race conditions if concurrent writes

**3. TTL + Event-Driven Invalidation:**
   - Normal: 15-min TTL (for stability)
   - On update: Publish event → invalidate cache
   - Combines TTL safety with event freshness

**4. Versioned Cache Keys:**
   - Cache key includes version: product:123:v5
   - On update: Increment version
   - Old cached data never accessed (new version)
   - No invalidation needed!

**For Product Catalog:**
Use **strategy #3**: TTL + event-driven invalidation
- 15-min TTL (safety net)
- On price/catalog update → invalidate affected keys
- Best of both worlds`,

  whyItMatters: 'Cache invalidation ensures customers see current data while maintaining high performance. Critical for flash sales and price changes.',

  famousIncident: {
    title: 'Amazon Price Glitch',
    company: 'Amazon',
    year: '2014',
    whatHappened: 'Cache invalidation failed during a price update. Some customers saw old prices (lower) for 30 minutes. Amazon honored the old prices - cost them $3M in that hour.',
    lessonLearned: 'Cache invalidation must be reliable. Always have TTL as backup. Monitor invalidation failures.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Flash sale price changes across 100K products',
    howTheyDoIt: 'Uses event-driven invalidation with Apache Kafka. Price update publishes event. Cache service consumes event and invalidates keys. Fallback: 5-min TTL.',
  },

  diagram: `
┌────────────────────────────────────────────────────────┐
│          CACHE INVALIDATION STRATEGIES                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  STRATEGY 1: Invalidate on Write                      │
│                                                        │
│  Admin updates product_123 price                      │
│       │                                                │
│       ▼                                                │
│  ┌──────────┐   1. Write    ┌──────────┐             │
│  │   App    │ ────────────→ │ Database │             │
│  └────┬─────┘               └──────────┘             │
│       │ 2. Invalidate                                 │
│       ▼                                                │
│  ┌──────────┐                                         │
│  │  Cache   │ ← DEL product:123                       │
│  └──────────┘                                         │
│                                                        │
│  Next customer read = cache miss, fetch fresh         │
│                                                        │
│  ───────────────────────────────────────────────       │
│                                                        │
│  STRATEGY 2: TTL + Event Invalidation (BEST)         │
│                                                        │
│  Admin updates product                                │
│       │                                                │
│       ▼                                                │
│  ┌──────────┐   Write     ┌──────────┐               │
│  │   App    │ ──────────→ │ Database │               │
│  └────┬─────┘             └──────────┘               │
│       │ Publish event                                 │
│       ▼                                                │
│  ┌──────────┐                                         │
│  │  Kafka   │ ───→ Cache Service → DEL cache key     │
│  └──────────┘                                         │
│                                                        │
│  Fallback: 15-min TTL expires stale data             │
│                                                        │
└────────────────────────────────────────────────────────┘`,

  keyPoints: [
    'Cache invalidation is hard - plan carefully',
    'Use TTL + event-driven invalidation (best of both)',
    'Invalidate on writes for critical data (price, inventory)',
    'TTL is safety net if invalidation fails',
    'Monitor invalidation success rate',
  ],

  quickCheck: {
    question: 'Why keep TTL even with event-driven invalidation?',
    options: [
      'TTL is not needed with events',
      'TTL is a safety net - if event fails, TTL eventually expires stale data',
      'TTL makes cache faster',
      'Events don\'t work without TTL',
    ],
    correctIndex: 1,
    explanation: 'Events can fail (network issue, bug). TTL ensures stale data is eventually removed even if invalidation fails. Defense in depth.',
  },

  keyConcepts: [
    { title: 'Cache Invalidation', explanation: 'Removing stale data from cache', icon: '🗑️' },
    { title: 'Event-Driven', explanation: 'Trigger invalidation via events/messages', icon: '📡' },
    { title: 'Defense in Depth', explanation: 'Multiple safety mechanisms (TTL + events)', icon: '🛡️' },
  ],
};

const step8: GuidedStep = {
  id: 'catalog-cache-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fresh cached data',
    taskDescription: 'Understand cache invalidation (implementation in Python code)',
    successCriteria: [
      'Cache invalidation is implemented in application code',
      'In your App Server, you would:',
      '  1. On product update: Write to DB',
      '  2. Publish invalidation event or directly invalidate cache key',
      '  3. Keep TTL as backup (15 min)',
      'Architecture already supports this - understand the pattern',
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
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Cache invalidation is a code pattern, not a new component',
    level2: 'Your architecture supports invalidation - App Server can delete/update cache keys on product changes',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const productCatalogCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'product-catalog-cache-guided',
  problemTitle: 'Build Product Catalog Cache - A Caching Masterclass',

  requirementsPhase: productCatalogCacheRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Catalog Browsing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can browse product catalog with low latency',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Product Search Performance',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Search queries return results within latency budget',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Inventory Accuracy',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Inventory checks reflect recent updates (strong consistency)',
      traffic: { type: 'mixed', rps: 600, readRps: 500, writeRps: 100 },
      duration: 60,
      passCriteria: { maxErrorRate: 0, maxStaleness: 5 },
    },
    {
      name: 'Cache Warming Effectiveness',
      type: 'functional',
      requirement: 'FR-4',
      description: 'System handles cold start with cache warming',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 10,
      coldStart: true,
      passCriteria: { minCacheHitRate: 0.85, maxP99Latency: 100 },
    },
    {
      name: 'NFR-P1: High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K read RPS with p99 < 50ms',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Flash Sale Burst',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 10x traffic spike (flash sale scenario)',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Cache Cluster Failure',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System survives cache failure and recovers',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxErrorRate: 0.2 },
    },
    {
      name: 'NFR-C1: Cache Hit Rate',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Maintain > 95% cache hit rate for cost efficiency',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 120,
      passCriteria: { minCacheHitRate: 0.95, maxP99Latency: 50 },
    },
  ] as TestCase[],
};

export function getProductCatalogCacheGuidedTutorial(): GuidedTutorial {
  return productCatalogCacheGuidedTutorial;
}

export default productCatalogCacheGuidedTutorial;
