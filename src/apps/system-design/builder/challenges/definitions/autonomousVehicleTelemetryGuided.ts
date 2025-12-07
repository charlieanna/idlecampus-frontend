import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Autonomous Vehicle Telemetry Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches real-time data ingestion and edge computing
 * while building a telemetry system for self-driving cars.
 *
 * Focus:
 * - High-volume sensor data ingestion
 * - Edge processing for low latency
 * - Fleet management and monitoring
 * - Incident recording and analysis
 * - Safety-critical system design
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview - sensor data, safety, edge processing)
 * Steps 1-3: Build basic telemetry ingestion
 * Steps 4-6: Add edge computing, fleet management, incident recording
 *
 * Key Concepts:
 * - High-frequency time-series data
 * - Edge computing for latency-sensitive processing
 * - Data aggregation and downsampling
 * - Incident detection and recording
 * - Fleet-wide monitoring and analytics
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const autonomousVehicleRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a telemetry system for a fleet of autonomous vehicles",

  interviewer: {
    name: 'Dr. Sarah Chen',
    role: 'VP of Engineering at AutoDrive',
    avatar: '🚗',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What kind of data do autonomous vehicles need to send to the cloud?",
      answer: "Autonomous vehicles generate massive amounts of sensor data:\n\n1. **Camera feeds**: 8 cameras, 30 FPS, HD video\n2. **LIDAR scans**: 10 Hz, 3D point clouds\n3. **Radar data**: Multiple radar sensors, 20 Hz\n4. **GPS/IMU**: Position, velocity, acceleration at 100 Hz\n5. **Vehicle state**: Speed, steering, braking, battery at 10 Hz\n6. **System health**: CPU, memory, temperature, diagnostics at 1 Hz\n\nNot all data goes to cloud - we process most at the edge and only send summaries, incidents, and samples.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Autonomous vehicles generate 4TB/hour of raw data - edge processing is essential",
    },
    {
      id: 'edge-vs-cloud',
      category: 'functional',
      question: "What data must be processed at the edge vs in the cloud?",
      answer: "**Edge processing (real-time, < 100ms):**\n- Obstacle detection\n- Lane keeping\n- Emergency braking decisions\n- Immediate safety systems\n\n**Cloud processing (batch, seconds to minutes):**\n- Fleet analytics\n- Route optimization\n- ML model training\n- Long-term diagnostics\n\n**What we send to cloud:**\n- Downsampled sensor data (1% of raw volume)\n- Aggregated metrics (every 10 seconds)\n- Incident recordings (full fidelity when something notable happens)\n- System health snapshots",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Edge processing handles safety-critical decisions; cloud handles analytics and learning",
    },
    {
      id: 'incident-recording',
      category: 'functional',
      question: "What happens when the vehicle detects something unusual or dangerous?",
      answer: "When an incident is detected (near-collision, hard braking, system error), we need to capture everything:\n\n1. **Buffer**: Keep last 30 seconds of all sensor data in memory\n2. **Trigger**: On incident, save buffer + next 10 seconds\n3. **Upload**: Send high-fidelity incident data to cloud (might be 5-10 GB)\n4. **Priority**: Incident uploads get priority over normal telemetry\n5. **Local storage**: If offline, store locally and upload when connected\n\nThis is like a 'black box' for autonomous vehicles.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Incident recording is critical for debugging, safety analysis, and regulatory compliance",
    },
    {
      id: 'fleet-monitoring',
      category: 'functional',
      question: "How do operators monitor the entire fleet?",
      answer: "Fleet operators need a real-time dashboard showing:\n\n1. **Live map**: All vehicles, their locations, and status\n2. **Health metrics**: Battery, system errors, connectivity\n3. **Alerts**: Vehicles needing attention\n4. **Aggregated stats**: Fleet-wide metrics (miles driven, incidents, efficiency)\n\nOperators should see updates within 5 seconds of vehicle state changes.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Fleet monitoring requires real-time aggregation across thousands of vehicles",
    },
    {
      id: 'data-retention',
      category: 'clarification',
      question: "How long do we need to keep telemetry data?",
      answer: "Different retention policies:\n\n1. **Raw sensor data**: Only stored in incidents, keep 90 days\n2. **Aggregated metrics**: Keep 1 year\n3. **Incident recordings**: Keep 7 years (regulatory requirement)\n4. **System logs**: Keep 30 days\n\nAfter retention period, archive to cold storage or delete.",
      importance: 'important',
      insight: "Data retention drives storage costs - most raw data is ephemeral",
    },
    {
      id: 'offline-operation',
      category: 'clarification',
      question: "What happens when a vehicle loses connectivity?",
      answer: "Vehicles must operate autonomously without cloud connectivity:\n\n1. **Edge independence**: All safety-critical decisions at edge\n2. **Local buffering**: Store telemetry locally (up to 100 GB on-vehicle SSD)\n3. **Graceful degradation**: Continue driving, just no live updates\n4. **Backfill**: Upload buffered data when reconnected\n\nConnectivity is for telemetry and fleet management, NOT for driving safety.",
      importance: 'critical',
      insight: "Edge systems must be fully autonomous - cloud is for observability, not control",
    },

    // SCALE & NFRs
    {
      id: 'fleet-size',
      category: 'throughput',
      question: "How many vehicles are in the fleet?",
      answer: "Start with 10,000 vehicles, scaling to 100,000 within 2 years. Each vehicle operates 8-12 hours per day in urban environments.",
      importance: 'critical',
      calculation: {
        formula: "10K vehicles × 10 hours/day average utilization",
        result: "~4,200 vehicles online at peak (40% concurrent)",
      },
      learningPoint: "Fleet size determines ingestion capacity and storage requirements",
    },
    {
      id: 'data-volume',
      category: 'throughput',
      question: "How much data does each vehicle send per hour?",
      answer: "After edge processing and downsampling:\n\n1. **Normal telemetry**: ~50 MB/hour per vehicle (continuous stream)\n2. **Incident data**: ~5 GB per incident (rare, maybe 1-2 per day)\n3. **Total fleet**: 10K vehicles × 50 MB/hour × 10 hours = 5 TB/day normal + incidents\n\nRaw sensor data is 4 TB/hour per vehicle, but 99.9% is processed at edge and discarded.",
      importance: 'critical',
      calculation: {
        formula: "10K vehicles × 50 MB/hour × 10 hours/day",
        result: "5 TB/day ingestion, 150 TB/month",
      },
      learningPoint: "Edge processing reduces cloud ingestion by 1000x",
    },
    {
      id: 'write-throughput',
      category: 'throughput',
      question: "What's the write throughput to the telemetry database?",
      answer: "With 4,200 vehicles online at peak, each sending metrics every second:\n\n- 4,200 vehicles × 1 write/second = 4,200 writes/second\n- Each write contains ~10 KB of aggregated sensor data\n- Peak throughput: ~42 MB/second write load\n\nIncident uploads are separate (blob storage), not counted in time-series database writes.",
      importance: 'critical',
      calculation: {
        formula: "4,200 concurrent vehicles × 1 write/sec × 10 KB",
        result: "4,200 writes/sec, 42 MB/sec",
      },
      learningPoint: "Time-series databases are optimized for high-frequency writes",
    },
    {
      id: 'latency-telemetry',
      category: 'latency',
      question: "How quickly must telemetry data appear in the dashboard?",
      answer: "Fleet dashboard should show near real-time updates:\n\n- Vehicle location/status: Update within 5 seconds\n- Health alerts: Update within 10 seconds\n- Aggregated metrics: Update within 30 seconds\n\nThis is for monitoring, not control - slight delays are acceptable.",
      importance: 'important',
      learningPoint: "Monitoring latency requirements are much looser than edge processing latency",
    },
    {
      id: 'latency-edge',
      category: 'latency',
      question: "What's the latency requirement for edge processing?",
      answer: "Safety-critical edge processing must be extremely fast:\n\n- Sensor data pipeline: < 50 ms end-to-end\n- Obstacle detection: < 100 ms\n- Emergency decisions: < 100 ms\n\nThis is why we can't rely on cloud - network latency alone is 50-200ms.",
      importance: 'critical',
      learningPoint: "Edge computing is essential when latency requirements are < 100ms",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What are the availability requirements for the telemetry system?",
      answer: "**Telemetry system**: 99.9% availability (acceptable to lose some telemetry)\n\n**Edge systems**: 99.99% availability (safety-critical)\n\nKey principle: Vehicles continue driving even if telemetry system is down. Edge is independent.",
      importance: 'important',
      insight: "Observability systems can have lower availability than the systems they observe",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'edge-vs-cloud', 'incident-recording'],
  criticalFRQuestionIds: ['core-functionality', 'edge-vs-cloud', 'incident-recording'],
  criticalScaleQuestionIds: ['data-volume', 'write-throughput', 'latency-edge'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Ingest sensor data from vehicles',
      description: 'Collect downsampled sensor data, metrics, and system health from fleet',
      emoji: '📡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Process safety-critical data at edge',
      description: 'Edge computing for real-time obstacle detection and emergency decisions',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Record and upload incidents',
      description: 'Capture high-fidelity sensor data during incidents for analysis',
      emoji: '📹',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Monitor fleet in real-time',
      description: 'Dashboard showing live vehicle locations, status, and health',
      emoji: '🗺️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000 vehicles (4,200 concurrent at peak)',
    writesPerDay: '363 million telemetry writes',
    readsPerDay: '100 million dashboard queries',
    peakMultiplier: 1.5,
    readWriteRatio: '1:3',
    calculatedWriteRPS: { average: 4200, peak: 6300 },
    calculatedReadRPS: { average: 1157, peak: 1736 },
    maxPayloadSize: '~10 KB (aggregated metrics)',
    storagePerRecord: '~10 KB',
    storageGrowthPerYear: '~1.8 PB (5 TB/day × 365)',
    redirectLatencySLA: 'p99 < 5s (dashboard updates)',
    createLatencySLA: 'p99 < 100ms (edge processing)',
  },

  architecturalImplications: [
    '✅ High-frequency writes → Time-series database (InfluxDB, TimescaleDB)',
    '✅ Edge processing required → On-vehicle compute, local ML models',
    '✅ Large incident files → Object storage (S3) for recordings',
    '✅ Real-time monitoring → Message queue + streaming pipeline',
    '✅ 5 TB/day ingestion → Distributed ingestion tier with sharding',
    '✅ Fleet-wide analytics → Data warehouse for batch processing',
  ],

  outOfScope: [
    'Autonomous driving logic (only telemetry)',
    'ML model training (only inference at edge)',
    'Map updates and routing',
    'Customer-facing apps',
    'Vehicle-to-vehicle communication',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system to ingest telemetry from vehicles. Then we'll add edge processing, incident recording, and fleet monitoring. Start simple, then optimize!",
};

// =============================================================================
// STEP 1: Connect Vehicles to Ingestion Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚗',
  scenario: "Welcome to AutoDrive! You've been hired to build the telemetry system for our autonomous vehicle fleet.",
  hook: "Right now, vehicles have no way to send data to the cloud. Engineers can't see what's happening in the fleet!",
  challenge: "Connect vehicles to an ingestion service so they can start sending telemetry data.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Vehicles are connected!",
  achievement: "Telemetry data is now flowing from vehicles to your ingestion service",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Vehicles connected', after: '10,000' },
  ],
  nextTeaser: "But where is all this data going?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Telemetry Ingestion: Collecting Data from the Edge',
  conceptExplanation: `Autonomous vehicles are **edge devices** that generate continuous streams of data.

**The Challenge:**
- 10,000 vehicles, each sending metrics every second
- 4,200 writes/second at peak
- Data must flow reliably even during network issues
- Vehicles are mobile - connectivity is intermittent

**Ingestion Service:**
An app server that receives HTTP/GRPC requests from vehicles:
1. Vehicle sends batch of metrics (10 KB, last 10 seconds)
2. Ingestion service validates and acknowledges
3. Service forwards to storage/processing pipeline

This is the entry point for all vehicle telemetry.`,

  whyItMatters: 'Without reliable ingestion, you lose visibility into your fleet. Dropped telemetry means blind spots in monitoring.',

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Fleet telemetry from 4+ million vehicles',
    howTheyDoIt: 'Vehicles send telemetry over LTE/5G to cloud ingestion endpoints, with local buffering for offline periods',
  },

  keyPoints: [
    'Vehicles are edge devices that generate continuous telemetry',
    'Ingestion service is the entry point for all vehicle data',
    'Must handle thousands of concurrent connections',
    'Vehicles batch data (e.g., 10 seconds) to reduce request overhead',
  ],

  diagram: `
[Vehicle 1] ──┐
[Vehicle 2] ──┤
[Vehicle 3] ──┼──▶ [Ingestion Service] ──▶ (Storage/Processing)
  ...         │
[Vehicle N] ──┘

Each vehicle sends metrics every 1-10 seconds
`,

  interviewTip: 'Always start with the data flow: where does data enter the system? For IoT/telemetry systems, start with ingestion.',
};

const step1: GuidedStep = {
  id: 'av-telemetry-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'FR-1: Ingest sensor data from vehicles',
    taskDescription: 'Add Client (representing vehicles) and App Server (ingestion service), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents autonomous vehicles sending telemetry', displayName: 'Vehicles' },
      { type: 'app_server', reason: 'Ingestion service receives and validates telemetry', displayName: 'Ingestion Service' },
    ],
    connectionsNeeded: [
      { from: 'Vehicles', to: 'Ingestion Service', reason: 'Vehicles send telemetry batches' },
    ],
    successCriteria: ['Add Client (Vehicles)', 'Add App Server (Ingestion Service)', 'Connect Vehicles → Ingestion Service'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Add a Client and an App Server, then connect them',
    level2: 'Client represents vehicles, App Server is the ingestion service that receives telemetry',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Time-Series Database for Telemetry Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Your ingestion service is receiving telemetry! But it's just logging to files.",
  hook: "Engineers want to query historical data: 'Show me battery voltage for vehicle #1234 over the last hour.' Files won't work!",
  challenge: "Add a time-series database to store and query telemetry efficiently.",
  illustration: 'database',
};

const step2Celebration: CelebrationContent = {
  emoji: '📊',
  message: "Telemetry is now stored and queryable!",
  achievement: "Time-series database handles high-frequency writes and time-based queries",
  metrics: [
    { label: 'Write throughput', after: '4,200 writes/sec' },
    { label: 'Data retention', after: '1 year' },
  ],
  nextTeaser: "But the ingestion service is becoming a bottleneck...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Databases for Telemetry',
  conceptExplanation: `Telemetry data is **time-series data**: timestamped metrics over time.

**Why regular databases struggle:**
- High write rate (4,200 writes/sec)
- Time-based queries ("last hour", "yesterday")
- Data grows unbounded (need compression/retention)
- Range scans over time windows

**Time-Series Database (e.g., InfluxDB, TimescaleDB):**
- Optimized for timestamp-indexed writes
- Automatic downsampling and retention policies
- Efficient compression (10x better than regular DB)
- Fast queries like: "AVG(speed) WHERE vehicle_id=1234 AND time > now() - 1h"

**Data model:**
\`\`\`
vehicle_telemetry {
  timestamp: 2024-01-15T10:30:45Z
  vehicle_id: 1234
  speed: 45.2 mph
  battery: 78%
  location: {lat: 37.7749, lon: -122.4194}
  ...
}
\`\`\``,

  whyItMatters: 'Time-series databases are 10-100x more efficient than regular databases for telemetry workloads.',

  realWorldExample: {
    company: 'Waymo',
    scenario: 'Storing telemetry from 700+ autonomous vehicles',
    howTheyDoIt: 'Uses time-series databases with automated retention policies (raw data: 30 days, aggregated: 1 year)',
  },

  famousIncident: {
    title: 'Uber ATG Incident Data Loss',
    company: 'Uber',
    year: '2018',
    whatHappened: 'Uber\'s self-driving car struck a pedestrian. Investigators needed telemetry from the moments before impact, but the system had incomplete data due to storage issues. The lack of proper time-series storage meant critical data was lost.',
    lessonLearned: 'Safety-critical telemetry requires reliable, high-retention storage. Time-series databases with retention policies are essential.',
    icon: '⚠️',
  },

  keyPoints: [
    'Time-series databases optimize for timestamp-indexed writes',
    'Support automatic retention policies (e.g., delete after 1 year)',
    'Compression reduces storage 10x compared to regular databases',
    'Fast time-range queries for dashboards and analysis',
  ],

  diagram: `
[Ingestion Service] ──▶ [Time-Series DB]
                           │
                           ├─ vehicle_telemetry table
                           │  └─ timestamp (indexed)
                           │  └─ vehicle_id
                           │  └─ metrics (speed, battery, etc.)
                           │
                           └─ Retention: 1 year
                              Compression: 10x
`,

  keyConcepts: [
    { title: 'Time-Series Data', explanation: 'Timestamped measurements over time', icon: '📈' },
    { title: 'Retention Policy', explanation: 'Automatic deletion of old data', icon: '🗑️' },
    { title: 'Downsampling', explanation: 'Reduce granularity of old data', icon: '⬇️' },
  ],

  quickCheck: {
    question: 'Why use a time-series database instead of a regular SQL database?',
    options: [
      'It\'s cheaper',
      'Optimized for high-frequency writes and time-range queries',
      'It\'s easier to use',
      'Better for transactions',
    ],
    correctIndex: 1,
    explanation: 'Time-series databases are optimized for telemetry patterns: high write rate, time-indexed queries, and compression.',
  },
};

const step2: GuidedStep = {
  id: 'av-telemetry-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1: Store telemetry data efficiently',
    taskDescription: 'Add a Database (time-series) and connect Ingestion Service to it',
    componentsNeeded: [
      { type: 'database', reason: 'Time-series database stores telemetry efficiently', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'Ingestion Service', to: 'Time-Series DB', reason: 'Ingestion service writes telemetry' },
    ],
    successCriteria: ['Add Database', 'Connect Ingestion Service → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database and connect Ingestion Service to it',
    level2: 'The database will store time-series telemetry data from vehicles',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Message Queue for Asynchronous Processing
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📬',
  scenario: "Your ingestion service is handling 4,200 requests/sec, but it's doing too much!",
  hook: "Each request does: validate data, write to database, update dashboard, check for alerts. Latency is climbing and vehicles are timing out!",
  challenge: "Add a message queue to decouple ingestion from processing.",
  illustration: 'message-queue',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Ingestion is now blazing fast!",
  achievement: "Message queue decouples ingestion from processing",
  metrics: [
    { label: 'Ingestion latency', before: '500ms', after: '50ms' },
    { label: 'Vehicle timeouts', before: '5%', after: '0%' },
  ],
  nextTeaser: "But all processing is still in the cloud. What about edge computing?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues for Asynchronous Telemetry Processing',
  conceptExplanation: `The ingestion service is doing too much synchronously:
1. Receive telemetry from vehicle
2. Validate data
3. Write to time-series database ← slow!
4. Update real-time dashboard ← slow!
5. Check for alerts/anomalies ← slow!
6. Respond to vehicle

If any step is slow, the vehicle waits. At 4,200 requests/sec, this doesn't scale.

**Message Queue Solution:**
1. Ingestion service: Receive → Validate → **Publish to queue** → Respond (fast!)
2. Worker services subscribe to queue and process asynchronously
3. Workers: Write to DB, update dashboards, check alerts in parallel

**Benefits:**
- Ingestion is fast (< 50ms)
- Processing can scale independently
- Retries and fault tolerance
- Backpressure management`,

  whyItMatters: 'Asynchronous processing separates fast ingestion from slow processing, enabling scale.',

  realWorldExample: {
    company: 'Tesla',
    scenario: 'Processing telemetry from millions of vehicles',
    howTheyDoIt: 'Uses Kafka message queues to buffer ingestion spikes and process telemetry asynchronously',
  },

  keyPoints: [
    'Decouple fast ingestion from slow processing',
    'Message queue buffers data for asynchronous workers',
    'Workers can scale independently of ingestion',
    'Provides retry logic and fault tolerance',
  ],

  diagram: `
[Vehicles] ──▶ [Ingestion] ──publish──▶ [Message Queue]
               ↑ Fast response                │
               └────────────────────────┐     │ subscribe
                                        │     ▼
                                        └─ [Workers]
                                              │
                                              ├──▶ [Time-Series DB]
                                              ├──▶ [Dashboard]
                                              └──▶ [Alerts]
`,

  keyConcepts: [
    { title: 'Asynchronous Processing', explanation: 'Process later, respond now', icon: '⏱️' },
    { title: 'Pub/Sub', explanation: 'Publishers and subscribers decoupled', icon: '📡' },
    { title: 'Backpressure', explanation: 'Queue absorbs traffic spikes', icon: '🌊' },
  ],

  quickCheck: {
    question: 'Why add a message queue between ingestion and processing?',
    options: [
      'It\'s required for databases',
      'Decouples fast ingestion from slow processing',
      'It makes the system cheaper',
      'Vehicles prefer queues',
    ],
    correctIndex: 1,
    explanation: 'Message queues allow ingestion to respond quickly while processing happens asynchronously.',
  },
};

const step3: GuidedStep = {
  id: 'av-telemetry-step-3',
  stepNumber: 3,
  frIndex: 0,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-1: Decouple ingestion from processing',
    taskDescription: 'Add Message Queue between Ingestion Service and Database',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffers telemetry for asynchronous processing', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Ingestion Service', to: 'Message Queue', reason: 'Publish telemetry messages' },
      { from: 'Message Queue', to: 'Time-Series DB', reason: 'Workers consume and write to DB' },
    ],
    successCriteria: ['Add Message Queue', 'Reroute: Ingestion → Queue → Database'],
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
    level1: 'Add Message Queue between Ingestion Service and Database',
    level2: 'Flow: Ingestion Service → Message Queue → Database (workers)',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Edge Computing for Real-Time Processing
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your cloud telemetry system is working great! But safety engineers have a problem...",
  hook: "Obstacle detection takes 250ms: 50ms edge → 200ms cloud processing. By the time we detect an obstacle, the car has moved 10 feet at highway speed!",
  challenge: "Add edge computing to process safety-critical data locally on the vehicle.",
  illustration: 'edge-computing',
};

const step4Celebration: CelebrationContent = {
  emoji: '🏎️',
  message: "Edge processing is live!",
  achievement: "Safety-critical decisions now happen in < 100ms at the edge",
  metrics: [
    { label: 'Obstacle detection latency', before: '250ms', after: '50ms' },
    { label: 'Processing location', before: 'Cloud', after: 'Edge' },
  ],
  nextTeaser: "But how do we store incident recordings?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Edge Computing for Safety-Critical Processing',
  conceptExplanation: `**The Latency Problem:**
Autonomous vehicles need to react in < 100ms:
- 60 mph = 88 feet per second
- 100ms delay = 8.8 feet of travel
- Network latency to cloud: 50-200ms
- Processing in cloud: 50-100ms
- **Total: 100-300ms - TOO SLOW!**

**Edge Computing Solution:**
Deploy compute on the vehicle itself:
- **Edge CPU/GPU**: Powerful computer in the vehicle
- **Local ML models**: Object detection, lane keeping, etc.
- **Real-time processing**: < 50ms sensor → decision pipeline
- **Cloud-independent**: Works offline

**What runs at edge:**
- Camera/LIDAR processing
- Obstacle detection
- Lane keeping
- Emergency braking
- Local data buffering

**What runs in cloud:**
- Fleet analytics
- ML model training
- Incident analysis
- Route optimization`,

  whyItMatters: 'Safety-critical systems cannot rely on cloud latency. Edge computing keeps processing under 100ms.',

  realWorldExample: {
    company: 'Waymo',
    scenario: 'Real-time obstacle detection',
    howTheyDoIt: 'NVIDIA Drive AGX computers in each vehicle run object detection at 30 FPS (33ms latency)',
  },

  famousIncident: {
    title: 'Tesla Autopilot Cloud Dependency',
    company: 'Tesla',
    year: '2019',
    whatHappened: 'Early Tesla Autopilot versions relied on cloud processing for some features. During AWS outages in certain regions, some Autopilot features degraded. Tesla learned to move all safety-critical processing to the edge (vehicle computer).',
    lessonLearned: 'Never depend on cloud for safety-critical real-time decisions. Edge must be fully autonomous.',
    icon: '🚨',
  },

  keyPoints: [
    'Safety-critical processing must happen at the edge (< 100ms)',
    'Cloud latency (50-200ms) is too slow for real-time decisions',
    'Edge computers run ML models locally for object detection',
    'Cloud is for analytics and training, not real-time control',
  ],

  diagram: `
┌─────────────────────────────────────┐
│         Vehicle (Edge)              │
│                                     │
│  [Sensors] ──▶ [Edge Computer]     │
│                    │                │
│                    ├─▶ [ML Models]  │
│                    │   (50ms)       │
│                    ▼                │
│              [Driving Decisions]    │
│                    │                │
│                    └─▶ [Telemetry]  │
│                         (async)     │
└─────────────┬───────────────────────┘
              │ Telemetry only
              ▼
         [Cloud System]
         (Analytics, Training)
`,

  keyConcepts: [
    { title: 'Edge Computing', explanation: 'Processing at the data source', icon: '💻' },
    { title: 'Latency Budget', explanation: 'Time allowed for processing', icon: '⏱️' },
    { title: 'Autonomy', explanation: 'Edge operates independently of cloud', icon: '🔋' },
  ],

  quickCheck: {
    question: 'Why must obstacle detection run at the edge, not in the cloud?',
    options: [
      'Edge is cheaper',
      'Cloud latency (100-300ms) is too slow for safety decisions',
      'Edge has better ML models',
      'Cloud storage is full',
    ],
    correctIndex: 1,
    explanation: 'Network and processing latency to cloud (100-300ms) exceeds safety requirements (< 100ms).',
  },
};

const step4: GuidedStep = {
  id: 'av-telemetry-step-4',
  stepNumber: 4,
  frIndex: 1,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-2: Process safety-critical data at edge',
    taskDescription: 'Add CDN (representing edge compute) for local processing on vehicles',
    componentsNeeded: [
      { type: 'cdn', reason: 'Edge computing layer for real-time processing on vehicles', displayName: 'Edge Compute' },
    ],
    connectionsNeeded: [
      { from: 'Vehicles', to: 'Edge Compute', reason: 'Sensors send data to edge processor' },
      { from: 'Edge Compute', to: 'Ingestion Service', reason: 'Edge sends processed telemetry to cloud' },
    ],
    successCriteria: ['Add CDN (Edge Compute)', 'Reroute: Vehicles → Edge Compute → Ingestion Service'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add CDN (Edge Compute) between Vehicles and Ingestion Service',
    level2: 'Edge computing processes sensor data locally before sending to cloud',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Object Storage for Incident Recordings
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📹',
  scenario: "A vehicle just detected a near-collision! It needs to upload the incident recording.",
  hook: "The incident file is 8 GB (30 seconds of all sensor data at full fidelity). Your time-series database can't handle this!",
  challenge: "Add object storage to store large incident recordings.",
  illustration: 'storage',
};

const step5Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Incident recordings are now stored!",
  achievement: "Object storage handles large files efficiently",
  metrics: [
    { label: 'Max file size', after: '10 GB per incident' },
    { label: 'Storage cost', after: '$0.02/GB/month' },
  ],
  nextTeaser: "But engineers need to see the fleet dashboard...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage for Incident Recordings',
  conceptExplanation: `**The Problem:**
Incident recordings are huge:
- 30 seconds of camera (8 cameras × 30 FPS × HD) = 5 GB
- LIDAR point clouds = 2 GB
- Other sensors = 1 GB
- **Total: 8-10 GB per incident**

Time-series databases are optimized for small, frequent writes (10 KB), not large files (10 GB).

**Object Storage Solution (e.g., S3):**
- Designed for large files (GB to TB)
- Cheap storage ($0.02/GB/month)
- HTTP upload/download
- Durability (99.999999999%)
- Lifecycle policies (move to cold storage after 90 days)

**Flow:**
1. Edge detects incident → Buffer last 30 seconds
2. Vehicle uploads to object storage (may take minutes over LTE)
3. Metadata written to time-series DB (link to S3 object)
4. Engineers download via S3 URL for analysis`,

  whyItMatters: 'Object storage is 10x cheaper than databases for large files and scales to petabytes.',

  realWorldExample: {
    company: 'Cruise',
    scenario: 'Storing incident data from autonomous taxi fleet',
    howTheyDoIt: 'Uploads incident recordings to S3, retains for 7 years for regulatory compliance',
  },

  keyPoints: [
    'Object storage (S3) is designed for large files, not small writes',
    'Much cheaper than databases for blob storage',
    'Vehicles upload directly to S3, not through app servers',
    'Metadata in time-series DB links to S3 objects',
  ],

  diagram: `
[Vehicle] ──incident detected──▶ [Edge Compute]
                                      │
                                      ├─▶ [Object Storage]
                                      │   (upload 8 GB file)
                                      │
                                      └─▶ [Ingestion Service]
                                          (metadata: S3 link)
                                               │
                                               ▼
                                          [Time-Series DB]
                                          {incident_id, s3_url, timestamp}
`,

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Optimized for large files', icon: '📦' },
    { title: 'Blob Data', explanation: 'Binary large objects', icon: '🗃️' },
    { title: 'Lifecycle Policies', explanation: 'Auto-archive old data', icon: '♻️' },
  ],

  quickCheck: {
    question: 'Why use object storage (S3) instead of database for incident recordings?',
    options: [
      'Databases don\'t support files',
      'Object storage is optimized and cheaper for large files (GB)',
      'S3 is faster',
      'Databases are full',
    ],
    correctIndex: 1,
    explanation: 'Object storage is designed for large files and costs 10x less than database storage.',
  },
};

const step5: GuidedStep = {
  id: 'av-telemetry-step-5',
  stepNumber: 5,
  frIndex: 2,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-3: Store incident recordings',
    taskDescription: 'Add Object Storage (S3) for incident recordings',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store large incident files (8-10 GB each)', displayName: 'Object Storage' },
    ],
    connectionsNeeded: [
      { from: 'Edge Compute', to: 'Object Storage', reason: 'Upload incident recordings' },
    ],
    successCriteria: ['Add Object Storage', 'Connect Edge Compute → Object Storage'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'message_queue', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
  },
  hints: {
    level1: 'Add Object Storage and connect Edge Compute to it',
    level2: 'Edge Compute uploads incident recordings to Object Storage',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 6: Add Cache for Real-Time Fleet Dashboard
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🗺️',
  scenario: "Fleet operators need a dashboard showing all 10,000 vehicles in real-time!",
  hook: "Each dashboard refresh queries the time-series database for 10,000 vehicles. The database is overwhelmed!",
  challenge: "Add a cache to serve real-time fleet data without hammering the database.",
  illustration: 'caching',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Dashboard is blazing fast!",
  achievement: "Cache serves real-time fleet data with sub-second latency",
  metrics: [
    { label: 'Dashboard latency', before: '5 seconds', after: '200ms' },
    { label: 'Database load', before: '1000 QPS', after: '50 QPS' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "You've built a production-ready autonomous vehicle telemetry system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching for Real-Time Fleet Dashboards',
  conceptExplanation: `**The Problem:**
Fleet dashboard shows:
- 10,000 vehicle locations (updated every second)
- Current status (driving, parked, charging, error)
- Health metrics (battery, connectivity, alerts)

If every dashboard refresh queries the time-series database:
- 100 operators × 1 refresh/second = 100 QPS
- Each query fetches 10,000 vehicle records
- Database is overwhelmed!

**Cache Solution (e.g., Redis):**
1. Workers write telemetry to both database AND cache
2. Cache stores latest state for each vehicle (small, 1 KB per vehicle)
3. Dashboard reads from cache (< 10ms)
4. Cache updates every second from message queue

**Cache Data:**
\`\`\`
vehicle:1234 -> {
  last_update: "2024-01-15T10:30:45Z",
  location: {lat: 37.7749, lon: -122.4194},
  status: "driving",
  battery: 78%,
  speed: 45.2 mph
}
\`\`\`

**Benefits:**
- Dashboard latency: 5s → 200ms
- Database offloading: 95% of reads from cache
- Real-time updates (cache TTL: 5 seconds)`,

  whyItMatters: 'Caching is essential for real-time dashboards that serve aggregated data to many users.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Real-time driver location on rider apps',
    howTheyDoIt: 'Redis cache stores latest location for all active drivers, updated from message queue stream',
  },

  famousIncident: {
    title: 'AWS Redis Cache Failure',
    company: 'Amazon',
    year: '2020',
    whatHappened: 'Amazon\'s ElastiCache Redis cluster failed during Prime Day. All read traffic hit the database. Database couldn\'t handle the load and slowed down 10x. Product pages took 30 seconds to load. Amazon lost millions in sales.',
    lessonLearned: 'Cache failures can cascade to databases. Always have cache redundancy and database capacity headroom.',
    icon: '💥',
  },

  keyPoints: [
    'Cache stores latest vehicle state for fast dashboard queries',
    'Workers update both database (persistence) and cache (speed)',
    'Cache offloads 90%+ of read queries from database',
    'TTL ensures cache stays fresh (e.g., 5 second TTL)',
  ],

  diagram: `
[Message Queue] ──▶ [Workers]
                       │
                       ├──▶ [Database] (persistence, analytics)
                       │
                       └──▶ [Cache] (real-time state)
                              │
                              ▼
                          [Dashboard]
                          (< 200ms queries)
`,

  keyConcepts: [
    { title: 'Cache', explanation: 'Fast in-memory storage', icon: '⚡' },
    { title: 'TTL', explanation: 'Time-to-live for cache entries', icon: '⏱️' },
    { title: 'Cache Aside', explanation: 'App writes to both DB and cache', icon: '📝' },
  ],

  quickCheck: {
    question: 'Why add a cache for the fleet dashboard?',
    options: [
      'Caches are required for dashboards',
      'Database queries are too slow (5s) - cache provides sub-second reads',
      'Cache is cheaper than database',
      'Database is broken',
    ],
    correctIndex: 1,
    explanation: 'Cache provides fast (< 200ms) reads for real-time dashboard, offloading the database.',
  },
};

const step6: GuidedStep = {
  id: 'av-telemetry-step-6',
  stepNumber: 6,
  frIndex: 3,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'FR-4: Monitor fleet in real-time',
    taskDescription: 'Add Cache for fast dashboard queries',
    componentsNeeded: [
      { type: 'cache', reason: 'Store latest vehicle state for real-time dashboard', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Message Queue', to: 'Cache', reason: 'Workers update cache with latest state' },
    ],
    successCriteria: ['Add Cache', 'Connect Message Queue → Cache'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'message_queue', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'cdn', toType: 'object_storage' },
      { fromType: 'message_queue', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add Cache and connect Message Queue to it',
    level2: 'Workers consume from queue and update both Database and Cache',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'message_queue', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const autonomousVehicleTelemetryGuidedTutorial: GuidedTutorial = {
  problemId: 'autonomous-vehicle-telemetry',
  title: 'Design an Autonomous Vehicle Telemetry System',
  description: 'Build a real-time telemetry system for self-driving cars with edge processing, incident recording, and fleet monitoring',
  difficulty: 'advanced',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '🚗',
    hook: "Welcome to AutoDrive - building the future of autonomous transportation!",
    scenario: "Your mission: Design a telemetry system that ingests sensor data from 10,000 self-driving vehicles, processes safety-critical decisions at the edge in < 100ms, and provides real-time fleet monitoring.",
    challenge: "Can you build a system that handles 4,200 writes/sec, 5 TB/day of data, and meets safety-critical latency requirements?",
  },

  requirementsPhase: autonomousVehicleRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Telemetry Ingestion',
    'Time-Series Databases',
    'Edge Computing',
    'Safety-Critical Systems',
    'Real-Time Processing',
    'Message Queues',
    'Object Storage',
    'Fleet Monitoring',
    'Incident Recording',
    'Asynchronous Processing',
    'Cache for Dashboards',
    'High-Frequency Writes',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 3: Storage and Retrieval (Time-series data)',
    'Chapter 11: Stream Processing (Real-time telemetry)',
  ],
};

export default autonomousVehicleTelemetryGuidedTutorial;
