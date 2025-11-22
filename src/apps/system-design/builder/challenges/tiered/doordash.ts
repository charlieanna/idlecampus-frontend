/**
 * Generated Tiered Challenge: DoorDash - Food Delivery
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const doordashChallenge: Challenge = {
  id: 'doordash',
  title: 'DoorDash - Food Delivery',
  difficulty: 'beginner',
  description: `Design a food delivery platform like DoorDash that:
- Customers can browse restaurants and order food
- Platform matches orders with nearby dashers (drivers)
- Real-time tracking of delivery status
- Restaurants receive and manage orders`,
  
  requirements: {
  functional: [
    "Customers can browse restaurants and order food",
    "Platform matches orders with nearby dashers (drivers)",
    "Real-time tracking of delivery status"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency"
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
      "name": "Customers can browse restaurants and order food",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Customers can browse restaurants and order food\" works correctly.",
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
      "name": "Platform matches orders with nearby dashers (drive...",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Platform matches orders with nearby dashers (drivers)\" works correctly.",
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
      "name": "Real-time tracking of delivery status",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Real-time tracking of delivery status\" works correctly. Should process asynchronously using message queue.",
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
      "description": "Traffic increases during peak hours (lunch and dinner rush).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
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
      "description": "Rainy day order surge causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
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
      "description": "Platform goes viral - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
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
    "label": "DoorDash Engineering Blog",
    "url": "https://doordash.engineering/"
  },
  {
    "label": "Official Site",
    "url": "https://www.doordash.com/"
  },
  {
    "label": "DoorDash Architecture",
    "url": "https://doordash.engineering/category/architecture/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
restaurants = {}
menu_items = {}
customers = {}
drivers = {}
orders = {}

def browse_restaurants(customer_lat: float, customer_lng: float) -> List[Dict]:
    """
    FR-1: Customers can browse restaurants
    Naive implementation - returns all restaurants, no real distance calculation
    """
    return list(restaurants.values())

def get_menu(restaurant_id: str) -> List[Dict]:
    """
    FR-1: Customers can view menu items
    Naive implementation - returns all items for a restaurant
    """
    items = []
    for item in menu_items.values():
        if item['restaurant_id'] == restaurant_id:
            items.append(item)
    return items

def place_order(order_id: str, customer_id: str, restaurant_id: str,
                items: List[str]) -> Dict:
    """
    FR-1: Customers can order food
    Naive implementation - creates order without validation
    """
    # Calculate total (simplified)
    total = 0
    for item_id in items:
        item = menu_items.get(item_id)
        if item:
            total += item['price']

    orders[order_id] = {
        'id': order_id,
        'customer_id': customer_id,
        'restaurant_id': restaurant_id,
        'driver_id': None,
        'items': items,
        'total': total,
        'status': 'pending',
        'created_at': datetime.now()
    }
    return orders[order_id]

def match_driver(order_id: str) -> Optional[Dict]:
    """
    FR-2: Platform matches orders with nearby dashers
    Naive implementation - assigns first available driver
    """
    order = orders.get(order_id)
    if not order:
        return None

    # Find available driver
    for driver in drivers.values():
        if driver['status'] == 'available':
            driver['status'] = 'busy'
            order['driver_id'] = driver['id']
            order['status'] = 'assigned'
            return {
                'order_id': order_id,
                'driver_id': driver['id'],
                'driver_name': driver['name']
            }
    return None

def update_order_status(order_id: str, status: str) -> Dict:
    """
    FR-3: Real-time tracking of delivery status
    Naive implementation - simple status update
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    order['status'] = status
    order['updated_at'] = datetime.now()
    return order

def get_order_status(order_id: str) -> Dict:
    """
    FR-3: Track delivery status
    Naive implementation - returns current order state
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    driver_location = None
    if order['driver_id']:
        driver = drivers.get(order['driver_id'])
        if driver:
            driver_location = {
                'lat': driver.get('current_lat'),
                'lng': driver.get('current_lng')
            }

    return {
        'order_id': order['id'],
        'status': order['status'],
        'driver_location': driver_location
    }
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
  explanation: "Reference Solution for DoorDash - Food Delivery (Geospatial):\n\n📊 Infrastructure Components:\n- **6 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 6000 RPS (peak: 3000 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **11GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~1890 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 53 shards (sharded by region_id).\n  • Read Capacity: 2100 RPS across 4 database instance(s)\n  • Write Capacity: 1400 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🗺️ Geospatial Requirements:\n- **PostgreSQL with PostGIS Extension**: Adds spatial data types (point, polygon) and functions (ST_Distance, ST_Within) for location-based queries. Enables efficient \"find within radius\" queries using spatial indexes (GIST).\n- **Sharding by region_id**: Partitions data by geographic region for data locality. Co-locates related location data on same shard, reducing cross-shard queries for regional searches (DDIA Ch. 6 - Partitioning).\n- **Spatial Indexing**: R-tree indexes on location columns for O(log n) nearest-neighbor queries. Critical for \"find nearby drivers/restaurants\" use cases.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 53 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on region_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
