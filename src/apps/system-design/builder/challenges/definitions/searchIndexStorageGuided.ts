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
 * Search Index Storage Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial teaching search system design concepts
 * while building a search index storage system like Elasticsearch/Solr.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build basic search (in-memory) - FRs satisfied!
 * Step 3: Add persistence with inverted index
 * Steps 4+: Apply NFRs (sharding, replication, real-time indexing, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 *
 * Focus Areas:
 * - Inverted index data structure
 * - Sharding for horizontal scaling
 * - Replication for availability
 * - Real-time indexing challenges
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const searchIndexRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a search index storage system like Elasticsearch or Solr",

  interviewer: {
    name: 'Dr. Michael Zhang',
    role: 'Search Infrastructure Lead',
    avatar: '👨‍🔬',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the main operations users need to perform?",
      answer: "Users need to:\n1. **Index documents**: Add new documents to the search index (product listings, blog posts, etc.)\n2. **Search documents**: Query the index to find relevant documents based on keywords\n3. **Update documents**: Modify existing documents in the index\n4. **Delete documents**: Remove documents from the index",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-4',
      learningPoint: "Search systems are fundamentally about indexing and retrieval",
    },
    {
      id: 'search-quality',
      category: 'functional',
      question: "What kind of search queries should we support?",
      answer: "For the MVP:\n- **Keyword search**: Find documents containing specific words\n- **Phrase search**: Find exact phrases ('machine learning')\n- **Boolean operators**: AND, OR, NOT\n- **Field-specific search**: Search within specific fields (title:python)\n\nAdvanced features like fuzzy matching and autocomplete can be v2.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Start with basic keyword search, then layer on complexity",
    },
    {
      id: 'relevance-ranking',
      category: 'functional',
      question: "How should search results be ranked?",
      answer: "Results should be ranked by relevance using TF-IDF (Term Frequency-Inverse Document Frequency) or BM25. Most relevant results appear first. Custom ranking factors can be added later.",
      importance: 'important',
      insight: "Relevance ranking is what makes search useful vs just matching",
    },
    {
      id: 'real-time',
      category: 'clarification',
      question: "How quickly should newly indexed documents appear in search results?",
      answer: "Near real-time is acceptable - documents should be searchable within 1-2 seconds of indexing. True real-time (immediate) adds complexity, so near real-time is the sweet spot.",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Near real-time indexing is the industry standard for search systems",
    },
    {
      id: 'analytics',
      category: 'clarification',
      question: "Do we need search analytics like query logging and popular searches?",
      answer: "Not for the MVP. Focus on core indexing and search functionality. Analytics is a separate feature that can be added later.",
      importance: 'nice-to-have',
      insight: "Analytics adds complexity - good to defer for v2",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-documents',
      category: 'throughput',
      question: "How many documents do we need to index?",
      answer: "100 million documents total, with sustained growth",
      importance: 'critical',
      learningPoint: "This tells you the total index size and storage requirements",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many documents are indexed per second?",
      answer: "About 10,000 new documents per second at peak",
      importance: 'critical',
      calculation: {
        formula: "10,000 writes/sec sustained",
        result: "High write throughput - need efficient indexing",
      },
      learningPoint: "Write-heavy workload requires optimized indexing pipeline",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many search queries per second?",
      answer: "About 100,000 queries per second at peak",
      importance: 'critical',
      calculation: {
        formula: "100,000 queries/sec",
        result: "~10:1 read-to-write ratio",
      },
      learningPoint: "Read-heavy but with significant write load - both matter!",
    },
    {
      id: 'payload-size',
      category: 'payload',
      question: "What's the average document size?",
      answer: "Average 10KB per document (text fields, metadata)",
      importance: 'important',
      calculation: {
        formula: "100M docs × 10KB = 1TB raw data",
        result: "But inverted index will be larger (~3-5TB with indexing overhead)",
      },
      learningPoint: "Inverted indexes add storage overhead but enable fast search",
    },
    {
      id: 'latency-search',
      category: 'latency',
      question: "What's the acceptable search latency?",
      answer: "p99 under 100ms - users expect instant search results",
      importance: 'critical',
      learningPoint: "Search must be fast to be useful",
    },
    {
      id: 'latency-indexing',
      category: 'latency',
      question: "What about indexing latency?",
      answer: "Documents should be searchable within 1-2 seconds (near real-time)",
      importance: 'important',
      learningPoint: "Near real-time indexing balances freshness with performance",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'search-quality', 'real-time'],
  criticalFRQuestionIds: ['core-operations', 'search-quality', 'real-time'],
  criticalScaleQuestionIds: ['throughput-writes', 'throughput-reads', 'latency-search'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Index documents',
      description: 'Add documents to the search index for future retrieval',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Search documents',
      description: 'Query the index to find relevant documents by keywords',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Update documents',
      description: 'Modify existing documents in the index',
      emoji: '✏️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Delete documents',
      description: 'Remove documents from the index',
      emoji: '🗑️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Near real-time indexing',
      description: 'Documents appear in search within 1-2 seconds',
      emoji: '⚡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million searchers',
    writesPerDay: '100M documents indexed',
    readsPerDay: '1B searches',
    peakMultiplier: 2,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 5000, peak: 10000 },
    calculatedReadRPS: { average: 50000, peak: 100000 },
    maxPayloadSize: '~10KB per document',
    storagePerRecord: '~10KB raw + index overhead',
    storageGrowthPerYear: '~1TB + 3-5TB index',
    redirectLatencySLA: 'p99 < 100ms (search)',
    createLatencySLA: 'p99 < 2s (indexing)',
  },

  architecturalImplications: [
    '✅ 100M documents → Need sharding for horizontal scaling',
    '✅ 100K queries/sec → Read replicas + caching essential',
    '✅ 10K writes/sec → Efficient bulk indexing required',
    '✅ p99 < 100ms search → In-memory inverted index structures',
    '✅ Near real-time → Separate indexing pipeline with refresh intervals',
  ],

  outOfScope: [
    'Fuzzy search / typo tolerance',
    'Autocomplete / suggestions',
    'Search analytics',
    'Machine learning ranking',
    'Multi-language support',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple search system that can index and query documents. The inverted index is the key data structure. Once it works, we'll optimize for scale with sharding and replication.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "Welcome to SearchCo! You've been hired to build a search engine for e-commerce products.",
  hook: "Your first task: get the basic system running. Users need to search for products.",
  challenge: "Connect the Client to the App Server to handle search requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your search system is online!",
  achievement: "Users can now send search queries to your server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to search yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building a Search System: The Foundation',
  conceptExplanation: `Every search system starts with a **Client** and **App Server**.

When a user searches for "laptop":
1. Client sends search query to your server
2. App Server processes the search
3. Returns matching results

Think of it like asking a librarian - they need to hear your question first!`,
  whyItMatters: 'The app server is where all search logic will live.',
  keyPoints: [
    'Client = user interface (web, mobile)',
    'App Server = search processing engine',
    'REST API for search requests',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Search API)   │
└─────────────┘         └─────────────────┘
     "laptop"           [doc1, doc2, ...]
`,
};

const step1: GuidedStep = {
  id: 'search-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit search queries to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents searchers', displayName: 'Client' },
      { type: 'app_server', reason: 'Processes search queries', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send search queries' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server, then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: The Inverted Index - Making Search Fast
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📚',
  scenario: "Users are searching, but you're scanning every document linearly!",
  hook: "With 100 million documents, each search takes 30 seconds. That's unacceptable!",
  challenge: "Implement an inverted index - the data structure that makes search instant.",
  illustration: 'slow-search',
};

const step2Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Search is now instant!",
  achievement: "Inverted index reduces search from 30s to 10ms",
  metrics: [
    { label: 'Search latency', before: '30,000ms', after: '10ms' },
    { label: 'Can search 100M docs', after: '✓' },
  ],
  nextTeaser: "But wait... what happens when the server restarts?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'The Inverted Index: The Heart of Search',
  conceptExplanation: `An **inverted index** is like a book index, but backwards!

**Normal index** (document → words):
- Doc1: "laptop computer fast"
- Doc2: "laptop gaming rgb"

**Inverted index** (word → documents):
- "laptop" → [Doc1, Doc2]
- "computer" → [Doc1]
- "gaming" → [Doc2]
- "fast" → [Doc1]

When someone searches "laptop", you instantly lookup "laptop" in the index and get [Doc1, Doc2].

**Why it's fast**:
- No need to scan all documents
- Hash table or B-tree lookup: O(1) or O(log n)
- Search 100M docs in milliseconds!`,
  whyItMatters: 'Without an inverted index, search is impossibly slow at scale. This is THE fundamental data structure.',
  realWorldExample: {
    company: 'Google',
    scenario: 'Searching billions of web pages',
    howTheyDoIt: 'Uses massive distributed inverted indexes. Each word points to millions of documents.',
  },
  famousIncident: {
    title: 'Stack Overflow\'s Elasticsearch Migration',
    company: 'Stack Overflow',
    year: '2019',
    whatHappened: 'Stack Overflow migrated from SQL full-text search to Elasticsearch. Search went from 2s to 50ms. The inverted index made all the difference.',
    lessonLearned: 'Use the right data structure for the job. Inverted indexes are essential for search.',
    icon: '📊',
  },
  keyPoints: [
    'Inverted index: word → list of documents',
    'Enables instant lookup instead of scanning',
    'Stored in memory for speed (with disk backup)',
    'Each word entry includes position, frequency',
  ],
  diagram: `
INVERTED INDEX STRUCTURE:

Term        Doc IDs          Positions
─────────────────────────────────────
"laptop"  → [Doc1, Doc2]    [(0,1), (0,1)]
"gaming"  → [Doc2]          [(1,2)]
"fast"    → [Doc1]          [(0,3)]

Search "laptop gaming":
1. Lookup "laptop" → [Doc1, Doc2]
2. Lookup "gaming" → [Doc2]
3. Intersect → [Doc2] ✓
`,
  quickCheck: {
    question: 'Why is an inverted index faster than scanning all documents?',
    options: [
      'It uses better compression',
      'It caches recent searches',
      'It maps words to documents directly, avoiding full scans',
      'It distributes work across servers',
    ],
    correctIndex: 2,
    explanation: 'An inverted index provides direct lookup from word to documents. No need to read every document!',
  },
};

const step2: GuidedStep = {
  id: 'search-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1 & FR-2: Index and search documents with inverted index',
    taskDescription: 'Configure APIs and implement Python handlers with inverted index logic',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Implement inverted index logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Click App Server to open inspector',
      'Assign POST /index and GET /search APIs',
      'Implement inverted index in Python handlers',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure APIs, then implement inverted index in Python',
    level2: 'Assign POST /index and GET /search APIs, then implement handlers using a dictionary for the inverted index',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Persistence - We Lost the Index!
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster! The server crashed overnight.",
  hook: "When it came back online... the entire search index was GONE! 100 million documents need to be re-indexed. Users can't search for anything!",
  challenge: "The index was in memory. We need to persist it to disk with a database.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your index is now durable!",
  achievement: "Search index persists even if the server restarts",
  metrics: [
    { label: 'Index durability', before: '❌ Lost on restart', after: '✓ Persisted' },
    { label: 'Recovery time', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "Great! But 100 million documents in one database is getting slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Persisting the Inverted Index',
  conceptExplanation: `In-memory inverted indexes are lightning fast but volatile.

**The solution**: Store the index in a database with smart caching.

**Two-tier strategy**:
1. **Hot tier**: In-memory inverted index for active searches (Redis/RAM)
2. **Cold tier**: Persistent storage on disk (Database)

**How it works**:
- Index is built in memory for speed
- Periodically flushed to database for durability
- On startup, load index from database to memory
- This is how Elasticsearch and Solr work!

**Storage format**:
- Term dictionary: Terms → Posting lists
- Posting lists: Sorted document IDs + positions
- Compressed for efficiency`,
  whyItMatters: 'Losing your search index means re-indexing everything. At 10K docs/sec, that takes 3 hours!',
  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Billions of documents indexed',
    howTheyDoIt: 'Uses Lucene segments on disk with memory-mapped files. Index is persistent but served from OS page cache for speed.',
  },
  famousIncident: {
    title: 'GitHub Search Outage',
    company: 'GitHub',
    year: '2020',
    whatHappened: 'GitHub\'s search index cluster went down. Because indexes weren\'t properly backed up, they had to rebuild from scratch. Search was down for 6 hours.',
    lessonLearned: 'Always persist your indexes. Memory is fast but volatile.',
    icon: '🔥',
  },
  keyPoints: [
    'Inverted index must be persisted to survive restarts',
    'Two-tier: Memory for speed, disk for durability',
    'Periodic flush to database (every 1-5 seconds)',
    'Fast recovery by loading from persistent storage',
  ],
  diagram: `
┌─────────────────────────────────────┐
│      APP SERVER                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  In-Memory Inverted Index   │   │
│  │   (Fast lookups)            │   │
│  └──────────────┬──────────────┘   │
│                 │                   │
│                 │ Periodic flush    │
│                 ▼                   │
└─────────────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │   Database     │
         │  (Persistent)  │
         └────────────────┘
`,
  quickCheck: {
    question: 'Why use both memory and database for the index?',
    options: [
      'Memory is cheap, database is expensive',
      'Memory is fast but volatile, database is slow but durable',
      'Database can only store small indexes',
      'Memory can store more data',
    ],
    correctIndex: 1,
    explanation: 'Memory provides fast search (microseconds), database provides durability. Use both!',
  },
};

const step3: GuidedStep = {
  id: 'search-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Index must persist durably',
    taskDescription: 'Build Client → App Server → Database for persistent index storage',
    componentsNeeded: [
      { type: 'client', reason: 'Represents searchers', displayName: 'Client' },
      { type: 'app_server', reason: 'Manages in-memory index', displayName: 'App Server' },
      { type: 'database', reason: 'Persists inverted index', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send queries' },
      { from: 'App Server', to: 'Database', reason: 'Persist index segments' },
    ],
    successCriteria: ['Add Database', 'Connect App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Database',
    level2: 'Add Database and connect from App Server to persist the index',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Sharding - One Server Can't Hold It All
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📈',
  scenario: "You now have 500 million documents. One server is choking!",
  hook: "The index is too large for one machine. Memory is maxed out, queries are slow.",
  challenge: "Shard the index across multiple servers to distribute the load.",
  illustration: 'server-overload',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Index is now sharded!",
  achievement: "Multiple servers share the index load",
  metrics: [
    { label: 'Index capacity', before: '100M docs', after: '1B+ docs' },
    { label: 'Query latency', before: '500ms', after: '50ms' },
    { label: 'Shards', after: '5' },
  ],
  nextTeaser: "But what if a shard goes down?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Sharding: Horizontal Scaling for Search',
  conceptExplanation: `**Sharding** splits your index across multiple servers.

**Why shard?**
- One server has limited RAM (~256GB)
- Large indexes don't fit in memory
- Distribute query load across servers

**How it works**:
1. Hash the document ID → Shard number
2. Each shard holds a subset of documents
3. Query goes to ALL shards in parallel
4. Results are merged

**Example** with 3 shards:
- Doc1 (hash=1) → Shard 1
- Doc2 (hash=2) → Shard 2
- Doc3 (hash=3) → Shard 3

Search "laptop":
1. Query sent to all 3 shards
2. Each shard searches its local index
3. Results merged and ranked
4. Top 10 returned to user`,
  whyItMatters: 'Sharding is how you scale from millions to billions of documents.',
  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Handling petabytes of indexed data',
    howTheyDoIt: 'Uses index sharding with configurable shard count. Each shard is a Lucene index. Distributed query execution.',
  },
  famousIncident: {
    title: 'Twitter Search Scaling',
    company: 'Twitter',
    year: '2011',
    whatHappened: 'Twitter had to rebuild their search from scratch when they hit scaling limits. They implemented real-time sharded search using temporal sharding (recent tweets on fast servers, old tweets on slower storage).',
    lessonLearned: 'Plan for sharding from the start. Retrofitting is expensive.',
    icon: '🐦',
  },
  keyPoints: [
    'Shard by document ID (hash-based routing)',
    'Each shard is a complete inverted index',
    'Queries execute in parallel across shards',
    'Results are merged and ranked',
    'Shard count affects parallelism and overhead',
  ],
  diagram: `
┌────────────┐
│   Client   │
└─────┬──────┘
      │ "laptop"
      ▼
┌─────────────────┐
│  App Server     │ ← Scatter/Gather
│  (Coordinator)  │
└────────┬────────┘
         │
    ┌────┴────┬────────┐
    │         │        │
    ▼         ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐
│Shard 1 │ │Shard 2 │ │Shard 3 │
│Docs 1-N│ │Docs N-M│ │Docs M-Z│
└────────┘ └────────┘ └────────┘
    │         │        │
    └────┬────┴────┬───┘
         │ Results│
         ▼        ▼
    Merge & Rank Top 10
`,
  quickCheck: {
    question: 'Why query ALL shards instead of just routing to one?',
    options: [
      'To increase redundancy',
      'Because matching documents could be on any shard',
      'To balance load evenly',
      'To reduce network overhead',
    ],
    correctIndex: 1,
    explanation: 'Documents are distributed by ID hash, not content. Relevant documents for "laptop" could be on any shard!',
  },
};

const step4: GuidedStep = {
  id: 'search-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'System must handle 500M+ documents via sharding',
    taskDescription: 'Configure database sharding to distribute index across multiple nodes',
    componentsNeeded: [
      { type: 'client', reason: 'Represents searchers', displayName: 'Client' },
      { type: 'app_server', reason: 'Coordinates queries', displayName: 'App Server' },
      { type: 'database', reason: 'Configure sharding', displayName: 'Database (Sharded)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send queries' },
      { from: 'App Server', to: 'Database', reason: 'Query all shards' },
    ],
    successCriteria: [
      'Click Database → Enable sharding',
      'Set shard count to 5',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseSharding: true,
  },
  hints: {
    level1: 'Click Database and enable sharding with 5 shards',
    level2: 'Database → Configuration → Enable sharding → Set shard count to 5',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Replication - Don't Lose the Shards!
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚠️',
  scenario: "One of your shards just crashed. Hardware failure.",
  hook: "Now 20% of searches return incomplete results! Users are missing documents.",
  challenge: "Add replication so each shard has backups. If one fails, a replica takes over.",
  illustration: 'server-crash',
};

const step5Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your shards are now fault-tolerant!",
  achievement: "Replicas provide high availability",
  metrics: [
    { label: 'Shard availability', before: '80% (1 shard down)', after: '100%' },
    { label: 'Data redundancy', after: '2 replicas per shard' },
  ],
  nextTeaser: "Excellent! But queries are still hitting all shards directly...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Shard Replication for High Availability',
  conceptExplanation: `**Replication** creates copies of each shard for fault tolerance.

**Architecture**:
- Each shard has 1 primary + N replicas
- Primary handles writes (indexing)
- Replicas handle reads (queries)
- If primary fails, replica promoted to primary

**Example** with 3 shards, 1 replica each:
- Shard 1: Primary + 1 Replica
- Shard 2: Primary + 1 Replica
- Shard 3: Primary + 1 Replica

**Benefits**:
1. **High Availability**: Survive node failures
2. **Read Scaling**: Distribute queries across replicas
3. **Zero Downtime**: Maintenance on one replica while others serve

**Trade-offs**:
- 2x storage (1 primary + 1 replica)
- Network overhead for replication
- Eventual consistency (slight lag)`,
  whyItMatters: 'Without replication, any node failure means partial data loss and broken searches.',
  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Production search clusters',
    howTheyDoIt: 'Default is 1 replica per shard. Financial services often use 2 replicas for critical data.',
  },
  famousIncident: {
    title: 'Amazon Search Outage',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'A network partition caused Amazon\'s search replicas to go out of sync. Some users saw stale results, others saw no results. Lasted 49 minutes during Black Friday.',
    lessonLearned: 'Replication is essential, but monitor replication lag and handle split-brain scenarios.',
    icon: '🛒',
  },
  keyPoints: [
    'Each shard has primary + replicas',
    'Primary handles writes, replicas handle reads',
    'Automatic failover if primary dies',
    '2+ replicas for production systems',
    'Read throughput scales with replica count',
  ],
  diagram: `
┌─────────────────────────────────────────┐
│          SHARD REPLICATION              │
├─────────────────────────────────────────┤
│                                         │
│  Shard 1:                               │
│  ┌─────────────┐      ┌──────────────┐ │
│  │  Primary 1  │ ───▶ │  Replica 1   │ │
│  │   (write)   │      │   (read)     │ │
│  └─────────────┘      └──────────────┘ │
│                                         │
│  Shard 2:                               │
│  ┌─────────────┐      ┌──────────────┐ │
│  │  Primary 2  │ ───▶ │  Replica 2   │ │
│  │   (write)   │      │   (read)     │ │
│  └─────────────┘      └──────────────┘ │
│                                         │
│  If Primary 1 fails → Replica 1         │
│  promoted to Primary                    │
└─────────────────────────────────────────┘
`,
  quickCheck: {
    question: 'Why do replicas only handle reads, not writes?',
    options: [
      'Replicas are slower than primaries',
      'To maintain consistency - primary is source of truth',
      'Replicas have less storage',
      'It reduces network traffic',
    ],
    correctIndex: 1,
    explanation: 'Single primary ensures consistency. All writes go to primary, then replicate to followers.',
  },
};

const step5: GuidedStep = {
  id: 'search-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Index must survive node failures (99.9% availability)',
    taskDescription: 'Enable replication for all shards',
    componentsNeeded: [
      { type: 'client', reason: 'Represents searchers', displayName: 'Client' },
      { type: 'app_server', reason: 'Coordinates queries', displayName: 'App Server' },
      { type: 'database', reason: 'Sharded with replication', displayName: 'Database' },
    ],
    successCriteria: [
      'Database sharding already enabled (Step 4)',
      'Click Database → Enable replication with 2+ replicas per shard',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseSharding: true,
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Enable replication in Database configuration',
    level2: 'Database → Configuration → Enable replication → Set 2 replicas per shard',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 6: Cache for Hot Queries
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Everyone is searching for 'iPhone 15' after the Apple event!",
  hook: "The same query is hitting all shards 1000 times per second. Wasting resources!",
  challenge: "Add a cache to serve popular queries instantly without hitting shards.",
  illustration: 'cache-stampede',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Hot queries are now cached!",
  achievement: "Popular searches served from cache in <5ms",
  metrics: [
    { label: 'Cache hit rate', after: '60%' },
    { label: 'Shard load', before: '100K QPS', after: '40K QPS' },
    { label: 'p99 latency', before: '100ms', after: '10ms' },
  ],
  nextTeaser: "Great! But users are still waiting for new documents to appear...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Query Result Caching',
  conceptExplanation: `**Query caching** stores search results for popular queries.

**How it works**:
1. User searches "iPhone 15"
2. Check cache: Is this query cached?
3. **Cache HIT**: Return cached results (5ms)
4. **Cache MISS**: Query shards, cache results (100ms)

**What to cache**:
- Complete query results (top 100 docs)
- Query → [doc_ids + relevance scores]
- TTL: 60-300 seconds (balance freshness vs hit rate)

**Cache key**:
\`\`\`
query_text + filters + sort_order = cache_key
"iPhone 15" + "category:electronics" + "price_desc" = "iphone15_elec_price"
\`\`\`

**Benefits**:
- Popular queries served instantly
- Reduced shard load
- Better resource utilization`,
  whyItMatters: 'Search has heavy query skew - 20% of queries account for 80% of traffic. Cache those!',
  realWorldExample: {
    company: 'Amazon',
    scenario: 'Black Friday search traffic',
    howTheyDoIt: 'Aggressive query caching with short TTLs. "iPhone" cached at edge for instant results.',
  },
  famousIncident: {
    title: 'Reddit Search Overload',
    company: 'Reddit',
    year: '2018',
    whatHappened: 'A celebrity AMA caused everyone to search for the same terms. Without query caching, the search cluster melted. Searches timed out for 30 minutes.',
    lessonLearned: 'Cache popular queries. Identical queries shouldn\'t hit the backend repeatedly.',
    icon: '🤖',
  },
  keyPoints: [
    'Cache query results, not raw documents',
    'TTL balances freshness vs hit rate (60-300s)',
    'Cache key = query + filters + sort',
    'LRU eviction for cache space management',
    '60%+ hit rate achievable for search',
  ],
  diagram: `
┌────────────┐
│   Client   │ "iPhone 15"
└─────┬──────┘
      │
      ▼
┌─────────────────┐     ┌──────────────┐
│  App Server     │────▶│ Redis Cache  │
│  (Coordinator)  │◀────│              │
└────────┬────────┘     └──────────────┘
         │                   │
         │ Cache miss        │ Cache hit
         ▼                   ▼
    Query shards         Return cached
    (100ms)              results (5ms)
`,
  quickCheck: {
    question: 'Why use a short TTL (60s) for query cache?',
    options: [
      'To save memory',
      'To ensure results stay fresh as new docs are indexed',
      'To reduce network traffic',
      'To improve cache hit rate',
    ],
    correctIndex: 1,
    explanation: 'New documents are constantly indexed. Stale cache would miss new results. TTL ensures freshness.',
  },
};

const step6: GuidedStep = {
  id: 'search-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Popular searches must be fast (<10ms p99)',
    taskDescription: 'Add Cache for query results',
    componentsNeeded: [
      { type: 'client', reason: 'Represents searchers', displayName: 'Client' },
      { type: 'app_server', reason: 'Coordinates with cache', displayName: 'App Server' },
      { type: 'cache', reason: 'Cache query results', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Sharded index storage', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Users send queries' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache first' },
      { from: 'App Server', to: 'Database', reason: 'Query on cache miss' },
    ],
    successCriteria: [
      'Add Cache component',
      'Connect App Server to Cache',
      'Configure cache strategy (cache-aside)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseSharding: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add Cache between App Server and Database',
    level2: 'Add Redis Cache, connect App Server to both Cache and Database, configure cache-aside strategy',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: Load Balancer for High Availability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🎯',
  scenario: "Traffic is surging! 100,000 queries per second.",
  hook: "One app server is maxed out. Need to distribute load across multiple instances.",
  challenge: "Add a load balancer to distribute queries across app server instances.",
  illustration: 'traffic-surge',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "System is now highly available!",
  achievement: "Load balancer + multiple app servers handle massive scale",
  metrics: [
    { label: 'Query capacity', before: '10K QPS', after: '100K+ QPS' },
    { label: 'App servers', after: '5 instances' },
    { label: 'No single point of failure', after: '✓' },
  ],
  nextTeaser: "Almost done! Let's optimize for real-time indexing...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for Search Systems',
  conceptExplanation: `A **Load Balancer** distributes traffic across app server instances.

**For search systems**:
- Multiple app servers coordinate queries
- Each server can query any shard
- Load balancer spreads traffic evenly

**Benefits**:
1. **Horizontal scaling**: Add more servers for capacity
2. **High availability**: One server down, others continue
3. **Health checks**: Auto-remove failed servers
4. **Session affinity**: Optional sticky sessions for caching

**How queries flow**:
1. Client → Load Balancer
2. LB picks healthy app server (round-robin)
3. App server queries cache + shards
4. Results returned via LB`,
  whyItMatters: 'Search systems need high availability and elastic scaling. Load balancers enable both.',
  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Production search clusters',
    howTheyDoIt: 'Uses coordinating nodes (app servers) behind load balancers. Auto-scales based on query load.',
  },
  keyPoints: [
    'Load balancer distributes queries across app servers',
    'Multiple app servers for redundancy and capacity',
    'Health checks remove failed instances',
    'Round-robin or least-connections algorithms',
  ],
  diagram: `
┌────────────┐
│   Client   │
└─────┬──────┘
      │
      ▼
┌─────────────────┐
│ Load Balancer   │
└────────┬────────┘
         │
    ┌────┴────┬────────┐
    │         │        │
    ▼         ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐
│App Srv1│ │App Srv2│ │App Srv3│
└────┬───┘ └────┬───┘ └────┬───┘
     └──────────┴─────────┬┘
                          │
                          ▼
                    Cache + Shards
`,
};

const step7: GuidedStep = {
  id: 'search-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must handle 100K+ queries/sec',
    taskDescription: 'Add Load Balancer and scale App Server to 5+ instances',
    componentsNeeded: [
      { type: 'client', reason: 'Represents searchers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Scale to 5+ instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Query cache', displayName: 'Cache' },
      { type: 'database', reason: 'Sharded index', displayName: 'Database' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and App Server',
      'Click App Server → Set instances to 5+',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseSharding: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Add Load Balancer, reconnect Client → LB → App Server, scale App Server to 5 instances',
    level2: 'Insert Load Balancer between Client and App Server, then configure App Server for 5+ instances',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Real-Time Indexing - Make It Fresh
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚡',
  scenario: "Users are complaining: 'I just added a product but can't find it in search!'",
  hook: "Your batch indexing runs every 10 minutes. That's too slow for e-commerce.",
  challenge: "Implement near real-time indexing so documents appear in search within 1-2 seconds.",
  illustration: 'real-time',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "You've built a production search system!",
  achievement: "Near real-time indexing with sub-second freshness",
  metrics: [
    { label: 'Indexing latency', before: '10 minutes', after: '<2 seconds' },
    { label: 'Can handle', after: '10K writes/sec + 100K reads/sec' },
    { label: 'System complete', after: '✓' },
  ],
  nextTeaser: "Congratulations! You've mastered search index storage!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Near Real-Time Indexing',
  conceptExplanation: `**Near Real-Time (NRT)** indexing makes documents searchable within seconds.

**The challenge**:
- Building inverted indexes is expensive
- Can't rebuild entire index on every write
- Need to balance freshness vs performance

**The solution - Segment-based indexing**:
1. **Buffer writes** in memory (1-5 seconds)
2. **Flush buffer** to new segment (immutable)
3. **Refresh**: Make new segment searchable
4. **Merge**: Periodically merge small segments

**Elasticsearch approach**:
- Default refresh interval: 1 second
- Writes go to in-memory buffer
- Periodic refresh creates new segments
- Search queries across all segments

**Why it works**:
- Small segments created quickly
- No need to rebuild entire index
- Deletes handled with tombstones
- Background merging keeps segment count low`,
  whyItMatters: 'Real-time indexing is critical for e-commerce, social media, and news. Stale search results lose users.',
  realWorldExample: {
    company: 'Twitter',
    scenario: 'Searching tweets in real-time',
    howTheyDoIt: 'Uses custom real-time search infrastructure. Tweets searchable within 1-2 seconds. Temporal sharding: recent tweets on fast servers.',
  },
  famousIncident: {
    title: 'Elasticsearch Refresh Flood',
    company: 'Various',
    year: '2015',
    whatHappened: 'Companies set refresh_interval=1ms thinking it would make indexing "more real-time". It actually destroyed performance by creating thousands of tiny segments. CPU usage went to 100%.',
    lessonLearned: 'Near real-time (1s refresh) is sweet spot. True real-time is expensive and usually unnecessary.',
    icon: '💥',
  },
  keyPoints: [
    'Near real-time = 1-2 second indexing latency',
    'Segment-based architecture enables fast indexing',
    'Writes buffered → flushed → refreshed',
    'Background segment merging for efficiency',
    'Deletes use tombstones (merged later)',
  ],
  diagram: `
NEAR REAL-TIME INDEXING FLOW:

1. Write docs
   │
   ▼
2. Memory Buffer (1-2 sec)
   │
   ▼
3. Flush to Segment
   │  (new immutable segment)
   ▼
4. Refresh (make searchable)
   │
   ▼
5. Query sees new docs!

Background:
   Segment Merge (consolidate)
   ┌──────┐ ┌──────┐ ┌──────┐
   │Seg 1 │ │Seg 2 │ │Seg 3 │
   └───┬──┘ └───┬──┘ └───┬──┘
       └────────┴────────┘
              │
              ▼
        ┌──────────────┐
        │ Merged Seg   │
        └──────────────┘
`,
  quickCheck: {
    question: 'Why use segments instead of rebuilding the entire index?',
    options: [
      'Segments use less memory',
      'Building full index for each write is too slow',
      'Segments compress better',
      'Segments improve search quality',
    ],
    correctIndex: 1,
    explanation: 'Rebuilding 100M document index takes hours. Small segments can be created in seconds!',
  },
};

const step8: GuidedStep = {
  id: 'search-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'FR-5: Near real-time indexing (<2s latency)',
    taskDescription: 'Final validation - ensure complete architecture with real-time capabilities',
    componentsNeeded: [
      { type: 'client', reason: 'Searchers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distribute load', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Query cache', displayName: 'Cache' },
      { type: 'database', reason: 'Sharded, replicated index', displayName: 'Database' },
    ],
    successCriteria: [
      'Full architecture in place',
      'All components properly configured',
      'Ready for production!',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseSharding: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Verify all components and configurations are in place',
    level2: 'You should have: Client → LB → App Servers (5+) → Cache + Database (sharded, replicated)',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const searchIndexStorageGuidedTutorial: GuidedTutorial = {
  problemId: 'search-index-storage-guided',
  problemTitle: 'Build Search Index Storage - Elasticsearch/Solr Journey',

  requirementsPhase: searchIndexRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Indexing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Documents can be indexed successfully.',
      traffic: { type: 'write', rps: 100, writeRps: 100 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'Fast Search',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Search queries return relevant results within latency target.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'High Write Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10,000 indexing operations per second.',
      traffic: { type: 'write', rps: 10000, writeRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 2000, maxErrorRate: 0.05 },
    },
    {
      name: 'High Read Throughput',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Handle 100,000 search queries per second.',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Shard Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System maintains availability when a shard fails.',
      traffic: { type: 'mixed', rps: 50000, readRps: 45000, writeRps: 5000 },
      duration: 90,
      failureInjection: { type: 'db_shard_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 5, maxErrorRate: 0.05 },
    },
    {
      name: 'Near Real-Time Indexing',
      type: 'performance',
      requirement: 'FR-5',
      description: 'Newly indexed documents appear in search within 2 seconds.',
      traffic: { type: 'mixed', rps: 10000, readRps: 8000, writeRps: 2000 },
      duration: 60,
      passCriteria: { maxIndexingLatency: 2000, maxErrorRate: 0.01 },
    },
  ] as TestCase[],
};

export function getSearchIndexStorageGuidedTutorial(): GuidedTutorial {
  return searchIndexStorageGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = searchIndexRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= searchIndexRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
