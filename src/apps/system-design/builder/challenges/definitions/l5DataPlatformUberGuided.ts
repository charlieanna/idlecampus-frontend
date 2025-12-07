import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Uber Data Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching how to build a data platform for real-time
 * analytics, geospatial data processing, streaming ETL, and data lake architecture.
 *
 * Key Concepts:
 * - Real-time analytics for ride matching and pricing
 * - Geospatial indexing and queries
 * - Streaming ETL pipelines
 * - Data lake architecture (batch + streaming)
 * - Time-series data processing
 * - OLAP vs OLTP workloads
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic data collection (in-memory → database → streaming)
 * Steps 4-8: Apply NFRs (real-time analytics, geospatial, data lake, OLAP)
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const uberDataPlatformRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a data platform for Uber's real-time analytics and business intelligence",

  interviewer: {
    name: 'Maya Patel',
    role: 'Head of Data Engineering at Uber',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // FUNCTIONAL REQUIREMENTS
    // =============================================================================

    {
      id: 'core-data-needs',
      category: 'functional',
      question: "What kinds of data does Uber need to collect and analyze?",
      answer: "Uber needs to collect and analyze several data streams:\n\n1. **Ride events**: Trip requests, driver assignments, ride status changes, completions\n2. **Location data**: Driver GPS updates (every 4 seconds), rider pickup/dropoff locations\n3. **Pricing data**: Surge pricing calculations, fare breakdowns, payment transactions\n4. **Driver/rider behavior**: App interactions, ratings, cancellations\n5. **Business metrics**: Revenue, demand patterns, driver earnings\n\nAll of this data feeds into real-time dashboards, ML models, and business analytics.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Data platforms must handle both transactional events and analytical queries",
    },
    {
      id: 'real-time-analytics',
      category: 'functional',
      question: "What real-time analytics does Uber need?",
      answer: "Uber's operations depend on real-time analytics:\n\n1. **Surge pricing**: Calculate demand/supply ratio per region every 30 seconds\n2. **Driver positioning**: Show available drivers on rider's map in real-time\n3. **ETA calculations**: Predict arrival times based on current traffic\n4. **Fraud detection**: Flag suspicious patterns immediately\n5. **Operational dashboards**: Live metrics for ops teams (active rides, wait times)\n\nThese queries run continuously on streaming data - can't wait hours for batch processing.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Real-time analytics requires stream processing, not just batch jobs",
    },
    {
      id: 'geospatial-queries',
      category: 'functional',
      question: "How does Uber handle location-based queries?",
      answer: "Geospatial queries are critical for Uber:\n\n1. **Find nearby drivers**: Given rider location, find all drivers within 2km\n2. **Geofencing**: Determine which pricing zone a location falls into\n3. **Heatmaps**: Visualize ride demand density by region\n4. **Route optimization**: Calculate efficient driver routes\n\nStandard databases are terrible at geospatial queries. Need specialized indexes (like geohashing or R-trees).",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Geospatial data requires specialized indexing - regular B-tree indexes don't work well",
    },
    {
      id: 'historical-analysis',
      category: 'functional',
      question: "What kind of historical analysis does Uber need?",
      answer: "Uber's business intelligence team needs to analyze historical trends:\n\n1. **Weekly/monthly reports**: Revenue, rides per city, driver earnings\n2. **ML training data**: Years of ride history to train prediction models\n3. **A/B test analysis**: Evaluate new features over weeks/months\n4. **Regulatory compliance**: Provide trip records to city governments\n\nThis is classic data warehouse / OLAP workload - complex queries over huge datasets.",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Need both OLTP (transactional) and OLAP (analytical) data stores",
    },
    {
      id: 'data-freshness',
      category: 'latency',
      question: "How fresh does the data need to be for analytics?",
      answer: "Different use cases have different freshness requirements:\n\n1. **Real-time (< 1 second)**: Surge pricing, driver positioning, fraud detection\n2. **Near real-time (< 1 minute)**: Operational dashboards, live metrics\n3. **Batch (hourly/daily)**: Business reports, ML training data, compliance\n\nMost critical is the real-time stream for operational decisions.",
      importance: 'critical',
      calculation: {
        formula: "Real-time: < 1s | Near real-time: < 60s | Batch: hours",
        result: "Need stream processing for real-time, batch for historical",
      },
      learningPoint: "Lambda architecture: both stream processing (real-time) and batch processing (historical)",
    },
    {
      id: 'data-volume',
      category: 'throughput',
      question: "How much data are we talking about?",
      answer: "Uber generates massive amounts of data:\n\n1. **Location updates**: 2 million drivers × 15 updates/min = 30M updates/min\n2. **Ride events**: 20 million rides/day = 14K rides/sec at peak\n3. **Total event stream**: ~50K events/second sustained, 150K/sec at peak\n4. **Storage growth**: ~5 TB of new data per day\n\nThis is big data territory - need distributed systems.",
      importance: 'critical',
      calculation: {
        formula: "2M drivers × 15 GPS/min = 30M location updates/min = 500K/sec",
        result: "~50K events/sec average, 150K/sec peak",
      },
      learningPoint: "At this scale, single-node databases won't cut it",
    },
    {
      id: 'query-patterns',
      category: 'throughput',
      question: "What are the main query patterns?",
      answer: "Two very different workloads:\n\n**OLTP (Operational)**: \n- Write-heavy: Ingesting events at 50K/sec\n- Simple queries: Insert ride event, update driver status\n- Low latency: < 10ms\n\n**OLAP (Analytical)**:\n- Read-heavy: Complex aggregations over millions of rows\n- Scan-heavy: 'What was average ride time by city last month?'\n- Higher latency OK: 1-10 seconds\n\nClassic OLTP vs OLAP split.",
      importance: 'critical',
      learningPoint: "OLTP and OLAP workloads need different data stores",
    },
    {
      id: 'data-transformations',
      category: 'functional',
      question: "Does the raw data need to be transformed before analysis?",
      answer: "Yes! Raw event streams are messy:\n\n1. **Enrichment**: Join ride events with driver/rider profiles\n2. **Aggregation**: Calculate hourly metrics from per-second events\n3. **Cleaning**: Handle duplicates, missing fields, outliers\n4. **Denormalization**: Pre-join tables for fast analytical queries\n\nThis is ETL (Extract, Transform, Load) - but we need both streaming ETL and batch ETL.",
      importance: 'important',
      revealsRequirement: 'FR-7',
      learningPoint: "ETL pipelines transform raw data into analysis-ready datasets",
    },
    {
      id: 'data-retention',
      category: 'payload',
      question: "How long does data need to be retained?",
      answer: "Different retention policies:\n\n1. **Hot data (< 7 days)**: Real-time queries, kept in fast storage\n2. **Warm data (7-90 days)**: Recent analytics, moved to cheaper storage\n3. **Cold data (> 90 days)**: Compliance and ML training, archived to data lake\n4. **Regulatory**: Some cities require 5+ years of trip records\n\nNeed tiered storage strategy.",
      importance: 'important',
      insight: "Data lake stores cold data cheaply, OLAP stores hot data for fast queries",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "How important is data consistency for analytics?",
      answer: "Analytics can tolerate some inconsistency:\n\n1. **Eventual consistency is OK**: If a dashboard shows 9,873 rides instead of 9,875, not a disaster\n2. **Idempotency matters**: Must handle duplicate events (network retries)\n3. **Exactly-once semantics preferred**: But at-least-once is acceptable with deduplication\n\nThis is very different from transactional consistency in OLTP systems.",
      importance: 'important',
      learningPoint: "Analytics workloads can trade strong consistency for availability and performance",
    },
    {
      id: 'ml-integration',
      category: 'scope',
      question: "Does the data platform need to support machine learning?",
      answer: "Yes, ML is core to Uber:\n\n1. **Feature store**: Serve ML features in real-time (driver rating, historical cancellations)\n2. **Training pipelines**: Export historical data for model training\n3. **A/B testing**: Track metrics for experimental ML models\n\nFor MVP, we'll focus on data collection and analytics. Full ML integration is v2.",
      importance: 'nice-to-have',
      insight: "Feature stores bridge OLTP and ML - serve fresh data with low latency",
    },
    {
      id: 'multi-region',
      category: 'scope',
      question: "Is this for a single region or global deployment?",
      answer: "Uber operates globally, but let's start with single-region architecture. Multi-region adds complexity:\n\n- Cross-region replication latency\n- Data sovereignty (EU data stays in EU)\n- Geo-partitioning strategies\n\nFor now, design for one region (e.g., US). We can extend to multi-region in v2.",
      importance: 'nice-to-have',
      insight: "Start single-region, then replicate the architecture per region",
    },
  ],

  minimumQuestionsRequired: 4,
  criticalQuestionIds: ['core-data-needs', 'real-time-analytics', 'geospatial-queries', 'data-volume', 'query-patterns'],
  criticalFRQuestionIds: ['core-data-needs', 'real-time-analytics', 'geospatial-queries', 'historical-analysis'],
  criticalScaleQuestionIds: ['data-volume', 'query-patterns', 'data-freshness'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Collect event streams',
      description: 'Ingest ride events, location updates, and business metrics in real-time',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Store time-series data',
      description: 'Persist event streams for historical analysis and compliance',
      emoji: '💾',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support geospatial queries',
      description: 'Find nearby drivers, geofencing, heatmaps with low latency',
      emoji: '🗺️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Real-time analytics',
      description: 'Power surge pricing, dashboards, and fraud detection with < 1s latency',
      emoji: '⚡',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Historical analytics (OLAP)',
      description: 'Complex queries over months/years of data for BI and ML',
      emoji: '📈',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Data transformations (ETL)',
      description: 'Clean, enrich, and aggregate raw events into analysis-ready datasets',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '2 million active drivers',
    writesPerDay: '50K events/sec average (150K peak)',
    readsPerDay: 'Varies - real-time queries + batch analytics',
    peakMultiplier: 3,
    readWriteRatio: 'Write-heavy for ingestion, read-heavy for analytics',
    calculatedWriteRPS: { average: 50000, peak: 150000 },
    calculatedReadRPS: { average: 10000, peak: 50000 },
    maxPayloadSize: '~1 KB per event',
    storagePerRecord: '~1 KB average',
    storageGrowthPerYear: '~2 PB per year (5 TB/day)',
    redirectLatencySLA: '< 1s for real-time analytics',
    createLatencySLA: '< 10ms for event ingestion',
  },

  architecturalImplications: [
    '✅ 50K events/sec → Need distributed stream processing (Kafka + Flink)',
    '✅ Geospatial queries → Need spatial indexes (PostGIS or Elasticsearch)',
    '✅ OLTP + OLAP → Lambda architecture: streaming + batch',
    '✅ 2 PB/year storage → Data lake (S3) + OLAP warehouse (Redshift/ClickHouse)',
    '✅ Real-time < 1s → Stream processing framework required',
    '✅ Location updates → Time-series optimized storage',
  ],

  outOfScope: [
    'Multi-region deployment (v2)',
    'Full ML feature store (v2)',
    'Real-time model serving (v2)',
    'Data governance and lineage (v2)',
    'Schema evolution and migrations (v2)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple data pipeline that collects events and stores them. Then we'll add real-time analytics, geospatial indexing, and the full Lambda architecture. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Application to Data Pipeline
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to Uber's Data Engineering team! You've been tasked with building the data platform.",
  hook: "Right now, all ride events are trapped in the application servers - there's no way to analyze them!",
  challenge: "Set up the foundation: connect the Uber app to a data collection system.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your data pipeline is connected!',
  achievement: 'Events can now flow from the app to your data platform',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive events', after: '✓' },
  ],
  nextTeaser: "But where are these events going?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building a Data Platform: The Foundation',
  conceptExplanation: `A **data platform** collects events from application servers and makes them available for analytics.

When a ride is completed in Uber:
1. The app server processes the transaction (OLTP)
2. It emits events to the data platform
3. Data engineers can analyze these events

The data platform is separate from the operational database - this separation is critical!`,

  whyItMatters: `Separating OLTP (transactions) from OLAP (analytics) prevents:
- Analytics queries slowing down the production app
- Schema conflicts between operational and analytical needs
- Different scaling strategies for each workload`,

  realWorldExample: {
    company: 'Uber',
    scenario: 'Collecting ride events for analytics',
    howTheyDoIt: 'App servers emit events to Kafka. Data engineers consume from Kafka for analytics. Zero impact on rider/driver experience.',
  },

  keyPoints: [
    'App servers handle transactions (OLTP)',
    'Data platform handles analytics (OLAP)',
    'Separate systems prevent analytics from slowing down the app',
    'Events flow from app to data platform asynchronously',
  ],

  interviewTip: 'Always separate OLTP and OLAP workloads - they have opposite performance characteristics.',
};

const step1: GuidedStep = {
  id: 'uber-data-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Collect event streams',
    taskDescription: 'Connect the Uber App Server to the data pipeline',
    componentsNeeded: [
      { type: 'app_server', reason: 'The operational Uber app that generates events', displayName: 'Uber App Server' },
      { type: 'message_queue', reason: 'Kafka for event streaming', displayName: 'Kafka' },
    ],
    successCriteria: [
      'App Server component added',
      'Message Queue (Kafka) component added',
      'App Server connected to Kafka',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue'],
    requiredConnections: [{ fromType: 'app_server', toType: 'message_queue' }],
  },

  hints: {
    level1: 'Add an App Server and a Message Queue, then connect them',
    level2: 'The App Server emits events to Kafka (Message Queue). This decouples event production from consumption.',
    solutionComponents: [{ type: 'app_server' }, { type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 2: Store Events in Database
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Events are flowing into Kafka, but they're only buffered for 7 days!",
  hook: "Kafka is not permanent storage. You need to persist events for long-term analysis.",
  challenge: "Add a database to store events permanently.",
  illustration: 'data-loss',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Events are now persisted!',
  achievement: 'Historical data is safe for long-term analysis',
  metrics: [
    { label: 'Data retention', before: '7 days', after: 'Permanent' },
    { label: 'Storage', after: 'PostgreSQL' },
  ],
  nextTeaser: "But simple writes aren't fast enough for 50K events/sec...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Event Storage: Time-Series Databases',
  conceptExplanation: `Events are **time-series data** - each event has a timestamp and is immutable.

For Uber's ride events, we need to store:
- Ride started at 2024-01-15 14:32:01
- Driver location at 2024-01-15 14:32:04
- Ride completed at 2024-01-15 14:45:22

Time-series data has unique characteristics:
- **Append-only**: Never update old events
- **Time-ordered**: Usually queried by time range
- **High write throughput**: 50K events/sec

Regular databases can work, but time-series databases (like TimescaleDB or InfluxDB) are optimized for this workload.`,

  whyItMatters: 'At 50K writes/sec, database choice matters. Time-series optimizations can give 10x better performance.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Storing billions of location updates',
    howTheyDoIt: 'Uses a combination of PostgreSQL (with partitioning), Cassandra, and Hadoop for different workloads.',
  },

  keyPoints: [
    'Time-series data is append-only and time-ordered',
    'Events from Kafka need to be consumed and written to persistent storage',
    'For now, PostgreSQL works - we can optimize later',
    'Partitioning by time (daily/monthly) improves query performance',
  ],

  famousIncident: {
    title: 'Lost Analytics Data',
    company: 'Various Startups',
    year: '2015-2020',
    whatHappened: 'Many startups relied on Kafka as their only data store. When Kafka retention expired (7 days default), they lost historical data permanently. No backups!',
    lessonLearned: 'Kafka is a message queue, not a database. Always persist to long-term storage.',
    icon: '💥',
  },

  interviewTip: 'Clarify retention requirements early. Kafka buffers data temporarily - you need a database for long-term storage.',
};

const step2: GuidedStep = {
  id: 'uber-data-step-2',
  stepNumber: 2,
  frIndex: 1,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Store time-series data',
    taskDescription: 'Add a Database to persist events from Kafka',
    componentsNeeded: [
      { type: 'database', reason: 'PostgreSQL for permanent event storage', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'Message Queue connected to Database (stream consumer writes events)',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Database component and connect it to the Message Queue',
    level2: 'A stream consumer reads from Kafka and writes to PostgreSQL. This persists events permanently.',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'message_queue', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Stream Processing for Real-Time Analytics
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚡',
  scenario: "The pricing team needs surge pricing calculations updated every 30 seconds!",
  hook: "Querying the database every 30 seconds for all active rides is too slow. You need real-time stream processing.",
  challenge: "Add a stream processing engine to calculate real-time metrics.",
  illustration: 'real-time-processing',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Real-time analytics are live!',
  achievement: 'Stream processing calculates surge pricing in under 1 second',
  metrics: [
    { label: 'Analytics latency', before: '30s', after: '< 1s' },
    { label: 'Surge pricing updates', after: 'Real-time' },
  ],
  nextTeaser: "But finding nearby drivers is still slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing: Real-Time Analytics',
  conceptExplanation: `**Stream processing** computes analytics on data in motion, before it's stored.

Traditional batch processing:
1. Write events to database
2. Run queries every 30 seconds
3. Scan millions of rows for aggregations

Stream processing (Flink/Spark Streaming):
1. Consume events from Kafka
2. Compute aggregations in memory (sliding windows)
3. Emit results immediately

For surge pricing:
- Count ride requests per region in last 5 minutes
- Count available drivers per region
- Calculate demand/supply ratio
- Update pricing in < 1 second

This is the "speed layer" in Lambda Architecture.`,

  whyItMatters: 'Real-time decisions (surge pricing, fraud detection) can\'t wait for batch jobs. Stream processing enables sub-second latency.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Surge pricing calculations',
    howTheyDoIt: 'Uses Apache Flink for stream processing. Processes millions of events/sec, calculates per-region metrics in real-time.',
  },

  famousIncident: {
    title: 'Uber Surge Pricing During Emergencies',
    company: 'Uber',
    year: '2014-2017',
    whatHappened: 'During emergencies (Sydney hostage crisis, NYC bombing), surge pricing kicked in automatically via real-time analytics. Public backlash led Uber to add manual override capabilities.',
    lessonLearned: 'Real-time systems need circuit breakers and manual overrides for exceptional situations.',
    icon: '🚨',
  },

  keyPoints: [
    'Stream processing computes on data in motion (before storage)',
    'Enables sub-second analytics for operational decisions',
    'Uses windowing (5-minute windows, 1-hour windows) for aggregations',
    'Flink and Spark Streaming are popular frameworks',
  ],

  diagram: `
┌──────────┐     ┌───────┐     ┌────────────────┐     ┌─────────┐
│ App      │ ──▶ │ Kafka │ ──▶ │ Stream         │ ──▶ │ Cache   │
│ Server   │     └───────┘     │ Processor      │     │ (Redis) │
└──────────┘          │         │ (Flink)        │     └─────────┘
                      │         └────────────────┘          │
                      │                                     │
                      │         ┌──────────┐               │
                      └───────▶ │ Database │               │
                                └──────────┘               │
                                                           │
                     Dashboard queries ◀───────────────────┘
                     real-time metrics (surge pricing)
`,

  quickCheck: {
    question: 'Why use stream processing instead of querying the database every second?',
    options: [
      'Databases are expensive',
      'Stream processing is newer technology',
      'Querying millions of rows every second would crush the database',
      'Stream processing is easier to implement',
    ],
    correctIndex: 2,
    explanation: 'Scanning millions of rows every second for aggregations would overload the database. Stream processing computes incrementally in memory.',
  },

  keyConcepts: [
    { title: 'Stream Processing', explanation: 'Compute on data in motion', icon: '⚡' },
    { title: 'Windowing', explanation: 'Aggregate over time windows (5 min, 1 hour)', icon: '🪟' },
    { title: 'Lambda Architecture', explanation: 'Speed layer (streaming) + Batch layer', icon: '🏗️' },
  ],
};

const step3: GuidedStep = {
  id: 'uber-data-step-3',
  stepNumber: 3,
  frIndex: 3,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-4: Real-time analytics',
    taskDescription: 'Add a Stream Processor (Flink) to compute real-time metrics from Kafka',
    componentsNeeded: [
      { type: 'stream_processor', reason: 'Apache Flink for real-time analytics', displayName: 'Flink' },
      { type: 'cache', reason: 'Redis to store computed real-time metrics', displayName: 'Redis' },
    ],
    successCriteria: [
      'Stream Processor added',
      'Cache added',
      'Stream Processor reads from Kafka',
      'Stream Processor writes results to Cache',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue', 'database', 'stream_processor', 'cache'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'stream_processor', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Stream Processor and a Cache. Connect Kafka → Stream Processor → Cache.',
    level2: 'Flink consumes events from Kafka, computes real-time aggregations (surge pricing), and writes results to Redis.',
    solutionComponents: [{ type: 'stream_processor' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'message_queue', to: 'stream_processor' },
      { from: 'stream_processor', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Geospatial Database for Location Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🗺️',
  scenario: "Finding nearby drivers takes 5 seconds! The query scans every driver in the database.",
  hook: "Standard B-tree indexes don't work for geospatial queries. You need spatial indexes.",
  challenge: "Add a specialized geospatial database for location queries.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Geospatial queries are 100x faster!',
  achievement: 'Finding nearby drivers now takes < 50ms',
  metrics: [
    { label: 'Nearby driver query', before: '5000ms', after: '< 50ms' },
    { label: 'Index type', after: 'Geospatial (R-tree)' },
  ],
  nextTeaser: "But we're only storing recent data...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Geospatial Indexing: Finding Nearby Drivers',
  conceptExplanation: `**Geospatial queries** find objects within a geographic area.

The problem:
- "Find all drivers within 2km of (37.7749, -122.4194)"
- With regular database: Scan every driver, calculate distance, filter
- With 1M drivers: This takes seconds!

Specialized geospatial databases (PostGIS, Elasticsearch) use:
- **Geohashing**: Encode lat/lng into a hash (nearby points have similar hashes)
- **R-trees**: Spatial index structure for 2D/3D data
- **QuadTrees**: Recursively partition geographic space

Query time: O(log N + K) instead of O(N), where K = results

For Uber:
- Driver location updates go to geospatial DB
- "Find nearby drivers" query returns in < 50ms
- Critical for rider experience (show drivers on map)`,

  whyItMatters: 'Without spatial indexes, location queries are unusably slow at scale. This is the difference between 5 seconds and 50ms.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Finding nearby drivers for 20M riders',
    howTheyDoIt: 'Uses a combination of geospatial indexes (likely PostGIS or custom solution) with in-memory caching for active drivers.',
  },

  famousIncident: {
    title: 'Uber\'s Geospatial Database Challenges',
    company: 'Uber',
    year: '2015',
    whatHappened: 'Uber\'s original geospatial solution struggled during peak times. They had to build custom indexing with aggressive caching and eventually moved to a sharded architecture by city.',
    lessonLearned: 'Geospatial queries at scale require specialized databases and careful partitioning strategies.',
    icon: '📍',
  },

  keyPoints: [
    'Regular indexes (B-tree) don\'t work well for geospatial data',
    'Geohashing and R-trees enable fast proximity searches',
    'PostGIS (PostgreSQL extension) or Elasticsearch are good choices',
    'Driver location updates must be indexed in real-time',
  ],

  diagram: `
Regular Query (slow):
SELECT * FROM drivers
WHERE distance(location, '37.7749,-122.4194') < 2000
→ Scans ALL drivers: O(N)

Geospatial Index (fast):
SELECT * FROM drivers
WHERE ST_DWithin(location, ST_Point(-122.4194, 37.7749), 2000)
→ Uses R-tree index: O(log N + K)

For 1M drivers, 100 nearby:
- Regular: 1,000,000 distance calculations
- Spatial index: ~20 index lookups + 100 results
`,

  quickCheck: {
    question: 'Why are B-tree indexes inefficient for geospatial queries?',
    options: [
      'B-trees only work with numbers',
      'B-trees organize data in 1D, but location is 2D',
      'B-trees are too slow',
      'B-trees require too much memory',
    ],
    correctIndex: 1,
    explanation: 'B-trees organize data linearly (1D). Location data has 2 dimensions (lat, lng). Spatial indexes like R-trees handle multi-dimensional data efficiently.',
  },

  keyConcepts: [
    { title: 'Geohashing', explanation: 'Encode lat/lng as string hash', icon: '#️⃣' },
    { title: 'R-tree Index', explanation: 'Spatial index for 2D/3D data', icon: '🌳' },
    { title: 'PostGIS', explanation: 'PostgreSQL extension for geospatial', icon: '🗺️' },
  ],
};

const step4: GuidedStep = {
  id: 'uber-data-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Support geospatial queries',
    taskDescription: 'Add a specialized geospatial database for location queries',
    componentsNeeded: [
      { type: 'search_index', reason: 'Elasticsearch with geospatial capabilities', displayName: 'Elasticsearch (Geo)' },
    ],
    successCriteria: [
      'Search Index (Elasticsearch) added for geospatial queries',
      'Stream Processor writes driver locations to Elasticsearch',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue', 'database', 'stream_processor', 'cache', 'search_index'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'stream_processor', toType: 'cache' },
      { fromType: 'stream_processor', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Add a Search Index (Elasticsearch) and connect it to the Stream Processor',
    level2: 'The Stream Processor writes driver locations to Elasticsearch, which has geospatial indexing for fast proximity queries.',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'stream_processor', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 5: Add Data Lake for Historical Storage
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📦',
  scenario: "Your PostgreSQL database is growing by 5 TB per day! Storage costs are exploding.",
  hook: "Storing years of historical data in PostgreSQL is expensive. You need cheaper storage for cold data.",
  challenge: "Add a data lake (S3) for long-term archival storage.",
  illustration: 'storage-full',
};

const step5Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Storage costs reduced by 90%!',
  achievement: 'Data lake stores cold data at fraction of database cost',
  metrics: [
    { label: 'Storage cost', before: '$$$', after: '$' },
    { label: 'Retention', after: 'Unlimited' },
    { label: 'Cold data location', after: 'S3 Data Lake' },
  ],
  nextTeaser: "But how do analysts query data in S3?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Data Lake: Cheap Storage for Historical Data',
  conceptExplanation: `A **data lake** is centralized storage for raw data at massive scale.

Storage tiers:
1. **Hot data (< 7 days)**: PostgreSQL, fast queries, expensive ($$$)
2. **Warm data (7-90 days)**: Compressed in DB or cheap DB tier ($$)
3. **Cold data (> 90 days)**: S3 data lake, cheap storage ($)

For Uber:
- Recent rides: PostgreSQL for fast queries
- Old rides: S3 for compliance and ML training
- ETL jobs export daily batches to S3

Data lake benefits:
- Store petabytes cheaply (S3 is 10-100x cheaper than database)
- Keep raw data forever (schema-on-read vs schema-on-write)
- Enable big data analytics (Spark, Presto query S3 directly)`,

  whyItMatters: 'At 5 TB/day growth, storing everything in PostgreSQL would cost millions. S3 data lake is ~$100/month for same data.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Storing petabytes of historical ride data',
    howTheyDoIt: 'Uses Hadoop/HDFS as data lake, with Hive/Presto for querying. Recent data in MySQL/PostgreSQL, old data archived to Hadoop.',
  },

  famousIncident: {
    title: 'Uber\'s Data Lake Migration',
    company: 'Uber',
    year: '2016',
    whatHappened: 'Uber migrated from scattered data stores to a unified data lake (Hadoop). The migration took 18 months and involved petabytes of data, but resulted in massive cost savings and better analytics.',
    lessonLearned: 'Invest in data lake architecture early - migrating later is painful.',
    icon: '📦',
  },

  keyPoints: [
    'Data lake stores raw data cheaply (S3, HDFS)',
    'Hot data stays in database, cold data moves to lake',
    'ETL jobs export daily batches from database to S3',
    'Data lake is schema-on-read (flexible), database is schema-on-write (rigid)',
  ],

  diagram: `
┌──────────────────────────────────────────────────┐
│                  Data Flow                        │
└──────────────────────────────────────────────────┘

Kafka → PostgreSQL → S3 Data Lake
         (Hot data)    (Cold data)
         < 7 days      > 90 days

Daily ETL job moves old data from PostgreSQL to S3:
- Day 0-7: Live in PostgreSQL (fast queries)
- Day 90+: Moved to S3 (cheap storage)
- Presto/Spark can query S3 for historical analysis
`,

  quickCheck: {
    question: 'Why move old data from PostgreSQL to S3?',
    options: [
      'PostgreSQL can\'t store that much data',
      'S3 is 10-100x cheaper for large-scale storage',
      'S3 is faster for queries',
      'PostgreSQL has a storage limit',
    ],
    correctIndex: 1,
    explanation: 'PostgreSQL CAN store petabytes, but it\'s expensive. S3 provides cheap storage for cold data that\'s rarely queried.',
  },

  keyConcepts: [
    { title: 'Data Lake', explanation: 'Centralized storage for raw data at scale', icon: '📦' },
    { title: 'Hot/Warm/Cold', explanation: 'Tiered storage based on access patterns', icon: '🌡️' },
    { title: 'Schema-on-read', explanation: 'Apply schema when reading, not writing', icon: '📖' },
  ],
};

const step5: GuidedStep = {
  id: 'uber-data-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Store time-series data (now with data lake for cold storage)',
    taskDescription: 'Add Object Storage (S3) as a data lake for historical data',
    componentsNeeded: [
      { type: 'object_storage', reason: 'S3 data lake for cheap long-term storage', displayName: 'S3 Data Lake' },
    ],
    successCriteria: [
      'Object Storage (S3) added',
      'Database connected to Object Storage (ETL export)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue', 'database', 'stream_processor', 'cache', 'search_index', 'object_storage'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'stream_processor', toType: 'cache' },
      { fromType: 'stream_processor', toType: 'search_index' },
      { fromType: 'database', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Object Storage (S3) and connect the Database to it',
    level2: 'Daily ETL jobs export old data from PostgreSQL to S3. This keeps the database small and reduces costs.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'database', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 6: Add OLAP Warehouse for Complex Analytics
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "The BI team's reports are timing out! Complex aggregations over millions of rows take minutes.",
  hook: "PostgreSQL is OLTP-optimized (fast writes). OLAP queries (complex aggregations) crush it.",
  challenge: "Add a data warehouse optimized for analytical queries.",
  illustration: 'slow-analytics',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Analytics are 50x faster!',
  achievement: 'OLAP warehouse handles complex queries in seconds',
  metrics: [
    { label: 'Monthly report query', before: '5 minutes', after: '6 seconds' },
    { label: 'BI dashboard refresh', before: '30s', after: '2s' },
  ],
  nextTeaser: "But ETL jobs are getting complex...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'OLAP Warehouse: Optimized for Analytics',
  conceptExplanation: `**OLAP** (Online Analytical Processing) databases are optimized for read-heavy analytical queries.

OLTP vs OLAP:

**OLTP (PostgreSQL)**:
- Optimized for: Fast writes, point reads
- Query pattern: "Get ride #12345"
- Index: Row-oriented storage
- Use case: Operational transactions

**OLAP (Redshift, ClickHouse)**:
- Optimized for: Aggregations, scans over millions of rows
- Query pattern: "Average ride time by city, last 6 months"
- Storage: Column-oriented (only read needed columns)
- Use case: Business intelligence, reports

For Uber's BI team:
- "Total revenue by city, by week, last year"
- OLTP: Scan billions of rows, takes minutes
- OLAP: Columnar storage + pre-aggregations, takes seconds

This is the "batch layer" in Lambda Architecture.`,

  whyItMatters: 'Complex analytical queries can crush OLTP databases. OLAP warehouses handle these queries 10-100x faster.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'BI reports and data science',
    howTheyDoIt: 'Uses Presto/Hive as query engine over Hadoop data lake. Also uses Vertica (columnar DB) for fast OLAP queries.',
  },

  famousIncident: {
    title: 'Amazon\'s Data Warehouse Journey',
    company: 'Amazon',
    year: '2012',
    whatHappened: 'Amazon built Redshift because their BI queries were overwhelming operational databases. Redshift (columnar OLAP) was 10-100x faster than PostgreSQL for analytics.',
    lessonLearned: 'Separate OLTP and OLAP workloads into different databases optimized for each.',
    icon: '📈',
  },

  keyPoints: [
    'OLAP databases are column-oriented for fast aggregations',
    'ETL jobs copy data from OLTP to OLAP (nightly/hourly)',
    'BI tools query OLAP warehouse, not production database',
    'Examples: Redshift, ClickHouse, Snowflake, BigQuery',
  ],

  diagram: `
Row-oriented (OLTP):           Column-oriented (OLAP):
┌─────┬──────┬──────┐         ┌──────────────┐
│ ID  │ City │ Fare │         │ ID: 1,2,3... │
├─────┼──────┼──────┤         ├──────────────┤
│ 1   │ SF   │ 15   │         │ City: SF,SF,NY│
│ 2   │ SF   │ 20   │         ├──────────────┤
│ 3   │ NY   │ 12   │         │ Fare: 15,20,12│
└─────┴──────┴──────┘         └──────────────┘

Query: "SELECT AVG(Fare) FROM rides WHERE City='SF'"
- Row-oriented: Read all columns, filter rows
- Column-oriented: Read only Fare and City columns

Result: 10x faster for analytics!
`,

  quickCheck: {
    question: 'Why are columnar databases faster for analytics?',
    options: [
      'They use better hardware',
      'They only read the columns needed for the query',
      'They have more memory',
      'They use compression',
    ],
    correctIndex: 1,
    explanation: 'Columnar storage stores each column separately. For "SELECT AVG(price)", only the price column is read. Row-oriented storage reads ALL columns.',
  },

  keyConcepts: [
    { title: 'OLAP', explanation: 'Optimized for analytical queries', icon: '📊' },
    { title: 'Columnar Storage', explanation: 'Store columns separately for fast scans', icon: '📋' },
    { title: 'Lambda Architecture', explanation: 'Batch layer (OLAP) + Speed layer (Stream)', icon: '🏗️' },
  ],
};

const step6: GuidedStep = {
  id: 'uber-data-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Historical analytics (OLAP)',
    taskDescription: 'Add a Data Warehouse (OLAP) for complex analytical queries',
    componentsNeeded: [
      { type: 'data_warehouse', reason: 'Redshift/ClickHouse for OLAP queries', displayName: 'Data Warehouse (OLAP)' },
    ],
    successCriteria: [
      'Data Warehouse added',
      'Object Storage (S3) connected to Data Warehouse',
      'Stream Processor connected to Data Warehouse (real-time ETL)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue', 'database', 'stream_processor', 'cache', 'search_index', 'object_storage', 'data_warehouse'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'stream_processor', toType: 'cache' },
      { fromType: 'stream_processor', toType: 'search_index' },
      { fromType: 'database', toType: 'object_storage' },
      { fromType: 'object_storage', toType: 'data_warehouse' },
      { fromType: 'stream_processor', toType: 'data_warehouse' },
    ],
  },

  hints: {
    level1: 'Add a Data Warehouse and connect it to both S3 and the Stream Processor',
    level2: 'OLAP warehouse loads data from S3 (batch) and also receives real-time updates from Flink. This is Lambda Architecture.',
    solutionComponents: [{ type: 'data_warehouse' }],
    solutionConnections: [
      { from: 'object_storage', to: 'data_warehouse' },
      { from: 'stream_processor', to: 'data_warehouse' },
    ],
  },
};

// =============================================================================
// STEP 7: Add ETL Orchestration
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔄',
  scenario: "You have 50+ ETL jobs running ad-hoc. They're failing, overlapping, and nobody knows which ran last!",
  hook: "ETL jobs need orchestration - scheduling, dependencies, retries, monitoring.",
  challenge: "Add an orchestration layer to manage ETL pipelines.",
  illustration: 'chaos',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'ETL pipelines are organized!',
  achievement: 'Orchestration manages job dependencies and retries',
  metrics: [
    { label: 'Failed jobs', before: 'Unknown', after: 'Monitored & retried' },
    { label: 'Job scheduling', before: 'Ad-hoc', after: 'Automated' },
  ],
  nextTeaser: "Time to add monitoring...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'ETL Orchestration: Managing Data Pipelines',
  conceptExplanation: `**ETL orchestration** manages complex data workflows.

Without orchestration:
- Jobs run via cron, scattered across servers
- No dependency management (Job B needs Job A to finish first)
- No retry logic when jobs fail
- No visibility into pipeline health

With orchestration (Airflow):
- **DAGs** (Directed Acyclic Graphs): Define job dependencies
- **Scheduling**: Run jobs at specific times or on triggers
- **Retries**: Automatically retry failed jobs
- **Monitoring**: Dashboard showing pipeline status

For Uber's data platform:
1. Extract: Read new data from Kafka/Database
2. Transform: Clean, aggregate, enrich data
3. Load: Write to OLAP warehouse
4. Airflow ensures these run in order, with retries

This is critical for FR-6 (data transformations).`,

  whyItMatters: 'At scale, you have hundreds of ETL jobs with complex dependencies. Without orchestration, the system becomes unmaintainable.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Managing thousands of data pipelines',
    howTheyDoIt: 'Uses Apache Airflow for orchestration. Runs 100K+ DAGs per day, managing petabytes of data movement.',
  },

  famousIncident: {
    title: 'Airbnb\'s Airflow Creation',
    company: 'Airbnb',
    year: '2014',
    whatHappened: 'Airbnb created Apache Airflow because their ETL pipelines (managed via cron) became unmaintainable. They open-sourced it, and it became the industry standard.',
    lessonLearned: 'ETL orchestration is essential for data engineering at scale.',
    icon: '🔄',
  },

  keyPoints: [
    'Orchestration manages ETL job scheduling and dependencies',
    'Airflow uses DAGs to define workflows',
    'Automatic retries handle transient failures',
    'Monitoring dashboards show pipeline health',
  ],

  diagram: `
Airflow DAG Example:

   ┌────────────────┐
   │ Extract from   │
   │ Kafka          │
   └────────┬───────┘
            │
            ▼
   ┌────────────────┐
   │ Transform      │
   │ (Clean data)   │
   └────────┬───────┘
            │
            ▼
   ┌────────────────┐
   │ Load to        │
   │ Data Warehouse │
   └────────────────┘

If Transform fails → Airflow retries 3 times
If still fails → Alert on-call engineer
`,

  keyConcepts: [
    { title: 'DAG', explanation: 'Directed Acyclic Graph of job dependencies', icon: '🔀' },
    { title: 'Orchestration', explanation: 'Automate scheduling and monitoring', icon: '🎯' },
    { title: 'Airflow', explanation: 'Popular open-source orchestrator', icon: '🌊' },
  ],
};

const step7: GuidedStep = {
  id: 'uber-data-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-6: Data transformations (ETL) with orchestration',
    taskDescription: 'Add an Orchestrator (Airflow) to manage ETL pipelines',
    componentsNeeded: [
      { type: 'job_scheduler', reason: 'Airflow for ETL orchestration', displayName: 'Airflow' },
    ],
    successCriteria: [
      'Job Scheduler (Airflow) added',
      'Airflow orchestrates data flow between components',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue', 'database', 'stream_processor', 'cache', 'search_index', 'object_storage', 'data_warehouse', 'job_scheduler'],
  },

  hints: {
    level1: 'Add a Job Scheduler (Airflow) component',
    level2: 'Airflow orchestrates ETL pipelines - it manages when and how data moves between systems.',
    solutionComponents: [{ type: 'job_scheduler' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Monitoring and Observability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '👀',
  scenario: "It's 3 AM. The data pipeline is broken and nobody knows why!",
  hook: "Without monitoring, you're flying blind. Data quality issues go undetected for days.",
  challenge: "Add monitoring to track pipeline health and data quality.",
  illustration: 'monitoring',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'You built a complete data platform!',
  achievement: 'Real-time analytics, geospatial queries, data lake, OLAP warehouse, and full observability',
  metrics: [
    { label: 'Event ingestion', after: '50K events/sec' },
    { label: 'Real-time analytics latency', after: '< 1s' },
    { label: 'Geospatial query latency', after: '< 50ms' },
    { label: 'OLAP query performance', after: '10-100x faster' },
    { label: 'Storage cost', after: 'Optimized (tiered)' },
    { label: 'Pipeline visibility', after: 'Full monitoring' },
  ],
  nextTeaser: "You've mastered data platform design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Monitoring: Observability for Data Pipelines',
  conceptExplanation: `**Monitoring** tracks the health of your data platform.

What to monitor:
1. **Infrastructure metrics**: CPU, memory, disk I/O, network
2. **Pipeline metrics**: Event throughput, lag, processing time
3. **Data quality**: Schema changes, null rates, outliers
4. **Business metrics**: Daily ride count, revenue, data freshness

Tools:
- **Prometheus/Grafana**: Infrastructure and pipeline metrics
- **Data quality**: Great Expectations, dbt tests
- **Alerts**: PagerDuty for on-call when pipelines break

For Uber:
- Alert if Kafka lag > 1 minute (data falling behind)
- Alert if daily ride count drops 20% (data quality issue)
- Dashboard showing real-time throughput and latency`,

  whyItMatters: 'Data pipeline failures can go unnoticed for days without monitoring. Bad data = bad business decisions.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Monitoring data pipeline health',
    howTheyDoIt: 'Uses custom monitoring stack with Prometheus, Grafana, and internal tools. Tracks 100K+ metrics across data platform.',
  },

  famousIncident: {
    title: 'Data Pipeline Silent Failure',
    company: 'Various Companies',
    year: 'Ongoing',
    whatHappened: 'Common pattern: ETL pipeline fails silently, dashboards show stale data for days/weeks. Business makes decisions on bad data. Often discovered only when someone manually checks.',
    lessonLearned: 'Monitor data freshness and quality, not just infrastructure. Alert on anomalies.',
    icon: '🚨',
  },

  keyPoints: [
    'Monitor infrastructure (CPU, memory) AND data quality',
    'Alert on pipeline lag, failures, and data anomalies',
    'Dashboards should show real-time pipeline health',
    'Great Expectations for automated data quality checks',
  ],

  diagram: `
Monitoring Stack:

┌──────────────────────────────────────┐
│         Grafana Dashboards           │
│  - Kafka lag                         │
│  - Event throughput                  │
│  - Data freshness                    │
│  - Error rates                       │
└──────────────────────────────────────┘
                  ▲
                  │
┌─────────────────┴─────────────────┐
│         Prometheus                 │
│  Collects metrics from:            │
│  - Kafka                           │
│  - Flink                           │
│  - PostgreSQL                      │
│  - Elasticsearch                   │
└────────────────────────────────────┘
`,

  quickCheck: {
    question: 'Why is monitoring data quality as important as monitoring infrastructure?',
    options: [
      'Data quality issues are more common',
      'Bad data leads to bad business decisions',
      'Data quality is harder to fix',
      'Compliance requirements',
    ],
    correctIndex: 1,
    explanation: 'Infrastructure failures are obvious (system down). Data quality issues are silent - bad data flows through, leading to incorrect analytics and poor decisions.',
  },

  keyConcepts: [
    { title: 'Observability', explanation: 'Visibility into system behavior', icon: '👀' },
    { title: 'Data Quality', explanation: 'Monitor schema, nulls, anomalies', icon: '✅' },
    { title: 'Alerting', explanation: 'Page on-call when issues occur', icon: '🚨' },
  ],
};

const step8: GuidedStep = {
  id: 'uber-data-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs need monitoring and observability',
    taskDescription: 'Add Monitoring (Prometheus/Grafana) to track pipeline health',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Prometheus/Grafana for observability', displayName: 'Monitoring' },
    ],
    successCriteria: [
      'Monitoring component added',
      'All major components emit metrics to monitoring',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['app_server', 'message_queue', 'database', 'stream_processor', 'cache', 'search_index', 'object_storage', 'data_warehouse', 'job_scheduler', 'monitoring'],
  },

  hints: {
    level1: 'Add a Monitoring component to track the health of your data platform',
    level2: 'Monitoring collects metrics from all components and alerts on issues. Essential for production systems.',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l5DataPlatformUberGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-data-platform-uber',
  title: 'Design Uber Data Platform',
  description: 'Build a real-time analytics platform with geospatial indexing, streaming ETL, and data lake architecture',
  difficulty: 'advanced',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '📊',
    hook: "Welcome to Uber's Data Engineering team!",
    scenario: "Your mission: Build a data platform that processes 50K events/sec, powers real-time surge pricing, and enables business analytics on petabytes of historical data.",
    challenge: "Can you design a system that handles streaming data, geospatial queries, and complex analytics?",
  },

  requirementsPhase: uberDataPlatformRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'OLTP vs OLAP',
    'Lambda Architecture (Batch + Streaming)',
    'Stream Processing (Flink/Spark)',
    'Geospatial Indexing (R-trees, Geohashing)',
    'Data Lake Architecture',
    'Columnar Storage',
    'ETL Orchestration (Airflow)',
    'Time-Series Data',
    'Data Quality Monitoring',
    'Tiered Storage (Hot/Warm/Cold)',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Column-oriented storage)',
    'Chapter 10: Batch Processing (Data lake, ETL)',
    'Chapter 11: Stream Processing (Kafka, Flink)',
  ],
};

export default l5DataPlatformUberGuidedTutorial;
