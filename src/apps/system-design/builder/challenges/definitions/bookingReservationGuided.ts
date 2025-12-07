import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Booking Reservation Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches system design concepts
 * while building a booking reservation system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working reservation system
 * Steps 4-6: Add inventory locking, waitlists, and dynamic pricing
 *
 * Key Concepts:
 * - Availability checking and inventory management
 * - Preventing overbooking with locking mechanisms
 * - Cancellation and refund handling
 * - Waitlist management
 * - Dynamic pricing strategies
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const bookingReservationRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a booking reservation system",

  interviewer: {
    name: 'Emily Roberts',
    role: 'Senior Staff Engineer at ReserveTech',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the core features needed for a booking reservation system?",
      answer: "Users need to:\n\n1. **Check availability** - View available slots/resources\n2. **Make reservations** - Book a resource for a specific time\n3. **Cancel reservations** - Cancel and potentially get refunds\n4. **View bookings** - See their current and past reservations",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Reservation systems must balance availability, booking, and cancellation",
    },
    {
      id: 'availability-check',
      category: 'functional',
      question: "How does availability checking work? What information is needed?",
      answer: "To check availability, we need:\n1. **Resource type** - What is being booked (room, table, seat, etc.)\n2. **Date/Time** - When the user wants to book\n3. **Duration** - How long they need it\n4. **Quantity** - How many units they need\n\nSystem returns available slots with real-time counts.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Availability is the foundation - must be accurate and real-time",
    },
    {
      id: 'overbooking-prevention',
      category: 'functional',
      question: "What happens when multiple users try to book the same last slot simultaneously?",
      answer: "This is the classic 'overbooking' problem! Solutions:\n1. **Pessimistic locking** - Lock the slot during checkout (slow but safe)\n2. **Optimistic locking** - Check version before confirming (fast but retries)\n3. **Queue system** - First-come-first-served with holds\n\nKey: Only ONE user should successfully book the last slot. Others must be rejected gracefully.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Preventing overbooking is THE critical technical challenge",
    },
    {
      id: 'cancellation-policy',
      category: 'functional',
      question: "How do cancellations work? Are there different policies?",
      answer: "Cancellation policies vary:\n1. **Free cancellation** - Full refund if canceled before deadline\n2. **Partial refund** - Percentage based on time before booking\n3. **Non-refundable** - No refund but may release inventory\n\nFor MVP, support free cancellation up to 24 hours before booking time.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Cancellations affect both inventory and payments",
    },
    {
      id: 'payment-handling',
      category: 'functional',
      question: "When and how is payment processed?",
      answer: "Payment flow:\n1. **Hold during booking** - Reserve funds but don't charge yet\n2. **Capture at confirmation** - Charge after availability confirmed\n3. **Refund on cancellation** - Return funds based on policy\n\nFor MVP, we'll simulate payment. In production, integrate with Stripe or similar.",
      importance: 'important',
      revealsRequirement: 'FR-2, FR-3',
      insight: "Payment and inventory must be transactional - both succeed or both fail",
    },
    {
      id: 'waitlist',
      category: 'clarification',
      question: "What happens when no slots are available? Can users join a waitlist?",
      answer: "Yes! Waitlist features:\n- Users can join waitlist for fully booked slots\n- When someone cancels, notify waitlist users (FIFO or priority-based)\n- Auto-expire waitlist entries after time limit\n\nWaitlists are important for maximizing utilization and revenue.",
      importance: 'important',
      insight: "Waitlists convert disappointed users into potential bookings",
    },
    {
      id: 'resource-types',
      category: 'clarification',
      question: "What types of resources can be booked?",
      answer: "Common resource types:\n- **Hotels** - Rooms by date\n- **Restaurants** - Tables by time slot\n- **Events** - Tickets/seats\n- **Services** - Appointments (doctors, salons)\n\nFor MVP, keep it generic - support any resource with slots and capacity.",
      importance: 'important',
      insight: "Generic design allows supporting multiple booking verticals",
    },

    // SCALE & NFRs
    {
      id: 'throughput-bookings',
      category: 'throughput',
      question: "How many bookings should we support per day?",
      answer: "Target: 1 million bookings per day across all resources",
      importance: 'critical',
      calculation: {
        formula: "1M ÷ 86,400 sec = 11.5 bookings/sec",
        result: "~12 bookings/sec (36 at peak)",
      },
      learningPoint: "Each booking requires inventory lock and payment - must be reliable",
    },
    {
      id: 'throughput-availability',
      category: 'throughput',
      question: "How many availability checks per day?",
      answer: "About 20 million availability checks per day (users browse before booking)",
      importance: 'critical',
      calculation: {
        formula: "20M ÷ 86,400 sec = 231 checks/sec",
        result: "~230 checks/sec (690 at peak)",
      },
      learningPoint: "Read-heavy workload - availability checks far exceed bookings",
    },
    {
      id: 'latency-availability',
      category: 'latency',
      question: "How fast should availability checks return?",
      answer: "p99 under 500ms. Users expect instant feedback when selecting dates/times.",
      importance: 'critical',
      learningPoint: "Fast availability checks improve user experience and conversion",
    },
    {
      id: 'latency-booking',
      category: 'latency',
      question: "How quickly should booking confirmation happen?",
      answer: "Under 3 seconds for complete flow (availability check + lock + payment + confirm). Users get anxious during payment.",
      importance: 'critical',
      learningPoint: "Booking must be fast AND prevent race conditions",
    },
    {
      id: 'concurrent-booking',
      category: 'burst',
      question: "What if 100 users try to book the same last slot at the same time?",
      answer: "This is a thundering herd problem! Solutions:\n1. Use distributed locks (Redis, DB row locks)\n2. Implement queuing with timeout\n3. Show real-time availability updates\n\nOnly the first user should succeed. Others get clear 'sold out' message.",
      importance: 'critical',
      insight: "High contention scenarios require careful lock management",
    },
    {
      id: 'consistency-requirement',
      category: 'consistency',
      question: "How critical is inventory accuracy?",
      answer: "Extremely critical! Overbooking damages reputation and costs money (relocating customers, refunds, etc.). Inventory must use strong consistency - eventual consistency is NOT acceptable.",
      importance: 'critical',
      learningPoint: "Strong consistency required for inventory - can't use eventual consistency",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'availability-check', 'overbooking-prevention', 'concurrent-booking'],
  criticalFRQuestionIds: ['core-functionality', 'availability-check', 'overbooking-prevention'],
  criticalScaleQuestionIds: ['throughput-bookings', 'latency-booking', 'concurrent-booking'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Check availability',
      description: 'Users can view available slots in real-time',
      emoji: '📅',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Make reservations',
      description: 'Users can book available slots with payment',
      emoji: '✅',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Cancel reservations',
      description: 'Users can cancel bookings and get refunds',
      emoji: '❌',
    },
    {
      id: 'fr-4',
      text: 'FR-4: View bookings',
      description: 'Users can see their reservation history',
      emoji: '📋',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million',
    writesPerDay: '1 million bookings',
    readsPerDay: '20 million availability checks',
    peakMultiplier: 3,
    readWriteRatio: '20:1',
    calculatedWriteRPS: { average: 12, peak: 36 },
    calculatedReadRPS: { average: 231, peak: 693 },
    maxPayloadSize: '~1KB (booking data)',
    storagePerRecord: '~2KB (booking with metadata)',
    storageGrowthPerYear: '~730GB (bookings)',
    redirectLatencySLA: 'p99 < 500ms (availability)',
    createLatencySLA: 'p99 < 3s (booking)',
  },

  architecturalImplications: [
    'Read-heavy (20:1) → Cache availability data aggressively',
    '36 bookings/sec peak → Need distributed locking for inventory',
    'Overbooking prevention → Strong consistency + optimistic/pessimistic locks',
    'Cancellations → Must update inventory and process refunds atomically',
    'Real-time availability → Fast inventory lookups with caching',
  ],

  outOfScope: [
    'Multi-currency support',
    'Complex loyalty programs',
    'Group bookings with negotiations',
    'Advanced dynamic pricing algorithms',
    'Integration with external booking platforms',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can check availability and make bookings. The overbooking prevention and waitlist features will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📅',
  scenario: "Welcome to ReserveTech! You've been hired to build a booking reservation system.",
  hook: "Your first customer wants to reserve a table at a popular restaurant!",
  challenge: "Set up the basic request flow so users can reach your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your reservation system is online!',
  achievement: 'Users can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle reservations yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every booking system starts with a **Client** connecting to a **Server**.

When a user opens your reservation app:
1. Their device (phone, laptop) is the **Client**
2. It sends HTTP requests to your **App Server**
3. The server processes the request and sends back a response

This is the foundation of ALL web applications!`,

  whyItMatters: 'Without this connection, users can\'t check availability or make bookings at all.',

  realWorldExample: {
    company: 'OpenTable',
    scenario: 'Handling millions of restaurant reservations',
    howTheyDoIt: 'Started with simple web server, now uses microservices architecture with real-time inventory',
  },

  keyPoints: [
    'Client = the user\'s device (browser, mobile app)',
    'App Server = your backend that processes reservations',
    'HTTP = the protocol they use to communicate',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'The user\'s device that makes requests', icon: '📱' },
    { title: 'App Server', explanation: 'Your backend that handles reservation logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Protocol for request/response', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'booking-reservation-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users making reservations', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles availability and booking logic', displayName: 'App Server' },
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
  scenario: "Your server is connected, but it doesn't know how to handle reservations yet!",
  hook: "A user tried to book a table but got an error.",
  challenge: "Write the Python code to check availability, make reservations, and handle cancellations.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle bookings!',
  achievement: 'You implemented the core reservation functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can check availability', after: '✓' },
    { label: 'Can make reservations', after: '✓' },
    { label: 'Can cancel bookings', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all reservations are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Core Reservation Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that:
1. Receives the request
2. Processes the data
3. Returns a response

For a reservation system, we need handlers for:
- \`check_availability(resource_id, date, duration)\` - Check if slots are available
- \`make_reservation(resource_id, date, duration, user_id)\` - Create booking
- \`cancel_reservation(booking_id)\` - Cancel and refund

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without handlers, your server can\'t process reservations. This is where the business logic lives!',

  famousIncident: {
    title: 'OpenTable\'s First Reservation',
    company: 'OpenTable',
    year: '1998',
    whatHappened: 'Started as a simple reservation system for San Francisco restaurants. First booking was manually confirmed by phone. Built the basic flow: check availability, book, confirm.',
    lessonLearned: 'Start simple! The basic reservation flow hasn\'t changed - check, book, confirm.',
    icon: '🍽️',
  },

  realWorldExample: {
    company: 'OpenTable',
    scenario: 'Processing millions of reservations',
    howTheyDoIt: 'Uses distributed locks to prevent double-booking during high-demand times',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'Handle edge cases (no availability, already booked, etc.)',
    'Check availability BEFORE confirming reservation',
  ],

  quickCheck: {
    question: 'Why do we check availability in the reservation handler?',
    options: [
      'To calculate the price',
      'To prevent overbooking',
      'To send confirmation email',
      'To update the calendar',
    ],
    correctIndex: 1,
    explanation: 'Must verify slots are available before confirming - prevents overbooking!',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes an API request', icon: '⚙️' },
    { title: 'In-Memory Storage', explanation: 'Temporary storage in Python dicts', icon: '💾' },
    { title: 'Availability Check', explanation: 'Verify capacity before booking', icon: '📅' },
  ],
};

const step2: GuidedStep = {
  id: 'booking-reservation-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Check availability, FR-2: Make reservations, FR-3: Cancel reservations',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/availability, POST /api/v1/reservations, DELETE /api/v1/reservations/:id APIs',
      'Open the Python tab',
      'Implement check_availability(), make_reservation(), and cancel_reservation() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for availability, reservations, and cancellations',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/availability', 'POST /api/v1/reservations', 'DELETE /api/v1/reservations/:id'] } },
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
  hook: "When it restarted, ALL reservations were GONE! Customers showed up with no bookings. Chaos!",
  challenge: "Add a database so reservations and inventory survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Reservations now persist across server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But availability checks are getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **ACID transactions**: Atomic operations for bookings

For reservations, we need tables for:
- \`resources\` - What can be booked (tables, rooms, etc.)
- \`inventory\` - Available slots per resource per time
- \`reservations\` - Confirmed bookings
- \`users\` - Customer information`,

  whyItMatters: 'Imagine losing all reservations because of a server restart. Customers would show up with no booking!',

  famousIncident: {
    title: 'Restaurant Booking System Outage',
    company: 'Major reservation platform',
    year: '2021',
    whatHappened: 'Database failure caused reservations to disappear for 2 hours. Restaurants had double-bookings and angry customers. Lost $5M in bookings.',
    lessonLearned: 'Data persistence AND redundancy are critical. Never rely on a single database instance.',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'OpenTable',
    scenario: 'Storing millions of reservations',
    howTheyDoIt: 'Uses PostgreSQL with row-level locking to prevent double-booking',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL for ACID transactions (critical for bookings)',
    'Connect App Server to Database for read/write operations',
    'Use indexes for fast lookups (resource_id, date, user_id)',
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
    { title: 'ACID', explanation: 'Atomic, Consistent, Isolated, Durable transactions', icon: '🔒' },
    { title: 'Indexes', explanation: 'Speed up common queries', icon: '🔍' },
  ],
};

const step3: GuidedStep = {
  id: 'booking-reservation-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store resources, inventory, reservations, users', displayName: 'PostgreSQL' },
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
// STEP 4: Add Distributed Locking for Inventory
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚠️',
  scenario: "CRITICAL BUG! You're getting double-bookings!",
  hook: "Two users booked the same last table at the same time. Restaurant is furious - they had to turn away a customer!",
  challenge: "Add distributed locking to prevent race conditions during booking.",
  illustration: 'race-condition',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔒',
  message: 'No more double-bookings!',
  achievement: 'Distributed locks prevent concurrent booking conflicts',
  metrics: [
    { label: 'Double-bookings', before: 'Occurring', after: 'Prevented' },
    { label: 'Lock mechanism', after: 'Redis distributed lock' },
  ],
  nextTeaser: "But what happens when all slots are full?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Locking: Preventing Race Conditions',
  conceptExplanation: `When multiple users try to book the same slot simultaneously, we need **distributed locks**.

**The Problem:**
\`\`\`
User A checks: 1 slot available ✓
User B checks: 1 slot available ✓
User A books: Success!
User B books: Success! ← DOUBLE BOOKING!
\`\`\`

**The Solution: Distributed Lock**
\`\`\`
User A acquires lock on slot
User A checks & books
User A releases lock
User B tries lock → waits
User B checks → 0 slots → rejected ✓
\`\`\`

Use Redis for fast distributed locks with automatic expiration.`,

  whyItMatters: 'Double-booking damages your reputation and costs money. Locks ensure only one user books a slot.',

  famousIncident: {
    title: 'Ticketmaster Overselling Incident',
    company: 'Ticketmaster',
    year: '2019',
    whatHappened: 'Race condition bug caused tickets to be oversold for a major concert. 500+ fans showed up with valid tickets but no seats. Settlement cost $10M.',
    lessonLearned: 'Distributed locking is NOT optional for inventory systems. Test under high concurrency.',
    icon: '🎫',
  },

  realWorldExample: {
    company: 'OpenTable',
    scenario: 'Preventing double-booking during peak hours',
    howTheyDoIt: 'Uses Redis distributed locks with 30-second TTL during the booking flow',
  },

  diagram: `
User A                    Redis Lock              Database
  │                           │                       │
  ├─── LOCK(table_5) ────────▶│                       │
  │◀──── ACQUIRED ─────────────┤                       │
  │                           │                       │
  ├──── Check availability ───┴──────────────────────▶│
  │◀──── 1 slot available ─────────────────────────────┤
  │                           │                       │
  ├──── Book slot ────────────┴──────────────────────▶│
  │◀──── Confirmed ────────────────────────────────────┤
  │                           │                       │
  ├─── UNLOCK(table_5) ───────▶│                       │

User B (waits for lock to release, then sees 0 slots)
`,

  keyPoints: [
    'Use distributed locks (Redis) for high-concurrency scenarios',
    'Lock BEFORE checking availability',
    'Always set TTL to prevent deadlocks (if client crashes)',
    'Release lock after booking confirmation',
    'Handle lock timeout gracefully',
  ],

  quickCheck: {
    question: 'Why use Redis for distributed locks instead of database locks?',
    options: [
      'Redis is cheaper',
      'Redis is faster and designed for locks with TTL',
      'Database locks don\'t work',
      'Redis has more storage',
    ],
    correctIndex: 1,
    explanation: 'Redis is in-memory (fast), supports atomic operations, and has built-in TTL for auto-expiring locks.',
  },

  keyConcepts: [
    { title: 'Distributed Lock', explanation: 'Coordinate access across multiple servers', icon: '🔒' },
    { title: 'TTL', explanation: 'Time To Live - auto-expire locks', icon: '⏱️' },
    { title: 'Race Condition', explanation: 'Multiple operations compete for same resource', icon: '⚡' },
  ],
};

const step4: GuidedStep = {
  id: 'booking-reservation-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Make reservations (now with lock protection)',
    taskDescription: 'Add Redis cache for distributed locking',
    componentsNeeded: [
      { type: 'cache', reason: 'Distributed locks to prevent double-booking', displayName: 'Redis' },
    ],
    successCriteria: [
      'Cache component (Redis) added to canvas',
      'App Server connected to Cache',
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
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Redis will be used for distributed locks during booking.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Waitlist
// =============================================================================

const step5Story: StoryContent = {
  emoji: '😞',
  scenario: "Customers are frustrated when slots are fully booked!",
  hook: "A user wanted a prime-time table but everything was sold out. They left disappointed and didn't come back.",
  challenge: "Add a waitlist system so users can be notified when slots become available.",
  illustration: 'disappointed-user',
};

const step5Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Waitlist is live!',
  achievement: 'Users can join waitlist and get notified of cancellations',
  metrics: [
    { label: 'Disappointed users', before: 'Lost', after: 'On waitlist' },
    { label: 'Notification system', after: 'Active' },
  ],
  nextTeaser: "But how do we handle pricing changes?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queue: Asynchronous Waitlist Processing',
  conceptExplanation: `When a slot is fully booked, users can join a **waitlist**. When someone cancels, we need to notify waitlist users.

**Synchronous approach (BAD):**
\`\`\`
User cancels → Find waitlist users → Send emails
                     ↑
              This blocks the cancellation!
\`\`\`

**Asynchronous approach (GOOD):**
\`\`\`
User cancels → Confirm cancellation instantly
            → Publish event to queue
            → Background worker processes notifications
\`\`\`

Use a **Message Queue** (RabbitMQ, SQS) for:
- Decoupling cancellation from notification
- Handling spikes in cancellations
- Retry failed notifications`,

  whyItMatters: 'Waitlists convert "sold out" into future revenue. Async processing keeps cancellations fast.',

  famousIncident: {
    title: 'Concert Ticket Waitlist Success',
    company: 'StubHub',
    year: '2018',
    whatHappened: 'Implemented waitlist for sold-out events. When tickets became available (cancellations, releases), waitlist users got first access. Increased revenue by 15%.',
    lessonLearned: 'Waitlists are valuable - they capture demand and fill cancellations quickly.',
    icon: '🎵',
  },

  realWorldExample: {
    company: 'OpenTable',
    scenario: 'Managing waitlists for popular restaurants',
    howTheyDoIt: 'Uses message queues to process waitlist notifications. FIFO order with 15-minute response window.',
  },

  diagram: `
Cancellation Flow:
┌──────────┐     ┌─────────────┐     ┌──────────┐
│   User   │────▶│ App Server  │────▶│ Database │
│ Cancels  │     │             │     │ Update   │
└──────────┘     └──────┬──────┘     └──────────┘
                        │
                        │ Publish event
                        ▼
                 ┌─────────────┐
                 │ Message Queue│
                 │  (RabbitMQ) │
                 └──────┬──────┘
                        │
                        │ Consume
                        ▼
                 ┌─────────────┐     ┌──────────┐
                 │   Worker    │────▶│ Email/SMS│
                 │ Notify users│     │ Service  │
                 └─────────────┘     └──────────┘
`,

  keyPoints: [
    'Message queues decouple slow operations from user requests',
    'Waitlist notifications are processed asynchronously',
    'Queue handles spikes and retries failed notifications',
    'FIFO order ensures fairness',
    'Set expiration on waitlist entries (e.g., 24 hours)',
  ],

  quickCheck: {
    question: 'Why use a message queue instead of sending notifications directly?',
    options: [
      'Message queues are cheaper',
      'Decouples slow notifications from fast cancellation confirmation',
      'Message queues store more data',
      'Email doesn\'t work without queues',
    ],
    correctIndex: 1,
    explanation: 'Notifications can take seconds. Queue allows instant cancellation confirmation while notifications happen in background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Async communication between services', icon: '📨' },
    { title: 'Decoupling', explanation: 'Separate slow operations from fast ones', icon: '🔗' },
    { title: 'Waitlist', explanation: 'Queue users for sold-out slots', icon: '⏳' },
  ],
};

const step5: GuidedStep = {
  id: 'booking-reservation-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Handle cancellations and notify waitlist',
    taskDescription: 'Add a Message Queue for async waitlist processing',
    componentsNeeded: [
      { type: 'queue', reason: 'Process waitlist notifications asynchronously', displayName: 'RabbitMQ' },
    ],
    successCriteria: [
      'Queue component added to canvas',
      'App Server connected to Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'queue' },
    ],
  },

  hints: {
    level1: 'Drag a Queue (Message Queue) component onto the canvas',
    level2: 'Connect App Server to Queue. Waitlist notifications will be processed asynchronously.',
    solutionComponents: [{ type: 'queue' }],
    solutionConnections: [{ from: 'app_server', to: 'queue' }],
  },
};

// =============================================================================
// STEP 6: Add Dynamic Pricing Engine
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💰',
  scenario: "You're leaving money on the table!",
  hook: "Prime-time Friday slots sell out in seconds at low prices. Late-night Tuesday slots sit empty. Revenue is suboptimal.",
  challenge: "Add dynamic pricing to maximize revenue based on demand.",
  illustration: 'pricing-chart',
};

const step6Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Dynamic pricing is live!',
  achievement: 'Prices adjust based on demand, maximizing revenue',
  metrics: [
    { label: 'Revenue', before: 'Flat', after: '+25%' },
    { label: 'Pricing strategy', after: 'Dynamic' },
    { label: 'Prime slots', after: 'Premium price' },
    { label: 'Off-peak slots', after: 'Discount price' },
  ],
  nextTeaser: "You've built a complete reservation system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Dynamic Pricing: Maximizing Revenue',
  conceptExplanation: `**Dynamic pricing** adjusts prices based on demand, time, and other factors.

**Static pricing (OLD):**
- Same price for all slots
- Prime slots sell out instantly
- Off-peak slots stay empty
- Revenue: $100/day

**Dynamic pricing (NEW):**
- High demand = higher price
- Low demand = lower price (discounts)
- Revenue: $125/day (+25%)

Factors that affect price:
1. **Time of day** - Dinner time costs more than lunch
2. **Day of week** - Friday/Saturday premium, Tuesday discount
3. **Booking lead time** - Last-minute bookings cost more
4. **Current occupancy** - As slots fill, price increases
5. **Historical demand** - Learn from past patterns`,

  whyItMatters: 'Dynamic pricing increases revenue while maintaining high utilization. Airlines and hotels use this extensively.',

  famousIncident: {
    title: 'Uber Surge Pricing Controversy',
    company: 'Uber',
    year: '2014',
    whatHappened: 'New Year\'s Eve surge pricing hit 8-9x normal rates. Users were outraged, but Uber argued it balanced supply/demand. Now standard in the industry.',
    lessonLearned: 'Dynamic pricing works but communicate clearly to users. Show "high demand" badges.',
    icon: '🚗',
  },

  realWorldExample: {
    company: 'OpenTable',
    scenario: 'Dynamic pricing for restaurant reservations',
    howTheyDoIt: 'Charges premium for prime slots (7-8pm Friday), offers discounts for off-peak (5pm Tuesday)',
  },

  diagram: `
Pricing Algorithm:

Base Price: $50
  │
  ├─ Time factor (7pm Friday) → ×1.5 = $75
  │
  ├─ Occupancy (80% full) → ×1.2 = $90
  │
  ├─ Lead time (booking 2 hours ahead) → ×1.1 = $99
  │
  └─ Final Price: $99

vs.

Base Price: $50
  │
  ├─ Time factor (5pm Tuesday) → ×0.7 = $35
  │
  ├─ Occupancy (20% full) → ×0.8 = $28
  │
  └─ Final Price: $28 (Discount!)
`,

  keyPoints: [
    'Dynamic pricing increases revenue by 15-30%',
    'Adjust based on demand, time, occupancy',
    'Offer discounts for off-peak to increase utilization',
    'Be transparent - show "high demand" or "discount" labels',
    'Store pricing rules in database, cache frequently used prices',
  ],

  quickCheck: {
    question: 'Why offer discounts for off-peak slots?',
    options: [
      'To be nice to customers',
      'Increase utilization and revenue from otherwise empty slots',
      'Because they\'re lower quality',
      'To match competitors',
    ],
    correctIndex: 1,
    explanation: 'Empty slots generate $0. A discounted booking generates revenue and fills capacity.',
  },

  keyConcepts: [
    { title: 'Dynamic Pricing', explanation: 'Adjust prices based on demand', icon: '💰' },
    { title: 'Surge Pricing', explanation: 'Higher prices during high demand', icon: '📈' },
    { title: 'Utilization', explanation: 'Percentage of capacity booked', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'booking-reservation-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Show dynamic prices during availability check',
    taskDescription: 'Configure dynamic pricing logic in App Server',
    successCriteria: [
      'Click on App Server',
      'Open Python/Configuration tab',
      'Implement dynamic pricing logic based on demand',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'queue' },
    ],
  },

  hints: {
    level1: 'Dynamic pricing is implemented in the App Server code',
    level2: 'Update the pricing calculation to factor in time, occupancy, and lead time',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const bookingReservationGuidedTutorial: GuidedTutorial = {
  problemId: 'booking-reservation',
  title: 'Design Booking Reservation System',
  description: 'Build a reservation system with availability checking, booking, cancellations, waitlists, and dynamic pricing',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '📅',
    hook: "You've been hired as Lead Engineer at ReserveTech!",
    scenario: "Your mission: Build a booking reservation system that handles availability, prevents overbooking, and maximizes revenue.",
    challenge: "Can you design a system that never double-books while keeping users happy?",
  },

  requirementsPhase: bookingReservationRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Distributed Locking',
    'Race Condition Prevention',
    'Message Queues',
    'Asynchronous Processing',
    'Waitlist Management',
    'Dynamic Pricing',
    'ACID Transactions',
  ],

  ddiaReferences: [
    'Chapter 1: Reliability and consistency',
    'Chapter 7: Transactions',
    'Chapter 8: Distributed Systems Problems',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default bookingReservationGuidedTutorial;
