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
 * Healthcare Records System - FR-FIRST EDITION
 *
 * A story-driven 7-step tutorial that teaches healthcare system design concepts
 * while building a HIPAA-compliant Electronic Health Records (EHR) system.
 *
 * Flow:
 * Phase 0: Requirements gathering (HIPAA, patient consent, interoperability)
 * Steps 1-3: Build basic EHR storage (FR satisfaction)
 * Steps 4-6: Add encryption at rest, access logging, HL7/FHIR integration
 *
 * Key Concepts:
 * - HIPAA compliance and PHI protection
 * - Electronic Health Records (EHR) storage
 * - Patient consent management
 * - Encryption at rest (AES-256)
 * - Comprehensive audit logging
 * - Healthcare interoperability (HL7/FHIR)
 * - Access control and authentication
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const healthcareRecordsRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an Electronic Health Records (EHR) system that stores patient medical data securely and complies with HIPAA regulations",

  interviewer: {
    name: 'Dr. Emma Rodriguez',
    role: 'Chief Medical Information Officer at HealthCare Systems',
    avatar: '👩‍⚕️',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    {
      id: 'core-functionality',
      category: 'functional',
      question: "What's the main purpose of this EHR system? What do healthcare providers need to do?",
      answer: "Healthcare providers need to:\n\n1. **Store patient records** - Demographics, medical history, medications, allergies, lab results\n2. **Retrieve records quickly** - Doctors need instant access during patient visits\n3. **Update records** - Add diagnoses, prescriptions, visit notes in real-time\n4. **Search patient data** - Find patients by name, MRN (Medical Record Number), or demographics\n5. **Share records** - Send records to other hospitals/specialists when patients transfer",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "EHR systems are the backbone of modern healthcare - they must be fast, reliable, and secure",
    },
    {
      id: 'data-types',
      category: 'functional',
      question: "What types of healthcare data will we store?",
      answer: "We'll store comprehensive Protected Health Information (PHI):\n- **Patient demographics** (name, DOB, SSN, contact info)\n- **Medical history** (diagnoses, procedures, surgeries, allergies)\n- **Medications** (prescriptions, dosages, start/end dates)\n- **Lab results** (blood tests, imaging, pathology reports)\n- **Visit records** (doctor notes, vitals, treatment plans)\n- **Insurance information** (policy numbers, coverage)\n\nAll of this is PHI under HIPAA and requires strict protection!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "PHI includes any health information that can identify a patient - requires encryption and access controls",
    },
    {
      id: 'hipaa-requirements',
      category: 'security',
      question: "What are the HIPAA compliance requirements for this system?",
      answer: "HIPAA mandates:\n1. **Encryption at rest** - All PHI must be encrypted when stored (AES-256)\n2. **Encryption in transit** - TLS 1.3 for all network communication\n3. **Access controls** - Role-based access (doctors, nurses, admin staff)\n4. **Audit logging** - Log every access to PHI (who, when, what)\n5. **Data retention** - Keep audit logs for 6 years minimum\n6. **Patient consent** - Patients must consent to data access/sharing\n7. **Breach notification** - Report breaches within 60 days\n8. **Data minimization** - Only collect necessary PHI",
      importance: 'critical',
      revealsRequirement: 'NFR-S1, NFR-S2, NFR-S3',
      learningPoint: "HIPAA violations result in $50,000 fines per violation and potential criminal charges - compliance is non-negotiable",
    },
    {
      id: 'patient-consent',
      category: 'security',
      question: "How do we handle patient consent for data access and sharing?",
      answer: "Patient consent is critical:\n1. **Explicit consent required** - Patients must authorize each type of data access\n2. **Granular permissions** - Consent can be limited by:\n   - Type of data (meds vs. mental health records)\n   - Time period (temporary access for specialist)\n   - Specific providers/facilities\n3. **Revocable** - Patients can withdraw consent anytime\n4. **Audit trail** - Log all consent changes\n5. **Emergency override** - Life-threatening situations allow access without consent\n\nExample: Patient consents to share allergy data with ER but NOT mental health records",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Patient consent is both a legal requirement and fundamental patient right - system must enforce it strictly",
    },
    {
      id: 'interoperability',
      category: 'functional',
      question: "How do we share records with other hospitals and healthcare systems?",
      answer: "Healthcare interoperability is critical:\n\n**Standards:**\n1. **HL7 v2** - Legacy standard for messaging (ADT, lab results)\n2. **HL7 FHIR** - Modern REST API standard (preferred)\n3. **DICOM** - Medical imaging (X-rays, MRIs)\n\n**Use case:** Patient transfers from Hospital A to Hospital B\n- Hospital B requests records via FHIR API\n- Check patient consent\n- Return structured FHIR resources (Patient, Medication, Condition)\n- All transmitted over TLS with mutual authentication\n\nInteroperability saves lives - doctors get critical info immediately!",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "HL7/FHIR are the standards for healthcare data exchange - essential for modern EHR systems",
    },
    {
      id: 'audit-logging',
      category: 'security',
      question: "What exactly should we log for HIPAA audit purposes?",
      answer: "Comprehensive audit logging is mandatory:\n\n**For every PHI access, log:**\n- **Who**: User ID, role, name, IP address\n- **What**: Patient ID, record type (demographics, meds, mental health)\n- **When**: Timestamp (millisecond precision)\n- **Why**: Purpose (treatment, payment, research, emergency)\n- **Action**: Read, write, update, delete, export\n- **Result**: Success or access denied\n- **Changes**: What was modified (before/after values)\n\n**Log retention:**\n- Keep for 6 years minimum (HIPAA requirement)\n- Immutable logs (append-only)\n- Stored separately from application database\n\nLogs are your legal protection during breach investigations!",
      importance: 'critical',
      revealsRequirement: 'NFR-S2',
      learningPoint: "Audit logs prove compliance and detect insider threats - must be tamper-proof and comprehensive",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many patient record lookups per day?",
      answer: "A hospital network with 5 hospitals and 2,000 beds:\n- 10,000 ER visits per day\n- 5,000 ICU/inpatient records accessed continuously\n- 20,000 outpatient appointments per day\n\nEach visit = 5-10 record accesses. Total: ~200,000 reads/day",
      importance: 'critical',
      calculation: {
        formula: "200,000 reads ÷ 86,400 sec = 2.3 reads/sec average",
        result: "~2-5 reads/sec average, ~50 reads/sec peak (morning rounds)",
      },
      learningPoint: "Healthcare has predictable peaks: morning rounds (7-9 AM), shift changes (7 AM, 3 PM, 11 PM)",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many record updates per day?",
      answer: "Every patient encounter generates updates:\n- New vitals recorded\n- Doctor notes added\n- Medications prescribed\n- Lab results uploaded\n\nAbout 50,000 writes/day across all patients",
      importance: 'critical',
      calculation: {
        formula: "50,000 writes ÷ 86,400 sec = 0.58 writes/sec",
        result: "~1 write/sec average, ~10 writes/sec peak",
      },
      learningPoint: "Healthcare is read-heavy (200K reads vs 50K writes) but writes must be ACID-compliant",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "How fast must record retrieval be?",
      answer: "Clinical workflows demand speed:\n- **Critical lookups** (allergies, current meds): p99 < 100ms\n- **General records** (history, labs): p99 < 500ms\n- **Search queries**: p99 < 1 second\n\nER doctors can't wait - slow systems delay care and cost lives!",
      importance: 'critical',
      learningPoint: "Sub-second response times are essential for clinical decision-making - caching is critical",
    },
    {
      id: 'data-consistency',
      category: 'consistency',
      question: "Can we tolerate eventual consistency for patient records?",
      answer: "It depends on the data:\n\n**Strong consistency required:**\n- Allergies (life-threatening if stale)\n- Current medications (drug interactions)\n- Active diagnoses\n\n**Eventual consistency acceptable:**\n- Old lab results (historical data)\n- Billing information\n- Appointment history\n\nFor critical data, use synchronous replication. For historical data, async is fine.",
      importance: 'critical',
      learningPoint: "Healthcare has mixed consistency requirements - critical data needs strong consistency",
    },
    {
      id: 'disaster-recovery',
      category: 'reliability',
      question: "What's the disaster recovery plan if the database fails?",
      answer: "Healthcare cannot tolerate downtime:\n\n**Requirements:**\n- **RTO (Recovery Time Objective)**: < 15 minutes\n- **RPO (Recovery Point Objective)**: < 5 minutes of data loss\n\n**Solution:**\n- Primary database with synchronous replication to 2 replicas\n- Automated failover in < 30 seconds\n- Continuous backups every 5 minutes\n- Offsite backup storage (different region)\n- Annual disaster recovery drills\n\nPatient care cannot stop - 99.99% uptime is minimum!",
      importance: 'critical',
      learningPoint: "Healthcare systems are mission-critical - multi-region replication and backups are mandatory",
    },
    {
      id: 'data-retention',
      category: 'security',
      question: "How long must we keep patient records and audit logs?",
      answer: "Legal retention requirements:\n\n**Patient records:**\n- **Adults**: 7-10 years after last visit (varies by state)\n- **Minors**: Until age 21 + 7 years\n- **Permanent**: Some records (immunizations, surgical notes)\n\n**Audit logs:**\n- **6 years minimum** (HIPAA requirement)\n- Store in append-only archive (S3 Glacier)\n- Enable encryption and access controls\n\n**Data purging:**\n- Automated deletion after retention period\n- Anonymization for research use",
      importance: 'critical',
      learningPoint: "Healthcare data retention is legally mandated - must implement lifecycle policies",
    },
    {
      id: 'encryption-requirements',
      category: 'security',
      question: "What encryption standards should we use?",
      answer: "HIPAA encryption requirements:\n\n**At rest:**\n- AES-256 encryption for all PHI\n- Separate encryption keys per patient (data isolation)\n- Key rotation every 90 days\n- Use HSM or cloud KMS for key management\n\n**In transit:**\n- TLS 1.3 with certificate pinning\n- Mutual TLS for hospital-to-hospital transfers\n- VPN for remote provider access\n\n**Best practices:**\n- Never store keys with encrypted data\n- Use envelope encryption (data key + key encryption key)\n- Enable encryption at database and file system level",
      importance: 'critical',
      learningPoint: "Defense in depth: encrypt at multiple layers (app, database, storage, network)",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'hipaa-requirements', 'patient-consent'],
  criticalFRQuestionIds: ['core-functionality', 'data-types', 'interoperability'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-requirements', 'data-consistency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Store patient records',
      description: 'Securely store comprehensive patient medical records including demographics, history, medications, and lab results',
      emoji: '📋',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Retrieve records quickly',
      description: 'Fast lookups of patient data for clinical decision-making (p99 < 500ms)',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Update records in real-time',
      description: 'Healthcare providers can update patient records during visits',
      emoji: '✏️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Patient consent management',
      description: 'Track and enforce patient consent for data access and sharing',
      emoji: '✅',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Interoperability (HL7/FHIR)',
      description: 'Share records with other healthcare systems via standard protocols',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10,000 healthcare providers',
    writesPerDay: '50,000 record updates',
    readsPerDay: '200,000 record lookups',
    peakMultiplier: 20,
    readWriteRatio: '4:1',
    calculatedWriteRPS: { average: 0.58, peak: 10 },
    calculatedReadRPS: { average: 2.3, peak: 50 },
    maxPayloadSize: '~500KB (complete patient record with imaging metadata)',
    storagePerRecord: '~1MB (with attachments and history)',
    storageGrowthPerYear: '~18TB (50K new records/day)',
    redirectLatencySLA: 'p99 < 100ms (critical data)',
    createLatencySLA: 'p99 < 500ms (general records)',
  },

  architecturalImplications: [
    '✅ HIPAA compliance → AES-256 encryption at rest, TLS 1.3 in transit',
    '✅ Audit requirements → Comprehensive logging of all PHI access',
    '✅ Read-heavy workload → Caching layer for frequently accessed records',
    '✅ Strong consistency needed → Synchronous replication for critical data',
    '✅ Disaster recovery → Multi-region database replication (RTO < 15 min)',
    '✅ Interoperability → HL7 FHIR API for external integrations',
    '✅ Patient consent → Fine-grained access control enforcement',
  ],

  outOfScope: [
    'Medical imaging storage (PACS/DICOM)',
    'Real-time vitals monitoring (ICU telemetry)',
    'Prescription routing to pharmacies',
    'Insurance claim processing',
    'Telemedicine video streaming',
    'Clinical decision support (AI/ML)',
    'Billing and revenue cycle management',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic EHR that stores and retrieves patient records. Then we'll layer on HIPAA compliance: encryption at rest, comprehensive audit logging, and HL7/FHIR interoperability. Functionality first, then regulatory hardening!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏥',
  scenario: "Welcome to HealthCare Systems! You've been hired to build a modern Electronic Health Records (EHR) platform.",
  hook: "A doctor just logged in and needs to access a patient's medical history for an urgent care visit!",
  challenge: "Set up the basic connection so healthcare providers can access patient records.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your EHR system is online!',
  achievement: 'Healthcare providers can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'TLS enabled', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to store or retrieve records yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: EHR System Architecture',
  conceptExplanation: `Every healthcare system starts with **Clients** (doctor workstations, mobile apps) connecting to a **Server**.

When a doctor needs a patient record:
1. Their EHR application (web/mobile) is the **Client**
2. It sends HTTPS requests to your **EHR Server**
3. The server retrieves the record from the database
4. Returns the data securely to the provider

**Critical security requirement:**
- All communication MUST use TLS 1.3 (HIPAA requirement)
- No unencrypted HTTP allowed
- Patient data (PHI) must never be transmitted in cleartext

This is the foundation of secure, compliant healthcare data access!`,

  whyItMatters: 'Without this connection, doctors cannot access patient records - which means they cannot provide care. Security from the start is essential.',

  realWorldExample: {
    company: 'Epic Systems',
    scenario: 'Serving 250+ million patient records across 1,000+ hospitals',
    howTheyDoIt: 'Multi-tier architecture with load-balanced app servers, TLS everywhere, and zero-trust network security',
  },

  keyPoints: [
    'Client = EHR workstation, mobile app, or external API consumer',
    'App Server = backend that orchestrates data access and enforces security',
    'TLS 1.3 is mandatory for PHI transmission (HIPAA requirement)',
    'Authentication required for every request (OAuth 2.0 or SAML)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Healthcare provider application requesting patient data', icon: '🖥️' },
    { title: 'App Server', explanation: 'Backend that enforces security and orchestrates data access', icon: '⚙️' },
    { title: 'PHI', explanation: 'Protected Health Information - must be encrypted and audited', icon: '🔒' },
    { title: 'TLS', explanation: 'Transport Layer Security - encrypts all network traffic', icon: '🔐' },
  ],
};

const step1: GuidedStep = {
  id: 'healthcare-records-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Foundation for all FRs',
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
// STEP 2: Add Database for Patient Record Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Your server is connected, but where will patient records be stored?",
  hook: "A doctor just tried to save a patient's new diagnosis, but the server has nowhere to persist the data!",
  challenge: "Add a database to store patient records permanently with ACID guarantees.",
  illustration: 'database-missing',
};

const step2Celebration: CelebrationContent = {
  emoji: '💽',
  message: 'Patient records are now persistent!',
  achievement: 'Medical data survives crashes with ACID guarantees',
  metrics: [
    { label: 'Data persistence', after: '✓ Enabled' },
    { label: 'Database', after: 'PostgreSQL' },
    { label: 'ACID compliance', after: '✓' },
  ],
  nextTeaser: "But we haven't implemented the record retrieval APIs yet...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Data Persistence: Why Databases Are Critical for Healthcare',
  conceptExplanation: `For healthcare systems, losing data is **catastrophic, illegal, and potentially deadly**.

A **database** provides:
- **Durability**: Patient records survive crashes and power outages
- **ACID guarantees**: Atomicity, Consistency, Isolation, Durability
- **Audit trail**: Complete history for compliance
- **Structured queries**: Efficient lookups by patient ID, MRN, name, DOB
- **Relational integrity**: Link patients to diagnoses, medications, lab results

**Database schema for EHR:**
\`\`\`sql
patients table:
- patient_id (primary key)
- mrn (medical record number, indexed)
- name, dob, ssn
- demographics (address, phone, email)
- created_at, updated_at

medical_history table:
- history_id
- patient_id (foreign key)
- diagnosis_code (ICD-10)
- diagnosis_date
- provider_id

medications table:
- medication_id
- patient_id
- drug_name, dosage
- start_date, end_date
- prescriber_id

access_logs table:
- log_id
- user_id, patient_id
- action (read/write/update)
- timestamp
- ip_address
\`\`\``,

  whyItMatters: 'Without a database:\n1. Patient data lost on server restart\n2. No ACID guarantees (data corruption possible)\n3. Cannot meet HIPAA compliance\n4. Legal liability for data loss\n5. Cannot perform complex queries',

  famousIncident: {
    title: 'NHS Hospital Ransomware Data Loss',
    company: 'UK National Health Service',
    year: '2017',
    whatHappened: 'WannaCry ransomware encrypted hospital databases. Patient records were inaccessible. Surgeries were cancelled. Ambulances diverted. Some hospitals lost data permanently due to lack of backups.',
    lessonLearned: 'Database backups, encryption, and disaster recovery are life-or-death requirements for healthcare.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Kaiser Permanente',
    scenario: 'Managing 12+ million patient records',
    howTheyDoIt: 'Oracle RAC with multi-region replication, encrypted at rest, hourly backups, 99.99% uptime SLA',
  },

  keyPoints: [
    'PostgreSQL or MySQL for ACID compliance (NOT NoSQL for critical data)',
    'Relational schema with foreign keys for data integrity',
    'Indexed on patient_id, mrn, name for fast lookups',
    'Encrypted at rest (AES-256) for HIPAA compliance',
  ],

  diagram: `
┌──────────┐       ┌─────────────┐       ┌────────────────┐
│  Client  │ ────▶ │ App Server  │ ────▶ │   Database     │
└──────────┘       └─────────────┘       │                │
                                          │  patients      │
                                          │  medical_hist  │
                                          │  medications   │
                                          │  access_logs   │
                                          └────────────────┘
`,

  keyConcepts: [
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability - mandatory for healthcare', icon: '⚛️' },
    { title: 'Relational DB', explanation: 'PostgreSQL/MySQL for structured health records', icon: '📊' },
    { title: 'Encryption at Rest', explanation: 'AES-256 encryption for stored PHI (HIPAA)', icon: '🔐' },
  ],

  quickCheck: {
    question: 'Why must healthcare use ACID-compliant databases (not NoSQL)?',
    options: [
      'NoSQL is too expensive',
      'ACID guarantees prevent data corruption and ensure durability - critical for medical data',
      'NoSQL is too slow',
      'HIPAA forbids NoSQL',
    ],
    correctIndex: 1,
    explanation: 'Medical records require strong consistency, referential integrity, and durability. NoSQL eventual consistency is too risky.',
  },
};

const step2: GuidedStep = {
  id: 'healthcare-records-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store patient records with ACID guarantees',
    taskDescription: 'Add a Database and connect it to the App Server',
    componentsNeeded: [
      { type: 'database', reason: 'Persistent storage for patient records', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click the App Server, then click the Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Implement Record Retrieval APIs (Python Code)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💻',
  scenario: "Your database is connected, but the server doesn't have any APIs!",
  hook: "A doctor searched for patient MRN-67890 but got a 404 error. The record exists in the database, but there's no API to retrieve it!",
  challenge: "Write the Python code to handle patient record lookups, creation, and updates.",
  illustration: 'code-editor',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your EHR APIs are live!',
  achievement: 'You implemented the core patient record management functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can create records', after: '✓' },
    { label: 'Can retrieve records', after: '✓' },
    { label: 'Can update records', after: '✓' },
  ],
  nextTeaser: "But patient data is stored in plain text - that's a HIPAA violation!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'EHR API Implementation: Critical Record Handlers',
  conceptExplanation: `Every EHR system needs **handler functions** that manage patient records.

**Core APIs needed:**
- \`POST /api/v1/patients\` - Create new patient record
- \`GET /api/v1/patients/:id\` - Retrieve patient by ID
- \`GET /api/v1/patients/search\` - Search patients by name/MRN
- \`PUT /api/v1/patients/:id\` - Update patient record
- \`POST /api/v1/patients/:id/medical-history\` - Add medical history entry
- \`GET /api/v1/patients/:id/medications\` - Get patient medications

**Critical implementation requirements:**
1. **Authentication** - Verify user has valid credentials (OAuth 2.0)
2. **Authorization** - Check if user can access this patient (role-based)
3. **Consent checking** - Verify patient has consented to data access
4. **Audit logging** - Log every access to PHI
5. **Input validation** - Prevent SQL injection and data corruption
6. **Error handling** - Return appropriate HTTP status codes

**Example handler:**
\`\`\`python
def get_patient_record(patient_id, user):
    # 1. Authenticate user
    if not user.is_authenticated():
        return 401  # Unauthorized

    # 2. Check authorization (can user access this patient?)
    if not has_permission(user, patient_id):
        return 403  # Forbidden

    # 3. Check patient consent
    if not check_consent(patient_id, user):
        return 403  # Patient has not consented

    # 4. Query database
    record = db.query("SELECT * FROM patients WHERE id = ?", patient_id)

    # 5. Audit log the access
    audit_log(user, patient_id, "READ", "SUCCESS")

    # 6. Return record
    return record
\`\`\``,

  whyItMatters: 'APIs are the gateway to PHI. Poor implementation means data breaches, HIPAA violations, and legal consequences!',

  famousIncident: {
    title: 'Anthem Health Data Breach',
    company: 'Anthem',
    year: '2015',
    whatHappened: 'Hackers exploited weak APIs to steal 78.8 million patient records. SQL injection and lack of authentication allowed unauthorized access. Anthem paid $115 million in settlements.',
    lessonLearned: 'API security is critical: authentication, authorization, input validation, and audit logging are mandatory.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Epic EHR',
    scenario: 'Processing millions of API requests daily',
    howTheyDoIt: 'OAuth 2.0 authentication, role-based access control, comprehensive audit logging, rate limiting',
  },

  keyPoints: [
    'Always authenticate and authorize before data access',
    'Check patient consent before returning PHI',
    'Log every access for HIPAA compliance',
    'Validate all input to prevent injection attacks',
    'Use parameterized queries to prevent SQL injection',
  ],

  quickCheck: {
    question: 'Why must we check patient consent before returning medical records?',
    options: [
      'It makes the system faster',
      'HIPAA requires patient consent for data access - legal and ethical requirement',
      'It reduces server load',
      'It\'s optional but recommended',
    ],
    correctIndex: 1,
    explanation: 'Patient consent is both a HIPAA requirement and a fundamental patient right. Must be enforced strictly.',
  },

  keyConcepts: [
    { title: 'Authentication', explanation: 'Verify user identity (OAuth 2.0)', icon: '🔑' },
    { title: 'Authorization', explanation: 'Check if user can access this resource (RBAC)', icon: '🛡️' },
    { title: 'Consent', explanation: 'Verify patient has approved data access', icon: '✅' },
    { title: 'Audit Log', explanation: 'Record every PHI access for compliance', icon: '📝' },
  ],
};

const step3: GuidedStep = {
  id: 'healthcare-records-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2, FR-3: Create, retrieve, and update patient records',
    taskDescription: 'Configure APIs and implement Python handlers for patient records',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/patients, GET /api/v1/patients/:id, PUT /api/v1/patients/:id, GET /api/v1/patients/search APIs',
      'Open the Python tab',
      'Implement create_patient(), get_patient(), update_patient(), search_patients() functions',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on App Server, then go to the APIs tab to assign patient record endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for create_patient, get_patient, update_patient, and search_patients',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/patients', 'GET /api/v1/patients/:id', 'PUT /api/v1/patients/:id', 'GET /api/v1/patients/search'] } },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Encryption at Rest (HIPAA Compliance)
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🚨',
  scenario: "URGENT: The compliance team just audited your system!",
  hook: '"You\'re storing PHI in plain text in the database?! That\'s a critical HIPAA violation! Fines start at $50,000 per record!"',
  challenge: "Add AES-256 encryption at rest for all patient data stored in the database.",
  illustration: 'security-alert',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔐',
  message: 'Patient data is now encrypted at rest!',
  achievement: 'All PHI protected with AES-256 encryption - HIPAA compliant',
  metrics: [
    { label: 'Encryption', before: '❌ Plain text', after: '✓ AES-256' },
    { label: 'Key management', after: 'Cloud KMS' },
    { label: 'HIPAA compliance', after: '✓ Encryption at rest' },
  ],
  nextTeaser: "Encrypted! But we need to track who is accessing patient data...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Encryption at Rest: HIPAA Requirement for PHI Protection',
  conceptExplanation: `**HIPAA mandates encryption at rest for all Protected Health Information (PHI).**

**Why encryption at rest?**
If someone gains physical access to the database server or steals a hard drive, they should NOT be able to read patient data.

**Implementation:**
1. **AES-256 encryption** - Industry standard, NIST-approved
2. **Managed key service** - AWS KMS, Azure Key Vault, Google Cloud KMS
3. **Key rotation** - Rotate encryption keys every 90 days
4. **Envelope encryption** - Data key encrypts data, master key encrypts data key
5. **Separate keys per patient** - Data isolation (advanced)

**Database-level encryption:**
\`\`\`sql
-- PostgreSQL example
CREATE EXTENSION pgcrypto;

-- Encrypt patient SSN
INSERT INTO patients (ssn_encrypted)
VALUES (pgp_sym_encrypt('123-45-6789', 'encryption_key'));

-- Decrypt when reading
SELECT pgp_sym_decrypt(ssn_encrypted, 'encryption_key')
FROM patients;
\`\`\`

**Cloud provider encryption:**
- AWS RDS: Enable encryption at rest (uses KMS)
- Azure SQL: Transparent Data Encryption (TDE)
- Google Cloud SQL: Customer-managed encryption keys

**Performance impact:** Minimal (< 5% overhead) with hardware acceleration (AES-NI)`,

  whyItMatters: 'HIPAA violations:\n- $50,000 fine per unencrypted record\n- Criminal charges for willful neglect\n- Loss of hospital accreditation\n- Massive reputation damage\n- Lawsuits from patients',

  famousIncident: {
    title: 'Premera Blue Cross Unencrypted Database Breach',
    company: 'Premera Blue Cross',
    year: '2015',
    whatHappened: 'Hackers accessed 11 million patient records stored UNENCRYPTED. Medical histories, SSNs, bank accounts - all in plain text. Premera paid $74 million in fines and settlements. Could have been prevented with encryption.',
    lessonLearned: 'Encryption at rest is mandatory, not optional. The law is clear - encrypt all PHI.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Mayo Clinic',
    scenario: 'Protecting millions of patient records',
    howTheyDoIt: 'AES-256 encryption at rest for all databases, AWS KMS for key management, automated key rotation every 90 days',
  },

  keyPoints: [
    'AES-256 is the gold standard for PHI encryption',
    'Use cloud KMS for key management (never hardcode keys)',
    'Enable encryption at database level (transparent to app)',
    'Rotate keys every 90 days (HIPAA best practice)',
    'Minimal performance impact with hardware acceleration',
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
│                           │ Database    │           │
│                           │ (Encrypted) │           │
│                           │             │           │
│                           │ [\x9f\x2a...│           │
│                           │  \x7b\x4c...]│           │
│                           └─────────────┘           │
│                                                     │
│  Attacker steals disk → Cannot read encrypted data │
└─────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'AES-256', explanation: 'Advanced Encryption Standard with 256-bit keys', icon: '🔐' },
    { title: 'KMS', explanation: 'Key Management Service - secure key storage', icon: '🔑' },
    { title: 'At Rest', explanation: 'Data stored on disk (vs. in transit)', icon: '💾' },
    { title: 'Envelope Encryption', explanation: 'Data key + master key (layered security)', icon: '📦' },
  ],

  quickCheck: {
    question: 'Why is encryption at rest critical for healthcare databases?',
    options: [
      'It makes queries faster',
      'HIPAA requires it - prevents data theft if server is compromised',
      'It reduces storage costs',
      'It\'s optional but recommended',
    ],
    correctIndex: 1,
    explanation: 'HIPAA mandates encryption at rest. If physical storage is stolen, encrypted data is unreadable without keys.',
  },
};

const step4: GuidedStep = {
  id: 'healthcare-records-step-4',
  stepNumber: 4,
  frIndex: 3,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'NFR-S1: All PHI must be encrypted at rest',
    taskDescription: 'Configure database encryption with AES-256',
    successCriteria: [
      'Click on Database component',
      'Enable encryption at rest (AES-256)',
      'Configure key management (Cloud KMS)',
      'Set key rotation period (90 days)',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the Database component to open its configuration',
    level2: 'Find the Security section and enable "Encryption at Rest" with AES-256. Configure Cloud KMS for key management.',
    solutionComponents: [
      { type: 'database', config: { encryptionAtRest: true, encryptionAlgorithm: 'AES-256', keyManagement: 'CloudKMS' } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Comprehensive Audit Logging (HIPAA Compliance)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📝',
  scenario: "The compliance officer needs proof of who accessed patient data!",
  hook: '"We had a potential breach. I need logs showing every access to patient MRN-12345 in the last 90 days. Can you provide them?" You have NO audit logs!',
  challenge: "Add comprehensive audit logging to track every PHI access. Use a message queue for async logging.",
  illustration: 'audit-trail',
};

const step5Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Audit logging is now comprehensive!',
  achievement: 'All PHI access is logged and immutable - ready for compliance audits',
  metrics: [
    { label: 'Audit logging', before: '❌ None', after: '✓ Comprehensive' },
    { label: 'Log retention', after: '6 years (HIPAA)' },
    { label: 'Async logging', after: '✓ Message queue' },
    { label: 'Tamper-proof', after: '✓ Immutable' },
  ],
  nextTeaser: "Logged! But how do we share records with other hospitals?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Audit Logging: HIPAA Requirement for PHI Access Tracking',
  conceptExplanation: `**HIPAA mandates comprehensive audit logging of all PHI access.**

**What to log for every patient record access:**
1. **Who**: User ID, name, role (doctor/nurse/admin), IP address, device ID
2. **What**: Patient ID, MRN, record type (demographics/meds/mental health)
3. **When**: Timestamp (millisecond precision with timezone)
4. **Why**: Purpose (treatment/payment/research/operations/emergency)
5. **Action**: Read, write, update, delete, export, print
6. **Result**: Success or access denied (with reason)
7. **Changes**: What was modified (before/after values for writes)

**Critical requirements:**
- **Immutable logs** - Write-only, no updates or deletes allowed
- **Tamper-proof** - Hash chains or write to append-only storage
- **Retention** - Keep for 6 years minimum (HIPAA requirement)
- **Fast writes** - Async logging doesn't block API responses
- **Searchable** - Enable compliance officers to query logs
- **Complete coverage** - Log 100% of PHI access (no exceptions)

**Architecture:**
\`\`\`
API Request Flow:
1. Doctor requests patient record
2. App Server validates and retrieves data
3. Async: Publish audit event to message queue
4. Background worker consumes events and writes to audit database
5. API responds to doctor (doesn't wait for logging)

Benefits:
- Fast API responses (logging doesn't add latency)
- Guaranteed delivery (message queue retry on failure)
- Scalable (add more workers as volume grows)
- Isolated (audit DB separate from application DB)
\`\`\`

**Audit log schema:**
\`\`\`sql
audit_logs table:
- log_id (UUID, primary key)
- timestamp (indexed)
- user_id, user_name, user_role
- patient_id, patient_mrn (indexed)
- action (READ, WRITE, UPDATE, DELETE)
- resource (demographics, medications, lab_results)
- purpose (treatment, emergency, research)
- result (success, denied)
- before_value, after_value (for writes)
- ip_address, user_agent
- session_id
\`\`\``,

  whyItMatters: 'Audit logs are your legal protection:\n1. Prove HIPAA compliance during audits\n2. Detect insider threats (unauthorized access)\n3. Investigate data breaches\n4. Required for hospital accreditation\n5. Evidence in malpractice lawsuits',

  famousIncident: {
    title: 'UCLA Health Celebrity Snooping Scandal',
    company: 'UCLA Medical Center',
    year: '2008',
    whatHappened: 'Employees illegally accessed celebrity patient records (Britney Spears, Maria Shriver, Farrah Fawcett) out of curiosity. Audit logs caught them red-handed. UCLA fired the staff and paid $865,000 in HIPAA fines.',
    lessonLearned: 'Audit logs detect insider threats. Without them, you cannot prove who accessed what. Employees know they\'re being logged - it deters abuse.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'Partners HealthCare (Mass General)',
    scenario: 'Logging millions of PHI accesses daily',
    howTheyDoIt: 'Kafka for async event streaming, Elasticsearch for search, S3 Glacier for 6-year retention, automated anomaly detection',
  },

  keyPoints: [
    'Log EVERY access to PHI - no exceptions (100% coverage)',
    'Use message queue (Kafka) for async logging - doesn\'t block APIs',
    'Store in separate audit database (isolation)',
    'Make logs immutable (append-only)',
    'Retain for 6 years minimum (HIPAA)',
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
│                           │ 1. Process request      │
│                           │    (validate, query DB) │
│                           │                         │
│                           │ 2. Async publish event  │
│                           ▼                         │
│                    ┌─────────────┐                  │
│                    │ Message     │                  │
│                    │ Queue       │                  │
│                    │ (Kafka)     │                  │
│                    └──────┬──────┘                  │
│                           │                         │
│                           │ 3. Worker consumes      │
│                           ▼                         │
│                    ┌─────────────┐                  │
│                    │ Audit Log   │                  │
│                    │ Database    │                  │
│                    │ (Immutable) │                  │
│                    └──────┬──────┘                  │
│                           │                         │
│                           │ 4. Archive old logs     │
│                           ▼                         │
│                    ┌─────────────┐                  │
│                    │ S3 Glacier  │                  │
│                    │ (6+ years)  │                  │
│                    └─────────────┘                  │
│                                                     │
└─────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Immutable Logs', explanation: 'Write-only, cannot be modified or deleted', icon: '🔒' },
    { title: 'Async Logging', explanation: 'Message queue prevents API blocking', icon: '⚡' },
    { title: 'Message Queue', explanation: 'Kafka/RabbitMQ for reliable delivery', icon: '📬' },
    { title: '6-Year Retention', explanation: 'HIPAA minimum retention period', icon: '📅' },
  ],

  quickCheck: {
    question: 'Why use a message queue for audit logging instead of writing directly to the database?',
    options: [
      'Message queues are cheaper',
      'Async logging doesn\'t block API responses - maintains low latency',
      'Message queues use less storage',
      'It\'s required by HIPAA',
    ],
    correctIndex: 1,
    explanation: 'Message queues enable async logging. API responds fast, logs written in background. Maintains performance while ensuring comprehensive logging.',
  },
};

const step5: GuidedStep = {
  id: 'healthcare-records-step-5',
  stepNumber: 5,
  frIndex: 4,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'NFR-S2: All PHI access must be logged for HIPAA compliance',
    taskDescription: 'Add message queue and audit database for comprehensive logging',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Async audit log delivery', displayName: 'Kafka' },
      { type: 'database', reason: 'Audit log storage (separate from app DB)', displayName: 'Audit DB' },
    ],
    successCriteria: [
      'Add Message Queue component',
      'Add second Database for audit logs',
      'Connect App Server → Message Queue',
      'Connect Message Queue → Audit Database',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add a Message Queue (Kafka) and connect it from App Server for async logging',
    level2: 'Drag Message Queue onto canvas. Connect App Server → Message Queue. This enables async audit logging without blocking API responses.',
    solutionComponents: [
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 6: Add HL7/FHIR Integration for Interoperability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "A patient is being transferred from another hospital!",
  hook: "The receiving doctor needs the patient's medication list and allergy information from the sending hospital. But the systems can't communicate! Data is trapped in silos.",
  challenge: "Add HL7/FHIR integration so your EHR can exchange records with other healthcare systems.",
  illustration: 'integration',
};

const step6Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Your EHR is now interoperable!',
  achievement: 'Can exchange patient records with other healthcare systems via HL7/FHIR',
  metrics: [
    { label: 'HL7 FHIR support', after: '✓ Enabled' },
    { label: 'Interoperability', after: '✓ Standards-compliant' },
    { label: 'Record sharing', after: '✓ Secure API' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade EHR system with full HIPAA compliance and interoperability!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Healthcare Interoperability: HL7 FHIR Standard',
  conceptExplanation: `Healthcare interoperability means different EHR systems can exchange patient data seamlessly.

**The Problem:**
- Patient visits Hospital A (uses Epic EHR)
- Transfers to Hospital B (uses Cerner EHR)
- Doctor at Hospital B needs patient's medication list
- Without interoperability: manually fax or call for records (slow, error-prone)
- With interoperability: instant, automated record exchange

**HL7 FHIR (Fast Healthcare Interoperability Resources):**
- Modern RESTful API standard for healthcare data
- Replaces legacy HL7 v2 (complex, hard to implement)
- Uses JSON format (easy for developers)
- Defines standard "resources" (Patient, Medication, Condition, etc.)

**FHIR Resources:**
\`\`\`json
// Patient Resource
{
  "resourceType": "Patient",
  "id": "12345",
  "name": [{"family": "Smith", "given": ["John"]}],
  "birthDate": "1970-05-15",
  "gender": "male"
}

// Medication Resource
{
  "resourceType": "Medication",
  "id": "67890",
  "code": {
    "coding": [{
      "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
      "code": "308136",
      "display": "Lisinopril 10mg"
    }]
  }
}
\`\`\`

**FHIR API Endpoints:**
- \`GET /fhir/Patient/:id\` - Get patient demographics
- \`GET /fhir/MedicationRequest?patient=:id\` - Get patient's medications
- \`GET /fhir/Condition?patient=:id\` - Get diagnoses
- \`POST /fhir/Patient\` - Create new patient record

**Security for FHIR APIs:**
1. **OAuth 2.0** - External hospitals must authenticate
2. **Patient consent** - Check consent before sharing
3. **Audit logging** - Log all external data requests
4. **TLS mutual auth** - Verify requesting hospital identity
5. **Rate limiting** - Prevent abuse

**Benefits:**
- Instant record exchange (seconds vs. hours/days)
- Reduced medical errors (complete medication list)
- Better patient outcomes (all providers have full history)
- Lower costs (no duplicate tests)`,

  whyItMatters: 'Without interoperability:\n1. Patients suffer from fragmented care\n2. Duplicate tests waste money\n3. Medication errors from incomplete history\n4. Delays in emergency treatment\n5. Poor care coordination',

  famousIncident: {
    title: 'VA EHR Interoperability Failure',
    company: 'U.S. Department of Veterans Affairs',
    year: '2018',
    whatHappened: 'VA\'s EHR system couldn\'t share records with civilian hospitals. Veterans transferred to emergency rooms had incomplete medical records. Led to medication errors and preventable deaths. Congress mandated FHIR adoption.',
    lessonLearned: 'Interoperability saves lives. Closed systems harm patients. FHIR is now federally mandated for U.S. healthcare.',
    icon: '🏥',
  },

  realWorldExample: {
    company: 'CommonWell Health Alliance',
    scenario: 'Connecting 15,000+ healthcare facilities nationwide',
    howTheyDoIt: 'FHIR-based network for record exchange. When patient visits any facility, doctors can query network for records from other providers.',
  },

  keyPoints: [
    'HL7 FHIR is the modern standard for healthcare interoperability',
    'RESTful JSON API - easy to implement',
    'Check patient consent before sharing via FHIR',
    'Use OAuth 2.0 for external API authentication',
    'Log all FHIR requests for audit',
  ],

  diagram: `
Healthcare Interoperability with FHIR:

┌─────────────────┐                    ┌─────────────────┐
│  Hospital A     │                    │  Hospital B     │
│  (Epic EHR)     │                    │  (Cerner EHR)   │
│                 │                    │                 │
│  ┌───────────┐  │                    │  ┌───────────┐  │
│  │ Patient   │  │                    │  │ Receives  │  │
│  │ Transfer  │  │                    │  │ Patient   │  │
│  └─────┬─────┘  │                    │  └─────┬─────┘  │
│        │        │                    │        │        │
│        ▼        │                    │        ▼        │
│  ┌───────────┐  │                    │  ┌───────────┐  │
│  │ FHIR API  │  │◀─── GET /fhir ────│  │ Request   │  │
│  │ Endpoint  │  │     /Patient/:id   │  │ Records   │  │
│  │           │  │                    │  │           │  │
│  │ Returns:  │  │──── JSON ─────────▶│  │ Parse     │  │
│  │ - Patient │  │     Response       │  │ Response  │  │
│  │ - Meds    │  │                    │  │           │  │
│  │ - Allergy │  │                    │  │ Display   │  │
│  └───────────┘  │                    │  │ in EHR    │  │
└─────────────────┘                    └─────────────────┘

Result: Instant record exchange via FHIR standard
`,

  keyConcepts: [
    { title: 'HL7 FHIR', explanation: 'Fast Healthcare Interoperability Resources - modern API standard', icon: '🔄' },
    { title: 'Interoperability', explanation: 'Different systems can exchange data seamlessly', icon: '🌐' },
    { title: 'FHIR Resources', explanation: 'Standardized data structures (Patient, Medication, etc.)', icon: '📋' },
    { title: 'OAuth 2.0', explanation: 'Secure authentication for external API access', icon: '🔐' },
  ],

  quickCheck: {
    question: 'Why is HL7 FHIR critical for modern healthcare?',
    options: [
      'It makes databases faster',
      'Enables seamless record exchange between different EHR systems - improves patient care',
      'It reduces storage costs',
      'It\'s required by HIPAA',
    ],
    correctIndex: 1,
    explanation: 'FHIR enables interoperability. Patients receive better care when all providers have access to complete medical history.',
  },
};

const step6: GuidedStep = {
  id: 'healthcare-records-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Interoperability via HL7/FHIR standard',
    taskDescription: 'Implement FHIR API endpoints for external record sharing',
    successCriteria: [
      'Click on App Server',
      'Add FHIR APIs: GET /fhir/Patient/:id, GET /fhir/MedicationRequest, GET /fhir/Condition',
      'Open Python tab',
      'Implement get_fhir_patient(), get_fhir_medications(), get_fhir_conditions() functions',
      'Verify patient consent before returning FHIR data',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on App Server, add FHIR API endpoints',
    level2: 'In APIs tab, add GET /fhir/Patient/:id and other FHIR endpoints. In Python tab, implement functions that return FHIR-formatted JSON.',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /fhir/Patient/:id', 'GET /fhir/MedicationRequest', 'GET /fhir/Condition'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const healthcareRecordsGuidedTutorial: GuidedTutorial = {
  problemId: 'healthcare-records-ehr',
  title: 'Build a HIPAA-Compliant EHR System',
  description: 'Design and implement an Electronic Health Records system with encryption at rest, comprehensive audit logging, and HL7/FHIR interoperability',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🏥',
    hook: "Welcome to HealthCare Systems! You've been hired as the lead architect.",
    scenario: "Your mission: Build a modern Electronic Health Records (EHR) system that stores patient data securely, complies with HIPAA regulations, and enables seamless record sharing with other hospitals.",
    challenge: "Can you design a system that balances security, compliance, and usability - where doctors can access records instantly while patient data stays protected?",
  },

  requirementsPhase: healthcareRecordsRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Record Storage & Retrieval',
      type: 'functional',
      requirement: 'FR-1, FR-2',
      description: 'Store and retrieve patient records with low latency',
      traffic: { type: 'mixed', rps: 10, readRps: 8, writeRps: 2 },
      duration: 30,
      passCriteria: { maxErrorRate: 0, maxP99Latency: 500 },
    },
    {
      name: 'High Volume Record Access',
      type: 'performance',
      requirement: 'FR-2',
      description: 'Handle hospital-scale record lookups',
      traffic: { type: 'read', rps: 50, readRps: 50 },
      duration: 60,
      passCriteria: { maxP99Latency: 500, maxErrorRate: 0.01 },
    },
    {
      name: 'Encryption at Rest Validation',
      type: 'security',
      requirement: 'NFR-S1',
      description: 'All PHI encrypted with AES-256',
      traffic: { type: 'mixed', rps: 20, readRps: 15, writeRps: 5 },
      duration: 30,
      passCriteria: { requireEncryptionAtRest: true, maxErrorRate: 0 },
    },
    {
      name: 'Comprehensive Audit Logging',
      type: 'security',
      requirement: 'NFR-S2',
      description: 'All PHI access logged with complete metadata',
      traffic: { type: 'mixed', rps: 30, readRps: 24, writeRps: 6 },
      duration: 60,
      passCriteria: { requireAuditLogs: true, minLogCoverage: 1.0 },
    },
    {
      name: 'FHIR Interoperability',
      type: 'functional',
      requirement: 'FR-5',
      description: 'FHIR API returns valid formatted resources',
      traffic: { type: 'read', rps: 10, readRps: 10 },
      duration: 30,
      passCriteria: { requireFHIRCompliance: true, maxErrorRate: 0 },
    },
  ] as TestCase[],

  concepts: [
    'Electronic Health Records (EHR)',
    'HIPAA Compliance',
    'Protected Health Information (PHI)',
    'Encryption at Rest (AES-256)',
    'Comprehensive Audit Logging',
    'HL7 FHIR Interoperability',
    'Patient Consent Management',
    'Healthcare Access Control (RBAC)',
    'Message Queue for Async Logging',
    'Database Encryption with KMS',
    'Healthcare Data Retention',
    'TLS for Data in Transit',
  ],

  ddiaReferences: [
    'Chapter 7: Transactions (ACID for medical records)',
    'Chapter 5: Replication (High availability for healthcare)',
    'Chapter 4: Encoding (FHIR JSON format)',
    'Chapter 11: Stream Processing (Audit log streaming)',
  ],

  prerequisites: [
    'Understanding of relational databases',
    'Basic security concepts (encryption, authentication)',
    'REST API design',
    'HIPAA awareness (recommended)',
  ],
};

export default healthcareRecordsGuidedTutorial;
