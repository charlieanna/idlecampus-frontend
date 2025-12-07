import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Amazon Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building an e-commerce platform like Amazon.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, replication, queues, etc.)
 *
 * Key Concepts:
 * - Shopping cart as distributed cache
 * - Inventory reservation patterns
 * - Eventual consistency for catalog vs strong consistency for orders
 * - Microservices at Amazon
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const amazonRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an e-commerce platform like Amazon",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at E-Commerce Systems Inc.',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-shopping',
      category: 'functional',
      question: "What's the core shopping experience users expect?",
      answer: "Users want to:\n\n1. **Browse and search products** - Find what they're looking for from millions of items\n2. **Add to cart** - Collect items before purchasing\n3. **Checkout** - Complete the purchase with payment and shipping details\n4. **Track orders** - See order status and delivery updates",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "E-commerce is about discovery, collection, and conversion",
    },
    {
      id: 'product-catalog',
      category: 'functional',
      question: "How do users find products they want to buy?",
      answer: "Users can:\n1. **Search** by keyword (e.g., 'wireless headphones')\n2. **Browse categories** (Electronics → Audio → Headphones)\n3. **View product details** including images, specs, reviews, and pricing",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Product catalog is the foundation - users can't buy what they can't find",
    },
    {
      id: 'shopping-cart',
      category: 'functional',
      question: "What happens when a user adds items to their cart?",
      answer: "The cart:\n1. **Persists across sessions** - Save cart even if user logs out\n2. **Shows price totals** - Running total of all items\n3. **Allows modifications** - Change quantity or remove items\n4. **Reserves inventory** (briefly) to prevent overselling",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Cart is more than a list - it's a temporary inventory reservation system",
    },
    {
      id: 'checkout-payment',
      category: 'functional',
      question: "What happens during checkout?",
      answer: "Checkout flow:\n1. **Validate inventory** - Ensure items still available\n2. **Process payment** - Charge credit card via payment gateway\n3. **Create order** - Generate order ID and confirmation\n4. **Decrement inventory** - Atomically reduce stock count\n\nThis must be transactional - all or nothing!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Checkout requires strong consistency - can't charge twice or oversell inventory",
    },
    {
      id: 'reviews-ratings',
      category: 'functional',
      question: "Can users leave reviews and ratings for products?",
      answer: "Yes! Reviews are critical for buyer confidence:\n1. **Star rating** (1-5 stars)\n2. **Written review** with photos\n3. **Verified purchase badge** for actual buyers\n\nFor MVP, let's defer this to v2 - focus on core buying experience first.",
      importance: 'nice-to-have',
      insight: "Reviews are important but can be added later - buying comes first",
    },
    {
      id: 'recommendations',
      category: 'clarification',
      question: "Should we show personalized product recommendations?",
      answer: "Eventually yes ('customers who bought this also bought...'), but for MVP, let's focus on search and browse. Recommendations are a v2 feature requiring ML infrastructure.",
      importance: 'nice-to-have',
      insight: "Recommendations add complexity - good to defer for initial launch",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "300 million registered users, with 100 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Massive scale - one of the largest e-commerce platforms globally",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many products in the catalog?",
      answer: "~500 million products (SKUs) across all categories",
      importance: 'critical',
      learningPoint: "Huge catalog requires efficient search and storage strategies",
    },
    {
      id: 'throughput-orders',
      category: 'throughput',
      question: "How many orders per day?",
      answer: "About 10 million orders per day",
      importance: 'critical',
      calculation: {
        formula: "10M ÷ 86,400 sec = 115 orders/sec",
        result: "~115 writes/sec (350 at peak during sales events)",
      },
      learningPoint: "High order volume requires reliable transaction processing",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many product views per day?",
      answer: "About 5 billion product page views per day",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 reads/sec",
        result: "~58K reads/sec (200K at peak during Prime Day)",
      },
      learningPoint: "Heavily read-dominated - 500:1 read-to-write ratio!",
    },
    {
      id: 'prime-day-burst',
      category: 'burst',
      question: "What happens during Prime Day sales events?",
      answer: "Traffic spikes 10x! Lightning deals cause 100x bursts on specific products. System must handle:\n- 200K+ product views/sec\n- 3,500+ orders/sec\n- Inventory contention on hot items",
      importance: 'critical',
      insight: "Prime Day is the ultimate stress test - design for burst capacity",
    },
    {
      id: 'inventory-consistency',
      category: 'consistency',
      question: "How critical is inventory accuracy?",
      answer: "EXTREMELY critical:\n- Can't oversell (promise items we don't have)\n- Can't undersell (show out-of-stock when items available)\n- Must handle concurrent checkouts on last item in stock\n\nInventory updates require strong consistency.",
      importance: 'critical',
      learningPoint: "Inventory is where consistency matters most - catalog can be eventually consistent",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should product search respond?",
      answer: "p99 under 200ms. Users expect instant search results.",
      importance: 'critical',
      learningPoint: "Fast search is critical for discovery - slow search = lost sales",
    },
    {
      id: 'latency-checkout',
      category: 'latency',
      question: "How fast should checkout complete?",
      answer: "p99 under 2 seconds from 'Place Order' to confirmation. Reliability is more important than speed - can't fail or double-charge.",
      importance: 'critical',
      learningPoint: "Checkout is where money changes hands - must be reliable above all",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-shopping', 'shopping-cart', 'checkout-payment', 'prime-day-burst'],
  criticalFRQuestionIds: ['core-shopping', 'shopping-cart', 'checkout-payment'],
  criticalScaleQuestionIds: ['throughput-reads', 'prime-day-burst', 'inventory-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search and browse products',
      description: 'Find products by keyword or category from 500M+ items',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can add items to shopping cart',
      description: 'Cart persists across sessions and shows totals',
      emoji: '🛒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can checkout and pay',
      description: 'Complete purchase with payment and order confirmation',
      emoji: '💳',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can view order history',
      description: 'Track current and past orders with status',
      emoji: '📦',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '10 million orders',
    readsPerDay: '5 billion product views',
    peakMultiplier: 10,
    readWriteRatio: '500:1',
    calculatedWriteRPS: { average: 115, peak: 3500 },
    calculatedReadRPS: { average: 57870, peak: 200000 },
    maxPayloadSize: '~5KB (product details)',
    storagePerRecord: '~2KB (product), ~500 bytes (order)',
    storageGrowthPerYear: '~5PB (products + orders + images)',
    redirectLatencySLA: 'p99 < 200ms (search)',
    createLatencySLA: 'p99 < 2s (checkout)',
  },

  architecturalImplications: [
    '✅ Read-heavy (500:1) → Aggressive caching for product catalog',
    '✅ 200K reads/sec at peak → CDN for product images, distributed cache',
    '✅ Inventory consistency → Strong consistency for checkout transactions',
    '✅ 500M products → Search index (Elasticsearch), database partitioning',
    '✅ Prime Day bursts → Auto-scaling, queue-based order processing',
  ],

  outOfScope: [
    'Product reviews and ratings',
    'Personalized recommendations',
    'Seller portal (3rd party sellers)',
    'Returns and refunds',
    'Multi-region/international',
    'Dynamic pricing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search products, add to cart, and checkout. The famous 'Prime Day' scaling and inventory consistency challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛍️',
  scenario: "Welcome to E-Commerce Systems Inc! You've been hired to build the next Amazon.",
  hook: "Your first customer is ready to shop. They've opened your website!",
  challenge: "Set up the basic request flow so customers can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your store is online!',
  achievement: 'Customers can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle shopping requests...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a customer opens Amazon.com:
1. Their browser (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, customers can\'t interact with your store at all.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling 200K requests per second during Prime Day',
    howTheyDoIt: 'Started with a simple C CGI server in 1994, now uses a massive distributed system with thousands of servers',
  },

  keyPoints: [
    'Client = the customer\'s device (browser, mobile app)',
    'App Server = your backend that processes shopping requests',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The customer\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles business logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'amazon-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers accessing Amazon', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles product search, cart, checkout', displayName: 'App Server' },
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
// STEP 2: Implement Core Shopping APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle shopping yet!",
  hook: "A customer tried to search for 'laptop' but got an error.",
  challenge: "Write the Python code to handle product search, cart, and checkout.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your store can handle shopping!',
  achievement: 'You implemented the core e-commerce functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can search products', after: '✓' },
    { label: 'Can add to cart', after: '✓' },
    { label: 'Can checkout', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all products and orders are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: E-Commerce Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Amazon, we need handlers for:
- \`search_products(query)\` - Find products by keyword
- \`add_to_cart(user_id, product_id)\` - Add item to shopping cart
- \`checkout(user_id)\` - Process payment and create order

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the shopping magic happens!',

  famousIncident: {
    title: 'Amazon Prime Day 2018 Crash',
    company: 'Amazon',
    year: '2018',
    whatHappened: 'On Prime Day, Amazon\'s servers couldn\'t handle the traffic surge. The site crashed for over an hour. Estimated loss: $100+ million in sales.',
    lessonLearned: 'Start simple, but design for growth. The handlers we write today will evolve to handle millions of requests.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Processing 3,500 orders per second during Prime Day',
    howTheyDoIt: 'Their Order Service uses async processing with message queues. Orders are queued and processed in parallel by hundreds of workers.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (product not found, insufficient inventory, etc.)',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory never fails',
      'Databases are too expensive',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Database adds complexity, so we\'ll add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'CRUD', explanation: 'Create, Read, Update, Delete operations', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'amazon-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search products, FR-2: Add to cart, FR-3: Checkout',
    taskDescription: 'Configure APIs and implement Python handlers for shopping flow',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/products/search, POST /api/v1/cart, POST /api/v1/checkout APIs',
      'Open the Python tab',
      'Implement search_products(), add_to_cart(), and checkout() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for search_products, add_to_cart, and checkout',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/products/search', 'POST /api/v1/cart', 'POST /api/v1/checkout'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Products, Orders, Inventory
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted...",
  hook: "When it came back online, your ENTIRE product catalog was GONE! 10,000 orders, vanished.",
  challenge: "Add a database so products, orders, and inventory survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Products and orders now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But product searches are getting slow as the catalog grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **Transactions**: ACID guarantees for checkout

For Amazon, we need tables for:
- \`products\` - Product catalog (SKU, name, price, inventory)
- \`users\` - Customer accounts
- \`carts\` - Shopping cart items
- \`orders\` - Order history
- \`order_items\` - Items in each order`,

  whyItMatters: 'Imagine losing ALL your products and orders because of a server restart. Customers would never trust your platform again!',

  famousIncident: {
    title: 'Amazon DynamoDB Launch Story',
    company: 'Amazon',
    year: '2004-2007',
    whatHappened: 'During peak shopping seasons, Amazon\'s Oracle databases couldn\'t scale. They built DynamoDB specifically to handle their scale needs.',
    lessonLearned: 'Persistent storage with proper scalability is non-negotiable for e-commerce.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Storing 500M products and 10M orders per day',
    howTheyDoIt: 'Uses DynamoDB (NoSQL) for product catalog and orders, partitioned by product_id and order_id. RDS (SQL) for transactions requiring ACID.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for transactional data like orders',
    'Use proper schemas: products, users, carts, orders, order_items',
    'Inventory must be managed with ACID transactions',
  ],

  quickCheck: {
    question: 'What happens to in-memory data when a server restarts?',
    options: [
      'It\'s automatically saved to disk',
      'It\'s backed up to the cloud',
      'It\'s completely lost',
      'It\'s restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When power is lost or the process restarts, all data in memory is gone.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with ACID transactions', icon: '🗄️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'amazon-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store products, users, carts, orders permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Product Catalog & Session Data
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million products, and searches are taking 2+ seconds!",
  hook: "Customers are abandoning searches: 'Why is Amazon so slow?' Every search hits the database.",
  challenge: "Add a cache to make product lookups and cart access lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Product pages load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Product search latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what happens when traffic spikes during a flash sale?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only if cache miss)
\`\`\`

For Amazon, we cache:
- **Product details** - Name, price, description, images
- **Shopping cart** - Session-based cart data
- **Search results** - Popular search queries
- **Inventory counts** - Stock levels (with short TTL)`,

  whyItMatters: 'At 200K reads/sec peak, hitting the database for every product view would melt it. Caching is essential.',

  famousIncident: {
    title: 'Amazon\'s "Two-Pizza Teams" Origin',
    company: 'Amazon',
    year: '2002',
    whatHappened: 'Amazon\'s monolithic architecture couldn\'t scale. Jeff Bezos mandated all teams create service APIs with their own databases and caches. This led to microservices.',
    lessonLearned: 'Distributed caching enables teams to scale independently. Each service owns its cache.',
    icon: '🍕',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Serving 5 billion product views per day',
    howTheyDoIt: 'Uses ElastiCache (Redis/Memcached) clusters to cache product catalog. Shopping carts are stored entirely in cache (not DB) until checkout.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (95% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Shopping cart lives entirely in cache until checkout',
    'Set appropriate TTL - short for inventory, longer for product details',
  ],

  quickCheck: {
    question: 'Why store shopping carts in cache instead of database?',
    options: [
      'Caches are cheaper',
      'Much faster access and temporary by nature - carts don\'t need durability',
      'Databases can\'t handle cart data',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Carts are temporary and read/written frequently. Cache provides fast access. Only persist to DB at checkout.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'amazon-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search products (fast), FR-2: Cart (in cache)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache product catalog and shopping carts', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (300 seconds for products)',
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
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 300 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "A flash sale on TVs caused traffic to spike 10x. One server can't handle it all.",
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
  conceptTitle: 'Load Balancing: Distribute the Load',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed

Common strategies:
- Round-robin: Take turns
- Least connections: Send to least busy server
- IP hash: Same user always goes to same server (sticky sessions)`,

  whyItMatters: 'At peak, Amazon handles 200K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Amazon Prime Day 2023 Success',
    company: 'Amazon',
    year: '2023',
    whatHappened: 'During Prime Day, Amazon handled record traffic with zero downtime. Their multi-tier load balancing architecture distributed billions of requests seamlessly.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes during sales events.',
    icon: '🏆',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling 200K requests/second during Prime Day',
    howTheyDoIt: 'Uses Application Load Balancers (ALB) at multiple layers - DNS, L4, L7 - to distribute traffic globally across thousands of servers',
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
    'Enables horizontal scaling (add more servers)',
    'Eliminates single point of failure',
    'Place between Client and App Servers',
  ],

  quickCheck: {
    question: 'What happens if one app server crashes when using a load balancer?',
    options: [
      'All requests fail',
      'Load balancer routes traffic to healthy servers',
      'Users see an error page',
      'The load balancer crashes too',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers and automatically route traffic to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'amazon-step-5',
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
// STEP 6: Add Database Replication
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your database crashed for 10 minutes last night. EVERYTHING stopped.",
  hook: "Customers couldn't search, add to cart, or checkout. Revenue loss: $500,000.",
  challenge: "Add database replication so a backup is always ready.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we need more app servers to handle peak traffic...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Data',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes (orders, inventory updates)
- **Replicas (Followers)**: Handle reads (product searches, order history)

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute product searches across replicas
- **Data safety**: Multiple copies of your data

For Amazon:
- Write orders to primary
- Read product catalog from replicas
- Replicas are eventually consistent (slight delay OK for product catalog)`,

  whyItMatters: 'A single database is a single point of failure. For Amazon\'s 10M orders/day, downtime is not acceptable.',

  famousIncident: {
    title: 'Amazon Inventory Overselling Incident',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'During a flash sale, replication lag caused inventory counts to be stale. Amazon oversold popular items, resulting in thousands of order cancellations.',
    lessonLearned: 'For inventory, use primary reads. For product catalog, replica reads are fine. Know when to use which!',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Zero tolerance for data loss on orders',
    howTheyDoIt: 'Uses Multi-AZ RDS with synchronous replication for order data. Product catalog uses async replication across regions.',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │  (orders, inv)   │
                         └────────┬─────────┘
                                  │ Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read:   │       │  (Read:   │       │  (Read:   │
       │ products) │       │ products) │       │ products) │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Primary handles writes (orders), replicas handle reads (product searches)',
    'If primary fails, a replica can be promoted',
    'Use replicas for read scaling - split product searches across them',
    'Critical reads (inventory) should hit primary to avoid stale data',
  ],

  quickCheck: {
    question: 'Should inventory checks read from primary or replica?',
    options: [
      'Replica - it\'s faster',
      'Primary - inventory must be accurate, can\'t be stale',
      'Either one works',
      'Cache only',
    ],
    correctIndex: 1,
    explanation: 'Inventory requires strong consistency. Replicas may have stale data due to replication lag. Always read from primary for inventory.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'amazon-step-6',
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
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2. This creates read copies of your data.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Horizontal Scaling (Multiple App Server Instances)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Traffic has grown 10x. One app server can't keep up!",
  hook: "Customers are getting timeouts during checkout. Your load balancer has nowhere to route traffic.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 10x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '5+' },
    { label: 'Capacity', before: '10K req/s', after: '200K+ req/s' },
  ],
  nextTeaser: "But order processing is still slow during checkout rushes...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Amazon:
- Start with 5-10 app server instances
- Auto-scale during Prime Day (100+ instances)
- Scale down during quiet periods to save costs`,

  whyItMatters: 'At 200K requests/second during Prime Day, you need 50+ app servers for checkout alone.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling global traffic during Prime Day',
    howTheyDoIt: 'Runs thousands of app server instances across multiple data centers. Auto-scales based on traffic with EC2 Auto Scaling Groups.',
  },

  famousIncident: {
    title: 'Amazon Black Friday Auto-Scaling Win',
    company: 'Amazon',
    year: '2019',
    whatHappened: 'Black Friday traffic was 30% higher than predicted. Amazon\'s auto-scaling kicked in, spinning up 10,000+ new instances in minutes. Zero downtime.',
    lessonLearned: 'Design for horizontal scaling from day 1. Auto-scaling is your best friend during unexpected traffic.',
    icon: '🎯',
  },

  diagram: `
                    ┌─────────────────────────┐
                    │     Load Balancer       │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
  ┌───────────┐           ┌───────────┐           ┌───────────┐
  │App Server │           │App Server │           │App Server │
  │ Instance 1│           │ Instance 2│           │ Instance 3│
  └───────────┘           └───────────┘           └───────────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │  Shared Cache & DB    │
                    └───────────────────────┘
`,

  keyPoints: [
    'Add more app server instances to handle more traffic',
    'Load balancer distributes requests across all instances',
    'All instances share the same cache and database',
    'Stateless servers are easier to scale (store sessions in cache, not memory)',
  ],

  quickCheck: {
    question: 'What\'s the main advantage of horizontal scaling over vertical scaling?',
    options: [
      'It\'s always faster',
      'There\'s no practical upper limit - keep adding servers',
      'It\'s easier to implement',
      'It uses less total resources',
    ],
    correctIndex: 1,
    explanation: 'Vertical scaling has a ceiling (biggest available server). Horizontal scaling can grow indefinitely by adding more servers.',
  },

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Vertical Scaling', explanation: 'Upgrade existing server', icon: '↕️' },
    { title: 'Stateless', explanation: 'Servers don\'t store user state', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'amazon-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from more compute capacity',
    taskDescription: 'Scale the App Server to multiple instances',
    successCriteria: [
      'Click on the App Server component',
      'Go to Configuration tab',
      'Set instances to 5 or more',
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
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on the App Server, then find the instance count in Configuration',
    level2: 'Set instances to 5 or more. The load balancer will distribute traffic across all instances.',
    solutionComponents: [{ type: 'app_server', config: { instances: 5 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Message Queue for Async Order Processing
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌟',
  scenario: "Prime Day just started! 10,000 orders are coming in per minute!",
  hook: "Checkout is timing out because processing each order synchronously takes too long.",
  challenge: "Add a message queue to handle order processing asynchronously.",
  illustration: 'order-rush',
};

const step8Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Order processing is now lightning fast!',
  achievement: 'Async processing handles order spikes efficiently',
  metrics: [
    { label: 'Checkout latency', before: '5s', after: '<1s' },
    { label: 'Order throughput', before: '100/sec', after: '3,500/sec' },
  ],
  nextTeaser: "But product images are loading slowly...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Order Processing',
  conceptExplanation: `The **order processing problem**: Each order requires multiple steps:
- Validate payment
- Update inventory
- Send confirmation email
- Notify warehouse
- Update analytics

**Synchronous**: Checkout → Do all steps → Return "Order placed!" ❌ (too slow, 5+ seconds)
**Async with Queue**: Checkout → Add to queue → Return "Order placed!" ✓ (< 1 second)
- Background workers process the queue
- Handle inventory updates and notifications in parallel

This is the **async processing** pattern for high-throughput systems.`,

  whyItMatters: 'Without async processing, customers wait too long at checkout. Every second of delay = lost sales.',

  famousIncident: {
    title: 'Amazon Prime Day 2021 Record',
    company: 'Amazon',
    year: '2021',
    whatHappened: 'Amazon processed 250 million items sold during Prime Day using their async order processing pipeline. Peak was 5,000+ orders/second.',
    lessonLearned: 'Message queues enable massive scale by decoupling request handling from processing. Essential for e-commerce.',
    icon: '🎊',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Processing 10M orders per day',
    howTheyDoIt: 'Uses SQS (Simple Queue Service) and Kinesis for event streaming. When you checkout, order goes to queue. Hundreds of workers process orders in parallel.',
  },

  diagram: `
Customer Checks Out
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│ App Server  │────▶│          Message Queue              │
│ (instant)   │     │  [order1, order2, order3, ...]      │
└─────────────┘     └──────────────┬──────────────────────┘
      │                            │
      │ Return                     │ Workers consume
      ▼ "Order placed!"            ▼
                          ┌─────────────────────┐
                          │  Order Workers      │
                          │  (background)       │
                          └──────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
        ┌──────────┐          ┌──────────┐          ┌──────────┐
        │ Payment  │          │Inventory │          │  Email   │
        │ Service  │          │ Update   │          │ Service  │
        └──────────┘          └──────────┘          └──────────┘
`,

  keyPoints: [
    'Message queue decouples checkout from order processing',
    'Customer gets instant response - processing happens in background',
    'Workers process queue in parallel for high throughput',
    'Queue provides buffer during traffic spikes',
    'Use for: order processing, inventory updates, email notifications',
  ],

  quickCheck: {
    question: 'Why do we use async order processing instead of synchronous?',
    options: [
      'It\'s cheaper',
      'Customers get instant checkout response while processing happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the customer doesn\'t wait. Order is confirmed instantly, and processing (payment, inventory, email) happens in the background.',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Decouple request from processing', icon: '⚡' },
    { title: 'Message Queue', explanation: 'Buffer for async tasks', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
  ],
};

const step8: GuidedStep = {
  id: 'amazon-step-8',
  stepNumber: 8,
  frIndex: 2,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-3: Checkout (now with async order processing)',
    taskDescription: 'Add a Message Queue for async order processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle order processing asynchronously', displayName: 'SQS / Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
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
  },

  hints: {
    level1: 'Drag a Message Queue (SQS/Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async order processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add Object Storage + CDN for Product Images
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Product pages are loading slowly - 5 seconds to load all images!",
  hook: "Each product has 5-10 high-res images. Serving from app servers is killing performance.",
  challenge: "Add object storage and CDN to serve product images efficiently.",
  illustration: 'slow-images',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Images load instantly!',
  achievement: 'CDN serves images from edge locations worldwide',
  metrics: [
    { label: 'Image load time', before: '5000ms', after: '200ms' },
    { label: 'App server bandwidth', before: '100GB/s', after: '5GB/s' },
  ],
  nextTeaser: "But we're over budget...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage + CDN: Serving Static Assets',
  conceptExplanation: `**The Problem**: Product images shouldn't be served by app servers:
- App servers are expensive
- Images are large (100KB-2MB each)
- Same images requested millions of times

**The Solution**:
1. **Object Storage (S3)** - Store product images cheaply
2. **CDN (CloudFront)** - Cache images at edge locations globally

Architecture:
- Upload product images to S3
- CDN pulls from S3 and caches at 200+ edge locations
- Users get images from nearest CDN server (< 50ms latency)
- App servers only serve dynamic data (search, cart, checkout)`,

  whyItMatters: 'At 5B product views/day with 5 images each = 25B image requests. CDN reduces costs by 90% and improves speed 10x.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Serving product images globally',
    howTheyDoIt: 'Uses CloudFront CDN with 400+ edge locations. Product images are cached at edges. 95% of image requests never reach origin (S3).',
  },

  famousIncident: {
    title: 'Amazon S3 Outage Impact',
    company: 'Amazon',
    year: '2017',
    whatHappened: 'S3 had a 4-hour outage in us-east-1. Many websites broke because they served images directly from S3. Amazon was fine because CloudFront cached images.',
    lessonLearned: 'Always put a CDN in front of object storage. CDN provides caching AND resilience.',
    icon: '🛡️',
  },

  diagram: `
┌──────────────────────────────────────────────────────┐
│  Product Image Upload (once)                         │
│  App Server ──▶ S3 Bucket (images/product-123.jpg)  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Customer Views Product (millions of times)          │
│                                                       │
│  Customer ──▶ CDN Edge (Seattle) ──▶ S3             │
│                │                                      │
│                │ Cache hit (95%)                     │
│                ▼                                      │
│           Return image (< 50ms)                      │
└──────────────────────────────────────────────────────┘
`,

  keyPoints: [
    'Store product images in Object Storage (S3)',
    'Put CDN in front for edge caching',
    'CDN reduces latency (serve from nearest edge)',
    'CDN reduces costs (fewer S3 requests)',
    'App servers freed to handle dynamic requests',
  ],

  quickCheck: {
    question: 'Why use CDN instead of serving images directly from S3?',
    options: [
      'CDN is cheaper',
      'CDN caches at edge locations for lower latency and reduced S3 costs',
      'S3 can\'t handle images',
      'CDN has better security',
    ],
    correctIndex: 1,
    explanation: 'CDN caches images at 200+ edge locations globally. Users get images from nearest edge (fast), and most requests never hit S3 (cheap).',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Cheap storage for static files (S3)', icon: '🗄️' },
    { title: 'CDN', explanation: 'Edge caching network for fast delivery', icon: '🌐' },
    { title: 'Edge Location', explanation: 'Server close to users for low latency', icon: '📍' },
  ],
};

const step9: GuidedStep = {
  id: 'amazon-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-1: Product browsing (with fast image loading)',
    taskDescription: 'Add Object Storage and CDN for product images',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store product images cheaply', displayName: 'S3' },
      { type: 'cdn', reason: 'Cache images at edge locations', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'Object Storage (S3) component added',
      'CDN component added',
      'App Server connected to Object Storage',
      'CDN connected to Object Storage',
      'Client connected to CDN for images',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag Object Storage (S3) and CDN components onto the canvas',
    level2: 'Connect: App Server → Object Storage (for uploads), CDN → Object Storage (for serving)',
    solutionComponents: [{ type: 'object_storage' }, { type: 'cdn' }],
    solutionConnections: [
      { from: 'app_server', to: 'object_storage' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your monthly cloud bill is $2 million.",
  hook: "The CFO says: 'Cut costs by 30% or we're reducing features.'",
  challenge: "Optimize your architecture to stay under budget while handling Prime Day scale.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Amazon!',
  achievement: 'A scalable, cost-effective e-commerce platform',
  metrics: [
    { label: 'Monthly cost', before: '$2M', after: 'Under budget' },
    { label: 'Product search latency', after: '<200ms' },
    { label: 'Checkout success rate', after: '99.9%' },
    { label: 'Can handle', after: '200K req/sec (Prime Day)' },
  ],
  nextTeaser: "You've mastered Amazon system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for e-commerce:
1. **Right-size instances** - Don't over-provision app servers
2. **Auto-scale aggressively** - Scale up for Prime Day, down at night
3. **Use spot instances** - 70% cheaper for async workers
4. **Cache product catalog** - Reduce expensive database reads
5. **CDN for images** - Cheaper than serving from app servers
6. **Archive old orders** - Move to cold storage after 1 year

For Amazon:
- Auto-scale app servers (5 instances normally, 100+ during Prime Day)
- Use spot instances for order processing workers
- Aggressive CDN caching (95% hit rate = 95% cost savings)
- Right-size database replicas`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it. Every dollar saved = more profit.',

  famousIncident: {
    title: 'Amazon Cost Optimization Culture',
    company: 'Amazon',
    year: '2000s',
    whatHappened: 'Jeff Bezos mandated "frugality" as a leadership principle. Teams compete to reduce costs while maintaining performance. This culture enabled Amazon to offer lower prices than competitors.',
    lessonLearned: 'At scale, even 1% cost optimization = millions saved. Make cost a first-class requirement, not an afterthought.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Heavily optimizes every component. Uses AWS reserved instances for baseline, spot instances for burst. Aggressive caching and CDN usage. Auto-scales everything.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Auto-scale based on traffic (don\'t pay for idle capacity)',
    'Use CDN and caching to reduce backend load',
    'Right-size all components (database, cache, app servers)',
    'Use spot instances for fault-tolerant workloads (workers)',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a read-heavy e-commerce system?',
    options: [
      'Use bigger servers',
      'Aggressive caching and CDN to reduce database and app server load',
      'Delete old data',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'With 500:1 read/write ratio, caching product catalog and CDN for images eliminates 90%+ of backend load. Massive cost savings.',
  },

  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity based on load', icon: '📊' },
    { title: 'Spot Instances', explanation: 'Cheap compute for fault-tolerant workloads', icon: '💵' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'amazon-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $1000/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $1000/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component\'s configuration for over-provisioning',
    level2: 'Consider: auto-scaling settings, cache TTL, CDN hit rate, right-sized replicas. Keep at least 3 app servers.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const amazonGuidedTutorial: GuidedTutorial = {
  problemId: 'amazon',
  title: 'Design Amazon',
  description: 'Build an e-commerce platform with product catalog, shopping cart, and checkout',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🛍️',
    hook: "You've been hired as Lead Engineer at E-Commerce Systems Inc!",
    scenario: "Your mission: Build an Amazon-like platform that can handle millions of customers shopping for 500M+ products, with rock-solid checkout and inventory management.",
    challenge: "Can you design a system that handles Prime Day scale and prevents inventory overselling?",
  },

  requirementsPhase: amazonRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching (Product Catalog & Cart)',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Message Queues (Order Processing)',
    'Async Processing',
    'Object Storage (S3)',
    'CDN (CloudFront)',
    'Inventory Consistency',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Database replicas)',
    'Chapter 6: Partitioning (Product catalog)',
    'Chapter 7: Transactions (Checkout)',
    'Chapter 11: Stream Processing (Order events)',
  ],
};

export default amazonGuidedTutorial;
