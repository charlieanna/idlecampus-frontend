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
 * Datadog-style Observability Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching observability concepts
 * while building a monitoring and observability platform like Datadog.
 *
 * Key Concepts:
 * - Metrics collection and aggregation
 * - Log aggregation and search
 * - Distributed tracing
 * - Alerting and anomaly detection
 * - Time-series data storage
 * - Real-time dashboards
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build core functionality (metrics, logs, traces) - FRs satisfied!
 * Steps 4-8: Apply NFRs (scale, search, alerting, aggregation, cost)
 *
 * Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const observabilityRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an observability platform like Datadog that monitors distributed systems",

  interviewer: {
    name: 'Alex Rivera',
    role: 'VP of Engineering',
    avatar: '👨‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main things users need to monitor in their distributed systems?",
      answer: "Users need to observe three pillars of observability:\n1. **Metrics**: Track performance indicators like CPU, memory, request rates, error rates (e.g., 'API latency is 200ms')\n2. **Logs**: Search through application logs to debug issues (e.g., 'Show me all ERROR logs from checkout service')\n3. **Traces**: Follow a request across microservices to find bottlenecks (e.g., 'Why did this checkout take 5 seconds?')\n\nThese three together give complete visibility into system health.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "The three pillars of observability: Metrics, Logs, and Traces. You need all three to understand what's happening in production.",
    },
    {
      id: 'metrics-collection',
      category: 'functional',
      question: "How should metrics collection work?",
      answer: "Applications send metrics to the platform every 10-60 seconds (e.g., 'cpu.usage=75%, api.latency=120ms'). The platform:\n1. Receives metrics from thousands of servers\n2. Stores time-series data efficiently\n3. Displays real-time dashboards\n4. Triggers alerts when thresholds are exceeded",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Metrics are time-series data - values paired with timestamps. Think: 'At 3:14pm, CPU was 75%'",
    },
    {
      id: 'log-aggregation',
      category: 'functional',
      question: "What do users expect from log management?",
      answer: "Users need to:\n1. **Ingest logs** from all services (app logs, web server logs, database logs)\n2. **Search logs** quickly ('show me all 500 errors in last hour')\n3. **Filter and parse** (extract fields like user_id, request_id)\n4. **Correlate** logs with metrics and traces\n\nLogs can be massive - gigabytes per hour across all services.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Logs are unstructured or semi-structured text. Fast search across billions of log lines is the core challenge.",
    },
    {
      id: 'distributed-tracing',
      category: 'functional',
      question: "How does distributed tracing work?",
      answer: "When a user makes a request that touches multiple services:\n1. Generate a unique **trace_id** for the entire request\n2. Each service creates **spans** (segments of work) tagged with trace_id\n3. Send spans to the observability platform\n4. Reconstruct the full request flow: 'API Gateway → Auth Service → Payment Service → Database'\n\nThis reveals where time is spent and where failures occur.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Distributed tracing answers 'Why is this request slow?' by showing the timeline across all services.",
    },
    {
      id: 'alerting',
      category: 'functional',
      question: "How should alerting work when things go wrong?",
      answer: "Users define alert rules like:\n- 'If error rate > 5%, notify on-call engineer'\n- 'If API latency > 500ms for 5 minutes, page the team'\n\nAlerts should:\n1. Evaluate metrics in near real-time\n2. Send notifications (email, Slack, PagerDuty)\n3. Avoid alert fatigue (don't spam!)",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Alerting is the 'action' part of observability - detecting and notifying about problems.",
    },

    // CLARIFICATIONS
    {
      id: 'retention',
      category: 'clarification',
      question: "How long should we retain metrics and logs?",
      answer: "Standard retention:\n- **High-resolution metrics**: 15 days (1-minute granularity)\n- **Downsampled metrics**: 15 months (1-hour granularity)\n- **Logs**: 30 days for search, archive to cheap storage after\n- **Traces**: 15 days (sampled traces only)\n\nRetention is a cost-performance trade-off.",
      importance: 'important',
      insight: "Longer retention = more storage cost. Downsampling old metrics saves space.",
    },
    {
      id: 'ml-features',
      category: 'clarification',
      question: "Do we need anomaly detection and ML-powered features?",
      answer: "For MVP, basic threshold alerts are sufficient. ML-powered anomaly detection ('this pattern looks unusual') is v2. Focus on:\n- Rule-based alerts\n- Static thresholds\n- Basic aggregations (avg, max, min, percentiles)",
      importance: 'nice-to-have',
      insight: "ML anomaly detection is powerful but complex - defer to v2",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-metrics',
      category: 'throughput',
      question: "How many metrics should we handle?",
      answer: "Target scale:\n- 10,000 servers being monitored\n- Each server sends 100 metrics every 10 seconds\n- That's 100,000 metrics/second sustained\n\nAt Datadog scale: 1 trillion+ metrics per day!",
      importance: 'critical',
      calculation: {
        formula: "10K servers × 100 metrics × 6 times/min = 100K metrics/sec",
        result: "~100,000 metrics ingested per second",
      },
      learningPoint: "Metrics ingestion is write-heavy. You need specialized time-series databases.",
    },
    {
      id: 'throughput-logs',
      category: 'throughput',
      question: "What's the expected log volume?",
      answer: "Target scale:\n- 10,000 servers\n- Each produces 1MB of logs per minute\n- That's 10GB/min or 600GB/hour\n- 14TB per day of raw logs\n\nLogs are the highest-volume data type.",
      importance: 'critical',
      calculation: {
        formula: "10K servers × 1MB/min = 10GB/min",
        result: "~14TB of logs per day",
      },
      learningPoint: "Logs dominate storage costs. Compression and tiered storage are essential.",
    },
    {
      id: 'throughput-traces',
      category: 'throughput',
      question: "How many traces per second?",
      answer: "Target scale:\n- 100,000 requests/second across all services\n- Sample 1% of traces (sampling reduces volume)\n- That's 1,000 traces/second\n- Each trace has 5-20 spans\n- So 5,000-20,000 spans/second",
      importance: 'important',
      calculation: {
        formula: "100K req/s × 1% sampling × 10 spans avg = 10K spans/s",
        result: "~10,000 spans ingested per second",
      },
      learningPoint: "Traces are sampled to reduce volume. You don't need every single request traced.",
    },

    // LATENCY
    {
      id: 'latency-query',
      category: 'latency',
      question: "How fast should dashboard queries be?",
      answer: "Users expect:\n- **Metrics dashboards**: < 1 second for graphs\n- **Log search**: < 2 seconds for simple queries\n- **Trace lookup**: < 500ms to find a trace by ID\n\nSlow dashboards kill productivity.",
      importance: 'critical',
      learningPoint: "Query latency is user-facing. Pre-aggregation and indexing are key.",
    },
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "How quickly should data appear in dashboards?",
      answer: "Near real-time is expected:\n- Metrics visible within 10-30 seconds of emission\n- Logs searchable within 30-60 seconds\n- Traces visible within 1 minute\n\nUsers debug live issues, so freshness matters.",
      importance: 'important',
      learningPoint: "Observability is real-time. Batch processing won't work for live debugging.",
    },

    // RELIABILITY
    {
      id: 'availability',
      category: 'availability',
      question: "What happens if the observability platform goes down?",
      answer: "This is critical: If your monitoring is down, you're flying blind during outages!\n\nTarget: 99.9% availability\n- Applications should buffer metrics/logs locally if platform is unreachable\n- Alert delivery MUST be reliable (dedicated alert pipeline)\n- Graceful degradation: recent data more critical than historical",
      importance: 'critical',
      learningPoint: "Your monitoring system must be more reliable than what it monitors. Ironic failure mode!",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'metrics-collection', 'log-aggregation', 'distributed-tracing'],
  criticalFRQuestionIds: ['core-operations', 'metrics-collection', 'log-aggregation', 'distributed-tracing'],
  criticalScaleQuestionIds: ['throughput-metrics', 'throughput-logs', 'latency-query', 'availability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Collect and visualize metrics',
      description: 'Ingest time-series metrics from thousands of servers and display real-time dashboards',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Aggregate and search logs',
      description: 'Ingest logs from all services and provide fast full-text search',
      emoji: '📝',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Distributed tracing',
      description: 'Track requests across microservices to identify bottlenecks',
      emoji: '🔍',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Alerting on anomalies',
      description: 'Evaluate metrics and trigger alerts when thresholds are breached',
      emoji: '🚨',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000 monitored servers',
    writesPerDay: '8.6 billion metrics + 14TB logs',
    readsPerDay: 'Dashboard queries + log searches',
    peakMultiplier: 2,
    readWriteRatio: '1:100 (write-heavy)',
    calculatedWriteRPS: { average: 100000, peak: 200000 },
    calculatedReadRPS: { average: 5000, peak: 10000 },
    maxPayloadSize: '~1KB per metric, ~10KB per log batch',
    storagePerRecord: '~100 bytes per metric point',
    storageGrowthPerYear: '~300TB (metrics + logs + traces)',
    redirectLatencySLA: 'p99 < 1s (dashboard queries)',
    createLatencySLA: 'p99 < 100ms (metric ingestion)',
  },

  architecturalImplications: [
    '✅ 100K metrics/sec → Time-series database essential (InfluxDB, Prometheus)',
    '✅ 14TB logs/day → Distributed search (Elasticsearch) + compression',
    '✅ Dashboard queries < 1s → Pre-aggregation and indexing critical',
    '✅ 99.9% availability → Redundancy at every layer + buffering',
    '✅ Write-heavy (100:1) → Optimize for ingestion throughput',
    '✅ Multi-tenant → Isolation and quotas per customer',
  ],

  outOfScope: [
    'ML-powered anomaly detection (v2)',
    'Infrastructure provisioning (focus on monitoring)',
    'APM code-level profiling',
    'Custom integrations for every tool',
  ],

  keyInsight: "First, let's make the three pillars WORK: metrics, logs, and traces. We'll build a simple system that collects this data and displays it. Then we'll optimize for scale, search performance, and cost efficiency.",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to ObserveOps! You're building the next Datadog.",
  hook: "DevOps teams are tired of being blind in production. They need visibility into their systems!",
  challenge: "Set up the foundation: connect monitoring agents (clients) to your collection server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your observability platform is online!',
  achievement: 'Agents can now send data to your collection server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting data', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process metrics yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Agents and Collectors',
  conceptExplanation: `Every observability platform has two key components:

**1. Agents (Clients)**: Installed on servers to collect metrics, logs, traces
   - Think: Datadog Agent, Prometheus Node Exporter, OpenTelemetry Collector
   - Runs as background process on each server
   - Periodically pushes data to the collection endpoint

**2. Collection Server**: Receives data from all agents
   - HTTP endpoint that accepts metrics/logs/traces
   - Validates and buffers incoming data
   - Routes to storage systems

This is the entry point for ALL observability data.`,
  whyItMatters: 'Without this connection, you have no way to collect telemetry from production systems.',
  keyPoints: [
    'Agents run on every monitored server',
    'They push data periodically (every 10-60 seconds)',
    'Collection server is the gateway to your platform',
    'Must handle high write throughput (100K+ metrics/sec)',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────────┐
│   Agent     │ ──────▶ │  Collection Server  │
│ (Server 1)  │ Metrics │   (App Server)      │
└─────────────┘ Logs    └─────────────────────┘
                Traces
`,
  keyConcepts: [
    {
      title: 'Agent',
      explanation: 'Software that collects telemetry from servers',
      icon: '🤖',
    },
    {
      title: 'Push Model',
      explanation: 'Agents actively send data to collectors',
      icon: '📤',
    },
  ],
};

const step1: GuidedStep = {
  id: 'observability-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Foundation for all observability data collection',
    taskDescription: 'Add Client (Agent) and App Server (Collector), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents monitoring agents on servers', displayName: 'Agent' },
      { type: 'app_server', reason: 'Receives metrics, logs, traces', displayName: 'Collection Server' },
    ],
    connectionsNeeded: [
      { from: 'Agent', to: 'Collection Server', reason: 'Agents send telemetry data' },
    ],
    successCriteria: ['Add Agent', 'Add Collection Server', 'Connect Agent → Collection Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client (Agent), then add App Server (Collection Server), then connect them',
    level2: 'Drag both components from the sidebar, then drag from Agent to Collection Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Collection APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your collection server is running, but it doesn't know how to process incoming data!",
  hook: "An agent just tried to send metrics but got a 404. You need to implement the ingestion APIs!",
  challenge: "Write Python code to handle metrics, logs, and traces ingestion.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your collection server is fully functional!',
  achievement: 'Agents can now send metrics, logs, and traces',
  metrics: [
    { label: 'APIs implemented', after: '3 endpoints' },
    { label: 'Metrics ingestion', after: '✓' },
    { label: 'Logs ingestion', after: '✓' },
    { label: 'Traces ingestion', after: '✓' },
  ],
  nextTeaser: "But where is all this data being stored?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Design for Observability Data Ingestion',
  conceptExplanation: `Your collection server needs three main endpoints:

**1. POST /api/v1/metrics** — Ingest time-series metrics
- Receives: [{"metric": "cpu.usage", "value": 75.5, "timestamp": 1234567890, "tags": {"host": "web-01"}}]
- Validates timestamps, metric names, tags
- Stores in time-series database

**2. POST /api/v1/logs** — Ingest log events
- Receives: [{"message": "ERROR: payment failed", "timestamp": 1234567890, "service": "checkout"}]
- Parses structured fields
- Indexes for search

**3. POST /api/v1/traces** — Ingest distributed traces
- Receives: [{"trace_id": "abc123", "span_id": "span1", "operation": "checkout", "duration_ms": 120}]
- Correlates spans into traces
- Stores for query by trace_id

Each endpoint must handle thousands of requests per second!`,
  whyItMatters: 'These APIs are the gateway for all observability data. Performance and reliability here are critical.',
  keyPoints: [
    'Three separate endpoints for metrics, logs, traces',
    'Batch ingestion (accept arrays) for efficiency',
    'Validate and normalize data',
    'Return quickly (async processing)',
  ],
  diagram: `
Agent sends:
POST /api/v1/metrics
{
  "metrics": [
    {"name": "api.latency", "value": 120, "timestamp": 1234567890, "tags": {"endpoint": "/checkout"}},
    {"name": "cpu.usage", "value": 75.5, "timestamp": 1234567890, "tags": {"host": "web-01"}}
  ]
}

Response: 202 Accepted
`,
  keyConcepts: [
    { title: 'Batch Ingestion', explanation: 'Accept multiple data points per request', icon: '📦' },
    { title: 'Async Processing', explanation: 'Return quickly, process in background', icon: '⚡' },
    { title: 'Data Validation', explanation: 'Check format before storing', icon: '✅' },
  ],
  quickCheck: {
    question: 'Why do we use separate endpoints for metrics, logs, and traces?',
    options: [
      'To make the API more complex',
      'Each data type has different schema, validation, and storage requirements',
      'It\'s a legacy design pattern',
      'To charge customers separately',
    ],
    correctIndex: 1,
    explanation: 'Metrics, logs, and traces have fundamentally different structures and storage needs. Separate endpoints allow optimized handling.',
  },
};

const step2: GuidedStep = {
  id: 'observability-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1, FR-2, FR-3: Ingest metrics, logs, and traces',
    taskDescription: 'Configure APIs and implement Python handlers for data ingestion',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Agent' },
      { type: 'app_server', reason: 'Implement ingestion APIs', displayName: 'Collection Server' },
    ],
    connectionsNeeded: [
      { from: 'Agent', to: 'Collection Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on Collection Server to open inspector',
      'Assign POST /api/v1/metrics, POST /api/v1/logs, POST /api/v1/traces',
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
    level1: 'Click Collection Server to configure APIs, then switch to Python tab to implement handlers',
    level2: 'Assign the three POST endpoints in the inspector, then implement ingest_metrics(), ingest_logs(), and ingest_traces() in Python',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Time-Series Database for Metrics
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your collection server is storing metrics in memory. Then it crashed...",
  hook: "All the metrics data is gone! Teams can't see any historical trends. The CEO is furious!",
  challenge: "Add a time-series database to persist metrics durably.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Metrics are now stored forever!',
  achievement: 'Time-series data persists and can be queried',
  metrics: [
    { label: 'Data durability', before: '❌ Lost on restart', after: '✓ Persisted' },
    { label: 'Storage', after: 'Time-Series DB' },
    { label: 'Historical queries', after: 'Enabled' },
  ],
  nextTeaser: "Now we need to store logs too...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Databases: Built for Metrics',
  conceptExplanation: `Metrics are **time-series data**: values paired with timestamps.

Example: cpu.usage at 3:00pm = 75%, at 3:01pm = 78%, at 3:02pm = 72%

Regular databases (PostgreSQL, MySQL) are NOT optimized for this pattern. You need a **Time-Series Database (TSDB)**:

**Why Time-Series Databases?**
- **Optimized writes**: Handle 100K+ inserts/sec
- **Compression**: Store millions of points efficiently (10-20x compression)
- **Downsampling**: Automatically aggregate old data (keep 1-min resolution for 15 days, 1-hour for 15 months)
- **Fast queries**: "Show me CPU for last 24 hours" in milliseconds

**Popular TSDBs**:
- InfluxDB (SQL-like query language)
- Prometheus (pull-based metrics, widely used in Kubernetes)
- TimescaleDB (PostgreSQL extension)
- OpenTSDB (built on HBase)`,
  whyItMatters: 'At 100K metrics/sec, regular databases will crumble. TSDBs are purpose-built for this workload.',
  famousIncident: {
    title: 'Datadog Early Struggles with PostgreSQL',
    company: 'Datadog',
    year: '2011-2012',
    whatHappened: 'Early Datadog tried using PostgreSQL for metrics. Performance was terrible - queries took 30+ seconds. They built a custom time-series engine that became the foundation of their platform.',
    lessonLearned: 'Use the right tool for the job. Time-series data needs specialized databases.',
    icon: '📊',
  },
  realWorldExample: {
    company: 'Datadog',
    scenario: 'Storing 1 trillion metrics per day',
    howTheyDoIt: 'Custom-built time-series database optimized for their workload. 10x compression, sub-second queries even at massive scale.',
  },
  keyPoints: [
    'Time-series DB stores (timestamp, metric_name, value, tags)',
    'Optimized for sequential writes',
    'Automatic downsampling saves storage',
    'Tag-based queries enable filtering (e.g., "cpu.usage where host=web-01")',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Agent     │ ────▶ │ Collection  │ ────▶ │   Time-Series  │
└─────────────┘       │   Server    │       │   Database     │
                      └─────────────┘       │                │
                                            │  timestamp | metric | value │
                                            │  ----------|--------|-------|
                                            │  14:00:00  | cpu    | 75.5  │
                                            │  14:00:10  | cpu    | 78.2  │
                                            └────────────────┘
`,
  keyConcepts: [
    { title: 'Time-Series', explanation: 'Data points indexed by time', icon: '⏱️' },
    { title: 'Downsampling', explanation: 'Aggregate old data to save space', icon: '📉' },
    { title: 'Tags', explanation: 'Dimensions for filtering (host, service, region)', icon: '🏷️' },
  ],
  quickCheck: {
    question: 'Why not use PostgreSQL for metrics storage?',
    options: [
      'PostgreSQL can\'t store numbers',
      'Time-series DBs offer 10-20x better compression and query performance for this workload',
      'PostgreSQL is too expensive',
      'Time-series data is unstructured',
    ],
    correctIndex: 1,
    explanation: 'TSDBs are optimized for sequential writes, compression, and time-range queries. PostgreSQL would be 10-20x slower and use 10x more storage.',
  },
};

const step3: GuidedStep = {
  id: 'observability-step-3',
  stepNumber: 3,
  frIndex: 0,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-1: Metrics must persist durably',
    taskDescription: 'Add a Time-Series Database and connect Collection Server to it',
    componentsNeeded: [
      { type: 'client', reason: 'Agents sending metrics', displayName: 'Agent' },
      { type: 'app_server', reason: 'Collection server', displayName: 'Collection Server' },
      { type: 'database', reason: 'Time-series database for metrics', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [
      { from: 'Agent', to: 'Collection Server', reason: 'Agents send metrics' },
      { from: 'Collection Server', to: 'Time-Series DB', reason: 'Persist metrics' },
    ],
    successCriteria: ['Add Time-Series DB', 'Connect Collection Server → Time-Series DB'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database component for time-series metrics storage',
    level2: 'Connect Collection Server to the Time-Series Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Search Engine for Logs
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔍',
  scenario: "An engineer is debugging a production issue: 'Show me all ERROR logs from checkout service in the last hour'",
  hook: "Your time-series DB can't search unstructured text! Logs need full-text search capability.",
  challenge: "Add a search engine (Elasticsearch) for fast log queries.",
  illustration: 'search-magnifying-glass',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Logs are now searchable in seconds!',
  achievement: 'Full-text search across billions of log lines',
  metrics: [
    { label: 'Log search latency', before: 'N/A', after: '< 2 seconds' },
    { label: 'Log volume', after: '14TB/day indexed' },
    { label: 'Search capability', after: 'Enabled' },
  ],
  nextTeaser: "But dashboard queries are still slow...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Search Engines for Log Aggregation',
  conceptExplanation: `Logs are unstructured or semi-structured text:

\`\`\`
2024-03-15 14:23:45 ERROR [checkout-service] Payment failed for user_id=12345 error="card declined"
\`\`\`

You need to:
1. **Index logs** for fast text search
2. **Parse fields** (timestamp, level, service, user_id)
3. **Query** across billions of lines in < 2 seconds

**Why Elasticsearch?**
- Inverted index for full-text search
- Distributed across nodes (horizontal scaling)
- Near real-time indexing (< 1 minute freshness)
- Powerful query DSL (filters, aggregations, wildcards)

**Typical query:**
"Show all ERROR logs from checkout-service where user_id=12345 in last hour"

Elasticsearch returns results in < 2 seconds even across terabytes of logs!`,
  whyItMatters: 'Logs are your debugging lifeline. Slow search = frustrated engineers.',
  famousIncident: {
    title: 'GitHub Log Search Outage',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'Elasticsearch cluster ran out of heap memory during a traffic spike. Log search went down for 8 hours. Engineers couldn\'t debug production issues and had to resort to SSH-ing into servers.',
    lessonLearned: 'Log search infrastructure must be over-provisioned. It\'s critical during incidents.',
    icon: '🔥',
  },
  realWorldExample: {
    company: 'Datadog',
    scenario: 'Searching petabytes of logs',
    howTheyDoIt: 'Elasticsearch clusters with specialized hardware. Custom indexing strategies. Auto-scaling based on ingestion rate.',
  },
  keyPoints: [
    'Elasticsearch for full-text search across logs',
    'Inverted index enables sub-second queries',
    'Parse structured fields during ingestion',
    'Compression and tiered storage for cost',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Agent     │ ────▶ │ Collection  │ ────▶ │ Elasticsearch  │
│             │ Logs  │   Server    │       │                │
└─────────────┘       └─────────────┘       │ Indexed Logs:  │
                                            │ - timestamp    │
                                            │ - service      │
                                            │ - level (ERROR)│
                                            │ - message      │
                                            └────────────────┘

Query: "level:ERROR AND service:checkout" → Results in < 2s
`,
  keyConcepts: [
    { title: 'Inverted Index', explanation: 'Word → document mapping for fast search', icon: '📚' },
    { title: 'Log Parsing', explanation: 'Extract structured fields from text', icon: '🔧' },
    { title: 'Full-Text Search', explanation: 'Search any word in any log line', icon: '🔍' },
  ],
  quickCheck: {
    question: 'Why do we use Elasticsearch instead of the time-series database for logs?',
    options: [
      'Logs are too large for time-series DBs',
      'Time-series DBs are optimized for numeric data, not full-text search',
      'Elasticsearch is cheaper',
      'Time-series DBs can\'t handle text',
    ],
    correctIndex: 1,
    explanation: 'Time-series DBs excel at numeric metrics over time. Elasticsearch excels at full-text search across unstructured text.',
  },
};

const step4: GuidedStep = {
  id: 'observability-step-4',
  stepNumber: 4,
  frIndex: 1,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-2: Logs must be searchable',
    taskDescription: 'Add a Search Engine (Elasticsearch) for log indexing and search',
    componentsNeeded: [
      { type: 'client', reason: 'Agents sending logs', displayName: 'Agent' },
      { type: 'app_server', reason: 'Collection server', displayName: 'Collection Server' },
      { type: 'database', reason: 'Time-series DB for metrics', displayName: 'Time-Series DB' },
      { type: 'search_engine', reason: 'Elasticsearch for log search', displayName: 'Elasticsearch' },
    ],
    connectionsNeeded: [
      { from: 'Collection Server', to: 'Elasticsearch', reason: 'Index logs for search' },
    ],
    successCriteria: ['Add Search Engine', 'Connect Collection Server → Elasticsearch'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_engine'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
    ],
  },
  hints: {
    level1: 'Add a Search Engine component for log indexing',
    level2: 'Connect Collection Server to Elasticsearch for log storage and search',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'search_engine' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'search_engine' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Cache for Fast Queries
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your dashboards are popular! But every refresh hits the time-series database...",
  hook: "Engineers are refreshing dashboards every 10 seconds. The TSDB is at 90% CPU!",
  challenge: "Add a cache to speed up repeated queries and reduce database load.",
  illustration: 'slow-database',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Dashboard queries are now lightning fast!',
  achievement: 'Cache reduces query latency by 10x',
  metrics: [
    { label: 'Dashboard load time', before: '3 seconds', after: '300ms' },
    { label: 'TSDB load', before: '90% CPU', after: '30% CPU' },
    { label: 'Cache hit rate', after: '85%' },
  ],
  nextTeaser: "Now we need to handle more incoming data...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching Query Results',
  conceptExplanation: `Dashboard queries are repetitive:
- "Show me CPU usage for last 24 hours" - 10 engineers looking at same graph
- "Error count by service" - refreshed every 30 seconds

Without caching, every query hits the TSDB. With caching:
1. Check cache first
2. If HIT: Return immediately (< 100ms)
3. If MISS: Query TSDB, cache result with TTL (< 1s)

**Cache-Aside Pattern for Queries:**
- Query: "cpu.usage for web-01, last 1 hour"
- Cache key: hash(query) → "cpu_web01_1h_20240315"
- TTL: 30 seconds (dashboards refresh frequently)

**What to cache:**
- Dashboard query results
- Aggregated metrics (avg, max, p95)
- Metadata (list of services, hosts)

**What NOT to cache:**
- Real-time alerts (need fresh data)
- Log search (too variable)`,
  whyItMatters: 'At scale, the same dashboards are viewed thousands of times. Caching prevents redundant work.',
  realWorldExample: {
    company: 'Grafana',
    scenario: 'Serving dashboards to thousands of engineers',
    howTheyDoIt: 'Redis clusters cache query results with 30-60s TTL. 80%+ cache hit rate.',
  },
  keyPoints: [
    'Cache query results, not raw data',
    'Use short TTL (30-60s) for freshness',
    'Cache-aside pattern: check cache, fall back to DB',
    'Reduces database load by 10x',
  ],
  diagram: `
Dashboard Query:
"Show CPU for web-01, last 1 hour"
         │
         ▼
  ┌────────────┐
  │   Cache    │ ─── HIT? ──▶ Return (100ms)
  │  (Redis)   │
  └────────────┘
         │ MISS
         ▼
  ┌────────────┐
  │ Time-Series│ ──▶ Query (1s) ──▶ Cache result ──▶ Return
  │  Database  │
  └────────────┘
`,
  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, query DB on miss', icon: '🔄' },
    { title: 'TTL', explanation: 'Time-To-Live: cache expires after N seconds', icon: '⏰' },
    { title: 'Cache Key', explanation: 'Unique identifier for cached data', icon: '🔑' },
  ],
  quickCheck: {
    question: 'Why use a short TTL (30-60s) for dashboard cache instead of hours?',
    options: [
      'To save memory',
      'Observability data changes frequently - users need fresh data',
      'It\'s faster to re-query',
      'Cache expires are free',
    ],
    correctIndex: 1,
    explanation: 'Observability is about real-time insights. Stale data defeats the purpose. Short TTL balances freshness and performance.',
  },
};

const step5: GuidedStep = {
  id: 'observability-step-5',
  stepNumber: 5,
  frIndex: 0,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'All FRs benefit from faster queries',
    taskDescription: 'Add a Cache (Redis) to speed up dashboard queries',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache query results for fast dashboards', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Collection Server', to: 'Cache', reason: 'Cache query results' },
    ],
    successCriteria: ['Add Cache', 'Connect Collection Server → Cache', 'Configure cache strategy'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_engine', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add a Cache component and connect it to Collection Server',
    level2: 'Configure cache-aside strategy with 60s TTL for query results',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Message Queue for Data Buffering
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "Traffic just spiked 10x! A major outage is happening and ALL teams are checking dashboards.",
  hook: "Your collection server is dropping data. Agents are getting 503 errors. Metrics are being lost!",
  challenge: "Add a message queue to buffer incoming data during spikes.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Your platform can now handle massive spikes!',
  achievement: 'Message queue buffers data during load spikes',
  metrics: [
    { label: 'Data loss', before: '15% during spikes', after: '0%' },
    { label: 'Buffering capacity', after: '10 million messages' },
    { label: 'Backpressure handling', after: 'Enabled' },
  ],
  nextTeaser: "Now we need to scale horizontally...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues for Buffering and Decoupling',
  conceptExplanation: `During incidents, observability traffic spikes dramatically:
- All engineers refresh dashboards
- Alert evaluation increases
- Log search volume surges

Without buffering, your collection server can't keep up!

**Solution: Message Queue (Kafka, RabbitMQ)**

**How it works:**
1. Collection server receives data → writes to queue (fast!)
2. Queue buffers millions of messages
3. Workers consume from queue at sustainable rate
4. No data loss during spikes

**Benefits:**
- **Buffering**: Queue absorbs temporary spikes
- **Decoupling**: Collection and processing are independent
- **Replay**: Re-process data if consumers crash
- **Scaling**: Add more workers to process faster

**Typical setup:**
- 3 topics: metrics-topic, logs-topic, traces-topic
- Collection server publishes
- Processing workers subscribe and write to storage`,
  whyItMatters: 'During production incidents (when you need observability most), traffic spikes 5-10x. Queues prevent data loss.',
  famousIncident: {
    title: 'New Relic Black Friday Data Loss',
    company: 'New Relic',
    year: '2013',
    whatHappened: 'During Black Friday, New Relic\'s ingestion pipeline couldn\'t handle the spike. They lost hours of metrics data for many customers during their busiest day.',
    lessonLearned: 'Buffer everything. Use message queues to decouple ingestion from processing.',
    icon: '🛒',
  },
  realWorldExample: {
    company: 'Datadog',
    scenario: 'Handling 100K+ events/sec',
    howTheyDoIt: 'Kafka topics for each data type. Auto-scaling consumer groups. Can buffer hours of data during processing issues.',
  },
  keyPoints: [
    'Message queue decouples ingestion from processing',
    'Buffers data during traffic spikes',
    'Enables horizontal scaling of workers',
    'Provides replay capability',
  ],
  diagram: `
Without Queue (BAD):
Agent ──▶ Collection Server ──▶ TSDB
              │
         (Spike = 503 errors!)

With Queue (GOOD):
Agent ──▶ Collection Server ──▶ Kafka Queue ──▶ Workers ──▶ TSDB
                                    │
                              (Buffer 10M msgs)
`,
  keyConcepts: [
    { title: 'Message Queue', explanation: 'Durable buffer for async processing', icon: '📬' },
    { title: 'Decoupling', explanation: 'Producers and consumers are independent', icon: '🔗' },
    { title: 'Backpressure', explanation: 'Handling when consumers can\'t keep up', icon: '⏸️' },
  ],
  quickCheck: {
    question: 'What happens to data during a spike if you DON\'T have a message queue?',
    options: [
      'It gets processed faster',
      'Collection server drops data and returns 503 errors',
      'Database automatically buffers it',
      'Nothing - spikes aren\'t a problem',
    ],
    correctIndex: 1,
    explanation: 'Without a queue, the collection server becomes the bottleneck. When overloaded, it drops data or returns errors.',
  },
};

const step6: GuidedStep = {
  id: 'observability-step-6',
  stepNumber: 6,
  frIndex: 0,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'All FRs need reliable ingestion during spikes',
    taskDescription: 'Add a Message Queue (Kafka) between Collection Server and storage',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer data during spikes', displayName: 'Kafka' },
    ],
    connectionsNeeded: [
      { from: 'Collection Server', to: 'Kafka', reason: 'Publish metrics/logs/traces' },
      { from: 'Kafka', to: 'Time-Series DB', reason: 'Workers consume and write' },
      { from: 'Kafka', to: 'Elasticsearch', reason: 'Workers consume and index' },
    ],
    successCriteria: ['Add Message Queue', 'Reroute data flow through Kafka'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_engine', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add Message Queue between Collection Server and storage systems',
    level2: 'Collection Server → Kafka → TSDB/Elasticsearch. This decouples ingestion from storage.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
      { from: 'message_queue', to: 'search_engine' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer and Scale Horizontally
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "You're monitoring 10,000 servers now! One collection server can't handle 100K metrics/sec!",
  hook: "The collection server is at 100% CPU. Agents are timing out. You're losing data!",
  challenge: "Add a load balancer and scale collection servers horizontally.",
  illustration: 'server-overload',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Your platform scales to handle any load!',
  achievement: 'Multiple collection servers behind load balancer',
  metrics: [
    { label: 'Collection capacity', before: '10K metrics/s', after: '100K+ metrics/s' },
    { label: 'Server instances', before: '1', after: '5+' },
    { label: 'High availability', after: 'Enabled' },
  ],
  nextTeaser: "Now let's add the alerting engine...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling with Load Balancers',
  conceptExplanation: `As you monitor more servers, ingestion load grows:
- 1,000 servers → 10K metrics/sec
- 10,000 servers → 100K metrics/sec
- 100,000 servers → 1M metrics/sec

One collection server can handle ~20K metrics/sec. You need **horizontal scaling**:

**Load Balancer:**
- Distributes agent requests across collection servers
- Health checks remove failed servers
- Enables zero-downtime deployments

**Stateless Collection Servers:**
- Don't store data locally (queue handles buffering)
- Any server can handle any request
- Easy to scale: just add more instances

**Auto-scaling:**
- Scale up during incidents (high ingestion)
- Scale down during quiet hours (save cost)
- Based on queue depth or CPU metrics`,
  whyItMatters: 'Observability platforms must handle unpredictable load spikes. Horizontal scaling is essential.',
  realWorldExample: {
    company: 'Datadog',
    scenario: 'Handling millions of metrics per second',
    howTheyDoIt: 'Hundreds of collection servers behind load balancers. Auto-scales based on Kafka lag.',
  },
  keyPoints: [
    'Load balancer distributes agent traffic',
    'Stateless servers enable easy scaling',
    'Add more instances for more capacity',
    'Auto-scaling based on ingestion rate',
  ],
  diagram: `
              ┌──────────────────┐
        ┌────▶│ Collection Srv 1 │────┐
        │     └──────────────────┘    │
Agents ─┤     ┌──────────────────┐    ├──▶ Kafka
  (10K) │  LB │ Collection Srv 2 │    │
        │     └──────────────────┘    │
        │     ┌──────────────────┐    │
        └────▶│ Collection Srv 3 │────┘
              └──────────────────┘

Each handles ~30K metrics/sec = 90K total capacity
`,
  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to increase capacity', icon: '↔️' },
    { title: 'Stateless', explanation: 'Servers don\'t store state locally', icon: '🔄' },
    { title: 'Auto-Scaling', explanation: 'Automatically adjust instance count', icon: '📈' },
  ],
  quickCheck: {
    question: 'Why can collection servers scale horizontally easily?',
    options: [
      'Because they\'re written in Python',
      'They\'re stateless - any server can handle any request',
      'Load balancers are magic',
      'Because we use Kafka',
    ],
    correctIndex: 1,
    explanation: 'Stateless servers don\'t store data locally. They just validate and forward to Kafka. This makes them interchangeable.',
  },
};

const step7: GuidedStep = {
  id: 'observability-step-7',
  stepNumber: 7,
  frIndex: 0,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'All FRs need scalable ingestion',
    taskDescription: 'Add Load Balancer and scale Collection Server to multiple instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute agent traffic', displayName: 'Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'Agent', to: 'Load Balancer', reason: 'All agents send to LB' },
      { from: 'Load Balancer', to: 'Collection Server', reason: 'LB distributes to servers' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Reconnect: Agent → LB → Collection Server',
      'Scale Collection Server to 3+ instances',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Add Load Balancer between Agents and Collection Server, then scale to multiple instances',
    level2: 'Insert LB, reconnect flow, then configure Collection Server for 3+ instances',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Alerting Engine
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚨',
  scenario: "Your platform collects all this data, but humans still have to watch dashboards 24/7!",
  hook: "At 3 AM, the API error rate spiked to 15%. Nobody noticed for 30 minutes. Users were affected!",
  challenge: "Build an alerting engine that evaluates metrics and notifies teams automatically.",
  illustration: 'alert-notification',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔔',
  message: 'Alerts now notify teams proactively!',
  achievement: 'Automated monitoring with smart alerting',
  metrics: [
    { label: 'Alert rules', after: 'Configured' },
    { label: 'Evaluation frequency', after: 'Every 1 minute' },
    { label: 'Notification channels', after: 'Email, Slack, PagerDuty' },
    { label: 'Mean time to detect', before: '30 min', after: '< 1 min' },
  ],
  nextTeaser: "Finally, let's optimize costs...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Alerting: From Data to Action',
  conceptExplanation: `Observability is useless if issues go unnoticed. Alerting closes the loop:

**Alert Rule Example:**
\`\`\`
IF avg(api.error_rate) over last 5 minutes > 5%
THEN notify #oncall via Slack and PagerDuty
\`\`\`

**Alerting Pipeline:**
1. **Alert Evaluator** - Queries metrics every 1-5 minutes
2. **Rule Engine** - Checks thresholds, trends, anomalies
3. **Alert Manager** - Deduplicates, groups, routes alerts
4. **Notification** - Sends to email, Slack, PagerDuty

**Best Practices:**
- **Threshold alerts**: "CPU > 90%"
- **Rate of change**: "Error rate increased 5x in 5 min"
- **Absence**: "No heartbeat received in 3 min"
- **Composite**: "High latency AND high error rate"

**Avoiding Alert Fatigue:**
- Set meaningful thresholds (not too sensitive)
- Use aggregation windows (5-10 min, not instant)
- Deduplicate similar alerts
- Group by service/team
- Enable snoozing and acknowledgment`,
  whyItMatters: 'Reactive monitoring (watching dashboards) doesn\'t scale. Proactive alerting detects issues before users complain.',
  famousIncident: {
    title: 'PagerDuty Alert Storm',
    company: 'Various',
    year: 'Ongoing',
    whatHappened: 'Poorly configured alerts can trigger "alert storms" - thousands of alerts in minutes during cascading failures. Engineers become desensitized, leading to missed critical alerts.',
    lessonLearned: 'Design alert rules carefully. Quality over quantity. Use alert grouping and intelligent deduplication.',
    icon: '🌪️',
  },
  realWorldExample: {
    company: 'Datadog',
    scenario: 'Managing millions of alert rules',
    howTheyDoIt: 'Distributed alert evaluator. Queries metrics from cache. Sophisticated grouping and routing logic. Integrates with 50+ notification channels.',
  },
  keyPoints: [
    'Alert evaluator queries metrics periodically',
    'Rule engine checks thresholds and conditions',
    'Alert manager deduplicates and routes',
    'Supports multiple notification channels',
  ],
  diagram: `
┌─────────────────────────────────────────┐
│        ALERTING PIPELINE                │
├─────────────────────────────────────────┤
│                                         │
│  1. Alert Evaluator (every 1 min)      │
│     │                                   │
│     ▼                                   │
│  2. Query Metrics from TSDB/Cache      │
│     │                                   │
│     ▼                                   │
│  3. Evaluate Rules:                    │
│     • IF error_rate > 5%               │
│     • IF latency p99 > 500ms           │
│     │                                   │
│     ▼                                   │
│  4. Alert Manager:                     │
│     • Deduplicate                      │
│     • Group by service                 │
│     • Route to teams                   │
│     │                                   │
│     ▼                                   │
│  5. Notify:                            │
│     📧 Email                            │
│     💬 Slack                            │
│     📟 PagerDuty                        │
│                                         │
└─────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Alert Rule', explanation: 'Condition that triggers notification', icon: '📋' },
    { title: 'Evaluation', explanation: 'Checking metrics against thresholds', icon: '🔍' },
    { title: 'Deduplication', explanation: 'Avoiding duplicate alerts', icon: '🎯' },
    { title: 'Notification', explanation: 'Sending alerts to teams', icon: '📢' },
  ],
  quickCheck: {
    question: 'Why use a 5-minute aggregation window instead of instant alerts?',
    options: [
      'It\'s faster',
      'Reduces false positives from temporary spikes',
      'It\'s cheaper',
      'Instant alerts are impossible',
    ],
    correctIndex: 1,
    explanation: 'Metrics fluctuate constantly. Aggregation windows (5-10 min) filter out noise and reduce alert fatigue.',
  },
};

const step8: GuidedStep = {
  id: 'observability-step-8',
  stepNumber: 8,
  frIndex: 3,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'FR-4: Alerting on metric thresholds',
    taskDescription: 'Add an Alert Engine that queries metrics and sends notifications',
    componentsNeeded: [
      { type: 'worker', reason: 'Alert evaluator and notification engine', displayName: 'Alert Engine' },
    ],
    connectionsNeeded: [
      { from: 'Alert Engine', to: 'Time-Series DB', reason: 'Query metrics for evaluation' },
      { from: 'Alert Engine', to: 'Cache', reason: 'Fast metric queries' },
    ],
    successCriteria: [
      'Add Alert Engine (Worker component)',
      'Connect to Time-Series DB and Cache for metric queries',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'worker'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'worker', toType: 'database' },
      { fromType: 'worker', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Worker component for the Alert Engine',
    level2: 'Connect Alert Engine to both TSDB and Cache for fast metric queries',
    solutionComponents: [{ type: 'worker' }],
    solutionConnections: [
      { from: 'worker', to: 'database' },
      { from: 'worker', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 9: Add Object Storage for Long-Term Retention
// =============================================================================

const step9Story: StoryContent = {
  emoji: '💸',
  scenario: "Your finance team is shocked: 'We're spending $50K/month on Elasticsearch storage!'",
  hook: "Most logs are never searched after 7 days, but you're storing them in expensive hot storage!",
  challenge: "Add tiered storage: hot data in Elasticsearch, cold data in S3.",
  illustration: 'cost-crisis',
};

const step9Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Storage costs reduced by 80%!',
  achievement: 'Tiered storage optimizes cost vs access',
  metrics: [
    { label: 'Storage cost', before: '$50K/month', after: '$10K/month' },
    { label: 'Hot storage (0-7 days)', after: 'Elasticsearch' },
    { label: 'Cold storage (8-90 days)', after: 'S3' },
    { label: 'Archive (90+ days)', after: 'S3 Glacier' },
  ],
  nextTeaser: "One final step: add database replication for reliability...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Tiered Storage for Cost Optimization',
  conceptExplanation: `Observability data has different access patterns:

**Hot data (0-7 days):**
- Searched frequently (debugging active issues)
- Needs fast access (< 2 seconds)
- Store in Elasticsearch
- Cost: High ($$$)

**Warm data (8-30 days):**
- Searched occasionally (historical analysis)
- Can tolerate slower access (5-10 seconds)
- Store in cheaper storage
- Cost: Medium ($$)

**Cold data (30+ days):**
- Rarely searched (compliance, audits)
- Access is infrequent (hours/days acceptable)
- Store in object storage (S3)
- Cost: Low ($)

**Archive (90+ days):**
- Almost never accessed
- Retrieval can take hours
- Store in S3 Glacier
- Cost: Very Low ($)

**Tiered Strategy:**
1. New logs → Elasticsearch (fast search)
2. After 7 days → Move to S3 (compress, index separately)
3. After 90 days → Archive to Glacier

This reduces cost by 80-90% while maintaining access!`,
  whyItMatters: 'Observability generates massive data volumes. Storing everything in hot storage would bankrupt most companies.',
  realWorldExample: {
    company: 'Datadog',
    scenario: 'Managing petabytes of logs',
    howTheyDoIt: 'Multi-tier storage. Live data in Elasticsearch. Historical data compressed in S3 with separate index. Can rehydrate old logs on demand.',
  },
  keyPoints: [
    'Hot storage (Elasticsearch) for recent data',
    'Cold storage (S3) for historical data',
    'Archive (Glacier) for compliance',
    '80%+ cost reduction with tiered approach',
  ],
  diagram: `
┌────────────────────────────────────────┐
│         TIERED STORAGE                 │
├────────────────────────────────────────┤
│                                        │
│  0-7 days:                             │
│  ┌──────────────┐                      │
│  │Elasticsearch │ Fast search          │
│  │   (Hot)      │ $$$ per GB           │
│  └──────────────┘                      │
│         │ Age-off                      │
│         ▼                               │
│  8-30 days:                            │
│  ┌──────────────┐                      │
│  │   S3         │ Slower search        │
│  │  (Warm)      │ $ per GB             │
│  └──────────────┘                      │
│         │ Age-off                      │
│         ▼                               │
│  30+ days:                             │
│  ┌──────────────┐                      │
│  │  S3 Glacier  │ Rare access          │
│  │  (Archive)   │ ¢ per GB             │
│  └──────────────┘                      │
│                                        │
└────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Hot Storage', explanation: 'Fast, expensive storage for active data', icon: '🔥' },
    { title: 'Cold Storage', explanation: 'Slower, cheaper storage for archives', icon: '❄️' },
    { title: 'Age-Off', explanation: 'Moving data to cheaper tiers over time', icon: '⏳' },
  ],
  quickCheck: {
    question: 'Why not store all logs in Elasticsearch forever?',
    options: [
      'Elasticsearch can\'t handle that much data',
      'It would be prohibitively expensive - 10-20x more than S3',
      'Old logs are automatically deleted',
      'S3 is faster',
    ],
    correctIndex: 1,
    explanation: 'Elasticsearch storage is 10-20x more expensive than S3. Most old logs are never accessed, so tiered storage saves massive costs.',
  },
};

const step9: GuidedStep = {
  id: 'observability-step-9',
  stepNumber: 9,
  frIndex: 1,
  story: step9Story,
  celebration: step9Celebration,
  learnPhase: step9LearnPhase,
  practicePhase: {
    frText: 'FR-2: Long-term log retention at low cost',
    taskDescription: 'Add Object Storage (S3) for archiving old logs',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Cheap storage for historical logs', displayName: 'S3 Object Storage' },
    ],
    connectionsNeeded: [
      { from: 'Elasticsearch', to: 'S3', reason: 'Age-off old logs to cold storage' },
    ],
    successCriteria: [
      'Add Object Storage component',
      'Connect Elasticsearch → S3 for log archiving',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'worker', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'worker', toType: 'database' },
      { fromType: 'worker', toType: 'cache' },
      { fromType: 'search_engine', toType: 'object_storage' },
    ],
  },
  hints: {
    level1: 'Add Object Storage for archiving old logs',
    level2: 'Connect Elasticsearch to S3 to enable log age-off',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'search_engine', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 10: Add Database Replication for Reliability
// =============================================================================

const step10Story: StoryContent = {
  emoji: '⚡',
  scenario: "Final step! Your time-series database just crashed. All metrics dashboards are down!",
  hook: "Teams can't see system health during a critical production incident. This is catastrophic!",
  challenge: "Enable database replication for high availability.",
  illustration: 'database-failure',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-ready observability platform!',
  achievement: 'Complete system with metrics, logs, traces, alerting, and HA',
  metrics: [
    { label: 'Metrics ingestion', after: '100K/sec' },
    { label: 'Log volume', after: '14TB/day' },
    { label: 'Trace processing', after: '10K spans/sec' },
    { label: 'Dashboard latency', after: '< 1s' },
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Storage cost', after: 'Optimized' },
  ],
  nextTeaser: "You've mastered observability platform design! Ready for the next challenge?",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'High Availability Through Replication',
  conceptExplanation: `Your observability platform MUST be more reliable than what it monitors!

If monitoring goes down during an incident, you're flying blind.

**Database Replication:**
- **Primary**: Handles all writes (metrics ingestion)
- **Replicas**: Handle reads (dashboard queries), stay in sync
- **Failover**: If primary crashes, promote replica

**For Time-Series DB:**
- Continuous replication of metrics data
- Read replicas reduce query load on primary
- Automatic failover in < 30 seconds

**For Elasticsearch:**
- Shard replication (each shard has 2+ copies)
- Distributed across nodes
- Survives node failures automatically

**High Availability Checklist:**
✅ Database replication (primary + 2 replicas)
✅ Multiple collection servers (behind LB)
✅ Message queue replication (Kafka multi-broker)
✅ Cache replication (Redis Sentinel or Cluster)
✅ Multi-AZ deployment

Your monitoring is now more reliable than most services it monitors!`,
  whyItMatters: 'Observability platforms are critical infrastructure. Downtime during incidents is unacceptable.',
  famousIncident: {
    title: 'AWS CloudWatch Outage',
    company: 'AWS',
    year: '2020',
    whatHappened: 'CloudWatch (AWS\'s monitoring service) went down during a major AWS outage. Customers couldn\'t monitor their systems during the very incident they needed it most.',
    lessonLearned: 'Monitoring must be more reliable than what it monitors. Multi-region, highly replicated, obsessively available.',
    icon: '☁️',
  },
  realWorldExample: {
    company: 'Datadog',
    scenario: 'Achieving 99.99% uptime',
    howTheyDoIt: 'Multi-region deployment. Database clusters with 3x replication. Automatic failover. Chaos engineering testing.',
  },
  keyPoints: [
    'Primary + replicas for high availability',
    'Automatic failover on failure',
    'Read replicas reduce primary load',
    'Elasticsearch shards are auto-replicated',
  ],
  diagram: `
┌────────────────────────────────────────┐
│     TIME-SERIES DB REPLICATION         │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────┐  Writes   ┌──────────┐  │
│  │ Workers  │ ────────▶ │ Primary  │  │
│  └──────────┘           └─────┬────┘  │
│                               │        │
│                         Replication    │
│                ┌──────────────┼────────┼──────┐
│                ▼              ▼        ▼      │
│          ┌──────────┐   ┌──────────┐  ┌──────────┐
│  Queries │ Replica1 │   │ Replica2 │  │ Replica3 │
│   ◀───── └──────────┘   └──────────┘  └──────────┘
│                                        │
│  If Primary fails → Promote Replica   │
└────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Primary-Replica', explanation: 'Leader handles writes, followers for reads', icon: '👑' },
    { title: 'Failover', explanation: 'Automatic promotion on primary failure', icon: '🔄' },
    { title: 'Read Replica', explanation: 'Copy of data for query load distribution', icon: '📖' },
  ],
  quickCheck: {
    question: 'Why is high availability MORE critical for observability platforms than other systems?',
    options: [
      'They process more data',
      'You need monitoring most during incidents - if it\'s down, you\'re blind',
      'They\'re harder to build',
      'Customers pay more for them',
    ],
    correctIndex: 1,
    explanation: 'Observability is your eyes into production. Losing it during an incident is catastrophic - you can\'t diagnose or fix issues.',
  },
};

const step10: GuidedStep = {
  id: 'observability-step-10',
  stepNumber: 10,
  frIndex: 0,
  story: step10Story,
  celebration: step10Celebration,
  learnPhase: step10LearnPhase,
  practicePhase: {
    frText: 'All FRs require reliable infrastructure',
    taskDescription: 'Enable database replication for high availability',
    componentsNeeded: [
      { type: 'database', reason: 'Time-series DB with replication', displayName: 'Time-Series DB' },
    ],
    connectionsNeeded: [],
    successCriteria: [
      'Click on Time-Series DB',
      'Enable replication with 2+ replicas',
      'Verify all components are connected properly',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_engine', 'cache', 'message_queue', 'worker', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
      { fromType: 'message_queue', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'worker', toType: 'database' },
      { fromType: 'worker', toType: 'cache' },
      { fromType: 'search_engine', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Enable replication on the Time-Series Database',
    level2: 'Click on TSDB → Configuration → Enable replication with 2+ replicas',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const l5ObservabilityDatadogGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-observability-datadog-guided',
  problemTitle: 'Build Datadog - An Observability Platform Journey',

  requirementsPhase: observabilityRequirementsPhase,

  totalSteps: 10,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  finalExamTestCases: [
    {
      name: 'Metrics Ingestion',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Platform ingests 100K metrics per second with low latency',
      traffic: { type: 'write', rps: 100000, writeRps: 100000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Log Search Performance',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Search across billions of log lines in < 2 seconds',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 2000, maxErrorRate: 0.01 },
    },
    {
      name: 'Trace Processing',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Process 10K trace spans per second',
      traffic: { type: 'write', rps: 10000, writeRps: 10000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Alert Latency',
      type: 'performance',
      requirement: 'FR-4',
      description: 'Alerts trigger within 1 minute of threshold breach',
      traffic: { type: 'mixed', rps: 5000, readRps: 4000, writeRps: 1000 },
      duration: 120,
      passCriteria: { maxP99Latency: 60000, maxErrorRate: 0.01 },
    },
    {
      name: 'Traffic Spike Handling',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 2x traffic spike during incidents',
      traffic: { type: 'mixed', rps: 200000, readRps: 150000, writeRps: 50000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Maintain availability when primary database fails',
      traffic: { type: 'mixed', rps: 100000, readRps: 80000, writeRps: 20000 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 30, recoverySecond: 50 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'Cost Optimization',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet $5,000/month budget with full functionality',
      traffic: { type: 'mixed', rps: 100000, readRps: 80000, writeRps: 20000 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 5000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getL5ObservabilityDatadogGuidedTutorial(): GuidedTutorial {
  return l5ObservabilityDatadogGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = observabilityRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= observabilityRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
