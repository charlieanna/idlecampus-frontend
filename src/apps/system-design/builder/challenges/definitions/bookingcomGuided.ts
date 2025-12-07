import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Booking.com Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building a hotel booking platform like Booking.com.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (cache, search, storage, etc.)
 *
 * Key Concepts:
 * - Hotel search with location and date filters
 * - Real-time availability management
 * - Reservation and payment processing
 * - Review and rating system
 * - Dynamic pricing strategies
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const bookingcomRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a hotel booking platform like Booking.com",

  interviewer: {
    name: 'David Martinez',
    role: 'Engineering Director at Hospitality Tech',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the essential features users need from a hotel booking platform?",
      answer: "Users need to:\n\n1. **Search hotels** - Find accommodations by location, dates, guests, price\n2. **Check availability** - See real-time room availability\n3. **Make reservations** - Book and pay for hotel rooms\n4. **Write reviews** - Rate and review hotels after stays\n5. **View pricing** - See room rates with taxes and fees",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "Hotel booking is about connecting travelers with properties and managing inventory",
    },
    {
      id: 'search-hotels',
      category: 'functional',
      question: "How do users search for hotels? What criteria matter most?",
      answer: "Users search by:\n1. **Location** - City, neighborhood, or specific address\n2. **Dates** - Check-in and check-out dates\n3. **Guests** - Number of adults and children\n4. **Filters** - Star rating, amenities (pool, WiFi), price range\n5. **Sorting** - Price, rating, distance from landmark\n\nResults show available hotels with photos, ratings, and prices.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Search combines location, dates, and inventory - all three must be checked",
    },
    {
      id: 'availability-check',
      category: 'functional',
      question: "How does availability checking work?",
      answer: "For each hotel, we need to:\n1. Check room inventory for selected dates\n2. Account for existing reservations\n3. Show available room types (single, double, suite)\n4. Display real-time counts (e.g., 'Only 2 rooms left!')\n\nAvailability must be accurate - overselling loses customer trust.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Availability is complex: total rooms minus confirmed reservations minus blocked rooms",
    },
    {
      id: 'booking-process',
      category: 'functional',
      question: "Walk me through the booking and payment flow.",
      answer: "1. User selects hotel and room type\n2. Enters guest details and payment info\n3. System checks availability again (prevent overselling)\n4. Payment is processed\n5. Reservation is confirmed\n6. Hotel receives notification\n7. Confirmation email sent to guest\n\nKey: Must prevent double-booking! Lock room during checkout.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Booking requires strong consistency - two users can't book the same last room",
    },
    {
      id: 'reviews',
      category: 'functional',
      question: "How do reviews and ratings work?",
      answer: "After checkout:\n1. Guest receives email to review stay\n2. Can rate hotel (1-10) on cleanliness, location, staff, comfort\n3. Write text review\n4. Reviews are verified (only if booking was completed)\n5. Hotel overall rating is calculated from all reviews\n\nReviews are crucial - 90% of users check reviews before booking.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      insight: "Reviews drive bookings - showing accurate ratings quickly is critical",
    },
    {
      id: 'pricing',
      category: 'functional',
      question: "How is pricing displayed to users?",
      answer: "Pricing shows:\n- **Base rate** per night\n- **Total price** for entire stay\n- **Taxes and fees** breakdown\n- **Currency conversion** based on user location\n\nFor MVP, use static pricing. Dynamic pricing (surge) can come later.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      insight: "Transparent pricing builds trust - show total upfront",
    },
    {
      id: 'hotel-management',
      category: 'clarification',
      question: "Can hotels manage their own listings?",
      answer: "Yes, hotels need to:\n- Update room inventory\n- Set pricing by season/date\n- Block dates (maintenance, events)\n- Respond to reviews\n\nFor MVP, focus on guest-facing features. Hotel portal can be simplified.",
      importance: 'important',
      insight: "Two-sided marketplace like Airbnb, but hotels are businesses with more complex needs",
    },
    {
      id: 'photos',
      category: 'clarification',
      question: "Do hotels have photos?",
      answer: "Absolutely! Hotels typically have 50-100 photos (rooms, facilities, exterior, amenities). Photos are critical for conversion. For MVP, focus on fast display using CDN.",
      importance: 'important',
      insight: "Hotels have MORE photos than Airbnb listings - need efficient storage/delivery",
    },

    // SCALE & NFRs
    {
      id: 'throughput-hotels',
      category: 'throughput',
      question: "How many hotels and rooms should we support?",
      answer: "2 million hotels globally with average 100 rooms each = 200 million total rooms",
      importance: 'critical',
      learningPoint: "Massive inventory - search indexing must be efficient",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many searches happen per day?",
      answer: "About 100 million searches per day (Booking.com scale)",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 searches/sec",
        result: "~1,200 searches/sec (3,600 at peak)",
      },
      learningPoint: "Search-heavy workload - caching popular destinations is critical",
    },
    {
      id: 'throughput-bookings',
      category: 'throughput',
      question: "How many bookings per day?",
      answer: "About 1.5 million bookings per day",
      importance: 'critical',
      calculation: {
        formula: "1.5M ÷ 86,400 sec = 17 bookings/sec",
        result: "~20 bookings/sec (60 at peak)",
      },
      learningPoint: "Each booking involves payment - must be reliable and consistent",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results appear?",
      answer: "p99 under 500ms for search results. Users compare multiple hotels quickly.",
      importance: 'critical',
      learningPoint: "Searching 200M rooms by location and dates requires optimized indexing",
    },
    {
      id: 'latency-booking',
      category: 'latency',
      question: "How quickly should booking confirmation happen?",
      answer: "Under 3 seconds for complete booking flow (availability check + payment + confirmation). Users get anxious during payment.",
      importance: 'critical',
      learningPoint: "Booking must be fast AND prevent overselling",
    },
    {
      id: 'concurrent-booking',
      category: 'burst',
      question: "What happens when multiple users try to book the same last room?",
      answer: "This is the 'overselling' problem! Only one should succeed. The system must:\n1. Lock the room during checkout\n2. Recheck availability before payment\n3. Confirm or reject atomically\n\nOverselling damages reputation and costs money (hotels must relocate guests).",
      importance: 'critical',
      insight: "Preventing overselling is THE key technical challenge for hotel booking",
    },
    {
      id: 'availability-consistency',
      category: 'consistency',
      question: "How critical is real-time availability accuracy?",
      answer: "Extremely critical! Showing unavailable rooms frustrates users. Overselling causes expensive guest relocations. Availability must be strongly consistent and real-time.",
      importance: 'critical',
      learningPoint: "Strong consistency required for inventory - eventual consistency not acceptable",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'search-hotels', 'booking-process', 'concurrent-booking'],
  criticalFRQuestionIds: ['core-functionality', 'search-hotels', 'booking-process'],
  criticalScaleQuestionIds: ['throughput-searches', 'latency-search', 'concurrent-booking'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can search hotels',
      description: 'Search by location, dates, guests, and filters',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can check availability',
      description: 'View real-time room availability and counts',
      emoji: '📅',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can make reservations',
      description: 'Book and pay for hotel rooms',
      emoji: '🏨',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can write reviews',
      description: 'Rate and review hotels after stays',
      emoji: '⭐',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can view pricing',
      description: 'See room rates with taxes and fees',
      emoji: '💰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million',
    writesPerDay: '1.5 million bookings',
    readsPerDay: '100 million searches',
    peakMultiplier: 3,
    readWriteRatio: '67:1',
    calculatedWriteRPS: { average: 17, peak: 51 },
    calculatedReadRPS: { average: 1157, peak: 3471 },
    maxPayloadSize: '~3KB (hotel metadata)',
    storagePerRecord: '~10KB (hotel with photos)',
    storageGrowthPerYear: '~5TB (new hotels + photos)',
    redirectLatencySLA: 'p99 < 500ms (search)',
    createLatencySLA: 'p99 < 3s (booking)',
  },

  architecturalImplications: [
    'Search-heavy (67:1) → Search engine with location/date indexing critical',
    '3,600 searches/sec peak → Aggressive caching for popular destinations',
    'Overselling prevention → Strong consistency + optimistic locking required',
    '2M hotels with photos → Object storage + CDN needed',
    'Real-time availability → Inventory service with fast lookups',
  ],

  outOfScope: [
    'Dynamic pricing (surge pricing)',
    'Multi-currency real-time exchange rates',
    'Virtual hotel tours / 360° photos',
    'Loyalty programs / rewards',
    'Hotel chain management',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search hotels and make bookings. The overselling problem and search optimization will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏨',
  scenario: "Welcome to Hospitality Tech! You've been hired to build the next Booking.com.",
  hook: "Your first traveler wants to search for hotels in Paris!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your booking platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search for hotels yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a **Client** connecting to a **Server**.

When a user opens the Booking.com app or website:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t interact with your platform at all.',

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Handling 100 million searches per day',
    howTheyDoIt: 'Started with a simple Perl server in 1996, now uses a complex microservices architecture',
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
  id: 'bookingcom-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Booking.com', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles search, booking, and availability', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle hotels yet!",
  hook: "A user tried to search for 'Hotels in Paris' but got an error.",
  challenge: "Write the Python code to search hotels, check availability, and make reservations.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle bookings!',
  achievement: 'You implemented the core Booking.com functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can search hotels', after: '✓' },
    { label: 'Can check availability', after: '✓' },
    { label: 'Can make reservations', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all bookings are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Core Booking Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Booking.com, we need handlers for:
- \`search_hotels(location, dates, guests)\` - Find available hotels
- \`check_availability(hotel_id, dates, room_type)\` - Check room inventory
- \`make_reservation(hotel_id, room_type, dates, payment)\` - Create booking

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'Booking.com\'s First Hotel',
    company: 'Booking.com',
    year: '1996',
    whatHappened: 'Started as a small Dutch startup called Bookings.nl with just a handful of Amsterdam hotels. First booking: a simple form submission that was manually processed.',
    lessonLearned: 'Start simple! The basic booking flow hasn\'t changed - search, check availability, book, pay.',
    icon: '🏨',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Processing 1.5 million bookings per day',
    howTheyDoIt: 'Their Reservation Service uses distributed locks to prevent overselling and ensure inventory accuracy',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (hotel not found, room unavailable, etc.)',
    'Check availability BEFORE accepting reservation',
  ],

  quickCheck: {
    question: 'Why do we check availability in the reservation handler?',
    options: [
      'To calculate the price',
      'To prevent overselling rooms',
      'To send confirmation email',
      'To update the calendar',
    ],
    correctIndex: 1,
    explanation: 'Must verify rooms are available before accepting payment - prevents overselling!',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Availability Check', explanation: 'Verify rooms before booking', icon: '📅' },
  ],
};

const step2: GuidedStep = {
  id: 'bookingcom-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search hotels, FR-2: Check availability, FR-3: Make reservations',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/search, GET /api/v1/availability, POST /api/v1/reservations APIs',
      'Open the Python tab',
      'Implement search_hotels(), check_availability(), and make_reservation() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for search, availability, and reservations',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/search', 'GET /api/v1/availability', 'POST /api/v1/reservations'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed overnight...",
  hook: "When it restarted, ALL reservations were GONE! 10,000 bookings, vanished. Guests are furious!",
  challenge: "Add a database so hotels, reservations, and availability data survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Hotels and reservations now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But search is getting slow as hotels grow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval

For Booking.com, we need tables for:
- \`hotels\` - Property details, location, star rating, amenities
- \`rooms\` - Room types, capacity, base price
- \`reservations\` - Bookings with dates and guest info
- \`reviews\` - Ratings and feedback
- \`inventory\` - Available room counts by date`,

  whyItMatters: 'Imagine losing all reservations because of a server restart. Hotels wouldn\'t get paid, guests would show up with no booking!',

  famousIncident: {
    title: 'Booking.com Database Outage',
    company: 'Booking.com',
    year: '2019',
    whatHappened: 'A database failure caused booking system to go down for 30 minutes. Lost an estimated $25M in bookings during the outage. Accelerated investment in redundancy.',
    lessonLearned: 'Data persistence AND redundancy are critical. Never rely on a single database instance.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Storing 2 million hotels with reservation data',
    howTheyDoIt: 'Uses MySQL with custom sharding by region for fast geo-queries and high availability',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (MySQL/PostgreSQL) for structured data with relationships',
    'Connect App Server to Database for read/write operations',
    'Use indexes for fast lookups (location, dates, hotel_id)',
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
  id: 'bookingcom-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store hotels, rooms, reservations, reviews, inventory', displayName: 'MySQL' },
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
    level1: 'Drag a Database (MySQL) component onto the canvas',
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
  scenario: "You now have 500,000 hotels, and search is loading in 4+ seconds!",
  hook: "Users are abandoning searches. 'Why is Booking.com so slow?' Every search hits the database.",
  challenge: "Add a cache to make searches lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search loads 40x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Search latency', before: '4000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "But as traffic grows, a single server can't handle it all...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Speed Multiplier',
  conceptExplanation: `A **cache** is fast, temporary storage that sits between your app and database.

Instead of:
\`\`\`
Request → Database (slow, 300ms)
\`\`\`

You get:
\`\`\`
Request → Cache (fast, 2ms) → Database (only if cache miss)
\`\`\`

For Booking.com, we cache:
- Popular search results (Paris hotels, NYC hotels)
- Hotel details (frequently viewed properties)
- Availability counts for upcoming dates`,

  whyItMatters: 'At 3,600 searches/sec peak, hitting the database for every request would overwhelm it. Caching is essential.',

  famousIncident: {
    title: 'Booking.com Black Friday Surge',
    company: 'Booking.com',
    year: '2018',
    whatHappened: 'Black Friday travel deals caused search traffic to spike 15x. Cache infrastructure prevented database overload. Without caching, the site would have crashed.',
    lessonLearned: 'Cache aggressively for popular destinations. Search patterns are highly repetitive.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Serving 100 million searches per day',
    howTheyDoIt: 'Uses Redis to cache search results by location and dates. Cache hit rate: 90%+',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (90% of searches)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Cache popular destinations (Paris, London, NYC)',
    'Set short TTL (10 min) for availability to stay fresh',
  ],

  quickCheck: {
    question: 'Why use a short TTL for availability data?',
    options: [
      'To save memory',
      'To keep availability counts fresh as bookings happen',
      'To reduce cache size',
      'To make it faster',
    ],
    correctIndex: 1,
    explanation: 'Availability changes with each booking. Short TTL ensures users don\'t see stale room counts.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'bookingcom-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search hotels (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache search results and hotel details', displayName: 'Redis Cache' },
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
  scenario: "Your single app server is maxed out at 100% CPU!",
  hook: "Holiday travel season caused traffic to spike 7x. One server can't handle it all.",
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

  whyItMatters: 'At peak, Booking.com handles 3,600 searches/second. No single server can handle that alone.',

  famousIncident: {
    title: 'Booking.com Olympics Surge',
    company: 'Booking.com',
    year: '2016',
    whatHappened: 'Rio Olympics caused hotel searches in Brazil to spike 200x. Load balancers automatically distributed traffic across servers, preventing a crash.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes.',
    icon: '🏅',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Handling 3,600 searches/second at peak',
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
  id: 'bookingcom-step-5',
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
  scenario: "Your database crashed for 15 minutes this morning. EVERYTHING stopped.",
  hook: "Users couldn't search, book, or do anything. Revenue loss: $300,000 in 15 minutes!",
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
- **Primary (Leader)**: Handles all writes (reservations)
- **Replicas (Followers)**: Handle reads (searches), stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your data`,

  whyItMatters: 'A single database is a single point of failure. For Booking.com\'s 1.5M bookings/day, downtime means lost revenue.',

  famousIncident: {
    title: 'Booking.com Database Failover',
    company: 'Booking.com',
    year: '2020',
    whatHappened: 'A primary database server had a hardware failure. Thanks to replication, they failed over to a replica in 20 seconds. Only lost 3 bookings instead of thousands.',
    lessonLearned: 'Replication saved the day. Test your failover process regularly.',
    icon: '🔧',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Zero tolerance for booking data loss',
    howTheyDoIt: 'Uses MySQL with 5-way replication across availability zones',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │  Reservations    │
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
    question: 'Why route searches to replicas but reservations to primary?',
    options: [
      'Replicas are faster',
      'Reservations need strong consistency (write to primary)',
      'Replicas are cheaper',
      'Primary is too busy',
    ],
    correctIndex: 1,
    explanation: 'Reservations must be consistent (no overselling), so they go to primary. Searches can use replicas.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'bookingcom-step-6',
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
  scenario: "Traffic has grown 12x. One app server can't keep up!",
  hook: "Users are getting timeouts. Your load balancer has nowhere to route traffic.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle 12x the traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '5+' },
    { label: 'Search capacity', before: '300 req/s', after: '3600+ req/s' },
  ],
  nextTeaser: "But location-based hotel search is still slow...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Booking.com:
- Start with 5-8 app server instances
- Scale up during peak travel seasons
- Scale down during quiet periods`,

  whyItMatters: 'At 3,600 searches/second, you need 8+ app servers just for search queries.',

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Handling global traffic',
    howTheyDoIt: 'Runs thousands of app server instances across multiple regions. Auto-scales based on traffic.',
  },

  famousIncident: {
    title: 'Booking.com Holiday Surge',
    company: 'Booking.com',
    year: '2019',
    whatHappened: 'Christmas holiday season caused bookings to spike 400%. Auto-scaling kicked in, adding 100+ servers in minutes. Site stayed up!',
    lessonLearned: 'Design for horizontal scaling from day 1. It\'s harder to add later.',
    icon: '🎄',
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
  id: 'bookingcom-step-7',
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
// STEP 8: Add Search Engine (Elasticsearch for Geo-Search)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users are complaining: 'Search doesn\'t find hotels near me!'",
  hook: "Database geo-queries are slow and inaccurate. 'Hotels in Paris' returns results from Lyon!",
  challenge: "Add Elasticsearch for fast, accurate geo-spatial search.",
  illustration: 'map-search',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Geo-search is blazing fast!',
  achievement: 'Location-based search with filters in under 150ms',
  metrics: [
    { label: 'Search latency', before: '1200ms', after: '<150ms' },
    { label: 'Location accuracy', after: '99%' },
    { label: 'Can search', after: '2M hotels by location' },
  ],
  nextTeaser: "But hotel photos are loading slowly...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Geo-Spatial Search: Finding Nearby Hotels',
  conceptExplanation: `Regular databases are terrible at geo-queries like "find hotels within 10 km of Eiffel Tower."

**Elasticsearch** with geo-spatial indexing:
- Indexes hotels by latitude/longitude
- Supports radius search ("within 10 km")
- Supports bounding box search (map view)
- Combines location with filters (star rating, amenities, price)
- Returns results ranked by distance and relevance

Architecture:
- When a hotel is added, index it in Elasticsearch
- Search queries go to Elasticsearch with geo-filters
- Return results sorted by distance + ranking`,

  whyItMatters: 'Booking.com is fundamentally about location. Without fast geo-search, users can\'t find hotels.',

  famousIncident: {
    title: 'Booking.com Search Migration',
    company: 'Booking.com',
    year: '2015',
    whatHappened: 'Original MySQL-based search was slow (3-4 seconds) and couldn\'t handle complex location filters. Rebuilt with Elasticsearch, reducing search to <200ms.',
    lessonLearned: 'Use specialized tools for specialized problems. Databases aren\'t built for geo-search.',
    icon: '🗺️',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Searching 2 million hotels by location',
    howTheyDoIt: 'Uses Elasticsearch with geo_point fields. Combines location, dates, price, star rating in one query.',
  },

  diagram: `
User: "Hotels in Paris, 4-star, pool, $100-200"
      │
      ▼
┌──────────────┐     ┌────────────────────────────────┐
│  App Server  │────▶│      Elasticsearch             │
└──────────────┘     │  Geo-spatial + text search     │
                     │  ┌──────────────────────────┐  │
                     │  │ Filters:                 │  │
                     │  │ - Location: Paris (geo)  │  │
                     │  │ - Dates: Available       │  │
                     │  │ - Star rating: 4         │  │
                     │  │ - Amenities: pool        │  │
                     │  │ - Price: $100-200        │  │
                     │  └──────────────────────────┘  │
                     └────────────┬───────────────────┘
                                  │
                                  ▼
                        Return 100 hotels in 120ms
`,

  keyPoints: [
    'Elasticsearch is optimized for geo-spatial search',
    'Index hotels with lat/lon coordinates',
    'Support radius search and bounding box queries',
    'Combine location with text filters (amenities, price, stars)',
    'Database remains source of truth for reservations',
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
    { title: 'Radius Search', explanation: 'Find points within X km', icon: '⭕' },
    { title: 'Bounding Box', explanation: 'Find points in map rectangle', icon: '🗺️' },
  ],
};

const step8: GuidedStep = {
  id: 'bookingcom-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search hotels (now with geo-spatial search)',
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
    level2: 'Connect App Server to Search. Hotels will be indexed with geo-coordinates.',
    solutionComponents: [{ type: 'search' }],
    solutionConnections: [{ from: 'app_server', to: 'search' }],
  },
};

// =============================================================================
// STEP 9: Add Object Storage + CDN for Photos
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📸',
  scenario: "Hotel photos are taking 6+ seconds to load!",
  hook: "Users are abandoning listings before photos load. Each hotel has 50-100 high-res photos (200MB total).",
  challenge: "Add object storage and CDN to serve photos fast, globally.",
  illustration: 'slow-images',
};

const step9Celebration: CelebrationContent = {
  emoji: '🖼️',
  message: 'Photos load instantly!',
  achievement: 'CDN delivers images in <150ms globally',
  metrics: [
    { label: 'Photo load time', before: '6000ms', after: '<150ms' },
    { label: 'Served from CDN', after: '97%' },
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
- Hotel uploads photo → Store in S3 → Return URL
- User views hotel → Photo served from nearest CDN edge
- CDN caches for 60 days → 97% cache hit rate`,

  whyItMatters: 'Photos are 70% of a hotel listing\'s appeal. Slow photos = lost bookings.',

  famousIncident: {
    title: 'Booking.com Photo Infrastructure',
    company: 'Booking.com',
    year: '2017',
    whatHappened: 'Realized photo load time directly correlated with conversion. Every 100ms of photo delay reduced bookings by 1%. Invested heavily in CDN and image optimization.',
    lessonLearned: 'Photos are the product. Optimize delivery aggressively.',
    icon: '📷',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Serving billions of photo views per day',
    howTheyDoIt: 'Uses S3 for storage, multi-CDN strategy (CloudFront + Akamai). Photos processed in multiple sizes.',
  },

  diagram: `
Hotel uploads photo
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
User views hotel     │      CDN       │
      │              │   (CloudFront) │
      │              │  Edge locations│
      │              │   worldwide    │
      └─────────────▶│                │
                     └────────────────┘
                     <150ms globally!
`,

  keyPoints: [
    'Use Object Storage (S3) for photos - much cheaper than DB',
    'CDN caches photos at edge locations near users',
    'Store only photo URLs in database, not actual files',
    'Process photos in multiple sizes (thumbnail, medium, full)',
    'Set long cache TTL (60 days) - photos rarely change',
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
  id: 'bookingcom-step-9',
  stepNumber: 9,
  frIndex: 2,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from fast photo delivery',
    taskDescription: 'Add Object Storage and CDN for hotel photos',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store hotel photos cheaply', displayName: 'S3' },
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
  scenario: "Finance is alarmed! Your monthly cloud bill is $950,000.",
  hook: "The CFO says: 'Cut costs by 35% or we're raising prices (and losing customers).'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Booking.com!',
  achievement: 'A scalable, cost-effective hotel booking platform',
  metrics: [
    { label: 'Monthly cost', before: '$950K', after: 'Under budget' },
    { label: 'Search latency', after: '<500ms' },
    { label: 'Booking latency', after: '<3s' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '3,600 searches/sec' },
  ],
  nextTeaser: "You've mastered Booking.com system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use CDN aggressively** - Reduce origin requests by 97%
3. **Optimize storage tiers** - Move old photos to Glacier (90% cheaper)
4. **Cache effectively** - Reduce database queries
5. **Auto-scale** - Scale down during low traffic hours

For Booking.com:
- Archive old reservation data to cheaper storage
- Use smaller cache for less popular destinations
- Scale down at night (traffic drops 50%)
- Compress photos (40% size reduction)`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Booking.com\'s Cloud Optimization',
    company: 'Booking.com',
    year: '2020',
    whatHappened: 'Booking.com realized they were over-provisioned by 45% during COVID travel decline. Right-sized instances and optimized storage tiers. Saved $120M annually while improving performance.',
    lessonLearned: 'At scale, even small optimizations save millions. Monitor and optimize continuously.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Booking.com',
    scenario: 'Running at scale',
    howTheyDoIt: 'Aggressively optimizes infrastructure. Uses reserved instances (50% savings), auto-scaling, and tiered storage.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure - monitor usage',
    'Use auto-scaling to match demand',
    'Cache to reduce expensive operations',
    'Use storage tiers (hot/warm/cold) based on access patterns',
    'CDN reduces origin bandwidth costs by 95%+',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a search-heavy platform?',
    options: [
      'Use bigger servers',
      'Aggressive caching of search results and CDN for photos',
      'Delete old hotels',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Caching search results and using CDN for photos eliminates 90%+ of expensive requests.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Storage Tiers', explanation: 'Hot (S3) vs Cold (Glacier) storage', icon: '🗄️' },
  ],
};

const step10: GuidedStep = {
  id: 'bookingcom-step-10',
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
    level2: 'Consider: fewer replicas, smaller cache, right-sized instances. Keep 5 app servers. Use CDN to reduce costs.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const bookingcomGuidedTutorial: GuidedTutorial = {
  problemId: 'bookingcom',
  title: 'Design Booking.com',
  description: 'Build a hotel booking platform with search, availability, reservations, and reviews',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🏨',
    hook: "You've been hired as Lead Engineer at Hospitality Tech!",
    scenario: "Your mission: Build a Booking.com-like platform that can handle millions of hotel searches and reservations globally.",
    challenge: "Can you design a system that handles geo-spatial search and prevents overselling?",
  },

  requirementsPhase: bookingcomRequirementsPhase,

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

export default bookingcomGuidedTutorial;
