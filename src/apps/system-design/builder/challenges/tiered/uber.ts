/**
 * Generated Tiered Challenge: Uber - Ride Sharing
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const uberChallenge: Challenge = {
  id: 'uber',
  title: 'Uber - Ride Sharing',
  difficulty: 'beginner',
  description: `Design a ride-sharing platform like Uber with real-time matching and location tracking.

Critical Requirement: Prevent driver double-allocation. A driver can only accept one ride at a time, even during network partitions or concurrent requests.

The system must handle geo-distributed matching across multiple regions while maintaining consistency for driver state. When network partitions occur, the system should gracefully degrade to local-only matching.

Requirements:
• Riders can request rides
• Drivers can accept ride requests
• Platform matches riders with nearby drivers in real-time
• Real-time location tracking during rides
• Prevent driver double-allocation across all regions
• Handle network partitions with fallback to local matching
• Automatic failover for region coordinators
• Compensating transactions for failed payments
• Accept bounded staleness for location updates (under 10 seconds)
• Exactly-once semantics for ride assignments`,
  
  requirements: {
  functional: [
    "**POST /api/riders/:id/request** - Rider requests ride (pickup + dropoff location)",
    "**GET /api/riders/:id/nearby-drivers** - Find available drivers within radius (geospatial query)",
    "**POST /api/rides** - Create ride and assign driver (with double-allocation prevention)",
    "**POST /api/drivers/:id/accept** - Driver accepts ride request",
    "**POST /api/drivers/:id/location** - Driver updates GPS location (real-time streaming)",
    "**GET /api/rides/:id** - Get current ride status and driver location",
    "**POST /api/rides/:id/complete** - Complete ride and trigger payment",
    "**POST /api/payments** - Process payment for ride (with idempotency)",
    "**GET /api/drivers/:id/status** - Check driver availability (online/offline/on-ride)",
    "Real-time location updates streamed via WebSocket to rider during ride",
    "Ride matching uses stream processing (join rider requests with driver locations)"
  ],
  traffic: "1 RPS (70% reads, 30% writes)",
  latency: "p99 < 10s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "No driver double-allocation: 100% guarantee (DDIA Ch. 8: CAS with version numbers)",
    "Consensus latency: < 100ms for driver assignment (DDIA Ch. 8: Raft leader local writes)",
    "Leader failover: < 5s to elect new leader (DDIA Ch. 8: Raft election timeout)",
    "Network partition tolerance: Fallback to local matching (DDIA Ch. 8: Bounded staleness)",
    "Split-brain prevention: Quorum writes (DDIA Ch. 8: 2/3 datacenters)",
    "Bounded staleness: Location updates < 10s stale (DDIA Ch. 8: Accept eventual consistency)",
    "Fencing tokens: Prevent stale driver writes (DDIA Ch. 8: Monotonic token numbers)",
    "Partial failure handling: Saga pattern for payment (DDIA Ch. 8: Compensating transactions)",
    "Idempotency: Retry-safe operations (DDIA Ch. 8: Unique request IDs)",
    "Real-time matching latency: < 300ms end-to-end (DDIA Ch. 11: Stream-stream join)",
    "Stream join window: 30s for request-location join (DDIA Ch. 11: Windowed joins)",
    "Out-of-order tolerance: 10s watermark (DDIA Ch. 11: Event-time processing)",
    "State recovery: < 60s from changelog (DDIA Ch. 11: Kafka Streams state stores)",
    "Exactly-once matching: No duplicate assignments (DDIA Ch. 11: Transactional outbox)",
    "Location stream throughput: 100K updates/second (DDIA Ch. 11: Scalable stream processing)"
  ]
},
  
  availableComponents: [
  "client",
  "load_balancer",
  "app_server",
  "database",
  "redis",
  "message_queue",
  "cdn",
  "s3"
],
  
  testCases: [
    {
      "name": "Basic Connectivity",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify basic connectivity path exists. Like algorithm brute force: ignore performance,\njust verify Client → App → Database flow works. Very low traffic to test if system can handle basic operations.",
      "traffic": {
        "type": "read",
        "rps": 1,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 10000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Concurrent Users",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Multiple users accessing simultaneously. Test if system handles concurrent requests\nwithout conflicts or errors. Moderate traffic to verify scalability basics.",
      "traffic": {
        "type": "read",
        "rps": 200,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 400,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "Data Persistence",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify data is correctly stored and retrieved. Write operations must persist data\nto database. Read operations must return correct data. Tests data integrity.",
      "traffic": {
        "type": "write",
        "rps": 400,
        "readRatio": 0.3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 400,
        "maxErrorRate": 0
      }
    },
    {
      "name": "NFR-P1: Normal Daily Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "System handles expected daily traffic with target latency. This is the baseline performance\ntest - system must meet latency targets under normal conditions.",
      "traffic": {
        "type": "read",
        "rps": 2000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-P2: Peak Hour Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Traffic increases during peak hours (Friday night rush).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 4000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S1: Traffic Spike",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Concert lets out causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 400,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-S2: Viral Growth",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Service expands to 10 new cities - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 6000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 1400 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 1200 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 400ms. Without sharding/multi-leader: writes queue up, latency exceeds 1000ms.",
      "traffic": {
        "type": "write",
        "rps": 4000,
        "readRatio": 0.3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 400,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-R1: Database Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Primary database crashes at 30s into test. System must failover to replica to maintain\navailability. Without replication: complete outage. With replication: < 10s downtime.",
      "traffic": {
        "type": "read",
        "rps": 2000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxErrorRate": 0.1,
        "minAvailability": 0.95,
        "maxDowntime": 10
      },
      "failureInjection": {
        "type": "db_crash",
        "atSecond": 30,
        "recoverySecond": 90
      }
    },
    {
      "name": "NFR-R2: Cache Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Cache (Redis) fails at 20s. System must continue operating by hitting database directly.\nPerformance degrades but system stays up. Tests graceful degradation.",
      "traffic": {
        "type": "read",
        "rps": 2000,
        "readRatio": 0.7
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 600,
        "maxErrorRate": 0.05,
        "minAvailability": 0.95
      },
      "failureInjection": {
        "type": "cache_flush",
        "atSecond": 20
      }
    }
  ],
  
  learningObjectives: [
  "Understand client-server architecture",
  "Learn database connectivity and data persistence",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Uber Engineering Blog",
    "url": "https://www.uber.com/blog/engineering/"
  },
  {
    "label": "Official Site",
    "url": "https://www.uber.com/"
  },
  {
    "label": "System Design: Uber",
    "url": "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-uber"
  }
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
  
  codeChallenges,
  
  solution: {
  components: [
    {
      type: "client",
      config: {}
    },
    {
      type: "load_balancer",
      config: {
        algorithm: "least_connections"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 12
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 17,
        strategy: "cache_aside",
        hitRatio: 0.9,
        replication: "master-slave",
        persistence: "rdb"
      }
    },
    {
      type: "postgresql",
      config: {
        instanceType: "commodity-db",
        replicationMode: "multi-leader",
        replication: {
          enabled: true,
          replicas: 3,
          mode: "async"
        },
        sharding: {
          enabled: true,
          shards: 105,
          shardKey: "region_id"
        },
        displayName: "PostgreSQL Master",
        subtitle: "Writes + 3 replicas (reads)"
      }
    },
    {
      type: "cdn",
      config: {
        enabled: true
      }
    },
    {
      type: "s3",
      config: {}
    },
    {
      type: "message_queue",
      config: {}
    }
  ],
  connections: [
    {
      from: "client",
      to: "load_balancer",
      type: "read_write"
    },
    {
      from: "load_balancer",
      to: "app_server",
      type: "read_write"
    },
    {
      from: "app_server",
      to: "redis",
      type: "read_write"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "read_write"
    },
    {
      from: "redis",
      to: "postgresql",
      type: "read",
      label: "Cache miss → DB lookup"
    },
    {
      from: "client",
      to: "cdn",
      type: "read"
    },
    {
      from: "cdn",
      to: "s3",
      type: "read"
    },
    {
      from: "app_server",
      to: "s3",
      type: "read_write"
    },
    {
      from: "app_server",
      to: "message_queue",
      type: "write"
    }
  ],
  explanation: "Reference Solution for Uber - Ride Sharing (Geospatial):\n\n📊 Infrastructure Components:\n- **12 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 12000 RPS (peak: 6000 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **17GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3780 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 105 shards (sharded by region_id).\n  • Read Capacity: 4200 RPS across 4 database instance(s)\n  • Write Capacity: 2800 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🗺️ Geospatial Requirements:\n- **PostgreSQL with PostGIS Extension**: Adds spatial data types (point, polygon) and functions (ST_Distance, ST_Within) for location-based queries. Enables efficient \"find within radius\" queries using spatial indexes (GIST).\n- **Sharding by region_id**: Partitions data by geographic region for data locality. Co-locates related location data on same shard, reducing cross-shard queries for regional searches (DDIA Ch. 6 - Partitioning).\n- **Spatial Indexing**: R-tree indexes on location columns for O(log n) nearest-neighbor queries. Critical for \"find nearby drivers/restaurants\" use cases.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 105 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on region_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
