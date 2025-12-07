import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Multiregion Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching multi-region cache design concepts
 * through building a global distributed cache system.
 *
 * Key Concepts:
 * - Cross-region cache replication
 * - Cache invalidation strategies
 * - Consistency models (eventual consistency)
 * - Multi-region deployment patterns
 * - Conflict resolution
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const multiregionCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a globally distributed cache system with multi-region support",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Principal Engineer at GlobalScale Systems',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main operations users need from this cache system?",
      answer: "Users need to:\n\n1. **Read from cache** - Get cached data with low latency from their nearest region\n2. **Write to cache** - Update cached data that propagates globally\n3. **Invalidate cache entries** - Remove stale data across all regions\n4. **Monitor cache health** - View cache hit rates and replication status",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-4',
      learningPoint: "Global caches must balance local performance with global consistency",
    },
    {
      id: 'cache-operations',
      category: 'functional',
      question: "How should cache reads work across regions?",
      answer: "Users should always read from their nearest region for low latency. The cache should return data from local storage without waiting for remote regions. This is called 'read local' pattern.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Reading locally is essential for performance - remote reads add 100-300ms latency",
    },
    {
      id: 'cache-writes',
      category: 'functional',
      question: "When a user updates cache in US-East, what happens in EU-West?",
      answer: "The write is accepted immediately in US-East. Then it asynchronously replicates to EU-West and other regions. This is eventual consistency - EU-West will have the update within seconds, but not instantly.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Strong consistency across regions adds 100-300ms latency - eventual consistency is the practical choice",
    },
    {
      id: 'invalidation',
      category: 'functional',
      question: "How should cache invalidation work globally?",
      answer: "When data changes in the database, ALL cache regions must be invalidated to prevent serving stale data. This needs to be fast and reliable - we can't have some regions with old data.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Cache invalidation is one of the hardest problems in distributed systems",
    },
    {
      id: 'consistency-model',
      category: 'clarification',
      question: "What consistency guarantees do we need?",
      answer: "Eventual consistency is acceptable. After a write, all regions will eventually see the update within 1-2 seconds. For critical reads requiring strong consistency, clients can bypass cache and read from database.",
      importance: 'important',
      insight: "Eventual consistency is the right tradeoff for global caching - strong consistency kills performance",
    },
    {
      id: 'conflict-resolution',
      category: 'clarification',
      question: "What happens if two regions update the same cache key simultaneously?",
      answer: "Last-write-wins (LWW) based on timestamp. The write with the latest timestamp wins. This is simple and works for most caching use cases where the source of truth is the database.",
      importance: 'important',
      insight: "For caches, conflicts are rare since database is source of truth. Simple resolution strategies work.",
    },

    // SCALE & NFRs
    {
      id: 'throughput-regions',
      category: 'throughput',
      question: "How many regions should we support?",
      answer: "Start with 3 regions: US-East, US-West, and EU-West. Design should scale to 10+ regions eventually.",
      importance: 'critical',
      learningPoint: "Multi-region design complexity grows with regions - start with 3, design for 10+",
    },
    {
      id: 'throughput-reads',
      category: 'throughput',
      question: "How many cache reads per second per region?",
      answer: "Each region handles about 100K cache reads/sec at peak. That's 300K globally across 3 regions.",
      importance: 'critical',
      calculation: {
        formula: "100K reads/sec × 3 regions = 300K global reads/sec",
        result: "~300K reads/sec globally",
      },
      learningPoint: "Reads must be served locally - cross-region reads would add unbearable latency",
    },
    {
      id: 'throughput-writes',
      category: 'throughput',
      question: "How many cache writes per second?",
      answer: "About 10K cache writes/sec globally (caches are read-heavy). Each write must replicate to all regions.",
      importance: 'critical',
      calculation: {
        formula: "10K writes/sec × 3 regions = 30K replication events/sec",
        result: "~30K cross-region replications/sec",
      },
      learningPoint: "Write volume determines replication bandwidth and lag",
    },
    {
      id: 'latency-read',
      category: 'latency',
      question: "What's the acceptable cache read latency?",
      answer: "p99 under 5ms for local cache reads. This is why we need local replicas in each region.",
      importance: 'critical',
      learningPoint: "Cache reads must be local - cross-region would be 100-300ms, defeating the purpose",
    },
    {
      id: 'latency-write',
      category: 'latency',
      question: "What about write latency?",
      answer: "p99 under 10ms to acknowledge the write locally. Replication to other regions happens asynchronously in the background (within 1-2 seconds).",
      importance: 'important',
      learningPoint: "Async replication is key - synchronous would add 100-300ms per region",
    },
    {
      id: 'latency-invalidation',
      category: 'latency',
      question: "How fast must cache invalidation propagate?",
      answer: "All regions should be invalidated within 2 seconds. This prevents serving stale data for too long.",
      importance: 'critical',
      learningPoint: "Fast invalidation is critical for correctness - stale data causes bugs",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What happens if one region goes down?",
      answer: "Other regions must continue working normally. If US-East fails, users in that region can failover to US-West with slightly higher latency. EU-West is unaffected.",
      importance: 'critical',
      learningPoint: "Regional independence is key - one region's failure shouldn't cascade",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'cache-operations', 'cache-writes', 'invalidation'],
  criticalFRQuestionIds: ['core-features', 'cache-operations', 'cache-writes'],
  criticalScaleQuestionIds: ['throughput-regions', 'throughput-reads', 'latency-read', 'latency-invalidation'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Fast local reads from nearest region',
      description: 'Users read cached data from their local region with <5ms latency',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Global cache writes with replication',
      description: 'Cache writes in one region replicate to all other regions',
      emoji: '✍️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Fast global cache invalidation',
      description: 'Invalidate cache entries across all regions within 2 seconds',
      emoji: '🗑️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Cache health monitoring',
      description: 'Track cache hit rates and replication lag per region',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (infrastructure service)',
    writesPerDay: '864 million cache writes',
    readsPerDay: '8.64 billion cache reads',
    peakMultiplier: 2,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 10000, peak: 20000 },
    calculatedReadRPS: { average: 100000, peak: 200000 },
    maxPayloadSize: '~1MB per cache entry',
    storagePerRecord: '~10KB average',
    storageGrowthPerYear: 'Capped by TTL',
    redirectLatencySLA: 'p99 < 5ms (reads)',
    createLatencySLA: 'p99 < 10ms (writes)',
  },

  architecturalImplications: [
    '✅ 300K reads/sec → Local cache replicas required in each region',
    '✅ p99 < 5ms reads → Cannot do cross-region reads',
    '✅ 30K cross-region replications/sec → Dedicated replication channels',
    '✅ 2s invalidation SLA → Need pub/sub for fast propagation',
    '✅ Regional failures → Independent cache clusters per region',
    '✅ Eventual consistency → Last-write-wins conflict resolution',
  ],

  outOfScope: [
    'Strong consistency across regions',
    'Custom conflict resolution (CRDTs)',
    'Active-active writes to same keys',
    'Distributed transactions',
  ],

  keyInsight: "First, let's make it WORK with a single cache. Then we'll add multi-region replication. Finally, we'll tackle invalidation and consistency. Functionality first, distribution second!",
};

// =============================================================================
// STEP 1: Set Up Basic Cache Infrastructure
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to GlobalScale Systems! You're building a multi-region cache.",
  hook: "Your first user makes a request. They need fast data access!",
  challenge: "Set up the basic infrastructure so clients can access the cache.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your cache infrastructure is live!',
  achievement: 'Clients can now access the cache system',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But we only have one region...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Infrastructure Basics',
  conceptExplanation: `A distributed cache starts with basic components:

**Client** → **App Server** → **Cache** → **Database**

When a user requests data:
1. App Server checks Cache first (fast)
2. If cache miss → fetch from Database (slow)
3. Store result in Cache for next time

This is the foundation we'll build on!`,

  whyItMatters: 'Without this basic flow, users query the database directly - too slow at scale.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Serving billions of reads per day',
    howTheyDoIt: 'Facebook uses Memcached in multiple regions, with sophisticated invalidation. 95%+ cache hit rate.',
  },

  keyPoints: [
    'Cache sits between App Server and Database',
    'Cache Hit = fast response (1-5ms)',
    'Cache Miss = slower, fetch from database',
    'Start with single region, then add more',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User applications making requests', icon: '📱' },
    { title: 'App Server', explanation: 'Business logic and cache coordination', icon: '🖥️' },
    { title: 'Cache', explanation: 'Fast in-memory data store', icon: '⚡' },
  ],
};

const step1: GuidedStep = {
  id: 'multiregion-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add Client, App Server, Cache, and Database, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents applications using the cache', displayName: 'Client' },
      { type: 'app_server', reason: 'Coordinates cache operations', displayName: 'App Server' },
      { type: 'cache', reason: 'Fast in-memory storage', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Source of truth for data', displayName: 'Database' },
    ],
    successCriteria: [
      'Client, App Server, Cache, and Database added',
      'Client → App Server → Cache → Database connected',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag Client, App Server, Cache, and Database from the palette onto the canvas',
    level2: 'Connect: Client → App Server → Cache. Also connect App Server → Database',
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
// STEP 2: Implement Cache Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your infrastructure is connected, but the cache doesn't do anything yet!",
  hook: "A user tried to fetch data but got an error - no cache logic exists.",
  challenge: "Implement the cache-aside pattern with Python code.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Cache logic is working!',
  achievement: 'Your cache-aside pattern is serving requests',
  metrics: [
    { label: 'Cache hit rate', after: '~80%' },
    { label: 'Average latency', after: '3ms' },
  ],
  nextTeaser: "But this only works in one region...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Cache-Aside Pattern Implementation',
  conceptExplanation: `The **cache-aside pattern** is the most common caching strategy:

**On Read:**
1. Check cache for key
2. If found (cache hit) → return immediately
3. If not found (cache miss) → fetch from database
4. Store fetched data in cache with TTL
5. Return data to client

**On Write:**
1. Update database first (source of truth)
2. Invalidate cache entry (or update it)
3. Next read will repopulate cache

This ensures cache and database stay synchronized!`,

  whyItMatters: 'Cache-aside gives you control over what gets cached and when, perfect for read-heavy workloads.',

  famousIncident: {
    title: 'Facebook Memcached Thundering Herd',
    company: 'Facebook',
    year: '2013',
    whatHappened: 'During cache invalidation of popular keys, thousands of servers simultaneously queried the database to refill cache. Database was overwhelmed. Facebook implemented lease-based locking to prevent stampedes.',
    lessonLearned: 'Cache invalidation needs coordination to prevent thundering herd problem.',
    icon: '🏃',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Serving timeline reads',
    howTheyDoIt: 'Uses cache-aside pattern with Redis. Timeline reads hit cache first, database only on miss. TTL of 60 seconds.',
  },

  keyPoints: [
    'Always check cache first before database',
    'On cache miss, fetch from DB and populate cache',
    'Set appropriate TTL to prevent stale data',
    'Invalidate cache on writes to maintain consistency',
  ],

  quickCheck: {
    question: 'In cache-aside pattern, when should you invalidate cache?',
    options: [
      'Never - let TTL expire entries',
      'When underlying data changes in database',
      'Every hour automatically',
      'When cache is full',
    ],
    correctIndex: 1,
    explanation: 'You should invalidate cache when the source data changes to prevent serving stale data. TTL is backup, not primary mechanism.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Data found in cache - fast path', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Data not in cache - fetch from DB', icon: '❌' },
    { title: 'TTL', explanation: 'Time To Live - when cache entries expire', icon: '⏱️' },
  ],
};

const step2: GuidedStep = {
  id: 'multiregion-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast reads using cache-aside pattern',
    taskDescription: 'Configure cache settings and implement cache-aside logic in Python',
    successCriteria: [
      'Click on Cache to open inspector',
      'Set cache strategy to cache-aside',
      'Set TTL to 300 seconds',
      'Open Python tab on App Server',
      'Implement cache read/write handlers',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCacheStrategy: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Cache component, set strategy to cache-aside and TTL to 300 seconds',
    level2: 'Click App Server, go to Python tab, implement get_data() with cache-aside logic',
    solutionComponents: [
      { type: 'cache', config: { strategy: 'cache-aside', ttl: 300 } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Load Balancer for Scalability
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📈',
  scenario: "Traffic is growing! Your single app server is getting overwhelmed.",
  hook: "Users are experiencing slowdowns during peak hours. We need to scale!",
  challenge: "Add a load balancer to distribute traffic across multiple servers.",
  illustration: 'traffic-spike',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Load is now balanced!',
  achievement: 'Multiple app servers can handle traffic',
  metrics: [
    { label: 'Capacity', before: '10K req/s', after: '100K+ req/s' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "Time to go multi-region!",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing for Horizontal Scaling',
  conceptExplanation: `A **Load Balancer** distributes requests across multiple app servers.

Benefits:
- **Higher throughput** - more servers = more capacity
- **Fault tolerance** - if one server dies, others continue
- **No single point of failure** - redundancy at app tier

For caches:
- All app servers connect to the SAME cache cluster
- This ensures consistent cache state
- Cache hit rate is maintained across servers`,

  whyItMatters: 'At 100K reads/sec, you need many app servers. Load balancer is essential for horizontal scaling.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling millions of concurrent users',
    howTheyDoIt: 'Uses AWS ELB to distribute across thousands of app servers, all sharing the same EVCache clusters.',
  },

  keyPoints: [
    'Load balancer sits between client and app servers',
    'Distributes requests using round-robin or least-connections',
    'All app servers share the same cache cluster',
    'Enables adding more servers without client changes',
  ],

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'Horizontal Scaling', explanation: 'Add more servers for capacity', icon: '↔️' },
    { title: 'Shared Cache', explanation: 'All app servers use same cache', icon: '🔗' },
  ],
};

const step3: GuidedStep = {
  id: 'multiregion-cache-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across app servers', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client → Load Balancer → App Server connected',
      'App Server instances set to 3+',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server. Set App Server instances to 3',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server', config: { instances: 3 } },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Deploy Second Region
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Europe are complaining about slow cache access!",
  hook: "Your cache is in US-East. European users have 150ms latency - way too slow!",
  challenge: "Deploy a second region (EU-West) with its own cache cluster.",
  illustration: 'global-latency',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'You are now multi-region!',
  achievement: 'Two regions serving users with local latency',
  metrics: [
    { label: 'EU user latency', before: '150ms', after: '5ms' },
    { label: 'Regions', before: '1', after: '2' },
  ],
  nextTeaser: "But the regions don't know about each other...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Deployment Pattern',
  conceptExplanation: `**Multi-region architecture** deploys complete stacks in multiple geographic locations.

Each region has:
- Its own Load Balancer
- Its own App Servers
- Its own Cache cluster
- Shared Database (or regional replicas)

Benefits:
- **Low latency** - users connect to nearest region
- **Fault tolerance** - one region down doesn't affect others
- **Data residency** - comply with regional data laws

The challenge: keeping caches synchronized!`,

  whyItMatters: 'Users in EU can\'t wait 150ms for US cache. Multi-region is mandatory for global services.',

  famousIncident: {
    title: 'AWS US-East Outage',
    company: 'Multiple companies',
    year: '2017',
    whatHappened: 'AWS US-East region had major S3 outage. Services deployed only in US-East went completely down. Multi-region services stayed online by failing over to other regions.',
    lessonLearned: 'Multi-region deployment is insurance against regional failures.',
    icon: '🌩️',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Serving global users',
    howTheyDoIt: 'Deploys cache clusters in US-East, US-West, EU-West, and AP-Southeast. Each region serves local users with <10ms latency.',
  },

  keyPoints: [
    'Each region is a complete, independent stack',
    'Users routed to nearest region (GeoDNS)',
    'Regions must eventually synchronize state',
    'Start with 2-3 regions, design for 10+',
  ],

  keyConcepts: [
    { title: 'Region', explanation: 'Complete deployment in one location', icon: '🗺️' },
    { title: 'GeoDNS', explanation: 'Routes users to nearest region', icon: '🧭' },
    { title: 'Regional Cache', explanation: 'Independent cache per region', icon: '💾' },
  ],
};

const step4: GuidedStep = {
  id: 'multiregion-cache-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Fast local reads from multiple regions',
    taskDescription: 'Deploy second region with Load Balancer, App Servers, and Cache',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'EU region load balancer', displayName: 'EU Load Balancer' },
      { type: 'app_server', reason: 'EU app servers', displayName: 'EU App Server' },
      { type: 'cache', reason: 'EU cache cluster', displayName: 'EU Redis Cache' },
    ],
    successCriteria: [
      'Second set of Load Balancer, App Server, and Cache added',
      'Second region connected: LB → App Server → Cache',
      'Both regions can access shared database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleRegions: true,
  },

  hints: {
    level1: 'Duplicate your US-East setup: Add another Load Balancer, App Server, and Cache',
    level2: 'Create second region: LB → App Server → Cache → Database. Both regions share the database',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server', config: { instances: 3 } },
      { type: 'cache', config: { strategy: 'cache-aside', ttl: 300 } },
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
// STEP 5: Add Message Queue for Cache Replication
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "A user in US-East updates their profile. The cache refreshes in US-East...",
  hook: "But users in EU-West still see the old profile! The caches are out of sync!",
  challenge: "Add a message queue to replicate cache updates across regions.",
  illustration: 'data-sync',
};

const step5Celebration: CelebrationContent = {
  emoji: '🔁',
  message: 'Cache replication is working!',
  achievement: 'Cache updates now propagate across regions',
  metrics: [
    { label: 'Replication lag', after: '<1 second' },
    { label: 'Cross-region sync', after: 'Active' },
  ],
  nextTeaser: "But what about cache invalidation?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cross-Region Cache Replication',
  conceptExplanation: `**Cache replication** keeps regional caches synchronized using messaging.

Pattern:
1. User updates data in US-East
2. App server writes to local cache
3. App server publishes update event to Message Queue
4. EU-West subscribers receive event
5. EU-West updates its local cache

This is **asynchronous replication**:
- Fast local writes (no waiting for remote regions)
- Eventually consistent (1-2 second lag)
- Scales to many regions

Message Queue provides:
- **Reliable delivery** - events won't be lost
- **Fan-out** - one event reaches all regions
- **Ordering** - events applied in order`,

  whyItMatters: 'Without replication, regional caches diverge and serve stale data indefinitely.',

  famousIncident: {
    title: 'Instagram Cache Consistency Bug',
    company: 'Instagram',
    year: '2016',
    whatHappened: 'Cache replication lag caused users to see deleted photos reappear. Cache invalidation events were lost in queue overflow. Instagram added better monitoring and circuit breakers.',
    lessonLearned: 'Cache replication must be reliable and monitored. Lost events cause data inconsistencies.',
    icon: '📸',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Replicating Memcached across data centers',
    howTheyDoIt: 'Uses custom pub/sub system (Wormhole) to replicate cache invalidations. Processes millions of events/sec.',
  },

  keyPoints: [
    'Message queue enables async cross-region communication',
    'Each region publishes cache updates to queue',
    'All regions subscribe to receive updates',
    'Eventual consistency - 1-2 second lag acceptable',
  ],

  quickCheck: {
    question: 'Why use asynchronous replication instead of synchronous?',
    options: [
      'It is easier to implement',
      'Synchronous would add 100-300ms latency per region',
      'Asynchronous is more reliable',
      'Synchronous is not possible',
    ],
    correctIndex: 1,
    explanation: 'Synchronous replication requires waiting for remote regions (100-300ms each), killing performance. Async replication is fast locally, eventual globally.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Reliable async messaging between regions', icon: '📬' },
    { title: 'Pub/Sub', explanation: 'Publish once, all subscribers receive', icon: '📡' },
    { title: 'Eventual Consistency', explanation: 'All regions eventually see updates', icon: '⏱️' },
  ],
};

const step5: GuidedStep = {
  id: 'multiregion-cache-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Cache writes replicate across regions',
    taskDescription: 'Add Message Queue for cross-region cache replication',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Replicate cache updates across regions', displayName: 'Message Queue (Kafka)' },
    ],
    successCriteria: [
      'Message Queue component added',
      'Both regions\' App Servers connected to Message Queue',
      'Queue configured for pub/sub pattern',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireMultipleRegions: true,
  },

  hints: {
    level1: 'Add Message Queue component. Connect both regions\' App Servers to it',
    level2: 'US-East App Server → MQ, EU-West App Server → MQ. This enables bidirectional replication',
    solutionComponents: [
      { type: 'message_queue', config: { pattern: 'pub-sub' } },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement Cache Invalidation Strategy
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🗑️',
  scenario: "A user deletes their account, but their data still appears in cache!",
  hook: "Database has the correct state (deleted), but cache in both regions still serves old data.",
  challenge: "Implement global cache invalidation to remove stale entries.",
  illustration: 'data-inconsistency',
};

const step6Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Cache invalidation is working globally!',
  achievement: 'Stale cache entries are invalidated across all regions',
  metrics: [
    { label: 'Invalidation propagation', after: '<2 seconds' },
    { label: 'Stale data incidents', before: 'Frequent', after: 'Rare' },
  ],
  nextTeaser: "What about handling conflicts?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Global Cache Invalidation Strategies',
  conceptExplanation: `**Cache invalidation** is notoriously hard in distributed systems.

Strategies:
1. **TTL-based** - Cache entries expire after time
   - Pro: Simple, automatic cleanup
   - Con: May serve stale data until expiry

2. **Write-through invalidation** - Invalidate on DB write
   - Pro: Immediate consistency
   - Con: More complex, requires coordination

3. **Pub/Sub invalidation** - Publish invalidation events
   - Pro: Fast propagation to all regions
   - Con: Event delivery must be reliable

Best practice: **Combine all three**
- TTL as safety net (5-15 minutes)
- Write-through for critical updates
- Pub/Sub for cross-region propagation

Phil Karlton: "There are only two hard things in Computer Science: cache invalidation and naming things."`,

  whyItMatters: 'Stale cache data causes bugs, shows deleted content, and breaks user experience.',

  famousIncident: {
    title: 'CloudFlare Cache Purge Bug',
    company: 'CloudFlare',
    year: '2019',
    whatHappened: 'A bug in cache invalidation logic caused some cache entries to never purge. Deleted content kept appearing for days. CloudFlare rewrote their invalidation system with better verification.',
    lessonLearned: 'Cache invalidation must be tested thoroughly. Always have TTL as backup.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Invalidating tweet caches',
    howTheyDoIt: 'Uses combination of short TTL (60s) and active invalidation via message queue. When tweet deleted, invalidation event sent to all cache regions.',
  },

  keyPoints: [
    'Cache invalidation is one of hardest distributed systems problems',
    'Use TTL as safety net (5-15 min for non-critical data)',
    'Active invalidation for immediate consistency',
    'Pub/Sub to propagate invalidations across regions',
    'Monitor invalidation lag and failures',
  ],

  quickCheck: {
    question: 'Why is TTL still needed if you have active invalidation?',
    options: [
      'TTL is faster than active invalidation',
      'TTL is a safety net if invalidation events are lost',
      'TTL is required by Redis',
      'TTL reduces memory usage',
    ],
    correctIndex: 1,
    explanation: 'Active invalidation can fail (network issues, bugs). TTL ensures stale data eventually expires even if invalidation events are lost.',
  },

  keyConcepts: [
    { title: 'TTL Expiry', explanation: 'Automatic cleanup after time', icon: '⏰' },
    { title: 'Active Invalidation', explanation: 'Explicitly remove on data change', icon: '🗑️' },
    { title: 'Invalidation Lag', explanation: 'Time to propagate across regions', icon: '⏱️' },
  ],
};

const step6: GuidedStep = {
  id: 'multiregion-cache-step-6',
  stepNumber: 6,
  frIndex: 2,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-3: Fast global cache invalidation',
    taskDescription: 'Implement invalidation logic and configure TTL',
    successCriteria: [
      'Cache TTL configured (300 seconds as backup)',
      'Invalidation events published to Message Queue',
      'All regions subscribe to invalidation events',
      'Python code implements invalidation handler',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
    requireCodeImplementation: true,
    requireMultipleRegions: true,
  },

  hints: {
    level1: 'Verify Cache has TTL set. Implement invalidation handler in App Server Python code',
    level2: 'When data changes: 1) Update DB, 2) Invalidate local cache, 3) Publish invalidation event to MQ',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Monitoring for Cache Health
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "Your cache is running, but you have no visibility into how it's performing!",
  hook: "Is EU-West cache lagging? What's the hit rate? Are invalidations propagating?",
  challenge: "Add monitoring to track cache health across regions.",
  illustration: 'monitoring-dashboard',
};

const step7Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Complete visibility into cache performance!',
  achievement: 'Monitoring tracks hit rates, lag, and health per region',
  metrics: [
    { label: 'Cache hit rate', after: '85%' },
    { label: 'Replication lag', after: '<1s' },
    { label: 'Regions monitored', after: '2' },
  ],
  nextTeaser: "Almost done! Let's handle conflicts...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Monitoring Multi-Region Caches',
  conceptExplanation: `**Cache monitoring** is essential for operational health.

Key metrics to track:
1. **Hit Rate** - % of requests served from cache
   - Target: >80% for read-heavy workloads
   - Low hit rate → investigate cache sizing or TTL

2. **Replication Lag** - Time for updates to reach all regions
   - Target: <2 seconds p99
   - High lag → check network or queue capacity

3. **Invalidation Latency** - Time to purge stale data
   - Target: <2 seconds globally
   - High latency → risk of serving stale data

4. **Memory Usage** - Cache memory consumption
   - Monitor to prevent evictions
   - Set up alerts at 70% capacity

5. **Error Rate** - Failed cache operations
   - Should be near 0%
   - Spikes indicate network or cache issues`,

  whyItMatters: 'Without monitoring, cache problems go unnoticed until users complain. Observability enables proactive fixes.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Monitoring EVCache across regions',
    howTheyDoIt: 'Tracks hit rate, latency, and error rate per cache cluster. Alerts if hit rate drops below 95% or latency exceeds 10ms.',
  },

  keyPoints: [
    'Monitor hit rate per region (target >80%)',
    'Track replication lag (target <2s)',
    'Alert on invalidation failures',
    'Dashboard for cache health visibility',
  ],

  keyConcepts: [
    { title: 'Hit Rate', explanation: '% of requests served from cache', icon: '🎯' },
    { title: 'Replication Lag', explanation: 'Delay propagating to regions', icon: '⏱️' },
    { title: 'Observability', explanation: 'Visibility into system behavior', icon: '👁️' },
  ],
};

const step7: GuidedStep = {
  id: 'multiregion-cache-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Cache health monitoring',
    taskDescription: 'Add monitoring for cache metrics across regions',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Track cache performance and health', displayName: 'Monitoring (Prometheus)' },
    ],
    successCriteria: [
      'Monitoring component added',
      'Connected to all App Servers',
      'Tracking hit rate, lag, and errors',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleRegions: true,
  },

  hints: {
    level1: 'Add Monitoring component and connect all App Servers to it',
    level2: 'Each region\'s App Server should emit metrics to centralized Monitoring',
    solutionComponents: [
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 8: Handle Conflicts with Last-Write-Wins
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚔️',
  scenario: "Two users in different regions update the same data simultaneously!",
  hook: "US-East cache says value is 'A'. EU-West cache says value is 'B'. Who wins?",
  challenge: "Implement Last-Write-Wins conflict resolution.",
  illustration: 'conflict-resolution',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Conflicts are resolved automatically!',
  achievement: 'Last-Write-Wins ensures eventual consistency',
  metrics: [
    { label: 'Conflict resolution', after: 'Automatic' },
    { label: 'Consistency model', after: 'Eventual' },
  ],
  nextTeaser: "Your multi-region cache is complete!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Conflict Resolution: Last-Write-Wins',
  conceptExplanation: `When multiple regions update the same cache key simultaneously, we need **conflict resolution**.

**Last-Write-Wins (LWW):**
- Each write has a timestamp
- When conflict detected, keep the write with latest timestamp
- Simple and deterministic

Implementation:
1. Each cache entry stores: {value, timestamp}
2. On write: include current timestamp
3. On replication: compare timestamps
4. If incoming timestamp > local timestamp: update
5. If incoming timestamp < local timestamp: ignore

Pros:
- Simple to implement and reason about
- No coordination needed
- Works well for caches (DB is source of truth)

Cons:
- Concurrent writes may be lost
- Clocks must be roughly synchronized (NTP)

For caches, LWW is perfect because:
- Database is the source of truth
- Cache conflicts are rare
- Simple beats complex for caches`,

  whyItMatters: 'Without conflict resolution, regions diverge and serve different data indefinitely.',

  famousIncident: {
    title: 'Dynamo Shopping Cart Merge Bug',
    company: 'Amazon',
    year: '2007',
    whatHappened: 'Amazon Dynamo used vector clocks for conflict resolution. Implementation bugs caused shopping carts to accumulate deleted items. They eventually simplified to LWW for some use cases.',
    lessonLearned: 'Simple conflict resolution (LWW) often beats complex (vector clocks). Choose based on your requirements.',
    icon: '🛒',
  },

  realWorldExample: {
    company: 'Redis',
    scenario: 'Cross-region replication in Redis Enterprise',
    howTheyDoIt: 'Uses Last-Write-Wins with vector clocks for ordering. Conflicts resolved automatically without user intervention.',
  },

  keyPoints: [
    'LWW uses timestamps to resolve conflicts',
    'Write with latest timestamp wins',
    'Perfect for caches (DB is source of truth)',
    'Requires roughly synchronized clocks (NTP)',
    'Simple and deterministic',
  ],

  quickCheck: {
    question: 'Why is Last-Write-Wins acceptable for caches but not databases?',
    options: [
      'Caches are faster than databases',
      'Cache has DB as source of truth; lost writes can be refetched',
      'Databases cannot use timestamps',
      'Caches do not have conflicts',
    ],
    correctIndex: 1,
    explanation: 'For caches, if a write is lost due to LWW, it can be refetched from the database (source of truth). For databases, lost writes mean data loss.',
  },

  keyConcepts: [
    { title: 'Last-Write-Wins', explanation: 'Latest timestamp wins conflicts', icon: '⏰' },
    { title: 'Timestamp', explanation: 'Logical clock for ordering writes', icon: '🕐' },
    { title: 'Eventual Consistency', explanation: 'All regions converge to same state', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'multiregion-cache-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-2: Conflict-free cache replication',
    taskDescription: 'Implement Last-Write-Wins conflict resolution in Python',
    successCriteria: [
      'Cache entries include timestamps',
      'Replication handler compares timestamps',
      'Newer writes overwrite older ones',
      'Conflicts resolved automatically',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', to: 'monitoring' },
    ],
    requireCodeImplementation: true,
    requireMultipleRegions: true,
  },

  hints: {
    level1: 'In App Server Python code, add timestamp to cache writes',
    level2: 'On replication event: compare incoming timestamp with local. Update only if incoming is newer',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const multiregionCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'multiregion-cache',
  title: 'Design Multi-Region Cache',
  description: 'Build a globally distributed cache with cross-region replication, invalidation, and consistency',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🌍',
    hook: "You've been hired as Principal Engineer at GlobalScale Systems!",
    scenario: "Your mission: Build a multi-region cache that serves 300K reads/sec globally with <5ms latency.",
    challenge: "Can you design a cache system that stays consistent across continents?",
  },

  requirementsPhase: multiregionCacheRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'Cache-Aside Pattern',
    'Multi-Region Deployment',
    'Cross-Region Replication',
    'Asynchronous Messaging',
    'Cache Invalidation',
    'Eventual Consistency',
    'Last-Write-Wins',
    'Conflict Resolution',
    'Cache Monitoring',
    'Pub/Sub Pattern',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 7: Transactions (Consistency Models)',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default multiregionCacheGuidedTutorial;
