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
 * Load Balancing Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches load balancing concepts
 * while building a production-grade API gateway. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-2: Build brute force solution (single gateway) - FRs satisfied!
 * Step 3: Add L4 vs L7 load balancing
 * Steps 4+: Apply NFRs (health checks, session affinity, auto-scaling, etc.)
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 *
 * Focus Areas:
 * - L4 (Transport Layer) vs L7 (Application Layer) load balancing
 * - Health checks and failover
 * - Session affinity (sticky sessions)
 * - Algorithm selection (round-robin, least-connections, IP hash)
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const loadBalancingGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a load balancing gateway for a high-traffic API service",

  interviewer: {
    name: 'Maya Patel',
    role: 'Staff Infrastructure Engineer',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-load-distribution',
      category: 'functional',
      question: "What's the main purpose of this load balancing gateway? What problem are we solving?",
      answer: "We need a gateway that sits in front of our API servers and distributes incoming requests across multiple backend servers. When a client makes a request, the gateway decides which backend server should handle it. This prevents any single server from being overwhelmed and allows us to scale horizontally by adding more servers.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Load balancers are the traffic cops of distributed systems - they ensure no single server gets overwhelmed",
    },
    {
      id: 'health-awareness',
      category: 'functional',
      question: "What happens if one of the backend servers crashes or becomes unhealthy?",
      answer: "The load balancer must detect unhealthy servers and stop sending traffic to them. It should perform regular health checks (pinging servers every few seconds) and automatically remove failed servers from the pool. When a server recovers, it should be added back to the rotation.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Health checks are what make load balancers resilient - they prevent cascading failures",
    },
    {
      id: 'session-persistence',
      category: 'functional',
      question: "Some of our APIs need session state - like a user's shopping cart. What happens if requests from the same user go to different servers?",
      answer: "That would break the user experience! If a user adds items to their cart on Server A, then their next request goes to Server B which doesn't know about that cart, they'll see an empty cart. We need session affinity (also called sticky sessions) - ensuring all requests from the same user go to the same backend server.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Session affinity is critical for stateful applications - it maintains user context",
    },

    // IMPORTANT - Clarifications
    {
      id: 'balancing-algorithms',
      category: 'clarification',
      question: "How should the load balancer decide which server gets each request?",
      answer: "We need flexibility. Different algorithms work better for different scenarios:\n- **Round-robin**: Simple rotation, works for uniform workloads\n- **Least connections**: Send to server with fewest active connections\n- **IP hash**: Same client IP always goes to same server (built-in session affinity)\n- **Weighted**: Some servers can handle more load than others",
      importance: 'important',
      insight: "Different algorithms optimize for different goals - throughput vs fairness vs statefulness",
    },
    {
      id: 'l4-vs-l7',
      category: 'clarification',
      question: "Should the load balancer work at the network level (L4) or application level (L7)?",
      answer: "Ideally both, depending on needs:\n- **L4 (Transport Layer)**: Faster, routes based on IP/port, can't see HTTP headers\n- **L7 (Application Layer)**: Slower, but can route based on URL path, headers, cookies - much more powerful for API gateways\n\nFor an API gateway, L7 is essential to route /api/users to one service and /api/orders to another.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "L4 is fast but dumb, L7 is smart but slower - choose based on your routing needs",
    },
    {
      id: 'connection-draining',
      category: 'clarification',
      question: "When we deploy new code and take a server offline, what happens to in-flight requests?",
      answer: "We need graceful shutdown. The load balancer should:\n1. Stop sending NEW requests to that server\n2. Wait for existing connections to complete (with a timeout)\n3. Only then mark the server as fully offline\n\nThis is called connection draining or graceful shutdown.",
      importance: 'important',
      insight: "Connection draining prevents dropped requests during deployments",
    },

    // SCOPE
    {
      id: 'scope-ssl',
      category: 'scope',
      question: "Should the load balancer handle SSL/TLS termination?",
      answer: "Yes, the load balancer should handle SSL termination (decrypting HTTPS traffic). This offloads expensive crypto operations from backend servers and allows the LB to inspect HTTP headers for smart routing.",
      importance: 'important',
      insight: "SSL termination at the LB is a common pattern - centralized cert management",
    },
    {
      id: 'scope-rate-limiting',
      category: 'scope',
      question: "Should we implement rate limiting at the gateway?",
      answer: "Not for MVP. Rate limiting is valuable, but focus first on core load balancing. We can add it as a v2 feature.",
      importance: 'nice-to-have',
      insight: "API gateways often grow to include rate limiting, auth, caching - but start simple",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    {
      id: 'throughput-rps',
      category: 'throughput',
      question: "How many requests per second should the gateway handle?",
      answer: "We need to support 50,000 requests per second at peak. Our backend servers can each handle about 5,000 RPS, so we'll need at least 10 servers (with headroom).",
      importance: 'critical',
      calculation: {
        formula: "50K RPS ÷ 5K RPS per server = 10 servers minimum",
        result: "Need 12-15 servers with headroom",
      },
      learningPoint: "Always plan for 20-30% headroom above peak traffic",
    },
    {
      id: 'latency-overhead',
      category: 'latency',
      question: "How much latency can the load balancer add?",
      answer: "The load balancer should add less than 5ms of overhead. L4 load balancers add ~1ms, L7 load balancers add ~3-5ms due to HTTP parsing.",
      importance: 'critical',
      learningPoint: "Load balancer latency is critical - users are waiting for every millisecond",
    },
    {
      id: 'availability-sla',
      category: 'availability',
      question: "What's the uptime requirement for the gateway?",
      answer: "99.99% availability - the load balancer itself can't be a single point of failure. We need redundant load balancers with failover.",
      importance: 'critical',
      learningPoint: "The load balancer needs to be highly available - it's the front door to your system",
    },
    {
      id: 'burst-traffic',
      category: 'burst',
      question: "Do we have sudden traffic spikes we need to handle?",
      answer: "Yes, during flash sales or major events, traffic can spike 5x normal. The system should auto-scale backend servers and distribute load evenly.",
      importance: 'important',
      insight: "Auto-scaling requires coordination between LB and orchestration (Kubernetes, etc.)",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['core-load-distribution', 'health-awareness', 'session-persistence'],
  criticalFRQuestionIds: ['core-load-distribution', 'health-awareness', 'session-persistence'],
  criticalScaleQuestionIds: ['throughput-rps', 'latency-overhead', 'availability-sla'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Distribute traffic across backend servers',
      description: 'Gateway distributes incoming requests evenly across multiple backend API servers',
      emoji: '⚖️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Health checks and automatic failover',
      description: 'Detect unhealthy servers and stop routing traffic to them automatically',
      emoji: '💓',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Session affinity (sticky sessions)',
      description: 'Route requests from the same user to the same backend server for state consistency',
      emoji: '🔗',
    },
    {
      id: 'fr-4',
      text: 'FR-4: L7 application-layer routing',
      description: 'Route based on URL path, HTTP headers, and cookies for intelligent API gateway behavior',
      emoji: '🧠',
    },
  ],

  scaleMetrics: {
    peakRPS: '50,000 RPS',
    backendServerCapacity: '5,000 RPS per server',
    minimumServers: '10 servers',
    recommendedServers: '12-15 servers (with headroom)',
    l4Latency: '~1ms overhead',
    l7Latency: '~3-5ms overhead',
    availabilitySLA: '99.99% uptime',
    trafficSpikeMultiplier: '5x normal traffic',
  },

  architecturalImplications: [
    '✅ L7 routing essential for API gateway use case',
    '✅ Health checks prevent cascading failures',
    '✅ Session affinity needed for stateful backends',
    '✅ Need redundant load balancers (can\'t be single point of failure)',
    '✅ 50K RPS requires 10+ backend servers',
    '✅ Auto-scaling to handle 5x traffic spikes',
  ],

  outOfScope: [
    'Rate limiting (v2)',
    'Authentication/Authorization (v2)',
    'API versioning (v2)',
    'Request/response transformation (v2)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple Client → Gateway → Backend Server setup that distributes traffic. Once it works, we'll add health checks, session affinity, and L7 routing. This is the right way to approach system design: functionality first, then optimization.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to Gateway and Backend
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome! You're building an API gateway for a high-traffic e-commerce platform.",
  hook: "Right now, all requests go directly to a single API server. During Black Friday, that server melts down. You need load balancing!",
  challenge: "Set up the basic infrastructure: Client → Load Balancer → Backend Server",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your gateway is connected!",
  achievement: "Traffic now flows through a load balancer to backend servers",
  metrics: [
    { label: 'Architecture', after: 'Client → LB → Backend' },
    { label: 'Can distribute traffic', after: '✓' },
  ],
  nextTeaser: "But how does the load balancer decide which server gets each request?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancers: The Traffic Directors',
  conceptExplanation: `A **Load Balancer** sits between clients and backend servers, distributing traffic.

Without a load balancer:
- All traffic hits one server → overload and crashes
- No redundancy → server crash = total outage
- Can't scale → adding servers doesn't help

With a load balancer:
- Traffic distributed across N servers
- 1 server crash → others handle the load
- Need more capacity? Just add servers!

Think of it as a restaurant host - they distribute diners across multiple tables to avoid overwhelming any single waiter.`,

  whyItMatters: 'Load balancers are essential for scalability and availability. They transform a single server into a fleet of servers working together.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Handling millions of requests during Prime Day',
    howTheyDoIt: 'AWS Elastic Load Balancer distributes traffic across thousands of EC2 instances. When traffic spikes, they auto-scale servers and the LB automatically includes them in rotation.',
  },

  keyPoints: [
    'Load balancers distribute traffic across multiple servers',
    'Enable horizontal scaling: more servers = more capacity',
    'Provide redundancy: if one server fails, others continue',
    'Can be L4 (fast, IP-based) or L7 (smart, HTTP-aware)',
  ],

  diagram: `
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌──────────────┐
│Load Balancer │
└──────┬───────┘
       │
   ┌───┴────┬────────┬────────┐
   ▼        ▼        ▼        ▼
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│ API │  │ API │  │ API │  │ API │
│Srv 1│  │Srv 2│  │Srv 3│  │Srv 4│
└─────┘  └─────┘  └─────┘  └─────┘
`,

  keyConcepts: [
    {
      title: 'Horizontal Scaling',
      explanation: 'Add more servers to increase capacity (vs vertical = bigger servers)',
      icon: '📈',
    },
    {
      title: 'Distribution',
      explanation: 'Spread load evenly to prevent any single server from being overwhelmed',
      icon: '⚖️',
    },
  ],

  quickCheck: {
    question: 'What is the main benefit of a load balancer?',
    options: [
      'Reduces database queries',
      'Encrypts all traffic',
      'Distributes traffic across multiple servers for scale and availability',
      'Caches API responses',
    ],
    correctIndex: 2,
    explanation: 'Load balancers distribute incoming requests across multiple servers, enabling horizontal scaling and high availability.',
  },
};

const step1: GuidedStep = {
  id: 'lb-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Client requests must flow through a load balancer to backend servers',
    taskDescription: 'Add Client, Load Balancer, and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents API consumers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Backend API servers', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to backends' },
    ],
    successCriteria: ['Add Client, Load Balancer, and API Server', 'Connect Client → LB → API Server'],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Build the path: Client → Load Balancer → App Server',
    level2: 'Add all three components and connect them in sequence',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 2: L4 vs L7 - Choosing Your Load Balancing Layer
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🧠',
  scenario: "Your gateway is working, but you need smarter routing.",
  hook: "Marketing wants /api/products to go to the Product service and /api/orders to the Order service. But your L4 load balancer can only see IP addresses and ports - it can't read URLs!",
  challenge: "Understand the difference between L4 (fast, simple) and L7 (smart, powerful) load balancing, and choose the right one for an API gateway.",
  illustration: 'smart-routing',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "You understand L4 vs L7 load balancing!",
  achievement: "You can now make informed decisions about load balancing strategies",
  metrics: [
    { label: 'L4 Knowledge', after: 'Transport Layer mastered' },
    { label: 'L7 Knowledge', after: 'Application Layer mastered' },
  ],
  nextTeaser: "Now let's add health checks to detect failed servers...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'L4 vs L7 Load Balancing: Speed vs Intelligence',
  conceptExplanation: `**OSI Model Refresher:**
Layer 7: Application (HTTP, URLs, cookies)
Layer 6: Presentation
Layer 5: Session
Layer 4: Transport (TCP/UDP, ports)
Layer 3: Network (IP addresses)

**L4 Load Balancing (Transport Layer)**
- Routes based on: IP address + port
- Can't see: HTTP headers, URLs, cookies
- Speed: ~1ms latency, extremely fast
- Use for: Simple TCP/UDP distribution
- Example: 192.168.1.5:80 → Backend 1

**L7 Load Balancing (Application Layer)**
- Routes based on: URL path, HTTP headers, cookies, query params
- Can do: SSL termination, request inspection, smart routing
- Speed: ~3-5ms latency (parses HTTP)
- Use for: API gateways, microservices routing
- Example: /api/users → User Service, /api/orders → Order Service

**For an API Gateway, L7 is essential:**
- Route by URL path (different microservices)
- Session affinity via cookies
- SSL termination
- Header-based routing (API versions, A/B testing)`,

  whyItMatters: 'Choosing the wrong layer limits your capabilities. L4 is fast but dumb, L7 is smart but slightly slower. For API gateways, the intelligence of L7 is worth the 3-5ms overhead.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Routing API requests to different microservices',
    howTheyDoIt: 'Zuul (Netflix\'s API Gateway) uses L7 routing to direct /api/catalog to Catalog Service, /api/recommendations to ML Service, etc. L4 couldn\'t do this.',
  },

  famousIncident: {
    title: 'GitHub\'s Routing Incident',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'A network partition caused their L4 load balancer to split traffic between two datacenters, both thinking they were primary. User writes went to different databases, causing data inconsistency.',
    lessonLearned: 'L4 load balancers are simple and fast, but they lack the intelligence to handle complex split-brain scenarios. L7 load balancers with application-aware health checks can detect these issues.',
    icon: '🔀',
  },

  keyPoints: [
    'L4 = Fast (1ms) but basic - routes on IP/port only',
    'L7 = Smart (3-5ms) but powerful - routes on URL, headers, cookies',
    'API gateways need L7 for microservices routing',
    'L4 good for: TCP proxies, simple load distribution',
    'L7 good for: HTTP APIs, session affinity, path-based routing',
  ],

  diagram: `
┌─────────────────────────────────────────────┐
│             L4 LOAD BALANCER                │
│    (Transport Layer - TCP/UDP/IP)           │
├─────────────────────────────────────────────┤
│  Sees: IP address, Port                     │
│  Fast: ~1ms latency                         │
│  Dumb: Can't read HTTP                      │
│                                             │
│  Client: 192.168.1.100:443                  │
│     ↓                                       │
│  Route to: Backend 1 (IP: 10.0.1.5)         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│             L7 LOAD BALANCER                │
│      (Application Layer - HTTP)             │
├─────────────────────────────────────────────┤
│  Sees: URL, headers, cookies, body          │
│  Smart: ~3-5ms latency                      │
│  Intelligent: Content-based routing         │
│                                             │
│  Request: GET /api/users HTTP/1.1           │
│     ↓                                       │
│  Route to: User Service                     │
│                                             │
│  Request: GET /api/orders HTTP/1.1          │
│     ↓                                       │
│  Route to: Order Service                    │
└─────────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'L4 (Transport Layer)',
      explanation: 'Fast routing based on IP and port - sees TCP/UDP packets',
      icon: '⚡',
    },
    {
      title: 'L7 (Application Layer)',
      explanation: 'Intelligent routing based on HTTP content - sees URLs and headers',
      icon: '🧠',
    },
    {
      title: 'SSL Termination',
      explanation: 'L7 can decrypt HTTPS to inspect content, then re-encrypt to backend',
      icon: '🔐',
    },
  ],

  quickCheck: {
    question: 'When should you use L7 load balancing over L4?',
    options: [
      'When you need the absolute fastest routing (1ms)',
      'When routing non-HTTP traffic like database connections',
      'When you need to route based on URL paths or HTTP headers',
      'When you want to avoid SSL termination',
    ],
    correctIndex: 2,
    explanation: 'L7 load balancing is essential when you need content-based routing (URLs, headers, cookies). For API gateways routing to microservices, L7 is required.',
  },
};

const step2: GuidedStep = {
  id: 'lb-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Load balancer must support intelligent L7 routing for API gateway use case',
    taskDescription: 'Configure your Load Balancer for L7 (Application Layer) routing',
    componentsNeeded: [
      { type: 'client', reason: 'API consumers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Configure for L7 routing', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Backend API servers', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB routes to backends' },
    ],
    successCriteria: [
      'Keep your existing architecture from Step 1',
      'Click Load Balancer → Configure for L7 (Application Layer) routing',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireL7LoadBalancing: true,
  },
  hints: {
    level1: 'Click on the Load Balancer and configure it for L7 (HTTP/Application Layer) routing',
    level2: 'Your architecture should stay the same. Just configure the Load Balancer settings to enable L7 routing with HTTP inspection.',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 3: Health Checks - Detecting and Avoiding Failed Servers
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💓',
  scenario: "It's 2 AM. One of your API servers crashed due to a memory leak.",
  hook: "But the load balancer doesn't know! It keeps sending 25% of traffic to the dead server. Users are seeing 500 errors and your phone is exploding with alerts!",
  challenge: "Implement health checks so the load balancer automatically detects and stops routing to unhealthy servers.",
  illustration: 'server-crash',
};

const step3Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Health checks are active!",
  achievement: "Load balancer now detects and routes around failed servers automatically",
  metrics: [
    { label: 'Health monitoring', before: 'None', after: 'Active checks every 5s' },
    { label: 'Failed server handling', before: 'Kept routing to dead servers', after: 'Auto-removed' },
    { label: 'User impact', before: '25% errors', after: '0% errors' },
  ],
  nextTeaser: "Great! But now users are complaining their shopping carts are disappearing...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Health Checks: The Heartbeat of Reliability',
  conceptExplanation: `**The Problem:**
Without health checks, when a server crashes:
- Load balancer keeps sending traffic to it
- Users get errors (connection refused, timeouts)
- Manual intervention needed to remove failed server

**The Solution: Health Checks**

**Active Health Checks (Proactive):**
Load balancer periodically pings each server:
- Every 5-10 seconds: Send GET /health request
- Expect 200 OK response within 2 seconds
- If 3 consecutive failures → mark server unhealthy
- Stop routing traffic to unhealthy servers
- Keep checking → when server recovers, add it back

**Passive Health Checks (Reactive):**
Monitor actual traffic:
- If server returns 5xx errors for 5 requests in a row → mark unhealthy
- If connection times out → mark unhealthy
- Faster detection but requires real user traffic

**Best Practice: Use Both**
- Active checks catch failures proactively
- Passive checks catch degraded performance

**Health Check Endpoint:**
Backend servers implement GET /health:
- Check database connection
- Check disk space
- Check memory usage
- Return 200 if healthy, 503 if not`,

  whyItMatters: 'Health checks prevent cascading failures. Without them, a single server crash can cause 10-25% error rate for all users until manual intervention.',

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Handling partial infrastructure failures',
    howTheyDoIt: 'Stripe\'s load balancers perform health checks every 2 seconds. When a server fails, it\'s removed from rotation in 6 seconds (3 failed checks). Combined with 10+ redundant servers, users never notice individual failures.',
  },

  famousIncident: {
    title: 'AWS ELB Health Check Cascade Failure',
    company: 'Amazon Web Services',
    year: '2011',
    whatHappened: 'During a network event, ELB health checks failed for many servers simultaneously. The load balancer removed too many healthy servers, overloading the remaining ones. This caused them to fail health checks, creating a cascading failure that took down major sites.',
    lessonLearned: 'Health check thresholds matter! Too aggressive = cascade failures. Too lenient = slow failure detection. The right balance: 2-3 failures over 6-10 seconds.',
    icon: '💥',
  },

  keyPoints: [
    'Active checks: LB pings servers regularly (every 5-10s)',
    'Passive checks: Monitor real traffic for errors',
    'Threshold: 3 consecutive failures → unhealthy',
    'Auto-recovery: Keep checking, re-add when healthy',
    'Health endpoint should check dependencies (DB, disk, memory)',
  ],

  diagram: `
┌─────────────────────────────────────────────┐
│        HEALTH CHECK LIFECYCLE               │
├─────────────────────────────────────────────┤
│                                             │
│  Initial State: Server in rotation         │
│       Load Balancer sends traffic ✓         │
│                                             │
│  Health Check 1: GET /health → 200 OK ✓     │
│  Health Check 2: GET /health → 200 OK ✓     │
│  Health Check 3: GET /health → timeout ✗    │
│       Server still in rotation (1 failure)  │
│  Health Check 4: GET /health → timeout ✗    │
│       Server still in rotation (2 failures) │
│  Health Check 5: GET /health → timeout ✗    │
│       ⚠️ 3 consecutive failures!            │
│       Server marked UNHEALTHY               │
│       Load Balancer STOPS sending traffic   │
│                                             │
│  (Server recovers after fix)                │
│                                             │
│  Health Check 6: GET /health → 200 OK ✓     │
│  Health Check 7: GET /health → 200 OK ✓     │
│       ✅ Server marked HEALTHY              │
│       Load Balancer RESUMES sending traffic │
│                                             │
└─────────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'Active Health Check',
      explanation: 'LB proactively pings server health endpoint every few seconds',
      icon: '🔍',
    },
    {
      title: 'Passive Health Check',
      explanation: 'LB monitors real traffic errors (5xx responses, timeouts)',
      icon: '👀',
    },
    {
      title: 'Failure Threshold',
      explanation: 'Number of consecutive failures before marking unhealthy (typically 3)',
      icon: '🎯',
    },
    {
      title: 'Auto-Recovery',
      explanation: 'LB automatically re-adds servers when health checks pass',
      icon: '🔄',
    },
  ],

  quickCheck: {
    question: 'Why do we require 3 consecutive health check failures before marking a server unhealthy?',
    options: [
      'To save network bandwidth',
      'To avoid removing healthy servers due to temporary network glitches',
      'Because it takes exactly 3 tries to know for sure',
      'To give developers time to manually fix the issue',
    ],
    correctIndex: 1,
    explanation: 'Using multiple consecutive failures (typically 2-3) prevents false positives from temporary network issues or brief CPU spikes. This avoids unnecessarily removing healthy servers.',
  },
};

const step3: GuidedStep = {
  id: 'lb-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Load balancer must detect unhealthy servers and route around them',
    taskDescription: 'Configure health checks on your Load Balancer',
    componentsNeeded: [
      { type: 'client', reason: 'API consumers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Configure health checks', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Backend servers with /health endpoint', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB routes to healthy backends' },
    ],
    successCriteria: [
      'Keep your L7 architecture from Steps 1-2',
      'Click Load Balancer → Enable health checks',
      'Configure: Check interval, timeout, healthy/unhealthy thresholds',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireL7LoadBalancing: true,
    requireHealthChecks: true,
  },
  hints: {
    level1: 'Click Load Balancer → Configure health checks (interval, timeout, thresholds)',
    level2: 'Enable health checks with recommended settings: 5s interval, 2s timeout, 3 failures = unhealthy, 2 successes = healthy',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Session Affinity - Sticky Sessions for Stateful Apps
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🛒',
  scenario: "Users are furious! They add items to their shopping cart, then the cart mysteriously empties.",
  hook: "The problem: Request 1 goes to Server A (cart stored in memory). Request 2 goes to Server B (no cart data). The load balancer is randomly distributing requests!",
  challenge: "Implement session affinity (sticky sessions) so all requests from the same user go to the same backend server.",
  illustration: 'shopping-cart',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Session affinity is working!",
  achievement: "Users now have consistent sessions - their carts persist across requests",
  metrics: [
    { label: 'Session consistency', before: 'Random servers', after: 'Same server per user' },
    { label: 'Cart abandonment', before: '60%', after: '5%' },
    { label: 'User complaints', before: 'Flooding in', after: 'None' },
  ],
  nextTeaser: "Excellent! But we only have one backend server. Time to scale out...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Session Affinity: Keeping Users Sticky',
  conceptExplanation: `**The Problem: Stateful Applications**

Some applications store user state in server memory:
- Shopping carts
- Login sessions
- Multi-step forms
- WebSocket connections

If requests from the same user go to different servers, state is lost!

**The Solution: Session Affinity (Sticky Sessions)**

Ensure all requests from a user go to the same backend server.

**Three Common Approaches:**

**1. Cookie-Based Affinity**
- LB sets a cookie: session_server=server_2
- All future requests with that cookie → Server 2
- Pro: Reliable, survives server restarts
- Con: Requires L7 load balancer

**2. IP Hash Affinity**
- Hash client IP address → always same server
- Pro: Simple, works with L4
- Con: Multiple users behind same NAT hit same server

**3. Consistent Hashing**
- Hash session ID → server
- Pro: Even distribution
- Pro: Minimal disruption when servers added/removed
- Con: More complex implementation

**For API Gateway: Cookie-Based Best**
- L7 already needed for routing
- Reliable across client IP changes
- Can include session ID for tracking

**Trade-offs:**
❌ Server can't be easily removed (drains sessions)
❌ Uneven load if some users more active
❌ Server failure loses those sessions
✅ Enables stateful applications
✅ Simpler backend code (no distributed session store)`,

  whyItMatters: 'Session affinity enables stateful applications without requiring expensive distributed session stores. But it trades perfect load distribution for state consistency.',

  realWorldExample: {
    company: 'Discord',
    scenario: 'WebSocket connections for real-time chat',
    howTheyDoIt: 'Discord uses consistent hashing to route users to the same gateway server. When you send a chat message, it must go to the same server your WebSocket is connected to.',
  },

  famousIncident: {
    title: 'Target Canada\'s Shopping Cart Disaster',
    company: 'Target',
    year: '2013',
    whatHappened: 'During Target\'s launch in Canada, their e-commerce platform had session affinity issues. Shopping carts would randomly empty, causing massive customer frustration. This, combined with other IT issues, contributed to Target abandoning the Canadian market (losing $2 billion).',
    lessonLearned: 'Session management seems like a small detail, but it directly impacts revenue. For e-commerce, losing a user\'s cart loses the sale.',
    icon: '🛒',
  },

  keyPoints: [
    'Session affinity routes same user to same server',
    'Cookie-based: Best for L7 load balancers, reliable',
    'IP hash: Simple but can cause uneven distribution',
    'Trade-off: State consistency vs load distribution',
    'Alternative: Use Redis for distributed sessions (stateless servers)',
  ],

  diagram: `
┌─────────────────────────────────────────────┐
│         SESSION AFFINITY FLOW               │
├─────────────────────────────────────────────┤
│                                             │
│  First Request from User A:                 │
│    Client: "GET /api/cart"                  │
│         ↓                                   │
│    Load Balancer                            │
│         ├─ No session cookie                │
│         ├─ Route to Server 2 (round-robin)  │
│         └─ Set cookie: session=server_2     │
│         ↓                                   │
│    Server 2: Create cart in memory          │
│         ↓                                   │
│    Response: 200 OK                         │
│    Set-Cookie: session=server_2             │
│                                             │
│  Second Request from User A:                │
│    Client: "POST /api/cart/add"             │
│    Cookie: session=server_2                 │
│         ↓                                   │
│    Load Balancer                            │
│         ├─ Read cookie: session=server_2    │
│         └─ Route to Server 2 (affinity!)    │
│         ↓                                   │
│    Server 2: Cart still in memory ✓         │
│         ↓                                   │
│    Response: 200 OK (cart updated)          │
│                                             │
│  Without affinity: Request 2 goes to        │
│  Server 1 → cart not found → user angry!    │
│                                             │
└─────────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'Session Affinity',
      explanation: 'Route all requests from a user to the same backend server',
      icon: '🔗',
    },
    {
      title: 'Cookie-Based',
      explanation: 'LB sets cookie to track which server handles a user',
      icon: '🍪',
    },
    {
      title: 'IP Hash',
      explanation: 'Hash client IP to deterministically select server',
      icon: '#️⃣',
    },
    {
      title: 'Stateless Alternative',
      explanation: 'Use Redis/database for sessions instead (all servers access it)',
      icon: '💾',
    },
  ],

  quickCheck: {
    question: 'Why is cookie-based session affinity better than IP hash for most web applications?',
    options: [
      'It\'s faster than IP hashing',
      'It works reliably even when users switch networks (WiFi to mobile)',
      'It requires less memory',
      'It distributes load more evenly',
    ],
    correctIndex: 1,
    explanation: 'Cookies stay with the user across network changes (WiFi to mobile), while IP hash breaks when the user\'s IP changes. This makes cookie-based affinity more reliable for web apps.',
  },
};

const step4: GuidedStep = {
  id: 'lb-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Requests from the same user must go to the same backend server',
    taskDescription: 'Configure session affinity (sticky sessions) on your Load Balancer',
    componentsNeeded: [
      { type: 'client', reason: 'Users with shopping carts', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Configure session affinity', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Stateful backend servers', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB routes with affinity' },
    ],
    successCriteria: [
      'Keep your L7 + health check architecture from Steps 1-3',
      'Click Load Balancer → Enable session affinity (sticky sessions)',
      'Choose cookie-based affinity for web applications',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireL7LoadBalancing: true,
    requireHealthChecks: true,
    requireSessionAffinity: true,
  },
  hints: {
    level1: 'Click Load Balancer → Enable session affinity with cookie-based tracking',
    level2: 'Configure sticky sessions using application cookies. All requests from the same user will go to the same backend server.',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Horizontal Scaling - Multiple Backend Servers
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Black Friday is here! Traffic just spiked 10x!",
  hook: "Your single backend server is at 100% CPU. Response times went from 50ms to 5 seconds. Checkout is timing out. You're losing thousands of dollars per minute!",
  challenge: "Scale horizontally: configure your App Server to run multiple instances so the load balancer has a fleet to distribute traffic across.",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your system can now scale!",
  achievement: "Multiple backend servers handle the load with room to grow",
  metrics: [
    { label: 'Backend Servers', before: '1', after: '5' },
    { label: 'Capacity', before: '5K RPS', after: '25K RPS' },
    { label: 'CPU Usage', before: '100%', after: '40%' },
    { label: 'Response Time', before: '5000ms', after: '50ms' },
  ],
  nextTeaser: "Great scaling! But what happens when your load balancer itself fails?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Servers, More Power',
  conceptExplanation: `**Two Ways to Scale:**

**Vertical Scaling (Scale Up)**
- Buy bigger server: 4 CPU → 16 CPU
- Pro: Simple, no code changes
- Con: Expensive, hard limits, single point of failure
- Con: Downtime required to upgrade

**Horizontal Scaling (Scale Out)** ⭐
- Add more servers: 1 server → 5 servers
- Pro: Linear cost scaling
- Pro: No downtime (add servers while running)
- Pro: Handles failures (one server down = others continue)
- Pro: Unlimited scalability

**How Load Balancers Enable Horizontal Scaling:**

1. Start with 2 servers at 50% load
2. Traffic spikes 2x
3. Add 2 more servers (now 4 total)
4. Load balancer automatically includes them
5. Each server back to 50% load

**Auto-Scaling (Cloud):**
- Monitor: CPU > 70%?
- Action: Launch 2 more instances
- Result: Within 60 seconds, capacity increased
- Scale down when traffic drops

**Stateless Servers Are Key:**
- Each server can handle any request
- No user affinity needed (unless using sticky sessions)
- Can add/remove servers freely

**With Session Affinity:**
- Connection draining needed when removing servers
- Wait for sessions to expire or migrate
- More complex but still scalable`,

  whyItMatters: 'Horizontal scaling is how modern systems handle billions of users. Companies like Netflix and Amazon have thousands of servers - adding capacity is just a configuration change.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Prime Day traffic spike',
    howTheyDoIt: 'AWS auto-scaling launches thousands of EC2 instances when traffic spikes. ELB automatically includes them in the rotation. When traffic drops, instances are terminated to save costs.',
  },

  famousIncident: {
    title: 'Healthcare.gov Launch Failure',
    company: 'US Government',
    year: '2013',
    whatHappened: 'Healthcare.gov was built with vertical scaling in mind. When millions tried to access it on launch day, the system couldn\'t handle the load. It had a few large servers instead of many small ones, and couldn\'t scale horizontally. The site was down for weeks.',
    lessonLearned: 'Always design for horizontal scaling from day one. Vertical scaling has hard limits. Horizontal scaling is unlimited.',
    icon: '🏥',
  },

  keyPoints: [
    'Horizontal scaling: Add more servers (unlimited capacity)',
    'Vertical scaling: Bigger servers (expensive, limited)',
    'Stateless servers enable easy horizontal scaling',
    'Load balancers automatically distribute to new servers',
    'Auto-scaling: Automatically add/remove based on load',
    'With session affinity: Use connection draining when removing',
  ],

  diagram: `
┌─────────────────────────────────────────────┐
│        HORIZONTAL SCALING JOURNEY           │
├─────────────────────────────────────────────┤
│                                             │
│  Phase 1: Low Traffic (1000 RPS)            │
│    ┌──────────────┐                         │
│    │ Load Balancer│                         │
│    └──────┬───────┘                         │
│       ┌───┴───┐                             │
│       ▼       ▼                             │
│    ┌────┐ ┌────┐                            │
│    │Srv1│ │Srv2│ (Each at 50% CPU)          │
│    └────┘ └────┘                            │
│                                             │
│  Phase 2: Traffic Spike! (3000 RPS)         │
│    ┌──────────────┐                         │
│    │ Load Balancer│                         │
│    └──────┬───────┘                         │
│       ┌───┴───┐                             │
│       ▼       ▼                             │
│    ┌────┐ ┌────┐                            │
│    │Srv1│ │Srv2│ (Each at 150% CPU) ❌      │
│    └────┘ └────┘ Overloaded!                │
│                                             │
│  Phase 3: Auto-Scale! Add 4 Servers         │
│    ┌──────────────┐                         │
│    │ Load Balancer│                         │
│    └──────┬───────┘                         │
│     ┌─────┼─────┬─────┬─────┬─────┐        │
│     ▼     ▼     ▼     ▼     ▼     ▼        │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐     │
│  │Srv1││Srv2││Srv3││Srv4││Srv5││Srv6│     │
│  └────┘└────┘└────┘└────┘└────┘└────┘     │
│  (Each at 50% CPU) ✅                       │
│                                             │
│  Result: Same traffic, 6x servers,          │
│          comfortable capacity!              │
│                                             │
└─────────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'Horizontal Scaling',
      explanation: 'Add more servers to increase capacity (unlimited potential)',
      icon: '📈',
    },
    {
      title: 'Auto-Scaling',
      explanation: 'Automatically add/remove servers based on CPU/memory/traffic',
      icon: '🤖',
    },
    {
      title: 'Stateless Servers',
      explanation: 'Servers store no local state - any server can handle any request',
      icon: '🔄',
    },
    {
      title: 'Connection Draining',
      explanation: 'Wait for active requests to complete before removing a server',
      icon: '⏳',
    },
  ],

  quickCheck: {
    question: 'What is the main advantage of horizontal scaling over vertical scaling?',
    options: [
      'It\'s always cheaper',
      'It\'s faster to implement',
      'It has unlimited capacity and provides redundancy',
      'It requires less configuration',
    ],
    correctIndex: 2,
    explanation: 'Horizontal scaling can grow indefinitely by adding more servers, and provides redundancy (if one fails, others continue). Vertical scaling hits hardware limits.',
  },
};

const step5: GuidedStep = {
  id: 'lb-gateway-step-5',
  stepNumber: 5,
  frIndex: 2,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle high traffic by scaling to multiple backend servers',
    taskDescription: 'Configure your App Server to run multiple instances (scale horizontally)',
    componentsNeeded: [
      { type: 'client', reason: 'High traffic API consumers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes across instances', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Configure for 5+ instances', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic enters through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB distributes to all instances' },
    ],
    successCriteria: [
      'Keep your L7 + health checks + session affinity from Steps 1-4',
      'Click App Server → Set instances to 5 or more',
      'Load balancer now distributes across multiple instances',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireL7LoadBalancing: true,
    requireHealthChecks: true,
    requireSessionAffinity: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Click App Server → Increase instance count to 5 or more',
    level2: 'Your architecture is complete from Steps 1-4. Just configure the App Server to run multiple instances (5+) for horizontal scaling.',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Load Balancer Redundancy - No Single Point of Failure
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "Your system is humming along perfectly. Then disaster strikes.",
  hook: "The load balancer itself crashes! All 5 backend servers are healthy and waiting for traffic, but there's no one to distribute requests. Your entire API is down!",
  challenge: "The load balancer is a single point of failure. We need redundant load balancers with failover.",
  illustration: 'single-point-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "No more single point of failure!",
  achievement: "Redundant load balancers with automatic failover",
  metrics: [
    { label: 'Load Balancers', before: '1 (SPOF)', after: '2+ (HA)' },
    { label: 'Availability', before: '99.9%', after: '99.99%+' },
    { label: 'Failover Time', before: 'Manual (hours)', after: 'Automatic (seconds)' },
  ],
  nextTeaser: "Excellent! Now let's add monitoring and observability...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancer High Availability',
  conceptExplanation: `**The Problem: Load Balancer as SPOF**

You've solved backend server failures:
✅ Health checks detect failures
✅ Traffic routes to healthy servers
✅ 5 backend servers provide redundancy

But what about the load balancer itself?
❌ Single load balancer = single point of failure
❌ Hardware failure = total outage
❌ Maintenance requires downtime

**The Solution: Redundant Load Balancers**

**Active-Passive (Simplest):**
- Primary LB handles all traffic
- Secondary LB monitors primary
- If primary fails → secondary takes over virtual IP
- Uses VRRP (Virtual Router Redundancy Protocol)
- Failover time: 5-10 seconds

**Active-Active (Best Performance):**
- Both LBs handle traffic
- DNS round-robin or anycast
- Double capacity
- No failover delay
- More complex

**Cloud Load Balancers:**
- AWS ELB/ALB: Automatically redundant across AZs
- GCP Load Balancer: Global anycast
- Azure Load Balancer: Zone-redundant by default
- You don't manage the redundancy - cloud does

**How Failover Works (Active-Passive):**

1. Primary and Secondary share a Virtual IP (VIP)
2. Primary "owns" the VIP and handles traffic
3. Secondary sends heartbeats to Primary
4. Primary crashes → Secondary detects missed heartbeats
5. Secondary takes over VIP (gratuitous ARP)
6. Clients don't notice (same IP)
7. Traffic flows to Secondary within 10 seconds

**Best Practice: Use Cloud LBs**
- They handle redundancy automatically
- Distributed across availability zones
- Auto-scaling capacity
- Managed health checks`,

  whyItMatters: 'A single load balancer is a critical single point of failure. Even with perfect backend redundancy, one LB failure takes down everything. High availability requires redundancy at EVERY layer.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Global load balancing with redundancy',
    howTheyDoIt: 'Cloudflare runs hundreds of load balancers in 280+ cities worldwide using anycast. If an entire datacenter fails, traffic automatically routes to the nearest healthy location. No single load balancer is critical.',
  },

  famousIncident: {
    title: 'GitHub Load Balancer Failure',
    company: 'GitHub',
    year: '2016',
    whatHappened: 'A configuration error caused GitHub\'s primary load balancer to fail. They had redundancy, but the failover mechanism itself had a bug. The site was down for 24 minutes while engineers manually activated the backup load balancer.',
    lessonLearned: 'Test your failover! Having redundant components isn\'t enough - you must regularly test that failover actually works. GitHub now runs failover drills quarterly.',
    icon: '🐙',
  },

  keyPoints: [
    'Load balancer itself can be a single point of failure',
    'Active-Passive: Backup LB takes over on failure (10s delay)',
    'Active-Active: Both LBs handle traffic (no delay)',
    'Cloud LBs: Automatic redundancy across zones',
    'Virtual IP (VIP) allows seamless failover',
    'Always test your failover mechanism!',
  ],

  diagram: `
┌─────────────────────────────────────────────┐
│    ACTIVE-PASSIVE LB FAILOVER               │
├─────────────────────────────────────────────┤
│                                             │
│  Normal Operation:                          │
│                                             │
│         ┌──────────┐                        │
│         │  Client  │                        │
│         └────┬─────┘                        │
│              │                              │
│              ▼                              │
│     Virtual IP: 10.0.0.100                  │
│              │                              │
│       ┌──────┴──────┐                       │
│       ▼             ▼                       │
│  ┌─────────┐   ┌─────────┐                 │
│  │ Primary │   │Secondary│                  │
│  │   LB    │   │   LB    │                  │
│  │ ACTIVE  │   │ STANDBY │                  │
│  └────┬────┘   └─────────┘                 │
│       │        ← heartbeat                  │
│       │                                     │
│   ┌───┴────┬────────┬────────┐             │
│   ▼        ▼        ▼        ▼             │
│ ┌───┐    ┌───┐    ┌───┐    ┌───┐          │
│ │Sv1│    │Sv2│    │Sv3│    │Sv4│          │
│ └───┘    └───┘    └───┘    └───┘          │
│                                             │
│  After Primary Fails:                       │
│                                             │
│         ┌──────────┐                        │
│         │  Client  │                        │
│         └────┬─────┘                        │
│              │                              │
│              ▼                              │
│     Virtual IP: 10.0.0.100                  │
│              │                              │
│       ┌──────┴──────┐                       │
│       ▼             ▼                       │
│  ┌─────────┐   ┌─────────┐                 │
│  │ Primary │   │Secondary│                  │
│  │   LB    │   │   LB    │                  │
│  │ FAILED  │   │ ACTIVE  │                  │
│  └─────────┘   └────┬────┘                 │
│       ✗             │                       │
│                     │                       │
│                 ┌───┴────┬────────┬────────┐│
│                 ▼        ▼        ▼        ▼│
│               ┌───┐    ┌───┐    ┌───┐    ┌─│
│               │Sv1│    │Sv2│    │Sv3│    │S│
│               └───┘    └───┘    └───┘    └─│
│                                             │
│  ✅ Same VIP, traffic continues!           │
│  ⏱️  Failover time: 5-10 seconds           │
│                                             │
└─────────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'Single Point of Failure (SPOF)',
      explanation: 'One component whose failure brings down entire system',
      icon: '⚠️',
    },
    {
      title: 'Virtual IP (VIP)',
      explanation: 'Floating IP that can move between servers for seamless failover',
      icon: '🔄',
    },
    {
      title: 'Active-Passive',
      explanation: 'One LB active, backup on standby (simple, slight failover delay)',
      icon: '🔀',
    },
    {
      title: 'Active-Active',
      explanation: 'Both LBs handle traffic (complex, no failover delay)',
      icon: '⚡',
    },
  ],

  quickCheck: {
    question: 'Why is a Virtual IP (VIP) important for load balancer failover?',
    options: [
      'It makes the load balancer faster',
      'It allows seamless failover without clients changing the IP they connect to',
      'It reduces the number of load balancers needed',
      'It improves security',
    ],
    correctIndex: 1,
    explanation: 'A VIP allows the backup load balancer to take over the same IP address when the primary fails, so clients don\'t need to be reconfigured - failover is transparent.',
  },
};

const step6: GuidedStep = {
  id: 'lb-gateway-step-6',
  stepNumber: 6,
  frIndex: 3,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must survive load balancer failures (no single point of failure)',
    taskDescription: 'Configure Load Balancer redundancy (2+ instances with failover)',
    componentsNeeded: [
      { type: 'client', reason: 'API consumers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Configure for HA with 2+ instances', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple backend instances', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic through redundant LBs' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LBs distribute to backends' },
    ],
    successCriteria: [
      'Keep your complete architecture from Steps 1-5',
      'Click Load Balancer → Configure for High Availability',
      'Set 2+ load balancer instances with automatic failover',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireL7LoadBalancing: true,
    requireHealthChecks: true,
    requireSessionAffinity: true,
    requireMultipleAppInstances: true,
    requireLoadBalancerRedundancy: true,
  },
  hints: {
    level1: 'Click Load Balancer → Configure High Availability with 2+ instances',
    level2: 'Enable Load Balancer redundancy by setting instance count to 2 or more. This provides automatic failover if one LB fails.',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 7: Algorithm Selection - Optimizing Traffic Distribution
// =============================================================================

const step7Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Your monitoring shows uneven load distribution. Server 1 is at 80% CPU while Server 3 is at 20%.",
  hook: "The problem: You're using round-robin, which treats all requests equally. But some API calls are expensive (POST /checkout) while others are cheap (GET /health). We need a smarter algorithm!",
  challenge: "Choose the right load balancing algorithm for your use case: round-robin, least connections, or weighted distribution.",
  illustration: 'algorithm-optimization',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Load distribution optimized!",
  achievement: "Smart algorithm selection balances traffic based on actual server load",
  metrics: [
    { label: 'Load Distribution', before: 'Uneven (80% vs 20%)', after: 'Balanced (45% avg)' },
    { label: 'Algorithm', before: 'Round-robin', after: 'Least connections' },
    { label: 'Response Time', before: 'p99: 800ms', after: 'p99: 150ms' },
  ],
  nextTeaser: "Perfect! Now let's ensure we're production-ready with the final exam...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing Algorithms: Choosing the Right Strategy',
  conceptExplanation: `**Common Load Balancing Algorithms:**

**1. Round-Robin (Simple & Fair)**
- Rotate through servers: 1 → 2 → 3 → 1 → 2 → 3
- Pro: Simple, evenly distributes request count
- Con: Ignores server load, request complexity
- Best for: Uniform requests, stateless apps

**2. Least Connections (Load-Aware)**
- Send to server with fewest active connections
- Pro: Adapts to actual server load
- Pro: Handles variable request times well
- Con: Slightly more complex
- Best for: Variable request complexity, long-polling

**3. Weighted Round-Robin (Capacity-Aware)**
- Assign weights: Server 1 (weight=3), Server 2 (weight=1)
- Server 1 gets 3x more traffic
- Pro: Handles different server capacities
- Con: Requires manual tuning
- Best for: Mixed server sizes (t3.medium + t3.xlarge)

**4. IP Hash (Session Affinity Built-In)**
- Hash client IP → always same server
- Pro: Natural session affinity
- Pro: No cookies needed
- Con: Uneven distribution (many users behind same NAT)
- Best for: Stateful apps, WebSockets

**5. Least Response Time (Performance-Aware)**
- Send to server with lowest average response time
- Pro: Optimizes for latency
- Con: More complex, needs metrics
- Best for: Mixed workload priorities

**6. Random (Surprisingly Good)**
- Pick random server
- Pro: Simple, stateless
- Pro: Mathematically fair over time
- Best for: Microservices, when all else equal

**For API Gateway: Least Connections Usually Best**
- API requests vary in complexity
- Long-running requests (checkout) vs fast (health)
- Adapts automatically to load
- No manual weight tuning needed

**When to Use What:**
- Uniform simple requests → Round-robin
- Variable request complexity → Least connections
- Different server sizes → Weighted round-robin
- Session state → IP hash
- WebSockets → IP hash or consistent hashing`,

  whyItMatters: 'The wrong algorithm can cause 2x latency variance and uneven resource utilization. The right algorithm self-balances and optimizes automatically.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Matching riders to drivers',
    howTheyDoIt: 'Uber uses geospatial hashing (consistent hashing with location) to route requests. Riders in San Francisco always hit servers in the SF cluster, ensuring low latency for location queries.',
  },

  famousIncident: {
    title: 'Slack\'s WebSocket Reconnection Storm',
    company: 'Slack',
    year: '2020',
    whatHappened: 'During an outage recovery, millions of clients tried to reconnect simultaneously. Slack\'s round-robin algorithm evenly distributed connections, but some servers hit connection limits while others were idle. A least-connections algorithm would have prevented this.',
    lessonLearned: 'Connection-based protocols (WebSockets, long-polling) need connection-aware algorithms. Round-robin is blind to connection count.',
    icon: '💬',
  },

  keyPoints: [
    'Round-robin: Simple, fair for uniform requests',
    'Least connections: Best for variable request complexity',
    'Weighted: Handles different server capacities',
    'IP hash: Built-in session affinity',
    'Choose based on your traffic pattern, not defaults',
  ],

  diagram: `
┌─────────────────────────────────────────────┐
│       ALGORITHM COMPARISON                  │
├─────────────────────────────────────────────┤
│                                             │
│  ROUND-ROBIN:                               │
│    Request 1 → Server 1                     │
│    Request 2 → Server 2                     │
│    Request 3 → Server 3                     │
│    Request 4 → Server 1 (cycle)             │
│                                             │
│    ✅ Simple, fair request count            │
│    ❌ Ignores: heavy requests, server load  │
│                                             │
│  LEAST CONNECTIONS:                         │
│    Server 1: 5 connections                  │
│    Server 2: 2 connections ← chosen!        │
│    Server 3: 8 connections                  │
│                                             │
│    ✅ Adapts to actual load                 │
│    ✅ Handles long-running requests         │
│                                             │
│  WEIGHTED ROUND-ROBIN:                      │
│    Server 1 (16 CPU): weight = 4            │
│    Server 2 (8 CPU):  weight = 2            │
│    Server 3 (4 CPU):  weight = 1            │
│                                             │
│    Distribution: 1→1→1→1→2→2→3 (cycle)      │
│                                             │
│    ✅ Uses server capacity efficiently      │
│    ❌ Requires manual weight configuration  │
│                                             │
│  IP HASH:                                   │
│    hash(192.168.1.5) % 3 = 2 → Server 2     │
│    Same IP always goes to Server 2          │
│                                             │
│    ✅ Session affinity without cookies      │
│    ❌ Uneven if many users share IP (NAT)   │
│                                             │
└─────────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'Round-Robin',
      explanation: 'Rotate through servers sequentially (simple & fair)',
      icon: '🔄',
    },
    {
      title: 'Least Connections',
      explanation: 'Route to server with fewest active connections (load-aware)',
      icon: '📊',
    },
    {
      title: 'Weighted',
      explanation: 'Distribute based on server capacity (bigger servers get more)',
      icon: '⚖️',
    },
    {
      title: 'IP Hash',
      explanation: 'Hash client IP for consistent routing (session affinity)',
      icon: '#️⃣',
    },
  ],

  quickCheck: {
    question: 'Why is least-connections better than round-robin for an API gateway with variable request complexity?',
    options: [
      'It\'s faster to compute',
      'It automatically routes to servers with capacity, not just next in rotation',
      'It uses less memory',
      'It provides better security',
    ],
    correctIndex: 1,
    explanation: 'Least-connections adapts to actual server load. A server handling 3 slow checkout requests won\'t get more traffic, while round-robin would keep sending requests regardless of load.',
  },
};

const step7: GuidedStep = {
  id: 'lb-gateway-step-7',
  stepNumber: 7,
  frIndex: 3,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Load must be distributed based on actual server capacity and load',
    taskDescription: 'Configure load balancing algorithm for optimal distribution',
    componentsNeeded: [
      { type: 'client', reason: 'API consumers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Configure algorithm', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Multiple backend instances', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'Traffic through LB' },
      { from: 'Load Balancer', to: 'App Server', reason: 'LB uses smart algorithm' },
    ],
    successCriteria: [
      'Keep your complete HA architecture from Steps 1-6',
      'Click Load Balancer → Algorithm Settings',
      'Choose least-connections for variable API workloads',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireL7LoadBalancing: true,
    requireHealthChecks: true,
    requireSessionAffinity: true,
    requireMultipleAppInstances: true,
    requireLoadBalancerRedundancy: true,
    requireOptimalAlgorithm: true,
  },
  hints: {
    level1: 'Click Load Balancer → Configure algorithm to least-connections',
    level2: 'Set the load balancing algorithm to least-connections for optimal distribution based on actual server load.',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 8: Final Exam - Production Readiness Test
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎓',
  scenario: "It's launch day! Your load balancing gateway will handle production traffic.",
  hook: "The CTO wants proof it's ready. You need to pass comprehensive tests covering all requirements: L7 routing, health checks, session affinity, high availability, and performance under load.",
  challenge: "Build a complete production-grade load balancing gateway that passes all test cases.",
  illustration: 'final-exam',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Production ready! All tests passed!",
  achievement: "You've built a complete, resilient, high-performance load balancing gateway",
  metrics: [
    { label: 'Test Cases Passed', after: '8/8 ✓' },
    { label: 'Production Ready', after: 'Yes ✓' },
    { label: 'High Availability', after: '99.99%+ ✓' },
  ],
  nextTeaser: "Congratulations! You've mastered load balancing. Try building this in 'Solve on Your Own' mode or tackle a new challenge!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Production-Grade Load Balancing: The Complete Picture',
  conceptExplanation: `**You've Built a Complete System:**

**Layer 7 Routing** ✅
- HTTP-aware routing
- Path-based distribution
- Header inspection
- SSL termination

**Health & Resilience** ✅
- Active health checks
- Automatic failover
- Unhealthy server removal
- Connection draining

**Session Management** ✅
- Cookie-based affinity
- Consistent user experience
- Stateful app support

**Scalability** ✅
- Horizontal scaling (5+ servers)
- Load-aware algorithms
- Auto-scaling ready

**High Availability** ✅
- Redundant load balancers
- No single point of failure
- 99.99%+ uptime

**This is Production-Grade Infrastructure**

Real companies use these exact patterns:
- Netflix: L7 Zuul gateway
- Uber: Multi-tier load balancing
- Stripe: Health-aware routing
- Amazon: ELB/ALB with all features

**Key Principles You've Learned:**

1. **Defense in Depth**: Redundancy at every layer
2. **Fail Fast**: Health checks detect issues quickly
3. **Graceful Degradation**: System degrades, doesn't crash
4. **Horizontal Scaling**: More servers = more capacity
5. **Smart Routing**: Right algorithm for your workload`,

  whyItMatters: 'These patterns are the foundation of modern internet infrastructure. Every major site uses load balancing. You now understand the production-grade implementation.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Global load balancing for google.com',
    howTheyDoIt: 'Multi-tier: DNS routes by geography → Regional L4 balancers → Service-specific L7 balancers → Thousands of backend servers. Health checks at every layer. Complete redundancy.',
  },

  keyPoints: [
    'L7 routing enables smart API gateway behavior',
    'Health checks prevent cascading failures',
    'Session affinity enables stateful applications',
    'Horizontal scaling provides unlimited capacity',
    'Redundancy eliminates single points of failure',
    'Algorithm choice impacts efficiency and latency',
  ],

  diagram: `
┌─────────────────────────────────────────────┐
│     PRODUCTION LOAD BALANCING GATEWAY       │
├─────────────────────────────────────────────┤
│                                             │
│         ┌────────────┐                      │
│         │   Client   │                      │
│         └──────┬─────┘                      │
│                │                            │
│                ▼                            │
│    ┌───────────────────────┐               │
│    │  Load Balancer (HA)   │               │
│    │  - L7 HTTP routing    │               │
│    │  - Health checks      │               │
│    │  - Session affinity   │               │
│    │  - 2+ instances       │               │
│    │  - Least-connections  │               │
│    └───────────┬───────────┘               │
│                │                            │
│    ┌───────────┼───────────┬───────┐       │
│    │           │           │       │       │
│    ▼           ▼           ▼       ▼       │
│  ┌────┐      ┌────┐      ┌────┐  ┌────┐   │
│  │API │      │API │      │API │  │API │   │
│  │Sv 1│      │Sv 2│      │Sv 3│  │Sv 4│   │
│  └────┘      └────┘      └────┘  └────┘   │
│     ↓           ↓           ↓       ↓      │
│  Health     Health      Health  Health     │
│  checks     checks      checks  checks     │
│  every 5s   every 5s    every 5s every 5s  │
│                                             │
│  ✅ L7 routing                              │
│  ✅ Health monitoring                       │
│  ✅ Session affinity                        │
│  ✅ Horizontal scaling (4 servers)          │
│  ✅ HA load balancers                       │
│  ✅ Smart algorithm (least-conn)            │
│                                             │
│  Result: Production-grade infrastructure!   │
│                                             │
└─────────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'Defense in Depth',
      explanation: 'Multiple layers of redundancy and protection',
      icon: '🛡️',
    },
    {
      title: 'Graceful Degradation',
      explanation: 'System remains partially functional even when components fail',
      icon: '📉',
    },
    {
      title: 'Production Grade',
      explanation: 'Reliable, scalable, observable, and maintainable',
      icon: '⚙️',
    },
  ],

  quickCheck: {
    question: 'What makes this load balancing gateway "production-grade"?',
    options: [
      'It uses the latest technology',
      'It has redundancy at every layer and handles failures gracefully',
      'It has the most features',
      'It costs the most money',
    ],
    correctIndex: 1,
    explanation: 'Production-grade means resilient, scalable, and reliable. The combination of L7 routing, health checks, session affinity, redundancy, and smart algorithms makes this production-ready.',
  },
};

const step8: GuidedStep = {
  id: 'lb-gateway-step-8',
  stepNumber: 8,
  frIndex: 4,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Complete system must pass all production test cases',
    taskDescription: 'Build a complete production-grade load balancing gateway that passes all tests',
    componentsNeeded: [
      { type: 'client', reason: 'API consumers', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Full-featured HA gateway', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Horizontally scaled backends', displayName: 'API Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Load Balancer', reason: 'All traffic through gateway' },
      { from: 'Load Balancer', to: 'App Server', reason: 'Smart distribution to backends' },
    ],
    successCriteria: [
      'Pass all 8 production test cases',
      'L7 routing configured',
      'Health checks active',
      'Session affinity enabled',
      '5+ backend instances',
      'Redundant load balancers',
      'Optimal algorithm configured',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
    requireL7LoadBalancing: true,
    requireHealthChecks: true,
    requireSessionAffinity: true,
    requireMultipleAppInstances: true,
    requireLoadBalancerRedundancy: true,
    requireOptimalAlgorithm: true,
  },
  hints: {
    level1: 'Ensure all features from Steps 1-7 are configured',
    level2: 'Your complete system needs: L7 routing, health checks, session affinity, 5+ backend instances, redundant LBs, least-connections algorithm',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const loadBalancingGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'load-balancing-gateway-guided',
  problemTitle: 'Build a Load Balancing Gateway - A System Design Journey',

  requirementsPhase: loadBalancingGatewayRequirementsPhase,

  totalSteps: 8,
  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  finalExamTestCases: [
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Client requests flow through load balancer to backend servers.',
      traffic: { type: 'mixed', rps: 100, readRps: 80, writeRps: 20 },
      duration: 10,
      passCriteria: { maxErrorRate: 0 },
    },
    {
      name: 'L7 Intelligent Routing',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Load balancer routes based on HTTP headers and URL paths (L7).',
      traffic: { type: 'read', rps: 500, readRps: 500 },
      duration: 30,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'Health Check Failover',
      type: 'functional',
      requirement: 'FR-2',
      description: 'System detects unhealthy servers and routes around them automatically.',
      traffic: { type: 'mixed', rps: 1000, readRps: 800, writeRps: 200 },
      duration: 60,
      failureInjection: { type: 'server_crash', atSecond: 20, recoverySecond: 40 },
      passCriteria: { minAvailability: 0.98, maxErrorRate: 0.05 },
    },
    {
      name: 'Session Affinity',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Requests from the same user consistently route to the same backend server.',
      traffic: { type: 'mixed', rps: 800, readRps: 600, writeRps: 200 },
      duration: 30,
      passCriteria: { sessionConsistency: 0.95, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: High Throughput',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10,000 RPS with p99 latency under 50ms.',
      traffic: { type: 'mixed', rps: 10000, readRps: 8000, writeRps: 2000 },
      duration: 60,
      passCriteria: { maxP99Latency: 50, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: Horizontal Scaling',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'System scales to handle 5x traffic spike with multiple backend instances.',
      traffic: { type: 'mixed', rps: 5000, readRps: 4000, writeRps: 1000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Load Balancer HA',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Redundant load balancers maintain availability during LB failure.',
      traffic: { type: 'mixed', rps: 2000, readRps: 1600, writeRps: 400 },
      duration: 90,
      failureInjection: { type: 'lb_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 10, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-A1: Algorithm Efficiency',
      type: 'performance',
      requirement: 'NFR-A1',
      description: 'Load balancing algorithm distributes load evenly based on server capacity.',
      traffic: { type: 'mixed', rps: 5000, readRps: 4000, writeRps: 1000 },
      duration: 60,
      passCriteria: { loadBalance: 0.9, maxP99Latency: 80 },
    },
  ] as TestCase[],
};

export function getLoadBalancingGatewayGuidedTutorial(): GuidedTutorial {
  return loadBalancingGatewayGuidedTutorial;
}

export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = loadBalancingGatewayRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= loadBalancingGatewayRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
