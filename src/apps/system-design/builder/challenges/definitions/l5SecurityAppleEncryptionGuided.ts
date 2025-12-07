import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Apple-Style Encryption/Security Platform - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches advanced security concepts
 * while building an end-to-end encrypted platform like Apple iMessage/iCloud.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-4: Build basic working system (FR satisfaction)
 * Steps 5-10: Advanced security & scale (E2EE, key management, secure enclave, zero-knowledge)
 *
 * Key Concepts:
 * - End-to-end encryption (E2EE)
 * - Public key infrastructure (PKI)
 * - Key management and rotation
 * - Secure Enclave for key storage
 * - Zero-knowledge architecture
 * - Perfect forward secrecy
 * - Encrypted data at rest and in transit
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const appleEncryptionRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an end-to-end encrypted messaging and data storage platform like Apple iMessage/iCloud with military-grade security",

  interviewer: {
    name: 'Dr. Alice Chen',
    role: 'Chief Security Architect at Apple',
    avatar: '🔐',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-messaging',
      category: 'functional',
      question: "What's the core functionality users need from a secure messaging platform?",
      answer: "Users need to:\n\n1. **Send encrypted messages** - End-to-end encrypted conversations between users\n2. **Store encrypted data** - Securely store files, photos, and documents in the cloud\n3. **Sync across devices** - Access encrypted data from all their devices (phone, tablet, laptop)\n4. **Manage encryption keys** - Automatically handle key generation, distribution, and rotation",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Security platforms must provide E2EE where only the sender and recipient can decrypt messages - even the service provider cannot read the data",
    },
    {
      id: 'zero-knowledge',
      category: 'functional',
      question: "Should the server be able to read user data?",
      answer: "Absolutely NOT! This is a **zero-knowledge architecture**. The server should NEVER have access to:\n- Plaintext messages\n- Unencrypted files\n- User encryption keys\n\nEven if law enforcement demands it, we physically cannot decrypt user data.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Zero-knowledge means the service provider has zero knowledge of user data - ultimate privacy guarantee",
    },
    {
      id: 'device-verification',
      category: 'functional',
      question: "How do we prevent man-in-the-middle attacks when devices exchange keys?",
      answer: "We need **device verification** and **key fingerprinting**:\n1. Generate unique fingerprints for each device's public key\n2. Allow users to verify fingerprints out-of-band (in person, phone call)\n3. Show warnings if a contact's keys change unexpectedly\n4. Support device attestation (prove device identity)",
      importance: 'critical',
      revealsRequirement: 'FR-6',
      learningPoint: "Trust establishment is critical in E2EE systems - you must verify you're talking to the right person",
    },
    {
      id: 'key-rotation',
      category: 'functional',
      question: "What happens when a user loses their device or gets hacked?",
      answer: "We need **key rotation** and **revocation**:\n1. User can revoke compromised device keys remotely\n2. Generate new keys for all remaining devices\n3. Re-encrypt all stored data with new keys\n4. Notify all contacts to use new keys\n\nThis is complex but critical for security!",
      importance: 'critical',
      revealsRequirement: 'FR-7',
      learningPoint: "Key rotation limits damage from compromise - old messages stay encrypted with old keys (forward secrecy)",
    },
    {
      id: 'perfect-forward-secrecy',
      category: 'clarification',
      question: "If someone steals a user's private key today, can they decrypt old messages?",
      answer: "NO! We implement **Perfect Forward Secrecy (PFS)** using ephemeral keys:\n- Each conversation session uses temporary keys\n- Keys are deleted after use\n- Compromise of current keys doesn't expose past messages\n\nThis is how Signal and WhatsApp work!",
      importance: 'critical',
      insight: "PFS ensures past communications stay secure even if current keys are compromised",
    },
    {
      id: 'secure-enclave',
      category: 'clarification',
      question: "Where should private keys be stored on devices?",
      answer: "Use **Secure Enclave** or hardware security modules (HSM):\n- Private keys NEVER leave secure hardware\n- Cryptographic operations happen inside the enclave\n- Even the OS can't extract keys\n- Biometric authentication (Face ID, Touch ID) to unlock\n\nThis is Apple's approach on iPhone!",
      importance: 'critical',
      insight: "Hardware-backed key storage is the gold standard for mobile security",
    },
    {
      id: 'group-messaging',
      category: 'clarification',
      question: "How does encryption work for group chats?",
      answer: "For MVP, let's support **1-on-1 messaging only**. Group E2EE is incredibly complex:\n- Need sender keys or pairwise encryption\n- Key distribution to N participants\n- Handling members joining/leaving\n\nWe can add this in v2.",
      importance: 'nice-to-have',
      insight: "Group E2EE is an order of magnitude more complex than 1-on-1",
    },

    // SCALE & NFRs
    {
      id: 'throughput-messages',
      category: 'throughput',
      question: "How many encrypted messages per day should we handle?",
      answer: "1 billion messages per day at steady state, with potential spikes to 5 billion during major events",
      importance: 'critical',
      calculation: {
        formula: "1B ÷ 86,400 sec = 11,574 messages/sec",
        result: "~11.6K messages/sec average, ~58K peak",
      },
      learningPoint: "Encryption operations are CPU-intensive - need to scale horizontally",
    },
    {
      id: 'throughput-keys',
      category: 'throughput',
      question: "How many key operations (generation, exchange, rotation)?",
      answer: "About 100 million key operations per day:\n- New device registrations: 10M/day\n- Key rotations: 5M/day\n- Key exchanges: 85M/day",
      importance: 'critical',
      calculation: {
        formula: "100M ÷ 86,400 sec = 1,157 key ops/sec",
        result: "~1.2K key ops/sec average, ~6K peak",
      },
      learningPoint: "Key operations are even more CPU-intensive than message encryption",
    },
    {
      id: 'latency-messaging',
      category: 'latency',
      question: "How fast should message delivery be?",
      answer: "p99 under 200ms for end-to-end message delivery. Users expect instant messaging!\n\nNote: This includes encryption time on sender, network transit, and decryption on receiver.",
      importance: 'critical',
      learningPoint: "E2EE adds latency - must optimize crypto operations",
    },
    {
      id: 'latency-key-exchange',
      category: 'latency',
      question: "How fast should key exchange be when starting a new conversation?",
      answer: "First message in a conversation requires key exchange. Should complete in under 500ms p99. Users won't wait long.",
      importance: 'important',
      learningPoint: "Initial key exchange is slower - acceptable for first message only",
    },
    {
      id: 'storage-security',
      category: 'security',
      question: "How should we store encrypted data at rest?",
      answer: "Multi-layer encryption:\n1. **Per-user keys** - Each user has unique data encryption keys\n2. **Key encryption keys (KEK)** - User keys encrypted with device keys\n3. **Hardware encryption** - Database storage encrypted at disk level\n\nThis is defense in depth!",
      importance: 'critical',
      learningPoint: "Multiple encryption layers protect against different attack vectors",
    },
    {
      id: 'key-backup',
      category: 'reliability',
      question: "What if a user loses all their devices? Can they recover their data?",
      answer: "This is a **fundamental tension** in E2EE:\n\n**Option 1: No recovery** - Data is lost forever (Signal approach)\n**Option 2: Encrypted backup** - User sets a strong passphrase, we store encrypted key backup\n\nLet's use Option 2 with strong warnings about passphrase strength!",
      importance: 'critical',
      insight: "Key recovery vs. security is the hardest trade-off in E2EE systems",
    },
    {
      id: 'metadata-protection',
      category: 'security',
      question: "Can the server see who is messaging whom, even if messages are encrypted?",
      answer: "Good question! In v1, the server sees metadata:\n- Who sends to whom\n- Message timestamps\n- Message sizes\n\nFull metadata protection requires onion routing (Tor-like) - very complex. Out of scope for MVP.",
      importance: 'important',
      insight: "Metadata leakage is a major limitation of most E2EE systems",
    },
    {
      id: 'compliance',
      category: 'security',
      question: "How do we handle government requests for data?",
      answer: "With zero-knowledge architecture, we literally cannot provide plaintext:\n- We can provide encrypted data (useless without keys)\n- We can provide metadata (who talked to whom)\n- We cannot decrypt user data\n\nThis must be clearly documented for legal compliance!",
      importance: 'critical',
      learningPoint: "Zero-knowledge means you physically cannot comply with plaintext data requests",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-messaging', 'zero-knowledge', 'device-verification'],
  criticalFRQuestionIds: ['core-messaging', 'zero-knowledge'],
  criticalScaleQuestionIds: ['throughput-messages', 'storage-security', 'key-backup'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: End-to-end encrypted messaging',
      description: 'Users can send messages that only sender and recipient can read',
      emoji: '💬',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Encrypted data storage',
      description: 'Store files and documents with client-side encryption',
      emoji: '🗄️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Multi-device sync',
      description: 'Access encrypted data from all user devices',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Automatic key management',
      description: 'Handle key generation, distribution, and rotation transparently',
      emoji: '🔑',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Zero-knowledge architecture',
      description: 'Server cannot access plaintext data or keys',
      emoji: '🙈',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Device verification',
      description: 'Verify device identities to prevent MITM attacks',
      emoji: '✅',
    },
    {
      id: 'fr-7',
      text: 'FR-7: Key rotation and revocation',
      description: 'Rotate keys when devices are compromised',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500 million users',
    writesPerDay: '1 billion messages + 100M key operations',
    readsPerDay: '1 billion message retrievals',
    peakMultiplier: 5,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 12731, peak: 63655 },
    calculatedReadRPS: { average: 11574, peak: 57870 },
    maxPayloadSize: '~100KB (encrypted message + metadata)',
    storagePerRecord: '~50KB average encrypted message',
    storageGrowthPerYear: '~18PB (1B messages/day × 50KB)',
    redirectLatencySLA: 'p99 < 200ms (message delivery)',
    createLatencySLA: 'p99 < 500ms (key exchange)',
  },

  architecturalImplications: [
    '✅ Zero-knowledge → All encryption/decryption on client side',
    '✅ E2EE → Need public key infrastructure (PKI) for key exchange',
    '✅ Multi-device → Key synchronization across user devices',
    '✅ Perfect forward secrecy → Ephemeral session keys for each conversation',
    '✅ Secure Enclave → Hardware-backed key storage on devices',
    '✅ High volume → Caching public keys to avoid constant lookups',
    '✅ Key rotation → Version all encryption keys, support migration',
  ],

  outOfScope: [
    'Group messaging E2EE',
    'Metadata protection (traffic analysis resistance)',
    'Video/voice call encryption',
    'Cross-platform desktop client',
    'Advanced features (read receipts, typing indicators)',
    'Search on encrypted data (very hard problem)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can send encrypted messages and store encrypted files. The advanced security features (PFS, secure enclave, key rotation) will come in later steps. Functionality first, then military-grade security!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔐',
  scenario: "Welcome to Apple's security team! You've been hired to build the next-generation iMessage encryption platform.",
  hook: "Your first user just got their new iPhone. They want to send their first encrypted message!",
  challenge: "Set up the basic connection so the client can reach your security server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your secure platform is online!',
  achievement: 'Clients can now connect to your security server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'TLS/HTTPS', after: 'Enabled' },
  ],
  nextTeaser: "But we haven't implemented any encryption yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Secure Client-Server Architecture',
  conceptExplanation: `Every secure messaging platform starts with **TLS-encrypted connections** between Client and Server.

Even though we'll implement end-to-end encryption (E2EE), we STILL need transport security:

**Transport Layer Security (TLS):**
- Encrypts all data in transit between client and server
- Prevents network eavesdropping
- Authenticates the server (prevents MITM)

**Architecture:**
1. Client connects via HTTPS (TLS 1.3)
2. Server presents SSL certificate
3. Encrypted tunnel established
4. All data flows through this tunnel

This is the first layer of defense - but NOT sufficient alone!`,

  whyItMatters: 'Without TLS, attackers on the network can intercept all traffic, even if you add E2EE later. Defense in depth!',

  realWorldExample: {
    company: 'Apple iMessage',
    scenario: 'Handling billions of encrypted messages daily',
    howTheyDoIt: 'Uses TLS for transport + E2EE for message content - layered security approach',
  },

  keyPoints: [
    'TLS encrypts data in transit (client to server)',
    'E2EE encrypts data end-to-end (client to client)',
    'Both are needed for complete security',
    'Always use TLS 1.3 - older versions have vulnerabilities',
  ],

  keyConcepts: [
    { title: 'TLS', explanation: 'Transport Layer Security - encrypts network traffic', icon: '🔒' },
    { title: 'E2EE', explanation: 'End-to-End Encryption - server cannot decrypt', icon: '🔐' },
    { title: 'Defense in Depth', explanation: 'Multiple security layers', icon: '🛡️' },
  ],
};

const step1: GuidedStep = {
  id: 'apple-encryption-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Foundation for all FRs - secure transport',
    taskDescription: 'Add a Client and App Server, then connect them with TLS',
    componentsNeeded: [
      { type: 'client', reason: 'User devices running your secure messaging app', displayName: 'Client' },
      { type: 'app_server', reason: 'Security server managing keys and encrypted data', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
      'Client connected to App Server (implies TLS)',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a secure connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Key Generation & E2EE APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔑',
  scenario: "Your server is online, but messages are sent in plaintext!",
  hook: "A user tried to send 'Meet at midnight' but it went through unencrypted. Anyone on the network can read it!",
  challenge: "Implement public/private key generation and E2EE message APIs.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎊',
  message: 'Your E2EE implementation is live!',
  achievement: 'Messages are now encrypted end-to-end',
  metrics: [
    { label: 'Key pairs generated', after: '✓' },
    { label: 'Messages encrypted', after: '✓' },
    { label: 'Server can read messages', after: '✗' },
  ],
  nextTeaser: "But keys and messages are stored in memory - they'll be lost on restart...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'E2EE Implementation: Public Key Cryptography',
  conceptExplanation: `End-to-end encryption uses **asymmetric cryptography** (public/private key pairs).

**How it works:**
1. Each user has a **key pair**:
   - Public key: Shared with everyone (encrypt messages TO this user)
   - Private key: Kept secret on user's device (decrypt messages)

2. **Sending encrypted message:**
   - Alice fetches Bob's public key
   - Alice encrypts message with Bob's public key
   - Only Bob's private key can decrypt it
   - Server sees encrypted blob - cannot read it!

3. **Key algorithms:**
   - RSA-2048 or RSA-4096 (slower but battle-tested)
   - Elliptic Curve (X25519) - faster, smaller keys
   - We'll use RSA for learning, switch to ECC for production

**API endpoints needed:**
- \`POST /api/keys/generate\` - Generate new key pair
- \`GET /api/keys/{user_id}\` - Fetch user's public key
- \`POST /api/messages/send\` - Send encrypted message
- \`GET /api/messages\` - Retrieve encrypted messages`,

  whyItMatters: 'This is the CORE of E2EE. Without proper implementation, all security claims are worthless.',

  famousIncident: {
    title: 'Telegram Non-E2EE Default Chats',
    company: 'Telegram',
    year: '2021',
    whatHappened: 'Telegram claimed to be "ultra-secure" but default chats were NOT end-to-end encrypted - only client-to-server. The company could read all messages. Security researchers exposed this, damaging trust.',
    lessonLearned: 'E2EE must be implemented correctly and be ON BY DEFAULT. Half-measures destroy credibility.',
    icon: '📱',
  },

  realWorldExample: {
    company: 'Signal',
    scenario: 'Gold standard for E2EE',
    howTheyDoIt: 'Uses X25519 for key exchange, AES-256 for message encryption, and perfect forward secrecy',
  },

  keyPoints: [
    'Public key = anyone can encrypt TO you',
    'Private key = only you can decrypt',
    'Server stores public keys, NEVER private keys',
    'Each message encrypted with recipient\'s public key',
  ],

  quickCheck: {
    question: 'In E2EE, can the server read message content?',
    options: [
      'Yes, the server decrypts and re-encrypts',
      'No, server only sees encrypted blobs',
      'Only if user grants permission',
      'Yes, but only for legal requests',
    ],
    correctIndex: 1,
    explanation: 'True E2EE means the server CANNOT decrypt messages - only the recipient\'s private key can.',
  },

  keyConcepts: [
    { title: 'Public Key', explanation: 'Shared with world - used to encrypt TO you', icon: '🔓' },
    { title: 'Private Key', explanation: 'Secret - only you can decrypt', icon: '🔒' },
    { title: 'Asymmetric Crypto', explanation: 'Different keys for encrypt/decrypt', icon: '⚖️' },
  ],
};

const step2: GuidedStep = {
  id: 'apple-encryption-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: E2EE messaging, FR-4: Key management',
    taskDescription: 'Configure APIs and implement Python handlers for key generation and encrypted messaging',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/keys/generate, GET /api/keys/{user_id}, POST /api/messages/send, GET /api/messages APIs',
      'Open the Python tab',
      'Implement generate_key_pair(), get_public_key(), send_encrypted_message(), get_messages() functions',
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
    level1: 'Click on App Server, then go to the APIs tab to assign key and message endpoints',
    level2: 'After assigning APIs, switch to Python tab. Implement key generation using RSA, and message encryption using public keys',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/keys/generate', 'GET /api/keys/{user_id}', 'POST /api/messages/send', 'GET /api/messages'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Keys & Encrypted Messages
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Your server crashed at 3 AM and restarted...",
  hook: "When it came back, all public keys and encrypted messages were GONE! Users can't decrypt old messages. Panic!",
  challenge: "Add a database to persist keys and encrypted message blobs.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Keys and messages are now safe!',
  achievement: 'Encryption data persists with database storage',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Public keys stored', after: '✓' },
    { label: 'Encrypted messages stored', after: '✓' },
    { label: 'Private keys stored', after: '✗ (client-side only)' },
  ],
  nextTeaser: "But fetching public keys for every message is slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: Storing Keys and Encrypted Data',
  conceptExplanation: `For a secure messaging platform, the database stores:

**What we MUST store:**
1. **Public keys** - Indexed by user_id for fast lookup
2. **Encrypted message blobs** - Cannot be decrypted by server
3. **Key metadata** - Creation date, device ID, fingerprints
4. **Device registrations** - Which devices belong to which users

**What we NEVER store:**
- Private keys (stay on client devices only!)
- Unencrypted message content
- User passwords in plaintext (hash with bcrypt/Argon2)

**Database schema:**
\`\`\`sql
public_keys table:
- user_id (indexed)
- device_id
- public_key_pem (RSA public key)
- fingerprint (SHA-256 hash for verification)
- created_at

encrypted_messages table:
- message_id
- sender_id
- recipient_id
- encrypted_blob (base64 encrypted message)
- created_at
\`\`\``,

  whyItMatters: 'Without persistence:\n1. Users lose all messages on server restart\n2. Key exchange fails\n3. Multi-device sync impossible\n4. Cannot verify device fingerprints',

  famousIncident: {
    title: 'WhatsApp Key Storage Vulnerability',
    company: 'WhatsApp',
    year: '2019',
    whatHappened: 'Researchers found that WhatsApp stored encryption keys in device backups without proper protection. If someone accessed the backup (via iCloud or Google Drive), they could extract keys and decrypt messages.',
    lessonLearned: 'Key storage must be as secure as the encryption itself. A weak link breaks the whole chain.',
    icon: '💬',
  },

  realWorldExample: {
    company: 'Apple iMessage',
    scenario: 'Billions of encrypted messages stored',
    howTheyDoIt: 'Stores encrypted message blobs in CloudKit, public keys in identity service, private keys ONLY in device Secure Enclave',
  },

  keyPoints: [
    'Store public keys in database for key exchange',
    'Store encrypted message blobs (server cannot decrypt)',
    'NEVER store private keys on server',
    'Use PostgreSQL with encryption at rest',
  ],

  quickCheck: {
    question: 'Where should a user\'s private key be stored?',
    options: [
      'In the database encrypted with a master key',
      'In the cache for fast access',
      'ONLY on the user\'s device (never on server)',
      'In a separate key management service',
    ],
    correctIndex: 2,
    explanation: 'Private keys must NEVER leave the user\'s device. Storing them on the server breaks E2EE guarantees.',
  },

  keyConcepts: [
    { title: 'Public Key Storage', explanation: 'Database stores public keys for lookup', icon: '🔓' },
    { title: 'Encrypted Blobs', explanation: 'Messages stored encrypted - server cannot read', icon: '🔐' },
    { title: 'Zero-Knowledge', explanation: 'Server has no access to plaintext', icon: '🙈' },
  ],
};

const step3: GuidedStep = {
  id: 'apple-encryption-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent, encrypted storage',
    taskDescription: 'Add a Database and connect the App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store public keys, encrypted messages, key metadata', displayName: 'PostgreSQL' },
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
// STEP 4: Add Cache for Public Key Lookups
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your platform has 1 million users sending 10 million messages per day!",
  hook: "Every message requires fetching the recipient's public key from the database. Queries are taking 150ms. Users complain messages are slow!",
  challenge: "Add a cache to speed up public key lookups.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Public key lookups are now instant!',
  achievement: 'Caching reduced key lookup latency by 15x',
  metrics: [
    { label: 'Key lookup latency', before: '150ms', after: '10ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'Database load', before: '100%', after: '25%' },
  ],
  nextTeaser: "But your single server can't handle millions of encryption operations...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: Fast Public Key Distribution',
  conceptExplanation: `Public key lookups happen on EVERY message send. Caching is critical!

**What to cache:**
1. **Public keys** - TTL: 1 hour (keys rarely change)
2. **Key fingerprints** - For verification UI
3. **Device lists** - Which devices belong to each user
4. **User metadata** - Display names, profile pictures

**Cache key design:**
\`\`\`
user:<user_id>:public_key → RSA public key PEM
user:<user_id>:devices → [device1_id, device2_id, ...]
device:<device_id>:fingerprint → SHA-256 fingerprint
\`\`\`

**Why caching is safe for security:**
- Public keys are meant to be public!
- Cache poisoning would be detected via fingerprint verification
- Short TTL (1 hour) limits impact of stale data

**Cache invalidation:**
- On key rotation, invalidate all related cache entries
- Publish cache invalidation events via pub/sub`,

  whyItMatters: 'Without caching:\n1. Database overwhelmed by key lookups\n2. Message send latency too high\n3. Poor user experience\n4. Cannot scale to millions of users',

  famousIncident: {
    title: 'Signal Key Server Overload',
    company: 'Signal',
    year: '2021',
    whatHappened: 'When millions of users migrated from WhatsApp to Signal in Jan 2021, their key distribution system was overwhelmed. Registration and message sending failed for hours. They had to add aggressive caching and CDN distribution.',
    lessonLearned: 'Public key distribution must be highly optimized with caching - it\'s on the critical path for every message.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Apple iMessage',
    scenario: 'Handling billions of key lookups per day',
    howTheyDoIt: 'Uses global CDN to cache and distribute public keys, with aggressive TTLs and cache invalidation on key rotation',
  },

  diagram: `
Message Send Flow:

┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
│ (Alice)│     │             │     │ Cache │     └──────────┘
└────────┘     └─────────────┘     └───────┘
                     │                  │
                     │   1. Check cache for Bob's public key
                     │      ├─ HIT (95%) → Return instantly
                     │      └─ MISS (5%) → Query database, cache result
                     │
                     │   2. Encrypt message with Bob's public key
                     │   3. Store encrypted blob
                     │   4. Send push notification to Bob
`,

  keyPoints: [
    'Cache public keys with 1-hour TTL',
    'Public keys are safe to cache (meant to be public)',
    'Invalidate cache on key rotation',
    '95%+ cache hit rate is achievable',
  ],

  quickCheck: {
    question: 'Why is it safe to cache public keys but NOT private keys?',
    options: [
      'Public keys are smaller in size',
      'Public keys are meant to be shared - compromise doesn\'t break security',
      'Private keys change more frequently',
      'It\'s not safe - shouldn\'t cache either',
    ],
    correctIndex: 1,
    explanation: 'Public keys are designed to be shared publicly. Caching them doesn\'t reduce security. Private keys must stay secret.',
  },

  keyConcepts: [
    { title: 'Key Caching', explanation: 'Cache public keys for fast lookup', icon: '🚀' },
    { title: 'Cache Invalidation', explanation: 'Clear cache on key rotation', icon: '🔄' },
    { title: 'TTL', explanation: 'Time-to-live limits stale data', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'apple-encryption-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from faster key lookups',
    taskDescription: 'Add a Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache public keys for instant lookup', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache TTL configured (3600 seconds)',
      'Cache strategy set (cache-aside)',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Then click Cache and set TTL to 3600 seconds, strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 3600, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Secure Enclave / HSM for Private Key Storage
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔓',
  scenario: "SECURITY BREACH! A user's phone was compromised by malware.",
  hook: "The malware scanned the filesystem and found the private key stored in a plain file. It exfiltrated the key and now the attacker can decrypt all past and future messages!",
  challenge: "Implement Secure Enclave storage so private keys NEVER leave secure hardware.",
  illustration: 'security-breach',
};

const step5Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Private keys are now hardware-protected!',
  achievement: 'Secure Enclave prevents key extraction',
  metrics: [
    { label: 'Keys extractable by malware', before: 'Yes', after: 'No' },
    { label: 'Hardware-backed crypto', after: 'Enabled' },
    { label: 'Biometric unlock', after: 'Required' },
  ],
  nextTeaser: "But we need to support multiple devices per user...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Secure Enclave: Hardware-Backed Key Storage',
  conceptExplanation: `The weakest link in E2EE is private key storage on the device. Enter **Secure Enclave**.

**What is Secure Enclave?**
- Isolated hardware security module in modern devices (iPhone, Android, Macs)
- Private keys generated INSIDE the enclave
- Keys NEVER leave the enclave - cannot be extracted
- Cryptographic operations happen inside the enclave
- Protected by biometric authentication (Face ID, Touch ID)

**Architecture:**
1. **Key Generation** - App requests enclave to generate key pair
2. **Private key** - Stays in enclave forever, cannot be exported
3. **Public key** - Exported and uploaded to server
4. **Decryption** - App passes encrypted blob to enclave, gets plaintext
5. **Biometric gate** - User must authenticate to use keys

**For non-Secure Enclave devices:**
- Use OS keychain with encryption
- Still better than plain filesystem
- Android Keystore, iOS Keychain

**Benefits:**
- Even if device is fully compromised, keys cannot be stolen
- Government cannot force key extraction (it's physically impossible)
- Strongest security posture possible`,

  whyItMatters: 'Without hardware-backed storage:\n1. Malware can steal keys from filesystem\n2. Device compromise = total security failure\n3. Cannot guarantee E2EE claims\n4. Forensic tools can extract keys',

  famousIncident: {
    title: 'FBI vs. Apple San Bernardino iPhone',
    company: 'Apple',
    year: '2016',
    whatHappened: 'FBI demanded Apple create a backdoor to unlock an iPhone. Apple refused, stating it would undermine Secure Enclave security. Even Apple cannot extract keys from the Secure Enclave - it\'s physically impossible.',
    lessonLearned: 'Secure Enclave provides the strongest security guarantee: not even the device manufacturer can extract private keys.',
    icon: '🍎',
  },

  realWorldExample: {
    company: 'Apple iMessage',
    scenario: 'Protecting billions of private keys',
    howTheyDoIt: 'All private keys stored in Secure Enclave on iOS/macOS. Face ID/Touch ID required to access. Keys never leave hardware.',
  },

  diagram: `
Traditional Key Storage:              Secure Enclave:
┌──────────────────┐                  ┌──────────────────┐
│   Filesystem     │                  │  Secure Enclave  │
│                  │                  │   (Hardware)     │
│  private_key.pem │ ← Malware can    │                  │
│  (readable!)     │   steal this!    │  [Private Key]   │ ← Cannot
│                  │                  │  (isolated)      │   extract!
└──────────────────┘                  └──────────────────┘
                                              │
                                              │ Decrypt operation
                                              ▼
                                      ┌──────────────────┐
                                      │  App Process     │
                                      │  (gets plaintext)│
                                      └──────────────────┘
`,

  keyPoints: [
    'Secure Enclave = isolated hardware for keys',
    'Private keys NEVER leave the enclave',
    'Biometric authentication protects key usage',
    'Even device manufacturer cannot extract keys',
  ],

  quickCheck: {
    question: 'What makes Secure Enclave secure against malware?',
    options: [
      'It encrypts the private key',
      'It requires a password',
      'Private key is isolated in hardware and cannot be extracted',
      'It uses stronger encryption algorithms',
    ],
    correctIndex: 2,
    explanation: 'Secure Enclave isolates private keys in dedicated hardware. Even with full device compromise, keys cannot be extracted.',
  },

  keyConcepts: [
    { title: 'Secure Enclave', explanation: 'Hardware security module for keys', icon: '🔐' },
    { title: 'Key Isolation', explanation: 'Keys never leave secure hardware', icon: '🏝️' },
    { title: 'Biometric Auth', explanation: 'Face ID/Touch ID to use keys', icon: '👤' },
  ],
};

const step5: GuidedStep = {
  id: 'apple-encryption-step-5',
  stepNumber: 5,
  frIndex: 4,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-5: Zero-knowledge architecture requires secure key storage',
    taskDescription: 'Configure the Client to use Secure Enclave for private keys',
    successCriteria: [
      'Click on Client component',
      'Enable Secure Enclave in configuration',
      'Set biometric authentication requirement',
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
    requireSecureEnclaveEnabled: true,
  },

  hints: {
    level1: 'Click on the Client component to open its configuration panel',
    level2: 'Find the Security section and enable "Secure Enclave" for key storage. Enable biometric authentication.',
    solutionComponents: [{ type: 'client', config: { secureEnclave: true, biometricAuth: true } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Implement Perfect Forward Secrecy with Ephemeral Keys
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🕵️',
  scenario: "A government agency seized a user's device and extracted their private key!",
  hook: "They now want to decrypt ALL past messages from the seized device. Can they do it?",
  challenge: "Implement Perfect Forward Secrecy so old messages stay secure even if current keys are compromised.",
  illustration: 'time-travel',
};

const step6Celebration: CelebrationContent = {
  emoji: '🔒',
  message: 'Perfect Forward Secrecy activated!',
  achievement: 'Old messages are protected even if keys are compromised',
  metrics: [
    { label: 'Key compromise impact', before: 'All messages', after: 'Only current session' },
    { label: 'Session keys', after: 'Ephemeral (deleted after use)' },
    { label: 'Past message security', after: 'Guaranteed' },
  ],
  nextTeaser: "But users want to sync messages across multiple devices...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Perfect Forward Secrecy: Protecting Past Communications',
  conceptExplanation: `Perfect Forward Secrecy (PFS) ensures that compromise of long-term keys doesn't expose past messages.

**The Problem:**
With static key pairs:
- Alice and Bob use the same keys forever
- If Bob's private key is stolen today, attacker can decrypt ALL past messages
- This is catastrophic!

**The Solution: Ephemeral Keys**
1. **Long-term identity keys** - Used ONLY for authentication
2. **Ephemeral session keys** - Generated fresh for each conversation session
3. **Key derivation** - Use Diffie-Hellman key exchange to derive shared secret

**Signal Protocol (Industry Standard):**
1. **X3DH (Extended Triple Diffie-Hellman)** - Initial key agreement
2. **Double Ratchet** - Continuously generate new keys for each message
3. **Session keys deleted** - After message is encrypted/decrypted

**Simplified Flow:**
\`\`\`
Alice → Bob first message:
1. Alice fetches Bob's pre-keys from server
2. Alice generates ephemeral key pair
3. Alice + Bob do Diffie-Hellman → shared secret
4. Derive message key from shared secret
5. Encrypt message with message key
6. Delete ephemeral keys after use

Attacker steals Bob's key later:
- Cannot derive past shared secrets (ephemeral keys deleted)
- Past messages remain secure!
\`\`\``,

  whyItMatters: 'Without PFS:\n1. Single key compromise = all history exposed\n2. Cannot guarantee long-term privacy\n3. Vulnerable to retroactive decryption\n4. Government "collect now, decrypt later" attacks succeed',

  famousIncident: {
    title: 'NSA PRISM Bulk Collection',
    company: 'NSA',
    year: '2013',
    whatHappened: 'Snowden revealed NSA collected vast amounts of encrypted internet traffic. Their plan: store it and decrypt later when they could steal/crack keys. Systems without PFS are vulnerable to this attack.',
    lessonLearned: 'Perfect Forward Secrecy protects against retroactive decryption - critical for long-term privacy.',
    icon: '👁️',
  },

  realWorldExample: {
    company: 'Signal & WhatsApp',
    scenario: 'Protecting billions of messages from retroactive decryption',
    howTheyDoIt: 'Both use Signal Protocol with X3DH and Double Ratchet for perfect forward secrecy',
  },

  diagram: `
Traditional (No PFS):                Perfect Forward Secrecy:
┌────────────────────┐              ┌────────────────────┐
│ Static Key Pair    │              │ Identity Keys      │
│                    │              │ (long-term)        │
│ All messages use   │              │ Only for auth      │
│ same keys          │              └────────────────────┘
│                    │                        │
│ Key compromised → │                        ▼
│ ALL history lost! │              ┌────────────────────┐
└────────────────────┘              │ Ephemeral Keys     │
                                    │ (per-session)      │
                                    │                    │
                                    │ Key compromised → │
                                    │ Only current       │
                                    │ session affected   │
                                    └────────────────────┘
`,

  keyPoints: [
    'PFS uses ephemeral keys for each session',
    'Long-term keys only for authentication, not encryption',
    'Ephemeral keys deleted after use',
    'Key compromise doesn\'t expose past messages',
  ],

  quickCheck: {
    question: 'With Perfect Forward Secrecy, what happens if today\'s private key is stolen?',
    options: [
      'All past messages can be decrypted',
      'Only current session messages can be decrypted, past is safe',
      'No messages can be decrypted',
      'Only future messages can be decrypted',
    ],
    correctIndex: 1,
    explanation: 'PFS ensures past messages used different ephemeral keys that have been deleted. Only current session is affected.',
  },

  keyConcepts: [
    { title: 'PFS', explanation: 'Perfect Forward Secrecy - past msgs stay secure', icon: '🔐' },
    { title: 'Ephemeral Keys', explanation: 'Temporary keys deleted after use', icon: '⏳' },
    { title: 'Double Ratchet', explanation: 'Continuously generate new keys', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'apple-encryption-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1: E2EE with perfect forward secrecy',
    taskDescription: 'Update App Server code to implement ephemeral keys and Diffie-Hellman exchange',
    successCriteria: [
      'Click on App Server',
      'Open Python tab',
      'Implement generate_ephemeral_keys(), diffie_hellman_exchange(), derive_session_key() functions',
      'Update send_encrypted_message() to use session keys',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
    requireSecureEnclaveEnabled: true,
  },

  hints: {
    level1: 'Click on App Server, then go to Python tab',
    level2: 'Implement Diffie-Hellman key exchange to generate shared session keys. Use ephemeral key pairs that are deleted after session establishment.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Async Delivery & Multi-Device Sync
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📱',
  scenario: "Users are complaining: 'Messages don't sync to my iPad!'",
  hook: "A user sends a message from iPhone, but it doesn't appear on their MacBook. They have 3 devices but messages only reach one!",
  challenge: "Implement multi-device sync using message queues.",
  illustration: 'sync-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Multi-device sync is live!',
  achievement: 'Messages now delivered to all user devices',
  metrics: [
    { label: 'Devices per user', after: 'Unlimited' },
    { label: 'Sync latency', after: '<2 seconds' },
    { label: 'Delivery reliability', after: '99.9%' },
  ],
  nextTeaser: "But what happens when a user loses their phone?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Device Sync: Encrypted Message Fanout',
  conceptExplanation: `Users expect their messages on ALL devices. This is complex with E2EE!

**The Challenge:**
- User has 3 devices: iPhone, iPad, MacBook
- Each device has a DIFFERENT key pair (for security)
- Message must be encrypted separately for each device
- Server must deliver to all devices simultaneously

**Solution: Message Queue + Device Fanout**
1. Sender encrypts message 3 times (once per recipient device key)
2. Server publishes to message queue for each device
3. Background workers deliver via push notifications
4. Each device decrypts with its own private key

**Architecture:**
\`\`\`
Message Send:
Alice → Server: "Hello Bob" encrypted with Bob's devices
  ├─ Encrypted for Bob_iPhone → Queue → Push to iPhone
  ├─ Encrypted for Bob_iPad → Queue → Push to iPad
  └─ Encrypted for Bob_MacBook → Queue → Push to MacBook
\`\`\`

**Queue Benefits:**
- Async delivery (sender doesn't wait)
- Retry on failure
- Handles offline devices (deliver when they come online)
- Scales to millions of messages

**Device Registration:**
Each device must:
1. Generate its own key pair in Secure Enclave
2. Upload public key to server
3. Server stores all device keys per user
4. Sender fetches all device keys and encrypts for each`,

  whyItMatters: 'Without multi-device sync:\n1. Messages only on one device\n2. Poor user experience\n3. Can\'t compete with iMessage/WhatsApp\n4. Users won\'t adopt the platform',

  famousIncident: {
    title: 'Signal Multi-Device Beta Issues',
    company: 'Signal',
    year: '2020',
    whatHappened: 'Signal took years to add multi-device support because E2EE makes it extremely complex. Their first beta had serious sync issues - messages would arrive out of order or not at all on secondary devices.',
    lessonLearned: 'Multi-device E2EE is one of the hardest problems in secure messaging. Requires careful queue management and key distribution.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Apple iMessage',
    scenario: 'Syncing messages across iPhone, iPad, Mac, Apple Watch',
    howTheyDoIt: 'Each device has separate keys. Server encrypts message for each device and uses APNs (push notifications) for delivery.',
  },

  diagram: `
Multi-Device Message Flow:

Alice sends "Hello" to Bob (3 devices):

┌────────┐     ┌─────────────┐     ┌───────────────┐
│ Alice  │────▶│ App Server  │────▶│ Message Queue │
│(iPhone)│     │             │     │               │
└────────┘     └─────────────┘     └───────┬───────┘
                     │                     │
                     │ Fetch Bob's         │ Fanout to devices
                     │ device keys:        │
                     │ - iPhone_key        ▼
                     │ - iPad_key     ┌──────────┐  ┌──────────┐  ┌──────────┐
                     │ - Mac_key      │ Worker 1 │  │ Worker 2 │  │ Worker 3 │
                     │                └────┬─────┘  └────┬─────┘  └────┬─────┘
                     │ Encrypt 3x          │             │             │
                     │                     ▼             ▼             ▼
                     │                Push to       Push to       Push to
                     │              Bob_iPhone    Bob_iPad      Bob_MacBook
`,

  keyPoints: [
    'Each device has its own key pair',
    'Message encrypted separately for each recipient device',
    'Message queue enables async delivery',
    'Push notifications wake up offline devices',
  ],

  quickCheck: {
    question: 'Why must we encrypt a message separately for each recipient device?',
    options: [
      'It makes the system faster',
      'Each device has a different private key for security',
      'To save bandwidth',
      'It\'s required by Apple',
    ],
    correctIndex: 1,
    explanation: 'Each device has its own key pair. A message encrypted for iPhone cannot be decrypted by iPad. Must encrypt for each.',
  },

  keyConcepts: [
    { title: 'Device Fanout', explanation: 'Encrypt message for each device', icon: '📤' },
    { title: 'Message Queue', explanation: 'Async delivery with retry', icon: '📬' },
    { title: 'Push Notifications', explanation: 'Wake offline devices', icon: '🔔' },
  ],
};

const step7: GuidedStep = {
  id: 'apple-encryption-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Multi-device sync with E2EE',
    taskDescription: 'Add a Message Queue for async message delivery to multiple devices',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Async delivery to all user devices', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
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
    requireSecureEnclaveEnabled: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async delivery to all user devices.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 8: Implement Key Rotation & Revocation
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚨',
  scenario: "ALERT! A user's iPhone was stolen!",
  hook: "The thief has physical access to the device. The user remotely wiped it, but what about the encryption keys? Can we revoke them?",
  challenge: "Implement key rotation and device revocation.",
  illustration: 'device-stolen',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔐',
  message: 'Key rotation system active!',
  achievement: 'Users can revoke compromised devices and rotate keys',
  metrics: [
    { label: 'Device revocation', after: 'Enabled' },
    { label: 'Key rotation time', after: '<60 seconds' },
    { label: 'Compromised device impact', after: 'Isolated' },
  ],
  nextTeaser: "But users need a way to verify they're talking to the right person...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Key Rotation: Recovering from Compromise',
  conceptExplanation: `When a device is lost/stolen/hacked, we need to revoke its keys and rotate all others.

**Key Rotation Process:**
1. **User reports device as compromised**
   - Via any remaining trusted device
   - Or via web portal with 2FA

2. **Server revokes compromised device**
   - Mark device keys as "revoked" in database
   - Add to revocation list (cached globally)
   - Reject all future messages from that device

3. **Re-key remaining devices**
   - All user's other devices generate new key pairs
   - Upload new public keys to server
   - Cache invalidation for old keys

4. **Notify all contacts**
   - "Alice's keys have changed"
   - Contacts re-fetch new public keys
   - Future messages use new keys

5. **Re-encrypt stored data (optional)**
   - For stored files, re-encrypt with new keys
   - Old messages stay encrypted with old keys (can't decrypt anymore)
   - Trade-off: security vs. losing old data

**Revocation List:**
- Maintained by server
- Cached aggressively (Redis)
- Checked on every message
- If device key is revoked → reject message

**User Experience:**
\`\`\`
User: "Report iPhone as stolen"
  ↓
Server: Revoke iPhone keys immediately
  ↓
User's iPad: Generate new keys
User's Mac: Generate new keys
  ↓
All contacts notified: "Alice's keys changed - verify fingerprint"
\`\`\``,

  whyItMatters: 'Without key rotation:\n1. Stolen device can read all future messages\n2. No way to recover from compromise\n3. Must abandon account and start over\n4. Users have no security control',

  famousIncident: {
    title: 'Cellebrite iPhone Forensics',
    company: 'Law Enforcement',
    year: '2021',
    whatHappened: 'Company called Cellebrite claimed they could unlock any iPhone and extract messages. Apple responded by implementing aggressive key rotation - even if device is unlocked, keys expire quickly limiting exposure.',
    lessonLearned: 'Regular key rotation limits damage from device compromise. Time-bound keys reduce forensic value.',
    icon: '🔓',
  },

  realWorldExample: {
    company: 'Apple iCloud Keychain',
    scenario: 'Protecting keys across lost devices',
    howTheyDoIt: 'Allows users to remove trusted devices remotely. Removed devices cannot access keychain. Remaining devices re-encrypt.',
  },

  diagram: `
Key Rotation Flow:

Step 1: Device Lost              Step 2: Revocation           Step 3: Re-key
┌─────────────┐                  ┌─────────────┐              ┌─────────────┐
│ iPhone      │                  │ Server      │              │ Remaining   │
│ (STOLEN!)   │                  │             │              │ Devices     │
│             │                  │ Revoke      │              │             │
│ keys: A, B  │ ──X──▶           │ iPhone keys │              │ Generate    │
└─────────────┘                  │             │              │ NEW keys    │
                                 │ Add to      │              │             │
┌─────────────┐                  │ revocation  │              │ iPad: C, D  │
│ User reports│                  │ list        │              │ Mac:  E, F  │
│ via iPad    │─────────────────▶│             │◀─────────────│             │
└─────────────┘                  └─────────────┘              └─────────────┘
                                         │
                                         ▼
                                 ┌─────────────┐
                                 │ Notify all  │
                                 │ contacts:   │
                                 │ Keys changed│
                                 └─────────────┘
`,

  keyPoints: [
    'Revocation immediately blocks compromised device',
    'Remaining devices generate new key pairs',
    'All contacts notified of key change',
    'Revocation list cached for fast checks',
  ],

  quickCheck: {
    question: 'After revoking a stolen device, can it still decrypt old messages?',
    options: [
      'No, revocation deletes all old data',
      'Yes - old messages were encrypted with old keys still on device',
      'Only if the user had backups enabled',
      'No, server re-encrypts all old messages',
    ],
    correctIndex: 1,
    explanation: 'Revocation prevents NEW messages from reaching the device. Old messages that were already decrypted/stored on the device remain accessible. This is a fundamental limitation.',
  },

  keyConcepts: [
    { title: 'Key Revocation', explanation: 'Block compromised device keys', icon: '🚫' },
    { title: 'Key Rotation', explanation: 'Generate new keys on remaining devices', icon: '🔄' },
    { title: 'Revocation List', explanation: 'Server-side blocklist of bad keys', icon: '📋' },
  ],
};

const step8: GuidedStep = {
  id: 'apple-encryption-step-8',
  stepNumber: 8,
  frIndex: 6,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-7: Key rotation and device revocation',
    taskDescription: 'Implement key rotation APIs and revocation list management',
    successCriteria: [
      'Click on App Server',
      'Add APIs: POST /api/devices/revoke, POST /api/keys/rotate',
      'Open Python tab',
      'Implement revoke_device(), rotate_keys(), check_revocation_list() functions',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
    requireSecureEnclaveEnabled: true,
  },

  hints: {
    level1: 'Click on App Server, add revocation and rotation APIs',
    level2: 'In Python tab, implement revocation list checking, device key revocation, and new key generation for remaining devices',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/devices/revoke', 'POST /api/keys/rotate'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Add Device Verification & Safety Numbers
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🎭',
  scenario: "A sophisticated attacker is performing a man-in-the-middle attack!",
  hook: "They've compromised the server's key distribution and inserted their own public key. Users think they're talking to each other, but the attacker is reading everything!",
  challenge: "Implement device verification with safety numbers (key fingerprints).",
  illustration: 'mitm-attack',
};

const step9Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'Device verification enabled!',
  achievement: 'Users can verify they\'re talking to the right person',
  metrics: [
    { label: 'Safety numbers generated', after: '✓' },
    { label: 'Out-of-band verification', after: 'Enabled' },
    { label: 'MITM detection', after: 'Possible' },
  ],
  nextTeaser: "But what about encrypted file backups?",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Trust Establishment: Safety Numbers & Key Fingerprints',
  conceptExplanation: `How do you know you're really talking to your friend and not an imposter?

**The MITM Problem:**
- Alice requests Bob's public key from server
- Attacker controls server, sends THEIR key instead
- Alice encrypts with attacker's key
- Attacker decrypts, reads message, re-encrypts with Bob's real key
- Neither Alice nor Bob know they've been compromised!

**The Solution: Safety Numbers (Key Fingerprints)**
1. **Generate fingerprint** - Hash of public key (SHA-256)
2. **Display as numbers** - "42 1337 8675 3099 4815 1623"
3. **Out-of-band verification** - Compare in person, phone call, video chat
4. **Mark as verified** - App remembers this device is trusted
5. **Alert on change** - If fingerprint changes, show big warning

**Implementation:**
\`\`\`python
# Generate safety number from public keys
def generate_safety_number(alice_public_key, bob_public_key):
    # Combine both keys (deterministic order)
    combined = min(alice_key, bob_key) + max(alice_key, bob_key)

    # Hash and convert to decimal
    hash = sha256(combined)
    safety_number = int(hash.hex()[:12], 16)

    # Format: "42 1337 8675 3099"
    return format_as_groups(safety_number)
\`\`\`

**User Flow:**
1. Alice opens chat with Bob
2. App shows: "Safety Number: 42 1337 8675"
3. Alice calls Bob: "What's your safety number for me?"
4. Bob reads from his app: "42 1337 8675"
5. Numbers match! ✅ Alice marks Bob as verified
6. If keys ever change, app warns: "Bob's safety number changed!"

**This defeats MITM:**
- Attacker's fake key produces DIFFERENT safety number
- When Alice and Bob compare, numbers don't match
- Attack detected!`,

  whyItMatters: 'Without key verification:\n1. Cannot detect MITM attacks\n2. Compromised server can impersonate anyone\n3. Zero-knowledge claims are meaningless\n4. Users have no way to establish trust',

  famousIncident: {
    title: 'Telegram vs. Signal Security Debate',
    company: 'Telegram & Signal',
    year: '2020',
    whatHappened: 'Security experts criticized Telegram for making safety number verification optional and hard to find. Signal makes it prominent. In security testing, researchers found many Telegram users were victims of MITM attacks and didn\'t know.',
    lessonLearned: 'Safety number verification must be easy, visible, and encouraged - not buried in settings.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'WhatsApp & Signal',
    scenario: 'Billions of users verifying safety numbers',
    howTheyDoIt: 'Both show 60-digit safety numbers, QR codes for scanning, and prominent warnings when keys change',
  },

  diagram: `
MITM Attack Without Verification:          With Safety Number Verification:

┌────────┐                ┌────────┐        ┌────────┐                ┌────────┐
│ Alice  │                │  Bob   │        │ Alice  │                │  Bob   │
└───┬────┘                └───┬────┘        └───┬────┘                └───┬────┘
    │                         │                 │                         │
    │ Get Bob's key           │                 │ Safety #: 42 1337       │
    ▼                         ▼                 │                         │
┌──────────────────────────────────┐            │ "Bob, what's your      │
│         ATTACKER                 │            │  safety number?"       │
│  Sends FAKE key                  │            │                         │
│  Alice → [Attacker] → Bob        │            │ ◀─── Phone call ────   │
│  ✗ Cannot detect!                │            │                         │
└──────────────────────────────────┘            │ "42 1337"               │
                                                │                         │
                                                │ Numbers match! ✅        │
                                                │ Attack would show       │
                                                │ DIFFERENT number ✗      │
`,

  keyPoints: [
    'Safety number = fingerprint of public key exchange',
    'Users verify numbers out-of-band (in person, phone)',
    'Defeats MITM attacks at server level',
    'App must warn loudly when safety numbers change',
  ],

  quickCheck: {
    question: 'Why must safety number verification happen out-of-band (not through the app)?',
    options: [
      'It\'s faster that way',
      'Because attacker could intercept in-app verification',
      'To make it more user-friendly',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'If the attacker controls the app channel (MITM), they could fake in-app verification. Must verify through separate channel.',
  },

  keyConcepts: [
    { title: 'Safety Number', explanation: 'Fingerprint of key exchange', icon: '🔢' },
    { title: 'Out-of-Band', explanation: 'Verify via separate channel', icon: '📞' },
    { title: 'MITM Detection', explanation: 'Mismatched numbers reveal attack', icon: '🛡️' },
  ],
};

const step9: GuidedStep = {
  id: 'apple-encryption-step-9',
  stepNumber: 9,
  frIndex: 5,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-6: Device verification to prevent MITM',
    taskDescription: 'Implement safety number generation and verification UI',
    successCriteria: [
      'Click on App Server',
      'Add API: GET /api/verification/safety-number',
      'Open Python tab',
      'Implement generate_safety_number(), verify_safety_number() functions',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
    requireSecureEnclaveEnabled: true,
  },

  hints: {
    level1: 'Click on App Server, add safety number API',
    level2: 'In Python tab, implement SHA-256 fingerprinting of public key pairs and formatting as human-readable numbers',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/verification/safety-number'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Add Encrypted Backup with User Passphrase
// =============================================================================

const step10Story: StoryContent = {
  emoji: '😱',
  scenario: "A user just lost all their devices in a house fire!",
  hook: "They have a new phone, but ALL their encrypted messages and data are gone forever. Years of conversations, photos, documents - all lost. They're devastated.",
  challenge: "Implement encrypted backups with user-controlled passphrase recovery.",
  illustration: 'data-loss',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built an Apple-grade E2EE platform!',
  achievement: 'A zero-knowledge, end-to-end encrypted platform with military-grade security',
  metrics: [
    { label: 'End-to-end encryption', after: '✓' },
    { label: 'Perfect forward secrecy', after: '✓' },
    { label: 'Secure Enclave storage', after: '✓' },
    { label: 'Multi-device sync', after: '✓' },
    { label: 'Key rotation', after: '✓' },
    { label: 'Device verification', after: '✓' },
    { label: 'Encrypted backups', after: '✓' },
    { label: 'Zero-knowledge architecture', after: '✓' },
  ],
  nextTeaser: "You've mastered advanced security system design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Encrypted Backups: The Ultimate Trade-off',
  conceptExplanation: `This is the HARDEST design decision in E2EE: recoverability vs. security.

**The Dilemma:**
- **Option A: No backups** - Perfect security, but lose everything if all devices lost
- **Option B: Server-held recovery key** - Can recover, but server can decrypt (breaks E2EE)
- **Option C: User passphrase-encrypted backup** - Balance of security and recovery

**We choose Option C: Passphrase-Protected Backups**

**How it works:**
1. **User sets strong passphrase** (not password!)
   - Minimum 20 characters
   - App shows strength meter
   - Must be memorable (not stored anywhere)

2. **Derive backup key from passphrase**
   - Use PBKDF2 or Argon2 (key derivation function)
   - 100,000+ iterations (slow, defeats brute force)
   - Salt stored separately
   \`\`\`python
   backup_key = Argon2(passphrase, salt, iterations=100000)
   \`\`\`

3. **Encrypt user's private keys with backup key**
   - User's device keys encrypted
   - Encrypted backup stored on server
   - Server CANNOT decrypt (doesn't have passphrase)

4. **Recovery process**
   - User gets new device
   - Enters passphrase
   - Derive backup key
   - Decrypt and restore private keys
   - Can now read old messages!

**Security Properties:**
- Server stores encrypted backup (zero-knowledge maintained)
- Without passphrase, backup is worthless
- Brute force resistant (Argon2 is intentionally slow)
- User must remember strong passphrase (trade-off!)

**Warnings to user:**
- "Your passphrase cannot be recovered"
- "If you forget it, your data is lost forever"
- "We cannot help you - this is by design"
- "Choose a strong, memorable passphrase"`,

  whyItMatters: 'Without encrypted backups:\n1. Users lose all data if devices lost\n2. Fear of loss prevents adoption\n3. Corporate users need recovery options\n4. But must not compromise zero-knowledge!',

  famousIncident: {
    title: 'Apple vs. FBI iCloud Backup Decryption',
    company: 'Apple',
    year: '2016',
    whatHappened: 'Apple gave FBI access to San Bernardino shooter\'s iCloud backup because it was encrypted with Apple-held keys (not E2EE). This led Apple to introduce "Advanced Data Protection" where iCloud backups are E2EE with user-held keys. Apple cannot decrypt.',
    lessonLearned: 'Recovery mechanisms are the biggest weakness in E2EE systems. User-controlled passphrases are the only way to maintain zero-knowledge.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Apple iCloud Advanced Data Protection',
    scenario: 'E2EE backups for iCloud',
    howTheyDoIt: 'Users enable ADP and set up recovery key or recovery contact. Apple cannot decrypt backups. User responsible for recovery.',
  },

  diagram: `
Traditional Cloud Backup:           Passphrase-Protected E2EE Backup:

┌────────────────────┐              ┌────────────────────┐
│ Cloud Storage      │              │ Cloud Storage      │
│                    │              │                    │
│ [User Data]        │              │ [Encrypted Blob]   │
│  (plaintext!)      │              │  (unreadable)      │
│                    │              │                    │
│ ✗ Provider can     │              │ ✓ Provider cannot  │
│   read everything  │              │   decrypt          │
└────────────────────┘              └────────────────────┘
         ▲                                   ▲
         │                                   │
  Provider has key                    ┌──────────────┐
                                      │ User knows   │
                                      │ passphrase   │
                                      │ (only way to │
                                      │  decrypt)    │
                                      └──────────────┘

If user forgets passphrase → data lost forever
This is the price of true E2EE!
`,

  keyPoints: [
    'Passphrase-encrypted backups maintain zero-knowledge',
    'Use Argon2 key derivation (slow, brute-force resistant)',
    'Server stores encrypted backup, cannot decrypt',
    'User must remember passphrase or lose all data',
  ],

  quickCheck: {
    question: 'Why can\'t the service provider help if user forgets their backup passphrase?',
    options: [
      'They don\'t want to help',
      'Provider doesn\'t have the passphrase - it was never sent to them',
      'It would cost too much',
      'It\'s against the law',
    ],
    correctIndex: 1,
    explanation: 'In zero-knowledge architecture, the passphrase never leaves the user\'s device. Provider physically cannot decrypt without it.',
  },

  keyConcepts: [
    { title: 'Key Derivation', explanation: 'Derive encryption key from passphrase', icon: '🔑' },
    { title: 'Argon2', explanation: 'Slow KDF that defeats brute force', icon: '🐌' },
    { title: 'Recovery Trade-off', explanation: 'Security vs. recoverability', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'apple-encryption-step-10',
  stepNumber: 10,
  frIndex: 1,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-2: Encrypted data storage with backup/recovery',
    taskDescription: 'Implement passphrase-encrypted backup system',
    successCriteria: [
      'Click on App Server',
      'Add APIs: POST /api/backup/create, POST /api/backup/restore',
      'Open Python tab',
      'Implement derive_backup_key(), encrypt_backup(), restore_from_backup() functions using Argon2',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
    requireSecureEnclaveEnabled: true,
  },

  hints: {
    level1: 'Click on App Server, add backup creation and restore APIs',
    level2: 'In Python tab, implement Argon2 key derivation from passphrase, encrypt private keys with derived key, store encrypted backup',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/backup/create', 'POST /api/backup/restore'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l5SecurityAppleEncryptionGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-security-apple-encryption',
  title: 'Design Apple-Style Encryption Platform',
  description: 'Build an end-to-end encrypted messaging and storage platform with zero-knowledge architecture, perfect forward secrecy, and Secure Enclave integration',
  difficulty: 'expert',
  estimatedMinutes: 70,

  welcomeStory: {
    emoji: '🔐',
    hook: "You've been hired as Chief Security Architect at Apple!",
    scenario: "Your mission: Build Apple's next-generation iMessage and iCloud encryption platform - with end-to-end encryption, zero-knowledge architecture, and military-grade security.",
    challenge: "Can you design a system where even Apple cannot read user messages, yet still provide seamless multi-device sync and recovery?",
  },

  requirementsPhase: appleEncryptionRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'End-to-End Encryption (E2EE)',
    'Public Key Infrastructure (PKI)',
    'Zero-Knowledge Architecture',
    'Secure Enclave / HSM',
    'Perfect Forward Secrecy (PFS)',
    'Asymmetric Cryptography',
    'Key Management & Rotation',
    'Device Verification',
    'Safety Numbers / Fingerprints',
    'Ephemeral Keys',
    'Multi-Device Sync with E2EE',
    'Key Revocation',
    'Encrypted Backups',
    'Key Derivation (Argon2/PBKDF2)',
    'Defense in Depth',
  ],

  ddiaReferences: [
    'Chapter 9: Consistency and Consensus (Trust establishment)',
    'Chapter 7: Transactions (Key rotation atomicity)',
    'Chapter 5: Replication (Multi-device key distribution)',
    'Chapter 4: Encoding (Cryptographic encoding)',
  ],
};

export default l5SecurityAppleEncryptionGuidedTutorial;
