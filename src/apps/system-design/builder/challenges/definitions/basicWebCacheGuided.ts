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
 * Basic Web Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches fundamental caching patterns
 * while building a cached web application. Focus on cache-aside pattern, TTL strategies,
 * eviction policies, and monitoring.
 *
 * Focus areas:
 * - Cache-aside pattern (lazy loading)
 * - TTL (Time-to-Live) strategies
 * - Eviction policies (LRU, LFU)
 * - Cache invalidation
 * - Cache warm-up strategies
 * - Monitoring and observability
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic system with cache layer (cache-aside pattern)
 * Steps 4-6: Add cache invalidation, warm-up strategies, and monitoring
 *
 * Key Pedagogy: First make it WORK (basic caching), then make it SMART (invalidation),
 * then make it OBSERVABLE (monitoring)
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const basicWebCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a basic web caching system to reduce database load and improve response times",

  interviewer: {
    name: 'Jordan Chen',
    role: 'Principal Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-operations',
      category: 'functional',
      question: "What's the primary purpose of adding a cache to our web application?",
      answer: "The cache should:\n1. **Reduce database load** - Serve frequently-accessed data from memory instead of querying the database\n2. **Improve response times** - Memory access (1-2ms) is 10-50x faster than database queries (10-50ms)\n3. **Handle read-heavy workloads** - Perfect for applications with 80%+ read traffic",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Caching is about trading memory for speed and reducing load on slower backends",
    },
    {
      id: 'cache-hit-ratio',
      category: 'functional',
      question: "What cache hit ratio should we target? How do we know if our cache is effective?",
      answer: "Target 80-90%+ cache hit rate. This means:\n- 80-90% of requests served from cache (fast)\n- 10-20% cache misses hit the database (slower)\n\n**Key metrics**:\n- Cache hit rate = (cache hits) / (total requests)\n- 90% hit rate = 10x reduction in database load\n- Below 70% hit rate indicates poor cache effectiveness",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Cache hit ratio is the #1 metric for cache effectiveness",
    },
    {
      id: 'ttl-strategy',
      category: 'functional',
      question: "How long should data stay in the cache? What if it becomes stale?",
      answer: "We need TTL (Time-To-Live) strategy:\n- **Short-lived data** (user sessions): 5-15 minutes TTL\n- **Medium-lived data** (product info): 1-6 hours TTL\n- **Long-lived data** (static content): 24 hours+ TTL\n\nDifferent data types need different TTLs based on update frequency!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "TTL controls the trade-off between freshness and cache effectiveness",
    },
    {
      id: 'eviction-policy',
      category: 'functional',
      question: "What happens when the cache fills up? How do we decide what to remove?",
      answer: "We need an eviction policy! Common strategies:\n- **LRU (Least Recently Used)**: Remove items not accessed recently\n- **LFU (Least Frequently Used)**: Remove items accessed least often\n- **FIFO (First In First Out)**: Remove oldest items\n\nLRU is the most popular - it keeps 'hot' data in cache automatically.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Eviction policies ensure the cache contains the most valuable data",
    },

    // IMPORTANT - Clarifications
    {
      id: 'cache-pattern',
      category: 'clarification',
      question: "Should we use cache-aside, write-through, or write-behind pattern?",
      answer: "Use **cache-aside** (lazy loading) for this use case:\n1. Check cache first\n2. On cache miss, query database\n3. Store result in cache\n4. Return to user\n\nPros: Simple, only caches what's actually requested\nCons: First request is slow (cache miss)",
      importance: 'important',
      insight: "Cache-aside is the most common and flexible caching pattern",
    },
    {
      id: 'cache-invalidation',
      category: 'clarification',
      question: "When data changes in the database, how do we update the cache?",
      answer: "Cache invalidation strategies:\n1. **TTL expiration**: Let cache expire naturally (simple)\n2. **Explicit invalidation**: Delete cache entry on database update (accurate)\n3. **Write-through**: Update cache when updating database (complex)\n\nFor MVP, use TTL + explicit invalidation for critical data.",
      importance: 'important',
      insight: "Cache invalidation is one of the hardest problems in computer science",
    },
    {
      id: 'cache-warmup',
      category: 'clarification',
      question: "Should we pre-load the cache with popular data, or let it fill naturally?",
      answer: "Both! Strategy:\n- **Cold start**: Cache is empty, fills naturally (lazy loading)\n- **Warm-up**: Pre-load top 100-1000 most popular items on startup\n- **Continuous warming**: Background job refreshes hot items before TTL expires\n\nWarm-up prevents cache stampede on popular items.",
      importance: 'important',
      insight: "Cache warm-up reduces latency spikes during cold starts",
    },

    // SCOPE
    {
      id: 'scope-distributed',
      category: 'scope',
      question: "Do we need a distributed cache across multiple servers?",
      answer: "For this basic design, single Redis instance is sufficient. Distributed caching (Redis Cluster, Memcached cluster) adds complexity:\n- Data sharding across nodes\n- Replication for high availability\n- Consistent hashing\n\nWe'll defer that to advanced caching tutorials.",
      importance: 'nice-to-have',
      insight: "Start with single cache instance, scale to distributed cache as needed",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many requests per second should the cache handle?",
      answer: "1,000 requests/second at peak with 90% read traffic = 900 read requests/sec",
      importance: 'critical',
      calculation: {
        formula: "1,000 RPS × 90% reads = 900 read RPS",
        result: "~900 reads/sec",
      },
      learningPoint: "Cache should handle read-heavy traffic without degrading performance",
    },
    {
      id: 'cache-size',
      category: 'payload',
      question: "How much memory should we allocate for the cache?",
      answer: "Estimate cache size:\n- 10,000 hot items\n- Average item size: 10KB\n- Total: 100MB of data\n\nAllocate 512MB-1GB Redis cache (room for growth + overhead)",
      importance: 'important',
      calculation: {
        formula: "10K items × 10KB = 100MB data + overhead",
        result: "~512MB-1GB cache memory",
      },
      learningPoint: "Cache size should hold working set (hot data) comfortably",
    },
    {
      id: 'latency-target',
      category: 'latency',
      question: "What's the acceptable latency for cached vs. uncached requests?",
      answer: "**Cache hit**: p99 < 10ms (memory lookup)\n**Cache miss**: p99 < 100ms (database query + cache store)\n\nCache should add < 2ms overhead to database queries.",
      importance: 'critical',
      learningPoint: "Cache hits should be 10x faster than cache misses",
    },
    {
      id: 'monitoring-metrics',
      category: 'observability',
      question: "What metrics should we track to monitor cache health?",
      answer: "Critical metrics:\n1. **Hit rate**: % of requests served from cache (target 80-90%)\n2. **Latency**: p50, p95, p99 for cache hits and misses\n3. **Memory usage**: % of cache memory used\n4. **Eviction rate**: How often are items evicted?\n5. **Key count**: Number of items in cache\n\nAlerts: Hit rate < 70%, latency > 20ms, memory > 90%",
      importance: 'critical',
      insight: "You can't improve what you don't measure - monitoring is essential",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'cache-hit-ratio', 'ttl-strategy', 'eviction-policy'],
  criticalFRQuestionIds: ['core-operations', 'cache-hit-ratio', 'ttl-strategy', 'eviction-policy'],
  criticalScaleQuestionIds: ['throughput-reads', 'latency-target', 'monitoring-metrics'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Cache frequently-accessed data',
      description: 'Store hot data in memory to reduce database load and improve response times',
      emoji: '⚡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Achieve 80-90% cache hit ratio',
      description: 'Most requests should be served from cache, not database',
      emoji: '🎯',
    },
    {
      id: 'fr-3',
      text: 'FR-3: TTL-based cache expiration',
      description: 'Different data types have appropriate TTLs based on update frequency',
      emoji: '⏰',
    },
    {
      id: 'fr-4',
      text: 'FR-4: LRU eviction policy',
      description: 'When cache is full, evict least recently used items to make room for new data',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100K users',
    writesPerDay: '1 million writes',
    readsPerDay: '9 million reads',
    peakMultiplier: 3,
    readWriteRatio: '90:10',
    calculatedWriteRPS: { average: 12, peak: 36 },
    calculatedReadRPS: { average: 104, peak: 312 },
    maxPayloadSize: '~10KB per cached item',
    redirectLatencySLA: 'p99 < 10ms (cache hit)',
    createLatencySLA: 'p99 < 100ms (cache miss)',
  },

  architecturalImplications: [
    '✅ 90% read traffic → Caching is highly effective',
    '✅ 80%+ hit rate → 5-10x reduction in database load',
    '✅ Redis cache → 1-2ms latency for cache hits',
    '✅ Cache-aside pattern → Simple, flexible, battle-tested',
    '✅ LRU eviction → Automatically keeps hot data in cache',
  ],

  outOfScope: [
    'Distributed caching (Redis Cluster)',
    'Write-through caching patterns',
    'Cache replication for high availability',
    'Cross-region cache synchronization',
  ],

  keyInsight: "Caching is about making smart trade-offs: memory for speed, freshness for performance. Master cache hit ratio, TTL strategies, and eviction policies to build blazing-fast applications that scale!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "You're building a web application that serves product information to users.",
  hook: "Right now, every request hits your database. It's slow and doesn't scale!",
  challenge: "First, let's establish the basic connection between users and your application server.",
  illustration: 'basic-connection',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your web application is connected!",
  achievement: "Users can now send requests to your server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But we need a database to store data...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'The Foundation: Client-Server Architecture',
  conceptExplanation: `Every web application starts with a simple model: **Client → App Server**.

When a user visits your application:
1. Client (browser/app) sends HTTP request: \`GET /product/123\`
2. App server processes the request
3. Server responds with data (JSON, HTML, etc.)
4. Client displays the result

**The problem**: Where does the server get the data from? We need a database!`,
  whyItMatters: 'The app server is the brains of your application - it coordinates between clients and backends (database, cache).',
  keyPoints: [
    'Client-server is the foundation of web architecture',
    'App server handles business logic and routing',
    'Clients send requests, servers respond',
    'Next: Connect server to database for data persistence',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │ ──────▶ │   App Server    │
│  (Browser)  │ ◀────── │                 │
└─────────────┘         └─────────────────┘

    GET /product/123
         ↓
    200 OK (JSON)
`,
  keyConcepts: [
    {
      title: 'HTTP Request',
      explanation: 'Client asks for data (GET /product/123)',
      icon: '📤',
    },
    {
      title: 'HTTP Response',
      explanation: 'Server sends back data (200 OK + payload)',
      icon: '📥',
    },
  ],
  quickCheck: {
    question: 'What role does the app server play?',
    options: [
      'It stores all data permanently',
      'It coordinates requests and responses between clients and backends',
      'It replaces the database',
      'It only serves static HTML files',
    ],
    correctIndex: 1,
    explanation: 'The app server is the middleman - it handles business logic, coordinates with databases/caches, and serves responses to clients.',
  },
};

const step1: GuidedStep = {
  id: 'web-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can send requests to the application',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users/browsers', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles application logic', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'HTTP requests/responses' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Start with the basics: Client and App Server',
    level2: 'Drag Client and App Server from the sidebar, then connect Client → App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Database - Persistent Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Your app server is running, but where is the data stored?",
  hook: "Product details, user info, orders - everything needs persistent storage!",
  challenge: "Add a database to store your application's data.",
  illustration: 'add-database',
};

const step2Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Your data is now persisted!",
  achievement: "Application can store and retrieve data from the database",
  metrics: [
    { label: 'Data durability', after: '✓ Persisted' },
    { label: 'Can query data', after: '✓' },
  ],
  nextTeaser: "But every request hits the database - that's slow!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Persistent Storage: The Database',
  conceptExplanation: `Your app server needs to fetch data from somewhere. Enter: **the database**.

**The architecture flow**:
1. Client requests: \`GET /product/123\`
2. App server queries database: \`SELECT * FROM products WHERE id=123\`
3. Database returns product data (10-50ms)
4. Server formats response and sends to client

**The problem**: Database queries are slow!
- Typical query: 10-50ms
- Popular products queried thousands of times
- Same data, repeated queries - wasteful!
- Database becomes a bottleneck

**Solution preview**: We'll add a cache (next step) to avoid repeated database queries!`,
  whyItMatters: 'Databases are essential for persistence, but they are slow compared to memory. This is why we need caching!',
  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product pages viewed millions of times per day',
    howTheyDoIt: 'Product data is stored in DynamoDB, but heavily cached in Redis/ElastiCache. Cache hit rate > 95% - only 5% of requests hit the database.',
  },
  keyPoints: [
    'Database stores persistent data',
    'Each query has 10-50ms latency',
    'Popular data gets queried repeatedly',
    'Database can become a bottleneck under load',
    'Next: Add cache to reduce database load',
  ],
  diagram: `
┌─────────┐       ┌──────────┐       ┌──────────┐
│ Client  │ ────▶ │   App    │ ────▶ │ Database │
│         │ ◀──── │  Server  │ ◀──── │          │
└─────────┘       └──────────┘       └──────────┘

   GET /product      Query DB         Product data
                  (10-50ms latency)
`,
  keyConcepts: [
    { title: 'Persistence', explanation: 'Data survives server restarts', icon: '💾' },
    { title: 'Query Latency', explanation: 'Database queries take 10-50ms', icon: '⏱️' },
    { title: 'Bottleneck', explanation: 'Database can become the slowest part of the system', icon: '🚧' },
  ],
  quickCheck: {
    question: 'Why is querying the database on every request inefficient?',
    options: [
      'Databases are unreliable',
      'Popular data gets queried repeatedly with the same results',
      'Databases cannot handle concurrent requests',
      'SQL queries are too complex',
    ],
    correctIndex: 1,
    explanation: 'The same product might be viewed 10,000 times - querying the database 10,000 times for identical data is wasteful! This is where caching helps.',
  },
};

const step2: GuidedStep = {
  id: 'web-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Data must be stored persistently',
    taskDescription: 'Add Database and connect it to the App Server',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Already added', displayName: 'App Server' },
      { type: 'database', reason: 'Stores persistent data', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected' },
      { from: 'App Server', to: 'Database', reason: 'Query data' },
    ],
    successCriteria: ['Build Client → App Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database and connect the App Server to it',
    level2: 'Your architecture should be: Client → App Server → Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 3: Add Cache Layer - Cache-Aside Pattern
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your most popular product is viewed 1,000 times per minute. That's 1,000 database queries for the exact same data!",
  hook: "The database is getting hammered. Query latency is increasing. Users are frustrated.",
  challenge: "Add a cache layer (Redis) to store frequently-accessed data in memory. This is the cache-aside pattern!",
  illustration: 'cache-layer',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Caching is now active!",
  achievement: "Cache-aside pattern reduces database load dramatically",
  metrics: [
    { label: 'Cache hit latency', after: '< 2ms' },
    { label: 'Database queries', before: '1,000/min', after: '~100/min' },
    { label: 'Response time', before: '50ms', after: '5ms' },
  ],
  nextTeaser: "Excellent! But how do we handle cache misses efficiently and set TTLs?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Cache-Aside Pattern: The Most Popular Caching Strategy',
  conceptExplanation: `**Cache-aside** (also called lazy loading) is the most common caching pattern.

**How it works**:
1. Client requests: \`GET /product/123\`
2. App server checks cache: \`GET product:123\`
3. **Cache HIT**: Return cached data (1-2ms) ✨
4. **Cache MISS**:
   - Query database (10-50ms)
   - Store result in cache with TTL: \`SET product:123 <data> EX 3600\`
   - Return to client

**The magic**: Second request is served from cache!
- First user: 50ms (cache miss + database query)
- Next 999 users: 2ms (cache hit!)
- Database load reduced by 10x or more

**Key characteristics**:
- Cache only what's actually requested (lazy loading)
- Cache misses are automatically filled
- Simple to implement and reason about
- Most popular pattern in the industry`,
  whyItMatters: 'Cache-aside pattern is simple, flexible, and effective. It is the foundation of most caching systems at scale.',
  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serves billions of user profile requests per day',
    howTheyDoIt: 'Uses cache-aside with Memcached/TAO. When you view a profile, first check cache. On miss, query MySQL, store in cache with 1-hour TTL. Cache hit rate > 95%.',
  },
  famousIncident: {
    title: 'The Cache Stampede',
    company: 'Major E-commerce Site',
    year: '2019',
    whatHappened: 'A viral product went live without cache warm-up. 10,000 simultaneous requests hit the cache-cold system. All cache misses hit the database simultaneously (cache stampede). Database crashed under load. Site went down during peak sales.',
    lessonLearned: 'Always warm up cache for expected hot items. Implement cache stampede protection (request coalescing).',
    icon: '💥',
  },
  keyPoints: [
    'Cache-aside: Check cache first, fall back to database on miss',
    'Cache hits are 10-50x faster than database queries',
    'Only requested data is cached (lazy loading)',
    'TTL ensures data does not stay stale forever',
    'First request is slow (cache miss), subsequent requests are fast',
  ],
  diagram: `
CACHE-ASIDE PATTERN:

First request (CACHE MISS):
┌────────┐   1. GET      ┌─────────┐
│ Client │ ──────────▶   │   App   │
└────────┘               │  Server │
                         └────┬────┘
                         2. Check cache
                              ↓
                         ┌────────┐
                         │ Cache  │ ← MISS
                         └────────┘

                         3. Query DB
                              ↓
                         ┌──────────┐
                         │ Database │
                         └─────┬────┘
                               ↓ 4. Store in cache
                         ┌────────┐
                         │ Cache  │ ← SET product:123
                         └────────┘
                               ↓ 5. Return
┌────────┐               ┌─────────┐
│ Client │ ◀──────────── │   App   │
└────────┘               │  Server │
                         └─────────┘

Second request (CACHE HIT):
┌────────┐   1. GET      ┌─────────┐
│ Client │ ──────────▶   │   App   │
└────────┘               │  Server │
                         └────┬────┘
                         2. Check cache
                              ↓
                         ┌────────┐
                         │ Cache  │ ← HIT! (1-2ms)
                         └────┬───┘
                              ↓ 3. Return (no DB query!)
┌────────┐               ┌─────────┐
│ Client │ ◀──────────── │   App   │
└────────┘               │  Server │
                         └─────────┘
`,
  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - fast path (1-2ms)', icon: '✨' },
    { title: 'Cache Miss', explanation: 'Data not in cache - slow path (query DB)', icon: '❌' },
    { title: 'Lazy Loading', explanation: 'Cache fills on-demand as requests come in', icon: '🔄' },
    { title: 'TTL', explanation: 'Time-to-Live - how long data stays in cache', icon: '⏰' },
  ],
  quickCheck: {
    question: 'In cache-aside pattern, what happens on a cache miss?',
    options: [
      'Return error to client',
      'Query database, store in cache, return to client',
      'Wait for cache to be manually updated',
      'Redirect request to another server',
    ],
    correctIndex: 1,
    explanation: 'Cache-aside automatically fills the cache on miss: query database → store in cache → return to client. This is "lazy loading".',
  },
};

const step3: GuidedStep = {
  id: 'web-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Cache frequently-accessed data to reduce database load',
    taskDescription: 'Add Cache (Redis) between App Server and Database',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Implements cache-aside logic', displayName: 'App Server' },
      { type: 'cache', reason: 'In-memory cache (Redis)', displayName: 'Cache' },
      { type: 'database', reason: 'Persistent storage', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'HTTP requests' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache first' },
      { from: 'App Server', to: 'Database', reason: 'Fall back on cache miss' },
    ],
    successCriteria: ['Build Client → App Server → Cache + Database (cache-aside pattern)'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Cache and connect App Server to both Cache and Database',
    level2: 'Architecture: Client → App Server → Cache + Database',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Cache Invalidation - Keep Data Fresh
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔄',
  scenario: "Your cache is working great! But then a product price changes in the database...",
  hook: "Users are still seeing the OLD price from cache for the next hour (TTL). Some users buy at old price. Big problem!",
  challenge: "We need cache invalidation - when data changes, remove it from cache immediately!",
  illustration: 'cache-invalidation',
};

const step4Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Cache invalidation is working!",
  achievement: "Data changes are immediately reflected by invalidating cache entries",
  metrics: [
    { label: 'Stale data incidents', before: 'Frequent', after: 'None' },
    { label: 'Data freshness', after: '< 1 second' },
  ],
  nextTeaser: "Great! But what about cache stampede protection and warm-up strategies?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation: Keeping Data Fresh',
  conceptExplanation: `**"There are only two hard things in Computer Science: cache invalidation and naming things."** - Phil Karlton

**The problem**: Cached data can become stale when database is updated.

**Example**:
1. Product price cached: $100 (TTL: 1 hour)
2. Price updated in database: $80
3. Cache still shows $100 for next hour!

**Solution: Cache Invalidation Strategies**

**1. TTL-based expiration** (passive)
- Set TTL on all cache entries: \`SET product:123 <data> EX 3600\`
- Data automatically expires after 1 hour
- Simple but can serve stale data until TTL expires

**2. Explicit invalidation** (active)
- When updating database, delete cache entry: \`DEL product:123\`
- Next request will cache miss and fetch fresh data
- More accurate but requires careful coordination

**3. Write-through** (proactive)
- Update database AND cache simultaneously
- Most accurate but most complex

**Best practice**: Use TTL + explicit invalidation
- TTL prevents cache from growing unbounded
- Explicit invalidation ensures critical updates are immediate`,
  whyItMatters: 'Cache invalidation is critical for data correctness. Stale data can cause business problems (wrong prices, incorrect inventory).',
  realWorldExample: {
    company: 'Twitter',
    scenario: 'When you post a tweet, it must appear in followers\' timelines immediately',
    howTheyDoIt: 'On new tweet: 1) Write to database, 2) Invalidate cache for user\'s timeline and all followers\' timelines, 3) Next request rebuilds fresh cache. Handles billions of tweets per day.',
  },
  famousIncident: {
    title: 'The Stale Inventory Problem',
    company: 'Major E-commerce Platform',
    year: '2020',
    whatHappened: 'Product inventory counts were cached for 1 hour. During flash sale, 100 units sold out in 5 minutes, but cache showed "in stock" for 55 more minutes. 1000s of customers placed orders for out-of-stock items. Massive refunds and customer service nightmare.',
    lessonLearned: 'Critical data (inventory, pricing) needs immediate cache invalidation on writes, not just TTL expiration.',
    icon: '📉',
  },
  keyPoints: [
    'Cache invalidation ensures data freshness',
    'TTL-based: Simple, but can serve stale data until expiration',
    'Explicit invalidation: Immediate, but requires coordination with writes',
    'Best practice: TTL + explicit invalidation for critical data',
    'Invalidate on UPDATE/DELETE, let cache refill on next read',
  ],
  diagram: `
WITHOUT INVALIDATION:
1. Cache: Price = $100 (TTL: 1 hour)
2. Database UPDATE: Price = $80
3. Cache: Price = $100 ← STALE! (until TTL expires)
4. Users see wrong price for up to 1 hour

WITH INVALIDATION:
1. Cache: Price = $100
2. Database UPDATE: Price = $80
   ↓
3. DELETE cache entry: product:123
   ↓
4. Next request: Cache MISS
   ↓
5. Query database: $80
   ↓
6. Cache new value: $80
   ↓
7. Users see correct price immediately!

INVALIDATION FLOW:
┌──────────┐                     ┌──────────┐
│   App    │ ── 1. UPDATE ─────▶ │ Database │
│  Server  │                     └──────────┘
└────┬─────┘
     │ 2. DEL product:123
     ▼
┌──────────┐
│  Cache   │ Cache entry removed
└──────────┘
     │
     ▼ 3. Next GET request
     Cache MISS → Rebuild with fresh data
`,
  keyConcepts: [
    { title: 'Stale Data', explanation: 'Cached data that is outdated/incorrect', icon: '🕰️' },
    { title: 'Invalidation', explanation: 'Removing or updating cached data when source changes', icon: '🗑️' },
    { title: 'Write Coordination', explanation: 'Update database and invalidate cache together', icon: '🔗' },
  ],
  quickCheck: {
    question: 'When should you invalidate a cache entry?',
    options: [
      'Never - let TTL handle it',
      'When the underlying data is updated or deleted',
      'Every 5 minutes automatically',
      'Only when users complain about stale data',
    ],
    correctIndex: 1,
    explanation: 'Invalidate cache when data changes (UPDATE/DELETE operations). This ensures users see fresh data on their next request.',
  },
};

const step4: GuidedStep = {
  id: 'web-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Invalidate cache when data changes to prevent stale data',
    taskDescription: 'Cache invalidation is implemented in application logic. Architecture remains the same.',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles invalidation on writes', displayName: 'App Server' },
      { type: 'cache', reason: 'Cache entries are deleted on invalidation', displayName: 'Cache' },
      { type: 'database', reason: 'Source of truth', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'HTTP requests' },
      { from: 'App Server', to: 'Cache', reason: 'Check cache + invalidate on writes' },
      { from: 'App Server', to: 'Database', reason: 'Writes and cache miss reads' },
    ],
    successCriteria: ['Architecture remains Client → App Server → Cache + Database (invalidation in code)'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Cache invalidation is in application code - architecture stays the same',
    level2: 'Keep Client → App Server → Cache + Database. On database writes, app server deletes cache entries.',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Cache Warm-Up - Prevent Cold Start Latency
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your app just deployed! Cache is completely empty (cold start).",
  hook: "The first 10,000 requests all hit the database (cache misses). Database CPU spikes to 100%. Response times are 10x slower than normal!",
  challenge: "We need cache warm-up - pre-load hot data before traffic hits!",
  illustration: 'cache-warmup',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Cache warm-up is preventing cold start issues!",
  achievement: "Pre-loaded cache with hot data for smooth deployments",
  metrics: [
    { label: 'Cache hit rate on deploy', before: '0%', after: '80%' },
    { label: 'Database load spike', before: '10x', after: '1.2x' },
    { label: 'P99 latency on deploy', before: '500ms', after: '20ms' },
  ],
  nextTeaser: "Perfect! Now let's add monitoring to track cache performance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Warm-Up: Preventing the Cold Start Problem',
  conceptExplanation: `**The cold start problem**: When cache is empty (after deploy, restart, or failure), all requests are cache misses. This creates a "thundering herd" hitting the database.

**Cache warm-up strategies**:

**1. Pre-population on startup**
- On app start, load top N most popular items into cache
- Example: Top 1,000 products, most active users
- Takes 30-60 seconds, but prevents disaster

**2. Continuous warming (background job)**
- Periodically refresh hot items before TTL expires
- Prevents popular items from ever becoming cache misses
- Example: Every 30 minutes, refresh top 100 items

**3. Cache stampede protection**
- When multiple requests hit same cache miss simultaneously
- First request locks the key, fetches from DB, fills cache
- Other requests wait for first request to complete
- Prevents 1000 simultaneous DB queries for same data

**Implementation**:
\`\`\`python
# On startup
def warm_up_cache():
    hot_product_ids = get_top_n_products(1000)
    for product_id in hot_product_ids:
        product = db.get_product(product_id)
        cache.set(f"product:{product_id}", product, ttl=3600)

# Continuous warming
@scheduled_job("every 30 minutes")
def refresh_hot_cache():
    # Refresh before TTL expires
    ...
\`\`\``,
  whyItMatters: 'Cache warm-up prevents performance degradation during deploys and restarts. Critical for maintaining SLAs.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'Deploys new app versions 100+ times per day',
    howTheyDoIt: 'Before routing traffic to new instances, warm up cache with: 1) Popular shows/movies, 2) User profiles of active users, 3) Recommendation results. Cache hit rate stays > 95% even during rolling deploys.',
  },
  famousIncident: {
    title: 'The Thundering Herd',
    company: 'Gaming Platform',
    year: '2021',
    whatHappened: 'New game launch. Cache empty. 100,000 users hit the site simultaneously at launch time. All cache misses. Database couldn\'t handle 100K simultaneous queries. Database crashed. Site down for 2 hours during the most critical launch window.',
    lessonLearned: 'Always warm up cache before major events. Pre-load known hot items. Implement request coalescing for cache stampede protection.',
    icon: '🎮',
  },
  keyPoints: [
    'Cold start: Empty cache causes all requests to hit database',
    'Warm-up: Pre-load popular items before traffic arrives',
    'Continuous warming: Refresh hot items before TTL expires',
    'Cache stampede: Multiple concurrent requests for same missing data',
    'Protection: Request coalescing, locks, or probabilistic early expiration',
  ],
  diagram: `
WITHOUT WARM-UP (Cold Start):
App Deploy → Empty Cache
     ↓
First 1000 requests
     ↓
1000 cache misses
     ↓
1000 simultaneous DB queries
     ↓
Database overload! 💥

WITH WARM-UP:
App Deploy → Warm-up job runs
     ↓
Load top 1000 products into cache
     ↓
Mark instance as "ready"
     ↓
Route traffic
     ↓
First 1000 requests
     ↓
800 cache hits, 200 cache misses
     ↓
Database handles 200 queries easily ✓

CACHE STAMPEDE PROTECTION:
Request 1 ──┐
Request 2 ──┤
Request 3 ──┼──▶ Cache MISS for product:123
Request 4 ──┤
Request 5 ──┘
     ↓
Request 1: Acquires lock, queries DB
Requests 2-5: Wait for Request 1
     ↓
Request 1: Stores in cache, releases lock
     ↓
Requests 2-5: Get from cache (now HIT)
     ↓
Result: 1 DB query instead of 5!
`,
  keyConcepts: [
    { title: 'Cold Start', explanation: 'Empty cache after deploy/restart', icon: '🥶' },
    { title: 'Warm-up', explanation: 'Pre-load popular data into cache', icon: '🔥' },
    { title: 'Cache Stampede', explanation: 'Many concurrent requests for same missing data', icon: '🐃' },
    { title: 'Request Coalescing', explanation: 'Collapse concurrent requests for same data', icon: '🔗' },
  ],
  quickCheck: {
    question: 'What is a cache stampede?',
    options: [
      'When the cache runs out of memory',
      'Multiple concurrent requests for the same cache-missed item overwhelming the database',
      'When the cache eviction policy removes too many items',
      'When TTL is set too long',
    ],
    correctIndex: 1,
    explanation: 'Cache stampede occurs when many requests simultaneously try to fetch the same missing cache item, causing many parallel database queries. Request coalescing solves this.',
  },
};

const step5: GuidedStep = {
  id: 'web-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Pre-load cache with hot data to prevent cold start issues',
    taskDescription: 'Cache warm-up is implemented as application logic. Architecture remains the same.',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Runs warm-up job on startup', displayName: 'App Server' },
      { type: 'cache', reason: 'Receives pre-loaded data', displayName: 'Cache' },
      { type: 'database', reason: 'Source for warm-up data', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'HTTP requests' },
      { from: 'App Server', to: 'Cache', reason: 'Read/write cache including warm-up' },
      { from: 'App Server', to: 'Database', reason: 'Fetch warm-up data and handle cache misses' },
    ],
    successCriteria: ['Architecture remains Client → App Server → Cache + Database (warm-up in startup code)'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Cache warm-up is application logic - architecture stays the same',
    level2: 'Keep Client → App Server → Cache + Database. On startup, app server pre-loads hot data into cache.',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Monitoring - Observability and Metrics
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "Your cache is running, but you have no idea if it's actually working well!",
  hook: "Is the hit rate good? Is memory usage too high? Are there performance issues? You're flying blind!",
  challenge: "Add monitoring to track cache performance metrics and detect problems!",
  illustration: 'monitoring',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Complete caching system with observability!",
  achievement: "You can now monitor cache performance and optimize based on data",
  metrics: [
    { label: 'Cache hit rate visibility', after: 'Real-time dashboard' },
    { label: 'Performance alerts', after: 'Configured' },
    { label: 'Optimization capability', after: 'Data-driven' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade caching system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Monitoring: You Cannot Improve What You Do Not Measure',
  conceptExplanation: `**"Without data, you're just another person with an opinion."** - W. Edwards Deming

Monitoring is essential for understanding cache effectiveness and detecting issues.

**Critical Cache Metrics**:

**1. Hit Rate** (most important!)
- Formula: \`hits / (hits + misses)\`
- Target: 80-90%+ for effective caching
- Low hit rate (< 70%) indicates:
  - Cache size too small
  - TTL too short
  - Traffic pattern not cache-friendly
  - Cache key strategy is wrong

**2. Latency**
- P50, P95, P99 latency for cache hits and misses
- Cache hit: target < 5ms
- Cache miss: should be close to database latency
- High cache hit latency indicates: network issues, cache overload

**3. Memory Usage**
- Current memory / Max memory
- Track memory growth over time
- Alert when > 80% full
- High memory indicates: need larger cache or better eviction

**4. Eviction Rate**
- How many items are evicted per minute
- High eviction rate indicates: cache too small for working set
- Solution: Increase cache size or reduce TTL

**5. Key Count**
- Total number of keys in cache
- Track growth over time
- Sudden drops indicate: mass eviction or cache flush

**6. Error Rate**
- Cache connection errors, timeouts
- Should be < 0.01%
- Errors should trigger fallback to database

**Alerting Rules**:
- Hit rate < 70% for > 5 minutes → Investigate
- P99 latency > 50ms → Performance degradation
- Memory usage > 90% → Risk of eviction storm
- Error rate > 1% → Cache infrastructure issue`,
  whyItMatters: 'Monitoring transforms your cache from a black box into an optimizable system. Data-driven decisions lead to better performance.',
  realWorldExample: {
    company: 'Spotify',
    scenario: 'Monitors cache performance across thousands of microservices',
    howTheyDoIt: 'Every cache interaction is logged with metrics: hit/miss, latency, key pattern. Dashboards show hit rate by service, memory usage trends, eviction rates. Alerts fire when hit rate drops below thresholds. This visibility enabled them to optimize cache configuration and achieve 95%+ hit rates.',
  },
  famousIncident: {
    title: 'The Silent Cache Failure',
    company: 'Major SaaS Platform',
    year: '2022',
    whatHappened: 'Cache hit rate gradually dropped from 90% to 40% over 2 weeks due to changing traffic patterns. No monitoring, so no one noticed. Database load increased 5x. Database eventually hit capacity limits and started rejecting connections. Site degraded. Took days to diagnose because cache metrics were not tracked.',
    lessonLearned: 'Monitor cache hit rate continuously. Set up alerts for degradation. Treat cache metrics as first-class observability signals.',
    icon: '📉',
  },
  keyPoints: [
    'Hit rate is the #1 cache metric (target 80-90%+)',
    'Monitor latency (P50, P95, P99) for both hits and misses',
    'Track memory usage and eviction rate',
    'Set up alerts for hit rate drops and performance degradation',
    'Use data to optimize cache size, TTL, and eviction policy',
    'Cache metrics should be visible in dashboards and alerting',
  ],
  diagram: `
CACHE MONITORING DASHBOARD:

┌─────────────────────────────────────────────────┐
│ Cache Performance Metrics                       │
├─────────────────────────────────────────────────┤
│ Hit Rate:          87.3% ✓ (target: 80%+)      │
│ Request Rate:      1,240 req/sec               │
│                                                 │
│ Latency:                                        │
│   P50:  2ms  (hits)    45ms (misses)           │
│   P95:  5ms  (hits)    89ms (misses)           │
│   P99:  12ms (hits)   142ms (misses)           │
│                                                 │
│ Memory Usage:      431 MB / 512 MB (84%) ⚠️    │
│ Key Count:         42,387 keys                 │
│ Eviction Rate:     23 evictions/min            │
│                                                 │
│ Error Rate:        0.02% ✓                     │
└─────────────────────────────────────────────────┘

KEY METRICS FLOW:
┌────────────┐
│   Client   │
└─────┬──────┘
      ↓ Request
┌─────────────┐
│ App Server  │ ← Log: timestamp, operation
└──────┬──────┘
       ↓ Cache lookup
┌─────────────┐
│   Cache     │ ← Record: HIT or MISS, latency
└─────────────┘
       ↓
  Metrics DB (Prometheus/Datadog)
       ↓
  Dashboard + Alerts

OPTIMIZATION BASED ON METRICS:

Low hit rate (60%)?
  → Increase cache size
  → Increase TTL
  → Review cache key strategy

High eviction rate?
  → Cache too small for working set
  → Increase memory allocation

High P99 latency?
  → Cache overloaded
  → Network issues
  → Add more cache instances
`,
  keyConcepts: [
    { title: 'Hit Rate', explanation: '% of requests served from cache (target 80-90%)', icon: '🎯' },
    { title: 'Latency', explanation: 'Response time for cache operations (P50, P95, P99)', icon: '⏱️' },
    { title: 'Memory Usage', explanation: '% of cache memory used (alert at 80%+)', icon: '💾' },
    { title: 'Eviction Rate', explanation: 'How often items are removed from cache', icon: '🔄' },
  ],
  quickCheck: {
    question: 'What does a cache hit rate of 95% mean?',
    options: [
      'Cache is 95% full',
      '95% of requests are served from cache without hitting the database',
      'Cache latency is 95ms',
      '95% of cache keys have been evicted',
    ],
    correctIndex: 1,
    explanation: '95% hit rate means 95 out of 100 requests are served from cache - only 5% hit the database. This is excellent cache effectiveness!',
  },
};

const step6: GuidedStep = {
  id: 'web-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Monitor cache performance with metrics and alerts',
    taskDescription: 'Monitoring is implemented through observability tools. Architecture remains the same.',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Client' },
      { type: 'app_server', reason: 'Emits cache metrics', displayName: 'App Server' },
      { type: 'cache', reason: 'Performance is monitored', displayName: 'Cache' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'HTTP requests' },
      { from: 'App Server', to: 'Cache', reason: 'Cache operations (monitored)' },
      { from: 'App Server', to: 'Database', reason: 'Cache misses (monitored)' },
    ],
    successCriteria: ['Architecture remains Client → App Server → Cache + Database (monitoring via instrumentation)'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Monitoring is instrumentation in application code - architecture stays the same',
    level2: 'Keep Client → App Server → Cache + Database. App server instruments cache operations with metrics.',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const basicWebCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'basic-web-cache-guided',
  problemTitle: 'Build a Web Caching System - Master Cache Patterns',

  requirementsPhase: basicWebCacheRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Caching',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Cache frequently-accessed data to reduce database load',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Cache Hit Ratio',
      type: 'performance',
      requirement: 'FR-2',
      description: 'Achieve 80%+ cache hit rate',
      traffic: { type: 'read', rps: 200, readRps: 200 },
      duration: 60,
      passCriteria: { minCacheHitRate: 0.80, maxP99Latency: 20 },
    },
    {
      name: 'TTL Expiration',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Cached data expires based on TTL settings',
      traffic: { type: 'read', rps: 100, readRps: 100 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Cache Under Load',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle high read traffic with caching',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.05, minCacheHitRate: 0.75 },
    },
    {
      name: 'Cache Performance',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Cache hits should be under 10ms p99',
      traffic: { type: 'read', rps: 300, readRps: 300 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, minCacheHitRate: 0.85 },
    },
  ] as TestCase[],
};

export function getBasicWebCacheGuidedTutorial(): GuidedTutorial {
  return basicWebCacheGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = basicWebCacheRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= basicWebCacheRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
