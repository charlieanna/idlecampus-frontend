import { GuidedTutorial } from '../../types/guidedTutorial';

export const doordashProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'doordash-progressive',
  title: 'Design DoorDash - Food Delivery Platform',
  description: 'Build a food delivery system from restaurant search to ML-powered dispatch',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Model restaurants, menus, and real-time availability',
    'Design geospatial search and driver matching',
    'Build real-time order tracking with location updates',
    'Implement smart dispatch algorithms and surge pricing',
    'Add ML-powered ETAs and fraud prevention'
  ],
  prerequisites: ['Database design', 'Geospatial indexing', 'Real-time systems'],
  tags: ['food-delivery', 'geospatial', 'real-time', 'marketplace', 'logistics'],

  progressiveStory: {
    title: 'DoorDash Evolution',
    premise: "You're building a food delivery platform starting in one city. As you grow to serve millions of orders daily, you'll tackle increasingly complex logistics challenges.",
    phases: [
      { phase: 1, title: 'Restaurant Marketplace', description: 'Build restaurant discovery and ordering' },
      { phase: 2, title: 'Delivery Operations', description: 'Add drivers and real-time tracking' },
      { phase: 3, title: 'Smart Logistics', description: 'Optimize dispatch and handle demand spikes' },
      { phase: 4, title: 'Intelligence Platform', description: 'ML predictions and fraud prevention' }
    ]
  },

  steps: [
    // PHASE 1: Restaurant Marketplace (Steps 1-3)
    {
      id: 'step-1',
      title: 'Restaurant & Menu Modeling',
      phase: 1,
      phaseTitle: 'Restaurant Marketplace',
      learningObjective: 'Model restaurants with menus, hours, and item availability',
      thinkingFramework: {
        framework: 'Data Modeling First',
        approach: 'For marketplaces, the data model determines everything. Menu items need modifiers (size, toppings), availability changes in real-time, and prices can vary by time/location.',
        keyInsight: 'Modifier groups (required vs optional, single vs multi-select) are the hardest part of menu modeling.'
      },
      requirements: {
        functional: [
          'Store restaurant info: name, address, cuisine types, hours',
          'Model menus with categories and items',
          'Support item modifiers (sizes, add-ons, special instructions)',
          'Track real-time item availability'
        ],
        nonFunctional: []
      },
      hints: [
        'Separate modifier groups from modifier options',
        'Hours need timezone handling and holiday overrides',
        'Item availability changes frequently - design for updates'
      ],
      expectedComponents: ['Restaurant Service', 'Menu Database', 'Client App'],
      successCriteria: ['Menus load with modifiers', 'Availability reflects real-time status'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Restaurant Search & Discovery',
      phase: 1,
      phaseTitle: 'Restaurant Marketplace',
      learningObjective: 'Build location-based restaurant search with filters',
      thinkingFramework: {
        framework: 'Geospatial Indexing',
        approach: 'Users search by "restaurants near me" - you need efficient spatial queries. Geohash or PostGIS for location, with filters for cuisine, rating, delivery time.',
        keyInsight: 'Delivery radius is not a simple circle - it depends on traffic, driver availability, and restaurant prep time.'
      },
      requirements: {
        functional: [
          'Search restaurants by location (address or GPS)',
          'Filter by cuisine type, rating, price range',
          'Show estimated delivery time for each restaurant',
          'Sort by relevance, rating, distance, or delivery time'
        ],
        nonFunctional: []
      },
      hints: [
        'Use geohash for efficient nearby queries',
        'Pre-compute delivery zones, not just distance',
        'Cache popular search results by area'
      ],
      expectedComponents: ['Search Service', 'Geospatial Index', 'Restaurant Service'],
      successCriteria: ['Nearby restaurants load in <500ms', 'Filters work correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Cart & Order Placement',
      phase: 1,
      phaseTitle: 'Restaurant Marketplace',
      learningObjective: 'Build cart management and order creation',
      thinkingFramework: {
        framework: 'State Consistency',
        approach: 'Carts are ephemeral but orders are permanent. The transition (checkout) must validate prices, availability, and delivery feasibility atomically.',
        keyInsight: 'Price can change between adding to cart and checkout. Always re-validate at order time.'
      },
      requirements: {
        functional: [
          'Add/remove items with modifiers to cart',
          'Calculate subtotal, fees, taxes, and tip',
          'Validate order at checkout (items available, restaurant open)',
          'Process payment and create order record'
        ],
        nonFunctional: []
      },
      hints: [
        'Store cart in Redis for fast access',
        'Lock prices at order creation, not cart addition',
        'Handle partial availability gracefully'
      ],
      expectedComponents: ['Cart Service', 'Order Service', 'Payment Service'],
      successCriteria: ['Cart persists across sessions', 'Checkout validates all constraints'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Delivery Operations (Steps 4-6)
    {
      id: 'step-4',
      title: 'Driver Management',
      phase: 2,
      phaseTitle: 'Delivery Operations',
      learningObjective: 'Track driver location, availability, and assignments',
      thinkingFramework: {
        framework: 'Real-Time State',
        approach: 'Drivers are mobile entities updating location every few seconds. You need efficient storage for current location and recent history for ETA calculations.',
        keyInsight: 'Use Redis GEO for current locations (O(log N) spatial queries), archive history to time-series DB for analytics.'
      },
      requirements: {
        functional: [
          'Track driver real-time location (GPS updates)',
          'Manage driver status: offline, available, on delivery',
          'Store driver info: vehicle type, delivery zones, ratings',
          'Query available drivers near a restaurant'
        ],
        nonFunctional: []
      },
      hints: [
        'Redis GEOADD/GEORADIUS for spatial queries',
        'Batch location updates to reduce write load',
        'Separate hot (current) from cold (historical) data'
      ],
      expectedComponents: ['Driver Service', 'Location Store (Redis GEO)', 'Driver App'],
      successCriteria: ['Find nearby drivers in <100ms', 'Location updates every 5 seconds'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Order Dispatch',
      phase: 2,
      phaseTitle: 'Delivery Operations',
      learningObjective: 'Match orders to drivers with acceptance workflow',
      thinkingFramework: {
        framework: 'Offer-Based Assignment',
        approach: "Don't auto-assign - offer the delivery to drivers who can accept/decline. This respects driver autonomy and gets better acceptance rates than forced assignment.",
        keyInsight: 'Sequential offers (one at a time with timeout) vs broadcast (first to accept wins) have different tradeoffs for fairness and speed.'
      },
      requirements: {
        functional: [
          'Find eligible drivers when order is ready for dispatch',
          'Send delivery offer with order details and payout',
          'Handle accept/decline with timeout (auto-decline)',
          'Re-offer to next driver if declined or timed out'
        ],
        nonFunctional: []
      },
      hints: [
        'Rank drivers by proximity, rating, acceptance rate',
        'Set offer timeout (30-60 seconds)',
        'Track offer history for debugging and optimization'
      ],
      expectedComponents: ['Dispatch Service', 'Offer Queue', 'Driver App'],
      successCriteria: ['Orders assigned within 2 minutes', 'Offer flow handles timeouts'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Real-Time Order Tracking',
      phase: 2,
      phaseTitle: 'Delivery Operations',
      learningObjective: 'Build live tracking for customers and restaurants',
      thinkingFramework: {
        framework: 'Event-Driven Updates',
        approach: 'Order status changes (confirmed, preparing, picked up, arriving) plus live driver location. Use WebSocket for push updates, with polling fallback.',
        keyInsight: 'Throttle location updates to customers (every 10s is enough) even if driver updates more frequently.'
      },
      requirements: {
        functional: [
          'Push order status changes to customer app',
          'Stream driver location during delivery',
          'Show ETA that updates as driver moves',
          'Notify on key events: picked up, arriving, delivered'
        ],
        nonFunctional: []
      },
      hints: [
        'WebSocket with room per order',
        'Interpolate positions between updates for smooth UI',
        'Cache last known position for reconnection'
      ],
      expectedComponents: ['Tracking Service', 'WebSocket Gateway', 'Notification Service'],
      successCriteria: ['Live map updates smoothly', 'Status changes push immediately'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Smart Logistics (Steps 7-9)
    {
      id: 'step-7',
      title: 'Smart Dispatch Algorithm',
      phase: 3,
      phaseTitle: 'Smart Logistics',
      learningObjective: 'Optimize driver assignment for efficiency',
      thinkingFramework: {
        framework: 'Multi-Factor Optimization',
        approach: 'Simple nearest-driver is suboptimal. Consider: current order load, driver heading/momentum, restaurant prep time alignment, and batching potential.',
        keyInsight: 'A driver 5 min away heading toward the restaurant is better than one 3 min away heading opposite direction.'
      },
      requirements: {
        functional: [
          'Score drivers on multiple factors (distance, heading, load)',
          'Align dispatch with restaurant prep time',
          'Consider driver completion time for current deliveries',
          'Support order batching (multiple orders, one driver)'
        ],
        nonFunctional: [
          'Process 1000 orders/second dispatch decisions'
        ]
      },
      hints: [
        'Weighted scoring: distance(40%) + heading(20%) + load(20%) + rating(20%)',
        'Predict restaurant ready time from historical data',
        'Batch orders going same direction from nearby restaurants'
      ],
      expectedComponents: ['Smart Dispatch Engine', 'Scoring Service', 'Batch Optimizer'],
      successCriteria: ['Driver utilization improves 20%', 'Average delivery time decreases'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Dynamic Pricing & Surge',
      phase: 3,
      phaseTitle: 'Smart Logistics',
      learningObjective: 'Balance supply and demand with dynamic pricing',
      thinkingFramework: {
        framework: 'Supply-Demand Economics',
        approach: 'When orders exceed drivers, increase delivery fee (and driver payout) to attract more drivers and reduce demand. The goal is market clearing, not profit maximization.',
        keyInsight: 'Surge should be zone-based and time-decayed. Show surge clearly to maintain user trust.'
      },
      requirements: {
        functional: [
          'Monitor supply/demand ratio by zone',
          'Calculate surge multiplier based on imbalance',
          'Apply surge to delivery fees transparently',
          'Increase driver payout during surge to attract supply'
        ],
        nonFunctional: [
          'Update surge pricing every 5 minutes',
          'Smooth transitions (no sudden 3x jumps)'
        ]
      },
      hints: [
        'Divide city into hexagonal zones (H3)',
        'Exponential smoothing for demand prediction',
        'Cap surge multiplier (2.5x max) for fairness'
      ],
      expectedComponents: ['Pricing Engine', 'Demand Forecaster', 'Zone Manager'],
      successCriteria: ['Surge attracts drivers to high-demand areas', 'User sees surge before ordering'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Restaurant Integration & Tablets',
      phase: 3,
      phaseTitle: 'Smart Logistics',
      learningObjective: 'Connect restaurants with order management systems',
      thinkingFramework: {
        framework: 'Integration Patterns',
        approach: 'Restaurants need reliable order receipt. Support multiple channels: tablet app, POS integration, thermal printer, or even phone call fallback.',
        keyInsight: 'Order acknowledgment is critical. If restaurant misses an order, customer waits forever. Build redundancy.'
      },
      requirements: {
        functional: [
          'Push orders to restaurant tablet in real-time',
          'Support order acknowledgment and prep time updates',
          'Integrate with restaurant POS systems via API',
          'Provide fallback (phone, fax) for failed deliveries'
        ],
        nonFunctional: [
          'Order delivery to restaurant: 99.9% reliability',
          'Acknowledgment within 5 minutes required'
        ]
      },
      hints: [
        'Persistent connection with heartbeat for tablets',
        'Escalation path: push → call → pause restaurant',
        'Webhook + polling for POS integrations'
      ],
      expectedComponents: ['Restaurant Gateway', 'Tablet App', 'POS Adapter', 'Alert Service'],
      successCriteria: ['Orders reach restaurant reliably', 'Unacknowledged orders escalate'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Intelligence Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'ML-Powered ETA Prediction',
      phase: 4,
      phaseTitle: 'Intelligence Platform',
      learningObjective: 'Predict delivery time with machine learning',
      thinkingFramework: {
        framework: 'ML for Operations',
        approach: 'ETA = prep_time + pickup_time + travel_time + dropoff_time. Each component can be predicted with features like restaurant history, traffic, weather, driver patterns.',
        keyInsight: 'Underpromise and overdeliver. Showing 35 min and delivering in 30 is better than showing 25 and delivering in 30.'
      },
      requirements: {
        functional: [
          'Predict restaurant prep time from historical data',
          'Estimate travel time with real-time traffic',
          'Factor in weather, time of day, restaurant load',
          'Update ETA dynamically as order progresses'
        ],
        nonFunctional: [
          'ETA accuracy within 5 minutes for 90% of orders'
        ]
      },
      hints: [
        'Gradient boosting works well for ETA prediction',
        'Features: restaurant avg prep, current queue, item complexity',
        'Recalculate ETA at each status change'
      ],
      expectedComponents: ['ETA Service', 'ML Model', 'Feature Store', 'Traffic API'],
      successCriteria: ['ETAs are accurate and build trust', 'Model improves with more data'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Fraud Prevention',
      phase: 4,
      phaseTitle: 'Intelligence Platform',
      learningObjective: 'Detect and prevent fraud from all marketplace participants',
      thinkingFramework: {
        framework: 'Multi-Actor Fraud',
        approach: 'Fraud comes from customers (chargebacks, promo abuse), drivers (GPS spoofing, fake deliveries), and restaurants (inflated refunds). Each needs different signals.',
        keyInsight: 'The goal is fraud prevention (blocking bad actors) not just detection (after the fact). Use risk scores to gate high-risk actions.'
      },
      requirements: {
        functional: [
          'Score orders for fraud risk at checkout',
          'Detect driver GPS anomalies and fake deliveries',
          'Identify promo abuse patterns (multi-accounting)',
          'Flag suspicious refund patterns from restaurants'
        ],
        nonFunctional: [
          'Block 95% of fraud while <1% false positive rate'
        ]
      },
      hints: [
        'Device fingerprinting for multi-account detection',
        'GPS velocity checks (impossible travel)',
        'Graph analysis for promo abuse rings'
      ],
      expectedComponents: ['Fraud Engine', 'Risk Scoring', 'Device Fingerprint', 'Case Management'],
      successCriteria: ['Fraud losses decrease significantly', 'Legitimate users not impacted'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Merchant Analytics & Insights',
      phase: 4,
      phaseTitle: 'Intelligence Platform',
      learningObjective: 'Provide actionable analytics to restaurant partners',
      thinkingFramework: {
        framework: 'Partner Success',
        approach: "Restaurants are partners, not just suppliers. Give them data to improve: peak hours, popular items, missed opportunities, comparison to similar restaurants.",
        keyInsight: 'Actionable insights > vanity metrics. "Add a combo meal to increase AOV by 15%" is better than "Your AOV is $28".'
      },
      requirements: {
        functional: [
          'Dashboard with sales, orders, ratings over time',
          'Menu performance: top sellers, items never ordered',
          'Operational metrics: prep time, cancellation rate',
          'Competitive insights (anonymized market data)'
        ],
        nonFunctional: [
          'Real-time dashboard updates',
          'Historical data retention: 2 years'
        ]
      },
      hints: [
        'Pre-aggregate metrics for fast dashboard loads',
        'Anomaly detection for alerting (sudden rating drop)',
        'Cohort analysis for benchmarking'
      ],
      expectedComponents: ['Analytics Service', 'Data Warehouse', 'Merchant Dashboard', 'Alert Engine'],
      successCriteria: ['Restaurants use dashboard weekly', 'Actionable insights drive behavior'],
      estimatedTime: '8 minutes'
    }
  ]
};
