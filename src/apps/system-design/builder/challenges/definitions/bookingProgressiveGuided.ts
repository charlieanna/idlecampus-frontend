import { GuidedTutorial } from '../../types/guidedTutorial';

export const bookingProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'booking-progressive',
  title: 'Design Booking.com',
  description: 'Build a hotel booking platform from search to reservation management at global scale',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design hotel inventory and availability systems',
    'Implement search with complex filters',
    'Build reservation system preventing double-booking',
    'Handle pricing with dynamic rates',
    'Scale to millions of properties worldwide'
  ],
  prerequisites: ['Search systems', 'Inventory management', 'Distributed transactions'],
  tags: ['travel', 'booking', 'search', 'inventory', 'reservations'],

  progressiveStory: {
    title: 'Booking.com Evolution',
    premise: "You're building a hotel booking platform. Starting with basic property listings and search, you'll evolve to support dynamic pricing, real-time availability, and a global marketplace connecting travelers with millions of properties.",
    phases: [
      { phase: 1, title: 'Listings', description: 'Properties and search' },
      { phase: 2, title: 'Booking', description: 'Reservations and availability' },
      { phase: 3, title: 'Experience', description: 'Reviews and personalization' },
      { phase: 4, title: 'Scale', description: 'Global operations' }
    ]
  },

  steps: [
    // PHASE 1: Listings (Steps 1-3)
    {
      id: 'step-1',
      title: 'Property Catalog',
      phase: 1,
      phaseTitle: 'Listings',
      learningObjective: 'Model hotels with rooms and amenities',
      thinkingFramework: {
        framework: 'Hierarchical Inventory',
        approach: 'Property has room types. Room types have inventory (actual rooms). Amenities at property and room level. Photos, descriptions, policies.',
        keyInsight: 'Dont model individual rooms - model room types with count. "10 Deluxe King rooms" not "Room 101, 102...". Simplifies inventory management.'
      },
      requirements: {
        functional: [
          'Create property with details',
          'Define room types with capacity',
          'Set amenities and policies',
          'Upload photos and descriptions'
        ],
        nonFunctional: [
          'Support 1M+ properties',
          'Property load < 500ms'
        ]
      },
      hints: [
        'Property: {id, name, location, type: hotel|hostel|apartment, star_rating, amenities}',
        'RoomType: {property_id, name, capacity, bed_type, count, amenities, photos}',
        'Policy: {check_in_time, check_out_time, cancellation, payment_terms}'
      ],
      expectedComponents: ['Property Store', 'Room Type Manager', 'Media Service'],
      successCriteria: ['Properties created', 'Room types defined'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Location-Based Search',
      phase: 1,
      phaseTitle: 'Listings',
      learningObjective: 'Find properties by destination',
      thinkingFramework: {
        framework: 'Geo Search',
        approach: 'Search by city, neighborhood, or coordinates. Geo-indexing for radius queries. Auto-complete for destinations. Map view with pins.',
        keyInsight: 'Location is primary filter. "Hotels in Paris" then date, then other filters. Geo-hash or R-tree for efficient spatial queries.'
      },
      requirements: {
        functional: [
          'Search by destination name',
          'Search by coordinates/radius',
          'Destination auto-complete',
          'Map view of results'
        ],
        nonFunctional: [
          'Search < 300ms',
          'Auto-complete < 100ms'
        ]
      },
      hints: [
        'Geo-index: property location for radius queries',
        'Destinations: {name, type: city|region|landmark, bounds}',
        'Auto-complete: prefix tree with popularity ranking'
      ],
      expectedComponents: ['Search Service', 'Geo Index', 'Destination Resolver'],
      successCriteria: ['Location search works', 'Map displays results'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Filter and Sort',
      phase: 1,
      phaseTitle: 'Listings',
      learningObjective: 'Narrow results with filters',
      thinkingFramework: {
        framework: 'Faceted Search',
        approach: 'Filter by price, stars, amenities, property type. Dynamic filter counts. Sort by price, rating, distance. Pagination for large results.',
        keyInsight: 'Filter counts help users narrow search. "Pool (234)" vs "Pool (0)". Elasticsearch aggregations provide these efficiently.'
      },
      requirements: {
        functional: [
          'Filter by price range',
          'Filter by star rating and amenities',
          'Sort options (price, rating, distance)',
          'Show filter counts'
        ],
        nonFunctional: [
          'Filtered search < 500ms',
          'Aggregations accurate'
        ]
      },
      hints: [
        'Filters: {price_min, price_max, stars: [], amenities: [], type: []}',
        'Aggregations: count per filter value for UI',
        'Sort: price_asc, price_desc, rating, distance, popularity'
      ],
      expectedComponents: ['Filter Engine', 'Aggregator', 'Sort Handler'],
      successCriteria: ['Filters work', 'Counts accurate'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Booking (Steps 4-6)
    {
      id: 'step-4',
      title: 'Availability Calendar',
      phase: 2,
      phaseTitle: 'Booking',
      learningObjective: 'Track room availability by date',
      thinkingFramework: {
        framework: 'Date-Based Inventory',
        approach: 'Availability per room type per night. Sold count per date. Available = total - sold. Calendar view for property managers.',
        keyInsight: 'Availability is date-specific. Same room type might be full Saturday, available Sunday. Track per-date inventory, not just total.'
      },
      requirements: {
        functional: [
          'Check availability for date range',
          'Block dates (maintenance, owner use)',
          'Calendar view for managers',
          'Minimum/maximum stay rules'
        ],
        nonFunctional: [
          'Availability check < 100ms',
          'Real-time accuracy'
        ]
      },
      hints: [
        'Inventory: {room_type_id, date, total, sold, blocked}',
        'Available: total - sold - blocked',
        'Stay rules: {min_nights, max_nights, closed_to_arrival: [dates]}'
      ],
      expectedComponents: ['Availability Store', 'Calendar Manager', 'Rule Engine'],
      successCriteria: ['Availability accurate', 'Rules enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Reservation System',
      phase: 2,
      phaseTitle: 'Booking',
      learningObjective: 'Book rooms without double-booking',
      thinkingFramework: {
        framework: 'Atomic Reservation',
        approach: 'Check availability and reserve atomically. Prevent double-booking with locks or optimistic concurrency. Reservation has expiry for payment.',
        keyInsight: 'Double-booking is catastrophic. Two users cant book last room simultaneously. Use database transactions or distributed locks to ensure atomicity.'
      },
      requirements: {
        functional: [
          'Create reservation for date range',
          'Guest details capture',
          'Reservation confirmation',
          'Prevent double-booking'
        ],
        nonFunctional: [
          'Booking < 2 seconds',
          'Zero double-bookings'
        ]
      },
      hints: [
        'Reservation: {id, property_id, room_type_id, dates, guest, status, expires_at}',
        'Atomic: SELECT FOR UPDATE on inventory rows, then INSERT reservation',
        'Status: pending_payment → confirmed → checked_in → completed | cancelled'
      ],
      expectedComponents: ['Reservation Service', 'Inventory Lock', 'Confirmation Handler'],
      successCriteria: ['Reservations work', 'No double-booking'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Dynamic Pricing',
      phase: 2,
      phaseTitle: 'Booking',
      learningObjective: 'Price rooms based on demand',
      thinkingFramework: {
        framework: 'Revenue Management',
        approach: 'Base price modified by date (weekends, holidays), occupancy (low inventory = higher price), lead time (last minute, early bird).',
        keyInsight: 'Same room different prices. Saturday vs Tuesday. 90% booked vs 20% booked. Price elasticity maximizes revenue. Hotels do this constantly.'
      },
      requirements: {
        functional: [
          'Base rates per room type',
          'Date-based rate adjustments',
          'Occupancy-based pricing',
          'Rate calendar for managers'
        ],
        nonFunctional: [
          'Price calculation < 50ms',
          'Support complex rules'
        ]
      },
      hints: [
        'Rate: {room_type_id, date, base_price, adjustments: []}',
        'Adjustments: weekend_markup, holiday_markup, occupancy_multiplier',
        'Final: base × (1 + sum(adjustments))'
      ],
      expectedComponents: ['Pricing Engine', 'Rate Manager', 'Adjustment Calculator'],
      successCriteria: ['Dynamic pricing works', 'Rates update'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Experience (Steps 7-9)
    {
      id: 'step-7',
      title: 'Reviews and Ratings',
      phase: 3,
      phaseTitle: 'Experience',
      learningObjective: 'Build trust through guest feedback',
      thinkingFramework: {
        framework: 'Verified Reviews',
        approach: 'Only guests who stayed can review. Multiple dimensions (cleanliness, location, value). Aggregate scores. Response from property.',
        keyInsight: 'Verified reviews build trust. Random reviews are spam. Post-stay email prompts reviews. Multi-dimension ratings more useful than single score.'
      },
      requirements: {
        functional: [
          'Post-stay review collection',
          'Multi-dimension ratings',
          'Property response to reviews',
          'Aggregate rating calculation'
        ],
        nonFunctional: [
          'Review within 14 days of stay',
          'Aggregate update real-time'
        ]
      },
      hints: [
        'Review: {reservation_id, ratings: {cleanliness, location, value, ...}, text}',
        'Verified: can only review completed reservations',
        'Aggregate: {property_id, avg_rating, dimension_avgs, review_count}'
      ],
      expectedComponents: ['Review Service', 'Rating Aggregator', 'Response Handler'],
      successCriteria: ['Reviews collected', 'Ratings accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Personalized Recommendations',
      phase: 3,
      phaseTitle: 'Experience',
      learningObjective: 'Suggest relevant properties',
      thinkingFramework: {
        framework: 'Travel Personalization',
        approach: 'Learn from search history, bookings, saved properties. Recommend similar properties. Consider travel context (business vs leisure).',
        keyInsight: 'Business traveler wants different than family vacationer. Past behavior predicts preferences. "Similar properties" and "You might like" drive conversions.'
      },
      requirements: {
        functional: [
          'Recently viewed properties',
          'Similar property suggestions',
          'Personalized search ranking',
          'Saved/wishlist properties'
        ],
        nonFunctional: [
          'Recommendations < 200ms',
          'Personalization real-time'
        ]
      },
      hints: [
        'Signals: searches, views, bookings, saves, price range, property types',
        'Similar: collaborative filtering (users who booked X also booked Y)',
        'Ranking boost: personalized score added to relevance'
      ],
      expectedComponents: ['Recommendation Engine', 'User Profile', 'Similarity Index'],
      successCriteria: ['Recommendations relevant', 'Personalization works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Cancellation and Modifications',
      phase: 3,
      phaseTitle: 'Experience',
      learningObjective: 'Handle booking changes gracefully',
      thinkingFramework: {
        framework: 'Flexible Policies',
        approach: 'Properties set cancellation policies. Different policies = different prices. Modifications as cancel + rebook. Refund processing.',
        keyInsight: 'Flexibility has value. Free cancellation costs more. Non-refundable is cheaper. Clear policies prevent disputes. Modifications are complex (price changes).'
      },
      requirements: {
        functional: [
          'Cancellation with policy enforcement',
          'Refund calculation',
          'Date/room modifications',
          'Policy display before booking'
        ],
        nonFunctional: [
          'Cancellation immediate',
          'Refund within 5-7 days'
        ]
      },
      hints: [
        'Policy: {type: free|partial|non_refundable, deadline_days, penalty_percent}',
        'Cancellation: check policy, calculate refund, release inventory',
        'Modification: cancel old, book new, handle price difference'
      ],
      expectedComponents: ['Cancellation Handler', 'Refund Calculator', 'Modification Flow'],
      successCriteria: ['Cancellations work', 'Policies enforced'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Partner Integration',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Connect with property management systems',
      thinkingFramework: {
        framework: 'Channel Manager',
        approach: 'Properties use PMS (Property Management Systems). API integration for availability sync. Two-way: push bookings, pull inventory. Prevent overbooking across channels.',
        keyInsight: 'Hotels list on multiple sites (Booking, Expedia, direct). Channel manager keeps inventory in sync. Overbooking across channels is common problem.'
      },
      requirements: {
        functional: [
          'API for property systems',
          'Two-way availability sync',
          'Booking push to PMS',
          'Bulk inventory updates'
        ],
        nonFunctional: [
          'Sync latency < 1 minute',
          'API uptime 99.9%'
        ]
      },
      hints: [
        'API: REST/GraphQL for partners, webhooks for events',
        'Sync: poll or webhook for inventory changes',
        'Conflict: last-write-wins or reject if stale'
      ],
      expectedComponents: ['Partner API', 'Sync Engine', 'Conflict Resolver'],
      successCriteria: ['Integration works', 'Sync reliable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Multi-Currency and Localization',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Serve global travelers',
      thinkingFramework: {
        framework: 'Global Commerce',
        approach: 'Display prices in user currency. Store in property currency. Real-time exchange rates. Localized content (language, date formats).',
        keyInsight: 'Travelers want prices in their currency. Hotels price in local currency. Exchange rate fluctuation risk. Lock rate at booking time.'
      },
      requirements: {
        functional: [
          'Multi-currency display',
          'Exchange rate management',
          'Multi-language content',
          'Regional payment methods'
        ],
        nonFunctional: [
          'Exchange rates updated hourly',
          'Support 40+ currencies'
        ]
      },
      hints: [
        'Price: stored in property currency, displayed in user currency',
        'Rate: {from_currency, to_currency, rate, timestamp}',
        'Booking: lock exchange rate at confirmation'
      ],
      expectedComponents: ['Currency Converter', 'Localization Service', 'Rate Feed'],
      successCriteria: ['Multi-currency works', 'Localization complete'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Search and Platform Scale',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Handle millions of searches',
      thinkingFramework: {
        framework: 'Search Infrastructure',
        approach: 'Elasticsearch for property search. Cache popular searches. Availability service scales independently. Geo-distributed for latency.',
        keyInsight: 'Search is read-heavy, write-light. Cache search results aggressively. Availability changes more often - separate service. Popular destinations get most traffic.'
      },
      requirements: {
        functional: [
          'High-performance search',
          'Search result caching',
          'Real-time availability',
          'Analytics and reporting'
        ],
        nonFunctional: [
          'Handle 10K searches/second',
          '99.99% availability'
        ]
      },
      hints: [
        'Search: Elasticsearch cluster, replicated globally',
        'Cache: popular destination + date combos',
        'Availability: separate service, called after search'
      ],
      expectedComponents: ['Search Cluster', 'Cache Layer', 'Analytics Pipeline'],
      successCriteria: ['Search fast at scale', 'Platform reliable'],
      estimatedTime: '8 minutes'
    }
  ]
};
