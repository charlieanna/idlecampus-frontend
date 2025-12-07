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
 * Key-Value Store Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches distributed system design concepts
 * while building a distributed key-value store like Redis or DynamoDB.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (partitioning, replication, consistency, performance)
 *
 * Key Concepts:
 * - Hash-based storage and retrieval
 * - Consistent hashing for partitioning
 * - Replication strategies (leader-follower, quorum)
 * - Consistency models (strong vs eventual)
 * - Performance optimization (caching, load balancing)
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const keyValueStoreRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a distributed key-value store like Redis or DynamoDB",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Principal Engineer at DataSystems Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the fundamental operations users need from a key-value store?",
      answer: "Users need three basic operations:\n\n1. **PUT(key, value)** - Store or update a value for a key\n2. **GET(key)** - Retrieve the value for a key\n3. **DELETE(key)** - Remove a key-value pair\n\nThese are the ONLY operations - no complex queries, joins, or transactions for now.",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Simplicity is power - key-value stores trade query flexibility for extreme performance",
    },
    {
      id: 'data-types',
      category: 'functional',
      question: "What types of values can be stored? Are there size limits?",
      answer: "For the MVP:\n- **Values**: Any binary data (strings, JSON, serialized objects)\n- **Max key size**: 256 bytes\n- **Max value size**: 1MB\n- **Keys must be unique** - duplicate PUT overwrites\n\nThink of it like a giant hash map in the cloud!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Size limits affect storage strategy and network transfer optimization",
    },
    {
      id: 'uniqueness-consistency',
      category: 'functional',
      question: "If I PUT(key='user:123', value='Alice'), then immediately GET(key='user:123'), what should I see?",
      answer: "You should see 'Alice'! This is called **read-after-write consistency**. When YOU write data, YOU should immediately see your own writes.\n\nBut if ANOTHER client does a GET right after your PUT, they might see old data for a few milliseconds (eventual consistency).",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Consistency guarantees are fundamental to system design - this shapes replication strategy",
    },
    {
      id: 'data-durability',
      category: 'functional',
      question: "What happens to data if a server crashes? Should data survive?",
      answer: "Yes! Data must be **durable**. If a server crashes, data should NOT be lost. This requires:\n1. Writing to disk (not just memory)\n2. Replication across multiple servers\n3. Persistent storage",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Durability requires persistence and replication - these are separate concerns",
    },

    // CLARIFICATIONS
    {
      id: 'ttl-expiration',
      category: 'clarification',
      question: "Should keys automatically expire after a certain time (TTL)?",
      answer: "For the MVP, no automatic expiration. Keys live forever until explicitly deleted. TTL is a great v2 feature (Redis supports this), but let's keep it simple for now.",
      importance: 'nice-to-have',
      insight: "TTL adds complexity with background cleanup processes - good to defer",
    },
    {
      id: 'atomic-operations',
      category: 'clarification',
      question: "Do we need atomic operations like increment, compare-and-swap, or transactions?",
      answer: "Not for the MVP. Just simple PUT/GET/DELETE. Each operation is atomic individually, but no multi-key transactions.\n\nFor v2, we could add atomic increments (INCR) like Redis.",
      importance: 'nice-to-have',
      insight: "Transactions add significant complexity - start with simple atomicity",
    },

    // SCALE & NFRs
    {
      id: 'throughput-scale',
      category: 'throughput',
      question: "How many requests per second should the system handle?",
      answer: "We need to support:\n- **100,000 reads/second** at peak\n- **20,000 writes/second** at peak\n- **5:1 read-to-write ratio**\n\nThis is similar to a production cache or session store.",
      importance: 'critical',
      calculation: {
        formula: "100K reads + 20K writes = 120K total ops/sec",
        result: "120,000 operations/second at peak",
      },
      learningPoint: "Read-heavy workload suggests caching and read replicas are critical",
    },
    {
      id: 'throughput-storage',
      category: 'throughput',
      question: "How much data should the system store?",
      answer: "Plan for **10TB of total data** across all keys. With 1MB max value size, that's potentially 10 million keys minimum, but likely billions of smaller keys.",
      importance: 'critical',
      learningPoint: "10TB won't fit on one server - we'll need partitioning (sharding)",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "What are the latency requirements for GET and PUT operations?",
      answer: "These are strict:\n- **GET**: p99 < 5ms (users waiting in real-time)\n- **PUT**: p99 < 10ms (slightly more acceptable)\n\nKey-value stores are used for HOT data - speed is critical!",
      importance: 'critical',
      learningPoint: "Sub-10ms latency means in-memory caching and optimized network paths",
    },
    {
      id: 'availability-target',
      category: 'burst',
      question: "What's the availability target? How much downtime is acceptable?",
      answer: "We need **99.9% availability** (three nines).\n\nThat allows:\n- 8.7 hours downtime per year\n- 43 minutes per month\n- ~10 seconds per day\n\nTo achieve this, we need replication and automatic failover.",
      importance: 'critical',
      insight: "High availability requires no single points of failure",
    },
    {
      id: 'consistency-vs-availability',
      category: 'burst',
      question: "If there's a network partition, should we favor consistency or availability?",
      answer: "This is the **CAP theorem** tradeoff!\n\nFor this system: **Favor Availability** (AP system)\n- During network splits, keep serving reads/writes\n- Accept eventual consistency\n- Similar to DynamoDB, Cassandra\n\n(Alternative: CP system like Redis would reject writes during partitions)",
      importance: 'critical',
      learningPoint: "CAP theorem: Choose 2 of Consistency, Availability, Partition-tolerance",
    },
    {
      id: 'partition-strategy',
      category: 'payload',
      question: "How should we distribute data across multiple servers?",
      answer: "Use **consistent hashing** for partitioning!\n\nWhy?\n- Evenly distributes keys across servers\n- Minimal data movement when adding/removing servers\n- Better than simple modulo hashing\n\nExample: hash(key) % num_servers (simple) vs consistent hash ring (better)",
      importance: 'critical',
      learningPoint: "Consistent hashing is the gold standard for distributed key-value stores",
    },
    {
      id: 'replication-strategy',
      category: 'payload',
      question: "How many copies of each key should we maintain?",
      answer: "Use **replication factor = 3**\n\nEach key is stored on 3 different servers:\n- Survives 2 server failures\n- Balances durability vs storage cost\n- Standard for production systems (DynamoDB, Cassandra use 3)",
      importance: 'critical',
      learningPoint: "Replication factor determines fault tolerance - 3 is the sweet spot",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'uniqueness-consistency', 'data-durability'],
  criticalFRQuestionIds: ['core-operations', 'data-durability'],
  criticalScaleQuestionIds: ['throughput-scale', 'latency-requirements', 'consistency-vs-availability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: PUT operation',
      description: 'Store or update a key-value pair',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: GET operation',
      description: 'Retrieve value for a given key',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: DELETE operation',
      description: 'Remove a key-value pair',
      emoji: '🗑️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Read-after-write consistency',
      description: 'Users see their own writes immediately',
      emoji: '✅',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Data durability',
      description: 'Data survives server crashes',
      emoji: '💾',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million applications',
    writesPerDay: '1.7 billion writes',
    readsPerDay: '8.6 billion reads',
    peakMultiplier: 1.5,
    readWriteRatio: '5:1',
    calculatedWriteRPS: { average: 20000, peak: 30000 },
    calculatedReadRPS: { average: 100000, peak: 150000 },
    maxPayloadSize: '~1MB (max value)',
    storagePerRecord: '~10KB average',
    storageGrowthPerYear: '~10TB total capacity',
    redirectLatencySLA: 'p99 < 5ms (GET)',
    createLatencySLA: 'p99 < 10ms (PUT)',
  },

  architecturalImplications: [
    '✅ Read-heavy (5:1) → Read replicas and caching critical',
    '✅ 120K ops/sec → Need multiple storage nodes and partitioning',
    '✅ 10TB data → Consistent hashing for even distribution',
    '✅ p99 < 5ms → In-memory storage with disk persistence',
    '✅ 99.9% availability → Replication factor of 3, automatic failover',
    '✅ AP system → Eventual consistency, favor availability',
  ],

  outOfScope: [
    'TTL and automatic expiration',
    'Multi-key transactions',
    'Atomic operations (INCR, CAS)',
    'Secondary indexes or range queries',
    'Geo-replication',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple key-value store where clients can PUT, GET, and DELETE data. The complex challenges like partitioning, replication, and consistency will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to DataSystems Inc! You've been hired to build a distributed key-value store.",
  hook: "Your first client just connected. They want to store user session data with millisecond latency!",
  challenge: "Set up the basic connection so clients can send requests to your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your key-value store is online!',
  achievement: 'Clients can now send requests to your App Server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting connections', after: '✓' },
  ],
  nextTeaser: "But the server is empty... let's implement the core operations!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every distributed system starts with **Clients** connecting to **Servers**.

When an application wants to use your key-value store:
1. The application is the **Client**
2. It sends requests to your **App Server** (storage node)
3. The server processes PUT/GET/DELETE and returns results

For key-value operations:
- PUT: Client → POST /api/kv/{key} → Server
- GET: Client → GET /api/kv/{key} → Server
- DELETE: Client → DELETE /api/kv/{key} → Server

This is the foundation of ALL distributed storage systems!`,

  whyItMatters: 'Without this connection, applications can\'t store or retrieve data from your system.',

  realWorldExample: {
    company: 'Redis',
    scenario: 'Handling millions of ops/sec',
    howTheyDoIt: 'Redis uses a custom binary protocol (RESP) optimized for speed. Clients connect via TCP and send commands like "SET key value" and "GET key".',
  },

  keyPoints: [
    'Client = the application using your key-value store',
    'App Server = your storage node that handles KV operations',
    'TCP/HTTP = protocols for client-server communication',
    'Each request is independent and self-contained',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Application that stores/retrieves data', icon: '📱' },
    { title: 'Storage Node', explanation: 'Server that handles KV operations', icon: '🖥️' },
    { title: 'Request/Response', explanation: 'Client asks, server responds', icon: '↔️' },
  ],
};

const step1: GuidedStep = {
  id: 'kv-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all key-value operations',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications using the KV store', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles PUT/GET/DELETE operations', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send KV requests' },
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
    level2: 'Click and drag from Client to App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement KV Operations (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to store data yet!",
  hook: "A client just tried PUT('session:abc', 'user-data') but got an error.",
  challenge: "Write the Python code to handle PUT, GET, and DELETE operations using an in-memory hash table.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your KV store works!',
  achievement: 'You implemented the core hash-based storage',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can PUT data', after: '✓' },
    { label: 'Can GET data', after: '✓' },
    { label: 'Can DELETE data', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all data vanishes...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Hash-Based Storage: The Heart of Key-Value Stores',
  conceptExplanation: `Key-value stores are built on **hash tables** (dictionaries in Python).

**How it works:**
\`\`\`python
# In-memory storage
kv_store = {}

def put(key, value):
    kv_store[key] = value
    return "OK"

def get(key):
    return kv_store.get(key, None)

def delete(key):
    if key in kv_store:
        del kv_store[key]
        return True
    return False
\`\`\`

**Why hash tables?**
- O(1) average lookup time
- O(1) insert time
- O(1) delete time
- Perfect for key-based access!

This is exactly how Redis, Memcached, and DynamoDB work internally - just distributed across many servers.`,

  whyItMatters: 'Hash tables provide the constant-time performance that makes key-value stores incredibly fast.',

  realWorldExample: {
    company: 'Memcached',
    scenario: 'Facebook uses Memcached for billions of cache lookups per second',
    howTheyDoIt: 'Each Memcached server is essentially a giant hash table in RAM. Hash function maps keys to memory addresses for O(1) access.',
  },

  famousIncident: {
    title: 'Amazon DynamoDB Launch Failure',
    company: 'Amazon DynamoDB',
    year: '2012',
    whatHappened: 'At launch, DynamoDB\'s hash function wasn\'t evenly distributing keys across partitions. Some partitions got 10x more data than others, causing severe performance hotspots. Requests to hot partitions were timing out.',
    lessonLearned: 'Hash function quality matters! Use well-tested hash functions (MD5, SHA-256) that distribute keys evenly.',
    icon: '🔥',
  },

  keyPoints: [
    'Hash table provides O(1) average-case performance',
    'Key uniqueness enforced automatically by hash table',
    'Start with in-memory storage (fast but volatile)',
    'Handle edge cases (key not found, null values)',
  ],

  quickCheck: {
    question: 'Why do key-value stores use hash tables instead of arrays or linked lists?',
    options: [
      'Hash tables use less memory',
      'Hash tables provide O(1) lookup time',
      'Hash tables support range queries',
      'Hash tables are easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Hash tables provide O(1) average-case lookup, insert, and delete - exactly what KV stores need for fast access by key.',
  },

  keyConcepts: [
    { title: 'Hash Table', explanation: 'Data structure mapping keys to values', icon: '#️⃣' },
    { title: 'O(1) Lookup', explanation: 'Constant time access regardless of data size', icon: '⚡' },
    { title: 'Hash Function', explanation: 'Converts keys to array indices', icon: '🔢' },
  ],
};

const step2: GuidedStep = {
  id: 'kv-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: PUT operation, FR-2: GET operation, FR-3: DELETE operation',
    taskDescription: 'Configure APIs and implement Python handlers for key-value operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/kv/{key}, GET /api/kv/{key}, DELETE /api/kv/{key} APIs',
      'Open the Python tab',
      'Implement put(), get(), and delete() functions using a hash table',
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
    level1: 'Click on the App Server, assign the 3 APIs, then write Python code in the code tab',
    level2: 'Use a Python dictionary (kv_store = {}) to store key-value pairs. Implement put(key, value), get(key), and delete(key) functions.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Persistence with Database
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your server crashed and restarted due to a memory spike.",
  hook: "All the cached session data is GONE! Applications are failing because user sessions don't exist anymore. Your phone is exploding with alerts!",
  challenge: "Add a database to persist key-value pairs to disk so data survives crashes.",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your data is now durable!',
  achievement: 'Key-value pairs survive server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Durability', before: '0% (lost on crash)', after: '100%' },
  ],
  nextTeaser: "Great! But now the database is the bottleneck for reads...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Durability: Persisting Data to Disk',
  conceptExplanation: `In-memory storage is **volatile** - it disappears when the process crashes or restarts.

**The problem:**
- RAM is fast but temporary
- Server crashes = total data loss
- No recovery possible

**The solution: Database**
- Write data to disk (durable)
- Survives crashes, restarts, power failures
- Can replicate to other machines

**For key-value stores:**
- Store each key-value pair as a row
- Simple schema: \`(key TEXT PRIMARY KEY, value BLOB)\`
- Index on key for O(1) lookups

**Best practice: Write-through cache**
1. Write to database first (durability)
2. Also store in memory (speed)
3. Reads hit memory, fallback to DB`,

  whyItMatters: 'Without persistence, your key-value store is just an expensive RAM disk. Data must survive crashes.',

  realWorldExample: {
    company: 'Redis',
    scenario: 'Persistence strategies',
    howTheyDoIt: 'Redis offers two modes: RDB (periodic snapshots) and AOF (append-only file logging every write). AOF provides better durability but slower performance.',
  },

  famousIncident: {
    title: 'GitHub Redis Outage',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub used Redis for caching without persistence enabled. During a network partition, Redis instances were restarted and lost ALL cached data. The cache stampede that followed brought down the entire site for hours.',
    lessonLearned: 'Even cache systems need persistence! When cache is cold after restart, the thundering herd of requests can crush your database.',
    icon: '⚡',
  },

  keyPoints: [
    'RAM is volatile, disk is durable',
    'Write-through: write to DB, then cache in memory',
    'Database provides ACID guarantees',
    'Trade-off: durability costs performance (disk I/O)',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         WRITE-THROUGH PATTERN                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  PUT(key, value):                               │
│                                                 │
│  ┌────────┐    1. write    ┌──────────┐        │
│  │ Client │ ─────────────→ │App Server│        │
│  └────────┘                └────┬─────┘        │
│                                 │              │
│                         2. persist to DB       │
│                                 ▼              │
│                           ┌──────────┐         │
│                           │ Database │         │
│                           └──────────┘         │
│                                 │              │
│                         3. cache in RAM        │
│                                 ▼              │
│                           ┌──────────┐         │
│                           │  Memory  │         │
│                           │{key: val}│         │
│                           └──────────┘         │
│                                                 │
│  GET(key): Check memory → if miss, query DB    │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Volatile', explanation: 'Data lost when process stops (RAM)', icon: '💨' },
    { title: 'Durable', explanation: 'Data survives crashes (disk, database)', icon: '💾' },
    { title: 'Write-through', explanation: 'Write to persistent store, cache for reads', icon: '📝' },
  ],

  quickCheck: {
    question: 'Why do we need both a database AND in-memory storage?',
    options: [
      'Databases are too expensive',
      'Database provides durability, memory provides speed',
      'Memory provides durability, database provides speed',
      'We only need one or the other',
    ],
    correctIndex: 1,
    explanation: 'Database writes to disk for durability (survives crashes). Memory provides fast O(1) reads. We need both!',
  },
};

const step3: GuidedStep = {
  id: 'kv-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-5: Data must persist across server restarts',
    taskDescription: 'Add a Database to store key-value pairs durably',
    componentsNeeded: [
      { type: 'client', reason: 'Applications using the KV store', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes KV operations', displayName: 'App Server' },
      { type: 'database', reason: 'Persists data to disk', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send requests' },
      { from: 'App Server', to: 'Database', reason: 'Persist and retrieve data' },
    ],
    successCriteria: [
      'Add Database component',
      'Connect App Server to Database',
      'Data now survives restarts',
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
    level1: 'Add a Database component and connect App Server to it',
    level2: 'Build the flow: Client → App Server → Database. The database provides persistence.',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Cache for Read Performance
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your key-value store is live, but users are complaining about slow reads.",
  hook: "Every GET request hits the database! Disk I/O takes 10-50ms. You promised sub-5ms latency!",
  challenge: "Add an in-memory cache to serve hot keys at lightning speed.",
  illustration: 'slow-performance',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Reads are now blazing fast!',
  achievement: 'Cache provides sub-millisecond latency for hot keys',
  metrics: [
    { label: 'GET latency', before: '30ms', after: '1ms' },
    { label: 'Database load', before: '100K reads/sec', after: '5K reads/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But we still have a single point of failure...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Caching: In-Memory Speed for Hot Data',
  conceptExplanation: `The cache is the secret weapon of high-performance KV stores.

**The latency gap:**
- RAM access: 100 nanoseconds (0.0001ms)
- SSD access: 100 microseconds (0.1ms)
- HDD access: 10 milliseconds (10ms)

That's a **100,000x difference** between RAM and disk!

**Cache strategy for KV stores:**
1. **GET**: Check cache first
   - Cache HIT: Return immediately (< 1ms)
   - Cache MISS: Query database, populate cache
2. **PUT**: Write to database, update cache
3. **DELETE**: Remove from database AND cache

**Why this works:**
- 80/20 rule: 20% of keys get 80% of traffic
- Hot keys stay in cache
- Cold keys hit database (acceptable for rare access)`,

  whyItMatters: 'Without caching, every read hits disk. At 100K reads/sec, the database becomes a bottleneck.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Timeline cache serving billions of reads',
    howTheyDoIt: 'Twitter caches timelines in Redis. Popular users (with millions of followers) have their timelines cached in memory. 99% of timeline reads hit cache.',
  },

  famousIncident: {
    title: 'Memcached Thundering Herd',
    company: 'Digg',
    year: '2010',
    whatHappened: 'Digg\'s Memcached cluster crashed, causing all traffic to hit the MySQL database simultaneously. The database couldn\'t handle the load and crashed. The cascading failure took down the entire site for hours.',
    lessonLearned: 'Cache failures cause thundering herds. Always have circuit breakers and rate limiting to protect the database.',
    icon: '🐘',
  },

  keyPoints: [
    'Cache = in-memory storage (Redis, Memcached)',
    'Cache-aside pattern: check cache, fallback to DB',
    'Write-through: update both DB and cache on PUT',
    'Invalidate cache on DELETE to prevent stale reads',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         CACHE-ASIDE PATTERN                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  GET(key):                                      │
│                                                 │
│           ┌──────┐    1. check    ┌───────┐    │
│           │Client│ ─────────────→ │ Cache │    │
│           └──────┘                └───┬───┘    │
│              ▲                        │        │
│              │                        │        │
│              │ 3. return        HIT? │        │
│              │                        │        │
│              │                   MISS ▼        │
│              │              ┌─────────────┐    │
│              └──────────────│  Database   │    │
│                     2. query└─────────────┘    │
│                                                 │
│  95% cache hit → 1ms latency                   │
│   5% cache miss → 30ms latency (acceptable)    │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache (fast!)', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache, query DB', icon: '❌' },
    { title: 'Hit Rate', explanation: '% of requests served from cache', icon: '📊' },
    { title: 'Write-through', explanation: 'Update cache when writing to DB', icon: '✍️' },
  ],

  quickCheck: {
    question: 'Why does caching improve read performance so dramatically?',
    options: [
      'Cache has better algorithms',
      'RAM access is 100,000x faster than disk',
      'Cache has more storage space',
      'Database is poorly designed',
    ],
    correctIndex: 1,
    explanation: 'RAM access takes nanoseconds, disk access takes milliseconds - a 100,000x difference in speed!',
  },
};

const step4: GuidedStep = {
  id: 'kv-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'System must handle 100K reads/sec with p99 < 5ms',
    taskDescription: 'Add a Cache to serve hot keys from memory',
    componentsNeeded: [
      { type: 'client', reason: 'Applications using KV store', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes requests', displayName: 'App Server' },
      { type: 'database', reason: 'Persistent storage', displayName: 'Database' },
      { type: 'cache', reason: 'In-memory hot data', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send requests' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache first' },
      { from: 'App Server', to: 'Database', reason: 'Fallback and persistence' },
    ],
    successCriteria: [
      'Add Cache component',
      'Connect App Server to Cache',
      'Maintain connection to Database for cache misses',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add a Cache between App Server and Database',
    level2: 'App Server should connect to BOTH Cache (for reads) and Database (for persistence)',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Partitioning (Sharding) for Scale
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Success! Your KV store is popular. But now you have a problem...",
  hook: "You have 10TB of data and it won't fit on a single database server! Plus, one server can't handle 120K ops/sec.",
  challenge: "Partition (shard) the data across multiple servers using consistent hashing.",
  illustration: 'data-explosion',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your system now scales horizontally!',
  achievement: 'Data is partitioned across multiple storage nodes',
  metrics: [
    { label: 'Storage capacity', before: '2TB (1 server)', after: '10TB+ (5 servers)' },
    { label: 'Throughput', before: '25K ops/sec', after: '125K ops/sec' },
    { label: 'Partition strategy', after: 'Consistent hashing' },
  ],
  nextTeaser: "But what happens if a storage node crashes?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Partitioning: Distributing Data Across Servers',
  conceptExplanation: `When data doesn't fit on one server, we **partition** (shard) it across multiple servers.

**Simple approach: Modulo hashing**
\`\`\`python
server = hash(key) % num_servers
\`\`\`

**Problem:** Adding/removing servers reshuffles MOST data!
- 3 servers → 4 servers: 75% of keys move
- Causes massive data migration

**Better approach: Consistent hashing**
- Imagine servers on a ring (0 to 2^256)
- Each key hashes to a point on the ring
- Key goes to the next server clockwise
- Adding/removing server only affects neighboring keys (~1/N)

**Example:**
- Ring: 0 ---- S1(100) ---- S2(200) ---- S3(300) ---- 0
- Key "user:123" hashes to 150 → goes to S2
- Key "user:456" hashes to 250 → goes to S3
- Add S4 at 175 → only keys between 150-175 move!

**Benefits:**
- Minimal data movement when scaling
- Even distribution of keys
- Used by DynamoDB, Cassandra, Riak`,

  whyItMatters: 'Consistent hashing enables adding/removing servers with minimal disruption - critical for scaling.',

  realWorldExample: {
    company: 'DynamoDB',
    scenario: 'Automatically partitioning trillions of items',
    howTheyDoIt: 'DynamoDB uses consistent hashing to distribute data across storage nodes. When a partition gets too large (>10GB), it automatically splits into two using consistent hashing.',
  },

  famousIncident: {
    title: 'Cassandra Cluster Rebalance Disaster',
    company: 'Netflix',
    year: '2014',
    whatHappened: 'Netflix needed to add nodes to a Cassandra cluster. Due to misconfiguration, the rebalance moved 80% of the data instead of the expected 10%. The massive data transfer saturated network bandwidth and brought down the entire streaming service.',
    lessonLearned: 'Test partition rebalancing thoroughly! Even with consistent hashing, configuration errors can cause massive data movement.',
    icon: '🌪️',
  },

  keyPoints: [
    'Partitioning = splitting data across multiple servers',
    'Modulo hashing: simple but causes massive reshuffling',
    'Consistent hashing: minimizes data movement when scaling',
    'Each partition holds a subset of keys',
    'Enables horizontal scaling for capacity and throughput',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│       CONSISTENT HASHING RING                   │
├─────────────────────────────────────────────────┤
│                                                 │
│              0 (start/end)                      │
│                   │                             │
│        ┌──────────┴──────────┐                 │
│        │                     │                 │
│    Server 3              Server 1              │
│    (300)                  (100)                │
│        │                     │                 │
│        └──────────┬──────────┘                 │
│                   │                             │
│               Server 2                          │
│                (200)                            │
│                                                 │
│  hash("user:123") = 150 → Server 2             │
│  hash("user:456") = 250 → Server 3             │
│  hash("session:x") = 50 → Server 1             │
│                                                 │
│  Add Server 4 at 175:                          │
│  → Only keys 150-175 move from S2 to S4        │
│  → Other 95% of keys stay put!                 │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Partition', explanation: 'Subset of data on one server', icon: '🗂️' },
    { title: 'Shard', explanation: 'Another term for partition', icon: '💎' },
    { title: 'Hash Ring', explanation: 'Circular space for consistent hashing', icon: '⭕' },
    { title: 'Rebalancing', explanation: 'Moving data when adding/removing servers', icon: '⚖️' },
  ],

  quickCheck: {
    question: 'Why is consistent hashing better than modulo hashing (hash(key) % N)?',
    options: [
      'It\'s faster to compute',
      'It minimizes data movement when adding/removing servers',
      'It uses less memory',
      'It provides better security',
    ],
    correctIndex: 1,
    explanation: 'Consistent hashing only moves ~1/N keys when adding/removing a server, while modulo hashing reshuffles most data.',
  },
};

const step5: GuidedStep = {
  id: 'kv-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'System must store 10TB+ data and handle 120K ops/sec',
    taskDescription: 'Add Load Balancer to distribute requests across partitioned storage nodes',
    componentsNeeded: [
      { type: 'client', reason: 'Applications using KV store', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Routes requests to correct partition', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Storage nodes (partitions)', displayName: 'App Server' },
      { type: 'database', reason: 'Persistent storage per partition', displayName: 'Database' },
      { type: 'cache', reason: 'Per-partition cache', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'LB routes by key hash' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Forward to correct partition' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache per partition' },
      { from: 'App Server', to: 'Database', reason: 'Persist per partition' },
    ],
    successCriteria: [
      'Add Load Balancer for routing',
      'Connect Client → LB → App Server → Cache + Database',
      'LB uses consistent hashing to route requests',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer to route requests to partitioned storage nodes',
    level2: 'Build: Client → Load Balancer → App Server (multiple instances for partitions) → Cache + Database',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Replication for High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes! One of your storage nodes crashes at 2 AM.",
  hook: "All keys on that partition are GONE! Applications are failing left and right. Data is LOST!",
  challenge: "Add replication - store each key on 3 different nodes so data survives failures.",
  illustration: 'server-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Your system is now fault-tolerant!',
  achievement: 'Data survives server failures with 3x replication',
  metrics: [
    { label: 'Replication factor', after: '3' },
    { label: 'Fault tolerance', after: 'Survives 2 node failures' },
    { label: 'Availability', before: '95%', after: '99.9%' },
  ],
  nextTeaser: "But now we have a new challenge - consistency...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Replication: Surviving Server Failures',
  conceptExplanation: `Without replication, when a server crashes, all its data is lost. Unacceptable!

**Replication factor = 3** (industry standard)
- Each key stored on 3 different nodes
- Can survive 2 simultaneous node failures
- Balances durability vs storage cost (3x overhead)

**How it works with consistent hashing:**
1. Key "user:123" hashes to position 150 on ring
2. Primary replica: Server at position 150 (S2)
3. Replica 2: Next server clockwise (S3 at 200)
4. Replica 3: Next server clockwise (S1 at 300)

**Replication strategies:**

**1. Leader-Follower (Master-Slave)**
- One primary handles writes
- Followers replicate from primary
- Reads can go to any replica
- Used by: Redis, MongoDB

**2. Leaderless (Dynamo-style)**
- No primary - any node can handle writes
- Use quorum: write to 2 of 3, read from 2 of 3
- Better availability during failures
- Used by: DynamoDB, Cassandra, Riak

For this KV store, we'll use **leaderless replication** for higher availability.`,

  whyItMatters: 'Replication is the ONLY way to survive hardware failures at scale. Servers WILL fail.',

  realWorldExample: {
    company: 'Amazon DynamoDB',
    scenario: 'Replicating across 3 availability zones',
    howTheyDoIt: 'Every write goes to 3 nodes in different AZs (data centers). System can survive entire AZ failure. Uses quorum reads/writes for consistency.',
  },

  famousIncident: {
    title: 'AWS S3 Outage',
    company: 'Amazon S3',
    year: '2017',
    whatHappened: 'During routine maintenance, an engineer accidentally removed too many S3 servers. The replication system couldn\'t handle the load of re-replicating data across remaining servers. S3 was down for 4 hours, taking down half the internet.',
    lessonLearned: 'Replication needs capacity planning! When nodes fail, remaining nodes handle re-replication load. Always have headroom.',
    icon: '☁️',
  },

  keyPoints: [
    'Replication factor of 3 is standard (survives 2 failures)',
    'Consistent hashing determines replica placement',
    'Leaderless replication: any node can handle writes',
    'Quorum: W + R > N ensures consistency (e.g., W=2, R=2, N=3)',
    'Replicas can be in different availability zones (AZs)',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│       REPLICATION WITH CONSISTENT HASHING       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Key: "user:123" hash → position 150           │
│                                                 │
│  Ring:                                          │
│    S1(100) -- S2(200) -- S3(300) -- S1(100)    │
│                                                 │
│  Replicas for position 150:                    │
│    1. S2 (primary - next after 150)            │
│    2. S3 (replica 1 - next after S2)           │
│    3. S1 (replica 2 - next after S3)           │
│                                                 │
│  WRITE "user:123":                              │
│    ┌──────┐                                    │
│    │Client│                                    │
│    └───┬──┘                                    │
│        │ write to quorum (2 of 3)              │
│        ├──────────┬──────────┬─────────────┐   │
│        ▼          ▼          ▼             ▼   │
│      ┌──┐      ┌──┐      ┌──┐                 │
│      │S1│      │S2│      │S3│                  │
│      └──┘      └──┘      └──┘                  │
│       ✓         ✓         ✗ (timeout)          │
│                                                 │
│  Write succeeds! 2 of 3 replicas acknowledged  │
│                                                 │
│  If S2 crashes:                                │
│    → S1 and S3 still have the data             │
│    → System continues operating                │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Replica', explanation: 'Copy of data on another server', icon: '📋' },
    { title: 'Replication Factor', explanation: 'Number of copies (typically 3)', icon: '3️⃣' },
    { title: 'Quorum', explanation: 'Minimum nodes needed for operation (W+R>N)', icon: '🗳️' },
    { title: 'Eventual Consistency', explanation: 'Replicas sync over time', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'Why is replication factor 3 common instead of 2 or 4?',
    options: [
      'It\'s the fastest option',
      'It balances fault tolerance (survive 2 failures) with cost (3x storage)',
      'It\'s required by law',
      'Databases only support factor of 3',
    ],
    correctIndex: 1,
    explanation: 'RF=3 lets you survive 2 simultaneous failures while only using 3x storage. RF=2 only survives 1 failure, RF=4 costs 4x storage for marginal benefit.',
  },
};

const step6: GuidedStep = {
  id: 'kv-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'System must survive server failures (99.9% availability)',
    taskDescription: 'Configure database replication with RF=3',
    componentsNeeded: [
      { type: 'client', reason: 'Applications', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Routes requests', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Storage nodes', displayName: 'App Server' },
      { type: 'database', reason: 'With replication', displayName: 'Database' },
      { type: 'cache', reason: 'Per-node cache', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Entry point' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Route to partitions' },
      { from: 'App Server', to: 'Cache', reason: 'Fast reads' },
      { from: 'App Server', to: 'Database', reason: 'Replicated storage' },
    ],
    successCriteria: [
      'Build full architecture',
      'Click Database → Enable replication with 3+ replicas',
      'System can now survive 2 node failures',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Build full system, then configure database replication',
    level2: 'Click on Database component → Replication settings → Set replication factor to 3',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Implement Consistency with Quorum
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🤔',
  scenario: "Your replication is working, but users are seeing weird behavior...",
  hook: "Alice writes 'user:123=active' but immediately reads back 'user:123=inactive'. The replicas are out of sync!",
  challenge: "Implement quorum-based consistency to ensure read-after-write consistency.",
  illustration: 'data-inconsistency',
};

const step7Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'Consistency achieved!',
  achievement: 'Quorum reads and writes ensure users see their own writes',
  metrics: [
    { label: 'Consistency model', after: 'Quorum (W=2, R=2, N=3)' },
    { label: 'Read-after-write', after: 'Guaranteed ✓' },
    { label: 'Availability', after: '99.9% (survives 1 node failure)' },
  ],
  nextTeaser: "Almost there! Now let's optimize for cost...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Consistency Models: Quorum Reads and Writes',
  conceptExplanation: `With replication, consistency becomes complex. How do we ensure all replicas have the same data?

**The consistency spectrum:**
1. **Strong consistency**: All replicas identical at all times (slow, less available)
2. **Eventual consistency**: Replicas sync eventually (fast, highly available)
3. **Quorum consistency**: Sweet spot - configurable trade-off

**Quorum formula: W + R > N**
- N = Replication factor (3)
- W = Write quorum (how many replicas must acknowledge write)
- R = Read quorum (how many replicas must agree on read)

**Common configurations:**

**Option 1: W=2, R=2, N=3** (balanced)
- Write to 2 of 3 replicas
- Read from 2 of 3 replicas
- Guarantees you'll read your own writes (overlap!)
- Survives 1 node failure for both reads and writes

**Option 2: W=1, R=3, N=3** (fast writes)
- Write to 1 replica (very fast!)
- Read from all 3 (slower, but consistent)
- Good for write-heavy workloads

**Option 3: W=3, R=1, N=3** (fast reads)
- Write to all 3 (slower, but durable)
- Read from 1 (very fast!)
- Good for read-heavy workloads

**For our KV store: W=2, R=2, N=3**
- Balanced performance
- Read-after-write consistency
- Survives 1 failure`,

  whyItMatters: 'Without quorum, users see stale data or lost writes. Quorum ensures consistency while maintaining availability.',

  realWorldExample: {
    company: 'Cassandra',
    scenario: 'Configurable consistency per query',
    howTheyDoIt: 'Cassandra lets you set consistency level per query: ONE (fast), QUORUM (balanced), ALL (strong). Most use QUORUM for balance.',
  },

  famousIncident: {
    title: 'Gmail Data Loss',
    company: 'Google Gmail',
    year: '2011',
    whatHappened: 'A bug caused Gmail to use W=1 (write to 1 replica only). When that replica failed before replication completed, emails were lost permanently for 150,000 users. Google had to restore from tape backups.',
    lessonLearned: 'W=1 is dangerous! Always write to quorum (W >= 2) for important data. Durability trumps speed.',
    icon: '📧',
  },

  keyPoints: [
    'Quorum ensures consistency: W + R > N',
    'W=2, R=2, N=3 provides read-after-write consistency',
    'Trade-off: consistency vs latency vs availability',
    'Higher W = slower writes but better durability',
    'Higher R = slower reads but fresher data',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│       QUORUM WRITE (W=2, N=3)                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Client writes "user:123 = active"             │
│                                                 │
│        ┌──────┐                                │
│        │Client│                                │
│        └───┬──┘                                │
│            │                                    │
│            │ Write to quorum (W=2)             │
│            │                                    │
│     ┌──────┼──────┬──────────┐                │
│     ▼      ▼      ▼          ▼                │
│   ┌───┐  ┌───┐  ┌───┐                         │
│   │ S1│  │ S2│  │ S3│                          │
│   └───┘  └───┘  └───┘                          │
│     ✓      ✓      ✗ (timeout)                  │
│                                                 │
│  Write succeeds! 2 acks received               │
│                                                 │
│  Later: Client reads "user:123"                │
│  Read from quorum (R=2):                       │
│                                                 │
│     ┌──────┬──────┬──────────┐                │
│     ▼      ▼      ▼          ▼                │
│   ┌───┐  ┌───┐  ┌───┐                         │
│   │ S1│  │ S2│  │ S3│                          │
│   └───┘  └───┘  └───┘                          │
│  active active (old value)                     │
│     ✓      ✓                                   │
│                                                 │
│  Majority says "active" → return "active"      │
│  Read-after-write consistency guaranteed!      │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Quorum', explanation: 'Majority agreement (W+R>N)', icon: '🗳️' },
    { title: 'Write Quorum', explanation: 'Replicas that must ack write', icon: '✍️' },
    { title: 'Read Quorum', explanation: 'Replicas that must agree on read', icon: '👀' },
    { title: 'Read-after-write', explanation: 'See your own writes immediately', icon: '✅' },
  ],

  quickCheck: {
    question: 'Why does W=2, R=2, N=3 guarantee read-after-write consistency?',
    options: [
      'It writes to all servers',
      'At least one server appears in both write and read quorums (overlap)',
      'It reads from all servers',
      'It uses strong consistency',
    ],
    correctIndex: 1,
    explanation: 'W=2 + R=2 = 4, which is greater than N=3. This overlap guarantees at least one server in the read quorum has the latest write.',
  },
};

const step7: GuidedStep = {
  id: 'kv-step-7',
  stepNumber: 7,
  frIndex: 5,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Users must see their own writes (read-after-write consistency)',
    taskDescription: 'Configure quorum settings (W=2, R=2) for consistency',
    componentsNeeded: [
      { type: 'client', reason: 'Applications', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Routes requests', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Storage nodes with quorum logic', displayName: 'App Server' },
      { type: 'database', reason: 'Replicated storage (RF=3)', displayName: 'Database' },
      { type: 'cache', reason: 'Per-node cache', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Entry point' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Route to partitions' },
      { from: 'App Server', to: 'Cache', reason: 'Fast reads' },
      { from: 'App Server', to: 'Database', reason: 'Quorum reads/writes' },
    ],
    successCriteria: [
      'Ensure database has RF=3 replication',
      'Configure App Server for quorum (W=2, R=2)',
      'Read-after-write consistency achieved',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Ensure database replication is enabled and configure App Server instances',
    level2: 'Database should have RF=3, App Server should have 2+ instances for partitioning',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 8: Final Exam - Production Test Cases
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎓',
  scenario: "Final Exam! Your distributed key-value store goes to production.",
  hook: "Your architecture will face 7 real-world test cases: functional requirements, performance under load, node failures, and cost constraints.",
  challenge: "Build a complete system that passes ALL test cases while staying under budget. This is what production systems face every day!",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Production Ready! All 7 test cases passed!',
  achievement: 'Complete distributed key-value store validated against production workloads',
  metrics: [
    { label: 'Test Cases Passed', after: '7/7 ✓' },
    { label: 'Throughput', after: '120K ops/sec ✓' },
    { label: 'Availability', after: '99.9% ✓' },
    { label: 'Consistency', after: 'Read-after-write ✓' },
    { label: 'Monthly Cost', after: 'Under budget ✓' },
  ],
  nextTeaser: "Congratulations! You've mastered distributed key-value store design. Try 'Solve on Your Own' mode or tackle another challenge!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production Readiness: The Complete Picture',
  conceptExplanation: `You've built all the components. Now let's verify it works in production!

**What makes a production-ready KV store:**

1. **Functional Correctness**
   - PUT/GET/DELETE work reliably
   - Keys are unique and retrievable
   - Data persists across restarts

2. **Performance**
   - Sub-5ms latency for reads (p99)
   - Sub-10ms latency for writes (p99)
   - 120K ops/sec throughput

3. **Scalability**
   - Partitioning handles 10TB+ data
   - Horizontal scaling for more throughput
   - Consistent hashing for even distribution

4. **Reliability**
   - 99.9% availability
   - Survives server failures
   - Replication factor 3

5. **Consistency**
   - Read-after-write for same client
   - Quorum reads/writes
   - Eventual consistency across replicas

6. **Cost Efficiency**
   - Right-sized instances
   - Efficient caching
   - Balanced replication

**Your system combines:**
- Hash-based storage (O(1) operations)
- Consistent hashing (even partitioning)
- Replication (fault tolerance)
- Quorum (consistency)
- Caching (performance)
- Load balancing (scalability)

This is the foundation of DynamoDB, Cassandra, Riak, and other distributed KV stores!`,

  whyItMatters: 'Production systems face real traffic, real failures, and real cost constraints. All components must work together.',

  realWorldExample: {
    company: 'DynamoDB',
    scenario: 'Powers Amazon.com during Prime Day',
    howTheyDoIt: 'DynamoDB uses all these techniques: consistent hashing, quorum replication, in-memory caching. Handles 89 million requests/second during peak shopping.',
  },

  keyPoints: [
    'Test under realistic load (120K ops/sec)',
    'Inject failures to validate fault tolerance',
    'Measure latency at p99 (not average)',
    'Verify consistency guarantees',
    'Monitor costs to stay under budget',
  ],

  keyConcepts: [
    { title: 'Production Traffic', explanation: 'Real workload patterns and scale', icon: '🌊' },
    { title: 'Failure Injection', explanation: 'Simulate crashes to test resilience', icon: '💥' },
    { title: 'SLA', explanation: 'Service Level Agreement (99.9% uptime)', icon: '📋' },
    { title: 'TCO', explanation: 'Total Cost of Ownership', icon: '💰' },
  ],

  quickCheck: {
    question: 'What is the most critical metric for a distributed KV store?',
    options: [
      'Average latency',
      'p99 latency (99th percentile)',
      'Maximum throughput',
      'Minimum cost',
    ],
    correctIndex: 1,
    explanation: 'p99 latency ensures 99% of users have good experience. Average latency hides outliers that frustrate users.',
  },
};

const step8: GuidedStep = {
  id: 'kv-step-8',
  stepNumber: 8,
  frIndex: 6,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'Final Exam: Pass all 7 production test cases',
    taskDescription: 'Build a complete distributed KV store that handles production workloads',
    componentsNeeded: [
      { type: 'client', reason: 'Applications using KV store', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Consistent hashing router', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Partitioned storage nodes', displayName: 'App Server' },
      { type: 'database', reason: 'Replicated persistent storage', displayName: 'Database' },
      { type: 'cache', reason: 'In-memory performance', displayName: 'Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Entry point' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Route to partitions' },
      { from: 'App Server', to: 'Cache', reason: 'Fast reads' },
      { from: 'App Server', to: 'Database', reason: 'Durable storage' },
    ],
    successCriteria: [
      'Pass FR-1: Basic KV operations (PUT/GET/DELETE)',
      'Pass FR-2: High throughput (120K ops/sec)',
      'Pass FR-3: Low latency (p99 < 5ms reads)',
      'Pass NFR-P1: Performance under sustained load',
      'Pass NFR-S1: Scalability with partitioning',
      'Pass NFR-R1: Reliability with node failures',
      'Pass NFR-C1: Cost efficiency under budget',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Build complete system with all optimizations: partitioning, replication, caching',
    level2: 'Ensure: LB for routing, multiple App Server instances (partitions), DB with RF=3, Cache enabled, proper configurations',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const keyValueStoreGuidedTutorial: GuidedTutorial = {
  problemId: 'key-value-store-guided',
  problemTitle: 'Build a Distributed Key-Value Store',

  requirementsPhase: keyValueStoreRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic KV Operations',
      type: 'functional',
      requirement: 'FR-1, FR-2, FR-3',
      description: 'Verify PUT, GET, DELETE operations work correctly',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'High Read Throughput',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Handle 100K reads/sec with low latency',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 60,
      passCriteria: { maxP99Latency: 5, maxErrorRate: 0.01 },
    },
    {
      name: 'Mixed Workload',
      type: 'functional',
      requirement: 'FR-1, FR-2',
      description: 'Handle 120K ops/sec (100K reads + 20K writes)',
      traffic: { type: 'mixed', rps: 120000, readRps: 100000, writeRps: 20000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Sustained Performance',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Maintain low latency under sustained load',
      traffic: { type: 'mixed', rps: 120000, readRps: 100000, writeRps: 20000 },
      duration: 300,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Scalability Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle traffic spike to 200K ops/sec',
      traffic: { type: 'mixed', rps: 200000, readRps: 170000, writeRps: 30000 },
      duration: 60,
      passCriteria: { maxP99Latency: 15, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Node Failure Recovery',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Storage node crashes mid-test. System must maintain availability.',
      traffic: { type: 'mixed', rps: 120000, readRps: 100000, writeRps: 20000 },
      duration: 120,
      failureInjection: { type: 'db_crash', atSecond: 60, recoverySecond: 90 },
      passCriteria: { minAvailability: 0.999, maxDowntime: 5, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet $5,000/month budget while sustaining production traffic',
      traffic: { type: 'mixed', rps: 120000, readRps: 100000, writeRps: 20000 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 5000, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getKeyValueStoreGuidedTutorial(): GuidedTutorial {
  return keyValueStoreGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = keyValueStoreRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= keyValueStoreRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
