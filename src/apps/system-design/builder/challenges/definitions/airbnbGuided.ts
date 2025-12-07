import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Airbnb Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building an accommodation booking platform like Airbnb.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, search, storage, etc.)
 *
 * Key Concepts:
 * - Geo-spatial search with Elasticsearch
 * - Calendar availability management
 * - Two-phase commit for bookings
 * - Trust and safety systems
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const airbnbRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an accommodation booking platform like Airbnb",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at Travel Tech Co.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the core features users need from this platform?",
      answer: "Users need to:\n\n1. **Search for listings** - Find accommodations by location, dates, price, amenities\n2. **Book properties** - Reserve and pay for a listing\n3. **List properties** - Hosts create and manage their listings\n4. **Write reviews** - Guests review stays, hosts review guests",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Airbnb is a two-sided marketplace - guests AND hosts are both users",
    },
    {
      id: 'search-location',
      category: 'functional',
      question: "How do users search for properties? What filters are essential?",
      answer: "Users search by:\n1. **Location** - City, neighborhood, or 'near me'\n2. **Dates** - Check-in and check-out dates\n3. **Guests** - Number of people\n4. **Filters** - Price range, property type, amenities (WiFi, pool, etc.)\n\nSearch results show available properties sorted by relevance, price, or rating.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Location-based search requires geo-spatial indexing, not just text search",
    },
    {
      id: 'booking-flow',
      category: 'functional',
      question: "Walk me through the booking process.",
      answer: "1. Guest finds a listing and selects dates\n2. Check availability in real-time\n3. Guest requests to book (or instant book)\n4. Payment is processed\n5. Host receives notification\n6. Booking is confirmed\n\nKey: Must prevent double-booking! Two guests can't book the same dates.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Booking requires strong consistency - race conditions could cause double-booking",
    },
    {
      id: 'messaging',
      category: 'functional',
      question: "Can guests and hosts communicate?",
      answer: "Yes, guests can message hosts before and during stays. Important for:\n- Asking questions before booking\n- Coordinating check-in\n- Requesting help during stay\n\nFor MVP, let's keep messaging simple (basic text). Video calls and translations can come later.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Messaging is important but can be simplified for initial version",
    },
    {
      id: 'calendar',
      category: 'clarification',
      question: "How do hosts manage availability?",
      answer: "Hosts maintain a calendar showing:\n- Available dates (green)\n- Booked dates (red)\n- Blocked dates (host not accepting guests)\n\nThey can adjust prices by season, and sync calendars from other platforms to prevent double-booking.",
      importance: 'important',
      insight: "Calendar management is complex - need efficient storage for date ranges",
    },
    {
      id: 'photos',
      category: 'clarification',
      question: "Do listings include photos?",
      answer: "Absolutely! Photos are critical. Listings typically have 10-30 high-quality photos. For MVP, focus on upload and display. Advanced features (auto-enhancement, virtual tours) can come later.",
      importance: 'important',
      insight: "Photos mean object storage and CDN for fast global delivery",
    },

    // SCALE & NFRs
    {
      id: 'throughput-listings',
      category: 'throughput',
      question: "How many listings should we support?",
      answer: "7 million listings globally, with 150 million users",
      importance: 'critical',
      learningPoint: "Massive scale - need efficient indexing and search",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches happen per day?",
      answer: "About 50 million searches per day",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 578 searches/sec",
        result: "~600 searches/sec (1,800 at peak)",
      },
      learningPoint: "Search-heavy workload - caching and fast indexing are critical",
    },
    {
      id: 'throughput-bookings',
      category: 'throughput',
      question: "How many bookings per day?",
      answer: "About 2 million bookings per day",
      importance: 'critical',
      calculation: {
        formula: "2M ÷ 86,400 sec = 23 bookings/sec",
        result: "~25 bookings/sec (75 at peak)",
      },
      learningPoint: "Lower write volume, but each booking is critical (payment involved)",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results load?",
      answer: "p99 under 300ms for search results. Users browse quickly and abandon slow sites.",
      importance: 'critical',
      learningPoint: "Fast geo-spatial search requires specialized indexing (not just SQL)",
    },
    {
      id: 'latency-booking',
      category: 'latency',
      question: "How quickly should booking confirmation happen?",
      answer: "Under 2 seconds for the entire booking flow (availability check + payment + confirmation). Users get anxious during payment.",
      importance: 'critical',
      learningPoint: "Booking must be fast AND consistent - no double-booking allowed",
    },
    {
      id: 'double-booking',
      category: 'burst',
      question: "What happens when two users try to book the same property at the same time?",
      answer: "This is the 'double-booking' problem! Only one should succeed. The system must:\n1. Lock the dates during booking\n2. Process payment\n3. Confirm or reject atomically\n\nThis is a classic distributed systems challenge.",
      importance: 'critical',
      insight: "Double-booking prevention is THE key technical challenge for Airbnb",
    },
    {
      id: 'availability-accuracy',
      category: 'consistency',
      question: "How important is availability accuracy?",
      answer: "Extremely critical! Showing unavailable properties wastes users' time. Showing available properties as booked loses revenue. Availability data must be consistent and real-time.",
      importance: 'critical',
      learningPoint: "Strong consistency needed for availability - can't use eventual consistency",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'search-location', 'booking-flow', 'double-booking'],
  criticalFRQuestionIds: ['core-functionality', 'search-location', 'booking-flow'],
  criticalScaleQuestionIds: ['throughput-searches', 'latency-search', 'double-booking'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search for listings',
      description: 'Search by location, dates, price, and amenities',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can book properties',
      description: 'Reserve dates and pay for accommodations',
      emoji: '📅',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Hosts can create listings',
      description: 'Add properties with photos, description, and pricing',
      emoji: '🏠',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can write reviews',
      description: 'Review stays and rate properties',
      emoji: '⭐',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can message',
      description: 'Guests and hosts communicate',
      emoji: '💬',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '2 million bookings',
    readsPerDay: '50 million searches',
    peakMultiplier: 3,
    readWriteRatio: '25:1',
    calculatedWriteRPS: { average: 23, peak: 69 },
    calculatedReadRPS: { average: 578, peak: 1734 },
    maxPayloadSize: '~2KB (listing metadata)',
    storagePerRecord: '~5KB (listing with photos)',
    storageGrowthPerYear: '~3TB (new listings + photos)',
    redirectLatencySLA: 'p99 < 300ms (search)',
    createLatencySLA: 'p99 < 2s (booking)',
  },

  architecturalImplications: [
    '✅ Search-heavy (25:1) → Geo-spatial search engine critical',
    '✅ 1,800 searches/sec peak → Need caching for popular locations',
    '✅ Double-booking prevention → Strong consistency + locking required',
    '✅ 7M listings with photos → Object storage + CDN needed',
    '✅ Real-time availability → Calendar service with fast lookups',
  ],

  outOfScope: [
    'Dynamic pricing (surge pricing)',
    'Multi-currency support',
    'Virtual tours / 360° photos',
    'Host verification / background checks',
    'Calendar sync with external platforms',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search listings and book properties. The double-booking problem and geo-search optimization will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏠',
  scenario: "Welcome to Travel Tech Co! You've been hired to build the next Airbnb.",
  hook: "Your first guest wants to search for a beach house in Miami!",
  challenge: "Set up the basic request flow so users can reach your server.",
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
  nextTeaser: "But the server doesn't know how to search for listings yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens the Airbnb app or website:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t interact with your platform at all.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Handling 50 million searches per day',
    howTheyDoIt: 'Started with a simple Rails server in 2008, now uses a complex microservices architecture',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes requests',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'airbnb-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Airbnb', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles search, booking, and listing management', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle listings yet!",
  hook: "A user tried to search for 'Miami beach house' but got an error.",
  challenge: "Write the Python code to search listings, book properties, and create listings.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle bookings!',
  achievement: 'You implemented the core Airbnb functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can search listings', after: '✓' },
    { label: 'Can book properties', after: '✓' },
    { label: 'Can create listings', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all listings are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Core Booking Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Airbnb, we need handlers for:
- \`search_listings(location, dates, guests)\` - Find available properties
- \`book_property(listing_id, dates, payment)\` - Create a booking
- \`create_listing(title, description, price, location)\` - Add new property

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'Airbnb\'s First Booking',
    company: 'Airbnb',
    year: '2007',
    whatHappened: 'The founders couldn\'t afford rent for their SF apartment. They built a simple website to rent air mattresses during a design conference. First booking: 3 guests at $80 each.',
    lessonLearned: 'Start simple! The basic booking flow hasn\'t changed - search, book, pay.',
    icon: '🛏️',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Processing 2 million bookings per day',
    howTheyDoIt: 'Their Booking Service uses a distributed transaction system to ensure no double-booking',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (listing not found, dates unavailable, etc.)',
    'Check availability BEFORE accepting booking',
  ],

  quickCheck: {
    question: 'Why do we check availability in the booking handler?',
    options: [
      'To calculate the price',
      'To prevent double-booking',
      'To send confirmation email',
      'To update the calendar',
    ],
    correctIndex: 1,
    explanation: 'Must verify dates are available before accepting payment - prevents double-booking!',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Availability Check', explanation: 'Verify dates before booking', icon: '📅' },
  ],
};

const step2: GuidedStep = {
  id: 'airbnb-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search listings, FR-2: Book properties, FR-3: Create listings',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/search, POST /api/v1/book, POST /api/v1/listings APIs',
      'Open the Python tab',
      'Implement search_listings(), book_property(), and create_listing() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for search, book, and create_listing',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/search', 'POST /api/v1/book', 'POST /api/v1/listings'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed at 2 AM...",
  hook: "When it restarted, ALL listings were GONE! 50,000 properties, vanished. Hosts are furious!",
  challenge: "Add a database so listings, bookings, and user data survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Listings and bookings now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But search is getting slow as listings grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Airbnb, we need tables for:
- \`listings\` - Property details, location, price, amenities
- \`users\` - Guests and hosts
- \`bookings\` - Reservations with dates and payment
- \`reviews\` - Ratings and feedback
- \`availability\` - Calendar for each listing`,

  whyItMatters: 'Imagine losing all bookings because of a server restart. Hosts wouldn\'t get paid, guests would show up with no reservation!',

  famousIncident: {
    title: 'AWS S3 Outage',
    company: 'Amazon Web Services',
    year: '2017',
    whatHappened: 'A typo in a command took down S3 storage for 4 hours. Airbnb photos and data became unavailable. Lost $150M in bookings during the outage.',
    lessonLearned: 'Data persistence AND redundancy are critical. Never rely on a single storage system.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Storing 7 million listings with booking data',
    howTheyDoIt: 'Uses PostgreSQL with custom partitioning by region for fast geo-queries',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data with relationships',
    'Connect App Server to Database for read/write operations',
    'Use indexes for fast lookups (location, dates, price)',
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
    { title: 'SQL Database', explanation: 'Structured tables with relationships', icon: '🗄️' },
    { title: 'Indexes', explanation: 'Speed up common queries', icon: '🔍' },
  ],
};

const step3: GuidedStep = {
  id: 'airbnb-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store listings, bookings, users, reviews, availability', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Fast Search
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "You now have 1 million listings, and search is loading in 3+ seconds!",
  hook: "Users are abandoning searches. 'Why is Airbnb so slow?' Every search hits the database.",
  challenge: "Add a cache to make searches lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search loads 30x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Search latency', before: '3000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '85%' },
  ],
  nextTeaser: "But as traffic grows, a single server can't handle it all...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 200ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 2ms) → Database (only if cache miss)
\`\`\`

For Airbnb, we cache:
- Popular search results (Miami beach houses)
- Listing details (frequently viewed properties)
- User profiles`,

  whyItMatters: 'At 1,800 searches/sec peak, hitting the database for every request would melt it. Caching is essential.',

  famousIncident: {
    title: 'Airbnb Search Crash',
    company: 'Airbnb',
    year: '2015',
    whatHappened: 'During New Year\'s Eve, search traffic spiked 10x. Without adequate caching, database queries piled up, causing timeouts. Site was slow for 2 hours.',
    lessonLearned: 'Cache popular searches aggressively. Location-based searches repeat frequently.',
    icon: '🎆',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Serving 50 million searches per day',
    howTheyDoIt: 'Uses Redis to cache search results by location and filters. Cache hit rate: 80%+',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (85% of searches)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Cache popular locations (NYC, LA, Miami)',
    'Set short TTL (5 min) for search results to stay fresh',
  ],

  quickCheck: {
    question: 'Why use a short TTL for search results?',
    options: [
      'To save memory',
      'To keep results fresh as availability changes',
      'To reduce cache size',
      'To make it faster',
    ],
    correctIndex: 1,
    explanation: 'Availability changes frequently (new bookings). Short TTL ensures users don\'t see stale results.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'airbnb-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search listings (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache search results and listing details', displayName: 'Redis Cache' },
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
  hook: "Summer vacation rush caused traffic to spike 5x. One server can't handle it all.",
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
- IP hash: Same user always goes to same server`,

  whyItMatters: 'At peak, Airbnb handles 1,800 searches/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Airbnb Super Bowl Crash',
    company: 'Airbnb',
    year: '2016',
    whatHappened: 'During Super Bowl in SF, local bookings spiked 100x as fans searched for rooms. Load balancers automatically distributed traffic, preventing a crash.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Handling 1,800 searches/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers across global data centers',
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
  id: 'airbnb-step-5',
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
  hook: "Users couldn't search, book, or do anything. Revenue loss: $200,000 in 10 minutes!",
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
- **Primary (Leader)**: Handles all writes (bookings)
- **Replicas (Followers)**: Handle reads (searches), stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your data`,

  whyItMatters: 'A single database is a single point of failure. For Airbnb\'s 2M bookings/day, downtime means lost revenue.',

  famousIncident: {
    title: 'Airbnb Database Corruption',
    company: 'Airbnb',
    year: '2013',
    whatHappened: 'A database corruption bug affected the primary. Thanks to replication, they failed over to a replica in 30 seconds. Only lost 2 bookings instead of thousands.',
    lessonLearned: 'Replication saved the day. Test your failover process regularly.',
    icon: '🔧',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Zero tolerance for booking data loss',
    howTheyDoIt: 'Uses PostgreSQL with 3-way replication across availability zones',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │    Bookings      │
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
    'Primary handles writes (bookings), replicas handle reads (searches)',
    'If primary fails, a replica can be promoted',
    'Replication adds some latency (data sync delay)',
    'Use at least 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'Why route searches to replicas but bookings to primary?',
    options: [
      'Replicas are faster',
      'Bookings need strong consistency (write to primary)',
      'Replicas are cheaper',
      'Primary is too busy',
    ],
    correctIndex: 1,
    explanation: 'Bookings must be consistent (no double-booking), so they go to primary. Searches can use replicas.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'airbnb-step-6',
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
    { label: 'Search capacity', before: '200 req/s', after: '2000+ req/s' },
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

For Airbnb:
- Start with 3-5 app server instances
- Scale up during peak travel seasons
- Scale down during quiet periods`,

  whyItMatters: 'At 1,800 searches/second, you need 5+ app servers just for search queries.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs hundreds of app server instances across multiple regions. Auto-scales based on traffic.',
  },

  famousIncident: {
    title: 'Airbnb Olympic Surge',
    company: 'Airbnb',
    year: '2012',
    whatHappened: 'London Olympics caused bookings to spike 300%. Auto-scaling kicked in, adding 50+ servers in minutes. Site stayed up!',
    lessonLearned: 'Design for horizontal scaling from day 1. It\'s harder to add later.',
    icon: '🏅',
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

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers', icon: '↔️' },
    { title: 'Vertical Scaling', explanation: 'Upgrade existing server', icon: '↕️' },
    { title: 'Stateless', explanation: 'Servers don\'t store user state', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'airbnb-step-7',
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
  scenario: "Users are complaining: 'Search doesn\'t find properties near me!'",
  hook: "Database geo-queries are slow and inaccurate. 'Beach house in Miami' returns results from Orlando!",
  challenge: "Add Elasticsearch for fast, accurate geo-spatial search.",
  illustration: 'map-search',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Geo-search is blazing fast!',
  achievement: 'Location-based search with filters in under 100ms',
  metrics: [
    { label: 'Search latency', before: '800ms', after: '<100ms' },
    { label: 'Location accuracy', after: '99%' },
    { label: 'Can search', after: '7M listings by location' },
  ],
  nextTeaser: "But listing photos are loading slowly...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Geo-Spatial Search: Finding Nearby Properties',
  conceptExplanation: `Regular databases are terrible at geo-queries like "find properties within 5 miles of Times Square."

**Elasticsearch** with geo-spatial indexing:
- Indexes listings by latitude/longitude
- Supports radius search ("within 5 miles")
- Supports bounding box search (map view)
- Combines location with filters (price, amenities)
- Returns results ranked by distance and relevance

Architecture:
- When a listing is created, index it in Elasticsearch
- Search queries go to Elasticsearch with geo-filters
- Return results sorted by distance + ranking`,

  whyItMatters: 'Airbnb is fundamentally about location. Without fast geo-search, users can\'t find properties.',

  famousIncident: {
    title: 'Airbnb Search Rewrite',
    company: 'Airbnb',
    year: '2014',
    whatHappened: 'Original MySQL-based search was slow (2-3 seconds) and couldn\'t handle complex filters. Rebuilt with Elasticsearch, reducing search to <100ms.',
    lessonLearned: 'Use specialized tools for specialized problems. Databases aren\'t built for geo-search.',
    icon: '🗺️',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Searching 7 million listings by location',
    howTheyDoIt: 'Uses Elasticsearch with geo_point fields. Combines location, dates, price, amenities in one query.',
  },

  diagram: `
User: "Beach houses in Miami, $100-200, pool, WiFi"
      │
      ▼
┌──────────────┐     ┌────────────────────────────────┐
│  App Server  │────▶│      Elasticsearch             │
└──────────────┘     │  Geo-spatial + text search     │
                     │  ┌──────────────────────────┐  │
                     │  │ Filters:                 │  │
                     │  │ - Location: Miami (geo)  │  │
                     │  │ - Dates: Available       │  │
                     │  │ - Price: $100-200        │  │
                     │  │ - Amenities: pool, WiFi  │  │
                     │  └──────────────────────────┘  │
                     └────────────┬───────────────────┘
                                  │
                                  ▼
                        Return 50 listings in 80ms
`,

  keyPoints: [
    'Elasticsearch is optimized for geo-spatial search',
    'Index listings with lat/lon coordinates',
    'Support radius search and bounding box queries',
    'Combine location with text filters (amenities, price)',
    'Database remains source of truth for bookings',
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

  keyConcepts: [
    { title: 'Geo-Spatial Index', explanation: 'Index by lat/lon for location queries', icon: '🌐' },
    { title: 'Radius Search', explanation: 'Find points within X miles', icon: '⭕' },
    { title: 'Bounding Box', explanation: 'Find points in map rectangle', icon: '🗺️' },
  ],
};

const step8: GuidedStep = {
  id: 'airbnb-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search listings (now with geo-spatial search)',
    taskDescription: 'Add Elasticsearch for fast location-based search',
    componentsNeeded: [
      { type: 'search', reason: 'Enable geo-spatial search with filters', displayName: 'Elasticsearch' },
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
    level2: 'Connect App Server to Search. Listings will be indexed with geo-coordinates.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 9: Add Object Storage + CDN for Photos
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📸',
  scenario: "Listing photos are taking 5+ seconds to load!",
  hook: "Users are abandoning listings before photos load. Each listing has 20 high-res photos (50MB total).",
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
  conceptTitle: 'Object Storage + CDN: Fast Global Image Delivery',
  conceptExplanation: `Storing photos in your database is a terrible idea:
- Slow: Database isn't optimized for large files
- Expensive: Database storage is 10x more expensive than object storage
- Doesn't scale: Photos bloat your database

**Solution: Object Storage + CDN**
1. **Object Storage (S3)**: Store photos cheaply (~$0.02/GB/month)
2. **CDN (CloudFront)**: Cache photos at edge locations worldwide

Flow:
- Host uploads photo → Store in S3 → Return URL
- Guest views listing → Photo served from nearest CDN edge
- CDN caches for 30 days → 95% cache hit rate`,

  whyItMatters: 'Photos are 80% of a listing\'s appeal. Slow photos = lost bookings.',

  famousIncident: {
    title: 'Airbnb Photo Quality Update',
    company: 'Airbnb',
    year: '2012',
    whatHappened: 'Airbnb hired professional photographers to reshoot listings. Bookings increased 2-3x! Realized photo quality and load speed are critical. Invested heavily in CDN infrastructure.',
    lessonLearned: 'Photos are the product. Optimize delivery aggressively.',
    icon: '📷',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Serving billions of photo views per day',
    howTheyDoIt: 'Uses S3 for storage, CloudFront CDN for delivery. Photos processed in multiple sizes (thumbnail, medium, full).',
  },

  diagram: `
Host uploads photo
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
Guest views listing  │      CDN       │
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

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Cheap storage for large files (S3)', icon: '🗄️' },
    { title: 'CDN', explanation: 'Cache content at edge locations', icon: '🌐' },
    { title: 'Edge Location', explanation: 'CDN server near end users', icon: '📍' },
  ],
};

const step9: GuidedStep = {
  id: 'airbnb-step-9',
  stepNumber: 9,
  frIndex: 2,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-3: Hosts can create listings (now with fast photo delivery)',
    taskDescription: 'Add Object Storage and CDN for listing photos',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store listing photos cheaply', displayName: 'S3' },
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
  scenario: "Finance is alarmed! Your monthly cloud bill is $850,000.",
  hook: "The CFO says: 'Cut costs by 30% or we're raising prices (and losing customers).'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Airbnb!',
  achievement: 'A scalable, cost-effective booking platform',
  metrics: [
    { label: 'Monthly cost', before: '$850K', after: 'Under budget' },
    { label: 'Search latency', after: '<300ms' },
    { label: 'Booking latency', after: '<2s' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '1,800 searches/sec' },
  ],
  nextTeaser: "You've mastered Airbnb system design!",
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

For Airbnb:
- Archive old booking data to cheaper storage
- Use smaller cache for less popular locations
- Scale down at night (traffic drops 60%)
- Compress photos (30% size reduction)`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Airbnb\'s AWS Optimization',
    company: 'Airbnb',
    year: '2019',
    whatHappened: 'Airbnb realized they were over-provisioned by 40%. Right-sized instances and optimized storage tiers. Saved $90M annually while improving performance.',
    lessonLearned: 'At scale, even small optimizations save millions. Monitor and optimize continuously.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Airbnb',
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
      'Delete old listings',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Caching search results and using CDN for photos eliminates 80%+ of expensive requests.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Storage Tiers', explanation: 'Hot (S3) vs Cold (Glacier) storage', icon: '🗄️' },
  ],
};

const step10: GuidedStep = {
  id: 'airbnb-step-10',
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

export const airbnbGuidedTutorial: GuidedTutorial = {
  problemId: 'airbnb',
  title: 'Design Airbnb',
  description: 'Build an accommodation booking platform with search, bookings, and listings',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🏠',
    hook: "You've been hired as Lead Engineer at Travel Tech Co!",
    scenario: "Your mission: Build an Airbnb-like platform that can handle millions of property searches and bookings globally.",
    challenge: "Can you design a system that handles geo-spatial search and prevents double-booking?",
  },

  requirementsPhase: airbnbRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
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

export default airbnbGuidedTutorial;
