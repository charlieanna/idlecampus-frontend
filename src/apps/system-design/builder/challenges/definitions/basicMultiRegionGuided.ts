import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Basic Multi-Region Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching multi-region deployment concepts:
 * - Regional deployment strategies
 * - Data replication across regions
 * - Latency-based routing
 * - Cross-region failover
 * - Global load balancing
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build single-region system (FRs satisfied!)
 * Steps 4-8: Expand to multi-region (NFRs: latency, availability, disaster recovery)
 *
 * Key Pedagogy: First make it WORK in one region, then make it GLOBAL
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const basicMultiRegionRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a multi-region system for a global e-commerce platform",

  interviewer: {
    name: 'Alex Rivera',
    role: 'VP of Infrastructure',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main user operations in this e-commerce system?",
      answer: "Users need to:\n1. **Browse product catalog** - View available products\n2. **Place orders** - Purchase items\n3. **View order history** - See past purchases\n4. **Check inventory** - See product availability",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-4',
      learningPoint: "Start with single-region functionality before thinking global",
    },
    {
      id: 'data-consistency',
      category: 'functional',
      question: "If a product sells out in the US, should users in Europe immediately see it's unavailable?",
      answer: "Not necessarily immediately, but within a few seconds is acceptable. Strong consistency would be too slow for global users. Eventual consistency with conflict resolution is fine for inventory.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Global systems often trade strong consistency for availability and low latency",
    },

    // IMPORTANT - Clarifications
    {
      id: 'order-processing',
      category: 'clarification',
      question: "Can users place orders in any region, or only in their home region?",
      answer: "Users should be able to place orders from anywhere in the world. A US customer traveling to Asia should still be able to order and see their data.",
      importance: 'important',
      insight: "This requires cross-region data replication and routing",
    },
    {
      id: 'payment-processing',
      category: 'clarification',
      question: "Do we need to handle payment processing in this design?",
      answer: "No, assume payments are handled by a third-party service. We just need to record completed orders.",
      importance: 'nice-to-have',
      insight: "Keeping scope focused on multi-region infrastructure",
    },

    // SCOPE
    {
      id: 'scope-regions',
      category: 'scope',
      question: "Which regions should we support?",
      answer: "Start with three major regions: US-East, Europe (EU-West), and Asia-Pacific (AP-Southeast). This covers the major global markets.",
      importance: 'critical',
      insight: "Three regions demonstrate the multi-region patterns without overwhelming complexity",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-global',
      category: 'throughput',
      question: "How many global users do we need to support?",
      answer: "500 million users globally, with 50 million daily active users spread across regions",
      importance: 'critical',
      learningPoint: "User distribution matters for regional capacity planning",
    },
    {
      id: 'throughput-distribution',
      category: 'throughput',
      question: "How are users distributed across regions?",
      answer: "Roughly: 40% US, 35% Europe, 25% Asia-Pacific. Traffic peaks follow local business hours in each region.",
      importance: 'critical',
      calculation: {
        formula: "50M DAU × 40% = 20M US users, 35% = 17.5M EU, 25% = 12.5M APAC",
        result: "Regional capacity must match user distribution",
      },
      learningPoint: "Different regions have different capacity requirements",
    },
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "What's the expected request rate?",
      answer: "About 100,000 requests per second globally at peak, with reads being 80% of traffic",
      importance: 'critical',
      calculation: {
        formula: "100K RPS × 80% reads = 80K read RPS, 20K write RPS",
        result: "Read-heavy workload benefits from regional caching",
      },
      learningPoint: "Read-heavy workloads are perfect for multi-region optimization",
    },

    // 2. LATENCY
    {
      id: 'latency-target',
      category: 'latency',
      question: "What's the acceptable latency for users?",
      answer: "p99 latency should be under 200ms globally. Users in Asia should get the same fast experience as users in the US.",
      importance: 'critical',
      learningPoint: "This is the KEY driver for multi-region: reducing global latency",
    },
    {
      id: 'latency-single-region',
      category: 'latency',
      question: "What would happen if we only had servers in the US?",
      answer: "Users in Asia would experience 250-300ms latency just for the network round-trip, plus processing time. That's too slow. Multi-region deployment is essential.",
      importance: 'critical',
      insight: "Physics forces us to go multi-region for global low latency",
    },

    // 3. AVAILABILITY
    {
      id: 'availability-target',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.99% availability - less than 1 hour downtime per year. A regional outage shouldn't take down the entire platform.",
      importance: 'critical',
      learningPoint: "Multi-region provides disaster recovery",
    },
    {
      id: 'availability-regional-failure',
      category: 'availability',
      question: "What happens if an entire AWS region goes down?",
      answer: "The other regions should continue serving traffic. Users in the failed region should be redirected to the nearest healthy region, even if latency is higher.",
      importance: 'critical',
      insight: "Graceful degradation across regions",
    },

    // 4. DATA
    {
      id: 'data-replication-lag',
      category: 'payload',
      question: "How quickly must data replicate across regions?",
      answer: "Within 5 seconds is acceptable. Users can tolerate seeing slightly stale product data, but orders must be eventually consistent across regions.",
      importance: 'important',
      learningPoint: "Async cross-region replication is usually sufficient",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'data-consistency', 'scope-regions', 'latency-target'],
  criticalFRQuestionIds: ['core-operations', 'data-consistency'],
  criticalScaleQuestionIds: ['throughput-global', 'latency-target', 'availability-target'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can browse product catalog',
      description: 'View available products with details',
      emoji: '🛍️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can place orders',
      description: 'Purchase products and receive confirmation',
      emoji: '🛒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can view order history',
      description: 'See all past purchases',
      emoji: '📜',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can check inventory',
      description: 'See real-time product availability',
      emoji: '📦',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Eventual consistency across regions',
      description: 'Data syncs across regions within 5 seconds',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million (global)',
    writesPerDay: '20 million orders/day',
    readsPerDay: '4 billion page views/day',
    peakMultiplier: 3,
    readWriteRatio: '80:20',
    calculatedWriteRPS: { average: 231, peak: 693 },
    calculatedReadRPS: { average: 46296, peak: 138888 },
    maxPayloadSize: '~10KB catalog response',
    storagePerRecord: '~2KB per order',
    storageGrowthPerYear: '~14TB',
    redirectLatencySLA: 'p99 < 200ms (global)',
    createLatencySLA: 'p99 < 300ms',
  },

  architecturalImplications: [
    '✅ Global users → Multi-region deployment essential',
    '✅ p99 < 200ms globally → Regional data centers required',
    '✅ 80% reads → Aggressive caching in each region',
    '✅ 99.99% availability → Cross-region failover needed',
    '✅ Eventual consistency OK → Async cross-region replication',
    '✅ Regional distribution: 40% US, 35% EU, 25% APAC',
  ],

  outOfScope: [
    'Payment processing (third-party)',
    'Fraud detection',
    'Recommendation engine',
    'More than 3 regions',
  ],

  keyInsight: "First, let's build a working single-region system. Once it works, we'll expand to multiple regions. This is the right way: functionality first, then global distribution.",
};

// =============================================================================
// STEP 1: Build Single-Region Foundation
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏗️',
  scenario: "Welcome to GlobalMart! You're building the next Amazon, starting with the US market.",
  hook: "Your first customer in California is ready to browse products and place an order.",
  challenge: "Build the basic Client → App Server → Database flow in a single region (US-East).",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your single-region system is live!",
  achievement: "US customers can browse and order",
  metrics: [
    { label: 'Region', after: 'US-East' },
    { label: 'Status', after: 'Online' },
  ],
  nextTeaser: "But you need to implement the actual business logic...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Starting Single-Region: The Foundation',
  conceptExplanation: `Before going global, always start with ONE region working perfectly.

**Single-Region Architecture:**
- Client sends requests
- App Server processes business logic
- Database stores persistent data

This is your foundation. Multi-region is just this pattern, replicated!`,

  whyItMatters: 'Master single-region before multi-region complexity. Get functionality right first.',

  keyPoints: [
    'Always start with single-region deployment',
    'Prove functionality works before scaling globally',
    'This pattern repeats in every region',
  ],

  keyConcepts: [
    { title: 'Region', explanation: 'Geographic datacenter location (e.g., US-East)', icon: '🌎' },
    { title: 'App Server', explanation: 'Processes business logic', icon: '🖥️' },
    { title: 'Database', explanation: 'Stores orders and catalog', icon: '💾' },
  ],
};

const step1: GuidedStep = {
  id: 'multi-region-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Build foundation for all FRs',
    taskDescription: 'Add Client, App Server, and Database in US-East region',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server (US-East)' },
      { type: 'database', reason: 'Stores data', displayName: 'Database (US-East)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes data' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the basic three-tier architecture',
    level2: 'Add Client, App Server, and Database, then connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Business Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your servers are connected, but they don't know how to handle catalog browsing or orders!",
  hook: "A customer just tried to view products but got an error.",
  challenge: "Implement the Python code for catalog browsing and order placement.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your e-commerce platform works!",
  achievement: "Users can browse products and place orders",
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'FRs satisfied', after: 'FR-1 through FR-4' },
  ],
  nextTeaser: "But customers in Europe are experiencing 300ms latency...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: E-commerce Logic',
  conceptExplanation: `Your App Server needs handlers for e-commerce operations:

**APIs to implement:**
1. \`GET /api/v1/catalog\` - Return product list
2. \`POST /api/v1/orders\` - Create new order
3. \`GET /api/v1/orders/:userId\` - Get order history

For now, store everything in a single region database.`,

  whyItMatters: 'This is the business logic that will run in EVERY region. Get it right once, deploy everywhere.',

  keyPoints: [
    'Catalog browsing is read-heavy (perfect for caching)',
    'Order placement requires strong consistency',
    'Order history must be accessible globally',
  ],

  quickCheck: {
    question: 'Why is order placement more critical than catalog browsing?',
    options: [
      'Orders involve money - data loss is unacceptable',
      'Orders are more frequent',
      'Orders are more complex',
      'Orders are slower',
    ],
    correctIndex: 0,
    explanation: 'Orders involve financial transactions. Losing an order means losing money and customer trust.',
  },

  keyConcepts: [
    { title: 'Catalog API', explanation: 'Read-heavy, cacheable', icon: '📋' },
    { title: 'Order API', explanation: 'Write-heavy, needs consistency', icon: '✍️' },
    { title: 'Order History', explanation: 'User-specific data', icon: '📜' },
  ],
};

const step2: GuidedStep = {
  id: 'multi-region-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1 to FR-4: Full e-commerce functionality',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server',
      'Assign catalog and order APIs',
      'Open Python tab',
      'Implement get_catalog(), create_order(), and get_order_history()',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Configure APIs in the inspector, then implement handlers in Python tab',
    level2: 'Assign GET /api/v1/catalog, POST /api/v1/orders, GET /api/v1/orders/:userId APIs, then implement the TODOs',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 3: Add Caching for Performance
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your catalog has 1 million products, and every browse hits the database.",
  hook: "Page load times are slow. The database is working hard for data that rarely changes.",
  challenge: "Add a cache to speed up catalog browsing.",
  illustration: 'slow-loading',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Catalog browsing is now instant!",
  achievement: "Cache hit rate: 95%",
  metrics: [
    { label: 'Catalog latency', before: '200ms', after: '10ms' },
    { label: 'DB load', before: '10K RPS', after: '500 RPS' },
  ],
  nextTeaser: "But European users still have 300ms latency - physics is the problem!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Speed Within a Region',
  conceptExplanation: `A cache stores frequently-accessed data in memory for instant retrieval.

**Cache-Aside Pattern:**
1. Check cache first
2. On miss → query database
3. Store result in cache (with TTL)

For product catalogs:
- Catalog changes infrequently
- Browsing is read-heavy
- Perfect for caching!`,

  whyItMatters: 'Caching reduces database load and improves latency within a region. But it doesn\'t solve cross-region latency.',

  famousIncident: {
    title: 'Amazon Prime Day 2018 Cache Failure',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'During Prime Day, an internal cache system failed, causing the product catalog to become unavailable for over an hour. Millions of shoppers couldn\'t browse or purchase.',
    lessonLearned: 'Caching is critical for e-commerce. Always have fallback to database when cache fails.',
    icon: '🛒',
  },

  keyPoints: [
    'Cache sits between App Server and Database',
    'Use TTL to ensure data freshness',
    'Cache dramatically reduces database load',
    'But cache doesn\'t solve geographic distance',
  ],

  quickCheck: {
    question: 'Why doesn\'t caching solve the problem for European users?',
    options: [
      'Cache doesn\'t work across the ocean',
      'The cache is in US-East, so EU users still have 150ms+ network latency to reach it',
      'European users speak different languages',
      'Caching is only for reads',
    ],
    correctIndex: 1,
    explanation: 'Cache improves performance within a region, but network latency to a distant region is physics - you need regional deployments.',
  },

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, DB on miss', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live for cache expiration', icon: '⏰' },
    { title: 'Regional Cache', explanation: 'Cache is in same region as app server', icon: '🌎' },
  ],
};

const step3: GuidedStep = {
  id: 'multi-region-step-3',
  stepNumber: 3,
  frIndex: 0,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-1: Fast catalog browsing (in US)',
    taskDescription: 'Add Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache catalog for fast reads', displayName: 'Redis Cache (US-East)' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Cache', reason: 'Check cache before DB' },
    ],
    successCriteria: [
      'Add Cache component',
      'Connect App Server to Cache',
      'Configure cache strategy (cache-aside) and TTL',
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
    level1: 'Add a Cache component and connect it to the App Server',
    level2: 'Add Redis cache, connect App Server → Cache, then configure cache-aside strategy with TTL',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache', config: { strategy: 'cache-aside', ttl: 300 } },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 4: Deploy Europe Region
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌍',
  scenario: "European customers are complaining! Latency from Europe to US-East is 150ms+ for every request.",
  hook: "Your competitor launched in Europe with local servers and is stealing customers.",
  challenge: "Deploy a second region in Europe (EU-West) with its own infrastructure.",
  illustration: 'global-expansion',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Europe is now online!",
  achievement: "European users experience <50ms latency",
  metrics: [
    { label: 'Regions deployed', before: '1 (US-East)', after: '2 (US-East, EU-West)' },
    { label: 'EU latency', before: '150ms+', after: '<50ms' },
  ],
  nextTeaser: "But how do European users connect to the European region instead of US?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Regional Deployment: Solving the Physics Problem',
  conceptExplanation: `**The Physics Problem:**
Light travels at 300,000 km/s, but:
- US to Europe: ~6,000 km
- Round-trip: 12,000 km
- Theoretical minimum: 40ms (just the light travel time!)
- Real-world with routing: 150ms+

**The Solution: Regional Deployment**
Deploy the SAME infrastructure in multiple regions:
- EU-West: App Server + Database + Cache
- Same code, different geographic location

This cuts latency from 150ms → 10ms for European users!`,

  whyItMatters: 'You cannot cheat physics. For global low latency, you need infrastructure close to users.',

  famousIncident: {
    title: 'Shopify Multi-Region Expansion',
    company: 'Shopify',
    year: '2019',
    whatHappened: 'Shopify deployed regional infrastructure in Europe and Asia to reduce latency for international merchants. Latency dropped 70% for EU merchants, significantly improving checkout conversion rates.',
    lessonLearned: 'Every 100ms of latency costs ~1% in sales. Multi-region deployment directly impacts revenue.',
    icon: '🛍️',
  },

  keyPoints: [
    'Deploy identical infrastructure in each region',
    'Reduces latency from 150ms+ to <50ms',
    'Each region has its own: App Server, Database, Cache',
    'Next challenge: routing users to the right region',
  ],

  diagram: `
US-East Region                    EU-West Region
┌─────────────────┐              ┌─────────────────┐
│ App Server (US) │              │ App Server (EU) │
│      ↓          │              │      ↓          │
│ Database (US)   │              │ Database (EU)   │
│      ↓          │              │      ↓          │
│   Cache (US)    │              │   Cache (EU)    │
└─────────────────┘              └─────────────────┘
       ↑                                  ↑
       │                                  │
  US Users                           EU Users
  10ms latency                       10ms latency
`,

  quickCheck: {
    question: 'Why does regional deployment dramatically reduce latency?',
    options: [
      'Regional servers are faster',
      'Regional networks are better',
      'Data travels a much shorter distance - physics!',
      'Regional caching is better',
    ],
    correctIndex: 2,
    explanation: 'Physics! Data traveling 100km takes much less time than 6,000km. Regional deployment puts servers close to users.',
  },

  keyConcepts: [
    { title: 'Regional Deployment', explanation: 'Same infrastructure in multiple locations', icon: '🌍' },
    { title: 'Latency', explanation: 'Time for data to travel - limited by speed of light', icon: '⚡' },
    { title: 'Region', explanation: 'Geographic datacenter location', icon: '📍' },
  ],
};

const step4: GuidedStep = {
  id: 'multi-region-step-4',
  stepNumber: 4,
  frIndex: 1,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'All FRs now work in Europe with low latency',
    taskDescription: 'Deploy full infrastructure in EU-West region (App Server, Database, Cache)',
    componentsNeeded: [
      { type: 'app_server', reason: 'Process EU requests locally', displayName: 'App Server (EU-West)' },
      { type: 'database', reason: 'Store EU data locally', displayName: 'Database (EU-West)' },
      { type: 'cache', reason: 'Cache EU catalog', displayName: 'Cache (EU-West)' },
    ],
    successCriteria: [
      'Add second App Server (mark it as EU-West)',
      'Add second Database (EU-West)',
      'Add second Cache (EU-West)',
      'Connect: App Server (EU) → Database (EU) and Cache (EU)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    minimumRegions: 2,
  },
  hints: {
    level1: 'Add another set of App Server, Database, and Cache for the EU region',
    level2: 'Duplicate your US infrastructure: add App Server (EU), Database (EU), Cache (EU), and connect them the same way',
    solutionComponents: [
      { type: 'app_server', region: 'us-east' },
      { type: 'database', region: 'us-east' },
      { type: 'cache', region: 'us-east' },
      { type: 'app_server', region: 'eu-west' },
      { type: 'database', region: 'eu-west' },
      { type: 'cache', region: 'eu-west' },
    ],
    solutionConnections: [
      { from: 'app_server_us', to: 'database_us' },
      { from: 'app_server_us', to: 'cache_us' },
      { from: 'app_server_eu', to: 'database_eu' },
      { from: 'app_server_eu', to: 'cache_eu' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Global Load Balancer (Latency-Based Routing)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌐',
  scenario: "You have two regions, but users don't know which one to use!",
  hook: "A European user just connected to the US region by accident. You need intelligent routing.",
  challenge: "Add a Global Load Balancer that routes users to their nearest region based on latency.",
  illustration: 'traffic-routing',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Users are automatically routed to the best region!",
  achievement: "Latency-based routing is active",
  metrics: [
    { label: 'Routing strategy', after: 'Latency-based' },
    { label: 'Average latency', before: '100ms', after: '<50ms' },
    { label: 'User experience', after: 'Optimal globally' },
  ],
  nextTeaser: "But the databases don't talk to each other - data is isolated per region!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Global Load Balancing: Latency-Based Routing',
  conceptExplanation: `You have infrastructure in US and EU. How do users reach the right region?

**Global Load Balancer (GLB):**
- Single entry point (e.g., www.globalmart.com)
- Measures latency to each region
- Routes user to lowest-latency region
- Often DNS-based (Route53, Cloudflare)

**How it works:**
1. User requests www.globalmart.com
2. GLB measures: US = 150ms, EU = 20ms
3. GLB returns EU server IP address
4. User connects to EU region with 20ms latency

**Routing Strategies:**
- **Latency-based**: Route to lowest-latency region (best for global apps)
- **Geo-based**: Route by geography (US users → US, EU users → EU)
- **Weighted**: Percentage-based traffic splitting`,

  whyItMatters: 'Without intelligent routing, users randomly land on the wrong region and experience high latency.',

  realWorldExample: {
    company: 'Amazon Route 53',
    scenario: 'Global traffic management',
    howTheyDoIt: 'AWS Route 53 performs latency measurements from user locations and returns the IP of the lowest-latency region. Netflix, Airbnb, and others use this for global routing.',
  },

  famousIncident: {
    title: 'Cloudflare Global Load Balancing',
    company: 'Cloudflare',
    year: '2018',
    whatHappened: 'Cloudflare\'s Anycast routing sent traffic to the nearest datacenter automatically. When DDoS attacks hit one region, traffic seamlessly shifted to other regions with no user impact.',
    lessonLearned: 'Intelligent routing provides both performance and resilience.',
    icon: '☁️',
  },

  diagram: `
                     ┌─────────────────────┐
                     │  Global Load        │
                     │  Balancer (GLB)     │
                     │                     │
                     │  Latency-Based      │
                     │  Routing            │
                     └──────────┬──────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
        ┌───────────────┐              ┌───────────────┐
        │   US-East     │              │   EU-West     │
        │   Region      │              │   Region      │
        │               │              │               │
        │  App Server   │              │  App Server   │
        │     ↓         │              │     ↓         │
        │  Database     │              │  Database     │
        └───────────────┘              └───────────────┘
              ↑                                ↑
              │                                │
          US Users                         EU Users
        (routed to US)                   (routed to EU)
`,

  keyPoints: [
    'GLB is the single entry point (www.globalmart.com)',
    'Latency-based routing sends users to nearest region',
    'Typically DNS-based (Route 53, Cloudflare)',
    'Automatic failover if a region goes down',
  ],

  quickCheck: {
    question: 'What happens when a European user connects to the GLB?',
    options: [
      'They always go to the US region',
      'GLB measures latency and routes them to EU-West (lowest latency)',
      'They randomly go to either region',
      'They choose their preferred region manually',
    ],
    correctIndex: 1,
    explanation: 'Latency-based routing measures network latency to each region and routes the user to the one with lowest latency (EU-West for European users).',
  },

  keyConcepts: [
    { title: 'Global Load Balancer', explanation: 'Single entry point with intelligent routing', icon: '🌐' },
    { title: 'Latency-Based Routing', explanation: 'Route to region with lowest network latency', icon: '⚡' },
    { title: 'DNS Routing', explanation: 'DNS returns IP of best region', icon: '🔀' },
  ],
};

const step5: GuidedStep = {
  id: 'multi-region-step-5',
  stepNumber: 5,
  frIndex: 2,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'All FRs benefit from optimal routing',
    taskDescription: 'Add Global Load Balancer between Client and regional App Servers',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Route users to nearest region', displayName: 'Global Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Global Load Balancer', reason: 'Single entry point' },
      { from: 'Global Load Balancer', to: 'App Server (US)', reason: 'Route US traffic' },
      { from: 'Global Load Balancer', to: 'App Server (EU)', reason: 'Route EU traffic' },
    ],
    successCriteria: [
      'Add Global Load Balancer',
      'Connect Client → GLB',
      'Connect GLB → both regional App Servers',
      'Configure latency-based routing',
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
    minimumRegions: 2,
  },
  hints: {
    level1: 'Add a Load Balancer and connect it between Client and both App Servers',
    level2: 'Add Global Load Balancer, connect Client → GLB → both App Servers (US and EU)',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer', config: { routingStrategy: 'latency-based' } },
      { type: 'app_server', region: 'us-east' },
      { type: 'app_server', region: 'eu-west' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server_us' },
      { from: 'load_balancer', to: 'app_server_eu' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Cross-Region Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "A US customer traveling to Europe can't see their order history!",
  hook: "The US database has their orders, but the EU database doesn't. Data is isolated per region.",
  challenge: "Set up cross-region database replication so data syncs between regions.",
  illustration: 'data-sync',
};

const step6Celebration: CelebrationContent = {
  emoji: '🌍',
  message: "Data now syncs across regions!",
  achievement: "Users can access their data from anywhere",
  metrics: [
    { label: 'Replication lag', after: '<5 seconds' },
    { label: 'Data availability', after: 'Global' },
    { label: 'FR-5 satisfied', after: 'Eventual consistency ✓' },
  ],
  nextTeaser: "But what if an entire region goes down?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cross-Region Data Replication',
  conceptExplanation: `Problem: Each region has its own database. Data is isolated.

**Cross-Region Replication:**
- Async replication between regions
- Orders in US → replicate to EU within seconds
- Enables global data access
- Eventual consistency (not immediate)

**How it works:**
1. User places order in US region
2. Order saved to US database immediately
3. Change log sent to EU database asynchronously
4. EU database receives update within 5 seconds

**Consistency Models:**
- **Strong Consistency**: All regions see same data instantly (slow, requires coordination)
- **Eventual Consistency**: Regions sync within seconds (fast, what we use!)

For e-commerce:
- Orders need eventual consistency (5s lag acceptable)
- Inventory needs conflict resolution (what if same item sold in both regions?)`,

  whyItMatters: 'Without replication, traveling users can\'t access their data. With replication, data is globally available.',

  famousIncident: {
    title: 'Amazon DynamoDB Global Tables',
    company: 'Amazon',
    year: '2017',
    whatHappened: 'Amazon launched DynamoDB Global Tables with multi-region replication. A bug caused replication lag to spike to several minutes during Prime Day, showing stale inventory to customers.',
    lessonLearned: 'Replication lag monitoring is critical. Always show replication status and have conflict resolution for writes.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Global payment data',
    howTheyDoIt: 'Stripe replicates payment data across US and EU regions with <100ms lag using custom replication protocol. Ensures compliance with regional data regulations.',
  },

  diagram: `
Cross-Region Replication Flow:

US-East Region                         EU-West Region
┌─────────────────┐                   ┌─────────────────┐
│  Database (US)  │                   │  Database (EU)  │
│                 │                   │                 │
│  Orders:        │                   │  Orders:        │
│  - Order #123 ──┼──────────────────▶│  - Order #123   │
│  - Order #124 ──┼──────────────────▶│  - Order #124   │
│                 │  Async Replication│                 │
│                 │  (~5 seconds)     │                 │
└─────────────────┘                   └─────────────────┘
        ↑                                      ↑
        │                                      │
    US Users                               EU Users
 (write locally,                      (read replicated
  see immediately)                     data, 5s lag)

Eventual Consistency:
- US user places order → sees it immediately in US DB
- 5 seconds later → EU DB has the order too
- Traveling user in EU → sees their order (eventually)
`,

  keyPoints: [
    'Async replication: US database → EU database',
    'Replication lag: typically <5 seconds',
    'Eventual consistency: acceptable for most e-commerce',
    'Conflict resolution needed for inventory',
    'Each region can read/write locally',
  ],

  quickCheck: {
    question: 'Why use eventual consistency instead of strong consistency for cross-region replication?',
    options: [
      'It\'s easier to implement',
      'Strong consistency requires coordination between regions, adding 150ms+ latency to every write',
      'Eventual consistency is more reliable',
      'It costs less',
    ],
    correctIndex: 1,
    explanation: 'Strong consistency requires coordination (consensus) between distant regions, adding huge latency. Eventual consistency allows fast local writes with async replication.',
  },

  keyConcepts: [
    { title: 'Replication', explanation: 'Copying data between databases', icon: '🔄' },
    { title: 'Async Replication', explanation: 'Copy data in background (fast but delayed)', icon: '⏱️' },
    { title: 'Eventual Consistency', explanation: 'All regions sync within seconds', icon: '🌐' },
    { title: 'Replication Lag', explanation: 'Time delay for data to sync', icon: '⏳' },
  ],
};

const step6: GuidedStep = {
  id: 'multi-region-step-6',
  stepNumber: 6,
  frIndex: 3,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'FR-5: Global data access with eventual consistency',
    taskDescription: 'Enable cross-region database replication between US and EU',
    successCriteria: [
      'Click on US Database',
      'Enable cross-region replication to EU',
      'Click on EU Database',
      'Enable cross-region replication to US',
      'Configure async replication with ~5 second lag',
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
    minimumRegions: 2,
    requireCrossRegionReplication: true,
  },
  hints: {
    level1: 'Enable replication on both databases to sync data across regions',
    level2: 'Click each Database, enable cross-region replication, and configure async mode with 5s lag',
    solutionComponents: [
      { type: 'database', region: 'us-east', config: { crossRegionReplication: true } },
      { type: 'database', region: 'eu-west', config: { crossRegionReplication: true } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Deploy Asia-Pacific Region
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌏',
  scenario: "Your business is booming in Asia! But customers in Singapore and Tokyo have terrible latency.",
  hook: "Asian users are connecting to either US (250ms) or EU (200ms). You need a local region.",
  challenge: "Deploy a third region in Asia-Pacific (AP-Southeast) with full infrastructure and replication.",
  illustration: 'global-expansion',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "You're now truly global!",
  achievement: "Three-region deployment complete",
  metrics: [
    { label: 'Regions', before: '2 (US, EU)', after: '3 (US, EU, APAC)' },
    { label: 'Global coverage', after: '99% of users <50ms' },
    { label: 'APAC latency', before: '200ms+', after: '<40ms' },
  ],
  nextTeaser: "But what happens if an entire region goes offline?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Three-Region Architecture: Global Scale',
  conceptExplanation: `With three regions (US, EU, APAC), you cover the entire world:

**Regional Coverage:**
- US-East: North & South America
- EU-West: Europe, Middle East, Africa
- AP-Southeast: Asia, Australia

**Why three regions?**
- More than 3 has diminishing returns for most apps
- Covers all major population centers
- Keeps complexity manageable
- Provides redundancy (if one fails, two remain)

**Deployment Pattern:**
Each region has IDENTICAL infrastructure:
1. App Server (processes requests locally)
2. Database (stores data locally, replicates globally)
3. Cache (caches catalog locally)

**Replication Topology:**
- US ↔ EU (bidirectional)
- US ↔ APAC (bidirectional)
- EU ↔ APAC (bidirectional)
- Forms a mesh for global data availability`,

  whyItMatters: 'Three regions gives you global low latency, high availability, and disaster recovery.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Supporting merchants globally',
    howTheyDoIt: 'Shopify runs in US, EU, and APAC regions with full replication. Merchants can manage stores from anywhere with <100ms latency.',
  },

  diagram: `
Three-Region Global Deployment:

       ┌─────────────────────────────────────┐
       │   Global Load Balancer (GLB)        │
       │   Latency-Based Routing              │
       └──────────┬──────────────┬────────────┘
                  │              │
         ┌────────┴────┐    ┌────┴────────┐
         │             │    │             │
         ▼             ▼    ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ US-East  │  │ EU-West  │  │ AP-SE    │
   │          │  │          │  │          │
   │ App, DB  │◀─┼─ Replication ──┼─▶ App, DB  │
   │ Cache    │  │ Cache    │  │ Cache    │
   └──────────┘  └──────────┘  └──────────┘
        ↑             ↑              ↑
        │             │              │
   Americas      Europe, MEA    Asia, Australia
   40% users     35% users      25% users

All regions replicate data bidirectionally
Replication lag: <5 seconds globally
`,

  keyPoints: [
    'Three regions cover 99% of global users',
    'Each region: full infrastructure stack',
    'Bidirectional replication between all regions',
    'GLB routes to nearest region',
    'Provides N-1 redundancy (two backups)',
  ],

  quickCheck: {
    question: 'Why is three regions often the sweet spot for global apps?',
    options: [
      'Three is the maximum allowed',
      'Covers all major population centers without excessive complexity',
      'It\'s the cheapest option',
      'DNS only supports three regions',
    ],
    correctIndex: 1,
    explanation: 'Three regions (Americas, Europe, Asia) covers most global users. More regions adds complexity and cost with diminishing latency improvements.',
  },

  keyConcepts: [
    { title: 'Mesh Replication', explanation: 'All regions replicate to all other regions', icon: '🕸️' },
    { title: 'Regional Coverage', explanation: 'Each region serves nearby users', icon: '🌍' },
    { title: 'N-1 Redundancy', explanation: 'System survives any single region failure', icon: '🛡️' },
  ],
};

const step7: GuidedStep = {
  id: 'multi-region-step-7',
  stepNumber: 7,
  frIndex: 4,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'All FRs now work globally across 3 regions',
    taskDescription: 'Deploy full infrastructure in AP-Southeast (App Server, Database, Cache) and connect to GLB',
    componentsNeeded: [
      { type: 'app_server', reason: 'Process APAC requests', displayName: 'App Server (AP-Southeast)' },
      { type: 'database', reason: 'Store APAC data', displayName: 'Database (AP-Southeast)' },
      { type: 'cache', reason: 'Cache APAC catalog', displayName: 'Cache (AP-Southeast)' },
    ],
    successCriteria: [
      'Add App Server, Database, Cache for APAC',
      'Connect App Server (APAC) → Database (APAC) and Cache (APAC)',
      'Connect Global Load Balancer → App Server (APAC)',
      'Enable cross-region replication from APAC to US and EU',
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
    minimumRegions: 3,
    requireCrossRegionReplication: true,
  },
  hints: {
    level1: 'Add APAC infrastructure matching US and EU patterns',
    level2: 'Add App Server (APAC), Database (APAC), Cache (APAC), connect them, connect to GLB, and enable replication',
    solutionComponents: [
      { type: 'app_server', region: 'ap-southeast' },
      { type: 'database', region: 'ap-southeast', config: { crossRegionReplication: true } },
      { type: 'cache', region: 'ap-southeast' },
    ],
    solutionConnections: [
      { from: 'load_balancer', to: 'app_server_apac' },
      { from: 'app_server_apac', to: 'database_apac' },
      { from: 'app_server_apac', to: 'cache_apac' },
    ],
  },
};

// =============================================================================
// STEP 8: Test Regional Failover
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! The US-East region just went offline. AWS outage affecting the entire East Coast.",
  hook: "Your 40% of US users are panicking. Can your system survive?",
  challenge: "Configure automatic failover so users in the failed region are routed to the nearest healthy region.",
  illustration: 'disaster-recovery',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎖️',
  message: "Your system survived a regional outage!",
  achievement: "Disaster recovery successful",
  metrics: [
    { label: 'Availability during US outage', after: '99.9% (EU + APAC up)' },
    { label: 'US users redirected to', after: 'EU-West' },
    { label: 'Latency during failover', after: '120ms (degraded but functional)' },
    { label: 'Data loss', after: 'Zero (replication worked!)' },
  ],
  nextTeaser: "Congratulations! You've built a globally-distributed, fault-tolerant system!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Regional Failover: Surviving Disasters',
  conceptExplanation: `Regional outages happen (AWS has had several). Your system must survive.

**Failover Strategy:**
When a region fails:
1. Global Load Balancer detects failure (health checks)
2. Stops routing traffic to failed region
3. Routes affected users to next-nearest region
4. Users experience degraded latency but system works

**Graceful Degradation:**
- Normal: US users → US region (10ms)
- US region down: US users → EU region (120ms)
- Degraded experience, but functional

**Data Safety:**
- Cross-region replication means data is safe
- Orders in US are replicated to EU and APAC
- Zero data loss even if US region is destroyed

**Recovery:**
- When US region comes back online
- GLB detects it's healthy
- Gradually shifts traffic back
- System returns to normal`,

  whyItMatters: 'Regional outages are rare but catastrophic. Multi-region with failover means your business survives.',

  famousIncident: {
    title: 'AWS US-East Outage',
    company: 'AWS',
    year: '2017',
    whatHappened: 'S3 outage in US-East-1 took down thousands of websites and apps for 4 hours. Companies with multi-region deployments (like Netflix) stayed online. Single-region companies went completely dark.',
    lessonLearned: 'Multi-region isn\'t just for performance - it\'s for survival. Always plan for regional failures.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'AWS region failures',
    howTheyDoIt: 'Netflix runs Chaos Monkey to randomly shut down regions during the day. This forces them to design for failure. They can lose an entire region with no user impact.',
  },

  diagram: `
Normal Operation:
─────────────────
US Users → US Region (10ms)
EU Users → EU Region (10ms)
APAC Users → APAC Region (10ms)


During US Region Failure:
──────────────────────────
❌ US Region (OFFLINE)
✅ EU Region (ONLINE)
✅ APAC Region (ONLINE)

Global Load Balancer Failover:
US Users → EU Region (120ms) ← Degraded but works!
EU Users → EU Region (10ms) ← Unaffected
APAC Users → APAC Region (10ms) ← Unaffected

Data remains safe:
- US orders replicated to EU ✓
- US orders replicated to APAC ✓
- Zero data loss ✓
`,

  keyPoints: [
    'Health checks detect region failures',
    'GLB automatically fails over to healthy regions',
    'Users experience higher latency but system works',
    'Cross-region replication prevents data loss',
    'Multi-region = disaster recovery built-in',
  ],

  quickCheck: {
    question: 'What happens to US users when the US region goes offline?',
    options: [
      'They see an error page',
      'They wait for US region to recover',
      'GLB redirects them to EU region - degraded latency but functional',
      'Their data is lost',
    ],
    correctIndex: 2,
    explanation: 'GLB detects the failure and redirects US users to the nearest healthy region (EU). Latency increases from 10ms → 120ms, but the system works.',
  },

  keyConcepts: [
    { title: 'Failover', explanation: 'Automatic switch to backup region', icon: '🔄' },
    { title: 'Health Checks', explanation: 'Monitor region availability', icon: '💓' },
    { title: 'Graceful Degradation', explanation: 'Degraded service is better than no service', icon: '📉' },
    { title: 'Disaster Recovery', explanation: 'Survive catastrophic failures', icon: '🛡️' },
  ],
};

const step8: GuidedStep = {
  id: 'multi-region-step-8',
  stepNumber: 8,
  frIndex: 5,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'All FRs remain available during regional failures',
    taskDescription: 'Configure health checks and failover policies on the Global Load Balancer',
    successCriteria: [
      'Click on Global Load Balancer',
      'Enable health checks for all regions',
      'Configure automatic failover to nearest healthy region',
      'Set failover timeout and retry policies',
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
    minimumRegions: 3,
    requireCrossRegionReplication: true,
    requireHealthChecks: true,
  },
  hints: {
    level1: 'Configure the Global Load Balancer to monitor region health and failover automatically',
    level2: 'Click GLB, enable health checks, set automatic failover to nearest region, configure 30s timeout',
    solutionComponents: [
      {
        type: 'load_balancer',
        config: {
          routingStrategy: 'latency-based',
          healthChecks: true,
          failoverEnabled: true,
          healthCheckInterval: 30,
        },
      },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const basicMultiRegionGuidedTutorial: GuidedTutorial = {
  problemId: 'basic-multi-region-guided',
  problemTitle: 'Build a Multi-Region System - Global Scale',

  requirementsPhase: basicMultiRegionRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [],
};

export function getBasicMultiRegionGuidedTutorial(): GuidedTutorial {
  return basicMultiRegionGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = basicMultiRegionRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= basicMultiRegionRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
