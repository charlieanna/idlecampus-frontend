import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Hybrid CDN Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching advanced CDN concepts through
 * building a multi-CDN content delivery system.
 *
 * Key Concepts:
 * - Multi-CDN strategy (primary + fallback)
 * - Origin shielding
 * - Dynamic routing based on health/performance
 * - Geographic distribution
 * - Graceful degradation
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const hybridCdnRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a Hybrid CDN Cache system for global content delivery",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Principal CDN Architect at GlobalStream',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-content-delivery',
      category: 'functional',
      question: "What type of content needs to be delivered globally?",
      answer: "We deliver static assets (images, videos, CSS/JS files) and API responses to users worldwide. Content ranges from small (10KB images) to large (2GB video files). Users expect instant access regardless of their location.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "CDN systems must handle diverse content types with varying size and access patterns",
    },
    {
      id: 'multi-cdn-need',
      category: 'functional',
      question: "Why use multiple CDN providers instead of just one?",
      answer: "Single CDN creates vendor lock-in and single point of failure. If CloudFront has an outage in Asia, our Asian users are offline. With multi-CDN, we route to Fastly or Akamai automatically. Also, different CDNs perform better in different regions.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Multi-CDN provides redundancy, better geographic coverage, and negotiating leverage",
    },
    {
      id: 'fallback-strategy',
      category: 'functional',
      question: "What happens when the primary CDN fails?",
      answer: "The system must automatically detect the failure and route traffic to a backup CDN within seconds. Users should experience minimal disruption - maybe a slight delay, but no errors or broken content.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Automatic failover is essential - manual intervention is too slow",
    },
    {
      id: 'origin-protection',
      category: 'functional',
      question: "How do we protect the origin servers from being overwhelmed?",
      answer: "Use origin shielding - an intermediate cache layer between CDN edges and origin. Instead of 1000 edge servers hitting origin, only the shield server fetches from origin. This reduces origin load by 90%+.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Origin shielding is critical for cost and reliability at scale",
    },
    {
      id: 'dynamic-routing',
      category: 'functional',
      question: "Should routing be static or dynamic?",
      answer: "Dynamic. Route based on real-time health checks, latency measurements, and geographic proximity. If CDN-A is slow in Europe today, automatically shift European traffic to CDN-B.",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Static routing can't adapt to failures or performance degradation",
    },
    {
      id: 'cache-invalidation',
      category: 'clarification',
      question: "How do we update content across multiple CDNs?",
      answer: "When content changes, we need to purge/invalidate across ALL CDNs simultaneously. Can't have CDN-A serving new version while CDN-B serves stale content for 24 hours.",
      importance: 'important',
      insight: "Multi-CDN cache invalidation adds operational complexity",
    },

    // SCALE & NFRs
    {
      id: 'throughput-traffic',
      category: 'throughput',
      question: "What's the expected traffic volume?",
      answer: "5 million requests per second at peak, with 2 Petabytes of data transfer per month. Traffic is heavily concentrated in North America (40%), Europe (30%), and Asia (25%).",
      importance: 'critical',
      calculation: {
        formula: "5M req/s × 100KB avg = 500 GB/s bandwidth",
        result: "~500 Gbps peak bandwidth requirement",
      },
      learningPoint: "At this scale, CDN is not optional - it's the entire architecture",
    },
    {
      id: 'latency-target',
      category: 'latency',
      question: "What's the latency target for content delivery?",
      answer: "p99 latency under 100ms globally. This means 99% of users get content in under 100ms, regardless of where they are.",
      importance: 'critical',
      learningPoint: "100ms is about the limit of 'instant' for human perception",
    },
    {
      id: 'availability-sla',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.99% availability - less than 5 minutes downtime per month. Content delivery failures directly impact revenue.",
      importance: 'critical',
      learningPoint: "Four nines requires redundancy at every layer",
    },
    {
      id: 'geographic-coverage',
      category: 'scope',
      question: "Which regions must be supported?",
      answer: "Global coverage required: North America, Europe, Asia-Pacific, Latin America. Each region needs low-latency access.",
      importance: 'critical',
      insight: "Single-region CDN won't meet latency SLAs for global users",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-content-delivery', 'multi-cdn-need', 'fallback-strategy', 'origin-protection'],
  criticalFRQuestionIds: ['core-content-delivery', 'multi-cdn-need', 'fallback-strategy', 'origin-protection'],
  criticalScaleQuestionIds: ['throughput-traffic', 'latency-target', 'availability-sla'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Deliver content globally with low latency',
      description: 'Static assets and API responses delivered under 100ms p99',
      emoji: '🌍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Multi-CDN strategy for redundancy',
      description: 'Use multiple CDN providers to avoid vendor lock-in and single points of failure',
      emoji: '🔀',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Automatic failover on CDN failure',
      description: 'Detect failures and route to backup CDN within seconds',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Origin shielding to protect backend',
      description: 'Intermediate cache layer reduces load on origin servers by 90%+',
      emoji: '🛡️',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Dynamic routing based on health and performance',
      description: 'Route traffic to best-performing CDN in real-time',
      emoji: '🎯',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '100 million globally',
    writesPerDay: 'Minimal (cache invalidations)',
    readsPerDay: '400 billion requests (5M req/s average)',
    peakMultiplier: 2,
    readWriteRatio: '10000:1',
    calculatedWriteRPS: { average: 10, peak: 20 },
    calculatedReadRPS: { average: 5000000, peak: 10000000 },
    maxPayloadSize: '~2GB (video files)',
    storagePerRecord: 'N/A (CDN edge storage)',
    storageGrowthPerYear: '~5 PB (content library)',
    redirectLatencySLA: 'p99 < 100ms globally',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ 5M req/s → Must use CDN, origin can\'t handle direct traffic',
    '✅ Global users → Multi-region CDN edge locations required',
    '✅ 99.99% availability → Multi-CDN with automatic failover',
    '✅ Origin protection → Shield servers essential to prevent origin overload',
    '✅ Dynamic routing → Health checks and performance monitoring required',
    '✅ 100ms p99 → Content must be cached at edge, close to users',
  ],

  outOfScope: [
    'Content encoding/transcoding pipeline',
    'DRM and content protection',
    'Live streaming (focus on static content)',
    'User-generated content uploads',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic CDN setup with origin servers. Then we'll add multi-CDN, origin shielding, and smart routing. Always start with functionality, then layer in reliability and performance!",
};

// =============================================================================
// STEP 1: Connect Client to Origin
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to GlobalStream! You're building a content delivery system.",
  hook: "Your first user in New York wants to download a 1MB image from your servers in California.",
  challenge: "Set up the basic connection: Client → Origin Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Content is being delivered!',
  achievement: 'Users can fetch content from origin',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can serve content', after: '✓' },
  ],
  nextTeaser: "But users in Asia are experiencing 300ms latency...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'The Origin: Where Content Lives',
  conceptExplanation: `Every CDN system starts with an **Origin Server** - the source of truth for your content.

The origin server:
1. Stores the master copies of all files
2. Serves as fallback when CDN cache misses
3. Receives cache-fill requests from CDN edges

Without CDN, all users connect directly to origin. This creates two problems:
- **Latency**: User in Tokyo → Server in California = 200ms+ round trip
- **Load**: 5 million users hitting origin directly would melt the servers`,

  whyItMatters: 'Understanding origin vs edge is fundamental to CDN architecture',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 1+ PB of video content',
    howTheyDoIt: 'Origin servers store master video files in AWS S3. Open Connect edge servers cache content close to users. 95% of traffic never touches origin.',
  },

  keyPoints: [
    'Origin = source of truth, stores master content',
    'Direct origin access is slow for distant users',
    'Origin can\'t scale to handle millions of direct connections',
  ],

  keyConcepts: [
    { title: 'Origin Server', explanation: 'Master source of content', icon: '🏠' },
    { title: 'Round-Trip Time', explanation: 'Time for request to travel and return', icon: '⏱️' },
    { title: 'Geographic Distance', explanation: 'Further = higher latency', icon: '🌍' },
  ],
};

const step1: GuidedStep = {
  id: 'hybrid-cdn-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Users can fetch content from origin servers',
    taskDescription: 'Add Client and Origin Server (Object Storage), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents global users', displayName: 'Client' },
      { type: 'object_storage', reason: 'Origin server storing content', displayName: 'Origin (S3)' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'Object Storage (origin) added to canvas',
      'Client connected to Origin',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'object_storage'],
    requiredConnections: [{ fromType: 'client', toType: 'object_storage' }],
  },

  hints: {
    level1: 'Drag a Client and Object Storage from the component palette onto the canvas',
    level2: 'Click the Client, then click the Object Storage to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'object_storage' }],
    solutionConnections: [{ from: 'client', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 2: Add Primary CDN
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Asia are complaining about 300ms load times!",
  hook: "Every request travels from Tokyo to California and back. That's halfway around the world!",
  challenge: "Add a CDN to cache content at edge locations near users.",
  illustration: 'global-latency',
};

const step2Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Global latency reduced by 80%!',
  achievement: 'Content now served from edge locations',
  metrics: [
    { label: 'Tokyo latency', before: '300ms', after: '50ms' },
    { label: 'Edge cache hit rate', after: '95%' },
    { label: 'Origin load', before: '100%', after: '5%' },
  ],
  nextTeaser: "Great! But what happens if the CDN provider has an outage?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'CDN Edge Caching: Bringing Content Close to Users',
  conceptExplanation: `A **CDN** (Content Delivery Network) caches your content at edge locations worldwide.

How it works:
1. User in Tokyo requests /logo.png
2. Request goes to nearest CDN edge (Tokyo)
3. **Cache HIT**: Edge has logo.png → return instantly (20ms)
4. **Cache MISS**: Edge fetches from origin → caches it → returns to user

The first user experiences a miss (slower), but the next 10,000 users get instant cache hits!

Geographic distribution:
- Tokyo edge serves Asian users
- London edge serves European users
- New York edge serves US users
- Each edge caches popular content locally`,

  whyItMatters: 'Without CDN, every user hits origin directly. CDN reduces latency 10x and origin load by 95%.',

  famousIncident: {
    title: 'Fastly Global Outage',
    company: 'Fastly CDN',
    year: '2021',
    whatHappened: 'A configuration bug caused Fastly\'s CDN to go down globally for 49 minutes. Major sites like Reddit, Amazon, GitHub, and Stack Overflow went offline. Single CDN = single point of failure.',
    lessonLearned: 'Multi-CDN strategy is essential. Never rely on a single CDN provider for critical services.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Operating 275+ edge locations globally',
    howTheyDoIt: '95%+ of global population is within 50ms of a Cloudflare edge. Content cached at edges serves billions of requests per day.',
  },

  keyPoints: [
    'CDN edge locations cache content close to users',
    'Cache hits are 10-50x faster than origin fetches',
    'First request is slow (cache miss), subsequent requests are instant',
    'Popular content stays hot in edge cache',
  ],

  diagram: `
┌──────────────────────────────────────────┐
│  Without CDN:                            │
│  User (Tokyo) ←─ 300ms ─→ Origin (CA)   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  With CDN:                               │
│  User (Tokyo) ←─ 20ms ─→ CDN Edge       │
│                          (Tokyo)         │
│                             │            │
│                       Cache miss?        │
│                             ↓            │
│                    Origin (CA)           │
│                    (only 5% of requests) │
└──────────────────────────────────────────┘
`,

  quickCheck: {
    question: 'Why is CDN faster than direct origin access?',
    options: [
      'CDN servers have faster CPUs',
      'Content is cached geographically close to users',
      'CDN compresses files better',
      'CDN has more bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Geographic proximity is key. Tokyo edge is 20ms from Tokyo user, while California origin is 300ms away.',
  },

  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN server near users', icon: '📍' },
    { title: 'Cache Hit', explanation: 'Content found at edge, instant delivery', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Must fetch from origin, slower', icon: '❌' },
    { title: 'POP', explanation: 'Point of Presence - CDN edge datacenter', icon: '🏢' },
  ],
};

const step2: GuidedStep = {
  id: 'hybrid-cdn-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Content delivered globally with low latency',
    taskDescription: 'Add a CDN between Client and Origin',
    componentsNeeded: [
      { type: 'cdn', reason: 'Primary CDN for edge caching', displayName: 'CDN (CloudFront)' },
    ],
    successCriteria: [
      'CDN component added',
      'Client connected to CDN',
      'CDN connected to Origin',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add a CDN component and connect: Client → CDN → Origin',
    level2: 'The CDN sits between users and origin, caching content at global edges',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 3: Add Backup CDN (Multi-CDN Strategy)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💥',
  scenario: "3 AM. Your CDN provider is having a major outage in Asia-Pacific!",
  hook: "Millions of Asian users can't access your content. The CDN edge servers are unreachable. Your site is effectively down in that region.",
  challenge: "Add a second CDN provider as backup. When primary fails, automatically route to secondary.",
  illustration: 'cdn-outage',
};

const step3Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Multi-CDN protection enabled!',
  achievement: 'System survives single CDN failure',
  metrics: [
    { label: 'CDN redundancy', before: 'Single provider', after: 'Multi-CDN' },
    { label: 'Availability', before: '99.9%', after: '99.99%' },
    { label: 'Vendor lock-in', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "But how do we intelligently route between CDNs?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-CDN Strategy: Never Rely on One Provider',
  conceptExplanation: `Using multiple CDN providers provides:

**1. Redundancy**
- If CloudFront fails → route to Fastly
- If Fastly is slow in Europe → route to Cloudflare
- No single point of failure

**2. Performance Optimization**
- CDN-A might be faster in Asia
- CDN-B might be faster in Europe
- Route to best-performing CDN per region

**3. Cost Optimization**
- Compare pricing between providers
- Route less critical traffic to cheaper CDN
- Negotiate better rates with multiple vendors

**4. Geographic Coverage**
- Cloudflare: Strong in Asia
- Fastly: Strong in North America
- Akamai: Strong in Europe
- Use each CDN where it excels

**Multi-CDN Architecture:**
- Primary CDN handles 80% of traffic
- Secondary CDN is hot standby
- Load balancer routes based on health/performance`,

  whyItMatters: 'Single CDN creates vendor lock-in and single point of failure. Multi-CDN is standard for mission-critical services.',

  famousIncident: {
    title: 'AWS CloudFront Outage',
    company: 'AWS CloudFront',
    year: '2020',
    whatHappened: 'CloudFront suffered a major outage affecting AWS us-east-1. Thousands of websites relying solely on CloudFront went down. Companies with multi-CDN strategies automatically failed over to Fastly/Cloudflare and stayed online.',
    lessonLearned: 'Multi-CDN isn\'t luxury - it\'s necessity for 99.99%+ availability. The cost of an outage exceeds the cost of multi-CDN.',
    icon: '☁️',
  },

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Delivering music globally',
    howTheyDoIt: 'Uses multi-CDN with Cloudflare, Fastly, and Akamai. Smart DNS routing directs users to best-performing CDN based on location and real-time health checks.',
  },

  keyPoints: [
    'Single CDN = single point of failure',
    'Multi-CDN provides redundancy and better global coverage',
    'Primary CDN handles most traffic, backup ready for failover',
    'Different CDNs excel in different regions',
    'Load balancer or DNS routes between CDNs',
  ],

  diagram: `
                   ┌─────────────────┐
                   │  DNS / Traffic  │
                   │     Router      │
                   └────────┬────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │   CDN Primary    │        │  CDN Secondary   │
    │  (CloudFront)    │        │    (Fastly)      │
    │                  │        │                  │
    │ 80% traffic      │        │ Failover/backup  │
    └────────┬─────────┘        └────────┬─────────┘
             │                           │
             └──────────┬────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │    Origin     │
                │  (S3/Storage) │
                └───────────────┘
`,

  quickCheck: {
    question: 'What is the main benefit of multi-CDN strategy?',
    options: [
      'It\'s cheaper than single CDN',
      'It\'s easier to configure',
      'Eliminates single point of failure and improves global coverage',
      'Doubles your bandwidth automatically',
    ],
    correctIndex: 2,
    explanation: 'Multi-CDN provides redundancy (failover when one fails) and better geographic coverage (use best CDN per region).',
  },

  keyConcepts: [
    { title: 'Primary CDN', explanation: 'Main CDN handling most traffic', icon: '1️⃣' },
    { title: 'Secondary CDN', explanation: 'Backup CDN for failover', icon: '2️⃣' },
    { title: 'Failover', explanation: 'Automatic switch to backup on primary failure', icon: '🔄' },
    { title: 'Vendor Lock-in', explanation: 'Dependency on single provider', icon: '🔒' },
  ],
};

const step3: GuidedStep = {
  id: 'hybrid-cdn-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Multi-CDN for redundancy and avoiding vendor lock-in',
    taskDescription: 'Add a second CDN as backup',
    componentsNeeded: [
      { type: 'cdn', reason: 'Secondary CDN for failover', displayName: 'CDN-2 (Fastly)' },
    ],
    successCriteria: [
      'Second CDN component added',
      'Both CDNs connected to Origin',
      'Client can route to either CDN',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cdn', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    minimumComponentCount: { cdn: 2 },
  },

  hints: {
    level1: 'Add a second CDN component for redundancy',
    level2: 'Both CDNs should connect to the same Origin. Client can route to either CDN for failover.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Load Balancer for Smart Routing
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🎯',
  scenario: "You now have two CDNs, but routing is manual and static!",
  hook: "Engineers are manually updating DNS records when a CDN has issues. By the time they notice and react, users have been experiencing errors for 10 minutes.",
  challenge: "Add intelligent routing that automatically detects failures and routes to the healthy CDN.",
  illustration: 'manual-failover',
};

const step4Celebration: CelebrationContent = {
  emoji: '🚦',
  message: 'Intelligent routing activated!',
  achievement: 'Automatic failover and load distribution',
  metrics: [
    { label: 'Failover time', before: '10+ minutes (manual)', after: '5 seconds (auto)' },
    { label: 'Health monitoring', after: 'Active' },
    { label: 'Load distribution', after: 'Balanced' },
  ],
  nextTeaser: "But the origin is still getting hammered during cache misses...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Dynamic Routing: Smart Traffic Distribution',
  conceptExplanation: `A **Load Balancer** or **Traffic Manager** intelligently routes users to the best CDN.

**Routing strategies:**

**1. Health-based routing**
- Continuously ping each CDN
- If CDN-A fails health check → route all traffic to CDN-B
- When CDN-A recovers → gradually shift traffic back

**2. Performance-based routing**
- Measure latency to each CDN
- Route to fastest CDN for each user's location
- If CDN-A is slow today → shift to CDN-B

**3. Geographic routing**
- US users → CDN-A (best in North America)
- EU users → CDN-B (best in Europe)
- Asia users → CDN-C (best in Asia)

**4. Cost-based routing**
- Route expensive bandwidth to cheaper CDN
- Keep critical traffic on premium CDN

**Implementation:**
- DNS-based: Update DNS records dynamically (slower, 60s+ TTL)
- Anycast: Multiple CDNs share same IP (faster, network-level)
- Client-side: App chooses CDN (most control, complex)`,

  whyItMatters: 'Static routing can\'t adapt to failures or performance changes. Dynamic routing provides automatic failover and optimization.',

  famousIncident: {
    title: 'Dyn DNS DDoS Attack',
    company: 'Dyn DNS',
    year: '2016',
    whatHappened: 'Massive DDoS attack on Dyn DNS took down Twitter, Netflix, Reddit, GitHub. Companies relying on Dyn for DNS-based CDN routing were offline for hours. Those with backup DNS providers or Anycast routing stayed online.',
    lessonLearned: 'DNS itself can be a single point of failure. Use multiple DNS providers and consider Anycast for critical services.',
    icon: '🎯',
  },

  realWorldExample: {
    company: 'GitHub',
    scenario: 'Global traffic distribution',
    howTheyDoIt: 'Uses Fastly with Anycast. Users connect to nearest POP automatically. Health checks monitor each edge. If edge fails, traffic reroutes in seconds via BGP.',
  },

  keyPoints: [
    'Health checks detect failures automatically',
    'Performance monitoring routes to fastest CDN',
    'Geographic routing optimizes per-region performance',
    'Failover happens in seconds, not minutes',
    'Load balancer eliminates manual intervention',
  ],

  diagram: `
┌────────────┐
│   Client   │
└──────┬─────┘
       │
       ▼
┌─────────────────────┐
│   Load Balancer     │
│  (Traffic Manager)  │
│                     │
│ - Health checks     │
│ - Latency monitor   │
│ - Geo routing       │
└──────┬──────────────┘
       │
   ┌───┴────┐
   ▼        ▼
┌──────┐  ┌──────┐
│CDN-A │  │CDN-B │
│ ✓OK  │  │ ✓OK  │
└──┬───┘  └──┬───┘
   │         │
   └────┬────┘
        ▼
   ┌─────────┐
   │ Origin  │
   └─────────┘
`,

  quickCheck: {
    question: 'Why is automatic failover better than manual DNS updates?',
    options: [
      'It\'s cheaper',
      'It requires less configuration',
      'It responds in seconds instead of minutes, reducing downtime',
      'It uses less bandwidth',
    ],
    correctIndex: 2,
    explanation: 'Manual failover requires human detection, decision, and DNS update (10+ min). Automatic failover detects and responds in seconds.',
  },

  keyConcepts: [
    { title: 'Health Check', explanation: 'Automated monitoring of CDN availability', icon: '💓' },
    { title: 'Failover Time', explanation: 'How fast system switches to backup', icon: '⏱️' },
    { title: 'Anycast', explanation: 'Multiple servers share one IP, network routes to nearest', icon: '📡' },
    { title: 'BGP', explanation: 'Border Gateway Protocol - routes internet traffic', icon: '🌐' },
  ],
};

const step4: GuidedStep = {
  id: 'hybrid-cdn-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3 & FR-5: Automatic failover and dynamic routing',
    taskDescription: 'Add Load Balancer to intelligently route between CDNs',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Smart routing with health checks', displayName: 'Traffic Manager' },
    ],
    successCriteria: [
      'Load Balancer added between Client and CDNs',
      'Load Balancer connected to both CDNs',
      'Client connected to Load Balancer',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cdn', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
    ],
    minimumComponentCount: { cdn: 2 },
  },

  hints: {
    level1: 'Add Load Balancer between Client and the two CDNs',
    level2: 'Connect: Client → Load Balancer → Both CDNs → Origin',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'cdn' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Origin Shield
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Your origin servers are being hammered!",
  hook: "You have 500 CDN edge locations. When cache expires, ALL 500 edges simultaneously request the same file from origin. This thundering herd is crushing your origin!",
  challenge: "Add origin shielding - a dedicated cache layer between CDN edges and origin to absorb the load.",
  illustration: 'origin-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Origin protected with shielding!',
  achievement: 'Origin load reduced by 95%',
  metrics: [
    { label: 'Origin requests', before: '50,000/sec', after: '2,500/sec' },
    { label: 'Origin CPU', before: '95%', after: '20%' },
    { label: 'Cost savings', after: '70% reduction' },
  ],
  nextTeaser: "Almost there! Let's add caching for frequently accessed data...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Origin Shielding: Protecting Your Backend',
  conceptExplanation: `**The Problem: Cache Stampede**

Without origin shielding:
- 500 CDN edges cache logo.png for 1 hour
- After 1 hour, cache expires on all 500 edges
- Next request triggers 500 simultaneous origin fetches
- Origin gets crushed by thundering herd

**The Solution: Origin Shield**

A shield is an intermediate cache between CDN edges and origin:
- CDN edges fetch from shield, not origin
- Only shield fetches from origin
- 500 edge requests → 1 shield request → origin

**Architecture:**
\`\`\`
Edge 1 ──┐
Edge 2 ──┤
Edge 3 ──┼──→ Shield Cache ──→ Origin
...      │
Edge 500─┘
\`\`\`

**Benefits:**
1. **Reduces origin load 95%+**: 500 edges → 1 shield
2. **Prevents thundering herd**: Shield coalesces requests
3. **Faster cache fills**: Shield is closer to edges than origin
4. **Cost savings**: Less origin bandwidth and compute

**Best Practices:**
- Place shield in same region as origin (low latency)
- Use large shield cache (reduce origin hits)
- Shield TTL > Edge TTL (prevent simultaneous expiry)`,

  whyItMatters: 'Without origin shielding, CDN edges can overwhelm origin with cache-fill requests. Shield reduces origin load by 95%.',

  famousIncident: {
    title: 'Cloudflare Origin Overload',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A configuration error disabled origin shielding for several customers. Their origin servers were suddenly hit by requests from 200+ Cloudflare edges instead of a few shield servers. Several origin servers crashed under the load.',
    lessonLearned: 'Origin shielding isn\'t optional at CDN scale. Always shield origin from edge stampedes.',
    icon: '⚡',
  },

  realWorldExample: {
    company: 'Akamai',
    scenario: 'Protecting origin from edge cache misses',
    howTheyDoIt: 'Uses tiered caching: Edge → Regional Cache → Origin. Regional cache acts as shield, reducing origin requests by 90%+.',
  },

  keyPoints: [
    'Shield sits between CDN edges and origin',
    'Reduces origin requests from N edges to 1 shield',
    'Prevents cache stampede (thundering herd)',
    'Shield is a specialized cache optimized for high hit rate',
    'Place shield near origin for low latency',
  ],

  diagram: `
WITHOUT SHIELD (Bad):
┌────┐ ┌────┐ ┌────┐     ┌────────┐
│Edg1│ │Edg2│ │Edg3│ ──▶ │ Origin │ ← 500 requests!
└────┘ └────┘ └────┘     └────────┘
  ...    ...    ...
┌────┐ ┌────┐ ┌────┐
│E498│ │E499│ │E500│ ──▶

WITH SHIELD (Good):
┌────┐ ┌────┐ ┌────┐
│Edg1│ │Edg2│ │Edg3│ ──┐
└────┘ └────┘ └────┘   │
  ...    ...    ...    ▼
┌────┐ ┌────┐ ┌────┐ ┌────────┐  ┌────────┐
│E498│ │E499│ │E500│─▶│ Shield │─▶│ Origin │ ← 1 request
└────┘ └────┘ └────┘ └────────┘  └────────┘
`,

  quickCheck: {
    question: 'How does origin shielding reduce origin load?',
    options: [
      'It compresses files before sending',
      'It caches requests from all edges, so only shield fetches from origin',
      'It uses faster network connections',
      'It reduces file sizes automatically',
    ],
    correctIndex: 1,
    explanation: 'Shield consolidates requests from hundreds of edges into a single request to origin, reducing load by 95%+.',
  },

  keyConcepts: [
    { title: 'Origin Shield', explanation: 'Intermediate cache protecting origin', icon: '🛡️' },
    { title: 'Thundering Herd', explanation: 'Many simultaneous requests overwhelming server', icon: '🐘' },
    { title: 'Request Coalescing', explanation: 'Combining multiple requests into one', icon: '🔗' },
    { title: 'Tiered Caching', explanation: 'Multiple cache layers: Edge → Shield → Origin', icon: '📊' },
  ],
};

const step5: GuidedStep = {
  id: 'hybrid-cdn-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Origin shielding to reduce backend load',
    taskDescription: 'Add Cache (Shield) between CDNs and Origin',
    componentsNeeded: [
      { type: 'cache', reason: 'Origin shield to protect backend', displayName: 'Shield Cache' },
    ],
    successCriteria: [
      'Cache component added as shield',
      'Both CDNs connected to Shield',
      'Shield connected to Origin',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cdn', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
    ],
    minimumComponentCount: { cdn: 2 },
  },

  hints: {
    level1: 'Add Cache component between CDNs and Origin as a shield layer',
    level2: 'Connect: CDNs → Shield Cache → Origin. This reduces origin load by consolidating edge requests.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'cdn', to: 'cache' },
      { from: 'cache', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Metadata Cache for API Responses
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "CDN is great for static files, but what about API responses?",
  hook: "Users are requesting /api/trending-videos thousands of times per second. This list changes every 5 minutes but we're recomputing it on every request!",
  challenge: "Add a metadata cache for frequently accessed API data and computed results.",
  illustration: 'api-cache',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'API responses cached efficiently!',
  achievement: 'Metadata cache reduces compute load',
  metrics: [
    { label: 'API latency', before: '200ms', after: '5ms' },
    { label: 'Database queries', before: '10K/sec', after: '100/sec' },
    { label: 'Cache hit rate', after: '98%' },
  ],
  nextTeaser: "Perfect! Now let's make sure database is replicated...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Metadata Caching: Beyond Static Files',
  conceptExplanation: `CDN caches static files (images, videos, CSS). But what about dynamic data?

**Use cases for metadata cache:**

1. **API responses**
   - /api/trending → updated every 5 min
   - /api/user/123/profile → rarely changes
   - Cache with appropriate TTL

2. **Computed results**
   - Video recommendations (compute-heavy)
   - Search results for common queries
   - Leaderboards and rankings

3. **Database query results**
   - Popular product listings
   - Category pages
   - User session data

**Cache Strategy:**
- **Short TTL (1-5 min)**: Frequently changing data
- **Long TTL (1 hour+)**: Rarely changing data
- **Cache-Control headers**: Let CDN know what to cache

**Architecture:**
\`\`\`
User → CDN (static files)
     ↓
App Server → Metadata Cache (Redis) → Database
\`\`\`

CDN handles static files, Redis caches API/DB responses.`,

  whyItMatters: 'APIs can be read-heavy like static files. Caching API responses reduces database load and latency.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Caching timeline data',
    howTheyDoIt: 'User timelines cached in Redis. Tweet rendering computed once, cached, served to millions. Cache hit rate > 99%.',
  },

  keyPoints: [
    'CDN caches static files, Redis/Memcached cache API data',
    'Set TTL based on data change frequency',
    'Invalidate cache when data changes',
    'Cache-Control headers guide CDN caching',
    'Reduces database load by 90%+',
  ],

  keyConcepts: [
    { title: 'Metadata Cache', explanation: 'Cache for API responses and computed data', icon: '💾' },
    { title: 'TTL Strategy', explanation: 'Cache duration based on data freshness', icon: '⏰' },
    { title: 'Cache-Control', explanation: 'HTTP headers controlling cache behavior', icon: '🎛️' },
  ],
};

const step6: GuidedStep = {
  id: 'hybrid-cdn-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'Cache API responses and metadata efficiently',
    taskDescription: 'Add App Server, Database, and Metadata Cache for API handling',
    componentsNeeded: [
      { type: 'app_server', reason: 'Handles API requests', displayName: 'App Server' },
      { type: 'cache', reason: 'Metadata cache for API responses', displayName: 'Metadata Cache (Redis)' },
      { type: 'database', reason: 'Stores metadata', displayName: 'Database' },
    ],
    successCriteria: [
      'App Server added',
      'Metadata Cache added',
      'Database added',
      'App Server → Metadata Cache → Database connected',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cdn', 'cache', 'object_storage', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    minimumComponentCount: { cdn: 2, cache: 2 },
  },

  hints: {
    level1: 'Add App Server, Metadata Cache, and Database for API handling',
    level2: 'Build the API path: App Server → Metadata Cache → Database, separate from the CDN path',
    solutionComponents: [{ type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Database Replication for High Availability
// =============================================================================

const step7Story: StoryContent = {
  emoji: '💥',
  scenario: "The database just crashed during peak traffic!",
  hook: "All metadata is gone. Content catalog is offline. Users can't browse or search. This is a disaster!",
  challenge: "Add database replication so a backup is always ready to take over.",
  illustration: 'database-failure',
};

const step7Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Database is now highly available!',
  achievement: 'Automatic failover for database',
  metrics: [
    { label: 'Database availability', before: '99%', after: '99.99%' },
    { label: 'Failover time', after: '< 30 seconds' },
    { label: 'Data redundancy', after: '2+ replicas' },
  ],
  nextTeaser: "Excellent! Final step: optimize the complete system...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for Fault Tolerance',
  conceptExplanation: `Database replication creates copies of your data on multiple servers.

**Single Leader Replication (best for most cases):**
- **Primary**: Handles all writes
- **Replicas**: Handle reads, stay synchronized
- If primary fails → promote replica to primary

**Benefits:**
1. **High Availability**: Survive database server failures
2. **Read Scaling**: Distribute reads across replicas
3. **Disaster Recovery**: Data exists on multiple servers
4. **Zero Data Loss**: Synchronous replication option

**Hybrid CDN Use Case:**
- Metadata must be highly available
- Content catalog, user data, configuration
- Replicas in different availability zones
- Automatic failover in < 30 seconds`,

  whyItMatters: 'Database failure without replication means total system outage. Replication ensures continuity.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Cassandra for metadata',
    howTheyDoIt: '3-way replication across availability zones. Quorum reads/writes ensure consistency. Survives AZ failures gracefully.',
  },

  keyPoints: [
    'Primary handles writes, replicas handle reads',
    'Automatic failover when primary fails',
    'Place replicas in different availability zones',
    'Synchronous replication = zero data loss',
    'Asynchronous replication = better performance',
  ],

  keyConcepts: [
    { title: 'Primary', explanation: 'Database accepting writes', icon: '👑' },
    { title: 'Replica', explanation: 'Read-only copy synchronized with primary', icon: '📋' },
    { title: 'Failover', explanation: 'Promoting replica when primary fails', icon: '🔄' },
    { title: 'Replication Lag', explanation: 'Delay between primary write and replica sync', icon: '⏱️' },
  ],
};

const step7: GuidedStep = {
  id: 'hybrid-cdn-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'Database must survive failures with automatic failover',
    taskDescription: 'Enable database replication for high availability',
    successCriteria: [
      'Click Database component',
      'Enable replication with 2+ replicas',
      'Verify complete architecture is connected',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cdn', 'cache', 'object_storage', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
      { fromType: 'app_server', to: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    minimumComponentCount: { cdn: 2, cache: 2 },
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click on Database and enable replication with 2+ replicas',
    level2: 'Find replication settings in Database configuration and set replicas to 2 or more',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Final Optimization - Complete Hybrid CDN System
// =============================================================================

const step8Story: StoryContent = {
  emoji: '🎯',
  scenario: "Time to complete the hybrid CDN architecture!",
  hook: "You've built all the components. Now optimize the complete system for global scale, resilience, and performance.",
  challenge: "Review and optimize: Multi-CDN, origin shielding, metadata caching, database replication, intelligent routing.",
  illustration: 'final-optimization',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Hybrid CDN system complete!',
  achievement: 'Production-ready global content delivery',
  metrics: [
    { label: 'Global latency p99', after: '< 100ms' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Origin load reduction', after: '95%' },
    { label: 'CDN redundancy', after: 'Multi-CDN' },
    { label: 'Failover time', after: '< 5 seconds' },
  ],
  nextTeaser: "Congratulations! You've mastered hybrid CDN architecture!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Complete Hybrid CDN Architecture',
  conceptExplanation: `Your complete system now includes:

**Content Delivery Path:**
1. Client → Load Balancer (intelligent routing)
2. Load Balancer → CDN-1 or CDN-2 (health-based)
3. CDN → Origin Shield (reduces origin load)
4. Shield → Origin Storage (master content)

**API/Metadata Path:**
1. Client → App Server
2. App Server → Metadata Cache (Redis)
3. Cache miss → Database (replicated)

**Key Features:**
- ✅ Multi-CDN redundancy (no vendor lock-in)
- ✅ Automatic failover (< 5 sec)
- ✅ Origin shielding (95% load reduction)
- ✅ Metadata caching (API performance)
- ✅ Database replication (HA)
- ✅ Global edge locations (< 100ms latency)

**Trade-offs Handled:**
- Performance vs Cost: Aggressive caching reduces origin costs
- Availability vs Complexity: Multi-CDN adds complexity but ensures uptime
- Consistency vs Latency: Cache TTLs balance freshness with speed

**Monitoring & Operations:**
- Health checks on both CDNs
- Origin shield hit rate monitoring
- Cache invalidation across all CDNs
- Failover testing (chaos engineering)`,

  whyItMatters: 'This architecture handles billions of requests per day with high availability and low latency globally.',

  realWorldExample: {
    company: 'LinkedIn',
    scenario: 'Serving profiles and content globally',
    howTheyDoIt: 'Multi-CDN (Cloudflare + Fastly), origin shielding, aggressive metadata caching. 99.99% availability, < 100ms p99 latency worldwide.',
  },

  keyPoints: [
    'Multi-CDN eliminates single points of failure',
    'Origin shielding protects backend from edge stampedes',
    'Metadata cache reduces database load for API calls',
    'Database replication ensures data availability',
    'Smart routing adapts to failures and performance changes',
  ],

  diagram: `
                    ┌──────────┐
                    │  Client  │
                    └────┬─────┘
                         │
                    ┌────▼────────┐
                    │Load Balancer│
                    │  (Health +  │
                    │ Geo Routing)│
                    └─────┬───────┘
                ┌─────────┴─────────┐
                │                   │
           ┌────▼─────┐       ┌────▼─────┐
           │  CDN-1   │       │  CDN-2   │
           │(Primary) │       │(Backup)  │
           └────┬─────┘       └────┬─────┘
                └─────────┬─────────┘
                          │
                    ┌─────▼──────┐
                    │   Shield   │
                    │   Cache    │
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │   Origin   │
                    │  Storage   │
                    └────────────┘

         ┌─────────────────────────────┐
         │    API/Metadata Path:       │
         │  App Server → Cache → DB    │
         │     (Replicated DB)         │
         └─────────────────────────────┘
`,

  quickCheck: {
    question: 'What is the most critical component for 99.99% availability?',
    options: [
      'Faster CDN servers',
      'More bandwidth',
      'Multi-CDN with automatic failover',
      'Larger cache sizes',
    ],
    correctIndex: 2,
    explanation: 'Multi-CDN with automatic failover eliminates single points of failure, ensuring service continues even when one CDN has issues.',
  },

  keyConcepts: [
    { title: 'Hybrid CDN', explanation: 'Multiple CDN providers working together', icon: '🔀' },
    { title: 'Edge-First', explanation: 'Serve from edge whenever possible', icon: '📍' },
    { title: 'Defense in Depth', explanation: 'Multiple layers of caching and redundancy', icon: '🛡️' },
    { title: 'Graceful Degradation', explanation: 'System degrades but doesn\'t fail completely', icon: '📉' },
  ],
};

const step8: GuidedStep = {
  id: 'hybrid-cdn-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'Complete hybrid CDN system with all optimizations',
    taskDescription: 'Verify complete architecture: Multi-CDN, shielding, caching, replication, routing',
    successCriteria: [
      'Load Balancer routes to multiple CDNs',
      'Origin shield protects backend',
      'Metadata cache for API performance',
      'Database replication enabled',
      'All components properly connected',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cdn', 'cache', 'object_storage', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    minimumComponentCount: { cdn: 2, cache: 2 },
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Ensure all components are present and properly connected',
    level2: 'Complete architecture should have: Client → LB → 2 CDNs → Shield → Origin, plus App Server → Metadata Cache → Replicated DB',
    solutionComponents: [
      { type: 'client' },
      { type: 'load_balancer' },
      { type: 'cdn' },
      { type: 'cdn' },
      { type: 'cache' },
      { type: 'object_storage' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'cdn' },
      { from: 'cdn', to: 'cache' },
      { from: 'cache', to: 'object_storage' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const hybridCdnCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'hybrid-cdn-cache',
  title: 'Design Hybrid CDN Cache System',
  description: 'Build a multi-CDN content delivery system with origin shielding, automatic failover, and dynamic routing',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🌐',
    hook: "You've been hired as CDN Architect at GlobalStream!",
    scenario: "Your mission: Build a hybrid CDN system that delivers content to 100 million users globally with 99.99% availability and < 100ms latency.",
    challenge: "Can you design a system that survives CDN outages, protects your origin, and routes intelligently?",
  },

  requirementsPhase: hybridCdnRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'CDN Edge Caching',
    'Multi-CDN Strategy',
    'Automatic Failover',
    'Origin Shielding',
    'Dynamic Routing',
    'Geographic Distribution',
    'Metadata Caching',
    'Database Replication',
    'Health Monitoring',
    'Graceful Degradation',
    'Request Coalescing',
    'Cache Stampede Prevention',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 8: Distributed System Troubles',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default hybridCdnCacheGuidedTutorial;
