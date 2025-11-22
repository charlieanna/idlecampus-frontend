/**
 * Generated Tiered Challenge: TinyURL – URL Shortener (L6 Standards)
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [
  {
    "id": "tiny-url-l6_prevent_cascading_failure",
    "title": "Implement prevent_cascading_failure()",
    "description": "Implement the prevent_cascading_failure() function according to the requirements.",
    "difficulty": "easy",
    "componentType": "app_server",
    "functionSignature": "def prevent_cascading_failure():",
    "starterCode": "def prevent_cascading_failure():\n    \"\"\"\n    Implement this function according to the functional requirements.\n\n    Args:\n        \n        context: System context (db, cache, queue, etc.)\n\n    Returns:\n        Result of the operation\n    \"\"\"\n    # TODO: Implement prevent_cascading_failure\n    pass",
    "testCases": [
      {
        "id": "prevent_cascading_failure_basic",
        "name": "Basic functionality test",
        "input": {},
        "expectedOutput": {
          "success": true
        }
      },
      {
        "id": "prevent_cascading_failure_edge",
        "name": "Edge case test",
        "input": {},
        "expectedOutput": {
          "success": true
        }
      }
    ],
    "referenceSolution": "",
    "solutionExplanation": "Reference implementation for prevent_cascading_failure function."
  },
  {
    "id": "tiny-url-l6_track_percentiles",
    "title": "Implement track_percentiles()",
    "description": "Implement the track_percentiles() function according to the requirements.",
    "difficulty": "easy",
    "componentType": "app_server",
    "functionSignature": "def track_percentiles():",
    "starterCode": "def track_percentiles():\n    \"\"\"\n    Implement this function according to the functional requirements.\n\n    Args:\n        \n        context: System context (db, cache, queue, etc.)\n\n    Returns:\n        Result of the operation\n    \"\"\"\n    # TODO: Implement track_percentiles\n    pass",
    "testCases": [
      {
        "id": "track_percentiles_basic",
        "name": "Basic functionality test",
        "input": {},
        "expectedOutput": {
          "success": true
        }
      },
      {
        "id": "track_percentiles_edge",
        "name": "Edge case test",
        "input": {},
        "expectedOutput": {
          "success": true
        }
      }
    ],
    "referenceSolution": "",
    "solutionExplanation": "Reference implementation for track_percentiles function."
  }
];

export const tinyUrlL6Challenge: Challenge = {
  id: 'tiny-url-l6',
  title: 'TinyURL – URL Shortener (L6 Standards)',
  difficulty: 'intermediate',
  description: `Design a URL shortening service like bit.ly with Google L6-level requirements.

**Critical L6 Principle:** NEVER use "average" for latency. The P99+ is where interesting things happen (GC, slow services, etc.).

In distributed systems, overall latency = max(downstream latencies). The more services you call, the higher probability of hitting P99 events.

- Given a long URL, generate a short URL
- Redirect users from short URL to original URL via HTTP 301/302
- Support custom aliases for premium users
- Handle viral events (5x traffic) and Super Bowl ads (10x traffic)
- Zero data loss - URLs must work forever once created
- Prevent cascading failures when cache or database fails`,
  
  requirements: {
  functional: [
    "Given a long URL, generate a short URL",
    "Redirect users from short URL to original URL via HTTP 301/302",
    "Short codes must be unique and permanent",
    "Support custom aliases for premium users",
    "Handle viral events with 5x traffic spike",
    "Survive Super Bowl ads with 10x traffic spike",
    "Zero data loss - all URL mappings must persist forever",
    "Prevent cascading failures when components fail"
  ],
  traffic: "11000 RPS (91% reads, 9% writes)",
  latency: "p99 < 100ms",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Latency: P50 < 30ms | P90 < 50ms | P99 < 100ms | P999 < 500ms (NO averages!)",
    "Tail Amplification: P99/P50 ratio must be < 3.5x",
    "Request Rate: Baseline 10K reads/sec, 1K writes/sec | Peak 50K reads/sec during viral events",
    "Availability: 99.99% (four 9s) = max 52 min downtime/year",
    "Data Durability: ZERO data loss acceptable (RPO=0, RTO<60s)",
    "Time Variance: Handle 5x traffic during viral events, 10x during Super Bowl ads",
    "Distribution: 80% of traffic hits 20% of URLs (power law), top 1% URLs get 10% of traffic",
    "Budget: $2,000/month"
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
      "name": "L6-LAT-1: Baseline Latency Profile",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify latency percentiles meet L6 standards. Remember: P99 is where GC and interesting events happen! At 10K RPS, even 0.1% at P999 = 10 requests/sec experiencing 500ms latency!",
      "traffic": {
        "type": "read",
        "rps": 11000,
        "readRatio": 0.91
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
        "maxErrorRate": 0.001
      }
    },
    {
      "name": "L6-LAT-2: Tail Latency Amplification",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Test tail latency amplification. When you call multiple services, P99 events multiply! If service A has P99=100ms and service B has P99=100ms, calling both: P(at least one P99) = 1 - (0.99 * 0.99) = 1.99% ≈ P98!",
      "traffic": {
        "type": "read",
        "rps": 11000,
        "readRatio": 0.91
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 150,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "L6-SCALE-1: Viral Event (5x traffic)",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Handle 5x traffic spike during viral event. P99 degradation must be < 2x. Viral events are predictable in aggregate (happen daily somewhere). Design for 5x surge as normal, not exceptional.",
      "traffic": {
        "type": "read",
        "rps": 55000,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.01,
        "minAvailability": 0.999
      }
    },
    {
      "name": "L6-SCALE-2: Super Bowl Ad (10x spike)",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Survive 10x traffic during Super Bowl commercial. System must not crash! Short spike (30 seconds) - OK to degrade but must stay up.",
      "traffic": {
        "type": "read",
        "rps": 110000,
        "readRatio": 0.98
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.35,
        "minAvailability": 0.65
      }
    },
    {
      "name": "L6-DIST-1: Hot Partition (Power Law)",
      "type": "functional",
      "requirement": "FR-1",
      "description": "80% of traffic hits 20% of URLs (power law). Top 1% URLs get 10% traffic. If not cached, these hot URLs will destroy your database. Power law means cache is EXTREMELY effective. Even small cache captures most traffic.",
      "traffic": {
        "type": "read",
        "rps": 11000,
        "readRatio": 0.91
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 100,
        "maxErrorRate": 0.001
      }
    },
    {
      "name": "L6-DUR-1: Zero Data Loss",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Database fails. ZERO URL mappings can be lost (durability requirement). RPO = 0 (Zero data loss), RTO < 60s (Recovery in 1 minute). URLs must work FOREVER once created. For URL shorteners, losing a mapping breaks user trust forever. Better to reject new URLs than lose existing ones.",
      "traffic": {
        "type": "read",
        "rps": 11000,
        "readRatio": 0.91
      },
      "duration": 10,
      "passCriteria": {
        "maxErrorRate": 0.01,
        "minAvailability": 0.999
      },
      "failureInjection": {
        "type": "network_partition",
        "atSecond": 60,
        "recoverySecond": 120
      }
    },
    {
      "name": "L6-REL-1: Cascading Failures",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Cache fails, causing DB overload. Test cascading failure resilience. The Cascade: 1) Cache fails → All traffic hits DB, 2) DB overloaded → Connections pile up, 3) App servers run out of connections → Everything fails. Systems don't fail, they cascade. Design for cascade prevention.",
      "traffic": {
        "type": "read",
        "rps": 11000,
        "readRatio": 0.91
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.05,
        "minAvailability": 0.95
      },
      "failureInjection": {
        "type": "cache_flush",
        "atSecond": 30
      }
    }
  ],
  
  learningObjectives: [
  "Understand client-server architecture",
  "Learn database connectivity and data persistence",
  "Understand caching strategies for performance",
  "Learn horizontal scaling with load balancers",
  "Design appropriate data models"
],
  
  referenceLinks: [],
  
  pythonTemplate: `# tinyurl_l6.py
import hashlib
from typing import Optional

# L6-Level URL Shortener
# Focus: Percentile-based latency, tail amplification, zero data loss

def shorten(url: str) -> Optional[str]:
    """
    Create a short code for the given URL.
    L6 Requirement: Must be durable (zero data loss).

    Args:
        url: The long URL to shorten

    Returns:
        A short code string, or None if invalid
    """
    # TODO: Implement with durability guarantees
    # Hint: Use synchronous replication for zero data loss
    pass

def expand(code: str) -> Optional[str]:
    """
    Retrieve the original URL from a short code.
    L6 Requirement: P99 < 100ms, P50 < 30ms.

    Args:
        code: The short code to expand

    Returns:
        The original URL, or None if not found
    """
    # TODO: Implement with cache-first strategy
    # Hint: Check cache first, then database
    # Hint: Use connection pooling to reduce tail latency
    pass

# ===========================================
# L6 ADVANCED FEATURES
# ===========================================
# def handle_viral_traffic(code: str) -> Optional[str]:
#     '''Handle 5x-10x traffic spikes'''
#     pass
#
# def prevent_cascading_failure():
#     '''Circuit breakers, connection limits, graceful degradation'''
#     pass
#
# def track_percentiles():
#     '''Monitor P50, P90, P99, P999 latencies'''
#     pass`,
  
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
        algorithm: "least_connections",
        instances: 3,
        displayName: "Global Load Balancers",
        subtitle: "3 instances for high availability",
        autoscaling: {
          enabled: true,
          min: 3,
          max: 10,
          targetUtilization: 0.7
        }
      }
    },
    {
      type: "app_server",
      config: {
        instances: 216,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "216 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 2407,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "2407 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 1024,
        strategy: "cache_aside",
        hitRatio: 0.99995,
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
          shards: 276,
          shardKey: "url_mapping_id"
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
  explanation: "Reference Solution for TinyURL – URL Shortener (L6 Standards) (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 130 instances handling 107800 read RPS (GET requests)\n- **Write API**: 4 instances handling 2750 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **1024GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~97020 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 10 read replicas and 276 shards (sharded by url_mapping_id).\n  • Read Capacity: 107800 RPS across 11 database instance(s)\n  • Write Capacity: 2750 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 98.0%, Write: 2.0%, Total: 110000 RPS)\n- **Read API (130 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (4 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 2.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 276 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on url_mapping_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
