import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Serverless Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching serverless architecture concepts
 * while building an API Gateway with Lambda functions.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (cold start optimization, API Gateway patterns, observability)
 *
 * Key Concepts:
 * - Lambda function lifecycle and cold starts
 * - API Gateway request routing and throttling
 * - Serverless scaling patterns
 * - Cost optimization for serverless
 * - VPC integration and security
 * - Observability and monitoring
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const serverlessGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Serverless API Gateway with Lambda integration",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Senior Cloud Architect',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What's the main purpose of this serverless API gateway?",
      answer: "The API Gateway needs to:\n\n1. **Route HTTP requests** to Lambda functions based on path/method\n2. **Execute Lambda functions** to process requests and return responses\n3. **Handle API versioning** - support multiple API versions simultaneously\n4. **Transform requests/responses** - modify headers, validate inputs",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "API Gateways are the front door to your serverless backend - routing, security, and transformation",
    },
    {
      id: 'lambda-invocation',
      category: 'functional',
      question: "How should the gateway invoke Lambda functions?",
      answer: "Support both **synchronous** (request-response) and **asynchronous** (fire-and-forget) invocations. For example:\n- GET /users → Sync (user waits for data)\n- POST /email → Async (trigger email, return immediately)",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Sync for real-time responses, async for long-running or background tasks",
    },
    {
      id: 'authentication',
      category: 'functional',
      question: "How should we handle API authentication and authorization?",
      answer: "Use **API keys** for MVP. Each client gets a unique API key. The gateway validates keys before invoking Lambda. We can add OAuth/JWT in v2.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "API keys are simple and effective for service-to-service auth",
    },
    {
      id: 'rate-limiting',
      category: 'clarification',
      question: "Should we rate-limit API requests?",
      answer: "Yes! Essential for cost control and abuse prevention. Implement:\n- Per-API-key rate limits (e.g., 1000 req/min)\n- Global throttling to protect Lambda concurrency\n- Return 429 when exceeded",
      importance: 'critical',
      insight: "Without rate limiting, a single client could trigger millions in Lambda costs",
    },
    {
      id: 'caching',
      category: 'clarification',
      question: "Should the gateway cache responses?",
      answer: "For GET requests, yes! Cache at the gateway level for:\n- Reduced Lambda invocations (cost savings)\n- Faster response times\n- Lower backend load\n\nCache TTL should be configurable per endpoint.",
      importance: 'important',
      insight: "Gateway caching can reduce Lambda invocations by 70-90% for read-heavy APIs",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many API requests per day should we handle?",
      answer: "50 million requests per day at steady state, with potential spikes to 200 million during traffic surges",
      importance: 'critical',
      calculation: {
        formula: "50M ÷ 86,400 sec = 579 req/sec average",
        result: "~579 RPS average, ~2,315 RPS peak",
      },
      learningPoint: "Serverless auto-scales, but you must plan for Lambda concurrency limits",
    },
    {
      id: 'cold-start-latency',
      category: 'latency',
      question: "What's acceptable latency for API requests?",
      answer: "p99 under 200ms for warm Lambda invocations. Cold starts can take 1-3 seconds, but should happen <5% of the time.",
      importance: 'critical',
      learningPoint: "Cold starts are the biggest challenge in serverless - we'll need warming strategies",
    },
    {
      id: 'lambda-concurrency',
      category: 'throughput',
      question: "How many concurrent Lambda executions do we need?",
      answer: "If average request duration is 100ms and we have 2,315 RPS peak:\n2,315 × 0.1s = ~232 concurrent executions\n\nAdd 50% buffer → ~350 concurrent Lambda executions",
      importance: 'critical',
      calculation: {
        formula: "Concurrency = RPS × Duration (seconds)",
        result: "350 concurrent executions needed",
      },
      learningPoint: "Lambda has account-level concurrency limits - default 1000, can request increase",
    },
    {
      id: 'consistency-requirements',
      category: 'consistency',
      question: "Do we need strong consistency for API responses?",
      answer: "For most APIs, **eventual consistency** is fine. But for critical operations like payments, we need strong consistency guarantees from the backend database.",
      importance: 'important',
      insight: "Lambda is stateless - consistency comes from your data layer (DynamoDB, Aurora, etc.)",
    },
    {
      id: 'cold-start-optimization',
      category: 'latency',
      question: "How can we minimize cold start impact?",
      answer: "Several strategies:\n1. **Provisioned concurrency** - Keep functions warm (costs more)\n2. **Scheduled warming** - Ping functions every 5 minutes\n3. **Lambda layers** - Share dependencies to reduce package size\n4. **Runtime optimization** - Use compiled languages (Go, Rust) vs interpreted (Python, Node)",
      importance: 'critical',
      insight: "Cold starts are unavoidable, but can be minimized through architecture",
    },
    {
      id: 'vpc-integration',
      category: 'security',
      question: "Should Lambda functions run in a VPC?",
      answer: "Only if accessing VPC resources (RDS, ElastiCache). VPC adds cold start time (~10s) and complexity. For public APIs accessing DynamoDB, no VPC needed.",
      importance: 'important',
      insight: "VPC is for security, not required for all serverless apps",
    },
    {
      id: 'observability',
      category: 'reliability',
      question: "How do we monitor and debug Lambda functions?",
      answer: "Essential tooling:\n1. **CloudWatch Logs** - All Lambda output\n2. **CloudWatch Metrics** - Duration, errors, throttles\n3. **X-Ray tracing** - End-to-end request tracing\n4. **Custom metrics** - Business KPIs",
      importance: 'critical',
      learningPoint: "Observability is harder in serverless - must be built in from day 1",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'lambda-invocation', 'cold-start-latency'],
  criticalFRQuestionIds: ['core-functionality', 'lambda-invocation'],
  criticalScaleQuestionIds: ['throughput-requests', 'cold-start-latency', 'lambda-concurrency'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Route requests to Lambda',
      description: 'API Gateway routes HTTP requests to appropriate Lambda functions',
      emoji: '🚦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Execute Lambda functions',
      description: 'Support sync and async Lambda invocations with proper responses',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: API versioning',
      description: 'Support multiple API versions (v1, v2) simultaneously',
      emoji: '📦',
    },
    {
      id: 'fr-4',
      text: 'FR-4: API key authentication',
      description: 'Validate API keys before invoking Lambda',
      emoji: '🔑',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 million API clients',
    writesPerDay: '50 million requests',
    readsPerDay: '50 million requests',
    peakMultiplier: 4,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 579, peak: 2315 },
    calculatedReadRPS: { average: 579, peak: 2315 },
    maxPayloadSize: '~10KB (API request)',
    storagePerRecord: 'N/A (stateless)',
    storageGrowthPerYear: 'N/A (logs only)',
    redirectLatencySLA: 'p99 < 200ms (warm start)',
    createLatencySLA: 'p99 < 3s (cold start)',
  },

  architecturalImplications: [
    '✅ High request volume → Need API Gateway caching and rate limiting',
    '✅ Cold starts <5% → Use provisioned concurrency for critical functions',
    '✅ 2,315 RPS peak → Reserve Lambda concurrency quota',
    '✅ Stateless → Store session data in DynamoDB or ElastiCache',
    '✅ Observability → CloudWatch + X-Ray essential for debugging',
    '✅ Cost control → Cache aggressively, use async where possible',
  ],

  outOfScope: [
    'OAuth/JWT authentication (v2)',
    'WebSocket APIs',
    'GraphQL support',
    'Custom domain names',
    'Multi-region deployment',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple API Gateway → Lambda flow that handles requests. The cold start optimizations and advanced patterns come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to API Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to CloudCorp! You've been hired to build a serverless API platform.",
  hook: "Your first task: Set up an API Gateway so clients can send requests to your serverless backend.",
  challenge: "Connect the Client to an API Gateway component.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your API Gateway is online!',
  achievement: 'Clients can now send requests to your serverless API',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the gateway doesn't know where to route requests yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway: The Front Door to Serverless',
  conceptExplanation: `An **API Gateway** is the entry point for all API requests in serverless architectures.

Think of it as a smart traffic controller that:
1. Receives HTTP requests from clients
2. Routes requests to the right backend (Lambda functions)
3. Handles authentication, rate limiting, caching
4. Returns responses to clients

**Why use API Gateway instead of direct Lambda calls?**
- Single endpoint for all APIs
- Built-in auth, throttling, caching
- Request/response transformation
- API versioning support
- Monitoring and metrics`,

  whyItMatters: 'API Gateway abstracts away the complexity of managing thousands of Lambda functions behind a clean REST API.',

  keyPoints: [
    'API Gateway is fully managed - no servers to maintain',
    'Handles millions of concurrent requests',
    'Pay per request ($3.50 per million requests)',
    'Automatically integrates with Lambda, DynamoDB, HTTP backends',
  ],

  keyConcepts: [
    { title: 'API Gateway', explanation: 'Managed service that routes HTTP requests to backends', icon: '🚪' },
    { title: 'REST API', explanation: 'Resource-based API using HTTP methods (GET, POST, etc.)', icon: '🔌' },
    { title: 'Serverless', explanation: 'No servers to manage - fully event-driven', icon: '☁️' },
  ],
};

const step1: GuidedStep = {
  id: 'serverless-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and API Gateway, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API consumers', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Routes requests to Lambda functions', displayName: 'API Gateway' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'API Gateway component added to canvas',
      'Client connected to API Gateway',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway'],
    requiredConnections: [{ fromType: 'client', toType: 'api_gateway' }],
  },

  hints: {
    level1: 'Drag a Client and API Gateway from the component palette onto the canvas',
    level2: 'Click the Client, then click the API Gateway to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }],
    solutionConnections: [{ from: 'client', to: 'api_gateway' }],
  },
};

// =============================================================================
// STEP 2: Add Lambda Functions for Request Processing
// =============================================================================

const step2Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your API Gateway is connected, but it doesn't have any backend to route to!",
  hook: "A client tried calling GET /api/users but got a 502 error - no Lambda function to handle it.",
  challenge: "Add Lambda functions to actually process the API requests.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your Lambda functions are deployed!',
  achievement: 'API Gateway can now route requests to serverless functions',
  metrics: [
    { label: 'Lambda functions', after: '1' },
    { label: 'Can process requests', after: '✓' },
  ],
  nextTeaser: "But when requests come in, the Lambda takes 3 seconds to respond the first time...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Lambda Functions: Serverless Compute',
  conceptExplanation: `**AWS Lambda** lets you run code without provisioning servers.

**How Lambda works:**
1. API Gateway receives request → /api/users
2. Gateway invokes Lambda function
3. Lambda executes your code (Node.js, Python, Go, etc.)
4. Lambda returns response → API Gateway → Client

**The Lambda Lifecycle:**
- **INIT phase**: Download code, start runtime, run init code (COLD START)
- **INVOKE phase**: Execute your handler function (WARM)
- **Shutdown**: After idle, function is destroyed

**Key characteristics:**
- Runs in isolated containers
- Auto-scales to handle load
- Pay per 100ms of execution time
- Max 15 minute execution time
- Stateless - no data persists between invocations`,

  whyItMatters: 'Lambda eliminates server management but introduces cold start challenges that we must address.',

  famousIncident: {
    title: 'AWS Lambda Cold Start Crisis',
    company: 'Robinhood',
    year: '2021',
    whatHappened: 'During peak trading hours, Robinhood\'s Lambda functions experienced massive cold starts due to traffic surge. API latencies spiked to 30+ seconds. Traders couldn\'t execute orders during critical market moments.',
    lessonLearned: 'Always use provisioned concurrency for latency-critical APIs. Monitor cold start rates religiously.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Encoding video thumbnails for millions of titles',
    howTheyDoIt: 'Lambda functions process video frames in parallel. They scale from 0 to 10,000+ concurrent executions in seconds.',
  },

  keyPoints: [
    'Lambda is event-driven - triggered by API Gateway, S3, DynamoDB, etc.',
    'Cold starts happen on first invocation or after idle timeout (~15 min)',
    'Warm starts reuse existing containers (milliseconds vs seconds)',
    'Concurrency limit: 1000 by default (can request increase)',
  ],

  keyConcepts: [
    { title: 'Cold Start', explanation: 'First invocation - download code, start runtime (1-3s)', icon: '❄️' },
    { title: 'Warm Start', explanation: 'Reuse existing container (10-100ms)', icon: '🔥' },
    { title: 'Concurrency', explanation: 'Number of function instances running simultaneously', icon: '📊' },
  ],

  quickCheck: {
    question: 'What causes a Lambda cold start?',
    options: [
      'Network latency',
      'First invocation or after idle timeout',
      'Database connection errors',
      'Too much traffic',
    ],
    correctIndex: 1,
    explanation: 'Cold starts occur when Lambda needs to initialize a new container - either first time or after being idle.',
  },
};

const step2: GuidedStep = {
  id: 'serverless-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2: Route and execute API requests',
    taskDescription: 'Add Lambda function and connect API Gateway to it',
    componentsNeeded: [
      { type: 'lambda', reason: 'Executes serverless code to process requests', displayName: 'Lambda Function' },
    ],
    successCriteria: [
      'Lambda component added to canvas',
      'API Gateway connected to Lambda',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'lambda'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'lambda' },
    ],
  },

  hints: {
    level1: 'Drag a Lambda Function component onto the canvas',
    level2: 'Click API Gateway, then click Lambda to create a connection',
    solutionComponents: [{ type: 'lambda' }],
    solutionConnections: [{ from: 'api_gateway', to: 'lambda' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Lambda State
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Your Lambda functions work, but they can't store or retrieve data!",
  hook: "GET /api/users returns empty because there's no database. POST /api/users succeeds but the data disappears!",
  challenge: "Lambda is stateless - add a database so functions can persist and query data.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Your serverless API can now persist data!',
  achievement: 'Lambda functions can read from and write to the database',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Stateful operations', after: '✓' },
  ],
  nextTeaser: "But database queries are slow, and cold starts are still taking 2+ seconds...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Serverless Data Layer: DynamoDB vs RDS',
  conceptExplanation: `Lambda is **stateless** - all data disappears after execution. You need a data layer.

**Two main options:**

**1. Amazon DynamoDB (Recommended for Serverless)**
- NoSQL, fully managed, serverless
- Auto-scales to handle any load
- Millisecond latency
- No connection pooling issues
- Pay per request

**2. Amazon RDS (Relational)**
- Traditional SQL (MySQL, PostgreSQL)
- Requires connection pooling (Lambda connection storm!)
- Fixed capacity, harder to scale
- Better for complex transactions

**For serverless APIs, DynamoDB wins because:**
- No connection limits (HTTP API)
- Auto-scales with Lambda
- No cold start penalty for connections
- Simpler operational model`,

  whyItMatters: 'Wrong database choice can make your serverless API slow and expensive.',

  famousIncident: {
    title: 'Lambda Connection Pool Exhaustion',
    company: 'Gilt',
    year: '2016',
    whatHappened: 'Gilt used Lambda + RDS for their flash sales API. Each Lambda created a new DB connection. During a sale, 5,000 concurrent Lambdas exhausted the RDS connection pool (max 500). The database refused new connections, causing total API failure.',
    lessonLearned: 'Use DynamoDB for Lambda, or use RDS Proxy to pool connections. Never connect directly from Lambda to RDS at scale.',
    icon: '🔌',
  },

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Search API serving millions of queries',
    howTheyDoIt: 'DynamoDB for fast key-value lookups, ElasticSearch for complex queries, all accessed via Lambda',
  },

  keyPoints: [
    'DynamoDB is the default choice for serverless applications',
    'RDS needs connection pooling (use RDS Proxy)',
    'Lambda reuses database connections when warm',
    'Keep database connections outside handler function for reuse',
  ],

  keyConcepts: [
    { title: 'DynamoDB', explanation: 'Serverless NoSQL database, auto-scales', icon: '🗃️' },
    { title: 'Connection Pooling', explanation: 'Reuse DB connections to avoid exhaustion', icon: '🔗' },
    { title: 'Stateless', explanation: 'Lambda stores nothing - all data in external storage', icon: '🔄' },
  ],
};

const step3: GuidedStep = {
  id: 'serverless-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent data storage',
    taskDescription: 'Add a Database and connect Lambda to it',
    componentsNeeded: [
      { type: 'database', reason: 'Stores application data persistently', displayName: 'DynamoDB' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'Lambda connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'lambda', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'lambda' },
      { fromType: 'lambda', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (DynamoDB) component onto the canvas',
    level2: 'Click Lambda, then click Database to create a connection',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'lambda', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache to Reduce Database Load
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your API is getting hammered with GET requests - 1000 requests per second!",
  hook: "Every request hits DynamoDB. Your database is at 90% capacity and costs are skyrocketing ($500/day in read units!)",
  challenge: "Add caching to reduce database load and speed up responses.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'API responses are now lightning fast!',
  achievement: 'Cache reduces database load by 80%',
  metrics: [
    { label: 'Response latency', before: '50ms', after: '5ms' },
    { label: 'DynamoDB reads', before: '1000/sec', after: '200/sec' },
    { label: 'Cache hit rate', after: '80%' },
    { label: 'Daily DB cost', before: '$500', after: '$100' },
  ],
  nextTeaser: "Great! But cold starts are still killing your p99 latency...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Serverless Caching Strategies',
  conceptExplanation: `**Three levels of caching for serverless:**

**1. API Gateway Caching**
- Cache responses at the gateway level
- Requests never reach Lambda (huge cost savings!)
- TTL-based (60 seconds - 1 hour)
- Best for: Public GET endpoints

**2. Lambda + ElastiCache (Redis)**
- Lambda connects to Redis cluster
- Sub-millisecond lookups
- Shared across all Lambda instances
- Best for: Session data, frequently accessed data

**3. Lambda Local Caching (in-memory)**
- Store data in Lambda container memory
- Ultra-fast (nanoseconds)
- Only available during warm starts
- Best for: Configuration, rarely-changing data

**For our API Gateway:**
- Use API Gateway caching for GET requests
- ElastiCache for shared state
- Lambda local cache for config`,

  whyItMatters: 'Caching reduces Lambda invocations (cost) and database queries (cost + latency). Can cut costs by 80-90%.',

  realWorldExample: {
    company: 'Slack',
    scenario: 'User profile lookups happening millions of times per hour',
    howTheyDoIt: 'Redis caching layer in front of database. Cache hit rate >95%. Cuts database load by 20x.',
  },

  keyPoints: [
    'API Gateway cache is cheapest - no Lambda invocation',
    'ElastiCache requires VPC (adds cold start time)',
    'Lambda local cache is free but only works for warm starts',
    'Set appropriate TTL based on data freshness requirements',
  ],

  diagram: `
┌────────┐     ┌──────────────┐
│ Client │────▶│ API Gateway  │
└────────┘     │   + Cache    │ ← 80% requests end here!
               └──────┬───────┘
                      │ 20% cache miss
                      ▼
               ┌──────────────┐     ┌───────────┐
               │    Lambda    │────▶│   Redis   │
               └──────┬───────┘     └───────────┘
                      │
                      ▼
               ┌──────────────┐
               │   DynamoDB   │
               └──────────────┘
`,

  keyConcepts: [
    { title: 'API Gateway Cache', explanation: 'Cache responses at gateway - no Lambda invocation', icon: '🚪' },
    { title: 'ElastiCache', explanation: 'Managed Redis/Memcached for shared caching', icon: '📦' },
    { title: 'TTL', explanation: 'Time-To-Live - how long cached data remains valid', icon: '⏰' },
  ],

  quickCheck: {
    question: 'What\'s the main benefit of API Gateway caching?',
    options: [
      'Reduces database connections',
      'Requests never reach Lambda - huge cost savings',
      'Improves security',
      'Makes cold starts faster',
    ],
    correctIndex: 1,
    explanation: 'API Gateway cache serves responses without invoking Lambda at all, saving both Lambda costs and database queries.',
  },
};

const step4: GuidedStep = {
  id: 'serverless-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from reduced latency and cost',
    taskDescription: 'Add a Cache component and connect Lambda to it',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache frequent queries to reduce DB load', displayName: 'ElastiCache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'Lambda connected to Cache',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'lambda', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'lambda' },
      { fromType: 'lambda', toType: 'database' },
      { fromType: 'lambda', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (ElastiCache) component onto the canvas',
    level2: 'Connect Lambda to Cache. This allows Lambda to check cache before querying database.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'lambda', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Enable Provisioned Concurrency for Cold Start Optimization
// =============================================================================

const step5Story: StoryContent = {
  emoji: '❄️',
  scenario: "Your API metrics show a problem: p99 latency is 2.5 seconds!",
  hook: "Digging into CloudWatch, you find 5% of requests experience cold starts that take 2-3 seconds. Users are complaining about slow responses.",
  challenge: "Configure provisioned concurrency to keep Lambda functions warm and eliminate cold starts.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '🔥',
  message: 'Cold starts eliminated!',
  achievement: 'Provisioned concurrency keeps functions warm',
  metrics: [
    { label: 'p99 latency', before: '2500ms', after: '150ms' },
    { label: 'Cold start rate', before: '5%', after: '<0.1%' },
    { label: 'User satisfaction', before: '85%', after: '98%' },
  ],
  nextTeaser: "Perfect! But we need to protect against API abuse and traffic spikes...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cold Start Optimization: Provisioned Concurrency',
  conceptExplanation: `**The Cold Start Problem:**
- First request to a Lambda (or after idle) takes 1-3 seconds
- Lambda must download code, start runtime, initialize
- For user-facing APIs, this is unacceptable!

**Solutions ranked by effectiveness:**

**1. Provisioned Concurrency (Best for latency-critical APIs)**
- Keeps N instances always warm and ready
- Sub-100ms response times guaranteed
- Costs: Pay for provisioned capacity even when idle
- Use for: Production APIs with strict SLA

**2. Scheduled Warming (Good, but imperfect)**
- Lambda pings itself every 5 minutes
- Keeps function warm during business hours
- Cheaper than provisioned concurrency
- Risk: Can still cold start if concurrent requests exceed warm instances

**3. Code Optimization (Always do this!)**
- Minimize package size (use Lambda Layers for dependencies)
- Use compiled languages (Go, Rust) instead of interpreted (Python, Node)
- Lazy-load dependencies
- Move initialization code outside handler

**4. Accept Cold Starts (For async/non-critical workloads)**
- Batch processing, scheduled jobs, webhooks
- Users don't notice the delay`,

  whyItMatters: 'Cold starts are the #1 complaint about serverless. Provisioned concurrency solves it but increases cost 3-5x.',

  famousIncident: {
    title: 'Figma\'s Lambda Cold Start Nightmare',
    company: 'Figma',
    year: '2020',
    whatHappened: 'Figma\'s real-time collaboration used Lambda. During peak hours, cold starts caused 5-10 second delays in cursor updates. Users thought the app was broken. Figma spent weeks optimizing cold starts.',
    lessonLearned: 'For real-time, latency-sensitive features, either use provisioned concurrency or don\'t use Lambda.',
    icon: '🎨',
  },

  realWorldExample: {
    company: 'Capital One',
    scenario: 'Credit card authorization API - must respond in <100ms',
    howTheyDoIt: 'Full provisioned concurrency on critical Lambda functions. Costs more but guarantees sub-100ms p99.',
  },

  keyPoints: [
    'Provisioned concurrency = pre-warmed Lambda instances',
    'Trade-off: Consistent latency vs higher cost',
    'Configure based on traffic patterns (higher during business hours)',
    'Always optimize code size regardless of provisioning strategy',
  ],

  diagram: `
WITHOUT Provisioned Concurrency:
Request → Cold Start (2s) → Process (50ms) → Response
         ❄️ SLOW!

WITH Provisioned Concurrency:
Request → Warm Instance (5ms) → Process (50ms) → Response
         🔥 FAST!

Cost Comparison:
On-demand: $0.20 per 1M requests × 100ms
Provisioned: $0.20 per 1M requests + $0.015/hour per GB
            (3-5x more expensive but predictable latency)
`,

  keyConcepts: [
    { title: 'Provisioned Concurrency', explanation: 'Pre-warmed Lambda instances always ready', icon: '🔥' },
    { title: 'Lambda Layers', explanation: 'Share code/dependencies across functions to reduce size', icon: '📚' },
    { title: 'Initialization', explanation: 'Code outside handler runs once per container', icon: '🚀' },
  ],

  quickCheck: {
    question: 'When should you use provisioned concurrency?',
    options: [
      'Always - it makes everything faster',
      'For latency-critical APIs with strict SLA requirements',
      'For batch processing jobs',
      'For functions that run once per day',
    ],
    correctIndex: 1,
    explanation: 'Provisioned concurrency is expensive. Use it only for latency-critical, user-facing APIs where cold starts are unacceptable.',
  },
};

const step5: GuidedStep = {
  id: 'serverless-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs must meet p99 latency SLA',
    taskDescription: 'Configure Lambda with provisioned concurrency',
    successCriteria: [
      'Click on Lambda component',
      'Enable provisioned concurrency in configuration',
      'Set provisioned instances to at least 5',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'lambda', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'lambda' },
      { fromType: 'lambda', toType: 'database' },
      { fromType: 'lambda', toType: 'cache' },
    ],
    requireProvisionedConcurrency: true,
  },

  hints: {
    level1: 'Click on the Lambda function component to open its configuration panel',
    level2: 'Find the provisioned concurrency setting and enable it with at least 5 instances',
    solutionComponents: [{ type: 'lambda', config: { provisionedConcurrency: { enabled: true, instances: 5 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Rate Limiting and Throttling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🚨',
  scenario: "DISASTER! A rogue client is hammering your API with 10,000 requests per second!",
  hook: "Your Lambda concurrency is maxed out. Other clients are getting 429 errors. Your AWS bill is projected at $50,000 this month!",
  challenge: "Implement rate limiting and throttling to protect against abuse and control costs.",
  illustration: 'server-overload',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Your API is now protected!',
  achievement: 'Rate limiting prevents abuse and controls costs',
  metrics: [
    { label: 'Malicious traffic blocked', after: '95%' },
    { label: 'Legitimate clients protected', after: '✓' },
    { label: 'Monthly AWS bill', before: '$50K', after: '$5K' },
  ],
  nextTeaser: "Good! But we need better observability to debug issues...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway Throttling and Rate Limiting',
  conceptExplanation: `**Why throttling matters in serverless:**
1. **Cost control** - Lambda charges per invocation
2. **Concurrency protection** - AWS Lambda has account limits
3. **Backend protection** - Prevent DDoS on database
4. **Fair usage** - Prevent one client from starving others

**API Gateway provides two levels:**

**1. Account-level throttling (global)**
- Default: 10,000 RPS across all APIs
- Protects Lambda concurrency quota
- Can request increase from AWS

**2. Per-API-key rate limiting (per client)**
- Limit: X requests per second per API key
- Common: 1000 req/sec or 10,000 req/day
- Returns 429 when exceeded
- Example: Free tier = 100 req/min, Paid tier = 10,000 req/min

**Best practices:**
- Set global throttle to 80% of Lambda concurrency
- Per-key limits based on pricing tiers
- Use burst limits for traffic spikes
- Monitor throttle metrics in CloudWatch`,

  whyItMatters: 'Without rate limiting, a single bad actor can exhaust your Lambda concurrency and cause failures for all clients.',

  famousIncident: {
    title: 'Coinbase API Meltdown',
    company: 'Coinbase',
    year: '2021',
    whatHappened: 'During a crypto price surge, trading bots hammered Coinbase\'s API with millions of requests. No proper rate limiting. The API went down for hours, preventing all trading during peak volatility.',
    lessonLearned: 'Rate limiting is not optional for public APIs. Always limit per-client and have global circuit breakers.',
    icon: '₿',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Public payment API used by millions of merchants',
    howTheyDoIt: 'Tiered rate limits: Test mode = 100 req/sec, Production = 1000 req/sec. Custom limits for enterprise.',
  },

  keyPoints: [
    'API Gateway throttling protects Lambda concurrency',
    'Per-API-key limits prevent abuse',
    'Burst allowance handles short spikes',
    'Return 429 with Retry-After header',
    'Monitor throttle events in CloudWatch',
  ],

  diagram: `
┌────────┐     ┌──────────────────────────┐
│ Client │────▶│     API Gateway          │
└────────┘     │  ┌────────────────────┐  │
               │  │ Throttle Check     │  │
               │  │ • API key: 500/sec │  │
               │  │ • Global: 5000/sec │  │
               │  └─────────┬──────────┘  │
               └────────────┼─────────────┘
                            │
               ┌────────────┴─────────────┐
               │                          │
               ▼ (within limits)          ▼ (exceeded)
        ┌──────────┐               ┌──────────┐
        │  Lambda  │               │ 429 Error│
        └──────────┘               └──────────┘
`,

  keyConcepts: [
    { title: 'Throttling', explanation: 'Reject requests exceeding rate limits', icon: '🚦' },
    { title: 'Burst Limit', explanation: 'Allow short-term spikes above steady rate', icon: '📈' },
    { title: '429 Too Many Requests', explanation: 'HTTP status code for rate limit exceeded', icon: '⚠️' },
  ],

  quickCheck: {
    question: 'Why is rate limiting critical for serverless APIs?',
    options: [
      'It makes requests faster',
      'It prevents cold starts',
      'It controls costs and prevents one client from exhausting Lambda concurrency',
      'It\'s required by AWS',
    ],
    correctIndex: 2,
    explanation: 'Rate limiting protects against runaway costs and ensures fair resource allocation across all API clients.',
  },
};

const step6: GuidedStep = {
  id: 'serverless-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: API key authentication with rate limiting',
    taskDescription: 'Configure API Gateway with rate limiting and throttling',
    successCriteria: [
      'Click on API Gateway component',
      'Enable rate limiting',
      'Set per-key limit (e.g., 1000 req/sec)',
      'Set global throttle limit',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'lambda', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'lambda' },
      { fromType: 'lambda', toType: 'database' },
      { fromType: 'lambda', toType: 'cache' },
    ],
    requireProvisionedConcurrency: true,
    requireRateLimiting: true,
  },

  hints: {
    level1: 'Click on the API Gateway and find rate limiting configuration',
    level2: 'Enable rate limiting with per-key limit of 1000 req/sec and global throttle of 5000 req/sec',
    solutionComponents: [{ type: 'api_gateway', config: { rateLimiting: { enabled: true, perKeyLimit: 1000, globalLimit: 5000 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Monitoring and Observability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔍',
  scenario: "Users are reporting intermittent 500 errors, but you have no idea why!",
  hook: "You check CloudWatch Logs... 50,000 log entries from hundreds of Lambda invocations. Finding the error is like finding a needle in a haystack.",
  challenge: "Add comprehensive monitoring and distributed tracing to understand what's happening in your serverless system.",
  illustration: 'debugging',
};

const step7Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Full observability achieved!',
  achievement: 'You can now trace requests end-to-end and debug issues quickly',
  metrics: [
    { label: 'Request tracing', after: 'Enabled' },
    { label: 'Error detection time', before: 'Hours', after: 'Minutes' },
    { label: 'Mean time to resolution', before: '4 hours', after: '30 min' },
  ],
  nextTeaser: "Excellent! But let's optimize costs before we ship to production...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Serverless Observability: The Three Pillars',
  conceptExplanation: `**Observability is HARDER in serverless:**
- Distributed across many Lambda invocations
- No persistent servers to SSH into
- Request spans multiple services (Gateway → Lambda → DynamoDB)

**The Three Pillars:**

**1. Metrics (CloudWatch Metrics)**
- Invocation count, duration, errors, throttles
- Memory usage, concurrent executions
- Cold start frequency
- Custom business metrics (orders/sec, revenue/hour)

**2. Logs (CloudWatch Logs)**
- Every Lambda print/log goes to CloudWatch
- Structured logging (JSON) for better querying
- Log groups per function
- Use CloudWatch Insights for log analysis

**3. Traces (AWS X-Ray)**
- Distributed tracing across services
- See full request path: API Gateway → Lambda → DynamoDB
- Identify bottlenecks and errors
- Service map visualization

**Best Practices:**
- Always enable X-Ray tracing
- Use structured JSON logging
- Create custom CloudWatch dashboards
- Set up alarms for error rate, duration, throttles
- Use correlation IDs to track requests`,

  whyItMatters: 'Without observability, debugging serverless is nearly impossible. You need visibility into distributed, ephemeral functions.',

  famousIncident: {
    title: 'AWS Lambda Silent Failures',
    company: 'Capital One',
    year: '2019',
    whatHappened: 'Lambda functions were silently failing due to permission errors, but no alerts were configured. For 3 days, critical data processing jobs failed without anyone noticing. Only discovered when downstream systems reported missing data.',
    lessonLearned: 'Never assume Lambda "just works". Always monitor invocation errors, duration, and throttles with alarms.',
    icon: '🏦',
  },

  realWorldExample: {
    company: 'iRobot',
    scenario: 'Debugging Roomba cloud connectivity issues',
    howTheyDoIt: 'X-Ray traces every IoT request from Roomba through API Gateway, Lambda, and DynamoDB. Can identify bottlenecks in seconds.',
  },

  keyPoints: [
    'CloudWatch metrics for high-level health monitoring',
    'CloudWatch Logs for detailed debugging',
    'X-Ray for distributed tracing and bottleneck identification',
    'Always use structured logging (JSON format)',
    'Set up alarms before going to production',
  ],

  diagram: `
                    ┌─────────────────────┐
                    │   X-Ray Trace       │
                    │  (End-to-End View)  │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ API Gateway  │      │    Lambda    │      │  DynamoDB    │
│              │      │              │      │              │
│ • Request ID │──▶   │ • Duration   │──▶   │ • Latency    │
│ • Latency    │      │ • Memory     │      │ • Errors     │
│ • Errors     │      │ • Errors     │      │              │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                             ▼
                  ┌────────────────────┐
                  │  CloudWatch Logs   │
                  │  & Metrics         │
                  └────────────────────┘
`,

  keyConcepts: [
    { title: 'X-Ray', explanation: 'Distributed tracing across services', icon: '🔬' },
    { title: 'CloudWatch Insights', explanation: 'SQL-like queries over logs', icon: '🔍' },
    { title: 'Structured Logging', explanation: 'JSON format for better querying', icon: '📝' },
  ],

  quickCheck: {
    question: 'What does AWS X-Ray provide?',
    options: [
      'Real-time log streaming',
      'Cost optimization recommendations',
      'End-to-end distributed tracing of requests',
      'Automated scaling',
    ],
    correctIndex: 2,
    explanation: 'X-Ray traces requests across all services, showing you exactly where time is spent and where errors occur.',
  },
};

const step7: GuidedStep = {
  id: 'serverless-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs need observability for debugging and monitoring',
    taskDescription: 'Add monitoring component for CloudWatch and X-Ray',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Track metrics, logs, and traces', displayName: 'CloudWatch + X-Ray' },
    ],
    successCriteria: [
      'Monitoring component added',
      'API Gateway connected to Monitoring',
      'Lambda connected to Monitoring',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'lambda', 'database', 'cache', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'lambda' },
      { fromType: 'lambda', toType: 'database' },
      { fromType: 'lambda', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'monitoring' },
      { fromType: 'lambda', toType: 'monitoring' },
    ],
  },

  hints: {
    level1: 'Add a Monitoring component and connect both API Gateway and Lambda to it',
    level2: 'Drag Monitoring component, then connect API Gateway → Monitoring and Lambda → Monitoring',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'monitoring' },
      { from: 'lambda', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// STEP 8: Cost Optimization
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💰',
  scenario: "Your serverless API is working perfectly! But the CFO just called...",
  hook: "The monthly AWS bill is $12,000! She says: 'We only make $20K/month in revenue. Cut costs to under $5,000 or we shut down the project!'",
  challenge: "Optimize your serverless architecture to reduce costs while maintaining performance.",
  illustration: 'budget-crisis',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-ready serverless API!',
  achievement: 'Cost-optimized, scalable, and observable serverless architecture',
  metrics: [
    { label: 'Monthly AWS cost', before: '$12,000', after: 'Under $5,000' },
    { label: 'p99 latency', after: '<200ms' },
    { label: 'Availability', after: '99.9%' },
    { label: 'API requests/day', after: '50M' },
  ],
  nextTeaser: "You've mastered serverless architecture design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Serverless Cost Optimization',
  conceptExplanation: `**Serverless cost breakdown:**
1. **API Gateway**: $3.50 per million requests
2. **Lambda**: $0.20 per 1M requests + $0.0000166667 per GB-second
3. **Provisioned Concurrency**: $0.015/hour per instance
4. **DynamoDB**: $1.25 per million reads/writes (on-demand)
5. **ElastiCache**: ~$50/month for cache.t3.micro
6. **Data Transfer**: $0.09/GB egress

**Cost optimization strategies:**

**1. Reduce Lambda invocations**
- API Gateway caching (avoid Lambda entirely)
- Longer cache TTL where acceptable
- Batch requests where possible

**2. Optimize Lambda memory/duration**
- Right-size memory (more memory = faster but more expensive)
- Optimize code to reduce execution time
- Use compiled languages (Go) vs interpreted (Python)

**3. Smart use of provisioned concurrency**
- Only for latency-critical functions
- Schedule provisioned capacity (scale down at night)
- Use on-demand for non-critical functions

**4. DynamoDB optimization**
- Use on-demand pricing for unpredictable workloads
- Switch to provisioned for steady workloads (50% savings)
- Enable auto-scaling for provisioned mode

**5. Architecture optimizations**
- Async processing where possible (cheaper than sync)
- Use SQS for decoupling (very cheap)
- ElastiCache instead of DynamoDB for hot data`,

  whyItMatters: 'Serverless can be expensive if not optimized. Smart caching and right-sizing can cut costs by 60-80%.',

  realWorldExample: {
    company: 'Finimize',
    scenario: 'News aggregation API serving 1M+ users',
    howTheyDoIt: 'Aggressive API Gateway caching (5 min TTL) reduced Lambda invocations by 90%. Cost dropped from $8K/month to $1.5K/month.',
  },

  keyPoints: [
    'API Gateway caching is the cheapest optimization',
    'Provisioned concurrency is expensive - use sparingly',
    'Right-size Lambda memory for cost/performance balance',
    'DynamoDB on-demand is simple but can be expensive at scale',
    'Monitor costs weekly, optimize monthly',
  ],

  diagram: `
┌─────────────────────────────────────────────────────┐
│         SERVERLESS COST OPTIMIZATION                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Before:                                            │
│  • 50M requests/day × $3.50/1M = $175/day          │
│  • Lambda 50M × $0.20/1M = $10/day                 │
│  • Provisioned 20 instances × $11/day = $220/day   │
│  • DynamoDB 50M reads × $1.25/1M = $62.50/day      │
│  TOTAL: ~$467/day = $14K/month                     │
│                                                     │
│  After (with caching):                              │
│  • 50M requests × $3.50/1M = $175/day (same)       │
│  • Lambda 10M × $0.20/1M = $2/day (80% cache hit)  │
│  • Provisioned 5 instances × $2.75/day = $14/day   │
│  • DynamoDB 10M reads × $1.25/1M = $12.50/day      │
│  • ElastiCache = $1.60/day                         │
│  TOTAL: ~$205/day = $6K/month                      │
│                                                     │
│  SAVINGS: $8K/month (57% reduction)                 │
└─────────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Cold Storage', explanation: 'Cheaper storage for infrequently accessed data', icon: '🧊' },
    { title: 'Reserved Capacity', explanation: 'Commit to usage for discounts (DynamoDB)', icon: '📅' },
    { title: 'Right-Sizing', explanation: 'Match resource allocation to actual usage', icon: '📏' },
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for serverless APIs?',
    options: [
      'Remove all monitoring',
      'Use only on-demand Lambda (no provisioned concurrency)',
      'Aggressive API Gateway caching to reduce Lambda invocations',
      'Switch to EC2 instead of Lambda',
    ],
    correctIndex: 2,
    explanation: 'API Gateway caching can reduce Lambda invocations by 80-90%, which eliminates the majority of Lambda and database costs.',
  },
};

const step8: GuidedStep = {
  id: 'serverless-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to stay under $5,000/month budget',
    successCriteria: [
      'Review all component configurations',
      'Enable API Gateway caching with appropriate TTL',
      'Right-size provisioned concurrency (5-10 instances)',
      'Ensure total estimated cost is under $5,000/month',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'lambda', 'database', 'cache', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'lambda' },
      { fromType: 'lambda', toType: 'database' },
      { fromType: 'lambda', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'monitoring' },
      { fromType: 'lambda', toType: 'monitoring' },
    ],
    requireProvisionedConcurrency: true,
    requireRateLimiting: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for cost optimization opportunities - focus on caching, provisioned concurrency, and database pricing',
    level2: 'Enable API Gateway caching (TTL: 300s), reduce provisioned concurrency to 5-10 instances, use DynamoDB on-demand pricing',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const serverlessGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'serverless-gateway',
  title: 'Design Serverless API Gateway',
  description: 'Build a serverless API platform with Lambda integration, cold start optimization, and API Gateway patterns',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '☁️',
    hook: "You've been hired as a Cloud Architect at a fast-growing startup!",
    scenario: "Your mission: Build a scalable serverless API platform that can handle millions of requests per day with minimal operational overhead.",
    challenge: "Can you design a system that optimizes for cold starts, controls costs, and maintains high availability?",
  },

  requirementsPhase: serverlessGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  // Meta information
  concepts: [
    'API Gateway Architecture',
    'Lambda Function Lifecycle',
    'Cold Start Optimization',
    'Provisioned Concurrency',
    'Serverless Caching Strategies',
    'Rate Limiting and Throttling',
    'DynamoDB vs RDS for Serverless',
    'AWS X-Ray Distributed Tracing',
    'CloudWatch Observability',
    'Serverless Cost Optimization',
    'VPC Integration',
    'Lambda Layers',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 4: Encoding and Evolution (API versioning)',
    'Chapter 11: Stream Processing (Event-driven architecture)',
  ],
};

export default serverlessGatewayGuidedTutorial;
