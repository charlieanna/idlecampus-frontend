import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Pricing Engine Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches pricing system design concepts
 * while building a dynamic pricing engine with caching.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-7: Scale with NFRs (cache, consistency, flash sales)
 *
 * Key Concepts:
 * - Dynamic pricing algorithms
 * - Price consistency and cache invalidation
 * - Flash sale handling and rate limiting
 * - Write-through vs write-behind caching
 * - Price change propagation
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const pricingEngineRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a dynamic pricing engine with caching for an e-commerce platform",

  interviewer: {
    name: 'David Martinez',
    role: 'Principal Engineer at DynamicPrice Systems',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-pricing',
      category: 'functional',
      question: "What's the main purpose of this pricing engine? What does it need to do?",
      answer: "The pricing engine needs to:\n\n1. **Calculate prices dynamically** - Adjust product prices based on demand, inventory, competitor prices, time of day, etc.\n2. **Serve price queries** - Return current prices for products quickly (<50ms)\n3. **Update prices** - Allow price changes from pricing algorithms or manual overrides\n4. **Handle flash sales** - Support temporary price drops for limited-time sales\n5. **Maintain consistency** - Ensure all users see the same price at the same time",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Pricing is critical - inconsistent prices destroy customer trust",
    },
    {
      id: 'dynamic-pricing-logic',
      category: 'functional',
      question: "How does dynamic pricing work? What factors affect the price?",
      answer: "Pricing algorithms consider:\n1. **Demand** - High demand = higher price (surge pricing)\n2. **Inventory** - Low stock = higher price, excess stock = lower price\n3. **Time** - Peak hours, day of week, seasonal patterns\n4. **Competition** - Match or beat competitor prices\n5. **User segment** - Premium members get discounts\n\nPrices are recalculated periodically (every 5-15 minutes) and on specific triggers (flash sale starts, inventory drops below threshold).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Dynamic pricing is algorithmic - it needs data inputs and periodic recalculation",
    },
    {
      id: 'flash-sales',
      category: 'functional',
      question: "What happens during a flash sale? How do prices change?",
      answer: "Flash sales are time-limited discounts:\n1. **Start time** - Price drops to flash sale price (e.g., 50% off)\n2. **Duration** - Sale lasts 1-6 hours\n3. **End time** - Price returns to normal\n4. **Inventory limits** - Often 'only 100 units at this price'\n\nCritical: Price changes must propagate instantly to all users. If some users see old price while others see new price, we'll have angry customers!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Flash sales create massive traffic spikes and require instant price updates",
    },
    {
      id: 'price-consistency',
      category: 'functional',
      question: "What if two users see different prices for the same product at the same time?",
      answer: "That would be a DISASTER! Price consistency is critical:\n- If User A sees $100 and User B sees $80 for the same product at the same time, trust is broken\n- When a price changes, ALL users must see the new price within seconds\n- Price in cart must match price at checkout (or we notify user of change)\n\nThis is a consistency guarantee we MUST enforce.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Price consistency is non-negotiable - it's a trust issue",
    },
    {
      id: 'price-history',
      category: 'clarification',
      question: "Do we need to track price history for analytics or price tracking?",
      answer: "Yes, for compliance and analytics:\n1. **Audit trail** - Track when prices changed and why\n2. **Analytics** - Understand how pricing affects sales\n3. **Legal** - Some jurisdictions require price history\n\nBut this can be async - doesn't need to block price queries.",
      importance: 'important',
      insight: "Price history is important but can be handled asynchronously",
    },
    {
      id: 'cache-ttl',
      category: 'clarification',
      question: "How long can prices be cached? When must they be refreshed?",
      answer: "Cache strategy depends on price type:\n1. **Regular prices** - Can cache for 5-15 minutes (TTL: 300-900s)\n2. **Flash sale prices** - Must invalidate cache immediately when sale starts/ends\n3. **User-specific prices** - Cache per user segment, shorter TTL (60s)\n\nKey: Balance freshness with performance. Stale prices = lost revenue or angry customers.",
      importance: 'critical',
      insight: "Different price types need different caching strategies",
    },

    // SCALE & NFRs
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many price queries per second?",
      answer: "500 million product views per day = ~5,800 queries/sec average. During flash sales, it spikes to 50,000 queries/sec for hot items.",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,800 reads/sec",
        result: "~5,800 reads/sec (50K at flash sale peak)",
      },
      learningPoint: "Heavily read-dominated - caching is essential",
    },
    {
      id: 'throughput-updates',
      category: 'throughput',
      question: "How many price updates per second?",
      answer: "Pricing algorithms update ~10 million prices per day (recalculation every 15 min). That's ~115 writes/sec average. Flash sales trigger instant updates for specific products.",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 115 writes/sec",
        result: "~115 writes/sec (spikes during flash sales)",
      },
      learningPoint: "Read-heavy workload (50:1 ratio) - optimize for reads",
    },
    {
      id: 'flash-sale-burst',
      category: 'burst',
      question: "What happens when a flash sale starts on a popular product?",
      answer: "Traffic EXPLODES:\n- 100,000+ users hit refresh simultaneously\n- 50,000 queries/sec on that product's price\n- Cache must serve requests (can't hit database)\n- Price must update instantly for all users\n\nThis is the ultimate stress test for the pricing engine.",
      importance: 'critical',
      insight: "Flash sales are cache stampede scenarios - must handle gracefully",
    },
    {
      id: 'latency-sla',
      category: 'latency',
      question: "How fast must price queries respond?",
      answer: "p99 < 50ms. Slow pricing = slow product pages = lost sales. Users expect instant page loads.",
      importance: 'critical',
      learningPoint: "Price is on critical path for product pages - must be fast",
    },
    {
      id: 'consistency-model',
      category: 'consistency',
      question: "Is it OK if some users see stale prices for a few seconds during an update?",
      answer: "For regular price updates: Eventual consistency is OK (< 30 seconds stale)\nFor flash sales: NO - must invalidate cache immediately. All users must see flash price within 1-2 seconds.\n\nThis is a business requirement: inconsistent flash sale prices = customer complaints and lost trust.",
      importance: 'critical',
      learningPoint: "Different consistency requirements for different scenarios",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-pricing', 'flash-sales', 'price-consistency', 'flash-sale-burst'],
  criticalFRQuestionIds: ['core-pricing', 'flash-sales', 'price-consistency'],
  criticalScaleQuestionIds: ['throughput-queries', 'flash-sale-burst', 'latency-sla'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Calculate prices dynamically',
      description: 'Pricing algorithms calculate prices based on demand, inventory, time, competition',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Serve price queries fast',
      description: 'Return current product prices in <50ms for product page rendering',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support flash sales',
      description: 'Handle time-limited price drops with instant price updates',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Maintain price consistency',
      description: 'All users see the same price at the same time - no stale prices',
      emoji: '🔒',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Track price history',
      description: 'Audit trail of price changes for analytics and compliance',
      emoji: '📜',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '10 million price updates',
    readsPerDay: '500 million price queries',
    peakMultiplier: 10,
    readWriteRatio: '50:1',
    calculatedWriteRPS: { average: 115, peak: 1000 },
    calculatedReadRPS: { average: 5800, peak: 50000 },
    maxPayloadSize: '~100 bytes (price data)',
    storagePerRecord: '~50 bytes (price), ~200 bytes (history)',
    redirectLatencySLA: 'p99 < 50ms (price queries)',
    createLatencySLA: 'p99 < 100ms (price updates)',
  },

  architecturalImplications: [
    'Read-heavy (50:1) → Aggressive caching required',
    '50K reads/sec at flash sale peak → Distributed cache essential',
    'Price consistency → Cache invalidation strategy critical',
    'Flash sales → Instant cache updates, handle cache stampede',
    'Price history → Async writes to separate storage',
  ],

  outOfScope: [
    'A/B testing different prices',
    'Personalized pricing per user',
    'Multi-currency support',
    'Tax calculation',
    'Discount codes and coupons',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple pricing service that calculates and serves prices. Then we'll add caching, handle flash sales, and ensure consistency. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Pricing Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '💰',
  scenario: "Welcome to DynamicPrice Systems! You've been hired to build a pricing engine.",
  hook: "Your first customer wants to see product prices on their website.",
  challenge: "Set up the basic connection so price queries can reach your pricing service.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Pricing service is online!',
  achievement: 'Clients can now query product prices',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the service is empty - no pricing logic yet!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Pricing Service',
  conceptExplanation: `A **Pricing Service** is a microservice dedicated to price calculations and queries.

When a user views a product page:
1. The page needs the current price
2. It sends a request to the Pricing Service
3. Pricing Service calculates/retrieves the price
4. Returns price to display

This separation allows pricing logic to evolve independently from other services.`,

  whyItMatters: 'Pricing is complex and changes frequently. A dedicated service allows pricing teams to innovate without touching product catalog or checkout code.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Dynamic pricing across 500M products',
    howTheyDoIt: 'Uses a dedicated pricing service that recalculates millions of prices continuously. Pricing algorithms run separately from product catalog.',
  },

  keyPoints: [
    'Pricing Service handles all price calculations and queries',
    'Clients (web, mobile) query the service for current prices',
    'Decouples pricing logic from other services',
    'Enables pricing teams to iterate on algorithms independently',
  ],

  interviewTip: 'In interviews, start with simple client-server architecture. Show you can make it work before adding complexity.',
};

const step1: GuidedStep = {
  id: 'pricing-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for FR-2: Serve price queries',
    taskDescription: 'Add a Client and Pricing Service (App Server), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents web/mobile apps querying prices', displayName: 'Client' },
      { type: 'app_server', reason: 'Pricing Service that handles price logic', displayName: 'Pricing Service' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server (Pricing Service) component added',
      'Client connected to Pricing Service',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Pricing Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "The pricing service is connected, but it doesn't know how to calculate prices!",
  hook: "A client requested the price for product #123 and got an error.",
  challenge: "Write the pricing algorithm to calculate and return prices.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Pricing logic works!',
  achievement: 'Your service can now calculate and serve product prices',
  metrics: [
    { label: 'Pricing algorithm', after: 'Implemented' },
    { label: 'Can serve queries', after: '✓' },
  ],
  nextTeaser: "But when the server restarts, all prices are lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Implementing Dynamic Pricing Algorithms',
  conceptExplanation: `Pricing algorithms calculate prices based on multiple factors:

**Simple formula**:
\`\`\`
price = base_price × demand_multiplier × inventory_multiplier
\`\`\`

**Factors:**
- **Base price**: Starting price from product catalog
- **Demand multiplier**: 1.0-2.0 based on recent views/purchases
- **Inventory multiplier**: 0.7-1.3 based on stock levels
- **Time multiplier**: Peak hours vs off-hours

For now, store prices in memory. We'll add persistence next!`,

  whyItMatters: 'Dynamic pricing can increase revenue 10-25% compared to fixed pricing. Airlines and hotels have used it for decades.',

  famousIncident: {
    title: 'Uber Surge Pricing Backlash',
    company: 'Uber',
    year: '2014',
    whatHappened: 'During a snowstorm in NYC, Uber\'s surge pricing reached 8x normal rates. Users were furious about $200 rides that normally cost $25.',
    lessonLearned: 'Dynamic pricing is powerful but must be transparent and have caps. Algorithms need business rules to prevent extreme prices.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Repricing 80M+ products daily',
    howTheyDoIt: 'Uses ML models that consider 15+ factors: competitor prices, demand forecasts, inventory levels, margins, conversion rates, etc.',
  },

  keyPoints: [
    'Start with simple formulas (base_price × multipliers)',
    'Consider demand, inventory, time, and competition',
    'Store current prices in memory for now',
    'Implement API: GET /price/{product_id}',
  ],

  quickCheck: {
    question: 'Why use dynamic pricing instead of fixed prices?',
    options: [
      'It\'s easier to implement',
      'Maximize revenue by adjusting to demand and supply',
      'Customers prefer changing prices',
      'Fixed prices don\'t work',
    ],
    correctIndex: 1,
    explanation: 'Dynamic pricing maximizes revenue: charge more when demand is high or supply is low, discount when inventory is excess.',
  },

  keyConcepts: [
    { title: 'Base Price', explanation: 'Starting price from product catalog', icon: '💵' },
    { title: 'Demand Multiplier', explanation: 'Adjust based on popularity', icon: '📈' },
    { title: 'Inventory Multiplier', explanation: 'Adjust based on stock levels', icon: '📦' },
  ],
};

const step2: GuidedStep = {
  id: 'pricing-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Calculate prices, FR-2: Serve price queries',
    taskDescription: 'Implement pricing algorithm in Python code',
    successCriteria: [
      'Click on Pricing Service (App Server)',
      'Assign API: GET /api/v1/price/{product_id}',
      'Open Python tab',
      'Implement calculate_price() function',
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
    level1: 'Click on the App Server, go to APIs tab and assign GET /api/v1/price/{product_id}',
    level2: 'Switch to Python tab. Implement calculate_price() with demand and inventory multipliers',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/price/{product_id}'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Price Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your pricing service crashed at 3 AM and restarted...",
  hook: "When it came back, ALL prices were gone! Every product showed $0. Customers are confused.",
  challenge: "Add a database to persist prices so they survive restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Prices are now persistent!',
  achievement: 'Price data survives server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But price queries are slow... every request hits the database!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Storing Prices in a Database',
  conceptExplanation: `In-memory prices disappear on restart. A **database** provides durability.

For pricing, we need tables:
- \`prices\`: product_id, current_price, last_updated
- \`price_history\`: product_id, price, changed_at, reason

When a price is calculated:
1. Update \`prices\` table with new price
2. Insert into \`price_history\` for audit trail
3. Return price to client

Database ensures prices survive crashes and provides audit history.`,

  whyItMatters: 'Without persistence, pricing algorithms would recalculate from scratch on every restart. Database is the source of truth.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Dynamic pricing for millions of listings',
    howTheyDoIt: 'Stores current prices in PostgreSQL. Pricing algorithms update prices periodically. Database serves as source of truth between updates.',
  },

  keyPoints: [
    'Database stores current_price and price_history',
    'Pricing service writes calculated prices to DB',
    'Price queries read from DB (for now - caching comes next!)',
    'price_history provides audit trail',
  ],

  quickCheck: {
    question: 'Why store price history in addition to current price?',
    options: [
      'It takes up more space',
      'For analytics, compliance, and debugging pricing issues',
      'Databases require it',
      'It makes queries faster',
    ],
    correctIndex: 1,
    explanation: 'Price history is critical for understanding pricing impact on sales, compliance audits, and debugging why a price changed.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives crashes and restarts', icon: '🛡️' },
    { title: 'Audit Trail', explanation: 'Track all price changes over time', icon: '📜' },
    { title: 'Source of Truth', explanation: 'Database is authoritative for prices', icon: '✅' },
  ],
};

const step3: GuidedStep = {
  id: 'pricing-step-3',
  stepNumber: 3,
  frIndex: 4,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-5: Track price history, All FRs need persistent storage',
    taskDescription: 'Add a Database and connect Pricing Service to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store current prices and price history', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Pricing Service connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click Pricing Service, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Fast Price Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million products, and price queries are taking 100-200ms!",
  hook: "Every price query hits the database. Product pages are loading slowly. Customers are complaining!",
  challenge: "Add a cache to serve prices in <10ms without hitting the database.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Price queries are now lightning fast!',
  achievement: 'Cache serves 95% of queries without database hits',
  metrics: [
    { label: 'Price query latency', before: '150ms', after: '5ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'Database load', before: '5,800 req/s', after: '290 req/s' },
  ],
  nextTeaser: "But what happens when prices change? Users might see stale prices!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Key to Fast Pricing',
  conceptExplanation: `At 5,800 queries/sec, hitting the database for every price lookup is too slow.

**Cache-aside pattern**:
1. Client queries price
2. Check cache: \`GET price:product_123\`
3. If cache hit → return instantly (< 5ms)
4. If cache miss → query DB → store in cache → return

For pricing, we cache:
- \`price:product_id → current_price\`
- TTL: 300 seconds (5 minutes)

This reduces database load by 95% and makes queries 30x faster!`,

  whyItMatters: 'At peak (50K queries/sec during flash sales), no database can handle that load. Caching is essential.',

  famousIncident: {
    title: 'Best Buy Dynamic Pricing Cache Bug',
    company: 'Best Buy',
    year: '2016',
    whatHappened: 'Best Buy\'s in-store prices were lower than online prices due to stale cache. Customers found they could price-match in store for better deals. Led to a cache invalidation policy overhaul.',
    lessonLearned: 'Stale price caches cause real business problems. Cache invalidation strategy is critical.',
    icon: '🐛',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Serving surge pricing to millions of riders',
    howTheyDoIt: 'Uses Redis to cache current surge multipliers by location. Updates cache every 30 seconds. Invalidates immediately when surge ends.',
  },

  diagram: `
┌────────┐     ┌─────────────────┐     ┌────────┐     ┌──────────┐
│ Client │ ──▶ │ Pricing Service │ ──▶ │ Redis  │ ──▶ │ Database │
└────────┘     └─────────────────┘     │ Cache  │     └──────────┘
                     │                 └────────┘
                     │                     │
                     │   Cache Hit? ───────┘ (95% of requests)
                     │   Return price instantly!
`,

  keyPoints: [
    'Cache price lookups with Redis (key: price:product_id)',
    'TTL of 300 seconds balances freshness and performance',
    'Cache-aside pattern: check cache first, DB on miss',
    '95% cache hit rate reduces DB load by 20x',
    'Critical: Invalidate cache when prices change!',
  ],

  quickCheck: {
    question: 'What happens if we don\'t invalidate cache when a price changes?',
    options: [
      'Nothing - cache will expire eventually',
      'Users see stale prices until TTL expires (up to 5 min) - bad UX!',
      'Database performance improves',
      'Cache automatically updates',
    ],
    correctIndex: 1,
    explanation: 'Without invalidation, users see old prices until TTL expires. For flash sales, this is unacceptable - must invalidate immediately!',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Price found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Price not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached price expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'pricing-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Serve price queries fast (<50ms)',
    taskDescription: 'Add Redis cache between Pricing Service and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache prices for fast lookups', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Pricing Service connected to Cache',
      'Cache TTL configured (300 seconds)',
      'Cache strategy set (cache-aside)',
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
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect Pricing Service to Cache. Set TTL to 300 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Implement Cache Invalidation for Price Updates
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "Your pricing algorithm updated 10,000 product prices, but customers still see old prices!",
  hook: "The cache TTL is 5 minutes, so users see stale prices. A flash sale started but half the users still see the old price!",
  challenge: "Implement cache invalidation to update prices instantly when they change.",
  illustration: 'stale-data',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Price consistency achieved!',
  achievement: 'Price changes propagate instantly to all users',
  metrics: [
    { label: 'Price staleness', before: 'Up to 5 min', after: '<2 seconds' },
    { label: 'Consistency', after: '100%' },
  ],
  nextTeaser: "But during flash sales, the system is struggling with the traffic burst!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation: The Hardest Problem in Computer Science',
  conceptExplanation: `**The Problem**: When a price changes, cached value is stale.

**Solutions**:

1. **Write-through cache**:
   - Update DB → Update cache → Return
   - Pro: Cache always fresh
   - Con: Higher latency

2. **Write-behind cache**:
   - Update cache → Return → Update DB async
   - Pro: Faster updates
   - Con: Risk of data loss

3. **Invalidation on write**:
   - Update DB → Invalidate cache → Next read repopulates
   - Pro: Simpler, safer
   - Con: Cache miss after every update

For pricing: **Write-through** is best - consistency is critical!

**Implementation**:
\`\`\`python
def update_price(product_id, new_price):
    # 1. Update database
    db.update("prices", product_id, new_price)
    # 2. Update cache
    cache.set(f"price:{product_id}", new_price)
    # 3. Publish event for other services
    publish("price.updated", product_id, new_price)
\`\`\``,

  whyItMatters: 'Phil Karlton: "There are only two hard things in Computer Science: cache invalidation and naming things." Get this wrong and users see inconsistent prices.',

  famousIncident: {
    title: 'Amazon Price Glitch',
    company: 'Amazon',
    year: '2014',
    whatHappened: 'A cache invalidation bug caused some users to see prices from hours earlier. During a lightning deal, some users checked out at the old (higher) price while the deal was live. Amazon honored the lower prices retroactively.',
    lessonLearned: 'Cache invalidation bugs directly impact revenue and customer trust. Test invalidation paths as carefully as read paths.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Flash sales with instant price updates',
    howTheyDoIt: 'Uses write-through caching with Redis pub/sub. When a price updates, it writes to DB + cache, then publishes event. All pricing service instances invalidate local caches.',
  },

  diagram: `
Price Update Flow (Write-Through):
────────────────────────────────
1. Update request received
         │
         ▼
2. Write to Database (source of truth)
         │
         ▼
3. Update Cache (invalidate old value)
         │
         ▼
4. Publish event (notify other services)
         │
         ▼
5. Return success

Next price query:
  → Check cache → Cache hit! → Return fresh price
`,

  keyPoints: [
    'Write-through caching: update DB and cache together',
    'Ensures cache is never stale after updates',
    'Critical for flash sales - price changes propagate instantly',
    'Publish events to notify other services of price changes',
    'Test invalidation as carefully as reads!',
  ],

  quickCheck: {
    question: 'Why use write-through instead of write-behind for pricing?',
    options: [
      'Write-through is faster',
      'Price consistency is critical - can\'t risk stale cache',
      'Write-behind doesn\'t work with Redis',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Write-through guarantees cache is updated when DB is updated. For pricing, consistency is more important than a few milliseconds of latency.',
  },

  keyConcepts: [
    { title: 'Write-Through', explanation: 'Update DB and cache together', icon: '🔄' },
    { title: 'Cache Invalidation', explanation: 'Remove stale data from cache', icon: '🗑️' },
    { title: 'Pub/Sub', explanation: 'Notify other services of changes', icon: '📢' },
  ],
};

const step5: GuidedStep = {
  id: 'pricing-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Maintain price consistency (no stale prices)',
    taskDescription: 'Update code to implement write-through cache invalidation',
    successCriteria: [
      'Click on Pricing Service',
      'Go to Python tab',
      'Update update_price() function to use write-through pattern',
      'Update DB, then update cache, then publish event',
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
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Pricing Service → Python tab → Find update_price() function',
    level2: 'Implement write-through: db.update() → cache.set() → publish_event()',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Message Queue for Flash Sale Events
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚡',
  scenario: "A flash sale just started on the new iPhone! 100,000 users are hitting refresh!",
  hook: "Your pricing service is getting 50,000 requests/second. Cache is being overwhelmed. Some requests are timing out!",
  challenge: "Add a message queue to handle flash sale price updates reliably.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Flash sales now handled smoothly!',
  achievement: 'Message queue buffers price updates during traffic spikes',
  metrics: [
    { label: 'Flash sale handling', after: 'Reliable' },
    { label: 'Update failures', before: '5%', after: '0%' },
  ],
  nextTeaser: "But we're still running a single pricing service instance!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Handling Flash Sale Events',
  conceptExplanation: `**Flash sale problem**: When a flash sale starts, we need to:
1. Update prices instantly
2. Notify all systems (product catalog, checkout, etc.)
3. Handle 100K+ simultaneous price queries

**Message Queue solution**:
- Flash sale events published to queue
- Workers consume events and update prices
- Decouples event production from processing
- Buffers bursts - won't drop events

**Flow**:
1. Flash sale scheduled → Event: \`flash_sale.start\`
2. Queue receives event
3. Pricing workers consume event
4. Workers update prices in DB + cache
5. Price changes propagate instantly

Queue ensures no events are lost during traffic spikes!`,

  whyItMatters: 'Flash sales cause extreme traffic bursts. Direct API calls would overwhelm the system. Queue provides a buffer.',

  famousIncident: {
    title: 'Alibaba Singles Day (11/11) Flash Sales',
    company: 'Alibaba',
    year: '2023',
    whatHappened: 'Alibaba processed $156 billion in sales on Singles Day. Peak was 1.4 million orders per second! They used massive message queue infrastructure (Apache RocketMQ) to handle the load.',
    lessonLearned: 'Message queues are essential for flash sale events. They provide buffering, ordering guarantees, and fault tolerance.',
    icon: '🎊',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Prime Day lightning deals',
    howTheyDoIt: 'Uses SQS + SNS for flash sale events. When a lightning deal starts, event is published. Price workers consume and update prices. Checkout service subscribes to price change events.',
  },

  diagram: `
Flash Sale Start Event Flow:
────────────────────────────

Admin triggers flash sale
         │
         ▼
   ┌──────────────┐
   │ Message Queue│ ◀── Event: {product_id: 123,
   │  (SQS/Kafka) │              sale_price: $50,
   └──────┬───────┘              start_at: ...}
         │
         ├──▶ Worker 1 ──▶ Update DB + Cache
         ├──▶ Worker 2 ──▶ Update DB + Cache
         └──▶ Worker 3 ──▶ Update DB + Cache
                │
                ▼
        Users see new price instantly!
`,

  keyPoints: [
    'Message queue buffers flash sale events',
    'Workers consume events and update prices',
    'Provides fault tolerance - events aren\'t lost',
    'Decouples flash sale triggers from price updates',
    'Enables parallel processing with multiple workers',
  ],

  quickCheck: {
    question: 'Why use a message queue instead of direct API calls for flash sale events?',
    options: [
      'Queues are faster',
      'Queues buffer bursts and ensure no events are lost during traffic spikes',
      'Direct API calls don\'t work',
      'Queues are cheaper',
    ],
    correctIndex: 1,
    explanation: 'Queues provide buffering and durability. During flash sale start, thousands of events fire simultaneously. Queue ensures all are processed.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async events', icon: '📬' },
    { title: 'Flash Sale Event', explanation: 'Trigger for instant price updates', icon: '⚡' },
    { title: 'Worker', explanation: 'Background process that updates prices', icon: '⚙️' },
  ],
};

const step6: GuidedStep = {
  id: 'pricing-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Support flash sales (instant price updates)',
    taskDescription: 'Add a Message Queue for flash sale events',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle flash sale events reliably', displayName: 'SQS / Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Pricing Service connected to Message Queue',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Message Queue (SQS/Kafka) component onto the canvas',
    level2: 'Connect Pricing Service to Message Queue for flash sale event processing',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer and Scale Horizontally
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single pricing service instance is at 100% CPU during flash sales!",
  hook: "Users are getting timeout errors. 50K queries/sec is too much for one server.",
  challenge: "Add a load balancer and scale to multiple pricing service instances.",
  illustration: 'server-overload',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Pricing service can now handle massive scale!',
  achievement: 'Multiple instances share the load during flash sales',
  metrics: [
    { label: 'Service instances', before: '1', after: '5+' },
    { label: 'Capacity', before: '5K req/s', after: '50K+ req/s' },
    { label: 'Flash sale success rate', before: '85%', after: '99.9%' },
  ],
  nextTeaser: "You've built a production-ready pricing engine!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: Handling Flash Sale Traffic',
  conceptExplanation: `**The Problem**: 50,000 queries/sec during flash sales

**Vertical scaling** (bigger server):
- Limited - can't handle 50K req/s on one machine
- Expensive - large instances cost 10x more
- Single point of failure

**Horizontal scaling** (more servers):
- Add 5-10 pricing service instances
- Load balancer distributes queries
- Each instance shares the load (10K req/s each)
- No single point of failure

**Architecture**:
\`\`\`
Client → Load Balancer → [Instance 1, 2, 3, 4, 5]
                             ↓
                        Shared Cache + DB
\`\`\`

All instances share the same Redis cache and database.`,

  whyItMatters: 'Flash sales create unpredictable traffic spikes. Auto-scaling lets you handle 50K req/s during sales and scale down to 2 instances at night.',

  realWorldExample: {
    company: 'Grab (Southeast Asia)',
    scenario: 'Surge pricing during rush hour',
    howTheyDoIt: 'Auto-scales pricing service from 10 instances (normal) to 100+ during evening rush hour across multiple cities.',
  },

  famousIncident: {
    title: 'Target 2013 Black Friday Crash',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target\'s website crashed on Black Friday due to insufficient server capacity. They didn\'t have auto-scaling. Lost millions in sales.',
    lessonLearned: 'Design for horizontal scaling from day 1. Flash sales and Black Friday are predictable - prepare your architecture.',
    icon: '💥',
  },

  diagram: `
                    ┌─────────────────────┐
                    │   Load Balancer     │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
  ┌──────────┐          ┌──────────┐          ┌──────────┐
  │ Pricing  │          │ Pricing  │          │ Pricing  │
  │Service #1│          │Service #2│          │Service #3│
  └────┬─────┘          └────┬─────┘          └────┬─────┘
       │                     │                     │
       └─────────────────────┴─────────────────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
            ┌──────────┐          ┌──────────┐
            │  Redis   │          │ Database │
            │  Cache   │          │          │
            └──────────┘          └──────────┘
`,

  keyPoints: [
    'Add load balancer between client and pricing service',
    'Scale to 5+ instances to handle 50K req/s',
    'All instances share same cache and database',
    'Auto-scale: more instances during flash sales, fewer at night',
    'Stateless services are easy to scale',
  ],

  quickCheck: {
    question: 'Why do all pricing service instances share the same cache?',
    options: [
      'It\'s cheaper',
      'Ensures all instances see consistent prices - no stale data',
      'Each instance needs its own cache',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Shared cache ensures consistency. If each instance had its own cache, they could show different prices for the same product!',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across instances', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Stateless Service', explanation: 'No local state - easy to scale', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'pricing-step-7',
  stepNumber: 7,
  frIndex: 1,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from scaling to handle flash sale traffic',
    taskDescription: 'Add Load Balancer and scale Pricing Service to multiple instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across pricing instances', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to Pricing Service',
      'Pricing Service scaled to 5+ instances',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag Load Balancer between Client and Pricing Service. Reconnect: Client → LB → Pricing Service',
    level2: 'Click Pricing Service → Configuration → Set instances to 5 or more',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server', config: { instances: 5 } },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const pricingEngineCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'pricing-engine-cache',
  title: 'Design a Pricing Engine with Caching',
  description: 'Build a dynamic pricing system that handles flash sales and maintains price consistency',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '💰',
    hook: "You've been hired as Lead Engineer at DynamicPrice Systems!",
    scenario: "Your mission: Build a pricing engine that can dynamically adjust prices for millions of products, handle flash sales with massive traffic spikes, and ensure all users see consistent prices.",
    challenge: "Can you design a system that serves 50,000 price queries/second during flash sales while maintaining sub-50ms latency and perfect price consistency?",
  },

  requirementsPhase: pricingEngineRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7],

  concepts: [
    'Dynamic Pricing Algorithms',
    'Cache-Aside Pattern',
    'Cache Invalidation (Write-Through)',
    'Price Consistency',
    'Flash Sale Handling',
    'Message Queues for Events',
    'Horizontal Scaling',
    'Load Balancing',
    'Price History & Audit Trail',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Cache replication)',
    'Chapter 7: Transactions (Price updates)',
    'Chapter 8: Distributed Systems (Consistency)',
    'Chapter 11: Stream Processing (Price events)',
  ],
};

export default pricingEngineCacheGuidedTutorial;
