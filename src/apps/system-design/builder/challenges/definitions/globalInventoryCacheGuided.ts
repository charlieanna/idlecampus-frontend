import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Global Inventory Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 7-step tutorial that teaches system design concepts
 * while building a distributed inventory management system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-7: Scale with NFRs (cache, replication, eventual consistency)
 *
 * Key Concepts:
 * - Distributed inventory tracking
 * - Cache-aside pattern for stock levels
 * - Eventual consistency with write-through cache
 * - Cache invalidation strategies
 * - Multi-region inventory synchronization
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const globalInventoryCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a global inventory management system with caching",

  interviewer: {
    name: 'Marcus Thompson',
    role: 'Staff Engineer at Global Retail Corp',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-inventory',
      category: 'functional',
      question: "What's the core functionality needed for inventory management?",
      answer: "The system needs to:\n\n1. **Check stock levels** - Users query if a product is in stock at a warehouse\n2. **Reserve inventory** - When a customer adds to cart, temporarily hold stock\n3. **Update stock** - Decrement inventory when order is placed, increment on restock\n4. **Release reservations** - Free up stock if cart expires or checkout fails",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Inventory is about tracking, reserving, and updating stock in real-time",
    },
    {
      id: 'stock-accuracy',
      category: 'functional',
      question: "How accurate do stock levels need to be?",
      answer: "Stock accuracy is critical but can tolerate brief staleness:\n\n- **Overselling is NEVER acceptable** - Can't sell items we don't have\n- **Underselling is tolerable** - OK to show 'out of stock' when we have 1-2 items (temporary)\n- **Eventual consistency is fine** - Stock updates can take a few seconds to propagate globally",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Strong consistency for decrements, eventual consistency for reads",
    },
    {
      id: 'multi-warehouse',
      category: 'functional',
      question: "Do we need to track inventory across multiple warehouses?",
      answer: "Yes! We have warehouses globally:\n- US East, US West, EU, Asia\n- Each warehouse has independent stock levels\n- Users should see aggregated stock ('10 available' across all warehouses)\n- Orders pull from nearest warehouse",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Distributed inventory requires aggregation and routing logic",
    },
    {
      id: 'reservation-duration',
      category: 'clarification',
      question: "How long should cart reservations last?",
      answer: "15 minutes. If a customer doesn't checkout within 15 minutes, release the reserved stock back to available inventory. This prevents stock from being locked indefinitely.",
      importance: 'important',
      insight: "Time-based reservations balance UX and inventory availability",
    },
    {
      id: 'negative-inventory',
      category: 'clarification',
      question: "What if two customers try to buy the last item simultaneously?",
      answer: "First request wins! Use atomic operations to decrement stock. If stock would go negative, reject the second request with 'out of stock' error. Never allow negative inventory.",
      importance: 'critical',
      insight: "Race conditions on last item require atomic compare-and-swap operations",
    },

    // SCALE & NFRs
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many stock level queries per second?",
      answer: "100,000 queries per second globally at peak (holiday shopping). Users check stock on product pages before adding to cart.",
      importance: 'critical',
      calculation: {
        formula: "100K reads/sec across all products",
        result: "~100K read QPS, heavily skewed to popular items",
      },
      learningPoint: "Read-heavy workload with hot products - perfect for caching",
    },
    {
      id: 'throughput-updates',
      category: 'throughput',
      question: "How many inventory updates per second?",
      answer: "5,000 updates per second (orders + restocking). Much lower than reads - about 20:1 read-to-write ratio.",
      importance: 'critical',
      calculation: {
        formula: "5K writes/sec across all operations",
        result: "~5K write QPS - atomic decrements are critical",
      },
      learningPoint: "Write-through cache with invalidation on updates",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "How fast should stock level checks be?",
      answer: "p99 under 50ms. Users see stock levels on product pages - slow checks hurt conversion. Cache hits should be <10ms.",
      importance: 'critical',
      learningPoint: "Ultra-low latency requires aggressive caching strategy",
    },
    {
      id: 'hot-products',
      category: 'throughput',
      question: "What about viral products? Like a limited edition item?",
      answer: "Hot products can get 10,000+ queries/sec on a single SKU! Example: limited sneaker drop, concert tickets. Need cache to handle thundering herd problem.",
      importance: 'critical',
      insight: "Hot keys require special handling - cache sharding or read replicas",
    },
    {
      id: 'cache-consistency',
      category: 'consistency',
      question: "What happens if cache shows stock but database says out of stock?",
      answer: "This is acceptable for brief periods (eventual consistency). When a user tries to checkout, we check the database (source of truth). If actually out of stock, show error. Cache can be 5-10 seconds stale.",
      importance: 'critical',
      learningPoint: "Cache is for performance, database is source of truth",
    },
    {
      id: 'restock-events',
      category: 'clarification',
      question: "How often do warehouses get restocked?",
      answer: "Multiple times per day. Large deliveries (1000+ units) come in, and we need to update inventory. These bulk updates should invalidate cache efficiently.",
      importance: 'important',
      insight: "Bulk operations need optimized cache invalidation patterns",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-inventory', 'stock-accuracy', 'negative-inventory'],
  criticalFRQuestionIds: ['core-inventory', 'stock-accuracy', 'multi-warehouse'],
  criticalScaleQuestionIds: ['throughput-queries', 'hot-products', 'cache-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Check stock levels',
      description: 'Users can query current stock for any product at any warehouse',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Reserve inventory',
      description: 'Temporarily hold stock when customer adds to cart (15 min TTL)',
      emoji: '🔒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Update inventory',
      description: 'Decrement stock on purchase, increment on restock',
      emoji: '📝',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Release reservations',
      description: 'Free up reserved stock when cart expires or checkout fails',
      emoji: '🔓',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Prevent overselling',
      description: 'Never allow stock to go negative - atomic operations required',
      emoji: '🚫',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Multi-warehouse tracking',
      description: 'Track inventory across multiple warehouses globally',
      emoji: '🌍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million shoppers',
    writesPerDay: '432 million updates',
    readsPerDay: '8.64 billion stock checks',
    peakMultiplier: 3,
    readWriteRatio: '20:1',
    calculatedWriteRPS: { average: 5000, peak: 15000 },
    calculatedReadRPS: { average: 100000, peak: 300000 },
    maxPayloadSize: '~200 bytes (stock record)',
    storagePerRecord: '~100 bytes (SKU + warehouse + quantity)',
    storageGrowthPerYear: '~50GB (inventory history)',
    redirectLatencySLA: 'p99 < 50ms (stock check)',
    createLatencySLA: 'p99 < 100ms (inventory update)',
  },

  architecturalImplications: [
    '✅ 100K reads/sec → Aggressive caching with Redis/Memcached',
    '✅ Hot products → Cache sharding to prevent thundering herd',
    '✅ Prevent overselling → Atomic decrements at database level',
    '✅ Multi-warehouse → Partition by warehouse_id for scalability',
    '✅ Eventual consistency → Write-through cache with TTL-based invalidation',
    '✅ Stock updates → Invalidate cache on every write',
  ],

  outOfScope: [
    'Inventory forecasting and analytics',
    'Supplier management',
    'Return/refund inventory handling',
    'Multi-region active-active writes',
    'Real-time inventory alerts',
    'Warehouse transfer tracking',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can check and update inventory. The caching layer and distributed consistency challenges will come in later steps. Functionality first, then optimization for scale!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📦',
  scenario: "Welcome to Global Retail Corp! You've been hired to build our inventory management system.",
  hook: "A customer just opened our app and wants to check if a product is in stock.",
  challenge: "Set up the basic request flow so customers can reach your inventory server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your inventory system is online!',
  achievement: 'Customers can now send stock check requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to check inventory yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Inventory API Architecture',
  conceptExplanation: `Every inventory system starts with a **Client** connecting to a **Server**.

When a customer checks if a product is in stock:
1. Their app (web/mobile) is the **Client**
2. It sends HTTP requests to your **Inventory Server**
3. The server checks stock and returns availability

This is the foundation of all inventory systems!`,

  whyItMatters: 'Without this connection, customers can\'t see stock levels or place orders.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling 100K+ stock checks per second',
    howTheyDoIt: 'Amazon uses a distributed inventory system with regional servers that aggregate stock across fulfillment centers',
  },

  keyPoints: [
    'Client = customer\'s app checking stock levels',
    'Inventory Server = your backend that tracks stock',
    'HTTP = protocol for request/response communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Customer application querying inventory', icon: '📱' },
    { title: 'Inventory Server', explanation: 'Backend service managing stock data', icon: '🖥️' },
    { title: 'API', explanation: 'Interface for stock queries and updates', icon: '🔌' },
  ],
};

const step1: GuidedStep = {
  id: 'inventory-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for inventory operations',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customer apps checking inventory', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles inventory queries and updates', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to track inventory!",
  hook: "A customer tried to check stock for a product but got a 404 error.",
  challenge: "Write the Python code to handle stock checks, reservations, and updates.",
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
  nextTeaser: "But if the server crashes, all inventory data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Inventory API Implementation: Critical Handlers',
  conceptExplanation: `Every inventory API needs **handler functions** that manage stock operations.

For our system, we need handlers for:
- \`check_stock(product_id, warehouse_id)\` - Query current stock level
- \`reserve_inventory(product_id, quantity)\` - Hold stock for cart
- \`update_stock(product_id, delta)\` - Increment/decrement stock
- \`release_reservation(reservation_id)\` - Free up held stock

**Critical requirements:**
1. **Atomic operations** - Prevent race conditions on stock decrements
2. **Never go negative** - Check stock before decrementing
3. **Track reservations** - Time-based TTL (15 minutes)
4. **Fast reads** - Stock checks must be <50ms

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Inventory handlers must be bulletproof. Bugs here mean overselling or lost sales!',

  famousIncident: {
    title: 'Target Canada Inventory Disaster',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target\'s inventory system had massive data accuracy issues. Products showed in stock but weren\'t on shelves. The system couldn\'t handle multi-location inventory properly, leading to empty stores and eventually a $7 billion loss and complete Canada exit.',
    lessonLearned: 'Inventory accuracy is non-negotiable. Test atomic operations and consistency thoroughly.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Managing 100+ million SKUs across 10,000+ stores',
    howTheyDoIt: 'Real-time inventory system with atomic stock updates and aggressive caching. Cache invalidation on every write.',
  },

  keyPoints: [
    'Each inventory operation needs a handler function',
    'Use atomic decrements to prevent overselling',
    'Track reservations with expiration timestamps',
    'Store in memory for now (database comes next)',
  ],

  quickCheck: {
    question: 'Why must stock decrements be atomic operations?',
    options: [
      'To make the API faster',
      'To prevent two customers from buying the same last item',
      'To reduce database load',
      'To improve cache hit rates',
    ],
    correctIndex: 1,
    explanation: 'Atomic operations prevent race conditions where two concurrent requests both decrement stock, leading to overselling (negative inventory).',
  },

  keyConcepts: [
    { title: 'Atomic Operation', explanation: 'Operation that completes fully or not at all - no partial state', icon: '⚛️' },
    { title: 'Reservation', explanation: 'Temporary hold on inventory with TTL', icon: '⏱️' },
    { title: 'Stock Level', explanation: 'Current quantity available for sale', icon: '📊' },
  ],
};

const step2: GuidedStep = {
  id: 'inventory-step-2',
  stepNumber: 2,
  frIndex: 1,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2, FR-3: Implement inventory operations',
    taskDescription: 'Write Python code in App Server to handle stock checks, reservations, and updates',
    successCriteria: [
      'check_stock() handler implemented',
      'reserve_inventory() handler implemented',
      'update_stock() handler implemented',
      'Atomic operations prevent negative stock',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['app_server'],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Write Python code in the App Server to handle inventory operations',
    level2: 'Store inventory in a dictionary. Use locks or check-then-set pattern for atomic decrements.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your inventory APIs work! But there's a problem: when the server restarts, all stock data disappears.",
  hook: "A restock of 1000 units just arrived, but then the server crashed. All that inventory is gone!",
  challenge: "Add a Database to store inventory data permanently.",
  illustration: 'database',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Inventory persists!',
  achievement: 'Stock levels now survive server restarts',
  metrics: [
    { label: 'Data durability', before: 'Lost on restart', after: 'Persisted' },
    { label: 'Inventory safe', after: '✓' },
  ],
  nextTeaser: "But stock checks are slow... customers are seeing loading spinners!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Adding Persistence: Database for Inventory',
  conceptExplanation: `A **Database** stores inventory data permanently on disk. Even if your server crashes, stock levels survive.

For inventory, you need to store:
- **Products**: SKU, name, category
- **Stock levels**: Product ID, warehouse ID, quantity
- **Reservations**: Reservation ID, product, quantity, expiration time

When a customer checks stock, your app server:
1. Queries the database for current stock level
2. Returns the quantity to the customer
3. On purchase, atomically decrements stock in database`,

  whyItMatters: `Databases provide:
- **Durability**: Stock data survives crashes
- **Atomic operations**: ACID transactions prevent overselling
- **Querying**: Aggregate stock across warehouses
- **Consistency**: Single source of truth for inventory`,

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Managing inventory for millions of merchants',
    howTheyDoIt: 'Uses PostgreSQL with row-level locking for atomic stock decrements. Sharded by merchant_id for horizontal scaling.',
  },

  keyPoints: [
    'Database is the source of truth for all inventory',
    'Use ACID transactions for stock updates',
    'Row-level locks prevent race conditions',
    'Partition by warehouse_id for scale',
  ],

  diagram: `
    [App Server] ──→ [Database]
         │              │
         └── Read: SELECT quantity FROM inventory WHERE sku=?
         └── Update: UPDATE inventory SET quantity = quantity - 1 WHERE sku=? AND quantity > 0
  `,

  interviewTip: 'Always mention atomic operations and transactions when discussing inventory. Overselling is unacceptable.',
};

const step3: GuidedStep = {
  id: 'inventory-step-3',
  stepNumber: 3,
  frIndex: 2,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'Making inventory durable',
    taskDescription: 'Add a Database and connect it to your App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Store inventory data permanently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Database', reason: 'App server reads/writes inventory data' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
      'Inventory data persisted',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['app_server', 'database'],
    requiredConnections: [{ fromType: 'app_server', toType: 'database' }],
  },

  hints: {
    level1: 'Add a Database component and connect it to your App Server',
    level2: 'Update your code to read from and write to the database instead of memory',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Fast Reads
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your inventory is persistent, but stock checks are taking 200ms. That's too slow!",
  hook: "During a flash sale, 10,000 customers are all checking stock on the same hot product. Your database is melting!",
  challenge: "Add a Cache to speed up stock level reads and handle hot products.",
  illustration: 'performance',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Lightning fast stock checks!',
  achievement: 'Stock queries now complete in under 10ms',
  metrics: [
    { label: 'Stock check latency', before: '200ms', after: '8ms' },
    { label: 'Database load', before: '100K QPS', after: '5K QPS' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But the cache is showing stale data... customers see 'in stock' when items are sold out!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Cache-Aside Pattern for Inventory',
  conceptExplanation: `A **Cache** stores frequently accessed data in memory for ultra-fast reads.

**Cache-Aside Pattern** (also called Lazy Loading):
1. **On read**: Check cache first. If miss, read from database and populate cache
2. **On write**: Update database first, then invalidate cache entry
3. **TTL**: Cache entries expire after N seconds (e.g., 60s)

For inventory:
- Cache key: \`inventory:{sku}:{warehouse}\`
- Cache value: \`{"quantity": 150, "updated_at": "..."}\`
- TTL: 60 seconds

This reduces database load by 95%!`,

  whyItMatters: `Caching is critical for inventory because:
- **Read-heavy**: 100K stock checks/sec vs 5K updates/sec
- **Hot products**: Viral items get 10K+ queries/sec on single SKU
- **Low latency**: Users expect <50ms response times
- **Database protection**: Prevents thundering herd on database`,

  realWorldExample: {
    company: 'eBay',
    scenario: 'Handling spikes during limited item drops',
    howTheyDoIt: 'Uses Redis cache with 30-second TTL for stock levels. On write, invalidates cache immediately. Cache hit rate of 98%.',
  },

  famousIncident: {
    title: 'Amazon Prime Day Cache Failure',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'Prime Day started but inventory cache couldn\'t handle the spike in traffic. Customers saw errors instead of product pages. Amazon lost millions in the first hour before fixing cache layer.',
    lessonLearned: 'Cache must be sized for peak load, not average. Hot product access patterns are extremely skewed.',
    icon: '📦',
  },

  keyPoints: [
    'Cache-aside pattern: Read from cache, write to database',
    'Invalidate cache on every inventory update',
    'Use TTL to handle missed invalidations',
    'Redis/Memcached are popular choices',
  ],

  diagram: `
    [Client] → [App Server] → [Cache] (hit: return immediately)
                    ↓           ↓ (miss)
                [Database] ← populate cache
  `,

  commonMistakes: [
    {
      mistake: 'Write to cache only, not database',
      why: 'Cache can be evicted or crash - lose data permanently',
      correct: 'Always write to database first (source of truth)',
    },
    {
      mistake: 'Never invalidate cache on updates',
      why: 'Customers see stale stock levels for hours',
      correct: 'Invalidate cache immediately on every write',
    },
  ],

  interviewTip: 'Always mention cache invalidation strategy. Stale inventory data leads to overselling or underselling.',
};

const step4: GuidedStep = {
  id: 'inventory-step-4',
  stepNumber: 4,
  frIndex: 3,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'NFR: Low latency stock checks (p99 < 50ms)',
    taskDescription: 'Add a Cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Store frequently accessed stock levels in memory', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Cache', reason: 'Check cache before database' },
      { from: 'Cache', to: 'Database', reason: 'Populate cache on miss' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Cache connected to Database',
      'Cache-aside pattern implemented',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cache', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Cache component between App Server and Database',
    level2: 'Connect App Server to Cache, and Cache to Database. Implement cache-aside pattern.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'app_server', to: 'cache' },
      { from: 'cache', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Implement Cache Invalidation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "Customers are complaining! They're adding items to cart that show 'in stock', but checkout fails.",
  hook: "Your cache is showing stock from 5 minutes ago. Items sold out, but cache still says '10 available'.",
  challenge: "Implement cache invalidation to keep stock levels fresh.",
  illustration: 'sync',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Cache is always fresh!',
  achievement: 'Stock levels update in real-time',
  metrics: [
    { label: 'Stale reads', before: '20%', after: '<1%' },
    { label: 'Cache invalidation', after: 'On every write' },
    { label: 'Eventual consistency', after: '<5 seconds' },
  ],
  nextTeaser: "But your single database is becoming a bottleneck...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation Strategies',
  conceptExplanation: `Cache invalidation is critical for inventory accuracy. You have several strategies:

**1. Write-Through Invalidation** (Recommended):
- On stock update: Delete cache entry immediately
- Next read will miss cache and fetch fresh data from DB
- Ensures cache never has stale data for >1 request

**2. Write-Behind with TTL**:
- Update database, invalidate cache in background
- Cache has TTL (e.g., 60s) as backup
- Faster writes but brief staleness possible

**3. Write-Through Update**:
- Update both database and cache atomically
- Requires careful transaction handling
- Risk of cache/DB inconsistency on failure

For inventory, use **Write-Through Invalidation**:
\`\`\`python
def update_stock(sku, warehouse, delta):
    # 1. Update database (source of truth)
    db.execute("UPDATE inventory SET qty = qty + ? WHERE sku=? AND warehouse=?",
               delta, sku, warehouse)

    # 2. Invalidate cache immediately
    cache.delete(f"inventory:{sku}:{warehouse}")
\`\`\``,

  whyItMatters: `Stale cache causes two critical problems:
- **Overselling**: Cache shows stock but DB has 0 → customer checks out but order fails
- **Underselling**: Cache shows 0 but DB has stock → lost sales

Cache invalidation ensures eventual consistency within seconds.`,

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Invalidating cache for 100+ million products',
    howTheyDoIt: 'Uses Redis pub/sub to broadcast invalidation events to all app servers. Each server deletes its local cache entry.',
  },

  keyPoints: [
    'Invalidate cache on every inventory write',
    'Delete is safer than update (no consistency issues)',
    'Use TTL as backup in case invalidation fails',
    'Monitor cache hit rate and staleness',
  ],

  diagram: `
    Update Flow:
    [App Server] → [Database] (1. Update stock)
          ↓
       [Cache] (2. Delete cache entry)

    Next Read:
    [App Server] → [Cache] (miss)
          ↓
       [Database] (fetch fresh data)
          ↓
       [Cache] (populate)
  `,

  commonMistakes: [
    {
      mistake: 'Invalidate before writing to database',
      why: 'If DB write fails, cache is invalidated but data unchanged - creates inconsistency',
      correct: 'Always update database first, then invalidate cache',
    },
    {
      mistake: 'Update cache instead of deleting',
      why: 'If update fails, cache and DB diverge. Delete forces refetch.',
      correct: 'Delete cache entry and let next read populate it fresh',
    },
  ],

  interviewTip: 'Mention that "cache invalidation is one of the two hard problems in computer science." Show you understand the trade-offs.',
};

const step5: GuidedStep = {
  id: 'inventory-step-5',
  stepNumber: 5,
  frIndex: 4,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-5: Prevent overselling with fresh cache data',
    taskDescription: 'Implement cache invalidation on inventory updates',
    successCriteria: [
      'Cache invalidation on stock updates',
      'Database updated before cache invalidation',
      'TTL set as backup (60 seconds)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['app_server', 'cache', 'database'],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Update your inventory update handler to invalidate cache after database write',
    level2: 'Use cache.delete() after successful database update. Add TTL to cache entries.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Database Replication for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔁',
  scenario: "Your database just crashed for maintenance. All stock checks are failing!",
  hook: "Black Friday is tomorrow. You can't afford any downtime.",
  challenge: "Add database replication so reads can continue even if the primary DB is down.",
  illustration: 'replication',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your inventory is now highly available!',
  achievement: 'Stock checks continue even during database failures',
  metrics: [
    { label: 'Uptime', before: '99.5%', after: '99.99%' },
    { label: 'Read capacity', before: '10K QPS', after: '50K QPS' },
    { label: 'Failover time', after: '<30 seconds' },
  ],
  nextTeaser: "But what about global customers? US customers are hitting EU warehouses...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for Inventory',
  conceptExplanation: `**Database Replication** creates copies of your data on multiple servers.

**Primary-Replica Pattern**:
- **Primary (Leader)**: Handles all writes (stock updates)
- **Replicas (Followers)**: Handle reads (stock checks)
- **Async replication**: Changes stream from primary to replicas

For inventory:
- Writes (updates) go to primary DB
- Reads (stock checks) go to replicas
- Replicas may be 1-2 seconds behind (eventual consistency)

This provides:
- **High availability**: Reads continue if primary fails
- **Read scaling**: Add more replicas for more read capacity
- **Geographic distribution**: Place replicas near customers`,

  whyItMatters: `Replication is essential for inventory because:
- **Read-heavy**: 20:1 read-to-write ratio
- **Availability**: Can't afford downtime during sales events
- **Scale**: Single DB can't handle 100K reads/sec
- **Disaster recovery**: Replicas are backups`,

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Global inventory across 100+ fulfillment centers',
    howTheyDoIt: 'Uses Aurora with 15 read replicas globally. Stock updates to primary, reads from nearest replica. Replication lag <100ms.',
  },

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'Async replication may have 1-2 second lag',
    'Cache hides replication lag for most reads',
    'Promote replica to primary on failure',
  ],

  diagram: `
    Writes:
    [App Server] → [Primary DB]
                       ↓ (replicate)
                   [Replica 1]
                   [Replica 2]

    Reads:
    [App Server] → [Replica 1/2] (load balanced)
  `,

  commonMistakes: [
    {
      mistake: 'Read from replica immediately after write',
      why: 'Replica may not have the update yet - read stale data',
      correct: 'Read from primary after writes, or use cache',
    },
  ],

  interviewTip: 'Mention that cache + replication work together. Cache hit rate of 95% means only 5% of reads hit replicas.',
};

const step6: GuidedStep = {
  id: 'inventory-step-6',
  stepNumber: 6,
  frIndex: 5,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'NFR: High availability and read scaling',
    taskDescription: 'Add database replicas for reads',
    componentsNeeded: [
      { type: 'database', reason: 'Read replica for stock queries', displayName: 'Read Replica' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Read Replica', reason: 'Read stock levels from replica' },
      { from: 'Database', to: 'Read Replica', reason: 'Replicate changes to replica' },
    ],
    successCriteria: [
      'Read replica added',
      'App Server reads from replica',
      'Primary replicates to replica',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'cache'],
    minimumComponentCounts: [{ type: 'database', count: 2 }],
    requiredConnections: [
      { fromType: 'database', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add another Database component to act as a read replica',
    level2: 'Connect primary DB to replica for replication, and App Server to replica for reads',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [
      { from: 'database', to: 'database' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer for Geographic Distribution
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌍',
  scenario: "You've gone global! Warehouses in US, EU, and Asia. But customers are slow...",
  hook: "A customer in Tokyo is checking stock for a US warehouse. Request takes 300ms round-trip!",
  challenge: "Add a Load Balancer to route customers to their nearest regional server.",
  illustration: 'global',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your inventory system is globally distributed!',
  achievement: 'Customers get routed to nearest warehouse automatically',
  metrics: [
    { label: 'Global latency', before: '300ms', after: '50ms' },
    { label: 'Regions', after: '3 (US, EU, Asia)' },
    { label: 'Cache hit rate', after: '98%' },
  ],
  nextTeaser: "Congratulations! You've built a production-ready global inventory system!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Geographic Distribution with Load Balancers',
  conceptExplanation: `A **Load Balancer** distributes traffic across multiple servers and regions.

For global inventory:
- **Geographic routing**: Route customers to nearest region (US, EU, Asia)
- **Warehouse affinity**: Check stock at nearest warehouse first
- **Failover**: Route to other regions if one is down
- **Health checks**: Only route to healthy servers

Architecture:
- Regional app servers in each geography
- Regional cache clusters for local stock
- Shared primary database with regional replicas
- Load balancer routes by customer location`,

  whyItMatters: `Geographic distribution is critical for:
- **Latency**: Customers get <50ms responses from nearby servers
- **Warehouse optimization**: Check local warehouses first
- **Compliance**: Keep data in-region (GDPR)
- **Resilience**: Survive regional outages`,

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Supporting merchants in 175+ countries',
    howTheyDoIt: 'Uses Cloudflare for geographic load balancing. Anycast routes customers to nearest edge server. Cache hit rate 95%+.',
  },

  keyPoints: [
    'Load balancer routes by geography',
    'Each region has app servers + cache + DB replica',
    'Primary DB in one region, replicas elsewhere',
    'Cache makes most requests region-local',
  ],

  diagram: `
    [Customers Worldwide]
            ↓
      [Load Balancer]
       ↙     ↓     ↘
    [US]   [EU]   [Asia]
    App    App     App
    Cache  Cache   Cache
      ↘     ↓     ↙
     [Primary DB] ← [Replicas]
  `,

  interviewTip: 'Mention CAP theorem: You\'re choosing availability and partition tolerance over strong consistency (eventual consistency is OK for inventory reads).',
};

const step7: GuidedStep = {
  id: 'inventory-step-7',
  stepNumber: 7,
  frIndex: 6,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-6: Multi-warehouse tracking with geographic optimization',
    taskDescription: 'Add a Load Balancer to route customers geographically',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Route customers to nearest region', displayName: 'Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All requests go through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to app servers' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Servers',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer between Client and App Server',
    level2: 'Connect Client → Load Balancer → App Server to enable geographic routing',
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

export const globalInventoryCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'global-inventory-cache-guided',
  problemTitle: 'Build a Global Inventory Cache System',

  // Requirements gathering phase (Step 0)
  requirementsPhase: globalInventoryCacheRequirementsPhase,

  totalSteps: 7,
  steps: [step1, step2, step3, step4, step5, step6, step7],
};

export function getGlobalInventoryCacheGuidedTutorial(): GuidedTutorial {
  return globalInventoryCacheGuidedTutorial;
}
