import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * YouTube Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a video-sharing platform like YouTube.
 *
 * Key Concepts:
 * - Video upload and transcoding pipeline
 * - Adaptive streaming (HLS/DASH)
 * - CDN for video delivery
 * - Subscriber notification fan-out
 * - View count eventual consistency
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const youtubeRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a video-sharing platform like YouTube",

  interviewer: {
    name: 'David Chen',
    role: 'Engineering Director at Video Platform Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main things users want to do on this platform?",
      answer: "Users want to:\n\n1. **Upload videos** - Share video content with the world\n2. **Watch videos** - Stream videos smoothly without buffering\n3. **Subscribe to channels** - Follow creators and get updates\n4. **Comment and engage** - Like, comment, and share videos\n5. **Search and discover** - Find videos by title, tags, or description",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "YouTube is about user-generated video content at massive scale",
    },
    {
      id: 'video-upload',
      category: 'functional',
      question: "What happens when a user uploads a video?",
      answer: "User selects a video file, adds title/description/tags, and uploads. The video should be:\n1. Processed (transcoded to multiple resolutions)\n2. Available for viewing within minutes\n3. Stored durably",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Video processing is complex - transcoding takes time and compute",
    },
    {
      id: 'video-playback',
      category: 'functional',
      question: "How should video playback work?",
      answer: "Videos should:\n1. Start playing within 1-2 seconds (low latency)\n2. Adapt quality based on bandwidth (adaptive streaming)\n3. Support different resolutions (360p, 720p, 1080p, 4K)\n4. Minimize buffering",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Adaptive streaming (HLS/DASH) is essential for good user experience",
    },
    {
      id: 'subscriptions',
      category: 'functional',
      question: "How do subscriptions work?",
      answer: "Users subscribe to channels. When a creator uploads, all subscribers see it in their feed. It's a one-way relationship - like following on Twitter.",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Subscription fan-out is similar to Twitter's timeline fan-out problem",
    },
    {
      id: 'live-streaming',
      category: 'clarification',
      question: "Should we support live streaming?",
      answer: "Live streaming is a v2 feature. For the MVP, focus on pre-recorded video upload and playback. Live adds real-time encoding complexity.",
      importance: 'nice-to-have',
      insight: "Live streaming requires low-latency protocols and real-time transcoding",
    },
    {
      id: 'recommendations',
      category: 'clarification',
      question: "Should we have a recommendation algorithm?",
      answer: "For MVP, show chronological videos from subscriptions + popular videos. ML-based recommendations are a v2 feature.",
      importance: 'nice-to-have',
      insight: "Recommendation systems require ML infrastructure - good to defer initially",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "2 billion registered users, 1 billion daily active users (DAU)",
      importance: 'critical',
      learningPoint: "YouTube is the second-largest website globally (after Google Search)",
    },
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many videos are uploaded per day?",
      answer: "About 720,000 hours of video uploaded per day (500 videos per minute)",
      importance: 'critical',
      calculation: {
        formula: "500 videos/min × 60 min = 30,000 videos/hour",
        result: "~720K hours or ~43M minutes of video/day",
      },
      learningPoint: "Massive upload volume requires efficient transcoding pipeline",
    },
    {
      id: 'throughput-views',
      category: 'throughput',
      question: "How many video views per day?",
      answer: "About 5 billion video views per day",
      importance: 'critical',
      calculation: {
        formula: "5B ÷ 86,400 sec = 57,870 views/sec",
        result: "~58K views/sec average (175K at peak)",
      },
      learningPoint: "Read-heavy system - streaming bandwidth is the main constraint",
    },
    {
      id: 'video-size',
      category: 'payload',
      question: "What's the typical video size and length?",
      answer: "Average video: 10 minutes, ~100MB at source quality. After transcoding to multiple resolutions, storage increases 3-5x.",
      importance: 'important',
      calculation: {
        formula: "720K hours × 60 min × 100MB = ~4.3PB raw/day",
        result: "After transcoding: ~15PB/day storage growth",
      },
      learningPoint: "Video storage grows exponentially - need tiered storage strategy",
    },
    {
      id: 'latency-playback',
      category: 'latency',
      question: "How fast should video playback start?",
      answer: "p99 under 2 seconds for initial buffering. After that, smooth playback without rebuffering.",
      importance: 'critical',
      learningPoint: "CDN and adaptive bitrate streaming are essential for low latency",
    },
    {
      id: 'latency-upload',
      category: 'latency',
      question: "How quickly should uploaded videos be available?",
      answer: "Videos should be watchable within 5-10 minutes after upload completes. Transcoding can continue in background for higher resolutions.",
      importance: 'important',
      learningPoint: "Progressive transcoding - make 360p available first, then higher resolutions",
    },
    {
      id: 'viral-video',
      category: 'burst',
      question: "What happens when a video goes viral?",
      answer: "A viral video might get millions of views in hours. The system must handle 1000x normal traffic to a single video without impacting others.",
      importance: 'critical',
      insight: "CDN caching and adaptive streaming are essential for viral content",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'video-upload', 'video-playback', 'throughput-views'],
  criticalFRQuestionIds: ['core-features', 'video-upload', 'video-playback'],
  criticalScaleQuestionIds: ['throughput-views', 'video-size', 'latency-playback', 'viral-video'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can upload videos',
      description: 'Upload video files with title, description, and tags',
      emoji: '📤',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can watch videos',
      description: 'Stream videos with adaptive quality',
      emoji: '▶️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can subscribe to channels',
      description: 'Follow creators and see their uploads',
      emoji: '🔔',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can comment and like',
      description: 'Engage with videos through comments and likes',
      emoji: '💬',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can search videos',
      description: 'Find videos by title, tags, or description',
      emoji: '🔍',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '1 billion',
    writesPerDay: '720K hours of video (500 videos/min)',
    readsPerDay: '5 billion video views',
    peakMultiplier: 3,
    readWriteRatio: '1000:1 (views to uploads)',
    calculatedWriteRPS: { average: 347, peak: 1041 },
    calculatedReadRPS: { average: 57870, peak: 173610 },
    maxPayloadSize: '~2GB (video file)',
    storagePerRecord: '~500MB average (after transcoding)',
    storageGrowthPerYear: '~5,500 PB (5.5 exabytes)',
    redirectLatencySLA: 'p99 < 2s (video start)',
    createLatencySLA: 'p99 < 10min (transcoding)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (1000:1) → CDN is CRITICAL',
    '✅ 175K views/sec peak → Multi-region CDN required',
    '✅ 15PB/day storage growth → Tiered object storage (hot/warm/cold)',
    '✅ Video transcoding → Async processing with message queue',
    '✅ Viral videos → CDN caching prevents origin overload',
    '✅ Subscription fan-out → Similar to Twitter fan-out problem',
  ],

  outOfScope: [
    'Live streaming',
    'Recommendation algorithm (ML-based)',
    'Video editing/filters',
    'YouTube TV (live TV streaming)',
    'Monetization/ads',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can upload and watch videos. The complexity of transcoding, CDN, and adaptive streaming comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'youtube-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '🎬',
    scenario: "Welcome to Video Platform Inc! You're building the next YouTube.",
    hook: "Your first creator just signed up. They're ready to upload their first video!",
    challenge: "Set up the basic connection so users can reach your server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation for Video Platform',
    conceptExplanation: `Every video platform starts with a **Client** (the user's device) connecting to a **Server**.

When someone opens YouTube:
1. The app or website (Client) sends requests to your servers
2. Your App Server processes the requests (upload, watch, search)
3. The server sends back responses (video metadata, streaming URLs)

This is the foundation we'll build on!`,

    whyItMatters: 'Without this connection, users can\'t upload or watch videos.',

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Serving 1 billion daily users',
      howTheyDoIt: 'Started with a simple Python server in 2005, now uses global infrastructure with thousands of servers',
    },

    keyPoints: [
      'Client = the mobile app, web browser, or smart TV app',
      'App Server = your backend that handles video operations',
      'HTTP/HTTPS = the protocol for API communication',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing YouTube', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles video uploads and streaming requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Your video platform is online!',
    achievement: 'Users can now connect to your server',
    metrics: [
      { label: 'Status', after: 'Online' },
      { label: 'Accepting requests', after: '✓' },
    ],
    nextTeaser: "But the server doesn't know how to handle videos yet...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag a Client and App Server from the component palette',
    level2: 'Click Client, then click App Server to connect them',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Core Logic (Python Code)
// =============================================================================

const step2: GuidedStep = {
  id: 'youtube-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A user just tried to upload their first video!",
    hook: "But the server doesn't know what to do with it. Error 500!",
    challenge: "Write the Python handlers for video upload and watch operations.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Video Upload & Streaming APIs',
    conceptExplanation: `We need handlers for core YouTube functionality:

- \`upload_video()\` - Receive video metadata, return upload URL
- \`watch_video()\` - Return video metadata and streaming URL
- \`subscribe_channel()\` - Add channel to user's subscriptions
- \`comment_video()\` - Post a comment on a video

For now, we'll store metadata in memory. The actual video file will go to object storage in a later step.`,

    whyItMatters: 'These handlers are the core logic that makes YouTube work!',

    famousIncident: {
      title: 'YouTube\'s First Video: "Me at the zoo"',
      company: 'YouTube',
      year: '2005',
      whatHappened: 'Co-founder Jawed Karim uploaded the first YouTube video on April 23, 2005. It was only 18 seconds long but proved the upload/playback pipeline worked.',
      lessonLearned: 'Start simple. Get the basic upload and playback working, then optimize.',
      icon: '🦓',
    },

    keyPoints: [
      'upload_video stores metadata (title, description, uploader)',
      'watch_video returns streaming URL for playback',
      'In-memory storage for now - database comes next',
    ],

    quickCheck: {
      question: 'Why do we store video metadata separately from the video file?',
      options: [
        'Video files are too large for databases',
        'We need fast queries on metadata (title, views, likes)',
        'Both A and B - metadata in DB, files in object storage',
        'There\'s no technical reason',
      ],
      correctIndex: 2,
      explanation: 'Databases are optimized for structured queries. Storing GB-sized videos in a DB would be extremely slow and expensive.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Upload videos, FR-2: Watch videos',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign upload and watch APIs',
      'Open Python tab and implement handlers',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Videos can be uploaded and watched!',
    achievement: 'Core YouTube functionality working',
    metrics: [
      { label: 'APIs implemented', after: '4' },
      { label: 'Can upload', after: '✓' },
      { label: 'Can watch', after: '✓' },
    ],
    nextTeaser: "But if the server restarts, all videos are lost...",
  },

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign POST /videos and GET /watch',
    level2: 'Switch to Python tab and fill in the TODO sections for upload_video and watch_video',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/videos', 'GET /api/v1/watch'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3: GuidedStep = {
  id: 'youtube-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Disaster! The server crashed at 2 AM.",
    hook: "When it came back up, every video, every comment, every subscription - GONE. Creators are furious!",
    challenge: "Add a database so data survives server restarts.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Persistent Storage with Databases',
    conceptExplanation: `In-memory storage is fast but volatile. A **database** provides:

- **Durability**: Data survives crashes and restarts
- **Structure**: Tables for videos, users, comments, subscriptions
- **Queries**: Efficient data retrieval with SQL

For YouTube's metadata, we need tables:
- \`users\` - User accounts and channels
- \`videos\` - Video metadata (not the actual video file!)
- \`comments\` - User comments on videos
- \`subscriptions\` - Who subscribes to which channel`,

    whyItMatters: 'Creators trust you with their content. Losing videos destroys trust and your platform.',

    famousIncident: {
      title: 'MySpace Music Loss',
      company: 'MySpace',
      year: '2019',
      whatHappened: 'During a server migration, MySpace lost 12 years of user-uploaded music - over 50 million songs permanently deleted. The platform never recovered.',
      lessonLearned: 'Data durability is non-negotiable. Test your backup and recovery procedures religiously.',
      icon: '💀',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Storing metadata for 800M+ videos',
      howTheyDoIt: 'Uses Google Bigtable (NoSQL) for massive scale, sharded by video_id',
    },

    keyPoints: [
      'Database stores video metadata (title, views, likes, comments)',
      'Actual video files go to object storage (Step 8)',
      'PostgreSQL is great for relational data at this scale',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, videos, comments, subscriptions', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },

  celebration: {
    emoji: '💾',
    message: 'Your data is safe forever!',
    achievement: 'Persistent storage enabled',
    metrics: [
      { label: 'Data durability', after: '100%' },
      { label: 'Survives restarts', after: '✓' },
    ],
    nextTeaser: "But video metadata queries are getting slow...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) onto the canvas',
    level2: 'Connect App Server to Database',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add Cache for Video Metadata
// =============================================================================

const step4: GuidedStep = {
  id: 'youtube-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '🐌',
    scenario: "You have 10 million videos now. The watch page takes 3 seconds to load!",
    hook: "Every watch request hits the database for metadata. It's melting under the load.",
    challenge: "Add a cache to make video metadata lookups instant.",
    illustration: 'slow-loading',
  },

  learnPhase: {
    conceptTitle: 'Caching Video Metadata for Fast Lookups',
    conceptExplanation: `YouTube has a 1000:1 read-to-write ratio (views to uploads). **Caching** is essential!

**Cache-Aside Pattern**:
1. Check cache for video metadata first
2. If miss, fetch from database
3. Store in cache for next viewer

For YouTube, we cache:
- Video metadata (title, description, views, likes)
- User channel information
- Popular video lists

Popular videos like "Gangnam Style" stay hot in cache, rarely touching the database.`,

    whyItMatters: 'At 175K views/sec, every database query costs money and latency. Cache hits are nearly free.',

    famousIncident: {
      title: 'YouTube "Gangnam Style" Breaks View Counter',
      company: 'YouTube',
      year: '2014',
      whatHappened: '"Gangnam Style" became so popular it exceeded YouTube\'s 32-bit integer view counter (2.1 billion limit). YouTube had to upgrade to 64-bit integers.',
      lessonLearned: 'Plan for viral success. What seems impossible today might happen tomorrow.',
      icon: '🎵',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: '5 billion views per day',
      howTheyDoIt: 'Uses massive Redis/Memcached clusters to cache video metadata. 99%+ cache hit rate for popular videos.',
    },

    diagram: `
┌────────┐     ┌─────────────┐     ┌───────┐     ┌──────────┐
│ Client │ ──▶ │ App Server  │ ──▶ │ Redis │ ──▶ │ Database │
└────────┘     └─────────────┘     │ Cache │     └──────────┘
                                   └───────┘
                                       │
                               99% cache hit!
`,

    keyPoints: [
      'Cache-aside: Check cache → miss → fetch DB → populate cache',
      'Set TTL to balance freshness vs hit rate',
      'Popular videos stay hot in cache',
    ],

    quickCheck: {
      question: 'Why is caching more critical for YouTube than Twitter?',
      options: [
        'YouTube has more users',
        'Video metadata is larger than tweets',
        'YouTube has much higher read-to-write ratio (1000:1 vs 20:1)',
        'Caching is equally important',
      ],
      correctIndex: 2,
      explanation: 'YouTube\'s 1000:1 ratio means caching provides even more impact. Most videos are watched many times after upload.',
    },
  },

  practicePhase: {
    frText: 'FR-2: Watch videos (now fast!)',
    taskDescription: 'Add Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache video metadata for instant lookups', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'TTL configured (60 seconds)',
      'Cache strategy set',
    ],
  },

  celebration: {
    emoji: '⚡',
    message: 'Video pages load 50x faster!',
    achievement: 'Caching dramatically improved performance',
    metrics: [
      { label: 'Watch page latency', before: '3000ms', after: '60ms' },
      { label: 'Cache hit rate', after: '99%' },
    ],
    nextTeaser: "But one server can't handle millions of viewers...",
  },

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) onto the canvas',
    level2: 'Connect App Server to Cache. Set TTL to 60 seconds.',
    solutionComponents: [{ type: 'cache', config: { ttl: 60, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer
// =============================================================================

const step5: GuidedStep = {
  id: 'youtube-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: {
    emoji: '🔥',
    scenario: "A viral video just dropped! Your single server is at 100% CPU!",
    hook: "Traffic spiked 100x in 10 minutes. Users are getting connection timeouts.",
    challenge: "Add a load balancer to distribute traffic across servers.",
    illustration: 'server-overload',
  },

  learnPhase: {
    conceptTitle: 'Load Balancing Algorithms for Video Traffic',
    conceptExplanation: `A **Load Balancer** distributes requests across multiple servers.

**Load Balancing Algorithms**:
- **Round Robin**: Take turns (simple, fair)
- **Least Connections**: Send to least busy server
- **IP Hash**: Same user → same server (session affinity)
- **Weighted Round Robin**: More powerful servers get more traffic

**Layer 4 vs Layer 7**:
- **L4 (Transport)**: Fast, routes by IP/port
- **L7 (Application)**: Smart, routes by URL path/headers

For YouTube, we'll use **L7 load balancing** to route video uploads, watches, and API calls efficiently.`,

    whyItMatters: 'Viral videos cause unpredictable traffic spikes. One server will always fail.',

    famousIncident: {
      title: 'YouTube Global Outage',
      company: 'YouTube',
      year: '2018',
      whatHappened: 'A configuration error in YouTube\'s load balancing layer caused a global outage for 90 minutes. Users worldwide saw error pages.',
      lessonLearned: 'Load balancers are critical infrastructure. Changes require extensive testing and gradual rollout.',
      icon: '🌍',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Handling 175K requests/sec at peak',
      howTheyDoIt: 'Uses Google Cloud Load Balancing with multiple layers (DNS, L4, L7) to distribute traffic globally',
    },

    keyPoints: [
      'L7 load balancing routes by URL path (upload, watch, API)',
      'Round Robin is simple and effective for stateless services',
      'Health checks detect and route around failures',
      'Enables adding/removing servers without downtime',
    ],

    quickCheck: {
      question: 'Why use L7 (Application) load balancing instead of L4 (Transport)?',
      options: [
        'L7 is faster',
        'L7 can route based on URL paths and headers, not just IP/port',
        'L7 is cheaper',
        'L4 doesn\'t support HTTPS',
      ],
      correctIndex: 1,
      explanation: 'L7 inspects HTTP content. You can route /upload to upload servers, /watch to streaming servers, etc.',
    },
  },

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add Load Balancer between Client and App Server',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute traffic using L7 routing', displayName: 'Load Balancer (L7)' },
    ],
    successCriteria: [
      'Load Balancer added',
      'Client → Load Balancer connection',
      'Load Balancer → App Server connection',
    ],
  },

  celebration: {
    emoji: '🎛️',
    message: 'Traffic is distributed!',
    achievement: 'Load balancer prevents overload',
    metrics: [
      { label: 'Single point of failure', before: 'Yes', after: 'No' },
      { label: 'Can scale horizontally', after: '✓' },
    ],
    nextTeaser: "But the database is becoming a bottleneck...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Database Replication
// =============================================================================

const step6: GuidedStep = {
  id: 'youtube-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: {
    emoji: '⚠️',
    scenario: "Your database crashed for 30 minutes. YouTube was completely down.",
    hook: "Users couldn't watch, upload, or comment. Revenue loss: $500,000. Emergency!",
    challenge: "Add database replication for instant failover.",
    illustration: 'database-failure',
  },

  learnPhase: {
    conceptTitle: 'Database Replication for High Availability',
    conceptExplanation: `**Replication** copies data to multiple servers:

- **Primary (Leader)**: Handles all writes
- **Replicas (Followers)**: Handle reads, stay in sync with primary

Benefits:
- If primary fails, replica becomes new primary (failover)
- Spread read load across replicas (important for metadata queries)
- Multiple copies = data safety

For YouTube:
- Primary handles video uploads, likes, comments (writes)
- Replicas handle watch page metadata queries (reads)
- 2-3 replicas for redundancy`,

    whyItMatters: 'YouTube stores 800M+ videos. Downtime means creators can\'t reach their audience and you lose millions.',

    famousIncident: {
      title: 'GitLab Database Deletion',
      company: 'GitLab',
      year: '2017',
      whatHappened: 'An engineer accidentally deleted the production database. Replication lag was too high, so backups were also affected. 6 hours of data lost.',
      lessonLearned: 'Monitor replication lag closely. Test your failover process regularly. Have offline backups.',
      icon: '🗑️',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Zero tolerance for data loss',
      howTheyDoIt: 'Uses Google Spanner with multi-region replication. Each video metadata record is stored on 3+ servers across data centers.',
    },

    keyPoints: [
      'Primary handles writes, replicas handle reads',
      'Failover: replica promoted to primary on failure',
      'Monitor replication lag to prevent stale data',
      'Use 2+ replicas for safety',
    ],
  },

  practicePhase: {
    frText: 'All FRs need reliable data storage',
    taskDescription: 'Enable database replication with 2+ replicas',
    successCriteria: [
      'Click Database component',
      'Enable replication in config',
      'Set replica count to 2',
    ],
  },

  celebration: {
    emoji: '🛡️',
    message: 'Database is fault-tolerant!',
    achievement: 'Replicas provide redundancy',
    metrics: [
      { label: 'Database availability', before: '99%', after: '99.99%' },
      { label: 'Read capacity', before: '1x', after: '3x' },
    ],
    nextTeaser: "But we need more app servers to handle the traffic...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
  },

  hints: {
    level1: 'Click Database → Configuration → Enable replication',
    level2: 'Set replica count to 2 for redundancy',
    solutionComponents: [{ type: 'database', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Horizontal Scaling
// =============================================================================

const step7: GuidedStep = {
  id: 'youtube-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: {
    emoji: '📈',
    scenario: "You've grown to 500 million users! One app server is overwhelmed.",
    hook: "Even with caching and load balancing, a single server instance can't handle the volume.",
    challenge: "Scale horizontally by adding more app server instances.",
    illustration: 'traffic-spike',
  },

  learnPhase: {
    conceptTitle: 'Horizontal Scaling for Global Traffic',
    conceptExplanation: `**Horizontal scaling** = adding more servers (scale out)
**Vertical scaling** = upgrading a single server (scale up)

Horizontal is better because:
- No upper limit (keep adding servers)
- Better fault tolerance (one fails, others continue)
- More cost-effective at scale
- Can scale different services independently

For YouTube, we'll run multiple app server instances:
- Upload servers handle video ingestion
- API servers handle metadata requests
- All instances share cache and database`,

    whyItMatters: 'At 175K requests/sec, you need hundreds of servers working together.',

    famousIncident: {
      title: 'YouTube\'s Scalability Challenges',
      company: 'YouTube',
      year: '2006-2007',
      whatHappened: 'After Google acquired YouTube, traffic grew 10x in months. YouTube had to completely redesign their infrastructure for horizontal scaling.',
      lessonLearned: 'Design for horizontal scaling from day 1. It\'s much harder to retrofit later.',
      icon: '📊',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Handling global traffic 24/7',
      howTheyDoIt: 'Runs thousands of servers across data centers worldwide. Auto-scales based on traffic patterns.',
    },

    keyPoints: [
      'Add more server instances to handle more traffic',
      'Load balancer distributes across all instances',
      'Stateless servers are easier to scale',
      'Scale different services independently',
    ],
  },

  practicePhase: {
    frText: 'All FRs need more compute capacity',
    taskDescription: 'Scale App Server to 3+ instances',
    successCriteria: [
      'Click App Server',
      'Set instances to 3 or more',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: '10x more capacity!',
    achievement: 'Multiple servers share the load',
    metrics: [
      { label: 'App Server instances', before: '1', after: '3+' },
      { label: 'Request capacity', before: '10K/s', after: '100K+/s' },
    ],
    nextTeaser: "But where are the actual video files stored?",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click App Server → Configuration → Set instances',
    level2: 'Set instances to 3 for horizontal scaling',
    solutionComponents: [{ type: 'app_server', config: { instances: 3 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Object Storage for Video Files
// =============================================================================

const step8: GuidedStep = {
  id: 'youtube-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: {
    emoji: '📦',
    scenario: "You're storing 15PB of videos per day. The database can't handle binary files!",
    hook: "Databases are designed for structured data, not GB-sized video blobs.",
    challenge: "Add object storage (S3) for video files.",
    illustration: 'storage-full',
  },

  learnPhase: {
    conceptTitle: 'Object Storage for Video Files',
    conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (videos, thumbnails)
- Virtually unlimited capacity (exabytes)
- Pay only for what you use
- Built-in redundancy (99.999999999% durability)
- Supports versioning and lifecycle policies

Architecture:
- **Database**: Video metadata (title, views, upload_date)
- **Object Storage**: Actual video files (original + transcoded)
- Video URL stored in database points to S3 object

Lifecycle policy:
- Hot videos (< 30 days): Standard storage
- Warm videos (30-365 days): Infrequent Access
- Cold videos (> 1 year): Glacier (archive)`,

    whyItMatters: 'YouTube stores 800M+ videos totaling exabytes. You can\'t put that in PostgreSQL.',

    famousIncident: {
      title: 'YouTube Storage Growth',
      company: 'YouTube',
      year: '2020',
      whatHappened: 'YouTube announced they store over 500 hours of video uploaded every minute. That\'s ~15PB per day. Traditional storage would be impossible.',
      lessonLearned: 'Object storage is the only viable solution for video at scale.',
      icon: '💾',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Storing exabytes of video',
      howTheyDoIt: 'Uses Google Cloud Storage with tiered storage. Old videos moved to cheaper archival storage automatically.',
    },

    diagram: `
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ 1. Upload video
       ▼
┌──────────────┐     2. Store video    ┌─────────────────┐
│  App Server  │ ──────────────────▶  │  Object Storage │
└──────┬───────┘                       │     (S3)        │
       │                               │  - Original     │
       │ 3. Save metadata              │  - Transcoded   │
       ▼                               └─────────────────┘
┌──────────────┐
│   Database   │  (video_url: "s3://bucket/video123.mp4")
└──────────────┘
`,

    keyPoints: [
      'Object storage for video files, database for metadata',
      'Store video URL in database, actual file in S3',
      'Use lifecycle policies for tiered storage (hot/warm/cold)',
      'S3 handles replication and durability automatically',
    ],

    quickCheck: {
      question: 'Why not store videos directly in the database?',
      options: [
        'Databases can\'t store binary data',
        'Videos are too large - databases would be extremely slow and expensive',
        'It would violate copyright laws',
        'Videos need to be publicly accessible',
      ],
      correctIndex: 1,
      explanation: 'Databases CAN store binary, but it\'s not designed for GB-sized blobs. Queries slow down massively, storage costs explode.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Upload videos (now at scale!)',
    taskDescription: 'Add Object Storage for video files',
    componentsNeeded: [
      { type: 'object_storage', reason: 'Store video files durably', displayName: 'S3 Object Storage' },
    ],
    successCriteria: [
      'Object Storage component added',
      'App Server connected to Object Storage',
    ],
  },

  celebration: {
    emoji: '☁️',
    message: 'Videos have a proper home!',
    achievement: 'Object storage handles unlimited videos',
    metrics: [
      { label: 'Video storage', after: 'Unlimited (S3)' },
      { label: 'Durability', after: '99.999999999%' },
    ],
    nextTeaser: "But viewers far away experience slow buffering...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag Object Storage (S3) onto the canvas',
    level2: 'Connect App Server to Object Storage for video uploads',
    solutionComponents: [{ type: 'object_storage' }],
    solutionConnections: [{ from: 'app_server', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 9: CDN for Video Streaming + Message Queue for Transcoding
// =============================================================================

const step9: GuidedStep = {
  id: 'youtube-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: {
    emoji: '🌍',
    scenario: "Users in Australia are waiting 30 seconds for videos to load!",
    hook: "Your servers are in US. Round-trip to Australia takes 300ms. Plus videos aren't transcoded yet!",
    challenge: "Add CDN for global delivery and Message Queue for async transcoding.",
    illustration: 'global-latency',
  },

  learnPhase: {
    conceptTitle: 'CDN for Video Streaming + Async Transcoding',
    conceptExplanation: `**CDN (Content Delivery Network)** caches videos at edge locations worldwide.

How it works:
1. First viewer: Edge fetches from origin (S3), caches it
2. Subsequent viewers: Served from edge (< 50ms latency)
3. Popular videos cached at all edges globally

**Adaptive Streaming (HLS/DASH)**:
- Video transcoded into multiple resolutions (360p, 720p, 1080p, 4K)
- Player automatically switches quality based on bandwidth
- Prevents buffering

**Message Queue for Transcoding**:
- Video upload → Add to queue → Return success immediately
- Background workers transcode video asynchronously
- Progressive availability: 360p first, then higher resolutions`,

    whyItMatters: 'YouTube has global users. CDN makes videos load fast everywhere. Transcoding takes minutes - must be async.',

    famousIncident: {
      title: 'YouTube Transcoding Challenges',
      company: 'YouTube',
      year: '2007',
      whatHappened: 'Early YouTube struggled with transcoding 500 hours of video per minute. They built a massive distributed transcoding pipeline with thousands of workers.',
      lessonLearned: 'Video transcoding is CPU-intensive. Must be async and distributed.',
      icon: '🎞️',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Serving 5B videos daily globally',
      howTheyDoIt: 'Uses Google Cloud CDN with thousands of edge locations. Transcodes to 10+ formats/resolutions automatically.',
    },

    diagram: `
Upload Flow:
┌──────────┐   Upload   ┌──────────┐   Queue   ┌───────────────┐
│   User   │ ────────▶  │   App    │ ────────▶ │ Message Queue │
└──────────┘            │  Server  │           │   (Kafka)     │
                        └──────────┘           └───────┬───────┘
                                                       │
                                               Workers consume
                                                       ▼
                                              ┌─────────────────┐
                                              │ Transcode       │
                                              │ Workers         │
                                              │ (360p, 720p...) │
                                              └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Object Storage │
                                              │     (S3)        │
                                              └─────────────────┘

Playback Flow:
┌──────────┐    50ms    ┌──────────┐          ┌─────────────┐
│  Viewer  │◀──────────▶│   CDN    │   Miss   │  Origin     │
│ (Tokyo)  │            │  Edge    │ ───────▶ │   (S3)      │
└──────────┘            └──────────┘          └─────────────┘
`,

    keyPoints: [
      'CDN caches videos at edge locations globally',
      'Adaptive streaming (HLS) provides smooth playback',
      'Message queue enables async transcoding',
      'Progressive availability: 360p first, then higher resolutions',
    ],

    quickCheck: {
      question: 'Why transcode videos asynchronously instead of during upload?',
      options: [
        'Transcoding is fast enough to do synchronously',
        'Transcoding takes minutes - users would timeout waiting',
        'Async transcoding is cheaper',
        'It\'s a YouTube-specific quirk',
      ],
      correctIndex: 1,
      explanation: 'Transcoding a 10-min video to multiple resolutions takes 5-10 minutes. Users can\'t wait that long.',
    },
  },

  practicePhase: {
    frText: 'FR-2: Watch videos with fast global streaming',
    taskDescription: 'Add CDN for video delivery and Message Queue for transcoding',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver videos from edge locations globally', displayName: 'CloudFront CDN' },
      { type: 'message_queue', reason: 'Handle async video transcoding', displayName: 'Kafka' },
    ],
    successCriteria: [
      'CDN component added',
      'Message Queue component added',
      'CDN connected to Object Storage (origin)',
      'App Server connected to Message Queue',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: 'Videos stream fast everywhere!',
    achievement: 'CDN + async transcoding complete',
    metrics: [
      { label: 'Australia latency', before: '30s', after: '1s' },
      { label: 'Global edge locations', after: '200+' },
      { label: 'Transcoding time', after: '5-10 min (async)' },
    ],
    nextTeaser: "Time to optimize costs...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add CDN and Message Queue components',
    level2: 'Connect CDN → Object Storage (for playback) and App Server → Message Queue (for transcoding)',
    solutionComponents: [{ type: 'cdn' }, { type: 'message_queue' }],
    solutionConnections: [
      { from: 'cdn', to: 'object_storage' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10: GuidedStep = {
  id: 'youtube-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: {
    emoji: '💸',
    scenario: "Finance is panicking! Your cloud bill is $5M per month.",
    hook: "The CFO says: 'Cut costs 30% or we're shutting down features.'",
    challenge: "Optimize your architecture to stay under budget while maintaining performance.",
    illustration: 'budget-crisis',
  },

  learnPhase: {
    conceptTitle: 'Cost Optimization for Video Platforms',
    conceptExplanation: `Video platforms are expensive. Smart optimization is critical.

Cost optimization strategies:
1. **Tiered Storage** - Move old videos to cheaper storage (Glacier)
2. **CDN Caching** - Reduce origin requests (bandwidth is expensive)
3. **Smart Transcoding** - Don't transcode to 4K if nobody watches at 4K
4. **Right-size Instances** - Don't over-provision servers
5. **Auto-scaling** - Scale down during low traffic
6. **Compression** - Use efficient codecs (H.265 vs H.264)

For YouTube:
- 90% of views are on videos < 30 days old (cache hot videos)
- Archive old videos to cheap storage
- Only transcode to high resolutions on demand`,

    whyItMatters: 'Storage and bandwidth are the biggest costs for video platforms. Optimization can save millions.',

    famousIncident: {
      title: 'YouTube Loses Money for Years',
      company: 'YouTube',
      year: '2006-2015',
      whatHappened: 'Despite massive popularity, YouTube lost money for nearly a decade due to storage and bandwidth costs. Only became profitable through aggressive optimization and ads.',
      lessonLearned: 'Video platforms have thin margins. Every optimization matters.',
      icon: '💰',
    },

    realWorldExample: {
      company: 'YouTube',
      scenario: 'Running at massive scale',
      howTheyDoIt: 'Heavily optimizes codecs, uses tiered storage, and leverages Google\'s network infrastructure. Still costs billions yearly.',
    },

    keyPoints: [
      'Tiered storage: hot (Standard), warm (IA), cold (Glacier)',
      'CDN caching reduces expensive origin bandwidth',
      'Smart transcoding: only encode what users watch',
      'Auto-scale based on traffic patterns',
    ],

    quickCheck: {
      question: 'What\'s the most effective cost optimization for a video platform?',
      options: [
        'Delete old videos',
        'Use smaller servers',
        'Aggressive CDN caching to reduce origin bandwidth',
        'Reduce video quality',
      ],
      correctIndex: 2,
      explanation: 'Bandwidth is the biggest cost. CDN caching means videos are served from edges, not origin. Can reduce costs by 70%+.',
    },
  },

  practicePhase: {
    frText: 'All FRs within budget',
    taskDescription: 'Optimize system to stay under $500/month budget',
    successCriteria: [
      'Review component configurations',
      'Ensure total cost under budget',
      'Maintain performance requirements',
    ],
  },

  celebration: {
    emoji: '🏆',
    message: 'Congratulations! You built YouTube!',
    achievement: 'A scalable, cost-effective video platform',
    metrics: [
      { label: 'Monthly cost', before: '$5M', after: 'Under budget' },
      { label: 'Video latency', after: '<2s' },
      { label: 'Videos uploaded', after: '500/min' },
      { label: 'Global availability', after: '99.99%' },
    ],
    nextTeaser: "You've mastered YouTube system design!",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning',
    level2: 'Consider: tiered storage, fewer replicas if acceptable, right-sized instances. Keep CDN caching aggressive.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const youtubeGuidedTutorial: GuidedTutorial = {
  problemId: 'youtube',
  title: 'Design YouTube',
  description: 'Build a video-sharing platform with streaming, transcoding, and global delivery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '🎬',
    hook: "You've been hired as Lead Engineer at Video Platform Inc!",
    scenario: "Your mission: Build a platform where creators can upload videos and viewers can watch them anywhere in the world - like YouTube!",
    challenge: "Can you design a system that handles 500 hours of video uploaded every minute?",
  },

  requirementsPhase: youtubeRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching Strategies',
    'Load Balancing (L4 vs L7)',
    'Database Replication',
    'Horizontal Scaling',
    'Object Storage',
    'CDN for Video Streaming',
    'Message Queues',
    'Async Transcoding',
    'Adaptive Streaming (HLS/DASH)',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
  ],
};

export default youtubeGuidedTutorial;
