import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Comprehensive API Gateway Platform Guided Tutorial - FR-FIRST EDITION
 *
 * An advanced story-driven tutorial that teaches API gateway concepts
 * while building a production-grade API gateway platform.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working gateway (routing, basic auth)
 * Steps 4-11: Apply advanced NFRs (rate limiting, transformation, caching, circuit breaker, etc.)
 *
 * Key Concepts Covered:
 * - Request routing and load balancing
 * - Authentication and authorization
 * - Rate limiting and throttling
 * - Request/response transformation
 * - Response caching
 * - Circuit breaker pattern
 * - API versioning
 * - Monitoring and observability
 *
 * Pedagogy: FR-FIRST - First make it ROUTE, then make it SECURE, then make it SCALE
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const apiGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a comprehensive API Gateway Platform for a microservices architecture",

  interviewer: {
    name: 'Jordan Kim',
    role: 'Staff Infrastructure Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-routing',
      category: 'functional',
      question: "What's the primary job of an API gateway? What does it do?",
      answer: "An API gateway is the **single entry point** for all client requests. Its core job is:\n\n1. **Route requests**: Accept incoming API calls and forward them to the correct backend service\n2. **Aggregate responses**: Combine responses from multiple services into one\n3. **Protocol translation**: Convert between different protocols (HTTP to gRPC, REST to GraphQL, etc.)\n\nExample: A mobile app calls `/api/user/profile` → Gateway routes to User Service\nA web app calls `/api/orders/123` → Gateway routes to Order Service",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "API Gateway is reverse proxy + intelligent routing",
    },
    {
      id: 'authentication',
      category: 'functional',
      question: "How should the gateway handle authentication? Should every backend service verify tokens?",
      answer: "NO! The gateway should handle auth **once at the edge**:\n\n1. Client sends API key or JWT token\n2. Gateway validates the token\n3. Gateway extracts user identity and permissions\n4. Gateway forwards authenticated requests to backend with user context\n5. Backend services trust the gateway (don't re-validate)\n\nThis prevents every service from implementing auth separately!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Centralized auth at gateway = simpler backend services",
    },
    {
      id: 'rate-limiting',
      category: 'functional',
      question: "How do we prevent clients from overwhelming our services with too many requests?",
      answer: "Implement **rate limiting** at the gateway level:\n\n1. Track requests per API key/user\n2. Define limits: 1000 requests/minute for free tier, 10,000/min for premium\n3. Return `429 Too Many Requests` when limit exceeded\n4. Include retry headers: `Retry-After: 60`\n\nThe gateway enforces limits BEFORE requests hit backend services.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Rate limiting protects backend services from abuse",
    },
    {
      id: 'transformation',
      category: 'functional',
      question: "What if clients need different response formats? Some want XML, some want JSON?",
      answer: "The gateway should handle **request/response transformation**:\n\n1. **Request transformation**: Convert client request to backend format\n   - Example: Convert XML → JSON before forwarding\n2. **Response transformation**: Convert backend response to client format\n   - Example: Convert JSON → XML for legacy clients\n3. **Field mapping**: Rename fields, filter sensitive data\n   - Example: Remove internal fields before sending to client",
      importance: 'critical',
      revealsRequirement: 'FR-5',
      learningPoint: "Transformation decouples client contracts from backend implementations",
    },

    // IMPORTANT - Clarifications
    {
      id: 'caching',
      category: 'clarification',
      question: "Should the gateway cache responses? How does that work?",
      answer: "Yes! The gateway can cache **GET requests** to reduce backend load:\n\n1. Client requests `/api/products/123`\n2. Gateway checks cache first\n3. **Cache hit**: Return cached response (instant!)\n4. **Cache miss**: Forward to backend, cache response, return to client\n5. Set TTL: Cache for 60 seconds, then refresh\n\nThis dramatically reduces load on backend services!",
      importance: 'important',
      insight: "Gateway-level caching can handle 80%+ of read traffic",
    },
    {
      id: 'circuit-breaker',
      category: 'clarification',
      question: "What happens if a backend service is down or responding very slowly?",
      answer: "Implement **circuit breaker pattern** at the gateway:\n\n1. **Closed state**: Normal operation, forward requests\n2. **Open state**: Service failing, immediately return error (don't forward)\n3. **Half-open state**: Periodically test if service recovered\n\nThis prevents cascading failures and gives services time to recover!",
      importance: 'important',
      insight: "Circuit breakers prevent one failing service from bringing down entire system",
    },
    {
      id: 'api-versioning',
      category: 'clarification',
      question: "How do we handle multiple API versions? We can't break old clients!",
      answer: "The gateway handles **API versioning**:\n\n1. **Path-based**: `/v1/users` vs `/v2/users`\n2. **Header-based**: `Accept: application/vnd.api.v2+json`\n3. Gateway routes to appropriate backend version\n4. Old clients continue using v1, new clients use v2",
      importance: 'important',
      insight: "API versioning at gateway enables backward compatibility",
    },

    // SCOPE
    {
      id: 'scope-graphql',
      category: 'scope',
      question: "Should we support GraphQL in addition to REST?",
      answer: "For MVP, let's focus on **REST APIs only**. GraphQL support can be v2 feature.",
      importance: 'nice-to-have',
      insight: "REST is more common for API gateways - start there",
    },
    {
      id: 'scope-websockets',
      category: 'scope',
      question: "What about WebSocket connections for real-time data?",
      answer: "Not for MVP. WebSockets require different handling (stateful connections). Let's defer to v2.",
      importance: 'nice-to-have',
      insight: "WebSockets add complexity - good to defer",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-routing', 'authentication', 'rate-limiting'],
  criticalFRQuestionIds: ['core-routing', 'authentication', 'rate-limiting'],
  criticalScaleQuestionIds: [], // NFRs will be gathered in later steps

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Route requests to backend services',
      description: 'Accept incoming API requests and route them to the correct backend microservice',
      emoji: '🚦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Load balance across service instances',
      description: 'Distribute requests evenly across multiple instances of each service',
      emoji: '⚖️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Authenticate and authorize requests',
      description: 'Validate API keys/tokens and check permissions before forwarding',
      emoji: '🔐',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Rate limit per client/API key',
      description: 'Enforce request limits to prevent abuse and protect backend services',
      emoji: '🚧',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Transform requests/responses',
      description: 'Convert between formats and filter/map fields',
      emoji: '🔄',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Cache GET responses',
      description: 'Store and serve cached responses to reduce backend load',
      emoji: '💾',
    },
    {
      id: 'fr-7',
      text: 'FR-7: Circuit breaker for failing services',
      description: 'Detect failing services and fail fast to prevent cascading failures',
      emoji: '⚡',
    },
    {
      id: 'fr-8',
      text: 'FR-8: Support API versioning',
      description: 'Route requests to appropriate API version based on path or headers',
      emoji: '📦',
    },
  ],

  outOfScope: [
    'GraphQL support (v2)',
    'WebSocket connections (v2)',
    'gRPC protocol translation (v2)',
    'API analytics dashboard (v2)',
  ],

  keyInsight: "An API gateway is the **traffic cop** of your microservices architecture. It handles routing, security, and resilience so backend services can focus on business logic. We'll build it step by step: first make it route, then make it secure, then make it resilient and fast!",
};

// =============================================================================
// STEP 1: Connect Client to API Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "You've been hired to build an API Gateway for a growing microservices platform.",
  hook: "Right now, clients connect directly to 15 different backend services. It's chaos - each service has its own auth, rate limiting, and monitoring.",
  challenge: "Create a single entry point - an API Gateway that sits between clients and backend services.",
  illustration: 'gateway-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your API Gateway is online!",
  achievement: "All client traffic now flows through a single entry point",
  metrics: [
    { label: 'Gateway status', after: 'Online' },
    { label: 'Entry points', before: '15 services', after: '1 gateway' },
  ],
  nextTeaser: "But the gateway doesn't know how to route requests yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway: The Single Entry Point',
  conceptExplanation: `An **API Gateway** is a reverse proxy that sits between clients and your backend services.

**Why use an API gateway?**
1. **Single entry point**: Clients only need to know one URL
2. **Centralized logic**: Handle auth, rate limiting, logging in one place
3. **Service abstraction**: Backend services can change without breaking clients
4. **Protocol translation**: Convert between HTTP, gRPC, WebSocket, etc.

**Without Gateway:**
- Client → User Service (auth logic here)
- Client → Order Service (auth logic here)
- Client → Payment Service (auth logic here)
Each service duplicates auth, rate limiting, etc.!

**With Gateway:**
- Client → Gateway (auth once) → User/Order/Payment Services
All cross-cutting concerns handled in gateway!`,

  whyItMatters: `In microservices architectures, API gateways are **essential**:
- Reduce client complexity (1 endpoint vs 100s)
- Enforce security policies consistently
- Monitor and log all traffic in one place
- Enable gradual service migration`,

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Managing 100+ microservices for millions of devices',
    howTheyDoIt: 'Netflix built Zuul, an API gateway that handles billions of requests daily, providing routing, security, and resilience',
  },

  keyPoints: [
    'API Gateway is the single entry point for all client requests',
    'It routes requests to appropriate backend services',
    'Centralizes cross-cutting concerns (auth, rate limiting, logging)',
    'Decouples clients from backend service architecture',
  ],

  diagram: `
    [Mobile App]  ──┐
    [Web App]     ──┼──▶ [API Gateway] ──┬──▶ [User Service]
    [Partner API] ──┘                    ├──▶ [Order Service]
                                         └──▶ [Payment Service]
  `,

  interviewTip: 'Always mention API Gateway for microservices designs - it shows you understand service architecture patterns.',
};

const step1: GuidedStep = {
  id: 'api-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,
  title: 'Connect Client to API Gateway',
  story: step1Story,
  learnPhase: step1LearnPhase,
  celebration: step1Celebration,
  practicePhase: {
    frText: 'FR-1: Route requests to backend services',
    taskDescription: 'Add an API Gateway between clients and backend services',
    componentsNeeded: [
      { type: 'client', reason: 'Represents mobile/web apps making API calls', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Single entry point for routing and security', displayName: 'API Gateway' },
    ],
    successCriteria: [
      'Client connected to API Gateway',
      'Gateway ready to route requests',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
    ],
  },
  hints: {
    level1: 'Add a Client and an API Gateway, then connect them',
    level2: 'Drag Client and API Gateway components onto canvas, then connect Client to API Gateway',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
    ],
  },
};

// =============================================================================
// STEP 2: Add Backend Services and Implement Routing Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🛣️',
  scenario: "Your gateway is running, but it doesn't know where to send requests!",
  hook: "A client sends `GET /api/users/123` but the gateway has no routing rules. The request just times out.",
  challenge: "Add backend services and implement routing logic to forward requests to the correct service.",
  illustration: 'routing',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Routing works!",
  achievement: "Gateway now intelligently routes requests based on URL paths",
  metrics: [
    { label: 'Routing rules', after: 'Implemented' },
    { label: 'Backend services', after: 'Connected' },
  ],
  nextTeaser: "But all services are exposed without any security...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Request Routing: Path-Based Forwarding',
  conceptExplanation: `The gateway needs **routing rules** to determine where to forward each request.

**Common routing strategies:**

1. **Path-based routing** (most common):
   - \`/api/users/*\` → User Service
   - \`/api/orders/*\` → Order Service
   - \`/api/payments/*\` → Payment Service

2. **Header-based routing**:
   - \`X-Service: users\` → User Service

3. **Host-based routing**:
   - \`users.api.com\` → User Service
   - \`orders.api.com\` → Order Service

**Routing Logic:**
\`\`\`python
def route_request(path):
    if path.startswith('/api/users'):
        return forward_to('user-service')
    elif path.startswith('/api/orders'):
        return forward_to('order-service')
    elif path.startswith('/api/payments'):
        return forward_to('payment-service')
    else:
        return 404_not_found()
\`\`\``,

  whyItMatters: `Intelligent routing enables:
- **Service isolation**: Each service handles its own domain
- **Independent scaling**: Scale services independently based on load
- **Team autonomy**: Different teams own different services
- **Gradual migration**: Route 10% to new version, 90% to old`,

  realWorldExample: {
    company: 'Uber',
    scenario: 'Routing ride requests to regional services',
    howTheyDoIt: 'Uber\'s API gateway routes based on user location - US requests go to US services, EU requests go to EU services',
  },

  keyPoints: [
    'Path-based routing is the most common pattern',
    'Routing rules map URL patterns to backend services',
    'Gateway rewrites paths before forwarding (e.g., /api/users → /users)',
    'Use regex or prefix matching for flexible routing',
  ],

  diagram: `
Request: GET /api/users/123
    │
    ▼
[API Gateway]
    │
    ├─ Path starts with /api/users?  → [User Service]
    ├─ Path starts with /api/orders? → [Order Service]
    └─ Path starts with /api/payments? → [Payment Service]
  `,

  interviewTip: 'Mention path-based routing first - it\'s the standard. Then discuss advanced routing (canary, A/B testing) if time permits.',
};

const step2: GuidedStep = {
  id: 'api-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,
  title: 'Add Backend Services and Routing',
  story: step2Story,
  learnPhase: step2LearnPhase,
  celebration: step2Celebration,
  practicePhase: {
    frText: 'FR-1: Route requests to backend services',
    taskDescription: 'Add backend services and implement routing logic in the gateway',
    componentsNeeded: [
      { type: 'app_server', reason: 'Backend microservices (User, Order, Payment)', displayName: 'Backend Services' },
    ],
    successCriteria: [
      'At least 2 backend services added',
      'Gateway connected to services',
      'Routing logic implemented in gateway',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add App Server components for backend services, connect them to the gateway, and write routing code',
    level2: 'Add 2-3 App Server components (User Service, Order Service). Write Python code in API Gateway to route based on URL path.',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 3: Add Authentication and Authorization
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔐',
  scenario: "SECURITY BREACH! Anonymous users are accessing private user data!",
  hook: "Anyone can call `/api/users/123/private-data` and see sensitive information. No authentication required!",
  challenge: "Implement authentication at the gateway to verify API keys or JWT tokens before forwarding requests.",
  illustration: 'security-breach',
};

const step3Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Gateway is now secure!",
  achievement: "All requests are authenticated before reaching backend services",
  metrics: [
    { label: 'Unauthorized requests', before: 'Allowed', after: 'Blocked' },
    { label: 'Auth validation', after: 'At gateway edge' },
  ],
  nextTeaser: "But malicious users are flooding us with requests...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Authentication at the Gateway Edge',
  conceptExplanation: `**Centralized authentication** is a key benefit of API gateways.

**Authentication Flow:**
1. Client sends request with credentials (API key, JWT token)
2. Gateway validates the credentials
3. Gateway extracts user identity and permissions
4. Gateway adds user context to request headers
5. Gateway forwards authenticated request to backend
6. Backend trusts gateway (no re-authentication needed)

**Common Auth Methods:**
- **API Keys**: Simple, good for server-to-server
- **JWT Tokens**: Stateless, contains user claims
- **OAuth 2.0**: Delegated authorization (3rd party apps)

**Example:**
\`\`\`python
def authenticate_request(request):
    token = request.headers.get('Authorization')
    if not token:
        return 401_unauthorized()

    user = verify_jwt_token(token)  # Validate signature
    if not user:
        return 401_unauthorized()

    # Add user context for backend
    request.headers['X-User-ID'] = user.id
    request.headers['X-User-Role'] = user.role

    return forward_to_backend(request)
\`\`\``,

  whyItMatters: `Gateway authentication provides:
- **Single source of truth**: One place to validate credentials
- **Simplified backends**: Services don't need auth logic
- **Consistent security**: All services protected equally
- **Performance**: Validate once at edge vs in every service`,

  famousIncident: {
    title: 'Broken Authentication Leads to Massive Data Breach',
    company: 'Various Companies',
    year: '2019-2023',
    whatHappened: 'Multiple companies had API endpoints without proper authentication, allowing attackers to access millions of user records by simply calling APIs without credentials.',
    lessonLearned: 'NEVER expose APIs without authentication. Gateway-level auth ensures no endpoint is accidentally left open.',
    icon: '🚨',
  },

  realWorldExample: {
    company: 'AWS API Gateway',
    scenario: 'Protecting millions of API endpoints',
    howTheyDoIt: 'AWS API Gateway validates JWT tokens, API keys, and IAM credentials at the edge before forwarding to Lambda functions',
  },

  keyPoints: [
    'Validate credentials ONCE at the gateway edge',
    'Backend services trust the gateway (no re-auth)',
    'Return 401 for invalid/missing credentials',
    'Add user context headers (X-User-ID, X-User-Role) for backends',
  ],

  diagram: `
┌────────┐  Token   ┌─────────────┐  Authenticated  ┌─────────┐
│ Client │ ──────▶  │ API Gateway │  ────────────▶  │ Backend │
└────────┘          │  ✓ Validate │  + User headers └─────────┘
                    │  ✓ Extract  │
                    └─────────────┘
                         │
                    [Auth Service]  ← Validate token
  `,

  quickCheck: {
    question: 'Why is it better to authenticate at the gateway vs in each service?',
    options: [
      'It\'s faster',
      'It ensures consistent security and simplifies backend services',
      'It\'s required by law',
      'It reduces network traffic',
    ],
    correctIndex: 1,
    explanation: 'Centralizing auth at the gateway ensures no service is accidentally left unsecured, and backend services can focus on business logic.',
  },

  keyConcepts: [
    { title: 'API Key', explanation: 'Static credential for server-to-server auth', icon: '🔑' },
    { title: 'JWT Token', explanation: 'Stateless token containing user claims', icon: '🎫' },
    { title: 'Auth Service', explanation: 'Validates credentials and returns user info', icon: '🔐' },
  ],
};

const step3: GuidedStep = {
  id: 'api-gateway-step-3',
  stepNumber: 3,
  frIndex: 2,
  title: 'Add Authentication',
  story: step3Story,
  learnPhase: step3LearnPhase,
  celebration: step3Celebration,
  practicePhase: {
    frText: 'FR-3: Authenticate and authorize requests',
    taskDescription: 'Add an Auth Service and implement authentication logic in the gateway',
    componentsNeeded: [
      { type: 'app_server', reason: 'Auth service to validate tokens/API keys', displayName: 'Auth Service' },
    ],
    successCriteria: [
      'Auth Service added and connected to gateway',
      'Authentication logic implemented in gateway',
      'Unauthorized requests return 401',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway', 'app_server'],
    requiredConnections: [
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add an Auth Service and connect it to the gateway. Update gateway code to validate credentials.',
    level2: 'Add App Server as Auth Service. In gateway code, validate Authorization header before routing.',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Implement Rate Limiting
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🚨',
  scenario: "ATTACK! A malicious client is sending 100,000 requests per second!",
  hook: "Your backend services are crashing under the load. Legitimate users can't access the API. You're losing money!",
  challenge: "Implement rate limiting at the gateway to protect backend services from abuse.",
  illustration: 'ddos-attack',
};

const step4Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Attack mitigated!',
  achievement: 'Rate limiting now protects backend services from abuse',
  metrics: [
    { label: 'Abusive requests', before: 'Overwhelm services', after: 'Blocked at gateway' },
    { label: 'Backend load', before: '100K RPS', after: '1K RPS' },
  ],
  nextTeaser: "But rate limit counters are slow - we need a cache...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting: Protecting Your Services',
  conceptExplanation: `**Rate limiting** restricts how many requests a client can make in a time window.

**Common Rate Limiting Algorithms:**

1. **Token Bucket** (most common):
   - Each client has a bucket with N tokens
   - Each request consumes 1 token
   - Tokens refill at fixed rate (e.g., 10/second)
   - Reject if bucket is empty

2. **Leaky Bucket**:
   - Requests enter queue (bucket)
   - Processed at fixed rate
   - Overflow requests rejected

3. **Fixed Window**:
   - Count requests in fixed windows (e.g., per minute)
   - Reset counter at window boundary
   - Simple but has burst issues

4. **Sliding Window**:
   - Count requests in rolling time window
   - More accurate than fixed window

**Implementation:**
\`\`\`python
def check_rate_limit(api_key):
    key = f"rate_limit:{api_key}"
    count = redis.incr(key)  # Increment counter

    if count == 1:
        redis.expire(key, 60)  # Set 60 second expiry

    if count > 1000:  # Limit: 1000 req/min
        return 429_too_many_requests()

    return allow_request()
\`\`\``,

  whyItMatters: `Rate limiting is **essential** for:
- **DDoS protection**: Prevent denial of service attacks
- **Fair usage**: Ensure all users get fair access
- **Cost control**: Prevent runaway API costs
- **Service stability**: Protect backends from overload`,

  famousIncident: {
    title: 'GitHub DDoS Attack Overwhelms Services',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub suffered a massive DDoS attack with 1.35 Tbps traffic. Without proper rate limiting, their services were overwhelmed for 20 minutes before mitigation kicked in.',
    lessonLearned: 'Rate limiting must be implemented at the edge (gateway/CDN) to protect infrastructure.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'Twitter API',
    scenario: 'Managing millions of third-party apps',
    howTheyDoIt: 'Twitter enforces strict rate limits per API key: 900 requests/15 min for user endpoints, 15 requests/15 min for search',
  },

  keyPoints: [
    'Implement rate limiting at gateway to protect all backend services',
    'Track limits per API key or user ID',
    'Return 429 status with Retry-After header',
    'Use Redis for distributed rate limit counters',
  ],

  diagram: `
Request from API Key XYZ
    │
    ▼
[API Gateway]
    │
    ├─ Check Redis: rate_limit:XYZ = 950 requests/min
    │  Limit: 1000/min → ALLOW ✓
    │
    ├─ Increment: rate_limit:XYZ = 951
    │
    └─ Forward to backend

Request 1001 from same API Key:
    │
    ▼
[API Gateway]
    │
    └─ Check Redis: rate_limit:XYZ = 1000
       Limit: 1000/min → REJECT ✗
       Return: 429 Too Many Requests
  `,

  quickCheck: {
    question: 'Why implement rate limiting at the gateway instead of each backend service?',
    options: [
      'It\'s easier to code',
      'It protects services BEFORE requests hit them, and enforces consistent limits',
      'It\'s required by HTTP spec',
      'It makes requests faster',
    ],
    correctIndex: 1,
    explanation: 'Gateway-level rate limiting blocks abusive traffic before it can overwhelm backend services.',
  },

  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Each client has tokens that refill over time', icon: '🪣' },
    { title: '429 Status', explanation: 'Too Many Requests - rate limit exceeded', icon: '🚫' },
    { title: 'Sliding Window', explanation: 'Rolling time window for accurate limiting', icon: '🪟' },
  ],
};

const step4: GuidedStep = {
  id: 'api-gateway-step-4',
  stepNumber: 4,
  frIndex: 3,
  title: 'Implement Rate Limiting',
  story: step4Story,
  learnPhase: step4LearnPhase,
  celebration: step4Celebration,
  practicePhase: {
    frText: 'FR-4: Rate limit per client/API key',
    taskDescription: 'Implement rate limiting logic in the gateway',
    successCriteria: [
      'Rate limiting logic implemented in gateway',
      'Tracks requests per API key',
      'Returns 429 when limit exceeded',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway'],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Write rate limiting code in the API Gateway',
    level2: 'Implement token bucket algorithm: track requests per API key, enforce limits like 1000/min',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Redis Cache for Rate Limit Counters
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your rate limiting works, but it's SLOW!",
  hook: "Every request queries a database to check rate limits. Latency increased from 10ms to 200ms. Users are complaining!",
  challenge: "Add a Redis cache to store rate limit counters in-memory for lightning-fast checks.",
  illustration: 'slow-performance',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Rate limiting is now instant!',
  achievement: 'Redis cache provides sub-millisecond rate limit checks',
  metrics: [
    { label: 'Rate limit latency', before: '200ms', after: '<1ms' },
    { label: 'Gateway throughput', before: '100 RPS', after: '10K RPS' },
  ],
  nextTeaser: "But responses are still slow - let's cache them too!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Redis: In-Memory Cache for Speed',
  conceptExplanation: `**Redis** is an in-memory data store that's perfect for rate limiting.

**Why Redis for Rate Limiting?**
1. **Fast**: Sub-millisecond latency (stored in RAM)
2. **Atomic operations**: \`INCR\` command is thread-safe
3. **Automatic expiry**: \`EXPIRE\` command auto-deletes old counters
4. **Distributed**: Multiple gateway instances share same counters

**Rate Limiting with Redis:**
\`\`\`python
# Token bucket algorithm
def check_rate_limit(api_key):
    key = f"rate_limit:{api_key}:minute"

    # Atomic increment and get count
    count = redis.incr(key)

    # Set expiry on first request
    if count == 1:
        redis.expire(key, 60)  # 60 seconds

    # Check limit
    if count > 1000:
        return reject_with_429()

    return allow_request()
\`\`\`

**Other Gateway Use Cases for Redis:**
- Store session data
- Cache authentication tokens
- Distributed locks for coordination
- API response caching`,

  whyItMatters: `Without Redis:
- Rate limiting requires slow database queries
- Hard to share counters across gateway instances
- No automatic cleanup of old counters
- Can't handle high request volumes`,

  famousIncident: {
    title: 'Cloudflare Cache Poisoning Incident',
    company: 'Cloudflare',
    year: '2022',
    whatHappened: 'A bug in Cloudflare\'s cache logic caused rate limit counters to be shared across different customers, effectively allowing attackers to bypass rate limits.',
    lessonLearned: 'Always namespace cache keys properly (e.g., tenant:api_key:counter) to prevent cross-contamination.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Kong API Gateway',
    scenario: 'Handling 100K+ requests per second',
    howTheyDoIt: 'Kong uses Redis for rate limiting, caching, and distributed coordination across gateway clusters',
  },

  keyPoints: [
    'Redis provides sub-millisecond rate limit checks',
    'Use INCR for atomic counter increments',
    'Use EXPIRE for automatic cleanup',
    'Multiple gateway instances share same Redis cluster',
  ],

  diagram: `
┌────────┐          ┌─────────────┐          ┌───────┐
│ Client │ ──────▶  │ API Gateway │ ──────▶  │ Redis │
└────────┘  Request └─────────────┘  Check   └───────┘
                         │             counter
                         │
                    < 1ms latency!
                         │
                    Forward if allowed
                         ▼
                   [Backend Service]
  `,

  quickCheck: {
    question: 'Why is Redis better than a database for rate limiting?',
    options: [
      'Redis is free',
      'Redis stores data in memory for sub-millisecond latency',
      'Redis is more reliable',
      'Redis uses less disk space',
    ],
    correctIndex: 1,
    explanation: 'Redis stores data in RAM, providing <1ms latency vs 10-100ms for disk-based databases.',
  },

  keyConcepts: [
    { title: 'In-Memory', explanation: 'Data stored in RAM for speed', icon: '⚡' },
    { title: 'Atomic Operations', explanation: 'Thread-safe increments', icon: '🔐' },
    { title: 'TTL/Expiry', explanation: 'Auto-delete old data', icon: '⏰' },
  ],
};

const step5: GuidedStep = {
  id: 'api-gateway-step-5',
  stepNumber: 5,
  frIndex: 3,
  title: 'Add Redis for Rate Limiting',
  story: step5Story,
  learnPhase: step5LearnPhase,
  celebration: step5Celebration,
  practice: {
    task: 'Add Redis cache and connect it to the gateway for rate limiting',
    hints: {
      componentsNeeded: [
        { type: 'cache', reason: 'Store rate limit counters in-memory', displayName: 'Redis' },
      ],
      connectionsNeeded: [
        { from: 'API Gateway', to: 'Redis', reason: 'Gateway checks rate limits in Redis' },
      ],
    },
    successCriteria: [
      'Redis cache added to canvas',
      'Gateway connected to Redis',
      'Rate limit counters stored in Redis',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway', 'cache'],
    requiredConnections: [
      { fromType: 'api_gateway', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Cache (Redis) component and connect it to the API Gateway',
    level2: 'Drag Cache component onto canvas, connect API Gateway to Cache',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement Response Caching
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "Your analytics show 80% of requests are for the SAME product catalog data!",
  hook: "Backend services are wasting CPU regenerating identical responses. Database is hammered with duplicate queries.",
  challenge: "Implement response caching in the gateway to serve repeated requests instantly.",
  illustration: 'repeated-queries',
};

const step6Celebration: CelebrationContent = {
  emoji: '💨',
  message: 'Response caching is live!',
  achievement: '80% of requests now served from cache in <1ms',
  metrics: [
    { label: 'Cache hit rate', after: '80%' },
    { label: 'Backend load', before: '10K RPS', after: '2K RPS' },
    { label: 'Response time', before: '100ms', after: '1ms (cached)' },
  ],
  nextTeaser: "But what happens when backend services fail?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Response Caching: Serve Faster, Load Less',
  conceptExplanation: `**Response caching** stores API responses in the gateway and serves them directly.

**Caching Strategy:**
1. Client requests \`GET /api/products/123\`
2. Gateway checks cache: \`response:GET:/api/products/123\`
3. **Cache HIT**: Return cached response (1ms)
4. **Cache MISS**: Forward to backend, cache response, return to client

**What to Cache:**
- ✅ GET requests (idempotent, safe to cache)
- ✅ Public data (product catalogs, blog posts)
- ✅ Slowly-changing data (user profiles, configurations)
- ❌ POST/PUT/DELETE (modify data)
- ❌ Personalized data (unless keyed by user ID)
- ❌ Real-time data (stock prices, live scores)

**Cache Invalidation:**
\`\`\`python
# Set TTL (Time To Live)
redis.setex("response:GET:/products/123",
            value=response_json,
            ttl=300)  # Cache for 5 minutes

# Or invalidate on updates
def update_product(product_id):
    database.update(product_id, new_data)
    redis.delete(f"response:GET:/products/{product_id}")
\`\`\`

**Cache-Control Headers:**
- \`Cache-Control: max-age=300\` - Cache for 5 minutes
- \`Cache-Control: no-cache\` - Always revalidate
- \`Cache-Control: private\` - Don't cache (user-specific)`,

  whyItMatters: `Response caching provides:
- **Massive performance gains**: 1ms vs 100ms response time
- **Reduced backend load**: 80%+ of traffic served from cache
- **Cost savings**: Fewer backend instances needed
- **Better UX**: Instant responses for users`,

  famousIncident: {
    title: 'Reddit Cache Failure Causes Total Outage',
    company: 'Reddit',
    year: '2020',
    whatHappened: 'Reddit\'s cache cluster failed, causing 100% of traffic to hit backend databases. Databases couldn\'t handle the load and crashed. Site was down for 2 hours.',
    lessonLearned: 'Have fallback strategies when cache fails. Never rely 100% on cache without graceful degradation.',
    icon: '🔴',
  },

  realWorldExample: {
    company: 'Fastly CDN',
    scenario: 'Serving billions of cached requests daily',
    howTheyDoIt: 'Fastly caches API responses at the edge, serving 95%+ from cache across global data centers',
  },

  keyPoints: [
    'Cache GET requests only (idempotent operations)',
    'Set appropriate TTL based on data freshness requirements',
    'Include cache key with relevant parameters (user ID, query params)',
    'Invalidate cache when underlying data changes',
  ],

  diagram: `
Request: GET /api/products/123
    │
    ▼
[API Gateway]
    │
    ├─ Check Redis: response:GET:/api/products/123
    │
    ├─ CACHE HIT? ──▶ Return cached response (1ms) ✓
    │
    └─ CACHE MISS? ──▶ Forward to backend (100ms)
                       │
                       ├─ Get response from backend
                       ├─ Store in Redis (TTL: 300s)
                       └─ Return to client
  `,

  quickCheck: {
    question: 'Which requests should be cached at the gateway?',
    options: [
      'All requests for maximum performance',
      'Only GET requests for non-personalized, slowly-changing data',
      'Only POST requests',
      'Only failed requests',
    ],
    correctIndex: 1,
    explanation: 'Only cache GET requests (safe/idempotent) for data that doesn\'t change frequently or isn\'t user-specific.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Response found in cache - instant', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Must fetch from backend', icon: '❌' },
    { title: 'TTL', explanation: 'Time to live - how long to cache', icon: '⏰' },
  ],
};

const step6: GuidedStep = {
  id: 'api-gateway-step-6',
  stepNumber: 6,
  frIndex: 5,
  title: 'Implement Response Caching',
  story: step6Story,
  learnPhase: step6LearnPhase,
  celebration: step6Celebration,
  practice: {
    task: 'Implement response caching logic in the gateway',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Response caching logic implemented',
      'Cache GET requests in Redis',
      'Serve cached responses directly',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway', 'cache'],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Update gateway code to cache GET responses in Redis',
    level2: 'Check Redis for cached response before forwarding. If miss, forward to backend and cache result with TTL.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Implement Request/Response Transformation
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔧',
  scenario: "You have a new client - a legacy system that only speaks XML!",
  hook: "Your backend services only return JSON. The legacy client can't parse it. They're threatening to cancel their contract!",
  challenge: "Implement request/response transformation to convert between JSON and XML.",
  illustration: 'transformation',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎭',
  message: 'Transformation enabled!',
  achievement: 'Gateway now translates between different formats seamlessly',
  metrics: [
    { label: 'Supported formats', after: 'JSON, XML, protobuf' },
    { label: 'Legacy clients', after: 'Supported' },
  ],
  nextTeaser: "But what if a backend service crashes?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Request/Response Transformation',
  conceptExplanation: `**Transformation** converts requests and responses between different formats.

**Common Transformations:**

1. **Format conversion**:
   - JSON ↔ XML
   - JSON ↔ Protocol Buffers
   - JSON ↔ MessagePack

2. **Field mapping**:
   - Rename fields: \`user_id\` → \`userId\`
   - Nest/flatten objects
   - Change data types

3. **Filtering**:
   - Remove sensitive fields (passwords, SSNs)
   - Remove internal fields (_id, _version)
   - Filter by client permissions

4. **Enrichment**:
   - Add computed fields
   - Add metadata (timestamps, request IDs)

**Example Transformation:**
\`\`\`python
def transform_response(backend_response, client_format):
    # Parse backend JSON
    data = json.loads(backend_response)

    # Remove sensitive fields
    data.pop('password_hash', None)
    data.pop('internal_notes', None)

    # Rename fields for client
    data['userId'] = data.pop('user_id')

    # Convert to client format
    if client_format == 'xml':
        return json_to_xml(data)
    else:
        return json.dumps(data)
\`\`\`

**Content Negotiation:**
Use \`Accept\` header to determine response format:
- \`Accept: application/json\` → Return JSON
- \`Accept: application/xml\` → Return XML`,

  whyItMatters: `Transformation enables:
- **Legacy support**: Serve old clients without changing backends
- **API versioning**: Transform v1 response to v2 format
- **Security**: Filter sensitive data before sending to client
- **Consistency**: Standardize field names across services`,

  realWorldExample: {
    company: 'AWS API Gateway',
    scenario: 'Supporting multiple API versions and formats',
    howTheyDoIt: 'AWS API Gateway has built-in transformation templates (VTL) to map between formats and API versions',
  },

  keyPoints: [
    'Transform at gateway to decouple clients from backend format',
    'Use Accept header for content negotiation',
    'Always filter sensitive fields before returning to client',
    'Cache transformed responses (keyed by format)',
  ],

  diagram: `
Legacy Client (needs XML)
    │
    │ Accept: application/xml
    ▼
[API Gateway]
    │
    ├─ Forward as JSON ──▶ [Backend Service]
    │                           │
    │                      Returns JSON
    │                           │
    ├─ Receives: {"userId": 123, "name": "Alice"}
    │
    ├─ Transform to XML:
    │  <user>
    │    <userId>123</userId>
    │    <name>Alice</name>
    │  </user>
    │
    └─ Return XML to client
  `,

  quickCheck: {
    question: 'Why handle transformation at the gateway instead of in backend services?',
    options: [
      'It\'s faster',
      'Backends stay simple and clients can request different formats',
      'It\'s required by HTTP spec',
      'It saves bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Gateway transformation decouples client needs from backend implementation, enabling format flexibility.',
  },

  keyConcepts: [
    { title: 'Content Negotiation', explanation: 'Client specifies desired format via Accept header', icon: '🤝' },
    { title: 'Field Mapping', explanation: 'Rename/restructure fields', icon: '🗺️' },
    { title: 'Filtering', explanation: 'Remove sensitive/internal fields', icon: '🔒' },
  ],
};

const step7: GuidedStep = {
  id: 'api-gateway-step-7',
  stepNumber: 7,
  frIndex: 4,
  title: 'Implement Transformation',
  story: step7Story,
  learnPhase: step7LearnPhase,
  celebration: step7Celebration,
  practice: {
    task: 'Implement request/response transformation in the gateway',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Transformation logic implemented',
      'Supports JSON and XML formats',
      'Filters sensitive fields',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway'],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Update gateway code to transform responses based on Accept header',
    level2: 'Parse backend JSON, filter sensitive fields, convert to XML if client requests it',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Implement Circuit Breaker Pattern
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚡',
  scenario: "DISASTER! The Payment Service is down, but the gateway keeps trying to call it!",
  hook: "Every request times out after 30 seconds. Users are stuck waiting. The gateway is wasting resources on doomed requests!",
  challenge: "Implement the circuit breaker pattern to fail fast when services are down.",
  illustration: 'circuit-breaker',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔌',
  message: 'Circuit breaker protecting your system!',
  achievement: 'Gateway now fails fast when services are unavailable',
  metrics: [
    { label: 'Failed request latency', before: '30 seconds', after: '100ms' },
    { label: 'Cascading failures', before: 'Yes', after: 'Prevented' },
  ],
  nextTeaser: "But we still have a single gateway - what if it fails?",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Circuit Breaker: Fail Fast, Recover Gracefully',
  conceptExplanation: `The **circuit breaker pattern** prevents cascading failures by failing fast when a service is down.

**Circuit Breaker States:**

1. **CLOSED** (normal operation):
   - All requests forwarded to backend
   - Track failure rate
   - If failures exceed threshold → OPEN

2. **OPEN** (service is down):
   - All requests fail immediately (don't forward)
   - Return cached response or error message
   - After timeout period → HALF-OPEN

3. **HALF-OPEN** (testing recovery):
   - Allow limited requests through
   - If successful → CLOSED
   - If failed → OPEN

**Implementation:**
\`\`\`python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.state = "CLOSED"
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.last_failure_time = None

    def call(self, service_request):
        if self.state == "OPEN":
            if time.now() - self.last_failure_time > self.timeout:
                self.state = "HALF-OPEN"
            else:
                return fail_fast_error()  # Don't even try

        try:
            response = service_request()
            self.on_success()
            return response
        except Exception:
            self.on_failure()
            raise

    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.now()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"

    def on_success(self):
        self.failure_count = 0
        self.state = "CLOSED"
\`\`\``,

  whyItMatters: `Circuit breakers prevent:
- **Cascading failures**: One service down doesn't kill entire system
- **Resource waste**: Don't wait 30s for doomed requests
- **Poor UX**: Fast failure (100ms) better than slow timeout (30s)
- **Service overload**: Give failing service time to recover`,

  famousIncident: {
    title: 'AWS S3 Outage Cascades Across Internet',
    company: 'Amazon Web Services',
    year: '2017',
    whatHappened: 'S3 failure in one region cascaded to other AWS services because they kept retrying failed S3 calls, overwhelming the network. Services without circuit breakers kept trying and eventually crashed.',
    lessonLearned: 'Circuit breakers are ESSENTIAL to prevent cascading failures in distributed systems.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Protecting against microservice failures',
    howTheyDoIt: 'Netflix built Hystrix, a circuit breaker library used across their 100+ microservices to prevent cascading failures',
  },

  keyPoints: [
    'Circuit breaker fails fast when service is unavailable',
    'Three states: CLOSED (working), OPEN (failing), HALF-OPEN (testing)',
    'Prevents cascading failures and resource waste',
    'Return cached response or friendly error when circuit is open',
  ],

  diagram: `
Circuit Breaker States:

CLOSED (normal)              OPEN (service down)
    │                             │
    │ 5+ failures                 │ After 60s timeout
    │ in 10s                      │
    ▼                             ▼
    🟢 ──────────────────────▶   🔴
    │                             │
    │                             │ Limited requests
    │                             │ to test recovery
    │                             ▼
    │                        HALF-OPEN 🟡
    │                             │
    │                             │ If success
    └─────────────────────────────┘

Request Flow:
┌────────┐  Request  ┌─────────────┐
│ Client │ ────────▶ │   Gateway   │
└────────┘           │ Circuit: 🔴 │ ─▶ Fail Fast (100ms)
                     └─────────────┘    Don't call backend!
  `,

  quickCheck: {
    question: 'What happens when a circuit breaker is OPEN?',
    options: [
      'Requests are queued until service recovers',
      'Requests fail immediately without calling the backend',
      'Requests are routed to a different service',
      'The gateway crashes',
    ],
    correctIndex: 1,
    explanation: 'OPEN circuit means fail fast - don\'t waste time calling a service that\'s known to be down.',
  },

  keyConcepts: [
    { title: 'Fail Fast', explanation: 'Return error immediately vs waiting for timeout', icon: '⚡' },
    { title: 'Threshold', explanation: 'Number of failures before opening circuit', icon: '📊' },
    { title: 'Timeout', explanation: 'How long to wait before testing recovery', icon: '⏰' },
  ],
};

const step8: GuidedStep = {
  id: 'api-gateway-step-8',
  stepNumber: 8,
  frIndex: 6,
  title: 'Implement Circuit Breaker',
  story: step8Story,
  learnPhase: step8LearnPhase,
  celebration: step8Celebration,
  practice: {
    task: 'Implement circuit breaker pattern in the gateway',
    hints: {
      componentsNeeded: [],
      connectionsNeeded: [],
    },
    successCriteria: [
      'Circuit breaker logic implemented',
      'Tracks service failure rates',
      'Fails fast when circuit is open',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway'],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Implement circuit breaker class with CLOSED/OPEN/HALF-OPEN states',
    level2: 'Track failures per service. Open circuit after 5 failures. Fail fast when open. Test recovery after timeout.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Add Load Balancer for Gateway High Availability
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your single gateway instance is a single point of failure!",
  hook: "The gateway crashed at 2 AM. ALL API traffic stopped. No one could access any service. Incident lasted 15 minutes!",
  challenge: "Add a load balancer to distribute traffic across multiple gateway instances.",
  illustration: 'single-point-failure',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Gateway is now highly available!',
  achievement: 'Load balancer enables zero-downtime deployments',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Gateway capacity', before: '10K RPS', after: 'Unlimited (horizontal scale)' },
  ],
  nextTeaser: "But we need to track all these requests...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing the Gateway',
  conceptExplanation: `A **load balancer** distributes traffic across multiple gateway instances.

**Benefits:**
1. **High availability**: If one gateway crashes, others continue
2. **Horizontal scaling**: Add more gateways during traffic spikes
3. **Zero-downtime deployments**: Update one gateway at a time
4. **Geographic distribution**: Place gateways in multiple regions

**Load Balancing Algorithms:**

1. **Round Robin** (simple):
   - Request 1 → Gateway A
   - Request 2 → Gateway B
   - Request 3 → Gateway C
   - Request 4 → Gateway A (cycle)

2. **Least Connections**:
   - Route to gateway with fewest active connections
   - Better for long-lived connections

3. **Weighted**:
   - More powerful gateways get more traffic
   - Gateway A: 70%, Gateway B: 30%

4. **IP Hash**:
   - Same client always routes to same gateway
   - Good for sticky sessions

**Health Checks:**
Load balancer pings each gateway every 10 seconds:
- If healthy: Keep routing traffic
- If unhealthy: Stop routing, mark as down`,

  whyItMatters: `Load balancers provide:
- **Zero single point of failure**: System survives gateway crashes
- **Infinite scalability**: Add more gateways as traffic grows
- **Blue/green deployments**: Update without downtime
- **Geographic resilience**: Survive data center failures`,

  famousIncident: {
    title: 'Cloudflare Global Outage from Load Balancer Misconfiguration',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A bad load balancer configuration sent 100% of traffic to servers in one data center, overwhelming them. The entire Cloudflare network went down for 30 minutes, taking millions of websites offline.',
    lessonLearned: 'Load balancer configuration is critical. Always test with gradual rollouts.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Google Cloud Load Balancer',
    scenario: 'Distributing traffic across global gateway fleet',
    howTheyDoIt: 'Google uses Maglev, a distributed load balancer that handles 1 million RPS per instance',
  },

  keyPoints: [
    'Load balancer distributes traffic across multiple gateway instances',
    'Health checks detect and route around failed gateways',
    'Enables horizontal scaling and zero-downtime updates',
    'Choose algorithm based on traffic pattern (round robin, least connections, etc.)',
  ],

  diagram: `
                    ┌──────────────┐
                    │ Gateway 1    │
┌────────┐         ┌┴──────────────┴┐
│ Client │ ──────▶ │ Load Balancer  │──▶ Gateway 2
└────────┘         └┬──────────────┬┘
                    │ Gateway 3    │
                    └──────────────┘

Health Checks (every 10s):
  Gateway 1: ✓ Healthy
  Gateway 2: ✓ Healthy
  Gateway 3: ✗ Down → Don't route here!
  `,

  quickCheck: {
    question: 'What happens if a gateway instance crashes with a load balancer?',
    options: [
      'All traffic fails',
      'Load balancer detects failure and routes to healthy gateways',
      'Traffic is queued until gateway recovers',
      'The load balancer crashes too',
    ],
    correctIndex: 1,
    explanation: 'Load balancers continuously health check gateways and automatically route around failures.',
  },

  keyConcepts: [
    { title: 'Round Robin', explanation: 'Distribute requests evenly in cycle', icon: '🔄' },
    { title: 'Health Check', explanation: 'Ping each gateway to verify availability', icon: '💓' },
    { title: 'Horizontal Scaling', explanation: 'Add more instances to handle more load', icon: '📈' },
  ],
};

const step9: GuidedStep = {
  id: 'api-gateway-step-9',
  stepNumber: 9,
  frIndex: 1,
  title: 'Add Load Balancer',
  story: step9Story,
  learnPhase: step9LearnPhase,
  celebration: step9Celebration,
  practice: {
    task: 'Add a Load Balancer between clients and API Gateway',
    hints: {
      componentsNeeded: [
        { type: 'load_balancer', reason: 'Distribute traffic across multiple gateway instances', displayName: 'Load Balancer' },
      ],
      connectionsNeeded: [
        { from: 'Client', to: 'Load Balancer', reason: 'Clients connect to load balancer' },
        { from: 'Load Balancer', to: 'API Gateway', reason: 'Load balancer distributes to gateways' },
      ],
    },
    successCriteria: [
      'Load Balancer added to canvas',
      'Client connected to Load Balancer',
      'Load Balancer connected to API Gateway',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'api_gateway'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'api_gateway' },
    ],
  },
  hints: {
    level1: 'Add Load Balancer component between Client and API Gateway',
    level2: 'Reconnect: Client → Load Balancer → API Gateway',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'api_gateway' },
    ],
  },
};

// =============================================================================
// STEP 10: Add Message Queue for Async Processing
// =============================================================================

const step10Story: StoryContent = {
  emoji: '📨',
  scenario: "Some API operations are SLOW - analytics, reports, email notifications.",
  hook: "Clients are waiting 30+ seconds for analytics reports to generate. They think the API is broken!",
  challenge: "Add a message queue for async processing - respond immediately and process in background.",
  illustration: 'slow-operations',
};

const step10Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Async processing enabled!',
  achievement: 'Long-running operations now process in background',
  metrics: [
    { label: 'API response time', before: '30 seconds', after: '100ms' },
    { label: 'User experience', before: 'Waiting...', after: 'Instant feedback' },
  ],
  nextTeaser: "But how do we monitor all this complexity?",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Async Processing with Message Queues',
  conceptExplanation: `**Message queues** enable async processing of long-running operations.

**Sync vs Async:**

**Synchronous (slow):**
1. Client: "Generate analytics report"
2. Gateway: "Wait..." (30 seconds)
3. Gateway: "Here's your report"
- Client waits 30 seconds!

**Asynchronous (fast):**
1. Client: "Generate analytics report"
2. Gateway: Publish to queue → "Request accepted! ID: 12345"
3. Worker: Process in background
4. Client polls: "Is 12345 ready?" → Eventually "Yes, here it is!"
- Client gets immediate response!

**Message Queue Pattern:**
\`\`\`python
# Gateway receives request
def generate_report(user_id):
    job_id = uuid()

    # Publish to message queue
    queue.publish('analytics.reports', {
        'job_id': job_id,
        'user_id': user_id,
        'type': 'monthly_analytics'
    })

    # Return immediately
    return {
        'job_id': job_id,
        'status': 'processing',
        'poll_url': f'/jobs/{job_id}'
    }

# Worker processes async
def worker():
    message = queue.consume('analytics.reports')
    result = generate_analytics(message['user_id'])
    cache.set(f"job:{message['job_id']}", result)
\`\`\`

**Use Cases:**
- Sending emails/notifications
- Generating reports
- Processing images/videos
- Batch operations
- Webhooks`,

  whyItMatters: `Message queues provide:
- **Fast API responses**: Return immediately vs waiting
- **Scalability**: Process jobs in parallel with worker pool
- **Reliability**: Retry failed jobs automatically
- **Decoupling**: Gateway and workers scale independently`,

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Processing webhooks reliably',
    howTheyDoIt: 'Stripe uses message queues (SQS/RabbitMQ) to deliver webhooks asynchronously with retry logic',
  },

  keyPoints: [
    'Use message queues for operations taking >500ms',
    'Return job ID immediately, let client poll for results',
    'Workers consume from queue and process in background',
    'Queues provide retry logic and guaranteed delivery',
  ],

  diagram: `
┌────────┐  POST /analytics   ┌─────────────┐  Publish  ┌───────┐
│ Client │ ─────────────────▶ │ API Gateway │ ────────▶ │ Queue │
└────────┘                    └─────────────┘           └───┬───┘
    │                                                       │
    │ Response: {job_id: 123, status: "processing"}        │
    │                                                       │
    │                         ┌──────────┐                 │
    │                         │  Worker  │ ◀───────────────┘
    │                         └────┬─────┘  Consume
    │                              │
    │                         Process job
    │                              │
    │  GET /jobs/123              ▼
    │ ─────────────────▶  Store result in Redis
    │
    │ Response: {status: "complete", data: {...}}
  `,

  quickCheck: {
    question: 'Why use async processing for slow operations?',
    options: [
      'It makes operations faster',
      'It provides instant API response while work happens in background',
      'It reduces costs',
      'It\'s required by HTTP spec',
    ],
    correctIndex: 1,
    explanation: 'Async processing allows gateway to respond immediately while workers handle slow operations in background.',
  },

  keyConcepts: [
    { title: 'Message Queue', explanation: 'Buffer for async work items', icon: '📬' },
    { title: 'Worker', explanation: 'Consumes and processes queue messages', icon: '⚙️' },
    { title: 'Job ID', explanation: 'Track status of async operations', icon: '🎫' },
  ],
};

const step10: GuidedStep = {
  id: 'api-gateway-step-10',
  stepNumber: 10,
  frIndex: 0,
  title: 'Add Message Queue for Async Processing',
  story: step10Story,
  learnPhase: step10LearnPhase,
  celebration: step10Celebration,
  practice: {
    task: 'Add a Message Queue and Worker for async processing',
    hints: {
      componentsNeeded: [
        { type: 'message_queue', reason: 'Buffer for long-running operations', displayName: 'Message Queue' },
        { type: 'app_server', reason: 'Worker to process queue messages', displayName: 'Worker' },
      ],
      connectionsNeeded: [
        { from: 'API Gateway', to: 'Message Queue', reason: 'Gateway publishes async jobs' },
        { from: 'Message Queue', to: 'Worker', reason: 'Worker consumes jobs from queue' },
      ],
    },
    successCriteria: [
      'Message Queue added to canvas',
      'Worker added to consume from queue',
      'Gateway publishes long-running jobs to queue',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway', 'message_queue', 'app_server'],
    requiredConnections: [
      { fromType: 'api_gateway', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add Message Queue and Worker. Connect Gateway → Queue → Worker',
    level2: 'Add Message Queue component. Add App Server as Worker. Connect API Gateway to Queue, and Queue to Worker.',
    solutionComponents: [{ type: 'message_queue' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'message_queue' },
      { from: 'message_queue', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 11: Add Monitoring and Observability
// =============================================================================

const step11Story: StoryContent = {
  emoji: '🔍',
  scenario: "Your API gateway is a black box - you have NO IDEA what's happening!",
  hook: "Users report slow responses, but you can't find the problem. Which service is slow? Which endpoint? Which customer?",
  challenge: "Add monitoring and observability to track metrics, logs, and traces.",
  illustration: 'monitoring',
};

const step11Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Full visibility achieved!',
  achievement: 'You can now monitor every request and debug issues quickly',
  metrics: [
    { label: 'Visibility', before: 'Blind', after: 'Full observability' },
    { label: 'MTTR (Mean time to recovery)', before: '2 hours', after: '5 minutes' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade API Gateway!",
};

const step11LearnPhase: TeachingContent = {
  conceptTitle: 'Observability: Know What\'s Happening',
  conceptExplanation: `**Observability** means understanding system behavior through telemetry data.

**Three Pillars of Observability:**

1. **Metrics** (What's happening?):
   - Request rate (RPS)
   - Error rate (%)
   - Latency (p50, p95, p99)
   - Cache hit rate
   - Circuit breaker state

2. **Logs** (What happened?):
   - Request/response logs
   - Error logs with stack traces
   - Audit logs (who did what)
   - Structured JSON logs

3. **Traces** (Where's the bottleneck?):
   - Track request across services
   - See timing breakdown
   - Identify slow operations

**What to Track in API Gateway:**
\`\`\`python
# Log every request
logger.info({
    'request_id': uuid,
    'method': 'GET',
    'path': '/api/users/123',
    'api_key': 'key_xyz',
    'response_time_ms': 45,
    'status_code': 200,
    'cache_hit': True,
    'backend_service': 'user-service'
})

# Track metrics
metrics.increment('requests.total')
metrics.increment(f'requests.{status_code}')
metrics.histogram('response_time_ms', response_time)
metrics.gauge('rate_limit.current', current_count)

# Distributed tracing
span = tracer.start_span('api_gateway.route')
span.set_tag('service', 'user-service')
span.set_tag('cache_hit', True)
\`\`\`

**Dashboards to Build:**
- Request volume by endpoint
- Error rates over time
- Latency percentiles (p95, p99)
- Top consumers by API key
- Cache hit rates
- Circuit breaker status`,

  whyItMatters: `Observability enables:
- **Fast incident response**: Find and fix issues in minutes vs hours
- **Capacity planning**: Know when to scale
- **SLA monitoring**: Track uptime and performance
- **Cost optimization**: Identify wasteful operations`,

  famousIncident: {
    title: 'GitHub Outage from Lack of Observability',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'During a database failover, GitHub\'s monitoring didn\'t detect that the replica was out of sync. They continued serving stale data for hours before realizing. Better observability would have caught it immediately.',
    lessonLearned: 'Comprehensive monitoring is not optional - you can\'t fix what you can\'t see.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Monitoring billions of API requests',
    howTheyDoIt: 'Netflix uses their own tools (Atlas for metrics, Winston for logs, Zipkin for traces) to get complete visibility',
  },

  keyPoints: [
    'Log every request with key metadata (API key, path, response time, etc.)',
    'Track metrics: request rate, error rate, latency percentiles',
    'Use distributed tracing to track requests across services',
    'Build dashboards for at-a-glance health monitoring',
  ],

  diagram: `
┌─────────────┐
│ API Gateway │
└──────┬──────┘
       │
       ├─ Emit Metrics ──────────▶ [Prometheus/CloudWatch]
       │  • Request rate             └─▶ [Grafana Dashboard]
       │  • Error rate
       │  • Latency (p95, p99)
       │
       ├─ Send Logs ─────────────▶ [Elasticsearch/CloudWatch]
       │  • Request/response         └─▶ [Kibana Search]
       │  • Errors
       │  • Audit trail
       │
       └─ Publish Traces ────────▶ [Jaeger/X-Ray]
          • Request flow            └─▶ [Trace Visualization]
          • Timing breakdown
  `,

  quickCheck: {
    question: 'What are the three pillars of observability?',
    options: [
      'CPU, Memory, Disk',
      'Metrics, Logs, Traces',
      'Speed, Cost, Quality',
      'Auth, Cache, Queue',
    ],
    correctIndex: 1,
    explanation: 'Metrics show what\'s happening, Logs show what happened, Traces show where bottlenecks are.',
  },

  keyConcepts: [
    { title: 'Metrics', explanation: 'Numeric time-series data (RPS, latency)', icon: '📈' },
    { title: 'Logs', explanation: 'Structured event records', icon: '📝' },
    { title: 'Traces', explanation: 'Request journey across services', icon: '🔍' },
  ],
};

const step11: GuidedStep = {
  id: 'api-gateway-step-11',
  stepNumber: 11,
  frIndex: 0,
  title: 'Add Monitoring and Observability',
  story: step11Story,
  learnPhase: step11LearnPhase,
  celebration: step11Celebration,
  practice: {
    task: 'Add monitoring component and implement observability in gateway',
    hints: {
      componentsNeeded: [
        { type: 'monitoring', reason: 'Track metrics, logs, and traces', displayName: 'Monitoring' },
      ],
      connectionsNeeded: [
        { from: 'API Gateway', to: 'Monitoring', reason: 'Gateway sends telemetry data' },
      ],
    },
    successCriteria: [
      'Monitoring component added',
      'Gateway sends metrics and logs',
      'Request tracing implemented',
    ],
  },
  validation: {
    requiredComponents: ['api_gateway', 'monitoring'],
    requiredConnections: [
      { fromType: 'api_gateway', toType: 'monitoring' },
    ],
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Add Monitoring component and connect it to gateway. Update code to emit metrics/logs.',
    level2: 'Add Monitoring component. In gateway code, log each request with metadata and emit metrics (RPS, latency, errors).',
    solutionComponents: [{ type: 'monitoring' }],
    solutionConnections: [
      { from: 'api_gateway', to: 'monitoring' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const comprehensiveApiGatewayPlatformGuidedTutorial: GuidedTutorial = {
  problemId: 'comprehensive-api-gateway-guided',
  problemTitle: 'Build a Comprehensive API Gateway Platform',

  // Requirements gathering phase (Step 0)
  requirementsPhase: apiGatewayRequirementsPhase,

  totalSteps: 11,
  steps: [
    step1,  // Connect Client to API Gateway
    step2,  // Add Backend Services and Routing
    step3,  // Add Authentication
    step4,  // Implement Rate Limiting
    step5,  // Add Redis for Rate Limiting
    step6,  // Implement Response Caching
    step7,  // Implement Transformation
    step8,  // Implement Circuit Breaker
    step9,  // Add Load Balancer
    step10, // Add Message Queue
    step11, // Add Monitoring
  ],
};

export function getComprehensiveApiGatewayPlatformGuidedTutorial(): GuidedTutorial {
  return comprehensiveApiGatewayPlatformGuidedTutorial;
}
