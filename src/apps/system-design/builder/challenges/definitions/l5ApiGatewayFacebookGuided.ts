import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Facebook-Style API Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches API Gateway design concepts
 * while building a massive-scale API platform like Facebook's Graph API.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (rate limiting, auth, routing, etc.)
 *
 * Key Concepts:
 * - Graph API design and resource routing
 * - Rate limiting strategies (token bucket, sliding window)
 * - Authentication and authorization at scale
 * - Request routing and service discovery
 * - Protocol translation (REST to gRPC)
 * - Circuit breakers and fallback mechanisms
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const apiGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an API Gateway for a social platform like Facebook with 3 billion users",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Staff Engineer at Meta',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-gateway',
      category: 'functional',
      question: "What's the primary purpose of an API Gateway in this architecture?",
      answer: "The API Gateway is the **single entry point** for all client requests. It needs to:\n\n1. **Route requests** to appropriate backend services (Graph API, Newsfeed, Messaging, etc.)\n2. **Authenticate** users and validate access tokens\n3. **Rate limit** to prevent abuse and ensure fair usage\n4. **Transform protocols** (REST to gRPC for internal services)\n5. **Aggregate responses** from multiple services when needed",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "API Gateway is the traffic cop - it handles auth, routing, and protection before requests reach backend services",
    },
    {
      id: 'graph-api',
      category: 'functional',
      question: "What types of API requests should the gateway support?",
      answer: "We need to support Facebook's **Graph API** pattern:\n\n1. **User data** - GET /v18.0/me, GET /v18.0/{user-id}\n2. **Social graph** - GET /v18.0/{user-id}/friends\n3. **Content** - POST /v18.0/me/feed, GET /v18.0/{post-id}\n4. **Batch requests** - Multiple operations in one HTTP call\n5. **Field selection** - ?fields=id,name,email to reduce payload",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Graph API is RESTful with a node-edge structure - very flexible for querying social data",
    },
    {
      id: 'authentication',
      category: 'functional',
      question: "How should we authenticate API requests?",
      answer: "Use **OAuth 2.0 access tokens**:\n\n1. Client sends bearer token in Authorization header\n2. Gateway validates token (check signature, expiry, scopes)\n3. Extract user_id and permissions from token\n4. Pass authenticated context to backend services\n\nTokens should be **JWTs** for stateless validation at scale.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "OAuth tokens allow stateless auth - gateway doesn't need to query auth service for every request",
    },
    {
      id: 'rate-limiting',
      category: 'functional',
      question: "How should we implement rate limiting?",
      answer: "Multi-tiered rate limiting:\n\n1. **Per-user limits** - 200 calls per hour for regular users\n2. **Per-app limits** - 50,000 calls per hour for registered apps\n3. **IP-based limits** - 10 calls per second to prevent DDoS\n4. **Custom tiers** - Higher limits for verified/premium apps\n\nReturn HTTP 429 (Too Many Requests) with Retry-After header when exceeded.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Rate limiting prevents abuse and ensures fair resource allocation across millions of API consumers",
    },
    {
      id: 'backend-routing',
      category: 'functional',
      question: "How does the gateway know which backend service to route requests to?",
      answer: "Use **path-based routing** with a service registry:\n\n- `/v18.0/me/*` → User Service\n- `/v18.0/{user-id}/friends` → Social Graph Service\n- `/v18.0/{user-id}/feed` → Newsfeed Service\n- `/v18.0/{post-id}` → Content Service\n\nGateway maintains a routing table and uses service discovery to find healthy instances.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Service registry enables dynamic routing - add/remove backend services without changing gateway code",
    },
    {
      id: 'protocol-translation',
      category: 'clarification',
      question: "Do backend services use the same protocol as external clients?",
      answer: "No! Clients use **REST/HTTP**, but internal services use **gRPC** for efficiency. The gateway must:\n\n1. Accept REST requests from clients\n2. Translate to gRPC calls\n3. Route to backend services\n4. Convert gRPC responses back to JSON\n\nThis gives us public REST APIs while keeping internal communication fast with binary protocols.",
      importance: 'critical',
      insight: "Protocol translation at the gateway allows different protocols internally vs externally",
    },
    {
      id: 'response-caching',
      category: 'clarification',
      question: "Should the gateway cache API responses?",
      answer: "Yes, for GET requests with **cache-friendly** data:\n\n- User profiles (cache for 5 minutes)\n- Public posts (cache for 1 minute)\n- Friend lists (cache for 30 seconds)\n\nUse **ETag** headers for conditional requests. Skip caching for:\n- POST/PUT/DELETE requests\n- Personalized feeds\n- Real-time messaging",
      importance: 'important',
      insight: "Gateway-level caching reduces backend load for frequently accessed data",
    },
    {
      id: 'error-handling',
      category: 'clarification',
      question: "What happens if a backend service is down?",
      answer: "Implement **circuit breaker** pattern:\n\n1. **Closed**: Normal operation, requests pass through\n2. **Open**: Service failing, immediately return 503 (Service Unavailable)\n3. **Half-Open**: Test if service recovered\n\nAlso implement:\n- Retries with exponential backoff\n- Fallback responses (cached data or graceful degradation)\n- Timeout after 5 seconds to prevent cascade failures",
      importance: 'critical',
      insight: "Circuit breakers prevent cascade failures when downstream services fail",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many API requests per second should the gateway handle?",
      answer: "Facebook scale: **5 million requests per second** at peak",
      importance: 'critical',
      calculation: {
        formula: "3B daily active users × 50 requests/day ÷ 86,400 sec",
        result: "~1.7M RPS average, 5M RPS peak (3x multiplier)",
      },
      learningPoint: "This is massive scale - requires horizontal scaling with many gateway instances",
    },
    {
      id: 'latency-gateway',
      category: 'latency',
      question: "What latency overhead is acceptable for the gateway?",
      answer: "Gateway overhead should be **under 10ms at p99**. Total API latency:\n\n- Gateway overhead: <10ms\n- Backend service: 50-200ms\n- Total: <210ms\n\nEvery millisecond counts - the gateway is on the critical path for ALL requests.",
      importance: 'critical',
      learningPoint: "Gateway adds latency to every request - must be extremely fast",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What uptime SLA should the API Gateway maintain?",
      answer: "**99.99% uptime** (4.38 minutes downtime per month)\n\n- Deploy across multiple availability zones\n- No single point of failure\n- Zero-downtime deployments with rolling updates\n- Health checks every 5 seconds",
      importance: 'critical',
      learningPoint: "Gateway is the front door - if it's down, ALL APIs are down",
    },
    {
      id: 'security-ddos',
      category: 'security',
      question: "How do we protect against DDoS attacks?",
      answer: "Multi-layer defense:\n\n1. **Edge layer** - CDN/WAF blocks malicious IPs\n2. **Gateway layer** - IP-based rate limiting (10 RPS per IP)\n3. **Challenge-response** - CAPTCHA for suspicious patterns\n4. **Connection limits** - Max 1000 concurrent connections per IP\n5. **Request validation** - Reject malformed requests early",
      importance: 'critical',
      insight: "DDoS protection must happen before requests reach the gateway to conserve resources",
    },
    {
      id: 'token-validation',
      category: 'security',
      question: "How fast should token validation be?",
      answer: "Token validation happens on **every request**, so it must be <1ms:\n\n- Use **JWT signature verification** (local, no network calls)\n- Cache public keys for signature validation\n- Only call auth service for revoked tokens (rare case)\n\nAvoid calling auth service synchronously - would add 10-50ms latency!",
      importance: 'critical',
      learningPoint: "Stateless JWT validation is crucial for low-latency authentication at scale",
    },
    {
      id: 'observability',
      category: 'reliability',
      question: "How do we monitor and debug API Gateway issues?",
      answer: "Comprehensive observability:\n\n1. **Metrics** - RPS, latency (p50/p95/p99), error rates per endpoint\n2. **Logging** - Request/response logs with trace IDs\n3. **Distributed tracing** - Track requests across gateway → services\n4. **Alerts** - Page on-call when error rate >1% or latency >100ms\n5. **Dashboards** - Real-time traffic visualization",
      importance: 'important',
      insight: "At 5M RPS, debugging without proper observability is impossible",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-gateway', 'graph-api', 'authentication', 'rate-limiting'],
  criticalFRQuestionIds: ['core-gateway', 'graph-api', 'authentication'],
  criticalScaleQuestionIds: ['throughput-requests', 'latency-gateway', 'availability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Route API requests to backend services',
      description: 'Accept REST requests and route to appropriate microservices',
      emoji: '🛣️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Authenticate and authorize requests',
      description: 'Validate OAuth tokens and enforce permissions',
      emoji: '🔐',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Rate limit API calls',
      description: 'Prevent abuse with per-user and per-app limits',
      emoji: '⏱️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Transform protocols',
      description: 'Convert REST to gRPC for internal communication',
      emoji: '🔄',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Cache responses',
      description: 'Reduce backend load by caching GET requests',
      emoji: '💾',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Handle failures gracefully',
      description: 'Circuit breakers, retries, and fallback responses',
      emoji: '🛡️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '3 billion',
    writesPerDay: '50 billion API writes',
    readsPerDay: '100 billion API reads',
    peakMultiplier: 3,
    readWriteRatio: '2:1',
    calculatedWriteRPS: { average: 578704, peak: 1736112 },
    calculatedReadRPS: { average: 1157407, peak: 3472222 },
    maxPayloadSize: '~10KB (Graph API request)',
    storagePerRecord: 'N/A (gateway is stateless)',
    storageGrowthPerYear: '~100TB (logs only)',
    redirectLatencySLA: 'p99 < 10ms (gateway overhead)',
    createLatencySLA: 'p99 < 200ms (total API latency)',
  },

  architecturalImplications: [
    '✅ 5M RPS peak → Many gateway instances with load balancing',
    '✅ <10ms latency → In-memory rate limiting, JWT validation',
    '✅ 99.99% uptime → Multi-AZ deployment, no single point of failure',
    '✅ Protocol translation → REST ↔ gRPC conversion logic',
    '✅ Rate limiting at scale → Distributed Redis for shared state',
    '✅ Circuit breakers → Prevent cascade failures to backends',
  ],

  outOfScope: [
    'GraphQL support (focus on REST)',
    'WebSocket connections',
    'API versioning migration',
    'Multi-region routing',
    'Custom API analytics/billing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple gateway that routes requests and validates tokens. The complex rate limiting, protocol translation, and resilience patterns will come in later steps. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚪',
  scenario: "Welcome to Meta! You've been hired to build the API Gateway for Facebook's Graph API.",
  hook: "3 billion users are about to hit your APIs. You need a front door!",
  challenge: "Set up the basic request flow so clients can reach your gateway.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your API Gateway is online!',
  achievement: 'Clients can now send requests to your gateway',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the gateway doesn't know what to do with requests yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway: The Front Door to Your System',
  conceptExplanation: `An **API Gateway** is the single entry point for all client requests in a microservices architecture.

Think of it as a **smart router** that:
1. Accepts requests from clients (mobile apps, web browsers, third-party developers)
2. Performs cross-cutting concerns (auth, rate limiting, logging)
3. Routes requests to the appropriate backend service
4. Aggregates and returns responses

Without a gateway, clients would need to know about every backend service - a nightmare to manage!`,

  whyItMatters: 'The gateway is the ONLY thing clients talk to. It simplifies client code and centralizes security, making your entire system easier to manage.',

  realWorldExample: {
    company: 'Facebook/Meta',
    scenario: 'Handling 5 million API requests per second',
    howTheyDoIt: 'Uses a custom C++ gateway called "Proxygen" that handles routing, auth, rate limiting, and protocol translation for all Graph API traffic',
  },

  keyPoints: [
    'Client = apps/browsers that consume your APIs',
    'API Gateway = single entry point for ALL requests',
    'Gateway handles cross-cutting concerns before routing',
    'Backend services are hidden from clients',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Apps, browsers, or services consuming APIs', icon: '📱' },
    { title: 'API Gateway', explanation: 'Smart router and security checkpoint', icon: '🚪' },
    { title: 'Backend Services', explanation: 'Microservices behind the gateway', icon: '🖥️' },
  ],
};

const step1: GuidedStep = {
  id: 'api-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and API Gateway, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents apps consuming the Graph API', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Entry point for all API requests', displayName: 'API Gateway' },
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
// STEP 2: Add Backend Service and Implement Routing
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🛣️',
  scenario: "Your gateway is receiving requests, but it has nowhere to route them!",
  hook: "A client just sent GET /v18.0/me and got a 502 Bad Gateway error.",
  challenge: "Add a backend service and implement routing logic in the gateway.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Requests are now routing to backend services!',
  achievement: 'You implemented basic request routing',
  metrics: [
    { label: 'Routes configured', after: '4' },
    { label: 'Backend services', after: '1' },
    { label: 'Successful routing', after: '✓' },
  ],
  nextTeaser: "But anyone can call your APIs - there's no authentication!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Request Routing: Path-Based Service Discovery',
  conceptExplanation: `The gateway needs a **routing table** to map request paths to backend services.

For Facebook's Graph API:
\`\`\`
GET /v18.0/me → User Service
GET /v18.0/{user-id}/friends → Social Graph Service
GET /v18.0/{user-id}/feed → Newsfeed Service
POST /v18.0/me/photos → Content Service
\`\`\`

The gateway:
1. Parses the incoming request path
2. Matches against routing rules
3. Forwards to the appropriate backend service
4. Returns the response to the client

This is **path-based routing** - the most common gateway pattern.`,

  whyItMatters: 'Without routing, you\'d need a monolithic backend. Routing enables microservices - each team can own their service independently.',

  famousIncident: {
    title: 'Amazon\'s Microservices Migration',
    company: 'Amazon',
    year: '2001',
    whatHappened: 'Jeff Bezos mandated that all teams expose their functionality through service interfaces. This forced Amazon to build internal API gateways for routing. It was painful but transformed Amazon into a services company.',
    lessonLearned: 'API Gateway pattern is essential for scaling teams and services independently.',
    icon: '📦',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Routing 5M requests/sec to 1000+ backend services',
    howTheyDoIt: 'Maintains a service registry (like Zookeeper) with routing rules. Gateway instances poll for updates every 10 seconds.',
  },

  keyPoints: [
    'Routing table maps paths to backend services',
    'Path-based routing is simple and effective',
    'Service discovery allows dynamic backend addition',
    'Gateway forwards requests and proxies responses',
  ],

  quickCheck: {
    question: 'Why use path-based routing instead of clients calling services directly?',
    options: [
      'It\'s faster',
      'It hides backend complexity and enables independent service evolution',
      'It uses less bandwidth',
      'It\'s required by HTTP',
    ],
    correctIndex: 1,
    explanation: 'Gateway routing decouples clients from backend services. Services can change, scale, or be replaced without client updates.',
  },

  keyConcepts: [
    { title: 'Routing Table', explanation: 'Maps request patterns to services', icon: '🗺️' },
    { title: 'Service Discovery', explanation: 'Dynamic service registration/lookup', icon: '🔍' },
    { title: 'Request Forwarding', explanation: 'Proxy requests to backend', icon: '➡️' },
  ],
};

const step2: GuidedStep = {
  id: 'api-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Route API requests to backend services',
    taskDescription: 'Add a backend App Server and configure routing in the gateway',
    componentsNeeded: [
      { type: 'app_server', reason: 'Backend service handling Graph API requests', displayName: 'User Service' },
    ],
    successCriteria: [
      'App Server component added',
      'API Gateway connected to App Server',
      'Routing rules configured in gateway',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Drag an App Server onto the canvas to represent a backend service',
    level2: 'Connect API Gateway to App Server. The gateway will route requests there.',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'api_gateway', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Authentication Service
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔓',
  scenario: "Security breach! Hackers are calling your APIs without authentication.",
  hook: "They're scraping user data, and you have no way to stop them!",
  challenge: "Add an authentication service to validate OAuth tokens.",
  illustration: 'security-alert',
};

const step3Celebration: CelebrationContent = {
  emoji: '🔐',
  message: 'Your APIs are now secure!',
  achievement: 'Only authenticated requests can access backend services',
  metrics: [
    { label: 'Unauthenticated requests', before: 'Allowed', after: 'Blocked' },
    { label: 'Token validation', after: 'Enabled' },
  ],
  nextTeaser: "But validating tokens for every request is slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Authentication: OAuth 2.0 and JWT Tokens',
  conceptExplanation: `Every API request must be authenticated before reaching backend services.

**OAuth 2.0 Flow:**
1. User logs in → Auth service issues **access token** (JWT)
2. Client sends token in \`Authorization: Bearer <token>\` header
3. Gateway validates token (signature, expiry, scopes)
4. If valid, extract user_id and forward to backend
5. If invalid, return 401 Unauthorized

**JWT (JSON Web Token)** structure:
\`\`\`
{
  "user_id": "12345",
  "scopes": ["email", "friends"],
  "exp": 1735689600  // Expiration timestamp
}
\`\`\`

JWTs are **signed** by the auth service, so the gateway can verify authenticity without a network call!`,

  whyItMatters: 'Without authentication, anyone can access private user data. Auth is non-negotiable for any API.',

  famousIncident: {
    title: 'Facebook Cambridge Analytica Scandal',
    company: 'Facebook',
    year: '2018',
    whatHappened: 'Lax API permissions allowed third-party apps to access friend data without explicit consent. 87 million users affected. Led to massive fines and reputation damage.',
    lessonLearned: 'Authentication AND authorization must be enforced strictly. Gateway is the enforcement point.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Validating 5M tokens per second',
    howTheyDoIt: 'Uses JWTs with RSA signatures. Gateway caches public keys and validates locally - no auth service call needed for most requests.',
  },

  diagram: `
Client Request
      │
      ▼
┌─────────────────┐
│  API Gateway    │
│                 │
│  1. Extract     │
│     token       │
│  2. Verify      │──────┐
│     signature   │      │ Only if signature
│  3. Check exp   │      │ invalid or revoked
│                 │      │
└────────┬────────┘      │
         │               ▼
         │        ┌─────────────┐
         │        │ Auth Service│
         │        │  (rare)     │
         │        └─────────────┘
         ▼
┌─────────────────┐
│  Backend Service│
│  (user_id known)│
└─────────────────┘
`,

  keyPoints: [
    'OAuth tokens authenticate API requests',
    'JWTs enable stateless validation (no DB lookup)',
    'Gateway verifies signature and expiry',
    'Valid requests get user_id passed to backend',
  ],

  quickCheck: {
    question: 'Why use JWT tokens instead of opaque tokens?',
    options: [
      'JWTs are more secure',
      'JWTs can be validated locally without calling auth service',
      'JWTs are smaller',
      'JWTs never expire',
    ],
    correctIndex: 1,
    explanation: 'JWTs contain claims and a signature. Gateway can verify them locally, avoiding a network call to auth service for every request.',
  },

  keyConcepts: [
    { title: 'OAuth 2.0', explanation: 'Industry-standard auth framework', icon: '🔑' },
    { title: 'JWT', explanation: 'Self-contained signed token', icon: '📜' },
    { title: 'Stateless Auth', explanation: 'Validate without database lookup', icon: '⚡' },
  ],
};

const step3: GuidedStep = {
  id: 'api-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Authenticate and authorize requests',
    taskDescription: 'Add an Auth Service for token validation',
    componentsNeeded: [
      { type: 'auth_service', reason: 'Validates OAuth tokens and manages sessions', displayName: 'Auth Service' },
    ],
    successCriteria: [
      'Auth Service component added',
      'API Gateway connected to Auth Service',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'auth_service'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
    ],
  },

  hints: {
    level1: 'Drag an Auth Service component onto the canvas',
    level2: 'Connect API Gateway to Auth Service for token validation',
    solutionComponents: [{ type: 'auth_service' }],
    solutionConnections: [{ from: 'api_gateway', to: 'auth_service' }],
  },
};

// =============================================================================
// STEP 4: Add Redis for Rate Limiting
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🚨',
  scenario: "A rogue developer is hammering your API with 10,000 requests per second!",
  hook: "Your backend is melting under the load. Other users can't get through.",
  challenge: "Implement rate limiting to protect against abuse.",
  illustration: 'server-overload',
};

const step4Celebration: CelebrationContent = {
  emoji: '⏱️',
  message: 'Rate limiting is now protecting your APIs!',
  achievement: 'Abusive clients are automatically throttled',
  metrics: [
    { label: 'Abusive requests', before: 'Reaching backend', after: 'Blocked at gateway' },
    { label: 'Rate limit algorithm', after: 'Token bucket' },
    { label: 'Legitimate users', after: 'Unaffected' },
  ],
  nextTeaser: "But checking rate limits is adding latency to every request...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting: Token Bucket Algorithm',
  conceptExplanation: `Rate limiting prevents abuse by limiting how many requests a client can make.

**Token Bucket Algorithm:**
1. Each client has a bucket with N tokens (e.g., 200)
2. Each request consumes 1 token
3. Bucket refills at R tokens per second (e.g., 1 per 18 seconds)
4. If bucket is empty → reject request with 429 Too Many Requests

**Why Redis?**
- Rate limit state must be shared across all gateway instances
- Redis is in-memory (fast lookups: <1ms)
- Atomic operations (INCR, EXPIRE) prevent race conditions

**Implementation:**
\`\`\`python
key = f"rate_limit:{user_id}"
current = redis.incr(key)
if current == 1:
    redis.expire(key, 3600)  # 1 hour window
if current > 200:
    return 429  # Too Many Requests
\`\`\``,

  whyItMatters: 'Without rate limiting, a single abusive client can bring down your entire API platform.',

  famousIncident: {
    title: 'Twitter API Rate Limit Wars',
    company: 'Twitter',
    year: '2012',
    whatHappened: 'Before proper rate limiting, third-party apps would poll the API every few seconds, creating massive load. Twitter implemented strict rate limits (150 req/hour), breaking many apps overnight.',
    lessonLearned: 'Rate limiting is essential, but communicate limits clearly to developers.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Rate limiting 5M requests/second',
    howTheyDoIt: 'Uses distributed Redis clusters with sliding window counters. Each user/app has limits based on their tier (standard/verified/premium).',
  },

  diagram: `
Request arrives
      │
      ▼
┌─────────────────────────────────┐
│  API Gateway                    │
│                                 │
│  1. Extract user_id from token │
│  2. Check Redis:                │
│     rate_limit:{user_id}        │
│  3. If count > limit:           │
│     → Return 429                │
│  4. Else:                       │
│     → Increment counter         │
│     → Forward to backend        │
└─────────────────────────────────┘
           │
           ▼
    ┌───────────┐
    │   Redis   │
    │  (shared  │
    │   state)  │
    └───────────┘
`,

  keyPoints: [
    'Rate limiting prevents API abuse',
    'Token bucket is simple and effective',
    'Redis stores shared rate limit counters',
    'Return 429 with Retry-After header when exceeded',
  ],

  quickCheck: {
    question: 'Why use Redis for rate limiting instead of in-memory counters?',
    options: [
      'Redis is faster than memory',
      'Rate limits must be shared across all gateway instances',
      'Redis is more secure',
      'Redis has built-in rate limiting',
    ],
    correctIndex: 1,
    explanation: 'With multiple gateway instances, each needs to see the same rate limit state. Redis provides shared, fast state.',
  },

  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Rate limiting algorithm with refill', icon: '🪣' },
    { title: 'Redis', explanation: 'In-memory shared state store', icon: '🔴' },
    { title: 'HTTP 429', explanation: 'Too Many Requests status code', icon: '🚫' },
  ],
};

const step4: GuidedStep = {
  id: 'api-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Rate limit API calls',
    taskDescription: 'Add Redis for distributed rate limiting',
    componentsNeeded: [
      { type: 'cache', reason: 'Store rate limit counters shared across gateway instances', displayName: 'Redis' },
    ],
    successCriteria: [
      'Cache (Redis) component added',
      'API Gateway connected to Redis',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'auth_service', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
      { fromType: 'api_gateway', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect API Gateway to Redis for storing rate limit counters',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'api_gateway', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Cache for Auth Token Validation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🐌',
  scenario: "Token validation is slow! Every request takes an extra 50ms.",
  hook: "You're calling the Auth Service for every request. Users are complaining about lag.",
  challenge: "Cache token validation results to reduce latency.",
  illustration: 'slow-loading',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Token validation is now lightning fast!',
  achievement: 'Caching reduced auth latency by 50x',
  metrics: [
    { label: 'Token validation latency', before: '50ms', after: '<1ms' },
    { label: 'Cache hit rate', after: '95%' },
    { label: 'Auth service load', before: '5M RPS', after: '250K RPS' },
  ],
  nextTeaser: "But you still only have one gateway instance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Caching JWT Validation Results',
  conceptExplanation: `Token validation happens on **EVERY request**. At 5M RPS, this is the hottest code path.

**Without caching:**
\`\`\`
Every request → Verify JWT signature (10ms) → Forward
Total latency overhead: ~10ms
\`\`\`

**With caching:**
\`\`\`
First request → Verify JWT → Store result in Redis (TTL = token expiry)
Subsequent requests → Check Redis (<1ms) → Forward
Cache hit latency: <1ms (10x faster!)
\`\`\`

**What to cache:**
- JWT signature validation result
- User permissions/scopes
- Public keys for signature verification

**Cache key:**
\`\`\`
cache_key = f"jwt:{token_hash}"
cached_user = redis.get(cache_key)
if cached_user:
    return cached_user  # Cache hit!
else:
    user = verify_jwt(token)  # Cache miss, verify
    redis.set(cache_key, user, ttl=token.exp)
    return user
\`\`\``,

  whyItMatters: 'At 5M RPS, every millisecond saved = 5000 concurrent requests reduced. Caching JWT validation is critical for scale.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Validating 5M tokens per second',
    howTheyDoIt: 'Caches JWT public keys and validation results. 95%+ cache hit rate. Only validates fresh tokens or those from revoked users.',
  },

  famousIncident: {
    title: 'Cloudflare Auth Cache Stampede',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A bug caused all cached auth tokens to expire simultaneously. Backend auth service was hit with 100x normal traffic and crashed, taking down customer sites.',
    lessonLearned: 'Use staggered TTLs to prevent cache stampedes. Never let all cache entries expire at once.',
    icon: '☁️',
  },

  diagram: `
         Token arrives
              │
              ▼
      ┌───────────────┐
      │  API Gateway  │
      └───────┬───────┘
              │
        Check cache?
         ╱        ╲
    Hit ╱          ╲ Miss
       ╱            ╲
      ▼              ▼
┌──────────┐   ┌────────────┐
│  Redis   │   │Auth Service│
│ (<1ms)   │   │  (10ms)    │
└────┬─────┘   └──────┬─────┘
     │                │
     └────────┬───────┘
              ▼
        Forward to
        backend
`,

  keyPoints: [
    'Cache JWT validation results to reduce latency',
    'Cache key = hash of token',
    'TTL = token expiration time',
    'Cache hit rate should be >90%',
  ],

  quickCheck: {
    question: 'Why cache JWT validation results if JWTs are already stateless?',
    options: [
      'JWTs are too large to send every time',
      'Signature verification is CPU-intensive',
      'JWTs expire quickly',
      'It prevents token theft',
    ],
    correctIndex: 1,
    explanation: 'JWT signature verification (RSA) takes ~10ms of CPU. At scale, caching the result saves massive compute resources.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Validation result found in cache', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Must verify token signature', icon: '❌' },
    { title: 'TTL', explanation: 'Cache entry expires with token', icon: '⏰' },
  ],
};

const step5: GuidedStep = {
  id: 'api-gateway-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Authenticate requests (now faster with caching)',
    taskDescription: 'Configure cache TTL and strategy for auth token caching',
    successCriteria: [
      'Redis cache already connected',
      'Configure cache strategy for auth tokens',
      'Set appropriate TTL based on token expiry',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'auth_service', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
      { fromType: 'api_gateway', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click on the Redis cache component to configure it',
    level2: 'Set TTL to 3600 seconds (1 hour, typical token expiry) and strategy to cache-aside',
    solutionComponents: [{ type: 'cache', config: { ttl: 3600, strategy: 'cache-aside' } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 6: Add Load Balancer for Gateway Scaling
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Traffic spike! Your single gateway instance is at 100% CPU.",
  hook: "A viral post caused traffic to jump 5x. The gateway can't keep up!",
  challenge: "Add a load balancer to distribute traffic across multiple gateway instances.",
  illustration: 'traffic-spike',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚖️',
  message: 'Gateway traffic is now distributed!',
  achievement: 'Load balancer spreads 5M RPS across multiple instances',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Max throughput', before: '100K RPS', after: '5M+ RPS' },
  ],
  nextTeaser: "But we still need more gateway instances...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distributing API Gateway Traffic',
  conceptExplanation: `A single gateway instance can handle ~100K RPS. To reach 5M RPS, you need 50+ instances.

**Load Balancer** distributes incoming requests:
- **Layer 4 (TCP)**: Routes based on IP/port (faster)
- **Layer 7 (HTTP)**: Routes based on path/headers (smarter)

For API Gateway, use **Layer 7** to enable:
- Health checks (remove unhealthy gateways)
- Sticky sessions (same client → same gateway)
- Path-based routing (different paths → different gateway pools)

**Algorithms:**
- **Round-robin**: Distribute evenly
- **Least connections**: Send to least busy gateway
- **Consistent hashing**: Same client → same gateway (for caching)`,

  whyItMatters: 'Load balancer enables horizontal scaling - add more gateways to handle more traffic. Essential for reaching 5M RPS.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Distributing 5M RPS across gateway instances',
    howTheyDoIt: 'Uses custom L7 load balancers built on Katran (XDP-based). Routes traffic to hundreds of gateway instances across multiple data centers.',
  },

  famousIncident: {
    title: 'AWS ELB Scaling Limits',
    company: 'Amazon Web Services',
    year: '2016',
    whatHappened: 'Classic Load Balancers couldn\'t scale fast enough for sudden traffic spikes (Pokemon GO launch). Customers had to pre-warm load balancers.',
    lessonLearned: 'Modern load balancers (ALB/NLB) auto-scale, but still have limits. Plan for 10x traffic spikes.',
    icon: '📊',
  },

  diagram: `
         Clients (5M RPS)
               │
               ▼
      ┌────────────────┐
      │ Load Balancer  │ Layer 7 (HTTP)
      │  (distributes) │
      └────────┬───────┘
               │
      ┌────────┼────────┬─────────┐
      ▼        ▼        ▼         ▼
  ┌─────┐  ┌─────┐  ┌─────┐   ┌─────┐
  │ GW  │  │ GW  │  │ GW  │...│ GW  │
  │  1  │  │  2  │  │  3  │   │ 50  │
  └─────┘  └─────┘  └─────┘   └─────┘
    100K     100K     100K      100K RPS
`,

  keyPoints: [
    'Load balancer distributes traffic across gateway instances',
    'Layer 7 LB enables health checks and smart routing',
    'Each gateway instance handles ~100K RPS',
    'Horizontal scaling = add more instances',
  ],

  quickCheck: {
    question: 'Why use Layer 7 load balancing instead of Layer 4 for API Gateway?',
    options: [
      'Layer 7 is faster',
      'Layer 7 can route based on HTTP path and do health checks',
      'Layer 7 uses less memory',
      'Layer 4 doesn\'t support HTTPS',
    ],
    correctIndex: 1,
    explanation: 'Layer 7 inspects HTTP requests, enabling path-based routing, health checks, and removing unhealthy instances.',
  },

  keyConcepts: [
    { title: 'Layer 7 LB', explanation: 'HTTP-aware load balancing', icon: '⚖️' },
    { title: 'Health Checks', explanation: 'Remove unhealthy instances', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add instances for more capacity', icon: '↔️' },
  ],
};

const step6: GuidedStep = {
  id: 'api-gateway-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and API Gateway',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic across gateway instances', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to API Gateway',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'api_gateway', 'app_server', 'auth_service', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
      { fromType: 'api_gateway', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Load Balancer onto the canvas between Client and API Gateway',
    level2: 'Reconnect: Client → Load Balancer → API Gateway',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'api_gateway' },
    ],
  },
};

// =============================================================================
// STEP 7: Scale API Gateway to Multiple Instances
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "You have a load balancer, but it's still routing to ONE gateway instance!",
  hook: "That single gateway is the bottleneck. You need more instances!",
  challenge: "Scale the API Gateway horizontally to handle 5M RPS.",
  illustration: 'scaling-up',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Gateway is now massively scalable!',
  achievement: 'Multiple instances can handle 5M+ requests per second',
  metrics: [
    { label: 'Gateway instances', before: '1', after: '50+' },
    { label: 'Max throughput', before: '100K RPS', after: '5M RPS' },
    { label: 'Availability', after: '99.99%' },
  ],
  nextTeaser: "But what if a backend service goes down?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: Gateway Instance Pools',
  conceptExplanation: `Each API Gateway instance can handle ~100K requests/second. To reach 5M RPS:

**Math:**
\`\`\`
Target: 5M RPS
Per instance: 100K RPS
Instances needed: 5M ÷ 100K = 50 instances
Add buffer (20%): 50 × 1.2 = 60 instances
\`\`\`

**Gateway instances are stateless:**
- No local state (all state in Redis)
- Any instance can handle any request
- Instances can be added/removed freely
- Perfect for auto-scaling

**Auto-scaling triggers:**
- CPU > 70% → Add instances
- CPU < 30% → Remove instances
- Scale up/down in 5 instance increments
- Min 10 instances (for availability)
- Max 100 instances (cost cap)`,

  whyItMatters: 'Stateless gateways enable limitless horizontal scaling. Add instances to handle more traffic, remove to save costs.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'API Gateway (Zuul) handling peak traffic',
    howTheyDoIt: 'Runs 100+ Zuul instances that auto-scale based on traffic. During new show releases, scales up 3x in minutes.',
  },

  famousIncident: {
    title: 'GitHub\'s API Gateway Overload',
    company: 'GitHub',
    year: '2020',
    whatHappened: 'During Microsoft Build conference, API traffic spiked 10x. Their gateway couldn\'t scale fast enough, causing widespread API failures.',
    lessonLearned: 'Over-provision gateways for burst capacity. Auto-scaling takes 5-10 minutes - too slow for sudden spikes.',
    icon: '🐙',
  },

  diagram: `
Load Balancer
      │
      │ Distributes across
      │ 50-100 instances
      │
      ┌────────────┬──────────────┬─────────────┐
      ▼            ▼              ▼             ▼
┌──────────┐ ┌──────────┐  ┌──────────┐  ┌──────────┐
│Gateway 1 │ │Gateway 2 │  │Gateway 3 │..│Gateway N │
│ 100K RPS │ │ 100K RPS │  │ 100K RPS │  │ 100K RPS │
└────┬─────┘ └────┬─────┘  └────┬─────┘  └────┬─────┘
     │            │              │             │
     └────────────┴──────────────┴─────────────┘
                  │
          All share Redis
          for state
`,

  keyPoints: [
    'Gateway instances are stateless (no local state)',
    'Each instance handles ~100K RPS',
    'Auto-scale based on CPU/traffic metrics',
    'Maintain minimum instances for high availability',
  ],

  quickCheck: {
    question: 'Why must gateway instances be stateless?',
    options: [
      'Stateless is faster',
      'So any instance can handle any request (enables horizontal scaling)',
      'Stateless uses less memory',
      'It\'s required by HTTP',
    ],
    correctIndex: 1,
    explanation: 'Stateless means no sticky sessions needed. Load balancer can route to any instance, enabling true horizontal scaling.',
  },

  keyConcepts: [
    { title: 'Stateless', explanation: 'No local state stored in gateway', icon: '🔄' },
    { title: 'Auto-Scaling', explanation: 'Automatically add/remove instances', icon: '📊' },
    { title: 'Instance Pool', explanation: 'Group of identical gateway instances', icon: '🏊' },
  ],
};

const step7: GuidedStep = {
  id: 'api-gateway-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from horizontal scaling',
    taskDescription: 'Configure API Gateway to run multiple instances',
    successCriteria: [
      'Click on API Gateway component',
      'Go to Configuration tab',
      'Set instances to 50 or more',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'api_gateway', 'app_server', 'auth_service', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
      { fromType: 'api_gateway', toType: 'cache' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on the API Gateway component to configure it',
    level2: 'Set instance count to 50+ to handle 5M RPS (each instance = 100K RPS)',
    solutionComponents: [{ type: 'api_gateway', config: { instances: 50 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Message Queue for Protocol Translation
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔄',
  scenario: "Backend services are complaining: 'REST is too slow!'",
  hook: "Your User Service team wants to use gRPC for performance, but clients expect REST.",
  challenge: "Add protocol translation so clients use REST but backends use gRPC.",
  illustration: 'protocol-mismatch',
};

const step8Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Protocol translation is working!',
  achievement: 'Clients use REST, backends use gRPC - best of both worlds',
  metrics: [
    { label: 'External protocol', after: 'REST (JSON)' },
    { label: 'Internal protocol', after: 'gRPC (binary)' },
    { label: 'Backend latency', before: '100ms', after: '50ms' },
  ],
  nextTeaser: "But what if a backend service crashes?",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Protocol Translation: REST to gRPC',
  conceptExplanation: `Clients want REST (easy to use), but backends want gRPC (fast binary protocol).

**Why gRPC for backends?**
- **10x smaller payloads** (binary vs JSON)
- **2x faster** serialization
- **Multiplexing** multiple requests on one connection
- **Strongly typed** contracts (protobuf)

**Gateway translation:**
\`\`\`
Client: GET /v18.0/me HTTP/1.1

Gateway translates to:

gRPC: userService.GetUser(user_id="12345")

Backend responds:

gRPC: User{id:12345, name:"Alice"}

Gateway translates back to:

HTTP/1.1 200 OK
{"id": "12345", "name": "Alice"}
\`\`\`

**Why not just use REST everywhere?**
At Facebook's scale, gRPC's efficiency saves millions in infrastructure costs.`,

  whyItMatters: 'Protocol translation lets you optimize internal systems (gRPC) while keeping a stable external API (REST).',

  realWorldExample: {
    company: 'Google',
    scenario: 'All public APIs are REST, internal services use gRPC',
    howTheyDoIt: 'API Gateway (Apigee/Cloud Endpoints) translates REST to gRPC. Clients never know backends are gRPC.',
  },

  famousIncident: {
    title: 'Uber\'s gRPC Migration',
    company: 'Uber',
    year: '2019',
    whatHappened: 'Migrated internal services from REST to gRPC. Reduced datacenter costs by 30% due to smaller payloads and faster processing.',
    lessonLearned: 'Binary protocols (gRPC, Thrift) are worth the complexity at scale.',
    icon: '🚗',
  },

  diagram: `
Client                Gateway                Backend
  │                     │                      │
  │  GET /v18.0/me      │                      │
  ├────────────────────▶│                      │
  │                     │  gRPC: GetUser()     │
  │                     ├─────────────────────▶│
  │                     │                      │
  │                     │  gRPC: User{}        │
  │                     │◀─────────────────────┤
  │  JSON: {user}       │                      │
  │◀────────────────────┤                      │
  │                     │                      │

REST (public)           Translation         gRPC (internal)
- Easy to use           happens here        - Fast
- JSON                                      - Binary
- Verbose                                   - Compact
`,

  keyPoints: [
    'Clients use REST (easy), backends use gRPC (fast)',
    'Gateway translates requests/responses',
    'gRPC is 10x smaller and 2x faster',
    'Best of both worlds: public REST, internal gRPC',
  ],

  quickCheck: {
    question: 'What\'s the main advantage of gRPC over REST for internal services?',
    options: [
      'gRPC is easier to implement',
      'Binary protocol is smaller and faster than JSON',
      'gRPC works in browsers',
      'gRPC doesn\'t need HTTP',
    ],
    correctIndex: 1,
    explanation: 'gRPC uses binary protobuf instead of text JSON, resulting in much smaller payloads and faster serialization.',
  },

  keyConcepts: [
    { title: 'REST', explanation: 'Text-based HTTP APIs (public-facing)', icon: '📄' },
    { title: 'gRPC', explanation: 'Binary protocol buffer APIs (internal)', icon: '⚡' },
    { title: 'Translation', explanation: 'Convert between protocols at gateway', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'api-gateway-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Transform protocols (REST to gRPC)',
    taskDescription: 'Add a Message Queue for async protocol translation',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Buffer protocol translation for high-throughput scenarios', displayName: 'Message Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'API Gateway connected to Message Queue',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'api_gateway', 'app_server', 'auth_service', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
      { fromType: 'api_gateway', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'message_queue' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Message Queue component onto the canvas',
    level2: 'Connect API Gateway to Message Queue for async request handling',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'api_gateway', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add Service Registry for Dynamic Routing
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🗺️',
  scenario: "A new backend service launched, but the gateway doesn't know about it!",
  hook: "Hardcoded routing is brittle. Every new service requires a gateway code change.",
  challenge: "Add a service registry for dynamic service discovery.",
  illustration: 'service-discovery',
};

const step9Celebration: CelebrationContent = {
  emoji: '🔍',
  message: 'Dynamic service discovery is working!',
  achievement: 'Gateway automatically discovers new backend services',
  metrics: [
    { label: 'Routing', before: 'Hardcoded', after: 'Dynamic' },
    { label: 'New service deployment', before: 'Requires gateway restart', after: 'Automatic' },
    { label: 'Service health', after: 'Monitored' },
  ],
  nextTeaser: "But we need circuit breakers to handle service failures...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Service Discovery: Dynamic Routing with Registry',
  conceptExplanation: `Hardcoded routing doesn't scale. You need **dynamic service discovery**.

**Service Registry (like Consul, Zookeeper):**
- Services register themselves on startup
- Gateway polls for service updates
- Unhealthy services are automatically removed

**How it works:**
\`\`\`
1. User Service starts → Registers with Consul:
   {
     "service": "user-service",
     "address": "10.0.1.5:8080",
     "health_check": "/health"
   }

2. Gateway polls Consul every 10 seconds
   → Updates routing table

3. Request arrives: GET /v18.0/me
   → Gateway looks up "user-service" in registry
   → Routes to 10.0.1.5:8080

4. If service fails health check
   → Consul marks it unhealthy
   → Gateway removes from routing
\`\`\`

**Benefits:**
- Zero-downtime deployments
- Automatic failover
- No hardcoded IPs`,

  whyItMatters: 'At Facebook scale with 1000+ services, manual routing configuration is impossible. Service discovery is essential.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Managing 700+ microservices',
    howTheyDoIt: 'Uses Eureka (service registry). Services register on startup. Zuul gateway discovers services dynamically.',
  },

  famousIncident: {
    title: 'Target\'s Black Friday Service Discovery Failure',
    company: 'Target',
    year: '2019',
    whatHappened: 'Their service registry crashed during Black Friday. Gateway couldn\'t find backend services, causing widespread outages. Lost millions in revenue.',
    lessonLearned: 'Service registry is critical infrastructure. Must be highly available (multi-node cluster).',
    icon: '🎯',
  },

  diagram: `
┌─────────────────────────────────────┐
│       Service Registry              │
│         (Consul/ZK)                 │
│                                     │
│  user-service → 10.0.1.5:8080  ✓   │
│  feed-service → 10.0.2.3:8080  ✓   │
│  post-service → 10.0.3.7:8080  ✗   │
└──────────┬──────────────────────────┘
           │ Poll every 10s
           │ Get healthy services
           ▼
    ┌──────────────┐
    │ API Gateway  │
    │              │
    │ Routing Table│
    │ /me → 10.0.1.5
    │ /feed → 10.0.2.3
    └──────────────┘
`,

  keyPoints: [
    'Service registry tracks healthy service instances',
    'Services register themselves on startup',
    'Gateway polls for routing updates',
    'Failed health checks → service removed automatically',
  ],

  quickCheck: {
    question: 'Why use service discovery instead of hardcoded backend addresses?',
    options: [
      'Service discovery is faster',
      'Enables automatic failover and zero-downtime deployments',
      'Service discovery is more secure',
      'It\'s required by HTTP',
    ],
    correctIndex: 1,
    explanation: 'Service discovery enables dynamic routing. When services scale up/down or fail, gateway automatically adapts.',
  },

  keyConcepts: [
    { title: 'Service Registry', explanation: 'Tracks available service instances', icon: '📋' },
    { title: 'Health Check', explanation: 'Periodic check if service is alive', icon: '💓' },
    { title: 'Dynamic Routing', explanation: 'Routing updates without restarts', icon: '🔄' },
  ],
};

const step9: GuidedStep = {
  id: 'api-gateway-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-1: Route requests (now with dynamic discovery)',
    taskDescription: 'Add a Service Registry for dynamic service discovery',
    componentsNeeded: [
      { type: 'service_registry', reason: 'Track and discover backend services dynamically', displayName: 'Service Registry' },
    ],
    successCriteria: [
      'Service Registry component added',
      'API Gateway connected to Service Registry',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'api_gateway', 'app_server', 'auth_service', 'cache', 'message_queue', 'service_registry'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
      { fromType: 'api_gateway', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'message_queue' },
      { fromType: 'api_gateway', toType: 'service_registry' },
    ],
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Service Registry (Consul/Zookeeper) component onto the canvas',
    level2: 'Connect API Gateway to Service Registry for dynamic service discovery',
    solutionComponents: [{ type: 'service_registry' }],
    solutionConnections: [{ from: 'api_gateway', to: 'service_registry' }],
  },
};

// =============================================================================
// STEP 10: Add Monitoring for Observability
// =============================================================================

const step10Story: StoryContent = {
  emoji: '📊',
  scenario: "API errors are spiking, but you have no idea why!",
  hook: "Users report 'slow APIs' but you can't tell which service is the bottleneck.",
  challenge: "Add monitoring to observe gateway performance and debug issues.",
  illustration: 'monitoring-dashboard',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a Facebook-scale API Gateway!',
  achievement: 'A production-ready gateway handling 5M requests per second',
  metrics: [
    { label: 'Throughput', after: '5M RPS' },
    { label: 'Latency overhead', after: '<10ms p99' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Rate limiting', after: 'Active' },
    { label: 'Auth validation', after: '<1ms' },
    { label: 'Observability', after: 'Full visibility' },
  ],
  nextTeaser: "You've mastered API Gateway design at massive scale!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Observability: Metrics, Logging, and Tracing',
  conceptExplanation: `At 5M RPS, you can't debug by reading logs. You need **observability**.

**Three pillars:**

1. **Metrics** (what's happening?)
   - Request rate (RPS)
   - Latency (p50, p95, p99)
   - Error rate (5xx errors)
   - Cache hit rate
   - Rate limit rejections

2. **Logging** (what happened?)
   - Request/response logs
   - Error stack traces
   - Audit logs (who called what)
   - Sampling: Log 1% of requests (5M logs/sec is too much!)

3. **Distributed Tracing** (where's the bottleneck?)
   - Track request across gateway → services
   - Identify slow services
   - Visualize call graph

**Alerts:**
- Error rate >1% → Page on-call
- p99 latency >50ms → Warning
- Rate limit hit rate >10% → Investigate abuse`,

  whyItMatters: 'Without observability, debugging at scale is impossible. You need metrics to know WHAT\'s wrong, logs to know WHY, and traces to know WHERE.',

  realWorldExample: {
    company: 'Facebook',
    scenario: 'Monitoring 5M RPS across API Gateway',
    howTheyDoIt: 'Uses Scuba (custom metrics DB), Logview (distributed logs), and distributed tracing. Engineers can query any metric in real-time.',
  },

  famousIncident: {
    title: 'GitHub\'s Observability Blind Spot',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'During a database failover, their monitoring system couldn\'t see what was happening. Incident took 24+ hours to resolve because they were debugging blind.',
    lessonLearned: 'Observability is not optional. Invest in monitoring BEFORE you need it.',
    icon: '🔍',
  },

  diagram: `
API Gateway
     │
     ├─── Metrics ────▶ Prometheus/Datadog
     │                  (RPS, latency, errors)
     │
     ├─── Logs ───────▶ Elasticsearch
     │                  (request details)
     │
     └─── Traces ─────▶ Jaeger/Zipkin
                        (distributed tracing)

On-call engineer sees:
┌────────────────────────────────┐
│  Dashboard                     │
│  RPS: 5M                       │
│  p99 Latency: 8ms              │
│  Error Rate: 0.1%              │
│  Cache Hit Rate: 95%           │
│                                │
│  Alert: User Service slow!     │
│  Trace: gateway (2ms)          │
│         → user-svc (100ms) ⚠️  │
└────────────────────────────────┘
`,

  keyPoints: [
    'Metrics show what\'s happening in real-time',
    'Logs explain why errors occurred',
    'Traces identify which service is slow',
    'Alerts notify on-call when things break',
  ],

  quickCheck: {
    question: 'At 5M RPS, why not log every request?',
    options: [
      'Logging is too slow',
      'Would generate 5M log lines per second - too expensive to store',
      'Logs aren\'t useful',
      'It\'s against compliance rules',
    ],
    correctIndex: 1,
    explanation: '5M logs/sec = 300M logs/minute = 18B logs/hour. Use sampling (log 1%) and focus on metrics for high-level monitoring.',
  },

  keyConcepts: [
    { title: 'Metrics', explanation: 'Real-time counters and gauges', icon: '📊' },
    { title: 'Logs', explanation: 'Event records for debugging', icon: '📝' },
    { title: 'Traces', explanation: 'Request flow across services', icon: '🔍' },
  ],
};

const step10: GuidedStep = {
  id: 'api-gateway-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs need observability for production readiness',
    taskDescription: 'Add a Monitoring system for metrics, logs, and traces',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Track gateway performance and debug issues', displayName: 'Monitoring' },
    ],
    successCriteria: [
      'Monitoring component added',
      'API Gateway connected to Monitoring',
      'All components are properly configured',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'api_gateway', 'app_server', 'auth_service', 'cache', 'message_queue', 'service_registry', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
      { fromType: 'api_gateway', toType: 'auth_service' },
      { fromType: 'api_gateway', toType: 'cache' },
      { fromType: 'api_gateway', toType: 'message_queue' },
      { fromType: 'api_gateway', toType: 'service_registry' },
      { fromType: 'api_gateway', toType: 'monitoring' },
    ],
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Monitoring component onto the canvas',
    level2: 'Connect API Gateway to Monitoring for observability',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [{ from: 'api_gateway', to: 'monitoring' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l5ApiGatewayFacebookGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-api-gateway-facebook',
  title: 'Design Facebook-Scale API Gateway',
  description: 'Build an API Gateway handling 5M RPS with rate limiting, auth, and protocol translation',
  difficulty: 'advanced',
  estimatedMinutes: 70,

  welcomeStory: {
    emoji: '🚪',
    hook: "You've been hired as Staff Engineer at Meta!",
    scenario: "Your mission: Build the API Gateway that powers Facebook's Graph API, handling 5 million requests per second from 3 billion users worldwide.",
    challenge: "Can you design a gateway that's fast, secure, and resilient at massive scale?",
  },

  requirementsPhase: apiGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'API Gateway Pattern',
    'Request Routing',
    'OAuth 2.0 & JWT Authentication',
    'Rate Limiting (Token Bucket)',
    'Load Balancing',
    'Horizontal Scaling',
    'Protocol Translation (REST to gRPC)',
    'Service Discovery',
    'Circuit Breakers',
    'Observability (Metrics, Logs, Traces)',
  ],

  ddiaReferences: [
    'Chapter 1: Reliability and scalability',
    'Chapter 4: Encoding (REST vs gRPC)',
    'Chapter 6: Partitioning (for rate limiting)',
    'Chapter 8: Distributed system troubles',
  ],
};

export default l5ApiGatewayFacebookGuidedTutorial;
