import { ProblemDefinition } from '../../types/problemDefinition';
import {
  validConnectionFlowValidator,
  replicationConfigValidator,
  partitioningConfigValidator,
  highAvailabilityValidator,
  costOptimizationValidator,
} from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Uber - Ride Sharing Platform
 * DDIA Ch. 8 (Distributed Systems) - Distributed Consensus for Driver Allocation
 * DDIA Ch. 11 (Stream Processing) - Real-time Driver-Rider Matching
 *
 * DDIA Concepts Applied:
 * - Ch. 8: Distributed consensus for driver allocation (preventing double-allocation)
 *   - Two riders request same driver simultaneously
 *   - Solution: Linearizable register with compare-and-swap (CAS)
 *   - Raft/Paxos consensus for coordinating driver assignment across servers
 * - Ch. 8: Network partition handling in ride matching
 *   - Partition between rider's DC and driver's DC
 *   - Use eventual consistency with bounded staleness (< 10s)
 *   - Fallback to local-only matching during partition
 * - Ch. 8: Leader election for region coordinators
 *   - Each city has a leader server coordinating ride matching
 *   - Leader election with Raft: Highest server ID wins
 *   - Failover < 5s if leader crashes
 * - Ch. 8: Split-brain prevention for driver availability
 *   - Driver appears "available" in US-East but "on-ride" in US-West
 *   - Solution: Lease-based locking with fencing tokens
 *   - Driver state update requires majority quorum (2/3 DCs)
 * - Ch. 8: Eventual consistency for location updates with bounded staleness
 *   - Driver location updates every 4 seconds
 *   - Acceptable staleness: < 10 seconds (2-3 missed updates)
 *   - Riders see slightly stale driver location (trade-off for availability)
 * - Ch. 8: Handling partial failures in payment processing
 *   - Ride completed → Payment DB crashes → Retry with idempotency key
 *   - Use saga pattern: Reserve → Charge → Commit (compensate on failure)
 *
 * Double-Allocation Problem (DDIA Ch. 8 - Lost Update):
 * Scenario: Driver Alice is available, Riders Bob and Charlie both request a ride simultaneously
 *
 * Without Consensus:
 * Server 1 (Bob's request):
 *   1. Read: driver_123 status = "available"
 *   2. Assign Bob to driver_123
 *   3. Write: driver_123 status = "on_ride", rider = "Bob"
 *
 * Server 2 (Charlie's request) - concurrent:
 *   1. Read: driver_123 status = "available" (stale read!)
 *   2. Assign Charlie to driver_123
 *   3. Write: driver_123 status = "on_ride", rider = "Charlie"
 *
 * → BOTH SUCCEED! Driver double-allocated.
 *
 * Solution 1: Compare-and-Swap (CAS) with Version Numbers
 * drivers table: [id, status, rider_id, version, updated_at]
 *
 * Server 1:
 * SELECT version FROM drivers WHERE id = 'driver_123';  -- version = 10, status = "available"
 * UPDATE drivers SET status = 'on_ride', rider_id = 'Bob', version = version + 1
 *   WHERE id = 'driver_123' AND version = 10 AND status = 'available';
 * IF (affected_rows == 1) THEN success ELSE retry
 *
 * Server 2 (concurrent):
 * SELECT version FROM drivers WHERE id = 'driver_123';  -- version = 10, status = "available"
 * UPDATE drivers SET status = 'on_ride', rider_id = 'Charlie', version = version + 1
 *   WHERE id = 'driver_123' AND version = 10 AND status = 'available';
 * → affected_rows = 0 (version changed to 11 by Server 1) → FAIL, find another driver
 *
 * Solution 2: Distributed Lock with Raft Consensus
 * 1. Server 1 requests lock: LOCK(driver_123) via Raft leader
 * 2. Raft leader grants lock with lease (valid for 30s)
 * 3. Server 1 assigns Bob to driver_123
 * 4. Server 2 requests lock: LOCK(driver_123) → Denied (already locked)
 * 5. Server 1 releases lock: UNLOCK(driver_123)
 *
 * Leader Election for Region Coordinators (DDIA Ch. 8):
 * Each city (e.g., San Francisco) has 3 servers: S1, S2, S3
 *
 * Normal operation: S1 is leader, coordinates all ride matching
 *
 * S1 crashes:
 * T0: S1 stops sending heartbeats
 * T1 (5s later): S2 and S3 detect S1 failure (missed 2 heartbeats)
 * T2: S2 and S3 start election: S2 has higher ID → S2 becomes leader
 * T3: S2 broadcasts: "I am the new leader for SF region"
 * T4: All ride requests now routed to S2
 *
 * Raft election prevents split-brain: Only one leader at a time
 *
 * Network Partition Handling (DDIA Ch. 8):
 * Scenario: Rider in US-East requests ride, driver in US-West, network partition between DCs
 *
 * Option 1: Strong Consistency (wait for partition to heal)
 * - Rider waits indefinitely for driver match
 * - Poor user experience
 *
 * Option 2: Eventual Consistency with Fallback (chosen by Uber)
 * - US-East server times out waiting for US-West driver data (timeout = 5s)
 * - Fallback: Only match with drivers in US-East datacenter
 * - Trade-off: Slightly higher latency, but system remains available
 * - When partition heals: Resume global matching
 *
 * Bounded Staleness for Location Updates (DDIA Ch. 8):
 * Driver sends location every 4 seconds: T0, T4, T8, T12, ...
 *
 * Network glitch at T4 and T8 → Location updates lost
 * T12: Location update succeeds, but now 8 seconds stale
 *
 * Rider queries driver location:
 * - Server returns last known location from T4
 * - Adds staleness indicator: "Last updated 8 seconds ago"
 * - Rider sees driver icon with timestamp: "Location as of 8s ago"
 * - Acceptable for ride matching (driver hasn't moved far in 8s)
 *
 * Fencing Tokens for Driver State (DDIA Ch. 8):
 * Problem: Network partition → Driver appears "available" in multiple DCs
 *
 * T0: Driver Alice becomes "available" → Writes to all 3 DCs with token=5
 * T1: Network partition → US-East and EU-West can't communicate
 * T2: US-East assigns Alice to Bob (local decision, token=6)
 * T3: EU-West assigns Alice to Charlie (doesn't know about Bob, token=6 - CONFLICT!)
 *
 * Solution: Require majority quorum (2/3 DCs) before assignment
 * - US-East: Tries to write to US-East + US-West → Only 1/3 DCs → WAIT
 * - EU-West: Tries to write to EU-West + <partition> → Only 1/3 DCs → WAIT
 * - When partition heals: First write to reach 2/3 quorum wins
 *
 * Saga Pattern for Ride Payment (DDIA Ch. 8):
 * Step 1: Reserve credit on rider's account → Compensate: Release reserve
 * Step 2: Complete ride → Compensate: Mark ride as failed
 * Step 3: Charge rider → Compensate: Refund charge
 * Step 4: Pay driver → Compensate: Reverse payout
 *
 * If Step 3 fails (payment processor down):
 * - Execute compensating transaction for Step 2 (mark ride failed)
 * - Execute compensating transaction for Step 1 (release reserve)
 * - Retry payment later (eventual consistency)
 *
 * DDIA Ch. 11 - Stream Processing for Real-time Matching:
 *
 * Event Stream Architecture:
 * 1. Location Update Events → Kafka Topic: "driver-locations"
 *    {driver_id, lat, lng, status, timestamp, speed, heading}
 *    Published every 4 seconds by each active driver
 *
 * 2. Ride Request Events → Kafka Topic: "ride-requests"
 *    {request_id, rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, timestamp}
 *
 * 3. Stream Processor: Real-time Matching Engine (Kafka Streams)
 *    - Join ride requests with driver locations (stream-stream join)
 *    - Geospatial filtering: Find drivers within 2km radius
 *    - Stateful processing: Track driver availability in-memory
 *    - Ranking: Score drivers by distance, rating, acceptance rate
 *    - Output: Match candidate to "match-candidates" topic
 *
 * Stream-Stream Join Example (DDIA Ch. 11):
 *
 * Ride Request Stream (partitioned by city):
 * {request_123, rider_456, lat: 37.7749, lng: -122.4194, time: 10:00:00}
 *
 * Driver Location Stream (partitioned by city):
 * {driver_789, lat: 37.7750, lng: -122.4195, status: "available", time: 10:00:01}
 * {driver_890, lat: 37.7800, lng: -122.4300, status: "available", time: 10:00:01}
 *
 * Join Window: 30 seconds (join requests with driver locations within 30s)
 *
 * Joined Output:
 * {request_123, rider_456, driver_789, distance: 50m, score: 0.95}
 * {request_123, rider_456, driver_890, distance: 800m, score: 0.75}
 *
 * Stateful Matching Pipeline (DDIA Ch. 11):
 * rideRequests.stream()
 *   .selectKey((key, value) => getCityPartition(value.pickup_lat, value.pickup_lng))
 *   .join(
 *     driverLocations.stream(),
 *     (request, location) => ({
 *       request_id: request.id,
 *       driver_id: location.driver_id,
 *       distance: calculateDistance(request.pickup_lat, location.lat, ...),
 *       eta: estimateArrivalTime(location, request.pickup_lat)
 *     }),
 *     JoinWindows.of(Duration.ofSeconds(30)),
 *     StreamJoined.with(Serdes.String(), requestSerde, locationSerde)
 *   )
 *   .filter((key, match) => match.distance < 2000)  // Within 2km
 *   .filter((key, match) => match.driver_status == "available")
 *   .groupByKey()
 *   .aggregate(
 *     () => new ArrayList<Match>(),
 *     (key, match, agg) => rankAndSelectBest(agg, match)
 *   )
 *   .toStream()
 *   .to("match-candidates")
 *
 * Windowed State Stores (DDIA Ch. 11):
 * - State Store 1: "driver-availability" (KTable)
 *   Key: driver_id, Value: {status, last_location, last_updated}
 *   Updated on every location event
 *
 * - State Store 2: "pending-requests" (Windowed KTable)
 *   Key: request_id, Value: {rider_id, pickup, best_match, candidates[]}
 *   TTL: 5 minutes (auto-expire unmatched requests)
 *
 * Event-Driven Matching Flow (DDIA Ch. 11):
 * T0: Rider opens app → "ride_request_created" event
 * T1 (100ms): Stream processor joins with driver locations
 * T2 (200ms): Top 3 drivers ranked by distance + rating
 * T3 (300ms): Send match offer to driver #1 → "match_offered" event
 * T4 (8s): Driver #1 accepts → "match_accepted" event
 * T5 (8.1s): Update driver status: available → en_route
 *
 * If Driver #1 rejects (T4):
 * T4: "match_rejected" event
 * T5: Offer to driver #2 (fallback)
 *
 * Exactly-Once Driver Assignment (DDIA Ch. 11):
 * Problem: Network retry causes driver to be assigned twice
 *
 * Solution: Transactional Outbox Pattern
 * BEGIN TRANSACTION;
 *   INSERT INTO ride_assignments (ride_id, driver_id, idempotency_key);
 *   UPDATE drivers SET status = 'on_ride' WHERE id = driver_id AND status = 'available';
 *   INSERT INTO outbox (event_type, payload) VALUES ('driver_assigned', {...});
 * COMMIT;
 *
 * Outbox processor (separate stream):
 * - Read outbox table (CDC stream)
 * - Publish events to Kafka
 * - Delete outbox entry after successful publish
 *
 * Late-Arriving Location Updates (DDIA Ch. 11):
 * Normal Order:
 * T0: Location update 1 (lat: 37.7749) arrives at 10:00:00
 * T1: Location update 2 (lat: 37.7750) arrives at 10:00:04
 *
 * Out-of-Order (network delay):
 * T0: Location update 2 (lat: 37.7750) arrives at 10:00:04
 * T1: Location update 1 (lat: 37.7749) arrives at 10:00:06 (late by 2s!)
 *
 * Solution: Event-time processing with watermarks
 * - Use event timestamp (not processing timestamp)
 * - Watermark: Allow 10s for late events
 * - Discard events older than watermark (> 10s late)
 *
 * System Design Primer Concepts:
 * - Geospatial Indexing: QuadTree or Geohash for driver proximity search
 * - WebSocket/SSE: Real-time location updates and ride matching notifications
 * - Load Balancing: Geographic load balancing to route to nearest data center
 * - Caching: Cache driver locations in memory (Redis Geo)
 * - Message Queue: Async processing for ride matching, surge pricing calculations
 */
export const uberProblemDefinition: ProblemDefinition = {
  id: 'uber',
  title: 'Uber - Ride Sharing',
  description: `Design a ride-sharing platform like Uber that:
- Riders can request rides
- Drivers can accept ride requests
- Platform matches riders with nearby drivers
- Real-time location tracking during rides

Learning Objectives (DDIA Ch. 8, 11):
1. Prevent driver double-allocation with distributed consensus (DDIA Ch. 8)
   - Use compare-and-swap (CAS) with version numbers
   - Raft/Paxos consensus for distributed locking
2. Handle network partitions in ride matching (DDIA Ch. 8)
   - Fallback to local-only matching during partition
   - Eventual consistency with bounded staleness (< 10s)
3. Implement leader election for region coordinators (DDIA Ch. 8)
   - Raft-based leader election per city
   - Automatic failover if leader crashes (< 5s)
4. Design split-brain prevention for driver state (DDIA Ch. 8)
   - Quorum-based writes (2/3 datacenters)
   - Fencing tokens to prevent stale writes
5. Handle partial failures in payment processing (DDIA Ch. 8)
   - Saga pattern with compensating transactions
   - Idempotency keys for retry safety
6. Manage bounded staleness for location updates (DDIA Ch. 8)
   - Accept stale location data (< 10s) for availability
7. Implement real-time matching with stream processing (DDIA Ch. 11)
   - Stream-stream joins between ride requests and driver locations
   - Stateful processing with windowed state stores
   - Event-driven architecture for match workflow
8. Handle out-of-order events with watermarks (DDIA Ch. 11)
   - Event-time processing for late-arriving location updates
   - Grace period for delayed events
9. Ensure exactly-once semantics for assignments (DDIA Ch. 11)
   - Transactional outbox pattern
   - Idempotent stream processing`,

  // DDIA/SDP Non-Functional Requirements
  userFacingNFRs: [
    'No driver double-allocation: 100% guarantee (DDIA Ch. 8: CAS with version numbers)',
    'Consensus latency: < 100ms for driver assignment (DDIA Ch. 8: Raft leader local writes)',
    'Leader failover: < 5s to elect new leader (DDIA Ch. 8: Raft election timeout)',
    'Network partition tolerance: Fallback to local matching (DDIA Ch. 8: Bounded staleness)',
    'Split-brain prevention: Quorum writes (DDIA Ch. 8: 2/3 datacenters)',
    'Bounded staleness: Location updates < 10s stale (DDIA Ch. 8: Accept eventual consistency)',
    'Fencing tokens: Prevent stale driver writes (DDIA Ch. 8: Monotonic token numbers)',
    'Partial failure handling: Saga pattern for payment (DDIA Ch. 8: Compensating transactions)',
    'Idempotency: Retry-safe operations (DDIA Ch. 8: Unique request IDs)',
    'Real-time matching latency: < 300ms end-to-end (DDIA Ch. 11: Stream-stream join)',
    'Stream join window: 30s for request-location join (DDIA Ch. 11: Windowed joins)',
    'Out-of-order tolerance: 10s watermark (DDIA Ch. 11: Event-time processing)',
    'State recovery: < 60s from changelog (DDIA Ch. 11: Kafka Streams state stores)',
    'Exactly-once matching: No duplicate assignments (DDIA Ch. 11: Transactional outbox)',
    'Location stream throughput: 100K updates/second (DDIA Ch. 11: Scalable stream processing)',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process ride requests and matching',
      },
      {
        type: 'storage',
        reason: 'Need to store users, rides, payments',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends ride requests and location updates',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write ride data',
      },
    ],
    dataModel: {
      entities: ['rider', 'driver', 'ride', 'location', 'payment'],
      fields: {
        rider: ['id', 'name', 'phone', 'email', 'rating', 'created_at'],
        driver: ['id', 'name', 'phone', 'license', 'vehicle_id', 'rating', 'created_at'],
        ride: ['id', 'rider_id', 'driver_id', 'pickup_lat', 'pickup_lng', 'dropoff_lat', 'dropoff_lng', 'status', 'fare', 'created_at'],
        location: ['user_id', 'lat', 'lng', 'timestamp'],
        payment: ['id', 'ride_id', 'amount', 'method', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Location updates
        { type: 'geospatial_query', frequency: 'very_high' }, // Finding nearby drivers
        { type: 'read_by_key', frequency: 'high' }, // Getting ride details
      ],
    },
  },

  scenarios: generateScenarios('uber', problemConfigs.uber),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Replication Configuration (DDIA Ch. 5)',
      validate: replicationConfigValidator,
    },
    {
      name: 'Partitioning Configuration (DDIA Ch. 6)',
      validate: partitioningConfigValidator,
    },
    {
      name: 'High Availability (DDIA Ch. 5)',
      validate: highAvailabilityValidator,
    },
    {
      name: 'Cost Optimization (DDIA - Trade-offs)',
      validate: costOptimizationValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Tuple

# In-memory storage (naive implementation)
riders = {}
drivers = {}
rides = {}
locations = {}
payments = {}

def request_ride(ride_id: str, rider_id: str, pickup_lat: float, pickup_lng: float, dropoff_lat: float, dropoff_lng: float) -> Dict:
    """
    Riders can request rides
    Naive implementation - creates ride request
    """
    rides[ride_id] = {
        'id': ride_id,
        'rider_id': rider_id,
        'driver_id': None,
        'pickup_lat': pickup_lat,
        'pickup_lng': pickup_lng,
        'dropoff_lat': dropoff_lat,
        'dropoff_lng': dropoff_lng,
        'status': 'requested',
        'fare': 0,
        'created_at': datetime.now()
    }
    return rides[ride_id]

def accept_ride(ride_id: str, driver_id: str) -> Dict:
    """
    Drivers can accept ride requests
    Naive implementation - assigns driver to ride
    """
    if ride_id in rides:
        rides[ride_id]['driver_id'] = driver_id
        rides[ride_id]['status'] = 'accepted'
        return rides[ride_id]
    return None

def find_nearby_drivers(lat: float, lng: float, max_distance: float = 5.0) -> List[Dict]:
    """
    Platform matches riders with nearby drivers
    Naive implementation - returns all drivers (no geospatial calculation)
    Real system would use geospatial indexing
    """
    # In real system, would calculate distance and filter
    available_drivers = []
    for driver in drivers.values():
        if driver.get('status') == 'available':
            available_drivers.append(driver)
    return available_drivers

def update_location(user_id: str, lat: float, lng: float, user_type: str = "driver") -> Dict:
    """
    Real-time location tracking during rides
    Naive implementation - stores latest location
    """
    location_id = f"{user_id}_{datetime.now().timestamp()}"
    locations[location_id] = {
        'user_id': user_id,
        'user_type': user_type,
        'lat': lat,
        'lng': lng,
        'timestamp': datetime.now()
    }
    return locations[location_id]

def complete_ride(ride_id: str, fare: float) -> Dict:
    """
    Complete a ride and process payment
    Naive implementation - updates ride status and creates payment
    """
    if ride_id in rides:
        rides[ride_id]['status'] = 'completed'
        rides[ride_id]['fare'] = fare
        rides[ride_id]['completed_at'] = datetime.now()

        # Create payment
        payment_id = f"payment_{ride_id}"
        payments[payment_id] = {
            'id': payment_id,
            'ride_id': ride_id,
            'amount': fare,
            'method': 'card',
            'status': 'completed',
            'created_at': datetime.now()
        }

        return rides[ride_id]
    return None

def get_ride_history(rider_id: str) -> List[Dict]:
    """
    Get ride history for a rider
    Naive implementation - returns all rides for rider
    """
    rider_rides = []
    for ride in rides.values():
        if ride['rider_id'] == rider_id:
            rider_rides.append(ride)
    rider_rides.sort(key=lambda x: x['created_at'], reverse=True)
    return rider_rides
`,
};

// Auto-generate code challenges from functional requirements
(uberProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(uberProblemDefinition);
