/**
 * Generated Tiered Challenge: Shopify - E-commerce Platform
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const shopifyChallenge: Challenge = {
  id: 'shopify',
  title: 'Shopify - E-commerce Platform',
  difficulty: 'advanced',
  description: `Design an e-commerce platform like Shopify that:
- Store owners can create online stores
- Store owners can manage products and inventory
- Customers can browse and purchase products
- Platform handles payments and order fulfillment

Learning Objectives (DDIA Ch. 7):
1. Implement compare-and-set for atomic inventory deduction (DDIA Ch. 7)
   - UPDATE inventory = inventory - qty WHERE inventory >= qty
   - Prevent overselling without explicit locks
2. Design multi-tenant transaction isolation (DDIA Ch. 7)
   - Store A transactions don't block Store B
   - Partition by store_id for scalability
3. Prevent lost updates with optimistic locking (DDIA Ch. 7)
   - Version field for concurrent inventory updates
   - Retry logic on version conflict
4. Coordinate Order + Payment + Inventory transaction (DDIA Ch. 7)
   - All succeed or all fail (atomicity)
   - Two-phase commit if payment is external service
5. Use appropriate isolation levels (DDIA Ch. 7)
   - Read Committed for browsing
   - Serializable for checkout`,
  
  requirements: {
  functional: [
    "Store owners can create online stores",
    "Store owners can manage products and inventory",
    "Customers can browse and purchase products"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "No overselling: 100% guarantee (DDIA Ch. 7: Compare-and-set atomic decrement)",
    "Inventory atomicity: Order + Payment + Inventory (DDIA Ch. 7: ACID transaction)",
    "Lost update prevention: Optimistic locking (DDIA Ch. 7: Version field)",
    "Multi-tenant isolation: Store A ≠ Store B (DDIA Ch. 7: Row-level locks by store_id)",
    "Isolation level: Serializable for checkout (DDIA Ch. 7: Prevent race conditions)",
    "Isolation level: Read Committed for browse (DDIA Ch. 7: Fast, eventual consistency)",
    "Compare-and-set: WHERE inventory >= qty (DDIA Ch. 7: Atomic check-and-update)",
    "Concurrent orders: Handle gracefully (DDIA Ch. 7: Retry on conflict)",
    "Checkout latency: p99 < 500ms (DDIA Ch. 7: Minimize lock contention)"
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
      "name": "Store owners can create online stores",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Store owners can create online stores\" works correctly. Test flow: Client → App → Database.",
      "traffic": {
        "type": "write",
        "rps": 50,
        "readRatio": 0.3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Store owners can manage products and inventory",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Store owners can manage products and inventory\" works correctly.",
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
      "name": "Customers can browse and purchase products",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Customers can browse and purchase products\" works correctly.",
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
        "readRatio": 0.8
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
      "description": "Traffic increases during peak hours (Black Friday sales).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.8
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
      "description": "Flash sale begins causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.8
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
      "description": "Platform adopted by major retailers - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 4500,
        "readRatio": 0.8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 625,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 250ms even during write bursts. Without CQRS: read latency spikes to 750ms+.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.8
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 250,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 1200 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 500ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.8
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
      "description": "Write traffic bursts to 600 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 500ms. Without sharding/multi-leader: writes queue up, latency exceeds 1250ms.",
      "traffic": {
        "type": "write",
        "rps": 3000,
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
        "rps": 1500,
        "readRatio": 0.8
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
        "readRatio": 0.8
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
    "label": "Shopify Engineering Blog",
    "url": "https://shopify.engineering/"
  },
  {
    "label": "Official Site",
    "url": "https://www.shopify.com/"
  },
  {
    "label": "Shopify Architecture",
    "url": "https://shopify.engineering/e-commerce-at-scale-inside-shopifys-tech-stack"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
stores = {}
products = {}
orders = {}
customers = {}
payments = {}

def create_store(store_id: str, owner_id: str, name: str, domain: str) -> Dict:
    """
    FR-1: Store owners can create online stores
    Naive implementation - creates store in memory
    """
    stores[store_id] = {
        'id': store_id,
        'owner_id': owner_id,
        'name': name,
        'domain': domain,
        'theme': 'default',
        'created_at': datetime.now()
    }
    return stores[store_id]

def add_product(product_id: str, store_id: str, name: str, price: float,
                inventory: int, description: str = None) -> Dict:
    """
    FR-2: Store owners can manage products
    Naive implementation - adds product to store
    """
    products[product_id] = {
        'id': product_id,
        'store_id': store_id,
        'name': name,
        'price': price,
        'inventory': inventory,
        'description': description,
        'created_at': datetime.now()
    }
    return products[product_id]

def update_inventory(product_id: str, quantity: int) -> Dict:
    """
    FR-2: Store owners can manage inventory
    Naive implementation - updates product inventory
    """
    product = products.get(product_id)
    if not product:
        raise ValueError("Product not found")

    product['inventory'] = quantity
    product['updated_at'] = datetime.now()
    return product

def browse_products(store_id: str) -> List[Dict]:
    """
    FR-3: Customers can browse products
    Naive implementation - returns all products for a store
    """
    store_products = []
    for product in products.values():
        if product['store_id'] == store_id and product['inventory'] > 0:
            store_products.append(product)
    return store_products

def create_order(order_id: str, store_id: str, customer_id: str,
                 items: List[Dict]) -> Dict:
    """
    FR-3: Customers can purchase products
    Naive implementation - creates order without inventory check
    """
    # Calculate total
    total = 0
    for item in items:
        product = products.get(item['product_id'])
        if product:
            total += product['price'] * item['quantity']
            # Decrease inventory (naive - no atomicity)
            product['inventory'] -= item['quantity']

    orders[order_id] = {
        'id': order_id,
        'store_id': store_id,
        'customer_id': customer_id,
        'items': items,
        'total': total,
        'status': 'pending',
        'created_at': datetime.now()
    }
    return orders[order_id]

def process_payment(payment_id: str, order_id: str, amount: float) -> Dict:
    """
    Helper: Process payment for order
    Naive implementation - records payment
    """
    payments[payment_id] = {
        'id': payment_id,
        'order_id': order_id,
        'amount': amount,
        'status': 'completed',
        'created_at': datetime.now()
    }

    # Update order status
    order = orders.get(order_id)
    if order:
        order['status'] = 'paid'

    return payments[payment_id]
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
        sizeGB: 15,
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
          shardKey: "store_id"
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
  explanation: "Reference Solution for Shopify - E-commerce Platform (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 5 instances handling 3600 read RPS (GET requests)\n- **Write API**: 3 instances handling 2100 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **15GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3240 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 79 shards (sharded by store_id).\n  • Read Capacity: 3600 RPS across 4 database instance(s)\n  • Write Capacity: 2100 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 80.0%, Write: 20.0%, Total: 4500 RPS)\n- **Read API (5 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (3 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 20.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 79 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on store_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
