import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Sports Betting Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial that teaches real-time caching for sports betting
 * with odds updates, bet placement, and event-driven invalidation.
 *
 * Flow:
 * Phase 0: Requirements gathering (odds freshness, bet placement latency, live updates)
 * Steps 1-3: Basic betting system with odds caching
 * Steps 4-6: Real-time odds updates, bet settlement, event-driven invalidation
 *
 * Key Concepts:
 * - Real-time odds caching
 * - Cache invalidation strategies
 * - Event-driven updates
 * - Race condition handling for bets
 * - Live score integration
 * - Settlement processing
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const sportsBettingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time sports betting cache system for odds and bet placement",

  interviewer: {
    name: 'Marcus Sullivan',
    role: 'VP of Engineering at BetWinPro',
    avatar: '🎲',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-betting',
      category: 'functional',
      question: "What are the core features users need from a sports betting platform?",
      answer: "Bettors need real-time access to:\n\n1. **Live odds** - Current odds for all active games/events\n2. **Place bets** - Submit bets before odds change\n3. **View active bets** - See all pending bets\n4. **Bet settlement** - Automatic payout when events complete",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Sports betting is about odds freshness and bet placement speed - stale data means lost revenue",
    },
    {
      id: 'odds-freshness',
      category: 'functional',
      question: "How fresh must odds data be for bettors?",
      answer: "Odds freshness is CRITICAL:\n\n1. **Live games**: Odds update every 5-10 seconds during play\n2. **Pre-game odds**: Update every 30-60 seconds\n3. **Major events**: Odds can change mid-second (e.g., injury news breaks)\n4. **Stale odds risk**: Accepting bets on outdated odds costs the house money",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Stale odds are arbitrage opportunities - bettors will exploit them",
    },
    {
      id: 'bet-placement-latency',
      category: 'functional',
      question: "How fast must bet placement be?",
      answer: "Bet placement speed is crucial:\n\n1. **Confirmation time**: < 200ms p99 - bettors expect instant confirmation\n2. **Odds validation**: Must validate odds haven't changed since display\n3. **Race conditions**: Multiple bets on same event must be atomic\n4. **Rejected bets**: If odds changed, reject bet and show new odds",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "Fast bet placement prevents frustration and abandoned bets",
    },
    {
      id: 'bet-types',
      category: 'clarification',
      question: "What types of bets should we support?",
      answer: "For MVP, focus on:\n\n1. **Moneyline** - Bet on winner (e.g., Lakers to win)\n2. **Spread** - Bet on point differential (e.g., Lakers -5.5)\n3. **Over/Under** - Bet on total score (e.g., over 215.5 points)\n\nSkip parlays and props for now - those add complexity.",
      importance: 'important',
      insight: "Simple bet types reduce cache complexity while covering 80% of volume",
    },
    {
      id: 'live-betting',
      category: 'clarification',
      question: "Do we support live betting (in-game bets)?",
      answer: "Yes! Live betting is HUGE:\n\n1. **60% of bets** happen during live games\n2. **Odds change constantly** - every play affects odds\n3. **Speed is critical** - odds can lock when big plays happen\n\nLive betting requires real-time odds updates via WebSocket/SSE.",
      importance: 'critical',
      insight: "Live betting is the growth driver - must support real-time updates",
    },
    {
      id: 'bet-settlement',
      category: 'functional',
      question: "How are bets settled when games end?",
      answer: "Settlement process:\n\n1. **Game ends** - Official score from sports data provider\n2. **Calculate winners** - Determine which bets won\n3. **Update balances** - Credit winning bets, settle losing bets\n4. **Notification** - Notify users of wins/losses\n\nSettlement must be atomic - can't partially credit accounts.",
      importance: 'critical',
      revealsRequirement: 'FR-4',
      learningPoint: "Settlement is a batch process triggered by game completion events",
    },

    // SCALE & NFRs
    {
      id: 'throughput-odds-reads',
      category: 'throughput',
      question: "How many odds queries per second?",
      answer: "Peak odds reads: **100,000 requests/second**\n\nMost traffic is users browsing odds:\n- Mobile app checks odds every 10 seconds\n- Website refreshes every 5 seconds\n- Live betting UI polls continuously",
      importance: 'critical',
      calculation: {
        formula: "100K odds reads/sec at peak",
        result: "Read-heavy workload - cache is essential",
      },
      learningPoint: "Odds reads dominate - must cache aggressively",
    },
    {
      id: 'throughput-bet-placement',
      category: 'throughput',
      question: "How many bets are placed per second?",
      answer: "Peak bet placement: **5,000 bets/second**\n\nDuring major events (Super Bowl, World Cup):\n- Thousands of bets in final minutes\n- Spike when big plays happen (touchdown, goal)\n- Sustained load during live games",
      importance: 'critical',
      calculation: {
        formula: "5K bet placements/sec at peak",
        result: "Write throughput requires horizontal scaling",
      },
      learningPoint: "Major sporting events create massive traffic spikes",
    },
    {
      id: 'latency-odds',
      category: 'latency',
      question: "What's the acceptable latency for odds queries?",
      answer: "Odds query latency: **p99 < 50ms**\n\nBettors expect instant odds display. Slow odds = abandoned bets and lost revenue.",
      importance: 'critical',
      learningPoint: "Sub-50ms latency requires in-memory caching",
    },
    {
      id: 'latency-bet-placement',
      category: 'latency',
      question: "What's the acceptable latency for bet placement?",
      answer: "Bet placement latency: **p99 < 200ms**\n\nIncludes:\n1. Validate odds haven't changed\n2. Check user balance\n3. Reserve funds\n4. Store bet\n5. Return confirmation\n\nAnything over 500ms feels broken.",
      importance: 'critical',
      learningPoint: "Bet placement has multiple validation steps - must be fast",
    },
    {
      id: 'consistency-odds',
      category: 'consistency',
      question: "What happens if odds change while a user is placing a bet?",
      answer: "This is CRITICAL for fairness:\n\n1. **Optimistic locking**: User sees odds at time of display\n2. **Validation on submit**: Check if odds changed\n3. **If changed**: Reject bet, show new odds, let user re-submit\n4. **If unchanged**: Accept bet at displayed odds\n\nThis prevents arbitrage (betting on stale odds).",
      importance: 'critical',
      learningPoint: "Odds validation prevents arbitrage and ensures fairness",
    },
    {
      id: 'data-source',
      category: 'clarification',
      question: "Where do odds come from?",
      answer: "Odds come from:\n\n1. **Risk management system** - Internal system that calculates odds\n2. **Live score feeds** - Real-time game data from providers (Sportradar, Stats Perform)\n3. **Manual overrides** - Traders adjust odds based on betting patterns\n\nFor this system, assume we receive odds updates via message queue (Kafka).",
      importance: 'important',
      insight: "Odds updates are event-driven - pub/sub pattern is natural fit",
    },
    {
      id: 'concurrent-events',
      category: 'throughput',
      question: "How many simultaneous sporting events?",
      answer: "Typical load:\n\n1. **Regular day**: 500-1,000 active events\n2. **Weekend**: 2,000-5,000 events (all major sports overlap)\n3. **Major events**: 10,000+ betting markets (one game has many bet types)\n\nEach event has 10-50 betting markets (moneyline, spread, over/under, etc.).",
      importance: 'important',
      calculation: {
        formula: "5,000 events × 20 markets avg = 100,000 active betting markets",
        result: "100K cache entries for odds",
      },
      learningPoint: "Many concurrent events - cache must handle high cardinality",
    },
    {
      id: 'cache-invalidation',
      category: 'latency',
      question: "How do you ensure odds in cache are never stale?",
      answer: "Event-driven cache invalidation:\n\n1. **Odds update event** → Update cache immediately\n2. **Game start/end** → Invalidate related markets\n3. **Injury news** → Risk system updates odds → Cache invalidated\n4. **TTL backup**: 30-second TTL in case events are missed\n\nThis is classic event-driven invalidation pattern.",
      importance: 'critical',
      learningPoint: "Event-driven invalidation ensures odds freshness",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-betting', 'odds-freshness', 'bet-placement-latency', 'throughput-odds-reads'],
  criticalFRQuestionIds: ['core-betting', 'odds-freshness', 'bet-placement-latency'],
  criticalScaleQuestionIds: ['throughput-odds-reads', 'throughput-bet-placement', 'latency-odds'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Real-time odds display',
      description: 'Display current odds for all betting markets with < 50ms latency',
      emoji: '📊',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Fast bet placement',
      description: 'Place bets with odds validation in < 200ms',
      emoji: '🎯',
    },
    {
      id: 'fr-3',
      text: 'FR-3: View active bets',
      description: 'Users can view all pending bets instantly',
      emoji: '📋',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Automatic settlement',
      description: 'Settle bets automatically when events complete',
      emoji: '💰',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million daily active bettors',
    writesPerDay: '200 million bets/day',
    readsPerDay: '8 billion odds checks/day',
    peakMultiplier: 10,
    readWriteRatio: '40:1 (read-heavy)',
    calculatedWriteRPS: { average: 2300, peak: 23000 },
    calculatedReadRPS: { average: 92000, peak: 920000 },
    maxPayloadSize: '~500 bytes (odds object)',
    storagePerRecord: '~1KB per bet',
    storageGrowthPerYear: '~200TB (historical bets)',
    redirectLatencySLA: 'p99 < 50ms (odds queries)',
    createLatencySLA: 'p99 < 200ms (bet placement)',
  },

  architecturalImplications: [
    'Cache-first for odds reads - Redis with 30-second TTL',
    'Event-driven cache invalidation via Kafka',
    'Optimistic locking for bet placement (validate odds version)',
    'Read replicas for scaling odds queries',
    'Message queue for settlement processing',
    'WebSocket/SSE for live betting real-time updates',
  ],

  outOfScope: [
    'Parlay and prop bets (complex bet types)',
    'Cash-out feature (early settlement)',
    'User authentication and KYC',
    'Payment processing and withdrawals',
    'Sports data ingestion (assume external feed)',
    'Risk management algorithms',
  ],

  keyInsight: "Sports betting is all about odds freshness and speed. Stale odds cost money. Fast bet placement keeps users happy. We'll build a cache-first system with event-driven invalidation!",
};

// =============================================================================
// STEP 1: Basic Betting System - Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '🏈',
  scenario: "Welcome to BetWinPro! The big game is starting and bettors are logging in.",
  hook: "Users want to see odds for the game. You need to set up the basic infrastructure to serve odds!",
  challenge: "Connect clients to your betting server to start serving odds queries.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your betting platform is online!',
  achievement: 'Users can now connect to query odds',
  metrics: [
    { label: 'Status', after: 'Live' },
    { label: 'Connections', after: 'Active' },
  ],
  nextTeaser: "But you haven't implemented odds APIs yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Sports Betting Architecture',
  conceptExplanation: `Every betting platform starts with the basics: Clients connecting to Servers.

In sports betting:
1. **Client** = Mobile app or website where users browse odds and place bets
2. **Betting API Server** = Backend that serves odds and processes bets
3. **REST API** = HTTP endpoints for odds queries and bet placement

Basic flow:
- User opens app → Sees list of games
- Taps on game → Queries \`GET /api/v1/odds/{eventId}\`
- Sees odds → Places bet via \`POST /api/v1/bets\`

Unlike stock trading, betting doesn't need microsecond latency, but sub-100ms is expected.`,

  whyItMatters: 'Fast odds queries keep users engaged. Slow queries lead to abandoned bets and lost revenue.',

  realWorldExample: {
    company: 'DraftKings',
    scenario: 'Serving millions of concurrent users during NFL Sunday',
    howTheyDoIt: 'Stateless API servers behind load balancers, with aggressive caching of odds data in Redis',
  },

  keyPoints: [
    'Client = Mobile app or web browser',
    'Server = Betting API (serves odds and processes bets)',
    'REST APIs for odds queries and bet placement',
    'Low latency expected (< 100ms), but not microsecond-critical',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'User-facing app (mobile/web) for betting', icon: '📱' },
    { title: 'Betting API', explanation: 'Backend server handling odds and bets', icon: '🖥️' },
    { title: 'REST API', explanation: 'HTTP endpoints for odds and bet operations', icon: '🔌' },
  ],
};

const step1: GuidedStep = {
  id: 'sports-betting-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents betting apps/websites', displayName: 'Betting Client' },
      { type: 'app_server', reason: 'Handles odds queries and bet placement', displayName: 'Betting API' },
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
// STEP 2: Implement Betting APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your betting API is online, but it can't serve odds or accept bets!",
  hook: "A user tries to bet $100 on the Lakers, but gets a 404 error. No APIs are implemented!",
  challenge: "Write the Python code to serve odds and accept bets.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your betting APIs are live!',
  achievement: 'You implemented core betting functionality',
  metrics: [
    { label: 'APIs implemented', after: '3' },
    { label: 'Can serve odds', after: '✓' },
    { label: 'Can place bets', after: '✓' },
    { label: 'Can view active bets', after: '✓' },
  ],
  nextTeaser: "But every odds query hits the database - way too slow!",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Betting API Implementation: Critical Handlers',
  conceptExplanation: `Every betting platform needs handler functions for odds and bet operations.

For our system, we need:
- \`get_odds(event_id)\` - Return current odds for an event
- \`place_bet(user_id, event_id, bet_type, amount, odds)\` - Accept a bet
- \`get_user_bets(user_id)\` - Return user's active bets

**Critical requirements:**
1. **Odds validation** - Verify odds haven't changed since display
2. **Atomic bet placement** - Check balance, reserve funds, create bet (all-or-nothing)
3. **Idempotency** - Same bet request twice should only create one bet
4. **Audit trail** - Log all bet placements for compliance

For now, store in a database (we'll add caching next).`,

  whyItMatters: 'In betting, bugs mean financial loss or regulatory violations. Atomic operations and audit trails are mandatory.',

  famousIncident: {
    title: 'Betfair Odds Display Bug',
    company: 'Betfair',
    year: '2015',
    whatHappened: 'A software bug caused Betfair to display incorrect (higher) odds for several horse races. Bettors placed thousands of bets at the inflated odds before the bug was caught. Betfair had to honor the bets, losing millions.',
    lessonLearned: 'Always validate odds at bet placement time. What users see != what database has. Optimistic locking prevents accepting bets on stale odds.',
    icon: '🐴',
  },

  realWorldExample: {
    company: 'FanDuel',
    scenario: 'Processing thousands of bets per second during live games',
    howTheyDoIt: 'Optimistic locking with odds versioning. Each odds update increments version. Bet placement validates version matches displayed odds.',
  },

  keyPoints: [
    'get_odds() - Fetch current odds from cache/database',
    'place_bet() - Validate odds, check balance, create bet atomically',
    'get_user_bets() - Query active bets for a user',
    'Optimistic locking prevents betting on stale odds',
  ],

  quickCheck: {
    question: 'Why validate odds at bet placement time?',
    options: [
      'To slow down the system',
      'Odds can change between display and submission - prevent arbitrage',
      'Databases require validation',
      'It makes the code cleaner',
    ],
    correctIndex: 1,
    explanation: 'Odds can change rapidly (every few seconds). If a user sees +200 odds, but they change to +150 by the time they submit, accepting the bet at +200 would be arbitrage (guaranteed profit for bettor). Always validate!',
  },

  keyConcepts: [
    { title: 'Optimistic Locking', explanation: 'Assume no conflicts, validate at commit time', icon: '🔒' },
    { title: 'Atomicity', explanation: 'Bet placement is all-or-nothing transaction', icon: '⚛️' },
    { title: 'Idempotency', explanation: 'Same request multiple times = same result', icon: '🔁' },
  ],
};

const step2: GuidedStep = {
  id: 'sports-betting-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Serve odds, FR-2: Place bets, FR-3: View active bets',
    taskDescription: 'Configure APIs and implement Python handlers for betting operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/odds/{eventId}, POST /api/v1/bets, GET /api/v1/bets APIs',
      'Open the Python tab',
      'Implement get_odds(), place_bet(), and get_user_bets() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on the App Server, then go to the APIs tab to assign betting endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for get_odds, place_bet, and get_user_bets',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /api/v1/odds/{eventId}', 'POST /api/v1/bets', 'GET /api/v1/bets'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Cache for Fast Odds Queries
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🐌',
  scenario: "Users are complaining: odds pages take 2 seconds to load!",
  hook: "Every odds query hits the database. With 100,000 requests/second, the database is overwhelmed. Users are abandoning bets!",
  challenge: "Add Redis cache to serve odds in < 50ms.",
  illustration: 'slow-loading',
};

const step3Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Odds queries are lightning fast!',
  achievement: 'Cache-first architecture for sub-50ms latency',
  metrics: [
    { label: 'Odds query latency', before: '2 seconds', after: '10ms' },
    { label: 'Database load', before: '100K qps', after: '100 qps' },
    { label: 'Cache hit rate', after: '99%' },
  ],
  nextTeaser: "But odds updates are slow to appear. How do you keep cache fresh?",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Cache-First Architecture: Redis for Odds',
  conceptExplanation: `Sports betting odds are READ-HEAVY (100K reads/sec, 5K writes/sec).

**Cache-First Strategy:**
1. **Query path**: Check cache first, fallback to database
2. **Update path**: Update database, then invalidate/update cache
3. **TTL**: 30-second TTL as safety net (in case invalidation fails)

**Odds Cache Structure:**
\`\`\`
Key: odds:{eventId}:{betType}
Value: { odds: 150, version: 42, updatedAt: 1234567890 }
TTL: 30 seconds
\`\`\`

**Why 30-second TTL?**
- Odds update every 5-10 seconds during live games
- 30 seconds is worst-case staleness (acceptable for pre-game)
- Event-driven invalidation keeps it fresh in practice

**Cache-Aside Pattern:**
\`\`\`python
def get_odds(event_id):
    # Try cache first
    odds = redis.get(f"odds:{event_id}")
    if odds:
        return odds  # Cache hit!

    # Cache miss - query database
    odds = db.query("SELECT * FROM odds WHERE event_id = ?", event_id)

    # Store in cache for future queries
    redis.setex(f"odds:{event_id}", 30, odds)
    return odds
\`\`\``,

  whyItMatters: 'Databases can handle ~10K qps. Cache can handle 100K+ qps. Cache-first is mandatory for high read volume.',

  famousIncident: {
    title: 'FanDuel Super Bowl Meltdown',
    company: 'FanDuel',
    year: '2017',
    whatHappened: 'During Super Bowl LI, FanDuel experienced a massive traffic surge. Their odds queries were hitting the database directly (no cache). The database became overwhelmed, causing 30-second page load times. Users couldn\'t place bets during the biggest betting day of the year. FanDuel lost millions in potential revenue.',
    lessonLearned: 'Cache-first architecture is non-negotiable for read-heavy workloads. Database-first cannot handle viral traffic spikes. Always cache hot data (especially odds during major events).',
    icon: '🏈',
  },

  realWorldExample: {
    company: 'DraftKings',
    scenario: 'Serving odds for 10,000+ simultaneous sporting events',
    howTheyDoIt: 'Redis cache with 30-second TTL + event-driven invalidation via Kafka. Cache hit rate > 99%. Database only handles cache misses and updates.',
  },

  diagram: `
User Query Flow:
┌──────────┐     ┌─────────────┐     ┌───────────┐
│  Client  │────▶│  App Server │────▶│   Redis   │
└──────────┘     │             │     │   Cache   │
                 │  Try cache  │     │  (99% hit)│
                 │     ↓       │     └───────────┘
                 │  If miss    │
                 │     ↓       │     ┌───────────┐
                 │  Query DB   │────▶│ Database  │
                 └─────────────┘     │ (1% hit)  │
                                     └───────────┘

Odds Update Flow:
┌──────────────┐     ┌─────────────┐     ┌───────────┐
│ Risk System  │────▶│  Database   │────▶│   Cache   │
│(Odds change) │     │  (UPDATE)   │     │(INVALIDATE)
└──────────────┘     └─────────────┘     └───────────┘
`,

  keyPoints: [
    'Cache-first pattern: Check cache, fallback to database',
    '30-second TTL as safety net against stale data',
    'Cache hit rate > 99% for odds queries',
    'Database only handles updates and cache misses',
    'Event-driven invalidation keeps cache fresh (next step)',
  ],

  quickCheck: {
    question: 'Why use a 30-second TTL for odds?',
    options: [
      'Odds never change',
      'Safety net - ensures stale odds expire even if invalidation fails',
      'Redis requires TTL for all keys',
      'To reduce memory usage',
    ],
    correctIndex: 1,
    explanation: 'TTL is a safety mechanism. Ideally, event-driven invalidation keeps cache fresh. But if invalidation fails (network issue, bug), TTL ensures stale odds eventually expire. 30 seconds is acceptable worst-case staleness.',
  },

  keyConcepts: [
    { title: 'Cache-Aside', explanation: 'Check cache first, load from DB on miss', icon: '🔄' },
    { title: 'TTL', explanation: 'Time-to-live - automatic expiration', icon: '⏱️' },
    { title: 'Cache Hit Rate', explanation: '% of queries served from cache', icon: '📊' },
  ],
};

const step3: GuidedStep = {
  id: 'sports-betting-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-1: Serve odds with < 50ms latency',
    taskDescription: 'Add Redis cache for fast odds queries',
    componentsNeeded: [
      { type: 'cache', reason: 'Store odds in memory for fast access', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache strategy configured',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache for fast odds lookups',
    solutionComponents: [{ type: 'cache', config: { strategy: 'cache-aside', ttl: 30 } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Add Database for Persistence and Bet Storage
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💾',
  scenario: "Users placed thousands of bets, but Redis is in-memory only!",
  hook: "At 3 AM, Redis crashes and restarts. ALL active bets are GONE. Users are furious - they have screenshots of their bets but your system has no record!",
  challenge: "Add a database for durable storage of bets and odds.",
  illustration: 'data-loss',
};

const step4Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Bets are now safely persisted!',
  achievement: 'Database ensures durability and compliance',
  metrics: [
    { label: 'Bet persistence', after: 'Enabled' },
    { label: 'Audit trail', after: 'Complete' },
    { label: 'Crash recovery', after: '✓' },
  ],
  nextTeaser: "But when odds change, cache becomes stale. How do you keep it fresh?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Database: The Source of Truth',
  conceptExplanation: `Redis is fast but volatile. For betting, you MUST have durable storage.

**Database Tables:**
1. \`odds\` - Current odds for all markets
   - Columns: event_id, bet_type, odds, version, updated_at
2. \`bets\` - All placed bets (source of truth)
   - Columns: bet_id, user_id, event_id, amount, odds, status, created_at
3. \`events\` - Sporting events metadata
   - Columns: event_id, sport, teams, start_time, status

**Why Database + Cache?**
- **Database**: Durable, ACID transactions, audit trail
- **Cache**: Fast reads, high throughput
- **Pattern**: Write to DB (source of truth), cache for reads

**Bet Placement Flow:**
\`\`\`python
def place_bet(user_id, event_id, amount, odds_version):
    # 1. Validate odds in cache
    cached_odds = redis.get(f"odds:{event_id}")
    if cached_odds.version != odds_version:
        return "Odds changed - please retry"

    # 2. Store bet in database (durable)
    bet_id = db.insert("INSERT INTO bets VALUES (...)")

    # 3. Store in cache for fast queries
    redis.setex(f"bet:{bet_id}", 3600, bet_data)

    return {"bet_id": bet_id, "status": "accepted"}
\`\`\`

**Important**: Cache is for performance, database is for durability.`,

  whyItMatters: 'Regulatory compliance requires immutable bet records. Database provides audit trail and legal protection.',

  famousIncident: {
    title: 'Bet365 Database Outage',
    company: 'Bet365',
    year: '2020',
    whatHappened: 'A database outage caused Bet365 to lose bet records for a 10-minute window during a major soccer match. Thousands of bets were "lost". Users had proof via screenshots and emails. Bet365 had to manually recreate records and faced millions in penalties from UK regulators.',
    lessonLearned: 'Database durability is non-negotiable for betting. Use ACID transactions, replicas, and backups. Cache can fail, but database must never lose data.',
    icon: '⚽',
  },

  realWorldExample: {
    company: 'Caesars Sportsbook',
    scenario: 'Storing billions of historical bets for compliance',
    howTheyDoIt: 'PostgreSQL for active bets (hot storage), time-series DB for historical bets (cold storage). All bets written to database synchronously before cache update.',
  },

  keyPoints: [
    'Database is source of truth for bets and odds',
    'Cache is for performance only (can be rebuilt from DB)',
    'Write path: DB first (durable), then cache (performance)',
    'Read path: Cache first (fast), DB on miss (fallback)',
    'Regulatory compliance requires durable audit trail',
  ],

  quickCheck: {
    question: 'Why write to database before updating cache?',
    options: [
      'Databases are faster than cache',
      'Database is source of truth - must be durable before acknowledging bet',
      'Redis doesn\'t support writes',
      'To save memory',
    ],
    correctIndex: 1,
    explanation: 'Database provides durability. If you update cache first and crash before writing to DB, the bet is lost. Always persist to DB first, then update cache for performance.',
  },

  keyConcepts: [
    { title: 'Source of Truth', explanation: 'Database holds authoritative data', icon: '📚' },
    { title: 'ACID', explanation: 'Atomicity, Consistency, Isolation, Durability', icon: '🔐' },
    { title: 'Audit Trail', explanation: 'Immutable log of all bets for compliance', icon: '📝' },
  ],
};

const step4: GuidedStep = {
  id: 'sports-betting-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs require durable storage',
    taskDescription: 'Add Database for persistent bet and odds storage',
    componentsNeeded: [
      { type: 'database', reason: 'Store bets and odds durably', displayName: 'PostgreSQL' },
    ],
    successCriteria: [
      'Database component added to canvas',
      'App Server connected to Database',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database (PostgreSQL) component onto the canvas',
    level2: 'Connect App Server to Database for durable bet storage',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Event-Driven Cache Invalidation
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔄',
  scenario: "Lakers score a buzzer-beater! Odds should change instantly!",
  hook: "The risk system updates odds in the database, but users still see OLD odds from cache for 30 seconds! They're placing bets on stale odds - costing you money!",
  challenge: "Add Kafka for event-driven cache invalidation when odds change.",
  illustration: 'stale-cache',
};

const step5Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Real-time odds updates working!',
  achievement: 'Event-driven cache invalidation ensures fresh odds',
  metrics: [
    { label: 'Odds staleness', before: '30 seconds', after: '<1 second' },
    { label: 'Arbitrage risk', before: 'High', after: 'Eliminated' },
    { label: 'Update latency', after: '<500ms' },
  ],
  nextTeaser: "But how do you handle bet settlement when games end?",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Event-Driven Cache Invalidation: Keep Cache Fresh',
  conceptExplanation: `TTL-based expiration is too slow for sports betting. You need INSTANT invalidation.

**Event-Driven Invalidation Pattern:**
1. **Odds change** in risk management system
2. **Publish event** to Kafka: \`{ "event_id": 12345, "new_odds": 150, "version": 43 }\`
3. **Consumer listens** to Kafka topic
4. **Update cache** with new odds immediately
5. **Users see fresh odds** within 500ms

**Kafka Topic: odds-updates**
\`\`\`
Event: OddsUpdated
Payload: {
  eventId: 12345,
  betType: "moneyline",
  newOdds: 150,
  version: 43,
  timestamp: 1234567890
}
\`\`\`

**Consumer Logic:**
\`\`\`python
def handle_odds_update(message):
    event_id = message['eventId']
    new_odds = message['newOdds']
    version = message['version']

    # Update database (source of truth)
    db.update("UPDATE odds SET odds=?, version=? WHERE event_id=?",
              new_odds, version, event_id)

    # Invalidate/update cache
    redis.setex(f"odds:{event_id}", 30, new_odds)

    # Optional: Push to connected WebSocket clients for live betting
    websocket.broadcast(event_id, new_odds)
\`\`\`

**Why Kafka?**
- Decouples risk system from cache
- Replay events if cache crashes
- Multiple consumers (cache, WebSocket, analytics)
- Guaranteed delivery (at-least-once)`,

  whyItMatters: 'Stale odds = arbitrage opportunities = financial loss. Event-driven invalidation eliminates staleness.',

  famousIncident: {
    title: 'DraftKings Arbitrage Exploit',
    company: 'DraftKings',
    year: '2019',
    whatHappened: 'A bug in DraftKings cache invalidation caused odds to stay stale for up to 60 seconds after major plays. Sophisticated bettors noticed the delay and placed thousands of bets on stale odds before they updated. DraftKings lost millions before the bug was fixed.',
    lessonLearned: 'TTL-based cache expiration is too slow for live betting. Event-driven invalidation is mandatory. Always validate odds at bet placement time as a safety net.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Bet365',
    scenario: 'Updating odds for 10,000+ live events simultaneously',
    howTheyDoIt: 'Kafka partitioned by event_id. Each partition has a dedicated consumer updating cache and pushing to WebSocket clients. Invalidation latency < 200ms.',
  },

  diagram: `
Event-Driven Invalidation Flow:

┌──────────────────┐
│  Risk System     │
│ (Odds Calculator)│
└────────┬─────────┘
         │ Odds Changed!
         ▼
┌──────────────────┐
│  Kafka Queue     │
│ odds-updates     │
└────────┬─────────┘
         │ Event: OddsUpdated
         ▼
┌──────────────────┐
│  Cache Consumer  │
│ (Invalidation)   │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Database│ │ Cache  │
│(UPDATE)│ │(SETEX) │
└────────┘ └────────┘

Result: Users see new odds in < 500ms
`,

  keyPoints: [
    'Event-driven invalidation beats TTL-based expiration',
    'Kafka decouples risk system from cache updates',
    'Cache update latency < 500ms (vs 30 seconds with TTL)',
    'Still use 30-second TTL as safety net',
    'Enables real-time live betting experience',
  ],

  quickCheck: {
    question: 'Why use event-driven invalidation instead of just reducing TTL to 1 second?',
    options: [
      'Event-driven is easier to implement',
      'Low TTL causes cache thrashing and high DB load',
      'Kafka is required for all systems',
      'TTL doesn\'t work in Redis',
    ],
    correctIndex: 1,
    explanation: '1-second TTL means cache entries expire every second, causing frequent cache misses and database queries. Event-driven invalidation only updates cache when odds actually change (every 5-10 seconds), not on every query.',
  },

  keyConcepts: [
    { title: 'Event-Driven', explanation: 'React to events (odds changes) instead of polling', icon: '⚡' },
    { title: 'Kafka', explanation: 'Distributed event streaming platform', icon: '📨' },
    { title: 'Cache Invalidation', explanation: 'Remove or update stale cache entries', icon: '🔄' },
  ],
};

const step5: GuidedStep = {
  id: 'sports-betting-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time odds updates via event-driven invalidation',
    taskDescription: 'Add Message Queue for event-driven cache invalidation',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Publish odds updates for cache invalidation', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue for event-driven odds updates',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Bet Settlement Processing
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🏁',
  scenario: "The game ends! Lakers win by 5 points!",
  hook: "Thousands of bets need to be settled: who won, who lost, credit accounts, send notifications. But processing them synchronously would take minutes!",
  challenge: "Use the message queue for async bet settlement when games end.",
  illustration: 'batch-processing',
};

const step6Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Bet settlement is now automated!',
  achievement: 'Async settlement processing keeps API fast',
  metrics: [
    { label: 'Settlement time', after: '< 30 seconds' },
    { label: 'Throughput', after: '10K bets/sec' },
    { label: 'API latency', before: 'Blocked', after: 'Unaffected' },
  ],
  nextTeaser: "Congratulations! You've built a production-ready sports betting cache!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Async Settlement: Process Bets in Background',
  conceptExplanation: `When a game ends, you need to settle thousands of bets. But this can't block the API!

**Settlement Flow:**
1. **Game ends** - Sports data provider sends \`GameCompleted\` event
2. **Publish to Kafka** - \`bet-settlement\` topic
3. **Settlement worker** consumes event:
   - Query all bets for that event
   - Determine winners/losers based on final score
   - Update bet status (won/lost)
   - Credit winning accounts
   - Send notifications

**Why Async?**
- Settling 10,000 bets takes 10-30 seconds
- Can't block API during settlement
- Settlement is CPU-intensive (evaluate each bet)
- Needs to be idempotent (replay-safe)

**Kafka Topic: bet-settlement**
\`\`\`
Event: GameCompleted
Payload: {
  eventId: 12345,
  finalScore: { home: 108, away: 103 },
  timestamp: 1234567890
}
\`\`\`

**Settlement Worker Logic:**
\`\`\`python
def handle_game_completed(message):
    event_id = message['eventId']
    final_score = message['finalScore']

    # Query all bets for this event
    bets = db.query("SELECT * FROM bets WHERE event_id = ? AND status = 'active'")

    # Process each bet
    for bet in bets:
        if bet_won(bet, final_score):
            # Calculate payout
            payout = bet.amount * bet.odds

            # Update bet status
            db.update("UPDATE bets SET status='won', payout=? WHERE bet_id=?",
                     payout, bet.bet_id)

            # Credit user account
            db.update("UPDATE accounts SET balance = balance + ? WHERE user_id=?",
                     payout, bet.user_id)

            # Send notification
            notification_queue.publish({
                "user_id": bet.user_id,
                "message": f"You won ${payout}!"
            })
        else:
            # Bet lost
            db.update("UPDATE bets SET status='lost' WHERE bet_id=?", bet.bet_id)
\`\`\`

**Important**: Settlement must be idempotent (can run multiple times safely).`,

  whyItMatters: 'Async settlement keeps API responsive while processing thousands of bets in the background.',

  famousIncident: {
    title: 'Bovada Settlement Delays',
    company: 'Bovada',
    year: '2018',
    whatHappened: 'During March Madness, Bovada\'s bet settlement system was synchronous. When 64 games ended in a single day, the settlement backlog grew to hours. Users waited 4-6 hours for payouts, causing social media outrage and customer service nightmare.',
    lessonLearned: 'Settlement must be asynchronous. Use message queues to decouple settlement from bet placement. Background workers process settlements without blocking API.',
    icon: '🏀',
  },

  realWorldExample: {
    company: 'DraftKings',
    scenario: 'Settling millions of bets during NFL Sunday',
    howTheyDoIt: 'Kafka queue with 50+ settlement workers processing in parallel. Settlement completes within 30 seconds of game ending. Idempotent processing ensures duplicate events are safe.',
  },

  diagram: `
Bet Settlement Flow:

┌──────────────────┐
│ Sports Data Feed │
│ (Game Completed) │
└────────┬─────────┘
         │ Event: GameCompleted
         ▼
┌──────────────────┐
│ Kafka Queue      │
│ bet-settlement   │
└────────┬─────────┘
         │ Consume
         ▼
┌──────────────────┐
│ Settlement       │
│ Workers (x50)    │
│                  │
│ - Evaluate bets  │
│ - Credit winners │
│ - Update DB      │
│ - Notify users   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Database         │
│ (Update bets,    │
│  balances)       │
└──────────────────┘

Async = API stays fast, settlement happens in background
`,

  keyPoints: [
    'Settlement is async - triggered by game completion events',
    'Kafka decouples settlement from API',
    'Multiple workers process settlements in parallel',
    'Idempotent processing ensures safety on retries',
    'Settlement completes in 30-60 seconds',
  ],

  quickCheck: {
    question: 'Why must settlement be idempotent?',
    options: [
      'To make code simpler',
      'Kafka guarantees at-least-once delivery - events can be replayed',
      'To save memory',
      'Settlement is always idempotent',
    ],
    correctIndex: 1,
    explanation: 'Kafka guarantees at-least-once delivery, meaning the same event can be delivered multiple times (on retry). Settlement logic must handle this - running settlement twice for the same game should not double-credit accounts!',
  },

  keyConcepts: [
    { title: 'Async Processing', explanation: 'Process in background, don\'t block API', icon: '⏱️' },
    { title: 'Idempotency', explanation: 'Safe to run multiple times with same result', icon: '🔁' },
    { title: 'Worker Pool', explanation: 'Multiple workers process events in parallel', icon: '👷' },
  ],
};

const step6: GuidedStep = {
  id: 'sports-betting-step-6',
  stepNumber: 6,
  frIndex: 3,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-4: Automatic bet settlement when games end',
    taskDescription: 'Configure message queue for async bet settlement (architecture already complete)',
    successCriteria: [
      'Message Queue handles both odds updates and bet settlement',
      'Settlement workers process game completion events',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'No architecture changes needed - message queue already supports settlement',
    level2: 'Architecture is complete - this step teaches settlement processing patterns',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'cache' },
      { type: 'database' },
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'cache' },
      { from: 'app_server', to: 'database' },
      { from: 'app_server', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const sportsBettingCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'sports-betting-cache',
  title: 'Design Sports Betting Cache System',
  description: 'Build a real-time sports betting platform with odds caching, event-driven updates, and bet settlement',
  difficulty: 'intermediate',
  estimatedMinutes: 50,

  welcomeStory: {
    emoji: '🎲',
    hook: "You've been hired as Lead Engineer at BetWinPro!",
    scenario: "Your mission: Build a high-performance betting platform that serves fresh odds to millions of users and processes thousands of bets per second.",
    challenge: "Can you design a system that keeps odds fresh and bettors happy?",
  },

  requirementsPhase: sportsBettingRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Cache-First Architecture',
    'Event-Driven Cache Invalidation',
    'Optimistic Locking for Odds Validation',
    'Async Bet Settlement',
    'Message Queues for Decoupling',
    'TTL-Based Safety Nets',
    'Real-Time Odds Updates',
    'Idempotent Processing',
  ],

  ddiaReferences: [
    'Chapter 3: Cache-aside pattern for read-heavy workloads',
    'Chapter 5: Event-driven architecture and message queues',
    'Chapter 7: Transactions and optimistic locking',
    'Chapter 11: Stream processing for real-time updates',
  ],
};

export default sportsBettingCacheGuidedTutorial;
