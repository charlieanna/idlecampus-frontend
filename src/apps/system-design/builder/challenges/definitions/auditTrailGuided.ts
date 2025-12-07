import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Audit Trail Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building an immutable audit logging system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (event sourcing, compliance, replication, etc.)
 *
 * Key Concepts:
 * - Immutable logging (append-only, never delete)
 * - Compliance requirements (SOX, HIPAA, GDPR)
 * - Event sourcing architecture
 * - Tamper-proof logs (cryptographic hashing)
 * - Log retention and archival
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const auditTrailRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an audit trail system for tracking all changes in a financial application",

  interviewer: {
    name: 'Marcus Johnson',
    role: 'Chief Compliance Officer at FinTech Corp',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-logging',
      category: 'functional',
      question: "What events should we log in our audit trail?",
      answer: "We need to log EVERY state-changing operation:\n\n1. **User actions** - Login, logout, permission changes\n2. **Data modifications** - Create, update, delete operations\n3. **Financial transactions** - Payments, transfers, refunds\n4. **System events** - Configuration changes, deployments, errors\n\nEach log entry must include: WHO did WHAT, WHEN, WHERE (IP), and WHAT CHANGED (before/after state).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Audit logs must capture complete context - partial information is useless for investigations",
    },
    {
      id: 'immutability',
      category: 'functional',
      question: "Can we ever modify or delete audit logs?",
      answer: "ABSOLUTELY NOT! Audit logs must be **immutable**:\n- **Append-only** - can only add new entries, never modify existing ones\n- **Never delete** - logs must be retained for compliance periods (7+ years)\n- **Tamper-proof** - use cryptographic hashing to detect any tampering\n\nThis is a legal requirement for SOX, HIPAA, and other regulations.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Immutability is non-negotiable for audit systems - it's the foundation of trust",
    },
    {
      id: 'search-query',
      category: 'functional',
      question: "How do compliance officers query audit logs during investigations?",
      answer: "Compliance teams need to **search and filter** logs by:\n1. **User ID** - 'Show me everything user123 did'\n2. **Time range** - 'All actions between Jan 1-15'\n3. **Action type** - 'All deletion events'\n4. **Resource ID** - 'Who accessed account #456?'\n5. **IP address** - 'All logins from this IP'\n\nResults should be exportable to CSV for regulators.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Audit systems are useless if you can't quickly find relevant events during investigations",
    },
    {
      id: 'event-sourcing',
      category: 'functional',
      question: "Should we be able to reconstruct past states from audit logs?",
      answer: "YES! This is **event sourcing**. Every audit log is an event that describes a state change. By replaying events in order, we can:\n1. Reconstruct the exact state of any entity at any point in time\n2. Debug issues by replaying events that led to a bug\n3. Generate audit reports showing state evolution\n\nThis is powerful for compliance and debugging.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Event sourcing turns your audit trail into a time machine for your data",
    },
    {
      id: 'real-time-alerts',
      category: 'functional',
      question: "Should we alert on suspicious activities in real-time?",
      answer: "Yes! We need **real-time monitoring** for:\n- Multiple failed login attempts (potential breach)\n- Large financial transfers (fraud detection)\n- Permission escalation (security threat)\n- Access from unusual locations (compromised account)\n\nAlerts should trigger within seconds of the event.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Audit trails aren't just for post-incident analysis - they enable real-time security",
    },
    {
      id: 'log-format',
      category: 'clarification',
      question: "What format should audit logs use?",
      answer: "Use **structured JSON** for machine readability:\n\`\`\`json\n{\n  \"event_id\": \"evt_123\",\n  \"timestamp\": \"2025-01-15T14:30:00Z\",\n  \"user_id\": \"user_456\",\n  \"action\": \"UPDATE\",\n  \"resource_type\": \"account\",\n  \"resource_id\": \"acc_789\",\n  \"before\": {\"balance\": 1000},\n  \"after\": {\"balance\": 500},\n  \"ip_address\": \"192.168.1.1\",\n  \"user_agent\": \"Mozilla/5.0...\"\n}\n```",
      importance: 'important',
      insight: "Structured logs enable fast querying and automated analysis",
    },

    // SCALE & NFRs
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many audit events per day should we handle?",
      answer: "100 million audit events per day at steady state, with spikes to 500 million during peak trading hours or incidents",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 events/sec",
        result: "~1,200 events/sec average, ~6,000 at peak",
      },
      learningPoint: "Audit logging is extremely write-heavy - optimize for append operations",
    },
    {
      id: 'throughput-queries',
      category: 'throughput',
      question: "How many audit queries per day?",
      answer: "About 1 million queries per day (compliance officers, automated reports, investigations)",
      importance: 'critical',
      calculation: {
        formula: "1M ÷ 86,400 sec = 11.6 queries/sec",
        result: "~12 queries/sec average, ~50 at peak",
      },
      learningPoint: "Audit systems are write-heavy (100:1 write:read ratio)",
    },
    {
      id: 'latency-write',
      category: 'latency',
      question: "How fast should audit log writes be?",
      answer: "Audit logging must be **async and non-blocking**. Main application operations should not wait for audit logs:\n- Log to message queue: <5ms\n- Actual persistence: Can take up to 1 second\n- Critical: Don't slow down the main application!",
      importance: 'critical',
      learningPoint: "Audit logging should never impact application performance",
    },
    {
      id: 'latency-query',
      category: 'latency',
      question: "How fast should audit log searches be?",
      answer: "p99 under 2 seconds for typical queries (date range + filters). Complex queries across years of data can take longer.",
      importance: 'important',
      learningPoint: "Full-text search on logs requires specialized indexing (Elasticsearch)",
    },
    {
      id: 'retention-period',
      category: 'retention',
      question: "How long must we retain audit logs?",
      answer: "Compliance requirements vary by industry:\n- **SOX (financial)**: 7 years minimum\n- **HIPAA (healthcare)**: 6 years minimum\n- **GDPR (EU)**: Until no longer needed, but often 7 years\n\nFor our system, let's plan for **10 years** retention to be safe.",
      importance: 'critical',
      learningPoint: "Retention periods are legal requirements - violate them and face massive fines",
    },
    {
      id: 'tamper-detection',
      category: 'security',
      question: "How do we prove that audit logs haven't been tampered with?",
      answer: "Use **cryptographic hashing** and **digital signatures**:\n1. Each log entry contains hash of previous entry (blockchain-style)\n2. Any tampering breaks the hash chain\n3. Periodically sign entire log batches with private key\n4. Regulators can verify integrity with public key\n\nThis makes tampering mathematically detectable.",
      importance: 'critical',
      insight: "Tamper-proof logs require cryptographic guarantees, not just access controls",
    },
    {
      id: 'disaster-recovery',
      category: 'reliability',
      question: "What happens if we lose audit logs in a disaster?",
      answer: "Losing audit logs is **catastrophic and potentially illegal**. We need:\n- **Synchronous replication** across multiple data centers\n- **Daily backups** to separate storage (S3 Glacier)\n- **Zero data loss** tolerance\n- **Test restores** quarterly\n\nAudit logs are more critical than the data they track!",
      importance: 'critical',
      learningPoint: "Audit trail durability requirements exceed those of the application itself",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-logging', 'immutability', 'tamper-detection'],
  criticalFRQuestionIds: ['core-logging', 'immutability', 'search-query'],
  criticalScaleQuestionIds: ['throughput-events', 'retention-period', 'disaster-recovery'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Log all state changes',
      description: 'Capture WHO did WHAT, WHEN, WHERE for every operation',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Immutable logs',
      description: 'Append-only, never modify or delete entries',
      emoji: '🔒',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Search and filter logs',
      description: 'Query by user, time, action, resource, IP',
      emoji: '🔍',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Event sourcing',
      description: 'Reconstruct past states by replaying events',
      emoji: '⏮️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Real-time alerts',
      description: 'Notify on suspicious activities instantly',
      emoji: '🚨',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500,000 application users',
    writesPerDay: '100 million audit events',
    readsPerDay: '1 million queries',
    peakMultiplier: 5,
    readWriteRatio: '1:100 (write-heavy)',
    calculatedWriteRPS: { average: 1157, peak: 5785 },
    calculatedReadRPS: { average: 12, peak: 60 },
    maxPayloadSize: '~5KB (audit event with before/after state)',
    storagePerRecord: '~2KB (compressed audit event)',
    storageGrowthPerYear: '~73TB (100M events/day × 2KB × 365)',
    redirectLatencySLA: 'p99 < 2s (query)',
    createLatencySLA: 'p99 < 5ms (async write to queue)',
  },

  architecturalImplications: [
    '✅ Write-heavy (100:1) → Optimize for append operations, use append-only storage',
    '✅ Immutability required → No UPDATE/DELETE operations, use time-series DB',
    '✅ Long retention (10 years) → Need tiered storage (hot/warm/cold)',
    '✅ Search requirements → Full-text search engine (Elasticsearch)',
    '✅ Tamper-proof → Cryptographic hashing chain',
    '✅ Zero data loss → Synchronous replication + backups',
    '✅ Real-time alerts → Stream processing (Kafka + Flink)',
  ],

  outOfScope: [
    'Multi-region deployment',
    'Log anonymization for GDPR',
    'Machine learning for anomaly detection',
    'Video/audio audit trails',
    'Blockchain integration',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that captures audit events and stores them immutably. The advanced challenges like cryptographic verification, event sourcing, and tiered storage will come in later steps. Functionality first, then compliance hardening!",
};

// =============================================================================
// STEP 1: Connect Application to Audit Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📋',
  scenario: "Welcome to FinTech Corp! You've been hired to build a compliance-grade audit trail system.",
  hook: "The SEC just announced an investigation. We need to track EVERY change to customer accounts!",
  challenge: "Set up the basic flow so your application can send audit events to an audit server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your audit system is online!',
  achievement: 'Applications can now send audit events to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting events', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to process audit events yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Audit Trail Architecture',
  conceptExplanation: `Every audit trail system starts with **Applications** sending events to an **Audit Server**.

When something important happens in your application:
1. **Application** (banking app, healthcare portal, etc.) is the event source
2. It sends audit events to your **Audit Server** via API
3. The server processes and stores events immutably

Examples of audit events:
- User "john@example.com" logged in from IP 192.168.1.1
- Account #123 balance changed from $1000 → $500
- Admin granted "delete_user" permission to user #456

This is the foundation of ALL audit systems!`,

  whyItMatters: 'Without audit trails, you cannot prove compliance, investigate incidents, or detect fraud.',

  realWorldExample: {
    company: 'AWS CloudTrail',
    scenario: 'Logging billions of API calls daily',
    howTheyDoIt: 'Every AWS API call generates an audit event sent to CloudTrail service, stored immutably in S3 for compliance',
  },

  keyPoints: [
    'Application = source of audit events (who, what, when, where)',
    'Audit Server = receives, validates, and stores events',
    'HTTPS API = secure transport for sensitive audit data',
    'Events are fire-and-forget (async, non-blocking)',
  ],

  keyConcepts: [
    { title: 'Audit Event', explanation: 'Record of a state-changing action', icon: '📝' },
    { title: 'Application', explanation: 'System being audited', icon: '💼' },
    { title: 'Audit Server', explanation: 'Receives and stores audit events', icon: '🖥️' },
  ],
};

const step1: GuidedStep = {
  id: 'audit-trail-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client (representing your application) and App Server (audit server), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications generating audit events', displayName: 'Client' },
      { type: 'app_server', reason: 'Receives and processes audit events', displayName: 'Audit Server' },
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
// STEP 2: Implement Audit Event Handlers (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your audit server is connected, but it doesn't know how to process events!",
  hook: "A user just updated their account, but the audit event got a 404 error.",
  challenge: "Write the Python code to capture, validate, and log audit events.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your audit APIs are live!',
  achievement: 'You implemented the core audit logging functionality',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can capture events', after: '✓' },
    { label: 'Can query logs', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all audit logs are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Audit Event Processing: Critical Handlers',
  conceptExplanation: `Every audit API needs **handler functions** that process events immutably.

For audit trails, we need handlers for:
- \`log_event()\` - Receive and validate audit events
- \`query_logs()\` - Search audit logs by filters
- \`get_event()\` - Retrieve specific event by ID

**Critical requirements:**
1. **Validate input** - Ensure all required fields present (who, what, when, where)
2. **Append-only** - Never modify existing logs
3. **Include metadata** - Timestamp (UTC), IP address, user agent
4. **Hash chain** - Each event includes hash of previous event (tamper detection)

For now, we'll store events in memory (Python list). Database comes next!`,

  whyItMatters: 'A bug in audit logging can violate compliance and hide security breaches!',

  famousIncident: {
    title: 'Equifax Breach - Missing Audit Logs',
    company: 'Equifax',
    year: '2017',
    whatHappened: 'Hackers accessed 143 million records. Investigation revealed audit logging was disabled on critical systems. Equifax couldn\'t determine what data was accessed or when the breach started. Cost: $1.4 billion in fines and settlements.',
    lessonLearned: 'Audit logs are your last line of defense. Without them, you\'re blind during incidents.',
    icon: '🔓',
  },

  realWorldExample: {
    company: 'AWS CloudTrail',
    scenario: 'Processing 6,000 events/second at peak',
    howTheyDoIt: 'Events are validated, enriched with metadata, hashed for integrity, and written to immutable storage within seconds',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Validate ALL fields - incomplete audit logs are useless',
    'Use append-only operations (no updates or deletes)',
    'Include cryptographic hash for tamper detection',
    'Store in memory for now - database comes in Step 3',
  ],

  quickCheck: {
    question: 'Why must audit logs be append-only (immutable)?',
    options: [
      'It makes the system faster',
      'It\'s easier to implement',
      'To prevent tampering and ensure trustworthy evidence',
      'To save storage space',
    ],
    correctIndex: 2,
    explanation: 'Immutability ensures audit logs can\'t be altered to hide malicious activities. They\'re legal evidence!',
  },

  keyConcepts: [
    { title: 'Immutability', explanation: 'Once written, never modified or deleted', icon: '🔒' },
    { title: 'Hash Chain', explanation: 'Each event hashes previous event', icon: '⛓️' },
    { title: 'Validation', explanation: 'Ensure event contains all required fields', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'audit-trail-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Log all state changes, FR-3: Search logs',
    taskDescription: 'Configure APIs and implement Python handlers for audit logging',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/audit/events, GET /api/audit/events APIs',
      'Open the Python tab',
      'Implement log_event() and query_logs() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign audit endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for log_event and query_logs',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/audit/events', 'GET /api/audit/events'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Time-Series Database for Immutable Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your audit server crashed at 3 AM...",
  hook: "When it restarted, ALL audit logs were GONE! The SEC is demanding logs for an investigation - you have NOTHING.",
  challenge: "Add a time-series database optimized for append-only, immutable audit logs.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your audit logs are now immutable and durable!',
  achievement: 'Time-series database provides compliance-grade storage',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Immutability', after: 'Guaranteed' },
    { label: 'Durability', after: '100%' },
  ],
  nextTeaser: "But searching through millions of logs is getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Databases: Perfect for Audit Logs',
  conceptExplanation: `Regular databases (PostgreSQL, MySQL) allow UPDATE and DELETE. This is DANGEROUS for audit logs!

**Time-Series Databases** are designed for immutable, time-stamped data:
- **Append-only** - No UPDATE/DELETE operations supported
- **Time-indexed** - Optimized for time-range queries
- **Compression** - High compression ratios for log data
- **Retention policies** - Automatic archival to cold storage

Popular options: InfluxDB, TimescaleDB, Amazon Timestream

For audit trails, we store:
- \`events\` table - All audit events with timestamp
- Indexed by: timestamp, user_id, resource_id, action
- Partition by: date (for efficient retention)

Schema:
\`\`\`
event_id, timestamp, user_id, action, resource_type, resource_id,
before_state, after_state, ip_address, user_agent, hash_prev
\`\`\``,

  whyItMatters: 'Using regular DB for audit logs invites tampering. Time-series DBs make immutability architectural!',

  famousIncident: {
    title: 'Uber God Mode Scandal',
    company: 'Uber',
    year: '2016',
    whatHappened: 'Uber employees had a "God Mode" tool to track any user in real-time. The audit logs were stored in a regular database with no access controls. Employees deleted their own audit logs after snooping on celebrities and exes. No immutability = no accountability.',
    lessonLearned: 'Audit logs must be technically immutable, not just policy-protected.',
    icon: '👁️',
  },

  realWorldExample: {
    company: 'AWS CloudTrail',
    scenario: 'Storing 10+ years of API call logs',
    howTheyDoIt: 'Uses S3 (append-only object storage) + Athena (SQL queries). Logs are immutable by design and retained indefinitely.',
  },

  keyPoints: [
    'Time-series DBs enforce immutability at the architecture level',
    'Optimized for time-range queries (90% of audit queries)',
    'Built-in compression saves 80%+ on storage costs',
    'Automatic partitioning by date enables easy retention management',
  ],

  quickCheck: {
    question: 'Why use a time-series database instead of PostgreSQL for audit logs?',
    options: [
      'It\'s faster for all queries',
      'It\'s cheaper',
      'It enforces immutability and optimizes for time-based queries',
      'It has better documentation',
    ],
    correctIndex: 2,
    explanation: 'Time-series DBs are architecturally immutable (no UPDATE/DELETE) and optimized for the time-range queries that dominate audit workloads.',
  },

  keyConcepts: [
    { title: 'Time-Series DB', explanation: 'Optimized for time-stamped, immutable data', icon: '📊' },
    { title: 'Append-Only', explanation: 'Can only INSERT, never UPDATE/DELETE', icon: '➕' },
    { title: 'Time Indexing', explanation: 'Fast queries by timestamp ranges', icon: '⏰' },
  ],
};

const step3: GuidedStep = {
  id: 'audit-trail-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Immutable logs with compliance-grade storage',
    taskDescription: 'Add a Database (Time-Series DB) and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store audit events immutably with time-series optimization', displayName: 'TimescaleDB' },
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
    level1: 'Drag a Database (TimescaleDB) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Search Engine for Fast Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔍',
  scenario: "Compliance is frustrated! Searching audit logs takes 30+ seconds.",
  hook: "The SEC wants all actions by user 'john@example.com' in Q4 2024. Your database query timed out after 2 minutes!",
  challenge: "Add Elasticsearch to enable fast full-text search across millions of audit events.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Audit searches are lightning fast!',
  achievement: 'Elasticsearch enables sub-second queries across years of logs',
  metrics: [
    { label: 'Search latency', before: '30s', after: '200ms' },
    { label: 'Full-text search', after: 'Enabled' },
    { label: 'Complex filters', after: 'Supported' },
  ],
  nextTeaser: "But what about handling audit events without slowing down the application?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Search Engines: Fast Queries for Compliance',
  conceptExplanation: `Time-series databases are great for storage, but **searches can be slow** for complex queries.

**Search Engines (Elasticsearch)** provide:
- **Full-text search** - "Find all events containing 'password reset'"
- **Complex filters** - Combine user_id, time range, action type, IP
- **Aggregations** - "How many login failures per hour?"
- **Sub-second queries** - Even across billions of events

Architecture:
1. Audit event written to time-series DB (source of truth)
2. Event also indexed in Elasticsearch (search layer)
3. Queries hit Elasticsearch for speed
4. If needed, fetch full event from DB

For audit trails, index:
- All text fields for full-text search
- User ID, resource ID, action type for filtering
- Timestamp for time-range queries
- IP address for security investigations`,

  whyItMatters: 'Compliance investigations require fast searches across years of data. Slow searches = failed audits.',

  famousIncident: {
    title: 'Target Data Breach - Lost in Logs',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target\'s security tools detected the breach and logged alerts. But with 1.6 million alerts per week and no good search tools, security teams couldn\'t find the critical alerts. 40 million credit cards were stolen. Better audit search could have prevented $200M in losses.',
    lessonLearned: 'Audit logs are useless if you can\'t search them effectively during incidents.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Datadog',
    scenario: 'Searching across 1 trillion log events per day',
    howTheyDoIt: 'Uses Elasticsearch clusters with custom indexing strategies. Queries across petabytes complete in milliseconds.',
  },

  diagram: `
┌────────┐     ┌──────────────┐     ┌──────────────┐
│ Client │ ──▶ │ Audit Server │ ──▶ │ TimescaleDB  │
└────────┘     └──────────────┘     │(source truth)│
                     │               └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │Elasticsearch │
              │ (fast search)│
              └──────────────┘
                     ▲
                     │
              Compliance queries
                search here
`,

  keyPoints: [
    'Elasticsearch provides fast full-text search across audit logs',
    'Dual-write: TimescaleDB (source of truth) + Elasticsearch (search)',
    'Index user_id, timestamp, action, resource for fast filters',
    'Aggregations enable compliance reports (events per user, per day)',
  ],

  quickCheck: {
    question: 'Why use both TimescaleDB and Elasticsearch?',
    options: [
      'They\'re redundant - only need one',
      'TimescaleDB for immutable storage, Elasticsearch for fast search',
      'Elasticsearch is cheaper',
      'It\'s a compliance requirement',
    ],
    correctIndex: 1,
    explanation: 'TimescaleDB is the immutable source of truth. Elasticsearch provides fast search capabilities. Best of both worlds!',
  },

  keyConcepts: [
    { title: 'Full-Text Search', explanation: 'Search for any text across all fields', icon: '🔎' },
    { title: 'Indexing', explanation: 'Pre-process data for fast queries', icon: '📑' },
    { title: 'Dual-Write', explanation: 'Write to both DB and search engine', icon: '✌️' },
  ],
};

const step4: GuidedStep = {
  id: 'audit-trail-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Search and filter logs (now fast!)',
    taskDescription: 'Add a Search Engine (Elasticsearch) for fast audit queries',
    componentsNeeded: [
      { type: 'search_engine', reason: 'Enable fast full-text search across audit logs', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Engine component added to canvas',
      'App Server connected to Search Engine',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_engine'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
    ],
  },

  hints: {
    level1: 'Drag a Search Engine (Elasticsearch) component onto the canvas',
    level2: 'Connect App Server to Search Engine. This enables fast queries across millions of logs.',
    solutionComponents: [{ type: 'search_engine' }],
    solutionConnections: [{ from: 'app_server', to: 'search_engine' }],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Async Event Processing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your application is getting SLOW! Every action waits for audit logging.",
  hook: "A customer complained: 'Your app takes 500ms just to update my profile!' Audit logging is blocking the main thread.",
  challenge: "Add a message queue to make audit logging async and non-blocking.",
  illustration: 'slow-app',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Application performance restored!',
  achievement: 'Async audit logging no longer blocks user operations',
  metrics: [
    { label: 'App response time', before: '500ms', after: '50ms' },
    { label: 'Audit write latency', before: '100ms', after: '5ms (to queue)' },
    { label: 'Throughput', after: '10x improvement' },
  ],
  nextTeaser: "But how do we enable real-time alerts on suspicious activities?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Audit Logging',
  conceptExplanation: `Audit logging should NEVER slow down your application!

**The Problem:**
- Application → Audit Server → Database (100ms)
- User waits 100ms for their action to complete
- Terrible user experience!

**The Solution: Message Queue**
1. Application → Publish event to queue (5ms) → Return success to user
2. Background worker consumes queue
3. Worker writes to TimescaleDB + Elasticsearch
4. Total latency for user: 5ms (instant!)

Benefits:
- **Non-blocking** - Application doesn't wait for audit persistence
- **Buffering** - Queue absorbs traffic spikes
- **Reliability** - If DB is down, events wait in queue (no data loss)
- **Backpressure** - Queue prevents overwhelming database

For audit trails:
- Use Kafka or RabbitMQ for message queue
- Partition by user_id for ordering guarantees
- Set retention to 7 days (buffer for outages)`,

  whyItMatters: 'Audit logging is critical but should be invisible to users. Message queues make it async.',

  famousIncident: {
    title: 'GitHub Audit Log Outage',
    company: 'GitHub',
    year: '2020',
    whatHappened: 'GitHub\'s audit logging system had a bug that caused audit writes to block. Every git push waited for audit persistence. The site slowed to a crawl. Took 4 hours to fix. Impact: Millions of developers couldn\'t work.',
    lessonLearned: 'Audit logging MUST be async. Never block the critical path.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Logging 5,000+ API calls/second',
    howTheyDoIt: 'Every API call publishes audit event to Kafka. Consumers write to multiple storage systems (S3, database, Elasticsearch) asynchronously.',
  },

  diagram: `
Application action
      │
      │ 1. Publish to queue (5ms)
      ▼
┌─────────────┐     ┌─────────────────────────────┐
│   Client    │────▶│      Message Queue          │
│             │     │  [evt1, evt2, evt3, ...]    │
└─────────────┘     └──────────┬──────────────────┘
      │                        │
      │ 2. Return success      │ 3. Workers consume
      │    instantly!          ▼
      │                 ┌──────────────┐
      │                 │Audit Workers │
      │                 │ (background) │
      │                 └──────┬───────┘
      │                        │
      │         ┌──────────────┼──────────────┐
      │         ▼              ▼              ▼
      │   TimescaleDB   Elasticsearch    S3 Archive
`,

  keyPoints: [
    'Message queue decouples audit logging from application flow',
    'Application publishes to queue (<5ms), workers persist async',
    'Queue buffers events during database outages',
    'Guarantees ordering with partitioning by user_id',
  ],

  quickCheck: {
    question: 'Why use a message queue for audit logging?',
    options: [
      'It\'s cheaper than direct database writes',
      'It makes audit logging async and non-blocking',
      'It\'s required for compliance',
      'It reduces storage costs',
    ],
    correctIndex: 1,
    explanation: 'Message queues allow applications to publish events instantly (5ms) without waiting for database persistence (100ms).',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Don\'t wait for slow operations', icon: '⚡' },
    { title: 'Buffering', explanation: 'Queue absorbs traffic spikes', icon: '📦' },
    { title: 'Non-Blocking', explanation: 'Application doesn\'t wait', icon: '🚀' },
  ],
};

const step5: GuidedStep = {
  id: 'audit-trail-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from async, non-blocking audit logging',
    taskDescription: 'Add a Message Queue for async event processing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Enable async audit logging without blocking application', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Client connected to Message Queue (publish events)',
      'Message Queue connected to App Server (workers consume)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server', 'database', 'search_engine'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect Client → Message Queue → App Server. This creates async processing pipeline.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'client', to: 'message_queue' },
      { from: 'message_queue', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Stream Processing for Real-Time Alerts
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "SECURITY BREACH! An attacker is trying to guess passwords.",
  hook: "They failed login 50 times in 2 minutes. By the time we found it in the audit logs (next day), they had succeeded and stolen data!",
  challenge: "Add stream processing to detect suspicious patterns in real-time and alert immediately.",
  illustration: 'security-alert',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Real-time threat detection is live!',
  achievement: 'Stream processing enables instant alerts on suspicious activities',
  metrics: [
    { label: 'Alert latency', before: '24 hours', after: '<10 seconds' },
    { label: 'Threats detected', after: 'Real-time' },
    { label: 'False positives', after: 'Minimized' },
  ],
  nextTeaser: "But what if our database fails? We need disaster recovery...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Stream Processing: Real-Time Security Intelligence',
  conceptExplanation: `Audit logs aren't just for post-incident analysis - they enable **real-time security**!

**Stream Processing** analyzes events as they flow through the queue:
- **Pattern detection** - 5+ failed logins in 1 minute
- **Anomaly detection** - User accessing from unusual location
- **Threshold alerts** - Large financial transfer (>$10K)
- **Correlation** - Permission escalation + data export = insider threat

Architecture:
1. Events flow through Kafka
2. Stream processor (Flink/Kafka Streams) consumes events
3. Stateful processing detects patterns
4. Alerts sent to notification system (email, Slack, PagerDuty)

Example rules:
- Failed login count > 5 in 1 min → Alert security team
- Admin grants permissions + exports data in 5 min → Block and alert
- Transaction amount > $50K → Require manual approval`,

  whyItMatters: 'Detecting threats 24 hours later is too late. Real-time alerts prevent breaches.',

  famousIncident: {
    title: 'Capital One Breach - Delayed Detection',
    company: 'Capital One',
    year: '2019',
    whatHappened: 'A hacker exploited a misconfigured firewall and exfiltrated 100 million customer records. The breach went undetected for 4 months because audit logs were only analyzed in batch (daily). Real-time stream processing could have alerted within minutes.',
    lessonLearned: 'Real-time audit log analysis is critical for security. Batch analysis is too slow.',
    icon: '🏦',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Real-time fraud detection on streaming',
    howTheyDoIt: 'Uses Apache Flink to process audit events in real-time. Detects account sharing, credential stuffing, and fraudulent signups within seconds.',
  },

  diagram: `
┌─────────┐     ┌──────────────┐     ┌──────────────────┐
│ Client  │────▶│Message Queue │────▶│Stream Processor  │
└─────────┘     │   (Kafka)    │     │  (Flink/Spark)   │
                └──────────────┘     └────────┬─────────┘
                       │                      │
                       │                      │ Detect patterns:
                       │                      │ - Failed logins
                       ▼                      │ - Large transfers
                ┌──────────────┐              │ - Anomalies
                │Audit Workers │              │
                │(persistence) │              ▼
                └──────────────┘     ┌──────────────────┐
                                     │ Alerting System  │
                                     │ (Email/Slack/PD) │
                                     └──────────────────┘
`,

  keyPoints: [
    'Stream processing analyzes audit events in real-time',
    'Detect patterns: failed logins, large transactions, anomalies',
    'Stateful processing tracks counts and time windows',
    'Alert latency: <10 seconds from event to notification',
  ],

  quickCheck: {
    question: 'Why is stream processing better than daily batch analysis for security?',
    options: [
      'It\'s cheaper',
      'It detects threats in seconds instead of hours/days',
      'It uses less storage',
      'It\'s easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Stream processing analyzes events in real-time, enabling immediate alerts. Batch analysis (daily) means threats go undetected for 24+ hours.',
  },

  keyConcepts: [
    { title: 'Stream Processing', explanation: 'Analyze events as they flow', icon: '🌊' },
    { title: 'Pattern Detection', explanation: 'Identify suspicious sequences', icon: '🔍' },
    { title: 'Stateful Processing', explanation: 'Track counts over time windows', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'audit-trail-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Real-time alerts on suspicious activities',
    taskDescription: 'Add Stream Processor to analyze audit events in real-time',
    componentsNeeded: [
      { type: 'stream_processor', reason: 'Detect security threats and anomalies in real-time', displayName: 'Flink' },
    ],
    successCriteria: [
      'Stream Processor component added',
      'Message Queue connected to Stream Processor',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server', 'database', 'search_engine', 'stream_processor'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
    ],
  },

  hints: {
    level1: 'Drag a Stream Processor (Flink) component onto the canvas',
    level2: 'Connect Message Queue → Stream Processor. This enables real-time pattern detection.',
    solutionComponents: [{ type: 'stream_processor' }],
    solutionConnections: [{ from: 'message_queue', to: 'stream_processor' }],
  },
};

// =============================================================================
// STEP 7: Add Database Replication for Zero Data Loss
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚠️',
  scenario: "CATASTROPHE! Your audit database crashed and lost 2 hours of logs.",
  hook: "Those 2 hours included a fraudulent $1M transfer. We can't prove who authorized it. The company is liable!",
  challenge: "Add database replication with zero data loss tolerance.",
  illustration: 'database-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Audit logs are now bulletproof!',
  achievement: 'Synchronous replication ensures zero audit log loss',
  metrics: [
    { label: 'Data loss on failure', before: 'Up to 2 hours', after: 'Zero' },
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Replication mode', after: 'Synchronous' },
  ],
  nextTeaser: "But we're storing 10 years of logs - costs are exploding...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Zero Tolerance for Audit Log Loss',
  conceptExplanation: `Losing audit logs is **worse than losing your data**! Audit logs are legal evidence.

For audit systems, database replication is **MANDATORY and SYNCHRONOUS**:

**Synchronous Replication:**
1. Write audit event to primary database
2. WAIT for replication to at least 2 replicas
3. Only then return success
4. Guarantees: Zero data loss

**Why synchronous (not async)?**
- Async: Primary confirms write, then replicates later
- Risk: Primary fails before replication = data loss
- For audit logs: This is UNACCEPTABLE

Architecture:
- Primary database (leader) - handles all writes
- 2+ Replicas (followers) - synchronously replicated
- If primary fails → Promote replica to primary
- Write latency penalty: +20-50ms (worth it for zero data loss)

Additional safeguards:
- Daily backups to S3 Glacier (immutable storage)
- Point-in-time recovery (restore to any second)
- Test disaster recovery quarterly`,

  whyItMatters: 'Compliance regulations REQUIRE audit log retention. Losing logs = massive fines and criminal liability.',

  famousIncident: {
    title: 'MF Global - Lost Audit Trail',
    company: 'MF Global',
    year: '2011',
    whatHappened: 'Financial firm lost track of $1.6 billion in customer funds. Their audit logs were incomplete and unreliable. Investigators couldn\'t determine where the money went. Company filed for bankruptcy. Executives faced criminal charges.',
    lessonLearned: 'Audit log reliability is non-negotiable. Use synchronous replication and backups.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'AWS CloudTrail',
    scenario: 'Zero tolerance for audit log loss',
    howTheyDoIt: 'Stores logs in S3 with 11-nines durability (99.999999999%). Uses synchronous replication across 3+ availability zones.',
  },

  diagram: `
                    ┌──────────────────┐
                    │Primary Database  │
                    │  (SYNC WRITE →)  │
                    └────────┬─────────┘
                             │ Synchronous Replication
                             │ (wait for confirmation)
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  ┌───────────┐       ┌───────────┐       ┌───────────┐
  │ Replica 1 │       │ Replica 2 │       │ Replica 3 │
  │   (AZ-1)  │       │   (AZ-2)  │       │   (AZ-3)  │
  └───────────┘       └───────────┘       └───────────┘

  Daily backup ──▶ S3 Glacier (immutable, 10-year retention)
`,

  keyPoints: [
    'Use SYNCHRONOUS replication for audit logs (zero data loss)',
    'Minimum 2 replicas in different availability zones',
    'Daily backups to immutable object storage (S3 Glacier)',
    'Test disaster recovery procedures quarterly',
    'Accept 20-50ms latency penalty for zero data loss guarantee',
  ],

  quickCheck: {
    question: 'Why is synchronous replication critical for audit logs?',
    options: [
      'It\'s faster than async',
      'It guarantees zero data loss - audit logs are legal evidence',
      'It\'s cheaper',
      'It\'s easier to set up',
    ],
    correctIndex: 1,
    explanation: 'Synchronous replication waits for replicas to confirm before success. This guarantees no audit logs are lost even if primary fails.',
  },

  keyConcepts: [
    { title: 'Synchronous Replication', explanation: 'Wait for replicas before confirming write', icon: '🔄' },
    { title: 'Zero Data Loss', explanation: 'No audit events lost on any failure', icon: '🛡️' },
    { title: 'Immutable Backups', explanation: 'Daily backups to append-only storage', icon: '📦' },
  ],
};

const step7: GuidedStep = {
  id: 'audit-trail-step-7',
  stepNumber: 7,
  frIndex: 1,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Immutable logs with zero data loss guarantee',
    taskDescription: 'Enable database replication with at least 2 replicas in synchronous mode',
    successCriteria: [
      'Click on the Database component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
      'Set replication mode to synchronous',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server', 'database', 'search_engine', 'stream_processor'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the Database, then find the replication settings in Configuration',
    level2: 'Enable replication, set replicas to 2+, and choose synchronous mode for audit log safety',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2, mode: 'synchronous' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Tiered Storage for Long-Term Retention
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💸',
  scenario: "Finance is alarmed! Your audit log storage costs are $500K/month and growing.",
  hook: "We're required to keep 10 years of logs. At current growth, we'll be paying $5M/month in 5 years!",
  challenge: "Implement tiered storage to move old logs to cheaper cold storage.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a compliance-grade audit trail system!',
  achievement: 'Immutable, searchable, cost-effective audit logging at scale',
  metrics: [
    { label: 'Monthly storage cost', before: '$500K', after: '$100K (80% reduction)' },
    { label: 'Retention period', after: '10 years' },
    { label: 'Data loss tolerance', after: 'Zero' },
    { label: 'Search latency', after: '<200ms' },
    { label: 'Alert latency', after: '<10s' },
  ],
  nextTeaser: "You've mastered audit trail system design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Tiered Storage: Cost-Effective Long-Term Retention',
  conceptExplanation: `Storing 10 years of audit logs in a hot database is **extremely expensive**!

**Tiered Storage Strategy:**

**Hot Tier (0-90 days):**
- Storage: TimescaleDB + Elasticsearch
- Cost: $50/GB/month (expensive but fast)
- Use case: Recent logs, frequent searches
- Latency: <200ms

**Warm Tier (90 days - 2 years):**
- Storage: TimescaleDB only (remove from Elasticsearch)
- Cost: $10/GB/month
- Use case: Occasional compliance queries
- Latency: 1-5 seconds

**Cold Tier (2-10 years):**
- Storage: S3 Glacier (immutable object storage)
- Cost: $1/GB/month (50x cheaper!)
- Use case: Regulatory retention, rare access
- Latency: 5-12 hours (retrieval time)

**Archive Tier (>10 years):**
- Storage: S3 Glacier Deep Archive
- Cost: $0.10/GB/month (500x cheaper!)
- Use case: Legal holds only
- Latency: 12-48 hours

Automation:
- Lifecycle policies automatically move logs between tiers
- No manual intervention needed
- Logs remain searchable (with varying latency)`,

  whyItMatters: 'Without tiered storage, audit log costs become unsustainable. Tiered storage cuts costs 80%+ while maintaining compliance.',

  famousIncident: {
    title: 'The $100M Database Bill',
    company: 'Anonymous Fintech',
    year: '2021',
    whatHappened: 'A fintech startup stored all 7 years of audit logs in their production database. Storage costs grew to $100M/year! They nearly went bankrupt before implementing tiered storage. Post-optimization: $5M/year (95% savings).',
    lessonLearned: 'Design for 10-year retention from day 1. Hot storage is for recent data only.',
    icon: '💀',
  },

  realWorldExample: {
    company: 'AWS CloudTrail',
    scenario: 'Storing 10+ years of logs for millions of customers',
    howTheyDoIt: 'Uses S3 with lifecycle policies. Hot logs (90 days) in Standard S3. Older logs automatically move to Glacier. Ultra-old logs in Deep Archive.',
  },

  diagram: `
Time-based Lifecycle Policies:

0-90 days         90 days-2 years      2-10 years        >10 years
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│   HOT    │  ──▶ │   WARM   │  ──▶ │   COLD   │  ──▶ │  ARCHIVE │
│TimescaleDB│      │TimescaleDB│      │ S3 Glacier│      │S3 Glacier│
│+ Search  │      │  (only)  │      │          │      │Deep Arch.│
│$50/GB/mo │      │$10/GB/mo │      │ $1/GB/mo │      │$0.10/GB  │
│<200ms    │      │ 1-5 sec  │      │ 5-12 hrs │      │12-48 hrs │
└──────────┘      └──────────┘      └──────────┘      └──────────┘

Storage Cost: 80% reduction vs. all-hot
Compliance: ✓ 10-year retention maintained
`,

  keyPoints: [
    'Hot tier (90 days): TimescaleDB + Elasticsearch for fast search',
    'Warm tier (2 years): TimescaleDB only, slower search',
    'Cold tier (10 years): S3 Glacier, hours to retrieve',
    'Automated lifecycle policies move logs between tiers',
    'Cost reduction: 80%+ while maintaining compliance',
  ],

  quickCheck: {
    question: 'Why not store all 10 years in the hot tier?',
    options: [
      'Hot storage isn\'t reliable enough',
      'Hot storage is 50-500x more expensive than cold storage',
      'It\'s against compliance regulations',
      'Hot storage can\'t handle that much data',
    ],
    correctIndex: 1,
    explanation: 'Hot storage (TimescaleDB + Elasticsearch) costs $50/GB/month. Cold storage (S3 Glacier) costs $1/GB/month. For 10 years of data, the cost difference is massive.',
  },

  keyConcepts: [
    { title: 'Tiered Storage', explanation: 'Different storage for different ages', icon: '📊' },
    { title: 'Lifecycle Policy', explanation: 'Automatic tier transitions', icon: '🔄' },
    { title: 'Cost Optimization', explanation: '80%+ savings on storage', icon: '💰' },
  ],
};

const step8: GuidedStep = {
  id: 'audit-trail-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-2: 10-year immutable retention with cost optimization',
    taskDescription: 'Add Object Storage for tiered archival of old audit logs',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store cold-tier audit logs (2-10 years) cost-effectively', displayName: 'S3 Glacier' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
      'Configure lifecycle policy to archive logs older than 90 days',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'message_queue', 'app_server', 'database', 'search_engine', 'stream_processor', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
      { fromType: 'message_queue', toType: 'stream_processor' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_engine' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Drag an Object Storage (S3 Glacier) component onto the canvas',
    level2: 'Connect App Server to Object Storage. Configure lifecycle policy to move logs >90 days old to cold storage.',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const auditTrailGuidedTutorial: GuidedTutorial = {
  problemId: 'audit-trail',
  title: 'Design an Audit Trail System',
  description: 'Build an immutable audit logging system with compliance-grade guarantees',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '📋',
    hook: "You've been hired as Lead Engineer at FinTech Corp!",
    scenario: "Your mission: Build a compliance-grade audit trail system that tracks every action with zero data loss and 10-year retention.",
    challenge: "Can you design a system that handles immutability, event sourcing, and real-time security alerts?",
  },

  requirementsPhase: auditTrailRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Immutable Logging',
    'Append-Only Storage',
    'Time-Series Databases',
    'Event Sourcing',
    'Full-Text Search',
    'Async Processing',
    'Message Queues',
    'Stream Processing',
    'Real-Time Alerts',
    'Synchronous Replication',
    'Zero Data Loss',
    'Tiered Storage',
    'Compliance Requirements',
    'Cryptographic Hashing',
    'Tamper-Proof Logs',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Append-only logs)',
    'Chapter 5: Replication (Synchronous replication)',
    'Chapter 10: Batch Processing',
    'Chapter 11: Stream Processing (Real-time alerts)',
  ],
};

export default auditTrailGuidedTutorial;
