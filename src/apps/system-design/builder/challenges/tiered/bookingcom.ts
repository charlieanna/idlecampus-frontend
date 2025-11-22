/**
 * Generated Tiered Challenge: Booking.com - Hotel Reservations
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const bookingcomChallenge: Challenge = {
  id: 'bookingcom',
  title: 'Booking.com - Hotel Reservations',
  difficulty: 'advanced',
  description: `Design a hotel booking platform like Booking.com that:
- Users can search for hotels by location and dates
- Users can view room availability and prices
- Users can book rooms and manage reservations
- Platform handles payments and cancellations

Learning Objectives (DDIA/SDP):
1. Design SQL schema with strong referential integrity (DDIA Ch. 2)
   - Foreign keys: room.hotel_id → hotel.id, booking.room_id → room.id
   - Cascading deletes: Delete hotel → cascade to rooms → cascade to bookings
2. Prevent double-bookings with ACID transactions (DDIA Ch. 7)
   - Serializable isolation level to prevent write skew
   - Pessimistic locking: SELECT FOR UPDATE when checking availability
3. Implement complex availability queries (DDIA Ch. 2)
   - JOIN rooms with bookings to find available rooms for date range
   - Handle overlapping date ranges correctly
4. Handle concurrent booking attempts (DDIA Ch. 7)
   - Optimistic locking with version numbers
   - Retry logic for serialization failures
5. Ensure atomicity for booking + payment (DDIA Ch. 7)
   - Two-phase commit or single transaction for both operations`,
  
  requirements: {
  functional: [
    "Users can search for hotels by location and dates",
    "Users can view room availability and prices",
    "Users can book rooms and manage reservations",
    "Platform handles payments and cancellations"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "No double-bookings: 100% guarantee (DDIA Ch. 7: SELECT FOR UPDATE + Serializable)",
    "Write skew prevention: Date range overlap check (DDIA Ch. 7: Temporal query)",
    "Booking transaction: ACID compliant (DDIA Ch. 7: Atomicity, Consistency, Isolation, Durability)",
    "Pessimistic locking: Lock room during checkout (DDIA Ch. 7: Exclusive lock)",
    "Optimistic locking: Version-based conflict detection (DDIA Ch. 7: Retry on version mismatch)",
    "Temporal overlap: Exclusion constraint on date range (DDIA Ch. 7: PostgreSQL GIST)",
    "Payment atomicity: Booking + payment in single txn (DDIA Ch. 7: Rollback on payment failure)",
    "Isolation level: Serializable for bookings (DDIA Ch. 7: Prevent concurrent conflicts)",
    "Concurrent bookings: Handle gracefully (DDIA Ch. 7: Serialization failure retry)"
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
      "name": "Users can search for hotels by location and dates",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can search for hotels by location and dates\" works correctly. Must have search index for efficient queries.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can view room availability and prices",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can view room availability and prices\" works correctly. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
      "traffic": {
        "type": "read",
        "rps": 100,
        "readRatio": 0.9
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can book rooms and manage reservations",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can book rooms and manage reservations\" works correctly.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Platform handles payments and cancellations",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Platform handles payments and cancellations\" works correctly.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
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
        "rps": 1500,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-P2: Peak Hour Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 450,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S1: Traffic Spike",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Unexpected event causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 600,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-S2: Viral Growth",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Platform goes viral - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 4500,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 750,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 300ms even during write bursts. Without CQRS: read latency spikes to 900ms+.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 1275 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 600ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 450 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 600ms. Without sharding/multi-leader: writes queue up, latency exceeds 1500ms.",
      "traffic": {
        "type": "write",
        "rps": 3000,
        "readRatio": 0.3,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 600,
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
        "rps": 1500,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
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
        "rps": 1500,
        "readRatio": 0.85,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 900,
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
    "label": "Booking.com Tech Blog",
    "url": "https://blog.booking.com/"
  },
  {
    "label": "Official Site",
    "url": "https://www.booking.com/"
  }
],
  
  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
hotels = {}
rooms = {}
bookings = {}
users = {}

def search_hotels(location: str, check_in: str, check_out: str) -> List[Dict]:
    """
    FR-1: Users can search for hotels by location and dates
    Naive implementation - simple location string matching, no real availability check
    """
    results = []
    for hotel in hotels.values():
        if location.lower() in hotel['address'].lower():
            results.append(hotel)
    return results

def get_room_availability(hotel_id: str, check_in: str, check_out: str) -> List[Dict]:
    """
    FR-2: Users can view room availability
    Naive implementation - returns all rooms, doesn't check actual bookings
    """
    available_rooms = []
    for room in rooms.values():
        if room['hotel_id'] == hotel_id:
            available_rooms.append(room)
    return available_rooms

def get_room_prices(hotel_id: str) -> List[Dict]:
    """
    FR-2: Users can view room prices
    Naive implementation - returns static prices per room type
    """
    hotel_rooms = []
    for room in rooms.values():
        if room['hotel_id'] == hotel_id:
            hotel_rooms.append({
                'room_id': room['id'],
                'type': room['type'],
                'price_per_night': room['price_per_night']
            })
    return hotel_rooms

def book_room(booking_id: str, room_id: str, user_id: str,
              check_in: str, check_out: str) -> Dict:
    """
    FR-3: Users can book rooms
    Naive implementation - no concurrency control, no double-booking prevention
    """
    room = rooms.get(room_id)
    if not room:
        raise ValueError("Room not found")

    # Calculate total price (simplified)
    check_in_date = datetime.fromisoformat(check_in)
    check_out_date = datetime.fromisoformat(check_out)
    nights = (check_out_date - check_in_date).days
    total_price = room['price_per_night'] * nights

    bookings[booking_id] = {
        'id': booking_id,
        'room_id': room_id,
        'user_id': user_id,
        'check_in': check_in,
        'check_out': check_out,
        'total_price': total_price,
        'status': 'confirmed',
        'created_at': datetime.now()
    }
    return bookings[booking_id]

def manage_reservation(booking_id: str, action: str) -> Dict:
    """
    FR-3: Users can manage reservations (cancel, modify)
    Naive implementation - simple status updates
    """
    booking = bookings.get(booking_id)
    if not booking:
        raise ValueError("Booking not found")

    if action == 'cancel':
        booking['status'] = 'cancelled'
    elif action == 'confirm':
        booking['status'] = 'confirmed'

    return booking

def get_user_bookings(user_id: str) -> List[Dict]:
    """
    FR-3: Users can view their reservations
    Naive implementation - iterates through all bookings
    """
    user_bookings = []
    for booking in bookings.values():
        if booking['user_id'] == user_id:
            user_bookings.append(booking)
    return user_bookings
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
        instances: 8,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "8 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 5,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "5 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 16,
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
          shards: 79,
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
      type: "read",
      label: "Read traffic (GET)"
    },
    {
      from: "load_balancer",
      to: "app_server",
      type: "write",
      label: "Write traffic (POST/PUT/DELETE)"
    },
    {
      from: "app_server",
      to: "redis",
      type: "read",
      label: "Read API checks cache"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "read",
      label: "Read API → Replicas"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "write",
      label: "Write API → Master"
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
  explanation: "Reference Solution for Booking.com - Hotel Reservations (Geospatial + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 5 instances handling 3825 read RPS (GET requests)\n- **Write API**: 3 instances handling 2100 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **16GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3443 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 79 shards (sharded by region_id).\n  • Read Capacity: 3825 RPS across 4 database instance(s)\n  • Write Capacity: 2100 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🗺️ Geospatial Requirements:\n- **PostgreSQL with PostGIS Extension**: Adds spatial data types (point, polygon) and functions (ST_Distance, ST_Within) for location-based queries. Enables efficient \"find within radius\" queries using spatial indexes (GIST).\n- **Sharding by region_id**: Partitions data by geographic region for data locality. Co-locates related location data on same shard, reducing cross-shard queries for regional searches (DDIA Ch. 6 - Partitioning).\n- **Spatial Indexing**: R-tree indexes on location columns for O(log n) nearest-neighbor queries. Critical for \"find nearby drivers/restaurants\" use cases.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 85.0%, Write: 15.0%, Total: 4500 RPS)\n- **Read API (5 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (3 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 15.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 79 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on region_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
