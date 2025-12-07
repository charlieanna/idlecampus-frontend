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
 * Global Rate Limiting Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching distributed rate limiting concepts
 * while building a global API gateway with rate limiting.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale globally with distributed rate limiting
 *
 * Key Concepts:
 * - Distributed rate limiting algorithms
 * - Token bucket vs sliding window
 * - Cross-region token synchronization
 * - Eventual consistency vs strong consistency
 * - Redis clusters for distributed state
 * - Clock synchronization challenges
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const globalRateLimitingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a global rate limiting system for a cloud API platform",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Staff Engineer at CloudAPI Inc.',
    avatar: '🧑‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What does this rate limiting system need to do?",
      answer: "API customers need to be prevented from exceeding their quotas:\n\n1. **Enforce request limits** - Block requests exceeding N requests per time window\n2. **Support multiple tiers** - Free (100 req/min), Pro (1000 req/min), Enterprise (custom)\n3. **Per-user tracking** - Each API key gets its own quota\n4. **Return quota info** - Headers showing remaining requests and reset time",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Rate limiting protects backend services from abuse and enables tiered pricing",
    },
    {
      id: 'global-consistency',
      category: 'functional',
      question: "If a user makes requests to different regions, should the quota be shared globally?",
      answer: "YES! This is critical. If a user has 1000 req/min quota and hits US-East for 500 requests, they should only have 500 remaining when they hit EU-West. The quota must be **globally coordinated** across all regions.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Global rate limiting requires distributed state synchronization across regions",
    },
    {
      id: 'accuracy',
      category: 'clarification',
      question: "How accurate does the rate limiting need to be?",
      answer: "We can tolerate **small overages** (5-10%) for performance. Perfect accuracy would require synchronous coordination across regions, which would add 100-200ms latency. Better to be fast and slightly inaccurate than slow and perfect.",
      importance: 'important',
      insight: "Trade-off: strict accuracy vs low latency. Most systems choose eventual consistency.",
    },
    {
      id: 'algorithm-choice',
      category: 'clarification',
      question: "What rate limiting algorithm should we use?",
      answer: "**Token bucket** is ideal:\n- Allows burst traffic (borrow future tokens)\n- Simple to implement in distributed systems\n- Widely adopted (AWS, Stripe, Twitter)\n\nAlternatives: Fixed window (simple but bursty), Sliding window (accurate but complex), Leaky bucket (strict but no bursts)",
      importance: 'critical',
      insight: "Token bucket balances accuracy, performance, and user experience",
    },
    {
      id: 'multi-region',
      category: 'scope',
      question: "How many regions should this system support?",
      answer: "We need **3-5 regions** globally (US-East, US-West, EU-West, Asia-Pacific, South America). Requests can come to any region, and rate limits must be coordinated globally.",
      importance: 'critical',
      insight: "Multi-region adds complexity: network latency, clock sync, and eventual consistency",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many API requests per second should we handle globally?",
      answer: "1 million requests per second across all regions, with potential spikes to 5 million during peak hours",
      importance: 'critical',
      calculation: {
        formula: "1M RPS ÷ 5 regions = 200K RPS per region",
        result: "~200K RPS per region average, 1M peak",
      },
      learningPoint: "Each rate limit check must complete in under 1ms to handle this scale",
    },
    {
      id: 'latency-check',
      category: 'latency',
      question: "How fast should the rate limit check be?",
      answer: "p99 under 5ms for the rate limit check. This is on the critical path of every API request - any delay directly impacts user experience.",
      importance: 'critical',
      learningPoint: "Rate limiting is on the hot path - must be extremely fast",
    },
    {
      id: 'sync-latency',
      category: 'latency',
      question: "How quickly should rate limit state sync across regions?",
      answer: "Within 100-200ms. We can tolerate eventual consistency with short propagation delays. A user making requests in rapid succession to different regions might briefly exceed their quota, but that's acceptable.",
      importance: 'important',
      learningPoint: "Async replication allows low latency while maintaining eventual global accuracy",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "What happens if rate limit state gets out of sync between regions?",
      answer: "Users might temporarily exceed their quota by 5-10% during the sync delay. This is acceptable. Strong consistency would require synchronous writes to all regions (200ms+ latency), which is unacceptable.",
      importance: 'important',
      learningPoint: "Rate limiting prioritizes availability and low latency over strict consistency",
    },
    {
      id: 'clock-sync',
      category: 'reliability',
      question: "What if server clocks are slightly out of sync across regions?",
      answer: "Use **logical timestamps** and **version vectors** instead of wall-clock time. NTP can drift by 100ms+, causing incorrect rate limit calculations. Logical clocks prevent this.",
      importance: 'critical',
      insight: "Never trust wall-clock time in distributed systems - use logical timestamps",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'global-consistency', 'algorithm-choice'],
  criticalFRQuestionIds: ['core-functionality', 'global-consistency'],
  criticalScaleQuestionIds: ['throughput-requests', 'latency-check', 'sync-latency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Enforce global rate limits',
      description: 'Block requests exceeding quota across all regions',
      emoji: '🛡️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Support tiered quotas',
      description: 'Different limits for Free, Pro, and Enterprise tiers',
      emoji: '🎯',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Per-user tracking',
      description: 'Each API key gets independent quota tracking',
      emoji: '🔑',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Return quota headers',
      description: 'Show remaining requests and reset time in response',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million API customers',
    writesPerDay: '86 billion rate limit checks',
    readsPerDay: '86 billion quota reads',
    peakMultiplier: 5,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 1000000, peak: 5000000 },
    calculatedReadRPS: { average: 1000000, peak: 5000000 },
    maxPayloadSize: '~500 bytes',
    storagePerRecord: '~200 bytes per API key',
    storageGrowthPerYear: '~100GB',
    redirectLatencySLA: 'p99 < 5ms (rate check)',
    createLatencySLA: 'p99 < 100ms (quota sync)',
  },

  architecturalImplications: [
    '✅ 1M RPS per region → In-memory cache critical (Redis)',
    '✅ p99 < 5ms → No database on critical path',
    '✅ Global consistency → Async replication across regions',
    '✅ Token bucket algorithm → Distributed counters with TTL',
    '✅ Clock sync issues → Use logical timestamps',
    '✅ Multi-region → Redis clusters with cross-region replication',
  ],

  outOfScope: [
    'Rate limiting for GraphQL (different complexity model)',
    'Dynamic quota adjustment based on system load',
    'Distributed denial of service (DDoS) protection',
    'Bot detection and blocking',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple single-region rate limiter with Redis. Once it works, we'll tackle the distributed challenges: cross-region sync, clock coordination, and eventual consistency. Functionality first, then global scale!",
};

// =============================================================================
// STEP 1: Connect Client to API Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚪',
  scenario: "Welcome to CloudAPI Inc! You're building the next-generation API gateway.",
  hook: "Thousands of API customers are making requests to your platform. You need to protect your backend services from overload.",
  challenge: "Set up the basic request flow so API clients can reach your gateway.",
  illustration: 'api-gateway',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your API gateway is online!',
  achievement: 'Clients can now send API requests to your gateway',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But there's no rate limiting yet - any client can overwhelm the system!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway: The Front Door',
  conceptExplanation: `An **API Gateway** is the single entry point for all API requests.

When a client makes an API call:
1. Request hits the **API Gateway**
2. Gateway performs rate limiting, auth, routing
3. If allowed, request is forwarded to backend services

The gateway is where we enforce rate limits BEFORE requests reach backend services.`,

  whyItMatters: 'Without rate limiting, a single malicious (or buggy) client can overwhelm your entire backend.',

  realWorldExample: {
    company: 'AWS API Gateway',
    scenario: 'Protecting millions of API endpoints',
    howTheyDoIt: 'Uses token bucket algorithm with distributed Redis for rate limit state',
  },

  keyPoints: [
    'Gateway is the single entry point for all API traffic',
    'Rate limiting happens here, before backend services',
    'Gateway is stateless - state stored in Redis',
  ],

  keyConcepts: [
    { title: 'API Gateway', explanation: 'Central entry point for API requests', icon: '🚪' },
    { title: 'Rate Limiting', explanation: 'Prevent clients from exceeding quotas', icon: '🛡️' },
  ],
};

const step1: GuidedStep = {
  id: 'rate-limit-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for rate limiting',
    taskDescription: 'Add Client and API Gateway, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'API customers making requests', displayName: 'Client' },
      { type: 'app_server', reason: 'API Gateway handling requests', displayName: 'API Gateway' },
    ],
    successCriteria: [
      'Client component added',
      'API Gateway added',
      'Client connected to API Gateway',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and API Gateway onto the canvas',
    level2: 'Connect Client to API Gateway by clicking Client then API Gateway',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Rate Limiting Logic (Python)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your gateway is accepting requests, but there's no protection!",
  hook: "A buggy client just sent 1 million requests in 10 seconds and crashed your backend. You need rate limiting NOW.",
  challenge: "Implement the token bucket algorithm in Python to enforce rate limits.",
  illustration: 'code-implementation',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Rate limiting is working!',
  achievement: 'Implemented token bucket algorithm',
  metrics: [
    { label: 'Algorithm', after: 'Token Bucket' },
    { label: 'Can enforce limits', after: '✓' },
    { label: 'Returns quota headers', after: '✓' },
  ],
  nextTeaser: "But the server restarts and all quota tracking is lost!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Token Bucket Algorithm: The Gold Standard',
  conceptExplanation: `**Token Bucket** is the most popular rate limiting algorithm.

**How it works:**
1. Each user has a bucket that holds N tokens (their quota)
2. Every request consumes 1 token
3. Tokens refill at rate R (e.g., 100 tokens/minute)
4. If bucket is empty, request is rejected (429 Too Many Requests)

**Example: 100 requests/minute**
- Bucket capacity: 100 tokens
- Refill rate: 100/60 = 1.67 tokens/second
- User can burst up to 100 requests instantly
- Then limited to ~2 requests/second sustained

**Why token bucket?**
- Allows bursts (good UX)
- Simple to implement
- Works well distributed
- Used by AWS, Stripe, Twitter`,

  whyItMatters: 'Token bucket balances strict limits with user experience - allows bursts while preventing sustained abuse.',

  famousIncident: {
    title: 'Twitter API Outage from Rate Limit Bug',
    company: 'Twitter',
    year: '2016',
    whatHappened: 'A bug in their rate limiting caused it to miscalculate token refills. Users were blocked incorrectly. The API was unusable for 6 hours.',
    lessonLearned: 'Rate limiting math must be precise. Test edge cases thoroughly.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Rate limiting payment API requests',
    howTheyDoIt: 'Token bucket with 100 requests/second per API key, allows bursts up to 1000',
  },

  diagram: `
Token Bucket (100 req/min)

Bucket: [🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙] (100 tokens)

Request 1 → ✅ Allowed (99 tokens left)
Request 2 → ✅ Allowed (98 tokens left)
...
Request 100 → ✅ Allowed (0 tokens left)
Request 101 → ❌ REJECTED (429 Too Many Requests)

After 1 minute: Bucket refills to 100 tokens
`,

  keyPoints: [
    'Each user gets a bucket with N tokens',
    'Requests consume tokens',
    'Tokens refill at constant rate',
    'Empty bucket = request rejected',
    'Allows bursts (borrow future tokens)',
  ],

  quickCheck: {
    question: 'Why does token bucket allow burst traffic while leaky bucket does not?',
    options: [
      'Token bucket is faster',
      'Token bucket lets users consume all tokens at once, leaky bucket enforces strict rate',
      'Token bucket uses less memory',
      'Token bucket is easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Token bucket allows consuming all tokens instantly (burst), while leaky bucket processes requests at strict constant rate.',
  },

  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Rate limit algorithm allowing bursts', icon: '🪣' },
    { title: 'Quota', explanation: 'Number of requests allowed per time window', icon: '🎯' },
    { title: 'Burst', explanation: 'Consuming multiple tokens at once', icon: '⚡' },
  ],
};

const step2: GuidedStep = {
  id: 'rate-limit-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Enforce rate limits with token bucket',
    taskDescription: 'Configure rate limiting APIs and implement Python token bucket logic',
    successCriteria: [
      'Click API Gateway to open inspector',
      'Assign GET /api/v1/* rate limiting middleware',
      'Open Python tab',
      'Implement check_rate_limit() using token bucket algorithm',
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
    level1: 'Click API Gateway, assign rate limiting middleware, then implement Python code',
    level2: 'Implement token bucket: track tokens and last_refill time, refill based on elapsed time, consume 1 token per request',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Redis for Distributed State
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "The API gateway crashed at 3 AM and restarted.",
  hook: "All rate limit state was LOST! Users who were rate-limited can now make unlimited requests again. Chaos!",
  challenge: "Add Redis to store rate limit state persistently and share it across gateway instances.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Rate limit state is now durable!',
  achievement: 'Redis stores token buckets across restarts',
  metrics: [
    { label: 'State persistence', after: 'Enabled' },
    { label: 'Survives restarts', after: '✓' },
    { label: 'Shared across instances', after: '✓' },
  ],
  nextTeaser: "But we're still single-region. What about global users?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Redis: Distributed Rate Limit State',
  conceptExplanation: `**Why Redis for rate limiting?**

1. **In-memory speed** - Reads/writes in < 1ms
2. **Distributed** - Multiple gateways share state
3. **TTL support** - Buckets auto-expire
4. **Atomic operations** - INCR, DECR are thread-safe
5. **Lua scripts** - Atomic multi-step operations

**Data structure in Redis:**
\`\`\`
Key: "rate_limit:api_key_123"
Value: {
  "tokens": 95,
  "last_refill": 1234567890,
  "quota": 100,
  "window": 60
}
TTL: 60 seconds (auto-cleanup)
\`\`\`

**Redis commands:**
- \`GET rate_limit:key\` - Check current tokens
- \`SET rate_limit:key {...}\` - Update bucket
- \`EXPIRE rate_limit:key 60\` - Auto-cleanup`,

  whyItMatters: 'Without persistent state, rate limits reset on every restart. Redis provides durability and sharing across gateway instances.',

  famousIncident: {
    title: 'GitHub API Rate Limit Bug',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'Their Redis cluster had a failover issue. Rate limit state was lost. For 30 minutes, rate limits were not enforced at all. API abuse spiked 10x.',
    lessonLearned: 'Rate limit state needs replication and failover. Single Redis instance is a single point of failure.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Rate limiting 10M+ requests/second',
    howTheyDoIt: 'Uses Redis clusters with replication. Each edge node has local Redis for low latency.',
  },

  diagram: `
┌──────────┐     ┌──────────────┐     ┌─────────┐
│ Client 1 │────▶│ Gateway 1    │────▶│  Redis  │
└──────────┘     └──────────────┘     │         │
                                       │ State:  │
┌──────────┐     ┌──────────────┐     │ key_123 │
│ Client 2 │────▶│ Gateway 2    │────▶│ key_456 │
└──────────┘     └──────────────┘     │ ...     │
                                       └─────────┘
                Both gateways share state!
`,

  keyPoints: [
    'Redis stores token buckets in memory (fast!)',
    'Multiple gateway instances share Redis',
    'TTL auto-expires old buckets (cleanup)',
    'Atomic operations prevent race conditions',
  ],

  quickCheck: {
    question: 'Why is Redis better than PostgreSQL for rate limiting?',
    options: [
      'Redis is cheaper',
      'Redis is in-memory (1ms) vs disk-based (10ms+)',
      'Redis has better replication',
      'Redis is more reliable',
    ],
    correctIndex: 1,
    explanation: 'Rate limiting is on the critical path of every request. Redis in-memory speed (< 1ms) is essential.',
  },

  keyConcepts: [
    { title: 'In-Memory', explanation: 'Data stored in RAM for ultra-fast access', icon: '⚡' },
    { title: 'TTL', explanation: 'Time-To-Live: auto-expire old data', icon: '⏰' },
    { title: 'Atomic', explanation: 'Operations complete all-or-nothing', icon: '⚛️' },
  ],
};

const step3: GuidedStep = {
  id: 'rate-limit-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent distributed state',
    taskDescription: 'Add Redis cache to store rate limit state',
    componentsNeeded: [
      { type: 'cache', reason: 'Store token buckets persistently', displayName: 'Redis' },
    ],
    successCriteria: [
      'Redis component added',
      'API Gateway connected to Redis',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag Redis cache onto canvas and connect Gateway to it',
    level2: 'Click API Gateway, then click Redis to create connection',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Add Load Balancer for Multiple Gateway Instances
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📈',
  scenario: "Your API is exploding in popularity! Traffic doubled overnight.",
  hook: "Your single gateway instance is at 100% CPU. API latency went from 10ms to 500ms. Customers are complaining!",
  challenge: "Add a load balancer to distribute traffic across multiple gateway instances.",
  illustration: 'traffic-spike',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Traffic is now distributed!',
  achievement: 'Multiple gateways share the load',
  metrics: [
    { label: 'Gateway instances', before: '1', after: '2+' },
    { label: 'Capacity', before: '10K RPS', after: '50K+ RPS' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "But what about users in Europe and Asia? They're getting 200ms latency!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Horizontal Scaling',
  conceptExplanation: `**Load Balancer** distributes API traffic across multiple gateway instances.

Benefits:
- **Higher throughput** - 2 instances = 2x capacity
- **High availability** - If one crashes, others handle traffic
- **Zero-downtime deploys** - Update one instance at a time

**Critical for rate limiting:**
- All gateways share Redis state
- Any gateway can enforce any user's rate limit
- Stateless design enables easy scaling

**Load balancing algorithms:**
- **Round Robin** - Distribute evenly
- **Least Connections** - Send to least busy instance
- **IP Hash** - Same client → same instance (sticky sessions)`,

  whyItMatters: 'At scale (200K RPS per region), a single gateway cannot handle the load. Horizontal scaling is essential.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Handling 100K+ API requests/second',
    howTheyDoIt: 'Dozens of API gateway instances behind load balancers in each region',
  },

  diagram: `
                    ┌─────────────┐
              ┌────▶│ Gateway 1   │────┐
              │     └─────────────┘    │
┌────────┐   │                         ▼
│ Client │──▶│  Load Balancer     ┌────────┐
└────────┘   │                     │ Redis  │
              │     ┌─────────────┐    │
              └────▶│ Gateway 2   │────┘
                    └─────────────┘

All gateways share Redis rate limit state
`,

  keyPoints: [
    'Load balancer distributes traffic across gateways',
    'Gateways are stateless - state in Redis',
    'Enables horizontal scaling',
    'Health checks detect failed instances',
  ],

  quickCheck: {
    question: 'Why can we easily add more gateway instances for rate limiting?',
    options: [
      'Because gateways are cheap',
      'Because gateways are stateless - all state is in Redis',
      'Because load balancers are fast',
      'Because Redis is replicated',
    ],
    correctIndex: 1,
    explanation: 'Stateless gateways can be added/removed freely since all rate limit state is in Redis.',
  },

  keyConcepts: [
    { title: 'Stateless', explanation: 'No local state - can add instances freely', icon: '🔄' },
    { title: 'Horizontal Scaling', explanation: 'Add more instances to increase capacity', icon: '📊' },
    { title: 'High Availability', explanation: 'System survives instance failures', icon: '🛡️' },
  ],
};

const step4: GuidedStep = {
  id: 'rate-limit-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add Load Balancer between Client and Gateway',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute API traffic', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client → Load Balancer → Gateway',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer between Client and Gateway',
    level2: 'Reconnect: Client → Load Balancer → Gateway → Redis',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Deploy Multiple Regions
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your API went global! But users in Europe are complaining about 200ms latency.",
  hook: "A user in Berlin hits your US-East region. The round-trip latency is killing their app performance!",
  challenge: "Deploy gateway instances in multiple regions (US-East, EU-West, Asia-Pacific) for low latency globally.",
  illustration: 'global-expansion',
};

const step5Celebration: CelebrationContent = {
  emoji: '🗺️',
  message: 'You are now globally distributed!',
  achievement: 'Low latency for users worldwide',
  metrics: [
    { label: 'Regions', before: '1 (US-East)', after: '3 (US, EU, Asia)' },
    { label: 'EU latency', before: '200ms', after: '20ms' },
    { label: 'Asia latency', before: '300ms', after: '30ms' },
  ],
  nextTeaser: "But now there's a problem: rate limits aren't coordinated across regions!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Deployment: Global Low Latency',
  conceptExplanation: `**Why multi-region?**
- Reduce latency for global users
- Improve availability (region failures)
- Comply with data residency laws

**Architecture per region:**
- Load Balancer
- Gateway instances
- Local Redis cluster

**Challenge:** Each region tracks rate limits independently!
- User hits US-East: 50 requests (50 tokens consumed)
- User hits EU-West: 50 requests (50 more tokens consumed)
- Total: 100 requests, but each region thinks it's only 50!

**Coming in next step:** Cross-region synchronization`,

  whyItMatters: 'Users expect < 50ms latency. Single-region architecture adds 100-300ms for distant users.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'API gateway in 200+ cities worldwide',
    howTheyDoIt: 'Each edge location has local rate limiting, synced globally via distributed consensus',
  },

  diagram: `
         US-EAST                 EU-WEST                ASIA-PAC
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ LB → Gateway        │  │ LB → Gateway        │  │ LB → Gateway        │
│       ↓             │  │       ↓             │  │       ↓             │
│    Redis (local)    │  │    Redis (local)    │  │    Redis (local)    │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

Problem: Each region has independent rate limit state!
User quota: 100 req/min
- Hits US: 50 requests ✅
- Hits EU: 50 requests ✅
- Total: 100 requests BUT should have been blocked at 100!
`,

  keyPoints: [
    'Deploy gateways in multiple regions for low latency',
    'Each region has local Redis for fast checks',
    'Problem: quotas not coordinated globally (yet!)',
    'Next step: cross-region synchronization',
  ],

  quickCheck: {
    question: 'What is the main problem with independent Redis per region?',
    options: [
      'Too expensive',
      'Too slow',
      'User can exceed global quota by hitting multiple regions',
      'Data can be lost',
    ],
    correctIndex: 2,
    explanation: 'Without coordination, users can consume their full quota in each region independently, exceeding global limits.',
  },

  keyConcepts: [
    { title: 'Multi-Region', explanation: 'Deploy in multiple geographic locations', icon: '🌍' },
    { title: 'Local Redis', explanation: 'Each region has own Redis for low latency', icon: '⚡' },
    { title: 'Quota Splitting', explanation: 'Challenge: coordinate quotas globally', icon: '🎯' },
  ],
};

const step5: GuidedStep = {
  id: 'rate-limit-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Global enforcement requires multi-region deployment',
    taskDescription: 'Configure multi-region deployment (conceptual - represented by Load Balancer)',
    successCriteria: [
      'System architecture supports multi-region (Load Balancer represents global distribution)',
      'Note: Next step will add cross-region coordination',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Your current architecture represents multi-region deployment',
    level2: 'Load Balancer represents global traffic distribution across regions. Next step adds cross-region sync.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Cross-Region Synchronization
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔄',
  scenario: "Users are exploiting the multi-region gap!",
  hook: "A user with 1000 req/min quota hit US for 1000 requests, then EU for 1000 more, then Asia for 1000 more. They made 3000 requests with a 1000 quota!",
  challenge: "Add cross-region synchronization so rate limits are enforced globally.",
  illustration: 'sync-problem',
};

const step6Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Global rate limiting is working!',
  achievement: 'Cross-region token synchronization implemented',
  metrics: [
    { label: 'Global consistency', after: 'Eventual (100ms)' },
    { label: 'Can exploit multi-region', before: 'Yes', after: 'No (5% overage max)' },
    { label: 'Sync latency', after: '<100ms' },
  ],
  nextTeaser: "But what if a region goes down?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cross-Region Token Synchronization',
  conceptExplanation: `**The Challenge:** How do we coordinate rate limits across regions without adding latency?

**Solution: Async Replication with Gossip Protocol**

1. **Local Fast Path** (1-5ms)
   - Gateway checks local Redis
   - If tokens available, allow request
   - Decrement tokens locally

2. **Async Sync** (50-100ms)
   - Every 50-100ms, regions gossip token consumption
   - US-East: "I consumed 50 tokens for user X"
   - EU-West: "I consumed 30 tokens for user X"
   - Asia: "I consumed 20 tokens for user X"
   - All regions update: Total consumed = 100 tokens

3. **Eventual Consistency**
   - During sync delay, user might exceed quota by 5-10%
   - Acceptable trade-off for low latency

**Algorithm:**
\`\`\`python
# Local check (fast!)
tokens_local = redis_local.get(api_key)
if tokens_local > 0:
    redis_local.decr(api_key)

    # Async: publish to other regions
    pubsub.publish("token_sync", {
        "api_key": api_key,
        "region": "us-east",
        "tokens_consumed": 1
    })
\`\`\``,

  whyItMatters: 'Synchronous cross-region writes add 100-200ms latency. Async sync keeps latency low while preventing major quota violations.',

  famousIncident: {
    title: 'AWS API Gateway Region Failover',
    company: 'AWS',
    year: '2020',
    whatHappened: 'During a region failover, rate limit state was briefly lost. For 5 minutes, rate limits were not enforced globally. Some users made 10x their quota.',
    lessonLearned: 'Cross-region sync needs failover handling. State must be recoverable.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Global rate limiting across 20+ regions',
    howTheyDoIt: 'Uses distributed counters with eventual consistency. Tolerates 5-10% overage during sync delays.',
  },

  diagram: `
US-EAST                       EU-WEST
┌─────────────┐              ┌─────────────┐
│ Redis Local │              │ Redis Local │
│ User X: 70  │ ◀────────▶   │ User X: 30  │
└─────────────┘    Gossip    └─────────────┘
      │           Every 50ms       │
      │                            │
      └────────────┬───────────────┘
                   ▼
         Global State (eventual):
         User X consumed: 100 tokens

Fast local check (1ms) + Async sync (50-100ms)
`,

  keyPoints: [
    'Local Redis for fast checks (1-5ms)',
    'Async gossip protocol syncs token consumption',
    'Eventual consistency: 50-100ms propagation',
    'Trade-off: 5-10% overage for low latency',
    'Critical: use logical timestamps, not wall-clock time',
  ],

  quickCheck: {
    question: 'Why use async replication instead of synchronous writes to all regions?',
    options: [
      'Async is more reliable',
      'Async is cheaper',
      'Async avoids 100-200ms cross-region latency on every request',
      'Async is easier to implement',
    ],
    correctIndex: 2,
    explanation: 'Synchronous cross-region writes add 100-200ms latency. Async replication keeps local checks fast (1-5ms).',
  },

  keyConcepts: [
    { title: 'Gossip Protocol', explanation: 'Peers exchange state updates asynchronously', icon: '💬' },
    { title: 'Eventual Consistency', explanation: 'State converges globally with delay', icon: '🔄' },
    { title: 'Logical Timestamp', explanation: 'Ordering events without clock sync', icon: '⏰' },
  ],
};

const step6: GuidedStep = {
  id: 'rate-limit-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-1: Global enforcement requires cross-region sync',
    taskDescription: 'Add Message Queue for cross-region token synchronization',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Sync token consumption across regions', displayName: 'Kafka (Cross-Region)' },
    ],
    successCriteria: [
      'Message Queue added',
      'Gateway connected to Message Queue',
      'Represents async cross-region gossip',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Message Queue for cross-region sync',
    level2: 'Connect Gateway to Message Queue - this represents async token sync gossip',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 7: Add Database for API Key Metadata & Audit Logs
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "Customer support is overwhelmed with rate limit questions.",
  hook: "A customer says: 'Why was I rate limited?' You have no audit trail! No way to see their historical quota usage or tier changes.",
  challenge: "Add a database to store API key metadata, tier info, and audit logs.",
  illustration: 'audit-requirement',
};

const step7Celebration: CelebrationContent = {
  emoji: '📜',
  message: 'Audit trail and metadata storage ready!',
  achievement: 'Can track quota history and tier changes',
  metrics: [
    { label: 'API key metadata', after: 'Stored' },
    { label: 'Audit logs', after: 'Enabled' },
    { label: 'Historical analysis', after: 'Possible' },
  ],
  nextTeaser: "Final step: make sure the system can handle failures!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database for Metadata & Audit Trail',
  conceptExplanation: `**Why do we need a database for rate limiting?**

Redis is great for real-time token counting, but we also need:

1. **API Key Metadata**
   - Which tier is this key? (Free, Pro, Enterprise)
   - Who owns this key? (customer info)
   - When was it created?
   - What's their quota? (100/min, 1000/min, custom)

2. **Audit Logs**
   - When was user X rate limited?
   - How many requests did they make?
   - Did their tier change?
   - Compliance and debugging

3. **Analytics**
   - What's the average quota usage per tier?
   - Which users are consistently hitting limits?
   - Should we recommend tier upgrades?

**Architecture:**
- Redis: Real-time token counting (hot path)
- Database: Metadata and audit logs (cold path)
- Gateway reads tier from DB on first request, caches in Redis`,

  whyItMatters: 'Without audit logs, you cannot debug rate limit issues or comply with regulations requiring access logs.',

  realWorldExample: {
    company: 'AWS',
    scenario: 'CloudTrail for API audit logs',
    howTheyDoIt: 'Every API call logged to S3/database for compliance. Rate limit events are audited for 90 days.',
  },

  diagram: `
┌────────────┐
│  Gateway   │
└─────┬──────┘
      │
      ├──────▶ Redis (Fast Path - Token Counting)
      │        - check_rate_limit() → 1-5ms
      │
      └──────▶ Database (Metadata & Audit)
               - Tier info (cached)
               - Audit logs (async write)
               - Historical analytics
`,

  keyPoints: [
    'Redis for real-time token counting (hot path)',
    'Database for metadata and audit logs (cold path)',
    'Cache tier info in Redis to avoid DB queries',
    'Async write audit logs (no latency impact)',
  ],

  quickCheck: {
    question: 'Why not store everything in the database instead of Redis?',
    options: [
      'Database is too expensive',
      'Database queries (10-50ms) are too slow for rate limit checks on every request',
      'Database cannot handle high write volume',
      'Database does not support TTL',
    ],
    correctIndex: 1,
    explanation: 'Rate limit checks are on the critical path. Database queries are 10-50ms vs Redis < 1ms. At 1M RPS, this difference is critical.',
  },

  keyConcepts: [
    { title: 'Hot Path', explanation: 'Critical path requiring ultra-low latency', icon: '🔥' },
    { title: 'Cold Path', explanation: 'Non-critical operations tolerating higher latency', icon: '❄️' },
    { title: 'Audit Log', explanation: 'Immutable record of all rate limit events', icon: '📜' },
  ],
};

const step7: GuidedStep = {
  id: 'rate-limit-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2, FR-3, FR-4: Need metadata storage for tiers and keys',
    taskDescription: 'Add Database for API key metadata and audit logs',
    componentsNeeded: [
      { type: 'database', reason: 'Store API key tiers and audit logs', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database added',
      'Gateway connected to Database',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Database for metadata and audit logs',
    level2: 'Connect Gateway to Database - used for tier info and audit trail',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 8: Add Redis Replication for High Availability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚨',
  scenario: "CRITICAL OUTAGE! Your Redis cluster crashed in US-East!",
  hook: "For 10 minutes, rate limiting was DISABLED. Malicious users flooded your backend with millions of requests. Backend services crashed. Total chaos!",
  challenge: "Add Redis replication so rate limiting survives failures.",
  illustration: 'redis-failure',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Global rate limiting system complete!',
  achievement: 'High availability, multi-region, globally coordinated',
  metrics: [
    { label: 'Redis availability', before: '99%', after: '99.99%' },
    { label: 'Rate limit accuracy', after: '95%+ (eventual consistency)' },
    { label: 'Latency p99', after: '<5ms' },
    { label: 'Global coordination', after: 'Enabled' },
  ],
  nextTeaser: "You've mastered global distributed rate limiting!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Redis Replication: High Availability for Rate Limiting',
  conceptExplanation: `**Why Redis replication is CRITICAL for rate limiting:**

If Redis goes down, rate limiting is disabled. Without rate limits:
- Malicious users can flood backend
- Backend services crash from overload
- Entire platform goes down

**Redis Replication Architecture:**
1. **Primary (Master)** - Handles all writes
2. **Replicas (Slaves)** - Stay in sync, handle reads
3. **Sentinel** - Monitors health, auto-failover

**Failover Process:**
1. Primary Redis crashes
2. Sentinel detects failure (within 1-2 seconds)
3. Sentinel promotes replica to primary
4. Gateways reconnect to new primary
5. Total downtime: < 5 seconds

**Replication Strategy:**
- **Async replication** - Low latency, eventual consistency
- Trade-off: May lose 1-2 seconds of writes during failover
- Acceptable: Better than 10 minutes of no rate limiting!`,

  whyItMatters: 'Single Redis = single point of failure. If Redis is down, rate limiting is disabled and your entire platform is vulnerable.',

  famousIncident: {
    title: 'Twitter API Outage from Redis Failure',
    company: 'Twitter',
    year: '2019',
    whatHappened: 'Their Redis cluster for rate limiting failed. For 2 hours, API rate limits were not enforced. Bots flooded the API, causing cascading failures across their infrastructure.',
    lessonLearned: 'Rate limiting infrastructure needs replication and failover. Test failover procedures regularly.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'API rate limiting with Redis',
    howTheyDoIt: 'Redis Cluster with 3 replicas per shard. Auto-failover via Redis Sentinel. 99.99% availability.',
  },

  diagram: `
┌────────────────────────────────────────────┐
│           REDIS HIGH AVAILABILITY          │
├────────────────────────────────────────────┤
│                                            │
│      ┌────────────┐                        │
│      │  Primary   │ ◀─── writes            │
│      │   Redis    │                        │
│      └──────┬─────┘                        │
│             │ Async Replication            │
│      ┌──────┴──────┬──────────┐            │
│      ▼             ▼          ▼            │
│  ┌────────┐   ┌────────┐ ┌────────┐       │
│  │Replica1│   │Replica2│ │Replica3│       │
│  └────────┘   └────────┘ └────────┘       │
│       │            │          │            │
│       └────────────┴──────────┘            │
│                    │                       │
│              ┌─────▼──────┐                │
│              │  Sentinel  │ ◀─── Health    │
│              │ (Failover) │      Monitor   │
│              └────────────┘                │
└────────────────────────────────────────────┘
`,

  keyPoints: [
    'Redis replication prevents single point of failure',
    'Sentinel enables automatic failover (< 5 seconds)',
    'Async replication: low latency, eventual consistency',
    'May lose 1-2 seconds of data during failover (acceptable)',
    'Critical: Test failover procedures regularly',
  ],

  quickCheck: {
    question: 'Why is async replication acceptable for rate limiting?',
    options: [
      'It is faster than sync replication',
      'Losing 1-2 seconds of rate limit data during failover is better than 10 minutes of downtime',
      'It is cheaper',
      'It is easier to implement',
    ],
    correctIndex: 1,
    explanation: 'Sync replication adds latency to every request. For rate limiting, brief data loss during failover is acceptable to maintain low latency.',
  },

  keyConcepts: [
    { title: 'Replication', explanation: 'Keep copies of data on multiple servers', icon: '📋' },
    { title: 'Failover', explanation: 'Automatic promotion of replica to primary', icon: '🔄' },
    { title: 'Sentinel', explanation: 'Service monitoring Redis health and coordinating failover', icon: '👁️' },
  ],
};

const step8: GuidedStep = {
  id: 'rate-limit-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs require high availability',
    taskDescription: 'Enable Redis replication for high availability',
    successCriteria: [
      'Click on Redis cache',
      'Enable replication',
      'Set replicas to 2+',
      'Configure async replication mode',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click Redis cache and enable replication',
    level2: 'Enable replication with 2+ replicas, async mode for low latency',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const globalRateLimitingGuidedTutorial: GuidedTutorial = {
  problemId: 'global-rate-limiting-guided',
  problemTitle: 'Build Global Rate Limiting - Distributed Systems at Scale',

  requirementsPhase: globalRateLimitingRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Rate Limiting',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Enforce basic rate limits (100 req/min) for API keys',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'Tiered Quotas',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Support multiple quota tiers (Free: 100/min, Pro: 1000/min)',
      traffic: { type: 'mixed', rps: 500, readRps: 500, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'Per-User Isolation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Ensure one user hitting limits does not affect others',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-P1: Low Latency Checks',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Rate limit checks must complete in < 5ms p99',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 5, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: High Throughput',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 200K RPS per region',
      traffic: { type: 'read', rps: 200000, readRps: 200000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Redis Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System survives Redis primary failure',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 30, recoverySecond: 35 },
      passCriteria: { minAvailability: 0.95, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Global Consistency',
      type: 'consistency',
      requirement: 'NFR-C1',
      description: 'Multi-region quota enforcement with < 10% overage',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 120,
      passCriteria: { maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export default globalRateLimitingGuidedTutorial;
