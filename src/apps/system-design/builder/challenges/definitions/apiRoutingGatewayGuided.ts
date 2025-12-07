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
 * API Routing Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches API Gateway design concepts
 * while building a routing gateway for microservices. Each step tells a story that motivates the task.
 *
 * Focus Areas:
 * - Path-based routing
 * - Header routing
 * - Service discovery integration
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution (static routing) - FRs satisfied!
 * Steps 4-6: Apply NFRs (dynamic discovery, health checks, rate limiting)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const apiGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an API Gateway for a microservices architecture",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Staff Engineer',
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
      question: "What's the main job of this API Gateway? What do clients experience?",
      answer: "The API Gateway is a single entry point for clients. When a client sends a request like 'GET /users/123', the gateway figures out which backend service handles users (Users Service), and forwards the request there. The client only knows the gateway URL - not the individual microservices.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "API Gateway is a reverse proxy - clients talk to one endpoint, gateway routes to many backend services",
    },
    {
      id: 'routing-rules',
      category: 'functional',
      question: "How does the gateway know which service to route to? What determines the routing?",
      answer: "Two main routing strategies:\n1. **Path-based**: '/users/*' → Users Service, '/orders/*' → Orders Service\n2. **Header-based**: 'X-API-Version: v2' → V2 Service, otherwise → V1 Service\nThis lets us route based on URL patterns or HTTP headers like version, tenant ID, or region.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Routing rules are configured - path patterns and header matching determine which backend receives each request",
    },
    {
      id: 'service-discovery',
      category: 'functional',
      question: "What if backend services are added or removed dynamically? How does the gateway find them?",
      answer: "We integrate with Service Discovery (like Consul or Eureka). When a new 'Users Service' instance starts, it registers itself with Service Discovery. The gateway queries Service Discovery to get the current list of healthy service instances. No manual updates needed!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Service Discovery enables dynamic routing - no hardcoded IPs, services can scale up/down automatically",
    },

    // IMPORTANT - Clarifications
    {
      id: 'request-modification',
      category: 'clarification',
      question: "Does the gateway modify requests or responses, or just forward them?",
      answer: "For the MVP, the gateway just forwards requests transparently. It might add headers like 'X-Forwarded-For' or 'X-Request-ID' for tracing, but doesn't modify the body. Request/response transformation can be a v2 feature.",
      importance: 'important',
      insight: "Keep it simple - gateway is a smart router, not a data transformer",
    },
    {
      id: 'authentication',
      category: 'clarification',
      question: "Does the gateway handle authentication and authorization?",
      answer: "Not for this interview. We're focusing on routing logic. In production, you'd typically add auth middleware (JWT validation, OAuth), but let's treat that as a separate concern for now.",
      importance: 'nice-to-have',
      insight: "Auth is important but orthogonal to routing - good interview scope management",
    },
    {
      id: 'protocol-support',
      category: 'scope',
      question: "What protocols should the gateway support? Just HTTP/REST?",
      answer: "HTTP/1.1 and HTTP/2 for REST APIs. We can discuss WebSocket or gRPC support as extensions, but let's focus on HTTP REST for the core design.",
      importance: 'important',
      insight: "Starting with HTTP/REST is standard - covers 90% of API traffic",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'throughput-rps',
      category: 'throughput',
      question: "How many requests per second should the gateway handle?",
      answer: "We expect 10,000 requests/second on average",
      importance: 'critical',
      calculation: {
        formula: "10K RPS distributed across multiple backend services",
        result: "~10K RPS total throughput",
      },
      learningPoint: "Gateway throughput determines how many gateway instances you need",
    },
    {
      id: 'throughput-services',
      category: 'throughput',
      question: "How many backend services are we routing to?",
      answer: "Start with 5 microservices (Users, Orders, Products, Payments, Notifications). Plan for growth to 20+ services over time.",
      importance: 'important',
      learningPoint: "Service count affects routing table size and service discovery overhead",
    },

    // 2. PAYLOAD
    {
      id: 'payload-size',
      category: 'payload',
      question: "What's the typical request/response size?",
      answer: "Most API requests are small JSON payloads - 1-10KB. Some file uploads might be 1-5MB, but those are rare.",
      importance: 'important',
      insight: "Small payloads mean gateway isn't bandwidth-constrained, CPU is the bottleneck",
    },

    // 3. BURSTS
    {
      id: 'burst-traffic',
      category: 'burst',
      question: "Are there traffic spikes we need to handle?",
      answer: "Yes, during sales events or product launches, traffic can spike to 3x normal load (30K RPS). The gateway needs to auto-scale.",
      importance: 'critical',
      calculation: {
        formula: "10K avg × 3 = 30K peak",
        result: "~30K RPS at peak",
      },
      learningPoint: "Design for peak load, not average",
    },

    // 4. LATENCY
    {
      id: 'latency-overhead',
      category: 'latency',
      question: "What's the acceptable latency overhead for the gateway?",
      answer: "The gateway should add < 10ms p99 latency. Clients expect fast responses - the gateway is just a router, not a processor.",
      importance: 'critical',
      learningPoint: "Gateway latency is pure overhead - keep it minimal with efficient routing and connection pooling",
    },
    {
      id: 'latency-backend',
      category: 'latency',
      question: "What about end-to-end latency from client to backend service?",
      answer: "p99 should be under 200ms total (including gateway + backend processing). The gateway itself should be < 10ms of that.",
      importance: 'important',
      insight: "Gateway is fast path - routing table lookup + TCP connection should be minimal",
    },

    // 5. RELIABILITY
    {
      id: 'reliability-failover',
      category: 'reliability',
      question: "What happens if a backend service instance goes down?",
      answer: "The gateway should detect unhealthy instances via health checks and stop routing traffic to them. Service Discovery helps maintain the list of healthy instances.",
      importance: 'critical',
      learningPoint: "Health checks + service discovery = automatic failover",
    },
    {
      id: 'reliability-retry',
      category: 'reliability',
      question: "Should the gateway retry failed requests?",
      answer: "For idempotent operations (GET, PUT, DELETE), yes - retry once with a different backend instance. For non-idempotent operations (POST), no - let the client decide whether to retry.",
      importance: 'important',
      insight: "Smart retries improve reliability but require idempotency awareness",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['core-routing', 'routing-rules', 'service-discovery'],
  criticalFRQuestionIds: ['core-routing', 'routing-rules', 'service-discovery'],
  criticalScaleQuestionIds: ['throughput-rps', 'burst-traffic', 'latency-overhead', 'reliability-failover'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Single entry point for clients',
      description: 'Clients send all requests to the gateway URL - gateway routes to backend services',
      emoji: '🚪',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Path-based and header-based routing',
      description: 'Route requests based on URL path patterns (/users/* → Users Service) and HTTP headers (X-API-Version: v2)',
      emoji: '🗺️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Service discovery integration',
      description: 'Dynamically discover backend service instances - no hardcoded IPs, services can scale automatically',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (B2B API)',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 3,
    readWriteRatio: 'Mixed',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 10000, peak: 30000 },
    maxPayloadSize: '~10KB (JSON APIs)',
    redirectLatencySLA: 'p99 < 10ms (gateway overhead)',
    createLatencySLA: 'p99 < 200ms (end-to-end)',
  },

  architecturalImplications: [
    '✅ 10K RPS → Need multiple gateway instances + load balancer',
    '✅ < 10ms gateway overhead → In-memory routing table, connection pooling',
    '✅ 30K RPS peak → Auto-scaling based on CPU/RPS metrics',
    '✅ Service discovery → Dynamic routing, no manual config updates',
    '✅ Health checks → Automatic failover to healthy instances',
  ],

  outOfScope: [
    'Authentication/Authorization (OAuth, JWT)',
    'Request/Response transformation',
    'WebSocket or gRPC support',
    'Rate limiting (can add as bonus step)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple Client → Gateway → Backend routing solution that satisfies our functional requirements. Once it works, we'll optimize for scale and resilience in later steps.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "You've been hired to build an API Gateway for a growing e-commerce platform.",
  hook: "The company has 5 microservices (Users, Orders, Products, Payments, Notifications), and clients are struggling to manage 5 different endpoints. They need one unified entry point!",
  challenge: "Connect the Client to the API Gateway to create a single entry point for all requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your gateway is online!",
  achievement: "Clients can now send requests to a single endpoint",
  metrics: [
    { label: 'Entry Point', after: 'Unified' },
    { label: 'Client Complexity', before: '5 endpoints', after: '1 endpoint' },
  ],
  nextTeaser: "But the gateway is just a dummy proxy... let's teach it how to route!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'API Gateway Pattern: Single Entry Point',
  conceptExplanation: `The **API Gateway** is one of the most important patterns in microservices architecture.

**The Problem Without Gateway:**
- Clients need to know 5 different service URLs
- Each service has different auth, rate limits, protocols
- Hard to change backend architecture without breaking clients

**The Solution: API Gateway**
- Single URL for clients: api.company.com
- Gateway handles routing, auth, rate limiting, logging
- Backend services can change independently

Think of it like a hotel concierge - guests only talk to the concierge, who knows which department handles each request.`,
  whyItMatters: 'Without a gateway, every client needs to implement cross-cutting concerns (auth, retry, logging). With a gateway, you implement once and all clients benefit.',
  keyPoints: [
    'Single entry point simplifies client integration',
    'Gateway handles cross-cutting concerns (auth, logging, rate limiting)',
    'Backend services can evolve independently of clients',
    'Gateway is a reverse proxy - receives requests, forwards to backends',
  ],
  diagram: `
┌─────────────┐         ┌─────────────────┐
│   Client    │         │   API Gateway   │
│  (Mobile)   │ ──────▶ │  (Entry Point)  │
└─────────────┘         └─────────────────┘
`,
  keyConcepts: [
    {
      title: 'Reverse Proxy',
      explanation: 'Gateway sits in front of backend services, forwarding client requests',
      icon: '🔄',
    },
    {
      title: 'Single Entry Point',
      explanation: 'Clients only know one URL - gateway routes internally',
      icon: '🚪',
    },
  ],
  quickCheck: {
    question: 'What is the main benefit of an API Gateway?',
    options: [
      'Stores user data',
      'Single entry point for clients, simplifies integration',
      'Runs business logic',
      'Replaces all backend services',
    ],
    correctIndex: 1,
    explanation: 'API Gateway provides a single entry point, hiding the complexity of multiple backend services from clients.',
  },
};

const step1: GuidedStep = {
  id: 'api-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Clients can submit requests to the gateway',
    taskDescription: 'Add Client and API Gateway, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents client applications', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Entry point for routing', displayName: 'API Gateway' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'API Gateway', reason: 'Clients send all requests here' },
    ],
    successCriteria: ['Add Client', 'Add API Gateway', 'Connect Client → API Gateway'],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway'],
    requiredConnections: [{ fromType: 'client', toType: 'api_gateway' }],
  },
  hints: {
    level1: 'Add Client and API Gateway, then connect them',
    level2: 'Drag Client and API Gateway from sidebar, then drag from Client to API Gateway',
    solutionComponents: [{ type: 'client' }, { type: 'api_gateway' }],
    solutionConnections: [{ from: 'client', to: 'api_gateway' }],
  },
};

// =============================================================================
// STEP 2: Path-Based Routing - Teaching the Gateway
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🗺️',
  scenario: "Your gateway is connected, but it doesn't know WHERE to route requests!",
  hook: "A client sends 'GET /users/123'. The gateway stares blankly. It needs routing rules: which path goes to which backend service?",
  challenge: "Configure path-based routing rules and add backend services for the gateway to route to.",
  illustration: 'configure-routing',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Your gateway can now route requests!",
  achievement: "Path-based routing configured successfully",
  metrics: [
    { label: 'Routing Rules', after: 'Path-based' },
    { label: 'Backend Services', after: '2 services' },
  ],
  nextTeaser: "Great! But what about API versioning? Different clients need different backend versions...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Path-Based Routing',
  conceptExplanation: `**Path-based routing** uses URL patterns to determine which backend service handles each request.

**Example Routing Table:**
\`\`\`
/users/*      → Users Service (port 8001)
/orders/*     → Orders Service (port 8002)
/products/*   → Products Service (port 8003)
\`\`\`

**How it works:**
1. Client sends: \`GET /users/123\`
2. Gateway checks routing table
3. Pattern \`/users/*\` matches → route to Users Service
4. Gateway forwards: \`GET http://users-service:8001/users/123\`

**Pattern Matching:**
- \`/users/*\` matches: \`/users/123\`, \`/users/123/orders\`
- \`/api/v1/users/*\` matches only versioned paths
- Order matters: most specific patterns first`,
  whyItMatters: 'Path-based routing is the foundation of API Gateway - it maps client-facing URLs to internal microservices without clients knowing the backend topology.',
  realWorldExample: {
    company: 'Netflix',
    scenario: 'Netflix Zuul (their API Gateway) handles millions of requests/second',
    howTheyDoIt: 'Path-based routing to 100+ microservices. /api/users/* → User Service, /api/content/* → Content Service. All routing rules stored in a centralized config.',
  },
  keyPoints: [
    'URL path patterns determine routing destination',
    'Most specific pattern wins (longest prefix match)',
    'Routing table stored in-memory for fast lookups',
    'Backend services registered with path prefixes',
  ],
  diagram: `
Client Request: GET /users/123

┌─────────────────────────────────────┐
│       API Gateway                   │
│                                     │
│  Routing Table:                     │
│  /users/*    → Users Service        │
│  /orders/*   → Orders Service       │
│  /products/* → Products Service     │
└─────────────┬───────────────────────┘
              │ Route to Users Service
              ▼
      ┌───────────────┐
      │ Users Service │
      │  Port 8001    │
      └───────────────┘
`,
  keyConcepts: [
    { title: 'Routing Table', explanation: 'Map of path patterns to backend services', icon: '🗺️' },
    { title: 'Pattern Matching', explanation: 'Wildcards like /users/* match all paths starting with /users/', icon: '🎯' },
  ],
  quickCheck: {
    question: 'If a client sends GET /users/123/orders, which routing rule matches?',
    options: [
      '/users/* (matches /users/123/orders)',
      '/orders/* (because "orders" is in the path)',
      'Both match, gateway returns error',
      'No match, gateway returns 404',
    ],
    correctIndex: 0,
    explanation: '/users/* uses longest prefix matching - /users/123/orders starts with /users/ so it routes to Users Service.',
  },
};

const step2: GuidedStep = {
  id: 'api-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Gateway must route requests based on URL path patterns',
    taskDescription: 'Add backend services (Users, Orders) and connect gateway to both with path-based routing',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Configure path routing', displayName: 'API Gateway' },
      { type: 'app_server', reason: 'Users Service backend', displayName: 'Users Service' },
      { type: 'app_server', reason: 'Orders Service backend', displayName: 'Orders Service' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'API Gateway', reason: 'Already connected in Step 1' },
      { from: 'API Gateway', to: 'Users Service', reason: 'Route /users/* here' },
      { from: 'API Gateway', to: 'Orders Service', reason: 'Route /orders/* here' },
    ],
    successCriteria: [
      'Add Users Service and Orders Service',
      'Connect API Gateway to both backend services',
      'Configure path-based routing rules',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add two backend services (Users, Orders) and connect gateway to both',
    level2: 'Add App Server components for Users and Orders, connect API Gateway to each with routing rules',
    solutionComponents: [
      { type: 'client' },
      { type: 'api_gateway' },
      { type: 'app_server' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 3: Header-Based Routing - API Versioning
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔀',
  scenario: "Your mobile app just shipped a new version with breaking API changes!",
  hook: "Old app clients need API v1, new app clients need API v2. If you route solely by path, you'll break old clients. You need smart routing based on the API version header!",
  challenge: "Implement header-based routing to route requests to different backend versions based on the X-API-Version header.",
  illustration: 'version-routing',
};

const step3Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Multi-version API support enabled!",
  achievement: "Header-based routing configured successfully",
  metrics: [
    { label: 'Routing Strategies', before: 'Path-based only', after: 'Path + Header' },
    { label: 'API Versions', after: 'v1 and v2' },
  ],
  nextTeaser: "Excellent! But hardcoded backend IPs don't scale... what if services move or auto-scale?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Header-Based Routing for API Versioning',
  conceptExplanation: `**Header-based routing** uses HTTP headers to determine routing destination.

**Common Use Cases:**
1. **API Versioning**: Route v1 and v2 to different backends
2. **Tenant Routing**: Route by \`X-Tenant-ID\` for multi-tenant SaaS
3. **Region Routing**: Route by \`X-Region\` for geo-distributed services
4. **A/B Testing**: Route by \`X-Experiment-ID\` for feature flags

**Example: API Versioning**
\`\`\`
Header: X-API-Version: v1
  → Route to Users Service v1

Header: X-API-Version: v2
  → Route to Users Service v2

No header or unknown version
  → Default to v1 (backward compatibility)
\`\`\`

**Routing Priority:**
1. Check headers first (X-API-Version, X-Tenant-ID)
2. Then check path pattern
3. Apply both to find final destination`,
  whyItMatters: 'Header-based routing enables graceful API evolution - old and new clients coexist without breaking changes. Critical for mobile apps where you can\'t force upgrades.',
  realWorldExample: {
    company: 'Stripe',
    scenario: 'Stripe supports 10+ API versions simultaneously',
    howTheyDoIt: 'Header-based routing with \`Stripe-Version: 2023-10-16\`. Each version header routes to a different backend version. Old clients continue working indefinitely.',
  },
  famousIncident: {
    title: 'Twitter API v1.0 Shutdown',
    company: 'Twitter',
    year: '2013',
    whatHappened: 'Twitter shut down API v1.0 abruptly, breaking thousands of third-party apps overnight. Developers had only 6 months notice, causing massive ecosystem disruption.',
    lessonLearned: 'Never hard-cutover API versions. Use header-based routing to run multiple versions simultaneously for years, giving clients time to migrate gracefully.',
    icon: '🐦',
  },
  keyPoints: [
    'Header-based routing enables API versioning without path changes',
    'Clients specify version via header (e.g., X-API-Version: v2)',
    'Default to old version for backward compatibility',
    'Combine with path routing for full control',
  ],
  diagram: `
Request: GET /users/123
Header: X-API-Version: v2

┌─────────────────────────────────────┐
│       API Gateway                   │
│                                     │
│  1. Check header: X-API-Version: v2 │
│  2. Check path: /users/*            │
│  3. Route to: Users Service v2      │
└─────────────┬───────────────────────┘
              │
              ▼
      ┌───────────────────┐
      │ Users Service v2  │
      │   Port 8002       │
      └───────────────────┘
`,
  keyConcepts: [
    { title: 'API Versioning', explanation: 'Run multiple API versions simultaneously', icon: '🔢' },
    { title: 'Header Matching', explanation: 'Route based on HTTP header values', icon: '🏷️' },
    { title: 'Backward Compatibility', explanation: 'Old clients still work with default routing', icon: '⏮️' },
  ],
  quickCheck: {
    question: 'Why use header-based routing instead of path-based (/v1/users vs /v2/users)?',
    options: [
      'Headers are faster to parse',
      'Keeps URLs clean, allows versioning without path changes',
      'Headers are more secure',
      'Path-based routing is deprecated',
    ],
    correctIndex: 1,
    explanation: 'Header-based routing keeps URLs clean and allows versioning existing endpoints without breaking client code that hardcodes paths.',
  },
};

const step3: GuidedStep = {
  id: 'api-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Gateway must route based on HTTP headers for API versioning',
    taskDescription: 'Add a v2 backend service and configure header-based routing for X-API-Version',
    componentsNeeded: [
      { type: 'client', reason: 'Sends versioned requests', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Configure header routing', displayName: 'API Gateway' },
      { type: 'app_server', reason: 'Users Service v1', displayName: 'Users v1' },
      { type: 'app_server', reason: 'Users Service v2', displayName: 'Users v2' },
      { type: 'app_server', reason: 'Orders Service', displayName: 'Orders' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'API Gateway', reason: 'Client requests' },
      { from: 'API Gateway', to: 'Users v1', reason: 'Default version' },
      { from: 'API Gateway', to: 'Users v2', reason: 'X-API-Version: v2' },
      { from: 'API Gateway', to: 'Orders', reason: 'Orders service' },
    ],
    successCriteria: [
      'Add Users Service v2',
      'Configure header-based routing for X-API-Version',
      'Ensure backward compatibility (default to v1)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'app_server', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add a second Users Service for v2 and configure header-based routing',
    level2: 'Add another App Server for Users v2, connect it to gateway with header routing rule for X-API-Version: v2',
    solutionComponents: [
      { type: 'client' },
      { type: 'api_gateway' },
      { type: 'app_server' },
      { type: 'app_server' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'app_server' },
      { from: 'api_gateway', to: 'app_server' },
      { from: 'api_gateway', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Service Discovery - Dynamic Backend Discovery
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔍',
  scenario: "Black Friday! Traffic is surging and your DevOps team is auto-scaling backend services.",
  hook: "They spin up 5 new Users Service instances to handle the load... but your gateway still routes to the original 2 hardcoded IPs! The new instances sit idle while the old ones crash from overload.",
  challenge: "Integrate Service Discovery so the gateway automatically finds all healthy backend instances - no manual configuration!",
  illustration: 'service-discovery',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Dynamic service discovery enabled!",
  achievement: "Gateway automatically discovers backend instances",
  metrics: [
    { label: 'Backend Discovery', before: 'Hardcoded IPs', after: 'Dynamic lookup' },
    { label: 'Auto-scaling Support', before: '❌', after: '✓' },
    { label: 'Manual Updates', before: 'Required', after: 'Zero' },
  ],
  nextTeaser: "Perfect! But what if a backend instance crashes? We need health checks...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Service Discovery Integration',
  conceptExplanation: `**The Problem with Hardcoded IPs:**
- Backend services scale up/down dynamically
- IP addresses change when containers restart
- Manual config updates don't scale (100+ services)

**The Solution: Service Discovery**
Service Discovery is a registry of all running service instances.

**How it works:**
1. **Service Registration**: When Users Service starts, it registers:
   - Service Name: "users-service"
   - IP: 10.0.1.45
   - Port: 8001
   - Health Check: http://10.0.1.45:8001/health

2. **Service Discovery**: Gateway queries registry:
   - "Give me all healthy instances of users-service"
   - Returns: [10.0.1.45:8001, 10.0.1.46:8001, 10.0.1.47:8001]

3. **Load Balancing**: Gateway picks one instance (round-robin, least connections)

**Popular Service Discovery Tools:**
- **Consul**: HashiCorp, supports health checks, DNS, K/V store
- **Eureka**: Netflix OSS, Java-based, AWS-friendly
- **etcd**: Kubernetes uses it for service discovery
- **Kubernetes DNS**: Built-in for K8s (service-name.namespace.svc.cluster.local)`,
  whyItMatters: 'Service Discovery enables true cloud-native architecture - services can scale elastically without manual config updates. Critical for auto-scaling and container orchestration.',
  realWorldExample: {
    company: 'Uber',
    scenario: 'Uber has 2000+ microservices across multiple data centers',
    howTheyDoIt: 'They use custom service discovery (TChannel/Cherami) integrated with their gateway. When a service scales from 10 to 100 instances, gateway automatically discovers all instances within seconds.',
  },
  keyPoints: [
    'Service Discovery is a registry of running service instances',
    'Services register themselves on startup',
    'Gateway queries registry to find healthy instances',
    'Enables auto-scaling without manual config',
    'Health checks ensure only healthy instances receive traffic',
  ],
  diagram: `
┌──────────────────────────────────────────────┐
│         Service Discovery Flow               │
├──────────────────────────────────────────────┤
│                                              │
│  1. REGISTRATION                             │
│     ┌──────────────┐    Register            │
│     │ Users Service│ ─────────────┐          │
│     │ 10.0.1.45    │              │          │
│     └──────────────┘              ▼          │
│                          ┌─────────────────┐ │
│     ┌──────────────┐     │Service Discovery│ │
│     │ Users Service│────▶│   (Consul)      │ │
│     │ 10.0.1.46    │     └─────────┬───────┘ │
│     └──────────────┘               │          │
│                                    │          │
│  2. DISCOVERY                      │          │
│     ┌──────────────┐    Query      │          │
│     │ API Gateway  │◀───────────────┘         │
│     └──────┬───────┘                          │
│            │ Response: [10.0.1.45, 10.0.1.46] │
│            ▼                                  │
│     Pick instance & route                    │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Service Registry', explanation: 'Central database of all service instances', icon: '📋' },
    { title: 'Registration', explanation: 'Services register themselves on startup', icon: '📝' },
    { title: 'Discovery', explanation: 'Gateway queries registry to find services', icon: '🔍' },
    { title: 'Health Checks', explanation: 'Registry tracks which instances are healthy', icon: '💓' },
  ],
  quickCheck: {
    question: 'What happens when a new Users Service instance starts up?',
    options: [
      'Nothing - admin must manually update gateway config',
      'Instance registers with Service Discovery, gateway auto-discovers it',
      'Gateway crashes due to unknown instance',
      'Instance waits for manual approval',
    ],
    correctIndex: 1,
    explanation: 'New instances self-register with Service Discovery. Gateway periodically queries the registry and automatically starts routing traffic to the new instance.',
  },
};

const step4: GuidedStep = {
  id: 'api-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Gateway must dynamically discover backend service instances',
    taskDescription: 'Add Service Discovery component and connect it to the gateway and backend services',
    componentsNeeded: [
      { type: 'client', reason: 'Client requests', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Query service registry', displayName: 'API Gateway' },
      { type: 'service_discovery', reason: 'Registry of services', displayName: 'Service Discovery' },
      { type: 'app_server', reason: 'Backend services', displayName: 'Backend Services' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'API Gateway', reason: 'Client requests' },
      { from: 'API Gateway', to: 'Service Discovery', reason: 'Query for service instances' },
      { from: 'Backend Services', to: 'Service Discovery', reason: 'Register themselves' },
      { from: 'API Gateway', to: 'Backend Services', reason: 'Route discovered instances' },
    ],
    successCriteria: [
      'Add Service Discovery component',
      'Connect Gateway to Service Discovery',
      'Connect Backend Services to Service Discovery (registration)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'service_discovery', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'service_discovery' },
      { fromType: 'app_server', toType: 'service_discovery' },
    ],
  },
  hints: {
    level1: 'Add Service Discovery and connect both gateway and backend services to it',
    level2: 'Add Service Discovery component. Connect API Gateway → Service Discovery (query) and Backend Services → Service Discovery (register)',
    solutionComponents: [
      { type: 'client' },
      { type: 'api_gateway' },
      { type: 'service_discovery' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'service_discovery' },
      { from: 'app_server', to: 'service_discovery' },
    ],
  },
};

// =============================================================================
// STEP 5: Health Checks - Automatic Failover
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💓',
  scenario: "3 AM. One of your Users Service instances runs out of memory and crashes.",
  hook: "But Service Discovery still lists it as 'running'! The gateway keeps routing traffic to the dead instance. 1 in 3 requests fail. Users are furious!",
  challenge: "Implement health checks so the gateway only routes to healthy instances.",
  illustration: 'health-checks',
};

const step5Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Automatic failover enabled!",
  achievement: "Gateway only routes to healthy instances",
  metrics: [
    { label: 'Failed Request Rate', before: '33% (1/3 dead)', after: '0%' },
    { label: 'Automatic Failover', before: '❌', after: '✓' },
    { label: 'Recovery Time', before: 'Manual', after: '< 10 seconds' },
  ],
  nextTeaser: "Amazing! But we're still missing load balancing... all traffic goes to one instance!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Health Checks and Automatic Failover',
  conceptExplanation: `**The Problem:**
Service Discovery tracks which instances *started*, but not which are *healthy*.
- Instance crashes → still in registry
- Out of memory → still in registry
- Network partition → still in registry

**The Solution: Health Checks**
Gateway (or Service Discovery) periodically pings each instance:

\`\`\`
GET http://10.0.1.45:8001/health
Response: 200 OK { "status": "healthy" }
\`\`\`

**Health Check Strategies:**

1. **Active Health Checks** (Gateway checks)
   - Gateway pings \`/health\` every 10 seconds
   - 3 consecutive failures → mark unhealthy
   - 2 consecutive successes → mark healthy again

2. **Passive Health Checks** (Traffic-based)
   - Monitor actual request success rate
   - 50% error rate in 10 requests → mark unhealthy
   - Faster detection, no extra overhead

3. **Hybrid** (Best practice)
   - Use both active and passive
   - Passive detects failures fast (real traffic)
   - Active detects recovery (health endpoint)

**Failover Flow:**
1. Request arrives at gateway
2. Gateway queries Service Discovery: "healthy users-service instances"
3. Registry returns only healthy instances
4. Gateway routes to healthy instance`,
  whyItMatters: 'Without health checks, failed instances continue receiving traffic, causing cascading failures. Health checks + automatic failover are essential for high availability.',
  realWorldExample: {
    company: 'AWS Elastic Load Balancer',
    scenario: 'ELB health checks every EC2 instance',
    howTheyDoIt: 'Configurable health check: ping /health every 30s, 2 consecutive failures = unhealthy, 10 consecutive successes = healthy. Unhealthy instances removed from rotation automatically.',
  },
  famousIncident: {
    title: 'AWS DynamoDB Outage',
    company: 'AWS',
    year: '2015',
    whatHappened: 'A metadata service that DynamoDB depends on started failing health checks. But DynamoDB\'s control plane didn\'t implement automatic failover - it kept calling the failing service. Cascading failure took down DynamoDB for 5 hours.',
    lessonLearned: 'Health checks are only useful if you STOP routing to unhealthy dependencies. Always implement automatic failover based on health status.',
    icon: '🔴',
  },
  keyPoints: [
    'Health checks detect failed instances automatically',
    'Active checks: ping /health endpoint periodically',
    'Passive checks: monitor real traffic error rates',
    'Unhealthy instances removed from routing pool',
    'Auto-recovery: healthy instances added back automatically',
  ],
  diagram: `
┌──────────────────────────────────────────────┐
│         Health Check Flow                    │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐    GET /health (10s)      │
│  │ API Gateway  │ ───────────────────┐       │
│  └──────┬───────┘                    │       │
│         │                            ▼       │
│         │                   ┌──────────────┐ │
│         │                   │ Users Svc A  │ │
│         │                   │ Status: ✓    │ │
│         │                   └──────────────┘ │
│         │                            │       │
│         │                   GET /health      │
│         │                   Response: 200 OK │
│         │                            │       │
│         │                   ┌──────────────┐ │
│         │                   │ Users Svc B  │ │
│         └──────────────────▶│ Status: ✗    │ │
│                             │ (CRASHED)    │ │
│                             └──────────────┘ │
│                                   │          │
│                            GET /health       │
│                            Response: TIMEOUT │
│                                   │          │
│         Gateway ONLY routes to A  ✓          │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Health Endpoint', explanation: '/health returns 200 OK if service is healthy', icon: '🏥' },
    { title: 'Active Checks', explanation: 'Periodic pings to health endpoint', icon: '🔔' },
    { title: 'Passive Checks', explanation: 'Monitor real request error rates', icon: '👁️' },
    { title: 'Failover', explanation: 'Automatically stop routing to unhealthy instances', icon: '🔄' },
  ],
  quickCheck: {
    question: 'Why use BOTH active and passive health checks?',
    options: [
      'Active only is sufficient for production',
      'Passive detects failures fast, active detects recovery',
      'Passive is deprecated',
      'Only one should be used to save resources',
    ],
    correctIndex: 1,
    explanation: 'Passive checks detect failures immediately (from real traffic), while active checks detect when failed instances recover (by pinging /health).',
  },
};

const step5: GuidedStep = {
  id: 'api-gateway-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Gateway must only route to healthy backend instances',
    taskDescription: 'Configure health checks on the API Gateway to monitor backend instance health',
    componentsNeeded: [
      { type: 'client', reason: 'Client requests', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Perform health checks', displayName: 'API Gateway' },
      { type: 'service_discovery', reason: 'Track healthy instances', displayName: 'Service Discovery' },
      { type: 'app_server', reason: 'Backend services', displayName: 'Backend Services' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'API Gateway', reason: 'Client requests' },
      { from: 'API Gateway', to: 'Service Discovery', reason: 'Query healthy instances' },
      { from: 'API Gateway', to: 'Backend Services', reason: 'Health check endpoints' },
    ],
    successCriteria: [
      'Configure health check interval (10s recommended)',
      'Set failure threshold (3 consecutive failures)',
      'Enable automatic failover to healthy instances',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'service_discovery', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'service_discovery' },
      { fromType: 'app_server', toType: 'service_discovery' },
    ],
  },
  hints: {
    level1: 'Configure health check settings on the API Gateway component',
    level2: 'Click API Gateway → Configure health checks with 10s interval, 3 failure threshold, /health endpoint',
    solutionComponents: [
      { type: 'client' },
      { type: 'api_gateway' },
      { type: 'service_discovery' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'service_discovery' },
      { from: 'app_server', to: 'service_discovery' },
    ],
  },
};

// =============================================================================
// STEP 6: Load Balancing - Distributing Traffic
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚖️',
  scenario: "You have 5 healthy Users Service instances, but all traffic goes to just one!",
  hook: "Instance 1 is at 100% CPU, crashing from overload. Instances 2-5 sit idle at 5% CPU. Your gateway needs to DISTRIBUTE traffic across all instances!",
  challenge: "Implement load balancing algorithms to evenly distribute requests across healthy backend instances.",
  illustration: 'load-balancing',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Load balancing enabled!",
  achievement: "Traffic evenly distributed across all healthy instances",
  metrics: [
    { label: 'CPU Distribution', before: '100% / 5% / 5% / 5% / 5%', after: '20% / 20% / 20% / 20% / 20%' },
    { label: 'Effective Capacity', before: '1 instance', after: '5 instances' },
    { label: 'Throughput', before: '1K RPS', after: '5K RPS' },
  ],
  nextTeaser: "Fantastic! Your gateway is production-ready. Let's add one more feature: rate limiting...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing Algorithms',
  conceptExplanation: `**The Problem:**
With 5 healthy instances, which one should handle the next request?

**Load Balancing Algorithms:**

**1. Round Robin** (Simplest)
- Rotate through instances: A → B → C → A → B → C
- Pros: Simple, fair distribution
- Cons: Ignores instance load, all requests treated equally

**2. Least Connections**
- Route to instance with fewest active connections
- Pros: Adapts to instance load
- Cons: Requires tracking connection count

**3. Weighted Round Robin**
- Assign weights: A(weight=2) gets 2x traffic of B(weight=1)
- Pros: Handle different instance sizes (m5.large vs t3.small)
- Cons: Manual weight configuration

**4. Random**
- Pick random instance
- Pros: Simple, works well at scale
- Cons: Can be uneven with small instance counts

**5. IP Hash (Sticky Sessions)**
- Hash client IP to always route to same instance
- Pros: Session affinity (user always hits same cache)
- Cons: Uneven if clients are behind same NAT

**Best for API Gateway: Round Robin or Least Connections**
- Stateless services → Round Robin is perfect
- Long-lived connections → Least Connections prevents overload`,
  whyItMatters: 'Without load balancing, you waste resources (idle instances) and risk overload (hot instances). Proper load balancing maximizes throughput and availability.',
  realWorldExample: {
    company: 'GitHub',
    scenario: 'GitHub routes millions of git operations per day',
    howTheyDoIt: 'They use least connections load balancing. Git clone/pull operations can take minutes, so connection count is more important than request count.',
  },
  keyPoints: [
    'Load balancing distributes traffic across instances',
    'Round Robin: simple, fair, works for stateless services',
    'Least Connections: best for variable request durations',
    'Weighted: handle different instance sizes',
    'Gateway maintains connection pools to backends for efficiency',
  ],
  diagram: `
┌──────────────────────────────────────────────┐
│         Round Robin Load Balancing           │
├──────────────────────────────────────────────┤
│                                              │
│  Request 1  ────┐                            │
│  Request 2  ────┤                            │
│  Request 3  ────┤                            │
│  Request 4  ────┤                            │
│  Request 5  ────┤                            │
│                 │                            │
│                 ▼                            │
│         ┌──────────────┐                     │
│         │ API Gateway  │                     │
│         │ Round Robin  │                     │
│         └──────┬───────┘                     │
│                │                             │
│       ┌────────┼────────┬─────────┐          │
│       │        │        │         │          │
│       ▼        ▼        ▼         ▼          │
│   ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐       │
│   │Svc A│  │Svc B│  │Svc C│  │Svc D│       │
│   │Req 1│  │Req 2│  │Req 3│  │Req 4│       │
│   │Req 5│  │     │  │     │  │     │       │
│   └─────┘  └─────┘  └─────┘  └─────┘       │
│   20% CPU  20% CPU  20% CPU  20% CPU       │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Round Robin', explanation: 'Rotate through instances in order', icon: '🔄' },
    { title: 'Least Connections', explanation: 'Route to instance with fewest connections', icon: '📊' },
    { title: 'Weighted', explanation: 'Route more traffic to higher-capacity instances', icon: '⚖️' },
    { title: 'Connection Pool', explanation: 'Reuse TCP connections to backends', icon: '🏊' },
  ],
  quickCheck: {
    question: 'Which load balancing algorithm is best for stateless REST APIs?',
    options: [
      'IP Hash (sticky sessions)',
      'Round Robin (simple and fair)',
      'Random (unpredictable)',
      'Least Connections (overkill for fast requests)',
    ],
    correctIndex: 1,
    explanation: 'For stateless services with fast requests, Round Robin is perfect - simple, fair distribution, no tracking overhead.',
  },
};

const step6: GuidedStep = {
  id: 'api-gateway-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Gateway must distribute traffic evenly across healthy instances',
    taskDescription: 'Configure load balancing algorithm on the API Gateway',
    componentsNeeded: [
      { type: 'client', reason: 'Client requests', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Configure load balancing', displayName: 'API Gateway' },
      { type: 'service_discovery', reason: 'List of healthy instances', displayName: 'Service Discovery' },
      { type: 'app_server', reason: 'Multiple backend instances', displayName: 'Backend Services' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'API Gateway', reason: 'Client requests' },
      { from: 'API Gateway', to: 'Service Discovery', reason: 'Get healthy instances' },
      { from: 'API Gateway', to: 'Backend Services', reason: 'Distribute traffic' },
    ],
    successCriteria: [
      'Configure load balancing algorithm (Round Robin recommended)',
      'Enable connection pooling for efficiency',
      'Verify even distribution across instances',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'service_discovery', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'service_discovery' },
      { fromType: 'app_server', toType: 'service_discovery' },
    ],
  },
  hints: {
    level1: 'Configure load balancing algorithm on the API Gateway',
    level2: 'Click API Gateway → Set load balancing to Round Robin, enable connection pooling',
    solutionComponents: [
      { type: 'client' },
      { type: 'api_gateway' },
      { type: 'service_discovery' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'service_discovery' },
      { from: 'app_server', to: 'service_discovery' },
    ],
  },
};

// =============================================================================
// STEP 7: Rate Limiting - Protecting Your Services (Bonus NFR)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚦',
  scenario: "A misbehaving client is hammering your API with 10,000 requests/second!",
  hook: "One bad client is consuming all your backend capacity. Legitimate users are getting timeouts. You need to protect your services from abuse!",
  challenge: "Implement rate limiting to cap requests per client and protect backend services.",
  illustration: 'rate-limiting',
};

const step7Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Production-ready API Gateway complete!",
  achievement: "Full API Gateway with routing, discovery, health checks, load balancing, and rate limiting",
  metrics: [
    { label: 'Routing', after: 'Path + Header ✓' },
    { label: 'Discovery', after: 'Dynamic ✓' },
    { label: 'Health Checks', after: 'Automated ✓' },
    { label: 'Load Balancing', after: 'Round Robin ✓' },
    { label: 'Rate Limiting', after: '1000 req/min ✓' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade API Gateway. Try the final exam to validate your design!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Rate Limiting and API Protection',
  conceptExplanation: `**Why Rate Limiting?**
Without limits, a single bad actor can:
- Overwhelm your backend services
- Cause cascading failures
- Run up your AWS bill
- Perform DDoS attacks

**Rate Limiting Strategies:**

**1. Per-Client Limits** (Most Common)
- Identify client by API key or IP address
- Limit: 1000 requests/minute per client
- Algorithm: Token Bucket or Sliding Window

**2. Per-Endpoint Limits**
- Different limits for different endpoints
- Read endpoints: 10K req/min
- Write endpoints: 1K req/min (more expensive)

**3. Global Limits**
- Total gateway throughput: 100K req/min
- Protects entire system from overload

**Token Bucket Algorithm:**
\`\`\`
Bucket capacity: 1000 tokens
Refill rate: 1000 tokens/minute (16.67/sec)

Request arrives:
  if bucket has tokens:
    take 1 token
    allow request
  else:
    return 429 Too Many Requests
\`\`\`

**Response Headers:**
\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 742
X-RateLimit-Reset: 1634567890
\`\`\``,
  whyItMatters: 'Rate limiting prevents resource exhaustion and protects your services from abuse. It\'s essential for any production API - internal or external.',
  realWorldExample: {
    company: 'Twitter API',
    scenario: 'Twitter serves billions of API requests daily',
    howTheyDoIt: 'Tiered rate limits: Free tier (300 req/15min), Premium ($100/mo for 10K req/15min). Per-endpoint limits vary: tweets/user gets higher limit than POST /tweets.',
  },
  famousIncident: {
    title: 'Cloudflare DDoS Attack',
    company: 'Cloudflare',
    year: '2021',
    whatHappened: 'Cloudflare faced a 17.2 million RPS DDoS attack - the largest on record. Without rate limiting and DDoS protection, this would have taken down their entire network.',
    lessonLearned: 'Rate limiting is the first line of defense against DDoS and abuse. Always implement it before you need it.',
    icon: '🛡️',
  },
  keyPoints: [
    'Rate limiting protects services from overload and abuse',
    'Token bucket algorithm is most common (smooth traffic)',
    'Per-client limits (by API key or IP)',
    'Return 429 Too Many Requests with Retry-After header',
    'Gateway is perfect place for rate limiting (before reaching backends)',
  ],
  diagram: `
┌──────────────────────────────────────────────┐
│         Rate Limiting (Token Bucket)         │
├──────────────────────────────────────────────┤
│                                              │
│  Client A: 1000 tokens/min                   │
│  ┌────────────────────┐                      │
│  │  Token Bucket      │                      │
│  │  ┌──┬──┬──┬──┬──┐  │                      │
│  │  │██│██│  │  │  │  │ (200 tokens left)    │
│  │  └──┴──┴──┴──┴──┘  │                      │
│  └────────────────────┘                      │
│           │                                  │
│           ▼                                  │
│  Request 801 → ALLOW (take 1 token)          │
│  Request 802 → ALLOW (take 1 token)          │
│  ...                                         │
│  Request 1001 → DENY (429 Too Many Requests) │
│                                              │
│  After 1 minute: refill to 1000 tokens       │
└──────────────────────────────────────────────┘
`,
  keyConcepts: [
    { title: 'Token Bucket', explanation: 'Tokens refill over time, each request costs 1 token', icon: '🪣' },
    { title: 'Per-Client', explanation: 'Each API key or IP has separate limit', icon: '👤' },
    { title: '429 Status', explanation: 'HTTP 429 Too Many Requests returned when over limit', icon: '🚫' },
    { title: 'Quota Headers', explanation: 'X-RateLimit-* headers tell clients their quota', icon: '📊' },
  ],
  quickCheck: {
    question: 'Where should rate limiting be implemented?',
    options: [
      'In each backend service (consistent limits)',
      'At the API Gateway (before reaching backends)',
      'At the database (protect writes)',
      'On the client side (trust clients to limit themselves)',
    ],
    correctIndex: 1,
    explanation: 'API Gateway is the perfect place for rate limiting - it protects all backend services and rejects requests early before consuming resources.',
  },
};

const step7: GuidedStep = {
  id: 'api-gateway-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Gateway must protect backend services from abuse with rate limiting',
    taskDescription: 'Configure rate limiting on the API Gateway',
    componentsNeeded: [
      { type: 'client', reason: 'Client requests', displayName: 'Client' },
      { type: 'api_gateway', reason: 'Enforce rate limits', displayName: 'API Gateway' },
      { type: 'service_discovery', reason: 'Service registry', displayName: 'Service Discovery' },
      { type: 'app_server', reason: 'Protected backends', displayName: 'Backend Services' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'API Gateway', reason: 'Rate-limited requests' },
      { from: 'API Gateway', to: 'Service Discovery', reason: 'Service lookup' },
      { from: 'API Gateway', to: 'Backend Services', reason: 'Allowed requests only' },
    ],
    successCriteria: [
      'Configure per-client rate limit (1000 req/min recommended)',
      'Enable rate limit headers (X-RateLimit-*)',
      'Return 429 Too Many Requests when over limit',
    ],
  },
  validation: {
    requiredComponents: ['client', 'api_gateway', 'service_discovery', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'api_gateway' },
      { fromType: 'api_gateway', toType: 'service_discovery' },
      { fromType: 'app_server', toType: 'service_discovery' },
    ],
  },
  hints: {
    level1: 'Configure rate limiting on the API Gateway component',
    level2: 'Click API Gateway → Set rate limit to 1000 req/min per client, enable quota headers',
    solutionComponents: [
      { type: 'client' },
      { type: 'api_gateway' },
      { type: 'service_discovery' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'api_gateway' },
      { from: 'api_gateway', to: 'service_discovery' },
      { from: 'app_server', to: 'service_discovery' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const apiRoutingGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'api-routing-gateway-guided',
  problemTitle: 'Build an API Routing Gateway - A Microservices Journey',

  // Requirements gathering phase (Step 0)
  requirementsPhase: apiGatewayRequirementsPhase,

  totalSteps: 7,
  steps: [step1, step2, step3, step4, step5, step6, step7],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Routing',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway routes requests to backend services based on path',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Header-Based Routing',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway routes based on X-API-Version header',
      traffic: { type: 'mixed', rps: 200, readRps: 100, writeRps: 100 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Service Discovery',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Gateway dynamically discovers backend instances',
      traffic: { type: 'mixed', rps: 500, readRps: 400, writeRps: 100 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: Low Latency Routing',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Gateway adds < 10ms p99 latency overhead',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 30K RPS traffic spike with auto-scaling',
      traffic: { type: 'mixed', rps: 30000, readRps: 27000, writeRps: 3000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Backend Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Gateway automatically fails over when backend crashes',
      traffic: { type: 'mixed', rps: 1000, readRps: 800, writeRps: 200 },
      duration: 90,
      failureInjection: { type: 'service_crash', atSecond: 45, recoverySecond: 65 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-C1: Rate Limiting',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Gateway protects backends with rate limiting',
      traffic: { type: 'mixed', rps: 5000, readRps: 4000, writeRps: 1000 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getApiRoutingGatewayGuidedTutorial(): GuidedTutorial {
  return apiRoutingGatewayGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = apiGatewayRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= apiGatewayRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
