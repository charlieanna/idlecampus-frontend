import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Static Content CDN Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching CDN fundamentals through building
 * a content delivery network for a news website.
 *
 * Key Concepts:
 * - CDN edge caching
 * - Cache invalidation strategies
 * - Origin shielding
 * - Cache hit rate optimization
 * - Global content delivery
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const staticContentCdnRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a CDN for a news website serving static content",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Infrastructure Lead at GlobalNews',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What types of content does this news website need to deliver?",
      answer: "The website serves static assets:\n\n1. **Images** - Article photos, thumbnails, graphics\n2. **CSS** - Stylesheets for page rendering\n3. **JavaScript** - Client-side code for interactivity\n4. **Videos** - Embedded news clips (optional)\n\nThese assets rarely change once published, making them perfect for CDN caching.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Static content is immutable or rarely changes - ideal for aggressive caching",
    },
    {
      id: 'asset-upload',
      category: 'functional',
      question: "How do assets get into the CDN? Where's the origin?",
      answer: "Journalists and editors upload assets (images, CSS, JS) to an origin storage system (like S3). The CDN pulls from this origin when needed and caches at edge locations.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "CDN needs an origin - the source of truth for all content",
    },
    {
      id: 'content-delivery',
      category: 'functional',
      question: "How should users access these assets?",
      answer: "Users browse news articles. The HTML references assets via CDN URLs like 'cdn.news.com/images/breaking-news.jpg'. The CDN serves from the nearest edge location.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "CDN acts as a proxy between users and origin storage",
    },
    {
      id: 'cache-invalidation',
      category: 'functional',
      question: "What happens if we need to update an asset that's already cached?",
      answer: "We need cache invalidation. When an asset is updated, we invalidate the old cached version so the CDN fetches the new one from origin.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Cache invalidation is one of the two hard problems in computer science",
    },
    {
      id: 'cdn-stats',
      category: 'functional',
      question: "Do we need visibility into CDN performance?",
      answer: "Yes! We need stats like cache hit rate, number of cached items, and origin requests. This helps us optimize caching strategy.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Observability is critical for optimizing CDN performance",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests per second should we handle?",
      answer: "20,000 requests per second for static assets globally during peak traffic",
      importance: 'critical',
      learningPoint: "High RPS requires edge caching close to users",
    },
    {
      id: 'cache-hit-rate',
      category: 'performance',
      question: "What cache hit rate should we target?",
      answer: "95% cache hit rate. This means 95% of requests are served from edge cache, only 5% hit the origin. This minimizes origin load and costs.",
      importance: 'critical',
      calculation: {
        formula: "20K RPS × 5% miss rate = 1K origin requests/sec",
        result: "95% hit rate reduces origin load by 20x",
      },
      learningPoint: "High cache hit rate is the primary goal of CDN optimization",
    },
    {
      id: 'latency-requirement',
      category: 'latency',
      question: "What's the latency target for asset delivery?",
      answer: "p99 latency under 50ms from edge locations worldwide. Users expect instant page loads.",
      importance: 'critical',
      learningPoint: "Edge caching enables low latency by serving from nearby locations",
    },
    {
      id: 'availability',
      category: 'availability',
      question: "What if the origin storage goes down?",
      answer: "Content should still be served from edge caches even during origin failures. CDN acts as a buffer against origin outages.",
      importance: 'critical',
      learningPoint: "CDN provides resilience through edge caching",
    },
    {
      id: 'geographic-distribution',
      category: 'throughput',
      question: "Where are your users located?",
      answer: "Global audience - North America, Europe, Asia. We need edge locations in all major regions for low latency delivery.",
      importance: 'important',
      insight: "Global CDN requires presence in multiple regions",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'content-delivery', 'cache-invalidation', 'cache-hit-rate'],
  criticalFRQuestionIds: ['core-features', 'asset-upload', 'content-delivery', 'cache-invalidation'],
  criticalScaleQuestionIds: ['throughput-requests', 'cache-hit-rate', 'latency-requirement', 'availability'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Upload static assets to origin',
      description: 'Editors can upload images, CSS, JS to origin storage (S3)',
      emoji: '📤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Serve assets from CDN edges',
      description: 'Users access assets via CDN with automatic origin fallback',
      emoji: '🌍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Invalidate cached assets',
      description: 'Ability to purge stale content from edge caches',
      emoji: '🗑️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Monitor CDN statistics',
      description: 'Track cache hit rate and performance metrics',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'Millions globally',
    writesPerDay: 'Few thousand asset uploads',
    readsPerDay: '~1.7 billion asset requests',
    peakMultiplier: 2,
    readWriteRatio: '100000:1',
    calculatedWriteRPS: { average: 10, peak: 20 },
    calculatedReadRPS: { average: 20000, peak: 40000 },
    maxPayloadSize: '~5MB per asset',
    storagePerRecord: '~2MB average',
    storageGrowthPerYear: '~100TB',
    redirectLatencySLA: 'p99 < 50ms',
    createLatencySLA: 'p99 < 2s',
  },

  architecturalImplications: [
    '✅ 20K RPS → Edge caching absolutely required',
    '✅ 95% hit rate → Aggressive caching with long TTL',
    '✅ Global users → Multiple edge locations worldwide',
    '✅ p99 < 50ms → Content must be cached close to users',
    '✅ Origin failures → Edge cache provides resilience',
    '✅ Read-heavy (100K:1) → Origin shielding beneficial',
  ],

  outOfScope: [
    'Dynamic content (personalization)',
    'Real-time video streaming (live)',
    'User authentication/authorization',
    'Content compression (assume pre-compressed)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where assets are uploaded to origin storage and served to users. Then we'll add CDN edge caching to make it FAST and SCALABLE. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Origin Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌐',
  scenario: "Welcome to GlobalNews! You're building a content delivery system.",
  hook: "Your first task: Readers need to load article images and stylesheets from your servers.",
  challenge: "Set up the basic flow so users can request static assets.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your content delivery system is online!',
  achievement: 'Users can now request assets from your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can serve assets', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know where assets are stored...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Origin Server',
  conceptExplanation: `Every CDN needs an **origin server** - the source of truth for content.

When a user requests an asset:
1. Their browser sends a request
2. The request reaches your **App Server** (origin)
3. The server responds with the asset

This is the simplest possible architecture. It works, but has problems we'll solve later!`,

  whyItMatters: 'Without an origin server, there\'s no source of truth for your content. The CDN will cache content, but it needs to fetch it from somewhere first.',

  keyPoints: [
    'Origin server is the source of truth for all content',
    'CDN will pull content from origin when cache misses',
    'For now, we\'re just building the basic request flow',
  ],

  keyConcepts: [
    { title: 'Origin', explanation: 'The server that holds the original content', icon: '🎯' },
    { title: 'Client', explanation: 'User\'s browser requesting assets', icon: '👤' },
    { title: 'Static Asset', explanation: 'Image, CSS, JS file that rarely changes', icon: '📄' },
  ],
};

const step1: GuidedStep = {
  id: 'cdn-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up basic content delivery',
    taskDescription: 'Add a Client and App Server (origin), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing the news website', displayName: 'Client' },
      { type: 'app_server', reason: 'Origin server that will handle asset requests', displayName: 'Origin Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server (origin) component added to canvas',
      'Client connected to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette onto the canvas',
    level2: 'Click the Client, then click the App Server to create a connection between them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Add Object Storage for Static Assets
// =============================================================================

const step2Story: StoryContent = {
  emoji: '📦',
  scenario: "Journalists are trying to upload breaking news photos, but there's nowhere to store them!",
  hook: "Your origin server is just processing requests - it's not designed to store thousands of images, CSS files, and JavaScript bundles.",
  challenge: "Add object storage (S3) to store all static assets persistently.",
  illustration: 'storage-needed',
};

const step2Celebration: CelebrationContent = {
  emoji: '☁️',
  message: 'Assets now have a proper home!',
  achievement: 'Object storage handles unlimited static files',
  metrics: [
    { label: 'Storage capacity', after: 'Unlimited (S3)' },
    { label: 'Assets uploaded', after: '✓' },
  ],
  nextTeaser: "But every request is hitting the origin across the internet...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: Home for Static Assets',
  conceptExplanation: `**Object Storage** (like AWS S3) is perfect for static assets:

- **Scalability**: Store unlimited files
- **Durability**: 99.999999999% (11 nines) - your files won't disappear
- **Cost-effective**: Pay only for what you use
- **HTTP access**: Serve files via URLs

**Architecture**:
- **App Server (Origin)**: Coordinates requests, fetches from S3
- **Object Storage (S3)**: Stores actual image/CSS/JS files
- **URL mapping**: /images/photo.jpg → s3://bucket/images/photo.jpg`,

  whyItMatters: 'You can\'t store thousands of images in your app server\'s file system. Object storage provides scalable, durable storage for static content.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Storing petabytes of video assets',
    howTheyDoIt: 'Uses AWS S3 for video storage, with each title encoded in multiple formats. CDN (Open Connect) caches from S3.',
  },

  keyPoints: [
    'Object storage for files, app server for coordination',
    'S3 provides unlimited, durable storage',
    'Origin server fetches from S3 when needed',
    'This becomes the "origin" that CDN will cache from',
  ],

  diagram: `
┌─────────┐    request    ┌─────────────┐   fetch   ┌────────────┐
│ Client  │ ────────────→ │   Origin    │ ────────→ │  S3 Bucket │
│ Browser │               │   Server    │           │  (Storage) │
└─────────┘               └─────────────┘           └────────────┘
                               ↓
                          Return asset to client
`,

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-like storage for files', icon: '📦' },
    { title: 'Origin', explanation: 'Server that fetches from storage', icon: '🎯' },
    { title: 'Durability', explanation: '11 nines - virtually never lose data', icon: '🛡️' },
  ],

  quickCheck: {
    question: 'Why use object storage instead of storing files on the app server?',
    options: [
      'Object storage is faster',
      'App servers are designed for compute, not storage at scale',
      'Object storage is required for CDN',
      'It\'s cheaper',
    ],
    correctIndex: 1,
    explanation: 'App servers are stateless and designed for processing requests, not storing petabytes of files. Object storage is purpose-built for scalable file storage.',
  },
};

const step2: GuidedStep = {
  id: 'cdn-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Upload and store static assets',
    taskDescription: 'Add Object Storage and connect Origin Server to it',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store static assets (images, CSS, JS)', displayName: 'S3 Storage' },
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
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect Origin Server to Object Storage - this is where assets are stored',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 3: Add CDN for Edge Caching
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌍',
  scenario: "Breaking news! A major story just broke and millions are visiting your site.",
  hook: "Users in Asia are experiencing 2-second load times for images. Every request travels to your US-based origin server - that's 200ms+ of network latency EACH TIME!",
  challenge: "Add a CDN to cache content at edge locations worldwide.",
  illustration: 'global-latency',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Assets now load instantly worldwide!',
  achievement: 'CDN edge caching reduces latency from 2s to 50ms',
  metrics: [
    { label: 'Latency (Tokyo)', before: '2000ms', after: '50ms' },
    { label: 'Origin requests', before: '20K/sec', after: '1K/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But we need to ensure the CDN always has fresh content...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: The Core of Content Delivery',
  conceptExplanation: `A **CDN** (Content Delivery Network) is THE solution for serving static content globally.

**How it works**:
1. User in Tokyo requests /images/breaking.jpg
2. Request goes to nearest CDN edge (Tokyo)
3. **Cache HIT**: Edge has it → serve instantly (10ms)
4. **Cache MISS**: Edge fetches from origin → cache it → serve (200ms first time, 10ms after)

**Why CDN is critical**:
- **Low latency**: Content served from nearby edge (< 50ms)
- **Reduced origin load**: 95% of requests never hit origin
- **Scalability**: Edge handles the load, not your origin
- **Resilience**: Edge cache works even if origin fails

**CloudFront/Akamai/Fastly**: Global edge networks with 100+ locations`,

  whyItMatters: 'Without CDN, every user request travels to your origin. With global traffic, this means terrible latency and your origin gets hammered.',

  famousIncident: {
    title: 'Fastly CDN Outage',
    company: 'Fastly',
    year: '2021',
    whatHappened: 'A software bug in Fastly\'s CDN caused a massive outage affecting Reddit, Amazon, NYTimes, and thousands of sites for an hour. The internet essentially broke.',
    lessonLearned: 'CDN has become critical infrastructure. Always have fallback strategies (multi-CDN or direct-to-origin failover).',
    icon: '🌐',
  },

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving trillions of requests per month',
    howTheyDoIt: 'Cloudflare has 300+ edge locations globally. Assets are cached at edges with intelligent cache warming and purging.',
  },

  diagram: `
User in Tokyo:
┌─────────┐   10ms    ┌──────────────┐
│  User   │◀─────────▶│ CDN Edge     │  ← Cache HIT (95%)
│ (Tokyo) │           │ (Tokyo)      │
└─────────┘           └──────┬───────┘
                             │
                             │ Cache MISS (5%)
                             │ 200ms
                             ▼
                      ┌──────────────┐
                      │   Origin     │
                      │   Server     │
                      │   (US-East)  │
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │  S3 Storage  │
                      └──────────────┘
`,

  keyPoints: [
    'CDN edge servers cache content close to users',
    'Cache HIT = fast (10-50ms), Cache MISS = slower (200ms+)',
    '95% hit rate means 95% of requests served from edge',
    'Origin load reduced 20x (only serving 5% of traffic)',
    'CDN is between client and origin - acts as proxy',
  ],

  quickCheck: {
    question: 'Why does CDN dramatically improve latency?',
    options: [
      'CDN has faster servers',
      'CDN compresses content',
      'Content served from edge close to user, not distant origin',
      'CDN uses better network protocols',
    ],
    correctIndex: 2,
    explanation: 'Physics matters! CDN edge in Tokyo is 10ms away, origin in US is 200ms away. Proximity is the key.',
  },

  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN server close to users', icon: '📍' },
    { title: 'Cache Hit', explanation: 'Content found in edge cache', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Must fetch from origin', icon: '❌' },
    { title: 'Origin Shield', explanation: 'Layer between edges and origin (later!)', icon: '🛡️' },
  ],
};

const step3: GuidedStep = {
  id: 'cdn-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Serve assets from CDN with low latency',
    taskDescription: 'Add CDN and connect it to Origin Server and Object Storage',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache content at global edge locations', displayName: 'CDN (CloudFront)' },
    ],
    successCriteria: [
      'CDN component added',
      'Client connected to CDN (not directly to origin anymore)',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add CDN component and rewire: Client → CDN → Origin',
    level2: 'CDN sits between client and origin. Client connects to CDN, CDN connects to Object Storage.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 4: Implement Cache Invalidation
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⚠️',
  scenario: "A breaking news story was updated with a correction, and the image changed.",
  hook: "But readers are still seeing the OLD image! It's cached at hundreds of edge locations worldwide. The correction isn't reaching users!",
  challenge: "Implement cache invalidation so updated content reaches users quickly.",
  illustration: 'stale-cache',
};

const step4Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Cache invalidation is working!',
  achievement: 'Updated content now propagates to all edges',
  metrics: [
    { label: 'Invalidation time', after: '< 30 seconds' },
    { label: 'Stale content', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "But invalidating is expensive. How do we optimize?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation: The Hard Problem',
  conceptExplanation: `**"There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton**

**The problem**:
When you update an asset, it's cached at 200+ edge locations. How do you update them all?

**Three strategies**:

**1. TTL (Time To Live)** - Passive
- Set expiration time (e.g., 1 hour)
- After TTL expires, edge refetches from origin
- **Pros**: Simple, no action needed
- **Cons**: Stale content for up to TTL duration

**2. Purge/Invalidate** - Active
- Explicitly tell CDN: "Delete /images/photo.jpg from all edges"
- **Pros**: Immediate update
- **Cons**: Costs money, takes time to propagate

**3. Versioned URLs** - Best practice!
- photo.jpg → photo-v2.jpg or photo.jpg?v=2
- New version = new URL = no cache collision
- **Pros**: Instant, no invalidation needed
- **Cons**: Requires URL management

**For news sites**: Combine TTL (1-hour) + explicit invalidation for urgent updates.`,

  whyItMatters: 'Stale cached content can spread misinformation or show outdated prices. Cache invalidation ensures users see fresh content.',

  famousIncident: {
    title: 'CloudFlare Cache Poisoning',
    company: 'CloudFlare',
    year: '2017',
    whatHappened: 'A bug caused CloudFlare to cache and serve sensitive data (API keys, passwords) that shouldn\'t be cached. The data was served from cache to wrong users for hours.',
    lessonLearned: 'Cache invalidation and cache control headers are security-critical. Never cache sensitive data.',
    icon: '🔐',
  },

  realWorldExample: {
    company: 'New York Times',
    scenario: 'Breaking news updates',
    howTheyDoIt: 'Uses versioned URLs for images (immutable) + short TTL (5 min) for HTML. For urgent corrections, they trigger explicit CloudFront invalidations.',
  },

  diagram: `
Cache Invalidation Flow:
┌──────────────┐
│   Editor     │  1. Updates asset in S3
│   Updates    │
└──────┬───────┘
       │
       ▼
┌──────────────┐  2. Triggers invalidation API
│ Invalidation │ ────────────────────┐
│     API      │                     │
└──────────────┘                     │
                                     ▼
                          ┌──────────────────┐
                          │  CDN Control     │
                          │  Plane           │
                          └─────────┬────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────┐    ┌──────────┐    ┌──────────┐
            │ Edge (US)│    │Edge (EU) │    │Edge (Asia)│
            │  Purge   │    │  Purge   │    │  Purge   │
            └──────────┘    └──────────┘    └──────────┘
`,

  keyPoints: [
    'Cache invalidation = removing stale content from edges',
    'TTL provides automatic expiration',
    'Explicit purge for urgent updates',
    'Versioned URLs avoid invalidation entirely',
    'Invalidation costs money and takes time',
  ],

  quickCheck: {
    question: 'What\'s the best approach for assets that never change (like product images)?',
    options: [
      'Short TTL (5 minutes)',
      'Invalidate on every update',
      'Versioned URLs with long TTL (1 year)',
      'No caching',
    ],
    correctIndex: 2,
    explanation: 'Immutable content + versioned URLs = maximum cache hit rate. photo-v1.jpg is forever v1, photo-v2.jpg is a new file.',
  },

  keyConcepts: [
    { title: 'TTL', explanation: 'Time To Live - auto expiration', icon: '⏰' },
    { title: 'Purge', explanation: 'Explicit cache deletion', icon: '🗑️' },
    { title: 'Versioning', explanation: 'New version = new URL', icon: '🔢' },
    { title: 'Stale', explanation: 'Cached content that\'s outdated', icon: '⚠️' },
  ],
};

const step4: GuidedStep = {
  id: 'cdn-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Invalidate cached content when needed',
    taskDescription: 'Configure cache invalidation strategy on the CDN',
    successCriteria: [
      'CDN configured with TTL settings',
      'Invalidation API endpoint available',
      'Cache purge strategy documented',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Your architecture is already correct - this step is about understanding invalidation',
    level2: 'Review the learning content to understand TTL, purge, and versioning strategies',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Origin Shield
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Your CDN has 200 edge locations, and when cache expires, they ALL request from origin at once!",
  hook: "Every 1-hour when TTL expires, you see traffic spikes to origin - 200 edges simultaneously refetching the same files. This is wasteful and expensive!",
  challenge: "Add origin shield - a centralized cache layer between edges and origin.",
  illustration: 'origin-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Origin shield is protecting your origin!',
  achievement: 'Origin requests reduced by 99%',
  metrics: [
    { label: 'Origin requests', before: '1K/sec', after: '10/sec' },
    { label: 'Origin bandwidth cost', before: '$5K/mo', after: '$50/mo' },
    { label: 'Cache efficiency', after: '99.9%' },
  ],
  nextTeaser: "Now let's optimize cache hit rates further...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Origin Shield: Protecting Your Origin',
  conceptExplanation: `**Origin Shield** is a centralized caching layer between edge locations and origin.

**Without Origin Shield**:
\`\`\`
200 edges → Origin (200 requests for same file)
\`\`\`

**With Origin Shield**:
\`\`\`
200 edges → Origin Shield → Origin (1 request)
\`\`\`

**How it works**:
1. Edge cache miss in Tokyo
2. Tokyo edge requests from Origin Shield (US-East)
3. **Shield HIT**: Return to Tokyo edge
4. **Shield MISS**: Shield fetches from origin once, caches it
5. Other edges (London, Paris) also miss → all hit Shield → same cached copy

**Benefits**:
- **Collapse requests**: 200 edge misses → 1 origin request
- **Reduce origin load**: 99% reduction in origin traffic
- **Lower costs**: Origin bandwidth is expensive
- **Better cache hit rates**: Shield has higher hit rate than individual edges

**Trade-off**: Adds one extra hop (edge → shield → origin) on cache miss, but worth it!`,

  whyItMatters: 'Without origin shield, your origin gets hammered by edge cache misses. With shield, origin barely notices the traffic.',

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Serving album artwork globally',
    howTheyDoIt: 'Uses CloudFront with Origin Shield in a single region. Reduces origin requests by 99%, saving millions in bandwidth costs.',
  },

  famousIncident: {
    title: 'Reddit Hug of Death',
    company: 'Reddit',
    year: 'Ongoing',
    whatHappened: 'When Reddit links to a small website, hundreds of thousands of users click simultaneously. Without CDN and origin shield, the origin server crashes ("hug of death").',
    lessonLearned: 'Origin shield + CDN can absorb massive traffic spikes that would kill an unprotected origin server.',
    icon: '🤗',
  },

  diagram: `
WITHOUT Origin Shield:
┌────────┐   ┌────────┐   ┌────────┐
│Edge US │   │Edge EU │   │Edge Asia│
└───┬────┘   └───┬────┘   └───┬─────┘
    │            │            │
    └────────────┴────────────┘
                 │
         All hit origin simultaneously
                 ▼
          ┌────────────┐
          │   Origin   │ ← 200 requests!
          └────────────┘

WITH Origin Shield:
┌────────┐   ┌────────┐   ┌────────┐
│Edge US │   │Edge EU │   │Edge Asia│
└───┬────┘   └───┬────┘   └───┬─────┘
    │            │            │
    └────────────┴────────────┘
                 │
                 ▼
          ┌────────────┐
          │Origin Shield│ ← 200 edges
          │  (Cached)  │    collapse here
          └──────┬─────┘
                 │
                 ▼
          ┌────────────┐
          │   Origin   │ ← 1 request!
          └────────────┘
`,

  keyPoints: [
    'Origin Shield = centralized cache layer',
    'Collapses multiple edge requests into one origin request',
    'Reduces origin load by 99%+',
    'Lowers bandwidth costs significantly',
    'Trade-off: Extra hop on cache miss',
  ],

  quickCheck: {
    question: 'Why does Origin Shield reduce origin load?',
    options: [
      'It caches content forever',
      'It compresses content',
      'It collapses simultaneous edge requests into one origin request',
      'It serves stale content',
    ],
    correctIndex: 2,
    explanation: 'Origin Shield acts as a central cache. When 200 edges all miss, they all hit the shield, which makes just ONE request to origin.',
  },

  keyConcepts: [
    { title: 'Origin Shield', explanation: 'Central cache layer protecting origin', icon: '🛡️' },
    { title: 'Request Collapse', explanation: 'Many requests → one upstream request', icon: '🎯' },
    { title: 'Cache Hierarchy', explanation: 'Edge → Shield → Origin', icon: '📊' },
  ],
};

const step5: GuidedStep = {
  id: 'cdn-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'Optimize origin load with origin shield',
    taskDescription: 'Add Cache layer as Origin Shield between CDN and Object Storage',
    componentsNeeded: [
      { type: 'cache', reason: 'Acts as Origin Shield - centralized cache layer', displayName: 'Origin Shield (Cache)' },
    ],
    successCriteria: [
      'Cache component added as Origin Shield',
      'CDN connected to Origin Shield',
      'Origin Shield connected to Object Storage',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add a Cache component between CDN and Object Storage',
    level2: 'This cache acts as Origin Shield: Client → CDN → Origin Shield (Cache) → Object Storage',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [
      { from: 'cdn', to: 'cache' },
      { from: 'cache', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 6: Monitor CDN Performance
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "Your CDN is running, but you have no visibility into how well it's working!",
  hook: "Is the cache hit rate actually 95%? Are some edge locations slower than others? You're flying blind!",
  challenge: "Add monitoring and observability to track CDN performance metrics.",
  illustration: 'monitoring',
};

const step6Celebration: CelebrationContent = {
  emoji: '📈',
  message: 'Full visibility into CDN performance!',
  achievement: 'Real-time metrics and monitoring dashboard',
  metrics: [
    { label: 'Cache hit rate', after: '96.2%' },
    { label: 'P99 latency', after: '42ms' },
    { label: 'Origin requests', after: '12/sec' },
    { label: 'Bandwidth savings', after: '$4.8K/mo' },
  ],
  nextTeaser: "Time to optimize for cost...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'CDN Observability: You Can\'t Improve What You Don\'t Measure',
  conceptExplanation: `**Critical CDN metrics to monitor**:

**1. Cache Hit Rate** - Most important!
- **Formula**: Cache Hits ÷ Total Requests
- **Target**: > 95% for static assets
- **Why**: Every cache miss costs origin bandwidth

**2. P50/P95/P99 Latency**
- **Measure**: Time from request to response
- **Target**: P99 < 50ms for edge hits
- **Why**: User experience depends on latency

**3. Origin Requests/sec**
- **Measure**: Traffic hitting origin
- **Target**: < 5% of total traffic (with 95% hit rate)
- **Why**: High origin load = high costs

**4. Error Rate**
- **Measure**: 4xx/5xx responses
- **Target**: < 0.1%
- **Why**: Errors indicate problems

**5. Bandwidth by Edge Location**
- **Measure**: Traffic per edge region
- **Why**: Identify hot spots, optimize placement

**Monitoring tools**: CloudWatch, DataDog, Grafana, custom dashboards`,

  whyItMatters: 'Without metrics, you don\'t know if your CDN is working well or wasting money. Cache hit rate is the #1 metric for CDN performance.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Real-time analytics for customers',
    howTheyDoIt: 'Cloudflare provides real-time dashboard showing cache hit rate, bandwidth, threats blocked, and latency per edge location. Customers can optimize based on data.',
  },

  keyPoints: [
    'Cache hit rate is the #1 metric (target > 95%)',
    'Monitor P99 latency to ensure good user experience',
    'Track origin requests to control costs',
    'Use monitoring to identify and fix issues',
    'Set up alerts for anomalies',
  ],

  diagram: `
CDN Monitoring Dashboard:
┌─────────────────────────────────────────────┐
│  GlobalNews CDN Performance                 │
├─────────────────────────────────────────────┤
│  Cache Hit Rate:        96.2% ✓             │
│  Total Requests:        20,134/sec          │
│  - Edge Hits:           19,369/sec (96.2%)  │
│  - Origin Requests:     765/sec (3.8%)      │
│                                             │
│  Latency (P99):         42ms ✓              │
│  Error Rate:            0.03% ✓             │
│                                             │
│  Top Edge Locations:                        │
│  - US-East:     8,234/sec (40.9%)          │
│  - EU-West:     6,123/sec (30.4%)          │
│  - Asia-Pacific: 4,567/sec (22.7%)         │
│                                             │
│  Bandwidth Savings: $4,832/month           │
└─────────────────────────────────────────────┘
`,

  quickCheck: {
    question: 'If your cache hit rate drops from 95% to 85%, what happens?',
    options: [
      'Nothing significant',
      'Origin requests double (from 5% to 15% of traffic)',
      'Latency improves',
      'Cache invalidation gets faster',
    ],
    correctIndex: 1,
    explanation: 'Hit rate drop from 95% to 85% means miss rate goes from 5% to 15% - that\'s 3x more origin requests! Your origin load triples and costs spike.',
  },

  keyConcepts: [
    { title: 'Cache Hit Rate', explanation: 'Percentage of requests served from cache', icon: '🎯' },
    { title: 'P99 Latency', explanation: '99% of requests faster than this', icon: '⚡' },
    { title: 'Origin Load', explanation: 'Traffic actually hitting origin', icon: '📊' },
    { title: 'Bandwidth Savings', explanation: 'Money saved by caching', icon: '💰' },
  ],
};

const step6: GuidedStep = {
  id: 'cdn-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Monitor CDN statistics and performance',
    taskDescription: 'Review architecture and ensure observability',
    successCriteria: [
      'Complete architecture in place',
      'Understanding of key metrics',
      'Monitoring strategy defined',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Your architecture is complete - this step focuses on understanding metrics',
    level2: 'Review the learning content about cache hit rate, latency, and monitoring',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Optimize Cache Strategy
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🎯',
  scenario: "Your CDN is working well, but the CFO wants to reduce costs by 30%.",
  hook: "Origin bandwidth costs $5K/month. Every cache miss costs money. Can we get cache hit rate from 95% to 98%?",
  challenge: "Optimize cache strategy: TTL, cache keys, and cache warming.",
  illustration: 'optimization',
};

const step7Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Cache strategy optimized!',
  achievement: 'Hit rate increased, costs reduced',
  metrics: [
    { label: 'Cache hit rate', before: '95%', after: '98.5%' },
    { label: 'Origin requests', before: '1K/sec', after: '300/sec' },
    { label: 'Monthly costs', before: '$5K', after: '$3.5K' },
    { label: 'Savings', after: '$1.5K/month (30%)' },
  ],
  nextTeaser: "You've mastered CDN design! Time for the final exam...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Optimization Strategies',
  conceptExplanation: `**Advanced techniques to maximize cache hit rate**:

**1. Optimize TTL (Time To Live)**
- **Images/CSS/JS**: Long TTL (1 year) + versioned URLs
- **HTML**: Short TTL (5 minutes) for dynamic content
- **Videos**: Very long TTL (1 year)
- **API responses**: Short TTL or no cache

**2. Cache Key Normalization**
- Remove query params that don't change content
- Example: /image.jpg?utm_source=twitter → /image.jpg
- Increases cache hit rate by deduplicating

**3. Cache Warming**
- Pre-populate edge caches with popular content
- Before traffic spike, push content to edges
- Example: New product launch → warm product images

**4. Stale-While-Revalidate**
- Serve stale content while fetching fresh
- User gets instant response (from stale cache)
- CDN updates cache in background
- Best of both worlds: speed + freshness

**5. Vary Header Handling**
- Cache different versions for different conditions
- Example: Vary: Accept-Encoding (gzip vs brotli)
- Don't over-use: fragments cache

**6. Geo-based Caching**
- Different content per region
- Example: News site shows local news
- But be careful: reduces cache efficiency`,

  whyItMatters: 'Every 1% increase in cache hit rate reduces origin load by 20%. Small optimizations have huge cost impacts at scale.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product images on Amazon.com',
    howTheyDoIt: 'Versioned URLs with 1-year TTL. When product image changes, new version uploaded with new URL. Cache hit rate > 99%.',
  },

  keyPoints: [
    'Long TTL + versioned URLs = highest hit rate',
    'Normalize cache keys to deduplicate',
    'Cache warming for predictable traffic',
    'Stale-while-revalidate for speed + freshness',
    'Monitor hit rate by content type',
  ],

  diagram: `
Cache Strategy by Content Type:
┌──────────────┬──────────┬──────────────┬────────────┐
│ Content Type │   TTL    │  Versioning  │  Hit Rate  │
├──────────────┼──────────┼──────────────┼────────────┤
│ Images       │ 1 year   │ Yes (v1,v2)  │   99%      │
│ CSS          │ 1 year   │ Yes          │   99%      │
│ JavaScript   │ 1 year   │ Yes          │   99%      │
│ Videos       │ 1 year   │ Yes          │   99.5%    │
│ HTML         │ 5 min    │ No           │   70%      │
│ API          │ None/Low │ No           │   40%      │
└──────────────┴──────────┴──────────────┴────────────┘

Overall Hit Rate Calculation:
- 90% of requests are images/CSS/JS (99% hit rate)
- 10% of requests are HTML/API (50% hit rate)
- Overall: 0.9 × 99% + 0.1 × 50% = 94.1%
`,

  quickCheck: {
    question: 'Why do versioned URLs enable longer TTL?',
    options: [
      'They\'re faster to cache',
      'New version = new URL, so no stale cache problem',
      'They take less storage',
      'They\'re easier to invalidate',
    ],
    correctIndex: 1,
    explanation: 'photo-v1.jpg can be cached forever (1 year) because it never changes. photo-v2.jpg is a different file. No invalidation needed!',
  },

  keyConcepts: [
    { title: 'TTL Optimization', explanation: 'Right expiration time per content type', icon: '⏰' },
    { title: 'Cache Key', explanation: 'What makes two requests cacheable together', icon: '🔑' },
    { title: 'Cache Warming', explanation: 'Pre-populate before traffic', icon: '🔥' },
    { title: 'Stale-While-Revalidate', explanation: 'Serve stale, update async', icon: '🔄' },
  ],
};

const step7: GuidedStep = {
  id: 'cdn-step-7',
  stepNumber: 7,
  frIndex: 3,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'Optimize cache hit rate and reduce costs',
    taskDescription: 'Review and finalize architecture with optimal cache strategy',
    successCriteria: [
      'Architecture optimized for maximum cache hit rate',
      'Cost-effective design in place',
      'All components properly configured',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Your architecture is already optimal - review the concepts',
    level2: 'Understand TTL optimization, cache warming, and versioned URLs',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const staticContentCdnGuidedTutorial: GuidedTutorial = {
  problemId: 'static-content-cdn',
  title: 'Design a Static Content CDN',
  description: 'Build a content delivery network with edge caching, cache invalidation, and origin shielding',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🌐',
    hook: "You've been hired as Infrastructure Lead at GlobalNews!",
    scenario: "Your mission: Build a CDN that serves static assets (images, CSS, JS) to millions of readers worldwide with sub-50ms latency.",
    challenge: "Can you design a system that achieves 95% cache hit rate and handles 20K requests per second?",
  },

  requirementsPhase: staticContentCdnRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7],

  concepts: [
    'Origin Server',
    'Object Storage (S3)',
    'CDN Edge Caching',
    'Cache Hit Rate',
    'Cache Invalidation',
    'TTL (Time To Live)',
    'Origin Shield',
    'Request Collapse',
    'Versioned URLs',
    'Cache Warming',
    'Stale-While-Revalidate',
    'CDN Observability',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 2: Data Models (Object Storage)',
    'Chapter 3: Storage and Retrieval (Caching)',
  ],
};

export default staticContentCdnGuidedTutorial;
