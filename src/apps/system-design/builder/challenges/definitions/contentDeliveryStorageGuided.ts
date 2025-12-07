import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Content Delivery Storage Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching content delivery and storage fundamentals
 * through building a global content delivery platform.
 *
 * Key Concepts:
 * - Object storage for static content
 * - CDN edge caching
 * - Origin shielding
 * - Cache invalidation strategies
 * - Geographic distribution
 * - Content purging
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const contentDeliveryStorageRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a content delivery and storage system for global distribution of static assets",

  interviewer: {
    name: 'Marcus Thompson',
    role: 'VP of Infrastructure at MediaStream',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'content-types',
      category: 'functional',
      question: "What types of content will this system need to store and deliver?",
      answer: "The system needs to handle:\n\n1. **Images** - Product photos, user avatars, thumbnails\n2. **Videos** - Marketing videos, product demos, user-generated content\n3. **Documents** - PDFs, whitepapers, user manuals\n4. **Static assets** - CSS, JavaScript, fonts for web applications\n\nAll of these are static content - they don't change frequently once uploaded.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Static content is ideal for aggressive caching and CDN delivery",
    },
    {
      id: 'upload-workflow',
      category: 'functional',
      question: "How do content creators upload files to the system?",
      answer: "Content creators (editors, developers, marketing team) upload files through:\n1. **Web dashboard** - Upload interface with drag-and-drop\n2. **API** - Programmatic uploads for automation\n3. **CLI tools** - For developers deploying assets\n\nFiles are stored in object storage (S3-like) and automatically distributed to the CDN.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Upload is write-heavy but infrequent compared to downloads",
    },
    {
      id: 'geographic-distribution',
      category: 'functional',
      question: "Where are your users located geographically?",
      answer: "We have a **global user base**:\n- **North America**: 40% of traffic\n- **Europe**: 30% of traffic\n- **Asia-Pacific**: 25% of traffic\n- **Rest of world**: 5% of traffic\n\nUsers expect fast content delivery regardless of location. A user in Tokyo should get assets as fast as a user in New York.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Global distribution requires edge locations in multiple regions",
    },
    {
      id: 'content-access',
      category: 'functional',
      question: "How do end users access this content?",
      answer: "End users access content through:\n1. **Web browsers** - Loading images and assets on websites\n2. **Mobile apps** - Fetching media content\n3. **Direct links** - Sharing content via URLs\n\nContent is accessed via CDN URLs like 'cdn.mediastream.com/images/product-123.jpg'.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "CDN acts as the public-facing delivery layer for content",
    },
    {
      id: 'cache-purging',
      category: 'functional',
      question: "What happens when content needs to be updated or removed?",
      answer: "We need **cache purging** capabilities:\n1. **Update content** - When a file is modified, invalidate old cached versions\n2. **Remove content** - Immediately purge content from all edge locations\n3. **Selective purging** - Purge specific files or entire directories\n4. **Emergency purging** - Fast global purge for critical updates (security, legal)\n\nPurging should propagate to all edge locations within 30 seconds.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Cache invalidation is critical for content freshness and compliance",
    },
    {
      id: 'access-control',
      category: 'functional',
      question: "Is all content public, or do we need access controls?",
      answer: "Mix of both:\n- **Public content**: Marketing assets, public product images (80%)\n- **Private content**: Premium content, user-specific assets (20%)\n\nFor private content, we need signed URLs with expiration times.",
      importance: 'important',
      revealsRequirement: 'FR-4',
      learningPoint: "Access control requires authentication at CDN edge",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many content requests per second should we handle?",
      answer: "50,000 requests per second globally during peak traffic",
      importance: 'critical',
      calculation: {
        formula: "50K RPS × 3600 sec = 180M requests/hour",
        result: "~4.3 billion requests per day",
      },
      learningPoint: "High RPS requires distributed edge caching",
    },
    {
      id: 'storage-volume',
      category: 'payload',
      question: "How much total content storage do we need?",
      answer: "Initial: **500TB** of content\nGrowth: **100TB per year**\n\nContent includes:\n- High-resolution images (avg 5MB)\n- Videos (avg 50MB)\n- Documents (avg 2MB)",
      importance: 'critical',
      learningPoint: "Object storage must be cost-effective at petabyte scale",
    },
    {
      id: 'cache-hit-rate',
      category: 'performance',
      question: "What cache hit rate should we target at the edge?",
      answer: "**95% cache hit rate** at CDN edges. This means:\n- 95% of requests served from edge cache (fast, cheap)\n- 5% of requests go to origin (slower, expensive)\n\nWith 50K RPS and 95% hit rate, only 2.5K RPS hit the origin.",
      importance: 'critical',
      calculation: {
        formula: "50K RPS × 5% miss rate = 2.5K origin requests/sec",
        result: "95% hit rate reduces origin load by 20x",
      },
      learningPoint: "High cache hit rate is essential for performance and cost",
    },
    {
      id: 'latency-requirement',
      category: 'latency',
      question: "What latency target do we have for content delivery?",
      answer: "**p99 latency under 100ms** globally for cached content\n**p99 latency under 500ms** for origin requests (cache miss)\n\nUsers expect instant content loading. Each 100ms of latency costs 1% of conversions.",
      importance: 'critical',
      learningPoint: "Edge caching is critical for low-latency delivery",
    },
    {
      id: 'availability-target',
      category: 'availability',
      question: "What availability do we need for content delivery?",
      answer: "**99.99% availability** (52 minutes downtime per year)\n\nContent delivery is critical - if our CDN is down, customer websites break. We need:\n- Redundant origin storage\n- Multiple CDN providers (failover)\n- Edge cache continues serving even if origin fails",
      importance: 'critical',
      learningPoint: "CDN provides resilience through distributed caching",
    },
    {
      id: 'bandwidth-costs',
      category: 'payload',
      question: "What about bandwidth costs?",
      answer: "Bandwidth is expensive:\n- **Origin bandwidth**: $0.05/GB\n- **CDN bandwidth**: $0.01/GB\n\nWith 50K RPS and 2MB average file size:\n- Total: 100GB/sec = 360TB/hour\n- Without CDN: $18K/hour in origin bandwidth\n- With CDN (95% hit): $900/hour in origin bandwidth\n\n**CDN saves $17K/hour!**",
      importance: 'important',
      calculation: {
        formula: "50K RPS × 2MB × 3600sec = 360TB/hour",
        result: "CDN caching saves ~95% of bandwidth costs",
      },
      learningPoint: "CDN is not just about performance - it's also about cost",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['content-types', 'geographic-distribution', 'cache-purging', 'cache-hit-rate'],
  criticalFRQuestionIds: ['content-types', 'upload-workflow', 'content-access', 'cache-purging'],
  criticalScaleQuestionIds: ['throughput-requests', 'cache-hit-rate', 'latency-requirement', 'availability-target'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Upload and store content',
      description: 'Content creators can upload images, videos, and documents to object storage',
      emoji: '📤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Deliver content globally',
      description: 'End users can access content via CDN with low latency worldwide',
      emoji: '🌍',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Purge cached content',
      description: 'Ability to invalidate and remove content from all edge locations',
      emoji: '🗑️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Control content access',
      description: 'Support for both public and private content with access controls',
      emoji: '🔐',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'Hundreds of millions globally',
    writesPerDay: '~100K content uploads',
    readsPerDay: '~4.3 billion content requests',
    peakMultiplier: 3,
    readWriteRatio: '43000:1',
    calculatedWriteRPS: { average: 1.2, peak: 3.6 },
    calculatedReadRPS: { average: 50000, peak: 150000 },
    maxPayloadSize: '~100MB per file',
    storagePerRecord: '~5MB average',
    storageGrowthPerYear: '~100TB',
    redirectLatencySLA: 'p99 < 100ms (edge)',
    createLatencySLA: 'p99 < 2s (upload)',
  },

  architecturalImplications: [
    '✅ 50K RPS → CDN edge caching is mandatory',
    '✅ 95% hit rate → Aggressive caching with long TTL',
    '✅ Global users → Multiple edge locations worldwide',
    '✅ p99 < 100ms → Content cached close to users',
    '✅ 500TB storage → Object storage (S3) required',
    '✅ 43K:1 read:write ratio → Origin shielding beneficial',
    '✅ High availability → Redundant origin and CDN failover',
  ],

  outOfScope: [
    'Dynamic content generation',
    'Real-time video streaming (live)',
    'Content transcoding and optimization',
    'Content search and discovery',
    'User authentication system',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where content is uploaded to storage and served to users. Then we'll add CDN edge caching to make it FAST and SCALABLE at global scale. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to App Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🌐',
  scenario: "Welcome to MediaStream! You're building a global content delivery platform.",
  hook: "Your first content creator wants to upload a product image, and users want to view it.",
  challenge: "Set up the basic request flow so users can interact with your system.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your content delivery system is online!',
  achievement: 'Users can now send requests to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can accept requests', after: '✓' },
  ],
  nextTeaser: "But where will we store all this content?",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server Architecture',
  conceptExplanation: `Every content delivery system starts with **Clients** connecting to a **Server**.

When a user requests content (image, video, document):
1. Their browser/app is the **Client**
2. The client sends a request to your **App Server**
3. The server processes the request and responds

**Two types of clients**:
- **Content creators**: Upload files (write operations)
- **End users**: Download/view files (read operations)

This is the foundation we'll build upon!`,

  whyItMatters: 'Without this connection, users cannot interact with your content delivery system at all.',

  keyPoints: [
    'Client = user\'s device (browser, mobile app)',
    'App Server = backend that coordinates content delivery',
    'HTTP/HTTPS = protocol for communication',
    'Foundation for all content operations',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User\'s device requesting or uploading content', icon: '👤' },
    { title: 'App Server', explanation: 'Backend server coordinating operations', icon: '🖥️' },
    { title: 'Static Content', explanation: 'Files that don\'t change frequently', icon: '📄' },
  ],
};

const step1: GuidedStep = {
  id: 'content-delivery-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up basic content delivery',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing and uploading content', displayName: 'Client' },
      { type: 'app_server', reason: 'Backend server coordinating content operations', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added to canvas',
      'App Server component added to canvas',
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
// STEP 2: Add Object Storage for Content
// =============================================================================

const step2Story: StoryContent = {
  emoji: '☁️',
  scenario: "Content creators are uploading hundreds of large video files and images!",
  hook: "Your App Server doesn't have enough disk space, and it's not designed to store petabytes of content. You need scalable, durable storage!",
  challenge: "Add object storage (S3) to store all static content.",
  illustration: 'storage-needed',
};

const step2Celebration: CelebrationContent = {
  emoji: '📦',
  message: 'Content now has unlimited storage!',
  achievement: 'Object storage handles petabytes of static files',
  metrics: [
    { label: 'Storage capacity', after: 'Unlimited (S3)' },
    { label: 'Durability', after: '99.999999999%' },
    { label: 'Content uploaded', after: '✓' },
  ],
  nextTeaser: "But users around the world are experiencing slow downloads...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Object Storage: Scalable Storage for Content',
  conceptExplanation: `**Object Storage** (like AWS S3, Google Cloud Storage) is perfect for static content:

**Key characteristics**:
- **Unlimited scale**: Store petabytes of data
- **Durability**: 11 nines (99.999999999%) - virtually never lose data
- **Cost-effective**: Much cheaper than database or block storage
- **HTTP access**: Content accessible via URLs
- **Metadata**: Store custom metadata with each object

**Architecture**:
- **App Server**: Coordinates uploads and generates URLs
- **Object Storage**: Actually stores the files (images, videos, docs)
- **URL structure**: s3.amazonaws.com/bucket/path/to/file.jpg

**Use cases**: Images, videos, documents, backups, logs, static website assets`,

  whyItMatters: 'App servers are designed for compute, not storage at scale. Object storage provides unlimited, durable, cost-effective storage.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Storing petabytes of video content',
    howTheyDoIt: 'Netflix stores all video content in AWS S3, with multiple encodings per title. S3 provides the durability and scale needed for their massive content library.',
  },

  keyPoints: [
    'Object storage for files, app server for coordination',
    'Unlimited capacity and 11 nines durability',
    'Much cheaper than traditional storage',
    'Content accessible via HTTP URLs',
    'Foundation for CDN origin',
  ],

  diagram: `
┌─────────┐    upload    ┌─────────────┐   store   ┌────────────┐
│ Creator │ ───────────→ │ App Server  │ ────────→ │  S3 Bucket │
└─────────┘              └─────────────┘           └────────────┘
                              ↓
                         Generate URL
                              ↓
┌─────────┐    request   ┌─────────────┐   fetch   ┌────────────┐
│   User  │ ───────────→ │ App Server  │ ────────→ │  S3 Bucket │
└─────────┘              └─────────────┘           └────────────┘
`,

  keyConcepts: [
    { title: 'Object Storage', explanation: 'S3-like storage for files', icon: '☁️' },
    { title: 'Bucket', explanation: 'Container for storing objects', icon: '🪣' },
    { title: 'Durability', explanation: '11 nines - virtually never lose data', icon: '🛡️' },
    { title: 'Origin', explanation: 'Source of truth for CDN content', icon: '🎯' },
  ],

  quickCheck: {
    question: 'Why use object storage instead of storing files on the app server?',
    options: [
      'Object storage is faster',
      'App servers don\'t have enough disk space for petabytes of content',
      'Object storage is required by law',
      'It\'s easier to program',
    ],
    correctIndex: 1,
    explanation: 'App servers are designed for compute, not storage at scale. Object storage provides unlimited capacity and high durability for storing massive amounts of content.',
  },
};

const step2: GuidedStep = {
  id: 'content-delivery-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Upload and store content',
    taskDescription: 'Add Object Storage and connect App Server to it',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store images, videos, and documents at scale', displayName: 'S3 Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
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
    level2: 'Connect App Server to Object Storage - this is where content will be stored',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 3: Add CDN for Global Distribution
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Tokyo, London, and São Paulo are all accessing your content.",
  hook: "But they're all fetching from your S3 bucket in US-East! Tokyo users wait 2 seconds for images to load. London users see 500ms latency. This is killing user experience!",
  challenge: "Add a CDN to cache content at edge locations worldwide.",
  illustration: 'global-latency',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Content now loads instantly worldwide!',
  achievement: 'CDN edge caching reduces latency from seconds to milliseconds',
  metrics: [
    { label: 'Latency (Tokyo)', before: '2000ms', after: '80ms' },
    { label: 'Latency (London)', before: '500ms', after: '50ms' },
    { label: 'Origin requests', before: '50K/sec', after: '2.5K/sec' },
    { label: 'Cache hit rate', after: '95%' },
  ],
  nextTeaser: "But what if content gets updated?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'CDN: Global Content Delivery',
  conceptExplanation: `A **CDN** (Content Delivery Network) is essential for global content delivery.

**How CDN works**:
1. User in Tokyo requests /images/product.jpg
2. Request routes to nearest CDN edge (Tokyo)
3. **Cache HIT**: Edge has it → serve instantly (50-100ms)
4. **Cache MISS**: Edge fetches from origin → cache it → serve (500ms first time, 50ms after)

**Benefits of CDN**:
- **Low latency**: Content served from nearby edge (< 100ms)
- **Reduced origin load**: 95% of requests never hit origin
- **Bandwidth savings**: Edge bandwidth is cheaper
- **Scalability**: Edge handles massive traffic
- **Resilience**: Edge cache works even if origin fails

**Popular CDNs**: CloudFront, Cloudflare, Akamai, Fastly

**Key metric**: Cache hit rate (target: 95%+)`,

  whyItMatters: 'Without CDN, every user request travels to your origin across the internet. With global traffic, this means terrible latency and massive origin load.',

  realWorldExample: {
    company: 'Spotify',
    scenario: 'Delivering album artwork globally',
    howTheyDoIt: 'Spotify uses CloudFront CDN with 300+ edge locations. Album artwork is cached at edges for 1 year. Cache hit rate > 99%.',
  },

  famousIncident: {
    title: 'Fastly CDN Outage',
    company: 'Fastly',
    year: '2021',
    whatHappened: 'A software bug in Fastly\'s CDN caused a massive outage affecting Reddit, Amazon, NYTimes, and thousands of sites for an hour. Major parts of the internet were down.',
    lessonLearned: 'CDN is critical infrastructure. Always have fallback strategies - multi-CDN or direct-to-origin failover.',
    icon: '🌐',
  },

  diagram: `
User in Tokyo:
┌─────────┐   50ms    ┌──────────────┐
│  User   │◀─────────▶│ CDN Edge     │  ← Cache HIT (95%)
│ (Tokyo) │           │ (Tokyo)      │
└─────────┘           └──────┬───────┘
                             │
                             │ Cache MISS (5%)
                             │ 500ms
                             ▼
                      ┌──────────────┐
                      │   Origin     │
                      │   S3 Bucket  │
                      │   (US-East)  │
                      └──────────────┘

User in London:
┌─────────┐   30ms    ┌──────────────┐
│  User   │◀─────────▶│ CDN Edge     │  ← Cache HIT (95%)
│ (London)│           │ (London)     │
└─────────┘           └──────────────┘
`,

  keyPoints: [
    'CDN edge servers cache content close to users',
    'Cache HIT = fast (<100ms), Cache MISS = slower (500ms+)',
    '95% hit rate means 95% of requests served from edge',
    'Origin load reduced by 20x (only 5% of traffic)',
    'CDN sits between client and origin storage',
  ],

  quickCheck: {
    question: 'Why does CDN dramatically improve latency for global users?',
    options: [
      'CDN has faster servers',
      'CDN compresses all content',
      'Content served from edge close to user, not distant origin',
      'CDN uses faster network protocols',
    ],
    correctIndex: 2,
    explanation: 'Physics matters! CDN edge in Tokyo is 50ms away, origin in US is 500ms+ away. Serving from nearby edge is the key to low latency.',
  },

  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN server close to users', icon: '📍' },
    { title: 'Cache Hit', explanation: 'Content found in edge cache', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Must fetch from origin', icon: '❌' },
    { title: 'Hit Rate', explanation: 'Percentage of requests served from cache', icon: '🎯' },
  ],
};

const step3: GuidedStep = {
  id: 'content-delivery-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Deliver content globally with low latency',
    taskDescription: 'Add CDN and connect it between Client and Object Storage',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache content at global edge locations', displayName: 'CDN (CloudFront)' },
    ],
    successCriteria: [
      'CDN component added',
      'Client connected to CDN (not directly to App Server for content)',
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
    level1: 'Add CDN component and rewire: Client → CDN → Object Storage',
    level2: 'CDN sits between client and storage. Client connects to CDN, CDN connects to Object Storage.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Origin Shield
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Your CDN has 250 edge locations worldwide. When cache expires, disaster strikes!",
  hook: "All 250 edges simultaneously request the same popular video from origin. Your S3 bucket gets hammered with 250 identical requests every time cache expires. Your bandwidth bill is through the roof!",
  challenge: "Add origin shield to protect your origin from cache stampede.",
  illustration: 'origin-overload',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Origin shield is protecting your storage!',
  achievement: 'Origin requests reduced by 99%',
  metrics: [
    { label: 'Origin requests', before: '2.5K/sec', after: '25/sec' },
    { label: 'Bandwidth costs', before: '$10K/mo', after: '$100/mo' },
    { label: 'Origin load', before: 'High', after: 'Minimal' },
  ],
  nextTeaser: "What about when content gets updated?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Origin Shield: Protecting Your Origin',
  conceptExplanation: `**Origin Shield** is a centralized caching layer between edge locations and origin storage.

**The Problem Without Origin Shield**:
- 250 edges worldwide
- Popular video cached everywhere
- Cache TTL expires (1 hour)
- All 250 edges request from origin simultaneously
- Origin gets 250x the traffic in bursts!

**The Solution With Origin Shield**:
\`\`\`
250 edges → Origin Shield (single location) → Origin
\`\`\`

**How it works**:
1. Edge cache miss in Tokyo
2. Tokyo edge requests from Origin Shield (US-East)
3. **Shield HIT**: Return to Tokyo edge
4. **Shield MISS**: Shield fetches from origin once, caches it
5. Other edges (London, Paris, Mumbai) also miss → all hit Shield → same cached copy

**Benefits**:
- **Request collapse**: 250 edge misses → 1 origin request
- **Reduce origin load**: 99% reduction
- **Lower costs**: Origin bandwidth extremely expensive
- **Better cache efficiency**: Shield has higher hit rate

**Trade-off**: Adds one hop (edge → shield → origin) on miss, but worth it!`,

  whyItMatters: 'Without origin shield, cache expiration causes traffic spikes that can overwhelm your origin. Shield collapses redundant requests.',

  realWorldExample: {
    company: 'Twitch',
    scenario: 'Serving video thumbnails globally',
    howTheyDoIt: 'Uses CloudFront with Origin Shield. When popular streams get millions of viewers, origin shield prevents the origin from being overwhelmed by edge cache misses.',
  },

  famousIncident: {
    title: 'Slashdot Effect / Reddit Hug of Death',
    company: 'Various small websites',
    year: 'Ongoing',
    whatHappened: 'When a small website gets linked on Reddit or popular sites, thousands of users hit it simultaneously. Without CDN and origin shield, the origin server crashes instantly.',
    lessonLearned: 'Origin shield + CDN can absorb massive traffic spikes that would kill an unprotected origin.',
    icon: '🤗',
  },

  diagram: `
WITHOUT Origin Shield:
┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
│Edge US │   │Edge EU │   │Edge Asia│  │250 more│
└───┬────┘   └───┬────┘   └───┬─────┘  └───┬────┘
    │            │            │            │
    └────────────┴────────────┴────────────┘
                 │
         All hit origin simultaneously!
                 ▼
          ┌────────────┐
          │ S3 Origin  │ ← 250+ requests!
          └────────────┘

WITH Origin Shield:
┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
│Edge US │   │Edge EU │   │Edge Asia│  │250 more│
└───┬────┘   └───┬────┘   └───┬─────┘  └───┬────┘
    │            │            │            │
    └────────────┴────────────┴────────────┘
                 │
                 ▼
          ┌────────────┐
          │Origin Shield│ ← 250+ edges
          │  (Cached)  │    collapse here
          └──────┬─────┘
                 │
                 ▼
          ┌────────────┐
          │ S3 Origin  │ ← 1 request!
          └────────────┘
`,

  keyPoints: [
    'Origin Shield = centralized cache protecting origin',
    'Collapses multiple edge requests into single origin request',
    'Reduces origin load by 99%+',
    'Massive bandwidth cost savings',
    'Essential for high-traffic content delivery',
  ],

  quickCheck: {
    question: 'Why does Origin Shield dramatically reduce origin load?',
    options: [
      'It caches content forever',
      'It compresses all content',
      'It collapses simultaneous edge requests into one origin request',
      'It blocks most requests',
    ],
    correctIndex: 2,
    explanation: 'Origin Shield acts as a central cache. When 250 edges all miss simultaneously, they all hit the shield, which makes just ONE request to origin.',
  },

  keyConcepts: [
    { title: 'Origin Shield', explanation: 'Central cache layer protecting origin', icon: '🛡️' },
    { title: 'Request Collapse', explanation: 'Many requests → one upstream request', icon: '🎯' },
    { title: 'Cache Stampede', explanation: 'Many requests hitting origin simultaneously', icon: '⚡' },
    { title: 'Cache Hierarchy', explanation: 'Edge → Shield → Origin', icon: '📊' },
  ],
};

const step4: GuidedStep = {
  id: 'content-delivery-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'Protect origin with origin shield',
    taskDescription: 'Add Cache layer as Origin Shield between CDN and Object Storage',
    componentsNeeded: [
      { type: 'cache', reason: 'Acts as Origin Shield - centralized cache layer', displayName: 'Origin Shield' },
    ],
    successCriteria: [
      'Cache component added as Origin Shield',
      'CDN connected to Origin Shield',
      'Origin Shield connected to Object Storage',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'app_server', 'object_storage'],
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
// STEP 5: Implement Cache Invalidation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '⚠️',
  scenario: "Marketing just updated a product image with a critical correction!",
  hook: "But millions of users are still seeing the OLD image cached at 250 edge locations worldwide. The new image is in S3, but the CDN keeps serving the old one from cache. The marketing team is panicking!",
  challenge: "Implement cache invalidation to purge stale content from all edges.",
  illustration: 'stale-cache',
};

const step5Celebration: CelebrationContent = {
  emoji: '🔄',
  message: 'Cache invalidation is working!',
  achievement: 'Updated content propagates globally in under 30 seconds',
  metrics: [
    { label: 'Invalidation time', after: '< 30 seconds' },
    { label: 'Edges purged', after: '250+' },
    { label: 'Stale content', before: 'Hours', after: 'Seconds' },
  ],
  nextTeaser: "How do we handle edge cache effectively?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Invalidation: The Hard Problem',
  conceptExplanation: `**"There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton**

**The Problem**:
When you update content in origin storage, it's cached at 250+ edge locations. How do you update them all?

**Three Strategies**:

**1. TTL (Time To Live)** - Passive
- Set expiration time (e.g., 1 hour, 1 day)
- After TTL expires, edge refetches from origin
- **Pros**: Simple, automatic, no action needed
- **Cons**: Stale content for up to TTL duration
- **Use case**: Content that rarely changes

**2. Cache Purge/Invalidate** - Active
- Explicitly tell CDN: "Delete /images/product.jpg from all edges"
- **Pros**: Immediate update (30 seconds global propagation)
- **Cons**: Costs money per purge, temporary origin spike
- **Use case**: Critical updates, corrections

**3. Versioned URLs** - Best Practice
- product.jpg → product-v2.jpg or product.jpg?v=2
- New version = new URL = no cache collision
- **Pros**: Instant, no invalidation needed, zero cost
- **Cons**: Requires URL management in application
- **Use case**: Immutable content (images, CSS, JS)

**Purging Strategies**:
- **File purge**: /images/product-123.jpg
- **Directory purge**: /images/products/*
- **Wildcard purge**: *.jpg
- **Full cache purge**: Everything (emergency only)`,

  whyItMatters: 'Stale cached content can show outdated prices, wrong information, or old branding. Cache invalidation ensures users see fresh content.',

  realWorldExample: {
    company: 'Amazon',
    scenario: 'Product images and prices',
    howTheyDoIt: 'Amazon uses versioned URLs for product images (immutable) and aggressive cache purging for price changes. Price updates must be visible within seconds globally.',
  },

  famousIncident: {
    title: 'CloudFlare Cache Poisoning',
    company: 'CloudFlare',
    year: '2017',
    whatHappened: 'A bug caused CloudFlare to cache and serve sensitive data (API keys, passwords) that shouldn\'t be cached. The data was served from cache to wrong users for hours.',
    lessonLearned: 'Cache invalidation and cache control headers are security-critical. Never cache sensitive data, and have emergency purge capabilities.',
    icon: '🔐',
  },

  diagram: `
Cache Invalidation Flow:

1. Editor uploads new product.jpg to S3
2. App triggers invalidation API
3. CDN control plane broadcasts purge
4. All edges delete cached copy within 30s
5. Next request = cache miss → fetch fresh from origin

┌──────────────┐
│   Editor     │  1. Uploads new version to S3
│   Updates    │
└──────┬───────┘
       │
       ▼
┌──────────────┐  2. Triggers CDN invalidation
│ App Server   │ ────────────────────┐
│ Purge API    │                     │
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
            │ Edge US  │    │ Edge EU  │    │Edge Asia │
            │  PURGE   │    │  PURGE   │    │  PURGE   │
            └──────────┘    └──────────┘    └──────────┘
`,

  keyPoints: [
    'Cache invalidation = removing stale content from edges',
    'TTL provides automatic expiration',
    'Explicit purge for urgent updates (costs money)',
    'Versioned URLs avoid invalidation entirely (best practice)',
    'Invalidation takes 30-60 seconds to propagate globally',
    'Emergency full cache purge should be available',
  ],

  quickCheck: {
    question: 'What\'s the best approach for static assets that never change (like versioned CSS)?',
    options: [
      'Short TTL (5 minutes)',
      'Invalidate on every update',
      'Versioned URLs with long TTL (1 year)',
      'No caching',
    ],
    correctIndex: 2,
    explanation: 'Immutable content + versioned URLs = maximum cache efficiency. app-v1.css is forever v1, app-v2.css is a new file. No invalidation needed!',
  },

  keyConcepts: [
    { title: 'TTL', explanation: 'Time To Live - automatic expiration', icon: '⏰' },
    { title: 'Purge', explanation: 'Explicit cache deletion', icon: '🗑️' },
    { title: 'Versioning', explanation: 'New version = new URL', icon: '🔢' },
    { title: 'Stale', explanation: 'Cached content that\'s outdated', icon: '⚠️' },
  ],
};

const step5: GuidedStep = {
  id: 'content-delivery-step-5',
  stepNumber: 5,
  frIndex: 2,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-3: Purge cached content when needed',
    taskDescription: 'Ensure App Server can trigger cache invalidation',
    componentsNeeded: [
      { type: 'app_server', reason: 'Coordinates cache invalidation via CDN API', displayName: 'App Server' },
    ],
    successCriteria: [
      'App Server can communicate with CDN for invalidation',
      'Cache purge strategy understood',
      'Invalidation flow documented',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
      { fromType: 'client', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Ensure Client is connected to App Server for control operations',
    level2: 'App Server triggers cache invalidation via CDN API (not shown on diagram, but understood architecturally)',
    solutionComponents: [],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Optimize Edge Caching Strategy
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🎯',
  scenario: "Your CFO wants to reduce infrastructure costs by 40%.",
  hook: "Cache hit rate is 95%, but can we get it to 98%? Every 1% improvement saves thousands in origin bandwidth. Plus, better caching means faster delivery for users!",
  challenge: "Optimize edge caching strategy to maximize hit rate and minimize costs.",
  illustration: 'optimization',
};

const step6Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Cache strategy optimized!',
  achievement: 'Hit rate increased, costs slashed',
  metrics: [
    { label: 'Cache hit rate', before: '95%', after: '98.5%' },
    { label: 'Origin requests', before: '2.5K/sec', after: '750/sec' },
    { label: 'Monthly bandwidth cost', before: '$10K', after: '$6K' },
    { label: 'Savings', after: '$4K/month (40%)' },
  ],
  nextTeaser: "System is optimized and cost-effective!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Edge Caching Optimization Strategies',
  conceptExplanation: `**Advanced techniques to maximize cache hit rate and minimize costs**:

**1. Optimize TTL by Content Type**
- **Images**: Long TTL (1 year) + versioned URLs
- **Videos**: Very long TTL (1 year)
- **Documents**: Medium TTL (1 week)
- **Dynamic content**: Short TTL (5 min) or no cache

**2. Cache Key Normalization**
- Remove query params that don't affect content
- Example: /image.jpg?utm_source=email&campaign=summer → /image.jpg
- Increases hit rate by deduplicating similar requests

**3. Cache Warming**
- Pre-populate edge caches before traffic spike
- Example: New product launch → push images to edges proactively
- Prevents cache miss storm

**4. Regional Cache Optimization**
- Popular content in US → aggressive cache in US edges
- Regional content → cache only in relevant region
- Reduces wasted cache space

**5. Compression and Format Optimization**
- Serve WebP/AVIF for modern browsers
- JPEG for older browsers
- Vary header: Accept to cache both versions
- Smaller files = better cache efficiency

**6. Stale-While-Revalidate**
- Serve stale content while fetching fresh in background
- User gets instant response (stale cache)
- CDN updates cache asynchronously
- Best of both: speed + freshness

**Cost Optimization**:
- Every 1% cache hit rate improvement = 20% reduction in origin load
- Origin bandwidth most expensive
- Edge bandwidth much cheaper
- Cache storage virtually free at scale`,

  whyItMatters: 'Every 1% increase in cache hit rate dramatically reduces costs and improves latency. Small optimizations have huge impact at scale.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving trillions of requests per month',
    howTheyDoIt: 'Cloudflare uses intelligent cache key normalization, automatic compression, and regional optimization to achieve 99%+ hit rates for static content.',
  },

  diagram: `
Cache Strategy by Content Type:
┌──────────────┬──────────┬──────────────┬────────────┬──────────┐
│ Content Type │   TTL    │  Versioning  │  Hit Rate  │   Cost   │
├──────────────┼──────────┼──────────────┼────────────┼──────────┤
│ Images       │ 1 year   │ Yes (v1,v2)  │   99%      │  Lowest  │
│ Videos       │ 1 year   │ Yes          │   99.5%    │  Lowest  │
│ Documents    │ 1 week   │ Optional     │   95%      │  Low     │
│ CSS/JS       │ 1 year   │ Yes          │   99%      │  Lowest  │
│ HTML         │ 5 min    │ No           │   70%      │  Medium  │
│ API          │ None/Low │ No           │   20%      │  High    │
└──────────────┴──────────┴──────────────┴────────────┴──────────┘

Cache Hit Rate Impact:
┌────────────┬─────────────┬──────────────┬───────────────┐
│  Hit Rate  │ Origin RPS  │ Bandwidth    │ Monthly Cost  │
├────────────┼─────────────┼──────────────┼───────────────┤
│    90%     │   5,000     │   10 TB/hr   │   $15,000     │
│    95%     │   2,500     │    5 TB/hr   │   $10,000     │
│    98%     │   1,000     │    2 TB/hr   │    $6,000     │
│   98.5%    │     750     │  1.5 TB/hr   │    $4,500     │
│    99%     │     500     │    1 TB/hr   │    $3,000     │
└────────────┴─────────────┴──────────────┴───────────────┘
`,

  keyPoints: [
    'Long TTL + versioned URLs = highest hit rate',
    'Cache key normalization deduplicates requests',
    'Cache warming prevents miss storms',
    'Every 1% hit rate improvement saves 20% origin cost',
    'Stale-while-revalidate balances speed and freshness',
  ],

  quickCheck: {
    question: 'If you improve cache hit rate from 95% to 98%, what happens to origin load?',
    options: [
      'Decreases by 3%',
      'Decreases by 40%',
      'Decreases by 60%',
      'Stays the same',
    ],
    correctIndex: 2,
    explanation: 'Miss rate goes from 5% to 2%. That\'s a 60% reduction! (2% / 5% = 40% remaining, so 60% reduction). Small hit rate improvements have massive impact on origin load.',
  },

  keyConcepts: [
    { title: 'TTL Optimization', explanation: 'Right expiration time per content type', icon: '⏰' },
    { title: 'Cache Key', explanation: 'What makes requests cacheable together', icon: '🔑' },
    { title: 'Cache Warming', explanation: 'Pre-populate before traffic', icon: '🔥' },
    { title: 'Hit Rate', explanation: 'Percentage served from cache', icon: '🎯' },
  ],
};

const step6: GuidedStep = {
  id: 'content-delivery-step-6',
  stepNumber: 6,
  frIndex: 1,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'Optimize cache hit rate and reduce costs',
    taskDescription: 'Review and finalize architecture with optimal caching strategy',
    successCriteria: [
      'Architecture optimized for maximum cache hit rate',
      'Cost-effective design in place',
      'All components properly configured',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'cache', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'cache' },
      { fromType: 'cache', toType: 'object_storage' },
      { fromType: 'client', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Your architecture is already optimal - review the concepts',
    level2: 'Understand TTL optimization, cache warming, and cache key normalization',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const contentDeliveryStorageGuidedTutorial: GuidedTutorial = {
  problemId: 'content-delivery-storage',
  title: 'Design a Content Delivery Storage System',
  description: 'Build a global content delivery platform with object storage, CDN edge caching, origin shielding, and cache invalidation',
  difficulty: 'intermediate',
  estimatedMinutes: 40,

  welcomeStory: {
    emoji: '🌍',
    hook: "You've been hired as Infrastructure Lead at MediaStream!",
    scenario: "Your mission: Build a content delivery system that stores and distributes images, videos, and documents to users worldwide with sub-100ms latency.",
    challenge: "Can you design a system that achieves 95%+ cache hit rate and handles 50K requests per second globally?",
  },

  requirementsPhase: contentDeliveryStorageRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Object Storage (S3)',
    'CDN Edge Caching',
    'Global Content Delivery',
    'Cache Hit Rate',
    'Origin Shield',
    'Request Collapse',
    'Cache Invalidation',
    'TTL (Time To Live)',
    'Cache Purging',
    'Versioned URLs',
    'Cache Key Normalization',
    'Cache Warming',
    'Geographic Distribution',
    'Bandwidth Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 2: Data Models (Object Storage)',
    'Chapter 3: Storage and Retrieval (Caching)',
  ],
};

export default contentDeliveryStorageGuidedTutorial;
