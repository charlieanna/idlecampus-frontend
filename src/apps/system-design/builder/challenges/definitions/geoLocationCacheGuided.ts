import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Geo Location Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches caching strategies for
 * location-based services. Focus areas: geospatial indexing, proximity queries,
 * and regional caching.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic geo cache system - FRs satisfied!
 * Steps 4-6: Apply geospatial indexing, proximity queries, regional caching
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const geoLocationCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a geo-location cache system for a location-based service like Uber, Yelp, or Pokemon Go",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Location Services Lead',
    avatar: '🗺️',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-location-updates',
      category: 'functional',
      question: "What are the core location operations we need to support?",
      answer: "Our location service needs three main operations:\n1. **Update Location**: Users/drivers/assets send GPS coordinates (lat, lon) to update their position\n2. **Find Nearby**: Query for entities within a radius (e.g., 'find drivers within 2 miles')\n3. **Track Movement**: Show real-time movement of entities on a map",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Location services are fundamentally about spatial queries - finding things near other things",
    },
    {
      id: 'location-precision',
      category: 'functional',
      question: "How precise do locations need to be? Exact GPS coordinates or is approximate location okay?",
      answer: "For ride-sharing, we need ~10 meter precision (GPS level). For restaurant discovery, ~100 meter precision is fine. We'll optimize for GPS-level precision but support both use cases.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Precision requirements affect data structure choices - precise location needs different indexing than approximate",
    },
    {
      id: 'update-frequency',
      category: 'functional',
      question: "How often do locations update? Every second? Every minute?",
      answer: "It varies by use case:\n- **Active tracking** (drivers, delivery): Every 3-5 seconds\n- **Background tracking** (users browsing): Every 30-60 seconds\n- **Static locations** (restaurants, stores): Rarely or never\n\nFor this system, assume 5-second updates for active entities.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Update frequency determines write load and cache TTL strategy",
    },

    // IMPORTANT - Clarifications
    {
      id: 'privacy-requirements',
      category: 'clarification',
      question: "What about location privacy? Do we need to obfuscate exact positions?",
      answer: "Yes! For privacy:\n- **Drivers/service providers**: Show exact location only to matched customers\n- **Users**: Show approximate location (grid-snapped) to others\n- **Historical data**: Anonymize after 30 days\n\nCache different precision levels based on viewer permissions.",
      importance: 'important',
      insight: "Privacy requires multi-tier location caching with access control",
    },
    {
      id: 'proximity-search',
      category: 'clarification',
      question: "For 'find nearby' queries - are we talking 1 mile radius? 10 miles? How does distance matter?",
      answer: "Typical queries:\n- **Ride-sharing**: 0.5-2 miles (immediate pickup)\n- **Food delivery**: 2-5 miles (delivery range)\n- **Discovery** (restaurants, stores): 5-25 miles\n\nWe need to support variable radius queries efficiently.",
      importance: 'critical',
      insight: "Different use cases need different radius defaults - but system must handle variable radius",
    },
    {
      id: 'regional-caching',
      category: 'clarification',
      question: "Do we cache globally or regionally? Does a user in NYC need to know about drivers in Tokyo?",
      answer: "Regional caching is essential! Partition by geographic regions:\n- **City-level** for dense urban areas (NYC, SF, London)\n- **Country-level** for less dense regions\n- **Cross-region queries** for edge cases (near borders)\n\nThis dramatically reduces cache size and query scope.",
      importance: 'critical',
      insight: "Geographic partitioning is the key to scaling location services",
    },

    // SCOPE
    {
      id: 'scope-navigation',
      category: 'scope',
      question: "Do we need routing/navigation, or just location tracking and proximity?",
      answer: "Just location tracking and proximity search. Routing/navigation is out of scope - assume a separate service handles that.",
      importance: 'nice-to-have',
      insight: "Focus on caching location data, not path computation",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-entities',
      category: 'throughput',
      question: "How many entities (users, drivers, assets) are we tracking?",
      answer: "10 million active entities globally at peak times",
      importance: 'critical',
      learningPoint: "Entity count determines memory footprint and indexing strategy",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many location updates per second?",
      answer: "With 10M entities updating every 5 seconds average, that's about 2 million location updates per second",
      importance: 'critical',
      calculation: {
        formula: "10M entities ÷ 5 sec = 2M updates/sec",
        result: "~2M writes/sec at peak",
      },
      learningPoint: "Extremely write-heavy system - need efficient write path",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many proximity queries per second?",
      answer: "About 500,000 proximity searches per second (users searching for nearby entities)",
      importance: 'critical',
      calculation: {
        formula: "500K proximity queries/sec",
        result: "~500K spatial queries/sec",
      },
      learningPoint: "Spatial queries are expensive - need geospatial indexing",
    },
    {
      id: 'latency-update',
      category: 'latency',
      question: "How fast should location updates be acknowledged?",
      answer: "p99 under 100ms. Drivers/users expect instant confirmation their location was recorded.",
      importance: 'critical',
      learningPoint: "Fast ack is critical for user experience - write to cache, async to DB",
    },
    {
      id: 'latency-proximity',
      category: 'latency',
      question: "How fast should proximity queries return?",
      answer: "p99 under 200ms. When a user requests a ride or searches for restaurants, they expect instant results.",
      importance: 'critical',
      learningPoint: "Proximity queries must use spatial indexes - can't scan all entities",
    },
    {
      id: 'freshness-requirement',
      category: 'consistency',
      question: "How fresh does location data need to be? Is 10-second staleness acceptable?",
      answer: "For active tracking (drivers), 5-10 seconds staleness is acceptable. For static locations (restaurants), minutes or hours is fine. Real-time doesn't mean zero latency - eventual consistency works!",
      importance: 'critical',
      learningPoint: "Acceptable staleness enables aggressive caching - don't over-optimize for 'real-time'",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-location-updates', 'location-precision', 'proximity-search'],
  criticalFRQuestionIds: ['core-location-updates', 'update-frequency', 'proximity-search'],
  criticalScaleQuestionIds: ['throughput-writes', 'throughput-reads', 'latency-proximity'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Update entity locations',
      description: 'Users, drivers, assets can update their GPS coordinates',
      emoji: '📍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Proximity search',
      description: 'Find entities within a radius (e.g., drivers within 2 miles)',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Real-time tracking',
      description: 'Show entity movement on a map with acceptable freshness (5-10 sec)',
      emoji: '🗺️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: High-frequency updates',
      description: 'Support location updates every 3-5 seconds for active entities',
      emoji: '⚡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million active entities',
    writesPerDay: '172 billion location updates',
    readsPerDay: '43 billion proximity queries',
    peakMultiplier: 3,
    readWriteRatio: '1:4 (write-heavy!)',
    calculatedWriteRPS: { average: 2000000, peak: 6000000 },
    calculatedReadRPS: { average: 500000, peak: 1500000 },
    maxPayloadSize: '~100 bytes per location update',
    redirectLatencySLA: 'p99 < 100ms (location update)',
    createLatencySLA: 'p99 < 200ms (proximity query)',
  },

  architecturalImplications: [
    '✅ 2M writes/sec → Need distributed cache with sharding',
    '✅ 500K spatial queries/sec → Geospatial indexing (geohash, quadtree)',
    '✅ Write-heavy (4:1) → Write-optimized cache, async DB writes',
    '✅ 10M entities × 100 bytes = 1GB → Entire dataset fits in memory!',
    '✅ Regional partitioning → Shard by geographic region',
    '✅ 5-10 sec freshness → Cache with short TTL acceptable',
  ],

  outOfScope: [
    'Routing and navigation',
    'Historical location analytics',
    'Geofencing and boundaries',
    'Elevation/3D coordinates',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where entities can update locations and clients can query nearby entities. The complexity of geospatial indexing and regional sharding comes later. Functionality first, optimization second!",
};

// =============================================================================
// STEP 1: Connect Client to Location Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! You're building a location service for a ride-sharing app.",
  hook: "Your first driver just came online and needs to share their GPS coordinates!",
  challenge: "Set up the basic request flow - Client to App Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your location service is online!",
  achievement: "Entities can now send location updates to your server",
  metrics: [
    { label: 'Status', after: 'Connected' },
    { label: 'Ready for GPS data', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process location data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Location Service Architecture',
  conceptExplanation: `Every location-based service starts with an **App Server** that receives GPS coordinates.

When a driver updates their location:
1. Client sends: { "entity_id": "driver-123", "lat": 37.7749, "lon": -122.4194, "timestamp": "..." }
2. App Server receives the location update
3. App Server processes and stores the location

For now, we'll keep it simple - just connect the client to the server.`,

  whyItMatters: 'The app server is the entry point for all location updates. Without it, you can\'t track entities or answer proximity queries.',

  keyPoints: [
    'App servers handle location update API requests',
    'Clients send GPS coordinates (latitude, longitude)',
    'This is the foundation we\'ll build caching and indexing on top of',
  ],

  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│ (Driver App)│ ◀────── │   (Location)    │
└─────────────┘         └─────────────────┘
  GPS update            acknowledgment
`,

  interviewTip: 'Start simple with Client-Server. Add complexity (caching, spatial indexes, etc.) incrementally.',
};

const step1: GuidedStep = {
  id: 'geo-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Entities can send location updates',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents entities sending GPS updates', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes location updates', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Entities send location updates' },
    ],
    successCriteria: ['Client connected to App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Add Client and App Server components',
    level2: 'Connect Client to App Server to enable location updates',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Location Update Handler (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📍',
  scenario: "Your server is connected, but it doesn't know how to handle location data!",
  hook: "A driver just sent their GPS coordinates, but the server returned an error. We need to implement the location update logic!",
  challenge: "Write Python code to receive, validate, and store location updates.",
  illustration: 'coding',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Location updates are working!",
  achievement: "Drivers can now update their positions",
  metrics: [
    { label: 'API configured', after: '✓' },
    { label: 'Code working', after: '✓' },
  ],
  nextTeaser: "But wait... when the server restarts, all locations are lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Location Update API: Handling GPS Coordinates',
  conceptExplanation: `Your location service needs to handle location update requests.

**API Design: POST /api/v1/locations**
- Receives: Entity ID, latitude, longitude, timestamp
- Validates: Coordinates in valid range (-90 to 90 lat, -180 to 180 lon)
- Stores: In memory (for now)
- Returns: Acknowledgment

**What the code does**:
1. Parse location update request
2. Validate coordinates
3. Store in memory dictionary: { entity_id: { lat, lon, timestamp } }
4. Return success response

**Validation is critical**:
- Latitude: -90 to 90 degrees
- Longitude: -180 to 180 degrees
- Timestamp: Recent (not too old)`,

  whyItMatters: 'Without proper validation, bad GPS data corrupts your location index. Garbage in, garbage out!',

  famousIncident: {
    title: 'Pokemon Go Launch Chaos',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Pokemon Go launched with massive demand. Their location services couldn\'t handle the write load - millions of players updating GPS coordinates every few seconds. The service crashed repeatedly for weeks.',
    lessonLearned: 'Location services need to handle extreme write load. Caching and efficient writes are not optional.',
    icon: '🎮',
  },

  keyPoints: [
    'POST endpoint ingests GPS coordinates',
    'Validate lat/lon ranges to prevent bad data',
    'Store in memory for now (database comes next)',
    'Include timestamp to detect stale updates',
  ],
};

const step2: GuidedStep = {
  id: 'geo-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Process location updates with validation',
    taskDescription: 'Implement Python handlers for location updates',
    successCriteria: [
      'Configure POST /api/v1/locations API',
      'Implement Python handler for location updates',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Assign the location update API and implement the handler',
    level2: 'Configure API endpoint and write Python code to validate and store GPS coordinates',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Location Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your server crashed and restarted at 3 AM.",
  hook: "When it came back online... every driver's location was GONE! Users can't find any available drivers!",
  challenge: "The problem: locations were stored in server memory. When the server restarted, millions of locations vanished. We need persistent storage!",
  illustration: 'database',
};

const step3Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: "Your location data is now persistent!",
  achievement: "Locations survive server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted' },
    { label: 'Storage', after: 'Database' },
  ],
  nextTeaser: "Good! But proximity queries are taking 5 seconds - way too slow!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persisting Location Data',
  conceptExplanation: `Without a database, your app server stores locations in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all location data is lost!

**Solution**: Store data in a database.

**What we store**:
- Current location per entity (entity_id, lat, lon, timestamp)
- Historical location trail (for debugging, analytics)
- Entity metadata (entity type, status)

**Database choice matters**:
- **Relational DB** (PostgreSQL with PostGIS): Good for complex queries, ACID
- **NoSQL** (MongoDB with geospatial): Good for high write throughput
- **Specialized** (Redis with geo commands): Fastest for in-memory caching`,

  whyItMatters: 'Without persistent storage, all your location data disappears when the server restarts! Users expect their positions to be tracked reliably.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Tracking millions of drivers globally',
    howTheyDoIt: 'Uses combination of PostgreSQL/PostGIS for persistence and Redis for hot location cache. All location updates write to both.',
  },

  keyPoints: [
    'Store current locations in database',
    'Database provides durability and queryability',
    'But database queries for proximity are slow (no spatial index yet)',
    'Next step: add caching and spatial indexing',
  ],
};

const step3: GuidedStep = {
  id: 'geo-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Location data must persist',
    taskDescription: 'Add Database and connect it to App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Store location data persistently', displayName: 'Database' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Database and connect it to App Server',
    level2: 'App Server will write location updates to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Fast Location Lookups
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Users are complaining! 'Why does it take so long to find nearby drivers?'",
  hook: "Your proximity queries are hitting the database every time - that's 500K queries/sec! The database can't keep up!",
  challenge: "Add a cache layer to store recent locations. Serve proximity queries from cache instead of database!",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Location lookups are now lightning fast!",
  achievement: "Cache serves location queries in milliseconds",
  metrics: [
    { label: 'Query latency', before: '500ms', after: '10ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'DB query load', before: '500K/sec', after: '25K/sec' },
  ],
  nextTeaser: "Excellent! But proximity searches still scan ALL entities - that's inefficient!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Location Caching: The Secret to Low Latency',
  conceptExplanation: `**Key insight**: Recent locations are queried repeatedly.

**The math**:
- Database query: 50-200ms
- Cache lookup: 1-5ms
- That's **50-200x faster!**

**How location caching works**:
1. Entity updates location → Write to DB AND cache
2. Proximity query arrives
3. **Cache HIT**: Return from Redis instantly (5ms)
4. **Cache MISS**: Query database, update cache, return (100ms)

**Write-through pattern** for location:
- Every location update writes to BOTH cache and database
- Cache always has the latest locations
- Queries almost always hit cache (95%+ hit rate)

**Cache structure**:
\`\`\`
SET location:{entity_id} "{lat: 37.7749, lon: -122.4194, ts: ...}" EX 60
\`\`\`
- Key: location:{entity_id}
- Value: JSON with lat, lon, timestamp
- TTL: 60 seconds (auto-expire stale locations)`,

  whyItMatters: 'Without caching, every location query hits the database. At 500K queries/sec, the database becomes the bottleneck.',

  realWorldExample: {
    company: 'Lyft',
    scenario: 'Real-time driver tracking',
    howTheyDoIt: 'Uses Redis with 30-second TTL for active driver locations. 98% cache hit rate. Database only for historical queries.',
  },

  famousIncident: {
    title: 'Uber Outage During NYE',
    company: 'Uber',
    year: '2015',
    whatHappened: 'New Year\'s Eve surge demand overwhelmed their location service. Database couldn\'t handle the query load. Service was down for hours during peak demand.',
    lessonLearned: 'Caching is essential for location services at scale. The database cannot handle all read load.',
    icon: '🚗',
  },

  keyPoints: [
    'Write-through pattern: Update cache AND database on every write',
    'Cache with short TTL (30-60 seconds) for active entities',
    'Cache key format: location:{entity_id}',
    '95%+ cache hit ratio for active entities',
  ],
};

const step4: GuidedStep = {
  id: 'geo-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Location queries must be fast (< 200ms p99)',
    taskDescription: 'Add Redis cache for location data',
    componentsNeeded: [
      { type: 'cache', reason: 'Store recent locations for fast access', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Configure write-through caching',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add Cache between App Server and Database',
    level2: 'App Server writes to both Cache and Database, reads from Cache first',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Implement Geospatial Indexing (Geohash)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🗺️',
  scenario: "Your proximity queries work, but they're SLOW and EXPENSIVE!",
  hook: "To find drivers within 2 miles, you're scanning ALL 10 million entities! That's crazy inefficient!",
  challenge: "Implement geospatial indexing using geohash to organize entities by location.",
  illustration: 'geospatial-index',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Proximity queries are now efficient!",
  achievement: "Geohash indexing reduces proximity search from 10M entities to ~1000",
  metrics: [
    { label: 'Proximity query time', before: '5000ms', after: '50ms' },
    { label: 'Entities scanned', before: '10M', after: '~1K' },
    { label: 'Index type', after: 'Geohash' },
  ],
  nextTeaser: "Great! Now let's add regional caching to reduce data volume...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Geospatial Indexing: Making Proximity Queries Efficient',
  conceptExplanation: `**The problem**: Finding entities within a radius requires checking EVERY entity's distance.

**Naive approach** (TOO SLOW):
\`\`\`python
def find_nearby(lat, lon, radius_miles):
    results = []
    for entity in all_entities:  # 10 million iterations!
        distance = haversine_distance(lat, lon, entity.lat, entity.lon)
        if distance <= radius_miles:
            results.append(entity)
    return results
\`\`\`

**The solution: Geospatial Indexing**

**Geohash** encodes lat/lon into a short string:
- (37.7749, -122.4194) → "9q8yyk"
- Nearby locations share prefixes!
- (37.7750, -122.4195) → "9q8yyk" (same!)

**How it works**:
1. Update location → Compute geohash → Store in sorted set
2. Proximity query → Compute geohash → Find all entities with similar prefix

**Redis implementation**:
\`\`\`python
# Add entity to geospatial index
GEOADD drivers -122.4194 37.7749 driver-123

# Find entities within radius
GEORADIUS drivers -122.4194 37.7749 2 mi WITHDIST

# Returns: [(driver-123, 0.5), (driver-456, 1.2), ...]
\`\`\`

**Complexity**:
- Naive scan: O(N) - check all 10M entities
- Geohash: O(log N + K) - K nearby entities
- **100-10000x faster!**`,

  whyItMatters: 'Without spatial indexing, proximity queries don\'t scale. You can\'t scan millions of entities per query.',

  realWorldExample: {
    company: 'Yelp',
    scenario: 'Finding nearby restaurants from 200M+ listings',
    howTheyDoIt: 'Uses Elasticsearch with geohash grid aggregation. Can return nearby results from billions of documents in <50ms.',
  },

  famousIncident: {
    title: 'Foursquare Database Meltdown',
    company: 'Foursquare',
    year: '2010',
    whatHappened: 'Foursquare\'s location database went down for 11 hours. They were using MongoDB without proper geospatial indexing. Proximity queries were doing full table scans and overwhelming the database.',
    lessonLearned: 'Always use geospatial indexes for location queries. Full table scans don\'t scale.',
    icon: '📍',
  },

  keyPoints: [
    'Geohash converts lat/lon to hierarchical string',
    'Nearby locations share geohash prefixes',
    'Redis GEOADD/GEORADIUS for efficient proximity queries',
    'Reduces proximity query from O(N) to O(log N + K)',
  ],

  diagram: `
Geohash Grid (precision 5):

9q8yy ┃ 9q8yz ┃ 9q8yp
━━━━━━╋━━━━━━╋━━━━━━
9q8yw ┃ 9q8yx │ 9q8yr  ← Each cell contains entities
━━━━━━╋━━━━━━╋━━━━━━
9q8yq ┃ 9q8yt ┃ 9q8ys

Proximity query: Check only cells near target geohash!
`,
};

const step5: GuidedStep = {
  id: 'geo-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Proximity queries must be efficient (< 200ms)',
    taskDescription: 'Implement geospatial indexing in cache',
    successCriteria: [
      'Configure cache with geospatial index',
      'Use Redis GEOADD/GEORADIUS or equivalent',
    ],
  },
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
    level1: 'Configure cache to use geospatial indexing',
    level2: 'Use Redis geo commands or implement geohash-based indexing',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Regional Caching for Global Scale
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your location service is going global! Cities worldwide are coming online.",
  hook: "But your cache contains ALL 10 million entities globally! A query in NYC is checking drivers in Tokyo - that's wasteful!",
  challenge: "Partition your cache by geographic region. NYC queries only check NYC region!",
  illustration: 'global-map',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Your location cache is now globally scalable!",
  achievement: "Regional partitioning reduces query scope and cache size",
  metrics: [
    { label: 'Entities per region', before: '10M', after: '~100K' },
    { label: 'Query time', before: '50ms', after: '10ms' },
    { label: 'Cache efficiency', after: '100x better' },
  ],
  nextTeaser: "Congratulations! You've built a scalable geo-location cache!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Regional Partitioning: Scaling Location Services Globally',
  conceptExplanation: `**The problem**: A single global cache contains ALL entities everywhere.

**Why this is bad**:
- NYC query checks 10M entities (including Tokyo drivers)
- 99.9% of entities are irrelevant (wrong region)
- Wastes memory, CPU, network

**The solution: Regional Partitioning**

**Partition by geographic regions**:
- **City-level**: NYC, SF, London, Tokyo (dense urban)
- **Country-level**: For less dense regions
- **S2 cells or H3 hexagons**: For uniform partitioning

**Cache structure**:
\`\`\`
# Region-specific cache keys
GEOADD locations:nyc -74.006 40.7128 driver-123
GEOADD locations:sf -122.4194 37.7749 driver-456
GEOADD locations:tokyo 139.6917 35.6895 driver-789

# Query only relevant region
GEORADIUS locations:nyc -74.006 40.7128 2 mi
# Returns only NYC drivers - fast!
\`\`\`

**How to determine region**:
1. Client sends query with lat/lon
2. Server maps lat/lon to region (e.g., NYC)
3. Query only that region's cache
4. For edge cases (near borders), query adjacent regions

**Benefits**:
- Query scope: 10M → 100K entities (100x reduction)
- Cache memory: Distribute across regional Redis clusters
- Latency: Deploy cache close to region (NYC cache in NYC data center)`,

  whyItMatters: 'Global location services MUST partition by region. A single global index doesn\'t scale past a few million entities.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Operating in 10,000+ cities globally',
    howTheyDoIt: 'Partitions by city/region. Each city has its own cache cluster. NYC drivers never touch Tokyo cache. Scales linearly with regions.',
  },

  famousIncident: {
    title: 'Pokemon Go Regional Crashes',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Pokemon Go launched region by region (Japan, US, Europe) but used a single global location service. When Japan launched, the load overwhelmed the service and took down ALL regions.',
    lessonLearned: 'Always partition location services by region. Isolation prevents cascading failures.',
    icon: '🎮',
  },

  keyPoints: [
    'Partition cache by geographic region (city/country)',
    'Map queries to regions using lat/lon',
    'Handle edge cases near regional borders',
    '100x reduction in query scope',
    'Deploy regional caches close to users',
  ],

  diagram: `
Regional Partitioning:

┌─────────────────────────────────────────┐
│         Global Location Service         │
├─────────────────────────────────────────┤
│                                         │
│  NYC Region        SF Region            │
│  ┌──────────┐     ┌──────────┐          │
│  │ Redis    │     │ Redis    │          │
│  │ 100K loc │     │ 80K loc  │          │
│  └──────────┘     └──────────┘          │
│                                         │
│  Tokyo Region      London Region        │
│  ┌──────────┐     ┌──────────┐          │
│  │ Redis    │     │ Redis    │          │
│  │ 120K loc │     │ 90K loc  │          │
│  └──────────┘     └──────────┘          │
│                                         │
│  Query in NYC → Only check NYC region   │
└─────────────────────────────────────────┘
`,
};

const step6: GuidedStep = {
  id: 'geo-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Global scale requires regional partitioning',
    taskDescription: 'Configure cache for regional partitioning',
    successCriteria: [
      'Configure cache with regional sharding',
      'Route queries to appropriate region',
    ],
  },
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
    level1: 'Configure cache to partition by geographic region',
    level2: 'Use region-specific cache keys and route queries to correct region',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const geoLocationCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'geo-location-cache-guided',
  problemTitle: 'Build a Geo-Location Cache - Spatial Indexing at Scale',

  requirementsPhase: geoLocationCacheRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],
};

export function getGeoLocationCacheGuidedTutorial(): GuidedTutorial {
  return geoLocationCacheGuidedTutorial;
}
