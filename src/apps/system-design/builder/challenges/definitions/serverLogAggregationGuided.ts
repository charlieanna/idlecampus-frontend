import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Server Log Aggregation Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches system design concepts
 * while building a centralized log aggregation and search system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic log collection and storage
 * Steps 4-6: Add log shipping, indexing, and alerting
 *
 * Key Concepts:
 * - Centralized logging architecture
 * - Log shipping and aggregation
 * - Full-text search and indexing
 * - Log retention and compression
 * - Real-time alerting
 * - Query performance optimization
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const serverLogAggregationRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a centralized log aggregation system for a microservices platform with thousands of servers",

  interviewer: {
    name: 'Sarah Chen',
    role: 'VP of Engineering at LogScale Systems',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-logging',
      category: 'functional',
      question: "What are the core features needed for a log aggregation system?",
      answer: "We need to:\n\n1. **Collect logs** - Gather logs from thousands of distributed servers\n2. **Store logs centrally** - One place to search all application logs\n3. **Search logs** - Fast full-text search across billions of log lines\n4. **Alert on patterns** - Detect errors and anomalies in real-time\n5. **Visualize trends** - Dashboards showing error rates, latency metrics",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Log aggregation centralizes observability across distributed systems",
    },
    {
      id: 'log-sources',
      category: 'functional',
      question: "What kinds of servers generate logs?",
      answer: "Multiple sources:\n1. **Application servers** - API logs, business logic, errors\n2. **Web servers** - NGINX/Apache access logs\n3. **Database servers** - Slow query logs, errors\n4. **Load balancers** - Request routing logs\n5. **Containers** - Docker/Kubernetes pod logs\n\nEach server writes logs locally to files or stdout.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Heterogeneous log sources require unified collection strategy",
    },
    {
      id: 'log-format',
      category: 'functional',
      question: "What format are the logs in?",
      answer: "Mixed formats:\n- **JSON structured logs** - {\"timestamp\": \"2025-01-15T10:30:00Z\", \"level\": \"ERROR\", \"message\": \"...\"}\n- **Plain text** - Traditional syslog format\n- **Custom formats** - Application-specific formats\n\nWe need to parse and normalize all formats for searchability.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Log parsing and normalization enables consistent querying",
    },
    {
      id: 'search-requirements',
      category: 'functional',
      question: "What kind of searches do engineers need to perform?",
      answer: "Common queries:\n- **Keyword search**: Find all logs containing 'OutOfMemory'\n- **Field filters**: level=ERROR AND service='checkout'\n- **Time range**: Last 15 minutes, specific date range\n- **Regex patterns**: Find stack traces matching pattern\n- **Aggregations**: Count errors by service, p95 latency\n\nSearches must be fast (<3 seconds) across billions of logs.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Full-text search with structured field filtering is essential",
    },
    {
      id: 'alerting',
      category: 'functional',
      question: "How should the system alert teams about problems?",
      answer: "Alerting rules:\n- **Threshold alerts**: Error rate > 1% for 5 minutes\n- **Anomaly detection**: 10x spike in 404 errors\n- **Pattern matching**: Specific error messages appear\n\nNotifications via: Slack, PagerDuty, Email\nAlerts must fire within 1 minute of condition being met.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Real-time alerting requires continuous log monitoring",
    },
    {
      id: 'retention',
      category: 'clarification',
      question: "How long should logs be retained?",
      answer: "Tiered retention:\n- **Hot storage (7 days)**: Fast SSD, instant search\n- **Warm storage (30 days)**: Slower but searchable\n- **Cold storage (1 year)**: Compressed, archived to S3 for compliance\n\nAfter 1 year, logs are deleted (unless regulatory requirements).",
      importance: 'important',
      insight: "Retention tiers balance search performance with storage costs",
    },
    {
      id: 'log-enrichment',
      category: 'clarification',
      question: "Should logs be enriched with additional context?",
      answer: "Yes! Add metadata:\n- **Server info**: hostname, region, availability zone\n- **Service info**: service name, version, environment (prod/staging)\n- **Request tracing**: trace_id to correlate logs across services\n\nEnrichment happens during ingestion.",
      importance: 'important',
      insight: "Log enrichment enables powerful filtering and correlation",
    },

    // SCALE & NFRs
    {
      id: 'log-volume',
      category: 'throughput',
      question: "How many log lines per second are we talking about?",
      answer: "100,000 log lines per second at steady state, with spikes to 500,000 during incidents (when everyone enables debug logging)",
      importance: 'critical',
      calculation: {
        formula: "100K logs/sec × 86,400 sec = 8.64B logs/day",
        result: "~8.64 billion log lines daily",
      },
      learningPoint: "High-volume ingestion requires horizontal scaling and buffering",
    },
    {
      id: 'log-size',
      category: 'throughput',
      question: "What's the average size of a log line?",
      answer: "Average 500 bytes per log line (including JSON structure and metadata). At 100K logs/sec, that's 50MB/sec or 4.3TB/day",
      importance: 'critical',
      calculation: {
        formula: "100K logs/sec × 500 bytes = 50MB/sec",
        result: "~4.3TB per day",
      },
      learningPoint: "Data volume drives storage architecture decisions",
    },
    {
      id: 'search-latency',
      category: 'latency',
      question: "How fast should log searches return results?",
      answer: "p95 under 3 seconds for searches across 7 days of logs (billions of entries). Simple queries (<1 day) should return in under 1 second.",
      importance: 'critical',
      learningPoint: "Fast search requires indexing and query optimization",
    },
    {
      id: 'ingestion-latency',
      category: 'latency',
      question: "How quickly should logs appear after being written?",
      answer: "End-to-end latency from server writing log to searchable in system: p99 under 10 seconds. For real-time alerting, this is critical.",
      importance: 'critical',
      learningPoint: "Low ingestion latency enables real-time debugging and alerting",
    },
    {
      id: 'availability',
      category: 'reliability',
      question: "What happens if the log aggregation system goes down?",
      answer: "Can't lose logs! Servers must buffer locally if central system is down. When system recovers, buffered logs are shipped. Target: 99.9% uptime for the logging pipeline.",
      importance: 'critical',
      learningPoint: "Buffering and retry logic prevent log loss during outages",
    },
    {
      id: 'compression',
      category: 'scalability',
      question: "How do we handle the massive storage requirements?",
      answer: "Compress logs using gzip or similar (70-80% size reduction). Use columnar storage for efficient queries. Archive old logs to S3 with additional compression.",
      importance: 'important',
      learningPoint: "Compression is essential for log storage economics",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-logging', 'log-sources', 'search-requirements'],
  criticalFRQuestionIds: ['core-logging', 'log-sources', 'search-requirements'],
  criticalScaleQuestionIds: ['log-volume', 'search-latency', 'ingestion-latency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Collect logs from distributed servers',
      description: 'Ship logs from thousands of servers to central aggregation system',
      emoji: '📥',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Index and search logs',
      description: 'Enable fast full-text search across billions of log lines',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Store logs with retention tiers',
      description: 'Hot/warm/cold storage based on age and access patterns',
      emoji: '💾',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Alert on log patterns',
      description: 'Real-time alerting when error patterns or thresholds are detected',
      emoji: '🚨',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5,000 engineers',
    writesPerDay: '8.64 billion log lines',
    readsPerDay: '100 million searches',
    peakMultiplier: 5,
    readWriteRatio: '1:86',
    calculatedWriteRPS: { average: 100000, peak: 500000 },
    calculatedReadRPS: { average: 1157, peak: 5787 },
    maxPayloadSize: '~10KB (log line with stack trace)',
    storagePerRecord: '~500 bytes (compressed)',
    storageGrowthPerYear: '~1.5PB (4.3TB/day × 365)',
    redirectLatencySLA: 'p95 < 3s (search query)',
    createLatencySLA: 'p99 < 10s (ingestion to searchable)',
  },

  architecturalImplications: [
    'High volume → Need log shippers (Filebeat, Fluentd) on every server',
    'Fast search → Elasticsearch or similar inverted index required',
    'Data volume → Time-series partitioning, compression, tiered storage',
    'Real-time alerts → Streaming analysis of incoming logs',
    'Buffering → Message queue (Kafka) to handle ingestion spikes',
    'Scale → Horizontal scaling of indexers and search nodes',
  ],

  outOfScope: [
    'Distributed tracing (spans and traces)',
    'Metrics collection (Prometheus/StatsD)',
    'Application performance monitoring (APM)',
    'Log replay for debugging',
    'Multi-tenancy and access control',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where servers send logs to a central location and engineers can search them. Log shipping, indexing optimizations, and alerting will come in later steps. Functionality first, then scale!",
};

// =============================================================================
// STEP 1: Connect Log Servers to Aggregation Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🖥️',
  scenario: "Welcome to LogScale Systems! You've been hired to build a centralized logging platform.",
  hook: "Your company has 1,000 servers each writing logs locally. Engineers can't find errors because logs are scattered!",
  challenge: "Set up the basic connection from application servers to your log aggregation service.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Servers can now send logs to your aggregation service!',
  achievement: 'Basic log collection pipeline is online',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Log collectors', after: 'Ready' },
  ],
  nextTeaser: "But the server doesn't know how to process log data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Centralized Logging',
  conceptExplanation: `Every log aggregation system starts with **log sources** connecting to a **collection service**.

The flow:
1. Application servers (web servers, API servers, databases) are **log sources**
2. They run a **log shipper agent** (like Filebeat or Fluentd)
3. Log shippers send logs to your **Aggregation Server**
4. The aggregation server receives and prepares logs for storage

This centralizes logs from thousands of distributed servers into one searchable system.`,

  whyItMatters: 'Without centralized logging, engineers must SSH into individual servers to find errors. With 1000+ servers, this is impossible.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Collecting logs from 10,000+ servers',
    howTheyDoIt: 'Uses Fluentd agents on every server to ship logs to Kafka, then Elasticsearch for indexing and search',
  },

  keyPoints: [
    'Client = application servers generating logs',
    'Log Shipper = agent that tails log files and forwards them',
    'Aggregation Server = receives logs from all sources',
    'Centralization enables search across all servers',
  ],

  keyConcepts: [
    { title: 'Log Source', explanation: 'Server or application generating logs', icon: '📝' },
    { title: 'Log Shipper', explanation: 'Agent that forwards logs (Filebeat, Fluentd)', icon: '🚢' },
    { title: 'Aggregation Server', explanation: 'Receives logs from all sources', icon: '📡' },
  ],
};

const step1: GuidedStep = {
  id: 'log-aggregation-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for FR-1: Collect logs from distributed servers',
    taskDescription: 'Add a Client (representing application servers) and App Server (log aggregation service)',
    componentsNeeded: [
      { type: 'client', reason: 'Represents application servers generating logs', displayName: 'App Servers' },
      { type: 'app_server', reason: 'Log aggregation service receiving logs', displayName: 'Log Aggregator' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Log Ingestion API (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your log aggregation server is connected, but it doesn't handle log data yet!",
  hook: "A web server just tried to send 10,000 error logs but got a 404. Engineers are blind to the incident!",
  challenge: "Write the Python code to receive, parse, and validate incoming logs.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your log aggregation API is working!',
  achievement: 'You implemented log ingestion and validation',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can receive logs', after: '✓' },
    { label: 'Can query logs', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all logs are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Log Ingestion: Receiving and Parsing Logs',
  conceptExplanation: `Every log aggregation system needs **ingestion handlers** that:
1. Receive log batches from shippers (HTTP POST)
2. Parse log format (JSON, syslog, custom)
3. Extract fields (timestamp, level, message, service)
4. Validate required fields exist
5. Enrich with metadata (hostname, region)

For our system, we need:
- \`ingest_logs()\` - Receive and parse log batches
- \`search_logs()\` - Query logs by filters

For now, we'll store logs in memory (Python lists).`,

  whyItMatters: 'Log parsing extracts structured fields for efficient searching. Without it, logs are just unstructured text blobs.',

  famousIncident: {
    title: 'GitHub Outage from Log Flooding',
    company: 'GitHub',
    year: '2016',
    whatHappened: 'A bug caused one service to log at 100x normal rate. The log aggregation system couldn\'t handle the spike, filled up queues, and crashed. Engineers couldn\'t access logs to debug the original issue!',
    lessonLearned: 'Log ingestion must handle spikes gracefully. Rate limiting and backpressure are critical.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Ingesting 1TB+ of logs per day',
    howTheyDoIt: 'Uses Fluentd to parse logs, extract fields, and forward to Elasticsearch. Handles spikes by buffering to Kafka.',
  },

  keyPoints: [
    'Parse logs to extract structured fields (timestamp, level, message)',
    'Validate critical fields exist (timestamp is most important)',
    'Enrich logs with server metadata for filtering',
    'Handle multiple log formats (JSON, plaintext, syslog)',
  ],

  quickCheck: {
    question: 'Why is log parsing important for search performance?',
    options: [
      'It makes logs smaller',
      'Structured fields enable efficient filtering and indexing',
      'It\'s required by law',
      'Parsing prevents log loss',
    ],
    correctIndex: 1,
    explanation: 'Structured fields (level=ERROR, service=checkout) enable fast queries. Without parsing, you can only grep unstructured text.',
  },

  keyConcepts: [
    { title: 'Log Parsing', explanation: 'Extract structured fields from log text', icon: '🔍' },
    { title: 'Field Extraction', explanation: 'Pull out timestamp, level, message, etc.', icon: '📊' },
    { title: 'Log Enrichment', explanation: 'Add metadata (hostname, service, region)', icon: '➕' },
  ],
};

const step2: GuidedStep = {
  id: 'log-aggregation-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Collect and parse logs from servers',
    taskDescription: 'Configure APIs and implement Python handlers for log ingestion',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/logs and GET /api/v1/logs/search APIs',
      'Open the Python tab',
      'Implement ingest_logs() and search_logs() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the App Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for ingest_logs and search_logs',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/logs', 'GET /api/v1/logs/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Log Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your log aggregation server crashed during a production incident...",
  hook: "All logs are GONE! Engineers can't debug the incident. Root cause analysis is impossible.",
  challenge: "Add a database to persist logs so they survive server restarts.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your logs are now safe and searchable!',
  achievement: 'Logs persist in a time-series database',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Searchable logs', after: '100%' },
  ],
  nextTeaser: "But logs are piling up in memory before being written...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Log Storage: Time-Series Databases',
  conceptExplanation: `Logs are **time-series data** - they're always appended with timestamps and queried by time ranges.

Best databases for logs:
- **Elasticsearch** - Full-text search, inverted indexes, distributed
- **ClickHouse** - Columnar storage, extremely fast analytics
- **Loki** - Lightweight, labels-based like Prometheus

Key features needed:
- **Time-based partitioning** - Shard data by day/hour
- **Indexing** - Fast full-text search across billions of logs
- **Compression** - Logs compress 70-80% (repetitive text)
- **Retention policies** - Auto-delete old logs

For this tutorial, we'll use a time-series database optimized for log data.`,

  whyItMatters: 'Without persistent storage, logs disappear on restarts. Incident analysis requires historical logs.',

  famousIncident: {
    title: 'AWS DynamoDB Outage',
    company: 'Amazon Web Services',
    year: '2015',
    whatHappened: 'DynamoDB had a cascading failure. AWS engineers lost logs from the first 20 minutes of the incident due to log aggregation system overflow. Root cause analysis was severely delayed.',
    lessonLearned: 'Logs must be durable and retained through failures. Critical for post-incident analysis.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Storing 100+ TB of logs',
    howTheyDoIt: 'Uses Elasticsearch for recent logs (7 days), then archives to HDFS. Time-based indices enable fast queries and deletion.',
  },

  keyPoints: [
    'Time-series databases optimize for append-only log writes',
    'Partition logs by time (daily indices) for efficient queries',
    'Full-text indexing enables fast keyword searches',
    'Compression reduces storage costs by 70-80%',
  ],

  quickCheck: {
    question: 'Why are time-series databases ideal for log storage?',
    options: [
      'They\'re cheaper',
      'Logs are always appended with timestamps and queried by time ranges',
      'They use less memory',
      'They\'re easier to set up',
    ],
    correctIndex: 1,
    explanation: 'Logs are time-series data (append-only, time-based queries). Time-series databases optimize for this access pattern.',
  },

  keyConcepts: [
    { title: 'Time-Series DB', explanation: 'Database optimized for timestamped data', icon: '⏰' },
    { title: 'Indexing', explanation: 'Data structures for fast search', icon: '📇' },
    { title: 'Partitioning', explanation: 'Split data by time for efficient queries', icon: '📅' },
  ],
};

const step3: GuidedStep = {
  id: 'log-aggregation-step-3',
  stepNumber: 3,
  frIndex: 2,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-3: Store logs with persistence',
    taskDescription: 'Add a Database for log storage and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Time-series database for storing and indexing logs', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (Elasticsearch) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Message Queue for Log Buffering
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌊',
  scenario: "A production incident just caused a 10x spike in log volume!",
  hook: "Servers are logging furiously. Your database is overwhelmed by write load. Logs are being dropped!",
  challenge: "Add a message queue to buffer logs during traffic spikes.",
  illustration: 'traffic-spike',
};

const step4Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Your pipeline can handle log spikes!',
  achievement: 'Message queue buffers logs and smooths out write spikes',
  metrics: [
    { label: 'Peak log rate', after: '500K logs/sec' },
    { label: 'Database protected', after: '✓' },
    { label: 'Zero log loss', after: '✓' },
  ],
  nextTeaser: "But searching billions of logs is too slow...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Buffering Log Spikes',
  conceptExplanation: `Log volume is **bursty** - incidents cause 5-10x spikes. Message queues absorb the spike.

**Without Queue:**
Log Shipper → App Server → Database (writes directly)
- During spike: Database overwhelmed, logs dropped
- Database write rate is fixed capacity

**With Queue:**
Log Shipper → App Server → Queue → Database
- During spike: Queue accumulates logs
- Database consumes at steady rate
- No logs lost, database protected

Popular queues for logs:
- **Kafka** - High throughput, persistent, replayable
- **Redis Streams** - Lightweight, fast
- **RabbitMQ** - Simple, reliable

The queue acts as a shock absorber for variable log rates.`,

  whyItMatters: 'Log spikes during incidents are when you need logs most. Queues prevent log loss during critical moments.',

  famousIncident: {
    title: 'Slack Outage Log Loss',
    company: 'Slack',
    year: '2017',
    whatHappened: 'During a database failover, error log volume spiked 50x. Their log pipeline had no buffering. Elasticsearch couldn\'t keep up and rejected writes. They lost logs from the incident, making root cause analysis harder.',
    lessonLearned: 'Added Kafka between log shippers and Elasticsearch. Kafka buffers spikes, prevents log loss.',
    icon: '💬',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Handling log spikes from 10,000+ services',
    howTheyDoIt: 'Uses Kafka as log buffer. During incidents, Kafka can buffer hours of logs while Elasticsearch catches up.',
  },

  diagram: `
Servers generating logs
      │
      ▼
┌──────────────┐     ┌────────────────┐     ┌──────────────┐
│ Log Shipper  │──▶  │ Message Queue  │ ──▶ │ Elasticsearch│
│ (Filebeat)   │     │   (Kafka)      │     │              │
└──────────────┘     └────────────────┘     └──────────────┘
                            │
                     Buffers spikes!
                     - Normal: 100K logs/sec
                     - Spike: 500K logs/sec
                     - DB consumes at steady 150K/sec
`,

  keyPoints: [
    'Message queues decouple log ingestion from indexing',
    'Kafka buffers log spikes during incidents',
    'Database writes at steady rate, not overwhelmed',
    'Queue persistence prevents log loss on failures',
  ],

  quickCheck: {
    question: 'Why is a message queue important for log aggregation?',
    options: [
      'It makes logs searchable',
      'It buffers log spikes and prevents database overload',
      'It compresses logs',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'Log volume spikes during incidents. Queues buffer the spike, protecting the database from overload.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer between ingestion and storage', icon: '📬' },
    { title: 'Backpressure', explanation: 'Queue absorbs spikes, releases steady stream', icon: '🌊' },
    { title: 'Persistence', explanation: 'Queue stores logs durably', icon: '💾' },
  ],
};

const step4: GuidedStep = {
  id: 'log-aggregation-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Collect logs with buffering',
    taskDescription: 'Add a Message Queue to buffer logs before indexing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer log spikes and decouple ingestion from indexing', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
      'Message Queue connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue, then Message Queue to Database',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Search Index for Fast Queries
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "Engineers are complaining: searches take 2 minutes to return results!",
  hook: "Searching 'OutOfMemory' across 10 billion logs is scanning every log line. It's too slow!",
  challenge: "Add a search index to make queries instant.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Searches are now lightning fast!',
  achievement: 'Inverted index enables sub-second queries across billions of logs',
  metrics: [
    { label: 'Search latency', before: '120 seconds', after: '<3 seconds' },
    { label: 'Index built', after: '✓' },
    { label: 'Full-text search', after: 'Enabled' },
  ],
  nextTeaser: "But we're not alerting on error patterns yet...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Search Indexing: Inverted Indexes for Log Search',
  conceptExplanation: `**Inverted indexes** are the secret to fast log search.

**Without Index (Scan):**
Query: "OutOfMemory"
- Scan all 10 billion logs, check each for "OutOfMemory"
- Time: O(n) - 2 minutes for 10B logs

**With Inverted Index:**
Index maps: word → list of log IDs containing that word
\`\`\`
"OutOfMemory" → [log_123, log_456, log_789, ...]
"NullPointer" → [log_234, log_567, ...]
\`\`\`
Query: "OutOfMemory"
- Lookup "OutOfMemory" in index
- Retrieve matching log IDs
- Time: O(1) lookup + O(matches) - <3 seconds

**Elasticsearch** automatically builds inverted indexes on all text fields.

Indexes also support:
- Field filters: level=ERROR
- Range queries: timestamp > "2025-01-15"
- Aggregations: count by service`,

  whyItMatters: 'Without indexing, searching billions of logs is impossibly slow. Indexes make searches instant.',

  famousIncident: {
    title: 'Etsy Log Search Outage',
    company: 'Etsy',
    year: '2014',
    whatHappened: 'Their log search used MySQL full-table scans. As log volume grew, searches took 10+ minutes. During a production incident, engineers couldn\'t search logs fast enough to debug. Incident lasted 4 hours.',
    lessonLearned: 'Migrated to Elasticsearch with inverted indexes. Same queries now return in <1 second.',
    icon: '🛍️',
  },

  realWorldExample: {
    company: 'Datadog',
    scenario: 'Searching across trillions of log lines',
    howTheyDoIt: 'Uses custom inverted indexes with bloom filters for fast negative lookups. Shards data across 1000s of nodes.',
  },

  diagram: `
INVERTED INDEX STRUCTURE:

Logs:
  log_1: "ERROR OutOfMemory in checkout service"
  log_2: "INFO User logged in successfully"
  log_3: "ERROR NullPointer in checkout service"

Inverted Index:
  "ERROR"       → [log_1, log_3]
  "OutOfMemory" → [log_1]
  "checkout"    → [log_1, log_3]
  "service"     → [log_1, log_3]
  "INFO"        → [log_2]
  "NullPointer" → [log_3]

Query: "ERROR AND checkout"
  1. Lookup "ERROR" → [log_1, log_3]
  2. Lookup "checkout" → [log_1, log_3]
  3. Intersection → [log_1, log_3]
  4. Fetch log_1 and log_3 (instant!)
`,

  keyPoints: [
    'Inverted index maps words to document IDs',
    'Enables O(1) lookup instead of O(n) scan',
    'Supports complex queries (AND, OR, NOT)',
    'Built automatically during log ingestion',
  ],

  quickCheck: {
    question: 'Why are inverted indexes critical for log search?',
    options: [
      'They compress logs',
      'They enable instant lookup instead of scanning every log',
      'They prevent log loss',
      'They reduce storage costs',
    ],
    correctIndex: 1,
    explanation: 'Inverted indexes map keywords to log IDs. Queries become lookups (instant) instead of scans (slow).',
  },

  keyConcepts: [
    { title: 'Inverted Index', explanation: 'Maps keywords to document IDs', icon: '📇' },
    { title: 'Full-Text Search', explanation: 'Search any word in any field', icon: '🔍' },
    { title: 'Query Optimization', explanation: 'Smart index lookups for fast results', icon: '⚡' },
  ],
};

const step5: GuidedStep = {
  id: 'log-aggregation-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Index and search logs efficiently',
    taskDescription: 'Enable search indexing in the database',
    successCriteria: [
      'Click on Database component',
      'Go to Configuration tab',
      'Enable full-text indexing',
      'Configure index refresh interval (1 second for near real-time)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireSearchIndexing: true,
  },

  hints: {
    level1: 'Click on the Database, then find the indexing configuration',
    level2: 'Enable full-text indexing with 1-second refresh interval for near real-time search',
    solutionComponents: [
      { type: 'database', config: { indexing: { enabled: true, refreshInterval: 1 } } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Alerting Service
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "A critical service is throwing errors, but nobody knows!",
  hook: "The checkout service has a 15% error rate for 10 minutes. No alerts fired. Revenue is being lost!",
  challenge: "Add a real-time alerting service to detect log patterns and notify teams.",
  illustration: 'alert-miss',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a complete log aggregation system!',
  achievement: 'A production-ready centralized logging platform with alerting',
  metrics: [
    { label: 'Log ingestion', after: '100K logs/sec' },
    { label: 'Search latency', after: '<3 seconds' },
    { label: 'Indexed logs', after: '10B+' },
    { label: 'Real-time alerts', after: 'Enabled' },
    { label: 'Retention tiers', after: 'Configured' },
  ],
  nextTeaser: "You've mastered centralized logging architecture!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Real-Time Alerting: Monitoring Log Patterns',
  conceptExplanation: `**Alerting** continuously analyzes incoming logs to detect problems.

Common alert types:
1. **Threshold alerts** - Error rate > 5% for 5 minutes
2. **Pattern matching** - Specific error message appears
3. **Anomaly detection** - 10x spike in 404 errors
4. **Absence detection** - No logs from critical service

Alerting flow:
\`\`\`
Logs → Queue → Alerting Service (checks rules)
                      ↓ (condition met)
               Notification Service
                      ↓
          Slack / PagerDuty / Email
\`\`\`

Alert rules are defined like:
\`\`\`
IF error_count(service='checkout', window=5min) > 100
THEN notify(channel='#incidents', severity='critical')
\`\`\`

Alerts must fire within 1 minute of condition being met (real-time).`,

  whyItMatters: 'Manual log monitoring is impossible at scale. Automated alerting detects issues before customers complain.',

  famousIncident: {
    title: 'Knight Capital Trading Loss',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A software bug caused erroneous trades for 45 minutes. Logs showed errors immediately, but no alerts were configured. By the time engineers noticed, they lost $440 million.',
    lessonLearned: 'Proactive log monitoring with alerting is critical. Don\'t rely on humans watching dashboards.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Monitoring payment processing logs',
    howTheyDoIt: 'Uses Elasticsearch Watcher to detect payment failures, authorization spikes, and fraud patterns. Alerts fire within seconds.',
  },

  diagram: `
┌────────────────────────────────────────────┐
│         Alerting Pipeline                  │
│                                            │
│  1. Logs arrive in queue                   │
│     ↓                                      │
│  2. Alerting Service consumes logs         │
│     ↓                                      │
│  3. Check alert rules:                     │
│     - Error rate > threshold?              │
│     - Pattern detected?                    │
│     - Anomaly?                             │
│     ↓                                      │
│  4. Condition met?                         │
│     YES → Trigger notification             │
│           ↓                                │
│     ┌─────────────────────┐               │
│     │ Notification Service│               │
│     │ - Slack             │               │
│     │ - PagerDuty         │               │
│     │ - Email             │               │
│     └─────────────────────┘               │
└────────────────────────────────────────────┘
`,

  keyPoints: [
    'Alerting service continuously monitors log stream',
    'Rules define conditions (thresholds, patterns, anomalies)',
    'Notifications sent to appropriate channels',
    'Must be real-time (<1 minute latency)',
  ],

  quickCheck: {
    question: 'Why is real-time log alerting important?',
    options: [
      'It reduces storage costs',
      'It detects production issues before customers are impacted',
      'It makes searches faster',
      'It\'s required for compliance',
    ],
    correctIndex: 1,
    explanation: 'Real-time alerts detect problems immediately, enabling fast response before customers notice.',
  },

  keyConcepts: [
    { title: 'Alert Rules', explanation: 'Conditions that trigger notifications', icon: '📋' },
    { title: 'Threshold Alert', explanation: 'Fires when metric exceeds limit', icon: '📊' },
    { title: 'Pattern Matching', explanation: 'Detects specific error messages', icon: '🔍' },
  ],
};

const step6: GuidedStep = {
  id: 'log-aggregation-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Alert on log patterns',
    taskDescription: 'Add an Alerting Service to monitor logs and send notifications',
    componentsNeeded: [
      { type: 'app_server', reason: 'Alerting service that analyzes logs and triggers notifications', displayName: 'Alert Service' },
    ],
    successCriteria: [
      'Additional App Server (Alerting Service) added',
      'Alerting Service connected to Message Queue (reads logs)',
      'Configure alert rules for error rate thresholds',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' },
    ],
    requireSearchIndexing: true,
    requireAlertingService: true,
  },

  hints: {
    level1: 'Add another App Server component to represent the Alerting Service',
    level2: 'Connect the Alerting Service to the Message Queue to consume logs for monitoring',
    solutionComponents: [{ type: 'app_server', displayName: 'Alert Service' }],
    solutionConnections: [{ from: 'message_queue', to: 'app_server' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const serverLogAggregationGuidedTutorial: GuidedTutorial = {
  problemId: 'server-log-aggregation',
  title: 'Design Server Log Aggregation System',
  description: 'Build a centralized logging platform with log shipping, indexing, search, and real-time alerting',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '📊',
    hook: "You've been hired as Principal Engineer at LogScale Systems!",
    scenario: "Your mission: Build a centralized log aggregation system that collects logs from thousands of servers, enables fast search across billions of log lines, and alerts teams about production issues in real-time.",
    challenge: "Can you design a system that handles 100,000 logs/sec with sub-second search latency?",
  },

  requirementsPhase: serverLogAggregationRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Centralized Logging',
    'Log Shipping',
    'Log Parsing',
    'Time-Series Databases',
    'Full-Text Search',
    'Inverted Indexes',
    'Message Queues',
    'Log Buffering',
    'Real-Time Alerting',
    'Log Retention',
    'Data Compression',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (indexes)',
    'Chapter 10: Batch Processing (log analysis)',
    'Chapter 11: Stream Processing (real-time log monitoring)',
  ],
};

export default serverLogAggregationGuidedTutorial;
