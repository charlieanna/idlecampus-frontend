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
 * Database Query Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches query caching concepts
 * while building a database query cache system. Each step tells a story that motivates the task.
 *
 * Key Focus Areas:
 * - Query result caching with Redis
 * - Cache invalidation on writes
 * - Write-through vs write-behind strategies
 * - Cache warming
 * - Query result serialization
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic query cache with Redis
 * Steps 4-6: Write-through vs write-behind, cache warming, query result serialization
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const databaseQueryCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a database query cache system to accelerate read-heavy applications",

  interviewer: {
    name: 'Dr. Sarah Chen',
    role: 'Principal Engineer - Data Infrastructure',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'query-patterns',
      category: 'functional',
      question: "What types of queries will users be running, and how frequently do they repeat?",
      answer: "We're seeing heavy query patterns:\n\n1. **Repeated Reads** - Same queries executed hundreds of times (product lookups, user profiles)\n2. **Complex Aggregations** - Analytics queries that scan large datasets\n3. **Hot Spot Queries** - Top 10% of queries account for 90% of traffic\n\nQuery repetition rate: 85% of queries are duplicates of recent queries.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "High query repetition is the perfect use case for caching - we can serve the same results from memory instead of recomputing",
    },
    {
      id: 'cache-invalidation-writes',
      category: 'functional',
      question: "When data changes in the database, how do we ensure cached query results stay fresh?",
      answer: "Cache invalidation is critical! When writes happen:\n\n1. **Immediate Invalidation** - INSERTs, UPDATEs, DELETEs must invalidate affected cached queries\n2. **Table-Level Granularity** - Invalidate all queries touching modified tables\n3. **Write-Through Pattern** - Update both DB and cache atomically\n\nWithout invalidation, users see stale data - major data integrity issue!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Cache invalidation is one of the hardest problems in computer science - Phil Karlton",
    },
    {
      id: 'consistency-requirements',
      category: 'functional',
      question: "How much staleness can we tolerate? Strong vs eventual consistency?",
      answer: "It depends on the data type:\n\n**Critical Data (Inventory, Pricing):**\n- Must be fresh within seconds\n- Use write-through cache or short TTL (5-10 seconds)\n\n**Non-Critical Data (Product descriptions, reviews):**\n- Can tolerate 5-10 minutes staleness\n- Use longer TTL for better cache hit rates\n\nGeneral rule: TTL + invalidation-on-write strategy balances freshness and performance.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Different data has different freshness requirements - one-size-fits-all doesn't work",
    },

    // IMPORTANT - Clarifications
    {
      id: 'query-cache-key',
      category: 'clarification',
      question: "How do we identify identical queries for caching?",
      answer: "Use normalized SQL as cache key:\n\n1. **Exact Match** - 'SELECT * FROM users WHERE id=1' vs 'SELECT * FROM users WHERE id=2' are different\n2. **Normalization** - Strip extra whitespace, lowercase keywords\n3. **Hash Key** - MD5/SHA hash of normalized query for compact keys\n\nExample: `cache_key = md5('select * from users where id = 1')`",
      importance: 'important',
      insight: "Query normalization improves cache hit rates - whitespace differences shouldn't cause cache misses",
    },
    {
      id: 'result-serialization',
      category: 'clarification',
      question: "How do we store query results in Redis? What format?",
      answer: "Store results as serialized JSON:\n\n1. **JSON Format** - Easy to serialize/deserialize, human-readable\n2. **Compression** - gzip for large result sets (>10KB)\n3. **Metadata** - Include row count, column types, execution timestamp\n\nExample:\n\`\`\`json\n{\n  \"rows\": [{\"id\": 1, \"name\": \"Alice\"}],\n  \"count\": 1,\n  \"cached_at\": 1234567890\n}\n```",
      importance: 'important',
      insight: "JSON is universally supported and debuggable - avoid custom binary formats unless performance critical",
    },
    {
      id: 'cache-warming',
      category: 'clarification',
      question: "Should we pre-load frequently accessed queries into cache?",
      answer: "Yes! Cache warming prevents cold start issues:\n\n1. **On Startup** - Pre-load top 100 most frequent queries\n2. **Background Jobs** - Refresh hot queries before TTL expires\n3. **Predictive** - Warm cache before known traffic spikes\n\nWithout warming, cold cache causes latency spikes and database thundering herd.",
      importance: 'important',
      insight: "Proactive cache warming is cheaper than reactive cache misses hammering the database",
    },

    // SCOPE
    {
      id: 'scope-transactions',
      category: 'scope',
      question: "Do we need to support database transactions with caching?",
      answer: "Not for MVP. Transaction-aware caching requires:\n- Invalidation on COMMIT (not on write)\n- Isolation level handling\n- Rollback cache cleanup\n\nDefer to v2 - adds significant complexity.",
      importance: 'nice-to-have',
      insight: "Start simple - transactional caching is an advanced feature",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-qps',
      category: 'throughput',
      question: "How many queries per second should the cache handle?",
      answer: "Peak load: 10,000 queries per second\n- 90% reads (9,000 QPS)\n- 10% writes (1,000 QPS)\n\nCache should serve reads in <5ms at this scale.",
      importance: 'critical',
      calculation: {
        formula: "10K QPS × 90% cache hit rate = 9K cache hits/sec",
        result: "~9,000 cache lookups/sec (Redis easily handles this)",
      },
      learningPoint: "At 10K QPS, every millisecond of overhead matters - cache must be fast",
    },
    {
      id: 'cache-hit-target',
      category: 'throughput',
      question: "What cache hit rate should we target?",
      answer: "Target: 90%+ cache hit rate\n\n- 90% hit rate = 10x reduction in database load\n- 95% hit rate = 20x reduction\n- 99% hit rate = 100x reduction\n\nHit rate depends on query patterns and TTL tuning.",
      importance: 'critical',
      learningPoint: "Cache effectiveness is measured by hit rate - higher is exponentially better",
    },

    // 2. PAYLOAD
    {
      id: 'payload-result-size',
      category: 'payload',
      question: "What's the typical size of query results we'll cache?",
      answer: "Result size distribution:\n- Small (< 1KB): 60% of queries - user lookups, simple selects\n- Medium (1-100KB): 35% - product listings, join queries\n- Large (> 100KB): 5% - analytics, bulk exports\n\nMax cacheable size: 1MB (don't cache huge result sets)",
      importance: 'important',
      calculation: {
        formula: "1000 hot queries × 10KB avg = 10MB",
        result: "~10MB cache memory for working set",
      },
      learningPoint: "Small, frequently-accessed queries benefit most from caching",
    },

    // 3. LATENCY
    {
      id: 'latency-cache-hit',
      category: 'latency',
      question: "What's the acceptable latency for cached queries?",
      answer: "Target latencies:\n- Cache hit: p99 < 5ms (just Redis lookup)\n- Cache miss: p99 < 100ms (DB query + cache store)\n- Write-through: p99 < 150ms (DB write + cache invalidate)",
      importance: 'critical',
      learningPoint: "Cache hits eliminate 10-50ms database round-trip - that's the whole point!",
    },

    // 4. CONSISTENCY
    {
      id: 'write-strategies',
      category: 'consistency',
      question: "Write-through vs write-behind - which caching strategy should we use?",
      answer: "**Write-Through (Recommended for MVP):**\n- Write to DB, then invalidate cache immediately\n- Strong consistency, simple to implement\n- Slight write latency increase\n\n**Write-Behind (Advanced):**\n- Write to cache, async write to DB\n- Faster writes, risk of data loss\n- Complex error handling\n\nStart with write-through for correctness.",
      importance: 'critical',
      insight: "Write-through is safer - write-behind optimizes performance at the cost of complexity",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['query-patterns', 'cache-invalidation-writes', 'throughput-qps'],
  criticalFRQuestionIds: ['query-patterns', 'cache-invalidation-writes'],
  criticalScaleQuestionIds: ['throughput-qps', 'latency-cache-hit', 'write-strategies'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Cache query results for fast retrieval',
      description: 'Identical queries return cached results instead of hitting the database',
      emoji: '⚡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Invalidate cache on writes',
      description: 'Write operations (INSERT, UPDATE, DELETE) invalidate affected cached queries',
      emoji: '🔄',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support write-through caching',
      description: 'Writes update database and invalidate cache atomically',
      emoji: '✍️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million queries/day',
    writesPerDay: '100K writes',
    readsPerDay: '900K reads',
    peakMultiplier: 3,
    readWriteRatio: '90:10',
    calculatedWriteRPS: { average: 1, peak: 3 },
    calculatedReadRPS: { average: 10, peak: 30 },
    maxPayloadSize: '~1MB (max cached result)',
    storagePerRecord: '~10KB average',
    storageGrowthPerYear: 'Bounded by cache size',
    redirectLatencySLA: 'p99 < 5ms (cache hit)',
    createLatencySLA: 'p99 < 100ms (cache miss)',
  },

  architecturalImplications: [
    '✅ 90% reads → Query caching is highly effective',
    '✅ 10K QPS → Need fast in-memory cache (Redis)',
    '✅ 5ms cache hit SLA → Direct memory lookup required',
    '✅ Write invalidation → Need efficient cache key tracking',
    '✅ 10KB average result → Memory-efficient cache storage',
  ],

  outOfScope: [
    'Distributed query cache (single instance for MVP)',
    'Transaction-aware caching',
    'Query result streaming',
    'Cross-database query caching',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple Client → App Server → Database system that executes queries. Once it works, we'll add caching to make it FAST. This is the right approach: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "You're building a data platform for a growing SaaS application!",
  hook: "Users are running the same analytics queries over and over. Your database is getting hammered with duplicate work.",
  challenge: "First step: Set up the basic infrastructure so clients can send queries to your server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your query system is connected!",
  achievement: "Clients can now send query requests to your App Server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't execute queries yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Query Execution Infrastructure',
  conceptExplanation: `Every query cache system starts with the basics - a way for clients to submit queries.

When a user wants to query data, their request travels to your app server, which:
1. Receives the SQL query
2. Processes it (later we'll add caching here)
3. Returns the results

Think of it like a librarian - takes requests for information, retrieves it, returns it to readers.`,
  whyItMatters: 'The app server is the gateway to your data - it coordinates query execution and caching.',
  keyPoints: [
    'App servers handle query requests from clients',
    'Each query is independent',
    'Later we\'ll add caching logic between the client and database',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │  (Query Handler)│
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    {
      title: 'Query Request',
      explanation: 'Client sends SQL SELECT query → Server processes → Returns results',
      icon: '📤',
    },
  ],
};

const step1: GuidedStep = {
  id: 'dbcache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can submit query requests to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications making queries', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles query requests', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send query requests' },
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
// STEP 2: Add Database for Query Execution
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🗄️',
  scenario: "Your App Server is running, but where is the data?",
  hook: "Users are getting 'No database connected' errors. We need a database to store and query data!",
  challenge: "Add a database so the App Server can execute real queries against persistent data.",
  illustration: 'database-missing',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Queries are now executing!",
  achievement: "Your system can execute SQL queries and return actual results",
  metrics: [
    { label: 'Database connected', after: '✓' },
    { label: 'Query latency', after: '50ms avg' },
  ],
  nextTeaser: "But we're hitting the database for EVERY query, even duplicates...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Database: The Source of Truth',
  conceptExplanation: `The **database** is where your actual data lives.

For query caching, the database:
- Stores all the data (users, products, orders, etc.)
- Executes SQL queries to fetch data
- Returns results to the App Server
- Takes 10-50ms per query (the delay we want to eliminate with caching)

The app server sends each query to the database, waits for results, then returns them to the client.`,
  whyItMatters: 'Database queries are slow (10-50ms). When the same query runs 1000 times, that\'s 10-50 seconds wasted! Caching will fix this.',
  realWorldExample: {
    company: 'Reddit',
    scenario: 'Popular posts queried millions of times',
    howTheyDoIt: 'Uses PostgreSQL for data storage + Redis for query result caching. Cache hit rate > 95% for hot posts.',
  },
  keyPoints: [
    'Database stores the source data',
    'Each query takes 10-50ms (network + query execution)',
    'Repeated queries waste time - perfect for caching',
    'App Server → Database connection required',
  ],
  diagram: `
┌────────┐    ┌─────────────┐    ┌──────────┐
│ Client │ →  │ App Server  │ →  │ Database │
└────────┘    └─────────────┘    └──────────┘
                     │                 │
                     ← Query: 50ms ←  │
`,
  keyConcepts: [
    { title: 'SQL Query', explanation: 'SELECT statements to fetch data', icon: '🔍' },
    { title: 'Query Latency', explanation: 'Time to execute query (10-50ms)', icon: '⏱️' },
  ],
  quickCheck: {
    question: 'Why can\'t we store all data in the App Server\'s memory?',
    options: [
      'App Server memory is too small',
      'Data needs to persist across restarts',
      'Multiple app servers need to share data',
      'All of the above',
    ],
    correctIndex: 3,
    explanation: 'Databases provide persistence, shared access, and virtually unlimited capacity - all essential for production systems.',
  },
};

const step2: GuidedStep = {
  id: 'dbcache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Queries must execute against persistent data',
    taskDescription: 'Build Client → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Executes queries', displayName: 'App Server' },
      { type: 'database', reason: 'Stores data persistently', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send queries' },
      { from: 'App Server', to: 'Database', reason: 'Server queries data' },
    ],
    successCriteria: ['Add Client, App Server, Database', 'Connect Client → App Server → Database'],
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
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Query Cache (Redis)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your analytics dashboard is crushing the database!",
  hook: "The same 'top products' query runs 1000 times per second. Each query takes 50ms. The database is at 95% CPU!",
  challenge: "Add a Redis cache to store query results. Check cache first, only hit database on cache miss.",
  illustration: 'database-overload',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Queries are now lightning fast!",
  achievement: "Cached queries return in milliseconds instead of hitting the database",
  metrics: [
    { label: 'Query latency (cached)', before: '50ms', after: '2ms' },
    { label: 'Database load', before: '1000 QPS', after: '50 QPS' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "Great! But what happens when the data changes?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Query Result Caching: The Read-Through Pattern',
  conceptExplanation: `**Query Result Caching** stores the results of expensive queries in fast memory.

**Read-Through Cache Pattern**:
1. Client submits query: "SELECT * FROM products WHERE category='electronics'"
2. App Server checks cache using query as key
3. **Cache HIT**: Return results immediately (2ms)
4. **Cache MISS**: Query database (50ms), store results in cache, return

**Why this works**:
- Same query repeated often → 95%+ cache hit rate
- Cache lookup is 25x faster than database query
- Database handles 20x less load

**Cache Key**: Hash of the SQL query (MD5 or SHA256)
**Cache Value**: Query results (JSON array of rows)
**TTL**: 300 seconds (5 minutes) - auto-expire`,
  whyItMatters: 'At 1000 QPS, caching eliminates 950 database queries per second. Your database goes from 95% CPU to 10%.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'Newsfeed queries hit repeatedly',
    howTheyDoIt: 'Uses TAO (custom query cache) with memcached. Cache hit rate > 99% for hot queries. Saves millions in database infrastructure.',
  },
  famousIncident: {
    title: 'Memcached Thundering Herd',
    company: 'Wikipedia',
    year: '2015',
    whatHappened: 'Wikipedia\'s memcached cluster restarted, all cached query results lost. Millions of queries simultaneously hit the database (cache stampede). Database overloaded and crashed, taking down Wikipedia for 30 minutes.',
    lessonLearned: 'Cache warming, request coalescing, and gradual cache expiration prevent stampedes.',
    icon: '🐘',
  },
  keyPoints: [
    'Cache stores query results, not raw data',
    'Query string (or hash) is the cache key',
    'Check cache first, database on miss (read-through)',
    'TTL prevents stale data (but not perfect)',
    'Redis is ideal - fast key-value lookups',
  ],
  diagram: `
                     ┌─────────────┐
              ┌─────▶│    Cache    │ ← 2ms (HIT!)
              │      │   (Redis)   │
┌────────┐  ┌─┴──────┐└─────────────┘
│ Client │─▶│  App   │      │ miss?
└────────┘  │ Server │      ▼
            └─┬──────┘ ┌─────────────┐
              └───────▶│  Database   │ ← 50ms (MISS)
                       └─────────────┘
`,
  keyConcepts: [
    { title: 'Read-Through', explanation: 'Check cache, fallback to DB on miss', icon: '📖' },
    { title: 'Cache Key', explanation: 'SQL query hash (md5/sha256)', icon: '🔑' },
    { title: 'TTL', explanation: 'Time-To-Live: auto-expire after N seconds', icon: '⏰' },
  ],
  quickCheck: {
    question: 'Why do we cache query results instead of individual rows?',
    options: [
      'Results are smaller than raw rows',
      'Same query returns same results - perfect for caching',
      'It\'s easier to implement',
      'Individual rows change too frequently',
    ],
    correctIndex: 1,
    explanation: 'Query result caching works because the same query (SELECT with WHERE clause) returns the same results, so we can cache the entire result set.',
  },
};

const step3: GuidedStep = {
  id: 'dbcache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-1: Cache query results for fast retrieval',
    taskDescription: 'Build Client → App Server → Database + Cache (Redis)',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Executes queries with caching', displayName: 'App Server' },
      { type: 'database', reason: 'Stores data persistently', displayName: 'Database' },
      { type: 'cache', reason: 'Caches query results', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send queries' },
      { from: 'App Server', to: 'Database', reason: 'Server queries data on cache miss' },
      { from: 'App Server', to: 'Cache', reason: 'Server checks cache first' },
    ],
    successCriteria: ['Build full architecture with Cache', 'Connect App Server to both Database and Cache'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full system with a Cache for fast query results',
    level2: 'Add Client, App Server, Database, and Cache - connect App Server to both storage components',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'database' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Implement Write-Through Cache Invalidation
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Houston, we have a problem! Users are seeing stale data.",
  hook: "A product was deleted from the database, but queries still return it from cache. Users are clicking 'Buy Now' on deleted products!",
  challenge: "Implement write-through caching: when data changes (INSERT, UPDATE, DELETE), invalidate affected cached queries.",
  illustration: 'stale-data',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔄',
  message: "Cache now stays in sync with the database!",
  achievement: "Write operations automatically invalidate stale cached queries",
  metrics: [
    { label: 'Stale data incidents', before: 'Frequent', after: 'Zero' },
    { label: 'Cache invalidation', after: 'Enabled' },
    { label: 'Data freshness', after: 'Guaranteed' },
  ],
  nextTeaser: "But how do we know WHICH queries to invalidate?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Write-Through Invalidation: Keeping Cache Fresh',
  conceptExplanation: `"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

**The Problem**:
- Cached query: "SELECT * FROM products WHERE category='electronics'"
- Someone deletes a product in the 'electronics' category
- Cache is now stale - returns deleted product!

**Write-Through Cache Invalidation**:

**1. Write to Database First**
\`\`\`sql
DELETE FROM products WHERE id = 42;
\`\`\`

**2. Invalidate Affected Cache Keys**
Options for invalidation:
- **Table-Level**: Invalidate ALL queries on 'products' table
- **Pattern-Based**: Invalidate queries matching pattern (e.g., "SELECT * FROM products*")
- **Tag-Based**: Tag queries with affected tables, invalidate by tag

**3. Next Read → Cache Miss → Fetch Fresh Data**

**Write-Through Flow:**
\`\`\`
Client: UPDATE products SET price=99 WHERE id=42
         ↓
App Server:
  1. Update database
  2. Delete cache keys: cache.del('query:*:products:*')
  3. Return success
         ↓
Next Read: Cache miss → Query DB → Cache fresh result
\`\`\``,
  whyItMatters: 'Stale cache data causes bugs, user complaints, and data integrity issues. Write-through invalidation is critical for correctness.',
  famousIncident: {
    title: 'Instagram Feed Staleness',
    company: 'Instagram',
    year: '2016',
    whatHappened: 'A cache invalidation bug caused some users to see posts that were already deleted. Deleted photos kept appearing in feeds for hours because the query cache wasn\'t properly invalidated.',
    lessonLearned: 'Cache invalidation is not optional - it\'s a correctness requirement. Test it thoroughly.',
    icon: '📸',
  },
  realWorldExample: {
    company: 'Twitter',
    scenario: 'Tweet deletion must update all timeline caches',
    howTheyDoIt: 'Uses table-level invalidation + async jobs to purge deleted content from all cached timelines. Typically clears within 1-2 minutes.',
  },
  keyPoints: [
    'Write-through: Write to DB, then invalidate cache',
    'Table-level invalidation: Simple but coarse-grained',
    'Pattern matching: Invalidate queries by pattern',
    'Trade-off: Accuracy vs implementation complexity',
    'Next read after invalidation fetches fresh data',
  ],
  diagram: `
┌───────────────────────────────────────────────────┐
│         WRITE-THROUGH INVALIDATION FLOW           │
├───────────────────────────────────────────────────┤
│                                                   │
│  1. Write Operation:                              │
│     UPDATE products SET price=99 WHERE id=42      │
│                                                   │
│  2. Execute on Database                           │
│     ┌──────────┐                                  │
│     │ Database │ ← UPDATE                         │
│     └──────────┘                                  │
│                                                   │
│  3. Invalidate Affected Cache Keys                │
│     ┌─────────┐                                   │
│     │  Cache  │ ← DELETE pattern:                 │
│     └─────────┘   query:*:products:*              │
│                   (invalidate all product queries)│
│                                                   │
│  4. Next read → Cache miss → Fetch fresh data     │
└───────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Write-Through', explanation: 'Write DB first, then invalidate cache', icon: '✍️' },
    { title: 'Table-Level', explanation: 'Invalidate all queries on a table', icon: '📊' },
    { title: 'Pattern Match', explanation: 'Invalidate by query pattern', icon: '🔍' },
  ],
  quickCheck: {
    question: 'Why not just use TTL and skip invalidation?',
    options: [
      'TTL is too slow',
      'TTL alone allows stale data for up to TTL seconds',
      'Invalidation is easier to implement',
      'TTL doesn\'t work with Redis',
    ],
    correctIndex: 1,
    explanation: 'With only TTL (e.g., 300s), deleted data can appear in cache for up to 5 minutes. Invalidation provides immediate consistency.',
  },
};

const step4: GuidedStep = {
  id: 'dbcache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-2: Invalidate cache when data changes',
    taskDescription: 'Configure write-through invalidation strategy',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles queries and invalidation', displayName: 'App Server' },
      { type: 'database', reason: 'Stores data', displayName: 'Database' },
      { type: 'cache', reason: 'Configure with invalidation', displayName: 'Cache (Redis)' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send queries' },
      { from: 'App Server', to: 'Database', reason: 'Server queries and writes data' },
      { from: 'App Server', to: 'Cache', reason: 'Server manages cache' },
    ],
    successCriteria: [
      'Build full architecture',
      'Understand write-through invalidation pattern',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Architecture is already correct - this step teaches write-through invalidation pattern',
    level2: 'On writes: Update DB, then delete affected cache keys (pattern: query:*:tablename:*)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Implement Write-Behind Caching (Advanced)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🚀',
  scenario: "Your analytics dashboard is doing heavy writes - generating reports and saving them.",
  hook: "Write latency is high (150ms) because we're waiting for both DB write AND cache invalidation. Can we make writes faster?",
  challenge: "Implement write-behind caching: Write to cache immediately, async flush to database.",
  illustration: 'write-behind',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Writes are now blazing fast!",
  achievement: "Write-behind caching reduces write latency by 3x",
  metrics: [
    { label: 'Write latency', before: '150ms', after: '50ms' },
    { label: 'Write throughput', before: '1K/s', after: '3K/s' },
  ],
  nextTeaser: "But what happens if the async write to database fails?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Write-Behind Caching: Trading Consistency for Performance',
  conceptExplanation: `**Write-Through** (previous step): Safe but slow
- Write to DB first (50ms)
- Invalidate cache (10ms)
- Total: 60ms

**Write-Behind**: Fast but risky
- Write to cache immediately (2ms)
- Async queue write to DB (background)
- Total: 2ms for client!

**Write-Behind Architecture**:
\`\`\`
Client: UPDATE products SET price=99
         ↓
App Server:
  1. Write to cache (2ms) ← Client sees success here!
  2. Queue write to DB (async)
  3. Background worker flushes queue → DB
         ↓
Cache updated immediately, DB updated later
\`\`\`

**Challenges**:
1. **Data Loss Risk** - If cache crashes before DB write, data is lost
2. **Ordering** - Need to preserve write order
3. **Error Handling** - What if DB write fails?
4. **Recovery** - How to recover from crashes?

**Mitigation Strategies**:
- **AOF (Append-Only File)** - Redis persistence for durability
- **Write Queue** - Durable queue (Kafka, RabbitMQ) for DB writes
- **Periodic Snapshots** - Checkpoint cache to DB every N seconds
- **Conflict Resolution** - Handle DB write failures gracefully

**When to Use Write-Behind**:
✅ High write volume, read-heavy workload
✅ Tolerate eventual consistency
✅ Non-critical data (analytics, logs)
❌ Financial data, inventory, user accounts`,
  whyItMatters: 'Write-behind optimizes for write performance at the cost of complexity and risk. Use only when necessary.',
  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Activity stream writes (likes, comments)',
    howTheyDoIt: 'Uses write-behind cache with Kafka queue. Writes go to Redis immediately (fast), then asynchronously to database. Can tolerate eventual consistency for activity streams.',
  },
  famousIncident: {
    title: 'Redis Write-Behind Data Loss',
    company: 'Confidential Startup',
    year: '2018',
    whatHappened: 'A startup used write-behind caching for user profile updates without proper AOF persistence. Redis crashed before async DB writes completed. Lost 2 hours of user profile changes - users complained about lost edits.',
    lessonLearned: 'Write-behind requires bulletproof durability (AOF, durable queues). Not suitable for critical user data without extra safeguards.',
    icon: '💥',
  },
  keyPoints: [
    'Write-behind: Cache first, DB later (async)',
    'Dramatically faster writes (2ms vs 60ms)',
    'Risk of data loss if cache crashes',
    'Requires durable queue and AOF persistence',
    'Only use for non-critical, high-volume writes',
  ],
  diagram: `
┌────────────────────────────────────────────────┐
│        WRITE-BEHIND ARCHITECTURE               │
├────────────────────────────────────────────────┤
│                                                │
│  Client: UPDATE products SET price=99          │
│           ↓                                    │
│  App Server:                                   │
│    1. cache.set('query:...', result) → 2ms ✓  │
│    2. queue.push(update_sql)                   │
│           ↓                                    │
│  ┌────────────────┐                            │
│  │  Cache (Redis) │  ← Updated instantly       │
│  └────────────────┘                            │
│           ↓                                    │
│  ┌────────────────┐                            │
│  │  Write Queue   │  ← Durable (Kafka/RabbitMQ)│
│  └────────┬───────┘                            │
│           │ Background worker                  │
│           ▼                                    │
│  ┌────────────────┐                            │
│  │    Database    │  ← Updated async (later)   │
│  └────────────────┘                            │
│                                                │
│  Risk: Cache crash before DB write = data loss│
│  Mitigation: AOF + durable queue               │
└────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Write-Behind', explanation: 'Cache first, DB async - fast but risky', icon: '🚀' },
    { title: 'Durable Queue', explanation: 'Persist pending writes (Kafka, RabbitMQ)', icon: '📬' },
    { title: 'AOF', explanation: 'Redis Append-Only File for durability', icon: '📝' },
  ],
  quickCheck: {
    question: 'When should you use write-behind caching?',
    options: [
      'Always - it\'s faster',
      'For critical financial data',
      'For high-volume, non-critical writes where eventual consistency is acceptable',
      'Never - too risky',
    ],
    correctIndex: 2,
    explanation: 'Write-behind is great for analytics, logs, activity streams - high volume, non-critical data. Avoid for critical data like payments, inventory, user accounts.',
  },
};

const step5: GuidedStep = {
  id: 'dbcache-step-5',
  stepNumber: 5,
  frIndex: 2,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'FR-3: Support write-behind for high write throughput (optional)',
    taskDescription: 'Understand write-behind pattern (no architecture changes)',
    successCriteria: [
      'Architecture already supports write-behind',
      'App Server can: 1) Write to cache, 2) Queue async DB write',
      'This is an implementation pattern in your application code',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'No architecture changes needed - write-behind is an application-level pattern',
    level2: 'In production: Add durable queue (Kafka) + background workers for async DB writes',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement Cache Warming
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🥶',
  scenario: "You just deployed a new cache cluster. It's completely empty!",
  hook: "All traffic is now hitting the database. Latency spiked to 2 seconds. Customers are seeing error pages!",
  challenge: "Implement cache warming to pre-load hot queries before serving traffic.",
  illustration: 'cold-cache',
};

const step6Celebration: CelebrationContent = {
  emoji: '🔥',
  message: "Cache is pre-warmed and ready!",
  achievement: "Hot queries loaded before traffic arrives",
  metrics: [
    { label: 'Cache hit rate on startup', before: '0%', after: '85%' },
    { label: 'Startup latency spike', before: '2000ms', after: '50ms' },
    { label: 'Database queries on startup', before: '10K/sec', after: '1.5K/sec' },
  ],
  nextTeaser: "Perfect! Now let's add query result serialization...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Warming: Prevent Cold Start Problems',
  conceptExplanation: `**The Cold Cache Problem:**

When cache is empty (server restart, new cluster):
- Every request = cache MISS
- All traffic hits database
- Database overloads
- Latency spikes
- Customers see errors

This is called a **thundering herd** or **cache stampede**.

**Solution: Cache Warming**

Pre-load cache with hot queries BEFORE serving traffic:

**1. On Startup:**
\`\`\`python
# Warm cache before accepting requests
hot_queries = [
  "SELECT * FROM products WHERE featured=true",
  "SELECT * FROM users WHERE premium=true",
  # ... top 100 queries
]

for query in hot_queries:
    result = db.execute(query)
    cache.set(query_hash(query), result, ttl=300)

# Now start accepting traffic
app.listen(8000)
\`\`\`

**2. Continuous Warming:**
\`\`\`python
# Background job runs every hour
@scheduled(every='1h')
def refresh_hot_queries():
    for query in hot_queries:
        result = db.execute(query)
        cache.set(query_hash(query), result, ttl=300)
\`\`\`

**3. Predictive Warming:**
- Before expected traffic spikes (Black Friday, product launches)
- Monitor query logs, identify top queries
- Pre-warm based on patterns

**What to warm:**
- Top 1% most frequent queries (cover 50-80% of traffic)
- Critical queries (homepage, search results)
- Slow queries (complex aggregations)`,
  whyItMatters: 'Cache warming prevents latency spikes and database overload during cold starts. Critical for zero-downtime deployments.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'Cache warming for new regional deployments',
    howTheyDoIt: 'Before launching in a new region, they pre-warm cache with popular titles for that region. Prevents cold start stampede when millions of users access the new region.',
  },
  famousIncident: {
    title: 'Reddit Cache Cold Start',
    company: 'Reddit',
    year: '2019',
    whatHappened: 'Reddit deployed a new cache cluster without warming. When they cut over traffic, all requests hit the database. Database couldn\'t handle the load and crashed. Site was down for 45 minutes while they warmed the cache.',
    lessonLearned: 'Always warm cache before serving traffic. Never deploy cold cache to production.',
    icon: '❄️',
  },
  keyPoints: [
    'Warm cache before serving traffic (prevents cold start)',
    'Load top 1% of queries (covers 50-80% of traffic)',
    'Background jobs continuously refresh hot queries',
    'Predictive warming for known spikes',
    'Warming = intentionally causing cache misses to populate cache',
  ],
  diagram: `
┌────────────────────────────────────────────────────┐
│              CACHE WARMING FLOW                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. STARTUP WARMING (Before accepting traffic):   │
│                                                    │
│     ┌──────────────┐                              │
│     │ Warming Job  │                              │
│     └──────┬───────┘                              │
│            │ Execute top 100 queries              │
│            ▼                                       │
│     ┌──────────────┐        ┌─────────┐           │
│     │   Database   │ ─────→ │  Redis  │           │
│     └──────────────┘  Load cache └─────────┘      │
│            │                                       │
│            │ Cache warmed (85% hit rate)          │
│            ▼                                       │
│     ┌──────────────┐                              │
│     │  App Server  │ Start accepting traffic      │
│     └──────────────┘                              │
│                                                    │
│  2. CONTINUOUS WARMING (Background job):          │
│     - Run every hour                              │
│     - Refresh top queries                         │
│     - Prevent eviction of hot queries             │
│                                                    │
└────────────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Cache Warming', explanation: 'Pre-loading cache with hot data', icon: '🔥' },
    { title: 'Thundering Herd', explanation: 'All requests hit DB when cache is cold', icon: '🐘' },
    { title: 'Cold Start', explanation: 'Empty cache causes latency spike', icon: '❄️' },
  ],
  quickCheck: {
    question: 'When should you warm the cache?',
    options: [
      'Only when cache is completely empty',
      'On startup, during scale-up, and continuously via background jobs',
      'Never - let it warm naturally',
      'Only after errors occur',
    ],
    correctIndex: 1,
    explanation: 'Cache warming should be proactive: on startup, during scale events, and continuously for hot queries. Prevents thundering herd.',
  },
};

const step6: GuidedStep = {
  id: 'dbcache-step-6',
  stepNumber: 6,
  frIndex: 0,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'All FRs benefit from cache warming',
    taskDescription: 'Understand cache warming strategy (implementation in application code)',
    successCriteria: [
      'Cache warming is a code-level implementation',
      'In your App Server, you would:',
      '  1. Query database for top queries on startup',
      '  2. Load them into cache before serving traffic',
      '  3. Run background job to refresh hot queries',
      'For this step, understand the concept',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Cache warming is implemented in application code, not as a separate component',
    level2: 'Your architecture supports warming - App Server can query DB and populate cache on startup',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const databaseQueryCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'database-query-cache-guided',
  problemTitle: 'Build a Database Query Cache - Accelerate Read-Heavy Apps',

  requirementsPhase: databaseQueryCacheRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Query Caching',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Cache query results for fast retrieval',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'Cache Invalidation on Writes',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Write operations invalidate affected cached queries',
      traffic: { type: 'mixed', rps: 100, readRps: 90, writeRps: 10 },
      duration: 30,
      passCriteria: { maxStaleReads: 0, maxErrorRate: 0 },
    },
    {
      name: 'Write-Through Performance',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Writes update database and invalidate cache atomically',
      traffic: { type: 'mixed', rps: 500, readRps: 450, writeRps: 50 },
      duration: 60,
      passCriteria: { maxP99Latency: 150, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: High QPS',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10,000 QPS with p99 < 10ms for cached queries',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Cache Hit Rate',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Maintain 90%+ cache hit rate',
      traffic: { type: 'mixed', rps: 5000, readRps: 4500, writeRps: 500 },
      duration: 120,
      passCriteria: { minCacheHitRate: 0.9, maxP99Latency: 50 },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System maintains availability during database issues',
      traffic: { type: 'mixed', rps: 1000, readRps: 900, writeRps: 100 },
      duration: 90,
      failureInjection: { type: 'db_slow', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxP99Latency: 200 },
    },
  ] as TestCase[],

  concepts: [
    'Query result caching with Redis',
    'Cache invalidation strategies',
    'Write-through vs write-behind caching',
    'Cache warming techniques',
    'Query result serialization',
    'TTL-based expiration',
    'Cache key design',
  ],

  difficulty: 'intermediate',
  estimatedMinutes: 45,
};

export function getDatabaseQueryCacheGuidedTutorial(): GuidedTutorial {
  return databaseQueryCacheGuidedTutorial;
}

export default databaseQueryCacheGuidedTutorial;
