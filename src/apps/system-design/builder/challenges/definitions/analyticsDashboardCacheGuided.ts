import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Analytics Dashboard Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches advanced caching patterns
 * for analytics dashboards with real-time metrics.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Apply NFRs (pre-computed metrics, time-series cache, roll-up aggregations)
 *
 * Key Concepts:
 * - Pre-computed metrics and materialized views
 * - Time-series data caching strategies
 * - Roll-up aggregations (minute → hour → day)
 * - Cache warming and invalidation
 * - Query result caching
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const analyticsDashboardRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an analytics dashboard system that displays real-time metrics and historical trends",

  interviewer: {
    name: 'Alex Rivera',
    role: 'VP of Engineering at DataMetrics Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-metrics',
      category: 'functional',
      question: "What metrics do users need to see on this dashboard?",
      answer: "Users need to see:\n1. **Real-time metrics** - Current active users, requests/sec, error rates (updated every few seconds)\n2. **Historical trends** - Graphs showing metrics over time (last hour, day, week, month)\n3. **Custom date ranges** - Users can query specific time periods\n4. **Multiple dimensions** - Breakdown by region, device type, API endpoint, etc.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Analytics dashboards have two distinct patterns: real-time (seconds) and historical (hours/days/months)",
    },
    {
      id: 'aggregations',
      category: 'functional',
      question: "What kind of calculations should the dashboard perform?",
      answer: "Users need:\n1. **Counts** - Total requests, total errors\n2. **Rates** - Requests per second, error rate percentage\n3. **Percentiles** - p50, p95, p99 latency\n4. **Averages** - Average response time, average payload size\n5. **Trends** - Week-over-week growth, day-over-day changes",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "These aggregations are expensive - computing p99 over billions of events requires smart pre-computation",
    },
    {
      id: 'drill-down',
      category: 'functional',
      question: "Can users drill down into specific segments?",
      answer: "Yes! Users should be able to:\n1. Click a spike in the graph to see what caused it\n2. Filter by specific dimensions (e.g., 'show me errors from mobile users in US-East')\n3. Compare segments (iOS vs Android performance)",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Drill-down requires efficient multi-dimensional queries",
    },

    // CLARIFICATIONS
    {
      id: 'refresh-rate',
      category: 'clarification',
      question: "How 'real-time' should the dashboard be?",
      answer: "For real-time metrics, updates every 5-10 seconds is acceptable. Users don't need sub-second updates for a dashboard. Historical trends can update every 1-2 minutes.",
      importance: 'critical',
      insight: "5-10 second delay allows for batching and pre-computation - don't need true real-time",
    },
    {
      id: 'alerts',
      category: 'clarification',
      question: "Do we need alerting when metrics cross thresholds?",
      answer: "Not for MVP. Alerts are a separate system. Focus on the visualization and query performance.",
      importance: 'nice-to-have',
      insight: "Alerts use different patterns (event-driven) - defer to v2",
    },
    {
      id: 'export',
      category: 'clarification',
      question: "Can users export data or create custom reports?",
      answer: "Not for MVP. We're focusing on the interactive dashboard experience first.",
      importance: 'nice-to-have',
      insight: "Export adds complexity - different access patterns",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many events are we tracking per second?",
      answer: "About 1 million events per second at peak (web requests, API calls, user actions)",
      importance: 'critical',
      calculation: {
        formula: "1M events/sec × 86,400 sec = 86.4 billion events/day",
        result: "~86 billion events per day to analyze",
      },
      learningPoint: "Can't query raw events in real-time - MUST pre-aggregate",
    },
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many people use the dashboard?",
      answer: "About 500 employees use the dashboard daily - engineers, PMs, execs. Peak usage is 100 concurrent viewers.",
      importance: 'important',
      calculation: {
        formula: "100 concurrent users × 1 query per 10 sec = 10 queries/sec",
        result: "~10 dashboard queries/sec at peak",
      },
      learningPoint: "Dashboard queries are LOW volume but HIGH complexity",
    },
    {
      id: 'data-retention',
      category: 'payload',
      question: "How long should we retain historical data?",
      answer: "High-resolution data (1-minute granularity) for 7 days. Hourly aggregations for 90 days. Daily aggregations for 2 years.",
      importance: 'critical',
      calculation: {
        formula: "7 days × 1440 min × 1MB = ~10GB high-res\n90 days × 24 hours × 100KB = ~216MB hourly\n730 days × 100KB = ~73MB daily",
        result: "~10.3GB total for time-series cache",
      },
      learningPoint: "Roll-up aggregations save massive storage: minute → hour → day",
    },

    // LATENCY
    {
      id: 'latency-dashboard',
      category: 'latency',
      question: "How fast should the dashboard load?",
      answer: "p99 under 500ms for dashboard load. Users expect instant visualization - slow dashboards don't get used.",
      importance: 'critical',
      learningPoint: "500ms means cache hits are MANDATORY - can't query database",
    },
    {
      id: 'latency-drill-down',
      category: 'latency',
      question: "What about drill-down queries?",
      answer: "p99 under 2 seconds is acceptable. Users expect these to be slightly slower since they're custom queries.",
      importance: 'important',
      learningPoint: "Drill-downs might need database queries, but still need optimization",
    },

    // ACCURACY
    {
      id: 'accuracy-requirement',
      category: 'quality',
      question: "Do metrics need to be 100% accurate?",
      answer: "No! For dashboards, approximate is fine. 99% accuracy is acceptable - it's better to be fast and approximate than slow and exact. For billing, we'd need exact numbers, but dashboards are for trends and patterns.",
      importance: 'critical',
      insight: "This is HUGE - approximation allows probabilistic data structures (HyperLogLog, Count-Min Sketch)",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-metrics', 'aggregations', 'throughput-events', 'latency-dashboard'],
  criticalFRQuestionIds: ['core-metrics', 'aggregations'],
  criticalScaleQuestionIds: ['throughput-events', 'data-retention', 'latency-dashboard', 'accuracy-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Display real-time metrics',
      description: 'Show current metrics updated every 5-10 seconds',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Show historical trends',
      description: 'Display graphs over time (hour, day, week, month)',
      emoji: '📈',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support custom date ranges',
      description: 'Users can query specific time periods',
      emoji: '📅',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Compute aggregations',
      description: 'Calculate counts, rates, percentiles, averages',
      emoji: '🧮',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Enable drill-down analysis',
      description: 'Filter and compare by dimensions',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500 dashboard users',
    writesPerDay: '86 billion events',
    readsPerDay: '~100K dashboard queries',
    peakMultiplier: 3,
    readWriteRatio: '1:1M (writes dominate)',
    calculatedWriteRPS: { average: 1000000, peak: 3000000 },
    calculatedReadRPS: { average: 10, peak: 30 },
    maxPayloadSize: '~1KB per event',
    storagePerRecord: '~1KB per event',
    storageGrowthPerYear: '~30 PB raw (1M events/sec × 1KB × 86400 × 365)',
    redirectLatencySLA: 'p99 < 500ms (dashboard load)',
    createLatencySLA: 'p99 < 2s (drill-down)',
  },

  architecturalImplications: [
    '✅ 1M events/sec → Can\'t query raw data, MUST pre-aggregate',
    '✅ p99 < 500ms dashboard → Cache is absolutely critical',
    '✅ 86B events/day → Roll-up aggregations essential (minute → hour → day)',
    '✅ Approximate accuracy OK → Use probabilistic data structures',
    '✅ 7-day retention → Time-based cache expiration',
  ],

  outOfScope: [
    'Real-time alerting',
    'Custom report generation',
    'Data export functionality',
    'Machine learning predictions',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can view metrics from a database. Once it works, we'll add the sophisticated caching layers that make it fast and scalable. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📊',
  scenario: "Welcome to DataMetrics Inc! You've been hired to build an analytics dashboard.",
  hook: "Your first user (the CEO) wants to see how the platform is performing.",
  challenge: "Connect the Client to the App Server to handle dashboard requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your dashboard backend is connected!",
  achievement: "Users can now send requests to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server needs to know what data to serve...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Dashboard Architecture',
  conceptExplanation: `Every analytics dashboard starts with a **Client-Server** architecture.

When a user opens the dashboard:
1. The browser (Client) sends a request to your **App Server**
2. The server processes the request and returns metrics
3. The client renders beautiful charts and graphs

Think of it like a news website - the client requests the latest news, the server fetches and formats it.`,
  whyItMatters: 'Without this connection, users can\'t access any metrics. This is the foundation everything else builds on.',
  keyPoints: [
    'Client = the browser displaying charts and graphs',
    'App Server = backend that processes metric queries',
    'Request/Response pattern for fetching dashboard data',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│ (Dashboard) │ ◀────── │  (Metrics API)  │
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    { title: 'Client', explanation: 'Browser showing the dashboard UI', icon: '🖥️' },
    { title: 'App Server', explanation: 'Backend serving metrics data', icon: '⚙️' },
    { title: 'HTTP API', explanation: 'RESTful endpoints for queries', icon: '🔌' },
  ],
  quickCheck: {
    question: 'What is the role of the App Server in an analytics dashboard?',
    options: [
      'Store all raw events permanently',
      'Process metric queries and return aggregated data',
      'Render charts and visualizations',
      'Collect events from user devices',
    ],
    correctIndex: 1,
    explanation: 'The App Server processes queries from the dashboard and returns pre-computed or aggregated metrics.',
  },
};

const step1: GuidedStep = {
  id: 'analytics-dashboard-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can query metrics from the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents dashboard users', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes metric queries', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users query metrics' },
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
// STEP 2: Add Database for Event Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Your App Server is running, but where's the data?",
  hook: "The CEO asks for metrics, but there's nowhere to store or query events!",
  challenge: "We need a database to store events and serve queries. Add a Database and configure it.",
  illustration: 'add-database',
};

const step2Celebration: CelebrationContent = {
  emoji: '✅',
  message: "Data is now persisted!",
  achievement: "Events are stored and can be queried",
  metrics: [
    { label: 'Events stored', after: '✓' },
    { label: 'Can query data', after: '✓' },
  ],
  nextTeaser: "But querying billions of events is too slow...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Event Storage: Time-Series Database',
  conceptExplanation: `Analytics dashboards need to store **events** - each web request, API call, or user action.

**Event structure:**
\`\`\`json
{
  "timestamp": "2025-12-06T10:30:45Z",
  "metric": "api_request",
  "value": 1,
  "latency_ms": 123,
  "region": "us-east",
  "endpoint": "/api/users"
}
\`\`\`

For analytics, we use a **time-series database** (like TimescaleDB, InfluxDB, or Clickhouse) optimized for:
1. Fast writes of time-stamped events
2. Time-range queries (last hour, last day)
3. Aggregations (COUNT, AVG, percentiles)`,

  whyItMatters: 'Without a database, we can\'t store events or answer queries. But as we\'ll see, querying raw events won\'t scale - we\'ll need caching!',

  realWorldExample: {
    company: 'Datadog',
    scenario: 'Processing 1 trillion metrics per day',
    howTheyDoIt: 'Uses custom time-series database with aggressive pre-aggregation and roll-ups',
  },

  keyPoints: [
    'Time-series DB optimized for timestamp-indexed data',
    'Events are append-only (write-heavy workload)',
    'Aggregation queries can be expensive on raw data',
    'We\'ll need caching to make queries fast!',
  ],

  diagram: `
┌──────────┐    ┌────────────┐    ┌────────────┐
│  Client  │───▶│ App Server │───▶│  Database  │
│          │◀───│            │◀───│ (Events)   │
└──────────┘    └────────────┘    └────────────┘
                                   86B events/day
`,

  keyConcepts: [
    { title: 'Time-Series DB', explanation: 'Database optimized for time-stamped events', icon: '⏰' },
    { title: 'Events', explanation: 'Individual data points with timestamps', icon: '📝' },
    { title: 'Aggregations', explanation: 'SUM, COUNT, AVG, percentiles over time ranges', icon: '🧮' },
  ],

  quickCheck: {
    question: 'Why can\'t we just query the raw events every time the dashboard loads?',
    options: [
      'Events are too small to query efficiently',
      'Aggregating 86 billion events in real-time would be too slow',
      'Time-series databases don\'t support queries',
      'Users don\'t need accurate data',
    ],
    correctIndex: 1,
    explanation: 'With 86 billion events per day, computing aggregations in real-time would take too long. We need pre-computation and caching!',
  },
};

const step2: GuidedStep = {
  id: 'analytics-dashboard-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Store events and serve basic queries',
    taskDescription: 'Add a Database and connect it to the App Server',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Already added in Step 1', displayName: 'App Server' },
      { type: 'database', reason: 'Store events for queries', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
      { from: 'App Server', to: 'Database', reason: 'Query stored events' },
    ],
    successCriteria: ['Add Database', 'Connect App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database component and connect App Server to Database',
    level2: 'Drag Database from sidebar, then connect App Server → Database for event queries',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 3: The Crisis - Dashboard is Too Slow!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "The CEO complains: 'The dashboard takes 30 seconds to load! This is unusable!'",
  hook: "Your App Server is querying 86 billion events every time. Aggregating that much data in real-time is killing performance!",
  challenge: "We need caching! Add a Cache layer to store pre-computed query results.",
  illustration: 'performance-crisis',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Dashboard latency dropped dramatically!",
  achievement: "Query results are now cached and served in milliseconds",
  metrics: [
    { label: 'Latency', before: '30s', after: '100ms' },
    { label: 'Database load', before: '100%', after: '5%' },
  ],
  nextTeaser: "But we're still computing metrics on-demand. What if we pre-compute them?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Query Result Caching',
  conceptExplanation: `The problem: Every dashboard load queries the database, even if nothing changed!

**Solution: Cache query results**

When a user requests "show me API requests for the last hour":
1. First check the cache for this exact query
2. If found (cache hit), return immediately - **100ms**
3. If not found (cache miss), query database, cache result, return - **5s**

Since dashboards show the same queries repeatedly (last hour, last day), cache hit rates are very high (>95%).

**What to cache:**
- Query results for common time ranges (last hour, last day)
- Aggregations (total requests, average latency, p99)
- TTL of 1-2 minutes (metrics don't need to be real-time)`,

  whyItMatters: 'Without caching, every dashboard view hammers the database with expensive aggregation queries. Caching reduces load by 95% and makes dashboards instant.',

  realWorldExample: {
    company: 'Grafana',
    scenario: 'Serving millions of dashboard views per day',
    howTheyDoIt: 'Aggressively caches query results with 1-minute TTLs, reducing database load by 98%',
  },

  famousIncident: {
    title: 'GitHub Status Dashboard Outage',
    company: 'GitHub',
    year: '2020',
    whatHappened: 'Their status dashboard queried the primary database directly. During an incident, engineers flooded the dashboard to check status, overwhelming the database with expensive queries and making the outage worse!',
    lessonLearned: 'NEVER let dashboards query production databases directly. Always use caching and read replicas.',
    icon: '💥',
  },

  keyPoints: [
    'Cache query results, not raw events',
    'TTL of 1-2 minutes for dashboard queries',
    'Use query string as cache key (time range + filters)',
    'Cache hit rate >95% for common queries',
    'Protects database from query storms',
  ],

  diagram: `
            ┌─────────┐
            │  Cache  │ ← Query results cached here
            └─────────┘
                 ↕
┌──────┐   ┌─────────┐   ┌──────────┐
│Client│──▶│App Server│──▶│ Database │
└──────┘   └─────────┘   └──────────┘

Cache HIT:  100ms ⚡
Cache MISS: 5s (then cached)
`,

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Query result found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Query database, cache result for next time', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - how long to cache results', icon: '⏱️' },
  ],

  interviewTip: 'Always mention cache invalidation strategy! How do you ensure users don\'t see stale data? For dashboards, 1-2 minute staleness is acceptable.',

  quickCheck: {
    question: 'What should the cache key be for query result caching?',
    options: [
      'Just the metric name (e.g., "api_requests")',
      'The query string including time range and filters',
      'The user ID who requested the query',
      'A random UUID for each query',
    ],
    correctIndex: 1,
    explanation: 'The cache key must include all query parameters (time range, filters, aggregation type) so identical queries hit the cache.',
  },
};

const step3: GuidedStep = {
  id: 'analytics-dashboard-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Cache query results to speed up dashboard loads',
    taskDescription: 'Add a Cache between App Server and Database',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Already added in Step 1', displayName: 'App Server' },
      { type: 'cache', reason: 'Store query results', displayName: 'Cache' },
      { type: 'database', reason: 'Already added in Step 2', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache first' },
      { from: 'Cache', to: 'Database', reason: 'Fallback to DB on cache miss' },
    ],
    successCriteria: ['Add Cache', 'Connect App Server → Cache → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'cache', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Insert a Cache between App Server and Database',
    level2: 'Add Cache, then connect: App Server → Cache → Database (check cache first, then database)',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'cache', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Pre-computed Metrics - The Game Changer
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🎯',
  scenario: "Caching helped, but cache misses still take 5+ seconds!",
  hook: "Why are we computing the same metrics over and over? The 'last hour' metric barely changes!",
  challenge: "Instead of caching query results, let's PRE-COMPUTE metrics continuously! Add an Aggregation Worker.",
  illustration: 'pre-computation',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Metrics are now pre-computed!",
  achievement: "Dashboard loads are instant - no database queries needed!",
  metrics: [
    { label: 'Cache miss latency', before: '5s', after: '50ms' },
    { label: 'Database queries', before: '1000/min', after: '10/min' },
    { label: 'Metrics freshness', after: '10 seconds' },
  ],
  nextTeaser: "But we're storing every minute's data forever. Storage is exploding!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Pre-computed Metrics & Materialized Views',
  conceptExplanation: `**The Problem with Query Caching:**
Even with caching, the FIRST query (cache miss) is slow because we're aggregating billions of events.

**The Solution: Pre-compute metrics continuously!**

Instead of computing "API requests in the last hour" when users ask:
1. Run a **background worker** that computes metrics every 1 minute
2. Store pre-computed results: "At 10:30, there were 50K requests in the last hour"
3. When users load dashboard, just read the latest pre-computed value - **instant!**

**What to pre-compute:**
- **1-minute aggregations**: Total requests, avg latency, error count
- **Common time windows**: Last hour, last day (rolling windows)
- **Dimensions**: By region, by endpoint, by device type

This is called a **materialized view** - the query result is materialized (stored) in advance.`,

  whyItMatters: 'Pre-computation eliminates the expensive aggregation step. Instead of aggregating 86 billion events on-demand, we aggregate 1 minute of events (60K events) every minute in the background.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Dashboard showing transaction metrics',
    howTheyDoIt: 'Pre-computes metrics every minute using Apache Flink. Dashboard queries just read pre-computed values from Redis. Sub-50ms latency for any query.',
  },

  keyPoints: [
    'Background worker computes metrics every 1 minute',
    'Store results in cache (Redis) with timestamps',
    'Dashboard reads pre-computed values - no aggregation!',
    'Trade-off: 1-minute staleness for instant queries',
    'Dramatically reduces database load',
  ],

  diagram: `
Events ──▶ [Aggregation Worker] ──▶ Cache
             (Every 1 minute)        (Pre-computed)
                                          │
                                          ▼
              Client ──▶ App Server ──▶ Cache
                         (Read only)    (Instant!)

Example pre-computed keys in cache:
- "metrics:api_requests:2025-12-06T10:30" → 50000
- "metrics:avg_latency:2025-12-06T10:30" → 123ms
- "metrics:p99_latency:2025-12-06T10:30" → 456ms
`,

  keyConcepts: [
    { title: 'Materialized View', explanation: 'Pre-computed query result stored for instant access', icon: '💎' },
    { title: 'Aggregation Worker', explanation: 'Background job that computes metrics continuously', icon: '⚙️' },
    { title: 'Write-Through', explanation: 'Compute and write to cache, no on-demand computation', icon: '✍️' },
  ],

  commonMistakes: [
    {
      mistake: 'Pre-computing every possible query combination',
      why: 'Combinatorial explosion - too much to store',
      correct: 'Pre-compute high-level metrics, compute drill-downs on-demand with caching',
    },
  ],

  interviewTip: 'Explain the trade-off: Pre-computation uses more compute/storage but makes queries instant. Perfect for dashboards where 1-minute staleness is acceptable.',

  quickCheck: {
    question: 'What is the main advantage of pre-computed metrics over query result caching?',
    options: [
      'Pre-computed metrics use less memory',
      'No cache misses - metrics are always ready before users ask',
      'Pre-computed metrics are more accurate',
      'Cache invalidation is easier',
    ],
    correctIndex: 1,
    explanation: 'With pre-computation, metrics are computed in the background BEFORE users request them. There are no expensive cache misses!',
  },
};

const step4: GuidedStep = {
  id: 'analytics-dashboard-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Pre-compute metrics continuously for instant dashboard loads',
    taskDescription: 'Add an Aggregation Worker that reads from Database and writes to Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Already added', displayName: 'App Server' },
      { type: 'cache', reason: 'Already added - stores pre-computed metrics', displayName: 'Cache' },
      { type: 'background_worker', reason: 'Computes metrics every minute', displayName: 'Aggregation Worker' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Dashboard requests' },
      { from: 'App Server', to: 'Cache', reason: 'Read pre-computed metrics' },
      { from: 'Aggregation Worker', to: 'Database', reason: 'Read raw events' },
      { from: 'Aggregation Worker', to: 'Cache', reason: 'Write pre-computed metrics' },
    ],
    successCriteria: [
      'Add Background Worker for aggregation',
      'Connect Worker → Database (read events)',
      'Connect Worker → Cache (write metrics)',
      'App Server reads from Cache only',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'background_worker', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'background_worker', toType: 'database' },
      { fromType: 'background_worker', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Background Worker that reads from Database and writes to Cache',
    level2: 'The worker continuously aggregates recent events and stores results in Cache. App Server only reads from Cache.',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'background_worker' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'background_worker', to: 'database' },
      { from: 'background_worker', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Time-Series Roll-up Aggregations
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📦',
  scenario: "Your cache storage costs are skyrocketing!",
  hook: "You're storing 1-minute granularity data forever. That's 1440 data points per day, per metric!",
  challenge: "We need ROLL-UP AGGREGATIONS: keep 1-minute data for recent history, hourly for medium-term, daily for long-term.",
  illustration: 'data-compression',
};

const step5Celebration: CelebrationContent = {
  emoji: '💰',
  message: "Storage costs dropped 95%!",
  achievement: "Smart data retention strategy implemented",
  metrics: [
    { label: 'Storage for 90 days', before: '500GB', after: '10GB' },
    { label: 'Data points stored', before: '130K per metric', after: '~3K per metric' },
    { label: 'Query speed', after: 'Still instant!' },
  ],
  nextTeaser: "What about queries that span multiple time granularities?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Roll-up Aggregations: Minute → Hour → Day',
  conceptExplanation: `**The Storage Problem:**
If we keep 1-minute granularity forever:
- 1440 minutes/day × 90 days = 129,600 data points per metric
- With 1000 metrics tracked = 130 million data points!

**The Solution: Roll-up Aggregations**

Store data at different granularities based on age:
1. **1-minute granularity** for last 7 days (recent, high-res)
2. **1-hour granularity** for 8-90 days (medium-term)
3. **1-day granularity** for 91 days-2 years (long-term trends)

**How it works:**
- Aggregation Worker computes 1-minute metrics continuously
- Hourly job rolls up 60 minutes → 1 hour aggregate
- Daily job rolls up 24 hours → 1 day aggregate
- Old high-res data is deleted after roll-up

**Example:**
- "API requests at 10:30" (1-min): 850 requests
- "API requests 10:00-11:00" (1-hour): 50,000 requests (sum of 60 minutes)
- "API requests Dec 6" (1-day): 1.2M requests (sum of 24 hours)`,

  whyItMatters: 'Roll-ups reduce storage by 90-95% while preserving the ability to show trends at different time scales. Recent data is detailed, old data is summarized.',

  realWorldExample: {
    company: 'Prometheus',
    scenario: 'Popular metrics monitoring system',
    howTheyDoIt: 'Uses automatic downsampling: 15s → 5m → 1h → 1d. Keeps high-res for 15 days, then rolls up. Standard practice in observability.',
  },

  famousIncident: {
    title: 'Uber Metrics Storage Crisis',
    company: 'Uber',
    year: '2018',
    whatHappened: 'Uber\'s metrics system stored full-resolution time-series data indefinitely. Storage costs reached millions per month and queries slowed to a crawl as data grew.',
    lessonLearned: 'Implemented M3DB with automatic roll-ups. Storage costs dropped 80% while maintaining query performance.',
    icon: '💸',
  },

  keyPoints: [
    'Different retention policies for different granularities',
    'Roll-up = aggregate and delete source data',
    'Preserves ability to zoom in (recent) and out (historical)',
    '95% storage reduction with minimal information loss',
    'Queries automatically use appropriate granularity',
  ],

  diagram: `
Time-Series Data Lifecycle:
┌──────────────────────────────────────────────────┐
│ 1-minute data    →  7 days   →  Then rolled up  │
│ 1-hour data      →  90 days  →  Then rolled up  │
│ 1-day data       →  2 years  →  Then archived   │
└──────────────────────────────────────────────────┘

Example query: "Show last 30 days"
- Days 0-7:  Use 1-minute data (high-res)
- Days 8-30: Use 1-hour data (rolled up)

Storage savings:
- 7 days × 1440 min = 10,080 data points
- 83 days × 24 hours = 1,992 data points
- Total: ~12K points vs 130K without roll-ups (90% savings!)
`,

  keyConcepts: [
    { title: 'Roll-up', explanation: 'Aggregate fine-grained data into coarser buckets', icon: '📊' },
    { title: 'Downsampling', explanation: 'Reduce resolution of old data', icon: '🔽' },
    { title: 'Retention Policy', explanation: 'How long to keep each granularity', icon: '📅' },
  ],

  commonMistakes: [
    {
      mistake: 'Rolling up too aggressively (e.g., hour → day immediately)',
      why: 'Loses ability to show recent trends at hour granularity',
      correct: 'Keep 1-hour data for 90 days before rolling to daily',
    },
  ],

  interviewTip: 'Mention that roll-ups can compute additional aggregations (min, max, p95) during the roll-up process. This is the time to add statistical richness.',

  quickCheck: {
    question: 'Why do we keep 1-minute data for only 7 days instead of forever?',
    options: [
      'Minute-level data becomes inaccurate after 7 days',
      'Users rarely need minute-level detail for data older than a week',
      '7 days is the maximum retention for any time-series database',
      'Hourly data is more accurate than minute data',
    ],
    correctIndex: 1,
    explanation: 'For week-old data, hourly granularity is sufficient for dashboards. Keeping minute-level detail forever wastes storage without adding value.',
  },
};

const step5: GuidedStep = {
  id: 'analytics-dashboard-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Implement roll-up aggregations to optimize storage and query performance',
    taskDescription: 'Configure the Aggregation Worker to perform roll-ups (no new components needed)',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Already added', displayName: 'App Server' },
      { type: 'cache', reason: 'Stores all granularities', displayName: 'Cache' },
      { type: 'background_worker', reason: 'Now does roll-ups too!', displayName: 'Aggregation Worker' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected' },
      { from: 'App Server', to: 'Cache', reason: 'Already connected' },
      { from: 'Aggregation Worker', to: 'Database', reason: 'Already connected' },
      { from: 'Aggregation Worker', to: 'Cache', reason: 'Already connected' },
    ],
    successCriteria: [
      'Existing architecture supports roll-ups',
      'Worker computes minute → hour → day aggregations',
      'Cache stores all granularities with TTLs',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'background_worker', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'background_worker', toType: 'database' },
      { fromType: 'background_worker', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'No new components needed - the Aggregation Worker now handles roll-ups',
    level2: 'The existing worker computes 1-min metrics, then hourly/daily jobs roll them up. Cache stores all granularities.',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'background_worker' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'background_worker', to: 'database' },
      { from: 'background_worker', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 6: Cache Warming for Predictable Performance
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌅',
  scenario: "Every morning at 9 AM, executives open the dashboard. The first load is slow!",
  hook: "Cache entries expired overnight. Everyone experiences cache misses at the same time!",
  challenge: "We need CACHE WARMING - pre-populate the cache with commonly requested queries before users arrive.",
  illustration: 'cache-warming',
};

const step6Celebration: CelebrationContent = {
  emoji: '☀️',
  message: "Cold starts eliminated!",
  achievement: "Dashboard is always fast, even first thing in the morning",
  metrics: [
    { label: '9 AM load time', before: '5s', after: '100ms' },
    { label: 'Cache hit rate', before: '60%', after: '98%' },
    { label: 'User satisfaction', after: '📈' },
  ],
  nextTeaser: "But what happens when traffic spikes 10x?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Warming & Predictive Pre-computation',
  conceptExplanation: `**The Cold Cache Problem:**
When cache entries expire (TTL elapsed) or cache restarts:
- First user experiences cache miss (slow query)
- Cache gradually fills as users make requests
- Morning rush hits empty cache = bad experience

**Solution: Cache Warming**

Proactively populate cache with frequently accessed data BEFORE users ask:

1. **Scheduled warming**: Run at 8:45 AM (before 9 AM rush)
2. **Pattern-based warming**: Pre-compute queries users typically run
3. **Critical queries**: Always keep "last hour" and "last day" warm

**What to warm:**
- Dashboard home page queries
- Last hour/day/week for all key metrics
- Frequently accessed drill-down combinations
- Executive summary reports`,

  whyItMatters: 'Cache warming eliminates cold start latency and ensures predictable performance. Users always get fast responses, even during cache maintenance or restarts.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product recommendation caching',
    howTheyDoIt: 'Warms cache with ML-predicted user queries before peak traffic. Achieves 99.9% cache hit rate during Prime Day.',
  },

  keyPoints: [
    'Warm cache before peak usage times',
    'Pre-compute queries based on usage patterns',
    'Keep critical queries always warm (no expiry)',
    'Stagger warming to avoid query storms',
    'Monitor cache hit rates to identify warming gaps',
  ],

  diagram: `
Cache Warming Strategy:
┌────────────────────────────────────────────────┐
│ 8:45 AM - Start warming critical queries      │
│ 8:50 AM - Warm executive dashboard            │
│ 8:55 AM - Warm team-specific views            │
│ 9:00 AM - Users arrive → Everything cached!   │
└────────────────────────────────────────────────┘

Warming Job:
1. Get list of critical queries (last_hour, last_day, etc.)
2. For each query:
   - Compute result
   - Store in cache with extended TTL
3. Monitor: cache_warming_duration_seconds
`,

  keyConcepts: [
    { title: 'Cache Warming', explanation: 'Proactively populate cache before requests', icon: '🔥' },
    { title: 'Predictive Loading', explanation: 'Pre-compute based on usage patterns', icon: '🔮' },
    { title: 'Extended TTL', explanation: 'Keep critical queries cached longer', icon: '⏰' },
  ],

  commonMistakes: [
    {
      mistake: 'Warming ALL possible queries',
      why: 'Wastes resources warming rarely-used queries',
      correct: 'Warm top 20% of queries that represent 80% of traffic (Pareto principle)',
    },
  ],

  interviewTip: 'Mention cache stampede protection: when cache expires, only ONE request should recompute while others wait. Prevents thundering herd.',

  quickCheck: {
    question: 'When should cache warming jobs run?',
    options: [
      'During peak traffic to ensure fresh data',
      'Randomly throughout the day',
      'Just before peak usage times (e.g., 15 minutes before 9 AM rush)',
      'Only when cache is completely empty',
    ],
    correctIndex: 2,
    explanation: 'Warm the cache shortly before peak usage so entries are fresh and ready when users arrive.',
  },
};

const step6: GuidedStep = {
  id: 'analytics-dashboard-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Ensure predictable performance with cache warming',
    taskDescription: 'Configure the system to support cache warming (architecture already supports it)',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Already added', displayName: 'App Server' },
      { type: 'cache', reason: 'Already added', displayName: 'Cache' },
      { type: 'background_worker', reason: 'Also runs warming jobs', displayName: 'Aggregation Worker' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected' },
      { from: 'App Server', to: 'Cache', reason: 'Already connected' },
      { from: 'Aggregation Worker', to: 'Database', reason: 'Already connected' },
      { from: 'Aggregation Worker', to: 'Cache', reason: 'Already connected' },
    ],
    successCriteria: [
      'Existing architecture supports cache warming',
      'Worker runs warming jobs before peak hours',
      'Critical queries kept warm with extended TTL',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'background_worker', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'background_worker', toType: 'database' },
      { fromType: 'background_worker', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'No new components needed - the Aggregation Worker now runs warming jobs too',
    level2: 'The worker pre-computes critical queries before peak hours and stores them in Cache with extended TTL',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'background_worker' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'background_worker', to: 'database' },
      { from: 'background_worker', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: Horizontal Scaling - Load Balancer
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Success! Your dashboard is so good that 10x more people want to use it!",
  hook: "A single App Server can't handle 100 queries/sec. Requests are timing out!",
  challenge: "We need to scale horizontally: Add multiple App Servers behind a Load Balancer.",
  illustration: 'scale-out',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: "System scales horizontally!",
  achievement: "Can now handle 10x traffic by adding more servers",
  metrics: [
    { label: 'App Servers', before: '1', after: '5+' },
    { label: 'Throughput', before: '10 qps', after: '100+ qps' },
    { label: 'P99 latency', after: '< 500ms' },
  ],
  nextTeaser: "Your cache is getting overwhelmed too. Need to scale that as well!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling with Load Balancer',
  conceptExplanation: `**The Single Server Bottleneck:**
One App Server has limits:
- CPU: Can process ~10-20 queries/sec before saturating
- Memory: Limited capacity for concurrent connections
- Single point of failure

**Solution: Horizontal Scaling**

Add multiple identical App Servers behind a Load Balancer:
1. Load Balancer receives all client requests
2. Distributes requests across App Servers (round-robin, least-conn)
3. If one server dies, others continue serving
4. Can add/remove servers dynamically

**For analytics dashboards:**
- App Servers are stateless (cache stores all data)
- Easy to scale: just add more servers
- Load balancer does health checks
- Auto-scaling based on CPU/query rate`,

  whyItMatters: 'Horizontal scaling is how you handle 10x, 100x growth. Vertical scaling (bigger server) has limits. Horizontal scaling is nearly limitless.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 200M users globally',
    howTheyDoIt: 'Thousands of stateless app servers behind load balancers. Auto-scales up during peak hours (evenings) and down during off-peak.',
  },

  keyPoints: [
    'App servers must be stateless for horizontal scaling',
    'Load balancer distributes traffic evenly',
    'Health checks remove unhealthy servers automatically',
    'Can auto-scale based on metrics (CPU, query rate)',
    'N servers = N× throughput (linear scaling)',
  ],

  diagram: `
                  ┌──────────────┐
                  │Load Balancer │
                  └──────┬───────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │App Server│   │App Server│   │App Server│
    │    1     │   │    2     │   │    3     │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         └──────────────┼──────────────┘
                        ▼
                   ┌────────┐
                   │ Cache  │
                   └────────┘

All servers share the same Cache (stateless)
`,

  keyConcepts: [
    { title: 'Stateless', explanation: 'Servers don\'t store data - can add/remove anytime', icon: '🔄' },
    { title: 'Load Balancing', explanation: 'Distribute requests evenly across servers', icon: '⚖️' },
    { title: 'Health Checks', explanation: 'Remove unhealthy servers from rotation', icon: '❤️' },
  ],

  interviewTip: 'Mention sticky sessions are NOT needed for dashboards (unlike for shopping carts). Any server can handle any request since all state is in cache.',

  quickCheck: {
    question: 'Why must App Servers be stateless for horizontal scaling to work?',
    options: [
      'Stateless servers are faster than stateful servers',
      'If servers store state, you can\'t freely add/remove them without losing data',
      'Load balancers only work with stateless servers',
      'Stateless servers use less memory',
    ],
    correctIndex: 1,
    explanation: 'Stateless servers store no local data, so any server can handle any request. This allows free scaling up/down without data loss.',
  },
};

const step7: GuidedStep = {
  id: 'analytics-dashboard-step-7',
  stepNumber: 7,
  frIndex: 4,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Scale App Server tier horizontally with Load Balancer',
    taskDescription: 'Add a Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distribute traffic across servers', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Already added', displayName: 'App Server' },
      { type: 'cache', reason: 'Already added', displayName: 'Cache' },
      { type: 'background_worker', reason: 'Already added', displayName: 'Aggregation Worker' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Route through load balancer' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Distribute requests' },
      { from: 'App Server', to: 'Cache', reason: 'Already connected' },
      { from: 'Aggregation Worker', to: 'Database', reason: 'Already connected' },
      { from: 'Aggregation Worker', to: 'Cache', reason: 'Already connected' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Connect Client → Load Balancer → App Server',
      'App Server remains stateless',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'background_worker', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'background_worker', toType: 'database' },
      { fromType: 'background_worker', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Insert a Load Balancer between Client and App Server',
    level2: 'Add Load Balancer, then reconnect: Client → Load Balancer → App Server',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'background_worker' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'background_worker', to: 'database' },
      { from: 'background_worker', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Cache Replication for High Availability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! Your single Redis cache crashed. All pre-computed metrics are GONE!",
  hook: "The dashboard is down! Queries are hitting the database directly and it's overloaded!",
  challenge: "We need cache replication! Add a Read Replica cache for high availability.",
  illustration: 'high-availability',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "System is now highly available!",
  achievement: "Cache failures don't bring down the dashboard anymore",
  metrics: [
    { label: 'Uptime', before: '99%', after: '99.99%' },
    { label: 'Cache availability', after: 'Redundant' },
    { label: 'Failover time', after: '< 1 second' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade analytics dashboard caching system!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Replication & High Availability',
  conceptExplanation: `**The Single Point of Failure:**
If your cache crashes:
- All pre-computed metrics are lost
- Dashboard queries hit the database directly
- Database overload → entire system down
- Must rebuild all metrics from scratch

**Solution: Cache Replication**

Redis supports primary-replica replication:
1. **Primary cache**: Receives all writes from Aggregation Worker
2. **Read replicas**: Automatically sync from primary
3. **App Servers**: Read from replicas (distributes load)
4. **Failover**: If primary dies, promote a replica

**Benefits:**
- High availability: Replica takes over if primary fails
- Read scaling: Multiple replicas handle more read traffic
- Data durability: Replicas have copies of all data
- Fast failover: Sub-second with Redis Sentinel`,

  whyItMatters: 'For a business-critical dashboard, cache downtime is unacceptable. Replication provides both availability and read scalability.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Timeline cache serving billions of reads/day',
    howTheyDoIt: 'Runs Redis with 5 read replicas per primary. App servers read from nearest replica. Automatic failover with Sentinel. 99.99% availability.',
  },

  famousIncident: {
    title: 'GitHub MySQL Failover Incident',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'Network partition caused database replication to break. System failed over to stale replica, causing data inconsistencies and 24-hour outage.',
    lessonLearned: 'Replication failover is complex. Need automated checks for replication lag and consistency before promoting replicas.',
    icon: '⚠️',
  },

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'Replication is asynchronous (slight lag acceptable)',
    'Redis Sentinel for automatic failover',
    'App servers connect to replica pool',
    'Replicas provide both HA and read scalability',
  ],

  diagram: `
┌─────────────────┐
│Aggregation Worker│
└────────┬────────┘
         ▼
   ┌──────────┐
   │  Cache   │ (Primary - writes)
   │ Primary  │
   └────┬─────┘
        │ replication
        ├─────────────┬─────────────┐
        ▼             ▼             ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ Cache  │    │ Cache  │    │ Cache  │
   │Replica1│    │Replica2│    │Replica3│
   └───┬────┘    └───┬────┘    └───┬────┘
       └─────────────┼─────────────┘
                     ▼
              ┌─────────────┐
              │ App Servers │ (read from replicas)
              └─────────────┘

Reads: Distributed across 3 replicas (3× capacity)
Writes: All go to primary, then replicate
`,

  keyConcepts: [
    { title: 'Replication', explanation: 'Automatic data sync from primary to replicas', icon: '🔄' },
    { title: 'Failover', explanation: 'Promote replica to primary if primary fails', icon: '🔀' },
    { title: 'Read Scaling', explanation: 'Multiple replicas = more read capacity', icon: '📈' },
  ],

  commonMistakes: [
    {
      mistake: 'Reading from primary instead of replicas',
      why: 'Defeats the purpose of replication - primary still handles all load',
      correct: 'App servers should read from replica pool, only aggregation worker writes to primary',
    },
  ],

  interviewTip: 'Mention replication lag: replicas might be 10-100ms behind primary. For dashboards, this is acceptable. For financial transactions, it\'s not!',

  quickCheck: {
    question: 'Why do App Servers read from replicas instead of the primary cache?',
    options: [
      'Replicas have more up-to-date data than the primary',
      'Reading from replicas distributes load and scales read capacity',
      'Replicas are faster than the primary cache',
      'Primary cache is only for storing data, not reading',
    ],
    correctIndex: 1,
    explanation: 'Reading from replicas distributes the read load across multiple servers, scaling read capacity while protecting the primary.',
  },
};

const step8: GuidedStep = {
  id: 'analytics-dashboard-step-8',
  stepNumber: 8,
  frIndex: 4,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Add cache replication for high availability and read scaling',
    taskDescription: 'Add Read Replica caches and configure replication',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Already added', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Already added', displayName: 'App Server' },
      { type: 'cache', reason: 'Primary cache', displayName: 'Cache (Primary)' },
      { type: 'cache_replica', reason: 'Read replicas for HA', displayName: 'Cache Replica' },
      { type: 'background_worker', reason: 'Already added', displayName: 'Aggregation Worker' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Already connected' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Already connected' },
      { from: 'App Server', to: 'Cache Replica', reason: 'Read from replicas' },
      { from: 'Cache (Primary)', to: 'Cache Replica', reason: 'Replication' },
      { from: 'Aggregation Worker', to: 'Cache (Primary)', reason: 'Write to primary' },
      { from: 'Aggregation Worker', to: 'Database', reason: 'Already connected' },
    ],
    successCriteria: [
      'Add Cache Replica',
      'Connect Primary → Replica (replication)',
      'App Server reads from Replica',
      'Aggregation Worker writes to Primary',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'cache_replica', 'background_worker', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache_replica' },
      { fromType: 'cache', toType: 'cache_replica' },
      { fromType: 'background_worker', toType: 'cache' },
      { fromType: 'background_worker', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Cache Replica, connect Primary → Replica, and point App Server to Replica',
    level2: 'Aggregation Worker writes to Primary Cache, which replicates to Cache Replica. App Server reads from Replica.',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'cache_replica' },
      { type: 'background_worker' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache_replica' },
      { from: 'cache', to: 'cache_replica' },
      { from: 'background_worker', to: 'cache' },
      { from: 'background_worker', to: 'database' },
    ],
  },
};

// =============================================================================
// TUTORIAL ASSEMBLY
// =============================================================================

export const analyticsDashboardCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'analytics-dashboard-cache-guided',
  problemTitle: 'Analytics Dashboard Cache - Advanced Caching Patterns',
  description: 'Learn advanced caching patterns for real-time analytics dashboards',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  requirementsPhase: analyticsDashboardRequirementsPhase,

  totalSteps: 8,
  steps: [
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    step8,
  ],

  // Meta information
  concepts: [
    'Pre-computed Metrics & Materialized Views',
    'Time-Series Data Caching',
    'Roll-up Aggregations (minute → hour → day)',
    'Cache Warming & Predictive Pre-computation',
    'Query Result Caching',
    'Horizontal Scaling',
    'Cache Replication & High Availability',
    'Stateless App Servers',
    'Background Workers for Aggregation',
  ],

  ddiaReferences: [
    'Chapter 3: Storage & Retrieval (Time-Series Data)',
    'Chapter 5: Replication (Cache Replication)',
    'Chapter 8: Distributed System Troubles',
  ],

  prerequisites: [
    'Basic understanding of caching concepts',
    'Familiarity with databases and queries',
    'Understanding of read vs write patterns',
  ],
};
