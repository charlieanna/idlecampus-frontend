import {
  GuidedTutorial,
  GuidedStep,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * TikTok Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial teaching system design through
 * building a short video platform like TikTok.
 *
 * Key Concepts:
 * - Short video upload and feed delivery
 * - For You Page algorithm and recommendations
 * - Social engagement (likes, comments, shares)
 * - Video discovery and trending content
 * - CDN for global video delivery
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const tiktokRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a short video platform like TikTok",

  interviewer: {
    name: 'Alex Rivera',
    role: 'VP of Engineering at ViralClips Inc.',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What are the main things users want to do on this short video platform?",
      answer: "Users want to:\n\n1. **Upload short videos** - Record and share 15-60 second videos\n2. **Watch For You feed** - Endless scroll of personalized videos\n3. **Engage with content** - Like, comment, and share videos\n4. **Discover trends** - Find trending sounds, hashtags, and challenges\n5. **Follow creators** - Subscribe to favorite content creators",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "TikTok is about rapid-fire content consumption and viral discovery",
    },
    {
      id: 'video-upload',
      category: 'functional',
      question: "What happens when a user uploads a short video?",
      answer: "User records or selects a video (15-60 seconds), adds music/effects/filters, writes a caption with hashtags, and uploads. The video should be:\n1. Processed quickly (compressed, thumbnails generated)\n2. Available in the feed within seconds\n3. Analyzed for recommendation algorithm",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Short videos require fast processing - users expect near-instant availability",
    },
    {
      id: 'for-you-feed',
      category: 'functional',
      question: "How does the For You Page (FYP) work?",
      answer: "The FYP is an endless, personalized video feed. Unlike Instagram where you follow people, TikTok shows you videos based on what you engage with. The algorithm considers:\n1. Watch time (did you watch the whole video?)\n2. Engagement (likes, comments, shares)\n3. Video information (hashtags, sounds, captions)\n4. User preferences and history",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "TikTok's algorithm is its core differentiator - ML-driven content discovery",
    },
    {
      id: 'video-playback',
      category: 'functional',
      question: "How should video playback work?",
      answer: "Videos should:\n1. Start playing instantly (< 500ms) when scrolled to\n2. Loop automatically (short videos play continuously)\n3. Pre-load the next 2-3 videos for seamless scrolling\n4. Adapt quality based on network conditions",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Instant playback and pre-loading are critical for TikTok's addictive UX",
    },
    {
      id: 'engagement',
      category: 'functional',
      question: "What engagement features are needed?",
      answer: "Users can:\n1. Like videos (double-tap or tap heart)\n2. Comment on videos\n3. Share videos (within app or external)\n4. Follow creators\n5. Save videos to collections",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Social engagement drives virality and the recommendation algorithm",
    },
    {
      id: 'live-streaming',
      category: 'clarification',
      question: "Should we support live streaming?",
      answer: "Live streaming is a v2 feature. For MVP, focus on pre-recorded short videos. Live requires real-time encoding and chat infrastructure.",
      importance: 'nice-to-have',
      insight: "Live streaming adds significant complexity - defer for initial launch",
    },
    {
      id: 'video-editing',
      category: 'clarification',
      question: "Should we have in-app video editing?",
      answer: "Basic editing (trim, filters, text overlay) is important for MVP. Advanced editing (green screen, transitions) can be v2. Users expect some editing capabilities.",
      importance: 'important',
      insight: "Mobile video editing is compute-intensive - balance features vs performance",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many users should we support?",
      answer: "1 billion registered users globally, 150 million daily active users (DAU)",
      importance: 'critical',
      learningPoint: "TikTok is one of the fastest-growing social platforms in history",
    },
    {
      id: 'throughput-uploads',
      category: 'throughput',
      question: "How many videos are uploaded per day?",
      answer: "About 2-3 million short videos uploaded per day globally",
      importance: 'critical',
      calculation: {
        formula: "3M videos ÷ 86,400 sec = ~35 uploads/sec",
        result: "~35 uploads/sec average (100+ at peak)",
      },
      learningPoint: "High upload velocity requires efficient video processing pipeline",
    },
    {
      id: 'throughput-views',
      category: 'throughput',
      question: "How many video views per day?",
      answer: "About 10 billion video views per day",
      importance: 'critical',
      calculation: {
        formula: "10B ÷ 86,400 sec = 115,740 views/sec",
        result: "~116K views/sec average (350K at peak)",
      },
      learningPoint: "Extremely read-heavy system - typical user watches 50-100 videos/session",
    },
    {
      id: 'video-size',
      category: 'payload',
      question: "What's the typical video size and length?",
      answer: "Average video: 30 seconds, ~10-20MB at source quality. After compression: 3-5MB. Much smaller than YouTube videos!",
      importance: 'important',
      calculation: {
        formula: "3M uploads × 5MB = 15TB/day storage growth",
        result: "~15TB/day raw video storage",
      },
      learningPoint: "Short videos mean faster uploads and less storage than traditional video platforms",
    },
    {
      id: 'latency-playback',
      category: 'latency',
      question: "How fast should video playback start?",
      answer: "p99 under 500ms for video start. TikTok users scroll fast - any delay kills engagement.",
      importance: 'critical',
      learningPoint: "Instant playback is non-negotiable - CDN and aggressive pre-loading required",
    },
    {
      id: 'latency-feed',
      category: 'latency',
      question: "How fast should the For You feed load?",
      answer: "Initial feed should load within 1 second. Pre-load next videos in background for seamless scrolling.",
      importance: 'critical',
      learningPoint: "Feed latency directly impacts time spent on app - optimize aggressively",
    },
    {
      id: 'viral-video',
      category: 'burst',
      question: "What happens when a video goes viral?",
      answer: "A viral video might get 100M views in 24 hours. The system must handle sudden 1000x traffic spikes to individual videos without degrading the feed for other users.",
      importance: 'critical',
      insight: "CDN caching and auto-scaling are essential for viral content spikes",
    },
    {
      id: 'regional-compliance',
      category: 'availability',
      question: "What about global deployment and regional compliance?",
      answer: "TikTok must comply with regional data regulations (GDPR, data residency). Deploy regionally to reduce latency and meet compliance needs.",
      importance: 'important',
      insight: "Multi-region deployment is both a performance and compliance requirement",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'for-you-feed', 'video-playback', 'throughput-views'],
  criticalFRQuestionIds: ['core-features', 'for-you-feed', 'video-playback'],
  criticalScaleQuestionIds: ['throughput-views', 'latency-playback', 'viral-video'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users can upload short videos',
      description: 'Record and share 15-60 second videos with effects',
      emoji: '📹',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can watch For You feed',
      description: 'Endless scroll of personalized video recommendations',
      emoji: '🎯',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Users can engage with videos',
      description: 'Like, comment, share, and follow creators',
      emoji: '❤️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Users can discover trending content',
      description: 'Find viral hashtags, sounds, and challenges',
      emoji: '🔥',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Users can follow creators',
      description: 'Subscribe to favorite creators and see their videos',
      emoji: '👥',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '150 million',
    writesPerDay: '3M video uploads + 500M engagement actions',
    readsPerDay: '10 billion video views',
    peakMultiplier: 3,
    readWriteRatio: '3000:1 (views to uploads)',
    calculatedWriteRPS: { average: 35, peak: 105 },
    calculatedReadRPS: { average: 115740, peak: 347220 },
    maxPayloadSize: '~20MB (raw video)',
    storagePerRecord: '~5MB average (after compression)',
    storageGrowthPerYear: '~5.5 PB',
    redirectLatencySLA: 'p99 < 500ms (video start)',
    createLatencySLA: 'p99 < 5s (video processing)',
  },

  architecturalImplications: [
    '✅ Extremely read-heavy (3000:1) → Aggressive CDN caching critical',
    '✅ 350K views/sec peak → Multi-region CDN with edge caching',
    '✅ 500ms video start → Pre-loading + edge delivery required',
    '✅ Personalized feed → Recommendation service with ML',
    '✅ Viral content spikes → Auto-scaling and CDN handle 1000x bursts',
    '✅ Short videos (30s avg) → Faster processing than YouTube',
  ],

  outOfScope: [
    'Live streaming',
    'Advanced video editing (green screen, transitions)',
    'Direct messaging',
    'TikTok Shop (e-commerce)',
    'Creator monetization/ads',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where users can upload short videos and watch a feed. The complexity of recommendations, viral content handling, and global CDN comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1: GuidedStep = {
  id: 'tiktok-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: {
    emoji: '📱',
    scenario: "Welcome to ViralClips Inc! You're building the next TikTok.",
    hook: "Your first creator just downloaded the app and wants to post their first video!",
    challenge: "Set up the basic connection so users can reach your server.",
    illustration: 'startup-launch',
  },

  learnPhase: {
    conceptTitle: 'Client-Server Foundation for Short Video Platform',
    conceptExplanation: `Every social video platform starts with a **Client** (the user's mobile app) connecting to a **Server**.

When someone opens TikTok:
1. The mobile app (Client) sends requests to your servers
2. Your App Server processes the requests (upload video, fetch feed, post comment)
3. The server sends back responses (video feed, engagement counts)

This is the foundation we'll build on!`,

    whyItMatters: 'Without this connection, users can\'t upload videos or see their feed.',

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Serving 150 million daily users',
      howTheyDoIt: 'Started with simple mobile app + backend in 2016, now uses global infrastructure with microservices',
    },

    keyPoints: [
      'Client = the mobile app (iOS/Android)',
      'App Server = your backend handling video operations',
      'HTTP/HTTPS = the protocol for API communication',
    ],
  },

  practicePhase: {
    frText: 'Setting up foundation for all FRs',
    taskDescription: 'Add a Client and App Server, connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users accessing TikTok', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles video uploads and feed requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Client connected to App Server',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Your short video platform is online!',
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
  id: 'tiktok-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: {
    emoji: '💻',
    scenario: "A user just tried to upload their first dance video!",
    hook: "But the server doesn't know what to do with it. Error 500!",
    challenge: "Write the Python handlers for video upload, feed, and engagement operations.",
    illustration: 'code-editor',
  },

  learnPhase: {
    conceptTitle: 'Short Video Platform APIs',
    conceptExplanation: `We need handlers for core TikTok functionality:

- \`upload_video()\` - Receive video file, process metadata
- \`get_feed()\` - Return personalized For You feed
- \`like_video()\` - Track user engagement (likes)
- \`comment_video()\` - Post comments on videos
- \`follow_user()\` - Follow a creator

For now, we'll store data in memory. The actual video file will go to object storage in a later step.`,

    whyItMatters: 'These handlers are the core logic that makes TikTok work!',

    famousIncident: {
      title: 'TikTok\'s Rapid Growth Crisis',
      company: 'TikTok',
      year: '2018-2019',
      whatHappened: 'TikTok grew from 50M to 500M users in 18 months. The infrastructure team had to constantly scale and optimize to handle the explosive growth, often deploying new capacity weekly.',
      lessonLearned: 'Build for scale early. Viral growth can happen overnight in social media.',
      icon: '🚀',
    },

    keyPoints: [
      'upload_video stores metadata (caption, hashtags, music)',
      'get_feed returns personalized video recommendations',
      'In-memory storage for now - database comes next',
    ],

    quickCheck: {
      question: 'Why does TikTok\'s For You feed need to be personalized per user?',
      options: [
        'It\'s easier to implement',
        'Personalization increases engagement and time spent on app',
        'It saves bandwidth',
        'It\'s required by law',
      ],
      correctIndex: 1,
      explanation: 'TikTok\'s secret sauce is its recommendation algorithm. Personalized content keeps users scrolling for hours.',
    },
  },

  practicePhase: {
    frText: 'FR-1: Upload videos, FR-2: Watch feed',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign upload and feed APIs',
      'Open Python tab and implement handlers',
    ],
  },

  celebration: {
    emoji: '🎉',
    message: 'Videos can be uploaded and viewed!',
    achievement: 'Core TikTok functionality working',
    metrics: [
      { label: 'APIs implemented', after: '5' },
      { label: 'Can upload', after: '✓' },
      { label: 'Can view feed', after: '✓' },
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
    level1: 'Click App Server → APIs tab → Assign POST /videos and GET /feed',
    level2: 'Switch to Python tab and fill in the TODO sections for upload_video and get_feed',
    solutionComponents: [{ type: 'app_server', config: { handledAPIs: ['POST /api/v1/videos', 'GET /api/v1/feed'] } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Database
// =============================================================================

const step3: GuidedStep = {
  id: 'tiktok-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: {
    emoji: '💥',
    scenario: "Disaster! The server crashed during a viral challenge.",
    hook: "When it came back up, every video, every like, every follow - GONE. Creators are devastated!",
    challenge: "Add a database so data survives server restarts.",
    illustration: 'data-loss',
  },

  learnPhase: {
    conceptTitle: 'Persistent Storage with Databases',
    conceptExplanation: `In-memory storage is fast but volatile. A **database** provides:

- **Durability**: Data survives crashes and restarts
- **Structure**: Tables for videos, users, likes, comments
- **Queries**: Efficient data retrieval with SQL

For TikTok's metadata, we need tables:
- \`users\` - User accounts and profiles
- \`videos\` - Video metadata (not the actual video file!)
- \`likes\` - User engagement on videos
- \`comments\` - User comments on videos
- \`follows\` - Social graph (who follows whom)`,

    whyItMatters: 'Creators invest time making content. Losing videos destroys trust and your platform.',

    famousIncident: {
      title: 'Instagram Data Loss Scare',
      company: 'Instagram',
      year: '2014',
      whatHappened: 'A database bug caused some users to lose photos for several hours. Instagram quickly restored from backups, but the panic was real. Trust in the platform temporarily plummeted.',
      lessonLearned: 'Data durability is non-negotiable for user-generated content platforms. Have backup strategies.',
      icon: '📸',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Storing metadata for billions of videos',
      howTheyDoIt: 'Uses distributed databases (similar to Cassandra) for massive scale, sharded by video_id and user_id',
    },

    keyPoints: [
      'Database stores video metadata (caption, hashtags, engagement counts)',
      'Actual video files go to object storage (Step 8)',
      'PostgreSQL is great for relational data at this scale',
    ],
  },

  practicePhase: {
    frText: 'All FRs need persistent storage',
    taskDescription: 'Add a Database and connect App Server to it',
    componentsNeeded: [
      { type: 'database', reason: 'Store users, videos, likes, comments, follows', displayName: 'PostgreSQL' },
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
    nextTeaser: "But feed queries are getting slow...",
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
// STEP 4: Add Cache for Feed and Metadata
// =============================================================================

const step4: GuidedStep = {
  id: 'tiktok-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: {
    emoji: '🐌',
    scenario: "You have 100 million videos now. The For You feed takes 5 seconds to load!",
    hook: "Every feed request queries the database for recommendations. Users are leaving!",
    challenge: "Add a cache to make feed and video metadata lookups instant.",
    illustration: 'slow-loading',
  },

  learnPhase: {
    conceptTitle: 'Caching for Personalized Feeds',
    conceptExplanation: `TikTok has an extreme read-to-write ratio (3000:1). **Caching** is essential!

**Cache-Aside Pattern**:
1. Check cache for feed/video data first
2. If miss, fetch from database and recommendation service
3. Store in cache for next request

For TikTok, we cache:
- Pre-computed feed recommendations per user
- Video metadata (caption, likes, comments count)
- Trending hashtags and sounds
- User profiles

The For You feed is pre-computed and cached, refreshing periodically as users engage.`,

    whyItMatters: 'At 350K views/sec, every database query costs money and latency. Cache hits are nearly free.',

    famousIncident: {
      title: 'TikTok Feed Algorithm Leak',
      company: 'TikTok',
      year: '2020',
      whatHappened: 'Internal documents revealed TikTok\'s recommendation algorithm considers watch time, completion rate, likes, shares, and comments. The algorithm pre-computes and caches feeds, refreshing as users engage.',
      lessonLearned: 'Personalized feeds require sophisticated caching strategies. Pre-compute when possible.',
      icon: '🎯',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: '10 billion video views per day',
      howTheyDoIt: 'Uses massive Redis clusters to cache personalized feeds, video metadata, and trending content. 99%+ cache hit rate for hot content.',
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
      'Pre-compute feeds for faster delivery',
      'Cache trending content aggressively',
      'Set TTL to balance freshness vs hit rate',
    ],

    quickCheck: {
      question: 'Why cache personalized feeds instead of computing them on-demand?',
      options: [
        'Caching uses less storage',
        'Computing feeds for millions of users in real-time would be too slow',
        'It\'s easier to implement',
        'Databases don\'t support feed queries',
      ],
      correctIndex: 1,
      explanation: 'Feed generation involves complex ML recommendations. Pre-computing and caching makes feeds load instantly.',
    },
  },

  practicePhase: {
    frText: 'FR-2: Watch For You feed (now fast!)',
    taskDescription: 'Add Redis cache between App Server and Database',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache feeds and video metadata for instant delivery', displayName: 'Redis Cache' },
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
    message: 'Feed loads 50x faster!',
    achievement: 'Caching dramatically improved performance',
    metrics: [
      { label: 'Feed latency', before: '5000ms', after: '100ms' },
      { label: 'Cache hit rate', after: '99%' },
    ],
    nextTeaser: "But one server can't handle millions of users scrolling...",
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
  id: 'tiktok-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: {
    emoji: '🔥',
    scenario: "A viral dance challenge just exploded! Your single server is at 100% CPU!",
    hook: "Traffic spiked 1000x in 30 minutes. Users are getting connection errors.",
    challenge: "Add a load balancer to distribute traffic across servers.",
    illustration: 'server-overload',
  },

  learnPhase: {
    conceptTitle: 'Load Balancing for Viral Traffic',
    conceptExplanation: `A **Load Balancer** distributes requests across multiple servers.

**Load Balancing Algorithms**:
- **Round Robin**: Take turns (simple, fair)
- **Least Connections**: Send to least busy server
- **IP Hash**: Same user → same server (session affinity)

**Layer 7 Load Balancing**:
- Route based on URL path
- Can send /upload to upload servers, /feed to feed servers
- Smart routing for different workloads

For TikTok, we'll use **L7 load balancing** to route uploads, feed requests, and engagement actions efficiently.`,

    whyItMatters: 'Viral challenges cause unpredictable traffic spikes. One server will always fail.',

    famousIncident: {
      title: 'TikTok Server Overload During Pandemic',
      company: 'TikTok',
      year: '2020',
      whatHappened: 'During COVID-19 lockdowns, TikTok usage spiked 3x globally. Their load balancing infrastructure and auto-scaling handled it, but some regions experienced brief slowdowns.',
      lessonLearned: 'Load balancers enable rapid scaling. Plan for unexpected global events.',
      icon: '🌍',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Handling 350K requests/sec at peak',
      howTheyDoIt: 'Uses sophisticated load balancing with multiple layers (DNS, L4, L7) to distribute traffic globally',
    },

    keyPoints: [
      'L7 load balancing routes by URL path',
      'Round Robin is simple and effective for stateless services',
      'Health checks detect and route around failures',
      'Enables adding/removing servers without downtime',
    ],

    quickCheck: {
      question: 'Why use L7 (Application) load balancing for TikTok?',
      options: [
        'L7 is faster than L4',
        'L7 can route based on URL paths (upload vs feed vs engagement)',
        'L7 is cheaper',
        'L4 doesn\'t support mobile apps',
      ],
      correctIndex: 1,
      explanation: 'L7 inspects HTTP content. You can route /upload to upload servers, /feed to recommendation servers, optimizing for different workloads.',
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
  id: 'tiktok-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: {
    emoji: '⚠️',
    scenario: "Your database crashed for 20 minutes. TikTok was completely down.",
    hook: "Users couldn't watch, upload, or engage. Millions of users impacted. Crisis!",
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
- Spread read load across replicas (critical for feed queries)
- Multiple copies = data safety

For TikTok:
- Primary handles video uploads, likes, comments (writes)
- Replicas handle feed queries and video metadata reads
- 2-3 replicas for redundancy`,

    whyItMatters: 'TikTok stores billions of videos. Downtime means creators can\'t reach their audience.',

    famousIncident: {
      title: 'Facebook Database Failure',
      company: 'Facebook',
      year: '2019',
      whatHappened: 'A database configuration change caused a cascading failure. Facebook, Instagram, and WhatsApp were down for 14 hours. Replication helped recover quickly, but the outage still cost $90M in revenue.',
      lessonLearned: 'Monitor replication lag closely. Test failover procedures regularly.',
      icon: '📘',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Zero tolerance for data loss',
      howTheyDoIt: 'Uses distributed databases with multi-region replication. Each video metadata record is stored on 3+ servers across data centers.',
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
  id: 'tiktok-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: {
    emoji: '📈',
    scenario: "You've grown to 150 million daily users! One app server is overwhelmed.",
    hook: "Even with caching and load balancing, a single server instance can't handle the scroll volume.",
    challenge: "Scale horizontally by adding more app server instances.",
    illustration: 'traffic-spike',
  },

  learnPhase: {
    conceptTitle: 'Horizontal Scaling for Global Users',
    conceptExplanation: `**Horizontal scaling** = adding more servers (scale out)
**Vertical scaling** = upgrading a single server (scale up)

Horizontal is better because:
- No upper limit (keep adding servers)
- Better fault tolerance (one fails, others continue)
- More cost-effective at scale
- Can scale different services independently

For TikTok, we'll run multiple app server instances:
- Feed servers handle For You Page requests
- Upload servers handle video ingestion
- Engagement servers handle likes, comments, shares
- All instances share cache and database`,

    whyItMatters: 'At 350K requests/sec, you need hundreds of servers working together.',

    famousIncident: {
      title: 'TikTok\'s Infrastructure Scaling',
      company: 'TikTok',
      year: '2018-2020',
      whatHappened: 'TikTok grew from 50M to 800M users in 2 years. The engineering team had to continuously scale infrastructure, eventually moving to microservices architecture with thousands of servers.',
      lessonLearned: 'Design for horizontal scaling from day 1. Viral growth requires rapid infrastructure expansion.',
      icon: '📊',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Handling global traffic 24/7',
      howTheyDoIt: 'Runs thousands of servers across data centers worldwide. Auto-scales based on traffic patterns and viral content spikes.',
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
  id: 'tiktok-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: {
    emoji: '📦',
    scenario: "You're storing 3 million videos per day. The database can't handle binary files!",
    hook: "Databases are designed for structured data, not 20MB video blobs.",
    challenge: "Add object storage (S3) for video files.",
    illustration: 'storage-full',
  },

  learnPhase: {
    conceptTitle: 'Object Storage for Short Videos',
    conceptExplanation: `**Object Storage** (like S3) is designed for large files:

- Stores binary objects (videos, thumbnails)
- Virtually unlimited capacity (petabytes)
- Pay only for what you use
- Built-in redundancy (99.999999999% durability)
- Supports versioning and lifecycle policies

Architecture:
- **Database**: Video metadata (caption, likes, hashtags)
- **Object Storage**: Actual video files (original + compressed)
- Video URL stored in database points to S3 object

For TikTok:
- Store original upload
- Store compressed version for playback
- Store thumbnail images`,

    whyItMatters: 'TikTok stores billions of short videos totaling petabytes. You can\'t put that in PostgreSQL.',

    famousIncident: {
      title: 'TikTok Storage Optimization',
      company: 'TikTok',
      year: '2019',
      whatHappened: 'TikTok implemented aggressive video compression to reduce storage costs. They reduced average video size from 15MB to 3-5MB without noticeable quality loss, saving millions in storage costs.',
      lessonLearned: 'Optimize storage early. Small improvements at scale save millions.',
      icon: '💾',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Storing petabytes of short videos',
      howTheyDoIt: 'Uses object storage with aggressive compression. Videos stored in multiple data centers for redundancy and faster access.',
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
       │ 3. Save metadata              │  - Compressed   │
       ▼                               │  - Thumbnail    │
┌──────────────┐                       └─────────────────┘
│   Database   │  (video_url: "s3://bucket/video123.mp4")
└──────────────┘
`,

    keyPoints: [
      'Object storage for video files, database for metadata',
      'Store video URL in database, actual file in S3',
      'Compress videos to save storage and bandwidth',
      'S3 handles replication and durability automatically',
    ],

    quickCheck: {
      question: 'Why compress videos before storing them?',
      options: [
        'To save storage costs and reduce CDN bandwidth',
        'Databases require compression',
        'It makes videos play faster',
        'It\'s required by law',
      ],
      correctIndex: 0,
      explanation: 'Compression reduces storage costs (storing billions of videos) and CDN bandwidth costs (serving billions of views). Critical at TikTok\'s scale.',
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
    nextTeaser: "But viewers far away experience slow loading...",
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
// STEP 9: CDN for Global Video Delivery
// =============================================================================

const step9: GuidedStep = {
  id: 'tiktok-step-9',
  stepNumber: 9,
  frIndex: 1,

  story: {
    emoji: '🌍',
    scenario: "Users in Europe and Asia are experiencing 5-second video load times!",
    hook: "Your servers are in US. Fetching videos from across the world kills the scrolling experience!",
    challenge: "Add CDN for global delivery and pre-loading for seamless scrolling.",
    illustration: 'global-latency',
  },

  learnPhase: {
    conceptTitle: 'CDN for Instant Video Playback',
    conceptExplanation: `**CDN (Content Delivery Network)** is CRITICAL for TikTok's addictive UX.

How it works:
1. Videos cached at edge locations worldwide
2. User scrolls to video → edge server starts streaming instantly
3. Edge location is < 50ms away vs 200ms+ to origin
4. Pre-load next 2-3 videos in background for seamless scrolling

TikTok's CDN Strategy:
- Aggressive edge caching of popular videos
- Pre-loading next videos while user watches current
- Smart pre-fetch based on user's scroll speed
- 95%+ of traffic served from edge, never hits origin

For instant playback:
- Video starts in < 500ms (p99)
- Pre-loading eliminates buffering between videos
- Adaptive quality based on network conditions`,

    whyItMatters: 'Without CDN and pre-loading, TikTok\'s infinite scroll would be impossible. Users scroll fast - any delay kills engagement.',

    famousIncident: {
      title: 'TikTok Pre-loading Innovation',
      company: 'TikTok',
      year: '2018',
      whatHappened: 'TikTok pioneered aggressive video pre-loading to create seamless scrolling. While competitors loaded videos on-demand, TikTok pre-loaded 2-3 videos ahead, making the experience feel instant and addictive.',
      lessonLearned: 'Intelligent pre-loading + CDN = magical user experience. Worth the extra bandwidth cost.',
      icon: '⚡',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Serving 10B videos daily globally',
      howTheyDoIt: 'Uses multi-tier CDN with edge locations in 150+ countries. Pre-loads next 2-3 videos while user watches. 99%+ cache hit rate for trending content.',
    },

    diagram: `
Scrolling Experience:
┌──────────┐    < 50ms     ┌──────────┐  ┌─────────────────┐
│   User   │◀─────────────▶│   CDN    │──│  Regional Edge  │
│ (Berlin) │   Streaming   │  Edge    │  │ (Germany)       │
└──────────┘               └──────────┘  └─────────────────┘
     │                          │
     │ Currently watching       │ Pre-loading:
     │ Video #1                 │ - Video #2 (ready)
     │                          │ - Video #3 (loading)
     │                          │ - Video #4 (queued)
     ▼
   Seamless scroll!
   No buffering!
`,

    keyPoints: [
      'CDN caches videos at edge locations globally',
      'Pre-load next 2-3 videos for seamless scrolling',
      'Instant playback (< 500ms) is critical for UX',
      'Trending videos heavily cached at all edges',
      'Edge delivery prevents origin overload',
    ],

    quickCheck: {
      question: 'Why is pre-loading videos critical for TikTok\'s UX?',
      options: [
        'It saves storage space',
        'It creates seamless infinite scroll - next video plays instantly',
        'It\'s cheaper than on-demand loading',
        'It reduces database queries',
      ],
      correctIndex: 1,
      explanation: 'TikTok users scroll fast. Pre-loading next videos means they start playing instantly when scrolled to, creating an addictive seamless experience.',
    },
  },

  practicePhase: {
    frText: 'FR-2: Watch For You feed with instant playback globally',
    taskDescription: 'Add CDN for global video delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Deliver videos from edge locations globally with pre-loading', displayName: 'CDN' },
    ],
    successCriteria: [
      'CDN component added',
      'CDN connected to Object Storage (origin)',
    ],
  },

  celebration: {
    emoji: '🚀',
    message: 'Videos play instantly everywhere!',
    achievement: 'CDN + pre-loading = magical UX',
    metrics: [
      { label: 'Europe video start', before: '5s', after: '400ms' },
      { label: 'Asia video start', before: '6s', after: '350ms' },
      { label: 'Pre-load success rate', after: '95%' },
      { label: 'Global edge locations', after: '150+' },
    ],
    nextTeaser: "Time to optimize costs...",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add CDN component',
    level2: 'Connect CDN → Object Storage (for playback delivery)',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [{ from: 'cdn', to: 'object_storage' }],
  },
};

// =============================================================================
// STEP 10: Cost Optimization
// =============================================================================

const step10: GuidedStep = {
  id: 'tiktok-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: {
    emoji: '💸',
    scenario: "Finance is shocked! Your cloud bill is $3M per month.",
    hook: "The CFO says: 'Cut costs 25% or we're in trouble.'",
    challenge: "Optimize your architecture to stay under budget while maintaining the addictive UX.",
    illustration: 'budget-crisis',
  },

  learnPhase: {
    conceptTitle: 'Cost Optimization for Short Video Platforms',
    conceptExplanation: `Short video platforms have unique cost challenges. Smart optimization is critical.

Cost optimization strategies:
1. **Aggressive compression** - Reduce video size 70% without quality loss
2. **CDN caching** - Reduce origin requests (bandwidth is expensive)
3. **Smart pre-loading** - Only pre-load for engaged users
4. **Tiered storage** - Move old/unpopular videos to cheaper storage
5. **Auto-scaling** - Scale down during low traffic (3-10 AM)
6. **Regional optimization** - Cache trending content at all edges

For TikTok:
- 90% of views are on trending/recent videos (cache aggressively)
- Compress videos to 3-5MB (vs 15-20MB original)
- Only pre-load 2-3 videos (balance UX vs cost)
- Archive old videos to cold storage`,

    whyItMatters: 'Video delivery and storage are the biggest costs. Optimization can save millions monthly.',

    famousIncident: {
      title: 'TikTok Compression Breakthrough',
      company: 'TikTok',
      year: '2019',
      whatHappened: 'TikTok\'s engineering team achieved 75% video compression without visible quality loss by optimizing encoding parameters for short vertical videos. This saved an estimated $50M+ per year in storage and bandwidth costs.',
      lessonLearned: 'Invest in compression and encoding optimization. At scale, small improvements save millions.',
      icon: '💰',
    },

    realWorldExample: {
      company: 'TikTok',
      scenario: 'Running at massive scale',
      howTheyDoIt: 'Heavily optimizes compression, uses tiered storage, leverages regional CDNs. Still costs billions yearly but maximizes efficiency.',
    },

    keyPoints: [
      'Aggressive video compression saves storage and bandwidth',
      'CDN caching reduces expensive origin bandwidth',
      'Smart pre-loading balances UX and cost',
      'Tiered storage: hot (trending), warm (recent), cold (archive)',
    ],

    quickCheck: {
      question: 'What\'s the most effective cost optimization for TikTok?',
      options: [
        'Delete old videos',
        'Reduce video quality significantly',
        'Aggressive compression + CDN caching to minimize bandwidth',
        'Reduce pre-loading',
      ],
      correctIndex: 2,
      explanation: 'Bandwidth is the biggest cost. Smart compression (3-5MB vs 15MB) + CDN caching (95%+ hit rate) can reduce costs by 70%+ while maintaining UX.',
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
    message: 'Congratulations! You built TikTok!',
    achievement: 'A scalable, cost-effective short video platform',
    metrics: [
      { label: 'Monthly cost', before: '$3M', after: 'Under budget' },
      { label: 'Video start time', after: '<500ms' },
      { label: 'Pre-load success', after: '95%' },
      { label: 'Daily video uploads', after: '3M+' },
      { label: 'Daily video views', after: '10B+' },
      { label: 'Global availability', after: '99.99%' },
    ],
    nextTeaser: "You've mastered TikTok system design!",
  },

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'database', 'cache', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'cdn', toType: 'object_storage' },
    ],
    requireDatabaseReplication: true,
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning',
    level2: 'Consider: compression settings, fewer replicas if acceptable, right-sized instances. Keep CDN caching aggressive.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT
// =============================================================================

export const tiktokGuidedTutorial: GuidedTutorial = {
  problemId: 'tiktok',
  title: 'Design TikTok',
  description: 'Build a short video platform with personalized feeds, instant playback, and viral content discovery',
  difficulty: 'advanced',
  estimatedMinutes: 60,

  welcomeStory: {
    emoji: '📱',
    hook: "You've been hired as Lead Engineer at ViralClips Inc!",
    scenario: "Your mission: Build a platform where users can share short videos and discover personalized content - like TikTok!",
    challenge: "Can you design a system that handles 10 billion video views per day with instant playback?",
  },

  requirementsPhase: tiktokRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Database Design',
    'Caching Strategies',
    'Load Balancing (L7)',
    'Database Replication',
    'Horizontal Scaling',
    'Object Storage',
    'CDN for Video Delivery',
    'Video Pre-loading',
    'Personalized Feeds',
    'Viral Content Handling',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 5: Replication',
    'Chapter 6: Partitioning',
    'Chapter 11: Stream Processing',
  ],
};

export default tiktokGuidedTutorial;
