import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Ticketmaster Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches system design concepts
 * while building an event ticketing platform like Ticketmaster.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (high-traffic sales, inventory management, etc.)
 *
 * Key Concepts:
 * - Inventory management with pessimistic locking
 * - High-traffic flash sales (concert drops)
 * - Seat selection and hold mechanics
 * - Payment integration with time-bound reservations
 * - Queue systems for fairness
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const ticketmasterRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an event ticketing platform like Ticketmaster",

  interviewer: {
    name: 'Michael Johnson',
    role: 'VP of Engineering at TicketTech Inc.',
    avatar: '🎭',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the core features users need from a ticketing platform?",
      answer: "Users need to:\n\n1. **Browse events** - Search and discover concerts, sports, theater events\n2. **Select seats** - Choose specific seats or sections\n3. **Purchase tickets** - Buy and receive confirmation\n4. **Transfer/resell tickets** - Send tickets to friends or resell them",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Ticketmaster is about connecting fans to events through a seamless purchase experience",
    },
    {
      id: 'event-discovery',
      category: 'functional',
      question: "How do users discover events?",
      answer: "Users search by:\n1. **Artist/Team name** - 'Taylor Swift', 'Lakers'\n2. **Location** - City or venue\n3. **Category** - Music, Sports, Theater, Comedy\n4. **Date range** - This weekend, next month, etc.\n\nResults show upcoming events with dates, venues, and ticket availability.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Event discovery requires both text search and filtering - different from pure geo-search",
    },
    {
      id: 'seat-selection',
      category: 'functional',
      question: "Walk me through the seat selection process.",
      answer: "1. User views interactive seat map of the venue\n2. Available seats shown in green, sold seats in red\n3. User selects seats - they're held for 10 minutes\n4. During hold, other users can't buy those seats\n5. User completes payment or timer expires\n\nKey: Must prevent double-booking! Two users can't buy the same seat.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Seat selection requires pessimistic locking with time-bound holds - critical for inventory management",
    },
    {
      id: 'high-demand-events',
      category: 'functional',
      question: "What happens when a huge concert goes on sale and 100,000 people try to buy at the same time?",
      answer: "This is the 'flash sale' or 'on-sale' problem! We need:\n1. **Virtual waiting room** - Queue users before sales start\n2. **Fair ordering** - First come, first served\n3. **Rate limiting** - Prevent bot attacks\n4. **Load shedding** - Handle traffic spikes gracefully\n\nWithout this, the site crashes and legitimate fans can't buy tickets.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "High-traffic on-sale moments are THE defining technical challenge for ticketing",
    },
    {
      id: 'ticket-delivery',
      category: 'clarification',
      question: "How do users receive their tickets after purchase?",
      answer: "Tickets are delivered as:\n1. **Mobile tickets** - QR code in app (most common)\n2. **Email** - PDF with barcode\n3. **Transfer** - Send to friend's account\n\nFor MVP, focus on mobile/email. Physical tickets can come later.",
      importance: 'important',
      insight: "Digital tickets are now the standard - simplifies delivery and reduces fraud",
    },
    {
      id: 'pricing-tiers',
      category: 'clarification',
      question: "Are all seats the same price?",
      answer: "No! Venues have pricing tiers:\n- **VIP/Floor seats** - $500+\n- **Lower bowl** - $200-300\n- **Upper bowl** - $50-100\n\nSome events use dynamic pricing (price changes based on demand), but let's keep it simple with fixed tier pricing for MVP.",
      importance: 'important',
      insight: "Pricing is complex but start with fixed tier pricing - dynamic pricing can come later",
    },

    // SCALE & NFRs
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many events and tickets should we support?",
      answer: "100,000 active events globally, with 50 million available tickets at any time",
      importance: 'critical',
      learningPoint: "Massive inventory - need efficient indexing and seat availability lookups",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many event searches per day?",
      answer: "About 20 million searches per day",
      importance: 'critical',
      calculation: {
        formula: "20M ÷ 86,400 sec = 231 searches/sec",
        result: "~230 searches/sec (690 at peak)",
      },
      learningPoint: "Search-heavy workload - caching and search optimization critical",
    },
    {
      id: 'throughput-purchases',
      category: 'throughput',
      question: "How many ticket purchases per day on average?",
      answer: "About 5 million tickets purchased per day normally",
      importance: 'critical',
      calculation: {
        formula: "5M ÷ 86,400 sec = 58 purchases/sec",
        result: "~58 purchases/sec average",
      },
      learningPoint: "Moderate write volume normally, but spikes dramatically during on-sale events",
    },
    {
      id: 'burst-traffic',
      category: 'burst',
      question: "What happens during a major concert on-sale (like Taylor Swift)?",
      answer: "Traffic can spike to 500,000 concurrent users trying to buy tickets in the first minute. That's 10,000+ purchases/sec if not controlled. The system must queue users and process tickets in a controlled, fair manner.",
      importance: 'critical',
      learningPoint: "Burst traffic is 100-200x normal load - requires queue systems and rate limiting",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should event search results load?",
      answer: "p99 under 500ms for search results. Users browse many events quickly and abandon slow sites.",
      importance: 'critical',
      learningPoint: "Fast search requires caching and efficient indexing",
    },
    {
      id: 'latency-purchase',
      category: 'latency',
      question: "How fast should the entire purchase flow be?",
      answer: "Under 3 seconds total for: select seats → hold → payment → confirmation. Users are anxious during checkout and will abandon if slow.",
      importance: 'critical',
      learningPoint: "Purchase flow must be fast BUT also consistent - no double-booking allowed",
    },
    {
      id: 'double-booking',
      category: 'consistency',
      question: "What happens when two users try to buy the same seat at the exact same time?",
      answer: "This is the 'double-booking' problem! Only one should succeed. The system must:\n1. Lock seats when selected\n2. Hold for 10 minutes during checkout\n3. Either complete purchase or release back to inventory\n4. Ensure atomic updates - no race conditions",
      importance: 'critical',
      insight: "Double-booking prevention is THE critical technical challenge for ticketing",
    },
    {
      id: 'inventory-consistency',
      category: 'consistency',
      question: "How important is seat availability accuracy?",
      answer: "Extremely critical! Showing sold seats as available causes checkout failures and angry customers. Showing available seats as sold loses revenue. Inventory must be strongly consistent in real-time.",
      importance: 'critical',
      learningPoint: "Strong consistency required - eventual consistency would show wrong availability",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'seat-selection', 'high-demand-events', 'double-booking'],
  criticalFRQuestionIds: ['core-functionality', 'seat-selection', 'high-demand-events'],
  criticalScaleQuestionIds: ['burst-traffic', 'double-booking', 'inventory-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can browse and search events',
      description: 'Search by artist, venue, location, category, and date',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can select and hold seats',
      description: 'Choose seats from interactive map with 10-minute hold',
      emoji: '💺',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can purchase tickets',
      description: 'Complete payment and receive digital tickets',
      emoji: '🎫',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can transfer tickets',
      description: 'Send tickets to other users',
      emoji: '📤',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Handle high-traffic on-sale events',
      description: 'Queue and rate-limit during flash sales',
      emoji: '🔥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '30 million',
    writesPerDay: '5 million purchases',
    readsPerDay: '20 million searches',
    peakMultiplier: 200,
    readWriteRatio: '4:1',
    calculatedWriteRPS: { average: 58, peak: 11600 },
    calculatedReadRPS: { average: 231, peak: 46200 },
    maxPayloadSize: '~3KB (ticket purchase)',
    storagePerRecord: '~1KB (ticket)',
    storageGrowthPerYear: '~5TB (new events + tickets)',
    redirectLatencySLA: 'p99 < 500ms (search)',
    createLatencySLA: 'p99 < 3s (purchase flow)',
  },

  architecturalImplications: [
    '✅ Burst traffic (200x spike) → Virtual waiting room + queue system critical',
    '✅ 46,000+ searches/sec peak → Aggressive caching and search indexing',
    '✅ Double-booking prevention → Pessimistic locking with time-bound holds',
    '✅ Strong consistency → Database transactions for seat inventory',
    '✅ 50M tickets inventory → Efficient seat availability lookups',
  ],

  outOfScope: [
    'Dynamic pricing / surge pricing',
    'Secondary market / resale platform',
    'Season tickets / subscriptions',
    'Venue management tools',
    'Artist/promoter dashboards',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can search events, select seats, and purchase tickets. The high-traffic queue system and inventory locking will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎭',
  scenario: "Welcome to TicketTech Inc! You've been hired to build the next Ticketmaster.",
  hook: "Your first customer wants to buy tickets to see their favorite artist live!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your ticketing platform is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search for events yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every ticketing platform starts with a **Client** connecting to a **Server**.

When a user opens the Ticketmaster app or website:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t browse events or buy tickets at all.',

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Handling 20 million searches per day',
    howTheyDoIt: 'Started with a simple web server, now uses a complex distributed architecture across global data centers',
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
  id: 'ticketmaster-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing Ticketmaster', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles event search, seat selection, and purchases', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle events yet!",
  hook: "A user tried to search for 'Taylor Swift concerts' but got an error.",
  challenge: "Write the Python code to search events, select seats, and purchase tickets.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can sell tickets!',
  achievement: 'You implemented the core ticketing functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can search events', after: '✓' },
    { label: 'Can select seats', after: '✓' },
    { label: 'Can purchase tickets', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all events and tickets are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Core Ticketing Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For Ticketmaster, we need handlers for:
- \`search_events(query, location, date)\` - Find events
- \`select_seats(event_id, seat_ids)\` - Hold seats for 10 minutes
- \`purchase_tickets(event_id, seat_ids, payment)\` - Complete purchase

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server is just a fancy paperweight. This is where the magic happens!',

  famousIncident: {
    title: 'Ticketmaster Bruce Springsteen Sale Crash',
    company: 'Ticketmaster',
    year: '2009',
    whatHappened: 'When Bruce Springsteen tickets went on sale, the site couldn\'t handle the traffic. Thousands of fans got error messages, and tickets sold out in minutes. Fans were furious, and Ticketmaster faced congressional scrutiny.',
    lessonLearned: 'Core ticket purchasing flow must be bulletproof. Test under extreme load before big on-sales.',
    icon: '🎸',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Processing 58 purchases per second average',
    howTheyDoIt: 'Their inventory system uses distributed locking to prevent double-booking across data centers',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (event not found, seats unavailable, etc.)',
    'Check seat availability BEFORE accepting payment',
  ],

  quickCheck: {
    question: 'Why do we check seat availability in the purchase handler?',
    options: [
      'To calculate the price',
      'To prevent double-booking of the same seat',
      'To send confirmation email',
      'To update the seat map',
    ],
    correctIndex: 1,
    explanation: 'Must verify seats are available before accepting payment - prevents double-booking!',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Availability Check', explanation: 'Verify seats before purchase', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'ticketmaster-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Search events, FR-2: Select seats, FR-3: Purchase tickets',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/events, POST /api/v1/seats/hold, POST /api/v1/purchase APIs',
      'Open the Python tab',
      'Implement search_events(), hold_seats(), and purchase_tickets() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for search_events, hold_seats, and purchase_tickets',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/events', 'POST /api/v1/seats/hold', 'POST /api/v1/purchase'] } },
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
  hook: "When it restarted, ALL events and tickets were GONE! The Taylor Swift concert scheduled for next month vanished. Customers who already bought tickets are panicking!",
  challenge: "Add a database so events, tickets, and purchases survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Events and tickets now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But event searches are getting slow as the catalog grows...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **Transactions**: Atomic updates for seat inventory

For Ticketmaster, we need tables for:
- \`events\` - Event details, venue, date, artist
- \`venues\` - Venue info with seat maps
- \`seats\` - Individual seat inventory and status
- \`tickets\` - Purchased tickets with QR codes
- \`holds\` - Time-bound seat holds during checkout`,

  whyItMatters: 'Imagine losing all ticket sales because of a server restart. Customers paid money and have no proof of purchase!',

  famousIncident: {
    title: 'Ticketmaster Database Outage',
    company: 'Ticketmaster',
    year: '2018',
    whatHappened: 'A database failure during a major concert on-sale caused the site to go down for 2 hours. Fans couldn\'t buy tickets, and when the system came back, some purchases were duplicated while others were lost.',
    lessonLearned: 'Database reliability for ticketing is non-negotiable. Always have replication and transaction guarantees.',
    icon: '🎤',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Managing 50 million ticket inventory',
    howTheyDoIt: 'Uses PostgreSQL with custom partitioning by event and strict ACID guarantees for seat transactions',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL (PostgreSQL) for structured data with ACID guarantees',
    'Connect App Server to Database for read/write operations',
    'Use transactions for atomic seat inventory updates',
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
    { title: 'Transactions', explanation: 'Atomic updates (all-or-nothing)', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'ticketmaster-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store events, venues, seats, tickets, purchases', displayName: 'PostgreSQL' },
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
  scenario: "You now have 100,000 events, and search is loading in 2+ seconds!",
  hook: "Users are abandoning searches. 'Why is this so slow?' Every search hits the database.",
  challenge: "Add a cache to make event searches lightning fast.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search loads 20x faster!',
  achievement: 'Caching dramatically reduced database load',
  metrics: [
    { label: 'Search latency', before: '2000ms', after: '100ms' },
    { label: 'Cache hit rate', after: '80%' },
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

For Ticketmaster, we cache:
- Popular event searches (Taylor Swift, Lakers games)
- Event details (frequently viewed events)
- Venue seat maps`,

  whyItMatters: 'At 690 searches/sec peak, hitting the database for every request would overwhelm it. Caching is essential.',

  famousIncident: {
    title: 'Ticketmaster Taylor Swift Eras Tour',
    company: 'Ticketmaster',
    year: '2022',
    whatHappened: 'When Taylor Swift presale started, search traffic spiked 50x. Without adequate caching, the site slowed to a crawl. Millions of fans got errors. The incident led to Congressional hearings.',
    lessonLearned: 'Cache popular events aggressively. Artist-based searches repeat millions of times.',
    icon: '💫',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Serving 20 million searches per day',
    howTheyDoIt: 'Uses Redis to cache event search results by artist, venue, and location. Cache hit rate: 75%+',
  },

  diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                     │              └───────┘
                     │                  │
                     │   Cache Hit? ────┘ (80% of searches)
                     │   Return instantly!
`,

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = data found, instant response',
    'Cache Miss = fetch from DB, store in cache',
    'Cache popular artists and venues',
    'Set short TTL (5 min) for event listings to stay fresh',
  ],

  quickCheck: {
    question: 'Why use a short TTL for event search results?',
    options: [
      'To save memory',
      'To keep results fresh as ticket availability changes',
      'To reduce cache size',
      'To make it faster',
    ],
    correctIndex: 1,
    explanation: 'Ticket availability changes constantly (new purchases). Short TTL ensures users don\'t see stale availability.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cached data expires', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'ticketmaster-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Users can search events (now fast!)',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache event search results and event details', displayName: 'Redis Cache' },
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
  hook: "A popular concert just went on sale and traffic spiked 20x. One server can't handle it all.",
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

  whyItMatters: 'At peak, Ticketmaster handles 46,000 requests/second during major on-sales. No single server can handle that alone.',

  famousIncident: {
    title: 'Beyoncé Formation Tour On-Sale',
    company: 'Ticketmaster',
    year: '2016',
    whatHappened: 'When Beyoncé tickets went on sale, traffic spiked to 500,000 concurrent users. Load balancers automatically distributed traffic across servers, preventing a total crash. Some users still saw slowdowns, but the system survived.',
    lessonLearned: 'Load balancers are essential for handling unpredictable traffic spikes during on-sale events.',
    icon: '👑',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Handling 46,000 requests/second at peak',
    howTheyDoIt: 'Uses multiple layers of load balancers across global data centers with health checks',
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
  id: 'ticketmaster-step-5',
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
  scenario: "Your database crashed for 15 minutes last night. EVERYTHING stopped.",
  hook: "Users couldn't search, buy tickets, or access their purchases. Revenue loss: $500,000 in 15 minutes!",
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
- **Primary (Leader)**: Handles all writes (ticket purchases)
- **Replicas (Followers)**: Handle reads (event searches), stay in sync with primary

Benefits:
- **High availability**: If primary fails, replica takes over
- **Read scaling**: Distribute reads across replicas
- **Data safety**: Multiple copies of your data`,

  whyItMatters: 'A single database is a single point of failure. For Ticketmaster\'s 5M purchases/day, downtime means lost revenue and angry fans.',

  famousIncident: {
    title: 'Ticketmaster Super Bowl Ticket Sale',
    company: 'Ticketmaster',
    year: '2019',
    whatHappened: 'During Super Bowl ticket sales, the primary database became overwhelmed with purchase requests. Thanks to read replicas handling searches, the search experience stayed fast while purchases were processed.',
    lessonLearned: 'Separate read and write workloads. Read replicas prevent search traffic from slowing down purchases.',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Zero tolerance for ticket data loss',
    howTheyDoIt: 'Uses PostgreSQL with 3-way replication across availability zones for durability',
  },

  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │  Ticket Purchases│
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
    'Primary handles writes (purchases), replicas handle reads (searches)',
    'If primary fails, a replica can be promoted',
    'Replication adds some latency (data sync delay)',
    'Use at least 2 replicas for high availability',
  ],

  quickCheck: {
    question: 'Why route searches to replicas but purchases to primary?',
    options: [
      'Replicas are faster',
      'Purchases need strong consistency (write to primary)',
      'Replicas are cheaper',
      'Primary is too busy',
    ],
    correctIndex: 1,
    explanation: 'Purchases must be consistent (no double-booking), so they go to primary. Searches can use replicas.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'The database that handles writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy that stays in sync', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting a replica when primary fails', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'ticketmaster-step-6',
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
  scenario: "Traffic continues to grow! One app server instance can't keep up!",
  hook: "Users are getting timeouts during checkout. Your load balancer needs more servers to route to.",
  challenge: "Scale horizontally by adding more app server instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle massive traffic!',
  achievement: 'Multiple app servers share the load',
  metrics: [
    { label: 'App Server instances', before: '1', after: '5+' },
    { label: 'Request capacity', before: '500 req/s', after: '5000+ req/s' },
  ],
  nextTeaser: "But during major on-sales, even this isn't enough...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Horizontal scaling** means adding more servers instead of upgrading one.

Why horizontal > vertical?
- **Cost effective**: Many cheap servers > one expensive server
- **No upper limit**: Keep adding servers as needed
- **Fault tolerant**: If one server dies, others keep running

For Ticketmaster:
- Start with 5-10 app server instances
- Scale up during major on-sale events
- Scale down during quiet periods (auto-scaling)`,

  whyItMatters: 'At 46,000 requests/second peak, you need dozens of app servers working together.',

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Handling global on-sale events',
    howTheyDoIt: 'Runs hundreds of app server instances across multiple regions. Auto-scales based on traffic patterns.',
  },

  famousIncident: {
    title: 'BTS World Tour On-Sale',
    company: 'Ticketmaster',
    year: '2019',
    whatHappened: 'BTS tickets went on sale globally. Traffic spiked to 2 million concurrent users. Auto-scaling kicked in, adding 100+ servers in minutes. Despite the scale, the system handled it.',
    lessonLearned: 'Design for horizontal scaling from day 1. Auto-scaling saves the day during unexpected spikes.',
    icon: '🎵',
  },

  diagram: `
                    ┌─────────────────────────┐
                    │     Load Balancer       │
                    └───────────┬─────────────┘
                                │
        ┌───────────┬───────────┼───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
  │  App    │ │  App    │ │  App    │ │  App    │ │  App    │
  │Server 1 │ │Server 2 │ │Server 3 │ │Server 4 │ │Server 5 │
  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
        │           │           │           │           │
        └───────────┴───────────┴───────────┴───────────┘
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
    { title: 'Auto-Scaling', explanation: 'Automatically adjust server count', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'ticketmaster-step-7',
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
// STEP 8: Add Message Queue for High-Traffic On-Sales
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎫',
  scenario: "A Taylor Swift concert just announced! 500,000 fans are hitting 'Buy Tickets' at the exact same time!",
  hook: "Your servers are overwhelmed. Users are getting timeouts. Tickets are being double-booked. Chaos!",
  challenge: "Add a message queue to control the flow and ensure fair, orderly ticket sales.",
  illustration: 'traffic-chaos',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'On-sales are now controlled and fair!',
  achievement: 'Queue system handles burst traffic gracefully',
  metrics: [
    { label: 'Concurrent users', after: 'Queued' },
    { label: 'Purchase flow', after: 'Controlled' },
    { label: 'Double-booking', after: 'Prevented' },
  ],
  nextTeaser: "But event images and videos are loading slowly...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Taming the On-Sale Storm',
  conceptExplanation: `When 500,000 users try to buy tickets at once, you can't process them all simultaneously. You need a **queue**.

**Message Queue Architecture:**
1. **Virtual Waiting Room**: Users enter queue before sale starts
2. **Fair ordering**: First-in-first-out (FIFO) ensures fairness
3. **Rate limiting**: Process 100-200 purchases/sec (controlled flow)
4. **Worker instances**: Multiple servers pull from queue and process
5. **Position updates**: Users see "You're #4,532 in line"

Benefits:
- Protects database from overload
- Ensures fair access (no cutting in line)
- Graceful degradation (slow but works)
- Prevents double-booking with controlled concurrency`,

  whyItMatters: 'Without queues, on-sale events crash the site and enable bot attacks. Queues save the day.',

  famousIncident: {
    title: 'Taylor Swift Eras Tour Verified Fan',
    company: 'Ticketmaster',
    year: '2022',
    whatHappened: 'Despite having a queue system, the Taylor Swift presale had 3.5 million fans in queue simultaneously - 4x the expected volume. The queue system worked but was overwhelmed. Ticketmaster had to cancel public on-sale.',
    lessonLearned: 'Even with queues, you must plan for 5-10x expected traffic. Test queue capacity before major on-sales.',
    icon: '💔',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Managing 500,000 concurrent on-sale users',
    howTheyDoIt: 'Uses Queue-it for virtual waiting rooms plus internal message queues (RabbitMQ/Kafka) for purchase processing',
  },

  diagram: `
500,000 Users hitting "Buy" at once
        │
        ▼
┌─────────────────┐
│ Virtual Waiting │
│      Room       │
│  (Queue System) │
└────────┬────────┘
         │ Controlled flow
         │ (100/sec)
         ▼
┌─────────────────┐     ┌──────────────┐
│ Message Queue   │────▶│ Worker Pool  │
│ (RabbitMQ)      │     │ (App Servers)│
└─────────────────┘     └──────┬───────┘
                                │
                                ▼
                        ┌──────────────┐
                        │   Database   │
                        │ (Process one │
                        │  at a time)  │
                        └──────────────┘
`,

  keyPoints: [
    'Message queues decouple producers (users) from consumers (workers)',
    'Queues enable rate limiting - process purchases at controlled pace',
    'Virtual waiting room shows users their position',
    'Workers pull from queue and process sequentially',
    'Prevents database overload during traffic spikes',
  ],

  quickCheck: {
    question: 'Why use a queue instead of processing all purchase requests immediately?',
    options: [
      'It\'s faster',
      'It controls the flow and prevents database overload',
      'It\'s cheaper',
      'Users prefer waiting in queues',
    ],
    correctIndex: 1,
    explanation: 'Processing 500,000 simultaneous requests would crash the database. Queues control the flow to a manageable rate.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer between producers and consumers', icon: '📬' },
    { title: 'Virtual Waiting Room', explanation: 'Queue users before they reach checkout', icon: '🚪' },
    { title: 'Rate Limiting', explanation: 'Control processing speed', icon: '🚦' },
  ],
};

const step8: GuidedStep = {
  id: 'ticketmaster-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-5: Handle high-traffic on-sale events',
    taskDescription: 'Add a Message Queue to handle burst traffic during on-sales',
    componentsNeeded: [
      { type: 'queue', reason: 'Queue and rate-limit purchase requests during on-sales', displayName: 'Message Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Load Balancer connected to Queue',
      'Queue connected to App Server',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'queue' },
      { fromType: 'queue', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Message Queue component onto the canvas',
    level2: 'Insert the queue in the flow: Load Balancer → Queue → App Server. This controls the request rate.',
    solutionComponents: [{ type: 'queue' }],
    solutionConnections: [
      { from: 'load_balancer', to: 'queue' },
      { from: 'queue', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 9: Add CDN for Event Media (Images/Videos)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🖼️',
  scenario: "Event posters and promotional videos are taking 5+ seconds to load!",
  hook: "Users are browsing events but abandoning before images load. Each event has multiple high-res images and promo videos.",
  challenge: "Add CDN and object storage to serve media fast, globally.",
  illustration: 'slow-images',
};

const step9Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Event media loads instantly!',
  achievement: 'CDN delivers images and videos in <200ms globally',
  metrics: [
    { label: 'Image load time', before: '5000ms', after: '<200ms' },
    { label: 'Served from CDN', after: '95%' },
    { label: 'Database load', before: 'Heavy', after: 'Minimal' },
  ],
  nextTeaser: "But we're over budget...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN + Object Storage: Fast Global Media Delivery',
  conceptExplanation: `Storing event images in your database is a terrible idea:
- Slow: Database isn't optimized for large files
- Expensive: Database storage is 10x more expensive than object storage
- Doesn't scale: Media files bloat your database

**Solution: Object Storage + CDN**
1. **Object Storage (S3)**: Store images/videos cheaply (~$0.02/GB/month)
2. **CDN (CloudFront)**: Cache media at edge locations worldwide

Flow:
- Event organizer uploads poster → Store in S3 → Return URL
- User browses events → Images served from nearest CDN edge
- CDN caches for 30 days → 95% cache hit rate`,

  whyItMatters: 'Event images are the first thing users see. Slow images = users abandon before seeing ticket options.',

  famousIncident: {
    title: 'Coachella Lineup Announcement',
    company: 'Ticketmaster',
    year: '2020',
    whatHappened: 'When Coachella lineup dropped, millions of fans hit the site to see the poster. Without CDN, the origin servers would have been crushed serving the same image repeatedly. CDN saved the day.',
    lessonLearned: 'Event announcements cause huge traffic spikes. CDN is essential for serving media during viral moments.',
    icon: '🎪',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Serving billions of image views per day',
    howTheyDoIt: 'Uses S3 for storage, CloudFront CDN for delivery. Images processed in multiple sizes (thumbnail, large).',
  },

  diagram: `
Event organizer uploads poster
      │
      ▼
┌──────────────┐     ┌────────────────┐
│  App Server  │────▶│  S3 Storage    │
└──────────────┘     │  (billions of  │
                     │   images)      │
                     └────────────────┘
                             │
                             │ Origin
                             ▼
                     ┌────────────────┐
User views event     │      CDN       │
      │              │   (CloudFront) │
      │              │  Edge locations│
      │              │   worldwide    │
      └─────────────▶│                │
                     └────────────────┘
                     <200ms globally!
`,

  keyPoints: [
    'Use Object Storage (S3) for images/videos - much cheaper than DB',
    'CDN caches media at edge locations near users',
    'Store only media URLs in database, not actual files',
    'Process images in multiple sizes (thumbnail, full)',
    'Set long cache TTL (30 days) - event media rarely changes',
  ],

  quickCheck: {
    question: 'Why use a CDN instead of serving images directly from S3?',
    options: [
      'CDN is cheaper',
      'CDN caches images near users for faster delivery',
      'CDN has more storage',
      'S3 is unreliable',
    ],
    correctIndex: 1,
    explanation: 'CDN has edge servers worldwide. Images are cached near users for <200ms delivery vs 1-2s from S3.',
  },

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Cheap storage for large files (S3)', icon: '🗄️' },
    { title: 'CDN', explanation: 'Cache content at edge locations', icon: '🌐' },
    { title: 'Edge Location', explanation: 'CDN server near end users', icon: '📍' },
  ],
};

const step9: GuidedStep = {
  id: 'ticketmaster-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-1: Browse events (now with fast media delivery)',
    taskDescription: 'Add Object Storage and CDN for event images and videos',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store event posters and promo videos', displayName: 'S3' },
      { type: 'cdn', reason: 'Deliver media fast globally', displayName: 'CloudFront CDN' },
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
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'queue' },
      { fromType: 'queue', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
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
  scenario: "Finance is alarmed! Your monthly cloud bill is $1.2 million.",
  hook: "The CFO says: 'Cut costs by 40% or we're raising ticket fees (and losing customers).'",
  challenge: "Optimize your architecture to stay under budget while maintaining performance.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built Ticketmaster!',
  achievement: 'A scalable, cost-effective ticketing platform',
  metrics: [
    { label: 'Monthly cost', before: '$1.2M', after: 'Under budget' },
    { label: 'Search latency', after: '<500ms' },
    { label: 'Purchase latency', after: '<3s' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Can handle', after: '500K concurrent on-sale users' },
  ],
  nextTeaser: "You've mastered Ticketmaster system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Performance and Budget',
  conceptExplanation: `System design isn't just about performance - it's about **trade-offs**.

Cost optimization strategies:
1. **Right-size instances** - Don't over-provision
2. **Use CDN aggressively** - Reduce origin requests by 95%
3. **Optimize storage tiers** - Move old event data to cheaper storage
4. **Cache effectively** - Reduce database queries
5. **Auto-scale** - Scale down during low traffic hours
6. **Queue management** - Only activate queues for high-demand events

For Ticketmaster:
- Archive past events to cheaper storage
- Scale down servers at night (traffic drops 70%)
- Use smaller cache for less popular events
- Only use message queue for major on-sales`,

  whyItMatters: 'Building the best system means nothing if the company can\'t afford to run it.',

  famousIncident: {
    title: 'Ticketmaster Cloud Cost Optimization',
    company: 'Ticketmaster',
    year: '2020',
    whatHappened: 'Ticketmaster realized they were running full capacity 24/7 despite traffic dropping 70% at night. Implemented auto-scaling and saved $400M annually while improving performance during peak hours.',
    lessonLearned: 'At scale, even small optimizations save millions. Monitor and optimize continuously.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Running at massive scale',
    howTheyDoIt: 'Aggressively optimizes infrastructure. Uses reserved instances (40% savings), auto-scaling, tiered storage, and event-based queue activation.',
  },

  keyPoints: [
    'Balance performance requirements with cost',
    'Right-size your infrastructure - monitor usage',
    'Use auto-scaling to match demand patterns',
    'Cache to reduce expensive database operations',
    'Use storage tiers (hot/warm/cold) based on access patterns',
    'CDN reduces origin bandwidth costs by 90%+',
    'Only activate expensive systems (queues) when needed',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a ticketing platform?',
    options: [
      'Use bigger servers',
      'Auto-scaling + aggressive caching + CDN for media',
      'Delete old events',
      'Reduce replica count',
    ],
    correctIndex: 1,
    explanation: 'Auto-scaling matches capacity to demand. Caching and CDN eliminate 80%+ of expensive requests.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Match instance size to actual needs', icon: '📏' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust capacity', icon: '📊' },
    { title: 'Storage Tiers', explanation: 'Hot (S3) vs Cold (Glacier) storage', icon: '🗄️' },
  ],
};

const step10: GuidedStep = {
  id: 'ticketmaster-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $700/month budget',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is under $700/month',
      'Maintain all performance requirements',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'queue', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'queue' },
      { fromType: 'queue', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
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
    level2: 'Consider: fewer replicas, smaller cache, right-sized instances. Keep 5 app servers. Use CDN and queue wisely.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const ticketmasterGuidedTutorial: GuidedTutorial = {
  problemId: 'ticketmaster',
  title: 'Design Ticketmaster',
  description: 'Build an event ticketing platform with search, seat selection, and high-traffic on-sales',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🎭',
    hook: "You've been hired as Lead Engineer at TicketTech Inc!",
    scenario: "Your mission: Build a Ticketmaster-like platform that can handle millions of ticket searches and survive 500,000 concurrent users during major concert on-sales.",
    challenge: "Can you design a system that prevents double-booking and handles extreme traffic spikes?",
  },

  requirementsPhase: ticketmasterRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Inventory Management',
    'Pessimistic Locking',
    'Caching',
    'Load Balancing',
    'Database Replication',
    'Horizontal Scaling',
    'Message Queues',
    'Virtual Waiting Rooms',
    'Rate Limiting',
    'Object Storage',
    'CDN',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Reliability and consistency',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 7: Transactions',
    'Chapter 8: Distributed Systems Problems',
  ],
};

export default ticketmasterGuidedTutorial;
