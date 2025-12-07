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
 * Sensor Data Collection Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a sensor data collection and processing system.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution - Basic sensor data ingestion
 * Steps 4-6: Apply NFRs - Time-series storage, aggregation, anomaly detection
 *
 * Key Focus Areas:
 * - High-frequency sensor data ingestion
 * - Time-series data storage and querying
 * - Real-time aggregation and anomaly detection
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const sensorDataCollectionRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a sensor data collection system for industrial IoT monitoring",

  interviewer: {
    name: 'Dr. Sarah Chen',
    role: 'Head of IoT Engineering',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'sensor-types',
      category: 'functional',
      question: "What types of sensors will this system collect data from?",
      answer: "We need to support multiple sensor types:\n1. **Temperature sensors** (HVAC, industrial equipment)\n2. **Pressure sensors** (hydraulic systems, pipelines)\n3. **Vibration sensors** (motors, machinery)\n4. **Flow rate sensors** (water, gas, oil)\n5. **Environmental sensors** (humidity, air quality, CO2)\n\nEach sensor type has different sampling rates and data characteristics.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Different sensor types have different data rates and precision requirements",
    },
    {
      id: 'sampling-rate',
      category: 'functional',
      question: "How frequently do sensors send data? What's the sampling rate?",
      answer: "Sampling rates vary by sensor type:\n- **High-frequency** (vibration, pressure): 100-1000 Hz (100-1000 samples per second)\n- **Medium-frequency** (temperature, flow): 1-10 Hz (1-10 samples per second)\n- **Low-frequency** (environmental): 0.1-1 Hz (1 sample every 1-10 seconds)\n\nFor a factory with 10,000 sensors, this means 100,000+ data points per second at peak!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "High sampling rates create massive write load - buffering and batching are essential",
    },
    {
      id: 'data-quality',
      category: 'functional',
      question: "What about data quality? Do we need to handle sensor errors, missing data, or outliers?",
      answer: "Yes! Industrial sensors are imperfect:\n1. **Missing data**: Network drops, sensor failures\n2. **Outliers**: Sensor glitches produce impossible values (e.g., -999°C)\n3. **Drift**: Sensors gradually lose calibration\n4. **Noise**: Random fluctuations\n\nWe need to detect and handle these issues in real-time.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Data quality is critical - bad sensor data can trigger false alarms or hide real problems",
    },

    // IMPORTANT - Clarifications
    {
      id: 'time-series-storage',
      category: 'clarification',
      question: "How long do we need to store raw sensor data? What about aggregated data?",
      answer: "Storage retention policy:\n- **Raw data**: 7 days (high resolution)\n- **Minute aggregates**: 30 days\n- **Hourly aggregates**: 1 year\n- **Daily aggregates**: 5 years\n\nThis tiered approach balances storage cost with data granularity needs.",
      importance: 'important',
      insight: "Time-series data grows linearly - compression and aggregation are mandatory",
    },
    {
      id: 'aggregation-needs',
      category: 'clarification',
      question: "What kind of aggregations do users need? Real-time or batch?",
      answer: "Users need both:\n1. **Real-time aggregations** (1-minute windows): min, max, avg, stddev for dashboards\n2. **Historical aggregations**: hourly and daily rollups for trend analysis\n3. **Custom aggregations**: percentiles (p50, p95, p99) for SLA monitoring\n\nReal-time aggregations must update within 60 seconds of data arrival.",
      importance: 'important',
      insight: "Pre-compute aggregations to avoid expensive queries over raw data",
    },
    {
      id: 'anomaly-detection',
      category: 'clarification',
      question: "Do we need anomaly detection? Should the system alert on unusual patterns?",
      answer: "Yes! Critical for industrial monitoring:\n1. **Threshold alerts**: Temperature > 100°C, pressure < 10 PSI\n2. **Statistical anomalies**: Values beyond 3 standard deviations\n3. **Pattern anomalies**: Sudden spikes, unusual trends\n\nAlerts must trigger within 30 seconds of anomaly detection.",
      importance: 'important',
      insight: "Anomaly detection prevents equipment failures and safety incidents",
    },

    // SCOPE
    {
      id: 'scope-historical-replay',
      category: 'scope',
      question: "Do we need to support historical data replay for testing or analysis?",
      answer: "Nice to have for v2. Focus on real-time ingestion and storage for MVP.",
      importance: 'nice-to-have',
      insight: "Replay is valuable but adds complexity - defer to later phase",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-sensors',
      category: 'throughput',
      question: "How many sensors will the system support?",
      answer: "Start with 50,000 sensors across multiple industrial facilities. Target is 100,000+ sensors within a year.",
      importance: 'critical',
      learningPoint: "Sensor count determines storage and processing capacity needs",
    },
    {
      id: 'throughput-data-points',
      category: 'throughput',
      question: "What's the total data ingestion rate?",
      answer: "With mixed sensor types and sampling rates, we estimate:\n- Average: 150,000 data points per second\n- Peak: 500,000 data points per second (when all sensors active)\n\nEach data point is ~100 bytes (sensor_id, timestamp, value, metadata).",
      importance: 'critical',
      calculation: {
        formula: "50K sensors × 3 samples/sec avg = 150K data points/sec",
        result: "~150K writes/sec sustained, 500K peak",
      },
      learningPoint: "Sensor data creates extreme write load - time-series database is essential",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "What about read queries? How many users or applications will query this data?",
      answer: "About 500 concurrent users (engineers, operators, dashboards) making:\n- 5,000 queries per second for real-time dashboards\n- 1,000 queries per second for historical analysis\n\nMost queries are for recent data (last hour) or pre-computed aggregates.",
      importance: 'critical',
      learningPoint: "Read-to-write ratio is low (1:25) - very write-heavy workload",
    },

    // 2. PAYLOAD
    {
      id: 'payload-data-point',
      category: 'payload',
      question: "How large is each sensor data point?",
      answer: "Each data point contains:\n- sensor_id (UUID): 16 bytes\n- timestamp (microsecond precision): 8 bytes\n- value (float64): 8 bytes\n- quality_code (byte): 1 byte\n- metadata (JSON): ~50 bytes\n\nTotal: ~100 bytes per data point",
      importance: 'important',
      calculation: {
        formula: "150K points/sec × 100 bytes = 15 MB/sec",
        result: "~15 MB/sec sustained ingestion bandwidth",
      },
      learningPoint: "Bandwidth is manageable but storage grows quickly",
    },
    {
      id: 'payload-storage-growth',
      category: 'payload',
      question: "How much storage do we need?",
      answer: "For 7 days of raw data:\n- 150K points/sec × 100 bytes × 86,400 sec/day × 7 days = 9.1 TB\n\nWith compression (typical 10:1 for time-series), actual storage: ~1 TB for raw data.\n\nPlus aggregates: ~200 GB",
      importance: 'important',
      calculation: {
        formula: "150K × 100 bytes × 86400 × 7 = 9.1 TB (raw) → 1 TB (compressed)",
        result: "~1.2 TB total storage needed",
      },
      learningPoint: "Time-series compression is critical - can achieve 10-20x reduction",
    },

    // 3. LATENCY
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "How quickly must the system acknowledge sensor data?",
      answer: "Sensors expect acknowledgment within 100ms. If they don't receive ack, they buffer and retry, which can cause data loss.",
      importance: 'critical',
      learningPoint: "Fast ack is critical for sensor reliability - use message queue for buffering",
    },
    {
      id: 'latency-query',
      category: 'latency',
      question: "What about query latency? How fast should dashboards update?",
      answer: "Real-time dashboards need:\n- Current sensor values: p99 < 100ms\n- 1-minute aggregates: p99 < 200ms\n- Historical queries: p99 < 2 seconds (acceptable for analysis)\n\nUsers expect near-instant dashboard updates.",
      importance: 'critical',
      learningPoint: "Cache recent data and aggregates for fast dashboard queries",
    },

    // 4. BURSTS
    {
      id: 'burst-patterns',
      category: 'burst',
      question: "Are there traffic patterns or bursts we need to handle?",
      answer: "Yes! Common patterns:\n- **Morning startup**: All sensors activate at 6 AM → 3x normal load for 30 minutes\n- **Shift changes**: Factory processes ramp up/down → 2x spikes\n- **Equipment tests**: Vibration sensors spike to 1000 Hz during testing\n\nNeed to handle 3-5x normal load without data loss.",
      importance: 'important',
      insight: "Buffering and auto-scaling essential for handling burst patterns",
    },

    // 5. AVAILABILITY
    {
      id: 'availability-sla',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.9% availability (8.7 hours downtime per year). Industrial facilities run 24/7 - losing sensor data can mean safety issues or production losses.",
      importance: 'critical',
      insight: "High availability requires replication and failover mechanisms",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['sensor-types', 'sampling-rate', 'data-quality'],
  criticalFRQuestionIds: ['sensor-types', 'sampling-rate', 'data-quality'],
  criticalScaleQuestionIds: ['throughput-data-points', 'throughput-queries', 'latency-ingestion'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Support multiple sensor types',
      description: 'Ingest data from temperature, pressure, vibration, flow, and environmental sensors',
      emoji: '🌡️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Handle variable sampling rates',
      description: 'Support sensors with sampling rates from 0.1 Hz to 1000 Hz',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Data quality monitoring',
      description: 'Detect and handle missing data, outliers, and sensor errors',
      emoji: '✓',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Real-time aggregation',
      description: 'Provide 1-minute aggregates (min, max, avg, stddev) updated in real-time',
      emoji: '📊',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Anomaly detection',
      description: 'Alert on threshold violations and statistical anomalies within 30 seconds',
      emoji: '🚨',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000 sensors',
    writesPerDay: '13 billion data points',
    readsPerDay: '500 million queries',
    peakMultiplier: 5,
    readWriteRatio: '1:25 (extremely write-heavy)',
    calculatedWriteRPS: { average: 150000, peak: 500000 },
    calculatedReadRPS: { average: 5000, peak: 15000 },
    maxPayloadSize: '~100 bytes per data point',
    storagePerRecord: '~100 bytes (10 bytes compressed)',
    storageGrowthPerYear: '~50 TB raw data (5 TB compressed)',
    redirectLatencySLA: 'p99 < 100ms (ingestion ack)',
    createLatencySLA: 'p99 < 200ms (aggregation query)',
  },

  architecturalImplications: [
    '✅ 150K writes/sec → Time-series database mandatory (InfluxDB, TimescaleDB)',
    '✅ 500K peak writes → Message queue for buffering (Kafka)',
    '✅ Write-heavy (25:1) → Optimize for write throughput, batch inserts',
    '✅ 100ms ack requirement → Async processing with queue',
    '✅ 7 days raw data → ~1 TB with compression',
    '✅ Real-time aggregation → Stream processing (Kafka Streams, Flink)',
    '✅ Anomaly detection → CEP engine or streaming analytics',
  ],

  outOfScope: [
    'Sensor provisioning and registration',
    'Machine learning model training',
    'Historical data replay',
    'Multi-region deployment (single region for MVP)',
    'Advanced signal processing (FFT, filtering)',
  ],

  keyInsight: "Sensor data collection is all about handling extreme write throughput. With 150K+ writes per second, we need message queues for buffering, time-series databases for efficient storage, and stream processing for real-time aggregation. Let's build it step by step - first make it work, then make it scale!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Sensors to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏭',
  scenario: "Welcome! You're building a sensor data collection system for an industrial facility.",
  hook: "Your first temperature sensor just came online in the factory. It needs to send readings to the cloud for monitoring!",
  challenge: "Connect the sensors (Client) to the App Server to start collecting data.",
  illustration: 'factory-sensors',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your sensor data system is online!",
  achievement: "Sensors can now connect and send data to your server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting sensor data', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process sensor readings yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Sensor Data Ingestion',
  conceptExplanation: `Every sensor data system starts with **sensors** connecting to a **server**.

When a temperature sensor takes a reading:
1. The sensor (Client) sends a data point (timestamp, value, metadata)
2. The App Server receives the sensor data
3. The server acknowledges receipt
4. The sensor continues sending periodic readings

This is the foundation for all IoT sensor systems!`,
  whyItMatters: 'Without this connection, sensor data is trapped on the device - it never reaches the cloud for analysis.',
  keyPoints: [
    'Sensors = Clients that send periodic readings',
    'App Server = Ingestion endpoint that receives sensor data',
    'Protocols: HTTP/REST for simplicity, MQTT for efficiency',
    'Acknowledgment is critical - sensors retry if no ack',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Sensor    │ ──────▶ │   App Server    │
│  (Client)   │ ◀────── │  (Ingestion)    │
└─────────────┘         └─────────────────┘
  data point (temp=72°F)    acknowledgment
`,
  keyConcepts: [
    {
      title: 'Sensor',
      explanation: 'Physical device that measures temperature, pressure, vibration, etc.',
      icon: '🌡️',
    },
    {
      title: 'Data Point',
      explanation: 'Single measurement: timestamp + value + metadata',
      icon: '📍',
    },
  ],
  quickCheck: {
    question: 'Why is acknowledgment important for sensor data ingestion?',
    options: [
      'To make sensors feel appreciated',
      'To confirm data was received so sensors don\'t retry and duplicate data',
      'To encrypt the data',
      'To compress the data',
    ],
    correctIndex: 1,
    explanation: 'Acknowledgment tells sensors their data was received. Without it, sensors retry, creating duplicate data and wasting bandwidth.',
  },
};

const step1: GuidedStep = {
  id: 'sensor-collection-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Sensors can connect to send data',
    taskDescription: 'Add Client (sensors) and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents industrial sensors', displayName: 'Sensors' },
      { type: 'app_server', reason: 'Ingests sensor data', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Sensors send data points' },
    ],
    successCriteria: ['Add Sensors', 'Add App Server', 'Connect Sensors → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client (sensors), then add App Server, then connect them',
    level2: 'Drag Sensors and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Configure Ingestion API with Python Code
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your App Server is connected, but it's just an empty box.",
  hook: "A sensor just sent a temperature reading, but the server returned 404! It doesn't know how to handle sensor data yet.",
  challenge: "Configure the ingestion API and implement Python handlers to process sensor data.",
  illustration: 'configure-api',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your server can process sensor data!",
  achievement: "Sensors can send data and receive acknowledgments",
  metrics: [
    { label: 'API configured', after: 'POST /api/v1/sensors/data' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But wait... when the server restarts, all sensor data is lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Python Implementation for Sensor Ingestion',
  conceptExplanation: `Your App Server needs to handle sensor data ingestion:

**POST /api/v1/sensors/data** (Batch Ingestion)
- Receives: Array of data points from multiple sensors
- Returns: Acknowledgment with count of points received
- Your code: Validate, parse, and store data points

**Request format**:
\`\`\`json
{
  "data_points": [
    {
      "sensor_id": "temp-001",
      "timestamp": "2024-01-15T10:30:00.123Z",
      "value": 72.5,
      "unit": "fahrenheit",
      "quality": "good"
    },
    ...
  ]
}
\`\`\`

**By the end of this step:**
1. ✅ API configured on the App Server
2. ✅ Python handler validates and processes sensor data`,
  whyItMatters: 'Without the code, your server is just a black box. The Python handler defines how sensor data is validated, processed, and stored.',
  keyPoints: [
    'POST endpoint for batch ingestion (more efficient than one-at-a-time)',
    'Validate sensor_id, timestamp, value, quality code',
    'Return quick acknowledgment (< 100ms)',
    'Store data in memory for now (database comes next)',
  ],
  diagram: `
POST /api/v1/sensors/data
┌──────────────────────────────────────────────┐
│ Request:  {                                  │
│   "data_points": [                           │
│     {                                        │
│       "sensor_id": "temp-001",               │
│       "timestamp": "2024-01-15T10:30:00Z",   │
│       "value": 72.5,                         │
│       "unit": "fahrenheit",                  │
│       "quality": "good"                      │
│     }                                        │
│   ]                                          │
│ }                                            │
│ Response: { "received": 1, "status": "ok" }  │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Batch Ingestion', explanation: 'Accept multiple data points in one request for efficiency', icon: '📦' },
    { title: 'Quality Code', explanation: 'Metadata indicating sensor health (good, questionable, bad)', icon: '✓' },
    { title: 'Fast Ack', explanation: 'Return acknowledgment quickly so sensors don\'t timeout', icon: '⚡' },
  ],
  quickCheck: {
    question: 'Why use batch ingestion instead of one data point per request?',
    options: [
      'Batch ingestion is easier to code',
      'Reduces network overhead and improves throughput by processing multiple points per request',
      'Sensors can only send batches',
      'It\'s more secure',
    ],
    correctIndex: 1,
    explanation: 'Batch ingestion reduces HTTP overhead. Instead of 1000 requests for 1000 data points, we can use 10 requests with 100 points each.',
  },
};

const step2: GuidedStep = {
  id: 'sensor-collection-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle sensor data with validation',
    taskDescription: 'Configure API and implement the Python ingestion handler',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Sensors' },
      { type: 'app_server', reason: 'Configure API and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/sensors/data API',
      'Open the Python tab and implement the ingestion handler',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure API, then switch to Python tab to write the handler',
    level2: 'After assigning the API, implement ingest_sensor_data() function to validate and store data points',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: The Crisis - We Lost All Sensor Data!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. The server crashed and restarted.",
  hook: "When it came back online... ALL sensor data was GONE! Hours of temperature, pressure, and vibration readings - vanished! Engineers are furious!",
  challenge: "The problem: sensor data was stored in server memory. We need a time-series database for persistent storage!",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your sensor data is now safe!",
  achievement: "Data persists in time-series database even if the server crashes",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted forever' },
    { label: 'Storage', after: 'Time-Series Database' },
  ],
  nextTeaser: "Good! But we're getting 150,000 data points per second...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Databases: Why They Matter for Sensor Data',
  conceptExplanation: `Without a database, your app server stores data in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all sensor data is lost!

**Solution**: Time-Series Database (e.g., InfluxDB, TimescaleDB)

**Why time-series DB for sensors?**
- Optimized for timestamp-ordered data
- Automatic downsampling and retention policies
- Efficient compression (10-20x for sensor data)
- Fast queries over time ranges
- Built-in aggregation functions

**What we store**:
- Raw sensor readings (timestamp, sensor_id, value, quality)
- Metadata (sensor type, location, calibration info)
- Retention: 7 days raw, then aggregate to minute/hour/day`,
  whyItMatters: 'Sensor data is valuable for analysis, compliance, and troubleshooting. Losing it means losing visibility into equipment health and performance.',
  realWorldExample: {
    company: 'GE Predix',
    scenario: 'Industrial IoT platform for jet engines and power plants',
    howTheyDoIt: 'Uses time-series databases to store billions of sensor readings per day. Retention policies automatically aggregate old data to save storage.',
  },
  famousIncident: {
    title: 'Boeing 737 MAX Sensor Data Loss',
    company: 'Boeing',
    year: '2019',
    whatHappened: 'Investigators found that flight data wasn\'t being properly stored from critical sensors. When they needed to analyze the MCAS system failures, crucial sensor data was missing.',
    lessonLearned: 'Critical sensor data must be stored reliably with proper retention. Lives can depend on having accurate historical sensor data.',
    icon: '✈️',
  },
  keyPoints: [
    'Time-series DBs optimize for timestamp-based writes and queries',
    'Compression reduces storage by 10-20x for sensor data',
    'Automatic retention policies manage storage growth',
    'Supports high write throughput (100K+ points/sec)',
  ],
  diagram: `
┌─────────┐       ┌─────────────┐       ┌──────────────────┐
│ Sensors │ ────▶ │ App Server  │ ────▶ │  Time-Series DB  │
└─────────┘       └─────────────┘       │                  │
                                        │ sensor_001:      │
                                        │   t1: 72.0°F     │
                                        │   t2: 72.1°F     │
                                        │   t3: 71.9°F     │
                                        │ (compressed)     │
                                        └──────────────────┘
`,
  keyConcepts: [
    { title: 'Time-Series', explanation: 'Data organized by timestamp for efficient queries', icon: '📈' },
    { title: 'Compression', explanation: 'Reduces storage by exploiting temporal patterns', icon: '🗜️' },
    { title: 'Retention Policy', explanation: 'Automatically delete or aggregate old data', icon: '🗓️' },
  ],
  quickCheck: {
    question: 'Why use a time-series database instead of a regular SQL database for sensor data?',
    options: [
      'Time-series DBs are always faster',
      'Time-series DBs optimize for timestamp-based writes/queries and provide better compression',
      'SQL databases cannot store timestamps',
      'Time-series DBs are free',
    ],
    correctIndex: 1,
    explanation: 'Time-series DBs are specifically designed for timestamp-ordered data with high write rates. They provide automatic compression, retention policies, and fast time-range queries.',
  },
};

const step3: GuidedStep = {
  id: 'sensor-collection-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Sensor data must persist durably in time-series storage',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents sensors', displayName: 'Sensors' },
      { type: 'app_server', reason: 'Ingests data', displayName: 'App Server' },
      { type: 'database', reason: 'Stores time-series data persistently', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Database', reason: 'Server persists sensor data' },
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
// STEP 4: The Write Storm - Database Can't Keep Up!
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌪️',
  scenario: "Your sensor system is live! But there's a problem...",
  hook: "The database is at 100% CPU! It's receiving 150,000 writes per second and is falling behind. Data points are getting delayed and some are being dropped!",
  challenge: "We need to buffer writes in a message queue so the database isn't overwhelmed during traffic spikes.",
  illustration: 'database-overwhelmed',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Write load is under control!",
  achievement: "Message queue buffers sensor data, database writes at its own pace",
  metrics: [
    { label: 'DB write load', before: '150K/sec (overloaded)', after: '10K/sec (batched)' },
    { label: 'Data loss', before: 'High risk', after: 'Zero' },
    { label: 'Ingestion latency', before: '500ms', after: '20ms' },
  ],
  nextTeaser: "Great! But engineers want to see aggregated sensor trends...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Buffering High-Volume Sensor Data',
  conceptExplanation: `**The problem**: 150K writes/sec will crush most databases!

**The solution**: Message Queue (Kafka, RabbitMQ)

**How it works**:
1. Sensor data arrives → App Server writes to queue (fast!)
2. Queue buffers data points (durable, no data loss)
3. Background workers consume from queue
4. Workers batch writes to database (10K points per batch)
5. Database writes 10K/sec instead of 150K/sec

**Why this works**:
- Queue decouples ingestion from storage
- Batching reduces database write load by 15x
- Queue handles traffic spikes (buffer up to millions of points)
- Async processing - sensors get instant acknowledgment`,
  whyItMatters: 'Without buffering, traffic spikes overwhelm the database and cause data loss. The queue provides a shock absorber.',
  realWorldExample: {
    company: 'Siemens Industrial IoT',
    scenario: 'Collecting data from manufacturing sensors worldwide',
    howTheyDoIt: 'Uses Apache Kafka to buffer sensor data. Kafka handles 1M+ writes/sec, then workers batch-write to time-series databases.',
  },
  famousIncident: {
    title: 'NASA Mars Rover Data Loss',
    company: 'NASA',
    year: '2004',
    whatHappened: 'Mars rover Spirit\'s flash memory filled up because the data pipeline couldn\'t keep up with sensor data. The rover entered safe mode and stopped functioning for weeks.',
    lessonLearned: 'Always buffer high-volume data streams. Without proper queueing, downstream systems get overwhelmed and data is lost.',
    icon: '🚀',
  },
  keyPoints: [
    'Message queue buffers sensor data during write spikes',
    'Workers batch writes to database (100-10,000 points per batch)',
    'Async processing - sensors get instant ack',
    'Queue is durable - no data loss even if database is down',
  ],
  diagram: `
┌─────────┐    ┌─────────┐    ┌─────────────┐
│ Sensors │───▶│   App   │───▶│Message Queue│
└─────────┘    │  Server │    │  (Kafka)    │
               └─────────┘    └──────┬──────┘
                                     │ batch
               150K/sec              │ consume
                                     ▼
                              ┌─────────────┐
                              │  Time-Series│
                              │     DB      │
                              └─────────────┘
                                 10K/sec
`,
  keyConcepts: [
    { title: 'Message Queue', explanation: 'Durable buffer that decouples producers from consumers', icon: '📬' },
    { title: 'Batching', explanation: 'Group many writes into fewer database operations', icon: '📦' },
    { title: 'Backpressure', explanation: 'Queue absorbs spikes without overwhelming downstream', icon: '🚰' },
  ],
  quickCheck: {
    question: 'What is the main benefit of using a message queue for sensor data?',
    options: [
      'Makes writes faster',
      'Buffers writes to prevent data loss and protect the database from overload',
      'Reduces storage costs',
      'Encrypts sensor data',
    ],
    correctIndex: 1,
    explanation: 'Message queues buffer writes during traffic spikes, preventing data loss and protecting the database from being overwhelmed.',
  },
};

const step4: GuidedStep = {
  id: 'sensor-collection-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'System must handle 150K writes/sec without overwhelming the database',
    taskDescription: 'Add Message Queue between App Server and Database',
    componentsNeeded: [
      { type: 'client', reason: 'Sensors', displayName: 'Sensors' },
      { type: 'app_server', reason: 'Ingests data', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores time-series data', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer writes' },
      { from: 'Message Queue', to: 'Database', reason: 'Batched writes' },
    ],
    successCriteria: ['Add Message Queue', 'Route writes through queue to database'],
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
    level1: 'Add a Message Queue between App Server and Database to buffer writes',
    level2: 'Connect: App Server → Message Queue → Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Real-Time Aggregation - Engineers Need Trends!
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📊',
  scenario: "Engineers are opening dashboards to monitor equipment health.",
  hook: "But they're complaining: 'Why can't I see average temperature over the last minute? I have to look at 6,000 individual data points!' They need aggregated views!",
  challenge: "Implement real-time aggregation using stream processing to compute 1-minute averages, mins, maxes, and standard deviations.",
  illustration: 'dashboard-confusion',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Real-time aggregation is live!",
  achievement: "Engineers can see 1-minute aggregates updated in real-time",
  metrics: [
    { label: 'Query complexity', before: 'Scan 6K raw points', after: '1 aggregate value' },
    { label: 'Dashboard latency', before: '5 seconds', after: '100ms' },
    { label: 'Aggregates computed', after: 'Every 60 seconds' },
  ],
  nextTeaser: "Excellent! But what about anomaly detection? Engineers need alerts...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing: Real-Time Aggregation of Sensor Data',
  conceptExplanation: `**The problem**: Engineers want to see trends, not individual data points.

**Example**: Temperature sensor sends 100 readings per minute. Engineers want:
- Average temperature over last minute
- Min and max values
- Standard deviation (to detect variability)

**Naive approach**: Query database for all 100 points, compute in app
- Problem: Slow, expensive, doesn't scale

**Better approach**: Stream Processing (Kafka Streams, Apache Flink)

**How it works**:
1. Stream processor consumes from message queue
2. Groups data by sensor_id and 1-minute windows
3. Computes aggregates (avg, min, max, stddev)
4. Writes aggregates to database
5. Dashboards query pre-computed aggregates (fast!)

**Result**: Engineers see real-time trends without expensive queries`,
  whyItMatters: 'Pre-computed aggregations make dashboards 100x faster. Instead of scanning millions of data points, dashboards read a few thousand aggregate values.',
  realWorldExample: {
    company: 'Tesla',
    scenario: 'Vehicle telemetry and battery monitoring',
    howTheyDoIt: 'Uses stream processing to aggregate sensor data from millions of vehicles. Computes metrics like average battery temperature, charge cycles, etc. in real-time.',
  },
  famousIncident: {
    title: 'Fukushima Nuclear Disaster Monitoring',
    company: 'TEPCO',
    year: '2011',
    whatHappened: 'After the Fukushima disaster, radiation sensors generated massive amounts of data. Early systems couldn\'t aggregate it fast enough, delaying critical insights about radiation spread patterns.',
    lessonLearned: 'Real-time aggregation of sensor data is critical for rapid response. Pre-compute aggregates - don\'t wait to query raw data.',
    icon: '☢️',
  },
  keyPoints: [
    'Stream processing computes aggregates in real-time',
    'Window-based aggregation (1-minute, 5-minute, 1-hour)',
    'Compute: avg, min, max, stddev, percentiles',
    'Store aggregates separately for fast queries',
  ],
  diagram: `
┌──────────────────────────────────────────────┐
│        STREAM PROCESSING PIPELINE            │
│                                              │
│  Message Queue                               │
│       │                                      │
│       ▼                                      │
│  Stream Processor                            │
│   (Kafka Streams)                            │
│       │                                      │
│   ┌───┴────────────┐                         │
│   │ 1-min windows  │                         │
│   │ by sensor_id   │                         │
│   │                │                         │
│   │ Compute:       │                         │
│   │  - avg         │                         │
│   │  - min/max     │                         │
│   │  - stddev      │                         │
│   └───┬────────────┘                         │
│       │                                      │
│       ▼                                      │
│  Aggregates Table                            │
│  (sensor_id, window_start, avg, min, max)   │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Stream Processing', explanation: 'Process data as it flows through the system', icon: '🌊' },
    { title: 'Windowing', explanation: 'Group data into time buckets (1-min, 5-min, etc.)', icon: '🪟' },
    { title: 'Pre-Aggregation', explanation: 'Compute before querying for faster dashboards', icon: '📊' },
  ],
  quickCheck: {
    question: 'Why pre-compute aggregations instead of computing on-demand?',
    options: [
      'Pre-computation is easier to code',
      'On-demand computation is too slow when scanning millions of data points',
      'Pre-computation uses less storage',
      'Databases can\'t compute aggregates',
    ],
    correctIndex: 1,
    explanation: 'Computing aggregates on-demand requires scanning millions of raw data points, which is slow. Pre-computing makes queries 100x faster.',
  },
};

const step5: GuidedStep = {
  id: 'sensor-collection-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-4: Provide 1-minute aggregates updated in real-time',
    taskDescription: 'Add stream processing for real-time aggregation (conceptually represented by message queue)',
    componentsNeeded: [
      { type: 'client', reason: 'Sensors', displayName: 'Sensors' },
      { type: 'app_server', reason: 'Ingests data', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Feeds stream processor', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores raw and aggregated data', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer for processing' },
      { from: 'Message Queue', to: 'Database', reason: 'Write raw and aggregates' },
    ],
    successCriteria: ['Build full pipeline with message queue for stream processing'],
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
    level1: 'Your message queue now serves dual purpose: buffering writes AND feeding stream processor',
    level2: 'The existing architecture supports stream processing - the message queue feeds both database writers and aggregation workers',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Anomaly Detection - Alert on Critical Events!
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "A motor in the factory is overheating!",
  hook: "The temperature sensor shows 150°C - way above the 100°C threshold. But nobody noticed until it was too late and the motor shut down. You need automated alerting!",
  challenge: "Implement anomaly detection to automatically detect and alert on threshold violations and statistical anomalies.",
  illustration: 'motor-overheating',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Anomaly detection is active!",
  achievement: "System alerts engineers within 30 seconds of detecting anomalies",
  metrics: [
    { label: 'Detection latency', after: '< 30 seconds' },
    { label: 'Alerts sent', after: 'Real-time notifications' },
    { label: 'False positive rate', after: 'Low (statistical thresholds)' },
  ],
  nextTeaser: "Perfect! Now let's make sure the system is highly available...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Anomaly Detection: Preventing Equipment Failures',
  conceptExplanation: `**The goal**: Detect problems before they cause failures!

**Types of anomalies to detect**:

1. **Threshold violations**:
   - Temperature > 100°C
   - Pressure < 10 PSI
   - Vibration > 50 Hz

2. **Statistical anomalies**:
   - Values beyond 3 standard deviations from mean
   - Sudden spikes (value changes > 50% in 1 minute)
   - Unusual patterns (steady decline, oscillation)

**How it works**:
1. Stream processor computes real-time statistics
2. Compare incoming data to thresholds
3. Detect statistical outliers
4. Publish alerts to notification system
5. Engineers receive alerts via email, SMS, dashboard

**Implementation**:
- Use stream processing for real-time detection
- Maintain sliding windows of historical data
- Compute z-scores for statistical anomalies
- Alert within 30 seconds of detection`,
  whyItMatters: 'Anomaly detection prevents costly equipment failures and safety incidents. Detecting problems early saves money and lives.',
  realWorldExample: {
    company: 'Rolls-Royce',
    scenario: 'Jet engine monitoring for airlines',
    howTheyDoIt: 'Monitors thousands of sensors on each engine. Anomaly detection predicts failures weeks in advance, preventing costly mid-flight emergencies.',
  },
  famousIncident: {
    title: 'Texas City Refinery Explosion',
    company: 'BP',
    year: '2005',
    whatHappened: 'Pressure sensors showed dangerous levels, but no automated alerts were configured. Manual monitoring missed the warning signs. The refinery exploded, killing 15 workers and injuring 180.',
    lessonLearned: 'Automated anomaly detection is critical for safety. Humans can\'t watch thousands of sensors 24/7. Automated alerts save lives.',
    icon: '🔥',
  },
  keyPoints: [
    'Detect threshold violations in real-time',
    'Use statistical methods for outlier detection',
    'Alert within 30 seconds of anomaly',
    'Reduce false positives with smart thresholds',
  ],
  diagram: `
┌──────────────────────────────────────────────┐
│       ANOMALY DETECTION PIPELINE             │
│                                              │
│  Stream Processor                            │
│       │                                      │
│       ├─────▶ Threshold Check                │
│       │       (temp > 100°C?)                │
│       │                                      │
│       ├─────▶ Statistical Analysis           │
│       │       (z-score > 3?)                 │
│       │                                      │
│       ├─────▶ Pattern Detection              │
│       │       (sudden spike?)                │
│       │                                      │
│       ▼                                      │
│  Alert Queue                                 │
│       │                                      │
│       ▼                                      │
│  Notification Service                        │
│  (Email, SMS, Dashboard)                     │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Threshold Alert', explanation: 'Trigger when value exceeds predefined limit', icon: '🚨' },
    { title: 'Z-Score', explanation: 'Measure of how many std deviations from mean', icon: '📊' },
    { title: 'Sliding Window', explanation: 'Maintain recent history for statistical analysis', icon: '🪟' },
  ],
  quickCheck: {
    question: 'Why use statistical anomaly detection in addition to simple thresholds?',
    options: [
      'Statistical methods are more complex',
      'Thresholds can\'t detect gradual drifts or unusual patterns that statistical methods can catch',
      'Statistical methods are faster',
      'Thresholds don\'t work for sensor data',
    ],
    correctIndex: 1,
    explanation: 'Thresholds catch obvious violations, but statistical methods detect subtle anomalies like gradual drifts, unusual patterns, or values that are "normal" in absolute terms but unusual relative to historical patterns.',
  },
};

const step6: GuidedStep = {
  id: 'sensor-collection-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'FR-5: Alert on anomalies within 30 seconds',
    taskDescription: 'Verify message queue supports anomaly detection pipeline',
    componentsNeeded: [
      { type: 'client', reason: 'Sensors', displayName: 'Sensors' },
      { type: 'app_server', reason: 'Ingests data', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Feeds anomaly detection', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores data and alerts', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Sensors send data' },
      { from: 'App Server', to: 'Message Queue', reason: 'Feed detection pipeline' },
      { from: 'Message Queue', to: 'Database', reason: 'Store data and alerts' },
    ],
    successCriteria: ['Build complete system with anomaly detection pipeline'],
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
    level1: 'Your architecture already supports anomaly detection via the message queue',
    level2: 'The stream processing pipeline can perform both aggregation and anomaly detection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'message_queue' }, { type: 'database' }],
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

export const sensorDataCollectionGuidedTutorial: GuidedTutorial = {
  problemId: 'sensor-data-collection-guided',
  problemTitle: 'Build a Sensor Data Collection System',

  requirementsPhase: sensorDataCollectionRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Sensor Ingestion',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Sensors can send data and receive acknowledgments',
      traffic: { type: 'write', rps: 1000, writeRps: 1000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 100 },
    },
    {
      name: 'High-Frequency Data Collection',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Handle high sampling rates without data loss',
      traffic: { type: 'write', rps: 10000, writeRps: 10000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Data Quality Validation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Detect and handle invalid sensor data',
      traffic: { type: 'write', rps: 5000, writeRps: 5000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Real-Time Aggregation',
      type: 'functional',
      requirement: 'FR-4',
      description: '1-minute aggregates computed and queryable',
      traffic: { type: 'mixed', rps: 5000, readRps: 1000, writeRps: 4000 },
      duration: 120,
      passCriteria: { maxP99Latency: 200, maxErrorRate: 0.01 },
    },
    {
      name: 'Anomaly Detection',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Detect and alert on anomalies within 30 seconds',
      traffic: { type: 'write', rps: 5000, writeRps: 5000 },
      duration: 90,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: High Write Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 150K writes/sec sustained',
      traffic: { type: 'write', rps: 150000, writeRps: 150000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 5x traffic spike without data loss',
      traffic: { type: 'write', rps: 500000, writeRps: 500000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Maintain availability during database failure',
      traffic: { type: 'mixed', rps: 10000, readRps: 2000, writeRps: 8000 },
      duration: 120,
      failureInjection: { type: 'db_crash', atSecond: 60, recoverySecond: 90 },
      passCriteria: { minAvailability: 0.999, maxDowntime: 10, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getSensorDataCollectionGuidedTutorial(): GuidedTutorial {
  return sensorDataCollectionGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = sensorDataCollectionRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= sensorDataCollectionRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
