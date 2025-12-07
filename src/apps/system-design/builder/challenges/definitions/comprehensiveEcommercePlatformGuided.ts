import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Comprehensive E-commerce Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 12-step tutorial that teaches system design concepts
 * while building a complete e-commerce platform with advanced features.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working system (FR satisfaction)
 * Steps 5-12: Scale with NFRs (search, recommendations, inventory consistency, etc.)
 *
 * Key Concepts:
 * - Full-text search for product discovery
 * - Real-time inventory management with reservation
 * - Recommendation engine architecture
 * - Order fulfillment pipeline
 * - Payment gateway integration
 * - Distributed transactions for checkout
 * - Analytics and data warehousing
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const ecommercePlatformRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a comprehensive e-commerce platform with advanced features",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Senior Staff Engineer at ShopTech Solutions',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-shopping-flow',
      category: 'functional',
      question: "What's the complete shopping journey for a customer?",
      answer: "The full customer journey includes:\n\n1. **Product Discovery** - Search and browse catalog with filters\n2. **Product Details** - View images, specs, reviews, recommendations\n3. **Cart Management** - Add/remove items, update quantities\n4. **Checkout** - Enter shipping info, select payment method\n5. **Payment Processing** - Secure payment via integrated gateway\n6. **Order Confirmation** - Receive order number and email\n7. **Order Tracking** - Monitor order status and shipping",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "E-commerce is an end-to-end experience from discovery to delivery",
    },
    {
      id: 'product-search',
      category: 'functional',
      question: "How should product search work?",
      answer: "Search needs to be powerful:\n1. **Full-text search** - Match partial keywords across name, description, brand\n2. **Filters** - Price range, category, brand, ratings, availability\n3. **Sorting** - Price, popularity, ratings, newest\n4. **Autocomplete** - Suggest products as user types\n5. **Faceted navigation** - Show available filter options with counts",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Search is the primary discovery mechanism - needs to be fast and accurate",
    },
    {
      id: 'inventory-management',
      category: 'functional',
      question: "How do we handle inventory and prevent overselling?",
      answer: "Inventory requires careful management:\n1. **Real-time tracking** - Decrement inventory on order placement\n2. **Reservation system** - Hold inventory when added to cart (15 min timeout)\n3. **Prevent overselling** - Strong consistency on inventory checks\n4. **Multi-warehouse** - Track inventory across multiple locations\n5. **Low stock alerts** - Notify when inventory is low",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Inventory consistency is critical - can't sell what you don't have",
    },
    {
      id: 'recommendations',
      category: 'functional',
      question: "Should we show personalized product recommendations?",
      answer: "Yes! Recommendations drive revenue:\n1. **Collaborative filtering** - 'Customers who bought this also bought...'\n2. **Personalized suggestions** - Based on browsing and purchase history\n3. **Trending products** - What's popular right now\n4. **Similar items** - Products similar to what they're viewing",
      importance: 'critical',
      revealsRequirement: 'FR-7',
      learningPoint: "Recommendations can increase revenue by 30-40% for e-commerce",
    },
    {
      id: 'payment-processing',
      category: 'functional',
      question: "How should payment processing work?",
      answer: "Payment needs to be secure and reliable:\n1. **Payment gateway integration** - Stripe, PayPal, etc.\n2. **Multiple payment methods** - Credit card, debit, digital wallets\n3. **PCI compliance** - Never store raw card data\n4. **Transaction recording** - Audit trail for all payments\n5. **Refund capability** - Process refunds when needed",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Payment processing requires external gateway integration and strong security",
    },
    {
      id: 'order-fulfillment',
      category: 'functional',
      question: "What happens after a customer places an order?",
      answer: "Order fulfillment is a multi-step pipeline:\n1. **Order creation** - Generate order ID and confirmation\n2. **Payment capture** - Charge the customer\n3. **Warehouse notification** - Alert fulfillment center\n4. **Inventory update** - Decrement stock\n5. **Shipping** - Generate shipping label and tracking\n6. **Status updates** - Email and SMS notifications",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Order fulfillment is async - use event-driven architecture",
    },
    {
      id: 'reviews-ratings',
      category: 'functional',
      question: "Can customers leave reviews and ratings?",
      answer: "Reviews are essential for trust:\n1. **Star ratings** (1-5 stars)\n2. **Written reviews** with optional photos\n3. **Verified purchase badge** for actual buyers\n4. **Review voting** - Mark reviews as helpful\n5. **Moderation** - Flag inappropriate content",
      importance: 'important',
      revealsRequirement: 'FR-8',
      learningPoint: "Reviews increase conversion rates and build trust",
    },
    {
      id: 'seller-accounts',
      category: 'clarification',
      question: "Should we support multiple sellers like a marketplace?",
      answer: "For MVP, let's be a **single seller platform**. Multi-seller adds complexity:\n- Seller onboarding and verification\n- Split payments and commissions\n- Seller dashboards\n\nWe can add marketplace features in v2.",
      importance: 'nice-to-have',
      insight: "Start as single seller, evolve to marketplace later",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we design for?",
      answer: "50 million registered users with 10 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "Medium-large scale platform - need distributed architecture",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many products in the catalog?",
      answer: "100 million products (SKUs) across all categories",
      importance: 'critical',
      learningPoint: "Large catalog requires efficient search indexing and storage",
    },
    {
      id: 'throughput-orders',
      category: 'throughput',
      question: "How many orders per day?",
      answer: "About 2 million orders per day",
      importance: 'critical',
      calculation: {
        formula: "2M ÷ 86,400 sec = 23 orders/sec",
        result: "~23 writes/sec (115 at peak during flash sales)",
      },
      learningPoint: "Moderate write volume but requires strong consistency",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many product searches per day?",
      answer: "About 500 million searches per day",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 searches/sec",
        result: "~5.8K searches/sec (20K+ at peak)",
      },
      learningPoint: "Search-dominated workload - need dedicated search infrastructure",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should product search respond?",
      answer: "p99 under 100ms. Fast search is critical for user experience.",
      importance: 'critical',
      learningPoint: "Sub-100ms search requires dedicated search engine (Elasticsearch)",
    },
    {
      id: 'latency-checkout',
      category: 'latency',
      question: "How fast should checkout complete?",
      answer: "p99 under 3 seconds from 'Place Order' to confirmation. This includes payment processing.",
      importance: 'critical',
      learningPoint: "Checkout can be slower than search but must be reliable",
    },
    {
      id: 'inventory-accuracy',
      category: 'consistency',
      question: "How critical is inventory accuracy?",
      answer: "EXTREMELY critical:\n- Zero tolerance for overselling\n- Inventory must be checked atomically during checkout\n- Use distributed locks or database transactions\n- Eventual consistency is NOT acceptable for inventory",
      importance: 'critical',
      learningPoint: "Inventory requires strong consistency - use optimistic locking or distributed transactions",
    },
    {
      id: 'recommendation-latency',
      category: 'latency',
      question: "How fresh should product recommendations be?",
      answer: "Recommendations can tolerate some staleness:\n- Pre-compute recommendations offline (batch jobs)\n- Update every few hours\n- Real-time computation is too expensive at scale\n\nEventual consistency is fine for recommendations.",
      importance: 'important',
      insight: "Pre-computed recommendations are faster and cheaper than real-time",
    },
    {
      id: 'analytics-requirements',
      category: 'clarification',
      question: "Do we need analytics on user behavior and sales?",
      answer: "Yes, analytics are important for business:\n- User behavior tracking (page views, clicks, purchases)\n- Sales reports (daily, weekly, monthly)\n- Product performance metrics\n- A/B testing infrastructure\n\nBut analytics shouldn't slow down the main system - use async processing.",
      importance: 'important',
      insight: "Separate analytics from transactional system for performance",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-shopping-flow', 'product-search', 'inventory-management', 'recommendations'],
  criticalFRQuestionIds: ['core-shopping-flow', 'product-search', 'inventory-management'],
  criticalScaleQuestionIds: ['throughput-searches', 'inventory-accuracy', 'recommendation-latency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Product discovery with search and filters',
      description: 'Users can search and browse 100M+ products with filters and sorting',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Shopping cart management',
      description: 'Add/remove items, update quantities, persist across sessions',
      emoji: '🛒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: User accounts and profiles',
      description: 'Registration, login, saved addresses, order history',
      emoji: '👤',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Secure checkout and payment',
      description: 'Complete purchase with payment gateway integration',
      emoji: '💳',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Order tracking and history',
      description: 'View order status, shipping updates, past orders',
      emoji: '📦',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Real-time inventory management',
      description: 'Track stock levels, prevent overselling, reservation system',
      emoji: '📊',
    },
    {
      id: 'fr-7',
      text: 'FR-7: Product recommendations',
      description: 'Show personalized and collaborative product suggestions',
      emoji: '✨',
    },
    {
      id: 'fr-8',
      text: 'FR-8: Reviews and ratings',
      description: 'Customers can rate and review purchased products',
      emoji: '⭐',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million',
    writesPerDay: '2 million orders + 5 million reviews/updates',
    readsPerDay: '500 million searches + 2 billion product views',
    peakMultiplier: 5,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 23, peak: 115 },
    calculatedReadRPS: { average: 5787, peak: 20000 },
    maxPayloadSize: '~10KB (product details with images)',
    storagePerRecord: '~5KB (product), ~2KB (order)',
    storageGrowthPerYear: '~10TB (products + orders + reviews)',
    redirectLatencySLA: 'p99 < 100ms (search)',
    createLatencySLA: 'p99 < 3s (checkout)',
  },

  architecturalImplications: [
    '✅ Search-heavy (100:1) → Dedicated search engine (Elasticsearch)',
    '✅ 20K searches/sec at peak → Distributed search cluster with caching',
    '✅ Inventory consistency → Optimistic locking or distributed transactions',
    '✅ 100M products → Partitioned databases, search sharding',
    '✅ Recommendations → Offline batch processing, dedicated recommendation service',
    '✅ Flash sales → Queue-based order processing, rate limiting',
    '✅ Analytics → Separate data warehouse, async event streaming',
  ],

  outOfScope: [
    'Multi-seller marketplace features',
    'International shipping and customs',
    'Returns and refunds automation',
    'Loyalty programs and rewards',
    'Live chat customer support',
    'Mobile app-specific features',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search products, add to cart, and checkout. The advanced features like recommendations, real-time inventory, and analytics will come in later steps. Functionality first, then sophistication!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛍️',
  scenario: "Welcome to ShopTech Solutions! You've been hired to build a next-generation e-commerce platform.",
  hook: "Your first customer just opened your website!",
  challenge: "Set up the basic request flow so customers can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your e-commerce platform is online!',
  achievement: 'Customers can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle shopping requests...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every e-commerce platform starts with a **Client** connecting to a **Server**.

When a customer opens your site:
1. Their browser/app is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, customers can\'t interact with your store at all.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Powering millions of online stores',
    howTheyDoIt: 'Started with a simple Ruby on Rails server in 2006, now uses a distributed system with thousands of servers globally',
  },

  keyPoints: [
    'Client = customer device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP/HTTPS = protocol for communication',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Customer device making requests', icon: '📱' },
    { title: 'App Server', explanation: 'Backend handling business logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Request/response protocol', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'ecommerce-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers accessing the platform', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles shopping requests and business logic', displayName: 'App Server' },
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
// STEP 2: Implement Core APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle shopping yet!",
  hook: "A customer tried to view a product but got an error.",
  challenge: "Write the Python code to handle product listings, cart operations, and checkout.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your shopping APIs are working!',
  achievement: 'You implemented the core e-commerce functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can list products', after: '✓' },
    { label: 'Can manage cart', after: '✓' },
    { label: 'Can checkout', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: E-Commerce Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Validates input
3. Processes the business logic
4. Returns a response

For e-commerce, we need handlers for:
- \`get_products()\` - List products with filters
- \`get_product_details(product_id)\` - Fetch single product
- \`add_to_cart(user_id, product_id, quantity)\` - Add item to cart
- \`checkout(user_id)\` - Process order and payment

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server can\'t process shopping requests. This is where the e-commerce magic happens!',

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Processing millions of product views and purchases',
    howTheyDoIt: 'Their API layer uses microservices with dedicated handlers for catalog, cart, checkout, and payments',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Validate input (product exists, quantity > 0, etc.)',
    'Use dictionaries for in-memory storage (temporary)',
    'Return clear success/error responses',
  ],

  quickCheck: {
    question: 'Why start with in-memory storage instead of a database?',
    options: [
      'It\'s faster',
      'FR-First approach: Make it WORK first with simple storage',
      'Memory is cheaper',
      'Databases are too complex',
    ],
    correctIndex: 1,
    explanation: 'FR-First: Focus on functionality first. Database adds complexity, so we add it in the next step.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Validation', explanation: 'Check input before processing', icon: '✓' },
  ],
};

const step2: GuidedStep = {
  id: 'ecommerce-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: List products, FR-2: Cart, FR-4: Checkout',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/products, POST /api/v1/cart, POST /api/v1/checkout APIs',
      'Open the Python tab',
      'Implement get_products(), add_to_cart(), and checkout() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for get_products, add_to_cart, and checkout',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/products', 'POST /api/v1/cart', 'POST /api/v1/checkout'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed and restarted...",
  hook: "When it came back online, your ENTIRE product catalog was GONE! All shopping carts and orders vanished.",
  challenge: "Add a database so all data survives server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Products, carts, and orders now persist across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But product searches are getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **Transactions**: ACID guarantees for checkout

For e-commerce, we need tables for:
- \`products\` - Product catalog (SKU, name, price, inventory)
- \`users\` - Customer accounts
- \`carts\` - Shopping cart items
- \`orders\` - Order history
- \`order_items\` - Items in each order
- \`inventory\` - Stock levels by product and warehouse`,

  whyItMatters: 'Imagine losing ALL your products and orders because of a server restart. Your business would collapse!',

  famousIncident: {
    title: 'Target Canada Data Migration Disaster',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target Canada had massive inventory data inconsistencies in their system. Products showed as "in stock" but weren\'t available, leading to customer frustration and lost sales. This contributed to Target shutting down all Canadian stores.',
    lessonLearned: 'Proper database design and data integrity are critical for e-commerce success.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Storing billions of products and orders',
    howTheyDoIt: 'Uses MySQL with custom sharding for products and orders, partitioned by shop_id for scalability',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Use PostgreSQL or MySQL for relational data',
    'Proper schema design: products, users, carts, orders',
    'Foreign keys maintain data integrity',
  ],

  quickCheck: {
    question: 'What happens to in-memory data when a server restarts?',
    options: [
      'It\'s automatically saved',
      'It\'s backed up to cloud',
      'It\'s completely lost',
      'It\'s restored from cache',
    ],
    correctIndex: 2,
    explanation: 'In-memory (RAM) data is volatile. When the process restarts, all data in memory is gone forever.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '⚛️' },
    { title: 'Schema', explanation: 'Structure of tables and relationships', icon: '📐' },
  ],
};

const step3: GuidedStep = {
  id: 'ecommerce-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent storage',
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
// STEP 4: Add Search Engine for Product Discovery
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million products, and search is unbearably slow!",
  hook: "Searching for 'wireless headphones' takes 5 seconds! Customers are leaving. Database LIKE queries don't scale.",
  challenge: "Add a dedicated search engine to make product discovery lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Product search is blazing fast!',
  achievement: 'Search latency dropped from 5s to 50ms',
  metrics: [
    { label: 'Search latency', before: '5000ms', after: '50ms' },
    { label: 'Search capacity', after: '20K queries/sec' },
  ],
  nextTeaser: "But database queries for product details are still slow...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Search Engines: Fast Product Discovery',
  conceptExplanation: `**The Problem**: Database LIKE queries are slow for full-text search:
\`\`\`sql
SELECT * FROM products WHERE name LIKE '%wireless%'
-- Scans entire table, very slow!
\`\`\`

**The Solution**: Dedicated search engine (Elasticsearch, Solr)
- **Inverted index**: Maps words to documents
- **Full-text search**: Match partial keywords
- **Faceted search**: Filters with counts
- **Relevance scoring**: Best matches first
- **Autocomplete**: Suggest as you type

**Architecture**:
- Products stored in database (source of truth)
- Products indexed in search engine (fast queries)
- Background sync keeps search index up-to-date`,

  whyItMatters: 'At 20K searches/sec, database queries would melt. Search engines are built specifically for this workload.',

  famousIncident: {
    title: 'Etsy Search Outage',
    company: 'Etsy',
    year: '2017',
    whatHappened: 'Etsy\'s Solr search cluster crashed during a configuration change. Product search was down for 4 hours. Sellers lost an estimated $5 million in sales.',
    lessonLearned: 'Search is critical infrastructure. Always have redundancy and tested rollback procedures.',
    icon: '🔍',
  },

  realWorldExample: {
    company: 'eBay',
    scenario: 'Searching across 1.3 billion product listings',
    howTheyDoIt: 'Uses Elasticsearch clusters with hundreds of nodes, sharded by category and geography',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Elasticsearch│
└────────┘     └─────────────┘     │ (Search)     │
                     │              └──────────────┘
                     │                      │
                     │                      │ Index sync
                     ▼                      ▼
               ┌──────────┐          (Background job)
               │ Database │ ────────────────┘
               │(Products)│
               └──────────┘
`,

  keyPoints: [
    'Search engine sits alongside database',
    'Database is source of truth, search engine is for queries',
    'Background job syncs products to search index',
    'Use Elasticsearch for full-text search with filters',
    'Supports autocomplete, faceted navigation, relevance',
  ],

  quickCheck: {
    question: 'Why use a dedicated search engine instead of database LIKE queries?',
    options: [
      'It\'s cheaper',
      'Search engines use inverted indexes for fast full-text search',
      'Databases can\'t handle text',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Search engines use inverted indexes that map words to documents, making full-text search 100x faster than database scans.',
  },

  keyConcepts: [
    { title: 'Inverted Index', explanation: 'Maps words to documents for fast search', icon: '📇' },
    { title: 'Full-Text Search', explanation: 'Match keywords across multiple fields', icon: '🔎' },
    { title: 'Faceted Search', explanation: 'Filters with counts (e.g., Brand: Nike (50))', icon: '🎛️' },
  ],
};

const step4: GuidedStep = {
  id: 'ecommerce-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Product discovery with fast search',
    taskDescription: 'Add an Elasticsearch search engine',
    componentsNeeded: [
      { type: 'search_engine', reason: 'Fast full-text search across product catalog', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Engine component added to canvas',
      'App Server connected to Search Engine',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_engine'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
    ],
  },

  hints: {
    level1: 'Drag a Search Engine (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search Engine. This enables fast product search.',
    solutionComponents: [{ type: 'search_engine' }],
    solutionConnections: [{ from: 'app_server', to: 'search_engine' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Product Data & Sessions
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐢',
  scenario: "Product pages are loading slowly - every view hits the database!",
  hook: "Popular products are viewed thousands of times per minute. Database queries are taking 200ms+.",
  challenge: "Add a cache to speed up product lookups and store user sessions.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Product pages load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Product load time', before: '200ms', after: '10ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'Database load', before: '100%', after: '20%' },
  ],
  nextTeaser: "But your single server can't handle traffic spikes...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 100ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 1ms) → Database (only on miss)
\`\`\`

For e-commerce, we cache:
- **Product details** - Name, price, description, images
- **User sessions** - Shopping cart, logged-in state
- **Popular items** - Trending products, bestsellers
- **Category listings** - Pre-computed category pages`,

  whyItMatters: 'At 20K product views/sec, hitting the database for every view would overwhelm it. Caching is essential.',

  famousIncident: {
    title: 'Best Buy Cache Miss Storm',
    company: 'Best Buy',
    year: '2019',
    whatHappened: 'During Black Friday, their Redis cache cluster failed. All product page requests hit the database directly. The database crashed under load. Website was down for 2 hours during peak shopping.',
    lessonLearned: 'Cache failures can cascade. Always have cache redundancy and database protection.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Wayfair',
    scenario: 'Serving millions of product page views',
    howTheyDoIt: 'Uses Redis clusters to cache product data, user sessions, and shopping carts. Cache hit rate of 98% reduces database load by 50x.',
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
    'Sessions and carts live in cache for fast access',
    'Set TTL based on data freshness needs',
  ],

  quickCheck: {
    question: 'Why store shopping carts in cache instead of database?',
    options: [
      'Caches are cheaper',
      'Much faster access and carts are temporary by nature',
      'Databases can\'t handle cart data',
      'It\'s easier to code',
    ],
    correctIndex: 1,
    explanation: 'Carts are temporary and read/written frequently. Cache provides sub-millisecond access. Only persist to DB at checkout.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'ecommerce-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast product views, FR-2: Cart in cache',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache product data and user sessions', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_engine', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache for fast product and session access',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "FLASH SALE! Traffic just spiked 10x!",
  hook: "Your single app server is maxed out at 100% CPU. Customers are getting timeouts and errors!",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Traffic is now distributed!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Request capacity', after: 'Unlimited (scale out)' },
  ],
  nextTeaser: "But we still only have one app server instance...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute the Load',
  conceptExplanation: `A **Load Balancer** sits in front of your app servers and distributes incoming requests.

Benefits:
- **No single point of failure** - if one server dies, others keep working
- **Horizontal scaling** - add more servers to handle more traffic
- **Even distribution** - no single server gets overwhelmed
- **Health checks** - automatically route around failed servers

Common strategies:
- Round-robin: Take turns
- Least connections: Send to least busy server
- IP hash: Same user always goes to same server (sticky sessions)`,

  whyItMatters: 'Flash sales and viral products can cause 10x traffic spikes. No single server can handle that alone.',

  famousIncident: {
    title: 'Shopify Flash Sale Success',
    company: 'Shopify',
    year: '2020',
    whatHappened: 'Kylie Cosmetics launched a flash sale expecting 10K concurrent users. They got 250K! Shopify\'s load balancing and auto-scaling handled it seamlessly. Zero downtime.',
    lessonLearned: 'Proper load balancing enables you to handle unpredictable traffic spikes.',
    icon: '💄',
  },

  realWorldExample: {
    company: 'Zalando',
    scenario: 'Handling millions of concurrent shoppers',
    howTheyDoIt: 'Uses multi-layer load balancing with auto-scaling groups that can spin up 100+ servers in minutes',
  },

  keyPoints: [
    'Load balancer distributes requests across servers',
    'Enables horizontal scaling (add more servers)',
    'Health checks detect and route around failures',
    'Essential for handling traffic spikes',
  ],

  quickCheck: {
    question: 'What happens if one app server crashes when using a load balancer?',
    options: [
      'All requests fail',
      'Load balancer routes traffic to healthy servers',
      'Users see an error page',
      'Database takes over',
    ],
    correctIndex: 1,
    explanation: 'Load balancers detect unhealthy servers via health checks and automatically route to healthy ones.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Health Check', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
  ],
};

const step6: GuidedStep = {
  id: 'ecommerce-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

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

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
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
// STEP 7: Add Message Queue for Async Order Processing
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌟',
  scenario: "Flash sale success! But checkout is timing out!",
  hook: "Processing each order synchronously takes 3+ seconds. Customers are abandoning their carts!",
  challenge: "Add a message queue to process orders asynchronously.",
  illustration: 'order-rush',
};

const step7Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Checkout is lightning fast!',
  achievement: 'Async processing handles order spikes efficiently',
  metrics: [
    { label: 'Checkout latency', before: '3000ms', after: '500ms' },
    { label: 'Order throughput', before: '50/sec', after: '500/sec' },
  ],
  nextTeaser: "But we need to add a payment gateway...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Order Processing',
  conceptExplanation: `The **order processing problem**: Each order requires multiple steps:
- Validate inventory
- Process payment
- Update inventory
- Create order record
- Send confirmation email
- Notify warehouse

**Synchronous**: Checkout → Do all steps → Return "Order placed!" ❌ (too slow, 3+ seconds)
**Async with Queue**: Checkout → Add to queue → Return "Order placed!" ✓ (< 500ms)
- Background workers process the queue
- Handle all steps in parallel

This is the **async processing** pattern for high-throughput systems.`,

  whyItMatters: 'Every second of checkout delay = lost sales. Async processing makes checkout feel instant.',

  famousIncident: {
    title: 'Walmart Black Friday Success',
    company: 'Walmart',
    year: '2021',
    whatHappened: 'Walmart processed 5X normal order volume on Black Friday using async queue-based order processing. Peak was 1,000+ orders/second with zero downtime.',
    lessonLearned: 'Message queues enable massive scale by decoupling order capture from processing.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing millions of orders during flash sales',
    howTheyDoIt: 'Uses Kafka for event streaming. When checkout happens, order goes to queue. Hundreds of workers process orders in parallel.',
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
        │          │          │ Update   │          │ Service  │
        └──────────┘          └──────────┘          └──────────┘
`,

  keyPoints: [
    'Message queue decouples checkout from order processing',
    'Customer gets instant response - processing happens in background',
    'Workers process queue in parallel for high throughput',
    'Queue provides buffer during traffic spikes',
  ],

  quickCheck: {
    question: 'Why use async order processing instead of synchronous?',
    options: [
      'It\'s cheaper',
      'Customers get instant checkout while processing happens in background',
      'It uses less memory',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Async means the customer doesn\'t wait. Order is confirmed instantly, and processing happens in the background.',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Decouple request from processing', icon: '⚡' },
    { title: 'Message Queue', explanation: 'Buffer for async tasks', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
  ],
};

const step7: GuidedStep = {
  id: 'ecommerce-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Fast checkout with async order processing',
    taskDescription: 'Add a Message Queue for async order processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle order processing asynchronously', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue for async order processing',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Integrate Payment Gateway
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💳',
  scenario: "Customers are ready to pay, but you can't process payments!",
  hook: "You need to integrate with a payment gateway like Stripe to actually charge customers.",
  challenge: "Add a payment gateway to handle secure payment processing.",
  illustration: 'payment-integration',
};

const step8Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Payment processing is live!',
  achievement: 'You can now accept real payments securely',
  metrics: [
    { label: 'Payment gateway', after: 'Integrated' },
    { label: 'PCI compliance', after: '✓' },
    { label: 'Payment methods', after: 'Cards, wallets' },
  ],
  nextTeaser: "But we need database replication for reliability...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Payment Gateway Integration',
  conceptExplanation: `**Never build your own payment processing!** Use a payment gateway:
- Stripe, PayPal, Square, etc.
- Handles PCI compliance
- Processes credit cards, digital wallets
- Returns success/failure

**Integration Pattern**:
1. Customer enters payment info
2. Frontend sends to payment gateway directly (for PCI compliance)
3. Gateway returns a token
4. Your server uses token to charge customer
5. Gateway returns payment result

**Your server never sees raw card numbers!**`,

  whyItMatters: 'Payment processing is complex and heavily regulated. Payment gateways handle the hard parts so you can focus on your business.',

  famousIncident: {
    title: 'Target Data Breach',
    company: 'Target',
    year: '2013',
    whatHappened: 'Hackers stole 40 million credit card numbers from Target\'s payment systems. Cost: $18.5 million in settlements plus massive reputation damage.',
    lessonLearned: 'Never store card data yourself. Always use payment gateways that are PCI DSS compliant.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing billions in payments annually',
    howTheyDoIt: 'Integrates with Stripe, PayPal, and 100+ payment gateways. Never stores raw card data.',
  },

  keyPoints: [
    'Use payment gateway (Stripe, PayPal) - never build your own',
    'Gateway handles PCI compliance',
    'Your server only receives tokens, never raw cards',
    'Gateway returns success/failure for transactions',
  ],

  quickCheck: {
    question: 'Why use a payment gateway instead of processing cards yourself?',
    options: [
      'It\'s cheaper',
      'Gateways handle PCI compliance and security - building it yourself is risky and expensive',
      'It\'s faster',
      'Gateways have better UI',
    ],
    correctIndex: 1,
    explanation: 'PCI compliance is extremely complex and expensive. Payment gateways handle security, compliance, and fraud prevention.',
  },

  keyConcepts: [
    { title: 'Payment Gateway', explanation: 'Third-party service that processes payments', icon: '🏦' },
    { title: 'PCI DSS', explanation: 'Security standard for handling card data', icon: '🔒' },
    { title: 'Tokenization', explanation: 'Replace card data with secure tokens', icon: '🎫' },
  ],
};

const step8: GuidedStep = {
  id: 'ecommerce-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Secure payment processing',
    taskDescription: 'Add a Payment Gateway for processing transactions',
    componentsNeeded: [
      { type: 'third_party_service', reason: 'Process payments via Stripe/PayPal', displayName: 'Payment Gateway (Stripe)' },
    ],
    successCriteria: [
      'Third Party Service component added (representing payment gateway)',
      'App Server connected to Payment Gateway',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'third_party_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'third_party_service' },
    ],
  },

  hints: {
    level1: 'Drag a Third Party Service component to represent the payment gateway (Stripe)',
    level2: 'Connect App Server to the payment gateway service',
    solutionComponents: [{ type: 'third_party_service' }],
    solutionConnections: [{ from: 'app_server', to: 'third_party_service' }],
  },
};

// =============================================================================
// STEP 9: Add Database Replication
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚠️',
  scenario: "EMERGENCY! Your database crashed for 15 minutes last night.",
  hook: "During that time:\n- All orders stopped\n- Customers couldn't view products\n- Lost $250,000 in revenue",
  challenge: "Add database replication so a backup is always ready.",
  illustration: 'database-failure',
};

const step9Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now fault-tolerant!',
  achievement: 'Replicas provide redundancy and read scaling',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Read capacity', before: '1x', after: '3x' },
  ],
  nextTeaser: "But we need more app server capacity...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Never Lose Data',
  conceptExplanation: `**Replication** copies your data to multiple database servers.

Types:
- **Primary (Leader)**: Handles all writes (orders, inventory)
- **Replicas (Followers)**: Handle reads (product listings, search)

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute product queries across replicas
- **Data safety**: Multiple copies protect against failure

For e-commerce:
- Write orders to primary (strong consistency)
- Read product catalog from replicas (eventual consistency OK)
- Inventory checks MUST read from primary (can't be stale)`,

  whyItMatters: 'A single database is a single point of failure. For 2M orders/day, downtime is catastrophic.',

  famousIncident: {
    title: 'GitLab Database Incident',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted production database. Backups had failed for months. They lost 6 hours of data including issues, merge requests, and user data.',
    lessonLearned: 'Always have replication AND backups. Test your disaster recovery procedures regularly.',
    icon: '🦊',
  },

  realWorldExample: {
    company: 'Wayfair',
    scenario: 'Zero tolerance for data loss',
    howTheyDoIt: 'Uses MySQL replication with 3+ replicas across availability zones. Automatic failover in under 30 seconds.',
  },

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'If primary fails, promote a replica',
    'Use replicas for read scaling - split product queries',
    'Critical reads (inventory) must hit primary',
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
    { title: 'Primary', explanation: 'Database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting replica when primary fails', icon: '🔄' },
  ],
};

const step9: GuidedStep = {
  id: 'ecommerce-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

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

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'third_party_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'third_party_service' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2+. This creates read copies of your data.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Add CDN and Object Storage for Product Images
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Product pages are loading slowly - images take forever!",
  hook: "Each product has 5-10 high-res images. Serving from app servers is killing performance and costing a fortune.",
  challenge: "Add object storage and CDN to serve product images efficiently.",
  illustration: 'slow-images',
};

const step10Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Images load instantly!',
  achievement: 'CDN serves images from edge locations worldwide',
  metrics: [
    { label: 'Image load time', before: '3000ms', after: '100ms' },
    { label: 'App server bandwidth', before: '50GB/s', after: '2GB/s' },
    { label: 'Cost reduction', after: '80%' },
  ],
  nextTeaser: "But we need a recommendation engine...",
};

const step10LearnPhase: TeachingContent = {
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
- App servers only serve dynamic data`,

  whyItMatters: 'At 20K product views/sec with 5 images each = 100K image requests/sec. CDN reduces costs by 80% and improves speed 10x.',

  realWorldExample: {
    company: 'Etsy',
    scenario: 'Serving billions of product images',
    howTheyDoIt: 'Uses Fastly CDN with 95% cache hit rate. Product images are cached at edges globally.',
  },

  diagram: `
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
    'Store product images in Object Storage (S3)',
    'Put CDN in front for edge caching',
    'CDN reduces latency (serve from nearest edge)',
    'CDN reduces costs (fewer S3 requests)',
    'App servers freed for dynamic requests',
  ],

  quickCheck: {
    question: 'Why use CDN for images instead of serving from app servers?',
    options: [
      'CDN is cheaper',
      'CDN caches at edge locations for lower latency and reduced server load',
      'App servers can\'t handle images',
      'CDN has better compression',
    ],
    correctIndex: 1,
    explanation: 'CDN caches images at 200+ edge locations. Users get images from nearest edge (fast), and app servers are freed up.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Cheap storage for static files (S3)', icon: '🗄️' },
    { title: 'CDN', explanation: 'Edge caching network for fast delivery', icon: '🌐' },
    { title: 'Edge Location', explanation: 'Server close to users for low latency', icon: '📍' },
  ],
};

const step10: GuidedStep = {
  id: 'ecommerce-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-1: Product browsing with fast image loading',
    taskDescription: 'Add Object Storage and CDN for product images',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store product images cheaply', displayName: 'S3' },
      { type: 'cdn', reason: 'Cache images at edge locations', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'Object Storage component added',
      'CDN component added',
      'App Server connected to Object Storage',
      'CDN connected to Object Storage',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'third_party_service', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'third_party_service' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
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
// STEP 11: Add Recommendation Engine
// =============================================================================

const step11Story: StoryContent = {
  emoji: '✨',
  scenario: "Customers want personalized product recommendations!",
  hook: "Your competitor shows 'Customers who bought this also bought...' and their conversion rate is 40% higher!",
  challenge: "Add a recommendation engine to suggest relevant products.",
  illustration: 'recommendation-system',
};

const step11Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Recommendations are driving sales!',
  achievement: 'ML-powered personalization is live',
  metrics: [
    { label: 'Click-through rate', after: '+35%' },
    { label: 'Revenue per user', after: '+28%' },
    { label: 'Recommendations', after: 'Real-time' },
  ],
  nextTeaser: "But we need analytics to track performance...",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Recommendation Engines: Personalization at Scale',
  conceptExplanation: `**Recommendation engines** use ML to suggest relevant products.

Types of recommendations:
1. **Collaborative filtering** - "Users like you also bought..."
2. **Content-based** - "Similar to items you viewed..."
3. **Trending** - "Popular products right now..."
4. **Personalized** - Based on your history

**Architecture**:
- **Offline training** - ML models train on historical data (daily/weekly)
- **Online serving** - Fast lookups from pre-computed recommendations
- **Real-time signals** - Current session incorporated on the fly

**Don't compute recommendations in real-time!** Pre-compute and cache.`,

  whyItMatters: 'Recommendations can increase revenue by 30-40%. They help customers discover products they didn\'t know they wanted.',

  famousIncident: {
    title: 'Netflix Recommendation Prize',
    company: 'Netflix',
    year: '2006-2009',
    whatHappened: 'Netflix offered $1M prize for improving their recommendation algorithm by 10%. The winning solution was so complex it was never deployed - simpler models worked better in production.',
    lessonLearned: 'Simple, fast recommendations beat complex, slow ones. Pre-compute recommendations offline.',
    icon: '📺',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Generating personalized recommendations for 300M users',
    howTheyDoIt: 'Uses item-to-item collaborative filtering with offline batch processing. Recommendations pre-computed and cached.',
  },

  keyPoints: [
    'Pre-compute recommendations offline (batch jobs)',
    'Store recommendations in dedicated service/database',
    'Use cache for fast recommendation lookups',
    'Real-time signals can augment pre-computed results',
    'Simple algorithms often beat complex ones',
  ],

  quickCheck: {
    question: 'Why pre-compute recommendations instead of calculating them in real-time?',
    options: [
      'Pre-computation is cheaper',
      'Real-time ML computation is too slow - users need instant results',
      'Pre-computation is more accurate',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'ML models are computationally expensive. Pre-computing recommendations in batch jobs and caching results provides instant responses.',
  },

  keyConcepts: [
    { title: 'Collaborative Filtering', explanation: 'Recommendations based on similar users', icon: '👥' },
    { title: 'Offline Training', explanation: 'ML models train on historical data', icon: '🔧' },
    { title: 'Online Serving', explanation: 'Fast lookups from pre-computed results', icon: '⚡' },
  ],
};

const step11: GuidedStep = {
  id: 'ecommerce-step-11',
  stepNumber: 11,
  frIndex: 6,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'FR-7: Personalized product recommendations',
    taskDescription: 'Add a recommendation service for ML-powered suggestions',
    componentsNeeded: [
      { type: 'ml_service', reason: 'Generate and serve product recommendations', displayName: 'Recommendation Engine' },
    ],
    successCriteria: [
      'ML Service component added (representing recommendation engine)',
      'App Server connected to Recommendation Engine',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'third_party_service', 'object_storage', 'cdn', 'ml_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'third_party_service' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'ml_service' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag an ML Service component to represent the recommendation engine',
    level2: 'Connect App Server to the recommendation engine service',
    solutionComponents: [{ type: 'ml_service' }],
    solutionConnections: [{ from: 'app_server', to: 'ml_service' }],
  },
};

// =============================================================================
// STEP 12: Add Analytics Data Warehouse
// =============================================================================

const step12Story: StoryContent = {
  emoji: '📊',
  scenario: "Business needs insights! But analytics queries are crushing the production database!",
  hook: "Sales reports are taking 10+ seconds and slowing down checkout. You need a separate analytics infrastructure.",
  challenge: "Add a data warehouse for analytics without impacting production.",
  illustration: 'analytics',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a comprehensive e-commerce platform!',
  achievement: 'A complete, scalable system with all advanced features',
  metrics: [
    { label: 'Search latency', after: '<100ms' },
    { label: 'Checkout latency', after: '<3s' },
    { label: 'Product catalog', after: '100M products' },
    { label: 'Order capacity', after: '115 orders/sec' },
    { label: 'Recommendations', after: 'Live' },
    { label: 'Analytics', after: 'Separate warehouse' },
  ],
  nextTeaser: "You've mastered comprehensive e-commerce system design!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Analytics Data Warehouse: Separate OLTP from OLAP',
  conceptExplanation: `**The Problem**: Production database serves two workloads:
- **OLTP (Online Transaction Processing)** - Fast reads/writes for app
- **OLAP (Online Analytical Processing)** - Complex aggregations for reports

These workloads conflict! Analytics queries slow down transactions.

**The Solution**: Separate data warehouse
- **Production DB** - Handles live transactions (OLTP)
- **Data Warehouse** - Handles analytics queries (OLAP)
- **ETL Pipeline** - Sync data from production to warehouse

**Architecture**:
1. App writes to production database
2. Change data capture streams updates
3. ETL process loads into warehouse (Snowflake, BigQuery, Redshift)
4. Analytics runs on warehouse without impacting production`,

  whyItMatters: 'Analytics shouldn\'t slow down checkout. Separate workloads for optimal performance.',

  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A bug in their trading system caused it to execute millions of unintended trades. They lost $440 million in 45 minutes. Poor monitoring and analytics delayed detection.',
    lessonLearned: 'Proper analytics infrastructure is critical for detecting and responding to problems quickly.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Analyzing billions of events for business insights',
    howTheyDoIt: 'Uses Kafka to stream events to S3, then loads into Presto/Druid for analytics. Production database is untouched.',
  },

  diagram: `
┌─────────────┐     ┌──────────┐     ┌─────────┐     ┌──────────────┐
│ App Server  │────▶│Production│────▶│  Kafka  │────▶│Data Warehouse│
│             │     │ Database │     │ (CDC)   │     │ (Snowflake)  │
└─────────────┘     └──────────┘     └─────────┘     └──────────────┘
                          │                                   │
                          │ OLTP                              │ OLAP
                          │ (transactions)                    │ (analytics)
`,

  keyPoints: [
    'Separate production database (OLTP) from analytics warehouse (OLAP)',
    'Use event streaming (Kafka) to sync data',
    'Analytics queries run on warehouse, not production',
    'ETL pipeline keeps warehouse up-to-date',
    'Enables complex reports without impacting customers',
  ],

  quickCheck: {
    question: 'Why separate analytics from the production database?',
    options: [
      'Analytics databases are cheaper',
      'Analytics queries are slow and would impact transaction performance',
      'Production databases can\'t handle analytics',
      'It\'s a security requirement',
    ],
    correctIndex: 1,
    explanation: 'Analytics queries do complex aggregations that take seconds. Running them on production database would slow down checkout and orders.',
  },

  keyConcepts: [
    { title: 'OLTP', explanation: 'Online Transaction Processing (app workload)', icon: '⚡' },
    { title: 'OLAP', explanation: 'Online Analytical Processing (analytics)', icon: '📊' },
    { title: 'ETL', explanation: 'Extract, Transform, Load data to warehouse', icon: '🔄' },
  ],
};

const step12: GuidedStep = {
  id: 'ecommerce-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'Enable analytics without impacting production',
    taskDescription: 'Add a Data Warehouse for analytics',
    componentsNeeded: [
      { type: 'data_warehouse', reason: 'Run analytics queries separately from production', displayName: 'Data Warehouse (Snowflake)' },
    ],
    successCriteria: [
      'Data Warehouse component added',
      'Message Queue connected to Data Warehouse (for event streaming)',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'third_party_service', 'object_storage', 'cdn', 'ml_service', 'data_warehouse'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'third_party_service' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'ml_service' },
      { fromType: 'message_queue', toType: 'data_warehouse' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag a Data Warehouse component onto the canvas',
    level2: 'Connect Message Queue to Data Warehouse for event streaming to analytics',
    solutionComponents: [{ type: 'data_warehouse' }],
    solutionConnections: [{ from: 'message_queue', to: 'data_warehouse' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const comprehensiveEcommercePlatformGuidedTutorial: GuidedTutorial = {
  problemId: 'comprehensive-ecommerce',
  title: 'Design Comprehensive E-Commerce Platform',
  description: 'Build a complete e-commerce platform with search, recommendations, payments, inventory, and analytics',
  difficulty: 'advanced',
  estimatedMinutes: 75,

  welcomeStory: {
    emoji: '🛍️',
    hook: "You've been hired as Principal Engineer at ShopTech Solutions!",
    scenario: "Your mission: Build a next-generation e-commerce platform with advanced features like ML recommendations, real-time inventory, and comprehensive analytics.",
    challenge: "Can you design a system that handles 20K searches/sec, 100M products, and provides personalized shopping experiences?",
  },

  requirementsPhase: ecommercePlatformRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design & Persistence',
    'Full-Text Search (Elasticsearch)',
    'Caching Strategy',
    'Load Balancing',
    'Message Queues (Async Processing)',
    'Payment Gateway Integration',
    'Database Replication',
    'CDN & Object Storage',
    'Recommendation Engines',
    'Data Warehousing',
    'OLTP vs OLAP',
    'Inventory Management',
    'Event Streaming',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Search indexes)',
    'Chapter 5: Replication (Database replicas)',
    'Chapter 6: Partitioning (Sharding products)',
    'Chapter 10: Batch Processing (Recommendation training)',
    'Chapter 11: Stream Processing (Event-driven architecture)',
  ],
};

export default comprehensiveEcommercePlatformGuidedTutorial;
