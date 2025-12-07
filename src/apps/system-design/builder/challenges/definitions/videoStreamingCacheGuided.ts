import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Video Streaming Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 8-step tutorial teaching advanced caching strategies
 * for video streaming platforms.
 *
 * Key Concepts:
 * - Chunk-based caching for video streaming
 * - Adaptive bitrate streaming (HLS/DASH)
 * - Edge caching and CDN optimization
 * - Cache warming and preloading
 * - Byte-range requests
 * - Cache eviction policies for video
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const videoStreamingCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a caching strategy for a video streaming platform",

  interviewer: {
    name: 'Alex Rivera',
    role: 'Senior Infrastructure Engineer at StreamMax',
    avatar: '👨‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-features',
      category: 'functional',
      question: "What's the main goal of this caching system?",
      answer: "Users want to:\n\n1. **Instant playback** - Videos start within 1 second\n2. **Smooth streaming** - No buffering during playback\n3. **Adaptive quality** - Quality adjusts based on bandwidth\n4. **Global access** - Fast streaming anywhere in the world\n5. **Cost efficiency** - Minimize origin bandwidth costs",
      importance: 'critical',
      revealsRequirement: 'FR-1 through FR-5',
      learningPoint: "Video streaming caching is fundamentally different from web caching - it's about continuous data delivery",
    },
    {
      id: 'video-chunks',
      category: 'functional',
      question: "How are videos stored and delivered?",
      answer: "Videos are broken into small chunks (2-10 seconds each) using HLS or DASH protocol. Each chunk is a separate file. This enables:\n1. Adaptive bitrate switching\n2. Efficient caching (cache hot chunks, not entire videos)\n3. Fast startup (only load first few chunks)\n4. Resume support",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Chunk-based streaming is the foundation of modern video delivery",
    },
    {
      id: 'adaptive-bitrate',
      category: 'functional',
      question: "What is adaptive bitrate streaming?",
      answer: "Each video is encoded in multiple qualities (360p, 720p, 1080p, 4K). The player measures bandwidth and switches quality in real-time. Same video, different bitrates, all chunked separately.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Adaptive bitrate prevents buffering by matching quality to network speed",
    },
    {
      id: 'edge-caching',
      category: 'functional',
      question: "Why is edge caching critical for video?",
      answer: "Video requires sustained bandwidth (5-15 Mbps). Without edge caching:\n- Users far from origin experience buffering\n- Origin servers can't handle millions of concurrent streams\n- Bandwidth costs are prohibitive\nEdge caching serves videos from locations close to users (< 50ms latency).",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Edge caching is mandatory for video streaming - not optional",
    },
    {
      id: 'cache-warming',
      category: 'clarification',
      question: "Should we pre-load videos into cache?",
      answer: "Yes! For popular content (trending videos, new releases), we should pre-warm edge caches during off-peak hours. This ensures instant delivery when users request them.",
      importance: 'important',
      insight: "Cache warming prevents cold start problems for viral content",
    },
    {
      id: 'live-streaming',
      category: 'clarification',
      question: "Does this apply to live streaming?",
      answer: "Live streaming has different requirements (low latency, no pre-warming). Focus on video-on-demand (VOD) first. Live is a separate challenge.",
      importance: 'nice-to-have',
      insight: "Live streaming needs real-time protocols like WebRTC or low-latency HLS",
    },

    // SCALE & NFRs
    {
      id: 'throughput-streams',
      category: 'throughput',
      question: "How many concurrent streams should we support?",
      answer: "Target: 10 million concurrent viewers at peak hours (prime time evening)",
      importance: 'critical',
      learningPoint: "Video streaming has extreme bandwidth requirements",
    },
    {
      id: 'throughput-bandwidth',
      category: 'throughput',
      question: "What's the bandwidth requirement?",
      answer: "Each stream averages 8 Mbps (across all qualities). At 10M concurrent streams:\n10M × 8 Mbps = 80 Terabits/sec total bandwidth!",
      importance: 'critical',
      calculation: {
        formula: "10M streams × 8 Mbps = 80 Tbps",
        result: "Without CDN edge caching, this would be impossible",
      },
      learningPoint: "Edge caching reduces origin bandwidth by 95%+",
    },
    {
      id: 'cache-hit-rate',
      category: 'throughput',
      question: "What cache hit rate should we target?",
      answer: "Target 95%+ cache hit rate at edge. This means:\n- 95% of requests served from edge cache (fast, cheap)\n- 5% go to origin (slow, expensive)\n\nFor popular videos, aim for 99%+ hit rate.",
      importance: 'critical',
      learningPoint: "Every 1% improvement in hit rate saves massive bandwidth costs",
    },
    {
      id: 'video-catalog-size',
      category: 'payload',
      question: "How many videos and what's the storage requirement?",
      answer: "100,000 videos in catalog. Each video:\n- 4 quality levels (360p, 720p, 1080p, 4K)\n- ~100 chunks per quality level\n- ~2MB per chunk\nTotal: ~80TB of video chunks",
      importance: 'important',
      calculation: {
        formula: "100K videos × 4 qualities × 100 chunks × 2MB = 80TB",
        result: "Can't cache everything everywhere - need smart eviction",
      },
      learningPoint: "Selective caching based on popularity is essential",
    },
    {
      id: 'latency-startup',
      category: 'latency',
      question: "How fast should video playback start?",
      answer: "p99 under 1 second from click to first frame. This requires:\n- First chunk cached at edge (no origin roundtrip)\n- Manifest file cached\n- DNS resolution optimized",
      importance: 'critical',
      learningPoint: "Fast startup requires caching the video manifest and first few chunks",
    },
    {
      id: 'latency-buffering',
      category: 'latency',
      question: "What's acceptable for buffering?",
      answer: "After startup, no buffering events for users with stable connections. This requires:\n- Consistent chunk delivery from cache\n- Adaptive bitrate switching\n- Buffer ahead by 30-60 seconds",
      importance: 'critical',
      learningPoint: "Smooth playback requires predictable cache performance",
    },
    {
      id: 'viral-content',
      category: 'burst',
      question: "What happens when content goes viral?",
      answer: "A viral video might get 1M views in an hour (10x normal traffic). The cache must:\n- Handle sudden traffic spikes\n- Quickly replicate hot chunks to all edges\n- Not overwhelm origin with cache misses",
      importance: 'critical',
      insight: "Cache warming and rapid replication prevent viral video bottlenecks",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-features', 'video-chunks', 'adaptive-bitrate', 'edge-caching'],
  criticalFRQuestionIds: ['core-features', 'video-chunks', 'adaptive-bitrate'],
  criticalScaleQuestionIds: ['throughput-bandwidth', 'cache-hit-rate', 'latency-startup', 'viral-content'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Instant video playback',
      description: 'Videos start within 1 second using chunk caching',
      emoji: '⚡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Adaptive bitrate streaming',
      description: 'Quality adjusts based on bandwidth',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Global edge caching',
      description: 'Fast streaming from edge locations worldwide',
      emoji: '🌍',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Cache warming for popular content',
      description: 'Pre-load trending videos at edge',
      emoji: '🔥',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Cost-efficient delivery',
      description: 'Minimize origin bandwidth through caching',
      emoji: '💰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million concurrent viewers',
    writesPerDay: 'Minimal (new video uploads)',
    readsPerDay: '80 Tbps sustained bandwidth',
    peakMultiplier: 2,
    readWriteRatio: '10000:1',
    calculatedWriteRPS: { average: 10, peak: 20 },
    calculatedReadRPS: { average: 100000, peak: 200000 },
    maxPayloadSize: '~2MB (per chunk)',
    storagePerRecord: '~80GB per video (all chunks, all qualities)',
    storageGrowthPerYear: 'Depends on new content',
    redirectLatencySLA: 'p99 < 1s (video start)',
    createLatencySLA: 'p99 < 50ms (chunk delivery)',
  },

  architecturalImplications: [
    'Heavy CDN edge caching is absolutely mandatory',
    '95%+ cache hit rate required to handle 80 Tbps',
    'Chunk-based caching enables adaptive bitrate',
    'Cache warming essential for viral content',
    'Smart eviction policies needed (LRU + popularity)',
    'Multi-tier caching: edge, regional, origin',
  ],

  outOfScope: [
    'Live streaming (different latency requirements)',
    'Video transcoding pipeline',
    'DRM and content protection',
    'Video upload and encoding',
    'User authentication',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system with chunk-based caching at the edge. The complexity of adaptive bitrate, cache warming, and multi-tier caching comes in later steps. Functionality first!",
};

// =============================================================================
// STEP 1: Basic Client-Server with Video Chunks
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🎬',
  scenario: "Welcome to StreamMax! You're building a next-gen video streaming platform.",
  hook: "Your first user clicks play on a video. It needs to start instantly!",
  challenge: "Set up the basic infrastructure for chunk-based video delivery.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Video chunks can be delivered!',
  achievement: 'Basic streaming infrastructure online',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Chunk delivery', after: 'Working' },
  ],
  nextTeaser: "But every request hits the origin server - too slow!",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Chunk-Based Video Streaming',
  conceptExplanation: `Modern video streaming uses **chunks** (also called segments):

How it works:
1. Video is split into small chunks (2-10 seconds each)
2. Each chunk is a separate file (e.g., chunk_001.ts, chunk_002.ts)
3. A manifest file (playlist.m3u8) lists all chunks
4. Client downloads manifest, then fetches chunks sequentially

Why chunks?
- **Fast startup**: Only download first chunk to start playing
- **Adaptive bitrate**: Switch quality between chunks
- **Efficient caching**: Cache popular chunks, not entire videos
- **Resume support**: Start from any chunk

Protocols:
- **HLS** (HTTP Live Streaming) - Apple, widely supported
- **DASH** (Dynamic Adaptive Streaming) - Open standard`,

  whyItMatters: 'Chunk-based delivery is the foundation of Netflix, YouTube, and all modern streaming.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 200M subscribers',
    howTheyDoIt: 'Uses chunk-based streaming with 2-4 second chunks. Each video has 100-1000 chunks depending on length.',
  },

  keyPoints: [
    'Videos are split into small chunks (2-10 seconds)',
    'Manifest file lists all available chunks',
    'Client fetches chunks sequentially for smooth playback',
    'Enables adaptive bitrate and efficient caching',
  ],

  keyConcepts: [
    { title: 'Chunk', explanation: '2-10 second video segment', icon: '📦' },
    { title: 'Manifest', explanation: 'Playlist file listing chunks', icon: '📋' },
    { title: 'HLS/DASH', explanation: 'Streaming protocols', icon: '📡' },
  ],
};

const step1: GuidedStep = {
  id: 'video-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for chunk delivery',
    taskDescription: 'Add Client, App Server, and Object Storage for video chunks',
    componentsNeeded: [
      { type: 'client', reason: 'Video player requesting chunks', displayName: 'Client' },
      { type: 'app_server', reason: 'Serves manifest and coordinates chunk delivery', displayName: 'App Server' },
      { type: 'object_storage', reason: 'Stores all video chunks', displayName: 'S3 (Chunks)' },
    ],
    successCriteria: [
      'Client component added',
      'App Server component added',
      'Object Storage component added',
      'Client → App Server → Object Storage connected',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag Client, App Server, and Object Storage onto the canvas',
    level2: 'Connect: Client → App Server → Object Storage',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'object_storage' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Chunk Delivery APIs
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "The infrastructure is ready, but the server doesn't know how to serve chunks!",
  hook: "Users are getting 404 errors when requesting video chunks.",
  challenge: "Write the Python handlers for manifest and chunk delivery.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Chunk delivery is working!',
  achievement: 'Videos can stream (but slowly...)',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Manifest delivery', after: 'Working' },
    { label: 'Chunk delivery', after: 'Working' },
  ],
  nextTeaser: "But latency is terrible - every chunk request hits origin!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Manifest and Chunk Delivery APIs',
  conceptExplanation: `Two critical APIs for chunk-based streaming:

**1. Manifest API** (GET /video/{id}/manifest.m3u8)
- Returns the playlist file
- Lists all available chunks and their URLs
- Includes metadata (duration, bitrates available)

**2. Chunk API** (GET /video/{id}/chunk_{n}.ts)
- Returns individual video chunk
- Uses byte-range requests for efficiency
- Returns chunk from object storage

Flow:
1. Client requests manifest → App Server → S3
2. Client parses manifest, gets chunk URLs
3. Client requests chunks sequentially
4. Client assembles chunks into continuous video

Byte-Range Requests:
- HTTP header: Range: bytes=0-2097151
- Allows partial chunk downloads
- Enables seek/resume support`,

  whyItMatters: 'These APIs are the foundation of video streaming - manifest for discovery, chunks for delivery.',

  famousIncident: {
    title: 'Netflix Encoding Evolution',
    company: 'Netflix',
    year: '2016',
    whatHappened: 'Netflix moved to per-title encoding optimization, creating custom chunk sizes based on video complexity. Some videos use 2-second chunks (action), others 6 seconds (static scenes).',
    lessonLearned: 'One size doesn\'t fit all. Optimize chunk size per video for quality and efficiency.',
    icon: '🎞️',
  },

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Serving billions of video chunks daily',
    howTheyDoIt: 'Uses DASH protocol with 2-second chunks. Manifest includes 10+ quality levels. Chunks cached at edge for instant delivery.',
  },

  keyPoints: [
    'Manifest API returns playlist with chunk URLs',
    'Chunk API delivers individual video segments',
    'Byte-range requests enable partial downloads',
    'Both APIs must be fast and cacheable',
  ],

  quickCheck: {
    question: 'Why serve chunks instead of the entire video file?',
    options: [
      'Chunks are easier to encode',
      'Enables fast startup and adaptive bitrate switching',
      'Reduces storage costs',
      'Required by all video players',
    ],
    correctIndex: 1,
    explanation: 'Chunks enable instant startup (just first chunk) and quality switching (between chunks). Full files would delay startup massively.',
  },

  keyConcepts: [
    { title: 'Manifest', explanation: 'Playlist of all chunks', icon: '📋' },
    { title: 'Byte-Range', explanation: 'Partial file downloads', icon: '📏' },
    { title: 'Sequential Delivery', explanation: 'Chunks fetched in order', icon: '▶️' },
  ],
};

const step2: GuidedStep = {
  id: 'video-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Enable chunk-based video playback',
    taskDescription: 'Configure manifest and chunk APIs, implement Python handlers',
    successCriteria: [
      'Click App Server to open inspector',
      'Assign GET /video/{id}/manifest and GET /video/{id}/chunk APIs',
      'Open Python tab',
      'Implement get_manifest() and get_chunk() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click App Server → APIs tab → Assign manifest and chunk endpoints',
    level2: 'Switch to Python tab. Implement get_manifest() and get_chunk() to fetch from S3.',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/video/{id}/manifest', 'GET /api/v1/video/{id}/chunk'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Edge Cache (CDN)
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🌍',
  scenario: "Users in Asia are experiencing 5-second load times for each chunk!",
  hook: "Every chunk request travels to your US origin server. That's 300ms+ latency per chunk. Buffering hell!",
  challenge: "Add edge caching so chunks are served from locations near users.",
  illustration: 'global-latency',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Chunks now served from the edge!',
  achievement: 'Global streaming performance massively improved',
  metrics: [
    { label: 'Tokyo latency', before: '5000ms', after: '50ms' },
    { label: 'Cache hit rate', after: '85%' },
    { label: 'Origin load', before: '100%', after: '15%' },
  ],
  nextTeaser: "But cold starts are still slow - first request always misses cache...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Edge Caching for Video Chunks',
  conceptExplanation: `**Edge Caching** is mandatory for video streaming. Here's why:

Problem without edge caching:
- User in Tokyo requests chunk → 300ms to US origin
- Each video has 100+ chunks
- Total latency: 30+ seconds just in network roundtrips
- Result: Constant buffering, unusable experience

Solution: CDN Edge Caching
- First request: Edge fetches from origin, caches it (MISS)
- Subsequent requests: Served from edge cache (HIT)
- Latency: 300ms → 50ms (6x faster!)
- Origin load: Reduced by 95%+

**Cache-Control Headers**:
\`\`\`
Cache-Control: public, max-age=31536000, immutable
\`\`\`
- Chunks never change → cache forever
- Immutable = browser doesn't revalidate
- max-age = 1 year

**Cache Keys**:
- video_id + chunk_number + quality
- Example: \`video_123/1080p/chunk_042.ts\``,

  whyItMatters: 'Without edge caching, video streaming at global scale is literally impossible. 80 Tbps can only be served from distributed edges.',

  famousIncident: {
    title: 'Netflix Open Connect Launch',
    company: 'Netflix',
    year: '2012',
    whatHappened: 'Before building their own CDN (Open Connect), Netflix relied on third-party CDNs with inconsistent quality. In 2012, they deployed servers directly in ISP data centers. Buffering dropped 90% overnight.',
    lessonLearned: 'For video streaming, CDN isn\'t just optimization - it\'s the entire architecture.',
    icon: '📡',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 200M subscribers globally',
    howTheyDoIt: 'Open Connect has 17,000+ edge servers in 1,000+ locations. 95% of traffic served from within ISP networks.',
  },

  diagram: `
User in Tokyo watching video:

┌──────────┐    50ms     ┌───────────┐
│   User   │◀───────────▶│ CDN Edge  │  Cache HIT (95%)
│ (Tokyo)  │             │  (Tokyo)  │
└──────────┘             └─────┬─────┘
                               │
                         300ms │ Cache MISS (5%)
                               │
                         ┌─────▼─────┐
                         │  Origin   │
                         │   (US)    │
                         │    S3     │
                         └───────────┘
`,

  keyPoints: [
    'CDN edge caching serves chunks from locations near users',
    'First request (MISS) fetches from origin and caches',
    'Subsequent requests (HIT) served instantly from edge',
    'Cache chunks forever (they never change)',
    'Reduces origin bandwidth by 95%+',
  ],

  quickCheck: {
    question: 'Why cache video chunks at edge instead of just at origin?',
    options: [
      'Edge caching is cheaper',
      'Reduces latency from 300ms to 50ms - prevents buffering',
      'Origin servers can\'t store that much data',
      'It\'s a CDN industry standard',
    ],
    correctIndex: 1,
    explanation: 'Video requires sustained low latency. 300ms roundtrips cause buffering. Edge caching (50ms) enables smooth playback.',
  },

  keyConcepts: [
    { title: 'Edge Cache', explanation: 'CDN servers near users', icon: '🌍' },
    { title: 'Cache HIT', explanation: 'Chunk found in edge cache', icon: '✅' },
    { title: 'Cache MISS', explanation: 'Fetch from origin, cache it', icon: '❌' },
  ],
};

const step3: GuidedStep = {
  id: 'video-cache-step-3',
  stepNumber: 3,
  frIndex: 2,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-3: Global edge caching for low latency',
    taskDescription: 'Add CDN for edge caching of video chunks',
    componentsNeeded: [
      { type: 'cdn', reason: 'Cache chunks at edge locations worldwide', displayName: 'CDN (Edge)' },
    ],
    successCriteria: [
      'CDN component added',
      'Client connected to CDN (for chunk requests)',
      'CDN connected to App Server (origin)',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Add a CDN component between Client and App Server',
    level2: 'Connect: Client → CDN → App Server. CDN caches chunks at edge.',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'client', to: 'cdn' },
      { from: 'cdn', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 4: Implement Adaptive Bitrate with Multiple Quality Caches
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📶',
  scenario: "Users on mobile networks are experiencing constant buffering!",
  hook: "Everyone gets the same 1080p video, even on slow connections. We need adaptive bitrate!",
  challenge: "Implement multi-quality caching so users can switch between qualities.",
  illustration: 'buffering',
};

const step4Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Adaptive bitrate streaming enabled!',
  achievement: 'Quality automatically adjusts to bandwidth',
  metrics: [
    { label: 'Quality levels cached', after: '4 (360p-4K)' },
    { label: 'Buffering events', before: 'Frequent', after: 'Rare' },
    { label: 'User experience', after: 'Smooth' },
  ],
  nextTeaser: "But cold starts still cause cache misses for new content...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Adaptive Bitrate Streaming and Multi-Quality Caching',
  conceptExplanation: `**Adaptive Bitrate Streaming (ABR)** adjusts video quality based on network speed.

How it works:
1. Same video encoded in multiple qualities:
   - 360p (0.5 Mbps) - for 3G/slow connections
   - 720p (2.5 Mbps) - for WiFi/4G
   - 1080p (5 Mbps) - for fast connections
   - 4K (15 Mbps) - for fiber/5G

2. Each quality level has its own chunks:
   - video_123/360p/chunk_001.ts
   - video_123/720p/chunk_001.ts
   - video_123/1080p/chunk_001.ts
   - video_123/4k/chunk_001.ts

3. Player measures bandwidth every few chunks
4. Switches to appropriate quality between chunks

**Caching Strategy for ABR**:
- Cache ALL quality levels at edge (not just one)
- Most popular: 720p and 1080p (cache hot)
- Less popular: 360p and 4K (cache on demand)
- Cache key includes quality: \`video_id/quality/chunk_id\`

**Manifest File for ABR**:
\`\`\`m3u8
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=500000
360p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000
1080p/playlist.m3u8
\`\`\``,

  whyItMatters: 'ABR prevents buffering by matching quality to network speed. Without it, users on slow connections can\'t watch.',

  famousIncident: {
    title: 'Netflix Per-Title Encoding',
    company: 'Netflix',
    year: '2015',
    whatHappened: 'Netflix discovered that encoding all content at the same bitrate was wasteful. Action movies need higher bitrates than animations. They developed per-title encoding, optimizing each video individually. Saved 40% bandwidth while improving quality.',
    lessonLearned: 'One-size-fits-all doesn\'t work for video. Optimize per content type.',
    icon: '🎬',
  },

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Supporting devices from smartphones to 8K TVs',
    howTheyDoIt: 'Encodes videos in 10+ quality levels. Caches all levels at edge. Player switches seamlessly based on bandwidth.',
  },

  diagram: `
Bandwidth Detection:

┌─────────────────┐
│  Video Player   │
│                 │
│ Measures: 8Mbps │ ─────▶ Request 1080p chunks
│                 │
│ Drops to: 2Mbps │ ─────▶ Switch to 720p chunks
│                 │
│ Improves: 6Mbps │ ─────▶ Back to 1080p chunks
└─────────────────┘

All chunks cached at edge with quality in cache key:
- video_123/1080p/chunk_042.ts ✓ Cached
- video_123/720p/chunk_043.ts  ✓ Cached
`,

  keyPoints: [
    'Each video has 4+ quality levels (360p to 4K)',
    'Each quality has separate chunks',
    'Player measures bandwidth and switches quality',
    'Cache all quality levels at edge',
    'Quality included in cache key',
  ],

  quickCheck: {
    question: 'Why switch quality between chunks instead of mid-chunk?',
    options: [
      'Mid-chunk switching is impossible',
      'Chunks are encoded independently - clean switch points',
      'It\'s easier to implement',
      'Reduces cache storage',
    ],
    correctIndex: 1,
    explanation: 'Each chunk is independently decodable. Switching between chunks ensures seamless transition without artifacts.',
  },

  keyConcepts: [
    { title: 'ABR', explanation: 'Adaptive bitrate streaming', icon: '📊' },
    { title: 'Multi-Quality', explanation: 'Same video, different bitrates', icon: '🎚️' },
    { title: 'Quality Switch', explanation: 'Change quality between chunks', icon: '🔄' },
  ],
};

const step4: GuidedStep = {
  id: 'video-cache-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Adaptive bitrate streaming with multi-quality caching',
    taskDescription: 'Configure CDN to cache multiple quality levels',
    successCriteria: [
      'Click CDN component',
      'Configure cache keys to include quality level',
      'Set cache TTL to max (chunks never change)',
      'Enable cache for all quality variants',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'cdn'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click CDN → Configuration → Set cache strategy and TTL',
    level2: 'Configure cache to store chunks with quality level in key. Set max TTL (chunks are immutable).',
    solutionComponents: [
      { type: 'cdn', config: { cacheStrategy: 'immutable', ttl: 31536000 } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Cache Warming for Popular Content
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "A new blockbuster just released at midnight!",
  hook: "Millions are trying to watch simultaneously. Cache misses are overwhelming the origin. The first viewers experience buffering!",
  challenge: "Implement cache warming to pre-load popular content at edge.",
  illustration: 'viral-content',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Cache warming prevents cold starts!',
  achievement: 'Popular content instantly available at all edges',
  metrics: [
    { label: 'Cache hit rate for new releases', before: '20%', after: '99%' },
    { label: 'Origin traffic on launch', before: 'Overload', after: 'Minimal' },
    { label: 'User experience', after: 'Perfect' },
  ],
  nextTeaser: "But we're caching everything - storage costs are exploding!",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Warming and Pre-Positioning',
  conceptExplanation: `**Cache Warming** pre-loads content into edge caches before users request it.

Why cache warming?
- New popular content gets millions of requests instantly
- First requests (MISS) overwhelm origin
- Users experience buffering during cold start
- Solution: Pre-warm cache during off-peak hours

**Cache Warming Strategies**:

1. **Predictive Warming** (for scheduled releases):
   - New movie releases at midnight
   - Push chunks to all edges at 10 PM
   - Users see instant playback at launch

2. **Viral Content Replication**:
   - Detect sudden traffic spike
   - Rapidly replicate hot chunks to all edges
   - Prevent origin overload

3. **Geographic Warming**:
   - Popular in US → warm US edges
   - Goes viral in Asia → warm Asia edges
   - Follow the sun pattern

**Implementation**:
- Use message queue for warming jobs
- Background workers push chunks to edge
- Warm during off-peak (lowest bandwidth costs)

**What to warm**:
- First 30 seconds (first 10-15 chunks) - critical for startup
- All chunks for top 100 trending videos
- Regional popular content at regional edges`,

  whyItMatters: 'Cache warming is the difference between smooth launches and catastrophic failures. Netflix pre-warms all new releases.',

  famousIncident: {
    title: 'Netflix House of Cards Season 2 Launch',
    company: 'Netflix',
    year: '2014',
    whatHappened: 'Netflix released all episodes at midnight. Traffic spiked 10x instantly. Thanks to aggressive cache warming (pre-positioned chunks at all Open Connect servers), the launch was flawless. Zero buffering reported.',
    lessonLearned: 'Cache warming for predictable spikes prevents disasters.',
    icon: '🏠',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'New season launches',
    howTheyDoIt: 'Pre-positions content on Open Connect servers days before launch. Fills edge caches during off-peak hours when bandwidth is cheap.',
  },

  diagram: `
Cache Warming Flow:

1. Content Upload:
┌──────────────┐
│ New Movie    │
│  Uploaded    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     Warming Job      ┌───────────────┐
│ App Server   │ ──────────────────▶  │ Message Queue │
└──────────────┘                      └───────┬───────┘
                                              │
                                     Workers consume
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
              ┌──────────┐              ┌──────────┐              ┌──────────┐
              │CDN Edge  │              │CDN Edge  │              │CDN Edge  │
              │  (US)    │              │ (Europe) │              │  (Asia)  │
              └──────────┘              └──────────┘              └──────────┘

All chunks pre-cached before users request them!
`,

  keyPoints: [
    'Cache warming pre-loads content before user requests',
    'Essential for scheduled releases (new movies, shows)',
    'Prevents origin overload during traffic spikes',
    'Warm during off-peak hours (cheaper bandwidth)',
    'Focus on first chunks (critical for startup)',
  ],

  quickCheck: {
    question: 'When should cache warming happen?',
    options: [
      'Immediately when content is uploaded',
      'During off-peak hours before expected demand',
      'Only after first user requests',
      'Cache warming is automatic',
    ],
    correctIndex: 1,
    explanation: 'Warm during off-peak (3-10 AM) when bandwidth is cheap and won\'t impact live traffic. Ready before peak demand.',
  },

  keyConcepts: [
    { title: 'Cache Warming', explanation: 'Pre-load content into cache', icon: '🔥' },
    { title: 'Predictive Warming', explanation: 'Warm before scheduled releases', icon: '🔮' },
    { title: 'Off-Peak', explanation: 'Warm during low-traffic hours', icon: '🌙' },
  ],
};

const step5: GuidedStep = {
  id: 'video-cache-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Cache warming for trending content',
    taskDescription: 'Add Message Queue for cache warming jobs',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Coordinate cache warming across edges', displayName: 'Message Queue' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
      'Configure warming strategy for popular content',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Message Queue for coordinating cache warming jobs',
    level2: 'Connect App Server to Message Queue. Workers will consume warming jobs.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Implement Smart Cache Eviction
// =============================================================================

const step6Story: StoryContent = {
  emoji: '💾',
  scenario: "Edge cache storage is full! Costs are out of control.",
  hook: "You can't cache all 80TB at every edge location. That would cost millions per month!",
  challenge: "Implement smart cache eviction to keep only hot content.",
  illustration: 'storage-full',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Smart eviction optimized cache efficiency!',
  achievement: 'Keeping hot content, evicting cold',
  metrics: [
    { label: 'Cache hit rate', before: '85%', after: '95%' },
    { label: 'Storage costs', before: 'High', after: '50% reduction' },
    { label: 'Edge cache size', before: '80TB', after: '8TB' },
  ],
  nextTeaser: "But we need metadata to track what's hot...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Eviction Policies for Video Streaming',
  conceptExplanation: `You can't cache everything everywhere. Smart **eviction policies** decide what to keep.

**Cache Eviction Strategies**:

1. **LRU (Least Recently Used)**:
   - Evict chunks not accessed recently
   - Simple and effective
   - Problem: Doesn't consider popularity

2. **LFU (Least Frequently Used)**:
   - Evict chunks accessed least often
   - Better for video (popular videos stay cached)
   - Problem: Slow to adapt to new trends

3. **Hybrid: LRU + Popularity**:
   - Track both recency AND frequency
   - Weight by video popularity score
   - Best for video streaming

**Video-Specific Considerations**:

- **Sequential Access**: If chunk_042 is hot, chunk_043 likely is too
- **Quality Tiers**: Keep 720p/1080p hot, evict 360p/4K cold
- **First Chunks Priority**: Always keep first 10-15 chunks (startup critical)
- **TTL-based**: Livestream chunks evict after event (never accessed again)

**80/20 Rule**:
- 20% of content generates 80% of views
- Cache that 20% everywhere
- Cache long tail on-demand at regional edges

**Implementation**:
- Popularity score = views_24h × 0.5 + views_7d × 0.3 + views_30d × 0.2
- Evict chunks with lowest score when storage fills
- Re-warm if popularity spikes`,

  whyItMatters: 'Smart eviction maintains high hit rates while minimizing storage costs. Critical at global scale.',

  famousIncident: {
    title: 'YouTube Storage Optimization',
    company: 'YouTube',
    year: '2018',
    whatHappened: 'YouTube discovered that 90% of views were on videos < 30 days old. They implemented tiered caching: hot content (< 30 days) cached everywhere, warm content (30-365 days) cached regionally, cold content (> 1 year) origin-only. Saved millions in storage costs.',
    lessonLearned: 'Most content goes cold quickly. Cache hot content everywhere, cold content nowhere.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Managing petabytes of cached content',
    howTheyDoIt: 'Uses popularity-based eviction. New releases cached everywhere. Old content evicted. Re-warms if a show becomes popular again (e.g., trending on social media).',
  },

  diagram: `
Cache Eviction Decision Flow:

┌─────────────────┐
│ Edge Cache Full │
│   (100% used)   │
└────────┬────────┘
         │
         ▼
   ┌─────────────────────────┐
   │ Calculate Popularity    │
   │ Score for All Chunks    │
   │                         │
   │ Score = 0.5×views_24h + │
   │         0.3×views_7d +  │
   │         0.2×views_30d   │
   └─────────┬───────────────┘
             │
             ▼
   ┌─────────────────────────┐
   │ Sort by Score           │
   │                         │
   │ High ▲ Keep in cache    │
   │      │                  │
   │ Low  ▼ Evict            │
   └─────────┬───────────────┘
             │
             ▼
   ┌─────────────────────────┐
   │ Evict Lowest 10%        │
   │ Free up space           │
   └─────────────────────────┘

Exception: Always keep first 10 chunks of all videos (startup critical)
`,

  keyPoints: [
    'Can\'t cache everything - storage costs too high',
    'LRU + popularity hybrid works best for video',
    ' 80/20 rule: cache hot content everywhere',
    'Always keep first chunks (startup critical)',
    'Re-warm if cold content becomes hot',
  ],

  quickCheck: {
    question: 'Why use popularity-based eviction instead of pure LRU for video?',
    options: [
      'LRU is too complex to implement',
      'Video access patterns are sequential - popular videos get many accesses',
      'Popularity-based is faster',
      'Netflix requires it',
    ],
    correctIndex: 1,
    explanation: 'Popular videos get accessed many times (binge-watching). LRU would keep recently accessed unpopular videos over older popular ones.',
  },

  keyConcepts: [
    { title: 'LRU', explanation: 'Least Recently Used eviction', icon: '🕒' },
    { title: 'Popularity Score', explanation: 'Views-based ranking', icon: '⭐' },
    { title: '80/20 Rule', explanation: '20% of content = 80% of views', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'video-cache-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Cost-efficient caching with smart eviction',
    taskDescription: 'Configure CDN cache eviction policy',
    successCriteria: [
      'Click CDN component',
      'Set eviction policy to popularity-based',
      'Configure cache size limits',
      'Enable first-chunk priority',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'cdn', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Click CDN → Configuration → Set eviction policy',
    level2: 'Configure popularity-based eviction with size limits. Prioritize first chunks.',
    solutionComponents: [
      { type: 'cdn', config: { evictionPolicy: 'popularity', prioritizeFirstChunks: true } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Add Database for Popularity Tracking
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📊',
  scenario: "How do we know which content is popular?",
  hook: "Smart eviction needs popularity data, but we have nowhere to store it!",
  challenge: "Add a database to track view counts and popularity metrics.",
  illustration: 'data-tracking',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Popularity tracking enabled!',
  achievement: 'Data-driven cache decisions',
  metrics: [
    { label: 'Tracking metrics', after: 'Views, popularity scores' },
    { label: 'Cache efficiency', after: 'Optimized' },
    { label: 'Eviction accuracy', after: '95%' },
  ],
  nextTeaser: "But database queries are slowing down eviction decisions...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Popularity Tracking and Metrics Database',
  conceptExplanation: `To make smart cache decisions, we need to track **popularity metrics**.

**What to Track**:

1. **View Counts**:
   - Total views (lifetime)
   - Views last 24 hours
   - Views last 7 days
   - Views last 30 days

2. **Per-Chunk Metrics**:
   - Which chunks get accessed most
   - Completion rates (do users finish?)
   - Quality distribution (which resolutions popular?)

3. **Geographic Data**:
   - Popular in US but not Asia?
   - Cache at US edges, evict from Asia edges

**Database Schema**:
\`\`\`sql
videos:
  - video_id
  - title
  - total_views
  - views_24h
  - views_7d
  - views_30d
  - popularity_score (calculated)

chunks:
  - chunk_id (video_id + quality + chunk_num)
  - access_count_24h
  - last_accessed_at
  - cache_status (cached_edges[])
\`\`\`

**Popularity Score Calculation**:
\`\`\`
score = 0.5 × views_24h +
        0.3 × views_7d +
        0.2 × views_30d
\`\`\`

**Update Strategy**:
- Increment view counts asynchronously (don't block playback)
- Batch updates every 5 minutes
- Calculate popularity scores hourly`,

  whyItMatters: 'Data-driven decisions prevent wasting cache space on unpopular content while ensuring hot content is always cached.',

  realWorldExample: {
    company: 'YouTube',
    scenario: 'Tracking billions of views',
    howTheyDoIt: 'Uses distributed counters (eventually consistent). View counts updated asynchronously. Popularity calculated in batch jobs.',
  },

  keyPoints: [
    'Track view counts at multiple time windows (24h, 7d, 30d)',
    'Calculate popularity scores from view data',
    'Update asynchronously (don\'t block playback)',
    'Use for cache eviction decisions',
  ],

  quickCheck: {
    question: 'Why track views at multiple time windows (24h, 7d, 30d)?',
    options: [
      'To store more data',
      'Recent views matter more than old views for cache decisions',
      'Required by regulations',
      'Makes queries faster',
    ],
    correctIndex: 1,
    explanation: 'Trending content (high 24h views) should be cached even if lifetime views are low. Multi-window tracking captures trends.',
  },

  keyConcepts: [
    { title: 'View Count', explanation: 'Number of times accessed', icon: '👁️' },
    { title: 'Popularity Score', explanation: 'Weighted view metric', icon: '⭐' },
    { title: 'Time Windows', explanation: '24h, 7d, 30d tracking', icon: '⏱️' },
  ],
};

const step7: GuidedStep = {
  id: 'video-cache-step-7',
  stepNumber: 7,
  frIndex: 4,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'FR-5: Data-driven cache optimization',
    taskDescription: 'Add Database for popularity tracking',
    componentsNeeded: [
      { type: 'database', reason: 'Store view counts and popularity metrics', displayName: 'Database' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
      'Configure for popularity tracking',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'cdn', 'message_queue', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Database component for tracking popularity metrics',
    level2: 'Connect App Server to Database for storing view counts and scores',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 8: Add Cache for Popularity Metrics
// =============================================================================

const step8Story: StoryContent = {
  emoji: '⚡',
  scenario: "Cache eviction is querying the database thousands of times per second!",
  hook: "Database can't keep up with constant popularity lookups. Eviction decisions are delayed!",
  challenge: "Add a cache layer for popularity metrics to speed up decisions.",
  illustration: 'performance',
};

const step8Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built an optimized video streaming cache!',
  achievement: 'Multi-tier caching with data-driven optimization',
  metrics: [
    { label: 'Cache hit rate', after: '95%+' },
    { label: 'Video startup time', after: '<1s' },
    { label: 'Origin bandwidth', after: '5% of total' },
    { label: 'Storage costs', after: 'Optimized' },
    { label: 'Global latency', after: '<50ms' },
  ],
  nextTeaser: "You've mastered video streaming cache design!",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Multi-Tier Caching Architecture',
  conceptExplanation: `The final piece: **cache the cache metadata!**

**Three-Tier Caching**:

1. **Edge Cache (CDN)**:
   - Caches video chunks
   - Serves user requests
   - 95%+ hit rate

2. **Metadata Cache (Redis)**:
   - Caches popularity scores
   - Used for eviction decisions
   - TTL: 5 minutes
   - Prevents database overload

3. **Database**:
   - Source of truth for metrics
   - Updated asynchronously
   - Queried only on cache miss

**Complete Flow**:

1. User watches video → increment view counter (async)
2. Every 5 min: Batch update database
3. Every hour: Calculate popularity scores
4. Scores cached in Redis (5 min TTL)
5. Eviction decisions read from Redis (fast!)
6. Redis miss → query database → cache result

**Performance**:
- Edge cache: < 50ms chunk delivery
- Redis cache: < 5ms popularity lookup
- Database: < 100ms (rarely hit)

This architecture handles 10M+ concurrent streams with 95%+ cache hit rates while keeping costs low through smart eviction.`,

  whyItMatters: 'Multi-tier caching is essential for video streaming at scale. Each tier optimizes for different access patterns.',

  famousIncident: {
    title: 'Netflix Caching Evolution',
    company: 'Netflix',
    year: '2016',
    whatHappened: 'Netflix evolved from simple CDN caching to a sophisticated multi-tier system. Open Connect (edge), EVCache (metadata), Cassandra (storage). This architecture enabled 200M subscribers globally.',
    lessonLearned: 'Video streaming requires multiple caching layers - chunks, metadata, and popularity data each need different strategies.',
    icon: '🎬',
  },

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving 200M subscribers',
    howTheyDoIt: 'Open Connect (edge caching), EVCache (metadata caching), Cassandra (data storage). Three-tier architecture handles petabytes of traffic.',
  },

  diagram: `
Complete Multi-Tier Architecture:

                 ┌──────────┐
                 │  Client  │
                 └─────┬────┘
                       │
                  50ms │
                       ▼
              ┌────────────────┐
              │   CDN Edge     │ ◀─── Tier 1: Video Chunks
              │ (Video Chunks) │      95% Hit Rate
              └───────┬────────┘      < 50ms latency
                      │
                 5%   │ Miss
                      ▼
              ┌────────────────┐
              │  App Server    │
              └───┬────────┬───┘
                  │        │
        ┌─────────┘        └─────────┐
        │                            │
   5ms  ▼                       100ms▼
┌───────────────┐           ┌──────────────┐
│ Redis Cache   │           │  Database    │
│ (Popularity)  │ ◀───────▶ │ (Metrics)    │
└───────────────┘   Sync    └──────────────┘
                    Every 5min

Tier 1 (Edge): Video chunks
Tier 2 (Redis): Popularity metadata
Tier 3 (Database): Source of truth
`,

  keyPoints: [
    'Three-tier caching: Edge (chunks), Redis (metadata), Database (source)',
    'Each tier optimized for different access patterns',
    'Redis caches popularity scores for fast eviction decisions',
    'Database updated asynchronously in batches',
    'Complete architecture handles 10M+ concurrent streams',
  ],

  quickCheck: {
    question: 'Why cache popularity metrics in Redis instead of querying database?',
    options: [
      'Redis is cheaper than database',
      'Database can\'t handle thousands of eviction queries per second',
      'Redis has more features',
      'It\'s industry standard',
    ],
    correctIndex: 1,
    explanation: 'Eviction decisions happen constantly at CDN edges. Database would be overwhelmed. Redis caching provides sub-5ms lookups.',
  },

  keyConcepts: [
    { title: 'Multi-Tier', explanation: 'Multiple cache layers', icon: '🎚️' },
    { title: 'Edge Cache', explanation: 'Video chunks at CDN', icon: '🌍' },
    { title: 'Metadata Cache', explanation: 'Popularity in Redis', icon: '⚡' },
  ],
};

const step8: GuidedStep = {
  id: 'video-cache-step-8',
  stepNumber: 8,
  frIndex: 4,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'Complete: Multi-tier caching architecture',
    taskDescription: 'Add Redis cache for popularity metadata',
    componentsNeeded: [
      { type: 'cache', reason: 'Cache popularity scores for fast lookups', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added',
      'App Server connected to Cache',
      'Configure for metadata caching',
      'Set appropriate TTL',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'object_storage', 'cdn', 'message_queue', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Add Redis Cache for popularity metadata',
    level2: 'Connect App Server to Cache. Set TTL to 300 seconds (5 min) for popularity scores.',
    solutionComponents: [{ type: 'cache', config: { ttl: 300, strategy: 'cache-aside' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const videoStreamingCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'video-streaming-cache',
  title: 'Design Video Streaming Cache',
  description: 'Build an advanced caching system for video streaming with chunk caching, adaptive bitrate, and edge optimization',
  difficulty: 'advanced',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🎬',
    hook: "You've been hired as Caching Architect at StreamMax!",
    scenario: "Your mission: Build a caching system that delivers smooth video streaming to 10 million concurrent viewers globally.",
    challenge: "Can you design a cache architecture that achieves 95%+ hit rates while handling 80 Terabits per second?",
  },

  requirementsPhase: videoStreamingCacheRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8],

  concepts: [
    'Chunk-Based Video Streaming',
    'HLS/DASH Protocols',
    'Edge Caching (CDN)',
    'Adaptive Bitrate Streaming',
    'Cache Warming',
    'Cache Eviction Policies',
    'Popularity-Based Caching',
    'Multi-Tier Caching',
    'Byte-Range Requests',
    'Cache Hit Rate Optimization',
    'Cost Optimization',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 8: Distributed System Troubles',
  ],
};

export default videoStreamingCacheGuidedTutorial;
