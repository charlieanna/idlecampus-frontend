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
 * API Rate Limit Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching rate limiting and caching patterns
 * for high-scale API systems.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working API with simple rate limiting (FR satisfaction)
 * Steps 4-7: Scale with advanced algorithms and distributed patterns (NFRs)
 *
 * Key Concepts:
 * - Token bucket algorithm
 * - Sliding window log
 * - Sliding window counter
 * - Distributed rate limiting with Redis
 * - Cache-aside pattern for API responses
 * - Rate limit headers and client feedback
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const apiRateLimitCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a high-performance API gateway with rate limiting and caching",

  interviewer: {
    name: 'Alex Morgan',
    role: 'Staff Engineer at CloudAPI Inc.',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What does this API gateway need to do at a high level?",
      answer: "The gateway sits in front of backend services and provides:\n\n1. **Route requests** - Forward API calls to appropriate backend services\n2. **Rate limit** - Prevent any single client from overwhelming the system\n3. **Cache responses** - Store frequently-accessed data to reduce backend load\n4. **Return clear feedback** - Tell clients their rate limit status",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "API gateways are the first line of defense against abuse and the first optimization for performance",
    },
    {
      id: 'rate-limit-granularity',
      category: 'functional',
      question: "What should we rate limit on - per user, per API key, per IP address?",
      answer: "**Per API key** is the standard approach. Each client gets an API key when they register, and we enforce limits like '1000 requests per hour per API key'. This is fairer than IP-based (VPNs share IPs) and more practical than user-based (users can have multiple devices).",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "API key-based rate limiting is industry standard for public APIs",
    },
    {
      id: 'rate-limit-feedback',
      category: 'functional',
      question: "When we reject a request for exceeding the rate limit, what do we tell the client?",
      answer: "Return HTTP 429 (Too Many Requests) with headers:\n- `X-RateLimit-Limit: 1000` (max requests allowed)\n- `X-RateLimit-Remaining: 0` (requests left)\n- `X-RateLimit-Reset: 1640995200` (unix timestamp when limit resets)\n- `Retry-After: 3600` (seconds until they can retry)\n\nThis is the industry standard used by Twitter, GitHub, Stripe, etc.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Rate limit headers help clients implement proper backoff strategies",
    },
    {
      id: 'cache-what',
      category: 'functional',
      question: "What types of API responses should we cache?",
      answer: "Cache **GET requests** for read-heavy endpoints like:\n- User profiles\n- Product catalogs\n- Public data that changes infrequently\n\n**Don't cache**:\n- POST/PUT/DELETE (write operations)\n- Personalized data\n- Real-time data\n- Responses with errors",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Only cache idempotent GET requests to avoid serving stale or incorrect data",
    },
    {
      id: 'multiple-limits',
      category: 'clarification',
      question: "Should different API endpoints have different rate limits?",
      answer: "Eventually yes, but for MVP let's use a **single global limit per API key** (e.g., 1000 req/hour). Later we can add per-endpoint limits (e.g., search: 100/hour, read: 1000/hour).",
      importance: 'important',
      insight: "Per-endpoint limits add complexity - good to defer for v2",
    },
    {
      id: 'burst-handling',
      category: 'clarification',
      question: "Should we allow bursts - like 100 requests in 1 second, then nothing for the rest of the hour?",
      answer: "Good question! This is the difference between **token bucket** (allows bursts) and **fixed window** (doesn't). Let's use **token bucket** - it's more user-friendly and what most APIs use. Allows natural traffic patterns.",
      importance: 'critical',
      insight: "Token bucket is the industry standard - flexible and burst-tolerant",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many API requests per second should the gateway handle?",
      answer: "50,000 requests per second at peak. That's about 4.3 billion requests per day.",
      importance: 'critical',
      calculation: {
        formula: "50,000 RPS × 86,400 sec = 4.3B requests/day",
        result: "~50K RPS peak, ~30K average",
      },
      learningPoint: "At this scale, even checking rate limits becomes a bottleneck",
    },
    {
      id: 'throughput-clients',
      category: 'throughput',
      question: "How many unique API keys (clients) do we need to support?",
      answer: "1 million active API keys. Each needs its own rate limit tracking.",
      importance: 'critical',
      learningPoint: "Storing rate limit state for 1M keys requires distributed storage",
    },
    {
      id: 'latency-overhead',
      category: 'latency',
      question: "How much latency can the gateway add to requests?",
      answer: "p99 should be under 10ms for rate limit check + cache lookup. The gateway is in the critical path - every millisecond matters for user experience.",
      importance: 'critical',
      learningPoint: "Rate limiting must be extremely fast - it's on every single request",
    },
    {
      id: 'latency-cache',
      category: 'latency',
      question: "How fast should cached responses be served?",
      answer: "p99 under 5ms. Cache hits should be 20-50x faster than going to the backend service.",
      importance: 'critical',
      calculation: {
        formula: "Backend: 100-200ms, Cache: 2-5ms",
        result: "40-100x speedup from caching",
      },
      learningPoint: "Caching is the #1 performance optimization for read-heavy APIs",
    },
    {
      id: 'consistency-rate-limits',
      category: 'consistency',
      question: "What if we have multiple gateway servers - how do we ensure rate limits are enforced consistently?",
      answer: "This is critical! We need **distributed rate limiting** using a shared Redis cluster. All gateway servers check/update the same rate limit counters. Without this, a client could send 1000 req/sec to each server.",
      importance: 'critical',
      learningPoint: "Distributed systems need centralized rate limit state",
    },
    {
      id: 'reliability-redis-failure',
      category: 'reliability',
      question: "What happens if Redis goes down - do we block all traffic?",
      answer: "No! We implement a **fail-open** strategy:\n1. If Redis is unreachable, log a warning\n2. Allow requests through (better than blocking all traffic)\n3. Monitor and alert\n\nAlternatively, use **local rate limiting** as fallback (less accurate but better than nothing).",
      importance: 'important',
      insight: "Rate limiting should degrade gracefully, not block all traffic",
    },
    {
      id: 'cache-invalidation',
      category: 'consistency',
      question: "How do we handle cache invalidation when backend data changes?",
      answer: "Use **TTL-based expiration** (e.g., 5 minutes). For critical data, use **cache invalidation events** - when data changes, publish an event to clear the cache. Most APIs use TTL-only for simplicity.",
      importance: 'important',
      learningPoint: "Cache invalidation is one of the two hard problems in computer science",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'rate-limit-granularity', 'burst-handling'],
  criticalFRQuestionIds: ['core-functionality', 'rate-limit-granularity'],
  criticalScaleQuestionIds: ['throughput-requests', 'consistency-rate-limits', 'latency-overhead'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Route API requests',
      description: 'Forward client requests to appropriate backend services',
      emoji: '🔀',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Rate limit per API key',
      description: 'Enforce limits like 1000 req/hour per API key using token bucket',
      emoji: '🚦',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Cache GET responses',
      description: 'Store frequently-accessed data to reduce backend load',
      emoji: '💾',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Return rate limit headers',
      description: 'Tell clients their limit, remaining requests, and reset time',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million API keys',
    writesPerDay: '2.6 billion requests',
    readsPerDay: '2.6 billion requests (50/50 read/write)',
    peakMultiplier: 2,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 30000, peak: 50000 },
    calculatedReadRPS: { average: 30000, peak: 50000 },
    maxPayloadSize: '~10KB (API response)',
    storagePerRecord: '~1KB (cached response)',
    storageGrowthPerYear: '~100TB (with TTL)',
    redirectLatencySLA: 'p99 < 10ms (rate limit + cache check)',
    createLatencySLA: 'p99 < 5ms (cache hit)',
  },

  architecturalImplications: [
    '✅ 50K RPS → Multiple gateway servers with load balancer',
    '✅ 1M API keys → Distributed rate limiting with Redis',
    '✅ p99 < 10ms → In-memory cache (Redis) required',
    '✅ Consistent rate limits → Shared Redis cluster across gateways',
    '✅ 50/50 read/write → Cache only GET requests',
    '✅ Token bucket → Store tokens + last refill time per key',
  ],

  outOfScope: [
    'Per-endpoint rate limits (global limits only)',
    'Authentication (assume API keys are valid)',
    'API analytics and monitoring dashboards',
    'GraphQL support (REST APIs only)',
    'WebSocket connections',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple gateway that routes requests and enforces basic rate limits in memory. Once that works, we'll add distributed Redis-based rate limiting and caching to handle real scale. Functionality first, then performance!",
};

// =============================================================================
// STEP 1: Connect Client to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to CloudAPI Inc! You've been hired to build a production API gateway.",
  hook: "Clients with API keys are ready to make requests to your backend services.",
  challenge: "Set up the basic flow: Client → API Gateway → Backend Service",
  illustration: 'gateway-foundation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your API gateway is online!',
  achievement: 'Requests can now flow through your gateway to backend services',
  metrics: [
    { label: 'Gateway status', after: 'Online' },
    { label: 'Can route requests', after: '✓' },
  ],
  nextTeaser: "But there's no rate limiting yet - clients can spam unlimited requests!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway Architecture',
  conceptExplanation: `An **API Gateway** is a reverse proxy that sits between clients and backend services.

**Why use a gateway?**
1. **Single entry point** - Clients don't need to know about individual services
2. **Cross-cutting concerns** - Rate limiting, caching, auth in one place
3. **Protocol translation** - HTTPS → gRPC, REST → GraphQL, etc.
4. **Load balancing** - Distribute requests across backend instances

**Flow:**
\`\`\`
Client → API Gateway → Backend Service
       (checks rate limit)
       (checks cache)
       (routes request)
\`\`\`

For this tutorial:
- **Client**: Applications using your API
- **Gateway**: Your App Server (we'll add logic here)
- **Backend**: The actual service (database, business logic)`,

  whyItMatters: 'Without a gateway, every backend service needs to implement rate limiting, caching, and auth separately. Gateway centralizes these concerns.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Handling billions of API requests per day',
    howTheyDoIt: 'Uses Zuul (their custom API gateway) to route requests, enforce rate limits, and handle 50,000+ requests/second',
  },

  keyPoints: [
    'Gateway is a reverse proxy in front of all backend services',
    'Centralizes rate limiting, caching, auth, and routing',
    'Must be extremely low-latency (in critical path)',
    'Can be scaled horizontally with load balancer',
  ],

  diagram: `
┌──────────┐         ┌──────────────┐         ┌──────────┐
│  Client  │ ──────▶ │ API Gateway  │ ──────▶ │ Backend  │
│ (Mobile/ │ ◀────── │  (App Server)│ ◀────── │ Service  │
│   Web)   │         └──────────────┘         └──────────┘
└──────────┘              │
                          │ Will add:
                          │ - Rate limiting
                          │ - Caching
                          │ - Headers
`,

  keyConcepts: [
    { title: 'Gateway', explanation: 'Centralized entry point for all API traffic', icon: '🚪' },
    { title: 'Reverse Proxy', explanation: 'Forwards requests to backend on behalf of clients', icon: '🔄' },
  ],
};

const step1: GuidedStep = {
  id: 'api-rate-limit-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'FR-1: Route API requests through gateway',
    taskDescription: 'Add Client, App Server (Gateway), and Backend Service - connect them in sequence',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API consumers', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as API Gateway', displayName: 'API Gateway' },
      { type: 'app_server', reason: 'Backend service being protected', displayName: 'Backend Service' },
    ],
    successCriteria: [
      'Client component added',
      'API Gateway (App Server) added',
      'Backend Service (App Server) added',
      'Client → Gateway → Backend connected',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'You need 3 components: Client, Gateway (App Server), and Backend (App Server)',
    level2: 'Connect them in sequence: Client → Gateway → Backend',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server', label: 'API Gateway' },
      { type: 'app_server', label: 'Backend Service' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Simple In-Memory Rate Limiting (Fixed Window)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔥',
  scenario: "Disaster! A rogue client just sent 1 million requests in 10 seconds.",
  hook: "Your backend crashed. Database connections exhausted. All users are seeing errors!",
  challenge: "Implement basic rate limiting in Python to protect your backend.",
  illustration: 'ddos-attack',
};

const step2Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Your API is now protected!',
  achievement: 'Basic rate limiting prevents abuse',
  metrics: [
    { label: 'Rate limit', after: '1000 req/hour per API key' },
    { label: 'Backend protected', after: '✓' },
  ],
  nextTeaser: "But the algorithm is too simple - it has a major flaw...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting Algorithms: Fixed Window',
  conceptExplanation: `**Fixed Window** is the simplest rate limiting algorithm.

**How it works:**
1. Divide time into fixed windows (e.g., 1-hour blocks)
2. Count requests per API key in current window
3. Reject if count > limit
4. Reset counter when window ends

**Implementation:**
\`\`\`python
# In memory: {api_key: {count: 50, window_start: 1640995200}}
def check_rate_limit(api_key, limit=1000):
    now = time.time()
    window_start = now - (now % 3600)  # Start of current hour

    if api_key not in rate_limits:
        rate_limits[api_key] = {'count': 0, 'window_start': window_start}

    data = rate_limits[api_key]

    # New window? Reset counter
    if data['window_start'] < window_start:
        data['count'] = 0
        data['window_start'] = window_start

    # Check limit
    if data['count'] >= limit:
        return False  # Rate limited!

    data['count'] += 1
    return True
\`\`\`

**Problem:** Boundary issue! A client can send 1000 requests at 10:59am and another 1000 at 11:01am = 2000 requests in 2 minutes!`,

  whyItMatters: 'Rate limiting is the first line of defense against abuse, DDoS attacks, and resource exhaustion.',

  famousIncident: {
    title: 'GitHub API Outage from Missing Rate Limits',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'A misconfigured CI system accidentally sent 100,000 API requests per minute to GitHub. Rate limits kicked in but the sheer volume overwhelmed their rate limit tracking system. API was down for 2 hours.',
    lessonLearned: 'Rate limiting infrastructure itself must be scalable and fast.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'Twitter API',
    scenario: 'Protecting against API abuse',
    howTheyDoIt: 'Rate limits per API key: 900 requests per 15 minutes for standard endpoints, with different limits for high-value endpoints',
  },

  diagram: `
Fixed Window (1 hour):
┌─────────────────────┬─────────────────────┐
│   Window 1 (10am)   │   Window 2 (11am)   │
│  Limit: 1000 req    │  Limit: 1000 req    │
├─────────────────────┼─────────────────────┤
│ 10:00 - 10:59       │ 11:00 - 11:59       │
│ Counter: 0 → 1000   │ Counter: 0 → 1000   │
└─────────────────────┴─────────────────────┘

Problem: 1000 req at 10:59 + 1000 req at 11:01 = 2000 in 2 minutes!
`,

  keyPoints: [
    'Fixed window is simple but has boundary problems',
    'Store counter per API key with window start time',
    'Reset counter when window changes',
    'Use in-memory dict for now (Redis comes later)',
  ],

  quickCheck: {
    question: 'What is the main problem with fixed window rate limiting?',
    options: [
      'It\'s too slow',
      'Clients can burst 2x the limit at window boundaries',
      'It requires too much memory',
      'It\'s too complex to implement',
    ],
    correctIndex: 1,
    explanation: 'Fixed window allows double the limit at boundaries - 1000 at end of window + 1000 at start of next = 2000 in short time.',
  },

  keyConcepts: [
    { title: 'Fixed Window', explanation: 'Count requests in fixed time blocks', icon: '📅' },
    { title: 'Counter', explanation: 'Number of requests in current window', icon: '🔢' },
    { title: 'Boundary Problem', explanation: 'Burst at window edge bypasses limit', icon: '⚠️' },
  ],
};

const step2: GuidedStep = {
  id: 'api-rate-limit-cache-step-2',
  stepNumber: 2,
  frIndex: 1,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-2: Rate limit per API key (basic)',
    taskDescription: 'Configure the Gateway with rate limiting API and implement fixed window algorithm in Python',
    successCriteria: [
      'Click on API Gateway',
      'Assign rate limiting endpoints',
      'Open Python tab',
      'Implement check_rate_limit() using fixed window algorithm',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Gateway → Configure APIs → Switch to Python tab',
    level2: 'Implement check_rate_limit() with fixed window: track count and window_start per API key',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Upgrade to Token Bucket Algorithm
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🪣',
  scenario: "Your CEO just got rate limited by your own API during a demo!",
  hook: "She made 1001 requests testing her app, and request #1001 failed even though it was spread over 2 hours. The fixed window algorithm is too strict!",
  challenge: "Upgrade to Token Bucket - a better algorithm that allows natural bursts.",
  illustration: 'token-bucket',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Token bucket is live!',
  achievement: 'Your rate limiting is now burst-tolerant and industry-standard',
  metrics: [
    { label: 'Algorithm', before: 'Fixed Window', after: 'Token Bucket' },
    { label: 'Allows bursts', before: '❌', after: '✓' },
    { label: 'Boundary problem', before: 'Yes', after: 'Fixed' },
  ],
  nextTeaser: "But all rate limits are in memory - what happens when the server restarts?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Token Bucket Algorithm: Industry Standard',
  conceptExplanation: `**Token Bucket** is the most widely used rate limiting algorithm (AWS, Stripe, Twitter, GitHub).

**How it works:**
Imagine a bucket that:
- Holds up to N tokens (capacity = rate limit)
- Tokens refill at a constant rate (e.g., 1000 tokens per hour = 0.277 tokens/sec)
- Each request consumes 1 token
- If bucket is empty → rate limited

**Implementation:**
\`\`\`python
def check_rate_limit_token_bucket(api_key, capacity=1000, refill_rate=0.277):
    """
    capacity: max tokens (e.g., 1000)
    refill_rate: tokens per second (e.g., 1000/hour = 0.277/sec)
    """
    now = time.time()

    if api_key not in buckets:
        buckets[api_key] = {
            'tokens': capacity,
            'last_refill': now
        }

    bucket = buckets[api_key]

    # Refill tokens based on time elapsed
    elapsed = now - bucket['last_refill']
    tokens_to_add = elapsed * refill_rate
    bucket['tokens'] = min(capacity, bucket['tokens'] + tokens_to_add)
    bucket['last_refill'] = now

    # Try to consume 1 token
    if bucket['tokens'] < 1:
        return False  # Rate limited!

    bucket['tokens'] -= 1
    return True
\`\`\`

**Advantages:**
✅ Allows natural bursts (use accumulated tokens)
✅ No boundary problem
✅ Smooths traffic over time
✅ Industry standard`,

  whyItMatters: 'Token bucket is flexible - allows bursts during low activity periods while still enforcing long-term limits.',

  famousIncident: {
    title: 'AWS API Gateway Rate Limiting',
    company: 'Amazon Web Services',
    year: 'Ongoing',
    whatHappened: 'AWS uses token bucket for ALL API Gateway rate limiting. During re:Invent 2021, a customer complained about hitting rate limits despite being "under" the limit. AWS explained token bucket mechanics and the customer realized they were bursting too frequently.',
    lessonLearned: 'Token bucket is fair but requires understanding - document how it works for your API users.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Stripe API',
    scenario: 'Processing payment API requests',
    howTheyDoIt: 'Uses token bucket with 100 requests/second per API key. Allows bursts up to 1000 tokens for legitimate traffic spikes.',
  },

  diagram: `
Token Bucket (capacity = 5, refill = 1 token/sec):

Time 0: Bucket has 5 tokens
┌────────────────┐
│ ⚫ ⚫ ⚫ ⚫ ⚫ │ 5 tokens
└────────────────┘

Request → consume 1 token:
┌────────────────┐
│ ⚫ ⚫ ⚫ ⚫    │ 4 tokens
└────────────────┘

Wait 3 seconds → refill 3 tokens:
┌────────────────┐
│ ⚫ ⚫ ⚫ ⚫ ⚫ │ 5 tokens (capped at capacity)
└────────────────┘

Burst scenario:
- Send 5 requests instantly → OK (use all 5 tokens)
- Send 6th request immediately → RATE LIMITED (no tokens left)
- Wait 1 second → 1 token refilled
- Send 7th request → OK
`,

  keyPoints: [
    'Tokens refill at constant rate (e.g., 0.277 tokens/sec for 1000/hour)',
    'Each request consumes 1 token',
    'Bucket capacity = max tokens = rate limit',
    'Allows bursts by using accumulated tokens',
    'Refill calculation: elapsed_time × refill_rate',
  ],

  quickCheck: {
    question: 'Why is token bucket better than fixed window?',
    options: [
      'It uses less memory',
      'It\'s faster to compute',
      'It allows bursts and has no boundary problem',
      'It\'s easier to implement',
    ],
    correctIndex: 2,
    explanation: 'Token bucket smoothly allows bursts during low-activity periods and has no window boundary issues.',
  },

  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Bucket refills at constant rate, requests consume tokens', icon: '🪣' },
    { title: 'Capacity', explanation: 'Max tokens = rate limit', icon: '📊' },
    { title: 'Refill Rate', explanation: 'How fast tokens are added (e.g., 0.277/sec)', icon: '⏱️' },
    { title: 'Burst Tolerance', explanation: 'Can use accumulated tokens for legitimate spikes', icon: '⚡' },
  ],
};

const step3: GuidedStep = {
  id: 'api-rate-limit-cache-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Rate limit per API key (token bucket)',
    taskDescription: 'Upgrade your Python code from fixed window to token bucket algorithm',
    successCriteria: [
      'Open Gateway Python tab',
      'Replace check_rate_limit() with token bucket implementation',
      'Track tokens, refill_rate, and last_refill per API key',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Token bucket tracks: tokens (current), capacity (max), refill_rate, last_refill',
    level2: 'Calculate tokens_to_add = elapsed_time × refill_rate, then bucket.tokens = min(capacity, tokens + tokens_to_add)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add Redis for Distributed Rate Limiting
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💥',
  scenario: "Your gateway crashed and restarted. All rate limit counters were RESET!",
  hook: "Clients who were already at their limit suddenly had fresh limits. They flooded the backend with 10x normal traffic. Backend is DOWN!",
  challenge: "Move rate limit state to Redis so it survives crashes and works across multiple gateway servers.",
  illustration: 'redis-distributed',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Rate limiting is now distributed!',
  achievement: 'Redis-based rate limits work across all gateway servers',
  metrics: [
    { label: 'Rate limit storage', before: 'In-memory', after: 'Redis' },
    { label: 'Survives restarts', before: '❌', after: '✓' },
    { label: 'Distributed', before: '❌', after: '✓' },
  ],
  nextTeaser: "Great! But API responses are still slow - every request hits the backend...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Distributed Rate Limiting with Redis',
  conceptExplanation: `**The Problem:**
With multiple gateway servers, in-memory rate limits don't work:
- Client sends 500 req to Gateway-1 (allowed)
- Client sends 500 req to Gateway-2 (allowed - different memory!)
- Total: 1000 requests, but limit is 500!

**The Solution: Redis**
All gateways share the same Redis for rate limit state.

**Implementation:**
\`\`\`python
def check_rate_limit_redis(api_key, capacity=1000, refill_rate=0.277):
    now = time.time()
    key = f"rate_limit:{api_key}"

    # Get current bucket state from Redis
    data = redis.hgetall(key)

    if not data:
        # First request - initialize
        tokens = capacity
        last_refill = now
    else:
        tokens = float(data['tokens'])
        last_refill = float(data['last_refill'])

    # Refill tokens
    elapsed = now - last_refill
    tokens_to_add = elapsed * refill_rate
    tokens = min(capacity, tokens + tokens_to_add)

    # Check limit
    if tokens < 1:
        return False

    # Consume token and save to Redis
    tokens -= 1
    redis.hset(key, mapping={
        'tokens': tokens,
        'last_refill': now
    })
    redis.expire(key, 7200)  # TTL: 2 hours

    return True
\`\`\`

**Benefits:**
✅ All gateways see same rate limits
✅ Survives gateway restarts
✅ Sub-millisecond latency (<1ms)
✅ Scales to millions of API keys`,

  whyItMatters: 'Without distributed rate limiting, clients can bypass limits by hitting different gateway servers.',

  famousIncident: {
    title: 'Cloudflare Rate Limit Bypass',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A bug in their distributed rate limiting allowed attackers to bypass limits by rapidly switching between edge servers. The attack sent 400,000 requests per second before the bug was patched.',
    lessonLearned: 'Distributed rate limiting MUST use shared state (Redis, Memcached) - never rely on local state alone.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'GitHub API',
    scenario: 'Enforcing rate limits across global infrastructure',
    howTheyDoIt: 'Uses Redis Cluster for rate limiting with sub-millisecond latency. Each API key\'s state is consistent worldwide.',
  },

  diagram: `
WITHOUT Redis (broken):
┌─────────┐                    ┌─────────┐
│Gateway 1│ limit: 500/hour    │Gateway 2│ limit: 500/hour
│ memory  │                    │ memory  │
└────┬────┘                    └────┬────┘
     │                              │
     └───────┬──────────────────────┘
             │
        ┌────┴─────┐
        │  Client  │ Can send 1000 total! (500 to each)
        └──────────┘


WITH Redis (correct):
┌─────────┐                    ┌─────────┐
│Gateway 1│ ──┐            ┌── │Gateway 2│
└─────────┘   │            │   └─────────┘
              ▼            ▼
        ┌─────────────────────┐
        │       Redis         │ limit: 500/hour (shared)
        │  rate_limit:key123  │
        └─────────────────────┘
             │
        ┌────┴─────┐
        │  Client  │ Total: 500 (enforced correctly)
        └──────────┘
`,

  keyPoints: [
    'Redis stores rate limit state shared across all gateway servers',
    'Use Redis HASH to store tokens + last_refill per API key',
    'Set TTL on keys (e.g., 2 hours) to auto-cleanup',
    'Redis latency is <1ms - fast enough for every request',
    'Handle Redis failures gracefully (fail-open or local fallback)',
  ],

  quickCheck: {
    question: 'Why do we need Redis for rate limiting in a multi-gateway setup?',
    options: [
      'Redis is faster than in-memory storage',
      'Redis uses less memory',
      'Multiple gateways need shared state to enforce limits correctly',
      'Redis is cheaper',
    ],
    correctIndex: 2,
    explanation: 'Without shared state, clients can bypass limits by sending requests to different gateways.',
  },

  keyConcepts: [
    { title: 'Distributed State', explanation: 'Shared storage across multiple servers', icon: '🌐' },
    { title: 'Redis HASH', explanation: 'Store multiple fields (tokens, last_refill) per key', icon: '🗂️' },
    { title: 'TTL', explanation: 'Auto-expire old keys to save memory', icon: '⏰' },
  ],
};

const step4: GuidedStep = {
  id: 'api-rate-limit-cache-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Distributed rate limiting across gateways',
    taskDescription: 'Add Redis cache and update Python code to use Redis for rate limit storage',
    componentsNeeded: [
      { type: 'cache', reason: 'Store rate limit state across gateways', displayName: 'Redis' },
    ],
    successCriteria: [
      'Add Cache (Redis) component',
      'Connect Gateway to Redis',
      'Update Python code to use Redis for rate limits',
    ],
  },

  celebration: step4Celebration,

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
    level1: 'Add Redis cache and connect Gateway to it',
    level2: 'Update Python: use redis.hgetall() to read, redis.hset() to write, redis.expire() for TTL',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Response Caching (Cache-Aside Pattern)
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your backend is getting hammered with the same GET requests over and over!",
  hook: "The user profile endpoint is called 10,000 times per minute, but the data only changes once per hour. Your database is at 90% CPU!",
  challenge: "Implement response caching to serve repeated GET requests from Redis instead of hitting the backend.",
  illustration: 'cache-aside',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'API responses are now lightning fast!',
  achievement: 'Cache-aside pattern reduces backend load by 80%',
  metrics: [
    { label: 'Cache hit rate', after: '85%' },
    { label: 'Response latency', before: '150ms', after: '5ms' },
    { label: 'Backend load', before: '100%', after: '20%' },
  ],
  nextTeaser: "But we only have one gateway server - it can't handle 50,000 RPS!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Response Caching: Cache-Aside Pattern',
  conceptExplanation: `**Cache-Aside Pattern** (also called Lazy Loading):

**Flow:**
1. Request comes in → Check cache first
2. **Cache HIT**: Return cached response (5ms)
3. **Cache MISS**:
   - Call backend (150ms)
   - Store response in cache
   - Return response

**Implementation:**
\`\`\`python
def get_response(endpoint, params):
    # 1. Generate cache key
    cache_key = f"api_cache:{endpoint}:{hash(params)}"

    # 2. Try cache first
    cached = redis.get(cache_key)
    if cached:
        return cached  # Cache HIT - fast!

    # 3. Cache MISS - call backend
    response = call_backend(endpoint, params)

    # 4. Store in cache with TTL
    redis.setex(cache_key, 300, response)  # 5 minute TTL

    return response
\`\`\`

**What to cache:**
✅ GET requests (idempotent reads)
✅ Public data (user profiles, catalogs)
✅ Infrequently changing data

**What NOT to cache:**
❌ POST/PUT/DELETE (writes)
❌ Personalized data (shopping cart)
❌ Real-time data (stock prices)
❌ Error responses`,

  whyItMatters: 'At 50,000 RPS, even a 50% cache hit rate reduces backend load from 50K to 25K - effectively doubling capacity.',

  famousIncident: {
    title: 'Reddit Cache Failure',
    company: 'Reddit',
    year: '2020',
    whatHappened: 'Their caching layer failed during high traffic. All requests hit the backend database directly. Database couldn\'t handle the load and crashed. Reddit was down for 4 hours.',
    lessonLearned: 'Caching isn\'t optional at scale - it\'s critical infrastructure. Always have cache redundancy.',
    icon: '🤖',
  },

  realWorldExample: {
    company: 'Twitter API',
    scenario: 'Serving timeline requests',
    howTheyDoIt: 'Caches timeline data aggressively with 30-second TTL. At peak, 95% of timeline requests are served from cache.',
  },

  diagram: `
Cache-Aside Pattern:

Request: GET /users/123
     │
     ▼
┌─────────────────────┐
│   Check Cache?      │ redis.get("api_cache:users:123")
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
 ┌────┐      ┌──────┐
 │HIT │      │ MISS │
 └─┬──┘      └──┬───┘
   │            │
   │            ▼
   │      ┌──────────┐
   │      │  Backend │ (slow: 150ms)
   │      │ Database │
   │      └─────┬────┘
   │            │
   │            ▼
   │      ┌──────────────┐
   │      │ Store in     │ redis.setex(key, 300, response)
   │      │ Cache (TTL)  │
   │      └─────┬────────┘
   │            │
   └────────────┴──────▶ Return response
`,

  keyPoints: [
    'Only cache GET requests (idempotent operations)',
    'Use cache key: endpoint + params hash',
    'Set appropriate TTL (5-10 minutes typical)',
    'Don\'t cache errors or personalized data',
    'Cache-aside = app controls caching logic',
  ],

  quickCheck: {
    question: 'Which requests should you cache in an API gateway?',
    options: [
      'All requests including POST/PUT/DELETE',
      'Only GET requests with non-personalized data',
      'Only requests from premium users',
      'Only requests that failed',
    ],
    correctIndex: 1,
    explanation: 'Only cache idempotent GET requests with non-personalized data to avoid serving stale or incorrect responses.',
  },

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'App checks cache, loads data on miss', icon: '🎯' },
    { title: 'Cache Key', explanation: 'Unique identifier: endpoint + params', icon: '🔑' },
    { title: 'TTL', explanation: 'Time-To-Live: auto-expire cached data', icon: '⏱️' },
    { title: 'Cache Hit Rate', explanation: '% of requests served from cache', icon: '📊' },
  ],
};

const step5: GuidedStep = {
  id: 'api-rate-limit-cache-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Cache GET responses to reduce backend load',
    taskDescription: 'Update Gateway Python code to implement cache-aside pattern for API responses',
    successCriteria: [
      'Open Gateway Python tab',
      'Implement get_response() with cache-aside logic',
      'Check Redis first, call backend on miss, store with TTL',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Implement cache-aside: check cache → if miss, call backend → store in cache → return',
    level2: 'Use redis.get(cache_key) for cache check, redis.setex(key, ttl, value) to store with expiration',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for Horizontal Scaling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "Success! Your API is popular. Traffic just hit 50,000 requests per second!",
  hook: "But your single gateway server can only handle 10,000 RPS. It's at 100% CPU. Requests are timing out!",
  challenge: "Add a load balancer and scale to multiple gateway instances.",
  illustration: 'load-balancer',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏗️',
  message: 'Your gateway is now horizontally scalable!',
  achievement: 'Load balancer distributes traffic across multiple gateways',
  metrics: [
    { label: 'Gateway capacity', before: '10K RPS', after: '50K+ RPS' },
    { label: 'Gateway instances', before: '1', after: '5+' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "Almost there! Let's add rate limit headers so clients know their status...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Horizontal Scaling',
  conceptExplanation: `**The Problem:**
One gateway server has limits:
- CPU: ~10,000 RPS per server
- Memory: ~1M concurrent connections
- Network: ~10 Gbps

At 50,000 RPS, you need 5 servers!

**The Solution: Load Balancer**
Distributes incoming requests across multiple gateway instances.

**Algorithms:**
1. **Round Robin**: Rotate through servers (simple, fair)
2. **Least Connections**: Send to server with fewest active connections
3. **IP Hash**: Same client → same server (useful for session affinity)

**For our API gateway:**
- Use **Round Robin** (stateless gateways, Redis has state)
- Health checks: Remove failed gateways automatically
- Auto-scaling: Add/remove gateways based on load

**Architecture:**
\`\`\`
Client → Load Balancer → Gateway 1 ─┐
                      → Gateway 2 ─┤→ Redis → Backend
                      → Gateway 3 ─┤
                      → Gateway 4 ─┤
                      → Gateway 5 ─┘
\`\`\`

All gateways share same Redis (rate limits + cache).`,

  whyItMatters: 'Load balancing enables horizontal scaling - add more servers to handle more traffic. Essential for high availability.',

  famousIncident: {
    title: 'AWS API Gateway Launch',
    company: 'Amazon Web Services',
    year: '2015',
    whatHappened: 'When AWS launched API Gateway, they underestimated adoption. Within weeks, customers were hitting their infrastructure limits. They had to rapidly scale from 100 to 1000+ gateway servers with load balancing.',
    lessonLearned: 'Plan for 10x growth. Load balancers and auto-scaling are essential from day one for API infrastructure.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Handling 10+ million RPS globally',
    howTheyDoIt: 'Uses Anycast + geographic load balancing. Requests are routed to nearest datacenter, then load balanced across hundreds of servers.',
  },

  diagram: `
                    ┌─────────────┐
                    │Load Balancer│
                    │  (Nginx/    │
                    │   HAProxy)  │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐       ┌─────────┐      ┌─────────┐
    │Gateway 1│       │Gateway 2│      │Gateway 3│
    │10K RPS  │       │10K RPS  │      │10K RPS  │
    └────┬────┘       └────┬────┘      └────┬────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           ▼
                    ┌─────────────┐
                    │    Redis    │ (shared state)
                    └─────────────┘
`,

  keyPoints: [
    'Load balancer distributes traffic across N gateway servers',
    'Each gateway can handle ~10K RPS',
    'Use round robin for stateless gateways',
    'All gateways share Redis for rate limits + cache',
    'Health checks automatically remove failed gateways',
  ],

  quickCheck: {
    question: 'Why can we use round robin load balancing for our gateways?',
    options: [
      'It\'s the fastest algorithm',
      'Gateways are stateless - all state is in Redis',
      'It uses the least memory',
      'It\'s required for rate limiting',
    ],
    correctIndex: 1,
    explanation: 'Since rate limits and cache are in Redis (not gateway memory), gateways are stateless and any gateway can handle any request.',
  },

  keyConcepts: [
    { title: 'Horizontal Scaling', explanation: 'Add more servers to increase capacity', icon: '📈' },
    { title: 'Round Robin', explanation: 'Distribute requests evenly across servers', icon: '🔄' },
    { title: 'Health Check', explanation: 'Monitor server status, remove failures', icon: '💓' },
    { title: 'Stateless', explanation: 'Server stores no data - any server can handle any request', icon: '🎯' },
  ],
};

const step6: GuidedStep = {
  id: 'api-rate-limit-cache-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from horizontal scaling',
    taskDescription: 'Add Load Balancer between Client and Gateway, configure multiple gateway instances',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across gateways', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Add Load Balancer component',
      'Client → Load Balancer → Gateway',
      'Configure Gateway for 5+ instances',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Add Load Balancer, reconnect Client → LB → Gateway',
    level2: 'Click Gateway, set instances to 5+. LB will distribute traffic across all instances.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Rate Limit Headers and Sliding Window Algorithm
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "Developers using your API are frustrated! When they get rate limited, they have no idea when they can retry.",
  hook: "They're blindly retrying every second, making the problem worse. Customer support is overwhelmed with complaints!",
  challenge: "Add rate limit headers (X-RateLimit-*) and upgrade to sliding window for smoother enforcement.",
  illustration: 'rate-limit-headers',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your API gateway is production-ready!',
  achievement: 'Industry-standard rate limiting with clear client feedback',
  metrics: [
    { label: 'Rate limit algorithm', before: 'Token bucket', after: 'Sliding window' },
    { label: 'Client feedback headers', after: '✓' },
    { label: 'Retry-After header', after: '✓' },
    { label: 'Production ready', after: '✓' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade API gateway!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limit Headers & Sliding Window Algorithm',
  conceptExplanation: `**Part 1: Rate Limit Headers (RFC 6585)**

Every response should include:
\`\`\`
X-RateLimit-Limit: 1000          # Max requests per window
X-RateLimit-Remaining: 347       # Requests left in current window
X-RateLimit-Reset: 1640995200    # Unix timestamp when limit resets
Retry-After: 3600                # Seconds to wait (if 429 error)
\`\`\`

**Part 2: Sliding Window Algorithm**

Better than token bucket - combines benefits of fixed window and sliding log.

**How it works:**
1. Track requests in current window and previous window
2. Weight previous window based on overlap
3. Smooth limit enforcement

**Formula:**
\`\`\`
current_count = requests_in_current_window
previous_count = requests_in_previous_window
window_overlap = (window_size - elapsed_in_current) / window_size

weighted_count = current_count + (previous_count × window_overlap)

if weighted_count < limit:
    allow request
else:
    reject (429 Too Many Requests)
\`\`\`

**Example (limit = 10/min):**
- 11:00:00 - 11:00:59: 8 requests (previous window)
- 11:01:00 - 11:01:30: 3 requests (current window, 30 sec elapsed)

Overlap = (60 - 30) / 60 = 0.5
Weighted = 3 + (8 × 0.5) = 3 + 4 = 7 requests
Remaining = 10 - 7 = 3 requests allowed`,

  whyItMatters: 'Rate limit headers help clients implement proper backoff. Sliding window provides smoother enforcement than fixed window or token bucket.',

  famousIncident: {
    title: 'Twitter API Rate Limit Confusion',
    company: 'Twitter',
    year: '2018',
    whatHappened: 'Twitter changed their rate limit headers format without clear documentation. Thousands of apps broke because they couldn\'t parse the new headers. Developers were angry.',
    lessonLearned: 'Rate limit headers are a contract with clients. Document them clearly and version changes carefully.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'GitHub API',
    scenario: 'Enforcing 5,000 requests per hour',
    howTheyDoIt: 'Uses sliding window with detailed headers. Also provides /rate_limit endpoint to check status without consuming quota.',
  },

  diagram: `
Sliding Window (limit = 10/min):

Previous Window          Current Window
11:00:00 - 11:00:59     11:01:00 - 11:01:30
     8 requests              3 requests
├───────────────────────┼──────────────┤
                        │    30 sec    │
                        │   elapsed    │

Overlap = (60 - 30) / 60 = 0.5

Weighted Count = 3 + (8 × 0.5) = 7

Remaining = 10 - 7 = 3


Headers in Response:
─────────────────────────────────────
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995260
`,

  keyPoints: [
    'Include X-RateLimit-* headers in EVERY response',
    'Sliding window = weighted average of current + previous window',
    'Smoother than token bucket, more accurate than fixed window',
    'Return 429 with Retry-After header when limit exceeded',
    'Helps clients implement intelligent backoff strategies',
  ],

  quickCheck: {
    question: 'Why are rate limit headers important for API clients?',
    options: [
      'They make requests faster',
      'They tell clients how many requests remain and when to retry',
      'They reduce server load',
      'They are required by law',
    ],
    correctIndex: 1,
    explanation: 'Headers give clients visibility into their quota, preventing blind retries and improving API experience.',
  },

  keyConcepts: [
    { title: 'X-RateLimit-*', explanation: 'Standard headers for rate limit status', icon: '📋' },
    { title: 'Sliding Window', explanation: 'Weighted average of current + previous window', icon: '📊' },
    { title: 'Retry-After', explanation: 'Tells client when to retry (seconds)', icon: '⏰' },
    { title: 'HTTP 429', explanation: 'Too Many Requests status code', icon: '🚫' },
  ],
};

const step7: GuidedStep = {
  id: 'api-rate-limit-cache-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-4: Return rate limit headers to guide clients',
    taskDescription: 'Update Gateway Python code to add rate limit headers and implement sliding window algorithm',
    successCriteria: [
      'Open Gateway Python tab',
      'Implement sliding window algorithm (track current + previous window)',
      'Add X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers',
      'Return 429 with Retry-After on limit exceeded',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Sliding window tracks 2 counters: current_window and previous_window',
    level2: 'Calculate overlap ratio, then weighted_count = current + (previous × overlap). Add headers to all responses.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const apiRateLimitCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'api-rate-limit-cache',
  title: 'Design API Gateway with Rate Limiting & Caching',
  description: 'Build a high-performance API gateway with distributed rate limiting and intelligent caching',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🚀',
    hook: "You've been hired as Lead Engineer at CloudAPI Inc!",
    scenario: "Your mission: Build an API gateway that can handle 50,000 requests per second while protecting backend services from abuse.",
    challenge: "Can you design a system with distributed rate limiting, intelligent caching, and sub-10ms latency?",
  },

  requirementsPhase: apiRateLimitCacheRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7],

  // Meta information
  concepts: [
    'API Gateway Architecture',
    'Fixed Window Rate Limiting',
    'Token Bucket Algorithm',
    'Sliding Window Algorithm',
    'Distributed Rate Limiting',
    'Redis for Shared State',
    'Cache-Aside Pattern',
    'Response Caching',
    'Rate Limit Headers',
    'Load Balancing',
    'Horizontal Scaling',
    'Fail-Open Strategies',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 5: Replication (Redis replication)',
    'Chapter 6: Partitioning (Distributed caching)',
    'Chapter 11: Stream Processing (Rate limiting algorithms)',
  ],
};

export default apiRateLimitCacheGuidedTutorial;
