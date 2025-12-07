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
 * TinyURL L6 Guided Tutorial - ADVANCED EDITION
 *
 * Focus: Tail Latency (p99), Cascading Failures, Cache Stampede Prevention
 *
 * This is an ADVANCED tutorial that assumes students have completed
 * the basic TinyURL tutorial. It focuses on:
 * - Percentile-based latency (p50, p95, p99, p999)
 * - Cascading failure patterns and circuit breakers
 * - Cache stampede prevention (request coalescing, probabilistic early expiration)
 * - Advanced monitoring and observability
 *
 * Flow:
 * Step 0: Gather advanced NFRs (p99 latency, failure scenarios)
 * Steps 1-2: Build baseline system (review from basic tutorial)
 * Steps 3-10: Apply advanced NFRs and failure handling
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it FAST at the tail
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Advanced Interview
// =============================================================================

const tinyUrlL6RequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an advanced URL shortener with percentile-based latency guarantees and fault tolerance",

  interviewer: {
    name: 'Dr. Elena Rodriguez',
    role: 'Principal Engineer, Infrastructure',
    avatar: '👩‍🔬',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS (Quick review)
    // =============================================================================

    {
      id: 'core-operations',
      category: 'functional',
      question: "What are the core operations users expect from this URL shortener?",
      answer: "Users need two main operations:\n1. **Shorten URL**: POST a long URL, get back a short code\n2. **Redirect**: GET a short code, redirect to the original URL\n\nThese are the same core FRs as before, but now we're focusing on ADVANCED non-functional requirements around latency and reliability.",
      importance: 'critical',
      revealsRequirement: 'FR-1 and FR-2',
      learningPoint: "FRs stay the same - but NFRs get much more demanding at scale",
    },

    // =============================================================================
    // PART 2: ADVANCED SCALE & NFRs
    // =============================================================================

    // LATENCY - THE CRITICAL FOCUS
    {
      id: 'latency-percentiles',
      category: 'latency',
      question: "What are the specific latency requirements? Not just average - what about tail latency?",
      answer: "This is where it gets interesting:\n\n**Redirect Latency (GET):**\n- p50 < 10ms (median user)\n- p95 < 50ms (95% of users)\n- p99 < 100ms (99% of users)\n- p999 < 200ms (99.9% of users)\n\n**Why p99 matters:** If you have 1 million requests/hour and p99 is 500ms, that's 10,000 users experiencing bad latency every hour. Those users complain on Twitter!\n\n**Create URL Latency (POST):**\n- p99 < 500ms is acceptable (less sensitive)",
      importance: 'critical',
      calculation: {
        formula: "1M req/hour × 1% = 10K bad experiences/hour",
        result: "p99 matters more than average at scale!",
      },
      learningPoint: "Averages lie! One slow database query can ruin p99 for thousands of users.",
    },
    {
      id: 'latency-budget',
      category: 'latency',
      question: "How do you think about latency budgets across the stack?",
      answer: "Great question! For p99 < 100ms redirect:\n\n**Latency Budget Breakdown:**\n- Network (client → LB): 10ms\n- Load Balancer: 5ms\n- App Server processing: 10ms\n- Cache lookup: 2ms\n- DB query (on cache miss): 50ms\n- Network (response): 10ms\n\n**Total: 87ms** (13ms headroom for p99)\n\nBUT if cache misses, we're already at 87ms. At p99, we need cache hits or the DB will blow our budget!",
      importance: 'critical',
      insight: "Latency budgets force you to design for cache hits at the tail",
    },

    // THROUGHPUT
    {
      id: 'throughput-advanced',
      category: 'throughput',
      question: "What's the expected throughput, including burst scenarios?",
      answer: "**Steady State:**\n- 50,000 redirects/sec (reads)\n- 500 creates/sec (writes)\n- 100:1 read/write ratio\n\n**Burst Scenarios:**\n- 3x normal traffic during peak hours\n- 10x spikes when URLs go viral (Super Bowl ad, celebrity tweet)\n- Must handle without degradation",
      importance: 'critical',
      calculation: {
        formula: "50K RPS × 10x = 500K RPS peak",
        result: "Need auto-scaling and rate limiting",
      },
      learningPoint: "Design for 10x your baseline, not 2x",
    },

    // RELIABILITY - CASCADING FAILURES
    {
      id: 'cascading-failures',
      category: 'reliability',
      question: "What happens when the database goes down? Or the cache cluster fails?",
      answer: "This is CRITICAL. When one component fails, it can trigger a **cascading failure**:\n\n**Scenario: Cache cluster restarts**\n1. Suddenly 100% of requests hit the database (cache stampede)\n2. Database gets overwhelmed and slows down\n3. App servers wait for DB responses, threads pile up\n4. App servers run out of threads, start rejecting requests\n5. Load balancer sees failures, removes app servers\n6. TOTAL OUTAGE even though only cache failed!\n\n**Required:** System must gracefully degrade, not cascade.",
      importance: 'critical',
      insight: "Cascading failures are the #1 cause of major outages at scale",
    },
    {
      id: 'circuit-breaker',
      category: 'reliability',
      question: "How should we prevent cascading failures?",
      answer: "**Circuit Breaker Pattern** (DDIA Ch. 8):\n\nLike an electrical circuit breaker:\n1. **Closed** (normal): Requests flow through\n2. **Open** (failing): Fast-fail immediately, don't wait\n3. **Half-Open** (testing): Try a few requests to see if recovered\n\n**For TinyURL:**\n- If cache fails: Circuit breaker opens, serve degraded (database only)\n- If database fails: Circuit breaker opens, serve from cache only (no new URLs)\n- Don't let one failure take down the entire system",
      importance: 'critical',
      learningPoint: "Circuit breakers prevent one failure from cascading across the entire system",
    },

    // CACHE STAMPEDE
    {
      id: 'cache-stampede',
      category: 'reliability',
      question: "What happens when a very popular URL expires from cache at the same time 10,000 requests arrive?",
      answer: "This is called a **cache stampede** or **thundering herd**:\n\n**Without protection:**\n1. Popular URL expires from cache\n2. 10,000 concurrent requests all get cache MISS\n3. All 10,000 requests hit the database simultaneously\n4. Database gets overwhelmed, latency spikes to 5+ seconds\n5. Users see timeouts, system appears down\n\n**Required protections:**\n- Request coalescing (only ONE request goes to DB, others wait)\n- Probabilistic early expiration (refresh before TTL expires)\n- Stale-while-revalidate pattern",
      importance: 'critical',
      insight: "Cache stampedes can take down your database in milliseconds",
    },

    // MONITORING
    {
      id: 'observability',
      category: 'reliability',
      question: "How will you know if the system is healthy? What metrics matter?",
      answer: "**Key Metrics (RED method):**\n\n**Rate:**\n- Requests/sec (by endpoint, by status code)\n\n**Errors:**\n- Error rate (target: < 0.1% at p99)\n- Error types (timeout, 5xx, circuit breaker open)\n\n**Duration (Latency):**\n- p50, p95, p99, p999 latency\n- Latency by component (cache, DB, app server)\n\n**Plus:**\n- Cache hit rate (target: > 95%)\n- Circuit breaker state\n- Connection pool utilization\n- Database query time distribution",
      importance: 'critical',
      learningPoint: "You can't improve what you don't measure - p99 latency requires percentile metrics",
    },

    // AVAILABILITY
    {
      id: 'availability-sla',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.99% availability (four nines)\n\nThat means:\n- Maximum 52 minutes downtime per YEAR\n- Or 4.3 minutes per month\n- Or ~8 seconds per day\n\nTo achieve this:\n- No single points of failure\n- Graceful degradation when components fail\n- Automated failover (< 10 seconds)\n- Circuit breakers to isolate failures",
      importance: 'critical',
      calculation: {
        formula: "365 days × 24 hours × 0.01% = 52.56 minutes/year",
        result: "Four nines = 52 minutes downtime per year",
      },
      learningPoint: "Four nines is hard - requires redundancy at EVERY layer",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-operations', 'latency-percentiles', 'cascading-failures', 'cache-stampede'],
  criticalFRQuestionIds: ['core-operations'],
  criticalScaleQuestionIds: ['latency-percentiles', 'throughput-advanced', 'cascading-failures', 'cache-stampede', 'availability-sla'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Create short URLs',
      description: 'POST a long URL, receive a unique short code',
      emoji: '✂️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Redirect to original URL',
      description: 'GET a short code, redirect to the original URL with p99 < 100ms',
      emoji: '↪️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '500 million DAU',
    writesPerDay: '50 million',
    readsPerDay: '5 billion',
    peakMultiplier: 10,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 500, peak: 5000 },
    calculatedReadRPS: { average: 50000, peak: 500000 },
    maxPayloadSize: '~2KB',
    storagePerRecord: '~500 bytes',
    storageGrowthPerYear: '~9TB',
    redirectLatencySLA: 'p99 < 100ms, p999 < 200ms',
    createLatencySLA: 'p99 < 500ms',
  },

  architecturalImplications: [
    '✅ p99 < 100ms → Cache hit rate MUST be > 99% at tail',
    '✅ 500K RPS peak → Need auto-scaling and rate limiting',
    '✅ Cascading failures → Circuit breakers required for cache AND database',
    '✅ Cache stampede → Request coalescing + probabilistic expiration',
    '✅ 99.99% availability → No single points of failure anywhere',
    '✅ Observability → Percentile metrics (p50, p95, p99, p999) for everything',
  ],

  outOfScope: [
    'Custom short codes',
    'Click analytics',
    'Multi-region (geo-distributed)',
  ],

  keyInsight: "This is an ADVANCED design challenge. We're not just making it work - we're making it SURVIVE failures and deliver consistent p99 latency at massive scale. Every component needs redundancy, every interaction needs a circuit breaker, and every metric needs percentile tracking.",
};

// =============================================================================
// STEP 1: Baseline System Setup
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "You've been promoted to Principal Engineer at TinyURL after the basic system shipped.",
  hook: "The system works, but customers are complaining about 'occasional slowness' and 'random outages'. Your CEO says: 'Fix the tail latency and reliability issues or we lose our enterprise contracts!'",
  challenge: "Build the baseline system: Client → Load Balancer → App Servers → Database + Cache. This is your starting point.",
  illustration: 'advanced-system',
};

const step1Celebration: CelebrationContent = {
  emoji: '✅',
  message: "Baseline system deployed!",
  achievement: "You have the foundation - now let's make it bulletproof",
  metrics: [
    { label: 'Components', after: 'All connected' },
    { label: 'Basic functionality', after: '✓' },
  ],
  nextTeaser: "But how do we know if it's actually fast? Let's add monitoring...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Advanced System Design: Starting with a Solid Foundation',
  conceptExplanation: `Before we tackle advanced problems, we need a solid baseline.

**The baseline architecture:**
- **Load Balancer**: Distributes traffic across app servers
- **App Servers (multiple)**: Stateless, horizontally scalable
- **Cache (Redis)**: Cache-aside pattern for hot URLs
- **Database (PostgreSQL)**: Single-leader replication for durability

This is the same architecture from the basic tutorial. But now we'll layer on:
- Advanced monitoring (percentile metrics)
- Circuit breakers for failure isolation
- Cache stampede prevention
- Graceful degradation patterns`,

  whyItMatters: 'You can\'t optimize what you don\'t measure. We need the baseline system up first so we can add instrumentation and see the tail latency problems.',

  keyPoints: [
    'Start with proven architecture (LB → App → Cache → DB)',
    'Multiple app server instances for HA',
    'Database replication for durability',
    'Cache-aside pattern for read-heavy workload',
  ],

  diagram: `
┌──────────┐
│  Client  │
└────┬─────┘
     │
     ▼
┌────────────┐
│     LB     │
└────┬───────┘
     │
     ▼
┌────────────┐     ┌─────────┐     ┌──────────┐
│ App Server │────▶│  Cache  │     │ Database │
│ (Multiple) │     │ (Redis) │     │ (Replicated)│
└────────────┘     └─────────┘     └──────────┘
`,

  keyConcepts: [
    { title: 'Baseline', explanation: 'Proven architecture to build upon', icon: '🏗️' },
    { title: 'Stateless', explanation: 'App servers store no local state', icon: '🔄' },
  ],
};

const step1: GuidedStep = {
  id: 'tinyurl-l6-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Build baseline system with all core components',
    taskDescription: 'Deploy Client → LB → App Servers → Cache + Database with replication',
    componentsNeeded: [
      { type: 'client', reason: 'Users accessing the service', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Traffic distribution', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Processing logic (multiple instances)', displayName: 'App Server' },
      { type: 'cache', reason: 'Redis for hot URLs', displayName: 'Cache' },
      { type: 'database', reason: 'PostgreSQL with replication', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to servers' },
      { from: 'App Server', to: 'Cache', reason: 'Cache-aside pattern' },
      { from: 'App Server', to: 'Database', reason: 'Persistent storage' },
    ],
    successCriteria: [
      'Add all 5 components',
      'Connect Client → LB → App Server → Cache + Database',
      'Configure App Server for 2+ instances',
      'Enable Database replication',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Build the standard architecture: Client → LB → App Servers → Cache + Database',
    level2: 'Add all components, connect them, then configure App Server instances (2+) and Database replication',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
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
// STEP 2: Monitoring & Observability - See the Problem
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📊',
  scenario: "Your baseline system is running in production. Users are complaining about 'occasional slowness'.",
  hook: "Your dashboard shows average latency is 25ms - looks great! But users are still complaining. What's going on?",
  challenge: "The problem: averages hide tail latency! We need percentile metrics (p50, p95, p99, p999) to see what users actually experience.",
  illustration: 'monitoring',
};

const step2Celebration: CelebrationContent = {
  emoji: '👁️',
  message: "Now you can SEE the problem!",
  achievement: "Percentile metrics reveal the tail latency issues",
  metrics: [
    { label: 'p50 latency', after: '12ms ✓' },
    { label: 'p95 latency', after: '45ms ✓' },
    { label: 'p99 latency', after: '850ms ❌' },
    { label: 'p999 latency', after: '3200ms ❌❌❌' },
  ],
  nextTeaser: "Yikes! p99 is 850ms, way over our 100ms budget. The cache isn't working at the tail!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Percentile Metrics: Why Averages Lie',
  conceptExplanation: `**The Problem with Averages:**

Imagine 100 requests:
- 99 requests: 10ms each
- 1 request: 2000ms (slow DB query)

**Average:** (99 × 10ms + 1 × 2000ms) ÷ 100 = **29.9ms** ✓ Looks great!
**p99:** 2000ms ❌ Terrible!

That 1% of users (could be 50,000 requests/hour at scale) has a horrible experience, but your dashboard shows green!

**Percentile Metrics Explained:**
- **p50 (median)**: 50% of requests are faster than this
- **p95**: 95% of requests are faster than this
- **p99**: 99% of requests are faster than this (only 1% slower)
- **p999**: 99.9% of requests are faster than this

**For TinyURL at 50K RPS:**
- p99 = 500 requests/sec have worse latency
- p999 = 50 requests/sec have MUCH worse latency

At scale, even 0.1% is thousands of bad experiences per hour!`,

  whyItMatters: 'Large customers (enterprise) care about p99. Amazon found that 100ms extra latency costs 1% of sales. At the tail, those milliseconds matter.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Every 100ms of extra latency costs 1% of sales',
    howTheyDoIt: 'Amazon tracks p99.9 for all services. Their dashboards show percentile graphs, not averages. Jeff Bezos famously said: "p99.9 latency is what our most valuable customers experience."',
  },

  famousIncident: {
    title: 'GitHub\'s MySQL Tail Latency Crisis',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub\'s average MySQL query time was 5ms - looked great! But p99 was 500ms due to lock contention. This caused random slowness for users, especially during peak hours. They didn\'t see it because they only tracked averages.',
    lessonLearned: 'Always track percentiles (p95, p99, p999), not just averages. Tail latency is what users complain about.',
    icon: '🐙',
  },

  keyPoints: [
    'Averages hide outliers - p99 reveals them',
    'At scale, 1% = thousands of bad experiences',
    'p99 latency often 10-100x worse than p50',
    'Track p50, p95, p99, p999 for every critical path',
    'Use histograms, not averages, in your monitoring',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         LATENCY DISTRIBUTION EXAMPLE                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  100 requests:                                      │
│  ├─ 50 requests:   5ms   (p50 = 5ms)               │
│  ├─ 40 requests:  15ms   (p90 = 15ms)              │
│  ├─ 8 requests:   50ms   (p98 = 50ms)              │
│  ├─ 1 request:   200ms   (p99 = 200ms)             │
│  └─ 1 request:  2000ms   (p100 = 2000ms)           │
│                                                     │
│  Average: 24ms  ← Looks good!                      │
│  p99: 200ms     ← Reality for 1% of users          │
│                                                     │
│  At 50K RPS:                                        │
│  ├─ 500 req/sec experience p99 latency             │
│  └─ 1.8M bad experiences per hour!                 │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'p50 (Median)', explanation: 'Half of users see this or better', icon: '5️⃣' },
    { title: 'p99', explanation: '99% of users see this or better (tail)', icon: '9️⃣' },
    { title: 'p999', explanation: '99.9% of users see this or better (far tail)', icon: '🔟' },
    { title: 'Tail Latency', explanation: 'The slow outliers that users complain about', icon: '🐌' },
  ],

  quickCheck: {
    question: 'Your system has 25ms average latency and 400ms p99 latency at 100K RPS. How many requests per hour experience the p99 latency?',
    options: [
      '100 requests/hour',
      '1,000 requests/hour',
      '36,000 requests/hour',
      '3.6 million requests/hour',
    ],
    correctIndex: 3,
    explanation: '100K RPS × 3600 sec/hour × 1% = 3.6 million requests/hour experience p99 or worse latency. That\'s massive at scale!',
  },
};

const step2: GuidedStep = {
  id: 'tinyurl-l6-step-2',
  stepNumber: 2,
  frIndex: 1,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Add monitoring to track percentile metrics',
    taskDescription: 'Add a Monitoring component and configure percentile tracking',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Track p50, p95, p99, p999 latency', displayName: 'Monitoring (Prometheus/Grafana)' },
    ],
    connectionsNeeded: [
      { from: 'App Server', to: 'Monitoring', reason: 'Export metrics' },
    ],
    successCriteria: [
      'Add Monitoring component',
      'Connect App Server → Monitoring',
      'Monitoring now tracks percentile metrics',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Add a Monitoring component and connect App Server to it',
    level2: 'Monitoring systems like Prometheus track metrics exported from your app servers',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 3: Cache Stampede Prevention - Request Coalescing
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚡',
  scenario: "A celebrity just tweeted your shortened URL. 50,000 requests/sec hit the same short code!",
  hook: "The URL's cache entry expires. Suddenly ALL 50,000 requests get a cache MISS and hammer the database. Database latency spikes to 8 seconds. Users see timeouts!",
  challenge: "This is a cache stampede (thundering herd). We need REQUEST COALESCING - only ONE request hits the DB while others wait.",
  illustration: 'stampede',
};

const step3Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Cache stampede prevented!",
  achievement: "Request coalescing protects your database from thundering herds",
  metrics: [
    { label: 'DB queries on cache miss', before: '50,000 simultaneous', after: '1 (others wait)' },
    { label: 'p99 latency during stampede', before: '8000ms', after: '105ms' },
    { label: 'Database crashes', before: 'Frequent', after: 'Zero' },
  ],
  nextTeaser: "Much better! But what if the cache cluster itself crashes?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Stampede Prevention: Request Coalescing',
  conceptExplanation: `**The Cache Stampede Problem:**

1. Popular URL is cached with 1-hour TTL
2. Exactly at 3:00:00 PM, cache entry expires
3. At 3:00:01 PM, 50,000 concurrent requests arrive for that URL
4. ALL 50,000 requests get cache MISS
5. ALL 50,000 requests query the database
6. Database gets 50,000 queries in 1 second
7. Database overwhelmed, latency → 10+ seconds
8. Users see timeouts, system appears down

**Solution 1: Request Coalescing (Singleflight Pattern)**

When multiple requests ask for the same cache-missed key:
1. First request locks the key and queries the DB
2. Other requests WAIT for the first request to complete
3. First request finishes, updates cache, releases lock
4. All waiting requests get the cached result

**Result:** 50,000 requests → 1 database query

**Implementation (pseudo-code):**
\`\`\`python
# Singleflight / Request Coalescing
in_flight_requests = {}

def get_url(short_code):
    # Try cache first
    result = cache.get(short_code)
    if result:
        return result

    # Cache miss - check if someone else is already fetching
    if short_code in in_flight_requests:
        # Wait for the in-flight request to complete
        return in_flight_requests[short_code].wait()

    # We're the first - create a promise/future
    future = Future()
    in_flight_requests[short_code] = future

    try:
        # Query database (only THIS request does it)
        result = database.query(short_code)
        cache.set(short_code, result, ttl=3600)

        # Resolve the future for all waiting requests
        future.set_result(result)
        return result
    finally:
        # Clean up
        del in_flight_requests[short_code]
\`\`\`

**This is called "Singleflight" in Go, "Request Coalescing" in general.**`,

  whyItMatters: 'Without request coalescing, a single cache miss on a viral URL can take down your entire database. This is one of the most common causes of production outages.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Popular post\'s cache entry expires during viral traffic',
    howTheyDoIt: 'Facebook uses "lease-based caching" - a variant of request coalescing. When cache misses, they issue a "lease" token. Only the request with the valid lease can update the cache. Others wait or get stale data.',
  },

  famousIncident: {
    title: 'Cloudflare Cache Stampede (2019)',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'During a cache purge, millions of requests for the same resources hit origin servers simultaneously. Origins couldn\'t handle the load and went down. Websites using Cloudflare showed errors for hours.',
    lessonLearned: 'Always implement request coalescing for cache misses. Use probabilistic expiration to spread out cache refreshes. Never purge cache for viral content all at once.',
    icon: '☁️',
  },

  keyPoints: [
    'Cache stampede = thousands of cache misses hit DB simultaneously',
    'Request coalescing = only ONE request queries DB, others wait',
    'Also called "Singleflight pattern" (Go) or "Request deduplication"',
    'Prevents database overload during cache misses',
    'Critical for high-traffic systems',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         WITHOUT REQUEST COALESCING                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Cache Miss (popular URL):                         │
│  ┌────┐ ┌────┐ ┌────┐                              │
│  │Req1│ │Req2│ │...N│ (50K requests)               │
│  └─┬──┘ └─┬──┘ └─┬──┘                              │
│    │      │      │                                  │
│    ▼      ▼      ▼                                  │
│  ┌─────────────────┐                                │
│  │      Cache      │ ← All MISS                     │
│  └────────┬────────┘                                │
│           │ (all query DB)                          │
│           ▼                                          │
│  ┌─────────────────┐                                │
│  │    Database     │ ← 50K queries in 1 second!    │
│  │   OVERWHELMED   │ ← Crashes!                    │
│  └─────────────────┘                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│         WITH REQUEST COALESCING                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Cache Miss (popular URL):                         │
│  ┌────┐ ┌────┐ ┌────┐                              │
│  │Req1│ │Req2│ │...N│ (50K requests)               │
│  └─┬──┘ └──┬─┘ └──┬─┘                              │
│    │       │      │                                 │
│    ▼       ▼      ▼                                 │
│  ┌─────────────────┐                                │
│  │      Cache      │ ← All MISS                     │
│  └────────┬────────┘                                │
│           │                                          │
│    ┌──────┴──────┐                                  │
│    │ Coalescing  │ ← Only 1st request proceeds     │
│    │   Layer     │ ← Others WAIT                   │
│    └──────┬──────┘                                  │
│           │ (single query)                          │
│           ▼                                          │
│  ┌─────────────────┐                                │
│  │    Database     │ ← 1 query                     │
│  │     HEALTHY     │ ← Fast!                       │
│  └─────────────────┘                                │
│                                                     │
│  Result cached → All 50K requests served from cache │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Cache Stampede', explanation: 'Thousands of cache misses hit DB at once', icon: '🏃' },
    { title: 'Request Coalescing', explanation: 'Deduplicate concurrent requests for same key', icon: '🔗' },
    { title: 'Singleflight', explanation: 'Only one request in-flight per key at a time', icon: '✈️' },
  ],

  quickCheck: {
    question: 'Why does request coalescing prevent database overload?',
    options: [
      'It caches more data',
      'It makes the database faster',
      'It ensures only ONE request queries the DB for each cache miss',
      'It distributes load across multiple databases',
    ],
    correctIndex: 2,
    explanation: 'Request coalescing ensures that even if 10,000 requests have a cache miss for the same key, only ONE request actually queries the database. The other 9,999 wait and share the result.',
  },
};

const step3: GuidedStep = {
  id: 'tinyurl-l6-step-3',
  stepNumber: 3,
  frIndex: 2,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Implement cache stampede prevention',
    taskDescription: 'Configure request coalescing on the App Server',
    componentsNeeded: [
      { type: 'app_server', reason: 'Configure request coalescing logic', displayName: 'App Server' },
    ],
    successCriteria: [
      'Click on App Server',
      'Enable "Request Coalescing" in advanced settings',
      'This prevents cache stampedes',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Click on App Server and look for request coalescing settings',
    level2: 'Request coalescing (also called "singleflight") prevents multiple requests from hammering the DB for the same cache miss',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server', config: { requestCoalescing: true } },
      { type: 'cache' },
      { type: 'database' },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 4: Circuit Breakers - Preventing Cascading Failures
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. The database primary crashed. Failover is happening but takes 15 seconds.",
  hook: "During those 15 seconds, app servers keep sending queries to the dead database. Connections pile up, threads block, memory fills. Now the APP SERVERS are crashing too! The entire system is down even though only the DB failed!",
  challenge: "This is a cascading failure. We need CIRCUIT BREAKERS to isolate failures and prevent them from spreading.",
  illustration: 'cascading-failure',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔌',
  message: "Circuit breakers deployed!",
  achievement: "Failures are now isolated - no more cascading outages",
  metrics: [
    { label: 'DB failure impact', before: 'Total system outage', after: 'Graceful degradation' },
    { label: 'Recovery time', before: '30+ minutes', after: '< 1 minute' },
    { label: 'Availability during DB failover', before: '0%', after: '95% (degraded mode)' },
  ],
  nextTeaser: "Excellent! But can we make the cache layer itself more resilient?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Circuit Breakers: Preventing Cascading Failures',
  conceptExplanation: `**The Cascading Failure Problem:**

1. Database becomes slow (high latency) or crashes
2. App servers wait for database responses
3. App server threads pile up (waiting for DB)
4. App servers run out of threads/connections
5. App servers start rejecting new requests
6. Load balancer sees failures, removes app servers
7. Remaining app servers get overloaded
8. ENTIRE SYSTEM DOWN even though only DB failed!

**Solution: Circuit Breaker Pattern (DDIA Ch. 8)**

Like an electrical circuit breaker - it "trips" when it detects failure:

**Three States:**

**1. CLOSED (Normal):**
- Requests flow through normally
- Track failure rate and latency
- If failures exceed threshold (e.g., 50% errors) → OPEN

**2. OPEN (Failing):**
- Immediately reject requests (fail fast!)
- Don't wait for timeout - return error instantly
- After timeout period (e.g., 30 seconds) → HALF-OPEN

**3. HALF-OPEN (Testing):**
- Allow a few test requests through
- If they succeed → CLOSED (recovered!)
- If they fail → OPEN (still broken)

**For TinyURL:**

\`\`\`python
class CircuitBreaker:
    def __init__(self, failure_threshold=0.5, timeout=30):
        self.state = 'CLOSED'
        self.failures = 0
        self.successes = 0
        self.last_failure_time = None
        self.failure_threshold = failure_threshold
        self.timeout = timeout

    def call(self, func):
        if self.state == 'OPEN':
            # Check if timeout has passed
            if time.now() - self.last_failure_time > self.timeout:
                self.state = 'HALF-OPEN'
            else:
                # Fail fast!
                raise CircuitBreakerOpenError("Database unavailable")

        try:
            result = func()  # Try the operation
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise e

    def on_success(self):
        self.successes += 1
        if self.state == 'HALF-OPEN' and self.successes >= 3:
            # Recovered!
            self.state = 'CLOSED'
            self.failures = 0

    def on_failure(self):
        self.failures += 1
        self.last_failure_time = time.now()

        failure_rate = self.failures / (self.failures + self.successes)
        if failure_rate >= self.failure_threshold:
            self.state = 'OPEN'

# Usage
db_circuit_breaker = CircuitBreaker()

def get_url(short_code):
    # Try cache first
    if url := cache.get(short_code):
        return url

    # Cache miss - try database with circuit breaker
    try:
        url = db_circuit_breaker.call(lambda: database.query(short_code))
        cache.set(short_code, url)
        return url
    except CircuitBreakerOpenError:
        # Database unavailable - graceful degradation
        return None  # or return cached stale data
\`\`\``,

  whyItMatters: 'Without circuit breakers, one component failure cascades through the entire system. Circuit breakers provide isolation - failures stay contained.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Hystrix - their circuit breaker library',
    howTheyDoIt: 'Netflix open-sourced Hystrix after learning from cascading failures. Every service call is wrapped in a circuit breaker. If a dependency fails, Hystrix fails fast and serves from cache or degraded response. This is how Netflix stays up even when AWS components fail.',
  },

  famousIncident: {
    title: 'AWS DynamoDB Cascading Failure (2015)',
    company: 'AWS',
    year: '2015',
    whatHappened: 'DynamoDB in US-East had a partial outage. Services that depended on DynamoDB didn\'t have circuit breakers - they kept retrying, exhausting connection pools and threads. This caused those services to fail, which cascaded to their dependent services. A DynamoDB issue took down dozens of AWS services.',
    lessonLearned: 'Always use circuit breakers for external dependencies. Fail fast, don\'t retry indefinitely. Netflix\'s Hystrix pattern became industry standard after this.',
    icon: '⚡',
  },

  keyPoints: [
    'Circuit breaker has 3 states: CLOSED, OPEN, HALF-OPEN',
    'OPEN state = fail fast, don\'t wait for timeout',
    'Prevents thread/connection exhaustion',
    'Gives failing component time to recover',
    'Essential for high availability systems',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         CIRCUIT BREAKER STATE MACHINE               │
├─────────────────────────────────────────────────────┤
│                                                     │
│         ┌─────────────────────┐                     │
│         │      CLOSED         │                     │
│         │   (Normal state)    │                     │
│         │  Requests flow OK   │                     │
│         └──────────┬──────────┘                     │
│                    │                                 │
│         Failure rate > 50%                          │
│                    │                                 │
│                    ▼                                 │
│         ┌─────────────────────┐                     │
│    ┌───│       OPEN          │◀──┐                 │
│    │   │   (Tripped state)   │   │                 │
│    │   │   Fail fast! ⚡      │   │                 │
│    │   └─────────────────────┘   │                 │
│    │            │                 │                 │
│    │   Wait timeout (30s)        │                 │
│    │            │                 │                 │
│    │            ▼                 │                 │
│    │   ┌─────────────────────┐   │                 │
│    │   │    HALF-OPEN        │   │                 │
│    │   │  (Testing state)    │   │                 │
│    │   │  Allow test requests│   │                 │
│    │   └──────────┬──────────┘   │                 │
│    │              │               │                 │
│    │    ┌─────────┴─────────┐    │                 │
│    │    │                   │    │                 │
│    │  Success            Failure │                 │
│    │    │                   │    │                 │
│    └────┘                   └────┘                 │
│   (Back to CLOSED)      (Back to OPEN)             │
│                                                     │
└─────────────────────────────────────────────────────┘

WITH CIRCUIT BREAKERS:
┌─────────────┐
│ App Server  │
└──────┬──────┘
       │
       ▼
┌────────────────┐
│ Circuit Breaker│ ← If DB is failing, OPEN
└──────┬─────────┘
       │ ↓ Fail fast (don't wait)
       ▼
┌─────────────┐
│  Database   │ ← Failed component
└─────────────┘

Result: App stays healthy, serves from cache
`,

  keyConcepts: [
    { title: 'Circuit Breaker', explanation: 'Pattern that prevents cascading failures', icon: '🔌' },
    { title: 'Fail Fast', explanation: 'Return error immediately, don\'t wait for timeout', icon: '⚡' },
    { title: 'Graceful Degradation', explanation: 'Serve reduced functionality when dependencies fail', icon: '📉' },
    { title: 'Bulkhead', explanation: 'Isolate components so one failure doesn\'t sink the ship', icon: '🚢' },
  ],

  quickCheck: {
    question: 'Why does a circuit breaker "fail fast" when OPEN?',
    options: [
      'To save money on database queries',
      'To prevent thread/connection exhaustion in the caller',
      'To make the database recover faster',
      'To reduce network traffic',
    ],
    correctIndex: 1,
    explanation: 'When OPEN, the circuit breaker fails immediately instead of waiting for a timeout. This prevents threads from piling up waiting for a failing component, which would exhaust resources and cause cascading failures.',
  },
};

const step4: GuidedStep = {
  id: 'tinyurl-l6-step-4',
  stepNumber: 4,
  frIndex: 3,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Add circuit breakers to prevent cascading failures',
    taskDescription: 'Configure circuit breakers for database and cache connections',
    componentsNeeded: [
      { type: 'circuit_breaker', reason: 'Isolate failures from spreading', displayName: 'Circuit Breaker' },
    ],
    successCriteria: [
      'Add Circuit Breaker component',
      'Place between App Server and Database',
      'Configure failure threshold and timeout',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'monitoring', 'circuit_breaker'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'circuit_breaker' },
      { fromType: 'circuit_breaker', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Add a Circuit Breaker between App Server and Database',
    level2: 'Circuit breakers prevent cascading failures by failing fast when a dependency is down',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'circuit_breaker' },
      { type: 'database' },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'circuit_breaker' },
      { from: 'circuit_breaker', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 5: Probabilistic Cache Expiration - Smoothing Out Spikes
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🎲',
  scenario: "You deployed request coalescing. Cache stampedes are much better! But...",
  hook: "Every hour at :00 minutes, you see a latency spike. Why? Because ALL cache entries with 1-hour TTL expire at the same time! The first request after expiration is slow (DB query).",
  challenge: "We need PROBABILISTIC EARLY EXPIRATION - randomly refresh cache entries BEFORE they expire, spreading out the load.",
  illustration: 'probability',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Cache expiration is now smooth!",
  achievement: "No more synchronized expiration spikes",
  metrics: [
    { label: 'Hourly latency spikes', before: 'Every hour at :00', after: 'Eliminated' },
    { label: 'p99 latency', before: '180ms (spikey)', after: '85ms (smooth)' },
    { label: 'DB query distribution', before: 'Clustered', after: 'Evenly spread' },
  ],
  nextTeaser: "Great! Now let's handle cache cluster failures...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Probabilistic Early Expiration: Smoothing Cache Refreshes',
  conceptExplanation: `**The Synchronized Expiration Problem:**

1. At 3:00 PM, you cache 10,000 URLs with TTL = 3600s (1 hour)
2. At 4:00 PM, ALL 10,000 entries expire simultaneously
3. At 4:00:01 PM, first request for each URL triggers DB query
4. Database gets 10,000 queries in a few seconds
5. Latency spike at :00 minutes every hour!

**Solution: Probabilistic Early Expiration**

Instead of waiting for exact TTL expiration, randomly refresh BEFORE expiration:

\`\`\`python
import random
import time

def should_refresh_early(ttl_remaining, ttl_total):
    """
    Probabilistically decide if we should refresh early

    As TTL approaches expiration, probability increases
    When TTL_remaining is very small, probability approaches 1
    """
    # XFetch algorithm (from research paper)
    # https://cseweb.ucsd.edu/~avattani/papers/cache_stampede.pdf

    delta = 1.0  # seconds (refresh window)
    beta = 1.0   # spread factor

    # Probability = delta * beta * log(random) / ttl_remaining
    # This gives exponentially increasing probability as expiration approaches

    if ttl_remaining <= 0:
        return True  # Already expired

    # Random early expiration
    threshold = delta * beta * abs(random.gauss(0, 1)) / ttl_remaining

    return random.random() < threshold

def get_from_cache_with_early_refresh(key, ttl=3600):
    """
    Get from cache with probabilistic early expiration
    """
    # Try to get from cache
    cached = cache.get_with_ttl(key)

    if cached is None:
        # Cache miss - fetch from DB
        value = database.query(key)
        cache.set(key, value, ttl=ttl)
        return value

    value, ttl_remaining = cached

    # Probabilistically decide to refresh early
    if should_refresh_early(ttl_remaining, ttl):
        # Refresh in background (don't block)
        background_refresh(key, ttl)

    return value

def background_refresh(key, ttl):
    """
    Refresh cache in background without blocking
    """
    # Fetch from DB
    value = database.query(key)
    # Update cache with new TTL
    cache.set(key, value, ttl=ttl)
\`\`\`

**Result:**
- Cache entries refresh at RANDOM times before expiration
- No synchronized "thundering herd" at :00 minutes
- Smooth, distributed DB query load
- p99 latency stays low and consistent`,

  whyItMatters: 'Without probabilistic expiration, cache TTLs create synchronized load spikes every hour. At scale, these spikes can overwhelm your database and cause p99 latency to spike.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Timeline cache expiration',
    howTheyDoIt: 'Twitter uses probabilistic early expiration for timeline caches. Instead of all timelines expiring at the same time, they refresh randomly over a window. This keeps database load smooth and p99 latency low.',
  },

  famousIncident: {
    title: 'Facebook Memcached Thundering Herd',
    company: 'Facebook',
    year: '2013',
    whatHappened: 'Facebook\'s memcached clusters use lease-based caching. But they discovered that when cache entries for popular items expired, synchronized refreshes caused database hot spots. They implemented probabilistic early expiration and reduced p99 latency by 40%.',
    lessonLearned: 'TTL-based expiration creates synchronized load. Use probabilistic early expiration to spread refreshes over time.',
    icon: '📘',
  },

  keyPoints: [
    'Synchronized TTL expiration creates predictable load spikes',
    'Probabilistic early expiration spreads refreshes over time',
    'Probability increases as TTL approaches zero',
    'XFetch algorithm: exponentially increasing refresh probability',
    'Refresh in background to avoid blocking requests',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│    WITHOUT PROBABILISTIC EARLY EXPIRATION           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  DB Query Rate:                                     │
│  10K│           ▲                    ▲              │
│     │           │                    │              │
│   5K│           │                    │              │
│     │           │                    │              │
│    0├───────────┴────────────────────┴──────▶       │
│     3:00       4:00                5:00   Time      │
│                                                     │
│  Synchronized spikes every hour!                    │
│  p99 latency spikes to 500ms                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│    WITH PROBABILISTIC EARLY EXPIRATION              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  DB Query Rate:                                     │
│  2K│  ▃▅▄▃▅▆▄▃▅▄▃▅▆▅▃▄▅▃▄▅▆▄▃▅▄     │
│     │                                                │
│  1K│  ▂▃▂▃▄▃▂▃▂▃▄▃▂▃▄▃▂▃▂▃▄▃▂▃▄     │
│     │                                                │
│    0├────────────────────────────────────▶          │
│     3:00    3:30    4:00    4:30   Time            │
│                                                     │
│  Smooth, distributed refreshes                      │
│  p99 latency consistent at 85ms                     │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Probabilistic Expiration', explanation: 'Refresh cache randomly before TTL expires', icon: '🎲' },
    { title: 'XFetch Algorithm', explanation: 'Exponentially increasing refresh probability', icon: '📈' },
    { title: 'Background Refresh', explanation: 'Refresh cache without blocking requests', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why does probabilistic early expiration reduce p99 latency spikes?',
    options: [
      'It makes the cache faster',
      'It increases cache size',
      'It spreads cache refreshes over time instead of all at once',
      'It eliminates the need for a database',
    ],
    correctIndex: 2,
    explanation: 'Probabilistic early expiration randomly refreshes cache entries BEFORE they expire, spreading database queries over time. This prevents synchronized "thundering herd" at exact TTL expiration.',
  },
};

const step5: GuidedStep = {
  id: 'tinyurl-l6-step-5',
  stepNumber: 5,
  frIndex: 4,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Implement probabilistic cache expiration',
    taskDescription: 'Configure the Cache to use probabilistic early expiration',
    successCriteria: [
      'Click on Cache component',
      'Enable "Probabilistic Early Expiration"',
      'This smooths out cache refresh spikes',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'monitoring', 'circuit_breaker'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'circuit_breaker' },
      { fromType: 'circuit_breaker', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Configure the Cache to use probabilistic early expiration',
    level2: 'This prevents all cache entries from expiring at the same time, smoothing out load',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache', config: { probabilisticExpiration: true } },
      { type: 'circuit_breaker' },
      { type: 'database' },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'circuit_breaker' },
      { from: 'circuit_breaker', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 6: Cache Cluster High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "2 AM. The entire Redis cache cluster just crashed during a rolling restart.",
  hook: "Suddenly 100% of reads hit the database. Database is overwhelmed. Circuit breaker opens. System is effectively DOWN even though the database is healthy!",
  challenge: "Single cache cluster = single point of failure. We need CACHE REPLICATION and FAILOVER.",
  illustration: 'cache-down',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Cache is now highly available!",
  achievement: "Cache failures no longer take down the system",
  metrics: [
    { label: 'Cache availability', before: '99%', after: '99.99%' },
    { label: 'Failover time', before: 'Manual (hours)', after: 'Automatic (seconds)' },
    { label: 'System availability during cache failure', before: '0%', after: '99% (degraded)' },
  ],
  nextTeaser: "Excellent! But what about read replicas for the database?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cache High Availability: Redis Sentinel & Cluster',
  conceptExplanation: `**The Single Cache Problem:**

If your cache is a single Redis instance:
- When it crashes → 100% cache miss
- When you restart it → 100% cache miss (cold cache)
- When you upgrade it → 100% cache miss

With 50K reads/sec, that's 50K database queries/sec! Database can't handle it.

**Solution: Redis High Availability**

**Option 1: Redis Sentinel (Master-Slave)**
- One primary, multiple replicas
- Sentinel monitors primary health
- On failure, auto-promotes replica to primary
- Clients automatically connect to new primary
- Good for: moderate scale, simple setup

**Option 2: Redis Cluster (Sharded)**
- Data partitioned across multiple masters
- Each master has replicas
- Can handle millions of ops/sec
- Good for: large scale, high throughput

**For TinyURL, use Redis Cluster:**

\`\`\`
Redis Cluster (3 masters, 3 replicas):

Master 1 (slots 0-5460)     → Replica 1
  ├─ short codes: a-j

Master 2 (slots 5461-10922) → Replica 2
  ├─ short codes: k-r

Master 3 (slots 10923-16383)→ Replica 3
  ├─ short codes: s-z

If Master 1 fails:
1. Cluster detects failure (< 1 second)
2. Promotes Replica 1 to Master
3. Cluster continues serving traffic
4. Downtime: < 5 seconds
\`\`\`

**Graceful Degradation:**

Even with cache HA, we need a fallback plan:

\`\`\`python
def get_url(short_code):
    try:
        # Try primary cache cluster
        if url := cache_primary.get(short_code):
            return url
    except CacheConnectionError:
        # Primary cache down - try secondary
        try:
            if url := cache_secondary.get(short_code):
                return url
        except CacheConnectionError:
            # Both caches down - fall back to DB
            pass

    # Cache miss or cache down - query DB with circuit breaker
    try:
        url = db_circuit_breaker.call(lambda: database.query(short_code))

        # Try to update cache (best effort)
        try:
            cache_primary.set(short_code, url, ttl=3600)
        except:
            pass  # Cache update failed, but we still served the request

        return url
    except CircuitBreakerOpenError:
        # DB is down too - serve stale from backup cache if available
        return serve_stale_or_error(short_code)
\`\`\``,

  whyItMatters: 'Without cache HA, cache failures cause total outages. With HA + circuit breakers + graceful degradation, you can survive any single component failure.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Timeline cache failures',
    howTheyDoIt: 'Twitter uses multi-layer caching: Redis Cluster (primary), backup Redis, and stale-while-revalidate. If Redis Cluster fails, they serve from backup. If both fail, they serve stale timelines rather than going down. Availability > perfect freshness.',
  },

  famousIncident: {
    title: 'GitHub Redis Cluster Outage',
    company: 'GitHub',
    year: '2020',
    whatHappened: 'GitHub\'s Redis cluster had a split-brain scenario during network partition. Two nodes both thought they were primary. This caused data inconsistency. GitHub was down for 2+ hours while they manually recovered.',
    lessonLearned: 'Use proper quorum-based failover (Redis Sentinel/Cluster). Test failover regularly. Have runbooks for split-brain scenarios. Consider using managed Redis (AWS ElastiCache, GCP Memorystore) to avoid operational complexity.',
    icon: '🐙',
  },

  keyPoints: [
    'Single cache = single point of failure',
    'Redis Sentinel for simple master-replica failover',
    'Redis Cluster for sharded, high-throughput caching',
    'Always have graceful degradation plan (stale > down)',
    'Multi-layer caching: primary → backup → stale → error',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         REDIS CLUSTER HIGH AVAILABILITY             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐                                   │
│  │ App Server 1 │                                   │
│  └───────┬──────┘                                   │
│          │                                           │
│          ▼                                           │
│  ┌─────────────────────────────────────────┐        │
│  │      Redis Cluster (Shared)             │        │
│  │                                         │        │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │  │Master 1 │    │Master 2 │    │Master 3 │      │
│  │  │slots 0- │    │slots    │    │slots    │      │
│  │  │  5460   │    │5461-    │    │10923-   │      │
│  │  └────┬────┘    │10922    │    │16383    │      │
│  │       │         └────┬────┘    └────┬────┘      │
│  │       │              │              │            │
│  │       ▼              ▼              ▼            │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │  │Replica 1│    │Replica 2│    │Replica 3│      │
│  │  └─────────┘    └─────────┘    └─────────┘      │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  If Master 1 fails:                                 │
│  1. Cluster detects (1s)                           │
│  2. Promotes Replica 1 → Master                    │
│  3. Traffic continues                              │
│  4. Downtime: < 5 seconds                          │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Redis Sentinel', explanation: 'Auto-failover for master-replica Redis', icon: '👁️' },
    { title: 'Redis Cluster', explanation: 'Sharded, distributed Redis for scale', icon: '🔷' },
    { title: 'Graceful Degradation', explanation: 'Serve stale/degraded rather than failing', icon: '📉' },
  ],

  quickCheck: {
    question: 'What happens when a Redis Cluster master fails?',
    options: [
      'All data is lost',
      'The entire cluster goes down',
      'The cluster automatically promotes a replica to master',
      'Manual intervention is required',
    ],
    correctIndex: 2,
    explanation: 'Redis Cluster automatically detects master failures and promotes a replica to master. Downtime is typically < 5 seconds. This is why cache HA is critical.',
  },
};

const step6: GuidedStep = {
  id: 'tinyurl-l6-step-6',
  stepNumber: 6,
  frIndex: 5,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Make cache highly available',
    taskDescription: 'Configure Redis Cluster with replication',
    successCriteria: [
      'Click on Cache component',
      'Enable clustering and replication',
      'Configure 3+ nodes with replicas',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'monitoring', 'circuit_breaker'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'circuit_breaker' },
      { fromType: 'circuit_breaker', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Configure Cache for clustering and replication',
    level2: 'Redis Cluster with multiple nodes and replicas provides high availability',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache', config: { clustering: true, replicas: 3 } },
      { type: 'circuit_breaker' },
      { type: 'database' },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'circuit_breaker' },
      { from: 'circuit_breaker', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 7: Database Read Replicas - Scaling Reads
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📚',
  scenario: "Your p99 latency is looking good! But now marketing wants to add analytics.",
  hook: "They want to run queries like 'how many URLs created per day?' and 'most popular domains'. These analytical queries are SLOW (5+ seconds) and they're blocking regular redirect queries!",
  challenge: "We need READ REPLICAS - separate databases for analytical queries so they don't impact production traffic.",
  illustration: 'read-replicas',
};

const step7Celebration: CelebrationContent = {
  emoji: '📊',
  message: "Read replicas deployed!",
  achievement: "Analytics queries no longer impact production latency",
  metrics: [
    { label: 'Production p99 latency', before: '180ms (during analytics)', after: '85ms (stable)' },
    { label: 'Analytics query impact', before: 'Blocks production', after: 'Isolated' },
    { label: 'Read capacity', before: 'Limited to primary', after: '3x with replicas' },
  ],
  nextTeaser: "Great! Now let's add rate limiting for protection...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Read Replicas: Scaling Read Traffic',
  conceptExplanation: `**The Problem:**

Your database primary handles:
- ALL writes (creating short URLs)
- ALL reads (redirects, analytics, reporting)

Analytical queries (e.g., "Top 100 most-clicked URLs") can take 5+ seconds. During this query:
- Primary database is busy
- Regular redirect queries slow down
- p99 latency spikes to 200ms+

**Solution: Read Replicas**

Create separate database instances that replicate data from primary:

\`\`\`
Primary (writes only)
  ├─ Create short URLs
  ├─ Replicates to →

Read Replica 1 (reads only)
  ├─ Redirects (production traffic)

Read Replica 2 (reads only)
  ├─ Analytics queries (slow queries OK)

Read Replica 3 (reads only)
  ├─ Reporting, dashboards
\`\`\`

**Routing Strategy:**

\`\`\`python
def create_short_url(long_url):
    # Writes ALWAYS go to primary
    return db_primary.insert(long_url)

def get_url_for_redirect(short_code):
    # Production reads go to dedicated replica
    return db_replica_production.query(short_code)

def run_analytics_query(query):
    # Analytics go to separate replica
    return db_replica_analytics.query(query)
\`\`\`

**Replication Lag:**

Data replicates asynchronously (primary → replicas):
- Typical lag: 10-100ms
- During high write load: up to 1-5 seconds

For TinyURL:
- Redirects: OK to be slightly stale (1 second old is fine)
- Analytics: OK to be stale (5 minutes old is fine)
- Creating URLs: MUST read from primary (read-after-write)

**Connection Pooling:**

Each app server maintains connection pools:
\`\`\`
┌─────────────┐
│ App Server  │
└──────┬──────┘
       │
       ├─→ Primary Pool (10 connections) → Primary DB
       ├─→ Replica 1 Pool (50 connections) → Replica 1
       ├─→ Replica 2 Pool (20 connections) → Replica 2
       └─→ Replica 3 Pool (10 connections) → Replica 3
\`\`\``,

  whyItMatters: 'Without read replicas, analytical queries compete with production traffic for database resources. This causes unpredictable p99 latency spikes.',

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Handling dashboard queries',
    howTheyDoIt: 'GitHub uses dozens of read replicas. Production traffic goes to dedicated replicas. Admin dashboards and reporting use separate replicas. This isolates slow queries from impacting user-facing features.',
  },

  famousIncident: {
    title: 'Instagram Read Replica Lag',
    company: 'Instagram',
    year: '2011',
    whatHappened: 'Instagram\'s read replicas had 30+ second replication lag during high traffic. Users would post a photo, then immediately see "photo not found" because the replica didn\'t have it yet. This caused massive user confusion.',
    lessonLearned: 'Monitor replication lag! For read-after-write consistency, either read from primary or wait for replication. Instagram now uses a hybrid: redirect to primary for N seconds after write, then use replicas.',
    icon: '📸',
  },

  keyPoints: [
    'Read replicas scale read traffic horizontally',
    'Writes always go to primary',
    'Route different read types to different replicas',
    'Monitor replication lag (should be < 1 second)',
    'For read-after-write, query primary or wait for replication',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         DATABASE READ REPLICAS                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐                                   │
│  │ App Servers  │                                   │
│  └──────┬───────┘                                   │
│         │                                           │
│    ┌────┼────┬────────┬────────┐                   │
│    │    │    │        │        │                   │
│  writes│  reads   reads   reads                    │
│    │    │    │        │        │                   │
│    ▼    │    │        │        │                   │
│  ┌─────────┐ │        │        │                   │
│  │ Primary │─┴────────┴────────┴─┐ (replication)   │
│  │ (Write) │                     │                 │
│  └─────────┘                     │                 │
│                                  ▼                  │
│         ┌─────────────┬──────────────┬──────────┐  │
│         │             │              │          │  │
│         ▼             ▼              ▼          ▼  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───┐ │
│   │Replica 1 │  │Replica 2 │  │Replica 3 │  │...│ │
│   │Production│  │Analytics │  │Dashboard │  └───┘ │
│   │ Reads    │  │(slow OK) │  │(stale OK)│        │
│   └──────────┘  └──────────┘  └──────────┘        │
│                                                     │
│  Lag: ~50ms    Lag: ~1s      Lag: ~5s              │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Read Replica', explanation: 'Copy of database that handles read queries', icon: '📚' },
    { title: 'Replication Lag', explanation: 'Time delay between primary and replica', icon: '⏱️' },
    { title: 'Query Routing', explanation: 'Send different queries to different replicas', icon: '🚦' },
  ],

  quickCheck: {
    question: 'Why do analytical queries go to a separate read replica?',
    options: [
      'They need more storage',
      'To isolate slow queries from impacting production traffic',
      'They require different database software',
      'To save money',
    ],
    correctIndex: 1,
    explanation: 'Slow analytical queries can lock tables and consume resources. By routing them to a separate replica, they can\'t impact production redirect queries. This keeps p99 latency stable.',
  },
};

const step7: GuidedStep = {
  id: 'tinyurl-l6-step-7',
  stepNumber: 7,
  frIndex: 6,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Add read replicas for scaling read traffic',
    taskDescription: 'Configure database with multiple read replicas',
    successCriteria: [
      'Click on Database component',
      'Configure 3+ read replicas',
      'Different replicas for different read workloads',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'monitoring', 'circuit_breaker'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'circuit_breaker' },
      { fromType: 'circuit_breaker', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Configure Database with multiple read replicas',
    level2: 'Read replicas scale read traffic and isolate analytical queries from production',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'circuit_breaker' },
      { type: 'database', config: { readReplicas: 3 } },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'circuit_breaker' },
      { from: 'circuit_breaker', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 8: Rate Limiting - Protection from Abuse
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚨',
  scenario: "4 AM. Your monitoring alerts are going crazy. Someone is hitting your API with 1 MILLION requests/second!",
  hook: "It's a DDoS attack or a misconfigured bot. Your auto-scaling is spinning up hundreds of servers. Your AWS bill is going to be $100,000 this month!",
  challenge: "We need RATE LIMITING to protect against abuse and runaway traffic.",
  illustration: 'ddos',
};

const step8Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Rate limiting deployed!",
  achievement: "System protected from abuse and runaway traffic",
  metrics: [
    { label: 'DDoS protection', after: 'Active' },
    { label: 'Rate limit', after: '1000 req/min per IP' },
    { label: 'Cost control', before: 'Uncontrolled', after: 'Protected' },
  ],
  nextTeaser: "Perfect! Now for the final test - can we handle everything?",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting: Protection from Abuse',
  conceptExplanation: `**The Problem:**

Without rate limiting, attackers or misconfigured clients can:
- Overwhelm your system (DDoS)
- Drive up your cloud costs (auto-scaling abuse)
- Starve legitimate users of resources

**Rate Limiting Strategies:**

**1. Per-IP Rate Limiting**
\`\`\`
Limit: 1000 requests/minute per IP
- Blocks DDoS from single source
- Won't stop distributed DDoS
\`\`\`

**2. Per-User Rate Limiting**
\`\`\`
Limit: 10,000 requests/hour per API key
- Prevents abuse from legitimate users
- Requires authentication
\`\`\`

**3. Global Rate Limiting**
\`\`\`
Limit: 100K total requests/second
- Prevents total system overload
- Protects infrastructure capacity
\`\`\`

**4. Adaptive Rate Limiting**
\`\`\`
Adjust limits based on system health:
- If p99 > 200ms → reduce limits
- If error rate > 5% → reduce limits
- If CPU > 80% → reduce limits
\`\`\`

**Implementation (Token Bucket Algorithm):**

\`\`\`python
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, requests_per_minute=1000):
        self.capacity = requests_per_minute
        self.tokens = defaultdict(lambda: self.capacity)
        self.last_refill = defaultdict(lambda: time.time())

    def allow_request(self, client_id):
        now = time.time()

        # Refill tokens based on time passed
        time_passed = now - self.last_refill[client_id]
        refill = int(time_passed * self.capacity / 60)  # per minute

        self.tokens[client_id] = min(
            self.capacity,
            self.tokens[client_id] + refill
        )
        self.last_refill[client_id] = now

        # Check if client has tokens
        if self.tokens[client_id] >= 1:
            self.tokens[client_id] -= 1
            return True  # Allow
        else:
            return False  # Rate limited!

# Usage
rate_limiter = RateLimiter(requests_per_minute=1000)

@app.route('/api/v1/urls', methods=['POST'])
def create_short_url():
    client_ip = request.remote_addr

    if not rate_limiter.allow_request(client_ip):
        return jsonify({
            'error': 'Rate limit exceeded',
            'retry_after': 60
        }), 429  # HTTP 429 Too Many Requests

    # Process request normally
    ...
\`\`\`

**Where to Apply:**

1. **Load Balancer** (AWS ALB, nginx): Fast, network-level
2. **API Gateway** (AWS API Gateway, Kong): Centralized
3. **Application** (in code): Most flexible, most CPU overhead

For TinyURL: Use Load Balancer + Application hybrid`,

  whyItMatters: 'Without rate limiting, a single bad actor can take down your entire service or cause massive cost overruns. It\'s essential for production systems.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Protecting against DDoS attacks',
    howTheyDoIt: 'Cloudflare handles 46+ million requests/second. They use multi-layer rate limiting: edge PoPs (geographic), per-IP, per-domain, and adaptive limits. When under attack, they automatically tighten limits based on attack patterns.',
  },

  famousIncident: {
    title: 'GitHub DDoS Attack (1.35 Tbps)',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub was hit with the largest DDoS attack ever recorded - 1.35 Terabits per second using memcached amplification. Without proper rate limiting and DDoS protection, this would have taken GitHub offline for days. They used Akamai\'s DDoS protection to mitigate it in 10 minutes.',
    lessonLearned: 'Always have rate limiting AND DDoS protection. Use a CDN/DDoS protection service (Cloudflare, Akamai) for large attacks. Rate limiting at the application level isn\'t enough.',
    icon: '⚔️',
  },

  keyPoints: [
    'Rate limiting prevents abuse and cost overruns',
    'Token bucket algorithm is most common',
    'Apply at multiple layers (LB, API Gateway, app)',
    'Return HTTP 429 with Retry-After header',
    'Consider adaptive rate limiting based on system health',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         RATE LIMITING LAYERS                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐                                   │
│  │   Client     │                                   │
│  └──────┬───────┘                                   │
│         │ 10,000 req/sec                            │
│         ▼                                           │
│  ┌─────────────────────┐                            │
│  │  Load Balancer      │ ← Layer 1: Per-IP         │
│  │  Rate Limit:        │   1000 req/min per IP     │
│  │  1000 req/min/IP    │                            │
│  └──────┬──────────────┘                            │
│         │ Allowed: 1000 req/min                     │
│         ▼                                           │
│  ┌─────────────────────┐                            │
│  │   App Server        │ ← Layer 2: Per-User       │
│  │   Rate Limit:       │   10K req/hour per key    │
│  │   10K req/hour/key  │                            │
│  └──────┬──────────────┘                            │
│         │ Allowed: matches quota                    │
│         ▼                                           │
│  ┌─────────────────────┐                            │
│  │   Database          │ ← Layer 3: Global         │
│  │   (Protected)       │   Max 100K total RPS      │
│  └─────────────────────┘                            │
│                                                     │
│  Blocked: 9,000 req/sec (90% reduction)             │
│  Allowed: 1,000 req/sec (within limits)             │
└─────────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Rate limiting algorithm that refills over time', icon: '🪣' },
    { title: 'HTTP 429', explanation: 'Too Many Requests - standard rate limit response', icon: '🚫' },
    { title: 'Adaptive Limits', explanation: 'Adjust limits based on system health', icon: '🎚️' },
  ],

  quickCheck: {
    question: 'Why apply rate limiting at multiple layers (LB, app, DB)?',
    options: [
      'It makes the system slower',
      'Each layer protects different resources and provides defense in depth',
      'It\'s required by regulations',
      'To increase complexity',
    ],
    correctIndex: 1,
    explanation: 'Multi-layer rate limiting provides defense in depth. LB protects against network-level DDoS, app layer protects business logic, and global limits protect infrastructure capacity.',
  },
};

const step8: GuidedStep = {
  id: 'tinyurl-l6-step-8',
  stepNumber: 8,
  frIndex: 7,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Add rate limiting for protection',
    taskDescription: 'Add Rate Limiter component and configure limits',
    componentsNeeded: [
      { type: 'rate_limiter', reason: 'Protect against abuse', displayName: 'Rate Limiter' },
    ],
    connectionsNeeded: [
      { from: 'Load Balancer', to: 'Rate Limiter', reason: 'Filter traffic before app servers' },
      { from: 'Rate Limiter', to: 'App Server', reason: 'Pass allowed requests' },
    ],
    successCriteria: [
      'Add Rate Limiter between LB and App Server',
      'Configure per-IP and per-user limits',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'rate_limiter', 'app_server', 'cache', 'database', 'monitoring', 'circuit_breaker'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'rate_limiter' },
      { fromType: 'rate_limiter', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'circuit_breaker' },
      { fromType: 'circuit_breaker', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add Rate Limiter between Load Balancer and App Server',
    level2: 'Rate limiting protects your system from abuse and cost overruns',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'rate_limiter' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'circuit_breaker' },
      { type: 'database' },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'rate_limiter' },
      { from: 'rate_limiter', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'circuit_breaker' },
      { from: 'circuit_breaker', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 9: Final Exam - Production Readiness Test
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🎯',
  scenario: "Your advanced TinyURL system is complete! Now it's time for the ultimate test.",
  hook: "We're going to simulate REAL production scenarios: cache failures, database failovers, traffic spikes, and DDoS attacks. Can your system handle it all?",
  challenge: "Pass all 8 advanced test cases to prove your system is production-ready.",
  illustration: 'final-exam',
};

const step9Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "CONGRATULATIONS! You built a production-grade system!",
  achievement: "All 8 advanced test cases passed",
  metrics: [
    { label: 'p99 latency', after: '< 100ms ✓' },
    { label: 'Availability', after: '99.99% ✓' },
    { label: 'Cache stampede protection', after: 'Active ✓' },
    { label: 'Cascading failure prevention', after: 'Active ✓' },
    { label: 'Rate limiting', after: 'Active ✓' },
  ],
  nextTeaser: "You've mastered advanced system design! Try building another system or tackle the multi-region challenge.",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Production Readiness: The Complete Checklist',
  conceptExplanation: `You've implemented all the advanced patterns. Here's what makes a system production-ready:

**Performance:**
- ✅ p99 latency < 100ms (not just average!)
- ✅ Percentile metrics (p50, p95, p99, p999) tracked
- ✅ Cache hit rate > 95%
- ✅ Request coalescing prevents cache stampedes

**Reliability:**
- ✅ Circuit breakers on all external dependencies
- ✅ Graceful degradation (stale > error > down)
- ✅ No single points of failure
- ✅ Automated failover (< 10 seconds)

**Scalability:**
- ✅ Horizontal scaling for stateless components
- ✅ Database read replicas for read scaling
- ✅ Cache clustering for high availability
- ✅ Rate limiting prevents abuse

**Observability:**
- ✅ Metrics (RED: Rate, Errors, Duration)
- ✅ Logs (structured, searchable)
- ✅ Traces (distributed tracing)
- ✅ Alerts (actionable, not noisy)

**Your Advanced System:**
\`\`\`
Client
  ↓
Load Balancer
  ↓
Rate Limiter (1000 req/min per IP)
  ↓
App Servers (multiple, stateless)
  ├→ Cache (Redis Cluster, 3+ nodes)
  │   ├─ Request coalescing
  │   └─ Probabilistic expiration
  ├→ Circuit Breaker
  │   └→ Database (primary + read replicas)
  │       └─ Automated failover
  └→ Monitoring (Prometheus/Grafana)
      └─ Percentile metrics
\`\`\``,

  whyItMatters: 'Production systems fail in unexpected ways. The patterns you implemented - circuit breakers, cache stampede prevention, graceful degradation - are what separate toy projects from real systems that handle millions of users.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Chaos Engineering at Scale',
    howTheyDoIt: 'Netflix randomly kills servers, regions, and services in production (Chaos Monkey, Chaos Kong). Their system stays up because they implement all these patterns. They proved that a well-designed system can survive component failures without user impact.',
  },

  keyPoints: [
    'Production readiness = performance + reliability + scalability + observability',
    'Test failure scenarios before they happen in production',
    'Circuit breakers and graceful degradation are non-negotiable',
    'p99 latency matters more than average at scale',
    'Rate limiting protects both your system and your wallet',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│     PRODUCTION-READY TINYURL ARCHITECTURE           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐                                       │
│  │  Client  │                                       │
│  └────┬─────┘                                       │
│       │ 500K RPS peak                               │
│       ▼                                             │
│  ┌─────────────┐                                    │
│  │     LB      │ ← HA, health checks                │
│  └──────┬──────┘                                    │
│         │                                           │
│         ▼                                           │
│  ┌─────────────────┐                                │
│  │ Rate Limiter    │ ← 1K/min per IP               │
│  └──────┬──────────┘                                │
│         │                                           │
│         ▼                                           │
│  ┌─────────────────┐                                │
│  │  App Servers    │ ← Multiple instances          │
│  │  (Stateless)    │   Request coalescing          │
│  └────┬────────────┘                                │
│       │                                             │
│   ┌───┼─────┬─────────┬────────┐                   │
│   │   │     │         │        │                   │
│   ▼   ▼     ▼         ▼        ▼                   │
│ ┌────┐ ┌────────┐ ┌─────┐ ┌────────┐               │
│ │Mon.│ │Redis   │ │C.B. │ │DB Read │               │
│ │    │ │Cluster │ │     │ │Replicas│               │
│ └────┘ │(3 nodes)│ └──┬──┘ └────────┘               │
│        │Prob.Exp │    │                             │
│        └────────┘    ▼                              │
│                  ┌────────┐                         │
│                  │DB Primary│                       │
│                  │(Replicated)│                     │
│                  └────────┘                         │
│                                                     │
│  Protection: ✓ Cache stampede                      │
│              ✓ Cascading failures                   │
│              ✓ Rate limiting                        │
│              ✓ Graceful degradation                 │
│              ✓ p99 < 100ms                          │
└─────────────────────────────────────────────────────┘`,
};

const step9: GuidedStep = {
  id: 'tinyurl-l6-step-9',
  stepNumber: 9,
  frIndex: 8,
  story: step9Story,
  celebration: step9Celebration,
  learnPhase: step9LearnPhase,
  practicePhase: {
    frText: 'Pass all 8 production test cases',
    taskDescription: 'Run the final exam to validate your complete system',
    successCriteria: [
      'Test 1: p99 latency under load',
      'Test 2: Cache stampede handling',
      'Test 3: Database failover',
      'Test 4: Cache cluster failure',
      'Test 5: DDoS attack mitigation',
      'Test 6: Cascading failure prevention',
      'Test 7: Read replica isolation',
      'Test 8: Combined failure scenario',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'rate_limiter', 'app_server', 'cache', 'database', 'monitoring', 'circuit_breaker'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'rate_limiter' },
      { fromType: 'rate_limiter', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'circuit_breaker' },
      { fromType: 'circuit_breaker', toType: 'database' },
      { fromType: 'app_server', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: false, // Advanced tutorial focuses on performance, not cost
  },
  hints: {
    level1: 'Ensure all advanced features are configured correctly',
    level2: 'Review: request coalescing, circuit breakers, probabilistic expiration, rate limiting',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'rate_limiter' },
      { type: 'app_server', config: { instances: 3, requestCoalescing: true } },
      { type: 'cache', config: { clustering: true, replicas: 3, probabilisticExpiration: true } },
      { type: 'circuit_breaker' },
      { type: 'database', config: { replication: true, readReplicas: 3 } },
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'rate_limiter' },
      { from: 'rate_limiter', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'circuit_breaker' },
      { from: 'circuit_breaker', to: 'database' },
      { from: 'app_server', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const tinyUrlL6GuidedTutorial: GuidedTutorial = {
  problemId: 'tiny-url-l6-guided',
  problemTitle: 'Build TinyURL L6 - Advanced: Tail Latency & Fault Tolerance',

  requirementsPhase: tinyUrlL6RequirementsPhase,

  totalSteps: 9,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9],

  // Advanced test cases focusing on tail latency and fault tolerance
  finalExamTestCases: [
    {
      name: 'ADV-P1: p99 Latency Under Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Maintain p99 < 100ms at 50K RPS with 95%+ cache hit rate',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, minCacheHitRate: 0.95, maxErrorRate: 0.01 },
    },
    {
      name: 'ADV-R1: Cache Stampede Protection',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Handle cache expiration of viral URL (100K concurrent requests)',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 30,
      failureInjection: { type: 'cache_expiration', atSecond: 15, affectedKeys: ['viral_url'] },
      passCriteria: { maxP99Latency: 150, maxDBQueries: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'ADV-R2: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'Survive database primary failure with circuit breaker protection',
      traffic: { type: 'mixed', rps: 10000, readRps: 9000, writeRps: 1000 },
      duration: 90,
      failureInjection: { type: 'db_primary_crash', atSecond: 30, recoverySecond: 50 },
      passCriteria: { minAvailability: 0.999, maxDowntime: 5, maxErrorRate: 0.1 },
    },
    {
      name: 'ADV-R3: Cache Cluster Failure',
      type: 'reliability',
      requirement: 'NFR-R3',
      description: 'Gracefully degrade when entire cache cluster fails',
      traffic: { type: 'read', rps: 20000, readRps: 20000 },
      duration: 60,
      failureInjection: { type: 'cache_cluster_down', atSecond: 20, recoverySecond: 50 },
      passCriteria: { minAvailability: 0.95, maxP99Latency: 300, maxErrorRate: 0.15 },
    },
    {
      name: 'ADV-S1: DDoS Attack Mitigation',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Rate limiting protects against 1M RPS attack',
      traffic: { type: 'read', rps: 1000000, readRps: 1000000 },
      duration: 30,
      passCriteria: { maxRPS: 100000, maxErrorRate: 0.9, maxP99Latency: 200 },
    },
    {
      name: 'ADV-R4: Cascading Failure Prevention',
      type: 'reliability',
      requirement: 'NFR-R4',
      description: 'Circuit breakers prevent one failure from cascading',
      traffic: { type: 'mixed', rps: 50000, readRps: 45000, writeRps: 5000 },
      duration: 120,
      failureInjection: {
        type: 'cascading_failure_test',
        scenarios: [
          { type: 'db_slow', atSecond: 20, duration: 30 },
          { type: 'cache_slow', atSecond: 60, duration: 20 },
        ]
      },
      passCriteria: { minAvailability: 0.99, maxP99Latency: 200, circuitBreakerRequired: true },
    },
    {
      name: 'ADV-P2: Read Replica Isolation',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'Slow analytics queries don\'t impact production p99 latency',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRps: 9500,
        writeRps: 500,
        analyticsRPS: 50,  // slow queries
      },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'ADV-R5: Combined Failure Scenario',
      type: 'reliability',
      requirement: 'NFR-R5',
      description: 'Survive multiple simultaneous failures (cache + DB replica)',
      traffic: { type: 'mixed', rps: 30000, readRps: 27000, writeRps: 3000 },
      duration: 120,
      failureInjection: {
        type: 'multi_failure',
        scenarios: [
          { type: 'cache_node_down', atSecond: 20, nodeCount: 1 },
          { type: 'db_replica_down', atSecond: 40, replicaCount: 1 },
          { type: 'app_server_down', atSecond: 60, instanceCount: 1 },
        ]
      },
      passCriteria: { minAvailability: 0.995, maxP99Latency: 200, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getTinyUrlL6GuidedTutorial(): GuidedTutorial {
  return tinyUrlL6GuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = tinyUrlL6RequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= tinyUrlL6RequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
