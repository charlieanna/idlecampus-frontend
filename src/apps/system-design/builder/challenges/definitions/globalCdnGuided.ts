import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Global CDN Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching global content delivery through
 * building a multi-region CDN architecture.
 *
 * Key Concepts:
 * - Multi-region CDN deployment
 * - Anycast routing
 * - Origin selection strategies
 * - Cache hierarchy (edge, regional, origin)
 * - Geographic load balancing
 * - Cache warming and invalidation
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const globalCdnRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a global CDN for delivering static content worldwide",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Senior Infrastructure Architect at CloudScale',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-content-delivery',
      category: 'functional',
      question: "What type of content does this CDN need to deliver?",
      answer: "The CDN delivers static content: images, videos, JavaScript files, CSS, and HTML pages. Think of serving a news website's images or a streaming platform's video files to users around the world.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "CDNs optimize delivery of static content that doesn't change per user",
    },
    {
      id: 'global-reach',
      category: 'functional',
      question: "What geographic coverage do we need?",
      answer: "Global coverage across all continents. Users in Tokyo, London, New York, Sydney, and Mumbai should all get fast content delivery. We need edge locations in at least 50+ cities worldwide.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Global CDN means serving users from nearby edge locations, not a single origin",
    },
    {
      id: 'cache-invalidation',
      category: 'functional',
      question: "What happens when content is updated at the origin?",
      answer: "We need cache invalidation. When a website updates their logo.png, all edge servers should serve the new version within 60 seconds. This can be done via purge requests or TTL expiration.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Cache invalidation ensures fresh content reaches users quickly",
    },
    {
      id: 'origin-failover',
      category: 'functional',
      question: "What if the origin server goes down?",
      answer: "The CDN should serve stale content from cache temporarily and fail over to a backup origin. Better to serve slightly old content than show errors to users.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "CDNs provide resilience when origin servers fail",
    },
    {
      id: 'dynamic-content',
      category: 'clarification',
      question: "Do we need to handle dynamic or personalized content?",
      answer: "Not for this design. We're focusing on static content that's the same for all users. Dynamic content acceleration is a v2 feature.",
      importance: 'nice-to-have',
      insight: "Static CDN is simpler - no need for edge compute or user-specific caching",
    },
    {
      id: 'https-tls',
      category: 'clarification',
      question: "Do we need HTTPS/TLS termination at the edge?",
      answer: "Yes, edge servers should terminate TLS connections. This reduces latency for the SSL handshake. Origin communication can be over HTTP internally.",
      importance: 'important',
      insight: "TLS termination at edge reduces latency and offloads crypto from origin",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests per second should the CDN handle?",
      answer: "10 million requests per second globally at peak. This includes cache hits and misses across all edge locations.",
      importance: 'critical',
      learningPoint: "CDNs handle massive scale by distributing load across edge locations",
    },
    {
      id: 'throughput-bandwidth',
      category: 'throughput',
      question: "What's the bandwidth requirement?",
      answer: "About 100 Terabits per second aggregate across all edges at peak. Individual files range from 10KB (images) to 100MB (video chunks).",
      importance: 'critical',
      calculation: {
        formula: "10M req/s × 10MB avg = 100 Tbps",
        result: "~100 Tbps aggregate bandwidth",
      },
      learningPoint: "CDN bandwidth scales with number of edge locations",
    },
    {
      id: 'cache-hit-ratio',
      category: 'throughput',
      question: "What cache hit ratio should we target?",
      answer: "95%+ cache hit ratio at the edge. Only 5% of requests should hit the origin. This dramatically reduces origin load and improves latency.",
      importance: 'critical',
      calculation: {
        formula: "10M req/s × 5% miss rate = 500K origin req/s",
        result: "500K requests/sec to origin with 95% hit ratio",
      },
      learningPoint: "High cache hit ratio is essential for CDN performance and cost",
    },
    {
      id: 'latency-edge',
      category: 'latency',
      question: "What latency should users experience?",
      answer: "p99 under 50ms for cache hits. Users should be within 50ms round-trip time of an edge location. This means edge servers in major cities worldwide.",
      importance: 'critical',
      learningPoint: "Low latency requires edge locations close to users",
    },
    {
      id: 'latency-origin',
      category: 'latency',
      question: "What about cache misses that need to fetch from origin?",
      answer: "p99 under 500ms for cache misses. This includes fetching from origin, storing in edge cache, and returning to user.",
      importance: 'important',
      learningPoint: "Cache misses are slower but should still be acceptable",
    },
    {
      id: 'storage-capacity',
      category: 'payload',
      question: "How much content needs to be cached at each edge?",
      answer: "Each edge location should cache the hottest 10TB of content. Total global content is around 1PB, but only popular content gets cached at edges.",
      importance: 'important',
      calculation: {
        formula: "50 edge locations × 10TB each = 500TB edge cache",
        result: "~500TB cached across all edges",
      },
      learningPoint: "Not all content is cached everywhere - only popular content at edges",
    },
    {
      id: 'availability-requirement',
      category: 'availability',
      question: "What's the uptime requirement?",
      answer: "99.99% availability per region. Even if one region fails, others should continue serving traffic. Global availability should be 99.999%.",
      importance: 'critical',
      learningPoint: "Multi-region deployment provides higher availability than single region",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-content-delivery', 'global-reach', 'cache-invalidation'],
  criticalFRQuestionIds: ['core-content-delivery', 'global-reach', 'cache-invalidation'],
  criticalScaleQuestionIds: ['throughput-requests', 'cache-hit-ratio', 'latency-edge', 'availability-requirement'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Deliver static content globally',
      description: 'Serve images, videos, JS, CSS, HTML to users worldwide',
      emoji: '🌍',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Low-latency delivery from nearby edges',
      description: 'Users get content from edge servers within 50ms',
      emoji: '⚡',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Cache invalidation support',
      description: 'Updated content propagates to edges within 60 seconds',
      emoji: '🔄',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Origin failover capability',
      description: 'Serve stale content and fail over when origin is down',
      emoji: '🛡️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 billion users globally',
    writesPerDay: 'Minimal (cache invalidations)',
    readsPerDay: '10 million requests/second peak',
    peakMultiplier: 2,
    readWriteRatio: '10000:1',
    calculatedWriteRPS: { average: 100, peak: 200 },
    calculatedReadRPS: { average: 5000000, peak: 10000000 },
    maxPayloadSize: '~100MB (video chunks)',
    storagePerRecord: '~1MB avg per file',
    storageGrowthPerYear: '~100TB new content',
    redirectLatencySLA: 'p99 < 50ms (cache hit)',
    createLatencySLA: 'p99 < 500ms (cache miss)',
  },

  architecturalImplications: [
    '✅ 10M req/s → Must distribute across 50+ edge locations',
    '✅ 50ms latency SLA → Edge servers in every major city',
    '✅ 95% cache hit ratio → Aggressive caching at edge',
    '✅ 99.99% availability → Multi-region with failover',
    '✅ Global users → Anycast routing to nearest edge',
    '✅ Cache invalidation → Need cache hierarchy and purge mechanism',
  ],

  outOfScope: [
    'Dynamic content acceleration',
    'Edge compute/serverless functions',
    'Video streaming protocols (HLS/DASH)',
    'DDoS protection',
    'Web Application Firewall',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple client-to-origin flow, then add CDN edges for global delivery. The complexity of cache hierarchy, anycast, and multi-region failover comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Origin Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌐',
  scenario: "Welcome to CloudScale! You're building a global CDN from scratch.",
  hook: "Your first customer needs to serve their website images to users worldwide.",
  challenge: "Set up the basic flow: client requests content from the origin server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Content delivery is working!',
  achievement: 'Users can fetch content from the origin server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Content delivery', after: '✓' },
  ],
  nextTeaser: "But users far away are experiencing 500ms latency...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Content Delivery Basics: Origin Server',
  conceptExplanation: `Every CDN starts with an **Origin Server** - where the original content lives.

When a user requests an image:
1. Their browser (Client) sends a request
2. The request goes to the Origin Server
3. Origin returns the image file
4. Client displays the image

**The problem**: If your origin is in Virginia but users are in Tokyo, they experience:
- 200ms+ network latency
- Slow download speeds
- Origin server overload

This is why we need a CDN!`,

  whyItMatters: 'Without a CDN, all users hit the same origin server, causing slow delivery and server overload.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving content globally',
    howTheyDoIt: 'Started with origin servers, now has 275+ edge locations worldwide serving content within 50ms of 95% of internet users',
  },

  keyPoints: [
    'Origin server holds the source of truth for all content',
    'Direct origin access is slow for distant users',
    'Origin can become a bottleneck under high load',
  ],

  keyConcepts: [
    { title: 'Origin', explanation: 'Source server holding original content', icon: '🏢' },
    { title: 'Latency', explanation: 'Time for request to travel to server and back', icon: '⏱️' },
    { title: 'Client', explanation: 'User\'s browser requesting content', icon: '💻' },
  ],
};

const step1: GuidedStep = {
  id: 'globalcdn-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for content delivery',
    taskDescription: 'Add a Client and Origin Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users requesting content', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as origin server for content', displayName: 'Origin Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'Origin Server component added to canvas',
      'Client connected to Origin Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and Origin Server (App Server) onto the canvas',
    level2: 'Click the Client, then click the Origin Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Object Storage for Content
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📦',
  scenario: "Your customer wants to serve 1TB of images and videos!",
  hook: "The origin server can't store that much on local disk. We need scalable storage!",
  challenge: "Add object storage (like S3) to hold all the content files.",
  illustration: 'storage-scale',
};

const step2Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Unlimited storage capacity!',
  achievement: 'Content now stored in scalable object storage',
  metrics: [
    { label: 'Storage capacity', after: 'Unlimited (S3)' },
    { label: 'Files stored', after: '1TB+' },
  ],
  nextTeaser: "But fetching from S3 for every request is still slow for distant users...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: Scalable Content Repository',
  conceptExplanation: `**Object Storage** (like AWS S3, Google Cloud Storage) is designed for storing massive amounts of static files:

- Virtually unlimited capacity
- Pay only for what you use
- Built-in redundancy (99.999999999% durability)
- HTTP/HTTPS access via URLs

**Architecture**:
- **Origin Server**: Handles requests, generates signed URLs
- **Object Storage**: Stores actual content files
- Origin can serve directly from storage or cache locally

For a CDN, object storage becomes the "source of truth" for all content.`,

  whyItMatters: 'Object storage provides unlimited capacity and durability for petabytes of content at a fraction of server disk cost.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Storing 1+ Petabyte of video content',
    howTheyDoIt: 'Uses AWS S3 for origin storage, with content replicated across regions. CDN edges cache popular content.',
  },

  keyPoints: [
    'Object storage holds all content files (images, videos, documents)',
    'Origin server fetches from object storage as needed',
    'Much cheaper than server disk at petabyte scale',
    'Content organized in buckets with unique URLs',
  ],

  keyConcepts: [
    { title: 'Object Storage', explanation: 'Scalable file storage (S3, GCS, Azure Blob)', icon: '📦' },
    { title: 'Bucket', explanation: 'Container for organizing files', icon: '🗂️' },
    { title: 'Durability', explanation: 'Files won\'t be lost (11 nines for S3)', icon: '🛡️' },
  ],
};

const step2: GuidedStep = {
  id: 'globalcdn-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Store and deliver content at scale',
    taskDescription: 'Add Object Storage and connect Origin Server to it',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Stores all content files at scale', displayName: 'Object Storage (S3)' },
    ],
    successCriteria: [
      'Object Storage component added',
      'Origin Server connected to Object Storage',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Object Storage and connect Origin Server to it',
    level2: 'Drag Object Storage onto canvas, then connect Origin Server → Object Storage',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 3: Add First CDN Edge - Single Region
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Europe are complaining about 400ms latency to your US origin!",
  hook: "Every request crosses the Atlantic Ocean. Downloads are painfully slow.",
  challenge: "Add your first CDN edge location in Europe to serve content locally.",
  illustration: 'global-latency',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'European users now get 50ms latency!',
  achievement: 'First edge location deployed successfully',
  metrics: [
    { label: 'EU latency', before: '400ms', after: '50ms' },
    { label: 'Edge locations', after: '1' },
    { label: 'Cache hit ratio', after: '85%' },
  ],
  nextTeaser: "Great! But what about users in Asia and other regions?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'CDN Edge Servers: Bringing Content Closer',
  conceptExplanation: `A **CDN Edge** is a cache server located near users.

**How it works**:
1. User in London requests /image.jpg
2. Request goes to nearby edge in London (10ms away)
3. **Cache HIT**: Edge has the file → returns immediately (50ms total)
4. **Cache MISS**: Edge fetches from origin, caches it, returns to user (500ms first time)
5. Next user gets cache hit (50ms)

**Key insight**: First request to edge is slow (cache miss), but subsequent requests are fast (cache hits).

**The transformation**:
- Before CDN: All users → Origin in US (200-500ms)
- With CDN: Users → Nearby edge (20-50ms for cache hits)`,

  whyItMatters: 'Edge caching reduces latency by 10x for users far from the origin.',

  realWorldExample: {
    company: 'Akamai',
    scenario: 'Serving 30% of global web traffic',
    howTheyDoIt: 'Operates 365,000+ edge servers in 135 countries. Content cached at edges worldwide.',
  },

  famousIncident: {
    title: 'Fastly CDN Outage',
    company: 'Fastly',
    year: '2021',
    whatHappened: 'A software bug caused a global outage affecting Reddit, Amazon, Twitch, GitHub, and major news sites. Lasted 49 minutes. Root cause: edge servers failed to fall back to origin.',
    lessonLearned: 'Edge servers must have robust failover to origin when cache fails.',
    icon: '💥',
  },

  keyPoints: [
    'Edge servers cache popular content close to users',
    'Cache hit = fast (50ms), Cache miss = slower (500ms)',
    'First request to new content is always a miss',
    'Popular content stays cached, unpopular content expires',
  ],

  keyConcepts: [
    { title: 'Edge Server', explanation: 'Cache server near users', icon: '📍' },
    { title: 'Cache Hit', explanation: 'Content found in edge cache', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Content not cached, fetch from origin', icon: '❌' },
    { title: 'TTL', explanation: 'How long content stays cached', icon: '⏰' },
  ],
};

const step3: GuidedStep = {
  id: 'globalcdn-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Low-latency delivery from nearby edges',
    taskDescription: 'Add a CDN edge server between Client and Origin',
    componentsNeeded: [
      { type: 'cdn', reason: 'Caches content at the edge near users', displayName: 'CDN Edge' },
    ],
    successCriteria: [
      'CDN component added',
      'Client connected to CDN',
      'CDN connected to Origin Server',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add a CDN between Client and Origin Server',
    level2: 'Client → CDN → Origin Server. CDN fetches from origin on cache miss.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Multi-Region CDN with Anycast
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🗺️',
  scenario: "Success in Europe! But users in Asia, South America, and Australia are still slow.",
  hook: "You need edge locations on every continent. But how do users find the nearest edge?",
  challenge: "Deploy multiple edge regions and use anycast routing to direct users automatically to the closest one.",
  illustration: 'multi-region',
};

const step4Celebration: CelebrationContent = {
  emoji: '🌏',
  message: 'Global coverage achieved!',
  achievement: 'Multi-region CDN with intelligent routing',
  metrics: [
    { label: 'Edge regions', after: '5 continents' },
    { label: 'Global p99 latency', after: '<50ms' },
    { label: 'Routing', after: 'Anycast' },
  ],
  nextTeaser: "Excellent! But how do we handle origin failures?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Anycast: Automatic Routing to Nearest Edge',
  conceptExplanation: `**The Challenge**: With edges worldwide, how does a user in Tokyo know to use the Tokyo edge vs London edge?

**Solution**: Anycast routing

**How Anycast works**:
1. All edge locations advertise the SAME IP address (e.g., 1.2.3.4)
2. Internet routers use BGP to route traffic to the "nearest" location
3. User in Tokyo requesting 1.2.3.4 → routed to Tokyo edge
4. User in London requesting 1.2.3.4 → routed to London edge
5. Same IP, different edge server!

**Compare to Unicast**:
- Unicast: Each server has unique IP
- Anycast: Multiple servers share same IP, router picks nearest

**For CDN**:
- cdn.example.com → 1.2.3.4 (anycast IP)
- Tokyo user → Tokyo edge
- London user → London edge
- Automatic, no DNS tricks needed!`,

  whyItMatters: 'Anycast provides automatic failover and load balancing at the network layer. If an edge fails, traffic automatically reroutes to the next nearest edge.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Routing users to 275+ edge locations',
    howTheyDoIt: 'Uses anycast for all edge IPs. When you visit a Cloudflare-protected site, BGP routes you to the nearest edge automatically.',
  },

  famousIncident: {
    title: 'Route Leak Takes Down Cloudflare',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A BGP route leak by a small ISP in Pennsylvania caused internet routers to incorrectly route Cloudflare traffic through the ISP\'s tiny network. This overwhelmed their routers and caused a partial outage. Anycast couldn\'t protect against BGP misconfiguration.',
    lessonLearned: 'Anycast depends on correct BGP routing. Monitor route advertisements and have RPKI filters.',
    icon: '🔀',
  },

  keyPoints: [
    'Anycast = same IP advertised from multiple locations',
    'Routers automatically send traffic to nearest edge',
    'Provides automatic failover if one edge fails',
    'Works at network layer (faster than DNS)',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│          ANYCAST ROUTING                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  User in Tokyo            User in London        │
│       │                        │                │
│       │ Request 1.2.3.4        │ Request 1.2.3.4│
│       ▼                        ▼                │
│  ┌──────────┐            ┌──────────┐          │
│  │  Tokyo   │            │  London  │          │
│  │  Edge    │            │  Edge    │          │
│  │ (1.2.3.4)│            │ (1.2.3.4)│          │
│  └──────────┘            └──────────┘          │
│       │                        │                │
│       └────────┬───────────────┘                │
│                ▼                                │
│         ┌─────────────┐                         │
│         │   Origin    │                         │
│         │   Server    │                         │
│         └─────────────┘                         │
│                                                 │
│  Same IP (1.2.3.4) but different edge serves!  │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Anycast', explanation: 'Same IP from multiple locations', icon: '📡' },
    { title: 'BGP', explanation: 'Border Gateway Protocol - internet routing', icon: '🔀' },
    { title: 'Nearest', explanation: 'Fewest network hops, not geographic distance', icon: '📍' },
  ],

  quickCheck: {
    question: 'How does anycast routing work?',
    options: [
      'DNS returns different IPs based on user location',
      'Load balancer distributes traffic across edges',
      'Internet routers send traffic to nearest server advertising the same IP',
      'Users manually select which edge to connect to',
    ],
    correctIndex: 2,
    explanation: 'Anycast uses BGP routing to automatically direct traffic to the nearest edge advertising the same IP address.',
  },
};

const step4: GuidedStep = {
  id: 'globalcdn-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Global low-latency delivery',
    taskDescription: 'Add Load Balancer with geo-routing to represent anycast behavior',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Represents anycast routing to nearest edge', displayName: 'Anycast Router' },
    ],
    successCriteria: [
      'Load Balancer added between Client and CDN',
      'Represents geographic routing to nearest edge',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer between Client and CDN to represent anycast routing',
    level2: 'Client → Load Balancer (anycast) → CDN → Origin. LB routes to nearest edge.',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'cdn' },
    ],
  },
};

// =============================================================================
// STEP 5: Cache Hierarchy - Regional Mid-Tier
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🏗️',
  scenario: "Your edge servers in small cities keep missing cache and hitting the distant origin!",
  hook: "Edge in Mumbai misses → fetches from origin in US Virginia (300ms). But nearby edge in Bangalore already has the content!",
  challenge: "Add a regional mid-tier cache layer. Edges check regional cache before origin.",
  illustration: 'cache-hierarchy',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Cache hierarchy optimized!',
  achievement: 'Multi-tier caching reduces origin load',
  metrics: [
    { label: 'Origin requests', before: '5%', after: '0.5%' },
    { label: 'Cache miss latency', before: '300ms', after: '100ms' },
    { label: 'Cache tiers', after: '3 (edge/regional/origin)' },
  ],
  nextTeaser: "Perfect! But what happens when the origin goes down?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Hierarchy: Edge, Regional, Origin',
  conceptExplanation: `**The Problem**: With only edge + origin, cache misses are expensive.

**The Solution**: Add a **Regional Cache** (mid-tier) between edge and origin.

**Three-Tier Cache Hierarchy**:

1. **Edge Tier** (L1 Cache)
   - 50+ locations worldwide
   - Smallest cache (1-10TB each)
   - Serves users directly
   - Cache hot content for each region

2. **Regional Tier** (L2 Cache)
   - 5-10 regional hubs
   - Larger cache (50-100TB each)
   - Aggregates traffic from nearby edges
   - Reduces origin load

3. **Origin Tier** (Source of Truth)
   - 1-2 locations
   - Stores ALL content (1PB+)
   - Only hit on regional cache miss

**Request Flow**:
1. User → Edge (L1)
2. Edge miss → Regional (L2)
3. Regional miss → Origin
4. Fill caches on the way back

**The Math**:
- Edge hit rate: 90%
- Regional hit rate: 95% (of remaining 10%)
- Origin hit rate: 5% of 10% = 0.5% total!`,

  whyItMatters: 'Cache hierarchy dramatically reduces origin load and improves cache miss latency.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Open Connect CDN architecture',
    howTheyDoIt: 'Uses 3-tier hierarchy: edge servers in ISPs, regional caches in data centers, S3 origin. 95%+ of streams never leave the ISP.',
  },

  famousIncident: {
    title: 'AWS CloudFront Cache Miss Storm',
    company: 'AWS',
    year: '2020',
    whatHappened: 'A cache invalidation bug caused all CloudFront edges to simultaneously fetch the same popular files from origin. The thundering herd of cache misses overwhelmed S3 origins, causing cascading failures.',
    lessonLearned: 'Cache hierarchy prevents stampedes. Regional caches absorb refill traffic.',
    icon: '⚡',
  },

  keyPoints: [
    'Edge (L1): Small, fast, close to users',
    'Regional (L2): Larger, aggregates nearby edges',
    'Origin: Source of truth, handles 0.5% of traffic',
    'Each tier reduces load on the next tier',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         3-TIER CACHE HIERARCHY                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  User in Mumbai                                 │
│       │                                         │
│       ▼                                         │
│  ┌──────────┐ 90% hit                          │
│  │  Mumbai  │ ◄────── 10% miss                 │
│  │  Edge    │                │                  │
│  │  (L1)    │                │                  │
│  └──────────┘                ▼                  │
│                         ┌──────────┐            │
│                         │  India   │ 95% hit    │
│                         │ Regional │◄─── 5% miss│
│                         │  (L2)    │       │    │
│                         └──────────┘       │    │
│                                            ▼    │
│                                     ┌──────────┐│
│                                     │  Origin  ││
│                                     │  (S3)    ││
│                                     └──────────┘│
│                                                 │
│  Total origin traffic: 10% × 5% = 0.5%!        │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'L1 Cache', explanation: 'Edge cache closest to users', icon: '1️⃣' },
    { title: 'L2 Cache', explanation: 'Regional mid-tier cache', icon: '2️⃣' },
    { title: 'Cache Fill', explanation: 'Populating cache after a miss', icon: '📥' },
    { title: 'Hit Ratio', explanation: 'Percentage of requests served from cache', icon: '📊' },
  ],

  quickCheck: {
    question: 'Why add a regional cache layer?',
    options: [
      'To store more content at the edge',
      'To reduce origin load and improve cache miss latency',
      'To replace the origin server',
      'To make cache invalidation faster',
    ],
    correctIndex: 1,
    explanation: 'Regional cache absorbs most cache misses from edges, reducing both origin load (0.5% vs 10%) and cache miss latency (100ms vs 300ms).',
  },
};

const step5: GuidedStep = {
  id: 'globalcdn-step-5',
  stepNumber: 5,
  frIndex: 1,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-2: Optimize cache hierarchy for performance',
    taskDescription: 'Add Cache (Redis) as regional mid-tier between CDN and Origin',
    componentsNeeded: [
      { type: 'cache', reason: 'Regional cache tier between edge and origin', displayName: 'Regional Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'CDN connected to Cache (regional tier)',
      'Cache connected to Origin Server',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cache', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add Cache between CDN and Origin Server to create cache hierarchy',
    level2: 'CDN (edge) → Cache (regional) → Origin Server. Three-tier architecture.',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'cdn', to: 'cache' },
      { from: 'cache', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Origin Failover and Redundancy
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💥',
  scenario: "Disaster strikes! The origin server in Virginia is down!",
  hook: "All cache misses are failing. New content can't be fetched. Users see errors for uncached content.",
  challenge: "Add a backup origin server and configure failover. CDN should switch to backup when primary fails.",
  illustration: 'server-crash',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Origin is now highly available!',
  achievement: 'Multi-origin architecture with automatic failover',
  metrics: [
    { label: 'Origin availability', before: '99%', after: '99.99%' },
    { label: 'Failover time', after: '<5 seconds' },
    { label: 'Stale content serving', after: 'Enabled' },
  ],
  nextTeaser: "Excellent! But how do we update content across all caches?",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Origin Selection and Failover',
  conceptExplanation: `**The Problem**: Single origin = single point of failure

**Solution**: Multiple origin servers with intelligent selection

**Origin Selection Strategies**:

1. **Active-Passive (Failover)**
   - Primary origin handles all traffic
   - Backup origin on standby
   - Switch on failure (5-10 sec failover)

2. **Active-Active (Load Balanced)**
   - Both origins serve traffic
   - Geographic routing: US users → US origin, EU users → EU origin
   - Better performance, no idle resources

3. **Tiered Origins**
   - Primary: Fresh content, authoritative
   - Secondary: Replicated, eventual consistency
   - Edge fetches from nearest available

**Failure Handling**:
- Monitor origin health (HTTP checks every 5 sec)
- On failure: Try backup origin
- Last resort: Serve stale content from cache
- Better stale than error!

**Cache-Control Headers**:
- \`Cache-Control: max-age=3600, stale-while-revalidate=86400\`
- Serve stale content up to 24 hours during origin outage`,

  whyItMatters: 'Origin failures should degrade performance, not cause complete outages. Multi-origin with failover maintains availability.',

  realWorldExample: {
    company: 'Fastly',
    scenario: 'Multi-region origin failover',
    howTheyDoIt: 'Customers configure primary and backup origins. Fastly edges automatically fail over on origin errors, serving stale content if needed.',
  },

  famousIncident: {
    title: 'S3 US-East Outage',
    company: 'AWS',
    year: '2017',
    whatHappened: 'S3 in US-East-1 went down for 4 hours. Many CDNs using it as sole origin failed to serve content. CDNs with multi-region origins or aggressive stale serving continued functioning.',
    lessonLearned: 'Never rely on a single region as origin. Always have cross-region failover.',
    icon: '☁️',
  },

  keyPoints: [
    'Multiple origins prevent single point of failure',
    'Active-passive: Failover on error (simple)',
    'Active-active: Route by geography (complex, better perf)',
    'Serve stale content when all origins fail',
    'Health checks every 5 seconds detect failures quickly',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         ORIGIN FAILOVER                         │
├─────────────────────────────────────────────────┤
│                                                 │
│          ┌──────────────┐                       │
│          │  Regional    │                       │
│          │  Cache       │                       │
│          └──────┬───────┘                       │
│                 │                               │
│      ┌──────────┴──────────┐                   │
│      │                     │                    │
│      ▼ try primary         ▼ on failure        │
│ ┌─────────────┐      ┌─────────────┐           │
│ │  Primary    │  ❌  │  Backup     │           │
│ │  Origin     │ ───▶ │  Origin     │           │
│ │  (US-East)  │      │  (EU-West)  │           │
│ └─────────────┘      └─────────────┘           │
│      │                     │                    │
│      └──────────┬──────────┘                   │
│                 ▼                               │
│          ┌─────────────┐                        │
│          │   Object    │                        │
│          │   Storage   │                        │
│          └─────────────┘                        │
│                                                 │
│  If both fail: Serve stale from cache!         │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Failover', explanation: 'Automatic switch to backup on failure', icon: '🔄' },
    { title: 'Health Check', explanation: 'Periodic test to detect failures', icon: '💓' },
    { title: 'Stale Content', explanation: 'Old cached content served during outage', icon: '📜' },
    { title: 'Origin Pool', explanation: 'Set of origin servers to choose from', icon: '🎯' },
  ],

  quickCheck: {
    question: 'What should the CDN do when the primary origin fails?',
    options: [
      'Return errors to all users',
      'Try backup origin, then serve stale content if that fails too',
      'Take the CDN offline',
      'Only serve cached content, block new requests',
    ],
    correctIndex: 1,
    explanation: 'Graceful degradation: try backup origin first, serve stale content as last resort. Never return errors if alternatives exist.',
  },
};

const step6: GuidedStep = {
  id: 'globalcdn-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Origin failover capability',
    taskDescription: 'Configure Database to represent backup origin with replication',
    componentsNeeded: [
      { type: 'database', reason: 'Represents backup origin with failover', displayName: 'Backup Origin' },
    ],
    successCriteria: [
      'Database component added',
      'Database replication enabled (represents multi-origin)',
      'Cache connected to Database (backup origin)',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cache', 'app_server', 'object_storage', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'app_server' },
      { fromType: 'cache', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Add Database as backup origin, enable replication, connect to Cache',
    level2: 'Cache can fetch from either Origin Server or Database (backup). Enable DB replication.',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [{ from: 'cache', to: 'database' }],
  },
};

// =============================================================================
// STEP 7: Cache Invalidation and Purging
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🔄',
  scenario: "A customer updated their logo.png but users still see the old logo for hours!",
  hook: "The content is cached across 50+ edge locations. How do we update it quickly?",
  challenge: "Implement cache invalidation strategy to purge or update content across all edges.",
  illustration: 'cache-invalidation',
};

const step7Celebration: CelebrationContent = {
  emoji: '✨',
  message: 'Cache invalidation deployed!',
  achievement: 'Content updates propagate globally in seconds',
  metrics: [
    { label: 'Update propagation time', before: '2 hours', after: '30 seconds' },
    { label: 'Purge mechanism', after: 'Enabled' },
    { label: 'Fresh content guarantee', after: '✓' },
  ],
  nextTeaser: "Perfect! Let's optimize for cost and performance...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation: The Hardest Problem',
  conceptExplanation: `**Phil Karlton's famous quote**: "There are only two hard things in Computer Science: cache invalidation and naming things."

**The Challenge**: How to update content cached across 50+ edge locations?

**Cache Invalidation Strategies**:

1. **TTL-based (Time-To-Live)**
   - Set expiration time: \`Cache-Control: max-age=3600\`
   - Content automatically expires after 1 hour
   - Simple, but users see stale content until TTL expires
   - Good for: Content that doesn't change often

2. **Purge/Invalidation**
   - API call: "Purge /logo.png from all edges"
   - Edges delete the file immediately
   - Next request fetches fresh version
   - Good for: Immediate updates needed

3. **Versioned URLs**
   - Change URL when content changes: /logo.png?v=2
   - Old version stays cached, new version is different URL
   - Fastest, most reliable
   - Good for: Assets with long TTL

**Purge Propagation**:
1. Customer calls purge API
2. Control plane sends purge to all edges
3. Each edge marks content as invalid
4. Next request fetches from origin
5. Propagation time: 5-30 seconds globally

**Best Practice**: Combine strategies
- Use versioned URLs for long-lived assets
- Use TTL for dynamic content
- Use purge for emergencies`,

  whyItMatters: 'Without cache invalidation, content updates take hours to propagate. With it, updates are live globally in seconds.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Purging cached content across 275+ locations',
    howTheyDoIt: 'Purge API propagates to all edges in <5 seconds using their Quicksilver distributed KV store.',
  },

  famousIncident: {
    title: 'Facebook News Feed Cache Bug',
    company: 'Facebook',
    year: '2018',
    whatHappened: 'A cache invalidation bug caused users\' news feeds to show posts from wrong people. Cache wasn\'t properly cleared when unfriending someone, so their posts stayed in your feed.',
    lessonLearned: 'Cache invalidation logic must handle all edge cases, especially for privacy-sensitive data.',
    icon: '📰',
  },

  keyPoints: [
    'TTL: Automatic expiration (simple, eventual consistency)',
    'Purge: Immediate deletion (fast, requires API)',
    'Versioned URLs: Change URL = new cache entry (most reliable)',
    'Purge propagation takes 5-30 seconds globally',
    'Always combine multiple strategies',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         CACHE INVALIDATION                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Customer updates logo.png                   │
│  2. Calls Purge API                             │
│                                                 │
│          ┌──────────────┐                       │
│          │   Purge API  │                       │
│          └──────┬───────┘                       │
│                 │                               │
│      Propagates to all edges (5-30 sec)        │
│                 │                               │
│    ┌────────────┼────────────┐                 │
│    ▼            ▼            ▼                  │
│ ┌──────┐   ┌──────┐   ┌──────┐                │
│ │ Edge │   │ Edge │   │ Edge │                │
│ │  US  │   │  EU  │   │ Asia │                │
│ └──┬───┘   └──┬───┘   └──┬───┘                │
│    │          │          │                     │
│    │ Mark logo.png as invalid                  │
│    │          │          │                     │
│    ▼          ▼          ▼                     │
│  Next request fetches fresh version            │
│                                                 │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'TTL', explanation: 'Auto-expire cache after N seconds', icon: '⏰' },
    { title: 'Purge', explanation: 'Immediately delete cached content', icon: '🗑️' },
    { title: 'Versioning', explanation: 'Change URL when content changes', icon: '🔢' },
    { title: 'Propagation', explanation: 'Time for update to reach all edges', icon: '📡' },
  ],

  quickCheck: {
    question: 'What is the most reliable cache invalidation strategy?',
    options: [
      'Set TTL to 1 minute for everything',
      'Purge cache whenever content changes',
      'Use versioned URLs (logo.png?v=2) so each version is a different cache entry',
      'Clear all caches every hour',
    ],
    correctIndex: 2,
    explanation: 'Versioned URLs are most reliable - old version stays cached, new version is different URL. No race conditions, instant updates, long TTL possible.',
  },
};

const step7: GuidedStep = {
  id: 'globalcdn-step-7',
  stepNumber: 7,
  frIndex: 2,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-3: Cache invalidation support',
    taskDescription: 'Configure cache strategy for the regional cache',
    componentsNeeded: [
      { type: 'cache', reason: 'Configure cache strategy and TTL', displayName: 'Regional Cache' },
    ],
    successCriteria: [
      'Click on Cache component',
      'Configure cache strategy (cache-aside)',
      'Set appropriate TTL for content freshness',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cache', 'app_server', 'object_storage', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'app_server' },
      { fromType: 'cache', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click Cache component and configure strategy and TTL',
    level2: 'Set cache-aside strategy with appropriate TTL (e.g., 3600 seconds for 1 hour)',
    solutionComponents: [{ type: 'cache', config: { strategy: 'cache-aside', ttl: 3600 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Cost Optimization and Monitoring
// =============================================================================

const step8Story: StoryContent = {
  emoji: '💰',
  scenario: "The CFO is concerned: 'We're spending $500K/month on bandwidth!'",
  hook: "Every cache miss costs money in bandwidth and origin load. How do we optimize?",
  challenge: "Optimize the CDN architecture for cost while maintaining performance and reliability.",
  illustration: 'cost-optimization',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a global CDN!',
  achievement: 'Complete multi-region CDN with cache hierarchy',
  metrics: [
    { label: 'Global coverage', after: '50+ edge locations' },
    { label: 'Cache hit ratio', after: '95%+' },
    { label: 'P99 latency', after: '<50ms globally' },
    { label: 'Origin load', after: '0.5% of traffic' },
    { label: 'Availability', after: '99.99%' },
    { label: 'Cost optimized', after: '✓' },
  ],
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'CDN Cost Optimization',
  conceptExplanation: `**CDN Cost Drivers**:

1. **Bandwidth**
   - Edge → User (egress): Most expensive
   - Origin → Edge (cache fill): Expensive
   - Edge → Regional: Cheaper (internal network)
   - Goal: Maximize cache hits to reduce both

2. **Storage**
   - Edge cache storage: Moderate cost
   - Regional cache storage: Lower cost
   - Origin storage (S3): Cheapest
   - Trade-off: More cache = higher hit ratio = less bandwidth

3. **Compute**
   - Edge server instances
   - Regional cache instances
   - Origin servers

**Optimization Strategies**:

1. **Increase Cache Hit Ratio** (Biggest impact)
   - 90% → 95% hit ratio = 50% reduction in origin traffic!
   - Techniques: Longer TTL, cache warming, smart caching policies

2. **Cache Warming**
   - Pre-populate popular content during off-peak
   - Avoid cache misses during peak hours
   - Especially important for new content releases

3. **Compression**
   - Enable gzip/brotli compression
   - 70% bandwidth reduction for text assets
   - Trade-off: CPU cost for compression

4. **Regional Peering**
   - Private connections between edge and regional
   - Cheaper than public internet
   - Used by all major CDNs

5. **Right-size Cache**
   - Don't over-provision edge cache
   - Monitor hit ratio per edge
   - Small edges in low-traffic regions

**Monitoring Metrics**:
- Cache hit ratio per edge, regional, global
- Origin bandwidth (goal: minimize)
- P99 latency per region
- Error rate
- Cost per GB delivered`,

  whyItMatters: 'At petabyte scale, a 1% improvement in cache hit ratio saves millions annually in bandwidth costs.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 30% of internet traffic efficiently',
    howTheyDoIt: 'Open Connect CDN with aggressive cache warming. Pre-cache popular shows during off-peak. 95%+ traffic served from within ISP networks, minimizing transit costs.',
  },

  keyPoints: [
    'Bandwidth is the biggest cost - optimize cache hit ratio',
    ' 90% → 95% hit ratio = 50% less origin traffic',
    'Cache warming prevents expensive cache misses',
    'Right-size edge caches based on regional traffic',
    'Monitor: hit ratio, origin bandwidth, latency, cost/GB',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         CDN COST OPTIMIZATION                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Before Optimization:                           │
│  - Cache hit ratio: 90%                         │
│  - Origin requests: 10% of 10M = 1M req/s      │
│  - Bandwidth cost: $500K/month                  │
│                                                 │
│  After Optimization:                            │
│  ✅ Cache warming for popular content           │
│  ✅ Longer TTL for static assets                │
│  ✅ Regional cache tier                         │
│  ✅ Compression enabled                         │
│                                                 │
│  Results:                                       │
│  - Cache hit ratio: 95%                         │
│  - Origin requests: 5% of 10M = 500K req/s     │
│  - Bandwidth cost: $250K/month                  │
│                                                 │
│  50% cost reduction!                            │
│                                                 │
│  Cache Hit Ratio is Everything!                 │
│  90% → 95% = 50% less origin traffic           │
│  95% → 98% = 40% less origin traffic           │
│                                                 │
└─────────────────────────────────────────────────┘`,

  keyConcepts: [
    { title: 'Cache Hit Ratio', explanation: '% of requests served from cache', icon: '🎯' },
    { title: 'Cache Warming', explanation: 'Pre-populate cache with popular content', icon: '🔥' },
    { title: 'Egress Bandwidth', explanation: 'Data sent out (edge→user) - expensive', icon: '📤' },
    { title: 'Cost/GB', explanation: 'Primary CDN cost metric', icon: '💵' },
  ],

  quickCheck: {
    question: 'What is the most effective way to reduce CDN costs?',
    options: [
      'Remove edge locations to save on server costs',
      'Increase cache hit ratio from 90% to 95%',
      'Reduce origin storage',
      'Disable compression to save CPU',
    ],
    correctIndex: 1,
    explanation: 'Increasing cache hit ratio from 90% to 95% cuts origin traffic in half, dramatically reducing bandwidth costs (the biggest expense).',
  },
};

const step8: GuidedStep = {
  id: 'globalcdn-step-8',
  stepNumber: 8,
  frIndex: 3,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered efficiently',
    taskDescription: 'Review and optimize the complete architecture',
    successCriteria: [
      'Verify all components are properly configured',
      'Ensure cache hierarchy is optimal',
      'Check that failover is configured',
      'Validate multi-region architecture',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'cdn', 'cache', 'app_server', 'object_storage', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'app_server' },
      { fromType: 'cache', toType: 'database' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Review the complete architecture and ensure all optimizations are in place',
    level2: 'You should have: anycast routing (LB), edge cache (CDN), regional cache (Cache), multi-origin (DB replication), all properly configured',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const globalCdnGuidedTutorial: GuidedTutorial = {
  problemId: 'global-cdn',
  title: 'Design a Global CDN',
  description: 'Build a worldwide content delivery network with multi-region edges, cache hierarchy, and intelligent routing',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🌍',
    hook: "You've been hired as Principal Architect at CloudScale CDN!",
    scenario: "Your mission: Build a global CDN that delivers content to 1 billion users worldwide with <50ms latency.",
    challenge: "Can you design a system that handles 10 million requests per second across 50+ edge locations?",
  },

  requirementsPhase: globalCdnRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Content Delivery Networks',
    'Edge Computing',
    'Anycast Routing',
    'Cache Hierarchy (L1/L2)',
    'Origin Selection',
    'Multi-Region Architecture',
    'Cache Invalidation',
    'Geographic Load Balancing',
    'Stale Content Serving',
    'Cache Warming',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication (Multi-origin)',
    'Chapter 8: Distributed System Troubles (Caching, Consistency)',
    'Chapter 9: Consistency and Consensus',
  ],
};

export default globalCdnGuidedTutorial;
