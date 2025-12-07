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
 * RTB Ad Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a Real-Time Bidding Ad Cache. Each step tells a story that motivates the task.
 *
 * Flow:
 * Step 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build brute force solution - FRs satisfied!
 * Steps 4-7: Apply NFRs (caching, latency optimization, targeting, scale)
 *
 * Key Pedagogy: First make it WORK, then make it FAST, then make it SCALE
 */

// =============================================================================
// STEP 0: Requirements Gathering - The Interview
// =============================================================================

const rtbAdCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design an ad cache for Real-Time Bidding (RTB) that serves ads within 100ms",

  interviewer: {
    name: 'Maya Patel',
    role: 'Principal Engineer, Ad Platform',
    avatar: '👩‍💼',
  },

  questions: [
    // =============================================================================
    // PART 1: FUNCTIONAL REQUIREMENTS
    // =============================================================================

    // CRITICAL - Core Functionality
    {
      id: 'core-rtb-flow',
      category: 'functional',
      question: "What happens when a user visits a website with ads? Walk me through the RTB flow.",
      answer: "When a user visits a page with an ad slot:\n1. **Ad Request**: Publisher sends ad request (user context, page info)\n2. **RTB Auction**: Ad exchange sends bid requests to multiple bidders simultaneously\n3. **Bid Response**: Bidders respond with bids and ad creative metadata within ~100ms\n4. **Winner Selection**: Highest bid wins\n5. **Ad Serving**: Winning ad is displayed to the user\n\nOur cache sits between the bidder and the ad exchange, serving pre-cached bid responses instantly.",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Understanding the RTB auction flow is critical - you have ~100ms total latency budget",
    },
    {
      id: 'bid-caching',
      category: 'functional',
      question: "What exactly gets cached? Just the ad creative or the entire bid response?",
      answer: "We cache **bid responses** including:\n- Bid price (CPM)\n- Ad creative ID and metadata\n- Targeting criteria match results\n- Click-through URL\n- Impression tracking pixels\n\nWhen a bid request comes in, we check if we have a pre-computed bid response that matches the targeting criteria, then return it immediately instead of computing the bid in real-time.",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Caching bid responses (not just creatives) is key to sub-100ms latency",
    },
    {
      id: 'targeting-matching',
      category: 'functional',
      question: "How do you know which cached bid to serve? What if user demographics don't match?",
      answer: "Great question! We use **targeting keys** as cache keys:\n- Demographics: age, gender, location\n- Context: page category, keywords\n- Device: mobile/desktop, OS, browser\n- Time: time of day, day of week\n\nCache key example: `geo=US_NY|device=mobile|age=25-34|category=sports`\n\nWhen a bid request comes in, we extract targeting attributes, build the cache key, and lookup. If targeting doesn't match exactly, we compute the bid in real-time (cache miss).",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Targeting data drives cache key design - precision vs cache hit rate tradeoff",
    },

    // IMPORTANT - Clarifications
    {
      id: 'cache-freshness',
      category: 'clarification',
      question: "How often do bid prices change? Can we cache for hours or just seconds?",
      answer: "Bid prices change frequently based on:\n- Budget pacing (how fast advertiser wants to spend)\n- Time of day (evening traffic is more expensive)\n- Inventory availability (high competition = higher bids)\n\nTypical TTL: **60-300 seconds**. Short enough to keep bids competitive, long enough to get cache hits. Stale bids by 1-2 minutes is acceptable - losing a bid is better than missing the 100ms deadline.",
      importance: 'important',
      insight: "Short TTL (1-5 min) balances freshness vs cache hit rate",
    },
    {
      id: 'bid-miss-fallback',
      category: 'clarification',
      question: "What happens on a cache miss? Do we just return no bid?",
      answer: "No! On cache miss, we have two options:\n1. **Real-time bid** (if time permits): Compute bid on-the-fly within latency budget\n2. **Default bid** (if too slow): Return a generic, lower-value bid from cache\n\nMost systems do real-time bid on miss, but track the miss rate. High miss rate means poor cache coverage.",
      importance: 'important',
      insight: "Always have a fallback - never return empty response on cache miss",
    },
    {
      id: 'budget-pacing',
      category: 'clarification',
      question: "What if an advertiser runs out of budget mid-day? Do cached bids keep serving?",
      answer: "No - we need **budget validation** even with caching. Options:\n1. **Embed budget timestamp in cache**: Invalidate cached bids when budget updates\n2. **Real-time budget check**: Quick lookup to verify budget before serving cached bid\n3. **Budget service**: Separate fast service that validates budget\n\nMost systems use option 3: cache bids, but check budget service (< 5ms) before serving.",
      importance: 'important',
      insight: "Caching doesn't eliminate all real-time checks - some data is too dynamic",
    },

    // SCOPE
    {
      id: 'scope-single-region',
      category: 'scope',
      question: "Is this for a single region or global?",
      answer: "Let's start with a single region. Multi-region adds complexity with cache consistency and data locality.",
      importance: 'nice-to-have',
      insight: "Single region simplifies cache design - no cross-region sync needed",
    },

    // =============================================================================
    // PART 2: SCALE & NFRs
    // =============================================================================

    // 1. LATENCY (Most Critical for RTB)
    {
      id: 'latency-p99',
      category: 'latency',
      question: "What's the latency requirement? You mentioned 100ms - is that p50, p99, or p100?",
      answer: "**p99 latency < 100ms** is the hard requirement. Here's why:\n- Total RTB auction: ~200ms budget\n- Network overhead: ~50ms\n- Bid computation + serving: must be < 100ms\n- If you exceed 100ms, the ad exchange drops your bid (too late)\n\np100 (max) can be higher - a few slow requests are acceptable. But p99 must be sub-100ms or you lose revenue.",
      importance: 'critical',
      calculation: {
        formula: "100ms total = 10ms cache lookup + 20ms targeting match + 10ms budget check + 60ms buffer",
        result: "Cache hit must be < 50ms, cache miss < 100ms",
      },
      learningPoint: "RTB is latency-critical - every millisecond counts. p99 < 100ms is non-negotiable.",
    },
    {
      id: 'latency-cache-hit',
      category: 'latency',
      question: "How fast must cache hits be? What about cache misses?",
      answer: "**Cache hit: p99 < 20ms** (just cache lookup + minimal processing)\n**Cache miss: p99 < 100ms** (includes real-time bid computation)\n\nBreakdown for cache hit:\n- Redis lookup: 1-3ms\n- Targeting validation: 5-10ms\n- Budget check: 2-5ms\n- Response serialization: 2-5ms\n- Total: ~15-20ms",
      importance: 'critical',
      learningPoint: "Cache hits must be lightning fast - in-memory cache is essential",
    },

    // 2. THROUGHPUT
    {
      id: 'throughput-qps',
      category: 'throughput',
      question: "How many queries per second (QPS) should we handle?",
      answer: "**100,000 QPS** sustained, **200,000 QPS** at peak.\n\nBreakdown:\n- 80% cache hits = 80K QPS from cache\n- 20% cache misses = 20K QPS real-time bids\n\nEach bidder handles millions of bid requests per day across all campaigns.",
      importance: 'critical',
      calculation: {
        formula: "100K QPS × 80% hit rate = 80K cache reads/sec",
        result: "Need high-throughput cache (Redis cluster)",
      },
      learningPoint: "RTB is high-QPS - need distributed cache for horizontal scaling",
    },

    // 3. PAYLOAD
    {
      id: 'payload-bid-size',
      category: 'payload',
      question: "How big is a typical bid response? What about targeting data?",
      answer: "**Bid response: ~2-5KB** (JSON)\n- Bid price, creative ID, click URL, tracking pixels\n- Small compared to the actual ad creative (which is served separately)\n\n**Targeting data per request: ~1KB**\n- User demographics, page context, device info\n\nTotal cache storage for 1M unique targeting combinations × 5KB = ~5GB.",
      importance: 'important',
      calculation: {
        formula: "1M cache entries × 5KB = 5GB cache size",
        result: "Redis cluster with 10GB+ memory",
      },
      learningPoint: "Bid responses are small - cache storage is not the bottleneck, speed is",
    },

    // 4. BURST
    {
      id: 'burst-peak',
      category: 'burst',
      question: "What's the peak-to-average traffic ratio?",
      answer: "Peak traffic is **2x average** during:\n- Prime time (7-10 PM)\n- Major events (Super Bowl, Black Friday)\n- Viral content spikes\n\nDesign for 200K QPS peak, provision for 100K QPS average.",
      importance: 'critical',
      insight: "Auto-scaling is critical for handling peak traffic bursts",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-rtb-flow', 'bid-caching', 'targeting-matching'],
  criticalFRQuestionIds: ['core-rtb-flow', 'bid-caching', 'targeting-matching'],
  criticalScaleQuestionIds: ['latency-p99', 'throughput-qps', 'burst-peak'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Serve bid responses within 100ms',
      description: 'System must return bid responses to ad exchange within p99 < 100ms latency',
      emoji: '⚡',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Cache pre-computed bid responses',
      description: 'Cache bid prices, creative metadata, and targeting match results for fast lookup',
      emoji: '💾',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Match bids using targeting data',
      description: 'Use targeting attributes (geo, device, demographics) as cache keys for precise matching',
      emoji: '🎯',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: 'N/A (server-to-server)',
    writesPerDay: '8.64 billion cache writes',
    readsPerDay: '8.64 billion bid requests',
    peakMultiplier: 2,
    readWriteRatio: '4:1 (80% cache hits)',
    calculatedWriteRPS: { average: 20000, peak: 40000 },
    calculatedReadRPS: { average: 80000, peak: 160000 },
    maxPayloadSize: '~5KB',
    storagePerRecord: '~5KB',
    storageGrowthPerYear: '~50GB (with TTL eviction)',
    redirectLatencySLA: 'N/A',
    createLatencySLA: 'p99 < 100ms (bid response)',
  },

  architecturalImplications: [
    '⚡ p99 < 100ms → In-memory cache (Redis) is mandatory',
    '📊 100K QPS → Need distributed cache cluster (not single server)',
    '🎯 Targeting-based cache keys → Smart cache key design critical',
    '🔄 Short TTL (1-5 min) → High cache churn, need write capacity',
    '💰 Budget validation → Separate fast budget service alongside cache',
  ],

  outOfScope: [
    'Real-time bid computation algorithms (ML models)',
    'Ad creative storage and CDN delivery',
    'Fraud detection and blocking',
    'Multi-region cache synchronization',
  ],

  keyInsight: "RTB is all about SPEED. First, let's build a simple cache that works. Then we'll optimize for the 100ms latency requirement. This is the right approach: functionality first, then performance.",
};

// =============================================================================
// STEP 1: The Beginning - Connect Ad Exchange to Bid Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🚀',
  scenario: "You've been hired to build an ad bidding system for a new ad network.",
  hook: "Publishers want to show ads on their websites, and advertisers want to bid on those ad slots. Your job: build the system that connects them.",
  challenge: "Set up the basic infrastructure: Ad Exchange (client) connects to your Bid Server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your bidding system is online!",
  achievement: "Ad exchanges can now send bid requests to your server",
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can receive bid requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to respond to bids yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'RTB Basics: The Ad Auction',
  conceptExplanation: `**Real-Time Bidding (RTB)** is a digital ad auction that happens in ~100ms:

1. **User visits website** with ad slot
2. **Publisher sends ad request** to Ad Exchange
3. **Ad Exchange broadcasts** bid request to multiple bidders (including you!)
4. **Bidders respond** with bid price + ad creative (within 100ms)
5. **Highest bid wins** and ad is shown to user

Your **Bid Server** receives bid requests and must respond within 100ms or lose the auction.`,

  whyItMatters: 'RTB powers most digital advertising. Google, Facebook, Amazon all use RTB. Billions of auctions happen daily, and speed is everything - late bids are worthless.',

  realWorldExample: {
    company: 'Google Ad Exchange',
    scenario: 'Handling 10+ million bid requests per second globally',
    howTheyDoIt: 'Distributed cache clusters in every region, with < 50ms p99 latency. Cache hit rate > 85% to meet latency requirements.',
  },

  keyPoints: [
    'RTB auctions happen in real-time (< 100ms total)',
    'Your bid server must respond instantly or lose revenue',
    'Late responses (> 100ms) are dropped by the ad exchange',
    'App Server = Bid Server (handles bid logic)',
  ],

  diagram: `
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   User       │──────▶│  Publisher   │──────▶│ Ad Exchange  │
│  (Browser)   │       │  (Website)   │       │              │
└──────────────┘       └──────────────┘       └──────┬───────┘
                                                     │
                                               Bid Request
                                                     │
                                                     ▼
                                            ┌──────────────┐
                                            │ Bid Server   │
                                            │ (Your Code)  │
                                            └──────────────┘
`,

  quickCheck: {
    question: 'What happens if your bid response takes 150ms?',
    options: [
      'The ad exchange waits for your response',
      'Your bid is automatically reduced by 50%',
      'Your bid is dropped and you lose the auction',
      'The auction is cancelled',
    ],
    correctIndex: 2,
    explanation: 'Ad exchanges have strict latency limits (typically 100ms). Late responses are dropped - you miss the auction entirely.',
  },
};

const step1: GuidedStep = {
  id: 'rtb-ad-cache-step-1',
  stepNumber: 1,
  frIndex: 0,
  story: step1Story,
  celebration: step1Celebration,
  learnPhase: step1LearnPhase,
  practicePhase: {
    frText: 'Ad exchanges can send bid requests to your system',
    taskDescription: 'Add Client (Ad Exchange) and App Server (Bid Server), then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents Ad Exchange sending bid requests', displayName: 'Ad Exchange' },
      { type: 'app_server', reason: 'Processes bid requests', displayName: 'Bid Server' },
    ],
    connectionsNeeded: [
      { from: 'Ad Exchange', to: 'Bid Server', reason: 'Ad Exchange sends bid requests' },
    ],
    successCriteria: ['Add Client', 'Add App Server', 'Connect Client → App Server'],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },
  hints: {
    level1: 'Add Client (Ad Exchange) and App Server (Bid Server), then connect them',
    level2: 'Drag Client and App Server from sidebar, then connect Client → App Server',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Basic Bid Response Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your Bid Server is connected, but it's empty - it doesn't know how to respond to bid requests.",
  hook: "Ad exchanges are sending requests, but you're returning errors. You need to implement the bidding logic!",
  challenge: "Write Python code to handle bid requests and return bid responses. Start simple - even hardcoded bids work for now!",
  illustration: 'coding',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: "Bidding works!",
  achievement: "Your server can now respond to bid requests with ad bids",
  metrics: [
    { label: 'Bid response logic', after: 'Implemented' },
    { label: 'Can win auctions', after: '✓' },
  ],
  nextTeaser: "But every bid takes 500ms to compute... you're losing most auctions!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Bid Response Logic',
  conceptExplanation: `Your Bid Server needs to handle bid requests. A typical flow:

**Input (Bid Request)**:
- User context: geo, device, demographics
- Page context: URL, category, keywords
- Ad slot: size, position, format

**Processing**:
1. Parse targeting attributes
2. Find matching campaigns
3. Compute bid price (based on targeting, competition, budget)
4. Generate bid response

**Output (Bid Response)**:
- Bid price (CPM in dollars)
- Ad creative ID
- Click-through URL
- Impression tracking pixels

For now, implement a simple hardcoded response. We'll add caching next!`,

  whyItMatters: 'Without bid logic, you can\'t participate in auctions. Even a simple response is better than nothing - you can optimize later.',

  keyPoints: [
    'Parse bid request to extract targeting attributes',
    'Compute bid price (can be hardcoded initially)',
    'Return bid response with price + creative metadata',
    'Later: add caching to speed this up from 500ms to < 20ms',
  ],

  diagram: `
Bid Request → ┌──────────────────┐ → Bid Response
              │  Bid Server      │
              │                  │
              │ 1. Parse request │
              │ 2. Match campaign│
              │ 3. Compute price │
              │ 4. Return bid    │
              └──────────────────┘
`,

  quickCheck: {
    question: 'What must every bid response include?',
    options: [
      'Just the bid price',
      'Bid price and ad creative metadata',
      'Only the ad creative image',
      'User targeting data',
    ],
    correctIndex: 1,
    explanation: 'Bid responses must include both bid price (how much you\'re willing to pay) and ad creative metadata (what ad to show).',
  },
};

const step2: GuidedStep = {
  id: 'rtb-ad-cache-step-2',
  stepNumber: 2,
  frIndex: 0,
  story: step2Story,
  celebration: step2Celebration,
  learnPhase: step2LearnPhase,
  practicePhase: {
    frText: 'Bid Server must handle bid requests and return responses',
    taskDescription: 'Configure APIs on Bid Server and implement Python handlers for bid requests',
    componentsNeeded: [
      { type: 'client', reason: 'Already added in Step 1', displayName: 'Ad Exchange' },
      { type: 'app_server', reason: 'Configure APIs and write Python code', displayName: 'Bid Server' },
    ],
    connectionsNeeded: [
      { from: 'Ad Exchange', to: 'Bid Server', reason: 'Already connected in Step 1' },
    ],
    successCriteria: [
      'Assign POST /api/v1/bid API to Bid Server',
      'Implement Python handler to parse bid request and return bid response',
    ],
  },
  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },
  hints: {
    level1: 'Click Bid Server to configure APIs, then write Python code to handle bid requests',
    level2: 'Assign POST /api/v1/bid API, then implement handle_bid_request() in Python',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Cache for Fast Bid Responses
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "Your bidding logic works, but it's slow. Every bid takes 500ms to compute.",
  hook: "The ad exchange timeout is 100ms. You're losing 95% of auctions because your responses arrive too late!",
  challenge: "Add a Cache to store pre-computed bid responses. Serve cached bids in < 20ms instead of computing them every time.",
  illustration: 'slow-turtle',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: "Bids are now lightning fast!",
  achievement: "Cache hits serve bids in < 20ms, winning more auctions",
  metrics: [
    { label: 'Bid latency', before: '500ms', after: '15ms (cached)' },
    { label: 'Auctions won', before: '5%', after: '80%' },
    { label: 'Cache hit rate', after: '75%' },
  ],
  nextTeaser: "Great! But how do we decide what to cache?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Caching for Sub-100ms Latency',
  conceptExplanation: `**The Problem**: Computing bids is slow (100-500ms):
- Query user profile database
- Match targeting rules
- Run ML model for bid optimization
- Check budget constraints

**The Solution**: Pre-compute and cache bid responses!

**Cache Key Design** (critical for RTB):
\`\`\`
geo:US-NY|device:mobile|age:25-34|category:sports → bid_response
\`\`\`

When a bid request comes in:
1. Extract targeting attributes (geo, device, age, category)
2. Build cache key
3. **Cache HIT**: Return cached bid (< 20ms)
4. **Cache MISS**: Compute bid, store in cache, return (100ms)

**Cache hit flow**:
- Redis lookup: 2-5ms
- Deserialize bid response: 2-3ms
- Budget validation: 5-10ms
- Total: ~15-20ms ✓

**Cache miss flow**:
- Compute bid: 50-100ms
- Store in cache: 2-5ms
- Return response: ~100ms (still acceptable)`,

  whyItMatters: 'In RTB, speed = money. A 50ms improvement means winning 50% more auctions. At scale, that\'s millions in revenue.',

  realWorldExample: {
    company: 'Criteo (RTB platform)',
    scenario: 'Serving 400K bid requests per second',
    howTheyDoIt: 'Redis cluster with 90%+ cache hit rate. Cache TTL = 5 minutes. Pre-warming cache for popular targeting combinations.',
  },

  famousIncident: {
    title: 'Ad Network Lost $2M in One Day',
    company: 'Anonymous RTB Provider',
    year: '2019',
    whatHappened: 'Their Redis cache cluster went down for 4 hours. Without cache, bid responses took 200-500ms. They missed 95% of auctions. Lost $2M in revenue in a single day.',
    lessonLearned: 'Cache is not optional in RTB - it\'s the core infrastructure. Always have cache redundancy (replicas) and fallback strategies.',
    icon: '💸',
  },

  keyPoints: [
    'Cache key = targeting attributes (geo + device + demographics + context)',
    'Cache hit rate 75-90% typical for well-designed keys',
    'TTL: 1-5 minutes (balance freshness vs hit rate)',
    'Redis is the standard choice (in-memory, sub-millisecond lookups)',
  ],

  diagram: `
Bid Request
    │
    ▼
┌─────────────────────┐
│  Parse Targeting    │
│  geo, device, demo  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Build Cache Key    │
│  "US-NY|mobile|..."│
└──────┬──────────────┘
       │
       ▼
    ┌──────┐
    │Cache?│
    └──┬───┘
       │
   ┌───┴────┐
   │        │
  HIT      MISS
   │        │
   ▼        ▼
Return  Compute Bid
15ms    100ms
`,

  quickCheck: {
    question: 'Why is cache key design critical in RTB?',
    options: [
      'To save memory',
      'To match bids to the right targeting attributes',
      'To reduce network traffic',
      'To prevent fraud',
    ],
    correctIndex: 1,
    explanation: 'Cache keys must include targeting attributes (geo, device, demographics) so you serve the right bid for the right user. Wrong targeting = wasted ad spend.',
  },
};

const step3: GuidedStep = {
  id: 'rtb-ad-cache-step-3',
  stepNumber: 3,
  frIndex: 1,
  story: step3Story,
  celebration: step3Celebration,
  learnPhase: step3LearnPhase,
  practicePhase: {
    frText: 'Bid responses must be served in < 20ms via cache',
    taskDescription: 'Add Cache (Redis) and connect it to Bid Server for fast lookups',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Ad Exchange' },
      { type: 'app_server', reason: 'Already added', displayName: 'Bid Server' },
      { type: 'cache', reason: 'Stores pre-computed bid responses', displayName: 'Redis Cache' },
    ],
    connectionsNeeded: [
      { from: 'Ad Exchange', to: 'Bid Server', reason: 'Already connected' },
      { from: 'Bid Server', to: 'Redis Cache', reason: 'Server checks cache before computing bids' },
    ],
    successCriteria: ['Add Cache', 'Connect Bid Server → Cache', 'Cache serves bids in < 20ms'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },
  hints: {
    level1: 'Add a Cache component and connect Bid Server to Cache',
    level2: 'Add Redis Cache from sidebar, connect Bid Server → Cache',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 4: Add Database for Campaign & Targeting Data
// =============================================================================

const step4Story: StoryContent = {
  emoji: '📊',
  scenario: "Your cache is fast, but where does the bid data come from initially?",
  hook: "You need to store campaign data: targeting rules, bid prices, budgets, ad creatives. Cache only stores computed results - the source of truth must be a database.",
  challenge: "Add a Database to store campaign configuration and targeting data. The cache is just a fast lookup layer!",
  illustration: 'database',
};

const step4Celebration: CelebrationContent = {
  emoji: '💾',
  message: "Campaign data is now persistent!",
  achievement: "Targeting rules, budgets, and campaigns are stored durably",
  metrics: [
    { label: 'Data durability', after: 'Persisted in DB' },
    { label: 'Campaign management', after: 'Enabled' },
  ],
  nextTeaser: "But one server can't handle 100K QPS... we need to scale!",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Database for Campaign & Targeting Data',
  conceptExplanation: `**Cache vs Database** - understand the difference:

**Cache (Redis)**:
- Stores pre-computed bid responses
- Fast (1-5ms lookups)
- Volatile (data can be lost)
- TTL-based eviction (1-5 min)

**Database (PostgreSQL)**:
- Stores source data: campaigns, targeting rules, budgets
- Slower (10-50ms queries)
- Durable (survives restarts)
- Persistent (no automatic eviction)

**Data Flow**:
1. **Advertiser creates campaign** → Stored in Database
2. **Bid requests come in** → Check Cache first
3. **Cache miss** → Query Database, compute bid, store in Cache
4. **Cache hit** → Return cached bid (no DB query)

**What goes in the Database**:
- Campaigns: advertiser_id, name, budget, status
- Targeting rules: geo, device, demographics, keywords
- Ad creatives: creative_id, image_url, click_url
- Budget tracking: spend, remaining, pacing`,

  whyItMatters: 'Cache is fast but volatile. Database is the source of truth. You need both: DB for durability, Cache for speed.',

  realWorldExample: {
    company: 'The Trade Desk',
    scenario: 'Managing 500K+ active ad campaigns',
    howTheyDoIt: 'PostgreSQL for campaign configuration, Redis for bid responses. Campaign updates propagate to cache within 30 seconds.',
  },

  keyPoints: [
    'Database = source of truth for campaigns and targeting',
    'Cache = computed layer for speed',
    'On cache miss: query DB → compute bid → cache result',
    'Campaign updates: invalidate cache or wait for TTL expiry',
  ],

  diagram: `
┌──────────────────────────────────────────┐
│         Data Flow                        │
├──────────────────────────────────────────┤
│                                          │
│  Advertiser                              │
│      │                                   │
│      ▼                                   │
│  ┌────────────┐                          │
│  │  Database  │  ← Campaign config       │
│  │ (Postgres) │    Targeting rules       │
│  └─────┬──────┘    Budgets               │
│        │                                 │
│        │ Cache miss?                     │
│        ▼                                 │
│  ┌────────────┐                          │
│  │Bid Server  │                          │
│  └─────┬──────┘                          │
│        │                                 │
│        ▼                                 │
│  ┌────────────┐                          │
│  │   Cache    │  ← Pre-computed bids     │
│  │  (Redis)   │    Fast lookups          │
│  └────────────┘                          │
└──────────────────────────────────────────┘
`,

  quickCheck: {
    question: 'Why do you need both Database AND Cache?',
    options: [
      'Cache is backup for database failures',
      'Database for durability, Cache for speed',
      'They store the same data for redundancy',
      'Database is only for analytics',
    ],
    correctIndex: 1,
    explanation: 'Database stores source data durably (campaigns, rules). Cache stores computed results for speed. They serve different purposes.',
  },
};

const step4: GuidedStep = {
  id: 'rtb-ad-cache-step-4',
  stepNumber: 4,
  frIndex: 2,
  story: step4Story,
  celebration: step4Celebration,
  learnPhase: step4LearnPhase,
  practicePhase: {
    frText: 'Campaign and targeting data must be stored persistently',
    taskDescription: 'Add Database and connect it to Bid Server for campaign management',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Ad Exchange' },
      { type: 'app_server', reason: 'Already added', displayName: 'Bid Server' },
      { type: 'cache', reason: 'Already added', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Stores campaigns and targeting rules', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Ad Exchange', to: 'Bid Server', reason: 'Already connected' },
      { from: 'Bid Server', to: 'Redis Cache', reason: 'Already connected' },
      { from: 'Bid Server', to: 'Database', reason: 'Server queries campaign data on cache miss' },
    ],
    successCriteria: ['Add Database', 'Connect Bid Server → Database', 'Campaign data persists'],
  },
  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Database and connect it to Bid Server',
    level2: 'Add Database from sidebar, connect Bid Server → Database',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 5: Scale with Load Balancer for High QPS
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📈',
  scenario: "Success! Your ad network is growing. But traffic just spiked to 100K QPS.",
  hook: "Your single Bid Server is maxed out at 10K QPS. Requests are queuing, latency is spiking to 500ms. You're losing auctions again!",
  challenge: "Add a Load Balancer to distribute traffic across multiple Bid Servers. Scale horizontally!",
  illustration: 'traffic-spike',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: "Your system can now handle massive traffic!",
  achievement: "Horizontal scaling enables 100K+ QPS capacity",
  metrics: [
    { label: 'Capacity', before: '10K QPS', after: '100K+ QPS' },
    { label: 'Latency', before: '500ms', after: '15ms' },
    { label: 'Servers', before: '1', after: 'Auto-scaling' },
  ],
  nextTeaser: "Nice! But the cache is getting hammered...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling to 100K QPS with Load Balancing',
  conceptExplanation: `**The Problem**: One server can only handle ~10K QPS.

At 100K QPS, you need **10+ servers**.

**Load Balancer** distributes traffic across servers:
- **Round Robin**: Server 1 → Server 2 → Server 3 → repeat
- **Least Connections**: Send to least busy server
- **Sticky Sessions**: Same user → same server (not needed for stateless bid servers)

**For RTB, use Round Robin** because:
- Bid servers are stateless (no session affinity needed)
- Simple and fair distribution
- Works well with auto-scaling

**Architecture**:
- Load Balancer receives all 100K QPS
- Distributes evenly: 10K QPS per server (10 servers)
- Each server independently queries cache and database
- Shared cache (Redis cluster) serves all servers`,

  whyItMatters: 'RTB is high-QPS. You can\'t survive on one server. Load balancing + horizontal scaling is mandatory.',

  realWorldExample: {
    company: 'AppNexus (Xandr)',
    scenario: 'Handling 300K+ bid requests per second',
    howTheyDoIt: 'AWS Application Load Balancers distribute traffic across 100+ bid servers per region. Auto-scaling adds/removes servers based on CPU and QPS metrics.',
  },

  keyPoints: [
    'Horizontal scaling: more servers = more capacity',
    'Load balancer distributes traffic evenly',
    'Bid servers are stateless (easy to scale)',
    'Auto-scaling: add servers when QPS > threshold',
  ],

  diagram: `
                    ┌──────────────┐
              ┌────▶│ Bid Server 1 │────┐
              │     └──────────────┘    │
              │     ┌──────────────┐    │
┌────────┐    │     │ Bid Server 2 │    │    ┌────────┐
│ Ad     │───▶│  LB │              │────┼───▶│ Cache  │
│Exchange│    │     └──────────────┘    │    │(Redis) │
└────────┘    │     ┌──────────────┐    │    └────────┘
              │     │ Bid Server N │    │
              └────▶│              │────┘
                    └──────────────┘
`,

  quickCheck: {
    question: 'How many bid servers do you need to handle 100K QPS if each handles 10K QPS?',
    options: [
      '5 servers',
      '10 servers',
      '20 servers',
      '100 servers',
    ],
    correctIndex: 1,
    explanation: '100K QPS ÷ 10K QPS per server = 10 servers minimum. In practice, you\'d provision 12-15 for headroom.',
  },
};

const step5: GuidedStep = {
  id: 'rtb-ad-cache-step-5',
  stepNumber: 5,
  frIndex: 3,
  story: step5Story,
  celebration: step5Celebration,
  learnPhase: step5LearnPhase,
  practicePhase: {
    frText: 'System must handle 100K QPS with horizontal scaling',
    taskDescription: 'Add Load Balancer to distribute traffic across multiple Bid Servers',
    componentsNeeded: [
      { type: 'client', reason: 'Already added', displayName: 'Ad Exchange' },
      { type: 'load_balancer', reason: 'Distributes 100K QPS across servers', displayName: 'Load Balancer' },
      { type: 'app_server', reason: 'Already added', displayName: 'Bid Server' },
      { type: 'cache', reason: 'Already added', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Already added', displayName: 'Database' },
    ],
    connectionsNeeded: [
      { from: 'Ad Exchange', to: 'Load Balancer', reason: 'All traffic enters through LB' },
      { from: 'Load Balancer', to: 'Bid Server', reason: 'LB distributes to servers' },
      { from: 'Bid Server', to: 'Redis Cache', reason: 'Already connected' },
      { from: 'Bid Server', to: 'Database', reason: 'Already connected' },
    ],
    successCriteria: [
      'Add Load Balancer',
      'Connect Ad Exchange → LB → Bid Server',
      'System handles 100K QPS',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },
  hints: {
    level1: 'Add Load Balancer between Ad Exchange and Bid Server',
    level2: 'Add LB, change connection to: Ad Exchange → LB → Bid Server',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Configure Multiple Bid Server Instances
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔧',
  scenario: "You have a Load Balancer, but it's only sending traffic to ONE Bid Server.",
  hook: "The Load Balancer is ready to distribute, but you need multiple server instances to actually distribute the load!",
  challenge: "Configure your Bid Server to run multiple instances (10+) so the Load Balancer can distribute traffic.",
  illustration: 'horizontal-scaling',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚙️',
  message: "Horizontal scaling is complete!",
  achievement: "Multiple Bid Server instances handle traffic in parallel",
  metrics: [
    { label: 'Server instances', before: '1', after: '10+' },
    { label: 'QPS per server', after: '~10K' },
    { label: 'Total capacity', after: '100K+ QPS' },
  ],
  nextTeaser: "Awesome! But we need to make the cache and database resilient...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Multiple Server Instances for Horizontal Scaling',
  conceptExplanation: `**Stateless Servers** = Easy Horizontal Scaling

Bid Servers are **stateless**:
- No user sessions stored in memory
- All state is in Cache or Database
- Any server can handle any request

**Scaling Formula**:
\`\`\`
Servers Needed = Total QPS ÷ QPS per Server
100K QPS ÷ 10K per server = 10 servers
\`\`\`

**Auto-Scaling Rules**:
- **Scale Up**: When avg CPU > 70% or QPS > 8K per server
- **Scale Down**: When avg CPU < 30% and QPS < 5K per server
- **Min instances**: 3 (for redundancy)
- **Max instances**: 50 (cost control)

**Why 10+ servers**:
- Each handles 10K QPS comfortably
- If one fails, others absorb traffic
- Allows rolling deployments (update 1 server at a time)`,

  whyItMatters: 'One server is a single point of failure. Multiple instances provide capacity AND resilience.',

  realWorldExample: {
    company: 'MediaMath',
    scenario: 'Daily traffic swings from 50K to 200K QPS',
    howTheyDoIt: 'Auto-scaling groups with 5-20 servers. Scale up in 2 minutes during traffic spikes, scale down after 10 minutes of low traffic.',
  },

  keyPoints: [
    'Stateless servers enable easy horizontal scaling',
    'Configure 10+ instances for 100K QPS (10K per server)',
    'Auto-scaling adjusts instances based on load',
    'Always maintain 2-3x capacity headroom for bursts',
  ],

  diagram: `
Load Balancer
      │
      ├──────┬──────┬──────┬──────┬──────┐
      ▼      ▼      ▼      ▼      ▼      ▼
    Srv1   Srv2   Srv3  ...     Srv10
    10K    10K    10K           10K QPS
      │      │      │      │      │      │
      └──────┴──────┴──────┴──────┴──────┘
                    │
              ┌─────┴─────┐
              ▼           ▼
           Cache      Database
`,

  quickCheck: {
    question: 'Why are stateless servers easier to scale than stateful servers?',
    options: [
      'They use less memory',
      'They\'re faster',
      'Any server can handle any request (no session affinity)',
      'They don\'t need databases',
    ],
    correctIndex: 2,
    explanation: 'Stateless servers don\'t store user sessions in memory, so any request can go to any server. This makes load balancing and auto-scaling simple.',
  },
};

const step6: GuidedStep = {
  id: 'rtb-ad-cache-step-6',
  stepNumber: 6,
  frIndex: 4,
  story: step6Story,
  celebration: step6Celebration,
  learnPhase: step6LearnPhase,
  practicePhase: {
    frText: 'System must run multiple Bid Server instances for 100K QPS',
    taskDescription: 'Configure Bid Server to run 10+ instances',
    componentsNeeded: [
      { type: 'app_server', reason: 'Configure for multiple instances', displayName: 'Bid Server' },
    ],
    connectionsNeeded: [],
    successCriteria: [
      'Click Bid Server → Set instances to 10 or more',
      'Load Balancer distributes across all instances',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
  },
  hints: {
    level1: 'Click on Bid Server and increase instance count to 10+',
    level2: 'Open Bid Server inspector → Set instances to 10 (or higher)',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Cache Strategy and Database Replication
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🛡️',
  scenario: "Your system is fast and handles high QPS. But what if the cache or database crashes?",
  hook: "At 3 AM, the cache goes down. All 100K QPS hit the database directly. The database crashes. Your entire ad network is offline!",
  challenge: "Configure cache strategy (TTL, eviction) and add database replication for resilience.",
  illustration: 'server-crash',
};

const step7Celebration: CelebrationContent = {
  emoji: '🎉',
  message: "Your RTB Ad Cache is production-ready!",
  achievement: "Complete system with caching, scaling, and resilience",
  metrics: [
    { label: 'Latency', after: 'p99 < 20ms' },
    { label: 'Capacity', after: '100K QPS' },
    { label: 'Cache hit rate', after: '80%+' },
    { label: 'Availability', after: '99.9%' },
  ],
  nextTeaser: "Congratulations! You've built a production-grade RTB Ad Cache system!",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Strategy and Database Resilience',
  conceptExplanation: `**Cache Strategy Configuration**:

**1. TTL (Time-To-Live)**: 60-300 seconds
- Short enough: Bids stay competitive
- Long enough: High cache hit rate
- Typical: 5 minutes for most campaigns

**2. Eviction Policy**: LRU (Least Recently Used)
- Popular targeting combinations stay cached
- Unpopular combinations evicted automatically
- Prevents cache from filling with stale data

**3. Cache-Aside Pattern**:
- Check cache first
- On miss: query DB → compute bid → cache result
- On hit: return immediately (< 20ms)

**Database Replication** (for resilience):
- **Primary**: Handles all writes (new campaigns, budget updates)
- **Replicas**: Handle reads (queries on cache miss)
- **Failover**: If primary crashes, promote replica to primary

**Why Replication Matters in RTB**:
- Cache crashes → all traffic hits DB (100K QPS)
- Without replicas: single DB can't handle 100K reads
- With replicas: distribute reads across 3-5 replicas (20K each)`,

  whyItMatters: 'RTB systems have no tolerance for downtime. Cache failure must not crash the database. Database failure must not stop bidding.',

  famousIncident: {
    title: 'Major Ad Network 6-Hour Outage',
    company: 'Anonymous RTB Provider',
    year: '2020',
    whatHappened: 'Cache cluster crashed. All traffic hit the single database primary. Primary crashed under load. No replica was configured for automatic failover. Manual recovery took 6 hours. Lost $5M in revenue.',
    lessonLearned: 'Always configure database replication with automatic failover. Cache failures should degrade performance, not cause total outages.',
    icon: '💥',
  },

  keyPoints: [
    'Cache TTL: 1-5 minutes (balance freshness vs hit rate)',
    'Cache eviction: LRU (keeps popular bids cached)',
    'Database replication: 2+ replicas for read scaling',
    'Automatic failover: promote replica if primary fails',
  ],

  diagram: `
┌──────────────────────────────────────────┐
│     Cache + Database Resilience          │
├──────────────────────────────────────────┤
│                                          │
│           ┌────────────┐                 │
│           │   Cache    │                 │
│           │ TTL=5min   │                 │
│           │ Evict=LRU  │                 │
│           └─────┬──────┘                 │
│                 │                        │
│           Cache Miss?                    │
│                 │                        │
│                 ▼                        │
│           ┌────────────┐                 │
│           │  Primary   │ ← Writes        │
│           │  Database  │                 │
│           └─────┬──────┘                 │
│                 │                        │
│           Replicates                     │
│                 │                        │
│     ┌───────────┼───────────┐            │
│     ▼           ▼           ▼            │
│ ┌────────┐ ┌────────┐ ┌────────┐        │
│ │Replica1│ │Replica2│ │Replica3│        │
│ │ (Read) │ │ (Read) │ │ (Read) │        │
│ └────────┘ └────────┘ └────────┘        │
└──────────────────────────────────────────┘
`,

  quickCheck: {
    question: 'What is the ideal cache TTL for RTB bid responses?',
    options: [
      '1 second (always fresh)',
      '1-5 minutes (balance freshness and hit rate)',
      '1 hour (maximize hit rate)',
      '1 day (minimize DB load)',
    ],
    correctIndex: 1,
    explanation: '1-5 minutes is ideal: short enough to keep bids competitive, long enough to achieve 80%+ cache hit rate. Longer TTL = stale bids, shorter TTL = low hit rate.',
  },
};

const step7: GuidedStep = {
  id: 'rtb-ad-cache-step-7',
  stepNumber: 7,
  frIndex: 5,
  story: step7Story,
  celebration: step7Celebration,
  learnPhase: step7LearnPhase,
  practicePhase: {
    frText: 'System must have cache strategy and database resilience',
    taskDescription: 'Configure cache TTL/eviction and enable database replication',
    componentsNeeded: [
      { type: 'cache', reason: 'Configure strategy', displayName: 'Redis Cache' },
      { type: 'database', reason: 'Enable replication', displayName: 'Database' },
    ],
    connectionsNeeded: [],
    successCriteria: [
      'Configure cache: TTL=300s, eviction=LRU',
      'Enable database replication with 2+ replicas',
      'System is production-ready!',
    ],
  },
  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireMultipleAppInstances: true,
    requireCacheStrategy: true,
    requireDatabaseReplication: true,
  },
  hints: {
    level1: 'Configure cache strategy and enable database replication',
    level2: 'Click Cache → Set TTL and eviction policy. Click Database → Enable replication with 2+ replicas',
    solutionComponents: [{ type: 'client' }, { type: 'load_balancer' }, { type: 'app_server' }, { type: 'cache' }, { type: 'database' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// COMPLETE TUTORIAL
// =============================================================================

export const rtbAdCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'rtb-ad-cache-guided',
  problemTitle: 'Build RTB Ad Cache - Real-Time Bidding at Scale',
  description: 'Learn to build a production-grade ad cache for Real-Time Bidding with sub-100ms latency',
  difficulty: 'advanced',
  estimatedMinutes: 90,

  requirementsPhase: rtbAdCacheRequirementsPhase,

  totalSteps: 7,
  steps: [step1, step2, step3, step4, step5, step6, step7],

  finalExamTestCases: [
    {
      name: 'Basic Bid Response',
      type: 'functional',
      requirement: 'FR-1',
      description: 'System can respond to bid requests with valid bid responses.',
      traffic: { type: 'mixed', rps: 100, readRps: 100, writeRps: 0 },
      duration: 10,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'Cache Hit Performance',
      type: 'performance',
      requirement: 'FR-2',
      description: 'Cache hits serve bids within p99 < 20ms.',
      traffic: { type: 'read', rps: 1000, readRps: 1000 },
      duration: 30,
      passCriteria: { maxP99Latency: 20, maxErrorRate: 0.01 },
    },
    {
      name: 'Targeting Match Accuracy',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Bid responses match targeting criteria (geo, device, demographics).',
      traffic: { type: 'mixed', rps: 500, readRps: 500, writeRps: 0 },
      duration: 30,
      passCriteria: { maxErrorRate: 0.01 },
    },
    {
      name: 'NFR-P1: 100ms Latency Budget',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle 10K QPS with p99 latency < 100ms (including cache misses).',
      traffic: { type: 'read', rps: 10000, readRps: 10000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-S1: High QPS Scaling',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Scale to 100K QPS sustained traffic.',
      traffic: { type: 'read', rps: 100000, readRps: 100000 },
      duration: 60,
      passCriteria: { maxP99Latency: 100, maxErrorRate: 0.05 },
    },
    {
      name: 'NFR-R1: Cache Failure Resilience',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'System survives cache failure by falling back to database.',
      traffic: { type: 'read', rps: 5000, readRps: 5000 },
      duration: 90,
      failureInjection: { type: 'cache_crash', atSecond: 30, recoverySecond: 60 },
      passCriteria: { minAvailability: 0.95, maxP99Latency: 200, maxErrorRate: 0.1 },
    },
  ] as TestCase[],

  concepts: [
    'Real-Time Bidding (RTB)',
    'Sub-100ms latency requirements',
    'Cache key design with targeting attributes',
    'High-QPS caching (100K+ QPS)',
    'Cache-aside pattern',
    'Database replication for resilience',
  ],

  ddiaReferences: [
    'Chapter 1: Reliable, Scalable, and Maintainable Applications',
    'Chapter 5: Replication',
    'Chapter 7: Transactions (for bid deduplication)',
    'Chapter 12: The Future of Data Systems (real-time systems)',
  ],

  prerequisites: [
    'Understanding of HTTP APIs',
    'Basic caching concepts',
    'Database fundamentals',
    'Load balancing basics',
  ],
};

export function getRtbAdCacheGuidedTutorial(): GuidedTutorial {
  return rtbAdCacheGuidedTutorial;
}

/**
 * Helper to check if requirements phase is complete
 */
export function isRequirementsPhaseComplete(askedQuestionIds: string[]): boolean {
  const criticalIds = rtbAdCacheRequirementsPhase.criticalQuestionIds;
  const hasAllCritical = criticalIds.every(id => askedQuestionIds.includes(id));
  const hasEnoughQuestions = askedQuestionIds.length >= rtbAdCacheRequirementsPhase.minimumQuestionsRequired;
  return hasAllCritical && hasEnoughQuestions;
}
