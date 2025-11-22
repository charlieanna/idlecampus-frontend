/**
 * Generated Tiered Challenge: Ticketmaster - Event Ticketing
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const ticketmasterChallenge: Challenge = {
  id: 'ticketmaster',
  title: 'Ticketmaster - Event Ticketing',
  difficulty: 'advanced',
  description: `Design an event ticketing platform like Ticketmaster with strong consistency guarantees.

Critical Requirement: Prevent double-booking at all costs. Two users must never be able to purchase the same seat.

The system must handle high-demand ticket drops where thousands of users compete for limited inventory. During checkout, seats are temporarily reserved with a timeout mechanism.

Requirements:
• Users browse and search for events
• Users purchase tickets with seat selection
• Platform prevents double-booking (100% guarantee)
• Temporary seat reservations expire after timeout
• Handle payment failures with compensating transactions
• Maintain consistency during high-concurrency scenarios`,
  
  requirements: {
  functional: [
    "Users can browse and search for events",
    "Users can purchase tickets with seat selection"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "No double-booking: 100% guarantee",
    "Purchase latency: p99 < 500ms",
    "Concurrent bookings: Handle gracefully with retries",
    "Temporary reservation: 10-minute timeout",
    "Seat availability: Consistent view during selection",
    "Payment failures: Automatic rollback",
    "High concurrency: Support 1000+ simultaneous purchase attempts",
    "Availability: 99.95% uptime"
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
      "name": "Users can browse and search for events",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can browse and search for events\" works correctly. Should process asynchronously using message queue. Must have search index for efficient queries.",
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
      "name": "Users can purchase tickets with seat selection",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can purchase tickets with seat selection\" works correctly.",
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
        "rps": 1000,
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
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 2000,
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
      "description": "Popular concert tickets go on sale causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 1500,
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
      "description": "Multiple major events on sale - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 3000,
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
      "description": "Read traffic of 700 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1500,
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
      "description": "Write traffic bursts to 600 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 400ms. Without sharding/multi-leader: writes queue up, latency exceeds 1000ms.",
      "traffic": {
        "type": "write",
        "rps": 2000,
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
        "rps": 1000,
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
        "rps": 1000,
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
    "label": "Ticketmaster Tech Blog",
    "url": "https://tech.ticketmaster.com/"
  },
  {
    "label": "Official Site",
    "url": "https://www.ticketmaster.com/"
  },
  {
    "label": "System Design: Ticketmaster",
    "url": "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-ticketmaster"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
users = {}
events = {}
venues = {}
seats = {}
tickets = {}

def search_events(query: str = None, category: str = None, city: str = None) -> List[Dict]:
    """
    FR-1: Users can browse and search for events
    Naive implementation - simple text matching
    """
    results = []
    for event in events.values():
        if query and query.lower() not in event['name'].lower():
            continue
        if category and event.get('category') != category:
            continue
        # In a real system, would match city via venue
        results.append(event)
    return results

def get_available_seats(event_id: str) -> List[Dict]:
    """
    FR-2: View available seats for an event
    Naive implementation - returns seats not in tickets
    """
    event = events.get(event_id)
    if not event:
        raise ValueError("Event not found")

    venue_id = event['venue_id']

    # Find all seats for venue
    venue_seats = []
    for seat in seats.values():
        if seat['venue_id'] == venue_id:
            venue_seats.append(seat)

    # Filter out sold seats
    sold_seat_ids = set()
    for ticket in tickets.values():
        if ticket['event_id'] == event_id and ticket['status'] in ['sold', 'reserved']:
            sold_seat_ids.add(ticket['seat_id'])

    available = [s for s in venue_seats if s['id'] not in sold_seat_ids]
    return available

def purchase_ticket(ticket_id: str, event_id: str, user_id: str, seat_id: str,
                    price: float) -> Dict:
    """
    FR-2: Users can purchase tickets with seat selection
    Naive implementation - no double-booking prevention
    """
    # Check if seat is available (naive check)
    for ticket in tickets.values():
        if ticket['event_id'] == event_id and ticket['seat_id'] == seat_id:
            if ticket['status'] in ['sold', 'reserved']:
                raise ValueError("Seat already taken")

    tickets[ticket_id] = {
        'id': ticket_id,
        'event_id': event_id,
        'user_id': user_id,
        'seat_id': seat_id,
        'price': price,
        'status': 'sold',
        'purchased_at': datetime.now()
    }
    return tickets[ticket_id]

def get_user_tickets(user_id: str) -> List[Dict]:
    """
    Helper: Get all tickets for a user
    Naive implementation - returns user's tickets
    """
    user_tickets = []
    for ticket in tickets.values():
        if ticket['user_id'] == user_id:
            user_tickets.append(ticket)
    return user_tickets
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
        instances: 6
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 11,
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
          shards: 53,
          shardKey: "user_id"
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
  explanation: "Reference Solution for Ticketmaster - Event Ticketing:\n\n📊 Infrastructure Components:\n- **6 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 6000 RPS (peak: 3000 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **11GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~1890 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 53 shards (sharded by user_id).\n  • Read Capacity: 2100 RPS across 4 database instance(s)\n  • Write Capacity: 1400 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 53 database shards. Each shard contains data for subset of users (e.g., user_id % 53 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 53 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
