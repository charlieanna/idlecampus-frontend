import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Supply Chain Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching system design through building a
 * supply chain visibility platform with focus on inventory, supplier data,
 * and logistics tracking.
 *
 * Key Concepts:
 * - Real-time inventory visibility
 * - Supplier data synchronization
 * - Logistics tracking and updates
 * - Multi-layer caching strategies
 * - Event-driven architecture
 * - Data consistency in distributed systems
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic functionality (in-memory) - FRs satisfied!
 * Step 3: Add persistence (database)
 * Steps 4-8: Apply NFRs (caching, real-time updates, scale)
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const supplyChainRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a supply chain visibility platform for tracking inventory, suppliers, and logistics",

  interviewer: {
    name: 'Maria Santos',
    role: 'VP of Supply Chain Technology',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // FUNCTIONAL REQUIREMENTS
    // =============================================================================

    {
      id: 'core-inventory',
      category: 'functional',
      question: "What inventory information do users need to see?",
      answer: "Users need real-time visibility into:\n1. **Current stock levels** - How many units at each warehouse\n2. **Product locations** - Which warehouses have which products\n3. **Inventory movements** - Track when items arrive or ship out\n4. **Stock alerts** - Notifications when inventory falls below threshold\n5. **Multi-warehouse view** - See inventory across all locations at once",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Inventory visibility is the foundation of supply chain management",
    },
    {
      id: 'supplier-data',
      category: 'functional',
      question: "What supplier information needs to be tracked?",
      answer: "The system must track:\n1. **Supplier catalog** - Products each supplier provides\n2. **Pricing data** - Current prices and contract terms\n3. **Lead times** - How long it takes to receive orders\n4. **Supplier performance** - Delivery reliability, quality metrics\n5. **Contact information** - Who to contact for each supplier",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Supplier data changes frequently and needs to be kept synchronized",
    },
    {
      id: 'logistics-tracking',
      category: 'functional',
      question: "How should shipment tracking work?",
      answer: "Users need to track:\n1. **Shipment status** - Where is each shipment right now\n2. **Expected delivery** - ETA for incoming and outgoing shipments\n3. **Carrier information** - Which carrier is handling the shipment\n4. **Location updates** - Real-time location as shipment moves\n5. **Delivery confirmation** - Proof of delivery when complete",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Logistics tracking requires frequent updates from external systems",
    },
    {
      id: 'data-freshness',
      category: 'clarification',
      question: "How fresh does the inventory data need to be?",
      answer: "Inventory levels should be updated within 5 seconds of any change. Users can't wait minutes to see if an item is in stock - that leads to overselling or stockouts.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Near real-time data is critical for operational decisions",
    },
    {
      id: 'search-filter',
      category: 'functional',
      question: "How do users find specific products or shipments?",
      answer: "Users need to:\n1. **Search by SKU** - Find products by ID or name\n2. **Filter by warehouse** - View inventory at specific locations\n3. **Filter by supplier** - See all products from a supplier\n4. **Track shipment by ID** - Look up specific shipment status\n5. **Filter by status** - Show only delayed shipments, low stock items, etc.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Fast search and filtering is essential for large inventories",
    },
    {
      id: 'multi-warehouse',
      category: 'clarification',
      question: "How many warehouses are we talking about?",
      answer: "We have 50 warehouses globally, each tracking 10,000-50,000 SKUs. Users need to see the full picture across all locations.",
      importance: 'critical',
      insight: "Multi-warehouse visibility requires aggregating data from many sources",
    },
    {
      id: 'external-integrations',
      category: 'clarification',
      question: "Do we integrate with external systems like carrier APIs?",
      answer: "Yes, we pull tracking updates from FedEx, UPS, DHL APIs every 15 minutes. Supplier pricing is synced daily from supplier EDI systems.",
      importance: 'important',
      insight: "External integrations drive many updates - caching is critical",
    },
    {
      id: 'scope-forecasting',
      category: 'scope',
      question: "Do we need demand forecasting or just current visibility?",
      answer: "Not for MVP. Forecasting is a v2 feature. Focus on current state visibility first.",
      importance: 'nice-to-have',
      insight: "Start with operational visibility before adding predictive features",
    },

    // =============================================================================
    // SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users will access the system?",
      answer: "5,000 warehouse managers, procurement staff, and logistics coordinators. Peak usage is during business hours with about 1,000 concurrent users.",
      importance: 'critical',
      learningPoint: "Moderate user base but high read volume per user",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How often do users query inventory and shipment data?",
      answer: "About 10 million inventory queries per day. Shipment tracking gets 2 million queries per day. Most queries are during business hours (8 AM - 6 PM).",
      importance: 'critical',
      calculation: {
        formula: "12M queries ÷ 86,400 sec = 139 reads/sec average, ~400 reads/sec peak",
        result: "~400 reads/sec peak during business hours",
      },
      learningPoint: "Read-heavy workload - perfect for caching",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How often does inventory data change?",
      answer: "Inventory updates: 100,000 per day (receiving, shipping, transfers). Shipment updates: 50,000 per day from carrier APIs.",
      importance: 'important',
      calculation: {
        formula: "150K writes ÷ 86,400 sec = 1.7 writes/sec average, ~5 writes/sec peak",
        result: "~5 writes/sec peak - read:write ratio is 80:1",
      },
      learningPoint: "Heavy read bias makes cache invalidation straightforward",
    },
    {
      id: 'latency-inventory',
      category: 'latency',
      question: "How fast should inventory queries respond?",
      answer: "p99 under 500ms. Warehouse staff need instant visibility when checking stock levels.",
      importance: 'critical',
      learningPoint: "Sub-second response requires effective caching",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "What about search performance across warehouses?",
      answer: "Search should return within 1 second even when querying all 50 warehouses. Can't make users wait while we aggregate data.",
      importance: 'important',
      learningPoint: "Aggregation queries need pre-computed or cached results",
    },
    {
      id: 'consistency-inventory',
      category: 'consistency',
      question: "What happens if two warehouses update the same product simultaneously?",
      answer: "Each warehouse owns its own inventory - no conflicts. But users viewing aggregated inventory need consistent totals.",
      importance: 'important',
      insight: "Partition by warehouse for writes, aggregate for reads",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-inventory', 'supplier-data', 'logistics-tracking', 'data-freshness'],
  criticalFRQuestionIds: ['core-inventory', 'supplier-data', 'logistics-tracking', 'data-freshness'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-inventory'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Real-time inventory visibility',
      description: 'View current stock levels across all warehouses with 5-second freshness',
      emoji: '📦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Supplier data management',
      description: 'Track supplier catalog, pricing, lead times, and performance',
      emoji: '🏭',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Logistics tracking',
      description: 'Track shipment status, location, and delivery updates in real-time',
      emoji: '🚚',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Search and filtering',
      description: 'Search products, filter by warehouse/supplier/status',
      emoji: '🔍',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Multi-warehouse aggregation',
      description: 'View aggregated inventory across all 50 warehouses',
      emoji: '🌐',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1,000 concurrent users (5,000 total)',
    writesPerDay: '150,000 updates (inventory + shipments)',
    readsPerDay: '12 million queries',
    peakMultiplier: 3,
    readWriteRatio: '80:1',
    calculatedWriteRPS: { average: 2, peak: 5 },
    calculatedReadRPS: { average: 139, peak: 400 },
    maxPayloadSize: '~100KB per warehouse inventory snapshot',
    storagePerRecord: '~1KB per SKU, 50 warehouses × 30K SKUs = 1.5GB',
  },

  architecturalImplications: [
    '✅ 80:1 read:write ratio → Multi-layer caching essential',
    '✅ 400 reads/sec peak → Cache can handle this easily',
    '✅ 5-second freshness requirement → Cache TTL must be short',
    '✅ 50 warehouses → Partition data by warehouse',
    '✅ External API polling → Background jobs + cache updates',
    '✅ Aggregation queries → Pre-compute or cache aggregations',
  ],

  outOfScope: [
    'Demand forecasting',
    'Automated reordering',
    'Warehouse management (picking, packing)',
    'Financial reconciliation',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can view inventory, suppliers, and shipments. The complexity of caching, real-time updates, and multi-warehouse aggregation comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏗️',
  scenario: "Welcome to Global Supply Co! You've been hired to build their supply chain visibility platform.",
  hook: "Warehouse managers are blind - they have no way to check inventory levels or track shipments.",
  challenge: "Set up the basic connection so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Users can now connect to your supply chain system',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Ready for requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle inventory queries yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every supply chain platform starts with a **Client** connecting to a **Server**.

When a warehouse manager opens the dashboard:
1. Their browser/app (Client) sends HTTP requests
2. Your App Server receives and processes the requests
3. The server responds with inventory data, shipment status, etc.

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, users can\'t access inventory data, track shipments, or manage suppliers.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Managing inventory across 175+ fulfillment centers',
    howTheyDoIt: 'Uses microservices architecture with thousands of servers handling inventory queries, order routing, and shipment tracking',
  },

  keyPoints: [
    'Client = warehouse manager\'s dashboard (web or mobile)',
    'App Server = backend handling inventory and logistics queries',
    'HTTP/HTTPS = protocol for communication',
    'Start simple, then scale with load balancers later',
  ],

  interviewTip: 'Always start with client-server basics. Show you understand the foundation before jumping to complex architectures.',
};

const step1: GuidedStep = {
  id: 'supply-chain-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Warehouse managers access the dashboard', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles inventory and logistics queries', displayName: 'App Server' },
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
// STEP 2: Implement Core API Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but warehouse managers see blank screens!",
  hook: "The server doesn't know how to handle inventory queries, supplier lookups, or shipment tracking.",
  challenge: "Write the Python code to handle these core APIs.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your APIs are working!',
  achievement: 'Warehouse managers can now view inventory and track shipments',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Inventory queries', after: 'Working' },
    { label: 'Shipment tracking', after: 'Working' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Supply Chain Data Handlers',
  conceptExplanation: `Your app server needs handlers for each API endpoint:

**Core APIs:**
1. \`get_inventory(warehouse_id, sku)\` - Return current stock level
2. \`get_supplier_info(supplier_id)\` - Return supplier details
3. \`track_shipment(shipment_id)\` - Return shipment status and location
4. \`search_products(query, filters)\` - Search and filter inventory

For now, store data in memory (Python dictionaries). Database comes in Step 3!

**Data structures:**
- \`inventory[warehouse_id][sku] = quantity\`
- \`suppliers[supplier_id] = {name, products, lead_time}\`
- \`shipments[shipment_id] = {status, location, eta}\``,

  whyItMatters: 'These APIs are the heart of your supply chain platform. Everything else builds on this foundation.',

  famousIncident: {
    title: 'Target Canada Inventory Disaster',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target\'s supply chain system had data quality issues showing incorrect inventory. This led to empty shelves and excess backroom stock. The failed expansion cost $2 billion and led to Target exiting Canada.',
    lessonLearned: 'Accurate, real-time inventory data is not optional - it\'s the foundation of retail operations.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Tracking inventory across 10,000+ stores',
    howTheyDoIt: 'Uses real-time inventory system that processes millions of updates per hour. Each sale, delivery, and transfer updates inventory within seconds.',
  },

  keyPoints: [
    'Start with in-memory storage - simple dictionaries work fine',
    'Each API returns the data users need to make decisions',
    'Handle warehouse-level inventory separately (partition by warehouse)',
    'You can optimize and add persistence later - first make it work!',
  ],

  interviewTip: 'In interviews, starting with in-memory solutions shows you prioritize working functionality over premature optimization.',
};

const step2: GuidedStep = {
  id: 'supply-chain-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2, FR-3: Core inventory, supplier, and logistics APIs',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign API endpoints (inventory, suppliers, shipments)',
      'Open the Python tab',
      'Implement handler functions with in-memory storage',
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
    level1: 'Click on the App Server, go to APIs tab, and assign endpoints for inventory, suppliers, and shipments',
    level2: 'Switch to Python tab. Implement get_inventory, get_supplier_info, and track_shipment functions using dictionaries',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/inventory', 'GET /api/v1/suppliers', 'GET /api/v1/shipments'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The server crashed at 3 AM during a system update...",
  hook: "When it restarted, all inventory data was gone. Warehouse managers see zeroes everywhere!",
  challenge: "Add a database so data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe!',
  achievement: 'Inventory and shipment data now persists across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But queries are slow with millions of inventory records...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Databases for Supply Chain Data',
  conceptExplanation: `A **database** stores your data permanently on disk.

For supply chain, you need tables for:
- \`inventory\` - (warehouse_id, sku, quantity, last_updated)
- \`suppliers\` - (supplier_id, name, products, lead_time, pricing)
- \`shipments\` - (shipment_id, status, location, eta, carrier)
- \`warehouses\` - (warehouse_id, name, location)

**Indexing strategy:**
- Index on warehouse_id for fast warehouse queries
- Index on sku for product lookups
- Index on shipment_id for tracking
- Composite index on (warehouse_id, sku) for inventory queries`,

  whyItMatters: 'Losing inventory data means you can\'t fulfill orders. Database persistence is critical for operations.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Managing inventory for 350+ million products',
    howTheyDoIt: 'Uses DynamoDB for inventory data with strong consistency. Each warehouse has its own partition for isolation.',
  },

  keyPoints: [
    'Database stores inventory, suppliers, and shipments permanently',
    'Partition by warehouse_id for scalability',
    'Index strategically for fast queries',
    'Use transactions for inventory updates to prevent race conditions',
  ],

  quickCheck: {
    question: 'Why partition inventory data by warehouse_id?',
    options: [
      'It makes queries faster',
      'Each warehouse operates independently - natural partition boundary',
      'It uses less storage',
      'It\'s required by SQL',
    ],
    correctIndex: 1,
    explanation: 'Each warehouse manages its own inventory independently. Partitioning by warehouse_id aligns with the domain model and prevents cross-warehouse contention.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives crashes and restarts', icon: '🛡️' },
    { title: 'Partitioning', explanation: 'Split data by warehouse for scalability', icon: '🔀' },
    { title: 'Indexing', explanation: 'Fast lookups for queries', icon: '📇' },
  ],
};

const step3: GuidedStep = {
  id: 'supply-chain-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store inventory, suppliers, and shipments permanently', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
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
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Inventory Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Warehouse managers are complaining: 'The dashboard takes 3 seconds to load!'",
  hook: "With 50 warehouses and millions of SKUs, every inventory query hits the database. It's too slow!",
  challenge: "Add a cache to make inventory queries instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Inventory queries are lightning fast!',
  achievement: 'Caching reduced query latency by 95%',
  metrics: [
    { label: 'Query latency', before: '3000ms', after: '150ms' },
    { label: 'Cache hit rate', after: '90%' },
    { label: 'Database load', before: '100%', after: '10%' },
  ],
  nextTeaser: "But how do we keep the cache fresh when inventory changes?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Strategy for Supply Chain Data',
  conceptExplanation: `A **cache** dramatically speeds up repetitive queries.

**Supply chain caching strategy:**
1. **Inventory cache** (TTL: 5 seconds) - Short TTL for near real-time
2. **Supplier cache** (TTL: 1 hour) - Supplier data changes infrequently
3. **Shipment cache** (TTL: 15 minutes) - Matches carrier API poll frequency

**Cache-Aside Pattern:**
1. Check cache first
2. If miss → query database
3. Store result in cache with appropriate TTL
4. Return to user

**Cache invalidation:**
- When inventory updates, invalidate affected cache keys
- Use write-through caching for critical updates`,

  whyItMatters: 'With 400 reads/sec peak and only 5 writes/sec, caching gives you 80x reduction in database load.',

  famousIncident: {
    title: 'Knight Capital Trading Glitch',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Stale cached data in their trading system caused it to execute old orders. The firm lost $440 million in 45 minutes and nearly went bankrupt.',
    lessonLearned: 'Cache invalidation is critical. For time-sensitive data, use short TTLs and invalidate aggressively on writes.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Product inventory for millions of merchants',
    howTheyDoIt: 'Uses Redis for inventory caching with 5-second TTL. When inventory updates, cache is immediately invalidated for that SKU.',
  },

  diagram: `
┌──────────┐   1. Query inventory   ┌─────────────┐
│  Client  │ ───────────────────▶   │ App Server  │
└──────────┘                        └──────┬──────┘
                                           │
                                           │ 2. Check cache
                                           ▼
                                    ┌──────────┐
                                    │  Redis   │
                                    │  Cache   │
                                    └──────────┘
                                       │     │
                        Cache Hit ─────┘     └───── Cache Miss
                        (90% of requests)           │
                        Return instantly            │ 3. Query DB
                                                     ▼
                                              ┌──────────┐
                                              │ Database │
                                              └──────────┘
`,

  keyPoints: [
    'Inventory cache TTL: 5 seconds (meets freshness requirement)',
    'Supplier cache TTL: 1 hour (changes infrequently)',
    'Cache invalidation on writes keeps data fresh',
    '80:1 read:write ratio makes caching extremely effective',
  ],

  quickCheck: {
    question: 'Why use different TTLs for inventory vs supplier data?',
    options: [
      'To save memory',
      'Different data has different change frequencies and freshness requirements',
      'It\'s required by Redis',
      'To balance the load',
    ],
    correctIndex: 1,
    explanation: 'Inventory changes frequently (needs 5-sec freshness), while supplier data is relatively static (can be cached for 1 hour). Match TTL to data volatility.',
  },

  keyConcepts: [
    { title: 'Cache TTL', explanation: 'Time before cached data expires', icon: '⏱️' },
    { title: 'Cache-Aside', explanation: 'Application manages cache population', icon: '🔄' },
    { title: 'Invalidation', explanation: 'Remove stale data on updates', icon: '🗑️' },
  ],
};

const step4: GuidedStep = {
  id: 'supply-chain-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2: Fast inventory and supplier queries',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache inventory and supplier data for fast queries', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (5 seconds for inventory)',
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
    level2: 'Connect App Server to Cache. Set TTL to 5 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 5, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for High Availability
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Peak season! Black Friday is here and query volume just tripled!",
  hook: "Your single app server is struggling. Response times are climbing to 5 seconds.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Traffic is now balanced!',
  achievement: 'Load balancer distributes requests for better performance',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Response time', before: '5000ms', after: '200ms' },
  ],
  nextTeaser: "But we need more app server instances to handle peak load...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for Supply Chain Systems',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across multiple app servers.

**Benefits:**
- Eliminates single point of failure
- Enables horizontal scaling
- Improves response times
- Enables rolling deployments

**For supply chain:**
- Peak season can bring 3x normal traffic
- Load balancer lets you scale servers up and down
- Health checks ensure failed servers don't receive traffic`,

  whyItMatters: 'During peak season (Black Friday, holiday rush), traffic spikes dramatically. One server can\'t handle it.',

  realWorldExample: {
    company: 'Zara',
    scenario: 'Managing inventory during seasonal peaks',
    howTheyDoIt: 'Uses load balancers with auto-scaling groups. During peak season, scales from 10 to 50 app servers automatically.',
  },

  keyPoints: [
    'Load balancer sits between client and app servers',
    'Distributes traffic using round-robin or least-connections',
    'Enables horizontal scaling (add more servers)',
    'Health checks detect and route around failures',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
  ],
};

const step5: GuidedStep = {
  id: 'supply-chain-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across app servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Scale App Servers Horizontally
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "You've onboarded 20 new warehouses! Query volume is now 800 requests/sec at peak.",
  hook: "Even with load balancing, one app server instance can't keep up.",
  challenge: "Scale to multiple app server instances to handle the load.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can handle any load now!',
  achievement: 'Multiple app servers working in parallel',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Capacity', before: '200 req/s', after: '800+ req/s' },
    { label: 'Response time', after: 'Under 200ms' },
  ],
  nextTeaser: "But database queries are still slow for aggregations...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for Supply Chain Applications',
  conceptExplanation: `**Horizontal scaling** means adding more app server instances.

**Why horizontal > vertical?**
- Cost effective: Many small servers > one big server
- No ceiling: Keep adding servers as needed
- Fault tolerant: If one fails, others continue

**For supply chain:**
- Start with 3 instances for redundancy
- Scale to 5-10 during peak season
- Each instance shares cache and database
- Stateless design makes scaling easy`,

  whyItMatters: 'Supply chain operations have predictable peak patterns (business hours, seasonal spikes). Horizontal scaling handles this efficiently.',

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Black Friday traffic surge',
    howTheyDoIt: 'Auto-scales from 50 to 500+ app servers during Black Friday. Uses Kubernetes for orchestration.',
  },

  keyPoints: [
    'Add more app server instances (3-5 for production)',
    'Load balancer distributes across all instances',
    'All instances share same cache and database',
    'Stateless servers are easy to scale',
  ],

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Stateless', explanation: 'No session data in servers', icon: '🔄' },
    { title: 'Auto-Scaling', explanation: 'Scale based on metrics', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'supply-chain-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from more compute capacity',
    taskDescription: 'Scale the App Server to multiple instances',
    successCriteria: [
      'Click on the App Server component',
      'Go to Configuration tab',
      'Set instances to 3 or more',
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
    level1: 'Click on App Server, find instance count in Configuration',
    level2: 'Set instances to 3 or more. Load balancer will distribute traffic.',
    solutionComponents: [{ type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Database Replication
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚠️',
  scenario: "3 AM alert: Database primary went down! Hardware failure!",
  hook: "All inventory queries are failing. Warehouses are blind. Operations stopped.",
  challenge: "Add database replication so backups are always ready.",
  illustration: 'database-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
    { label: 'Failover time', after: '< 30 seconds' },
  ],
  nextTeaser: "But carrier API integrations are overwhelming the app servers...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for Supply Chain Data',
  conceptExplanation: `**Replication** creates multiple copies of your database.

**Types:**
- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync

**For supply chain:**
- Inventory updates go to primary
- Read queries (90% of traffic) distributed across replicas
- If primary fails, promote replica
- 2-3 replicas recommended

**Read/Write split:**
- Writes → Primary
- Reads → Replicas (load balanced)
- Slight replication lag (< 1 second) is acceptable`,

  whyItMatters: 'Supply chain operations can\'t stop. Database failure without replication means halting warehouse operations.',

  famousIncident: {
    title: 'British Airways IT Outage',
    company: 'British Airways',
    year: '2017',
    whatHappened: 'Database failure without proper replication caused a complete system outage. 75,000 passengers stranded, 726 flights cancelled, estimated £80 million loss.',
    lessonLearned: 'Critical operations require database replication. Test failover regularly.',
    icon: '✈️',
  },

  realWorldExample: {
    company: 'Target',
    scenario: 'Inventory database for 1,900+ stores',
    howTheyDoIt: 'Uses PostgreSQL with streaming replication. 3 replicas across different availability zones. Automatic failover in under 30 seconds.',
  },

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'If primary fails, replica can be promoted',
    'Use read replicas to scale query capacity',
    'Replication lag typically < 1 second',
  ],

  quickCheck: {
    question: 'Why send reads to replicas instead of the primary?',
    options: [
      'Replicas are faster',
      'Offload reads from primary, increasing overall capacity',
      'It\'s required by the database',
      'Replicas have more storage',
    ],
    correctIndex: 1,
    explanation: 'With 80:1 read:write ratio, sending reads to replicas frees up the primary for writes and increases total read capacity.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'Handles all writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy, stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promote replica when primary fails', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'supply-chain-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs need reliable data storage',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
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
    level1: 'Click on Database, find replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2. This creates read copies.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Message Queue for External Integrations
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔌',
  scenario: "Carrier APIs (FedEx, UPS, DHL) send shipment updates every 5 minutes. Your app servers are overwhelmed!",
  hook: "Processing these updates synchronously is blocking user requests. Dashboard is slow!",
  challenge: "Add a message queue to process external updates asynchronously.",
  illustration: 'api-overload',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'External integrations are now decoupled!',
  achievement: 'Background workers process updates without blocking user requests',
  metrics: [
    { label: 'User request latency', before: '2000ms', after: '150ms' },
    { label: 'Update processing', after: 'Async' },
    { label: 'System throughput', before: '1x', after: '5x' },
  ],
  nextTeaser: "Congratulations! You've built a production-ready supply chain platform!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Event-Driven Architecture for Supply Chain',
  conceptExplanation: `A **Message Queue** enables asynchronous processing of external events.

**Architecture:**
1. Carrier APIs send updates → Message Queue (RabbitMQ/SQS)
2. Background workers pull from queue
3. Workers update database and invalidate cache
4. User requests remain fast and unaffected

**Supply chain events:**
- Shipment location updates (from carrier APIs)
- Inventory adjustments (from warehouse systems)
- Supplier price updates (from EDI systems)
- Stock alerts (threshold-based notifications)

**Benefits:**
- Decouples external systems from user-facing APIs
- Handles traffic spikes gracefully (queue buffers)
- Retry failed updates automatically
- Scale workers independently`,

  whyItMatters: 'External APIs are slow and unreliable. Processing them synchronously would make your entire system slow.',

  famousIncident: {
    title: 'Amazon Prime Day Outage',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'Prime Day started with website crashes due to overwhelmed servers processing inventory updates. Internal event stream (similar to message queue) couldn\'t handle the spike. Fixed by scaling event processing infrastructure.',
    lessonLearned: 'Event-driven architecture needs to scale independently. Queue size and worker capacity must match peak load.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing inventory updates from millions of merchants',
    howTheyDoIt: 'Uses Kafka for event streaming. When inventory changes, event published to Kafka. Workers consume events to update search index, analytics, and notifications.',
  },

  diagram: `
External APIs                Message Queue              Workers
─────────────               ──────────────            ───────────

┌──────────┐                                          ┌─────────┐
│  FedEx   │──── Shipment ────▶ ┌─────────┐   ┌────▶ │ Worker 1│
│   API    │      Update        │         │   │      └─────────┘
└──────────┘                    │ RabbitMQ│───┤      ┌─────────┐
┌──────────┐                    │  Queue  │   ├────▶ │ Worker 2│
│   UPS    │──── Location ────▶ │         │   │      └─────────┘
│   API    │      Update        │         │   │      ┌─────────┐
└──────────┘                    └─────────┘   └────▶ │ Worker 3│
                                                      └─────────┘
                                                           │
                                                           │ Update DB
                                                           │ Invalidate cache
                                                           ▼
                                                    ┌──────────┐
                                                    │ Database │
                                                    └──────────┘
`,

  keyPoints: [
    'Message queue buffers external events',
    'Background workers process asynchronously',
    'User requests stay fast and responsive',
    'Workers can retry failed updates',
    'Scale workers independently of app servers',
  ],

  quickCheck: {
    question: 'Why process carrier API updates asynchronously instead of synchronously?',
    options: [
      'It\'s easier to implement',
      'Prevents slow external APIs from blocking user requests',
      'It uses less memory',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'External APIs can take seconds to respond. Processing them in the request path would make all user requests slow. Async processing keeps user experience fast.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for asynchronous events', icon: '📬' },
    { title: 'Background Worker', explanation: 'Processes events outside request path', icon: '⚙️' },
    { title: 'Event-Driven', explanation: 'React to events asynchronously', icon: '⚡' },
  ],
};

const step8: GuidedStep = {
  id: 'supply-chain-step-8',
  stepNumber: 8,
  frIndex: 2,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-3: Logistics tracking with external API integration',
    taskDescription: 'Add a Message Queue for asynchronous event processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Process carrier API updates asynchronously', displayName: 'Message Queue (RabbitMQ)' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
      'Message Queue connected to Database (via workers)',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add a Message Queue (RabbitMQ) component for asynchronous processing',
    level2: 'Connect App Server to Message Queue. External API updates will be processed by background workers.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const supplyChainCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'supply-chain-cache',
  title: 'Design Supply Chain Visibility Platform',
  description: 'Build a real-time supply chain system with inventory tracking, supplier management, and logistics visibility',
  difficulty: 'intermediate',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🏗️',
    hook: "You've been hired as Lead Architect at Global Supply Co!",
    scenario: "Your mission: Build a supply chain visibility platform for 50 warehouses, tracking millions of SKUs and thousands of daily shipments.",
    challenge: "Can you design a system that provides real-time inventory visibility with 5-second freshness while handling 400 reads/sec at peak?",
  },

  requirementsPhase: supplyChainRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Client-Server Architecture',
    'API Design for Supply Chain',
    'Database Partitioning by Warehouse',
    'Multi-Layer Caching Strategy',
    'Cache Invalidation',
    'Load Balancing',
    'Horizontal Scaling',
    'Database Replication',
    'Read/Write Splitting',
    'Event-Driven Architecture',
    'Message Queues',
    'Asynchronous Processing',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 7: Transactions',
    'Chapter 11: Stream Processing',
  ],
};

export default supplyChainCacheGuidedTutorial;
