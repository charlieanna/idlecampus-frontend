import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Autonomous Vehicle Map Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building an HD map system for autonomous vehicles.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic map data storage - FRs satisfied!
 * Steps 4-6: Apply NFRs (tile-based delivery, incremental updates, crowd-sourced mapping)
 *
 * Key Focus Areas:
 * - HD map data storage and versioning
 * - Tile-based map delivery
 * - Real-time map updates
 * - Localization and positioning
 * - Crowd-sourced map improvements
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const autonomousVehicleMapRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an HD map system for autonomous vehicles",

  interviewer: {
    name: 'Dr. Maya Patel',
    role: 'VP of Mapping at AutoNav Systems',
    avatar: '🗺️',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-map-operations',
      category: 'functional',
      question: "What are the main operations autonomous vehicles need from a map system?",
      answer: "Autonomous vehicles need to:\n1. **Download HD maps**: High-definition maps with lane-level detail, traffic signs, road geometry\n2. **Localize position**: Determine exact position on the map (down to centimeter accuracy)\n3. **Get real-time updates**: Road closures, construction zones, temporary traffic changes\n4. **Query route data**: Fetch map data for planned routes ahead of time",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "HD maps are different from Google Maps - they need centimeter-level precision for lane keeping and obstacle detection",
    },
    {
      id: 'hd-map-content',
      category: 'functional',
      question: "What exactly is in an HD map? How is it different from regular navigation maps?",
      answer: "HD maps contain:\n1. **Lane geometry**: Precise lane boundaries, centerlines, widths (cm-level accuracy)\n2. **Road features**: Traffic signs, traffic lights, crosswalks, stop lines\n3. **3D topology**: Elevation, slopes, curvature for each road segment\n4. **Semantic labels**: Speed limits, lane types (turn-only, merge, exit)\n\nRegular maps only have street-level routing - HD maps have everything needed for autonomous driving decisions.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "HD maps are massive - a single city can be hundreds of gigabytes due to the detail required",
    },
    {
      id: 'map-freshness',
      category: 'functional',
      question: "How fresh does map data need to be? Can vehicles use month-old maps?",
      answer: "Map data has two types:\n1. **Base maps**: Road geometry, lane markings - updated monthly is acceptable\n2. **Real-time overlays**: Construction, accidents, temporary closures - must be < 10 seconds old\n\nVehicles can drive with slightly stale base maps, but real-time hazards must be delivered instantly.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Separating static base maps from dynamic overlays is key to scalability",
    },
    {
      id: 'localization-requirement',
      category: 'functional',
      question: "How do vehicles figure out their exact position on the map?",
      answer: "GPS is not accurate enough (5-10 meter error). Vehicles use **map-based localization**:\n1. Vehicle sensors (LIDAR, cameras) detect road features (lane markings, signs)\n2. Match detected features to HD map features\n3. Compute precise position (within 10cm accuracy)\n\nThe HD map is the ground truth for localization - without it, vehicles can't position themselves accurately.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "HD maps are not just for navigation - they're essential for localization (knowing where you are)",
    },

    // IMPORTANT - Clarifications
    {
      id: 'tile-based-delivery',
      category: 'clarification',
      question: "How much map data does a vehicle download at once? The entire city?",
      answer: "No! Maps are divided into **tiles** (typically 1km × 1km squares):\n1. Vehicle downloads tiles for current location + planned route\n2. Prefetches adjacent tiles in driving direction\n3. Caches tiles for frequent routes (home, work)\n4. Total cached: ~50-100 tiles (5-10 GB) for local area\n\nDownloading entire regions would be wasteful - tile-based delivery is essential.",
      importance: 'important',
      insight: "Tile-based delivery reduces bandwidth and storage - vehicles only get what they need",
    },
    {
      id: 'incremental-updates',
      category: 'clarification',
      question: "When a map is updated, do vehicles download the entire tile again?",
      answer: "No! That would waste bandwidth. Instead, we use **incremental updates**:\n1. Map changes are encoded as deltas (added/removed/modified features)\n2. Vehicles download only the delta patches\n3. Apply patches to cached tiles\n\nExample: If a new stop sign is added, only that feature change is transmitted (a few KB), not the entire 50MB tile.",
      importance: 'important',
      insight: "Incremental updates reduce bandwidth by 100-1000x for map changes",
    },
    {
      id: 'crowd-sourced-mapping',
      category: 'clarification',
      question: "How do maps stay up-to-date? Who detects when roads change?",
      answer: "**Crowd-sourced mapping** from the vehicle fleet:\n1. Vehicles detect map discrepancies (lane marking doesn't match map)\n2. Upload anomaly reports with sensor data\n3. Mapping system aggregates reports from multiple vehicles\n4. Human mappers review and update HD maps\n\nThis creates a feedback loop - the fleet continuously improves the maps.",
      importance: 'important',
      insight: "Crowd-sourcing turns every vehicle into a map sensor - essential for keeping maps fresh",
    },

    // SCOPE
    {
      id: 'scope-global-coverage',
      category: 'scope',
      question: "Should we support the entire world or start with specific cities?",
      answer: "Start with specific cities/regions for MVP. HD mapping the entire world would cost billions. Most AV companies start with geofenced areas (Phoenix, SF, etc.).",
      importance: 'nice-to-have',
      insight: "Geofenced deployment is realistic - global coverage is v2",
    },
    {
      id: 'scope-3d-reconstruction',
      category: 'scope',
      question: "Do we need to build the mapping pipeline that creates HD maps from sensor data?",
      answer: "Not for MVP. Focus on the delivery system that serves maps to vehicles. The mapping pipeline (SLAM, 3D reconstruction) is a separate massive system.",
      importance: 'nice-to-have',
      insight: "Map creation vs. map delivery are separate systems - focus on delivery",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-fleet-size',
      category: 'throughput',
      question: "How many autonomous vehicles will use this map system?",
      answer: "1 million vehicles in the fleet (think Tesla FSD, Waymo at scale)",
      importance: 'critical',
      learningPoint: "Fleet size determines map server throughput and CDN requirements",
    },
    {
      id: 'throughput-map-requests',
      category: 'throughput',
      question: "How many map tile requests per second during peak hours?",
      answer: "About 50,000 tile requests per second:\n- 1M vehicles\n- Each vehicle requests new tiles every 20 seconds on average (as they drive)\n- Peak hours: 50K requests/sec",
      importance: 'critical',
      calculation: {
        formula: "1M vehicles ÷ 20 sec/request = 50K requests/sec",
        result: "~50K map tile requests/sec at peak",
      },
      learningPoint: "High request rate requires CDN caching - can't hit origin servers directly",
    },
    {
      id: 'throughput-update-propagation',
      category: 'throughput',
      question: "How many vehicles receive a map update when a road changes?",
      answer: "For a single tile update:\n- ~1000 vehicles might have that tile cached\n- All need the incremental update within 1 hour\n- That's ~0.3 updates/sec per tile change\n\nFor major events (road closure), push updates to all affected vehicles immediately.",
      importance: 'important',
      calculation: {
        formula: "1000 vehicles ÷ 3600 sec = 0.3 updates/sec per tile",
        result: "~0.3 updates/sec per tile change",
      },
      learningPoint: "Update propagation can use pub/sub for real-time push to subscribed vehicles",
    },

    // 2. PAYLOAD
    {
      id: 'payload-tile-size',
      category: 'payload',
      question: "How large is a typical HD map tile?",
      answer: "HD map tile (1km × 1km): ~50MB compressed\n- Lane geometry: ~10MB\n- Road features (signs, lights): ~20MB\n- 3D topology: ~20MB\n\nTotal for 50-tile cache: ~2.5GB per vehicle",
      importance: 'critical',
      calculation: {
        formula: "50 tiles × 50MB = 2.5GB local cache",
        result: "~2.5GB map cache per vehicle",
      },
      learningPoint: "Large tile sizes require compression and efficient caching strategies",
    },
    {
      id: 'payload-incremental-update',
      category: 'payload',
      question: "How large is a typical incremental update?",
      answer: "Incremental update (delta patch): ~10-100KB typical\n- Small changes (new sign): ~10KB\n- Lane re-striping: ~100KB\n- Major intersection change: ~1MB\n\nThis is 500-5000x smaller than re-downloading entire tile (50MB)!",
      importance: 'important',
      calculation: {
        formula: "100KB update vs 50MB full tile = 500x bandwidth savings",
        result: "Incremental updates save 500-5000x bandwidth",
      },
      learningPoint: "Delta encoding is essential for efficient map updates",
    },

    // 3. LATENCY
    {
      id: 'latency-map-download',
      category: 'latency',
      question: "How fast must a vehicle download a map tile?",
      answer: "p99 < 200ms for tile download:\n- Vehicles moving at 60 mph (27 m/s)\n- Need next tile before entering new area\n- Prefetch starts ~30 seconds ahead\n- But need fast delivery for route changes",
      importance: 'critical',
      learningPoint: "Fast tile delivery requires CDN edge servers close to vehicles",
    },
    {
      id: 'latency-real-time-updates',
      category: 'latency',
      question: "How fast must real-time updates (construction, accidents) reach vehicles?",
      answer: "p99 < 10 seconds for critical updates:\n- Safety-critical: < 5 seconds (accident ahead)\n- Important: < 10 seconds (construction zone)\n- Normal: < 60 seconds (new speed limit)\n\nVehicles need time to re-route or slow down safely.",
      importance: 'critical',
      learningPoint: "Real-time updates require push notifications or frequent polling",
    },

    // 4. AVAILABILITY
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if the map service goes down? Can vehicles still drive?",
      answer: "Vehicles must continue driving with cached maps - the system must support **graceful degradation**:\n- Cached maps: 99.99% of driving uses cached tiles\n- Service down: Vehicles lose real-time updates but can drive\n- Cache expiry: Vehicles should cache maps for 30+ days\n\nUptime target: 99.95% (acceptable since vehicles have local cache)",
      importance: 'critical',
      learningPoint: "Local caching provides resilience - service downtime only affects new route downloads",
    },

    // 5. CONSISTENCY
    {
      id: 'consistency-map-versions',
      category: 'consistency',
      question: "What if different vehicles have different map versions? Is that safe?",
      answer: "Eventual consistency is acceptable for base maps:\n- Vehicle A has v1.2, Vehicle B has v1.3 - both safe to drive\n- Critical updates (road closure) must propagate to all vehicles\n- Version differences only matter for map-to-map matching (V2V)\n\nFleet-wide version upgrades happen gradually over days/weeks.",
      importance: 'important',
      learningPoint: "Map versioning allows gradual rollouts without forcing simultaneous updates",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-map-operations', 'hd-map-content', 'localization-requirement', 'throughput-map-requests'],
  criticalFRQuestionIds: ['core-map-operations', 'hd-map-content', 'map-freshness'],
  criticalScaleQuestionIds: ['throughput-map-requests', 'latency-map-download', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Vehicles can download HD maps',
      description: 'Download lane-level precision maps with road geometry and features',
      emoji: '🗺️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Vehicles can localize position',
      description: 'Match sensor observations to map features for precise positioning',
      emoji: '📍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Vehicles receive real-time updates',
      description: 'Get immediate notification of road closures, construction, and hazards',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Vehicles can query route data',
      description: 'Fetch map tiles for planned routes ahead of time',
      emoji: '🛣️',
    },
  ],

  outOfScope: [
    'Global map coverage (start with cities)',
    'Map creation pipeline (SLAM, 3D reconstruction)',
    'Offline map editing tools',
    'Historical map versions for replay',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where vehicles can download map tiles and receive updates. The complexity of tile-based delivery, incremental updates, and crowd-sourced mapping comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Map Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚗',
  scenario: "Welcome to AutoNav Systems! You're building the HD map infrastructure for a fleet of autonomous vehicles.",
  hook: "The first test vehicle just powered on. It needs to download a map to know where it is!",
  challenge: "Set up the basic connection so vehicles can reach your Map Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your map system is online!',
  achievement: 'Vehicles can now connect to your Map Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server is empty... it doesn't have any maps yet!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Map Service Architecture',
  conceptExplanation: `Every map system starts with vehicles (clients) connecting to a **Map Server**.

When a vehicle needs a map:
1. The **Vehicle** (client) is the autonomous car requesting map data
2. It sends requests to your **Map Server**
3. The server responds with HD map tiles

This is the foundation we'll build on!`,

  whyItMatters: 'Without this connection, vehicles are blind - they can\'t download maps, localize their position, or receive updates.',

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Serving maps to millions of vehicles',
    howTheyDoIt: 'Tesla vehicles connect to Tesla\'s map servers to download navigation data and HD map updates for Full Self-Driving',
  },

  keyPoints: [
    'Client = autonomous vehicle requesting map data',
    'Map Server = backend that stores and serves HD map tiles',
    'HTTPS = secure protocol for map downloads',
    'This simple architecture gets the system working - we\'ll optimize later',
  ],

  diagram: `
    [Vehicle] ──→ [Map Server] ──→ [Map Data Response]
  `,

  interviewTip: 'Always start with basic client-server. You can add databases, caches, and CDNs later.',
};

const step1: GuidedStep = {
  stepNumber: 1,
  title: 'Connect Vehicle to Map Server',
  story: step1Story,
  learn: step1LearnPhase,
  celebration: step1Celebration,
  practice: {
    task: 'Connect the Client (Vehicle) to the Map Server',
    hints: {
      componentsNeeded: [
        { type: 'client', reason: 'Autonomous vehicle requesting map data', displayName: 'Vehicle' },
        { type: 'app_server', reason: 'Map server that stores and serves HD maps', displayName: 'Map Server' },
      ],
      connectionsNeeded: [
        { from: 'Vehicle', to: 'Map Server', reason: 'Vehicle requests map tiles from server' },
      ],
    },
    successCriteria: [
      'Vehicle is connected to Map Server',
      'Map Server can receive map requests',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a Client (Vehicle) and an App Server (Map Server), then connect them',
    level2: 'Make sure the connection flows from Client to App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Map Tile Retrieval
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Great! Vehicles can connect to your Map Server. But the server doesn't know how to serve maps yet.",
  hook: "A vehicle is requesting tile 'SF_downtown_42_15' but gets no response. You need to implement the map retrieval logic!",
  challenge: "Write code to handle map tile requests and return the map data.",
  illustration: 'coding',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Map retrieval works!",
  achievement: "Vehicles can now download HD map tiles",
  metrics: [
    { label: 'Map tile retrieval', after: 'Implemented' },
    { label: 'Vehicles can navigate', after: '✓' },
  ],
  nextTeaser: "But what happens when the server restarts? All maps are lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Implementing Map Retrieval Logic',
  conceptExplanation: `Your Map Server needs to handle tile requests:

1. **Vehicle requests tile**: "GET /map/tile/SF_downtown_42_15"
2. **Server looks up tile**: Find the tile in storage (memory for now)
3. **Return map data**: Send the HD map tile (lane geometry, features)
4. **Handle errors**: Return 404 if tile doesn't exist

For now, you can store a few sample tiles in memory. We'll add proper storage later!`,

  whyItMatters: `Tile-based delivery is fundamental to map systems:
- **Efficient**: Vehicles only download needed areas
- **Scalable**: Server only sends requested tiles, not entire city
- **Cacheable**: Tiles can be cached at CDN edges`,

  keyPoints: [
    'Tiles are square regions (typically 1km × 1km) identified by coordinates',
    'Start with in-memory storage (dictionary/map) - it\'s fine for MVP',
    'Implement GET /map/tile/{tile_id} endpoint',
    'Return map data or 404 if tile doesn\'t exist',
  ],

  interviewTip: 'In interviews, it\'s OK to start with simple in-memory solutions. Show you can make it work first, then add persistence.',
};

const step2: GuidedStep = {
  stepNumber: 2,
  title: 'Implement Map Tile Retrieval',
  story: step2Story,
  learn: step2LearnPhase,
  celebration: step2Celebration,
  practice: {
    task: 'Write code to handle map tile requests (in-memory is fine!)',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Map retrieval logic implemented',
      'Can return map tiles to vehicles',
      'Handles missing tiles gracefully',
    ],
  },
  validation: {
    requiredComponents: ['app_server'],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Write Python code in the Map Server to handle tile requests',
    level2: 'Store sample tiles in a dictionary. Implement GET /map/tile/{tile_id} endpoint.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database for Map Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your map retrieval works! But there's a problem: when the server restarts, all map tiles disappear.",
  hook: "Vehicles are getting 404 errors because maps aren't persisted. You need permanent storage!",
  challenge: "Add a Database to store map tiles permanently.",
  illustration: 'database',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Maps persist!",
  achievement: "Map tiles now survive server restarts",
  metrics: [
    { label: 'Data durability', before: 'Lost on restart', after: 'Persisted' },
    { label: 'Map tiles stored', after: '✓' },
  ],
  nextTeaser: "But serving maps from the database is slow... vehicles are waiting!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Adding Persistence: Map Database',
  conceptExplanation: `A **Database** stores your map data permanently on disk. Even if your Map Server crashes, the data survives.

For HD maps, you need to store:
- **Map tiles**: The actual map data (lane geometry, features)
- **Tile metadata**: Version, coverage area, last update time
- **Tile index**: Spatial index for fast lookup by coordinates

When a vehicle requests a tile, your Map Server:
1. Queries the database for the tile
2. Reads the map data from disk
3. Returns it to the vehicle`,

  whyItMatters: `Databases provide:
- **Durability**: Map data survives crashes and restarts
- **Versioning**: Track different versions of the same tile
- **Querying**: Find tiles by geographic coordinates
- **Consistency**: Ensure vehicles get correct tile versions`,

  realWorldExample: {
    company: 'HERE Technologies',
    scenario: 'Storing HD maps for millions of road kilometers',
    howTheyDoIt: 'HERE uses a combination of PostgreSQL/PostGIS for tile metadata and object storage (S3) for large map tile blobs',
  },

  keyPoints: [
    'Use database for persistent storage of map tiles',
    'Store tile metadata (version, bounds) in relational DB',
    'Store large tile blobs in object storage or database',
    'Add spatial index for fast geographic queries',
  ],

  diagram: `
    [Map Server] ──→ [Database]
         │              │
         └── Query tile by ID
         └── Read map data
         └── Return to vehicle
  `,

  interviewTip: 'Always add a database after basic functionality works. It\'s the foundation for durability.',
};

const step3: GuidedStep = {
  stepNumber: 3,
  title: 'Add Database for Map Storage',
  story: step3Story,
  learn: step3LearnPhase,
  celebration: step3Celebration,
  practice: {
    task: 'Add a Database and connect it to your Map Server',
    hints: {
      componentsNeeded: [
        { type: 'database', reason: 'Store map tiles permanently', displayName: 'Map Database' },
      ],
      connectionsNeeded: [
        { from: 'Map Server', to: 'Map Database', reason: 'Map server reads tile data from database' },
      ],
    },
    successCriteria: [
      'Database is connected to Map Server',
      'Map tiles are persisted',
      'Tiles survive server restarts',
    ],
  },
  validation: {
    requiredComponents: ['app_server', 'database'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database component and connect it to your Map Server',
    level2: 'Update your code to read tiles from the database instead of memory',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Add CDN for Tile-Based Delivery
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌍',
  scenario: "Maps are persisted! But there's a performance problem: vehicles across the country are all hitting your single Map Server.",
  hook: "Response times are 2-3 seconds because vehicles in LA are reaching a server in Virginia. Highway driving at 60mph means vehicles need maps NOW!",
  challenge: "Add a CDN to cache map tiles close to vehicles for fast delivery.",
  illustration: 'cdn',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Tile delivery is fast!",
  achievement: "Map tiles are now served from CDN edges near vehicles",
  metrics: [
    { label: 'Tile latency', before: '2-3 seconds', after: '<200ms' },
    { label: 'Origin server load', before: '50K req/s', after: '<100 req/s' },
  ],
  nextTeaser: "But when you update a map, vehicles still have the old version...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'CDN for Geographically Distributed Tile Delivery',
  conceptExplanation: `A **CDN (Content Delivery Network)** caches map tiles at edge servers worldwide.

How it works:
1. **First request**: Vehicle in LA requests tile → CDN edge cache miss → Fetch from origin Map Server → Cache at LA edge → Return to vehicle (slow)
2. **Subsequent requests**: Other vehicles in LA request same tile → CDN edge cache hit → Instant return (fast!)
3. **Geographic proximity**: Vehicles always hit nearest CDN edge

50MB tiles × 50K requests/sec would overwhelm a single origin server. CDN absorbs 99%+ of traffic.`,

  whyItMatters: `CDN is essential for map delivery:
- **Latency**: Serve tiles from edge servers near vehicles (<200ms vs 2s+)
- **Scalability**: Handle 50K req/s without scaling origin servers
- **Bandwidth**: Reduce origin bandwidth by 99%+ (only cache misses)
- **Reliability**: CDN edge servers provide redundancy`,

  realWorldExample: {
    company: 'Waymo',
    scenario: 'Serving HD maps to autonomous vehicles',
    howTheyDoIt: 'Waymo uses Google\'s global CDN to cache map tiles at edge locations, ensuring vehicles get maps with minimal latency',
  },

  keyPoints: [
    'CDN caches map tiles at edge servers globally',
    'Cache hit rate >95% for popular tiles (high reuse)',
    'Origin server only handles cache misses',
    'TTL (time-to-live) controls how long tiles are cached',
  ],

  diagram: `
    [Vehicle LA] ──→ [CDN LA Edge] ──→ [Map Server]
    [Vehicle NY] ──→ [CDN NY Edge] ──→ [Map Server]
                           ↑
                    Cache Hit: Skip origin
  `,

  interviewTip: 'CDN is the standard solution for geographically distributed content delivery. Always mention it for global systems.',
};

const step4: GuidedStep = {
  stepNumber: 4,
  title: 'Add CDN for Tile-Based Delivery',
  story: step4Story,
  learn: step4LearnPhase,
  celebration: step4Celebration,
  practice: {
    task: 'Add a CDN between vehicles and the Map Server',
    hints: {
      componentsNeeded: [
        { type: 'cdn', reason: 'Cache map tiles at edge locations for fast delivery', displayName: 'Map CDN' },
      ],
      connectionsNeeded: [
        { from: 'Vehicle', to: 'Map CDN', reason: 'Vehicles request tiles from CDN edge' },
        { from: 'Map CDN', to: 'Map Server', reason: 'CDN fetches tiles from origin on cache miss' },
      ],
    },
    successCriteria: [
      'CDN is added to the architecture',
      'Vehicles request tiles from CDN',
      'CDN fetches from origin Map Server on cache miss',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a CDN component between Vehicle and Map Server',
    level2: 'Connect Vehicle → CDN → Map Server to create the caching layer',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Incremental Updates
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📡',
  scenario: "Maps are fast! But there's a freshness problem: when a road gets construction, you update the tile in the database, but vehicles with cached tiles don't know!",
  hook: "A vehicle drove into a closed road because its 2-week-old cached tile showed it as open. You need a way to push updates to vehicles!",
  challenge: "Add a Message Queue to notify vehicles when their cached tiles have updates available.",
  illustration: 'real-time',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Incremental updates work!",
  achievement: "Vehicles now receive notifications when their cached maps have updates",
  metrics: [
    { label: 'Update propagation', before: 'Days', after: '<10 seconds' },
    { label: 'Bandwidth savings', after: '500x (delta vs full tile)' },
  ],
  nextTeaser: "But who's reporting all these map changes? You need more data sources!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Updates with Message Queues',
  conceptExplanation: `A **Message Queue** enables pushing updates to vehicles asynchronously.

How incremental updates work:
1. **Map change detected**: Road closure, new sign, lane restriping
2. **Generate delta patch**: Encode only the changes (10-100KB vs 50MB full tile)
3. **Publish to queue**: Message queue topic "tile_updates/SF_downtown_42_15"
4. **Vehicles subscribe**: All vehicles with that tile cached subscribe to its topic
5. **Receive and apply**: Vehicles receive delta patch, apply to cached tile

Without this, vehicles would need to poll for updates or wait for cache TTL expiry (wasteful).`,

  whyItMatters: `Message queues enable:
- **Push updates**: Vehicles get notified immediately, don't need to poll
- **Bandwidth efficiency**: Only send deltas (500x smaller than full tiles)
- **Selective delivery**: Only vehicles with affected tiles get updates
- **Decoupling**: Map update system independent of map delivery`,

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Pushing map updates to vehicles',
    howTheyDoIt: 'Tesla uses pub/sub messaging to push incremental map updates to vehicles, reducing bandwidth and ensuring vehicles have fresh data',
  },

  keyPoints: [
    'Message queue enables pub/sub pattern for map updates',
    'Vehicles subscribe to updates for tiles they have cached',
    'Delta patches are 500-5000x smaller than full tiles',
    'Critical updates (road closures) pushed with high priority',
  ],

  diagram: `
    [Map Update Service] ──→ [Message Queue]
                                   │
                                   ├──→ [Vehicle 1] (subscribed to tile_42_15)
                                   ├──→ [Vehicle 2] (subscribed to tile_42_15)
                                   └──→ [Vehicle 3] (subscribed to tile_42_15)
  `,

  interviewTip: 'Message queues are essential for real-time updates at scale. Mention pub/sub for 1-to-many delivery.',
};

const step5: GuidedStep = {
  stepNumber: 5,
  title: 'Add Message Queue for Incremental Updates',
  story: step5Story,
  learn: step5LearnPhase,
  celebration: step5Celebration,
  practice: {
    task: 'Add a Message Queue to push map updates to vehicles',
    hints: {
      componentsNeeded: [
        { type: 'message_queue', reason: 'Publish map updates to subscribed vehicles', displayName: 'Update Queue' },
      ],
      connectionsNeeded: [
        { from: 'Map Server', to: 'Update Queue', reason: 'Map server publishes update notifications' },
        { from: 'Update Queue', to: 'Vehicle', reason: 'Vehicles subscribe to updates for cached tiles' },
      ],
    },
    successCriteria: [
      'Message Queue is added',
      'Map Server publishes updates to queue',
      'Vehicles receive update notifications',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'client' },
    ],
  },
  hints: {
    level1: 'Add a Message Queue component',
    level2: 'Connect Map Server → Message Queue → Vehicle for update notifications',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'client' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Crowd-Sourced Mapping Pipeline
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚗',
  scenario: "Updates are fast! But where do the updates come from? You can't manually inspect every road every day!",
  hook: "A new traffic sign was installed 3 months ago, but your maps still don't have it. You need the fleet to report map discrepancies!",
  challenge: "Add a crowd-sourced mapping pipeline where vehicles report anomalies and help keep maps fresh.",
  illustration: 'feedback-loop',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Crowd-sourced mapping works!",
  achievement: "Your fleet of vehicles is now a distributed mapping sensor network",
  metrics: [
    { label: 'Map freshness', before: 'Manual updates', after: 'Continuous crowd-sourcing' },
    { label: 'Anomaly detection', after: 'Real-time from fleet' },
  ],
  nextTeaser: "Your HD map system is complete! Vehicles can download maps, get updates, and report changes. Congratulations!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Crowd-Sourced Mapping for Continuous Updates',
  conceptExplanation: `**Crowd-sourced mapping** turns your vehicle fleet into a distributed sensor network.

How it works:
1. **Detect discrepancy**: Vehicle sensors detect lane marking but it doesn't match map → anomaly
2. **Upload report**: Vehicle uploads anomaly report (location, sensor snapshot, confidence)
3. **Aggregate reports**: Map update service collects reports from multiple vehicles
4. **Verify change**: If 10+ vehicles report same discrepancy → likely real change
5. **Human review**: Mapper reviews sensor data, updates HD map
6. **Publish update**: New map version published via incremental update queue

This creates a continuous feedback loop - the fleet keeps maps fresh automatically!`,

  whyItMatters: `Crowd-sourcing is essential for map freshness:
- **Scalability**: Can't manually inspect millions of road kilometers
- **Real-time**: Fleet detects changes as they happen (new signs, restriping)
- **Coverage**: Every road the fleet drives gets monitored
- **Cost**: Distributed sensing cheaper than dedicated mapping vehicles`,

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Fleet learning for map improvements',
    howTheyDoIt: 'Tesla\'s fleet of millions of vehicles detects lane markings, signs, and road features. When multiple vehicles report the same feature, Tesla updates their maps automatically.',
  },

  keyPoints: [
    'Vehicles upload anomaly reports when sensors disagree with map',
    'Message queue collects reports from entire fleet',
    'Aggregation service clusters reports by location',
    'Human mappers review and approve changes',
    'Updated maps published via incremental update pipeline',
  ],

  diagram: `
    [Vehicle Fleet] ──→ [Anomaly Upload Queue] ──→ [Map Update Service]
                                                            │
                                                            ├──→ [Aggregate Reports]
                                                            ├──→ [Human Review]
                                                            └──→ [Publish Updates] ──→ [Message Queue] ──→ [Vehicles]
  `,

  interviewTip: 'Crowd-sourcing is a powerful pattern for distributed data collection. Great for maps, traffic, and user-generated content.',
};

const step6: GuidedStep = {
  stepNumber: 6,
  title: 'Add Crowd-Sourced Mapping Pipeline',
  story: step6Story,
  learn: step6LearnPhase,
  celebration: step6Celebration,
  practice: {
    task: 'Add components for vehicles to upload anomaly reports',
    hints: {
      componentsNeeded: [
        { type: 'message_queue', reason: 'Collect anomaly reports from vehicles', displayName: 'Anomaly Queue' },
      ],
      connectionsNeeded: [
        { from: 'Vehicle', to: 'Anomaly Queue', reason: 'Vehicles upload map discrepancy reports' },
        { from: 'Anomaly Queue', to: 'Map Server', reason: 'Map server processes reports and updates maps' },
      ],
    },
    successCriteria: [
      'Anomaly upload pipeline is added',
      'Vehicles can report map discrepancies',
      'Map server processes reports for updates',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add another Message Queue for anomaly reports',
    level2: 'Connect Vehicle → Anomaly Queue → Map Server for crowd-sourced updates',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'client', to: 'message_queue' },
      { from: 'message_queue', to: 'app_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const autonomousVehicleMapGuidedTutorial: GuidedTutorial = {
  problemId: 'autonomous-vehicle-map-guided',
  problemTitle: 'Build an HD Map System for Autonomous Vehicles',

  // Requirements gathering phase (Step 0)
  requirementsPhase: autonomousVehicleMapRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],
};

export function getAutonomousVehicleMapGuidedTutorial(): GuidedTutorial {
  return autonomousVehicleMapGuidedTutorial;
}
