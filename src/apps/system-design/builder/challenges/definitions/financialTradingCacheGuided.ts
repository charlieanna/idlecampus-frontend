import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Financial Trading Cache Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven 10-step tutorial that teaches ultra-low latency system design
 * while building a high-frequency trading cache for stock exchanges.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic working system (FR satisfaction)
 * Steps 4-10: Scale with NFRs (ultra-low latency, order book, HFT optimizations)
 *
 * Key Concepts:
 * - Ultra-low latency (<1ms p99)
 * - Market data distribution
 * - Order book management
 * - Lock-free data structures
 * - Colocation and network optimization
 * - High-frequency trading considerations
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const tradingCacheRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a low-latency cache for a stock exchange trading platform",

  interviewer: {
    name: 'Victoria Chen',
    role: 'Lead Architect at QuantTech Trading',
    avatar: '📊',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-market-data',
      category: 'functional',
      question: "What data needs to flow through this trading cache?",
      answer: "Traders need access to:\n\n1. **Real-time price quotes** - Current bid/ask prices for every stock\n2. **Order book data** - Top 10 levels of buy/sell orders\n3. **Trade execution confirmations** - Did my order get filled?\n4. **Market statistics** - Volume, VWAP, high/low prices",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3, FR-4',
      learningPoint: "Trading systems are about distributing market data with microsecond precision",
    },
    {
      id: 'order-placement',
      category: 'functional',
      question: "What operations do traders perform?",
      answer: "Traders need to:\n1. **Place orders** - Buy or sell at a specific price\n2. **Cancel orders** - Remove pending orders\n3. **Modify orders** - Change price or quantity\n4. **Query order status** - Check if order is filled/pending/cancelled",
      importance: 'critical',
      revealsRequirement: 'FR-5, FR-6',
      learningPoint: "Order operations must be atomic and guaranteed - money is on the line",
    },
    {
      id: 'market-data-types',
      category: 'clarification',
      question: "What types of securities should we support?",
      answer: "For MVP, focus on **equities (stocks)** only. We can add options, futures, and forex later. This keeps the order book logic simpler.",
      importance: 'critical',
      insight: "Different asset classes have different trading rules - start simple",
    },
    {
      id: 'historical-data',
      category: 'clarification',
      question: "Do traders need historical price data?",
      answer: "Yes, but that's a separate system. This cache focuses on **real-time data only** - the last second of price action. Historical analytics can query a different data warehouse.",
      importance: 'important',
      insight: "Separate hot path (real-time) from cold path (historical) for better performance",
    },
    {
      id: 'market-hours',
      category: 'clarification',
      question: "Does the system need to run 24/7 or only during market hours?",
      answer: "US markets trade 9:30 AM - 4:00 PM ET, but **pre-market and after-hours** trading happens too. Design for 16+ hours/day of active trading, with maintenance windows at night.",
      importance: 'important',
      insight: "Market hours affect capacity planning - extreme load during trading hours",
    },

    // SCALE & NFRs - LATENCY IS EVERYTHING
    {
      id: 'latency-critical',
      category: 'latency',
      question: "How fast must quote updates be delivered to traders?",
      answer: "This is **CRITICAL**: p99 latency must be under **1 millisecond** from exchange to trader's screen. In HFT, microseconds matter - a 10ms delay means losing trades to faster competitors.",
      importance: 'critical',
      learningPoint: "Sub-millisecond latency is THE defining requirement for trading systems",
    },
    {
      id: 'latency-order-ack',
      category: 'latency',
      question: "How fast should order acknowledgments be?",
      answer: "Order placement acknowledgment: **< 500 microseconds** p99. Every microsecond counts - HFT firms compete on nanoseconds.",
      importance: 'critical',
      calculation: {
        formula: "500 µs = 0.5 ms - faster than a single database query",
        result: "Must use in-memory cache, no disk I/O allowed",
      },
      learningPoint: "Normal database round-trips (5-10ms) are 10-20x too slow for trading",
    },
    {
      id: 'throughput-quotes',
      category: 'throughput',
      question: "How many price quote updates per second?",
      answer: "During peak trading (9:30-10:30 AM ET): **5 million quotes/second** across all stocks. Some volatile stocks like TSLA can generate 10,000+ quotes/second alone.",
      importance: 'critical',
      calculation: {
        formula: "5M quotes/sec × 100 bytes = 500 MB/sec bandwidth",
        result: "~500 MB/sec sustained throughput",
      },
      learningPoint: "Market data is a continuous firehose - must handle massive write throughput",
    },
    {
      id: 'throughput-orders',
      category: 'throughput',
      question: "How many order operations per second?",
      answer: "Peak order rate: **100,000 orders/second** (place, cancel, modify combined). HFT algorithms place and cancel orders within milliseconds.",
      importance: 'critical',
      learningPoint: "High cancel rate is normal in HFT - optimize for order book updates",
    },
    {
      id: 'consistency-orders',
      category: 'consistency',
      question: "What happens if two traders try to buy the last share simultaneously?",
      answer: "**Strict ordering is mandatory**! Orders must be processed in the exact sequence received (FIFO - First In First Out). Even 1 microsecond difference determines who gets the trade. Eventual consistency is illegal.",
      importance: 'critical',
      learningPoint: "Financial systems require strict serializability - no eventual consistency",
    },
    {
      id: 'data-loss-tolerance',
      category: 'reliability',
      question: "Can we ever lose market data or order confirmations?",
      answer: "**ZERO tolerance for data loss**. Every quote must be delivered. Every order confirmation must be stored. Losing data means regulatory violations and lawsuits.",
      importance: 'critical',
      insight: "Financial systems have zero error tolerance - different from web apps",
    },
    {
      id: 'concurrent-traders',
      category: 'throughput',
      question: "How many concurrent traders reading market data?",
      answer: "Peak: **50,000 concurrent trading sessions** all subscribing to real-time quotes. Each trader subscribes to 50-500 stocks on average.",
      importance: 'critical',
      calculation: {
        formula: "50K traders × 200 stocks avg = 10M subscriptions",
        result: "Must efficiently multicast data to thousands of subscribers",
      },
      learningPoint: "Pub/sub pattern essential - can't send individual updates to each trader",
    },
    {
      id: 'colocation',
      category: 'latency',
      question: "Where are the trading systems physically located?",
      answer: "For best performance, trading servers must be **colocated** - physically in the same data center as the exchange, ideally in the same rack. Network distance adds microseconds.",
      importance: 'critical',
      insight: "Physical proximity matters at microsecond scale - speed of light is the limit",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-market-data', 'latency-critical', 'throughput-quotes'],
  criticalFRQuestionIds: ['core-market-data', 'order-placement'],
  criticalScaleQuestionIds: ['latency-critical', 'latency-order-ack', 'throughput-quotes', 'consistency-orders'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Real-time price quotes',
      description: 'Stream current bid/ask prices for all stocks',
      emoji: '💹',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Order book display',
      description: 'Show top 10 levels of buy/sell orders',
      emoji: '📊',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Trade confirmations',
      description: 'Confirm order execution instantly',
      emoji: '✅',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Market statistics',
      description: 'Volume, VWAP, high/low prices',
      emoji: '📈',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Order placement',
      description: 'Submit buy/sell orders',
      emoji: '🎯',
    },
    {
      id: 'fr-6',
      text: 'FR-6: Order management',
      description: 'Cancel and modify pending orders',
      emoji: '⚙️',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '50,000 concurrent traders',
    writesPerDay: '10 billion quotes + 500 million orders',
    readsPerDay: '100 billion quote reads',
    peakMultiplier: 10,
    readWriteRatio: '10:1',
    calculatedWriteRPS: { average: 58000, peak: 580000 },
    calculatedReadRPS: { average: 580000, peak: 5800000 },
    maxPayloadSize: '~100 bytes (quote)',
    storagePerRecord: '~200 bytes (order)',
    storageGrowthPerYear: '~20TB',
    redirectLatencySLA: 'p99 < 1ms (quote delivery)',
    createLatencySLA: 'p99 < 500µs (order ack)',
  },

  architecturalImplications: [
    '✅ Sub-millisecond latency → In-memory cache ONLY, no disk I/O',
    '✅ 5M quotes/sec → Lock-free data structures required',
    '✅ Strict ordering → Single-threaded order processing per symbol',
    '✅ 10M subscriptions → Pub/sub with multicast',
    '✅ Zero data loss → Replicated cache with sync writes',
    '✅ Colocation → Minimize network hops, optimize TCP',
  ],

  outOfScope: [
    'Options and futures trading',
    'Multi-exchange aggregation',
    'Historical data warehouse',
    'Algorithmic trading logic',
    'Risk management systems',
    'Settlement and clearing',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system where traders can see quotes and place orders. The extreme latency requirements and HFT optimizations will come in later steps. Functionality first, then microsecond optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📈',
  scenario: "Welcome to QuantTech Trading! You've been hired to build a low-latency trading cache.",
  hook: "A trader just logged in. They want to see real-time stock prices!",
  challenge: "Set up the basic connection so traders can reach your trading server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your trading platform is online!',
  achievement: 'Traders can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Live' },
    { label: 'Accepting connections', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to handle market data yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Trading Architecture',
  conceptExplanation: `Every trading system starts with **Clients** (trader workstations) connecting to **Trading Servers**.

In financial markets:
1. **Trading Terminal** (Client) = Trader's workstation running order entry software
2. **Trading Gateway** (Server) = Your ultra-low latency server handling orders and quotes
3. **Binary Protocol** = Custom protocol optimized for speed (not HTTP/REST!)

Unlike web apps, trading systems use:
- Binary protocols (not JSON/HTTP) for speed
- Persistent TCP connections (not request/response)
- Direct memory access when possible`,

  whyItMatters: 'Connection latency adds up. Every millisecond in the network path costs money in lost trades.',

  realWorldExample: {
    company: 'NASDAQ',
    scenario: 'Handling 5 million quotes/second',
    howTheyDoIt: 'Uses custom binary protocols with kernel bypass (DPDK) to eliminate OS overhead and achieve sub-microsecond processing',
  },

  keyPoints: [
    'Client = Trading Terminal (trader workstation)',
    'Server = Trading Gateway (ultra-fast order/quote handler)',
    'Binary protocols are faster than HTTP/JSON',
    'Persistent connections reduce connection overhead',
  ],

  keyConcepts: [
    { title: 'Trading Terminal', explanation: 'Trader\'s workstation for viewing quotes and placing orders', icon: '💻' },
    { title: 'Trading Gateway', explanation: 'Ultra-low latency server processing orders', icon: '⚡' },
    { title: 'Binary Protocol', explanation: 'Compact data format for minimal latency', icon: '0️⃣' },
  ],
};

const step1: GuidedStep = {
  id: 'trading-cache-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up the foundation for all FRs',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents trading terminals', displayName: 'Trading Terminal' },
      { type: 'app_server', reason: 'Handles market data and orders', displayName: 'Trading Gateway' },
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
// STEP 2: Implement Market Data & Order APIs (Python Code)
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your trading gateway is connected, but it can't process any trades!",
  hook: "A trader tried to buy 100 shares of AAPL at $150 but got an error.",
  challenge: "Write the Python code to handle quotes and orders.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your trading APIs are live!',
  achievement: 'You implemented core trading functionality',
  metrics: [
    { label: 'APIs implemented', after: '4' },
    { label: 'Can stream quotes', after: '✓' },
    { label: 'Can place orders', after: '✓' },
    { label: 'Can view order book', after: '✓' },
  ],
  nextTeaser: "But if the server restarts, all order data is lost...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Trading API Implementation: Critical Handlers',
  conceptExplanation: `Every trading platform needs handler functions for market data and order operations.

For our trading cache, we need:
- \`stream_quotes()\` - Push real-time price updates to subscribers
- \`get_order_book()\` - Return top 10 bid/ask levels
- \`place_order()\` - Accept buy/sell orders
- \`cancel_order()\` - Remove pending orders

**Critical requirements:**
1. **Non-blocking I/O** - Can't block while streaming quotes
2. **Order atomicity** - Order placement must be all-or-nothing
3. **FIFO guarantee** - Process orders in exact received order
4. **Memory-only** - No disk I/O in the hot path

For now, store in Python dictionaries (in-memory).`,

  whyItMatters: 'In trading, bugs cost millions. A race condition means wrong fills. A blocked thread means missed opportunities.',

  famousIncident: {
    title: 'Knight Capital Trading Glitch',
    company: 'Knight Capital Group',
    year: '2012',
    whatHappened: 'A software bug in their trading system caused it to execute 4 million erroneous trades in 45 minutes. The firm lost $440 million in a single day and nearly went bankrupt.',
    lessonLearned: 'Trading systems must be rigorously tested. Bugs don\'t just cause downtime - they destroy companies.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Interactive Brokers',
    scenario: 'Processing 3 million trades per day',
    howTheyDoIt: 'Uses C++ with lock-free queues for order processing, achieving microsecond order acknowledgment times',
  },

  keyPoints: [
    'Each API needs a handler function',
    'Use in-memory storage for speed (database comes later)',
    'Guarantee FIFO order processing per symbol',
    'Never block the quote streaming thread',
  ],

  quickCheck: {
    question: 'Why must trading systems avoid disk I/O in the hot path?',
    options: [
      'Disks are expensive',
      'Disk I/O takes milliseconds - 1000x slower than our latency budget',
      'Disks can fail',
      'Regulations prohibit it',
    ],
    correctIndex: 1,
    explanation: 'SSDs: ~100µs latency. Spinning disks: ~10ms. Our budget: <500µs. Disk I/O would blow our entire latency budget.',
  },

  keyConcepts: [
    { title: 'Handler', explanation: 'Function that processes trading API requests', icon: '⚙️' },
    { title: 'FIFO', explanation: 'First In First Out - critical for fair order processing', icon: '📋' },
    { title: 'Hot Path', explanation: 'Code path that must be ultra-fast', icon: '🔥' },
  ],
};

const step2: GuidedStep = {
  id: 'trading-cache-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time quotes, FR-2: Order book, FR-5: Order placement',
    taskDescription: 'Configure APIs and implement Python handlers for trading operations',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /api/v1/orders, GET /api/v1/quotes, GET /api/v1/orderbook APIs',
      'Open the Python tab',
      'Implement place_order(), stream_quotes(), and get_order_book() functions',
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
    level1: 'Click on the App Server, then go to the APIs tab to assign trading endpoints',
    level2: 'After assigning APIs, switch to the Python tab. Implement the TODOs for place_order, stream_quotes, and get_order_book',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /api/v1/orders', 'GET /api/v1/quotes', 'GET /api/v1/orderbook'] } },
    ],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add In-Memory Cache (Redis) for Ultra-Low Latency
// =============================================================================

const step3Story: StoryContent = {
  emoji: '⚡',
  scenario: "Traders are complaining: quote delivery is 50ms - way too slow!",
  hook: "By the time quotes reach traders, prices have already moved. They're losing money on every trade.",
  challenge: "Add an in-memory cache to achieve sub-millisecond quote delivery.",
  illustration: 'slow-loading',
};

const step3Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Quotes are now delivered in <1ms!',
  achievement: 'In-memory cache enables ultra-low latency',
  metrics: [
    { label: 'Quote latency', before: '50ms', after: '<1ms' },
    { label: 'Order book latency', before: '30ms', after: '<500µs' },
    { label: 'Throughput', after: '5M quotes/sec' },
  ],
  nextTeaser: "But we have no persistence - if the cache crashes, all order data is lost...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'In-Memory Cache: The Speed of RAM',
  conceptExplanation: `In trading systems, **in-memory cache is the primary data store** for the hot path.

Why cache-first architecture?
- **RAM latency**: ~100 nanoseconds
- **SSD latency**: ~100 microseconds (1000x slower)
- **Network + DB**: ~10 milliseconds (100,000x slower)

For trading, we cache:
- **Current quotes** - Latest bid/ask for every stock
- **Order book** - Top 10 levels of buy/sell orders
- **Pending orders** - All active orders (keyed by order_id)
- **Position data** - What each trader owns

**Critical**: Use Redis with pipelining and pub/sub for:
1. Ultra-fast reads (<100µs)
2. Efficient quote broadcasting (pub/sub)
3. Atomic operations (MULTI/EXEC for order placement)`,

  whyItMatters: 'At microsecond scale, every layer of abstraction costs time. Cache becomes the source of truth for active trading.',

  famousIncident: {
    title: 'Flash Crash',
    company: 'US Stock Market',
    year: '2010',
    whatHappened: 'A combination of HFT algorithms reacting to each other within microseconds caused the Dow Jones to drop 1,000 points in minutes. Latency differences between traders amplified the crash.',
    lessonLearned: 'Ultra-low latency enables HFT but also creates systemic risks. Speed must be balanced with stability.',
    icon: '⚠️',
  },

  realWorldExample: {
    company: 'NYSE',
    scenario: 'Processing 5 billion quotes per day',
    howTheyDoIt: 'Uses in-memory grid computing with Hazelcast/Ignite for distributed caching, achieving single-digit microsecond latencies',
  },

  diagram: `
┌──────────────┐     ┌─────────────┐     ┌───────────┐
│Trading       │────▶│   Redis     │────▶│ Database  │
│Terminal      │     │   Cache     │     │(Backup)   │
└──────────────┘     │             │     └───────────┘
        ↑            │  <100µs     │
        │            │  latency    │
        │            └─────────────┘
        │
        └─── Pub/Sub: Quote broadcast to all subscribers
`,

  keyPoints: [
    'In-memory cache is PRIMARY store for active trading data',
    'Database is only for persistence and audit trail',
    'Use Redis pub/sub for efficient quote distribution',
    'TTL should be short (seconds) or infinite for active orders',
  ],

  quickCheck: {
    question: 'Why is in-memory cache critical for trading systems?',
    options: [
      'It\'s cheaper than databases',
      'RAM access is 1000x faster than SSD - needed for <1ms latency',
      'It uses less power',
      'It\'s easier to program',
    ],
    correctIndex: 1,
    explanation: 'Sub-millisecond latency is impossible with disk I/O. RAM is the only option for the trading hot path.',
  },

  keyConcepts: [
    { title: 'Hot Path', explanation: 'Critical code path requiring lowest latency', icon: '🔥' },
    { title: 'Pub/Sub', explanation: 'Publish/Subscribe pattern for broadcasting quotes', icon: '📡' },
    { title: 'Cache-First', explanation: 'Cache is primary store, DB is backup', icon: '🥇' },
  ],
};

const step3: GuidedStep = {
  id: 'trading-cache-step-3',
  stepNumber: 3,
  frIndex: 0,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'All FRs need ultra-low latency access',
    taskDescription: 'Add a Redis cache for sub-millisecond data access',
    componentsNeeded: [
      { type: 'cache', reason: 'Store quotes, order book, orders in RAM for <1ms latency', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Cache component added to canvas',
      'App Server connected to Cache',
      'Cache strategy set to write-through',
      'TTL configured appropriately',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireCacheStrategy: true,
  },

  hints: {
    level1: 'Drag a Cache (Redis) component onto the canvas',
    level2: 'Connect App Server to Cache. Set strategy to write-through for data safety.',
    solutionComponents: [{ type: 'cache', config: { strategy: 'write-through' } }],
    solutionConnections: [{ from: 'app_server', to: 'cache' }],
  },
};

// =============================================================================
// STEP 4: Add Database for Audit Trail & Persistence
// =============================================================================

const step4Story: StoryContent = {
  emoji: '💥',
  scenario: "DISASTER! Redis crashed at 2 PM and restarted...",
  hook: "When it came back, ALL pending orders were GONE! $50 million in open orders vanished. Regulators are investigating. Your job is on the line.",
  challenge: "Add a database for durable storage of all trading activity.",
  illustration: 'data-loss',
};

const step4Celebration: CelebrationContent = {
  emoji: '💾',
  message: 'Trading data is now durable!',
  achievement: 'All orders and trades are safely persisted',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Audit trail', after: 'Complete' },
    { label: 'Regulatory compliance', after: '✓' },
  ],
  nextTeaser: "But we still have a single point of failure in the cache...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Persistence: The Audit Trail Requirement',
  conceptExplanation: `For trading systems, durability is **legally mandated** by financial regulators.

A **database** provides:
- **Audit trail**: Immutable record of every order and trade
- **Disaster recovery**: Rebuild cache state after crashes
- **Regulatory compliance**: SEC/FINRA require 7+ years of data retention
- **Analytics**: Post-trade analysis and reporting

For trading, we need tables for:
- \`orders\` - All orders (placed, cancelled, filled)
- \`trades\` - All executed trades with timestamps
- \`quotes\` - Sampled market data (not every quote - too much!)
- \`positions\` - Current holdings per trader

**Critical**: Database writes happen **asynchronously** after cache update:
1. Update cache (fast, synchronous)
2. Return success to trader
3. Write to DB (slow, asynchronous)

This maintains low latency while ensuring durability.`,

  whyItMatters: 'Without durable storage:\n1. Can\'t prove what trades occurred\n2. Regulators will shut you down\n3. Can\'t recover from crashes\n4. Lawsuits when orders disappear',

  famousIncident: {
    title: 'Goldman Sachs Code Theft',
    company: 'Goldman Sachs',
    year: '2009',
    whatHappened: 'A programmer stole Goldman\'s HFT trading code. The case highlighted how critical it is to maintain audit logs of all system activity - both for security and compliance.',
    lessonLearned: 'Comprehensive logging and audit trails are mandatory for regulated trading systems.',
    icon: '🔒',
  },

  realWorldExample: {
    company: 'CME Group',
    scenario: 'Storing 3 billion transactions per day',
    howTheyDoIt: 'Uses TimeSeriesDB for tick data, PostgreSQL for transactional data, with async replication from cache to database',
  },

  diagram: `
Order Placed
     │
     ▼
┌─────────────┐  1. Sync write   ┌───────────┐
│   Redis     │◀────────────────▶│  App      │
│   Cache     │   (<500µs)       │  Server   │
└─────────────┘                  └─────┬─────┘
     │                                  │
     │                                  │ 2. Async write
     │                                  ▼  (background)
     │                           ┌───────────┐
     └──────────────────────────▶│ Database  │
        3. Background sync        │(Postgres) │
        (for disaster recovery)   └───────────┘
`,

  keyPoints: [
    'Database provides audit trail and disaster recovery',
    'Write to cache first (fast), then DB async (slow)',
    'Never block trading on database writes',
    'Use time-series DB for tick data (quotes)',
  ],

  quickCheck: {
    question: 'Why write to cache first, then database asynchronously?',
    options: [
      'Databases are unreliable',
      'Maintains sub-ms latency while ensuring eventual durability',
      'It\'s easier to program',
      'Caches are more accurate',
    ],
    correctIndex: 1,
    explanation: 'Synchronous DB writes would add 5-10ms latency. Async writes preserve speed while ensuring data is eventually persisted.',
  },

  keyConcepts: [
    { title: 'Audit Trail', explanation: 'Immutable log of all trading activity', icon: '📜' },
    { title: 'Async Write', explanation: 'Write to DB in background, don\'t block trader', icon: '⏱️' },
    { title: 'Compliance', explanation: 'Meeting regulatory requirements for data retention', icon: '⚖️' },
  ],
};

const step4: GuidedStep = {
  id: 'trading-cache-step-4',
  stepNumber: 4,
  frIndex: 0,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'All FRs require durable audit trail',
    taskDescription: 'Add a Database for persistent storage and regulatory compliance',
    componentsNeeded: [
      { type: 'database', reason: 'Store orders, trades, audit logs durably', displayName: 'PostgreSQL' },
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
    level2: 'Connect App Server to Database. Cache stays as primary, DB provides backup.',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 5: Add Load Balancer for High Availability
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🔥',
  scenario: "Market opens at 9:30 AM. Trading volume explodes 50x!",
  hook: "Your single trading gateway is maxed out. Traders are getting connection timeouts. Orders are being rejected!",
  challenge: "Add a load balancer to distribute traffic across multiple gateways.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🎛️',
  message: 'Trading traffic is now distributed!',
  achievement: 'Load balancer enables horizontal scaling',
  metrics: [
    { label: 'Single point of failure', before: 'Yes', after: 'No' },
    { label: 'Trading capacity', before: '10K orders/s', after: 'Ready to scale' },
  ],
  nextTeaser: "But we still only have one gateway instance...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Load Balancing: Distribute Trading Load',
  conceptExplanation: `A **Load Balancer** distributes incoming trading connections across multiple gateway servers.

For trading systems, load balancing has special requirements:
- **Session affinity (sticky)** - Same trader always goes to same gateway
  - Reason: Maintains order sequencing and position tracking
- **Health checks** - Detect failed gateways in <1 second
- **Weighted distribution** - Send more load to more powerful servers
- **Low latency** - Load balancer can't add >100µs latency

**Important**: Use L4 (TCP) load balancing, not L7 (HTTP):
- L4 is faster (fewer CPU cycles)
- L4 preserves connection state
- L7 terminates connections (adds latency)`,

  whyItMatters: 'At market open, trading volume spikes 50x in seconds. Without load balancing, the system collapses.',

  famousIncident: {
    title: 'BATS IPO Disaster',
    company: 'BATS Global Markets',
    year: '2012',
    whatHappened: 'On their IPO day, a software bug in BATS\' matching engine caused their own stock to crash from $16 to $0.04 in seconds. They had to cancel the IPO. The load balancer couldn\'t route around the bad server fast enough.',
    lessonLearned: 'Load balancers must detect and route around failures in milliseconds, not seconds.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Citadel Securities',
    scenario: 'Handling 26% of US equity volume',
    howTheyDoIt: 'Uses custom L4 load balancers with sub-100µs health checks and automatic failover',
  },

  diagram: `
                        ┌──────────────────┐
                        │  Trading Gateway │
                        │   Instance 1     │
┌──────────────┐       └──────────────────┘
│  Trading     │       ┌──────────────────┐
│  Terminals   │──────▶│  Load Balancer   │──────▶ Gateway 2
└──────────────┘       │   (L4 TCP)       │
                        └──────────────────┘       ┌──────────────────┐
                                                    │  Trading Gateway │
                                                    │   Instance 3     │
                                                    └──────────────────┘
`,

  keyPoints: [
    'Use L4 (TCP) load balancing for lowest latency',
    'Enable sticky sessions - same trader to same gateway',
    'Health checks must be <1 second for fast failover',
    'Load balancer itself can\'t add >100µs latency',
  ],

  quickCheck: {
    question: 'Why use sticky sessions for trading load balancers?',
    options: [
      'It\'s faster',
      'Maintains order sequencing and position state per trader',
      'It\'s easier to configure',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'If a trader\'s orders go to different gateways, order sequencing breaks and position tracking becomes inconsistent.',
  },

  keyConcepts: [
    { title: 'L4 Load Balancing', explanation: 'TCP layer - faster than HTTP', icon: '⚡' },
    { title: 'Sticky Sessions', explanation: 'Same client to same server', icon: '📌' },
    { title: 'Health Check', explanation: 'Detect failed servers quickly', icon: '💓' },
  ],
};

const step5: GuidedStep = {
  id: 'trading-cache-step-5',
  stepNumber: 5,
  frIndex: 0,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from load balancing',
    taskDescription: 'Add a Load Balancer between Client and Trading Gateway',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Distribute trading traffic across gateways', displayName: 'Load Balancer' },
    ],
    successCriteria: [
      'Load Balancer component added',
      'Client connected to Load Balancer',
      'Load Balancer connected to App Server',
    ],
  },

  celebration: step5Celebration,

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
    level1: 'Drag a Load Balancer onto the canvas between Client and App Server',
    level2: 'Reconnect: Client → Load Balancer → App Server',
    solutionComponents: [{ type: 'load_balancer' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 6: Add Cache Replication for Zero Data Loss
// =============================================================================

const step6Story: StoryContent = {
  emoji: '⚠️',
  scenario: "CRITICAL FAILURE! Redis crashed during peak trading.",
  hook: "For 30 seconds, NO quotes were delivered. NO orders could be placed. Traders lost $10 million in that half-minute. You could go to jail for this.",
  challenge: "Add cache replication so failures are transparent to traders.",
  illustration: 'database-failure',
};

const step6Celebration: CelebrationContent = {
  emoji: '🛡️',
  message: 'Cache is now fault-tolerant!',
  achievement: 'Replication ensures zero downtime and zero data loss',
  metrics: [
    { label: 'Cache availability', before: '99.5%', after: '99.999%' },
    { label: 'Failover time', after: '<100ms' },
    { label: 'Data loss on failure', after: 'Zero' },
  ],
  nextTeaser: "But we need more gateway instances to handle peak load...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Cache Replication: High Availability for Trading',
  conceptExplanation: `For trading systems, cache replication is **MANDATORY** - not optional.

**Redis Sentinel Architecture:**
- **Primary (Master)**: Handles all writes
- **Replicas**: Stay in sync, ready to take over
- **Sentinel**: Monitors health, triggers automatic failover

**Replication modes:**
1. **Synchronous**: Write to primary AND replica before ack
   - Latency: +200-500µs
   - Guarantee: Zero data loss
   - Use for: Active orders, positions

2. **Asynchronous**: Write to primary, replicate later
   - Latency: +0µs (no blocking)
   - Guarantee: Possible data loss (recent writes)
   - Use for: Quote cache (replaceable data)

**Key insight**: For trading, use **semi-synchronous**:
- Critical writes (orders) → sync to 1 replica
- Quote updates → async replication (speed over safety)`,

  whyItMatters: 'A cache outage means:\n1. No trading for seconds/minutes\n2. Lost revenue for market makers\n3. Regulatory fines\n4. Potential criminal charges',

  famousIncident: {
    title: 'TSX (Toronto Stock Exchange) Outage',
    company: 'Toronto Stock Exchange',
    year: '2018',
    whatHappened: 'A hardware failure in their trading system caused a complete outage for 3 hours. No failover plan. Canada\'s entire equity market was offline. Billions in lost trading volume.',
    lessonLearned: 'Financial systems must have instant failover. 3 hours is unacceptable - should be <1 second.',
    icon: '🇨🇦',
  },

  realWorldExample: {
    company: 'Nasdaq',
    scenario: 'Zero downtime for market data',
    howTheyDoIt: 'Uses Redis Enterprise with active-active replication across multiple data centers, achieving <1ms failover',
  },

  diagram: `
                           ┌──────────────────┐
                           │  Redis Primary   │
                           │   (Write)        │
                           └────────┬─────────┘
                                    │ Sync/Async Replication
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
           ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
           │  Replica 1  │  │  Replica 2  │  │  Replica 3  │
           │   (Read)    │  │   (Read)    │  │   (Read)    │
           └─────────────┘  └─────────────┘  └─────────────┘
                    ↑               ↑               ↑
                    └───────────────┼───────────────┘
                                    │
                            ┌───────┴────────┐
                            │ Redis Sentinel │
                            │ (Failover Mgr) │
                            └────────────────┘
`,

  keyPoints: [
    'Use synchronous replication for critical data (orders)',
    'Use async replication for quote data (speed over safety)',
    'Redis Sentinel enables automatic failover in <1 second',
    'Minimum 2 replicas in different racks/zones',
  ],

  quickCheck: {
    question: 'Why use semi-synchronous replication for trading caches?',
    options: [
      'It\'s cheaper',
      'Balance: Sync for critical data (orders), async for speed (quotes)',
      'It\'s easier to configure',
      'It uses less memory',
    ],
    correctIndex: 1,
    explanation: 'Orders must be durable (sync). Quotes are replaceable and speed-critical (async). Use both modes strategically.',
  },

  keyConcepts: [
    { title: 'Redis Sentinel', explanation: 'Automatic failover manager for Redis', icon: '🔍' },
    { title: 'Semi-Sync', explanation: 'Mix of sync and async replication', icon: '⚖️' },
    { title: 'Failover', explanation: 'Automatic promotion of replica to primary', icon: '🔄' },
  ],
};

const step6: GuidedStep = {
  id: 'trading-cache-step-6',
  stepNumber: 6,
  frIndex: 0,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs require zero-downtime cache access',
    taskDescription: 'Enable cache replication with at least 2 replicas',
    successCriteria: [
      'Click on the Cache component',
      'Go to Configuration tab',
      'Enable replication',
      'Set replica count to 2 or more',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCacheReplication: true,
  },

  hints: {
    level1: 'Click on the Cache, then find the replication settings in Configuration',
    level2: 'Enable replication and set replicas to 2+ for high availability',
    solutionComponents: [{ type: 'cache', config: { replication: { enabled: true, replicas: 2 } } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 7: Horizontal Scaling (Multiple Gateway Instances)
// =============================================================================

const step7Story: StoryContent = {
  emoji: '📈',
  scenario: "Trading volume just hit an all-time high. Your gateway is overwhelmed!",
  hook: "Peak: 500,000 orders/second. One gateway can only handle 50,000/sec. 90% of orders are rejected!",
  challenge: "Scale horizontally by adding more gateway instances.",
  illustration: 'traffic-spike',
};

const step7Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'You can now handle peak trading volume!',
  achievement: 'Multiple gateways share the order flow',
  metrics: [
    { label: 'Gateway instances', before: '1', after: '10+' },
    { label: 'Order capacity', before: '50K/s', after: '500K+/s' },
    { label: 'Rejection rate', before: '90%', after: '<0.1%' },
  ],
  nextTeaser: "But quote distribution is still too slow...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Horizontal Scaling: More Gateways, More Capacity',
  conceptExplanation: `Trading systems scale horizontally by adding more gateway instances.

**Key principle**: Stateless gateways sharing stateful cache
- Each gateway is **stateless** - no local storage
- All state lives in **shared Redis cluster**
- Any gateway can serve any trader (via load balancer)

**Scaling strategy:**
1. Start with 2-3 gateways for redundancy
2. Add gateways during market hours (9:30 AM - 4 PM)
3. Scale down after hours to save costs
4. Keep 1-2 gateways running 24/7 for after-hours trading

**Gateway specialization** (optional):
- **Order gateways**: Optimized for low-latency writes
- **Market data gateways**: Optimized for quote streaming
- Separation reduces interference between read and write paths`,

  whyItMatters: 'At 500K orders/second, you need 10+ gateways. But 10x the servers doesn\'t mean 10x the cost - cloud auto-scaling helps.',

  realWorldExample: {
    company: 'Virtu Financial',
    scenario: 'Processing 20% of US equity volume',
    howTheyDoIt: 'Runs hundreds of trading gateway instances with auto-scaling based on market volatility',
  },

  famousIncident: {
    title: 'Robinhood GameStop Outage',
    company: 'Robinhood',
    year: '2021',
    whatHappened: 'During the GameStop short squeeze, trading volume spiked 10x. Robinhood\'s systems couldn\'t scale fast enough. Platform was down for hours. Users sued for billions.',
    lessonLearned: 'Trading platforms must be designed for 10x+ spikes from day 1. Horizontal scaling isn\'t optional.',
    icon: '🎮',
  },

  diagram: `
                    ┌─────────────────────────┐
                    │     Load Balancer       │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼─────────────────────────┐
        ▼                       ▼                         ▼
  ┌───────────┐           ┌───────────┐           ┌───────────┐
  │ Gateway   │           │ Gateway   │           │ Gateway   │
  │ Instance 1│           │ Instance 2│           │Instance 10│
  └─────┬─────┘           └─────┬─────┘           └─────┬─────┘
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │  Shared Redis Cluster │
                    │  (All order/quote     │
                    │      state)           │
                    └───────────────────────┘
`,

  keyPoints: [
    'Stateless gateways enable unlimited horizontal scaling',
    'Shared cache holds all state (orders, positions, quotes)',
    'Auto-scale based on order flow rate',
    'Consider separating order and market data gateways',
  ],

  quickCheck: {
    question: 'Why must trading gateways be stateless?',
    options: [
      'It\'s faster',
      'Enables horizontal scaling - any gateway can serve any trader',
      'It uses less memory',
      'It\'s easier to program',
    ],
    correctIndex: 1,
    explanation: 'If gateways store local state, traders are stuck on one gateway. Stateless design allows load balancers to route anywhere.',
  },

  keyConcepts: [
    { title: 'Stateless', explanation: 'No local storage - all state in shared cache', icon: '🔄' },
    { title: 'Auto-Scaling', explanation: 'Automatically add/remove instances', icon: '📊' },
    { title: 'Gateway Specialization', explanation: 'Separate order vs market data paths', icon: '🎯' },
  ],
};

const step7: GuidedStep = {
  id: 'trading-cache-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'All FRs benefit from more gateway capacity',
    taskDescription: 'Scale the Trading Gateway to multiple instances',
    successCriteria: [
      'Click on the App Server component',
      'Go to Configuration tab',
      'Set instances to 10 or more',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Click on the App Server, then find the instance count in Configuration',
    level2: 'Set instances to 10 or more to handle peak order flow. Load balancer distributes traffic.',
    solutionComponents: [{ type: 'app_server', config: { instances: 10 } }],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 8: Add Message Queue for Order Book Updates
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📚',
  scenario: "Order book updates are causing gateway latency spikes!",
  hook: "Every order placement triggers order book recalculation for all 50,000 subscribers. This is blocking the order processing thread. Latency spiked from 500µs to 50ms!",
  challenge: "Add a message queue to process order book updates asynchronously.",
  illustration: 'webhook-failure',
};

const step8Celebration: CelebrationContent = {
  emoji: '📨',
  message: 'Order book updates are now non-blocking!',
  achievement: 'Async processing keeps order latency sub-millisecond',
  metrics: [
    { label: 'Order latency', before: '50ms', after: '<500µs' },
    { label: 'Order book freshness', after: '<5ms' },
    { label: 'Gateway throughput', before: '5K/s', after: '100K/s' },
  ],
  nextTeaser: "But we need better quote distribution...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queues: Async Order Book Processing',
  conceptExplanation: `The **order book update problem** is similar to the fan-out problem in social media:
- When an order is placed, thousands of traders need the updated order book
- Synchronous updates would block for milliseconds
- Must decouple order placement from order book distribution

**Solution: Message Queue (Kafka)**
1. Order placed → Update cache → ACK trader (fast, <500µs)
2. Publish "OrderPlaced" event to Kafka
3. Background workers consume events
4. Workers calculate new order book state
5. Workers publish updated order book to subscribers (via pub/sub)

**Why Kafka for trading?**
- Ultra-low latency (p99 < 5ms)
- Ordered processing per partition (per symbol)
- Replay capability for disaster recovery
- Handles millions of events/second

**Order book partitioning:**
- Partition by symbol (AAPL, TSLA, etc.)
- Each partition processed by dedicated worker
- Preserves strict ordering per symbol`,

  whyItMatters: 'Without async processing, order placement latency would be 50-100ms. Traders would lose to competitors with faster systems.',

  famousIncident: {
    title: 'London Stock Exchange Outage',
    company: 'London Stock Exchange',
    year: '2019',
    whatHappened: 'A bug in their order book calculation system caused it to process updates synchronously. The system got overwhelmed and crashed, taking down trading for the entire day.',
    lessonLearned: 'Order book updates must be asynchronous. Blocking order placement is catastrophic.',
    icon: '🇬🇧',
  },

  realWorldExample: {
    company: 'CME Group',
    scenario: 'Processing 100K order book updates/second',
    howTheyDoIt: 'Uses Kafka partitioned by symbol, with dedicated consumers calculating order book levels in parallel',
  },

  diagram: `
Order Placed
      │
      ▼
┌─────────────┐     ┌─────────────────────────────────────┐
│   Gateway   │────▶│          Kafka Queue                │
│  (instant   │     │  [AAPL orders, TSLA orders, ...]   │
│    ACK)     │     └──────────────┬──────────────────────┘
└─────────────┘                    │
      │                            │ Partitioned by symbol
      │ Return                     ▼
      ▼ "Accepted!"       ┌─────────────────┐
                          │ Order Book      │
                          │ Workers         │
                          │ (per symbol)    │
                          └────────┬────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  ▼                ▼                ▼
          Publish to         Publish to       Publish to
          Redis Pub/Sub      Redis Pub/Sub    Redis Pub/Sub
          (AAPL book)        (TSLA book)      (MSFT book)
                  │                │                │
                  └────────────────┼────────────────┘
                                   ▼
                          All subscribed traders
`,

  keyPoints: [
    'Decouple order placement from order book calculation',
    'Kafka ensures ordered processing per symbol',
    'Workers calculate and publish order book asynchronously',
    'Traders get instant order ACK, then order book update <5ms later',
  ],

  quickCheck: {
    question: 'Why partition Kafka by symbol (stock ticker)?',
    options: [
      'It\'s faster',
      'Preserves order sequence for each stock - critical for fair order book',
      'It uses less memory',
      'It\'s easier to configure',
    ],
    correctIndex: 1,
    explanation: 'FIFO order processing per symbol is mandatory. Partitioning by symbol ensures orders for AAPL are processed in exact sequence.',
  },

  keyConcepts: [
    { title: 'Order Book', explanation: 'List of pending buy/sell orders at each price', icon: '📚' },
    { title: 'Kafka Partition', explanation: 'Ordered log of events for one key (symbol)', icon: '🔢' },
    { title: 'Async Processing', explanation: 'Decouple fast path (order ACK) from slow path (book calc)', icon: '⚡' },
  ],
};

const step8: GuidedStep = {
  id: 'trading-cache-step-8',
  stepNumber: 8,
  frIndex: 1,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'FR-2: Order book updates need async processing',
    taskDescription: 'Add a Message Queue for async order book calculation',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Process order book updates asynchronously', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a Message Queue (Kafka) component onto the canvas',
    level2: 'Connect App Server to Message Queue. This enables async order book processing.',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 9: Add CDN for Market Data Distribution
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🌍',
  scenario: "You're expanding to global traders, but they're getting stale quotes!",
  hook: "A trader in Tokyo sees prices from 100ms ago - by the time they trade, prices have moved. They're losing money on every trade.",
  challenge: "Add a CDN to distribute market data closer to global traders.",
  illustration: 'slow-loading',
};

const step9Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Global quote delivery is now under 10ms!',
  achievement: 'CDN edge locations bring data close to traders',
  metrics: [
    { label: 'Tokyo quote latency', before: '100ms', after: '<10ms' },
    { label: 'London quote latency', before: '80ms', after: '<5ms' },
    { label: 'Global coverage', after: '20+ edge locations' },
  ],
  nextTeaser: "But we're burning through budget...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'CDN for Market Data: Global Distribution',
  conceptExplanation: `A **CDN (Content Delivery Network)** brings market data closer to traders globally.

**Traditional approach (slow):**
- All traders connect to central data center
- Tokyo → New York: ~100ms network latency
- Speed of light is the limiting factor

**CDN approach (fast):**
- Deploy edge locations in major financial hubs
- Market data replicated to all edges
- Traders connect to nearest edge: <10ms

**For trading, CDN use is different:**
- **Not for HTTP caching** - quotes change every millisecond
- **WebSocket streaming** from edge to traders
- **Real-time replication** from central exchange to edges
- **Edge nodes** subscribe to central Kafka and stream locally

**Financial CDN locations:**
- New York (NYSE data center)
- London (LSE data center)
- Tokyo (TSE data center)
- Chicago (CME data center)
- Singapore, Hong Kong, Frankfurt`,

  whyItMatters: 'Network latency is physics - you can\'t beat the speed of light. CDN is the only way to serve global traders fairly.',

  realWorldExample: {
    company: 'Bloomberg Terminal',
    scenario: 'Serving 325,000 traders globally',
    howTheyDoIt: 'Uses private edge locations in 120+ countries with dedicated fiber connections and real-time data replication',
  },

  famousIncident: {
    title: 'HFT Latency Arbitrage',
    company: 'Various HFT Firms',
    year: '2010-2015',
    whatHappened: 'HFT firms with faster data feeds could see price changes before slower traders. They profited by buying before slow traders saw the price rise. Led to massive controversy and calls for regulation.',
    lessonLearned: 'Unequal latency creates unfair markets. CDNs help level the playing field by giving all traders similar latency.',
    icon: '⚖️',
  },

  diagram: `
                     ┌────────────────────┐
                     │  Central Exchange  │
                     │  (Primary Source)  │
                     └──────────┬─────────┘
                                │ Replication
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
       ┌───────────┐     ┌───────────┐    ┌───────────┐
       │  CDN Edge │     │  CDN Edge │    │  CDN Edge │
       │  New York │     │   London  │    │   Tokyo   │
       └─────┬─────┘     └─────┬─────┘    └─────┬─────┘
             │                 │                 │
      Traders in US     Traders in EU    Traders in Asia
      (<5ms latency)    (<5ms latency)   (<10ms latency)
`,

  keyPoints: [
    'CDN reduces global latency by serving from nearest edge',
    'Real-time replication from central exchange to all edges',
    'Edge nodes stream via WebSocket to local traders',
    'Typical edge locations: NY, London, Tokyo, Chicago, Singapore',
  ],

  quickCheck: {
    question: 'Why use CDN for market data instead of just scaling central servers?',
    options: [
      'CDN is cheaper',
      'Physics: Can\'t beat speed of light - need local presence',
      'CDN has more features',
      'It\'s easier to configure',
    ],
    correctIndex: 1,
    explanation: 'Network latency NY→Tokyo is ~100ms due to physical distance. CDN edge in Tokyo serves local traders with <10ms.',
  },

  keyConcepts: [
    { title: 'Edge Location', explanation: 'CDN server close to end users', icon: '📍' },
    { title: 'WebSocket', explanation: 'Persistent connection for real-time streaming', icon: '🔌' },
    { title: 'Latency Arbitrage', explanation: 'Profiting from faster market data access', icon: '⚡' },
  ],
};

const step9: GuidedStep = {
  id: 'trading-cache-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time quotes need global distribution',
    taskDescription: 'Add a CDN for low-latency global market data delivery',
    componentsNeeded: [
      { type: 'cdn', reason: 'Distribute market data from edge locations globally', displayName: 'CDN' },
    ],
    successCriteria: [
      'CDN component added to canvas',
      'Load Balancer connected to CDN',
      'CDN connected to App Server',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
  },

  hints: {
    level1: 'Drag a CDN component onto the canvas',
    level2: 'Insert CDN between Load Balancer and App Server for edge distribution',
    solutionComponents: [{ type: 'cdn' }],
    solutionConnections: [
      { from: 'load_balancer', to: 'cdn' },
      { from: 'cdn', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 10: Cost Optimization & Performance Tuning
// =============================================================================

const step10Story: StoryContent = {
  emoji: '💸',
  scenario: "Your trading infrastructure costs $2 million per month!",
  hook: "The CFO is furious: 'We're spending more on infrastructure than we're making in trading fees! Cut costs by 40% or I'm shutting this down!'",
  challenge: "Optimize your architecture for cost efficiency while maintaining sub-millisecond latency.",
  illustration: 'budget-crisis',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a world-class trading system!',
  achievement: 'Ultra-low latency, globally distributed, cost-optimized',
  metrics: [
    { label: 'Monthly infrastructure cost', before: '$2M', after: 'Under budget' },
    { label: 'Quote delivery latency', after: '<1ms p99' },
    { label: 'Order acknowledgment', after: '<500µs p99' },
    { label: 'System availability', after: '99.999%' },
    { label: 'Global coverage', after: '20+ locations' },
  ],
  nextTeaser: "You've mastered ultra-low latency system design for financial trading!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Cost Optimization: High Performance on a Budget',
  conceptExplanation: `Trading systems are expensive, but there are smart optimization strategies:

**1. Time-based scaling:**
- Full capacity during market hours (9:30 AM - 4 PM ET)
- 50% capacity during pre/post-market (7 AM - 9:30 AM, 4 PM - 8 PM)
- 10% capacity overnight (maintenance only)
- Saves: ~40% on compute costs

**2. Tiered cache architecture:**
- Hot tier (Redis): Active symbols only (~1000 stocks)
- Warm tier (cheaper cache): Less active symbols
- Most traders focus on same 100-200 stocks (AAPL, TSLA, etc.)
- Saves: ~30% on cache costs

**3. Database optimization:**
- Write coalescing: Batch DB writes every 100ms
- Partitioning: Partition by date for easy archival
- Archive old data (>7 days) to cold storage
- Saves: ~50% on database costs

**4. Network optimization:**
- Colocation: Place servers IN the exchange data center
- Eliminates 10+ network hops
- Reduces latency from 10ms → 100µs
- Worth the premium for HFT

**5. Hardware optimization:**
- Use bare metal for latency-critical gateways (no VM overhead)
- Use spot instances for analytics workloads
- Kernel bypass networking (DPDK) for quote processing`,

  whyItMatters: 'Trading margins are thin (fractions of a cent per trade). Infrastructure must be optimized or the business fails.',

  famousIncident: {
    title: 'Spread Networks Fiber Line',
    company: 'Spread Networks',
    year: '2010',
    whatHappened: 'Built a $300M fiber optic cable from Chicago to New York, shaving 3ms off latency. HFT firms paid $10M+ just to access it. Shows how valuable every millisecond is.',
    lessonLearned: 'In HFT, microseconds are worth millions. Optimize ruthlessly.',
    icon: '💰',
  },

  realWorldExample: {
    company: 'Two Sigma',
    scenario: 'Managing $60B in assets with HFT strategies',
    howTheyDoIt: 'Invests heavily in custom hardware, colocation, and kernel bypass networking. Cost per trade: <$0.001',
  },

  keyPoints: [
    'Auto-scale based on market hours (peak vs off-peak)',
    'Use tiered caching for hot vs warm data',
    'Colocate critical systems in exchange data centers',
    'Archive old data to cold storage',
    'Consider bare metal for lowest latency',
  ],

  quickCheck: {
    question: 'What\'s the most effective cost optimization for a trading system?',
    options: [
      'Use cheaper servers',
      'Time-based auto-scaling - full capacity only during trading hours',
      'Delete old data',
      'Remove replication',
    ],
    correctIndex: 1,
    explanation: 'Markets are only open 6.5 hours/day. Scaling down during off-hours saves 40%+ while maintaining peak performance.',
  },

  keyConcepts: [
    { title: 'Colocation', explanation: 'Hosting servers in exchange data center', icon: '🏢' },
    { title: 'Time-Based Scaling', explanation: 'Scale up/down based on market hours', icon: '⏰' },
    { title: 'Kernel Bypass', explanation: 'Skip OS to reduce latency (DPDK)', icon: '⚡' },
  ],
};

const step10: GuidedStep = {
  id: 'trading-cache-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'All FRs must be delivered within budget',
    taskDescription: 'Optimize your system to reduce costs while maintaining performance',
    successCriteria: [
      'Review all component configurations',
      'Ensure total estimated cost is optimized',
      'Maintain latency requirements: <1ms quotes, <500µs orders',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'cdn', 'load_balancer', 'app_server', 'cache', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'cdn' },
      { fromType: 'cdn', toType: 'app_server' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCacheReplication: true,
    requireMultipleAppInstances: true,
    requireCostUnderBudget: true,
  },

  hints: {
    level1: 'Review each component for over-provisioning. Consider time-based scaling and tiered caching.',
    level2: 'Optimal: 10 gateways, 2 cache replicas, aggressive DB partitioning, CDN for global reach.',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const financialTradingCacheGuidedTutorial: GuidedTutorial = {
  problemId: 'financial-trading-cache',
  title: 'Design Financial Trading Cache',
  description: 'Build an ultra-low latency cache for stock exchange trading with market data distribution and order book management',
  difficulty: 'expert',
  estimatedMinutes: 70,

  welcomeStory: {
    emoji: '📈',
    hook: "You've been hired as Principal Engineer at QuantTech Trading!",
    scenario: "Your mission: Build a sub-millisecond trading cache that can handle millions of quotes per second and process orders faster than the competition.",
    challenge: "Can you design a system where microseconds mean millions of dollars?",
  },

  requirementsPhase: tradingCacheRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  // Meta information
  concepts: [
    'Ultra-Low Latency Architecture',
    'Binary Protocols',
    'In-Memory Caching',
    'Order Book Management',
    'Lock-Free Data Structures',
    'Market Data Distribution',
    'High-Frequency Trading (HFT)',
    'Cache Replication',
    'Message Queues for Finance',
    'CDN for Global Distribution',
    'Colocation',
    'Time-Based Auto-Scaling',
    'FIFO Order Processing',
    'Pub/Sub for Quotes',
  ],

  ddiaReferences: [
    'Chapter 1: Latency and throughput trade-offs',
    'Chapter 3: Storage engines for fast writes',
    'Chapter 5: Replication for high availability',
    'Chapter 8: Distributed transactions',
    'Chapter 11: Stream processing for order books',
  ],
};

export default financialTradingCacheGuidedTutorial;
