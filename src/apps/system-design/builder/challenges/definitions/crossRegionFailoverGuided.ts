import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Cross-Region Failover Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching disaster recovery and high availability
 * through building a globally resilient system with cross-region failover.
 *
 * Key Concepts:
 * - Disaster recovery planning (RTO/RPO)
 * - Multi-region architecture
 * - Automated failover mechanisms
 * - Health checks and monitoring
 * - Data replication strategies
 * - DNS-based traffic routing
 * - Database failover and promotion
 * - Testing and validation
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const crossRegionFailoverRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an e-commerce platform (like Amazon) with cross-region disaster recovery and automatic failover",

  interviewer: {
    name: 'Marcus Rodriguez',
    role: 'VP of Infrastructure & Reliability Engineering',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the main requirements for our disaster recovery system?",
      answer: "We need to:\n\n1. **Detect failures** - Monitor primary region health continuously\n2. **Failover automatically** - Switch traffic to secondary region when primary fails\n3. **Replicate data** - Keep secondary region in sync with primary\n4. **Failback capability** - Return to primary when it recovers\n5. **Alert stakeholders** - Notify operations team of failover events",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Disaster recovery is about minimizing downtime and data loss when regions fail",
    },
    {
      id: 'failure-detection',
      category: 'functional',
      question: "How should we detect when the primary region has failed?",
      answer: "Use comprehensive health checks:\n- Application health endpoints (HTTP 200 checks)\n- Database connectivity tests\n- Latency monitoring (p99 < threshold)\n- Error rate tracking (< 0.1% errors)\n- Infrastructure metrics (CPU, memory, network)\n\nIf 3+ consecutive checks fail, trigger failover.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Health checks must be comprehensive but not cause false positives",
    },
    {
      id: 'automated-failover',
      category: 'functional',
      question: "Should failover be automatic or require manual approval?",
      answer: "**Automated for detected failures** with manual override capability. When health checks fail, automatically update DNS to route traffic to secondary region. Humans can intervene if needed.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Automation reduces RTO from hours to minutes, but must be tested thoroughly",
    },
    {
      id: 'data-replication',
      category: 'functional',
      question: "How do we keep the secondary region's data in sync?",
      answer: "Implement continuous async replication:\n- Database replication with < 5 second lag\n- Object storage cross-region replication\n- Transaction logs shipped to secondary\n- Replication lag monitoring and alerts",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Replication lag determines your RPO (Recovery Point Objective)",
    },
    {
      id: 'traffic-routing',
      category: 'clarification',
      question: "How do we route user traffic between regions?",
      answer: "Use **DNS-based failover** with low TTL (60 seconds). Route53 health checks monitor primary region and automatically update DNS records to point to secondary when primary fails. Users get routed to healthy region.",
      importance: 'critical',
      insight: "DNS TTL directly impacts failover speed - lower is faster but increases DNS query load",
    },
    {
      id: 'split-brain-prevention',
      category: 'clarification',
      question: "What if both regions think they're primary?",
      answer: "Prevent split-brain with **leader election** using distributed consensus (etcd/ZooKeeper). Only one region can be primary at a time. Use fencing to prevent old primary from accepting writes.",
      importance: 'critical',
      insight: "Split-brain can cause data corruption and conflicts - prevention is critical",
    },

    // SCALE & NFRs
    {
      id: 'rto-requirement',
      category: 'latency',
      question: "How quickly must we recover from a regional failure?",
      answer: "**RTO (Recovery Time Objective): 5 minutes maximum**. That means from detection to fully operational in secondary region within 5 minutes. Every minute of downtime costs $50,000 in lost revenue.",
      importance: 'critical',
      learningPoint: "RTO defines how fast you must failover - drives automation decisions",
    },
    {
      id: 'rpo-requirement',
      category: 'consistency',
      question: "How much data can we afford to lose during failover?",
      answer: "**RPO (Recovery Point Objective): 30 seconds maximum**. We can tolerate losing up to 30 seconds of transactions. This requires async replication with < 5 second lag under normal conditions.",
      importance: 'critical',
      learningPoint: "RPO defines acceptable data loss - drives replication strategy",
    },
    {
      id: 'throughput-scale',
      category: 'throughput',
      question: "What traffic volume must the secondary region handle?",
      answer: "Secondary must handle 100% of primary region's traffic:\n- 50,000 requests/second at peak\n- 100 million daily active users\n- 10 TB/day data writes\n\nSecondary must be fully provisioned, not cold standby.",
      importance: 'critical',
      calculation: {
        formula: "Secondary capacity = Primary capacity (active-active)",
        result: "Both regions fully provisioned for full traffic load",
      },
      learningPoint: "Active-active architecture costs 2x but enables instant failover",
    },
    {
      id: 'geographic-distribution',
      category: 'availability',
      question: "How far apart should the regions be?",
      answer: "At least 500 miles apart to avoid correlated failures (natural disasters, power grid issues). Use different AWS regions: US-East-1 (Virginia) and US-West-2 (Oregon) for example.",
      importance: 'critical',
      learningPoint: "Geographic diversity protects against regional disasters",
    },
    {
      id: 'availability-target',
      category: 'availability',
      question: "What's the uptime requirement with failover?",
      answer: "99.99% availability (4 nines) - less than 52 minutes downtime per year. With two regions, we can achieve this even if one region fails monthly.",
      importance: 'critical',
      calculation: {
        formula: "99.99% = 52 minutes downtime/year",
        result: "Single region failure must be recovered within 5 minutes",
      },
      learningPoint: "Multi-region architecture enables higher availability SLAs",
    },
    {
      id: 'testing-frequency',
      category: 'reliability',
      question: "How often should we test failover?",
      answer: "Monthly automated failover drills during low-traffic periods. Plus quarterly game days where we simulate various failure scenarios. Untested failover will fail when you need it.",
      importance: 'critical',
      insight: "Chaos engineering principle: test failures regularly to ensure recovery works",
    },
    {
      id: 'stateful-handling',
      category: 'reliability',
      question: "What happens to in-flight requests during failover?",
      answer: "Some in-flight requests will fail. Clients must implement retry logic with exponential backoff. Sessions should be stored in distributed cache (Redis) accessible from both regions.",
      importance: 'important',
      insight: "Stateless applications fail over more cleanly than stateful ones",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'rto-requirement', 'rpo-requirement', 'automated-failover'],
  criticalFRQuestionIds: ['core-functionality', 'failure-detection', 'automated-failover'],
  criticalScaleQuestionIds: ['rto-requirement', 'rpo-requirement', 'throughput-scale', 'availability-target'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Detect region failures',
      description: 'Monitor primary region health continuously',
      emoji: '🔍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Automated failover',
      description: 'Switch traffic to secondary when primary fails',
      emoji: '🔄',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Data replication',
      description: 'Keep secondary region in sync with primary',
      emoji: '📋',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Failback capability',
      description: 'Return to primary when it recovers',
      emoji: '↩️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Alert and notify',
      description: 'Inform stakeholders of failover events',
      emoji: '📢',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million users',
    writesPerDay: '10 TB data writes',
    readsPerDay: '4 billion requests',
    peakMultiplier: 3,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 5000, peak: 15000 },
    calculatedReadRPS: { average: 46296, peak: 138888 },
    maxPayloadSize: '~100KB per request',
    storagePerRecord: '~10KB',
    storageGrowthPerYear: '~3.6 PB',
    redirectLatencySLA: 'RTO < 5 minutes (failover)',
    createLatencySLA: 'RPO < 30 seconds (data loss)',
  },

  architecturalImplications: [
    '✅ RTO 5 minutes → Automated failover with DNS routing required',
    '✅ RPO 30 seconds → Async replication with lag monitoring',
    '✅ 99.99% availability → Multi-region active-active architecture',
    '✅ 50K req/sec → Both regions fully provisioned',
    '✅ Data consistency → Leader election and split-brain prevention',
    '✅ Testing requirements → Automated monthly failover drills',
  ],

  outOfScope: [
    'Multi-cloud failover (AWS to GCP)',
    'Active-active writes to both regions',
    'Sub-second RPO (synchronous replication)',
    'Application-level conflict resolution',
    'Cross-region transactions',
  ],

  keyInsight: "First, let's make it WORK. We'll build a single-region system, then add a secondary region. The complexity of automated failover, health checks, and data replication comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Build Primary Region Foundation
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏗️',
  scenario: "Welcome to GlobalTech! You're building a globally resilient platform.",
  hook: "Your first priority: build a solid primary region that serves all traffic.",
  challenge: "Set up the basic architecture in the primary region (US-East).",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Primary region is operational!',
  achievement: 'Users can access your service from the primary region',
  metrics: [
    { label: 'Primary region status', after: 'Online' },
    { label: 'Serving traffic', after: '✓' },
  ],
  nextTeaser: "But what happens if this region fails?...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Primary Region: Foundation First',
  conceptExplanation: `Every disaster recovery strategy starts with a **solid primary region**.

Your primary region is where all traffic flows under normal conditions:
1. **Client** - Users accessing your application
2. **Load Balancer** - Distributes requests across app servers
3. **App Servers** - Handle business logic
4. **Database** - Stores critical data

Think of this as your "always on" region that handles 100% of production traffic.`,

  whyItMatters: 'You can\'t build a disaster recovery strategy without first having a reliable primary system to protect.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 200M subscribers globally',
    howTheyDoIt: 'Runs primary operations in AWS US-East-1 with secondary regions worldwide. Each region fully equipped to take over.',
  },

  keyPoints: [
    'Primary region handles all production traffic',
    'Must be fully functional before adding DR',
    'Foundation for replication and failover',
    'Client → Load Balancer → App Servers → Database',
  ],

  keyConcepts: [
    { title: 'Primary Region', explanation: 'Main region serving production traffic', icon: '🏢' },
    { title: 'Load Balancer', explanation: 'Distributes traffic across servers', icon: '⚖️' },
    { title: 'App Server', explanation: 'Handles business logic', icon: '🖥️' },
  ],
};

const step1: GuidedStep = {
  id: 'failover-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Build the primary region: Client → Load Balancer → App Server → Database',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the service', displayName: 'Client' },
      { type: 'load_balancer', reason: 'Distributes traffic in primary region', displayName: 'Load Balancer (Primary)' },
      { type: 'app_server', reason: 'Handles requests in primary region', displayName: 'App Server (Primary)' },
      { type: 'database', reason: 'Stores data in primary region', displayName: 'Database (Primary)' },
    ],
    successCriteria: [
      'All components added to canvas',
      'Client → Load Balancer → App Server → Database connected',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag Client, Load Balancer, App Server, and Database onto the canvas',
    level2: 'Connect them in order: Client → Load Balancer → App Server → Database',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Health Check Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💓',
  scenario: "Your primary region is running, but you have no way to detect if it fails!",
  hook: "The CEO asks: 'How will we know if the primary region goes down?'",
  challenge: "Implement comprehensive health checks to monitor system health.",
  illustration: 'monitoring',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Health monitoring is active!',
  achievement: 'You can now detect failures in real-time',
  metrics: [
    { label: 'Health checks configured', after: '✓' },
    { label: 'Failure detection', after: 'Enabled' },
    { label: 'Check interval', after: '10 seconds' },
  ],
  nextTeaser: "But you still only have one region...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Health Checks: The Foundation of Failure Detection',
  conceptExplanation: `**Health checks** are the eyes and ears of your disaster recovery system.

Types of health checks:
1. **Shallow health** - Is the server responding? (HTTP 200)
2. **Deep health** - Can the app connect to database?
3. **Dependency health** - Are external services working?
4. **Performance health** - Is latency acceptable (p99 < 200ms)?

Best practices:
- Check every 10-30 seconds
- Require 3+ consecutive failures before triggering failover (avoid false positives)
- Monitor multiple metrics (availability, latency, error rate)
- Separate health check endpoint from production traffic`,

  whyItMatters: 'You can\'t failover if you don\'t know the primary region has failed. Health checks must be fast, reliable, and comprehensive.',

  famousIncident: {
    title: 'AWS Route53 Health Check Failure',
    company: 'Major AWS Customer',
    year: '2020',
    whatHappened: 'A misconfigured health check had too aggressive thresholds. During a minor latency spike, it triggered unnecessary failover to secondary region, which wasn\'t fully warmed up. The failover itself caused a larger outage than the original issue.',
    lessonLearned: 'Health checks must balance speed vs. false positives. Always require multiple consecutive failures before triggering failover.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Detecting database failures',
    howTheyDoIt: 'Runs health checks every 10 seconds. Requires 3 consecutive failures (30 seconds) before triggering failover. Monitors both app health and database connectivity.',
  },

  keyPoints: [
    'Health checks run continuously (every 10-30 seconds)',
    'Require multiple consecutive failures to avoid false positives',
    'Check both availability AND performance',
    'Separate endpoint for health checks',
  ],

  quickCheck: {
    question: 'Why require 3 consecutive health check failures instead of failing over immediately?',
    options: [
      'To save money on health check costs',
      'To avoid false positives from transient network issues',
      'Because failover is expensive',
      'To give time for manual intervention',
    ],
    correctIndex: 1,
    explanation: 'A single health check failure might be a transient network blip. Multiple consecutive failures confirm a real problem, reducing false positives.',
  },

  keyConcepts: [
    { title: 'Health Check', explanation: 'Periodic test of system availability', icon: '💓' },
    { title: 'False Positive', explanation: 'Incorrect failure detection', icon: '⚠️' },
    { title: 'Check Interval', explanation: 'How often to test health', icon: '⏱️' },
  ],
};

const step2: GuidedStep = {
  id: 'failover-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Detect region failures',
    taskDescription: 'Add monitoring component and configure health checks',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Monitors primary region health continuously', displayName: 'Health Check Monitor' },
    ],
    successCriteria: [
      'Monitoring component added',
      'Monitor connected to Load Balancer and App Server',
      'Health check interval configured (10 seconds)',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'monitoring', toType: 'load_balancer' },
      { fromType: 'monitoring', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add a Monitoring component and connect it to Load Balancer and App Server',
    level2: 'Configure health check interval to 10 seconds in the monitoring component settings',
    solutionComponents: [
      { type: 'monitoring', config: { healthCheckInterval: 10 } },
    ],
    solutionConnections: [
      { from: 'monitoring', to: 'load_balancer' },
      { from: 'monitoring', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 3: Build Secondary Region (Standby)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌍',
  scenario: "It's 3 AM. The primary region in US-East just went down completely!",
  hook: "All 100 million users see 'Service Unavailable'. Revenue loss: $50,000 per minute.",
  challenge: "Build a secondary region in US-West to serve as failover target.",
  illustration: 'disaster',
};

const step3Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Secondary region is ready!',
  achievement: 'You now have a backup region ready to take over',
  metrics: [
    { label: 'Regions', before: '1', after: '2' },
    { label: 'Geographic redundancy', after: 'Enabled' },
    { label: 'Failover target', after: 'Ready' },
  ],
  nextTeaser: "But the secondary region has no data...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Region Architecture: Building Redundancy',
  conceptExplanation: `A **secondary region** is your insurance policy against regional disasters.

Why you need a secondary region:
- **Natural disasters** - Earthquakes, hurricanes, floods
- **Power outages** - Regional grid failures
- **Network partitions** - ISP or backbone issues
- **AWS outages** - Even cloud providers have regional failures
- **Human error** - Accidental misconfigurations

Architecture patterns:
1. **Active-Passive** - Primary serves traffic, secondary on standby
2. **Active-Active** - Both regions serve traffic simultaneously
3. **Pilot Light** - Secondary has minimal resources, scales up during failover

For RTO < 5 minutes, you need active-passive with secondary fully provisioned.`,

  whyItMatters: 'Without a secondary region, ANY regional failure means total outage. Multi-region is the only way to achieve high availability.',

  famousIncident: {
    title: 'AWS US-East-1 Outage',
    company: 'AWS',
    year: '2017',
    whatHappened: 'S3 outage in US-East-1 took down thousands of websites and apps. Companies with multi-region architecture stayed online. Single-region companies had hours of downtime.',
    lessonLearned: 'Regional failures happen to everyone, including AWS. Multi-region architecture is essential for mission-critical systems.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Surviving AWS regional failures',
    howTheyDoIt: 'Runs in 3 AWS regions simultaneously. When US-East fails, traffic automatically shifts to US-West and EU-West. Users barely notice.',
  },

  diagram: `
Primary Region (US-East)          Secondary Region (US-West)
┌─────────────────────┐           ┌─────────────────────┐
│   Load Balancer     │           │   Load Balancer     │
│         ↓           │           │         ↓           │
│   App Servers       │           │   App Servers       │
│         ↓           │           │         ↓           │
│     Database        │ ═══════▶  │     Database        │
└─────────────────────┘           └─────────────────────┘
    (Active)                          (Standby)
                                   Ready to take over!
`,

  keyPoints: [
    'Secondary region is a complete copy of primary',
    'Should be 500+ miles away (different AWS region)',
    'Same architecture: Load Balancer → App Servers → Database',
    'Initially on standby, ready to activate',
  ],

  quickCheck: {
    question: 'Why must the secondary region be geographically distant from primary?',
    options: [
      'To reduce network latency',
      'To avoid correlated failures like natural disasters',
      'Because it\'s cheaper',
      'To comply with regulations',
    ],
    correctIndex: 1,
    explanation: 'If regions are too close, a hurricane or power grid failure could take down both. Geographic diversity protects against regional disasters.',
  },

  keyConcepts: [
    { title: 'Secondary Region', explanation: 'Backup region ready to take over', icon: '🌎' },
    { title: 'Active-Passive', explanation: 'Primary active, secondary on standby', icon: '🔄' },
    { title: 'Geographic Diversity', explanation: 'Regions far apart to avoid shared failures', icon: '🌍' },
  ],
};

const step3: GuidedStep = {
  id: 'failover-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'Setting up failover target for all FRs',
    taskDescription: 'Build secondary region with same architecture as primary',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Load balancer for secondary region', displayName: 'Load Balancer (Secondary)' },
      { type: 'app_server', reason: 'App servers in secondary region', displayName: 'App Server (Secondary)' },
      { type: 'database', reason: 'Database in secondary region', displayName: 'Database (Secondary)' },
    ],
    successCriteria: [
      'Secondary region components added',
      'Secondary Load Balancer → App Server → Database connected',
      'Mirror architecture of primary region',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'monitoring', toType: 'load_balancer' },
      { fromType: 'monitoring', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Add another set of Load Balancer, App Server, and Database for the secondary region',
    level2: 'Connect them the same way as primary: Load Balancer → App Server → Database',
    solutionComponents: [
      { type: 'load_balancer' },
      { type: 'app_server' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 4: Implement Database Replication
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📋',
  scenario: "You have two regions, but the secondary database is EMPTY!",
  hook: "If you fail over now, users will see no data. All their information will be gone!",
  challenge: "Set up continuous database replication from primary to secondary.",
  illustration: 'data-sync',
};

const step4Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Data replication is flowing!',
  achievement: 'Secondary database stays in sync with primary',
  metrics: [
    { label: 'Replication status', after: 'Active' },
    { label: 'Replication lag', after: '< 5 seconds' },
    { label: 'RPO achieved', after: '30 seconds' },
  ],
  nextTeaser: "But how do you route traffic between regions?...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication: Keeping Secondary in Sync',
  conceptExplanation: `**Database replication** is critical for minimizing data loss during failover.

Replication types:
1. **Synchronous** - Wait for secondary to confirm before committing
   - Pros: Zero data loss (RPO = 0)
   - Cons: Slow (cross-region latency), availability risk

2. **Asynchronous** - Commit on primary, replicate in background
   - Pros: Fast, no cross-region latency impact
   - Cons: Potential data loss = replication lag

For cross-region failover, use **asynchronous replication**:
- Primary commits writes locally (fast!)
- Changes stream to secondary continuously
- Monitor replication lag (should be < 5 seconds)
- RPO = replication lag at time of failure

Replication lag monitoring:
- Alert if lag > 10 seconds
- Failover decision considers lag
- Trade-off: some data loss vs. availability`,

  whyItMatters: 'Without replication, failover means losing ALL user data. RPO is determined by your replication lag.',

  famousIncident: {
    title: 'GitLab Database Replication Failure',
    company: 'GitLab',
    year: '2017',
    whatHappened: 'GitLab\'s database replication had been silently broken for hours. When the primary failed, the replica was far behind. They lost 6 hours of data (issues, merge requests, comments). The disaster was compounded because their backup process also had issues.',
    lessonLearned: 'Monitor replication lag continuously. Test your replicas regularly. Don\'t discover replication is broken during a disaster.',
    icon: '🔧',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Multi-region database replication',
    howTheyDoIt: 'Uses Aurora Global Database with < 1 second replication lag across regions. Monitors lag continuously and alerts if it exceeds thresholds.',
  },

  diagram: `
Primary Database (US-East)
     │
     │ Continuous async replication
     │ (5 second lag)
     ▼
Secondary Database (US-West)
     │
     │ Monitor replication lag
     └─▶ Alert if lag > 10 seconds

RPO = Replication lag at time of failure
RTO = Time to promote secondary + DNS propagation
`,

  keyPoints: [
    'Async replication balances performance vs. data loss',
    'Replication lag typically < 5 seconds',
    'RPO (data loss) = replication lag at failure time',
    'Monitor lag continuously and alert on issues',
    'Primary → Secondary replication is one-way',
  ],

  quickCheck: {
    question: 'Why use async replication instead of sync for cross-region failover?',
    options: [
      'Async is more reliable',
      'Sync replication would add cross-region latency to every write',
      'Async is cheaper',
      'Sync doesn\'t work across regions',
    ],
    correctIndex: 1,
    explanation: 'Sync replication requires waiting for cross-region confirmation (50-100ms). This would make every write slow. Async replicates in background without impacting performance.',
  },

  keyConcepts: [
    { title: 'Async Replication', explanation: 'Background replication without blocking writes', icon: '⚡' },
    { title: 'Replication Lag', explanation: 'Time delay between primary and secondary', icon: '⏱️' },
    { title: 'RPO', explanation: 'Recovery Point Objective - acceptable data loss', icon: '📊' },
  ],
};

const step4: GuidedStep = {
  id: 'failover-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Data replication',
    taskDescription: 'Configure database replication from primary to secondary',
    successCriteria: [
      'Click on primary database',
      'Enable cross-region replication',
      'Connect primary database to secondary database',
      'Set replication mode to async',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'database' }, // Primary to secondary replication
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on the primary database and look for replication settings',
    level2: 'Enable replication and connect primary database to secondary database. Set mode to async.',
    solutionComponents: [
      { type: 'database', config: { replication: { enabled: true, mode: 'async', target: 'secondary' } } },
    ],
    solutionConnections: [
      { from: 'database', to: 'database', label: 'replication' },
    ],
  },
};

// =============================================================================
// STEP 5: Add DNS-Based Traffic Routing
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌐',
  scenario: "You have two regions with data in sync. But users only know about the primary!",
  hook: "How do you redirect millions of users from the failed primary to the healthy secondary?",
  challenge: "Implement DNS-based failover with Route53 health checks.",
  illustration: 'routing',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Traffic routing is intelligent!',
  achievement: 'DNS automatically routes users to healthy region',
  metrics: [
    { label: 'DNS failover', after: 'Configured' },
    { label: 'TTL', after: '60 seconds' },
    { label: 'Automatic routing', after: 'Enabled' },
  ],
  nextTeaser: "But failover isn't automatic yet...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'DNS-Based Failover: Intelligent Traffic Routing',
  conceptExplanation: `**DNS failover** automatically routes users to healthy regions using DNS health checks.

How it works:
1. Route53 continuously health-checks primary region
2. When primary is healthy: DNS returns primary IP
3. When primary fails: DNS returns secondary IP
4. Users automatically connect to healthy region

DNS TTL (Time To Live):
- **Low TTL (60s)** - Fast failover but more DNS queries
- **High TTL (300s)** - Fewer queries but slower failover
- For RTO < 5 min, use TTL = 60 seconds

Failover time calculation:
- Health check failure detection: 30 seconds (3 checks × 10s)
- DNS record update: 1 second
- DNS TTL propagation: 60 seconds
- **Total RTO: ~90 seconds**

Active-active vs active-passive:
- **Active-passive**: Only primary gets traffic (our approach)
- **Active-active**: Both regions get traffic (load distributed)`,

  whyItMatters: 'DNS is the "traffic cop" that routes users to the right region. Without it, failover requires manual intervention and takes hours.',

  famousIncident: {
    title: 'DynamoDB Global Outage via DNS',
    company: 'AWS',
    year: '2015',
    whatHappened: 'A bug in AWS\'s Route53 DNS service caused incorrect routing of DynamoDB traffic. Even though DynamoDB servers were healthy, DNS was sending requests to wrong endpoints. Multi-region customers were impacted for hours.',
    lessonLearned: 'DNS itself is a single point of failure. Use multiple DNS providers or understand your DNS provider\'s SLA.',
    icon: '🌐',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Global traffic routing',
    howTheyDoIt: 'Uses Route53 with health checks on both regions. TTL of 60 seconds enables fast failover. Also uses anycast for even faster routing.',
  },

  diagram: `
                    ┌──────────────┐
                    │   Route53    │
                    │  DNS Service │
                    └──────┬───────┘
                           │
          Health check ────┤
          every 10 sec     │
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
  Primary Healthy?                    Primary Failed?
  DNS → Primary IP                    DNS → Secondary IP
        │                                     │
        ▼                                     ▼
  ┌───────────────┐                   ┌───────────────┐
  │ Primary       │                   │ Secondary     │
  │ Load Balancer │                   │ Load Balancer │
  └───────────────┘                   └───────────────┘
`,

  keyPoints: [
    'Route53 health checks monitor primary region',
    'DNS automatically updates when primary fails',
    'TTL = 60 seconds for fast propagation',
    'Total RTO ≈ health check time + TTL',
    'Users transparently routed to healthy region',
  ],

  quickCheck: {
    question: 'Why is low DNS TTL important for fast failover?',
    options: [
      'It reduces server load',
      'It makes DNS queries faster',
      'Users refresh DNS records more frequently, discovering the new region faster',
      'It\'s required by AWS',
    ],
    correctIndex: 2,
    explanation: 'DNS TTL determines how long clients cache the IP address. Lower TTL means clients check for updates more frequently, discovering the failover faster.',
  },

  keyConcepts: [
    { title: 'DNS Failover', explanation: 'Automatic routing based on health checks', icon: '🌐' },
    { title: 'TTL', explanation: 'Time To Live - how long DNS records are cached', icon: '⏱️' },
    { title: 'Route53', explanation: 'AWS DNS service with health check integration', icon: '🗺️' },
  ],
};

const step5: GuidedStep = {
  id: 'failover-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'Enabling automatic traffic routing for all FRs',
    taskDescription: 'Add DNS service and configure failover routing',
    componentsNeeded: [
      { type: 'dns', reason: 'Routes traffic based on region health', displayName: 'Route53 DNS' },
    ],
    successCriteria: [
      'DNS component added',
      'Client connected to DNS (instead of direct to load balancer)',
      'DNS connected to both primary and secondary load balancers',
      'TTL configured to 60 seconds',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' }, // Primary
      { fromType: 'dns', toType: 'load_balancer' }, // Secondary
    ],
  },

  hints: {
    level1: 'Add DNS component between Client and Load Balancers',
    level2: 'Connect Client → DNS, then DNS → Primary LB and DNS → Secondary LB. Set TTL to 60s.',
    solutionComponents: [
      { type: 'dns', config: { ttl: 60, healthCheckEnabled: true } },
    ],
    solutionConnections: [
      { from: 'client', to: 'dns' },
      { from: 'dns', to: 'load_balancer' },
      { from: 'dns', to: 'load_balancer' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement Automated Failover Logic
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🤖',
  scenario: "It's 2 AM Sunday. The primary region just failed. You're asleep.",
  hook: "Without automation, the system stays down until you wake up and manually failover (RTO: 6 hours!)",
  challenge: "Implement automated failover that triggers without human intervention.",
  illustration: 'automation',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Failover is now automatic!',
  achievement: 'System recovers from failures without human intervention',
  metrics: [
    { label: 'Manual intervention', before: 'Required', after: 'Not needed' },
    { label: 'RTO', before: '6 hours', after: '< 5 minutes' },
    { label: 'Automation', after: 'Enabled' },
  ],
  nextTeaser: "But you haven't tested if failover actually works...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Automated Failover: Eliminating Human Bottlenecks',
  conceptExplanation: `**Automated failover** is the difference between minutes and hours of downtime.

Failover automation workflow:
1. **Health checks fail** (3 consecutive failures = 30 seconds)
2. **Monitoring system detects failure** (1 second)
3. **Automated decision**: Trigger failover or wait?
4. **DNS update**: Route53 switches to secondary (1 second)
5. **Secondary database promotion**: If needed (30 seconds)
6. **TTL propagation**: Users discover new IP (60 seconds)
7. **Total RTO**: ~2-3 minutes

Safeguards:
- Require multiple consecutive failures (avoid false positives)
- Check secondary region is healthy before failing over
- Implement "fencing" to prevent split-brain
- Alert humans even though automated
- Circuit breaker pattern to prevent flapping

Manual override:
- Automation should have manual override capability
- Humans can force failover or prevent automatic failover
- Important for maintenance windows`,

  whyItMatters: 'Human response time is measured in minutes to hours. Automated failover operates in seconds. For RTO < 5 minutes, automation is mandatory.',

  famousIncident: {
    title: 'GitHub Database Failover Automation',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'GitHub\'s primary database lost connectivity to their secondary. Their automated failover system kicked in and promoted the secondary to primary. However, due to network partition (not true failure), both databases briefly acted as primary (split-brain), causing data inconsistencies that took 24 hours to resolve.',
    lessonLearned: 'Automated failover needs split-brain prevention (fencing). When in doubt, err on the side of availability over consistency, but have rollback plans.',
    icon: '🐙',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Automated region failover',
    howTheyDoIt: 'Uses Chaos Monkey to randomly fail services. Automated systems detect failures and reroute traffic within seconds. Humans are alerted but don\'t need to intervene.',
  },

  diagram: `
Automated Failover Flow:

Health Checks Fail (30s)
         ↓
Monitoring Detects Failure (1s)
         ↓
Decision Engine: Trigger Failover?
         ↓
   ┌────┴────┐
   Yes       No (Transient issue)
   │          ↓
   │      Wait & Monitor
   ↓
Update DNS to Secondary (1s)
   ↓
Promote Secondary DB if needed (30s)
   ↓
Alert Operations Team
   ↓
Users Connect to Secondary (TTL: 60s)
   ↓
FAILOVER COMPLETE (~2-3 min)
`,

  keyPoints: [
    'Automation reduces RTO from hours to minutes',
    'Require multiple health check failures (avoid false positives)',
    'Check secondary is healthy before failing over',
    'Implement fencing to prevent split-brain',
    'Always alert humans even with automation',
  ],

  quickCheck: {
    question: 'What is the main risk of automated failover?',
    options: [
      'It costs more money',
      'False positives causing unnecessary failovers or split-brain scenarios',
      'It violates compliance requirements',
      'It makes the system more complex',
    ],
    correctIndex: 1,
    explanation: 'Automated failover can trigger on false positives (transient issues) or create split-brain if both regions think they\'re primary. Safeguards are critical.',
  },

  keyConcepts: [
    { title: 'Automation', explanation: 'Failover without human intervention', icon: '🤖' },
    { title: 'Fencing', explanation: 'Preventing old primary from accepting writes', icon: '🚧' },
    { title: 'Split-Brain', explanation: 'Both regions acting as primary', icon: '🧠' },
  ],
};

const step6: GuidedStep = {
  id: 'failover-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-2: Automated failover',
    taskDescription: 'Configure automated failover triggers and policies',
    successCriteria: [
      'Click on DNS component',
      'Enable automated failover',
      'Set health check threshold to 3 consecutive failures',
      'Configure failover policy (primary → secondary)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'monitoring', toType: 'dns' }, // Monitoring triggers DNS updates
    ],
  },

  hints: {
    level1: 'Click on DNS and enable automated failover. Connect monitoring to DNS.',
    level2: 'Set health check threshold to 3 failures and configure failover from primary to secondary',
    solutionComponents: [
      { type: 'dns', config: { automatedFailover: true, healthCheckThreshold: 3, failoverPolicy: 'primary-to-secondary' } },
    ],
    solutionConnections: [
      { from: 'monitoring', to: 'dns' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Alerting and Notification
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📢',
  scenario: "Automated failover just kicked in at 3 AM. But nobody knows!",
  hook: "Your team wakes up to angry Slack messages from users. 'Why didn't you tell us about the failover?'",
  challenge: "Implement alerting so the team knows when failover occurs.",
  illustration: 'alerts',
};

const step7Celebration: CelebrationContent = {
  emoji: '🔔',
  message: 'Alert system is live!',
  achievement: 'Team gets notified of all failover events',
  metrics: [
    { label: 'Alert channels', after: 'PagerDuty, Slack, Email' },
    { label: 'Notification latency', after: '< 30 seconds' },
    { label: 'On-call coverage', after: '24/7' },
  ],
  nextTeaser: "But what happens when you need to return to the primary?...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Alerting and Notification: Keeping Humans in the Loop',
  conceptExplanation: `Even with automation, **humans need to know** when failover happens.

Alert types:
1. **Critical alerts** (immediate response required):
   - Primary region failure detected
   - Automated failover triggered
   - Secondary region unhealthy
   - Replication lag > threshold

2. **Warning alerts** (investigate soon):
   - Elevated error rates
   - Increased latency
   - Replication lag increasing

3. **Info alerts** (for awareness):
   - Successful automated recovery
   - Failback to primary completed

Alert channels:
- **PagerDuty**: Wake up on-call engineer (critical only)
- **Slack**: Team channel for all alerts
- **Email**: Summary reports
- **Dashboard**: Real-time status visualization

Alert fatigue prevention:
- Only page for true emergencies
- Use smart grouping (don't send 1000 alerts)
- Auto-resolve when issue fixed
- Regular alert tuning based on feedback`,

  whyItMatters: 'Automation handles the immediate response, but humans need to investigate root cause, communicate with customers, and prevent recurrence.',

  famousIncident: {
    title: 'PagerDuty\'s Own Outage',
    company: 'PagerDuty',
    year: '2020',
    whatHappened: 'PagerDuty (the alerting service) had an outage. Companies relying solely on PagerDuty didn\'t know their systems were down because the alerts weren\'t being delivered. Ironic but serious lesson.',
    lessonLearned: 'Use multiple independent alert channels. Your alerting system itself needs redundancy.',
    icon: '📟',
  },

  realWorldExample: {
    company: 'Stripe',
    scenario: 'Incident response workflow',
    howTheyDoIt: 'Critical alerts go to PagerDuty (pages on-call). Slack gets all alerts. Auto-creates incident channels. Humans investigate while automation handles immediate recovery.',
  },

  keyPoints: [
    'Automation handles recovery, humans handle investigation',
    'Use multiple alert channels (PagerDuty, Slack, Email)',
    'Page only for critical issues requiring immediate action',
    'Include context in alerts (what failed, what was done)',
    'Auto-resolve alerts when system recovers',
  ],

  quickCheck: {
    question: 'Why use multiple alert channels instead of just one?',
    options: [
      'To notify more people',
      'Redundancy - if one channel fails, others still work',
      'Different channels for different severities',
      'It\'s required by regulations',
    ],
    correctIndex: 1,
    explanation: 'Alert systems themselves can fail. Multiple channels ensure critical notifications reach the team even if one channel is down.',
  },

  keyConcepts: [
    { title: 'Alert Severity', explanation: 'Critical, Warning, Info levels', icon: '🚨' },
    { title: 'On-Call', explanation: '24/7 engineer rotation for critical alerts', icon: '👨‍💻' },
    { title: 'Alert Fatigue', explanation: 'Too many alerts lead to ignoring them', icon: '😴' },
  ],
};

const step7: GuidedStep = {
  id: 'failover-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-5: Alert and notify',
    taskDescription: 'Add notification service for failover events',
    componentsNeeded: [
      { type: 'notification', reason: 'Alerts team of failover events', displayName: 'Alert Service' },
    ],
    successCriteria: [
      'Notification component added',
      'Connect monitoring to notification service',
      'Configure alert channels (PagerDuty, Slack)',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database', 'notification'],
    requiredConnections: [
      { fromType: 'monitoring', toType: 'notification' },
    ],
  },

  hints: {
    level1: 'Add a Notification component and connect it to the monitoring service',
    level2: 'Configure alert channels in the notification component settings',
    solutionComponents: [
      { type: 'notification', config: { channels: ['pagerduty', 'slack', 'email'] } },
    ],
    solutionConnections: [
      { from: 'monitoring', to: 'notification' },
    ],
  },
};

// =============================================================================
// STEP 8: Implement Failback Capability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '↩️',
  scenario: "Primary region has been repaired and is healthy again!",
  hook: "But traffic is still going to the secondary. How do you safely return to primary?",
  challenge: "Implement automated failback to return traffic to the primary region.",
  illustration: 'recovery',
};

const step8Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Failback capability enabled!',
  achievement: 'System can automatically return to primary when healthy',
  metrics: [
    { label: 'Failback strategy', after: 'Automated' },
    { label: 'Data sync before failback', after: 'Required' },
    { label: 'Safety checks', after: 'Enabled' },
  ],
  nextTeaser: "But how do you know failover actually works?...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Failback: Returning to Primary Region',
  conceptExplanation: `**Failback** is returning traffic to the primary region after it recovers.

Failback strategies:
1. **Automatic failback** - Return as soon as primary is healthy
   - Pros: Faster, no manual work
   - Cons: Risk of flapping if issue recurs

2. **Manual failback** - Humans decide when to return
   - Pros: More control, verify stability first
   - Cons: Slower, requires human intervention

Recommended: **Delayed automatic failback**
- Wait 30 minutes after primary becomes healthy
- Verify primary is stable (no error spikes)
- Reverse replication: Secondary → Primary
- Switch DNS back to primary
- Monitor closely for issues

Failback checklist:
✓ Primary region healthy for 30+ minutes
✓ Data sync from secondary → primary completed
✓ Replication lag < 5 seconds
✓ No elevated error rates in primary
✓ Team alerted of upcoming failback
✓ Rollback plan ready if issues occur

Important: Failback is NOT just reversing failover!
- Data may have been written to secondary
- Must sync that data back to primary first
- Risk of data loss if not careful`,

  whyItMatters: 'Operating on the secondary region long-term increases costs and complexity. Failback returns you to the ideal steady state.',

  famousIncident: {
    title: 'Facebook DNS Failback Disaster',
    company: 'Facebook',
    year: '2021',
    whatHappened: 'During a routine maintenance, Facebook\'s BGP routes were withdrawn. When they tried to failback, their DNS servers were unreachable. The cascading failure took down Facebook, Instagram, and WhatsApp for 6 hours globally. Failback was more complex than failover.',
    lessonLearned: 'Failback can be riskier than failover. Test it regularly. Have out-of-band access to your infrastructure.',
    icon: '📘',
  },

  realWorldExample: {
    company: 'AWS RDS',
    scenario: 'Multi-AZ failover and failback',
    howTheyDoIt: 'Automatic failover to standby AZ. Failback is semi-automatic - waits for human approval after primary is repaired. Reverses replication before switching.',
  },

  diagram: `
Failback Flow:

Primary Recovers
     ↓
Wait 30 min (Stability Check)
     ↓
Reverse Replication:
Secondary → Primary
     ↓
Verify Data Sync Complete
     ↓
Switch DNS: Secondary → Primary
(Gradual: 10% → 50% → 100%)
     ↓
Monitor Primary Closely
     ↓
Failback Complete!
Secondary returns to Standby
`,

  keyPoints: [
    'Failback returns traffic to primary region',
    'Wait for primary to be stable (30+ minutes healthy)',
    'Reverse replicate: Secondary → Primary first',
    'Gradual traffic shift reduces risk',
    'Monitor closely during and after failback',
  ],

  quickCheck: {
    question: 'Why wait 30 minutes after primary becomes healthy before failing back?',
    options: [
      'To save money on DNS updates',
      'To verify primary is truly stable and won\'t fail again immediately',
      'It\'s required by AWS',
      'To give time for manual approval',
    ],
    correctIndex: 1,
    explanation: 'If primary fails again immediately after failback, you\'ll flap back and forth. Waiting ensures primary is truly stable before returning traffic.',
  },

  keyConcepts: [
    { title: 'Failback', explanation: 'Returning to primary after recovery', icon: '↩️' },
    { title: 'Flapping', explanation: 'Rapid switching between regions', icon: '↔️' },
    { title: 'Reverse Replication', explanation: 'Syncing secondary changes back to primary', icon: '🔄' },
  ],
};

const step8: GuidedStep = {
  id: 'failover-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-4: Failback capability',
    taskDescription: 'Configure automated failback with safety checks',
    successCriteria: [
      'Enable failback in DNS configuration',
      'Set stability wait time to 30 minutes',
      'Enable reverse replication from secondary to primary',
      'Configure gradual traffic shift (10% → 50% → 100%)',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database', 'notification'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'database', toType: 'database' }, // Bidirectional replication
    ],
  },

  hints: {
    level1: 'Click on DNS and enable failback with 30-minute stability wait',
    level2: 'Enable reverse replication in database settings for syncing secondary → primary',
    solutionComponents: [
      { type: 'dns', config: { failback: { enabled: true, stabilityWait: 30, gradual: true } } },
      { type: 'database', config: { replication: { bidirectional: true } } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 9: Test Failover with Chaos Engineering
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🧪',
  scenario: "You've built failover automation. But does it actually work?",
  hook: "The CEO asks: 'Have you tested what happens when the primary region fails?' You haven't...",
  challenge: "Run chaos engineering experiments to validate your failover system.",
  illustration: 'testing',
};

const step9Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'Failover has been tested and verified!',
  achievement: 'You know the system will work when disaster strikes',
  metrics: [
    { label: 'Chaos tests passed', after: '5/5' },
    { label: 'Failover time', after: '2.5 minutes' },
    { label: 'Data loss', after: '0 seconds (RPO met)' },
    { label: 'Confidence', before: 'Uncertain', after: 'High' },
  ],
  nextTeaser: "Time to optimize costs and monitoring...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Chaos Engineering: Testing Disaster Recovery',
  conceptExplanation: `**Chaos engineering** is intentionally breaking your system to verify recovery works.

"Untested failover is broken failover." - Every SRE ever

Chaos tests for failover:
1. **Kill primary region** - Simulate complete region failure
   - Expected: Automatic failover in < 5 minutes
   - Verify: Users can still access the service

2. **Network partition** - Simulate region isolation
   - Expected: No split-brain scenario
   - Verify: Only one region accepts writes

3. **Database failure** - Kill primary database
   - Expected: Promote secondary database
   - Verify: Data loss within RPO (30 seconds)

4. **Slow degradation** - Gradually increase latency
   - Expected: Health checks detect and failover
   - Verify: No false positives on small spikes

5. **Failback test** - Return to primary after recovery
   - Expected: Smooth transition back
   - Verify: No data loss during failback

Chaos engineering principles:
- Test in production (with safeguards!)
- Start small, increase scope gradually
- Run regularly (monthly at minimum)
- Automate chaos tests
- Have kill switch to stop test`,

  whyItMatters: 'You discover failover issues during chaos tests, not during real disasters. Every untested assumption is a future outage.',

  famousIncident: {
    title: 'Netflix Chaos Monkey Success Story',
    company: 'Netflix',
    year: '2011-Present',
    whatHappened: 'Netflix built Chaos Monkey to randomly kill production servers during business hours. Initially caused small outages. Over time, forced teams to build resilience. When AWS US-East failed in 2012, Netflix stayed online while others went down.',
    lessonLearned: 'Regular chaos testing builds real resilience. What hurts in testing saves you during disasters.',
    icon: '🐵',
  },

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Prime Day chaos testing',
    howTheyDoIt: 'Runs "Game Days" before Prime Day where they simulate regional failures, database crashes, and network issues. Validates that failover works before the highest-traffic event of the year.',
  },

  diagram: `
Chaos Engineering Workflow:

1. Define Steady State
   (RTO < 5 min, RPO < 30 sec)
         ↓
2. Hypothesize
   "If primary fails, secondary takes over in < 5 min"
         ↓
3. Introduce Chaos
   (Kill primary region)
         ↓
4. Measure Impact
   - Time to failover: 2.5 min ✓
   - Data loss: 5 seconds ✓
   - User impact: Minimal ✓
         ↓
5. Fix Issues Found
   (Improve health check sensitivity)
         ↓
6. Repeat Monthly
`,

  keyPoints: [
    'Untested failover will fail when you need it',
    'Run chaos tests monthly in production',
    'Test all failure modes: region, database, network',
    'Measure RTO and RPO during tests',
    'Fix issues before real disasters happen',
  ],

  quickCheck: {
    question: 'Why run chaos tests in production instead of staging?',
    options: [
      'Staging environments are too expensive',
      'Production is the only environment with real scale, real data, and real complexity',
      'It\'s more exciting',
      'Staging isn\'t available',
    ],
    correctIndex: 1,
    explanation: 'Staging never perfectly mirrors production. Issues only appear at real scale with real traffic patterns. Test in production (with safeguards) or don\'t test at all.',
  },

  keyConcepts: [
    { title: 'Chaos Engineering', explanation: 'Intentionally breaking systems to build resilience', icon: '🧪' },
    { title: 'Game Day', explanation: 'Scheduled disaster simulation exercise', icon: '🎮' },
    { title: 'Blast Radius', explanation: 'Scope of impact from chaos test', icon: '💥' },
  ],
};

const step9: GuidedStep = {
  id: 'failover-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'Validating all FRs work during failures',
    taskDescription: 'Run chaos tests to validate failover system',
    successCriteria: [
      'Add chaos testing component',
      'Configure test scenarios (region failure, database failure)',
      'Run automated monthly chaos tests',
      'Verify RTO and RPO metrics are met',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database', 'notification'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'dns', toType: 'load_balancer' },
    ],
  },

  hints: {
    level1: 'Consider how you would test failover - what would you break and measure?',
    level2: 'Think about testing region failure, database failure, and network partitions',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Optimize Costs and Monitoring
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💰',
  scenario: "CFO just reviewed the cloud bill. 'Two fully provisioned regions?! This costs $200K/month!'",
  hook: "You need to optimize costs while maintaining your RTO and RPO guarantees.",
  challenge: "Optimize your disaster recovery architecture for cost efficiency.",
  illustration: 'cost-optimization',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built enterprise-grade disaster recovery!',
  achievement: 'A cost-effective, tested, automated failover system',
  metrics: [
    { label: 'RTO achieved', after: '< 5 minutes' },
    { label: 'RPO achieved', after: '< 30 seconds' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Monthly cost', before: '$200K', after: '$120K' },
    { label: 'Tested', after: 'Monthly chaos drills' },
  ],
  nextTeaser: "You've mastered cross-region failover!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: Balancing Resilience and Budget',
  conceptExplanation: `Multi-region architecture is expensive. **Optimize without compromising resilience.**

Cost optimization strategies:

1. **Right-size secondary region**
   - Run fewer instances initially
   - Auto-scale rapidly during failover
   - Trade-off: Slightly slower failover (1-2 min to scale)

2. **Tiered replication**
   - Critical data: Sync replication (RPO = 0)
   - Important data: Async with < 5s lag
   - Archive data: Hourly snapshots

3. **Reserved instances for primary**
   - 1-3 year commitments save 30-60%
   - Use spot instances for secondary

4. **Optimize data transfer**
   - Cross-region replication is expensive
   - Compress before replicating
   - Replicate only changed data (CDC)

5. **Scheduled failover tests**
   - Run chaos tests during off-peak (cheaper)
   - Use small-scale tests monthly, full tests quarterly

Cost breakdown (typical):
- Primary region servers: $80K/month
- Secondary region servers: $40K/month (50% capacity)
- Cross-region data transfer: $15K/month
- Monitoring and alerting: $5K/month
- **Total: $140K/month**

Without optimization: $200K/month
Savings: $60K/month (30%)`,

  whyItMatters: 'The best disaster recovery system is one you can afford to run long-term. Optimize costs without compromising your RTO/RPO guarantees.',

  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Knight Capital had a trading software bug that cost them $440 million in 45 minutes. They had NO disaster recovery plan - no secondary system to failover to. The company nearly went bankrupt and was eventually acquired. Cost of DR would have been < $1M/year.',
    lessonLearned: 'DR insurance is cheap compared to disaster cost. But optimize it so you can sustain it.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Dropbox',
    scenario: 'Multi-region DR optimization',
    howTheyDoIt: 'Runs primary in custom data centers (cheaper). Uses AWS as secondary for DR. Secondary is smaller scale, auto-scales during failover. Saves millions vs dual AWS.',
  },

  keyPoints: [
    'Right-size secondary region (can be 50% of primary)',
    'Use reserved instances for steady state, spot for burst',
    'Compress and optimize cross-region data transfer',
    'Monitor costs continuously alongside availability',
    'Optimize without compromising RTO/RPO',
  ],

  quickCheck: {
    question: 'What\'s the main trade-off when running a smaller secondary region?',
    options: [
      'Lower availability',
      'Longer RTO as secondary scales up during failover',
      'Higher RPO and data loss',
      'More complexity',
    ],
    correctIndex: 1,
    explanation: 'Smaller secondary needs time to auto-scale to full capacity. This adds 1-2 minutes to RTO. Acceptable if RTO budget allows it.',
  },

  keyConcepts: [
    { title: 'Right-Sizing', explanation: 'Optimal capacity vs. cost balance', icon: '📊' },
    { title: 'Reserved Instances', explanation: 'Long-term commitment for discounts', icon: '💰' },
    { title: 'Auto-Scaling', explanation: 'Dynamic capacity adjustment', icon: '📈' },
  ],
};

const step10: GuidedStep = {
  id: 'failover-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'Optimizing cost efficiency for all FRs',
    taskDescription: 'Optimize system for cost while maintaining RTO/RPO guarantees',
    successCriteria: [
      'Review component configurations for over-provisioning',
      'Right-size secondary region (50% of primary capacity)',
      'Configure auto-scaling for secondary region',
      'Maintain RTO < 5 min and RPO < 30 sec',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'dns', 'load_balancer', 'app_server', 'database', 'monitoring', 'load_balancer', 'app_server', 'database', 'notification'],
    requiredConnections: [
      { fromType: 'client', toType: 'dns' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'dns', toType: 'load_balancer' },
      { fromType: 'database', toType: 'database' },
      { fromType: 'monitoring', toType: 'notification' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Review secondary region capacity - can it be smaller than primary?',
    level2: 'Configure secondary to run at 50% capacity with auto-scaling enabled for failover',
    solutionComponents: [
      { type: 'app_server', config: { instances: 2, autoScaling: { enabled: true, max: 4 } } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const crossRegionFailoverGuidedTutorial: GuidedTutorial = {
  problemId: 'cross-region-failover',
  title: 'E-commerce Platform with Disaster Recovery',
  description: 'Build an Amazon-like e-commerce platform with automated disaster recovery, cross-region failover, and 99.99% availability',
  difficulty: 'advanced',
  estimatedMinutes: 75,

  welcomeStory: {
    emoji: '🛒',
    hook: "You've been hired as VP of Infrastructure at MegaShop - an Amazon-scale e-commerce platform!",
    scenario: "Your mission: Build disaster recovery for our e-commerce platform that handles millions of orders daily. When a region fails, customers must still be able to browse products and complete purchases with minimal interruption.",
    challenge: "Can you design a system that survives regional failures with RTO < 5 minutes, RPO < 30 seconds, and zero lost orders?",
  },

  requirementsPhase: crossRegionFailoverRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Multi-Region Architecture',
    'Disaster Recovery Planning',
    'RTO (Recovery Time Objective)',
    'RPO (Recovery Point Objective)',
    'Health Checks and Monitoring',
    'Automated Failover',
    'DNS-Based Traffic Routing',
    'Database Replication (Async)',
    'Split-Brain Prevention',
    'Failback Strategies',
    'Chaos Engineering',
    'Alert and Notification',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Primary-Secondary)',
    'Chapter 8: Distributed Systems Troubles',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default crossRegionFailoverGuidedTutorial;
