import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Uber - Progressive Tutorial (4 Phases)
 *
 * A single evolving tutorial that grows from beginner → intermediate → advanced → expert.
 * Focus: Geospatial matching, real-time tracking, two-sided marketplace.
 *
 * PHASE 1 - BEGINNER (Steps 1-3):
 * - FR-1: Riders request rides
 * - FR-2: Match to a driver
 * - Build: Client → Server → Database (basic matching)
 *
 * PHASE 2 - INTERMEDIATE (Steps 4-6):
 * - FR-3: Real-time driver location
 * - FR-4: Drivers accept/reject
 * - Build: WebSockets, geospatial index, driver tracking
 *
 * PHASE 3 - ADVANCED (Steps 7-9):
 * - NFR: Handle 1M rides/day
 * - Prevent double-booking
 * - Build: Distributed locking, message queues, load balancing
 *
 * PHASE 4 - EXPERT (Steps 10-12):
 * - ETA prediction
 * - Surge pricing
 * - Multi-region
 *
 * Key Teaching: Geospatial queries + real-time + consistency = hard problem!
 */

// =============================================================================
// PHASE 1: BEGINNER REQUIREMENTS (Steps 1-3)
// =============================================================================

const phase1Requirements: RequirementsGatheringContent = {
  problemStatement: "Design a ride-sharing platform like Uber",

  interviewer: {
    name: 'Alex Rodriguez',
    role: 'Product Manager at RideShare',
    avatar: '👨‍💼',
  },

  questions: [
    {
      id: 'request-ride',
      category: 'functional',
      question: "What's the main thing riders want to do?",
      answer: "Riders want to request a ride! They enter pickup and dropoff locations, tap 'Request', and get matched to a driver.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Start with the core ride request flow",
    },
    {
      id: 'get-matched',
      category: 'functional',
      question: "How does a rider get connected to a driver?",
      answer: "The platform matches the rider to a nearby available driver. For now, let's just pick the closest driver. We'll optimize matching later.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Matching is the core algorithm",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['request-ride', 'get-matched'],
  criticalFRQuestionIds: ['request-ride', 'get-matched'],
  criticalScaleQuestionIds: [],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Riders can request rides',
      description: 'Enter pickup/dropoff locations and request a ride',
      emoji: '🚗',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Match rider to driver',
      description: 'Find and assign a nearby available driver',
      emoji: '🤝',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000',
    writesPerDay: '5,000 rides',
    readsPerDay: '50,000 queries',
    peakMultiplier: 2,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 0.05, peak: 0.2 },
    calculatedReadRPS: { average: 0.5, peak: 2 },
    maxPayloadSize: '~1KB',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~1GB',
    redirectLatencySLA: 'p99 < 2s',
    createLatencySLA: 'p99 < 5s',
  },

  architecturalImplications: [
    '✅ Low volume → Simple architecture works',
    '✅ Basic matching: find closest driver',
    '✅ Client → Server → Database',
  ],

  outOfScope: [
    'Real-time tracking (Phase 2)',
    'Driver accept/reject (Phase 2)',
    'Distributed locking (Phase 3)',
    'Surge pricing (Phase 4)',
  ],

  keyInsight: "Uber is a TWO-SIDED marketplace: riders AND drivers. Both sides need to work together. Start with basic matching, then add real-time features.",

  thinkingFramework: {
    title: "Phase 1: Basic Ride Matching",
    intro: "We have 2 simple requirements. Let's build basic ride request and matching.",

    steps: [
      {
        id: 'two-sided',
        title: 'Step 1: Two-Sided Marketplace',
        alwaysAsk: "Who are the users?",
        whyItMatters: "Uber has TWO types of users: Riders and Drivers. Both need APIs.",
        expertBreakdown: {
          intro: "Two user types:",
          points: [
            "Riders: Request rides, see drivers, track rides",
            "Drivers: Go online, receive requests, complete rides",
            "Platform: Matches supply (drivers) with demand (riders)",
            "Both need separate APIs"
          ]
        },
        icon: '👥',
        category: 'functional'
      },
      {
        id: 'matching',
        title: 'Step 2: How Do We Match?',
        alwaysAsk: "How do we find the right driver?",
        whyItMatters: "Matching is THE core problem. Start simple: closest available driver.",
        expertBreakdown: {
          intro: "Simple matching:",
          points: [
            "Get rider's pickup location",
            "Query all available drivers",
            "Find closest one (distance calculation)",
            "Assign to ride"
          ]
        },
        icon: '🎯',
        category: 'functional'
      }
    ],

    startSimple: {
      title: "Phase 1 Architecture",
      description: "Client → Server → Database. Store rides and drivers, match by closest.",
      whySimple: "This works for a small city. We'll add real-time tracking and scale later.",
      nextStepPreview: "Step 1: Set up the ride request flow"
    }
  },

  scaleFramework: {
    title: "What's Coming Next?",
    intro: "After Phase 1, the platform will evolve:",
    celebrationMessage: "Your basic ride matching works!",
    hookMessage: "But riders can't see drivers on the map. And drivers can't accept/reject...",
    steps: [
      {
        id: 'realtime',
        title: 'Phase 2: Real-Time',
        question: "How do riders see drivers on the map?",
        whyItMatters: "Live location tracking is core to the experience",
        example: "WebSockets + geospatial queries",
        icon: '📍'
      },
      {
        id: 'scale',
        title: 'Phase 3: Scale',
        question: "What if two riders get the same driver?",
        whyItMatters: "Double-booking is a disaster",
        example: "Distributed locking, consistency",
        icon: '🔒'
      }
    ],
    nextStepsPreview: "First, let's build Phase 1!"
  }
};

// =============================================================================
// STEP 1: Connect Client to Server (Phase 1)
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚗',
  scenario: "Welcome to RideShare! You're building the next Uber.",
  hook: "A rider just downloaded your app. They're at a bar at 2 AM and need a ride home. But they can't request anything!",
  challenge: "Set up the basic system so riders can send ride requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your platform is online!',
  achievement: 'Riders can now send requests to your system',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive requests', after: '✓' },
  ],
  nextTeaser: "But where do we store rides and drivers?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Two-Sided Marketplace Architecture',
  conceptExplanation: `Uber is a **two-sided marketplace**:

**Side 1: Riders (Demand)**
- Open app, enter destination
- Request a ride
- Track driver, complete ride

**Side 2: Drivers (Supply)**
- Go online/offline
- Receive ride requests
- Accept and complete rides

**Your Platform (Matching Engine)**
- Connects supply with demand
- Finds the best driver for each rider
- Handles payments, disputes, etc.

For Phase 1, we'll focus on the rider side.`,

  whyItMatters: 'Understanding both sides of the marketplace is crucial for design.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Matching millions of rides daily',
    howTheyDoIt: 'Separate services for riders, drivers, and matching. Started with a simple PHP backend.',
  },

  keyPoints: [
    'Two user types: riders and drivers',
    'Platform matches supply and demand',
    'Both sides need APIs',
  ],

  keyConcepts: [
    { title: 'Rider', explanation: 'Demand side - needs rides', icon: '🧑' },
    { title: 'Driver', explanation: 'Supply side - provides rides', icon: '🚗' },
    { title: 'Matching', explanation: 'Platform connects both', icon: '🤝' },
  ],
};

const step1: GuidedStep = {
  id: 'uber-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Riders can request rides',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Rider requesting a ride', displayName: 'Rider App' },
      { type: 'app_server', reason: 'Handles ride requests', displayName: 'Ride Service' },
    ],
    successCriteria: [
      'Client added',
      'App Server added',
      'Connected together',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server onto the canvas',
    level2: 'Connect them together',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database for Rides and Drivers (Phase 1)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Riders are requesting rides! But where do we store them?",
  hook: "You need to track: Which drivers are available? Where are they? Which rides are in progress? Without a database, you can't match anyone.",
  challenge: "Add a database to store rides, drivers, and their locations.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Data is now stored!',
  achievement: 'Rides and driver info persisted',
  metrics: [
    { label: 'Rides stored', after: '✓' },
    { label: 'Driver locations', after: '✓' },
  ],
  nextTeaser: "Now let's implement the matching algorithm...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Data Model for Ride-Sharing',
  conceptExplanation: `**Core Tables:**

**1. Drivers**
\`\`\`sql
CREATE TABLE drivers (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  status VARCHAR(20),  -- online, offline, on_ride
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  updated_at TIMESTAMP
);
\`\`\`

**2. Rides**
\`\`\`sql
CREATE TABLE rides (
  id BIGINT PRIMARY KEY,
  rider_id BIGINT,
  driver_id BIGINT,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  dropoff_lat DECIMAL(10, 8),
  dropoff_lng DECIMAL(11, 8),
  status VARCHAR(20),  -- requested, matched, in_progress, completed
  created_at TIMESTAMP
);
\`\`\`

**Key: Driver Status**
- \`online\`: Available for rides
- \`offline\`: Not taking rides
- \`on_ride\`: Currently on a ride

**Geospatial Data:**
Latitude/longitude for locations. We'll optimize geospatial queries in Phase 2.`,

  whyItMatters: 'The data model is the foundation. Driver status and locations are critical for matching.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Tracking millions of drivers',
    howTheyDoIt: 'Started with PostgreSQL, now uses specialized geospatial databases and in-memory stores.',
  },

  keyPoints: [
    'Drivers table with status and location',
    'Rides table with pickup/dropoff',
    'Driver status is critical',
  ],

  keyConcepts: [
    { title: 'Driver Status', explanation: 'online, offline, on_ride', icon: '🟢' },
    { title: 'Geospatial', explanation: 'Latitude/longitude coordinates', icon: '📍' },
  ],
};

const step2: GuidedStep = {
  id: 'uber-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1 & FR-2: Store rides and drivers',
    taskDescription: 'Add Database for rides and driver locations',
    componentsNeeded: [
      { type: 'database', reason: 'Store rides and drivers', displayName: 'RideShare DB' },
    ],
    successCriteria: [
      'Database added',
      'App Server connected to Database',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Database component',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Implement Basic Matching (Phase 1 Complete)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🎯',
  scenario: "A rider requests a ride. Now what? We need to find them a driver!",
  hook: "There are 100 online drivers in the city. Which one should we assign? Let's start simple: the closest available driver.",
  challenge: "Implement basic matching: find the closest available driver.",
  illustration: 'matching',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 1 Complete! Basic matching works!',
  achievement: 'Riders can request rides and get matched to drivers',
  metrics: [
    { label: 'Request ride', after: '✓ Working' },
    { label: 'Match to driver', after: '✓ Closest driver' },
    { label: 'Data persisted', after: '✓' },
  ],
  nextTeaser: "But riders can't see drivers on the map. And drivers can't accept/reject...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Basic Matching Algorithm',
  conceptExplanation: `**Simple Matching: Closest Driver**

\`\`\`python
def find_driver(pickup_lat, pickup_lng):
    # Query all online drivers
    drivers = db.query("""
        SELECT id, current_lat, current_lng
        FROM drivers
        WHERE status = 'online'
    """)

    # Find closest driver (Haversine distance)
    closest = None
    min_distance = float('inf')

    for driver in drivers:
        dist = haversine(
            pickup_lat, pickup_lng,
            driver.lat, driver.lng
        )
        if dist < min_distance:
            min_distance = dist
            closest = driver

    return closest
\`\`\`

**Haversine Formula:**
Calculates distance between two lat/lng points on Earth:
\`\`\`python
def haversine(lat1, lng1, lat2, lng2):
    # Returns distance in kilometers
    # Accounts for Earth's curvature
    ...
\`\`\`

**Problems with this approach:**
1. Queries ALL drivers (doesn't scale)
2. No geospatial index
3. Doesn't account for traffic, ETA

We'll fix these in later phases!`,

  whyItMatters: 'Matching is THE core algorithm. Start simple, optimize later.',

  realWorldExample: {
    company: 'Uber (Early Days)',
    scenario: 'Simple matching',
    howTheyDoIt: 'Started with simple closest-driver matching. Now uses ML for optimal matching.',
  },

  keyPoints: [
    'Query available drivers',
    'Calculate distance (Haversine)',
    'Pick closest one',
  ],

  keyConcepts: [
    { title: 'Haversine', explanation: 'Earth distance formula', icon: '🌍' },
    { title: 'Matching', explanation: 'Assign rider to driver', icon: '🎯' },
  ],
};

const step3: GuidedStep = {
  id: 'uber-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Match rider to driver',
    taskDescription: 'Implement basic matching algorithm',
    successCriteria: [
      'Query available drivers',
      'Calculate distances',
      'Assign closest driver',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Implement the matching logic',
    level2: 'Query drivers WHERE status=online, calculate distances, pick closest',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 2: INTERMEDIATE - Real-Time Features
// =============================================================================

// =============================================================================
// STEP 4: Add Real-Time Driver Location (Phase 2)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📍',
  scenario: "Phase 2 begins! Riders want to see drivers on the map!",
  hook: "Riders open the app and see... nothing. 'Where are all the cars?' They need to see nearby drivers in REAL-TIME.",
  challenge: "NEW REQUIREMENT: FR-3 - Riders see nearby drivers on a live map.",
  illustration: 'live-map',
};

const step4Celebration: CelebrationContent = {
  emoji: '📍',
  message: 'Live driver map is working!',
  achievement: 'Riders see nearby drivers in real-time',
  metrics: [
    { label: 'Live map', after: '✓ Working' },
    { label: 'Update frequency', after: 'Every 3 seconds' },
  ],
  nextTeaser: "Now let's optimize the geospatial queries...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Location Updates',

  frameworkReminder: {
    question: "How do riders see drivers on the map?",
    connection: "FR-3 requires real-time updates. Polling every second doesn't scale. We need efficient location streaming."
  },

  conceptExplanation: `**NEW FR-3: See Nearby Drivers**

**The Challenge:**
- Drivers send location every 3 seconds
- Riders need to see all nearby drivers
- 100K drivers × update every 3s = 33K updates/sec!

**Two Approaches:**

**1. Polling (Simple, doesn't scale)**
\`\`\`
Rider → GET /drivers/nearby → Server → Query DB → Response
(Every 5 seconds)
\`\`\`
Problem: Too many requests at scale.

**2. WebSockets (Efficient)**
\`\`\`
Rider ←→ WebSocket ←→ Server
Server pushes updates when drivers move
\`\`\`

**Driver Location Flow:**
\`\`\`
Driver App (every 3s) → POST /location
Server → Update DB + Notify nearby riders via WebSocket
\`\`\`

**Geofencing:**
Don't send ALL drivers to riders. Only send drivers within X km.`,

  whyItMatters: 'Real-time is core to the Uber experience. WebSockets enable efficient updates.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Real-time driver tracking',
    howTheyDoIt: 'WebSocket connections with geofencing. Only sends relevant updates.',
  },

  keyPoints: [
    'WebSockets for real-time',
    'Geofencing limits data sent',
    'Drivers push location every 3s',
  ],

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent bidirectional connection', icon: '🔌' },
    { title: 'Geofencing', explanation: 'Only send nearby data', icon: '📍' },
  ],
};

const step4: GuidedStep = {
  id: 'uber-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Riders see nearby drivers',
    taskDescription: 'Implement real-time driver location updates',
    successCriteria: [
      'Drivers send location every 3 seconds',
      'Store location in database',
      'Push updates to nearby riders',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Implement location update endpoint',
    level2: 'POST /location from drivers, query nearby for riders',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Geospatial Index (Phase 2)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🗺️',
  scenario: "The 'find nearby drivers' query is too slow!",
  hook: "With 100K drivers, querying all of them and calculating distances takes 5 seconds. Riders are waiting forever!",
  challenge: "Add a geospatial index to make location queries fast.",
  illustration: 'geospatial',
};

const step5Celebration: CelebrationContent = {
  emoji: '🗺️',
  message: 'Geospatial queries are now fast!',
  achievement: 'Find nearby drivers in milliseconds',
  metrics: [
    { label: 'Query time', before: '5 seconds', after: '10ms' },
    { label: 'Geospatial index', after: '✓ Active' },
  ],
  nextTeaser: "Now let's let drivers accept or reject rides...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Geospatial Indexing',

  frameworkReminder: {
    question: "How do we find nearby drivers quickly?",
    connection: "Scanning all drivers doesn't scale. Geospatial indexes make location queries O(log n)."
  },

  conceptExplanation: `**The Problem:**
\`\`\`sql
-- This scans ALL drivers!
SELECT * FROM drivers
WHERE status = 'online'
ORDER BY haversine(lat, lng, ?, ?) ASC
LIMIT 10;
\`\`\`
At 100K drivers, this is too slow.

**Solution 1: Geohash**
Encode lat/lng into a string:
\`\`\`
(37.7749, -122.4194) → "9q8yyk"
\`\`\`
Nearby locations have similar prefixes!

**Solution 2: PostGIS (PostgreSQL Extension)**
\`\`\`sql
-- Create geospatial index
CREATE INDEX idx_driver_location
ON drivers USING GIST (
  ST_SetSRID(ST_MakePoint(lng, lat), 4326)
);

-- Fast nearby query
SELECT * FROM drivers
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(?, ?), 4326),
  5000  -- 5km radius
)
AND status = 'online';
\`\`\`

**Solution 3: Redis Geospatial**
\`\`\`
GEOADD drivers 122.4194 37.7749 "driver:123"
GEORADIUS drivers 122.4194 37.7749 5 km
\`\`\`
Super fast! Great for real-time.`,

  whyItMatters: 'Geospatial queries are THE performance bottleneck. Proper indexing is essential.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Finding nearby drivers',
    howTheyDoIt: 'Custom geospatial index with Google S2 cells. Divides Earth into hierarchical cells.',
  },

  keyPoints: [
    'Geohash or PostGIS for database',
    'Redis geo for real-time',
    'O(log n) instead of O(n)',
  ],

  keyConcepts: [
    { title: 'Geohash', explanation: 'Location encoded as string', icon: '🔢' },
    { title: 'Spatial Index', explanation: 'Fast location lookups', icon: '🗺️' },
  ],
};

const step5: GuidedStep = {
  id: 'uber-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'NFR: Fast geospatial queries',
    taskDescription: 'Add geospatial index with Redis or PostGIS',
    componentsNeeded: [
      { type: 'cache', reason: 'Redis for real-time geospatial', displayName: 'Redis Geo' },
    ],
    successCriteria: [
      'Add Cache (Redis) for geo queries',
      'Index driver locations',
      'Use GEORADIUS for nearby queries',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Redis for geospatial queries',
    level2: 'Use GEOADD to store, GEORADIUS to query',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Driver Accept/Reject (Phase 2 Complete)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '✅',
  scenario: "Drivers are getting matched, but they have no choice!",
  hook: "A driver is matched to a ride 20 minutes away. They want to reject it! Drivers need the ability to accept or reject ride requests.",
  challenge: "NEW REQUIREMENT: FR-4 - Drivers can accept or reject requests.",
  illustration: 'accept-reject',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 2 Complete! Real-time platform!',
  achievement: 'Live map, geospatial queries, driver accept/reject',
  metrics: [
    { label: 'Live driver map', after: '✓' },
    { label: 'Fast geo queries', after: '✓' },
    { label: 'Accept/reject', after: '✓' },
  ],
  nextTeaser: "Phase 3: What if two riders get the same driver?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Driver Accept/Reject Flow',

  frameworkReminder: {
    question: "Should drivers have to accept every ride?",
    connection: "FR-4 gives drivers choice. This changes the matching flow from instant to request-based."
  },

  conceptExplanation: `**NEW FR-4: Drivers Accept/Reject**

**New Flow:**
\`\`\`
1. Rider requests ride
2. Server finds closest driver
3. Server sends request to driver (push notification)
4. Driver has 15 seconds to accept/reject
5. If rejected or timeout → try next driver
6. If accepted → ride is matched
\`\`\`

**Driver App receives:**
\`\`\`json
{
  "ride_id": "abc123",
  "pickup": {"lat": 37.7, "lng": -122.4},
  "dropoff": {"lat": 37.8, "lng": -122.5},
  "estimated_fare": "$15",
  "estimated_distance": "5 miles",
  "timeout_seconds": 15
}
\`\`\`

**Timeout Handling:**
\`\`\`python
def request_driver(ride_id, driver_id):
    # Send push notification
    push_notification(driver_id, ride_request)

    # Set timeout
    redis.setex(f"request:{ride_id}", 15, driver_id)

    # If no response in 15s, try next driver
    schedule_fallback(ride_id, delay=15)
\`\`\`

**State Machine:**
\`\`\`
REQUESTED → PENDING_ACCEPT → MATCHED
              ↓ (timeout/reject)
         TRY_NEXT_DRIVER
\`\`\``,

  whyItMatters: 'Driver autonomy improves satisfaction. But adds complexity to matching.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Driver acceptance',
    howTheyDoIt: 'Drivers see ride details and have ~15 seconds to accept. Low acceptance rate affects future ride offers.',
  },

  keyPoints: [
    '15 second timeout',
    'Fallback to next driver',
    'State machine for ride status',
  ],

  keyConcepts: [
    { title: 'Accept Timeout', explanation: '15 seconds to respond', icon: '⏱️' },
    { title: 'Fallback', explanation: 'Try next driver on reject', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'uber-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Drivers accept/reject rides',
    taskDescription: 'Implement accept/reject flow with timeout',
    successCriteria: [
      'Send ride request to driver',
      'Handle accept/reject response',
      'Timeout after 15 seconds',
      'Fallback to next driver',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Implement timeout and fallback logic',
    level2: 'Use Redis for timeout tracking, try next driver on reject',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// PHASE 3: ADVANCED - Scale & Consistency
// =============================================================================

// =============================================================================
// STEP 7: Prevent Double-Booking (Phase 3)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔒',
  scenario: "Phase 3 begins! A DISASTER just happened...",
  hook: "Two riders requested a ride at the exact same moment. BOTH got matched to the same driver! One rider is stranded. This is a double-booking nightmare!",
  challenge: "Prevent double-booking with distributed locking.",
  illustration: 'double-booking',
};

const step7Celebration: CelebrationContent = {
  emoji: '🔒',
  message: 'Double-booking is now impossible!',
  achievement: 'Distributed locking prevents race conditions',
  metrics: [
    { label: 'Double-bookings', before: 'Possible', after: '0' },
    { label: 'Locking', after: 'Redis distributed lock' },
  ],
  nextTeaser: "Now let's add message queues for scale...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Locking',

  frameworkReminder: {
    question: "What if two requests get the same driver?",
    connection: "Race conditions cause double-booking. We need locks to ensure only one rider gets each driver."
  },

  conceptExplanation: `**The Problem: Race Condition**
\`\`\`
Time 0: Rider A requests ride
Time 0: Rider B requests ride
Time 1: Server 1 checks driver 123 → available
Time 1: Server 2 checks driver 123 → available
Time 2: Server 1 assigns driver 123 to Rider A
Time 2: Server 2 assigns driver 123 to Rider B
💥 DOUBLE BOOKING!
\`\`\`

**Solution: Distributed Lock (Redlock)**
\`\`\`python
def match_driver(ride_id, driver_id):
    # Try to acquire lock on driver
    lock = redis.set(
        f"lock:driver:{driver_id}",
        ride_id,
        nx=True,  # Only if not exists
        ex=30     # 30 second timeout
    )

    if not lock:
        return None  # Driver already locked

    try:
        # Check driver is still available
        driver = db.get_driver(driver_id)
        if driver.status != 'online':
            return None

        # Assign driver to ride
        db.update_ride(ride_id, driver_id=driver_id)
        db.update_driver(driver_id, status='on_ride')
        return driver

    finally:
        # Release lock
        redis.delete(f"lock:driver:{driver_id}")
\`\`\`

**Key Points:**
- Lock before checking availability
- Check-then-act atomically
- Always release lock`,

  whyItMatters: 'Double-booking destroys user trust. Consistency is critical for marketplaces.',

  famousIncident: {
    title: 'Early Uber Double-Booking',
    company: 'Uber',
    year: '2011',
    whatHappened: 'During launch, double-bookings happened frequently. Riders and drivers were frustrated.',
    lessonLearned: 'Distributed locking is essential for two-sided marketplaces.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Preventing double-booking',
    howTheyDoIt: 'Distributed locks with Redlock algorithm. Optimistic locking in database.',
  },

  keyPoints: [
    'Lock driver before matching',
    'Atomic check-then-act',
    'Always release locks',
  ],

  keyConcepts: [
    { title: 'Distributed Lock', explanation: 'Redis lock across servers', icon: '🔒' },
    { title: 'Race Condition', explanation: 'Concurrent access conflict', icon: '🏎️' },
  ],
};

const step7: GuidedStep = {
  id: 'uber-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'NFR: Prevent double-booking',
    taskDescription: 'Implement distributed locking',
    successCriteria: [
      'Lock driver before matching',
      'Check availability inside lock',
      'Release lock on complete/error',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Use Redis SETNX for locking',
    level2: 'Lock driver_id, check status, assign, release',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Message Queue (Phase 3)
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📬',
  scenario: "Your platform is processing 10,000 ride requests per minute!",
  hook: "The matching service is overwhelmed. Requests are timing out. You need to decouple and scale the matching process.",
  challenge: "Add message queues to handle ride requests asynchronously.",
  illustration: 'message-queue',
};

const step8Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Async processing enabled!',
  achievement: 'Ride requests processed via message queue',
  metrics: [
    { label: 'Request handling', after: 'Async via Kafka' },
    { label: 'Matching throughput', after: '10x higher' },
  ],
  nextTeaser: "Now let's add load balancing...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Async Matching with Message Queues',

  frameworkReminder: {
    question: "How do we handle 10K requests/minute?",
    connection: "Synchronous matching doesn't scale. Message queues decouple request intake from processing."
  },

  conceptExplanation: `**The Problem:**
\`\`\`
Rider → Request Ride → Match Driver → Response
           (synchronous - blocks for 2-5 seconds)
\`\`\`
At high load, matching becomes bottleneck.

**The Solution: Event-Driven**
\`\`\`
Rider → Request Ride → Enqueue → Response (immediate)
                          ↓
                   Matching Service
                          ↓
                   Push to Rider/Driver
\`\`\`

**Kafka Topics:**
\`\`\`
ride-requests   → Matching Service
driver-updates  → Location Service
ride-events     → Analytics, Notifications
\`\`\`

**Matching Worker:**
\`\`\`python
def match_worker():
    while True:
        event = kafka.consume('ride-requests')
        ride_id = event['ride_id']
        pickup = event['pickup']

        # Find and lock driver
        driver = find_and_lock_driver(pickup)

        if driver:
            notify_rider(ride_id, driver)
            notify_driver(driver.id, ride_id)
        else:
            # No drivers available
            notify_rider(ride_id, status='no_drivers')
\`\`\``,

  whyItMatters: 'Message queues enable independent scaling of components.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Processing millions of rides',
    howTheyDoIt: 'Kafka for event streaming. Separate matching service that scales independently.',
  },

  keyPoints: [
    'Enqueue immediately, process async',
    'Matching service scales independently',
    'Push results to riders/drivers',
  ],

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Kafka for async events', icon: '📬' },
    { title: 'Event-Driven', explanation: 'React to events', icon: '⚡' },
  ],
};

const step8: GuidedStep = {
  id: 'uber-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'NFR: Scale matching',
    taskDescription: 'Add message queue for async processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue ride requests', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Add Message Queue',
      'Enqueue ride requests',
      'Matching service consumes from queue',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Kafka for ride request events',
    level2: 'Request → enqueue → return immediately → worker matches',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add Load Balancer (Phase 3 Complete)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Friday night rush hour! Your single server can't keep up.",
  hook: "10,000 concurrent users. 500 ride requests per minute. One server is melting!",
  challenge: "Add load balancing to scale horizontally.",
  illustration: 'load-balancer',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Phase 3 Complete! Production scale!',
  achievement: 'Distributed locking, async processing, load balancing',
  metrics: [
    { label: 'Double-booking', after: 'Impossible' },
    { label: 'Async matching', after: '✓ Kafka' },
    { label: 'Horizontal scale', after: '✓ Load balanced' },
  ],
  nextTeaser: "Phase 4: ETA prediction and surge pricing!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing',

  frameworkReminder: {
    question: "How do we handle 10K concurrent users?",
    connection: "Single server can't handle the load. Load balancer distributes across multiple servers."
  },

  conceptExplanation: `**The Math:**
- One server: ~1,000 concurrent connections
- Your load: 10,000 concurrent users
- Servers needed: 10+

**Load Balancer:**
- Distributes requests across servers
- Health checks remove unhealthy servers
- No single point of failure

**Strategies for Uber:**
- **Round Robin**: Simple, works for stateless
- **Least Connections**: Good for variable request times
- **Geo-Based**: Route to nearest datacenter

**Sticky Sessions:**
For WebSocket connections (real-time tracking):
- Same user → same server
- Maintains connection state`,

  whyItMatters: 'Load balancing enables horizontal scaling.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Handling Friday night rush',
    howTheyDoIt: 'Multiple layers of load balancing. Auto-scaling based on request volume.',
  },

  keyPoints: [
    'Distribute traffic',
    'Horizontal scaling',
    'WebSocket sticky sessions',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests', icon: '⚖️' },
    { title: 'Sticky Session', explanation: 'Same user → same server', icon: '📌' },
  ],
};

const step9: GuidedStep = {
  id: 'uber-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'NFR: Handle peak load',
    taskDescription: 'Add load balancer',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Client → LB → App Servers',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add LB between Client and servers',
    level2: 'Client → Load Balancer → multiple App Servers',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// PHASE 4: EXPERT - ETA, Surge, Multi-Region
// =============================================================================

// =============================================================================
// STEP 10: ETA Prediction (Phase 4)
// =============================================================================

const step10Story: StoryContent = {
  emoji: '⏱️',
  scenario: "Phase 4 begins! Riders want to know when their driver arrives.",
  hook: "The app shows ETA: 5 minutes. But the driver is stuck in traffic and arrives in 15 minutes. Riders are frustrated!",
  challenge: "Build accurate ETA prediction.",
  illustration: 'eta',
};

const step10Celebration: CelebrationContent = {
  emoji: '⏱️',
  message: 'ETA prediction is accurate!',
  achievement: 'Real-time traffic-aware ETA',
  metrics: [
    { label: 'ETA accuracy', before: '±50%', after: '±10%' },
    { label: 'Traffic data', after: 'Real-time' },
  ],
  nextTeaser: "Now let's implement surge pricing...",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'ETA Prediction',

  frameworkReminder: {
    question: "How do we predict arrival time?",
    connection: "ETA affects user experience. Inaccurate ETAs lead to frustration."
  },

  conceptExplanation: `**Simple ETA (Naive):**
\`\`\`
ETA = distance / average_speed
\`\`\`
Problem: Doesn't account for traffic!

**Better ETA:**
\`\`\`
ETA = route_time(current_traffic) + pickup_time
\`\`\`

**Factors:**
1. **Distance**: Straight-line vs actual route
2. **Traffic**: Real-time conditions
3. **Historical**: Same time/day patterns
4. **Driver behavior**: Individual patterns

**Architecture:**
\`\`\`
Driver Location → ETA Service ← Traffic API
       ↓               ↓
    Pickup        Calculate Time
       ↓               ↓
   Route API     Return ETA
\`\`\`

**ML for ETA:**
\`\`\`python
def predict_eta(driver_loc, pickup_loc):
    # Route from mapping API
    route = maps_api.get_route(driver_loc, pickup_loc)

    # Adjust for real-time traffic
    traffic_factor = traffic_api.get_factor(route)

    # ML model considers historical patterns
    eta = model.predict(route, traffic_factor, time_of_day)

    return eta
\`\`\``,

  whyItMatters: 'Accurate ETA is critical for user trust. It affects when riders leave to meet drivers.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'ETA prediction',
    howTheyDoIt: 'ML models trained on billions of historical rides. Real-time traffic from GPS data.',
  },

  keyPoints: [
    'Route-aware distance',
    'Real-time traffic',
    'ML for patterns',
  ],

  keyConcepts: [
    { title: 'ETA', explanation: 'Estimated Time of Arrival', icon: '⏱️' },
    { title: 'Traffic Factor', explanation: 'Multiplier for traffic', icon: '🚗' },
  ],
};

const step10: GuidedStep = {
  id: 'uber-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'NFR: Accurate ETA prediction',
    taskDescription: 'Build ETA prediction service',
    successCriteria: [
      'Calculate route distance',
      'Factor in real-time traffic',
      'Return accurate ETA',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Build ETA service with routing',
    level2: 'Route API + traffic factor + historical patterns',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 11: Surge Pricing (Phase 4)
// =============================================================================

const step11Story: StoryContent = {
  emoji: '💰',
  scenario: "New Year's Eve. Everyone wants a ride. No drivers available!",
  hook: "10,000 riders requesting, only 500 drivers online. Wait times are 30+ minutes. How do we balance supply and demand?",
  challenge: "Implement surge pricing to balance supply and demand.",
  illustration: 'surge',
};

const step11Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Surge pricing is working!',
  achievement: 'Dynamic pricing balances supply/demand',
  metrics: [
    { label: 'Supply/demand balance', after: '✓ Dynamic' },
    { label: 'Driver availability', after: 'Incentivized' },
  ],
  nextTeaser: "One final step: multi-region!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Surge Pricing (Dynamic Pricing)',

  frameworkReminder: {
    question: "How do we balance supply and demand?",
    connection: "When demand > supply, prices rise. This incentivizes more drivers and reduces demand."
  },

  conceptExplanation: `**The Economics:**
- High demand + low supply = long wait times
- Surge pricing:
  - Reduces demand (some riders wait)
  - Increases supply (drivers go online for higher fares)

**Surge Multiplier:**
\`\`\`python
def calculate_surge(area_id):
    # Count recent ride requests in area
    demand = count_requests(area_id, last_5_minutes)

    # Count available drivers in area
    supply = count_available_drivers(area_id)

    # Calculate ratio
    ratio = demand / max(supply, 1)

    # Convert to multiplier (capped)
    if ratio <= 1:
        return 1.0
    elif ratio <= 2:
        return 1.5
    elif ratio <= 3:
        return 2.0
    else:
        return min(ratio, 5.0)  # Cap at 5x
\`\`\`

**Real-Time Updates:**
- Surge calculated per area (geofenced zones)
- Updated every minute
- Shown to riders before they confirm

**Hexagonal Grid:**
Divide city into hexagons for surge calculation:
\`\`\`
Each hex: ~0.5 km radius
Surge calculated per hex
Adjacent hexes may have different surge
\`\`\``,

  whyItMatters: 'Surge pricing is controversial but effective at balancing supply/demand.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'New Year\'s Eve surge',
    howTheyDoIt: 'Real-time surge based on hex grid. Updates every 2 minutes. Shows multiplier to riders.',
  },

  keyPoints: [
    'Demand/supply ratio',
    'Per-area calculation',
    'Real-time updates',
  ],

  keyConcepts: [
    { title: 'Surge', explanation: 'Price multiplier', icon: '💰' },
    { title: 'Hex Grid', explanation: 'Area-based calculation', icon: '⬡' },
  ],
};

const step11: GuidedStep = {
  id: 'uber-step-11',
  stepNumber: 11,
  frIndex: 0,

  story: step11Story,
  learnPhase: step11LearnPhase,

  practicePhase: {
    frText: 'NFR: Dynamic pricing',
    taskDescription: 'Implement surge pricing',
    successCriteria: [
      'Calculate demand/supply ratio',
      'Compute surge multiplier per area',
      'Show surge to riders before booking',
    ],
  },

  celebration: step11Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Calculate demand/supply ratio',
    level2: 'Count requests vs drivers per area, compute multiplier',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 12: Multi-Region (Phase 4 Complete)
// =============================================================================

const step12Story: StoryContent = {
  emoji: '🌍',
  scenario: "RideShare is expanding to 100 cities worldwide!",
  hook: "Users in Tokyo connect to servers in San Francisco. 200ms latency makes the app feel slow. We need regional infrastructure.",
  challenge: "Deploy multi-region architecture for global scale.",
  illustration: 'multi-region',
};

const step12Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You\'ve mastered Uber system design!',
  achievement: 'From simple matching to global ride-sharing platform',
  metrics: [
    { label: 'Rides/day', after: '15M+' },
    { label: 'Cities', after: '100+' },
    { label: 'Global latency', after: '< 100ms' },
    { label: 'Features', after: 'Matching, ETA, Surge' },
  ],
  nextTeaser: "You've completed the Uber journey!",
};

const step12LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Architecture',

  frameworkReminder: {
    question: "How do we serve users globally?",
    connection: "Regional deployment reduces latency. But adds complexity for data consistency."
  },

  conceptExplanation: `**Single Region Problems:**
- High latency for distant users
- Single point of failure
- All traffic through one location

**Multi-Region Architecture:**
\`\`\`
US-East:    [LB] → [Services] → [DB Primary]
                                      ↓ replicate
US-West:    [LB] → [Services] → [DB Replica]
                                      ↓ replicate
EU-West:    [LB] → [Services] → [DB Replica]
                                      ↓ replicate
APAC:       [LB] → [Services] → [DB Replica]
\`\`\`

**Key Decisions:**

**1. Data Partitioning:**
- Rides are regional (SF ride doesn't need Tokyo data)
- Partition by city/region
- Cross-region queries rare

**2. Routing:**
- GeoDNS routes users to nearest region
- API Gateway routes to correct region

**3. Consistency:**
- Regional data is consistent within region
- Global data (user accounts) uses eventual consistency

**Cell-Based Architecture:**
Each city is an independent "cell":
- Own databases, caches, services
- Can fail independently
- Can scale independently`,

  whyItMatters: 'Global scale requires regional deployment. This is expert-level architecture.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Operating in 70+ countries',
    howTheyDoIt: 'Cell-based architecture. Each city is mostly independent. Cross-city traffic is minimal.',
  },

  keyPoints: [
    'Regional deployment',
    'Data partitioned by city',
    'Cell-based independence',
  ],

  keyConcepts: [
    { title: 'Multi-Region', explanation: 'Servers in multiple locations', icon: '🌍' },
    { title: 'Cell', explanation: 'Independent unit per city', icon: '🔲' },
  ],
};

const step12: GuidedStep = {
  id: 'uber-step-12',
  stepNumber: 12,
  frIndex: 0,

  story: step12Story,
  learnPhase: step12LearnPhase,

  practicePhase: {
    frText: 'NFR: Global scale',
    taskDescription: 'Design multi-region architecture',
    successCriteria: [
      'Regional deployments',
      'Data partitioned by city',
      'GeoDNS for routing',
    ],
  },

  celebration: step12Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Design cell-based architecture',
    level2: 'Each city is a cell with own infra, route by geo',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE PROGRESSIVE TUTORIAL
// =============================================================================

export const uberProgressiveGuidedTutorial: GuidedTutorial = {
  problemId: 'uber-progressive',
  title: 'Design Uber',
  description: 'Build an evolving ride-sharing platform from simple matching to global-scale marketplace',
  difficulty: 'beginner', // Starts beginner, evolves to expert
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🚗',
    hook: "Welcome to RideShare! You're building the next Uber.",
    scenario: "Your journey: Start with basic ride matching, add real-time tracking, solve the double-booking problem, and scale globally with ETA and surge pricing.",
    challenge: "Can you build a ride-sharing platform that handles 15 million rides per day?",
  },

  requirementsPhase: phase1Requirements,

  steps: [
    // Phase 1: Beginner (Steps 1-3)
    step1, step2, step3,
    // Phase 2: Intermediate (Steps 4-6)
    step4, step5, step6,
    // Phase 3: Advanced (Steps 7-9)
    step7, step8, step9,
    // Phase 4: Expert (Steps 10-12)
    step10, step11, step12,
  ],

  concepts: [
    'Two-Sided Marketplace',
    'Geospatial Data Model',
    'Matching Algorithm',
    'Real-Time Location Updates',
    'Geospatial Indexing (Geohash, PostGIS, Redis Geo)',
    'Driver Accept/Reject Flow',
    'Distributed Locking',
    'Message Queues',
    'Load Balancing',
    'ETA Prediction',
    'Surge Pricing',
    'Multi-Region Architecture',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 8: Distributed Locks',
  ],
};

export default uberProgressiveGuidedTutorial;
