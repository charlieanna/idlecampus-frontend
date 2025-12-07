import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';
import { TestCase } from '../../types/testCase';

/**
 * Compression Gateway Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching compression strategies for content delivery.
 * Focuses on gzip/brotli compression, content-type selection, and performance trade-offs.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic gateway with gzip/brotli compression
 * Steps 4-6: Content-based compression, streaming, pre-compression caching
 *
 * Key Concepts (DDIA & Performance):
 * - Compression algorithms (gzip, brotli, zstd)
 * - CPU vs bandwidth trade-offs
 * - Content-type based compression
 * - Streaming compression
 * - Pre-compression caching
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const compressionGatewayRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a compression gateway that reduces bandwidth costs while maintaining low latency",

  interviewer: {
    name: 'Sam Chen',
    role: 'Principal Performance Engineer at DataFlow Systems',
    avatar: '👩‍💻',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-compression',
      category: 'functional',
      question: "What types of content do we need to compress?",
      answer: "We serve various content types:\n\n1. **Text-based content** - HTML, CSS, JavaScript, JSON, XML (highly compressible 60-80%)\n2. **Images** - JPEG, PNG already compressed (skip compression)\n3. **Videos** - MP4, WebM already compressed (skip compression)\n4. **Documents** - PDFs (sometimes compressed, check first)\n\nFocus on text content where compression gives 5-10x size reduction!",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Not all content benefits from compression - text compresses well, already-compressed formats don't",
    },
    {
      id: 'compression-algorithms',
      category: 'functional',
      question: "Which compression algorithms should we support?",
      answer: "Modern web requires:\n\n1. **Gzip** - Universal browser support, fast, 60-70% compression for text\n2. **Brotli** - Better compression (70-80%), slightly slower, modern browsers\n3. **Identity** - No compression fallback for old browsers\n\nBrotli saves 20% more bandwidth than gzip but takes 10x more CPU at max compression!",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Compression is a CPU vs bandwidth trade-off - better compression costs more CPU",
    },
    {
      id: 'content-negotiation',
      category: 'functional',
      question: "How do clients tell us which compression they support?",
      answer: "Browsers send **Accept-Encoding** header:\n\n```\nAccept-Encoding: gzip, deflate, br\n```\n\nGateway responds with **Content-Encoding** header:\n```\nContent-Encoding: br\n```\n\nThis is called **content negotiation** - serve the best format the client can handle.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Content negotiation lets modern browsers get better compression while supporting old browsers",
    },
    {
      id: 'cpu-bandwidth-tradeoff',
      category: 'functional',
      question: "Should we use maximum compression level for everything?",
      answer: "Absolutely not! There's a CPU vs bandwidth trade-off:\n\n**Brotli level 11** (max):\n- 80% compression\n- 100ms CPU time\n- Best for static assets (compress once, serve many times)\n\n**Brotli level 4** (dynamic):\n- 70% compression\n- 5ms CPU time\n- Best for dynamic content (compress per request)\n\nDynamic content should use fast compression to minimize latency!",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Compression level is critical - max compression is too slow for dynamic content",
    },
    {
      id: 'pre-compression',
      category: 'functional',
      question: "Can we avoid compressing the same static files repeatedly?",
      answer: "Yes! **Pre-compression** for static assets:\n\n1. Compress file.js → file.js.gz and file.js.br at build time\n2. Store compressed versions in cache or storage\n3. Gateway serves pre-compressed file (0ms compression time!)\n\nFor dynamic content, compress on-the-fly per request.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Pre-compression eliminates CPU cost for static assets served repeatedly",
    },
    {
      id: 'streaming-compression',
      category: 'functional',
      question: "What if we have large responses - do we compress the whole thing before sending?",
      answer: "No! Use **streaming compression**:\n\n- Compress chunks as you generate response\n- Send compressed chunks immediately (TTFB optimization)\n- Don't wait to compress entire 10MB response\n\nStreaming reduces time-to-first-byte from seconds to milliseconds!",
      importance: 'important',
      revealsRequirement: 'FR-5',
      learningPoint: "Streaming compression enables low latency for large responses",
    },

    // SCALE & NFRs
    {
      id: 'throughput-requests',
      category: 'throughput',
      question: "How many requests per second should we handle?",
      answer: "50,000 requests per second at peak, mix of static and dynamic content",
      importance: 'critical',
      learningPoint: "High throughput requires efficient compression - CPU becomes the bottleneck",
    },
    {
      id: 'bandwidth-savings',
      category: 'throughput',
      question: "How much bandwidth can we save with compression?",
      answer: "Text content compresses 5-10x:\n- Uncompressed: 100 KB average response\n- Gzip: 30 KB (70% reduction)\n- Brotli: 20 KB (80% reduction)\n\nAt 50K RPS:\n- Uncompressed: 5 GB/sec bandwidth\n- Compressed: 1 GB/sec bandwidth\n- **Savings: $50K/month in bandwidth costs!**",
      importance: 'critical',
      calculation: {
        formula: "50K RPS × 100 KB × 0.7 compression = 1 GB/sec vs 5 GB/sec",
        result: "80% bandwidth reduction saves massive costs",
      },
      learningPoint: "Compression has huge cost impact at scale",
    },
    {
      id: 'latency-requirement',
      category: 'latency',
      question: "What's the latency target including compression overhead?",
      answer: "p99 latency < 100ms including compression time. Compression should add < 10ms to response time for dynamic content.",
      importance: 'critical',
      learningPoint: "Compression must be fast enough not to hurt user experience",
    },
    {
      id: 'cpu-budget',
      category: 'performance',
      question: "How much CPU can we spend on compression?",
      answer: "Each gateway instance has 8 CPU cores. At 50K RPS, we have:\n- 1000ms / (50000 RPS / 8 cores) = 0.16ms per request\n- Compression budget: ~5ms per request\n- Must use efficient compression levels!",
      importance: 'critical',
      calculation: {
        formula: "50K RPS / 8 cores = 6250 req/core/sec → ~0.16ms/req available",
        result: "Compression must be fast or we'll exhaust CPU capacity",
      },
      learningPoint: "CPU is limited - compression level must match throughput requirements",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-compression', 'compression-algorithms', 'cpu-bandwidth-tradeoff'],
  criticalFRQuestionIds: ['core-compression', 'compression-algorithms', 'content-negotiation'],
  criticalScaleQuestionIds: ['throughput-requests', 'bandwidth-savings', 'cpu-budget'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Compress text-based content intelligently',
      description: 'Identify and compress HTML, CSS, JS, JSON based on content-type',
      emoji: '🗜️',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Support gzip and brotli algorithms',
      description: 'Negotiate best compression based on Accept-Encoding header',
      emoji: '⚙️',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Optimize compression levels for content type',
      description: 'Fast compression for dynamic, max compression for static',
      emoji: '⚡',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Pre-compress and cache static assets',
      description: 'Compress static files once, serve from cache',
      emoji: '💾',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Stream compression for large responses',
      description: 'Compress and send chunks without buffering entire response',
      emoji: '🌊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A - Gateway handles 50K RPS',
    writesPerDay: 'N/A',
    readsPerDay: 'N/A',
    peakMultiplier: 2,
    readWriteRatio: 'N/A',
    calculatedWriteRPS: { average: 0, peak: 0 },
    calculatedReadRPS: { average: 50000, peak: 100000 },
    maxPayloadSize: '~100KB average response (text)',
    storagePerRecord: 'N/A',
    storageGrowthPerYear: 'N/A',
    redirectLatencySLA: 'p99 < 100ms (including compression)',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ Text content compresses 70-80% (huge bandwidth savings)',
    '✅ Pre-compression for static assets (no CPU cost)',
    '✅ Fast compression levels for dynamic content (< 10ms)',
    '✅ Content negotiation for best compression per client',
    '✅ Skip compression for images/video (already compressed)',
    '✅ Streaming compression for large responses (low TTFB)',
  ],

  outOfScope: [
    'Image compression/optimization (separate concern)',
    'Video transcoding',
    'End-to-end encryption (HTTPS)',
    'Request decompression (focus on response compression)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic gateway that routes requests to backends. Then we'll add compression intelligently - gzip first, then brotli, then optimize levels and caching. Functionality first, then optimization!",
};

// =============================================================================
// STEP 1: Build Basic Gateway
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "Welcome to DataFlow Systems! You're building a gateway that will save millions in bandwidth costs.",
  hook: "Right now, we're sending uncompressed responses - a 100 KB JSON response takes 100 KB of bandwidth. That's expensive!",
  challenge: "Set up the basic gateway infrastructure: Client → Gateway → Backend → Object Storage.",
  illustration: 'gateway-foundation',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your gateway is routing requests!',
  achievement: 'Basic request flow is working',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Request routing', after: 'Working' },
  ],
  nextTeaser: "But we're still sending uncompressed responses...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Compression Gateway: The Foundation',
  conceptExplanation: `A **Compression Gateway** sits between clients and backend services, compressing responses before sending them.

**Basic flow** (without compression yet):
1. Client requests /api/data
2. Gateway forwards request to backend
3. Backend fetches from storage, returns 100 KB JSON
4. Gateway forwards to client (100 KB transferred)

**Next step**: Add compression between steps 3-4 to reduce bandwidth!`,

  whyItMatters: 'Without a gateway, every backend service would need to implement compression independently. Centralizing compression at the gateway is more efficient.',

  keyPoints: [
    'Gateway centralizes cross-cutting concerns like compression',
    'Sits between clients and backends',
    'For now, just routing - compression comes next',
  ],

  keyConcepts: [
    { title: 'Gateway', explanation: 'Central proxy handling all requests', icon: '🚪' },
    { title: 'Backend', explanation: 'Services generating responses', icon: '🖥️' },
    { title: 'Client', explanation: 'Browsers or apps making requests', icon: '📱' },
  ],
};

const step1: GuidedStep = {
  id: 'compression-gateway-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Set up basic gateway infrastructure',
    taskDescription: 'Add Client, Gateway (App Server), Backend (Database), and Object Storage, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents users making API requests', displayName: 'Client' },
      { type: 'app_server', reason: 'Acts as the compression gateway', displayName: 'Gateway' },
      { type: 'database', reason: 'Backend service generating responses', displayName: 'Backend' },
      { type: 'object_storage', reason: 'Stores static assets', displayName: 'Storage' },
    ],
    successCriteria: [
      'Client component added',
      'Gateway (App Server) component added',
      'Backend (Database) component added',
      'Object Storage component added',
      'Client → Gateway → Backend → Storage connections created',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'object_storage' },
    ],
  },

  hints: {
    level1: 'Drag Client, App Server (Gateway), Database (Backend), and Object Storage onto the canvas',
    level2: 'Connect: Client → Gateway → Backend → Storage',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'database' },
      { type: 'object_storage' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
      { from: 'database', to: 'object_storage' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Basic Gzip Compression
// =============================================================================

const step2Story: StoryContent = {
  emoji: '🗜️',
  scenario: "Your CFO just calculated bandwidth costs: $50K/month!",
  hook: "Every JSON response is 100 KB uncompressed. With gzip compression, it could be 30 KB. That's 70% savings!",
  challenge: "Implement gzip compression in the gateway to reduce bandwidth usage.",
  illustration: 'bandwidth-costs',
};

const step2Celebration: CelebrationContent = {
  emoji: '💰',
  message: 'Gzip compression is working!',
  achievement: 'Bandwidth reduced by 70%',
  metrics: [
    { label: 'Response size', before: '100 KB', after: '30 KB' },
    { label: 'Bandwidth saved', after: '70%' },
    { label: 'Monthly savings', after: '$35K' },
  ],
  nextTeaser: "But modern browsers support even better compression...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Gzip Compression: The Universal Standard',
  conceptExplanation: `**Gzip** is the most widely supported compression algorithm for HTTP:

**How it works**:
\`\`\`python
import gzip

def compress_response(data):
    # Compress with gzip (level 6 default)
    compressed = gzip.compress(data.encode())
    return compressed  # 70% smaller!
\`\`\`

**Compression levels**:
- **Level 1**: Fastest (5x smaller, 1ms)
- **Level 6**: Default (7x smaller, 3ms)
- **Level 9**: Maximum (7.5x smaller, 10ms)

**For dynamic content**: Use level 4-6 (fast enough)
**For static content**: Use level 9 (compress once, serve many)

**Browser support**: 100% of browsers since 1999!`,

  whyItMatters: 'Gzip compression can reduce bandwidth costs by 60-80% with minimal CPU overhead. It\'s the foundation of efficient web delivery.',

  realWorldExample: {
    company: 'Google',
    scenario: 'Serving search results',
    howTheyDoIt: 'All text responses (HTML, JSON, JS, CSS) are gzip compressed. Saves petabytes of bandwidth daily.',
  },

  famousIncident: {
    title: 'BREACH Attack on Gzip Compression',
    company: 'Multiple companies',
    year: '2013',
    whatHappened: 'Security researchers discovered that gzip compression of HTTPS responses could leak secrets. If attacker controls part of request and measures response size, they can extract CSRF tokens.',
    lessonLearned: 'Don\'t compress responses containing both user input and secrets. Add random padding or disable compression for sensitive endpoints.',
    icon: '🔐',
  },

  keyPoints: [
    'Gzip compresses text 60-80% (5-10x smaller)',
    'Level 6 is good balance of speed vs compression',
    'Universal browser support',
    'CPU cost: ~3-5ms per request',
    'Must check Accept-Encoding header first',
  ],

  quickCheck: {
    question: 'Why not use gzip level 9 (maximum) for all dynamic content?',
    options: [
      'It doesn\'t compress better than level 6',
      'Browsers don\'t support it',
      'It\'s too slow - adds 10ms+ latency vs 3ms for level 6',
      'It uses more bandwidth',
    ],
    correctIndex: 2,
    explanation: 'Level 9 gives only slightly better compression but takes 3x longer. For dynamic content served once, the latency hit isn\'t worth it.',
  },

  keyConcepts: [
    { title: 'Gzip', explanation: 'Deflate compression algorithm', icon: '🗜️' },
    { title: 'Compression Level', explanation: 'Speed vs ratio trade-off (1-9)', icon: '⚙️' },
    { title: 'Accept-Encoding', explanation: 'Client header listing supported compression', icon: '📨' },
  ],
};

const step2: GuidedStep = {
  id: 'compression-gateway-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Compress text-based content',
    taskDescription: 'Implement gzip compression in the gateway Python code',
    successCriteria: [
      'Click on Gateway (App Server)',
      'Assign POST /api/compress API',
      'Open Python tab',
      'Implement compress_response() function using gzip',
      'Check Accept-Encoding header',
      'Set Content-Encoding: gzip in response',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'object_storage' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click Gateway → APIs tab, assign POST /api/compress',
    level2: 'Switch to Python tab, implement: import gzip; compressed = gzip.compress(data)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Add Brotli Compression Support
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚡',
  scenario: "Your metrics show 80% of users have modern browsers!",
  hook: "Modern browsers support Brotli compression, which compresses 20% better than gzip. That's an extra $10K/month savings!",
  challenge: "Add Brotli compression support and negotiate the best algorithm per client.",
  illustration: 'modern-browsers',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Brotli compression is working!',
  achievement: 'Modern clients now get even better compression',
  metrics: [
    { label: 'Brotli response size', before: '30 KB (gzip)', after: '20 KB (brotli)' },
    { label: 'Extra bandwidth saved', after: '33% vs gzip' },
    { label: 'Total savings', after: '80% vs uncompressed' },
  ],
  nextTeaser: "But compression is taking too long for dynamic content...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Brotli: Next-Generation Compression',
  conceptExplanation: `**Brotli** is a modern compression algorithm from Google:

**Brotli vs Gzip**:
- **Compression**: 10-20% better than gzip
- **Speed**: Similar at low levels, slower at high levels
- **Browser support**: 95% of browsers (IE11 doesn't support)

**Compression levels**:
- **Level 0-3**: Faster than gzip, similar compression
- **Level 4**: Default for dynamic (like gzip level 6)
- **Level 11**: Maximum for static (much better than gzip 9)

**Content negotiation**:
\`\`\`python
def choose_compression(accept_encoding):
    if 'br' in accept_encoding:
        return 'brotli'
    elif 'gzip' in accept_encoding:
        return 'gzip'
    else:
        return 'identity'  # No compression
\`\`\`

**Implementation**:
\`\`\`python
import brotli

# Dynamic content (fast)
compressed = brotli.compress(data, quality=4)

# Static content (max compression)
compressed = brotli.compress(data, quality=11)
\`\`\``,

  whyItMatters: 'Brotli saves 10-20% more bandwidth than gzip at comparable CPU cost. At scale, this translates to huge savings.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving trillions of requests',
    howTheyDoIt: 'Uses Brotli level 4 for dynamic content, level 11 for static assets. Saves customers petabytes of bandwidth.',
  },

  famousIncident: {
    title: 'Brotli Adoption at CDN Scale',
    company: 'Cloudflare',
    year: '2017',
    whatHappened: 'Cloudflare switched to Brotli for all text content. CPU usage increased 10% but bandwidth decreased 20%. The bandwidth savings paid for additional servers with money left over.',
    lessonLearned: 'Better compression can increase CPU usage but the bandwidth savings often justify the cost.',
    icon: '☁️',
  },

  diagram: `
Compression Comparison:
─────────────────────────────────────────
Original:    ████████████ 100 KB
Gzip (6):    ███ 30 KB (70% reduction)
Brotli (4):  ██ 25 KB (75% reduction)
Brotli (11): █ 20 KB (80% reduction)

CPU Time (dynamic content):
─────────────────────────────────────────
Gzip (6):    ███ 3ms
Brotli (4):  ████ 4ms   ← Best for dynamic
Brotli (11): ████████████████████ 100ms ← Only for static!
`,

  keyPoints: [
    'Brotli compresses 10-20% better than gzip',
    'Use level 4 for dynamic, level 11 for static',
    'Check Accept-Encoding: br before using',
    'Fallback to gzip for old browsers',
    '95% browser support (all modern browsers)',
  ],

  quickCheck: {
    question: 'When should you use Brotli level 11?',
    options: [
      'All content (best compression)',
      'Dynamic content (fast response)',
      'Static assets served repeatedly (compress once)',
      'Never (too slow)',
    ],
    correctIndex: 2,
    explanation: 'Level 11 takes 100ms+ to compress, but you only compress static assets once then serve from cache. Perfect trade-off!',
  },

  keyConcepts: [
    { title: 'Brotli', explanation: 'Modern compression algorithm from Google', icon: '⚡' },
    { title: 'Content Negotiation', explanation: 'Choose best format per client', icon: '🤝' },
    { title: 'Quality Level', explanation: 'Brotli 0-11 (like gzip 1-9)', icon: '🎚️' },
  ],
};

const step3: GuidedStep = {
  id: 'compression-gateway-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Support brotli and gzip with content negotiation',
    taskDescription: 'Add Brotli support and implement content negotiation based on Accept-Encoding',
    successCriteria: [
      'Open Python tab in Gateway',
      'Import brotli library',
      'Parse Accept-Encoding header',
      'Choose best compression (brotli > gzip > identity)',
      'Set appropriate Content-Encoding header',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'object_storage' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add content negotiation: check Accept-Encoding for "br", fallback to "gzip"',
    level2: 'Implement: if "br" in headers.get("Accept-Encoding"): use brotli.compress()',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Optimize Compression Levels for Content Types
// =============================================================================

const step4Story: StoryContent = {
  emoji: '⏱️',
  scenario: "Your p99 latency just spiked to 150ms! Users are complaining about slow API responses.",
  hook: "You're using Brotli level 11 for ALL content - even dynamic JSON generated per request. That takes 100ms to compress!",
  challenge: "Optimize compression levels: fast compression for dynamic content, max compression for static assets.",
  illustration: 'latency-spike',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Compression levels optimized!',
  achievement: 'Dynamic content is fast again',
  metrics: [
    { label: 'Dynamic content compression time', before: '100ms', after: '4ms' },
    { label: 'Static content compression', after: '100ms (once, then cached)' },
    { label: 'p99 latency', before: '150ms', after: '20ms' },
  ],
  nextTeaser: "But we're still re-compressing static files on every request...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Compression Level Strategy: CPU vs Bandwidth Trade-off',
  conceptExplanation: `**The fundamental trade-off**: Better compression takes more CPU time.

**Content-based strategy**:

**Dynamic Content** (JSON, HTML generated per request):
- Compressed once per request
- Use **fast compression** (Brotli 4, Gzip 6)
- Compression time: 3-5ms
- Ratio: 70-75%
- **Why**: Latency matters more than perfect compression

**Static Content** (JS, CSS files served repeatedly):
- Compressed once at build/deploy time
- Use **maximum compression** (Brotli 11, Gzip 9)
- Compression time: 100ms (doesn't matter, compress once!)
- Ratio: 80%+
- **Why**: Compress once, serve millions of times

**Implementation**:
\`\`\`python
def get_compression_level(content_type, is_static):
    if is_static:
        # Static assets: max compression
        return {'brotli': 11, 'gzip': 9}
    else:
        # Dynamic content: fast compression
        return {'brotli': 4, 'gzip': 6}
\`\`\`

**Content-Type detection**:
- \`application/json\` → Dynamic, fast compression
- \`text/html\` → Usually dynamic, fast compression
- \`application/javascript\` → Static, max compression
- \`text/css\` → Static, max compression
- \`image/jpeg\` → Already compressed, skip!`,

  whyItMatters: 'Using the wrong compression level can either waste CPU (too high for dynamic) or waste bandwidth (too low for static). Matching level to content type is critical.',

  realWorldExample: {
    company: 'Netflix',
    scenario: 'Serving UI assets and API responses',
    howTheyDoIt: 'Static UI bundles pre-compressed with Brotli 11 at build time. Dynamic API responses use Gzip 6 for speed. Optimal latency + bandwidth.',
  },

  famousIncident: {
    title: 'Reddit Latency Spike from Over-Compression',
    company: 'Reddit',
    year: '2019',
    whatHappened: 'A configuration change accidentally set all responses to maximum compression level. API latency jumped from 50ms to 200ms+. Users noticed immediately.',
    lessonLearned: 'Compression level must match content lifetime. Dynamic content needs fast compression even if it\'s less efficient.',
    icon: '🐛',
  },

  diagram: `
Compression Strategy Matrix:
────────────────────────────────────────────────────
Content Type       | Static? | Level      | Time
────────────────────────────────────────────────────
JSON API response  | No      | Brotli 4   | 4ms
HTML (dynamic)     | No      | Brotli 4   | 5ms
JavaScript bundle  | Yes     | Brotli 11  | 100ms (once!)
CSS stylesheet     | Yes     | Brotli 11  | 80ms (once!)
JPEG/PNG image     | Yes     | Skip       | 0ms (already compressed)
MP4 video          | Yes     | Skip       | 0ms (already compressed)
────────────────────────────────────────────────────
`,

  keyPoints: [
    'Dynamic content: Fast compression (Brotli 4, Gzip 6)',
    'Static content: Max compression (Brotli 11, Gzip 9)',
    'Skip compression for images/video (already compressed)',
    'Detect based on Content-Type header',
    'Pre-compression at build time is best for static',
  ],

  quickCheck: {
    question: 'Why use Brotli level 4 instead of 11 for JSON API responses?',
    options: [
      'Level 11 doesn\'t work on JSON',
      'Level 4 compresses better for JSON',
      'API responses are served once - fast compression (4ms) better than max (100ms)',
      'Browsers don\'t support level 11',
    ],
    correctIndex: 2,
    explanation: 'Each JSON response is generated and compressed once per request. 4ms compression time is worth the 5% worse compression ratio.',
  },

  keyConcepts: [
    { title: 'Dynamic Content', explanation: 'Generated per request', icon: '🔄' },
    { title: 'Static Content', explanation: 'Same file served repeatedly', icon: '📄' },
    { title: 'Compression Level', explanation: 'CPU time vs compression ratio', icon: '⚖️' },
  ],
};

const step4: GuidedStep = {
  id: 'compression-gateway-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-3: Optimize compression levels per content type',
    taskDescription: 'Implement content-type aware compression with appropriate levels',
    successCriteria: [
      'Open Python tab',
      'Detect static vs dynamic content from Content-Type or path',
      'Use Brotli 4 / Gzip 6 for dynamic content',
      'Use Brotli 11 / Gzip 9 for static content',
      'Skip compression for images/video',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'object_storage' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Implement content type detection: check if Content-Type is JSON/HTML (dynamic) or JS/CSS (static)',
    level2: 'Use quality=4 for dynamic, quality=11 for static: brotli.compress(data, quality=level)',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 5: Add Pre-Compression Cache for Static Assets
// =============================================================================

const step5Story: StoryContent = {
  emoji: '💾',
  scenario: "Your gateway is compressing the same app.js file 10,000 times per second!",
  hook: "Static assets never change, but you're compressing them on every request. That's wasting 80% of your CPU!",
  challenge: "Add a cache to store pre-compressed versions of static assets.",
  illustration: 'repeated-compression',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Pre-compression cache is working!',
  achievement: 'Static assets compressed once, served from cache',
  metrics: [
    { label: 'Static asset CPU time', before: '100ms per request', after: '0.1ms (cache hit)' },
    { label: 'Cache hit rate', after: '99%' },
    { label: 'CPU utilization', before: '80%', after: '10%' },
  ],
  nextTeaser: "But what about large responses that take seconds to generate?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Pre-Compression Caching: Compress Once, Serve Many',
  conceptExplanation: `**Pre-compression** eliminates repeated compression of static assets:

**Without caching**:
\`\`\`
Request 1: Compress app.js (100ms) → Serve
Request 2: Compress app.js (100ms) → Serve  ← Wasted!
Request 3: Compress app.js (100ms) → Serve  ← Wasted!
...10,000 requests = 1000 seconds of CPU!
\`\`\`

**With caching**:
\`\`\`
Request 1: Compress app.js (100ms) → Cache → Serve
Request 2: Fetch from cache (0.1ms) → Serve
Request 3: Fetch from cache (0.1ms) → Serve
...10,000 requests = 100ms + 1 second = 1.1 seconds total!
\`\`\`

**Cache key strategy**:
- Key: \`{filename}:{encoding}\`
- Example: \`app.js:br\`, \`app.js:gzip\`
- Store multiple versions per file

**Implementation**:
\`\`\`python
def get_compressed_static(filename, encoding):
    cache_key = f"{filename}:{encoding}"

    # Try cache first
    cached = redis.get(cache_key)
    if cached:
        return cached  # Cache hit!

    # Cache miss: compress and store
    content = read_file(filename)
    compressed = compress(content, encoding, level=11)
    redis.set(cache_key, compressed, ex=86400)  # 24hr TTL
    return compressed
\`\`\`

**Cache invalidation**: When static file changes:
1. Update version in filename (app-v2.js)
2. Or delete cache keys for that file
3. New version gets compressed and cached`,

  whyItMatters: 'Pre-compression caching reduces CPU usage by 90%+ for static content. It\'s the difference between needing 10 servers vs 100 servers.',

  realWorldExample: {
    company: 'Cloudflare',
    scenario: 'Serving static assets for millions of websites',
    howTheyDoIt: 'Pre-compresses all static assets at the edge. Stores compressed versions in cache with 30-day TTL. Cache hit rate > 99.9%.',
  },

  diagram: `
Pre-Compression Cache Flow:
─────────────────────────────────────────
Request: GET /app.js
Accept-Encoding: br

┌──────────────┐
│   Gateway    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Check Cache  │ Key: app.js:br
│  (Redis)     │
└──────┬───────┘
       │
   ┌───┴───┐
   │       │
  HIT     MISS
   │       │
   ▼       ▼
Return  ┌──────────────┐
cached  │ Fetch file   │
0.1ms   │ Compress     │
        │ (Brotli 11)  │
        │ 100ms        │
        │ Store cache  │
        └──────────────┘
`,

  keyPoints: [
    'Cache compressed versions of static assets',
    'Key format: {filename}:{encoding}',
    'Store multiple encodings (gzip, brotli) per file',
    'Use Redis or CDN edge cache',
    'Set appropriate TTL (24hr - 30 days)',
    'Invalidate on file change or use versioned URLs',
  ],

  quickCheck: {
    question: 'Why is pre-compression caching so effective for static assets?',
    options: [
      'It compresses better than dynamic compression',
      'It uses less memory',
      'Same file served thousands of times - compress once, serve from cache',
      'It\'s faster to compress',
    ],
    correctIndex: 2,
    explanation: 'app.js might be requested 10,000 times. Compressing it once (100ms) and caching beats compressing it 10,000 times (1000 seconds)!',
  },

  keyConcepts: [
    { title: 'Pre-Compression', explanation: 'Compress before first request', icon: '⚡' },
    { title: 'Cache Key', explanation: 'Unique identifier per file+encoding', icon: '🔑' },
    { title: 'Cache Hit', explanation: 'Serving from cache (fast)', icon: '✅' },
    { title: 'Cache Miss', explanation: 'Compress and store (slow once)', icon: '❌' },
  ],
};

const step5: GuidedStep = {
  id: 'compression-gateway-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Pre-compress and cache static assets',
    taskDescription: 'Add Redis cache and implement pre-compression caching for static files',
    componentsNeeded: [
      { type: 'cache', reason: 'Store pre-compressed static assets', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Add Cache (Redis) component',
      'Connect Gateway to Cache',
      'Implement cache lookup by {filename}:{encoding}',
      'Store compressed versions in cache',
      'Set appropriate TTL',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'object_storage' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add Cache component and connect Gateway → Cache',
    level2: 'Implement: redis.get(f"{filename}:{encoding}") for cache lookup, redis.set() to store',
    solutionComponents: [{ type: 'cache' }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 6: Implement Streaming Compression
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🌊',
  scenario: "Your API returns 10 MB JSON responses for data exports!",
  hook: "You're buffering the entire 10 MB, compressing it (500ms), then sending. Users wait 2 seconds before seeing ANY data!",
  challenge: "Implement streaming compression to send compressed chunks as you generate the response.",
  illustration: 'buffered-response',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Streaming compression is working!',
  achievement: 'Large responses stream instantly',
  metrics: [
    { label: 'Time to first byte', before: '2000ms', after: '50ms' },
    { label: 'Total response time', before: '2500ms', after: '1200ms' },
    { label: 'User experience', before: 'Frozen', after: 'Progressive loading' },
  ],
  nextTeaser: "You've mastered compression strategies!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Streaming Compression: Low Latency for Large Responses',
  conceptExplanation: `**Streaming compression** compresses and sends data in chunks without buffering:

**Buffered compression** (bad for large responses):
\`\`\`python
# Generate entire response (slow)
data = generate_large_json()  # 2000ms

# Compress entire response (slow)
compressed = brotli.compress(data)  # 500ms

# Send to client
send(compressed)  # Finally!
# TTFB: 2500ms
\`\`\`

**Streaming compression** (good!):
\`\`\`python
import brotli

# Create streaming compressor
compressor = brotli.Compressor(quality=4)

# Generate and compress in chunks
for chunk in generate_json_chunks():  # 50ms per chunk
    compressed_chunk = compressor.process(chunk)
    send(compressed_chunk)  # Send immediately!
    # TTFB: 50ms (first chunk)

# Flush final compressed data
send(compressor.finish())
\`\`\`

**Benefits**:
- **Low TTFB**: First chunk sent in 50ms vs 2500ms
- **Progressive loading**: Browser can parse as data arrives
- **Lower memory**: Don't buffer entire response
- **Better UX**: Users see progress, not blank screen

**When to use**:
- Large responses (> 1 MB)
- Long-running queries
- Server-sent events (SSE)
- Export/download endpoints

**When NOT to use**:
- Small responses (< 10 KB) - overhead not worth it
- Cached content - already compressed`,

  whyItMatters: 'Streaming compression transforms user experience for large responses. Instead of waiting 2+ seconds for download to start, users see data in 50ms.',

  realWorldExample: {
    company: 'Twitter',
    scenario: 'Streaming timeline API',
    howTheyDoIt: 'API returns tweets as they\'re fetched from database. Each batch compressed and streamed immediately. Users see tweets load progressively.',
  },

  famousIncident: {
    title: 'Netflix Streaming Optimization',
    company: 'Netflix',
    year: '2016',
    whatHappened: 'Netflix switched from buffered to streaming compression for API responses. Time-to-first-byte dropped from 800ms to 50ms, dramatically improving perceived performance.',
    lessonLearned: 'Streaming compression is critical for large responses. Buffering entire response before compressing kills user experience.',
    icon: '🎬',
  },

  diagram: `
Buffered vs Streaming Compression:

BUFFERED (Bad for large responses):
─────────────────────────────────────────
t=0ms:     Generate chunk 1
t=500ms:   Generate chunk 2
t=1000ms:  Generate chunk 3
t=1500ms:  Generate chunk 4
t=2000ms:  All generated → Compress (500ms)
t=2500ms:  Send compressed data ← TTFB!

STREAMING (Good!):
─────────────────────────────────────────
t=0ms:     Generate chunk 1 → Compress → Send ← TTFB: 50ms!
t=500ms:   Generate chunk 2 → Compress → Send
t=1000ms:  Generate chunk 3 → Compress → Send
t=1500ms:  Generate chunk 4 → Compress → Send
t=2000ms:  Finish compression
─────────────────────────────────────────
User sees data 50x faster!
`,

  keyPoints: [
    'Stream compression = compress chunks as generated',
    'Dramatically lowers TTFB for large responses',
    'Use brotli.Compressor() or gzip streaming API',
    'Send compressed chunks immediately',
    'Essential for large responses (> 1 MB)',
    'Better UX - progressive loading vs blank screen',
  ],

  quickCheck: {
    question: 'Why does streaming compression improve Time-To-First-Byte?',
    options: [
      'It compresses faster',
      'It compresses better',
      'It sends the first chunk immediately instead of buffering entire response',
      'It uses less CPU',
    ],
    correctIndex: 2,
    explanation: 'Streaming sends compressed chunks as soon as they\'re ready. Buffered compression waits until entire response is generated AND compressed.',
  },

  keyConcepts: [
    { title: 'Streaming', explanation: 'Compress and send chunks incrementally', icon: '🌊' },
    { title: 'TTFB', explanation: 'Time To First Byte - critical UX metric', icon: '⚡' },
    { title: 'Buffering', explanation: 'Accumulating entire response before sending', icon: '📦' },
    { title: 'Progressive Loading', explanation: 'Browser displays data as it arrives', icon: '📊' },
  ],
};

const step6: GuidedStep = {
  id: 'compression-gateway-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Stream compression for large responses',
    taskDescription: 'Implement streaming compression for responses larger than 1 MB',
    successCriteria: [
      'Open Python tab',
      'Detect large responses (> 1 MB)',
      'Use brotli.Compressor() for streaming',
      'Process and send chunks incrementally',
      'Flush final compressed data',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'object_storage', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'database', toType: 'object_storage' },
      { fromType: 'app_server', to: 'cache' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'For large responses, use streaming: compressor = brotli.Compressor(quality=4)',
    level2: 'Process chunks: for chunk in data_chunks: send(compressor.process(chunk))',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const compressionGatewayGuidedTutorial: GuidedTutorial = {
  problemId: 'compression-gateway',
  title: 'Design a Compression Gateway',
  description: 'Build a gateway with intelligent compression strategies to reduce bandwidth costs by 80%',
  difficulty: 'intermediate',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '🗜️',
    hook: "You're the Performance Engineer at DataFlow Systems!",
    scenario: "Your mission: Build a compression gateway that reduces bandwidth costs by 80% while maintaining low latency using gzip, brotli, and smart caching strategies.",
    challenge: "Can you balance CPU usage vs bandwidth savings for optimal performance?",
  },

  requirementsPhase: compressionGatewayRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  // Final exam test cases
  finalExamTestCases: [
    {
      name: 'Basic Gzip Compression',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Gateway compresses text responses with gzip',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { minBandwidthSavings: 0.6 },
    },
    {
      name: 'Brotli Content Negotiation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Gateway negotiates best compression based on Accept-Encoding',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { minBandwidthSavings: 0.7 },
    },
    {
      name: 'Optimized Compression Levels',
      type: 'performance',
      requirement: 'FR-3',
      description: 'Fast compression for dynamic, max for static',
      traffic: { type: 'mixed', rps: 1000, readRps: 1000, writeRps: 0 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, minBandwidthSavings: 0.75 },
    },
    {
      name: 'Pre-Compression Cache',
      type: 'functional',
      requirement: 'FR-4',
      description: 'Static assets served from pre-compression cache',
      traffic: { type: 'read_heavy', rps: 2000, readRps: 2000, writeRps: 0 },
      duration: 60,
      passCriteria: { minCacheHitRate: 0.95, maxP99Latency: 50 },
    },
    {
      name: 'Streaming Compression',
      type: 'functional',
      requirement: 'FR-5',
      description: 'Large responses use streaming compression for low TTFB',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 30,
      passCriteria: { maxTTFB: 100 },
    },
  ] as TestCase[],

  concepts: [
    'Compression Algorithms',
    'Gzip Compression',
    'Brotli Compression',
    'Content Negotiation',
    'Accept-Encoding Header',
    'Content-Encoding Header',
    'Compression Levels',
    'CPU vs Bandwidth Trade-off',
    'Static vs Dynamic Content',
    'Pre-Compression',
    'Compression Caching',
    'Streaming Compression',
    'Time To First Byte (TTFB)',
    'Content-Type Detection',
  ],

  ddiaReferences: [
    'Chapter 4: Encoding and Evolution - Data compression',
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
  ],
};

export default compressionGatewayGuidedTutorial;
