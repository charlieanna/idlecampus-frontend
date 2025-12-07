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
 * IoT Telemetry Aggregation Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching time-series data handling
 * for IoT systems. Build a telemetry platform that collects, aggregates,
 * and stores sensor data at massive scale.
 *
 * Key Concepts:
 * - Time-series data ingestion patterns
 * - Downsampling and aggregation windows
 * - Retention policies and data lifecycle
 * - Write-heavy workloads and batch processing
 * - Hot/warm/cold storage tiers
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic ingestion pipeline - FRs satisfied!
 * Step 3: Add time-series database for efficient storage
 * Steps 4+: Apply NFRs (aggregation, downsampling, retention, cost optimization)
 *
 * Pedagogy: First make it WORK, then make it EFFICIENT, then make it SCALABLE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const iotTelemetryRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an IoT telemetry aggregation system for smart city infrastructure",

  interviewer: {
    name: 'Dr. Maya Patel',
    role: 'Principal IoT Architect',
    avatar: '👩‍🔬',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main operations this IoT system needs to support?",
      answer: "The system needs to:\n1. **Ingest telemetry data** - Accept sensor readings from IoT devices (temperature, pressure, humidity, etc.)\n2. **Store time-series data** - Keep historical readings for analysis\n3. **Query recent data** - Dashboards showing real-time metrics\n4. **Aggregate over time windows** - 1-minute averages, hourly max, daily trends",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "IoT systems are fundamentally about collecting, storing, and querying time-series data",
    },
    {
      id: 'data-freshness',
      category: 'functional',
      question: "How fresh does the data need to be? Real-time or near real-time?",
      answer: "Near real-time is fine - data can be delayed by up to 30 seconds. This isn't a critical safety system. Dashboards updating every 10-30 seconds is acceptable.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Near real-time (seconds) vs real-time (milliseconds) dramatically simplifies architecture",
    },
    {
      id: 'data-retention',
      category: 'functional',
      question: "How long do we need to keep the raw sensor data?",
      answer: "Raw data (1-second granularity): 7 days\n1-minute aggregates: 30 days\nHourly aggregates: 1 year\nDaily aggregates: Forever (or 10 years)\n\nThis is a tiered retention policy - high-resolution data expires quickly, aggregates last longer.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Retention policies prevent storage from growing infinitely - older data gets downsampled",
    },

    // IMPORTANT - Clarifications
    {
      id: 'device-types',
      category: 'clarification',
      question: "What types of sensors are we dealing with? How diverse is the data?",
      answer: "Mostly uniform sensor types:\n- Temperature sensors (Celsius, float)\n- Humidity sensors (%, float)\n- Air quality sensors (PPM, integer)\n- Traffic counters (count, integer)\n\nAll send simple numeric readings with a timestamp. No images, video, or complex payloads.",
      importance: 'important',
      insight: "Simple numeric data makes storage and aggregation much easier",
    },
    {
      id: 'aggregation-types',
      category: 'clarification',
      question: "What kinds of aggregations do users want? Average, max, min, percentiles?",
      answer: "For v1, just basic aggregations:\n- Average (mean)\n- Min/Max\n- Count\n\nPercentiles and complex analytics can come in v2.",
      importance: 'important',
      insight: "Start with simple aggregations (avg, min, max) before complex stats",
    },
    {
      id: 'alerts',
      category: 'clarification',
      question: "Do we need alerting if sensors detect anomalies?",
      answer: "Not for MVP. Alerting is a separate feature that reads from the same data store. Focus on data ingestion and storage first.",
      importance: 'nice-to-have',
      insight: "Alerting can be built on top of the telemetry platform later",
    },

    // SCOPE
    {
      id: 'scope-regions',
      category: 'scope',
      question: "Is this for a single city or multiple regions?",
      answer: "Start with a single metro region (one city). Multi-region can be a later extension.",
      importance: 'important',
      insight: "Single region simplifies the initial design",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT (First - tells you the scale)
    {
      id: 'throughput-devices',
      category: 'throughput',
      question: "How many IoT devices are we talking about?",
      answer: "100,000 active devices (sensors) deployed across the city",
      importance: 'critical',
      learningPoint: "Device count × reporting frequency = write throughput",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How often does each sensor send data?",
      answer: "Each device reports every 10 seconds. So 100,000 devices × 6 readings/minute = 600,000 data points per minute.",
      importance: 'critical',
      calculation: {
        formula: "100K devices × 6 readings/min ÷ 60 sec = 10,000 writes/sec",
        result: "~10,000 writes/sec sustained",
      },
      learningPoint: "IoT systems are write-heavy - constant stream of sensor data",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many dashboard queries per second?",
      answer: "About 100 concurrent dashboard users, each dashboard refreshes every 10 seconds. Plus occasional ad-hoc queries from analysts.",
      importance: 'important',
      calculation: {
        formula: "100 dashboards × 0.1 queries/sec = 10 reads/sec",
        result: "~10-50 reads/sec (read-light workload)",
      },
      learningPoint: "IoT telemetry is write-heavy: 10K writes vs 50 reads (200:1 ratio)",
    },

    // 2. PAYLOAD (Second - affects bandwidth and storage)
    {
      id: 'payload-data-point',
      category: 'payload',
      question: "How big is each sensor reading?",
      answer: "Each data point is small:\n- device_id: 16 bytes (UUID)\n- timestamp: 8 bytes\n- metric_name: ~20 bytes\n- value: 8 bytes (float)\n- Total: ~52 bytes per reading",
      importance: 'important',
      calculation: {
        formula: "10K writes/sec × 52 bytes = 520 KB/sec = 1.8 GB/hour",
        result: "~43 GB/day raw ingestion",
      },
      learningPoint: "Small payloads × high frequency = significant storage over time",
    },
    {
      id: 'payload-storage-growth',
      category: 'payload',
      question: "How fast will storage grow?",
      answer: "At 43 GB/day for raw data:\n- 7 days of raw data: ~300 GB\n- But with aggregation and retention policies, total storage stabilizes around 500 GB - 1 TB",
      importance: 'critical',
      calculation: {
        formula: "43 GB/day × 7 days (retention) = 301 GB steady state",
        result: "~300-500 GB with aggregates",
      },
      learningPoint: "Retention policies prevent infinite storage growth",
    },

    // 3. BURSTS (Third - capacity planning)
    {
      id: 'burst-device-restart',
      category: 'burst',
      question: "What happens if devices lose connectivity and reconnect?",
      answer: "Devices buffer readings locally for up to 1 hour. When they reconnect, they dump all buffered data at once. This can cause write spikes of 5-10x normal.",
      importance: 'important',
      insight: "Need write buffering and backpressure handling for reconnection storms",
    },
    {
      id: 'burst-peak',
      category: 'burst',
      question: "Are there daily traffic patterns or is it steady?",
      answer: "Pretty steady - sensors report 24/7. No real peak/off-peak. Bursts come from device reconnections, not time-of-day.",
      importance: 'important',
      insight: "Unlike user-facing apps, IoT is steady 24/7 with occasional burst patterns",
    },

    // 4. LATENCY (Fourth - response time requirements)
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "How fast must we acknowledge sensor data writes?",
      answer: "Devices expect acknowledgment within 1 second. They'll retry if no ack. But the data doesn't have to be queryable immediately - that can take 10-30 seconds.",
      importance: 'critical',
      learningPoint: "Write latency (ack) vs query latency (visibility) are different!",
    },
    {
      id: 'latency-query',
      category: 'latency',
      question: "What's acceptable for dashboard query latency?",
      answer: "Queries should return in under 2 seconds. Dashboards are human-facing, not real-time control systems.",
      importance: 'important',
      learningPoint: "Analytics queries can be slower than transactional systems",
    },
    {
      id: 'latency-aggregation',
      category: 'latency',
      question: "Do aggregations need to be real-time or can they be batch computed?",
      answer: "Batch is fine! Aggregations can run every 1-5 minutes in the background. Users don't need per-second aggregates.",
      importance: 'critical',
      insight: "Batch aggregation is much simpler and cheaper than real-time streaming",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'data-retention', 'throughput-writes'],
  criticalFRQuestionIds: ['core-operations', 'data-freshness', 'data-retention'],
  criticalScaleQuestionIds: ['throughput-writes', 'throughput-reads', 'latency-ingestion', 'latency-aggregation'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Ingest sensor data',
      description: 'Accept telemetry readings from 100K IoT devices at 10K writes/sec',
      emoji: '📡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Query recent data',
      description: 'Dashboards can query recent sensor readings (last 7 days)',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Aggregate over time windows',
      description: 'Compute 1-min, 1-hour, and daily aggregates (avg, min, max)',
      emoji: '📈',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Retention policies',
      description: 'Automatically expire old data: raw (7d), 1-min (30d), hourly (1y), daily (forever)',
      emoji: '🗄️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 dashboard users',
    writesPerDay: '864 million data points',
    readsPerDay: 'Minimal (10-50 queries/sec)',
    peakMultiplier: 1.5, // Steady IoT traffic, slight bursts
    readWriteRatio: '1:200 (write-heavy)',
    calculatedWriteRPS: { average: 10000, peak: 15000 },
    calculatedReadRPS: { average: 25, peak: 50 },
    maxPayloadSize: '~52 bytes per reading',
    storagePerRecord: '~52 bytes raw + indexes',
    storageGrowthPerYear: '~300-500 GB steady state (with retention)',
    redirectLatencySLA: 'Write ack: < 1s, Query: < 2s',
    createLatencySLA: 'Aggregations: batch (1-5 min)',
  },

  architecturalImplications: [
    '✅ Write-heavy (200:1) → Time-series DB optimized for writes',
    '✅ 10K writes/sec sustained → Need write buffering and batching',
    '✅ Small payloads (52 bytes) → Compression essential',
    '✅ Retention policies → Automated downsampling and deletion',
    '✅ Aggregations can be batched → Use scheduled jobs, not real-time',
    '✅ Query patterns: recent data + time-range scans',
  ],

  outOfScope: [
    'Real-time alerting (v2)',
    'Complex analytics (percentiles, ML)',
    'Multi-region deployment',
    'Device management and provisioning',
    'Data backfill from offline devices',
  ],

  keyInsight: "First, let's build a basic ingestion pipeline that accepts sensor data and stores it. We'll start simple with direct writes, then optimize with batching, aggregation, and retention policies. Functionality first, efficiency second!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Devices to Ingestion API
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌆',
  scenario: "Welcome to SmartCity IoT! You've been hired to build the telemetry platform.",
  hook: "100,000 sensors across the city are ready to report data - temperature, air quality, traffic counts. They're waiting for your API!",
  challenge: "Set up the basic ingestion flow so IoT devices can send their sensor readings to your server.",
  illustration: 'iot-devices',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your IoT platform is receiving data!",
  achievement: "Sensors can now send telemetry to your ingestion API",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting sensor data', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know what to do with the data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'IoT Data Ingestion: The Entry Point',
  conceptExplanation: `Every IoT system starts with **data ingestion** - accepting sensor readings from devices.

Your IoT devices send HTTP POST requests with telemetry:
\`\`\`json
{
  "device_id": "sensor-42",
  "timestamp": "2024-01-15T10:30:00Z",
  "temperature": 23.5,
  "humidity": 65.2
}
\`\`\`

The **App Server** receives these readings and (for now) acknowledges receipt. In later steps, we'll store and process them.`,

  whyItMatters: 'Without an ingestion API, sensors have nowhere to send data. This is the entry point for ALL telemetry.',

  keyPoints: [
    'IoT devices send data via HTTP POST to your ingestion endpoint',
    'Server must quickly acknowledge (< 1s) so devices don\'t retry',
    'Data validation happens at ingestion: reject malformed readings',
  ],

  diagram: `
┌──────────────┐         ┌─────────────────┐
│ IoT Devices  │ ──────▶ │   App Server    │
│  (100,000)   │  POST   │ (Ingestion API) │
│              │ ◀────── │                 │
└──────────────┘   ACK   └─────────────────┘
`,

  keyConcepts: [
    {
      title: 'Ingestion API',
      explanation: 'HTTP endpoint that accepts sensor data: POST /api/v1/telemetry',
      icon: '📡',
    },
    {
      title: 'Acknowledgment',
      explanation: 'Quick response (200 OK) so devices know data was received',
      icon: '✅',
    },
  ],

  quickCheck: {
    question: 'Why must the ingestion API respond quickly (< 1s)?',
    options: [
      'To make dashboards load faster',
      'So devices don\'t timeout and retry, causing duplicate data',
      'To save bandwidth',
      'It doesn\'t matter - devices will wait',
    ],
    correctIndex: 1,
    explanation: 'Devices have timeout limits. Slow acks cause retries, leading to duplicate data and wasted resources.',
  },
};

const step1: GuidedStep = {
  id: 'iot-telemetry-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'IoT devices can send telemetry to the system',
    taskDescription: 'Add Client (representing IoT devices) and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents 100K IoT sensors', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Runs ingestion API', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'App Server', reason: 'Sensors POST telemetry data' },
    ],
    successCriteria: ['Add IoT Devices (Client)', 'Add App Server', 'Connect IoT Devices → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client (IoT devices), then add App Server, then connect them',
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
  scenario: "Your App Server is connected, but it's an empty shell - sensors are sending data but getting errors!",
  hook: "You need to implement the Python handler that receives sensor readings, validates them, and acknowledges receipt.",
  challenge: "Configure the ingestion API and write the Python code to handle telemetry data points.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your ingestion API is functional!",
  achievement: "Sensors successfully send telemetry and receive acknowledgments",
  metrics: [
    { label: 'API configured', after: 'POST /api/v1/telemetry' },
    { label: 'Handler implemented', after: '✓ Working' },
  ],
  nextTeaser: "But where is the data going? When the server restarts, everything vanishes!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Ingestion Handler: Validating and Buffering Data',
  conceptExplanation: `Your App Server needs to implement the ingestion endpoint in Python!

**POST /api/v1/telemetry** — You'll implement this handler

The handler must:
1. **Validate** the incoming data (required fields, data types)
2. **Buffer** readings in memory (for now - database comes next)
3. **Acknowledge** quickly (return 200 OK)

**Example Python handler:**
\`\`\`python
def ingest_telemetry(request):
    data = request.json
    # Validate required fields
    if not all(k in data for k in ['device_id', 'timestamp', 'value']):
        return {'error': 'Missing fields'}, 400

    # Store in memory buffer (temporary!)
    buffer.append(data)

    # Quick acknowledgment
    return {'status': 'received'}, 200
\`\`\`

**By the end of this step:**
✅ API endpoint configured
✅ Python handler validates and buffers data
✅ Devices receive fast acknowledgments`,

  whyItMatters: 'Without the handler code, your server is just a hollow box. This is where the actual ingestion logic lives!',

  keyPoints: [
    'Validate data at the edge - reject bad data early',
    'In-memory buffer for now (we\'ll add database in Step 3)',
    'Return 200 OK quickly - processing can happen async',
    'Log invalid data for debugging',
  ],

  diagram: `
POST /api/v1/telemetry
┌──────────────────────────────────────────────┐
│ Request: {                                   │
│   "device_id": "sensor-42",                  │
│   "timestamp": "2024-01-15T10:30:00Z",       │
│   "temperature": 23.5                        │
│ }                                            │
│                                              │
│ Handler: Validate → Buffer → ACK            │
│                                              │
│ Response: { "status": "received" } (200 OK) │
└──────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Validation', explanation: 'Check required fields and data types before storing', icon: '✔️' },
    { title: 'Buffering', explanation: 'Temporary in-memory storage before database write', icon: '📦' },
    { title: 'Fast ACK', explanation: 'Respond immediately, process async', icon: '⚡' },
  ],

  quickCheck: {
    question: 'Why validate data at ingestion rather than later?',
    options: [
      'It\'s faster to validate early',
      'Reject bad data early to avoid polluting storage and analytics',
      'It\'s required by HTTP spec',
      'Validation doesn\'t matter',
    ],
    correctIndex: 1,
    explanation: 'Invalid data in your database corrupts analytics. Validate and reject at the edge!',
  },
};

const step2: GuidedStep = {
  id: 'iot-telemetry-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle telemetry ingestion with Python code',
    taskDescription: 'Re-use your IoT Devices → App Server, then configure API and implement the Python handler',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Configure API and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/telemetry API',
      'Open Python tab and implement ingest_telemetry() handler',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure API, then switch to Python tab to write handler',
    level2: 'After assigning POST /api/v1/telemetry in the inspector, open Python editor and implement the TODO sections',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Time-Series Database - Data Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes! The server crashed overnight during a maintenance window.",
  hook: "When it restarted, ALL sensor data from the past 24 hours is GONE. Engineers can't view historical trends. The mayor is asking questions!",
  challenge: "Data was only buffered in RAM. We need a time-series database to persist telemetry durably!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your telemetry data is now durable!",
  achievement: "Sensor readings persist forever (until retention policies delete them)",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted to disk' },
    { label: 'Storage', after: 'Time-Series Database' },
  ],
  nextTeaser: "Great! But queries are slow, and storage is growing fast...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Databases: Built for Telemetry',
  conceptExplanation: `Regular databases (PostgreSQL, MySQL) aren't optimized for time-series data.

**Why time-series databases are different:**

| Feature | Regular DB | Time-Series DB |
|---------|-----------|----------------|
| Write pattern | Random updates | Append-only (no updates) |
| Query pattern | Lookup by ID | Time-range scans |
| Compression | Generic | Time-aware (delta encoding) |
| Retention | Manual deletion | Automatic downsampling |
| Aggregation | Slow (full scan) | Fast (pre-computed) |

**Popular time-series databases:**
- **InfluxDB** - Easy to use, great for metrics
- **TimescaleDB** - PostgreSQL extension, SQL familiar
- **Prometheus** - Pull-based, great for monitoring
- **Amazon Timestream** - Fully managed, serverless

**For IoT telemetry:** Use InfluxDB or TimescaleDB
- Optimized for high write throughput (10K writes/sec)
- Built-in downsampling and retention policies
- Efficient compression (10x better than regular DBs)`,

  whyItMatters: 'Time-series DBs are 10-100x more efficient for telemetry workloads than general databases.',

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Collecting telemetry from millions of vehicles',
    howTheyDoIt: 'Uses time-series databases to store vehicle sensor data. Each car sends 1000s of metrics per minute. Time-series DBs compress this efficiently.',
  },

  famousIncident: {
    title: 'Uber\'s Schemaless Migration',
    company: 'Uber',
    year: '2016',
    whatHappened: 'Uber initially stored trip metrics in MySQL. As they scaled to millions of trips/day, queries slowed to minutes and storage exploded. They had to migrate to a custom time-series store (Schemaless) which reduced storage by 80% and improved query speed by 100x.',
    lessonLearned: 'Use the right database for your workload. Time-series data needs time-series databases.',
    icon: '🚗',
  },

  keyPoints: [
    'Time-series DBs optimize for append-only writes (sensors never update old data)',
    'Automatic compression: delta encoding for timestamps and values',
    'Built-in retention: old data auto-expires or gets downsampled',
    'Fast time-range queries: "Give me all readings from sensor-42 in the last hour"',
  ],

  diagram: `
┌──────────────┐       ┌─────────────┐       ┌────────────────┐
│ IoT Devices  │ ────▶ │ App Server  │ ────▶ │  Time-Series   │
│  (100K)      │       │ (Ingestion) │       │   Database     │
└──────────────┘       └─────────────┘       │                │
                                             │ sensor-42:     │
                                             │  10:30 → 23.5  │
                                             │  10:31 → 23.7  │
                                             │  10:32 → 23.6  │
                                             └────────────────┘
`,

  keyConcepts: [
    { title: 'Append-Only', explanation: 'New data is always appended, never updated', icon: '➕' },
    { title: 'Time-Range Scan', explanation: 'Queries filter by time windows', icon: '📅' },
    { title: 'Compression', explanation: 'Delta encoding: store differences, not full values', icon: '🗜️' },
  ],

  quickCheck: {
    question: 'Why are time-series databases better for IoT than PostgreSQL?',
    options: [
      'They\'re newer technology',
      'Optimized for append-only writes and time-range queries',
      'They\'re cheaper',
      'They support more data types',
    ],
    correctIndex: 1,
    explanation: 'Time-series DBs are purpose-built for append-only telemetry and time-range scans. PostgreSQL is general-purpose.',
  },
};

const step3: GuidedStep = {
  id: 'iot-telemetry-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Telemetry data must persist durably in time-series storage',
    taskDescription: 'Build IoT Devices → App Server → Time-Series Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents IoT sensors', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'database', reason: 'Time-series storage (InfluxDB/TimescaleDB)', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'App Server', reason: 'Sensors send telemetry' },
      { from: 'App Server', to: 'Time-Series DB', reason: 'Server writes to DB' },
    ],
    successCriteria: ['Add all three components', 'Connect IoT Devices → App Server → Time-Series DB'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full pipeline: IoT Devices → App Server → Time-Series Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Message Queue - Handling Write Bursts
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📊',
  scenario: "Traffic is spiking! A power outage just ended and 50,000 devices reconnected simultaneously.",
  hook: "Each device is dumping 1 hour of buffered data. Your App Server is overwhelmed - writes are timing out, devices are retrying, everything is on fire!",
  challenge: "We need a buffer between ingestion and database writes to handle bursty traffic smoothly.",
  illustration: 'traffic-spike',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your system now handles write bursts!",
  achievement: "Message queue buffers bursty writes smoothly",
  metrics: [
    { label: 'Write burst capacity', before: '10K/sec (crashes at 20K)', after: '100K/sec buffered' },
    { label: 'Database load', before: 'Spikey, overloaded', after: 'Smooth, controlled' },
  ],
  nextTeaser: "Nice! But storage is growing out of control...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Buffering Bursty Writes',
  conceptExplanation: `**The problem:** IoT devices reconnect in waves, causing write spikes.

Your database can handle 10K steady writes/sec, but device reconnections cause 50K writes/sec spikes. The DB chokes.

**Solution: Message Queue (Apache Kafka, RabbitMQ, AWS Kinesis)**

The queue acts as a shock absorber:
1. **App Server** quickly writes to the queue (fast, in-memory)
2. **Queue** buffers millions of messages durably
3. **Consumer** reads from queue at DB's comfortable pace (10K/sec)

**Benefits:**
- **Decouple** ingestion speed from DB write speed
- **Buffer** millions of messages during bursts
- **Backpressure** - queue grows, but doesn't crash
- **Replay** - reprocess data if needed

**For IoT:** Use Apache Kafka or AWS Kinesis
- High throughput (100K+ writes/sec)
- Durable (replicated across nodes)
- Time-based retention (keep data for 7 days)`,

  whyItMatters: 'Without a queue, write bursts crash your database. The queue buffers spikes and smooths writes.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Processing billions of viewing events per day',
    howTheyDoIt: 'Uses Apache Kafka to buffer user viewing events (play, pause, stop). Consumers aggregate these into watch history and recommendations. Kafka handles spikes when popular shows drop.',
  },

  famousIncident: {
    title: 'Robinhood Trading Outage',
    company: 'Robinhood',
    year: '2020',
    whatHappened: 'During extreme market volatility, trade orders spiked 10x. Their database couldn\'t keep up. Without proper queuing, orders failed and users couldn\'t trade for 2 days. The company was fined $65 million.',
    lessonLearned: 'Always use queues to buffer bursty writes. Never directly slam your database with unbounded traffic.',
    icon: '📉',
  },

  keyPoints: [
    'Message queue sits between App Server and Database',
    'App Server writes to queue (fast) instead of DB (slow)',
    'Consumer reads from queue and writes to DB at controlled rate',
    'Queue buffers bursts - prevents database overload',
  ],

  diagram: `
┌────────────┐    ┌────────────┐    ┌──────────┐    ┌─────────────┐
│ IoT Device │───▶│ App Server │───▶│  Queue   │───▶│ Time-Series │
│  (Burst)   │    │ (Ingest)   │    │ (Kafka)  │    │     DB      │
└────────────┘    └────────────┘    └──────────┘    └─────────────┘
  50K writes/sec    Fast ACK         Buffer        Smooth 10K/sec
`,

  keyConcepts: [
    { title: 'Buffering', explanation: 'Queue stores messages temporarily during bursts', icon: '📦' },
    { title: 'Decoupling', explanation: 'Ingestion speed ≠ DB write speed', icon: '🔗' },
    { title: 'Backpressure', explanation: 'Queue grows instead of crashing', icon: '⚠️' },
  ],

  quickCheck: {
    question: 'Why add a message queue instead of scaling the database?',
    options: [
      'Queues are cheaper than databases',
      'Queues buffer bursts so you can use smaller, cheaper databases',
      'Databases don\'t support writes',
      'It doesn\'t matter',
    ],
    correctIndex: 1,
    explanation: 'Queues absorb bursts so your DB handles average load, not peak. This saves money and improves reliability.',
  },
};

const step4: GuidedStep = {
  id: 'iot-telemetry-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'System must handle write bursts without crashing',
    taskDescription: 'Add Message Queue between App Server and Time-Series DB',
    componentsNeeded: [
      { type: 'client', reason: 'IoT sensors', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers write bursts', displayName: 'Message Queue' },
      { type: 'database', reason: 'Time-series storage', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'App Server', reason: 'Sensors send telemetry' },
      { from: 'App Server', to: 'Message Queue', reason: 'Fast writes to queue' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Consumer writes at controlled rate' },
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
// STEP 5: Implement Downsampling - Aggregation Windows
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Engineers want to see trends! They're asking for hourly averages and daily summaries.",
  hook: "Querying raw data for 'average temperature last week' takes 30 seconds - it scans millions of records!",
  challenge: "Pre-compute aggregations! Store 1-minute averages, hourly summaries, and daily rollups alongside raw data.",
  illustration: 'data-aggregation',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Queries are lightning fast!",
  achievement: "Pre-aggregated data answers queries in milliseconds instead of seconds",
  metrics: [
    { label: 'Query time (daily avg)', before: '30 seconds', after: '10 milliseconds' },
    { label: 'Storage efficiency', before: '100%', after: '10% (with compression)' },
  ],
  nextTeaser: "Great! But we're still storing raw data forever...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Downsampling: The Secret to Efficient Time-Series',
  conceptExplanation: `**The problem:** Storing every 10-second reading forever is wasteful.

Users care about different granularities over time:
- **Last hour:** 10-second data (real-time detail)
- **Last day:** 1-minute averages (recent trends)
- **Last month:** 1-hour averages (historical patterns)
- **Last year:** Daily aggregates (long-term trends)

**Downsampling** = Pre-computing aggregations at different time windows

**How it works:**
1. **Raw data** comes in every 10 seconds → store for 24 hours
2. **Background job** runs every minute:
   - Reads last minute of raw data
   - Computes: avg, min, max, count
   - Writes to "1-min aggregates" table
3. **Hourly job** aggregates 1-min data → 1-hour aggregates
4. **Daily job** aggregates hourly data → daily aggregates

**Benefits:**
- **Fast queries** - scan 1440 hourly records instead of 8.6M raw records
- **Storage savings** - 100x compression for older data
- **Better UX** - dashboards load instantly

**InfluxDB / TimescaleDB** have built-in continuous aggregates!`,

  whyItMatters: 'Without downsampling, queries get slower as data grows. Pre-aggregation keeps queries fast forever.',

  realWorldExample: {
    company: 'Datadog',
    scenario: 'Monitoring metrics from millions of servers',
    howTheyDoIt: 'Stores 1-second metrics for 24 hours, 1-minute rollups for 30 days, hourly for 1 year. This keeps storage constant while maintaining fast queries.',
  },

  famousIncident: {
    title: 'Google\'s Monarch Monitoring',
    company: 'Google',
    year: '2015',
    whatHappened: 'Google\'s internal monitoring system stored raw metrics forever. As their infrastructure grew, queries slowed to minutes. They built Monarch with aggressive downsampling: 1-sec → 1-min → 1-hour → 1-day. Query times dropped from minutes to milliseconds.',
    lessonLearned: 'Downsampling isn\'t optional at scale - it\'s essential for performance and cost.',
    icon: '📊',
  },

  keyPoints: [
    'Pre-compute aggregations at multiple time windows (1-min, 1-hour, daily)',
    'Use background jobs or continuous aggregation (InfluxDB, TimescaleDB)',
    'Store: avg, min, max, count (or sum for counters)',
    'Delete raw data after downsampling to save storage',
  ],

  diagram: `
┌────────────────────────────────────────────────────┐
│            DOWNSAMPLING PIPELINE                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  Raw Data (10-sec)      1-Min Agg      Hourly Agg │
│  ─────────────────      ──────────     ────────── │
│  10:00:00 → 23.5   ┐                              │
│  10:00:10 → 23.7   │ Compute avg                  │
│  10:00:20 → 23.6   ├─▶ 10:00 → 23.6  ┐            │
│  10:00:30 → 23.8   │                 │            │
│  10:00:40 → 23.4   │                 │ Compute avg│
│  10:00:50 → 23.7   ┘                 ├─▶ 10:00-11:00 → 23.5
│                                      │            │
│  Retention: 24 hours  Retention: 30d │ Retention: 1yr
└────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Aggregation Window', explanation: 'Time period to group data: 1-min, 1-hour, 1-day', icon: '⏱️' },
    { title: 'Rollup', explanation: 'Combine fine-grained data into coarser summaries', icon: '📊' },
    { title: 'Continuous Aggregation', explanation: 'Auto-compute aggregates as data arrives', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why pre-compute aggregations instead of computing them on query?',
    options: [
      'Pre-computation is more accurate',
      'Query-time aggregation scans millions of rows (slow), pre-aggregates scan hundreds (fast)',
      'It uses less storage',
      'Databases don\'t support query-time aggregation',
    ],
    correctIndex: 1,
    explanation: 'Pre-aggregation trades storage (small) for query speed (huge). Scanning pre-aggregated data is 100-1000x faster.',
  },
};

const step5: GuidedStep = {
  id: 'iot-telemetry-step-5',
  stepNumber: 5,
  frIndex: 2,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must provide fast aggregated queries over time windows',
    taskDescription: 'Your architecture should support downsampling (conceptual - configured in Time-Series DB)',
    componentsNeeded: [
      { type: 'client', reason: 'IoT sensors', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'database', reason: 'Time-series DB with continuous aggregation', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'App Server', reason: 'Sensors send telemetry' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffered writes' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Persists and aggregates' },
    ],
    successCriteria: [
      'Your pipeline supports downsampling (configured in Time-Series DB settings)',
      'IoT Devices → App Server → Queue → Time-Series DB',
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
    level1: 'Your existing architecture supports downsampling via Time-Series DB configuration',
    level2: 'Time-Series DBs like InfluxDB/TimescaleDB have built-in continuous aggregation. Configure retention policies in DB settings.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Configure Retention Policies - Data Lifecycle
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💰',
  scenario: "Your CFO just sent an urgent email: 'Storage costs are $50K/month and growing!'",
  hook: "You're storing 6 months of raw 10-second data. That's 259 billion data points! Storage is exploding!",
  challenge: "Configure retention policies to automatically delete old data. Raw data expires after 7 days, aggregates last longer.",
  illustration: 'storage-explosion',
};

const step6Celebration: CelebrationContent = {
  emoji: '📉',
  message: "Storage costs stabilized!",
  achievement: "Automatic retention policies keep storage constant",
  metrics: [
    { label: 'Monthly storage cost', before: '$50,000 (growing)', after: '$3,000 (stable)' },
    { label: 'Storage size', before: '50 TB (unbounded)', after: '500 GB (steady state)' },
  ],
  nextTeaser: "Perfect! Now let's add caching for fast dashboard queries...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Retention Policies: Preventing Infinite Storage',
  conceptExplanation: `**The problem:** Without retention policies, storage grows forever.

At 43 GB/day, you'll have 15.7 TB after 1 year. After 5 years? 78 TB!

**Solution: Tiered Retention Policy**

Delete data based on age and granularity:

| Data Tier | Retention | Why |
|-----------|-----------|-----|
| Raw (10-sec) | 7 days | Recent debugging needs detail |
| 1-min aggregates | 30 days | Recent trends |
| Hourly aggregates | 1 year | Historical analysis |
| Daily aggregates | Forever (10 years) | Long-term patterns |

**How it works:**
1. **Raw data** older than 7 days → automatically deleted
2. **1-min aggregates** older than 30 days → deleted (hourly still exists)
3. **Hourly aggregates** older than 1 year → deleted (daily still exists)
4. **Daily aggregates** kept forever (or 10 years)

**Storage calculation:**
- Raw (7 days): 43 GB × 7 = 301 GB
- 1-min (30 days): ~15 GB
- Hourly (1 year): ~20 GB
- Daily (10 years): ~2 GB
- **Total: ~340 GB steady state** (vs 78 TB without retention!)

**Time-Series DBs** automate this with retention policies!`,

  whyItMatters: 'Retention policies turn unbounded growth into steady-state storage. Critical for cost control!',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Storing trip telemetry from millions of trips',
    howTheyDoIt: 'Trip GPS pings stored for 7 days at 1-second resolution, then downsampled to 1-minute for 90 days, then deleted. Aggregated trip summaries kept forever.',
  },

  famousIncident: {
    title: 'AWS S3 Pricing Shock',
    company: 'Pinterest',
    year: '2012',
    whatHappened: 'Pinterest stored all images forever without lifecycle policies. Their AWS S3 bill grew to $50K/month. They implemented retention policies: delete unused images after 6 months, move old images to Glacier. Bill dropped to $5K/month.',
    lessonLearned: 'Storage policies aren\'t optional - they\'re cost control. Automate deletion before the bill surprises you.',
    icon: '💸',
  },

  keyPoints: [
    'Retention policy = automatic deletion based on age',
    'Tiered retention: raw data expires fast, aggregates last longer',
    'Time-Series DBs automate retention (InfluxDB, TimescaleDB)',
    'Configure retention when creating the database, not later!',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         TIERED RETENTION POLICY                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Time    Raw (10s)   1-min    Hourly   Daily   │
│  ──────  ─────────   ──────   ──────   ──────  │
│  Today      ✓         ✓         ✓       ✓      │
│  3 days     ✓         ✓         ✓       ✓      │
│  8 days    ❌         ✓         ✓       ✓      │
│  31 days   ❌        ❌         ✓       ✓      │
│  400 days  ❌        ❌        ❌       ✓      │
│                                                 │
│  Storage: 301GB + 15GB + 20GB + 2GB = 338 GB   │
└─────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Retention Policy', explanation: 'Automatic deletion of old data', icon: '🗑️' },
    { title: 'Tiered Retention', explanation: 'Different retention for different granularities', icon: '🎯' },
    { title: 'Steady State', explanation: 'Storage size stabilizes instead of growing forever', icon: '📊' },
  ],

  quickCheck: {
    question: 'Why keep daily aggregates forever but delete raw data after 7 days?',
    options: [
      'Daily data is smaller and still useful for long-term trends',
      'Raw data is corrupted after 7 days',
      'It\'s required by law',
      'Databases can\'t store raw data long-term',
    ],
    correctIndex: 0,
    explanation: 'Daily aggregates are tiny (365 records/year) and show long-term patterns. Raw data is huge and only needed for recent debugging.',
  },
};

const step6: GuidedStep = {
  id: 'iot-telemetry-step-6',
  stepNumber: 6,
  frIndex: 3,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must automatically expire old data per retention policy',
    taskDescription: 'Configure retention policies in Time-Series DB (conceptual configuration)',
    componentsNeeded: [
      { type: 'client', reason: 'IoT sensors', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Ingestion API', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'database', reason: 'Time-Series DB with retention policies', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'IoT Devices', to: 'App Server', reason: 'Sensors send telemetry' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffered writes' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Persists with auto-expiration' },
    ],
    successCriteria: [
      'Your architecture supports tiered retention policies (configured in Time-Series DB)',
      'IoT Devices → App Server → Queue → Time-Series DB',
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
    level1: 'Retention policies are configured in the Time-Series DB settings',
    level2: 'Time-Series DBs like InfluxDB support automatic retention: raw (7d), 1-min (30d), hourly (1y), daily (forever)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Cache for Fast Dashboard Queries
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🐢',
  scenario: "Dashboard users are complaining! 'Why does it take 5 seconds to load?'",
  hook: "Every dashboard refresh queries the Time-Series DB. Popular queries (city-wide temperature average) hit the DB hundreds of times per minute!",
  challenge: "Add a cache layer to serve popular queries from memory instead of hitting the database every time.",
  illustration: 'slow-queries',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Dashboards load instantly!",
  achievement: "Cache serves 95% of queries in milliseconds",
  metrics: [
    { label: 'Dashboard load time', before: '5 seconds', after: '100 milliseconds' },
    { label: 'DB query load', before: '500 queries/min', after: '25 queries/min' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Excellent! Now let's make sure the system scales horizontally...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Time-Series Queries',
  conceptExplanation: `**The problem:** Popular dashboard queries hammer the database.

Query: "Average temperature across all sensors in the last hour"
- Scans 360,000 data points (100K devices × 6 readings/min × 60 min)
- Takes 500ms to compute
- Requested 200 times/minute by dashboard users

**Solution: Cache aggregated results**

Use **Redis** to cache query results:
- Key: \`avg_temp_last_hour\`
- Value: \`23.4°C\`
- TTL: 60 seconds

**How it works:**
1. User queries "avg temp last hour"
2. Check Redis: HIT → return cached value (2ms)
3. If MISS → query Time-Series DB (500ms) → cache result → return
4. Cache expires after 60 seconds, forcing refresh

**What to cache:**
- ✅ Popular aggregations (city-wide averages)
- ✅ Recent time-ranges (last hour, last day)
- ✅ Dashboard queries (top 10 hottest sensors)
- ❌ Don't cache: raw per-device queries (too many keys)

**Cache invalidation:**
Time-series data is append-only, so simple TTL works!`,

  whyItMatters: 'Caching reduces DB load by 95% and makes dashboards 50x faster.',

  realWorldExample: {
    company: 'New Relic',
    scenario: 'Monitoring dashboards querying application metrics',
    howTheyDoIt: 'Caches popular aggregation queries (p99 latency, error rate) with 10-second TTL. Cache hit rate: 98%. Database load reduced by 50x.',
  },

  keyPoints: [
    'Cache aggregated queries (averages, sums), not raw data',
    'Use TTL to auto-refresh (30-60 seconds for near real-time)',
    'Cache popular queries only (Pareto: 20% of queries = 80% of traffic)',
    'Time-series data is append-only → simple cache invalidation',
  ],

  diagram: `
┌──────────┐   ┌───────────────┐   ┌──────────┐
│Dashboard │──▶│ Cache (Redis) │──▶│Time-Series│
│  Query   │◀──│  (95% hits)   │◀──│    DB     │
└──────────┘   └───────────────┘   └──────────┘
    │                 │
    │ 1. Check cache  │
    │ ◀───────────────┘
    │ 2a. HIT → return (2ms)
    │
    │ 2b. MISS → query DB (500ms)
    │                 │
    │ 3. Cache result │
    │ ◀───────────────┘
`,

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, query DB on miss', icon: '🎯' },
    { title: 'TTL', explanation: 'Time-To-Live: cache expires after N seconds', icon: '⏱️' },
    { title: 'Cache Hit Rate', explanation: '% of queries served from cache (aim for 90%+)', icon: '📊' },
  ],

  quickCheck: {
    question: 'Why use TTL-based cache invalidation instead of invalidating on new data?',
    options: [
      'TTL is easier to implement',
      'Time-series data arrives constantly - invalidating on every write would clear cache constantly',
      'TTL is more accurate',
      'Databases don\'t support invalidation',
    ],
    correctIndex: 1,
    explanation: 'New data arrives every second. Invalidating on write would nuke the cache constantly. TTL (30-60s) provides near real-time data with high hit rates.',
  },
};

const step7: GuidedStep = {
  id: 'iot-telemetry-step-7',
  stepNumber: 7,
  frIndex: 4,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Dashboard queries must be fast (< 100ms)',
    taskDescription: 'Add Cache (Redis) to serve popular queries',
    componentsNeeded: [
      { type: 'client', reason: 'IoT sensors + Dashboard users', displayName: 'Clients' },
      { type: 'app_server', reason: 'Ingestion + Query API', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'cache', reason: 'Caches aggregated queries', displayName: 'Cache (Redis)' },
      { type: 'database', reason: 'Time-Series DB', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'Clients', to: 'App Server', reason: 'IoT writes + Dashboard reads' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffered writes' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache before DB' },
      { from: 'App Server', to: 'Time-Series DB', reason: 'Query on cache miss' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Persist telemetry' },
    ],
    successCriteria: [
      'Add Cache (Redis) component',
      'Connect App Server to Cache and Time-Series DB',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'message_queue', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Cache component and connect App Server to it',
    level2: 'Insert Cache: App Server should connect to both Cache (for queries) and Queue (for writes)',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'message_queue' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'cache' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 8: Scale with Load Balancer - Production Ready
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚀',
  scenario: "Success! Your system is deployed and handling 100K devices smoothly.",
  hook: "But the city wants to expand to 500K devices next year. Also, your single App Server is a single point of failure!",
  challenge: "Add Load Balancer and multiple App Server instances for horizontal scaling and high availability.",
  illustration: 'scale-out',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your IoT platform is production-ready!",
  achievement: "System scales horizontally and survives server failures",
  metrics: [
    { label: 'Capacity', before: '100K devices', after: '500K+ devices (scalable)' },
    { label: 'Availability', before: 'Single point of failure', after: '99.9% uptime' },
    { label: 'App Server instances', before: '1', after: '3+ (auto-scaling)' },
  ],
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling for IoT Workloads',
  conceptExplanation: `**The problem:** One App Server can't handle 500K devices (50K writes/sec).

**Solution: Load Balancer + Multiple App Servers**

The Load Balancer:
1. Receives ALL incoming traffic (from IoT devices and dashboards)
2. Distributes requests across multiple App Servers
3. Health checks: removes failed servers automatically
4. Enables zero-downtime deployments

**For IoT:**
- App Servers are **stateless** (no local storage)
- Any server can handle any device's data
- Scale horizontally: 3 servers → 30K writes/sec, 10 servers → 100K writes/sec
- Queue and DB are shared across all servers

**Auto-scaling rules:**
- If CPU > 70% → spin up more App Servers
- If CPU < 30% → shut down excess servers
- Typical: 3-10 App Servers for 100K-500K devices`,

  whyItMatters: 'Horizontal scaling + Load Balancer = unlimited capacity and high availability.',

  realWorldExample: {
    company: 'Ring (Amazon)',
    scenario: 'Handling millions of doorbell cameras',
    howTheyDoIt: 'Uses AWS Auto Scaling Groups behind Application Load Balancers. During peak (evenings), scales from 50 to 500 servers. At night, scales back down to save cost.',
  },

  famousIncident: {
    title: 'Nest Thermostat Outage',
    company: 'Nest',
    year: '2016',
    whatHappened: 'Nest thermostats lost connectivity for 24 hours. Their single API server crashed. Millions of homes couldn\'t control heating/cooling. No load balancer, no redundancy.',
    lessonLearned: 'IoT systems must be highly available - people depend on them for critical services. Always use load balancers and multiple servers.',
    icon: '🌡️',
  },

  keyPoints: [
    'Load Balancer distributes traffic across multiple App Servers',
    'App Servers are stateless - any server handles any request',
    'Auto-scaling: add servers during load, remove during idle',
    'Health checks remove failed servers automatically',
  ],

  diagram: `
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│   IoT    │     │     Load     │     │ App Server 1│
│ Devices  │────▶│   Balancer   │────▶│ App Server 2│
│(500K)    │     │              │     │ App Server 3│
└──────────┘     └──────────────┘     └──────┬──────┘
                                              │
                                              ▼
                                      ┌───────────────┐
                                      │ Queue + Cache │
                                      │      + DB     │
                                      └───────────────┘
`,

  keyConcepts: [
    { title: 'Stateless', explanation: 'App Servers store no data locally - easy to scale', icon: '🔄' },
    { title: 'Auto-Scaling', explanation: 'Automatically add/remove servers based on load', icon: '📈' },
    { title: 'High Availability', explanation: 'System survives server failures', icon: '🛡️' },
  ],

  quickCheck: {
    question: 'Why must App Servers be stateless for horizontal scaling?',
    options: [
      'Stateless is cheaper',
      'If servers store data locally, you can\'t load balance across them',
      'Load balancers require stateless servers',
      'It doesn\'t matter',
    ],
    correctIndex: 1,
    explanation: 'Stateless servers can handle any request. If they stored data locally, a device would need to always reach the same server (sticky sessions) - hard to scale.',
  },
};

const step8: GuidedStep = {
  id: 'iot-telemetry-step-8',
  stepNumber: 8,
  frIndex: 5,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'System must handle 500K devices and survive server failures',
    taskDescription: 'Add Load Balancer in front of App Servers',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices + Dashboards', displayName: 'Clients' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple instances (3+)', displayName: 'App Servers' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'cache', reason: 'Caches queries', displayName: 'Cache' },
      { type: 'database', reason: 'Time-Series DB', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'Clients', to: 'Load Balancer', reason: 'All traffic goes through LB' },
      { from: 'Load Balancer', to: 'App Servers', reason: 'LB distributes to servers' },
      { from: 'App Servers', to: 'Message Queue', reason: 'Buffered writes' },
      { from: 'App Servers', to: 'Cache', reason: 'Query cache' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Persist data' },
    ],
    successCriteria: [
      'Add Load Balancer between Clients and App Servers',
      'Full architecture: Clients → LB → App Servers → Queue/Cache → DB',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'message_queue', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Add Load Balancer between Clients and App Servers, configure App Server for multiple instances',
    level2: 'Insert Load Balancer: Clients → Load Balancer → App Servers (set instances to 3+)',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'message_queue' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'cache' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const iotTelemetryAggregationGuidedTutorial: GuidedTutorial = {
  problemId: 'iot-telemetry-aggregation-guided',
  problemTitle: 'Build IoT Telemetry Aggregation - Time-Series at Scale',

  requirementsPhase: iotTelemetryRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Ingestion',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Ingest sensor data from IoT devices at sustained write rate',
      traffic: { type: 'write', rps: 1000, writeRps: 1000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Query Recent Data',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Dashboard queries return recent telemetry within latency budget',
      traffic: { type: 'read', rps: 50, readRps: 50 },
      duration: 30,
      passCriteria: { maxP99Latency: 2000, maxErrorRate: 0.01 },
    },
    {
      name: 'Aggregation Queries',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Time-window aggregations (avg, min, max) return quickly',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 2000, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Write Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10,000 writes/sec sustained with acknowledgment under 1 second',
      traffic: { type: 'write', rps: 10000, writeRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 1000, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-S1: Write Burst',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb device reconnection burst (5x normal writes)',
      traffic: { type: 'write', rps: 50000, writeRps: 50000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-R1: High Availability',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System survives App Server failure without data loss',
      traffic: { type: 'mixed', rps: 5000, readRps: 100, writeRps: 4900 },
      duration: 60,
      failureInjection: { type: 'app_server_crash', atSecond: 30, recoverySecond: 40 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 5, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet $5,000/month budget while handling production load',
      traffic: { type: 'mixed', rps: 5000, readRps: 100, writeRps: 4900 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 5000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getIotTelemetryAggregationGuidedTutorial(): GuidedTutorial {
  return iotTelemetryAggregationGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = iotTelemetryRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= iotTelemetryRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
