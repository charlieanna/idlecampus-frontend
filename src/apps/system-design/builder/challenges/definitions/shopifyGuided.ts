import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Shopify Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building an e-commerce platform like Shopify.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, replication, load balancing, etc.)
 *
 * Key Concepts:
 * - Multi-tenant architecture (isolated stores)
 * - Real-time inventory management
 * - Payment processing integration
 * - Order fulfillment workflows
 * - Store customization and themes
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const shopifyRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an e-commerce platform like Shopify",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Senior Architect at E-Commerce Platform Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What core features do merchants need to run an online store?",
      answer: "Merchants need to:\n\n1. **Create and manage stores** - Set up their online storefront\n2. **Manage product catalog** - Add products with descriptions, images, prices, inventory\n3. **Process orders** - Handle customer purchases from cart to checkout\n4. **Accept payments** - Integrate with payment gateways (Stripe, PayPal)\n5. **Manage inventory** - Track stock levels and prevent overselling",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "Shopify is a platform for merchants to build and run online stores - it's multi-tenant",
    },
    {
      id: 'store-creation',
      category: 'functional',
      question: "How does a merchant create their online store?",
      answer: "Merchants can:\n1. **Sign up and create a store** with a unique subdomain (merchant-name.myshopify.com)\n2. **Choose a theme** - Select from pre-built templates\n3. **Customize branding** - Add logo, colors, and store info\n4. **Add products** - Build their product catalog",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Each store is isolated - multi-tenant architecture is critical for Shopify",
    },
    {
      id: 'product-management',
      category: 'functional',
      question: "What can merchants do with their product catalog?",
      answer: "Merchants can:\n1. **Add/edit products** - Title, description, price, images\n2. **Organize by collections** - Group products (e.g., 'Summer Sale', 'New Arrivals')\n3. **Manage variants** - Different sizes, colors for the same product\n4. **Set inventory levels** - Track stock per variant",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Product catalog is the heart of any e-commerce store",
    },
    {
      id: 'shopping-checkout',
      category: 'functional',
      question: "How do customers complete a purchase?",
      answer: "The shopping flow:\n1. **Browse products** - View catalog and product details\n2. **Add to cart** - Collect items before checkout\n3. **Checkout** - Enter shipping and payment info\n4. **Payment processing** - Charge via Stripe/PayPal\n5. **Order confirmation** - Create order and send confirmation email",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Checkout is where conversion happens - must be fast and reliable",
    },
    {
      id: 'payment-integration',
      category: 'functional',
      question: "How do we handle payment processing?",
      answer: "We integrate with payment gateways:\n- **Shopify Payments** (built on Stripe)\n- **Third-party gateways** (PayPal, Square, etc.)\n\nWe don't store card data - payment gateways handle PCI compliance.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Never handle raw card data - delegate to payment processors",
    },
    {
      id: 'order-management',
      category: 'functional',
      question: "What happens after an order is placed?",
      answer: "Order lifecycle:\n1. **Order created** - Record in database\n2. **Payment captured** - Charge customer\n3. **Inventory decremented** - Update stock levels\n4. **Fulfillment** - Merchant ships the order\n5. **Tracking updates** - Customer sees shipping status",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Orders require a state machine - paid, fulfilled, shipped, delivered",
    },
    {
      id: 'analytics',
      category: 'clarification',
      question: "Should merchants see sales analytics and reports?",
      answer: "Yes, analytics are important (revenue, top products, traffic sources), but for MVP let's focus on the core shopping experience. Analytics can be v2.",
      importance: 'nice-to-have',
      insight: "Analytics add complexity - prioritize the transaction flow first",
    },
    {
      id: 'apps-plugins',
      category: 'clarification',
      question: "Should we support third-party apps and plugins?",
      answer: "Eventually yes (app marketplace is huge for Shopify), but for MVP, let's defer this. Focus on core store functionality first.",
      importance: 'nice-to-have',
      insight: "App ecosystem is powerful but requires API marketplace infrastructure",
    },

    // SCALE & NFRs
    {
      id: 'throughput-merchants',
      category: 'throughput',
      question: "How many merchant stores should we support?",
      answer: "1 million active stores on the platform",
      importance: 'critical',
      learningPoint: "Multi-tenant architecture at massive scale - data isolation is critical",
    },
    {
      id: 'throughput-orders',
      category: 'throughput',
      question: "How many orders per day across all stores?",
      answer: "About 5 million orders per day across all merchants",
      importance: 'critical',
      calculation: {
        formula: "5M ÷ 86,400 sec = 58 orders/sec",
        result: "~58 writes/sec (300 at peak during Black Friday/Cyber Monday)",
      },
      learningPoint: "E-commerce is bursty - Black Friday sees 5-10x normal volume",
    },
    {
      id: 'throughput-traffic',
      category: 'throughput',
      question: "How many shoppers visit stores daily?",
      answer: "About 50 million shopper sessions per day (browsing products, adding to cart)",
      importance: 'critical',
      calculation: {
        formula: "50M sessions × 10 page views avg = 500M views/day ÷ 86,400 = 5,787 reads/sec",
        result: "~5.8K reads/sec (30K at peak during sales events)",
      },
      learningPoint: "Heavily read-dominated - 100:1 read-to-write ratio",
    },
    {
      id: 'black-friday-spike',
      category: 'burst',
      question: "What happens during Black Friday / Cyber Monday?",
      answer: "Traffic spikes 10x! Flash sales cause massive bursts. System must handle:\n- 30K+ page views/sec\n- 300+ orders/sec\n- Inventory contention on hot products\n- Payment gateway timeouts",
      importance: 'critical',
      insight: "Black Friday is the ultimate stress test - design for burst capacity",
    },
    {
      id: 'inventory-consistency',
      category: 'consistency',
      question: "How critical is inventory accuracy?",
      answer: "EXTREMELY critical:\n- Can't oversell (sell items out of stock)\n- Must handle concurrent checkouts on last item\n- Inventory updates require strong consistency\n\nBut product catalog can be eventually consistent.",
      importance: 'critical',
      learningPoint: "Different consistency requirements: strong for inventory/orders, eventual for catalog",
    },
    {
      id: 'latency-storefront',
      category: 'latency',
      question: "How fast should store pages load?",
      answer: "p99 under 500ms for product pages. Slow stores = abandoned carts and lost sales.",
      importance: 'critical',
      learningPoint: "Page speed directly impacts conversion rates - optimize aggressively",
    },
    {
      id: 'latency-checkout',
      category: 'latency',
      question: "How fast should checkout complete?",
      answer: "p99 under 2 seconds from 'Place Order' to confirmation. Reliability is more important than speed - can't double-charge or lose orders.",
      importance: 'critical',
      learningPoint: "Checkout is where money changes hands - must be reliable and fast",
    },
    {
      id: 'data-isolation',
      category: 'security',
      question: "How do we ensure merchant data is isolated?",
      answer: "Each merchant's data MUST be completely isolated:\n- Store A can never access Store B's data\n- Orders, products, customers are all tenant-scoped\n- Use tenant_id in all database queries\n\nThis is a security requirement!",
      importance: 'critical',
      learningPoint: "Multi-tenant systems require careful data isolation - one bug = massive data breach",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'shopping-checkout', 'payment-integration', 'black-friday-spike'],
  criticalFRQuestionIds: ['core-features', 'product-management', 'shopping-checkout'],
  criticalScaleQuestionIds: ['throughput-orders', 'black-friday-spike', 'inventory-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Merchants can create and customize stores',
      description: 'Set up storefront with unique domain and branding',
      emoji: '🏪',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Merchants can manage product catalog',
      description: 'Add, edit, organize products with images and inventory',
      emoji: '📦',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Customers can browse and add to cart',
      description: 'View products and collect items before checkout',
      emoji: '🛒',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Customers can checkout and pay',
      description: 'Complete purchase with payment processing',
      emoji: '💳',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Merchants can manage orders',
      description: 'View and fulfill customer orders',
      emoji: '📋',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million merchant stores',
    writesPerDay: '5 million orders',
    readsPerDay: '500 million page views',
    peakMultiplier: 10,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 58, peak: 300 },
    calculatedReadRPS: { average: 5787, peak: 30000 },
    maxPayloadSize: '~10KB (product with images)',
    storagePerRecord: '~5KB (product), ~2KB (order)',
    storageGrowthPerYear: '~10TB (products + orders + images)',
    redirectLatencySLA: 'p99 < 500ms (storefront)',
    createLatencySLA: 'p99 < 2s (checkout)',
  },

  architecturalImplications: [
    '✅ Multi-tenant (1M stores) → Careful data isolation with tenant_id',
    '✅ Read-heavy (100:1) → Aggressive caching for product catalog',
    '✅ 30K reads/sec at peak → CDN for store pages and images',
    '✅ Inventory consistency → Strong consistency for checkout transactions',
    '✅ Black Friday bursts → Auto-scaling, queue-based order processing',
    '✅ Payment integration → Delegate to Stripe/PayPal, never store cards',
  ],

  outOfScope: [
    'Analytics and reporting',
    'Third-party app marketplace',
    'Multi-language/multi-currency',
    'Advanced SEO features',
    'Email marketing automation',
    'Abandoned cart recovery',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where merchants can create stores, add products, and process orders. The famous 'Black Friday' scaling and multi-tenant isolation challenges will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏪',
  scenario: "Welcome to E-Commerce Platform Inc! You've been hired to build the next Shopify.",
  hook: "Your first merchant wants to open their online store!",
  challenge: "Set up the basic request flow so merchants and customers can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Merchants and customers can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle store requests...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a merchant or customer uses Shopify:
1. Their browser (or mobile app) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

For Shopify, there are TWO types of clients:
- **Merchant Admin** - Merchants managing their stores
- **Customer Storefront** - Shoppers browsing and buying

Both connect to the same backend server!`,

  whyItMatters: 'Without this connection, merchants can\'t create stores and customers can\'t shop.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Handling 30K requests per second during Black Friday',
    howTheyDoIt: 'Started with a simple Ruby on Rails server in 2006, now uses a massive distributed system across multiple data centers',
  },

  keyPoints: [
    'Client = merchant admin or customer storefront (browser, mobile app)',
    'App Server = your backend that processes store and shopping requests',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The merchant or customer\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles business logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'shopify-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents merchants and customers accessing Shopify', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles store management, catalog, checkout', displayName: 'App Server' },
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
// STEP 2: Implement Core Store APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle stores yet!",
  hook: "A merchant tried to create a store but got an error. A customer tried to view products - nothing works!",
  challenge: "Write the Python code to handle store creation, product management, and checkout.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your store APIs are working!',
  achievement: 'You implemented the core e-commerce platform functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can create stores', after: '✓' },
    { label: 'Can manage products', after: '✓' },
    { label: 'Can add to cart', after: '✓' },
    { label: 'Can checkout', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all stores and products are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: E-Commerce Platform Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Shopify, we need handlers for:
- \`create_store(merchant_id, store_name)\` - Create a new merchant store
- \`add_product(store_id, product_data)\` - Add product to catalog
- \`add_to_cart(store_id, customer_id, product_id)\` - Add item to cart
- \`checkout(store_id, customer_id)\` - Process payment and create order

**Critical: Multi-tenant isolation!**
Every operation must be scoped to a store_id. Store A can NEVER access Store B's data.

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the e-commerce magic happens!',

  famousIncident: {
    title: 'Shopify Black Friday 2020 Success',
    company: 'Shopify',
    year: '2020',
    whatHappened: 'During Black Friday/Cyber Monday 2020, Shopify merchants processed over $5.1 billion in sales. The platform handled peak traffic of 10,000+ orders per minute without any major outages.',
    lessonLearned: 'Start simple with clear APIs, but design for explosive growth. The handlers we write today will evolve to handle millions of requests.',
    icon: '🚀',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing 300 orders per second during Black Friday',
    howTheyDoIt: 'Their Order Service uses async processing with message queues. Orders are queued and processed in parallel by hundreds of workers.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Always scope operations by store_id (multi-tenant isolation)',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (product not found, insufficient inventory, etc.)',
  ],

  quickCheck: {
    question: 'Why is multi-tenant isolation critical for Shopify?',
    options: [
      'It makes the system faster',
      'Each store\'s data must be completely isolated - Store A can never access Store B\'s data',
      'It reduces storage costs',
      'It simplifies the code',
    ],
    correctIndex: 1,
    explanation: 'Multi-tenant platforms serve many customers on shared infrastructure. Data isolation is a security requirement - one bug could expose millions of stores\' data.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'Multi-tenant', explanation: 'Multiple stores share the same infrastructure', icon: '🏢' },
    { title: 'Tenant Isolation', explanation: 'Each store\'s data is completely separate', icon: '🔒' },
  ],
};

const step2: GuidedStep = {
  id: 'shopify-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Create stores, FR-2: Manage products, FR-3: Cart, FR-4: Checkout',
    taskDescription: 'Configure APIs and implement Python handlers for store and shopping flow',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/stores, POST /api/v1/products, POST /api/v1/cart, POST /api/v1/checkout APIs',
      'Open the Python tab',
      'Implement create_store(), add_product(), add_to_cart(), and checkout() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_store, add_product, add_to_cart, and checkout',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/stores', 'POST /api/v1/products', 'POST /api/v1/cart', 'POST /api/v1/checkout'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Stores, Products, Orders
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed during a deployment...",
  hook: "When it came back online, 500 merchant stores were GONE! All their products, orders - vanished.",
  challenge: "Add a database so stores, products, and orders survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Stores, products, and orders now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But product pages are loading slowly as stores grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **Transactions**: ACID guarantees for checkout

For Shopify, we need tables for:
- \`stores\` - Merchant store info (name, domain, settings)
- \`products\` - Product catalog (title, price, inventory)
- \`customers\` - Customer accounts
- \`carts\` - Shopping cart items
- \`orders\` - Order history
- \`order_items\` - Items in each order

**Critical: All tables must have store_id for tenant isolation!**`,

  whyItMatters: 'Imagine 1 million merchants losing their stores because of a server restart. The company would be finished!',

  famousIncident: {
    title: 'Shopify Database Scaling Journey',
    company: 'Shopify',
    year: '2011-2012',
    whatHappened: 'As Shopify grew from thousands to millions of stores, their single PostgreSQL database couldn\'t keep up. They implemented database sharding, partitioning stores across multiple databases.',
    lessonLearned: 'Persistent storage with proper scalability is non-negotiable for multi-tenant platforms.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Storing 1M stores with millions of products and orders',
    howTheyDoIt: 'Uses MySQL (sharded by store_id) for core data. Each shard handles a subset of stores. This allows horizontal scaling as stores grow.',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL/MySQL) for transactional data like orders',
    'Use proper schemas: stores, products, customers, carts, orders',
    'All tables MUST include store_id for multi-tenant isolation',
    'Inventory and orders require ACID transactions',
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
    { title: 'Schema', explanation: 'Table structure with relationships', icon: '📐' },
  ],
};

const step3: GuidedStep = {
  id: 'shopify-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store stores, products, orders permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Product Catalog & Sessions
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your merchants have added 100,000+ products, and storefronts are loading in 3+ seconds!",
  hook: "Customers are abandoning carts: 'Why is this store so slow?' Every page view hits the database.",
  challenge: "Add a cache to make product lookups and cart access lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Store pages load 15x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Product page latency', before: '3000ms', after: '200ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But what happens when a popular store gets a traffic surge?",
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

For Shopify, we cache:
- **Product catalog** - Product details, prices, images (per store)
- **Store settings** - Store configuration and themes
- **Shopping cart** - Session-based cart data
- **Inventory counts** - Stock levels (with short TTL to stay fresh)

**Important:** Cache keys must include store_id for isolation!`,

  whyItMatters: 'At 30K reads/sec peak, hitting the database for every product view would melt it. Caching is essential.',

  famousIncident: {
    title: 'Shopify Flash Sale Performance',
    company: 'Shopify',
    year: '2019',
    whatHappened: 'When Kylie Jenner launched a product on her Shopify store, traffic spiked 100x instantly. Without aggressive caching, the database would have crashed. Redis cache absorbed 98% of reads.',
    lessonLearned: 'Caching enables viral moments. One hot store can\'t bring down the entire platform.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Serving 500 million page views per day',
    howTheyDoIt: 'Uses Redis clusters to cache product catalog per store. Shopping carts are stored entirely in cache (not DB) until checkout.',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of requests)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Shopping cart lives entirely in cache until checkout',
    'Cache keys must include store_id (e.g., store:123:product:456)',
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
    explanation: 'Carts are temporary and read/written frequently. Cache provides fast access. Only persist to DB at checkout when order is created.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'shopify-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Product catalog (fast), FR-3: Cart (in cache)',
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
  hook: "A viral product launch caused traffic to spike 20x. One server can't handle it all.",
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

  whyItMatters: 'At peak, Shopify handles 30K requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Shopify Black Friday 2021 Record',
    company: 'Shopify',
    year: '2021',
    whatHappened: 'During Black Friday/Cyber Monday 2021, Shopify merchants made over $6.3 billion in sales. Peak traffic reached 10,000+ orders per minute. Their multi-tier load balancing distributed requests seamlessly with 99.99% uptime.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes during sales events.',
    icon: '🏆',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Handling 30K requests/second during Black Friday',
    howTheyDoIt: 'Uses Load Balancers at multiple layers to distribute traffic globally across thousands of servers',
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
    explanation: 'Load balancers detect unhealthy servers via health checks and automatically route traffic only to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'shopify-step-5',
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
  scenario: "Your database crashed for 15 minutes during peak hours. EVERYTHING stopped.",
  hook: "Merchants couldn't fulfill orders. Customers couldn't checkout. Revenue loss: $2 million.",
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
- **Replicas (Followers)**: Handle reads (product queries, order history)

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute product queries across replicas
- **Data safety**: Multiple copies of your data

For Shopify:
- Write orders to primary
- Read product catalog from replicas
- Replicas are eventually consistent (slight delay OK for product catalog)
- But inventory reads MUST go to primary (strong consistency)`,

  whyItMatters: 'A single database is a single point of failure. For Shopify\'s 5M orders/day, downtime is not acceptable.',

  famousIncident: {
    title: 'Shopify Database Failover Success',
    company: 'Shopify',
    year: '2018',
    whatHappened: 'During a routine maintenance, a primary database failed unexpectedly. Automated failover promoted a replica to primary within 30 seconds. Most customers didn\'t even notice.',
    lessonLearned: 'Database replication with automated failover is essential for high availability.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Zero tolerance for data loss on orders',
    howTheyDoIt: 'Uses Multi-AZ MySQL with synchronous replication for order data. Product catalog uses async replication for read scaling.',
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
    'Primary handles writes (orders), replicas handle reads (product queries)',
    'If primary fails, a replica can be promoted',
    'Use replicas for read scaling - split product queries across them',
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
    explanation: 'Inventory requires strong consistency. Replicas may have stale data due to replication lag. Always read from primary for inventory to prevent overselling.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'shopify-step-6',
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
  scenario: "Traffic has grown 15x. One app server can't keep up!",
  hook: "Customers are getting timeouts during checkout. Your load balancer has nowhere to route traffic.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 15x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '10+' },
    { label: 'Capacity', before: '2K req/s', after: '30K+ req/s' },
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

For Shopify:
- Start with 10-20 app server instances
- Auto-scale during Black Friday (100+ instances)
- Scale down during quiet periods to save costs`,

  whyItMatters: 'At 30K requests/second during Black Friday, you need 50+ app servers to handle the load.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Handling global traffic during Black Friday',
    howTheyDoIt: 'Runs thousands of app server instances across multiple data centers. Auto-scales based on traffic patterns.',
  },

  famousIncident: {
    title: 'Shopify Black Friday Auto-Scaling',
    company: 'Shopify',
    year: '2020',
    whatHappened: 'Black Friday traffic was 40% higher than predicted. Shopify\'s auto-scaling kicked in, spinning up 1,000+ new instances in minutes. Zero downtime, merchants made $5.1B in sales.',
    lessonLearned: 'Design for horizontal scaling from day 1. Auto-scaling handles unexpected viral moments.',
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
  id: 'shopify-step-7',
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
  scenario: "Black Friday just started! 5,000 orders are coming in per minute!",
  hook: "Checkout is timing out because processing each order synchronously takes too long.",
  challenge: "Add a message queue to handle order processing asynchronously.",
  illustration: 'order-rush',
};

const step8Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Order processing is now lightning fast!',
  achievement: 'Async processing handles order spikes efficiently',
  metrics: [
    { label: 'Checkout latency', before: '4s', after: '<1s' },
    { label: 'Order throughput', before: '50/sec', after: '300/sec' },
  ],
  nextTeaser: "But product images are loading slowly...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Order Processing',
  conceptExplanation: `The **order processing problem**: Each order requires multiple steps:
- Validate payment
- Update inventory
- Send confirmation email to customer
- Notify merchant
- Trigger fulfillment workflow
- Update analytics

**Synchronous**: Checkout → Do all steps → Return "Order placed!" ❌ (too slow, 4+ seconds)
**Async with Queue**: Checkout → Add to queue → Return "Order placed!" ✓ (< 1 second)
- Background workers process the queue
- Handle inventory updates and notifications in parallel

This is the **async processing** pattern for high-throughput systems.`,

  whyItMatters: 'Without async processing, customers wait too long at checkout. Every second of delay = lost sales.',

  famousIncident: {
    title: 'Shopify Black Friday 2019 Peak',
    company: 'Shopify',
    year: '2019',
    whatHappened: 'During Black Friday 2019, Shopify processed over 10,000 orders per minute at peak using their async order processing pipeline. Without message queues, the system would have collapsed.',
    lessonLearned: 'Message queues enable massive scale by decoupling request handling from processing. Essential for e-commerce.',
    icon: '🎊',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing 5M orders per day',
    howTheyDoIt: 'Uses Kafka and RabbitMQ for event streaming. When checkout happens, order goes to queue. Hundreds of workers process orders in parallel.',
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
        │ Gateway  │          │ Update   │          │ Service  │
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
  id: 'shopify-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Checkout (now with async order processing)',
    taskDescription: 'Add a Message Queue for async order processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle order processing asynchronously', displayName: 'Kafka / RabbitMQ' },
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
    level1: 'Drag a Message Queue (Kafka/RabbitMQ) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async order processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add Object Storage + CDN for Product Images and Store Assets
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Store pages are loading slowly - 6 seconds to load all product images!",
  hook: "Each product has 5-10 high-res images. Serving from app servers is killing performance.",
  challenge: "Add object storage and CDN to serve product images and store assets efficiently.",
  illustration: 'slow-images',
};

const step9Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Images load instantly!',
  achievement: 'CDN serves images from edge locations worldwide',
  metrics: [
    { label: 'Image load time', before: '6000ms', after: '150ms' },
    { label: 'App server bandwidth', before: '200GB/s', after: '10GB/s' },
  ],
  nextTeaser: "But we're over budget...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage + CDN: Serving Static Assets',
  conceptExplanation: `**The Problem**: Product images and store assets shouldn't be served by app servers:
- App servers are expensive
- Images are large (100KB-5MB each)
- Same images requested millions of times

**The Solution**:
1. **Object Storage (S3)** - Store product images and store assets cheaply
2. **CDN (CloudFront)** - Cache images at edge locations globally

Architecture:
- Merchants upload product images to S3
- CDN pulls from S3 and caches at 200+ edge locations
- Shoppers get images from nearest CDN server (< 50ms latency)
- App servers only serve dynamic data (cart, checkout, admin)`,

  whyItMatters: 'At 500M page views/day with 5 images each = 2.5B image requests. CDN reduces costs by 90% and improves speed 10x.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Serving product images for 1M stores globally',
    howTheyDoIt: 'Uses CloudFront CDN with 400+ edge locations. Product images are cached at edges. 95% of image requests never reach origin (S3).',
  },

  famousIncident: {
    title: 'Shopify CDN Performance Win',
    company: 'Shopify',
    year: '2017',
    whatHappened: 'During a viral product launch, one store got 1M visitors in an hour. Without CDN, the app servers would have been overwhelmed serving images. CDN absorbed 99% of traffic.',
    lessonLearned: 'Always put a CDN in front of static assets. CDN provides speed AND resilience.',
    icon: '🛡️',
  },

  diagram: `
┌──────────────────────────────────────────────────────┐
│  Product Image Upload (once)                         │
│  Merchant ──▶ App Server ──▶ S3 Bucket              │
│                         (images/store-123/prod.jpg)  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Customer Views Product (millions of times)          │
│                                                       │
│  Customer ──▶ CDN Edge (nearby) ──▶ S3              │
│                │                                      │
│                │ Cache hit (95%)                     │
│                ▼                                      │
│           Return image (< 50ms)                      │
└──────────────────────────────────────────────────────┘
`,

  keyPoints: [
    'Store product images and store assets in Object Storage (S3)',
    'Put CDN in front for edge caching',
    'CDN reduces latency (serve from nearest edge)',
    'CDN reduces costs (fewer S3 requests)',
    'App servers freed to handle dynamic requests',
    'Images are namespaced by store_id (store-123/product-456.jpg)',
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
  id: 'shopify-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-2: Product catalog (with fast image loading)',
    taskDescription: 'Add Object Storage and CDN for product images',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store product images and store assets cheaply', displayName: 'S3' },
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
  scenario: "Finance is alarmed! Your monthly cloud bill is $3 million.",
  hook: "The CFO says: 'Cut costs by 35% or we're reducing features.'",
  challenge: "Optimize your architecture to stay under budget while handling Black Friday scale.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Shopify!',
  achievement: 'A scalable, cost-effective e-commerce platform',
  metrics: [
    { label: 'Monthly cost', before: '$3M', after: 'Under budget' },
    { label: 'Store page load time', after: '<500ms' },
    { label: 'Checkout success rate', after: '99.9%' },
    { label: 'Can handle', after: '30K req/sec (Black Friday)' },
  ],
  nextTeaser: "You've mastered Shopify system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies for e-commerce platforms:
1. **Right-size instances** - Don't over-provision app servers
2. **Auto-scale aggressively** - Scale up for Black Friday, down at night
3. **Use spot instances** - 70% cheaper for async workers
4. **Cache product catalog** - Reduce expensive database reads
5. **CDN for images** - Cheaper than serving from app servers
6. **Archive old orders** - Move to cold storage after 1 year
7. **Database sharding** - Split by store_id for horizontal scaling

For Shopify:
- Auto-scale app servers (10 instances normally, 100+ during Black Friday)
- Use spot instances for order processing workers
- Aggressive CDN caching (95% hit rate = 95% cost savings)
- Right-size database replicas
- Shard databases by store_id`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it. Every dollar saved = more profit or lower merchant fees.',

  famousIncident: {
    title: 'Shopify Infrastructure Efficiency',
    company: 'Shopify',
    year: '2015-2020',
    whatHappened: 'As Shopify scaled from 100K to 1M+ stores, they aggressively optimized infrastructure costs. Through database sharding, auto-scaling, and CDN optimization, they reduced cost-per-store by 60% while handling 10x more traffic.',
    lessonLearned: 'At scale, even 1% cost optimization = millions saved. Make cost a first-class requirement, not an afterthought.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Running 1M stores at massive scale',
    howTheyDoIt: 'Heavily optimizes every component. Uses reserved instances for baseline, spot instances for burst. Aggressive caching and CDN usage. Auto-scales everything. Database sharding by store_id.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Auto-scale based on traffic (don\'t pay for idle capacity)',
    'Use CDN and caching to reduce backend load',
    'Right-size all components (database, cache, app servers)',
    'Use spot instances for fault-tolerant workloads (workers)',
    'Shard databases by store_id for horizontal scaling',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a read-heavy e-commerce platform?',
    options: [
      'Use bigger servers',
      'Aggressive caching and CDN to reduce database and app server load',
      'Delete old data',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'With 100:1 read/write ratio, caching product catalog and CDN for images eliminates 90%+ of backend load. Massive cost savings.',
  },

  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity based on load', icon: '📊' },
    { title: 'Spot Instances', explanation: 'Cheap compute for fault-tolerant workloads', icon: '💵' },
    { title: 'Database Sharding', explanation: 'Split data across multiple databases by store_id', icon: '🔀' },
  ],
};

const step10: GuidedStep = {
  id: 'shopify-step-10',
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
    level2: 'Consider: auto-scaling settings, cache TTL, CDN hit rate, right-sized replicas. Keep at least 5 app servers.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const shopifyGuidedTutorial: GuidedTutorial = {
  problemId: 'shopify',
  title: 'Design Shopify',
  description: 'Build a multi-tenant e-commerce platform with store management, product catalog, and checkout',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🏪',
    hook: "You've been hired as Lead Engineer at E-Commerce Platform Inc!",
    scenario: "Your mission: Build a Shopify-like platform that enables millions of merchants to run their online stores, with Black Friday-ready scaling and bulletproof multi-tenant isolation.",
    challenge: "Can you design a system that handles 1M stores, 30K requests/sec during Black Friday, and prevents data leaks between merchants?",
  },

  requirementsPhase: shopifyRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'Multi-tenant Architecture',
    'API Design',
    'Data Isolation',
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
    'Payment Integration',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Database replicas)',
    'Chapter 6: Partitioning (Database sharding by store_id)',
    'Chapter 7: Transactions (Checkout)',
    'Chapter 11: Stream Processing (Order events)',
  ],
};

export default shopifyGuidedTutorial;
