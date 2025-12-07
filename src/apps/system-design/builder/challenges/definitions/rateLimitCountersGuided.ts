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
 * Rate Limit Counters Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching distributed rate limiting with Redis counters,
 * comparing different algorithms and handling fairness at scale.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview - rate algorithms, distributed counting, fairness)
 * Steps 1-3: Build basic rate limiting with Redis (FR satisfaction)
 * Steps 4-6: Advanced algorithms - token bucket vs sliding window, distributed counters, burst handling (NFRs)
 *
 * Key Concepts:
 * - Redis atomic operations (INCR, INCRBY)
 * - Fixed window counters
 * - Sliding window log vs sliding window counter
 * - Token bucket implementation with Redis
 * - Distributed rate limiting challenges
 * - Fairness vs performance trade-offs
 * - Burst handling strategies
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const rateLimitCountersRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a distributed rate limiting system using Redis counters",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Principal Engineer at ScaleAPI',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-rate-limiting',
      category: 'functional',
      question: "What does the rate limiting system need to do?",
      answer: "The system needs to:\n1. **Track request counts** - Count how many requests each client has made\n2. **Enforce limits** - Block requests when limit is exceeded\n3. **Reset counters** - Clear counts after the time window expires\n4. **Support multiple clients** - Track thousands of different API keys independently",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Rate limiting is fundamentally about counting and comparing: count requests, compare to limit, allow or deny",
    },
    {
      id: 'rate-limit-algorithms',
      category: 'functional',
      question: "What rate limiting algorithm should we use - fixed window, sliding window, or token bucket?",
      answer: "Let's start with **fixed window** for simplicity (count requests per hour/minute), then upgrade to **sliding window** to prevent boundary bursts. Token bucket is great for APIs that need burst tolerance, but adds complexity.\n\nFixed window: Simple, but allows 2x limit at boundaries\nSliding window: Smoother, prevents bursts\nToken bucket: Best user experience, allows natural bursts",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Different algorithms have different trade-offs: simplicity vs accuracy vs burst handling",
    },
    {
      id: 'counter-granularity',
      category: 'functional',
      question: "What time windows should we support - per second, minute, hour, day?",
      answer: "Support **configurable windows**: 1 second, 1 minute, 1 hour. Different use cases need different granularity:\n- Login endpoints: 5 requests per minute\n- Search API: 100 requests per second\n- Daily quotas: 10,000 requests per day",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Flexible time windows let you apply different limits to different endpoints",
    },

    // IMPORTANT - Clarifications
    {
      id: 'distributed-counters',
      category: 'clarification',
      question: "If we have multiple app servers, how do we keep counters consistent?",
      answer: "This is the key challenge! We need **centralized counters in Redis**. If each server tracked its own counters, a client could send 100 requests to each server and bypass a 100 req/min limit.\n\nRedis provides:\n- Atomic INCR operations (no race conditions)\n- Single source of truth for all servers\n- Sub-millisecond latency",
      importance: 'critical',
      insight: "Distributed rate limiting requires shared state - Redis is perfect for this",
    },
    {
      id: 'fairness-concern',
      category: 'clarification',
      question: "How do we ensure fairness - prevent one abusive client from affecting others?",
      answer: "**Per-client isolation** is critical! Each API key gets its own counter:\n- api_key_abc123 → 47 requests this minute\n- api_key_xyz789 → 3 requests this minute\n\nIf abc123 hits their limit, xyz789 is unaffected. This is why we use API keys (not IP addresses - too many clients share IPs via NAT/VPN).",
      importance: 'important',
      insight: "Per-client counters ensure one bad actor can't impact others",
    },
    {
      id: 'burst-handling',
      category: 'clarification',
      question: "Should we allow traffic bursts - like 100 requests in 1 second, then nothing for rest of minute?",
      answer: "Good question! **Fixed window allows bursts** (can use full limit instantly), **token bucket allows controlled bursts** (refills gradually), **sliding window prevents bursts** (smooths over time).\n\nFor MVP, let's use fixed window (simple) then upgrade to sliding window for better burst protection.",
      importance: 'important',
      insight: "Burst handling depends on your use case - APIs vs DDoS protection need different approaches",
    },

    // SCOPE
    {
      id: 'scope-multi-region',
      category: 'scope',
      question: "Do we need global rate limiting across multiple regions?",
      answer: "Not for MVP! Global rate limiting has latency challenges (cross-region Redis calls add 100-200ms). Start with **single-region rate limiting**, then later add eventual consistency across regions if needed.",
      importance: 'nice-to-have',
      insight: "Global rate limiting requires either high latency (sync) or eventual consistency (async)",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-checks',
      category: 'throughput',
      question: "How many rate limit checks per second should the system handle?",
      answer: "**20,000 checks per second** at peak. Every API request needs a rate limit check before processing, so this matches our API throughput.",
      importance: 'critical',
      calculation: {
        formula: "20K API requests/sec = 20K rate limit checks/sec",
        result: "~20,000 checks/sec peak, ~10,000 average",
      },
      learningPoint: "Rate limiter throughput must match API throughput - it's on the critical path",
    },
    {
      id: 'throughput-clients',
      category: 'throughput',
      question: "How many unique clients (API keys) do we need to track?",
      answer: "**100,000 active API keys**. Each key needs separate counters for each time window.",
      importance: 'important',
      calculation: {
        formula: "100K keys × 3 windows (sec/min/hour) = 300K active counters",
        result: "~300K counters in Redis at any time",
      },
      learningPoint: "Counter storage scales with (clients × time windows)",
    },

    // 2. LATENCY
    {
      id: 'latency-check',
      category: 'latency',
      question: "How fast should rate limit checks be?",
      answer: "**p99 latency under 2ms**. Rate limiting is on the critical path - every API request waits for it. Any slowdown directly hurts user experience.",
      importance: 'critical',
      learningPoint: "Rate limiters must be EXTREMELY fast - they block every single request",
    },
    {
      id: 'latency-redis-ops',
      category: 'latency',
      question: "Which Redis operations should we use for best performance?",
      answer: "Use **atomic operations** for speed and correctness:\n- `INCR key` - Atomic increment (1ms)\n- `EXPIRE key ttl` - Auto-cleanup (1ms)\n- `GET key` - Check current count (1ms)\n\nAvoid Lua scripts for simple cases - native commands are faster.",
      importance: 'important',
      insight: "Redis atomic ops are both fast AND correct - no need for locks or transactions",
    },

    // 3. ACCURACY
    {
      id: 'accuracy-requirement',
      category: 'consistency',
      question: "Does rate limiting need to be 100% accurate?",
      answer: "No! **95-98% accuracy is acceptable**. If the limit is 1000 req/min and someone gets 1020, that's fine. Perfect accuracy would require distributed locks and hurt performance.\n\nRate limiting is about **protection**, not **perfect enforcement**.",
      importance: 'critical',
      learningPoint: "Trade perfect accuracy for speed - rate limiting is about abuse prevention, not precise counting",
    },
    {
      id: 'race-conditions',
      category: 'consistency',
      question: "How do we handle race conditions - two servers incrementing the same counter simultaneously?",
      answer: "**Redis atomic operations solve this!** Redis is single-threaded, so INCR is automatically atomic. No need for locks:\n\n```\nServer A: INCR user_123  → returns 47\nServer B: INCR user_123  → returns 48\n```\n\nBoth operations are serialized by Redis - no race condition possible!",
      importance: 'critical',
      insight: "Redis single-threaded execution makes all operations naturally atomic",
    },

    // 4. BURST
    {
      id: 'burst-protection',
      category: 'burst',
      question: "What if a client sends 1000 requests at end of one window, then 1000 at start of next?",
      answer: "This is the **boundary burst problem** with fixed windows! At 11:59:59, client sends 1000 requests. At 12:00:01, they send 1000 more. That's 2000 requests in 2 seconds!\n\n**Solutions:**\n1. Sliding window counter (weighted average)\n2. Sliding window log (store all timestamps)\n3. Token bucket (refill gradually)\n\nWe'll implement sliding window counter - good balance of accuracy and performance.",
      importance: 'important',
      insight: "Fixed windows have a 2x burst vulnerability at boundaries - sliding window fixes this",
    },
    {
      id: 'burst-traffic-spike',
      category: 'burst',
      question: "What if overall traffic spikes 10x suddenly - can Redis handle it?",
      answer: "Redis can handle 100K-500K operations/sec on good hardware. At 20K checks/sec, we have plenty of headroom. But we should:\n1. Monitor Redis CPU and memory\n2. Use connection pooling (not new connection per request)\n3. Have fallback: if Redis is down, fail-open (allow traffic) rather than block everything",
      importance: 'important',
      insight: "Rate limiter should never become the bottleneck - monitor and fail gracefully",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-rate-limiting', 'rate-limit-algorithms', 'distributed-counters'],
  criticalFRQuestionIds: ['core-rate-limiting', 'rate-limit-algorithms', 'counter-granularity'],
  criticalScaleQuestionIds: ['throughput-checks', 'latency-check', 'accuracy-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Track and enforce rate limits',
      description: 'Count requests per client and block when limit exceeded',
      emoji: '🔢',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Support multiple algorithms',
      description: 'Fixed window, sliding window, token bucket',
      emoji: '⚙️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Configurable time windows',
      description: 'Per second, minute, hour granularity',
      emoji: '⏱️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000 API keys',
    writesPerDay: '1.7 billion increments (20K/sec)',
    readsPerDay: '1.7 billion checks',
    peakMultiplier: 2,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 10000, peak: 20000 },
    calculatedReadRPS: { average: 10000, peak: 20000 },
    maxPayloadSize: '~50 bytes (counter)',
    storagePerRecord: '~50 bytes (key + count + TTL)',
    storageGrowthPerYear: '~20MB (counters expire)',
    redirectLatencySLA: 'p99 < 2ms',
    createLatencySLA: 'p99 < 2ms',
  },

  architecturalImplications: [
    '✅ 20K checks/sec → Redis required for shared counters',
    '✅ p99 < 2ms → Co-locate Redis with app servers',
    '✅ 100K clients → Efficient key naming (rate:api_key:window)',
    '✅ Atomic operations → Use Redis INCR for race-free counting',
    '✅ Auto-cleanup → Use Redis EXPIRE for counter TTL',
    '✅ Distributed → All app servers share same Redis cluster',
  ],

  outOfScope: [
    'Global/multi-region rate limiting',
    'Per-endpoint rate limits (global limits only)',
    'Dynamic rate limit adjustment',
    'Rate limit analytics dashboard',
    'Custom rate limit rules (allow-lists, etc.)',
  ],

  keyInsight: "First, let's make it WORK. We'll build simple counters with Redis INCR. Once that works, we'll explore different algorithms (fixed window → sliding window → token bucket) and understand their trade-offs. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Rate Limiter
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to ScaleAPI! You're building a rate limiting service.",
  hook: "Right now, clients can send unlimited requests to your API. One malicious client could take down the entire system!",
  challenge: "Let's start by setting up the basic connection: Client → Rate Limiter → Backend API",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your rate limiter is online!",
  achievement: "Clients can now reach your rate limiting service",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Connection', after: 'Established' },
  ],
  nextTeaser: "But it doesn't enforce any limits yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting Architecture',
  conceptExplanation: `A **rate limiter** sits between clients and your backend services to control request rates.

**The flow:**
1. Client makes API request
2. Request hits Rate Limiter first
3. Rate Limiter checks: "Has this client exceeded their limit?"
4. If under limit → Forward to Backend API
5. If over limit → Return 429 Too Many Requests

Think of it as a nightclub bouncer checking how many times you've entered.`,

  whyItMatters: 'Without rate limiting, a single client (malicious or buggy) can overwhelm your servers, causing downtime for everyone.',

  keyPoints: [
    'Rate limiter intercepts ALL requests before they reach backend',
    'Must be extremely fast (< 2ms) - on critical path',
    'Tracks request counts per client (by API key)',
    'Returns 429 status when limits exceeded',
  ],

  diagram: `
┌─────────┐         ┌──────────────┐         ┌─────────┐
│ Client  │ ──────▶ │ Rate Limiter │ ──────▶ │ Backend │
│(API Key)│ ◀────── │  (Counter)   │ ◀────── │   API   │
└─────────┘         └──────────────┘         └─────────┘
                          │
                          │ If over limit:
                          ▼
                    429 Too Many Requests
`,

  keyConcepts: [
    {
      title: 'Rate Limiter',
      explanation: 'Service that counts and enforces request limits',
      icon: '🚦',
    },
    {
      title: 'API Key',
      explanation: 'Unique identifier for each client',
      icon: '🔑',
    },
    {
      title: 'HTTP 429',
      explanation: 'Status code meaning "Too Many Requests"',
      icon: '🛑',
    },
  ],

  quickCheck: {
    question: 'Where should the rate limiter sit in the request flow?',
    options: [
      'After the backend processes the request',
      'Before the request reaches the backend',
      'Inside the database',
      'On the client side only',
    ],
    correctIndex: 1,
    explanation: 'The rate limiter must intercept requests BEFORE they reach the backend to prevent overload.',
  },
};

const step1: GuidedStep = {
  id: 'rate-limit-counters-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Clients need to reach the rate limiter',
    taskDescription: 'Add Client, App Server (Rate Limiter), and Backend - connect them in sequence',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API clients', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as rate limiter', displayName: 'Rate Limiter' },
      { type: 'app_server', reason: 'Backend API being protected', displayName: 'Backend API' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Rate Limiter', reason: 'Clients send requests to limiter' },
      { from: 'Rate Limiter', to: 'Backend API', reason: 'Limiter forwards allowed requests' },
    ],
    successCriteria: ['Add Client, Rate Limiter, Backend', 'Connect in sequence'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'You need 3 components connected in a chain',
    level2: 'Add Client, App Server (Rate Limiter), App Server (Backend), then connect them',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server', label: 'Rate Limiter' },
      { type: 'app_server', label: 'Backend API' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Add Redis for Counter Storage
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "Time to implement actual rate limiting!",
  hook: "You need somewhere to store the counters. In-memory won't work - you'll have multiple servers and need to share state.",
  challenge: "Add Redis to store counters that all rate limiter instances can access.",
  illustration: 'redis-storage',
};

const step2Celebration: CelebrationContent = {
  emoji: '💎',
  message: "Redis is connected!",
  achievement: "You now have distributed counter storage",
  metrics: [
    { label: 'Storage', after: 'Redis' },
    { label: 'Distributed', after: '✓' },
    { label: 'Atomic ops', after: 'Supported' },
  ],
  nextTeaser: "Now let's implement the counting logic...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Why Redis for Rate Limiting?',
  conceptExplanation: `**Why Redis is perfect for counters:**

1. **Atomic operations**: INCR is thread-safe, no race conditions
2. **Speed**: Sub-millisecond latency (< 1ms)
3. **Distributed**: All servers share same counters
4. **Auto-expiration**: TTL automatically cleans up old counters
5. **Simple**: Counter = just a number in Redis

**Redis commands we'll use:**
\`\`\`
INCR rate:api_key_123:minute_12345    # Atomic increment
EXPIRE rate:api_key_123:minute_12345 60   # Auto-delete after 60s
GET rate:api_key_123:minute_12345     # Check current count
\`\`\`

**Key structure:**
\`rate:{api_key}:{window_id}\`
- rate:user_abc:min_67890 → 47 requests
- rate:user_xyz:min_67890 → 3 requests`,

  whyItMatters: 'Redis solves the distributed counting problem - all servers see the same counters, updated atomically.',

  realWorldExample: {
    company: 'Twitter API',
    scenario: 'Rate limits 900 requests per 15 minutes',
    howTheyDoIt: 'Uses Redis with INCR for atomic counting across all API gateway servers',
  },

  keyPoints: [
    'Redis INCR is atomic - no locks needed',
    'All rate limiter servers share same Redis',
    'TTL auto-expires old counters (memory efficient)',
    'Sub-millisecond latency keeps rate limiting fast',
  ],

  diagram: `
┌──────────┐       ┌──────────┐       ┌──────────────┐
│ Client   │ ────▶ │  Rate    │ ────▶ │    Redis     │
└──────────┘       │ Limiter  │       │              │
                   └──────────┘       │ rate:abc:min │
                                      │   count: 47  │
                                      │   TTL: 45s   │
                                      └──────────────┘
                                             ↑
                        All servers share these counters!
`,

  keyConcepts: [
    { title: 'INCR', explanation: 'Atomic increment operation in Redis', icon: '⚛️' },
    { title: 'TTL', explanation: 'Time-To-Live: auto-delete after N seconds', icon: '⏱️' },
    { title: 'Atomic', explanation: 'Operation completes fully or not at all, no race conditions', icon: '🔒' },
  ],

  quickCheck: {
    question: 'Why is Redis INCR better than GET-then-SET for counters?',
    options: [
      'INCR is faster',
      'INCR is atomic - no race conditions',
      'INCR uses less memory',
      'INCR is easier to write',
    ],
    correctIndex: 1,
    explanation: 'INCR is atomic - two servers incrementing simultaneously won\'t lose updates. GET-then-SET has race conditions.',
  },
};

const step2: GuidedStep = {
  id: 'rate-limit-counters-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Rate limiter needs persistent counter storage',
    taskDescription: 'Add Redis Cache and connect Rate Limiter to it',
    componentsNeeded: [
      { type: 'cache', reason: 'Store rate limit counters', displayName: 'Redis' },
    ],
    connectionsNeeded: [
      { from: 'Rate Limiter', to: 'Redis', reason: 'Read/write counters' },
    ],
    successCriteria: ['Add Redis Cache', 'Connect Rate Limiter → Redis'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add Cache component and connect it to the Rate Limiter',
    level2: 'Client → Rate Limiter → Backend API, and Rate Limiter → Redis',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 3: Implement Fixed Window Algorithm (Python)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💻',
  scenario: "Redis is ready. Now let's write the code!",
  hook: "Time to implement the actual rate limiting logic in Python. We'll start with the simplest algorithm: fixed window.",
  challenge: "Write Python code that uses Redis INCR to count requests in fixed time windows.",
  illustration: 'coding',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Fixed window rate limiting works!",
  achievement: "You're now blocking excessive requests",
  metrics: [
    { label: 'Algorithm', after: 'Fixed Window' },
    { label: 'Code', after: 'Implemented' },
    { label: 'Blocking abuse', after: '✓' },
  ],
  nextTeaser: "But there's a boundary problem we need to fix...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Fixed Window Algorithm',
  conceptExplanation: `**Fixed Window** is the simplest rate limiting algorithm.

**How it works:**
1. Divide time into fixed chunks (windows)
2. Count requests in current window
3. Reset counter when window changes

**Example: 100 requests per minute**
- 12:00:00 - 12:00:59 → Window 1 (counter resets at 12:01:00)
- 12:01:00 - 12:01:59 → Window 2 (counter resets at 12:02:00)

**Python implementation:**
\`\`\`python
def check_rate_limit(api_key, limit=100, window_seconds=60):
    # Calculate current window ID
    current_time = time.time()
    window_id = int(current_time / window_seconds)

    # Redis key: rate:{api_key}:{window_id}
    key = f"rate:{api_key}:window_{window_id}"

    # Atomic increment
    count = redis.incr(key)

    # Set TTL on first request
    if count == 1:
        redis.expire(key, window_seconds * 2)  # Keep for 2 windows

    # Check limit
    if count > limit:
        return False  # Rate limited!

    return True  # Allowed
\`\`\`

**Problem:** Boundary bursts!
- User sends 100 requests at 12:00:59 ✓
- User sends 100 requests at 12:01:00 ✓ (new window!)
- Result: 200 requests in 1 second (2x limit!)`,

  whyItMatters: 'Fixed window is simple to implement and understand, but has edge cases at window boundaries.',

  famousIncident: {
    title: 'GitHub API Boundary Burst',
    company: 'GitHub',
    year: '2019',
    whatHappened: 'A bug in a CI/CD system exploited fixed window boundaries to send 2x the allowed requests. This caused API slowdowns until GitHub added burst protection.',
    lessonLearned: 'Fixed windows need burst protection - sliding window or rate limiters per endpoint.',
    icon: '🐙',
  },

  keyPoints: [
    'Window ID = current_timestamp / window_size',
    'Each window gets its own Redis key',
    'Use INCR for atomic counting',
    'Set TTL to auto-cleanup old windows',
    'Beware: 2x burst possible at boundaries',
  ],

  diagram: `
Fixed Window: 100 req/min

12:00:00          12:00:59 | 12:01:00          12:01:59
[======Window 1==========] [======Window 2==========]
       100 requests         ↑      100 requests
                            │
                   Boundary problem:
                   200 req in 1 second! ⚠️

Redis keys:
rate:user_123:window_1234  →  100
rate:user_123:window_1235  →  100
`,

  keyConcepts: [
    { title: 'Window ID', explanation: 'Timestamp divided by window size', icon: '🪟' },
    { title: 'INCR', explanation: 'Atomic counter increment in Redis', icon: '➕' },
    { title: 'Boundary Burst', explanation: '2x limit possible at window edges', icon: '⚠️' },
  ],

  quickCheck: {
    question: 'What is the main weakness of fixed window rate limiting?',
    options: [
      'It\'s too slow',
      'It uses too much memory',
      'It allows 2x bursts at window boundaries',
      'It\'s too complex',
    ],
    correctIndex: 2,
    explanation: 'Fixed windows allow bursts at boundaries - full limit at end of window + full limit at start of next window.',
  },
};

const step3: GuidedStep = {
  id: 'rate-limit-counters-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Implement fixed window counting algorithm',
    taskDescription: 'Write Python code in Rate Limiter to implement fixed window with Redis INCR',
    successCriteria: [
      'Click Rate Limiter component',
      'Configure API endpoints',
      'Open Python tab',
      'Implement check_rate_limit() using Redis INCR',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click Rate Limiter → Configure APIs → Python tab → Implement fixed window',
    level2: 'Calculate window_id = int(time.time() / window_seconds), then use redis.incr(f"rate:{api_key}:window_{window_id}")',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Upgrade to Sliding Window Counter
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🪟',
  scenario: "Problem! Clients are exploiting the boundary burst vulnerability.",
  hook: "At 12:00:59, a client sends 100 requests. At 12:01:00, they send 100 more. That's 200 requests in 1 second - double the limit!",
  challenge: "Upgrade to sliding window counter algorithm to prevent boundary bursts.",
  illustration: 'algorithm-upgrade',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Sliding window deployed!",
  achievement: "Boundary bursts are now prevented",
  metrics: [
    { label: 'Algorithm', before: 'Fixed Window', after: 'Sliding Window' },
    { label: 'Boundary bursts', before: '2x limit', after: 'Prevented' },
    { label: 'Smoothness', after: 'Improved' },
  ],
  nextTeaser: "Great! Now let's explore token bucket for burst tolerance...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Sliding Window Counter Algorithm',
  conceptExplanation: `**Sliding Window Counter** fixes the boundary burst problem.

**How it works:**
Use weighted average of current window + previous window:

\`\`\`python
def check_rate_limit_sliding(api_key, limit=100, window_seconds=60):
    current_time = time.time()
    current_window = int(current_time / window_seconds)
    previous_window = current_window - 1

    # How far into current window?
    elapsed_in_current = current_time % window_seconds
    weight = elapsed_in_current / window_seconds

    # Get counts from both windows
    current_count = redis.get(f"rate:{api_key}:window_{current_window}") or 0
    previous_count = redis.get(f"rate:{api_key}:window_{previous_window}") or 0

    # Weighted average
    estimated_count = current_count + (previous_count * (1 - weight))

    if estimated_count >= limit:
        return False  # Rate limited

    # Increment current window
    redis.incr(f"rate:{api_key}:window_{current_window}")
    return True
\`\`\`

**Example:**
- Limit: 100 req/min
- Time: 12:00:30 (30 seconds into current minute)
- Previous window (11:59): 80 requests
- Current window (12:00): 40 requests
- Weight: 30/60 = 0.5
- Estimated: 40 + (80 × 0.5) = 80 requests ✓ Under limit!

**Benefits:**
✅ Prevents boundary bursts
✅ Memory efficient (only 2 counters)
✅ Smooth limit enforcement`,

  whyItMatters: 'Sliding window prevents the 2x burst attack while being memory-efficient (unlike sliding window log which stores every request timestamp).',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Rate limits billions of requests across edge network',
    howTheyDoIt: 'Uses sliding window counter with 1-second granularity, updated across distributed edge servers',
  },

  keyPoints: [
    'Tracks current window + previous window',
    'Weight based on time elapsed in current window',
    'Estimated count = current + (previous × weight)',
    'Prevents 2x bursts at boundaries',
    'Only 2 Redis keys per client (memory efficient)',
  ],

  diagram: `
Sliding Window: 100 req/min

Time: 12:00:30 (30 seconds into minute)

Previous Window         Current Window
11:59:00-11:59:59      12:00:00-12:00:59
    80 requests         40 requests
[=================]  [========|          ]
                              ↑ now (30s elapsed)

Weight = (60 - 30) / 60 = 0.5
Estimated = 40 + (80 × 0.5) = 80 requests

Remaining = 100 - 80 = 20 requests allowed ✓
`,

  keyConcepts: [
    { title: 'Sliding Window', explanation: 'Rolling window that moves with time', icon: '📊' },
    { title: 'Weighted Average', explanation: 'Blend current + previous based on elapsed time', icon: '⚖️' },
    { title: 'Smooth Limits', explanation: 'No sudden resets at boundaries', icon: '〰️' },
  ],

  quickCheck: {
    question: 'Why is sliding window better than fixed window?',
    options: [
      'It uses less memory',
      'It\'s faster to compute',
      'It prevents boundary bursts',
      'It\'s easier to implement',
    ],
    correctIndex: 2,
    explanation: 'Sliding window prevents users from exploiting window boundaries to send 2x the limit.',
  },
};

const step4: GuidedStep = {
  id: 'rate-limit-counters-step-4',
  stepNumber: 4,
  frIndex: 1,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Prevent boundary burst attacks',
    taskDescription: 'Update Python code to use sliding window counter algorithm',
    successCriteria: [
      'Keep same architecture',
      'Update Python code to use weighted average of 2 windows',
      'Calculate estimated count before incrementing',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Track both current and previous window, calculate weighted average',
    level2: 'Get counts from 2 windows, calculate weight based on elapsed time, estimate = current + (previous × weight)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Implement Token Bucket for Burst Tolerance
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🪣',
  scenario: "Your API users are complaining!",
  hook: "A mobile app made 50 requests when the user opened it (loading data), then went quiet. The sliding window blocked it. Users want burst tolerance!",
  challenge: "Implement token bucket algorithm - refills gradually, allows controlled bursts.",
  illustration: 'token-bucket',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Token bucket is live!",
  achievement: "Your rate limiter now allows natural traffic patterns",
  metrics: [
    { label: 'Algorithm', before: 'Sliding Window', after: 'Token Bucket' },
    { label: 'Allows bursts', before: '❌', after: '✓ Controlled' },
    { label: 'User friendly', after: '✓✓' },
  ],
  nextTeaser: "Excellent! Now let's scale to multiple servers...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Token Bucket Algorithm',
  conceptExplanation: `**Token Bucket** is the most user-friendly rate limiting algorithm.

**Concept:**
Imagine a bucket that:
- Holds tokens (capacity = rate limit)
- Refills at constant rate (e.g., 100 tokens/minute = 1.67 tokens/sec)
- Each request consumes 1 token
- Bucket can fill up to capacity, then stops

**Implementation with Redis:**
\`\`\`python
def check_rate_limit_token_bucket(api_key, capacity=100, refill_rate=1.67):
    """
    capacity: max tokens (e.g., 100)
    refill_rate: tokens per second (e.g., 100/min = 1.67/sec)
    """
    now = time.time()
    key = f"rate:bucket:{api_key}"

    # Get current state
    data = redis.hgetall(key)

    if not data:
        # Initialize bucket
        tokens = capacity
        last_refill = now
    else:
        tokens = float(data['tokens'])
        last_refill = float(data['last_refill'])

    # Refill tokens based on elapsed time
    elapsed = now - last_refill
    tokens_to_add = elapsed * refill_rate
    tokens = min(capacity, tokens + tokens_to_add)

    # Try to consume 1 token
    if tokens < 1:
        return False  # No tokens available

    tokens -= 1

    # Save state
    redis.hset(key, mapping={
        'tokens': tokens,
        'last_refill': now
    })
    redis.expire(key, 3600)  # 1 hour TTL

    return True
\`\`\`

**Why users love it:**
- Can save up tokens during quiet periods
- Then use them for legitimate bursts
- Natural traffic patterns work well`,

  whyItMatters: 'Token bucket balances protection (long-term rate limit) with user experience (allows bursts).',

  realWorldExample: {
    company: 'AWS API Gateway',
    scenario: 'Default rate limiting for all APIs',
    howTheyDoIt: 'Uses token bucket with configurable capacity and refill rate per API',
  },

  famousIncident: {
    title: 'Stripe API Token Bucket Tuning',
    company: 'Stripe',
    year: '2020',
    whatHappened: 'Stripe changed token bucket refill rates to be more permissive during COVID-19, allowing e-commerce sites to handle traffic spikes without hitting rate limits.',
    lessonLearned: 'Token bucket parameters (capacity, refill rate) should be tunable based on business needs.',
    icon: '💳',
  },

  keyPoints: [
    'Tokens refill at constant rate (e.g., 1.67/sec for 100/min)',
    'Capacity limits max burst size',
    'Store tokens + last_refill timestamp in Redis HASH',
    'Most user-friendly algorithm - allows natural patterns',
    'Trade-off: More complex than fixed/sliding window',
  ],

  diagram: `
Token Bucket (capacity=5, refill=1 token/sec)

Time 0: Bucket starts full
┌────────────────┐
│ ⚫ ⚫ ⚫ ⚫ ⚫ │ 5 tokens
└────────────────┘

3 requests → consume 3 tokens:
┌────────────────┐
│ ⚫ ⚫          │ 2 tokens left
└────────────────┘

Wait 3 seconds → refill 3 tokens:
┌────────────────┐
│ ⚫ ⚫ ⚫ ⚫ ⚫ │ 5 tokens (capped at capacity)
└────────────────┘

Burst: 5 requests instantly
┌────────────────┐
│                │ 0 tokens
└────────────────┘

6th request → RATE LIMITED (no tokens)
`,

  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Bucket refills gradually, requests consume tokens', icon: '🪣' },
    { title: 'Capacity', explanation: 'Max tokens = max burst size', icon: '📊' },
    { title: 'Refill Rate', explanation: 'Tokens added per second (e.g., 1.67/sec)', icon: '⏱️' },
    { title: 'Burst Tolerance', explanation: 'Can use saved tokens for legitimate spikes', icon: '⚡' },
  ],

  quickCheck: {
    question: 'What advantage does token bucket have over sliding window?',
    options: [
      'It uses less memory',
      'It\'s faster to compute',
      'It allows controlled bursts using saved tokens',
      'It\'s more accurate',
    ],
    correctIndex: 2,
    explanation: 'Token bucket allows users to save tokens during quiet periods and use them for bursts - more natural traffic patterns.',
  },
};

const step5: GuidedStep = {
  id: 'rate-limit-counters-step-5',
  stepNumber: 5,
  frIndex: 2,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Support burst-tolerant rate limiting',
    taskDescription: 'Add token bucket algorithm to Python code',
    successCriteria: [
      'Keep same architecture',
      'Add token bucket implementation',
      'Store tokens + last_refill in Redis HASH',
      'Calculate refill based on elapsed time',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Track tokens and last_refill time, refill based on elapsed seconds',
    level2: 'tokens_to_add = elapsed × refill_rate, new_tokens = min(capacity, tokens + tokens_to_add)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Scale with Load Balancer and Fairness
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "Success! Your rate limiter is handling 20,000 checks per second.",
  hook: "Traffic is growing. Time to scale horizontally with multiple rate limiter instances behind a load balancer.",
  challenge: "Add load balancer for horizontal scaling. Ensure fairness - one client shouldn't impact others.",
  illustration: 'horizontal-scaling',
};

const step6Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your rate limiter is production-ready!",
  achievement: "Horizontally scalable with per-client fairness",
  metrics: [
    { label: 'Capacity', before: '5K/sec', after: '20K+/sec' },
    { label: 'Instances', before: '1', after: 'Multiple' },
    { label: 'Fairness', after: '✓ Per-client isolation' },
  ],
  nextTeaser: "Perfect! You've built a production-grade distributed rate limiter!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Rate Limiting & Fairness',
  conceptExplanation: `**Challenge 1: Horizontal Scaling**

With one server, you can handle ~5K checks/sec. For 20K, you need 4 servers.

**Solution: Load Balancer**
\`\`\`
Client → Load Balancer → Rate Limiter 1 ─┐
                      → Rate Limiter 2 ─┤→ Redis → Backend
                      → Rate Limiter 3 ─┤
                      → Rate Limiter 4 ─┘
\`\`\`

All rate limiters share same Redis - counters stay consistent!

**Challenge 2: Fairness**

Without per-client isolation:
- Client A sends 10K req/sec (hits limit)
- Client B sends 100 req/sec
- Redis is overwhelmed by Client A
- Client B's requests are slow/fail!

**Solution: Per-Client Counters**
\`\`\`python
# Each client gets own keys
rate:client_A:bucket  # Client A's tokens
rate:client_B:bucket  # Client B's tokens
\`\`\`

If Client A hits limit, only they get 429s. Client B unaffected!

**Fairness also means:**
- Connection pooling (don't create new Redis connection per request)
- Timeouts (if Redis is slow, fail-open)
- Circuit breakers (if Redis is down, bypass rate limiting temporarily)`,

  whyItMatters: 'Horizontal scaling handles more traffic. Fairness ensures one bad actor doesn\'t hurt other clients.',

  realWorldExample: {
    company: 'GitHub API',
    scenario: 'Handles millions of API requests per day',
    howTheyDoIt: 'Uses load-balanced rate limiters with Redis Cluster. Each API key has isolated rate limits.',
  },

  keyPoints: [
    'Load balancer distributes traffic across multiple rate limiter instances',
    'All instances share same Redis for counter consistency',
    'Per-client keys ensure isolation (fairness)',
    'Connection pooling reduces Redis connection overhead',
    'Fail-open if Redis is unavailable (better than blocking all traffic)',
  ],

  diagram: `
                    ┌────────────┐
                    │    LB      │
                    └─────┬──────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌────────┐       ┌────────┐      ┌────────┐
    │Limiter1│       │Limiter2│      │Limiter3│
    └────┬───┘       └────┬───┘      └────┬───┘
         │                │                │
         └────────────────┼────────────────┘
                          ▼
                   ┌─────────────┐
                   │    Redis    │
                   │             │
                   │ rate:A:bkt  │ Client A
                   │ rate:B:bkt  │ Client B
                   │ rate:C:bkt  │ Client C
                   └─────────────┘

Each client isolated - fairness!
`,

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to handle more load', icon: '↔️' },
    { title: 'Fairness', explanation: 'Per-client isolation prevents noisy neighbors', icon: '⚖️' },
    { title: 'Shared State', explanation: 'All servers use same Redis counters', icon: '🔗' },
    { title: 'Fail-Open', explanation: 'Allow traffic if Redis fails (vs blocking all)', icon: '🚪' },
  ],

  quickCheck: {
    question: 'Why do all rate limiter instances need to share the same Redis?',
    options: [
      'Redis is faster than separate databases',
      'To ensure consistent counters across all instances',
      'It uses less memory',
      'It\'s required by HTTP protocol',
    ],
    correctIndex: 1,
    explanation: 'Shared Redis ensures all rate limiter instances see the same counters - otherwise clients could bypass limits by hitting different servers.',
  },
};

const step6: GuidedStep = {
  id: 'rate-limit-counters-step-6',
  stepNumber: 6,
  frIndex: 0,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Handle 20K checks/sec with fairness',
    taskDescription: 'Add Load Balancer, configure multiple rate limiter instances, ensure Redis has replication',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic', displayName: 'Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic through LB' },
      { from: 'Load Balancer', to: 'Rate Limiter', reason: 'Distribute to instances' },
    ],
    successCriteria: [
      'Add Load Balancer between Client and Rate Limiter',
      'Client → LB → Rate Limiter → Backend',
      'Configure Rate Limiter for multiple instances',
      'Enable Redis replication for HA',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
    requireCacheReplication: true,
  },
  hints: {
    level1: 'Add Load Balancer, reconnect Client → LB → Rate Limiter',
    level2: 'Click Rate Limiter → set instances to 3+. Click Redis → enable replication',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const rateLimitCountersGuidedTutorial: GuidedTutorial = {
  problemId: 'rate-limit-counters-guided',
  problemTitle: 'Build Distributed Rate Limiter with Redis Counters',

  requirementsPhase: rateLimitCountersRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  finalExamTestCases: [
    {
      name: 'Basic Rate Limiting',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Enforce basic rate limits with Redis counters',
      traffic: { type: 'mixed', rps: 1000, readRps: 500, writeRps: 500 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Algorithm Correctness',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Sliding window prevents boundary bursts',
      traffic: { type: 'mixed', rps: 2000, readRps: 1000, writeRps: 1000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'High Throughput',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Handle 20K rate limit checks per second',
      traffic: { type: 'read', rps: 20000, readRps: 20000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Low Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Maintain p99 latency under 2ms',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 2, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-R1: Redis Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Handle Redis primary failure with replication',
      traffic: { type: 'mixed', rps: 5000, readRps: 4000, writeRps: 1000 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 45, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 5, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-F1: Fairness',
      type: 'reliability',
      requirement: 'NFR-F1',
      description: 'Per-client isolation - one client hitting limit doesn\'t affect others',
      traffic: { type: 'mixed', rps: 10000, readRps: 8000, writeRps: 2000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getRateLimitCountersGuidedTutorial(): GuidedTutorial {
  return rateLimitCountersGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = rateLimitCountersRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= rateLimitCountersRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
