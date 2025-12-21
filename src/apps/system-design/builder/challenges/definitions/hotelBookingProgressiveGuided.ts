import { GuidedTutorial } from '../../types/guidedTutorial';

export const hotelBookingProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'hotel-booking-progressive',
  title: 'Design Hotel Booking System (Booking.com)',
  description: 'Build a hotel booking platform from search to dynamic pricing at scale',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Model hotel inventory with room types and availability',
    'Design geospatial search with complex filters',
    'Implement booking with inventory locking',
    'Handle overbooking and cancellations',
    'Build dynamic pricing and revenue management'
  ],
  prerequisites: ['Database design', 'Search systems', 'Transaction handling'],
  tags: ['booking', 'travel', 'inventory', 'search', 'pricing'],

  progressiveStory: {
    title: 'Hotel Booking Evolution',
    premise: "You're building a hotel booking platform. Starting with simple search and booking, you'll evolve to handle millions of searches per day with real-time availability and dynamic pricing.",
    phases: [
      { phase: 1, title: 'Hotel Search', description: 'Find hotels with availability' },
      { phase: 2, title: 'Booking Engine', description: 'Reserve rooms with inventory management' },
      { phase: 3, title: 'Scale & Reliability', description: 'Handle peak loads and edge cases' },
      { phase: 4, title: 'Revenue Optimization', description: 'Dynamic pricing and personalization' }
    ]
  },

  steps: [
    // PHASE 1: Hotel Search (Steps 1-3)
    {
      id: 'step-1',
      title: 'Hotel & Room Modeling',
      phase: 1,
      phaseTitle: 'Hotel Search',
      learningObjective: 'Model hotels, room types, and amenities',
      thinkingFramework: {
        framework: 'Hierarchical Data Model',
        approach: 'Hotel → Room Types → Rooms → Availability. Room type (Deluxe King) has multiple physical rooms. Availability is per room type per night.',
        keyInsight: 'Dont model individual rooms for availability. Model room type inventory count. "5 Deluxe Kings available" not "Room 101, 102 available".'
      },
      requirements: {
        functional: [
          'Store hotel details (name, location, star rating)',
          'Define room types with capacity and amenities',
          'Track inventory count per room type',
          'Store hotel amenities and policies'
        ],
        nonFunctional: []
      },
      hints: [
        'Hotel: {id, name, location, star_rating, amenities}',
        'RoomType: {id, hotel_id, name, capacity, base_price, photos}',
        'Separate rate calendar from inventory'
      ],
      expectedComponents: ['Hotel Service', 'Room Type Store', 'Amenities Index'],
      successCriteria: ['Hotels stored with room types', 'Amenities queryable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Availability Calendar',
      phase: 1,
      phaseTitle: 'Hotel Search',
      learningObjective: 'Track room availability by date',
      thinkingFramework: {
        framework: 'Date-Based Inventory',
        approach: 'Availability varies by night. Store inventory per room type per date. Query must check ALL nights in date range.',
        keyInsight: 'Booking consumes inventory for each night. Check-in May 1, check-out May 3 = 2 nights (May 1, May 2).'
      },
      requirements: {
        functional: [
          'Store available inventory per room type per date',
          'Query availability for date range',
          'Handle different inventory by day (weekday vs weekend)',
          'Support inventory updates from hotel'
        ],
        nonFunctional: []
      },
      hints: [
        'Availability: {room_type_id, date, count, price}',
        'Query: MIN(count) across date range for bookable qty',
        'Pre-populate future dates with default inventory'
      ],
      expectedComponents: ['Availability Store', 'Calendar Manager', 'Inventory API'],
      successCriteria: ['Availability accurate for date ranges', 'Updates reflect immediately'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Hotel Search & Filtering',
      phase: 1,
      phaseTitle: 'Hotel Search',
      learningObjective: 'Search hotels by location with filters',
      thinkingFramework: {
        framework: 'Two-Phase Search',
        approach: 'Phase 1: Filter by location, dates, guests (must have availability). Phase 2: Apply amenity filters, sort by price/rating.',
        keyInsight: 'Location + dates + availability is the expensive query. Do it first, then filter in memory. Dont join everything.'
      },
      requirements: {
        functional: [
          'Search hotels by city or coordinates',
          'Filter by check-in/out dates and guests',
          'Apply amenity filters (pool, wifi, parking)',
          'Sort by price, rating, distance, or popularity'
        ],
        nonFunctional: [
          'Search latency < 500ms'
        ]
      },
      hints: [
        'Geospatial index for location queries',
        'Pre-filter by date availability before returning',
        'Cache popular searches (city + date combinations)'
      ],
      expectedComponents: ['Search Service', 'Geo Index', 'Filter Engine', 'Result Cache'],
      successCriteria: ['Results have availability', 'Filters work correctly'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Booking Engine (Steps 4-6)
    {
      id: 'step-4',
      title: 'Booking Creation',
      phase: 2,
      phaseTitle: 'Booking Engine',
      learningObjective: 'Create bookings with inventory management',
      thinkingFramework: {
        framework: 'Optimistic Locking',
        approach: 'Check availability → reserve → charge → confirm. Race condition: two users book last room. Use optimistic locking or atomic decrement.',
        keyInsight: 'Atomic decrement: UPDATE availability SET count = count - 1 WHERE count > 0. Returns 0 rows if sold out.'
      },
      requirements: {
        functional: [
          'Reserve room for guest with dates',
          'Prevent double-booking same inventory',
          'Calculate total price across nights',
          'Generate booking confirmation'
        ],
        nonFunctional: [
          'Zero overselling of inventory'
        ]
      },
      hints: [
        'Transaction: decrement all nights atomically',
        'Rollback if any night fails',
        'Store booking with status: pending → confirmed → completed'
      ],
      expectedComponents: ['Booking Service', 'Inventory Manager', 'Price Calculator'],
      successCriteria: ['Bookings created correctly', 'No overbooking'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Payment Integration',
      phase: 2,
      phaseTitle: 'Booking Engine',
      learningObjective: 'Handle payments with booking lifecycle',
      thinkingFramework: {
        framework: 'Two-Phase Booking',
        approach: 'Hold inventory → collect payment → confirm booking. If payment fails, release inventory. Never charge without inventory hold.',
        keyInsight: 'Authorize vs capture: authorize at booking, capture at check-in. Protects guest and hotel from no-shows.'
      },
      requirements: {
        functional: [
          'Hold inventory before payment',
          'Process payment with provider',
          'Confirm booking on payment success',
          'Release inventory on payment failure'
        ],
        nonFunctional: [
          'Payment timeout < 30 seconds'
        ]
      },
      hints: [
        'Inventory hold with TTL (15 minutes)',
        'Idempotency key for payment retry',
        'Background job to release expired holds'
      ],
      expectedComponents: ['Payment Service', 'Hold Manager', 'Timeout Handler'],
      successCriteria: ['Payment success confirms booking', 'Failures release inventory'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Cancellation & Refunds',
      phase: 2,
      phaseTitle: 'Booking Engine',
      learningObjectpoint: 'Handle booking cancellations and modifications',
      thinkingFramework: {
        framework: 'Policy-Based Cancellation',
        approach: 'Cancellation policies vary: free until 24h before, 50% fee within 24h, non-refundable. Store policy with rate, enforce at cancellation.',
        keyInsight: 'Release inventory immediately on cancellation. Refund according to policy. These are separate operations.'
      },
      requirements: {
        functional: [
          'Support booking cancellation',
          'Apply cancellation policy for refund calculation',
          'Release inventory back to available pool',
          'Support date modifications'
        ],
        nonFunctional: []
      },
      hints: [
        'Store cancellation policy with each rate',
        'Cancellation fee tiers: days_before → fee_percent',
        'Modification = cancel + rebook (preserve confirmation number)'
      ],
      expectedComponents: ['Cancellation Service', 'Policy Engine', 'Refund Processor'],
      successCriteria: ['Cancellations refund correctly', 'Inventory released'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Scale & Reliability (Steps 7-9)
    {
      id: 'step-7',
      title: 'Inventory Caching',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Cache availability for search performance',
      thinkingFramework: {
        framework: 'Read-Heavy Optimization',
        approach: 'Search traffic >> booking traffic (1000:1). Cache availability for search. Invalidate on booking. Accept slightly stale for search, verify at booking.',
        keyInsight: 'Eventual consistency for search is fine. User sees "2 rooms left", clicks book, real-time check confirms. Better than slow search.'
      },
      requirements: {
        functional: [
          'Cache availability for search queries',
          'Invalidate cache on booking/cancellation',
          'Real-time check at booking time',
          'Handle cache misses gracefully'
        ],
        nonFunctional: [
          'Cache hit rate > 90%',
          'Search latency < 200ms'
        ]
      },
      hints: [
        'Cache key: room_type_id:date → count',
        'Invalidate specific dates on booking',
        'TTL fallback for cache consistency'
      ],
      expectedComponents: ['Availability Cache', 'Cache Invalidator', 'Real-Time Checker'],
      successCriteria: ['Search is fast', 'Booking validates real-time'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Overbooking Management',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Handle intentional overbooking like airlines',
      thinkingFramework: {
        framework: 'Statistical Overbooking',
        approach: 'Hotels overbook intentionally (expect cancellations/no-shows). Allow booking beyond physical inventory up to overbooking limit.',
        keyInsight: 'Overbooking rate = historical (cancellation_rate + no_show_rate). 10% no-shows means sell 110% of inventory.'
      },
      requirements: {
        functional: [
          'Configure overbooking percentage per hotel',
          'Allow bookings beyond physical inventory',
          'Track overbooking exposure',
          'Alert when overbooking risk is high'
        ],
        nonFunctional: [
          'Walk rate (guests turned away) < 0.1%'
        ]
      },
      hints: [
        'Virtual inventory = physical * (1 + overbooking_rate)',
        'Monitor confirmed bookings vs physical closer to date',
        'Reduce overbooking as date approaches'
      ],
      expectedComponents: ['Overbooking Manager', 'Risk Calculator', 'Walk Alert System'],
      successCriteria: ['Overbooking configured correctly', 'Alerts fire on risk'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'High Availability & Peak Handling',
      phase: 3,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Handle traffic spikes and failures',
      thinkingFramework: {
        framework: 'Graceful Degradation',
        approach: 'Black Friday, holiday bookings spike 10x. Queue bookings, shed non-essential features, circuit break failing dependencies.',
        keyInsight: 'Booking queue with rate limiting. If system overloaded, queue requests rather than fail. Users wait but complete.'
      },
      requirements: {
        functional: [
          'Queue bookings during peak load',
          'Rate limit search requests',
          'Circuit break failing hotel integrations',
          'Failover to backup datacenter'
        ],
        nonFunctional: [
          'Handle 10x normal traffic',
          '99.9% availability'
        ]
      },
      hints: [
        'Booking queue with fair ordering',
        'Search rate limit: 100 req/s per user',
        'Feature flags to disable non-essential features'
      ],
      expectedComponents: ['Load Balancer', 'Booking Queue', 'Circuit Breaker', 'Feature Flags'],
      successCriteria: ['Peak traffic handled', 'Graceful degradation works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Revenue Optimization (Steps 10-12)
    {
      id: 'step-10',
      title: 'Dynamic Pricing',
      phase: 4,
      phaseTitle: 'Revenue Optimization',
      learningObjective: 'Adjust prices based on demand',
      thinkingFramework: {
        framework: 'Demand-Based Pricing',
        approach: 'Higher demand = higher prices. Factors: occupancy rate, booking pace, day of week, events in area, competitor prices.',
        keyInsight: 'Price elasticity: how much does demand drop when price rises? Optimize for revenue, not bookings. Sometimes higher price with fewer bookings = more profit.'
      },
      requirements: {
        functional: [
          'Track demand signals (search volume, booking pace)',
          'Adjust prices based on occupancy forecast',
          'Set price floors and ceilings',
          'A/B test pricing strategies'
        ],
        nonFunctional: [
          'Price updates within 15 minutes of demand change'
        ]
      },
      hints: [
        'Demand signal: searches/bookings ratio',
        'Price = base * demand_multiplier * occupancy_multiplier',
        'ML to predict optimal price point'
      ],
      expectedComponents: ['Pricing Engine', 'Demand Forecaster', 'Price Optimizer'],
      successCriteria: ['Prices adjust to demand', 'Revenue increases vs static pricing'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Personalized Search',
      phase: 4,
      phaseTitle: 'Revenue Optimization',
      learningObjective: 'Rank hotels based on user preferences',
      thinkingFramework: {
        framework: 'User Context Ranking',
        approach: 'Same search, different users = different ranking. Business traveler: near airport, wifi. Family: pool, kitchen. Learn from past bookings.',
        keyInsight: 'Combine collaborative filtering (similar users liked) with content-based (user prefers 4-star hotels).'
      },
      requirements: {
        functional: [
          'Track user booking history and preferences',
          'Personalize search result ranking',
          'Boost hotels matching user profile',
          'Handle cold start for new users'
        ],
        nonFunctional: [
          'Personalization adds < 50ms latency'
        ]
      },
      hints: [
        'User profile: {preferred_stars, amenities, price_range}',
        'Boost score = base_score * personalization_multiplier',
        'Cold start: use search context (dates, destination)'
      ],
      expectedComponents: ['User Profile Service', 'Personalization Ranker', 'Recommendation Engine'],
      successCriteria: ['Results personalized to user', 'Conversion rate improves'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Channel & Rate Management',
      phase: 4,
      phaseTitle: 'Revenue Optimization',
      learningObjective: 'Manage inventory across distribution channels',
      thinkingFramework: {
        framework: 'Channel Strategy',
        approach: 'Hotels sell on multiple channels: direct, OTAs (Expedia, Booking), GDS. Each has different commission. Allocate inventory strategically.',
        keyInsight: 'Rate parity challenges: OTAs want same price as direct. But direct has lower cost. Use bundling (free breakfast) to differentiate.'
      },
      requirements: {
        functional: [
          'Allocate inventory across channels',
          'Sync availability to OTA partners',
          'Handle rate parity requirements',
          'Track bookings by channel for attribution'
        ],
        nonFunctional: [
          'Channel sync latency < 5 minutes'
        ]
      },
      hints: [
        'Channel allocation: % of inventory per channel',
        'Push availability via OTA APIs on change',
        'Member rates: lower price for logged-in users (allowed)'
      ],
      expectedComponents: ['Channel Manager', 'OTA Connector', 'Rate Parity Enforcer', 'Attribution Tracker'],
      successCriteria: ['Inventory synced across channels', 'Rate parity maintained'],
      estimatedTime: '8 minutes'
    }
  ]
};
