import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Search Index Updates Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching how to keep search indexes synchronized with data changes.
 * Focus: Near real-time indexing, eventual consistency, bulk updates, index versioning
 *
 * Key Concepts:
 * - Search index synchronization patterns
 * - Eventual consistency in search
 * - Incremental vs full reindexing
 * - Near real-time (NRT) updates
 * - Bulk indexing for efficiency
 * - Zero-downtime index migrations
 *
 * Flow:
 * Phase 0: Requirements gathering (indexing latency, consistency, incremental updates)
 * Steps 1-3: Basic search indexing (database to search index sync)
 * Steps 4-6: Near real-time indexing, bulk updates, index versioning
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const searchIndexUpdatesRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a system to keep search indexes synchronized with database updates",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Search Infrastructure Engineer',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-sync',
      category: 'functional',
      question: "What data changes need to be reflected in the search index?",
      answer: "Product catalog changes:\n1. **New products** - Must be searchable after creation\n2. **Product updates** - Price, inventory, description changes\n3. **Product deletions** - Removed products shouldn't appear in search\n4. **Attribute changes** - Category, brand, tags updates\n\nAll changes in the database must eventually be reflected in search results.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Search indexes are denormalized copies - they must stay in sync with the source database",
    },
    {
      id: 'indexing-latency',
      category: 'functional',
      question: "How quickly must changes appear in search results?",
      answer: "**Near real-time** is the goal:\n- Price/inventory updates: within 30-60 seconds (critical for user experience)\n- New products: within 1-5 minutes (acceptable delay)\n- Deletions: within 30 seconds (users shouldn't see deleted items)\n\nWe can tolerate eventual consistency - strong consistency isn't required.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Near real-time (NRT) indexing balances freshness with system load - perfect consistency is too expensive",
    },
    {
      id: 'incremental-updates',
      category: 'functional',
      question: "Should we reindex everything or just what changed?",
      answer: "**Incremental updates** are essential:\n- Only index changed products, not entire catalog\n- Full reindex takes hours for millions of products\n- Incremental: index just the 1,000 products updated today\n\nBut we also need **full reindex capability** for schema changes or index corruption.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Incremental updates for normal operations, full reindex for schema migrations",
    },

    // IMPORTANT - Clarifications
    {
      id: 'bulk-vs-single',
      category: 'clarification',
      question: "Should we index products one at a time or in batches?",
      answer: "**Batch/bulk indexing** is much more efficient:\n- Single updates: 100 requests/sec = overhead\n- Bulk updates: batch 1,000 products in one request = 100x more efficient\n\nBut critical updates (out-of-stock) should go through faster as single updates.",
      importance: 'important',
      insight: "Bulk indexing reduces network overhead and Elasticsearch processing time",
    },
    {
      id: 'consistency-guarantees',
      category: 'clarification',
      question: "What happens if search shows stale data?",
      answer: "**Eventual consistency is acceptable** for search:\n- User sees product at old price for 30 seconds → OK, cart shows correct price\n- User sees out-of-stock item → Catches at checkout, acceptable\n- User doesn't see new product for 5 minutes → Minor inconvenience\n\nSearch doesn't need ACID guarantees - speed and availability matter more.",
      importance: 'important',
      insight: "Search is a read-optimized denormalized view - eventual consistency is the right tradeoff",
    },
    {
      id: 'index-versioning',
      category: 'clarification',
      question: "How do we update the index schema without downtime?",
      answer: "Use **zero-downtime index migrations**:\n1. Create new index version (v2) with new schema\n2. Reindex all data to v2 (background process)\n3. Switch traffic from v1 to v2 atomically\n4. Delete old v1 index\n\nThis allows schema changes without search downtime.",
      importance: 'important',
      insight: "Index versioning enables blue-green deployments for search indexes",
    },
    {
      id: 'monitoring',
      category: 'clarification',
      question: "How do we detect when search index falls behind?",
      answer: "Track **index lag metrics**:\n- Replication lag: time between database write and search index update\n- Pending queue depth: how many updates are waiting\n- Alert if lag > 5 minutes or queue > 10,000 items\n\nFor MVP, we'll defer monitoring to v2.",
      importance: 'nice-to-have',
      insight: "Monitoring index lag is critical in production but not needed for MVP",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // THROUGHPUT
    {
      id: 'throughput-updates',
      category: 'throughput',
      question: "How many product updates per day?",
      answer: "Massive update volume:\n- Price changes: 1M products/day\n- Inventory updates: 5M products/day\n- New products: 50K products/day\n- Deletions: 10K products/day\n\nTotal: ~6M updates/day",
      importance: 'critical',
      calculation: {
        formula: "6M updates ÷ 86,400 sec = 70 updates/sec average",
        result: "~70 updates/sec (500 at peak)",
      },
      learningPoint: "High update volume requires efficient bulk indexing, not individual updates",
    },
    {
      id: 'throughput-catalog',
      category: 'throughput',
      question: "How many total products in the catalog?",
      answer: "50 million products, growing to 100 million. Each reindex processes millions of documents.",
      importance: 'critical',
      learningPoint: "Full reindex must handle 100M products efficiently - can't lock database",
    },

    // LATENCY
    {
      id: 'latency-indexing',
      category: 'latency',
      question: "How fast should indexing complete?",
      answer: "**Indexing latency targets:**\n- Single product update: <1 second to queue\n- Bulk batch (1000 products): <5 seconds to index\n- Full reindex (100M products): <6 hours\n\nBalances freshness with system resources.",
      importance: 'critical',
      learningPoint: "Indexing is async - optimize for throughput, not individual operation latency",
    },

    // AVAILABILITY
    {
      id: 'availability-search',
      category: 'availability',
      question: "What if indexing fails or falls behind?",
      answer: "**Graceful degradation:**\n- Search keeps working with stale data (acceptable)\n- Retry failed index updates automatically\n- If lag > 10 minutes, alert engineers but don't block search\n\nSearch availability > perfect freshness",
      importance: 'important',
      learningPoint: "Search should never go down due to indexing issues - decouple read and write paths",
    },

    // CONSISTENCY
    {
      id: 'consistency-model',
      category: 'consistency',
      question: "What consistency model should we use?",
      answer: "**Eventual consistency** with bounded staleness:\n- Updates appear within 60 seconds (99.9% of time)\n- Order of updates preserved per product (prevent rollback to old state)\n- No strong consistency requirement\n\nSearch is inherently eventually consistent.",
      importance: 'important',
      learningPoint: "CAP theorem: choose availability and partition tolerance over consistency for search",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-sync', 'indexing-latency', 'incremental-updates'],
  criticalFRQuestionIds: ['core-sync', 'indexing-latency', 'incremental-updates'],
  criticalScaleQuestionIds: ['throughput-updates', 'latency-indexing', 'consistency-model'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Sync all database changes to search index',
      description: 'Product creates, updates, deletes reflected in search',
      emoji: '🔄',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Near real-time indexing (NRT)',
      description: 'Changes appear in search within 30-60 seconds',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Incremental indexing',
      description: 'Only index changed products, not entire catalog',
      emoji: '📈',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million searchers/day',
    writesPerDay: '6 million product updates/day',
    readsPerDay: '500 million searches/day',
    peakMultiplier: 5,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 70, peak: 500 },
    calculatedReadRPS: { average: 5787, peak: 25000 },
    maxPayloadSize: '~2KB per product document',
    storagePerRecord: '~2KB per product in search index',
    storageGrowthPerYear: '~200GB (new products)',
    redirectLatencySLA: 'p99 < 60 seconds (indexing lag)',
    createLatencySLA: 'p99 < 5 seconds (bulk indexing)',
  },

  architecturalImplications: [
    '✅ 6M updates/day → Need message queue for async indexing',
    '✅ 70 updates/sec → Batch into bulk requests (1000 products/batch)',
    '✅ Near real-time → Queue consumer polls every 5-10 seconds',
    '✅ 100M products → Full reindex must stream data, not load into memory',
    '✅ Zero-downtime migrations → Index aliasing for version switching',
    '✅ Eventual consistency → No distributed transactions, accept lag',
  ],

  outOfScope: [
    'Real-time indexing (<1 second)',
    'Strong consistency guarantees',
    'Cross-region replication',
    'Advanced conflict resolution',
    'Automatic schema evolution',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple sync from database to search index. Then we'll add the complexity: message queues for async processing, batching for efficiency, and index versioning for zero-downtime updates. Functionality first, optimization later!",
};

// =============================================================================
// STEP 1: Connect Client to Search Service
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🔍',
  scenario: "You're building a product search system for an e-commerce platform.",
  hook: "Customers need to search for products, but you haven't built the search infrastructure yet!",
  challenge: "Set up the basic architecture: Client connects to App Server for search requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Search service is ready to receive queries!',
  achievement: 'Customers can now send search requests to your server',
  metrics: [
    { label: 'Search endpoint', after: 'Online' },
    { label: 'Request path', after: 'Client → Server' },
  ],
  nextTeaser: "But where is the product data stored?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building Search: Client-Server Foundation',
  conceptExplanation: `Every search system starts with a **Client** sending queries to a **Server**.

When a user searches on Amazon:
1. Browser/app (Client) sends search query
2. Request goes to Search API Server
3. Server will eventually return product results

This is step 1 - establishing the communication path.`,

  whyItMatters: 'Without this connection, users have no way to search. This is the foundation we\'ll build upon.',

  realWorldExample: {
    company: 'Elasticsearch',
    scenario: 'Powers search for Uber, Netflix, GitHub',
    howTheyDoIt: 'Clients connect to search clusters via REST API. Same pattern for billions of queries.',
  },

  keyPoints: [
    'Client = user interface (web/mobile)',
    'App Server = handles search API requests',
    'HTTP/REST = communication protocol',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User device sending search queries', icon: '📱' },
    { title: 'App Server', explanation: 'Backend processing search requests', icon: '🖥️' },
    { title: 'Search API', explanation: 'Endpoint for search operations', icon: '🔌' },
  ],
};

const step1: GuidedStep = {
  id: 'search-index-updates-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for search',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users searching for products', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles search requests', displayName: 'Search API Server' },
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
// STEP 2: Add Database for Product Data
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Your search server is ready, but it has no product data!",
  hook: "Products are stored in a database. The server needs to read from it.",
  challenge: "Add a database to store the product catalog and connect it to your server.",
  illustration: 'database-storage',
};

const step2Celebration: CelebrationContent = {
  emoji: '🗄️',
  message: 'Product data has a home!',
  achievement: 'Database stores product catalog - the source of truth',
  metrics: [
    { label: 'Database', after: 'Online' },
    { label: 'Products stored', after: '50M' },
  ],
  nextTeaser: "But databases aren't optimized for search...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Database: The Source of Truth',
  conceptExplanation: `The **Database** is your source of truth for product data.

**Product Schema:**
- product_id, name, description
- price, inventory, category, brand
- created_at, updated_at

**Database Role:**
- Handles transactions (create, update, delete)
- ACID guarantees for data integrity
- Optimized for writes and point lookups

But databases are NOT optimized for:
- Full-text search across millions of products
- Relevance ranking
- Typo tolerance

That's why we need a separate search index!`,

  whyItMatters: 'Database provides data integrity and is source of truth. Search index will be a specialized copy.',

  keyPoints: [
    'Database stores authoritative product data',
    'PostgreSQL/MySQL for transactional workloads',
    'Database handles all product updates',
    'Search index will be added next',
  ],

  diagram: `
┌────────┐     ┌─────────────┐     ┌──────────┐
│ Client │────▶│ App Server  │────▶│ Database │
└────────┘     └─────────────┘     └──────────┘
                                   Source of Truth
`,

  keyConcepts: [
    { title: 'Source of Truth', explanation: 'Database holds authoritative data', icon: '🗄️' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '🔒' },
    { title: 'Transactional', explanation: 'Handles product updates reliably', icon: '💾' },
  ],
};

const step2: GuidedStep = {
  id: 'search-index-updates-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Need product data to sync',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Stores product catalog (source of truth)', displayName: 'PostgreSQL' },
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
    level1: 'Drag a Database component onto the canvas',
    level2: 'Click App Server, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Search Index (Elasticsearch)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📇',
  scenario: "Searching 50 million products in PostgreSQL with SQL LIKE is impossibly slow!",
  hook: "Queries take 10+ seconds. You need a specialized search engine.",
  challenge: "Add Elasticsearch as a search index for fast full-text search.",
  illustration: 'search-index',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Search is lightning fast!',
  achievement: 'Elasticsearch enables sub-second search on millions of products',
  metrics: [
    { label: 'Search latency', before: '10000ms', after: '50ms' },
    { label: 'Search engine', after: 'Elasticsearch' },
  ],
  nextTeaser: "But how do we keep the search index in sync with the database?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Search Index: Specialized for Search',
  conceptExplanation: `**Elasticsearch** is a distributed search engine optimized for full-text search.

**Why Elasticsearch?**
- Inverted index for fast text search
- Handles typos and fuzzy matching
- Relevance ranking (BM25 algorithm)
- Distributed across nodes for scale

**Database vs Search Index:**
┌─────────────────┬──────────────┬─────────────────┐
│ Feature         │ Database     │ Search Index    │
├─────────────────┼──────────────┼─────────────────┤
│ Source of truth │ ✓            │ ✗               │
│ ACID            │ ✓            │ ✗               │
│ Full-text search│ Slow         │ Fast            │
│ Typo tolerance  │ ✗            │ ✓               │
│ Relevance rank  │ ✗            │ ✓               │
└─────────────────┴──────────────┴─────────────────┘

**The Problem:**
Database and search index are now separate systems.
How do we keep them in sync? That's the indexing challenge!`,

  whyItMatters: 'Search requires specialized infrastructure. Now we must solve the synchronization problem.',

  famousIncident: {
    title: 'Amazon Search Migration',
    company: 'Amazon',
    year: '2013',
    whatHappened: 'Amazon migrated from SQL-based search to Elasticsearch. Search performance improved 10x, but the initial migration had sync issues causing products to disappear from search for hours.',
    lessonLearned: 'Search index sync is critical - poor sync = products invisible = lost revenue.',
    icon: '🔍',
  },

  realWorldExample: {
    company: 'eBay',
    scenario: 'Searching 1.3 billion listings',
    howTheyDoIt: 'Uses Elasticsearch clusters. Syncs database changes via event streams. Near real-time indexing within 1 minute.',
  },

  diagram: `
Two Separate Systems:

┌──────────┐          ┌──────────────┐
│ Database │          │Elasticsearch │
│(Source of│          │(Search Index)│
│  Truth)  │          │              │
└──────────┘          └──────────────┘
     ↑                       ↑
     │                       │
     └───── Must sync ───────┘
            (the challenge!)
`,

  keyPoints: [
    'Elasticsearch optimized for full-text search',
    'Database remains source of truth',
    'Search index is a denormalized copy',
    'Must keep both systems in sync',
  ],

  quickCheck: {
    question: 'Why not just use Elasticsearch as the primary database?',
    options: [
      'Elasticsearch is too expensive',
      'Elasticsearch lacks ACID guarantees - not safe for transactional data',
      'Elasticsearch can\'t store data',
      'Elasticsearch is harder to use',
    ],
    correctIndex: 1,
    explanation: 'Elasticsearch is eventually consistent and optimized for reads, not transactional writes. Database provides ACID guarantees for product updates.',
  },

  keyConcepts: [
    { title: 'Search Index', explanation: 'Specialized structure for fast search', icon: '📇' },
    { title: 'Inverted Index', explanation: 'Maps terms to documents', icon: '🔍' },
    { title: 'Denormalized', explanation: 'Optimized copy of source data', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'search-index-updates-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Need fast search on product data',
    taskDescription: 'Add Elasticsearch search index and connect App Server to it',
    componentsNeeded: [
      { type: 'search_index', reason: 'Fast full-text search on products', displayName: 'Elasticsearch' },
    ],
    successCriteria: [
      'Search Index component added to canvas',
      'App Server connected to Search Index',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
    ],
  },

  hints: {
    level1: 'Drag a Search Index (Elasticsearch) component onto the canvas',
    level2: 'Click App Server, then click Search Index to create a connection',
    solutionComponents: [{ type: 'search_index' }],
    solutionConnections: [{ from: 'app_server', to: 'search_index' }],
  },
};

// =============================================================================
// STEP 4: Add Message Queue for Async Indexing
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📬',
  scenario: "Product updates are slow! Every save waits for Elasticsearch to index.",
  hook: "Users complain: 'Adding a product takes 5 seconds!' The database write is fast, but syncing to Elasticsearch is slow.",
  challenge: "Add a message queue to decouple database writes from search indexing.",
  illustration: 'message-queue',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Product updates are instant!',
  achievement: 'Async indexing via message queue - database writes no longer blocked',
  metrics: [
    { label: 'Product save time', before: '5000ms', after: '50ms' },
    { label: 'Indexing', after: 'Async' },
  ],
  nextTeaser: "But how do we efficiently process millions of updates per day?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Async Indexing: Decouple Write and Index',
  conceptExplanation: `**The Problem with Sync Indexing:**
When a product is updated:
1. Write to database (50ms)
2. Wait for Elasticsearch to index (500ms)
3. Return to user (550ms total)

User waits 550ms for every product save!

**The Solution: Async Indexing with Message Queue**
When a product is updated:
1. Write to database (50ms)
2. Publish event to queue (5ms)
3. Return to user (55ms total)
4. Background worker indexes to Elasticsearch (happens later)

**Message Queue Architecture:**
- Producer: App Server publishes product update events
- Queue: RabbitMQ/Kafka/SQS stores events reliably
- Consumer: Indexing worker reads events and updates Elasticsearch

**Benefits:**
- Fast response times (don't wait for indexing)
- Reliable (queue ensures no updates lost)
- Scalable (add more workers if queue grows)
- Resilient (retries if Elasticsearch is down)`,

  whyItMatters: 'Async processing is essential for responsive user experience. Users shouldn\'t wait for indexing.',

  famousIncident: {
    title: 'LinkedIn Search Index Queue',
    company: 'LinkedIn',
    year: '2016',
    whatHappened: 'LinkedIn moved from sync to async indexing using Kafka. Reduced profile update latency from 2 seconds to 200ms. Indexing still happened within 30 seconds (acceptable lag).',
    lessonLearned: 'Async indexing dramatically improves UX while maintaining acceptable search freshness.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Merchants updating products',
    howTheyDoIt: 'Product updates go to database immediately. Change events published to Kafka. Workers consume and index to Elasticsearch within 1 minute.',
  },

  diagram: `
BEFORE (Sync):
┌─────────┐  1. Update   ┌────────┐  2. Index   ┌──────────┐
│ Client  │─────────────▶│  App   │────────────▶│Elastic-  │
└─────────┘  (waits)     │ Server │   (waits)   │ search   │
                         └────────┘             └──────────┘
                              │
                              ▼ 3. Write
                         ┌──────────┐
                         │ Database │
                         └──────────┘
Total: 550ms

AFTER (Async):
┌─────────┐  1. Update   ┌────────┐  2. Write   ┌──────────┐
│ Client  │─────────────▶│  App   │────────────▶│ Database │
└─────────┘  (55ms)      │ Server │             └──────────┘
                         └────┬───┘
                              │ 3. Publish event
                              ▼
                         ┌──────────┐
                         │  Queue   │
                         └────┬─────┘
                              │ 4. Consume (async)
                              ▼
                         ┌──────────┐  5. Index  ┌──────────┐
                         │ Indexing │───────────▶│Elastic-  │
                         │  Worker  │            │ search   │
                         └──────────┘            └──────────┘
Total for user: 55ms (11x faster!)
Index completes in 30-60 seconds (background)
`,

  keyPoints: [
    'Message queue decouples database writes from indexing',
    'User gets instant response, indexing happens async',
    'Queue ensures reliability (no lost updates)',
    'Workers can be scaled independently',
    'Eventual consistency: search lags 30-60 seconds',
  ],

  quickCheck: {
    question: 'Why use a message queue instead of directly indexing from app server?',
    options: [
      'Message queues are faster',
      'Decouples operations - user doesn\'t wait, and indexing can retry/scale independently',
      'Message queues are cheaper',
      'Elasticsearch requires a queue',
    ],
    correctIndex: 1,
    explanation: 'Queue provides async processing (fast user response), reliability (retries), and scalability (add workers). User doesn\'t wait for indexing.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Reliable async event delivery', icon: '📬' },
    { title: 'Producer', explanation: 'App server publishing events', icon: '📤' },
    { title: 'Consumer', explanation: 'Worker processing events', icon: '📥' },
    { title: 'Eventual Consistency', explanation: 'Search catches up within seconds', icon: '⏱️' },
  ],
};

const step4: GuidedStep = {
  id: 'search-index-updates-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Near real-time indexing without blocking writes',
    taskDescription: 'Add a Message Queue for async indexing',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Decouple database writes from search indexing', displayName: 'RabbitMQ' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue (publishes events)',
      'Message Queue connected to Search Index (consumer indexes)',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add a Message Queue component and connect it to handle async indexing',
    level2: 'App Server publishes to Queue, then Queue connects to Search Index for consumption',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 5: Implement Bulk Indexing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📦',
  scenario: "Your queue has 1 million pending updates! Processing one at a time takes forever.",
  hook: "Indexing 1M products × 100ms each = 27 hours! You need batch processing.",
  challenge: "Implement bulk indexing to process updates in batches of 1,000.",
  illustration: 'batch-processing',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Bulk indexing is 100x faster!',
  achievement: 'Processing 1M updates now takes 20 minutes instead of 27 hours',
  metrics: [
    { label: 'Indexing time', before: '27 hours', after: '20 minutes' },
    { label: 'Batch size', after: '1000 products' },
    { label: 'Throughput', before: '10/sec', after: '1000/sec' },
  ],
  nextTeaser: "But what happens when you need to change the search index schema?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Bulk Indexing: Batch for Efficiency',
  conceptExplanation: `**The Problem with Individual Updates:**
Processing 1M products one at a time:
- 1M HTTP requests to Elasticsearch
- 1M network round trips
- 1M index operations

Each request has overhead: ~100ms
Total time: 1M × 100ms = 100,000 seconds = 27 hours!

**The Solution: Bulk Indexing**
Batch 1,000 products into one bulk request:
- 1,000 requests instead of 1M
- 1,000 network round trips instead of 1M
- Elasticsearch processes batch efficiently

Each bulk request: ~1 second for 1,000 products
Total time: 1,000 × 1 second = 1,000 seconds = 17 minutes!

**100x improvement!**

**Elasticsearch Bulk API:**
\`\`\`json
POST /_bulk
{"index": {"_index": "products", "_id": "1"}}
{"name": "iPhone 15", "price": 999}
{"index": {"_index": "products", "_id": "2"}}
{"name": "Samsung Galaxy", "price": 899}
...
(1000 products in one request)
\`\`\`

**Batching Strategy:**
- Consume messages from queue in batches
- Wait for 1,000 messages OR 5 seconds (whichever first)
- Send bulk request to Elasticsearch
- Commit queue only after successful indexing`,

  whyItMatters: 'At scale, individual requests are too slow. Bulk operations are essential for throughput.',

  famousIncident: {
    title: 'Etsy Search Reindex',
    company: 'Etsy',
    year: '2015',
    whatHappened: 'Etsy needed to reindex 50M products. Initial approach: individual updates took 3 days. Switched to bulk indexing: completed in 4 hours. 18x improvement.',
    lessonLearned: 'Bulk operations are mandatory for large-scale indexing. Network overhead dominates at scale.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Walmart',
    scenario: 'Daily product catalog updates',
    howTheyDoIt: 'Batches updates into 5,000-product bulk requests. Processes 10M+ updates per day in under 2 hours.',
  },

  diagram: `
INDIVIDUAL INDEXING (slow):
Queue: [1, 2, 3, 4, ... 1M messages]
       │  │  │  │
       ▼  ▼  ▼  ▼  (1M separate requests)
  ┌────────────────┐
  │ Elasticsearch  │
  └────────────────┘
Time: 27 hours

BULK INDEXING (fast):
Queue: [1, 2, 3, ... 1000] [1001, ... 2000] ... [999001, ... 1M]
           │                    │                      │
           ▼ batch              ▼ batch                ▼ batch
  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
  │ Bulk Request 1 │    │ Bulk Request 2 │    │ Bulk Request N │
  │ (1000 products)│    │ (1000 products)│    │ (1000 products)│
  └───────┬────────┘    └───────┬────────┘    └───────┬────────┘
          └─────────────────────┴─────────────────────┘
                              ▼
                    ┌────────────────┐
                    │ Elasticsearch  │
                    └────────────────┘
Time: 20 minutes (100x faster!)
`,

  keyPoints: [
    'Bulk indexing batches many products into one request',
    'Reduces network overhead dramatically',
    'Elasticsearch optimizes bulk operations',
    'Typical batch size: 500-5,000 products',
    'Balance: larger batches = higher throughput but higher latency',
  ],

  quickCheck: {
    question: 'Why not make batches of 100,000 products for even better performance?',
    options: [
      'Elasticsearch can\'t handle it',
      'Too large batches increase memory usage and reduce parallelism; 1,000-5,000 is optimal',
      'It would be slower',
      'Queue can\'t handle large batches',
    ],
    correctIndex: 1,
    explanation: 'Very large batches require more memory, risk timeout, and reduce concurrency. 1,000-5,000 products balances throughput with resource usage.',
  },

  keyConcepts: [
    { title: 'Bulk Indexing', explanation: 'Batch multiple documents in one request', icon: '📦' },
    { title: 'Batching', explanation: 'Group operations for efficiency', icon: '🎯' },
    { title: 'Throughput', explanation: 'Operations per second', icon: '📈' },
  ],
};

const step5: GuidedStep = {
  id: 'search-index-updates-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Efficient incremental indexing via batching',
    taskDescription: 'Configure bulk indexing for the message queue consumer',
    successCriteria: [
      'Click on Message Queue component',
      'Configure batch size: 1000',
      'Configure batch timeout: 5 seconds',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Configure the Message Queue to use bulk processing',
    level2: 'Set batch size to 1000 and batch timeout to 5 seconds for optimal throughput',
    solutionComponents: [{ type: 'message_queue', config: { batchSize: 1000, batchTimeout: 5 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Implement Index Versioning for Zero-Downtime Updates
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "You need to add a new field to the search index! But reindexing takes 6 hours.",
  hook: "If you delete the old index and rebuild, search will be down for 6 hours. Unacceptable!",
  challenge: "Implement index versioning for zero-downtime schema migrations.",
  illustration: 'blue-green-deployment',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Zero-downtime index migration complete!',
  achievement: 'You can now update search schema without any downtime',
  metrics: [
    { label: 'Migration downtime', before: '6 hours', after: '0 seconds' },
    { label: 'Index versions', after: 'v1 → v2 (atomic switch)' },
    { label: 'Search availability', after: '100%' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade search indexing system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Index Versioning: Blue-Green for Search Indexes',
  conceptExplanation: `**The Problem:**
You need to change the search index schema (add field, change analyzer).
Traditional approach:
1. Delete old index
2. Create new index
3. Reindex all data (6 hours)

Search is DOWN for 6 hours! Unacceptable for production.

**The Solution: Index Versioning (Blue-Green Deployment)**

**Phase 1: Preparation**
- Current: products_v1 (actively serving traffic)
- Create: products_v2 (new schema, empty)
- Alias: "products" points to products_v1

**Phase 2: Reindexing**
- Stream all products to products_v2 (background, 6 hours)
- products_v1 continues serving search (no downtime)
- Both indexes receive new updates (dual-write)

**Phase 3: Cutover**
- When products_v2 is complete, atomically:
  - Point "products" alias to products_v2
  - Takes <1 second
  - Zero downtime

**Phase 4: Cleanup**
- Stop dual-writes to products_v1
- Delete products_v1 after validation

**Elasticsearch Aliases:**
\`\`\`json
// Before
GET /products/_search  → queries products_v1

// Atomic switch
POST /_aliases
{
  "actions": [
    {"remove": {"index": "products_v1", "alias": "products"}},
    {"add": {"index": "products_v2", "alias": "products"}}
  ]
}

// After
GET /products/_search  → queries products_v2
\`\`\`

**Benefits:**
- Zero downtime
- Instant rollback (switch alias back)
- Validate new index before cutover`,

  whyItMatters: 'Search is mission-critical. Zero-downtime deployments are essential for production systems.',

  famousIncident: {
    title: 'GitHub Search Index Migration',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub needed to migrate 8TB of code search data to a new index with better tokenization. Used blue-green strategy: built new index over 2 weeks in background, switched alias atomically. Zero downtime.',
    lessonLearned: 'Index versioning is the industry standard for production search systems.',
    icon: '🔄',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Search schema updates',
    howTheyDoIt: 'Uses index versioning for all schema changes. Reindexes in background, atomic cutover. Ships search improvements weekly with zero downtime.',
  },

  diagram: `
ZERO-DOWNTIME INDEX MIGRATION:

BEFORE (serving v1):
┌─────────┐     ┌──────────────┐
│ Search  │────▶│products_v1   │ ← alias "products"
│ Queries │     │(old schema)  │
└─────────┘     └──────────────┘

DURING (background reindex):
┌─────────┐     ┌──────────────┐
│ Search  │────▶│products_v1   │ ← alias "products" (still v1)
│ Queries │     │(serving)     │
└─────────┘     └──────────────┘

                ┌──────────────┐
                │products_v2   │
                │(reindexing)  │ ← building in background
                └──────────────┘

CUTOVER (atomic alias switch):
POST /_aliases: remove v1, add v2 (<1 second)

AFTER (serving v2):
                ┌──────────────┐
                │products_v1   │
                │(delete later)│
                └──────────────┘

┌─────────┐     ┌──────────────┐
│ Search  │────▶│products_v2   │ ← alias "products" (now v2)
│ Queries │     │(new schema)  │
└─────────┘     └──────────────┘

NO DOWNTIME at any point!
`,

  keyPoints: [
    'Index versioning = blue-green deployment for search',
    'Reindex to new version in background',
    'Alias enables atomic switching',
    'Zero downtime during migration',
    'Easy rollback if issues found',
  ],

  quickCheck: {
    question: 'Why use an alias instead of pointing directly to products_v1?',
    options: [
      'Aliases are faster',
      'Aliases enable atomic switching between index versions without changing client code',
      'Elasticsearch requires aliases',
      'Aliases are more secure',
    ],
    correctIndex: 1,
    explanation: 'Alias provides indirection. Clients query "products" alias. You can atomically switch alias to point to different index versions without any client changes.',
  },

  keyConcepts: [
    { title: 'Index Versioning', explanation: 'Multiple versions of index (v1, v2)', icon: '🔄' },
    { title: 'Alias', explanation: 'Pointer to current index version', icon: '🔗' },
    { title: 'Blue-Green', explanation: 'Two environments, atomic switch', icon: '🔵' },
    { title: 'Zero-Downtime', explanation: 'No service interruption', icon: '✅' },
  ],
};

const step6: GuidedStep = {
  id: 'search-index-updates-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs: Enable zero-downtime schema evolution',
    taskDescription: 'Configure index versioning and aliases',
    successCriteria: [
      'Click on Search Index component',
      'Enable index versioning',
      'Configure alias: "products"',
      'Configure version: v1',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'search_index', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'search_index' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Configure the Search Index to support versioning and aliases',
    level2: 'Enable versioning, set alias to "products", current version to "v1"',
    solutionComponents: [{ type: 'search_index', config: { versioning: true, alias: 'products' } }],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const searchIndexUpdatesGuidedTutorial: GuidedTutorial = {
  problemId: 'search-index-updates',
  title: 'Design Search Index Update System',
  description: 'Build a system to keep search indexes synchronized with database changes using near real-time indexing, bulk updates, and zero-downtime migrations',
  difficulty: 'intermediate',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '🔄',
    hook: "You've been hired as Search Infrastructure Engineer at E-Commerce Inc!",
    scenario: "Your mission: Build a robust system to keep the search index in sync with 50M products and 6M daily updates, with near real-time freshness and zero downtime.",
    challenge: "Can you design a search indexing system that's fast, reliable, and always available?",
  },

  requirementsPhase: searchIndexUpdatesRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Meta information
  concepts: [
    'Search Index Synchronization',
    'Database vs Search Index',
    'Eventual Consistency',
    'Async Indexing',
    'Message Queue',
    'Bulk Indexing',
    'Batch Processing',
    'Index Versioning',
    'Blue-Green Deployment',
    'Zero-Downtime Migration',
    'Near Real-Time (NRT)',
    'Producer-Consumer Pattern',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (Indexes)',
    'Chapter 5: Replication',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default searchIndexUpdatesGuidedTutorial;
