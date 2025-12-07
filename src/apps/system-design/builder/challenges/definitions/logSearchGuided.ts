import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Log Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a centralized log search and aggregation platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (ELK stack, time-series indexing, sharding, cost)
 *
 * Key Concepts:
 * - Log aggregation from distributed services
 * - Full-text search with Elasticsearch
 * - Time-series indexing and retention
 * - ELK stack architecture
 * - Log parsing and structured logging
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const logSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a centralized log search and aggregation platform like Splunk or Datadog Logs",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Senior Principal Engineer at Observability Systems Inc.',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-log-collection',
      category: 'functional',
      question: "What's the main problem this system solves for engineers?",
      answer: "Engineers have a critical problem: **debugging distributed systems**. When a user reports an error, logs are scattered across hundreds of services:\n\n1. **Collect logs** - Gather logs from all services in one place\n2. **Search logs** - Find specific errors or patterns instantly\n3. **Filter by time** - View logs from the exact moment an issue occurred\n4. **Correlate requests** - Track a single request across multiple services",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Log aggregation solves the distributed debugging nightmare - finding needles in haystacks",
    },
    {
      id: 'full-text-search',
      category: 'functional',
      question: "How should engineers be able to search through logs?",
      answer: "Engineers need **full-text search** capabilities:\n- **Keyword search**: 'error', 'timeout', '500'\n- **Pattern matching**: 'user_id:12345', 'status:error'\n- **Regex support**: Find patterns like IP addresses or error codes\n- **Field filters**: service='api', environment='production'\n\nThey're searching through billions of log lines to find the ONE error.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Full-text search is essential - SQL LIKE queries won't scale to billions of logs",
    },
    {
      id: 'time-series-nature',
      category: 'functional',
      question: "Why is time so important for logs?",
      answer: "Logs are **time-series data** - the timestamp is EVERYTHING:\n- Engineers ask: 'Show me all errors between 2:00 PM and 2:05 PM yesterday'\n- Recent logs (last hour) are queried constantly\n- Old logs (30+ days) are rarely accessed\n- Time-based partitioning is critical for performance",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Time is the primary query dimension - we'll optimize for time-range queries",
    },
    {
      id: 'real-time-tail',
      category: 'functional',
      question: "Should engineers be able to watch logs in real-time?",
      answer: "Yes! **Live tail** is critical for debugging:\n- Engineers run 'tail -f' equivalent in the UI\n- See logs as they arrive in real-time\n- Essential for watching deployments or debugging active incidents\n\nFor MVP, let's support basic live tail with 1-2 second latency.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Real-time log streaming helps engineers debug live production issues",
    },
    {
      id: 'log-retention',
      category: 'clarification',
      question: "How long should we keep logs?",
      answer: "Standard retention is **30 days** for hot storage (fast search). After that:\n- Archive to cold storage (S3) for compliance (90 days to 7 years)\n- Or delete based on company policy\n\nFor MVP, focus on 30-day retention with automatic deletion.",
      importance: 'critical',
      insight: "Time-based retention prevents infinite storage costs",
    },
    {
      id: 'structured-vs-unstructured',
      category: 'clarification',
      question: "What format are the logs in?",
      answer: "Logs come in **mixed formats**:\n- **Structured**: JSON logs with fields like `{\"timestamp\": \"...\", \"level\": \"error\", \"message\": \"...\"}`\n- **Unstructured**: Plain text like 'ERROR: Connection timeout at 10.0.0.1'\n\nWe need to parse and extract fields for better filtering. Let's support both, with a focus on JSON for MVP.",
      importance: 'important',
      insight: "Structured logs enable better filtering and aggregation",
    },
    {
      id: 'alerting',
      category: 'clarification',
      question: "Should the system send alerts when certain log patterns appear?",
      answer: "Alerting is important but let's defer it for v2. For MVP, we're focused on **search and retrieval**. Alerting adds complexity around pattern matching and notification delivery.",
      importance: 'nice-to-have',
      insight: "Alerting is a separate feature - keep MVP focused on search",
    },
    {
      id: 'dashboards',
      category: 'clarification',
      question: "What about log analytics and dashboards?",
      answer: "Dashboards showing error rates, request volumes, etc. are valuable but not for MVP. Focus on **search first**, analytics later. Engineers need to find specific logs before they can build dashboards.",
      importance: 'nice-to-have',
      insight: "Search is the foundation - analytics can be built on top later",
    },

    // SCALE & NFRs
    {
      id: 'throughput-log-volume',
      category: 'throughput',
      question: "How many logs are we ingesting per day?",
      answer: "For a medium-sized company with 500 microservices:\n- **100 TB of logs per day** (compressed)\n- Each service logs ~200 GB/day\n- That's about 1 billion log lines per day",
      importance: 'critical',
      calculation: {
        formula: "1B logs ÷ 86,400 sec = 11,574 logs/sec average",
        result: "~12K writes/sec (36K at peak)",
      },
      learningPoint: "Log ingestion is WRITE-HEAVY - very different from read-heavy systems",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many engineers will be searching logs?",
      answer: "About 500 engineers actively debugging, with:\n- **5,000 searches per day** total\n- Most searches happen during incidents (spike pattern)\n- Each search might scan millions of log lines",
      importance: 'critical',
      calculation: {
        formula: "5K searches ÷ 86,400 sec = 0.06 searches/sec average",
        result: "~0.06 reads/sec (1-10 during incidents)",
      },
      learningPoint: "Despite massive write volume, reads are relatively rare - optimize for writes",
    },
    {
      id: 'throughput-services',
      category: 'throughput',
      question: "How many services are sending logs?",
      answer: "500 microservices across multiple environments:\n- Each service runs 5-10 instances\n- That's ~3,000 concurrent log producers\n- Each producer sends 4 logs/second on average",
      importance: 'important',
      learningPoint: "Highly distributed log sources - need efficient collection mechanism",
    },
    {
      id: 'payload-log-size',
      category: 'payload',
      question: "What's the average size of a log entry?",
      answer: "Average log entry is **500 bytes** (after compression):\n- Structured JSON logs: 300-1000 bytes\n- Plain text logs: 100-500 bytes\n- Stack traces can be 5-10 KB\n\nWe'll compress before storage, reducing size by ~70%.",
      importance: 'important',
      calculation: {
        formula: "1B logs × 500 bytes = 500 GB/day compressed",
        result: "~15 TB/month storage growth",
      },
      learningPoint: "Compression is essential for log storage economics",
    },
    {
      id: 'burst-incident-searches',
      category: 'burst',
      question: "What happens during a production incident?",
      answer: "During a P0 incident:\n- 10-50 engineers searching simultaneously\n- Search rate jumps from 0.06/sec to 10/sec (100x spike)\n- All searching the same time window (last 1-2 hours)\n- Need fast response despite concurrent load",
      importance: 'critical',
      insight: "Incidents create massive search spikes - need to handle bursts gracefully",
    },
    {
      id: 'burst-deployment-logs',
      category: 'burst',
      question: "What about log volume spikes during deployments?",
      answer: "During deployments:\n- Services restart and log heavily\n- Volume can spike 5-10x normal rate\n- Need to handle 100K+ logs/sec for short periods\n- Can't drop logs during these critical moments",
      importance: 'critical',
      insight: "Buffering and queuing are essential for handling write spikes",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast should search results return?",
      answer: "Search latency requirements:\n- **p50 < 1 second** for searches over last 24 hours\n- **p99 < 5 seconds** for complex searches\n- Engineers are actively debugging - waiting 30 seconds kills productivity",
      importance: 'critical',
      learningPoint: "Fast search requires indexing - can't scan raw logs",
    },
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "How quickly should new logs be searchable?",
      answer: "**Near real-time** - logs should be searchable within 10-30 seconds of being written. Engineers debugging live issues need recent logs immediately.\n\nSome systems batch for minutes, but faster is better for debugging.",
      importance: 'important',
      learningPoint: "Near real-time indexing balances search freshness with indexing efficiency",
    },
    {
      id: 'latency-live-tail',
      category: 'latency',
      question: "What about live tail latency?",
      answer: "Live tail should show logs within **1-2 seconds** of generation. Engineers watching deployments need near-instant feedback.",
      importance: 'important',
      learningPoint: "Live tail bypasses indexing for speed - different data path than search",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-log-collection', 'full-text-search', 'time-series-nature'],
  criticalFRQuestionIds: ['core-log-collection', 'full-text-search', 'time-series-nature'],
  criticalScaleQuestionIds: ['throughput-log-volume', 'burst-incident-searches', 'latency-search'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Collect logs from distributed services',
      description: 'Aggregate logs from hundreds of microservices into a centralized system',
      emoji: '📥',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Full-text search across all logs',
      description: 'Engineers can search billions of logs using keywords, patterns, and filters',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Time-based filtering and queries',
      description: 'Query logs by time range (e.g., "last hour" or "2:00-2:05 PM yesterday")',
      emoji: '⏰',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Structured field filtering',
      description: 'Filter logs by extracted fields like service, level, user_id, etc.',
      emoji: '🏷️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Real-time log streaming (live tail)',
      description: 'Watch logs arrive in real-time for active debugging',
      emoji: '📡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500 engineers',
    writesPerDay: '1 billion log lines',
    readsPerDay: '5,000 searches',
    peakMultiplier: 3,
    readWriteRatio: '1:200,000 (write-heavy!)',
    calculatedWriteRPS: { average: 11574, peak: 36000 },
    calculatedReadRPS: { average: 0.06, peak: 10 },
    maxPayloadSize: '~500 bytes per log (compressed)',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~180 TB',
    redirectLatencySLA: 'p50 < 1s (search), p99 < 5s',
    createLatencySLA: '< 30s (indexing latency)',
  },

  architecturalImplications: [
    '✅ Write-heavy (200K:1) → Optimize for write throughput',
    '✅ 36K writes/sec peak → Need distributed ingestion with buffering',
    '✅ Time-series data → Time-based partitioning is critical',
    '✅ Full-text search → Elasticsearch or similar inverted index required',
    '✅ 180TB/year growth → Automated retention and archival essential',
    '✅ Incident spikes → Over-provision search capacity for bursts',
  ],

  outOfScope: [
    'Log-based alerting (v2)',
    'Dashboards and analytics (v2)',
    'Log anomaly detection (v2)',
    'Multi-tenancy / team isolation',
    'Cold storage archival (mention but don\'t implement)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that collects logs and allows searching. The ELK stack complexity comes later - start with basic Client → App Server → Database. Functionality first, then the sophisticated time-series indexing!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔧',
  scenario: "Welcome to Observability Systems Inc! You've been hired to build a log search platform.",
  hook: "Engineers are drowning in logs scattered across 500 microservices. They need your help!",
  challenge: "Set up the foundation so engineers can send search queries to your system.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your log search platform is online!',
  achievement: 'Engineers can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to store or search logs yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every log search platform starts with a **Client** connecting to a **Server**.

When an engineer wants to search logs:
1. They open the dashboard (the **Client** - web UI)
2. They type a search query and hit enter
3. The request goes to your **App Server**
4. The server processes the search and returns matching logs

This is the foundation for all log platforms - Splunk, Datadog, Elasticsearch.`,

  whyItMatters: 'Without this connection, engineers have no way to search their logs. Back to SSH-ing into 500 servers individually!',

  realWorldExample: {
    company: 'Datadog',
    scenario: 'Serving 20,000+ customers searching logs',
    howTheyDoIt: 'Started with a simple search API, now handles millions of searches per day across petabytes of logs',
  },

  keyPoints: [
    'Client = the engineer\'s web dashboard for searching logs',
    'App Server = your backend that handles search queries',
    'HTTP = the protocol for sending search requests',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Web UI where engineers search logs', icon: '💻' },
    { title: 'App Server', explanation: 'Backend that processes search queries', icon: '🖥️' },
    { title: 'HTTP API', explanation: 'Protocol for search requests', icon: '🔗' },
  ],
};

const step1: GuidedStep = {
  id: 'log-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Engineers access the search UI', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles log search queries', displayName: 'App Server' },
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
// STEP 2: Implement Core APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it can't search or store logs yet!",
  hook: "An engineer just tried to search for 'error' and got nothing back.",
  challenge: "Write the Python code to ingest logs and search through them.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your server can handle logs!',
  achievement: 'You implemented the core log search functionality',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can ingest logs', after: '✓' },
    { label: 'Can search logs', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all logs vanish...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Log Ingestion and Search',
  conceptExplanation: `Every log platform needs two core APIs:

1. **Ingest API** - Receives logs from services
   - \`POST /api/v1/logs\` - Accepts log entries
   - Parses JSON fields (timestamp, level, message, service)
   - Stores in a searchable format

2. **Search API** - Finds matching logs
   - \`GET /api/v1/logs/search?query=error&start_time=...\`
   - Searches through stored logs
   - Returns matching entries sorted by time

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without these APIs, you have no log platform! This is where the magic happens - turning scattered logs into searchable data.',

  famousIncident: {
    title: 'The Great AWS Outage of 2017',
    company: 'Amazon S3',
    year: '2017',
    whatHappened: 'During an S3 outage, many companies realized their entire logging infrastructure depended on S3. When S3 went down, they lost the ability to debug the outage - their logs were gone!',
    lessonLearned: 'Log infrastructure must be independent and highly available. You can\'t debug failures if your logging system fails too.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Indexing billions of logs',
    howTheyDoIt: 'Uses inverted indexes for fast full-text search. Logs are indexed by every word, making searches instant even across billions of entries.',
  },

  keyPoints: [
    'Ingest API receives logs from services',
    'Search API finds logs matching queries',
    'In-memory storage is temporary - database comes next',
  ],

  quickCheck: {
    question: 'Why do we use in-memory storage initially?',
    options: [
      'It\'s faster than a database',
      'We\'re keeping it simple - database comes later',
      'Memory never loses data',
      'Log platforms don\'t need databases',
    ],
    correctIndex: 1,
    explanation: 'FR-First approach: Make it WORK first with simple in-memory storage. Database persistence and Elasticsearch indexing add complexity - we\'ll add them in the next steps.',
  },

  keyConcepts: [
    { title: 'Ingest', explanation: 'Receiving and storing logs', icon: '📥' },
    { title: 'Search', explanation: 'Finding logs matching a query', icon: '🔍' },
    { title: 'In-Memory', explanation: 'Temporary storage in Python lists', icon: '💾' },
  ],
};

const step2: GuidedStep = {
  id: 'log-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Collect logs, FR-2: Search logs',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/logs and GET /api/v1/logs/search APIs',
      'Open the Python tab',
      'Implement ingest_log() and search_logs() functions',
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
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for ingest_log and search_logs',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/logs', 'GET /api/v1/logs/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 3 AM. Your server crashed during a deploy...",
  hook: "When it restarted, ALL LOGS WERE GONE! Engineers can't debug yesterday's incident.",
  challenge: "Add a database to persist logs so they survive restarts.",
  illustration: 'fire-alarm',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your logs are now persistent!',
  achievement: 'Logs survive server restarts - no more data loss',
  metrics: [
    { label: 'Data persistence', before: '✗', after: '✓' },
    { label: 'Survives restarts', before: '✗', after: '✓' },
  ],
  nextTeaser: "But searching through millions of logs is getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Logs Need Databases',
  conceptExplanation: `In-memory storage is great for prototyping, but logs are **critical data**.

When a server crashes:
- ❌ In-memory logs: **GONE** forever
- ✅ Database logs: **SAFE** and queryable

The database provides:
1. **Durability** - Logs are written to disk
2. **Queryability** - Can search by timestamp, service, level
3. **Retention** - Old logs can be archived or deleted

For logs, we need a database optimized for:
- High write throughput (36K writes/sec at peak)
- Time-range queries (90% of queries: "show me last hour")
- Retention policies (auto-delete logs older than 30 days)`,

  whyItMatters: 'Logs are the "black box" for debugging production. Losing logs means losing your ability to understand what went wrong.',

  famousIncident: {
    title: 'GitLab Database Deletion',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'An engineer accidentally deleted the production database. When they tried to restore from backup, they discovered their backup process was broken. They lost 6 hours of production data.',
    lessonLearned: 'Persistence without backups is not enough. Always test your recovery process!',
    icon: '🗄️',
  },

  realWorldExample: {
    company: 'Splunk',
    scenario: 'Storing petabytes of logs',
    howTheyDoIt: 'Uses custom time-series database optimized for write-heavy log ingestion. Automatically manages retention and compression.',
  },

  keyPoints: [
    'Database provides durability - logs survive crashes',
    'Time-series optimized databases excel at log storage',
    'Automatic retention prevents infinite storage costs',
  ],

  quickCheck: {
    question: 'Why are time-range queries so important for logs?',
    options: [
      'Logs are always queried by time',
      'Engineers debug specific incidents that happened at specific times',
      'Time-based indexing is faster',
      'All of the above',
    ],
    correctIndex: 3,
    explanation: 'Time is the PRIMARY dimension for log queries. "Show me errors from 2-3 PM when the incident happened" is the most common query pattern. Time-based partitioning makes these queries fast.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives crashes and restarts', icon: '🛡️' },
    { title: 'Time-Series DB', explanation: 'Optimized for time-ordered data', icon: '📈' },
    { title: 'Retention', explanation: 'Automatic deletion of old data', icon: '🗑️' },
  ],
};

const step3: GuidedStep = {
  id: 'log-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Persist collected logs permanently',
    taskDescription: 'Add a Database and connect it to your App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Stores logs permanently', displayName: 'Database' },
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
    level1: 'Add a Database component to the canvas',
    level2: 'Connect the App Server to the Database so it can store logs persistently',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Elasticsearch for Full-Text Search
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Engineers are complaining that searches take 30+ seconds!",
  hook: "Searching 'error' across 1 billion logs using SQL LIKE '%error%' is impossibly slow.",
  challenge: "Add Elasticsearch to enable fast full-text search across billions of logs.",
  illustration: 'performance-problem',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Searches are now lightning fast!',
  achievement: 'Full-text search enabled - queries return in milliseconds',
  metrics: [
    { label: 'Search time', before: '30s', after: '< 1s' },
    { label: 'Full-text search', before: '✗', after: '✓' },
    { label: 'Engineer happiness', before: '😞', after: '😃' },
  ],
  nextTeaser: "But can your single server handle 36K logs/sec at peak?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Elasticsearch: The Secret Behind Fast Log Search',
  conceptExplanation: `Why is SQL so slow for full-text search?

**SQL Database:**
- SQL: \`SELECT * FROM logs WHERE message LIKE '%error%'\`
- Must scan EVERY row - O(n) complexity
- For 1 billion logs: 30+ seconds

**Elasticsearch (Inverted Index):**
- Builds an index: "error" → [log_1, log_5, log_99, ...]
- Search is a lookup - O(1) complexity
- For 1 billion logs: < 1 second

**How Elasticsearch works for logs:**
1. Ingest logs into both Database AND Elasticsearch
2. Database = source of truth (durability)
3. Elasticsearch = search index (speed)
4. Search queries hit Elasticsearch, return log IDs
5. Retrieve full logs from Database if needed

This is the **ELK stack** architecture (Elasticsearch + Logstash + Kibana).`,

  whyItMatters: 'Without Elasticsearch, full-text search across billions of logs is impossible at interactive speeds. This is THE technology that enables modern log platforms.',

  famousIncident: {
    title: 'Stack Overflow Outage',
    company: 'Stack Overflow',
    year: '2016',
    whatHappened: 'Their Elasticsearch cluster failed, taking down the search feature. They could still serve cached pages, but search was completely broken. Engineers spent hours debugging without proper log search.',
    lessonLearned: 'Elasticsearch is a single point of failure for search. Need replication and monitoring.',
    icon: '🔍',
  },

  realWorldExample: {
    company: 'Uber',
    scenario: 'Searching 100+ TB of logs daily',
    howTheyDoIt: 'Uses Elasticsearch clusters with hundreds of nodes. Logs are partitioned by time and indexed for full-text search. Engineers can search petabytes of historical logs in seconds.',
  },

  keyPoints: [
    'Inverted indexes enable O(1) full-text search',
    'Dual-write: Database for durability, Elasticsearch for speed',
    'Time-based indices (daily/hourly) optimize log queries',
  ],

  quickCheck: {
    question: 'Why do we store logs in BOTH Database and Elasticsearch?',
    options: [
      'Database is the source of truth (durability)',
      'Elasticsearch is optimized for search (speed)',
      'They serve different purposes - persistence vs search',
      'All of the above',
    ],
    correctIndex: 3,
    explanation: 'Database provides durability and retention management. Elasticsearch provides fast search. Both are needed for a complete log platform. This dual-write pattern is common in the ELK stack.',
  },

  keyConcepts: [
    { title: 'Inverted Index', explanation: 'Maps words to document IDs', icon: '📇' },
    { title: 'ELK Stack', explanation: 'Elasticsearch + Logstash + Kibana', icon: '📚' },
    { title: 'Dual-Write', explanation: 'Write to both DB and search index', icon: '✍️' },
  ],
};

const step4: GuidedStep = {
  id: 'log-search-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast full-text search across all logs',
    taskDescription: 'Add Elasticsearch for search indexing',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enables fast full-text search', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index (Elasticsearch) component added',
      'App Server connected to Elasticsearch for indexing',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Add a Search Index component to enable full-text search',
    level2: 'Connect App Server to Search Index - the server will dual-write logs to both Database and Elasticsearch',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Buffering
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Deployment time! 500 services are restarting simultaneously...",
  hook: "Log volume spiked to 100K logs/sec! Your server is dropping logs and crashing.",
  challenge: "Add a message queue to buffer log spikes and prevent data loss.",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your system can handle log spikes!',
  achievement: 'Message queue buffers bursts - zero logs dropped',
  metrics: [
    { label: 'Peak handling', before: '36K/sec', after: '100K+/sec' },
    { label: 'Logs dropped', before: 'Many', after: 'Zero' },
    { label: 'System stability', before: '😰', after: '😎' },
  ],
  nextTeaser: "But your single App Server is becoming a bottleneck...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Handling Write Bursts',
  conceptExplanation: `The log ingestion problem:

**Without Queue (Direct Write):**
- 500 services → App Server → Database/Elasticsearch
- During deployment spike: 100K logs/sec
- App Server can only process 10K/sec
- Result: **LOGS DROPPED** or server crashes

**With Message Queue (Buffered):**
- 500 services → Queue → App Server → Database/Elasticsearch
- Queue absorbs the spike (can buffer millions of logs)
- App Server processes at steady rate (10K/sec)
- Result: **ZERO LOGS LOST**, just slight indexing delay

**How it works:**
1. Services publish logs to queue (Kafka, RabbitMQ, AWS SQS)
2. Queue buffers logs in order
3. App Server consumes at sustainable rate
4. During spikes: queue grows, then drains
5. Logs are NEVER dropped, just delayed by seconds

This is the **Logstash** component in the ELK stack!`,

  whyItMatters: 'Logs during incidents and deployments are the MOST IMPORTANT logs. You can\'t afford to lose them. Message queues provide the buffer you need.',

  famousIncident: {
    title: 'Black Friday Log Loss',
    company: 'Anonymous E-commerce Company',
    year: '2019',
    whatHappened: 'During Black Friday traffic, their log system couldn\'t keep up. They dropped 40% of logs. When investigating post-Black Friday issues, critical debugging logs were missing.',
    lessonLearned: 'Never drop logs. Use queues to buffer spikes. Logs from high-traffic periods are too valuable to lose.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Ingesting logs from 10,000+ services',
    howTheyDoIt: 'Uses Apache Kafka as a buffer. Services publish to Kafka topics, and consumers drain at their own pace. Queue can handle 1M+ messages/sec.',
  },

  keyPoints: [
    'Queues decouple producers (services) from consumers (indexers)',
    'Buffer absorbs spikes - prevents log loss during bursts',
    'Async processing allows app servers to process at steady rate',
  ],

  quickCheck: {
    question: 'Why does a message queue prevent log loss during spikes?',
    options: [
      'It makes the database faster',
      'It buffers logs temporarily so servers can process them at a steady rate',
      'It compresses the logs',
      'It drops less important logs',
    ],
    correctIndex: 1,
    explanation: 'The queue acts as a shock absorber. When 100K logs/sec arrive, the queue buffers them. The app server processes at a steady 10K/sec. The queue grows during spikes and drains afterward - nothing is lost, just slightly delayed.',
  },

  keyConcepts: [
    { title: 'Buffering', explanation: 'Temporary storage to smooth spikes', icon: '🧺' },
    { title: 'Decoupling', explanation: 'Producers and consumers work independently', icon: '🔗' },
    { title: 'Async Processing', explanation: 'Process logs at sustainable rate', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'log-search-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Handle log ingestion spikes without data loss',
    taskDescription: 'Add a Message Queue between log producers and consumers',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffers log spikes', displayName: 'Message Queue (Kafka)' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server consumes from Queue',
      'Queue buffers incoming logs',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add a Message Queue to buffer incoming logs',
    level2: 'Connect the Message Queue to App Server - the queue will buffer logs and the server will consume them at a steady rate',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'message_queue', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer and Scale App Servers
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Your single App Server is maxed out at 100% CPU!",
  hook: "36K logs/sec during peak hours - one server can't process them all fast enough.",
  challenge: "Add a Load Balancer and scale to multiple App Servers.",
  illustration: 'scaling-up',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your system can scale horizontally!',
  achievement: 'Multiple app servers process logs in parallel',
  metrics: [
    { label: 'App servers', before: '1', after: '3+' },
    { label: 'Processing capacity', before: '10K/sec', after: '30K+/sec' },
    { label: 'Single point of failure', before: '✓', after: '✗' },
  ],
  nextTeaser: "But Elasticsearch is struggling with time-range queries...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: Multiple App Servers',
  conceptExplanation: `Why scale horizontally?

**Single App Server:**
- Processes 10K logs/sec
- At peak (36K/sec): Overwhelmed, slow, crashes
- Single point of failure - if it dies, log ingestion stops

**Multiple App Servers + Load Balancer:**
- Load Balancer distributes work across servers
- 3 servers × 10K/sec each = 30K/sec total capacity
- If one server fails, others continue working
- Easy to add more servers as volume grows

**How it works with Message Queue:**
1. Message Queue has millions of buffered logs
2. Load Balancer assigns servers to queue partitions
3. Each server consumes from its partition independently
4. Servers process in parallel → higher throughput
5. Each server writes to Database and Elasticsearch

This is a classic **consumer group** pattern in distributed systems.`,

  whyItMatters: 'Horizontal scaling is how you go from handling thousands to millions of logs per second. Adding servers is easier than making one server faster.',

  realWorldExample: {
    company: 'Datadog',
    scenario: 'Processing billions of logs daily',
    howTheyDoIt: 'Runs thousands of log processing workers across multiple regions. Auto-scales based on queue depth - if the queue is growing, add more workers.',
  },

  keyPoints: [
    'Load Balancer distributes work across multiple servers',
    'Each server processes independently from queue',
    'Linear scaling: 2x servers = 2x throughput',
  ],

  quickCheck: {
    question: 'Why is a Load Balancer essential when you have multiple App Servers?',
    options: [
      'It makes servers faster',
      'It distributes work evenly across servers',
      'It stores logs temporarily',
      'It replaces the message queue',
    ],
    correctIndex: 1,
    explanation: 'The Load Balancer ensures work is distributed evenly. Without it, some servers might be idle while others are overwhelmed. Even distribution maximizes throughput and prevents hotspots.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes requests across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for capacity', icon: '📊' },
    { title: 'Consumer Group', explanation: 'Multiple servers consuming from queue', icon: '👥' },
  ],
};

const step6: GuidedStep = {
  id: 'log-search-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'Scale log processing to handle peak throughput',
    taskDescription: 'Add Load Balancer to distribute work across multiple App Servers',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distributes load across servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connects to Load Balancer',
      'Load Balancer connects to App Server(s)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server. This allows you to scale to multiple app servers later.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Time-Series Partitioning (Elasticsearch Indices)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🕐',
  scenario: "Engineers complain: 'Searching last hour takes as long as searching all 30 days!'",
  hook: "Your Elasticsearch cluster searches ALL indices even for recent queries. Waste of resources!",
  challenge: "Implement time-based index partitioning to optimize time-range queries.",
  illustration: 'data-organization',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Time-range queries are now super fast!',
  achievement: 'Time-based partitioning optimizes the most common query pattern',
  metrics: [
    { label: 'Last hour search', before: '5s', after: '< 500ms' },
    { label: 'Indices searched', before: '30 (all days)', after: '1 (today)' },
    { label: 'Query efficiency', before: '😓', after: '⚡' },
  ],
  nextTeaser: "Your system works great, but is it cost-efficient?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Partitioning: The Log Search Optimization',
  conceptExplanation: `Why time-based partitioning is critical for logs:

**Query Pattern Analysis:**
- 90% of queries: "last hour" or "last 24 hours"
- 9% of queries: "last week"
- 1% of queries: "search all 30 days"

**Without Partitioning:**
- All logs in one giant Elasticsearch index
- Searching "last hour" scans 30 days of data
- Wasteful, slow, expensive

**With Time-Based Partitioning:**
- One index per day: \`logs-2024-01-15\`, \`logs-2024-01-16\`, ...
- Or per hour: \`logs-2024-01-15-14\`
- Query "last hour"? Search only \`logs-2024-01-15-14\`
- Query "last week"? Search 7 indices instead of all 30

**Automatic Benefits:**
1. **Faster queries** - Search less data
2. **Easier retention** - Delete old indices (e.g., delete \`logs-2024-01-01\` after 30 days)
3. **Better compression** - Old indices are read-only, can be heavily compressed
4. **Isolation** - Issues in one day's index don't affect others

This is a **best practice** for all time-series data (logs, metrics, traces).`,

  whyItMatters: 'Time-based partitioning is THE optimization that makes log search platforms viable at scale. Without it, queries get slower as data grows - a death spiral.',

  famousIncident: {
    title: 'Elasticsearch Cluster Collapse',
    company: 'Anonymous Startup',
    year: '2020',
    whatHappened: 'They stored all logs in a single growing index. After 3 months, the index was 10TB. Searches took minutes. Adding new logs triggered long merges. The cluster was unusable.',
    lessonLearned: 'Time-based indices with automatic rollover are mandatory for log storage. Never use a single unbounded index.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Elastic (creators of Elasticsearch)',
    scenario: 'Best practices for log storage',
    howTheyDoIt: 'Recommends daily indices with automatic rollover. ILM (Index Lifecycle Management) automatically moves old indices to cheaper storage, then deletes them. This is built into modern Elasticsearch.',
  },

  keyPoints: [
    'Time-based indices (daily/hourly) optimize log queries',
    'Query only relevant time ranges - not all data',
    'Automatic retention: delete old indices easily',
  ],

  quickCheck: {
    question: 'Why does time-based partitioning make "last hour" queries faster?',
    options: [
      'It compresses the data more',
      'It only searches the relevant time window instead of all data',
      'It uses a faster database',
      'It caches the results',
    ],
    correctIndex: 1,
    explanation: 'With daily indices, a "last hour" query searches only today\'s index (maybe yesterday\'s too). Without partitioning, it would search through all 30 days of data - 30x more work!',
  },

  keyConcepts: [
    { title: 'Time Partitioning', explanation: 'Separate indices per time period', icon: '📅' },
    { title: 'Index Rollover', explanation: 'Automatic creation of new indices', icon: '🔄' },
    { title: 'ILM', explanation: 'Index Lifecycle Management', icon: '♻️' },
  ],
};

const step7: GuidedStep = {
  id: 'log-search-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Optimize time-based queries with partitioning',
    taskDescription: 'Configure time-based partitioning strategy',
    successCriteria: [
      'Click on Search Index (Elasticsearch) component',
      'Configure time-based partitioning (daily indices)',
      'Set retention policy (30 days)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
    requireSearchIndexPartitioning: true,
  },

  hints: {
    level1: 'Click on the Elasticsearch component to configure partitioning',
    level2: 'Enable time-based partitioning with daily indices and set 30-day retention',
    solutionComponents: [
      { type: 'search_index', config: { partitioning: 'daily', retention: 30 } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💰',
  scenario: "Your CFO just saw the cloud bill: $10,000/month for log storage!",
  hook: "'Do we REALLY need to store 100TB of logs?' she asks. Time to optimize.",
  challenge: "Right-size your infrastructure to stay under budget while meeting SLAs.",
  illustration: 'budget-review',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your log platform is cost-optimized!',
  achievement: 'Delivering all FRs within budget - like a real engineer',
  metrics: [
    { label: 'Monthly cost', before: '$10,000', after: '< $3,000' },
    { label: 'Storage optimized', before: '✗', after: '✓' },
    { label: 'CFO happiness', before: '😡', after: '😊' },
  ],
  nextTeaser: "You've built a production-ready log search platform! 🚀",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Making Log Storage Affordable',
  conceptExplanation: `Log storage is EXPENSIVE at scale. How to optimize:

**1. Compression (70% savings)**
- Raw logs: 1.5 TB/day
- Compressed: 500 GB/day
- Already implemented! But verify it's enabled.

**2. Retention Tiers (60% savings)**
- Hot storage (last 7 days): Fast SSD, Elasticsearch
- Warm storage (8-30 days): Slower disk, compressed
- Cold storage (30-90 days): S3 / Glacier, no search
- Delete after 90 days (unless compliance requires more)

**3. Sampling (80% savings)**
- Store 100% of ERROR/WARN logs
- Sample 10% of INFO logs
- Sample 1% of DEBUG logs
- Most debugging happens with errors anyway

**4. Right-Sizing Infrastructure**
- App Servers: Auto-scale based on queue depth
- Elasticsearch: Use data tiers (hot/warm/cold nodes)
- Message Queue: Right-size based on peak + buffer

**5. Index Optimization**
- Use doc_values for fields you filter on
- Disable indexing for fields you never search
- Use keyword type instead of text for exact-match fields

**Real-World Cost Example:**
- Bad: $10K/month (1TB/day, 90-day SSD retention)
- Good: $2K/month (500GB compressed, 7-day SSD, 30-day warm, 90-day cold)`,

  whyItMatters: 'Log platforms are one of the most expensive parts of infrastructure. Cost optimization is not optional - it\'s the difference between a sustainable system and one that gets shut down.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Reducing log storage costs by 70%',
    howTheyDoIt: 'Implemented aggressive sampling (100% errors, 10% non-errors), 7-day hot retention, and moved to cold storage. Saved millions per year while maintaining debugging capabilities.',
  },

  keyPoints: [
    'Compression and retention tiers are the biggest cost savers',
    'Sampling INFO/DEBUG logs reduces volume without losing critical data',
    'Right-sizing prevents over-provisioning',
  ],

  quickCheck: {
    question: 'Why is it safe to sample INFO logs at 10% but keep 100% of ERROR logs?',
    options: [
      'INFO logs are not important',
      'ERROR logs are rare and critical for debugging',
      'INFO logs are too big',
      'Engineers never search INFO logs',
    ],
    correctIndex: 1,
    explanation: 'ERROR logs are rare (< 1% of logs) and CRITICAL for debugging. INFO logs are common and less critical - a 10% sample is usually enough to understand patterns without the full cost of storing everything.',
  },

  keyConcepts: [
    { title: 'Compression', explanation: 'Reduce storage size by 70%', icon: '🗜️' },
    { title: 'Retention Tiers', explanation: 'Hot → Warm → Cold → Delete', icon: '🌡️' },
    { title: 'Sampling', explanation: 'Store subset of high-volume logs', icon: '🎲' },
  ],
};

const step8: GuidedStep = {
  id: 'log-search-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $3,000/month budget',
    successCriteria: [
      'Review all component configurations',
      'Enable compression and retention policies',
      'Ensure total estimated cost is under $3,000/month',
      'Maintain all performance SLAs',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'search_index', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
    requireCostUnderBudget: true,
    requireSearchIndexPartitioning: true,
  },

  hints: {
    level1: 'Review each component for cost optimization opportunities',
    level2: 'Check: compression enabled, retention policy set, right-sized instances, auto-scaling configured',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const logSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'log-search',
  title: 'Design Log Search Platform',
  description: 'Build a centralized log aggregation and search system with Elasticsearch and time-series optimization',
  difficulty: 'advanced',
  estimatedMinutes: 55,

  welcomeStory: {
    emoji: '🔍',
    hook: "You've been hired as Lead Engineer at Observability Systems Inc!",
    scenario: "Your mission: Build a log search platform that helps engineers debug distributed systems with billions of logs across 500 microservices.",
    challenge: "Can you design a system that handles 36K logs/sec writes while keeping searches under 1 second?",
  },

  requirementsPhase: logSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Log Aggregation',
    'Full-Text Search',
    'Time-Series Indexing',
    'ELK Stack Architecture',
    'Elasticsearch Inverted Indexes',
    'Message Queue Buffering',
    'Write-Heavy Systems',
    'Time-Based Partitioning',
    'Index Lifecycle Management',
    'Retention Policies',
    'Log Sampling',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing (Kafka)',
    'Chapter 12: The Future of Data Systems',
  ],
};

export default logSearchGuidedTutorial;
