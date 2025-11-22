/**
 * Generated Tiered Challenge: LinkedIn - Professional Network
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const linkedinChallenge: Challenge = {
  id: 'linkedin',
  title: 'LinkedIn - Professional Network',
  difficulty: 'beginner',
  description: `Design a professional networking platform like LinkedIn that:
- Users can create profiles with work experience
- Users can connect with other professionals
- Users can post updates and articles
- Users can search for jobs and people

Learning Objectives (DDIA Ch. 10):
1. Implement "People You May Know" via MapReduce (DDIA Ch. 10)
   - Graph analysis: Find 2nd-degree connections (friend-of-friend)
   - Count mutual connections and rank candidates
   - Enrich with shared skills and companies for scoring
2. Build batch job recommendations with collaborative filtering (DDIA Ch. 10)
   - MapReduce: Match user skills with job requirements
   - Content-based filtering: Skills similarity (Jaccard)
   - Hybrid scoring: Skills + location + seniority match
3. Compute skills co-occurrence analysis (DDIA Ch. 10)
   - MapReduce: Build skill graph "Python → Pandas, NumPy"
   - Recommend related skills to users
   - Identify emerging skill trends
4. Implement PageRank for influence scores (DDIA Ch. 10)
   - Iterative MapReduce (10 iterations for convergence)
   - Distribute scores across connection graph
   - Rank users by professional influence
5. Design ETL pipeline for data warehouse (DDIA Ch. 10)
   - Sort-merge join: Applications + Users + Companies
   - Star schema for OLAP analytics
   - Business intelligence queries on hiring trends`,
  
  requirements: {
  functional: [
    "Users can create profiles with work experience",
    "Users can connect with other professionals",
    "Users can post updates and articles",
    "Users can search for jobs and people"
  ],
  traffic: "50 RPS (30% reads, 70% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "PYMK batch: Process 800M users overnight (DDIA Ch. 10: MapReduce graph analysis for 2nd-degree)",
    "Job recommendations: Match 800M users to 20M jobs in < 4 hours (DDIA Ch. 10: Batch CF MapReduce)",
    "Skills co-occurrence: Build skill graph in < 2 hours (DDIA Ch. 10: MapReduce pairwise analysis)",
    "PageRank: Converge in 10 iterations, < 6 hours (DDIA Ch. 10: Iterative MapReduce)",
    "ETL throughput: Process 100GB/hour for data warehouse (DDIA Ch. 10: Sort-merge join)",
    "OLAP query: Analytics dashboard loads in < 3s (DDIA Ch. 10: Materialized views on star schema)",
    "Batch fault tolerance: Retry failed tasks 3× (DDIA Ch. 10: MapReduce task retry)",
    "Join efficiency: Broadcast join for tables < 5GB (DDIA Ch. 10: In-memory dimension tables)",
    "Incremental batch: Process only new connections daily (DDIA Ch. 10: Date-partitioned HDFS)"
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
      "name": "Users can create profiles with work experience",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can create profiles with work experience\" works correctly. Must use object storage (S3) for files, not database. Test flow: Client → App → Database.",
      "traffic": {
        "type": "write",
        "rps": 50,
        "readRatio": 0.3,
        "avgResponseSizeMB": 2
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users can connect with other professionals",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Users can connect with other professionals\" works correctly.",
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
      "name": "Users can post updates and articles",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users can post updates and articles\" works correctly. Test flow: Client → App → Database.",
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
      "name": "Users can search for jobs and people",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Users can search for jobs and people\" works correctly. Must have search index for efficient queries.",
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
        "readRatio": 0.85
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
      "description": "Traffic increases during peak hours (business hours 9am-5pm).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 2000,
        "readRatio": 0.85
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
        "rps": 1500,
        "readRatio": 0.85
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
        "rps": 3000,
        "readRatio": 0.85
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
        "rps": 1000,
        "readRatio": 0.85
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
      "description": "Read traffic of 850 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 1 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 500ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.85
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
      "description": "Write traffic bursts to 300 RPS, exceeding single-leader capacity (~100 RPS).\n**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.\n**How sharding/multi-leader solves it**:\n- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)\n- Sharding: Partition data across shards, each with independent write capacity\n**Pass criteria**: Handle write burst with latency < 500ms. Without sharding/multi-leader: writes queue up, latency exceeds 1250ms.",
      "traffic": {
        "type": "write",
        "rps": 2000,
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
        "rps": 1000,
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
        "rps": 1000,
        "readRatio": 0.85
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
    "label": "LinkedIn Engineering Blog",
    "url": "https://engineering.linkedin.com/"
  },
  {
    "label": "Official Site",
    "url": "https://www.linkedin.com/"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
profiles = {}
connections = {}
posts = {}
jobs = {}

def create_profile(user_id: str, name: str, headline: str, summary: str = "") -> Dict:
    """
    FR-1: Users can create profiles with work experience
    Naive implementation - stores profile in memory
    """
    profiles[user_id] = {
        'user_id': user_id,
        'name': name,
        'headline': headline,
        'summary': summary,
        'photo_url': None,
        'experience': [],  # Would contain work experience entries
        'education': [],   # Would contain education entries
        'skills': [],      # Would contain skills
        'created_at': datetime.now()
    }
    return profiles[user_id]

def add_work_experience(user_id: str, company: str, title: str, start_date: str, end_date: str = None) -> Dict:
    """
    FR-1: Add work experience to profile
    Naive implementation - appends to experience list
    """
    if user_id not in profiles:
        return None

    experience = {
        'company': company,
        'title': title,
        'start_date': start_date,
        'end_date': end_date,
        'current': end_date is None
    }
    profiles[user_id]['experience'].append(experience)
    return profiles[user_id]

def connect_with_professional(user_id_1: str, user_id_2: str) -> Dict:
    """
    FR-2: Users can connect with other professionals
    Naive implementation - creates connection immediately
    In real system, this would send connection request
    """
    connection_id = f"{user_id_1}_{user_id_2}"
    connections[connection_id] = {
        'user_id_1': user_id_1,
        'user_id_2': user_id_2,
        'status': 'connected',
        'created_at': datetime.now()
    }
    return connections[connection_id]

def create_post(post_id: str, user_id: str, content: str) -> Dict:
    """
    FR-3: Users can post updates
    Naive implementation - stores post in memory
    """
    posts[post_id] = {
        'id': post_id,
        'user_id': user_id,
        'content': content,
        'type': 'update',
        'likes': 0,
        'comments': [],
        'created_at': datetime.now()
    }
    return posts[post_id]

def create_article(post_id: str, user_id: str, title: str, content: str) -> Dict:
    """
    FR-3: Users can post articles
    Naive implementation - stores article as special post type
    """
    posts[post_id] = {
        'id': post_id,
        'user_id': user_id,
        'title': title,
        'content': content,
        'type': 'article',
        'likes': 0,
        'comments': [],
        'created_at': datetime.now()
    }
    return posts[post_id]

def search_jobs(query: str = None, location: str = None) -> List[Dict]:
    """
    FR-4: Users can search for jobs
    Naive implementation - simple substring match
    """
    results = []
    for job in jobs.values():
        if query and query.lower() not in job.get('title', '').lower():
            continue
        if location and location.lower() not in job.get('location', '').lower():
            continue
        results.append(job)
    return results

def search_people(query: str) -> List[Dict]:
    """
    FR-4: Users can search for people
    Naive implementation - simple substring match on name
    """
    results = []
    for profile in profiles.values():
        if query.lower() in profile.get('name', '').lower():
            results.append(profile)
    return results

def get_network_feed(user_id: str, limit: int = 20) -> List[Dict]:
    """
    Helper: Get posts from connections
    Naive implementation - returns posts from connections
    """
    # Get all connections
    connected_users = []
    for conn in connections.values():
        if conn['user_id_1'] == user_id:
            connected_users.append(conn['user_id_2'])
        elif conn['user_id_2'] == user_id:
            connected_users.append(conn['user_id_1'])

    # Get posts from connections
    feed = []
    for post in posts.values():
        if post['user_id'] in connected_users:
            feed.append(post)

    # Sort by created_at (most recent first)
    feed.sort(key=lambda x: x['created_at'], reverse=True)
    return feed[:limit]
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
        instances: 3,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "3 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 12,
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
  explanation: "Reference Solution for LinkedIn - Professional Network (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 4 instances handling 2550 read RPS (GET requests)\n- **Write API**: 2 instances handling 1400 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **12GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~2295 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 53 shards (sharded by user_id).\n  • Read Capacity: 2550 RPS across 4 database instance(s)\n  • Write Capacity: 1400 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 53 database shards. Each shard contains data for subset of users (e.g., user_id % 53 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 85.0%, Write: 15.0%, Total: 3000 RPS)\n- **Read API (4 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (2 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 15.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 53 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
