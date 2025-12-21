import { GuidedTutorial } from '../../types/guidedTutorial';

export const stockTradingProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'stock-trading-progressive',
  title: 'Design a Stock Trading System',
  description: 'Build a trading platform from order matching to high-frequency trading infrastructure',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design order book with price-time priority matching',
    'Implement real-time market data distribution',
    'Handle order types (market, limit, stop)',
    'Build risk management and position tracking',
    'Optimize for low-latency trading'
  ],
  prerequisites: ['Financial basics', 'Low-latency systems', 'Data structures'],
  tags: ['trading', 'fintech', 'low-latency', 'matching-engine', 'market-data'],

  progressiveStory: {
    title: 'Stock Trading System Evolution',
    premise: "You're building a stock trading platform. Starting with basic order placement, you'll evolve to handle millions of orders with microsecond latency and real-time risk management.",
    phases: [
      { phase: 1, title: 'Order Management', description: 'Place and track orders' },
      { phase: 2, title: 'Matching Engine', description: 'Match buy and sell orders' },
      { phase: 3, title: 'Market Data', description: 'Real-time quotes and trades' },
      { phase: 4, title: 'Production Trading', description: 'Risk management and low-latency' }
    ]
  },

  steps: [
    // PHASE 1: Order Management (Steps 1-3)
    {
      id: 'step-1',
      title: 'Order Data Model',
      phase: 1,
      phaseTitle: 'Order Management',
      learningObjective: 'Design order structure with all required fields',
      thinkingFramework: {
        framework: 'Complete Order Representation',
        approach: 'Order must capture: what (symbol), direction (buy/sell), quantity, price (for limits), type, status. Immutable once submitted, amendments create new orders.',
        keyInsight: 'Order ID must be unique and sequential for audit. Timestamp precision matters: microsecond or nanosecond for HFT.'
      },
      requirements: {
        functional: [
          'Define order with symbol, side, quantity, price',
          'Support order types (market, limit)',
          'Track order status (new, partial, filled, cancelled)',
          'Assign unique order ID'
        ],
        nonFunctional: []
      },
      hints: [
        'Order: {id, symbol, side: buy|sell, type, qty, price, status, timestamp}',
        'Status flow: new → partial_fill → filled OR cancelled',
        'Filled qty tracked separately from original qty'
      ],
      expectedComponents: ['Order Model', 'Order Store', 'ID Generator'],
      successCriteria: ['Orders created correctly', 'Status tracked'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Order Validation',
      phase: 1,
      phaseTitle: 'Order Management',
      learningObjective: 'Validate orders before acceptance',
      thinkingFramework: {
        framework: 'Pre-Trade Checks',
        approach: 'Validate: account has sufficient funds/shares, symbol is valid and tradeable, price is within limits, quantity meets minimums.',
        keyInsight: 'Reject invalid orders immediately. Dont let bad orders reach matching engine. Reduces downstream complexity and risk.'
      },
      requirements: {
        functional: [
          'Validate account has sufficient balance',
          'Check symbol is tradeable',
          'Verify price within daily limits',
          'Ensure quantity meets lot size requirements'
        ],
        nonFunctional: [
          'Validation < 1ms'
        ]
      },
      hints: [
        'Balance check: available_cash >= order_value for buys',
        'Price limits: within 10% of last trade (circuit breaker)',
        'Lot size: must be multiple of 1 for most stocks'
      ],
      expectedComponents: ['Order Validator', 'Balance Checker', 'Symbol Registry'],
      successCriteria: ['Invalid orders rejected', 'Valid orders accepted'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Order Lifecycle',
      phase: 1,
      phaseTitle: 'Order Management',
      learningObjective: 'Handle order amendments and cancellations',
      thinkingFramework: {
        framework: 'State Machine',
        approach: 'Order states: new → acknowledged → partial → filled/cancelled. Transitions trigger events. Cancel only unfilled portion.',
        keyInsight: 'Race condition: cancel arrives while order is being filled. Must handle atomically. Filled quantity cannot be cancelled.'
      },
      requirements: {
        functional: [
          'Support order cancellation',
          'Support order amendment (price, quantity)',
          'Handle partial fills',
          'Notify on state changes'
        ],
        nonFunctional: [
          'Cancel latency < 10ms'
        ]
      },
      hints: [
        'Cancel: only remaining_qty can be cancelled',
        'Amend: creates new order, cancels old (cancel-replace)',
        'Partial fill: update filled_qty, check if complete'
      ],
      expectedComponents: ['Order State Machine', 'Cancel Handler', 'Amendment Handler'],
      successCriteria: ['Cancellations work', 'Amendments handled'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Matching Engine (Steps 4-6)
    {
      id: 'step-4',
      title: 'Order Book Structure',
      phase: 2,
      phaseTitle: 'Matching Engine',
      learningObjective: 'Build order book with price levels',
      thinkingFramework: {
        framework: 'Price-Time Priority',
        approach: 'Order book: bids (buys) sorted high to low, asks (sells) sorted low to high. At each price: queue of orders by time. Best bid meets best ask = trade.',
        keyInsight: 'Data structure matters for performance. Sorted map for price levels (O(log N) insert), queue per level (O(1) insert). Or array for limited price range.'
      },
      requirements: {
        functional: [
          'Maintain bid and ask sides',
          'Sort by price (best first)',
          'FIFO within price level',
          'Support add, remove, update operations'
        ],
        nonFunctional: [
          'Add order: O(log N) or better',
          'Match: O(1) for best price'
        ]
      },
      hints: [
        'Bid side: TreeMap<price, Queue<Order>> descending',
        'Ask side: TreeMap<price, Queue<Order>> ascending',
        'Best bid: bids.firstKey(), best ask: asks.firstKey()'
      ],
      expectedComponents: ['Order Book', 'Price Level', 'Order Queue'],
      successCriteria: ['Orders organized by price-time', 'Best bid/ask accessible'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Order Matching',
      phase: 2,
      phaseTitle: 'Matching Engine',
      learningObjective: 'Match incoming orders against book',
      thinkingFramework: {
        framework: 'Aggressive vs Passive',
        approach: 'Incoming order is aggressor. If buy >= best ask, trade. If sell <= best bid, trade. Execute at resting orders price. Continue until no match or filled.',
        keyInsight: 'Market order: execute immediately at any price. Limit order: execute only at limit or better. Unfilled limit orders rest in book.'
      },
      requirements: {
        functional: [
          'Match market orders immediately',
          'Match limit orders at limit or better',
          'Handle partial fills',
          'Generate trade records'
        ],
        nonFunctional: [
          'Match latency < 100 microseconds'
        ]
      },
      hints: [
        'Match buy: while order.price >= best_ask and remaining > 0',
        'Trade at resting order price (price improvement for aggressor)',
        'Trade: {buy_order_id, sell_order_id, price, qty, timestamp}'
      ],
      expectedComponents: ['Matching Engine', 'Trade Generator', 'Fill Handler'],
      successCriteria: ['Orders match correctly', 'Trades generated'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Advanced Order Types',
      phase: 2,
      phaseTitle: 'Matching Engine',
      learningObjective: 'Support stop orders and time-in-force',
      thinkingFramework: {
        framework: 'Conditional Orders',
        approach: 'Stop order: trigger when price reaches stop price, then execute as market/limit. IOC (Immediate or Cancel): fill what you can, cancel rest.',
        keyInsight: 'Stop orders are not in order book until triggered. Separate stop book, check on each trade. Can cause cascading executions.'
      },
      requirements: {
        functional: [
          'Stop market and stop limit orders',
          'Time in force: GTC, DAY, IOC, FOK',
          'Trigger stops on price movement',
          'Handle complex order combinations'
        ],
        nonFunctional: []
      },
      hints: [
        'Stop: {trigger_price, order_type} - not in book until triggered',
        'IOC: match immediately, cancel unfilled portion',
        'FOK (Fill or Kill): all or nothing, no partial'
      ],
      expectedComponents: ['Stop Book', 'Trigger Monitor', 'TIF Handler'],
      successCriteria: ['Stop orders trigger correctly', 'TIF rules enforced'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Market Data (Steps 7-9)
    {
      id: 'step-7',
      title: 'Quote Distribution',
      phase: 3,
      phaseTitle: 'Market Data',
      learningObjective: 'Publish real-time bid/ask quotes',
      thinkingFramework: {
        framework: 'Level 1 vs Level 2',
        approach: 'Level 1: best bid/ask only. Level 2: full order book depth. Publish on every change. High frequency: throttle updates.',
        keyInsight: 'Every order book change generates quote update. Batch updates within small window (1ms) to reduce message rate.'
      },
      requirements: {
        functional: [
          'Publish best bid/ask (Level 1)',
          'Publish order book depth (Level 2)',
          'Update on every book change',
          'Support subscription model'
        ],
        nonFunctional: [
          'Quote latency < 1ms from match',
          'Support 100K subscribers'
        ]
      },
      hints: [
        'Quote: {symbol, bid, bid_size, ask, ask_size, timestamp}',
        'Depth: [{price, size}] for each side',
        'Multicast or WebSocket for distribution'
      ],
      expectedComponents: ['Quote Publisher', 'Depth Publisher', 'Subscription Manager'],
      successCriteria: ['Quotes published immediately', 'Subscribers receive updates'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Trade Reporting',
      phase: 3,
      phaseTitle: 'Market Data',
      learningObjective: 'Publish trade executions',
      thinkingFramework: {
        framework: 'Time & Sales',
        approach: 'Every trade published: price, quantity, time, aggressor side. Aggregated statistics: OHLC (Open High Low Close), volume, VWAP.',
        keyInsight: 'Trade data must be exact. Price and quantity determine P&L. Audit trail for regulatory compliance.'
      },
      requirements: {
        functional: [
          'Publish individual trades',
          'Calculate OHLC candles',
          'Track daily volume and VWAP',
          'Support historical trade queries'
        ],
        nonFunctional: [
          'Trade publication < 1ms'
        ]
      },
      hints: [
        'Trade tick: {symbol, price, qty, side, timestamp}',
        'OHLC: aggregate over time window (1m, 5m, 1h)',
        'VWAP: sum(price*qty) / sum(qty)'
      ],
      expectedComponents: ['Trade Publisher', 'Candle Aggregator', 'Trade Store'],
      successCriteria: ['Trades published correctly', 'OHLC calculated'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Market Data Feed',
      phase: 3,
      phaseTitle: 'Market Data',
      learningObjective: 'Build consolidated market data infrastructure',
      thinkingFramework: {
        framework: 'Feed Handler Architecture',
        approach: 'Normalize data from multiple sources/exchanges. Sequence for ordering. Replay from sequence for recovery. Low-latency distribution.',
        keyInsight: 'Sequence numbers enable gap detection and replay. If subscriber misses seq 100-105, request retransmission.'
      },
      requirements: {
        functional: [
          'Normalize multi-source data',
          'Assign sequence numbers',
          'Support replay from sequence',
          'Handle gap detection and recovery'
        ],
        nonFunctional: [
          'Feed latency < 100 microseconds'
        ]
      },
      hints: [
        'Message: {seq_num, timestamp, type, payload}',
        'Gap detection: expected_seq != received_seq',
        'Replay: request messages from seq X to Y'
      ],
      expectedComponents: ['Feed Normalizer', 'Sequencer', 'Replay Service'],
      successCriteria: ['Data sequenced correctly', 'Gaps recoverable'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Production Trading (Steps 10-12)
    {
      id: 'step-10',
      title: 'Position & P&L Tracking',
      phase: 4,
      phaseTitle: 'Production Trading',
      learningObjective: 'Track positions and calculate profit/loss',
      thinkingFramework: {
        framework: 'Real-Time Position',
        approach: 'Position = net shares held. Update on every fill. P&L = (current_price - avg_cost) * quantity. Mark-to-market continuously.',
        keyInsight: 'Average cost calculation: FIFO, LIFO, or weighted average. Different methods give different P&L. Choose based on accounting requirements.'
      },
      requirements: {
        functional: [
          'Track position per symbol per account',
          'Calculate average cost basis',
          'Compute unrealized P&L (mark-to-market)',
          'Compute realized P&L on position close'
        ],
        nonFunctional: [
          'Position update < 1ms after fill'
        ]
      },
      hints: [
        'Position: {symbol, quantity, avg_cost, realized_pnl}',
        'On fill: quantity += fill_qty, recalculate avg_cost',
        'Unrealized: (market_price - avg_cost) * quantity'
      ],
      expectedComponents: ['Position Manager', 'P&L Calculator', 'Cost Basis Tracker'],
      successCriteria: ['Positions accurate', 'P&L calculated correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Risk Management',
      phase: 4,
      phaseTitle: 'Production Trading',
      learningObjective: 'Enforce risk limits in real-time',
      thinkingFramework: {
        framework: 'Pre-Trade Risk',
        approach: 'Check risk before order execution: position limits, order size limits, loss limits, buying power. Reject orders that breach limits.',
        keyInsight: 'Risk checks must be synchronous in order path. Cannot accept order then fail on risk. Gate before matching engine.'
      },
      requirements: {
        functional: [
          'Enforce position limits per symbol',
          'Enforce daily loss limits',
          'Check buying power before trades',
          'Support risk limit configuration'
        ],
        nonFunctional: [
          'Risk check < 100 microseconds',
          'Zero limit breaches'
        ]
      },
      hints: [
        'Position limit: would_be_position <= max_position',
        'Loss limit: realized_pnl + unrealized_pnl >= -max_loss',
        'Buying power: available_cash >= order_value * margin_requirement'
      ],
      expectedComponents: ['Risk Engine', 'Limit Manager', 'Buying Power Calculator'],
      successCriteria: ['Risk limits enforced', 'Breaching orders rejected'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Low-Latency Optimization',
      phase: 4,
      phaseTitle: 'Production Trading',
      learningObjective: 'Optimize for microsecond latency',
      thinkingFramework: {
        framework: 'Latency Engineering',
        approach: 'Every microsecond matters in trading. Optimizations: kernel bypass (DPDK), lock-free structures, pre-allocated memory, co-location.',
        keyInsight: 'Measure latency at each stage. 99th percentile matters more than average. Tail latency causes missed opportunities.'
      },
      requirements: {
        functional: [
          'Minimize network latency (kernel bypass)',
          'Use lock-free data structures',
          'Pre-allocate memory (no GC pauses)',
          'Optimize for cache locality'
        ],
        nonFunctional: [
          'Order-to-ack: < 50 microseconds',
          'p99 latency < 2x median'
        ]
      },
      hints: [
        'Kernel bypass: DPDK, Solarflare OpenOnload',
        'Lock-free: Disruptor pattern for queues',
        'Memory: object pools, arena allocators'
      ],
      expectedComponents: ['Network Stack', 'Lock-Free Queue', 'Memory Pool'],
      successCriteria: ['Latency targets met', 'Consistent performance'],
      estimatedTime: '10 minutes'
    }
  ]
};
