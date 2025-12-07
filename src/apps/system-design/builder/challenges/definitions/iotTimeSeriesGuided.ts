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
 * IoT Time Series Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching time-series database design
 * for IoT systems. Build a platform that handles high-volume sensor data with
 * compression, aggregation windows, and alerting.
 *
 * Key Concepts:
 * - Time-series data storage strategies
 * - Data compression techniques
 * - Aggregation windows and downsampling
 * - Real-time alerting on sensor data
 * - Hot/warm/cold storage tiers
 *
 * Flow:
 * Phase 0: Requirements gathering (data volume, retention, downsampling)
 * Steps 1-3: Build basic time-series storage pipeline
 * Steps 4-6: Add compression, aggregation windows, and alerting
 *
 * Pedagogy: First make it WORK, then make it EFFICIENT, then make it SMART
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const iotTimeSeriesRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a time-series database system for IoT sensor data at scale",

  interviewer: {
    name: 'Dr. Sarah Chen',
    role: 'Senior Data Platform Architect',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main operations this time-series system needs to support?",
      answer: "The system needs to:\n1. **Ingest time-series data** - Accept high-volume sensor readings (temperature, pressure, vibration, etc.)\n2. **Store with timestamps** - Each reading has a precise timestamp for time-based queries\n3. **Query by time ranges** - 'Give me all readings from sensor X between T1 and T2'\n4. **Aggregate over windows** - Calculate averages, min/max over 1-min, 5-min, 1-hour windows",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Time-series systems optimize for timestamp-based queries and aggregations",
    },
    {
      id: 'data-volume',
      category: 'functional',
      question: "How much data are we talking about? What's the ingestion rate?",
      answer: "We have 200,000 IoT devices, each reporting every 5 seconds. That's:\n- 200K devices × 12 readings/min = 2.4 million readings/min\n- About 40,000 writes per second sustained\n- Each reading is ~100 bytes (device_id, timestamp, metric_name, value)\n- Daily ingestion: ~350 GB/day raw data",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "High write throughput is the defining characteristic of IoT time-series workloads",
    },
    {
      id: 'retention-policy',
      category: 'functional',
      question: "How long do we need to keep the data? Forever?",
      answer: "No, we use tiered retention:\n- **Raw data (5-second resolution)**: 30 days\n- **1-minute aggregates**: 90 days\n- **Hourly aggregates**: 2 years\n- **Daily aggregates**: 5 years\n\nThis prevents storage from growing infinitely while preserving historical trends.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Retention policies with downsampling keep storage bounded while preserving trends",
    },
    {
      id: 'downsampling-strategy',
      category: 'functional',
      question: "How do we decide what to keep when downsampling old data?",
      answer: "For each time window, we compute and store:\n- **Average (mean)** - typical value\n- **Min/Max** - range of values\n- **Count** - number of raw readings\n- **P50, P95, P99** (optional) - distribution understanding\n\nThis captures the shape of the data without storing every point.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Downsampling isn't just 'averaging' - it's capturing statistical properties",
    },

    // IMPORTANT - Clarifications
    {
      id: 'query-patterns',
      category: 'clarification',
      question: "What are the typical query patterns? Recent data? Historical analysis?",
      answer: "Two main patterns:\n1. **Recent data queries** (last hour, last day) - used by dashboards, very frequent\n2. **Historical analysis** (last month, last year) - used by analysts, less frequent but scan more data\n\nRecent queries must be fast (< 100ms), historical can be slower (< 5s).",
      importance: 'important',
      insight: "Recent data is hot, historical is cold - optimize storage tiers accordingly",
    },
    {
      id: 'compression-needs',
      category: 'clarification',
      question: "Should we compress the data? How important is storage efficiency?",
      answer: "Yes, compression is critical! At 350 GB/day, uncompressed data would cost $10K+/month in storage. With compression:\n- Time-series compression (delta encoding, run-length encoding): 10:1 ratio\n- Storage drops to ~35 GB/day\n- Cost drops to ~$1K/month\n\nTime-series data compresses extremely well due to patterns.",
      importance: 'important',
      insight: "Time-series data is highly compressible - always enable compression",
    },
    {
      id: 'alerting',
      category: 'clarification',
      question: "Do we need real-time alerting when sensors exceed thresholds?",
      answer: "Yes! Critical requirement:\n- Alert if temperature > 80°C\n- Alert if pressure drops > 10% in 1 minute\n- Alert if sensor stops reporting (offline detection)\n\nAlerts must fire within 10 seconds of threshold breach.",
      importance: 'important',
      insight: "Alerting requires stream processing, not just storage",
    },

    // SCOPE
    {
      id: 'scope-ml-analytics',
      category: 'scope',
      question: "Do we need machine learning or anomaly detection?",
      answer: "Not for v1. Focus on ingestion, storage, aggregation, and basic alerting. ML/anomaly detection is v2.",
      importance: 'nice-to-have',
      insight: "ML can be added later as a separate pipeline reading from the time-series store",
    },
    {
      id: 'scope-multi-region',
      category: 'scope',
      question: "Is this a single datacenter or multi-region deployment?",
      answer: "Single region for v1. All sensors are in the same geographic area. Multi-region replication is v2.",
      importance: 'nice-to-have',
      insight: "Single region simplifies architecture significantly",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "What's the sustained write throughput we need to handle?",
      answer: "40,000 writes per second sustained, with bursts up to 100,000 writes/sec when devices reconnect after network issues.",
      importance: 'critical',
      calculation: {
        formula: "200K devices × 12 readings/min ÷ 60 sec = 40,000 writes/sec",
        result: "~40K writes/sec sustained, 100K peak",
      },
      learningPoint: "IoT is extremely write-heavy - reads are minimal compared to writes",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many queries per second?",
      answer: "About 500 queries/sec:\n- 300 dashboard queries (recent data)\n- 100 API queries (mobile apps, integrations)\n- 100 analyst queries (historical data)\n\nWrite-to-read ratio is 80:1 (very write-heavy).",
      importance: 'important',
      calculation: {
        formula: "500 reads/sec vs 40K writes/sec = 80:1 ratio",
        result: "Write-dominated workload",
      },
      learningPoint: "Time-series DBs must optimize for write throughput first",
    },

    // 2. PAYLOAD
    {
      id: 'payload-size',
      category: 'payload',
      question: "How large is each data point?",
      answer: "Each reading is ~100 bytes:\n- device_id (UUID): 16 bytes\n- timestamp (int64): 8 bytes\n- metric_name (string): ~30 bytes\n- value (float64): 8 bytes\n- tags/metadata: ~38 bytes",
      importance: 'important',
      calculation: {
        formula: "40K writes/sec × 100 bytes = 4 MB/sec = 345 GB/day",
        result: "~350 GB/day raw ingestion",
      },
      learningPoint: "Small payloads but high volume = storage optimization critical",
    },
    {
      id: 'payload-compression',
      category: 'payload',
      question: "How much can we compress time-series data?",
      answer: "Time-series data compresses extremely well:\n- Delta encoding (store differences, not absolutes): 3-4x\n- Run-length encoding (repeated values): 2x\n- General compression (zstd/lz4): 1.5x\n- Combined: 8-10x compression ratio\n\nStorage drops from 350 GB/day to ~35 GB/day.",
      importance: 'critical',
      calculation: {
        formula: "350 GB/day ÷ 10 (compression) = 35 GB/day",
        result: "~1 TB/month with compression",
      },
      learningPoint: "Time-series compression is essential for cost-effective storage",
    },

    // 3. LATENCY
    {
      id: 'latency-write-ack',
      category: 'latency',
      question: "How fast do we need to acknowledge writes?",
      answer: "Devices expect acknowledgment within 500ms. Slower than that and they timeout and retry, causing duplicate data.",
      importance: 'critical',
      learningPoint: "Fast write acknowledgment prevents retry storms",
    },
    {
      id: 'latency-query',
      category: 'latency',
      question: "What are the query latency requirements?",
      answer: "- **Recent data** (last hour): p99 < 100ms\n- **Medium range** (last week): p99 < 1s\n- **Historical** (last year): p99 < 5s\n\nLatency increases with time range, which is acceptable.",
      importance: 'important',
      learningPoint: "Query latency depends on time range and data volume",
    },

    // 4. BURSTS
    {
      id: 'burst-reconnection',
      category: 'burst',
      question: "What happens during network outages when devices reconnect?",
      answer: "Devices buffer up to 10 minutes of data locally. When they reconnect, they dump it all at once. A 5-minute outage affecting 50K devices creates a burst of 3 million writes in ~30 seconds (100K writes/sec).",
      importance: 'critical',
      insight: "Need write buffering (message queue) to absorb reconnection storms",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'data-volume', 'retention-policy', 'downsampling-strategy'],
  criticalFRQuestionIds: ['core-operations', 'data-volume', 'retention-policy'],
  criticalScaleQuestionIds: ['throughput-writes', 'latency-write-ack', 'payload-compression'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Ingest time-series data at scale',
      description: 'Accept 40K writes/sec sustained (100K peak) from 200K IoT devices',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Query by time ranges',
      description: 'Fast queries for recent data (< 100ms) and historical data (< 5s)',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Retention with downsampling',
      description: 'Tiered retention: raw (30d), 1-min (90d), hourly (2y), daily (5y)',
      emoji: '📅',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Aggregation windows',
      description: 'Pre-compute aggregates (avg, min, max) over 1-min, 1-hour, 1-day windows',
      emoji: '📈',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Real-time alerting',
      description: 'Fire alerts within 10 seconds when sensors breach thresholds',
      emoji: '🚨',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '200K IoT devices',
    writesPerDay: '3.5 billion data points',
    readsPerDay: '43 million queries',
    peakMultiplier: 2.5,
    readWriteRatio: '1:80 (extremely write-heavy)',
    calculatedWriteRPS: { average: 40000, peak: 100000 },
    calculatedReadRPS: { average: 500, peak: 1250 },
    maxPayloadSize: '~100 bytes per reading',
    storagePerRecord: '~10 bytes (with compression)',
    storageGrowthPerYear: '~12 TB with compression, ~120 TB without',
    redirectLatencySLA: 'Write ack: < 500ms, Recent query: < 100ms',
    createLatencySLA: 'Aggregations: batch computed (1-5 min delay acceptable)',
  },

  architecturalImplications: [
    '✅ 40K writes/sec → Need write-optimized time-series database (InfluxDB, TimescaleDB)',
    '✅ Write-heavy (80:1) → Optimize for write throughput, reads are secondary',
    '✅ 350 GB/day → Compression essential (10:1 ratio achievable)',
    '✅ Retention tiers → Automated downsampling and deletion',
    '✅ Real-time alerting → Stream processing layer (monitor writes, not reads)',
    '✅ Burst handling → Message queue buffers reconnection storms',
  ],

  outOfScope: [
    'Machine learning / anomaly detection',
    'Multi-region replication',
    'Complex event processing',
    'Historical data backfill',
    'Custom metric types beyond numeric',
  ],

  keyInsight: "First, let's build a basic pipeline that ingests sensor data and stores it in a time-series database. We'll start simple with direct writes, then add compression, downsampling, and alerting. Storage first, optimization second!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Sensors to Ingestion API
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏭',
  scenario: "Welcome to IndustrialIoT! You're building a time-series platform for 200K factory sensors.",
  hook: "Sensors are generating readings every 5 seconds - temperature, pressure, vibration. They need somewhere to send this data!",
  challenge: "Set up the basic ingestion pipeline so IoT sensors can send time-stamped readings to your system.",
  illustration: 'factory-sensors',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your time-series platform is receiving data!",
  achievement: "Sensors can now send timestamped readings to your ingestion API",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting sensor data', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know what to do with the data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Data Ingestion: The Foundation',
  conceptExplanation: `Time-series data is different from regular application data. Every data point has:
1. **Timestamp** - When the reading was taken (critical!)
2. **Metric name** - What was measured (temperature, pressure, etc.)
3. **Value** - The actual reading (23.5°C, 101.3 kPa, etc.)
4. **Tags/metadata** - Device ID, location, etc.

Your sensors send HTTP POST requests with this data:
\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "metric": "temperature",
  "value": 23.5,
  "tags": {
    "device_id": "sensor-42",
    "location": "warehouse-A"
  }
}
\`\`\`

The **App Server** receives these readings and (for now) just acknowledges them. Storage comes next!`,

  whyItMatters: 'Without an ingestion API, sensors have nowhere to send data. This is the entry point for ALL time-series data.',

  keyPoints: [
    'Time-series data always has a timestamp - this is what makes it "time-series"',
    'IoT sensors send readings via HTTP POST every few seconds',
    'Server must acknowledge quickly (< 500ms) to prevent retries',
    'Timestamp precision matters - use ISO 8601 or Unix milliseconds',
  ],

  diagram: `
┌──────────────┐         ┌─────────────────┐
│ IoT Sensors  │ ──────▶ │   App Server    │
│  (200,000)   │  POST   │ (Ingestion API) │
│              │ ◀────── │                 │
└──────────────┘   ACK   └─────────────────┘
  Every 5 seconds          < 500ms response
`,

  keyConcepts: [
    {
      title: 'Time-Series Data',
      explanation: 'Data points with timestamps - the core of IoT and monitoring systems',
      icon: '📊',
    },
    {
      title: 'Ingestion API',
      explanation: 'HTTP endpoint accepting sensor readings: POST /api/v1/write',
      icon: '📡',
    },
  ],

  quickCheck: {
    question: 'What makes data "time-series" instead of regular database records?',
    options: [
      'The presence of a timestamp on every data point',
      'It\'s stored in a special database',
      'It comes from IoT devices',
      'It\'s compressed',
    ],
    correctIndex: 0,
    explanation: 'Time-series data is defined by having a timestamp dimension. Queries and storage are optimized around time ranges.',
  },
};

const step1: GuidedStep = {
  id: 'iot-ts-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'IoT sensors can send time-series data to the system',
    taskDescription: 'Add Client (representing IoT sensors) and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents 200K IoT sensors', displayName: 'IoT Sensors' },
      { type: 'app_server', reason: 'Runs time-series ingestion API', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'IoT Sensors', to: 'App Server', reason: 'Sensors POST time-series data' },
    ],
    successCriteria: ['Add IoT Sensors (Client)', 'Add App Server', 'Connect IoT Sensors → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client (IoT sensors), then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Ingestion Handler (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your App Server is connected, but it's an empty shell!",
  hook: "Sensors are sending data but getting 404 errors. You need to implement the actual ingestion handler!",
  challenge: "Configure the ingestion API endpoint and write Python code to receive and validate time-series data.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your ingestion API is working!",
  achievement: "Sensors successfully send time-series data and receive acknowledgments",
  metrics: [
    { label: 'API configured', after: 'POST /api/v1/write' },
    { label: 'Handler implemented', after: '✓ Working' },
  ],
  nextTeaser: "But where is the data going? When the server restarts, everything vanishes!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Ingestion Handler: Validation & Buffering',
  conceptExplanation: `Your App Server needs to implement the time-series ingestion endpoint!

**POST /api/v1/write** — You'll implement this handler

The handler must:
1. **Validate** the time-series data (timestamp, metric name, value, tags)
2. **Parse timestamp** - convert to internal format (Unix milliseconds)
3. **Buffer** in memory (for now - database comes next)
4. **Acknowledge** quickly (< 500ms)

**Example Python handler:**
\`\`\`python
def write_time_series(request):
    data = request.json

    # Validate required fields
    if not all(k in data for k in ['timestamp', 'metric', 'value']):
        return {'error': 'Missing required fields'}, 400

    # Parse timestamp to Unix milliseconds
    timestamp_ms = parse_iso8601(data['timestamp'])

    # Store in memory buffer (temporary!)
    buffer.append({
        'ts': timestamp_ms,
        'metric': data['metric'],
        'value': float(data['value']),
        'tags': data.get('tags', {})
    })

    # Fast acknowledgment
    return {'status': 'ok'}, 200
\`\`\`

**By the end of this step:**
✅ API endpoint configured
✅ Python handler validates time-series data
✅ Sensors receive fast acknowledgments`,

  whyItMatters: 'Without the handler, your server is just a hollow box. This code validates data quality and prevents bad data from polluting storage.',

  keyPoints: [
    'Validate timestamps - reject data with future timestamps or invalid formats',
    'Parse timestamps consistently (ISO 8601 or Unix milliseconds)',
    'Buffer in memory for fast acknowledgment (< 500ms)',
    'Log invalid data for debugging - don\'t silently drop it',
  ],

  diagram: `
POST /api/v1/write
┌──────────────────────────────────────────────┐
│ Request: {                                   │
│   "timestamp": "2024-01-15T10:30:00Z",       │
│   "metric": "temperature",                   │
│   "value": 23.5,                             │
│   "tags": {"device_id": "sensor-42"}         │
│ }                                            │
│                                              │
│ Handler: Validate → Parse → Buffer → ACK    │
│                                              │
│ Response: { "status": "ok" } (200 OK)       │
└──────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Timestamp Parsing', explanation: 'Convert ISO 8601 or Unix timestamps to internal format', icon: '🕐' },
    { title: 'Validation', explanation: 'Reject malformed data early to maintain data quality', icon: '✔️' },
    { title: 'Fast ACK', explanation: 'Respond immediately, process async', icon: '⚡' },
  ],

  quickCheck: {
    question: 'Why validate timestamps at ingestion instead of later?',
    options: [
      'It\'s faster to validate early',
      'Invalid timestamps corrupt time-series queries and aggregations',
      'It saves storage space',
      'Databases require it',
    ],
    correctIndex: 1,
    explanation: 'Time-series systems rely on timestamps for queries and aggregations. Bad timestamps (future dates, invalid formats) break everything downstream.',
  },
};

const step2: GuidedStep = {
  id: 'iot-ts-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle time-series ingestion with Python code',
    taskDescription: 'Configure API and implement the Python handler for time-series data',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'IoT Sensors' },
      { type: 'app_server', reason: 'Configure API and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'IoT Sensors', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/write API',
      'Open Python tab and implement write_time_series() handler',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure API, then switch to Python tab',
    level2: 'After assigning POST /api/v1/write API, implement the handler to validate and buffer time-series data',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Time-Series Database - Durable Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The server crashed during a deployment.",
  hook: "When it restarted, ALL sensor data from the past 24 hours is GONE. Engineers can't debug the temperature spike incident!",
  challenge: "Data was only buffered in RAM. We need a time-series database to persist data durably!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your time-series data is now durable!",
  achievement: "Sensor readings persist forever (until retention policies expire them)",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted to disk' },
    { label: 'Storage', after: 'Time-Series Database' },
  ],
  nextTeaser: "Great! But write throughput is hitting limits...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Databases: Purpose-Built for Sensor Data',
  conceptExplanation: `Regular databases (PostgreSQL, MySQL) aren't optimized for time-series workloads.

**Why time-series databases are different:**

| Feature | Regular DB | Time-Series DB |
|---------|-----------|----------------|
| Write pattern | Random updates | Append-only (no updates!) |
| Query pattern | Lookup by ID | Time-range scans |
| Indexes | B-trees | Time-based partitions |
| Compression | Generic (~2x) | Time-aware (~10x) |
| Retention | Manual DELETE | Automatic expiration |

**Popular time-series databases:**
- **InfluxDB** - Open source, easy to use, 40K writes/sec per node
- **TimescaleDB** - PostgreSQL extension, SQL familiar, 100K writes/sec
- **Prometheus** - Pull-based, great for monitoring (not IoT)
- **Amazon Timestream** - Fully managed, serverless, auto-scaling

**For IoT at this scale:** Use InfluxDB or TimescaleDB
- Optimized for 40K+ writes/sec
- Built-in compression (10:1 ratio)
- Automatic retention and downsampling
- Fast time-range queries`,

  whyItMatters: 'Time-series DBs are 10-100x more efficient for sensor data than general-purpose databases.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Storing GPS coordinates from millions of active trips',
    howTheyDoIt: 'Uses in-house time-series database (M3DB) built on top of Cassandra. Handles 10 million writes/sec with 95% compression ratio.',
  },

  famousIncident: {
    title: 'Robinhood Trading Outage',
    company: 'Robinhood',
    year: '2020',
    whatHappened: 'Stored trading data in MySQL. During extreme volatility, writes overwhelmed the database (500K writes/sec). System crashed, users couldn\'t trade for 2 days. SEC fined them $70 million.',
    lessonLearned: 'Use time-series databases for time-series workloads. Regular DBs can\'t handle IoT write volumes.',
    icon: '📉',
  },

  keyPoints: [
    'Time-series DBs optimize for append-only writes (sensors never update old data)',
    'Automatic compression: delta encoding + run-length encoding = 10:1 ratio',
    'Built-in retention: old data auto-expires based on policies',
    'Fast time-range queries: "Give me all readings from sensor-42 in the last hour"',
  ],

  diagram: `
┌──────────────┐       ┌─────────────┐       ┌────────────────┐
│ IoT Sensors  │ ────▶ │ App Server  │ ────▶ │  Time-Series   │
│  (200K)      │       │ (Ingestion) │       │   Database     │
└──────────────┘       └─────────────┘       │  (InfluxDB)    │
                                             │                │
                                             │ sensor-42:     │
                                             │  10:30 → 23.5  │
                                             │  10:35 → 23.7  │
                                             │  10:40 → 23.6  │
                                             └────────────────┘
`,

  keyConcepts: [
    { title: 'Append-Only', explanation: 'New data is always appended, never updated (perfect for sensors)', icon: '➕' },
    { title: 'Time-Range Query', explanation: 'Filter by time windows efficiently', icon: '📅' },
    { title: 'Delta Encoding', explanation: 'Store differences between readings, not full values', icon: '🗜️' },
  ],

  quickCheck: {
    question: 'Why are time-series databases better for IoT than PostgreSQL?',
    options: [
      'They\'re newer technology',
      'Optimized for append-only writes and time-range queries with 10x compression',
      'They\'re cheaper',
      'They support more data types',
    ],
    correctIndex: 1,
    explanation: 'Time-series DBs are purpose-built for sensor data: append-only writes, time-based queries, and aggressive compression.',
  },
};

const step3: GuidedStep = {
  id: 'iot-ts-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Time-series data must persist durably in specialized storage',
    taskDescription: 'Build IoT Sensors → App Server → Time-Series Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents IoT sensors', displayName: 'IoT Sensors' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'database', reason: 'Time-series storage (InfluxDB)', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Sensors', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Time-Series DB', reason: 'Server writes to DB' },
    ],
    successCriteria: ['Add all three components', 'Connect IoT Sensors → App Server → Time-Series DB'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full pipeline: IoT Sensors → App Server → Time-Series Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Message Queue - Compression & Batch Writes
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔥',
  scenario: "Write throughput is maxing out! Database CPU is at 95%.",
  hook: "You're hitting 40,000 individual writes per second. Each write has overhead. The database can't keep up with peak traffic!",
  challenge: "Add a message queue to buffer writes and batch them. Write 100 data points at once instead of 100 individual writes!",
  illustration: 'database-overload',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Write throughput is now under control!",
  achievement: "Message queue buffers and batches writes, reducing DB load by 10x",
  metrics: [
    { label: 'DB write load', before: '40K writes/sec', after: '4K batched writes/sec' },
    { label: 'Write latency', before: '500ms', after: '50ms (buffered)' },
  ],
  nextTeaser: "Nice! But storage is growing fast. We need compression...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Buffering and Batching for Time-Series',
  conceptExplanation: `**The problem:** Writing 40,000 individual data points per second overwhelms the database.

Each write has overhead:
- TCP connection
- Query parsing
- Index updates
- Disk fsync

**Solution: Batch writes via Message Queue**

Instead of:
\`\`\`
Write(sensor-1, 23.5)  ← 1 DB write
Write(sensor-2, 45.2)  ← 1 DB write
Write(sensor-3, 67.8)  ← 1 DB write
...40K times
\`\`\`

Do this:
\`\`\`
BatchWrite([
  (sensor-1, 23.5),
  (sensor-2, 45.2),
  (sensor-3, 67.8),
  ...100 points
])  ← 1 DB write with 100 points!
\`\`\`

**How it works:**
1. App Server writes each point to message queue (fast, in-memory)
2. Queue buffers points (durable storage)
3. Consumer reads 100 points from queue
4. Consumer writes batch to time-series DB
5. Result: 40K points/sec = 400 batched writes/sec

**Benefits:**
- **10-100x fewer DB writes** (batching overhead reduction)
- **Buffer bursts** - queue absorbs 100K peak without crashing DB
- **Compression** - batch similar timestamps together for better compression
- **Retry logic** - failed batches can be retried without losing data`,

  whyItMatters: 'Batching is the difference between 40K DB writes/sec (impossible) and 400 writes/sec (easy).',

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Vehicle telemetry ingestion',
    howTheyDoIt: 'Uses Apache Kafka to buffer telemetry. Batches 1000 data points per write to time-series storage. Reduces DB load by 1000x.',
  },

  famousIncident: {
    title: 'Knight Capital Trading Loss',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Trading system sent 4 million orders in 45 minutes (1500/sec). Database couldn\'t handle it, crashed repeatedly. Lost $440 million in 45 minutes.',
    lessonLearned: 'Always buffer high-frequency writes. Message queues prevent data loss and protect databases.',
    icon: '💸',
  },

  keyPoints: [
    'Message queue (Kafka) sits between App Server and Time-Series DB',
    'App Server writes individual points to queue (fast)',
    'Consumer batches 100-1000 points before writing to DB',
    'Reduces DB writes by 10-100x while maintaining durability',
  ],

  diagram: `
┌────────────┐    ┌────────────┐    ┌──────────┐    ┌─────────────┐
│ IoT Sensor │───▶│ App Server │───▶│  Queue   │───▶│ Time-Series │
│ (40K pts/s)│    │ (Buffer)   │    │ (Kafka)  │    │     DB      │
└────────────┘    └────────────┘    └──────────┘    └─────────────┘
                       Fast ACK       Batch 100      400 writes/sec
                                      ← Buffer →
`,

  keyConcepts: [
    { title: 'Batching', explanation: 'Write N data points in 1 DB operation instead of N operations', icon: '📦' },
    { title: 'Buffering', explanation: 'Queue stores data temporarily during bursts', icon: '🗄️' },
    { title: 'Write Reduction', explanation: 'Batching reduces DB writes by 10-100x', icon: '📉' },
  ],

  quickCheck: {
    question: 'How does batching reduce database load?',
    options: [
      'It compresses data better',
      'Each DB write has overhead - batching amortizes that overhead across many points',
      'Databases prefer batched writes',
      'It uses less network bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Every DB write has fixed overhead (parsing, indexing, disk sync). Batching spreads that overhead across 100 points instead of 1.',
  },
};

const step4: GuidedStep = {
  id: 'iot-ts-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'System must handle 40K writes/sec without overwhelming the database',
    taskDescription: 'Add Message Queue between App Server and Time-Series DB for batching',
    componentsNeeded: [
      { type: 'client', reason: 'IoT sensors', displayName: 'IoT Sensors' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers and batches writes', displayName: 'Message Queue' },
      { type: 'database', reason: 'Time-series storage', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Sensors', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer writes' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Batched writes' },
    ],
    successCriteria: [
      'Add Message Queue between App Server and Database',
      'Connect: App Server → Queue → Time-Series DB',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Insert a Message Queue between App Server and Time-Series DB',
    level2: 'Add Message Queue, then connect: App Server → Message Queue → Time-Series DB',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Implement Aggregation Windows - Pre-Computed Summaries
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📊',
  scenario: "Dashboard users want to see hourly averages and daily trends!",
  hook: "Querying 'average temperature last week' scans 12 million raw data points and takes 30 seconds. Users are angry!",
  challenge: "Pre-compute aggregations! Calculate 1-minute, 1-hour, and daily averages in the background.",
  illustration: 'slow-query',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Aggregation queries are lightning fast!",
  achievement: "Pre-computed windows answer queries in milliseconds instead of seconds",
  metrics: [
    { label: 'Query time (weekly avg)', before: '30 seconds', after: '50 milliseconds' },
    { label: 'Storage efficiency', before: '100%', after: '15% (with downsampling)' },
  ],
  nextTeaser: "Great! But we need alerting when sensors breach thresholds...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Aggregation Windows: The Heart of Time-Series Efficiency',
  conceptExplanation: `**The problem:** Scanning raw data for aggregations is slow and expensive.

Query: "Average temperature last week"
- Must scan: 200K sensors × 12 readings/min × 60 min × 24 hr × 7 days = 2.4 billion points!
- Takes: 30+ seconds
- Users: Angry

**Solution: Pre-computed Aggregation Windows**

Instead of computing on query, compute in background:

**1-Minute Window:** Every minute, compute:
\`\`\`
SELECT
  metric,
  AVG(value) as avg,
  MIN(value) as min,
  MAX(value) as max,
  COUNT(*) as count
FROM raw_data
WHERE timestamp >= NOW() - 1 minute
GROUP BY metric
\`\`\`

**Hourly Window:** Every hour, aggregate the 1-minute windows
**Daily Window:** Every day, aggregate the hourly windows

**Query becomes:**
- Want last week's average? Scan 7 daily aggregates instead of 2.4B raw points!
- Query time: 30 seconds → 50 milliseconds (600x faster!)

**Storage tiers:**
- Raw (5-sec): Keep 30 days
- 1-min aggregates: Keep 90 days
- Hourly aggregates: Keep 2 years
- Daily aggregates: Keep 5 years

Old raw data gets deleted after downsampling!`,

  whyItMatters: 'Pre-aggregation makes queries fast and storage efficient. Without it, queries get slower as data grows.',

  realWorldExample: {
    company: 'Datadog',
    scenario: 'Monitoring metrics from millions of servers',
    howTheyDoIt: 'Stores 1-second metrics for 24 hours, 1-minute rollups for 30 days, hourly for 1 year. Queries always use the coarsest granularity that satisfies the time range.',
  },

  famousIncident: {
    title: 'Facebook Metrics Outage',
    company: 'Facebook',
    year: '2018',
    whatHappened: 'Their monitoring system stored only raw metrics without pre-aggregation. As infrastructure grew, queries for weekly/monthly graphs started timing out. Engineers couldn\'t see trends. They had to rebuild with continuous aggregation.',
    lessonLearned: 'Pre-aggregation isn\'t optional at scale - it\'s essential for performance.',
    icon: '📈',
  },

  keyPoints: [
    'Compute aggregations in background, not on query',
    'Multiple time windows: 1-min, 1-hour, 1-day',
    'Store: avg, min, max, count for each window',
    'Delete raw data after downsampling to save storage',
  ],

  diagram: `
┌────────────────────────────────────────────────────┐
│         AGGREGATION WINDOWS                        │
├────────────────────────────────────────────────────┤
│                                                    │
│  Raw (5-sec)       1-Min Agg      Hourly Agg      │
│  ────────────      ──────────     ───────────      │
│  10:00:00 → 23.5 ┐                                 │
│  10:00:05 → 23.7 │ Compute                         │
│  10:00:10 → 23.6 ├─▶ 10:00 → avg:23.6  ┐           │
│  ...             │              min:23.5│           │
│  10:00:55 → 23.8 ┘              max:23.8│ Compute   │
│                                 count:12├─▶ 10:00-11:00 → avg:23.4
│  Query "last week"? Scan 168 hourly aggregates    │
│  instead of 2.4 billion raw points!                │
└────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Aggregation Window', explanation: 'Time bucket for grouping: 1-min, 1-hour, 1-day', icon: '⏱️' },
    { title: 'Downsampling', explanation: 'Replace high-res data with lower-res aggregates', icon: '📉' },
    { title: 'Continuous Aggregation', explanation: 'Background job that computes windows automatically', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why pre-compute aggregations instead of computing them on query?',
    options: [
      'Pre-computation is more accurate',
      'Query-time aggregation scans millions of rows (slow), pre-aggregates scan hundreds (fast)',
      'It uses less storage',
      'Databases require it',
    ],
    correctIndex: 1,
    explanation: 'Pre-aggregation trades a little storage for massive query speed improvements. Scanning aggregates is 100-1000x faster than raw data.',
  },
};

const step5: GuidedStep = {
  id: 'iot-ts-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must provide fast aggregated queries over time windows',
    taskDescription: 'Your architecture supports aggregation windows (configured in Time-Series DB)',
    componentsNeeded: [
      { type: 'client', reason: 'IoT sensors', displayName: 'IoT Sensors' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'database', reason: 'Time-series DB with continuous aggregation', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Sensors', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffered writes' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Batched writes & aggregation' },
    ],
    successCriteria: [
      'Your pipeline supports aggregation windows (configured in Time-Series DB)',
      'IoT Sensors → App Server → Queue → Time-Series DB',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Your existing architecture supports aggregation windows via Time-Series DB',
    level2: 'Time-Series DBs like InfluxDB/TimescaleDB have built-in continuous aggregation. Configure retention policies in DB.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Stream Processor - Real-Time Alerting
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "Critical alert! A factory sensor hit 85°C - dangerous territory!",
  hook: "But nobody was notified! Engineers only discovered it 20 minutes later when checking dashboards. By then, equipment was damaged.",
  challenge: "Add real-time alerting: monitor the data stream and fire alerts when sensors breach thresholds.",
  illustration: 'alert-missed',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Real-time alerting is working!",
  achievement: "Alerts fire within 10 seconds of threshold breach",
  metrics: [
    { label: 'Alert latency', before: 'None (manual checks)', after: '< 10 seconds' },
    { label: 'Monitored rules', after: '50+ thresholds' },
  ],
  nextTeaser: "Excellent! Now let's make the system production-ready with HA...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing for Real-Time Alerting',
  conceptExplanation: `**The problem:** Alerts can't wait for data to be written to the database, read back, and checked.

By the time data is in the DB and a batch job checks it:
- 5-30 seconds have passed
- Damage may already be done

**Solution: Stream Processor on the Message Queue**

The stream processor sits on the message queue and checks EVERY data point as it flows by:

\`\`\`python
def check_alerts(data_point):
    # Temperature alert
    if data_point.metric == 'temperature' and data_point.value > 80:
        fire_alert('HIGH_TEMP', data_point)

    # Pressure alert
    if data_point.metric == 'pressure' and data_point.value < 90:
        fire_alert('LOW_PRESSURE', data_point)

    # Offline detection
    if sensor_last_seen(data_point.device_id) > 60:
        fire_alert('SENSOR_OFFLINE', data_point)
\`\`\`

**Architecture:**
1. Sensor sends data → App Server → Message Queue
2. Stream Processor consumes from queue in real-time
3. Checks every point against alert rules
4. Fires alert if threshold breached (< 10 seconds end-to-end)
5. Database consumer also reads from queue (for storage)

**Why separate from storage?**
- Alerting needs speed (< 10s)
- Storage needs durability (batching is fine)
- Two consumers, same queue!`,

  whyItMatters: 'Real-time alerting saves equipment, prevents failures, and protects safety. Batch alerting is too slow.',

  realWorldExample: {
    company: 'Siemens',
    scenario: 'Industrial IoT monitoring for factories',
    howTheyDoIt: 'Uses Apache Flink for stream processing. Monitors 500K+ sensors in real-time. Alerts fire within 5 seconds of anomaly detection.',
  },

  famousIncident: {
    title: 'Boeing 737 MAX Sensors',
    company: 'Boeing',
    year: '2019',
    whatHappened: 'Angle of attack sensors malfunctioned, but the system didn\'t alert pilots quickly enough. Two crashes killed 346 people. Investigation found alerting was too slow and not real-time.',
    lessonLearned: 'For critical systems, real-time alerting isn\'t optional - it saves lives.',
    icon: '✈️',
  },

  keyPoints: [
    'Stream processor consumes from message queue in real-time',
    'Checks every data point against alert rules (< 10 second latency)',
    'Fires alerts to notification service (email, SMS, PagerDuty)',
    'Runs in parallel with database consumer',
  ],

  diagram: `
┌────────────┐    ┌────────────┐    ┌──────────┐
│ IoT Sensor │───▶│ App Server │───▶│  Queue   │
└────────────┘    └────────────┘    └────┬─────┘
                                        ┌─┴─┐
                                        │   │
                    ┌───────────────────┴─┐ │
                    ▼                     ▼ │
              ┌─────────────┐     ┌─────────┴──────┐
              │   Stream    │     │  Time-Series   │
              │  Processor  │     │      DB        │
              │  (Alerting) │     │   (Storage)    │
              └──────┬──────┘     └────────────────┘
                     │
                     ▼
              🚨 Alert fired!
              (< 10 seconds)
`,

  keyConcepts: [
    { title: 'Stream Processing', explanation: 'Process data in real-time as it flows through', icon: '🌊' },
    { title: 'Alert Rule', explanation: 'Condition that triggers notification (temp > 80°C)', icon: '⚠️' },
    { title: 'Dual Consumer', explanation: 'Two services read from same queue (alerting + storage)', icon: '🔀' },
  ],

  quickCheck: {
    question: 'Why use stream processing instead of checking alerts after data is in the database?',
    options: [
      'Stream processing is cheaper',
      'Database writes are batched (slow), stream processing is real-time (fast)',
      'Databases don\'t support alerting',
      'It uses less CPU',
    ],
    correctIndex: 1,
    explanation: 'Stream processing checks data as it flows (< 10s latency). Waiting for batch writes to DB adds 30-60 seconds of delay.',
  },
};

const step6: GuidedStep = {
  id: 'iot-ts-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must fire real-time alerts within 10 seconds of threshold breach',
    taskDescription: 'Add Stream Processor to monitor the message queue for alert conditions',
    componentsNeeded: [
      { type: 'client', reason: 'IoT sensors', displayName: 'IoT Sensors' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'app_server', reason: 'Stream processor for alerting', displayName: 'Stream Processor' },
      { type: 'database', reason: 'Time-series storage', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Sensors', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffered writes' },
      { from: 'Message Queue', to: 'Stream Processor', reason: 'Real-time alert checking' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Batched storage' },
    ],
    successCriteria: [
      'Add Stream Processor consuming from Message Queue',
      'Connect Queue to both Stream Processor (alerting) and Time-Series DB (storage)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Stream Processor as a consumer of the Message Queue (parallel to database consumer)',
    level2: 'Message Queue can have multiple consumers: one for alerting, one for storage',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'message_queue' },
      { type: 'app_server' }, // Stream processor
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const iotTimeSeriesGuidedTutorial: GuidedTutorial = {
  problemId: 'iot-time-series-guided',
  problemTitle: 'Build IoT Time-Series Database - Scale, Compression, Alerts',

  requirementsPhase: iotTimeSeriesRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Time-Series Ingestion',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Ingest time-series data at sustained write rate',
      traffic: { type: 'write', rps: 5000, writeRps: 5000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Time-Range Queries',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Fast queries for recent time ranges',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Aggregation Windows',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Pre-computed aggregations answer queries quickly',
      traffic: { type: 'read', rps: 200, readRps: 200 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: High Write Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 40K writes/sec sustained with fast acknowledgment',
      traffic: { type: 'write', rps: 40000, writeRps: 40000 },
      duration: 60,
      passCriteria: { maxP99Latency: 500, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-S1: Write Burst',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb device reconnection burst (100K writes/sec)',
      traffic: { type: 'write', rps: 100000, writeRps: 100000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-R1: Real-Time Alerting',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Fire alerts within 10 seconds of threshold breach',
      traffic: { type: 'mixed', rps: 10000, readRps: 100, writeRps: 9900 },
      duration: 60,
      passCriteria: { maxAlertLatency: 10000, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-C1: Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet $8,000/month budget with compression and retention policies',
      traffic: { type: 'mixed', rps: 20000, readRps: 200, writeRps: 19800 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 8000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getIotTimeSeriesGuidedTutorial(): GuidedTutorial {
  return iotTimeSeriesGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = iotTimeSeriesRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= iotTimeSeriesRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
