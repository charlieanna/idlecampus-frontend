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
 * Simple Rate Limiter Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches rate limiting concepts
 * while building a production-ready rate limiter service.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working rate limiter (FR satisfaction)
 * Steps 4-8: Scale with NFRs (Redis, sliding window, distributed limits)
 *
 * Key Concepts:
 * - Fixed window vs sliding window algorithms
 * - Token bucket algorithm
 * - Redis counters and atomic operations
 * - Distributed rate limiting challenges
 * - Performance vs accuracy trade-offs
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const rateLimiterRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a rate limiting service that protects APIs from abuse",

  interviewer: {
    name: 'Alex Martinez',
    role: 'Senior Infrastructure Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-rate-limiting',
      category: 'functional',
      question: "What does the rate limiter need to do? What's the main user experience?",
      answer: "The rate limiter protects our APIs by:\n1. **Checking requests**: For each API request, check if the client has exceeded their limit\n2. **Allowing or blocking**: If under limit, allow the request. If over limit, reject with 429 Too Many Requests\n3. **Tracking usage**: Keep a counter of how many requests each client has made in the current time window",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Rate limiting is about counting requests per client and enforcing limits",
    },
    {
      id: 'limit-granularity',
      category: 'functional',
      question: "How do we identify clients? By IP address, user ID, API key?",
      answer: "For MVP, let's use **API keys**. Each client gets a unique key like 'api_key_abc123'. This is cleaner than IP (proxies complicate things) and works for authenticated APIs.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Rate limiting needs a unique identifier per client - API keys are standard",
    },
    {
      id: 'time-windows',
      category: 'functional',
      question: "What time window should we use for rate limiting? Per second, minute, hour?",
      answer: "Let's support **configurable windows**: 1 second, 1 minute, and 1 hour. Different APIs have different needs - login might be 5/minute, search might be 100/second.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Flexible time windows let different APIs have different limits",
    },

    // IMPORTANT - Clarifications
    {
      id: 'response-format',
      category: 'clarification',
      question: "What should we return when a request is rate limited?",
      answer: "Return HTTP 429 Too Many Requests with headers:\n- `X-RateLimit-Limit`: Max requests allowed\n- `X-RateLimit-Remaining`: Requests left in window\n- `X-RateLimit-Reset`: When the window resets (Unix timestamp)\n\nThis tells clients when they can retry.",
      importance: 'important',
      insight: "Standard rate limit headers help clients implement exponential backoff",
    },
    {
      id: 'burst-handling',
      category: 'clarification',
      question: "Should we allow short bursts above the limit?",
      answer: "Not for MVP. We'll enforce a strict limit. Token bucket (which allows bursts) can be a v2 feature, but fixed/sliding window is simpler to start.",
      importance: 'nice-to-have',
      insight: "Start with fixed window for simplicity, upgrade to token bucket for bursts later",
    },
    {
      id: 'distributed-vs-local',
      category: 'clarification',
      question: "Do we need distributed rate limiting across multiple servers?",
      answer: "Yes! If we have 3 app servers and limit is 100 req/min, we can't have each server track 100 - that's 300 total. We need a **shared counter** that all servers check.",
      importance: 'critical',
      insight: "Distributed systems need centralized counters - Redis is perfect for this",
    },

    // SCOPE
    {
      id: 'scope-single-region',
      category: 'scope',
      question: "Is this for a single region or global rate limiting?",
      answer: "Single region for now. Global rate limiting has network latency challenges. Start local, expand later.",
      importance: 'nice-to-have',
      insight: "Global rate limiting requires edge-based counters or eventual consistency",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-checks',
      category: 'throughput',
      question: "How many rate limit checks per second should we handle?",
      answer: "Every API request needs a rate limit check. If we're protecting an API doing 10,000 requests/second, we need 10,000 checks/second.",
      importance: 'critical',
      calculation: {
        formula: "10K API requests/sec = 10K rate limit checks/sec",
        result: "~10,000 checks/sec baseline, 30K at peak",
      },
      learningPoint: "Rate limiter throughput must match API throughput - it's on the hot path",
    },
    {
      id: 'throughput-keys',
      category: 'throughput',
      question: "How many unique API keys (clients) should we track?",
      answer: "Let's plan for 100,000 active API keys. Each key needs its own counter per time window.",
      importance: 'important',
      calculation: {
        formula: "100K keys × 3 windows (sec/min/hr) = 300K counters",
        result: "~300K active counters in memory/Redis",
      },
      learningPoint: "Memory planning: each counter is small but they add up",
    },

    // 2. LATENCY
    {
      id: 'latency-check',
      category: 'latency',
      question: "How fast should rate limit checks be?",
      answer: "p99 under 1ms! The rate limiter is on the critical path - every API request waits for it. Any slowdown directly impacts API latency.",
      importance: 'critical',
      learningPoint: "Rate limiters must be FAST - they block every request",
    },
    {
      id: 'latency-redis',
      category: 'latency',
      question: "If we use Redis for counters, is network latency acceptable?",
      answer: "Yes, if Redis is in the same datacenter. Redis GET/INCR is ~1ms. We can use pipelining to batch checks if needed.",
      importance: 'important',
      insight: "Co-locate Redis with app servers for low latency",
    },

    // 3. ACCURACY
    {
      id: 'accuracy-requirement',
      category: 'consistency',
      question: "Does rate limiting need to be 100% accurate?",
      answer: "No! 95-99% accuracy is fine. If the limit is 100 req/min and someone gets 102, that's acceptable. Perfect accuracy would require locks and hurt performance.",
      importance: 'critical',
      learningPoint: "Rate limiting is about protection, not perfect counting - trade accuracy for speed",
    },
    {
      id: 'race-conditions',
      category: 'consistency',
      question: "What about race conditions? Two requests checking simultaneously?",
      answer: "Use Redis atomic operations like INCR. Redis is single-threaded, so increments are automatically atomic. No locks needed!",
      importance: 'critical',
      insight: "Redis atomic ops solve race conditions without explicit locking",
    },

    // 4. BURST
    {
      id: 'burst-traffic',
      category: 'burst',
      question: "What if traffic spikes 10x suddenly?",
      answer: "The rate limiter itself must handle the spike without falling over. If we can't check limits fast enough, we fail open (allow requests) rather than block legitimate traffic.",
      importance: 'important',
      insight: "Fail open vs fail closed: when overloaded, allow traffic to protect availability",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-rate-limiting', 'limit-granularity', 'distributed-vs-local'],
  criticalFRQuestionIds: ['core-rate-limiting', 'limit-granularity', 'time-windows'],
  criticalScaleQuestionIds: ['throughput-checks', 'latency-check', 'accuracy-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Check and enforce rate limits',
      description: 'For each request, check if client is under limit and allow/block accordingly',
      emoji: '🚦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Track per-client limits',
      description: 'Maintain separate counters for each API key',
      emoji: '🔑',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support multiple time windows',
      description: 'Allow configurable windows: per second, minute, hour',
      emoji: '⏰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100,000 API keys',
    writesPerDay: '864 million checks (10K/sec)',
    readsPerDay: '864 million checks',
    peakMultiplier: 3,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 10000, peak: 30000 },
    calculatedReadRPS: { average: 10000, peak: 30000 },
    maxPayloadSize: '~100 bytes (rate limit check)',
    storagePerRecord: '~50 bytes (counter)',
    storageGrowthPerYear: '~15MB (counters expire)',
    redirectLatencySLA: 'p99 < 1ms',
    createLatencySLA: 'p99 < 1ms',
  },

  architecturalImplications: [
    '✅ 10K checks/sec → Need fast in-memory storage (Redis)',
    '✅ p99 < 1ms → Redis must be co-located with app servers',
    '✅ Distributed → Shared Redis for centralized counters',
    '✅ 100K keys × 3 windows → ~300K counters in Redis',
    '✅ Counters expire → Use Redis TTL for automatic cleanup',
    '✅ Atomic increments → Use Redis INCR command',
  ],

  outOfScope: [
    'Token bucket algorithm (allows bursts)',
    'Global/multi-region rate limiting',
    'Per-user rate limiting (only API keys)',
    'Dynamic rate limit adjustment',
    'Rate limit analytics/dashboards',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple rate limiter with in-memory counters. Once it works, we'll add Redis for distributed counting, then optimize with sliding windows. Functionality first, then scale!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚦',
  scenario: "Welcome! You've been hired to build a rate limiter that protects our API infrastructure.",
  hook: "Right now, our APIs have NO protection. A single malicious client could flood us with millions of requests and take down the entire service!",
  challenge: "Let's start by connecting clients to your rate limiter service.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your rate limiter is online!",
  achievement: "Clients can now reach your rate limiting service",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting checks', after: '✓' },
  ],
  nextTeaser: "But it doesn't actually limit anything yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting Architecture Basics',
  conceptExplanation: `A rate limiter sits between clients and your API servers.

**The flow:**
1. Client makes API request
2. Request hits Rate Limiter first
3. Rate Limiter checks: "Has this client exceeded their limit?"
4. If under limit → Forward request to App Server
5. If over limit → Return 429 Too Many Requests

Think of it as a bouncer at a club - checking how many times you've entered today.`,
  whyItMatters: 'Without rate limiting, a single malicious actor can overwhelm your servers with requests, causing downtime for all users.',
  keyPoints: [
    'Rate limiter processes EVERY request before it reaches your API',
    'It must be fast - p99 latency under 1ms',
    'Tracks request counts per client (by API key)',
    'Returns 429 when limits are exceeded',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐         ┌─────────────┐
│   Client    │ ──────▶ │  Rate Limiter   │ ──────▶ │ App Server  │
│ (API Key)   │ ◀────── │ (Check Limit)   │ ◀────── │   (API)     │
└─────────────┘         └─────────────────┘         └─────────────┘
                               ↓
                        If over limit:
                        429 Too Many Requests
`,
  keyConcepts: [
    {
      title: 'Rate Limit',
      explanation: 'Max requests allowed per time window (e.g., 100/minute)',
      icon: '🚦',
    },
    {
      title: '429 Status',
      explanation: 'HTTP status code meaning "Too Many Requests"',
      icon: '🛑',
    },
  ],
  quickCheck: {
    question: 'Where should the rate limiter sit in the request flow?',
    options: [
      'After the app server processes the request',
      'Before the request reaches the app server',
      'Inside the database',
      'On the client side only',
    ],
    correctIndex: 1,
    explanation: 'The rate limiter must intercept requests BEFORE they reach the app server to prevent overload.',
  },
};

const step1: GuidedStep = {
  id: 'rate-limiter-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Clients need to reach the rate limiter service',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API clients', displayName: 'Client' },
      { type: 'app_server', reason: 'Rate limiter service', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send rate limit checks' },
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
// STEP 2: Implement Rate Limiting Logic (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your rate limiter is connected, but it's an empty shell.",
  hook: "Every request is getting through! We need to implement the actual rate limiting logic with Python code.",
  challenge: "Write the Python handlers that track request counts and enforce limits using a fixed window algorithm.",
  illustration: 'configure-server',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your rate limiter is now functional!",
  achievement: "Basic fixed window rate limiting is working",
  metrics: [
    { label: 'Algorithm', after: 'Fixed Window' },
    { label: 'Code written', after: '✓ Working' },
    { label: 'Can block requests', after: '✓' },
  ],
  nextTeaser: "But when the server restarts, all counters reset...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Fixed Window Algorithm',
  conceptExplanation: `The **Fixed Window** algorithm is the simplest rate limiting approach.

**How it works:**
1. Divide time into fixed windows (e.g., 1-minute chunks)
2. Count requests in the current window
3. Reset counter when window expires

**Example: 5 requests per minute**
- 12:00:00 - 12:00:59 → Window 1 (count: 0 → 5)
- 12:01:00 - 12:01:59 → Window 2 (count: resets to 0)

**Python implementation:**
\`\`\`python
def check_rate_limit(api_key, limit, window_seconds):
    current_window = int(time.time() / window_seconds)
    key = f"{api_key}:{current_window}"

    count = counters.get(key, 0)
    if count >= limit:
        return False  # Rate limited!

    counters[key] = count + 1
    return True  # Allowed
\`\`\``,
  whyItMatters: 'Without the code, your rate limiter does nothing. This Python implementation defines what happens when requests arrive.',
  realWorldExample: {
    company: 'GitHub API',
    scenario: 'Limits unauthenticated requests to 60/hour',
    howTheyDoIt: 'Uses fixed window counting with Redis counters that expire after the time window',
  },
  keyPoints: [
    'Fixed window: time divided into buckets (00:00-00:59, 01:00-01:59, etc.)',
    'Counter resets at window boundaries',
    'Simple to implement but has edge cases (see below)',
    'Can allow 2x limit at window boundaries!',
  ],
  diagram: `
Fixed Window Example: 5 req/minute limit

12:00:00           12:00:59  12:01:00           12:01:59
├──────────────────────────┤ ├──────────────────────────┤
│   ★★★★★ (5 requests)     │ │   ★★★★★ (5 requests)     │
└──────────────────────────┘ └──────────────────────────┘
         Window 1                      Window 2

⚠️ Edge case: User sends 5 requests at 12:00:59
              Then 5 more at 12:01:00
              = 10 requests in 1 second! (2x limit)
`,
  keyConcepts: [
    { title: 'Fixed Window', explanation: 'Time divided into equal buckets', icon: '🪟' },
    { title: 'Counter', explanation: 'Tracks requests in current window', icon: '🔢' },
    { title: 'Window Boundary', explanation: 'When counter resets (start of new window)', icon: '⏰' },
  ],
  quickCheck: {
    question: 'What is the main weakness of fixed window rate limiting?',
    options: [
      'It\'s too slow',
      'It can\'t track multiple clients',
      'It can allow 2x the limit at window boundaries',
      'It requires a database',
    ],
    correctIndex: 2,
    explanation: 'Fixed windows allow bursts at boundaries - 5 requests at 12:00:59 + 5 at 12:01:00 = 10 in 1 second.',
  },
};

const step2: GuidedStep = {
  id: 'rate-limiter-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Rate limiter must check and enforce limits with Python code',
    taskDescription: 'Configure API and implement the rate limiting handler',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'app_server', reason: 'Configure API and write Python code', displayName: 'App Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/check_limit API',
      'Open Python tab and implement the rate limiting handler',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click App Server to configure API, then switch to Python tab to write handler',
    level2: 'Assign the check_limit API, then implement check_rate_limit() function using fixed window algorithm',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Persistent Storage (Redis)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Crisis! Your rate limiter server just restarted.",
  hook: "All the counters were in memory... and now they're GONE! Every user's rate limit just reset. An attacker noticed and is flooding the API!",
  challenge: "We need persistent storage for our counters. And it must be FAST - Redis is perfect!",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '💎',
  message: "Your counters are now persistent!",
  achievement: "Rate limits survive server restarts",
  metrics: [
    { label: 'Storage', before: 'Memory (volatile)', after: 'Redis (persistent)' },
    { label: 'Survives restarts', after: '✓' },
    { label: 'Latency', after: '~1ms (still fast!)' },
  ],
  nextTeaser: "Good! But we still have that edge case problem...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Why Redis for Rate Limiting?',
  conceptExplanation: `**Why not just use in-memory counters?**
Problems:
1. Lost on restart
2. Can't share across multiple servers
3. No automatic expiration

**Why Redis is perfect:**
1. **Fast**: Sub-millisecond latency for GET/SET/INCR
2. **Atomic operations**: INCR is thread-safe, no race conditions
3. **TTL support**: Counters auto-expire after time window
4. **Distributed**: All app servers share the same counters
5. **Persistent**: Survives restarts (if configured)

**Redis commands for rate limiting:**
\`\`\`python
# Atomic increment
redis.incr(f"ratelimit:{api_key}:{window}")

# Set expiration (auto-cleanup)
redis.expire(f"ratelimit:{api_key}:{window}", 60)

# Get current count
count = redis.get(f"ratelimit:{api_key}:{window}")
\`\`\``,
  whyItMatters: 'Redis solves three critical problems: persistence, distributed counting, and automatic cleanup.',
  realWorldExample: {
    company: 'Stripe API',
    scenario: 'Rate limits millions of API requests per day',
    howTheyDoIt: 'Uses Redis clusters with atomic INCR operations and TTL-based expiration',
  },
  famousIncident: {
    title: 'Cloudflare Rate Limiter Outage',
    company: 'Cloudflare',
    year: '2020',
    whatHappened: 'A bug in their rate limiting system caused a cascading failure when Redis became overloaded. Legitimate traffic was blocked worldwide for 27 minutes.',
    lessonLearned: 'Rate limiters must fail open (allow traffic) when Redis is down, not fail closed (block everything).',
    icon: '☁️',
  },
  keyPoints: [
    'Redis INCR is atomic - no race conditions',
    'TTL auto-expires old counters (no manual cleanup)',
    'Sub-millisecond latency keeps rate limiter fast',
    'All app servers share the same Redis counters',
  ],
  diagram: `
┌─────────────┐       ┌─────────────┐       ┌────────────────┐
│   Client    │ ────▶ │ App Server  │ ────▶ │     Redis      │
└─────────────┘       └─────────────┘       │                │
                                            │ key_abc:12:00  │
                                            │   count: 47    │
                                            │   TTL: 45s     │
                                            └────────────────┘
                                            ↑
                           All servers share these counters!
`,
  keyConcepts: [
    { title: 'Atomic Operations', explanation: 'INCR is thread-safe, no locks needed', icon: '⚛️' },
    { title: 'TTL', explanation: 'Time-To-Live: auto-delete after N seconds', icon: '⏱️' },
    { title: 'Distributed', explanation: 'Multiple servers share the same counters', icon: '🌐' },
  ],
  quickCheck: {
    question: 'Why is Redis better than in-memory counters for rate limiting?',
    options: [
      'Redis is faster than memory',
      'Redis can share counters across servers and survive restarts',
      'Redis is cheaper',
      'Redis requires less code',
    ],
    correctIndex: 1,
    explanation: 'Redis provides distributed, persistent counters that all servers can access, solving the distributed rate limiting problem.',
  },
};

const step3: GuidedStep = {
  id: 'rate-limiter-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Counters must persist across restarts',
    taskDescription: 'Build Client → App Server → Redis',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API clients', displayName: 'Client' },
      { type: 'app_server', reason: 'Rate limiter service', displayName: 'App Server' },
      { type: 'cache', reason: 'Redis for counters', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send requests' },
      { from: 'App Server', to: 'Redis Cache', reason: 'Server reads/writes counters' },
    ],
    successCriteria: ['Add Client, App Server, Redis', 'Connect Client → App Server → Redis'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full path: Client → App Server → Redis Cache',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Upgrade to Sliding Window Algorithm
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🪟',
  scenario: "Your fixed window rate limiter is working, but there's a problem...",
  hook: "At 12:00:59, a user sends 100 requests. At 12:01:00, they send 100 more. That's 200 requests in 1 second! The window boundary allowed them to bypass the limit!",
  challenge: "Time to upgrade to a sliding window algorithm that prevents this edge case.",
  illustration: 'algorithm-upgrade',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Sliding window deployed!",
  achievement: "Rate limiting is now smooth and accurate",
  metrics: [
    { label: 'Algorithm', before: 'Fixed Window', after: 'Sliding Window' },
    { label: 'Boundary bursts', before: '2x limit possible', after: 'Prevented' },
    { label: 'Accuracy', after: '95%+' },
  ],
  nextTeaser: "Great! But what if we scale to multiple app servers?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Sliding Window Algorithm',
  conceptExplanation: `**Problem with Fixed Window:**
Window boundaries allow 2x bursts:
- 12:00:59: 100 requests ✓ (allowed)
- 12:01:00: 100 requests ✓ (new window!)
- Result: 200 requests in 1 second! (2x the limit)

**Sliding Window Solution:**
Instead of fixed windows, use a rolling time window:
- At 12:01:00: Look back 60 seconds (12:00:00 - 12:01:00)
- At 12:01:30: Look back 60 seconds (12:00:30 - 12:01:30)
- At 12:02:00: Look back 60 seconds (12:01:00 - 12:02:00)

**Implementation approaches:**

**1. Sliding Window Log** (Accurate but expensive)
- Store timestamp of every request
- Count requests in last N seconds
- Memory intensive: O(N) per client

**2. Sliding Window Counter** (Good balance)
- Weighted count from previous + current window
- Formula: \`prev_count × overlap% + curr_count\`
- Memory efficient: O(1) per client

**Example:**
Limit: 100 req/min, Current time: 12:00:30
- Previous window (11:59-12:00): 80 requests
- Current window (12:00-12:01): 40 requests
- Weighted count: 80 × 0.5 + 40 = 80 (50% overlap with prev)
- Under limit, allow!`,
  whyItMatters: 'Sliding windows prevent the 2x burst problem while being memory-efficient.',
  realWorldExample: {
    company: 'Twitter API',
    scenario: 'Rate limits at 300 requests per 15-minute window',
    howTheyDoIt: 'Uses sliding window counter algorithm with Redis for distributed counting',
  },
  keyPoints: [
    'Sliding window smooths out rate limiting across time',
    'Prevents 2x bursts at window boundaries',
    'Sliding window counter is most practical (memory efficient)',
    'Trade-off: ~5% less accurate than perfect log, but much cheaper',
  ],
  diagram: `
FIXED WINDOW:
12:00:00          12:00:59 | 12:01:00          12:01:59
[================Window 1=] [================Window 2=]
                 ★★★★★ (100) ★★★★★ (100)
                        ↑
                   200 in 1 second! ❌

SLIDING WINDOW:
                 12:00:59    12:01:59
                 [=====60 seconds====]
                 ★★★★★ (from W1) ★★★ (from W2)
                 = Only counts 80 requests ✓
`,
  keyConcepts: [
    { title: 'Sliding Window', explanation: 'Rolling time window that moves with current time', icon: '🎚️' },
    { title: 'Weighted Count', explanation: 'Partial count from previous window based on overlap', icon: '⚖️' },
    { title: 'Smoothing', explanation: 'Prevents sudden limit resets at boundaries', icon: '〰️' },
  ],
  quickCheck: {
    question: 'What problem does sliding window solve?',
    options: [
      'Makes rate limiting faster',
      'Prevents 2x burst attacks at window boundaries',
      'Reduces memory usage',
      'Makes Redis unnecessary',
    ],
    correctIndex: 1,
    explanation: 'Sliding window prevents users from exploiting fixed window boundaries to send 2x the allowed requests.',
  },
};

const step4: GuidedStep = {
  id: 'rate-limiter-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Rate limiting must prevent boundary bursts',
    taskDescription: 'Keep your architecture and upgrade the algorithm to sliding window',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API clients', displayName: 'Client' },
      { type: 'app_server', reason: 'Rate limiter with sliding window', displayName: 'App Server' },
      { type: 'cache', reason: 'Redis for counters', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'App Server', reason: 'Clients send requests' },
      { from: 'App Server', to: 'Redis Cache', reason: 'Server tracks counters' },
    ],
    successCriteria: ['Same architecture as Step 3', 'Algorithm upgraded to sliding window (conceptual)'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Keep the same architecture from Step 3',
    level2: 'Client → App Server → Redis Cache (same as before, algorithm upgrade is in code)',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }, { from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Scale with Multiple App Servers
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Success! Your rate limiter is protecting thousands of APIs.",
  hook: "But traffic is growing. One app server can't handle 30,000 rate limit checks per second. We need to scale out!",
  challenge: "Add a load balancer and multiple app server instances. Redis will keep counters synchronized across all servers.",
  illustration: 'horizontal-scaling',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your rate limiter is horizontally scalable!",
  achievement: "Multiple servers share Redis counters",
  metrics: [
    { label: 'Capacity', before: '10K checks/sec', after: '30K+ checks/sec' },
    { label: 'Servers', before: '1', after: 'Multiple' },
    { label: 'Shared counters', after: '✓ via Redis' },
  ],
  nextTeaser: "Perfect! But what if Redis becomes the bottleneck?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Rate Limiting',
  conceptExplanation: `**The Challenge:**
With multiple app servers, each server can't track its own limits:
- Server A: Allows 100 requests
- Server B: Allows 100 requests
- Server C: Allows 100 requests
- Total: 300 requests (3x the limit!) ❌

**The Solution: Shared Redis**
All servers check the SAME counter in Redis:
1. Request hits Server A
2. Server A: \`INCR user_123:minute_12\` in Redis
3. Redis returns: count = 85
4. Server A: Under limit, allow!

Even if the next request hits Server B, it sees count = 85 and continues counting from there.

**Why this works:**
- Redis is single-threaded → INCR is atomic
- All servers see the same counter
- No coordination needed between app servers
- Load balancer can use any algorithm (round-robin, least-conn, etc.)

**Important: Redis is now critical path!**
If Redis goes down, your rate limiter stops working. Plan for:
- Redis replication (primary + replica)
- Fail-open logic (allow requests if Redis is down)
- Connection pooling to avoid overwhelming Redis`,
  whyItMatters: 'Distributed systems need centralized counters. Redis is the synchronization point.',
  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Rate limits billions of requests across global edge network',
    howTheyDoIt: 'Each datacenter has Redis cluster, with eventual consistency across regions for global limits',
  },
  famousIncident: {
    title: 'GitHub API Rate Limit Bug',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'When GitHub scaled their API servers, a race condition in their rate limiting caused some users to hit limits incorrectly. The bug only appeared under high concurrency with multiple app servers.',
    lessonLearned: 'Always use atomic operations (like Redis INCR) for distributed counters. Regular increment-then-set has race conditions.',
    icon: '🐙',
  },
  keyPoints: [
    'Load balancer distributes checks across app servers',
    'All servers share Redis counters (single source of truth)',
    'Redis INCR is atomic - no race conditions',
    'If Redis fails, decide: fail open (allow) or fail closed (block)',
  ],
  diagram: `
                              ┌─────────────┐
                        ┌────▶│ App Server 1│────┐
                        │     └─────────────┘    │
┌────────┐   ┌─────────┐│     ┌─────────────┐    │   ┌─────────┐
│ Client │──▶│   LB    │┼────▶│ App Server 2│────┼──▶│  Redis  │
└────────┘   └─────────┘│     └─────────────┘    │   │         │
                        │     ┌─────────────┐    │   │ Counter │
                        └────▶│ App Server 3│────┘   │ Storage │
                              └─────────────┘        └─────────┘
                                                           ↑
                                  All servers share this counter!
`,
  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to increase capacity', icon: '↔️' },
    { title: 'Shared State', explanation: 'Redis as single source of truth for counters', icon: '🔗' },
    { title: 'Atomic INCR', explanation: 'Thread-safe counter increment in Redis', icon: '⚛️' },
  ],
  quickCheck: {
    question: 'Why do we need Redis when scaling to multiple app servers?',
    options: [
      'Redis is faster than in-memory storage',
      'To share counters across all servers (single source of truth)',
      'Load balancers require Redis',
      'Redis is cheaper than memory',
    ],
    correctIndex: 1,
    explanation: 'Redis provides a centralized counter that all app servers can read/write atomically, preventing each server from tracking separate limits.',
  },
};

const step5: GuidedStep = {
  id: 'rate-limiter-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle 30K checks/second',
    taskDescription: 'Build Client → Load Balancer → App Server → Redis',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API clients', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple rate limiter instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Shared Redis counters', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Redis Cache', reason: 'Servers share counters' },
    ],
    successCriteria: [
      'Build full architecture with Load Balancer',
      'Client → LB → App Server → Redis',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Build the full system with Load Balancer in front',
    level2: 'Client → Load Balancer → App Server, then App Server connects to Redis',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 6: Redis High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your phone rings. Redis crashed!",
  hook: "Without Redis, the rate limiter can't check ANY limits. The entire system is down! Attackers are flooding your APIs with millions of requests!",
  challenge: "Redis is a single point of failure. We need replication for high availability.",
  illustration: 'server-crash',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Your Redis is now highly available!",
  achievement: "Rate limiting survives Redis failures",
  metrics: [
    { label: 'Availability', before: '99%', after: '99.9%' },
    { label: 'Redis failover', before: 'Manual', after: 'Automatic' },
    { label: 'Data loss', before: 'High risk', after: 'Minimal' },
  ],
  nextTeaser: "Excellent! But can we reduce load on Redis?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Redis Replication for Rate Limiting',
  conceptExplanation: `**The Problem:**
If Redis crashes, your rate limiter is dead:
- Can't check limits
- Can't track counters
- API is wide open to abuse

**Solution: Redis Replication**

**Primary-Replica Setup:**
1. **Primary (Master)**: Handles all writes (INCR operations)
2. **Replicas (Slaves)**: Replicate data from primary
3. **Sentinel**: Monitors health, triggers failover

**How failover works:**
1. Primary Redis crashes
2. Sentinel detects failure (within seconds)
3. Sentinel promotes a replica to primary
4. App servers reconnect to new primary
5. Rate limiting continues!

**Important: Replication mode for rate limiting**

Use **async replication**:
- Primary writes don't wait for replicas
- Faster writes (critical for rate limiter speed)
- Risk: Recent counters might be lost on crash
- Acceptable: Missing a few seconds of counts is OK for rate limiting

**Alternative: Fail-open strategy**
If Redis is down:
\`\`\`python
try:
    count = redis.incr(key)
    return count <= limit
except RedisError:
    # Fail open: allow request
    # Better to allow some abuse than block all traffic
    return True
\`\`\``,
  whyItMatters: 'Redis is on the critical path for every request. Without HA, one disk failure takes down your entire API.',
  realWorldExample: {
    company: 'Lyft',
    scenario: 'Rate limits ride requests and driver API calls',
    howTheyDoIt: 'Redis Cluster with automatic failover. When a node fails, traffic shifts to healthy nodes within 2 seconds.',
  },
  keyPoints: [
    'Redis replication: Primary handles writes, replicas for failover',
    'Sentinel monitors health and auto-promotes replicas',
    'Async replication is fine for rate limiting (speed > perfect accuracy)',
    'Consider fail-open strategy to prevent total outage',
  ],
  diagram: `
                          ┌──────────────┐
                          │   Primary    │
                          │    Redis     │ ← All INCR writes
                          └──────┬───────┘
                                 │ Replication
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ Replica 1│ │ Replica 2│ │Sentinel  │
              │  (Read)  │ │  (Read)  │ │(Monitor) │
              └──────────┘ └──────────┘ └──────────┘

If Primary fails:
  1. Sentinel detects failure
  2. Promotes Replica 1 → Primary
  3. App servers reconnect
  4. Rate limiting continues!
`,
  keyConcepts: [
    { title: 'Failover', explanation: 'Automatic switch to replica when primary fails', icon: '🔄' },
    { title: 'Sentinel', explanation: 'Redis monitoring service that triggers failover', icon: '👁️' },
    { title: 'Fail-open', explanation: 'Allow requests when Redis is down (vs fail-closed)', icon: '🚪' },
  ],
  quickCheck: {
    question: 'Should rate limiting use sync or async Redis replication?',
    options: [
      'Sync - we need perfect consistency',
      'Async - speed is more important than perfect counts',
      'Neither - replication not needed',
      'It doesn\'t matter',
    ],
    correctIndex: 1,
    explanation: 'Async replication is faster and acceptable for rate limiting. Losing a few seconds of counts during failover is OK - speed matters more.',
  },
};

const step6: GuidedStep = {
  id: 'rate-limiter-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must survive Redis failures',
    taskDescription: 'Build full system and enable Redis replication',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API clients', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Rate limiter instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Redis with replication', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Redis Cache', reason: 'Servers check counters' },
    ],
    successCriteria: [
      'Build full architecture',
      'Click Redis → Enable replication with 2+ replicas',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheReplication: true,
  },
  hints: {
    level1: 'Build the full system, then configure Redis replication',
    level2: 'Add all components, connect them, then click Redis → Enable replication with 2+ replicas',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 7: Local Cache to Reduce Redis Load
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your rate limiter is working great, but Redis is getting hammered!",
  hook: "Every single request hits Redis. At 30K requests/sec, that's 30K Redis operations/sec! Can we reduce this load?",
  challenge: "Add a local in-memory cache to reduce Redis queries while still maintaining accurate limits.",
  illustration: 'optimization',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Redis load dramatically reduced!",
  achievement: "Local cache optimization deployed",
  metrics: [
    { label: 'Redis queries', before: '30K/sec', after: '5K/sec' },
    { label: 'Latency', before: '1ms', after: '0.1ms' },
    { label: 'Accuracy', before: '95%', after: '92% (acceptable!)' },
  ],
  nextTeaser: "Perfect! Now let's handle the cost...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Local Cache Optimization',
  conceptExplanation: `**The Problem:**
Every request hits Redis:
- 30K requests/sec = 30K Redis queries/sec
- Even at 1ms each, that's expensive
- Redis can become the bottleneck

**Solution: Local In-Memory Cache**

**Strategy: Cache recent limit checks**
\`\`\`python
# Check local cache first
cache_key = f"{api_key}:{window}"
if cache_key in local_cache:
    cached_count = local_cache[cache_key]
    if cached_count >= limit:
        return False  # Definitely over limit
    # Uncertain - fall through to Redis

# Check Redis
count = redis.incr(cache_key)
local_cache[cache_key] = count
return count <= limit
\`\`\`

**How it helps:**
1. Client makes 100 requests in 1 second
2. First request: Check Redis (count = 1)
3. Cache locally: "api_key_123 = 1"
4. Requests 2-100: Check local cache first!
5. If over limit locally, skip Redis entirely

**Important: TTL on local cache**
Set aggressive TTL (100-500ms):
- Prevents stale counts across multiple servers
- Still catches rapid bursts
- Expires quickly to sync with Redis

**Trade-offs:**
✅ Pros:
- 80-90% reduction in Redis queries
- 10x faster (0.1ms vs 1ms)
- Redis can handle more app servers

⚠️ Cons:
- Slightly less accurate (92% vs 95%)
- Can allow small bursts above limit
- More complex code

**For rate limiting, this trade-off is worth it!**`,
  whyItMatters: 'Local cache reduces Redis load by 80-90%, allowing you to scale to millions of requests/sec without overwhelming Redis.',
  realWorldExample: {
    company: 'Kong API Gateway',
    scenario: 'Handles millions of rate limit checks per second',
    howTheyDoIt: 'Uses local Nginx shared dict cache with 1-second TTL, syncing to Redis every second for distributed counting',
  },
  keyPoints: [
    'Local cache (in-memory) catches rapid repeated requests',
    'Only sync to Redis every N requests or N seconds',
    'Short TTL (100-500ms) keeps servers somewhat synchronized',
    'Trade accuracy for performance - acceptable for rate limiting',
  ],
  diagram: `
WITHOUT LOCAL CACHE:
Request 1 → Redis INCR (1ms)
Request 2 → Redis INCR (1ms)
Request 3 → Redis INCR (1ms)
...
Request 100 → Redis INCR (1ms)
= 100 Redis calls = 100ms total

WITH LOCAL CACHE:
Request 1 → Redis INCR (1ms) → Cache: count=1
Request 2 → Local cache (0.1ms) → count=1 (allow!)
Request 3 → Local cache (0.1ms) → count=1 (allow!)
...
Request 50 → Sync to Redis → count=50
Request 100 → Sync to Redis → count=100
= 3 Redis calls = 3ms total (97% reduction!)
`,
  keyConcepts: [
    { title: 'Local Cache', explanation: 'In-process memory cache (per app server)', icon: '💾' },
    { title: 'Cache TTL', explanation: 'Short expiration to sync with Redis', icon: '⏰' },
    { title: 'Performance Trade-off', explanation: 'Sacrifice 3% accuracy for 10x speed', icon: '⚖️' },
  ],
  quickCheck: {
    question: 'Why add a local cache if we already have Redis?',
    options: [
      'Redis is too expensive',
      'To reduce network calls to Redis and improve latency',
      'Local cache is more accurate',
      'Redis can\'t handle the load',
    ],
    correctIndex: 1,
    explanation: 'Local cache reduces Redis queries by 80-90%, cutting network latency from 1ms to 0.1ms and reducing load on Redis.',
  },
};

const step7: GuidedStep = {
  id: 'rate-limiter-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must handle 30K checks/sec efficiently',
    taskDescription: 'Keep architecture, add local cache optimization (conceptual)',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API clients', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Rate limiter with local cache', displayName: 'App Server' },
      { type: 'cache', reason: 'Redis for shared counters', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB forwards to servers' },
      { from: 'App Server', to: 'Redis Cache', reason: 'Servers sync to Redis' },
    ],
    successCriteria: ['Same architecture', 'Local cache optimization in code'],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Keep the same architecture, optimization is in code',
    level2: 'Client → LB → App Server (2+ instances) → Redis (replicated)',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 8: Final Exam - Production Validation
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎓',
  scenario: "Final Exam! Your rate limiter is ready for production.",
  hook: "Time to prove it can handle real-world scenarios: massive traffic, Redis failures, and strict latency requirements.",
  challenge: "Build a complete rate limiter that passes all 6 test cases while staying under budget.",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Production-ready rate limiter deployed!",
  achievement: "All test cases passed - you've mastered rate limiting!",
  metrics: [
    { label: 'Test Cases Passed', after: '6/6 ✓' },
    { label: 'Throughput', after: '30K checks/sec' },
    { label: 'Latency', after: 'p99 < 1ms' },
    { label: 'Availability', after: '99.9%' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade rate limiter. Try other challenges!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production Rate Limiter Checklist',
  conceptExplanation: `**What makes a production-ready rate limiter?**

✅ **Performance**
- p99 latency < 1ms (doesn't slow down APIs)
- Can handle 30K+ checks/sec
- Local cache reduces Redis load by 80%+

✅ **Accuracy**
- Sliding window prevents boundary bursts
- Redis atomic ops prevent race conditions
- 92-95% accuracy (acceptable trade-off)

✅ **Reliability**
- Redis replication for failover
- Fail-open strategy (allow traffic if Redis down)
- Health checks and monitoring

✅ **Scalability**
- Horizontal scaling with load balancer
- Shared Redis counters across all servers
- Local cache for efficiency

✅ **Cost Efficiency**
- Right-sized Redis instances
- Aggressive TTL to minimize storage
- Local cache reduces Redis instance needs

**Common pitfalls to avoid:**
❌ Using database instead of Redis (too slow)
❌ Fixed window without sliding (allows bursts)
❌ No replication (single point of failure)
❌ No local cache (Redis becomes bottleneck)
❌ Fail-closed strategy (blocks all traffic on Redis failure)`,
  whyItMatters: 'Production systems must handle edge cases, failures, and scale. This checklist ensures your rate limiter is ready.',
  realWorldExample: {
    company: 'AWS API Gateway',
    scenario: 'Rate limits millions of API calls per second globally',
    howTheyDoIt: 'Regional Redis clusters with local edge caching, automatic failover, and sophisticated algorithms (token bucket + sliding window hybrid)',
  },
  keyPoints: [
    'Performance: Local cache + Redis for speed',
    'Reliability: Replication + fail-open strategy',
    'Scalability: Horizontal scaling with shared state',
    'Cost: Optimize Redis with TTL and local cache',
  ],
  diagram: `
COMPLETE PRODUCTION ARCHITECTURE:

                        ┌──────────────┐
                   ┌───▶│ App Server 1 │───┐
                   │    │ + Local Cache│   │
┌────────┐   ┌────┴──┐ └──────────────┘   │   ┌──────────────┐
│ Client │──▶│  LB   │  ┌──────────────┐   ├──▶│ Redis Primary│
└────────┘   └────┬──┘ │ App Server 2 │   │   └──────┬───────┘
                   │    │ + Local Cache│───┘          │
                   └───▶└──────────────┘              │
                                              ┌───────┴────────┐
                                              ▼                ▼
                                        ┌──────────┐    ┌──────────┐
                                        │ Replica 1│    │ Replica 2│
                                        └──────────┘    └──────────┘

Features:
✅ Load balancer → High throughput
✅ Multiple app servers → Horizontal scaling
✅ Local cache → 10x faster checks
✅ Redis → Shared counters
✅ Replication → High availability
`,
  keyConcepts: [
    { title: 'Production-Ready', explanation: 'Handles failures, scales, and performs', icon: '🏭' },
    { title: 'Defense in Depth', explanation: 'Multiple layers: LB, local cache, Redis, replication', icon: '🛡️' },
    { title: 'Graceful Degradation', explanation: 'Fail-open to maintain availability', icon: '📉' },
  ],
  quickCheck: {
    question: 'What is the most important reliability feature for a production rate limiter?',
    options: [
      'Using the fastest algorithm',
      'Redis replication with fail-open strategy',
      'Perfect accuracy',
      'Lowest cost',
    ],
    correctIndex: 1,
    explanation: 'Reliability requires both Redis HA (replication) and graceful degradation (fail-open). Speed and accuracy matter, but availability is critical.',
  },
};

const step8: GuidedStep = {
  id: 'rate-limiter-step-8',
  stepNumber: 8,
  frIndex: 6,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Final Exam: Pass all production test cases',
    taskDescription: 'Build complete production-ready rate limiter',
    componentsNeeded: [
      { type: 'client', reason: 'API clients', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Traffic distribution', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Rate limiter instances', displayName: 'App Server' },
      { type: 'cache', reason: 'Redis with replication', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes checks' },
      { from: 'App Server', to: 'Redis Cache', reason: 'Shared counters' },
    ],
    successCriteria: [
      'Pass FR-1: Basic Rate Limiting (100 RPS)',
      'Pass FR-2: High Throughput (10K RPS)',
      'Pass FR-3: Burst Protection (sliding window)',
      'Pass NFR-P1: Latency (p99 < 1ms)',
      'Pass NFR-R1: Redis Failover',
      'Pass NFR-C1: Cost Budget ($500/month)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Build complete system with all optimizations',
    level2: 'LB + App Servers (2+) + Redis (replicated) - all configured for production',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const simpleRateLimiterGuidedTutorial: GuidedTutorial = {
  problemId: 'simple-rate-limiter-guided',
  problemTitle: 'Build a Production Rate Limiter',

  requirementsPhase: rateLimiterRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Rate Limiting',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Enforce basic rate limits: allow requests under limit, block requests over limit.',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 20,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'High Throughput',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Handle 10K rate limit checks per second without errors.',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Burst Protection',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Sliding window prevents boundary bursts (no 2x limit exploits).',
      traffic: { type: 'mixed', rps: 1000, readRps: 900, writeRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-P1: Ultra-Low Latency',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Maintain p99 latency under 1ms at 10K checks/sec.',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 1, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-R1: Redis Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Redis primary fails mid-test. System must failover with minimal downtime.',
      traffic: { type: 'mixed', rps: 5000, readRps: 4500, writeRps: 500 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 45, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 5, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Cost Efficiency',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet $500/month budget while sustaining 10K checks/sec.',
      traffic: { type: 'mixed', rps: 10000, readRps: 9000, writeRps: 1000 },
      duration: 60,
      passCriteria: { maxMonthlyCost: 500, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getSimpleRateLimiterGuidedTutorial(): GuidedTutorial {
  return simpleRateLimiterGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = rateLimiterRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= rateLimiterRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
