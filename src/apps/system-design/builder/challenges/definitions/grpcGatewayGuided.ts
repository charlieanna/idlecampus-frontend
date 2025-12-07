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
 * gRPC Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial that teaches system design concepts
 * while building a gRPC Gateway for protocol translation.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale with NFRs (streaming, load balancing, caching, etc.)
 *
 * Key Concepts:
 * - HTTP/REST to gRPC protocol translation
 * - Bidirectional streaming support
 * - Load balancing gRPC connections
 * - Connection pooling for performance
 * - Service mesh integration
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const grpcGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a gRPC Gateway that translates HTTP/REST requests to gRPC",

  interviewer: {
    name: 'Alex Rodriguez',
    role: 'Senior Infrastructure Engineer',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-translation',
      category: 'functional',
      question: "What's the main job of a gRPC Gateway?",
      answer: "The gateway serves as a **protocol translator** between HTTP/REST clients and gRPC backend services.\n\nClients send HTTP/REST requests → Gateway translates to gRPC → Backend services respond in gRPC → Gateway translates back to HTTP/JSON",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "gRPC Gateway enables HTTP clients to communicate with gRPC services without knowing gRPC",
    },
    {
      id: 'streaming-support',
      category: 'functional',
      question: "Should the gateway support streaming?",
      answer: "Yes! gRPC has four types of streams:\n1. **Unary** (request-response)\n2. **Server streaming** (server sends stream of responses)\n3. **Client streaming** (client sends stream of requests)\n4. **Bidirectional streaming** (both sides stream)\n\nThe gateway must support all four, translating HTTP streaming (SSE/WebSockets) to gRPC streams.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Streaming is a core gRPC feature - gateway must preserve this capability",
    },
    {
      id: 'service-discovery',
      category: 'functional',
      question: "How does the gateway find backend gRPC services?",
      answer: "The gateway needs **service discovery** to locate backend services dynamically. Services register themselves, and the gateway queries the registry to find available instances.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Dynamic service discovery enables auto-scaling and failover",
    },
    {
      id: 'error-translation',
      category: 'clarification',
      question: "How should gRPC error codes map to HTTP status codes?",
      answer: "The gateway must translate gRPC status codes to appropriate HTTP codes:\n- gRPC OK → HTTP 200\n- gRPC NOT_FOUND → HTTP 404\n- gRPC PERMISSION_DENIED → HTTP 403\n- gRPC INVALID_ARGUMENT → HTTP 400\n- gRPC INTERNAL → HTTP 500",
      importance: 'critical',
      insight: "Proper error mapping ensures HTTP clients understand gRPC service errors",
    },
    {
      id: 'metadata-headers',
      category: 'clarification',
      question: "How should HTTP headers map to gRPC metadata?",
      answer: "HTTP headers should be forwarded as gRPC metadata. Critical headers like Authorization, X-Request-ID, and custom headers must be preserved for authentication and tracing.",
      importance: 'important',
      insight: "Metadata forwarding enables auth, tracing, and context propagation",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests per second should the gateway handle?",
      answer: "50,000 requests per second at steady state, with peaks up to 200,000 RPS during traffic spikes",
      importance: 'critical',
      calculation: {
        formula: "50K RPS average, 200K RPS peak",
        result: "Need connection pooling and load balancing",
      },
      learningPoint: "High throughput requires efficient connection reuse and load distribution",
    },
    {
      id: 'latency-overhead',
      category: 'latency',
      question: "What latency overhead is acceptable for the gateway?",
      answer: "The gateway should add less than 5ms of overhead (p99). Total latency budget: p99 < 100ms including backend processing.",
      importance: 'critical',
      learningPoint: "Gateway must be extremely efficient - it's in the critical path",
    },
    {
      id: 'connection-management',
      category: 'performance',
      question: "How should the gateway manage connections to backend services?",
      answer: "Use **HTTP/2 connection pooling** for gRPC backends. Maintain persistent connections with multiple streams per connection. This is critical for gRPC performance.",
      importance: 'critical',
      insight: "HTTP/2 multiplexing allows thousands of concurrent requests over few connections",
    },
    {
      id: 'load-balancing-strategy',
      category: 'reliability',
      question: "How should traffic be distributed to backend gRPC services?",
      answer: "Use **client-side load balancing** with these strategies:\n1. Round-robin for even distribution\n2. Least-connections for long-running streams\n3. Health checking to avoid failed instances",
      importance: 'critical',
      learningPoint: "gRPC load balancing is complex due to HTTP/2 connection reuse",
    },
    {
      id: 'circuit-breaking',
      category: 'reliability',
      question: "What happens if a backend service becomes unhealthy?",
      answer: "Implement **circuit breaker pattern**:\n- Detect failures (error rate, latency)\n- Open circuit after threshold breached\n- Stop sending traffic to failed service\n- Periodically test if service recovered",
      importance: 'important',
      insight: "Circuit breakers prevent cascading failures",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-translation', 'streaming-support', 'connection-management'],
  criticalFRQuestionIds: ['core-translation', 'streaming-support'],
  criticalScaleQuestionIds: ['throughput-requests', 'latency-overhead', 'load-balancing-strategy'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Protocol translation',
      description: 'Translate HTTP/REST requests to gRPC and responses back to HTTP/JSON',
      emoji: '🔄',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Streaming support',
      description: 'Support all gRPC streaming types: unary, server, client, and bidirectional',
      emoji: '📡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Service discovery',
      description: 'Dynamically discover and route to backend gRPC services',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million API calls/day',
    writesPerDay: '5 million mutations',
    readsPerDay: '5 million queries',
    peakMultiplier: 4,
    readWriteRatio: '1:1',
    calculatedWriteRPS: { average: 58, peak: 232 },
    calculatedReadRPS: { average: 58, peak: 232 },
    maxPayloadSize: '~1MB (typical API request)',
    storagePerRecord: 'Stateless gateway',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'p99 < 100ms (total)',
    createLatencySLA: 'p99 < 5ms (gateway overhead)',
  },

  architecturalImplications: [
    '✅ High RPS → Connection pooling essential for gRPC backends',
    '✅ Low latency → Minimal translation overhead, efficient streaming',
    '✅ Streaming support → HTTP/2 for both client and backend',
    '✅ Service discovery → Dynamic routing to scaled backend instances',
    '✅ Load balancing → Client-side LB for HTTP/2 connection reuse',
    '✅ High availability → Circuit breakers and health checks',
  ],

  outOfScope: [
    'GraphQL to gRPC translation',
    'gRPC-Web support',
    'Authentication implementation (pass-through only)',
    'Rate limiting (handled by API gateway)',
    'Request transformation beyond protocol translation',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple gateway that translates HTTP to gRPC. Then we'll optimize for streaming, load balancing, and performance. Protocol translation first, then production-ready features!",
};

// =============================================================================
// STEP 1: Connect HTTP Client to Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌐',
  scenario: "Welcome! You're building a gRPC Gateway to bridge HTTP/REST clients and gRPC services.",
  hook: "Your microservices backend uses gRPC, but web clients speak HTTP/REST. They can't talk to each other!",
  challenge: "Set up the basic architecture: HTTP Client → Gateway to handle incoming REST requests.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your gateway is accepting HTTP requests!',
  achievement: 'Basic HTTP ingress configured',
  metrics: [
    { label: 'HTTP endpoint', after: 'Active' },
    { label: 'Accepting requests', after: '✓' },
  ],
  nextTeaser: "But the gateway doesn't know how to translate to gRPC yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'gRPC Gateway Architecture: Bridging Two Worlds',
  conceptExplanation: `A **gRPC Gateway** sits between HTTP clients and gRPC services.

**Why do we need it?**
- Web browsers speak HTTP/REST
- Microservices speak gRPC
- We need translation in the middle!

**The Gateway's job:**
1. Accept HTTP/REST requests from clients
2. Translate to gRPC protocol
3. Call backend services
4. Translate gRPC response back to HTTP/JSON`,

  whyItMatters: 'Without a gateway, web clients cannot communicate with gRPC-only services.',

  realWorldExample: {
    company: 'Google Cloud',
    scenario: 'Exposing internal gRPC APIs to external HTTP clients',
    howTheyDoIt: 'Uses Envoy proxy as gRPC-JSON transcoder for Cloud APIs',
  },

  keyPoints: [
    'Gateway acts as protocol translator',
    'Clients send standard HTTP/REST requests',
    'Backend services remain pure gRPC',
    'Gateway handles all translation complexity',
  ],

  keyConcepts: [
    { title: 'HTTP/REST', explanation: 'Text-based protocol for web clients', icon: '🌐' },
    { title: 'gRPC', explanation: 'Binary protocol for efficient service-to-service calls', icon: '⚡' },
    { title: 'Gateway', explanation: 'Translator between HTTP and gRPC', icon: '🔄' },
  ],
};

const step1: GuidedStep = {
  id: 'grpc-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up HTTP ingress for FR-1',
    taskDescription: 'Add Client and Gateway components, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents HTTP/REST API consumers', displayName: 'HTTP Client' },
      { type: 'app_server', reason: 'Acts as gRPC Gateway', displayName: 'gRPC Gateway' },
    ],
    successCriteria: [
      'Client component added',
      'Gateway (App Server) component added',
      'Client connected to Gateway',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server (Gateway) from the component palette',
    level2: 'Click Client, then click App Server to create connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Protocol Translation Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🔄',
  scenario: "Your gateway accepts HTTP requests, but it doesn't know how to translate them to gRPC!",
  hook: "A client sent 'GET /users/123' but the gateway just returned 404.",
  challenge: "Implement the translation logic: HTTP → gRPC → HTTP in Python.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Protocol translation is working!',
  achievement: 'HTTP requests successfully translated to gRPC calls',
  metrics: [
    { label: 'Translation logic', after: 'Implemented' },
    { label: 'HTTP → gRPC', after: '✓' },
    { label: 'gRPC → HTTP', after: '✓' },
  ],
  nextTeaser: "But the gateway has nowhere to send gRPC calls...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Protocol Translation: HTTP/REST to gRPC',
  conceptExplanation: `The gateway must translate between two very different protocols:

**HTTP/REST:**
- Text-based (JSON)
- Verbs: GET, POST, PUT, DELETE
- Paths: /users/123
- Headers for metadata

**gRPC:**
- Binary (Protocol Buffers)
- Methods: service.Method
- Strongly typed messages
- Metadata for headers

**Translation steps:**
1. Parse HTTP request (method, path, body)
2. Map to gRPC service and method
3. Convert JSON to Protobuf message
4. Make gRPC call
5. Convert Protobuf response to JSON
6. Return HTTP response`,

  whyItMatters: 'Accurate translation preserves semantics while changing protocols. Errors here break the entire system.',

  famousIncident: {
    title: 'AWS API Gateway gRPC Bug',
    company: 'Amazon Web Services',
    year: '2021',
    whatHappened: 'A bug in AWS API Gateway\'s gRPC translation logic caused certain header values to be corrupted. This broke authentication for thousands of services using the gateway.',
    lessonLearned: 'Protocol translation must be bulletproof - test edge cases thoroughly.',
    icon: '☁️',
  },

  keyPoints: [
    'HTTP paths map to gRPC service methods',
    'JSON body converts to Protobuf messages',
    'HTTP headers become gRPC metadata',
    'gRPC errors map to HTTP status codes',
  ],

  quickCheck: {
    question: 'What HTTP status code should gRPC NOT_FOUND map to?',
    options: [
      '200 OK',
      '404 Not Found',
      '500 Internal Server Error',
      '400 Bad Request',
    ],
    correctIndex: 1,
    explanation: 'gRPC NOT_FOUND directly maps to HTTP 404 Not Found.',
  },

  keyConcepts: [
    { title: 'Protobuf', explanation: 'Binary serialization format for gRPC', icon: '📦' },
    { title: 'Transcoding', explanation: 'Converting between HTTP/JSON and gRPC/Protobuf', icon: '🔄' },
    { title: 'Metadata', explanation: 'gRPC equivalent of HTTP headers', icon: '🏷️' },
  ],
};

const step2: GuidedStep = {
  id: 'grpc-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Implement HTTP to gRPC translation',
    taskDescription: 'Configure APIs and implement Python translation handlers',
    successCriteria: [
      'Click Gateway to open inspector',
      'Assign REST APIs (GET /users/:id, POST /users)',
      'Open Python tab',
      'Implement translate_to_grpc() and translate_from_grpc() functions',
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
    level1: 'Click Gateway component, assign APIs, then implement translation logic in Python',
    level2: 'After assigning APIs, switch to Python tab and implement translation handlers',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Backend gRPC Service
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🎯',
  scenario: "Your gateway can translate HTTP to gRPC, but there's no backend service to call!",
  hook: "All requests return 'Service Unavailable' because the gateway has nowhere to route.",
  challenge: "Add a backend gRPC service and connect the gateway to it.",
  illustration: 'backend-connection',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'End-to-end flow is working!',
  achievement: 'HTTP requests successfully flow through gateway to gRPC backend',
  metrics: [
    { label: 'Backend service', after: 'Connected' },
    { label: 'gRPC calls', after: 'Working' },
    { label: 'Full translation', after: '✓' },
  ],
  nextTeaser: "But streaming requests are failing...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'gRPC Backend Services',
  conceptExplanation: `The gateway forwards translated requests to **backend gRPC services**.

**Backend characteristics:**
- Pure gRPC (no HTTP)
- Protobuf for all messages
- Efficient binary protocol
- Supports streaming

**Connection requirements:**
- HTTP/2 (required for gRPC)
- TLS for production
- Connection pooling for performance
- Health checking for reliability`,

  whyItMatters: 'Backend services implement business logic. Gateway just translates - backend does the real work.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Thousands of microservices communicate via gRPC',
    howTheyDoIt: 'Uses Envoy as gateway for external HTTP traffic, pure gRPC internally',
  },

  keyPoints: [
    'Backend services are pure gRPC',
    'Gateway maintains persistent connections',
    'HTTP/2 enables multiplexing',
    'One connection can handle many concurrent requests',
  ],

  keyConcepts: [
    { title: 'gRPC Service', explanation: 'Backend implementing business logic', icon: '⚙️' },
    { title: 'HTTP/2', explanation: 'Transport protocol for gRPC', icon: '🔌' },
    { title: 'Multiplexing', explanation: 'Multiple requests over one connection', icon: '🌊' },
  ],
};

const step3: GuidedStep = {
  id: 'grpc-gateway-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Complete protocol translation flow',
    taskDescription: 'Add backend gRPC service and connect gateway to it',
    componentsNeeded: [
      { type: 'app_server', reason: 'Backend gRPC service', displayName: 'gRPC Backend' },
    ],
    successCriteria: [
      'Backend gRPC service added',
      'Gateway connected to Backend',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add another App Server component for the backend gRPC service',
    level2: 'Connect Gateway to Backend service for gRPC communication',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'app_server', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 4: Add Streaming Support
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📡',
  scenario: "A client wants to stream real-time updates, but the gateway doesn't support streaming!",
  hook: "The request for 'GET /events/stream' returns immediately instead of streaming data.",
  challenge: "Implement streaming support for server-side, client-side, and bidirectional streams.",
  illustration: 'streaming',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌊',
  message: 'Streaming is fully operational!',
  achievement: 'All gRPC streaming types supported',
  metrics: [
    { label: 'Server streaming', after: 'Enabled' },
    { label: 'Client streaming', after: 'Enabled' },
    { label: 'Bidirectional streaming', after: 'Enabled' },
  ],
  nextTeaser: "But with only one backend, we can't handle the load...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'gRPC Streaming: Beyond Request-Response',
  conceptExplanation: `gRPC supports four communication patterns:

**1. Unary (Request-Response):**
- Client sends one request
- Server sends one response
- Like traditional HTTP

**2. Server Streaming:**
- Client sends one request
- Server streams multiple responses
- Example: Live feed, logs streaming

**3. Client Streaming:**
- Client streams multiple requests
- Server sends one response
- Example: File upload, batch processing

**4. Bidirectional Streaming:**
- Both sides stream continuously
- Example: Chat, real-time collaboration

**Gateway translation:**
- HTTP SSE (Server-Sent Events) → Server streaming
- Chunked upload → Client streaming
- WebSockets → Bidirectional streaming`,

  whyItMatters: 'Streaming enables real-time communication. Without it, clients must constantly poll for updates.',

  famousIncident: {
    title: 'Netflix Streaming Performance',
    company: 'Netflix',
    year: '2019',
    whatHappened: 'Netflix migrated critical services from REST to gRPC with streaming. Reduced latency by 50% and improved throughput by 200% for real-time recommendation updates.',
    lessonLearned: 'Streaming dramatically improves performance for real-time use cases.',
    icon: '📺',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Google Maps uses gRPC streaming for live navigation updates',
    howTheyDoIt: 'Server streams route updates as traffic conditions change',
  },

  diagram: `
Server Streaming:
Client ──[request]──▶ Server
       ◀──[response 1]──
       ◀──[response 2]──
       ◀──[response 3]──

Bidirectional:
Client ──[request 1]──▶ Server
       ◀──[response 1]──
       ──[request 2]──▶
       ◀──[response 2]──
`,

  keyPoints: [
    'Streaming keeps connection open for continuous data flow',
    'More efficient than repeated polling',
    'HTTP/2 enables multiplexing of streams',
    'Gateway must preserve streaming semantics',
  ],

  quickCheck: {
    question: 'Which gRPC streaming type fits a live chat application?',
    options: [
      'Unary',
      'Server streaming',
      'Client streaming',
      'Bidirectional streaming',
    ],
    correctIndex: 3,
    explanation: 'Chat requires both sides to send messages continuously - bidirectional streaming.',
  },

  keyConcepts: [
    { title: 'Streaming', explanation: 'Continuous data flow over persistent connection', icon: '🌊' },
    { title: 'SSE', explanation: 'Server-Sent Events for HTTP streaming', icon: '📡' },
    { title: 'WebSocket', explanation: 'Full-duplex communication for bidirectional', icon: '🔌' },
  ],
};

const step4: GuidedStep = {
  id: 'grpc-gateway-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Support all gRPC streaming types',
    taskDescription: 'Configure streaming support in gateway',
    successCriteria: [
      'Click Gateway component',
      'Enable streaming configuration',
      'Implement stream translation handlers',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
    ],
    requireAPIConfiguration: true,
  },

  hints: {
    level1: 'Click Gateway, enable streaming support in configuration',
    level2: 'Configure HTTP SSE and WebSocket endpoints for streaming',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for Backend Services
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Traffic is growing! Your single backend service is overloaded.",
  hook: "Response times jumped from 20ms to 500ms. The backend is at 100% CPU!",
  challenge: "Add load balancing to distribute requests across multiple backend instances.",
  illustration: 'load-balancing',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Load balancing is active!',
  achievement: 'Traffic distributed across multiple backend instances',
  metrics: [
    { label: 'Backend instances', before: '1', after: 'Multiple' },
    { label: 'Load distribution', after: 'Balanced' },
    { label: 'Throughput', before: '10K RPS', after: '50K RPS' },
  ],
  nextTeaser: "But gRPC load balancing is trickier than HTTP...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing gRPC: The HTTP/2 Challenge',
  conceptExplanation: `gRPC load balancing is **fundamentally different** from HTTP/1.1:

**The Problem:**
- gRPC uses HTTP/2
- HTTP/2 multiplexes requests over ONE connection
- Traditional L4 load balancers see one connection = one backend
- All requests go to same backend (broken!)

**Solution 1: Client-side Load Balancing**
- Gateway maintains connections to ALL backends
- Gateway distributes requests across connections
- Full control, but complex

**Solution 2: L7 Load Balancer (Proxy)**
- Envoy, Linkerd understand gRPC/HTTP/2
- Terminate connections and re-balance at request level
- Simpler, but adds hop

**Load balancing strategies:**
- Round-robin: Simple, even distribution
- Least-connections: Better for long-running streams
- Consistent hashing: Sticky routing for state`,

  whyItMatters: 'Naive load balancing sends all traffic to one backend. Proper gRPC load balancing is essential for scale.',

  famousIncident: {
    title: 'Kubernetes gRPC Load Balancing Problem',
    company: 'Kubernetes',
    year: '2018',
    whatHappened: 'Kubernetes default load balancing broke gRPC services. All traffic went to one pod because kube-proxy operates at L4. Teams had to implement client-side load balancing or use service mesh.',
    lessonLearned: 'HTTP/2 connection reuse breaks traditional load balancing - need L7 awareness.',
    icon: '☸️',
  },

  realWorldExample: {
    company: 'Google',
    scenario: 'Load balancing across millions of gRPC service instances',
    howTheyDoIt: 'Custom L7 load balancer with health checking and locality-aware routing',
  },

  diagram: `
Traditional L4 (Broken for gRPC):
Gateway ═══[1 connection]═══▶ Backend 1
                               Backend 2 (idle!)
                               Backend 3 (idle!)

L7 gRPC Load Balancing (Correct):
Gateway ───[req 1]───▶ Backend 1
        ───[req 2]───▶ Backend 2
        ───[req 3]───▶ Backend 3
        ───[req 4]───▶ Backend 1
`,

  keyPoints: [
    'HTTP/2 connection reuse breaks L4 load balancing',
    'Need L7 awareness for request-level balancing',
    'Client-side LB or smart proxy required',
    'Health checking essential for failover',
  ],

  quickCheck: {
    question: 'Why does traditional L4 load balancing fail for gRPC?',
    options: [
      'gRPC is too fast',
      'HTTP/2 multiplexes all requests over one connection',
      'gRPC uses binary protocol',
      'Backends cannot handle load',
    ],
    correctIndex: 1,
    explanation: 'HTTP/2 reuses connections, so L4 balancers see one connection and route everything to one backend.',
  },

  keyConcepts: [
    { title: 'L4 vs L7', explanation: 'Connection-level vs request-level balancing', icon: '⚖️' },
    { title: 'Client-side LB', explanation: 'Client chooses backend for each request', icon: '🎯' },
    { title: 'HTTP/2 Multiplexing', explanation: 'Multiple requests over one connection', icon: '🌊' },
  ],
};

const step5: GuidedStep = {
  id: 'grpc-gateway-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Distribute load across backend services',
    taskDescription: 'Add load balancer between gateway and backend services',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'L7 gRPC-aware load balancer', displayName: 'gRPC Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Gateway connected to Load Balancer',
      'Load Balancer connected to Backend services',
      'Configure for gRPC/HTTP/2 awareness',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'load_balancer' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer between Gateway and Backend services',
    level2: 'Configure Load Balancer for L7 gRPC mode (not L4)',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [{ from: 'app_server', to: 'load_balancer' }],
  },
};

// =============================================================================
// STEP 6: Add Connection Pool for Performance
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🏊',
  scenario: "Every request creates a new gRPC connection. This is killing performance!",
  hook: "Connection setup takes 50ms each. With 1000 RPS, you're spending 50 seconds per second on connections!",
  challenge: "Implement connection pooling to reuse persistent connections.",
  illustration: 'connection-pool',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Connection pooling optimized!',
  achievement: 'Persistent connections dramatically reduced latency',
  metrics: [
    { label: 'Connection overhead', before: '50ms', after: '<1ms' },
    { label: 'Connections created', before: '1000/sec', after: '10/sec' },
    { label: 'Latency improvement', after: '98%' },
  ],
  nextTeaser: "But how do we find backend services dynamically?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Connection Pooling: Reuse is Key',
  conceptExplanation: `Creating new connections is **expensive**:

**Connection setup cost:**
- TCP handshake: 3 round trips
- TLS handshake: 2 round trips
- HTTP/2 negotiation: 1 round trip
- Total: ~50-100ms per connection

**Solution: Connection Pool**
- Pre-create connections to backends
- Reuse connections for multiple requests
- HTTP/2 multiplexing: 1000s of streams per connection
- Keep connections warm with keepalive

**Pool configuration:**
- Min connections: 2-5 per backend
- Max connections: 10-20 per backend
- Max concurrent streams: 100-1000 per connection
- Keepalive: 60 seconds
- Connection timeout: 30 seconds`,

  whyItMatters: 'Without pooling, connection overhead dominates request latency. Pooling reduces latency by 90%+.',

  famousIncident: {
    title: 'Slack gRPC Migration Performance',
    company: 'Slack',
    year: '2020',
    whatHappened: 'When migrating to gRPC, Slack initially saw worse performance than HTTP/1.1 due to poor connection pooling. After implementing proper pooling with HTTP/2 multiplexing, latency dropped by 80%.',
    lessonLearned: 'Connection pooling is not optional for gRPC - it\'s essential for performance.',
    icon: '💬',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'gRPC connections to metadata services',
    howTheyDoIt: 'Maintains pool of 5 connections per backend, 1000 concurrent streams each',
  },

  diagram: `
Without Pooling:
Request 1 → [New Connection 50ms] → Backend
Request 2 → [New Connection 50ms] → Backend
Request 3 → [New Connection 50ms] → Backend

With Pooling:
Request 1 ─┐
Request 2 ─┼──[Reused Connection <1ms]──▶ Backend
Request 3 ─┘
`,

  keyPoints: [
    'Pre-create connections to avoid setup latency',
    'HTTP/2 allows 1000s of concurrent requests per connection',
    'Keepalive prevents connection timeouts',
    'Pool size based on backend count and load',
  ],

  quickCheck: {
    question: 'Why is connection pooling critical for gRPC performance?',
    options: [
      'gRPC requires many connections',
      'Connection setup is expensive (50-100ms)',
      'Pooling uses less memory',
      'Backends require persistent connections',
    ],
    correctIndex: 1,
    explanation: 'Connection setup (TCP + TLS + HTTP/2) takes 50-100ms. Pooling amortizes this cost across many requests.',
  },

  keyConcepts: [
    { title: 'Connection Pool', explanation: 'Reusable set of persistent connections', icon: '🏊' },
    { title: 'Keepalive', explanation: 'Periodic pings to keep connections alive', icon: '💓' },
    { title: 'Multiplexing', explanation: 'Many concurrent requests per connection', icon: '🌊' },
  ],
};

const step6: GuidedStep = {
  id: 'grpc-gateway-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'Optimize all FRs with connection pooling',
    taskDescription: 'Configure connection pool in gateway',
    successCriteria: [
      'Click Gateway component',
      'Configure connection pool settings',
      'Set pool size: 5-10 connections per backend',
      'Enable HTTP/2 keepalive',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'load_balancer'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'load_balancer' },
    ],
  },

  hints: {
    level1: 'Click Gateway, find connection pool configuration',
    level2: 'Set min=5, max=10 connections per backend with keepalive enabled',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Service Discovery
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔍',
  scenario: "Your backend services are auto-scaling, but the gateway has hard-coded IPs!",
  hook: "New backend instances come online, but gateway doesn't know about them. Traffic doesn't balance!",
  challenge: "Add service discovery so gateway finds backends dynamically.",
  illustration: 'service-discovery',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Dynamic service discovery enabled!',
  achievement: 'Gateway automatically finds scaled backend instances',
  metrics: [
    { label: 'Service registration', after: 'Automatic' },
    { label: 'Backend discovery', after: 'Dynamic' },
    { label: 'Auto-scaling', after: 'Supported' },
  ],
  nextTeaser: "But what about caching frequently accessed data?",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Service Discovery: Finding Backends Dynamically',
  conceptExplanation: `Hard-coded IPs break in cloud environments:
- Auto-scaling adds/removes instances
- IP addresses change
- Health changes dynamically

**Service Discovery Pattern:**
1. Backends register on startup
2. Gateway queries registry
3. Registry returns healthy instances
4. Gateway load balances across them
5. Poll registry for updates

**Discovery mechanisms:**
- DNS-based (Kubernetes, Consul)
- Client library (Eureka, Consul)
- Service mesh (Istio, Linkerd)

**For gRPC:**
- Use gRPC name resolver
- Automatic backend updates
- Health checking integration`,

  whyItMatters: 'Static configuration cannot handle dynamic cloud infrastructure. Service discovery enables auto-scaling.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Thousands of microservices scaling dynamically',
    howTheyDoIt: 'Uses Eureka for service discovery, auto-updates load balancer pool',
  },

  diagram: `
Service Discovery Flow:

1. Backends register:
   Backend 1 ──[register]──▶ Service Registry
   Backend 2 ──[register]──▶ Service Registry

2. Gateway discovers:
   Gateway ──[query: "user-service"]──▶ Registry
   Gateway ◀──[backend1.com, backend2.com]──

3. Gateway load balances:
   Gateway ──[request]──▶ Backend 1 or 2
`,

  keyPoints: [
    'Backends self-register on startup',
    'Gateway queries registry for instances',
    'Poll registry for updates (30-60 sec)',
    'Health checks remove failed instances',
  ],

  quickCheck: {
    question: 'Why is service discovery needed for auto-scaling?',
    options: [
      'It makes services faster',
      'New instances have different IPs - gateway must discover them',
      'It reduces costs',
      'It improves security',
    ],
    correctIndex: 1,
    explanation: 'Auto-scaling creates instances with new IPs. Service discovery lets gateway find them automatically.',
  },

  keyConcepts: [
    { title: 'Service Registry', explanation: 'Database of available service instances', icon: '📋' },
    { title: 'Health Check', explanation: 'Automatic detection of failed instances', icon: '💓' },
    { title: 'Name Resolution', explanation: 'Mapping service name to IP addresses', icon: '🔍' },
  ],
};

const step7: GuidedStep = {
  id: 'grpc-gateway-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Dynamic service discovery for backends',
    taskDescription: 'Add service registry for backend discovery',
    componentsNeeded: [
      { type: 'database', reason: 'Acts as service registry (e.g., Consul, etcd)', displayName: 'Service Registry' },
    ],
    successCriteria: [
      'Service Registry component added',
      'Gateway connected to Registry',
      'Backends register on startup',
      'Gateway polls for updates',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'load_balancer', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'load_balancer' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add Database component as Service Registry',
    level2: 'Connect Gateway to Registry for dynamic backend discovery',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 8: Add Cache for Response Caching
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🚀',
  scenario: "Many clients request the same data repeatedly. Every request hits the backend!",
  hook: "Backend CPU is 80% with duplicate requests. Can we cache responses?",
  challenge: "Add caching layer to reduce backend load for cacheable responses.",
  illustration: 'caching',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'You built a production-ready gRPC Gateway!',
  achievement: 'Full-featured gateway with translation, streaming, load balancing, and caching',
  metrics: [
    { label: 'Cache hit rate', after: '70%' },
    { label: 'Backend load', before: '80%', after: '25%' },
    { label: 'Response latency', before: '50ms', after: '5ms (cached)' },
  ],
  nextTeaser: "Congratulations! You've mastered gRPC Gateway design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Response Caching: Reducing Backend Load',
  conceptExplanation: `Many API responses are **cacheable**:
- User profiles (change rarely)
- Product catalogs
- Configuration data
- Reference data

**Caching strategy:**
1. Check cache before calling backend
2. On HIT: Return cached response (fast!)
3. On MISS: Call backend, cache response
4. Set appropriate TTL

**Cache key design:**
- Include: service, method, request params
- Exclude: auth tokens, timestamps
- Example: "users:get:id=123"

**Cache invalidation:**
- TTL-based (simple, eventual consistency)
- Event-based (complex, strong consistency)
- Manual purge (admin operations)

**For gRPC Gateway:**
- Cache at gateway layer
- Use Redis for distributed cache
- Respect cache-control headers
- Only cache idempotent methods (GET-like)`,

  whyItMatters: 'Caching reduces backend load by 50-80% for read-heavy workloads. Critical for scale.',

  famousIncident: {
    title: 'Twitter Cache Stampede',
    company: 'Twitter',
    year: '2016',
    whatHappened: 'Cache layer failed during peak traffic. All requests hit backend simultaneously (cache stampede). Backend couldn\'t handle load and crashed, causing 2-hour outage.',
    lessonLearned: 'Cache is critical infrastructure. Plan for cache failures with request coalescing and circuit breakers.',
    icon: '🐦',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Caching repository metadata and file trees',
    howTheyDoIt: 'Multi-layer cache with Redis and CDN, 95%+ hit rate for reads',
  },

  diagram: `
With Caching:

Request → Gateway → [Check Cache]
                         │
                    ┌────┴────┐
                    ▼         ▼
                  HIT       MISS
                   │          │
           Return cached  Call backend
           (5ms) │          │
                 │      Cache result
                 │          │
                 └──────────┘
                      │
                   Response
`,

  keyPoints: [
    'Cache responses at gateway layer',
    'Only cache idempotent operations',
    'Set appropriate TTL based on data freshness',
    'Use distributed cache (Redis) for shared state',
  ],

  quickCheck: {
    question: 'Which gRPC method should NOT be cached?',
    options: [
      'GetUser (read user profile)',
      'CreateOrder (create new order)',
      'ListProducts (read product catalog)',
      'GetConfig (read configuration)',
    ],
    correctIndex: 1,
    explanation: 'CreateOrder is not idempotent - caching would prevent new orders from being created.',
  },

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Response found in cache - fast!', icon: '✅' },
    { title: 'TTL', explanation: 'Time-To-Live: how long to cache', icon: '⏰' },
    { title: 'Idempotent', explanation: 'Same request → same result (safe to cache)', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'grpc-gateway-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'Optimize all FRs with response caching',
    taskDescription: 'Add cache layer for response caching',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache responses to reduce backend load', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'Gateway connected to Cache',
      'Configure cache TTL and eviction policy',
      'Only cache idempotent methods',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'load_balancer', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'load_balancer' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Cache component and connect Gateway to it',
    level2: 'Configure cache-aside strategy with appropriate TTL (300-3600 seconds)',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const grpcGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'grpc-gateway',
  problemTitle: 'Build gRPC Gateway - Protocol Translation at Scale',

  requirementsPhase: grpcGatewayRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Protocol Translation',
      type: 'functional',
      requirement: 'FR-1',
      description: 'HTTP requests successfully translated to gRPC and back',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Streaming Support',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Server streaming, client streaming, and bidirectional streaming work correctly',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'Service Discovery',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Gateway dynamically discovers and routes to scaled backends',
      traffic: { type: 'mixed', rps: 1000, readRps: 500, writeRps: 500 },
      duration: 60,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 50K RPS with less than 5ms gateway overhead',
      traffic: { type: 'read', rps: 50000, readRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle sudden spike to 200K RPS',
      traffic: { type: 'mixed', rps: 200000, readRps: 150000, writeRps: 50000 },
      duration: 60,
      passCriteria: { maxP99Latency: 150, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Backend Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Gateway routes around failed backend instances',
      traffic: { type: 'mixed', rps: 10000, readRps: 7000, writeRps: 3000 },
      duration: 90,
      failureInjection: { type: 'service_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 5, maxErrorRate: 0.05 },
    },
  ] as TestCase[],
};

export function getGrpcGatewayGuidedTutorial(): GuidedTutorial {
  return grpcGatewayGuidedTutorial;
}

export default grpcGatewayGuidedTutorial;
