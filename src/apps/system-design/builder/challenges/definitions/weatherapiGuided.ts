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
 * Weather API Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a weather API service. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution - FRs satisfied!
 * Steps 4-8: Apply NFRs (cache, CDN, replication, queues, etc.)
 *
 * Key Features:
 * - Current weather data
 * - Weather forecasts
 * - Location-based queries
 * - Historical weather data
 * - Severe weather alerts
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const weatherApiRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Weather API service like OpenWeatherMap or Weather.com API",

  interviewer: {
    name: 'Dr. Elena Torres',
    role: 'VP of Engineering',
    avatar: '👩‍🔬',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-weather-ops',
      category: 'functional',
      question: "What are the main operations users need from a weather API?",
      answer: "Users need:\n1. **Get current weather** for a location (city, coordinates)\n2. **Get forecast** for the next 7-14 days\n3. **Search by location** - city name, zip code, or lat/long coordinates\n4. **Get historical weather** data for analysis\n5. **Receive severe weather alerts** for their location",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4, FR-5',
      learningPoint: "Weather APIs serve different use cases: consumers check daily forecasts, while businesses need historical data for analytics",
    },
    {
      id: 'data-freshness',
      category: 'functional',
      question: "How fresh does the weather data need to be?",
      answer: "Current weather should be updated **every 10-15 minutes**. Forecasts can be updated every 1-3 hours. Historical data never changes. This is key for caching strategy!",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Different data types have different freshness requirements - this drives your caching strategy",
    },
    {
      id: 'location-accuracy',
      category: 'functional',
      question: "How accurate do location lookups need to be?",
      answer: "City-level accuracy is sufficient for most users. We'll support:\n- City name (e.g., 'San Francisco, CA')\n- ZIP codes\n- Lat/long coordinates (for precise locations)\n- IP-based auto-detection (convenience feature)",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Multiple location formats increase usability but add complexity to geocoding",
    },

    // IMPORTANT - Clarifications
    {
      id: 'forecast-range',
      category: 'clarification',
      question: "How far into the future should forecasts go?",
      answer: "Standard forecast: 7 days. Extended forecast: 14 days for premium users. Hourly forecast: 48 hours.",
      importance: 'important',
      insight: "Different forecast ranges serve different user segments",
    },
    {
      id: 'historical-range',
      category: 'clarification',
      question: "How much historical data should we store?",
      answer: "Store last 5 years for popular locations, last 1 year for all locations. Archive older data to cold storage.",
      importance: 'important',
      insight: "Historical data grows linearly - plan for archival strategy",
    },
    {
      id: 'alert-severity',
      category: 'clarification',
      question: "What types of severe weather alerts should we support?",
      answer: "Critical alerts: Hurricanes, tornadoes, flash floods. Important: Severe thunderstorms, winter storms. Advisory: Heat, wind, fog.",
      importance: 'important',
      insight: "Alert severity determines delivery priority and user notification strategy",
    },
    {
      id: 'data-accuracy',
      category: 'quality',
      question: "Where do we get weather data from?",
      answer: "We'll integrate with NOAA (National Weather Service), integrate weather station networks, and use weather radar data. We aggregate from multiple sources for accuracy.",
      importance: 'important',
      insight: "Weather accuracy requires multiple data sources - single source is unreliable",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-dau',
      category: 'throughput',
      question: "How many daily active users should we design for?",
      answer: "50 million DAU across web, mobile apps, and API integrations",
      importance: 'critical',
      learningPoint: "Weather APIs have massive scale - everyone checks the weather daily",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many API requests per day?",
      answer: "500 million API requests per day (10 queries per DAU on average)",
      importance: 'critical',
      calculation: {
        formula: "500M ÷ 86,400 sec = 5,787 queries/sec average",
        result: "~5,800 queries/sec (17,400 at peak)",
      },
      learningPoint: "Weather APIs are read-heavy - almost all requests are reads, very few writes",
    },
    {
      id: 'read-write-ratio',
      category: 'throughput',
      question: "What's the read-to-write ratio?",
      answer: "Extremely read-heavy: 99.9% reads (user queries), 0.1% writes (data ingestion from weather stations). That's 1000:1 ratio!",
      importance: 'critical',
      calculation: {
        formula: "5,787 total - 99.9% reads = 5,781 read QPS, 6 write QPS",
        result: "~5,781 reads/sec, ~6 writes/sec",
      },
      learningPoint: "This extreme read skew means caching is CRITICAL",
    },

    // 2. PAYLOAD
    {
      id: 'payload-response',
      category: 'payload',
      question: "How much data is in a typical weather response?",
      answer: "Current weather: ~2KB. 7-day forecast: ~15KB. Historical query: ~50KB. Includes temperature, humidity, wind, precipitation, etc.",
      importance: 'important',
      calculation: {
        formula: "5,787 QPS × 2KB avg = 11.6 MB/sec",
        result: "~700 MB/min, ~42 GB/hour at average load",
      },
      learningPoint: "Weather data is structured and compresses well - use compression!",
    },
    {
      id: 'payload-storage',
      category: 'payload',
      question: "How much storage for all this weather data?",
      answer: "Current weather for 100K locations: ~200MB. Forecasts: ~1.5GB. Historical (5 years): ~10TB. Total: ~15TB with compression.",
      importance: 'important',
      insight: "Historical data dominates storage - separate hot/cold storage tiers",
    },

    // 3. BURSTS
    {
      id: 'burst-peak',
      category: 'burst',
      question: "When does traffic spike?",
      answer: "Morning (6-9 AM): 3x average as people plan their day. During severe weather events: 10x spike as people check for alerts.",
      importance: 'critical',
      calculation: {
        formula: "5,787 avg × 10 = 57,870 peak",
        result: "~58,000 QPS during severe weather events",
      },
      insight: "Severe weather causes massive traffic spikes - need auto-scaling and rate limiting",
    },
    {
      id: 'burst-seasonal',
      category: 'burst',
      question: "Are there seasonal patterns?",
      answer: "Hurricane season (Jun-Nov): 2x traffic in affected regions. Winter storms: 3x traffic. Summer vacation planning: 1.5x.",
      importance: 'important',
      insight: "Regional and seasonal patterns allow predictive scaling",
    },

    // 4. LATENCY
    {
      id: 'latency-query',
      category: 'latency',
      question: "How fast should weather queries be?",
      answer: "p99 < 200ms for current weather. p99 < 500ms for forecasts. Users expect near-instant results.",
      importance: 'critical',
      learningPoint: "Weather queries are synchronous - users are waiting",
    },
    {
      id: 'latency-alerts',
      category: 'latency',
      question: "How quickly must severe weather alerts be delivered?",
      answer: "Critical alerts: < 30 seconds from detection to user notification. Lives depend on this!",
      importance: 'critical',
      learningPoint: "Alert delivery is async but time-critical - needs push notifications",
    },

    // 5. AVAILABILITY
    {
      id: 'availability-sla',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.9% availability (8.7 hours downtime/year). During severe weather, must be even higher - people's safety depends on it.",
      importance: 'critical',
      insight: "Weather API downtime during emergencies can be life-threatening",
    },

    // 6. CDN
    {
      id: 'cdn-geographic',
      category: 'cdn',
      question: "Do we need global coverage?",
      answer: "Yes! Users are distributed globally. Need edge caching in all major regions to minimize latency.",
      importance: 'critical',
      insight: "CDN is critical for global weather API - serves static forecast data from edge",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-weather-ops', 'data-freshness', 'throughput-queries'],
  criticalFRQuestionIds: ['core-weather-ops', 'data-freshness', 'location-accuracy'],
  criticalScaleQuestionIds: ['throughput-queries', 'read-write-ratio', 'burst-peak', 'latency-query'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Get current weather',
      description: 'Users can query current weather conditions for any location',
      emoji: '🌤️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Get weather forecast',
      description: 'Users can get 7-day and hourly forecasts',
      emoji: '📅',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Location-based queries',
      description: 'Support city name, ZIP code, and lat/long coordinates',
      emoji: '📍',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Historical weather data',
      description: 'Users can query past weather for analysis',
      emoji: '📊',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Severe weather alerts',
      description: 'Push critical weather alerts to users in affected areas',
      emoji: '⚠️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 million',
    writesPerDay: '500,000 (data ingestion)',
    readsPerDay: '500 million',
    peakMultiplier: 10,
    readWriteRatio: '1000:1',
    calculatedWriteRPS: { average: 6, peak: 60 },
    calculatedReadRPS: { average: 5787, peak: 57870 },
    maxPayloadSize: '~15KB (forecast)',
    storagePerRecord: '~2KB (current weather)',
    storageGrowthPerYear: '~3TB (historical data)',
    redirectLatencySLA: 'p99 < 200ms (current weather)',
    createLatencySLA: 'p99 < 500ms (forecast)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (1000:1) → Aggressive caching is MANDATORY',
    '✅ 58K QPS peak → CDN + multiple cache layers',
    '✅ Only 60 writes/sec → Single DB primary can handle writes',
    '✅ p99 < 200ms → Multi-tier caching (edge, CDN, app cache)',
    '✅ Global users → Geographic distribution with CDN',
    '✅ Severe weather alerts → Message queue for push notifications',
    '✅ Historical data → Separate cold storage tier',
  ],

  outOfScope: [
    'Weather predictions/modeling (we consume, not create)',
    'Radar imagery and satellite data',
    'Air quality index',
    'UV index and pollen count',
    'Marine weather and tide data',
  ],

  keyInsight: "Weather APIs are all about CACHING. With a 1000:1 read-to-write ratio and data that changes slowly (every 10-15 minutes), we can cache aggressively. Our job is to serve cached data fast, not to generate weather predictions. Let's build it step by step!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌤️',
  scenario: "Welcome! You're building WeatherAPI - the next great weather service.",
  hook: "Millions of users want to check the weather. They need a reliable API to query current conditions and forecasts.",
  challenge: "Connect the Client to the App Server to handle weather queries.",
  illustration: 'weather-startup',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your Weather API is online!",
  achievement: "Users can now send weather queries to your server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to fetch weather data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Weather API Architecture',
  conceptExplanation: `Every API service starts with a **Client** connecting to a **Server**.

When a user checks the weather on their phone:
1. The app (Client) sends an HTTP request: "GET /weather?city=Seattle"
2. Your App Server receives and processes the request
3. The server returns JSON with temperature, conditions, forecast, etc.

This is the foundation of all weather services!`,
  whyItMatters: 'The app server is the gateway to all weather data. Every query flows through here.',
  keyPoints: [
    'Client represents end users (mobile apps, web apps, IoT devices)',
    'App Server processes weather queries and returns responses',
    'RESTful API design: GET /current, GET /forecast, GET /alerts',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Weather   │ ◀────── │  (Weather API)  │
│    App)     │         └─────────────────┘
└─────────────┘
`,
  keyConcepts: [
    {
      title: 'RESTful API',
      explanation: 'Use HTTP methods: GET for queries, POST for alerts subscriptions',
      icon: '🔌',
    },
  ],
  quickCheck: {
    question: 'What does the App Server do in a weather API?',
    options: [
      'Generates weather predictions',
      'Receives queries and returns weather data',
      'Stores all historical weather data',
      'Sends push notifications',
    ],
    correctIndex: 1,
    explanation: 'The App Server is the API layer that receives user queries and returns weather data responses.',
  },
};

const step1: GuidedStep = {
  id: 'weatherapi-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit weather queries to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users querying weather', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes weather API requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send weather queries' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Configure the App Server with Python Code
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your App Server is connected, but it's just an empty box.",
  hook: "Users are getting 404 errors when they query weather! The server doesn't know HOW to fetch weather data.",
  challenge: "Configure APIs and implement Python handlers for current weather, forecasts, and location lookup.",
  illustration: 'empty-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your Weather API is functional!",
  achievement: "Users can query current weather, forecasts, and search by location",
  metrics: [
    { label: 'APIs configured', after: '3 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But when the server restarts... all the data disappears!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Weather Data Handling',
  conceptExplanation: `Your Weather API needs endpoints to serve different data types:

**1. GET /api/v1/weather/current?location={location}**
- Returns: Current temperature, conditions, humidity, wind
- Your code: Query weather provider, parse response, return JSON

**2. GET /api/v1/weather/forecast?location={location}&days=7**
- Returns: Daily and hourly forecasts
- Your code: Fetch forecast data, format response

**3. GET /api/v1/weather/location?q={query}**
- Returns: Geocoded location (lat/long from city name)
- Your code: Geocoding service lookup

**By the end of this step you should have:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for all endpoints`,
  whyItMatters: 'Without these handlers, your API is just an empty shell. The Python code defines what actually happens when users query weather.',
  keyPoints: [
    'GET endpoints for all queries (RESTful design)',
    'Location parameter supports city, ZIP, or lat/long',
    'Response includes all relevant weather metrics',
    'Error handling for invalid locations',
    'Open the Python tab to implement your handlers',
  ],
  diagram: `
GET /api/v1/weather/current?location=Seattle
┌─────────────────────────────────────────────────┐
│ Response: {                                     │
│   "temp": 68,                                   │
│   "conditions": "Partly Cloudy",                │
│   "humidity": 65,                               │
│   "wind_speed": 12                              │
│ }                                               │
└─────────────────────────────────────────────────┘

GET /api/v1/weather/forecast?location=Seattle&days=7
┌─────────────────────────────────────────────────┐
│ Response: {                                     │
│   "daily": [ {day1}, {day2}, ... ],            │
│   "hourly": [ {hour1}, {hour2}, ... ]          │
│ }                                               │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'RESTful API', explanation: 'GET for queries, query params for filters', icon: '🔌' },
    { title: 'Geocoding', explanation: 'Convert location names to coordinates', icon: '🗺️' },
    { title: 'Python Handlers', explanation: 'Code that processes each API request', icon: '🐍' },
  ],
  quickCheck: {
    question: 'Which HTTP method should be used for weather queries?',
    options: [
      'POST - because we\'re creating a query',
      'GET - because we\'re reading data',
      'PUT - because we\'re updating weather',
      'DELETE - because we\'re removing old data',
    ],
    correctIndex: 1,
    explanation: 'GET is used for reading/querying data. Weather queries don\'t modify server state.',
  },
};

const step2: GuidedStep = {
  id: 'weatherapi-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle weather queries with Python code',
    taskDescription: 'Re-use your Client → App Server, then configure APIs and implement Python handlers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/weather/current, GET /api/v1/weather/forecast, GET /api/v1/weather/location APIs',
      'Open the Python tab and implement handlers for all endpoints',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then switch to Python tab to write handlers',
    level2: 'Assign all three APIs, then implement get_current_weather(), get_forecast(), and geocode_location() functions',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: The Crisis - We Lost All Weather Data!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your server crashed during a storm.",
  hook: "When it restarted... ALL cached weather data was GONE! Every query now takes 2 seconds to fetch from external APIs. Users are abandoning your app!",
  challenge: "We need a database to cache weather data persistently, so it survives restarts.",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your weather data is now safe!",
  achievement: "Weather data persists even when the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted' },
    { label: 'Query speed', before: '2000ms', after: '50ms (from DB)' },
  ],
  nextTeaser: "Good! But users are still experiencing slow response times...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Caching Weather Data',
  conceptExplanation: `Weather APIs query external providers (NOAA, weather stations). Each query costs:
- Time: 500-2000ms to fetch from external API
- Money: $0.001 per request (adds up fast at scale!)

**Problem**: In-memory cache is lost on restart. External API calls are slow and expensive.

**Solution**: Store weather data in a database!
- Cache current weather for all locations
- Cache forecasts
- Cache geocoding lookups
- Set TTL (Time-To-Live) based on data freshness:
  - Current weather: 10 minutes
  - Forecasts: 3 hours
  - Geocoding: 30 days (locations don't move!)

For WeatherAPI, we cache in PostgreSQL with:
- \`current_weather\` table with 10-min TTL
- \`forecasts\` table with 3-hour TTL
- \`locations\` table for geocoding cache`,
  whyItMatters: 'Without persistent caching, every query hits expensive external APIs. Database caching cuts costs by 99% and improves speed by 20x.',
  realWorldExample: {
    company: 'Weather.com',
    scenario: 'Serving 500 million daily weather queries',
    howTheyDoIt: 'Caches all weather data in distributed databases with TTL-based expiration. Only refreshes when data expires.',
  },
  famousIncident: {
    title: 'OpenWeatherMap Rate Limit Crisis',
    company: 'OpenWeatherMap',
    year: '2020',
    whatHappened: 'A startup built a weather app without caching. They made 1 million API calls per day to OpenWeatherMap. Hit rate limits, got banned, app went down. Cost: $50,000 in overages.',
    lessonLearned: 'Always cache weather data! External APIs have rate limits and costs. Caching is mandatory, not optional.',
    icon: '💸',
  },
  keyPoints: [
    'Database caches external API responses to reduce cost and latency',
    'Use TTL to auto-expire stale data (10 min for current, 3 hrs for forecast)',
    'Geocoding cache has long TTL (locations don\'t change)',
    'Read-through pattern: check cache first, fetch on miss, update cache',
  ],
  diagram: `
Query: GET /weather?city=Seattle

┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Client    │ ────▶ │ App Server  │ ────▶ │   Database     │
└─────────────┘       └─────────────┘       │  (Cache)       │
                             │               │                │
                             │ Cache miss?   │ Seattle: 68°F  │
                             │               │ (expires in    │
                             ▼               │  8 minutes)    │
                      ┌──────────────┐       └────────────────┘
                      │External API  │
                      │ (NOAA)       │ ← Only on cache miss!
                      │ 2000ms       │
                      └──────────────┘
`,
  keyConcepts: [
    { title: 'TTL', explanation: 'Time-To-Live: cache expires after N minutes', icon: '⏰' },
    { title: 'Cache Miss', explanation: 'Data not in DB, must query external API', icon: '❌' },
    { title: 'Read-Through', explanation: 'App checks cache, fetches on miss, updates cache', icon: '📖' },
  ],
  quickCheck: {
    question: 'Why do we cache weather data in a database?',
    options: [
      'Databases are faster than external APIs',
      'To survive restarts AND reduce expensive external API calls',
      'Databases have better weather data',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'Database caching provides both persistence (survives restarts) and cost/performance optimization (fewer external API calls).',
  },
};

const step3: GuidedStep = {
  id: 'weatherapi-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Weather data must be cached persistently',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'database', reason: 'Caches weather data with TTL', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send queries' },
      { from: 'App Server', to: 'Database', reason: 'Server caches weather data' },
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
// STEP 4: The Slowdown - Still Too Slow!
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your API is getting popular! 5,000 queries per second now.",
  hook: "But response times are 100-200ms. Users in Seattle keep asking for the same forecast - you're hitting the database 1,000 times for identical data!",
  challenge: "Add an in-memory cache layer (Redis) to serve hot data instantly.",
  illustration: 'slow-database',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Weather queries are now lightning fast!",
  achievement: "Popular cities are served from Redis in milliseconds",
  metrics: [
    { label: 'Query latency', before: '100ms', after: '5ms' },
    { label: 'Database load', before: '5,000 queries/sec', after: '50 queries/sec' },
    { label: 'Cache hit rate', after: '99%' },
  ],
  nextTeaser: "Excellent! But suddenly a hurricane hits Florida...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'In-Memory Caching: Redis for Hot Data',
  conceptExplanation: `You have TWO cache layers now:

**Database Cache (PostgreSQL):**
- Persistent storage
- Caches external API responses
- 50-100ms query time

**In-Memory Cache (Redis):**
- Extremely fast (1-5ms)
- Stores hottest data (popular cities)
- Sits in front of database

**How it works:**
1. User queries "Seattle weather"
2. Check Redis → Cache HIT → Return (5ms) ✅
3. If Redis miss → Check Database → Return + Update Redis (100ms)
4. If DB miss → Query external API → Update DB + Redis (2000ms)

**The 80/20 rule:** 20% of locations (NYC, LA, London) get 80% of queries. Keep these in Redis!`,
  whyItMatters: 'Database queries (100ms) are 20x slower than Redis (5ms). At 5,000 QPS, this difference is massive for user experience.',
  realWorldExample: {
    company: 'AccuWeather',
    scenario: 'Handling traffic spikes during severe weather',
    howTheyDoIt: 'Multi-tier caching: Redis for hot cities, PostgreSQL for all cities, external APIs as fallback',
  },
  famousIncident: {
    title: 'Weather Underground Cache Failure',
    company: 'Weather Underground',
    year: '2018',
    whatHappened: 'Their Redis cluster failed during a hurricane. All queries hit the database. Database couldn\'t handle the load. API went down for 3 hours during a critical weather event.',
    lessonLearned: 'Redis should have failover. But more importantly: cache isn\'t optional at scale - it\'s critical infrastructure.',
    icon: '🌀',
  },
  keyPoints: [
    'Redis caches the hottest 20% of data (popular cities)',
    'Database caches everything else (long tail)',
    'Cache-aside pattern with multi-tier lookup',
    'Set TTL to match data freshness (10 min for current weather)',
  ],
  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Redis    │ ← 5ms (hit!)
                   │      │  (Hot Data) │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │───▶│App Server│      │ miss?
└────────┘    └────┬─────┘      ▼
                   │      ┌─────────────┐
                   └────▶ │  Database   │ ← 100ms
                          │  (All Data) │
                          └─────────────┘
                                 │ miss?
                                 ▼
                          ┌─────────────┐
                          │External API │ ← 2000ms
                          └─────────────┘
`,
  keyConcepts: [
    { title: 'Hot Data', explanation: '20% of locations that get 80% of traffic', icon: '🔥' },
    { title: 'Multi-Tier Cache', explanation: 'Redis → Database → External API', icon: '🎯' },
    { title: 'Cache-Aside', explanation: 'Check cache first, load on miss', icon: '📦' },
  ],
  quickCheck: {
    question: 'Why do we need BOTH Redis and Database caching?',
    options: [
      'Database is backup if Redis fails',
      'Redis is fast but volatile; Database is slower but persistent',
      'Redis is cheaper than Database',
      'They serve different data types',
    ],
    correctIndex: 1,
    explanation: 'Redis provides speed (5ms) but loses data on restart. Database provides persistence. Together they give us both.',
  },
};

const step4: GuidedStep = {
  id: 'weatherapi-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Queries must be fast (< 10ms p99 for popular cities)',
    taskDescription: 'Build Client → App Server → Redis → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes API requests', displayName: 'App Server' },
      { type: 'cache', reason: 'Caches hot weather data for fast access', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Persistent cache for all weather data', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send queries' },
      { from: 'App Server', to: 'Cache', reason: 'Check Redis first' },
      { from: 'App Server', to: 'Database', reason: 'Fallback to DB on cache miss' },
    ],
    successCriteria: ['Build full architecture with Redis Cache', 'Connect App Server to both Cache and Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Redis Cache between App Server and Database',
    level2: 'Add all components, connect App Server to both Cache and Database for multi-tier caching',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: The Hurricane - Traffic Spike 10x!
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌀',
  scenario: "BREAKING: Category 5 hurricane approaching Florida!",
  hook: "Traffic just spiked 10x! Everyone in Florida is checking weather and alerts. Your single App Server is at 100% CPU, queries are timing out!",
  challenge: "Add a Load Balancer to distribute traffic across multiple App Servers.",
  illustration: 'traffic-hurricane',
};

const step5Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "You can handle the surge!",
  achievement: "Load balancer distributes traffic across multiple servers",
  metrics: [
    { label: 'Capacity', before: '5,000 QPS', after: '50,000+ QPS' },
    { label: 'Availability', before: 'Single point of failure', after: 'Highly available' },
    { label: 'CPU usage', before: '100%', after: '40%' },
  ],
  nextTeaser: "Great! But now we need to configure auto-scaling...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handling Traffic Surges',
  conceptExplanation: `Weather APIs have MASSIVE traffic spikes during severe weather events.

One App Server handles ~5,000 QPS. During a hurricane? 50,000+ QPS!

**Solution**: Multiple servers behind a Load Balancer

The load balancer:
1. Receives ALL incoming queries
2. Distributes them across N app servers
3. Health checks: removes failed servers
4. Session affinity: not needed (stateless API)

**For weather spikes:**
- Normal: 3 servers (5,000 QPS each = 15K total)
- Hurricane: Auto-scale to 10 servers (50K total)
- After storm: Scale back down to save cost`,
  whyItMatters: 'During severe weather, people\'s safety depends on your API being fast and available. Downtime during a hurricane can be life-threatening.',
  realWorldExample: {
    company: 'Weather.com',
    scenario: 'Hurricane Irma (2017) - 10x normal traffic',
    howTheyDoIt: 'Auto-scaled from 50 to 500 app servers. Handled 100K+ QPS during peak. Load balancers with geographic routing.',
  },
  famousIncident: {
    title: 'Hurricane Sandy API Outage',
    company: 'Multiple Weather Services',
    year: '2012',
    whatHappened: 'Several weather APIs crashed during Hurricane Sandy due to traffic overload. People couldn\'t get evacuation info. Some APIs charged $10,000+ in overage fees to customers.',
    lessonLearned: 'Weather APIs must handle 10-20x traffic spikes. Load balancers and auto-scaling are life-critical, not optional.',
    icon: '🌊',
  },
  keyPoints: [
    'Horizontal scaling: more servers = more capacity',
    'Health checks remove failed servers automatically',
    'Auto-scaling: add servers during spikes, remove after',
    'Geographic load balancing for global users',
  ],
  diagram: `
                              ┌─────────────┐
                        ┌────▶│ App Server 1│
                        │     └─────────────┘
┌────────┐   ┌─────────┐│     ┌─────────────┐
│ Client │──▶│   LB    │┼────▶│ App Server 2│
└────────┘   └─────────┘│     └─────────────┘
                        │     ┌─────────────┐
                        └────▶│ App Server 3│
                              └─────────────┘
`,
  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Automatically add/remove servers based on load', icon: '📈' },
    { title: 'Health Checks', explanation: 'LB monitors server health, removes failures', icon: '💓' },
    { title: 'Stateless', explanation: 'Any server can handle any request', icon: '🔄' },
  ],
  quickCheck: {
    question: 'Why do weather APIs need load balancers more than other APIs?',
    options: [
      'Weather data is complex',
      'Traffic spikes 10x during severe weather events',
      'Load balancers make queries faster',
      'It\'s cheaper than one big server',
    ],
    correctIndex: 1,
    explanation: 'Weather APIs face massive, unpredictable traffic spikes during hurricanes, storms, etc. Load balancers enable rapid scaling.',
  },
};

const step5: GuidedStep = {
  id: 'weatherapi-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle traffic spikes during severe weather',
    taskDescription: 'Build Client → Load Balancer → App Server → Cache + Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents end users', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic across app servers', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes API requests (multiple instances)', displayName: 'App Server' },
      { type: 'cache', reason: 'Fast access to hot data', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Persistent cache', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Cache', reason: 'Server checks cache first' },
      { from: 'App Server', to: 'Database', reason: 'Server falls back to DB' },
    ],
    successCriteria: [
      'Build full architecture with Load Balancer',
      'Client → LB → App Server → Cache + Database',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Load Balancer in front of App Server',
    level2: 'Client → Load Balancer → App Server, then App Server connects to Cache and Database',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Global Reach - Users Around the World
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your API is going global! Users in Tokyo, London, Sydney...",
  hook: "But users in Tokyo are seeing 500ms latency - they're hitting your US-East server from across the Pacific Ocean!",
  challenge: "Add a CDN to serve weather data from edge locations worldwide.",
  illustration: 'global-latency',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your API is now global!",
  achievement: "Edge locations serve weather data with minimal latency",
  metrics: [
    { label: 'Tokyo latency', before: '500ms', after: '50ms' },
    { label: 'London latency', before: '300ms', after: '40ms' },
    { label: 'CDN cache hit rate', after: '95%' },
  ],
  nextTeaser: "Awesome! But what about severe weather alerts? People need instant push notifications...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: Global Distribution of Weather Data',
  conceptExplanation: `Weather data is PERFECT for CDN caching:
- Read-heavy (1000:1 ratio)
- Slow-changing (updates every 10-15 minutes)
- High bandwidth (15KB per forecast)

**How CDN works for weather:**
1. User in Tokyo queries weather
2. CDN edge in Tokyo checks cache
3. Cache HIT → Return immediately (50ms) ✅
4. Cache MISS → Query origin server (500ms), cache at edge
5. Next Tokyo user → Served from edge (50ms)

**What to cache on CDN:**
- Current weather: 10-minute TTL
- Forecasts: 3-hour TTL
- Static location data: 24-hour TTL

**What NOT to cache:**
- Severe weather alerts (real-time, push via websocket)
- User-specific data`,
  whyItMatters: 'Network latency between continents is 200-500ms. CDN edge caching reduces this to 20-50ms, making your API globally competitive.',
  realWorldExample: {
    company: 'OpenWeatherMap',
    scenario: 'Serving 6 billion API calls per day globally',
    howTheyDoIt: 'CloudFront CDN with 200+ edge locations. 95% cache hit rate. Forecast data served from edge.',
  },
  famousIncident: {
    title: 'Weather API CDN Misconfiguration',
    company: 'Dark Sky',
    year: '2019',
    whatHappened: 'CDN was caching weather data for 24 hours instead of 10 minutes. Users saw stale forecasts during a severe weather event. Emergency alerts were delayed.',
    lessonLearned: 'CDN TTL must match data freshness requirements. Too long = stale data. Too short = cache misses.',
    icon: '⚙️',
  },
  keyPoints: [
    'CDN caches weather data at edge locations worldwide',
    'Set TTL based on update frequency (10 min current, 3 hrs forecast)',
    'Reduces latency from 500ms to 50ms for global users',
    'Reduces load on origin servers by 95%',
  ],
  diagram: `
┌──────────────────────────────────────────────────┐
│                   CDN Network                    │
│                                                  │
│  Tokyo Edge    London Edge    NYC Edge          │
│  (50ms)        (40ms)         (20ms)            │
│  Cache: 95% hit rate                            │
└─────────────┬────────────────────────────────────┘
              │ Cache miss (5%)
              ▼
       ┌──────────────┐
       │ Load Balancer│
       │  (US-East)   │
       └──────────────┘
              │
              ▼
       ┌──────────────┐
       │ App Servers  │
       └──────────────┘
`,
  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN servers distributed globally', icon: '🌐' },
    { title: 'Origin Server', explanation: 'Your main servers that CDN falls back to', icon: '🏠' },
    { title: 'TTL', explanation: 'How long CDN caches before refreshing', icon: '⏰' },
  ],
  quickCheck: {
    question: 'Why is CDN especially important for weather APIs?',
    options: [
      'Weather data is too large for databases',
      'Read-heavy + slow-changing data = perfect for edge caching',
      'CDNs generate weather predictions',
      'It\'s required by weather regulations',
    ],
    correctIndex: 1,
    explanation: 'Weather data changes slowly (10-15 min) and is read-heavy (1000:1), making it ideal for CDN edge caching.',
  },
};

const step6: GuidedStep = {
  id: 'weatherapi-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Global users need low-latency access',
    taskDescription: 'Add CDN in front of Load Balancer for global distribution',
    componentsNeeded: [
      { type: 'client', reason: 'Global users', displayName: 'Client' },
      { type: 'cdn', reason: 'Edge caching for global latency reduction', displayName: 'CDN' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
      { type: 'cache', reason: 'Fast cache', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Persistent cache', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Users hit CDN edge first' },
      { from: 'CDN', to: 'Load Balancer', reason: 'CDN falls back to origin on miss' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Cache', reason: 'Server checks cache' },
      { from: 'App Server', to: 'Database', reason: 'Server falls back to DB' },
    ],
    successCriteria: [
      'Add CDN in front of Load Balancer',
      'Full architecture: Client → CDN → LB → App Server → Cache + Database',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add CDN between Client and Load Balancer',
    level2: 'Client → CDN → Load Balancer, then LB → App Server → Cache + Database',
    solutionComponents: [
      { type: 'client' },
      { type: 'cdn' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Real-Time Alerts - Push Notifications
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Tornado warning issued for Kansas City!",
  hook: "But users won't see it until they manually refresh the app. By then it might be too late. We need PUSH notifications for critical alerts!",
  challenge: "Add a Message Queue for real-time alert delivery to users.",
  illustration: 'tornado-alert',
};

const step7Celebration: CelebrationContent = {
  emoji: '🔔',
  message: "Alert system is live!",
  achievement: "Critical weather alerts delivered in under 30 seconds",
  metrics: [
    { label: 'Alert delivery time', before: 'Never (manual refresh)', after: '< 30 seconds' },
    { label: 'Alert reliability', after: '99.9%' },
    { label: 'Lives potentially saved', after: 'Countless' },
  ],
  nextTeaser: "Perfect! But we need to optimize costs and performance...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Real-Time Alert Delivery',
  conceptExplanation: `Weather alerts can't wait for users to refresh. You need PUSH notifications!

**The Problem:**
- NOAA issues tornado warning at 3:15 PM
- Your API polls NOAA every 5 minutes
- Users won't see alert until next poll OR manual refresh
- Could be fatal

**The Solution: Message Queue + Push System**
1. Weather monitoring service polls NOAA every 30 seconds
2. New alert detected → Publish to message queue
3. Alert workers consume queue
4. Workers send push notifications to affected users
5. Total time: < 30 seconds from NOAA to user's phone

**For WeatherAPI, queue:**
- Severe weather alerts (critical priority)
- Weather updates for subscribed locations
- Forecast updates for premium users`,
  whyItMatters: 'During tornadoes, hurricanes, flash floods, every second counts. Real-time alerts can save lives. This isn\'t optional - it\'s life-critical.',
  realWorldExample: {
    company: 'The Weather Channel',
    scenario: 'Delivering tornado warnings via mobile app',
    howTheyDoIt: 'Kafka message queue processes 100K+ alerts per severe weather event. Push notifications via APNs/FCM within 15 seconds.',
  },
  famousIncident: {
    title: 'Hawaii False Missile Alert',
    company: 'Hawaii Emergency Management',
    year: '2018',
    whatHappened: 'Alert system had no retry mechanism. False alert was sent, then correction took 38 minutes to reach all users. Panic ensued.',
    lessonLearned: 'Alert systems need reliable message queues with retry logic. But also need kill-switches for false alerts.',
    icon: '🚨',
  },
  keyPoints: [
    'Message queue decouples alert detection from delivery',
    'Workers process alerts asynchronously',
    'Retry logic ensures delivery even if push service is down',
    'Priority queues: tornado > thunderstorm > advisory',
  ],
  diagram: `
┌─────────────────────────────────────────────────┐
│         ALERT DELIVERY PIPELINE                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐       ┌───────────────┐          │
│  │   NOAA   │ ────▶ │ App Server    │          │
│  │  Alerts  │       │ (polls every  │          │
│  └──────────┘       │  30 seconds)  │          │
│                     └────────┬──────┘          │
│                              │                  │
│                              ▼                  │
│                     ┌────────────────┐          │
│                     │ Message Queue  │          │
│                     │  (Kafka)       │          │
│                     └────────┬───────┘          │
│                              │                  │
│                    ┌─────────┴──────────┐       │
│                    │                    │       │
│                    ▼                    ▼       │
│              ┌──────────┐        ┌──────────┐   │
│              │ Worker 1 │        │ Worker 2 │   │
│              │ (Push)   │        │ (Push)   │   │
│              └──────────┘        └──────────┘   │
│                    │                    │       │
│                    └──────────┬─────────┘       │
│                               │                 │
│                               ▼                 │
│                     ┌──────────────────┐        │
│                     │  User Devices    │        │
│                     │ (APNs, FCM, SMS) │        │
│                     └──────────────────┘        │
│                                                 │
│  Total latency: < 30 seconds                   │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Async Processing', explanation: 'Decouple detection from delivery', icon: '⚡' },
    { title: 'Push Notifications', explanation: 'Server pushes to clients (not poll)', icon: '📱' },
    { title: 'Priority Queue', explanation: 'Critical alerts jump to front', icon: '🚨' },
  ],
  quickCheck: {
    question: 'Why use a message queue for weather alerts?',
    options: [
      'It\'s faster than direct push',
      'Decouples detection from delivery, enables retry and scaling',
      'Message queues are cheaper',
      'It\'s required by NOAA',
    ],
    correctIndex: 1,
    explanation: 'Message queues allow async processing with retry logic, ensuring alerts are delivered even during traffic spikes or failures.',
  },
};

const step7: GuidedStep = {
  id: 'weatherapi-step-7',
  stepNumber: 7,
  frIndex: 4,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'FR-5: Deliver severe weather alerts in real-time',
    taskDescription: 'Add Message Queue for alert delivery pipeline',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue alerts for async delivery', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Message Queue', reason: 'Publish alerts to queue' },
    ],
    successCriteria: [
      'Add Message Queue component',
      'Connect App Server to Message Queue',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },
  hints: {
    level1: 'Add Message Queue component and connect it to App Server',
    level2: 'Drag Message Queue onto canvas, then connect App Server → Message Queue',
    solutionComponents: [
      { type: 'client' },
      { type: 'cdn' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 8: Database Replication - High Availability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💥',
  scenario: "Your database crashed at 2 AM during a major storm!",
  hook: "For 20 minutes, the entire API was down. No weather data, no alerts. Users were furious. Your boss is demanding 99.99% uptime.",
  challenge: "Add database replication so a single failure doesn't take down the system.",
  illustration: 'database-failure',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your system is now highly available!",
  achievement: "Database failures don't take down the API",
  metrics: [
    { label: 'Availability', before: '99.5%', after: '99.99%' },
    { label: 'Downtime', before: '43 hours/year', after: '52 minutes/year' },
    { label: 'Failover time', after: '< 30 seconds' },
  ],
  nextTeaser: "Excellent! Now let's make sure costs are under control...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Surviving Failures',
  conceptExplanation: `Weather data must be ALWAYS available. People's safety depends on it!

**Single Database = Single Point of Failure:**
- Database crashes → Entire API down
- Maintenance → Downtime
- Disk failure → Data loss

**Solution: Database Replication**
- Primary database handles writes
- Replicas sync in real-time
- If primary fails → Promote replica
- Read traffic distributed across replicas

**For WeatherAPI:**
- 1 Primary (handles writes from weather ingestion)
- 2+ Replicas (handle read queries)
- Async replication OK (weather data not financial)
- Replicas in different availability zones`,
  whyItMatters: 'During severe weather, your API MUST stay up. Database replication ensures no single failure takes down the system.',
  realWorldExample: {
    company: 'Weather.com',
    scenario: 'Maintaining 99.99% uptime during Hurricane Season',
    howTheyDoIt: 'PostgreSQL with 3 replicas across different AWS availability zones. Auto-failover in under 30 seconds.',
  },
  famousIncident: {
    title: 'AccuWeather Database Outage',
    company: 'AccuWeather',
    year: '2017',
    whatHappened: 'Primary database crashed during Hurricane Irma. No replicas configured. API was down for 4 hours during a critical weather event. Massive backlash.',
    lessonLearned: 'Weather APIs are life-critical infrastructure. Database replication is mandatory, not optional.',
    icon: '🌀',
  },
  keyPoints: [
    'Primary handles writes (weather data ingestion)',
    'Replicas handle reads (user queries)',
    'Auto-failover promotes replica if primary fails',
    'Async replication OK (weather isn\'t financial)',
  ],
  diagram: `
                         ┌──────────────────┐
                         │  Primary (Write) │
                         │   (Data Ingest)  │
                         └────────┬─────────┘
                                  │ Async Replication
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
       ┌───────────┐       ┌───────────┐       ┌───────────┐
       │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
       │  (Read)   │       │  (Read)   │       │  (Read)   │
       │  (US-E)   │       │ (US-W)    │       │  (EU)     │
       └───────────┘       └───────────┘       └───────────┘
`,
  keyConcepts: [
    { title: 'Primary-Replica', explanation: 'One primary for writes, many replicas for reads', icon: '🔄' },
    { title: 'Failover', explanation: 'Auto-promote replica if primary fails', icon: '🔁' },
    { title: 'Read Scaling', explanation: 'Distribute read load across replicas', icon: '📊' },
  ],
  quickCheck: {
    question: 'Why is database replication critical for weather APIs?',
    options: [
      'It makes queries faster',
      'Ensures API stays up during database failures - life-critical',
      'It\'s cheaper than one big database',
      'Required by weather regulations',
    ],
    correctIndex: 1,
    explanation: 'During severe weather, people depend on weather APIs for safety. Database replication ensures the API stays up even if a database fails.',
  },
};

const step8: GuidedStep = {
  id: 'weatherapi-step-8',
  stepNumber: 8,
  frIndex: 5,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'System must survive database failures (99.99% availability)',
    taskDescription: 'Enable database replication with at least 2 replicas',
    successCriteria: [
      'Click on Database component',
      'Enable replication',
      'Set replica count to 2 or more',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Click Database, go to configuration, enable replication',
    level2: 'Click Database → Enable replication → Set replicas to 2+',
    solutionComponents: [
      { type: 'client' },
      { type: 'cdn' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 9: Configure Auto-Scaling and Optimize
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📊',
  scenario: "Your CFO is reviewing the monthly AWS bill: $75,000!",
  hook: "She says: 'Why are we running 10 app servers at 3 AM when there's almost no traffic? And why do we have so many cache misses?'",
  challenge: "Configure auto-scaling for app servers and optimize cache strategy to reduce costs.",
  illustration: 'high-costs',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "System optimized!",
  achievement: "Right-sized infrastructure with auto-scaling",
  metrics: [
    { label: 'Monthly cost', before: '$75,000', after: '$35,000' },
    { label: 'Cache hit rate', before: '85%', after: '99%' },
    { label: 'Performance', after: 'Maintained ✓' },
  ],
  nextTeaser: "Perfect! You've built a world-class Weather API!",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Right-Sizing & Auto-Scaling',
  conceptExplanation: `Weather APIs have predictable traffic patterns:
- **Morning peak (6-9 AM)**: 3x traffic
- **Evening peak (5-7 PM)**: 2x traffic
- **Night (11 PM - 5 AM)**: 0.3x traffic
- **Severe weather**: 10x traffic (unpredictable)

**Auto-Scaling Strategy:**
- Normal daytime: 3 app servers
- Morning peak: Scale to 6 servers
- Night: Scale down to 1 server
- Severe weather: Scale to 15+ servers
- Save 50%+ on compute costs!

**Cache Optimization:**
- Increase Redis memory for popular cities
- Set optimal TTL (10 min for current, 3 hrs for forecast)
- Pre-warm cache for major cities
- Result: 85% → 99% cache hit rate

**Database Optimization:**
- Use read replicas for query distribution
- Archive historical data > 1 year to S3 (cold storage)
- Index optimization for location queries`,
  whyItMatters: 'Weather APIs at scale can cost $50K-$100K/month. Smart auto-scaling and caching can cut costs in half without sacrificing performance.',
  realWorldExample: {
    company: 'OpenWeatherMap',
    scenario: 'Serving 6B API calls/day at scale',
    howTheyDoIt: 'Aggressive auto-scaling based on traffic patterns + time of day. 99% cache hit rate. Costs optimized to $0.005 per 1000 API calls.',
  },
  keyPoints: [
    'Auto-scale app servers based on traffic patterns',
    'Scale down at night (0.3x traffic)',
    'Optimize cache TTL and memory allocation',
    'Archive old historical data to cold storage',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│      AUTO-SCALING SCHEDULE                    │
├────────────────────────────────────────────────┤
│                                                │
│  Time      Traffic   App Servers   Cost/hr    │
│  ──────────────────────────────────────────    │
│  3 AM      0.3x      1 server      $1         │
│  9 AM      3x        6 servers     $6         │
│  2 PM      1x        3 servers     $3         │
│  6 PM      2x        4 servers     $4         │
│  11 PM     0.5x      2 servers     $2         │
│                                                │
│  Hurricane Event:                             │
│  Spike     10x       15 servers    $15        │
│                                                │
│  Average cost: $3/hour = $2,160/month         │
│  vs. 10 servers 24/7: $7,200/month            │
│  Savings: 70%!                                │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Dynamically adjust server count based on load', icon: '📈' },
    { title: 'Cache Hit Rate', explanation: '% of requests served from cache', icon: '🎯' },
    { title: 'Cold Storage', explanation: 'Archive old data to cheaper storage (S3)', icon: '❄️' },
  ],
  quickCheck: {
    question: 'What\'s the best way to reduce Weather API costs?',
    options: [
      'Remove database replication',
      'Auto-scale app servers and optimize cache hit rate',
      'Reduce data freshness to 1 hour',
      'Remove the CDN',
    ],
    correctIndex: 1,
    explanation: 'Auto-scaling adjusts capacity to match demand, and high cache hit rate reduces expensive computation. Never compromise reliability or data freshness.',
  },
};

const step9: GuidedStep = {
  id: 'weatherapi-step-9',
  stepNumber: 9,
  frIndex: 6,
  story: step9Story,
  celebration: step9Celebration,
  learnPhase: step9LearnPhase,
  practicePhase: {
    frText: 'System must be cost-effective while maintaining performance',
    taskDescription: 'Configure auto-scaling and optimize cache settings',
    successCriteria: [
      'Configure App Server auto-scaling (2-3 instances)',
      'Configure Cache strategy (cache-aside, 10-min TTL)',
      'Verify database replication is enabled',
      'Ensure all components are optimally sized',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Configure App Server instances and Cache strategy',
    level2: 'Click App Server → Set instances to 2-3. Click Cache → Set strategy to cache-aside, TTL to 600 seconds',
    solutionComponents: [
      { type: 'client' },
      { type: 'cdn' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const weatherapiGuidedTutorial: GuidedTutorial = {
  problemId: 'weatherapi-guided',
  problemTitle: 'Build WeatherAPI - A Global Weather Service',

  requirementsPhase: weatherApiRequirementsPhase,

  totalSteps: 9,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],

  finalExamTestCases: [
    {
      name: 'Basic Weather Query',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can query current weather for any location',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 200 },
    },
    {
      name: 'Forecast Queries',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Users can get 7-day forecasts',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 500 },
    },
    {
      name: 'High Traffic Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 5,000 QPS with low latency',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05, maxP99Latency: 200 },
    },
    {
      name: 'Severe Weather Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 10x traffic spike during severe weather',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 90,
      passCriteria: { maxErrorRate: 0.1, maxP99Latency: 300 },
    },
    {
      name: 'Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Survive database primary failure',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 120,
      failureInjection: { type: 'db_crash', atSecond: 60, recoverySecond: 90 },
      passCriteria: { minAvailability: 0.999, maxDowntime: 30, maxErrorRate: 0.1 },
    },
    {
      name: 'Global Latency',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Maintain low latency for global users',
      traffic: { type: 'read', rps: 3000, readRps: 3000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100 },
    },
  ] as TestCase[],
};

export function getWeatherApiGuidedTutorial(): GuidedTutorial {
  return weatherapiGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = weatherApiRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= weatherApiRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
