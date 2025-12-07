import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * DoorDash Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a food delivery platform like DoorDash.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cache, load balancer, search, queues, cost)
 *
 * Key Concepts:
 * - Real-time driver location tracking
 * - Order dispatch algorithm (matching drivers to orders)
 * - ETA prediction (ML-based)
 * - Geo-fencing and geo-search
 * - Three-sided marketplace (customers, restaurants, drivers)
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const doordashRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a food delivery platform like DoorDash",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Engineering Manager at Food Delivery Corp',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-flow',
      category: 'functional',
      question: "Walk me through the core user flow - what's the main thing customers want to do?",
      answer: "Customers want to:\n\n1. **Search for restaurants** - Browse nearby restaurants and menus by location, cuisine, or restaurant name\n2. **Place an order** - Select items, add to cart, checkout with payment\n3. **Track delivery** - See real-time driver location and ETA updates\n4. **Receive food** - Get notified when driver arrives",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "DoorDash is a three-sided marketplace connecting customers, restaurants, and drivers in real-time",
    },
    {
      id: 'restaurant-side',
      category: 'functional',
      question: "What about restaurants? What do they need to do?",
      answer: "Restaurants need to:\n1. **Manage their menu** - Add/update items, prices, availability\n2. **Receive orders** - Get notified of new orders instantly\n3. **Update order status** - Mark food as ready for pickup\n4. **Track performance** - See ratings and reviews",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Restaurants are real-time participants, not passive listings",
    },
    {
      id: 'driver-side',
      category: 'functional',
      question: "And the drivers - what's their experience?",
      answer: "Drivers need to:\n1. **Accept delivery requests** - Get assigned orders or pick from available ones\n2. **Navigate to restaurant** - Get directions and pickup instructions\n3. **Update location** - Share real-time GPS location\n4. **Complete delivery** - Mark order as delivered",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Real-time driver location is the backbone of the tracking experience",
    },
    {
      id: 'search-discovery',
      category: 'functional',
      question: "How do customers find restaurants? Just browse or search too?",
      answer: "Customers can:\n1. **Search by location** - 'Find restaurants near 123 Main St'\n2. **Filter by cuisine** - 'Italian restaurants nearby'\n3. **Sort by various factors** - delivery time, rating, price\n4. **See distance and ETA** - 'Delivers in 25-35 min'\n\nThis requires geo-spatial search capabilities.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Geo-search is different from regular text search - needs special indexing",
    },
    {
      id: 'payment-handling',
      category: 'clarification',
      question: "Do we handle payment processing in this system?",
      answer: "Yes, but we'll integrate with a payment gateway (Stripe, Square). For MVP, let's focus on order flow. Payment becomes a simple API call to external service.",
      importance: 'nice-to-have',
      insight: "Payment processing is complex but we can delegate to third parties",
    },
    {
      id: 'multi-restaurant',
      category: 'clarification',
      question: "Can customers order from multiple restaurants in one order?",
      answer: "Not in MVP. Each order is from a single restaurant. This greatly simplifies driver assignment and delivery logistics.",
      importance: 'nice-to-have',
      insight: "Scoping reduces complexity - multi-restaurant is a v2 feature",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many active users should we design for?",
      answer: "25 million registered customers, 5 million daily active users (DAU), 500K active drivers, 200K restaurant partners",
      importance: 'critical',
      learningPoint: "Three user types with different scale profiles",
    },
    {
      id: 'throughput-orders',
      category: 'throughput',
      question: "How many orders per day?",
      answer: "About 2 million orders per day across all regions",
      importance: 'critical',
      calculation: {
        formula: "2M ÷ 86,400 sec = 23 orders/sec",
        result: "~25 orders/sec (75 at peak dinner rush)",
      },
      learningPoint: "Moderate write volume but with strong peak patterns (lunch/dinner)",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many restaurant searches per day?",
      answer: "About 50 million searches per day as customers browse options",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 578 searches/sec",
        result: "~600 searches/sec (1,800 at peak)",
      },
      learningPoint: "Search-heavy system - many browse before ordering",
    },
    {
      id: 'location-updates',
      category: 'burst',
      question: "How often do drivers update their location?",
      answer: "Every 5 seconds while on delivery. With 50K active drivers during peak, that's 10,000 location updates per second!",
      importance: 'critical',
      insight: "Real-time location tracking creates massive write load",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should restaurant search results load?",
      answer: "p99 under 300ms. Customers are impatient - slow search means lost orders.",
      importance: 'critical',
      learningPoint: "Geo-search at scale requires specialized infrastructure",
    },
    {
      id: 'latency-dispatch',
      category: 'latency',
      question: "How quickly should we assign a driver to a new order?",
      answer: "Under 30 seconds. The faster we dispatch, the fresher the food arrives.",
      importance: 'critical',
      learningPoint: "Driver dispatch is a complex optimization problem",
    },
    {
      id: 'eta-accuracy',
      category: 'latency',
      question: "How accurate should delivery ETAs be?",
      answer: "Within 5 minutes of actual delivery time for 90% of orders. ETA accuracy drives customer satisfaction.",
      importance: 'important',
      learningPoint: "ETA prediction requires ML models considering traffic, restaurant prep time, etc.",
    },
    {
      id: 'peak-surge',
      category: 'burst',
      question: "What happens during peak times like Super Bowl Sunday?",
      answer: "Orders spike 5-10x during events. We need surge pricing to balance supply (drivers) and demand (orders). System must handle gracefully.",
      importance: 'important',
      insight: "Peak events are the ultimate stress test for delivery platforms",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-flow', 'restaurant-side', 'driver-side'],
  criticalFRQuestionIds: ['core-flow', 'search-discovery'],
  criticalScaleQuestionIds: ['location-updates', 'latency-dispatch', 'peak-surge'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Search restaurants by location',
      description: 'Customers can find restaurants near them with geo-search',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Place orders',
      description: 'Customers can select items and checkout',
      emoji: '🛒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Track delivery in real-time',
      description: 'See driver location and updated ETA',
      emoji: '📍',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Restaurants manage menus and orders',
      description: 'Update availability and fulfill orders',
      emoji: '🍽️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Drivers accept and complete deliveries',
      description: 'Update location and delivery status',
      emoji: '🚗',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million customers + 500K drivers',
    writesPerDay: '2 million orders + 43 billion location updates',
    readsPerDay: '50 million searches + 100 million tracking views',
    peakMultiplier: 3,
    readWriteRatio: '3:1',
    calculatedWriteRPS: { average: 500000, peak: 1500000 },
    calculatedReadRPS: { average: 1736, peak: 5208 },
    maxPayloadSize: '~5KB (order with items)',
    storagePerRecord: '~2KB (order)',
    storageGrowthPerYear: '~1.5TB',
    redirectLatencySLA: 'p99 < 300ms (search)',
    createLatencySLA: 'p99 < 500ms (place order)',
  },

  architecturalImplications: [
    '✅ Geo-search required → Elasticsearch with geo-spatial indexing',
    '✅ Real-time location tracking → WebSockets + message queue for high write volume',
    '✅ Driver dispatch algorithm → Need optimization engine (async processing)',
    '✅ 10K location updates/sec → Message queue to decouple writes',
    '✅ Peak traffic (5-10x) → Auto-scaling and surge pricing logic',
    '✅ ETA prediction → ML service for real-time calculations',
  ],

  outOfScope: [
    'Multi-restaurant orders',
    'In-app payment processing (use third-party)',
    'Driver background checks',
    'Restaurant onboarding',
    'Promotions and loyalty programs',
    'International multi-currency',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where customers can search restaurants, place orders, and track deliveries. The complex dispatch algorithms and real-time optimizations come later. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to Food Delivery Corp! You've been hired to build the next DoorDash.",
  hook: "Your first customer just opened the app and wants to order lunch!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Customers, restaurants, and drivers can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write code to handle orders!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

For DoorDash, we actually have THREE types of clients:
1. **Customer App** - Browse restaurants, place orders
2. **Restaurant Dashboard** - Manage menu, accept orders
3. **Driver App** - Accept deliveries, update location

All three connect to the same **App Server** which handles the business logic.`,

  whyItMatters: 'Without this connection, none of your users can interact with the platform.',

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Handling 2 million orders per day',
    howTheyDoIt: 'Started with a simple Ruby on Rails server, now uses a microservices architecture with Go and Python',
  },

  keyPoints: [
    'Client = user devices (customer, restaurant, driver apps)',
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
  id: 'doordash-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers, restaurants, and drivers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles orders, search, and dispatch logic', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle orders yet!",
  hook: "A hungry customer tried to search for 'pizza near me' but got a 404 error.",
  challenge: "Write the Python code to search restaurants, place orders, and track deliveries.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle food delivery!',
  achievement: 'You implemented the core DoorDash functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can search restaurants', after: '✓' },
    { label: 'Can place orders', after: '✓' },
    { label: 'Can track deliveries', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all orders are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Food Delivery Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For DoorDash, we need handlers for:
- \`search_restaurants(location, cuisine)\` - Find nearby restaurants
- \`place_order(restaurant_id, items, delivery_address)\` - Create new order
- \`track_order(order_id)\` - Get real-time delivery status

For now, we'll store everything in memory (Python dictionaries) to keep it simple.`,

  whyItMatters: 'These handlers are the brain of your platform - they make the magic happen!',

  famousIncident: {
    title: 'DoorDash Super Bowl Crash',
    company: 'DoorDash',
    year: '2020',
    whatHappened: 'During Super Bowl Sunday, a surge in orders overwhelmed their order processing system. The app crashed for millions of users during the busiest delivery day of the year.',
    lessonLearned: 'Start simple, but design APIs that can scale. Load testing matters!',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Processing 25 orders/second',
    howTheyDoIt: 'Order Service uses async processing and queues to handle spikes. Never blocks on order placement.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (restaurant closed, invalid address, etc.)',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage in Step 2?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory never fails',
      'It\'s free',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple storage. Database adds complexity, so we add it in Step 3.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes API requests', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'CRUD', explanation: 'Create, Read, Update, Delete operations', icon: '📝' },
  ],
};

const step2: GuidedStep = {
  id: 'doordash-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search restaurants, FR-2: Place orders, FR-3: Track deliveries',
    taskDescription: 'Configure APIs and implement Python handlers for core functionality',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/restaurants, POST /api/v1/orders, GET /api/v1/orders/:id/track APIs',
      'Open the Python tab',
      'Implement search_restaurants(), place_order(), and track_order() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for search_restaurants, place_order, and track_order',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          handledAPIs: [
            'GET /api/v1/restaurants',
            'POST /api/v1/orders',
            'GET /api/v1/orders/:id/track'
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
  scenario: "Disaster! Your server crashed at dinner rush...",
  hook: "When it restarted, ALL orders were GONE! 50,000 active orders, vanished. Angry customers everywhere.",
  challenge: "Add a database so orders, restaurants, and drivers persist forever.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Orders, restaurants, and drivers now persist across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But restaurant search is getting slow as we add more restaurants...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **ACID**: Transactions for order consistency

For DoorDash, we need tables for:
- \`restaurants\` - Restaurant info and menus
- \`orders\` - All placed orders
- \`drivers\` - Driver profiles and availability
- \`customers\` - Customer accounts
- \`menu_items\` - Restaurant menu items`,

  whyItMatters: 'Imagine losing thousands of active orders during dinner rush. Restaurants would be furious, customers would never order again!',

  famousIncident: {
    title: 'Uber Eats Data Loss',
    company: 'Uber Eats',
    year: '2018',
    whatHappened: 'A database failover issue caused order data to be temporarily lost. Restaurants prepared food that was never picked up. Drivers showed up with nothing to deliver.',
    lessonLearned: 'Persistent storage with proper backups is absolutely critical for delivery platforms.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Storing 2 million orders per day',
    howTheyDoIt: 'Uses PostgreSQL and Cassandra - relational for transactional data, NoSQL for high-volume location tracking',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for transactional order data',
    'ACID properties ensure order consistency',
    'Connect App Server to Database for read/write operations',
  ],

  quickCheck: {
    question: 'Why is database durability especially critical for food delivery?',
    options: [
      'It makes the system faster',
      'Orders involve money - losing them means lost revenue and angry users',
      'It\'s required by law',
      'It reduces server load',
    ],
    correctIndex: 1,
    explanation: 'Each order represents money, food being prepared, and a driver en route. Losing this data is catastrophic.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'ACID', explanation: 'Guarantees for transactional consistency', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'doordash-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store restaurants, orders, drivers, menus permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Restaurant Data
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 100,000 restaurants, and searches are taking 3+ seconds!",
  hook: "Users are complaining: 'Why is DoorDash so slow?' Every search hits the database.",
  challenge: "Add a cache to make restaurant searches and menu lookups lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Restaurant search is 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Search latency', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what happens when search traffic spikes 10x at lunch time?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage between your app and database.

For DoorDash, we cache:
- **Restaurant menus** - Most popular restaurants accessed 1000s of times/hour
- **Popular searches** - "Pizza near me", "Chinese food"
- **Driver locations** - Updated frequently, read even more
- **Restaurant metadata** - Hours, ratings, delivery radius

Cache pattern:
\`\`\`
Request → Cache (1ms) → Database (only on miss, 100ms)
\`\`\`

This is especially powerful for read-heavy data like menus that rarely change.`,

  whyItMatters: 'At 1,800 searches/sec during peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Grubhub Memorial Day Cache Failure',
    company: 'Grubhub',
    year: '2019',
    whatHappened: 'Their Redis cache cluster went down during Memorial Day (peak ordering). All requests hit the database, causing cascading failures. Site was down for 2 hours.',
    lessonLearned: 'Cache redundancy is critical. Never have a single cache instance.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Serving 50 million searches per day',
    howTheyDoIt: 'Uses Redis clusters to cache restaurant data and popular searches. 95%+ cache hit rate means most searches never touch the database.',
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
    'Cache popular restaurant data and search results',
    'Set appropriate TTL (e.g., 5 min for menus, 1 hour for restaurant info)',
    'Cache hit = instant response, cache miss = fetch from DB',
  ],

  quickCheck: {
    question: 'Why is caching especially effective for restaurant menus?',
    options: [
      'Menus change constantly',
      'Menus are read frequently but change rarely - perfect for caching',
      'Caching saves money',
      'It makes the database faster',
    ],
    correctIndex: 1,
    explanation: 'Popular restaurants get thousands of menu views per hour, but menus only change a few times per day. High read-to-write ratio = perfect for caching.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'doordash-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search restaurants (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache restaurant menus and popular searches', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
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
  scenario: "It's 6 PM on Friday - peak dinner time! Your single app server is maxed out at 100% CPU!",
  hook: "Orders are timing out. Customers can't search. Your single server can't handle the load.",
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

For food delivery, this is critical because:
- Traffic has strong peak patterns (lunch: 12-1, dinner: 6-8)
- Need to handle 3-5x normal load during peaks
- Geographic distribution (different cities peak at different times)`,

  whyItMatters: 'At peak, DoorDash handles 5,000+ requests/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Postmates Valentine\'s Day Meltdown',
    company: 'Postmates',
    year: '2018',
    whatHappened: 'Valentine\'s Day orders spiked 8x. Their load balancers couldn\'t route traffic fast enough. Single servers became bottlenecks. System crashed.',
    lessonLearned: 'Load balancers must be configured with proper health checks and sufficient capacity.',
    icon: '💔',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Handling peak dinner rush',
    howTheyDoIt: 'Uses multiple layers of load balancing (geographic, service-level) to distribute traffic across thousands of servers globally',
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
    'Enables horizontal scaling (add more servers for peak times)',
    'Eliminates single point of failure',
    'Place between Client and App Servers',
  ],

  quickCheck: {
    question: 'Why is load balancing especially important for food delivery?',
    options: [
      'It makes the system faster',
      'Predictable traffic spikes (lunch/dinner) require scaling up and down',
      'It\'s cheaper than one big server',
      'It looks better in diagrams',
    ],
    correctIndex: 1,
    explanation: 'Food delivery has predictable daily peaks. Load balancing allows you to scale up during peaks and scale down during quiet hours.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle load', icon: '↔️' },
    { title: 'Health Checks', explanation: 'Monitor server availability', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'doordash-step-5',
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
// STEP 6: Add Search Engine for Geo-Spatial Search
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🗺️',
  scenario: "Users are frustrated! 'Find pizza near me' returns restaurants 50 miles away.",
  hook: "Your database queries for geo-location are slow and inaccurate. You need proper geo-search.",
  challenge: "Add Elasticsearch with geo-spatial indexing for fast, accurate location-based search.",
  illustration: 'map-search',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Geo-search is blazing fast and accurate!',
  achievement: 'Users now find nearby restaurants in milliseconds',
  metrics: [
    { label: 'Search latency', before: '2000ms', after: '150ms' },
    { label: 'Location accuracy', after: 'Within 100m' },
    { label: 'Geo-queries/sec', after: '1,800+' },
  ],
  nextTeaser: "But driver dispatch is still slow and inefficient...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Geo-Spatial Search: Finding Restaurants Nearby',
  conceptExplanation: `Regular databases are terrible at geo-spatial queries:
"Find restaurants within 3 miles of (lat, lon)" requires complex math on EVERY row.

**Elasticsearch with geo-spatial indexing**:
- Uses specialized data structures (Quadtrees, Geohashes)
- Indexes locations for fast proximity search
- Supports filters: distance, delivery zones, business hours
- Can combine geo + text search: "Italian restaurants within 2 miles"

DoorDash needs this for:
- Restaurant search by location
- Geo-fencing (delivery zones)
- Driver assignment (nearest available driver)`,

  whyItMatters: 'Location is the PRIMARY search dimension for food delivery. Without fast geo-search, the platform is unusable.',

  famousIncident: {
    title: 'Seamless (now Grubhub) Geo-Search Fail',
    company: 'Seamless',
    year: '2015',
    whatHappened: 'A bug in their geo-search showed users restaurants 100+ miles away. Orders were placed but restaurants couldn\'t deliver. Massive customer service nightmare.',
    lessonLearned: 'Geo-search must be accurate and validated. Test with real-world scenarios.',
    icon: '📍',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Searching 200K+ restaurants by location',
    howTheyDoIt: 'Uses Elasticsearch with geo-spatial indexing. Can search by location, filter by cuisine/price, and sort by ETA in <200ms.',
  },

  diagram: `
User: "Pizza near me (37.7749, -122.4194)"
          │
          ▼
┌──────────────────────┐
│    Elasticsearch     │
│  Geo-Spatial Index   │
│  [Quadtree/Geohash]  │
└──────────┬───────────┘
           │
           ▼
Results: [Pizza Palace (0.3mi), Joe's Pizza (0.8mi), ...]
`,

  keyPoints: [
    'Elasticsearch is optimized for geo-spatial queries',
    'Index restaurants with lat/lon coordinates',
    'Supports radius search, bounding box, polygon queries',
    'Can combine geo + text + filters in one query',
  ],

  quickCheck: {
    question: 'Why is Elasticsearch better than PostgreSQL for geo-search?',
    options: [
      'It stores more data',
      'It\'s free and open source',
      'It uses specialized geo-spatial indexes (Quadtrees) for fast proximity queries',
      'It has better documentation',
    ],
    correctIndex: 2,
    explanation: 'PostgreSQL can do geo-queries but they\'re slow at scale. Elasticsearch\'s geo-spatial indexes make location queries 100x faster.',
  },

  keyConcepts: [
    { title: 'Geo-Spatial Index', explanation: 'Special index for location queries', icon: '🗺️' },
    { title: 'Radius Search', explanation: 'Find points within X miles of location', icon: '⭕' },
    { title: 'Geohash', explanation: 'Encode lat/lon as string for fast comparison', icon: '#️⃣' },
  ],
};

const step6: GuidedStep = {
  id: 'doordash-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search restaurants by location (now with geo-search)',
    taskDescription: 'Add Elasticsearch for geo-spatial restaurant search',
    componentsNeeded: [
      { type: 'search', reason: 'Enable fast geo-spatial search for restaurants', displayName: 'Elasticsearch' },
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
    level2: 'Connect App Server to Search. Restaurants will be geo-indexed for location search.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Order Dispatch
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚗',
  scenario: "A customer just placed an order, but it took 45 seconds to find and assign a driver!",
  hook: "The order placement API times out while running the dispatch algorithm. Food is getting cold.",
  challenge: "Add a message queue to handle driver dispatch asynchronously.",
  illustration: 'driver-dispatch',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Order dispatch is lightning fast!',
  achievement: 'Async processing enables instant order confirmation and smart driver assignment',
  metrics: [
    { label: 'Order placement latency', before: '8s', after: '<500ms' },
    { label: 'Dispatch time', after: '<30s (async)' },
    { label: 'Driver match quality', after: 'Optimized' },
  ],
  nextTeaser: "But we need to scale app servers for peak traffic...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Order Dispatch',
  conceptExplanation: `The **order dispatch problem** is complex:
- Find available drivers near the restaurant
- Consider driver ratings, current location, direction of travel
- Predict ETA for each driver to restaurant
- Assign best driver
- Send notifications

This takes time (5-30 seconds). We can't make the customer wait!

**Synchronous**: Place Order → Run dispatch algorithm → Return "Order Placed" ❌ (too slow)
**Async with Queue**: Place Order → Add to queue → Return "Order Placed" ✓
- Background workers process the queue
- Run sophisticated matching algorithms
- Update customer with driver info when ready

Additional uses:
- Driver location updates (10K/second)
- Order status notifications
- ETA recalculations`,

  whyItMatters: 'Without async processing, order placement would timeout. Users would get errors instead of confirmations.',

  famousIncident: {
    title: 'DoorDash Driver Assignment Bug',
    company: 'DoorDash',
    year: '2021',
    whatHappened: 'A bug in the dispatch algorithm caused orders to be assigned to drivers 20+ miles away, while closer drivers sat idle. Food arrived cold after 2+ hour waits.',
    lessonLearned: 'Dispatch algorithms are complex. Async processing allows time for sophisticated optimization.',
    icon: '🐛',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Dispatching 25 orders/second at average, 75/sec at peak',
    howTheyDoIt: 'Uses Kafka for order events. Dispatch workers consume orders, run ML models for optimal assignment, and publish driver assignments.',
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
                          │ Dispatch Workers │
                          │ (ML-based)       │
                          └────────┬─────────┘
                                   │
                                   ▼
                           Assign optimal driver
                           Send notifications
`,

  keyPoints: [
    'Message queue decouples order placement from dispatch',
    'Customer gets instant confirmation - dispatch happens in background',
    'Workers can run complex ML algorithms without blocking requests',
    'Queue handles 10K location updates/sec from drivers',
  ],

  quickCheck: {
    question: 'Why do we use async dispatch instead of synchronous driver assignment?',
    options: [
      'It\'s cheaper',
      'Customer gets instant response while optimal driver is found in background',
      'It uses less memory',
      'It\'s easier to code',
    ],
    correctIndex: 1,
    explanation: 'Async means the customer doesn\'t wait. Order is confirmed instantly, and the best driver is matched in the background using ML.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async event processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Dispatch', explanation: 'Algorithm to match orders to drivers', icon: '🎯' },
  ],
};

const step7: GuidedStep = {
  id: 'doordash-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Place orders, FR-3: Track delivery (now with async dispatch)',
    taskDescription: 'Add a Message Queue for async order dispatch and location updates',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Handle order dispatch and driver updates asynchronously', displayName: 'Kafka' },
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
    level2: 'Connect App Server to Message Queue. This enables async order dispatch and location tracking.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Your CFO is alarmed! Monthly cloud bill is $850,000.",
  hook: "The board says: 'Cut costs by 40% or we're raising prices and losing customers.'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built DoorDash!',
  achievement: 'A scalable, cost-effective food delivery platform',
  metrics: [
    { label: 'Monthly cost', before: '$850K', after: 'Under budget' },
    { label: 'Search latency', after: '<300ms' },
    { label: 'Dispatch time', after: '<30s' },
    { label: 'Location updates/sec', after: '10K+' },
    { label: 'Peak capacity', after: '5K req/sec' },
  ],
  nextTeaser: "You've mastered food delivery system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Economics of Food Delivery',
  conceptExplanation: `Food delivery has thin margins - cost optimization is CRITICAL.

Cost optimization strategies:
1. **Right-size instances** - Match server size to actual load
2. **Auto-scale aggressively** - Scale up for lunch/dinner, down at night
3. **Cache hot data** - Popular restaurants cached, reduce DB calls
4. **Efficient geo-search** - Elasticsearch cheaper than database for location queries
5. **Async processing** - Smaller, cheaper servers for background work
6. **Database optimization** - Read replicas for tracking queries

For DoorDash:
- Archive old orders (>90 days) to cold storage
- Use spot instances for stateless dispatch workers
- Cache popular restaurant menus aggressively
- Scale servers by time zone (lunch peaks happen at different times globally)`,

  whyItMatters: 'Delivery platforms typically make $2-5 per order. At 2M orders/day, even $0.10 savings per order = $200K/day = $73M/year!',

  famousIncident: {
    title: 'Uber Eats Loses $3.3B in One Year',
    company: 'Uber Eats',
    year: '2020',
    whatHappened: 'Despite massive scale, Uber Eats lost billions due to inefficient operations and high infrastructure costs. Had to optimize or shut down.',
    lessonLearned: 'Unit economics matter. Every order must be profitable after infrastructure costs.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Becoming profitable after years of losses',
    howTheyDoIt: 'Heavily optimized infrastructure costs. Uses auto-scaling, efficient caching, and custom ML models that run on cheaper hardware.',
  },

  keyPoints: [
    'Auto-scale for predictable traffic patterns (lunch/dinner peaks)',
    'Cache aggressively to reduce expensive database queries',
    'Use async processing to run complex work on cheaper servers',
    'Right-size based on actual usage patterns',
    'Consider multi-region for global time zone optimization',
  ],

  quickCheck: {
    question: 'Why is cost optimization especially critical for food delivery platforms?',
    options: [
      'To make investors happy',
      'Thin profit margins per order - infrastructure costs directly impact profitability',
      'Cloud bills are too expensive',
      'Competitors might be cheaper',
    ],
    correctIndex: 1,
    explanation: 'Food delivery margins are thin ($2-5/order). If infrastructure costs $1/order, that\'s 20-50% of profit gone. Cost optimization is survival.',
  },

  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Automatically adjust server count to traffic', icon: '📊' },
    { title: 'Unit Economics', explanation: 'Profit per order after all costs', icon: '💵' },
    { title: 'Cost/Performance', explanation: 'Balance budget with requirements', icon: '⚖️' },
  ],
};

const step8: GuidedStep = {
  id: 'doordash-step-8',
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

export const doordashGuidedTutorial: GuidedTutorial = {
  problemId: 'doordash',
  title: 'Design DoorDash',
  description: 'Build a food delivery platform with geo-search, real-time tracking, and driver dispatch',
  difficulty: 'advanced',
  estimatedMinutes: 55,

  welcomeStory: {
    emoji: '🚀',
    hook: "You've been hired as Lead Engineer at Food Delivery Corp!",
    scenario: "Your mission: Build a DoorDash-like platform that connects hungry customers with restaurants and drivers in real-time.",
    challenge: "Can you design a system that handles geo-search, real-time tracking, and intelligent driver dispatch?",
  },

  requirementsPhase: doordashRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Geo-Spatial Search',
    'Message Queues',
    'Real-Time Location Tracking',
    'Order Dispatch Algorithm',
    'ETA Prediction',
    'Cost Optimization',
    'Three-Sided Marketplace',
  ],

  ddiaReferences: [
    'Chapter 2: Data Models (geo-spatial indexing)',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing (location updates)',
  ],
};

export default doordashGuidedTutorial;
