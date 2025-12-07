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
 * IoT Device Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building an IoT device cache system for managing sensor data at scale.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution - FRs satisfied!
 * Steps 4-8: Apply NFRs (edge caching, aggregation, compression, etc.)
 *
 * Key Focus Areas:
 * - Device state caching
 * - Sensor data aggregation
 * - Edge caching strategies
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const iotDeviceCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an IoT device cache system for managing sensor data at scale",

  interviewer: {
    name: 'Dr. Maya Patel',
    role: 'IoT Platform Architect',
    avatar: '👩‍🔬',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-device-updates',
      category: 'functional',
      question: "What are the main operations IoT devices need to perform?",
      answer: "IoT devices (sensors, smart home devices, industrial sensors) need to:\n1. **Report state**: Devices send their current sensor readings (temperature, humidity, motion, etc.) to the cloud\n2. **Query state**: Applications and dashboards need to read the current state of devices\n3. **Receive commands**: Devices occasionally need to receive control commands (turn on/off, adjust settings)",
      importance: 'critical',
      revealsRequirement: 'FR-1 and FR-2',
      learningPoint: "IoT systems are fundamentally about bidirectional state synchronization",
    },
    {
      id: 'data-freshness',
      category: 'functional',
      question: "How fresh does the device state need to be? Can applications see slightly stale data?",
      answer: "Most applications can tolerate 5-30 seconds of staleness. When you check your smart thermostat app, seeing the temperature from 10 seconds ago is fine. But for critical alerts (fire alarm, intrusion detection), we need near-real-time updates within 1-2 seconds.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Understanding latency tolerance helps you choose the right caching strategy",
    },
    {
      id: 'sensor-aggregation',
      category: 'functional',
      question: "Do we need to aggregate sensor data over time? Like showing average temperature over the last hour?",
      answer: "Yes! Applications need both:\n1. **Current state**: Latest sensor reading\n2. **Historical aggregates**: Min/max/avg over time windows (last hour, last day, last week)\n\nThis helps users see trends and patterns in their IoT data.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Aggregation is expensive - pre-compute and cache it!",
    },

    // IMPORTANT - Clarifications
    {
      id: 'update-frequency',
      category: 'clarification',
      question: "How often do devices send updates?",
      answer: "It varies by device type:\n- **High-frequency sensors** (motion, vibration): Every 1-5 seconds\n- **Medium-frequency** (temperature, humidity): Every 30-60 seconds\n- **Low-frequency** (battery level, daily counters): Every 5-15 minutes\n\nOn average, each device sends an update every 30 seconds.",
      importance: 'important',
      insight: "Update frequency determines write load on your cache and database",
    },
    {
      id: 'device-lifecycle',
      category: 'clarification',
      question: "What happens when devices go offline? Should we keep their last known state?",
      answer: "Yes, absolutely. When a device disconnects, we should:\n1. Keep its last known state cached\n2. Mark it as 'offline' with a timestamp\n3. Applications can still query the last known state\n4. Alert users if a critical device has been offline too long",
      importance: 'important',
      insight: "Offline handling requires state metadata (last_update timestamp, online/offline flag)",
    },
    {
      id: 'multi-tenant',
      category: 'clarification',
      question: "Are we serving multiple customers, or is this a single organization?",
      answer: "This is a multi-tenant platform. Different customers (smart home companies, industrial IoT providers) share the infrastructure. We need to isolate data between tenants for security and performance.",
      importance: 'important',
      insight: "Multi-tenancy requires careful cache key design and data isolation",
    },

    // SCOPE
    {
      id: 'scope-regions',
      category: 'scope',
      question: "Is this for a single region or global deployment?",
      answer: "Start with single region. Global edge deployment with regional failover is a v2 feature.",
      importance: 'nice-to-have',
      insight: "Single region simplifies initial architecture",
    },
    {
      id: 'scope-analytics',
      category: 'scope',
      question: "Do we need advanced analytics or ML on sensor data?",
      answer: "Not for MVP. Focus on state caching and basic aggregation. ML/analytics pipelines can be added later as a separate system.",
      importance: 'nice-to-have',
      insight: "Analytics is a separate concern - defer to v2",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-devices',
      category: 'throughput',
      question: "How many IoT devices should we support?",
      answer: "10 million devices total across all tenants",
      importance: 'critical',
      learningPoint: "Device count determines memory and storage requirements",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many state updates per second?",
      answer: "With 10M devices updating every 30 seconds on average, that's about 333,000 updates per second at steady state",
      importance: 'critical',
      calculation: {
        formula: "10M devices ÷ 30 sec = 333,333 updates/sec",
        result: "~333K writes/sec sustained",
      },
      learningPoint: "IoT is extremely write-heavy - caching and batching are essential",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many state queries per second?",
      answer: "About 100,000 read queries per second for current state and aggregates",
      importance: 'critical',
      calculation: {
        formula: "100K reads/sec",
        result: "~100K reads/sec (but bursty when dashboards load)",
      },
      learningPoint: "Read-to-write ratio is 1:3 - unusual! Most systems are read-heavy",
    },

    // 2. PAYLOAD
    {
      id: 'payload-update-size',
      category: 'payload',
      question: "How large is each device state update?",
      answer: "Average 500 bytes per update (device_id, timestamp, sensor readings in JSON)",
      importance: 'important',
      calculation: {
        formula: "333K updates/sec × 500 bytes = 166 MB/sec ingestion bandwidth",
        result: "~166 MB/sec sustained write bandwidth",
      },
      learningPoint: "Bandwidth adds up fast with IoT - compression helps!",
    },
    {
      id: 'payload-storage',
      category: 'payload',
      question: "How long do we store raw sensor data?",
      answer: "30 days of raw data, then keep hourly aggregates for 1 year. That's about 14 PB of raw data per month!",
      importance: 'important',
      calculation: {
        formula: "333K updates/sec × 500 bytes × 86,400 sec/day × 30 days = 432 TB/month",
        result: "~432 TB/month of raw data",
      },
      learningPoint: "Time-series data explodes quickly - aggregation and compression critical",
    },

    // 3. LATENCY
    {
      id: 'latency-state-query',
      category: 'latency',
      question: "How fast should state queries return?",
      answer: "p99 under 50ms for cache hits. Users loading dashboards expect instant data.",
      importance: 'critical',
      learningPoint: "Low latency requires edge caching close to applications",
    },
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "What about device update ingestion latency?",
      answer: "p99 under 200ms acknowledgment to device. Devices retry if they don't get an ack quickly.",
      importance: 'important',
      learningPoint: "Fast ack is critical for device battery life (less retransmission)",
    },

    // 4. BURSTS
    {
      id: 'burst-peak',
      category: 'burst',
      question: "Are there traffic spikes we need to handle?",
      answer: "Yes! Morning rush (6-8 AM) when smart home devices wake up creates 3x normal load. Also, factory shift changes cause spikes in industrial sensors.",
      importance: 'important',
      insight: "Need auto-scaling and buffering to handle 3x bursts",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-device-updates', 'data-freshness', 'sensor-aggregation'],
  criticalFRQuestionIds: ['core-device-updates', 'data-freshness', 'sensor-aggregation'],
  criticalScaleQuestionIds: ['throughput-writes', 'throughput-reads', 'latency-state-query'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Devices can report state',
      description: 'IoT devices send sensor readings (temperature, motion, etc.) to the cloud',
      emoji: '📡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Applications can query device state',
      description: 'Read the current state and historical data for any device',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Fresh data within SLA',
      description: 'State queries return data that is at most 30 seconds old (eventual consistency)',
      emoji: '⏱️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Sensor data aggregation',
      description: 'Provide min/max/avg aggregates over time windows (hour, day, week)',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million devices',
    writesPerDay: '28.8 billion device updates',
    readsPerDay: '8.64 billion state queries',
    peakMultiplier: 3,
    readWriteRatio: '1:3 (write-heavy!)',
    calculatedWriteRPS: { average: 333333, peak: 1000000 },
    calculatedReadRPS: { average: 100000, peak: 300000 },
    maxPayloadSize: '~500 bytes per update',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~5 PB raw data',
    redirectLatencySLA: 'p99 < 50ms (state query)',
    createLatencySLA: 'p99 < 200ms (device update ack)',
  },

  architecturalImplications: [
    '✅ 333K writes/sec → Need write-optimized cache (Redis) and time-series DB',
    '✅ Write-heavy (3:1) → Cache strategy must handle high write throughput',
    '✅ 50ms read SLA → Multi-tier caching (in-memory + distributed cache)',
    '✅ 10M devices × 500 bytes = 5GB state → Can fit entire state in memory!',
    '✅ 432 TB/month → Time-series compression and aggregation essential',
    '✅ Edge caching → Deploy cache close to application regions',
  ],

  outOfScope: [
    'ML/Analytics pipelines',
    'Device provisioning and registration',
    'Firmware updates',
    'Global multi-region deployment',
    'Real-time alerting (separate service)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where devices can report state and applications can query it. The complexity of edge caching, aggregation, and time-series optimization comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Devices to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! You're building an IoT platform to manage millions of connected devices.",
  hook: "Your first smart thermostat just came online. It needs to send temperature readings to the cloud!",
  challenge: "Connect the Client (IoT devices) to the App Server to handle device state updates.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your IoT platform is online!",
  achievement: "Devices can now connect and send data to your server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting device connections', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process sensor data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: IoT Device Communication',
  conceptExplanation: `Every IoT platform starts with **devices** connecting to a **server**.

When a smart thermostat sends a temperature reading:
1. The device (Client) sends an HTTP/MQTT request
2. The App Server receives the sensor data
3. The server processes and stores the state

This is the foundation for all IoT systems!`,
  whyItMatters: 'Without this connection, devices are isolated - their data never reaches the cloud.',
  keyPoints: [
    'IoT devices = Clients that send sensor readings',
    'App Server = Processes device updates and state queries',
    'Protocols: HTTP/REST for simplicity, MQTT for efficiency',
    'Devices are stateless - the server manages all state',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│ IoT Device  │ ──────▶ │   App Server    │
│ (Client)    │ ◀────── │  (Your Code)    │
└─────────────┘         └─────────────────┘
     sensor data              acknowledgment
`,
  keyConcepts: [
    {
      title: 'IoT Device',
      explanation: 'Physical sensor or actuator sending data to the cloud',
      icon: '🌡️',
    },
    {
      title: 'State Update',
      explanation: 'Device sends current sensor readings (temperature, motion, etc.)',
      icon: '📤',
    },
  ],
  quickCheck: {
    question: 'Why do IoT devices need to connect to a server?',
    options: [
      'To share data with applications and other devices',
      'Because they have too much data to store locally',
      'To get more processing power',
      'To save battery',
    ],
    correctIndex: 0,
    explanation: 'Devices send data to the server so applications, dashboards, and other devices can access it. The server is the central coordination point.',
  },
};

const step1: GuidedStep = {
  id: 'iot-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Devices can connect to send state updates',
    taskDescription: 'Add Client (IoT devices) and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Processes device updates', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Devices send sensor data' },
    ],
    successCriteria: ['Add IoT Devices', 'Add App Server', 'Connect Devices → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag IoT Devices and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Device State Handlers (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚙️',
  scenario: "Your App Server is connected, but it's just an empty box.",
  hook: "A temperature sensor just sent a reading, but the server didn't know what to do with it!",
  challenge: "Configure the App Server with APIs and implement Python handlers for device state updates and queries.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your App Server can handle IoT data!",
  achievement: "Devices can report state and applications can query it",
  metrics: [
    { label: 'APIs configured', after: '2 endpoints' },
    { label: 'Code written', after: '✓ Working' },
  ],
  nextTeaser: "But wait... when the server restarts, all device states are lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design & Python Implementation for IoT',
  conceptExplanation: `Your App Server needs to handle two main operations:

**1. Report Device State (POST /api/v1/devices/:id/state)**
- Receives: Device ID, sensor readings, timestamp
- Returns: Acknowledgment
- Your code: Store device state in memory (for now)

**2. Query Device State (GET /api/v1/devices/:id/state)**
- Receives: Device ID
- Returns: Latest sensor readings
- Your code: Look up device, return current state

**By the end of this step:**
1. ✅ APIs assigned to the App Server
2. ✅ Python handlers implemented for both endpoints`,
  whyItMatters: 'Without the code, your server can\'t process sensor data. The Python handlers define what actually happens when devices send updates.',
  keyPoints: [
    'POST endpoint ingests device state updates',
    'GET endpoint returns current device state',
    'Store state in memory for now (database comes next)',
    'Include timestamp to track data freshness',
  ],
  diagram: `
POST /api/v1/devices/thermostat-001/state
┌──────────────────────────────────────────────┐
│ Request:  {                                  │
│   "temperature": 72.5,                       │
│   "humidity": 45,                            │
│   "timestamp": "2024-01-15T10:30:00Z"        │
│ }                                            │
│ Response: { "status": "ok" }                 │
└──────────────────────────────────────────────┘

GET /api/v1/devices/thermostat-001/state
┌──────────────────────────────────────────────┐
│ Response: {                                  │
│   "device_id": "thermostat-001",             │
│   "temperature": 72.5,                       │
│   "humidity": 45,                            │
│   "timestamp": "2024-01-15T10:30:00Z"        │
│ }                                            │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'REST API', explanation: 'POST to update state, GET to read state', icon: '🔌' },
    { title: 'Device ID', explanation: 'Unique identifier for each IoT device', icon: '🔑' },
    { title: 'Timestamp', explanation: 'When the sensor reading was taken', icon: '⏰' },
  ],
  quickCheck: {
    question: 'Why include a timestamp with each sensor reading?',
    options: [
      'To sort readings by time',
      'To detect stale data and measure data freshness',
      'To calculate time-based aggregates',
      'All of the above',
    ],
    correctIndex: 3,
    explanation: 'Timestamps are critical for IoT: they help detect stale data, enable time-series analysis, and support aggregation.',
  },
};

const step2: GuidedStep = {
  id: 'iot-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'App Server must handle device state updates and queries',
    taskDescription: 'Configure APIs and implement the Python handlers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/devices/*/state and GET /api/v1/devices/*/state APIs',
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
    level2: 'After assigning APIs, implement update_device_state() and get_device_state() in the Python editor',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: The Crisis - We Lost All Device States!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed and restarted.",
  hook: "When it came back online... ALL device states were GONE! Users see 'No data available' for their smart home devices!",
  challenge: "The problem: state was stored in server memory. When the server restarted, millions of device states vanished. We need persistent storage!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your device states are now safe!",
  achievement: "Device states persist even if the server restarts",
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted forever' },
    { label: 'Storage', after: 'Time-Series Database' },
  ],
  nextTeaser: "Good! But users are complaining that state queries are slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Why Time-Series Databases Matter',
  conceptExplanation: `Without a database, your app server stores data in memory (RAM).

**Problem**: RAM is volatile - when the server restarts, all device states are lost!

**Solution**: Store data in a database. For IoT, we need a **Time-Series Database** because:
- IoT data has a timestamp dimension
- Queries are often time-range based ("last hour", "last day")
- Automatic aggregation and downsampling
- Optimized compression for sensor data

**What we store**:
- Current device state (latest reading per device)
- Historical sensor data (time-series)
- Aggregates (hourly/daily averages)`,
  whyItMatters: 'Without persistent storage, all your device states disappear when the server restarts! Users expect their IoT data to be permanent.',
  realWorldExample: {
    company: 'Nest (Google)',
    scenario: 'Storing thermostat data for 200M+ devices',
    howTheyDoIt: 'Uses Cloud Bigtable (NoSQL time-series DB) for raw data and BigQuery for analytics. Keeps 30 days of raw data, aggregates for longer.',
  },
  famousIncident: {
    title: 'Fitbit Data Loss',
    company: 'Fitbit',
    year: '2016',
    whatHappened: 'A database migration went wrong and some users lost months of fitness data (steps, sleep, heart rate). The outrage was massive - people rely on their health data!',
    lessonLearned: 'IoT data is personal and valuable. Always have persistent storage with proper backups. Test migrations thoroughly.',
    icon: '⌚',
  },
  keyPoints: [
    'RAM is volatile, databases persist to disk',
    'Time-series DBs optimize for timestamp-based queries',
    'IoT generates massive write volume - DB must handle it',
    'Compression reduces storage costs by 10-50x',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────────┐
│ IoT Device  │ ────▶ │ App Server  │ ────▶ │  Time-Series DB    │
└─────────────┘       └─────────────┘       │                    │
                                            │ thermostat-001:    │
                                            │   t1: 72°F         │
                                            │   t2: 71.5°F       │
                                            │   t3: 72°F         │
                                            └────────────────────┘
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives restarts and crashes', icon: '💾' },
    { title: 'Time-Series', explanation: 'Data organized by timestamp for efficient queries', icon: '📈' },
    { title: 'Compression', explanation: 'Reduces storage by exploiting data patterns', icon: '🗜️' },
  ],
  quickCheck: {
    question: 'Why use a time-series database instead of a regular SQL database for IoT?',
    options: [
      'Time-series DBs are faster for all queries',
      'Time-series DBs optimize for timestamp-based queries and compression',
      'SQL databases cannot store timestamps',
      'Time-series DBs are cheaper',
    ],
    correctIndex: 1,
    explanation: 'Time-series DBs are optimized for timestamp-based queries, automatic aggregation, and efficient compression - perfect for IoT sensor data.',
  },
};

const step3: GuidedStep = {
  id: 'iot-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Device states must persist durably',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Processes device updates', displayName: 'App Server' },
      { type: 'database', reason: 'Stores device states persistently', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Devices send updates' },
      { from: 'App Server', to: 'Database', reason: 'Server persists device states' },
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
// STEP 4: The Slowdown - State Queries Are Too Slow
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your IoT platform is working! But users are complaining...",
  hook: '"Why does it take 200ms just to see my thermostat temperature?" Every query hits the database. That\'s expensive!',
  challenge: "Popular devices (dashboards, frequently-viewed sensors) are queried thousands of times per minute. We're hammering the database unnecessarily!",
  illustration: 'slow-turtle',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "State queries are now lightning fast!",
  achievement: "Popular device states are served from cache in milliseconds",
  metrics: [
    { label: 'Query latency', before: '200ms', after: '5ms' },
    { label: 'Database load', before: '100K queries/sec', after: '5K queries/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Great! But we're still writing every single device update to the database...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Device State Caching: The Secret to Low Latency',
  conceptExplanation: `**Key insight**: Most state queries ask for the LATEST reading from a device.

**The math**:
- Database query: 10-50ms
- Cache lookup: 1-5ms
- That's **10-50x faster!**

**How device state caching works**:
1. Device sends update → Write to DB AND cache
2. Application queries device state
3. **Cache HIT**: Return immediately from Redis (5ms)
4. **Cache MISS**: Query database, update cache, return (50ms)

**Write-through pattern** for IoT:
- Every device update writes to BOTH cache and database
- Cache always has the latest state
- Queries almost always hit cache (95%+ hit rate)`,
  whyItMatters: 'Without caching, every state query hits the database. At 100K queries/sec, the database becomes the bottleneck.',
  realWorldExample: {
    company: 'AWS IoT Core',
    scenario: 'Device Shadow service for billions of devices',
    howTheyDoIt: 'Uses DynamoDB for persistence and in-memory caching for latest state. Cache hit rate > 99% for active devices.',
  },
  famousIncident: {
    title: 'Ring Doorbell Outage',
    company: 'Ring (Amazon)',
    year: '2020',
    whatHappened: 'Ring\'s cloud service went down, making video doorbells unable to show live video or send alerts. The issue was traced to their backend database being overwhelmed during a traffic spike.',
    lessonLearned: 'Caching is essential for IoT at scale. The database cannot handle all read load - cache hot device states.',
    icon: '🔔',
  },
  keyPoints: [
    'Write-through pattern: Update cache AND database on every write',
    'Latest device state stays in cache with short TTL (30-60 seconds)',
    'Cache key format: device:{device_id}:state',
    '95%+ cache hit ratio for active devices',
  ],
  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 5ms (HIT!)
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Device │───▶│App Server│
└────────┘    └────┬─────┘
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 50ms (MISS)
                          └─────────────┘
`,
  keyConcepts: [
    { title: 'Write-Through', explanation: 'Write to cache AND database on every update', icon: '📝' },
    { title: 'Device Shadow', explanation: 'Cached representation of device state', icon: '👥' },
    { title: 'TTL', explanation: 'Time-To-Live: cache expires stale data automatically', icon: '⏰' },
  ],
  quickCheck: {
    question: 'Why use write-through caching for IoT device state?',
    options: [
      'It reduces write load on the database',
      'It ensures cache always has the latest state',
      'It\'s cheaper than other strategies',
      'It prevents cache misses completely',
    ],
    correctIndex: 1,
    explanation: 'Write-through ensures the cache is always up-to-date with the latest device state, giving high cache hit rates for state queries.',
  },
};

const step4: GuidedStep = {
  id: 'iot-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'State queries must be fast (< 50ms p99)',
    taskDescription: 'Build Client → App Server → Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Processes updates and queries', displayName: 'App Server' },
      { type: 'database', reason: 'Stores device states persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches latest device states', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Devices send updates' },
      { from: 'App Server', to: 'Database', reason: 'Server persists states' },
      { from: 'App Server', to: 'Cache', reason: 'Server caches latest states' },
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
    level1: 'Build the full system with a Cache for fast state lookups',
    level2: 'Add Client, App Server, Database, and Cache - connect App Server to both storage components',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: The Write Storm - Database Can't Keep Up!
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Morning rush hour! Millions of smart home devices just woke up.",
  hook: "Your database is at 95% CPU! It's receiving 333K writes/sec and can't keep up. Device updates are getting delayed and dropped!",
  challenge: "We need to buffer writes and batch them. The database doesn't need every single update - aggregate them!",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎊',
  message: "Database write load is under control!",
  achievement: "Message queue buffers writes, database handles aggregated batches",
  metrics: [
    { label: 'DB write load', before: '333K/sec', after: '10K/sec' },
    { label: 'Write buffering', after: 'Message Queue' },
    { label: 'Data loss risk', before: 'High', after: 'Zero' },
  ],
  nextTeaser: "Good! But users want to see sensor trends over time...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Sensor Data Aggregation: Managing Write Volume',
  conceptExplanation: `**The problem**: 333K writes/sec will overwhelm any database!

**The solution**: Message Queue + Background Aggregation

**How it works**:
1. Device update → App Server writes to Cache (fast!) AND Message Queue
2. Message Queue buffers writes (no data loss)
3. Background workers read from queue and batch writes to database
4. Workers aggregate data (e.g., average per minute instead of per second)

**Why this works**:
- Cache serves all reads (no DB impact)
- Queue smooths out traffic spikes
- Batching reduces DB writes by 10-100x
- Aggregation reduces storage by 60-90%`,
  whyItMatters: 'Without buffering and aggregation, your database will be crushed by IoT write volume. Queues provide the breathing room you need.',
  realWorldExample: {
    company: 'Tesla',
    scenario: 'Fleet telemetry from 5 million vehicles',
    howTheyDoIt: 'Uses Kafka to buffer vehicle telemetry, then Spark to aggregate and write to data warehouses. Raw telemetry is sampled/aggregated before storage.',
  },
  famousIncident: {
    title: 'Knight Capital Trading Loss',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Their trading system sent 4 million trades in 45 minutes due to a bug - overwhelming their database. They lost $440 million because they couldn\'t handle the write volume.',
    lessonLearned: 'Always buffer high-volume writes. Message queues prevent data loss and protect downstream systems.',
    icon: '📉',
  },
  keyPoints: [
    'Message Queue (Kafka/RabbitMQ) buffers device updates',
    'Background workers batch writes to database',
    'Aggregate data before storage (e.g., per-minute averages)',
    'Cache serves reads, queue protects writes',
  ],
  diagram: `
┌────────┐    ┌─────────┐    ┌─────────────┐
│ Device │───▶│   App   │───▶│    Cache    │ (reads)
└────────┘    │  Server │    └─────────────┘
              └────┬────┘
                   │
                   ▼
              ┌─────────────┐
              │   Message   │
              │    Queue    │
              └──────┬──────┘
                     │ batch
                     ▼
              ┌─────────────┐
              │  Database   │
              └─────────────┘
`,
  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffers writes and decouples ingestion from storage', icon: '📬' },
    { title: 'Batching', explanation: 'Group multiple writes into fewer DB operations', icon: '📦' },
    { title: 'Aggregation', explanation: 'Combine data points (avg per minute vs per second)', icon: '📊' },
  ],
  quickCheck: {
    question: 'What is the main benefit of using a message queue for IoT writes?',
    options: [
      'Makes writes faster',
      'Buffers writes to prevent data loss and protect the database',
      'Reduces storage costs',
      'Encrypts device data',
    ],
    correctIndex: 1,
    explanation: 'Message queues buffer writes during traffic spikes, preventing data loss and protecting the database from being overwhelmed.',
  },
};

const step5: GuidedStep = {
  id: 'iot-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle 333K writes/sec without overwhelming the database',
    taskDescription: 'Add Message Queue between App Server and Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Processes updates', displayName: 'App Server' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'database', reason: 'Stores aggregated data', displayName: 'Database' },
      { type: 'cache', reason: 'Serves state queries', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Devices send updates' },
      { from: 'App Server', to: 'Cache', reason: 'Write-through caching' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer writes' },
      { from: 'Message Queue', to: 'Database', reason: 'Batched writes' },
    ],
    successCriteria: ['Add Message Queue', 'Route writes through queue to database'],
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
    level1: 'Add a Message Queue between App Server and Database to buffer writes',
    level2: 'Connect: App Server → Cache (for reads) and App Server → Message Queue → Database (for writes)',
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
// STEP 6: Edge Caching - Bringing Data Closer to Users
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your IoT platform is going global! Users in Europe and Asia are joining.",
  hook: "But users in Tokyo are experiencing 300ms latency - too slow! Every query travels across the Pacific to your US datacenter.",
  challenge: "We need to bring the cache closer to users. Deploy edge caches in multiple regions!",
  illustration: 'global-map',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Global latency is now excellent!",
  achievement: "Edge caches serve queries from user's region",
  metrics: [
    { label: 'Tokyo latency', before: '300ms', after: '20ms' },
    { label: 'London latency', before: '250ms', after: '15ms' },
    { label: 'Edge cache hit rate', after: '98%' },
  ],
  nextTeaser: "Excellent! But what about high availability?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Edge Caching: Low Latency at Global Scale',
  conceptExplanation: `**The problem**: Speed of light is finite. Network latency increases with distance.

**Latency examples**:
- US West → US East: ~70ms
- US → Europe: ~150ms
- US → Asia: ~300ms

**The solution**: Edge Caching

Deploy cache servers in multiple regions:
- **US West** (Oregon)
- **US East** (Virginia)
- **Europe** (London)
- **Asia** (Tokyo)

**How it works**:
1. User queries device state
2. Request routes to nearest edge cache
3. Edge cache serves data (20ms instead of 300ms!)
4. On cache miss, query central database
5. Background sync keeps edge caches updated`,
  whyItMatters: 'For global IoT platforms, edge caching is the difference between 20ms and 300ms latency. Users notice!',
  realWorldExample: {
    company: 'Philips Hue',
    scenario: 'Smart lighting control for millions of users worldwide',
    howTheyDoIt: 'Uses CloudFlare Workers for edge compute and caching. Device states are cached at 200+ edge locations globally.',
  },
  keyPoints: [
    'Edge cache = cache server deployed close to users',
    'Reduces latency by avoiding cross-continent round trips',
    'Each region has its own Redis cluster',
    'Background sync keeps edge caches consistent',
  ],
  diagram: `
┌─────────────────────────────────────────────────┐
│              EDGE CACHING                       │
│                                                 │
│  User in Tokyo → Tokyo Edge Cache (20ms)       │
│  User in London → London Edge Cache (15ms)     │
│  User in SF → US West Edge Cache (5ms)         │
│                                                 │
│  All edge caches sync from central DB          │
└─────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Edge Location', explanation: 'Cache server deployed close to users', icon: '📍' },
    { title: 'Geo-Routing', explanation: 'Route requests to nearest edge', icon: '🗺️' },
    { title: 'Cache Sync', explanation: 'Keep edge caches updated with central data', icon: '🔄' },
  ],
  quickCheck: {
    question: 'Why does edge caching reduce latency?',
    options: [
      'Edge caches are faster computers',
      'Edge caches are closer to users, reducing network round trip time',
      'Edge caches compress data better',
      'Edge caches store more data',
    ],
    correctIndex: 1,
    explanation: 'Edge caches are geographically closer to users, reducing network round trip time from 300ms to 20ms.',
  },
};

const step6: GuidedStep = {
  id: 'iot-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Global users need low-latency access (< 50ms p99)',
    taskDescription: 'Configure cache for edge deployment across regions',
    componentsNeeded: [
      { type: 'client', reason: 'Global IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Processes updates', displayName: 'App Server' },
      { type: 'cache', reason: 'Configure for edge deployment', displayName: 'Edge Cache' },
      { type: 'message_queue', reason: 'Buffers writes', displayName: 'Message Queue' },
      { type: 'database', reason: 'Central storage', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Devices send updates' },
      { from: 'App Server', to: 'Cache', reason: 'Edge caching' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer writes' },
      { from: 'Message Queue', to: 'Database', reason: 'Persistence' },
    ],
    successCriteria: ['Build full system with edge cache configuration'],
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
    level1: 'Configure cache for multi-region edge deployment',
    level2: 'Click on Cache component and enable edge deployment settings',
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
// STEP 7: High Availability - Surviving Failures
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your database crashed!",
  hook: "All device states are inaccessible! Smart homes are offline! Your boss is calling!",
  challenge: "Single points of failure are deadly. We need database replication for high availability.",
  illustration: 'server-crash',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your system is now highly available!",
  achievement: "Database replication ensures service survives failures",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Data loss risk', before: 'High', after: 'Near zero' },
    { label: 'Failover time', after: '< 30 seconds' },
  ],
  nextTeaser: "Almost there! Let's optimize aggregation queries...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for IoT',
  conceptExplanation: `**Single database = single point of failure**

When your database crashes, your entire IoT platform goes dark!

**Solution**: Database Replication

**For IoT time-series data**, use:
- **Primary**: Handles all writes from message queue
- **Replicas (2-3)**: Handle read queries and aggregations
- **Automatic failover**: If primary fails, promote a replica

**Why this works for IoT**:
- Writes go to primary only (consistency)
- Reads distributed across replicas (scalability)
- Aggregation queries run on replicas (no impact on writes)
- Survives single database failure`,
  whyItMatters: 'IoT platforms must be reliable - devices and users depend on them 24/7. Replication provides availability and disaster recovery.',
  realWorldExample: {
    company: 'Honeywell',
    scenario: 'Industrial IoT sensors in factories worldwide',
    howTheyDoIt: 'Multi-region database replication with automatic failover. Can survive entire datacenter outages without losing sensor data.',
  },
  famousIncident: {
    title: 'Cloudflare Total Outage',
    company: 'Cloudflare',
    year: '2020',
    whatHappened: 'A bad router configuration took down their entire network for 27 minutes. Millions of websites went offline. Their IoT customers lost device connectivity globally.',
    lessonLearned: 'Single points of failure are catastrophic. Multi-region, multi-cloud redundancy is essential for critical infrastructure.',
    icon: '☁️',
  },
  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'Automatic failover on primary failure',
    '2-3 replicas provide 99.99% availability',
    'Aggregation queries run on replicas',
  ],
  diagram: `
┌──────────────────────────────────────────┐
│       DATABASE REPLICATION               │
│                                          │
│   ┌─────────┐                            │
│   │ Primary │ ← writes from queue        │
│   └────┬────┘                            │
│        │                                 │
│        │ replicates                      │
│        │                                 │
│   ┌────┴────┐                            │
│   │         │                            │
│   ▼         ▼                            │
│ ┌────┐   ┌────┐                          │
│ │Rep1│   │Rep2│ ← read queries           │
│ └────┘   └────┘                          │
│                                          │
│ If Primary fails → Promote Replica       │
└──────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Primary', explanation: 'Main database handling writes', icon: '🎯' },
    { title: 'Replica', explanation: 'Read-only copy for queries and failover', icon: '📋' },
    { title: 'Failover', explanation: 'Automatic switch to replica if primary fails', icon: '🔄' },
  ],
  quickCheck: {
    question: 'Why run aggregation queries on replicas instead of the primary?',
    options: [
      'Replicas are faster',
      'To avoid impacting write performance on the primary',
      'Replicas have more storage',
      'It\'s required by the database',
    ],
    correctIndex: 1,
    explanation: 'Aggregation queries are expensive. Running them on replicas prevents them from slowing down writes on the primary.',
  },
};

const step7: GuidedStep = {
  id: 'iot-cache-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must survive database failures (99.99% availability)',
    taskDescription: 'Configure database replication with automatic failover',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Processes updates', displayName: 'App Server' },
      { type: 'cache', reason: 'Edge caching', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Write buffering', displayName: 'Message Queue' },
      { type: 'database', reason: 'Configure replication', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Device updates' },
      { from: 'App Server', to: 'Cache', reason: 'State queries' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer writes' },
      { from: 'Message Queue', to: 'Database', reason: 'Persist data' },
    ],
    successCriteria: ['Build full system', 'Enable database replication with 2+ replicas'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Click on Database and enable replication',
    level2: 'Configure Database with 2-3 replicas for high availability',
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
// STEP 8: The Final Exam - Complete IoT Cache System
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎓',
  scenario: "Final Exam! Your IoT platform is ready for production.",
  hook: "Time to prove your system can handle the real world: millions of devices, global users, and high availability requirements.",
  challenge: "Build a complete system that passes all production test cases while staying within budget!",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Congratulations! You built a production-ready IoT cache system!",
  achievement: "Complete system design validated against real-world test cases",
  metrics: [
    { label: 'Test cases passed', after: 'All ✓' },
    { label: 'Latency SLA', after: 'Met ✓' },
    { label: 'Availability', after: '99.99% ✓' },
  ],
  nextTeaser: "You've mastered IoT device caching! Try 'Solve on Your Own' mode or tackle a new challenge!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Complete IoT Cache Architecture',
  conceptExplanation: `You've built a production-ready IoT cache system!

**Key components**:
1. **Edge Cache**: Low latency for global users
2. **Message Queue**: Buffers high write volume
3. **Database Replication**: High availability
4. **Aggregation**: Efficient time-series queries

**Your architecture handles**:
- 333K device updates/sec
- 100K state queries/sec
- Global users with < 50ms latency
- 99.99% availability
- Sensor data aggregation`,
  whyItMatters: 'This architecture pattern applies to any high-volume IoT system - from smart homes to industrial sensors to connected vehicles.',
  realWorldExample: {
    company: 'Spotify',
    scenario: 'Although not IoT, Spotify uses similar patterns for music streaming',
    howTheyDoIt: 'Edge caching for audio, message queues for play counts, time-series aggregation for analytics. Same principles!',
  },
  keyPoints: [
    'Write-through caching for latest device state',
    'Message queues buffer high write volume',
    'Edge caching reduces global latency',
    'Database replication ensures availability',
    'Pre-compute aggregations for fast queries',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│         COMPLETE IOT CACHE SYSTEM              │
│                                                │
│  IoT Devices → App Server → Edge Cache        │
│                      ↓                         │
│                Message Queue                   │
│                      ↓                         │
│               Database (Replicated)            │
│                                                │
│  ✓ 333K writes/sec                             │
│  ✓ 100K reads/sec                              │
│  ✓ < 50ms latency                              │
│  ✓ 99.99% availability                         │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Complete System', explanation: 'All components working together', icon: '🏗️' },
    { title: 'Production Ready', explanation: 'Meets real-world requirements', icon: '✅' },
    { title: 'IoT Patterns', explanation: 'Applicable to any IoT use case', icon: '🔁' },
  ],
};

const step8: GuidedStep = {
  id: 'iot-cache-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Final Exam: Pass all production test cases',
    taskDescription: 'Build complete system that meets all requirements',
    componentsNeeded: [
      { type: 'client', reason: 'IoT devices', displayName: 'IoT Devices' },
      { type: 'app_server', reason: 'Processes updates', displayName: 'App Server' },
      { type: 'cache', reason: 'Edge caching', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Write buffering', displayName: 'Message Queue' },
      { type: 'database', reason: 'Replicated storage', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Device updates' },
      { from: 'App Server', to: 'Cache', reason: 'State queries' },
      { from: 'App Server', to: 'Message Queue', reason: 'Buffer writes' },
      { from: 'Message Queue', to: 'Database', reason: 'Persist data' },
    ],
    successCriteria: [
      'Pass all functional requirements',
      'Pass all non-functional requirements',
      'Meet latency and availability SLAs',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Build complete system with all components and configurations',
    level2: 'Ensure edge caching, message queue buffering, and database replication are all configured',
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

export const iotDeviceCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'iot-device-cache-guided',
  problemTitle: 'Build IoT Device Cache - A System Design Journey',

  requirementsPhase: iotDeviceCacheRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Devices can report state and applications can query it',
      traffic: { type: 'mixed', rps: 100, readRps: 30, writeRps: 70 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fast State Queries',
      type: 'functional',
      requirement: 'FR-2',
      description: 'State queries return within latency target',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'High Write Throughput',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Handle high volume of device updates without data loss',
      traffic: { type: 'write', rps: 5000, writeRps: 5000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Sensor Data Aggregation',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Provide time-based aggregates efficiently',
      traffic: { type: 'mixed', rps: 1000, readRps: 500, writeRps: 500 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Global Edge Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Serve global users with low latency via edge caching',
      traffic: { type: 'read', rps: 2000, readRps: 2000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 3x traffic spike (morning rush)',
      traffic: { type: 'mixed', rps: 10000, readRps: 3000, writeRps: 7000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Maintain availability during database failure',
      traffic: { type: 'mixed', rps: 2000, readRps: 700, writeRps: 1300 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.999, maxDowntime: 5, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getIotDeviceCacheGuidedTutorial(): GuidedTutorial {
  return iotDeviceCacheGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = iotDeviceCacheRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= iotDeviceCacheRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
