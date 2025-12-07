import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Kubernetes Infrastructure Platform Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching infrastructure design through
 * building a Kubernetes-based container orchestration platform.
 *
 * Key Concepts:
 * - Container orchestration and scheduling
 * - Service mesh and inter-service communication
 * - Auto-scaling (HPA and cluster auto-scaling)
 * - Resource management and quotas
 * - Health checks and self-healing
 * - Load balancing and service discovery
 * - Persistent storage and StatefulSets
 * - Observability (metrics, logs, traces)
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const kubernetesRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Kubernetes-based infrastructure platform for container orchestration",

  interviewer: {
    name: 'Alex Morrison',
    role: 'Principal Infrastructure Architect at CloudScale Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-orchestration',
      category: 'functional',
      question: "What are the core capabilities this platform needs to provide?",
      answer: "The platform needs to:\n\n1. **Deploy containerized applications** - Schedule and run containers across a cluster\n2. **Auto-scale workloads** - Scale pods based on CPU/memory usage\n3. **Service discovery** - Allow services to find and communicate with each other\n4. **Load balance traffic** - Distribute requests across healthy pods\n5. **Self-heal** - Automatically restart failed containers and replace unhealthy nodes",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Kubernetes orchestrates containers at scale, handling deployment, scaling, and failure recovery",
    },
    {
      id: 'container-scheduling',
      category: 'functional',
      question: "How should the platform decide where to run containers?",
      answer: "The scheduler needs to:\n- Check available CPU/memory on each node\n- Respect resource requests and limits\n- Consider pod affinity/anti-affinity rules\n- Spread pods across nodes for high availability\n- Handle node failures by rescheduling pods",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "The scheduler is the brain of Kubernetes - it assigns pods to nodes based on resources and constraints",
    },
    {
      id: 'service-mesh',
      category: 'functional',
      question: "How should services communicate securely and reliably?",
      answer: "We need a service mesh that provides:\n- mTLS encryption between services\n- Retry logic and circuit breaking\n- Traffic routing and canary deployments\n- Observability (distributed tracing)\n- Rate limiting and access control",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Service mesh adds reliability, security, and observability to inter-service communication",
    },
    {
      id: 'auto-scaling',
      category: 'functional',
      question: "What types of auto-scaling do we need?",
      answer: "We need two types:\n1. **Horizontal Pod Autoscaler (HPA)** - Scale number of pod replicas based on metrics\n2. **Cluster Autoscaler** - Add/remove nodes based on pending pods and resource utilization",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Auto-scaling happens at two layers: pods (application) and nodes (infrastructure)",
    },
    {
      id: 'persistent-storage',
      category: 'clarification',
      question: "Do we need to support stateful applications like databases?",
      answer: "Yes! We need StatefulSets with:\n- Persistent volumes that survive pod restarts\n- Stable network identities\n- Ordered deployment and scaling\n- Storage classes for different performance tiers",
      importance: 'important',
      insight: "StatefulSets are complex - they need stable storage and network identities unlike stateless apps",
    },
    {
      id: 'multi-tenancy',
      category: 'clarification',
      question: "Will multiple teams share this cluster?",
      answer: "Yes, we need namespaces with:\n- Resource quotas per team\n- Network policies for isolation\n- RBAC for access control\n- Fair scheduling to prevent resource hogging",
      importance: 'important',
      insight: "Multi-tenancy requires isolation at compute, network, and storage layers",
    },

    // SCALE & NFRs
    {
      id: 'throughput-pods',
      category: 'throughput',
      question: "How many pods (containers) should this cluster support?",
      answer: "We need to support 10,000 pods across 500 nodes at steady state, with ability to scale to 50,000 pods during traffic spikes",
      importance: 'critical',
      calculation: {
        formula: "10,000 pods ÷ 500 nodes = 20 pods/node average",
        result: "~20 pods per node (max 110 pods/node for K8s)",
      },
      learningPoint: "Large clusters require careful tuning of control plane and etcd",
    },
    {
      id: 'throughput-api-requests',
      category: 'throughput',
      question: "How many API requests per second will the control plane handle?",
      answer: "Each pod generates ~2-5 API requests/sec for metrics, health checks, and updates. With 10,000 pods, that's 20,000-50,000 req/sec to the API server.",
      importance: 'critical',
      calculation: {
        formula: "10,000 pods × 3 req/sec = 30,000 req/sec",
        result: "~30K req/sec to API server - needs horizontal scaling",
      },
      learningPoint: "API server is a bottleneck - must scale horizontally with load balancer",
    },
    {
      id: 'pod-startup-latency',
      category: 'latency',
      question: "How fast should new pods start?",
      answer: "p99 under 30 seconds from deployment to pod ready. This includes:\n- Image pull time\n- Container startup\n- Health check passing\n- Service registration",
      importance: 'critical',
      learningPoint: "Fast pod startup requires image caching and optimized health checks",
    },
    {
      id: 'scheduling-latency',
      category: 'latency',
      question: "How fast should the scheduler assign pods to nodes?",
      answer: "p99 under 1 second for scheduling decision. The scheduler evaluates 500 nodes and applies filters/priorities quickly.",
      importance: 'important',
      learningPoint: "Scheduler performance degrades with cluster size - optimize predicates and priorities",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement for the control plane?",
      answer: "99.95% availability - that's ~22 minutes downtime per month. Control plane failure means no deployments or scaling, though existing pods keep running.",
      importance: 'critical',
      learningPoint: "Control plane HA requires 3+ replicas across availability zones",
    },
    {
      id: 'node-failure-handling',
      category: 'reliability',
      question: "What happens when a node fails?",
      answer: "The platform should:\n1. Detect node failure within 40 seconds\n2. Mark pods as 'Unknown'\n3. Reschedule pods on healthy nodes within 5 minutes\n4. Drain node gracefully if maintenance is planned",
      importance: 'critical',
      learningPoint: "Node failure handling requires health checks, pod eviction, and rescheduling",
    },
    {
      id: 'resource-limits',
      category: 'reliability',
      question: "How should we prevent pods from consuming all cluster resources?",
      answer: "Implement:\n- Resource requests (guaranteed resources)\n- Resource limits (maximum resources)\n- Resource quotas per namespace\n- LimitRanges for default limits\n- QoS classes (Guaranteed, Burstable, BestEffort)",
      importance: 'critical',
      learningPoint: "Resource management prevents noisy neighbors and ensures fair scheduling",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-orchestration', 'container-scheduling', 'auto-scaling', 'service-mesh'],
  criticalFRQuestionIds: ['core-orchestration', 'container-scheduling', 'service-mesh'],
  criticalScaleQuestionIds: ['throughput-pods', 'throughput-api-requests', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Deploy and schedule containers',
      description: 'Intelligently place pods on nodes based on resources',
      emoji: '📦',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Auto-scale workloads',
      description: 'Scale pods and nodes based on demand',
      emoji: '📈',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Enable service communication',
      description: 'Service discovery and load balancing with service mesh',
      emoji: '🔗',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Self-heal failures',
      description: 'Automatically restart failed containers and replace nodes',
      emoji: '🔄',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Manage resources',
      description: 'Enforce quotas and prevent resource exhaustion',
      emoji: '⚖️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (infrastructure platform)',
    writesPerDay: '~500K deployments/updates',
    readsPerDay: '~50M API calls (health checks, metrics)',
    peakMultiplier: 5,
    readWriteRatio: '100:1',
    calculatedWriteRPS: { average: 6, peak: 30 },
    calculatedReadRPS: { average: 579, peak: 2895 },
    maxPayloadSize: '~1MB (container image manifest)',
    storagePerRecord: '~10KB (pod spec in etcd)',
    storageGrowthPerYear: '~100GB (etcd data)',
    redirectLatencySLA: 'p99 < 1s (scheduling)',
    createLatencySLA: 'p99 < 30s (pod startup)',
  },

  architecturalImplications: [
    '✅ 30K API req/sec → API server must scale horizontally',
    '✅ 10,000 pods → etcd cluster needs SSDs and replication',
    '✅ 99.95% availability → Multi-AZ control plane with 3+ replicas',
    '✅ Auto-scaling → Metrics server + HPA + Cluster Autoscaler',
    '✅ Service mesh → Istio/Linkerd for mTLS and observability',
    '✅ Resource management → ResourceQuotas and LimitRanges required',
  ],

  outOfScope: [
    'GitOps and CI/CD pipelines',
    'Multi-cluster federation',
    'Serverless/FaaS platforms',
    'GPU scheduling',
    'Windows container support',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic cluster that can run containers and handle scaling. Advanced features like service mesh, auto-scaling, and multi-tenancy come in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Set Up Control Plane
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎛️',
  scenario: "Welcome to CloudScale Inc! You're building an enterprise Kubernetes platform.",
  hook: "Your first customer wants to deploy their containerized app. But there's no infrastructure yet!",
  challenge: "Set up the Kubernetes control plane to manage the cluster.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your Kubernetes control plane is operational!',
  achievement: 'The brain of your cluster is ready to orchestrate containers',
  metrics: [
    { label: 'API Server', after: 'Running' },
    { label: 'Scheduler', after: 'Active' },
    { label: 'Controller Manager', after: 'Active' },
  ],
  nextTeaser: "But there's nowhere to run containers yet - we need worker nodes...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Kubernetes Control Plane: The Brain of the Cluster',
  conceptExplanation: `The **Control Plane** is the brain that manages your entire Kubernetes cluster.

Key components:
1. **API Server** - Front-end for the cluster, handles all API requests
2. **Scheduler** - Assigns pods to nodes based on resources
3. **Controller Manager** - Maintains desired state (deployments, replicas, etc.)
4. **etcd** - Distributed key-value store for all cluster data

When you deploy an app:
1. You send a request to the API Server
2. It stores the desired state in etcd
3. Scheduler assigns pods to nodes
4. Controller Manager ensures replicas match desired count`,

  whyItMatters: 'Without the control plane, you have no way to deploy, scale, or manage containers.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Managing billions of containers weekly',
    howTheyDoIt: 'Kubernetes was born from Google\'s Borg system, which orchestrates millions of containers across their infrastructure',
  },

  keyPoints: [
    'API Server = the entry point for all cluster operations',
    'Scheduler = assigns pods to nodes intelligently',
    'etcd = stores all cluster state and configuration',
    'Control plane should be highly available (3+ replicas)',
  ],

  keyConcepts: [
    { title: 'API Server', explanation: 'RESTful interface for cluster management', icon: '🌐' },
    { title: 'Scheduler', explanation: 'Places pods on optimal nodes', icon: '🗓️' },
    { title: 'etcd', explanation: 'Consistent key-value store for cluster state', icon: '💾' },
  ],
};

const step1: GuidedStep = {
  id: 'k8s-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Control Plane component to establish the cluster management layer',
    componentsNeeded: [
      { type: 'app_server', reason: 'Represents the K8s Control Plane (API Server + Scheduler + Controllers)', displayName: 'Control Plane' },
    ],
    successCriteria: [
      'Control Plane component added to canvas',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['app_server'],
    requiredConnections: [],
  },

  hints: {
    level1: 'Drag an App Server (representing Control Plane) onto the canvas',
    level2: 'This component will act as your Kubernetes control plane with API server, scheduler, and controllers',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 2: Add etcd for Cluster State
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💾',
  scenario: "You deployed an app, but when the control plane restarted, it forgot everything!",
  hook: "All deployment configs, pod states, and service definitions are gone. Chaos!",
  challenge: "Add etcd to persistently store all cluster state.",
  illustration: 'data-loss',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Cluster state is now persistent!',
  achievement: 'etcd provides consistent storage for all Kubernetes objects',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Cluster state', after: 'Durable' },
    { label: 'Consistency', after: 'Strong (Raft)' },
  ],
  nextTeaser: "But we still can't run any workloads - we need worker nodes...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'etcd: The Single Source of Truth',
  conceptExplanation: `**etcd** is a distributed key-value store that stores ALL Kubernetes cluster data.

Everything lives in etcd:
- Pod specifications and status
- Service definitions
- ConfigMaps and Secrets
- Resource quotas
- Node information

etcd uses the **Raft consensus algorithm** for:
- Strong consistency across replicas
- Leader election
- Fault tolerance (survives n/2 failures)

Critical for production:
- Run 3 or 5 etcd replicas (odd numbers for quorum)
- Use SSDs for low-latency writes
- Backup regularly (disaster recovery)
- Monitor size (compact old data)`,

  whyItMatters: 'etcd failure means total cluster outage. All state is lost without backups!',

  famousIncident: {
    title: 'Cloudflare Kubernetes Outage',
    company: 'Cloudflare',
    year: '2020',
    whatHappened: 'A bug in their Kubernetes deployment caused etcd to run out of disk space. The control plane stopped working, preventing any deployments or scaling. Existing services kept running, but the cluster was essentially frozen.',
    lessonLearned: 'Monitor etcd disk usage and set up alerts. Implement automatic compaction and regular backups.',
    icon: '🌩️',
  },

  realWorldExample: {
    company: 'Kubernetes',
    scenario: 'Storing state for 10,000+ pods',
    howTheyDoIt: 'etcd can handle ~10,000 writes/sec with proper tuning. Large clusters use multiple etcd clusters or optimize watch mechanisms.',
  },

  keyPoints: [
    'etcd stores ALL cluster state - deployments, pods, services, configs',
    'Uses Raft consensus for strong consistency',
    'Requires 3 or 5 replicas for high availability',
    'SSDs are critical for performance at scale',
  ],

  quickCheck: {
    question: 'Why does etcd use an odd number of replicas (3, 5, 7)?',
    options: [
      'It\'s a Kubernetes convention',
      'Raft consensus requires a quorum (n/2 + 1 votes)',
      'Even numbers would be too expensive',
      'It improves read performance',
    ],
    correctIndex: 1,
    explanation: 'Raft requires a majority (quorum) to commit writes. With 3 replicas, you need 2 votes. With 4, you still need 3 - so 4 doesn\'t add fault tolerance vs 3.',
  },

  keyConcepts: [
    { title: 'etcd', explanation: 'Distributed consistent key-value store', icon: '💾' },
    { title: 'Raft Consensus', explanation: 'Algorithm for distributed agreement', icon: '🤝' },
    { title: 'Quorum', explanation: 'Majority of nodes needed for operations', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'k8s-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'All FRs need persistent cluster state',
    taskDescription: 'Add an etcd cluster and connect it to the Control Plane',
    componentsNeeded: [
      { type: 'database', reason: 'Stores all Kubernetes cluster state (represented as etcd)', displayName: 'etcd' },
    ],
    successCriteria: [
      'etcd (Database) component added',
      'Control Plane connected to etcd',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['app_server', 'database'],
    requiredConnections: [{ fromType: 'app_server', toType: 'database' }],
  },

  hints: {
    level1: 'Drag a Database component (representing etcd) onto the canvas',
    level2: 'Connect the Control Plane to etcd so it can store cluster state',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 3: Add Worker Nodes
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🖥️',
  scenario: "You have a control plane and storage, but no compute resources!",
  hook: "A developer tried to deploy a web app, but the scheduler says 'No nodes available.'",
  challenge: "Add worker nodes where containers can actually run.",
  illustration: 'no-resources',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Worker nodes are online!',
  achievement: 'You can now run containerized workloads',
  metrics: [
    { label: 'Worker nodes', after: '3+' },
    { label: 'Available CPU', after: '12+ cores' },
    { label: 'Available memory', after: '32+ GB' },
  ],
  nextTeaser: "But how do users access the applications running on these nodes?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Worker Nodes: Where Containers Run',
  conceptExplanation: `**Worker nodes** are the machines where your containerized applications actually run.

Each worker node runs:
1. **kubelet** - Agent that manages pods on this node
2. **Container runtime** - Docker/containerd to run containers
3. **kube-proxy** - Maintains network rules for service routing

When a pod is scheduled:
1. Scheduler picks a node with enough CPU/memory
2. API Server tells kubelet to run the pod
3. kubelet pulls container images
4. Container runtime starts the containers
5. kubelet monitors pod health

Node capacity:
- Each node has allocatable CPU and memory
- Pods request resources (guaranteed minimum)
- Pods have limits (maximum they can use)
- Scheduler only places pods on nodes with capacity`,

  whyItMatters: 'Without worker nodes, Kubernetes is just a control plane with nowhere to run workloads!',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Black Friday traffic spikes',
    howTheyDoIt: 'Runs thousands of worker nodes across multiple regions. Auto-scales from 500 to 5,000 nodes during flash sales.',
  },

  famousIncident: {
    title: 'Reddit Kubernetes Node Exhaustion',
    company: 'Reddit',
    year: '2018',
    whatHappened: 'During a traffic spike, all worker nodes ran out of CPU. New pods were stuck in "Pending" state. The cluster autoscaler couldn\'t add nodes fast enough. Users saw degraded performance for 2 hours.',
    lessonLearned: 'Always overprovision slightly and tune cluster autoscaler for faster scale-up. Monitor pending pods.',
    icon: '🔴',
  },

  keyPoints: [
    'Worker nodes provide CPU and memory for running pods',
    'kubelet on each node manages container lifecycle',
    'Nodes have allocatable resources (total - system reserved)',
    'Start with at least 3 nodes for high availability',
  ],

  quickCheck: {
    question: 'What happens if a pod requests 4 CPU cores but the largest node has only 2 cores?',
    options: [
      'The pod splits across multiple nodes',
      'The pod stays in Pending state forever',
      'Kubernetes automatically adds a larger node',
      'The pod runs with only 2 cores',
    ],
    correctIndex: 1,
    explanation: 'Pods are atomic units - they run on a single node. If no node has enough resources, the pod stays Pending until you add a larger node or scale horizontally.',
  },

  keyConcepts: [
    { title: 'Worker Node', explanation: 'Machine that runs containerized workloads', icon: '🖥️' },
    { title: 'kubelet', explanation: 'Agent managing pods on each node', icon: '🤖' },
    { title: 'Resource Allocation', explanation: 'CPU/memory requests and limits', icon: '⚖️' },
  ],
};

const step3: GuidedStep = {
  id: 'k8s-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Deploy and schedule containers',
    taskDescription: 'Add worker nodes to run containerized workloads',
    componentsNeeded: [
      { type: 'app_server', reason: 'Represents worker nodes running kubelet and container runtime', displayName: 'Worker Nodes' },
    ],
    successCriteria: [
      'Worker Nodes component added',
      'Control Plane connected to Worker Nodes',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add another App Server component representing worker nodes',
    level2: 'Connect Control Plane to Worker Nodes - the control plane manages the workers via kubelet',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'app_server', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 4: Add Load Balancer for External Access
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🌐',
  scenario: "Your apps are running, but users can't access them from the internet!",
  hook: "A customer deployed their web app but got 'Connection refused' when accessing it.",
  challenge: "Add a load balancer to route external traffic to your services.",
  illustration: 'no-access',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'External traffic is flowing!',
  achievement: 'Load balancer routes requests to healthy pods',
  metrics: [
    { label: 'Public endpoint', after: 'Active' },
    { label: 'Load balancing', after: 'Round-robin' },
    { label: 'Health checks', after: 'Enabled' },
  ],
  nextTeaser: "But when traffic spikes, pods are overwhelmed - we need auto-scaling...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Ingress and Service Routing',
  conceptExplanation: `Kubernetes provides multiple ways to expose services:

**Service Types:**
1. **ClusterIP** - Internal only, default
2. **NodePort** - Exposes on each node's IP
3. **LoadBalancer** - Creates cloud load balancer
4. **Ingress** - HTTP/HTTPS routing with host/path rules

**Ingress Controller:**
- Acts as reverse proxy (nginx, Traefik, etc.)
- Routes based on hostname and URL path
- Terminates TLS/SSL
- Provides single entry point for multiple services

Load balancing happens at two layers:
1. **External** - Cloud LB → Ingress Controller
2. **Internal** - Service → Pods (kube-proxy)

kube-proxy maintains iptables/IPVS rules:
- Distributes traffic across pod replicas
- Removes unhealthy pods from rotation
- Updates rules when pods scale`,

  whyItMatters: 'Without external access, your cluster is an island. Users need a way to reach your applications!',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Routing millions of requests across microservices',
    howTheyDoIt: 'Uses Istio ingress gateway for intelligent traffic routing, canary deployments, and A/B testing',
  },

  famousIncident: {
    title: 'Kubernetes NodePort Exhaustion',
    company: 'GitLab',
    year: '2019',
    whatHappened: 'GitLab used NodePort services which exposed services on ports 30000-32767 on every node. They ran out of available ports when deploying too many services, causing deployment failures.',
    lessonLearned: 'Use Ingress for HTTP services instead of NodePort. Reserve NodePort for special cases like SSH or databases.',
    icon: '🔌',
  },

  keyPoints: [
    'Load Balancer service creates cloud LB for external access',
    'Ingress Controller provides HTTP routing with path/host rules',
    'kube-proxy load balances traffic to pod replicas',
    'Health checks ensure traffic only goes to ready pods',
  ],

  quickCheck: {
    question: 'What happens when a pod fails its health check?',
    options: [
      'The pod is restarted immediately',
      'The pod is removed from service load balancing',
      'The entire service goes down',
      'Traffic is redirected to a different node',
    ],
    correctIndex: 1,
    explanation: 'Failed health checks remove the pod from the service endpoint list, so no traffic is routed to it. Separately, kubelet may restart the pod if liveness probe fails.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Cloud LB for external traffic', icon: '⚖️' },
    { title: 'Ingress', explanation: 'HTTP routing rules for services', icon: '🚪' },
    { title: 'kube-proxy', explanation: 'Per-node network proxy for services', icon: '🔀' },
  ],
};

const step4: GuidedStep = {
  id: 'k8s-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Enable service communication (external access)',
    taskDescription: 'Add a Load Balancer for external traffic routing',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Routes external traffic to Kubernetes services', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Load Balancer connected to Worker Nodes',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server', 'load_balancer'],
    requiredConnections: [
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add a Load Balancer component to route external traffic',
    level2: 'Connect the Load Balancer to Worker Nodes where your pods are running',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [{ from: 'load_balancer', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 5: Add Metrics Server for Auto-Scaling
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📊',
  scenario: "Traffic just spiked 10x! Your pods are at 90% CPU but not auto-scaling.",
  hook: "The Horizontal Pod Autoscaler says 'unable to get metrics' - it's blind!",
  challenge: "Add a metrics server to collect resource usage for auto-scaling.",
  illustration: 'overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Metrics are flowing!',
  achievement: 'HPA can now make scaling decisions based on real data',
  metrics: [
    { label: 'Metrics collection', after: 'Active' },
    { label: 'CPU/Memory visibility', after: 'Enabled' },
    { label: 'Auto-scaling readiness', after: 'Ready' },
  ],
  nextTeaser: "Now let's configure auto-scaling policies...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Metrics Server: The Eyes of Auto-Scaling',
  conceptExplanation: `The **Metrics Server** collects resource metrics from kubelets on each node.

**How it works:**
1. kubelet collects CPU/memory usage from each pod
2. Metrics Server aggregates data cluster-wide
3. Exposes metrics via Kubernetes API
4. HPA/VPA query metrics for scaling decisions

**Metrics types:**
- **Resource metrics** - CPU, memory from Metrics Server
- **Custom metrics** - Requests/sec, queue depth from Prometheus
- **External metrics** - Cloud metrics (SQS queue length, etc.)

**Auto-scaling components:**
1. **HPA (Horizontal Pod Autoscaler)** - Scales pod replicas
2. **VPA (Vertical Pod Autoscaler)** - Adjusts CPU/memory requests
3. **Cluster Autoscaler** - Adds/removes nodes

HPA algorithm:
\`\`\`
desiredReplicas = ceil[currentReplicas * (currentMetric / targetMetric)]
\`\`\`

Example: 3 replicas at 80% CPU, target 50%
\`\`\`
desiredReplicas = ceil[3 * (80 / 50)] = ceil[4.8] = 5 replicas
\`\`\``,

  whyItMatters: 'Without metrics, auto-scaling is impossible. You need visibility into resource usage to make intelligent scaling decisions.',

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Auto-scaling microservices based on traffic patterns',
    howTheyDoIt: 'Uses Metrics Server for basic CPU/memory scaling, plus Prometheus for custom metrics like API request rate and latency',
  },

  famousIncident: {
    title: 'Target Black Friday Metrics Overload',
    company: 'Target',
    year: '2019',
    whatHappened: 'During Black Friday, their metrics server was overwhelmed by scraping 10,000+ pods every 15 seconds. Metrics API became slow, causing HPA to make delayed scaling decisions. They missed the traffic spike window.',
    lessonLearned: 'Scale the metrics server itself! Use multiple replicas and tune scraping intervals for large clusters.',
    icon: '🎯',
  },

  keyPoints: [
    'Metrics Server aggregates CPU/memory from all nodes',
    'HPA uses metrics to scale pod replicas automatically',
    'Metrics API must be fast (<1s response) for timely scaling',
    'Consider custom metrics for application-specific scaling',
  ],

  quickCheck: {
    question: 'If HPA is configured to scale at 70% CPU and current usage is 90%, what happens?',
    options: [
      'Nothing - HPA only scales down',
      'HPA immediately adds more pod replicas',
      'HPA waits for CPU to drop',
      'HPA removes pods to reduce load',
    ],
    correctIndex: 1,
    explanation: 'HPA will calculate desired replicas based on current usage vs target and scale up to handle the load.',
  },

  keyConcepts: [
    { title: 'Metrics Server', explanation: 'Collects resource usage from nodes', icon: '📊' },
    { title: 'HPA', explanation: 'Horizontal Pod Autoscaler for replica scaling', icon: '📈' },
    { title: 'Resource Metrics', explanation: 'CPU and memory usage data', icon: '💻' },
  ],
};

const step5: GuidedStep = {
  id: 'k8s-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Auto-scale workloads (metrics foundation)',
    taskDescription: 'Add Metrics Server to collect resource usage data',
    componentsNeeded: [
      { type: 'app_server', reason: 'Metrics Server for collecting pod/node resource metrics', displayName: 'Metrics Server' },
    ],
    successCriteria: [
      'Metrics Server component added',
      'Metrics Server connected to Control Plane',
      'Metrics Server connected to Worker Nodes',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add another App Server component representing the Metrics Server',
    level2: 'Connect Metrics Server to both Control Plane (to expose metrics API) and Worker Nodes (to collect metrics)',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'app_server', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 6: Configure Horizontal Pod Autoscaler
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📈',
  scenario: "You have metrics, but pods still don't scale automatically during traffic spikes!",
  hook: "A developer manually scaled from 3 to 50 replicas at 2 AM. This shouldn't be manual!",
  challenge: "Configure HPA to automatically scale pods based on CPU usage.",
  illustration: 'manual-scaling',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Auto-scaling is live!',
  achievement: 'Pods now scale automatically based on resource metrics',
  metrics: [
    { label: 'HPA policies', after: 'Configured' },
    { label: 'Min replicas', after: '3' },
    { label: 'Max replicas', after: '50' },
    { label: 'Target CPU', after: '70%' },
  ],
  nextTeaser: "But what happens when ALL nodes run out of capacity?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Pod Autoscaler: Automatic Replica Scaling',
  conceptExplanation: `**HPA** automatically scales the number of pod replicas based on metrics.

**Configuration:**
\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
\`\`\`

**Scaling behavior:**
- **Scale up** - Fast (can double replicas every 15s if needed)
- **Scale down** - Conservative (waits 5 min to avoid flapping)
- **Cooldown** - Prevents rapid oscillation

**Advanced metrics:**
- CPU/memory (resource metrics)
- Requests per second (custom metrics)
- Queue depth (custom metrics)
- Multiple metrics combined

**Best practices:**
- Set minReplicas ≥ 2 for availability
- Set maxReplicas based on node capacity
- Target 50-80% CPU utilization
- Use custom metrics for better scaling signals`,

  whyItMatters: 'Manual scaling doesn\'t work at cloud scale. HPA ensures you have just enough capacity for the current load.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Black Friday flash sales',
    howTheyDoIt: 'Uses HPA with custom metrics (checkout queue depth) to scale from 10 to 500 replicas in under 2 minutes during flash sales',
  },

  famousIncident: {
    title: 'Pokemon Go Launch Failure',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Pokemon Go went viral overnight. Their Kubernetes cluster couldn\'t scale fast enough (no proper HPA tuning). Servers crashed repeatedly for 2 weeks, losing millions in revenue.',
    lessonLearned: 'Configure aggressive HPA scale-up for unpredictable viral traffic. Test scaling under load before launch.',
    icon: '🎮',
  },

  keyPoints: [
    'HPA scales pod replicas based on CPU, memory, or custom metrics',
    'Scale up is fast, scale down is conservative (prevent flapping)',
    'Set appropriate min/max replicas for your workload',
    'Use custom metrics for application-aware scaling',
  ],

  quickCheck: {
    question: 'Why does HPA scale down slowly but scale up quickly?',
    options: [
      'To save money on cloud costs',
      'To prevent flapping (rapid scale up/down cycles)',
      'Because scaling up is easier than scaling down',
      'To keep pods warm',
    ],
    correctIndex: 1,
    explanation: 'Quick scale-up handles traffic spikes. Slow scale-down (5min cooldown) prevents thrashing when load oscillates around the threshold.',
  },

  keyConcepts: [
    { title: 'HPA', explanation: 'Scales pod replicas automatically', icon: '📈' },
    { title: 'Target Utilization', explanation: 'Desired CPU/memory percentage', icon: '🎯' },
    { title: 'Flapping', explanation: 'Rapid scale up/down oscillation', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'k8s-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: Auto-scale workloads (pod-level)',
    taskDescription: 'Configure HPA policies for automatic replica scaling',
    successCriteria: [
      'HPA configuration added to deployment',
      'Min replicas set to 3',
      'Max replicas set to 50',
      'Target CPU utilization set to 70%',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'HPA is configured on your deployments, not a separate component',
    level2: 'Click on Worker Nodes and configure auto-scaling settings in the configuration panel',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Cluster Autoscaler for Node Scaling
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🖥️',
  scenario: "Black Friday! HPA tried to scale to 500 pods, but only 200 are running.",
  hook: "300 pods are stuck in 'Pending' state with error: 'Insufficient CPU on all nodes.'",
  challenge: "Add Cluster Autoscaler to automatically add worker nodes when needed.",
  illustration: 'node-exhaustion',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Cluster can now scale infinitely!',
  achievement: 'Nodes are added/removed automatically based on pod demand',
  metrics: [
    { label: 'Cluster Autoscaler', after: 'Active' },
    { label: 'Min nodes', after: '3' },
    { label: 'Max nodes', after: '100' },
    { label: 'Scale-up time', after: '<5 min' },
  ],
  nextTeaser: "But services can't reliably find each other - we need service mesh...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Cluster Autoscaler: Node-Level Scaling',
  conceptExplanation: `**Cluster Autoscaler** adds or removes worker nodes based on pod scheduling needs.

**Scale up triggers:**
- Pods in Pending state due to insufficient resources
- Node resource utilization consistently high

**Scale down triggers:**
- Node utilization < 50% for 10+ minutes
- All pods can be moved to other nodes

**How it works:**
1. Detects pending pods that can't be scheduled
2. Simulates adding a node to see if it helps
3. Calls cloud provider API to create node
4. Node joins cluster and pods are scheduled
5. Regularly checks for underutilized nodes
6. Drains and removes nodes when not needed

**Node groups/pools:**
- Group nodes by instance type (general, memory-optimized, GPU)
- Autoscaler scales each group independently
- Pods use nodeSelector/affinity to target groups

**Challenges:**
- Cloud API rate limits (slow scale-up)
- Node boot time (3-5 min typically)
- Pod disruption during scale-down
- Cost optimization (removing nodes too aggressively)`,

  whyItMatters: 'HPA scales pods, but if nodes are full, pods stay Pending. Cluster Autoscaler ensures you have compute capacity for your workloads.',

  realWorldExample: {
    company: 'Lyft',
    scenario: 'Peak ride demand fluctuations',
    howTheyDoIt: 'Uses Cluster Autoscaler to scale from 200 to 2,000 nodes during peak hours, then back down at night. Saves $2M+/year vs static capacity.',
  },

  famousIncident: {
    title: 'Robinhood GameStop Trading Halt',
    company: 'Robinhood',
    year: '2021',
    whatHappened: 'During GameStop frenzy, their Kubernetes cluster hit cloud quota limits and couldn\'t add more nodes fast enough. Trading was halted, causing massive user backlash and regulatory scrutiny.',
    lessonLearned: 'Pre-request increased cloud quotas before expected traffic spikes. Monitor quota usage and set alerts.',
    icon: '📈',
  },

  keyPoints: [
    'Cluster Autoscaler adds nodes when pods are pending',
    'Removes underutilized nodes to save costs',
    'Scale-up takes 3-5 minutes (cloud provider delay)',
    'Configure max nodes to avoid runaway costs',
  ],

  quickCheck: {
    question: 'What prevents Cluster Autoscaler from removing a node?',
    options: [
      'The node has high CPU usage',
      'The node runs pods that can\'t be evicted (local storage, no replicas)',
      'The node is too new',
      'There are pending pods',
    ],
    correctIndex: 1,
    explanation: 'Cluster Autoscaler won\'t remove a node if it runs pods with local storage, or singleton pods without replicas elsewhere.',
  },

  keyConcepts: [
    { title: 'Cluster Autoscaler', explanation: 'Adds/removes nodes automatically', icon: '⚙️' },
    { title: 'Pending Pods', explanation: 'Pods waiting for node capacity', icon: '⏳' },
    { title: 'Node Drain', explanation: 'Evicting pods before removing node', icon: '🚰' },
  ],
};

const step7: GuidedStep = {
  id: 'k8s-step-7',
  stepNumber: 7,
  frIndex: 1,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-2: Auto-scale workloads (cluster-level)',
    taskDescription: 'Enable Cluster Autoscaler to add/remove worker nodes',
    successCriteria: [
      'Cluster Autoscaler enabled',
      'Minimum node count set (3)',
      'Maximum node count set (100)',
      'Scale-up threshold configured',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server', 'load_balancer', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Cluster Autoscaler is configured at the infrastructure level, not a separate component',
    level2: 'Click on Worker Nodes and enable cluster auto-scaling with min/max node settings',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Service Mesh for Secure Communication
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🔗',
  scenario: "Your microservices are communicating, but you have no visibility or security!",
  hook: "A payment service got hacked because all inter-service traffic was unencrypted.",
  challenge: "Add a service mesh to encrypt traffic and provide observability.",
  illustration: 'security-breach',
};

const step8Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Service mesh is operational!',
  achievement: 'All service-to-service traffic is encrypted and observable',
  metrics: [
    { label: 'mTLS encryption', after: 'Enabled' },
    { label: 'Distributed tracing', after: 'Active' },
    { label: 'Circuit breakers', after: 'Configured' },
    { label: 'Traffic policies', after: 'Enforced' },
  ],
  nextTeaser: "But you have no visibility into what's happening in the cluster...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Service Mesh: Secure and Observable Communication',
  conceptExplanation: `A **service mesh** provides a dedicated infrastructure layer for service-to-service communication.

**Core capabilities:**

1. **mTLS (mutual TLS)** - Automatic encryption between services
   - Certificates auto-generated and rotated
   - Identity-based authentication
   - Zero trust networking

2. **Traffic Management**
   - Load balancing with advanced algorithms
   - Retries with exponential backoff
   - Circuit breakers to prevent cascading failures
   - Timeouts and deadlines

3. **Observability**
   - Distributed tracing (Jaeger/Zipkin)
   - Metrics (request rate, latency, errors)
   - Traffic visualization

4. **Advanced Routing**
   - Canary deployments (10% traffic to v2)
   - A/B testing
   - Traffic mirroring for testing

**Popular service meshes:**
- **Istio** - Feature-rich, complex, uses Envoy proxy
- **Linkerd** - Lightweight, easier to operate
- **Consul Connect** - HashiCorp, integrates with Consul

**Architecture:**
- **Sidecar proxy** injected into each pod
- **Control plane** configures proxies
- Proxies intercept all traffic in/out of pod`,

  whyItMatters: 'At scale, managing security, retries, and observability in application code is unmaintainable. Service mesh provides these as infrastructure.',

  realWorldExample: {
    company: 'Lyft',
    scenario: 'Handling millions of ride requests across 300+ microservices',
    howTheyDoIt: 'Created Envoy proxy (now used by Istio) to manage service mesh. Handles 100K+ requests/sec with mTLS and circuit breakers.',
  },

  famousIncident: {
    title: 'Monzo Bank Istio Outage',
    company: 'Monzo',
    year: '2019',
    whatHappened: 'An Istio configuration error caused all inter-service traffic to fail. The banking app was down for 2 hours during business hours. They had to emergency rollback Istio.',
    lessonLearned: 'Service mesh adds complexity. Test configuration changes in staging. Have rollback plans. Consider gradual rollout.',
    icon: '🏦',
  },

  keyPoints: [
    'Service mesh provides mTLS, retries, circuit breakers at infrastructure layer',
    'Sidecar proxy in each pod intercepts all traffic',
    'Enables advanced routing (canary, A/B testing)',
    'Adds observability with distributed tracing',
  ],

  quickCheck: {
    question: 'What is the main difference between a service mesh and an API gateway?',
    options: [
      'Service mesh is for external traffic, API gateway is for internal',
      'Service mesh handles service-to-service (east-west), API gateway handles client-to-service (north-south)',
      'Service mesh is faster',
      'They are the same thing',
    ],
    correctIndex: 1,
    explanation: 'API gateway handles external traffic entering the cluster. Service mesh handles internal communication between services.',
  },

  keyConcepts: [
    { title: 'Service Mesh', explanation: 'Infrastructure for service communication', icon: '🔗' },
    { title: 'mTLS', explanation: 'Mutual TLS for encrypted service-to-service traffic', icon: '🔒' },
    { title: 'Sidecar Proxy', explanation: 'Proxy container injected into each pod', icon: '🚗' },
  ],
};

const step8: GuidedStep = {
  id: 'k8s-step-8',
  stepNumber: 8,
  frIndex: 2,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-3: Enable service communication (secure mesh)',
    taskDescription: 'Add a Service Mesh for mTLS encryption and traffic management',
    componentsNeeded: [
      { type: 'app_server', reason: 'Service Mesh control plane (Istio/Linkerd)', displayName: 'Service Mesh' },
    ],
    successCriteria: [
      'Service Mesh component added',
      'Service Mesh connected to Control Plane',
      'Service Mesh connected to Worker Nodes',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server', 'load_balancer', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add another App Server component representing the Service Mesh control plane',
    level2: 'Connect Service Mesh to Control Plane (for configuration) and Worker Nodes (to inject sidecars)',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'app_server', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 9: Add Observability Stack (Prometheus + Grafana)
// =============================================================================

const step9Story: StoryContent = {
  emoji: '📊',
  scenario: "Users report slow requests, but you have no idea what's causing it!",
  hook: "You're flying blind - no metrics, no logs, no traces. Debugging is impossible.",
  challenge: "Add an observability stack to monitor cluster health and application performance.",
  illustration: 'blind-debugging',
};

const step9Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Full observability achieved!',
  achievement: 'You can now monitor, alert, and debug your entire cluster',
  metrics: [
    { label: 'Metrics collection', after: 'Prometheus' },
    { label: 'Visualization', after: 'Grafana' },
    { label: 'Log aggregation', after: 'Loki/ELK' },
    { label: 'Distributed tracing', after: 'Jaeger' },
  ],
  nextTeaser: "One more step - resource management to prevent resource exhaustion...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Observability: The Three Pillars',
  conceptExplanation: `**Observability** provides visibility into your cluster through three pillars:

**1. Metrics (Prometheus + Grafana)**
- Time-series data (CPU, memory, request rate, latency)
- Prometheus scrapes /metrics endpoints every 15s
- Grafana visualizes metrics in dashboards
- Alertmanager triggers alerts on thresholds

Key metrics:
- Node: CPU, memory, disk, network
- Pod: Resource usage, restart count
- Application: Request rate, latency, errors (RED metrics)

**2. Logs (Loki/ELK Stack)**
- Aggregate logs from all containers
- Centralized search and analysis
- Correlation with metrics and traces

**3. Distributed Tracing (Jaeger/Zipkin)**
- Track requests across microservices
- Identify bottlenecks and latency sources
- Correlate with metrics and logs

**Golden Signals (SRE best practice):**
1. **Latency** - How long requests take
2. **Traffic** - Request volume
3. **Errors** - Error rate
4. **Saturation** - Resource utilization

**Alerting strategy:**
- Page for critical user-facing issues
- Ticket for degradation that needs attention
- Dashboard for informational metrics`,

  whyItMatters: 'Without observability, you can\'t detect issues, debug failures, or optimize performance. It\'s essential for running production systems.',

  realWorldExample: {
    company: 'Uber',
    scenario: 'Monitoring 4,000+ microservices',
    howTheyDoIt: 'Uses Prometheus for metrics, Jaeger for distributed tracing, and custom dashboards. Processes 40 billion metrics per day.',
  },

  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A software deployment bug caused their trading system to go haywire, making billions in erroneous trades. They had NO monitoring or alerts. By the time humans noticed, they lost $440 million in 45 minutes. The company collapsed.',
    lessonLearned: 'Observability is not optional for production systems. Monitor everything. Alert on anomalies. Have circuit breakers.',
    icon: '💔',
  },

  keyPoints: [
    'Prometheus collects metrics, Grafana visualizes them',
    'Logs should be centralized and searchable',
    'Distributed tracing connects requests across services',
    'Alert on symptoms (user impact) not just causes',
  ],

  quickCheck: {
    question: 'Why are distributed traces important for microservices?',
    options: [
      'They are faster than logs',
      'They show how a single request flows through multiple services',
      'They replace metrics',
      'They are required for Kubernetes',
    ],
    correctIndex: 1,
    explanation: 'Distributed tracing tracks a single request as it propagates through multiple services, showing latency and errors at each step.',
  },

  keyConcepts: [
    { title: 'Prometheus', explanation: 'Metrics collection and storage', icon: '📊' },
    { title: 'Grafana', explanation: 'Metrics visualization and dashboards', icon: '📈' },
    { title: 'Distributed Tracing', explanation: 'Request flow across services', icon: '🔍' },
  ],
};

const step9: GuidedStep = {
  id: 'k8s-step-9',
  stepNumber: 9,
  frIndex: 3,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-4: Self-heal failures (observability for detection)',
    taskDescription: 'Add Observability stack for monitoring and alerting',
    componentsNeeded: [
      { type: 'app_server', reason: 'Prometheus + Grafana for metrics and visualization', displayName: 'Observability Stack' },
    ],
    successCriteria: [
      'Observability Stack component added',
      'Connected to Control Plane for cluster metrics',
      'Connected to Worker Nodes for pod/container metrics',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server', 'load_balancer', 'app_server', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add an App Server component for the Observability Stack (Prometheus + Grafana)',
    level2: 'Connect it to both Control Plane and Worker Nodes to scrape metrics from all cluster components',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'app_server', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 10: Implement Resource Quotas and Limits
// =============================================================================

const step10Story: StoryContent = {
  emoji: '⚖️',
  scenario: "DISASTER! A runaway pod consumed all cluster CPU, causing widespread outages!",
  hook: "A developer deployed a memory leak. Their pods grew to 200GB each, starving all other workloads.",
  challenge: "Implement resource quotas and limits to prevent resource exhaustion.",
  illustration: 'resource-exhaustion',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a production-grade Kubernetes platform!',
  achievement: 'A fully orchestrated, auto-scaling, observable infrastructure',
  metrics: [
    { label: 'Pod capacity', after: '10,000+' },
    { label: 'Auto-scaling', after: 'HPA + Cluster AS' },
    { label: 'Observability', after: 'Full stack' },
    { label: 'Security', after: 'mTLS + RBAC' },
    { label: 'Resource management', after: 'Quotas enforced' },
    { label: 'Availability', after: '99.95%' },
  ],
  nextTeaser: "You've mastered Kubernetes infrastructure design!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Resource Management: Preventing the Noisy Neighbor',
  conceptExplanation: `**Resource management** ensures fair sharing and prevents resource exhaustion.

**1. Resource Requests (Guaranteed)**
- Minimum resources guaranteed to pod
- Scheduler only places pod on nodes with available requests
- Pod gets this much even if node is busy

**2. Resource Limits (Maximum)**
- Maximum resources pod can use
- CPU: Throttled if exceeded
- Memory: OOMKilled if exceeded

**3. ResourceQuota (Namespace-level)**
\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: dev-team
spec:
  hard:
    requests.cpu: "100"      # 100 CPU cores requested
    requests.memory: "200Gi" # 200GB memory requested
    limits.cpu: "200"        # 200 CPU cores limit
    limits.memory: "400Gi"   # 400GB memory limit
    pods: "100"              # Max 100 pods
\`\`\`

**4. LimitRange (Default limits)**
- Sets default requests/limits for pods without them
- Enforces min/max values
- Prevents tiny or huge pods

**QoS Classes (Quality of Service):**
1. **Guaranteed** - requests == limits → highest priority
2. **Burstable** - requests < limits → medium priority
3. **BestEffort** - no requests/limits → lowest priority (evicted first)

**Pod eviction under pressure:**
When node runs out of memory, kubelet evicts pods:
1. BestEffort pods first
2. Then Burstable exceeding requests
3. Guaranteed pods last (protected)`,

  whyItMatters: 'Without resource management, a single bad pod can take down your entire cluster. Quotas and limits are essential for multi-tenancy.',

  realWorldExample: {
    company: 'Airbnb',
    scenario: 'Multi-tenant Kubernetes with 100+ teams',
    howTheyDoIt: 'Strict ResourceQuotas per team namespace, LimitRanges to enforce defaults, and automated monitoring for quota exhaustion',
  },

  famousIncident: {
    title: 'Salesforce Kubernetes Outage',
    company: 'Salesforce',
    year: '2021',
    whatHappened: 'A deployment without resource limits consumed all node memory during a memory leak. Kubelet couldn\'t evict fast enough. The entire cluster became unresponsive, taking down critical services for 6 hours.',
    lessonLearned: 'ALWAYS set resource limits. Use LimitRanges to enforce them. Monitor for pods without limits.',
    icon: '☁️',
  },

  keyPoints: [
    'Requests = guaranteed minimum, Limits = maximum allowed',
    'ResourceQuota enforces limits per namespace (team)',
    'LimitRange sets defaults for pods without requests/limits',
    'QoS classes determine eviction priority under pressure',
  ],

  quickCheck: {
    question: 'What happens if a pod exceeds its memory limit?',
    options: [
      'It is throttled to use less memory',
      'It is OOMKilled (Out of Memory Killed) and restarted',
      'It gets more memory automatically',
      'Nothing - limits are just suggestions',
    ],
    correctIndex: 1,
    explanation: 'Memory limits are hard. Exceeding them causes the pod to be OOMKilled. CPU limits are soft - the pod is throttled.',
  },

  keyConcepts: [
    { title: 'Resource Requests', explanation: 'Guaranteed minimum resources', icon: '📊' },
    { title: 'Resource Limits', explanation: 'Maximum allowed resources', icon: '🚧' },
    { title: 'ResourceQuota', explanation: 'Namespace-level resource caps', icon: '⚖️' },
  ],
};

const step10: GuidedStep = {
  id: 'k8s-step-10',
  stepNumber: 10,
  frIndex: 4,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'FR-5: Manage resources (quotas and limits)',
    taskDescription: 'Configure ResourceQuotas and LimitRanges for namespaces',
    successCriteria: [
      'ResourceQuota configured for dev namespace',
      'LimitRange configured with defaults',
      'CPU and memory limits enforced',
      'Pod count limits set',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['app_server', 'database', 'app_server', 'load_balancer', 'app_server', 'app_server', 'app_server'],
    requiredConnections: [
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'load_balancer', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Resource quotas are configured at the namespace level, not a separate component',
    level2: 'Click on Control Plane and configure resource management policies for namespaces',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const l5InfraKubernetesPlatformGuidedTutorial: GuidedTutorial = {
  problemId: 'l5-infra-kubernetes-platform',
  title: 'Design a Kubernetes Infrastructure Platform',
  description: 'Build a production-grade container orchestration platform with auto-scaling, service mesh, and observability',
  difficulty: 'advanced',
  estimatedMinutes: 75,

  welcomeStory: {
    emoji: '☸️',
    hook: "You've been hired as Principal Infrastructure Architect at CloudScale Inc!",
    scenario: "Your mission: Build a Kubernetes platform that can orchestrate 10,000 containers across 500 nodes with auto-scaling, security, and observability.",
    challenge: "Can you design an infrastructure that handles massive scale while remaining resilient and cost-effective?",
  },

  requirementsPhase: kubernetesRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Kubernetes Control Plane',
    'etcd and Raft Consensus',
    'Container Scheduling',
    'Resource Management',
    'Horizontal Pod Autoscaler (HPA)',
    'Cluster Autoscaler',
    'Service Discovery',
    'Service Mesh (Istio/Linkerd)',
    'Load Balancing and Ingress',
    'Observability (Metrics, Logs, Traces)',
    'Resource Quotas and Limits',
    'QoS Classes',
    'Health Checks and Self-Healing',
    'mTLS and Zero Trust',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (etcd Raft consensus)',
    'Chapter 6: Partitioning (pod scheduling across nodes)',
    'Chapter 8: Distributed System Troubles (failure detection, timeouts)',
    'Chapter 9: Consistency and Consensus (etcd)',
  ],
};

export default l5InfraKubernetesPlatformGuidedTutorial;
