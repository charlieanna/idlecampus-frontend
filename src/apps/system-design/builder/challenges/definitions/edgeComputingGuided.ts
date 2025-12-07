import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Edge Computing Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches edge computing concepts
 * while building a Cloudflare Workers-style edge platform.
 *
 * Focus:
 * - Global distribution with edge locations
 * - Low-latency request handling
 * - Edge caching and compute
 * - CDN principles
 * - Cloudflare Workers architecture
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-8: Scale globally with edge locations
 *
 * Key Concepts:
 * - Edge locations vs origin servers
 * - Geographic distribution
 * - Edge caching strategies
 * - Serverless edge functions
 * - Global low-latency delivery
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const edgeComputingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a globally distributed edge computing platform like Cloudflare Workers",

  interviewer: {
    name: 'Alex Rodriguez',
    role: 'VP of Infrastructure at EdgeTech',
    avatar: '🌍',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What's the main purpose of an edge computing platform?",
      answer: "Users need to:\n\n1. **Deploy serverless functions globally** - Run code at the edge, close to users\n2. **Cache static assets** - Serve images, CSS, JS from edge locations\n3. **Route requests intelligently** - Direct traffic to nearest edge location\n4. **Transform content on-the-fly** - Resize images, compress, modify HTML at the edge",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Edge computing brings computation and data closer to users for minimal latency",
    },
    {
      id: 'edge-function-execution',
      category: 'functional',
      question: "What does it mean to 'run code at the edge'?",
      answer: "Instead of all requests going to a single origin server in one location (e.g., US-East), we deploy lightweight serverless functions to 200+ edge locations worldwide. When a user in Tokyo makes a request, it's handled by the Tokyo edge location - not routed all the way to the US.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Edge = geographically distributed servers close to end users",
    },
    {
      id: 'static-asset-handling',
      category: 'functional',
      question: "How should static assets like images and CSS be handled?",
      answer: "Static assets should be **cached at edge locations**. First request fetches from origin, subsequent requests are served instantly from the edge cache. This is classic CDN behavior.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Caching at the edge eliminates origin server load and reduces latency",
    },
    {
      id: 'dynamic-content',
      category: 'clarification',
      question: "What about dynamic content that can't be cached?",
      answer: "For dynamic requests (personalized data, API calls), the edge function can:\n1. Run computation locally at the edge\n2. Proxy to origin with optimized routing\n3. Cache partial responses (fragment caching)\n4. Use edge-side includes (ESI)",
      importance: 'important',
      insight: "Edge functions handle both cached and dynamic content intelligently",
    },
    {
      id: 'deployment-model',
      category: 'clarification',
      question: "How do developers deploy code to all edge locations?",
      answer: "Deploy once, run everywhere! Developers push their function code to our platform. We automatically distribute it to all 200+ edge locations within seconds using our global deployment pipeline.",
      importance: 'important',
      insight: "Instant global deployment is a key edge platform feature",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests per second should the edge network handle globally?",
      answer: "10 million requests per second globally during normal traffic, with spikes up to 50 million during DDoS attacks or viral content",
      importance: 'critical',
      calculation: {
        formula: "10M RPS distributed across 200 edge locations = 50K RPS per location",
        result: "~50K RPS per edge location average",
      },
      learningPoint: "Edge networks handle massive global traffic by distributing load geographically",
    },
    {
      id: 'latency-global',
      category: 'latency',
      question: "What's the target latency for edge responses?",
      answer: "p99 < 50ms globally. 95% of users should be within 50ms network latency of an edge location. This is the main value proposition of edge computing!",
      importance: 'critical',
      learningPoint: "Sub-50ms latency is only possible by serving from nearby edge locations",
    },
    {
      id: 'latency-cache-hit',
      category: 'latency',
      question: "What about cached content specifically?",
      answer: "Cache hits should be p99 < 10ms. Serving from edge cache is nearly instant since there's no origin round-trip.",
      importance: 'critical',
      calculation: {
        formula: "Cache hit = edge only, Cache miss = edge + origin",
        result: "10ms (cached) vs 100ms+ (origin fetch)",
      },
      learningPoint: "Cache hits are 10x faster than origin fetches",
    },
    {
      id: 'geographic-distribution',
      category: 'throughput',
      question: "How many edge locations should we have?",
      answer: "At least 200 edge locations globally, distributed across all continents. More locations = users closer to edge = lower latency. Cloudflare has 310+, Fastly has 70+.",
      importance: 'critical',
      learningPoint: "More edge locations = better global coverage and lower latency",
    },
    {
      id: 'cache-hit-ratio',
      category: 'performance',
      question: "What cache hit ratio should we target?",
      answer: "90%+ for static assets, 60-70% overall. High cache hit ratio means less origin load and faster responses.",
      importance: 'critical',
      calculation: {
        formula: "90% cache hit rate = 10% of requests hit origin",
        result: "Origin handles only 1M RPS instead of 10M RPS",
      },
      learningPoint: "Cache hit ratio directly impacts origin load and user latency",
    },
    {
      id: 'cold-start',
      category: 'latency',
      question: "What about cold start times for edge functions?",
      answer: "Edge functions should have near-zero cold start. Use V8 isolates (like Cloudflare Workers) instead of containers. Target: p99 < 5ms cold start.",
      importance: 'important',
      insight: "V8 isolates are 100x faster to start than containers",
    },
    {
      id: 'global-consistency',
      category: 'consistency',
      question: "When code is deployed, how quickly should it reach all edge locations?",
      answer: "Deploy globally within 30 seconds. All edge locations should serve the new version within 30s of deployment.",
      importance: 'important',
      insight: "Fast global deployment enables rapid iteration and emergency fixes",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'edge-function-execution', 'latency-global'],
  criticalFRQuestionIds: ['core-functionality', 'edge-function-execution'],
  criticalScaleQuestionIds: ['throughput-requests', 'latency-global', 'cache-hit-ratio'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Execute serverless functions at edge',
      description: 'Deploy and run user code at edge locations close to users',
      emoji: '⚡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Cache static assets at edge',
      description: 'Store and serve static content from edge cache',
      emoji: '📦',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Intelligent request routing',
      description: 'Route requests to nearest edge location via Anycast',
      emoji: '🧭',
    },
    {
      id: 'fr-4',
      text: 'FR-4: On-the-fly content transformation',
      description: 'Modify, compress, or transform content at the edge',
      emoji: '🔄',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 billion global users',
    writesPerDay: '100 million edge function deployments',
    readsPerDay: '864 billion requests',
    peakMultiplier: 5,
    readWriteRatio: '10000:1',
    calculatedWriteRPS: { average: 1157, peak: 5785 },
    calculatedReadRPS: { average: 10000000, peak: 50000000 },
    maxPayloadSize: '~100KB (edge function)',
    storagePerRecord: '~50KB (function code)',
    storageGrowthPerYear: '~5TB',
    redirectLatencySLA: 'p99 < 50ms (global)',
    createLatencySLA: 'p99 < 10ms (cache hit)',
  },

  architecturalImplications: [
    '✅ Global distribution required → 200+ edge locations worldwide',
    '✅ Sub-50ms latency → Anycast routing to nearest edge',
    '✅ 90%+ cache hit ratio → Aggressive edge caching',
    '✅ 10M RPS globally → Horizontal scaling at each edge location',
    '✅ Near-zero cold start → V8 isolates, not containers',
    '✅ 30s global deployment → Distributed configuration system',
  ],

  outOfScope: [
    'Video streaming',
    'Object storage (S3-like)',
    'Full database at edge',
    'WebRTC/real-time communications',
    'Email delivery',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where clients connect to servers. Then we'll add edge locations to reduce latency. Finally, we'll optimize with caching and intelligent routing. This is the right way: functionality first, then global distribution!",
};

// =============================================================================
// STEP 1: The Beginning - Connect Client to Origin Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌐',
  scenario: "Welcome to EdgeTech! You've been hired to build a global edge computing platform.",
  hook: "Right now, all your users connect to a single server in Virginia. A user in Tokyo experiences 250ms latency just to reach your server!",
  challenge: "Start with the basics: connect clients to your origin server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your basic system is connected!",
  achievement: "Clients can reach your origin server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can handle requests', after: '✓' },
  ],
  nextTeaser: "But latency is terrible for users far from Virginia...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'The Latency Problem: Centralized Servers',
  conceptExplanation: `When all your servers are in one location, physics becomes your enemy.

**The Problem:**
- Speed of light: ~200,000 km/s in fiber
- Tokyo to Virginia: ~11,000 km
- Minimum latency: 55ms each way = 110ms round-trip
- Add routing, processing, congestion: 200-300ms real-world

**User Experience:**
- US East users: 10ms (great!)
- Europe users: 80ms (okay)
- Asia users: 250ms (terrible!)
- Australia users: 300ms (unusable!)

This is why edge computing exists!`,

  whyItMatters: 'Every 100ms of latency costs you conversions, engagement, and revenue. Amazon found that every 100ms delay costs 1% in sales.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving 20% of all internet traffic',
    howTheyDoIt: '310+ edge locations worldwide ensure 95% of the internet population is within 50ms',
  },

  keyPoints: [
    'Centralized servers = high latency for distant users',
    'Speed of light is a hard limit',
    'Edge computing solves this by bringing servers to users',
    'Each 100ms of latency impacts business metrics',
  ],

  diagram: `
┌─────────────┐                          ┌─────────────────┐
│   Client    │   250ms latency!         │ Origin Server   │
│  (Tokyo)    │ ────────────────────────▶│   (Virginia)    │
└─────────────┘                          └─────────────────┘

Problem: All requests travel 11,000 km!
`,

  keyConcepts: [
    {
      title: 'Latency',
      explanation: 'Time for request to travel from user to server',
      icon: '⏱️',
    },
    {
      title: 'Round-trip time (RTT)',
      explanation: 'Request + Response latency',
      icon: '🔄',
    },
  ],

  quickCheck: {
    question: 'Why do Tokyo users experience 250ms latency to a Virginia server?',
    options: [
      'The server is slow',
      'Network congestion',
      'Physical distance - speed of light limitation',
      'Too many users',
    ],
    correctIndex: 2,
    explanation: 'Light travels at finite speed through fiber (~200,000 km/s). Long distances = high latency.',
  },
};

const step1: GuidedStep = {
  id: 'edge-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Users can connect to the system',
    taskDescription: 'Add Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents global users', displayName: 'Client' },
      { type: 'app_server', reason: 'Origin server processes requests', displayName: 'Origin Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'Origin Server', reason: 'Users send requests' },
    ],
    successCriteria: ['Add Client', 'Add Origin Server', 'Connect Client → Origin Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'First add Client, then add App Server (Origin), then connect them',
    level2: 'Drag Client and App Server from the sidebar, then drag from Client to App Server to connect',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Edge Locations - Bring Compute Closer
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🌍',
  scenario: "Your platform is growing! You now have users in Tokyo, London, Sydney, and Sao Paulo.",
  hook: "They're all complaining about latency. A user in Sydney waits 400ms for every request!",
  challenge: "Deploy edge locations globally so users connect to nearby servers instead of distant Virginia.",
  illustration: 'global-expansion',
};

const step2Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "You've gone global!",
  achievement: "Edge locations deployed worldwide",
  metrics: [
    { label: 'Tokyo latency', before: '250ms', after: '15ms' },
    { label: 'London latency', before: '80ms', after: '10ms' },
    { label: 'Sydney latency', before: '400ms', after: '20ms' },
    { label: 'Global coverage', after: '95%' },
  ],
  nextTeaser: "But how do clients know which edge location to connect to?",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Edge Locations: Distributed Points of Presence',
  conceptExplanation: `An **Edge Location (PoP)** is a small datacenter close to users.

**How it works:**
1. Deploy lightweight servers in Tokyo, London, Sydney, etc.
2. Users connect to their nearest edge location
3. Edge handles the request or proxies to origin
4. Latency drops from 250ms → 15ms!

**Edge Location Components:**
- Edge servers (run your code)
- Edge cache (store static content)
- Load balancers
- Network equipment

**Key insight:** Instead of one powerful datacenter, use 200+ small edge locations.`,

  whyItMatters: 'Edge locations are the foundation of low-latency global services. Without them, users far from your origin suffer.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Handling 46 million HTTP requests per second',
    howTheyDoIt: '310 cities, 120+ countries, 95% of internet users within 50ms',
  },

  famousIncident: {
    title: 'Pokémon GO Launch Disaster',
    company: 'Niantic',
    year: '2016',
    whatHappened: 'Pokémon GO launched without edge infrastructure. All requests from Japan, Europe, and US hit a single US datacenter. Latency was 500ms+ for international users. Servers melted under load. The game was unplayable for weeks.',
    lessonLearned: 'Global applications need global infrastructure from day one.',
    icon: '🎮',
  },

  keyPoints: [
    'Edge locations are geographically distributed datacenters',
    'Users connect to nearest edge for low latency',
    '200+ locations provide 95% global coverage',
    'Each edge location handles local traffic',
  ],

  diagram: `
┌─────────────┐                    ┌──────────────────┐
│   Client    │    15ms latency    │  Edge Location   │
│  (Tokyo)    │ ──────────────────▶│     (Tokyo)      │
└─────────────┘                    └────────┬─────────┘
                                            │
                                            │ Only if needed
                                            ▼
                                   ┌──────────────────┐
                                   │  Origin Server   │
                                   │    (Virginia)    │
                                   └──────────────────┘
`,

  keyConcepts: [
    { title: 'Edge Location (PoP)', explanation: 'Small datacenter close to users', icon: '📍' },
    { title: 'Geographic Distribution', explanation: 'Servers in many regions', icon: '🌍' },
    { title: 'Origin Server', explanation: 'Central server with source of truth', icon: '🏛️' },
  ],

  quickCheck: {
    question: 'How do edge locations reduce latency?',
    options: [
      'They have faster processors',
      'They use better algorithms',
      'They are physically closer to users',
      'They cache everything',
    ],
    correctIndex: 2,
    explanation: 'Edge locations reduce physical distance between user and server, cutting network latency.',
  },
};

const step2: GuidedStep = {
  id: 'edge-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'FR-3: Route requests to nearest edge location',
    taskDescription: 'Add CDN (edge network) between Client and Origin Server',
    componentsNeeded: [
      { type: 'client', reason: 'Global users', displayName: 'Client' },
      { type: 'cdn', reason: 'Global edge locations', displayName: 'CDN/Edge Network' },
      { type: 'app_server', reason: 'Origin server', displayName: 'Origin Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Users connect to nearest edge' },
      { from: 'CDN', to: 'Origin Server', reason: 'Edge proxies to origin when needed' },
    ],
    successCriteria: ['Add CDN component', 'Connect Client → CDN → Origin Server'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
    ],
  },
  hints: {
    level1: 'Build the path: Client → CDN → Origin Server',
    level2: 'Add CDN between Client and Origin Server, then connect all three',
    solutionComponents: [{ type: 'client' }, { type: 'cdn' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 3: Add Edge Caching - Make It Fast
// =============================================================================

const step3Story: StoryContent = {
  emoji: '📦',
  scenario: "Your edge locations are working! But there's a problem...",
  hook: "Every request still goes to Virginia! The edge locations are just expensive proxies. Latency improved slightly, but origin is still overwhelmed.",
  challenge: "Enable caching at edge locations so static assets are served instantly without hitting origin.",
  illustration: 'caching',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Edge caching is live!",
  achievement: "90% of requests served from edge cache",
  metrics: [
    { label: 'Cache hit rate', after: '90%' },
    { label: 'Origin load', before: '10M RPS', after: '1M RPS' },
    { label: 'Avg latency', before: '100ms', after: '12ms' },
    { label: 'p99 latency', before: '200ms', after: '25ms' },
  ],
  nextTeaser: "But origin is still a single point of failure...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Edge Caching: The Secret to CDN Performance',
  conceptExplanation: `**Edge caching** stores content at edge locations for instant delivery.

**How it works:**
1. First request: Edge doesn't have content → fetch from origin → cache at edge → serve to user
2. Subsequent requests: Edge has content → serve instantly (no origin trip!)
3. Content stays cached for TTL (time-to-live)

**What to cache:**
- Static assets: images, CSS, JS, fonts (cache for hours/days)
- HTML pages: cache for seconds/minutes with revalidation
- API responses: cache with short TTL or based on headers

**Cache headers:**
\`\`\`
Cache-Control: public, max-age=3600
\`\`\`

**Performance impact:**
- Cache hit: 10ms (edge only)
- Cache miss: 100ms (edge + origin)
- 90% cache hit rate = 90% of requests at 10ms!`,

  whyItMatters: 'Caching is what makes edge computing fast. Without caching, edge locations are just expensive proxies.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving cached content',
    howTheyDoIt: '90%+ cache hit rate for static assets. Origin servers handle only 10% of traffic.',
  },

  famousIncident: {
    title: 'GitHub CDN Cache Purge Incident',
    company: 'GitHub',
    year: '2018',
    whatHappened: 'A bug caused GitHub to purge all CDN cache worldwide simultaneously. Suddenly, every request hit origin servers. They went from handling 10K RPS to 500K RPS instantly. Site went down for 2 hours until cache rebuilt.',
    lessonLearned: 'Cache is critical infrastructure. Always have cache warming and gradual purge strategies.',
    icon: '💥',
  },

  keyPoints: [
    'Cache static assets at edge for instant delivery',
    'Cache hit = no origin request needed',
    'TTL controls how long content is cached',
    'High cache hit rate (90%+) drastically reduces origin load',
  ],

  diagram: `
Request 1 (Cache Miss):
┌────────┐    ┌──────┐    ┌────────┐
│ Client │───▶│ Edge │───▶│ Origin │
└────────┘    │Cache │◀───│ Server │
              └──┬───┘    └────────┘
                 │ Store in cache
                 ▼
              [cached!]

Request 2+ (Cache Hit):
┌────────┐    ┌──────┐
│ Client │───▶│ Edge │
└────────┘    │Cache │ (10ms - instant!)
              └──────┘
              [serve from cache]
`,

  keyConcepts: [
    { title: 'Cache Hit', explanation: 'Content found in cache - instant response', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Content not in cache - fetch from origin', icon: '❌' },
    { title: 'TTL', explanation: 'Time-To-Live: how long to cache content', icon: '⏰' },
  ],

  quickCheck: {
    question: 'With a 90% cache hit rate, how much traffic hits the origin?',
    options: [
      '90% of traffic',
      '50% of traffic',
      '10% of traffic',
      'All traffic',
    ],
    correctIndex: 2,
    explanation: 'Cache hit rate = percentage served from cache. 90% hit rate = only 10% reaches origin.',
  },
};

const step3: GuidedStep = {
  id: 'edge-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'FR-2: Cache static assets at edge locations',
    taskDescription: 'Add Cache component at the edge to reduce origin load',
    componentsNeeded: [
      { type: 'client', reason: 'Global users', displayName: 'Client' },
      { type: 'cdn', reason: 'Edge network with caching', displayName: 'CDN/Edge' },
      { type: 'cache', reason: 'Edge cache for static content', displayName: 'Edge Cache' },
      { type: 'app_server', reason: 'Origin server', displayName: 'Origin Server' },
    ],
    connectionsNeeded: [
      { from: 'Client', to: 'CDN', reason: 'Users connect to edge' },
      { from: 'CDN', to: 'Cache', reason: 'Edge checks cache first' },
      { from: 'CDN', to: 'Origin Server', reason: 'Fetch on cache miss' },
    ],
    successCriteria: ['Add Cache at edge', 'Configure TTL and cache strategy'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'app_server'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cdn', toType: 'app_server' },
    ],
    requireCacheStrategy: true,
  },
  hints: {
    level1: 'Add a Cache component and connect CDN to it',
    level2: 'CDN should connect to both Cache (check first) and Origin Server (fallback)',
    solutionComponents: [{ type: 'client' }, { type: 'cdn' }, { type: 'cache' }, { type: 'app_server' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'cache' },
      { from: 'cdn', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Database for Origin - Persist State
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💾',
  scenario: "Your edge functions are working great! But...",
  hook: "When you deploy new code or restart the origin server, all application state is lost. User sessions, feature flags, configuration - gone!",
  challenge: "Add a database to the origin to persist application state and data.",
  illustration: 'database',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Application state is now persistent!",
  achievement: "Database stores configuration and user data",
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'State survives restarts', after: '✓' },
  ],
  nextTeaser: "But the database is a single point of failure...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Origin Database: Centralized State',
  conceptExplanation: `Edge functions are **stateless** - they don't store data locally.

**Why?**
- Edge locations can fail or be updated
- Data needs to be consistent across all edges
- Some data (user accounts, configs) needs to be centralized

**What goes in origin database:**
- User accounts and profiles
- Application configuration
- Feature flags
- Analytics data
- KV data for edge functions

**Edge vs Origin pattern:**
- Edge: Stateless compute + cache
- Origin: Stateful database + source of truth`,

  whyItMatters: 'Edge functions need somewhere to read/write persistent data. Origin database provides centralized, consistent storage.',

  realWorldExample: {
    company: 'Cloudflare Workers',
    scenario: 'Stateless edge functions with KV storage',
    howTheyDoIt: 'Workers KV - globally distributed key-value store with eventual consistency',
  },

  keyPoints: [
    'Edge functions are stateless by design',
    'Origin database stores persistent data',
    'Edge caches frequently accessed data',
    'Centralized database ensures consistency',
  ],

  diagram: `
┌──────────────┐
│ Edge (Tokyo) │ ──────┐
└──────────────┘       │
                       │
┌──────────────┐       │     ┌──────────────┐
│Edge (London) │ ──────┼────▶│   Database   │
└──────────────┘       │     │   (Origin)   │
                       │     └──────────────┘
┌──────────────┐       │
│ Edge (Sydney)│ ──────┘
└──────────────┘

All edge locations read/write to central database
`,

  keyConcepts: [
    { title: 'Stateless', explanation: 'No persistent data stored locally', icon: '🔄' },
    { title: 'Stateful', explanation: 'Persistent data storage', icon: '💾' },
    { title: 'Source of Truth', explanation: 'Authoritative data location', icon: '🎯' },
  ],

  quickCheck: {
    question: 'Why are edge functions stateless?',
    options: [
      'To save memory',
      'To enable consistent data across all edge locations',
      'To make them faster',
      'Because databases are slow',
    ],
    correctIndex: 1,
    explanation: 'Stateless edge functions ensure all edge locations can serve requests consistently using shared origin data.',
  },
};

const step4: GuidedStep = {
  id: 'edge-step-4',
  stepNumber: 4,
  frIndex: 0,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Origin needs persistent storage for application state',
    taskDescription: 'Add Database to origin for persistent storage',
    componentsNeeded: [
      { type: 'database', reason: 'Store user data, configs, feature flags', displayName: 'Origin Database' },
    ],
    connectionsNeeded: [
      { from: 'Origin Server', to: 'Database', reason: 'Read/write application data' },
    ],
    successCriteria: ['Add Database', 'Connect Origin Server → Database'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add a Database and connect Origin Server to it',
    level2: 'Drag Database onto canvas, connect Origin Server → Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer - Scale the Origin
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚖️',
  scenario: "Success! Your edge network is handling 10M RPS globally.",
  hook: "But 10% of requests (1M RPS) are cache misses that hit origin. Your single origin server is melting!",
  challenge: "Add a load balancer to distribute origin traffic across multiple servers.",
  illustration: 'load-balancer',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: "Origin can now handle high traffic!",
  achievement: "Load balancer distributes cache misses across servers",
  metrics: [
    { label: 'Origin capacity', before: '1K RPS', after: '100K+ RPS' },
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
  ],
  nextTeaser: "But what if the origin database fails?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing at Origin',
  conceptExplanation: `Even with 90% cache hit rate, 10% of 10M RPS = 1M requests hit origin!

**Load Balancer distributes:**
- Cache misses from edge
- Dynamic API requests
- Write requests (can't be cached)
- Admin operations

**For edge platforms:**
- Edge → Load Balancer → Origin Servers
- Load balancer at origin (not at edge!)
- Edge locations already distribute global load
- Origin LB handles cache misses

**Benefits:**
- Horizontal scaling of origin
- No single point of failure
- Health checks remove failed servers`,

  whyItMatters: 'Cache misses still generate significant origin traffic. Load balancer enables origin to scale.',

  realWorldExample: {
    company: 'Fastly',
    scenario: 'Origin load balancing',
    howTheyDoIt: 'Edge shields (mid-tier cache) + origin load balancers to handle cache misses efficiently',
  },

  famousIncident: {
    title: 'Fastly Global Outage',
    company: 'Fastly',
    year: '2021',
    whatHappened: 'A configuration bug caused edge servers to return errors instead of serving cached content. All traffic suddenly hit origins. Origins couldn\'t handle 100x load spike. Major sites (Reddit, Amazon, NYT, Gov.uk) went down for an hour.',
    lessonLearned: 'Origin must be able to handle cache miss spikes. Load balancers and auto-scaling are critical.',
    icon: '🌩️',
  },

  keyPoints: [
    'Even with edge caching, origin gets significant traffic',
    'Load balancer enables origin horizontal scaling',
    'Cache miss = origin request',
    '1M origin RPS requires multiple servers + LB',
  ],

  diagram: `
┌──────────┐
│   Edge   │ ──┐
│ Network  │   │ 10% cache miss
└──────────┘   │
               ▼
         ┌─────────────┐        ┌────────────┐
         │    Load     │───────▶│  Origin 1  │
         │  Balancer   │───────▶│  Origin 2  │
         └─────────────┘───────▶│  Origin 3  │
                                └────────────┘
`,

  keyConcepts: [
    { title: 'Cache Miss Traffic', explanation: 'Requests that must hit origin', icon: '📊' },
    { title: 'Origin Scaling', explanation: 'Multiple servers behind LB', icon: '📈' },
  ],

  quickCheck: {
    question: 'With 10M global RPS and 90% cache hit rate, how much traffic hits origin?',
    options: [
      '10M RPS',
      '9M RPS',
      '1M RPS',
      '100K RPS',
    ],
    correctIndex: 2,
    explanation: '10% cache miss rate = 10% of traffic hits origin = 1M RPS.',
  },
};

const step5: GuidedStep = {
  id: 'edge-step-5',
  stepNumber: 5,
  frIndex: 0,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'Origin must handle cache miss traffic at scale',
    taskDescription: 'Add Load Balancer at origin to distribute cache misses',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute cache miss traffic', displayName: 'Origin Load Balancer' },
    ],
    connectionsNeeded: [
      { from: 'CDN', to: 'Load Balancer', reason: 'Cache misses go through LB' },
      { from: 'Load Balancer', to: 'Origin Server', reason: 'LB distributes to servers' },
    ],
    successCriteria: ['Add Load Balancer', 'Reroute CDN → LB → Origin Server'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Load Balancer between CDN and Origin Server',
    level2: 'Insert LB: CDN → Load Balancer → Origin Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'cdn', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Database Replication - High Availability
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Disaster strikes! Your origin database crashed at 3 AM.",
  hook: "All edge locations can't read configs or user data. Edge cache still works, but any dynamic request fails. Your platform is partially down!",
  challenge: "Add database replication to survive failures.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '✅',
  message: "Database is now highly available!",
  achievement: "Replication ensures no single point of failure",
  metrics: [
    { label: 'Database availability', before: '99.5%', after: '99.99%' },
    { label: 'Data loss on failure', before: 'Possible', after: 'Zero' },
  ],
  nextTeaser: "But deploying new edge functions is manual and slow...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Database Replication for Edge Platforms',
  conceptExplanation: `Edge platforms read from database for:
- Feature flags
- User authentication
- Configuration
- KV storage lookups

**Replication strategy:**
- Primary: Handles writes
- Replicas: Handle reads (from edge locations)
- Async replication: Acceptable for edge use cases
- Geo-distributed replicas: Reduce read latency

**Read pattern:**
- Edge locations read from nearest replica
- Tokyo edge → Tokyo replica (10ms)
- vs. Tokyo edge → Virginia primary (100ms)

**Why async is OK:**
- Edge cache handles most reads
- Eventual consistency acceptable for configs
- Critical data can use primary reads`,

  whyItMatters: 'Database failure takes down all edge functions that need state. Replication provides redundancy and faster reads.',

  realWorldExample: {
    company: 'Cloudflare Workers KV',
    scenario: 'Global key-value storage',
    howTheyDoIt: 'Replicated across all edge locations with eventual consistency',
  },

  keyPoints: [
    'Replicate database for high availability',
    'Geo-distributed replicas reduce read latency',
    'Async replication is fine for edge configs',
    'Primary handles writes, replicas handle reads',
  ],

  diagram: `
┌────────────┐
│  Primary   │ ← Writes
│ (Virginia) │
└─────┬──────┘
      │ Replicate
      ├──────────────────────┐
      ▼                      ▼
┌────────────┐        ┌────────────┐
│ Replica 1  │        │ Replica 2  │
│  (Tokyo)   │        │  (London)  │
└─────┬──────┘        └─────┬──────┘
      │ Read                 │ Read
      ▼                      ▼
Edge (Tokyo)           Edge (London)
`,

  keyConcepts: [
    { title: 'Read Replica', explanation: 'Copy of database for reads', icon: '📖' },
    { title: 'Geo-Distribution', explanation: 'Replicas in multiple regions', icon: '🌍' },
    { title: 'Eventual Consistency', explanation: 'Replicas sync eventually', icon: '⏱️' },
  ],

  quickCheck: {
    question: 'Why use async replication for edge database reads?',
    options: [
      'It\'s faster than sync',
      'Eventual consistency is acceptable for edge configs/cache',
      'It\'s cheaper',
      'It prevents data loss',
    ],
    correctIndex: 1,
    explanation: 'Edge functions mostly read cached/config data where eventual consistency is acceptable.',
  },
};

const step6: GuidedStep = {
  id: 'edge-step-6',
  stepNumber: 6,
  frIndex: 0,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'Database must be highly available for edge functions',
    taskDescription: 'Enable database replication with 2+ replicas',
    successCriteria: [
      'Click Database component',
      'Enable replication',
      'Set 2+ replicas',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'load_balancer', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Click Database and enable replication with 2+ replicas',
    level2: 'Database → Configuration → Enable Replication → Set replicas to 2+',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Message Queue - Deploy Edge Functions Globally
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🚀',
  scenario: "Developers deploy edge functions manually by SSH-ing to each edge location. It takes hours!",
  hook: "A critical security fix needs to deploy NOW. But it will take 6 hours to update all 200 edge locations manually.",
  challenge: "Add a message queue to distribute edge function deployments globally in seconds.",
  illustration: 'deployment',
};

const step7Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Global deployment is now instant!",
  achievement: "Deploy to all edge locations in under 30 seconds",
  metrics: [
    { label: 'Deployment time', before: '6 hours', after: '30 seconds' },
    { label: 'Edge locations updated', after: '200+' },
  ],
  nextTeaser: "Almost done! Let's optimize the final architecture...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Global Deployment Pipeline',
  conceptExplanation: `Deploying to 200+ edge locations requires coordination.

**The Challenge:**
1. Developer pushes new function code
2. Code needs to reach ALL edge locations
3. Deployment must be atomic (all or nothing)
4. Old code must continue serving until new code ready
5. Target: < 30 seconds global deployment

**Message Queue Solution:**
1. Developer pushes code → CI/CD → Object Storage
2. Deployment service publishes to message queue
3. Each edge location subscribes to queue
4. All edges pull new code simultaneously
5. Blue-green deployment: switch atomically

**Benefits:**
- Instant global distribution
- Fan-out pattern (1 → 200+)
- Reliable delivery
- Rollback capability`,

  whyItMatters: 'Fast deployment enables rapid iteration and emergency fixes. Slow deployment = slow response to issues.',

  realWorldExample: {
    company: 'Cloudflare Workers',
    scenario: 'Deploying serverless functions globally',
    howTheyDoIt: 'Workers deployed to 310+ locations in < 15 seconds using distributed consensus',
  },

  famousIncident: {
    title: 'Cloudflare CPU Spike Incident',
    company: 'Cloudflare',
    year: '2019',
    whatHappened: 'A regex bug in a WAF rule caused CPU to spike to 100% across ALL edge locations simultaneously. The bug was in a globally deployed rule. Because deployment was global, the outage was global. Took 30 minutes to deploy the fix.',
    lessonLearned: 'Fast global deployment is critical for both features AND fixes. Canary deployments can prevent global impact.',
    icon: '🔥',
  },

  keyPoints: [
    'Message queue coordinates global deployments',
    'Fan-out pattern: 1 message → 200+ edges',
    'Atomic deployment: all edges switch together',
    'Deploy globally in < 30 seconds',
  ],

  diagram: `
Developer Push
      │
      ▼
┌─────────────┐
│   CI/CD     │
└──────┬──────┘
       │ Publish
       ▼
┌─────────────────┐
│ Message Queue   │
└────────┬────────┘
         │ Fan-out
    ┌────┼────┬────┐
    ▼    ▼    ▼    ▼
 Edge  Edge Edge Edge
  #1    #2   #3  #200

All edges pull new code simultaneously
`,

  keyConcepts: [
    { title: 'Fan-out', explanation: '1 message broadcasts to N consumers', icon: '📢' },
    { title: 'Atomic Deployment', explanation: 'All instances switch simultaneously', icon: '⚛️' },
    { title: 'Blue-Green', explanation: 'Deploy new version, switch atomically', icon: '🔄' },
  ],

  quickCheck: {
    question: 'Why use message queue for edge deployments?',
    options: [
      'It\'s cheaper than SSH',
      'Enables instant fan-out to all edge locations simultaneously',
      'It\'s more secure',
      'It uses less bandwidth',
    ],
    correctIndex: 1,
    explanation: 'Message queue enables 1-to-many broadcast, deploying to 200+ edges simultaneously.',
  },
};

const step7: GuidedStep = {
  id: 'edge-step-7',
  stepNumber: 7,
  frIndex: 0,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'Deploy edge functions globally in under 30 seconds',
    taskDescription: 'Add Message Queue for coordinated global deployments',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Coordinate edge deployments', displayName: 'Message Queue' },
    ],
    connectionsNeeded: [
      { from: 'Origin Server', to: 'Message Queue', reason: 'Publish deployment messages' },
      { from: 'CDN', to: 'Message Queue', reason: 'Edge locations subscribe for updates' },
    ],
    successCriteria: ['Add Message Queue', 'Connect for deployment coordination'],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'load_balancer', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },
  hints: {
    level1: 'Add Message Queue and connect it for deployment coordination',
    level2: 'Origin Server publishes deployments to queue, CDN subscribes to receive updates',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 8: Optimize and Scale - Multiple Origin Servers
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📊',
  scenario: "Your edge platform is handling 10M RPS globally! But there's one last bottleneck...",
  hook: "Even with the load balancer, you only have a few origin servers. Cache miss spikes during viral traffic overwhelm them.",
  challenge: "Configure multiple origin server instances to handle cache miss traffic at scale.",
  illustration: 'scaling',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: "Congratulations! You built a global edge platform!",
  achievement: "Your Cloudflare Workers-style platform is complete",
  metrics: [
    { label: 'Global RPS', after: '10M+' },
    { label: 'Edge locations', after: '200+' },
    { label: 'Cache hit rate', after: '90%' },
    { label: 'Global p99 latency', after: '< 50ms' },
    { label: 'Origin availability', after: '99.99%' },
  ],
  nextTeaser: "You've mastered edge computing architecture!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling the Complete Edge Platform',
  conceptExplanation: `**Your complete edge architecture:**

**Edge Layer (Global):**
- 200+ edge locations
- Edge cache (90% hit rate)
- Edge functions (V8 isolates)
- Anycast routing

**Origin Layer (Centralized):**
- Load balancer
- Multiple origin servers (auto-scale)
- Replicated database
- Message queue for deployments

**Request Flow:**
1. User request → Anycast DNS → Nearest edge
2. Edge checks cache → 90% served instantly
3. Cache miss → Load balancer → Origin server
4. Origin → Database → Return to edge → Cache → User

**Key Metrics:**
- 10M global RPS
- 90% edge cache hit rate
- 1M origin RPS (10% cache miss)
- p99 < 50ms globally
- p99 < 10ms for cached content`,

  whyItMatters: 'This architecture powers platforms like Cloudflare, Fastly, and AWS CloudFront - serving trillions of requests daily.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Handling 46M HTTP requests/second',
    howTheyDoIt: '310 edge locations, 200+ Tbps network capacity, 99.99% uptime SLA',
  },

  famousIncident: {
    title: 'Cloudflare Backbone Outage',
    company: 'Cloudflare',
    year: '2020',
    whatHappened: 'A router configuration error in their backbone network caused edge locations to lose connectivity to origin. Cached content still worked (90%), but dynamic requests failed. 27-minute outage. Shows importance of edge caching even during failures.',
    lessonLearned: 'High cache hit rate provides resilience. Even when origin fails, cached content keeps serving.',
    icon: '🌐',
  },

  keyPoints: [
    'Edge caching (90%+) is critical for scale',
    'Origin must handle cache miss traffic (10%)',
    'Multiple origin servers behind load balancer',
    'Database replication for high availability',
    'Message queue for instant global deployments',
  ],

  diagram: `
┌─────────────────────────────────────────────────┐
│         GLOBAL EDGE PLATFORM                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐                                   │
│  │  Client  │                                   │
│  └─────┬────┘                                   │
│        │ Anycast                                │
│        ▼                                        │
│  ┌──────────┐         ┌──────────┐             │
│  │Edge (200+)│────────▶│Edge Cache│ 90% hit    │
│  └─────┬────┘         └──────────┘             │
│        │ 10% miss                               │
│        ▼                                        │
│  ┌──────────────┐                               │
│  │     Load     │                               │
│  │   Balancer   │                               │
│  └──────┬───────┘                               │
│    ┌────┼────┬────┐                             │
│    ▼    ▼    ▼    ▼                             │
│  ┌────┐┌────┐┌────┐                             │
│  │Srv1││Srv2││Srv3│                             │
│  └──┬─┘└──┬─┘└──┬─┘                             │
│     │     │     │                               │
│     └─────┼─────┘                               │
│           ▼                                     │
│    ┌────────────┐        ┌──────────┐          │
│    │  Database  │◀───────│  Queue   │          │
│    │(Replicated)│        │(Deploy)  │          │
│    └────────────┘        └──────────┘          │
└─────────────────────────────────────────────────┘
`,

  keyConcepts: [
    { title: 'Edge-First', explanation: 'Serve from edge whenever possible', icon: '🌍' },
    { title: 'Origin Fallback', explanation: 'Origin handles cache misses', icon: '🏛️' },
    { title: 'Global Scale', explanation: 'Distributed architecture for billions of requests', icon: '📈' },
  ],

  quickCheck: {
    question: 'With 10M global RPS and 90% cache hit rate, how many origin servers do you need?',
    options: [
      '1 server (cache handles most traffic)',
      '10+ servers (1M cache miss RPS is still massive)',
      'No origin servers (100% cached)',
      '1000+ servers',
    ],
    correctIndex: 1,
    explanation: '1M RPS hitting origin requires 10+ servers. Each server typically handles 10K-100K RPS.',
  },
};

const step8: GuidedStep = {
  id: 'edge-step-8',
  stepNumber: 8,
  frIndex: 0,
  story: step8Story,
  celebration: step8Celebration,
  learnPhase: step8LearnPhase,
  practicePhase: {
    frText: 'Origin must handle cache miss traffic at global scale',
    taskDescription: 'Configure multiple origin server instances (2+)',
    successCriteria: [
      'Click Origin Server component',
      'Set instance count to 2+',
      'Verify all configurations: caching, replication, load balancing',
    ],
  },
  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'load_balancer', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cdn', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireDatabaseReplication: true,
    requireCacheStrategy: true,
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Click Origin Server and increase instance count to 2+',
    level2: 'Configure App Server instances to handle cache miss load. Verify database replication and cache strategy are enabled.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const edgeComputingGuidedTutorial: GuidedTutorial = {
  problemId: 'edge-computing',
  title: 'Design a Global Edge Computing Platform',
  description: 'Build a Cloudflare Workers-style edge platform with global distribution, low latency, and edge caching',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🌍',
    hook: "Welcome to EdgeTech - building the future of global compute!",
    scenario: "Your mission: Build a Cloudflare Workers-style platform that runs code at the edge, serving billions of requests daily with sub-50ms latency worldwide.",
    challenge: "Can you design a globally distributed edge platform with 200+ locations and 90% cache hit rate?",
  },

  requirementsPhase: edgeComputingRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Edge Computing',
    'Global Distribution',
    'Edge Locations (PoP)',
    'CDN Architecture',
    'Edge Caching',
    'Anycast Routing',
    'Cache Hit Ratio',
    'Origin Servers',
    'Load Balancing',
    'Database Replication',
    'Global Deployment',
    'Serverless Edge Functions',
    'Low-Latency Architecture',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 5: Replication (Geographic distribution)',
    'Chapter 6: Partitioning (Distributed systems)',
  ],
};

export default edgeComputingGuidedTutorial;
