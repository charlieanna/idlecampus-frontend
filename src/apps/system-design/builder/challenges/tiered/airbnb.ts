/**
 * Generated Tiered Challenge: Airbnb - Vacation Rentals
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const airbnbChallenge: Challenge = {
  id: 'airbnb',
  title: 'Airbnb - Vacation Rentals',
  difficulty: 'beginner',
  description: `Design a vacation rental platform like Airbnb with search, booking, and review capabilities.

Critical Requirement: Prevent double-booking. Two guests must never be able to book the same property for overlapping dates.

The system must handle geo-distributed data with both batch analytics for historical insights and real-time updates for current availability and reviews.

Requirements:
• Hosts can list properties with photos and details
• Guests can search properties by location, dates, and amenities
• Platform handles payments and bookings atomically
• Users can leave reviews and ratings
• Prevent double-booking with proper isolation
• Geospatial search for location-based queries
• Real-time availability updates
• Batch processing for popularity scores and analytics
• Denormalized views for fast query performance`,
  
  requirements: {
  functional: [
    "Hosts can list properties with photos and details",
    "Guests can search and book properties",
    "Platform handles payments and bookings",
    "Users can leave reviews"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Search latency: p99 < 300ms (DDIA Ch. 3: Geospatial index)",
    "Booking transaction: ACID guarantees (DDIA Ch. 7: Serializable isolation)",
    "No double-bookings: Prevent with transactions (DDIA Ch. 7: Write skew prevention)",
    "Review aggregation: p99 < 100ms (DDIA Ch. 2: Denormalized average_rating)",
    "Availability query: < 50ms (DDIA Ch. 3: Composite index on dates)",
    "Referential integrity: Enforce FK constraints (DDIA Ch. 2: Relational model)",
    "Complex joins: < 200ms for 5-table queries (DDIA Ch. 2: Query optimization)",
    "Scalability: Partition by city/region (DDIA Ch. 6: Geographic partitioning)",
    "Batch processing: 6-hour refresh cycle (DDIA Ch. 12: Lambda batch layer)",
    "Real-time updates: < 5s latency (DDIA Ch. 12: Lambda speed layer)",
    "Serving layer latency: < 100ms (DDIA Ch. 12: Merge batch + realtime views)",
    "Batch job fault tolerance: Recompute from immutable log (DDIA Ch. 12: Event sourcing)",
    "Analytics accuracy: 100% from batch layer (DDIA Ch. 12: No approximations)",
    "Speed layer coverage: Last 6 hours (DDIA Ch. 12: Incremental updates)"
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
      "name": "Hosts can list properties with photos and details",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Hosts can list properties with photos and details\" works correctly. Must use object storage (S3) for files, not database.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Guests can search and book properties",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Guests can search and book properties\" works correctly. Must have search index for efficient queries.",
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
      "name": "Platform handles payments and bookings",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Platform handles payments and bookings\" works correctly.",
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
      "name": "Users can leave reviews",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Users can leave reviews\" works correctly. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
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
      "name": "NFR-P1: Normal Daily Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "System handles expected daily traffic with target latency. This is the baseline performance\ntest - system must meet latency targets under normal conditions.",
      "traffic": {
        "type": "read",
        "rps": 1200,
        "readRatio": 0.9,
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
      "description": "Traffic increases during peak hours (vacation booking season).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 2400,
        "readRatio": 0.9,
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
      "description": "Travel deal announced causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 1800,
        "readRatio": 0.9,
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
      "description": "Travel restrictions lifted globally - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 3600,
        "readRatio": 0.9,
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
        "rps": 1200,
        "readRatio": 0.9,
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
      "description": "Read traffic of 1080 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 600ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1800,
        "readRatio": 0.9,
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
      "description": "Write traffic bursts to 240 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 600ms. Without sharding/multi-leader: writes queue up, latency exceeds 1500ms.",
      "traffic": {
        "type": "write",
        "rps": 2400,
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
        "rps": 1200,
        "readRatio": 0.9,
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
        "rps": 1200,
        "readRatio": 0.9,
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
  "Learn blob storage for large files",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Airbnb Tech Blog",
    "url": "https://medium.com/airbnb-engineering"
  },
  {
    "label": "Official Site",
    "url": "https://www.airbnb.com/"
  },
  {
    "label": "Airbnb Architecture",
    "url": "https://medium.com/airbnb-engineering/building-services-at-airbnb-part-1-c4c1d8fa811b"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
listings = {}
bookings = {}
reviews = {}
payments = {}

def create_listing(listing_id: str, host_id: str, title: str, price_per_night: float, lat: float, lng: float) -> Dict:
    """
    FR-1: Hosts can list properties with photos and details
    Naive implementation - stores listing in memory
    """
    listings[listing_id] = {
        'id': listing_id,
        'host_id': host_id,
        'title': title,
        'description': "",
        'price_per_night': price_per_night,
        'lat': lat,
        'lng': lng,
        'photos': [],
        'created_at': datetime.now()
    }
    return listings[listing_id]

def search_listings(lat: float, lng: float, check_in: str, check_out: str, max_distance: float = 10.0) -> List[Dict]:
    """
    FR-2: Guests can search properties
    Naive implementation - returns all listings (no geospatial filtering)
    Real system would use geospatial database
    """
    # In real system, would filter by location, availability, dates
    return list(listings.values())

def book_property(booking_id: str, listing_id: str, guest_id: str, check_in: str, check_out: str) -> Dict:
    """
    FR-2: Guests can book properties
    Naive implementation - creates booking without conflict checking
    """
    if listing_id not in listings:
        return None

    listing = listings[listing_id]
    # Calculate nights and total (simplified)
    nights = 1  # Would calculate from dates in real system
    total_price = listing['price_per_night'] * nights

    bookings[booking_id] = {
        'id': booking_id,
        'listing_id': listing_id,
        'guest_id': guest_id,
        'check_in': check_in,
        'check_out': check_out,
        'total_price': total_price,
        'status': 'confirmed',
        'created_at': datetime.now()
    }
    return bookings[booking_id]

def process_payment(payment_id: str, booking_id: str, amount: float) -> Dict:
    """
    FR-3: Platform handles payments
    Naive implementation - stores payment record
    No actual payment processing
    """
    payments[payment_id] = {
        'id': payment_id,
        'booking_id': booking_id,
        'amount': amount,
        'status': 'completed',
        'created_at': datetime.now()
    }
    return payments[payment_id]

def leave_review(review_id: str, booking_id: str, reviewer_id: str, rating: int, comment: str) -> Dict:
    """
    FR-4: Users can leave reviews
    Naive implementation - stores review in memory
    """
    reviews[review_id] = {
        'id': review_id,
        'booking_id': booking_id,
        'reviewer_id': reviewer_id,
        'rating': rating,  # 1-5 stars
        'comment': comment,
        'created_at': datetime.now()
    }
    return reviews[review_id]

def get_listing_reviews(listing_id: str) -> List[Dict]:
    """
    Helper: Get all reviews for a listing
    Naive implementation - finds all bookings for listing and their reviews
    """
    listing_reviews = []
    # Find all bookings for this listing
    listing_booking_ids = [b['id'] for b in bookings.values() if b['listing_id'] == listing_id]

    # Find reviews for those bookings
    for review in reviews.values():
        if review['booking_id'] in listing_booking_ids:
            listing_reviews.append(review)

    return listing_reviews
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
        instances: 7,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "7 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 4,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "4 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 14,
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
          shards: 63,
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
  explanation: "Reference Solution for Airbnb - Vacation Rentals (Geospatial + Media + CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 4 instances handling 3240 read RPS (GET requests)\n- **Write API**: 3 instances handling 1680 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **14GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~2916 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 63 shards (sharded by region_id).\n  • Read Capacity: 3240 RPS across 4 database instance(s)\n  • Write Capacity: 1680 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🗺️ Geospatial Requirements:\n- **PostgreSQL with PostGIS Extension**: Adds spatial data types (point, polygon) and functions (ST_Distance, ST_Within) for location-based queries. Enables efficient \"find within radius\" queries using spatial indexes (GIST).\n- **Sharding by region_id**: Partitions data by geographic region for data locality. Co-locates related location data on same shard, reducing cross-shard queries for regional searches (DDIA Ch. 6 - Partitioning).\n- **Spatial Indexing**: R-tree indexes on location columns for O(log n) nearest-neighbor queries. Critical for \"find nearby drivers/restaurants\" use cases.\n\n🎥 Object Storage & CDN:\n- **S3 Object Storage**: Scalable storage for large files (photos, videos, documents). Provides 99.999999999% durability through redundant storage across multiple availability zones. Pay-per-use pricing scales with actual storage needs.\n- **CDN (Content Delivery Network)**: Distributes content globally via edge locations (150+ PoPs worldwide). Reduces latency for users by serving content from geographically nearest server. Offloads traffic from origin servers (S3).\n- **Separate Read Path**: Static content flows through client → CDN → S3, bypassing app servers. Reduces app server load and improves cache hit ratios.\n- **Upload Flow**: Clients upload directly to S3 (or via app server), then CDN pulls from S3 on first request and caches at edge (SDP - CDN).\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 90.0%, Write: 10.0%, Total: 3600 RPS)\n- **Read API (4 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (3 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 10.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 63 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on region_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
