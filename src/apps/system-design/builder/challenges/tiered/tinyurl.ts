/**
 * Generated Tiered Challenge: TinyURL – URL Shortener
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const tinyurlChallenge: Challenge = {
  id: 'tinyurl',
  title: 'TinyURL – URL Shortener',
  difficulty: 'intermediate',
  description: `Shorten URLs and serve redirects at massive read volume. Use a CDN and app‑level cache to offload reads, a primary DB for writes, and replicas for reads. Keep p95 under 50ms and ensure the create path remains reliable under load.
- Given a long URL, generate a short URL
- Redirect users from short URL to original URL via HTTP 301/302
- Support custom aliases for premium users (optional)
- Provide analytics: click count, referrer, geographic data`,
  
  requirements: {
  functional: [
    "Given a long URL, generate a short URL",
    "Redirect users from short URL to original URL via HTTP 301/302",
    "Support custom aliases for premium users (optional)",
    "Provide analytics: click count, referrer, geographic data",
    "Allow URL expiration after configurable time (30/60/90 days)",
    "Bulk URL creation via API for enterprise customers",
    "QR code generation for each short URL",
    "Blacklist/spam detection for malicious URLs"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Latency: Request-response latency: P95 < 50ms for redirects, P99 < 100ms for redirects, P95 < 120ms for creates, P999 < 300ms for creates",
    "Request Rate: 1M requests/sec total (950k redirects/sec, 50k creates/sec). Read:write ratio 20:1. Peak traffic 2x normal load during business hours",
    "Dataset Size: 10B URLs stored over 5 years. Average URL length 100 chars. Total storage ~1TB. 100M daily active short URLs. P99 of URL length: 200 chars",
    "Availability: 99.99% uptime (52.6 minutes downtime/year). Graceful degradation for read path during DB issues. Write path must maintain consistency",
    "Durability: All URL mappings must be persistent and reconstructable. Zero data loss acceptable. Critical for business operations. Retention: 5 years default or until explicitly deleted"
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
      "name": "Given a long URL, generate a short URL",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Given a long URL, generate a short URL\" works correctly.",
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
      "name": "Redirect users from short URL to original URL via ...",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Redirect users from short URL to original URL via HTTP 301/302\" works correctly. Should cache reads to reduce database load. Test flow: Client → [Cache] → App → Database.",
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
      "name": "Support custom aliases for premium users (optional...",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Support custom aliases for premium users (optional)\" works correctly.",
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
      "name": "Provide analytics: click count, referrer, geograph...",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Provide analytics: click count, referrer, geographic data\" works correctly. Should process asynchronously using message queue.",
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
      "name": "Allow URL expiration after configurable time (30/6...",
      "type": "functional",
      "requirement": "FR-5",
      "description": "Verify \"Allow URL expiration after configurable time (30/60/90 days)\" works correctly.",
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
      "name": "Bulk URL creation via API for enterprise customers",
      "type": "functional",
      "requirement": "FR-6",
      "description": "Verify \"Bulk URL creation via API for enterprise customers\" works correctly.",
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
      "name": "QR code generation for each short URL",
      "type": "functional",
      "requirement": "FR-7",
      "description": "Verify \"QR code generation for each short URL\" works correctly.",
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
      "name": "Blacklist/spam detection for malicious URLs",
      "type": "functional",
      "requirement": "FR-8",
      "description": "Verify \"Blacklist/spam detection for malicious URLs\" works correctly.",
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
      "duration": 90,
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
      "name": "NFR-C1: Cost Guardrail",
      "type": "cost",
      "requirement": "NFR-C1",
      "description": "Meet the $2,500/month budget target while sustaining normal production traffic. Encourages right-sizing of cache, DB replicas, and CDN usage.",
      "traffic": {
        "type": "mixed",
        "rps": 1100,
        "readRatio": 0.9
      },
      "duration": 60,
      "passCriteria": {
        "maxMonthlyCost": 2500,
        "maxErrorRate": 0.05
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
  
  pythonTemplate: `# tinyurl.py
import hashlib
from typing import Optional

# You can create your own data structures here
# For example: url_map = {}

def shorten(url: str) -> Optional[str]:
    """
    Create a short code for the given URL.

    Args:
        url: The long URL to shorten

    Returns:
        A short code string, or None if invalid
    """
    # TODO: Implement this function
    # Hint: Use a dictionary to store URL mappings
    # Hint: Use hashlib to generate short codes
    pass

def expand(code: str) -> Optional[str]:
    """
    Retrieve the original URL from a short code.

    Args:
        code: The short code to expand

    Returns:
        The original URL, or None if not found
    """
    # TODO: Implement this function
    pass

# ===========================================
# OPTIONAL ADVANCED FEATURES (NOT TESTED)
# ===========================================
# In a real implementation, you might also include:
#
# def track_click(code: str, metadata: dict) -> bool:
#     '''Track analytics for each URL access'''
#     pass
#
# def create_custom_alias(url: str, alias: str) -> str:
#     '''Allow custom aliases for premium users'''
#     pass
#
# def set_expiration(code: str, days: int) -> bool:
#     '''Set URL expiration time'''
#     pass
#
# These features are part of the system design (canvas)
# but not required in this coding challenge.
# ===========================================`,
  
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
        instances: 3,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "3 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 2,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "2 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        instanceType: "cache.t3.small",
        strategy: "cache_aside",
        hitRatio: 0.95,
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
          shards: 3,
          shardKey: "data_id"
        },
        displayName: "PostgreSQL Master",
        subtitle: "Writes + 3 replicas, 3 shards"
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
  explanation: "Reference Solution for TinyURL – URL Shortener (CQRS + Cost Optimized):\n\n📊 Infrastructure Components:\n- **Read API**: 3 instances handling ~1000 read RPS (GET requests). Optimized for cost while maintaining performance.\n- **Write API**: 2 instances handling ~100 write RPS (POST/PUT/DELETE). Right-sized for write traffic patterns.\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **Redis Cache (cache.t3.small)**: Cost-optimized in-memory key-value store for hot data. Cache-aside pattern with ~95% hit ratio. Provides 1.4GB RAM and handles 25K RPS, reducing database load significantly while staying within budget (SDP - Caching).\n- **PostgreSQL Database**: Multi-leader configuration with 3 replicas and 3 shards. Provides both read and write scalability.\n  • Read Capacity: ~12,000 RPS across 12 database instances (4 leaders × 3 shards)\n  • Write Capacity: ~1,200 RPS distributed across shards (100 RPS × 4 leaders × 3 shards)\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n💰 Cost Optimization (Under $2,500/month):\n- **Right-sized Redis**: Using cache.t3.small ($25/month) provides sufficient capacity for the traffic while maintaining high cache hit ratio\n- **Minimal App Instances**: 4 read + 2 write instances provide sufficient capacity for 1100 RPS with headroom\n- **Efficient Database Setup**: Multi-leader with 3 replicas and 3 shards balances performance and cost\n- **Total Estimated Cost**: ~$2,300/month (under $2,500 budget)\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: ~90%, Write: ~10%)\n- **Read API (3 instances)**: Handles GET requests. Optimized for low latency:\n  • Cache-first strategy (95% hit ratio)\n  • Routes to read replicas to avoid write contention\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (2 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency:\n  • Routes writes to database shard leaders (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Cost-efficient while meeting performance targets\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized to handle traffic with 20% headroom without over-provisioning.\n- **Caching Strategy**: Redis cache with 95% hit ratio effectively reduces database load by ~90%.\n- **Replication Mode**: Multi-leader with 3 replicas (4 leaders total) and 3 shards provides both read and write scalability. Write capacity scales to 1,200 RPS (4 leaders × 100 RPS × 3 shards), sufficient for write-heavy test scenarios while maintaining cost efficiency.\n\n⚠️ Important Note:\nThis solution balances performance, availability, and cost. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components or configurations and still pass all tests!"
},
};
