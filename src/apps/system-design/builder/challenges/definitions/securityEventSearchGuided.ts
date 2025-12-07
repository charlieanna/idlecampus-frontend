import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Security Event Search Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches SIEM (Security Information and Event Management)
 * system design for searching, correlating, and analyzing security events.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic SIEM search
 * Steps 4-6: Log correlation, threat detection, compliance reporting
 *
 * Key Concepts:
 * - Security event ingestion and normalization
 * - Real-time threat detection
 * - Event correlation across multiple sources
 * - Compliance reporting and audit trails
 * - SIEM architecture patterns
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const securityEventSearchRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a SIEM (Security Information and Event Management) system for enterprise security monitoring",

  interviewer: {
    name: 'Marcus Rodriguez',
    role: 'Chief Information Security Officer (CISO)',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-siem-functionality',
      category: 'functional',
      question: "What's the main problem a SIEM system solves for security teams?",
      answer: "Security teams need to **monitor and investigate threats** across the entire organization:\n\n1. **Collect security events** - Aggregate logs from firewalls, endpoints, applications, cloud services\n2. **Search and filter** - Find specific events across billions of logs\n3. **Correlate events** - Connect related events to detect attack patterns\n4. **Detect threats** - Identify suspicious activity in real-time\n5. **Compliance reporting** - Generate audit reports for regulations (SOC2, HIPAA, PCI-DSS)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "SIEM is the central nervous system for security - without it, organizations are blind to attacks",
    },
    {
      id: 'event-types',
      category: 'functional',
      question: "What types of security events need to be collected?",
      answer: "Security events come from multiple sources:\n\n**Network Security:**\n- Firewall logs (allow/deny decisions)\n- IDS/IPS alerts (intrusion detection)\n- VPN access logs\n- DNS query logs\n\n**Endpoint Security:**\n- Antivirus detections\n- Process execution logs\n- File access/modification\n- User login/logout events\n\n**Application Security:**\n- Authentication failures\n- Authorization violations\n- API access logs\n- Database queries\n\n**Cloud Security:**\n- AWS CloudTrail, Azure Activity Logs\n- IAM permission changes\n- Resource creation/deletion",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Security events are heterogeneous - SIEM must normalize data from 50+ different sources",
    },
    {
      id: 'event-correlation',
      category: 'functional',
      question: "How does event correlation help detect attacks?",
      answer: "**Individual events are noise. Correlated events reveal attacks.**\n\nExample attack pattern (credential stuffing):\n1. 100 failed logins from IP 1.2.3.4 (event type: auth_failure)\n2. 1 successful login from same IP (event type: auth_success)\n3. API call to download customer data (event type: api_call)\n4. Large data transfer to external IP (event type: network_egress)\n\nCorrelation rules connect these events:\n- **By user**: Same user across all events\n- **By time**: Events within 5 minute window\n- **By IP**: Originating from same source\n\nWithout correlation, these look like normal activity. Together, they're a data breach.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Correlation is what makes SIEM intelligent - it's not just search, it's threat detection",
    },
    {
      id: 'retention-requirements',
      category: 'functional',
      question: "How long must security events be retained?",
      answer: "Retention requirements are driven by **compliance and forensics**:\n\n**Hot storage (fast search): 90 days**\n- Active investigations need quick access\n- Most incidents are detected within 90 days\n\n**Warm storage (slower): 1 year**\n- Regulatory compliance (SOC2, HIPAA)\n- Historical threat analysis\n\n**Cold storage (archive): 7 years**\n- Legal requirements\n- Long-term forensics\n- Rarely accessed but must be retrievable\n\nUnlike regular logs (30 days), security events have legal retention requirements.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Security logs have longer retention than application logs due to compliance",
    },
    {
      id: 'threat-detection-rules',
      category: 'functional',
      question: "How do threat detection rules work?",
      answer: "SIEM uses **multiple detection methods**:\n\n**1. Signature-based (known attacks):**\n- Pattern: '5 failed logins → 1 success' = credential stuffing\n- Pattern: 'SQL injection in HTTP logs' = web attack\n- Fast, low false positives\n\n**2. Anomaly-based (unknown attacks):**\n- User logs in from new country (geographic anomaly)\n- 10x normal API calls (volume anomaly)\n- Access at 3 AM when user normally works 9-5 (temporal anomaly)\n- Higher false positives but catches zero-days\n\n**3. Behavioral-based (ML models):**\n- Build user/entity behavior profiles\n- Detect deviations from normal patterns\n- Example: User suddenly accessing databases they've never touched\n\nAll three methods run in parallel for defense-in-depth.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Defense-in-depth: combine signatures (known), anomalies (unknown), and ML (adaptive)",
    },
    {
      id: 'compliance-reporting',
      category: 'functional',
      question: "What compliance reports are required?",
      answer: "Security teams must generate **audit reports** for compliance:\n\n**SOC 2 Reports:**\n- All privileged access events\n- System configuration changes\n- Data access by administrators\n\n**PCI-DSS Reports:**\n- All access to cardholder data\n- Failed authentication attempts\n- Network firewall logs\n\n**HIPAA Reports:**\n- Access to patient records\n- Data export events\n- Authentication logs\n\nReports must be:\n- **Tamper-proof** (cryptographically signed)\n- **Complete** (no missing events)\n- **Exportable** (PDF, CSV for auditors)",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Compliance reporting is non-negotiable - failed audits can shut down the business",
    },
    {
      id: 'real-time-alerting',
      category: 'clarification',
      question: "How quickly must security alerts be generated?",
      answer: "**Critical alerts: <30 seconds from event to alert**\n\nExample critical alerts:\n- Ransomware detected (file encryption activity)\n- Privilege escalation (user gains admin rights)\n- Data exfiltration (large unusual data transfer)\n- Brute force attack in progress\n\nNon-critical alerts can be batched (every 5-15 minutes).\n\nSpeed matters: Every minute of delay allows attackers to do more damage.",
      importance: 'critical',
      insight: "Security alerting must be near real-time - attackers move fast",
    },
    {
      id: 'alert-fatigue',
      category: 'clarification',
      question: "How do we prevent alert fatigue?",
      answer: "**Alert fatigue kills security programs.**\n\nIf analysts see 10,000 alerts/day, they ignore them all - including real threats.\n\n**Strategies to reduce noise:**\n1. **Tuning**: Adjust thresholds to reduce false positives\n2. **Deduplication**: Group similar alerts (10 failed logins → 1 alert)\n3. **Risk scoring**: Prioritize high-confidence, high-impact alerts\n4. **Auto-remediation**: Handle low-risk events automatically\n\nTarget: <50 actionable alerts per analyst per day\nReality: Most SIEMs generate 1,000+ alerts/day (too many!)",
      importance: 'important',
      insight: "Signal-to-noise ratio determines SIEM effectiveness - fewer, better alerts win",
    },

    // SCALE & NFRs
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many security events per day?",
      answer: "For a mid-sized enterprise (5,000 employees, 10,000 devices):\n- **50 TB of security events per day**\n- ~500 million events per day\n- Average: 5,787 events/sec\n- Peak (during attacks): 50,000+ events/sec",
      importance: 'critical',
      calculation: {
        formula: "500M events ÷ 86,400 sec = 5,787 events/sec",
        result: "~6K events/sec average, ~50K during attacks",
      },
      learningPoint: "Security event volume is extreme - every endpoint, firewall, app generates logs",
    },
    {
      id: 'throughput-searches',
      category: 'throughput',
      question: "How many security analysts are searching events?",
      answer: "**50 security analysts** actively investigating:\n- 10,000 searches per day total\n- Most searches during incident response (spike pattern)\n- Each search might scan billions of events across days or weeks",
      importance: 'critical',
      calculation: {
        formula: "10K searches ÷ 86,400 sec = 0.12 searches/sec",
        result: "~0.12 searches/sec average, ~10 during major incidents",
      },
      learningPoint: "Search is read-heavy during incidents - need fast time-range and correlation queries",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "How fast must event searches return results?",
      answer: "Search latency requirements vary by use case:\n\n**Interactive search (analyst investigation):**\n- p50 < 2 seconds for last 24 hours\n- p99 < 10 seconds for complex correlations\n\n**Real-time detection (threat rules):**\n- p99 < 5 seconds to evaluate rules\n- Can't delay alert generation\n\n**Compliance reports:**\n- Can take minutes to hours (batch job)\n- Not time-sensitive",
      importance: 'critical',
      learningPoint: "Different query types have different latency requirements - optimize for common case",
    },
    {
      id: 'latency-ingestion',
      category: 'latency',
      question: "How quickly must events be searchable?",
      answer: "**Near real-time: Events searchable within 30-60 seconds**\n\nDuring active attacks, analysts need to see what's happening NOW. Delayed indexing means blind spots.\n\nSome events (critical alerts) bypass indexing and trigger rules immediately (<5 seconds).",
      importance: 'important',
      learningPoint: "Two-tier ingestion: critical events → fast path, bulk events → indexed path",
    },
    {
      id: 'availability-requirements',
      category: 'availability',
      question: "What happens if the SIEM goes down?",
      answer: "**Critical: SIEM downtime = security blindness**\n\nIf SIEM is down:\n- No threat detection (attackers operate freely)\n- No incident investigation (can't search events)\n- Compliance violation (missing audit logs)\n\nTarget: **99.9% uptime** (8.76 hours downtime per year)\n\nMust buffer events during outages so nothing is lost.",
      importance: 'critical',
      learningPoint: "SIEM is tier-1 critical infrastructure - must have redundancy and buffering",
    },
    {
      id: 'data-integrity',
      category: 'consistency',
      question: "Can security events ever be lost or modified?",
      answer: "**Absolutely not. Events must be immutable and durable.**\n\n**Requirements:**\n1. **No data loss** - Even during system failures, all events must be preserved\n2. **Immutable** - Events cannot be altered after ingestion (audit requirement)\n3. **Chain of custody** - Cryptographic proof events haven't been tampered with\n4. **Deduplicated** - Same event shouldn't be counted twice in correlation\n\nViolating these requirements invalidates the entire security program.",
      importance: 'critical',
      learningPoint: "Security logs are legal evidence - immutability and durability are non-negotiable",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-siem-functionality', 'event-types', 'event-correlation'],
  criticalFRQuestionIds: ['core-siem-functionality', 'event-types', 'event-correlation'],
  criticalScaleQuestionIds: ['throughput-events', 'latency-search', 'availability-requirements'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Collect and normalize security events',
      description: 'Ingest events from firewalls, endpoints, apps, cloud services and normalize into common schema',
      emoji: '📥',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Search and filter security events',
      description: 'Fast full-text and field-based search across billions of security events',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Correlate events across sources',
      description: 'Connect related events by user, IP, time window to detect attack patterns',
      emoji: '🔗',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Detect threats in real-time',
      description: 'Run detection rules and anomaly detection to identify security incidents',
      emoji: '🚨',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Generate compliance reports',
      description: 'Produce tamper-proof audit reports for SOC2, HIPAA, PCI-DSS compliance',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50 security analysts',
    writesPerDay: '500 million security events',
    readsPerDay: '10,000 searches',
    peakMultiplier: 10,
    readWriteRatio: '1:50,000 (write-heavy)',
    calculatedWriteRPS: { average: 5787, peak: 50000 },
    calculatedReadRPS: { average: 0.12, peak: 10 },
    maxPayloadSize: '~1KB per event (normalized)',
    storagePerRecord: '~2KB per event (with metadata)',
    storageGrowthPerYear: '~365 TB (hot + warm + cold)',
    redirectLatencySLA: 'p50 < 2s (search), p99 < 10s',
    createLatencySLA: '< 60s (indexing latency)',
  },

  architecturalImplications: [
    '✅ Write-heavy (50K:1) → Optimize for write throughput with buffering',
    '✅ 50K events/sec peak → Distributed ingestion pipeline required',
    '✅ Multi-source events → Event normalization layer essential',
    '✅ Event correlation → Stateful stream processing (Flink, Kafka Streams)',
    '✅ 90-day retention → Time-series database with tiered storage',
    '✅ Compliance → Immutable storage with cryptographic integrity',
    '✅ Real-time detection → Low-latency rule evaluation engine',
  ],

  outOfScope: [
    'Security orchestration and automated response (SOAR)',
    'User Entity Behavior Analytics (UEBA) training',
    'Threat intelligence feed integration',
    'Incident response ticketing system',
    'Forensic data collection agents',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that collects security events and allows searching. The correlation, threat detection, and compliance features add complexity - we'll add them step by step. Functionality first, then the sophisticated SIEM capabilities!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Welcome to SecureOps Corp! You've been hired to build a SIEM system.",
  hook: "Security events are scattered across 10,000 devices. Security analysts can't find anything!",
  challenge: "Set up the foundation so security analysts can query events through your SIEM.",
  illustration: 'security-monitoring',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your SIEM platform is online!',
  achievement: 'Security analysts can now send queries to your SIEM',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting queries', after: '✓' },
  ],
  nextTeaser: "But the server can't ingest or search security events yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: SIEM Architecture',
  conceptExplanation: `Every SIEM system starts with a **Client** connecting to a **SIEM Server**.

When a security analyst investigates a threat:
1. They open the SIEM dashboard (the **Client** - web UI)
2. They search for suspicious events (e.g., "failed login from unusual IP")
3. The request goes to your **SIEM Server**
4. The server searches events and returns matching security logs

This is the foundation for all SIEM platforms - Splunk, Elastic Security, Chronicle.`,

  whyItMatters: 'Without this connection, security teams have no centralized way to investigate threats. They\'re back to SSH-ing into individual servers!',

  realWorldExample: {
    company: 'Splunk Enterprise Security',
    scenario: 'Serving Fortune 500 security operations centers',
    howTheyDoIt: 'Started with a simple search API, now processes petabytes of security events and detects millions of threats per day',
  },

  keyPoints: [
    'Client = security analyst dashboard for investigating threats',
    'SIEM Server = backend that ingests and searches security events',
    'HTTPS = encrypted protocol for sensitive security data',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Web UI for security analysts', icon: '💻' },
    { title: 'SIEM Server', explanation: 'Backend for event search and correlation', icon: '🖥️' },
    { title: 'Security Events', explanation: 'Logs from firewalls, endpoints, apps', icon: '📋' },
  ],
};

const step1: GuidedStep = {
  id: 'security-event-search-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Security analysts access the SIEM UI', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles security event queries', displayName: 'SIEM Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'SIEM Server (App Server) component added to canvas',
      'Client connected to SIEM Server',
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
  scenario: "Your SIEM is connected, but it can't ingest or search events yet!",
  hook: "An analyst tried to search for 'failed login' events and got nothing back.",
  challenge: "Write Python code to ingest security events and search through them.",
  illustration: 'code-implementation',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your SIEM can handle security events!',
  achievement: 'You implemented core event ingestion and search',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can ingest events', after: '✓' },
    { label: 'Can search events', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all security events vanish...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Event Ingestion and Search',
  conceptExplanation: `Every SIEM needs two core APIs:

1. **Event Ingestion API** - Receives security events
   - \`POST /api/v1/events\` - Accepts security events
   - Normalizes event format (different sources → common schema)
   - Stores in searchable format

2. **Event Search API** - Finds matching events
   - \`GET /api/v1/events/search?query=failed_login&source=firewall\`
   - Searches through stored events
   - Returns matching entries sorted by timestamp

**Event Normalization Example:**
Firewall log: "DENY 192.168.1.1 → 10.0.0.5:443"
Normalized: \`{event_type: "firewall_deny", src_ip: "192.168.1.1", dst_ip: "10.0.0.5", dst_port: 443}\`

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Without these APIs, you have no SIEM! Normalization is critical - raw logs from 50+ sources must be unified for correlation.',

  famousIncident: {
    title: 'Target Breach - Missed Security Alerts',
    company: 'Target',
    year: '2013',
    whatHappened: 'Target\'s SIEM detected the breach and generated alerts, but analysts missed them in the flood of 10,000+ daily alerts. The alerts were buried in noise. Attackers stole 40 million credit cards.',
    lessonLearned: 'SIEM effectiveness depends on signal-to-noise ratio. Too many alerts = ignored alerts = breaches.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'Elastic Security',
    scenario: 'Normalizing events from 300+ data sources',
    howTheyDoIt: 'Uses Elastic Common Schema (ECS) to normalize all events. Firewall logs, endpoint events, cloud logs all map to same field names for easy correlation.',
  },

  keyPoints: [
    'Ingest API receives and normalizes security events',
    'Search API finds events matching analyst queries',
    'Normalization enables correlation across different sources',
  ],

  quickCheck: {
    question: 'Why is event normalization critical for SIEM?',
    options: [
      'It makes events smaller',
      'It allows correlation across different log sources with unified field names',
      'It\'s faster than storing raw logs',
      'Compliance requires it',
    ],
    correctIndex: 1,
    explanation: 'Normalization maps different log formats to a common schema. This allows you to correlate a firewall event (src_ip) with an endpoint event (source_address) - they both become src_ip in the normalized schema.',
  },

  keyConcepts: [
    { title: 'Ingestion', explanation: 'Receiving and normalizing events', icon: '📥' },
    { title: 'Normalization', explanation: 'Converting to common schema', icon: '🔄' },
    { title: 'Search', explanation: 'Finding events by query', icon: '🔍' },
  ],
};

const step2: GuidedStep = {
  id: 'security-event-search-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Collect events, FR-2: Search events',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on SIEM Server to open inspector',
      'Assign POST /api/v1/events and GET /api/v1/events/search APIs',
      'Open the Python tab',
      'Implement ingest_event() and search_events() functions',
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
    level1: 'Click on the SIEM Server, then go to the APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for ingest_event and search_events',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/events', 'GET /api/v1/events/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistence
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "It's 2 AM. Your SIEM crashed during a security incident...",
  hook: "When it restarted, ALL SECURITY EVENTS WERE GONE! You just lost evidence of the attack.",
  challenge: "Add a database to persist events so they survive restarts and serve as legal evidence.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your security events are now persistent!',
  achievement: 'Events survive server restarts - no more evidence loss',
  metrics: [
    { label: 'Data persistence', before: '✗', after: '✓' },
    { label: 'Survives restarts', before: '✗', after: '✓' },
    { label: 'Audit compliance', before: '✗', after: '✓' },
  ],
  nextTeaser: "But searching billions of security events is slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Security Events Need Durable Storage',
  conceptExplanation: `In-memory storage is great for prototyping, but security events are **legal evidence**.

When a SIEM crashes:
- ❌ In-memory events: **GONE** forever (compliance violation!)
- ✅ Database events: **SAFE** and immutable (audit trail preserved)

The database provides:
1. **Durability** - Events written to disk survive crashes
2. **Immutability** - Events cannot be altered (audit requirement)
3. **Retention** - 90-day hot, 1-year warm, 7-year cold storage
4. **Compliance** - Cryptographic integrity proofs

For security events, we need:
- High write throughput (50K events/sec at peak)
- Time-range queries (90% of queries: "show me last 24 hours")
- Immutable append-only storage (no updates/deletes)
- Long retention with tiered storage (hot/warm/cold)`,

  whyItMatters: 'Security events are legal evidence for investigations and compliance. Losing events means failing audits and being unable to prosecute attackers.',

  famousIncident: {
    title: 'Equifax Breach - Missing Security Logs',
    company: 'Equifax',
    year: '2017',
    whatHappened: 'Equifax\'s logging system had gaps - some security events weren\'t collected or were deleted too early. During the breach investigation, critical logs were missing, making it impossible to fully understand the attack timeline.',
    lessonLearned: 'Complete, immutable, long-term log retention is non-negotiable. Missing logs = incomplete investigations.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'AWS Security Lake',
    scenario: 'Storing security events for thousands of customers',
    howTheyDoIt: 'Uses S3 for immutable, durable storage with Parquet format for efficient querying. Events are partitioned by time and cannot be modified once written.',
  },

  keyPoints: [
    'Database provides durability - events survive crashes',
    'Immutability is required for compliance and legal evidence',
    'Time-series optimized storage for long retention',
  ],

  quickCheck: {
    question: 'Why must security events be immutable?',
    options: [
      'Immutability makes searches faster',
      'Immutability ensures events cannot be tampered with for audit/legal purposes',
      'Immutability saves storage space',
      'Immutability is required by the database',
    ],
    correctIndex: 1,
    explanation: 'Security events are legal evidence. If events can be modified, they\'re not trustworthy in court or audits. Immutability (append-only, no updates) ensures events are authentic.',
  },

  keyConcepts: [
    { title: 'Durability', explanation: 'Data survives crashes and restarts', icon: '🛡️' },
    { title: 'Immutability', explanation: 'Events cannot be altered once written', icon: '🔒' },
    { title: 'Time-Series DB', explanation: 'Optimized for time-ordered security events', icon: '📈' },
  ],
};

const step3: GuidedStep = {
  id: 'security-event-search-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Persist collected security events permanently',
    taskDescription: 'Add a Database and connect it to your SIEM Server',
    componentsNeeded: [
      { type: 'database', reason: 'Stores security events permanently', displayName: 'Database' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'SIEM Server connected to Database',
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
    level2: 'Connect the SIEM Server to the Database so it can store security events permanently',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Search Index for Fast Queries
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Security analysts are complaining: searches take 60+ seconds!",
  hook: "Searching for 'failed login' across 500 million events using SQL LIKE is impossibly slow.",
  challenge: "Add Elasticsearch to enable fast full-text search and field filtering.",
  illustration: 'slow-search',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Security event searches are now lightning fast!',
  achievement: 'Full-text search enabled - queries return in seconds',
  metrics: [
    { label: 'Search time', before: '60s', after: '< 2s' },
    { label: 'Full-text search', before: '✗', after: '✓' },
    { label: 'Analyst productivity', before: '😞', after: '😃' },
  ],
  nextTeaser: "But analysts need to correlate events across sources...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Search Indexing: Fast Security Event Queries',
  conceptExplanation: `Why is SQL slow for security event search?

**SQL Database:**
- \`SELECT * FROM events WHERE message LIKE '%failed%login%'\`
- Must scan EVERY row - O(n) complexity
- For 500 million events: 60+ seconds

**Elasticsearch (Inverted Index):**
- Builds an index: "failed" → [event_1, event_5, ...], "login" → [event_1, event_99, ...]
- Search is a lookup - O(1) complexity
- For 500 million events: < 2 seconds

**How it works for SIEM:**
1. Ingest events into both Database AND Elasticsearch
2. Database = source of truth (immutable, durable)
3. Elasticsearch = search index (fast queries, field filtering)
4. Analysts query Elasticsearch for speed
5. Full event details retrieved from Database

**SIEM-specific optimizations:**
- Index by timestamp, event_type, src_ip, dst_ip, user
- Time-based indices (daily) for fast retention
- Field-level security for multi-tenancy`,

  whyItMatters: 'Without search indexing, investigating security incidents is impossible at scale. Analysts need sub-second queries to respond to active attacks.',

  famousIncident: {
    title: 'Sony Pictures Breach - Slow Investigation',
    company: 'Sony Pictures',
    year: '2014',
    whatHappened: 'Sony\'s security team struggled to investigate the breach because their log search was too slow. By the time they pieced together the attack timeline, the attackers had exfiltrated terabytes of data.',
    lessonLearned: 'Slow search = slow investigation = more damage. SIEM performance directly impacts incident response speed.',
    icon: '🎬',
  },

  realWorldExample: {
    company: 'Elastic Security',
    scenario: 'Searching petabytes of security events',
    howTheyDoIt: 'Uses Elasticsearch with optimized indices. Security analysts can search billions of events in seconds using full-text search and field filters.',
  },

  keyPoints: [
    'Inverted indexes enable fast full-text search',
    'Dual-write: Database for durability, Elasticsearch for speed',
    'Field-based filtering (src_ip, event_type) is critical for SIEM',
  ],

  quickCheck: {
    question: 'Why do we store security events in BOTH Database and Elasticsearch?',
    options: [
      'Database is the immutable source of truth',
      'Elasticsearch is optimized for fast search',
      'They serve different purposes - persistence vs search',
      'All of the above',
    ],
    correctIndex: 3,
    explanation: 'Database provides immutability and long-term retention. Elasticsearch provides fast search. Both are needed for a complete SIEM - you can\'t sacrifice either.',
  },

  keyConcepts: [
    { title: 'Inverted Index', explanation: 'Maps terms to event IDs for fast search', icon: '📇' },
    { title: 'Dual-Write', explanation: 'Write to both DB and search index', icon: '✍️' },
    { title: 'Field Filtering', explanation: 'Search by src_ip, event_type, etc.', icon: '🏷️' },
  ],
};

const step4: GuidedStep = {
  id: 'security-event-search-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast full-text search across all security events',
    taskDescription: 'Add Elasticsearch for search indexing',
    componentsNeeded: [
      { type: 'search_index', reason: 'Enables fast full-text search', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index (Elasticsearch) component added',
      'SIEM Server connected to Elasticsearch for indexing',
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
    level1: 'Add a Search Index component to enable fast full-text search',
    level2: 'Connect SIEM Server to Search Index - the server will dual-write events to both Database and Elasticsearch',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 5: Add Stream Processing for Event Correlation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔗',
  scenario: "An attack is happening RIGHT NOW, but analysts only see isolated events!",
  hook: "100 failed logins → 1 success → data download. That's a credential stuffing attack! But no alert was generated.",
  challenge: "Add stream processing to correlate related events and detect attack patterns.",
  illustration: 'correlation-engine',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your SIEM can now correlate events!',
  achievement: 'Attack patterns are detected by correlating events in real-time',
  metrics: [
    { label: 'Event correlation', before: '✗', after: '✓' },
    { label: 'Pattern detection', before: '✗', after: '✓' },
    { label: 'Attack detection rate', before: '30%', after: '85%' },
  ],
  nextTeaser: "But threat detection rules are still hard-coded...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Event Correlation: Connecting the Dots',
  conceptExplanation: `**Individual events are noise. Correlated events reveal attacks.**

**Why Correlation Matters:**
Single event: "Failed login from 1.2.3.4" → Happens 10,000 times/day (noise)
Correlated sequence:
  1. 100 failed logins from 1.2.3.4
  2. 1 successful login from 1.2.3.4
  3. API call to /download/customers
  4. Large data egress to 1.2.3.4

→ This is a credential stuffing attack! (signal)

**How Stream Processing Enables Correlation:**
1. **Stateful processing** - Remember events across time windows
2. **Windowing** - Group events by 5-minute windows
3. **Aggregation** - Count failed logins per IP
4. **Pattern matching** - Detect sequences (failed → success → download)
5. **Enrichment** - Add threat intel (is IP known attacker?)

**Technologies:**
- Apache Flink, Kafka Streams for stateful processing
- Complex Event Processing (CEP) for pattern matching
- In-memory state for fast lookups

**Correlation Keys:**
- By user: All events for user "john@example.com"
- By IP: All events from source IP "1.2.3.4"
- By time: Events within 5-minute window
- By session: Events in same auth session`,

  whyItMatters: 'Correlation is what makes SIEM intelligent. Without it, you\'re just storing logs. With it, you\'re detecting sophisticated attacks.',

  famousIncident: {
    title: 'SolarWinds Supply Chain Attack',
    company: 'Multiple US Government Agencies',
    year: '2020',
    whatHappened: 'The attackers used legitimate credentials and moved slowly to avoid detection. Individual events looked normal. Only by correlating events over weeks (unusual access patterns, data exfiltration, lateral movement) could the attack be detected.',
    lessonLearned: 'Advanced attacks hide in legitimate-looking events. Correlation over time windows is essential to detect slow, sophisticated attacks.',
    icon: '☀️',
  },

  realWorldExample: {
    company: 'Microsoft Sentinel',
    scenario: 'Correlating events across cloud and on-prem',
    howTheyDoIt: 'Uses Azure Stream Analytics for real-time correlation. Analysts write correlation rules in KQL (Kusto Query Language) that detect attack patterns across multiple event sources.',
  },

  keyPoints: [
    'Correlation connects related events by user, IP, time, session',
    'Stream processing maintains state for windowed aggregations',
    'Pattern matching detects attack sequences (failed → success → exfil)',
  ],

  quickCheck: {
    question: 'Why is stateful stream processing required for event correlation?',
    options: [
      'It makes searches faster',
      'It remembers past events to detect patterns across time windows',
      'It stores events permanently',
      'It\'s required for compliance',
    ],
    correctIndex: 1,
    explanation: 'Stateful processing keeps recent events in memory (e.g., last 5 minutes of failed logins). This allows detecting patterns like "100 failed logins followed by 1 success" - you need to remember the failures to correlate with the success.',
  },

  keyConcepts: [
    { title: 'Correlation', explanation: 'Connecting related events', icon: '🔗' },
    { title: 'Stream Processing', explanation: 'Real-time stateful event analysis', icon: '🌊' },
    { title: 'Windowing', explanation: 'Grouping events by time windows', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'security-event-search-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Correlate events to detect attack patterns',
    taskDescription: 'Add Stream Processor for real-time event correlation',
    componentsNeeded: [
      { type: 'stream_processor', reason: 'Correlates events in real-time', displayName: 'Stream Processor' },
    ],
    successCriteria: [
      'Stream Processor component added',
      'SIEM Server sends events to Stream Processor',
      'Stream Processor correlates events by user, IP, time',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'stream_processor'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'stream_processor' },
    ],
  },

  hints: {
    level1: 'Add a Stream Processor to correlate events in real-time',
    level2: 'Connect SIEM Server to Stream Processor - events will be analyzed for correlation patterns',
    solutionComponents: [{ type: 'stream_processor' }],
    solutionConnections: [{ from: 'app_server', to: 'stream_processor' }],
  },
};

// =============================================================================
// STEP 6: Add Cache for Threat Intelligence and Rules
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚡',
  scenario: "Threat detection rules are evaluated for EVERY event, but they're loaded from database!",
  hook: "Latency spiked to 500ms because each event queries the DB for threat intel and rules. Too slow!",
  challenge: "Add a cache for threat intelligence and detection rules to speed up evaluation.",
  illustration: 'performance-optimization',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Threat detection is now blazing fast!',
  achievement: 'Cached threat intel and rules - rule evaluation in <10ms',
  metrics: [
    { label: 'Rule eval latency', before: '500ms', after: '< 10ms' },
    { label: 'Threat intel lookups', before: 'DB query', after: 'Cache hit' },
    { label: 'Detection throughput', before: '100 events/sec', after: '10,000 events/sec' },
  ],
  nextTeaser: "Your SIEM works great! Now let's add compliance reporting...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Accelerating Threat Detection',
  conceptExplanation: `**The Performance Problem:**

For EVERY security event (50K/sec at peak), we need:
1. Check if IP is in threat intel blacklist (50M known bad IPs)
2. Load 500+ detection rules
3. Check user's historical behavior

Without caching:
- Each event = 3 database queries
- 50K events/sec × 3 queries = 150K DB queries/sec
- DB can't handle it → latency spikes → alerts delayed

**With Caching:**
- Threat intel blacklist → Redis (in-memory)
- Detection rules → Redis (hot reload every 60 seconds)
- User behavior profiles → Redis (TTL 5 minutes)

Result:
- Event processing: 500ms → 10ms (50x faster!)
- DB load: 150K queries/sec → 0 queries/sec
- Threat intel lookup: O(1) instead of O(log n)

**Cache Strategy:**
1. **Threat intel** - Cache for 1 hour, refresh in background
2. **Detection rules** - Cache indefinitely, invalidate on update
3. **User profiles** - Cache for 5 minutes (TTL)
4. **IP reputation** - Cache for 24 hours

**Cache Invalidation:**
- New threat intel → Background refresh
- Rule update → Immediate cache invalidation
- User profile → TTL expiration`,

  whyItMatters: 'SIEM must evaluate hundreds of rules against thousands of events per second. Database lookups are too slow - caching is the only way to achieve <10ms rule evaluation.',

  realWorldExample: {
    company: 'Crowdstrike Falcon',
    scenario: 'Real-time threat detection on millions of endpoints',
    howTheyDoIt: 'Uses in-memory threat intelligence and behavioral rules. Rules are cached on endpoints and cloud infrastructure. Updates pushed in real-time via streaming.',
  },

  keyPoints: [
    'Cache threat intelligence for fast IP/domain reputation checks',
    'Cache detection rules to avoid database lookups on every event',
    'Use TTL and background refresh to keep cache fresh',
  ],

  quickCheck: {
    question: 'Why cache detection rules instead of querying the database?',
    options: [
      'Rules change frequently',
      'Database queries are too slow when evaluating 50K events/sec',
      'Caches are more reliable than databases',
      'Compliance requires caching',
    ],
    correctIndex: 1,
    explanation: 'At 50K events/sec, database queries add too much latency. Caching rules in memory (Redis) allows O(1) lookups. Rules are loaded once, cached, and invalidated only when updated.',
  },

  keyConcepts: [
    { title: 'Threat Intel Cache', explanation: 'Known bad IPs/domains in memory', icon: '🗂️' },
    { title: 'Rule Cache', explanation: 'Detection rules cached for fast eval', icon: '📋' },
    { title: 'Cache Invalidation', explanation: 'Refresh when data changes', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'security-event-search-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Fast threat detection with cached rules and threat intel',
    taskDescription: 'Add Cache for threat intelligence and detection rules',
    componentsNeeded: [
      { type: 'cache', reason: 'Caches threat intel and detection rules', displayName: 'Cache (Redis)' },
    ],
    successCriteria: [
      'Cache component added',
      'Stream Processor reads from Cache for rule evaluation',
      'SIEM Server updates Cache with new rules/threat intel',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'stream_processor', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'stream_processor' },
      { fromType: 'stream_processor', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Cache component for fast rule and threat intel lookups',
    level2: 'Connect Stream Processor to Cache - rules and threat intel will be cached in Redis for fast evaluation',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'stream_processor', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const securityEventSearchGuidedTutorial: GuidedTutorial = {
  problemId: 'security-event-search',
  title: 'Design Security Event Search (SIEM)',
  description: 'Build a SIEM system for security event collection, search, correlation, and threat detection',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🛡️',
    hook: "You've been hired as Lead Security Engineer at SecureOps Corp!",
    scenario: "Your mission: Build a SIEM system that helps security analysts detect and investigate threats across 10,000 devices generating 500 million security events per day.",
    challenge: "Can you design a system that ingests 50K events/sec, enables sub-second search, and correlates events to detect sophisticated attacks?",
  },

  requirementsPhase: securityEventSearchRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'SIEM Architecture',
    'Security Event Normalization',
    'Full-Text Security Search',
    'Event Correlation',
    'Threat Detection',
    'Stream Processing',
    'Stateful Event Processing',
    'Threat Intelligence',
    'Detection Rules Engine',
    'Compliance Reporting',
    'Immutable Event Storage',
    'Time-Series Security Data',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 11: Stream Processing',
    'Chapter 12: The Future of Data Systems',
  ],
};

export default securityEventSearchGuidedTutorial;
