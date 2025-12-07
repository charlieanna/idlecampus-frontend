import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Delivery Tracking Updates Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 6-step tutorial that teaches system design concepts
 * while building a real-time delivery tracking system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic delivery tracking system
 * Steps 4-6: Scale with real-time location streaming, geofencing, push notifications
 *
 * Key Concepts:
 * - Real-time location updates
 * - ETA calculation and updates
 * - Push notifications
 * - Geofencing
 * - WebSocket streaming
 * - Location data optimization
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const deliveryTrackingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time delivery tracking system",

  interviewer: {
    name: 'Jordan Lee',
    role: 'Staff Engineer at LogisticsHub',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'location-updates',
      category: 'functional',
      question: "What's the core functionality we need for tracking deliveries?",
      answer: "Customers need to:\n\n1. **See driver location in real-time** - Track delivery driver on a live map\n2. **Get updated ETA** - See estimated time of arrival that updates as driver moves\n3. **Receive status notifications** - Get alerts when driver is nearby, arrived, etc.\n4. **View delivery history** - See past delivery routes and timestamps",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Real-time tracking is about three things: location, ETA, and notifications",
    },
    {
      id: 'location-frequency',
      category: 'functional',
      question: "How often should we update the driver's location?",
      answer: "Driver apps should send location updates every 3-5 seconds while on delivery. Customers should see smooth, near-real-time updates on the map. This creates the illusion of continuous tracking without overwhelming the system.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Location update frequency is a key trade-off: too slow = choppy UX, too fast = wasted bandwidth",
    },
    {
      id: 'eta-calculation',
      category: 'functional',
      question: "How should we calculate and update the ETA?",
      answer: "ETA should be calculated based on:\n1. **Current distance** to destination\n2. **Real-time traffic** conditions\n3. **Historical delivery data** for the area\n4. **Driver's current speed**\n\nWe should recalculate ETA every time we get a new location update, so customers always see accurate timing.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "ETA isn't static - it needs continuous recalculation based on real-time conditions",
    },
    {
      id: 'notification-triggers',
      category: 'functional',
      question: "When should we send notifications to customers?",
      answer: "Send push notifications when:\n1. **Delivery is on the way** - Driver picked up package\n2. **Driver is nearby** - Within 5 minutes or 0.5 miles\n3. **Driver has arrived** - At delivery location\n4. **Delivery completed** - Package delivered\n5. **Delivery delayed** - ETA changes by more than 10 minutes",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Notifications should be meaningful events, not constant spam",
    },
    {
      id: 'geofencing',
      category: 'functional',
      question: "How do we detect when a driver is 'nearby' or 'arrived'?",
      answer: "We use **geofencing** - virtual boundaries around the delivery location. When a driver crosses these boundaries, we trigger actions:\n- **Outer fence** (0.5 miles): Trigger 'driver nearby' notification\n- **Inner fence** (100 meters): Trigger 'driver arrived' notification\n\nThe system calculates distance with each location update and checks fence boundaries.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Geofencing converts continuous location data into discrete events",
    },
    {
      id: 'multiple-deliveries',
      category: 'clarification',
      question: "Can drivers have multiple deliveries at once? Do we track all of them?",
      answer: "Yes, drivers often have a route with 5-10 deliveries. For MVP, let's track one active delivery at a time - the current delivery. When that's completed, we move to the next. This simplifies the tracking logic significantly.",
      importance: 'nice-to-have',
      insight: "Simplifying to one active delivery per driver reduces complexity while still being useful",
    },
    {
      id: 'offline-handling',
      category: 'clarification',
      question: "What if the driver goes offline or loses GPS signal?",
      answer: "We should handle gracefully:\n- **Short gaps (<30 seconds)**: Show last known location, indicate 'updating...'\n- **Longer gaps**: Show 'Lost GPS signal', stop updating ETA\n- **When reconnected**: Catch up with buffered location updates\n\nDriver app should buffer updates locally and sync when connection returns.",
      importance: 'important',
      insight: "GPS and network interruptions are common - design for partial connectivity",
    },

    // SCALE & NFRs
    {
      id: 'throughput-drivers',
      category: 'throughput',
      question: "How many active deliveries should we support simultaneously?",
      answer: "Plan for 50,000 active deliveries at peak times. Each driver sends location updates every 4 seconds on average.",
      importance: 'critical',
      calculation: {
        formula: "50,000 drivers × (1 update / 4 sec) = 12,500 updates/sec",
        result: "~12,500 location updates per second at peak",
      },
      learningPoint: "Location updates create massive write load - this dominates the system",
    },
    {
      id: 'throughput-customers',
      category: 'throughput',
      question: "How many customers are tracking deliveries?",
      answer: "About 200,000 customers actively tracking deliveries during peak hours. Each customer polls for updates or maintains a WebSocket connection.",
      importance: 'critical',
      learningPoint: "Read traffic (customers watching) can be higher than write traffic (drivers updating)",
    },
    {
      id: 'latency-location',
      category: 'latency',
      question: "How quickly should location updates appear on customer maps?",
      answer: "Customers should see updates within 2-3 seconds of the driver's location changing. This creates a smooth, real-time experience. p99 latency should be under 5 seconds.",
      importance: 'critical',
      learningPoint: "Real-time means seconds, not milliseconds - but consistency matters more than raw speed",
    },
    {
      id: 'latency-notifications',
      category: 'latency',
      question: "How fast should push notifications be delivered?",
      answer: "Push notifications should arrive within 10 seconds of the triggering event. For example, when a driver arrives, customer should be notified within 10 seconds.",
      importance: 'important',
      learningPoint: "Notifications don't need to be instant, but they should be reliable",
    },
    {
      id: 'burst-peak',
      category: 'burst',
      question: "What causes traffic spikes in a delivery tracking system?",
      answer: "Biggest spikes happen:\n- **Evening rush (5-8 PM)**: 3x normal delivery volume\n- **Black Friday / Cyber Monday**: 10x normal volume\n- **Same-day delivery cutoff times**: Everyone tracking to see if they'll get packages today\n\nNeed to handle 3x peak gracefully, degrade gracefully beyond that.",
      importance: 'important',
      insight: "Delivery tracking has predictable daily peaks but also seasonal mega-spikes",
    },
    {
      id: 'payload-size',
      category: 'payload',
      question: "What data is included in each location update?",
      answer: "Each location update contains:\n- **Location**: Latitude, longitude (16 bytes)\n- **Timestamp**: Unix timestamp (8 bytes)\n- **Driver ID**: UUID (16 bytes)\n- **Delivery ID**: UUID (16 bytes)\n- **Speed/heading**: Optional (8 bytes)\n\nTotal: ~64 bytes per update. At 12,500 updates/sec = ~800 KB/sec = ~2.6 TB/month just for location data!",
      importance: 'important',
      calculation: {
        formula: "64 bytes × 12,500/sec × 86,400 sec/day × 30 days",
        result: "~2.6 TB/month of location data",
      },
      learningPoint: "Small payloads × high frequency = huge storage costs",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['location-updates', 'eta-calculation', 'notification-triggers'],
  criticalFRQuestionIds: ['location-updates', 'location-frequency'],
  criticalScaleQuestionIds: ['throughput-drivers', 'latency-location', 'payload-size'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Real-time driver location tracking',
      description: 'Display driver location on map with updates every 3-5 seconds',
      emoji: '📍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Dynamic ETA calculation',
      description: 'Calculate and update ETA based on location, traffic, and historical data',
      emoji: '⏱️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Push notifications for delivery events',
      description: 'Notify customers when driver is nearby, arrived, or delivery completed',
      emoji: '🔔',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Geofencing for proximity detection',
      description: 'Detect when driver crosses virtual boundaries to trigger notifications',
      emoji: '🚧',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '200K tracking customers + 50K active drivers',
    writesPerDay: '108 billion location updates',
    readsPerDay: '500 million tracking page views',
    peakMultiplier: 3,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 12500, peak: 37500 },
    calculatedReadRPS: { average: 5787, peak: 17361 },
    maxPayloadSize: '64 bytes (location update)',
    storagePerRecord: '64 bytes (location point)',
    storageGrowthPerYear: '~31 TB (location history)',
    redirectLatencySLA: 'p99 < 5s (location update)',
    createLatencySLA: 'p99 < 10s (push notification)',
  },

  architecturalImplications: [
    '✅ 12,500 location updates/sec → Need message queue to handle write load',
    '✅ Real-time updates → WebSocket connections for live streaming',
    '✅ ETA calculation → Async processing with traffic data integration',
    '✅ Geofencing logic → In-memory processing for low-latency boundary checks',
    '✅ Push notifications → Notification service with fan-out capability',
    '✅ 2.6 TB/month location data → Time-series database or aggressive pruning strategy',
  ],

  outOfScope: [
    'Multi-stop route optimization',
    'Historical route playback (detailed)',
    'Driver navigation (focus is customer tracking)',
    'Package scanning/barcode tracking',
    'Delivery signature capture',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic system where drivers can send location updates and customers can track them. The real-time WebSocket streaming and geofencing optimizations come later. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to LogisticsHub! You've been hired to build a delivery tracking system.",
  hook: "Your first customer just ordered a package and wants to track their delivery!",
  challenge: "Set up the basic request flow so customers can connect to your tracking server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your tracking platform is online!',
  achievement: 'Customers and drivers can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's write code to handle tracking!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every tracking application starts with a **Client** connecting to a **Server**.

For delivery tracking, we have TWO types of clients:
1. **Customer App** - View live delivery map, get notifications
2. **Driver App** - Send location updates continuously

Both connect to the same **App Server** which handles tracking logic.`,

  whyItMatters: 'Without this connection, drivers cannot send location updates and customers cannot see where their deliveries are.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Tracking 50,000+ active deliveries simultaneously',
    howTheyDoIt: 'Uses scalable app servers with WebSocket support for real-time updates. Customer and driver apps maintain persistent connections.',
  },

  keyPoints: [
    'Client = user devices (customer and driver apps)',
    'App Server = backend that processes location updates and tracking requests',
    'HTTP/WebSocket = protocols for communication (WebSocket for real-time)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User device making requests', icon: '📱' },
    { title: 'App Server', explanation: 'Backend handling tracking logic', icon: '🖥️' },
    { title: 'HTTP', explanation: 'Request/response protocol', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'delivery-tracking-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all tracking FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents customers and drivers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles location updates and tracking logic', displayName: 'App Server' },
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
// STEP 2: Implement Core Tracking Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle location updates yet!",
  hook: "A driver tried to send their location but got a 404 error. Customers can't see anything.",
  challenge: "Write the Python code to receive location updates, calculate ETA, and serve tracking data.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can track deliveries!',
  achievement: 'You implemented the core tracking functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can receive locations', after: '✓' },
    { label: 'Can calculate ETA', after: '✓' },
    { label: 'Can serve tracking data', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all tracking data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Tracking Handlers',
  conceptExplanation: `Every API endpoint needs a **handler function** that processes requests.

For delivery tracking, we need handlers for:
- \`update_location(driver_id, lat, lon, timestamp)\` - Receive driver location updates
- \`get_tracking(delivery_id)\` - Get current location and ETA for a delivery
- \`calculate_eta(current_location, destination)\` - Calculate estimated time of arrival

For now, we'll store everything in memory (Python dictionaries) to keep it simple.`,

  whyItMatters: 'These handlers are the brain of your tracking system - they make real-time tracking possible!',

  famousIncident: {
    title: 'FedEx Tracking Outage',
    company: 'FedEx',
    year: '2022',
    whatHappened: 'A bug in the location processing system caused tracking data to freeze for millions of packages during holiday season. Customers saw stale locations for 6+ hours, causing massive call center overload.',
    lessonLearned: 'Start simple but design APIs that can handle failures gracefully. Always show last known state.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'UPS',
    scenario: 'Processing 12,500 location updates per second',
    howTheyDoIt: 'Location Service uses async processing and in-memory caching for low-latency updates. Never blocks on location writes.',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use dictionaries for in-memory storage (temporary)',
    'ETA calculation can use simple distance/speed formula initially',
    'Handle edge cases (GPS loss, invalid coordinates, etc.)',
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
    { title: 'ETA', explanation: 'Estimated Time of Arrival calculation', icon: '⏱️' },
  ],
};

const step2: GuidedStep = {
  id: 'delivery-tracking-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Track locations, FR-2: Calculate ETA',
    taskDescription: 'Configure APIs and implement Python handlers for tracking functionality',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/location, GET /api/v1/tracking/:id, GET /api/v1/eta APIs',
      'Open the Python tab',
      'Implement update_location(), get_tracking(), and calculate_eta() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for update_location, get_tracking, and calculate_eta',
    solutionComponents: [
      {
        type: 'app_server',
        config: {
          handledAPIs: [
            'POST /api/v1/location',
            'GET /api/v1/tracking/:id',
            'GET /api/v1/eta'
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
  scenario: "Disaster! Your server crashed during evening delivery rush...",
  hook: "When it restarted, ALL tracking data was GONE! 10,000 active deliveries, vanished. Customers are furious.",
  challenge: "Add a database so location data and delivery records persist forever.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is safe forever!',
  achievement: 'Location updates and delivery records now persist across restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But the map updates are slow and choppy...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter',
  conceptExplanation: `In-memory storage is fast but **volatile** - it disappears when the server restarts.

A **database** provides:
- **Durability**: Data survives crashes
- **Structure**: Organized tables with relationships
- **Queries**: Efficient data retrieval
- **Time-series storage**: Track location history over time

For delivery tracking, we need tables for:
- \`deliveries\` - Active deliveries and their status
- \`locations\` - Location update history
- \`drivers\` - Driver profiles and current assignments
- \`customers\` - Customer accounts`,

  whyItMatters: 'Imagine losing tracking data for thousands of active deliveries. Customers would have no idea where their packages are. Chaos!',

  famousIncident: {
    title: 'DoorDash Location Data Loss',
    company: 'DoorDash',
    year: '2019',
    whatHappened: 'A database failover issue caused location tracking to stop for 20 minutes during dinner rush. Customers couldn\'t see where their food was. Drivers completed deliveries but customers never knew until doorbell rang.',
    lessonLearned: 'Persistent storage with proper replication is absolutely critical for real-time tracking.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Storing 108 billion location updates per day',
    howTheyDoIt: 'Uses time-series database (like TimescaleDB) for location history, PostgreSQL for delivery metadata',
  },

  keyPoints: [
    'Databases provide durability - data survives crashes',
    'Choose SQL for delivery metadata, time-series DB for location history',
    'Connect App Server to Database for read/write operations',
    'Consider data retention policy (keep 30 days of location history)',
  ],

  quickCheck: {
    question: 'Why is database durability especially critical for tracking systems?',
    options: [
      'It makes the system faster',
      'Losing tracking data breaks customer trust and creates support nightmares',
      'It\'s required by law',
      'It reduces server load',
    ],
    correctIndex: 1,
    explanation: 'Customers depend on accurate tracking. Losing this data means they don\'t know where packages are, leading to anxiety and support calls.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives server restarts', icon: '🛡️' },
    { title: 'Time-Series DB', explanation: 'Optimized for timestamped data', icon: '📈' },
    { title: 'Data Retention', explanation: 'How long to keep historical data', icon: '🗄️' },
  ],
};

const step3: GuidedStep = {
  id: 'delivery-tracking-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs now need persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store delivery records and location history permanently', displayName: 'PostgreSQL' },
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
// STEP 4: Add WebSocket Gateway for Real-Time Streaming
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Customers are complaining about choppy, laggy map updates!",
  hook: "The map refreshes every 10 seconds with HTTP polling. It looks broken. Customers want smooth, real-time updates.",
  challenge: "Add a WebSocket gateway to stream location updates in real-time.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Tracking is now truly real-time!',
  achievement: 'WebSocket streaming provides smooth, live updates',
  metrics: [
    { label: 'Update latency', before: '10s (polling)', after: '<3s (streaming)' },
    { label: 'Connection type', before: 'HTTP', after: 'WebSocket' },
  ],
  nextTeaser: "But 12,500 location updates/sec are overwhelming the database...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Streaming: WebSocket Gateway',
  conceptExplanation: `**HTTP polling** (old way):
- Customer app: "Any updates?" every 10 seconds
- Server: Check database, respond
- Wasteful: 90% of requests return "no updates"
- Laggy: Up to 10 second delays

**WebSocket streaming** (better way):
- Customer app: Opens persistent connection
- Server: Pushes updates instantly when they arrive
- Efficient: Only send when there's new data
- Smooth: Updates appear within seconds

For delivery tracking:
1. Customer opens tracking page → WebSocket connection established
2. Driver sends location update → Server receives it
3. Server immediately pushes to all connected customers watching that delivery
4. Customer map updates smoothly in real-time`,

  whyItMatters: 'At 200K concurrent customers watching deliveries, polling would create millions of wasted requests. WebSockets are essential for real-time tracking.',

  famousIncident: {
    title: 'Uber Eats Map Lag',
    company: 'Uber Eats',
    year: '2017',
    whatHappened: 'Before implementing WebSockets, their tracking used 30-second polling. Customers saw drivers "teleport" on the map. Many thought drivers were going the wrong way. Massive UX complaints.',
    lessonLearned: 'Real-time means WebSockets, not polling. Smooth updates matter for user perception.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'Lyft',
    scenario: 'Serving real-time location updates to millions of riders',
    howTheyDoIt: 'Uses WebSocket gateway with message routing. When driver updates location, it\'s pushed to all riders tracking that specific ride.',
  },

  diagram: `
┌──────────┐                     ┌─────────────┐
│ Customer │ ◄─── WebSocket ───► │   Gateway   │
│   App    │      (persistent)   └──────┬──────┘
└──────────┘                             │
                                         │
┌──────────┐                     ┌──────▼──────┐
│  Driver  │ ──── Location ────► │ App Server  │
│   App    │       Update        └─────────────┘
└──────────┘
`,

  keyPoints: [
    'WebSocket Gateway sits in front of app servers',
    'Maintains persistent connections with customers',
    'Pushes location updates immediately when received',
    'Much more efficient than polling for real-time data',
  ],

  quickCheck: {
    question: 'Why are WebSockets better than HTTP polling for tracking?',
    options: [
      'They use less bandwidth',
      'They enable instant push updates and eliminate wasteful polling requests',
      'They are easier to implement',
      'They are more secure',
    ],
    correctIndex: 1,
    explanation: 'WebSockets allow server to push updates instantly, eliminating the need for constant polling. This is essential for smooth real-time tracking.',
  },

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent bidirectional connection', icon: '🔌' },
    { title: 'Push Updates', explanation: 'Server sends data without being asked', icon: '📤' },
    { title: 'Streaming', explanation: 'Continuous flow of data', icon: '🌊' },
  ],
};

const step4: GuidedStep = {
  id: 'delivery-tracking-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time location tracking (now with streaming!)',
    taskDescription: 'Add a WebSocket Gateway between Client and App Server',
    componentsNeeded: [
      { type: 'websocket_gateway', reason: 'Stream location updates in real-time', displayName: 'WebSocket Gateway' },
    ],
    successCriteria: [
      'WebSocket Gateway component added',
      'Client connected to WebSocket Gateway',
      'WebSocket Gateway connected to App Server',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'websocket_gateway', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'websocket_gateway' },
      { fromType: 'websocket_gateway', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a WebSocket Gateway component onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → WebSocket Gateway → App Server. This enables real-time streaming.',
    solutionComponents: [{ type: 'websocket_gateway' }],
    solutionConnections: [
      { from: 'client', to: 'websocket_gateway' },
      { from: 'websocket_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Location Update Processing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your database is on fire! 12,500 location writes/sec are maxing out the database!",
  hook: "The database can't keep up. Writes are queuing up, updates are delayed, and customers see stale locations.",
  challenge: "Add a message queue to buffer location updates and process them asynchronously.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Location processing is smooth and scalable!',
  achievement: 'Message queue buffers writes and enables async processing',
  metrics: [
    { label: 'Database write load', before: 'Maxed out', after: 'Smooth' },
    { label: 'Location update processing', after: 'Async' },
  ],
  nextTeaser: "But geofencing calculations are slow...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Handling High-Volume Location Updates',
  conceptExplanation: `The **location update flood** problem:
- 50,000 drivers × 1 update every 4 seconds = 12,500 writes/sec
- Database can handle ~5,000 writes/sec (typical PostgreSQL limit)
- Direct writes → database overwhelmed → system crashes

**Message Queue solution**:
1. Driver sends location → Goes to message queue (fast, always available)
2. Queue buffers updates (handles spikes gracefully)
3. Workers consume from queue at sustainable rate
4. Workers process: Write to DB, calculate geofences, update WebSocket clients
5. If workers fall behind, queue holds updates until they catch up

Additional benefits:
- **Decouple** driver writes from processing
- **Enable batch processing** (write 100 locations at once)
- **Support multiple consumers** (DB writer, geofence processor, analytics)
- **Replay capability** (reprocess if needed)`,

  whyItMatters: 'At 12,500 writes/sec, direct database writes would melt your database. Queues are essential for high-volume real-time systems.',

  famousIncident: {
    title: 'Postmates Location Processing Overload',
    company: 'Postmates',
    year: '2019',
    whatHappened: 'Black Friday traffic spiked location updates 10x. Without a message queue buffer, their database crashed from write overload. Tracking was down for 3 hours on the busiest delivery day of the year.',
    lessonLearned: 'Message queues aren\'t optional for high-volume writes - they\'re essential infrastructure.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Processing millions of location updates per minute',
    howTheyDoIt: 'Uses Kafka to buffer all location updates. Multiple consumer groups process for different purposes: persistence, geofencing, analytics, ETA calculation.',
  },

  diagram: `
┌─────────┐                ┌───────────────────┐
│ Drivers │──────────────► │  Message Queue    │
│ (50K)   │  12.5K/sec     │     (Kafka)       │
└─────────┘                └─────────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
              ┌──────────┐    ┌──────────┐    ┌──────────┐
              │ Worker 1 │    │ Worker 2 │    │ Worker 3 │
              │(DB Write)│    │(Geofence)│    │(Analytics)│
              └──────────┘    └──────────┘    └──────────┘
`,

  keyPoints: [
    'Message queue buffers location updates (12,500/sec)',
    'Workers consume at sustainable rate (prevents database overload)',
    'Enables async processing: geofencing, ETA, notifications',
    'Provides fault tolerance: queue holds data if workers crash',
  ],

  quickCheck: {
    question: 'Why is a message queue critical for location tracking at scale?',
    options: [
      'It makes the system faster',
      'It buffers high-volume writes and prevents database overload',
      'It reduces costs',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'At 12,500 writes/sec, databases can\'t keep up. Queues buffer writes and allow async processing at sustainable rates.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async event processing', icon: '📬' },
    { title: 'Worker', explanation: 'Background process that consumes queue', icon: '⚙️' },
    { title: 'Decoupling', explanation: 'Separate write speed from processing speed', icon: '🔗' },
  ],
};

const step5: GuidedStep = {
  id: 'delivery-tracking-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Location tracking (now scalable!)',
    taskDescription: 'Add a Message Queue to buffer and process location updates asynchronously',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer location updates for async processing', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'websocket_gateway', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'websocket_gateway' },
      { fromType: 'websocket_gateway', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This buffers location updates for async processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Cache and Notification Service
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚧',
  scenario: "You need to add geofencing and push notifications, but the system is already complex!",
  hook: "Geofencing checks on every location update are slow. Push notifications need a dedicated service.",
  challenge: "Add a Cache for fast geofence lookups and a Notification Service for reliable push delivery.",
  illustration: 'optimization',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a complete delivery tracking system!',
  achievement: 'A scalable, real-time tracking platform with all features',
  metrics: [
    { label: 'Location updates/sec', after: '12,500+' },
    { label: 'Real-time latency', after: '<3s' },
    { label: 'Geofencing', after: 'Enabled' },
    { label: 'Push notifications', after: 'Enabled' },
    { label: 'Concurrent customers', after: '200K+' },
  ],
  nextTeaser: "You've mastered real-time delivery tracking system design!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Geofencing and Notifications: The Final Pieces',
  conceptExplanation: `**Cache for Geofencing**:
Geofencing checks run on EVERY location update (12,500/sec):
- "Is driver within 0.5 miles of destination?" (nearby notification)
- "Is driver within 100 meters of destination?" (arrived notification)

Without caching:
- Query database for delivery destination (12,500/sec)
- Calculate distance (CPU intensive)
- Database melts

With Redis cache:
- Delivery destinations cached in memory (1ms lookup vs 100ms DB query)
- Fast geo-spatial distance calculations
- Can handle 12,500 checks/sec easily

**Notification Service**:
Push notifications have special requirements:
- **Fan-out**: One event → notify multiple devices (iOS, Android, web)
- **Retry logic**: If notification fails, retry with exponential backoff
- **Priority queue**: "Driver arrived" is urgent, "On the way" can wait
- **Provider integration**: APNS (Apple), FCM (Google), web push

Dedicated notification service handles this complexity.`,

  whyItMatters: 'Geofencing and notifications are the features that make tracking feel magical. Cache makes them fast, notification service makes them reliable.',

  famousIncident: {
    title: 'Amazon Delivery Notification Storm',
    company: 'Amazon',
    year: '2021',
    whatHappened: 'A bug caused "package delivered" notifications to be sent multiple times. Some customers got 50+ duplicate notifications for a single package. Notification service had no deduplication.',
    lessonLearned: 'Notification services need deduplication, rate limiting, and careful event handling.',
    icon: '🔔',
  },

  realWorldExample: {
    company: 'DoorDash',
    scenario: 'Sending millions of delivery notifications per day',
    howTheyDoIt: 'Uses Redis for geofence caching and a custom notification service that fans out to APNS, FCM, and SMS providers with retry logic.',
  },

  diagram: `
Location Update (12,500/sec)
      │
      ▼
┌─────────────┐
│   Worker    │────► Redis Cache ───► Geofence Check
└──────┬──────┘      (destinations)     (is nearby?)
       │                                      │
       │                                      │ YES → Trigger
       │                                      ▼
       │                            ┌─────────────────┐
       └───────────────────────────►│  Notification   │
                                    │    Service      │
                                    └────────┬────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                           APNS            FCM          Web Push
                          (iOS)        (Android)        (Browser)
`,

  keyPoints: [
    'Cache delivery destinations for fast geofence lookups',
    'Geofencing converts location stream into meaningful events',
    'Notification service handles fan-out, retry, and provider integration',
    'Both are essential for production-grade tracking',
  ],

  quickCheck: {
    question: 'Why do we cache delivery destinations instead of querying the database?',
    options: [
      'It saves money',
      'At 12,500 geofence checks/sec, database queries would be too slow',
      'Cache never fails',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Geofencing runs on every location update. At 12,500/sec, database queries would create massive load and latency. In-memory cache is essential.',
  },

  keyConcepts: [
    { title: 'Geofencing', explanation: 'Virtual boundaries that trigger events', icon: '🚧' },
    { title: 'Cache', explanation: 'In-memory storage for fast lookups', icon: '⚡' },
    { title: 'Notification Service', explanation: 'Dedicated system for push notifications', icon: '🔔' },
  ],
};

const step6: GuidedStep = {
  id: 'delivery-tracking-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Push notifications, FR-4: Geofencing',
    taskDescription: 'Add Cache for geofencing and configure notification capabilities',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache delivery destinations for fast geofence checks', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'System can handle geofencing at scale',
      'Notifications can be triggered by geofence events',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'websocket_gateway', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'websocket_gateway' },
      { fromType: 'websocket_gateway', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. This enables fast geofence lookups and notification triggers.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const deliveryTrackingUpdatesGuidedTutorial: GuidedTutorial = {
  problemId: 'delivery-tracking-updates',
  title: 'Design Real-Time Delivery Tracking',
  description: 'Build a delivery tracking system with real-time location updates, ETA calculation, geofencing, and push notifications',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🚀',
    hook: "You've been hired as Lead Engineer at LogisticsHub!",
    scenario: "Your mission: Build a real-time delivery tracking system that lets customers watch their deliveries arrive in real-time.",
    challenge: "Can you design a system that handles 12,500 location updates per second and provides smooth, real-time tracking to 200,000 concurrent customers?",
  },

  requirementsPhase: deliveryTrackingRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'WebSocket Streaming',
    'Message Queues',
    'Real-Time Location Tracking',
    'ETA Calculation',
    'Geofencing',
    'Push Notifications',
    'Caching',
    'Time-Series Data',
    'High-Volume Writes',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (time-series data)',
    'Chapter 11: Stream Processing (location updates)',
    'Chapter 8: Distributed Systems (real-time coordination)',
  ],
};

export default deliveryTrackingUpdatesGuidedTutorial;
