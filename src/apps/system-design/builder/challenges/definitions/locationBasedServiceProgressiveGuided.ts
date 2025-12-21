import { GuidedTutorial } from '../../types/guidedTutorial';

export const locationBasedServiceProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'location-based-service-progressive',
  title: 'Design a Location-Based Service (Nearby Friends)',
  description: 'Build a proximity service from simple location tracking to real-time nearby discovery',
  difficulty: 'hard',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design efficient geospatial indexing with geohash',
    'Implement real-time location updates at scale',
    'Build proximity queries for nearby discovery',
    'Handle privacy controls and location sharing',
    'Scale to millions of concurrent location updates'
  ],
  prerequisites: ['Geospatial concepts', 'Redis', 'Real-time systems'],
  tags: ['geospatial', 'location', 'real-time', 'proximity', 'privacy'],

  progressiveStory: {
    title: 'Location-Based Service Evolution',
    premise: "You're building a nearby friends feature for a social app. Starting with basic location sharing, you'll evolve to handle millions of users with real-time proximity notifications and privacy controls.",
    phases: [
      { phase: 1, title: 'Location Tracking', description: 'Store and update user locations' },
      { phase: 2, title: 'Proximity Search', description: 'Find nearby users efficiently' },
      { phase: 3, title: 'Real-Time Updates', description: 'Live nearby notifications' },
      { phase: 4, title: 'Privacy & Scale', description: 'Granular privacy and global scale' }
    ]
  },

  steps: [
    // PHASE 1: Location Tracking (Steps 1-3)
    {
      id: 'step-1',
      title: 'Location Data Model',
      phase: 1,
      phaseTitle: 'Location Tracking',
      learningObjective: 'Design location storage with accuracy and freshness',
      thinkingFramework: {
        framework: 'Ephemeral vs Persistent',
        approach: 'Current location is ephemeral (changes constantly). Store in fast cache. Location history is persistent (for analytics). Store in database.',
        keyInsight: 'Location has accuracy radius. GPS is 3-5m, WiFi is 20-50m, cell tower is 1-5km. Store accuracy to make smart decisions.'
      },
      requirements: {
        functional: [
          'Store user location (lat, lng, accuracy)',
          'Track location timestamp for freshness',
          'Support location history for analytics',
          'Handle missing/stale locations gracefully'
        ],
        nonFunctional: []
      },
      hints: [
        'Location: {user_id, lat, lng, accuracy_meters, timestamp}',
        'Current: Redis for fast reads, TTL for staleness',
        'History: time-series DB or append-only log'
      ],
      expectedComponents: ['Location Store', 'History Store', 'Freshness Tracker'],
      successCriteria: ['Locations stored correctly', 'Staleness detected'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Location Updates',
      phase: 1,
      phaseTitle: 'Location Tracking',
      learningObjective: 'Handle high-frequency location updates',
      thinkingFramework: {
        framework: 'Update Throttling',
        approach: 'Mobile apps can send location every second. Thats 86K updates/user/day. Throttle: update only if moved > 100m or 5 min elapsed.',
        keyInsight: 'Battery vs freshness tradeoff. Frequent updates drain battery. App should use significant location change triggers, not polling.'
      },
      requirements: {
        functional: [
          'Accept location updates from mobile clients',
          'Throttle updates to reduce load',
          'Detect significant location changes',
          'Batch updates for efficiency'
        ],
        nonFunctional: [
          'Handle 1M location updates/second',
          'Update latency < 100ms'
        ]
      },
      hints: [
        'Throttle: ignore if distance < 100m AND time < 5min',
        'Distance: Haversine formula for accuracy',
        'Batch: collect updates, write in batch every second'
      ],
      expectedComponents: ['Update API', 'Throttle Filter', 'Batch Writer'],
      successCriteria: ['Updates processed efficiently', 'Throttling reduces load'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Geohash Indexing',
      phase: 1,
      phaseTitle: 'Location Tracking',
      learningObjective: 'Index locations for spatial queries',
      thinkingFramework: {
        framework: 'Spatial Indexing',
        approach: 'Geohash converts (lat, lng) to string. Nearby locations share prefix. Enables range queries on string index. Precision = prefix length.',
        keyInsight: 'Geohash precision: 6 chars = ~1.2km cell, 7 chars = ~150m cell. Choose based on query radius needs.'
      },
      requirements: {
        functional: [
          'Convert lat/lng to geohash',
          'Store location with geohash prefix',
          'Enable prefix-based range queries',
          'Handle edge cases (cell boundaries)'
        ],
        nonFunctional: [
          'Geohash computation < 1ms'
        ]
      },
      hints: [
        'Geohash: encode(lat, lng, precision) → "9q8yy"',
        'Redis key: geohash:9q8yy → set of user_ids',
        'Boundary: query adjacent cells too'
      ],
      expectedComponents: ['Geohash Encoder', 'Spatial Index', 'Boundary Handler'],
      successCriteria: ['Locations indexed by geohash', 'Range queries work'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Proximity Search (Steps 4-6)
    {
      id: 'step-4',
      title: 'Nearby User Query',
      phase: 2,
      phaseTitle: 'Proximity Search',
      learningObjective: 'Find users within radius',
      thinkingFramework: {
        framework: 'Multi-Cell Query',
        approach: 'User at cell center: query that cell + 8 neighbors. Filter by exact distance. Geohash gives candidates, distance calculation filters.',
        keyInsight: 'Geohash is approximate. User at cell edge is close to users in adjacent cell. Always query neighbors for complete results.'
      },
      requirements: {
        functional: [
          'Find users within X km radius',
          'Return sorted by distance',
          'Filter to friends only (optional)',
          'Handle empty results gracefully'
        ],
        nonFunctional: [
          'Query < 100ms for 10km radius'
        ]
      },
      hints: [
        'Get 9 cells (center + 8 neighbors)',
        'Fetch all users in those cells',
        'Calculate exact distance, filter by radius, sort'
      ],
      expectedComponents: ['Proximity Query', 'Distance Calculator', 'Result Sorter'],
      successCriteria: ['Nearby users found correctly', 'Sorted by distance'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Redis GEO Commands',
      phase: 2,
      phaseTitle: 'Proximity Search',
      learningObjective: 'Use Redis native geospatial features',
      thinkingFramework: {
        framework: 'Optimized Data Structure',
        approach: 'Redis GEO: GEOADD, GEORADIUS, GEODIST. Built-in geohash + sorted set. Faster than manual implementation. Handles edge cases.',
        keyInsight: 'GEORADIUS returns users within radius, sorted by distance. One command replaces: get cells, fetch users, calculate distance, sort.'
      },
      requirements: {
        functional: [
          'Store locations with GEOADD',
          'Query nearby with GEORADIUS',
          'Calculate distance with GEODIST',
          'Support multiple location indexes (friends, all users)'
        ],
        nonFunctional: [
          'GEORADIUS < 10ms for 1km radius'
        ]
      },
      hints: [
        'GEOADD locations lng lat user_id',
        'GEORADIUS locations lng lat 5 km WITHDIST ASC',
        'Separate keys per context: friends:{user_id}, all_users'
      ],
      expectedComponents: ['Redis GEO Client', 'Location Index', 'Query Builder'],
      successCriteria: ['Redis GEO commands work', 'Performance improved'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-6',
      title: 'Location-Based Discovery',
      phase: 2,
      phaseTitle: 'Proximity Search',
      learningObjective: 'Discover places and people nearby',
      thinkingFramework: {
        framework: 'Multi-Entity Proximity',
        approach: 'Not just users: nearby restaurants, events, offers. Different indexes for different entity types. Combined results for discovery feed.',
        keyInsight: 'Context matters. "Nearby" for friends = 1km. For restaurants = 5km. For events = city. Customize radius by entity type.'
      },
      requirements: {
        functional: [
          'Find nearby places (restaurants, stores)',
          'Find nearby events',
          'Combine multiple entity types in feed',
          'Customize radius per entity type'
        ],
        nonFunctional: []
      },
      hints: [
        'Index per type: places, events, users',
        'Query each with appropriate radius',
        'Merge results, dedupe, rank by relevance + distance'
      ],
      expectedComponents: ['Multi-Index Query', 'Entity Merger', 'Discovery Feed'],
      successCriteria: ['Multiple entity types queried', 'Combined results useful'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Real-Time Updates (Steps 7-9)
    {
      id: 'step-7',
      title: 'Proximity Notifications',
      phase: 3,
      phaseTitle: 'Real-Time Updates',
      learningObjective: 'Notify when friend comes nearby',
      thinkingFramework: {
        framework: 'Event-Driven Proximity',
        approach: 'On location update, check if user entered/exited any friends proximity. Trigger notification on enter. Debounce to avoid spam.',
        keyInsight: 'Proximity state: was_nearby → is_nearby. Notify on transition, not continuously. "John is nearby" once, not every minute.'
      },
      requirements: {
        functional: [
          'Detect friend entering proximity radius',
          'Send push notification on proximity event',
          'Debounce repeated notifications',
          'Track proximity state (nearby/not nearby)'
        ],
        nonFunctional: [
          'Notification < 30 seconds of proximity'
        ]
      },
      hints: [
        'On update: query friends, compare to previous nearby set',
        'New nearby = notify, no longer nearby = clear state',
        'Debounce: min 30 min between same-pair notifications'
      ],
      expectedComponents: ['Proximity Detector', 'State Tracker', 'Notification Trigger'],
      successCriteria: ['Notifications on proximity enter', 'No spam'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Live Location Sharing',
      phase: 3,
      phaseTitle: 'Real-Time Updates',
      learningObjective: 'Share live location with specific people',
      thinkingFramework: {
        framework: 'Temporary Sharing Sessions',
        approach: 'User shares location with friend for 1 hour. Friend sees live position on map. Session expires automatically. Extension available.',
        keyInsight: 'Live share is different from passive nearby. Higher update frequency (every 5 sec). WebSocket for real-time. Battery-intensive.'
      },
      requirements: {
        functional: [
          'Create time-limited sharing session',
          'Stream live location to recipients',
          'Auto-expire sessions',
          'Allow manual stop sharing'
        ],
        nonFunctional: [
          'Location update latency < 5 seconds',
          'Session duration: 15min, 1hr, 8hr options'
        ]
      },
      hints: [
        'Session: {user_id, recipients, expires_at, active}',
        'WebSocket channel per session',
        'High-frequency updates only during active session'
      ],
      expectedComponents: ['Session Manager', 'Live Stream', 'Expiration Handler'],
      successCriteria: ['Live sharing works', 'Sessions expire correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Geofencing',
      phase: 3,
      phaseTitle: 'Real-Time Updates',
      learningObjective: 'Trigger actions on entering/exiting areas',
      thinkingFramework: {
        framework: 'Virtual Boundaries',
        approach: 'Define geofence (center + radius or polygon). Monitor user location against fences. Trigger webhook/notification on enter/exit.',
        keyInsight: 'Geofencing is server-side check. Mobile OS also supports client-side geofencing (more battery efficient). Use both strategically.'
      },
      requirements: {
        functional: [
          'Define geofences (circle or polygon)',
          'Detect enter/exit events',
          'Trigger actions (notification, webhook)',
          'Support user-specific and global fences'
        ],
        nonFunctional: [
          'Fence check < 10ms per update'
        ]
      },
      hints: [
        'Fence: {id, center, radius} or {id, polygon: [points]}',
        'Check: point in circle or point in polygon',
        'Efficient: spatial index of fences, query by location'
      ],
      expectedComponents: ['Fence Manager', 'Containment Checker', 'Event Trigger'],
      successCriteria: ['Geofences trigger correctly', 'Events fired on transitions'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Privacy & Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Privacy Controls',
      phase: 4,
      phaseTitle: 'Privacy & Scale',
      learningObjective: 'Let users control location visibility',
      thinkingFramework: {
        framework: 'Granular Permissions',
        approach: 'Per-friend visibility: exact, approximate (city), hidden. Ghost mode: invisible to everyone. Time-based: share only during work hours.',
        keyInsight: 'Privacy is critical for location. Default to private. Users must opt-in to sharing. Make controls easy to find and use.'
      },
      requirements: {
        functional: [
          'Set visibility per friend (exact, fuzzy, hidden)',
          'Enable ghost mode (invisible to all)',
          'Schedule sharing windows',
          'Audit who can see location'
        ],
        nonFunctional: [
          'Privacy check < 5ms per query'
        ]
      },
      hints: [
        'Visibility: {user_id, friend_id, level: exact|city|hidden}',
        'Fuzzy: add random offset within 1km',
        'Ghost mode: skip user in all proximity queries'
      ],
      expectedComponents: ['Privacy Settings', 'Visibility Filter', 'Fuzzing Service'],
      successCriteria: ['Privacy controls enforced', 'Ghost mode works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Sharded Location Index',
      phase: 4,
      phaseTitle: 'Privacy & Scale',
      learningObjective: 'Scale to millions of concurrent users',
      thinkingFramework: {
        framework: 'Geographic Sharding',
        approach: 'Partition by geohash prefix. Each shard handles a region. Cross-shard queries for users near boundaries. Route updates to correct shard.',
        keyInsight: 'Most queries are local (nearby = same city). Shard by geography minimizes cross-shard queries. Hot spots (cities) may need finer sharding.'
      },
      requirements: {
        functional: [
          'Shard location index by geography',
          'Route updates to correct shard',
          'Handle cross-shard proximity queries',
          'Rebalance shards as needed'
        ],
        nonFunctional: [
          'Support 10M concurrent users',
          'Query latency unaffected by scale'
        ]
      },
      hints: [
        'Shard key: geohash prefix (first 3-4 chars)',
        'Cross-shard: query if radius crosses shard boundary',
        'Hot spot: NYC gets own shard, rural areas share'
      ],
      expectedComponents: ['Shard Router', 'Cross-Shard Query', 'Rebalancer'],
      successCriteria: ['Sharding distributes load', 'Queries work across shards'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Location Analytics',
      phase: 4,
      phaseTitle: 'Privacy & Scale',
      learningObjective: 'Derive insights from location data',
      thinkingFramework: {
        framework: 'Aggregate Analytics',
        approach: 'Heatmaps of user density. Popular times for places. Movement patterns (home/work detection). All anonymized and aggregated.',
        keyInsight: 'Individual location is sensitive. Aggregate patterns are valuable and less sensitive. Always aggregate before exposing analytics.'
      },
      requirements: {
        functional: [
          'Generate density heatmaps',
          'Detect home and work locations',
          'Analyze movement patterns',
          'Provide aggregated insights (anonymized)'
        ],
        nonFunctional: [
          'Analytics updated hourly',
          'No individual identification from analytics'
        ]
      },
      hints: [
        'Heatmap: count users per geohash cell over time',
        'Home: most common night location',
        'Aggregation: min 10 users per cell before exposing'
      ],
      expectedComponents: ['Analytics Pipeline', 'Heatmap Generator', 'Pattern Detector'],
      successCriteria: ['Insights generated', 'Privacy preserved'],
      estimatedTime: '8 minutes'
    }
  ]
};
