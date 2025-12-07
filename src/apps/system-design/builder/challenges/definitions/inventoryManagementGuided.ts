import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Inventory Management Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a distributed inventory management system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (distributed inventory, warehouse sync, reservations)
 *
 * Key Concepts:
 * - Stock level tracking across warehouses
 * - Reservation patterns (temporary holds)
 * - Distributed inventory consistency
 * - Warehouse synchronization
 * - Optimistic vs pessimistic locking
 * - Eventual consistency for stock levels
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const inventoryManagementRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a distributed inventory management system for an e-commerce platform",

  interviewer: {
    name: 'Alex Rodriguez',
    role: 'Senior Systems Architect at WarehouseOps Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-inventory',
      category: 'functional',
      question: "What's the core functionality for inventory management?",
      answer: "The system needs to:\n\n1. **Track stock levels** - Know how many units are available per product\n2. **Reserve inventory** - Hold items temporarily during checkout\n3. **Confirm/release reservations** - Finalize or cancel holds\n4. **Update stock** - Add/remove inventory from the system",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Inventory is about knowing what you have, holding it temporarily, and updating it accurately",
    },
    {
      id: 'stock-tracking',
      category: 'functional',
      question: "How should we track stock levels?",
      answer: "We need real-time visibility:\n1. **Available stock** - Items ready to sell\n2. **Reserved stock** - Items in active carts/checkout\n3. **Total stock** - Physical inventory in warehouses\n\nFormula: Available = Total - Reserved",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Stock tracking is more than a counter - need to distinguish available vs reserved",
    },
    {
      id: 'reservation-flow',
      category: 'functional',
      question: "What happens when a customer adds items to their cart?",
      answer: "We create a **temporary reservation**:\n1. **Check availability** - Ensure stock exists\n2. **Create reservation** - Hold items for 10 minutes\n3. **Extend on checkout** - Keep hold during payment\n4. **Commit or release** - Finalize purchase or return to available pool\n\nReservations prevent overselling without locking inventory forever.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Reservations are time-limited holds that prevent race conditions during checkout",
    },
    {
      id: 'distributed-warehouses',
      category: 'functional',
      question: "Do we need to support multiple warehouses?",
      answer: "Yes! For MVP, support:\n1. **Multiple warehouse locations** - East Coast, West Coast, etc.\n2. **Per-warehouse stock levels** - Product X has 50 units in NYC, 30 in LA\n3. **Smart allocation** - Reserve from nearest warehouse to customer\n\nThis reduces shipping times and costs.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Distributed inventory is complex - need to track stock per location and allocate smartly",
    },
    {
      id: 'warehouse-sync',
      category: 'functional',
      question: "How do warehouses update their inventory counts?",
      answer: "Warehouses need to:\n1. **Push updates** - Report new shipments, damage, theft\n2. **Reconcile daily** - Sync physical counts with system\n3. **Handle conflicts** - What if system shows 100 but warehouse has 95?\n\nFor MVP, we'll accept warehouse updates and reconcile nightly.",
      importance: 'important',
      revealsRequirement: 'FR-6',
      learningPoint: "Physical inventory and digital counts can drift - need reconciliation process",
    },
    {
      id: 'stock-alerts',
      category: 'clarification',
      question: "Should we alert when stock is low?",
      answer: "Yes, but for MVP, we can defer this. Low stock alerts are important but not critical for core functionality. Focus on accurate tracking first.",
      importance: 'nice-to-have',
      insight: "Monitoring is important but comes after core functionality works",
    },

    // SCALE & NFRs
    {
      id: 'throughput-reservations',
      category: 'throughput',
      question: "How many reservation requests per day?",
      answer: "50 million add-to-cart events per day (customers browsing and adding items)",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 reservations/sec",
        result: "~579 reservations/sec average, ~2,000 at peak",
      },
      learningPoint: "High reservation volume - need efficient locking and fast lookups",
    },
    {
      id: 'throughput-updates',
      category: 'throughput',
      question: "How many stock updates per day?",
      answer: "10 million stock updates per day (purchases, warehouse receipts, cancellations)",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 116 updates/sec",
        result: "~116 writes/sec average, ~350 at peak",
      },
      learningPoint: "Updates are less frequent than reads but must be accurate",
    },
    {
      id: 'throughput-lookups',
      category: 'throughput',
      question: "How many stock level checks per day?",
      answer: "500 million stock lookups per day (product pages, search results, cart validation)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 reads/sec",
        result: "~5,787 reads/sec average, ~20,000 at peak",
      },
      learningPoint: "Heavily read-dominated (50:1 read/write ratio) - perfect for caching",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "How strict are consistency requirements for inventory?",
      answer: "It depends:\n- **Stock updates** - Strong consistency required (can't oversell)\n- **Stock displays** - Eventual consistency OK (slight delays acceptable)\n- **Reservations** - Strong consistency required (prevent race conditions)\n\nWe'll use different strategies for each.",
      importance: 'critical',
      learningPoint: "Not all data needs same consistency - apply the right strategy per use case",
    },
    {
      id: 'race-conditions',
      category: 'reliability',
      question: "What if two customers try to buy the last item simultaneously?",
      answer: "We need **atomic operations**:\n1. Use database transactions with row-level locking\n2. Or use optimistic locking with version numbers\n3. One customer succeeds, the other gets 'out of stock' message\n\nThis is the classic inventory race condition problem!",
      importance: 'critical',
      learningPoint: "Preventing overselling requires atomic compare-and-swap operations",
    },
    {
      id: 'latency-reservation',
      category: 'latency',
      question: "How fast should reservation requests be?",
      answer: "p99 under 100ms. Users are adding to cart - slow responses hurt conversion.",
      importance: 'critical',
      learningPoint: "Cart operations must be fast to maintain smooth shopping experience",
    },
    {
      id: 'warehouse-count',
      category: 'scale',
      question: "How many warehouses should we support?",
      answer: "Start with 10 warehouses, design to scale to 100+. Each warehouse tracks inventory independently.",
      importance: 'important',
      insight: "Start small but design data model to support distributed warehouses",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-inventory', 'reservation-flow', 'distributed-warehouses', 'race-conditions'],
  criticalFRQuestionIds: ['core-inventory', 'reservation-flow', 'distributed-warehouses'],
  criticalScaleQuestionIds: ['throughput-lookups', 'consistency-requirements', 'race-conditions'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Track stock levels',
      description: 'Real-time visibility into available, reserved, and total inventory',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Reserve inventory',
      description: 'Temporarily hold items during checkout with time limits',
      emoji: '🔒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Confirm/release reservations',
      description: 'Finalize purchases or return items to available pool',
      emoji: '✅',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Update stock levels',
      description: 'Add/remove inventory from the system',
      emoji: '🔄',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Multi-warehouse support',
      description: 'Track inventory across distributed warehouse locations',
      emoji: '🏭',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Warehouse synchronization',
      description: 'Sync physical counts with digital inventory',
      emoji: '🔗',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million shoppers',
    writesPerDay: '10 million stock updates',
    readsPerDay: '500 million stock lookups',
    peakMultiplier: 3,
    readWriteRatio: '50:1',
    calculatedWriteRPS: { average: 116, peak: 350 },
    calculatedReadRPS: { average: 5787, peak: 20000 },
    maxPayloadSize: '~1KB (stock update)',
    storagePerRecord: '~500 bytes (inventory record)',
    storageGrowthPerYear: '~50GB',
    redirectLatencySLA: 'p99 < 50ms (stock lookup)',
    createLatencySLA: 'p99 < 100ms (reservation)',
  },

  architecturalImplications: [
    '✅ Read-heavy (50:1) → Aggressive caching for stock levels',
    '✅ Race conditions → Row-level locking or optimistic locking',
    '✅ 20K reads/sec at peak → Redis cache for stock lookups',
    '✅ Distributed warehouses → Per-warehouse inventory partitioning',
    '✅ Reservations → Time-based TTL with background cleanup',
    '✅ Strong consistency for updates → ACID transactions',
  ],

  outOfScope: [
    'Low stock alerts/notifications',
    'Predictive inventory management',
    'Supplier integration',
    'Returns/refunds inventory',
    'Multi-region replication',
    'Historical inventory analytics',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that tracks stock and handles reservations for a single warehouse. The distributed warehouse challenges and synchronization will come in later steps. Functionality first, then distribution!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📦',
  scenario: "Welcome to WarehouseOps Inc! You've been hired to build an inventory management system.",
  hook: "Your first warehouse manager needs to check stock levels!",
  challenge: "Set up the basic request flow so clients can reach your inventory server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your inventory system is online!',
  achievement: 'Clients can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to track inventory yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Inventory API Architecture',
  conceptExplanation: `Every inventory system starts with a **Client** connecting to a **Server**.

When a warehouse manager checks stock:
1. Their application (web/mobile) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes inventory operations and returns results

This is the foundation of ALL inventory systems!`,

  whyItMatters: 'Without this connection, no one can track inventory or make reservations.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Managing inventory across 175+ fulfillment centers',
    howTheyDoIt: 'Started with simple inventory tracking in 1995, now uses distributed systems managing billions of items',
  },

  keyPoints: [
    'Client = warehouse apps, e-commerce sites, mobile apps',
    'App Server = your backend that handles inventory logic',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Applications that need inventory data', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that manages inventory operations', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'inventory-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents warehouse apps and e-commerce sites', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles inventory tracking and reservations', displayName: 'App Server' },
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
// STEP 2: Implement Inventory APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to manage inventory!",
  hook: "A warehouse manager tried to check stock for Product #123 but got an error.",
  challenge: "Write the Python code to handle stock lookups, reservations, and updates.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your inventory APIs are live!',
  achievement: 'You implemented the core inventory management functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can check stock', after: '✓' },
    { label: 'Can reserve items', after: '✓' },
    { label: 'Can update inventory', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all inventory data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Inventory Handlers',
  conceptExplanation: `Every inventory API needs a **handler function** that:
1. Receives the request
2. Processes inventory operations
3. Returns a response

For Inventory Management, we need handlers for:
- \`get_stock(product_id, warehouse_id)\` - Check available stock
- \`reserve_inventory(product_id, quantity, customer_id)\` - Hold items temporarily
- \`confirm_reservation(reservation_id)\` - Finalize a purchase
- \`release_reservation(reservation_id)\` - Return items to available pool
- \`update_stock(product_id, warehouse_id, quantity)\` - Adjust inventory levels

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your system is just a fancy placeholder. This is where inventory magic happens!',

  famousIncident: {
    title: 'Target Canada Inventory Disaster',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target\'s inventory system had critical bugs that showed items in stock when they weren\'t. Customers ordered products that never arrived. The fiasco cost Target $2 billion and led to their exit from Canada.',
    lessonLearned: 'Inventory accuracy is non-negotiable. Test thoroughly and start simple.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Managing inventory for millions of products',
    howTheyDoIt: 'Their Inventory Service uses atomic operations and row-level locking to prevent overselling',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Track available vs reserved stock separately',
    'Handle edge cases (insufficient stock, invalid IDs, etc.)',
  ],

  quickCheck: {
    question: 'Why track available and reserved stock separately?',
    options: [
      'It uses less memory',
      'To prevent overselling - reserved items are not available for new orders',
      'It\'s faster',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'Separating available and reserved stock prevents race conditions where the same item is sold to multiple customers.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Available Stock', explanation: 'Items ready to sell', icon: '✅' },
    { title: 'Reserved Stock', explanation: 'Items temporarily held', icon: '🔒' },
  ],
};

const step2: GuidedStep = {
  id: 'inventory-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Track stock, FR-2: Reservations, FR-4: Updates',
    taskDescription: 'Configure APIs and implement Python handlers for inventory management',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/inventory/stock, POST /api/v1/inventory/reserve, POST /api/v1/inventory/update APIs',
      'Open the Python tab',
      'Implement get_stock(), reserve_inventory(), confirm_reservation(), and update_stock() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign inventory endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for get_stock, reserve_inventory, confirm_reservation, and update_stock',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/inventory/stock', 'POST /api/v1/inventory/reserve', 'POST /api/v1/inventory/update'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Inventory Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed overnight...",
  hook: "When it restarted, ALL inventory counts were GONE! Warehouses are in chaos - no one knows what's in stock.",
  challenge: "Add a database so inventory data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your inventory is safe forever!',
  achievement: 'Stock levels and reservations now persist across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But stock lookups are getting slow as inventory grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Inventory',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Inventory data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient lookups by product, warehouse, etc.
- **Transactions**: ACID guarantees for stock updates

For Inventory, we need tables for:
- \`inventory\` - Stock levels per product per warehouse
- \`reservations\` - Temporary holds with expiration times
- \`products\` - Product catalog
- \`warehouses\` - Warehouse locations`,

  whyItMatters: 'Imagine losing ALL your inventory data because of a server restart. Warehouses would have no idea what they have!',

  famousIncident: {
    title: 'Knight Capital Trading Glitch',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A software deployment bug caused their trading system to lose track of inventory positions. In 45 minutes, they lost $440 million due to incorrect stock tracking.',
    lessonLearned: 'Persistent, accurate inventory tracking is critical. Always use durable storage.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Tracking inventory for 2.3 million items across 10,500 stores',
    howTheyDoIt: 'Uses distributed databases with real-time replication to maintain accurate inventory counts globally',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Use PostgreSQL for ACID transactions',
    'Design schema: inventory, reservations, products, warehouses',
    'Row-level locking prevents race conditions',
  ],

  quickCheck: {
    question: 'What happens to in-memory inventory data when a server restarts?',
    options: [
      'It\'s automatically saved',
      'It\'s backed up to the cloud',
      'It\'s completely lost',
      'It\'s restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
    { title: 'Row Locking', explanation: 'Prevent concurrent updates to same inventory', icon: '🔐' },
  ],
};

const step3: GuidedStep = {
  id: 'inventory-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store inventory levels, reservations, products permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Stock Levels
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now track 100,000 products across warehouses, and stock lookups are taking 200ms+!",
  hook: "Every product page hits the database to check stock. Your e-commerce site is lagging.",
  challenge: "Add a cache to make stock lookups lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Stock lookups are 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Stock lookup latency', before: '200ms', after: '10ms' },
    { label: 'Cache hit rate', after: '90%' },
    { label: 'Database load', before: '100%', after: '10%' },
  ],
  nextTeaser: "But what happens when traffic spikes during a flash sale?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier for Inventory',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Inventory, we cache:
- **Stock levels** - Available/reserved counts per product per warehouse
- **Product metadata** - Names, SKUs, descriptions
- **Reservation status** - Active holds and their expiration times

**Cache invalidation strategy:**
- Update cache immediately when stock changes
- Set short TTL (30-60 seconds) for eventual consistency
- On checkout, always read from database for accuracy`,

  whyItMatters: 'At 20K stock lookups/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Best Buy Inventory Cache Disaster',
    company: 'Best Buy',
    year: '2020',
    whatHappened: 'During PS5 launch, their inventory cache had a 5-minute TTL. Customers saw "in stock" for items that sold out 4 minutes ago. Thousands of failed orders and angry customers.',
    lessonLearned: 'Cache TTL for inventory must be short (30-60s). For checkout, always read from source of truth.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Serving 20,000 inventory lookups per second during Prime Day',
    howTheyDoIt: 'Uses ElastiCache (Redis) with 30-second TTL for stock displays, but reads from database during checkout',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
                     │   Return instantly!
                     │
                     │   On stock update:
                     │   1. Update database
                     │   2. Invalidate cache
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = instant response (1ms)',
    'Cache Miss = fetch from DB, store in cache',
    'Use short TTL (30-60s) to balance speed vs accuracy',
    'Always read from DB for checkout to prevent overselling',
  ],

  quickCheck: {
    question: 'Why read from database during checkout instead of cache?',
    options: [
      'Database is faster',
      'Cache might be stale - can\'t risk overselling based on old data',
      'It\'s easier to implement',
      'Database has better security',
    ],
    correctIndex: 1,
    explanation: 'Cache can be stale. During checkout, we need 100% accurate stock counts to prevent overselling. Read from source of truth (database).',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'inventory-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Track stock (with fast caching)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache stock levels and product data', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (60 seconds for stock levels)',
      'Cache strategy set (write-through)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 60 seconds, strategy to write-through',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'write-through' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer and Scale App Servers
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Flash sale alert! Traffic just spiked 10x!",
  hook: "Your single app server is maxed out at 100% CPU. Reservation requests are timing out. Customers are losing items from their carts!",
  challenge: "Add a load balancer and scale to multiple app server instances.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Your system can now handle flash sales!',
  achievement: 'Load balancer distributes traffic across servers',
  metrics: [
    { label: 'App Server instances', before: '1', after: '5' },
    { label: 'Request capacity', before: '500/sec', after: '2,500/sec' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "But you need to support multiple warehouses now...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Horizontal Scaling for Inventory',
  conceptExplanation: `A **Load Balancer** distributes incoming requests across multiple servers.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers during flash sales
- **Even distribution** - no single server gets overwhelmed

For inventory systems:
- Each app server connects to shared database and cache
- Load balancer uses round-robin or least-connections
- All servers see the same inventory state (via shared DB/cache)`,

  whyItMatters: 'During flash sales, reservation requests spike 10x. A single server can\'t handle it alone.',

  famousIncident: {
    title: 'PlayStation 5 Launch Inventory Chaos',
    company: 'Multiple retailers',
    year: '2020',
    whatHappened: 'During PS5 launch, multiple retailer websites crashed because their inventory systems couldn\'t handle the traffic spike. Single points of failure led to outages.',
    lessonLearned: 'Load balancers + horizontal scaling are essential for handling traffic spikes during product launches.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Handling Black Friday traffic spikes',
    howTheyDoIt: 'Uses auto-scaling groups with load balancers to handle 10x traffic during sales events',
  },

  diagram: `
              ┌─────────────┐
              │ App Server 1│ ──┐
┌────────┐   ┌──────────────┐   │   ┌─────────┐
│ Client │──▶│Load Balancer │──▶│──▶│  Cache  │
└────────┘   └──────────────┘   │   └─────────┘
              │ App Server 2│ ──┘        │
              │ App Server 3│ ──────▶ Database
              └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes requests across app servers',
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'All servers share same cache and database',
  ],

  quickCheck: {
    question: 'Why do all app servers share the same cache and database?',
    options: [
      'It\'s cheaper',
      'To ensure all servers see the same inventory state',
      'It\'s faster',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Shared cache and database ensure all servers have a consistent view of inventory. This prevents overselling.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Shared State', explanation: 'All servers access same DB/cache', icon: '🔗' },
  ],
};

const step5: GuidedStep = {
  id: 'inventory-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from horizontal scaling',
    taskDescription: 'Add a Load Balancer and scale App Server to 5 instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across app servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
      'App Server scaled to 5 instances',
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
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas. Reconnect: Client → Load Balancer → App Server',
    level2: 'Click App Server and set instances to 5 in the Configuration tab',
    solutionComponents: [{ type: 'load_balancer' }, { type: 'app_server', config: { instances: 5 } }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Database Replication for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database crashed for 15 minutes last night during peak hours!",
  hook: "EVERYTHING stopped:\n- No stock lookups\n- No reservations\n- No updates\nRevenue loss: $750,000. Your job is on the line.",
  challenge: "Add database replication so inventory data is always available.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Inventory database is now fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
    { label: 'Failover time', after: '< 30 seconds' },
  ],
  nextTeaser: "But you need to support multiple distributed warehouses...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Inventory Data',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes (stock updates, reservations)
- **Replicas (Followers)**: Handle reads (stock lookups)

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute stock lookups across replicas
- **Data safety**: Multiple copies of your inventory data

For Inventory:
- Write stock updates to primary
- Read stock levels from replicas (cache first)
- Critical operations (checkout) read from primary for accuracy`,

  whyItMatters: 'A single database is a single point of failure. For inventory, downtime means lost sales.',

  famousIncident: {
    title: 'Etsy Inventory Database Outage',
    company: 'Etsy',
    year: '2017',
    whatHappened: 'Their primary database failed and they had no automated failover. Site was down for 2 hours. Sellers lost $2M+ in sales during the holiday season.',
    lessonLearned: 'Database replication with automatic failover is mandatory for inventory systems.',
    icon: '🛍️',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Zero tolerance for inventory data loss',
    howTheyDoIt: 'Uses MySQL with multi-region replication and automatic failover. Inventory writes go to primary, reads from replicas.',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │  (stock updates) │
                         └────────┬─────────┘
                                  │ Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read:   │       │  (Read:   │       │  (Read:   │
       │  stock)   │       │  stock)   │       │  stock)   │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Primary handles writes (stock updates), replicas handle reads',
    'If primary fails, a replica can be promoted',
    'Use replicas for read scaling - split lookups across them',
    'Critical reads (checkout) should use primary for accuracy',
  ],

  quickCheck: {
    question: 'Should stock lookups for checkout read from primary or replica?',
    options: [
      'Replica - it\'s faster',
      'Primary - stock counts must be 100% accurate, can\'t be stale',
      'Either one works',
      'Cache only',
    ],
    correctIndex: 1,
    explanation: 'During checkout, we need the most accurate stock count. Replicas may have replication lag. Always read from primary for critical operations.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'inventory-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

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

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2. This creates read copies of your inventory data.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Warehouse Sync
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🏭',
  scenario: "You now have 10 warehouses, each reporting inventory updates independently!",
  hook: "When a warehouse receives a shipment, it sends an update. But during peak times, updates are getting lost or delayed. Inventory counts are drifting from reality!",
  challenge: "Add a message queue to reliably process warehouse sync events.",
  illustration: 'data-sync-chaos',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Warehouse sync is now bulletproof!',
  achievement: 'Async processing ensures no updates are lost',
  metrics: [
    { label: 'Warehouse updates processed', after: '100%' },
    { label: 'Processing latency', before: '5s', after: '<500ms' },
    { label: 'Lost updates', before: '2%', after: '0%' },
  ],
  nextTeaser: "But how do you coordinate inventory across all warehouses?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Reliable Warehouse Synchronization',
  conceptExplanation: `Warehouses constantly send inventory updates: shipments received, items damaged, stock adjustments.

**The Problem:**
- Synchronous processing blocks the warehouse
- If app server is busy, updates are lost
- Spikes in updates overwhelm the system

**The Solution: Message Queue**
1. Warehouse sends update → Publish to queue
2. Return acknowledgment immediately (fast!)
3. Background workers consume queue and update inventory
4. If update fails → Retry automatically
5. Process updates in order per warehouse

**For Inventory, we queue:**
- Stock receipts (new shipments)
- Stock adjustments (damaged, lost, found)
- Inter-warehouse transfers
- Physical count reconciliations`,

  whyItMatters: 'Without queues:\n- Warehouse updates get lost\n- Inventory counts drift from reality\n- Can\'t handle spike in updates\n- No audit trail of changes',

  famousIncident: {
    title: 'Zara Inventory Sync Failure',
    company: 'Zara',
    year: '2019',
    whatHappened: 'During a system upgrade, warehouse sync updates were lost for 6 hours. Their inventory system showed incorrect stock levels. They had to close online sales until data was reconciled.',
    lessonLearned: 'Use message queues for warehouse sync - they provide buffering, retry, and audit trail.',
    icon: '👗',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Syncing inventory across 175+ fulfillment centers',
    howTheyDoIt: 'Uses Kinesis and SQS to stream warehouse updates with guaranteed delivery and ordering per warehouse',
  },

  diagram: `
Warehouse Receives Shipment
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ Warehouse   │────▶│          Message Queue              │
│ System      │     │  [update1, update2, update3...]     │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return ACK instantly       │ Workers consume
      ▼                            ▼
                          ┌─────────────────────┐
                          │  Inventory Workers  │
                          │  (background)       │
                          └──────────┬──────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  ▼                  ▼                  ▼
            Update DB           Update Cache    Send Notifications

            If fails → Retry with exponential backoff
`,

  keyPoints: [
    'Queue decouples warehouse updates from inventory processing',
    'Warehouse gets instant acknowledgment',
    'Workers process updates in background with retries',
    'Guaranteed delivery ensures no updates are lost',
    'Ordering per warehouse maintains consistency',
  ],

  quickCheck: {
    question: 'Why use a message queue for warehouse updates instead of synchronous processing?',
    options: [
      'It\'s cheaper',
      'Decouples warehouse systems from inventory DB, enables retries and buffering',
      'It\'s faster for the warehouse',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Queues allow instant warehouse acknowledgment while updates are processed reliably in the background. Critical for handling update spikes.',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Decouple slow operations from main flow', icon: '⚡' },
    { title: 'Guaranteed Delivery', explanation: 'Ensure all updates are processed', icon: '✅' },
    { title: 'Ordering', explanation: 'Process updates in sequence per warehouse', icon: '📋' },
  ],
};

const step7: GuidedStep = {
  id: 'inventory-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-6: Warehouse synchronization with reliable delivery',
    taskDescription: 'Add a Message Queue for async warehouse sync',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Process warehouse updates asynchronously', displayName: 'Kafka / SQS' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
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
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka/SQS) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async warehouse sync with retry.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Design Multi-Warehouse Distributed Inventory
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌎',
  scenario: "Success! You now have 50 warehouses across the country!",
  hook: "But coordinating inventory across them is a nightmare:\n- Should you reserve from the nearest warehouse?\n- What if that warehouse is out of stock?\n- How do you handle transfers between warehouses?",
  challenge: "Design a smart multi-warehouse inventory allocation strategy.",
  illustration: 'distributed-system',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a distributed inventory system!',
  achievement: 'Smart warehouse allocation with reliable synchronization',
  metrics: [
    { label: 'Warehouses supported', after: '50+' },
    { label: 'Stock lookup latency', after: '<50ms' },
    { label: 'Reservation success rate', after: '99.5%' },
    { label: 'Warehouse sync reliability', after: '100%' },
    { label: 'Zero overselling incidents', after: '✓' },
  ],
  nextTeaser: "You've mastered distributed inventory management!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Inventory: Multi-Warehouse Coordination',
  conceptExplanation: `Managing inventory across warehouses requires smart strategies:

**Warehouse Selection Strategy:**
1. **Nearest warehouse first** - Minimize shipping time/cost
2. **Fallback to other warehouses** - If nearest is out of stock
3. **Split shipments** - Fulfill from multiple warehouses if needed
4. **Reserve before confirming** - Lock stock at chosen warehouse

**Consistency Challenges:**
- Each warehouse is a separate inventory partition
- Stock levels must be accurate per warehouse
- Reservations must not span warehouses (complexity)
- Transfers between warehouses take time

**Architecture:**
- Partition inventory table by warehouse_id
- Each warehouse has its own stock counter
- Use distributed transactions for transfers
- Cache stock levels per warehouse
- Message queue for warehouse-to-warehouse transfers`,

  whyItMatters: 'Multi-warehouse inventory is the key to:\n- Faster shipping (2-day vs 5-day)\n- Lower costs (ship from nearest location)\n- Better availability (more total stock)\n- Regional resilience',

  famousIncident: {
    title: 'Nike Inventory System Failure',
    company: 'Nike',
    year: '2001',
    whatHappened: 'Nike deployed a new multi-warehouse inventory system that had bugs in warehouse allocation logic. It caused $100M in lost sales due to incorrect stock routing and overselling.',
    lessonLearned: 'Multi-warehouse inventory is complex. Test extensively and start simple before optimizing.',
    icon: '👟',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Managing inventory across 10,500 stores and 150+ distribution centers',
    howTheyDoIt: 'Uses zone-based partitioning with smart allocation algorithms. Each region manages its own inventory with eventual consistency across zones.',
  },

  diagram: `
Customer Checkout (California)
      │
      ▼
┌─────────────────┐
│  Smart Router   │ ──▶ Check stock at LA Warehouse (nearest)
└─────────────────┘         │
      │                     ▼ Available?
      │              ┌──────────────┐
      │              │ LA Warehouse │ ──▶ Reserve stock
      │              └──────────────┘
      │
      ▼ If out of stock
      ──▶ Check Phoenix Warehouse (next nearest)
              │
              ▼ Available?
       ┌──────────────────┐
       │ Phoenix Warehouse│ ──▶ Reserve stock
       └──────────────────┘
`,

  keyPoints: [
    'Partition inventory by warehouse_id for independent scaling',
    'Implement smart warehouse selection (nearest first)',
    'Use cache per warehouse for fast lookups',
    'Message queues for warehouse transfers',
    'Accept eventual consistency for stock displays, strong for reservations',
  ],

  quickCheck: {
    question: 'Why partition inventory by warehouse instead of keeping one global pool?',
    options: [
      'It\'s cheaper',
      'Enables independent scaling, faster lookups, and regional resilience',
      'It\'s easier to implement',
      'Reduces storage costs',
    ],
    correctIndex: 1,
    explanation: 'Partitioning by warehouse allows each region to scale independently and provides faster lookups by reducing query scope.',
  },

  keyConcepts: [
    { title: 'Partitioning', explanation: 'Split data by warehouse for scalability', icon: '🗂️' },
    { title: 'Smart Routing', explanation: 'Select optimal warehouse for fulfillment', icon: '🧭' },
    { title: 'Eventual Consistency', explanation: 'Accept slight delays for non-critical data', icon: '⏱️' },
  ],
};

const step8: GuidedStep = {
  id: 'inventory-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-5: Multi-warehouse distributed inventory management',
    taskDescription: 'Review your architecture for distributed warehouse support',
    successCriteria: [
      'All components properly configured',
      'Database partitioned by warehouse_id',
      'Cache configured per warehouse',
      'Message queue for warehouse sync',
      'Load balancing for scalability',
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
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Review all components - ensure load balancer, caching, replication, and message queue are configured',
    level2: 'Your architecture should support: horizontal scaling (5+ app servers), database replication, caching (write-through), and message queue for warehouse sync',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const inventoryManagementGuidedTutorial: GuidedTutorial = {
  problemId: 'inventory-management',
  title: 'Design Inventory Management System',
  description: 'Build a distributed inventory system with stock tracking, reservations, and multi-warehouse support',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📦',
    hook: "You've been hired as Lead Engineer at WarehouseOps Inc!",
    scenario: "Your mission: Build a distributed inventory management system that can handle millions of stock lookups, prevent overselling, and coordinate inventory across 50+ warehouses.",
    challenge: "Can you design a system that maintains accuracy while scaling to handle flash sales and warehouse synchronization?",
  },

  requirementsPhase: inventoryManagementRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Inventory API Design',
    'Stock Level Tracking',
    'Reservation Patterns',
    'Database Persistence',
    'ACID Transactions',
    'Caching Strategies',
    'Write-Through Cache',
    'Load Balancing',
    'Horizontal Scaling',
    'Database Replication',
    'Message Queues',
    'Warehouse Synchronization',
    'Distributed Inventory',
    'Multi-Warehouse Coordination',
    'Data Partitioning',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Database replicas)',
    'Chapter 6: Partitioning (Warehouse-based partitioning)',
    'Chapter 7: Transactions (Stock update atomicity)',
    'Chapter 8: Distributed Systems (Multi-warehouse consistency)',
  ],
};

export default inventoryManagementGuidedTutorial;
