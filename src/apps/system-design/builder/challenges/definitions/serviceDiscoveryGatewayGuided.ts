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
 * Service Discovery Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches service discovery and dynamic
 * routing concepts for microservices architectures.
 *
 * Focus Areas:
 * - Service registration and discovery
 * - Health checks and failover
 * - Client-side load balancing
 * - DNS-based discovery
 * - Circuit breakers
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic service registry
 * Steps 4-6: DNS-based discovery, client-side load balancing, circuit breaking
 *
 * Key Pedagogy: First make it WORK, then make it SURVIVE, then make it SCALE
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const serviceDiscoveryRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Service Discovery system for a dynamic microservices architecture",

  interviewer: {
    name: 'Sarah Chen',
    role: 'Distinguished Engineer',
    avatar: '👩‍💻',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'service-registration',
      category: 'functional',
      question: "How do backend services let the system know they exist and are ready to handle traffic?",
      answer: "Services use **self-registration**: When a service instance starts up, it registers itself with the Service Registry. It sends:\n\n1. Service name (e.g., 'users-service')\n2. IP address and port (e.g., '10.0.1.45:8080')\n3. Health check endpoint (e.g., '/health')\n4. Metadata (version, region, instance ID)\n\nThe registry maintains this as the source of truth for all running services.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Self-registration is the foundation of service discovery - services announce themselves rather than being manually configured",
    },
    {
      id: 'service-lookup',
      category: 'functional',
      question: "When a client needs to call a service, how does it find available instances?",
      answer: "The client queries the Service Registry:\n\nClient: 'Give me all healthy instances of users-service'\nRegistry: Returns [10.0.1.45:8080, 10.0.1.46:8080, 10.0.1.47:8080]\n\nThe client then picks one instance using load balancing (round-robin, random, or least connections). This is called **client-side service discovery**.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Service discovery enables dynamic routing - clients find services at runtime without hardcoded addresses",
    },
    {
      id: 'health-checks',
      category: 'functional',
      question: "What happens if a service instance crashes or becomes unhealthy?",
      answer: "The Service Registry performs periodic **health checks**:\n\n1. Every 10 seconds, ping each service's /health endpoint\n2. If 3 consecutive failures → mark instance as unhealthy\n3. Unhealthy instances removed from service lookup results\n4. If health recovers → automatically added back\n\nThis provides **automatic failover** without manual intervention.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Health checks enable automatic failure detection and recovery - no manual intervention needed",
    },

    // IMPORTANT - Clarifications
    {
      id: 'service-deregistration',
      category: 'clarification',
      question: "How do services leave the registry when they shut down gracefully?",
      answer: "Services send a **deregistration** request on shutdown:\n\n1. Service receives SIGTERM (shutdown signal)\n2. Before exiting, calls registry.deregister()\n3. Registry immediately removes the instance\n\nFor ungraceful shutdowns (crashes), health checks detect failure within ~30 seconds and auto-deregister.",
      importance: 'important',
      insight: "Graceful deregistration is fast (instant), ungraceful relies on health check timeout",
    },
    {
      id: 'dns-vs-registry',
      category: 'clarification',
      question: "Should we use DNS for service discovery or a dedicated registry like Consul?",
      answer: "Both have trade-offs:\n\n**DNS-based** (e.g., Kubernetes DNS):\n- Simple, built into most platforms\n- Standard DNS queries\n- DNS caching can cause stale results\n\n**Registry-based** (e.g., Consul, Eureka):\n- Real-time updates\n- Rich metadata and health checks\n- Requires running additional infrastructure\n\nFor this interview, let's design with a dedicated registry and add DNS as an option.",
      importance: 'important',
      insight: "Registry-based discovery gives more control and faster updates than DNS",
    },
    {
      id: 'load-balancing-strategy',
      category: 'scope',
      question: "How should clients pick which instance to call when there are multiple healthy ones?",
      answer: "Common client-side load balancing strategies:\n\n1. **Round-robin**: Rotate through instances (simple, fair)\n2. **Random**: Pick random instance (simple, works at scale)\n3. **Least connections**: Route to instance with fewest active connections\n4. **Weighted**: Some instances get more traffic (different hardware sizes)\n\nFor MVP, let's implement round-robin - it's simple and effective.",
      importance: 'important',
      insight: "Client-side load balancing means no central load balancer bottleneck",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs (Interview Discovery Order)
    // =============================================================================

    // 1. THROUGHPUT
    {
      id: 'service-count',
      category: 'throughput',
      question: "How many microservices will this registry need to track?",
      answer: "We're starting with 20 microservices, planning for growth to 200+ services over the next year",
      importance: 'critical',
      learningPoint: "Service count affects registry storage and query performance",
    },
    {
      id: 'instance-count',
      category: 'throughput',
      question: "How many instances per service on average?",
      answer: "Each service runs 5-10 instances on average. Popular services might have 50+ instances. Total instances across all services: ~1000-2000.",
      importance: 'critical',
      calculation: {
        formula: "20 services × 10 instances avg = 200 instances, growing to 2000+",
        result: "Registry must efficiently handle 2000+ service instances",
      },
      learningPoint: "Instance count determines registry memory and query load",
    },
    {
      id: 'lookup-rps',
      category: 'throughput',
      question: "How many service discovery lookups per second?",
      answer: "Every service call starts with a lookup. At 100K requests/sec across all services, we need ~100K lookups/sec. With caching, actual registry queries might be 1K-10K/sec.",
      importance: 'critical',
      calculation: {
        formula: "100K RPS / 100 (cache hit rate) = 1K registry queries/sec",
        result: "~1K-10K registry lookups per second",
      },
      learningPoint: "Client-side caching is critical to reduce registry load",
    },

    // 2. LATENCY
    {
      id: 'lookup-latency',
      category: 'latency',
      question: "How fast should service discovery lookups be?",
      answer: "Service discovery should add < 1ms overhead. Clients cache results for 30-60 seconds, so most lookups are local (0ms). Registry queries should be < 10ms p99.",
      importance: 'critical',
      learningPoint: "Fast lookups are critical - service discovery is on the hot path for every request",
    },
    {
      id: 'health-check-frequency',
      category: 'latency',
      question: "How often should we run health checks?",
      answer: "Every 10 seconds per instance. With 2000 instances, that's 200 health checks per second. Faster checks (5s) mean faster failure detection but more overhead.",
      importance: 'important',
      calculation: {
        formula: "2000 instances × 1 check/10s = 200 checks/sec",
        result: "~200 health check requests per second",
      },
      insight: "Balance between fast failure detection and health check overhead",
    },

    // 3. RELIABILITY
    {
      id: 'registry-availability',
      category: 'reliability',
      question: "What happens if the Service Registry goes down?",
      answer: "This is critical! If the registry is down, no service can discover others. We need:\n\n1. **Registry HA**: Run 3+ registry instances (consensus via Raft)\n2. **Client-side caching**: Clients cache service locations for 60s\n3. **Stale data tolerance**: Better to use slightly stale data than fail completely\n\nWith caching, services can operate for 60s even if registry is down.",
      importance: 'critical',
      learningPoint: "Service Registry is critical infrastructure - must be highly available",
    },
    {
      id: 'partition-tolerance',
      category: 'reliability',
      question: "What if there's a network partition between registry instances?",
      answer: "We need consensus (Raft or Paxos). In a 5-node registry cluster:\n\n- 3+ nodes can form quorum → system continues\n- < 3 nodes → registry becomes read-only\n\nThis prevents split-brain where different partitions have different views of services.",
      importance: 'important',
      learningPoint: "Consensus ensures consistency even during network partitions",
    },

    // 4. BURSTS
    {
      id: 'service-deployment',
      category: 'burst',
      question: "What happens during a deployment when all instances restart at once?",
      answer: "This creates a registration burst:\n\n- 50 instances × 20 services = 1000 simultaneous registrations\n- Registry must handle 1000 writes in ~10 seconds\n- Health checks start immediately, creating 1000 HTTP requests\n\nRegistry needs to scale write throughput during deployments.",
      importance: 'important',
      learningPoint: "Deployments create registration storms - registry must handle burst writes",
    },
  ],

  minimumQuestionsRequired: 2,
  criticalQuestionIds: ['service-registration', 'service-lookup', 'health-checks'],
  criticalFRQuestionIds: ['service-registration', 'service-lookup', 'health-checks'],
  criticalScaleQuestionIds: ['service-count', 'instance-count', 'lookup-rps', 'registry-availability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Service self-registration',
      description: 'Services register themselves on startup with name, address, and health check endpoint',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Service discovery lookups',
      description: 'Clients query registry to find healthy service instances',
      emoji: '🔍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Automatic health checks and failover',
      description: 'Registry monitors service health and removes failed instances automatically',
      emoji: '💓',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (Infrastructure service)',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 5,
    readWriteRatio: '1000:1 (mostly reads)',
    calculatedWriteRPS: { average: 10, peak: 200 },
    calculatedReadRPS: { average: 1000, peak: 10000 },
    maxPayloadSize: '~1KB (service metadata)',
    redirectLatencySLA: 'p99 < 10ms (registry query)',
    createLatencySLA: 'p99 < 50ms (registration)',
  },

  architecturalImplications: [
    '✅ 2000 instances → In-memory registry with fast lookup',
    '✅ 10K lookups/sec → Client-side caching essential (30-60s TTL)',
    '✅ < 10ms registry queries → Local replicas in each region',
    '✅ HA requirement → 3+ registry nodes with Raft consensus',
    '✅ Health checks → 200/sec manageable, run async from main query path',
  ],

  outOfScope: [
    'Service mesh (Istio/Linkerd) integration',
    'Service versioning and canary deployments',
    'Cross-region service discovery',
    'Service-to-service authentication',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple service registry where services can register and clients can discover them. Once the basics work, we'll add health checks, client-side load balancing, and resilience features.",
};

// =============================================================================
// STEP 1: Build the Service Registry
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📋',
  scenario: "Welcome to MicroCorp! You're building the Service Discovery infrastructure.",
  hook: "The team has 5 microservices, but they're all hardcoded to talk to each other. When instances scale or move, everything breaks!",
  challenge: "Build a Service Registry where services can register themselves and clients can discover them.",
  illustration: 'service-registry',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your Service Registry is online!",
  achievement: "Services can now register and be discovered dynamically",
  metrics: [
    { label: 'Registry status', after: 'Online' },
    { label: 'Discovery model', before: 'Hardcoded IPs', after: 'Dynamic registry' },
  ],
  nextTeaser: "But how do services actually register themselves?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Service Registry: The Phone Book for Microservices',
  conceptExplanation: `A **Service Registry** is a database of all running service instances.

**Without Service Registry:**
- Service A hardcodes: "Users Service is at 10.0.1.45:8080"
- Users Service scales to 10 instances
- Service A still only knows about 10.0.1.45
- 9 instances sit idle, 1 instance is overloaded
- If 10.0.1.45 crashes, Service A breaks completely

**With Service Registry:**
- Users Service instances register themselves on startup
- Service A queries: "Give me all users-service instances"
- Registry returns all 10 healthy instances
- Service A load balances across all instances
- If one crashes, registry auto-removes it

Think of it like a phone book that updates itself automatically!`,

  whyItMatters: 'Service Registry enables true cloud-native architecture - services can scale, move, and restart without manual configuration changes.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Netflix runs thousands of microservices across AWS',
    howTheyDoIt: 'Uses Eureka (their open-source service registry). Each service instance registers on startup. Eureka handles 1M+ registrations/minute during peak deployments.',
  },

  keyPoints: [
    'Service Registry maintains a list of all running service instances',
    'Services self-register on startup',
    'Clients query registry to discover available instances',
    'Registry is the single source of truth for service locations',
  ],

  diagram: `
┌──────────────────────────────────────────┐
│         Service Registry                 │
│                                          │
│  users-service:                          │
│    - 10.0.1.45:8080 (healthy)            │
│    - 10.0.1.46:8080 (healthy)            │
│    - 10.0.1.47:8080 (healthy)            │
│                                          │
│  orders-service:                         │
│    - 10.0.2.10:8080 (healthy)            │
│    - 10.0.2.11:8080 (healthy)            │
└──────────────────────────────────────────┘
`,

  keyConcepts: [
    {
      title: 'Service Registry',
      explanation: 'Central database of all service instances',
      icon: '📋',
    },
    {
      title: 'Registration',
      explanation: 'Services announce themselves to the registry',
      icon: '📝',
    },
    {
      title: 'Discovery',
      explanation: 'Clients query registry to find services',
      icon: '🔍',
    },
  ],

  quickCheck: {
    question: 'What is the main benefit of a Service Registry?',
    options: [
      'Stores user data',
      'Enables dynamic service discovery without hardcoded IPs',
      'Runs business logic',
      'Replaces all databases',
    ],
    correctIndex: 1,
    explanation: 'Service Registry enables dynamic discovery - services can scale and move without manual configuration updates.',
  },
};

const step1: GuidedStep = {
  id: 'service-discovery-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Service Registry stores and provides service locations',
    taskDescription: 'Add Service Discovery component to act as the registry',
    componentsNeeded: [
      { type: 'service_discovery', reason: 'Central registry for all services', displayName: 'Service Registry' },
    ],
    connectionsNeeded: [],
    successCriteria: ['Add Service Discovery component'],
  },
  validation: {
    requiredComponents: ['service_discovery'],
    requiredConnections: [],
  },
  hints: {
    level1: 'Drag Service Discovery component onto the canvas',
    level2: 'Find Service Discovery in the sidebar and add it to your architecture',
    solutionComponents: [{ type: 'service_discovery' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 2: Service Self-Registration
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📝',
  scenario: "Your Users Service just started up with 3 instances!",
  hook: "But the Service Registry is empty. The instances need to announce themselves so clients can find them!",
  challenge: "Connect backend services to the registry so they can self-register on startup.",
  illustration: 'self-registration',
};

const step2Celebration: CelebrationContent = {
  emoji: '✨',
  message: "Services are now self-registering!",
  achievement: "Backend instances automatically register when they start",
  metrics: [
    { label: 'Registered services', after: '2 services' },
    { label: 'Registration model', before: 'Manual', after: 'Automatic' },
  ],
  nextTeaser: "Great! But how do clients actually find these registered services?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Self-Registration Pattern',
  conceptExplanation: `**Self-registration** means services register themselves without manual intervention.

**Registration Process:**
\`\`\`python
# Service instance startup code
def on_startup():
    service_info = {
        "service_name": "users-service",
        "instance_id": "users-123",
        "host": "10.0.1.45",
        "port": 8080,
        "health_check": "http://10.0.1.45:8080/health",
        "metadata": {
            "version": "v2.1",
            "region": "us-west-2"
        }
    }
    registry.register(service_info)
    print("Registered with Service Registry!")
\`\`\`

**What gets registered:**
1. Service name (e.g., "users-service")
2. Instance address (IP + port)
3. Health check endpoint
4. Metadata (version, region, capabilities)

**Heartbeat mechanism:**
Many registries require periodic heartbeats to prove the service is still alive. If heartbeats stop, the instance is auto-deregistered.`,

  whyItMatters: 'Self-registration eliminates manual configuration. Services can be deployed, scaled, and restarted without any infrastructure changes.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Uber deploys thousands of service instances daily',
    howTheyDoIt: 'Services use TChannel protocol to self-register with Hyperbahn (their service mesh). Registration happens in <100ms on startup.',
  },

  famousIncident: {
    title: 'AWS Service Discovery Launch Failure',
    company: 'AWS',
    year: '2017',
    whatHappened: 'AWS launched Cloud Map (service discovery) but initial implementation had a bug where failed instances weren\'t deregistered quickly. This caused traffic to be sent to dead instances, causing cascading failures for customers.',
    lessonLearned: 'Deregistration is as important as registration. Always implement graceful shutdown and health-based deregistration.',
    icon: '☁️',
  },

  keyPoints: [
    'Services call registry.register() on startup',
    'Registration includes: name, address, health endpoint, metadata',
    'Heartbeats keep registration alive (or TTL expiration)',
    'Graceful shutdown includes deregistration',
  ],

  diagram: `
Service Startup Flow:
─────────────────────────────────────────
1. Service instance starts
   └─ Load config, connect to database

2. Register with Service Registry
   └─ POST /register
       {
         "name": "users-service",
         "address": "10.0.1.45:8080",
         "health": "/health"
       }

3. Start serving traffic
   └─ Listen on port 8080

4. Send heartbeats every 30s
   └─ PUT /heartbeat
`,

  keyConcepts: [
    { title: 'Self-Registration', explanation: 'Services register themselves on startup', icon: '📝' },
    { title: 'Heartbeat', explanation: 'Periodic signal that service is alive', icon: '💓' },
    { title: 'Deregistration', explanation: 'Service removes itself on shutdown', icon: '👋' },
  ],

  quickCheck: {
    question: 'When should a service register with the Service Registry?',
    options: [
      'Before deployment',
      'On startup, after it\'s ready to serve traffic',
      'When the first request arrives',
      'Manually by an admin',
    ],
    correctIndex: 1,
    explanation: 'Services register on startup after they\'re fully initialized and ready to handle requests. This ensures clients only discover healthy instances.',
  },
};

const step2: GuidedStep = {
  id: 'service-discovery-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-1: Services self-register with the registry',
    taskDescription: 'Add backend services and connect them to the registry for registration',
    componentsNeeded: [
      { type: 'service_discovery', reason: 'Service Registry', displayName: 'Service Registry' },
      { type: 'app_server', reason: 'Users Service instances', displayName: 'Users Service' },
      { type: 'app_server', reason: 'Orders Service instances', displayName: 'Orders Service' },
    ],
    connectionsNeeded: [
      { from: 'Users Service', to: 'Service Registry', reason: 'Register on startup' },
      { from: 'Orders Service', to: 'Service Registry', reason: 'Register on startup' },
    ],
    successCriteria: [
      'Add Users Service and Orders Service',
      'Connect both services to Service Registry',
    ],
  },
  validation: {
    requiredComponents: ['service_discovery', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'service_discovery' },
    ],
  },
  hints: {
    level1: 'Add two App Server components for Users and Orders services',
    level2: 'Connect each App Server to the Service Registry',
    solutionComponents: [
      { type: 'service_discovery' },
      { type: 'app_server' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'service_discovery' },
      { from: 'app_server', to: 'service_discovery' },
    ],
  },
};

// =============================================================================
// STEP 3: Client-Side Service Discovery
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔍',
  scenario: "Your mobile app needs to call the Users Service!",
  hook: "But the app doesn't know where Users Service instances are running. It needs to ask the Service Registry!",
  challenge: "Add a client that queries the Service Registry to discover and call backend services.",
  illustration: 'client-discovery',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Client-side service discovery is working!",
  achievement: "Clients can now dynamically discover and call services",
  metrics: [
    { label: 'Service discovery', before: 'Hardcoded', after: 'Dynamic' },
    { label: 'Client routing', after: 'Client-side' },
  ],
  nextTeaser: "Perfect! But what happens when a service instance crashes?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Client-Side Service Discovery',
  conceptExplanation: `In **client-side discovery**, the client queries the registry and picks which instance to call.

**Discovery Flow:**
\`\`\`python
# Client making a request
def call_users_service(user_id):
    # 1. Query Service Registry
    instances = registry.lookup("users-service")
    # Returns: ["10.0.1.45:8080", "10.0.1.46:8080", "10.0.1.47:8080"]

    # 2. Client-side load balancing
    instance = round_robin_pick(instances)

    # 3. Make the actual call
    response = http.get(f"http://{instance}/users/{user_id}")
    return response
\`\`\`

**Client-Side vs Server-Side Discovery:**

**Client-Side (Netflix Eureka style):**
- Client queries registry
- Client picks instance (load balancing)
- Direct client → service connection
- Pros: No proxy overhead, flexible load balancing
- Cons: Every client needs discovery logic

**Server-Side (Traditional load balancer):**
- Client calls load balancer
- Load balancer queries registry and routes
- Extra network hop
- Pros: Simple clients
- Cons: Load balancer becomes bottleneck`,

  whyItMatters: 'Client-side discovery eliminates the load balancer as a single point of failure and bottleneck. Clients have full control over routing decisions.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Netflix handles billions of requests daily',
    howTheyDoIt: 'Uses Ribbon (client-side load balancer) + Eureka (service registry). Each client caches service locations for 30s, queries Eureka every 30s for updates.',
  },

  keyPoints: [
    'Client queries registry for service instances',
    'Client performs load balancing (round-robin, random, etc.)',
    'Client caches results for 30-60s to reduce registry load',
    'No central load balancer needed',
  ],

  diagram: `
Client-Side Discovery Flow:
─────────────────────────────────────────
     ┌────────┐
     │ Client │
     └───┬────┘
         │
         │ 1. lookup("users-service")
         ▼
   ┌──────────────────┐
   │ Service Registry │
   └──────┬───────────┘
         │ 2. Return: [10.0.1.45, 10.0.1.46, 10.0.1.47]
         ▼
     ┌────────┐
     │ Client │ ← 3. Pick one (round-robin)
     └───┬────┘
         │ 4. HTTP GET /users/123
         ▼
   ┌──────────────┐
   │ Users Service│
   │ 10.0.1.45    │
   └──────────────┘
`,

  keyConcepts: [
    { title: 'Service Lookup', explanation: 'Query registry for service instances', icon: '🔍' },
    { title: 'Client-Side LB', explanation: 'Client picks which instance to call', icon: '⚖️' },
    { title: 'Registry Cache', explanation: 'Client caches results locally', icon: '💾' },
  ],

  quickCheck: {
    question: 'In client-side service discovery, who performs load balancing?',
    options: [
      'The Service Registry',
      'The load balancer',
      'The client application',
      'The backend service',
    ],
    correctIndex: 2,
    explanation: 'The client queries the registry for available instances and picks one using a load balancing algorithm (round-robin, random, etc.).',
  },
};

const step3: GuidedStep = {
  id: 'service-discovery-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-2: Clients query registry to discover services',
    taskDescription: 'Add a client that discovers and calls services via the registry',
    componentsNeeded: [
      { type: 'client', reason: 'Represents client applications', displayName: 'Client' },
      { type: 'service_discovery', reason: 'Service Registry', displayName: 'Service Registry' },
      { type: 'app_server', reason: 'Backend services', displayName: 'Services' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Service Registry', reason: 'Query for service instances' },
      { from: 'Client', to: 'Services', reason: 'Call discovered services' },
    ],
    successCriteria: [
      'Add Client component',
      'Connect Client to Service Registry (discovery)',
      'Connect Client to backend services (actual calls)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'service_discovery', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'service_discovery' },
      { fromType: 'client', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Add Client and connect it to Service Registry and backend services',
    level2: 'Client → Service Registry (lookup), Client → App Server (service calls)',
    solutionComponents: [
      { type: 'client' },
      { type: 'service_discovery' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'service_discovery' },
      { from: 'client', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Health Checks and Automatic Failover
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💓',
  scenario: "3 AM. One of your Users Service instances just crashed!",
  hook: "But the Service Registry still lists it as available. Clients keep trying to call the dead instance and getting errors. 33% of requests are failing!",
  challenge: "Implement health checks so the registry automatically detects and removes failed instances.",
  illustration: 'health-checks',
};

const step4Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: "Automatic health checks enabled!",
  achievement: "Failed instances are now detected and removed automatically",
  metrics: [
    { label: 'Failed request rate', before: '33%', after: '0%' },
    { label: 'Failover time', before: 'Manual (hours)', after: 'Automatic (30s)' },
    { label: 'Health monitoring', after: 'Active' },
  ],
  nextTeaser: "Excellent! But DNS would make service discovery even simpler...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Health Checks: Automatic Failure Detection',
  conceptExplanation: `**Health checks** detect failed instances automatically:

**Health Check Flow:**
\`\`\`python
# Service Registry health check loop
def health_check_loop():
    while True:
        for instance in registered_instances:
            try:
                response = http.get(f"http://{instance.host}/health")
                if response.status == 200:
                    instance.mark_healthy()
                else:
                    instance.mark_unhealthy()
            except Exception:
                instance.mark_unhealthy()

        # Remove instances that failed 3 consecutive checks
        for instance in registered_instances:
            if instance.consecutive_failures >= 3:
                registry.deregister(instance)

        time.sleep(10)  # Check every 10 seconds
\`\`\`

**Health Check Strategies:**

1. **Active checks**: Registry pings /health endpoint
   - Pros: Detects failures proactively
   - Cons: Extra network traffic

2. **Passive checks**: Monitor actual request success rates
   - Pros: No extra overhead
   - Cons: Requires traffic to detect failures

3. **Hybrid**: Use both (best practice)

**Health Endpoint Best Practices:**
- Check dependencies (database, cache)
- Return 200 OK if healthy, 503 Service Unavailable if not
- Include health details in response
- Keep checks fast (< 100ms)`,

  whyItMatters: 'Without health checks, failed instances remain in the registry and receive traffic, causing user-facing errors. Health checks provide automatic failover.',

  realWorldExample: {
    company: 'Consul',
    scenario: 'HashiCorp Consul is used by thousands of companies',
    howTheyDoIt: 'Supports multiple health check types: HTTP, TCP, gRPC, script-based. Default interval: 10s. Failed checks trigger automatic deregistration within 30s.',
  },

  famousIncident: {
    title: 'Kubernetes DNS Outage from Health Check Storm',
    company: 'Kubernetes',
    year: '2018',
    whatHappened: 'A bug caused all pods to restart simultaneously. Each pod started health checking its dependencies, creating a thundering herd of 10K+ health check requests/sec. The DNS service crashed from overload.',
    lessonLearned: 'Add jitter to health check intervals to prevent synchronized health check storms. Kubernetes now randomizes health check timing.',
    icon: '☸️',
  },

  keyPoints: [
    'Registry pings /health endpoint every 10-30 seconds',
    '3 consecutive failures → instance marked unhealthy',
    'Unhealthy instances removed from discovery results',
    'Recovered instances automatically added back',
    'Add jitter to prevent health check storms',
  ],

  diagram: `
Health Check Flow:
─────────────────────────────────────────
Service Registry
     │
     │ Every 10s: GET /health
     ├──────────────────────┐
     ▼                      ▼
┌──────────┐          ┌──────────┐
│ Instance │          │ Instance │
│    A     │          │    B     │
│ Status:✓ │          │ Status:✗ │
└──────────┘          └──────────┘
   200 OK              TIMEOUT
     │                      │
     │                      │ 3 consecutive failures
     │                      ▼
     │                 DEREGISTERED
     │
Only Instance A
returned in lookups
`,

  keyConcepts: [
    { title: 'Health Endpoint', explanation: '/health returns 200 if service is healthy', icon: '🏥' },
    { title: 'Active Checks', explanation: 'Registry actively pings services', icon: '🔔' },
    { title: 'Failover', explanation: 'Automatic removal of failed instances', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why check health every 10 seconds instead of continuously?',
    options: [
      'To save money',
      'Balance between fast failure detection and network overhead',
      'Health checks are expensive',
      '10 seconds is a random choice',
    ],
    correctIndex: 1,
    explanation: 'Checking every 10s means failures are detected within 30s (3 checks) while keeping health check traffic manageable. Too frequent adds overhead, too slow delays failure detection.',
  },
};

const step4: GuidedStep = {
  id: 'service-discovery-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'FR-3: Automatic health checks and failover',
    taskDescription: 'Configure health checks on the Service Registry',
    componentsNeeded: [
      { type: 'client', reason: 'Calls services', displayName: 'Client' },
      { type: 'service_discovery', reason: 'Performs health checks', displayName: 'Service Registry' },
      { type: 'app_server', reason: 'Services with health endpoints', displayName: 'Services' },
    ],
    connectionsNeeded: [
      { from: 'Service Registry', to: 'Services', reason: 'Health check pings' },
    ],
    successCriteria: [
      'Configure health check interval (10s recommended)',
      'Set failure threshold (3 consecutive failures)',
      'Enable automatic deregistration',
    ],
  },
  validation: {
    requiredComponents: ['client', 'service_discovery', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'service_discovery' },
      { fromType: 'app_server', toType: 'service_discovery' },
    ],
  },
  hints: {
    level1: 'Configure health check settings on the Service Registry',
    level2: 'Click Service Registry → Set health check interval to 10s, failure threshold to 3',
    solutionComponents: [
      { type: 'client' },
      { type: 'service_discovery' },
      { type: 'app_server' },
    ],
    solutionConnections: [
      { from: 'client', to: 'service_discovery' },
      { from: 'app_server', to: 'service_discovery' },
    ],
  },
};

// =============================================================================
// STEP 5: DNS-Based Service Discovery
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌐',
  scenario: "Your team wants to use standard DNS for service discovery!",
  hook: "Instead of querying a custom registry API, services could use DNS: 'users-service.internal' resolves to all healthy instances!",
  challenge: "Add DNS server integration for service discovery.",
  illustration: 'dns-discovery',
};

const step5Celebration: CelebrationContent = {
  emoji: '📡',
  message: "DNS-based service discovery enabled!",
  achievement: "Services can now be discovered via standard DNS lookups",
  metrics: [
    { label: 'Discovery methods', before: 'Registry API only', after: 'Registry API + DNS' },
    { label: 'DNS integration', after: 'Active' },
  ],
  nextTeaser: "Great! Now let's add client-side load balancing...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'DNS-Based Service Discovery',
  conceptExplanation: `**DNS service discovery** uses standard DNS queries to find services:

**How it works:**
\`\`\`python
# Traditional registry query
instances = registry.lookup("users-service")

# DNS-based query
import socket
instances = socket.getaddrinfo("users-service.internal", 8080)
# Returns: [(10.0.1.45, 8080), (10.0.1.46, 8080), (10.0.1.47, 8080)]
\`\`\`

**DNS Service Discovery Approaches:**

1. **DNS A/AAAA Records** (Kubernetes style)
   - users-service.namespace.svc.cluster.local → [10.0.1.45, 10.0.1.46]
   - DNS returns multiple IPs (all healthy instances)
   - Client picks one

2. **DNS SRV Records** (Consul style)
   - _users._tcp.service.consul
   - Returns IP + Port + Priority + Weight
   - Supports weighted load balancing

**Pros:**
- Standard protocol, works everywhere
- No custom client libraries needed
- Built into many platforms (Kubernetes, Consul)

**Cons:**
- DNS caching can cause stale data
- TTL (time-to-live) trades off freshness vs. load
- Limited metadata compared to registry API`,

  whyItMatters: 'DNS-based discovery provides a standard interface that works with any client - no custom libraries needed. Critical for polyglot microservices.',

  realWorldExample: {
    company: 'Kubernetes',
    scenario: 'Every Kubernetes service gets a DNS name',
    howTheyDoIt: 'CoreDNS (Kubernetes DNS) watches the API server for service changes. When a service is created, DNS records are added within 1 second. Default TTL: 30s.',
  },

  keyPoints: [
    'DNS queries return multiple IPs for a service name',
    'Service Registry updates DNS records automatically',
    'Works with standard DNS clients (no custom code)',
    'DNS caching trades freshness for reduced load',
    'SRV records support port and weight information',
  ],

  diagram: `
DNS-Based Discovery:
─────────────────────────────────────────
Client needs to call "users-service"

1. DNS Query:
   Client → DNS Server: "users-service.internal"

2. DNS Response:
   DNS Server → Client: [10.0.1.45, 10.0.1.46, 10.0.1.47]

3. Client picks one:
   Client picks 10.0.1.46 (round-robin)

4. Make request:
   Client → 10.0.1.46:8080

DNS Server syncs with Service Registry:
┌──────────────────┐     ┌────────────┐
│ Service Registry │────▶│ DNS Server │
│ (Source of truth)│     │ (DNS view) │
└──────────────────┘     └────────────┘
`,

  keyConcepts: [
    { title: 'DNS A Record', explanation: 'Maps name to IP addresses', icon: '🅰️' },
    { title: 'DNS SRV Record', explanation: 'Includes port and weight', icon: '📊' },
    { title: 'DNS TTL', explanation: 'How long clients cache DNS results', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'What is the main tradeoff of DNS-based service discovery?',
    options: [
      'It\'s slower than REST APIs',
      'DNS caching can cause stale data but reduces load',
      'It only works with HTTP services',
      'It requires custom client libraries',
    ],
    correctIndex: 1,
    explanation: 'DNS clients cache results based on TTL. Low TTL = fresh data but high DNS query load. High TTL = reduced load but slower to reflect changes.',
  },
};

const step5: GuidedStep = {
  id: 'service-discovery-step-5',
  stepNumber: 5,
  frIndex: 0,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'DNS-based service discovery as alternative to API',
    taskDescription: 'Add DNS server for service name resolution',
    componentsNeeded: [
      { type: 'dns', reason: 'DNS-based service discovery', displayName: 'DNS Server' },
    ],
    connectionsNeeded: [
      { from: 'Service Registry', to: 'DNS Server', reason: 'Sync service records' },
      { from: 'Client', to: 'DNS Server', reason: 'DNS lookups' },
    ],
    successCriteria: [
      'Add DNS Server component',
      'Connect Service Registry to DNS Server (record sync)',
      'Connect Client to DNS Server (lookups)',
    ],
  },
  validation: {
    requiredComponents: ['client', 'service_discovery', 'app_server', 'dns'],
    requiredConnections: [
      { fromType: 'service_discovery', toType: 'dns' },
      { fromType: 'client', toType: 'dns' },
    ],
  },
  hints: {
    level1: 'Add DNS Server and connect it to Service Registry and Client',
    level2: 'Service Registry → DNS (sync), Client → DNS (lookups)',
    solutionComponents: [
      { type: 'dns' },
    ],
    solutionConnections: [
      { from: 'service_discovery', to: 'dns' },
      { from: 'client', to: 'dns' },
    ],
  },
};

// =============================================================================
// STEP 6: Client-Side Load Balancing with Circuit Breakers
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚡',
  scenario: "One of your backend instances is slow but not crashed!",
  hook: "Health checks pass (200 OK), but the instance takes 5 seconds to respond. Clients that hit this instance timeout and fail!",
  challenge: "Implement circuit breakers to detect and avoid slow/failing instances.",
  illustration: 'circuit-breaker',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Production-ready service discovery complete!",
  achievement: "Full service discovery with registration, health checks, DNS, and circuit breakers",
  metrics: [
    { label: 'Service Discovery', after: 'Registry + DNS ✓' },
    { label: 'Health Checks', after: 'Automated ✓' },
    { label: 'Failover', after: 'Automatic ✓' },
    { label: 'Circuit Breakers', after: 'Client-side ✓' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade Service Discovery system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Circuit Breakers for Service Discovery',
  conceptExplanation: `**Circuit breakers** in service discovery prevent calling unhealthy instances:

**The Problem:**
- Health checks show instance as healthy (200 OK)
- But instance is slow or overloaded (5s response time)
- Clients timeout and fail
- Need to detect failure patterns, not just health status

**Circuit Breaker Pattern:**
\`\`\`python
class CircuitBreaker:
    def __init__(self, threshold=5):
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
        self.failures = 0
        self.threshold = threshold

    def call(self, instance, request):
        if self.state == "OPEN":
            raise CircuitOpenError("Instance circuit is open")

        try:
            response = http.get(f"http://{instance}/api", timeout=2)
            self.failures = 0  # Reset on success
            return response
        except Exception:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "OPEN"
            raise
\`\`\`

**Circuit States:**
- **CLOSED**: Normal operation, requests flow
- **OPEN**: Too many failures, fail fast
- **HALF_OPEN**: Testing if instance recovered

**Integration with Service Discovery:**
- Each client maintains circuit breakers per instance
- If circuit opens → skip that instance in load balancing
- Even if registry says instance is healthy
- Provides client-side failover faster than health checks`,

  whyItMatters: 'Circuit breakers detect failures faster than health checks and prevent cascading failures. They\'re essential for resilient client-side load balancing.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Hystrix circuit breakers protecting 50+ services',
    howTheyDoIt: 'Each client has circuit breakers per backend instance. Opens circuit at 50% error rate over 10s window. Auto-recovery test every 5s.',
  },

  famousIncident: {
    title: 'AWS ELB Cascading Failure',
    company: 'AWS',
    year: '2012',
    whatHappened: 'ELB health checks showed instances as healthy, but they were overloaded and slow. Without circuit breakers, traffic kept flowing to slow instances, causing cascading failures.',
    lessonLearned: 'Health checks aren\'t enough - need real-time failure detection via circuit breakers. AWS now implements multiple layers of health checking.',
    icon: '⚡',
  },

  keyPoints: [
    'Circuit breakers track failures per instance',
    'Open circuit when error rate exceeds threshold',
    'Skip open-circuit instances in load balancing',
    'Faster failure detection than health checks',
    'Prevents cascading failures',
  ],

  diagram: `
Circuit Breaker + Service Discovery:
─────────────────────────────────────────
Client Load Balancer State:

┌─────────────────────────────────────┐
│ Available Instances:                │
│                                     │
│ 10.0.1.45 - Circuit: CLOSED ✓      │
│ 10.0.1.46 - Circuit: OPEN ✗        │
│ 10.0.1.47 - Circuit: CLOSED ✓      │
└─────────────────────────────────────┘

Client picks from: [10.0.1.45, 10.0.1.47]
(Skips .46 even though health check passed)

.46 Circuit State:
  Failures: 5/5 → OPEN
  Next test: in 5 seconds (HALF_OPEN)
`,

  keyConcepts: [
    { title: 'Circuit Breaker', explanation: 'Fail fast when instance is failing', icon: '⚡' },
    { title: 'CLOSED', explanation: 'Normal operation', icon: '🟢' },
    { title: 'OPEN', explanation: 'Failing fast, skip instance', icon: '🔴' },
    { title: 'HALF_OPEN', explanation: 'Testing recovery', icon: '🟡' },
  ],

  quickCheck: {
    question: 'Why use circuit breakers in addition to health checks?',
    options: [
      'Health checks are deprecated',
      'Circuit breakers detect failures faster and prevent cascading failures',
      'Circuit breakers replace service discovery',
      'They use less network bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Circuit breakers detect failures in real-time (on actual requests) while health checks run every 10-30s. Circuit breakers provide faster failover and prevent retry storms.',
  },
};

const step6: GuidedStep = {
  id: 'service-discovery-step-6',
  stepNumber: 6,
  frIndex: 0,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Circuit breakers for resilient service calls',
    taskDescription: 'Configure circuit breakers on the client for each backend instance',
    componentsNeeded: [
      { type: 'client', reason: 'Implements circuit breakers', displayName: 'Client' },
      { type: 'service_discovery', reason: 'Service Registry', displayName: 'Service Registry' },
      { type: 'app_server', reason: 'Backend services', displayName: 'Services' },
      { type: 'dns', reason: 'DNS discovery', displayName: 'DNS' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Services', reason: 'Monitor and circuit-break' },
    ],
    successCriteria: [
      'Configure circuit breaker per instance',
      'Set failure threshold (5 failures)',
      'Set recovery test interval (5s)',
      'Enable automatic instance skipping',
    ],
  },
  validation: {
    requiredComponents: ['client', 'service_discovery', 'app_server', 'dns'],
    requiredConnections: [
      { fromType: 'client', toType: 'service_discovery' },
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'service_discovery', toType: 'dns' },
    ],
  },
  hints: {
    level1: 'Configure circuit breaker settings on the Client component',
    level2: 'Click Client → Enable circuit breakers, set threshold to 5, recovery interval to 5s',
    solutionComponents: [
      { type: 'client' },
      { type: 'service_discovery' },
      { type: 'app_server' },
      { type: 'dns' },
    ],
    solutionConnections: [
      { from: 'client', to: 'service_discovery' },
      { from: 'client', to: 'app_server' },
      { from: 'service_discovery', to: 'dns' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const serviceDiscoveryGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'service-discovery-gateway-guided',
  problemTitle: 'Build a Service Discovery System - A Microservices Journey',

  // Requirements gathering phase (Step 0)
  requirementsPhase: serviceDiscoveryRequirementsPhase,

  totalSteps: 6,
  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Service Registration',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Services can register themselves with the registry',
      traffic: { type: 'mixed', rps: 100, readRps: 50, writeRps: 50 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Service Discovery',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Clients can discover services via registry lookups',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01, maxP99Latency: 10 },
    },
    {
      name: 'Health Checks and Failover',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Registry detects failed instances and removes them automatically',
      traffic: { type: 'mixed', rps: 1000, readRps: 800, writeRps: 200 },
      duration: 90,
      failureInjection: { type: 'service_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.99, maxDowntime: 30, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-P1: Low Latency Lookups',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Service discovery adds < 1ms overhead with client caching',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 60,
      passCriteria: { maxP99Latency: 10, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-S1: High Scale',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Handle 2000+ service instances and 10K lookups/sec',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 20, maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-R1: Registry High Availability',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Service discovery survives registry failures with client caching',
      traffic: { type: 'mixed', rps: 1000, readRps: 800, writeRps: 200 },
      duration: 90,
      failureInjection: { type: 'registry_crash', atSecond: 30, recoverySecond: 70 },
      passCriteria: { minAvailability: 0.95, maxErrorRate: 0.1 },
    },
    {
      name: 'NFR-R2: Circuit Breaker Protection',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'Circuit breakers protect against slow/failing instances',
      traffic: { type: 'mixed', rps: 1000, readRps: 800, writeRps: 200 },
      duration: 60,
      failureInjection: { type: 'slow_instance', errorRate: 0.3 },
      passCriteria: { maxP99Latency: 1000, maxErrorRate: 0.1 },
    },
  ] as TestCase[],
};

export function getServiceDiscoveryGatewayGuidedTutorial(): GuidedTutorial {
  return serviceDiscoveryGatewayGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = serviceDiscoveryRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= serviceDiscoveryRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
