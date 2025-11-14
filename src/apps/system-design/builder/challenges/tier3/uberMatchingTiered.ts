/**
 * Uber Driver Matching - Tier 3 (Advanced)
 *
 * Fully pre-built algorithms with realistic performance
 * Students focus on system architecture and scaling
 */

import { TieredChallenge, PrebuiltBehavior } from '../../types/challengeTiers';

/**
 * Pre-built behaviors for Uber system
 */
const DRIVER_MATCHING_BEHAVIORS: PrebuiltBehavior[] = [
  {
    operation: 'match_driver_to_rider',
    description: `Geospatial matching algorithm that finds the best driver for a rider.

**Algorithm (pre-implemented):**
1. Query drivers within 5km radius using geohash
2. Filter by driver availability and vehicle type
3. Calculate ETA for each driver
4. Score drivers based on: distance (40%), rating (30%), ETA (30%)
5. Apply surge pricing multiplier if applicable
6. Return best match or queue request if no drivers available`,
    latency: {
      min: 50,
      max: 500,
      factors: [
        'Driver density in region (sparse areas slower)',
        'Number of concurrent requests',
        'Geospatial index performance',
      ],
    },
    throughput: 1000, // matches per second per instance
    dependencies: ['geo_index', 'redis_cache'],
    failureRate: 0.02, // 2% no drivers available
  },
  {
    operation: 'update_driver_location',
    description: `Update driver's real-time location (every 4 seconds).

**Processing:**
- Validate GPS coordinates
- Update geospatial index
- Update Redis cache
- Broadcast to nearby riders (if applicable)`,
    latency: 10,
    throughput: 10000, // location updates per second
    dependencies: ['geo_index', 'redis_cache', 'message_queue'],
    failureRate: 0.001,
  },
  {
    operation: 'calculate_surge_pricing',
    description: `Dynamic pricing based on supply and demand.

**Algorithm:**
- Query current supply (available drivers in region)
- Query current demand (pending + recent requests)
- Calculate ratio and apply pricing curve
- Update pricing in cache with 1-minute TTL`,
    latency: {
      min: 30,
      max: 100,
      factors: ['Region size', 'Historical data volume'],
    },
    throughput: 100,
    dependencies: ['analytics_db', 'redis_cache'],
    failureRate: 0.01,
    implementationNotes: 'Updates every minute per region. Uses ML model for demand prediction.',
  },
  {
    operation: 'calculate_route_and_fare',
    description: `Calculate optimal route and estimated fare.

**Processing:**
- Call mapping service for route
- Calculate distance and time
- Apply base fare + time + distance pricing
- Add surge multiplier if active`,
    latency: {
      min: 200,
      max: 800,
      factors: ['Route complexity', 'Traffic data availability'],
    },
    throughput: 500,
    dependencies: ['mapping_service', 'traffic_api'],
    failureRate: 0.03,
  },
];

/**
 * Pre-built behaviors for payment processing
 */
const PAYMENT_BEHAVIORS: PrebuiltBehavior[] = [
  {
    operation: 'process_payment',
    description: 'Process rider payment after trip completion',
    latency: {
      min: 500,
      max: 2000,
      factors: ['Payment method', 'Fraud check requirements'],
    },
    throughput: 100,
    dependencies: ['payment_gateway', 'fraud_detection'],
    failureRate: 0.05,
  },
  {
    operation: 'calculate_driver_payout',
    description: 'Calculate and queue driver earnings',
    latency: 50,
    throughput: 1000,
    dependencies: ['accounting_db', 'message_queue'],
    failureRate: 0.001,
  },
];

/**
 * Uber Matching Tier 3 Challenge
 */
export const uberMatchingTieredChallenge: TieredChallenge = {
  id: 'uber_matching_tiered',
  title: 'Uber Driver Matching (Tier 3)',
  difficulty: 'advanced',
  implementationTier: 'advanced',

  description: `Design Uber's real-time driver-rider matching system.

**Context:**
The matching algorithm is already implemented (you cannot change it).
Your job is to design the system architecture that can:
- Handle millions of concurrent users globally
- Process real-time location updates from drivers
- Match riders to drivers within seconds
- Handle regional failures gracefully
- Scale for New Year's Eve (10x traffic)

**Pre-built Components:**
- Geospatial matching algorithm (50-500ms latency)
- Surge pricing calculator
- Route & fare calculation
- Payment processing

**Your Focus:**
System architecture, not algorithms!`,

  requirements: {
    functional: [
      'Match riders to nearest available drivers',
      'Track driver locations in real-time',
      'Calculate dynamic surge pricing',
      'Handle payments and payouts',
      'Support multiple regions/cities',
    ],
    traffic: '100K concurrent drivers, 1M ride requests/day globally',
    latency: 'Match within 5 seconds, location updates < 100ms',
    availability: '99.99% uptime (4 minutes downtime/month)',
    budget: '$50,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'worker',
    'postgresql',
    'cassandra',
    'dynamodb',
    'redis',
    'message_queue',
    'cdn',
    's3',
  ],

  // Tier 3: All behaviors are pre-built
  prebuiltBehaviors: {
    app_server: DRIVER_MATCHING_BEHAVIORS,
    worker: PAYMENT_BEHAVIORS,
  },

  componentBehaviors: {
    appServer: {
      operations: {
        create: {
          baseLatency: 100, // Ride request
          cpuIntensive: true,
          memoryIntensive: true,
          complexityFactors: ['Geospatial query', 'Driver filtering', 'Surge calculation'],
        },
        update: {
          baseLatency: 10, // Location update
          cpuIntensive: false,
          ioIntensive: true,
          complexityFactors: ['Geo-index update', 'Cache update'],
        },
        read: {
          baseLatency: 50, // Status check
          ioIntensive: true,
        },
      },
    },
    worker: {
      behavior: 'external_api_call',
      externalApis: ['stripe', 'twilio'],
    },
    database: {
      dataModel: 'document', // For flexibility with location data
      schema: {
        tables: [
          {
            name: 'drivers',
            fields: [
              { name: 'driver_id', type: 'uuid', indexed: true },
              { name: 'location', type: 'geo_point', indexed: true },
              { name: 'geohash', type: 'string', indexed: true },
              { name: 'status', type: 'enum', indexed: true },
              { name: 'vehicle_type', type: 'string' },
              { name: 'rating', type: 'float' },
            ],
            primaryKey: 'driver_id',
          },
          {
            name: 'rides',
            fields: [
              { name: 'ride_id', type: 'uuid', indexed: true },
              { name: 'rider_id', type: 'uuid', indexed: true },
              { name: 'driver_id', type: 'uuid', indexed: true },
              { name: 'pickup_location', type: 'geo_point' },
              { name: 'dropoff_location', type: 'geo_point' },
              { name: 'status', type: 'enum', indexed: true },
              { name: 'fare', type: 'decimal' },
              { name: 'timestamp', type: 'timestamp', indexed: true },
            ],
            primaryKey: 'ride_id',
          },
        ],
        estimatedSize: '10M drivers, 1B rides, 10TB',
      },
    },
  },

  testCases: [
    {
      name: 'Normal Operations (San Francisco)',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Typical weekday traffic in one city',
      traffic: {
        type: 'mixed',
        rps: 1000, // 1000 requests/sec
        readRps: 700, // Status checks, location updates
        writeRps: 300, // New rides, location updates
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 500, // Match within 500ms
        maxErrorRate: 0.02,
      },
    },
    {
      name: 'New Years Eve (Global)',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Midnight surge across all cities (10x traffic)',
      traffic: {
        type: 'mixed',
        rps: 10000,
        readRps: 7000,
        writeRps: 3000,
      },
      duration: 300, // 5 minute test
      passCriteria: {
        maxErrorRate: 0.05,
        minAvailability: 0.99,
      },
    },
    {
      name: 'Regional Datacenter Failure',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'US-West region goes down',
      traffic: {
        type: 'mixed',
        rps: 1000,
      },
      duration: 60,
      failureInjection: {
        type: 'network_partition',
        atSecond: 20,
      },
      passCriteria: {
        maxErrorRate: 0.10, // Only US-West affected
        minAvailability: 0.90, // Other regions continue
      },
    },
    {
      name: 'Driver Location Storm',
      type: 'scalability',
      requirement: 'NFR-S2',
      description: '100K drivers sending location updates',
      traffic: {
        type: 'write',
        rps: 25000, // 100K drivers / 4 sec intervals
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.001,
      },
    },
  ],

  learningObjectives: [
    'Design geographically distributed systems',
    'Implement geo-sharding strategies',
    'Handle real-time data at scale',
    'Design for regional failure isolation',
    'Optimize hot-path operations (location updates)',
    'Understand CAP theorem tradeoffs in practice',
  ],

  hints: [
    {
      trigger: 'test_failed:Normal Operations',
      message: `💡 Your matching is too slow!

The algorithm itself takes 50-500ms (you can't change this).
Your architecture adds extra latency:

Missing components:
- Geo-spatial index? (Required for algorithm)
- Redis cache for driver locations?
- Regional sharding?

Without these, the matching algorithm degrades to O(n) scan!`,
    },
    {
      trigger: 'test_failed:Regional Datacenter Failure',
      message: `🌍 Regional failure is affecting global service!

Problems:
- Single point of failure
- No geo-replication
- No regional isolation

Solutions:
1. Shard by geography (city/region)
2. Each region operates independently
3. Use Cassandra/DynamoDB for multi-region replication
4. Region-specific load balancers`,
    },
    {
      trigger: 'test_failed:Driver Location Storm',
      message: `📍 Location updates are overwhelming the system!

25K updates/sec is crushing your database.

Solutions:
1. Use message queue to buffer updates
2. Batch writes to database
3. Update cache immediately, database async
4. Consider time-series database for location history`,
    },
    {
      trigger: 'component_missing:geo_index',
      message: `⚠️ Missing geospatial index!

The matching algorithm REQUIRES a geo-spatial index.
Without it, matching degrades from O(log n) to O(n).

Add Redis with geo commands or use specialized geo-database.`,
    },
  ],

  // UI configuration
  showCodeEditor: false,
  showAlgorithmConfig: false, // Pure architecture focus
};