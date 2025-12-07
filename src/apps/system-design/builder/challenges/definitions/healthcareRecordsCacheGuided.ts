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
 * Healthcare Records Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a HIPAA-compliant healthcare records caching system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Apply NFRs (encryption, audit logging, compliance, replication)
 *
 * Key Concepts:
 * - HIPAA compliance and PHI protection
 * - Encryption at rest and in transit
 * - Comprehensive audit logging
 * - Access control and authentication
 * - Cache invalidation for medical records
 * - Data retention and purging policies
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const healthcareRecordsCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a caching system for healthcare records that complies with HIPAA regulations",

  interviewer: {
    name: 'Dr. Sarah Mitchell',
    role: 'Chief Technology Officer at HealthTech Systems',
    avatar: '👩‍⚕️',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    {
      id: 'core-functionality',
      category: 'functional',
      question: "What's the main purpose of this caching system? What do healthcare providers need to do?",
      answer: "Healthcare providers need to:\n\n1. **Retrieve patient records fast** - Doctors need instant access to medical history, medications, allergies\n2. **Cache frequently accessed records** - ER patients, chronic care patients are accessed repeatedly\n3. **Update records** - When new diagnoses or prescriptions are added, cache must reflect changes\n4. **Search patient data** - Look up by patient ID, medical record number, or demographics",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Healthcare caching is about speed AND accuracy - stale medical data can be life-threatening",
    },
    {
      id: 'data-types',
      category: 'functional',
      question: "What types of healthcare data will we cache?",
      answer: "We'll cache:\n- **Patient demographics** (name, DOB, contact info)\n- **Medical history** (diagnoses, procedures, allergies)\n- **Medications** (current prescriptions, dosages)\n- **Lab results** (blood tests, imaging reports)\n- **Visit records** (doctor notes, treatment plans)\n\nAll of this is Protected Health Information (PHI) under HIPAA!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "PHI has strict regulatory requirements - we must protect it with encryption and access controls",
    },
    {
      id: 'cache-invalidation',
      category: 'functional',
      question: "What happens when a patient's record is updated in the main database?",
      answer: "The cache MUST be updated immediately! We can't have doctors seeing outdated medication lists or missing critical allergies. We need:\n1. **Write-through caching** for updates\n2. **Cache invalidation** when records change\n3. **TTL of 15 minutes** for safety (auto-refresh even if update missed)",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "In healthcare, stale data can kill. Cache consistency is not optional.",
    },
    {
      id: 'access-patterns',
      category: 'clarification',
      question: "Which records get accessed most frequently?",
      answer: "The 80/20 rule applies here:\n- **ER patients**: Accessed 50+ times during a visit\n- **ICU patients**: Continuous monitoring, hundreds of reads/hour\n- **Chronic care patients**: Frequent follow-ups, weekly access\n- **Routine appointments**: Accessed 2-3 times then cold\n\nAbout 20% of patients generate 80% of cache hits.",
      importance: 'important',
      insight: "Use LRU eviction to keep hot records in cache and drop cold ones",
    },
    {
      id: 'hipaa-requirements',
      category: 'security',
      question: "What are the HIPAA compliance requirements for this system?",
      answer: "HIPAA mandates:\n1. **Encryption at rest** - All PHI must be encrypted when stored\n2. **Encryption in transit** - TLS 1.2+ for all network communication\n3. **Access controls** - Role-based access (doctors, nurses, admin)\n4. **Audit logging** - Log every access to PHI (who, when, what, why)\n5. **Data retention** - Keep audit logs for 6 years\n6. **Automatic logout** - Sessions expire after 15 minutes of inactivity",
      importance: 'critical',
      revealsRequirement: 'NFR-S1, NFR-S2',
      learningPoint: "HIPAA violations result in $50,000 fines per violation and potential criminal charges",
    },
    {
      id: 'audit-logging',
      category: 'security',
      question: "What exactly should we log for audit purposes?",
      answer: "Every access to PHI must be logged:\n- **Who**: User ID, role, IP address\n- **What**: Patient ID, record type (demographics, meds, labs)\n- **When**: Timestamp (precise to the millisecond)\n- **Why**: Purpose (treatment, research, billing)\n- **Result**: Success or failure\n- **Changes**: What was modified (before/after values)\n\nLogs must be immutable and tamper-proof!",
      importance: 'critical',
      revealsRequirement: 'NFR-S3',
      learningPoint: "Audit logs are your legal protection in case of breach investigations",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many patient record lookups per day?",
      answer: "A medium hospital with 500 beds:\n- 2,000 ER visits per day\n- 500 ICU patients (continuous monitoring)\n- 5,000 outpatient appointments\n\nEach encounter = 10-20 record lookups. Total: ~100,000 reads/day",
      importance: 'critical',
      calculation: {
        formula: "100,000 reads ÷ 86,400 sec = 1.16 reads/sec average",
        result: "~2-3 reads/sec average, ~20 reads/sec peak (during shift changes)",
      },
      learningPoint: "Healthcare has predictable peaks: morning rounds, shift changes, ER rush hours",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many record updates per day?",
      answer: "Every patient encounter creates updates:\n- ER: New vitals every 15 min\n- ICU: Continuous monitoring data\n- Appointments: Doctor notes, new prescriptions\n\nAbout 20,000 updates/day",
      importance: 'critical',
      calculation: {
        formula: "20,000 writes ÷ 86,400 sec = 0.23 writes/sec",
        result: "~1 write/sec average, ~5 writes/sec peak",
      },
      learningPoint: "Healthcare is read-heavy but writes must be ACID-compliant",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "How fast must record retrieval be?",
      answer: "In emergency situations, every second counts:\n- **Critical records** (allergies, current meds): p99 < 50ms\n- **General records** (history, labs): p99 < 200ms\n- **Search queries**: p99 < 500ms\n\nDoctors won't wait - slow systems get bypassed!",
      importance: 'critical',
      learningPoint: "Cache hit = 10ms, DB query = 100ms+. Cache is essential for latency SLA.",
    },
    {
      id: 'data-consistency',
      category: 'consistency',
      question: "Can we tolerate eventual consistency for cached records?",
      answer: "NO! Healthcare requires **strong consistency** for critical data:\n- Allergy updates must be visible immediately\n- Medication changes can't lag\n- Lab results must be current\n\nUse write-through cache with synchronous invalidation. Eventual consistency could be deadly.",
      importance: 'critical',
      learningPoint: "Unlike social media, healthcare can't tolerate stale data - lives are at stake",
    },
    {
      id: 'disaster-recovery',
      category: 'reliability',
      question: "What happens if the cache fails? Can we fall back to the database?",
      answer: "Yes, cache-aside pattern:\n1. Check cache first\n2. On miss or cache failure: query database directly\n3. Update cache with result\n\nThe database is the source of truth. Cache is for performance, not reliability.",
      importance: 'critical',
      insight: "Cache failure degrades performance but doesn't break functionality",
    },
    {
      id: 'data-retention',
      category: 'compliance',
      question: "How long should we keep cached data and audit logs?",
      answer: "Cached records:\n- **Active patients**: Keep in cache with 15-min TTL\n- **Discharged patients**: Evict from cache after 24 hours\n\nAudit logs:\n- **Must keep for 6 years** (HIPAA requirement)\n- Store in append-only archive (S3, Glacier)\n- Enable encryption and access controls",
      importance: 'critical',
      learningPoint: "HIPAA compliance requires long-term audit retention but short-term cache TTL",
    },
    {
      id: 'encryption-requirements',
      category: 'security',
      question: "What encryption standards should we use?",
      answer: "HIPAA mandates:\n- **At rest**: AES-256 encryption for all cached PHI\n- **In transit**: TLS 1.3 with certificate pinning\n- **Key management**: Rotate encryption keys every 90 days\n- **Separation**: Separate encryption keys per tenant/hospital\n\nUse managed services like AWS KMS for key management.",
      importance: 'critical',
      learningPoint: "Encryption is mandatory, not optional - use proven standards, not custom crypto",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'hipaa-requirements', 'audit-logging'],
  criticalFRQuestionIds: ['core-functionality', 'data-types', 'cache-invalidation'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-requirements', 'data-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Retrieve patient records',
      description: 'Fast lookups of patient demographics, medical history, medications, and lab results',
      emoji: '📋',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Cache frequently accessed records',
      description: 'Cache hot records (ER, ICU patients) for sub-50ms retrieval',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Update cached records',
      description: 'Invalidate cache when records are updated to ensure consistency',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5,000 healthcare providers',
    writesPerDay: '20,000 record updates',
    readsPerDay: '100,000 record lookups',
    peakMultiplier: 10,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 0.23, peak: 5 },
    calculatedReadRPS: { average: 1.16, peak: 20 },
    maxPayloadSize: '~50KB (complete patient record)',
    storagePerRecord: '~100KB (with history)',
    storageGrowthPerYear: '~2TB',
    redirectLatencySLA: 'p99 < 50ms (critical records)',
    createLatencySLA: 'p99 < 200ms (general records)',
  },

  architecturalImplications: [
    '✅ HIPAA compliance → Encryption at rest (AES-256) and in transit (TLS 1.3)',
    '✅ Audit requirements → Comprehensive logging of all PHI access',
    '✅ Strong consistency → Write-through cache with immediate invalidation',
    '✅ Read-heavy workload → Redis cache with LRU eviction',
    '✅ Regulatory retention → 6-year audit log storage (S3/Glacier)',
    '✅ Multi-tenancy → Separate encryption keys per hospital',
  ],

  outOfScope: [
    'Medical image caching (DICOM)',
    'Real-time vitals monitoring',
    'HL7/FHIR integration',
    'Telemedicine video streaming',
    'Prescription routing to pharmacies',
    'Insurance claim processing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple cache that retrieves and updates patient records. Then we'll layer on HIPAA compliance: encryption, audit logging, and access controls. Functionality first, then security hardening!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏥',
  scenario: "Welcome to HealthTech Systems! You've been hired to build a caching layer for electronic health records (EHR).",
  hook: "A doctor just logged in and needs to access a patient's medical history. The request needs to reach your server!",
  challenge: "Set up the basic connection so healthcare providers can query patient records.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your healthcare cache is online!',
  achievement: 'Providers can now send record requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to retrieve records yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Healthcare Cache Architecture',
  conceptExplanation: `Every healthcare system starts with **Clients** (doctor workstations, mobile apps) connecting to a **Server**.

When a doctor needs a patient record:
1. Their EHR application (web/mobile) is the **Client**
2. It sends HTTPS requests to your **Cache Server**
3. The server retrieves the record from cache or database
4. Returns the data securely to the provider

This is the foundation of fast, secure healthcare data access!`,

  whyItMatters: 'Without this connection, doctors can\'t access patient records - which means they can\'t provide care.',

  realWorldExample: {
    company: 'Epic Systems',
    scenario: 'Serving 250+ million patient records',
    howTheyDoIt: 'Multi-tier caching architecture with in-memory caches for hot records and database fallback',
  },

  keyPoints: [
    'Client = EHR workstation, mobile app, or API consumer',
    'App Server = your backend that orchestrates cache and database',
    'HTTPS only = PHI must be encrypted in transit (HIPAA requirement)',
    'Authentication required = every request must identify the user',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Healthcare provider application requesting patient data', icon: '🖥️' },
    { title: 'App Server', explanation: 'Orchestrates cache lookups and database queries', icon: '⚙️' },
    { title: 'PHI', explanation: 'Protected Health Information - must be encrypted and audited', icon: '🔒' },
  ],
};

const step1: GuidedStep = {
  id: 'healthcare-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents EHR applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles record retrieval logic', displayName: 'App Server' },
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
// STEP 2: Implement Record Retrieval APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to retrieve patient records!",
  hook: "A doctor searched for patient MRN-12345 but got a 404 error. The API endpoints don't exist yet!",
  challenge: "Write the Python code to handle patient record lookups, updates, and searches.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your record APIs are live!',
  achievement: 'You implemented the core healthcare record retrieval functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can retrieve records', after: '✓' },
    { label: 'Can update records', after: '✓' },
    { label: 'Can search patients', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, how do we get the records back?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Healthcare API Implementation: Critical Record Handlers',
  conceptExplanation: `Every healthcare cache needs **handler functions** that retrieve and update patient records.

For our system, we need handlers for:
- \`get_patient_record()\` - Retrieve complete patient record by ID
- \`update_patient_record()\` - Update demographics, medications, or diagnoses
- \`search_patients()\` - Find patients by name, MRN, or DOB

**Critical requirements:**
1. **Validate access** - Check if user has permission to view this patient
2. **Check cache first** - Fast path for hot records
3. **Log all access** - HIPAA requires audit trail of every PHI access
4. **Handle cache misses** - Fall back to database if not cached

For now, we'll store everything in memory (Python dictionaries).`,

  whyItMatters: 'Healthcare APIs must be bulletproof and HIPAA-compliant. A data leak means massive fines and legal consequences!',

  famousIncident: {
    title: 'Anthem Health Data Breach',
    company: 'Anthem',
    year: '2015',
    whatHappened: 'Hackers stole 78.8 million patient records due to lack of encryption and poor access controls. Anthem paid $115 million in settlements and suffered massive reputation damage.',
    lessonLearned: 'Encryption, authentication, and audit logging are non-negotiable for healthcare systems.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'EPIC EHR',
    scenario: 'Serving millions of patient lookups per day',
    howTheyDoIt: 'Multi-tier caching with Redis for hot records, database for cold records, comprehensive audit logging for every access',
  },

  keyPoints: [
    'Each API needs authentication and authorization checks',
    'Log every access to PHI (patient ID, user, timestamp)',
    'Use in-memory storage for now (cache and database come next)',
    'Always validate input - prevent SQL injection and data leaks',
  ],

  quickCheck: {
    question: 'Why must we log every access to patient records?',
    options: [
      'It makes the system faster',
      'HIPAA requires audit trails for all PHI access',
      'It reduces server load',
      'It\'s optional but recommended',
    ],
    correctIndex: 1,
    explanation: 'HIPAA mandates comprehensive audit logging of all PHI access. Logs must be kept for 6 years and are your legal protection in breach investigations.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes a healthcare API request', icon: '⚙️' },
    { title: 'Audit Log', explanation: 'Immutable record of who accessed what data and when', icon: '📝' },
    { title: 'Cache-Aside', explanation: 'Check cache first, fall back to DB on miss', icon: '📦' },
  ],
};

const step2: GuidedStep = {
  id: 'healthcare-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Retrieve records, FR-2: Cache lookups, FR-3: Update records',
    taskDescription: 'Configure APIs and implement Python handlers for record retrieval',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/patients/:id, PUT /api/v1/patients/:id, GET /api/v1/patients/search APIs',
      'Open the Python tab',
      'Implement get_patient_record(), update_patient_record(), and search_patients() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign healthcare endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for get_patient_record, update_patient_record, and search_patients',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/patients/:id', 'PUT /api/v1/patients/:id', 'GET /api/v1/patients/search'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Persistent Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed during a shift change...",
  hook: "When it restarted, ALL patient records were GONE! Doctors can't access medical histories. The ER is in chaos. This is a life-threatening failure!",
  challenge: "Add a database so patient records persist forever - crashes can't erase medical data.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your patient records are safe!',
  achievement: 'Medical data now persists with ACID guarantees',
  metrics: [
    { label: 'Data persistence', before: '❌ Lost on crash', after: '✓ Durable forever' },
    { label: 'Storage', after: 'PostgreSQL Database' },
    { label: 'ACID compliance', after: '✓' },
  ],
  nextTeaser: "But every lookup hits the database - it's slow and expensive...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Why Databases Are Critical for Healthcare',
  conceptExplanation: `For healthcare systems, losing data is **catastrophic, illegal, and potentially deadly**.

A **database** provides:
- **Durability**: Patient records survive crashes and power outages
- **ACID guarantees**: Atomicity, Consistency, Isolation, Durability
- **Audit trail**: Immutable history for compliance and legal protection
- **Structured queries**: Efficient lookups by patient ID, MRN, name, DOB
- **Relational integrity**: Link patients to diagnoses, medications, lab results

For healthcare, we need tables for:
- \`patients\` - Demographics, contact info, insurance
- \`medical_history\` - Diagnoses, procedures, allergies
- \`medications\` - Prescriptions, dosages, start/end dates
- \`lab_results\` - Blood tests, imaging, pathology
- \`access_logs\` - HIPAA audit trail of all PHI access`,

  whyItMatters: 'Losing medical data means:\n1. Doctors can\'t diagnose or treat patients\n2. Legal liability for malpractice\n3. HIPAA violations ($50,000+ per violation)\n4. Loss of hospital accreditation\n5. Potential patient deaths',

  famousIncident: {
    title: 'UK Hospital Ransomware Attack',
    company: 'NHS (UK Healthcare)',
    year: '2017',
    whatHappened: 'WannaCry ransomware encrypted hospital databases. Surgeries were cancelled. Ambulances were diverted. Patients couldn\'t be treated. The NHS paid millions in ransoms and recovery costs.',
    lessonLearned: 'Database backups, encryption, and disaster recovery are life-or-death requirements for healthcare systems.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Mayo Clinic',
    scenario: 'Storing 70+ years of patient records',
    howTheyDoIt: 'Oracle and PostgreSQL with heavy replication, point-in-time recovery, encrypted backups, and 99.999% uptime SLA',
  },

  keyPoints: [
    'Healthcare databases must be ACID-compliant (PostgreSQL, MySQL)',
    'NoSQL is risky for medical records - strong consistency required',
    'Database is the source of truth - cache is for speed',
    'HIPAA requires encrypted backups and disaster recovery',
  ],

  diagram: `
┌──────────┐       ┌─────────────┐       ┌────────────────┐
│  Client  │ ────▶ │ App Server  │ ────▶ │   Database     │
└──────────┘       └─────────────┘       │                │
                                          │  patients      │
                                          │  medical_hist  │
                                          │  medications   │
                                          │  lab_results   │
                                          │  access_logs   │
                                          └────────────────┘
`,

  keyConcepts: [
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability - mandatory for healthcare', icon: '⚛️' },
    { title: 'Persistence', explanation: 'Data survives crashes, power loss, hardware failure', icon: '💾' },
    { title: 'Audit Trail', explanation: 'Immutable logs of all database changes', icon: '📜' },
  ],

  quickCheck: {
    question: 'Why did we lose all patient records when the server crashed?',
    options: [
      'The database was deleted',
      'Data was only in RAM (memory), which is volatile',
      'Network connection failed',
      'Cache expired',
    ],
    correctIndex: 1,
    explanation: 'RAM loses all data when power is lost. Databases persist to disk for durability. For healthcare, this is literally life-or-death.',
  },
};

const step3: GuidedStep = {
  id: 'healthcare-cache-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'Patient records must persist durably',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents EHR applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes record requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores patient records persistently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Providers send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes patient data' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
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
    level1: 'Build the full path: Client → App Server → Database',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Fast Record Retrieval
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐢',
  scenario: "Your system works, but doctors are complaining about slowness...",
  hook: '"Why does it take 300ms to load a patient record? The old system was instant!" Every database query is expensive. ER patients are accessed 50+ times per visit!',
  challenge: "Add a cache layer to serve frequently accessed records in milliseconds instead of hundreds of milliseconds.",
  illustration: 'slow-turtle',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Record retrieval is now lightning fast!',
  achievement: 'Hot records served from cache in < 10ms',
  metrics: [
    { label: 'Retrieval latency', before: '300ms', after: '10ms' },
    { label: 'Database load', before: '100 queries/sec', after: '20 queries/sec' },
    { label: 'Cache hit rate', after: '80%' },
  ],
  nextTeaser: "Fast! But we're transmitting patient data unencrypted...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: The Secret to Sub-50ms Healthcare Lookups',
  conceptExplanation: `**Key insight**: Healthcare is read-heavy. For every record update, there are 5-10 reads.

**The math**:
- Database query: 50-300ms
- Cache lookup: 1-10ms
- That's **10-30x faster!**

**How caching works for healthcare**:
1. Doctor requests patient MRN-12345
2. Check cache: Is this record in Redis?
3. **Cache HIT**: Return immediately (10ms) ✓
4. **Cache MISS**: Query database, store in cache, return (200ms)

**LRU eviction**: Keep ER/ICU patients hot, evict discharged patients.

**Critical for healthcare**:
- ER patients: Accessed 50+ times → cache hit 49 times
- Routine patients: Accessed 2-3 times → maybe 1 cache hit
- Cache TTL: 15 minutes (safety valve for stale data)`,

  whyItMatters: 'Without caching, every record lookup queries the database. At scale, the database becomes the bottleneck and response times degrade.',

  realWorldExample: {
    company: 'Cerner (Oracle Health)',
    scenario: 'Handling millions of patient lookups per day',
    howTheyDoIt: 'Redis clusters cache hot patient records. ER patients stay in cache for hours, routine patients for minutes.',
  },

  famousIncident: {
    title: 'Epic EHR Slowdown at Stanford',
    company: 'Stanford Health',
    year: '2019',
    whatHappened: 'Epic\'s cache layer failed during a peak load event. Database was overwhelmed. Doctors waited 20+ seconds for patient records. Surgeries were delayed. The hospital filed a lawsuit.',
    lessonLearned: 'Caching isn\'t optional at scale - it\'s infrastructure. Plan for cache failures with fallback strategies.',
    icon: '🏥',
  },

  keyPoints: [
    'Cache-aside pattern: Check cache first, then database',
    'Set TTL to 15 minutes for safety (prevent stale medical data)',
    '80%+ cache hit ratio is achievable for ER/ICU patients',
    'Cache encryption is REQUIRED for PHI (HIPAA)',
  ],

  diagram: `
                          ┌─────────────┐
                   ┌────▶ │    Cache    │ ← 10ms
                   │      │   (Redis)   │
┌────────┐    ┌────┴─────┐└─────────────┘
│ Client │───▶│App Server│      │ miss?
└────────┘    └────┬─────┘      ▼
                   └────▶ ┌─────────────┐
                          │  Database   │ ← 200ms
                          └─────────────┘
`,

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, DB on miss, update cache', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live: cached data expires after 15 min', icon: '⏰' },
    { title: 'LRU', explanation: 'Least Recently Used: evict cold records to save memory', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why is caching critical for ER patient records?',
    options: [
      'It saves database storage space',
      'ER patients are accessed 50+ times - cache hit 49 times for 10-30x speedup',
      'It makes the system cheaper',
      'HIPAA requires it',
    ],
    correctIndex: 1,
    explanation: 'ER patients are accessed repeatedly during a visit. Cache hit = 10ms vs DB query = 200ms. That\'s 10-30x faster!',
  },
};

const step4: GuidedStep = {
  id: 'healthcare-cache-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'Record retrieval must be < 50ms for critical data',
    taskDescription: 'Build Client → App Server → Database + Cache',
    componentsNeeded: [
      { type: 'client', reason: 'Represents EHR applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes record requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores patient records', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot records for fast lookups', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Providers send requests' },
      { from: 'App Server', to: 'Database', reason: 'Server reads/writes patient data' },
      { from: 'App Server', to: 'Cache', reason: 'Server checks cache before database' },
    ],
    successCriteria: ['Build full architecture with Cache', 'Connect App Server to both Database and Cache'],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Build the full system with a Cache for fast lookups',
    level2: 'Add Client, App Server, Database, and Cache - connect App Server to both storage components',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Encryption at Rest (HIPAA Compliance)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🚨',
  scenario: "URGENT: The compliance team just flagged your system!",
  hook: '"You\'re storing PHI in plain text?! That\'s a HIPAA violation! Fines start at $50,000 per record. We have 100,000 records. Do the math!"',
  challenge: "Add encryption at rest for all cached patient data. Use AES-256 with managed key rotation.",
  illustration: 'security-breach',
};

const step5Celebration: CelebrationContent = {
  emoji: '🔐',
  message: 'Your cache is now HIPAA-compliant!',
  achievement: 'All PHI encrypted at rest with AES-256',
  metrics: [
    { label: 'Encryption', before: '❌ Plain text', after: '✓ AES-256' },
    { label: 'Key rotation', after: 'Every 90 days' },
    { label: 'HIPAA compliance', after: '✓ Encrypted at rest' },
  ],
  nextTeaser: "Encrypted! But who accessed what data? We need audit logs...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Encryption at Rest: HIPAA Requirement for PHI Protection',
  conceptExplanation: `**HIPAA mandates encryption at rest for all Protected Health Information (PHI).**

**Why encryption at rest?**
If someone gains physical access to your cache server or steals a hard drive, they should NOT be able to read patient data.

**Implementation**:
1. **AES-256 encryption** - Industry standard, NIST-approved
2. **Managed key service** - AWS KMS, Azure Key Vault, HashiCorp Vault
3. **Key rotation** - Rotate encryption keys every 90 days
4. **Separate keys per tenant** - Multi-hospital deployments need isolation

**For Redis cache**:
- Enable Redis encryption at rest (RDB snapshots)
- Use TLS for in-transit encryption
- Store keys in KMS, not in code

**Performance impact**: Minimal (< 5% overhead) with hardware acceleration (AES-NI)`,

  whyItMatters: 'HIPAA violations:\n- $50,000 fine per unencrypted record\n- Criminal charges for willful neglect\n- Loss of hospital accreditation\n- Lawsuits from patients\n- Reputation damage',

  famousIncident: {
    title: 'Premera Blue Cross Breach',
    company: 'Premera Blue Cross',
    year: '2015',
    whatHappened: 'Hackers accessed 11 million patient records stored unencrypted. Medical histories, SSNs, bank accounts - all in plain text. Premera paid $74 million in fines and settlements.',
    lessonLearned: 'Encryption at rest is mandatory, not optional. No excuses. The law is clear.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Kaiser Permanente',
    scenario: 'Protecting 12+ million patient records',
    howTheyDoIt: 'AES-256 encryption at rest for all databases and caches, AWS KMS for key management, automated key rotation every 90 days',
  },

  keyPoints: [
    'AES-256 is the gold standard for healthcare data encryption',
    'NEVER store encryption keys in code - use KMS',
    'Rotate keys every 90 days (HIPAA best practice)',
    'Performance overhead is minimal (< 5% with hardware acceleration)',
    'Encryption at rest + in transit = defense in depth',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│            ENCRYPTION AT REST                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐          ┌─────────────┐          │
│  │ Patient     │          │ Encryption  │          │
│  │ Record      │ ───────▶ │ AES-256     │          │
│  │ (Plain)     │          │ Key: KMS    │          │
│  └─────────────┘          └──────┬──────┘          │
│                                  │                  │
│                                  ▼                  │
│                           ┌─────────────┐           │
│                           │ Redis Cache │           │
│                           │ (Encrypted) │           │
│                           │             │           │
│                           │ [\x9f\x2a...│           │
│                           │  \x7b\x4c...]│           │
│                           └─────────────┘           │
│                                                     │
│  Attacker steals disk → Can't read encrypted data  │
└─────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'AES-256', explanation: 'Advanced Encryption Standard with 256-bit keys', icon: '🔐' },
    { title: 'KMS', explanation: 'Key Management Service - secure key storage and rotation', icon: '🔑' },
    { title: 'At Rest', explanation: 'Data stored on disk (vs. in transit over network)', icon: '💾' },
    { title: 'Defense in Depth', explanation: 'Multiple layers of security (encryption + access control + logging)', icon: '🛡️' },
  ],

  quickCheck: {
    question: 'Why must we encrypt patient records at rest?',
    options: [
      'It makes the cache faster',
      'HIPAA requires encryption of all PHI - fines start at $50,000/record',
      'It reduces storage costs',
      'It\'s optional but recommended',
    ],
    correctIndex: 1,
    explanation: 'HIPAA mandates encryption at rest for PHI. Violations result in massive fines, criminal charges, and reputation damage.',
  },
};

const step5: GuidedStep = {
  id: 'healthcare-cache-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'PHI must be encrypted at rest (HIPAA requirement)',
    taskDescription: 'Configure cache encryption with AES-256',
    componentsNeeded: [
      { type: 'client', reason: 'Represents EHR applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes record requests', displayName: 'App Server' },
      { type: 'database', reason: 'Stores patient records', displayName: 'Database' },
      { type: 'cache', reason: 'Configure encryption at rest', displayName: 'Cache (Redis)' },
    ],
    successCriteria: [
      'Build full architecture',
      'Click Cache → Enable encryption at rest (AES-256)',
      'Configure key rotation (90 days)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheEncryption: true,
  },

  hints: {
    level1: 'Build full system and enable cache encryption',
    level2: 'Add all components, connect them, then click Cache → Security → Enable encryption at rest with AES-256',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Audit Logging (HIPAA Compliance)
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📝',
  scenario: "The compliance officer is back with another requirement...",
  hook: '"We need to know WHO accessed WHAT patient data and WHEN. HIPAA requires comprehensive audit logs for all PHI access. And we need to keep them for 6 years!"',
  challenge: "Add audit logging to track every access to patient records. Log to a separate audit database for tamper-proof records.",
  illustration: 'audit-trail',
};

const step6Celebration: CelebrationContent = {
  emoji: '📋',
  message: 'Your audit logging is complete!',
  achievement: 'All PHI access is now logged and immutable',
  metrics: [
    { label: 'Audit logging', before: '❌ None', after: '✓ Comprehensive' },
    { label: 'Log retention', after: '6 years (HIPAA)' },
    { label: 'Tamper-proof', after: '✓ Immutable logs' },
  ],
  nextTeaser: "Logged! But what if the database crashes? We need redundancy...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Audit Logging: HIPAA Requirement for PHI Access Tracking',
  conceptExplanation: `**HIPAA mandates comprehensive audit logging of all PHI access.**

**What to log for every patient record access**:
1. **Who**: User ID, role (doctor/nurse/admin), IP address
2. **What**: Patient ID, record type (demographics/meds/labs)
3. **When**: Timestamp (millisecond precision)
4. **Why**: Purpose (treatment/research/billing)
5. **Result**: Success or access denied
6. **Changes**: What was modified (before/after values)

**Critical requirements**:
- **Immutable logs** - Write-only, no updates or deletes
- **Tamper-proof** - Hash chains or write to append-only storage
- **Retention** - Keep logs for 6 years (HIPAA requirement)
- **Fast writes** - Don't slow down the critical path
- **Searchable** - Compliance officers need to query logs

**Implementation**:
- **Message queue** - Async logging (don't block API responses)
- **Separate database** - Isolate audit logs from application data
- **Archive to S3/Glacier** - Long-term retention for compliance`,

  whyItMatters: 'Audit logs are your legal protection:\n1. Prove compliance during audits\n2. Detect unauthorized access (insider threats)\n3. Investigate data breaches\n4. Required for HIPAA certification\n5. Evidence in lawsuits',

  famousIncident: {
    title: 'UCLA Health Celebrity Snooping',
    company: 'UCLA Medical Center',
    year: '2008',
    whatHappened: 'Employees illegally accessed celebrity patient records (Britney Spears, Maria Shriver, Farrah Fawcett). Audit logs caught them. UCLA fired the staff and paid $865,000 in fines.',
    lessonLearned: 'Audit logs detect insider threats. Without them, you can\'t prove who accessed what data.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Cleveland Clinic',
    scenario: 'Logging millions of PHI accesses per day',
    howTheyDoIt: 'Kafka message queue for async logging, Elasticsearch for search, S3 Glacier for 6-year retention, automated alerts for suspicious access patterns',
  },

  keyPoints: [
    'Log EVERY access to PHI - no exceptions',
    'Use message queues for async logging (don\'t block API)',
    'Store logs in separate database (isolation)',
    'Make logs immutable and tamper-proof',
    'Retain for 6 years (HIPAA requirement)',
    'Enable search and analytics for compliance',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│              AUDIT LOGGING FLOW                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐      ┌─────────────┐                 │
│  │  Client  │ ───▶ │ App Server  │                 │
│  └──────────┘      └──────┬──────┘                 │
│                           │                         │
│                           │ 1. Serve request        │
│                           │                         │
│                           │ 2. Async log            │
│                           ▼                         │
│                    ┌─────────────┐                  │
│                    │ Message     │                  │
│                    │ Queue       │                  │
│                    │ (Kafka)     │                  │
│                    └──────┬──────┘                  │
│                           │                         │
│                           │ 3. Consume              │
│                           ▼                         │
│                    ┌─────────────┐                  │
│                    │ Audit Log   │                  │
│                    │ Database    │                  │
│                    │ (Immutable) │                  │
│                    └──────┬──────┘                  │
│                           │                         │
│                           │ 4. Archive              │
│                           ▼                         │
│                    ┌─────────────┐                  │
│                    │ S3 Glacier  │                  │
│                    │ (6 years)   │                  │
│                    └─────────────┘                  │
│                                                     │
└─────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Immutable', explanation: 'Write-only logs - no updates or deletes allowed', icon: '🔒' },
    { title: 'Async Logging', explanation: 'Use queues to avoid blocking API responses', icon: '⚡' },
    { title: 'Retention', explanation: 'Keep logs for 6 years (HIPAA requirement)', icon: '📅' },
    { title: 'Tamper-Proof', explanation: 'Hash chains or append-only storage prevent manipulation', icon: '🛡️' },
  ],

  quickCheck: {
    question: 'Why use a message queue for audit logging?',
    options: [
      'It makes logs more secure',
      'Async logging doesn\'t block API responses - keeps latency low',
      'It reduces storage costs',
      'HIPAA requires it',
    ],
    correctIndex: 1,
    explanation: 'Message queues enable async logging. API responds fast, logs are written in the background without blocking the critical path.',
  },
};

const step6: GuidedStep = {
  id: 'healthcare-cache-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All PHI access must be logged (HIPAA requirement)',
    taskDescription: 'Add message queue and audit database for comprehensive logging',
    componentsNeeded: [
      { type: 'client', reason: 'Represents EHR applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes requests and logs access', displayName: 'App Server' },
      { type: 'database', reason: 'Stores patient records', displayName: 'Database' },
      { type: 'cache', reason: 'Caches hot records (encrypted)', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Async audit log delivery', displayName: 'Message Queue' },
      { type: 'database', reason: 'Audit log storage', displayName: 'Audit DB' },
    ],
    successCriteria: [
      'Add Message Queue for async logging',
      'Add separate Audit Database',
      'Connect App Server → Queue → Audit DB',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireAuditLogging: true,
  },

  hints: {
    level1: 'Add Message Queue and Audit Database for logging',
    level2: 'Connect App Server → Message Queue → Audit Database for async, immutable audit logs',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
      { type: 'message_queue' },
      { type: 'database' }, // Second database for audit logs
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Database Replication for High Availability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your phone is ringing. The primary database crashed!",
  hook: "All patient records are offline. ER can't access medical histories. Nurses can't see medication lists. Lives are at risk. You need a backup NOW!",
  challenge: "Configure database replication so a replica can take over if the primary fails.",
  illustration: 'server-crash',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Your data is now protected with replication!',
  achievement: 'Database High Availability configured',
  metrics: [
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'Data loss risk', before: 'High', after: 'Near zero' },
    { label: 'Failover time', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "Protected! But can it handle the full hospital load?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: High Availability for Healthcare',
  conceptExplanation: `When your database crashes, patient care stops - unless you have **replicas** (copies).

**For healthcare, use Single Leader (Primary-Replica) replication:**

1. **Primary database** handles all writes
2. **Replicas** sync continuously and handle reads
3. **Automatic failover** - if primary fails, promote a replica
4. **Synchronous replication** - zero data loss (HIPAA requirement)

**Why synchronous replication for healthcare?**
- Async replication might lose recent writes during failover
- Medical data loss is unacceptable and illegal
- Trade-off: Slower writes (50ms penalty) but guaranteed durability

**Typical setup**:
- 1 Primary in availability zone 1
- 2 Replicas in zones 2 and 3
- Automatic failover in < 30 seconds`,

  whyItMatters: 'Without replication:\n1. Database crash = patient care stops\n2. Hardware failure = data loss\n3. Maintenance = downtime\n4. No disaster recovery\n5. Malpractice lawsuits from delayed care',

  famousIncident: {
    title: 'Allscripts EHR Outage',
    company: 'Allscripts (EHR vendor)',
    year: '2018',
    whatHappened: 'Ransomware attack took down their database. 1,500+ medical practices had no patient records for a week. Appointments were cancelled. Prescriptions couldn\'t be filled. Patients suffered.',
    lessonLearned: 'Database replication and backups are life-or-death for healthcare. No single points of failure.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Partners HealthCare (Mass General)',
    scenario: 'Never lose patient data, even during disasters',
    howTheyDoIt: 'PostgreSQL with synchronous replication to 3 replicas across availability zones, automated failover, hourly backups to offsite storage',
  },

  keyPoints: [
    'Synchronous replication for healthcare (zero data loss)',
    'Single Leader: Simple, strong consistency for writes',
    'Automatic failover in < 30 seconds',
    '3 replicas = survive 2 failures',
    'Read scaling: Replicas handle read queries',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         SINGLE LEADER REPLICATION                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│     ┌─────────┐   writes   ┌──────────┐            │
│     │   App   │ ─────────▶ │ Primary  │            │
│     │ Server  │            │ Database │            │
│     └────┬────┘            └────┬─────┘            │
│          │                      │                  │
│          │ reads                │ sync replication │
│          │                      ▼                  │
│          │              ┌───────────────┐          │
│          │              │   Replica 1   │          │
│          └────────────▶ │  (Zone 2)     │          │
│                         └───────────────┘          │
│                                │                   │
│                                ▼                   │
│                         ┌───────────────┐          │
│                         │   Replica 2   │          │
│                         │  (Zone 3)     │          │
│                         └───────────────┘          │
│                                                     │
│  Primary fails → Auto-promote Replica 1 in 30s     │
└─────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Synchronous', explanation: 'Write confirmed only after replica acknowledges', icon: '🔄' },
    { title: 'Failover', explanation: 'Automatic promotion of replica when primary fails', icon: '⚡' },
    { title: 'RPO', explanation: 'Recovery Point Objective: Zero data loss with sync replication', icon: '🎯' },
    { title: 'RTO', explanation: 'Recovery Time Objective: < 30 sec failover for healthcare', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'Why must healthcare use synchronous (not async) replication?',
    options: [
      'It\'s faster',
      'Async might lose recent medical data during failover - unacceptable',
      'It\'s cheaper',
      'HIPAA requires it',
    ],
    correctIndex: 1,
    explanation: 'Async replication can lose recent writes during failover. For healthcare, losing medical data is illegal and dangerous. Sync replication guarantees zero data loss.',
  },
};

const step7: GuidedStep = {
  id: 'healthcare-cache-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'System must survive database failures (99.99% availability)',
    taskDescription: 'Configure database replication with 2+ replicas',
    successCriteria: [
      'Build full architecture',
      'Click Database → Enable replication',
      'Configure 2+ replicas with synchronous replication',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Configure database replication for high availability',
    level2: 'Click Database → Replication → Enable with 2+ replicas and synchronous mode',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Load Balancer for Scalability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🏥',
  scenario: "Final Exam! Hospital expansion - doubling capacity to 1,000 beds!",
  hook: "Traffic will 10x during the transition. Your single app server will melt. You need horizontal scaling NOW!",
  challenge: "Add a load balancer and configure multiple app servers to handle the surge.",
  illustration: 'traffic-spike',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your healthcare cache is production-ready!',
  achievement: 'HIPAA-compliant, highly available, scalable system complete',
  metrics: [
    { label: 'Capacity', before: '1K RPS', after: '10K+ RPS' },
    { label: 'Availability', before: '99%', after: '99.99%' },
    { label: 'HIPAA compliance', after: '✓ Full' },
    { label: 'Encryption', after: '✓ At rest & in transit' },
    { label: 'Audit logging', after: '✓ Comprehensive' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade healthcare caching system. Try extending it with rate limiting or multi-region deployment!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Handling Hospital-Scale Traffic',
  conceptExplanation: `One app server handles ~1,000-5,000 requests/sec. A 1,000-bed hospital needs more!

**Solution**: Multiple app servers behind a **Load Balancer**

The load balancer:
1. Receives ALL incoming traffic (HTTPS only)
2. Distributes requests across app servers
3. Detects unhealthy servers and removes them
4. Enables zero-downtime deployments
5. Terminates TLS (encryption in transit)

**Algorithms**:
- **Round Robin**: Rotate through servers
- **Least Connections**: Send to least busy server
- **IP Hash**: Same client → same server (session affinity)

**For healthcare**:
- TLS 1.3 termination at load balancer
- Health checks every 10 seconds
- Auto-scaling based on CPU (> 70% = add server)`,

  whyItMatters: 'Load balancers provide:\n1. Horizontal scaling (handle more traffic)\n2. High availability (survive server failures)\n3. Zero-downtime deployments\n4. TLS termination (encryption in transit)\n5. DDoS protection',

  famousIncident: {
    title: 'HealthCare.gov Launch Disaster',
    company: 'U.S. Government',
    year: '2013',
    whatHappened: 'HealthCare.gov launched with a single server. Traffic was 10x expected. The site crashed immediately. Millions couldn\'t sign up for insurance. The project cost $2 billion and was a national embarrassment.',
    lessonLearned: 'Load balancers and auto-scaling are essential. Always plan for 10x your expected peak.',
    icon: '🏛️',
  },

  realWorldExample: {
    company: 'Kaiser Permanente',
    scenario: 'Handling 12 million patients across 39 hospitals',
    howTheyDoIt: 'AWS Application Load Balancers with auto-scaling groups, 100+ app servers during peak, TLS 1.3 termination, health checks every 10 seconds',
  },

  keyPoints: [
    'Horizontal scaling: more servers = more capacity',
    'Health checks remove failed servers automatically',
    'TLS termination: LB handles encryption',
    'Auto-scaling: add/remove servers based on load',
    'No single point of failure for app tier',
  ],

  diagram: `
                              ┌─────────────┐
                        ┌────▶│ App Server 1│
                        │     └─────────────┘
┌────────┐   ┌─────────┐│     ┌─────────────┐
│ Client │──▶│   LB    │┼────▶│ App Server 2│
│ (HTTPS)│   │ (TLS)   ││     └─────────────┘
└────────┘   └─────────┘│     ┌─────────────┐
                        └────▶│ App Server 3│
                              └─────────────┘
`,

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '📈' },
    { title: 'TLS Termination', explanation: 'LB decrypts HTTPS, forwards to servers', icon: '🔒' },
    { title: 'Health Checks', explanation: 'LB pings servers, removes unhealthy ones', icon: '💓' },
    { title: 'Auto-Scaling', explanation: 'Automatically add/remove servers based on load', icon: '⚡' },
  ],

  quickCheck: {
    question: 'What is the main benefit of a load balancer for healthcare?',
    options: [
      'Reduces database queries',
      'Distributes traffic for scale and availability + TLS termination',
      'Caches patient records',
      'Stores audit logs',
    ],
    correctIndex: 1,
    explanation: 'Load balancers enable horizontal scaling (handle more traffic) and high availability (survive failures), plus handle TLS encryption.',
  },
};

const step8: GuidedStep = {
  id: 'healthcare-cache-step-8',
  stepNumber: 8,
  frIndex: 6,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'System must handle 10K+ RPS with HIPAA compliance',
    taskDescription: 'Add load balancer and configure multiple app servers',
    componentsNeeded: [
      { type: 'client', reason: 'EHR applications', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic with TLS', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple instances', displayName: 'App Server' },
      { type: 'database', reason: 'Replicated patient records', displayName: 'Database' },
      { type: 'cache', reason: 'Encrypted cache', displayName: 'Cache' },
      { type: 'message_queue', reason: 'Async audit logging', displayName: 'Message Queue' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and App Server',
      'Configure App Server with 3+ instances',
      'Verify all components connected properly',
      'System is HIPAA-compliant and scalable',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireCacheEncryption: true,
    requireAuditLogging: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer and configure multiple app server instances',
    level2: 'Insert Load Balancer between Client and App Server, then configure App Server for 3+ instances',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const healthcareRecordsCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'healthcare-records-cache-guided',
  problemTitle: 'Build a HIPAA-Compliant Healthcare Records Cache',

  requirementsPhase: healthcareRecordsCacheRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Record Retrieval',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Retrieve patient records with low latency.',
      traffic: { type: 'read', rps: 10, readRps: 10 },
      duration: 10,
      passCriteria: { maxErrorRate: 0, maxP99Latency: 200 },
    },
    {
      name: 'Cache Hit Performance',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Hot records served from cache in < 50ms.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, minCacheHitRate: 0.8 },
    },
    {
      name: 'Record Updates & Invalidation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Cache invalidation ensures consistency after updates.',
      traffic: { type: 'mixed', rps: 50, readRps: 40, writeRps: 10 },
      duration: 30,
      passCriteria: { maxErrorRate: 0, maxStalenessSeconds: 1 },
    },
    {
      name: 'NFR-S1: Encryption at Rest',
      type: 'security',
      requirement: 'NFR-S1',
      description: 'All PHI encrypted with AES-256.',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { requireEncryptionAtRest: true, maxErrorRate: 0 },
    },
    {
      name: 'NFR-S2: Audit Logging',
      type: 'security',
      requirement: 'NFR-S2',
      description: 'All PHI access logged comprehensively.',
      traffic: { type: 'mixed', rps: 100, readRps: 80, writeRps: 20 },
      duration: 60,
      passCriteria: { requireAuditLogs: true, minLogCoverage: 1.0 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System survives database primary failure.',
      traffic: { type: 'mixed', rps: 100, readRps: 80, writeRps: 20 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 30 },
    },
    {
      name: 'NFR-P1: Peak Load Handling',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle hospital-scale traffic with low latency.',
      traffic: { type: 'mixed', rps: 500, readRps: 400, writeRps: 100 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
  ] as TestCase[],
};

export function getHealthcareRecordsCacheGuidedTutorial(): GuidedTutorial {
  return healthcareRecordsCacheGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = healthcareRecordsCacheRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= healthcareRecordsCacheRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
