import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Autonomous Vehicle Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a caching system for autonomous vehicles.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution - FRs satisfied!
 * Steps 4-6: Apply NFRs (edge caching, predictive loading, safety-critical data)
 *
 * Key Focus Areas:
 * - Map data caching
 * - Sensor data processing
 * - Edge computing for vehicles
 * - Predictive data loading
 * - Safety-critical data handling
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const autonomousVehicleCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a caching system for autonomous vehicles to handle map data, sensor data, and real-time updates",

  interviewer: {
    name: 'Dr. Sarah Chen',
    role: 'Chief Architect at AutoDrive Systems',
    avatar: '🚗',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-vehicle-operations',
      category: 'functional',
      question: "What are the main data operations autonomous vehicles need to perform?",
      answer: "Autonomous vehicles need to:\n1. **Access HD maps**: High-definition maps of roads, lanes, traffic signs, and obstacles for navigation\n2. **Cache sensor data**: Store recent LIDAR, camera, radar data for decision-making\n3. **Receive real-time updates**: Traffic conditions, road closures, weather alerts, other vehicles' positions\n4. **Prefetch route data**: Download map data for the planned route ahead of time",
      importance: 'critical',
      revealsRequirement: 'FR-1 and FR-2',
      learningPoint: "Autonomous vehicles require both static data (maps) and dynamic data (sensors, traffic) with strict latency requirements",
    },
    {
      id: 'map-data-requirements',
      category: 'functional',
      question: "How much map data does a vehicle need, and how fresh must it be?",
      answer: "Vehicles need HD map data for:\n- **Immediate area**: 1km radius around current position (must be cached locally)\n- **Route ahead**: Next 50km of planned route (prefetched)\n- **Freshness**: Maps updated quarterly are acceptable, but real-time overlays (construction, accidents) must be < 1 second old",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Map data has different freshness requirements: base maps can be stale, but real-time overlays must be instant",
    },
    {
      id: 'sensor-data-processing',
      category: 'functional',
      question: "What happens to all the sensor data the vehicle generates?",
      answer: "Vehicles generate massive amounts of sensor data:\n1. **Immediate processing**: LIDAR, camera data processed locally in real-time for driving decisions\n2. **Short-term cache**: Last 30 seconds cached for incident replay\n3. **Selective upload**: Only critical events (near-misses, unusual situations) uploaded to cloud\n4. **Fleet learning**: Anonymized data used to improve AI models",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Edge computing is essential - vehicles can't upload all sensor data, only process-and-filter locally",
    },
    {
      id: 'edge-computing-needs',
      category: 'functional',
      question: "Why can't vehicles just stream everything to the cloud?",
      answer: "Network connectivity is unreliable and insufficient:\n- **Bandwidth**: Vehicles generate 4TB/hour of sensor data, but cellular networks provide only 10-100 Mbps\n- **Latency**: Safety decisions need < 10ms response time, cloud round-trip is 50-200ms\n- **Availability**: Tunnels, rural areas, network outages - vehicles must work offline\n\nSolution: Edge computing in the vehicle for real-time decisions, cloud for learning and updates.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Autonomous vehicles are the ultimate edge computing use case - latency and bandwidth make cloud-only impossible",
    },

    // IMPORTANT - Clarifications
    {
      id: 'safety-critical-data',
      category: 'clarification',
      question: "What data is considered safety-critical and needs special handling?",
      answer: "Safety-critical data that cannot be lost or delayed:\n1. **Emergency vehicle alerts**: Ambulance, fire truck nearby\n2. **Road hazard warnings**: Debris, ice, accidents ahead\n3. **V2V messages**: Vehicle-to-vehicle collision avoidance\n4. **Software safety updates**: Critical bug fixes for autonomous driving system\n\nThese must have dedicated bandwidth and redundant delivery mechanisms.",
      importance: 'important',
      insight: "Safety-critical data needs separate queues, redundant transmission, and cannot share resources with regular data",
    },
    {
      id: 'offline-capability',
      category: 'clarification',
      question: "How long must vehicles operate without cloud connectivity?",
      answer: "Vehicles must drive safely for at least 30 minutes with zero connectivity:\n- Local map cache covers planned route\n- Sensor processing runs entirely on edge\n- Navigation works with cached maps\n- Only lose fleet updates and real-time traffic\n\nThis is essential for tunnels, rural areas, and network failures.",
      importance: 'important',
      insight: "Cache must be comprehensive enough for full autonomous driving without cloud",
    },
    {
      id: 'predictive-loading',
      category: 'clarification',
      question: "How does the system predict what data to prefetch?",
      answer: "Multiple prediction signals:\n1. **Navigation route**: Prefetch all map data along planned route\n2. **Historical patterns**: If vehicle goes to work every morning, prefetch that route\n3. **Common destinations**: Cache frequent locations (home, work, shopping)\n4. **Nearby areas**: Keep adjacent map tiles in cache\n\nThis ensures data is ready before it's needed.",
      importance: 'important',
      insight: "Predictive prefetching eliminates latency by making data ready before it's requested",
    },

    // SCOPE
    {
      id: 'scope-vehicle-coordination',
      category: 'scope',
      question: "Do vehicles need to coordinate with each other directly?",
      answer: "For MVP, V2V (vehicle-to-vehicle) communication is limited to safety broadcasts via dedicated short-range communication (DSRC). Full mesh coordination is v2 feature.",
      importance: 'nice-to-have',
      insight: "Start with vehicle-to-cloud-to-vehicle pattern, defer direct V2V mesh",
    },
    {
      id: 'scope-simulation',
      category: 'scope',
      question: "Does this system support vehicle simulation and testing?",
      answer: "Not for MVP. Focus on production vehicles. Simulation infrastructure is a separate system that can share the same data stores.",
      importance: 'nice-to-have',
      insight: "Simulation is a separate concern - defer to v2",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-fleet-size',
      category: 'throughput',
      question: "How many autonomous vehicles should the system support?",
      answer: "1 million vehicles in the fleet (think Tesla FSD, Waymo at scale)",
      importance: 'critical',
      learningPoint: "Fleet size determines cloud infrastructure scale and data volume",
    },
    {
      id: 'throughput-sensor-data',
      category: 'throughput',
      question: "How much sensor data does each vehicle generate?",
      answer: "Each vehicle generates:\n- Raw sensors: 4TB/hour (mostly processed locally)\n- Uploaded to cloud: 1GB/hour (filtered critical events and metrics)\n- With 1M vehicles: 1 PB/hour of cloud ingestion!",
      importance: 'critical',
      calculation: {
        formula: "1M vehicles × 1GB/hour = 1 PB/hour cloud ingestion",
        result: "~1 PB/hour data ingestion to cloud",
      },
      learningPoint: "Edge processing reduces cloud ingestion by 4000x - absolutely essential",
    },
    {
      id: 'throughput-map-requests',
      category: 'throughput',
      question: "How many map data requests per second?",
      answer: "About 10,000 map tile requests per second as vehicles navigate and prefetch routes",
      importance: 'critical',
      calculation: {
        formula: "1M vehicles, each requesting new map tiles every ~100 seconds",
        result: "~10K map tile requests/sec",
      },
      learningPoint: "CDN caching is essential to avoid hammering the map service",
    },

    // 2. PAYLOAD
    {
      id: 'payload-map-size',
      category: 'payload',
      question: "How large is a typical map tile?",
      answer: "HD map tile covering 1km²: ~50MB (includes lane geometry, 3D features, traffic signs)\nRoute map data (50km): ~2.5GB total",
      importance: 'important',
      calculation: {
        formula: "50 tiles × 50MB = 2.5GB per route",
        result: "~2.5GB map data per planned route",
      },
      learningPoint: "Large map payloads require compression and smart prefetching",
    },
    {
      id: 'payload-sensor-event',
      category: 'payload',
      question: "How large is a sensor event upload (critical incident)?",
      answer: "Critical event package: 10-100MB (30 seconds of sensor snapshots, vehicle state, location)\nVehicles upload ~10 events per hour on average",
      importance: 'important',
      calculation: {
        formula: "1M vehicles × 10 events/hr × 50MB avg = 500TB/hour",
        result: "~500TB/hour of event data upload",
      },
      learningPoint: "Event data is bursty - need message queues to buffer uploads",
    },

    // 3. LATENCY
    {
      id: 'latency-map-access',
      category: 'latency',
      question: "How fast must map data be available?",
      answer: "Map tiles must load in < 100ms. The vehicle is moving - it needs map data ahead instantly. This requires local caching and prefetching.",
      importance: 'critical',
      learningPoint: "Map access must be from local cache, not cloud - 100ms is too tight for network",
    },
    {
      id: 'latency-safety-critical',
      category: 'latency',
      question: "What about safety-critical updates like hazard warnings?",
      answer: "Safety-critical messages: p99 < 50ms from cloud to vehicle. Lives depend on it. These bypass normal data queues.",
      importance: 'critical',
      learningPoint: "Safety-critical data needs dedicated fast path with redundancy",
    },

    // 4. BURSTS
    {
      id: 'burst-incident',
      category: 'burst',
      question: "What happens when there's a major traffic incident?",
      answer: "If 1000 vehicles encounter the same accident:\n- All vehicles upload event data simultaneously\n- All vehicles request updated route maps\n- Nearby vehicles request hazard warnings\n\nThis creates 100x normal load spike in a region.",
      importance: 'important',
      insight: "Regional traffic incidents create massive data bursts - need geo-distributed buffering",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-vehicle-operations', 'map-data-requirements', 'edge-computing-needs'],
  criticalFRQuestionIds: ['core-vehicle-operations', 'map-data-requirements', 'sensor-data-processing'],
  criticalScaleQuestionIds: ['throughput-fleet-size', 'throughput-sensor-data', 'latency-map-access'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: HD map data access',
      description: 'Vehicles can access high-definition map data for navigation',
      emoji: '🗺️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Sensor data processing',
      description: 'Process and cache sensor data locally, upload critical events to cloud',
      emoji: '📡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Real-time updates',
      description: 'Receive traffic, weather, and safety alerts in real-time',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Predictive prefetching',
      description: 'Prefetch map data along planned routes before it is needed',
      emoji: '🔮',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million autonomous vehicles',
    writesPerDay: '240 PB sensor data generated (1 PB uploaded)',
    readsPerDay: '864 million map tile requests',
    peakMultiplier: 100,
    readWriteRatio: '1:100 (write-heavy!)',
    calculatedWriteRPS: { average: 277777, peak: 27777777 },
    calculatedReadRPS: { average: 10000, peak: 100000 },
    maxPayloadSize: '~50MB per map tile',
    storagePerRecord: '~50MB map tile, ~50MB event',
    storageGrowthPerYear: '~8 EB sensor events',
    redirectLatencySLA: 'p99 < 100ms (map access)',
    createLatencySLA: 'p99 < 50ms (safety alerts)',
  },

  architecturalImplications: [
    '✅ 4TB/hour per vehicle → Edge computing mandatory for sensor processing',
    '✅ 100ms map access → Local cache in vehicle, prefetch route data',
    '✅ 50ms safety alerts → Dedicated fast path, cannot share queues',
    '✅ 1 PB/hour uploads → Message queue buffering, geo-distributed ingestion',
    '✅ Offline capability → Comprehensive local cache for 30+ min driving',
    '✅ Regional bursts → Edge caching and buffering in each region',
  ],

  outOfScope: [
    'Vehicle-to-vehicle mesh networking',
    'Simulation and testing infrastructure',
    'AI model training pipelines',
    'Vehicle manufacturing and provisioning',
    'In-vehicle entertainment systems',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where vehicles can fetch map data and upload sensor data. Then we'll add edge caching for performance, predictive prefetching for offline capability, and safety-critical data handling. Functionality first!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Vehicle to Cloud
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚗',
  scenario: "Welcome to AutoDrive! You're building the cloud infrastructure for autonomous vehicles.",
  hook: "Your first autonomous vehicle just powered on. It needs to download map data to start driving!",
  challenge: "Connect the Client (autonomous vehicles) to the App Server to handle map requests and sensor uploads.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your autonomous vehicle platform is online!",
  achievement: "Vehicles can now connect and communicate with the cloud",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Vehicle connectivity', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle map requests yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Vehicle-to-Cloud Communication',
  conceptExplanation: `Every autonomous vehicle system starts with **vehicles** connecting to a **cloud server**.

When a self-driving car needs map data:
1. The vehicle (Client) sends an HTTP/gRPC request
2. The App Server receives the map request
3. The server returns the requested map tiles

This is the foundation for all autonomous vehicle systems!`,
  whyItMatters: 'Without cloud connectivity, vehicles cannot receive updated maps, traffic data, or fleet intelligence.',
  keyPoints: [
    'Vehicles = Clients that request data and upload sensor information',
    'App Server = Processes map requests and sensor uploads',
    'Protocols: gRPC for efficiency, HTTPS for compatibility',
    'Vehicles cache data locally but depend on cloud for updates',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│  Vehicle    │ ──────▶ │   App Server    │
│  (Client)   │ ◀────── │  (Your Code)    │
└─────────────┘         └─────────────────┘
   map request              map data
`,
  keyConcepts: [
    {
      title: 'Autonomous Vehicle',
      explanation: 'Self-driving car with sensors and edge compute',
      icon: '🚙',
    },
    {
      title: 'Map Request',
      explanation: 'Vehicle requests HD map tiles for navigation',
      icon: '🗺️',
    },
  ],
  quickCheck: {
    question: 'Why do autonomous vehicles need to connect to a cloud server?',
    options: [
      'To get updated maps, traffic data, and fleet intelligence',
      'Because they cannot process data locally',
      'To save battery power',
      'To communicate with passengers',
    ],
    correctIndex: 0,
    explanation: 'Vehicles connect to the cloud for updated maps, real-time traffic, safety alerts, and to share learning from the fleet.',
  },
};

const step1: GuidedStep = {
  id: 'av-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Vehicles can connect to request maps and upload data',
    taskDescription: 'Add Client (vehicles) and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents autonomous vehicles', displayName: 'Autonomous Vehicles' },
      { type: 'app_server', reason: 'Processes map requests and sensor uploads', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Vehicles communicate with cloud' },
    ],
    successCriteria: ['Add Autonomous Vehicles', 'Add App Server', 'Connect Vehicles → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Autonomous Vehicles and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Map and Sensor APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your App Server is connected, but it's just an empty box.",
  hook: "A vehicle just requested map data for Highway 101, but the server didn't know what to do!",
  challenge: "Configure the App Server with APIs and implement Python handlers for map requests and sensor data uploads.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your App Server can handle vehicle data!",
  achievement: "Vehicles can request maps and upload sensor data",
  metrics: [
    { label: 'APIs configured', after: '2 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But where does the map data actually come from?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Python Implementation for Autonomous Vehicles',
  conceptExplanation: `Your App Server needs to handle two main operations:

**1. Get Map Data (GET /api/v1/maps/:tile_id)**
- Receives: Map tile ID (lat/lon coordinates)
- Returns: HD map data (lanes, signs, 3D features)
- Your code: Fetch from map database and return

**2. Upload Sensor Event (POST /api/v1/events)**
- Receives: Sensor data, vehicle state, location, timestamp
- Returns: Acknowledgment
- Your code: Store event for analysis

**By the end of this step:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for both endpoints`,
  whyItMatters: 'Without the code, your server cannot process map requests or sensor uploads. The Python handlers define what actually happens.',
  keyPoints: [
    'GET endpoint retrieves HD map tiles',
    'POST endpoint ingests sensor event data',
    'Map data stored in specialized database',
    'Include timestamps and location for all data',
  ],
  diagram: `
GET /api/v1/maps/tile-37.7749-122.4194
┌──────────────────────────────────────────────┐
│ Response: {                                  │
│   "tile_id": "tile-37.7749-122.4194",        │
│   "lanes": [...],                            │
│   "signs": [...],                            │
│   "features": [...],                         │
│   "version": "2024-Q1"                       │
│ }                                            │
└──────────────────────────────────────────────┘

POST /api/v1/events
┌──────────────────────────────────────────────┐
│ Request: {                                   │
│   "vehicle_id": "AV-12345",                  │
│   "event_type": "near_miss",                 │
│   "sensor_data": {...},                      │
│   "location": [37.7749, -122.4194],          │
│   "timestamp": "2024-01-15T10:30:00Z"        │
│ }                                            │
│ Response: { "status": "received" }           │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Map Tile', explanation: 'Geographic region with HD map data', icon: '🗺️' },
    { title: 'Sensor Event', explanation: 'Critical incident captured by vehicle sensors', icon: '📹' },
    { title: 'Vehicle ID', explanation: 'Unique identifier for each autonomous vehicle', icon: '🔑' },
  ],
  quickCheck: {
    question: 'Why include location and timestamp with every sensor event?',
    options: [
      'To track where and when incidents occur',
      'For debugging purposes only',
      'To calculate vehicle speed',
      'It is not necessary',
    ],
    correctIndex: 0,
    explanation: 'Location and timestamp are critical for understanding incident context, fleet learning, and identifying hazard patterns.',
  },
};

const step2: GuidedStep = {
  id: 'av-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle map requests and sensor uploads',
    taskDescription: 'Configure APIs and implement the Python handlers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Autonomous Vehicles' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/maps/* and POST /api/v1/events APIs',
      'Open the Python tab and implement the handlers',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to the Python tab',
    level2: 'After assigning APIs, implement get_map_tile() and upload_sensor_event() in the Python editor',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Map and Sensor Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your App Server is working, but where does the map data come from?",
  hook: "Right now, map data is hardcoded. When Tesla updates maps weekly, we need a database!",
  challenge: "Add a database to store HD maps and sensor events persistently.",
  illustration: 'database-storage',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your data is now persistent!",
  achievement: "Map data and sensor events are stored in the database",
  metrics: [
    { label: 'Data durability', before: '❌ Hardcoded', after: '✓ Persistent' },
    { label: 'Storage', after: 'Database' },
  ],
  nextTeaser: "Good! But map requests are slow - every vehicle is hitting the database...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Storing Maps and Sensor Data',
  conceptExplanation: `Without a database, your app server has nowhere to store data.

**What we store**:
- **HD Maps**: Tile-based map data (lanes, signs, 3D features)
- **Sensor Events**: Critical incidents uploaded by vehicles
- **Vehicle Metadata**: Fleet information, vehicle state

**Database Requirements**:
- Geospatial queries for map tiles
- Time-series storage for sensor events
- High read throughput for popular map tiles
- Handle massive write volume from 1M vehicles`,
  whyItMatters: 'Autonomous vehicles depend on accurate, up-to-date map data. Without persistent storage, we cannot serve or update maps.',
  realWorldExample: {
    company: 'Tesla',
    scenario: 'Storing maps for 5 million vehicles worldwide',
    howTheyDoIt: 'Uses distributed database with geospatial indexing. Map tiles are versioned and incrementally updated. Vehicles download only changed tiles.',
  },
  famousIncident: {
    title: 'Uber Self-Driving Fatal Crash',
    company: 'Uber ATG',
    year: '2018',
    whatHappened: 'An Uber autonomous vehicle struck and killed a pedestrian in Arizona. Investigation revealed the vehicle\'s perception system failed to classify the pedestrian correctly. The incident highlighted the critical importance of sensor data logging - the vehicle\'s data helped determine what went wrong.',
    lessonLearned: 'Always log sensor data for safety-critical systems. Data persistence is not just for performance - it saves lives by enabling post-incident analysis.',
    icon: '⚠️',
  },
  keyPoints: [
    'Database stores HD map tiles with geospatial indexing',
    'Sensor events stored in time-series database',
    'Map tiles are versioned for incremental updates',
    'Database must handle high read and write volume',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────────┐
│   Vehicle   │ ────▶ │ App Server  │ ────▶ │     Database       │
└─────────────┘       └─────────────┘       │                    │
                                            │ Maps:              │
                                            │   tile-001: {...}  │
                                            │   tile-002: {...}  │
                                            │                    │
                                            │ Events:            │
                                            │   event-001: {...} │
                                            └────────────────────┘
`,
  keyConcepts: [
    { title: 'Geospatial Index', explanation: 'Database index for location-based queries', icon: '🌍' },
    { title: 'Map Versioning', explanation: 'Track map updates over time', icon: '📋' },
    { title: 'Time-Series', explanation: 'Sensor data organized by timestamp', icon: '⏰' },
  ],
  quickCheck: {
    question: 'Why do we need geospatial indexing for map data?',
    options: [
      'To make the database faster',
      'To query maps by location coordinates efficiently',
      'To save storage space',
      'It is not necessary',
    ],
    correctIndex: 1,
    explanation: 'Geospatial indexing allows fast location-based queries like "get all map tiles within 1km of this point".',
  },
};

const step3: GuidedStep = {
  id: 'av-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Map data and sensor events must persist',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents autonomous vehicles', displayName: 'Vehicles' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores maps and sensor data', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Vehicles send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server persists data' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Popular Map Tiles
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your system is working! But vehicles are complaining...",
  hook: '"Why does it take 200ms to load map tiles for Highway 101?" Popular routes are hammering the database!',
  challenge: "Thousands of vehicles drive the same highways every day. Cache popular map tiles to reduce database load and latency!",
  illustration: 'slow-turtle',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Map access is now lightning fast!",
  achievement: "Popular map tiles are served from cache in milliseconds",
  metrics: [
    { label: 'Map load time', before: '200ms', after: '10ms' },
    { label: 'Database load', before: '10K queries/sec', after: '1K queries/sec' },
    { label: 'Cache hit rate', after: '90%' },
  ],
  nextTeaser: "Great! But vehicles are still uploading too much sensor data...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Map Caching: Serving Popular Routes Fast',
  conceptExplanation: `**Key insight**: Popular routes (Highway 101, I-5, I-95) are requested by thousands of vehicles daily.

**The math**:
- Database query: 50-200ms
- Cache lookup: 5-10ms
- That's **10-20x faster!**

**How map caching works**:
1. Vehicle requests map tile → Check cache first
2. **Cache HIT**: Return immediately from Redis (10ms)
3. **Cache MISS**: Query database, update cache, return (200ms)

**Caching strategy**:
- Cache popular map tiles (highways, urban areas)
- TTL: 7 days (maps don't change often)
- Cache key format: map:tile:{tile_id}:v{version}
- 90%+ cache hit rate for common routes`,
  whyItMatters: 'Without caching, every map request hits the database. At 10K requests/sec, the database becomes the bottleneck and latency suffers.',
  realWorldExample: {
    company: 'Waymo',
    scenario: 'Serving HD maps to autonomous taxi fleet',
    howTheyDoIt: 'Multi-tier caching: in-vehicle cache for immediate area, edge cache for regional data, cloud database for full map. 99% of map access from local or edge cache.',
  },
  famousIncident: {
    title: 'Apple Maps Launch Disaster',
    company: 'Apple',
    year: '2012',
    whatHappened: 'Apple Maps launched with poor data quality and could not handle the load. Their backend database was overwhelmed by millions of iOS users requesting map tiles simultaneously. Maps were slow or completely unavailable.',
    lessonLearned: 'Map serving requires aggressive caching at multiple layers. Database cannot handle full read load for popular map services.',
    icon: '🗺️',
  },
  keyPoints: [
    'Popular map tiles cached with write-through pattern',
    'Cache key includes version for easy updates',
    'TTL: 7 days for static maps, 1 hour for traffic overlays',
    '90%+ cache hit ratio for popular routes',
  ],
  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 10ms (HIT!)
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Vehicle│───▶│App Server│
└────────┘    └────┬─────┘
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 200ms (MISS)
                          └─────────────┘
`,
  keyConcepts: [
    { title: 'Map Tile Cache', explanation: 'Cache frequently accessed map tiles', icon: '🗺️' },
    { title: 'Cache Hit Rate', explanation: 'Percentage of requests served from cache', icon: '📊' },
    { title: 'TTL (Time-To-Live)', explanation: 'How long cached data stays valid', icon: '⏰' },
  ],
  quickCheck: {
    question: 'Why do map tiles have a 7-day TTL instead of caching forever?',
    options: [
      'To save memory',
      'Because maps are updated periodically',
      'To prevent cache bugs',
      'It is faster to recache',
    ],
    correctIndex: 1,
    explanation: 'Maps are updated with new roads, construction, and changes. TTL ensures vehicles eventually get fresh map data.',
  },
};

const step4: GuidedStep = {
  id: 'av-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Map access must be fast (< 100ms p99)',
    taskDescription: 'Build Client → App Server → Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents vehicles', displayName: 'Vehicles' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores map data', displayName: 'Database' },
      { type: 'cache', reason: 'Caches popular map tiles', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Vehicles request maps' },
      { from: 'App Server', to: 'Database', reason: 'Server fetches maps' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches maps' },
    ],
    successCriteria: ['Build full architecture with Cache', 'Connect App Server to both Database and Cache'],
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
    level1: 'Build the full system with a Cache for fast map lookups',
    level2: 'Add Client, App Server, Database, and Cache - connect App Server to both storage components',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Edge Caching - Processing Data Locally in Vehicles
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📡',
  scenario: "Vehicles are generating 4TB/hour of sensor data each!",
  hook: "Your network is melting! You cannot upload 4 petabytes/hour to the cloud. Physics says no!",
  challenge: "Implement edge computing: process sensor data in the vehicle, only upload critical events to the cloud.",
  illustration: 'edge-computing',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Edge computing is working!",
  achievement: "Vehicles process data locally, cloud receives only critical events",
  metrics: [
    { label: 'Data upload', before: '4 PB/hour', after: '1 PB/hour' },
    { label: 'Network savings', after: '75% reduction' },
    { label: 'Processing latency', before: '200ms', after: '10ms' },
  ],
  nextTeaser: "Good! But we need to prefetch map data for routes...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Edge Computing: Why Vehicles Process Data Locally',
  conceptExplanation: `**The problem**: Vehicles generate 4TB/hour of raw sensor data (LIDAR, cameras, radar).

**Why cloud processing is impossible**:
- Bandwidth: 4G/5G provides 10-100 Mbps, need 8,888 Mbps per vehicle!
- Latency: Driving decisions need < 10ms, cloud round-trip is 50-200ms
- Reliability: Tunnels, rural areas - cloud may be unavailable

**The solution**: Edge Computing in the Vehicle

**How it works**:
1. Sensors → Vehicle's edge compute (GPU/TPU)
2. Process data locally for driving decisions (< 10ms)
3. Cache last 30 seconds for incident replay
4. Filter and upload only critical events (near-misses, hazards)
5. Cloud gets 1GB/hour instead of 4TB/hour - 4000x reduction!`,
  whyItMatters: 'Edge computing is not optional for autonomous vehicles - it is physically impossible to upload all sensor data to the cloud.',
  realWorldExample: {
    company: 'Tesla',
    scenario: 'Processing sensor data from 5 million vehicles',
    howTheyDoIt: 'Each vehicle has FSD Computer with 144 TOPS of compute. All driving decisions made locally. Cloud receives only critical events and training data. Edge computing reduces cloud data by 10,000x.',
  },
  famousIncident: {
    title: 'GM Cruise Robotaxi Dragging Incident',
    company: 'GM Cruise',
    year: '2023',
    whatHappened: 'A Cruise robotaxi was involved in an accident where a pedestrian was dragged. The vehicle\'s edge system made a decision to pull over, but did not recognize the pedestrian underneath. Local sensor processing and logging revealed exactly what the AI saw and decided.',
    lessonLearned: 'Edge computing must be robust and log decisions for safety analysis. Lives depend on correct local processing.',
    icon: '🚨',
  },
  keyPoints: [
    'Edge compute in vehicle processes sensor data locally',
    'Driving decisions made in < 10ms without cloud',
    'Only critical events uploaded to cloud (4000x reduction)',
    'Vehicles must work offline for 30+ minutes',
  ],
  diagram: `
┌─────────────────────────────────────┐
│           VEHICLE (Edge)            │
│                                     │
│  Sensors → Edge Compute → Decisions│
│    4TB/hr     (Local)      <10ms   │
│                                     │
│  Filter critical events             │
│       ↓                             │
│     1GB/hr                          │
└────────┬────────────────────────────┘
         │ upload critical events
         ▼
    ┌─────────────┐
    │   Cloud     │
    │ (Analysis)  │
    └─────────────┘
`,
  keyConcepts: [
    { title: 'Edge Compute', explanation: 'Processing in vehicle, not cloud', icon: '🖥️' },
    { title: 'Data Filtering', explanation: 'Upload only critical events', icon: '🔍' },
    { title: 'Offline Capability', explanation: 'Vehicle drives without cloud', icon: '📴' },
  ],
  quickCheck: {
    question: 'What is the main reason autonomous vehicles use edge computing?',
    options: [
      'To save money on cloud costs',
      'Because cloud is unreliable',
      'Bandwidth and latency make cloud-only physically impossible',
      'To protect privacy',
    ],
    correctIndex: 2,
    explanation: 'Edge computing is required because vehicles cannot upload 4TB/hour (bandwidth) and cannot wait 200ms for cloud responses (latency).',
  },
};

const step5: GuidedStep = {
  id: 'av-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle massive sensor data via edge processing',
    taskDescription: 'Add Message Queue between App Server and Database to buffer uploads',
    componentsNeeded: [
      { type: 'client', reason: 'Vehicles with edge compute', displayName: 'Vehicles' },
      { type: 'app_server', reason: 'Receives filtered events', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers sensor uploads', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores events', displayName: 'Database' },
      { type: 'cache', reason: 'Serves maps', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Vehicles upload events' },
      { from: 'App Server', to: 'Cache', reason: 'Map caching' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer uploads' },
      { from: 'Message Queue', to: 'Database', reason: 'Async persistence' },
    ],
    successCriteria: ['Add Message Queue', 'Route sensor uploads through queue to database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Message Queue between App Server and Database to buffer sensor uploads',
    level2: 'Connect: App Server → Cache (for maps) and App Server → Message Queue → Database (for sensor data)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Predictive Prefetching and Safety-Critical Data
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔮',
  scenario: "Your system is working well! But there are two critical challenges...",
  hook: "1) Vehicles entering tunnels lose connectivity - they need maps cached ahead!\n2) Emergency vehicle alerts are delayed by 5 seconds - lives are at risk!",
  challenge: "Implement predictive prefetching for offline capability and a fast path for safety-critical data.",
  illustration: 'predictive-safety',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your system is production-ready!",
  achievement: "Vehicles prefetch route data and receive safety alerts instantly",
  metrics: [
    { label: 'Offline capability', before: '0 min', after: '30+ min' },
    { label: 'Safety alert latency', before: '5 sec', after: '50ms' },
    { label: 'Route prefetch accuracy', after: '95%' },
  ],
  nextTeaser: "Congratulations! Your autonomous vehicle cache system is ready for the road!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Predictive Prefetching and Safety-Critical Fast Paths',
  conceptExplanation: `**Challenge 1: Offline Capability**

Vehicles must drive through tunnels, rural areas, and network outages.

**Predictive Prefetching Strategy**:
1. When route is planned, prefetch all map tiles along route (50km ahead)
2. Predict based on patterns: home → work every morning
3. Cache nearby tiles (1km radius)
4. Result: Vehicle has 30+ minutes of map data cached locally

**Challenge 2: Safety-Critical Data**

Emergency vehicle alerts, hazard warnings cannot wait!

**Fast Path for Safety Data**:
1. Dedicated high-priority message queue
2. Separate network bandwidth allocation
3. Redundant delivery (multiple paths)
4. Target: p99 < 50ms from cloud to vehicle

**Key insight**: Not all data is equal. Safety data gets priority!`,
  whyItMatters: 'Predictive prefetching enables offline driving. Safety-critical fast paths save lives by delivering alerts instantly.',
  realWorldExample: {
    company: 'Waymo',
    scenario: 'Robotaxis operating in SF, Phoenix, LA',
    howTheyDoIt: 'Vehicles prefetch maps for entire operating area. Safety alerts use dedicated 5G network slices with guaranteed latency. Can drive 2 hours with zero connectivity.',
  },
  keyPoints: [
    'Predictive prefetching: download route maps before needed',
    'Pattern learning: predict common destinations',
    'Safety-critical fast path: dedicated queue, < 50ms',
    'Redundant delivery for safety data (cellular + V2X)',
  ],
  diagram: `
┌──────────────────────────────────────────┐
│           PREDICTIVE SYSTEM              │
│                                          │
│  Route planned → Prefetch tiles ahead   │
│  Pattern: home→work → Cache route        │
│  Location: near tunnel → Extra prefetch  │
│                                          │
│  Result: 30+ min offline capability      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│        SAFETY-CRITICAL FAST PATH         │
│                                          │
│  Emergency alert → Priority queue        │
│  Hazard warning → Redundant delivery     │
│  Latency: <50ms (lives depend on it!)   │
└──────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Predictive Prefetch', explanation: 'Download data before it is needed', icon: '🔮' },
    { title: 'Safety-Critical Path', explanation: 'Dedicated fast lane for urgent data', icon: '🚨' },
    { title: 'Offline Capability', explanation: 'Driving without cloud connectivity', icon: '📴' },
  ],
  quickCheck: {
    question: 'Why does safety-critical data need a separate fast path?',
    options: [
      'To save bandwidth',
      'Because lives depend on instant delivery',
      'It is easier to implement',
      'To reduce costs',
    ],
    correctIndex: 1,
    explanation: 'Safety-critical alerts like emergency vehicle warnings or hazard alerts must be delivered instantly - delays can cost lives.',
  },
};

const step6: GuidedStep = {
  id: 'av-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Vehicles need offline capability and instant safety alerts',
    taskDescription: 'Configure system for predictive prefetching and safety-critical data handling',
    componentsNeeded: [
      { type: 'client', reason: 'Vehicles with prefetch logic', displayName: 'Vehicles' },
      { type: 'app_server', reason: 'Handles requests', displayName: 'App Server' },
      { type: 'cache', reason: 'Serves prefetched maps', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Buffers uploads + safety queue', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores data', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Vehicles request data' },
      { from: 'App Server', to: 'Cache', reason: 'Prefetch and serve maps' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer and prioritize data' },
      { from: 'Message Queue', to: 'Database', reason: 'Persistence' },
    ],
    successCriteria: ['Build full system with prefetching and safety-critical handling'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Configure the full system with predictive prefetching and safety data handling',
    level2: 'Click components to configure prefetch logic in vehicles and priority queues in message queue',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const autonomousVehicleCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'autonomous-vehicle-cache-guided',
  problemTitle: 'Build Autonomous Vehicle Cache - A System Design Journey',

  requirementsPhase: autonomousVehicleCacheRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Vehicles can request maps and upload sensor data',
      traffic: { type: 'mixed', rps: 100, readRps: 60, writeRps: 40 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fast Map Access',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Map tiles load within latency target',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'High Sensor Upload Throughput',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Handle high volume of sensor uploads without data loss',
      traffic: { type: 'write', rps: 5000, writeRps: 5000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Real-Time Updates',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Deliver traffic and safety alerts in real-time',
      traffic: { type: 'mixed', rps: 1000, readRps: 700, writeRps: 300 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Edge Processing Efficiency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Edge computing reduces cloud upload by 75%+',
      traffic: { type: 'write', rps: 2000, writeRps: 2000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Regional Traffic Incident',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 100x spike when incident occurs',
      traffic: { type: 'mixed', rps: 10000, readRps: 5000, writeRps: 5000 },
      duration: 60,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Safety-Critical Latency',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Safety alerts delivered with < 50ms p99 latency',
      traffic: { type: 'mixed', rps: 2000, readRps: 1500, writeRps: 500 },
      duration: 90,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.001 },
    },
  ] as TestCase[],
};

export function getAutonomousVehicleCacheGuidedTutorial(): GuidedTutorial {
  return autonomousVehicleCacheGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = autonomousVehicleCacheRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= autonomousVehicleCacheRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
