import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Instacart Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a grocery delivery platform like Instacart.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, load balancer, search, queues, cost)
 *
 * Key Concepts:
 * - Inventory management across multiple stores
 * - Real-time shopper location tracking
 * - Order batching (multiple customers, one shopper)
 * - Perishable item handling (freshness, substitutions)
 * - Dynamic pricing and surge fees
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const instacartRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a grocery delivery platform like Instacart",

  interviewer: {
    name: 'Emily Rodriguez',
    role: 'VP of Engineering at Fresh Delivery Inc',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-flow',
      category: 'functional',
      question: "What's the main user journey for customers ordering groceries?",
      answer: "Customers want to:\n\n1. **Browse stores** - See nearby grocery stores (Whole Foods, Safeway, etc.)\n2. **Search products** - Find items by name, category, or dietary preference\n3. **Build shopping cart** - Add items with quantities\n4. **Schedule delivery** - Pick a delivery window (2-hour slots)\n5. **Track order** - See shopper progress: shopping, checkout, en route, delivered",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Unlike restaurant delivery, grocery shopping happens BEFORE pickup - shoppers need to find items in store",
    },
    {
      id: 'inventory-management',
      category: 'functional',
      question: "How do we handle inventory? Do we track what's in stock at each store?",
      answer: "Yes, critical for groceries:\n1. **Real-time inventory** - Sync with store systems when possible\n2. **Estimated availability** - Use historical data when direct integration unavailable\n3. **Substitution requests** - Customer can approve alternatives if item out of stock\n4. **Shopper communication** - Shoppers message customers for replacements\n\nThis is way more complex than restaurant menus!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Grocery inventory is dynamic - items go out of stock during shopping",
    },
    {
      id: 'shopper-experience',
      category: 'functional',
      question: "What does the shopper (personal shopper) need to do?",
      answer: "Shoppers (gig workers) need to:\n1. **Accept batches** - Get 1-3 orders at once from same/nearby stores\n2. **Shop items** - Scan barcodes, mark found/not-found\n3. **Handle substitutions** - Message customer, get approval, swap items\n4. **Checkout** - Pay with Instacart card at store\n5. **Deliver** - Drop off at customer addresses (usually 2-3 stops)\n6. **Update status** - Real-time location and order status",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Order batching is unique to grocery delivery - improves efficiency",
    },
    {
      id: 'scheduling',
      category: 'functional',
      question: "How does delivery scheduling work? Can customers pick specific times?",
      answer: "Yes, delivery windows are key:\n1. **2-hour windows** - 'Deliver between 2-4 PM'\n2. **Express delivery** - Available in <1 hour for premium\n3. **Scheduled in advance** - Book tomorrow or next week\n4. **Dynamic pricing** - Windows with high demand cost more\n\nScheduling is complex - must predict shopper availability and shopping time.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Scheduling adds complexity - need to estimate shopping time + delivery time",
    },
    {
      id: 'multi-store',
      category: 'clarification',
      question: "Can customers order from multiple stores in one cart?",
      answer: "Not in MVP. Each order is from ONE store. Multi-store adds massive complexity:\n- Multiple shoppers needed\n- Coordinating delivery times\n- Different checkout processes\n\nWe'll keep it simple - one store per order.",
      importance: 'nice-to-have',
      insight: "Scoping is critical - multi-store can be a V2 feature",
    },
    {
      id: 'store-integration',
      category: 'clarification',
      question: "Do we integrate directly with store inventory systems?",
      answer: "For MVP, we'll focus on larger partners with APIs (Whole Foods, Costco). For smaller stores without integrations, we'll use:\n- Historical availability data\n- Manual catalog updates\n- Shopper-reported stockouts\n\nFull integration is ideal but not required for launch.",
      importance: 'nice-to-have',
      insight: "Start with what you can control - partner integrations come later",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users are we designing for?",
      answer: "30 million registered customers, 8 million daily active users (DAU), 100K active shoppers, 50K partner stores",
      importance: 'critical',
      learningPoint: "Large user base with different personas: customers, shoppers, stores",
    },
    {
      id: 'throughput-orders',
      category: 'throughput',
      question: "How many orders per day?",
      answer: "About 500K orders per day across all regions",
      importance: 'critical',
      calculation: {
        formula: "500K ÷ 86,400 sec = 5.8 orders/sec",
        result: "~6 orders/sec average (20 orders/sec at weekend peak)",
      },
      learningPoint: "Lower order volume than food delivery, but larger cart sizes",
    },
    {
      id: 'throughput-product-searches',
      category: 'throughput',
      question: "How many product searches happen daily?",
      answer: "About 100 million product searches per day as customers build their carts",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 searches/sec",
        result: "~1,200 searches/sec (3,600 at peak)",
      },
      learningPoint: "Search-intensive - customers search for many products per order",
    },
    {
      id: 'cart-size',
      category: 'payload',
      question: "How many items in a typical grocery order?",
      answer: "Average cart has 40-60 items (much larger than restaurant orders!). This affects:\n- Shopping time (30-60 minutes per order)\n- Substitution complexity\n- Payment processing\n- Delivery logistics",
      importance: 'critical',
      learningPoint: "Large carts = complex order fulfillment",
    },
    {
      id: 'inventory-updates',
      category: 'burst',
      question: "How often does inventory data update?",
      answer: "For integrated stores, every 5-15 minutes. During shopping, shoppers report stockouts in real-time. That's thousands of inventory updates per minute during peak hours!",
      importance: 'critical',
      insight: "Inventory is highly dynamic - need efficient update mechanisms",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should product search be?",
      answer: "p99 under 200ms. Customers search frequently while building carts - slow search kills conversion.",
      importance: 'critical',
      learningPoint: "Product search must be lightning fast - it's the core UX",
    },
    {
      id: 'latency-checkout',
      category: 'latency',
      question: "What's acceptable latency for order placement/checkout?",
      answer: "Under 2 seconds. Checkout involves:\n- Inventory validation\n- Payment authorization\n- Shopper assignment\n- Delivery slot confirmation\n\nMust feel instant despite complexity.",
      importance: 'critical',
      learningPoint: "Checkout is complex but must feel fast to user",
    },
    {
      id: 'shopper-location',
      category: 'burst',
      question: "How often do shoppers update their location?",
      answer: "Every 10 seconds while shopping/delivering. With 20K active shoppers during peak, that's 2,000 location updates per second.",
      importance: 'important',
      insight: "Real-time tracking creates sustained write load",
    },
    {
      id: 'weekend-surge',
      category: 'burst',
      question: "When are peak times for grocery delivery?",
      answer: "Saturday/Sunday mornings are massive - 3-4x normal volume. Unlike food delivery (lunch/dinner), grocery peaks are weekend-driven. System must handle the surge.",
      importance: 'important',
      insight: "Different peak pattern than food delivery - plan capacity accordingly",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-flow', 'inventory-management', 'shopper-experience'],
  criticalFRQuestionIds: ['core-flow', 'scheduling'],
  criticalScaleQuestionIds: ['inventory-updates', 'latency-checkout', 'weekend-surge'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Browse stores and search products',
      description: 'Customers can find stores and search for grocery items',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Build shopping cart and place orders',
      description: 'Add items to cart with inventory validation',
      emoji: '🛒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Schedule delivery and track orders',
      description: 'Pick delivery windows and track shopper progress',
      emoji: '📅',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Shopper assignment and order fulfillment',
      description: 'Shoppers shop, checkout, and deliver orders',
      emoji: '🛍️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '8 million customers + 100K shoppers',
    writesPerDay: '500K orders + 17 million location updates',
    readsPerDay: '100 million searches + 50 million tracking views',
    peakMultiplier: 4,
    readWriteRatio: '6:1',
    calculatedWriteRPS: { average: 203, peak: 812 },
    calculatedReadRPS: { average: 1736, peak: 6944 },
    maxPayloadSize: '~50KB (order with 60 items)',
    storagePerRecord: '~10KB (order with items)',
    storageGrowthPerYear: '~1.8TB',
    redirectLatencySLA: 'p99 < 200ms (search)',
    createLatencySLA: 'p99 < 2s (checkout)',
  },

  architecturalImplications: [
    '✅ Product search required → Elasticsearch with full-text + category indexing',
    '✅ Dynamic inventory → Cache with short TTL + real-time updates',
    '✅ Large carts (60 items) → Efficient cart storage (Redis)',
    '✅ Delivery scheduling → Complex assignment algorithm (async)',
    '✅ Weekend surge (4x) → Auto-scaling critical',
    '✅ Order batching → Sophisticated matching algorithm',
  ],

  outOfScope: [
    'Multi-store orders',
    'In-store pickup (curbside)',
    'Prescription medication delivery',
    'Alcohol age verification',
    'International markets',
    'Store employee integration',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where customers can search for products, build carts, and schedule deliveries. The complex inventory sync and order batching come later. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to Fresh Delivery Inc! You've been hired to build the next Instacart.",
  hook: "Your first customer wants to order groceries for Sunday brunch!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Customers and shoppers can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write code to handle grocery orders!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

For Instacart, we have TWO types of clients:
1. **Customer App** - Browse stores, search products, build cart, schedule delivery
2. **Shopper App** - Accept batches, shop items, update status, deliver

Both connect to the same **App Server** which handles the business logic.`,

  whyItMatters: 'Without this connection, none of your users can interact with the platform.',

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Handling 500K orders per day',
    howTheyDoIt: 'Started with a Rails monolith, evolved to microservices with separate services for catalog, orders, and fulfillment',
  },

  keyPoints: [
    'Client = user devices (customer and shopper apps)',
    'App Server = backend that processes all requests',
    'HTTP/WebSocket = protocols for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User device making requests', icon: '📱' },
    { title: 'App Server', explanation: 'Backend handling business logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Request/response protocol', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'instacart-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers and shoppers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles orders, search, and fulfillment logic', displayName: 'App Server' },
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
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle grocery orders yet!",
  hook: "A customer tried to search for 'organic bananas' but got a 404 error.",
  challenge: "Write the Python code to search products, manage carts, and place orders.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle grocery delivery!',
  achievement: 'You implemented the core Instacart functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can search products', after: '✓' },
    { label: 'Can manage cart', after: '✓' },
    { label: 'Can place orders', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all carts and orders are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Grocery Delivery Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For Instacart, we need handlers for:
- \`search_products(query, store_id, filters)\` - Find products by name/category
- \`add_to_cart(customer_id, product_id, quantity)\` - Manage shopping cart
- \`place_order(customer_id, delivery_window)\` - Create order from cart
- \`get_order_status(order_id)\` - Track shopper progress

For now, we'll store everything in memory (Python dictionaries) to keep it simple.`,

  whyItMatters: 'These handlers are the brain of your platform - they make grocery delivery possible!',

  famousIncident: {
    title: 'Instacart Memorial Day Crash',
    company: 'Instacart',
    year: '2020',
    whatHappened: 'A surge in orders during Memorial Day weekend (4x normal) caused their cart service to crash. Customers lost their carts mid-shopping. Millions in lost revenue.',
    lessonLearned: 'Start simple, but design for scale. Cart data must persist!',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Processing 6 orders/second average',
    howTheyDoIt: 'Separate services for catalog, cart, and orders. Uses async processing for order placement.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (out of stock, delivery slot full, etc.)',
  ],

  quickCheck: {
    question: 'Why is cart management especially critical for grocery delivery?',
    options: [
      'Carts are larger than restaurant orders',
      'Customers spend 20-30 minutes building carts with 40+ items - losing cart data is catastrophic',
      'Carts contain perishable items',
      'Carts are shared between customers',
    ],
    correctIndex: 1,
    explanation: 'Grocery carts are large (40-60 items) and take time to build. Losing cart data means losing the customer.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes API requests', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Shopping Cart', explanation: 'Session data for customer selections', icon: '🛒' },
  ],
};

const step2: GuidedStep = {
  id: 'instacart-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search products, FR-2: Build cart and place orders',
    taskDescription: 'Configure APIs and implement Python handlers for core functionality',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/products/search, POST /api/v1/cart, POST /api/v1/orders, GET /api/v1/orders/:id APIs',
      'Open the Python tab',
      'Implement search_products(), manage_cart(), place_order(), and get_order_status() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for search_products, manage_cart, place_order, and get_order_status',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          handledAPIs: [
            'GET /api/v1/products/search',
            'POST /api/v1/cart',
            'POST /api/v1/orders',
            'GET /api/v1/orders/:id'
          ]
        }
      },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed during Sunday rush...",
  hook: "When it restarted, ALL carts and orders were GONE! Customers lost their 50-item carts they spent 30 minutes building. Chaos!",
  challenge: "Add a database so products, carts, orders, and inventory persist forever.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Products, carts, orders, and inventory now persist across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But product search is getting slow as our catalog grows to 500K items...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for Grocery Delivery',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **ACID**: Transactions for cart and order consistency

For Instacart, we need tables for:
- \`products\` - Catalog of all grocery items
- \`stores\` - Partner store locations and hours
- \`carts\` - Customer shopping carts (active sessions)
- \`orders\` - Placed orders with items
- \`inventory\` - Stock levels per store
- \`shoppers\` - Shopper profiles and availability`,

  whyItMatters: 'Imagine customers losing their 60-item carts they spent 30 minutes building. They would never come back!',

  famousIncident: {
    title: 'Shipt Database Corruption',
    company: 'Shipt',
    year: '2019',
    whatHappened: 'A database corruption issue caused order data loss during peak hours. Shoppers arrived at stores with no order details. Hundreds of orders had to be refunded.',
    lessonLearned: 'Persistent storage with proper backups is absolutely critical for delivery platforms.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Storing 500K orders per day with 40-60 items each',
    howTheyDoIt: 'Uses PostgreSQL for transactional data (orders, carts) and separate systems for product catalog and inventory',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for transactional cart and order data',
    'ACID properties ensure cart and checkout consistency',
    'Connect App Server to Database for read/write operations',
  ],

  quickCheck: {
    question: 'Why is cart persistence especially critical for grocery delivery?',
    options: [
      'Carts are small and fast',
      'Customers spend 20-30 minutes building large carts - losing cart data loses the sale',
      'It makes search faster',
      'It reduces server load',
    ],
    correctIndex: 1,
    explanation: 'Grocery carts are large and take significant time to build. Losing cart data is catastrophic for conversion.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'ACID', explanation: 'Guarantees for transactional consistency', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'instacart-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store products, carts, orders, and inventory permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Product Search
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 500,000 products across 50,000 stores, and searches are taking 4+ seconds!",
  hook: "Users are complaining: 'Why is product search so slow?' Every search hits the database.",
  challenge: "Add a cache to make product search and catalog lookups lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Product search is 40x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Search latency', before: '4000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '98%' },
  ],
  nextTeaser: "But what happens when search traffic spikes 4x on weekends?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier for Product Catalogs',
  conceptExplanation: `A **cache** is fast, temporary storage between your app and database.

For Instacart, we cache:
- **Product catalog** - Popular items searched 1000s of times/hour
- **Store information** - Hours, location, delivery zones
- **Popular searches** - "organic bananas", "whole milk"
- **Inventory snapshots** - Recent stock levels (with short TTL)

Cache pattern:
\`\`\`
Request → Cache (1ms) → Database (only on miss, 100ms)
\`\`\`

This is especially powerful for read-heavy product catalogs that rarely change.`,

  whyItMatters: 'At 3,600 searches/sec during peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Amazon Fresh Cache Failure',
    company: 'Amazon Fresh',
    year: '2021',
    whatHappened: 'Their product cache cluster went down during Prime Day. All requests hit the database, causing cascading failures. Site was down for 90 minutes during peak shopping.',
    lessonLearned: 'Cache redundancy is critical. Never have a single cache instance.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Serving 100 million searches per day',
    howTheyDoIt: 'Uses Redis clusters to cache product catalog and popular searches. 98%+ cache hit rate means most searches never touch the database.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (98% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache product catalog and popular search results',
    'Set appropriate TTL (e.g., 10 min for products, 2 min for inventory)',
    'Cache hit = instant response, cache miss = fetch from DB',
  ],

  quickCheck: {
    question: 'Why is caching especially effective for product catalogs?',
    options: [
      'Products change every second',
      'Products are searched frequently but change rarely - perfect for caching',
      'Caching saves money',
      'It makes the database faster',
    ],
    correctIndex: 1,
    explanation: 'Popular products get thousands of searches per hour, but product details only change occasionally. High read-to-write ratio = perfect for caching.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'instacart-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search products (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache product catalog and search results', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (600 seconds)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 600 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "It's Saturday morning - peak grocery shopping time! Your single app server is maxed out at 100% CPU!",
  hook: "Searches are timing out. Orders are failing. Your single server can't handle weekend traffic.",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer spreads requests across servers',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request distribution', after: 'Balanced' },
  ],
  nextTeaser: "But we still only have one app server instance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handle Weekend Surge',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

For grocery delivery, this is critical because:
- Traffic has strong weekend patterns (Saturday/Sunday mornings = 4x normal)
- Need to handle burst traffic without overprovisioning 24/7
- Geographic distribution (different time zones shop at different times)`,

  whyItMatters: 'At peak, Instacart handles 6,000+ requests/second on weekend mornings. No single server can handle that alone.',

  famousIncident: {
    title: 'Instacart Super Bowl Sunday Outage',
    company: 'Instacart',
    year: '2021',
    whatHappened: 'Super Bowl Sunday orders spiked 6x. Their load balancers couldn\'t route traffic fast enough. Single servers became bottlenecks. System crashed for 45 minutes.',
    lessonLearned: 'Load balancers must be configured with proper health checks and sufficient capacity.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Handling weekend surge traffic',
    howTheyDoIt: 'Uses multiple layers of load balancing (edge, regional, service-level) to distribute traffic across thousands of servers globally',
  },

  diagram: `
              ┌─────────────┐
              │ App Server 1│
┌────────┐   ┌──────────────┐   └─────────────┘
│ Client │──▶│Load Balancer │──▶ App Server 2
└────────┘   └──────────────┘   ┌─────────────┐
              │ App Server 3│
              └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers for weekend peaks)',
    'Eliminates single point of failure',
    'Place between Client and App Servers',
  ],

  quickCheck: {
    question: 'Why is load balancing especially important for grocery delivery?',
    options: [
      'It makes the system faster',
      'Predictable weekend surges require scaling up Saturday/Sunday, down weekdays',
      'It\'s cheaper than one big server',
      'It looks better in diagrams',
    ],
    correctIndex: 1,
    explanation: 'Grocery delivery has strong weekend peaks. Load balancing allows you to scale up for weekends and scale down during quiet weekdays.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'instacart-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
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
    level1: 'Drag a Load Balancer onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Search Engine for Product Search
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are frustrated! 'Find organic bananas' returns thousands of irrelevant results.",
  hook: "Your database queries for product search are slow and inaccurate. You need proper full-text search.",
  challenge: "Add Elasticsearch with category and text indexing for fast, relevant product search.",
  illustration: 'search-results',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Product search is blazing fast and accurate!',
  achievement: 'Users now find exactly what they need in milliseconds',
  metrics: [
    { label: 'Search latency', before: '2500ms', after: '80ms' },
    { label: 'Search relevance', after: '95%+' },
    { label: 'Search queries/sec', after: '3,600+' },
  ],
  nextTeaser: "But order placement is slow - checkout takes 8 seconds...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Full-Text Search: Finding the Right Products',
  conceptExplanation: `Regular databases are terrible at product search:
"Find organic bananas" requires full-text search, category filters, and relevance ranking.

**Elasticsearch with full-text indexing**:
- Uses inverted indexes for fast text search
- Supports fuzzy matching ("bannana" → "banana")
- Filters by category, dietary restrictions, brand
- Relevance scoring (boost exact matches, popular items)
- Can combine text + filters: "organic dairy within Whole Foods"

Instacart needs this for:
- Product name search ("greek yogurt")
- Category browsing ("fresh produce")
- Dietary filters ("gluten-free", "vegan")
- Store-specific catalogs`,

  whyItMatters: 'Product search is the PRIMARY way customers build carts. Without fast, accurate search, the platform is unusable.',

  famousIncident: {
    title: 'Amazon Fresh Search Bug',
    company: 'Amazon Fresh',
    year: '2019',
    whatHappened: 'A search indexing bug caused "organic" searches to miss 40% of organic products. Customers complained they couldn\'t find items they knew were in stock. Revenue dropped 15%.',
    lessonLearned: 'Search quality directly impacts revenue. Test search thoroughly.',
    icon: '🔍',
  },

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Searching 500K+ products across 50K stores',
    howTheyDoIt: 'Uses Elasticsearch with custom relevance scoring. Can search by text, filter by category/diet, and sort by popularity in <100ms.',
  },

  diagram: `
User: "organic greek yogurt"
          │
          ▼
┌──────────────────────┐
│    Elasticsearch     │
│  Full-Text Index     │
│  [Inverted Index]    │
└──────────┬───────────┘
           │
           ▼
Results: [Fage Greek Yogurt (Organic), Chobani Organic, ...]
Sorted by relevance + popularity
`,

  keyPoints: [
    'Elasticsearch is optimized for full-text product search',
    'Index products with name, category, brand, dietary info',
    'Supports fuzzy search, filters, and relevance scoring',
    'Can combine text search + category filters in one query',
  ],

  quickCheck: {
    question: 'Why is Elasticsearch better than PostgreSQL for product search?',
    options: [
      'It stores more data',
      'It\'s free and open source',
      'It uses inverted indexes for fast full-text search and relevance ranking',
      'It has better documentation',
    ],
    correctIndex: 2,
    explanation: 'PostgreSQL can do text search but it\'s slow and lacks relevance scoring. Elasticsearch is built for this use case.',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Search across text fields with relevance', icon: '📝' },
    { title: 'Inverted Index', explanation: 'Index words to documents for fast lookup', icon: '🔍' },
    { title: 'Relevance Scoring', explanation: 'Rank results by match quality', icon: '⭐' },
  ],
};

const step6: GuidedStep = {
  id: 'instacart-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search products (now with full-text search)',
    taskDescription: 'Add Elasticsearch for fast, accurate product search',
    componentsNeeded: [
      { type: 'search', reason: 'Enable fast full-text search for products', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search component (Elasticsearch) added',
      'App Server connected to Search',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
    ],
  },

  hints: {
    level1: 'Drag a Search (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search. Products will be indexed for fast search.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Order Processing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🛍️',
  scenario: "A customer just placed a large order, but checkout took 8 seconds and timed out!",
  hook: "The order placement API is slow because it's trying to: validate inventory, assign shopper, reserve delivery slot, send notifications - all synchronously!",
  challenge: "Add a message queue to handle order processing asynchronously.",
  illustration: 'order-processing',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Order placement is lightning fast!',
  achievement: 'Async processing enables instant checkout and smart shopper assignment',
  metrics: [
    { label: 'Checkout latency', before: '8s', after: '<500ms' },
    { label: 'Order processing time', after: '<2min (async)' },
    { label: 'Shopper assignment quality', after: 'Optimized' },
  ],
  nextTeaser: "But we need to optimize costs for profitability...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Order Processing',
  conceptExplanation: `The **order processing problem** is complex:
- Validate 60 items still in stock
- Find available shoppers near the store
- Optimize batch (combine with other orders)
- Reserve delivery time slot
- Send notifications to shopper and customer
- Update inventory estimates

This takes time (5-10 seconds). We can't make the customer wait!

**Synchronous**: Place Order → Process everything → Return "Order Placed" ❌ (too slow)
**Async with Queue**: Place Order → Add to queue → Return "Order Placed" ✓
- Background workers process the queue
- Run complex assignment and batching algorithms
- Update customer when shopper is assigned

Additional uses:
- Inventory updates (thousands per minute)
- Shopper location updates (2K/second)
- Order status notifications`,

  whyItMatters: 'Without async processing, checkout would timeout. Users would get errors instead of confirmations.',

  famousIncident: {
    title: 'Instacart Order Assignment Bug',
    company: 'Instacart',
    year: '2022',
    whatHappened: 'A bug in the shopper assignment algorithm caused orders to be assigned to shoppers 30+ miles away, while closer shoppers sat idle. Deliveries were delayed 2+ hours.',
    lessonLearned: 'Assignment algorithms are complex. Async processing allows time for sophisticated optimization.',
    icon: '🐛',
  },

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Processing 6 orders/second average, 20/sec at peak',
    howTheyDoIt: 'Uses Kafka for order events. Workers consume orders, run batching algorithms, assign shoppers, and send notifications.',
  },

  diagram: `
Customer Places Order
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────┐
│ App Server  │────▶│      Message Queue (Kafka)       │
│ (instant)   │     │  [order1, order2, order3, ...]   │
└─────────────┘     └──────────────┬──────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Order Placed!"            ▼
                          ┌──────────────────┐
                          │ Order Workers    │
                          │ (batching logic) │
                          └────────┬─────────┘
                                   │
                                   ▼
                           Assign shopper
                           Reserve delivery slot
                           Send notifications
`,

  keyPoints: [
    'Message queue decouples order placement from processing',
    'Customer gets instant confirmation - processing happens in background',
    'Workers can run complex batching algorithms without blocking requests',
    'Queue handles inventory updates and location tracking',
  ],

  quickCheck: {
    question: 'Why do we use async order processing instead of synchronous?',
    options: [
      'It\'s cheaper',
      'Customer gets instant response while optimal shopper assignment happens in background',
      'It uses less memory',
      'It\'s easier to code',
    ],
    correctIndex: 1,
    explanation: 'Async means the customer doesn\'t wait. Order is confirmed instantly, and the best shopper/batch is found in the background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async event processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Order Batching', explanation: 'Combine multiple orders for efficiency', icon: '🎯' },
  ],
};

const step7: GuidedStep = {
  id: 'instacart-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Place orders, FR-4: Shopper assignment (now with async processing)',
    taskDescription: 'Add a Message Queue for async order processing and shopper assignment',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle order processing and inventory updates asynchronously', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async order processing and shopper assignment.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Your CFO is concerned! Monthly cloud bill is $720,000.",
  hook: "The board says: 'Cut costs by 35% or we'll have to raise delivery fees and lose customers.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Instacart!',
  achievement: 'A scalable, cost-effective grocery delivery platform',
  metrics: [
    { label: 'Monthly cost', before: '$720K', after: 'Under budget' },
    { label: 'Search latency', after: '<200ms' },
    { label: 'Checkout time', after: '<2s' },
    { label: 'Location updates/sec', after: '2K+' },
    { label: 'Weekend peak capacity', after: '6K req/sec' },
  ],
  nextTeaser: "You've mastered grocery delivery system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Economics of Grocery Delivery',
  conceptExplanation: `Grocery delivery has razor-thin margins - cost optimization is CRITICAL.

Cost optimization strategies:
1. **Right-size instances** - Match server size to actual load
2. **Auto-scale for weekends** - Scale up Sat/Sun, down weekdays
3. **Cache aggressively** - Popular products cached, reduce DB calls
4. **Efficient search** - Elasticsearch cheaper than database for product queries
5. **Async processing** - Smaller, cheaper servers for background work
6. **Database optimization** - Read replicas for product catalog queries

For Instacart:
- Archive old orders (>90 days) to cold storage
- Use spot instances for stateless order workers
- Cache product catalog with longer TTL
- Scale servers by day of week (weekend vs weekday capacity)`,

  whyItMatters: 'Grocery delivery typically makes $3-8 per order. At 500K orders/day, even $0.10 savings per order = $50K/day = $18M/year!',

  famousIncident: {
    title: 'Instacart Profitability Challenge',
    company: 'Instacart',
    year: '2020-2022',
    whatHappened: 'Despite massive growth, Instacart struggled with profitability due to high infrastructure and operational costs. Had to optimize aggressively to achieve first profitable quarter.',
    lessonLearned: 'Unit economics matter. Every order must be profitable after infrastructure costs.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Instacart',
    scenario: 'Achieving profitability after years of losses',
    howTheyDoIt: 'Heavily optimized infrastructure costs. Uses weekend-specific auto-scaling, aggressive caching, and efficient order batching to reduce per-order costs.',
  },

  keyPoints: [
    'Auto-scale for weekend patterns (Sat/Sun peaks)',
    'Cache aggressively to reduce expensive database queries',
    'Use async processing to run complex work on cheaper servers',
    'Right-size based on day-of-week usage patterns',
    'Optimize order batching to reduce shopper costs',
  ],

  quickCheck: {
    question: 'Why is cost optimization especially critical for grocery delivery platforms?',
    options: [
      'To make investors happy',
      'Razor-thin profit margins per order - infrastructure costs directly impact profitability',
      'Cloud bills are too expensive',
      'Competitors might be cheaper',
    ],
    correctIndex: 1,
    explanation: 'Grocery delivery margins are thin ($3-8/order). If infrastructure costs $2/order, that\'s 25-66% of profit gone. Cost optimization is survival.',
  },

  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Automatically adjust server count to traffic', icon: '📊' },
    { title: 'Unit Economics', explanation: 'Profit per order after all costs', icon: '💵' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'instacart-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget constraints',
    taskDescription: 'Optimize your system to stay under $600/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $600/month',
      'Maintain all performance requirements',
      'Configure auto-scaling where appropriate',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning. Consider smaller instances, fewer replicas.',
    level2: 'Optimize: right-size app servers, reduce cache size if needed, use smaller Elasticsearch cluster. Keep core functionality working.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const instacartGuidedTutorial: GuidedTutorial = {
  problemId: 'instacart',
  title: 'Design Instacart',
  description: 'Build a grocery delivery platform with product search, cart management, and shopper assignment',
  difficulty: 'advanced',
  estimatedMinutes: 55,

  welcomeStory: {
    emoji: '🛒',
    hook: "You've been hired as Lead Engineer at Fresh Delivery Inc!",
    scenario: "Your mission: Build an Instacart-like platform that connects customers with personal shoppers for grocery delivery.",
    challenge: "Can you design a system that handles product search, inventory management, and efficient order batching?",
  },

  requirementsPhase: instacartRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Full-Text Search',
    'Message Queues',
    'Inventory Management',
    'Order Batching',
    'Delivery Scheduling',
    'Cost Optimization',
    'Real-Time Location Tracking',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models (inventory and product catalog)',
    'Chapter 3: Storage and Retrieval (search indexing)',
    'Chapter 11: Stream Processing (order processing)',
  ],
};

export default instacartGuidedTutorial;
