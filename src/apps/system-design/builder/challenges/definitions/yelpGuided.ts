import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Yelp Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a business review platform like Yelp.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (search, cache, storage, etc.)
 *
 * Key Concepts:
 * - Geo-spatial search with Elasticsearch
 * - Review aggregation and rating calculations
 * - Photo uploads and CDN delivery
 * - Business categorization and filtering
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const yelpRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a business review platform like Yelp",

  interviewer: {
    name: 'Marcus Chen',
    role: 'Senior Engineering Manager at Local Search Co.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the main features users need from this platform?",
      answer: "Users need to:\n\n1. **Search for businesses** - Find restaurants, shops, services by location and category\n2. **View business details** - See hours, address, phone, photos, menu\n3. **Read and write reviews** - See what others say and share their own experiences\n4. **Rate businesses** - Give 1-5 star ratings\n5. **Upload photos** - Share images of food, ambiance, products",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "Yelp is about discovery and trust - helping users make informed decisions about local businesses",
    },
    {
      id: 'search-location',
      category: 'functional',
      question: "How do users search for businesses? What makes a good search experience?",
      answer: "Users search by:\n1. **Location** - 'Pizza near me' or 'Dentist in Seattle'\n2. **Category** - Restaurants, Shopping, Home Services, etc.\n3. **Keywords** - Business name, cuisine type, specific features\n4. **Filters** - Price range ($$), rating (4+ stars), open now, delivery\n\nResults should show nearby businesses sorted by relevance, distance, or rating.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Location-based search is THE core feature - requires geo-spatial indexing",
    },
    {
      id: 'review-system',
      category: 'functional',
      question: "Tell me about the review and rating system.",
      answer: "Users can write text reviews with 1-5 star ratings. Key points:\n- Each user can write one review per business\n- Reviews show user name, rating, date, text, photos\n- Business page shows average rating (aggregate of all reviews)\n- Reviews can be sorted by date, rating, or usefulness\n- Other users can mark reviews as 'useful', 'funny', or 'cool'",
      importance: 'critical',
      revealsRequirement: 'FR-3, FR-4',
      learningPoint: "Reviews are the heart of Yelp - need efficient aggregation for average ratings",
    },
    {
      id: 'business-listings',
      category: 'functional',
      question: "Who creates business listings? How do they get added?",
      answer: "Business listings can be:\n1. **Claimed by business owners** - Businesses verify ownership and manage their listing\n2. **User-generated** - Users can add a business if it doesn't exist\n3. **Yelp-generated** - Yelp crawls business directories\n\nFor MVP, let's focus on businesses being able to claim and manage their listings (update hours, photos, respond to reviews).",
      importance: 'important',
      revealsRequirement: 'FR-2',
      insight: "Two-sided platform: business owners AND users both interact with listings",
    },
    {
      id: 'photos',
      category: 'clarification',
      question: "How important are photos? What types of photos?",
      answer: "Photos are critical! They drive engagement. Types:\n1. **Business photos** - Owner uploads official photos (menu, interior, exterior)\n2. **User photos** - Customers share what they experienced\n3. **Food/product photos** - Most popular category\n\nFor MVP, support both upload and display. Advanced features (tagging, menus from photos) can come later.",
      importance: 'important',
      insight: "Photos mean object storage and CDN - just like Instagram",
    },
    {
      id: 'categories',
      category: 'clarification',
      question: "How are businesses categorized?",
      answer: "Businesses have multiple categories:\n- Primary category (e.g., 'Italian Restaurant')\n- Secondary categories (e.g., 'Pizza', 'Wine Bar')\n- Parent categories (e.g., 'Restaurants', 'Food')\n\nThis allows filtering: 'Show me all restaurants' or 'Show me specifically pizza places'.",
      importance: 'important',
      insight: "Hierarchical categorization enables powerful filtering",
    },

    // SCALE & NFRs
    {
      id: 'throughput-businesses',
      category: 'throughput',
      question: "How many businesses should we support?",
      answer: "About 200 million businesses globally, with 100 million monthly active users",
      importance: 'critical',
      learningPoint: "Massive catalog - need efficient search indexing",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches per day?",
      answer: "About 150 million searches per day",
      importance: 'critical',
      calculation: {
        formula: "150M ÷ 86,400 sec = 1,736 searches/sec",
        result: "~1,700 searches/sec (5,000+ at peak)",
      },
      learningPoint: "Very search-heavy workload - caching and fast geo-indexing critical",
    },
    {
      id: 'throughput-reviews',
      category: 'throughput',
      question: "How many reviews are written per day?",
      answer: "About 1 million new reviews per day",
      importance: 'critical',
      calculation: {
        formula: "1M ÷ 86,400 sec = 11.6 reviews/sec",
        result: "~12 reviews/sec (36 at peak)",
      },
      learningPoint: "Low write volume compared to reads - read-heavy 100:1 ratio",
    },
    {
      id: 'photo-volume',
      category: 'payload',
      question: "What's the volume of photo uploads?",
      answer: "About 5 million photos uploaded per day, average 1.5MB each",
      importance: 'important',
      calculation: {
        formula: "5M photos × 1.5MB = 7.5TB/day storage",
        result: "~2.7PB/year storage growth",
      },
      learningPoint: "Significant photo storage - need object storage + CDN",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results load?",
      answer: "p99 under 300ms for search results. Users are browsing and comparing - they'll abandon slow searches.",
      importance: 'critical',
      learningPoint: "Fast geo-spatial search requires specialized indexing (Elasticsearch)",
    },
    {
      id: 'latency-business-page',
      category: 'latency',
      question: "How quickly should a business page load?",
      answer: "p99 under 500ms for full business page (details + reviews + photos). This is the decision-making page - must be fast.",
      importance: 'critical',
      learningPoint: "Aggressive caching needed for business pages - they're read frequently",
    },
    {
      id: 'rating-consistency',
      category: 'consistency',
      question: "How important is the accuracy of average ratings?",
      answer: "Very important! If a business has 4.5 stars but shows 3.2 due to stale data, users lose trust. However, eventual consistency (within a few seconds) is acceptable - we don't need real-time updates.",
      importance: 'critical',
      learningPoint: "Rating aggregation can use eventual consistency with short propagation delay",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'search-location', 'review-system', 'throughput-searches'],
  criticalFRQuestionIds: ['core-functionality', 'search-location', 'review-system'],
  criticalScaleQuestionIds: ['throughput-searches', 'latency-search', 'rating-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search for businesses',
      description: 'Search by location, category, and keywords with filters',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can view business details',
      description: 'See hours, location, photos, menu, contact info',
      emoji: '🏪',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can write reviews',
      description: 'Share experiences with text reviews',
      emoji: '✍️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can rate businesses',
      description: 'Give 1-5 star ratings that aggregate into overall score',
      emoji: '⭐',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can upload photos',
      description: 'Share photos of food, ambiance, products',
      emoji: '📷',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '1 million reviews + 5 million photos',
    readsPerDay: '150 million searches',
    peakMultiplier: 3,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 12, peak: 36 },
    calculatedReadRPS: { average: 1736, peak: 5208 },
    maxPayloadSize: '~2KB (review text)',
    storagePerRecord: '~3KB (review + metadata)',
    storageGrowthPerYear: '~3PB (photos)',
    redirectLatencySLA: 'p99 < 300ms (search)',
    createLatencySLA: 'p99 < 1s (review submission)',
  },

  architecturalImplications: [
    '✅ Search-heavy (100:1) → Geo-spatial search engine + caching critical',
    '✅ 5,000 searches/sec peak → Need Elasticsearch for location queries',
    '✅ 200M businesses → Efficient indexing and categorization required',
    '✅ 2.7PB/year photos → Object storage + CDN needed',
    '✅ Rating aggregation → Eventual consistency acceptable',
  ],

  outOfScope: [
    'Business owner analytics dashboard',
    'Reservation/booking system',
    'Messaging between users and businesses',
    'Yelp Waitlist feature',
    'Review moderation/fraud detection (basic version only)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search businesses and write reviews. The complexity of geo-search, photo storage, and rating aggregation comes in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏪',
  scenario: "Welcome to Local Search Co! You're building the next Yelp.",
  hook: "Your first user just opened the app looking for 'pizza near me'!",
  challenge: "Set up the basic connection so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to find pizza places yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens Yelp:
1. Their device (phone, browser) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t search for businesses or read reviews.',

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Handling 150 million searches per day',
    howTheyDoIt: 'Started with a simple Python/Django server in 2004, now uses a microservices architecture with hundreds of services',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP = the protocol they use to communicate',
  ],
};

const step1: GuidedStep = {
  id: 'yelp-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching for businesses', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles search, reviews, and business data', displayName: 'App Server' },
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
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle business searches yet!",
  hook: "A user searched for 'Thai food in Austin' but got an error 500.",
  challenge: "Write the Python code to search businesses, view details, and submit reviews.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle business operations!',
  achievement: 'You implemented the core Yelp functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can search businesses', after: '✓' },
    { label: 'Can view details', after: '✓' },
    { label: 'Can write reviews', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Core Business Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Yelp, we need handlers for:
- \`search_businesses(location, category, keywords)\` - Find businesses by criteria
- \`get_business(business_id)\` - Get full business details
- \`submit_review(business_id, rating, text)\` - Add a review

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just an empty shell. This is where the business logic lives!',

  famousIncident: {
    title: 'Yelp\'s Review Filtering Algorithm',
    company: 'Yelp',
    year: '2009',
    whatHappened: 'Yelp introduced an algorithm to filter suspicious reviews. Some business owners complained about losing legitimate reviews, leading to lawsuits. But the filtering improved trust overall.',
    lessonLearned: 'Get the core review submission working first. Advanced features like fraud detection come later.',
    icon: '🛡️',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Processing 1 million reviews per day',
    howTheyDoIt: 'Their Review Service handles submissions, spam detection, and rating aggregation asynchronously',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (business not found, duplicate reviews, etc.)',
    'Calculate average rating when new review is submitted',
  ],

  quickCheck: {
    question: 'Why do we calculate average rating when a review is submitted?',
    options: [
      'To validate the rating is 1-5 stars',
      'To update the business\'s overall rating displayed to users',
      'To send a notification to the business owner',
      'To rank the review',
    ],
    correctIndex: 1,
    explanation: 'Each review updates the business\'s average rating, which is prominently displayed on search results and business pages.',
  },
};

const step2: GuidedStep = {
  id: 'yelp-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search businesses, FR-2: View details, FR-3: Write reviews',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/search, GET /api/v1/business/:id, POST /api/v1/reviews APIs',
      'Open the Python tab',
      'Implement search_businesses(), get_business(), and submit_review() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for search, get_business, and submit_review',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/search', 'GET /api/v1/business/:id', 'POST /api/v1/reviews'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed at 3 AM...",
  hook: "When it restarted, ALL businesses and reviews were GONE! Angry business owners are calling!",
  challenge: "Add a database so business listings, reviews, and ratings survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Businesses and reviews now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But search is getting slow as the business catalog grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Yelp, we need tables for:
- \`businesses\` - Business info, location (lat/lon), categories, hours
- \`reviews\` - User reviews with ratings and text
- \`users\` - User accounts
- \`photos\` - Photo metadata (URL to object storage)
- \`categories\` - Business category taxonomy`,

  whyItMatters: 'Imagine losing all business listings because of a server restart. Businesses would lose customers, users would lose trust!',

  famousIncident: {
    title: 'Yelp\'s PostgreSQL Migration',
    company: 'Yelp',
    year: '2013',
    whatHappened: 'Yelp migrated from MySQL to PostgreSQL for better JSON support and extensibility. The careful migration took months but improved performance.',
    lessonLearned: 'Choose your database technology carefully - migrations are expensive at scale.',
    icon: '🐘',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Storing 200 million businesses with reviews',
    howTheyDoIt: 'Uses PostgreSQL with custom partitioning by geographic region for fast location queries',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data with relationships',
    'Connect App Server to Database for read/write operations',
    'Use indexes for fast lookups (location, category, business name)',
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
};

const step3: GuidedStep = {
  id: 'yelp-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store businesses, reviews, users, photos, categories', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Business Pages
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 10 million businesses, and popular pages are loading in 2+ seconds!",
  hook: "Every business page view hits the database. The most popular restaurants get thousands of views per minute.",
  challenge: "Add a cache to make business page loads instant.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Business pages load 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Page latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But as traffic grows, a single server can't handle it all...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 150ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 2ms) → Database (only if cache miss)
\`\`\`

For Yelp, we cache:
- Business details (name, hours, location, photos)
- Aggregated ratings
- Popular search results
- User profiles`,

  whyItMatters: 'At 5,000 searches/sec peak, hitting the database for every request would melt it. Caching is essential for read-heavy systems.',

  famousIncident: {
    title: 'Yelp Cache Invalidation Bug',
    company: 'Yelp',
    year: '2016',
    whatHappened: 'A bug in cache invalidation caused business hours to show stale data. Customers showed up to closed restaurants. Fixed by improving cache TTL strategy.',
    lessonLearned: 'Cache what changes rarely (business info). Use short TTL for dynamic data (ratings).',
    icon: '🕐',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Serving 150 million searches per day',
    howTheyDoIt: 'Uses Redis to cache business details and search results. Cache hit rate: 90%+',
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
    'Cache business details (change rarely)',
    'Set appropriate TTL: 5 min for ratings, 1 hour for business info',
  ],

  quickCheck: {
    question: 'Why use a shorter TTL for ratings than business info?',
    options: [
      'To save memory',
      'Ratings change more frequently as new reviews come in',
      'To reduce cache size',
      'Business info is more important',
    ],
    correctIndex: 1,
    explanation: 'Ratings update as reviews are submitted. Short TTL (5 min) ensures users see relatively fresh ratings.',
  },
};

const step4: GuidedStep = {
  id: 'yelp-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: View business details (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache business details and search results', displayName: 'Redis Cache' },
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
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "Lunch rush caused traffic to spike 5x. Users are getting timeouts when searching for restaurants.",
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
- Geographic: Route by user location`,

  whyItMatters: 'At peak, Yelp handles 5,000+ searches/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Yelp New Year\'s Eve Spike',
    company: 'Yelp',
    year: '2019',
    whatHappened: 'On NYE, restaurant searches spiked 50x as people looked for places to celebrate. Load balancers automatically distributed traffic, preventing a crash.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes.',
    icon: '🎉',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Handling 5,000 searches/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers across data centers',
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
};

const step5: GuidedStep = {
  id: 'yelp-step-5',
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
  scenario: "Your database crashed for 30 minutes last night. EVERYTHING stopped.",
  hook: "Users couldn't search, businesses couldn't be viewed. Revenue loss: $500,000 in 30 minutes!",
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
- **Primary (Leader)**: Handles all writes (new reviews, business updates)
- **Replicas (Followers)**: Handle reads (searches, business views), stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your data`,

  whyItMatters: 'A single database is a single point of failure. For Yelp\'s 1M reviews/day, downtime means lost user trust and revenue.',

  famousIncident: {
    title: 'GitHub Database Outage',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'A network partition caused database replication to fail. The team failed over to a replica, but some recent data was lost. 24 hours of incident response.',
    lessonLearned: 'Replication is critical, but test your failover process regularly.',
    icon: '🔧',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Zero tolerance for review data loss',
    howTheyDoIt: 'Uses PostgreSQL with 3-way replication across availability zones',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │   New Reviews    │
                         └────────┬─────────┘
                                  │ Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       │ Searches  │       │ Searches  │       │ Searches  │
       └───────────┘       └───────────┘       └───────────┘
`,

  keyPoints: [
    'Primary handles writes (reviews), replicas handle reads (searches)',
    'If primary fails, a replica can be promoted',
    'Replication adds some latency (data sync delay)',
    'Use at least 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'Why route searches to replicas but reviews to primary?',
    options: [
      'Replicas are faster',
      'Reviews need strong consistency (write to primary)',
      'Replicas are cheaper',
      'Primary is too busy',
    ],
    correctIndex: 1,
    explanation: 'Reviews must be durable and consistent, so they go to primary. Searches can use replicas for scaling.',
  },
};

const step6: GuidedStep = {
  id: 'yelp-step-6',
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
  hook: "Users are getting timeouts. Your load balancer has nowhere to route traffic.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 10x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '3+' },
    { label: 'Search capacity', before: '500 req/s', after: '5000+ req/s' },
  ],
  nextTeaser: "But location-based search is still slow...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Yelp:
- Start with 3-5 app server instances
- Scale up during lunch/dinner rush
- Scale down during quiet hours`,

  whyItMatters: 'At 5,000 searches/second, you need 10+ app servers just for search queries.',

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs hundreds of app server instances across multiple regions. Auto-scales based on traffic.',
  },

  famousIncident: {
    title: 'Yelp Super Bowl Traffic',
    company: 'Yelp',
    year: '2020',
    whatHappened: 'During Super Bowl, local restaurant searches spiked 200% before game time. Auto-scaling added 100+ servers in minutes. Site stayed fast!',
    lessonLearned: 'Design for horizontal scaling from day 1. It\'s harder to add later.',
    icon: '🏈',
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
    'Stateless servers are easier to scale horizontally',
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
    explanation: 'Vertical scaling has a ceiling (biggest available server). Horizontal scaling can grow indefinitely.',
  },
};

const step7: GuidedStep = {
  id: 'yelp-step-7',
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
      'Set instances to 3 or more',
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
    level2: 'Set instances to 3 or more. The load balancer will distribute traffic across all instances.',
    solutionComponents: [{ type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Search Engine (Elasticsearch for Geo-Search)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users are complaining: 'Search doesn\'t find restaurants near me!'",
  hook: "Database geo-queries are slow and inaccurate. 'Pizza in Brooklyn' returns results from Queens!",
  challenge: "Add Elasticsearch for fast, accurate geo-spatial search.",
  illustration: 'map-search',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Geo-search is blazing fast!',
  achievement: 'Location-based search with filters in under 100ms',
  metrics: [
    { label: 'Search latency', before: '1200ms', after: '<100ms' },
    { label: 'Location accuracy', after: '99%' },
    { label: 'Can search', after: '200M businesses by location' },
  ],
  nextTeaser: "But business photos are loading slowly...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Geo-Spatial Search: Finding Nearby Businesses',
  conceptExplanation: `Regular databases are terrible at geo-queries like "find pizza places within 2 miles of my location."

**Elasticsearch** with geo-spatial indexing:
- Indexes businesses by latitude/longitude
- Supports radius search ("within 2 miles")
- Supports bounding box search (map view)
- Combines location with filters (category, rating, price)
- Returns results ranked by distance and relevance

Architecture:
- When a business is created, index it in Elasticsearch
- Search queries go to Elasticsearch with geo-filters
- Return results sorted by distance + ranking`,

  whyItMatters: 'Yelp is fundamentally about location. Without fast geo-search, users can\'t find nearby businesses.',

  famousIncident: {
    title: 'Yelp Search Rewrite',
    company: 'Yelp',
    year: '2015',
    whatHappened: 'Original MySQL-based search was slow (1-2 seconds) and couldn\'t handle complex location + category + rating filters. Rebuilt with Elasticsearch, reducing search to <100ms.',
    lessonLearned: 'Use specialized tools for specialized problems. Databases aren\'t built for geo-search.',
    icon: '🗺️',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Searching 200 million businesses by location',
    howTheyDoIt: 'Uses Elasticsearch with geo_point fields. Combines location, categories, ratings, open hours in one query.',
  },

  diagram: `
User: "Pizza in Brooklyn, 4+ stars, open now"
      │
      ▼
┌──────────────┐     ┌────────────────────────────────┐
│  App Server  │────▶│      Elasticsearch             │
└──────────────┘     │  Geo-spatial + text search     │
                     │  ┌──────────────────────────┐  │
                     │  │ Filters:                 │  │
                     │  │ - Location: Brooklyn     │  │
                     │  │ - Category: Pizza        │  │
                     │  │ - Rating: >= 4 stars     │  │
                     │  │ - Open: Now              │  │
                     │  └──────────────────────────┘  │
                     └────────────┬───────────────────┘
                                  │
                                  ▼
                        Return 20 businesses in 60ms
`,

  keyPoints: [
    'Elasticsearch is optimized for geo-spatial search',
    'Index businesses with lat/lon coordinates',
    'Support radius search and bounding box queries',
    'Combine location with text filters (category, rating)',
    'Database remains source of truth for business data',
  ],

  quickCheck: {
    question: 'Why use Elasticsearch instead of database for location search?',
    options: [
      'It\'s free',
      'It has geo-spatial indexing for fast radius/bounding box queries',
      'It stores more data',
      'It\'s easier to set up',
    ],
    correctIndex: 1,
    explanation: 'Databases use slow latitude/longitude calculations. Elasticsearch has specialized geo indexes.',
  },
};

const step8: GuidedStep = {
  id: 'yelp-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search businesses (now with geo-spatial search)',
    taskDescription: 'Add Elasticsearch for fast location-based search',
    componentsNeeded: [
      { type: 'search', reason: 'Enable geo-spatial search with category filters', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search component (Elasticsearch) added',
      'App Server connected to Search',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Search (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search. Businesses will be indexed with geo-coordinates.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 9: Add Object Storage + CDN for Photos
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📸',
  scenario: "Business photos are taking 5+ seconds to load!",
  hook: "Users are abandoning business pages before photos load. Each business has 30+ photos (60MB total).",
  challenge: "Add object storage and CDN to serve photos fast, globally.",
  illustration: 'slow-images',
};

const step9Celebration: CelebrationContent = {
  emoji: '🖼️',
  message: 'Photos load instantly!',
  achievement: 'CDN delivers images in <200ms globally',
  metrics: [
    { label: 'Photo load time', before: '5000ms', after: '<200ms' },
    { label: 'Served from CDN', after: '95%' },
    { label: 'Database load', before: 'Heavy', after: 'Minimal' },
  ],
  nextTeaser: "But we're over budget...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage + CDN: Fast Global Photo Delivery',
  conceptExplanation: `Storing photos in your database is a terrible idea:
- Slow: Database isn't optimized for large files
- Expensive: Database storage is 10x more expensive than object storage
- Doesn't scale: Photos bloat your database

**Solution: Object Storage + CDN**
1. **Object Storage (S3)**: Store photos cheaply (~$0.02/GB/month)
2. **CDN (CloudFront)**: Cache photos at edge locations worldwide

Flow:
- User uploads photo → Store in S3 → Return URL
- User views business → Photo served from nearest CDN edge
- CDN caches for 30 days → 95% cache hit rate`,

  whyItMatters: 'Photos are critical for Yelp - they drive trust and engagement. Slow photos = lost users.',

  famousIncident: {
    title: 'Yelp Photo Quality Initiative',
    company: 'Yelp',
    year: '2014',
    whatHappened: 'Yelp found that businesses with 5+ photos got 2x more engagement. Invested heavily in photo upload UX and CDN infrastructure to make viewing fast.',
    lessonLearned: 'Photos are a core product feature. Optimize delivery aggressively.',
    icon: '📷',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Serving billions of photo views per day',
    howTheyDoIt: 'Uses S3 for storage, CloudFront CDN for delivery. Photos processed in multiple sizes (thumbnail, medium, full).',
  },

  diagram: `
User uploads photo
      │
      ▼
┌──────────────┐     ┌────────────────┐
│  App Server  │────▶│  S3 Storage    │
└──────────────┘     │  (billions of  │
                     │   photos)      │
                     └────────────────┘
                             │
                             │ Origin
                             ▼
                     ┌────────────────┐
User views business  │      CDN       │
      │              │   (CloudFront) │
      │              │  Edge locations│
      │              │   worldwide    │
      └─────────────▶│                │
                     └────────────────┘
                     <200ms globally!
`,

  keyPoints: [
    'Use Object Storage (S3) for photos - much cheaper than DB',
    'CDN caches photos at edge locations near users',
    'Store only photo URLs in database, not actual files',
    'Process photos in multiple sizes (thumbnail, full)',
    'Set long cache TTL (30 days) - photos rarely change',
  ],

  quickCheck: {
    question: 'Why use a CDN instead of serving photos directly from S3?',
    options: [
      'CDN is cheaper',
      'CDN caches photos near users for faster delivery',
      'CDN has more storage',
      'S3 is unreliable',
    ],
    correctIndex: 1,
    explanation: 'CDN has edge servers worldwide. Photos are cached near users for <200ms delivery vs 1-2s from S3.',
  },
};

const step9: GuidedStep = {
  id: 'yelp-step-9',
  stepNumber: 9,
  frIndex: 4,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-5: Upload photos (now with fast delivery)',
    taskDescription: 'Add Object Storage and CDN for business photos',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store business and user photos', displayName: 'S3' },
      { type: 'cdn', reason: 'Deliver photos fast globally', displayName: 'CloudFront CDN' },
    ],
    successCriteria: [
      'Object Storage component added',
      'CDN component added',
      'App Server connected to Object Storage',
      'CDN connected to Object Storage (as origin)',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag Object Storage (S3) and CDN (CloudFront) onto the canvas',
    level2: 'Connect: App Server → Object Storage, and CDN → Object Storage (as origin)',
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
  scenario: "Finance is alarmed! Your monthly cloud bill is $900,000.",
  hook: "The CFO says: 'Cut costs by 30% or we're raising prices (and losing users).'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Yelp!',
  achievement: 'A scalable, cost-effective business review platform',
  metrics: [
    { label: 'Monthly cost', before: '$900K', after: 'Under budget' },
    { label: 'Search latency', after: '<300ms' },
    { label: 'Business page latency', after: '<500ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '5,000 searches/sec' },
  ],
  nextTeaser: "You've mastered Yelp system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use CDN aggressively** - Reduce origin requests by 95%
3. **Optimize storage tiers** - Move old photos to Glacier (90% cheaper)
4. **Cache effectively** - Reduce database queries
5. **Auto-scale** - Scale down during low traffic hours

For Yelp:
- Archive old review photos to cheaper storage
- Use smaller cache for less popular businesses
- Scale down at night (traffic drops 70%)
- Compress photos (40% size reduction)`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Yelp\'s Cloud Cost Optimization',
    company: 'Yelp',
    year: '2018',
    whatHappened: 'Yelp realized they were over-provisioned by 35%. Right-sized instances and optimized storage tiers. Saved $50M annually while improving performance.',
    lessonLearned: 'At scale, even small optimizations save millions. Monitor and optimize continuously.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Running at scale',
    howTheyDoIt: 'Aggressively optimizes infrastructure. Uses reserved instances (40% savings), auto-scaling, and tiered storage.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure - monitor usage',
    'Use auto-scaling to match demand',
    'Cache to reduce expensive operations',
    'Use storage tiers (hot/warm/cold) based on access patterns',
    'CDN reduces origin bandwidth costs by 90%+',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a search-heavy platform?',
    options: [
      'Use bigger servers',
      'Aggressive caching of search results and CDN for photos',
      'Delete old reviews',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Caching search results and using CDN for photos eliminates 80%+ of expensive requests.',
  },
};

const step10: GuidedStep = {
  id: 'yelp-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $600/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $600/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'search', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'search' },
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
    level2: 'Consider: fewer replicas, smaller cache, right-sized instances. Keep 3 app servers. Use CDN to reduce costs.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const yelpGuidedTutorial: GuidedTutorial = {
  problemId: 'yelp',
  title: 'Design Yelp',
  description: 'Build a business review platform with location search, ratings, and photo uploads',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🏪',
    hook: "You've been hired as Lead Engineer at Local Search Co!",
    scenario: "Your mission: Build a Yelp-like platform that helps users discover and review local businesses.",
    challenge: "Can you design a system that handles geo-spatial search and millions of reviews?",
  },

  requirementsPhase: yelpRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Geo-Spatial Search',
    'Elasticsearch',
    'Object Storage',
    'CDN',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Reliability and consistency',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed Systems Problems',
  ],
};

export default yelpGuidedTutorial;
