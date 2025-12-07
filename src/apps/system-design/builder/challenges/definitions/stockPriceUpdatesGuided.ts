import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Stock Price Updates Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven step-by-step tutorial that teaches system design concepts
 * while building a real-time stock price update system.
 *
 * Flow:
 * Phase 0: Gather FRs (Requirements Interview)
 * Steps 1-3: Build basic price feed system
 * Steps 4-6: Real-time streaming, WebSocket delivery, historical data
 *
 * Key Concepts:
 * - Real-time data streaming
 * - WebSocket vs polling
 * - Time-series data storage
 * - Market hours handling
 * - Price update frequency
 */

// =============================================================================
// PHASE 0: Requirements Gathering - The Interview
// =============================================================================

const stockPriceUpdatesRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a real-time stock price update system",

  interviewer: {
    name: 'David Martinez',
    role: 'VP of Engineering at FinTech Trading Platform',
    avatar: '👨‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-functionality',
      category: 'functional',
      question: "What are the main features users need from the stock price system?",
      answer: "Users need to:\n1. **View real-time stock prices** - See current price, bid/ask, volume\n2. **Track specific stocks** - Watch a portfolio of 10-50 stocks\n3. **Get price updates instantly** - When price changes, see it immediately\n4. **View historical data** - See charts with price history (1D, 1W, 1M, 1Y)",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2',
      learningPoint: "Stock trading requires real-time updates - every second counts",
    },
    {
      id: 'update-frequency',
      category: 'functional',
      question: "How frequently do stock prices update? Should we show every tick?",
      answer: "Stock prices can change thousands of times per second during active trading. But we can't send thousands of updates per second to users.\n\nFor retail users: **Update every 100-500ms** is sufficient. This gives real-time feel without overwhelming the network.\n\nFor professional traders: May need tick-by-tick data (every change).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Throttling updates balances real-time feel with system capacity",
    },
    {
      id: 'market-hours',
      category: 'functional',
      question: "Do we need to handle market hours? What about after-hours trading?",
      answer: "US stock markets operate:\n- **Regular hours**: 9:30 AM - 4:00 PM ET (most active)\n- **Pre-market**: 4:00 AM - 9:30 AM ET\n- **After-hours**: 4:00 PM - 8:00 PM ET\n- **Weekends/holidays**: Closed\n\nFor MVP, focus on regular hours. Pre-market and after-hours are lower volume.",
      importance: 'important',
      insight: "Market hours affect traffic patterns - huge spikes at open/close",
    },
    {
      id: 'price-data-sources',
      category: 'functional',
      question: "Where do stock prices come from? How do we get the data?",
      answer: "Stock prices come from **exchanges** (NYSE, NASDAQ, etc.).\n\nWe'll use a **data provider API** (like IEX Cloud, Polygon.io) that:\n- Aggregates data from all exchanges\n- Provides WebSocket feeds for real-time updates\n- Handles market data licensing\n\nWe consume their API, not direct exchange feeds (which require licensing).",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Use aggregated data providers - direct exchange feeds are expensive",
    },
    {
      id: 'latency-requirements',
      category: 'latency',
      question: "How fast must price updates reach users?",
      answer: "For retail trading:\n- **p99 < 500ms** from exchange to user screen\n- Users can tolerate a few hundred milliseconds\n\nFor professional traders:\n- **p99 < 50ms** - every millisecond matters for trading decisions\n\nLet's design for retail (500ms) - professional traders use specialized systems.",
      importance: 'critical',
      revealsRequirement: 'NFR-L1',
      learningPoint: "Latency requirements drive architecture - WebSocket for push, not polling",
    },
    {
      id: 'historical-data',
      category: 'functional',
      question: "What historical data do we need to store and serve?",
      answer: "Users need historical prices for charting:\n- **Intraday**: 1-minute candles for current day (390 data points)\n- **Daily**: Daily close prices for 1 year (252 trading days)\n- **Long-term**: Weekly/monthly aggregates for 5+ years\n\nHistorical data is read-heavy but doesn't change (except current day).",
      importance: 'important',
      revealsRequirement: 'FR-3',
      learningPoint: "Time-series data requires specialized storage patterns",
    },

    // SCALE & NFRs
    {
      id: 'throughput-users',
      category: 'throughput',
      question: "How many concurrent users will be watching stock prices?",
      answer: "Peak concurrent users: **1 million users** during market open/close",
      importance: 'critical',
      learningPoint: "1M concurrent WebSocket connections require distributed architecture",
    },
    {
      id: 'throughput-stocks',
      category: 'throughput',
      question: "How many stocks need real-time tracking?",
      answer: "Support: **10,000 stocks** (covers major US exchanges)\n\nEach user watches: ~20 stocks on average\n\nMost popular stocks (AAPL, TSLA, SPY): watched by 100K+ users simultaneously",
      importance: 'critical',
      calculation: {
        formula: "1M users × 20 stocks = 20M stock subscriptions",
        result: "Need efficient fanout for popular stocks",
      },
      learningPoint: "Fanout pattern: one price update → many users",
    },
    {
      id: 'update-rate',
      category: 'throughput',
      question: "How many price updates per second does the system receive?",
      answer: "During active trading:\n- 10,000 stocks × 1 update/sec avg = **10K updates/sec**\n- Peak (market open/close): 3-5x higher = **30K-50K updates/sec**\n\nSystem must ingest, process, and fan out these updates in real-time.",
      importance: 'critical',
      calculation: {
        formula: "Popular stock: 1 update → 100K users = 100K messages/sec",
        result: "Fanout amplifies load significantly",
      },
      learningPoint: "Ingest rate vs fanout rate - fanout can be 1000x higher",
    },
    {
      id: 'burst-pattern',
      category: 'burst',
      question: "Are there traffic spikes we need to handle?",
      answer: "Yes! Major spikes occur:\n- **Market open** (9:30 AM ET): 5x normal traffic\n- **Market close** (4:00 PM ET): 3x normal traffic\n- **Earnings announcements**: Single stock can spike 10x\n- **Breaking news**: Flash crashes, major events\n\nSystem must auto-scale to handle these bursts.",
      importance: 'critical',
      insight: "Market events create predictable and unpredictable spikes",
    },
    {
      id: 'storage-requirements',
      category: 'payload',
      question: "How much historical data do we need to store?",
      answer: "Storage calculation:\n- **1-min candles**: 10K stocks × 390 bars/day × 365 days × 50 bytes = ~70GB/year\n- **Daily candles**: 10K stocks × 252 days × 100 bytes = ~250MB/year\n- **Total with overhead**: ~100GB/year\n\nTime-series data compresses well - actual storage ~30GB/year.",
      importance: 'important',
      learningPoint: "Time-series data is append-only and highly compressible",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-functionality', 'update-frequency', 'latency-requirements'],
  criticalFRQuestionIds: ['core-functionality', 'update-frequency', 'price-data-sources'],
  criticalScaleQuestionIds: ['throughput-users', 'throughput-stocks', 'update-rate', 'burst-pattern'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Users receive real-time stock price updates',
      description: 'Price updates delivered within 500ms of change, streamed via WebSocket',
      emoji: '📈',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Users can subscribe to specific stocks',
      description: 'Users choose which stocks to track, receive updates only for subscribed stocks',
      emoji: '⭐',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Historical price data is available',
      description: 'Users can view historical charts (intraday, daily, weekly, monthly)',
      emoji: '📊',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '5 million',
    writesPerDay: 'N/A (streaming)',
    readsPerDay: 'N/A (push-based)',
    peakMultiplier: 5,
    readWriteRatio: 'N/A (real-time stream)',
    calculatedWriteRPS: { average: 10000, peak: 50000 },
    calculatedReadRPS: { average: 0, peak: 0 },
    maxPayloadSize: '~200 bytes (price update)',
    storagePerRecord: '~50 bytes (candle)',
    storageGrowthPerYear: '~30GB (compressed)',
    redirectLatencySLA: 'p99 < 500ms (price update delivery)',
    createLatencySLA: 'N/A',
  },

  architecturalImplications: [
    '✅ Real-time updates → WebSocket for push delivery',
    '✅ 1M concurrent connections → WebSocket gateway cluster',
    '✅ Fanout pattern → Message broker for pub/sub',
    '✅ 50K updates/sec peak → Streaming pipeline (Kafka)',
    '✅ Time-series data → Specialized DB (TimescaleDB, InfluxDB)',
    '✅ Market hours traffic → Auto-scaling based on time of day',
  ],

  outOfScope: [
    'Order execution and trading',
    'Portfolio management',
    'Options and derivatives pricing',
    'International markets (focus on US stocks)',
    'Direct exchange feeds (use aggregated provider)',
    'Professional trader features (tick-by-tick)',
  ],

  keyInsight: "First, let's make it WORK. We'll build a simple system that fetches and displays stock prices. Real-time WebSocket streaming and massive fanout will come in later steps. Functionality first, then real-time optimization!",
};

// =============================================================================
// STEP 1: Connect Client to Server
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📈',
  scenario: "Welcome to FinTech Trading Platform! You're building a real-time stock price system.",
  hook: "Traders need to see live stock prices to make decisions. Every second counts!",
  challenge: "Set up the foundation so users can connect to your price server.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Your stock price system is online!',
  achievement: 'Users can now connect to your server',
  metrics: [
    { label: 'Status', after: 'Online' },
    { label: 'Can accept requests', after: '✓' },
  ],
  nextTeaser: "But the server doesn't know how to get stock prices yet...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Building the Foundation: Client-Server for Stock Data',
  conceptExplanation: `Every stock price system starts with a **Client** connecting to a **Server**.

When a trader opens the trading platform:
1. Their browser/app (Client) connects to your App Server
2. The server will fetch stock prices
3. Prices are sent back to display on charts

For now, we'll use HTTP for basic requests. Later, we'll add WebSocket for real-time streaming.`,

  whyItMatters: 'Without this connection, traders have no way to see stock prices.',

  realWorldExample: {
    company: 'Robinhood',
    scenario: 'Serving real-time stock prices to millions of retail traders',
    howTheyDoIt: 'Uses WebSocket connections to stream price updates to millions of users simultaneously',
  },

  keyPoints: [
    'Client = trader\'s browser or mobile app',
    'App Server = backend that manages price data',
    'HTTP = initial protocol (WebSocket comes later for real-time)',
  ],

  keyConcepts: [
    { title: 'Client', explanation: 'Trading app that displays prices', icon: '📱' },
    { title: 'App Server', explanation: 'Backend that fetches and serves stock prices', icon: '🖥️' },
  ],
};

const step1: GuidedStep = {
  id: 'stock-prices-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Users can connect to the stock price system',
    taskDescription: 'Add a Client and App Server, then connect them',
    componentsNeeded: [
      { type: 'client', reason: 'Represents traders viewing stock prices', displayName: 'Client' },
      { type: 'app_server', reason: 'Handles stock price requests', displayName: 'App Server' },
    ],
    successCriteria: [
      'Add Client component',
      'Add App Server component',
      'Connect Client to App Server',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server'],
    requiredConnections: [{ fromType: 'client', toType: 'app_server' }],
  },

  hints: {
    level1: 'Drag Client and App Server onto the canvas',
    level2: 'Click Client, then click App Server to create a connection',
    solutionComponents: [{ type: 'client' }, { type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 2: Implement Stock Price APIs
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Your server is connected, but it doesn't know how to handle stock price requests!",
  hook: "A trader just searched for AAPL, but nothing happened.",
  challenge: "Write the Python code to fetch and serve stock prices.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'Your server can fetch stock prices!',
  achievement: 'Stock price APIs are working',
  metrics: [
    { label: 'APIs implemented', after: '2' },
    { label: 'Can fetch current price', after: '✓' },
    { label: 'Can fetch historical data', after: '✓' },
  ],
  nextTeaser: "But when the server restarts, we lose all cached data...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'API Implementation: Stock Price Handlers',
  conceptExplanation: `Your App Server needs to handle stock price requests:

**1. Get Current Price (GET /api/v1/stocks/:symbol)** — You'll implement this
- Receives: Stock symbol (AAPL, TSLA, etc.)
- Returns: Current price, volume, bid/ask
- Your code: Fetch from external API, cache in memory

**2. Get Historical Data (GET /api/v1/stocks/:symbol/history)** — You'll implement this
- Receives: Symbol, timeframe (1D, 1W, 1M, 1Y)
- Returns: Array of price candles
- Your code: Fetch historical data, format for charts

For now, we'll use mock data and store in memory (Python dictionaries).`,

  whyItMatters: 'These APIs are the bridge between external price data and your users.',

  famousIncident: {
    title: 'Knight Capital Trading Glitch',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'A bug in Knight Capital\'s trading software caused it to execute millions of erroneous trades in 45 minutes, losing $440 million. The bug was in the price feed processing logic.',
    lessonLearned: 'Financial data handlers must be bulletproof. Always validate price data before acting on it.',
    icon: '💥',
  },

  realWorldExample: {
    company: 'Bloomberg Terminal',
    scenario: 'Serving real-time financial data to traders',
    howTheyDoIt: 'Uses dedicated servers that normalize data from thousands of sources and serve via optimized APIs',
  },

  keyPoints: [
    'Each API needs a handler function',
    'External API calls should be cached',
    'Handle errors gracefully (market closed, invalid symbol)',
    'Price data must be validated before serving',
  ],

  quickCheck: {
    question: 'Why do we cache stock price data?',
    options: [
      'To save money on API calls',
      'Stock prices never change',
      'To reduce latency and avoid rate limits',
      'Caching is always required',
    ],
    correctIndex: 2,
    explanation: 'Caching reduces latency (instant response) and prevents hitting rate limits on external APIs. Stock prices update frequently, so use short TTL.',
  },

  keyConcepts: [
    { title: 'API Handler', explanation: 'Function that processes stock price requests', icon: '⚙️' },
    { title: 'External API', explanation: 'Third-party service providing stock data', icon: '🌐' },
    { title: 'Caching', explanation: 'Store recent data to reduce API calls', icon: '💾' },
  ],
};

const step2: GuidedStep = {
  id: 'stock-prices-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-3: Fetch current and historical stock prices',
    taskDescription: 'Configure APIs and implement Python handlers',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign GET /api/v1/stocks/:symbol and GET /api/v1/stocks/:symbol/history APIs',
      'Open the Python tab',
      'Implement get_current_price() and get_historical_data() functions',
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
    level1: 'Click App Server, go to APIs tab to assign endpoints',
    level2: 'After assigning APIs, switch to Python tab and implement the TODOs',
    solutionComponents: [{ type: 'app_server' }],
    solutionConnections: [{ from: 'client', to: 'app_server' }],
  },
};

// =============================================================================
// STEP 3: Add Database for Historical Data
// =============================================================================

const step3Story: StoryContent = {
  emoji: '💾',
  scenario: "Traders want to see price charts, but historical data keeps disappearing!",
  hook: "Every time your server restarts, all historical price data is lost.",
  challenge: "Add a time-series database to store historical stock prices permanently.",
  illustration: 'data-loss',
};

const step3Celebration: CelebrationContent = {
  emoji: '📊',
  message: 'Historical data is now persistent!',
  achievement: 'Stock price history survives server restarts',
  metrics: [
    { label: 'Data persistence', after: 'Enabled' },
    { label: 'Chart data', after: 'Available' },
  ],
  nextTeaser: "But traders still have to refresh to see new prices...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'Time-Series Database: Storing Stock Price History',
  conceptExplanation: `Stock prices are **time-series data** - values indexed by timestamp.

A time-series database (like TimescaleDB, InfluxDB) is optimized for:
- **Fast writes**: Append new price candles continuously
- **Time-based queries**: "Get all 1-minute candles for AAPL from yesterday"
- **Aggregation**: Calculate daily averages from 1-minute data
- **Compression**: Reduce storage for historical data

Traditional databases work but are inefficient for time-series workloads.

For stock prices, we store:
- **Candles**: Open, High, Low, Close, Volume (OHLCV) per time interval
- **Indexed by**: Symbol + Timestamp
- **Partitioned by**: Date (for fast queries)`,

  whyItMatters: 'Traders rely on historical charts for technical analysis. Without persistent storage, charts are impossible.',

  famousIncident: {
    title: 'Flash Crash of 2010',
    company: 'US Stock Market',
    year: '2010',
    whatHappened: 'The Dow Jones dropped 1,000 points in minutes, then recovered. Analysis required detailed historical data. Systems without proper time-series storage couldn\'t reconstruct what happened.',
    lessonLearned: 'Financial systems must preserve complete price history with millisecond precision for regulatory and analysis purposes.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'QuantConnect',
    scenario: 'Storing tick-by-tick data for backtesting',
    howTheyDoIt: 'Uses TimescaleDB to store billions of price ticks. Can query years of data in seconds thanks to time-series optimizations.',
  },

  keyPoints: [
    'Time-series DB optimized for timestamp-indexed data',
    'Partitioning by date enables fast queries',
    'Compression reduces storage costs',
    'OHLCV candles are standard format for price data',
  ],

  quickCheck: {
    question: 'Why use a time-series database for stock prices?',
    options: [
      'It\'s cheaper than regular databases',
      'Optimized for append-only timestamp data with fast time-range queries',
      'Stock prices are too complex for SQL',
      'Required by trading regulations',
    ],
    correctIndex: 1,
    explanation: 'Time-series DBs are designed for append-only data indexed by time, with optimizations for time-range queries and aggregations - perfect for stock prices.',
  },

  keyConcepts: [
    { title: 'Time-Series Data', explanation: 'Data indexed by timestamp', icon: '⏰' },
    { title: 'OHLCV Candle', explanation: 'Open, High, Low, Close, Volume for a time period', icon: '🕯️' },
    { title: 'Partitioning', explanation: 'Split data by date for fast queries', icon: '📅' },
  ],
};

const step3: GuidedStep = {
  id: 'stock-prices-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-3: Historical price data must persist',
    taskDescription: 'Add a Database for time-series storage',
    componentsNeeded: [
      { type: 'database', reason: 'Store historical OHLCV candles', displayName: 'TimescaleDB' },
    ],
    successCriteria: [
      'Database component added',
      'App Server connected to Database',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag a Database component onto the canvas',
    level2: 'Connect App Server to Database for historical data storage',
    solutionComponents: [{ type: 'database' }],
    solutionConnections: [{ from: 'app_server', to: 'database' }],
  },
};

// =============================================================================
// STEP 4: Add WebSocket for Real-Time Price Streaming
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🔄',
  scenario: "Traders are frustrated! Stock prices are stale unless they refresh.",
  hook: "AAPL just jumped 5%. But your traders won't know for 30 seconds because they have to manually refresh!",
  challenge: "Add WebSocket to stream price updates to traders in real-time.",
  illustration: 'real-time-sync',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Prices now update in real-time!',
  achievement: 'WebSocket streaming delivers instant updates',
  metrics: [
    { label: 'Update method', before: 'Polling (slow)', after: 'WebSocket push' },
    { label: 'Latency', before: '10-30s', after: '<500ms' },
  ],
  nextTeaser: "But what happens when millions of traders watch the same stocks?",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'WebSocket: Real-Time Price Streaming',
  conceptExplanation: `For stock prices, **real-time is critical**. Traders need prices immediately.

Traditional polling:
\`\`\`
Every 5 seconds:
  Client: "What's AAPL price?"
  Server: "$150.25"
\`\`\`
Problem: 5-second delay, wasteful requests

WebSocket streaming:
\`\`\`
Client: [connects to WebSocket]
Client: "Subscribe to AAPL"
Server: [pushes price whenever it changes] → INSTANT!
\`\`\`

WebSocket enables:
- **Instant updates**: Price changes pushed immediately
- **Efficient**: No repeated polling
- **Bidirectional**: Client can subscribe/unsubscribe dynamically
- **Persistent connection**: One connection handles all stock updates`,

  whyItMatters: 'In trading, milliseconds matter. WebSocket reduces latency from seconds to milliseconds.',

  famousIncident: {
    title: 'Robinhood GameStop Outage',
    company: 'Robinhood',
    year: '2021',
    whatHappened: 'During the GameStop short squeeze, Robinhood\'s price update system couldn\'t handle the traffic surge. Traders saw stale prices during extreme volatility, leading to poor trading decisions.',
    lessonLearned: 'Real-time price systems must scale to handle extreme volatility and traffic spikes.',
    icon: '🎮',
  },

  realWorldExample: {
    company: 'E*TRADE',
    scenario: 'Streaming prices to millions of retail traders',
    howTheyDoIt: 'Uses WebSocket gateway clusters. Each trader subscribes to their watchlist, receives pushed updates only for subscribed stocks.',
  },

  diagram: `
┌────────┐                          ┌─────────────┐
│ Client │◄────WebSocket────────────│ App Server  │
│        │   subscribe: AAPL, TSLA  │             │
└────────┘                          └──────┬──────┘
     ▲                                     │
     │                                     │
     │   Price update pushed instantly     │
     └─────────────────────────────────────┘
`,

  keyPoints: [
    'WebSocket = persistent bidirectional connection',
    'Server pushes price updates to subscribed clients',
    'Client subscribes to specific stocks (not all 10K)',
    'Sub-second latency for price delivery',
  ],

  quickCheck: {
    question: 'Why is WebSocket better than polling for stock prices?',
    options: [
      'WebSocket uses less memory',
      'WebSocket delivers price changes instantly without waiting for next poll',
      'WebSocket is easier to implement',
      'Polling is not allowed for stock data',
    ],
    correctIndex: 1,
    explanation: 'WebSocket pushes updates instantly when prices change. Polling has latency (poll interval) and wastes bandwidth checking for updates that may not exist.',
  },

  keyConcepts: [
    { title: 'WebSocket', explanation: 'Persistent connection for real-time push', icon: '🔌' },
    { title: 'Subscribe', explanation: 'Client tells server which stocks to track', icon: '⭐' },
    { title: 'Push vs Poll', explanation: 'Push = server sends data; Poll = client asks repeatedly', icon: '📤' },
  ],
};

const step4: GuidedStep = {
  id: 'stock-prices-step-4',
  stepNumber: 4,
  frIndex: 2,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-1: Real-time price updates via WebSocket',
    taskDescription: 'Add WebSocket for streaming price updates',
    componentsNeeded: [
      { type: 'websocket', reason: 'Stream real-time price updates to clients', displayName: 'WebSocket Gateway' },
    ],
    successCriteria: [
      'WebSocket component added',
      'Client connected to WebSocket Gateway',
      'WebSocket Gateway connected to App Server',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'websocket', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Add WebSocket Gateway between Client and App Server',
    level2: 'Reconnect: Client → WebSocket Gateway → App Server',
    solutionComponents: [{ type: 'websocket' }],
    solutionConnections: [
      { from: 'client', to: 'websocket' },
      { from: 'websocket', to: 'app_server' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Message Queue for Price Update Fanout
// =============================================================================

const step5Story: StoryContent = {
  emoji: '📢',
  scenario: "AAPL price just changed! 500,000 traders are watching it.",
  hook: "Your server is trying to send 500K WebSocket messages synchronously. It's taking 10 seconds and blocking everything!",
  challenge: "Add a message queue to handle price update fanout efficiently.",
  illustration: 'server-overload',
};

const step5Celebration: CelebrationContent = {
  emoji: '🚀',
  message: 'Price fanout is now instant and scalable!',
  achievement: 'Message queue handles massive concurrent delivery',
  metrics: [
    { label: 'Fanout time', before: '10 seconds', after: '<100ms' },
    { label: 'Blocking', before: 'Server locked', after: 'Non-blocking' },
  ],
  nextTeaser: "But we need load balancing for millions of WebSocket connections...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Message Queue: Efficient Price Update Fanout',
  conceptExplanation: `**Fanout** = one price update needs to reach many users.

Without a queue (synchronous):
\`\`\`
AAPL price changes → Send 500K WebSocket messages → Wait 10s → Done
(All other updates blocked!)
\`\`\`

With a message queue (pub/sub):
\`\`\`
AAPL price changes → Publish to "AAPL" topic → Instant ✓
Workers subscribe to topics → Fan out to 500K users in parallel
\`\`\`

The queue enables:
- **Non-blocking**: App server publishes and moves on
- **Scalability**: Multiple workers fan out in parallel
- **Reliability**: Guaranteed delivery even if some workers fail

Pub/Sub pattern:
1. App server publishes price update to stock symbol topic
2. Workers subscribe to popular stock topics
3. Each worker handles a subset of users
4. Parallel fanout achieves sub-second delivery`,

  whyItMatters: 'Without fanout queues, a popular stock update would freeze your entire system.',

  famousIncident: {
    title: 'TD Ameritrade Trading Halt',
    company: 'TD Ameritrade',
    year: '2020',
    whatHappened: 'During extreme market volatility, TD Ameritrade\'s price update system couldn\'t keep up with fanout demands. The system backed up, causing 20-30 minute delays in price updates. Traders were making decisions on stale data.',
    lessonLearned: 'Fanout must be async with parallel workers. Synchronous fanout doesn\'t scale beyond hundreds of users.',
    icon: '⏱️',
  },

  realWorldExample: {
    company: 'Interactive Brokers',
    scenario: 'Fanout price updates to millions of traders',
    howTheyDoIt: 'Uses Kafka topics per stock symbol. Workers consume topics and push to WebSocket connections. Can fan out to 1M users in under 100ms.',
  },

  diagram: `
Price Update: AAPL $150.25
      │
      ▼
┌─────────────┐     ┌─────────────────────────────┐
│ App Server  │────▶│      Message Queue          │
│             │     │  Topic: AAPL                │
└─────────────┘     │  [update_1, update_2...]   │
                    └──────────┬──────────────────┘
                               │
                    Workers consume in parallel
                               ▼
                      ┌─────────────────┐
                      │ Fanout Workers  │
                      │  (background)   │
                      └────────┬────────┘
                               │
              Push to 500K WebSocket connections
                               ▼
                    [Trader1, Trader2, ... Trader500K]
`,

  keyPoints: [
    'Pub/Sub pattern: publish once, many subscribers receive',
    'Topics per stock symbol for efficient routing',
    'Workers fan out in parallel for speed',
    'Essential for popular stocks with 100K+ watchers',
  ],

  quickCheck: {
    question: 'Why use a message queue for price updates?',
    options: [
      'Message queues are faster than databases',
      'To fan out one update to many users without blocking',
      'Required by trading regulations',
      'To reduce storage costs',
    ],
    correctIndex: 1,
    explanation: 'Message queue decouples receiving the update from fanning out to users. App server publishes instantly, workers handle fanout in parallel.',
  },

  keyConcepts: [
    { title: 'Fanout', explanation: 'Delivering one update to many recipients', icon: '📡' },
    { title: 'Pub/Sub', explanation: 'Publish/Subscribe messaging pattern', icon: '📬' },
    { title: 'Topic', explanation: 'Channel for specific stock updates', icon: '📢' },
  ],
};

const step5: GuidedStep = {
  id: 'stock-prices-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-1, FR-2: Scalable price update fanout',
    taskDescription: 'Add a Message Queue for pub/sub fanout',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Pub/sub for price update fanout', displayName: 'Kafka' },
    ],
    successCriteria: [
      'Message Queue component added',
      'App Server connected to Message Queue',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'websocket', 'app_server', 'database', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Message Queue (Kafka) for pub/sub pattern',
    level2: 'Connect App Server to Message Queue for price update fanout',
    solutionComponents: [{ type: 'message_queue' }],
    solutionConnections: [{ from: 'app_server', to: 'message_queue' }],
  },
};

// =============================================================================
// STEP 6: Add Cache and Load Balancer for Scale
// =============================================================================

const step6Story: StoryContent = {
  emoji: '🔥',
  scenario: "Market just opened! 1 million traders connected simultaneously.",
  hook: "Your single WebSocket gateway is maxed out. Database is overwhelmed with historical data queries. The system is crashing!",
  challenge: "Add Load Balancer for WebSocket scaling and Cache for historical data.",
  illustration: 'traffic-surge',
};

const step6Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Your stock price system is production-ready!',
  achievement: 'Scaled to handle millions of concurrent traders',
  metrics: [
    { label: 'Concurrent connections', before: '100K', after: '1M+' },
    { label: 'Historical query latency', before: '500ms', after: '10ms' },
    { label: 'System availability', after: '99.9%' },
  ],
  nextTeaser: "You've built a complete real-time stock price system!",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling to Production: Load Balancing & Caching',
  conceptExplanation: `To handle 1M concurrent traders, we need two final components:

**1. Load Balancer**
- Distributes WebSocket connections across multiple gateways
- Sticky sessions keep each trader on same gateway
- Enables horizontal scaling: 1 gateway = 50K connections → 20 gateways = 1M

**2. Cache (Redis)**
- Caches historical price data (daily/weekly candles)
- Recent data (today's 1-min candles) changes frequently, but older data is static
- Cache hit rate: 90%+ for historical queries
- Reduces database load by 10x

Combined, they provide:
- **Horizontal scalability**: Add more gateways for more connections
- **Low latency**: Historical charts load in 10ms from cache
- **High availability**: Multiple gateways mean no single point of failure`,

  whyItMatters: 'Production systems must handle peak traffic and provide consistent low latency. Load balancers and caches are essential infrastructure.',

  famousIncident: {
    title: 'Schwab Trading Platform Outage',
    company: 'Charles Schwab',
    year: '2020',
    whatHappened: 'Market volatility caused record trading volume. Schwab\'s systems weren\'t scaled to handle 5x normal traffic. Price feeds lagged by minutes, charts failed to load. Lasted several hours during critical trading time.',
    lessonLearned: 'Always design for 3-5x peak capacity. Auto-scaling alone isn\'t enough - you need properly architected load balancing and caching from the start.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Fidelity Investments',
    scenario: 'Serving real-time data to millions during market hours',
    howTheyDoIt: 'Uses load balancer clusters for WebSocket gateways, Redis clusters for caching historical data. Can handle 10x normal volume during market events.',
  },

  diagram: `
┌────────┐     ┌──────────┐     ┌────────────┐
│ Client │────▶│   Load   │────▶│  WS GW 1   │
└────────┘     │ Balancer │     │  WS GW 2   │
               └──────────┘     │  WS GW 3   │
                                └──────┬─────┘
                                       │
                                ┌──────▼─────┐     ┌────────┐
                                │ App Server │────▶│ Cache  │
                                └──────┬─────┘     │ Redis  │
                                       │           └────────┘
                                ┌──────▼─────┐
                                │  Database  │
                                └────────────┘
`,

  keyPoints: [
    'Load Balancer distributes WebSocket connections',
    'Sticky sessions for stateful WebSocket',
    'Cache historical data (static after day ends)',
    'Cache hit rate 90%+ reduces database load',
  ],

  quickCheck: {
    question: 'Why cache historical stock price data?',
    options: [
      'Historical data never changes after the day ends',
      'Databases are too slow for any query',
      'Caching is required by regulations',
      'To save money on storage',
    ],
    correctIndex: 0,
    explanation: 'Historical candles (yesterday, last week) are immutable - perfect for caching. Cache hit = instant response. Only today\'s data changes.',
  },

  keyConcepts: [
    { title: 'Load Balancer', explanation: 'Distributes connections across servers', icon: '⚖️' },
    { title: 'Sticky Session', explanation: 'Keep user on same WebSocket gateway', icon: '📌' },
    { title: 'Cache Hit Rate', explanation: 'Percentage of requests served from cache', icon: '🎯' },
  ],
};

const step6: GuidedStep = {
  id: 'stock-prices-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'All FRs at scale: 1M users, sub-second latency',
    taskDescription: 'Add Load Balancer and Cache to complete the architecture',
    componentsNeeded: [
      { type: 'load_balancer', reason: 'Scale WebSocket connections', displayName: 'Load Balancer' },
      { type: 'cache', reason: 'Cache historical price data', displayName: 'Redis Cache' },
    ],
    successCriteria: [
      'Load Balancer added between Client and WebSocket Gateway',
      'Cache added between App Server and Database',
      'All components properly connected',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'load_balancer', 'websocket', 'app_server', 'database', 'message_queue', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'load_balancer' },
      { fromType: 'load_balancer', toType: 'websocket' },
      { fromType: 'websocket', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add Load Balancer before WebSocket Gateway, and Cache before Database',
    level2: 'Client → Load Balancer → WebSocket → App Server → Database/Cache/Queue',
    solutionComponents: [{ type: 'load_balancer' }, { type: 'cache' }],
    solutionConnections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'websocket' },
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const stockPriceUpdatesGuidedTutorial: GuidedTutorial = {
  problemId: 'stock-price-updates',
  title: 'Design Real-Time Stock Price Updates',
  description: 'Build a scalable stock price system with WebSocket streaming, time-series storage, and efficient fanout',
  difficulty: 'advanced',
  estimatedMinutes: 45,

  welcomeStory: {
    emoji: '📈',
    hook: "You've been hired as Lead Engineer at a FinTech Trading Platform!",
    scenario: "Your mission: Build a real-time stock price system that streams updates to millions of traders with sub-second latency.",
    challenge: "Can you handle WebSocket connections, massive fanout, and time-series data at scale?",
  },

  requirementsPhase: stockPriceUpdatesRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6],

  concepts: [
    'Client-Server Architecture',
    'API Design',
    'Time-Series Database',
    'WebSocket Streaming',
    'Real-Time Push vs Polling',
    'Message Queues',
    'Pub/Sub Pattern',
    'Price Update Fanout',
    'Load Balancing',
    'Sticky Sessions',
    'Caching Strategies',
    'Market Hours Patterns',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval',
    'Chapter 11: Stream Processing',
    'Chapter 12: The Future of Data Systems',
  ],
};

export default stockPriceUpdatesGuidedTutorial;
