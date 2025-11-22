/**
 * Generated Tiered Challenge: Amazon - E-commerce Marketplace
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const amazonChallenge: Challenge = {
  id: 'amazon',
  title: 'Amazon - E-commerce Marketplace',
  difficulty: 'advanced',
  description: `Design an e-commerce marketplace like Amazon with inventory management and order processing.

Critical Requirement: Prevent inventory overselling. Multiple concurrent orders must never exceed available stock.

The system must coordinate distributed transactions across orders, inventory, and payments. For multi-warehouse scenarios, intelligently allocate stock from the closest warehouse first.

Requirements:
• Users can browse and search for products
• Users can add items to cart and checkout
• Users can track orders and view order history
• Sellers can list and manage products
• Prevent inventory overselling with atomic operations
• Coordinate distributed transactions across services
• Multi-warehouse inventory allocation
• Optimistic locking with version numbers for concurrent updates
• Appropriate isolation levels (read committed for browsing, serializable for checkout)`,
  
  requirements: {
  functional: [
    "Users can browse and search for products",
    "Users can add items to cart and checkout",
    "Users can track orders and view order history",
    "Sellers can list and manage products"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "No overselling: 100% guarantee (DDIA Ch. 7: Compare-and-set WHERE quantity >= qty)",
    "Lost update prevention: Atomic decrement (DDIA Ch. 7: Read-modify-write in single op)",
    "Optimistic locking: Version-based concurrency control (DDIA Ch. 7: Retry on conflict)",
    "Distributed transaction: Order + Inventory + Payment (DDIA Ch. 7: Two-phase commit)",
    "Isolation level: Serializable for checkout (DDIA Ch. 7: Prevent inventory race)",
    "Isolation level: Read Committed for browsing (DDIA Ch. 7: Fast, eventual consistency)",
    "Multi-warehouse allocation: Atomic lock on all warehouses (DDIA Ch. 7: SELECT FOR UPDATE)",
    "Order atomicity: All-or-nothing commit (DDIA Ch. 7: Rollback on payment failure)",
    "Checkout latency: p99 < 500ms (DDIA Ch. 7: Minimize 2PC coordinator overhead)"
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
      "name": "Users can browse and search for products",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can browse and search for products\" works correctly. Must have search index for efficient queries.",
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
      "name": "Users can add items to cart and checkout",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can add items to cart and checkout\" works correctly.",
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
      "name": "Users can track orders and view order history",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can track orders and view order history\" works correctly. Should cache reads to reduce database load. Should process asynchronously using message queue. Test flow: Client → [Cache] → App → Database.",
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
      "name": "Sellers can list and manage products",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Sellers can list and manage products\" works correctly.",
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
        "rps": 5000,
        "readRatio": 0.85
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
      "description": "Traffic increases during peak hours (holiday shopping season).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 10000,
        "readRatio": 0.85
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
      "description": "Lightning deal starts causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 7500,
        "readRatio": 0.85
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
      "description": "Prime Day traffic - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 15000,
        "readRatio": 0.85
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 200ms even during write bursts. Without CQRS: read latency spikes to 600ms+.",
      "traffic": {
        "type": "read",
        "rps": 5000,
        "readRatio": 0.85
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 4250 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 5 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 7500,
        "readRatio": 0.85
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
      "description": "Write traffic bursts to 1500 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 400ms. Without sharding/multi-leader: writes queue up, latency exceeds 1000ms.",
      "traffic": {
        "type": "write",
        "rps": 10000,
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
        "rps": 5000,
        "readRatio": 0.85
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
        "rps": 5000,
        "readRatio": 0.85
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
    "label": "AWS Architecture Blog",
    "url": "https://aws.amazon.com/blogs/architecture/"
  },
  {
    "label": "Official Site",
    "url": "https://www.amazon.com/"
  },
  {
    "label": "Amazon Dynamo Paper",
    "url": "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
products = {}
orders = {}
order_items = {}
cart = {}
inventory = {}

def search_products(query: str, category: str = None) -> List[Dict]:
    """
    FR-1: Users can browse and search for products
    Naive implementation - simple substring match
    """
    results = []
    for product in products.values():
        # Check query match
        if query and query.lower() not in product.get('name', '').lower():
            continue
        # Check category match
        if category and product.get('category') != category:
            continue
        results.append(product)
    return results

def add_to_cart(user_id: str, product_id: str, quantity: int) -> Dict:
    """
    FR-2: Users can add items to cart
    Naive implementation - stores cart items in memory
    """
    cart_key = f"{user_id}_{product_id}"
    cart[cart_key] = {
        'user_id': user_id,
        'product_id': product_id,
        'quantity': quantity,
        'added_at': datetime.now()
    }
    return cart[cart_key]

def checkout(order_id: str, user_id: str, shipping_address: str) -> Dict:
    """
    FR-2: Users can checkout
    Naive implementation - creates order from cart items
    No payment processing or inventory checks
    """
    # Get user's cart items
    user_cart_items = [item for item in cart.values() if item['user_id'] == user_id]

    # Calculate total
    total_amount = 0
    for item in user_cart_items:
        product = products.get(item['product_id'])
        if product:
            total_amount += product['price'] * item['quantity']

    # Create order
    orders[order_id] = {
        'id': order_id,
        'user_id': user_id,
        'total_amount': total_amount,
        'status': 'confirmed',
        'shipping_address': shipping_address,
        'created_at': datetime.now()
    }

    # Create order items
    for item in user_cart_items:
        item_key = f"{order_id}_{item['product_id']}"
        order_items[item_key] = {
            'order_id': order_id,
            'product_id': item['product_id'],
            'quantity': item['quantity'],
            'price': products[item['product_id']]['price']
        }

    # Clear cart
    for item in user_cart_items:
        cart_key = f"{user_id}_{item['product_id']}"
        if cart_key in cart:
            del cart[cart_key]

    return orders[order_id]

def track_order(order_id: str) -> Dict:
    """
    FR-3: Users can track orders
    Naive implementation - returns order status
    """
    return orders.get(order_id)

def get_order_history(user_id: str) -> List[Dict]:
    """
    FR-3: Users can view order history
    Naive implementation - returns all user orders
    """
    user_orders = []
    for order in orders.values():
        if order['user_id'] == user_id:
            user_orders.append(order)

    # Sort by created_at (most recent first)
    user_orders.sort(key=lambda x: x['created_at'], reverse=True)
    return user_orders
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
        instances: 26,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "26 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 14,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "14 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 43,
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
          shards: 263,
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
  explanation: "Reference Solution for Amazon - E-commerce Marketplace (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 16 instances handling 12750 read RPS (GET requests)\n- **Write API**: 9 instances handling 7000 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **43GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~11475 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 263 shards (sharded by user_id).\n  • Read Capacity: 12750 RPS across 4 database instance(s)\n  • Write Capacity: 7000 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 263 database shards. Each shard contains data for subset of users (e.g., user_id % 263 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 85.0%, Write: 15.0%, Total: 15000 RPS)\n- **Read API (16 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (9 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 15.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 263 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
