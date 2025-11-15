import { ProblemCoachConfig, LevelCoachConfig } from '../types/coachConfig';

/**
 * Uber Coach Configuration
 * Pattern: Geospatial + Real-Time Matching + Location Tracking
 * Focus: Geo-indexing, proximity search, location updates, matching algorithms
 */

const level1Config: LevelCoachConfig = {
  level: 1,
  title: 'Level 1: Basic Ride Matching',
  goal: 'Build a system where riders request rides and drivers accept them',
  description: 'Learn the fundamentals of ride-sharing architecture',
  estimatedTime: '17 minutes',
  learningObjectives: [
    'Understand ride request and acceptance flow',
    'Design data model for riders, drivers, and rides',
    'Implement basic proximity search',
    'Handle ride state transitions',
  ],

  messages: [
    {
      trigger: { type: 'on_first_visit' },
      message: '👋 Welcome to Uber! You\'re building a ride-sharing platform. The core challenge: match riders with nearby drivers in real-time based on location.',
      messageType: 'info',
      icon: '👋',
      priority: 100,
      showOnce: true,
    },
    {
      trigger: { type: 'on_load' },
      message: '🎯 Goal: Match riders with drivers\n\nBasic flow:\n1. Rider requests ride (pickup location)\n2. Find nearby available drivers\n3. Driver accepts ride\n4. Track ride in progress\n\n💡 Key challenge: "Nearby" requires geospatial queries!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'app_server' },
      message: '✅ App Server added!\n\nHandles:\n• POST /ride/request - Rider requests ride\n• GET /drivers/nearby - Find drivers within radius\n• POST /ride/accept - Driver accepts\n• GET /ride/:id - Get ride status\n\nNow add storage!',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'postgresql' },
      message: '✅ PostgreSQL with PostGIS extension!\n\n💡 PostGIS adds geospatial capabilities:\n• POINT(lng, lat) data type\n• ST_Distance() - Calculate distance\n• ST_DWithin() - Find points within radius\n• Geo indexes for fast proximity search\n\n**Example**: Find drivers within 5km:\nSELECT * FROM drivers\nWHERE ST_DWithin(location, POINT(-122.4, 37.8), 5000)',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Valid Connection Flow' },
      message: '🔗 Connect the components!\n\nRide request flow:\n1. Client → App Server (request ride with location)\n2. App Server → PostgreSQL (query nearby drivers)\n3. App Server → Client (return driver options)\n4. Client → App Server (accept match)\n5. App Server → PostgreSQL (update ride status)',
      messageType: 'hint',
      icon: '💡',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Basic matching works!\n\nBut there\'s a problem: drivers are moving! Static locations in PostgreSQL get stale. We need real-time location updates!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Uber needs to find drivers by location (latitude, longitude). Regular databases can\'t efficiently query "find all drivers within 5km". You need geospatial indexing.',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 3 },
      hint: '🔍 Specific hint: Add:\n1. App Server (matching logic)\n2. PostgreSQL with PostGIS (geospatial queries)\n\nPostGIS provides:\n• Geo data types (POINT, POLYGON)\n• Distance calculations\n• Proximity search',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 5, minTimeSeconds: 200 },
      hint: '🎯 Direct solution:\n• App Server for business logic\n• PostgreSQL + PostGIS for geospatial queries\n\nConnect: Client → App → PostgreSQL\n\nQuery: ST_DWithin(location, POINT(lng, lat), radius)',
      hintLevel: 3,
    },
  ],
};

const level2Config: LevelCoachConfig = {
  level: 2,
  title: 'Level 2: Real-Time Location Tracking',
  goal: 'Handle live location updates from thousands of moving drivers',
  description: 'Optimize for high-frequency location writes and proximity queries',
  estimatedTime: '24 minutes',
  learningObjectives: [
    'Handle high-frequency location updates (every 4 seconds)',
    'Use Redis Geospatial for fast proximity search',
    'Implement WebSocket for real-time tracking',
    'Optimize write throughput for location data',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 2: Real-time location tracking!\n\n**Problem**: Drivers update location every 4 seconds.\n• 100K active drivers = 25K writes/second\n• PostgreSQL PostGIS too slow for this!\n\n**Solution**: In-memory geo-indexing with Redis!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis Geospatial is PERFECT for this!\n\n💡 Redis Geo commands:\n• GEOADD drivers:available -122.4 37.8 driver_123\n• GEORADIUS drivers:available -122.4 37.8 5 km\n• GEOPOS drivers:available driver_123\n\n**Performance**:\n• In-memory (sub-millisecond)\n• Built-in geo indexing\n• Handles millions of locations\n\n**Flow**: Driver updates → Redis (not PostgreSQL)',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'bottleneck_detected', component: 'postgresql' },
      message: '⚠️ PostgreSQL bottleneck on location writes!\n\nProblem: 25K location updates/second overwhelming PostgreSQL.\n\n💡 Solution:\n1. Store live locations in Redis Geospatial\n2. Keep ride data in PostgreSQL\n3. Periodically snapshot Redis → PostgreSQL for history\n\n**Redis**: Fast, in-memory, geo-indexed\n**PostgreSQL**: Durable, historical data',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'component_added', componentType: 'websocket' },
      message: '✅ WebSocket for live tracking!\n\n💡 During active ride:\n1. Driver sends location via WebSocket every 4s\n2. App server updates Redis\n3. App server pushes to rider via WebSocket\n4. Rider sees driver approaching in real-time!\n\n**Map updates**: Smooth tracking on rider\'s screen\n**ETA updates**: Recalculated based on current location',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'message_queue' },
      message: '✅ Message Queue for location history!\n\n💡 Async archival:\n1. Driver updates location → Redis (real-time)\n2. Publish to queue (non-blocking)\n3. Consumer writes to PostgreSQL (historical)\n\nBenefits:\n• Real-time path doesn\'t wait for DB write\n• Historical data for analytics\n• Replay trips for disputes',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Real-time tracking works! Drivers moving on the map!\n\nYou\'ve learned:\n• Redis Geospatial for proximity\n• WebSocket for live updates\n• Async archival for history\n\nNext: Intelligent matching algorithms!',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_level',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: 25K location writes/second is too much for PostgreSQL. You need an in-memory data store with built-in geospatial indexing. Redis has this!',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint: Add:\n1. Redis Geospatial (live driver locations)\n2. WebSocket (real-time tracking)\n3. Message Queue (async historical writes)\n\nFlow: Driver → WebSocket → App → Redis (+ Queue → PostgreSQL)',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 270 },
      hint: '🎯 Direct solution:\n• Redis Geospatial for GEOADD/GEORADIUS\n• WebSocket for location streaming\n• Message Queue (Kafka) for PostgreSQL archival\n• Keep ride metadata in PostgreSQL\n• Live locations only in Redis',
      hintLevel: 3,
    },
  ],
};

const level3Config: LevelCoachConfig = {
  level: 3,
  title: 'Level 3: Intelligent Matching & Routing',
  goal: 'Optimize driver assignment with ETA prediction and route optimization',
  description: 'Add advanced matching algorithms and navigation',
  estimatedTime: '27 minutes',
  learningObjectives: [
    'Implement surge pricing and supply-demand matching',
    'Add route optimization with mapping APIs',
    'Handle high-concurrency ride requests',
    'Implement driver dispatch algorithms',
  ],

  messages: [
    {
      trigger: { type: 'on_load' },
      message: '🎯 Level 3: Intelligent matching!\n\nChallenges:\n• Choose BEST driver, not just nearest\n• Calculate ETA (roads, traffic, not straight line)\n• Surge pricing during high demand\n• Prevent double-booking of drivers\n\nTime for smart algorithms!',
      messageType: 'info',
      icon: '🎯',
      priority: 90,
    },
    {
      trigger: { type: 'component_added', componentType: 'redis' },
      message: '✅ Redis for distributed matching!\n\n💡 Prevent double-booking:\n1. Rider requests ride\n2. App finds 5 nearest drivers\n3. Acquire Redis lock: SETNX driver:{id}:reserved ride_id EX 10\n4. Send push notification to driver\n5. If accepted: keep lock. If timeout: release.\n\n**Distributed lock**: Ensures one driver = one ride at a time',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'external_api' },
      message: '✅ Mapping API (Google Maps / Mapbox)!\n\n💡 Features:\n1. **Geocoding**: Address → (lat, lng)\n2. **Routing**: Calculate best path A → B\n3. **ETA**: Traffic-aware time estimates\n4. **Distance Matrix**: Batch calculate driver ETAs\n\n**Example**: Find which of 10 drivers reaches pickup fastest\nDISTANCE_MATRIX(drivers, pickup_location) → ETAs',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'component_added', componentType: 'machine_learning' },
      message: '✅ ML for demand prediction and pricing!\n\n💡 Use cases:\n1. **Surge pricing**: Predict demand spikes (concerts, airports)\n2. **Driver allocation**: Where to send idle drivers\n3. **ETA accuracy**: ML model beats simple distance/speed\n4. **Fraud detection**: Identify fake rides\n\n**Model**: XGBoost trained on historical ride data',
      messageType: 'success',
      icon: '✅',
      showOnce: true,
    },
    {
      trigger: { type: 'validator_failed', validatorName: 'Matching Algorithm' },
      message: '⚠️ Improve matching algorithm!\n\nSimple proximity isn\'t enough. Consider:\n1. **ETA to pickup** (not straight-line distance)\n2. **Driver rating** (prefer highly-rated)\n3. **Acceptance rate** (prefer reliable drivers)\n4. **Vehicle type** (UberX vs UberXL)\n5. **Destination alignment** (if driver heading that way)\n\n**Score** = f(ETA, rating, acceptance_rate, type_match)',
      messageType: 'warning',
      icon: '⚠️',
    },
    {
      trigger: { type: 'all_tests_passed' },
      message: '🎉 Uber is production-ready! 🚗\n\nYou\'ve mastered:\n✓ Geospatial indexing (PostGIS, Redis Geo)\n✓ Real-time location tracking (WebSocket)\n✓ High-frequency writes (25K/sec)\n✓ Intelligent matching algorithms\n✓ ETA prediction with traffic\n✓ Distributed locks (prevent double-booking)\n✓ Surge pricing with demand prediction\n\nThis is real Uber architecture! 🚀',
      messageType: 'celebration',
      icon: '🎉',
      action: {
        type: 'next_problem',
        problemId: 'doordash',
      },
    },
  ],

  unlockHints: [
    {
      condition: { minAttempts: 2 },
      hint: '💡 Hint: Three enhancements:\n1. Prevent double-booking with distributed locks\n2. Calculate ETA with mapping APIs (not straight-line distance)\n3. Predict demand for surge pricing',
      hintLevel: 1,
    },
    {
      condition: { minAttempts: 4 },
      hint: '🔍 Specific hint:\n1. Redis distributed locks (SETNX) for driver reservation\n2. Google Maps Distance Matrix API for accurate ETAs\n3. ML service for demand prediction and pricing\n4. Scoring algorithm: score = f(ETA, rating, acceptance_rate)',
      hintLevel: 2,
    },
    {
      condition: { minAttempts: 6, minTimeSeconds: 310 },
      hint: '🎯 Direct solution:\n• Redis SETNX for distributed locks\n• Google Maps API for routing and ETAs\n• ML model (deployed via API) for surge pricing\n• Matching algorithm:\n  - GEORADIUS for candidates (10 nearest)\n  - Distance Matrix API for actual ETAs\n  - Score and rank by (ETA * 0.6 + rating * 0.4)\n  - Reserve top driver with Redis lock',
      hintLevel: 3,
    },
  ],
};

export const uberCoachConfig: ProblemCoachConfig = {
  problemId: 'uber',
  archetype: 'geospatial',
  levelConfigs: {
    1: level1Config,
    2: level2Config,
    3: level3Config,
  },
  celebrationMessages: {
    1: '🎉 Level 1 Complete!\n\nBasic matching works! You understand:\n• Geospatial queries with PostGIS\n• Proximity search (ST_DWithin)\n• Ride state management\n\nNext: Real-time location tracking!',
    2: '🎉 Level 2 Complete!\n\nReal-time tracking is live! You\'ve learned:\n• Redis Geospatial (GEORADIUS, GEOADD)\n• WebSocket for location streaming\n• High-frequency writes (25K/sec)\n• Async archival with message queues\n\nNext: Intelligent matching!',
    3: '🎉 Uber Complete! 🚗\n\nYou\'ve mastered geospatial systems at scale:\n✓ PostGIS for geospatial queries\n✓ Redis Geo for real-time locations\n✓ WebSocket for live tracking\n✓ Distributed locks (prevent double-booking)\n✓ Mapping APIs for ETA prediction\n✓ ML for surge pricing\n✓ Intelligent matching algorithms\n\nThis is production Uber architecture! 🚀',
  },
  nextProblemRecommendation: 'doordash',
  prerequisites: [],
  estimatedTotalTime: '68 minutes',
};

export function getUberLevelConfig(level: number): LevelCoachConfig | null {
  return uberCoachConfig.levelConfigs[level] || null;
}
