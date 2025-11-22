/**
 * Generated Tiered Challenge: Stripe - Payment Processing
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const stripeChallenge: Challenge = {
  id: 'stripe',
  title: 'Stripe - Payment Processing',
  difficulty: 'advanced',
  description: `Design a payment processing platform like Stripe that:
- Merchants can accept credit card payments
- Platform processes payments securely
- Platform handles subscriptions and recurring billing
- Merchants can view transaction history and analytics

Learning Objectives (DDIA Ch. 7, 12):
1. Implement two-phase commit for distributed payments (DDIA Ch. 7)
   - Phase 1: Prepare (authorize card, lock balance)
   - Phase 2: Commit (capture payment, update balances)
   - Handle rollback on failure
2. Prevent duplicate charges with idempotency keys (DDIA Ch. 7)
   - Unique constraint on (merchant_id, idempotency_key)
   - Return existing payment on duplicate request
3. Use serializable isolation for write skew prevention (DDIA Ch. 7)
   - Prevent concurrent charges exceeding merchant balance
   - SELECT FOR UPDATE for pessimistic locking
4. Implement saga pattern for subscriptions (DDIA Ch. 7)
   - Compensating transactions for rollback
   - Eventual consistency across steps
5. Design event sourcing for complete audit trail (DDIA Ch. 12)
   - Immutable append-only payment event log
   - Derive current state by replaying events
   - Time-travel queries (state at any point in time)
6. Build compliance-ready audit logs (DDIA Ch. 12)
   - PCI-DSS, SOX, GDPR requirements
   - Retention policies (hot vs cold storage)
   - Crypto shredding for GDPR right to erasure
7. Implement snapshot + event log pattern (DDIA Ch. 12)
   - Periodic snapshots for performance
   - Event replay from snapshot forward
8. Handle event versioning (DDIA Ch. 12)
   - Schema evolution with backward compatibility
   - Multi-version event replay logic
9. Derive views from immutable event log (DDIA Ch. 12)
   - Current state tables, balances, analytics
   - Rebuild capability from source of truth`,
  
  requirements: {
  functional: [
    "Merchants can accept credit card payments",
    "Platform handles subscriptions and recurring billing",
    "Merchants can view transaction history",
    "Platform processes payments securely"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "No duplicate charges: 100% guarantee (DDIA Ch. 7: Unique index on idempotency_key)",
    "Payment atomicity: 2PC for authorize + capture (DDIA Ch. 7: Two-phase commit)",
    "Isolation level: Serializable for balance updates (DDIA Ch. 7: Prevent write skew)",
    "Write skew prevention: No overdraft (DDIA Ch. 7: SELECT FOR UPDATE)",
    "Distributed transaction: Payment + Merchant + Bank (DDIA Ch. 7: 2PC coordinator)",
    "Saga pattern: Subscription workflows with compensate (DDIA Ch. 7: Long-running)",
    "Exactly-once processing: Idempotency + deduplication (DDIA Ch. 7)",
    "Audit trail: Complete immutable event log (DDIA Ch. 12: Event sourcing)",
    "Webhook delivery: At-least-once guarantee (DDIA Ch. 7: Retry with backoff)",
    "Event append latency: < 10ms (DDIA Ch. 12: Append-only log writes)",
    "Time-travel queries: Query state at any timestamp (DDIA Ch. 12: Event replay)",
    "Snapshot creation: Every 1000 events (DDIA Ch. 12: Performance optimization)",
    "Event retention: 7 years in cold storage (DDIA Ch. 12: Compliance)",
    "Event versioning: Backward compatible schemas (DDIA Ch. 12: Schema evolution)",
    "GDPR compliance: Crypto shredding for PII (DDIA Ch. 12: Right to erasure)",
    "Audit query latency: < 500ms (DDIA Ch. 12: Indexed event log)"
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
      "name": "Merchants can accept credit card payments",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Merchants can accept credit card payments\" works correctly.",
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
      "name": "Platform handles subscriptions and recurring billi...",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Platform handles subscriptions and recurring billing\" works correctly.",
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
      "name": "Merchants can view transaction history",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Merchants can view transaction history\" works correctly. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
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
      "name": "Platform processes payments securely",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Platform processes payments securely\" works correctly.",
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
        "type": "write",
        "rps": 1000,
        "readRatio": 0.6
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 150,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-P2: Peak Hour Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "write",
        "rps": 2000,
        "readRatio": 0.6
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 225,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S1: Traffic Spike",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Unexpected event causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "write",
        "rps": 1500,
        "readRatio": 0.6
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-S2: Viral Growth",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Platform goes viral - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "write",
        "rps": 3000,
        "readRatio": 0.6
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 375,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-S4: Write Burst",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Write traffic bursts to 800 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 300ms. Without sharding/multi-leader: writes queue up, latency exceeds 750ms.",
      "traffic": {
        "type": "write",
        "rps": 2000,
        "readRatio": 0.3
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-R1: Database Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Primary database crashes at 30s into test. System must failover to replica to maintain\navailability. Without replication: complete outage. With replication: < 10s downtime.",
      "traffic": {
        "type": "write",
        "rps": 1000,
        "readRatio": 0.6
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
        "type": "write",
        "rps": 1000,
        "readRatio": 0.6
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 450,
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
    "label": "Stripe Engineering Blog",
    "url": "https://stripe.com/blog/engineering"
  },
  {
    "label": "Official Site",
    "url": "https://stripe.com/"
  },
  {
    "label": "Stripe API Design",
    "url": "https://stripe.com/blog/payment-api-design"
  }
],
  
  pythonTemplate: `from datetime import datetime, timedelta
from typing import List, Dict, Optional
import random
import string

# In-memory storage (naive implementation)
merchants = {}
customers = {}
payments = {}
subscriptions = {}
transactions = {}

def generate_payment_id() -> str:
    """Generate random payment ID"""
    return 'pay_' + ''.join(random.choices(string.ascii_letters + string.digits, k=16))

def process_payment(merchant_id: str, customer_id: str, amount: float,
                    currency: str = 'usd') -> Dict:
    """
    FR-1: Merchants can accept credit card payments
    Naive implementation - processes payment without actual card verification
    """
    payment_id = generate_payment_id()
    transaction_id = 'txn_' + ''.join(random.choices(string.ascii_letters + string.digits, k=16))

    # Create payment
    payments[payment_id] = {
        'id': payment_id,
        'merchant_id': merchant_id,
        'customer_id': customer_id,
        'amount': amount,
        'currency': currency,
        'status': 'succeeded',
        'created_at': datetime.now()
    }

    # Create transaction
    fee = amount * 0.029 + 0.30  # Stripe's standard fee
    transactions[transaction_id] = {
        'id': transaction_id,
        'payment_id': payment_id,
        'amount': amount,
        'fee': fee,
        'status': 'completed',
        'created_at': datetime.now()
    }

    return payments[payment_id]

def create_subscription(subscription_id: str, customer_id: str, plan_id: str,
                        billing_period_days: int = 30, amount: float = 9.99) -> Dict:
    """
    FR-2: Platform handles subscriptions and recurring billing
    Naive implementation - creates subscription record
    """
    subscriptions[subscription_id] = {
        'id': subscription_id,
        'customer_id': customer_id,
        'plan_id': plan_id,
        'amount': amount,
        'billing_period_days': billing_period_days,
        'status': 'active',
        'next_billing_date': datetime.now() + timedelta(days=billing_period_days),
        'created_at': datetime.now()
    }
    return subscriptions[subscription_id]

def cancel_subscription(subscription_id: str) -> Dict:
    """
    FR-2: Cancel recurring billing
    Naive implementation - updates subscription status
    """
    subscription = subscriptions.get(subscription_id)
    if not subscription:
        raise ValueError("Subscription not found")

    subscription['status'] = 'cancelled'
    subscription['cancelled_at'] = datetime.now()
    return subscription

def get_transaction_history(merchant_id: str, limit: int = 100) -> List[Dict]:
    """
    FR-3: Merchants can view transaction history
    Naive implementation - returns all transactions for merchant
    """
    merchant_transactions = []
    for transaction in transactions.values():
        payment_id = transaction['payment_id']
        payment = payments.get(payment_id)
        if payment and payment['merchant_id'] == merchant_id:
            merchant_transactions.append({
                **transaction,
                'payment': payment
            })

    # Sort by created_at (most recent first)
    merchant_transactions.sort(key=lambda x: x['created_at'], reverse=True)
    return merchant_transactions[:limit]

def check_payment_status(payment_id: str) -> str:
    """
    Helper: Check payment status
    Naive implementation - returns payment status
    """
    payment = payments.get(payment_id)
    if not payment:
        raise ValueError("Payment not found")
    return payment['status']
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
        instances: 5,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "5 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 140,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "140 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 360,
        strategy: "cache_aside",
        hitRatio: 0.9995,
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
          replicas: 10,
          mode: "async"
        },
        sharding: {
          enabled: true,
          shards: 140,
          shardKey: "merchant_id"
        },
        displayName: "PostgreSQL Master",
        subtitle: "Writes + 10 replicas (reads)"
      }
    },
    {
      type: "cdn",
      config: {
        enabled: true,
        edgeLocations: 150,
        cachePolicy: "aggressive",
        ttl: 300
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
      from: "load_balancer",
      to: "redis",
      type: "read",
      label: "Direct cache access (L6)"
    },
    {
      from: "app_server",
      to: "redis",
      type: "read",
      label: "Cache miss fallback"
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
  explanation: "Reference Solution for Stripe - Payment Processing (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 3 instances handling 1800 read RPS (GET requests)\n- **Write API**: 2 instances handling 1400 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **360GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~1620 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 140 shards (sharded by merchant_id).\n  • Read Capacity: 1800 RPS across 11 database instance(s)\n  • Write Capacity: 1400 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 60.0%, Write: 40.0%, Total: 3000 RPS)\n- **Read API (3 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (2 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 40.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 140 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on merchant_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
