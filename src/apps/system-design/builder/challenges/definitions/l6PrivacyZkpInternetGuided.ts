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
 * Zero-Knowledge Proofs Internet Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching ZK-SNARK systems for privacy-preserving verification.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (proof generation, verification, blockchain integration)
 *
 * Key Concepts:
 * - Zero-Knowledge Proofs (ZK-SNARKs)
 * - Privacy-preserving verification
 * - Blockchain integration
 * - Proof generation and verification at scale
 * - Trusted setup ceremonies
 * - Recursive proofs
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const zkpRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Zero-Knowledge Proof verification system for privacy-preserving identity verification on the internet",

  interviewer: {
    name: 'Dr. Elena Torres',
    role: 'Chief Privacy Officer at CryptoAuth Inc.',
    avatar: '👩‍🔬',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-zkp',
      category: 'functional',
      question: "What's the core functionality users need from a ZK proof system?",
      answer: "Users need to:\n\n1. **Prove identity without revealing data** - Verify age >18 without showing birthdate\n2. **Generate cryptographic proofs** - Create ZK-SNARKs proving statements are true\n3. **Verify proofs instantly** - Validators check proofs in milliseconds\n4. **Store proofs on blockchain** - Immutable record of verification",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "ZK proofs enable privacy: prove something is true without revealing WHY it's true",
    },
    {
      id: 'proof-types',
      category: 'functional',
      question: "What types of proofs should we support?",
      answer: "For MVP:\n- **Age verification** - Prove age >18 without revealing birthdate\n- **Income verification** - Prove income >$50K without showing exact amount\n- **Credential verification** - Prove you have a degree without showing transcripts\n\nAll using ZK-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge)",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "ZK-SNARKs are succinct (small proofs) and non-interactive (one-shot verification)",
    },
    {
      id: 'privacy-guarantees',
      category: 'functional',
      question: "What privacy guarantees must the system provide?",
      answer: "Critical privacy requirements:\n1. **Zero-Knowledge** - Verifier learns NOTHING except the statement is true\n2. **Soundness** - Cannot create fake proofs (99.9999% certainty)\n3. **Completeness** - Valid proofs always verify\n4. **Non-linkability** - Can't connect multiple proofs to same person",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Privacy is the whole point - any data leakage defeats the purpose",
    },
    {
      id: 'blockchain-integration',
      category: 'clarification',
      question: "Why store proofs on a blockchain?",
      answer: "Blockchain provides:\n1. **Immutability** - Proofs can't be altered or deleted\n2. **Transparency** - Anyone can verify proofs were created\n3. **Decentralization** - No central authority controlling verification\n4. **Timestamping** - Cryptographic proof of when verification occurred",
      importance: 'critical',
      insight: "Blockchain acts as a tamper-proof audit log for all verifications",
    },
    {
      id: 'trusted-setup',
      category: 'clarification',
      question: "What is a 'trusted setup' and why does it matter?",
      answer: "ZK-SNARKs require a **trusted setup ceremony**:\n- Generate cryptographic parameters (proving key + verification key)\n- If setup is compromised, fake proofs can be created\n- Solution: Multi-party computation (MPC) - need to compromise ALL participants\n- Popular ceremonies: Zcash (200+ participants), Ethereum (thousands)",
      importance: 'critical',
      insight: "Trusted setup is the Achilles heel of ZK-SNARKs - but MPC makes it secure",
    },

    // SCALE & NFRs
    {
      id: 'throughput-proofs',
      category: 'throughput',
      question: "How many proofs should the system generate per day?",
      answer: "1 million proofs per day at steady state, with spikes to 5 million during events (e.g., voting, airdrops)",
      importance: 'critical',
      calculation: {
        formula: "1M ÷ 86,400 sec = 11.6 proofs/sec",
        result: "~12 proofs/sec average, ~58 peak",
      },
      learningPoint: "Proof generation is computationally expensive - need to scale carefully",
    },
    {
      id: 'throughput-verification',
      category: 'throughput',
      question: "How many proof verifications per day?",
      answer: "Each proof may be verified 10-100 times (by different validators). That's 10-100 million verifications per day.",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 verifications/sec",
        result: "~579 verifications/sec average, ~2,895 peak",
      },
      learningPoint: "Verification is 1000x faster than generation - this asymmetry is key",
    },
    {
      id: 'latency-generation',
      category: 'latency',
      question: "How long can proof generation take?",
      answer: "Users will tolerate up to 30 seconds for proof generation. It's computationally intensive - involves polynomial calculations and elliptic curve cryptography.",
      importance: 'important',
      learningPoint: "Proof generation is slow - offload to worker clusters",
    },
    {
      id: 'latency-verification',
      category: 'latency',
      question: "How fast must proof verification be?",
      answer: "p99 under 50ms - verification is synchronous and blocking. This is the magic of ZK-SNARKs: verification is instant even though generation is slow!",
      importance: 'critical',
      learningPoint: "Fast verification enables real-time privacy-preserving checks",
    },
    {
      id: 'storage-requirements',
      category: 'storage',
      question: "How much storage does each proof require?",
      answer: "ZK-SNARK proofs are tiny:\n- Proof size: ~200 bytes (!!)\n- Public inputs: ~100 bytes\n- Metadata: ~100 bytes\n- Total: ~400 bytes per proof\n\nThis is the 'succinct' part of SNARKs!",
      importance: 'important',
      calculation: {
        formula: "1M proofs/day × 400 bytes = 400MB/day",
        result: "~146GB/year storage",
      },
      learningPoint: "Tiny proofs enable blockchain storage - no scalability issues",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "What happens if proof verification gives different results on different nodes?",
      answer: "This is catastrophic! ZK proof verification MUST be deterministic:\n- Same proof + same verification key = same result ALWAYS\n- This is guaranteed by the math - no consensus needed\n- But blockchain storage needs consensus",
      importance: 'critical',
      learningPoint: "Cryptographic verification is deterministic - blockchain adds decentralization",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-zkp', 'proof-types', 'privacy-guarantees'],
  criticalFRQuestionIds: ['core-zkp', 'proof-types'],
  criticalScaleQuestionIds: ['throughput-proofs', 'latency-verification', 'storage-requirements'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Generate ZK proofs',
      description: 'Users can create zero-knowledge proofs of private statements',
      emoji: '🔐',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Verify proofs',
      description: 'Anyone can verify proofs in milliseconds without learning private data',
      emoji: '✅',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Store proofs on blockchain',
      description: 'Immutable storage of verification events with timestamps',
      emoji: '⛓️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Query proof history',
      description: 'Retrieve verification history for auditing and compliance',
      emoji: '📊',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Guarantee privacy',
      description: 'Zero-knowledge, soundness, and completeness guarantees',
      emoji: '🛡️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000 users',
    writesPerDay: '1 million proofs',
    readsPerDay: '50 million verifications',
    peakMultiplier: 5,
    readWriteRatio: '50:1',
    calculatedWriteRPS: { average: 12, peak: 58 },
    calculatedReadRPS: { average: 579, peak: 2895 },
    maxPayloadSize: '~400 bytes (proof)',
    storagePerRecord: '~400 bytes',
    storageGrowthPerYear: '~146GB',
    redirectLatencySLA: 'p99 < 50ms (verification)',
    createLatencySLA: 'p99 < 30s (proof generation)',
  },

  architecturalImplications: [
    'Proof generation is CPU-intensive → Worker cluster with GPUs',
    'Verification is 1000x faster → Can verify on lightweight nodes',
    'Read-heavy (50:1) → Cache verification keys and common proofs',
    'Blockchain storage → Need Web3 integration and IPFS for proof data',
    'Tiny proofs (200 bytes) → Can store millions on-chain affordably',
    'Trusted setup → Need secure key generation and distribution',
  ],

  outOfScope: [
    'Multi-chain deployment',
    'Recursive proof aggregation (advanced)',
    'Hardware acceleration for proof generation',
    'Custom circuit design tools',
    'zk-STARKs (different proof system)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can generate and verify basic ZK proofs. The cryptographic complexity and scaling challenges come in later steps. Privacy first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to ZK Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔐',
  scenario: "Welcome to CryptoAuth Inc! You're building the future of privacy-preserving verification.",
  hook: "A user wants to prove they're over 18 without revealing their birthdate. That's the magic of zero-knowledge proofs!",
  challenge: "Set up the basic system so users can connect to your ZK proof service.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your ZK proof system is online!',
  achievement: 'Users can now send requests to your privacy-preserving service',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Privacy mode', after: 'Zero-Knowledge' },
  ],
  nextTeaser: "But the server doesn't know how to generate proofs yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Zero-Knowledge Proofs: The Foundation of Private Verification',
  conceptExplanation: `**What is a Zero-Knowledge Proof?**

A cryptographic method where you can prove a statement is true WITHOUT revealing why it's true.

**Classic Example: Ali Baba's Cave**
- Cave has a magic door that opens with secret word
- You want to prove you know the secret WITHOUT revealing it
- Verifier waits outside, you enter from random side
- Verifier asks you to exit from specific side
- If you know secret, you can always comply
- Repeat 20 times → 99.9999% certainty you know secret
- Verifier learns NOTHING about the secret itself

**Real-World Example:**
- **Statement**: "I am over 18 years old"
- **Private data**: Birthdate (1995-06-15)
- **ZK Proof**: 200-byte cryptographic proof
- **Verifier learns**: ONLY that age > 18 ✓
- **Verifier does NOT learn**: Birthdate, exact age, anything else`,

  whyItMatters: 'Privacy is a fundamental human right. ZK proofs enable verification without surveillance - prove identity, credentials, or attributes while keeping personal data private.',

  realWorldExample: {
    company: 'Zcash',
    scenario: 'Private cryptocurrency transactions',
    howTheyDoIt: 'Uses ZK-SNARKs to prove transactions are valid (inputs = outputs) without revealing sender, receiver, or amount',
  },

  keyPoints: [
    'Zero-Knowledge: Verifier learns ONLY the statement is true',
    'Soundness: Cannot create fake proofs (cryptographically secure)',
    'Completeness: Valid proofs always verify successfully',
    'Non-interactive: One-shot verification (no back-and-forth)',
  ],

  keyConcepts: [
    { title: 'Prover', explanation: 'User generating the ZK proof', icon: '🧑' },
    { title: 'Verifier', explanation: 'Entity checking the proof', icon: '👁️' },
    { title: 'Witness', explanation: 'Private data known only to prover', icon: '🔒' },
    { title: 'Statement', explanation: 'Public claim being proven', icon: '📝' },
  ],
};

const step1: GuidedStep = {
  id: 'zkp-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Users can connect to the ZK proof service',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users requesting proofs', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles ZK proof requests', displayName: 'ZK Service' },
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
    level2: 'Click the Client, then click the App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement ZK Proof APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your ZK service is connected, but it doesn't know how to generate or verify proofs!",
  hook: "A user sent their birthdate and asked for an age proof. The server returned 404.",
  challenge: "Write the Python code to generate and verify ZK-SNARK proofs.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your ZK proof APIs are live!',
  achievement: 'You implemented cryptographic proof generation and verification',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can generate proofs', after: '✓' },
    { label: 'Can verify proofs', after: '✓' },
  ],
  nextTeaser: "But if the server crashes, all proofs are lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'ZK-SNARKs: Implementation Fundamentals',
  conceptExplanation: `**SNARK = Succinct Non-Interactive Argument of Knowledge**

**Key Components:**

1. **Circuit Definition** (Like a program)
\`\`\`python
# Example: Prove age > 18
def age_circuit(birthdate, current_date):
    age = current_date - birthdate
    assert age > 18  # Constraint
\`\`\`

2. **Trusted Setup** (One-time ceremony)
- Generates proving key (for prover)
- Generates verification key (for verifier)
- Must be secure - if compromised, fake proofs possible

3. **Proof Generation** (Slow, ~5-30 seconds)
\`\`\`python
proof = generate_proof(
    circuit=age_circuit,
    witness={'birthdate': '1995-06-15'},  # Private
    public_input={'current_date': '2024-01-01'}  # Public
)
# Returns: 200-byte proof
\`\`\`

4. **Verification** (Fast, <50ms)
\`\`\`python
is_valid = verify_proof(
    proof=proof,
    public_input={'current_date': '2024-01-01'},
    verification_key=vk
)
# Returns: True/False
\`\`\`

**The Magic:** Proof is tiny (200 bytes) and verification is instant, even though generation involves complex polynomial math!`,

  whyItMatters: 'Understanding the proof lifecycle is critical. Generation is expensive (CPU/GPU intensive), but verification is cheap (anyone can verify instantly).',

  famousIncident: {
    title: 'Zcash Trusted Setup Vulnerability',
    company: 'Zcash',
    year: '2016',
    whatHappened: 'During Zcash\'s initial trusted setup, if the "toxic waste" (secret parameters) had been retained, infinite fake money could have been created. They destroyed it in a secure ceremony with 6 participants.',
    lessonLearned: 'Trusted setup is the weakest link. Modern systems use multi-party computation (MPC) with hundreds/thousands of participants.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Polygon zkEVM',
    scenario: 'Scaling Ethereum with ZK rollups',
    howTheyDoIt: 'Generates proofs of thousands of transactions off-chain, verifies single proof on-chain. 1000x cost reduction!',
  },

  keyPoints: [
    'Circuit defines what statement is being proven',
    'Trusted setup generates proving/verification keys (one-time)',
    'Proof generation is slow but creates tiny proofs',
    'Verification is instant - this asymmetry is the key insight',
  ],

  quickCheck: {
    question: 'Why are ZK-SNARKs called "succinct"?',
    options: [
      'Proof generation is fast',
      'Proofs are tiny (~200 bytes) and verification is instant',
      'They use less memory',
      'They work on any blockchain',
    ],
    correctIndex: 1,
    explanation: 'Succinct means the proof is small and verification is fast, regardless of the complexity of the computation being proven.',
  },

  keyConcepts: [
    { title: 'Circuit', explanation: 'Mathematical constraints defining the proof', icon: '🔌' },
    { title: 'Witness', explanation: 'Private inputs known only to prover', icon: '👀' },
    { title: 'Proof', explanation: 'Cryptographic evidence (200 bytes)', icon: '📜' },
    { title: 'Verification Key', explanation: 'Public key for checking proofs', icon: '🔑' },
  ],
};

const step2: GuidedStep = {
  id: 'zkp-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Generate proofs, FR-2: Verify proofs',
    taskDescription: 'Configure APIs and implement Python handlers for proof generation and verification',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/proofs/generate and POST /api/v1/proofs/verify APIs',
      'Open the Python tab',
      'Implement generate_proof() and verify_proof() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign ZK proof endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement generate_proof() and verify_proof() using a ZK library like libsnark or circom',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/proofs/generate', 'POST /api/v1/proofs/verify'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Proof Storage
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed at 3 AM...",
  hook: "When it restarted, ALL proof records were GONE! Users can't retrieve their verification history. Compliance audits will fail!",
  challenge: "Add a database so proofs and verification events persist.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your proof records are safe!',
  achievement: 'Verification history now persists with audit trail',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Proof durability', after: '100%' },
    { label: 'Audit trail', after: '✓' },
  ],
  nextTeaser: "But proof generation is taking 45 seconds - users are getting impatient...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Why Databases Matter for ZK Systems',
  conceptExplanation: `ZK proof systems need databases for several reasons:

**1. Proof History**
- Store all generated proofs with timestamps
- Enable audit trail for compliance
- Allow users to re-use proofs without regenerating

**2. Verification Keys**
- Store public verification keys for each circuit
- Enable anyone to verify proofs
- Track trusted setup versions

**3. User Metadata**
- Map user IDs to their proofs (but NOT to private data!)
- Enable proof lookup and history queries
- Support non-linkability (can't connect proofs to users)

**Database Schema:**
\`\`\`sql
CREATE TABLE proofs (
    id UUID PRIMARY KEY,
    proof_data BYTEA,  -- 200 bytes
    public_inputs JSONB,
    circuit_id VARCHAR,
    created_at TIMESTAMP,
    user_id_hash VARCHAR  -- Hashed for privacy
);

CREATE TABLE verification_keys (
    circuit_id VARCHAR PRIMARY KEY,
    vk_data BYTEA,
    setup_version INT,
    created_at TIMESTAMP
);
\`\`\`

**Privacy Considerations:**
- NEVER store witness (private) data
- Hash user IDs to prevent linkability
- Store only proof + public inputs`,

  whyItMatters: 'Without persistence, every proof must be regenerated (expensive!). Database enables proof reuse and compliance auditing.',

  famousIncident: {
    title: 'Aztec Network Proof Cache Failure',
    company: 'Aztec (ZK Rollup)',
    year: '2022',
    whatHappened: 'A database failure caused proof generation servers to lose all cached proofs. Users had to regenerate proofs, causing 3-hour delays and CPU overload. Cost: $50K in wasted compute.',
    lessonLearned: 'Proof generation is expensive. Always persist proofs and implement aggressive caching.',
    icon: '🔥',
  },

  realWorldExample: {
    company: 'zkSync',
    scenario: 'Storing millions of transaction proofs',
    howTheyDoIt: 'Uses PostgreSQL for proof metadata + IPFS for large proof batches. Enables efficient proof aggregation and verification.',
  },

  keyPoints: [
    'Store proofs and verification keys, NEVER witness data',
    'Enable proof reuse - generation is expensive',
    'Audit trail is critical for compliance',
    'Hash user IDs to maintain privacy and non-linkability',
  ],

  quickCheck: {
    question: 'What should NEVER be stored in the ZK proof database?',
    options: [
      'Public inputs',
      'Proof data',
      'Witness (private) data',
      'Verification keys',
    ],
    correctIndex: 2,
    explanation: 'Witness data is private - storing it would defeat the entire purpose of zero-knowledge proofs!',
  },

  keyConcepts: [
    { title: 'Proof Metadata', explanation: 'Public data about proof (inputs, timestamp)', icon: '📋' },
    { title: 'Witness', explanation: 'Private data - NEVER stored', icon: '🚫' },
    { title: 'Non-linkability', explanation: 'Can\'t connect proofs to same user', icon: '🔗' },
  ],
};

const step3: GuidedStep = {
  id: 'zkp-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-4: Query proof history requires persistent storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store proofs, verification keys, audit trail', displayName: 'PostgreSQL' },
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
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Worker Cluster for Proof Generation
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Users are complaining! Proof generation takes 45 seconds and blocks the API.",
  hook: "During peak hours, users wait 5+ minutes for their proofs. Some give up and leave. Your CPU is at 100% constantly.",
  challenge: "Offload proof generation to a dedicated worker cluster with GPUs.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Proof generation is now parallel and fast!',
  achievement: 'Worker cluster handles compute-intensive proof generation',
  metrics: [
    { label: 'Proof generation time', before: '45s', after: '8s (with GPU)' },
    { label: 'Concurrent proofs', before: '1', after: '50+' },
    { label: 'API responsiveness', before: 'Blocked', after: 'Instant' },
  ],
  nextTeaser: "But how do we coordinate between API servers and workers?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Proof Generation: Worker Clusters and Hardware Acceleration',
  conceptExplanation: `**The Problem:**
Proof generation is CPU-intensive:
- Polynomial evaluation (10,000+ terms)
- Elliptic curve operations (cryptography)
- Fast Fourier Transforms (FFT)
- Takes 5-45 seconds per proof on CPU

**The Solution: Worker Cluster**

**Architecture:**
\`\`\`
Client Request
     ↓
API Server (instant response: "Generating...")
     ↓
Message Queue (async job)
     ↓
Worker Cluster
  ├─ Worker 1 (GPU) → Proof generation
  ├─ Worker 2 (GPU) → Proof generation
  └─ Worker N (GPU) → Proof generation
     ↓
Store proof in Database
     ↓
Notify client (webhook or polling)
\`\`\`

**Hardware Acceleration:**
1. **CPU**: 45 seconds per proof
2. **GPU**: 8 seconds per proof (5-6x faster)
3. **FPGA**: 2 seconds per proof (specialized hardware)
4. **ASIC**: <1 second (custom chips, very expensive)

**Why GPUs Win:**
- Parallel computation (thousands of cores)
- Good for elliptic curve math
- Cost-effective (~$1,000 vs $50,000 for FPGA)
- Flexible (can run different circuits)

**Real Numbers (Age Verification Proof):**
- CPU (8 cores): ~45s
- GPU (NVIDIA A100): ~8s
- Cost: $3/hour for A100 on AWS
- Throughput: 450 proofs/hour per GPU`,

  whyItMatters: 'Proof generation is the bottleneck. Without worker clusters, your system can\'t scale beyond a few proofs per minute.',

  famousIncident: {
    title: 'Tornado Cash Proof Generation Overload',
    company: 'Tornado Cash',
    year: '2021',
    whatHappened: 'During a surge in privacy-seeking users, their proof generation servers were overwhelmed. Wait times exceeded 10 minutes. Users couldn\'t withdraw funds. The team had to emergency-scale GPU workers.',
    lessonLearned: 'Proof generation MUST be async and horizontally scalable with worker pools.',
    icon: '🌪️',
  },

  realWorldExample: {
    company: 'StarkWare (StarkEx)',
    scenario: 'Generating proofs for 500K+ trades per day',
    howTheyDoIt: 'Uses clusters of GPU workers with custom STARK proof generation optimized for parallelization',
  },

  diagram: `
┌──────────┐
│  Client  │
└────┬─────┘
     │ POST /api/v1/proofs/generate
     ▼
┌──────────────┐
│  API Server  │ → Returns: {"job_id": "abc123", "status": "pending"}
└──────┬───────┘
       │ Publish job to queue
       ▼
┌────────────────┐
│ Message Queue  │
└────────┬───────┘
         │
    ┌────┴──────┬──────────┬──────────┐
    ▼           ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│Worker 1 │ │Worker 2 │ │Worker 3 │ │Worker N │
│ (GPU)   │ │ (GPU)   │ │ (GPU)   │ │ (GPU)   │
└────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
     │           │          │          │
     └───────────┴──────────┴──────────┘
                 │
                 ▼
           ┌──────────┐
           │ Database │ → Store proof
           └──────────┘
`,

  keyPoints: [
    'Proof generation is CPU/GPU intensive - must be async',
    'Worker cluster enables horizontal scaling',
    'GPUs provide 5-6x speedup over CPUs',
    'Message queue decouples API from proof generation',
    'Each worker can run multiple circuits in parallel',
  ],

  quickCheck: {
    question: 'Why are GPUs faster than CPUs for ZK proof generation?',
    options: [
      'GPUs have more memory',
      'GPUs excel at parallel computations like elliptic curve operations',
      'GPUs are cheaper',
      'GPUs use less power',
    ],
    correctIndex: 1,
    explanation: 'GPUs have thousands of cores for parallel math operations, which is exactly what ZK proof generation requires.',
  },

  keyConcepts: [
    { title: 'Worker Cluster', explanation: 'Pool of servers dedicated to proof generation', icon: '🏭' },
    { title: 'GPU Acceleration', explanation: 'Using graphics cards for crypto math', icon: '🎮' },
    { title: 'Async Jobs', explanation: 'Non-blocking proof generation via queue', icon: '📨' },
  ],
};

const step4: GuidedStep = {
  id: 'zkp-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Generate proofs at scale requires worker cluster',
    taskDescription: 'Add Message Queue and Worker cluster for async proof generation',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Queue proof generation jobs', displayName: 'Message Queue' },
      { type: 'worker', reason: 'GPU workers for proof generation', displayName: 'Proof Workers' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Worker component added',
      'App Server connected to Message Queue',
      'Workers connected to Message Queue',
      'Workers connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'worker'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Message Queue and Worker components, connect App Server → Queue and Worker → Queue → Database',
    level2: 'Workers pull jobs from queue, generate proofs with GPUs, store in database',
    solutionComponents: [{ type: 'message_queue' }, { type: 'worker' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'worker', to: 'message_queue' },
      { from: 'worker', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Cache for Verification Keys and Common Proofs
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐢',
  scenario: "Verification is fast in theory, but your database is becoming a bottleneck!",
  hook: "Every verification hits the database to fetch the verification key. At 2,895 verifications/second peak, your database is overwhelmed!",
  challenge: "Add a cache for verification keys and frequently-verified proofs.",
  illustration: 'slow-database',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Verification is now instant!',
  achievement: 'Cache eliminates database bottleneck for verifications',
  metrics: [
    { label: 'Verification latency', before: '150ms', after: '8ms' },
    { label: 'Cache hit rate', after: '98%' },
    { label: 'Database load', before: '2,895 qps', after: '58 qps' },
  ],
  nextTeaser: "But what about storing proofs immutably on a blockchain?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Accelerating Verification at Scale',
  conceptExplanation: `**The Verification Bottleneck:**

Verification requires:
1. Fetch verification key from database (~100ms)
2. Perform cryptographic verification (~8ms)
3. Total: ~108ms per verification

At 2,895 verifications/second peak, that's 2,895 database queries/second!

**Cache Strategy:**

**What to Cache:**
1. **Verification Keys** (high priority)
   - Small (~2KB per circuit)
   - Rarely change (only on trusted setup updates)
   - Cache forever (or until version changes)

2. **Proof Results** (medium priority)
   - Cache verification result for 1 hour
   - Prevents redundant cryptographic operations
   - Key: hash(proof + public_inputs)

3. **Public Inputs** (low priority)
   - For audit trail queries
   - Cache for 15 minutes

**Architecture:**
\`\`\`
Verification Request
       ↓
Check cache: vk_<circuit_id>?
       ↓
  ┌────┴─────┐
  │          │
HIT          MISS
  │          │
  ▼          ▼
Return    Fetch from DB
            Store in cache
            Return
\`\`\`

**Performance Impact:**
- Without cache: 108ms average (2ms-200ms range)
- With cache: 8ms average (1ms-15ms range)
- Cache hit rate: 98%+
- Database load reduction: 50x

**Redis Configuration:**
\`\`\`python
# Verification key (never expires)
redis.set(f"vk:{circuit_id}", vk_data)

# Proof result (1 hour TTL)
proof_hash = hash(proof + public_inputs)
redis.setex(f"proof_result:{proof_hash}", 3600, result)

# Public inputs (15 min TTL)
redis.setex(f"inputs:{proof_id}", 900, public_inputs)
\`\`\``,

  whyItMatters: 'Without caching, verification latency is dominated by database queries. Cache enables <10ms verification times needed for real-time privacy checks.',

  famousIncident: {
    title: 'Polygon zkEVM Cache Failure',
    company: 'Polygon',
    year: '2023',
    whatHappened: 'A Redis cache failure caused all verification key lookups to hit the database. Verification times jumped from 10ms to 200ms. The entire rollup slowed down, causing 30-minute transaction delays.',
    lessonLearned: 'Caching isn\'t optional for ZK systems at scale. Always have cache redundancy.',
    icon: '🔴',
  },

  realWorldExample: {
    company: 'zkSync Era',
    scenario: 'Verifying 10,000+ proofs per minute',
    howTheyDoIt: 'Uses Redis clusters to cache verification keys and proof results, reducing database load by 95%',
  },

  diagram: `
┌───────────────┐
│ Verification  │
│   Request     │
└───────┬───────┘
        │
        ▼
┌────────────────┐
│  Cache Check   │
│  Redis Lookup  │
└───────┬────────┘
        │
   ┌────┴────┐
   │         │
  HIT       MISS
   │         │
   │         ▼
   │    ┌──────────┐
   │    │ Database │
   │    │  Query   │
   │    └────┬─────┘
   │         │
   │         ▼
   │    ┌──────────┐
   │    │  Update  │
   │    │  Cache   │
   │    └────┬─────┘
   │         │
   └─────────┴──────▶ Verify Proof (8ms)
                          ↓
                      Return Result
`,

  keyPoints: [
    'Cache verification keys - they rarely change',
    'Cache proof results to avoid redundant crypto operations',
    'Use Redis for sub-millisecond lookups',
    'Set appropriate TTLs based on data volatility',
    '98%+ cache hit rate eliminates database bottleneck',
  ],

  quickCheck: {
    question: 'What is the primary benefit of caching verification keys?',
    options: [
      'Saves database storage space',
      'Reduces verification latency from 100ms to 8ms by eliminating DB queries',
      'Makes proofs more secure',
      'Reduces proof generation time',
    ],
    correctIndex: 1,
    explanation: 'Verification keys are fetched for every verification. Caching them eliminates slow database queries, making verification nearly instant.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - instant response', icon: '✅' },
    { title: 'TTL', explanation: 'Time-To-Live - cache expiration time', icon: '⏰' },
    { title: 'Cache Warming', explanation: 'Preload cache with common keys', icon: '🔥' },
  ],
};

const step5: GuidedStep = {
  id: 'zkp-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast verification requires caching',
    taskDescription: 'Add Redis cache for verification keys and proof results',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache verification keys and proof results', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache strategy configured (cache-aside)',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'worker', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'database' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add a Redis Cache component and connect it to the App Server',
    level2: 'Configure cache with cache-aside strategy. Cache verification keys with no TTL, proof results with 1-hour TTL',
    solutionComponents: [{ type: 'cache', config: { strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Add Blockchain for Immutable Proof Storage
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⛓️',
  scenario: "A regulator asks: 'How do we know you didn't tamper with proof records?'",
  hook: "Your database could be modified. Timestamps could be altered. There's no cryptographic guarantee that proofs are authentic.",
  challenge: "Integrate with a blockchain to create an immutable audit trail of all verifications.",
  illustration: 'blockchain',
};

const step6Celebration: CelebrationContent = {
  emoji: '🔗',
  message: 'Proofs are now immutably stored on-chain!',
  achievement: 'Blockchain integration provides cryptographic proof of verification history',
  metrics: [
    { label: 'Proof immutability', after: 'Guaranteed' },
    { label: 'Tamper resistance', after: 'Cryptographic' },
    { label: 'Decentralization', after: '✓' },
  ],
  nextTeaser: "But blockchain storage is expensive for large datasets...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Blockchain Integration: Immutable Proof Registry',
  conceptExplanation: `**Why Blockchain for ZK Proofs?**

Blockchains provide unique guarantees:

1. **Immutability**
   - Once written, data cannot be altered
   - Cryptographically secured via hash chains
   - Any tampering is immediately detectable

2. **Transparency**
   - Anyone can verify proofs were created
   - Public audit trail of all verifications
   - No trusted intermediary required

3. **Timestamping**
   - Cryptographic proof of WHEN verification occurred
   - Critical for compliance and dispute resolution
   - Block timestamp is consensus-verified

4. **Decentralization**
   - No single point of control
   - Survives company failure
   - Censorship resistant

**Smart Contract Architecture:**

\`\`\`solidity
contract ZKProofRegistry {
    struct ProofRecord {
        bytes32 proofHash;      // Hash of proof data
        bytes32 publicInputsHash;
        uint256 timestamp;
        address verifier;
    }

    mapping(bytes32 => ProofRecord) public proofs;

    event ProofVerified(
        bytes32 indexed proofHash,
        address indexed verifier,
        uint256 timestamp
    );

    function registerProof(
        bytes32 proofHash,
        bytes32 publicInputsHash
    ) external {
        require(proofs[proofHash].timestamp == 0, "Exists");

        proofs[proofHash] = ProofRecord({
            proofHash: proofHash,
            publicInputsHash: publicInputsHash,
            timestamp: block.timestamp,
            verifier: msg.sender
        });

        emit ProofVerified(proofHash, msg.sender, block.timestamp);
    }
}
\`\`\`

**Storage Strategy:**

- **On-chain**: Proof hash (32 bytes) + metadata
- **Off-chain (IPFS)**: Full proof data (200 bytes) + public inputs
- **Database**: Metadata + IPFS CID for fast queries

**Cost Optimization:**
- Don't store full proof on-chain (expensive!)
- Store hash on-chain (32 bytes ~ $0.001)
- Store full data on IPFS (decentralized, cheap)
- Use events for cheap queries`,

  whyItMatters: 'Blockchain transforms your ZK system from "trust the company" to "verify the cryptography". Critical for compliance, legal disputes, and decentralized applications.',

  famousIncident: {
    title: 'WorldCoin Proof Manipulation Scare',
    company: 'WorldCoin',
    year: '2023',
    whatHappened: 'Concerns were raised that WorldCoin\'s proof-of-personhood proofs could be manipulated since they were stored in a centralized database. They moved to blockchain storage for immutability.',
    lessonLearned: 'For high-stakes ZK applications, blockchain storage is essential for trust.',
    icon: '🌍',
  },

  realWorldExample: {
    company: 'Polygon ID',
    scenario: 'Decentralized identity verification',
    howTheyDoIt: 'Stores ZK proof verification events on Polygon blockchain, enabling permissionless verification of credentials',
  },

  diagram: `
┌──────────────┐
│ Proof Verify │
│   Success    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│  1. Store full proof in IPFS     │
│     Returns: ipfs://Qm...abc     │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  2. Compute proof hash           │
│     hash = keccak256(proof)      │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  3. Write to blockchain          │
│     Smart contract stores:       │
│     - Proof hash                 │
│     - Public inputs hash         │
│     - Timestamp                  │
│     - Verifier address           │
│     Cost: ~$0.001                │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  4. Store metadata in database   │
│     - Proof ID                   │
│     - IPFS CID                   │
│     - Blockchain tx hash         │
│     - For fast queries           │
└──────────────────────────────────┘
`,

  keyPoints: [
    'Blockchain provides immutability and transparency',
    'Store proof hash on-chain (cheap), full data on IPFS',
    'Smart contract emits events for efficient querying',
    'Decentralization removes single point of trust',
    'Critical for compliance and legal validity of proofs',
  ],

  quickCheck: {
    question: 'Why store only the proof hash on-chain instead of the full proof?',
    options: [
      'Full proofs are too large and expensive to store on-chain',
      'Hashes are more secure',
      'Blockchains can\'t store binary data',
      'Privacy concerns',
    ],
    correctIndex: 0,
    explanation: 'Blockchain storage is expensive (~$0.10 per KB). Storing a 32-byte hash costs $0.001 vs $0.02 for a 200-byte proof.',
  },

  keyConcepts: [
    { title: 'Smart Contract', explanation: 'On-chain program storing proof registry', icon: '📜' },
    { title: 'IPFS', explanation: 'Decentralized storage for full proof data', icon: '🗄️' },
    { title: 'Immutability', explanation: 'Data cannot be altered once written', icon: '🔒' },
    { title: 'Proof Hash', explanation: 'Cryptographic fingerprint of proof', icon: '#️⃣' },
  ],
};

const step6: GuidedStep = {
  id: 'zkp-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Store proofs immutably on blockchain',
    taskDescription: 'Add blockchain integration for proof registry',
    componentsNeeded: [
      { type: 'blockchain', reason: 'Immutable proof storage and audit trail', displayName: 'Ethereum' },
      { type: 'storage', reason: 'IPFS for full proof data', displayName: 'IPFS' },
    ],
    successCriteria: [
      'Blockchain component added',
      'Storage (IPFS) component added',
      'App Server connected to Blockchain',
      'App Server connected to Storage',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'message_queue', 'worker', 'cache', 'blockchain', 'storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'blockchain' },
      { fromType: 'app_server', toType: 'storage' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'database' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Blockchain (Ethereum) and Storage (IPFS) components',
    level2: 'Connect App Server to both. Proofs are stored in IPFS, proof hashes are stored on-chain via smart contract',
    solutionComponents: [{ type: 'blockchain' }, { type: 'storage' }],
    solutionConnections: [
      { from: 'app_server', to: 'blockchain' },
      { from: 'app_server', to: 'storage' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Load Balancer for API Scaling
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your ZK system went viral! A major DeFi protocol integrated your privacy verification.",
  hook: "Traffic spiked 50x overnight! Your single API server is at 100% CPU, requests are timing out.",
  challenge: "Add a load balancer to distribute traffic across multiple API servers.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'API layer is now horizontally scalable!',
  achievement: 'Load balancer enables handling massive verification traffic',
  metrics: [
    { label: 'API capacity', before: '100 req/s', after: '2,895+ req/s' },
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Failover', after: 'Automatic' },
  ],
  nextTeaser: "But we still only have one API server instance...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Scaling Verification APIs',
  conceptExplanation: `**The Scaling Challenge:**

At peak traffic (2,895 verifications/second):
- Single server: ~500 req/s max
- Need: 6+ servers to handle load
- Must distribute traffic evenly

**Load Balancer Architecture:**

\`\`\`
         ┌─────────────┐
         │Load Balancer│
         │   (nginx)   │
         └──────┬──────┘
                │
     ┌──────────┼──────────┬──────────┐
     │          │          │          │
     ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ API 1  │ │ API 2  │ │ API 3  │ │ API N  │
│ (VMs)  │ │ (VMs)  │ │ (VMs)  │ │ (VMs)  │
└────────┘ └────────┘ └────────┘ └────────┘
\`\`\`

**Routing Algorithms:**

1. **Round Robin** (simple, fair)
   - Request 1 → Server 1
   - Request 2 → Server 2
   - Request 3 → Server 3
   - Repeat

2. **Least Connections** (better for ZK)
   - Route to server with fewest active connections
   - Good for varying request times

3. **IP Hash** (session affinity)
   - Same client → same server
   - Useful for caching per-server

**For ZK Systems:**
- Use **Least Connections** - verification times vary
- Health checks every 5 seconds
- Auto-remove failed servers
- SSL termination at load balancer

**Configuration:**
\`\`\`nginx
upstream zk_api_servers {
    least_conn;
    server api1:3000 max_fails=3 fail_timeout=30s;
    server api2:3000 max_fails=3 fail_timeout=30s;
    server api3:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 443 ssl;
    location /api/v1/proofs {
        proxy_pass http://zk_api_servers;
    }
}
\`\`\``,

  whyItMatters: 'Single API server = single point of failure and capacity limit. Load balancer enables horizontal scaling and high availability.',

  famousIncident: {
    title: 'Scroll zkEVM Launch Overload',
    company: 'Scroll',
    year: '2023',
    whatHappened: 'At mainnet launch, their API servers were overwhelmed with verification requests. They had load balancers but insufficient API server capacity. Many requests timed out.',
    lessonLearned: 'Load balancer is necessary but not sufficient - must also scale underlying servers.',
    icon: '📜',
  },

  realWorldExample: {
    company: 'Aztec Network',
    scenario: 'Handling 10,000+ verification requests per minute',
    howTheyDoIt: 'Uses AWS Application Load Balancer with auto-scaling groups of API servers',
  },

  keyPoints: [
    'Load balancer distributes traffic across multiple servers',
    'Enables horizontal scaling (add more servers)',
    'Provides high availability (automatic failover)',
    'Use least-connections for ZK (varying verification times)',
    'Health checks automatically remove failed servers',
  ],

  quickCheck: {
    question: 'Why use "least connections" routing for ZK verification APIs?',
    options: [
      'It\'s the fastest algorithm',
      'Verification times vary - prevents overloading busy servers',
      'It\'s required for blockchain integration',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'ZK verification times vary based on circuit complexity. Least-connections prevents routing to already-busy servers.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Health Check', explanation: 'Monitor server availability', icon: '💓' },
    { title: 'Failover', explanation: 'Automatic switch to healthy servers', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'zkp-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Fast verification at scale requires load balancing',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute verification traffic across API servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'worker', 'cache', 'blockchain', 'storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'blockchain' },
      { fromType: 'app_server', toType: 'storage' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'database' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Load Balancer component between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Database Replication for High Availability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Database crashed. ALL proof queries failing.",
  hook: "Your database server had a disk failure. No proof history available. Compliance auditors are demanding answers. This is a disaster!",
  challenge: "Add database replication to ensure proof records survive failures.",
  illustration: 'database-failure',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Proof records are now fault-tolerant!',
  achievement: 'Database replication ensures data survives failures',
  metrics: [
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Data loss risk', before: 'High', after: 'Near zero' },
    { label: 'Failover time', before: 'Manual', after: 'Automatic' },
  ],
  nextTeaser: "Now let's optimize costs while maintaining performance...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Ensuring Proof Data Durability',
  conceptExplanation: `**Why Replication for ZK Systems?**

Proof history is critical:
- Compliance audits require historical data
- Users need to retrieve old proofs
- Legal disputes may reference old verifications
- Losing proof data = losing trust

**Replication Strategy:**

For ZK proof systems, use **Single-Leader Replication**:

\`\`\`
                    ┌──────────────┐
                    │   Primary    │
                    │  (Writes)    │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │ Replica 1│   │ Replica 2│   │ Replica 3│
      │  (Reads) │   │  (Reads) │   │  (Reads) │
      └──────────┘   └──────────┘   └──────────┘
\`\`\`

**Configuration:**
- **Async replication**: Acceptable for proof history
- **3 replicas**: 2 in same region, 1 in different region
- **Read queries**: Route to replicas (99% of traffic)
- **Write queries**: Route to primary only

**Why Async is OK:**
- Proofs are immutable once created
- Blockchain provides source of truth
- Slight replication lag (1-2 seconds) acceptable
- Much faster than sync replication

**Failover Strategy:**
1. Health check detects primary failure
2. Promote replica with most recent data
3. Update DNS/connection string
4. Automatic in <60 seconds

**Data Safety:**
- Even with async, WAL (Write-Ahead Log) ensures durability
- Maximum data loss: 1-2 seconds of proofs
- Blockchain has hashes for verification`,

  whyItMatters: 'Without replication, a single disk failure loses ALL proof history. For compliance-critical systems, this is unacceptable.',

  famousIncident: {
    title: 'zkSync Database Outage',
    company: 'zkSync',
    year: '2022',
    whatHappened: 'Their primary database had a hardware failure. Fortunately they had replicas, but failover was manual and took 45 minutes. During that time, users couldn\'t query proof history.',
    lessonLearned: 'Automatic failover is critical. Manual intervention during incidents is too slow.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Polygon zkEVM',
    scenario: 'Storing millions of proof verification events',
    howTheyDoIt: 'PostgreSQL with 3 replicas (2 same-region, 1 cross-region) and automatic failover via Patroni',
  },

  keyPoints: [
    'Single-leader replication: Primary for writes, replicas for reads',
    'Async replication is acceptable (proofs are immutable)',
    '3 replicas: 2 same-region, 1 cross-region for disaster recovery',
    'Automatic failover in <60 seconds',
    'Blockchain provides ultimate source of truth',
  ],

  quickCheck: {
    question: 'Why is async replication acceptable for ZK proof systems?',
    options: [
      'It\'s faster and proofs are immutable once created',
      'It\'s cheaper',
      'It uses less disk space',
      'It\'s required by blockchain',
    ],
    correctIndex: 0,
    explanation: 'Async replication is faster, and since proofs don\'t change after creation, slight replication lag (1-2s) doesn\'t affect correctness.',
  },

  keyConcepts: [
    { title: 'Primary', explanation: 'Database server handling all writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy of database', icon: '📋' },
    { title: 'Failover', explanation: 'Automatic promotion of replica to primary', icon: '🔄' },
    { title: 'Replication Lag', explanation: 'Time delay between primary and replica', icon: '⏱️' },
  ],
};

const step8: GuidedStep = {
  id: 'zkp-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Proof history queries require high availability',
    taskDescription: 'Enable database replication with 2+ replicas',
    successCriteria: [
      'Click on Database component',
      'Enable replication',
      'Set replica count to 2 or more',
      'Configure async replication mode',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'worker', 'cache', 'blockchain', 'storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'blockchain' },
      { fromType: 'app_server', toType: 'storage' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click on Database component and find replication settings',
    level2: 'Enable replication, set replicas to 2+, choose async mode for performance',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2, mode: 'async' } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Scale Worker Instances for Peak Load
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🚀',
  scenario: "You've built the infrastructure, but now let's optimize for peak load!",
  hook: "During an airdrop event, proof generation requests spiked to 58 per second. Your single worker is drowning!",
  challenge: "Scale your worker cluster to handle peak proof generation load.",
  illustration: 'scaling-workers',
};

const step9Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Worker cluster is scaled for peak load!',
  achievement: 'Your system can now handle massive proof generation spikes',
  metrics: [
    { label: 'Proof generation capacity', before: '7.5 proofs/min', after: '450 proofs/min' },
    { label: 'Worker instances', before: '1', after: '6 (with GPU)' },
    { label: 'Peak load handling', after: '✓' },
  ],
  nextTeaser: "Finally, let's optimize costs and verify all requirements are met...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Capacity Planning: Scaling ZK Proof Generation',
  conceptExplanation: `**Capacity Planning for ZK Workers:**

**Requirements Analysis:**
- Peak load: 58 proofs/second
- Proof generation time: 8 seconds (with GPU)
- Throughput per GPU worker: 7.5 proofs/min (450 proofs/hour)

**Calculation:**
\`\`\`
Required capacity = Peak RPS × Avg generation time
                  = 58 proofs/sec × 8 sec
                  = 464 concurrent proofs

Workers needed = 464 concurrent / 60 proofs per worker
               = ~8 workers minimum

With safety margin (2x): 16 workers for peak
With normal load: 6 workers sufficient
\`\`\`

**Auto-Scaling Strategy:**
\`\`\`yaml
workers:
  min: 2  # Always-on for availability
  max: 16 # Peak capacity
  target_queue_depth: 10  # Scale up if queue > 10
  scale_up_threshold: 80%  # CPU/GPU utilization
  scale_down_threshold: 20%
  cooldown: 300s  # Wait 5 min before scaling again
\`\`\`

**Cost Optimization:**
- Use **spot instances** for workers (70% cheaper)
- Can tolerate interruption (job requeues)
- Mix: 50% spot + 50% on-demand for stability

**Hardware Selection:**
- **NVIDIA T4**: $0.35/hour, 8s per proof
- **NVIDIA A100**: $3.00/hour, 3s per proof
- **Sweet spot**: T4 for normal, A100 for peak

**Real Numbers:**
\`\`\`
Configuration: 6 × T4 workers
Cost: 6 × $0.35 × 24hrs = $50/day
Capacity: 6 × 7.5 = 45 proofs/min
Handles: Normal load (12 proofs/sec avg)

Peak config: 16 × T4 workers (auto-scale)
Cost: +$84/day during peaks
Capacity: 120 proofs/min
Handles: Peak load (58 proofs/sec)
\`\`\``,

  whyItMatters: 'Under-provisioned workers = long delays and frustrated users. Over-provisioned = wasted money. Auto-scaling finds the balance.',

  realWorldExample: {
    company: 'StarkWare',
    scenario: 'Processing 500K+ transactions/day into ZK proofs',
    howTheyDoIt: 'Auto-scaling GPU worker fleet (20-200 instances) based on transaction queue depth',
  },

  keyPoints: [
    'Calculate workers needed: peak_rps × generation_time',
    'Use auto-scaling for cost efficiency',
    'Mix spot and on-demand instances for reliability',
    'GPU choice: T4 for normal, A100 for peak performance',
    'Monitor queue depth to trigger scaling',
  ],

  quickCheck: {
    question: 'If each GPU worker generates 7.5 proofs/min and peak load is 58 proofs/sec, how many workers needed?',
    options: [
      '6 workers',
      '8 workers minimum, 16 with safety margin',
      '2 workers',
      '100 workers',
    ],
    correctIndex: 1,
    explanation: '58 proofs/sec × 60 sec = 3,480 proofs/min. Divide by 7.5 = 464 workers theoretically, but in practice ~8 min with queue buffering, 16 with safety margin.',
  },

  keyConcepts: [
    { title: 'Auto-Scaling', explanation: 'Dynamically adjust worker count based on load', icon: '📊' },
    { title: 'Spot Instances', explanation: 'Cheaper compute that can be interrupted', icon: '💰' },
    { title: 'Queue Depth', explanation: 'Number of pending jobs waiting for workers', icon: '📋' },
  ],
};

const step9: GuidedStep = {
  id: 'zkp-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-1: Generate proofs at peak load requires scaled workers',
    taskDescription: 'Configure worker instances to handle peak load',
    successCriteria: [
      'Click on Worker component',
      'Set instance count to 6+ for peak load handling',
      'Verify workers can handle 58 proofs/second peak',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'worker', 'cache', 'blockchain', 'storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'blockchain' },
      { fromType: 'app_server', toType: 'storage' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on Worker component and increase instance count to 6+',
    level2: 'With 6 GPU workers (T4), you can handle ~45 proofs/min which covers peak load with buffering',
    solutionComponents: [{ type: 'worker', config: { instances: 6 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Final Optimization and Cost Management
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💰',
  scenario: "The CFO reviews your architecture: 'Infrastructure is costing $15K/month!'",
  hook: "You need to optimize costs while maintaining all privacy guarantees and performance SLAs.",
  challenge: "Final step: Optimize your ZK system for cost efficiency while meeting all requirements.",
  illustration: 'cost-optimization',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production ZK system!',
  achievement: 'Privacy-preserving verification at scale with cost optimization',
  metrics: [
    { label: 'Monthly cost', before: '$15K', after: '<$8K' },
    { label: 'Proof generation', after: '<30s p99' },
    { label: 'Verification latency', after: '<50ms p99' },
    { label: 'Availability', after: '99.9%+' },
    { label: 'Privacy', after: 'Zero-Knowledge ✓' },
  ],
  nextTeaser: "You've mastered ZK-SNARK system design! Try building a zkEVM rollup next!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Efficient ZK Infrastructure',
  conceptExplanation: `**ZK System Cost Breakdown:**

\`\`\`
Component               Cost/Month    Optimization
─────────────────────────────────────────────────
GPU Workers (6 × T4)    $1,500       Use spot instances (-70%)
API Servers (3)         $450         Right-size instances
Database + Replicas     $600         Use managed service
Cache (Redis)           $200         Single instance sufficient
Load Balancer           $50          Managed LB
Blockchain (Ethereum)   $2,000       Use L2 (Polygon) (-90%)
IPFS Storage           $100         Use Filecoin (-50%)
Message Queue          $150         Managed Kafka
─────────────────────────────────────────────────
Total (optimized)      ~$5,050/month
\`\`\`

**Optimization Strategies:**

**1. Use Spot Instances for Workers** (Save 70%)
- Workers are fault-tolerant (jobs requeue)
- Mix: 50% spot + 50% on-demand
- Savings: $1,050/month

**2. Blockchain Optimization** (Save 90%)
- Use Layer 2 (Polygon, Arbitrum) instead of Ethereum mainnet
- Cost: $0.001 per proof vs $0.01 on mainnet
- Savings: $1,800/month

**3. Aggressive Caching** (Reduce DB costs)
- Cache verification keys (never expire)
- Cache proof results (1 hour TTL)
- Reduces DB queries by 95%
- Enables smaller DB instance

**4. Auto-Scaling Everything**
- Scale workers based on queue depth
- Scale API servers based on traffic
- Only pay for what you use

**5. Archive Old Proofs**
- Move proofs >90 days to cold storage
- S3 Glacier: $0.004/GB vs $0.023/GB
- Blockchain maintains hashes (immutability)

**Final Architecture Cost:**
\`\`\`
- GPU Workers (spot): $450/month
- API Servers: $450/month
- Database: $600/month
- Cache: $200/month
- Polygon L2: $200/month
- IPFS/Filecoin: $50/month
- Message Queue: $150/month
- Load Balancer: $50/month
─────────────────────────────────
Total: ~$2,150/month
\`\`\`

**Performance Maintained:**
- Proof generation: <30s p99
- Verification: <50ms p99
- Availability: 99.9%+
- Privacy: Zero-Knowledge guaranteed`,

  whyItMatters: 'ZK systems are compute-intensive and can be expensive. Smart optimization reduces costs 70% while maintaining all guarantees.',

  realWorldExample: {
    company: 'Aztec Network',
    scenario: 'Reducing ZK rollup costs',
    howTheyDoIt: 'Moved from Ethereum mainnet to optimized proof aggregation + L2 deployment. Cut costs by 80% while increasing throughput.',
  },

  keyPoints: [
    'Use spot instances for stateless workers (70% savings)',
    'Deploy on Layer 2 blockchains (90% cheaper than Ethereum)',
    'Aggressive caching reduces database load and costs',
    'Auto-scale everything to only pay for what you use',
    'Archive old data to cold storage',
  ],

  quickCheck: {
    question: 'What is the biggest cost optimization for a ZK proof system?',
    options: [
      'Remove database replication',
      'Use Layer 2 blockchain and spot instances for workers',
      'Reduce cache size',
      'Use only 1 API server',
    ],
    correctIndex: 1,
    explanation: 'L2 reduces blockchain costs 90%, spot instances reduce compute costs 70%. These are the largest expense categories.',
  },

  keyConcepts: [
    { title: 'Spot Instances', explanation: 'Cheaper compute for fault-tolerant workloads', icon: '💰' },
    { title: 'Layer 2', explanation: 'Cheaper blockchain with same security', icon: '⛓️' },
    { title: 'Cold Storage', explanation: 'Cheap archival for old data', icon: '🧊' },
  ],
};

const step10: GuidedStep = {
  id: 'zkp-step-10',
  stepNumber: 10,
  frIndex: 5,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs met with optimized cost structure',
    taskDescription: 'Review and optimize your complete ZK system architecture',
    successCriteria: [
      'All components properly configured',
      'Database replication enabled',
      'Worker instances scaled appropriately',
      'Caching strategy optimized',
      'Total estimated cost under $8K/month',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'message_queue', 'worker', 'cache', 'blockchain', 'storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'blockchain' },
      { fromType: 'app_server', toType: 'storage' },
      { fromType: 'worker', toType: 'message_queue' },
      { fromType: 'worker', to: 'database' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireMultipleAppInstances: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review all component configurations for optimization opportunities',
    level2: 'Ensure: DB replication (2+), Cache strategy (cache-aside), Worker instances (6+), API instances (2+)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l6PrivacyZkpInternetGuidedTutorial: GuidedTutorial = {
  problemId: 'l6-privacy-zkp-internet',
  title: 'Zero-Knowledge Proofs Internet',
  description: 'Build a privacy-preserving verification system using ZK-SNARKs, blockchain, and distributed proof generation',
  difficulty: 'expert',
  estimatedMinutes: 90,

  welcomeStory: {
    emoji: '🔐',
    hook: "You've been hired as Lead Cryptography Engineer at CryptoAuth Inc!",
    scenario: "Your mission: Build a zero-knowledge proof system that enables privacy-preserving verification at internet scale.",
    challenge: "Can you design a system that proves statements are true without revealing ANY private data?",
  },

  requirementsPhase: zkpRequirementsPhase,

  totalSteps: 10,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Zero-Knowledge Proofs',
    'ZK-SNARKs',
    'Privacy-Preserving Verification',
    'Trusted Setup Ceremonies',
    'Proof Generation (CPU/GPU)',
    'Fast Verification',
    'Blockchain Integration',
    'Smart Contracts',
    'IPFS Storage',
    'Worker Clusters',
    'GPU Acceleration',
    'Proof Caching',
    'Layer 2 Scaling',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 9: Consistency and Consensus',
    'Chapter 11: Stream Processing',
    'Chapter 12: The Future of Data Systems',
  ],

  // Test cases for final validation
  finalExamTestCases: [
    {
      name: 'Basic Proof Generation',
      type: 'functional',
      requirement: 'FR-1',
      description: 'System can generate ZK proofs for age verification',
      traffic: { type: 'write', rps: 5, writeRps: 5 },
      duration: 30,
      passCriteria: { maxErrorRate: 0, maxLatency: 30000 },
    },
    {
      name: 'Fast Verification',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Verify proofs in under 50ms p99',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Blockchain Storage',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Store proof hashes immutably on blockchain',
      traffic: { type: 'write', rps: 10, writeRps: 10 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Peak Proof Generation',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle peak proof generation load (58 proofs/sec)',
      traffic: { type: 'write', rps: 58, writeRps: 58 },
      duration: 120,
      passCriteria: { maxLatency: 30000, maxErrorRate: 0.05 },
    },
    {
      name: 'Peak Verification Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 2,895 verifications/second with low latency',
      traffic: { type: 'read', rps: 2895, readRps: 2895 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Survive database failure with minimal downtime',
      traffic: { type: 'mixed', rps: 100, readRps: 90, writeRps: 10 },
      duration: 90,
      failureInjection: { type: 'db_crash', atSecond: 30, recoverySecond: 50 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 20 },
    },
    {
      name: 'Cost Optimization',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Stay under $8K/month budget',
      traffic: { type: 'mixed', rps: 100, readRps: 90, writeRps: 10 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 8000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export default l6PrivacyZkpInternetGuidedTutorial;
