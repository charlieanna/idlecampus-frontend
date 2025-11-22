/**
 * Generated Tiered Challenge: Edge API Gateway Platform (Cloudflare Workers)
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const edgeComputingChallenge: Challenge = {
  id: 'edge-computing',
  title: 'Edge API Gateway Platform (Cloudflare Workers)',
  difficulty: 'advanced',
  description: `Design an edge API gateway platform like Cloudflare Workers that runs serverless functions at 100+ global edge locations. The platform handles authentication, rate limiting, request routing, and A/B testing at the edge for sub-50ms latency.

**Real-world example:** Cloudflare Workers, AWS Lambda@Edge, Vercel Edge Functions

**Key Challenge:** Process requests at the edge (closest to users) instead of routing all traffic to origin servers, reducing latency from 200ms to <50ms.

- Authenticate API requests at edge (JWT validation)
- Route requests to nearest backend service based on geo-location
- Cache responses at edge for frequently accessed data
- Perform A/B testing and feature flags at edge
- Rate limit users at edge before hitting origin servers`,
  
  requirements: {
  functional: [
    "Authenticate API requests at edge using JWT tokens (validate without hitting origin)",
    "Route requests to nearest backend service based on user geo-location",
    "Cache API responses at edge (Edge KV) for frequently accessed data",
    "Perform A/B testing at edge (route 10% traffic to new feature)",
    "Rate limit users at edge (block abusive requests before origin)",
    "Transform requests/responses at edge (add headers, modify JSON)",
    "Handle edge-to-origin communication when cache misses occur"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Latency: P95 < 50ms for edge-processed requests (vs 200ms to origin)",
    "Request Rate: 50M requests/sec globally across 100+ edge locations",
    "Cache Hit Ratio: 80% of requests handled at edge (no origin call)",
    "Availability: 99.99% uptime (edge locations are distributed)",
    "Geographic Distribution: 100+ edge locations worldwide"
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
      "name": "Authenticate API requests at edge using JWT tokens...",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Authenticate API requests at edge using JWT tokens (validate without hitting origin)\" works correctly.",
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
      "name": "Route requests to nearest backend service based on...",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Route requests to nearest backend service based on user geo-location\" works correctly.",
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
      "name": "Cache API responses at edge (Edge KV) for frequent...",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Cache API responses at edge (Edge KV) for frequently accessed data\" works correctly.",
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
      "name": "Perform A/B testing at edge (route 10% traffic to ...",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Perform A/B testing at edge (route 10% traffic to new feature)\" works correctly.",
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
      "name": "Rate limit users at edge (block abusive requests b...",
      "type": "functional",
      "requirement": "FR-5",
      "description": "Verify \"Rate limit users at edge (block abusive requests before origin)\" works correctly.",
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
      "name": "Transform requests/responses at edge (add headers,...",
      "type": "functional",
      "requirement": "FR-6",
      "description": "Verify \"Transform requests/responses at edge (add headers, modify JSON)\" works correctly.",
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
      "name": "Handle edge-to-origin communication when cache mis...",
      "type": "functional",
      "requirement": "FR-7",
      "description": "Verify \"Handle edge-to-origin communication when cache misses occur\" works correctly.",
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
        "readRatio": 0.9
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
        "readRatio": 0.9
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
      "description": "Unexpected event causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.9
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
        "readRatio": 0.9
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
        "rps": 1000,
        "readRatio": 0.9
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
      "description": "Read traffic of 900 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.9
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.02
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
        "readRatio": 0.9
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
    }
  ],
  
  learningObjectives: [
  "Understand client-server architecture",
  "Learn database connectivity and data persistence",
  "Understand caching strategies for performance",
  "Learn horizontal scaling with load balancers",
  "Understand content delivery networks",
  "Design appropriate data models"
],
  
  referenceLinks: [],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict, Optional, Any

# In-memory storage (naive implementation)
data = {}
items = {}
cache = {}
item = {}

def deploy_functions_globally(**kwargs) -> Dict:
    """
    FR-1: Deploy functions globally
    Naive implementation - placeholder function
    """
    return {'status': 'success', 'data': kwargs}

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-2: Request routing to nearest edge
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-2: Request routing to nearest edge
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-3: Edge-to-origin communication
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-3: Edge-to-origin communication
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-4: Edge state management
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-4: Edge state management
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None

def cache_item(key: str, value: any, ttl: int = 3600) -> bool:
    """
    FR-5: A/B testing at edge
    Naive implementation - simple in-memory cache with TTL
    """
    cache[key] = {
        'value': value,
        'expires_at': datetime.now().timestamp() + ttl
    }
    return True

def get_from_cache(key: str) -> any:
    """
    FR-5: A/B testing at edge
    Naive implementation - retrieves from cache if not expired
    """
    if key in cache:
        item = cache[key]
        if datetime.now().timestamp() < item['expires_at']:
            return item['value']
        del cache[key]
    return None`,
  
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
        instances: 6,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "6 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 1,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "1 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 13,
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
          shards: 12,
          shardKey: "data_id"
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
  explanation: "Reference Solution for Edge API Gateway Platform (Cloudflare Workers) (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 4 instances handling 2700 read RPS (GET requests)\n- **Write API**: 1 instance handling 300 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **13GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~2430 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 12 shards (sharded by data_id).\n  • Read Capacity: 2700 RPS across 4 database instance(s)\n  • Write Capacity: 300 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 90.0%, Write: 10.0%, Total: 3000 RPS)\n- **Read API (4 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (1 instance)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 10.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 12 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on data_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
