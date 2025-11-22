/**
 * Generated Tiered Challenge: Instacart - Grocery Delivery
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const instacartChallenge: Challenge = {
  id: 'instacart',
  title: 'Instacart - Grocery Delivery',
  difficulty: 'beginner',
  description: `Design a grocery delivery platform like Instacart that:
- Customers can order groceries from multiple stores
- Personal shoppers fulfill orders in real-time
- Platform handles inventory and substitutions
- Real-time order tracking and communication`,
  
  requirements: {
  functional: [
    "Customers can order groceries from multiple stores",
    "Personal shoppers fulfill orders in real-time",
    "Real-time order tracking and communication"
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
      "name": "Customers can order groceries from multiple stores",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Customers can order groceries from multiple stores\" works correctly.",
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
      "name": "Personal shoppers fulfill orders in real-time",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Personal shoppers fulfill orders in real-time\" works correctly.",
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
      "name": "Real-time order tracking and communication",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Real-time order tracking and communication\" works correctly. Should process asynchronously using message queue.",
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
        "rps": 800,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 250,
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
        "rps": 1600,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 375,
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
        "rps": 1200,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
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
        "rps": 2400,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 625,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 600 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 500ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1200,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 250,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 400 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 500ms. Without sharding/multi-leader: writes queue up, latency exceeds 1250ms.",
      "traffic": {
        "type": "write",
        "rps": 1600,
        "readRatio": 0.3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
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
        "rps": 800,
        "readRatio": 0.75
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
        "rps": 800,
        "readRatio": 0.75
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 750,
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
    "label": "Instacart Tech Blog",
    "url": "https://tech.instacart.com/"
  },
  {
    "label": "Official Site",
    "url": "https://www.instacart.com/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional

# In-memory storage (naive implementation)
customers = {}
stores = {}
products = {}
shoppers = {}
orders = {}
order_items = {}

def browse_products(store_id: str, category: str = None) -> List[Dict]:
    """
    FR-1: Customers can browse products
    Naive implementation - returns all products from a store
    """
    store_products = []
    for product in products.values():
        if product['store_id'] == store_id:
            if category is None or product.get('category') == category:
                store_products.append(product)
    return store_products

def create_order(order_id: str, customer_id: str, store_id: str,
                 items: List[Dict]) -> Dict:
    """
    FR-1: Customers can order groceries
    Naive implementation - creates order without validation
    """
    # Calculate total
    total = 0
    for item in items:
        product = products.get(item['product_id'])
        if product:
            total += product['price'] * item['quantity']
            # Store order items
            order_items[f"{order_id}_{item['product_id']}"] = {
                'order_id': order_id,
                'product_id': item['product_id'],
                'quantity': item['quantity'],
                'price': product['price']
            }

    orders[order_id] = {
        'id': order_id,
        'customer_id': customer_id,
        'store_id': store_id,
        'shopper_id': None,
        'status': 'pending',
        'total': total,
        'created_at': datetime.now()
    }
    return orders[order_id]

def assign_shopper(order_id: str) -> Optional[Dict]:
    """
    FR-2: Personal shoppers fulfill orders
    Naive implementation - assigns first available shopper
    """
    order = orders.get(order_id)
    if not order:
        return None

    # Find available shopper
    for shopper in shoppers.values():
        if shopper['status'] == 'available':
            shopper['status'] = 'shopping'
            order['shopper_id'] = shopper['id']
            order['status'] = 'shopping'
            return {
                'order_id': order_id,
                'shopper_id': shopper['id'],
                'shopper_name': shopper['name']
            }
    return None

def update_order_status(order_id: str, status: str) -> Dict:
    """
    FR-3: Real-time order tracking
    Naive implementation - updates order status
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    order['status'] = status
    order['updated_at'] = datetime.now()
    return order

def send_message(order_id: str, sender_id: str, message: str) -> Dict:
    """
    FR-3: Communication between customer and shopper
    Naive implementation - returns message confirmation
    """
    return {
        'order_id': order_id,
        'sender_id': sender_id,
        'message': message,
        'timestamp': datetime.now()
    }

def get_order_status(order_id: str) -> Dict:
    """
    FR-3: Track order
    Naive implementation - returns current order status
    """
    order = orders.get(order_id)
    if not order:
        raise ValueError("Order not found")

    return {
        'order_id': order['id'],
        'status': order['status'],
        'shopper_id': order.get('shopper_id')
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
        instances: 5
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 10,
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
          shards: 42,
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
  explanation: "Reference Solution for Instacart - Grocery Delivery (Geospatial):\n\n📊 Infrastructure Components:\n- **5 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 5000 RPS (peak: 2400 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **10GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~1620 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 42 shards (sharded by region_id).\n  • Read Capacity: 1800 RPS across 4 database instance(s)\n  • Write Capacity: 1120 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🗺️ Geospatial Requirements:\n- **PostgreSQL with PostGIS Extension**: Adds spatial data types (point, polygon) and functions (ST_Distance, ST_Within) for location-based queries. Enables efficient \"find within radius\" queries using spatial indexes (GIST).\n- **Sharding by region_id**: Partitions data by geographic region for data locality. Co-locates related location data on same shard, reducing cross-shard queries for regional searches (DDIA Ch. 6 - Partitioning).\n- **Spatial Indexing**: R-tree indexes on location columns for O(log n) nearest-neighbor queries. Critical for \"find nearby drivers/restaurants\" use cases.\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 42 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on region_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
