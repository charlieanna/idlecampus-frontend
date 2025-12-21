import { GuidedTutorial } from '../../types/guidedTutorial';

export const instacartProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'instacart-progressive',
  title: 'Design Instacart',
  description: 'Build a grocery delivery platform from basic ordering to real-time shopper coordination',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design multi-store inventory and catalog',
    'Implement real-time shopper dispatch',
    'Build order fulfillment with substitutions',
    'Handle delivery time slot management',
    'Scale to millions of orders'
  ],
  prerequisites: ['E-commerce', 'Real-time systems', 'Logistics'],
  tags: ['grocery', 'delivery', 'logistics', 'real-time', 'marketplace'],

  progressiveStory: {
    title: 'Instacart Evolution',
    premise: "You're building a grocery delivery platform. Starting with basic store browsing and ordering, you'll evolve to support real-time shopper coordination, intelligent substitutions, and delivery optimization.",
    phases: [
      { phase: 1, title: 'Catalog & Orders', description: 'Browse and order' },
      { phase: 2, title: 'Fulfillment', description: 'Shopper coordination' },
      { phase: 3, title: 'Delivery', description: 'Time slots and tracking' },
      { phase: 4, title: 'Scale', description: 'Optimization and growth' }
    ]
  },

  steps: [
    // PHASE 1: Catalog & Orders (Steps 1-3)
    {
      id: 'step-1',
      title: 'Store and Product Catalog',
      phase: 1,
      phaseTitle: 'Catalog & Orders',
      learningObjective: 'Aggregate products from multiple stores',
      thinkingFramework: {
        framework: 'Multi-Tenant Catalog',
        approach: 'Same product exists at multiple stores with different prices. Store-specific inventory. Location-based store availability. Product matching across stores.',
        keyInsight: 'Grocery is hyper-local. Store at 2 miles has different inventory than 5 miles. Price varies by store. Availability changes hourly.'
      },
      requirements: {
        functional: [
          'List stores near user location',
          'Browse products by category',
          'Show store-specific prices',
          'Product search with filters'
        ],
        nonFunctional: [
          'Catalog load < 500ms',
          'Search results < 300ms'
        ]
      },
      hints: [
        'Product: {id, name, brand, category, image, upc}',
        'StoreProduct: {product_id, store_id, price, in_stock, aisle}',
        'Store: {id, name, address, location, hours, delivery_radius}'
      ],
      expectedComponents: ['Product Catalog', 'Store Manager', 'Inventory Service'],
      successCriteria: ['Products display', 'Store-specific pricing'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Shopping Cart',
      phase: 1,
      phaseTitle: 'Catalog & Orders',
      learningObjective: 'Build cart with quantity and store selection',
      thinkingFramework: {
        framework: 'Store-Bound Cart',
        approach: 'Cart tied to single store (cant mix stores). Quantity limits per item. Weight-based items (produce, deli). Cart persists across sessions.',
        keyInsight: 'Each order is from one store. Switching stores clears cart (or warns). Some items sold by weight - estimate until actual shopping.'
      },
      requirements: {
        functional: [
          'Add items to cart with quantity',
          'Handle weighted items (per lb)',
          'Store selection and switching',
          'Save cart for later'
        ],
        nonFunctional: [
          'Cart update < 100ms',
          'Cart persists 7 days'
        ]
      },
      hints: [
        'CartItem: {product_id, quantity, unit: each|lb, estimated_price}',
        'Cart: {user_id, store_id, items, created_at, updated_at}',
        'Weight items: estimate price, adjust after actual weighing'
      ],
      expectedComponents: ['Cart Service', 'Price Calculator', 'Persistence Layer'],
      successCriteria: ['Cart works', 'Prices calculated'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Order Placement',
      phase: 1,
      phaseTitle: 'Catalog & Orders',
      learningObjective: 'Create orders with delivery preferences',
      thinkingFramework: {
        framework: 'Order Capture',
        approach: 'Lock prices at order time. Select delivery window. Substitution preferences per item. Tips and special instructions.',
        keyInsight: 'Price lock prevents surprises. Substitution preferences save shopper time (no calls for every out-of-stock). Tip affects shopper quality.'
      },
      requirements: {
        functional: [
          'Convert cart to order',
          'Select delivery time slot',
          'Set substitution preferences',
          'Add delivery instructions'
        ],
        nonFunctional: [
          'Order creation < 2 seconds',
          'Payment authorization async'
        ]
      },
      hints: [
        'Order: {id, user_id, store_id, items, delivery_slot, address, tip}',
        'Item: {product_id, quantity, substitution: allow|suggest|none}',
        'Slot: {date, start_time, end_time, price}'
      ],
      expectedComponents: ['Order Service', 'Slot Manager', 'Payment Handler'],
      successCriteria: ['Orders created', 'Slots selected'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Fulfillment (Steps 4-6)
    {
      id: 'step-4',
      title: 'Shopper Assignment',
      phase: 2,
      phaseTitle: 'Fulfillment',
      learningObjective: 'Match orders to available shoppers',
      thinkingFramework: {
        framework: 'Gig Worker Dispatch',
        approach: 'Shoppers claim batches (orders). Batch based on store proximity and delivery timing. Balance workload. Shopper ratings affect priority.',
        keyInsight: 'Shoppers are contractors, not employees. They choose batches. Better batches (higher tips) go to higher-rated shoppers. Creates quality incentive.'
      },
      requirements: {
        functional: [
          'Create batches from orders',
          'Show available batches to shoppers',
          'Shopper claims batch',
          'Handle batch timeouts'
        ],
        nonFunctional: [
          'Batch assignment < 15 minutes',
          'Shopper notification < 30 seconds'
        ]
      },
      hints: [
        'Batch: {id, orders: [], store_id, total_items, total_pay, expires_at}',
        'Assignment: shopper sees batches sorted by earnings/effort',
        'Timeout: unclaimed batch goes to more shoppers'
      ],
      expectedComponents: ['Batch Creator', 'Assignment Engine', 'Shopper App'],
      successCriteria: ['Batches created', 'Shoppers assigned'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Shopping and Fulfillment',
      phase: 2,
      phaseTitle: 'Fulfillment',
      learningObjective: 'Guide shopper through store picking',
      thinkingFramework: {
        framework: 'Guided Shopping',
        approach: 'Optimized pick path through store. Scan items to verify. Handle out-of-stock with substitutions. Customer approval via app.',
        keyInsight: 'Aisle optimization saves time. 50-item order shouldnt zigzag store. Barcode scan prevents wrong items. Real-time chat for substitution approval.'
      },
      requirements: {
        functional: [
          'Show items in aisle order',
          'Barcode scanning for verification',
          'Mark items found/not found',
          'Substitution suggestions'
        ],
        nonFunctional: [
          'Scan verification < 500ms',
          'Path optimization pre-computed'
        ]
      },
      hints: [
        'Pick list: items sorted by aisle, then by location in aisle',
        'Scan: UPC match against expected product',
        'Substitution: suggest similar item, customer approves in app'
      ],
      expectedComponents: ['Pick Optimizer', 'Scanner', 'Substitution Engine'],
      successCriteria: ['Efficient picking', 'Substitutions handled'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Real-Time Customer Communication',
      phase: 2,
      phaseTitle: 'Fulfillment',
      learningObjective: 'Enable shopper-customer coordination',
      thinkingFramework: {
        framework: 'Live Order Updates',
        approach: 'Customer sees shopping progress. Chat for questions. Push notifications for substitution requests. Approval before checkout.',
        keyInsight: 'Real-time transparency builds trust. Customer knows order status without asking. Substitution approval prevents surprises at delivery.'
      },
      requirements: {
        functional: [
          'Live progress updates',
          'In-app chat between shopper and customer',
          'Push notifications for decisions',
          'Order summary before checkout'
        ],
        nonFunctional: [
          'Progress update < 5 seconds',
          'Chat delivery < 1 second'
        ]
      },
      hints: [
        'Progress: {items_found, items_not_found, items_substituted}',
        'Chat: {order_id, messages: [{sender, content, timestamp}]}',
        'Notification: substitution_requested, shopper_checking_out'
      ],
      expectedComponents: ['Progress Tracker', 'Chat Service', 'Push Notifier'],
      successCriteria: ['Updates real-time', 'Chat works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Delivery (Steps 7-9)
    {
      id: 'step-7',
      title: 'Delivery Time Slots',
      phase: 3,
      phaseTitle: 'Delivery',
      learningObjective: 'Manage delivery capacity and pricing',
      thinkingFramework: {
        framework: 'Capacity Management',
        approach: 'Time slots have capacity limits. Dynamic pricing for high-demand slots. Balance shopper availability with customer demand.',
        keyInsight: 'Popular slots (5-7pm) fill fast. Pricing shapes demand - discount unpopular slots, premium for peak. Capacity based on shopper availability.'
      },
      requirements: {
        functional: [
          'Show available time slots',
          'Capacity limits per slot',
          'Dynamic slot pricing',
          'Slot reservation during checkout'
        ],
        nonFunctional: [
          'Slot availability real-time',
          'Reservation hold: 10 minutes'
        ]
      },
      hints: [
        'Slot: {store_id, date, hour, capacity, booked, price}',
        'Dynamic pricing: base + demand_multiplier + distance_fee',
        'Reservation: temporary hold, release if checkout abandoned'
      ],
      expectedComponents: ['Slot Manager', 'Pricing Engine', 'Reservation Service'],
      successCriteria: ['Slots managed', 'Pricing dynamic'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Delivery Tracking',
      phase: 3,
      phaseTitle: 'Delivery',
      learningObjective: 'Track shopper from store to doorstep',
      thinkingFramework: {
        framework: 'Live Location',
        approach: 'Track shopper location during delivery. ETA updates. Customer can see shopper on map. Arrival notification.',
        keyInsight: 'Map view reduces "where is my order" anxiety. Live ETA more useful than static estimate. Geofence triggers arrival notification.'
      },
      requirements: {
        functional: [
          'Shopper location updates',
          'Customer map view',
          'Dynamic ETA calculation',
          'Arrival notification'
        ],
        nonFunctional: [
          'Location update: every 30 seconds',
          'ETA accuracy: ± 5 minutes'
        ]
      },
      hints: [
        'Location: {shopper_id, lat, lng, timestamp, heading}',
        'ETA: routing API (Google, Mapbox) with traffic',
        'Geofence: trigger notification when within 0.1 miles'
      ],
      expectedComponents: ['Location Tracker', 'Map Service', 'ETA Calculator'],
      successCriteria: ['Tracking works', 'ETA accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Delivery Completion',
      phase: 3,
      phaseTitle: 'Delivery',
      learningObjective: 'Handle handoff and post-delivery',
      thinkingFramework: {
        framework: 'Proof of Delivery',
        approach: 'Photo proof of delivery. Customer signature option. Leave at door vs hand off. Rating and tip adjustment post-delivery.',
        keyInsight: 'Photo proof prevents "not delivered" disputes. Leave at door is COVID-standard. Tip can be adjusted up to 24 hours after - encourages good service.'
      },
      requirements: {
        functional: [
          'Photo proof of delivery',
          'Delivery options (hand off, leave at door)',
          'Customer rating and feedback',
          'Post-delivery tip adjustment'
        ],
        nonFunctional: [
          'Photo upload < 5 seconds',
          'Tip adjustment window: 24 hours'
        ]
      },
      hints: [
        'Proof: {order_id, photo_url, timestamp, location}',
        'Delivery: {type: handed|left_at_door, notes}',
        'Rating: {order_id, rating: 1-5, feedback, tip_change}'
      ],
      expectedComponents: ['Proof Handler', 'Rating System', 'Tip Adjuster'],
      successCriteria: ['Delivery completed', 'Ratings captured'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Inventory Accuracy',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Keep inventory data fresh and accurate',
      thinkingFramework: {
        framework: 'Real-Time Inventory',
        approach: 'Store inventory feeds. Shopper reports update availability. ML predicts stock levels. Balance accuracy vs update frequency.',
        keyInsight: 'Grocery inventory changes constantly. Cant sync in real-time (too expensive). Use ML to predict "likely out of stock". Shopper reports are ground truth.'
      },
      requirements: {
        functional: [
          'Ingest store inventory feeds',
          'Update from shopper reports',
          'Predict out-of-stock items',
          'Surface availability confidence'
        ],
        nonFunctional: [
          'Feed sync: every 15 minutes',
          'Prediction accuracy > 85%'
        ]
      },
      hints: [
        'Feed: store sends inventory updates periodically',
        'Shopper signal: item_not_found → update availability',
        'ML: predict P(in_stock) based on time, day, item type'
      ],
      expectedComponents: ['Inventory Sync', 'Availability Model', 'Confidence Scorer'],
      successCriteria: ['Inventory accurate', 'Predictions useful'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Batch Optimization',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Optimize order batching for efficiency',
      thinkingFramework: {
        framework: 'Multi-Order Optimization',
        approach: 'Combine orders going same direction. Balance batch size vs delivery time. Consider item types (frozen needs speed). Shopper efficiency.',
        keyInsight: 'Batching reduces cost per order. But too many orders = long shop time = late delivery. Optimal batch size depends on store size, order size, delivery distance.'
      },
      requirements: {
        functional: [
          'Combine compatible orders',
          'Respect delivery windows',
          'Consider item constraints (frozen)',
          'Optimize for shopper efficiency'
        ],
        nonFunctional: [
          'Batch creation < 5 minutes',
          'On-time delivery > 95%'
        ]
      },
      hints: [
        'Compatibility: same store, overlapping delivery windows, nearby addresses',
        'Constraints: frozen items need insulated bags, limit shop time',
        'Optimization: minimize (shop_time + delivery_time) per order'
      ],
      expectedComponents: ['Batch Optimizer', 'Constraint Checker', 'Route Planner'],
      successCriteria: ['Efficient batching', 'On-time deliveries'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Platform Scale',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Handle peak demand across markets',
      thinkingFramework: {
        framework: 'Market Expansion',
        approach: 'Multi-market deployment. Market-specific configurations. Surge handling for holidays. Shopper supply management.',
        keyInsight: 'Grocery is market-by-market. Each market has different stores, prices, shoppers. Thanksgiving = 10x volume. Need shopper supply planning.'
      },
      requirements: {
        functional: [
          'Multi-market support',
          'Market-specific pricing and stores',
          'Surge capacity planning',
          'Shopper incentives for high demand'
        ],
        nonFunctional: [
          'Handle 10x normal volume',
          'Market launch < 1 week'
        ]
      },
      hints: [
        'Market: {id, name, region, stores, shoppers, config}',
        'Surge: dynamic shopper bonuses to increase supply',
        'Planning: forecast demand, recruit shoppers ahead'
      ],
      expectedComponents: ['Market Manager', 'Surge Handler', 'Capacity Planner'],
      successCriteria: ['Multi-market works', 'Handles surges'],
      estimatedTime: '8 minutes'
    }
  ]
};
